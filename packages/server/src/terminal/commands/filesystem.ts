/**
 * Navigation and file-manipulation commands.
 *
 * Error text is copied from GNU coreutils rather than paraphrased. A student who
 * memorises "cannot remove 'x': Is a directory" here will recognise it verbatim
 * on a real box, and that recognition is most of what these exercises buy.
 */

import { formatLsTime, ageInDays } from '../../vfs/clock.js';
import { basename, dirname } from '../../vfs/path.js';
import type { Entry } from '../../vfs/vfs.js';
import { VfsError } from '../../vfs/vfs.js';
import type { VNode } from '../../vfs/types.js';
import {
  canRead,
  fail,
  formatMode,
  fromLines,
  humanSize,
  ok,
  toolError,
  type CommandResult,
  type ExecContext,
} from '../context.js';
import { parseArgs } from '../parser.js';

/** Wraps a VfsError into the message the calling tool would print. */
function vfsError(tool: string, error: unknown): CommandResult {
  if (error instanceof VfsError) return toolError(tool, error.message);
  throw error;
}

export function pwd(_argv: string[], ctx: ExecContext): CommandResult {
  return ok(ctx.cwd + '\n');
}

export function cd(argv: string[], ctx: ExecContext): CommandResult {
  const { positionals } = parseArgs(argv);
  const target = positionals[0] ?? '~';
  const path = ctx.vfs.resolvePath(ctx.cwd, target);

  const node = ctx.vfs.stat(path);
  if (!node) return toolError('cd', `${target}: No such file or directory`);
  if (node.kind !== 'dir') return toolError('cd', `${target}: Not a directory`);

  ctx.setCwd(path);
  return ok();
}

// --- ls ----------------------------------------------------------------------

function lsLongLine(entry: Entry, ctx: ExecContext, human: boolean): string {
  const node = entry.node;
  const size = ctx.vfs.sizeOf(node);
  // Real ls right-aligns these columns; the widths below match a typical box.
  const links = node.kind === 'dir' ? 2 : 1;
  return [
    formatMode(node),
    String(links).padStart(2),
    node.owner.padEnd(8),
    node.group.padEnd(8),
    (human ? humanSize(size) : String(size)).padStart(9),
    formatLsTime(node.mtime),
    entry.name,
  ].join(' ');
}

export function ls(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const long = args.flags.has('l');
  const all = args.flags.has('a');
  const almostAll = args.flags.has('A');
  const human = args.flags.has('h');
  const dirOnly = args.flags.has('d');
  const byTime = args.flags.has('t');
  const reverse = args.flags.has('r');
  const recursive = args.flags.has('R');
  const onedPerLine = args.flags.has('1');

  const targets = args.positionals.length > 0 ? args.positionals : ['.'];

  // Expand globs first, the way the shell would before ls ever sees them.
  const paths: string[] = [];
  for (const target of targets) {
    paths.push(...ctx.vfs.expandGlob(ctx.cwd, target));
  }

  const stdoutParts: string[] = [];
  const stderrParts: string[] = [];
  let exitCode = 0;

  const renderEntries = (entries: Entry[], header?: string): void => {
    let visible = entries;
    if (!all && !almostAll) visible = visible.filter((e) => !e.name.startsWith('.'));

    if (byTime) visible = [...visible].sort((a, b) => b.node.mtime - a.node.mtime);
    if (reverse) visible = [...visible].reverse();

    const body = long
      ? visible.map((entry) => lsLongLine(entry, ctx, human)).join('\n')
      : onedPerLine
        ? visible.map((entry) => entry.name).join('\n')
        : visible.map((entry) => entry.name).join('  ');

    if (header !== undefined) stdoutParts.push(header + ':');
    if (long) {
      // `ls -l` prints a total-blocks line before the entries.
      const blocks = visible.reduce((sum, entry) => sum + Math.ceil(ctx.vfs.sizeOf(entry.node) / 1024), 0);
      stdoutParts.push(`total ${blocks}`);
    }
    if (body !== '') stdoutParts.push(body);
  };

  for (const path of paths) {
    const node = ctx.vfs.stat(path);
    if (!node) {
      stderrParts.push(`ls: cannot access '${path}': No such file or directory`);
      exitCode = 2;
      continue;
    }

    if (node.kind !== 'dir' || dirOnly) {
      const entry: Entry = { path, name: paths.length > 1 || dirOnly ? path : basename(path), node };
      stdoutParts.push(long ? lsLongLine(entry, ctx, human) : entry.name);
      continue;
    }

    if (!canRead(node, ctx)) {
      stderrParts.push(`ls: cannot open directory '${path}': Permission denied`);
      exitCode = 2;
      continue;
    }

    let entries: Entry[];
    try {
      entries = ctx.vfs.readDir(path);
    } catch (error) {
      return vfsError('ls', error);
    }

    // `-a` synthesises the . and .. entries a real directory always has.
    if (all) {
      const self = ctx.vfs.stat(path)!;
      const parent = ctx.vfs.stat(dirname(path)) ?? self;
      entries = [
        { path, name: '.', node: self },
        { path: dirname(path), name: '..', node: parent },
        ...entries,
      ];
    }

    renderEntries(entries, paths.length > 1 || recursive ? path : undefined);

    if (recursive) {
      for (const child of entries.filter((e) => e.node.kind === 'dir' && e.name !== '.' && e.name !== '..')) {
        const nested = ls([...(long ? ['-l'] : []), '-R', child.path], ctx);
        if (nested.stdout) stdoutParts.push('', nested.stdout.replace(/\n$/, ''));
      }
    }
  }

  const stdout = stdoutParts.length > 0 ? stdoutParts.join('\n') + '\n' : '';
  const stderr = stderrParts.length > 0 ? stderrParts.join('\n') : '';
  return { stdout, stderr, exitCode };
}

