/**
 * Golden tests for the written half of Incident Response.
 *
 * WHY THIS FILE EXISTS
 *
 * `catalogue.test.ts` runs every TERMINAL exercise's stated solution through the
 * real shell. Most of this package is not terminal work: it is short-answer
 * writing and decision points, and until this file existed none of those rubrics
 * was checked against anything.
 *
 * That is the gap this closes, following the pattern set by
 * `ai-security-pathway.test.ts`. Every short-answer exercise is graded by the
 * real grader against its own worked answer, and again against its own prompt
 * pasted back. The first catches a rubric that would fail a student who wrote
 * exactly the model answer; the second catches a rubric so loose that restating
 * the question satisfies it. Both are easy to write and invisible on review,
 * which is precisely why they need a test rather than a careful reader.
 */

import { describe, expect, it } from 'vitest';

import type { Exercise } from '@soc/shared';

import { INCIDENT_RESPONSE } from './incident-response.js';
import { evaluate } from './validate.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';

const HOME = '/home/student';

const EXERCISES = INCIDENT_RESPONSE.modules.flatMap((module) => module.exercises);
const WRITTEN = EXERCISES.filter((exercise) => exercise.kind === 'short-answer');

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

describe('Incident Response is structured as claimed', () => {
  it('numbers each module\'s exercises from one, in order', () => {
    for (const module of INCIDENT_RESPONSE.modules) {
      expect(module.exercises.map((exercise) => exercise.order)).toEqual(
        module.exercises.map((_, index) => index + 1),
      );
      for (const exercise of module.exercises) {
        expect(exercise.moduleId).toBe(module.id);
        expect(exercise.packageId).toBe('incident-response');
      }
    }
  });

  it('keeps a substantial amount of written work', () => {
    // Response is a writing job at least as much as a technical one: the ticket,
    // the handover, and the closing summary are the deliverables somebody else
    // actually reads. A package that graded only commands would miss the half of
    // the role that gets people promoted.
    expect(WRITTEN.length).toBeGreaterThanOrEqual(10);
  });
});

describe('short-answer exercises grade against their own worked answer', () => {
  for (const exercise of WRITTEN) {
    it(`${exercise.id}: ${exercise.title}`, () => {
      const evaluation = gradeAnswer(exercise, exercise.solution);
      expect(evaluation.failed.map((failure) => `${failure.type}: ${failure.hint}`)).toEqual([]);
      expect(evaluation.passed).toBe(true);
    });
  }
});

describe('short-answer exercises cannot be passed by restating the prompt', () => {
  for (const exercise of WRITTEN) {
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
    ].join(' ');

  it('uses no em dashes', () => {
    // They arrive by paste and they break answer keys that match on literal
    // substrings, so they are caught here rather than by a student whose
    // correct answer is marked wrong.
    const offenders = EXERCISES.filter((exercise) => /[–—]/.test(prose(exercise)));
    expect(offenders.map((exercise) => exercise.id)).toEqual([]);
  });

  it('gives every exercise teaching material, hints, and a debrief', () => {
    for (const exercise of EXERCISES) {
      expect(exercise.teach.concept.length, exercise.id).toBeGreaterThan(100);
      expect(exercise.hints.length, exercise.id).toBeGreaterThanOrEqual(2);
      expect(exercise.debrief ?? '', exercise.id).not.toBe('');
    }
  });
});
