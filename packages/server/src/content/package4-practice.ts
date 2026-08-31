/**
 * Practice drills for Package 4: five per exercise, 75 in total.
 *
 * Same rules as Packages 1 and 2: same skill, different target; graded on
 * outcome; optional, so they never gate progression or move the completion
 * percentage.
 *
 * Networking drills lean on the fact that the simulated host has a small but
 * complete world around it -- a gateway, two resolvers, six named internal hosts,
 * and one external address that should not be there. Repetition across those
 * targets doubles as familiarity with the network a student will later have to
 * investigate.
 */

import type { Check, PracticeItem } from '@soc/shared';

const outHas = (text: string): Check => ({
  type: 'output-contains',
  text,
  hint: `The output should include "${text}".`,
});

const outLacks = (text: string): Check => ({
  type: 'output-excludes',
  text,
  hint: `"${text}" should not appear — your filter is letting extra output through.`,
});

const lines = (count: number): Check => ({
  type: 'output-line-count',
  count,
  hint: `Exactly ${count} lines should come back.`,
});

const hasFlag = (command: string, flag: string): Check => ({
  type: 'command-has-flag',
  command,
  flags: [flag],
  hint: `Use the ${flag} option on ${command}.`,
});

const usesPipe: Check = { type: 'command-uses-pipe', hint: 'Join the commands with the | character.' };

