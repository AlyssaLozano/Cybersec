/**
 * Contracts for the simulated terminal.
 *
 * The engine runs entirely on the server. The client never holds filesystem
 * state, because a student who can edit that state can pass any exercise.
 */

export interface RunCommandRequest {
  /** Raw text the student typed. */
  input: string;
}

export interface RunCommandResponse {
  /** The command as echoed back, for the scrollback. */
  input: string;
  /** Combined stdout/stderr, already formatted for display. */
  output: string;
  /** Conventional POSIX exit code: 0 success, non-zero failure. */
  exitCode: number;
  /** Working directory *after* the command ran, for the prompt line. */
  cwd: string;
  /** Present only when the command triggered exercise evaluation. */
  evaluation?: Evaluation;
}

export interface FailedCheck {
  /** Which check failed, for analytics on where students get stuck. */
  type: string;
  hint: string;
}

export interface Evaluation {
  passed: boolean;
  /** One-line summary shown prominently under the terminal. */
  summary: string;
  /** Every check that failed, so the student sees all issues at once. */
  failed: FailedCheck[];
  /** Attempt number this evaluation represents. */
  attempt: number;
}

/** A terminal session is scoped to one student working one exercise. */
export interface TerminalSessionState {
  exerciseId: string;
  cwd: string;
  /** Everything printed so far, oldest first. */
  scrollback: ScrollbackEntry[];
}

export interface ScrollbackEntry {
  kind: 'command' | 'output' | 'system';
  text: string;
  /** Working directory shown in the prompt for `command` entries. */
  cwd?: string;
  exitCode?: number;
}
