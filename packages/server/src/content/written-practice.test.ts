/**
 * Every written drill, graded by the real evaluator.
 *
 * WHY THIS TEST IS THE WHOLE POINT
 *
 * A terminal drill that is wrong fails loudly: the command errors, or the count
 * comes back different. A written drill fails silently. `answer-mentions` is a
 * substring match against synonym groups, so a drill whose model answer happens
 * not to contain any synonym from one of its own groups is unpassable, and
 * nothing about reading the file would tell you. The student meets it instead,
 * writes a correct answer, is marked wrong, and has no way to find out why.
 *
 * So every drill's own stated solution is submitted as though a student wrote
 * it, through the same `evaluate` the submission route uses. If the model answer
 * cannot pass, the drill does not ship.
 *
 * The second test is the mirror: an empty answer must FAIL every drill. A group
 * list that an empty string satisfies is a check that grades nothing, which is
 * the other way a written drill can be quietly worthless.
 */

import { describe, expect, it } from 'vitest';

import type { Exercise, PracticeItem } from '@soc/shared';

import { PACKAGES, practiceAnswerFormatFor, practiceKindOf } from './index.js';
import { evaluate } from './validate.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';

/** Every drill hanging off a written exercise, with its parent. */
const WRITTEN_DRILLS: Array<{ exercise: Exercise; drill: PracticeItem }> = PACKAGES.flatMap((pkg) =>
  pkg.modules.flatMap((module) =>
    module.exercises
      .filter((exercise) => exercise.kind === 'short-answer')
      .flatMap((exercise) => exercise.practice.map((drill) => ({ exercise, drill }))),
  ),
);

/** Submit `answerText` against a drill's own checks, exactly as the route does. */
function grade(exercise: Exercise, drill: PracticeItem, answerText: string) {
  const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), '/home/student');
  return evaluate(
    { ...exercise, checks: drill.checks },
    { input: answerText, output: '', exitCode: 0, cwd: '/home/student', vfs, answerText },
    1,
  );
}

describe('written practice drills', () => {
  it('there are some, so this file is not silently passing on an empty set', () => {
    expect(WRITTEN_DRILLS.length).toBeGreaterThan(0);
  });

  describe('every model answer passes its own checks', () => {
    for (const { exercise, drill } of WRITTEN_DRILLS) {
      it(`${drill.id}`, () => {
        const evaluation = grade(exercise, drill, drill.solution);
        expect(
          evaluation.failed.map((failure) => failure.hint),
          `${drill.id} cannot be passed by its own stated answer:\n${drill.solution}`,
        ).toEqual([]);
      });
    }
  });

  describe('an empty answer fails, so the checks actually grade something', () => {
    for (const { exercise, drill } of WRITTEN_DRILLS) {
      it(`${drill.id}`, () => {
        expect(grade(exercise, drill, '').passed, `${drill.id} passes on an empty answer`).toBe(
          false,
        );
      });
    }
  });

  describe('each drill teaches and is distinct from its parent', () => {
    for (const { exercise, drill } of WRITTEN_DRILLS) {
      it(`${drill.id}`, () => {
        expect(drill.teach?.note, `${drill.id} has no teaching note`).toBeTruthy();
        expect(drill.teach!.note.length, `${drill.id} has a stub note`).toBeGreaterThan(60);
        // A drill that restates its parent is a reworded question, not practice.
        expect(drill.prompt.trim(), `${drill.id} repeats its parent prompt`).not.toBe(
          exercise.prompt.trim(),
        );
        expect(drill.solution.trim(), `${drill.id} repeats its parent answer`).not.toBe(
          exercise.solution.trim(),
        );
      });
    }
  });

  describe('a drill is answerable in the interface, not only by the grader', () => {
    /*
     * The bug this catches, found the hard way: the client rendered the PARENT
     * exercise's answer surface for every drill. On a multiple-choice parent
     * that is a set of checkboxes, so a drill graded with `answer-mentions`
     * received option ids and never any text, and could not be passed by anybody
     * however correct their reasoning.
     *
     * Every test in this file still went green, because a test can hand the
     * grader an answer the interface gives a student no way to type. That is the
     * gap between "the content is right" and "the product works", and it is why
     * this asserts on the surface rather than on the checks.
     */
    for (const { exercise, drill } of WRITTEN_DRILLS) {
      it(`${drill.id} is offered a text box`, () => {
        expect(practiceKindOf(drill, exercise)).toBe('short-answer');
      });
    }

    it('every free-text drill in the catalogue gets one, not just this package', () => {
      const freeText = PACKAGES.flatMap((pkg) =>
        pkg.modules.flatMap((module) =>
          module.exercises.flatMap((exercise) =>
            exercise.practice
              .filter((drill) => drill.checks.some((check) => check.type === 'answer-mentions'))
              .map((drill) => ({ exercise, drill })),
          ),
        ),
      );

      expect(freeText.length).toBeGreaterThan(0);
      for (const { exercise, drill } of freeText) {
        expect(practiceKindOf(drill, exercise), drill.id).toBe('short-answer');
        // And it must be told how long an answer to write, or the box has no
        // guidance on it and the student guesses.
        expect(practiceAnswerFormatFor(drill, exercise), drill.id).toBeDefined();
      }
    });
  });

  describe('drill ids are unique and namespaced under their parent', () => {
    it('no duplicates anywhere in the catalogue', () => {
      const ids = WRITTEN_DRILLS.map(({ drill }) => drill.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    for (const { exercise, drill } of WRITTEN_DRILLS) {
      it(`${drill.id} belongs to ${exercise.id}`, () => {
        expect(drill.id.startsWith(`${exercise.id}-`)).toBe(true);
      });
    }
  });
});
