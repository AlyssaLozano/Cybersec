/**
 * The environment a single command runs inside.
 *
 * Commands are pure with respect to everything except the context: they read
 * from it, write to it, and return their output rather than printing. That makes
 * the whole engine testable without a terminal, a socket, or a database.
 */

import type { MachineState, VNode } from '../vfs/types.js';
import type { Vfs } from '../vfs/vfs.js';

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export function ok(stdout = ''): CommandResult {
  return { stdout, stderr: '', exitCode: 0 };
}

export function fail(stderr: string, exitCode = 1): CommandResult {
  return { stdout: '', stderr, exitCode };
}

/** Formats an error the way a real tool does: `ls: cannot access 'x': ...`. */
export function toolError(tool: string, message: string, exitCode = 1): CommandResult {
  return fail(`${tool}: ${message}`, exitCode);
}

export interface ExecContext {
  vfs: Vfs;
  machine: MachineState;
  /** Current working directory. Mutated only by `cd`. */
  cwd: string;
  /** The account the student is acting as. Always 'student' in Phase 1. */
  user: string;
  /** Groups the user belongs to, used for permission checks. */
  groups: string[];
  /** Output piped in from the previous stage, empty for the first stage. */
  stdin: string;
  /** Set by `cd`; the shell reads it back after the pipeline finishes. */
  setCwd(path: string): void;
}

/**
 * Whether the current user may read a node.
 *
 * Permissions are enforced for reads specifically because "Permission denied" is
 * a lesson, not an obstacle: /etc/shadow exists, is visible in a listing, and
 * cannot be read, which is exactly the behaviour a new analyst needs to
 * internalise. Write permission is not enforced -- the student owns their home
 * directory and never has cause to write anywhere else.
 */
export function canRead(node: VNode, ctx: ExecContext): boolean {
  if (ctx.user === 'root') return true;
  if (node.owner === ctx.user) return (node.mode & 0o400) !== 0;
  if (ctx.groups.includes(node.group)) return (node.mode & 0o040) !== 0;
  return (node.mode & 0o004) !== 0;
}

/** Read a file, mapping missing-file and permission problems to tool errors. */
export function readOrError(
  path: string,
  ctx: ExecContext,
  tool: string,
): { text: string } | { error: CommandResult } {
  const node = ctx.vfs.stat(path);
  if (!node) {
    return { error: toolError(tool, `${path}: No such file or directory`) };
  }
  if (node.kind === 'dir') {
    return { error: toolError(tool, `${path}: Is a directory`) };
  }
  if (!canRead(node, ctx)) {
    return { error: toolError(tool, `${path}: Permission denied`) };
  }
  return { text: node.content ?? '' };
}

/**
 * Render a mode as an `ls -l` permission string, e.g. `-rw-r--r--`.
 *
 * Setuid and setgid replace the corresponding execute bit with `s` (or `S` when
 * the execute bit is not set), which is precisely the visual cue the SUID-hunting
 * exercise trains students to spot.
 */
export function formatMode(node: VNode): string {
  const mode = node.mode;
  const type = node.kind === 'dir' ? 'd' : '-';

  const rwx = (read: number, write: number, execute: number) =>
    (mode & read ? 'r' : '-') + (mode & write ? 'w' : '-') + (mode & execute ? 'x' : '-');

  let user = rwx(0o400, 0o200, 0o100);
  let group = rwx(0o040, 0o020, 0o010);
  let other = rwx(0o004, 0o002, 0o001);

  if (mode & 0o4000) user = user.slice(0, 2) + (mode & 0o100 ? 's' : 'S');
  if (mode & 0o2000) group = group.slice(0, 2) + (mode & 0o010 ? 's' : 'S');
  if (mode & 0o1000) other = other.slice(0, 2) + (mode & 0o001 ? 't' : 'T');

  return type + user + group + other;
}

/** Human-readable size for `ls -lh` and `du -h`: 1024 -> "1.0K". */
export function humanSize(bytes: number): string {
  if (bytes < 1024) return String(bytes);
  const units = ['K', 'M', 'G', 'T'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return (value < 10 ? value.toFixed(1) : String(Math.round(value))) + units[unit];
}

/** Split text into lines, dropping the single trailing newline files end with. */
export function toLines(text: string): string[] {
  if (text === '') return [];
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/** Join lines back into text with a trailing newline, or '' when empty. */
export function fromLines(lines: string[]): string {
  return lines.length === 0 ? '' : lines.join('\n') + '\n';
}
