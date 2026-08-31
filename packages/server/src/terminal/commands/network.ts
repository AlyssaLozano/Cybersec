/**
 * Network inspection commands.
 *
 * Nothing here touches a real network. `ping` and `dig` answer from the frozen
 * MachineState, and every address they can return is an RFC 5737 documentation
 * address. That is a hard requirement, not a shortcut: a training tool must
 * never become a way to probe real hosts from the server it runs on.
 */

import { fromLines, ok, toolError, type CommandResult, type ExecContext } from '../context.js';
import { parseArgs } from '../parser.js';
import type { VSocket } from '../../vfs/types.js';

// --- interfaces --------------------------------------------------------------

export function ip(argv: string[], ctx: ExecContext): CommandResult {
  const object = argv[1];
  const verb = argv[2];

  if (object === 'addr' || object === 'a' || object === 'address') {
    const lines: string[] = [];
    ctx.machine.interfaces.forEach((iface, index) => {
      const flags = iface.name === 'lo' ? 'LOOPBACK,UP,LOWER_UP' : 'BROADCAST,MULTICAST,UP,LOWER_UP';
      lines.push(`${index + 1}: ${iface.name}: <${flags}> mtu ${iface.mtu} qdisc noqueue state ${iface.up ? 'UP' : 'DOWN'} group default qlen 1000`);
      lines.push(`    link/${iface.name === 'lo' ? 'loopback' : 'ether'} ${iface.mac} brd ff:ff:ff:ff:ff:ff`);
      if (iface.ipv4) {
        const prefix = iface.name === 'lo' ? 8 : 24;
        lines.push(`    inet ${iface.ipv4}/${prefix} brd 10.20.6.255 scope ${iface.name === 'lo' ? 'host' : 'global'} ${iface.name}`);
        lines.push('       valid_lft forever preferred_lft forever');
      }
      if (iface.ipv6) {
        lines.push(`    inet6 ${iface.ipv6}/64 scope ${iface.name === 'lo' ? 'host' : 'link'}`);
        lines.push('       valid_lft forever preferred_lft forever');
      }
    });
    return ok(fromLines(lines));
  }

  if (object === 'link') {
    const lines: string[] = [];
    ctx.machine.interfaces.forEach((iface, index) => {
      lines.push(`${index + 1}: ${iface.name}: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu ${iface.mtu} qdisc noqueue state ${iface.up ? 'UP' : 'DOWN'} mode DEFAULT group default qlen 1000`);
      lines.push(`    link/${iface.name === 'lo' ? 'loopback' : 'ether'} ${iface.mac} brd ff:ff:ff:ff:ff:ff`);
    });
    return ok(fromLines(lines));
  }

  if (object === 'route' || (object === 'r' && verb === undefined)) {
    return ok(
      fromLines([
        'default via 10.20.6.1 dev eth0 proto static metric 100',
        '10.20.6.0/24 dev eth0 proto kernel scope link src 10.20.6.40 metric 100',
      ]),
    );
  }

  return toolError('ip', `Object "${object ?? ''}" is unknown, try "ip help".`);
}

export function ifconfig(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const wanted = args.positionals[0];

  const interfaces = wanted
    ? ctx.machine.interfaces.filter((iface) => iface.name === wanted)
    : ctx.machine.interfaces;

  if (wanted && interfaces.length === 0) {
    return toolError('ifconfig', `${wanted}: error fetching interface information: Device not found`);
  }

  const lines: string[] = [];
  for (const iface of interfaces) {
    const flags = iface.name === 'lo' ? '73<UP,LOOPBACK,RUNNING>' : '4163<UP,BROADCAST,RUNNING,MULTICAST>';
    lines.push(`${iface.name}: flags=${flags}  mtu ${iface.mtu}`);
    if (iface.ipv4) {
      const mask = iface.netmask ?? '255.255.255.0';
      lines.push(`        inet ${iface.ipv4}  netmask ${mask}${iface.name === 'lo' ? '' : '  broadcast 10.20.6.255'}`);
    }
    if (iface.ipv6) lines.push(`        inet6 ${iface.ipv6}  prefixlen 64  scopeid 0x20<link>`);
    if (iface.name !== 'lo') lines.push(`        ether ${iface.mac}  txqueuelen 1000  (Ethernet)`);
    else lines.push('        loop  txqueuelen 1000  (Local Loopback)');
    lines.push(`        RX packets ${iface.rxPackets}  bytes ${iface.rxBytes} (${(iface.rxBytes / 1e9).toFixed(1)} GB)`);
    lines.push('        RX errors 0  dropped 0  overruns 0  frame 0');
    lines.push(`        TX packets ${iface.txPackets}  bytes ${iface.txBytes} (${(iface.txBytes / 1e9).toFixed(1)} GB)`);
    lines.push('        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0');
    lines.push('');
  }
  return ok(lines.join('\n'));
}

