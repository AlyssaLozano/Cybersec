/**
 * The wire protocol for a live floor.
 *
 * THE SERVER IS AUTHORITATIVE, FOR THE SAME REASON THE TERMINAL IS
 *
 * Shared state lives on the server and clients receive it. A client that can
 * write the board can claim an event it never worked, seat itself twice, or
 * roll the clock back, and every one of those is scored. This is the same
 * decision as keeping the filesystem server-side, applied to a room instead of
 * a host.
 *
 * So the client sends INTENT (`ClientMessage`) and receives FACT
 * (`ServerMessage`). It never sends state.
 *
 * WHAT A CONNECTION IS ALLOWED TO RECEIVE
 *
 * Not the same as what the room knows. A seat sees its own surfaces, the public
 * activity of others, and nothing of the answer key. Building that filter here,
 * on the message types, is what stops a broadcast written in a hurry from
 * shipping a verdict to twelve people at once. `toStudentView` exists for one
 * exercise; this is its equivalent for a room.
 */

import type { SocRoleId } from './roles.js';
import type { ScenarioEvent, TriageDecision } from './index.js';

/** Where a session is in its life. */
export const SESSION_PHASES = ['lobby', 'running', 'debrief', 'closed'] as const;
export type SessionPhase = (typeof SESSION_PHASES)[number];

/** A person in a seat. Observers are not participants and are kept separate. */
export interface Participant {
  userId: string;
  displayName: string;
  role: SocRoleId;
  /** Avatar index they picked before entering. */
  avatar: number;
  connected: boolean;
}

/**
 * What one seat is doing, as everyone else is allowed to see it.
 *
 * Deliberately coarse. The floor needs to know a seat is working so it does not
 * duplicate them and so the lead can pace, and it must NOT see their reasoning
 * before they commit, because a room that can read a draft claim converges on
 * whoever types first.
 */
export interface SeatActivity {
  role: SocRoleId;
  /** Event they currently have open, if any. */
  workingOn: string | null;
  /** Events they have committed a claim on. */
  claimed: string[];
  /** Seconds since they last did anything. Drives the idle nudge. */
  idleSeconds: number;
  /** True while they have a terminal open. Stops the nudge firing at somebody
   *  who is mid-investigation rather than stuck. */
  investigating: boolean;
}

/** A message on the floor. */
export interface FloorMessage {
  id: string;
  author: string;
  /** Set when an observer posted it, so the floor knows it is not a teammate. */
  fromObserver?: boolean;
  text: string;
  at: number;
}

/**
 * A nudge.
 *
 * `floor` goes to everyone: an event nobody has taken is the room's problem.
 * `seat` goes to one connection only. Publicly correcting a named person in
 * front of strangers who paid to be there teaches them to stop taking risks,
 * which is the opposite of what this is for.
 */
export interface Nudge {
  scope: 'floor' | 'seat';
  role?: SocRoleId;
  text: string;
  at: number;
}

/**
 * The lead asking two seats to confirm something before they commit.
 *
 * WHY THIS IS A REAL MECHANIC AND NOT A BUTTON THAT PAUSES
 *
 * "Request corroboration first" has to cost what it costs in a real bridge:
 * the clock does not stop, events keep landing, and the lead is buying
 * confidence with the only currency they have. If asking were free it would
 * always be the right answer and the option would teach nothing.
 *
 * Non-response is deliberately allowed and deliberately not blocking. A seat
 * that is heads-down does not answer, and the lead still has to decide. That is
 * the situation this exists to rehearse, and a design that waited for everybody
 * would remove it.
 */
export interface Corroboration {
  id: string;
  /** The event the lead wants a second read on. */
  eventId: string;
  /** The question, in the lead's words. */
  question: string;
  askedOf: SocRoleId[];
  askedAt: number;
  responses: CorroborationResponse[];
}

export const CORROBORATION_ANSWERS = ['confirm', 'cannot-confirm', 'need-time'] as const;
export type CorroborationAnswer = (typeof CORROBORATION_ANSWERS)[number];

export interface CorroborationResponse {
  role: SocRoleId;
  answer: CorroborationAnswer;
  /** One line. Not an essay: this is a bridge, not a report. */
  note: string;
  at: number;
}

/** What the client asks for. Intent only, never state. */
export type ClientMessage =
  | { type: 'join'; sessionId: string; role: SocRoleId }
  | { type: 'open-event'; eventId: string }
  | { type: 'close-event' }
  | { type: 'terminal-open'; eventId: string }
  | { type: 'terminal-command'; command: string }
  | { type: 'terminal-close' }
  | {
      type: 'claim';
      eventId: string;
      disposition: TriageDecision;
      reasoning: string;
      actionIds: string[];
      escalateTo: SocRoleId | null;
      confidence: number;
    }
  | { type: 'say'; text: string }
  | { type: 'lead-call'; call: 'declare' | 'corroborate' | 'monitor' }
  /** The lead tasking specific seats. Costs the clock, blocks nothing. */
  | { type: 'lead-ask'; eventId: string; question: string; askedOf: SocRoleId[] }
  | { type: 'corroborate'; corroborationId: string; answer: CorroborationAnswer; note: string }
  | { type: 'leave' };

/** What the server states. Fact only. */
export type ServerMessage =
  | {
      type: 'state';
      phase: SessionPhase;
      elapsedSeconds: number;
      durationMinutes: number;
      /** Only the events this seat's surfaces can see, and only those that have landed. */
      events: ScenarioEvent[];
      participants: Participant[];
      activity: SeatActivity[];
      /** Announced observers only. Stealth never reaches here. */
      observers: Array<{ displayName: string }>;
      declaredAt: number | null;
    }
  | { type: 'event-landed'; event: ScenarioEvent }
  | { type: 'activity'; activity: SeatActivity[] }
  | { type: 'message'; message: FloorMessage }
  | { type: 'nudge'; nudge: Nudge }
  | { type: 'terminal-output'; lines: string[] }
  /** Arrives only at the seats it was asked of. Pinned, never modal: a seat
   *  mid-investigation should not have their screen taken. */
  | { type: 'asked'; corroboration: Corroboration }
  /** Goes to the lead as answers land, and to nobody else. */
  | { type: 'corroboration-status'; corroboration: Corroboration }
  /** Scores are released per seat after the claim commits, never broadcast. */
  | { type: 'claim-accepted'; eventId: string }
  | { type: 'error'; code: string; message: string };
