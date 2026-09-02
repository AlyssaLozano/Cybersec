/**
 * Golden tests for the Risk Management and AI Governance package.
 *
 * WHY THIS FILE EXISTS
 *
 * `catalogue.test.ts` runs every TERMINAL exercise's stated solution through the
 * real shell and asserts its own checks pass, because an exercise whose worked
 * answer fails its own grader is a trap. This package contains no terminal
 * exercises: all 48 are multiple-choice or short-answer judgements, so none of
 * them is covered there.
 *
 * The same guarantee is therefore built here, following the pattern established
 * by `ai-security-pathway.test.ts`. Every multiple-choice exercise is checked to
 * be answerable and non-trivial, and every short-answer exercise is graded by the
 * real grader against its own worked answer and against the prompt pasted back.
 * The second of those is the one that catches a rubric measuring vocabulary
 * rather than reasoning, which is easy to write and invisible on review.
 */

import { describe, expect, it } from 'vitest';

import type { Exercise } from '@soc/shared';

import { RISK_GOVERNANCE } from './risk-governance.js';
import { PACKAGES } from './index.js';
import { evaluate } from './validate.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';

const HOME = '/home/student';

const EXERCISES = RISK_GOVERNANCE.modules.flatMap((module) => module.exercises);

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

describe('the risk package is registered and sized as claimed', () => {
  it('ships in the catalogue', () => {
    expect(PACKAGES.map((pkg) => pkg.id)).toContain('risk-governance');
  });

  it('has 48 exercises across 12 modules', () => {
    expect(RISK_GOVERNANCE.modules).toHaveLength(12);
    expect(EXERCISES).toHaveLength(48);
  });

  it('uses name-prefixed ids, so a future package cannot collide with these', () => {
    for (const exercise of EXERCISES) {
      expect(exercise.id).toMatch(/^rmg\.\d+\.\d+$/);
    }
    for (const module of RISK_GOVERNANCE.modules) {
      expect(module.id).toMatch(/^rmg\.\d+$/);
    }
  });

  it('numbers each module\'s exercises from one, in order', () => {
    for (const module of RISK_GOVERNANCE.modules) {
      expect(module.exercises.map((exercise) => exercise.order)).toEqual(
        module.exercises.map((_, index) => index + 1),
      );
      // An exercise whose moduleId does not match its parent would appear in the
      // wrong place in the client's navigation while still grading correctly,
      // which is the kind of drift only a test catches.
      for (const exercise of module.exercises) {
        expect(exercise.moduleId).toBe(module.id);
        expect(exercise.packageId).toBe('risk-governance');
      }
    }
  });

  it('grades judgement only, so nothing here needs the terminal or the lab', () => {
    for (const exercise of EXERCISES) {
      expect(['multiple-choice', 'short-answer']).toContain(exercise.kind);
    }
  });

  it('names SOC Foundations as its prerequisite, and names a package that exists', () => {
    expect(RISK_GOVERNANCE.prerequisites).toEqual(['soc-foundations']);
    const ids = new Set(PACKAGES.map((pkg) => pkg.id));
    for (const id of RISK_GOVERNANCE.prerequisites) expect(ids.has(id)).toBe(true);
  });

  it('teaches both halves in every module, never AI in an appendix', () => {
    // The specification is explicit that AI is a business risk rather than a
    // separate discipline, and the whole structure depends on it: a module that
    // never mentions an AI system would be the start of the split register this
    // package exists to argue against.
    for (const module of RISK_GOVERNANCE.modules) {
      const prose = module.exercises
        .map((exercise) => `${exercise.title} ${exercise.prompt} ${exercise.teach.concept}`)
        .join(' ')
        .toLowerCase();
      expect(/\bmodel\b|\bai\b/.test(prose), `${module.id} never mentions an AI system`).toBe(true);
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

  it('the package contains written work in every module', () => {
    // Risk work is writing. A student who passed 48 exercises by clicking would
    // have practised none of the skill this package claims to teach.
    expect(written.length).toBeGreaterThanOrEqual(12);
    for (const module of RISK_GOVERNANCE.modules) {
      expect(
        module.exercises.some((exercise) => exercise.kind === 'short-answer'),
        `${module.id} has no written exercise`,
      ).toBe(true);
    }
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
