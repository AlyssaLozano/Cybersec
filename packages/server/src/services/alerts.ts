/**
 * Access to the alert corpus.
 *
 * THE ONE RULE THIS MODULE EXISTS TO ENFORCE
 *
 * `ALERT_TRUTH` is the answer key. It must never reach the browser, for exactly
 * the reason exercise `checks` and `solution` never reach the browser: a student
 * who can read it can clear a hundred-alert queue perfectly without opening a
 * single one.
 *
 * So the two are reached through different functions with different names, and
 * the student-facing one is the only thing any route is allowed to call.
 * `queueForStudent()` returns a structure that is *incapable* of carrying truth,
 * because `AlertQueue` has no field for it.
 */

import type { Alert, AlertQueue, AlertTruth, TriageDecision, TriageScore } from '@soc/shared';
import { scoreTriage, TRIAGE_DECISIONS } from '@soc/shared';

import { ALERT_QUEUES, ALERT_TRUTH } from '../vfs/data/alerts.generated.js';

const QUEUE_BY_ID = new Map(ALERT_QUEUES.map((queue) => [queue.id, queue]));
const TRUTH_BY_ALERT = new Map(ALERT_TRUTH.map((truth) => [truth.alertId, truth]));

/**
 * Fail loudly at startup if any alert lacks an answer.
 *
 * An alert with no truth entry would be ungradeable, and `scoreTriage` would
 * quietly treat it as never-expected — inflating a student's precision for
 * getting it wrong. Better to refuse to boot.
 */
function validateCorpus(): void {
  for (const queue of ALERT_QUEUES) {
    if (queue.alerts.length === 0) {
      throw new Error(`Alert queue "${queue.id}" is empty.`);
    }
    for (const alert of queue.alerts) {
      if (!TRUTH_BY_ALERT.has(alert.id)) {
        throw new Error(`Alert "${alert.id}" in queue "${queue.id}" has no ground-truth entry.`);
      }
    }
  }
}
validateCorpus();

/**
 * The student-facing queue.
 *
 * Everything on `Alert` is what a real operator would see in a console, so the
 * whole record ships. The answer key is a separate type and is not assembled
 * here at all.
 */
export function queueForStudent(queueId: string): AlertQueue | null {
  return QUEUE_BY_ID.get(queueId) ?? null;
}

/** Every queue id in the corpus, in the order the generator emitted them. */
export function queueIds(): string[] {
  return ALERT_QUEUES.map((queue) => queue.id);
}

/** Ground truth for one queue. Server-side callers only. */
export function truthForQueue(queueId: string): AlertTruth[] {
  const queue = QUEUE_BY_ID.get(queueId);
  if (!queue) return [];
  return queue.alerts
    .map((alert) => TRUTH_BY_ALERT.get(alert.id))
    .filter((truth): truth is AlertTruth => truth !== undefined);
}

/** Alert ids in a queue whose correct disposition is `decision`. */
export function alertsRequiring(queueId: string, decision: TriageDecision): string[] {
  return truthForQueue(queueId)
    .filter((truth) => truth.correctDecision === decision)
    .map((truth) => truth.alertId);
}

/** Alert ids in a queue belonging to a named incident. */
export function alertsInIncident(queueId: string, incidentId: string): string[] {
  return truthForQueue(queueId)
    .filter((truth) => truth.incidentId === incidentId)
    .map((truth) => truth.alertId);
}

export function getAlert(queueId: string, alertId: string): Alert | null {
  return QUEUE_BY_ID.get(queueId)?.alerts.find((alert) => alert.id === alertId) ?? null;
}

/**
 * The debrief for a completed queue.
 *
 * Released only after the student has committed their decisions, on the same
 * principle as the worked solution: being told which eight alerts mattered
 * before you have looked teaches nothing.
 */
export interface TriageDebrief {
  scores: TriageScore[];
  /** Per-alert explanation, for alerts the student got wrong. */
  missed: Array<{ alertId: string; yourDecision: TriageDecision | null; correct: TriageDecision; why: string }>;
}

export function debriefFor(queueId: string, entries: Array<{ alertId: string; decision: TriageDecision }>): TriageDebrief {
  const truth = truthForQueue(queueId);
  const byAlert = new Map(entries.map((entry) => [entry.alertId, entry.decision]));

  return {
    scores: TRIAGE_DECISIONS.map((decision) => scoreTriage(entries, truth, decision)),
    missed: truth
      .filter((item) => byAlert.get(item.alertId) !== item.correctDecision)
      .map((item) => ({
        alertId: item.alertId,
        yourDecision: byAlert.get(item.alertId) ?? null,
        correct: item.correctDecision,
        why: item.why,
      })),
  };
}
