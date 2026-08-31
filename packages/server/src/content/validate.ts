/**
 * Exercise grading.
 *
 * Two principles shape this:
 *
 * 1. Grade the OUTCOME where possible, not the keystrokes. A student who reaches
 *    the right answer a different way has not made a mistake, and marking them
 *    wrong teaches them to guess at the answer key instead of at the system.
 *    Command-shape checks exist only where the exercise is explicitly about
 *    learning a specific flag.
 *
 * 2. Report EVERY failed check at once, each with its own hint. Revealing one
 *    problem at a time turns learning into a guessing game.
 */

import type { Check, Evaluation, Exercise, FailedCheck } from '@soc/shared';

import { normalizeCommand } from '../terminal/parser.js';
import type { Vfs } from '../vfs/vfs.js';

export interface Attempt {
  /** Raw text the student submitted. */
  input: string;
  /** Combined output the terminal displayed. */
  output: string;
  exitCode: number;
  /** Working directory after the command ran. */
  cwd: string;
  /** The student's filesystem, for state-based checks. */
  vfs: Vfs;
  /** Selected option ids, for multiple-choice exercises. */
  selectedOptionIds?: string[];
  /** Free text, for short-answer exercises. */
  answerText?: string;
}

/** Non-empty output lines, which is what line-count checks care about. */
function outputLines(output: string): string[] {
  return output.split('\n').filter((line) => line.trim() !== '');
}

function contains(haystack: string, needle: string, caseSensitive: boolean): boolean {
  return caseSensitive
    ? haystack.includes(needle)
    : haystack.toLowerCase().includes(needle.toLowerCase());
}

/**
 * Whether a command line uses a given short flag.
 *
 * Flags may be grouped, so `-la` satisfies a requirement for `-l`. Only the
 * dash-prefixed tokens are examined, so a file named "n.log" never counts as
 * `-n`.
 */
function usesFlag(input: string, command: string, flag: string): boolean {
  const stages = input.split('|').map((stage) => stage.trim());
  for (const stage of stages) {
    const tokens = stage.split(/\s+/);
    if (tokens[0] !== command) continue;
    for (const token of tokens.slice(1)) {
      if (!token.startsWith('-') || token.startsWith('--')) continue;
      if (token.slice(1).includes(flag)) return true;
    }
  }
  return false;
}

/** Run one check. Returns null when it passes, or the failure to report. */
function runCheck(check: Check, attempt: Attempt): FailedCheck | null {
  const failed = (): FailedCheck => ({ type: check.type, hint: check.hint });

  switch (check.type) {
    case 'command-matches': {
      const actual = normalizeCommand(attempt.input);
      const matched = check.anyOf.some((pattern) =>
        check.regex ? new RegExp(pattern).test(actual) : normalizeCommand(pattern) === actual,
      );
      return matched ? null : failed();
    }

    case 'command-has-flag': {
      const hasAll = check.flags.every((flag) => usesFlag(attempt.input, check.command, flag));
      return hasAll ? null : failed();
    }

    case 'command-uses-pipe':
      return attempt.input.includes('|') ? null : failed();

    case 'output-contains':
      return contains(attempt.output, check.text, check.caseSensitive ?? false) ? null : failed();

    case 'output-excludes':
      return contains(attempt.output, check.text, check.caseSensitive ?? false) ? failed() : null;

    case 'output-matches':
      return new RegExp(check.pattern, check.flags ?? '').test(attempt.output) ? null : failed();

    case 'output-line-count':
      return outputLines(attempt.output).length === check.count ? null : failed();

    case 'output-numeric': {
      // Accept a bare number, or a number sitting alone on the last line, so
      // that `grep -c` and `... | wc -l` are both gradeable.
      const lines = outputLines(attempt.output);
      const candidate = lines.length === 1 ? lines[0]! : (lines[lines.length - 1] ?? '');
      const value = Number(candidate.trim());
      if (!Number.isFinite(value)) return failed();
      if (check.equals !== undefined && value !== check.equals) return failed();
      if (check.min !== undefined && value < check.min) return failed();
      if (check.max !== undefined && value > check.max) return failed();
      return null;
    }

    case 'fs-exists': {
      const node = attempt.vfs.stat(check.path);
      const present = node !== null;
      if (present !== check.exists) return failed();
      if (present && check.kind && node.kind !== check.kind) return failed();
      return null;
    }

    case 'cwd-equals':
      return attempt.cwd === check.path ? null : failed();

    case 'choice-equals': {
      const selected = [...(attempt.selectedOptionIds ?? [])].sort();
      const expected = [...check.optionIds].sort();
      const same =
        selected.length === expected.length && selected.every((id, index) => id === expected[index]);
      return same ? null : failed();
    }

    case 'answer-mentions': {
      const text = (attempt.answerText ?? '').toLowerCase();
      const hitsEveryGroup = check.conceptGroups.every((synonyms) =>
        synonyms.some((word) => text.includes(word.toLowerCase())),
      );
      return hitsEveryGroup ? null : failed();
    }

    default: {
      // Exhaustiveness guard: adding a Check variant without handling it here
      // becomes a compile error rather than a silently passing exercise.
      const unreachable: never = check;
      throw new Error(`Unhandled check type: ${JSON.stringify(unreachable)}`);
    }
  }
}

export function evaluate(exercise: Exercise, attempt: Attempt, attemptNumber: number): Evaluation {
  const failed: FailedCheck[] = [];
  for (const check of exercise.checks) {
    const failure = runCheck(check, attempt);
    if (failure) failed.push(failure);
  }

  if (failed.length === 0) {
    return { passed: true, summary: 'Correct.', failed: [], attempt: attemptNumber };
  }

  // A command the shell rejected outright is nearly always the real problem, so
  // say that rather than listing consequences of it.
  const summary =
    attempt.exitCode === 127
      ? 'That command does not exist on this system. Type "help" to see what is available.'
      : failed.length === 1
        ? 'Not quite yet.'
        : `Not quite yet -- ${failed.length} things to fix.`;

  return { passed: false, summary, failed, attempt: attemptNumber };
}
