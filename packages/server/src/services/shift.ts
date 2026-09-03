/**
 * Running a shift: the loop that turns a seated room into a played scenario.
 *
 * WHAT WAS MISSING BEFORE THIS
 *
 * Everything up to the moment the exercise begins existed. A room could be
 * scheduled against any scenario, seated, handed over and checked for
 * readiness, and the engine underneath -- the per-seat projection, the truth,
 * the scoring, the after action review -- was built and tested. There was no
 * way to start one. This is that join.
 *
 * THE CLOCK IS THE ROOM'S, NOT THE VIEWER'S
 *
 * Elapsed time runs from the room's `startsAt`, which is the same instant for
 * everybody in it. That matters more than it sounds: a floor where two seats
 * disagree about what time it is cannot correlate anything, and the whole
 * design rests on several people describing one moment from different
 * surfaces. It also means somebody who joins late arrives to a board that has
 * already moved, which is what walking onto a live floor is actually like.
 *
 * NOTHING HERE READS TRUTH
 *
 * Every function in this file works from the scenario as a student sees it.
 * The answer key is reached only by `scoreClaim`, and only after a claim is
 * committed, which is the same rule the terminal exercises follow: a board
 * that can be inspected for the answer is not an exercise.
 */

import type {
  Claim,
  LeadReadout,
  RoomSession,
  ScenarioAction,
  ScenarioEvent,
  SocRoleId,
  TriageDecision,
} from '@soc/shared';

import { RoomError } from './rooms.js';
import {
  briefingFor,
  eventsFor,
  getScenario,
  guidanceFor,
  terminalAidFor,
  type SeatBriefing,
  type TerminalAid,
} from './scenarios.js';

/**
 * How long a room stays open for seating after its start time.
 *
 * A room that can never be started late is a room that is wasted every time
 * somebody's meeting overruns, and one that can be started at any point is a
 * room where half the events have already happened before anybody sits down.
 */
export const LATE_START_GRACE_MINUTES = 20;

/** Seconds elapsed in the scenario, from the room's own start time. */
export function elapsedSeconds(room: RoomSession, now: Date): number {
  const started = new Date(room.startsAt).getTime();
  return Math.max(0, Math.floor((now.getTime() - started) / 1000));
}

/**
 * Whether the shift can be started, and by whom.
 *
 * Only the lead starts it. Not for ceremony: the lead is the seat that has to
 * be filled for a room to run at all, so tying the start to that chair means a
 * room cannot begin without the one person whose absence would make it
 * pointless.
 */
export function canStart(
  room: RoomSession,
  userId: string,
  now: Date,
): { ok: true } | { ok: false; reason: string } {
  if (room.status === 'running') return { ok: false, reason: 'This shift is already running.' };
  if (room.status === 'complete') return { ok: false, reason: 'This shift is over.' };
  if (room.status === 'cancelled') return { ok: false, reason: 'This room was cancelled.' };

  const lead = room.seats.find((s) => s.role === 'ir-lead');
  if (!lead?.occupant) {
    return { ok: false, reason: 'Nobody is in the incident lead chair, so the shift cannot start.' };
  }
  if (lead.occupant.userId !== userId) {
    return { ok: false, reason: `Only the incident lead starts the shift. That is ${lead.occupant.callSign}.` };
  }

  const startsAt = new Date(room.startsAt).getTime();
  const graceEnds = startsAt + LATE_START_GRACE_MINUTES * 60_000;
  if (now.getTime() > graceEnds) {
    return {
      ok: false,
      reason: `This room was scheduled for ${room.startsAt} and the ${LATE_START_GRACE_MINUTES} minute window has passed. Schedule another.`,
    };
  }
  return { ok: true };
}

export function startShift(room: RoomSession, userId: string, now: Date): RoomSession {
  const check = canStart(room, userId, now);
  if (!check.ok) throw new RoomError(check.reason);
  return { ...room, status: 'running' };
}

/**
 * One seat's screen.
 *
 * This is the whole of what a person at that desk can see, and it is
 * deliberately not a filtered view of a larger object the client also holds.
 * The projection happens here and the rest never leaves the server, because a
 * board assembled in the browser is a board a student can read the other seats
 * out of.
 */
export interface SeatBoard {
  role: SocRoleId;
  elapsedSeconds: number;
  /** Events that have arrived on this seat's surfaces, oldest first. */
  events: ScenarioEvent[];
  /** What this seat is for, and what it can see. Static for the run. */
  briefing: SeatBriefing | null;
  /** Event ids this seat has already claimed. */
  claimed: string[];
  /**
   * Actions this seat may attach to a claim.
   *
   * Every action the scenario declares, not only the ones in this seat's lane.
   * The out-of-lane ones are the point: a floor is taught what isolating a host
   * costs by being able to isolate it and being told, and a menu that offers
   * only correct choices teaches nothing and cannot be got wrong.
   */
  actions: ScenarioAction[];
  /** Seats on this floor a finding can be handed to. */
  escalateTo: SocRoleId[];
}

export function boardFor(
  room: RoomSession,
  role: SocRoleId,
  now: Date,
  claimedEventIds: string[] = [],
): SeatBoard {
  const elapsed = room.status === 'running' ? elapsedSeconds(room, now) : 0;
  return {
    role,
    elapsedSeconds: elapsed,
    // Before the shift starts the board is empty rather than pre-loaded: the
    // brief is readable while waiting, the incident is not.
    events: room.status === 'running' ? eventsFor(room.scenarioId, role, elapsed, room.difficulty) : [],
    briefing: briefingFor(room.scenarioId, role),
    claimed: claimedEventIds,
    actions: getScenario(room.scenarioId)?.actions ?? [],
    // Every other chair on this floor. Escalating to yourself is not a thing,
    // and a seat this scenario does not run cannot receive anything.
    escalateTo: room.seats.map((s) => s.role).filter((r) => r !== role),
  };
}

