/**
 * Tests for the AI copilot: the corpus, the boundary, and the scoring.
 *
 * Three things are being protected.
 *
 * First, the boundary. `COPILOT_FLAWS` is the third answer key in this codebase
 * and the newest, which makes it the one most likely to leak. That is asserted
 * structurally -- by the shape of what `analysisFor` returns -- rather than by
 * reading the route handler, because "we remembered to strip it" is not a
 * property that survives six months of edits.
 *
 * Second, the composition. The copilot has to be right about most alerts. A
 * copilot that was wrong half the time would teach students to ignore it, and
 * ignoring it is not the skill either. There is a test below that fails if the
 * corpus drifts in either direction.
 *
 * Third, the scoring. Deferring to a wrong recommendation must score worse than
 * thinking independently and being wrong, and consulting must never by itself be
 * worth more than getting the alert right. Those are the two ways a metric like
 * this goes bad, and they are the reason it is scored per-alert rather than as a
 * usage count.
 */

import { describe, expect, it } from 'vitest';

import type { CollaborationInput, TriageEntry } from '@soc/shared';
import { classifyCollaboration, scoreCollaboration } from '@soc/shared';

import { ALL_EXERCISES } from '../content/index.js';
import { evaluate } from '../content/validate.js';
import { COPILOT_ANALYSES, COPILOT_FLAWS } from '../vfs/data/copilot.generated.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';
import { queueForStudent, queueIds, truthForQueue } from './alerts.js';
import {
  adviceForQueue,
  alertsWhereCopilotMisleads,
  analysisFor,
  collaborationFor,
  copilotDebriefFor,
  flawFor,
  recommendationFor,
} from './copilot.js';

const HOME = '/home/student';

/** Everything a student is allowed to see about one analysis. */
const SAFE_ANALYSIS_KEYS = [
  'alertId',
  'headline',
  'riskFactors',
  'mitigatingFactors',
  'recommendation',
  'confidence',
  'nextSteps',
  'limits',
].sort();

function attemptFor(
  queueId: string,
  entries: TriageEntry[],
  consulted: string[],
) {
  return {
    input: 'triage',
    output: '',
    exitCode: 0,
    cwd: HOME,
    vfs: new Vfs(BASE_IMAGE, emptyOverlay(), HOME),
    triage: entries,
    alertTruth: truthForQueue(queueId),
    copilotConsulted: consulted,
    copilotAdvice: adviceForQueue(queueId),
  };
}

/** Every alert given its ground-truth disposition. */
function idealSubmission(queueId: string): TriageEntry[] {
  return truthForQueue(queueId).map((truth) => ({
    alertId: truth.alertId,
    decision: truth.correctDecision,
  }));
}

/** Every alert given whatever the copilot recommended: total deference. */
function deferentialSubmission(queueId: string): TriageEntry[] {
  return (queueForStudent(queueId)?.alerts ?? []).map((alert) => ({
    alertId: alert.id,
    decision: recommendationFor(alert.id)!,
  }));
}

const allAlertIds = (queueId: string): string[] =>
  (queueForStudent(queueId)?.alerts ?? []).map((alert) => alert.id);

