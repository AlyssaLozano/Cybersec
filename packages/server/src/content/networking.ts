/**
 * Networking Basics -- 25 exercises across 5 modules.
 *
 * WHY THIS PACKAGE EXISTS, AND WHY NOW
 *
 * The capability baseline identified this as the single biggest blocker to SOC
 * readiness. Three core SOC capabilities -- reading a netstat table, telling
 * internal addresses from external ones, and knowing what common ports mean --
 * all sit behind this foundation, and none of them were teachable. A learner
 * finishing Linux Fundamentals and Log Analysis hit a wall at 44% readiness largely because of it.
 *
 * IDS
 *
 * This package is 'networking' and its exercise ids are net.x.x. It was briefly
 * package '4' -- the source specification called it 3, which was already taken,
 * which is the collision that ended package numbering here altogether.
 *
 * THE ARC
 *
 * Module net.1 asks "what is this machine". net.2 asks "what is it talking to", and
 * ends by isolating the exfiltration connection that has been sitting in the
 * simulated host since Linux Fundamentals without anybody having the tools to see it.
 * net.3 covers name resolution, including the reverse lookup that turns the
 * noisiest address in auth.log into an obviously-internal monitoring box.
 *
 * As in Linux Fundamentals and Log Analysis, every expected count is verified against the real
 * engine output rather than assumed.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

import { MACHINE } from '../vfs/machine.js';
import { NETWORKING_PRACTICE } from './networking-practice.js';
import { PACKET_MODULES, PACKET_OUTCOMES } from './networking-packets.js';

const HOST_IP = '10.20.6.40';
const GATEWAY = '10.20.6.1';
const EXFIL = '198.51.100.60';

// --- expected answers, derived from the simulated machine --------------------
//
// Modules 4.4 to 4.8 grade counts of sockets. Reading them off MACHINE rather
// than typing them in means adding a service to the host cannot leave an
// exercise asserting a number that stopped being true.

const tcpSockets = MACHINE.sockets.filter((socket) => socket.proto === 'tcp');

/** TCP services accepting connections, IPv4 only. */
const LISTENING_TCP = tcpSockets.filter((socket) => socket.state === 'LISTEN');

/** Listening on every interface, and therefore reachable from off the host. */
const EXPOSED_TCP = LISTENING_TCP.filter((socket) => socket.localAddress === '0.0.0.0');

/** Listening only on loopback, and therefore reachable only from the host itself. */
const LOOPBACK_TCP = LISTENING_TCP.filter((socket) => socket.localAddress.startsWith('127.'));

const ESTABLISHED_TCP = tcpSockets.filter((socket) => socket.state === 'ESTABLISHED');

/** Established sessions that are not the host talking to itself. */
const ESTABLISHED_OFF_HOST = ESTABLISHED_TCP.filter(
  (socket) => !socket.remoteAddress.startsWith('127.'),
);

/**
 * The one established session whose peer is outside RFC 1918 space.
 *
 * Derived rather than named, so that the exercise which asks a student to find
 * the odd connection cannot silently stop having an answer.
 */
const EXFIL_SOCKET = ESTABLISHED_TCP.find(
  (socket) => !socket.remoteAddress.startsWith('10.') && !socket.remoteAddress.startsWith('127.'),
)!;

const EXFIL_PROCESS = MACHINE.processes.find((process) => process.pid === EXFIL_SOCKET.pid)!;

// --- Module 4.1: what this machine is ----------------------------------------

const MODULE_4_1: Exercise[] = [
  {
    id: 'net.1.1',
    moduleId: '4.1',
    packageId: 'networking',
    order: 1,
    title: 'Find out what address this machine has',
    kind: 'terminal',
    goal: 'Learn the command that answers "which machine am I on, as far as the network is concerned".',
    prompt:
      'Before you can judge whether a connection is coming from inside or outside the company, you need to know where you are. Show this host\'s network interfaces and their addresses.',
    teach: {
      concept:
        'Every machine on a network has at least two interfaces: a loopback (lo, always 127.0.0.1, which only talks to itself) and one or more real ones. `ip addr show` lists them along with the addresses assigned to each. The line that matters is the one starting `inet` under a real interface, that is the address other machines use to reach you.',
      syntax: 'ip addr show',
      examples: [
        { command: 'ip link show', explains: 'Interfaces only, without the addresses. Useful when you just want to know what hardware exists.' },
        { command: 'ifconfig eth0', explains: 'The older tool, still installed nearly everywhere, showing one interface in detail.' },
      ],
      flags: [
        { flag: 'addr', means: 'Show addresses. Can be shortened to `ip a`.' },
        { flag: 'link', means: 'Show the interfaces themselves without addresses.' },
      ],
    },
    hints: [
      'The modern command starts with two letters: `ip`.',
      'You want the addresses, so the next word is `addr`.',
      'Write `ip addr show`, or just `ip addr`, which does the same thing.',
    ],
    solution: 'ip addr show',
    expectedOutput: `Two interfaces: lo with 127.0.0.1, and eth0 with ${HOST_IP}.`,
    checks: [
      { type: 'output-contains', text: HOST_IP, hint: 'The output should include this host\'s real address on eth0.' },
      { type: 'output-contains', text: 'eth0', hint: 'You should see the eth0 interface listed.' },
      { type: 'output-contains', text: '127.0.0.1', hint: 'The loopback interface should be listed too.' },
    ],
    debrief:
      `This host is ${HOST_IP}. Everything in 10.x.x.x is private address space, which means it is inside the company network and not directly reachable from the internet. Hold onto that: for the rest of this package, "does this address start with 10." is the fastest question you can ask about a connection.`,
    practice: NETWORKING_PRACTICE['net.1.1'] ?? [],
  },
  {
    id: 'net.1.2',
    moduleId: '4.1',
    packageId: 'networking',
    order: 2,
    title: 'List the interfaces on their own',
    kind: 'terminal',
    goal: 'Get a compact view of what network hardware exists.',
    prompt: 'Show just the network interfaces on this host, without their IP addresses.',
    teach: {
      concept:
        '`ip` is one command with several objects: `ip addr` for addresses, `ip link` for the interfaces themselves, `ip route` for where traffic goes. Asking for `link` gives you a much shorter answer when all you want to know is what exists. On a compromised host this is worth checking: an interface you do not recognise can mean a VPN or tunnel somebody added.',
      syntax: 'ip link show',
      examples: [
        { command: 'ip addr show', explains: 'The fuller view, with addresses attached.' },
        { command: 'ifconfig -a', explains: 'The older equivalent, including interfaces that are down.' },
      ],
    },
    hints: [
      'Same command as before, different object.',
      'Instead of `addr`, ask for `link`.',
    ],
    solution: 'ip link show',
    expectedOutput: 'Four lines: lo and eth0, each with a line describing its hardware address.',
    checks: [
      { type: 'output-line-count', count: 4, hint: 'Two interfaces, two lines each: four lines in total.' },
      { type: 'output-contains', text: 'eth0', hint: 'eth0 should be listed.' },
      { type: 'output-excludes', text: 'inet ', hint: 'This view should NOT include IP addresses. Use `link` rather than `addr`.' },
    ],
    debrief:
      'Two interfaces is what a normal server looks like. A host with a tun0 or a second unexplained interface is worth asking about, that is often how somebody keeps a route in.',
    practice: NETWORKING_PRACTICE['net.1.2'] ?? [],
  },
  {
    id: 'net.1.3',
    moduleId: '4.1',
    packageId: 'networking',
    order: 3,
    title: 'Test whether another host is reachable',
    kind: 'terminal',
    goal: 'Confirm a host is up and measure how far away it is.',
    prompt:
      'The backup server is rmg-backup-01.ridgelinemed.example. Check whether this host can reach it, sending exactly 3 packets.',
    teach: {
      concept:
        '`ping` sends a small packet and asks for it back. It answers two questions at once: does the name resolve to an address, and does that address answer. The round-trip time tells you roughly how far away the host is: under a millisecond usually means the same network, tens of milliseconds means somewhere else entirely.',
      syntax: 'ping -c COUNT HOST',
      examples: [
        { command: 'ping -c 3 rmg-web-01.ridgelinemed.example', explains: 'Three packets to the other web server.' },
        { command: 'ping -c 1 10.20.1.10', explains: 'A single packet to an address, skipping name resolution entirely.' },
      ],
      flags: [
        { flag: '-c COUNT', means: 'Stop after COUNT packets. Without it, ping runs until you interrupt it, and in this simulator it is required, so the command terminates.' },
      ],
    },
    hints: [
      'The command is four letters and takes the hostname as its argument.',
      'You must limit the packet count, or it would never stop.',
      'Use -c 3 before the hostname.',
    ],
    solution: 'ping -c 3 rmg-backup-01.ridgelinemed.example',
    expectedOutput: 'Three replies from 10.20.9.15, then a summary reporting 0% packet loss.',
    checks: [
      { type: 'command-has-flag', command: 'ping', flags: ['c'], hint: 'Use -c to limit the number of packets, or the command would never finish.' },
      { type: 'output-contains', text: '10.20.9.15', hint: 'The hostname should resolve to the backup server\'s address.' },
      { type: 'output-contains', text: '3 received', hint: 'All three packets should come back.' },
    ],
    debrief:
      'A reply proves the host is up and reachable. Silence proves almost nothing: plenty of hosts are configured not to answer ping at all, and a firewall may be dropping it. "It does not ping" is not evidence a machine is off.',
    practice: NETWORKING_PRACTICE['net.1.3'] ?? [],
  },
  {
    id: 'net.1.4',
    moduleId: '4.1',
    packageId: 'networking',
    order: 4,
    title: 'See where traffic goes when it leaves',
    kind: 'terminal',
    goal: 'Read a routing table and identify the default gateway.',
    prompt: 'Show this host\'s routing table.',
    teach: {
      concept:
        'When a machine sends a packet it consults its routing table: "is this destination on a network I am directly attached to, or does it go to the gateway?" The `default` route is the catch-all: anything not local goes there. Knowing the gateway matters in an investigation, because traffic leaving the company passes through it, and that is where it can be blocked.',
      syntax: 'ip route',
      examples: [
        { command: 'ip route show', explains: 'The same thing written out in full.' },
        { command: 'cat /etc/resolv.conf', explains: 'A related question: not where traffic goes, but who resolves names.' },
      ],
    },
    hints: [
      'Same `ip` command, a third object.',
      'The object you want is `route`.',
    ],
    solution: 'ip route',
    expectedOutput: `Two routes: a default via ${GATEWAY}, and the directly attached 10.20.6.0/24 network.`,
    checks: [
      { type: 'output-line-count', count: 2, hint: 'There are exactly two routes on this host.' },
      { type: 'output-contains', text: 'default via', hint: 'The catch-all route should be listed first.' },
      { type: 'output-contains', text: GATEWAY, hint: 'The default gateway address should appear.' },
    ],
    debrief:
      `Everything this server sends outside 10.20.6.0/24 goes through ${GATEWAY}. When an incident response plan says "block the traffic", the gateway is usually where that happens.`,
    practice: NETWORKING_PRACTICE['net.1.4'] ?? [],
  },
  {
    id: 'net.1.5',
    moduleId: '4.1',
    packageId: 'networking',
    order: 5,
    title: 'Read one interface in detail',
    kind: 'terminal',
    goal: 'Use the older ifconfig tool, which you will still meet on real systems.',
    prompt: 'Show detailed configuration and traffic counters for the eth0 interface only.',
    teach: {
      concept:
        '`ifconfig` predates `ip` and is deprecated, but it is installed on a great many systems and plenty of documentation still uses it. It shows the netmask in dotted form (255.255.255.0) rather than as a prefix (/24), and it includes packet and byte counters, which are useful when you want to know whether an interface is actually carrying traffic.',
      syntax: 'ifconfig [INTERFACE]',
      examples: [
        { command: 'ifconfig', explains: 'Every interface that is up.' },
        { command: 'ifconfig lo', explains: 'Just the loopback, for comparison.' },
      ],
    },
    hints: [
      'The older command is eight letters, and takes the interface name as an argument.',
      'Name the interface you want after the command: eth0.',
    ],
    solution: 'ifconfig eth0',
    expectedOutput: `eth0 with inet ${HOST_IP}, a netmask of 255.255.255.0, and RX/TX counters.`,
    checks: [
      { type: 'output-contains', text: 'netmask 255.255.255.0', hint: 'ifconfig shows the netmask in dotted form.' },
      { type: 'output-contains', text: HOST_IP, hint: 'The interface address should be shown.' },
      { type: 'output-excludes', text: 'lo:', hint: 'Name eth0 specifically so only that interface is shown.' },
    ],
    debrief:
      'A netmask of 255.255.255.0 is the same thing as /24: the first three numbers identify the network, the last identifies the host. So 10.20.6.40 and 10.20.6.99 are neighbours, and 10.20.4.31 is not: it is one router hop away.',
    practice: NETWORKING_PRACTICE['net.1.5'] ?? [],
  },
];

