/**
 * Access to the Model Lab.
 *
 * THE ONE RULE THIS MODULE EXISTS TO ENFORCE
 *
 * Which defences a deployment has is the answer key. This module is the seam
 * between the routes (which may only ever see a `ModelCard`) and the harness
 * (which needs the whole deployment to decide anything). Nothing outside here
 * calls `deploymentFor()`.
 *
 * That is the same arrangement as `services/alerts.ts` and for the same reason:
 * the boundary should be a named module somebody can grep for, not a convention
 * each route is trusted to remember.
 *
 * WHY PROBING IS UNGRADED AND SUBMITTING IS NOT
 *
 * A student may fire as many probes at a model as they like without it counting
 * against them. That is what testing is: most payloads fail, and a platform
 * that logged every failure as a failed attempt would teach students to think
 * before trying rather than to try systematically, which is exactly backwards
 * for this discipline.
 *
 * What is graded is the SUBMISSION: the short list of probes the student puts
 * their name to as evidence of a finding. Several exercises cap how many may be
 * submitted, for the same reason the triage exercises cap escalations.
 */

import type {
  AttackSuite,
  DefenceId,
  HardeningScore,
  ModelCard,
  ProbeEntry,
  ProbeResult,
} from '@soc/shared';

import { defenceCost, runProbes, type ProbeAnalysis } from '../ai/harness.js';
import { ATTACK_SUITES, deploymentFor, getSuite, modelForStudent } from '../ai/models.js';

/**
 * Cost of a defence set.
 *
 * Re-exported through this module rather than imported from the harness
 * directly, so that everything the grading path needs from the Model Lab comes
 * through the one seam. The rule is easier to keep when there is only one door.
 */
export const defenceCostOf = defenceCost;

/** The card a student may see. Incapable of carrying a defence list. */
export function modelCard(modelId: string): ModelCard | null {
  return modelForStudent(modelId);
}

export function suite(suiteId: string): AttackSuite | null {
  return getSuite(suiteId);
}

export function allSuites(): AttackSuite[] {
  return ATTACK_SUITES;
}

/**
 * Fire probes at a model and report what happened.
 *
 * `defences` overrides the deployment's own set, which is how the hardening
 * exercises work: the student is rebuilding the deployment rather than testing
 * the one that exists. The analyses (which name the exact defence that fired)
 * stay here; only `ProbeResult[]` is returned.
 */
export function probe(
  modelId: string,
  probes: ProbeEntry[],
  defences?: readonly DefenceId[],
): ProbeResult[] | null {
  const deployment = deploymentFor(modelId);
  if (!deployment) return null;
  return runProbes(deployment, probes, defences).results;
}

/**
 * Probe and keep the analyses, for the grader.
 *
 * Separate function rather than an option on `probe()`, so that a route reaching
 * for the wrong one is visible in review instead of being a boolean somebody
 * flipped.
 */
export function probeForGrading(
  modelId: string,
  probes: ProbeEntry[],
  defences?: readonly DefenceId[],
): { results: ProbeResult[]; analyses: ProbeAnalysis[] } | null {
  const deployment = deploymentFor(modelId);
  if (!deployment) return null;
  return runProbes(deployment, probes, defences);
}

/**
 * Run a named suite against a defence set and score it.
 *
 * The suite payloads are sent down the channel each one implies: a payload
 * written as a retrieved document is tested as a retrieved document, because
 * testing it as chat input would silently make `retrieved-content-quarantine`
 * look useless and the keyword filter look better than it is.
 */
export function scoreHardening(
  modelId: string,
  suiteId: string,
  defences: readonly DefenceId[],
): HardeningScore | null {
  const deployment = deploymentFor(modelId);
  const target = getSuite(suiteId);
  if (!deployment || !target) return null;

  const probes: ProbeEntry[] = target.payloads.map((payload) => ({
    payload,
    ...(isRetrievedDocument(payload) ? { channel: 'retrieved' as const } : {}),
  }));

  const { results } = runProbes(deployment, probes, defences);

  return {
    suiteId,
    total: results.length,
    blocked: results.filter((result) => !result.bypassed).length,
    cost: defenceCost(defences),
  };
}

/**
 * Whether a suite payload is written as something the system retrieved.
 *
 * Suite payloads carry their channel in their own text: a document has a
 * document header, rather than in a separate field, so that a student reading
 * the suite before choosing defences can see exactly what is being sent and
 * where. Guessing from the text would be fragile; these are fixed strings in
 * committed content, and the marker is part of the payload's meaning.
 */
function isRetrievedDocument(payload: string): boolean {
  return /retrieved (policy )?document|--- RMG-POL-/i.test(payload);
}

/**
 * The post-mortem for a model.
 *
 * Released only once a student has committed a submission, on the same terms as
 * the worked solution and the triage debrief: being told which control is
 * missing before you have looked teaches nothing about looking.
 */
export function postMortemFor(modelId: string): string | null {
  return deploymentFor(modelId)?.postMortem ?? null;
}

/**
 * The defences a deployment actually had, for the debrief only.
 *
 * The single function in this codebase that returns the Model Lab answer key,
 * named so that any call site is obvious in review. Callers must gate it behind
 * a completed submission exactly as `debriefFor()` is gated.
 */
export function defencesForDebrief(modelId: string): DefenceId[] {
  return deploymentFor(modelId)?.defences ?? [];
}
