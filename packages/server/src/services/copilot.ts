/**
 * Access to the AI copilot's analyses.
 *
 * THE RULE THIS MODULE EXISTS TO ENFORCE
 *
 * `COPILOT_FLAWS` is an answer key, exactly like `ALERT_TRUTH` and exactly like
 * exercise `checks`. A student who can read it knows which of the copilot's
 * suggestions to distrust without having read one of them, and Module 3.5 is
 * entirely about reading them.
 *
 * So, as with alerts, the two are reached through differently-named functions and
 * only the student-facing one is callable from a route before decisions are
 * committed. `analysisFor()` returns a `CopilotAnalysis`, which has no field
 * capable of carrying a flaw.
 *
 * WHY CONSULTATIONS ARE COUNTED SERVER-SIDE
 *
 * "Did you actually ask" is graded. If the client reported it, it would be a
 * claim the student controls, and `copilot-consulted` would grade nothing. So a
 * consultation is recorded at the moment the analysis is served -- the same
 * reasoning that keeps the terminal on the server.
 */

import type {
  Alert,
  CollaborationInput,
  CollaborationScore,
  CopilotAnalysis,
  CopilotDebriefEntry,
  CopilotFlaw,
  CopilotFlawKind,
  TriageDecision,
  TriageEntry,
} from '@soc/shared';
import { scoreCollaboration } from '@soc/shared';

import { COPILOT_ANALYSES, COPILOT_FLAWS } from '../vfs/data/copilot.generated.js';
import { queueForStudent, queueIds, truthForQueue } from './alerts.js';

const ANALYSIS_BY_ALERT = new Map(COPILOT_ANALYSES.map((analysis) => [analysis.alertId, analysis]));
const FLAW_BY_ALERT = new Map(COPILOT_FLAWS.map((flaw) => [flaw.alertId, flaw]));

/**
 * The seam a live model would plug into.
 *
 * Deliberately narrow, and deliberately not used for anything graded. Every
 * exercise in Module 3.5 is scored against what the copilot said, so the copilot
 * that said it has to be the committed one -- a provider that answers differently
 * on every call would make those exercises unpassable and unreviewable at the
 * same time.
 *
 * A live provider belongs behind a free-form "ask a follow-up" affordance, where
 * nothing depends on the answer being any particular answer. When that arrives,
 * it implements this interface and the graded path keeps using `SCRIPTED`.
 */
export interface CopilotProvider {
  analyse(alert: Alert): CopilotAnalysis | null;
}

export const SCRIPTED: CopilotProvider = {
  analyse: (alert) => ANALYSIS_BY_ALERT.get(alert.id) ?? null,
};

/**
 * Fail loudly at startup if any alert has no analysis.
 *
 * An alert whose copilot panel comes up empty is worse than one with no copilot
 * at all: the student cannot tell whether the assistant had nothing to say or
 * whether the feature is broken, and `copilot-consulted` would silently become
 * impossible to satisfy on that alert.
 */
function validateCorpus(): void {
  for (const queue of queueIds()) {
    for (const alert of queueForStudent(queue)?.alerts ?? []) {
      if (!ANALYSIS_BY_ALERT.has(alert.id)) {
        throw new Error(
          `Alert "${alert.id}" in queue "${queue}" has no copilot analysis. ` +
            'Re-run: npm run gen:copilot --workspace @soc/server',
        );
      }
    }
  }

  // A flaw describing an analysis that no longer exists means the two generated
  // files were produced from different corpora.
  for (const flaw of COPILOT_FLAWS) {
    if (!ANALYSIS_BY_ALERT.has(flaw.alertId)) {
      throw new Error(`Copilot flaw names alert "${flaw.alertId}", which has no analysis.`);
    }
  }
}

validateCorpus();

/** The student-facing analysis. Safe to send; carries no answer key. */
export function analysisFor(alertId: string): CopilotAnalysis | null {
  return ANALYSIS_BY_ALERT.get(alertId) ?? null;
}

/** The flaw table for one analysis. Server-side callers only. */
export function flawFor(alertId: string): CopilotFlaw | null {
  return FLAW_BY_ALERT.get(alertId) ?? null;
}

/**
 * Alert ids in a queue where following the copilot leads to the wrong answer.
 *
 * This is what Module 3.5's exercises compute their expected answers from, so
 * that no exercise ever names a flawed alert by hand. Regenerating copilot
 * output moves the exercises with it.
 */
export function alertsWhereCopilotMisleads(queueId: string, kind?: CopilotFlawKind): string[] {
  return (queueForStudent(queueId)?.alerts ?? [])
    .filter((alert) => {
      const flaw = FLAW_BY_ALERT.get(alert.id);
      return flaw?.misleads === true && (kind === undefined || flaw.kind === kind);
    })
    .map((alert) => alert.id);
}

