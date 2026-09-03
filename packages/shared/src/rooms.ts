/**
 * Identity on the floor, and the rooms people sit down in.
 *
 * WHY A CALL SIGN AND NOT A REAL NAME
 *
 * The floor is a shared voice channel with strangers on it. Two things follow.
 *
 * People say each other's names constantly during an incident, so the name has
 * to be short, unambiguous over a microphone, and stable: "Cinder, do you have
 * egress on that host" is how a bridge actually sounds, and it does not work if
 * the answer to "who is on network" is a legal name nobody caught.
 *
 * And a career changer practising in public should not have to attach their
 * real name to the hour where they missed the exfiltration. A handle is the
 * difference between rehearsing badly in front of strangers and refusing to
 * rehearse at all.
 *
 * This is also what the industry does, so it is one less thing that reads as
 * training rather than work.
 */

import type { ScenarioDifficulty } from './scenarios.js';
import type { SocRoleId } from './roles.js';
import type { LeadReadout } from './afterAction.js';

/**
 * Call sign rules, all of them for one reason: it has to survive being said out
 * loud in a hurry.
 *
 * Length is capped low because the lead reads these off a board while three
 * people are talking. Spaces and punctuation are out because a call sign is
 * addressed, not parsed. Digits are allowed, since somebody who wants to be
 * NOVA7 has picked something perfectly sayable.
 */
export const CALL_SIGN_MIN = 3;
export const CALL_SIGN_MAX = 14;
export const CALL_SIGN_PATTERN = /^[A-Za-z][A-Za-z0-9_-]{2,13}$/;

/**
 * Words that cannot be a call sign because the floor already uses them.
 *
 * Somebody called "Lead" makes every sentence on the voice channel ambiguous,
 * and "Console" or "All" collide with how the room addresses groups. This is a
 * usability rule wearing a validation rule's clothes.
 */
export const RESERVED_CALL_SIGNS = [
  'lead',
  'all',
  'floor',
  'room',
  'admin',
  'observer',
  'system',
  'console',
  'everyone',
  'anyone',
  'unassigned',
] as const;

export interface CallSignCheck {
  ok: boolean;
  /** Written to be shown to the person, so it says how to fix it. */
  problem: string | null;
}

export function checkCallSign(raw: string): CallSignCheck {
  const value = raw.trim();
  if (value.length < CALL_SIGN_MIN) {
    return { ok: false, problem: `Too short. At least ${CALL_SIGN_MIN} characters.` };
  }
  if (value.length > CALL_SIGN_MAX) {
    return { ok: false, problem: `Too long. At most ${CALL_SIGN_MAX} characters, so it is quick to say.` };
  }
  if (!CALL_SIGN_PATTERN.test(value)) {
    return {
      ok: false,
      problem: 'Letters, numbers, hyphen and underscore only, starting with a letter. No spaces.',
    };
  }
  if ((RESERVED_CALL_SIGNS as readonly string[]).includes(value.toLowerCase())) {
    return { ok: false, problem: `"${value}" is how the floor addresses a group. Pick something else.` };
  }
  return { ok: true, problem: null };
}

/**
 * Avatars.
 *
 * WHY A FIXED SET AND NOT AN UPLOAD
 *
 * An upload field on a product where strangers share a room is a moderation
 * queue nobody staffed. A fixed set costs one afternoon of art and has no such
 * failure mode.
 *
 * They are also the only thing on the floor that is purely yours, which matters
 * more than it sounds: the seat, the console and the queue are all assigned, and
 * a room where nothing is chosen reads as a form rather than a place.
 */
export const AVATARS = [
  'ash',
  'birch',
  'cedar',
  'delta',
  'ember',
  'flint',
  'gable',
  'harbor',
  'indigo',
  'juniper',
  'kestrel',
  'lumen',
  'marlow',
  'nocturne',
  'onyx',
  'pike',
  'quarry',
  'rowan',
  'sable',
  'tundra',
] as const;
export type AvatarId = (typeof AVATARS)[number];

export function isAvatarId(value: string): value is AvatarId {
  return (AVATARS as readonly string[]).includes(value);
}

/** How somebody appears to everybody else. Never carries their real name. */
export interface FloorIdentity {
  userId: string;
  callSign: string;
  avatarId: AvatarId;
}

/**
 * Open or closed.
 *
 * OPEN    anybody may take a free seat. How a solo student gets a full floor.
 * CLOSED  join code only. How a cohort, a class or a team of colleagues runs a
 *         session without a stranger taking the lead chair ten seconds before
 *         it starts.
 *
 * Both matter and neither is the default for everyone: a lone career changer
 * needs strangers, and an instructor running a class needs them kept out.
 */
export const ROOM_VISIBILITIES = ['open', 'closed'] as const;
export type RoomVisibility = (typeof ROOM_VISIBILITIES)[number];

export const ROOM_STATUSES = ['scheduled', 'running', 'complete', 'cancelled'] as const;
export type RoomStatus = (typeof ROOM_STATUSES)[number];