// --- sockets -----------------------------------------------------------------

/** Formats an address:port pair the way netstat does. */
function endpoint(address: string, port: number, resolve: boolean, ctx: ExecContext): string {
  const host = resolve ? (resolveAddress(address, ctx) ?? address) : address;
  if (port === 0) return `${host}:*`;
  return `${host}:${port}`;
}

function selectSockets(argv: string[], ctx: ExecContext): { sockets: VSocket[]; listening: boolean } {
  const args = parseArgs(argv);
  const tcpOnly = args.flags.has('t');
  const udpOnly = args.flags.has('u');
  const listening = args.flags.has('l');

  let sockets = ctx.machine.sockets;
  if (tcpOnly && !udpOnly) sockets = sockets.filter((s) => s.proto === 'tcp' || s.proto === 'tcp6');
  if (udpOnly && !tcpOnly) sockets = sockets.filter((s) => s.proto === 'udp');
  if (listening) sockets = sockets.filter((s) => s.state === 'LISTEN' || s.proto === 'udp');
  // Without -a or -l, netstat shows only connected sockets.
  else if (!args.flags.has('a')) sockets = sockets.filter((s) => s.state !== 'LISTEN');

  return { sockets, listening };
}

export function netstat(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const showProgram = args.flags.has('p');
  const numeric = args.flags.has('n');
  const { sockets } = selectSockets(argv, ctx);

  const lines = [
    'Active Internet connections (' + (args.flags.has('l') ? 'only servers' : 'w/o servers') + ')',
    'Proto Recv-Q Send-Q Local Address           Foreign Address         State      ' + (showProgram ? '  PID/Program name' : ''),
  ];

  for (const socket of sockets) {
    const local = endpoint(socket.localAddress, socket.localPort, !numeric, ctx);
    const remote = endpoint(socket.remoteAddress, socket.remotePort, !numeric, ctx);
    lines.push(
      [
        socket.proto.padEnd(5),
        '     0',
        '     0',
        local.padEnd(23),
        remote.padEnd(23),
        socket.state.padEnd(11),
        showProgram ? `${socket.pid ?? '-'}/${socket.program}` : '',
      ]
        .join(' ')
        .trimEnd(),
    );
  }
  return ok(fromLines(lines));
}

export function ss(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const showProgram = args.flags.has('p');
  const numeric = args.flags.has('n');
  const { sockets } = selectSockets(argv, ctx);

  const lines = ['State      Recv-Q Send-Q Local Address:Port    Peer Address:Port   ' + (showProgram ? ' Process' : '')];
  for (const socket of sockets) {
    // ss abbreviates ESTABLISHED to ESTAB, which trips people up when they grep.
    const state = socket.state === 'ESTABLISHED' ? 'ESTAB' : socket.state === '' ? 'UNCONN' : socket.state;
    lines.push(
      [
        state.padEnd(10),
        '     0',
        '     0',
        endpoint(socket.localAddress, socket.localPort, !numeric, ctx).padEnd(21),
        endpoint(socket.remoteAddress, socket.remotePort, !numeric, ctx).padEnd(19),
        showProgram && socket.pid ? `users:(("${socket.program}",pid=${socket.pid},fd=3))` : '',
      ]
        .join(' ')
        .trimEnd(),
    );
  }
  return ok(fromLines(lines));
}

// --- name resolution and reachability ---------------------------------------