describe('the copilot corpus', () => {
  it('analyses every alert in every queue', () => {
    const missing = queueIds().flatMap((queueId) =>
      allAlertIds(queueId).filter((alertId) => analysisFor(alertId) === null),
    );
    expect(missing).toEqual([]);
  });

  it('is right about the large majority of alerts', () => {
    // The whole module depends on this. A copilot that is wrong often is easy to
    // dismiss, and a copilot that is never wrong teaches deference. Both are
    // failures of the material, so both fail here.
    const misleading = COPILOT_FLAWS.filter((flaw) => flaw.misleads).length;
    const share = misleading / COPILOT_ANALYSES.length;

    expect(share).toBeGreaterThan(0.01);
    expect(share).toBeLessThan(0.15);
  });

  it('keeps the flaw table consistent with the advice actually given', () => {
    // A flaw claiming to mislead while recommending the correct disposition
    // would score students against a table that does not describe what they read.
    const inconsistent = queueIds().flatMap((queueId) => {
      const truthByAlert = new Map(truthForQueue(queueId).map((t) => [t.alertId, t]));
      return allAlertIds(queueId)
        .filter((alertId) => {
          const flaw = flawFor(alertId);
          if (!flaw) return false;
          const wrong = recommendationFor(alertId) !== truthByAlert.get(alertId)!.correctDecision;
          return flaw.misleads !== wrong;
        });
    });
    expect(inconsistent).toEqual([]);
  });

  it('carries at least one flaw whose recommendation is correct', () => {
    // Without these, "spot the flawed analysis" collapses into "notice which
    // ones I disagreed with", and a student could clear the module without
    // reading a single rationale.
    const reasoningOnly = COPILOT_FLAWS.filter((flaw) => !flaw.misleads);
    expect(reasoningOnly.length).toBeGreaterThan(0);
  });
});

describe('the answer-key boundary', () => {
  it('never puts flaw information on a student-facing analysis', () => {
    for (const analysis of COPILOT_ANALYSES) {
      expect(Object.keys(analysis).sort()).toEqual(SAFE_ANALYSIS_KEYS);
    }
  });

  it('keeps the flaw table reachable only through a differently named function', () => {
    const flawed = COPILOT_FLAWS[0]!;
    // Same alert, two functions, and only one of them knows anything.
    expect(analysisFor(flawed.alertId)).not.toBeNull();
    expect(JSON.stringify(analysisFor(flawed.alertId))).not.toContain(flawed.why);
    expect(flawFor(flawed.alertId)?.why).toBe(flawed.why);
  });

  it('withholds the debrief from a student who has committed nothing', () => {
    // The copilot debrief is released on the same terms as the worked solution.
    // An empty submission has committed to nothing, so there is nothing to
    // explain and nothing to hand over.
    expect(copilotDebriefFor('q-intro', [], [])).toEqual([]);
  });
});

describe('collaboration scoring', () => {
  const item = (over: Partial<CollaborationInput>): CollaborationInput => ({
    alertId: 'A-1',
    decision: 'dismiss',
    correctDecision: 'dismiss',
    recommendation: 'dismiss',
    consulted: true,
    ...over,
  });

  it('classifies overriding a bad suggestion as caught', () => {
    expect(
      classifyCollaboration(
        item({ decision: 'escalate', correctDecision: 'escalate', recommendation: 'dismiss' }),
      ),
    ).toBe('caught');
  });

  it('classifies following a bad suggestion as misled', () => {
    expect(
      classifyCollaboration(
        item({ decision: 'dismiss', correctDecision: 'escalate', recommendation: 'dismiss' }),
      ),
    ).toBe('misled');
  });

  it('classifies ignoring a good suggestion and being wrong as strayed', () => {
    expect(
      classifyCollaboration(
        item({ decision: 'dismiss', correctDecision: 'escalate', recommendation: 'escalate' }),
      ),
    ).toBe('strayed');
  });

  it('does not punish getting an alert right without asking', () => {
    // Consulting is not virtuous in itself. An operator who reads an alert,
    // knows what it is, and dispositions it correctly has done the job.
    const solo = scoreCollaboration([item({ consulted: false })]);
    const asked = scoreCollaboration([item({ consulted: true })]);
    expect(solo.score).toBe(asked.score);
    expect(solo.counts['solo-right']).toBe(1);
  });

  it('scores deferring into a wrong answer below being wrong independently', () => {
    // The central assertion of the metric, and the counterpart of "escalating
    // everything must fail" in the triage grader.
    const misled = scoreCollaboration([
      item({ decision: 'dismiss', correctDecision: 'escalate', recommendation: 'dismiss' }),
    ]);
    const independent = scoreCollaboration([
      item({ decision: 'tune', correctDecision: 'escalate', recommendation: 'dismiss' }),
    ]);
    expect(misled.counts.misled).toBe(1);
    expect(independent.counts['both-wrong']).toBe(1);
    expect(misled.score).toBeLessThanOrEqual(independent.score);
  });

  it('reports deference separately rather than folding it into the score', () => {
    const score = scoreCollaboration([item({}), item({ alertId: 'A-2' })]);
    expect(score.deferenceRate).toBe(1);
    // Deferring to advice that was right is not a mark against anybody.
    expect(score.score).toBe(100);
  });

  it('has no deference rate when nothing was consulted', () => {
    expect(scoreCollaboration([item({ consulted: false })]).deferenceRate).toBeNull();
  });

  it('reports a zero score rather than a negative one', () => {
    const score = scoreCollaboration(
      Array.from({ length: 3 }, (_, index) =>
        item({
          alertId: `A-${index}`,
          decision: 'dismiss',
          correctDecision: 'escalate',
          recommendation: 'dismiss',
        }),
      ),
    );
    expect(score.score).toBe(0);
  });
});

