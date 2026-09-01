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
  InvestigationNote,
  InvestigationTrace,
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
 * What a seat is told when they sit down, before anything happens.
 *
 * WHY THIS IS NOT A HINT
 *
 * Telling somebody what their job is and where to look is orientation. Telling
 * them what they will find is a spoiler. A real analyst arrives knowing their
 * remit and their tooling and knowing nothing about tonight, and that is
 * exactly the line this draws: the brief names the surfaces, the questions the
 * role exists to answer, and who they hand to. It never names an event.
 *
 * It is also DERIVED rather than authored, so it cannot drift. The surfaces
 * come from the same table the projection uses, so a brief can never promise a
 * seat something the projection will not give them.
 */
export interface SeatBriefing {
  role: SocRoleId;
  title: string;
  /** One line on what this seat is for. */
  remit: string;
  /** The consoles they have, named the way the UI names them. */
  surfaces: string[];
  /** What to be asking, not what the answer is. */
  questions: string[];
  /** Who normally receives their findings. */
  handsTo: SocRoleId[];
  /** How many events will reach this seat over the shift. */
  expectedEvents: number;
}

const SURFACE_LABELS: Record<string, string> = {
  'alert-queue': 'Alert queue',
  'raw-log': 'Raw logs',
  'network-flow': 'Connection flows',
  'cloud-audit': 'Cloud audit trail',
  'process-tree': 'Process tree',
  'host-artefact': 'Host artefacts',
};

const REMIT: Record<string, { remit: string; questions: string[]; handsTo: SocRoleId[] }> = {
  'soc-operator': {
    remit: 'First read on everything the tooling raises. Decide what deserves a human, quickly.',
    questions: [
      'Is this real, or is it a rule that cries wolf? Check the firing history before the content.',
      'Does anything here share a source, an account, or a five-minute window with anything else?',
      'If you escalate everything you have triaged nothing. What are you willing to close?',
    ],
    handsTo: ['log-analyst', 'ir-lead'],
  },
  'log-analyst': {
    remit: 'Build the timeline. Establish what happened, in order, and what the logs do not prove.',
    questions: [
      'What is the earliest event you can stand behind, as opposed to the earliest you suspect?',
      'What happened in the seconds after a success? That is usually where persistence lands.',
      'Which of your claims rests on one source, and can you corroborate it in a second one?',
    ],
    handsTo: ['ir-lead', 'forensics'],
  },
  'network-analyst': {
    remit: 'Answer what is talking to what, and whether it should be.',
    questions: [
      'Direction first. Inbound noise and outbound contact are not the same finding.',
      'Is this path in the baseline? A connection is only unusual against what is usual.',
      'Can you prove anything left? If you cannot prove it either way, say neither.',
    ],
    handsTo: ['ir-lead', 'threat-intel'],
  },
  'malware-analyst': {
    remit: 'Determine what a payload actually does, and what it would do next.',
    questions: [
      'Decoding it is the easy half. What capability does the decoded thing actually have?',
      'Is the payload in the command, or does the command fetch it? Those are different problems.',
      'How would you capture the stage you cannot see?',
    ],
    handsTo: ['ir-lead', 'forensics'],
  },
  forensics: {
    remit: 'Preserve what proves it, in an order that does not destroy what comes next.',
    questions: [
      'What disappears first? Collect in order of volatility, not order of convenience.',
      'What is the timestamp relationship between artefacts? That is usually the finding.',
      'Would this survive somebody rebuilding the host in an hour?',
    ],
    handsTo: ['ir-lead'],
  },
  'cloud-security': {
    remit: 'Everything is an API call and an identity. Work out which principal did what, from where.',
    questions: [
      'Did this principal ever do this before? A first use of a permission is the signal.',
      'Where did the call come from? Inside the estate and from the scheduler are different answers.',
      'Is this administration that looks like an attack, or an attack that looks like administration?',
    ],
    handsTo: ['ir-lead'],
  },
  'threat-intel': {
    remit: 'Map the tradecraft. Say what it resembles and be explicit about what you are not claiming.',
    questions: [
      'Which techniques can you map, and which are you inferring?',
      'What would you have to see to move from resembles to is?',
      'What are you deliberately not attributing, and why?',
    ],
    handsTo: ['ir-lead'],
  },
  'ai-security': {
    remit: 'Validate that the detection stack itself was not evaded or fooled.',
    questions: [
      'What did the tooling miss, and is that a gap or a blind spot?',
      'Is there evidence anybody tried to evade detection rather than just avoid it?',
      'Can the monitoring still be trusted while the estate is compromised?',
    ],
    handsTo: ['ir-lead'],
  },
  'vulnerability-analyst': {
    remit: 'Work out whether the way in is a one-off or a class of problem across the estate.',
    questions: [
      'Is this a CVE or a practice? Those get fixed by completely different work.',
      'How many other hosts have the same exposure right now?',
      'What can actually be changed this week, as opposed to what should be?',
    ],
    handsTo: ['ir-lead'],
  },
  'ir-lead': {
    remit: 'Decide. Pace the floor, adjudicate disagreements, and own the call on incomplete information.',
    questions: [
      'Do several seats independently point the same way, or is one seat loud?',
      'What is the cost of declaring, and what is the cost of waiting another ten minutes?',
      'Who has not reported, and is that because they found nothing or because they are stuck?',
    ],
    handsTo: [],
  },
};