// --- Module 4.2: what it is talking to ---------------------------------------

const MODULE_4_2: Exercise[] = [
  {
    id: 'net.2.1',
    moduleId: '4.2',
    packageId: 'networking',
    order: 1,
    title: 'See every connection at once',
    kind: 'terminal',
    goal: 'Get the full picture before narrowing it.',
    prompt: 'Show all network connections and listening sockets on this host, without resolving names to hostnames.',
    teach: {
      concept:
        'A socket is one end of a network conversation. `netstat -an` shows all of them: services waiting for connections (LISTEN) and conversations actually in progress (ESTABLISHED). The `-n` matters more than it looks, without it, netstat tries to turn every address into a hostname, which is slow and can hide the address you needed to see.',
      syntax: 'netstat [-a] [-n] [-t] [-u] [-l] [-p]',
      examples: [
        { command: 'ss -an', explains: 'The modern replacement. Same idea, slightly different formatting.' },
        { command: 'netstat -tn', explains: 'TCP connections only, without the listening sockets.' },
      ],
      flags: [
        { flag: '-a', means: 'All sockets, listening and connected.' },
        { flag: '-n', means: 'Numeric: do not resolve addresses to names.' },
        { flag: '-t', means: 'TCP only.' },
        { flag: '-u', means: 'UDP only.' },
        { flag: '-l', means: 'Listening sockets only.' },
        { flag: '-p', means: 'Show which process owns each socket.' },
      ],
    },
    hints: [
      'The command is `netstat`, and you need two flags.',
      'One asks for everything, the other asks for numbers instead of names.',
      'Combine them as -an.',
    ],
    solution: 'netstat -an',
    expectedOutput: 'Sixteen lines: two headers, then every listening and established socket.',
    checks: [
      { type: 'command-has-flag', command: 'netstat', flags: ['n'], hint: 'Add -n so addresses stay numeric.' },
      { type: 'output-contains', text: 'LISTEN', hint: 'Listening sockets should be included, that is what -a adds.' },
      { type: 'output-contains', text: 'ESTABLISHED', hint: 'Active connections should be included too.' },
    ],
    debrief:
      'That is a lot at once, which is the point: this is the raw material. The next four exercises are all about cutting it down to the handful of lines that answer a specific question.',
    practice: NETWORKING_PRACTICE['net.2.1'] ?? [],
  },
  {
    id: 'net.2.2',
    moduleId: '4.2',
    packageId: 'networking',
    order: 2,
    title: 'Find what this host is offering',
    kind: 'terminal',
    goal: 'List only the services accepting connections.',
    prompt: 'Show only the TCP sockets that are listening for incoming connections, keeping addresses numeric.',
    teach: {
      concept:
        'A listening socket is a door. Anything in that list is a way into this machine, so it is one of the first things to check on a host you have been handed. Read the Local Address column carefully: 0.0.0.0 means "any interface", so the whole network can reach it. 127.0.0.1 means loopback only, that service can be reached from this host and nowhere else.',
      syntax: 'netstat -tln',
      examples: [
        { command: 'ss -tln', explains: 'The modern equivalent, same three flags.' },
        { command: 'netstat -uln', explains: 'The same question for UDP instead of TCP.' },
      ],
    },
    hints: [
      'Three flags this time: TCP only, listening only, numeric.',
      'They can be grouped behind one dash.',
      'Use netstat -tln.',
    ],
    solution: 'netstat -tln',
    expectedOutput: 'Nine lines: two headers and seven listening sockets.',
    checks: [
      { type: 'command-has-flag', command: 'netstat', flags: ['l'], hint: 'Add -l to restrict this to listening sockets.' },
      { type: 'command-has-flag', command: 'netstat', flags: ['t'], hint: 'Add -t to restrict this to TCP.' },
      { type: 'output-line-count', count: 9, hint: 'Seven listening sockets plus two header lines.' },
      { type: 'output-excludes', text: 'ESTABLISHED', hint: 'Only listening sockets should appear: add -l.' },
    ],
    debrief:
      'Four doors are open to the network: 22 (SSH), 80 and 443 (the web server), and that is it. Postgres on 5432 and the application on 8080 are bound to 127.0.0.1, so they are not reachable from outside this machine. That distinction is the difference between a database being exposed to the internet and being safe.',
    practice: NETWORKING_PRACTICE['net.2.2'] ?? [],
  },
  {
    id: 'net.2.3',
    moduleId: '4.2',
    packageId: 'networking',
    order: 3,
    title: 'Find which program owns a port',
    kind: 'terminal',
    goal: 'Connect a port number to the process behind it.',
    prompt: 'Something is listening on port 22. Show which program it is, using a pipe to filter the output.',
    teach: {
      concept:
        'A port number on its own tells you what a service is *supposed* to be. Port 22 is conventionally SSH, but conventions are not enforcement, and an attacker can run anything on any port. Adding `-p` shows the process actually holding the socket, which is what turns "port 22 is open" into "sshd is listening on port 22".',
      syntax: 'netstat -tlnp | grep :PORT',
      examples: [
        { command: 'netstat -tlnp | grep :443', explains: 'The same question about the HTTPS port.' },
        { command: 'ss -tlnp | grep :80', explains: 'The modern tool, same approach.' },
      ],
      flags: [{ flag: '-p', means: 'Show the PID and program name owning each socket.' }],
    },
    hints: [
      'Start from the listening-sockets command, and add the flag that shows processes.',
      'Then pipe the result into grep to keep only the line you want.',
      'Search for `:22` with the colon, so you do not also match port 2200.',
    ],
    solution: 'netstat -tlnp | grep :22',
    expectedOutput: 'Two lines, both showing 1198/sshd: one for IPv4, one for IPv6.',
    checks: [
      { type: 'command-has-flag', command: 'netstat', flags: ['p'], hint: 'Add -p so the owning process is shown.' },
      { type: 'command-uses-pipe', hint: 'Pipe netstat into grep to filter down to port 22.' },
      { type: 'output-contains', text: 'sshd', hint: 'The output should name the program holding the port.' },
    ],
    debrief:
      'sshd on 22 is exactly what should be there. The reason you check is the case where it is not: a listener on 22 owned by something that is not sshd, or sshd running on a port nobody configured. Verifying the boring answer is how you notice the interesting one.',
    practice: NETWORKING_PRACTICE['net.2.3'] ?? [],
  },
  {
    id: 'net.2.4',
    moduleId: '4.2',
    packageId: 'networking',
    order: 4,
    title: 'Show conversations in progress',
    kind: 'terminal',
    goal: 'Separate active connections from open doors.',
    prompt: 'Show only the TCP connections that are currently established.',
    teach: {
      concept:
        'LISTEN means a service is waiting. ESTABLISHED means somebody is actually connected right now, and both ends are named. This is the view that answers "who is talking to this machine at this moment", which during an incident is often the most urgent question you have.',
      syntax: 'netstat -tn | grep ESTABLISHED',
      examples: [
        { command: 'ss -tn | grep ESTAB', explains: 'The modern tool abbreviates the state to ESTAB, which catches people out when they grep for the full word.' },
        { command: 'netstat -tn | grep TIME_WAIT', explains: 'Connections that recently closed and are still winding down.' },
      ],
    },
    hints: [
      'Ask netstat for TCP connections with numeric addresses, then filter.',
      'The state you want is written in capitals in the State column.',
      'Pipe into grep ESTABLISHED.',
    ],
    solution: 'netstat -tn | grep ESTABLISHED',
    expectedOutput: 'Five established connections.',
    checks: [
      { type: 'command-uses-pipe', hint: 'Use a pipe to filter netstat output down to the established connections.' },
      { type: 'output-line-count', count: 5, hint: 'There are five established connections on this host.' },
      { type: 'output-contains', text: 'ESTABLISHED', hint: 'Every line should be an established connection.' },
      { type: 'output-excludes', text: 'LISTEN ', hint: 'Listening sockets should be filtered out.' },
    ],
    debrief:
      'Five conversations. Two are the machine talking to itself on loopback, which is normal and uninteresting. The other three involve real addresses, and one of them is about to matter a great deal.',
    practice: NETWORKING_PRACTICE['net.2.4'] ?? [],
  },
  {
    id: 'net.2.5',
    moduleId: '4.2',
    packageId: 'networking',
    order: 5,
    title: 'Filter out the machine talking to itself',
    kind: 'terminal',
    goal: 'Use an inverted match to remove noise you already understand.',
    prompt:
      'Loopback traffic is this host talking to itself and is rarely interesting. Show the established TCP connections with all loopback lines removed.',
    teach: {
      concept:
        'grep -v inverts a match: it keeps every line that does NOT contain the pattern. Investigations are largely subtraction: you remove the categories you have already explained until what remains is small enough to read one line at a time. Removing loopback is usually the first subtraction on any host.',
      syntax: 'netstat -tn | grep ESTABLISHED | grep -v 127.0.0.1',
      examples: [
        { command: 'netstat -tn | grep -v LISTEN', explains: 'Removing a category rather than selecting one.' },
        { command: 'grep -v "nagios" /var/log/auth.log', explains: 'The same idea back in Log Analysis: subtract the noise you already understand.' },
      ],
      flags: [{ flag: '-v', means: 'Invert: keep the lines that do not match.' }],
    },
    hints: [
      'Start from the established-connections command you just wrote.',
      'Add one more pipe, and a grep that removes rather than selects.',
      'The loopback address is 127.0.0.1, and the flag that inverts a match is -v.',
    ],
    solution: 'netstat -tn | grep ESTABLISHED | grep -v 127.0.0.1',
    expectedOutput: 'Three connections, all involving addresses other than loopback.',
    checks: [
      { type: 'command-has-flag', command: 'grep', flags: ['v'], hint: 'Use grep -v to remove the loopback lines.' },
      { type: 'output-line-count', count: 3, hint: 'Removing the two loopback connections should leave three.' },
      { type: 'output-excludes', text: '127.0.0.1', hint: 'No loopback addresses should remain.' },
    ],
    debrief:
      'Three lines left, from five. Two are internal office machines connecting in over SSH and HTTPS, which is what this server is for. Read the third one carefully before moving on.',
    practice: NETWORKING_PRACTICE['net.2.5'] ?? [],
  },
  {
    id: 'net.2.6',
    moduleId: '4.2',
    packageId: 'networking',
    order: 6,
    title: 'Find the connection that should not exist',
    kind: 'terminal',
    goal: 'Identify an outbound connection to an external address, and the process behind it.',
    prompt:
      'Show the established connections with loopback removed, and include the owning process this time. One of these is a server reaching OUT to an address on the internet. Find it.',
    teach: {
      concept:
        'A web server exists to receive connections, not make them. Traffic arriving at port 443 from an office machine is the job working normally. A connection where this host is the one dialling out (to an address nobody recognises, made by a tool like curl rather than a service) is one of the strongest single signals available in security monitoring. Adding -p turns "there is a connection" into "curl made this connection".',
      syntax: 'netstat -tnp | grep ESTABLISHED | grep -v 127.0.0.1',
      examples: [
        { command: 'netstat -tnp | grep :443', explains: 'Everything on the HTTPS port, in and out.' },
        { command: 'ps aux | grep curl', explains: 'The other half of the question: what is that process actually doing?' },
      ],
    },
    hints: [
      'Take the command from the previous exercise and add the flag that shows the owning process.',
      'That flag is -p, and it goes with the netstat flags: -tnp.',
      'Read the Foreign Address column. Two are 10.20.x.x, which is internal. One is not.',
    ],
    solution: 'netstat -tnp | grep ESTABLISHED | grep -v 127.0.0.1',
    expectedOutput: `Three connections, one of which is curl connected out to ${EXFIL} on port 443.`,
    checks: [
      { type: 'command-has-flag', command: 'netstat', flags: ['p'], hint: 'Add -p so you can see which process owns each connection.' },
      { type: 'output-contains', text: EXFIL, hint: 'The external address should be visible in your output.' },
      { type: 'output-contains', text: 'curl', hint: 'The owning process should be shown, that is what -p adds.' },
      { type: 'output-excludes', text: '127.0.0.1', hint: 'Loopback should still be filtered out.' },
    ],
    debrief:
      `That connection has been open on this host since Linux Fundamentals, and you have only now had the tools to see it. ${EXFIL} is not a Ridgeline address. The process is curl: a file transfer tool, not a service. A patient-portal web server has no reason to be uploading anything to an unknown address on the internet. In Log Analysis you found how somebody got in; this is what they are doing now.`,
    practice: NETWORKING_PRACTICE['net.2.6'] ?? [],
  },
];

