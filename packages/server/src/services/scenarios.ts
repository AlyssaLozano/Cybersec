/**
 * Scoring a claim on a live scenario.
 *
 * THE RULE THIS MODULE EXISTS TO ENFORCE
 *
 * `ScenarioTruth` is an answer key. A student who can read it knows which
 * events matter before working any of them, which is the entire exercise. So
 * truth is reached only through `truthFor()`, the student-facing surface is
 * built by `eventsFor()`, and no route calls the first before a claim is
 * committed. Same arrangement as `alerts.ts` and `copilot.ts`.
 *
 * WHY FOUR SCORES AND NOT ONE
 *
 * A single number cannot separate "you were wrong about the threat" from "you
 * were right but it was not your event to take". Those are different failures
 * with different fixes: one is knowledge, the other is discipline. A team that
 * is individually excellent and collectively chaotic scores well on accuracy
 * and badly on lane, and it should be able to see that.
 *
 * WHY BEING CONFIDENTLY WRONG COSTS MORE
 *
 * Confidence is not a fifth score, it is a multiplier on the accuracy line. A
 * SOC that says "90% sure this is nothing" and is wrong has done more damage
 * than one that says "40% sure, escalating anyway". Rewarding hedging would be
 * its own problem, so being confidently RIGHT pays more too.
 */

import type {
  Claim,
  ClaimScore,
  ClaimScoreLine,
  EventTruth,
  Scenario,
  ScenarioEvent,
  ScenarioTruth,
  SocRoleId,
  TriageDecision,
} from '@soc/shared';
import { CLAIM_GRACE_SECONDS, CLAIM_LATE_SECONDS } from '@soc/shared';

import { SCENARIOS, SCENARIO_TRUTH } from '../content/scenarios/index.js';

const BY_ID = new Map(SCENARIOS.map((s) => [s.id, s]));
const TRUTH_BY_ID = new Map(SCENARIO_TRUTH.map((t) => [t.scenarioId, t]));

export function getScenario(scenarioId: string): Scenario | null {
  return BY_ID.get(scenarioId) ?? null;
}

/**
 * Events visible to one seat, at one point in the shift.
 *
 * Two filters, both deliberate. `atSeconds` withholds what has not happened
 * yet, because a queue that arrives all at once removes the time pressure the
 * hour exists to create. `surface` withholds what this seat could not see: a
 * cloud audit entry never reaches the alert queue, so a SOC Operator has to be
 * told about it by somebody, which is the point.
 */
export function eventsFor(
  scenarioId: string,
  role: SocRoleId,
  atSeconds: number,
): ScenarioEvent[] {
  const scenario = BY_ID.get(scenarioId);
  if (!scenario) return [];
  const surfaces = SURFACES_BY_ROLE[role] ?? [];
  return scenario.events.filter(
    (event) => event.atSeconds <= atSeconds && surfaces.includes(event.surface),
  );
}

/**
 * Which surfaces each seat can see.
 *
 * This is the projection that makes the room necessary. No role sees every
 * surface, so no role can reconstruct the incident alone.
 */
const SURFACES_BY_ROLE: Record<string, string[]> = {
  'soc-operator': ['alert-queue'],
  'log-analyst': ['alert-queue', 'raw-log', 'process-tree'],
  'network-analyst': ['alert-queue', 'network-flow'],
  'malware-analyst': ['process-tree', 'host-artefact'],
  forensics: ['host-artefact', 'raw-log'],
  'cloud-security': ['cloud-audit', 'alert-queue'],
  'threat-intel': ['alert-queue', 'network-flow'],
  'ai-security': ['alert-queue', 'process-tree'],
  'ir-lead': ['alert-queue', 'raw-log', 'network-flow', 'cloud-audit', 'process-tree', 'host-artefact'],
  'vulnerability-analyst': ['alert-queue', 'host-artefact'],
};

