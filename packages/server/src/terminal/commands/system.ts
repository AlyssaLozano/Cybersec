/**
 * Process, user, and service inspection commands.
 *
 * These render the frozen MachineState rather than touching the host. Nothing
 * here can reach the real machine the server runs on, by construction: there is
 * no shell-out, no child process, and no filesystem access outside the Vfs.
 */

import { formatLsTime, WORLD_NOW } from '../../vfs/clock.js';
import { fromLines, ok, toolError, humanSize, type CommandResult, type ExecContext } from '../context.js';
import { parseArgs } from '../parser.js';

export function whoami(_argv: string[], ctx: ExecContext): CommandResult {
  return ok(ctx.user + '\n');
}

export function id(argv: string[], ctx: ExecContext): CommandResult {
  const { positionals } = parseArgs(argv);
  const target = positionals[0] ?? ctx.user;

  // Read the identity out of /etc/passwd so `id` and `cat /etc/passwd` can never
  // disagree with each other.
  const passwd = ctx.vfs.stat('/etc/passwd')?.content ?? '';
  const row = passwd.split('\n').find((line) => line.startsWith(target + ':'));
  if (!row) return toolError('id', `'${target}': no such user`);

  const [name, , uid, gid] = row.split(':');
  const groups = (ctx.vfs.stat('/etc/group')?.content ?? '')
    .split('\n')
    .filter((line) => line.split(':')[3]?.split(',').includes(target!))
    .map((line) => ({ name: line.split(':')[0], gid: line.split(':')[2] }))
    .filter((group) => Boolean(group.name));

  // The gid comes out of /etc/group like the name does. It used to be hardcoded
  // to 27, which was invisible while `adm` was the only supplementary group and
  // wrong the moment a second one existed.
  const extra =
    groups.length > 0 ? ',' + groups.map((g) => `${g.gid}(${g.name})`).join(',') : '';
  return ok(`uid=${uid}(${name}) gid=${gid}(${name}) groups=${gid}(${name})${extra}\n`);
}

export function hostname(_argv: string[], ctx: ExecContext): CommandResult {
  return ok(ctx.machine.hostname + '\n');
}

export function uname(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  if (args.flags.has('a')) {
    return ok(
      `Linux ${ctx.machine.hostname} 5.15.0-105-generic #115-Ubuntu SMP Mon Apr 15 09:52:04 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux\n`,
    );
  }
  if (args.flags.has('r')) return ok('5.15.0-105-generic\n');
  return ok('Linux\n');
}

export function date(_argv: string[], _ctx: ExecContext): CommandResult {
  // The simulated machine is frozen, so date must agree with the log timestamps.
  const when = new Date(WORLD_NOW);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (n: number) => String(n).padStart(2, '0');
  return ok(
    `${days[when.getUTCDay()]} ${months[when.getUTCMonth()]} ${pad(when.getUTCDate())} ` +
      `${pad(when.getUTCHours())}:${pad(when.getUTCMinutes())}:${pad(when.getUTCSeconds())} UTC ${when.getUTCFullYear()}\n`,
  );
}

export function uptime(_argv: string[], ctx: ExecContext): CommandResult {
  const [one, five, fifteen] = ctx.machine.loadAverage;
  return ok(
    ` 11:50:01 up ${ctx.machine.uptimeText},  2 users,  load average: ${one.toFixed(2)}, ${five.toFixed(2)}, ${fifteen.toFixed(2)}\n`,
  );
}

// --- ps ----------------------------------------------------------------------

export function ps(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  // BSD-style flags come through as positionals when written without a dash
  // (`ps aux`), which is how essentially everyone types it.
  const bsd = argv.slice(1).join(' ').replace(/-/g, '');
  const showAll = bsd.includes('a') || bsd.includes('e') || args.flags.has('e') || args.flags.has('A');
  const userFormat = bsd.includes('u');

  const processes = showAll
    ? ctx.machine.processes
    : ctx.machine.processes.filter((process) => process.user === ctx.user);

  if (!userFormat) {
    const lines = ['    PID TTY          TIME CMD'];
    for (const process of processes) {
      lines.push(
        `${String(process.pid).padStart(7)} ${process.tty.padEnd(8)} ${process.time.padStart(8)} ${process.command.split(' ')[0]}`,
      );
    }
    return ok(fromLines(lines));
  }

  const lines = [
    'USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
  ];
  for (const process of processes) {
    lines.push(
      [
        process.user.padEnd(8),
        String(process.pid).padStart(6),
        process.cpu.toFixed(1).padStart(4),
        process.mem.toFixed(1).padStart(4),
        String(process.vsz).padStart(6),
        String(process.rss).padStart(5),
        process.tty.padEnd(8),
        process.stat.padEnd(4),
        process.start.padStart(5),
        process.time.padStart(6),
        process.command,
      ].join(' '),
    );
  }
  return ok(fromLines(lines));
}

