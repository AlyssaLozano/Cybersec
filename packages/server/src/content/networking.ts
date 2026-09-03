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
        'Start from what an address even is. Every device that talks on a network needs one, the same way every house needs a street address before mail can find it. On this kind of network (IPv4), that address is written as four numbers from 0 to 255, separated by dots, like 10.20.6.40. No two devices on the same network share one.\n\n' +
        'A single machine is not always just one address, though. It has one or more INTERFACES, the doors it uses to reach a network, and each door gets its own address. A server usually has at least one real interface, commonly named eth0 (short for Ethernet), which is the one other machines actually use to reach it. Every Linux machine also has a second, special interface called LOOPBACK, named lo, fixed forever at the address 127.0.0.1. Loopback is a machine talking to itself: nothing sent to 127.0.0.1 ever leaves the box, which is why a database or a local tool can use it safely without exposing anything to the outside network.\n\n' +
        '`ip addr show` lists every interface on a Linux machine, one after another, with whatever address is assigned to it. When you run it, look for lines starting with the word `inet`, short for "internet address": that label marks the actual IPv4 address of the interface just above it, written like `inet 10.20.6.40/24`. Ignore the `/24` for now, it describes the size of this address\'s network and you will learn to read it in a later exercise. For today, the number before the slash is the answer.\n\n' +
        'This is the first thing this package teaches for a reason: almost every question you will ever ask about a connection, is it internal, is it external, does it belong here, starts from knowing your own machine\'s address first. You cannot recognise a stranger\'s car on your street if you do not know which street you live on.',
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
      `This host is ${HOST_IP}. Notice it starts with 10: that specific prefix is one of three address ranges (the others start 172.16 through 172.31, and 192.168) set aside by an internet-wide standard, RFC 1918, for PRIVATE use only. An address in one of those three ranges is guaranteed to be unreachable directly from the public internet, it only means something inside whatever private network it belongs to, the same way "Apartment 4B" only means something once you already know which building. Hold onto that: for the rest of this package, "does this address start with 10, 172.16 through 172.31, or 192.168" is the fastest question you can ask to tell an internal address from an external one.`,
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
        'The `ip` command is not really one tool, it is a small family of related tools bundled under one name. Each thing you ask it about is called an OBJECT: `addr` for addresses, `link` for the interfaces themselves, `route` for where traffic goes, and so on. You met `ip addr show` in the last exercise, which gave you interfaces AND their addresses together. Sometimes you want less than that: just a list of what network hardware exists, with nothing else cluttering the screen.\n\n' +
        'That is what the `link` object is for. It exists because a lot of the time the addresses are not the question, only the inventory is: how many interfaces does this machine have, and what are they called. Asking `ip link show` instead of `ip addr show` gets you exactly that, faster to read because there is less on the page.\n\n' +
        'Running it shows each interface\'s name and its hardware (MAC) address, without any IPv4 or IPv6 addresses attached. On this host that means two lines of detail: lo, and eth0.\n\n' +
        'This matters on a host you are investigating because the count and the names are themselves information. A machine that is supposed to have one network interface and turns out to have two, with a name like tun0 or ppp0 that nobody provisioned, is very often how somebody keeps a hidden route into a network open after the initial break-in. You cannot notice an extra door if you never counted the doors in the first place.',
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
      'Two interfaces, lo and eth0, is what a normal, single-homed server looks like: one loopback every Linux machine has by default, and one real interface for the network it actually sits on. That baseline is worth remembering for this host specifically, because the only way to recognise something extra is to already know what normal looks like. A tun0 or a second unexplained interface is worth asking about immediately: those names are how Linux typically labels a VPN tunnel or a point-to-point link, and legitimate ones are usually documented somewhere. One that is not documented is often how somebody keeps a route into a network open after the initial break-in, quietly, long after the original vulnerability has been patched.',
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
        'Every piece of data that crosses a network, a file, a password, a web page, gets broken into small chunks called PACKETS before it is sent. Think of a packet as a single envelope: it has a destination address, a return address, and a small amount of contents, and the network passes it from machine to machine until it reaches where it is going. Whether a distant machine will actually accept an envelope from you at all is a basic question you need answered before you try anything more complicated, and there needed to be a simple way to ask it.\n\n' +
        'That is what `ping` is for. It sends the smallest possible packet, essentially just an envelope with nothing but "are you there" written inside, and waits to see whether the other machine sends one back. Getting a reply proves two separate things at once: first, that the name you typed actually resolves to a real address (the hostname has to be translated into an IP address before anything can be sent, which you will learn properly in the next module), and second, that whatever is at that address is switched on, connected, and willing to answer.\n\n' +
        '`ping -c COUNT HOST` sends exactly COUNT packets to HOST and reports how each one did. Watch the round-trip time on each reply: under a millisecond usually means the other machine is on the same local network as you, tens of milliseconds usually means it is somewhere else entirely, another building, another data centre, possibly another country, with real distance and real equipment in between.\n\n' +
        'This is the first tool you reach for whenever somebody asks "is that server even up right now". It will not answer every question, you will learn its limits in the debrief below, but it answers that one in about three seconds, which is why it is usually the first thing anyone runs.',
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
      'A reply proves, beyond doubt, that the host is up, reachable, and running a network stack that responds. Silence proves almost nothing, and understanding why is important: ping relies on a specific, tiny protocol called ICMP, and a great many hosts (and the firewalls in front of them) are deliberately configured to ignore ICMP entirely, because answering it for free gives an attacker a trivial way to discover which addresses on a network have something listening. A well-secured, perfectly healthy server can go years without ever answering a ping. That is why "it does not ping" is not evidence a machine is off, or broken, or unreachable for anything else: it only tells you that this one, deliberately simple question went unanswered, and you need a different tool (like the ones in the next module) to find out why.',
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
        'Imagine a large office building where every desk can hand mail directly to any other desk on the same floor, but anything leaving the building has to go through the mailroom first, because the desk itself has no way to get an envelope onto a delivery truck. A network works the same way. A machine can send a packet directly to another machine only if that machine is on the same local network, reachable in one hop with no help. Anything else has to be handed off to a device called a GATEWAY (or router) that knows how to get it further along.\n\n' +
        'Every machine keeps a small list called a ROUTING TABLE that answers, for any destination, the question "do I send this directly, or do I hand it to the gateway?" Most of that table is short, because most machines only need one real rule: is the destination on my own local network, in which case send it directly, or is it anywhere else, in which case hand it to the gateway. That second rule is called the DEFAULT route, written as `default via <gateway address>`, and it is a catch-all: it matches anything that no more specific rule already covered.\n\n' +
        '`ip route` prints this table. Reading it tells you two things at a glance: which network this machine considers "local" (reachable without help), and which single address everything else gets funnelled through on its way out.\n\n' +
        'The gateway matters enormously in an investigation, because it is a chokepoint. Every single packet this machine sends to anywhere outside its own local network, legitimate traffic and an attacker\'s stolen data alike, passes through that one address on its way out of the building. When an incident response plan says "block this traffic", the gateway is very often where that block actually gets applied, because it is the one place all of it is guaranteed to pass through.',
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
      `Everything this server sends outside 10.20.6.0/24 goes through ${GATEWAY}, because that is exactly what the default route means: nothing else in the table matches those destinations, so this is the only rule left that applies. That is precisely why the gateway is such a useful chokepoint for defenders: you do not need to find and block every possible destination an attacker might use, you only need to control the one address that all of them are forced to pass through on the way out.`,
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
        'Linux networking tools tend to accumulate rather than get replaced cleanly. `ifconfig` is the older of the two tools for looking at interfaces, and technically it is DEPRECATED, which means its replacement (`ip`, which you used in the last few exercises) is the one actually being maintained and improved going forward. Deprecated does not mean gone, though: `ifconfig` is still installed on a huge number of real systems, plenty of documentation and scripts written years ago still call it, and you will keep running into it on the job for a long time yet, so it is worth being able to read.\n\n' +
        '`ifconfig eth0` shows one interface in detail. Two things about its output are worth knowing before you look. First, it writes the network\'s size as a NETMASK in dotted form, like 255.255.255.0, rather than as the slash-notation (/24) you saw with `ip addr`. They are two ways of writing the exact same information, and you will learn to read the dotted form properly in the debrief below. Second, `ifconfig` includes RX and TX counters, the total packets and bytes Received and Transmitted on that interface since it came up, which `ip addr` does not show by default.\n\n' +
        'Those counters matter in a way a raw address list does not: they tell you whether an interface is actually doing anything. An interface configured correctly but showing zero traffic might be unused, misconfigured, or a decoy. One with counters climbing every time you check it is genuinely carrying data, which is exactly the kind of quick sanity check worth running before you spend time investigating a connection more deeply.',
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
      'A netmask of 255.255.255.0 and a prefix of /24 are the exact same fact written two different ways: both say that the first three numbers of the address (the first 24 bits, out of 32 total) identify the NETWORK, and only the last number identifies the individual HOST on it. Two addresses that share those first three numbers are on the same local network and can reach each other directly, with no gateway involved, the way two desks on the same office floor can hand each other mail directly. So 10.20.6.40 and 10.20.6.99 are neighbours: same first three numbers, different last one. 10.20.4.31 is not a neighbour at all, it differs in the third number, which means it sits on a different network entirely and anything sent to it has to go through the gateway you read about in the last exercise.',
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
        'A SOCKET is one end of a network conversation, the software equivalent of a phone that is either sitting on the hook waiting to be called, or already connected to someone. Every program on a machine that talks over the network, a web server, a database, an SSH daemon, does it through one or more sockets, and at any moment a socket is in one of a handful of STATES. The two you will use constantly are LISTEN, meaning a service has set the phone down and is waiting for someone to call it, and ESTABLISHED, meaning a call is actually connected and in progress right now.\n\n' +
        'A machine can easily have dozens of sockets open at once, and there needed to be a way to see all of them in one place rather than asking each program individually. That is what `netstat` does: it reads the operating system\'s own internal record of every socket and prints it as a table.\n\n' +
        '`netstat -an` asks for two things together. The `-a` means ALL sockets, both the ones waiting (LISTEN) and the ones already talking (ESTABLISHED), rather than just one category. The `-n` means NUMERIC, and it matters more than it looks: without it, netstat tries to look up a hostname for every single address it prints, which is slow, generates extra DNS traffic of its own, and on an address with no reverse record (which you will meet properly in module 4.3), can leave a blank where the address you actually needed to read should have been.\n\n' +
        'This is the command you run first on any host you have not looked at before, precisely because it holds nothing back: everything the machine is doing on the network, all in one table, ready to be narrowed down.',
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
      'That is a lot at once, and that is deliberate: before you can safely throw anything away, you need to see everything that exists, or you risk filtering out the one line that actually mattered. This is the raw material. The next four exercises are all about cutting it down, one deliberate filter at a time, to the handful of lines that answer a specific question, rather than guessing which lines matter before you have even looked.',
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
        'A listening socket is a service standing at a door, announcing "I will accept connections here". Every one of them is a genuine way into this machine from the network, whether it was put there on purpose (the web server, so customers can reach the site) or by accident (a debug tool somebody forgot to turn off) or by an attacker (a backdoor listening quietly on an unusual port). Because every listener is a door, the full list of them is one of the very first things worth checking on any host you have just been handed: you cannot defend, or investigate, doors you do not know exist.\n\n' +
        '`netstat -tln` narrows the full socket table down to exactly that list: TCP sockets (`-t`) that are in the LISTEN state (`-l`), with numeric addresses (`-n`) so nothing gets hidden behind a slow or missing hostname lookup.\n\n' +
        'Once you have that list, read the Local Address column carefully, because it tells you WHO can reach each door, which matters as much as whether the door exists at all. An address of 0.0.0.0 means the service is bound to every interface the machine has, so it accepts connections arriving from any network it is attached to, effectively the whole world if the machine sits on the internet. An address of 127.0.0.1 means it is bound to loopback only, the special always-yourself address from net.1.1, so the service can be reached only by something already running on this exact machine, nowhere else, no matter how the network around it is configured.\n\n' +
        'That distinction, 0.0.0.0 versus 127.0.0.1, is the difference between a database sitting wide open to the internet and one that is perfectly safe. It is worth being able to read on sight.',
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
      'Four doors are open to the network from outside this machine: 22 (SSH, for administrators), and 80 and 443 (the web server, for everyone). Postgres on 5432 and the application server on 8080 are bound to 127.0.0.1 instead, so nothing on the network, not a colleague\'s laptop, not an attacker probing from outside, can reach them directly at all: the only way to talk to Postgres is to already be running something on this exact machine, which in practice means going through the web server that sits in front of it. That is precisely why binding a database to loopback rather than to every interface matters so much: it turns "this database is only as secure as its password" into "this database cannot be reached over the network in the first place", which is a far stronger guarantee.',
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
        'A PORT NUMBER is the second half of an address: the IP address gets a packet to the right machine, and the port number gets it to the right program running on that machine, the way a street address gets mail to the right building and an apartment number gets it to the right door inside. Port numbers below 1024 are largely governed by convention rather than by any technical rule: port 22 is CONVENTIONALLY used for SSH, port 80 for web traffic, and so on, because everybody agreed to follow the same convention decades ago and installers default to it. But a convention is not an enforcement mechanism. Nothing stops a program, including one an attacker planted, from opening a listening socket on any port number it likes, calling it whatever it wants, or hiding a backdoor behind the number everyone assumes is safe.\n\n' +
        'That is why `-p` matters: it makes netstat show the actual PID (process ID, a number the operating system assigns to every running program) and program name that holds each socket, alongside the port. That is the difference between "port 22 is open", which is a guess about what the service probably is, and "sshd is listening on port 22", which is a fact about what is actually running there.\n\n' +
        'To get from the full listener list down to just the one port you care about, this exercise introduces a PIPE, written as the `|` character. A pipe takes the output of the command on its left and feeds it as input into the command on its right, rather than printing it to the screen and stopping. `netstat -tlnp | grep :22` runs netstat, then hands its output straight to `grep`, which keeps only the lines containing the text you asked for, in this case the port number. Chaining small commands together with pipes like this, rather than writing one giant command that does everything, is one of the most useful habits in the whole field.',
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
      'sshd on 22 is exactly what should be there, and confirming that took one command instead of an assumption. The reason this check is worth running, even when you expect a boring answer, is the case where it is not: a listener on port 22 owned by a process that is NOT sshd would mean something is impersonating the port everybody trusts, and sshd listening on some other, unexpected port could mean a configuration change nobody approved. Neither of those would show up if you only glanced at the port number and assumed the convention held. Verifying the boring answer, every time, is how you build the habit that eventually notices the interesting one.',
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
        'You already know LISTEN means a service is standing at a door, waiting. ESTABLISHED is the other socket state that matters day to day, and it means something has actually walked through that door: a real, live connection exists right now, between two specific endpoints, and netstat names both of them, the Local Address on this machine and the Foreign Address on the other end.\n\n' +
        'The distinction matters because a listener only tells you what COULD happen, a service that is capable of accepting a connection, whether or not anyone ever does. An established connection tells you what IS happening: an actual conversation, in progress, at this exact moment, that somebody or something initiated. During an incident, that second question, who is actually talking to this machine right now, is usually the most urgent one on the list, because it is the one you can still act on. A door that is merely open is a risk to fix later; a conversation in progress might be the incident itself, unfolding while you watch.\n\n' +
        '`netstat -tn | grep ESTABLISHED` takes the same TCP, numeric view you have been using and filters it down to just that: the live conversations, stripped of every listener that is merely waiting.',
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
      'Five conversations. Two of them are the machine talking to itself over loopback: one internal service calling another, the application server calling the database perhaps, the same pattern net.1.1 described, traffic that never leaves the box and can never be a threat from outside it. The other three involve real, external addresses, connections that actually crossed the network to reach (or leave) this host, and by definition those are the only three worth reading closely. One of them is about to matter a great deal.',
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
        'Ordinary `grep PATTERN` keeps every line that DOES contain the pattern, throwing everything else away. `grep -v PATTERN` does the exact opposite: it keeps every line that does NOT contain the pattern, and throws away every line that does. The `-v` stands for invert. It is a small flag with a large effect on how you work, because it lets you subtract a category you already understand instead of only ever selecting a category you are looking for.\n\n' +
        'That distinction, selecting versus subtracting, is close to the whole method behind an investigation. You almost never start knowing exactly what you are looking for; you start with everything, and you remove the parts you can already explain, one confirmed-harmless category at a time, until whatever is left is small enough to read line by line and account for individually. Loopback traffic, the machine talking to itself, is usually the very first thing you can explain and remove on any host, because you already know from net.1.1 that nothing sent to 127.0.0.1 ever reaches the outside network, so it can never itself be the channel an attacker used.\n\n' +
        '`netstat -tn | grep ESTABLISHED | grep -v 127.0.0.1` chains three steps: get the connections, keep only the live ones, then throw away the ones talking to loopback, leaving only conversations that actually crossed the wire to or from somewhere else.',
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
      'Three lines left, from five, because subtracting the two loopback conversations removed exactly the noise it was supposed to and nothing else. Two of the three remaining lines are internal office machines on the company\'s own 10.x network connecting IN over SSH and HTTPS, which is precisely what a web server with administrators is supposed to see all day, completely unremarkable. Read the third one carefully before moving on: it is not internal, and it is not somebody connecting in.',
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
        'Every connection has a direction: one side dials, and the other side answers. A web server\'s entire job is to be the side that answers, sitting by the phone all day waiting for customers to call in on port 443. It has no ordinary reason to ever be the side that DIALS OUT, the way a receptionist\'s desk phone has no ordinary reason to be the one placing calls to strangers. So the direction of a connection, not just its existence, is one of the most useful facts you can read out of a socket table: traffic arriving at this host on port 443 is the job working exactly as designed, and traffic leaving this host toward some other address is a fundamentally different kind of event, one that needs its own explanation.\n\n' +
        'Adding `-p` to the command turns a bare connection into an accountable one, by naming the process that actually holds the socket. That distinction matters enormously here: a connection made BY a background service the machine is supposed to run (checking for software updates, say) is routine, while a connection made by a general-purpose tool like `curl`, which exists specifically to fetch or send arbitrary data to an arbitrary address on request, run by nothing that is part of this server\'s normal job, is one of the single strongest signals available in the entire field of security monitoring. It says, in effect: something on this machine is reaching out and moving data to somewhere of its own choosing.\n\n' +
        '`netstat -tnp | grep ESTABLISHED | grep -v 127.0.0.1` is the same chain you have already built, now with the process names attached, so you can read direction and ownership in the same table.',
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
      `That connection has been open on this host since Linux Fundamentals, and you have only now had the tools to actually see it. ${EXFIL} is not a Ridgeline address at all: it does not begin with the company's internal 10.x prefix, which by the rule from net.1.1 means it can only be a real, routable address somewhere out on the public internet. The process is curl, a general-purpose file transfer tool, not one of the services this host is supposed to be running, which means whatever it is doing was started deliberately, by someone or something with a specific file in mind, rather than being part of how this server normally behaves. A patient-portal web server has no legitimate reason to be uploading anything to an address nobody here recognises. In Log Analysis you found how somebody got in; this is what they have been doing ever since, in plain sight, waiting for someone with the right tools to notice.`,
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
        'Computers route packets by number, but people, and log files, deal in names: portal.ridgelinemed.example is far easier to remember and recognise than 10.20.6.40. DNS, the Domain Name System, is the machinery that bridges the two: a distributed set of servers whose job is to answer one question, "what address does this name point to right now", the way a phone book answers "what number does this name point to". Every time you type a web address into a browser, or a log records a hostname instead of a bare number, DNS is what made the connection between the two possible.\n\n' +
        '`dig` asks a DNS resolver that question directly and shows you the FULL response, not just the final answer, including which server actually replied and how it got there. The part you want to read is the ANSWER SECTION, which is where the resolved address itself appears.\n\n' +
        'Doing this lookup yourself, rather than trusting whatever an application already resolved on your behalf, matters in an investigation for a specific reason: a name written in a log file is only meaningful once you know what address it pointed to AT THE TIME the log entry was written, and that mapping is not fixed. The same name can point to a different address tomorrow, an attacker can register a name that briefly points somewhere malicious and then moves it, and a log that only recorded the name leaves you needing to check, deliberately, what it actually meant.',
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
      `The portal resolves to ${HOST_IP}: this host. That is worth noticing, because it connects two facts you had separately: the machine you have been investigating throughout this package IS the public-facing patient portal, the exact thing the company puts in front of real patients on the internet. That is precisely why it needed ports exposed on 0.0.0.0 back in net.2.2 rather than tucked away on loopback, a public portal has to be reachable by the public, and it is exactly why it was the target being brute-forced all morning: an attacker cannot try passwords against a machine they cannot reach, and this is the one machine in the whole company that anyone on the internet can reach by design.`,
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
        'A REVERSE lookup runs the same phone-book idea from the last exercise backwards: instead of starting with a name and asking for the address, you start with a bare address, the kind you find sitting in a log file with no explanation attached, and ask DNS what name (if any) is registered to point back at it. Not every address has one, but on a well-run internal network, most of the machines that matter do, because giving infrastructure a real, registered name rather than leaving it as a bare number is exactly what makes a log readable months later.\n\n' +
        'This is one of the single fastest ways to make sense of an unfamiliar address sitting in a log. Internal infrastructure is nearly always named DESCRIPTIVELY, rmg-backup-01, rmg-monitor-01, and so on, precisely so that a name alone tells you roughly what a machine is for. That means a reverse lookup often answers, in one command, a question that would otherwise take real digging: not just "what is this address called" but "should this machine plausibly be doing whatever the log says it was doing".\n\n' +
        '`nslookup ADDRESS` (or `dig -x ADDRESS`, where -x specifically means reverse) hands an address to the resolver and returns whatever name is registered against it, if one exists.',
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
      'It is the monitoring server, and knowing that changes everything about how those log entries should be read. Five hundred and seventy-six authentication failures, all day, arriving every five minutes on a perfectly regular schedule: that clockwork rhythm is itself a clue, a human attacker guessing passwords does not typically pause for exactly five minutes between every single attempt, but an automated health check running on a timer does exactly that. Put together with the reverse lookup, the picture resolves completely: it is the company\'s own monitoring box, configured with a password that went stale after a rotation, retrying on schedule and failing every time. One reverse lookup turns the noisiest thing in the entire log into a five-minute ticket for whoever owns the monitoring system, and takes it off your incident list entirely, which is exactly the kind of fast, confident elimination that lets you spend your real attention on the entries that do not have such an easy explanation.',
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
        'Every single name lookup this machine ever makes, whether triggered by a person running `dig` or by a web server silently resolving something in the background, has to actually be sent SOMEWHERE: to a specific DNS resolver, a server whose job is to go and find the answer. Which resolver a Linux machine uses is not hardcoded into the operating system, it is configured, in a plain text file at /etc/resolv.conf, which means reading it needs no special tool at all, `cat`, the same command you would use on any other text file, shows you exactly what this host has been told to trust.\n\n' +
        'That file matters in an investigation for a reason that is easy to miss: changing a host\'s configured resolver is a quiet, effective way to redirect where its traffic ultimately goes, without touching a single application on the machine. If an attacker (or a piece of malware) can get a host to ask a nameserver they control instead of the company\'s own, they can hand back whatever address they like for any name the host asks about, silently rerouting connections the machine believes are going somewhere legitimate. A resolver entry pointing at a server nobody on the team recognises is exactly the kind of change worth explaining before you move on.',
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
      'Both resolvers are on the internal 10.20.1.x network, which is exactly what you want to see, because it means every lookup this host performs is answered by infrastructure the company itself controls and can monitor. A host configured to use a public resolver instead, or one nobody on the team recognises, is bypassing whatever DNS-based filtering and logging the company built specifically to catch malicious lookups, and that bypass can happen two ways: sometimes by accident, a well-meaning misconfiguration, and sometimes very deliberately, as one of the first things an attacker changes once they have a foothold, so that their own traffic never touches the monitored path at all.',
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
        'Before this machine ever sends a name out to the DNS resolvers you just read about in /etc/resolv.conf, it checks one more file first: /etc/hosts, a simple local list of name-to-address mappings kept right on the machine itself. This ordering, local file first, network lookup second, predates DNS itself: in the very early internet, before DNS existed at all, every machine kept its own complete list of every other machine\'s name and address, and /etc/hosts is the living fossil of that original system, still consulted first on every Linux and Windows machine today.\n\n' +
        'Whatever is written in /etc/hosts WINS, unconditionally, no matter what the actual DNS nameserver would have said for that same name. That makes it genuinely useful for small, deliberate local overrides, and it makes it just as attractive to an attacker for exactly the opposite reason: adding a single line to this file can silently redirect any name, a software update server, an internal tool, to an address of the attacker\'s choosing, and because the redirect happens locally, before any lookup ever leaves the machine, no DNS log anywhere on the network will ever show it happened. `cat /etc/hosts` shows you every static mapping this machine has been given, plain text, no special tool required.',
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
      'Everything here is internal and expected: loopback entries, the company\'s own Ridgeline hosts, nothing surprising. The check worth remembering for the future is the one that finds a NAME that should resolve out on the public internet, a software update server, say, pointed instead at an internal or unfamiliar address inside this file. That mismatch is a redirect in progress, and it is one of the quietest kinds an attacker can set up, precisely because /etc/hosts is checked before DNS ever gets asked: the redirect never generates a DNS query, never shows up in a DNS log, and never touches the network monitoring built to watch for exactly this kind of thing. This file, read directly on the host itself, is the only place a redirect like that is visible at all.',
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
        'You already know from module 4.2 that a listening socket is a door: something on this host is standing ready to accept a connection through it. Module 4.4 asks the next question a defender always needs answered about those doors, taken as a whole: exactly how many are there, and which programs put them there? Some doors were installed on purpose, the web server needs one, SSH needs one, and the gap between the doors you meant to install and the complete, actual list is most of what an attacker is looking for the moment they land on a host: an unexplained door is often the easiest way in, or the one they themselves just installed.\n\n' +
        'Building that complete inventory is a single command, and it is worth learning as one memorised unit rather than four separate flags you reconstruct each time. `netstat -tlnp` restricts the output to TCP (`-t`), shows only sockets in the LISTEN state (`-l`), keeps every address and port as a plain number rather than trying to resolve it to a name (`-n`), and names the process that actually owns each socket (`-p`). Run together, those four letters answer, in one line of typing, "what is this machine offering to the network, and what program is behind each thing it offers". It is the first command worth running on any host you have never seen before, precisely because it establishes the baseline everything else in this module compares against.',
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
      'Four programs, several sockets between them, and a raw count on its own does not yet tell you how exposed this host actually is, because a listening socket is not automatically reachable from the network: WHERE it is bound to matters just as much as whether it exists. Now the real question, which the next exercise asks directly: of everything on this list, which sockets can another machine actually reach, and which are only reachable from this host itself?',
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
        'A listening socket is not just tied to a port number, it is BOUND to a specific local address too, and which address a service chooses to bind to is a decision about exactly who is allowed to reach it. "Bound to" means the operating system has reserved that address-and-port pair for this one program specifically, and the choice of address is not decoration, it is the blast radius.\n\n' +
        'A socket bound to 127.0.0.1 accepts connections only from processes running on this host itself: nothing on the network, not a colleague\'s laptop, not an attacker probing from outside, can reach it, no matter what a firewall in front of the machine does or does not allow, because the connection would have to arrive from the network in the first place and this socket simply never listens there. A socket bound to 0.0.0.0 accepts connections arriving on EVERY interface the machine has, which means anything that can route a packet to this box at all can knock on that door.\n\n' +
        'This single distinction explains a large share of real security findings. A database bound to 0.0.0.0 is an incident waiting to happen, reachable by anyone who can reach the network at all; the exact same database bound to 127.0.0.1 is fine, unreachable from outside no matter what else goes wrong. When you read a listener table from now on, read the left-hand address first, and the port second.\n\n' +
        'One trap to know about before you write the filter. Every listener row ALSO shows 0.0.0.0:* in its foreign-address column (the placeholder meaning "any remote address, since nobody has connected yet"), so a pattern of just "0.0.0.0:" matches every row including the loopback ones, and hands you a number twice as reassuring as it should be. Requiring a digit after the colon pins the match to a real local port and excludes the wildcard column.',
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
    debrief: `${EXPOSED_TCP.length} sockets are reachable from off this host and ${LOOPBACK_TCP.length} are not, and that split matters more than the total listener count from the last exercise ever could, because the two groups face completely different risk. A loopback-only socket cannot be attacked from the network at all, however badly misconfigured it is internally; a socket bound to 0.0.0.0 can be probed, scanned, and attacked by anything that can route a packet here. That first number, ${EXPOSED_TCP.length}, is this host's actual external attack surface, the honest count of what an outside attacker could even attempt to touch, and it is the number worth putting in a report rather than the total, which mixes in services that were never at risk from the network in the first place.`,
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
        'You now know that where a socket is bound determines who can reach it, so a well-built host applies that knowledge deliberately: anything that does not need to face the network at all gets bound to 127.0.0.1 on purpose, the database, the application server sitting behind the reverse proxy, the local mail submission socket. Traffic reaches those services only by going through something that IS exposed and was built to be, the web server out front, which gives a defender exactly one front door to watch and harden instead of five separate ones each with their own risk.\n\n' +
        'When you find the opposite of that pattern, a database or an admin interface bound wide open to 0.0.0.0 with nothing forcing traffic through a single controlled front door, you have found a finding worth writing up even though nothing has gone wrong yet. That is the difference between VULNERABILITY work, finding and fixing weaknesses before anyone exploits them, and INCIDENT work, responding after somebody already has, and both of them start from reading exactly this table.',
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
      'The database and the application server are private, bound to loopback where nothing on the network can reach them directly, and the web server in front of them is not, deliberately exposed because its entire job is to be reachable. That is the shape you want on any host built with this pattern in mind: one exposed front door, a controlled number of private services behind it that can only be reached by going through that front door first. Noticing when a host does NOT have that shape, a database that should be tucked behind a web server but is instead sitting on 0.0.0.0 for no defensible reason, is a large part of what hardening work actually is: not inventing new controls, but noticing where an existing, well-understood pattern was not followed.',
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
        'You met port numbers back in net.2.3 as the second half of an address, the part that gets a packet to the right program rather than just the right machine. A handful of those numbers carry meaning worth reading on sight, the same way you would recognise a familiar area code: 22 is SSH, 25 is SMTP (mail), 53 is DNS, 80 and 443 are HTTP and HTTPS, 5432 is PostgreSQL, 3306 is MySQL, 3389 is RDP. Recognising them turns a socket table from a wall of digits into something closer to a sentence describing what the machine actually does.\n\n' +
        'Equally worth reading is the shape of the numbers that are NOT well known. When a machine initiates an outgoing connection, the operating system has to pick a port for the CLIENT side of it, since the server side will be using its well-known port (443 for HTTPS, say), and the two ends can never share the exact same port number on the exact same connection. It hands out a number from the EPHEMERAL range, roughly 32768 and above, essentially at random, used for exactly one connection and then released. That means a high port on the LOCAL side of an established socket tells you, for free, without checking anything else, that this host was the one that reached OUT and opened the connection, because nothing would assign itself a random high number on the receiving end of an incoming connection it did not initiate.',
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
    debrief: `Look at the socket with local port ${EXFIL_SOCKET.localPort}. A high, ephemeral local port paired with 443 on the far side is exactly the signature you just learned to read: this host was the one that dialled, opening an HTTPS connection OUTWARD to somewhere, rather than accepting one arriving on its own well-known port. Web servers serve, meaning their entire job is to sit on the well-known side of a connection and answer requests; they do not usually browse, which is another way of saying they have no ordinary reason to hold the ephemeral side of an outbound session at all.`,
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
        'An inventory like the one you have been building in this module is only useful once you compare it against an EXPECTATION, some idea of what this host is actually supposed to be running. The productive question is never "what is listening" in isolation, it is "what is listening that nobody here can explain", and answering that second question means walking in already knowing, roughly, what this machine\'s job is.\n\n' +
        'A search that returns nothing is a genuinely good outcome here, and it is still worth running rather than skipped, because confirming an absence takes seconds and it is the only way to turn a belief ("I think we do not run MySQL on this box") into a statement you can actually defend to someone else. One thing worth knowing about the tool itself: `grep` signals "I found nothing" by exiting with a non-zero status code rather than printing an error message, which is a perfectly normal, successful outcome, not a sign that your command failed or was typed wrong.',
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
      'Nothing there, and now you can say so with confidence rather than assumption. Half of any real assessment is a documented list of things you specifically checked and did not find, not just the things you did find, because a report that only lists problems, with no visible evidence of what was ruled out, gives the reader no way to tell a thorough check apart from one that simply never looked. Writing down the absence is what makes the presence, when you do find something, credible.',
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
        'A busy host holds a lot of connections to itself at any given moment: the web server talking to the application server behind it, the application server talking to the database behind that, all of it happening over loopback, the same always-yourself address from net.1.1. Every one of those is noise for an investigation specifically because nothing about them ever crossed a wire, an attacker on the outside could never have touched them, and left in the table they crowd out the handful of connections that actually did cross the network, the ones worth your attention.\n\n' +
        'Removing them is the same subtraction move from net.2.5, one inverted match on the loopback address, applied again here because it remains the single highest-value filter available on almost any host: whatever survives it is, by definition, the set of conversations this machine is having with the outside world, and that set is usually short enough to read and account for line by line, which is exactly the state you want to be in before you start drawing conclusions.',
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
    debrief: `Three conversations with the rest of the world, down from a much noisier starting table once the self-talk was subtracted away. Three is a short enough list that there is no excuse for leaving even one of them unexplained, and that is genuinely the standard worth holding any host to: not "most of the traffic looks fine", but every single external conversation accounted for by name, because the one you wave past without checking is exactly the one that turns out to matter.`,
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
        'Direction is not written anywhere as a labelled field in a socket table, there is no column that says "inbound" or "outbound", and yet you can read it anyway using exactly the port-number logic from net.4.4. The end of a connection holding the WELL-KNOWN port (443, 22, and so on) is the server, the side that was sitting there waiting; the end holding the high, ephemeral port is the client that actually dialled out. So a socket whose local port is some high number like 44218 and whose remote port is 443 was opened BY this machine, TO that address, not the other way around, and you know that from the shape of the two numbers alone, without needing any extra label.\n\n' +
        'On a web server, that is a question worth asking about every single outbound session you find, because as you learned in net.4.4, a server\'s whole job is to be dialled, not to dial. A legitimate exception exists, a package manager checking for updates, a licence server being checked in with, and those go to addresses you can name and explain in a sentence. One that does not fit that pattern is exactly what this exercise is built to find.',
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
    debrief: `A web server holding an outbound HTTPS session to an external address, and owned, once you add -p, by ${EXFIL_PROCESS.command.split(' ')[0]} rather than by any of the services this host is actually supposed to run. That ownership detail is exactly the kind of thing a bare connection cannot tell you on its own, direction alone says "this host reached out", but only the process name says "and here is specifically what did the reaching". Note the pid, the numeric process identifier attached to it: the next exercise turns that single number into a full command line and the account that ran it, an actual person.`,
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
        'A connection tells you WHERE data went; a process tells you WHAT sent it and WHO ran it. The PID, process ID, a small number the operating system assigns to every running program the moment it starts, is the bridge between the two, and it is exactly what the -p flag in the last few exercises has been quietly attaching to every socket you looked at. Crossing that bridge, from a bare pid to the actual program behind it, is one of the single most productive moves available whenever something on a host looks wrong, because a socket by itself can only describe an address; a process can describe an action.\n\n' +
        '`ps aux` lists every process currently running on the machine, one line each, with its owning user, its resource usage, and its FULL command line exactly as it was originally typed or launched. Filtered down to one specific pid, it turns "something is talking to an address I do not recognise" into an actual command, an actual user account, and an actual start time, which is usually enough on its own to decide whether you are looking at a genuine incident or just an unfamiliar but perfectly ordinary colleague\'s script.',
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
    debrief: `An upload of /tmp/.cache/pt.tar.gz to an external host, running as the user ${EXFIL_PROCESS.user}, and that full command line is what finally makes the whole chain readable in one line: a specific account, running a specific tool, sending a specific file, to a specific address. If you worked through Log Analysis, you have seen both of those details before, separately: that account was created through sudo at 10:22, and that archive file was built from the portal exports directory at 11:06. Neither fact, on its own, told the whole story. Seen from the network side, with a pid connecting a live socket to a live process, they finally do: this is the same intrusion you first found the entry point for, now caught in the act of taking data out.`,
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
        'A socket table mixes together several distinct STATES at once, and they mean genuinely different things to an investigation, not just cosmetic labels. ESTABLISHED is a live session, happening right now, and it is the only one of the states you can actually act on directly, by killing the process holding it or blocking the connection. TIME_WAIT is the leftover residue of a connection that has already finished and closed: the operating system deliberately keeps a record of it around for a couple of minutes afterward, specifically so that any packet from that old, finished conversation which is still wandering the network late does not get mistaken for part of a brand new connection that happens to reuse the same port. LISTEN, which you already know, is a service simply waiting.\n\n' +
        'The practical consequence of that distinction: a TIME_WAIT entry is evidence that a conversation HAPPENED, in the recent past, not that one is happening now. Reporting it as a live, ongoing connection is a mistake that gets noticed quickly by anyone who checks, and missing it entirely means missing the only trace left behind of a session that ended a minute before you happened to log in and look.\n\n' +
        '`ss` is the modern replacement for netstat, faster and reading its information more directly from the kernel, and it abbreviates the live state as ESTAB rather than spelling out ESTABLISHED, a small difference that trips people up constantly when they copy a grep pattern written for one tool over to the other without checking.',
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
      'Note that ss says ESTAB where netstat says ESTABLISHED, spelled differently for the exact same state. A grep pattern written and tested against one tool\'s output will silently return nothing at all when pointed at the other, not an error, just an empty result that looks, at a glance, exactly like "no established connections exist", which is a very different and far more reassuring claim than "my filter did not match anything in this tool\'s spelling". That is a good general habit to take away: check your filter against a small piece of raw, unfiltered output before you trust an empty result, especially the first time you use a command you have not run before.',
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
        'This is the exact command you run right before you hand a host over to somebody else, whether that is the next shift, another analyst, or a closing note on an incident, and its output is meant to be short enough to annotate line by line: this one is the administrator who is logged in right now, this one is a customer using the web server normally, this one is unexplained and needs to be someone else\'s next question.\n\n' +
        'The discipline that actually matters here is accounting for ALL of them, including the boring, obviously-fine ones, not just the alarming one. An analyst who carefully explains the alarming session and simply ignores the other two has not actually established that there is only one problem on this host, they have only found the one problem that was already easy to see. A complete handover names every single external session, so whoever reads it next can trust that nothing was skipped rather than having to wonder.',
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
      'Three sessions: an administrator on SSH, a user on the web server, and an upload to an address nobody can name. Two of those are explainable in a single sentence each, exactly the kind of boring, immediate explanation a well-run host should offer for almost everything it is doing. The third resists that same one-sentence test completely, no service explains it, no known process owns the destination, no business reason accounts for the data leaving, and that resistance, an event that simply will not fit the pattern everything else fits, is what turns "one of three connections" into "your incident".',
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
        'Think back to net.1.5, where you learned that a netmask like 255.255.255.0 (written as /24) splits an address into a NETWORK part and a HOST part: the network part identifies which subnet a machine belongs to, and the host part identifies the machine itself within it. The number after the slash, the PREFIX LENGTH, is just a count: it says how many of the address\'s 32 bits are spent on the network part. Everything left over is HOST BITS, the part that varies from one machine to the next within that same subnet.\n\n' +
        'A /26 prefix uses 26 bits for the network and leaves 32 minus 26, 6 bits, for the host. Those 6 leftover bits can represent 2 to the power of 6, 64, different values, which means the whole address space splits into blocks of exactly 64 consecutive addresses each, back to back, with no gaps and no overlaps. Because those blocks are laid down starting at address zero and repeating every 64 addresses, they always begin on a multiple of 64 in the last number of the address: 0, then 64, then 128, then 192, and no other number.\n\n' +
        'To work out which block a given address falls into, find the largest one of those multiples of 64 that is still less than or equal to the address\'s last number. 130 sits between 128 and 191 (the block that runs from 128 up to, but not including, the next block\'s start at 192), so the NETWORK ADDRESS, the address that identifies the block itself rather than any one machine in it, is 10.40.14.128. Every address from .128 to .191 belongs to that same subnet as .130, and none of them belong to the neighbouring block that starts at .192.',
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
      `Every address from ${SUBNET_A.network} to ${SUBNET_A.broadcast} is on this same subnet, because that entire range is exactly one block of 64 consecutive addresses and nothing else. ` +
      'That matters practically because of the rule you learned back in net.1.4: a device can only reach another device directly, with no router in between, if the two share the same network. So a device ' +
      'at .131 can reach a device at .190 directly, they are both inside this same 64-address block, but it cannot reach anything ' +
      'in the neighbouring block that starts at .192 without a router forwarding the traffic across the boundary between the two subnets, exactly the same "same network or hand it to the gateway" decision every machine makes for every packet it sends.',
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
        'A /27 prefix leaves 32 minus 27, 5 host bits, and 5 bits can represent 2 to the power of 5, 32, distinct values, so a /27 block contains 32 addresses total. But "contains 32 addresses" is not the same question as "can hand out 32 addresses to devices", and the gap between those two numbers is worth understanding, not just memorising.\n\n' +
        'Two specific addresses inside every single block, no matter its size, are set aside for the network itself rather than for any device on it. You already met the first one in the last exercise: the lowest address in the block is the NETWORK ADDRESS, the one that names the subnet as a whole rather than any machine inside it, so it cannot also be handed to a device without creating a naming conflict. The highest address in the block is the BROADCAST address, a special address that every single device on that subnet listens on simultaneously, used to send one message to everyone on the local network at once, and because it has to mean "everyone", it cannot also mean "one specific device".\n\n' +
        'That leaves 32 minus 2, 30 usable addresses for actual hosts. This minus-two is not specific to /27, it applies to every subnet size: ' +
        'the usable host count is always the block size minus exactly those two reserved addresses, never the raw block size itself.',
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
      'room to grow at all: a team of 30 people fits into a /27 with zero addresses left to spare once the network and broadcast addresses are accounted for, and the next new ' +
      'hire genuinely has nowhere to go until somebody re-plans the whole subnet, which usually means renumbering every device already on it. Planning with headroom, rather than against the exact device count, is what avoids that.',
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
        'Every device you have looked at so far in this package has lived on one single, FLAT network: every machine able to reach every other machine directly, with nothing splitting them apart. That is simple to set up, but it does not scale well, and it has a real security cost: every device shares the same broadcast domain, the group of machines that all receive the same broadcast traffic (the kind of "everyone, listen" message you met in net.10.2), which means a compromised device on a flat network can potentially see and reach every other device sharing that same network, whether it has any legitimate reason to or not.\n\n' +
        'A VLAN, Virtual Local Area Network, is a way of splitting one physical set of switches into several separate broadcast domains without running separate physical cabling for each one. Devices assigned to different VLANs simply do not receive each other\'s ' +
        'broadcast traffic, ARP requests, DHCP discovers, and so on, even though their cables plug into the exact same physical switch, which ' +
        'improves performance and, more importantly for security, containment: a compromised guest ' +
        'laptop broadcasting on the guest VLAN cannot see traffic on the voice or data VLAN by default, purely because the switch treats them as separate networks internally. ' +
        'VLANs also let different device classes get different treatment: phones prioritised for latency, ' +
        'guests denied access to internal resources, simply because the network can tell which group a device belongs to.\n\n' +
        'What VLANs do NOT do on their own is stop traffic ' +
        'between VLANs entirely. Something still has to ROUTE between them, the same concept from net.1.4 where a gateway decides whether traffic stays local or gets forwarded elsewhere, and unless a firewall or an access control list sits at ' +
        'that specific routing point, a device on one VLAN can still reach a device on another. VLANs alone are segmentation of ' +
        'the broadcast domain; they are not, by themselves, a security boundary.',
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
      'blocks it from reaching the internal VLAN" demonstrates this exact distinction directly, showing you understand that the VLAN boundary and the security boundary are two different things that happen to often sit at the same place. That is worth ' +
      'far more than a diagram showing three neatly separated VLANs with no mention of what happens at the point where they actually connect, because the diagram alone cannot tell anyone whether traffic between those VLANs is controlled or wide open.',
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
        'You have worked this arithmetic in one direction already, in net.10.1 and net.10.2: given a prefix length, how many host bits are left, and what block size and usable host count does that produce. This exercise runs the exact same relationship the other way: given how many EQUAL subnets you need, how much of the prefix has to change to produce them.\n\n' +
        'Splitting one network into 4 equal pieces means BORROWING enough bits from the host portion to create exactly 4 distinct ' +
        'blocks, since each additional bit you take from the host side doubles the number of blocks you can carve out (one borrowed bit gives 2 blocks, two borrowed bits give 4, three give 8, and so on). Because ' +
        '2 to the power of 2 is 4, borrowing exactly 2 bits does the job here. A /24 starts with 32 minus 24, 8 ' +
        'host bits; borrowing 2 of those for subnetting leaves a /26 for each department (24 plus the 2 borrowed bits), with 6 host ' +
        'bits remaining inside each one. That gives 2 to the power of 6 minus 2 usable hosts per subnet, using precisely the ' +
        'same minus-two reasoning from net.10.2, network address and broadcast address reserved out of every block, just arrived at here from the other ' +
        'direction: starting from "how many subnets do I need" rather than from "how many hosts does this prefix give me".',
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
      'This is the arithmetic behind an IP addressing plan on any real network diagram, and it runs before a single cable ever gets plugged in: "4 departments, ' +
      'roughly 60 devices each, one /24 to divide between them" resolves to "/26 per department" using exactly this borrowing logic, ' +
      `and it is worth noticing that /26 gives ${SUBNET_C.usableHosts} usable addresses per department, comfortably above 60 with room to grow, which is the kind of headroom check net.10.2's debrief pointed at directly.`,
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
        'A SWITCH is the piece of hardware that physically connects devices together on a local network, the box with a row of cable ports that a laptop, a phone, or another switch plugs into. Every individual cable connection into a switch is a PORT, and a switch can configure each of its ports differently depending on what is plugged into the other end of the cable.\n\n' +
        'An ACCESS PORT belongs to exactly one VLAN and carries traffic UNTAGGED, meaning it adds no extra marking to the frames passing through it. That is what an end ' +
        'device like a laptop or a phone connects to, since ordinary devices have no software built in to understand VLAN tags at all, they simply expect a plain, ordinary network connection. A TRUNK PORT carries traffic for MULTIPLE VLANs at once, over a single cable, between switches, or between a ' +
        'switch and a router, and it does this using 802.1Q tags, a small marker added to each frame that says which VLAN it belongs to, so the device on the receiving end ' +
        'can sort frames back into their correct VLANs. Plugging an ordinary laptop into a trunk port configured for multiple ' +
        'VLANs does not give it access to all of them, the laptop has no idea what to do with tagged ' +
        'frames arriving on the wire and simply will not work correctly, rather than gaining some kind of bonus access.',
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
      'In a Packet Tracer or GNS3 build, this is the single most common cabling mistake beginners make: an end device ' +
      'plugged into a port that is still configured as a trunk left over from a previous step in the lab, which looks completely identical in the ' +
      'topology diagram, same cable, same green line, and yet behaves nothing like an access port in practice, because the device on the end of it was never built to understand the tagged frames a trunk port sends.',
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
        'You already met the DEFAULT route in net.1.4: the catch-all entry that a machine or router falls back to whenever nothing more specific in its routing table matches a destination. It ' +
        'is often written as 0.0.0.0/0, a network address that, by design, matches every possible destination address there is, which is exactly what makes it the fallback of last resort.\n\n' +
        'A STATIC ROUTE is different: it is a specific entry an administrator types in by hand for one particular ' +
        'destination network, pointed at a specific next-hop router, used when traffic to that one network needs ' +
        'to take a different path than everything else does, a second internal network reachable only through a ' +
        'different, specific router, for instance, rather than being sent out the default gateway toward the internet like most traffic.\n\n' +
        'A router always prefers the MOST SPECIFIC matching route available to it, and that single rule is why a static route for one ' +
        'particular network overrides the default route for traffic headed there, without changing anything at all about how ' +
        'every other destination gets handled. The default route only ever gets used when nothing more specific claims the traffic first.',
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
      'route sitting alone in a simple host\'s routing table, now extended to a router that has to actively choose between several competing candidate routes rather than falling back to just one. The logic does not change as the table grows, only the number of options the router has to compare before it picks the winner.',
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
        'You know from net.1.4 that an end device sends anything outside its own local network to its GATEWAY, and trusts the gateway to get it the rest of the way there. What that device cannot see, and has no way to check, is whether the ROUTER acting as its gateway actually knows how to reach the destination at all.\n\n' +
        'A router only knows about networks it is DIRECTLY CONNECTED to (a network with one of its own physical or virtual interfaces sitting on it), or networks it was explicitly told ' +
        'about, either through a hand-typed static route like the one from the last exercise, or automatically through a ROUTING PROTOCOL such as OSPF or RIP, software that lets routers exchange information about which networks they can each reach. Two end ' +
        'devices, each perfectly configured with the right IP address, mask, and gateway, still fail to reach each other if the ROUTERS sitting in ' +
        'between the two of them have no route to each other\'s subnet, because each router along the way simply ' +
        'drops, or never forwards in the right direction, any traffic addressed to a destination it does not know how to reach.\n\n' +
        'This is a genuinely common mistake in a ' +
        'Packet Tracer build: every cable is plugged in correctly and every IP address is typed correctly, but nobody added the static routes ' +
        '(or turned on a routing protocol) that would actually let the routers tell each other about the ' +
        'subnets they each individually connect to.',
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
      'This is the exact moment "watch a ping travel, and know exactly why it works" from a networking lab ' +
      'earns its keep: the failure is invisible if you only check each end device, since both of them genuinely are configured correctly, and it only becomes visible once you trace the path hop by hop through the routers in between and ask, at each one, "does this specific router actually have a route to where the ping is trying to go".',
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
        'Every device on a network needs an IP address, a subnet mask, a gateway, and usually a DNS server before it can do anything useful at all, and typing all four of those in by hand on every single laptop, phone, and printer that joins a network would be slow and constantly go wrong. DHCP, Dynamic Host Configuration Protocol, exists to solve exactly that: a DHCP server hands a joining device everything it needs automatically, the moment it connects, with no manual typing required.\n\n' +
        'A DHCP LEASE negotiates far more than just an IP address, even though the address is the part most people think of first. A lease also typically carries the SUBNET ' +
        'MASK, so the device can immediately work out, the way you learned in net.1.5, which addresses are local and which are remote; the DEFAULT GATEWAY, so it ' +
        'knows where to send traffic leaving its own subnet, the same gateway concept from net.1.4; and one or more DNS SERVERS, so it can actually resolve ' +
        'names into addresses at all, the same resolver role /etc/resolv.conf plays that you read about in net.3.3.\n\n' +
        'The exchange happens in four steps, commonly remembered by the acronym DORA: the client ' +
        'DISCOVERs a server by broadcasting a request onto the local network (since it has no address yet, it cannot address anyone directly), the server OFFERs a lease in response, the client REQUESTs that specific offer, and the ' +
        'server ACKNOWLEDGEs it, at which point the lease, and every setting that came bundled with it, becomes actually ' +
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
      'This is why a device showing the wrong DNS behaviour, or one that seemingly cannot leave its own subnet no matter how correct its address looks, is very ' +
      'often a DHCP scope misconfiguration somewhere upstream rather than anything actually wrong with the device itself: the address, the mask, the gateway, and the DNS servers all arrived together in the exact same lease, from the exact same server, so a mistake made once in the scope\'s configuration quietly propagates to every ' +
      'single device that leases from it.',
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
        'A DHCP SCOPE is the specific pool of addresses a DHCP server has been configured to hand out, a fixed range like "everything from .50 to .99", deliberately sized by whoever set it up based on how many devices they expected to need one at any given time. Once every single address in that pool ' +
        'is leased out, and none of the existing leases have expired or been ' +
        'reclaimed yet, there is genuinely nothing left in the pool for the server to offer.\n\n' +
        'A new device broadcasting a DHCP discover, the D in DORA from the last exercise, at that ' +
        'point gets no offer back AT ALL, because the server has nothing left to give it, not a slower response, not a partial one, just silence on that front. On Windows specifically, a ' +
        'device that fails to get a lease this way commonly falls back to APIPA, Automatic Private IP Addressing, a self-assigned address the device picks for itself out of the reserved ' +
        '169.254.x.x link-local range. That lets it talk to other devices on the exact same local segment that also happen to ' +
        'have self-assigned an APIPA address, but it gives the device no gateway and no DNS server at all, since those only ever arrive as part of an actual DHCP lease, so it effectively cannot reach anything ' +
        'beyond its own local link. Seeing a 169.254.x.x address on a device is one of the clearest single signs of ' +
        'DHCP failure there is, precisely because Windows deliberately chose it as a visible, recognisable fallback rather than just ' +
        'failing silently and leaving the device with no address at all.',
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
      'A 169.254.x.x address is one of the fastest diagnostic signals in the whole field of networking, precisely because it is self-explanatory the moment you see it: it means "this device ' +
      'never actually got a DHCP lease," full stop, before you have checked cabling, checked the switch, or checked anything else at all about the rest of the ' +
      'network. Recognising that range on sight turns a vague "this device cannot get online" complaint into a specific, narrow question: why did DHCP fail for this one device, rather than a wide open search across the entire network.',
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
        'You met STATIC IP addresses briefly in net.11.1: an address typed in by hand and left unchanging, rather than leased automatically. Infrastructure that needs a predictable, never-changing address, the gateway router itself, a shared printer, an internal ' +
        'server other machines are configured to look for by a fixed address, is normally given exactly that kind of static IP rather than a DHCP lease, precisely because everything that depends on reaching it needs that address to stay the same forever, not renew to something different every so often the way an ordinary laptop\'s lease does.\n\n' +
        'If that statically-assigned range happens to overlap with ' +
        'the DHCP scope, the DHCP server has no way of knowing the address is already spoken for: nothing tells it, and DHCP servers do not automatically inspect the network to check. It can hand that exact ' +
        'same address out to some other device requesting a lease, producing an IP CONFLICT: two devices on the ' +
        'network simultaneously claiming to be the same address, which typically breaks connectivity for both of them in a way ' +
        'that is genuinely confusing to troubleshoot, because neither device\'s own configuration looks wrong when you check it individually.\n\n' +
        'Excluding the statically-assigned range from the scope up front, telling the DHCP server explicitly "do not ever offer any of these addresses", is what prevents the DHCP server ' +
        'from ever offering out an address it does not actually own the right to hand out.',
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
      'An IP conflict is one of the more confusing failures to troubleshoot precisely because it presents as two completely ' +
      'unrelated-looking problems on two different devices at once, one machine suddenly drops offline, another starts behaving strangely, and nothing about either symptom points obviously back at the other device or at DHCP at all, when the real, single root cause the whole time is one missing ' +
      'exclusion on the DHCP scope that let the server hand out an address that was never really available to give.',
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