// --- Module 4.3: names ---------------------------------------------------------

const MODULE_4_3: Exercise[] = [
  {
    id: 'net.3.1',
    moduleId: '4.3',
    packageId: 'networking',
    order: 1,
    title: 'Turn a name into an address',
    kind: 'terminal',
    goal: 'Query DNS directly rather than trusting an application to do it.',
    prompt: 'Look up the address that portal.ridgelinemed.example resolves to.',
    teach: {
      concept:
        'DNS turns names into addresses. `dig` asks a resolver directly and shows you the whole answer, including which server replied. The part to read is the ANSWER SECTION. Doing the lookup yourself matters in an investigation because a name in a log is only meaningful once you know what it pointed at, and what it points at can change.',
      syntax: 'dig NAME',
      examples: [
        { command: 'dig rmg-web-01.ridgelinemed.example', explains: 'The other web server.' },
        { command: 'host rmg-mail-01.ridgelinemed.example', explains: 'A shorter tool giving a one-line answer.' },
      ],
    },
    hints: [
      'The tool is three letters and takes the name as its only argument.',
      'It is `dig`, followed by the hostname.',
    ],
    solution: 'dig portal.ridgelinemed.example',
    expectedOutput: `A full DNS response whose ANSWER SECTION gives ${HOST_IP}.`,
    checks: [
      { type: 'output-contains', text: 'ANSWER SECTION', hint: 'A successful dig response includes an ANSWER SECTION.' },
      { type: 'output-contains', text: HOST_IP, hint: 'The name should resolve to an address.' },
    ],
    debrief:
      `The portal resolves to ${HOST_IP}: this host. That is worth noticing: the machine you have been investigating is the public patient portal, which is why it is exposed to the internet and why it was being brute-forced all morning.`,
    practice: NETWORKING_PRACTICE['net.3.1'] ?? [],
  },
  {
    id: 'net.3.2',
    moduleId: '4.3',
    packageId: 'networking',
    order: 2,
    title: 'Turn an address back into a name',
    kind: 'terminal',
    goal: 'Use a reverse lookup to identify an unfamiliar address.',
    prompt:
      'In Log Analysis you found hundreds of failed logins from 10.20.9.40. Find out what that machine is called.',
    teach: {
      concept:
        'A reverse lookup goes the other way: given an address, what name is registered for it? This is one of the fastest ways to make sense of an address in a log. Internal infrastructure is usually named descriptively, so a reverse lookup often answers "should this machine be doing that?" in one step.',
      syntax: 'nslookup ADDRESS     or     dig -x ADDRESS',
      examples: [
        { command: 'nslookup 10.20.9.15', explains: 'The backup server, by address.' },
        { command: 'dig -x 10.20.6.41', explains: 'The same question using dig, where -x means reverse.' },
      ],
    },
    hints: [
      'Give a lookup tool an address instead of a name and it does the reverse lookup automatically.',
      'Use `nslookup` followed by the address.',
    ],
    solution: 'nslookup 10.20.9.40',
    expectedOutput: 'A reverse record naming rmg-monitor-01.ridgelinemed.example.',
    checks: [
      { type: 'output-contains', text: 'rmg-monitor-01', hint: 'The reverse lookup should return the host\'s name.' },
      { type: 'output-contains', text: 'in-addr.arpa', hint: 'A reverse lookup queries the in-addr.arpa zone, that should appear in the response.' },
    ],
    debrief:
      'It is the monitoring server. Five hundred and seventy-six authentication failures, all day, every five minutes: from the company\'s own monitoring box with a stale password. One reverse lookup turns the noisiest thing in the log into a ticket for whoever owns monitoring, and takes it off your incident list entirely.',
    practice: NETWORKING_PRACTICE['net.3.2'] ?? [],
  },
  {
    id: 'net.3.3',
    moduleId: '4.3',
    packageId: 'networking',
    order: 3,
    title: 'Find out who answers this host\'s questions',
    kind: 'terminal',
    goal: 'Read the resolver configuration.',
    prompt: 'Show which DNS servers this host is configured to use.',
    teach: {
      concept:
        'Every lookup this machine makes goes to the resolvers listed in /etc/resolv.conf. It is a plain text file, so reading it needs no special tool. It matters in an investigation because changing a host\'s resolver is a quiet way to redirect its traffic: if a machine is suddenly asking a nameserver nobody recognises, that is worth explaining.',
      syntax: 'cat /etc/resolv.conf',
      examples: [
        { command: 'cat /etc/hosts', explains: 'The file checked BEFORE DNS, which can override it entirely.' },
        { command: 'dig portal.ridgelinemed.example', explains: 'A lookup that will be answered by whichever server is listed here.' },
      ],
    },
    hints: [
      'This is a file, not a command: you already know how to read files.',
      'The file is /etc/resolv.conf.',
    ],
    solution: 'cat /etc/resolv.conf',
    expectedOutput: 'Five lines: two nameservers, a search domain, and options.',
    checks: [
      { type: 'output-contains', text: 'nameserver 10.20.1.10', hint: 'The primary resolver should be listed.' },
      { type: 'output-contains', text: 'search ridgelinemed.example', hint: 'The search domain should be listed too.' },
    ],
    debrief:
      'Both resolvers are on the internal 10.20.1.x network, which is what you want. A host configured to use a public resolver, or one you do not recognise, is bypassing whatever DNS filtering the company put in place: sometimes by accident, sometimes not.',
    practice: NETWORKING_PRACTICE['net.3.3'] ?? [],
  },
  {
    id: 'net.3.4',
    moduleId: '4.3',
    packageId: 'networking',
    order: 4,
    title: 'Check the file that overrides DNS',
    kind: 'terminal',
    goal: 'Read /etc/hosts and understand why it is checked first.',
    prompt: 'Show the static host entries configured on this machine.',
    teach: {
      concept:
        '/etc/hosts maps names to addresses locally, and it is consulted BEFORE DNS. Anything listed there wins, no matter what the nameserver says. That makes it convenient for small static mappings and attractive to an attacker: adding one line can silently redirect a name to an address of their choosing, and no DNS log will ever show it.',
      syntax: 'cat /etc/hosts',
      examples: [
        { command: 'cat /etc/resolv.conf', explains: 'The other half of name resolution: who gets asked when /etc/hosts has no answer.' },
        { command: 'grep rmg /etc/hosts', explains: 'Filtering the file down to the company\'s own hosts.' },
      ],
    },
    hints: [
      'Another plain text file in /etc.',
      'The file is /etc/hosts: plural, no extension.',
    ],
    solution: 'cat /etc/hosts',
    expectedOutput: 'Eleven lines: loopback entries, the Ridgeline hosts, and IPv6 defaults.',
    checks: [
      { type: 'output-contains', text: 'rmg-backup-01', hint: 'The company hosts should be listed.' },
      { type: 'output-contains', text: '127.0.0.1', hint: 'The loopback entry should be there.' },
      { type: 'output-line-count', count: 11, hint: 'The file has eleven non-empty lines.' },
    ],
    debrief:
      'Everything here is internal and expected. The check worth remembering is the one that finds a public name (a software update server, say) pointed at an internal or unfamiliar address. That is a redirect, and because it never touches DNS, this file is the only place it is visible.',
    practice: NETWORKING_PRACTICE['net.3.4'] ?? [],
  },
];

