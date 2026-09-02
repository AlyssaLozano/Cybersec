/**
 * Suricata: run signature rules against a saved capture.
 *
 * WHAT THIS IS FOR
 *
 * Detection Engineering is the seat whose output is a rule, and a rule you
 * cannot run is an opinion. This command closes that loop against the same
 * capture the Network Analyst material reads: a student writes a real Suricata
 * rule, runs it over real traffic, counts what it fired on, and finds out what
 * proportion of that was the thing they wanted.
 *
 * WHAT IS FAITHFUL
 *
 * The rule grammar is a genuine subset of Suricata's, not an invention:
 *
 *   action proto src_ip src_port -> dst_ip dst_port (msg:"..."; sid:N;)
 *
 * Actions, protocols, address and port specifications (including `any`,
 * negation with `!`, CIDR, lists and ranges), both direction operators, and the
 * options below all behave as they do in Suricata, so a rule written here is a
 * rule that runs there. Output is fast.log format, one line per alert, which is
 * what makes `| wc -l` an honest count of firings.
 *
 * WHAT IS NOT, AND WHY IT IS SAID OUT LOUD
 *
 * There is no stream reassembly and no application-layer parsing, because the
 * capture stores packet headers plus whatever cleartext a real sensor could
 * read off the wire -- a TLS server name, an SSH banner, an HTTP request line,
 * a DNS question. So `content` matches against that cleartext and nothing else.
 * On a real sensor `content` searches the full reassembled payload.
 *
 * That limit is deliberate rather than hidden: every `content` rule a student
 * writes here matches the same metadata a real rule would match on an encrypted
 * session, which is the case that actually matters on port 443, and the command
 * says so rather than letting somebody believe they have inspected TLS.
 */

import { fromLines, ok, readOrError, toolError, type CommandResult, type ExecContext } from '../context.js';
import { parseArgs } from '../parser.js';

// --- the capture -------------------------------------------------------------

interface Packet {
  time: string;
  seconds: number;
  proto: 'tcp' | 'udp' | 'icmp';
  src: string;
  sport: number;
  dst: string;
  dport: number;
  flags: string;
  len: number;
  info: string;
}

function toSeconds(stamp: string): number {
  const [hours, minutes, rest] = stamp.split(':');
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(rest);
}

function parsePackets(text: string): Packet[] {
  const packets: Packet[] = [];
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue;
    const field = line.split('|');
    if (field.length < 10) continue;
    const proto = field[1];
    if (proto !== 'tcp' && proto !== 'udp' && proto !== 'icmp') continue;
    packets.push({
      time: field[0]!,
      seconds: toSeconds(field[0]!),
      proto,
      src: field[2]!,
      sport: Number(field[3]),
      dst: field[4]!,
      dport: Number(field[5]),
      flags: field[6]!,
      len: Number(field[9]),
      info: field[10] ?? '',
    });
  }
  return packets;
}

// --- rules -------------------------------------------------------------------

type Direction = 'to' | 'both';

interface Threshold {
  kind: 'threshold' | 'limit' | 'both';
  track: 'by_src' | 'by_dst';
  count: number;
  seconds: number;
}

interface Rule {
  action: string;
  proto: string;
  src: string;
  sport: string;
  direction: Direction;
  dst: string;
  dport: string;
  msg: string;
  sid: number;
  rev: number;
  priority: number;
  classtype?: string;
  content: Array<{ text: string; negated: boolean; nocase: boolean }>;
  flow: string[];
  flags?: string;
  dsizeMin?: number;
  dsizeMax?: number;
  itype?: number;
  threshold?: Threshold;
  /** The line as written, for error messages that point at real text. */
  raw: string;
}

class RuleError extends Error {
  constructor(
    message: string,
    readonly line: number,
  ) {
    super(message);
  }
}

const ACTIONS = new Set(['alert', 'drop', 'reject', 'pass']);
const PROTOCOLS = new Set(['tcp', 'udp', 'icmp', 'ip']);

/** `HOME_NET` and friends, resolved the way suricata.yaml defines them. */
const VARIABLES: Record<string, string> = {
  $HOME_NET: '10.0.0.0/8',
  $EXTERNAL_NET: '!10.0.0.0/8',
  $HTTP_PORTS: '[80,8080,8443,9100]',
};

const HEADER = /^(\w+)\s+(\w+)\s+(\S+)\s+(\S+)\s+(->|<>)\s+(\S+)\s+(\S+)\s+\((.*)\)\s*$/;

