/**
 * Scheduling a room and putting people in seats.
 *
 * WHY SEATING IS ITS OWN SERVICE AND NOT A FIELD ON THE SESSION
 *
 * Who is in which chair decides what every other part of the system does. It
 * decides which surfaces a person is projected, which events they can claim
 * without a lane violation, which report template they are handed, and which
 * chairs the lead has to read stand-ins for. Getting it wrong does not produce
 * a seating bug, it produces a scenario that grades somebody against a job they
 * were not doing.
 *
 * So every rule about it is here, enforced server-side, rather than spread
 * across the join screen and the floor.
 */

import type {
  AvatarId,
  FloorIdentity,
  RoomSession,
  RoomVisibility,
  ScenarioDifficulty,
  SeatAssignment,
  SocRoleId,
} from '@soc/shared';
import {
  REQUIRED_SEAT,
  SEATING_OPENS_MINUTES_BEFORE,
  checkCallSign,
  isAvatarId,
} from '@soc/shared';

import { getScenario } from './scenarios.js';

/** Thrown for a rule a person could have broken. Message is shown to them. */
export class RoomError extends Error {}

/**
 * A join code somebody can read out over a call without spelling it.
 *
 * No vowels, so it cannot spell a word by accident, and no characters that
 * collide when spoken or read: O and 0, I and 1, S and 5. What is left is short
 * enough to say once.
 */
const CODE_ALPHABET = 'BCDFGHJKMNPQRTVWXY2346789';
const CODE_LENGTH = 6;

export function generateJoinCode(random: () => number = Math.random): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  }
  return code;
}

export interface ScheduleInput {
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  /** ISO 8601. */
  startsAt: string;
  visibility: RoomVisibility;
  host: FloorIdentity;
  /** Injected so the caller owns the clock and tests are not time-dependent. */
  now: Date;
  random?: () => number;
}

/**
 * Create a room.
 *
 * The host is seated as lead immediately. That is not a convenience: a room
 * whose required seat is empty cannot run, and leaving it open until somebody
 * volunteers means the common case is eleven people waiting on a chair nobody
 * wants. Handing it over is a deliberate act, which is the right way round.
 */
export function scheduleRoom(input: ScheduleInput): RoomSession {
  const scenario = getScenario(input.scenarioId);
  if (!scenario) {
    throw new RoomError(`No scenario "${input.scenarioId}".`);
  }

  const startsAt = new Date(input.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    throw new RoomError('That start time is not a valid date.');
  }
  // A room in the past cannot be joined, and one scheduled a minute out gives
  // nobody time to read a brief. The seating window is the honest floor.
  const earliest = new Date(input.now.getTime() + SEATING_OPENS_MINUTES_BEFORE * 60_000);
  if (startsAt < earliest) {
    throw new RoomError(
      `Start it at least ${SEATING_OPENS_MINUTES_BEFORE} minutes out, so people can take a seat and read their brief.`,
    );
  }

  if (!scenario.roles.includes(REQUIRED_SEAT)) {
    // Defensive: a scenario without a lead seat cannot be run by anybody.
    throw new RoomError(`Scenario "${scenario.id}" has no ${REQUIRED_SEAT} seat, so it cannot be run.`);
  }

  const seats: SeatAssignment[] = scenario.roles.map((role) => ({
    role,
    occupant: role === REQUIRED_SEAT ? input.host : null,
  }));

  return {
    id: `room.${input.scenarioId}.${startsAt.getTime()}`,
    scenarioId: input.scenarioId,
    difficulty: input.difficulty,
    startsAt: startsAt.toISOString(),
    visibility: input.visibility,
    // An open room has no code by definition. Generating one anyway would
    // create a secret that gates nothing, which is worse than no secret.
    joinCode: input.visibility === 'closed' ? generateJoinCode(input.random) : null,
    status: 'scheduled',
    hostUserId: input.host.userId,
    seats,
  };
}

/** Whether somebody may even see the seating chart. */
export function canJoin(
  room: RoomSession,
  suppliedCode: string | null,
  userId: string,
): { ok: boolean; problem: string | null } {
  if (room.status === 'cancelled') return { ok: false, problem: 'This session was cancelled.' };
  if (room.status === 'complete') return { ok: false, problem: 'This session has already run.' };
  // The host is never locked out of their own room by a code they rotated.
  if (userId === room.hostUserId) return { ok: true, problem: null };
  if (room.visibility === 'open') return { ok: true, problem: null };
  if (!suppliedCode) return { ok: false, problem: 'This is a closed session. You need the join code.' };
  if (suppliedCode.trim().toUpperCase() !== room.joinCode) {
    return { ok: false, problem: 'That join code does not match.' };
  }
  return { ok: true, problem: null };
}