// --- Module 4.4: what is exposed, and to whom --------------------------------

const MODULE_4_4: Exercise[] = [
  {
    id: 'net.4.1',
    moduleId: '4.4',
    packageId: 'networking',
    order: 1,
    title: 'Count what is listening',
    kind: 'terminal',
    goal: 'Take an inventory of the services accepting connections on this host.',
    prompt:
      'List the TCP services listening on rmg-web-02, with the program that owns each one, and count how many there are.',
    teach: {
      concept:
        'Every listening socket is a door. Some of them are doors you meant to install, and the difference between the two lists is most of what an attacker is looking for when they arrive on a host.\n\nThe inventory is a single command. `netstat -tlnp` restricts to TCP (-t), shows only listeners (-l), keeps addresses and ports numeric rather than resolving them (-n), and names the owning process (-p). Learn those four letters as a unit: it is the first thing to run on any host you have never seen before.',
      syntax: 'netstat -tlnp',
      examples: [
        {
          command: 'netstat -ulnp',
          explains: 'The same inventory for UDP, which is where DNS and a lot of quieter services live.',
        },
      ],
      flags: [
        { flag: '-t', means: 'TCP sockets only.' },
        { flag: '-l', means: 'Only sockets in the LISTEN state.' },
        { flag: '-n', means: 'Numeric: do not resolve addresses or port names.' },
        { flag: '-p', means: 'Show the pid and program that owns the socket.' },
      ],
    },
    hints: [
      'Four flags, all on netstat, and they can be written together as one argument.',
      'You want listeners rather than established connections, which is the -l.',
    ],
    solution: 'netstat -tlnp',
    expectedOutput: `${LISTENING_TCP.length} listening TCP sockets, including sshd, nginx, gunicorn and postgres.`,
    checks: [
      {
        type: 'output-contains',
        text: 'LISTEN',
        hint: 'You want sockets in the LISTEN state, which is what -l selects.',
      },
      {
        type: 'output-contains',
        text: 'nginx',
        hint: 'Add -p so the owning program appears next to each socket.',
      },
      {
        type: 'output-contains',
        text: '5432',
        hint: 'Use -n so ports stay numeric rather than being shown by service name.',
      },
    ],
    debrief:
      'Four programs, several sockets. Now the real question, which the next exercise asks: which of those are reachable from another machine, and which are only reachable from this one?',
    practice: NETWORKING_PRACTICE['net.4.1'] ?? [],
  },
  {
    id: 'net.4.2',
    moduleId: '4.4',
    packageId: 'networking',
    order: 2,
    title: 'The difference between 0.0.0.0 and 127.0.0.1',
    kind: 'terminal',
    goal: 'Read the local address of a listener as a statement about exposure.',
    prompt:
      'Count how many TCP listeners are bound to 0.0.0.0, which means they accept connections from any interface.',
    teach: {
      concept:
        'The local address on a listening socket is not decoration, it is the blast radius. A socket bound to 127.0.0.1 accepts connections only from processes on this host: nothing on the network can reach it, whatever the firewall says. A socket bound to 0.0.0.0 accepts connections on every interface the machine has, which means anything that can route to the box can knock.\n\nThis single distinction explains a large share of real findings. A database bound to 0.0.0.0 is an incident waiting to happen; the same database on 127.0.0.1 is fine. When you read a listener table, read the left-hand address first and the port second.\n\nOne trap to know about before you write the filter. Every listener row ALSO shows 0.0.0.0:* in its foreign-address column, so a pattern of just "0.0.0.0:" matches every row including the loopback ones, and hands you a number twice as reassuring as it should be. Requiring a digit after the colon pins the match to a real local port and excludes the wildcard column.',
      syntax: "netstat -tlnp | grep -c '0.0.0.0:[0-9]'",
      examples: [
        {
          command: "netstat -tlnp | grep '127.0.0.1:'",
          explains: 'The opposite selection: the services that are deliberately kept private to this host.',
        },
      ],
    },
    hints: [
      'Take the listener inventory and filter it to the lines whose LOCAL address is the wildcard.',
      'Every row also has 0.0.0.0:* in its foreign column, so a bare "0.0.0.0:" matches everything. Require a digit after the colon.',
      'grep -c will count for you once the pattern is right.',
    ],
    solution: "netstat -tlnp | grep -c '0.0.0.0:[0-9]'",
    expectedOutput: `${EXPOSED_TCP.length}`,
    checks: [
      {
        type: 'output-numeric',
        equals: EXPOSED_TCP.length,
        hint: 'Every row shows 0.0.0.0:* in the foreign column, so match a digit after the colon to pin the pattern to a real local port.',
      },
    ],
    debrief: `${EXPOSED_TCP.length} sockets are reachable from off this host and ${LOOPBACK_TCP.length} are not. That first number is your actual external attack surface, and it is the one to put in a report rather than the total.`,
    practice: NETWORKING_PRACTICE['net.4.2'] ?? [],
  },
  {
    id: 'net.4.3',
    moduleId: '4.4',
    packageId: 'networking',
    order: 3,
    title: 'Which services stay private',
    kind: 'terminal',
    goal: 'Identify the services deliberately bound to loopback, and know why that is the right default.',
    prompt:
      'Show the TCP listeners that are bound only to loopback, so you can see which services this host keeps to itself.',
    teach: {
      concept:
        'A well-built host binds anything that does not need to face the network to 127.0.0.1: the database, the application server behind the reverse proxy, the local mail submission socket. Traffic reaches them only by going through something that IS exposed, which gives you one front door to defend instead of five.\n\nWhen you find the opposite, a database or an admin interface bound wide, you have found a finding worth writing up even though nothing has gone wrong yet. That is the difference between vulnerability work and incident work, and both start from this table.',
      syntax: "netstat -tlnp | grep '127.0.0.1'",
      examples: [
        {
          command: "netstat -tlnp | grep ':22'",
          explains: 'Selecting by port instead, to answer whether SSH is listening at all and on which addresses.',
        },
      ],
    },
    hints: [
      'Same inventory command, filtered to the loopback address this time.',
      'Loopback is 127.0.0.1, and the services on it are the ones nothing off-host can reach.',
    ],
    solution: "netstat -tlnp | grep '127.0.0.1'",
    expectedOutput: `${LOOPBACK_TCP.length} loopback-only listeners, including the database and the application server.`,
    checks: [
      {
        type: 'output-contains',
        text: 'postgres',
        hint: 'The database should appear: it is bound to loopback only.',
      },
      {
        type: 'output-excludes',
        text: '0.0.0.0:80',
        hint: 'The web server is exposed on all interfaces, so it should not be in this filtered list.',
      },
    ],
    debrief:
      'The database and the application server are private, and the web server in front of them is not. That is the shape you want, and noticing when a host does NOT have that shape is a large part of hardening work.',
    practice: NETWORKING_PRACTICE['net.4.3'] ?? [],
  },
  {
    id: 'net.4.4',
    moduleId: '4.4',
    packageId: 'networking',
    order: 4,
    title: 'What a port number tells you',
    kind: 'terminal',
    goal: 'Read the well-known ports on sight, and notice the one that is not well known.',
    prompt:
      'Show every TCP socket on the host, listeners and established connections together, numerically.',
    teach: {
      concept:
        'A handful of port numbers carry meaning you should read without looking up: 22 is SSH, 25 is SMTP, 53 is DNS, 80 and 443 are HTTP and HTTPS, 5432 is PostgreSQL, 3306 is MySQL, 3389 is RDP. Recognising them turns a socket table from a wall of digits into a sentence about what the machine does.\n\nEqually important is the shape of the numbers that are NOT well known. Ports above roughly 32768 are ephemeral: the operating system hands them out to the client end of an outgoing connection. A high port on the LOCAL side of an established socket therefore means this host reached out, and that is a fact you get for free just by looking at which side the big number is on.',
      syntax: 'netstat -tn',
      examples: [
        {
          command: 'netstat -tnp | grep 443',
          explains: 'Everything involving the HTTPS port, which on this host includes both a service and something else.',
        },
      ],
    },
    hints: [
      'Drop the -l so you see established connections as well as listeners.',
      'Keep -n so you are reading numbers rather than service names.',
    ],
    solution: 'netstat -tn',
    expectedOutput: 'Listeners and established sessions together, all numeric.',
    checks: [
      {
        type: 'output-contains',
        text: 'ESTABLISHED',
        hint: 'Without -l you should see established sessions as well as listeners.',
      },
      {
        type: 'output-contains',
        text: String(EXFIL_SOCKET.localPort),
        hint: 'One of the established sockets has a high, ephemeral port on the local side. It should be in the table.',
      },
    ],
    debrief: `Look at the socket with local port ${EXFIL_SOCKET.localPort}. A high local port and 443 on the far side means this host opened an HTTPS connection OUTWARD to somewhere. Web servers serve; they do not usually browse.`,
    practice: NETWORKING_PRACTICE['net.4.4'] ?? [],
  },
  {
    id: 'net.4.5',
    moduleId: '4.4',
    packageId: 'networking',
    order: 5,
    title: 'Compare what is running to what should be',
    kind: 'terminal',
    goal: 'Check the listener inventory against the services the host is supposed to run.',
    prompt:
      'rmg-web-02 is a web server with a local database. Confirm whether anything is listening on port 3306, the MySQL port, which it has no reason to run.',
    teach: {
      concept:
        'An inventory is only useful against an expectation. The productive question is never "what is listening" on its own, it is "what is listening that nobody can explain", and answering it means having a view of what the host is for before you look.\n\nA search that returns nothing is a good outcome here, and it is worth running anyway. Confirming the absence of something takes seconds and it is the only way to turn "I think we do not run MySQL" into a statement you can defend. Remember that grep exits non-zero when it finds nothing, which is not an error.',
      syntax: 'netstat -tlnp | grep PORT',
      examples: [
        {
          command: 'netstat -tlnp | grep 3389',
          explains: 'The same check for the Windows remote desktop port, which should also find nothing on a Linux host.',
        },
      ],
    },
    hints: [
      'Filter the listener inventory for the port number.',
      'Finding nothing is the correct result. Do not assume your command failed.',
    ],
    solution: 'netstat -tlnp | grep 3306',
    expectedOutput: 'No output: nothing is listening on that port.',
    checks: [
      {
        type: 'output-excludes',
        text: '3306',
        hint: 'Nothing should be listening on the MySQL port. If you see it, check what you filtered.',
      },
      {
        type: 'command-matches',
        anyOf: ['netstat.*3306', 'ss.*3306'],
        regex: true,
        hint: 'Query the socket table for that specific port.',
      },
    ],
    debrief:
      'Nothing there, and now you can say so. Half of an assessment is a list of things you checked and did not find, because that is what makes the things you did find credible.',
    practice: NETWORKING_PRACTICE['net.4.5'] ?? [],
  },
];