function parseRules(text: string): Rule[] {
  const rules: Rule[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i]!.trim();
    if (raw === '' || raw.startsWith('#')) continue;

    const header = HEADER.exec(raw);
    if (!header) {
      throw new RuleError('rule does not parse as "action proto src sport -> dst dport (options)"', i + 1);
    }

    const [, action, proto, src, sport, arrow, dst, dport, optionText] = header;
    if (!ACTIONS.has(action!)) throw new RuleError(`unknown action "${action}"`, i + 1);
    if (!PROTOCOLS.has(proto!)) throw new RuleError(`unknown protocol "${proto}"`, i + 1);

    const rule: Rule = {
      action: action!,
      proto: proto!,
      src: src!,
      sport: sport!,
      direction: arrow === '<>' ? 'both' : 'to',
      dst: dst!,
      dport: dport!,
      msg: '',
      sid: 0,
      rev: 1,
      priority: 3,
      content: [],
      flow: [],
      raw,
    };

    let negateNext = false;
    for (const option of splitOptions(optionText!)) {
      const colon = option.indexOf(':');
      const key = (colon === -1 ? option : option.slice(0, colon)).trim();
      const value = colon === -1 ? '' : option.slice(colon + 1).trim();

      switch (key) {
        case 'msg':
          rule.msg = unquote(value);
          break;
        case 'sid':
          rule.sid = Number(value);
          break;
        case 'rev':
          rule.rev = Number(value);
          break;
        case 'priority':
          rule.priority = Number(value);
          break;
        case 'classtype':
          rule.classtype = value;
          break;
        case 'content': {
          const negated = value.startsWith('!');
          rule.content.push({
            text: unquote(negated ? value.slice(1).trim() : value),
            negated: negated || negateNext,
            nocase: false,
          });
          negateNext = false;
          break;
        }
        case 'nocase': {
          const last = rule.content[rule.content.length - 1];
          if (!last) throw new RuleError('nocase with no preceding content', i + 1);
          last.nocase = true;
          break;
        }
        case 'flow':
          rule.flow = value.split(',').map((part) => part.trim());
          break;
        case 'flags':
          rule.flags = value.split(',')[0]!.trim();
          break;
        case 'dsize': {
          const range = /^(\d+)?\s*(<>|<=|>=|<|>)?\s*(\d+)$/.exec(value.replace(/\s+/g, ''));
          if (!range) throw new RuleError(`dsize "${value}" does not parse`, i + 1);
          const [, low, operator, high] = range;
          if (operator === '<>') {
            rule.dsizeMin = Number(low);
            rule.dsizeMax = Number(high);
          } else if (operator === '>' ) {
            rule.dsizeMin = Number(high) + 1;
          } else if (operator === '>=') {
            rule.dsizeMin = Number(high);
          } else if (operator === '<') {
            rule.dsizeMax = Number(high) - 1;
          } else if (operator === '<=') {
            rule.dsizeMax = Number(high);
          } else {
            rule.dsizeMin = Number(high);
            rule.dsizeMax = Number(high);
          }
          break;
        }
        case 'itype':
          rule.itype = Number(value);
          break;
        case 'threshold': {
          const parts = Object.fromEntries(
            value.split(',').map((part) => part.trim().split(/\s+/) as [string, string]),
          );
          rule.threshold = {
            kind: (parts['type'] as Threshold['kind']) ?? 'threshold',
            track: (parts['track'] as Threshold['track']) ?? 'by_src',
            count: Number(parts['count'] ?? 1),
            seconds: Number(parts['seconds'] ?? 60),
          };
          break;
        }
        // Options a real rule carries that change nothing without payload
        // reassembly. Accepted silently so a copied rule still runs, rather
        // than rejected in a way that would teach the syntax is wrong.
        case 'depth':
        case 'offset':
        case 'distance':
        case 'within':
        case 'reference':
        case 'metadata':
        case 'target':
        case 'http_method':
        case 'http_uri':
          break;
        case '':
          break;
        default:
          throw new RuleError(`unknown option "${key}"`, i + 1);
      }
    }

    if (rule.sid === 0 || !Number.isFinite(rule.sid)) {
      throw new RuleError('rule has no valid sid, and Suricata refuses to load one without', i + 1);
    }
    rules.push(rule);
  }

  return rules;
}

/** Split an option body on semicolons that are not inside a quoted string. */
function splitOptions(text: string): string[] {
  const out: string[] = [];
  let current = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]!;
    if (char === '"') quoted = !quoted;
    if (char === ';' && !quoted) {
      out.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim() !== '') out.push(current.trim());
  return out.filter((entry) => entry !== '');
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

// --- matching ----------------------------------------------------------------

