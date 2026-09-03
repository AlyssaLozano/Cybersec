/**
 * Golden tests for the AI Security Pathway.
 *
 * WHY THIS FILE EXISTS
 *
 * `catalogue.test.ts` runs every TERMINAL exercise's stated solution through the
 * real shell and asserts its own checks pass, because an exercise whose worked
 * answer fails its own grader is a trap. This package was originally all
 * multiple-choice and short-answer judgement, so none of it was covered by that
 * file; the hands-on exercises added to aisp.3, aisp.10 and aisp.11 now are,
 * and are covered again in more depth by ai-security-pathway-handson.test.ts
 *
 * The same guarantee is therefore built here. Every multiple-choice exercise is
 * checked to be answerable and non-trivial (selecting nothing and selecting
 * everything must both be wrong), and every short-answer exercise is graded by
 * the real grader against its own stated solution. A rubric that would fail a
 * student who wrote exactly the worked answer is the specific bug this catches,
 * and it is easy to introduce: a concept group whose synonyms all happen to be
 * missing from the prose is invisible on review.
 */

import { describe, expect, it } from 'vitest';

import type { Exercise } from '@soc/shared';

import { AI_SECURITY_PATHWAY } from './ai-security-pathway.js';
import { PACKAGES } from './index.js';
import { evaluate } from './validate.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';

const HOME = '/home/student';

const EXERCISES = AI_SECURITY_PATHWAY.modules.flatMap((module) => module.exercises);

/** Grade a written answer through the real grader. */
function gradeAnswer(exercise: Exercise, answerText: string) {
  return evaluate(
    exercise,
    {
      input: 'worked answer',
      output: '',
      exitCode: 0,
      cwd: HOME,
      vfs: new Vfs(BASE_IMAGE, emptyOverlay(), HOME),
      answerText,
    },
    1,
  );
}

describe('the AI Security Pathway is registered and sized as claimed', () => {
  it('ships in the catalogue', () => {
    expect(PACKAGES.map((pkg) => pkg.id)).toContain('ai-security-pathway');
  });

  it('has 60 exercises across 12 modules', () => {
    expect(AI_SECURITY_PATHWAY.modules).toHaveLength(12);
    expect(EXERCISES).toHaveLength(60);
  });

  it('uses name-prefixed ids, so a future package cannot collide with these', () => {
    for (const exercise of EXERCISES) {
      expect(exercise.id).toMatch(/^aisp\.\d+\.\d+$/);
    }
    for (const module of AI_SECURITY_PATHWAY.modules) {
      expect(module.id).toMatch(/^aisp\.\d+$/);
    }
  });

  it('numbers each module\'s exercises from one, in order', () => {
    for (const module of AI_SECURITY_PATHWAY.modules) {
      expect(module.exercises.map((exercise) => exercise.order)).toEqual(
        module.exercises.map((_, index) => index + 1),
      );
      // An exercise whose moduleId does not match its parent would appear in the
      // wrong place in the client's navigation while still grading correctly,
      // which is the kind of drift only a test catches.
      for (const exercise of module.exercises) {
        expect(exercise.moduleId).toBe(module.id);
        expect(exercise.packageId).toBe('ai-security-pathway');
      }
    }
  });

  it('grades judgement and work, not judgement alone', () => {
    // This assertion used to read "grades judgement only, so nothing here needs
    // the terminal or the lab", and it was enforcing a real decision rather than
    // describing an accident.
    //
    // The decision was wrong. A pathway that can describe poisoning, extraction
    // and injection and never let anybody find one is a syllabus, and a student
    // could finish all 52 exercises without once seeing what a poisoned corpus
    // looks like on disk. The terminal exercises added to aisp.3, aisp.10 and
    // aisp.11 run against a training corpus, an inference log and a model
    // registry seeded for exactly that purpose.
    //
    // What the original decision was right about is that most of this package IS
    // judgement, and that is still true and still enforced below: the hands-on
    // work is a minority, and no module is only terminal work.
    for (const exercise of EXERCISES) {
      expect(['multiple-choice', 'short-answer', 'terminal']).toContain(exercise.kind);
    }

    const terminal = EXERCISES.filter((exercise) => exercise.kind === 'terminal');
    expect(terminal.length).toBeGreaterThan(0);
    expect(terminal.length).toBeLessThan(EXERCISES.length / 2);

    for (const module of AI_SECURITY_PATHWAY.modules) {
      const written = module.exercises.filter((exercise) => exercise.kind !== 'terminal');
      expect(written.length, `${module.id} is only hands-on work`).toBeGreaterThan(0);
    }
  });

  it('gives every hands-on exercise the full five drills', () => {
    for (const exercise of EXERCISES.filter((item) => item.kind === 'terminal')) {
      expect(exercise.practice.length, exercise.id).toBe(5);
    }
  });
});