// --- Module 4.5: reading a connection as a direction -------------------------

const MODULE_4_5: Exercise[] = [
  {
    id: 'net.5.1',
    moduleId: '4.5',
    packageId: 'networking',
    order: 1,
    title: 'Strip out the host talking to itself',
    kind: 'terminal',
    goal: 'Reduce the connection table to sessions that actually crossed the network.',
    prompt:
      'Show the established TCP connections that are NOT loopback, so you are left only with sessions involving another machine.',
    teach: {
      concept:
        'A busy host holds a lot of connections to itself: the web server talking to the application server, the application server talking to the database. They are noise for an investigation, because nothing about them crossed a wire, and they crowd out the handful of sessions that did.\n\nRemoving them is one inverted match on the loopback address. What is left is the set of conversations this machine is having with the outside world, and it is usually short enough to read line by line, which is exactly what you want.',
      syntax: "netstat -tn | grep -v '127.0.0.1' | grep ESTABLISHED",
      examples: [
        {
          command: "netstat -tn | grep '127.0.0.1' | grep ESTABLISHED",
          explains: 'The inverse: only the internal plumbing, which is what you want when you are debugging the application rather than hunting.',
        },
      ],
    },
    hints: [
      'Two filters: remove loopback, keep established.',
      'grep -v is the one that removes.',
    ],
    solution: "netstat -tn | grep -v '127.0.0.1' | grep ESTABLISHED",
    expectedOutput: `${ESTABLISHED_OFF_HOST.length} sessions with other machines.`,
    checks: [
      {
        type: 'output-line-count',
        count: ESTABLISHED_OFF_HOST.length,
        hint: `There are ${ESTABLISHED_OFF_HOST.length} established sessions that are not loopback.`,
      },
      {
        type: 'output-excludes',
        text: '127.0.0.1',
        hint: 'Loopback sessions should be filtered out entirely.',
      },
    ],
    debrief: `Three conversations with the rest of the world. That is a short enough list to account for every single one, which is the standard you should hold a host to.`,
    practice: NETWORKING_PRACTICE['net.5.1'] ?? [],
  },
  {
    id: 'net.5.2',
    moduleId: '4.5',
    packageId: 'networking',
    order: 2,
    title: 'Which end started it',
    kind: 'terminal',
    goal: 'Use port numbers to work out the direction of a connection.',
    prompt: `Show the established connection whose remote peer is ${EXFIL}, including the owning process.`,
    teach: {
      concept:
        'Direction is not recorded anywhere in a socket table, and you can read it anyway. The end holding the WELL-KNOWN port is the server; the end holding the high ephemeral port is the client that dialled out. So a socket whose local port is 44218 and whose remote port is 443 was opened BY this machine, TO that address.\n\nOn a web server that is a question worth asking about every outbound session. Servers are dialled; they do not usually dial. A legitimate exception is a package update or a licence check, and those go to places you can name.',
      syntax: 'netstat -tnp | grep ADDRESS',
      examples: [
        {
          command: 'netstat -tnp | grep 10.20.4.31',
          explains: 'An inbound session for comparison: the well-known port is on the local side, so that peer dialled us.',
        },
      ],
    },
    hints: [
      'Filter the socket table by the address, and include -p so you learn which program holds it.',
      'Compare which side has the small, well-known port number.',
    ],
    solution: `netstat -tnp | grep '${EXFIL}'`,
    expectedOutput: `One established session, owned by ${EXFIL_PROCESS.command.split(' ')[0]}.`,
    checks: [
      {
        type: 'output-contains',
        text: 'ESTABLISHED',
        hint: 'The session is live, not merely closing.',
      },
      {
        type: 'output-contains',
        text: String(EXFIL_SOCKET.pid),
        hint: 'Add -p so the pid of the owning process appears.',
      },
    ],
    debrief: `A web server holding an outbound HTTPS session to an external address, owned by ${EXFIL_PROCESS.command.split(' ')[0]} rather than by a service. Note the pid: the next module turns it into a person.`,
    practice: NETWORKING_PRACTICE['net.5.2'] ?? [],
  },
  {
    id: 'net.5.3',
    moduleId: '4.5',
    packageId: 'networking',
    order: 3,
    title: 'Turn a socket into a process',
    kind: 'terminal',
    goal: 'Pivot from a connection to the command line behind it.',
    prompt: `The suspicious session is held by process ${EXFIL_SOCKET.pid}. Show that process, with its full command line and the user running it.`,
    teach: {
      concept:
        'A connection tells you where; a process tells you what and who. The pid on a socket is the bridge between them, and crossing that bridge is the single most productive move available when something looks wrong on a host.\n\n`ps aux` prints every process with its owner and its full command line. Filtered to one pid, it turns "something is talking to an address I do not recognise" into a command line, a user, and a start time, which is usually enough to decide whether you are looking at an incident or at a colleague.',
      syntax: 'ps aux | grep PID',
      examples: [
        {
          command: 'ps aux | grep nginx',
          explains: 'The same pivot from a service name instead of a pid, which is how you check what a listener really is.',
        },
      ],
    },
    hints: [
      'ps aux lists everything; filter it down to the pid you were given.',
      'Read the whole line when you find it, especially the end of the command.',
    ],
    solution: `ps aux | grep ${EXFIL_SOCKET.pid}`,
    expectedOutput: `The ${EXFIL_PROCESS.command.split(' ')[0]} process, running as ${EXFIL_PROCESS.user}.`,
    checks: [
      {
        type: 'output-contains',
        text: EXFIL_PROCESS.user,
        hint: 'The user column tells you which account is running it.',
      },
      {
        type: 'output-contains',
        text: '/tmp/.cache/pt.tar.gz',
        hint: 'The full command line names the file being uploaded. Make sure you are seeing the whole line.',
      },
    ],
    debrief: `An upload of /tmp/.cache/pt.tar.gz to an external host, running as ${EXFIL_PROCESS.user}. If you worked through Log Analysis, you have seen both of those before: that account was created through sudo at 10:22, and that archive was built from the portal exports directory at 11:06. This is the same intrusion, seen from the other side.`,
    practice: NETWORKING_PRACTICE['net.5.3'] ?? [],
  },
  {
    id: 'net.5.4',
    moduleId: '4.5',
    packageId: 'networking',
    order: 4,
    title: 'Read the socket states',
    kind: 'terminal',
    goal: 'Tell a live session apart from one that has already finished.',
    prompt:
      'Use ss to show the TCP socket table, and read the state column.',
    teach: {
      concept:
        'A socket table mixes several states and they mean different things to an investigation. ESTABLISHED is a live session, right now, and it is the only state you can act on by killing something. TIME_WAIT is the residue of a connection that has already closed, kept for a couple of minutes so late packets do not confuse a new session. LISTEN is a service waiting.\n\nThe practical consequence: a TIME_WAIT entry is evidence that a conversation HAPPENED, not that one is happening. Reporting it as a live connection is a mistake that gets noticed, and missing it entirely means missing the only trace of a session that ended a minute before you logged in.\n\n`ss` is the modern replacement for netstat and abbreviates the live state as ESTAB rather than ESTABLISHED, which trips people up when they reuse a grep pattern between the two.',
      syntax: 'ss -tn',
      examples: [
        {
          command: 'ss -tlnp',
          explains: 'The listener inventory again, in ss form, which is what you will find on hosts where netstat is not installed.',
        },
      ],
    },
    hints: [
      'Two flags: TCP, and numeric.',
      'Read the leftmost column. Not every row is a live connection.',
    ],
    solution: 'ss -tn',
    expectedOutput: 'The socket table, with ESTAB and TIME_WAIT rows.',
    checks: [
      {
        type: 'output-contains',
        text: 'TIME_WAIT',
        hint: 'At least one socket on this host is in TIME_WAIT: a session that has already closed.',
      },
      {
        type: 'output-contains',
        text: 'ESTAB',
        hint: 'ss abbreviates the established state. Make sure you are running ss rather than netstat here.',
      },
    ],
    debrief:
      'Note that ss says ESTAB where netstat says ESTABLISHED. A grep pattern that worked on one silently returns nothing on the other, which is a good reason to check your filter against the raw output before you trust an empty result.',
    practice: NETWORKING_PRACTICE['net.5.4'] ?? [],
  },
  {
    id: 'net.5.5',
    moduleId: '4.5',
    packageId: 'networking',
    order: 5,
    title: 'Account for every external session',
    kind: 'terminal',
    goal: 'Produce the short list a handover note needs.',
    prompt:
      'Show every established non-loopback session together with the process holding it, so each one can be accounted for by name.',
    teach: {
      concept:
        'This is the command you run before you hand a host over to somebody else, and the output is short enough to annotate line by line: this one is the admin who is logged in, this one is a customer on the web server, this one is unexplained.\n\nThe discipline that matters is accounting for ALL of them, including the boring ones. An analyst who explains the alarming session and ignores the other two has not established that there is only one problem.',
      syntax: "netstat -tnp | grep ESTABLISHED | grep -v '127.0.0.1'",
      examples: [
        {
          command: "netstat -tnp | grep ESTABLISHED | grep ':22'",
          explains: 'Narrowing to interactive SSH sessions, which answers the separate question of who is logged in right now.',
        },
      ],
    },
    hints: [
      'Combine what you already know: established only, no loopback, and -p for the owning process.',
      'The order of the two filters does not matter.',
    ],
    solution: "netstat -tnp | grep ESTABLISHED | grep -v '127.0.0.1'",
    expectedOutput: `${ESTABLISHED_OFF_HOST.length} sessions, each with an owning program.`,
    checks: [
      {
        type: 'output-line-count',
        count: ESTABLISHED_OFF_HOST.length,
        hint: `Every established off-host session should be listed: there are ${ESTABLISHED_OFF_HOST.length}.`,
      },
      {
        type: 'output-contains',
        text: 'sshd',
        hint: 'One of them is an inbound SSH session. Include -p so the program shows.',
      },
      {
        type: 'output-contains',
        text: EXFIL,
        hint: 'The outbound session to the external address belongs in the list too.',
      },
    ],
    debrief:
      'Three sessions: an administrator on SSH, a user on the web server, and an upload to an address nobody can name. Two of those are explainable in a sentence. The third is your incident.',
    practice: NETWORKING_PRACTICE['net.5.5'] ?? [],
  },
];