// --- creation and removal ----------------------------------------------------

export function touch(argv: string[], ctx: ExecContext): CommandResult {
  const { positionals } = parseArgs(argv);
  if (positionals.length === 0) return toolError('touch', 'missing file operand');

  for (const target of positionals) {
    const path = ctx.vfs.resolvePath(ctx.cwd, target);
    try {
      ctx.vfs.touch(path);
    } catch (error) {
      return vfsError('touch', error);
    }
  }
  return ok();
}

export function mkdir(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const recursive = args.flags.has('p');
  if (args.positionals.length === 0) return toolError('mkdir', 'missing operand');

  for (const target of args.positionals) {
    const path = ctx.vfs.resolvePath(ctx.cwd, target);
    try {
      ctx.vfs.mkdir(path, recursive);
    } catch (error) {
      return vfsError('mkdir', error);
    }
  }
  return ok();
}

export function rm(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const recursive = args.flags.has('r') || args.flags.has('R');
  const force = args.flags.has('f');

  if (args.positionals.length === 0) {
    return force ? ok() : toolError('rm', 'missing operand');
  }

  const stderrParts: string[] = [];
  for (const target of args.positionals) {
    for (const path of ctx.vfs.expandGlob(ctx.cwd, target)) {
      try {
        ctx.vfs.remove(path, recursive);
      } catch (error) {
        if (force) continue;
        if (error instanceof VfsError) stderrParts.push(`rm: ${error.message}`);
        else throw error;
      }
    }
  }

  return stderrParts.length > 0
    ? { stdout: '', stderr: stderrParts.join('\n'), exitCode: 1 }
    : ok();
}

export function rmdir(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  if (args.positionals.length === 0) return toolError('rmdir', 'missing operand');

  for (const target of args.positionals) {
    const path = ctx.vfs.resolvePath(ctx.cwd, target);
    try {
      ctx.vfs.removeDir(path);
    } catch (error) {
      return vfsError('rmdir', error);
    }
  }
  return ok();
}

export function cp(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const recursive = args.flags.has('r') || args.flags.has('R') || args.flags.has('a');

  if (args.positionals.length < 2) {
    return toolError('cp', args.positionals.length === 0 ? 'missing file operand' : `missing destination file operand after '${args.positionals[0]}'`);
  }

  const destination = args.positionals[args.positionals.length - 1]!;
  const sources = args.positionals.slice(0, -1);
  const destinationPath = ctx.vfs.resolvePath(ctx.cwd, destination);

  if (sources.length > 1 && !ctx.vfs.isDir(destinationPath)) {
    return toolError('cp', `target '${destination}' is not a directory`);
  }

  for (const source of sources) {
    for (const path of ctx.vfs.expandGlob(ctx.cwd, source)) {
      try {
        ctx.vfs.copy(path, destinationPath, recursive);
      } catch (error) {
        return vfsError('cp', error);
      }
    }
  }
  return ok();
}

