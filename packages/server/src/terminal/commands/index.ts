/**
 * The command registry.
 *
 * A command exists only if it is listed here. That allowlist is the security
 * boundary of the whole simulator: an unknown name produces "command not found"
 * and never reaches anything that could execute.
 */

import { fromLines, ok, type CommandResult, type ExecContext } from '../context.js';
import * as capture from './capture.js';
import * as fs from './filesystem.js';
import * as osq from './osquery.js';
import * as ids from './suricata.js';
import * as net from './network.js';
import * as sys from './system.js';
import * as text from './text.js';

export type CommandHandler = (argv: string[], ctx: ExecContext) => CommandResult;

export interface CommandSpec {
  handler: CommandHandler;
  /** One-line description shown by `help`. */
  summary: string;
  /** Usage line shown by `help <command>`. */
  usage: string;
  /** Grouping for the `help` listing. */
  group: 'navigation' | 'files' | 'viewing' | 'searching' | 'system' | 'network' | 'shell';
}

export const COMMANDS: Record<string, CommandSpec> = {
  // --- navigation ---
  pwd: { handler: fs.pwd, summary: 'Print the working directory', usage: 'pwd', group: 'navigation' },
  cd: { handler: fs.cd, summary: 'Change directory', usage: 'cd [DIR]', group: 'navigation' },
  ls: { handler: fs.ls, summary: 'List directory contents', usage: 'ls [-l] [-a] [-h] [-t] [-r] [-R] [-d] [FILE...]', group: 'navigation' },

  // --- files ---
  touch: { handler: fs.touch, summary: 'Create an empty file', usage: 'touch FILE...', group: 'files' },
  mkdir: { handler: fs.mkdir, summary: 'Create a directory', usage: 'mkdir [-p] DIR...', group: 'files' },
  rm: { handler: fs.rm, summary: 'Remove files or directories', usage: 'rm [-r] [-f] FILE...', group: 'files' },
  rmdir: { handler: fs.rmdir, summary: 'Remove an empty directory', usage: 'rmdir DIR...', group: 'files' },
  cp: { handler: fs.cp, summary: 'Copy files or directories', usage: 'cp [-r] SOURCE... DEST', group: 'files' },
  mv: { handler: fs.mv, summary: 'Move or rename files', usage: 'mv SOURCE... DEST', group: 'files' },
  chmod: { handler: fs.chmod, summary: 'Change file permissions', usage: 'chmod OCTAL-MODE FILE...', group: 'files' },
  du: { handler: fs.du, summary: 'Show disk usage', usage: 'du [-s] [-h] [PATH...]', group: 'files' },
  df: { handler: fs.df, summary: 'Show free disk space', usage: 'df [-h]', group: 'files' },
  find: { handler: fs.find, summary: 'Search for files by name, type, age, or permission', usage: 'find PATH [-name PATTERN] [-type f|d] [-mtime N] [-perm MODE] [-owner USER]', group: 'searching' },
  stat: { handler: fs.stat, summary: 'Show detailed file metadata', usage: 'stat FILE...', group: 'files' },

  // --- viewing ---
  cat: { handler: text.cat, summary: 'Print a whole file', usage: 'cat [-n] FILE...', group: 'viewing' },
  less: { handler: text.less, summary: 'View a file one screen at a time', usage: 'less FILE', group: 'viewing' },
  more: { handler: text.less, summary: 'View a file one screen at a time', usage: 'more FILE', group: 'viewing' },
  head: { handler: text.head, summary: 'Show the first lines of a file', usage: 'head [-n COUNT] [FILE...]', group: 'viewing' },
  tail: { handler: text.tail, summary: 'Show the last lines of a file', usage: 'tail [-n COUNT] [FILE...]', group: 'viewing' },

  // --- searching and text processing ---
  grep: { handler: text.grep, summary: 'Search text for a pattern', usage: 'grep [-i] [-c] [-n] [-v] [-o] [-l] [-E] [-r] PATTERN [FILE...]', group: 'searching' },
  wc: { handler: text.wc, summary: 'Count lines, words, and characters', usage: 'wc [-l] [-w] [-c] [FILE...]', group: 'searching' },
  sort: { handler: text.sort, summary: 'Sort lines', usage: 'sort [-n] [-h] [-r] [-u] [-k FIELD] [FILE]', group: 'searching' },
  uniq: { handler: text.uniq, summary: 'Collapse adjacent duplicate lines', usage: 'uniq [-c] [-d] [FILE]', group: 'searching' },
  cut: { handler: text.cut, summary: 'Extract fields or characters from each line', usage: 'cut -d DELIM -f FIELDS [FILE]', group: 'searching' },
  echo: { handler: text.echo, summary: 'Print text', usage: 'echo [-n] TEXT...', group: 'shell' },

  // --- system ---
  ps: { handler: sys.ps, summary: 'List running processes', usage: 'ps [aux]', group: 'system' },
  top: { handler: sys.top, summary: 'Show processes by resource use', usage: 'top -bn1', group: 'system' },
  uptime: { handler: sys.uptime, summary: 'Show uptime and load average', usage: 'uptime', group: 'system' },
  free: { handler: sys.free, summary: 'Show memory usage', usage: 'free [-h]', group: 'system' },
  whoami: { handler: sys.whoami, summary: 'Print the current user', usage: 'whoami', group: 'system' },
  id: { handler: sys.id, summary: 'Show user and group identity', usage: 'id [USER]', group: 'system' },
  hostname: { handler: sys.hostname, summary: 'Print the system hostname', usage: 'hostname', group: 'system' },
  uname: { handler: sys.uname, summary: 'Print kernel and system information', usage: 'uname [-a] [-r]', group: 'system' },
  date: { handler: sys.date, summary: 'Print the current date and time', usage: 'date', group: 'system' },
  systemctl: { handler: sys.systemctl, summary: 'Inspect system services', usage: 'systemctl list-units --type=service --state=running | systemctl status UNIT', group: 'system' },
  journalctl: { handler: sys.journalctl, summary: 'Read the system journal', usage: 'journalctl [-u UNIT] [-n COUNT]', group: 'system' },
  dpkg: { handler: sys.dpkg, summary: 'List installed packages', usage: 'dpkg -l [PACKAGE]', group: 'system' },
  apt: { handler: sys.apt, summary: 'Show package information', usage: 'apt show PACKAGE', group: 'system' },
  lastlog: { handler: sys.lastlog, summary: 'Show the last login for each account', usage: 'lastlog', group: 'system' },

  // --- network ---
  ip: { handler: net.ip, summary: 'Show interfaces, addresses, and routes', usage: 'ip addr | ip link | ip route', group: 'network' },
  ifconfig: { handler: net.ifconfig, summary: 'Show interface configuration', usage: 'ifconfig [-a] [INTERFACE]', group: 'network' },
  netstat: { handler: net.netstat, summary: 'Show network connections', usage: 'netstat [-a] [-t] [-u] [-l] [-n] [-p]', group: 'network' },
  ss: { handler: net.ss, summary: 'Show socket statistics', usage: 'ss [-a] [-t] [-u] [-l] [-n] [-p]', group: 'network' },
  ping: { handler: net.ping, summary: 'Test reachability of a host', usage: 'ping -c COUNT HOST', group: 'network' },
  dig: { handler: net.dig, summary: 'Query DNS', usage: 'dig NAME | dig -x ADDRESS', group: 'network' },
  nslookup: { handler: net.nslookup, summary: 'Look up a name or address', usage: 'nslookup NAME|ADDRESS', group: 'network' },
  host: { handler: net.host, summary: 'Look up a name or address', usage: 'host NAME|ADDRESS', group: 'network' },
  tcpdump: {
    handler: capture.tcpdump,
    summary: 'Read a saved packet capture, with an optional filter',
    usage: "tcpdump -r FILE [-n] [-q] [-t] [-c COUNT] ['FILTER']",
    group: 'network',
  },
  suricata: {
    handler: ids.suricata,
    summary: 'Run signature rules against a saved capture',
    usage: 'suricata -r CAPTURE -S RULES',
    group: 'network',
  },
  osqueryi: {
    handler: osq.osqueryi,
    summary: 'Query the host as SQL tables',
    usage: 'osqueryi [--json|--csv|--line] "SELECT ... FROM TABLE [WHERE ...]"',
    group: 'system',
  },
};