export function top(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv, { valueFlags: ['n'] });
  // Interactive top would never terminate in a web terminal, so only batch mode
  // (`top -bn1`) is meaningful here.
  if (!args.flags.has('b')) {
    return toolError(
      'top',
      'interactive mode is not available in this simulator. Use batch mode instead: top -bn1',
    );
  }

  const [one, five, fifteen] = ctx.machine.loadAverage;
  const byCpu = [...ctx.machine.processes].sort((a, b) => b.cpu - a.cpu);

  const lines = [
    `top - 11:50:01 up ${ctx.machine.uptimeText},  2 users,  load average: ${one.toFixed(2)}, ${five.toFixed(2)}, ${fifteen.toFixed(2)}`,
    `Tasks: ${ctx.machine.processes.length} total,   1 running, ${ctx.machine.processes.length - 1} sleeping,   0 stopped,   0 zombie`,
    '%Cpu(s):  3.1 us,  1.2 sy,  0.0 ni, 95.4 id,  0.3 wa,  0.0 hi,  0.0 si,  0.0 st',
    'MiB Mem :   7851.0 total,    890.7 free,   3452.1 used,   3508.2 buff/cache',
    'MiB Swap:      0.0 total,      0.0 free,      0.0 used.   4083.0 avail Mem',
    '',
    '    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
  ];

  for (const process of byCpu) {
    lines.push(
      [
        String(process.pid).padStart(7),
        process.user.padEnd(9),
        '20',
        '  0',
        String(process.vsz).padStart(7),
        String(process.rss).padStart(6),
        String(Math.round(process.rss * 0.4)).padStart(6),
        process.stat[0] ?? 'S',
        process.cpu.toFixed(1).padStart(5),
        process.mem.toFixed(1).padStart(5),
        (process.time + '.00').padStart(9),
        process.command.split(' ')[0],
      ].join(' '),
    );
  }
  return ok(fromLines(lines));
}

export function free(argv: string[], _ctx: ExecContext): CommandResult {
  const human = parseArgs(argv).flags.has('h');
  if (human) {
    return ok(
      fromLines([
        '               total        used        free      shared  buff/cache   available',
        'Mem:           7.7Gi       3.4Gi       870Mi        18Mi       3.4Gi       4.0Gi',
        'Swap:             0B          0B          0B',
      ]),
    );
  }
  return ok(
    fromLines([
      '               total        used        free      shared  buff/cache   available',
      'Mem:         8039384     3534952      890752       18432     3592680     4180992',
      'Swap:              0           0           0',
    ]),
  );
}

// --- services and packages ---------------------------------------------------

const SERVICES = [
  { unit: 'cron.service', description: 'Regular background program processing daemon', active: true },
  { unit: 'dbus.service', description: 'D-Bus System Message Bus', active: true },
  { unit: 'nginx.service', description: 'A high performance web server and a reverse proxy server', active: true },
  { unit: 'postfix.service', description: 'Postfix Mail Transport Agent', active: true },
  { unit: 'postgresql.service', description: 'PostgreSQL RDBMS', active: true },
  { unit: 'portal-app.service', description: 'Ridgeline Patient Portal (gunicorn)', active: true },
  { unit: 'ssh.service', description: 'OpenBSD Secure Shell server', active: true },
  { unit: 'systemd-journald.service', description: 'Journal Service', active: true },
  { unit: 'systemd-logind.service', description: 'User Login Management', active: true },
  { unit: 'systemd-resolved.service', description: 'Network Name Resolution', active: true },
  { unit: 'rmg-backup.service', description: 'Ridgeline nightly backup', active: false },
];

export function systemctl(argv: string[], ctx: ExecContext): CommandResult {
  const args = argv.slice(1);
  const sub = args[0];

  if (sub === 'list-units' || sub === undefined) {
    const runningOnly = args.some((arg) => arg.includes('running'));
    const units = SERVICES.filter((service) => !runningOnly || service.active);
    const lines = ['  UNIT                            LOAD   ACTIVE SUB     DESCRIPTION'];
    for (const service of units) {
      lines.push(
        `  ${service.unit.padEnd(31)} loaded ${(service.active ? 'active' : 'failed').padEnd(6)} ${(service.active ? 'running' : 'dead').padEnd(7)} ${service.description}`,
      );
    }
    lines.push('', `${units.length} loaded units listed.`);
    return ok(fromLines(lines));
  }

  if (sub === 'status') {
    const name = args[1];
    if (!name) return toolError('systemctl', 'status requires a unit name');
    const service =
      SERVICES.find((s) => s.unit === name || s.unit === name + '.service') ?? null;
    if (!service) return { stdout: `Unit ${name}.service could not be found.\n`, stderr: '', exitCode: 4 };

    const lines = [
      `● ${service.unit} - ${service.description}`,
      `     Loaded: loaded (/lib/systemd/system/${service.unit}; enabled; vendor preset: enabled)`,
      service.active
        ? `     Active: active (running) since Thu 2026-08-13 01:07:12 UTC; ${ctx.machine.uptimeText} ago`
        : `     Active: inactive (dead) since Sat 2026-08-15 01:52:42 UTC`,
      `   Main PID: ${ctx.machine.processes.find((p) => service.unit.startsWith(p.command.split(' ')[0]?.split('/').pop() ?? ''))?.pid ?? 1198} (${service.unit.replace('.service', '')})`,
      `      Tasks: 3 (limit: 9403)`,
      `     Memory: ${humanSize(24_880 * 1024)}`,
    ];
    return { stdout: fromLines(lines), stderr: '', exitCode: service.active ? 0 : 3 };
  }

  if (sub === 'start' || sub === 'stop' || sub === 'restart' || sub === 'enable' || sub === 'disable') {
    return toolError(
      'systemctl',
      `changing service state requires root privileges, and this simulator runs read-only. Use "systemctl status ${args[1] ?? '<unit>'}" to inspect instead.`,
    );
  }

  return toolError('systemctl', `Unknown command verb ${sub}.`);
}