describe('multiple-choice exercises are answerable and not accidentally trivial', () => {
  const choices = EXERCISES.filter((exercise) => exercise.kind === 'multiple-choice');

  for (const exercise of choices) {
    it(`${exercise.id}: ${exercise.title}`, () => {
      const check = exercise.checks.find((item) => item.type === 'choice-equals');
      expect(check, `${exercise.id} has no choice-equals check`).toBeDefined();
      const expected = (check as Extract<typeof check, { type: 'choice-equals' }>).optionIds;

      const options = new Set((exercise.options ?? []).map((option) => option.id));
      // An expected id that is not on the list would fail every student.
      for (const id of expected) expect(options.has(id)).toBe(true);

      // Selecting nothing, and selecting everything, must both be wrong. An
      // exercise where either passes is not measuring a judgement.
      expect(expected.length).toBeGreaterThan(0);
      expect(expected.length).toBeLessThan(options.size);
    });
  }
});

describe('short-answer exercises grade against their own worked answer', () => {
  const written = EXERCISES.filter((exercise) => exercise.kind === 'short-answer');

  it('the package contains short-answer work at all', () => {
    // A pathway of pure multiple choice would let a student pass 52 exercises
    // without writing a sentence, which is not the skill being taught.
    expect(written.length).toBeGreaterThanOrEqual(12);
  });

  for (const exercise of written) {
    it(`${exercise.id}: ${exercise.title}`, () => {
      const evaluation = gradeAnswer(exercise, exercise.solution);
      expect(evaluation.failed.map((failure) => `${failure.type}: ${failure.hint}`)).toEqual([]);
      expect(evaluation.passed).toBe(true);
    });
  }
});

describe('short-answer exercises cannot be passed by restating the prompt', () => {
  /*
   * The failure mode this catches: concept groups so broad that the question
   * itself satisfies them. A student who pastes the prompt back has demonstrated
   * nothing, and a rubric that accepts it is measuring vocabulary rather than
   * reasoning.
   */
  const written = EXERCISES.filter((exercise) => exercise.kind === 'short-answer');

  for (const exercise of written) {
    it(`${exercise.id}`, () => {
      const evaluation = gradeAnswer(exercise, exercise.prompt);
      expect(evaluation.passed).toBe(false);
    });
  }
});

describe('house style', () => {
  const prose = (exercise: Exercise) =>
    [
      exercise.title,
      exercise.goal,
      exercise.prompt,
      exercise.teach.concept,
      exercise.solution,
      exercise.expectedOutput,
      exercise.debrief ?? '',
      ...exercise.hints,
      ...(exercise.options ?? []).map((option) => option.label),
      ...exercise.checks.map((check) => ('hint' in check ? check.hint : '')),
    ].join(' ');

  it('uses no em dashes or smart quotes', () => {
    // Both arrive by paste from a specification and both break the answer keys
    // that match on literal substrings, so they are caught here rather than by a
    // student whose correct answer is marked wrong.
    const offenders = EXERCISES.filter((exercise) => /[–—‘’“”]/.test(prose(exercise)));
    expect(offenders.map((exercise) => exercise.id)).toEqual([]);
  });

  it('gives every exercise teaching material, hints, and a debrief', () => {
    for (const exercise of EXERCISES) {
      expect(exercise.teach.concept.length).toBeGreaterThan(200);
      expect(exercise.hints.length).toBeGreaterThanOrEqual(2);
      expect(exercise.debrief ?? '').not.toBe('');
    }
  });
});