describe('working a real queue with the copilot', () => {
  const queueId = 'q-intro';
  const traps = alertsWhereCopilotMisleads(queueId);

  it('has misleading advice to be caught', () => {
    expect(traps.length).toBeGreaterThan(0);
  });

  it('credits a student who overrides every bad suggestion', () => {
    const score = collaborationFor(queueId, idealSubmission(queueId), allAlertIds(queueId));
    expect(score.counts.caught).toBe(traps.length);
    expect(score.counts.misled).toBe(0);
  });

  it('penalises a student who takes every recommendation verbatim', () => {
    const score = collaborationFor(queueId, deferentialSubmission(queueId), allAlertIds(queueId));
    expect(score.counts.misled).toBe(traps.length);
    expect(score.counts.caught).toBe(0);
    expect(score.deferenceRate).toBe(1);
  });

  it('scores total deference below independent correctness', () => {
    const deferred = collaborationFor(queueId, deferentialSubmission(queueId), allAlertIds(queueId));
    const judged = collaborationFor(queueId, idealSubmission(queueId), allAlertIds(queueId));
    expect(deferred.score).toBeLessThan(judged.score);
  });

  it('explains each planted mistake once rather than once per alert', () => {
    // One mistake covers seventy-nine alerts in the night shift. A debrief that
    // repeated itself that many times would bury the two entries about the
    // intrusion.
    const debrief = copilotDebriefFor(
      'q-nightshift',
      idealSubmission('q-nightshift'),
      allAlertIds('q-nightshift'),
    );
    const keys = debrief.map((entry) => `${entry.kind}:${entry.misleads}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(debrief.length).toBeGreaterThan(0);
  });

  it('puts the mistakes that changed an answer first', () => {
    const debrief = copilotDebriefFor(
      'q-nightshift',
      idealSubmission('q-nightshift'),
      allAlertIds('q-nightshift'),
    );
    const firstSound = debrief.findIndex((entry) => !entry.misleads);
    const lastMisleading = debrief.map((entry) => entry.misleads).lastIndexOf(true);
    if (firstSound !== -1 && lastMisleading !== -1) {
      expect(lastMisleading).toBeLessThan(firstSound);
    }
  });
});

describe('copilot checks in isolation', () => {
  const exercise = ALL_EXERCISES.find((item) => item.id === 'triage.5.2')!;
  const queueId = exercise.queueId!;

  it('is a triage exercise that grades copilot use', () => {
    expect(exercise.checks.some((check) => check.type === 'copilot-override')).toBe(true);
  });

  it('fails a perfect submission from a student who never opened the copilot', () => {
    // Reaching the right answer alone is a pass on the triage checks and must
    // still fail the ones about the assistant, or the exercise grades nothing.
    const evaluation = evaluate(exercise, attemptFor(queueId, idealSubmission(queueId), []), 1);
    const failedTypes = evaluation.failed.map((failure) => failure.type);
    expect(failedTypes).toContain('copilot-consulted');
    expect(failedTypes).toContain('copilot-override');
  });

  it('fails a student who read the advice and then deferred to it', () => {
    const evaluation = evaluate(
      exercise,
      attemptFor(queueId, deferentialSubmission(queueId), allAlertIds(queueId)),
      1,
    );
    expect(evaluation.passed).toBe(false);
    expect(evaluation.failed.map((failure) => failure.type)).toContain('copilot-override');
  });

  it('passes a student who consulted widely and overrode the bad advice', () => {
    const evaluation = evaluate(
      exercise,
      attemptFor(queueId, idealSubmission(queueId), allAlertIds(queueId)),
      1,
    );
    expect(evaluation.failed).toEqual([]);
  });

  it('refuses to credit an override on advice that was never read', () => {
    // Disagreeing with a suggestion nobody opened is coincidence, not judgement.
    const evaluation = evaluate(
      exercise,
      attemptFor(queueId, idealSubmission(queueId), allAlertIds(queueId).slice(0, 1)),
      1,
    );
    expect(evaluation.failed.map((failure) => failure.type)).toContain('copilot-override');
  });
});

describe('Module 3.5 content', () => {
  const module35 = ALL_EXERCISES.filter((exercise) => exercise.moduleId === '3.5');

  it('exists', () => {
    expect(module35.length).toBeGreaterThan(0);
  });

  it('only ever asks students to override advice that is genuinely wrong', () => {
    // The failure this guards is a regenerated copilot corpus that makes a
    // planted mistake sound, leaving an exercise demanding disagreement with
    // correct advice. The boot validator catches a missing analysis; this
    // catches a correct one.
    for (const exercise of module35) {
      const truthByAlert = new Map(
        truthForQueue(exercise.queueId ?? '').map((truth) => [truth.alertId, truth]),
      );
      for (const check of exercise.checks) {
        if (check.type !== 'copilot-override') continue;
        for (const alertId of check.alertIds) {
          expect(recommendationFor(alertId)).not.toBe(truthByAlert.get(alertId)?.correctDecision);
        }
      }
    }
  });

  /*
   * The catalogue's "solution passes its own checks" sweep only covers terminal
   * exercises, because those are the ones with a command to run. That left the
   * written exercises here unguarded, and 3.5.5's model answer did in fact fail
   * its own concept groups the first time it was written -- the answer said
   * "generated rather than retrieved" and the check was looking for "fabricated".
   *
   * A model answer that cannot pass its own exercise is the worst kind of
   * content bug: the student is told they are wrong, asks to be shown, and is
   * shown something the grader also rejects.
   */
  it('accepts its own model answers', () => {
    for (const exercise of module35) {
      if (exercise.kind === 'alert-triage') continue;
      const attempt = {
        input: exercise.solution,
        output: '',
        exitCode: 0,
        cwd: HOME,
        vfs: new Vfs(BASE_IMAGE, emptyOverlay(), HOME),
        ...(exercise.kind === 'multiple-choice'
          ? { selectedOptionIds: [exercise.solution] }
          : { answerText: exercise.solution }),
      };
      const evaluation = evaluate(exercise, attempt, 1);
      expect(`${exercise.id}: ${evaluation.failed.map((f) => f.type).join(', ')}`).toBe(
        `${exercise.id}: `,
      );
    }
  });

  it('never grades copilot use on an exercise with no queue', () => {
    for (const exercise of module35) {
      const gradesCopilot = exercise.checks.some((check) => check.type.startsWith('copilot-'));
      if (gradesCopilot) expect(exercise.queueId).toBeTruthy();
    }
  });
});