// --- Module 4.10: subnetting and VLANs, added for the Virtual Networking Lab --
//
// Unlike modules 4.1 to 4.5, these two modules are judgement content rather
// than terminal commands against MACHINE: there is no simulated router or
// switch fabric in this platform, and building one would be a project of its
// own. What CAN be graded honestly is the arithmetic and the design
// reasoning, so every expected answer below is computed from the numbers in
// the prompt rather than typed in by hand, the same "derive, never hardcode"
// discipline modules 4.1 to 4.9 apply to the simulated host.

/** A dotted-decimal IPv4 address as a 32-bit integer. */
function ipToInt(ip: string): number {
  const [a, b, c, d] = ip.split('.').map(Number);
  return (a! << 24) + (b! << 16) + (c! << 8) + d!;
}

/** A 32-bit integer back to dotted-decimal. */
function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

/** Network address, broadcast address, and usable host count for an IP/prefix. */
function subnetInfo(ip: string, prefix: number) {
  const hostBits = 32 - prefix;
  const mask = hostBits === 0 ? 0xffffffff : (0xffffffff << hostBits) >>> 0;
  const base = ipToInt(ip) >>> 0;
  const network = base & mask;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const usableHosts = hostBits <= 1 ? 0 : 2 ** hostBits - 2;
  return { network: intToIp(network), broadcast: intToIp(broadcast), usableHosts, hostBits };
}

const SUBNET_A = subnetInfo('10.40.14.130', 26);
const SUBNET_B_HOSTS = subnetInfo('10.0.0.1', 27).usableHosts;
const SUBNET_C = subnetInfo('10.0.0.0', 26);

const MODULE_4_10: Exercise[] = [
  {
    id: 'net.10.1',
    moduleId: '4.10',
    packageId: 'networking',
    order: 1,
    title: 'Find the network address',
    kind: 'short-answer',
    goal: 'Work out which subnet an address belongs to, from the address and prefix alone.',
    prompt: `A host has the address 10.40.14.130 with a /26 prefix. In one or two sentences, give the network address of the subnet it belongs to, and briefly say how you got there.`,
    teach: {
      concept:
        'A /26 prefix leaves 6 host bits, which means the address space splits into blocks of 64 ' +
        'addresses (2 to the power of 6). Those blocks always start on a multiple of 64 in the last ' +
        'octet: 0, 64, 128, 192. To find which block an address falls in, find the largest multiple of ' +
        'the block size that is less than or equal to the address\'s last octet. 130 falls between 128 ' +
        'and 191, so the network address is 192.168.14.128, and everything from .128 to .191 belongs to ' +
        'the same subnet as .130.',
      syntax: 'network = address AND subnet mask',
      examples: [
        { command: '10.0.0.37 /26', explains: 'Falls in the 0 to 63 block, so the network address is 10.0.0.0.' },
      ],
    },
    hints: [
      'A /26 prefix means blocks of 64 addresses, starting at multiples of 64: 0, 64, 128, 192.',
      'Find which of those four block-starts is the largest one at or below 130.',
      `The network address is ${SUBNET_A.network}.`,
    ],
    solution: `${SUBNET_A.network}, because a /26 block is 64 addresses wide and 130 falls in the block that starts at 128.`,
    expectedOutput: `${SUBNET_A.network}`,
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [[SUBNET_A.network]],
        hint: `The network address for 10.40.14.130/26 is ${SUBNET_A.network}.`,
      },
    ],
    debrief:
      `Every address from ${SUBNET_A.network} to ${SUBNET_A.broadcast} is on this same subnet. A device ` +
      'at .131 can reach a device at .190 directly, with no router involved, but cannot reach anything ' +
      'in the next block without one.',
    practice: [],
  },
  {
    id: 'net.10.2',
    moduleId: '4.10',
    packageId: 'networking',
    order: 2,
    title: 'Count the usable hosts',
    kind: 'short-answer',
    goal: 'Turn a prefix length into a usable host count, and know why two addresses in the block are never handed to a device.',
    prompt: 'How many usable host addresses does a /27 subnet have, and why is the number not a clean power of two?',
    teach: {
      concept:
        'A /27 prefix leaves 5 host bits, giving 2 to the power of 5, 32 addresses in the block. Two of ' +
        'those are never assignable to a device: the lowest address in the block is the NETWORK address, ' +
        'which identifies the subnet itself, and the highest is the BROADCAST address, which every device ' +
        'on the subnet listens on. That leaves 32 minus 2 usable addresses for actual hosts, which is why ' +
        'the usable count is always two less than the block size, not the block size itself.',
      syntax: 'usable hosts = 2^(host bits) - 2',
    },
    hints: [
      'A /27 leaves 5 host bits, and 2 to the power of 5 is 32.',
      'Two addresses in every block are reserved and never handed to a device: name what they are for.',
      `The answer is ${SUBNET_B_HOSTS}.`,
    ],
    solution: `${SUBNET_B_HOSTS} usable hosts. 2^5 is 32 total addresses in the block, minus the network address and the broadcast address, which are reserved rather than assignable.`,
    expectedOutput: `${SUBNET_B_HOSTS}`,
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [[String(SUBNET_B_HOSTS)], ['network', 'broadcast']],
        hint: `Give the number (${SUBNET_B_HOSTS}) and name the two reserved addresses (network and broadcast) that account for the minus two.`,
      },
    ],
    debrief:
      'This minus-two is why a subnet sized to "exactly" the number of devices you have today leaves no ' +
      'room to grow: a team of 30 people fits into a /27 with zero addresses to spare, and the next new ' +
      'hire has nowhere to go.',
    practice: [],
  },
  {
    id: 'net.10.3',
    moduleId: '4.10',
    packageId: 'networking',
    order: 3,
    title: 'Why segment a flat network into VLANs',
    kind: 'multiple-choice',
    goal: 'Separate the real benefits of VLAN segmentation from a common overstatement of what it does.',
    prompt: 'A single flat /24 currently carries every device in a small office: workstations, VoIP phones, and a guest network. Which of the following are genuine reasons to split it into VLANs? Select all that apply.',
    teach: {
      concept:
        'A VLAN is a separate broadcast domain carried over the same physical switches, which means ' +
        'broadcast traffic from one VLAN (ARP requests, DHCP discovers) never reaches devices on another, ' +
        'improving both performance and, more importantly for security, containment: a compromised guest ' +
        'laptop broadcasting on the guest VLAN cannot see traffic on the voice or data VLAN by default. ' +
        'VLANs also let different device classes get different treatment, phones prioritised for latency, ' +
        'guests denied access to internal resources. What VLANs do NOT do on their own is stop traffic ' +
        'between VLANs: something still has to route between them, and unless a firewall or ACL sits at ' +
        'that routing point, a device on one VLAN can still reach another, VLANs alone are segmentation of ' +
        'the broadcast domain, not a security boundary by themselves.',
    },
    options: [
      { id: 'a', label: 'VLANs separate broadcast domains, so broadcast traffic from one group of devices does not reach another.' },
      { id: 'b', label: 'VLANs allow different device classes, like voice and guest traffic, to be treated differently by the network.' },
      { id: 'c', label: 'Splitting into VLANs alone, with no firewall or ACL between them, fully stops all lateral movement between the groups.' },
      { id: 'd', label: 'VLANs are a real security improvement, but the isolation is only as strong as whatever actually controls routing between them.' },
    ],
    hints: [
      'Three describe what VLANs genuinely do. One overstates VLANs as a complete security boundary on their own.',
      'Something still has to route between VLANs. What happens at that routing point is what actually determines whether traffic is blocked.',
    ],
    solution:
      'A, B, and D. Broadcast domain separation and differentiated treatment are real, and D is the honest ' +
      'caveat: the isolation is only as strong as whatever polices the routing between VLANs. C is the ' +
      'overstatement this exercise exists to correct: without an ACL or firewall at the inter-VLAN routing ' +
      'point, traffic can still cross between VLANs.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'VLANs separate broadcast domains, but without a firewall or ACL controlling inter-VLAN routing, they do not fully stop traffic between groups on their own.',
      },
    ],
    debrief:
      'A portfolio write-up that says "I put guest traffic on its own VLAN AND confirmed the router\'s ACL ' +
      'blocks it from reaching the internal VLAN" demonstrates this distinction directly, which is worth ' +
      'far more than a diagram showing three VLANs with no mention of what happens between them.',
    practice: [],
  },
  {
    id: 'net.10.4',
    moduleId: '4.10',
    packageId: 'networking',
    order: 4,
    title: 'Carve one network into four',
    kind: 'short-answer',
    goal: 'Work out the prefix length needed to split a network into a required number of equal subnets.',
    prompt:
      'You are given 10.0.0.0/24 and asked to carve it into 4 equal subnets, one per department. What ' +
      'prefix length would each subnet use, and how many usable hosts would each one have? Explain your ' +
      'reasoning in a sentence or two.',
    teach: {
      concept:
        'Splitting a network into 4 equal pieces means borrowing enough host bits to create 4 distinct ' +
        'blocks: 2 to the power of 2 is 4, so borrowing 2 bits from the host portion does it. A /24 has 8 ' +
        'host bits; borrowing 2 for subnetting leaves a /26 for each department (24 plus 2), with 6 host ' +
        'bits remaining in each. That gives 2 to the power of 6, minus 2, usable hosts per subnet, the ' +
        'same arithmetic as the /27 exercise earlier in this module, just arrived at from the other ' +
        'direction: how many subnets do I need, rather than how many hosts does this prefix give me.',
      syntax: 'bits to borrow = log2(subnets needed)',
    },
    hints: [
      'You need 4 equal blocks. 2 to the power of what gives you 4?',
      'Borrowing that many bits from a /24 gives you the new prefix length.',
      `Each subnet is a /26, with ${SUBNET_C.usableHosts} usable hosts.`,
    ],
    solution: `Each department gets a /26. Splitting into 4 equal blocks needs 2 borrowed bits (2^2 = 4), and 24 + 2 = 26. That leaves 6 host bits per subnet, giving 2^6 - 2 = ${SUBNET_C.usableHosts} usable hosts each.`,
    expectedOutput: `/26 per subnet, ${SUBNET_C.usableHosts} usable hosts each.`,
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [['/26', '26'], [String(SUBNET_C.usableHosts)]],
        hint: `Name the prefix (/26) and the usable host count (${SUBNET_C.usableHosts}) that splitting a /24 into 4 equal pieces produces.`,
      },
    ],
    debrief:
      'This is the arithmetic behind an IP addressing plan on any real network diagram: "4 departments, ' +
      'roughly 60 devices each, /24 to divide" resolves to "/26 per department" in exactly this way, ' +
      'before a single cable gets plugged in.',
    practice: [],
  },
  {
    id: 'net.10.5',
    moduleId: '4.10',
    packageId: 'networking',
    order: 5,
    title: 'Access port, or trunk port',
    kind: 'multiple-choice',
    goal: 'Distinguish an access port from a trunk port, and know which one an end device gets.',
    prompt: 'Which of the following correctly describe the difference between an access port and a trunk port on a switch? Select all that apply.',
    teach: {
      concept:
        'An ACCESS PORT belongs to exactly one VLAN and carries traffic untagged, which is what an end ' +
        'device like a laptop or a phone connects to, since ordinary devices have no idea what a VLAN tag ' +
        'even is. A TRUNK PORT carries traffic for multiple VLANs at once between switches, or between a ' +
        'switch and a router, using 802.1Q tags added to each frame so the receiving end knows which VLAN ' +
        'each frame belongs to. Plugging an ordinary laptop into a trunk port configured for multiple ' +
        'VLANs does not give it access to all of them, the laptop has no idea what to do with tagged ' +
        'frames and simply will not work correctly.',
    },
    options: [
      { id: 'a', label: 'An access port carries traffic for exactly one VLAN, untagged, and is what an end device connects to.' },
      { id: 'b', label: 'A trunk port carries traffic for multiple VLANs at once, using 802.1Q tags to identify which VLAN each frame belongs to.' },
      { id: 'c', label: 'A trunk port is typically used between switches, or between a switch and a router, not for an ordinary end device.' },
      { id: 'd', label: 'Plugging an ordinary laptop into a trunk port gives it working access to every VLAN carried on that trunk.' },
    ],
    hints: [
      'Three describe the real distinction correctly. One assumes an ordinary device can make sense of tagged frames, which it cannot.',
    ],
    solution:
      'A, B, and C. Access ports are single-VLAN and untagged for end devices, trunk ports carry multiple ' +
      'tagged VLANs between switching infrastructure. D is wrong: an ordinary laptop has no 802.1Q support ' +
      'and simply will not function correctly if plugged into a trunk port.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'An ordinary end device has no support for 802.1Q tagging, so plugging it into a trunk port does not give it working access to the VLANs carried there.',
      },
    ],
    debrief:
      'In a Packet Tracer or GNS3 build, this is the single most common cabling mistake: an end device ' +
      'plugged into a port still configured as a trunk from a previous step, which looks identical in the ' +
      'topology diagram and behaves nothing like an access port.',
    practice: [],
  },
];

