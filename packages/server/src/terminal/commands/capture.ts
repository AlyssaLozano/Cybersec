/**
 * Packet capture reading: `tcpdump`.
 *
 * WHY THERE IS NO LIVE CAPTURE
 *
 * `tcpdump` with no `-r` sniffs an interface. Here it refuses, and says so.
 * The simulator has no network to sniff, and a command that pretended to
 * listen would be the one place in this engine where a student could not tell
 * simulation from the real thing. Every capture is a file on the seeded
 * filesystem, which is also how an analyst usually meets one: somebody hands
 * you a pcap.
 *
 * WHY THE FILE IS NOT ALREADY TCPDUMP OUTPUT
 *
 * A real pcap is binary and `cat` on one produces noise. Storing rendered
 * tcpdump lines instead would let a student answer every filtering exercise
 * with `grep`, which is precisely the skill the filter is meant to replace. So
 * captures are stored as pipe-separated records and only this module renders
 * them. `cat` shows the records, `tcpdump -r` shows packets, and the difference
 * between the two is visible, which is the honest version of binary.
 *
 * The filter grammar below is a real subset of pcap-filter(7), not an
 * invention: anything this accepts behaves the way it would on a live host, so
 * what a student learns here transfers.
 */

import { fromLines, ok, readOrError, toolError, type CommandResult, type ExecContext } from '../context.js';
import { parseArgs } from '../parser.js';

/** One packet, as stored in a capture file. */
interface Packet {
  time: string;
  proto: 'tcp' | 'udp' | 'icmp';
  src: string;
  sport: number;
  dst: string;
  dport: number;
  flags: string;
  seq: number;
  win: number;
  len: number;
  info: string;
}

/**
 * Port-to-service names tcpdump prints when it is NOT given `-n`.
 *
 * Deliberately short. The lesson `-n` teaches is that a name in the output is
 * the tool's guess about a number, and a guess can be wrong: anything on 443
 * prints as `https` here whether or not it is HTTPS, which is exactly the trap
 * the command-and-control traffic in the seeded capture is built to spring.
 */
const SERVICES: Record<number, string> = {
  21: 'ftp',
  22: 'ssh',
  23: 'telnet',
  25: 'smtp',
  53: 'domain',
  80: 'http',
  110: 'pop3',
  135: 'epmap',
  443: 'https',
  445: 'microsoft-ds',
  1433: 'ms-sql-s',
  3306: 'mysql',
  3389: 'ms-wbt-server',
  5432: 'postgresql',
  5900: 'vnc',
  8080: 'http-alt',
  8443: 'https-alt',
  9100: 'jetdirect',
};

function parseRecord(line: string): Packet | null {
  const parts = line.split('|');
  if (parts.length < 10) return null;
  const proto = parts[1];
  if (proto !== 'tcp' && proto !== 'udp' && proto !== 'icmp') return null;
  return {
    time: parts[0]!,
    proto,
    src: parts[2]!,
    sport: Number(parts[3]),
    dst: parts[4]!,
    dport: Number(parts[5]),
    flags: parts[6]!,
    seq: Number(parts[7]),
    win: Number(parts[8]),
    len: Number(parts[9]),
    info: parts[10] ?? '',
  };
}

// --- filter expressions ------------------------------------------------------

type Predicate = (packet: Packet) => boolean;

class FilterError extends Error {}

/**
 * A recursive-descent parser for the filter subset.
 *
 * Precedence follows pcap-filter(7): `not` binds tightest, then `and`, then
 * `or`. Getting that wrong would make `host A and port 22 or port 443` quietly
 * mean something else, and a student debugging their filter against a tool that
 * lies about precedence learns nothing they can carry to a real capture.
 */
class FilterParser {
  private readonly tokens: string[];
  private position = 0;

  constructor(expression: string) {
    this.tokens = expression
      .replace(/([()])/g, ' $1 ')
      .split(/\s+/)
      .filter(Boolean);
  }

  parse(): Predicate {
    const predicate = this.parseOr();
    if (this.position < this.tokens.length) {
      throw new FilterError(`syntax error near '${this.tokens[this.position]}'`);
    }
    return predicate;
  }

  private peek(): string | undefined {
    return this.tokens[this.position];
  }

  private take(): string {
    const token = this.tokens[this.position];
    if (token === undefined) throw new FilterError('unexpected end of filter expression');
    this.position += 1;
    return token;
  }

  private parseOr(): Predicate {
    let left = this.parseAnd();
    while (this.peek() === 'or' || this.peek() === '||') {
      this.take();
      const right = this.parseAnd();
      const previous = left;
      left = (packet) => previous(packet) || right(packet);
    }
    return left;
  }

  private parseAnd(): Predicate {
    let left = this.parseNot();
    while (this.peek() === 'and' || this.peek() === '&&') {
      this.take();
      const right = this.parseNot();
      const previous = left;
      left = (packet) => previous(packet) && right(packet);
    }
    return left;
  }

  private parseNot(): Predicate {
    if (this.peek() === 'not' || this.peek() === '!') {
      this.take();
      const inner = this.parseNot();
      return (packet) => !inner(packet);
    }
    return this.parsePrimitive();
  }

