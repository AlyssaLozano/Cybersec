/**
 * Golden tests for Human Risk Foundations.
 *
 * WHY THIS FILE EXISTS
 *
 * This package has no terminal exercises, so `catalogue.test.ts` covers none of
 * it: that file runs TERMINAL solutions through the real shell and skips
 * everything else. Until now nothing checked any of the multiple-choice keys or
 * any short-answer rubric here.
 *
 * Same guarantee as the other judgement packages. Multiple choice has to be
 * answerable and non-trivial, every short answer is graded by the real grader
 * against its own worked answer, and every short answer is graded again with the
 * PROMPT pasted back, which must fail. That last one catches a rubric so broad
 * the question satisfies it, and it is the single easiest mistake to make when
 * the prompt already contains the vocabulary.
 */

import { describe, expect, it } from 'vitest';

import type { Exercise } from '@soc/shared';

import { HUMAN_RISK_FOUNDATIONS } from './human-risk-foundations.js';
import { PACKAGES } from './index.js';
import { evaluate } from './validate.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';

const HOME = '/home/student';

const EXERCISES = HUMAN_RISK_FOUNDATIONS.modules.flatMap((module) => module.exercises);

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

describe('Human Risk Foundations is registered and structured as claimed', () => {
  it('ships in the catalogue', () => {
    expect(PACKAGES.map((pkg) => pkg.id)).toContain('human-risk-foundations');
  });

  it('has 40 exercises across 8 modules', () => {
    expect(HUMAN_RISK_FOUNDATIONS.modules).toHaveLength(8);
    expect(EXERCISES).toHaveLength(40);
  });

  it('numbers each module\'s exercises from one, in order', () => {
    for (const module of HUMAN_RISK_FOUNDATIONS.modules) {
      expect(module.exercises.map((exercise) => exercise.order)).toEqual(
        module.exercises.map((_, index) => index + 1),
      );
      for (const exercise of module.exercises) {
        expect(exercise.moduleId).toBe(module.id);
        expect(exercise.packageId).toBe('human-risk-foundations');
      }
    }
  });

  it('needs no terminal, because nothing in this discipline is a technical exercise', () => {
    for (const exercise of EXERCISES) {
      expect(['multiple-choice', 'short-answer']).toContain(exercise.kind);
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
      for (const id of expected) expect(options.has(id)).toBe(true);

      // Selecting nothing and selecting everything must both be wrong.
      expect(expected.length).toBeGreaterThan(0);
      expect(expected.length).toBeLessThan(options.size);
    });
  }
});

describe('short-answer exercises grade against their own worked answer', () => {
  const written = EXERCISES.filter((exercise) => exercise.kind === 'short-answer');

  it('the package asks for written work in more than one place', () => {
    expect(written.length).toBeGreaterThanOrEqual(5);
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
    const offenders = EXERCISES.filter((exercise) => /[–—‘’“”]/.test(prose(exercise)));
    expect(offenders.map((exercise) => exercise.id)).toEqual([]);
  });

  it('gives every exercise teaching material, hints, and a debrief', () => {
    for (const exercise of EXERCISES) {
      expect(exercise.teach.concept.length, exercise.id).toBeGreaterThan(150);
      expect(exercise.hints.length, exercise.id).toBeGreaterThanOrEqual(2);
      expect(exercise.debrief ?? '', exercise.id).not.toBe('');
    }
  });
});