export interface SeatAssignment {
  role: SocRoleId;
  /** Null means the chair is open. The lead covers it with the stand-in script. */
  occupant: FloorIdentity | null;
  /**
   * Somebody stepped out and is expected back.
   *
   * The chair stays theirs. A person who leaves the room for four minutes in
   * the middle of an incident should not come back to find a stranger holding
   * their seat and their evidence, and a floor that works that way teaches
   * people never to leave, which is worse than the gap it prevents.
   *
   * The lead can free a chair whose occupant is not coming back. That is a
   * decision somebody makes, not a timer.
   */
  steppedOut?: boolean;
}

/**
 * Somebody at the door of a running room.
 *
 * WHY A ROOM HAS A DOOR AT ALL
 *
 * Before the shift starts anybody may take a free chair, which is how a floor
 * fills. Once it is running the room is holding a live incident: half-formed
 * theories, a contested event, somebody's first attempt at a claim they are
 * about to withdraw. Letting a stranger walk into that unannounced is a
 * different thing from letting them join a queue, and the people already in
 * the room are the ones who should decide.
 *
 * WHY EVERY SEAT SEES THE KNOCK
 *
 * Not just the lead. A knock that only the lead can see is invisible when the
 * lead is deep in a readout, and the person outside has no way to tell whether
 * they were refused or forgotten. Showing it to the whole floor also means the
 * decision is made in front of everybody, which is the right shape for a
 * decision about who is allowed in.
 */
export const KNOCK_STATUSES = ['waiting', 'admitted', 'declined'] as const;
export type KnockStatus = (typeof KNOCK_STATUSES)[number];

export interface Knock {
  who: FloorIdentity;
  /** ISO 8601. */
  at: string;
  status: KnockStatus;
  /**
   * True when this person held a seat in this room and stepped out.
   *
   * Shown on the door so the lead is answering a different question for a
   * colleague coming back from a phone call than for somebody nobody knows.
   */
  returning: boolean;
  /** Who answered, once somebody has. */
  decidedByUserId?: string | null;
}

export interface RoomSession {
  id: string;
  scenarioId: string;
  /**
   * The tier THIS RUN is played at.
   *
   * On the room and not on the scenario, because the same incident is worth
   * running three times: once with the command options, once with a nudge, once
   * with nothing. A student who has seen the answer still has to execute it
   * unaided, and that second run is where the skill actually lands.
   */
  difficulty: ScenarioDifficulty;
  /** ISO 8601, UTC. Rendered in the viewer's zone; never stored in one. */
  startsAt: string;
  visibility: RoomVisibility;
  /**
   * Set for closed rooms and null for open ones.
   *
   * Held here rather than derived so it can be rotated if it leaks, without
   * moving everybody to a new room.
   */
  joinCode: string | null;
  status: RoomStatus;
  hostUserId: string;
  seats: SeatAssignment[];
  /**
   * What the lead said at the close, before any of the answer key was shown.
   * Null until the shift is closed, and never rewritten afterwards: the review
   * is worth something only because it compares this against what was true.
   */
  readout?: LeadReadout | null;
  /** Seconds after startsAt that the lead closed it. */
  closedAtSeconds?: number | null;
  /**
   * People at the door, newest last. Cleared of nothing: a declined knock stays
   * so the same person cannot quietly ask ten times and so the room can see
   * what it decided.
   */
  knocks?: Knock[];
}

/**
 * Who may answer the door.
 *
 * The lead, because admitting somebody to a running incident is the same kind
 * of decision as adjudicating a contested event and belongs in the same chair.
 *
 * And anybody seated when the lead chair is empty or its occupant has stepped
 * out, because the alternative is a room that cannot let a colleague back in
 * because the one person who could is the person who went to find them. A
 * fallback that requires the lead to be present is not a fallback.
 */
export function canAdmit(room: RoomSession, userId: string): boolean {
  const lead = room.seats.find((s) => s.role === REQUIRED_SEAT);
  const leadPresent = Boolean(lead?.occupant) && !lead?.steppedOut;
  if (leadPresent) return lead!.occupant!.userId === userId;
  return room.seats.some((s) => s.occupant?.userId === userId && !s.steppedOut);
}

/** Whether the door is shut. Open rooms have no door until they start. */
export function doorIsShut(room: RoomSession): boolean {
  return room.status === 'running';
}

/**
 * The seat every room needs filled.
 *
 * A floor with no lead has nobody to adjudicate a contested event, nobody to
 * read the stand-ins for empty chairs, and nobody who can close the shift. It
 * does not degrade, it simply does not run, so the host takes it by default and
 * has to hand it over deliberately rather than by forgetting.
 */
export const REQUIRED_SEAT: SocRoleId = 'ir-lead';

/** How early somebody can take a seat. Long enough to read the brief. */
export const SEATING_OPENS_MINUTES_BEFORE = 15;