  private parsePrimitive(): Predicate {
    if (this.peek() === '(') {
      this.take();
      const inner = this.parseOr();
      if (this.take() !== ')') throw new FilterError("expected ')'");
      return inner;
    }

    // A leading direction qualifier applies to whatever type follows it.
    let direction: 'src' | 'dst' | 'either' = 'either';
    if (this.peek() === 'src' || this.peek() === 'dst') {
      direction = this.take() as 'src' | 'dst';
    }

    const token = this.take();

    if (token === 'tcp' || token === 'udp' || token === 'icmp') {
      return (packet) => packet.proto === token;
    }

    if (token === 'host') return this.hostPredicate(this.take(), direction);
    if (token === 'port') return this.portPredicate(this.take(), direction);
    if (token === 'net') return this.netPredicate(this.take(), direction);

    // `src 10.0.0.1` with no `host` keyword is legal pcap and very common.
    if (direction !== 'either' && /^\d+\.\d+\.\d+\.\d+$/.test(token)) {
      return this.hostPredicate(token, direction);
    }

    throw new FilterError(`syntax error near '${token}'`);
  }

  private hostPredicate(address: string, direction: 'src' | 'dst' | 'either'): Predicate {
    if (direction === 'src') return (packet) => packet.src === address;
    if (direction === 'dst') return (packet) => packet.dst === address;
    return (packet) => packet.src === address || packet.dst === address;
  }

  private portPredicate(value: string, direction: 'src' | 'dst' | 'either'): Predicate {
    const port = Number(value);
    if (!Number.isInteger(port)) throw new FilterError(`'${value}' is not a port number`);
    if (direction === 'src') return (packet) => packet.sport === port;
    if (direction === 'dst') return (packet) => packet.dport === port;
    return (packet) => packet.sport === port || packet.dport === port;
  }

  /** Supports both `net 10.20.6` and `net 10.20.6.0/24`. */
  private netPredicate(value: string, direction: 'src' | 'dst' | 'either'): Predicate {
    let prefix: string;
    const slash = value.indexOf('/');
    if (slash === -1) {
      prefix = value.endsWith('.') ? value : `${value}.`;
    } else {
      const bits = Number(value.slice(slash + 1));
      if (![8, 16, 24].includes(bits)) {
        throw new FilterError('only /8, /16 and /24 masks are supported');
      }
      prefix = `${value.slice(0, slash).split('.').slice(0, bits / 8).join('.')}.`;
    }
    const matches = (address: string) => address.startsWith(prefix);
    if (direction === 'src') return (packet) => matches(packet.src);
    if (direction === 'dst') return (packet) => matches(packet.dst);
    return (packet) => matches(packet.src) || matches(packet.dst);
  }
}

// --- rendering ---------------------------------------------------------------

function endpoint(address: string, port: number, numeric: boolean, ctx: ExecContext): string {
  const host = numeric ? address : (ctx.machine.reverseDns[address] ?? address);
  const service = numeric ? String(port) : (SERVICES[port] ?? String(port));
  return `${host}.${service}`;
}

function renderPacket(packet: Packet, numeric: boolean, quiet: boolean, showTime: boolean, ctx: ExecContext): string {
  const stamp = showTime ? `${packet.time} ` : '';

  if (packet.proto === 'icmp') {
    const host = (address: string) => (numeric ? address : (ctx.machine.reverseDns[address] ?? address));
    const kind = packet.flags === 'echo-request' ? 'echo request' : 'echo reply';
    return `${stamp}IP ${host(packet.src)} > ${host(packet.dst)}: ICMP ${kind}, ${packet.info}, length ${packet.len}`;
  }

  const from = endpoint(packet.src, packet.sport, numeric, ctx);
  const to = endpoint(packet.dst, packet.dport, numeric, ctx);

  if (packet.proto === 'udp') {
    if (quiet || packet.info === '') {
      return `${stamp}IP ${from} > ${to}: UDP, length ${packet.len}`;
    }
    return `${stamp}IP ${from} > ${to}: ${packet.info} (${packet.len})`;
  }

  if (quiet) {
    return `${stamp}IP ${from} > ${to}: tcp ${packet.len}`;
  }
  return `${stamp}IP ${from} > ${to}: Flags [${packet.flags}], seq ${packet.seq}, win ${packet.win}, length ${packet.len}`;
}

// --- the command -------------------------------------------------------------

export function tcpdump(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv, { valueFlags: ['r', 'c'] });

  const file = args.values.get('r');
  if (file === undefined) {
    return toolError(
      'tcpdump',
      'no capture file given. This host cannot sniff an interface; read a saved capture with -r FILE.',
    );
  }

  const path = ctx.vfs.resolvePath(ctx.cwd, file);
  const read = readOrError(path, ctx, 'tcpdump');
  if ('error' in read) return read.error;

  const packets = read.text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map(parseRecord)
    .filter((packet): packet is Packet => packet !== null);

  if (packets.length === 0) {
    return toolError('tcpdump', `${file}: unknown file format`);
  }

  const expression = args.positionals.join(' ').trim();
  let matches: Predicate = () => true;
  if (expression !== '') {
    try {
      matches = new FilterParser(expression).parse();
    } catch (error) {
      const detail = error instanceof FilterError ? error.message : 'syntax error';
      return toolError('tcpdump', `${detail} in filter expression: ${expression}`);
    }
  }

  const numeric = args.flags.has('n');
  const quiet = args.flags.has('q');
  const showTime = !args.flags.has('t');

  const limitText = args.values.get('c');
  const limit = limitText === undefined ? Infinity : Number(limitText);
  if (!Number.isFinite(limit) && limitText !== undefined) {
    return toolError('tcpdump', `invalid packet count ${limitText}`);
  }

  const lines: string[] = [];
  for (const packet of packets) {
    if (!matches(packet)) continue;
    lines.push(renderPacket(packet, numeric, quiet, showTime, ctx));
    if (lines.length >= limit) break;
  }

  // Real tcpdump writes its "N packets captured" summary to stderr, and nothing
  // at all when reading a file. Keeping stdout to one line per packet is what
  // lets an exercise grade `tcpdump ... | wc -l` as a number.
  return ok(fromLines(lines));
}