/**
 * Look a name up the way a real host does: /etc/hosts first, then DNS.
 *
 * The ordering is not a detail. /etc/hosts overrides DNS on every real system,
 * which is exactly why an attacker who can write one line to it can silently
 * redirect a name with nothing appearing in any DNS log. The Networking package
 * teaches that, so the simulator has to behave that way or it teaches a lie --
 * previously rmg-mail-01 and rmg-lab-if-01 were listed in /etc/hosts and were
 * still unresolvable, which is the opposite of how a host works.
 */
function resolveName(name: string, ctx: ExecContext): string | null {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(name)) return name;

  const wanted = name.toLowerCase();

  const hosts = ctx.vfs.stat('/etc/hosts')?.content ?? '';
  for (const line of hosts.split('\n')) {
    const withoutComment = line.split('#')[0] ?? '';
    const [address, ...names] = withoutComment.trim().split(/\s+/);
    if (!address || names.length === 0) continue;
    // IPv6 entries are listed but the simulator only models IPv4 lookups.
    if (address.includes(':')) continue;
    if (names.some((entry) => entry.toLowerCase() === wanted)) return address;
  }

  return ctx.machine.dns[wanted] ?? null;
}

/**
 * Reverse lookup, checking /etc/hosts before the resolver for the same reason.
 */
function resolveAddress(address: string, ctx: ExecContext): string | null {
  const hosts = ctx.vfs.stat('/etc/hosts')?.content ?? '';
  for (const line of hosts.split('\n')) {
    const withoutComment = line.split('#')[0] ?? '';
    const [entryAddress, ...names] = withoutComment.trim().split(/\s+/);
    if (!entryAddress || names.length === 0) continue;
    if (entryAddress === address) {
      // Prefer the fully qualified name when the entry lists several.
      return names.find((entry) => entry.includes('.')) ?? names[0]!;
    }
  }
  return ctx.machine.reverseDns[address] ?? null;
}

export function ping(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv, { valueFlags: ['c', 'i', 'W'] });
  const target = args.positionals[0];
  if (!target) return toolError('ping', 'usage error: Destination address required');

  const countText = args.values.get('c');
  if (countText === undefined) {
    // Unbounded ping would hang a web terminal forever.
    return toolError(
      'ping',
      'this simulator requires a packet count so the command terminates. Try: ping -c 3 ' + target,
    );
  }
  const count = Math.min(Number(countText) || 1, 10);

  const address = resolveName(target, ctx);
  if (!address) {
    return { stdout: '', stderr: `ping: ${target}: Name or service not known\n`, exitCode: 2 };
  }

  // Unreachable by design: the attacker's infrastructure does not answer, which
  // is realistic and keeps students from concluding that a silent host is proof
  // of anything.
  const reachable = !address.startsWith('203.0.113.') && address !== '198.51.100.60';

  const lines = [`PING ${target} (${address}) 56(84) bytes of data.`];
  const times: number[] = [];
  for (let sequence = 1; sequence <= count; sequence += 1) {
    if (!reachable) continue;
    // Deterministic latency, derived from the address so it is stable per host.
    const base = address.startsWith('10.20.') ? 0.4 : 14.2;
    const time = Number((base + (sequence * 7 + address.length) % 5 * 0.31).toFixed(3));
    times.push(time);
    lines.push(`64 bytes from ${address}: icmp_seq=${sequence} ttl=${address.startsWith('10.20.') ? 64 : 55} time=${time.toFixed(1)} ms`);
  }

  lines.push('', `--- ${target} ping statistics ---`);
  const received = times.length;
  const loss = Math.round(((count - received) / count) * 100);
  lines.push(`${count} packets transmitted, ${received} received, ${loss}% packet loss, time ${count * 1000 - 1}ms`);
  if (received > 0) {
    const min = Math.min(...times);
    const max = Math.max(...times);
    const avg = times.reduce((sum, value) => sum + value, 0) / received;
    lines.push(`rtt min/avg/max/mdev = ${min.toFixed(3)}/${avg.toFixed(3)}/${max.toFixed(3)}/0.412 ms`);
  }

  return { stdout: fromLines(lines), stderr: '', exitCode: received > 0 ? 0 : 1 };
}