/**
 * Build a seat's opening brief.
 *
 * Returns null for a role the scenario has not seated, because briefing
 * somebody for a chair they are not in is its own kind of confusing.
 */
export function briefingFor(scenarioId: string, role: SocRoleId): SeatBriefing | null {
  const scenario = BY_ID.get(scenarioId);
  if (!scenario || !scenario.roles.includes(role)) return null;
  const spec = REMIT[role];
  if (!spec) return null;

  return {
    role,
    title: role,
    remit: spec.remit,
    // Derived from the projection table, so a brief cannot promise a console
    // the seat will not actually be given.
    surfaces: (SURFACES_BY_ROLE[role] ?? []).map((s) => SURFACE_LABELS[s] ?? s),
    questions: spec.questions,
    handsTo: spec.handsTo,
    expectedEvents: eventsFor(scenarioId, role, Number.MAX_SAFE_INTEGER).length,
  };
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
 * Events two seats read differently.
 *
 * WHY DISAGREEMENT IS ROUTED UP RATHER THAN RESOLVED
 *
 * Two operators working one queue will sometimes reach opposite dispositions on
 * the same alert, and that is not a bug in either of them. One dismissed a
 * blocked scan as noise and one escalated it as reconnaissance; both can give
 * you a defensible account. Resolving it automatically, or letting the second
 * claim overwrite the first, throws away the most useful thing on the floor.
 *
 * So a contested event goes to the lead with both readings attached. That is
 * the lead's actual job, and it is the one decision on the board that cannot be
 * made by any single seat.
 *
 * Note this is deliberately not scored as a failure for either seat. They are
 * each scored against ground truth independently; being outvoted is not being
 * wrong, and being agreed with is not being right.
 */
export interface ContestedEvent {
  eventId: string;
  readings: Array<{
    role: SocRoleId;
    disposition: TriageDecision;
    reasoning: string;
    confidence: number;
  }>;
}

export function contestedEvents(claims: Claim[]): ContestedEvent[] {
  const byEvent = new Map<string, Claim[]>();
  for (const claim of claims) {
    const list = byEvent.get(claim.eventId) ?? [];
    list.push(claim);
    byEvent.set(claim.eventId, list);
  }

  const contested: ContestedEvent[] = [];
  for (const [eventId, group] of byEvent) {
    if (group.length < 2) continue;
    // Two seats agreeing is not contested, however many of them there are.
    if (new Set(group.map((c) => c.disposition)).size < 2) continue;
    contested.push({
      eventId,
      readings: group.map((c) => ({
        role: c.role,
        disposition: c.disposition,
        reasoning: c.reasoning,
        confidence: c.confidence,
      })),
    });
  }
  return contested;
}

/**
 * Say how a claim was reached, without scoring it.
 *
 * The four score lines are blind to method. A correct dismissal reached in nine
 * seconds with no commands and one reached after checking the rule history are
 * the same disposition and the same number. This is the only place the
 * difference is visible, and it is the difference between a habit and a guess.
 *
 * Deliberately does not reward volume. Somebody who runs one precise grep has
 * investigated; somebody who runs nine has not necessarily investigated more.
 */
export function describeInvestigation(
  trace: InvestigationTrace,
  claim: Claim,
): InvestigationNote {
  const looked = trace.commandCount > 0 || trace.opened.length > 0;
  if (!looked) {
    const fast = trace.secondsSpent < 20;
    return {
      looked: false,
      note: fast
        ? 'Committed in under twenty seconds without opening any evidence. If the call was right, ' +
          'it was right by recognition rather than by checking, and recognition does not transfer ' +
          'to the scenario you have not seen.'
        : 'No evidence opened before committing. The disposition may be sound; nothing here shows ' +
          'how it was reached.',
    };
  }
  const where = trace.opened.length > 0 ? ` Opened: ${trace.opened.join(', ')}.` : '';
  return {
    looked: true,
    note:
      `Checked the evidence before committing: ${trace.commandCount} command(s) over ` +
      `${Math.round(trace.secondsSpent)}s.${where}`,
  };
}

/**
 * Score one claim.
 *
 * Four lines out of 100. Accuracy carries the most weight because being wrong
 * about the threat is the failure that ends in a breach, but lane discipline is
 * weighted heavily enough that a floor of individually brilliant people who all
 * grab the same event cannot score well.
 */
export function scoreClaim(
  scenarioId: string,
  claim: Claim,
  trace?: InvestigationTrace,
): ClaimScore | null {
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
    ...(trace ? { investigation: describeInvestigation(trace, claim) } : {}),
    why: truth.why,
  };
}