export interface SeatView {
  role: SocRoleId;
  /** Null when open. */
  occupant: FloorIdentity | null;
  /** False when this seat is taken, or when the person already has one. */
  selectable: boolean;
  /** Why not, when not. Written for the person reading it. */
  blockedBecause: string | null;
}

/**
 * The seating chart as one person sees it.
 *
 * Deliberately shows the whole roster including filled chairs, rather than only
 * what is free. Seeing that Forensics is empty four minutes before start is how
 * somebody decides to take it instead of the seat they wanted, and a picker
 * that hides the shape of the floor cannot prompt that.
 */
export function seatingFor(room: RoomSession, userId: string, now: Date): SeatView[] {
  const opensAt = new Date(new Date(room.startsAt).getTime() - SEATING_OPENS_MINUTES_BEFORE * 60_000);
  const tooEarly = now < opensAt;
  const alreadySeated = room.seats.find((s) => s.occupant?.userId === userId)?.role ?? null;

  return room.seats.map((seat) => {
    const mine = seat.occupant?.userId === userId;
    if (mine) {
      return { role: seat.role, occupant: seat.occupant, selectable: false, blockedBecause: 'This is your seat.' };
    }
    if (seat.occupant) {
      return {
        role: seat.role,
        occupant: seat.occupant,
        selectable: false,
        blockedBecause: `Taken by ${seat.occupant.callSign}.`,
      };
    }
    if (tooEarly) {
      return {
        role: seat.role,
        occupant: null,
        selectable: false,
        blockedBecause: `Seating opens ${SEATING_OPENS_MINUTES_BEFORE} minutes before the start.`,
      };
    }
    if (alreadySeated) {
      return {
        role: seat.role,
        occupant: null,
        selectable: false,
        blockedBecause: `You are in the ${alreadySeated} seat. Leave it first.`,
      };
    }
    return { role: seat.role, occupant: null, selectable: true, blockedBecause: null };
  });
}

/**
 * Take a seat.
 *
 * ONE PERSON, ONE CHAIR
 *
 * The temptation is to let somebody cover two seats when the room is short.
 * That breaks the thing the room is for. Every score in the model, lane
 * discipline especially, assumes a seat is one person's remit; somebody holding
 * both Network and Forensics can never commit a lane violation and is graded
 * against a job that does not exist. An empty chair is handled properly by the
 * lead reading the stand-in, and that is a better simulation of being short a
 * person than pretending nobody is missing.
 */
export function takeSeat(
  room: RoomSession,
  role: SocRoleId,
  identity: FloorIdentity,
  now: Date,
): RoomSession {
  const view = seatingFor(room, identity.userId, now).find((s) => s.role === role);
  if (!view) throw new RoomError(`This scenario has no ${role} seat.`);
  if (!view.selectable) throw new RoomError(view.blockedBecause ?? 'That seat is not available.');

  const check = checkCallSign(identity.callSign);
  if (!check.ok) throw new RoomError(check.problem!);
  if (!isAvatarId(identity.avatarId)) throw new RoomError('Pick an avatar before you sit down.');

  // Two people answering to the same name over voice is a coordination failure
  // the room cannot recover from mid-incident, so it is refused at the door.
  const clash = room.seats.find(
    (s) =>
      s.occupant &&
      s.occupant.userId !== identity.userId &&
      s.occupant.callSign.toLowerCase() === identity.callSign.toLowerCase(),
  );
  if (clash) {
    throw new RoomError(
      `Somebody in this room is already using "${identity.callSign}". Pick another for this session.`,
    );
  }

  return {
    ...room,
    seats: room.seats.map((s) => (s.role === role ? { ...s, occupant: identity } : s)),
  };
}

/**
 * Leave a seat.
 *
 * The lead chair is the exception: emptying it leaves a room that cannot
 * adjudicate, cover empty chairs, or close. It has to be handed to somebody,
 * not vacated.
 */