/** Alert ids in a queue whose analysis is flawed in a given way, misleading or not. */
export function alertsWithCopilotFlaw(queueId: string, kind: CopilotFlawKind): string[] {
  return (queueForStudent(queueId)?.alerts ?? [])
    .filter((alert) => FLAW_BY_ALERT.get(alert.id)?.kind === kind)
    .map((alert) => alert.id);
}

/** What the copilot recommended for one alert, for grading. Server-side only. */
export function recommendationFor(alertId: string): TriageDecision | null {
  return ANALYSIS_BY_ALERT.get(alertId)?.recommendation ?? null;
}

/**
 * What the copilot recommended for every alert in a queue.
 *
 * Handed to the grader rather than reached for by it, on the same principle as
 * `truthForQueue`: grading stays a pure function of the attempt, and no answer
 * key becomes ambient state that another module could serialise by accident.
 */
export function adviceForQueue(
  queueId: string,
): Array<{ alertId: string; recommendation: TriageDecision }> {
  return (queueForStudent(queueId)?.alerts ?? [])
    .map((alert) => ({ alertId: alert.id, recommendation: recommendationFor(alert.id) }))
    .filter(
      (item): item is { alertId: string; recommendation: TriageDecision } =>
        item.recommendation !== null,
    );
}

/**
 * Score how a student worked with the copilot on one queue.
 *
 * Undecided alerts are excluded. Leaving an alert alone is already scored as a
 * recall failure by the triage grader, and counting it again here would penalise
 * one omission twice under two different names.
 */
export function collaborationFor(
  queueId: string,
  entries: TriageEntry[],
  consultedAlertIds: Iterable<string>,
): CollaborationScore {
  const consulted = new Set(consultedAlertIds);
  const truthByAlert = new Map(truthForQueue(queueId).map((truth) => [truth.alertId, truth]));

  const items: CollaborationInput[] = [];
  for (const entry of entries) {
    const truth = truthByAlert.get(entry.alertId);
    const recommendation = recommendationFor(entry.alertId);
    // An alert with no truth or no analysis cannot be scored on collaboration.
    // Both are impossible after the boot-time validators, and skipping is still
    // the right answer: inventing a verdict would be worse than omitting one.
    if (!truth || !recommendation) continue;
    items.push({
      alertId: entry.alertId,
      decision: entry.decision,
      correctDecision: truth.correctDecision,
      recommendation,
      consulted: consulted.has(entry.alertId),
    });
  }

  return scoreCollaboration(items);
}

/**
 * The copilot half of a triage debrief.
 *
 * Released only after decisions are committed, on the same principle as the
 * worked solution and the per-alert triage explanation.
 *
 * DEDUPED BY FLAW KIND, ON PURPOSE
 *
 * One planted mistake covers seventy-nine alerts in the night-shift queue. A
 * debrief that repeated the same paragraph seventy-nine times would not be a
 * thorough debrief; it would be an unreadable one, and the student would scroll
 * past the two entries that were about the intrusion. One worked example per
 * mistake is what a debrief is for.
 *
 * Misleading flaws are listed first so that the entries which changed an answer
 * are never the ones crowded out.
 */
export function copilotDebriefFor(
  queueId: string,
  entries: TriageEntry[],
  consultedAlertIds: Iterable<string>,
): CopilotDebriefEntry[] {
  const consulted = new Set(consultedAlertIds);
  const decisionByAlert = new Map(entries.map((entry) => [entry.alertId, entry.decision]));

  const candidates: CopilotDebriefEntry[] = [];
  for (const alert of queueForStudent(queueId)?.alerts ?? []) {
    const flaw = FLAW_BY_ALERT.get(alert.id);
    if (!flaw) continue;
    // Only alerts the student actually engaged with. Explaining a mistake on an
    // alert somebody never opened is noise dressed as feedback.
    if (!decisionByAlert.has(alert.id) && !consulted.has(alert.id)) continue;

    candidates.push({
      alertId: alert.id,
      kind: flaw.kind,
      recommendation: ANALYSIS_BY_ALERT.get(alert.id)!.recommendation,
      yourDecision: decisionByAlert.get(alert.id) ?? null,
      misleads: flaw.misleads,
      consulted: consulted.has(alert.id),
      why: flaw.why,
    });
  }

  candidates.sort((a, b) => Number(b.misleads) - Number(a.misleads));

  const shown = new Set<string>();
  return candidates.filter((entry) => {
    // Both halves of a kind are worth showing when one misled the student and
    // another did not, so the key includes that.
    const key = `${entry.kind}:${entry.misleads}`;
    if (shown.has(key)) return false;
    shown.add(key);
    return true;
  });
}
