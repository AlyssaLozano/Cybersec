/**
 * Tests for incident decision points and decision grading.
 *
 * Two things are protected.
 *
 * First the boundary: `consequence` and `quality` are the answer, and the
 * student-facing view must be structurally incapable of carrying them. Asserted
 * by inspecting the shipped object rather than by trusting that somebody
 * remembered to strip it.
 *
 * Second the grading, and specifically that the two lazy answers fail. Selecting
 * every option must fail: "do all of it" is not a containment plan and one of
 * the options is always actively harmful. And an ordering exercise must not pass
 * on an empty submission, which is the failure mode a tolerance-based check
 * invites.
 */

import { describe, expect, it } from 'vitest';

import { orderingDisplacement } from '@soc/shared';

import { DECISION_POINTS } from '../content/incident-0815.js';
import { ALL_EXERCISES } from '../content/index.js';
import { evaluate } from '../content/validate.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';
import { intendedOrdering, optionsWithQuality, outcomesAfterCommit, pointForStudent } from './incidents.js';

const HOME = '/home/student';

function decisionAttempt(decision: { optionIds?: string[]; ordering?: string[]; justification?: string }) {
  return {
    input: 'decision',
    output: '',
    exitCode: 0,
    cwd: HOME,
    vfs: new Vfs(BASE_IMAGE, emptyOverlay(), HOME),
    decision,
  };
}

describe('the decision points', () => {
  it('always offer at least one sound option', () => {
    for (const point of DECISION_POINTS) {
      expect(optionsWithQuality(point.id, 'sound').length).toBeGreaterThan(0);
    }
  });

  it('explain the consequence of every option, taken or not', () => {
    // The point of a decision exercise is reading what the choices you did NOT
    // make would have cost. An option with no consequence teaches nothing.
    for (const point of DECISION_POINTS) {
      for (const option of point.options) {
        expect(option.consequence.length).toBeGreaterThan(40);
      }
    }
  });

  it('offer a genuinely wrong answer wherever a choice is being made', () => {
    // A selection point where every option is fine is a survey, not a decision.
    // Sequenced points are exempt: there, the wrong answer is the wrong order.
    for (const point of DECISION_POINTS) {
      if (point.ordered) continue;
      expect(optionsWithQuality(point.id, 'harmful').length).toBeGreaterThan(0);
    }
  });

  it('include options that are defensible rather than simply right or wrong', () => {
    // The pedagogical claim of this package. If every option were sound or
    // harmful, it would be teaching that incident response has clean answers.
    const defensible = DECISION_POINTS.flatMap((point) => optionsWithQuality(point.id, 'defensible'));
    expect(defensible.length).toBeGreaterThan(0);
  });
});

describe('the student-facing view', () => {
  it('carries no consequence and no quality', () => {
    // Structural tripwire. If somebody adds either field to StudentDecisionPoint
    // for convenience, every decision exercise starts shipping its answer.
    for (const point of DECISION_POINTS) {
      const shipped = pointForStudent(point.id)!;
      const serialised = JSON.stringify(shipped);
      expect(serialised).not.toContain('consequence');
      expect(serialised).not.toContain('quality');
      for (const option of shipped.options) {
        expect(Object.keys(option).sort()).not.toContain('consequence');
        expect(Object.keys(option).sort()).not.toContain('quality');
      }
    }
  });

  it('still carries what the student needs to decide', () => {
    for (const point of DECISION_POINTS) {
      const shipped = pointForStudent(point.id)!;
      expect(shipped.options.length).toBe(point.options.length);
      expect(shipped.situation.length).toBeGreaterThan(0);
      // The unknowns are the most important half of the snapshot and must ship.
      expect(shipped.snapshot.unknown.length).toBeGreaterThan(0);
    }
  });
});

describe('orderingDisplacement', () => {
  const expected = ['a', 'b', 'c', 'd'];

  it('is zero for the intended order', () => {
    expect(orderingDisplacement(['a', 'b', 'c', 'd'], expected)).toBe(0);
  });

  it('counts two displacements for a single transposition', () => {
    expect(orderingDisplacement(['b', 'a', 'c', 'd'], expected)).toBe(2);
  });

  it('penalises an incomplete ordering', () => {
    // Otherwise submitting only the first two steps would score better than
    // submitting all four in a slightly wrong order.
    expect(orderingDisplacement(['a', 'b'], expected)).toBe(2);
  });

  it('counts an unknown id as displaced', () => {
    expect(orderingDisplacement(['a', 'b', 'c', 'zzz'], expected)).toBeGreaterThan(0);
  });
});

describe('decision grading', () => {
  const decisionExercises = ALL_EXERCISES.filter((exercise) => exercise.kind === 'incident-decision');

  it('has decision exercises to grade', () => {
    expect(decisionExercises.length).toBeGreaterThan(0);
  });

  for (const exercise of decisionExercises) {
    describe(exercise.id, () => {
      const pointId = exercise.decisionPointId!;
      const isOrdered = exercise.checks.some((check) => check.type === 'decision-orders');

      it('references a decision point that exists', () => {
        expect(pointForStudent(pointId)).not.toBeNull();
      });

      it('passes on the intended answer', () => {
        const attempt = isOrdered
          ? decisionAttempt({ ordering: intendedOrdering(pointId) })
          : decisionAttempt({ optionIds: optionsWithQuality(pointId, 'sound') });
        // `decision-justifies` grades prose; synthesising text from the check's
        // own concept groups would assert nothing.
        const checks = exercise.checks.filter((check) => check.type !== 'decision-justifies');
        const evaluation = evaluate({ ...exercise, checks }, attempt, 1);
        expect(evaluation.failed.map((f) => `${f.type}: ${f.hint}`)).toEqual([]);
      });

      it('fails when the student selects every option', () => {
        // "Do all of it" is the decision-exercise equivalent of escalating the
        // whole queue, and at every selection point at least one option is
        // actively harmful.
        if (isOrdered) return;
        const everything = (pointForStudent(pointId)?.options ?? []).map((option) => option.id);
        const evaluation = evaluate(exercise, decisionAttempt({ optionIds: everything }), 1);
        expect(evaluation.passed).toBe(false);
      });

      it('fails on an empty submission', () => {
        const evaluation = evaluate(exercise, decisionAttempt({}), 1);
        expect(evaluation.passed).toBe(false);
      });
    });
  }
});

describe('outcomes after commit', () => {
  it('returns every option, marking the ones chosen', () => {
    const sound = optionsWithQuality('dp.contain', 'sound');
    const outcomes = outcomesAfterCommit('dp.contain', sound);

    expect(outcomes.length).toBe(pointForStudent('dp.contain')!.options.length);
    expect(outcomes.filter((outcome) => outcome.chosen).map((o) => o.optionId).sort()).toEqual(
      [...sound].sort(),
    );
    // The unchosen ones carry their consequences too. That is the point.
    for (const outcome of outcomes.filter((o) => !o.chosen)) {
      expect(outcome.consequence.length).toBeGreaterThan(0);
    }
  });

  it('returns nothing for a decision point that does not exist', () => {
    expect(outcomesAfterCommit('dp.nonexistent', [])).toEqual([]);
  });
});