/** The answer key. Never call this from a route before a claim is committed. */
export function truthFor(scenarioId: string): ScenarioTruth | null {
  return TRUTH_BY_ID.get(scenarioId) ?? null;
}

function eventTruth(scenarioId: string, eventId: string): EventTruth | null {
  return truthFor(scenarioId)?.events.find((e) => e.eventId === eventId) ?? null;
}

/**
 * The coaching line for an event, if this scenario is allowed to give one.
 *
 * WHY DIFFICULTY GATES THIS AND NOT THE AUTHOR
 *
 * "The monitoring collector produces more failures than the attacker. Counting
 * is not triage." is a good line to read at beginner and a spoiler at
 * intermediate: it names the decoy, states the lesson, and points at the
 * address that mattered. A student who is meant to be learning to find that
 * themselves has just been told.
 *
 * Authors will keep writing these, because explaining is the instinct. So the
 * gate lives here rather than in a style rule nobody enforces, and a scenario
 * above beginner cannot emit one even if its content defines it.
 */
export function guidanceFor(scenarioId: string, eventId: string): string | null {
  const scenario = BY_ID.get(scenarioId);
  if (!scenario || scenario.difficulty !== 'beginner') return null;
  return eventTruth(scenarioId, eventId)?.guidance ?? null;
}

/**
 * Which dispositions treat an event as worth somebody's time.
 *
 * `tune` counts as not-a-threat on purpose: raising a tuning ticket is what you
 * do about a rule that keeps crying wolf, and it is the correct answer for the
 * monitoring-collector noise.
 */
function treatsAsThreat(decision: TriageDecision): boolean {
  return decision === 'escalate' || decision === 'investigate';
}

/**
 * Score one claim.
 *
 * Four lines out of 100. Accuracy carries the most weight because being wrong
 * about the threat is the failure that ends in a breach, but lane discipline is
 * weighted heavily enough that a floor of individually brilliant people who all
 * grab the same event cannot score well.
 */
