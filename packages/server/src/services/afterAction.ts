/**
 * Building the after-action review.
 *
 * TWO HALVES, AND ONLY ONE OF THEM VARIES
 *
 * What the attacker did is fixed. The intrusion ran the same way whether the
 * floor caught it in nine minutes or missed it entirely, so that half is
 * authored once as `ScenarioTruth.narrative` and read back verbatim.
 *
 * How it was worked is computed from what the team actually did. That half
 * writes itself from the claims, which means it is right every time and costs
 * nothing per scenario. It is also the half worth reading: a floor already knows
 * what it did, and what it cannot see is the gap between that and what was
 * available.
 *
 * WHY THE ADVICE IS DERIVED RATHER THAN AUTHORED
 *
 * An authored list of lessons is a list of lessons for the average floor, and
 * no floor is average. Every improvement here is triggered by something that
 * happened in THIS run: an event nobody took, a seat that claimed out of lane,
 * a dismissal reached in nine seconds with nothing opened. A floor that did not
 * make the mistake is not told about it, which is what keeps the list short
 * enough to act on.
 */

import type {
  AfterActionReview,
  Claim,
  IdealStep,
  Improvement,
  InvestigationTrace,
  LeadReadout,
  ScenarioDifficulty,
  SocRoleId,
} from '@soc/shared';
import { CLAIM_GRACE_SECONDS, CLAIM_LATE_SECONDS } from '@soc/shared';

import { getScenario, truthFor, closeState } from './scenarios.js';

export interface ReviewInput {
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  claims: Claim[];
  /** Keyed by eventId, for the seats that recorded one. */
  traces?: Record<string, InvestigationTrace>;
  readout: LeadReadout;
  filedReports: SocRoleId[];
  controlProposedAtSeconds: number | null;
  closedAtSeconds: number | null;
  lastReportAtSeconds?: number | null;
}

function firstClaimByEvent(claims: Claim[]): Map<string, Claim> {
  const first = new Map<string, Claim>();
  for (const claim of claims) {
    const held = first.get(claim.eventId);
    if (!held || claim.atSeconds < held.atSeconds) first.set(claim.eventId, claim);
  }
  return first;
}