export const PACKAGE_4_PRACTICE: Record<string, PracticeItem[]> = {
  // --- 4.1.1 addresses -------------------------------------------------------
  '4.1.1': [
    { id: '4.1.1-p1', prompt: 'Show the addresses again using the short form of the command.', solution: 'ip addr', checks: [outHas('10.20.6.40')] },
    { id: '4.1.1-p2', prompt: 'Show every interface in the older ifconfig format.', solution: 'ifconfig', checks: [outHas('eth0'), outHas('10.20.6.40')] },
    { id: '4.1.1-p3', prompt: 'Show only the loopback interface with ifconfig.', solution: 'ifconfig lo', checks: [outHas('127.0.0.1'), outLacks('eth0')] },
    { id: '4.1.1-p4', prompt: 'Confirm the hostname of the machine you are on.', solution: 'hostname', checks: [outHas('rmg-web-02')] },
    { id: '4.1.1-p5', prompt: 'Use the file that records this machine\'s name rather than the command.', solution: 'cat /etc/hostname', checks: [outHas('rmg-web-02')] },
  ],

  // --- 4.1.2 interfaces ------------------------------------------------------
  '4.1.2': [
    { id: '4.1.2-p1', prompt: 'Show the interfaces using the short form, `ip link`.', solution: 'ip link', checks: [lines(4), outHas('eth0')] },
    { id: '4.1.2-p2', prompt: 'Show interfaces and addresses together, then confirm eth0 appears.', solution: 'ip addr show', checks: [outHas('eth0'), outHas('inet')] },
    { id: '4.1.2-p3', prompt: 'Using a pipe, show only the lines of `ip link show` that mention eth0.', solution: 'ip link show | grep eth0', checks: [usesPipe, outHas('eth0'), outLacks('lo:')] },
    { id: '4.1.2-p4', prompt: 'Using a pipe, count how many lines `ip link show` produces.', solution: 'ip link show | wc -l', checks: [usesPipe, { type: 'output-numeric', equals: 4, hint: 'The answer is a single number.' }] },
    { id: '4.1.2-p5', prompt: 'Show the MAC (hardware) address of eth0 by filtering ifconfig output.', solution: 'ifconfig eth0 | grep ether', checks: [usesPipe, outHas('06:2f:a1:4c:88:d3')] },
  ],

  // --- 4.1.3 reachability ----------------------------------------------------
  '4.1.3': [
    { id: '4.1.3-p1', prompt: 'Send 2 packets to the other web server, rmg-web-01.ridgelinemed.example, by name.', solution: 'ping -c 2 rmg-web-01.ridgelinemed.example', checks: [hasFlag('ping', 'c'), outHas('10.20.6.41')] },
    { id: '4.1.3-p2', prompt: 'Send 3 packets to the other web server by address: 10.20.6.41.', solution: 'ping -c 3 10.20.6.41', checks: [hasFlag('ping', 'c'), outHas('3 received')] },
    { id: '4.1.3-p3', prompt: 'Send 1 packet to the default gateway, 10.20.6.1.', solution: 'ping -c 1 10.20.6.1', checks: [hasFlag('ping', 'c'), outHas('1 packets transmitted')] },
    { id: '4.1.3-p4', prompt: 'Ping the monitoring server rmg-monitor-01.ridgelinemed.example twice.', solution: 'ping -c 2 rmg-monitor-01.ridgelinemed.example', checks: [hasFlag('ping', 'c'), outHas('10.20.9.40')] },
    { id: '4.1.3-p5', prompt: 'Try to ping a hostname that does not exist: rmg-nope.ridgelinemed.example. Read the error.', solution: 'ping -c 1 rmg-nope.ridgelinemed.example', checks: [outHas('Name or service not known')] },
  ],

  // --- 4.1.4 routing ---------------------------------------------------------
  '4.1.4': [
    { id: '4.1.4-p1', prompt: 'Show the routing table using the longer form of the command.', solution: 'ip route show', checks: [lines(2), outHas('default via')] },
    { id: '4.1.4-p2', prompt: 'Using a pipe, show only the default route.', solution: 'ip route | grep default', checks: [usesPipe, lines(1), outHas('10.20.6.1')] },
    { id: '4.1.4-p3', prompt: 'Using a pipe, show only the directly attached network route (the one that is not the default).', solution: 'ip route | grep -v default', checks: [usesPipe, lines(1), outHas('10.20.6.0/24')] },
    { id: '4.1.4-p4', prompt: 'Using a pipe, count how many routes this host has.', solution: 'ip route | wc -l', checks: [usesPipe, { type: 'output-numeric', equals: 2, hint: 'The answer is a single number.' }] },
    { id: '4.1.4-p5', prompt: 'Confirm the gateway is reachable by sending it a single ping.', solution: 'ping -c 1 10.20.6.1', checks: [outHas('10.20.6.1')] },
  ],

  // --- 4.1.5 ifconfig detail -------------------------------------------------
  '4.1.5': [
    { id: '4.1.5-p1', prompt: 'Show detailed configuration for the loopback interface.', solution: 'ifconfig lo', checks: [outHas('127.0.0.1'), outLacks('eth0')] },
    { id: '4.1.5-p2', prompt: 'Using a pipe, show only the line of eth0 detail containing its IPv4 address.', solution: 'ifconfig eth0 | grep inet', checks: [usesPipe, outHas('10.20.6.40')] },
    { id: '4.1.5-p3', prompt: 'Using a pipe, show only the receive (RX) counters for eth0.', solution: 'ifconfig eth0 | grep RX', checks: [usesPipe, outHas('RX packets')] },
    { id: '4.1.5-p4', prompt: 'Using a pipe, show the netmask line for eth0.', solution: 'ifconfig eth0 | grep netmask', checks: [usesPipe, outHas('255.255.255.0')] },
    { id: '4.1.5-p5', prompt: 'Try ifconfig on an interface that does not exist, eth9, and read the error.', solution: 'ifconfig eth9', checks: [outHas('Device not found')] },
  ],

  // --- 4.2.1 all sockets -----------------------------------------------------
  '4.2.1': [
    { id: '4.2.1-p1', prompt: 'Show all sockets using the modern tool, ss.', solution: 'ss -an', checks: [outHas('LISTEN')] },
    { id: '4.2.1-p2', prompt: 'Using a pipe, count how many lines `netstat -an` produces.', solution: 'netstat -an | wc -l', checks: [usesPipe, { type: 'output-numeric', equals: 16, hint: 'The answer is a single number.' }] },
    { id: '4.2.1-p3', prompt: 'Using a pipe, show only the UDP sockets from the full netstat output.', solution: 'netstat -an | grep udp', checks: [usesPipe, outHas('127.0.0.53')] },
    { id: '4.2.1-p4', prompt: 'Using a pipe, show only the IPv6 sockets (they show as tcp6).', solution: 'netstat -an | grep tcp6', checks: [usesPipe, outHas('tcp6')] },
    { id: '4.2.1-p5', prompt: 'Using a pipe, count how many sockets are in the LISTEN state.', solution: 'netstat -an | grep -c LISTEN', checks: [usesPipe, { type: 'output-numeric', equals: 7, hint: 'The answer is a single number.' }] },
  ],

  // --- 4.2.2 listening -------------------------------------------------------
  '4.2.2': [
    { id: '4.2.2-p1', prompt: 'Show the listening TCP sockets using the modern tool, ss.', solution: 'ss -tln', checks: [outHas('LISTEN'), outHas('0.0.0.0:22')] },
    { id: '4.2.2-p2', prompt: 'Using a pipe, show only the listening sockets bound to loopback (127.0.0.1).', solution: 'netstat -tln | grep 127.0.0.1', checks: [usesPipe, lines(3), outLacks('0.0.0.0:22')] },
    { id: '4.2.2-p3', prompt: 'Using a pipe, show only the listening sockets reachable from the network (bound to 0.0.0.0).', solution: 'netstat -tln | grep 0.0.0.0:', checks: [usesPipe, outHas(':22'), outHas(':443')] },
    { id: '4.2.2-p4', prompt: 'Using a pipe, count how many TCP sockets are listening.', solution: 'netstat -tln | grep -c LISTEN', checks: [usesPipe, { type: 'output-numeric', equals: 7, hint: 'The answer is a single number.' }] },
    { id: '4.2.2-p5', prompt: 'Show the listening UDP sockets instead of TCP.', solution: 'netstat -uln', checks: [outHas('127.0.0.53')] },
  ],

  // --- 4.2.3 process on a port -----------------------------------------------
  '4.2.3': [
    { id: '4.2.3-p1', prompt: 'Find which process is listening on port 443.', solution: 'netstat -tlnp | grep :443', checks: [usesPipe, outHas('nginx')] },
    { id: '4.2.3-p2', prompt: 'Find which process is listening on port 5432, the database port.', solution: 'netstat -tlnp | grep :5432', checks: [usesPipe, outHas('postgres')] },
    { id: '4.2.3-p3', prompt: 'Find which process is listening on port 8080.', solution: 'netstat -tlnp | grep :8080', checks: [usesPipe, outHas('gunicorn')] },
    { id: '4.2.3-p4', prompt: 'Find which process is listening on port 25, the mail port.', solution: 'netstat -tlnp | grep :25', checks: [usesPipe, outHas('master')] },
    { id: '4.2.3-p5', prompt: 'Do the same lookup for port 22 using the modern tool, ss.', solution: 'ss -tlnp | grep :22', checks: [usesPipe, outHas('sshd')] },
  ],

  // --- 4.2.4 established -----------------------------------------------------
  '4.2.4': [
    { id: '4.2.4-p1', prompt: 'Show established connections using ss. Note that ss abbreviates the state to ESTAB.', solution: 'ss -tn | grep ESTAB', checks: [usesPipe, outHas('ESTAB')] },
    { id: '4.2.4-p2', prompt: 'Using a pipe, count how many connections are established.', solution: 'netstat -tn | grep -c ESTABLISHED', checks: [usesPipe, { type: 'output-numeric', equals: 5, hint: 'The answer is a single number.' }] },
    { id: '4.2.4-p3', prompt: 'Using a pipe, show any TCP connections in the TIME_WAIT state.', solution: 'netstat -tn | grep TIME_WAIT', checks: [usesPipe, outHas('10.20.7.22')] },
    { id: '4.2.4-p4', prompt: 'Using a pipe, show established connections involving the SSH port.', solution: 'netstat -tn | grep ESTABLISHED | grep :22', checks: [usesPipe, outHas('10.20.4.31')] },
    { id: '4.2.4-p5', prompt: 'Using a pipe, show established connections involving the HTTPS port 443.', solution: 'netstat -tn | grep ESTABLISHED | grep :443', checks: [usesPipe, outHas('198.51.100.60')] },
  ],

  // --- 4.2.5 inverted match --------------------------------------------------
  '4.2.5': [
    { id: '4.2.5-p1', prompt: 'Show all TCP sockets except the ones in the LISTEN state.', solution: 'netstat -tan | grep -v LISTEN', checks: [hasFlag('grep', 'v'), outLacks('LISTEN')] },
    { id: '4.2.5-p2', prompt: 'Show the listening TCP sockets except those bound to loopback.', solution: 'netstat -tln | grep -v 127.0.0.1', checks: [hasFlag('grep', 'v'), outLacks('127.0.0.1')] },
    { id: '4.2.5-p3', prompt: 'Show established connections except those involving the office subnet 10.20.4.', solution: 'netstat -tn | grep ESTABLISHED | grep -v 10.20.4.', checks: [hasFlag('grep', 'v'), outLacks('10.20.4.31')] },
    { id: '4.2.5-p4', prompt: 'Show all sockets except IPv6 ones.', solution: 'netstat -an | grep -v tcp6', checks: [hasFlag('grep', 'v'), outLacks('tcp6')] },
    { id: '4.2.5-p5', prompt: 'Show the routing table without the default route.', solution: 'ip route | grep -v default', checks: [hasFlag('grep', 'v'), outLacks('default via')] },
  ],

  // --- 4.2.6 the anomaly -----------------------------------------------------
  '4.2.6': [
    { id: '4.2.6-p1', prompt: 'Show every socket owned by curl.', solution: 'netstat -anp | grep curl', checks: [usesPipe, outHas('198.51.100.60')] },
    { id: '4.2.6-p2', prompt: 'Find the connection to 198.51.100.60 and the process behind it.', solution: 'netstat -tnp | grep 198.51.100.60', checks: [usesPipe, outHas('curl')] },
    { id: '4.2.6-p3', prompt: 'Now look at the other half of the story: show the curl processes running on this host.', solution: 'ps aux | grep curl', checks: [usesPipe, outHas('sysmon')] },
    { id: '4.2.6-p4', prompt: 'Show all processes owned by the sysmon account.', solution: 'ps aux | grep sysmon', checks: [usesPipe, outHas('/tmp/.cache')] },
    { id: '4.2.6-p5', prompt: 'Do the same connection lookup with ss instead of netstat.', solution: 'ss -tnp | grep 198.51.100.60', checks: [usesPipe, outHas('curl')] },
  ],

  // --- 4.3.1 forward lookups -------------------------------------------------
  '4.3.1': [
    { id: '4.3.1-p1', prompt: 'Look up rmg-web-01.ridgelinemed.example.', solution: 'dig rmg-web-01.ridgelinemed.example', checks: [outHas('10.20.6.41')] },
    { id: '4.3.1-p2', prompt: 'Look up the backup server, rmg-backup-01.ridgelinemed.example.', solution: 'dig rmg-backup-01.ridgelinemed.example', checks: [outHas('10.20.9.15')] },
    { id: '4.3.1-p3', prompt: 'Use the shorter `host` tool to look up rmg-monitor-01.ridgelinemed.example.', solution: 'host rmg-monitor-01.ridgelinemed.example', checks: [outHas('10.20.9.40')] },
    { id: '4.3.1-p4', prompt: 'Use nslookup to resolve ridgelinemed.example.', solution: 'nslookup ridgelinemed.example', checks: [outHas('10.20.6.41')] },
    { id: '4.3.1-p5', prompt: 'Look up a name that does not exist, nothere.ridgelinemed.example, and read the status.', solution: 'dig nothere.ridgelinemed.example', checks: [outHas('NXDOMAIN')] },
  ],

  // --- 4.3.2 reverse lookups -------------------------------------------------
  '4.3.2': [
    { id: '4.3.2-p1', prompt: 'Find the name behind 10.20.9.15.', solution: 'nslookup 10.20.9.15', checks: [outHas('rmg-backup-01')] },
    { id: '4.3.2-p2', prompt: 'Find the name behind 10.20.6.41 using dig\'s reverse flag.', solution: 'dig -x 10.20.6.41', checks: [outHas('rmg-web-01')] },
    { id: '4.3.2-p3', prompt: 'Find the name behind this host\'s own address, 10.20.6.40.', solution: 'nslookup 10.20.6.40', checks: [outHas('rmg-web-02')] },
    { id: '4.3.2-p4', prompt: 'Use the `host` tool to reverse 10.20.6.41.', solution: 'host 10.20.6.41', checks: [outHas('rmg-web-01')] },
    { id: '4.3.2-p5', prompt: 'Try a reverse lookup on the external address 198.51.100.60. Note that it has no reverse record — which is itself a small signal.', solution: 'nslookup 198.51.100.60', checks: [outHas('NXDOMAIN')] },
  ],

  // --- 4.3.3 resolvers -------------------------------------------------------
  '4.3.3': [
    { id: '4.3.3-p1', prompt: 'Using a pipe, show only the nameserver lines from the resolver configuration.', solution: 'grep nameserver /etc/resolv.conf', checks: [outHas('10.20.1.10'), outHas('10.20.1.11')] },
    { id: '4.3.3-p2', prompt: 'Using a pipe, count how many nameservers are configured.', solution: 'grep -c nameserver /etc/resolv.conf', checks: [{ type: 'output-numeric', equals: 2, hint: 'The answer is a single number.' }] },
    { id: '4.3.3-p3', prompt: 'Show only the search domain line from the resolver configuration.', solution: 'grep search /etc/resolv.conf', checks: [outHas('ridgelinemed.example')] },
    { id: '4.3.3-p4', prompt: 'Check whether the primary resolver answers a ping.', solution: 'ping -c 1 10.20.1.10', checks: [outHas('10.20.1.10')] },
    { id: '4.3.3-p5', prompt: 'Show the first two lines of the resolver configuration file.', solution: 'head -n 2 /etc/resolv.conf', checks: [lines(2)] },
  ],

  // --- 4.3.4 the hosts file --------------------------------------------------
  '4.3.4': [
    { id: '4.3.4-p1', prompt: 'Using grep, show only the Ridgeline hosts in /etc/hosts.', solution: 'grep rmg /etc/hosts', checks: [outHas('rmg-backup-01'), outLacks('ip6-localnet')] },
    { id: '4.3.4-p2', prompt: 'Using grep, show only the IPv6 entries in /etc/hosts.', solution: 'grep ip6 /etc/hosts', checks: [outHas('ip6-localhost')] },
    { id: '4.3.4-p3', prompt: 'Using a pipe, count how many entries mention the 10.20 network.', solution: 'grep -c "10.20." /etc/hosts', checks: [{ type: 'output-numeric', equals: 6, hint: 'The answer is a single number.' }] },
    { id: '4.3.4-p4', prompt: 'Find the entry for the lab interface host, rmg-lab-if-01.', solution: 'grep rmg-lab-if-01 /etc/hosts', checks: [outHas('10.20.7.22')] },
    { id: '4.3.4-p5', prompt: 'Show the first 3 lines of /etc/hosts.', solution: 'head -n 3 /etc/hosts', checks: [lines(3), outHas('localhost')] },
  ],
};