export function scoreClaim(scenarioId: string, claim: Claim): ClaimScore | null {
  const scenario = BY_ID.get(scenarioId);
  const truth = eventTruth(scenarioId, claim.eventId);
  if (!scenario || !truth) return null;

  const lines: ClaimScoreLine[] = [];
  let laneViolation: SocRoleId | null = null;

  // --- 1. accuracy, weighted by how confident they were -----------------
  const shouldTreatAsThreat =
    truth.verdict === 'malicious' || truth.verdict === 'blocked-reconnaissance';
  const calledItAThreat = treatsAsThreat(claim.disposition);
  const correct = calledItAThreat === shouldTreatAsThreat;
  const notes: string[] = [];

  // Confidence scales the result in both directions: conviction is rewarded
  // when it is earned and punished when it is not.
  const conviction = Math.max(0, Math.min(100, claim.confidence)) / 100;
  let accuracy = correct ? 25 + Math.round(conviction * 15) : Math.round((1 - conviction) * 14);
  if (correct) {
    notes.push(
      shouldTreatAsThreat
        ? 'Identified real malicious activity.'
        : 'Correctly declined to escalate something that did not warrant it.',
    );
    if (conviction < 0.5) notes.push('Right call, held with less confidence than it deserved.');
  } else {
    notes.push(
      shouldTreatAsThreat
        ? 'This was a genuine threat and the claim treated it as benign.'
        : 'This did not warrant escalation. Escalating everything is the same as triaging nothing.',
    );
    if (conviction > 0.7) notes.push('Held with high confidence, which is what makes it expensive.');
  }
  // An empty justification cannot be assessed, whatever it concluded.
  if (claim.reasoning.trim().length < 40) {
    accuracy = Math.min(accuracy, 12);
    notes.push('Too short to show reasoning. A disposition without a why is not triage.');
  }
  lines.push({ label: 'Accuracy', points: accuracy, outOf: 40, notes });

  // --- 2. role discipline ------------------------------------------------
  const roleNotes: string[] = [];
  let discipline = 0;
  const isFirstResponder = truth.firstResponder === claim.role;
  const isAlsoAppropriate = truth.alsoAppropriate.includes(claim.role);

  if (isFirstResponder) {
    discipline += 15;
    roleNotes.push('Correct seat to take this first.');
  } else if (isAlsoAppropriate) {
    discipline += 9;
    roleNotes.push(
      `Appropriate seat, but ${truth.firstResponder} should have had it first and escalated to you.`,
    );
    laneViolation = truth.firstResponder;
  } else {
    roleNotes.push(
      `This is not your event. ${truth.firstResponder} owns it. Working somebody else's queue leaves yours unwatched.`,
    );
    laneViolation = truth.firstResponder;
  }

  const overreach = claim.actionIds.filter((id) => truth.outOfLaneActions.includes(id));
  const inLane = claim.actionIds.filter((id) => truth.correctActions.includes(id));
  discipline += Math.min(10, inLane.length * 5);
  if (inLane.length > 0) roleNotes.push(`${inLane.length} action(s) correct for this seat.`);
  if (overreach.length > 0) {
    discipline = Math.max(0, discipline - overreach.length * 6);
    const labels = overreach
      .map((id) => scenario.actions.find((a) => a.id === id)?.label ?? id)
      .join('; ');
    roleNotes.push(`Doing another role's job: ${labels}.`);
  }
  lines.push({ label: 'Role discipline', points: Math.min(25, discipline), outOf: 25, notes: roleNotes });

  // --- 3. timing ---------------------------------------------------------
  const event = scenario.events.find((e) => e.id === claim.eventId)!;
  const waited = Math.max(0, claim.atSeconds - event.atSeconds);
  let timing: number;
  const timingNotes: string[] = [];
  if (waited <= CLAIM_GRACE_SECONDS) {
    timing = 15;
    timingNotes.push(`Claimed ${waited}s after it landed.`);
  } else if (waited >= CLAIM_LATE_SECONDS) {
    timing = 0;
    timingNotes.push(`Sat for ${Math.round(waited / 60)} minutes. The queue moved on without you.`);
  } else {
    const span = CLAIM_LATE_SECONDS - CLAIM_GRACE_SECONDS;
    timing = Math.round(15 * (1 - (waited - CLAIM_GRACE_SECONDS) / span));
    timingNotes.push(`Claimed after ${Math.round(waited / 60)} minutes.`);
  }
  lines.push({ label: 'Timing', points: timing, outOf: 15, notes: timingNotes });

  // --- 4. escalation -----------------------------------------------------
  const escNotes: string[] = [];
  let escalation = 0;
  if (truth.escalateTo.length === 0) {
    // Nothing to hand on. Not passing it anywhere is the right answer.
    escalation = claim.escalateTo === null ? 20 : 10;
    escNotes.push(
      claim.escalateTo === null
        ? 'Correctly stops here. Not everything needs passing on.'
        : 'Escalated something that ends with you, which costs somebody else a look.',
    );
  } else if (claim.escalateTo && truth.escalateTo.includes(claim.escalateTo)) {
    escalation = 20;
    escNotes.push(`Correctly handed to ${claim.escalateTo}.`);
  } else if (claim.escalateTo) {
    escalation = 6;
    escNotes.push(`Wrong next seat. This needed ${truth.escalateTo.join(' or ')}.`);
  } else {
    escNotes.push(`Not escalated. This needed ${truth.escalateTo.join(' or ')}.`);
  }
  lines.push({ label: 'Escalation', points: escalation, outOf: 20, notes: escNotes });

  const total = lines.reduce((sum, l) => sum + l.points, 0);
  return {
    eventId: claim.eventId,
    role: claim.role,
    lines,
    total,
    outOf: 100,
    laneViolation,
    why: truth.why,
  };
}