export function mv(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  if (args.positionals.length < 2) {
    return toolError('mv', args.positionals.length === 0 ? 'missing file operand' : `missing destination file operand after '${args.positionals[0]}'`);
  }

  const destination = args.positionals[args.positionals.length - 1]!;
  const sources = args.positionals.slice(0, -1);
  const destinationPath = ctx.vfs.resolvePath(ctx.cwd, destination);

  if (sources.length > 1 && !ctx.vfs.isDir(destinationPath)) {
    return toolError('mv', `target '${destination}' is not a directory`);
  }

  for (const source of sources) {
    for (const path of ctx.vfs.expandGlob(ctx.cwd, source)) {
      try {
        ctx.vfs.move(path, destinationPath);
      } catch (error) {
        return vfsError('mv', error);
      }
    }
  }
  return ok();
}

export function chmod(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  if (args.positionals.length < 2) return toolError('chmod', 'missing operand');

  const [modeText, ...targets] = args.positionals as [string, ...string[]];
  if (!/^[0-7]{3,4}$/.test(modeText)) {
    // Symbolic modes (u+x) are not supported; saying so beats guessing wrong.
    return toolError('chmod', `invalid mode: '${modeText}' (this simulator accepts octal modes such as 644)`);
  }
  const mode = parseInt(modeText, 8);

  for (const target of targets) {
    for (const path of ctx.vfs.expandGlob(ctx.cwd, target)) {
      try {
        ctx.vfs.chmod(path, mode);
      } catch (error) {
        return vfsError('chmod', error);
      }
    }
  }
  return ok();
}

// --- inspection --------------------------------------------------------------

export function du(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const summarise = args.flags.has('s');
  const human = args.flags.has('h');
  const targets = args.positionals.length > 0 ? args.positionals : ['.'];

  const lines: string[] = [];
  for (const target of targets) {
    const path = ctx.vfs.resolvePath(ctx.cwd, target);
    let entries;
    try {
      entries = ctx.vfs.walk(path);
    } catch (error) {
      return vfsError('du', error);
    }

    const total = entries.reduce((sum, entry) => sum + ctx.vfs.sizeOf(entry.node), 0);
    const render = (bytes: number) => (human ? humanSize(bytes) : String(Math.ceil(bytes / 1024)));

    if (summarise) {
      lines.push(`${render(total)}\t${target}`);
      continue;
    }
    // Without -s, du reports every subdirectory, deepest first.
    const dirs = entries.filter((entry) => entry.node.kind === 'dir').reverse();
    for (const dir of dirs) {
      const subtotal = ctx.vfs.walk(dir.path).reduce((sum, entry) => sum + ctx.vfs.sizeOf(entry.node), 0);
      lines.push(`${render(subtotal)}\t${dir.path}`);
    }
  }
  return ok(fromLines(lines));
}