// --- Module 4.11: routing and DHCP, added for the Virtual Networking Lab -----

const MODULE_4_11: Exercise[] = [
  {
    id: 'net.11.1',
    moduleId: '4.11',
    packageId: 'networking',
    order: 1,
    title: 'Default route, or static route',
    kind: 'multiple-choice',
    goal: 'Tell a default route apart from a static route, and know when each is the right tool.',
    prompt: 'Which of the following correctly describe the difference between a default route and a static route? Select all that apply.',
    teach: {
      concept:
        'A DEFAULT ROUTE is the catch-all: anything not matched by a more specific entry in the routing ' +
        'table goes there, which is why it is often written as 0.0.0.0/0, a network that matches every ' +
        'address. A STATIC ROUTE is a specific entry an administrator adds by hand for one particular ' +
        'destination network, pointed at a specific next-hop, used when traffic to that one network needs ' +
        'to take a different path than everything else, a second internal network reachable through a ' +
        'different router, for instance, rather than going out the default gateway toward the internet. A ' +
        'router always prefers the most specific matching route, which is why a static route for one ' +
        'network overrides the default route for traffic headed there, without changing anything about how ' +
        'every other destination is handled.',
    },
    options: [
      { id: 'a', label: 'A default route is the catch-all entry used when no more specific route matches.' },
      { id: 'b', label: 'A static route is a specific entry for one destination network, added by an administrator.' },
      { id: 'c', label: 'A router always prefers the most specific matching route over a less specific one, like the default.' },
      { id: 'd', label: 'Adding a static route for one network changes how every other destination on the router is handled.' },
    ],
    hints: [
      'Three describe how routes and route selection actually work. One overstates the blast radius of adding a single static route.',
    ],
    solution:
      'A, B, and C. Specificity wins, which is exactly why a static route only changes the path for the ' +
      'network it names. D is wrong: adding one static route has no effect on how the router handles any ' +
      'other destination.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'A static route added for one network changes the path only for that network, not for every other destination the router handles.',
      },
    ],
    debrief:
      'This "most specific route wins" rule is the same principle net.1.4 introduced with a single default ' +
      'route, extended to a router that has to choose between several candidates rather than just one.',
    practice: [],
  },
  {
    id: 'net.11.2',
    moduleId: '4.11',
    packageId: 'networking',
    order: 2,
    title: 'Two subnets that cannot reach each other',
    kind: 'short-answer',
    goal: 'Diagnose the most common reason two correctly configured subnets cannot reach each other.',
    prompt:
      'In a three-router topology, two end devices on different subnets both have the correct IP, mask, ' +
      'and default gateway configured, but a ping between them fails. Every directly connected link ' +
      'otherwise works. In two or three sentences, say what is most likely missing, and why the devices\' ' +
      'own configuration being correct does not rule it out.',
    teach: {
      concept:
        'A router only knows about networks it is DIRECTLY CONNECTED to, or ones it was explicitly told ' +
        'about, through a static route or a routing protocol like OSPF or RIP. Two correctly configured end ' +
        'devices, each pointed at their own local gateway, still fail to reach each other if the ROUTERS in ' +
        'between have no route to each other\'s subnet, because each router simply drops or fails to ' +
        'forward traffic for a destination it does not know how to reach. This is a genuinely common ' +
        'Packet Tracer mistake: every cable and IP address is correct, but nobody added the static routes ' +
        '(or enabled a routing protocol) that would let the routers actually tell each other about the ' +
        'subnets they each connect to.',
    },
    hints: [
      'The end devices are configured correctly, so look at what sits between their two gateways: the routers themselves.',
      'A router does not automatically know about a subnet it is not directly connected to.',
      'Name static routes, or a routing protocol, as the missing piece.',
    ],
    solution:
      'The most likely missing piece is routing between the routers themselves, either static routes or a ' +
      'routing protocol like OSPF, that tells each router how to reach the subnet it is not directly ' +
      'connected to. The end devices being correctly configured does not rule this out, because a router ' +
      'only knows about networks it is directly connected to or has explicitly been told about, so without ' +
      'that configuration it simply has no path to forward the traffic along, no matter how correct the ' +
      'end devices are.',
    expectedOutput: 'An answer naming missing inter-router routing (static routes or a routing protocol) and explaining why correct end-device config does not rule it out.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['static route', 'routing protocol', 'ospf', 'rip', 'route between'],
          ['directly connected', 'does not know', 'no route', 'not automatic'],
        ],
        hint: 'Name what is likely missing between the routers (static routes or a routing protocol) and explain that a router does not automatically know about a subnet it is not directly connected to.',
      },
    ],
    debrief:
      'This is the exact moment "Watch a ping travel, and know exactly why it works" from a networking lab ' +
      'earns its keep: tracing the path hop by hop, rather than just checking each end device, is what ' +
      'finds this kind of gap.',
    practice: [],
  },
  {
    id: 'net.11.3',
    moduleId: '4.11',
    packageId: 'networking',
    order: 3,
    title: 'What DHCP actually hands out',
    kind: 'multiple-choice',
    goal: 'Name everything a DHCP lease negotiates, not just the address.',
    prompt: 'When a device successfully receives a DHCP lease, which of the following does it typically obtain? Select all that apply.',
    teach: {
      concept:
        'DHCP negotiates far more than just an IP address. A lease also typically carries the SUBNET ' +
        'MASK, so the device knows which addresses are local versus remote, the DEFAULT GATEWAY, so it ' +
        'knows where to send traffic leaving the subnet, and one or more DNS SERVERS, so it can resolve ' +
        'names at all. The exchange happens in four steps, commonly remembered as DORA: the client ' +
        'DISCOVERs a server by broadcasting, the server OFFERs a lease, the client REQUESTs it, and the ' +
        'server ACKNOWLEDGEs, at which point the lease, and everything that came with it, is actually ' +
        'usable.',
    },
    options: [
      { id: 'a', label: 'An IP address, along with the subnet mask needed to interpret it.' },
      { id: 'b', label: 'The default gateway the device should use for traffic leaving the local subnet.' },
      { id: 'c', label: 'One or more DNS servers the device should use for name resolution.' },
      { id: 'd', label: 'DHCP negotiates an IP address only; every other setting must always be configured manually.' },
    ],
    hints: [
      'Three describe genuine, standard parts of a DHCP lease. One drastically undersells what DHCP actually hands out.',
    ],
    solution:
      'A, B, and C. A DHCP lease routinely includes the subnet mask, gateway, and DNS servers alongside ' +
      'the address itself, which is why a correctly configured DHCP scope is often all a device needs to ' +
      'become fully network-functional with no manual configuration at all.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'A DHCP lease routinely includes the subnet mask, default gateway, and DNS servers, not just the IP address.',
      },
    ],
    debrief:
      'This is why a device with the wrong DNS behaviour, or one that cannot leave its own subnet, is ' +
      'often a DHCP scope misconfiguration rather than anything wrong with the device itself, the whole ' +
      'set of settings comes from the same place.',
    practice: [],
  },
  {
    id: 'net.11.4',
    moduleId: '4.11',
    packageId: 'networking',
    order: 4,
    title: 'When the scope runs out',
    kind: 'short-answer',
    goal: 'Explain what DHCP scope exhaustion actually looks like from the affected device\'s side.',
    prompt:
      'A DHCP scope is sized for 50 addresses, but 55 devices are now trying to use it at once. In two or ' +
      'three sentences, explain why the scope runs out and what happens to a device that requests an ' +
      'address after it has.',
    teach: {
      concept:
        'A scope is a fixed pool: once every address in it is leased out and none have expired or been ' +
        'reclaimed, there is nothing left to offer. A new device broadcasting a DHCP discover in that ' +
        'state gets no offer at all, since the server has nothing to hand out. On Windows specifically, a ' +
        'device that fails to get a lease often falls back to APIPA, a self-assigned address in the ' +
        '169.254.x.x reserved link-local range, which lets it talk to other devices on the same local segment that also ' +
        'have an APIPA address, but gives it no gateway and no DNS, so it effectively cannot reach anything ' +
        'beyond the local link. Seeing a 169.254.x.x address on a device is one of the clearest signs of ' +
        'DHCP failure available, precisely because Windows chose it as a visible fallback rather than just ' +
        'failing silently.',
    },
    hints: [
      'A scope is a fixed pool of addresses. What happens once every one of them is already leased?',
      'Name what a Windows device typically self-assigns when DHCP fails, and what that address range is.',
    ],
    solution:
      'The scope has a fixed number of addresses to hand out, and once all 50 are leased with none expired ' +
      'or reclaimed, there is nothing left to offer a new device. A device that requests an address after ' +
      'the scope is exhausted gets no offer at all, and on Windows it commonly falls back to a ' +
      '169.254.x.x APIPA address in the reserved link-local range, which lets it talk to other devices on the same local segment but ' +
      'gives it no gateway or DNS, so it cannot reach anything beyond the local link.',
    expectedOutput: 'An answer explaining pool exhaustion and naming the APIPA 169.254.x.x fallback and its limitations.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['exhaust', 'pool', 'no addresses left', 'ran out', 'nothing left'],
          ['169.254', 'apipa', 'self-assign'],
        ],
        hint: 'Explain that the pool is fixed and has run out, and name the 169.254.x.x APIPA address Windows commonly self-assigns as a fallback.',
      },
    ],
    debrief:
      'A 169.254.x.x address is one of the fastest diagnostic signals in networking: it means "this device ' +
      'never actually got a DHCP lease," full stop, before you have checked anything else about the ' +
      'network.',
    practice: [],
  },
  {
    id: 'net.11.5',
    moduleId: '4.11',
    packageId: 'networking',
    order: 5,
    title: 'Why you exclude addresses from a DHCP scope',
    kind: 'multiple-choice',
    goal: 'Explain the purpose of DHCP exclusions, and what happens without them.',
    prompt: 'A DHCP scope for 10.0.0.0/24 excludes the range 10.0.0.1 to 10.0.0.10. Which of the following correctly describe why an administrator would do this? Select all that apply.',
    teach: {
      concept:
        'Infrastructure that needs a predictable, unchanging address, the gateway router, a printer, a ' +
        'server, is normally given a STATIC IP rather than a DHCP lease. If that static range overlaps with ' +
        'the DHCP scope, the DHCP server has no way to know the address is already taken and can hand the ' +
        'same address out to a device requesting a lease, producing an IP CONFLICT: two devices on the ' +
        'network claiming the same address, which typically breaks connectivity for both of them in a way ' +
        'that is confusing to troubleshoot because neither device\'s own configuration looks wrong. ' +
        'Excluding the statically-assigned range from the scope up front is what prevents the DHCP server ' +
        'from ever offering an address it does not actually own.',
    },
    options: [
      { id: 'a', label: 'Infrastructure like the gateway or a server often needs a predictable static IP that never changes.' },
      { id: 'b', label: 'If a static range overlaps the DHCP scope, the server can hand out an address that is already in use, causing a conflict.' },
      { id: 'c', label: 'Exclusions prevent the DHCP server from offering an address it does not actually own.' },
      { id: 'd', label: 'DHCP servers automatically detect and skip any address that has been statically assigned, so exclusions serve no real purpose.' },
    ],
    hints: [
      'Three describe the real reasoning behind exclusions. One claims DHCP does this automatically, which is why exclusions have to be configured explicitly.',
    ],
    solution:
      'A, B, and C. Static infrastructure needs a stable address, an overlap causes real conflicts, and ' +
      'exclusions are exactly how that overlap is prevented. D is false: a DHCP server has no built-in ' +
      'awareness of what has been statically assigned elsewhere, which is precisely why an administrator ' +
      'has to configure the exclusion themselves.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'A DHCP server has no automatic awareness of statically assigned addresses, which is exactly why exclusions have to be configured by hand.',
      },
    ],
    debrief:
      'An IP conflict is one of the more confusing failures to troubleshoot precisely because it can look ' +
      'like two completely unrelated problems on two different devices, when the real cause is one missing ' +
      'exclusion on the DHCP scope.',
    practice: [],
  },
];