function inNetwork(address: string, spec: string): boolean {
  const slash = spec.indexOf('/');
  if (slash === -1) return address === spec;

  const bits = Number(spec.slice(slash + 1));
  const octets = spec.slice(0, slash).split('.');
  const keep = Math.floor(bits / 8);
  const prefix = octets.slice(0, keep).join('.');
  return keep === 0 || address === prefix || address.startsWith(prefix + '.');
}

/** Resolve one address term: `any`, a variable, a list, a negation, or a CIDR. */
function addressMatches(address: string, spec: string): boolean {
  const resolved = VARIABLES[spec] ?? spec;
  if (resolved === 'any') return true;

  if (resolved.startsWith('!')) return !addressMatches(address, resolved.slice(1));

  if (resolved.startsWith('[') && resolved.endsWith(']')) {
    return resolved
      .slice(1, -1)
      .split(',')
      .some((entry) => addressMatches(address, entry.trim()));
  }

  return inNetwork(address, resolved);
}

function portMatches(port: number, spec: string): boolean {
  const resolved = VARIABLES[spec] ?? spec;
  if (resolved === 'any') return true;

  if (resolved.startsWith('!')) return !portMatches(port, resolved.slice(1));

  if (resolved.startsWith('[') && resolved.endsWith(']')) {
    return resolved
      .slice(1, -1)
      .split(',')
      .some((entry) => portMatches(port, entry.trim()));
  }

  if (resolved.includes(':')) {
    const [low, high] = resolved.split(':');
    const from = low === '' ? 0 : Number(low);
    const to = high === '' ? 65535 : Number(high);
    return port >= from && port <= to;
  }

  return port === Number(resolved);
}

/**
 * Whether a packet is travelling client-to-server.
 *
 * Without stream tracking this is inferred: the end using the lower, well-known
 * port is the server. That is right for every session in the seeded capture and
 * it is an approximation, which is why `flow` is documented rather than sold as
 * full state tracking.
 */
function toServer(packet: Packet): boolean {
  return packet.dport < packet.sport;
}

function contentMatches(packet: Packet, rule: Rule): boolean {
  for (const item of rule.content) {
    const haystack = item.nocase ? packet.info.toLowerCase() : packet.info;
    const needle = item.nocase ? item.text.toLowerCase() : item.text;
    const found = haystack.includes(needle);
    if (item.negated ? found : !found) return false;
  }
  return true;
}

function headerMatches(packet: Packet, rule: Rule, swapped: boolean): boolean {
  const src = swapped ? packet.dst : packet.src;
  const sport = swapped ? packet.dport : packet.sport;
  const dst = swapped ? packet.src : packet.dst;
  const dport = swapped ? packet.sport : packet.dport;

  return (
    addressMatches(src, rule.src) &&
    portMatches(sport, rule.sport) &&
    addressMatches(dst, rule.dst) &&
    portMatches(dport, rule.dport)
  );
}

function matches(packet: Packet, rule: Rule): boolean {
  if (rule.proto !== 'ip' && packet.proto !== rule.proto) return false;

  const forward = headerMatches(packet, rule, false);
  const backward = rule.direction === 'both' && headerMatches(packet, rule, true);
  if (!forward && !backward) return false;

  if (rule.flags !== undefined) {
    // Suricata flag letters against the tcpdump-style letters the capture holds.
    const wanted = rule.flags.replace(/\+|\*|!/g, '');
    const present = packet.flags;
    const map: Record<string, string> = { S: 'S', F: 'F', R: 'R', P: 'P', A: '.' };
    for (const letter of wanted) {
      const symbol = map[letter];
      if (symbol === undefined) return false;
      if (symbol === '.') {
        // An ACK is present on every flag string that is not a bare SYN.
        if (present === 'S') return false;
      } else if (!present.includes(symbol)) {
        return false;
      }
    }
    // A bare `flags:S` means SYN and nothing else, which is how a scan rule is
    // written and the difference between matching 255 packets and matching 510.
    if (!rule.flags.includes('+') && wanted === 'S' && present !== 'S') return false;
  }

  if (rule.flow.length > 0) {
    for (const term of rule.flow) {
      if (term === 'to_server' && !toServer(packet)) return false;
      if (term === 'from_server' && toServer(packet)) return false;
      if (term === 'to_client' && toServer(packet)) return false;
      if (term === 'from_client' && !toServer(packet)) return false;
      // `established` and `stateless` need stream state this engine does not
      // keep. Accepted so real rules run, and they narrow nothing.
    }
  }

  if (rule.dsizeMin !== undefined && packet.len < rule.dsizeMin) return false;
  if (rule.dsizeMax !== undefined && packet.len > rule.dsizeMax) return false;

  if (rule.itype !== undefined) {
    const type = packet.flags === 'echo-request' ? 8 : 0;
    if (type !== rule.itype) return false;
  }

  if (rule.content.length > 0 && !contentMatches(packet, rule)) return false;

  return true;
}

