/**
 * Tests for the alert corpus and triage grading.
 *
 * Two things are being protected here.
 *
 * First, the boundary: the answer key must not be reachable from anything a
 * route returns. That is asserted structurally rather than by inspection,
 * because "we remembered to strip it" is not a property that survives six months
 * of edits.
 *
 * Second, the grading: a student who escalates the entire queue must FAIL. That
 * is the single most important assertion in this file. Escalating everything
 * gives perfect recall, and a scoring system that rewards it would teach exactly
 * the habit this package exists to prevent.
 */

import { describe, expect, it } from 'vitest';

import type { Alert, TriageEntry } from '@soc/shared';
import { scoreTriage, TRIAGE_DECISIONS } from '@soc/shared';

import { ALERT_QUEUES, ALERT_TRUTH } from '../vfs/data/alerts.generated.js';
import { ALL_EXERCISES } from '../content/index.js';
import { evaluate } from '../content/validate.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';
import { alertsRequiring, queueForStudent, truthForQueue } from './alerts.js';
import { adviceForQueue } from './copilot.js';

const HOME = '/home/student';

/**
 * An attempt carrying triage decisions and the copilot facts that go with them.
 *
 * `consulted` defaults to every alert in the queue, which models a student who
 * read the assistant on all of them. That is the right default for the
 * "ground-truth-perfect submission" tests: the alternative -- excluding copilot
 * checks from those tests -- would leave three exercises whose hardest checks
 * are never exercised. Pass an explicit list to model somebody who did not look.
 */
function triageAttempt(
  entries: TriageEntry[],
  queueId: string,
  options: { consulted?: string[] } = {},
) {
  const everyAlert = (queueForStudent(queueId)?.alerts ?? []).map((alert) => alert.id);
  return {
    input: 'triage',
    output: '',
    exitCode: 0,
    cwd: HOME,
    vfs: new Vfs(BASE_IMAGE, emptyOverlay(), HOME),
    triage: entries,
    alertTruth: truthForQueue(queueId),
    copilotConsulted: options.consulted ?? everyAlert,
    copilotAdvice: adviceForQueue(queueId),
  };
}

/** The perfect submission: every alert given its ground-truth disposition. */
function idealSubmission(queueId: string): TriageEntry[] {
  return truthForQueue(queueId).map((truth) => ({
    alertId: truth.alertId,
    decision: truth.correctDecision,
  }));
}