export function leaveSeat(room: RoomSession, userId: string): RoomSession {
  const seat = room.seats.find((s) => s.occupant?.userId === userId);
  if (!seat) throw new RoomError('You are not in a seat.');
  if (seat.role === REQUIRED_SEAT) {
    throw new RoomError(
      'Hand the lead seat to somebody before you leave it. A room without a lead cannot run.',
    );
  }
  return {
    ...room,
    seats: room.seats.map((s) => (s.role === seat.role ? { ...s, occupant: null } : s)),
  };
}

/** Move the lead chair to somebody already in the room. */
export function handOverLead(room: RoomSession, toUserId: string): RoomSession {
  const target = room.seats.find((s) => s.occupant?.userId === toUserId);
  if (!target) throw new RoomError('That person is not in this room.');
  if (target.role === REQUIRED_SEAT) throw new RoomError('They already have it.');

  const current = room.seats.find((s) => s.role === REQUIRED_SEAT)!;
  return {
    ...room,
    hostUserId: toUserId,
    seats: room.seats.map((s) => {
      // A straight swap. The outgoing lead lands in the seat the new lead had,
      // rather than being dropped, so a handover never quietly empties a chair.
      if (s.role === REQUIRED_SEAT) return { ...s, occupant: target.occupant };
      if (s.role === target.role) return { ...s, occupant: current.occupant };
      return s;
    }),
  };
}

export interface RoomReadiness {
  canStart: boolean;
  filled: number;
  total: number;
  /** Seats nobody took. The lead reads stand-ins for these. */
  empty: SocRoleId[];
  blockers: string[];
  notes: string[];
}

/**
 * Whether a room can start, and what it will cost if it does.
 *
 * Only ONE thing actually blocks a start, and it is the lead chair. Everything
 * else is a note, on purpose: a floor of three people running a ten-seat
 * scenario is a real shift on a bad night, the stand-in machinery exists
 * precisely to make it coherent, and refusing to start would strand exactly the
 * students who most need the practice. So the room says what will be missing
 * and lets them decide.
 */
/**
 * The three chairs whose absence changes what the shift is, without stopping
 * it.
 *
 * Not requirements. Every one of these is in all 74 scenarios, so requiring
 * them would be safe and would still be wrong: it would mean one person can
 * never practise alone, and the stand-in system exists precisely so a short
 * floor gets the whole incident anyway. What they get instead is a warning
 * that names what the room is missing, because "you are working it short" is
 * less useful than "nobody is triaging".
 */
const CORE_SEATS: { role: SocRoleId; without: string }[] = [
  { role: 'soc-operator', without: 'Nobody is on triage, so the queue is being read by whoever gets to it.' },
  { role: 'log-analyst', without: 'Nobody is building the timeline the rest of you argue from.' },
  {
    role: 'mitigation-specialist',
    without: 'Nobody owns what a remedy costs, so the lead is pricing their own containment.',
  },
];

export function readiness(room: RoomSession, requiredSeats: SocRoleId[] = []): RoomReadiness {
  const filled = room.seats.filter((s) => s.occupant).length;
  const empty = room.seats.filter((s) => !s.occupant).map((s) => s.role);
  const blockers: string[] = [];
  const notes: string[] = [];

  if (!room.seats.find((s) => s.role === REQUIRED_SEAT)?.occupant) {
    blockers.push('No lead. Somebody has to take that chair before this can start.');
  }

  /*
   * A scenario may name seats its own evidence cannot do without. Kept
   * separate from the lead because that one is structural to every room and
   * these are a judgement about one incident.
   */
  for (const role of requiredSeats) {
    if (role === REQUIRED_SEAT) continue;
    const seat = room.seats.find((s) => s.role === role);
    if (seat && !seat.occupant) {
      blockers.push(`This incident cannot run without the ${role} chair filled.`);
    }
  }

  for (const core of CORE_SEATS) {
    const seat = room.seats.find((s) => s.role === core.role);
    if (seat && !seat.occupant) notes.push(core.without);
  }

  if (empty.length > 0) {
    notes.push(
      `${empty.length} chair(s) empty: ${empty.join(', ')}. The lead reads their findings out on ` +
        'schedule, so the incident still hangs together. You will be working it short.',
    );
  }
  if (filled === 1) {
    notes.push(
      'You are the only person here. This runs, and the lead will be reading almost every finding ' +
        'out rather than analysing any of them, which is a different exercise from the one intended.',
    );
  }

  return { canStart: blockers.length === 0, filled, total: room.seats.length, empty, blockers, notes };
}