// --- the package -------------------------------------------------------------

export const NETWORKING: LearningPackage = {
  id: 'networking',
  order: 4,
  title: 'Networking Basics',
  summary:
    'Work out what a machine is, what it is talking to, and whether it should be. Ends by finding an active exfiltration connection that has been hiding in plain sight since Linux Fundamentals.',
  outcomes: [
    'Identify a host\'s addresses, interfaces, and default gateway',
    'Tell an internal address from an external one at a glance',
    'Read a netstat table and separate open doors from live conversations',
    'Connect a port to the process that owns it',
    'Resolve names forwards and backwards, and know which file overrides DNS',
    'Compute a network address, broadcast address, and usable host count from an address and prefix',
    'Explain what a static or default route, and a DHCP lease, actually do, and diagnose the most common failures in each',
    ...PACKET_OUTCOMES,
  ],
  prerequisites: ['linux-fundamentals'],
  modules: [
    {
      id: '4.1',
      packageId: 'networking',
      order: 1,
      title: 'What this machine is',
      summary: 'Addresses, interfaces, routes, and reachability.',
      exercises: MODULE_4_1,
    },
    {
      id: '4.2',
      packageId: 'networking',
      order: 2,
      title: 'What it is talking to',
      summary: 'Listening sockets, live connections, and the one that should not be there.',
      exercises: MODULE_4_2,
    },
    {
      id: '4.3',
      packageId: 'networking',
      order: 3,
      title: 'Names and resolution',
      summary: 'Forward and reverse lookups, resolvers, and the file that quietly overrides them.',
      exercises: MODULE_4_3,
    },
    {
      id: '4.4',
      packageId: 'networking',
      order: 4,
      title: 'What is exposed, and to whom',
      summary:
        'The listener inventory, what a bind address says about blast radius, and checking what is running against what should be.',
      exercises: MODULE_4_4,
    },
    {
      id: '4.5',
      packageId: 'networking',
      order: 5,
      title: 'Reading a connection as a direction',
      summary:
        'Which end dialled, socket states, and the pivot from a session to the process and the account behind it.',
      exercises: MODULE_4_5,
    },
    // Modules 4.6 to 4.9 read the wire rather than the host. They live in their
    // own file because they are a different skill with a different tool -- see
    // the header of networking-packets.ts.
    ...PACKET_MODULES,
    {
      id: '4.10',
      packageId: 'networking',
      order: 10,
      title: 'Subnetting and VLANs',
      summary: 'The Virtual Networking Lab, part one: CIDR arithmetic, and why splitting a flat network into VLANs is real segmentation with a real limit.',
      exercises: MODULE_4_10,
    },
    {
      id: '4.11',
      packageId: 'networking',
      order: 11,
      title: 'Routing and DHCP',
      summary: 'The Virtual Networking Lab, part two: static versus default routes, why two correct subnets can still fail to reach each other, and what a DHCP lease actually negotiates.',
      exercises: MODULE_4_11,
    },
  ],
};