describe('the alert corpus', () => {
  it('gives every alert a ground-truth entry', () => {
    const truthIds = new Set(ALERT_TRUTH.map((truth) => truth.alertId));
    const orphans = ALERT_QUEUES.flatMap((queue) => queue.alerts)
      .filter((alert) => !truthIds.has(alert.id))
      .map((alert) => alert.id);
    expect(orphans).toEqual([]);
  });

  it('uses only RFC 5737 documentation ranges for external addresses', () => {
    // A simulated command must never be able to reach a real host, and a student
    // must never be pointed at somebody else's server. Internal RFC 1918 space
    // is fine; anything else public is not.
    const permitted = /^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.)/;
    const offenders = new Set<string>();

    for (const queue of ALERT_QUEUES) {
      for (const alert of queue.alerts) {
        for (const endpoint of [alert.from, alert.to]) {
          if (endpoint && !permitted.test(endpoint.ip)) offenders.add(endpoint.ip);
        }
      }
    }
    expect([...offenders]).toEqual([]);
  });

  it('never carries the answer key on an alert', () => {
    // Structural, not cosmetic: if somebody adds a `verdict` or `correctDecision`
    // field to Alert for convenience, every route returning a queue starts
    // leaking the answers silently. This test is the tripwire.
    const forbidden = ['verdict', 'correctDecision', 'why', 'incidentId', 'truth'];
    const leaked = new Set<string>();

    for (const queue of ALERT_QUEUES) {
      for (const alert of queue.alerts) {
        for (const key of Object.keys(alert as unknown as Record<string, unknown>)) {
          if (forbidden.includes(key)) leaked.add(key);
        }
      }
    }
    expect([...leaked]).toEqual([]);
  });

  it('is mostly not the intrusion', () => {
    // The whole premise of the package. If a queue is ever generated where the
    // attack is the majority of the alerts, it stops teaching signal-versus-noise.
    for (const queue of ALERT_QUEUES) {
      const escalate = alertsRequiring(queue.id, 'escalate').length;
      expect(escalate / queue.alerts.length).toBeLessThan(0.3);
    }
  });

  it('keeps the alert ids in a queue unique', () => {
    for (const queue of ALERT_QUEUES) {
      const ids = queue.alerts.map((alert: Alert) => alert.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('scoreTriage', () => {
  const truth = truthForQueue('q-nightshift');
  const escalateIds = alertsRequiring('q-nightshift', 'escalate');

  it('scores a perfect submission at 1.0 on both axes', () => {
    const score = scoreTriage(idealSubmission('q-nightshift'), truth, 'escalate');
    expect(score.precision).toBe(1);
    expect(score.recall).toBe(1);
  });

  it('gives escalate-everything perfect recall and terrible precision', () => {
    const everything: TriageEntry[] = truth.map((item) => ({
      alertId: item.alertId,
      decision: 'escalate' as const,
    }));
    const score = scoreTriage(everything, truth, 'escalate');

    expect(score.recall).toBe(1);
    expect(score.precision).toBeLessThan(0.2);
  });

  it('treats an empty submission as perfect precision and zero recall', () => {
    // Not a quirk: precision over nothing is vacuously 1, and reporting it as 0
    // would punish an operator for not guessing. Recall is what catches this.
    const score = scoreTriage([], truth, 'escalate');
    expect(score.precision).toBe(1);
    expect(score.recall).toBe(0);
    expect(score.expected).toBe(escalateIds.length);
  });

  it('does not credit a correct alert filed under the wrong decision', () => {
    const misfiled: TriageEntry[] = escalateIds.map((alertId) => ({ alertId, decision: 'dismiss' as const }));
    expect(scoreTriage(misfiled, truth, 'escalate').correct).toBe(0);
  });
});

describe('triage grading', () => {
  const triageExercises = ALL_EXERCISES.filter((exercise) => exercise.kind === 'alert-triage');

  it('has triage exercises to grade', () => {
    expect(triageExercises.length).toBeGreaterThan(0);
  });

  for (const exercise of triageExercises) {
    describe(exercise.id, () => {
      const queueId = exercise.queueId!;

      it('references a queue that exists', () => {
        expect(queueForStudent(queueId)).not.toBeNull();
      });

      it('passes every non-written check on a ground-truth-perfect submission', () => {
        // `triage-justifies` is excluded: it grades prose, and synthesising text
        // from the check's own concept groups would assert nothing.
        const checks = exercise.checks.filter((check) => check.type !== 'triage-justifies');
        const evaluation = evaluate(
          { ...exercise, checks },
          triageAttempt(idealSubmission(queueId), queueId),
          1,
        );
        expect(evaluation.failed.map((f) => `${f.type}: ${f.hint}`)).toEqual([]);
      });

      it('fails when the student escalates the entire queue', () => {
        const everything: TriageEntry[] = truthForQueue(queueId).map((truth) => ({
          alertId: truth.alertId,
          decision: 'escalate' as const,
        }));
        const evaluation = evaluate(exercise, triageAttempt(everything, queueId), 1);
        expect(evaluation.passed).toBe(false);
      });

      it('fails on an empty submission', () => {
        const evaluation = evaluate(exercise, triageAttempt([], queueId), 1);
        expect(evaluation.passed).toBe(false);
      });
    });
  }
});

describe('triage checks in isolation', () => {
  const queueId = 'q-intro';
  const escalate = alertsRequiring(queueId, 'escalate');

  it('triage-accuracy fails closed when ground truth is absent', () => {
    // A misconfigured exercise must not award an unearned pass.
    const exercise = ALL_EXERCISES.find((item) => item.id === '3.1.1')!;
    const evaluation = evaluate(
      { ...exercise, checks: [{ type: 'triage-accuracy', decision: 'escalate', minRecall: 1, hint: 'x' }] },
      {
        input: '',
        output: '',
        exitCode: 0,
        cwd: HOME,
        vfs: new Vfs(BASE_IMAGE, emptyOverlay(), HOME),
        triage: idealSubmission(queueId),
      },
      1,
    );
    expect(evaluation.passed).toBe(false);
  });

  it('triage-budget counts only the decision it names', () => {
    const exercise = ALL_EXERCISES.find((item) => item.id === '3.1.1')!;
    const entries: TriageEntry[] = [
      ...escalate.map((alertId) => ({ alertId, decision: 'escalate' as const })),
      ...alertsRequiring(queueId, 'dismiss').map((alertId) => ({ alertId, decision: 'dismiss' as const })),
    ];
    const evaluation = evaluate(
      { ...exercise, checks: [{ type: 'triage-budget', decision: 'escalate', max: 2, hint: 'x' }] },
      triageAttempt(entries, queueId),
      1,
    );
    // Many dismissals, few escalations: the budget is about escalations only.
    expect(evaluation.passed).toBe(true);
  });

  it('every decision in the corpus is one the student can actually choose', () => {
    const used = new Set(ALERT_TRUTH.map((truth) => truth.correctDecision));
    for (const decision of used) {
      expect(TRIAGE_DECISIONS).toContain(decision);
    }
  });
});