const GROUP_TITLES: Record<CommandSpec['group'], string> = {
  navigation: 'Getting around',
  files: 'Working with files',
  viewing: 'Reading files',
  searching: 'Searching and filtering',
  system: 'System and processes',
  network: 'Networking',
  shell: 'Shell',
};

/**
 * `help` is implemented here rather than in a command module because it needs to
 * read the registry, and the registry imports every command module.
 */
export function help(argv: string[], _ctx: ExecContext): CommandResult {
  const requested = argv[1];

  if (requested) {
    const spec = COMMANDS[requested];
    if (!spec) {
      return { stdout: '', stderr: `help: no help topics match '${requested}'\n`, exitCode: 1 };
    }
    return ok(fromLines([`${requested} - ${spec.summary}`, '', `Usage: ${spec.usage}`]));
  }

  const byGroup = new Map<CommandSpec['group'], string[]>();
  for (const [name, spec] of Object.entries(COMMANDS)) {
    const bucket = byGroup.get(spec.group);
    if (bucket) bucket.push(name);
    else byGroup.set(spec.group, [name]);
  }

  const lines = [
    'Available commands. Type "help <command>" for usage.',
    '',
  ];
  for (const group of ['navigation', 'files', 'viewing', 'searching', 'system', 'network', 'shell'] as const) {
    const names = byGroup.get(group);
    if (!names) continue;
    lines.push(GROUP_TITLES[group] + ':');
    for (const name of names.sort()) {
      lines.push(`  ${name.padEnd(12)} ${COMMANDS[name]!.summary}`);
    }
    lines.push('');
  }
  lines.push('You can also use pipes (|) and output redirection (> and >>).');
  return ok(fromLines(lines));
}

COMMANDS['help'] = {
  handler: help,
  summary: 'List available commands',
  usage: 'help [COMMAND]',
  group: 'shell',
};