/**
 * Apply a rule's threshold, which is the difference between a rule that reports
 * an event and one that reports a campaign.
 *
 * `threshold` alerts once per window only after `count` matches from the same
 * tracked address; `limit` alerts at most `count` times per window. Both exist
 * to stop one noisy source producing one alert per packet, which is the single
 * most common reason a signature is unusable in production.
 */
function applyThreshold(hits: Packet[], rule: Rule): Packet[] {
  const threshold = rule.threshold;
  if (!threshold) return hits;

  const seen = new Map<string, { windowStart: number; count: number; emitted: number }>();
  const out: Packet[] = [];

  for (const packet of hits) {
    const key = threshold.track === 'by_dst' ? packet.dst : packet.src;
    const state = seen.get(key);

    if (!state || packet.seconds - state.windowStart >= threshold.seconds) {
      seen.set(key, { windowStart: packet.seconds, count: 1, emitted: 0 });
    } else {
      state.count += 1;
    }

    const current = seen.get(key)!;

    if (threshold.kind === 'limit') {
      if (current.emitted < threshold.count) {
        current.emitted += 1;
        out.push(packet);
      }
    } else if (current.count >= threshold.count && current.emitted === 0) {
      current.emitted += 1;
      out.push(packet);
    }
  }

  return out;
}

// --- the command -------------------------------------------------------------

export function suricata(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv, { valueFlags: ['r', 'S', 'c', 'l', 'k'] });

  if (args.flags.has('V') || args.longFlags.has('version')) {
    return ok('This is Suricata version 7.0.2 RELEASE (simulated)\n');
  }

  const capturePath = args.values.get('r');
  if (capturePath === undefined) {
    return toolError(
      'suricata',
      'no capture given. This host cannot read from an interface; run against a saved capture with -r FILE.',
    );
  }

  const rulesPath = args.values.get('S');
  if (rulesPath === undefined) {
    return toolError('suricata', 'no rule file given. Use -S FILE to load a ruleset.');
  }

  const capture = readOrError(ctx.vfs.resolvePath(ctx.cwd, capturePath), ctx, 'suricata');
  if ('error' in capture) return capture.error;

  const ruleFile = readOrError(ctx.vfs.resolvePath(ctx.cwd, rulesPath), ctx, 'suricata');
  if ('error' in ruleFile) return ruleFile.error;

  const packets = parsePackets(capture.text);
  if (packets.length === 0) {
    return toolError('suricata', `${capturePath}: not a capture this build can read`);
  }

  let rules: Rule[];
  try {
    rules = parseRules(ruleFile.text);
  } catch (error) {
    if (error instanceof RuleError) {
      // Suricata refuses to start on a bad rule rather than skipping it, and so
      // does this: a rule that silently did not load is the worst outcome
      // available, because the ruleset looks fine and the traffic goes unseen.
      return toolError('suricata', `error parsing signature at line ${error.line}: ${error.message}`);
    }
    throw error;
  }

  if (rules.length === 0) {
    return toolError('suricata', `${rulesPath}: no rules loaded`);
  }

  const duplicate = rules.find((rule, index) => rules.findIndex((other) => other.sid === rule.sid) !== index);
  if (duplicate) {
    return toolError('suricata', `duplicate signature id ${duplicate.sid}`);
  }

  // Alerts come out in capture order, which is what fast.log does and what lets
  // a student read the timing of a campaign straight off the output.
  const alerts: Array<{ packet: Packet; rule: Rule }> = [];
  for (const rule of rules) {
    if (rule.action === 'pass') continue;
    const hits = packets.filter((packet) => matches(packet, rule));
    for (const packet of applyThreshold(hits, rule)) alerts.push({ packet, rule });
  }
  alerts.sort((a, b) => a.packet.seconds - b.packet.seconds);

  const lines = alerts.map(({ packet, rule }) => {
    const classtype = rule.classtype ?? 'not-suspicious';
    const arrow = `${packet.src}:${packet.sport} -> ${packet.dst}:${packet.dport}`;
    const endpoints = packet.proto === 'icmp' ? `${packet.src} -> ${packet.dst}` : arrow;
    return (
      `08/15/2026-${packet.time}  [**] [1:${rule.sid}:${rule.rev}] ${rule.msg} [**] ` +
      `[Classification: ${classtype}] [Priority: ${rule.priority}] {${packet.proto.toUpperCase()}} ${endpoints}`
    );
  });

  return ok(fromLines(lines));
}