const PACKAGES = [
  { name: 'openssh-server', version: '1:8.9p1-3ubuntu0.10', description: 'secure shell (SSH) server, for secure access from remote machines' },
  { name: 'openssh-client', version: '1:8.9p1-3ubuntu0.10', description: 'secure shell (SSH) client, for secure access to remote machines' },
  { name: 'nginx', version: '1.18.0-6ubuntu14.4', description: 'small, powerful, scalable web/proxy server' },
  { name: 'postgresql-14', version: '14.11-0ubuntu0.22.04.1', description: 'The World\'s Most Advanced Open Source Relational Database' },
  { name: 'python3', version: '3.10.6-1~22.04', description: 'interactive high-level object-oriented language' },
  { name: 'curl', version: '7.81.0-1ubuntu1.16', description: 'command line tool for transferring data with URL syntax' },
  { name: 'libssl3', version: '3.0.2-0ubuntu1.16', description: 'Secure Sockets Layer toolkit - shared libraries' },
  { name: 'cron', version: '3.0pl1-137ubuntu3', description: 'process scheduling daemon' },
  { name: 'sudo', version: '1.9.9-1ubuntu2.4', description: 'Provide limited super user privileges to specific users' },
  { name: 'rsyslog', version: '8.2112.0-2ubuntu2.2', description: 'reliable system and kernel logging daemon' },
];

export function dpkg(argv: string[], _ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  if (!args.flags.has('l') && !args.longFlags.has('list')) {
    return toolError('dpkg', 'this simulator supports "dpkg -l" for listing installed packages');
  }

  const filter = args.positionals[0];
  const matched = filter ? PACKAGES.filter((p) => p.name.includes(filter)) : PACKAGES;

  const lines = [
    'Desired=Unknown/Install/Remove/Purge/Hold',
    '| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend',
    '|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)',
    '||/ Name                     Version                  Architecture Description',
    '+++-========================-========================-============-=================================',
  ];
  for (const pkg of matched) {
    lines.push(`ii  ${pkg.name.padEnd(24)} ${pkg.version.padEnd(24)} amd64        ${pkg.description}`);
  }
  return ok(fromLines(lines));
}

export function apt(argv: string[], ctx: ExecContext): CommandResult {
  const sub = argv[1];
  const name = argv[2];
  if (sub === 'show' && name) {
    const pkg = PACKAGES.find((p) => p.name === name);
    if (!pkg) return toolError('apt', `No packages found matching ${name}`);
    return ok(
      fromLines([
        `Package: ${pkg.name}`,
        `Version: ${pkg.version}`,
        'Priority: optional',
        'Section: net',
        `Description: ${pkg.description}`,
      ]),
    );
  }
  if (sub === 'list' || sub === 'search') return dpkg(['dpkg', '-l', ...(name ? [name] : [])], ctx);
  return toolError('apt', 'this simulator supports "apt show <package>" and "apt list"');
}

export function journalctl(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv, { valueFlags: ['u', 'n'] });
  const unit = args.values.get('u');
  const count = Number(args.values.get('n') ?? 20);

  const syslog = ctx.vfs.stat('/var/log/syslog')?.content ?? '';
  let lines = syslog.split('\n').filter(Boolean);
  if (unit) {
    const needle = unit.replace('.service', '');
    lines = lines.filter((line) => line.toLowerCase().includes(needle.toLowerCase()));
  }
  return ok(fromLines(lines.slice(-count)));
}

export function lastlog(_argv: string[], ctx: ExecContext): CommandResult {
  const lines = [
    'Username         Port     From             Latest',
    `root                                      **Never logged in**`,
    `student          pts/0    10.20.4.99       ${formatLsTime(WORLD_NOW)} 2026`,
    `jmartel          pts/2    10.20.4.31       Aug 15 07:38 2026`,
    `dokafor          pts/4    10.20.4.58       Aug 15 09:02 2026`,
    `rchen            pts/0    10.20.4.12       Aug 15 03:11 2026`,
    `testuser         pts/1    203.0.113.55     Aug 15 10:14 2026`,
    `sysmon           pts/3    203.0.113.55     Aug 15 11:05 2026`,
  ];
  void ctx;
  return ok(fromLines(lines));
}
