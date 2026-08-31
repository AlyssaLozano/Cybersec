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

/**
 * One concept a free-text check looked for, and whether the answer reached it.
 *
 * A text check is an AND over concept groups, and reporting only the aggregate
 * pass/fail told a student "not quite" without saying which of four ideas they
 * missed. That is the difference between a grade and teaching.
 *
 * `accepted` is safe to ship. The synonym list is not an answer key -- it is the
 * vocabulary of the concept, and a student who has been told "say something
 * about volatility" still has to know why volatility decides the order.
 */
export interface ConceptReport {
  /** Words that would have satisfied this concept. */
  accepted: string[];
  /** The one that did, if any. */
  matched: string | null;
  hit: boolean;
}

/**
 * What one check looked for and what it found -- emitted for EVERY check,
 * passing or failing.
 *
 * `Evaluation.failed` only ever carried failures, so a student who passed was
 * told "Correct." and nothing else, and a student who failed learned nothing
 * about the checks they had already satisfied. Both are now reported.
 */
export interface CheckReport {
  type: string;
  /** Plain-language statement of what this check required. */
  looksFor: string;
  passed: boolean;
  /** The check's own hint, on failure. */
  hint?: string;
  /** Present for free-text checks: the per-concept breakdown. */
  concepts?: ConceptReport[];
}

/**
 * Written critique of an answer, produced by a model.
 *
 * DELIBERATELY NOT PART OF THE GRADE. `passed` is decided entirely by the
 * deterministic checks above, and this field is attached afterwards. A model
 * that is slow, unavailable, or unconfigured costs the student commentary and
 * never a pass -- which is what keeps exercise outcomes reproducible and keeps
 * "a pass is permanent" true.
 */
export interface AnswerFeedback {
  /** What the answer genuinely did well. Empty when there is nothing honest to say. */
  strengths: string[];
  /** Specific weaknesses, each actionable. */
  gaps: string[];
  /** What separates a strong answer here from a passing one. */
  wouldStrengthen: string;
  /** Set when the critique could not be produced, so the UI can stay quiet. */
  unavailable?: string;
}

export interface Evaluation {
  passed: boolean;
  /** One-line summary shown prominently under the terminal. */
  summary: string;
  /** Every check that failed, so the student sees all issues at once. */
  failed: FailedCheck[];
  /** Every check, passing or failing, with what it was looking for. */
  reports: CheckReport[];
  /** Attempt number this evaluation represents. */
  attempt: number;
  /** Model critique. Never affects `passed`. */
  feedback?: AnswerFeedback;
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
