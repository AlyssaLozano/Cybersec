/**
 * Golden tests for the content catalogue.
 *
 * Every exercise ships with the answer we claim is correct. This runs each of
 * those answers through the real engine and asserts the exercise's own checks
 * pass. An exercise whose solution does not satisfy its own grader is a trap: the
 * student types the right thing and is told they are wrong.
 *
 * This is the test that would have caught both content bugs inherited from the
 * source specification (the lowercase "started|stopped" search, and the
 * `user=` extraction piped from lines that never contain `user=`).
 */

import { describe, expect, it } from 'vitest';

import { runLine, runLines } from '../terminal/shell.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { MACHINE } from '../vfs/machine.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';
import { ALL_EXERCISES, PACKAGES } from './index.js';
import { evaluate } from './validate.js';
import type { Check, Exercise, PracticeItem } from '@soc/shared';

const HOME = '/home/student';

/**
 * Run a solution in a fresh session, after any setup steps.
 *
 * A solution may be more than one line: some tasks genuinely take two commands
 * ("rmdir refuses, so remove the file first, then retry"). Those are run in
 * sequence against one session, which is exactly how a student would type them.
 */
function attempt(solution: string, setup: string[] | undefined, exercise: Exercise, checks: Check[]) {
  const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
  let cwd = HOME;

  if (setup && setup.length > 0) {
    cwd = runLines(setup, { vfs, machine: MACHINE, cwd }).cwd;
  }

  const steps = solution.split('\n').map((line) => line.trim()).filter(Boolean);
  let result = runLine(steps[0]!, { vfs, machine: MACHINE, cwd });
  cwd = result.cwd;
  for (const step of steps.slice(1)) {
    result = runLine(step, { vfs, machine: MACHINE, cwd });
    cwd = result.cwd;
  }

  // Grade against the supplied checks, which for a drill are the drill's own.
  const graded: Exercise = { ...exercise, checks };
  return evaluate(
    graded,
    { input: solution, output: result.output, exitCode: result.exitCode, cwd: result.cwd, vfs },
    1,
  );
}

const terminalExercises = ALL_EXERCISES.filter((exercise) => exercise.kind === 'terminal');

/*
 * Catalogue assertions are keyed by package, never by position.
 *
 * A positional array -- `expect(ids).toEqual([...])` in package order -- fails the
 * moment anybody adds a package, whether or not they touched the ones already
 * there. That turns every new package into an edit of somebody else's
 * expectations, which is how two people writing two packages end up fighting
 * over one line. Keyed assertions mean adding a package adds a line.
 *
 * The counts below are what each package is expected to contain. Add an entry
 * when adding a package; change one only when deliberately changing that
 * package's size.
 */
const EXPECTED_EXERCISE_COUNTS: Record<string, number> = {
  'linux-fundamentals': 40,
  'log-analysis': 40,
  'incident-triage': 40,
  'incident-response': 40,
  'soc-foundations': 40,
  'ai-foundations': 40,
  'ai-security': 40,
  'ot-security-foundations': 40,
  'identity-foundations': 40,
  networking: 45,
};

function exerciseCount(packageId: string): number {
  const pkg = PACKAGES.find((candidate) => candidate.id === packageId);
  return pkg ? pkg.modules.reduce((sum, module) => sum + module.exercises.length, 0) : -1;
}

