/**
 * The shell: turns a line of student input into output.
 *
 * Runs a parsed pipeline stage by stage, threading each stage's stdout into the
 * next stage's stdin, then applies any redirection. Everything happens against
 * the student's Vfs and the frozen MachineState -- there is no path from here to
 * the host operating system.
 */

import { Vfs } from '../vfs/vfs.js';
import type { MachineState } from '../vfs/types.js';
import { COMMANDS } from './commands/index.js';
import type { CommandResult, ExecContext } from './context.js';
import { ParseError, parse } from './parser.js';

export interface ShellResult {
  /** Combined stdout and stderr, in the order a terminal would show them. */
  output: string;
  exitCode: number;
  /** Working directory after the line ran; `cd` is the only thing that moves it. */
  cwd: string;
  /** True when the line changed the filesystem, so the caller knows to persist. */
  mutated: boolean;
}

export interface ShellOptions {
  vfs: Vfs;
  machine: MachineState;
  cwd: string;
  user?: string;
  groups?: string[];
}

/** Commands that write to the filesystem, so the overlay needs saving. */
const MUTATING = new Set(['touch', 'mkdir', 'rm', 'rmdir', 'cp', 'mv', 'chmod']);

/**
 * Work out which groups a user belongs to by reading /etc/group.
 *
 * Deriving this rather than hardcoding it means `id`, `ls -l`, and permission
 * checks can never disagree with the file the student can read for themselves.
 *
 * It also carries a real lesson. /var/log/auth.log is root:adm 0640 on a genuine
 * Ubuntu box, so an ordinary account cannot read it. The student account is in
 * `adm` -- which is exactly how a SOC analyst is granted log access in practice,
 * instead of handing out root.
 */
function groupsFor(vfs: Vfs, user: string): string[] {
  const groups = [user];
  const etcGroup = vfs.stat('/etc/group')?.content ?? '';

  for (const line of etcGroup.split('\n')) {
    const [name, , , members] = line.split(':');
    if (!name || !members) continue;
    if (members.split(',').includes(user)) groups.push(name);
  }
  return groups;
}

export function runLine(input: string, options: ShellOptions): ShellResult {
  const { vfs, machine } = options;
  let cwd = options.cwd;
  const user = options.user ?? 'student';
  const groups = options.groups ?? groupsFor(vfs, user);

  let pipeline;
  try {
    pipeline = parse(input);
  } catch (error) {
    if (error instanceof ParseError) {
      return { output: `bash: ${error.message}\n`, exitCode: 2, cwd, mutated: false };
    }
    throw error;
  }

  // Blank lines and comments are a no-op, exactly as in a real shell.
  if (!pipeline) return { output: '', exitCode: 0, cwd, mutated: false };

  const ctx: ExecContext = {
    vfs,
    machine,
    cwd,
    user,
    groups,
    stdin: '',
    setCwd(path: string) {
      cwd = path;
      ctx.cwd = path;
    },
  };

  let mutated = false;
  let carried = '';
  let last: CommandResult = { stdout: '', stderr: '', exitCode: 0 };
  const stderrParts: string[] = [];

  for (const stage of pipeline.stages) {
    const name = stage.argv[0];
    if (name === undefined) continue;

    const spec = COMMANDS[name];
    if (!spec) {
      // Deliberately the exact bash wording, including the trailing period.
      return {
        output: `${name}: command not found\n`,
        exitCode: 127,
        cwd,
        mutated,
      };
    }

    ctx.stdin = carried;
    last = spec.handler(stage.argv, ctx);
    carried = last.stdout;

    if (MUTATING.has(name) && last.exitCode === 0) mutated = true;
    // stderr is not piped: it goes straight to the terminal, as it does in bash.
    if (last.stderr) stderrParts.push(last.stderr.replace(/\n$/, ''));
  }

  // Redirection consumes the final stdout instead of displaying it.
  if (pipeline.redirect) {
    const path = vfs.resolvePath(cwd, pipeline.redirect.path);
    try {
      const existing = pipeline.redirect.append ? (vfs.stat(path)?.content ?? '') : '';
      vfs.writeFile(path, existing + carried);
      mutated = true;
      carried = '';
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { output: `bash: ${pipeline.redirect.path}: ${message}\n`, exitCode: 1, cwd, mutated };
    }
  }

  const stderr = stderrParts.length > 0 ? stderrParts.join('\n') + '\n' : '';
  return {
    output: carried + stderr,
    exitCode: last.exitCode,
    cwd,
    mutated,
  };
}

/**
 * Run several lines in sequence against one context.
 *
 * Used for exercise setup steps, which need to leave the session in a known
 * state (`cd /var/log`) before the student sees the prompt.
 */
export function runLines(lines: string[], options: ShellOptions): ShellResult {
  let cwd = options.cwd;
  let output = '';
  let exitCode = 0;
  let mutated = false;

  for (const line of lines) {
    const result = runLine(line, { ...options, cwd });
    cwd = result.cwd;
    output += result.output;
    exitCode = result.exitCode;
    mutated = mutated || result.mutated;
  }

  return { output, exitCode, cwd, mutated };
}
