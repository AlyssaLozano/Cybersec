/**
 * Package 4: Networking Basics -- 15 exercises across 3 modules.
 *
 * WHY THIS PACKAGE EXISTS, AND WHY NOW
 *
 * The capability baseline identified this as the single biggest blocker to SOC
 * readiness. Three core SOC capabilities -- reading a netstat table, telling
 * internal addresses from external ones, and knowing what common ports mean --
 * all sit behind this foundation, and none of them were teachable. A learner
 * finishing Packages 1 and 2 hit a wall at 44% readiness largely because of it.
 *
 * PACKAGE NUMBERING
 *
 * This is package '4' and its exercise ids are 4.x.x. The source specification
 * numbered Networking as package 3, but '3' was taken by Security Incident
 * Concepts. Exercise ids are permanent because progress rows reference them, so
 * the numbering follows what is actually free rather than what the spec assumed.
 *
 * THE ARC
 *
 * Module 4.1 asks "what is this machine". 4.2 asks "what is it talking to", and
 * ends by isolating the exfiltration connection that has been sitting in the
 * simulated host since Package 1 without anybody having the tools to see it.
 * 4.3 covers name resolution, including the reverse lookup that turns the
 * noisiest address in auth.log into an obviously-internal monitoring box.
 *
 * As in Packages 1 and 2, every expected count is verified against the real
 * engine output rather than assumed.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

import { PACKAGE_4_PRACTICE } from './package4-practice.js';

const HOST_IP = '10.20.6.40';
const GATEWAY = '10.20.6.1';
const EXFIL = '198.51.100.60';

// --- Module 4.1: what this machine is ----------------------------------------

const MODULE_4_1: Exercise[] = [
  {
    id: '4.1.1',
    moduleId: '4.1',
    packageId: '4',
    order: 1,
    title: 'Find out what address this machine has',
    kind: 'terminal',
    goal: 'Learn the command that answers "which machine am I on, as far as the network is concerned".',
    prompt:
      'Before you can judge whether a connection is coming from inside or outside the company, you need to know where you are. Show this host\'s network interfaces and their addresses.',
    teach: {
      concept:
        'Every machine on a network has at least two interfaces: a loopback (lo, always 127.0.0.1, which only talks to itself) and one or more real ones. `ip addr show` lists them along with the addresses assigned to each. The line that matters is the one starting `inet` under a real interface — that is the address other machines use to reach you.',
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
      'Write `ip addr show` — or just `ip addr`, which does the same thing.',
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
    practice: PACKAGE_4_PRACTICE['4.1.1'] ?? [],
  },
  {
    id: '4.1.2',
    moduleId: '4.1',
    packageId: '4',
    order: 2,
    title: 'List the interfaces without the noise',
    kind: 'terminal',
    goal: 'Get a compact view of what network hardware exists.',
    prompt: 'Show just the network interfaces on this host, without their IP addresses.',
    teach: {
      concept:
        '`ip` is one command with several objects: `ip addr` for addresses, `ip link` for the interfaces themselves, `ip route` for where traffic goes. Asking for `link` gives you a much shorter answer when all you want to know is what exists. On a compromised host this is worth checking — an interface you do not recognise can mean a VPN or tunnel somebody added.',
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
      { type: 'output-line-count', count: 4, hint: 'Two interfaces, two lines each — four lines in total.' },
      { type: 'output-contains', text: 'eth0', hint: 'eth0 should be listed.' },
      { type: 'output-excludes', text: 'inet ', hint: 'This view should NOT include IP addresses. Use `link` rather than `addr`.' },
    ],
    debrief:
      'Two interfaces is what a normal server looks like. A host with a tun0 or a second unexplained interface is worth asking about — that is often how somebody keeps a route in.',
    practice: PACKAGE_4_PRACTICE['4.1.2'] ?? [],
  },
  {
    id: '4.1.3',
    moduleId: '4.1',
    packageId: '4',
    order: 3,
    title: 'Test whether another host is reachable',
    kind: 'terminal',
    goal: 'Confirm a host is up and measure how far away it is.',
    prompt:
      'The backup server is rmg-backup-01.ridgelinemed.example. Check whether this host can reach it, sending exactly 3 packets.',
    teach: {
      concept:
        '`ping` sends a small packet and asks for it back. It answers two questions at once: does the name resolve to an address, and does that address answer. The round-trip time tells you roughly how far away the host is — under a millisecond usually means the same network, tens of milliseconds means somewhere else entirely.',
      syntax: 'ping -c COUNT HOST',
      examples: [
        { command: 'ping -c 3 rmg-web-01.ridgelinemed.example', explains: 'Three packets to the other web server.' },
        { command: 'ping -c 1 10.20.1.10', explains: 'A single packet to an address, skipping name resolution entirely.' },
      ],
      flags: [
        { flag: '-c COUNT', means: 'Stop after COUNT packets. Without it, ping runs until you interrupt it — and in this simulator it is required, so the command terminates.' },
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
      'A reply proves the host is up and reachable. Silence proves almost nothing — plenty of hosts are configured not to answer ping at all, and a firewall may be dropping it. "It does not ping" is not evidence a machine is off.',
    practice: PACKAGE_4_PRACTICE['4.1.3'] ?? [],
  },
  {
    id: '4.1.4',
    moduleId: '4.1',
    packageId: '4',
    order: 4,
    title: 'See where traffic goes when it leaves',
    kind: 'terminal',
    goal: 'Read a routing table and identify the default gateway.',
    prompt: 'Show this host\'s routing table.',
    teach: {
      concept:
        'When a machine sends a packet it consults its routing table: "is this destination on a network I am directly attached to, or does it go to the gateway?" The `default` route is the catch-all — anything not local goes there. Knowing the gateway matters in an investigation, because traffic leaving the company passes through it, and that is where it can be blocked.',
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
    practice: PACKAGE_4_PRACTICE['4.1.4'] ?? [],
  },
  {
    id: '4.1.5',
    moduleId: '4.1',
    packageId: '4',
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
      'A netmask of 255.255.255.0 is the same thing as /24: the first three numbers identify the network, the last identifies the host. So 10.20.6.40 and 10.20.6.99 are neighbours, and 10.20.4.31 is not — it is one router hop away.',
    practice: PACKAGE_4_PRACTICE['4.1.5'] ?? [],
  },
];

// --- Module 4.2: what it is talking to ---------------------------------------

const MODULE_4_2: Exercise[] = [
  {
    id: '4.2.1',
    moduleId: '4.2',
    packageId: '4',
    order: 1,
    title: 'See every connection at once',
    kind: 'terminal',
    goal: 'Get the full picture before narrowing it.',
    prompt: 'Show all network connections and listening sockets on this host, without resolving names to hostnames.',
    teach: {
      concept:
        'A socket is one end of a network conversation. `netstat -an` shows all of them: services waiting for connections (LISTEN) and conversations actually in progress (ESTABLISHED). The `-n` matters more than it looks — without it, netstat tries to turn every address into a hostname, which is slow and can hide the address you needed to see.',
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
      { type: 'output-contains', text: 'LISTEN', hint: 'Listening sockets should be included — that is what -a adds.' },
      { type: 'output-contains', text: 'ESTABLISHED', hint: 'Active connections should be included too.' },
    ],
    debrief:
      'That is a lot at once, which is the point: this is the raw material. The next four exercises are all about cutting it down to the handful of lines that answer a specific question.',
    practice: PACKAGE_4_PRACTICE['4.2.1'] ?? [],
  },
  {
    id: '4.2.2',
    moduleId: '4.2',
    packageId: '4',
    order: 2,
    title: 'Find what this host is offering',
    kind: 'terminal',
    goal: 'List only the services accepting connections.',
    prompt: 'Show only the TCP sockets that are listening for incoming connections, keeping addresses numeric.',
    teach: {
      concept:
        'A listening socket is a door. Anything in that list is a way into this machine, so it is one of the first things to check on a host you have been handed. Read the Local Address column carefully: 0.0.0.0 means "any interface", so the whole network can reach it. 127.0.0.1 means loopback only — that service can be reached from this host and nowhere else.',
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
      { type: 'output-excludes', text: 'ESTABLISHED', hint: 'Only listening sockets should appear — add -l.' },
    ],
    debrief:
      'Four doors are open to the network: 22 (SSH), 80 and 443 (the web server), and that is it. Postgres on 5432 and the application on 8080 are bound to 127.0.0.1, so they are not reachable from outside this machine. That distinction is the difference between a database being exposed to the internet and being safe.',
    practice: PACKAGE_4_PRACTICE['4.2.2'] ?? [],
  },
  {
    id: '4.2.3',
    moduleId: '4.2',
    packageId: '4',
    order: 3,
    title: 'Find which program owns a port',
    kind: 'terminal',
    goal: 'Connect a port number to the process behind it.',
    prompt: 'Something is listening on port 22. Show which program it is, using a pipe to filter the output.',
    teach: {
      concept:
        'A port number on its own tells you what a service is *supposed* to be. Port 22 is conventionally SSH — but conventions are not enforcement, and an attacker can run anything on any port. Adding `-p` shows the process actually holding the socket, which is what turns "port 22 is open" into "sshd is listening on port 22".',
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
    expectedOutput: 'Two lines, both showing 1198/sshd — one for IPv4, one for IPv6.',
    checks: [
      { type: 'command-has-flag', command: 'netstat', flags: ['p'], hint: 'Add -p so the owning process is shown.' },
      { type: 'command-uses-pipe', hint: 'Pipe netstat into grep to filter down to port 22.' },
      { type: 'output-contains', text: 'sshd', hint: 'The output should name the program holding the port.' },
    ],
    debrief:
      'sshd on 22 is exactly what should be there. The reason you check is the case where it is not — a listener on 22 owned by something that is not sshd, or sshd running on a port nobody configured. Verifying the boring answer is how you notice the interesting one.',
    practice: PACKAGE_4_PRACTICE['4.2.3'] ?? [],
  },
  {
    id: '4.2.4',
    moduleId: '4.2',
    packageId: '4',
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
      'Five conversations. Two are the machine talking to itself on loopback, which is normal and uninteresting. The other three involve real addresses — and one of them is about to matter a great deal.',
    practice: PACKAGE_4_PRACTICE['4.2.4'] ?? [],
  },
  {
    id: '4.2.5',
    moduleId: '4.2',
    packageId: '4',
    order: 5,
    title: 'Filter out the machine talking to itself',
    kind: 'terminal',
    goal: 'Use an inverted match to remove noise you already understand.',
    prompt:
      'Loopback traffic is this host talking to itself and is rarely interesting. Show the established TCP connections with all loopback lines removed.',
    teach: {
      concept:
        'grep -v inverts a match: it keeps every line that does NOT contain the pattern. Investigations are largely subtraction — you remove the categories you have already explained until what remains is small enough to read one line at a time. Removing loopback is usually the first subtraction on any host.',
      syntax: 'netstat -tn | grep ESTABLISHED | grep -v 127.0.0.1',
      examples: [
        { command: 'netstat -tn | grep -v LISTEN', explains: 'Removing a category rather than selecting one.' },
        { command: 'grep -v "nagios" /var/log/auth.log', explains: 'The same idea back in Package 2: subtract the noise you already understand.' },
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
    practice: PACKAGE_4_PRACTICE['4.2.5'] ?? [],
  },
  {
    id: '4.2.6',
    moduleId: '4.2',
    packageId: '4',
    order: 6,
    title: 'Find the connection that should not exist',
    kind: 'terminal',
    goal: 'Identify an outbound connection to an external address, and the process behind it.',
    prompt:
      'Show the established connections with loopback removed, and include the owning process this time. One of these is a server reaching OUT to an address on the internet. Find it.',
    teach: {
      concept:
        'A web server exists to receive connections, not make them. Traffic arriving at port 443 from an office machine is the job working normally. A connection where this host is the one dialling out — to an address nobody recognises, made by a tool like curl rather than a service — is one of the strongest single signals available in security monitoring. Adding -p turns "there is a connection" into "curl made this connection".',
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
      { type: 'output-contains', text: 'curl', hint: 'The owning process should be shown — that is what -p adds.' },
      { type: 'output-excludes', text: '127.0.0.1', hint: 'Loopback should still be filtered out.' },
    ],
    debrief:
      `That connection has been open on this host since Package 1, and you have only now had the tools to see it. ${EXFIL} is not a Ridgeline address. The process is curl — a file transfer tool, not a service. A patient-portal web server has no reason to be uploading anything to an unknown address on the internet. In Package 2 you found how somebody got in; this is what they are doing now.`,
    practice: PACKAGE_4_PRACTICE['4.2.6'] ?? [],
  },
];

// --- Module 4.3: names ---------------------------------------------------------

const MODULE_4_3: Exercise[] = [
  {
    id: '4.3.1',
    moduleId: '4.3',
    packageId: '4',
    order: 1,
    title: 'Turn a name into an address',
    kind: 'terminal',
    goal: 'Query DNS directly rather than trusting an application to do it.',
    prompt: 'Look up the address that portal.ridgelinemed.example resolves to.',
    teach: {
      concept:
        'DNS turns names into addresses. `dig` asks a resolver directly and shows you the whole answer, including which server replied. The part to read is the ANSWER SECTION. Doing the lookup yourself matters in an investigation because a name in a log is only meaningful once you know what it pointed at — and what it points at can change.',
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
      `The portal resolves to ${HOST_IP} — this host. That is worth noticing: the machine you have been investigating is the public patient portal, which is why it is exposed to the internet and why it was being brute-forced all morning.`,
    practice: PACKAGE_4_PRACTICE['4.3.1'] ?? [],
  },
  {
    id: '4.3.2',
    moduleId: '4.3',
    packageId: '4',
    order: 2,
    title: 'Turn an address back into a name',
    kind: 'terminal',
    goal: 'Use a reverse lookup to identify an unfamiliar address.',
    prompt:
      'In Package 2 you found hundreds of failed logins from 10.20.9.40. Find out what that machine is called.',
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
      { type: 'output-contains', text: 'in-addr.arpa', hint: 'A reverse lookup queries the in-addr.arpa zone — that should appear in the response.' },
    ],
    debrief:
      'It is the monitoring server. Five hundred and seventy-six authentication failures, all day, every five minutes — from the company\'s own monitoring box with a stale password. One reverse lookup turns the noisiest thing in the log into a ticket for whoever owns monitoring, and takes it off your incident list entirely.',
    practice: PACKAGE_4_PRACTICE['4.3.2'] ?? [],
  },
  {
    id: '4.3.3',
    moduleId: '4.3',
    packageId: '4',
    order: 3,
    title: 'Find out who answers this host\'s questions',
    kind: 'terminal',
    goal: 'Read the resolver configuration.',
    prompt: 'Show which DNS servers this host is configured to use.',
    teach: {
      concept:
        'Every lookup this machine makes goes to the resolvers listed in /etc/resolv.conf. It is a plain text file, so reading it needs no special tool. It matters in an investigation because changing a host\'s resolver is a quiet way to redirect its traffic — if a machine is suddenly asking a nameserver nobody recognises, that is worth explaining.',
      syntax: 'cat /etc/resolv.conf',
      examples: [
        { command: 'cat /etc/hosts', explains: 'The file checked BEFORE DNS, which can override it entirely.' },
        { command: 'dig portal.ridgelinemed.example', explains: 'A lookup that will be answered by whichever server is listed here.' },
      ],
    },
    hints: [
      'This is a file, not a command — you already know how to read files.',
      'The file is /etc/resolv.conf.',
    ],
    solution: 'cat /etc/resolv.conf',
    expectedOutput: 'Five lines: two nameservers, a search domain, and options.',
    checks: [
      { type: 'output-contains', text: 'nameserver 10.20.1.10', hint: 'The primary resolver should be listed.' },
      { type: 'output-contains', text: 'search ridgelinemed.example', hint: 'The search domain should be listed too.' },
    ],
    debrief:
      'Both resolvers are on the internal 10.20.1.x network, which is what you want. A host configured to use a public resolver, or one you do not recognise, is bypassing whatever DNS filtering the company put in place — sometimes by accident, sometimes not.',
    practice: PACKAGE_4_PRACTICE['4.3.3'] ?? [],
  },
  {
    id: '4.3.4',
    moduleId: '4.3',
    packageId: '4',
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
      'The file is /etc/hosts — plural, no extension.',
    ],
    solution: 'cat /etc/hosts',
    expectedOutput: 'Eleven lines: loopback entries, the Ridgeline hosts, and IPv6 defaults.',
    checks: [
      { type: 'output-contains', text: 'rmg-backup-01', hint: 'The company hosts should be listed.' },
      { type: 'output-contains', text: '127.0.0.1', hint: 'The loopback entry should be there.' },
      { type: 'output-line-count', count: 11, hint: 'The file has eleven non-empty lines.' },
    ],
    debrief:
      'Everything here is internal and expected. The check worth remembering is the one that finds a public name — a software update server, say — pointed at an internal or unfamiliar address. That is a redirect, and because it never touches DNS, this file is the only place it is visible.',
    practice: PACKAGE_4_PRACTICE['4.3.4'] ?? [],
  },
];

// --- the package -------------------------------------------------------------

export const PACKAGE_4: LearningPackage = {
  id: '4',
  order: 4,
  title: 'Networking Basics',
  summary:
    'Work out what a machine is, what it is talking to, and whether it should be. Ends by finding an active exfiltration connection that has been hiding in plain sight since Package 1.',
  outcomes: [
    'Identify a host\'s addresses, interfaces, and default gateway',
    'Tell an internal address from an external one at a glance',
    'Read a netstat table and separate open doors from live conversations',
    'Connect a port to the process that owns it',
    'Resolve names forwards and backwards, and know which file overrides DNS',
  ],
  prerequisites: ['1'],
  modules: [
    {
      id: '4.1',
      packageId: '4',
      order: 1,
      title: 'What this machine is',
      summary: 'Addresses, interfaces, routes, and reachability.',
      exercises: MODULE_4_1,
    },
    {
      id: '4.2',
      packageId: '4',
      order: 2,
      title: 'What it is talking to',
      summary: 'Listening sockets, live connections, and the one that should not be there.',
      exercises: MODULE_4_2,
    },
    {
      id: '4.3',
      packageId: '4',
      order: 3,
      title: 'Names and resolution',
      summary: 'Forward and reverse lookups, resolvers, and the file that quietly overrides them.',
      exercises: MODULE_4_3,
    },
  ],
};