export function dig(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const reverse = args.flags.has('x');

  /*
   * dig control arguments start with '+' and can appear anywhere, including
   * before the name. Taking positionals[0] blindly meant `dig +short name`
   * looked up a host called "+short" and silently returned nothing -- and
   * +short is how most people write it.
   */
  const controls = args.positionals.filter((argument) => argument.startsWith('+'));
  const target = args.positionals.find((argument) => !argument.startsWith('+'));
  if (!target) return toolError('dig', 'no name to look up');

  const shortOnly = args.longFlags.has('short') || controls.includes('+short');

  if (reverse) {
    const name = resolveAddress(target, ctx);
    if (shortOnly) return ok(name ? name + '.\n' : '');
    const lines = [
      '',
      `; <<>> DiG 9.18.18-0ubuntu0.22.04.2-Ubuntu <<>> -x ${target}`,
      ';; global options: +cmd',
      ';; Got answer:',
      `;; ->>HEADER<<- opcode: QUERY, status: ${name ? 'NOERROR' : 'NXDOMAIN'}, id: ${41000 + target.length}`,
      '',
      ';; QUESTION SECTION:',
      `;${target.split('.').reverse().join('.')}.in-addr.arpa.\tIN\tPTR`,
      '',
    ];
    if (name) {
      lines.push(';; ANSWER SECTION:', `${target.split('.').reverse().join('.')}.in-addr.arpa. 3600 IN PTR ${name}.`, '');
    }
    lines.push(';; SERVER: 10.20.1.10#53(10.20.1.10)', '');
    return ok(fromLines(lines));
  }

  const address = resolveName(target, ctx);
  if (shortOnly) return ok(address ? address + '\n' : '');

  const lines = [
    '',
    `; <<>> DiG 9.18.18-0ubuntu0.22.04.2-Ubuntu <<>> ${target}`,
    ';; global options: +cmd',
    ';; Got answer:',
    `;; ->>HEADER<<- opcode: QUERY, status: ${address ? 'NOERROR' : 'NXDOMAIN'}, id: ${52000 + target.length}`,
    ';; flags: qr rd ra; QUERY: 1, ANSWER: ' + (address ? '1' : '0') + ', AUTHORITY: 0, ADDITIONAL: 1',
    '',
    ';; QUESTION SECTION:',
    `;${target}.\t\t\tIN\tA`,
    '',
  ];
  if (address) {
    lines.push(';; ANSWER SECTION:', `${target}.\t\t300\tIN\tA\t${address}`, '');
  }
  lines.push(';; Query time: 4 msec', ';; SERVER: 10.20.1.10#53(10.20.1.10) (UDP)', '');
  return ok(fromLines(lines));
}

export function nslookup(argv: string[], ctx: ExecContext): CommandResult {
  const target = argv[1];
  if (!target) return toolError('nslookup', 'no name to look up');

  const isAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(target);
  const lines = ['Server:\t\t10.20.1.10', 'Address:\t10.20.1.10#53', ''];

  if (isAddress) {
    const name = resolveAddress(target, ctx);
    if (!name) {
      return {
        stdout: fromLines([...lines, `** server can't find ${target}: NXDOMAIN`]),
        stderr: '',
        exitCode: 1,
      };
    }
    lines.push('Non-authoritative answer:', `${target.split('.').reverse().join('.')}.in-addr.arpa\tname = ${name}.`, '');
    return ok(fromLines(lines));
  }

  const address = resolveName(target, ctx);
  if (!address) {
    return {
      stdout: fromLines([...lines, `** server can't find ${target}: NXDOMAIN`]),
      stderr: '',
      exitCode: 1,
    };
  }
  lines.push('Non-authoritative answer:', `Name:\t${target}`, `Address: ${address}`, '');
  return ok(fromLines(lines));
}

export function host(argv: string[], ctx: ExecContext): CommandResult {
  const target = argv[1];
  if (!target) return toolError('host', 'usage: host [-v] hostname');

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(target)) {
    const name = resolveAddress(target, ctx);
    return name
      ? ok(`${target.split('.').reverse().join('.')}.in-addr.arpa domain name pointer ${name}.\n`)
      : { stdout: '', stderr: `Host ${target} not found: 3(NXDOMAIN)\n`, exitCode: 1 };
  }

  const address = resolveName(target, ctx);
  return address
    ? ok(`${target} has address ${address}\n`)
    : { stdout: '', stderr: `Host ${target} not found: 3(NXDOMAIN)\n`, exitCode: 1 };
}