export function buildAfterAction(input: ReviewInput): AfterActionReview | null {
  const scenario = getScenario(input.scenarioId);
  const truth = truthFor(input.scenarioId);
  if (!scenario || !truth) return null;

  const expert = input.difficulty === 'expert';
  const first = firstClaimByEvent(input.claims);
  const actionLabel = (id: string) =>
    scenario.actions.find((a) => a.id === id)?.label ?? id;

  /* --- how it should have gone ------------------------------------------ */

  const ideal: IdealStep[] = [];
  for (const entry of truth.events) {
    const event = scenario.events.find((e) => e.id === entry.eventId)!;
    // An event this run never put on a board cannot be a step this run missed.
    const shown = expert ? !event.withheldAtExpert : !event.expertOnly;
    const claim = first.get(entry.eventId) ?? null;

    let actual: IdealStep['actual'];
    if (!shown) {
      actual = 'not-shown';
    } else if (!claim) {
      actual = 'missed';
    } else {
      const treatedAsThreat = claim.disposition === 'escalate' || claim.disposition === 'investigate';
      const shouldTreat = entry.verdict === 'malicious' || entry.verdict === 'blocked-reconnaissance';
      // An unsettled event has no correct read, so taking it at all counts.
      const read = entry.verdict === 'ambiguous' || treatedAsThreat === shouldTreat;
      const waited = claim.atSeconds - event.atSeconds;
      actual = !read ? 'misread' : waited > CLAIM_LATE_SECONDS ? 'late' : 'caught';
    }

    ideal.push({
      eventId: entry.eventId,
      atSeconds: event.atSeconds,
      owner: entry.firstResponder,
      what: entry.why,
      // The move is the correct action for the owning seat, plus the command
      // shape where the scenario defines one. Both come from truth, so the
      // ideal run cannot describe a step the scoring would not have credited.
      move:
        [
          entry.commandOptions?.find((o) => o.correct)?.command,
          entry.correctActions.map(actionLabel).join('; ') || null,
        ]
          .filter(Boolean)
          .join('  then  ') || 'No action required beyond reading it correctly.',
      actual,
      afterSeconds: claim ? Math.max(0, claim.atSeconds - event.atSeconds) : null,
    });
  }

  /* --- what to do differently -------------------------------------------- */

  const improvements: Improvement[] = [];
  const onBoard = ideal.filter((s) => s.actual !== 'not-shown');

  const missed = onBoard.filter((s) => s.actual === 'missed');
  if (missed.length > 0) {
    improvements.push({
      observed: `${missed.length} event(s) reached a board and nobody claimed them.`,
      instead:
        'An unclaimed event is not a quiet event, it is one nobody looked at. When your own board ' +
        'goes quiet, say so out loud rather than waiting: the lead cannot redistribute work they ' +
        'do not know is sitting there.',
      eventIds: missed.map((s) => s.eventId),
      forRoles: [...new Set(missed.map((s) => s.owner))],
    });
  }

  const misread = onBoard.filter((s) => s.actual === 'misread');
  if (misread.length > 0) {
    improvements.push({
      observed: `${misread.length} event(s) were claimed and read the wrong way round.`,
      instead:
        'Before committing, ask what would have to be true for the opposite reading to be right, ' +
        'and whether you have checked it. Most wrong dispositions on this floor are reached by ' +
        'confirming a first impression rather than testing it.',
      eventIds: misread.map((s) => s.eventId),
      forRoles: [...new Set(misread.map((s) => first.get(s.eventId)!.role))],
    });
  }

  const late = onBoard.filter((s) => s.actual === 'late');
  if (late.length > 0) {
    improvements.push({
      observed: `${late.length} event(s) sat for more than ${Math.round(CLAIM_LATE_SECONDS / 60)} minutes before anybody took them.`,
      instead:
        'Claim early and revise. A claim is a statement of who is working something, not a final ' +
        'answer, and an event with nobody on it is invisible to the rest of the floor.',
      eventIds: late.map((s) => s.eventId),
      forRoles: [],
    });
  }

  // Lane violations: somebody took an event that was not theirs.
  const outOfLane = input.claims.filter((c) => {
    const entry = truth.events.find((e) => e.eventId === c.eventId);
    return entry ? entry.firstResponder !== c.role && !entry.alsoAppropriate.includes(c.role) : false;
  });
  if (outOfLane.length > 0) {
    improvements.push({
      observed: `${outOfLane.length} claim(s) were made on events belonging to another seat.`,
      instead:
        'Working somebody else queue leaves yours unwatched, and two people on one event is one ' +
        'event nobody is on. If you can see something outside your lane, say it to the seat that ' +
        'owns it rather than taking it.',
      eventIds: [...new Set(outOfLane.map((c) => c.eventId))],
      forRoles: [...new Set(outOfLane.map((c) => c.role))],
    });
  }

  // Committed without opening anything. Only counted where a trace exists.
  const blind = Object.entries(input.traces ?? {}).filter(
    ([, t]) => t.commandCount === 0 && t.opened.length === 0 && t.secondsSpent < 30,
  );
  if (blind.length > 0) {
    improvements.push({
      observed: `${blind.length} claim(s) were committed in under thirty seconds with no evidence opened.`,
      instead:
        'If the call was right it was right by recognition rather than by checking, and recognition ' +
        'does not transfer to the scenario you have not seen. Open one thing before you commit, ' +
        'even when you are sure.',
      eventIds: blind.map(([id]) => id),
      forRoles: [],
    });
  }

  // Overconfidence, which is the habit expert difficulty exists to break.
  const cocky = input.claims.filter((c) => {
    const entry = truth.events.find((e) => e.eventId === c.eventId);
    if (!entry) return false;
    const treatedAsThreat = c.disposition === 'escalate' || c.disposition === 'investigate';
    const shouldTreat = entry.verdict === 'malicious' || entry.verdict === 'blocked-reconnaissance';
    if (entry.verdict === 'ambiguous') return c.confidence > 70;
    return c.confidence > 80 && treatedAsThreat !== shouldTreat;
  });
  if (cocky.length > 0) {
    improvements.push({
      observed: `${cocky.length} claim(s) were held at high confidence that the evidence did not support.`,
      instead:
        'State a confidence that matches what you actually established, and say what would change ' +
        'it. A floor commits to the wrong containment when somebody sounds certain, so certainty ' +
        'is a thing you spend rather than a thing you project.',
      eventIds: cocky.map((c) => c.eventId),
      forRoles: [...new Set(cocky.map((c) => c.role))],
    });
  }

  if (input.readout.missingReports.length > 0) {
    improvements.push({
      observed: `${input.readout.missingReports.length} seat(s) closed without filing a report.`,
      instead:
        'An unwritten finding is a finding the organisation does not have. The report is the ' +
        'artefact that outlives the shift, and a seat that found nothing still owes the sentence ' +
        'saying so.',
      eventIds: [],
      forRoles: input.readout.missingReports,
    });
  }

  if (input.controlProposedAtSeconds === null) {
    improvements.push({
      observed: 'No control was proposed.',
      instead:
        'An incident is not over because the attacker stopped. It is over when somebody has changed ' +
        'something so the same route does not work twice, and naming that is part of the response ' +
        'rather than follow-up work.',
      eventIds: [],
      forRoles: ['detection-engineer', 'ir-lead'],
    });
  }

  /* --- the findings that decided it -------------------------------------- */

  const criticalFindings = truth.events
    .filter((e) => e.critical)
    .map((e) => ({
      eventId: e.eventId,
      what: e.why,
      caught: ideal.find((s) => s.eventId === e.eventId)?.actual === 'caught',
    }));

  const close = closeState(
    input.scenarioId,
    input.claims,
    input.filedReports,
    input.controlProposedAtSeconds,
    input.closedAtSeconds,
    input.lastReportAtSeconds ?? null,
  );

  /* --- the paragraph at the top ------------------------------------------ */

  const caught = onBoard.filter((s) => s.actual === 'caught').length;
  const parts: string[] = [`${caught} of ${onBoard.length} events on the board were caught and read correctly.`];

  const missedCritical = criticalFindings.filter((c) => !c.caught);
  if (criticalFindings.length > 0) {
    parts.push(
      missedCritical.length === 0
        ? 'Every finding that decided this incident was reached.'
        : `${missedCritical.length} of the findings that decided this incident were not reached, which ` +
          'matters more than the count above: an intrusion does not need every stage to be missed ' +
          'to succeed.',
    );
  }
  if (improvements.length === 0) {
    parts.push('Nothing in this run suggests a specific change. That is rare and worth noting.');
  } else {
    parts.push(`${improvements.length} specific thing(s) to do differently, below.`);
  }

  return {
    scenarioId: input.scenarioId,
    difficulty: input.difficulty,
    whatHappened: truth.narrative,
    readout: input.readout,
    ideal,
    improvements,
    criticalFindings,
    timings: {
      detectSeconds: close?.timings.detectSeconds ?? null,
      analyseSeconds: close?.timings.analyseSeconds ?? null,
      correctSeconds: close?.timings.correctSeconds ?? null,
    },
    summary: parts.join(' '),
  };
}

/**
 * Whether the review may be shown yet.
 *
 * The lead reads out findings and mitigations, the ops stops, the floor talks,
 * and only then does the system say its piece. Releasing the model answer
 * before the floor has committed to its own account means they remember the
 * model answer, and arriving at one together on incomplete information is the
 * thing being practised.
 */
export function reviewIsAvailable(input: {
  closedAtSeconds: number | null;
  readoutDelivered: boolean;
}): { ready: boolean; waitingOn: string | null } {
  if (input.closedAtSeconds === null) {
    return { ready: false, waitingOn: 'The lead has not closed the operation yet.' };
  }
  if (!input.readoutDelivered) {
    return {
      ready: false,
      waitingOn: 'The lead has not read out findings and mitigations yet. That comes first.',
    };
  }
  return { ready: true, waitingOn: null };
}

/** Grace and late thresholds are re-exported so a UI can label its own timings. */
export { CLAIM_GRACE_SECONDS, CLAIM_LATE_SECONDS };