describe('catalogue integrity', () => {
  it('gives every package a distinct id', () => {
    const ids = PACKAGES.map((pkg) => pkg.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('names every package', () => {
    // A package with no title is unreachable from the menu, which is a content
    // bug that would otherwise only surface as a blank row in the UI.
    expect(PACKAGES.filter((pkg) => !pkg.title.trim()).map((pkg) => pkg.id)).toEqual([]);
  });

  for (const [packageId, expected] of Object.entries(EXPECTED_EXERCISE_COUNTS)) {
    it(`ships ${expected} exercises in package "${packageId}"`, () => {
      expect(exerciseCount(packageId)).toBe(expected);
    });
  }

  it('declares the log-analysis package as depending on the Linux one', () => {
    expect(PACKAGES.find((pkg) => pkg.id === 'log-analysis')!.prerequisites).toEqual([
      'linux-fundamentals',
    ]);
  });

  it('gives every exercise a unique id', () => {
    const ids = ALL_EXERCISES.map((exercise) => exercise.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every practice drill a unique id', () => {
    const ids = ALL_EXERCISES.flatMap((exercise) => exercise.practice.map((drill) => drill.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('never uses a real routable address in a solution or prompt', () => {
    // Simulated external addresses must stay inside the RFC 5737 documentation
    // ranges, which cannot route anywhere real.
    const allowed = /^(10\.|127\.|192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|0\.0\.0\.0|255\.)/;
    const offenders: string[] = [];

    for (const exercise of ALL_EXERCISES) {
      const text = [exercise.prompt, exercise.solution, exercise.expectedOutput, exercise.debrief ?? '']
        .concat(exercise.practice.map((drill) => `${drill.prompt} ${drill.solution}`))
        .join(' ');
      for (const match of text.matchAll(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g)) {
        // Version strings and regex fragments produce false positives; only
        // flag things that look like addresses and are not documentation ranges.
        if (!allowed.test(match[0]) && !/^[0-9]\.[0-9]/.test(match[0])) {
          offenders.push(`${exercise.id}: ${match[0]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('every exercise solution passes its own checks', () => {
  for (const exercise of terminalExercises) {
    it(`${exercise.id}: ${exercise.title}`, () => {
      const evaluation = attempt(exercise.solution, exercise.setup, exercise, exercise.checks);
      // Surface which check failed rather than just "expected true to be false".
      expect(
        evaluation.failed.map((failure) => `${failure.type}: ${failure.hint}`),
      ).toEqual([]);
      expect(evaluation.passed).toBe(true);
    });
  }
});

describe('every practice drill solution passes its own checks', () => {
  const drills: Array<{ exercise: Exercise; drill: PracticeItem }> = terminalExercises.flatMap(
    (exercise) => exercise.practice.map((drill) => ({ exercise, drill })),
  );

  for (const { exercise, drill } of drills) {
    it(`${drill.id}`, () => {
      const evaluation = attempt(drill.solution, drill.setup, exercise, drill.checks);
      expect(
        evaluation.failed.map((failure) => `${failure.type}: ${failure.hint}`),
      ).toEqual([]);
      expect(evaluation.passed).toBe(true);
    });
  }
});

describe('worked examples in teaching material are valid commands', () => {
  /**
   * Asserts the command NAME is real and the line parses.
   *
   * It deliberately does not require the example's files to exist. Examples for
   * mv and rm use placeholder names like draft.txt on purpose -- demonstrating
   * deletion against a real seeded file would teach a student to delete it.
   * What must never happen is a misspelled command or broken syntax.
   */
  // Scoped to terminal exercises: in a triage or written-judgement exercise the
  // "command" field holds the action being illustrated ("escalate", "Group by
  // user, then by time window"), which is not something a shell can run.
  const examples = terminalExercises.flatMap((exercise) =>
    (exercise.teach.examples ?? []).map((example) => ({ exercise, example })),
  );

  for (const { exercise, example } of examples) {
    it(`${exercise.id}: ${example.command}`, () => {
      const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
      const result = runLine(example.command, { vfs, machine: MACHINE, cwd: HOME });
      expect(result.output).not.toContain('command not found');
      // "bash:" only ever prefixes a parse error from the shell itself.
      expect(result.output).not.toContain('bash:');
    });
  }
});

describe('worked examples are never the exercise answer', () => {
  // Handing a student the answer in the teaching material defeats the exercise.
  // Commands that take no arguments are exempt: `pwd` has exactly one form, so
  // there is no "different target" to demonstrate it against.
  for (const exercise of terminalExercises) {
    const takesArguments = exercise.solution.trim().split(/\s+/).length > 1;
    if (!takesArguments) continue;

    it(`${exercise.id}`, () => {
      const normalise = (text: string) => text.trim().replace(/\s+/g, ' ');
      const answers = (exercise.teach.examples ?? []).map((example) => normalise(example.command));
      expect(answers).not.toContain(normalise(exercise.solution));
    });
  }
});