/**
 * What the seat is offered at the terminal for one event, and the nudge that
 * goes with it.
 *
 * Split from the board because it is per event and per tier, and because
 * `terminalAidFor` is the function that decides how much help this difficulty
 * gives. Calling it here keeps that decision in one place.
 */
export function aidFor(
  room: RoomSession,
  role: SocRoleId,
  eventId: string,
): TerminalAid | null {
  const scenario = getScenario(room.scenarioId);
  if (!scenario) return null;
  if (!scenario.roles.includes(role)) return null;
  return terminalAidFor(room.scenarioId, eventId, room.difficulty);
}

/** The hint this seat gets on this event, if the tier gives one. */
export function nudgeFor(
  room: RoomSession,
  role: SocRoleId,
  eventId: string,
): string | null {
  return guidanceFor(room.scenarioId, eventId, role, room.difficulty);
}

export interface ClaimInput {
  eventId: string;
  disposition: TriageDecision;
  reasoning: string;
  actionIds: string[];
  escalateTo: SocRoleId | null;
  confidence: number;
}

/**
 * Turn a submission into a claim, refusing the ones that are not legitimately
 * available to this seat.
 *
 * The checks are not paperwork. Claiming an event the seat cannot see would
 * let somebody grade an event they were never shown, and claiming one that has
 * not arrived yet would let a fast reader answer the incident before it
 * happens. Both are ways of getting a score without doing the exercise.
 */
export function buildClaim(
  room: RoomSession,
  role: SocRoleId,
  userId: string,
  input: ClaimInput,
  now: Date,
): Claim {
  if (room.status !== 'running') {
    throw new RoomError('The shift is not running.');
  }
  const seat = room.seats.find((s) => s.role === role);
  if (!seat) throw new RoomError(`This scenario has no ${role} seat.`);
  if (seat.occupant?.userId !== userId) {
    throw new RoomError('You can only claim from your own seat.');
  }

  const elapsed = elapsedSeconds(room, now);
  const visible = eventsFor(room.scenarioId, role, elapsed, room.difficulty);
  if (!visible.some((e) => e.id === input.eventId)) {
    // Covers both halves: an event on somebody else's surfaces, and one that
    // has not arrived yet. The message stays vague on purpose, because saying
    // which would tell the seat something about a board it cannot see.
    throw new RoomError('That event is not on your board.');
  }

  if (input.confidence < 0 || input.confidence > 100) {
    throw new RoomError('Confidence is a number from 0 to 100.');
  }
  if (input.reasoning.trim().length < 10) {
    // The reasoning is what the debrief reads back and what separates a
    // decision from a guess. A one-word claim is not a claim.
    throw new RoomError('Say why, in a sentence. The review reads this back to you.');
  }
  if (input.escalateTo && !room.seats.some((s) => s.role === input.escalateTo)) {
    throw new RoomError(`There is no ${input.escalateTo} seat on this floor to escalate to.`);
  }

  return {
    eventId: input.eventId,
    role,
    disposition: input.disposition,
    reasoning: input.reasoning.trim(),
    actionIds: input.actionIds,
    escalateTo: input.escalateTo,
    confidence: input.confidence,
    atSeconds: elapsed,
  };
}

/**
 * Whether the lead may close the shift.
 *
 * Deliberately permissive about progress and strict about who: a floor that
 * has worked three events and decided it has the picture is allowed to stop,
 * because deciding when you have enough is part of the job being taught. What
 * it may not do is stop without the lead, since the readout is the lead's
 * output and the review is built from it.
 */
export function canClose(
  room: RoomSession,
  userId: string,
): { ok: true } | { ok: false; reason: string } {
  if (room.status !== 'running') return { ok: false, reason: 'This shift is not running.' };
  const lead = room.seats.find((s) => s.role === 'ir-lead');
  if (lead?.occupant?.userId !== userId) {
    return { ok: false, reason: 'The incident lead closes the shift and reads out the findings.' };
  }
  return { ok: true };
}

/**
 * The lead's readout, given before any of the answer key is shown.
 *
 * This is the whole hinge of the review. The findings and mitigations are what
 * the floor believed at the moment it stopped, and the review is worth
 * something only because it compares that against what was true. Building it
 * afterwards, or letting it be edited once the debrief is open, would turn the
 * exercise into a transcription of the answer.
 */
export function buildReadout(
  room: RoomSession,
  input: { findings: string[]; mitigations: string[] },
): LeadReadout {
  const findings = input.findings.map((f) => f.trim()).filter(Boolean);
  const mitigations = input.mitigations.map((m) => m.trim()).filter(Boolean);
  if (findings.length === 0) {
    throw new RoomError('Say what you found, even if it is that you did not settle it.');
  }
  return {
    findings,
    mitigations,
    /*
     * Named rather than counted. A review that says "three seats did not file"
     * lets everybody assume it was somebody else, and the seats that went
     * quiet are usually the finding.
     */
    missingReports: room.seats.filter((s) => !s.occupant).map((s) => s.role),
  };
}

export function closeShift(
  room: RoomSession,
  userId: string,
  readout: LeadReadout,
  now: Date,
): RoomSession {
  const check = canClose(room, userId);
  if (!check.ok) throw new RoomError(check.reason);
  return {
    ...room,
    status: 'complete',
    readout,
    closedAtSeconds: elapsedSeconds(room, now),
  };
}