export function find(argv: string[], ctx: ExecContext): CommandResult {
  const args = argv.slice(1);

  // find's grammar is positional: paths first, then predicates.
  const paths: string[] = [];
  let index = 0;
  while (index < args.length && !args[index]!.startsWith('-')) {
    paths.push(args[index]!);
    index += 1;
  }
  if (paths.length === 0) paths.push('.');

  interface Predicates {
    name?: string;
    iname?: string;
    type?: 'f' | 'd';
    mtimeDays?: number;
    permExact?: number;
    permAtLeast?: number;
    owner?: string;
    sizeGreaterKb?: number;
  }
  const predicates: Predicates = {};
  let unsupported: string | null = null;

  for (; index < args.length; index += 1) {
    const flag = args[index]!;
    const value = args[index + 1];
    switch (flag) {
      case '-name':
        predicates.name = value;
        index += 1;
        break;
      case '-iname':
        predicates.iname = value?.toLowerCase();
        index += 1;
        break;
      case '-type':
        predicates.type = value === 'd' ? 'd' : 'f';
        index += 1;
        break;
      case '-mtime':
        predicates.mtimeDays = Number(value);
        index += 1;
        break;
      case '-owner':
        predicates.owner = value;
        index += 1;
        break;
      case '-perm': {
        if (value === undefined) break;
        if (value.startsWith('-')) predicates.permAtLeast = parseInt(value.slice(1), 8);
        else if (value.startsWith('/')) predicates.permAtLeast = parseInt(value.slice(1), 8);
        else predicates.permExact = parseInt(value, 8);
        index += 1;
        break;
      }
      case '-size': {
        if (value?.startsWith('+') && value.endsWith('k')) {
          predicates.sizeGreaterKb = Number(value.slice(1, -1));
        }
        index += 1;
        break;
      }
      case '-exec':
        // Everything after -exec is a command to run per match. Supporting it
        // properly means re-entering the whole engine; saying so is more honest
        // than silently ignoring the flag and printing a wrong answer.
        unsupported = '-exec';
        index = args.length;
        break;
      default:
        if (flag.startsWith('-')) unsupported = flag;
        break;
    }
  }

  if (unsupported) {
    return toolError(
      'find',
      `${unsupported} is not supported in this simulator. Try piping instead, e.g. find /home -type f | head`,
    );
  }

  const matches: string[] = [];
  for (const target of paths) {
    const root = ctx.vfs.resolvePath(ctx.cwd, target);
    let entries;
    try {
      entries = ctx.vfs.walk(root);
    } catch (error) {
      return vfsError('find', error);
    }

    for (const entry of entries) {
      const node: VNode = entry.node;
      if (predicates.type === 'f' && node.kind !== 'file') continue;
      if (predicates.type === 'd' && node.kind !== 'dir') continue;
      if (predicates.name !== undefined && !matchesName(predicates.name, entry.name)) continue;
      if (predicates.iname !== undefined && !matchesName(predicates.iname, entry.name.toLowerCase())) continue;
      if (predicates.owner !== undefined && node.owner !== predicates.owner) continue;
      if (predicates.permExact !== undefined && (node.mode & 0o7777) !== predicates.permExact) continue;
      if (predicates.permAtLeast !== undefined && (node.mode & predicates.permAtLeast) !== predicates.permAtLeast) continue;
      if (predicates.sizeGreaterKb !== undefined && ctx.vfs.sizeOf(node) / 1024 <= predicates.sizeGreaterKb) continue;
      if (predicates.mtimeDays !== undefined) {
        const age = ageInDays(node.mtime);
        // find's -mtime is inclusive-of-zero for negative arguments: -1 means
        // "less than 1 day old", +1 means "more than 1 day old".
        if (predicates.mtimeDays < 0 && age >= Math.abs(predicates.mtimeDays)) continue;
        if (predicates.mtimeDays > 0 && age <= predicates.mtimeDays) continue;
        if (predicates.mtimeDays === 0 && age !== 0) continue;
      }
      // The path is printed relative to how the student wrote it.
      matches.push(entry.path === root ? target : target.replace(/\/$/, '') + entry.path.slice(root.length));
    }
  }

  return ok(fromLines(matches));
}

/** find's -name uses shell globs, but only against the basename. */
function matchesName(pattern: string, name: string): boolean {
  const regex = new RegExp(
    '^' +
      pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.') +
      '$',
  );
  return regex.test(name);
}

export function stat(argv: string[], ctx: ExecContext): CommandResult {
  const { positionals } = parseArgs(argv);
  if (positionals.length === 0) return toolError('stat', 'missing operand');

  const lines: string[] = [];
  for (const target of positionals) {
    const path = ctx.vfs.resolvePath(ctx.cwd, target);
    const node = ctx.vfs.stat(path);
    if (!node) return toolError('stat', `cannot statx '${target}': No such file or directory`);

    const size = ctx.vfs.sizeOf(node);
    lines.push(
      `  File: ${path}`,
      `  Size: ${size}\tBlocks: ${Math.ceil(size / 512)}\t${node.kind === 'dir' ? 'directory' : 'regular file'}`,
      `Access: (${(node.mode & 0o7777).toString(8).padStart(4, '0')}/${formatMode(node)})  Uid: ( ${node.owner} )   Gid: ( ${node.group} )`,
      `Modify: ${formatLsTime(node.mtime)}`,
    );
  }
  return ok(fromLines(lines));
}

export function df(argv: string[], ctx: ExecContext): CommandResult {
  const human = parseArgs(argv).flags.has('h');
  const rows = human
    ? [
        'Filesystem      Size  Used Avail Use% Mounted on',
        '/dev/nvme0n1p2   78G   48G   27G  65% /',
        'tmpfs           3.9G     0  3.9G   0% /dev/shm',
        '/dev/nvme0n1p3   19G   17G  2.5G  87% /var',
      ]
    : [
        'Filesystem     1K-blocks     Used Available Use% Mounted on',
        '/dev/nvme0n1p2  81862512 50331648 27918336  65% /',
        'tmpfs            4019692        0  4019692   0% /dev/shm',
        '/dev/nvme0n1p3  19923452 17301504  2621948  87% /var',
      ];
  void ctx;
  return ok(fromLines(rows));
}
