import { describe, expect, it } from 'vitest';

import { REQUIRED_SEAT, canAdmit, doorIsShut } from '@soc/shared';
import type { FloorIdentity, RoomSession } from '@soc/shared';

import {
  answerDoor,
  hasBeenAdmitted,
  isWaiting,
  knock,
  releaseSeat,
  seatingFor,
  stepBackIn,
  stepOut,
} from './rooms.js';

/*
 * The door decides who gets shut out of a room that is already running, which
 * is the kind of rule that is invisible until it strands somebody mid-incident.
 * All of it is pure, so all of it is tested without a database.
 */

const NOW = new Date('2026-09-03T10:00:00Z');

function who(id: string, callSign: string): FloorIdentity {
  return { userId: id, callSign, avatarId: 'ash' };
}

function room(overrides: Partial<RoomSession> = {}): RoomSession {
  return {
    id: 'room-1',
    scenarioId: 'ridgeline',
    difficulty: 'intermediate',
    startsAt: '2026-09-03T09:45:00Z',
    visibility: 'open',
    joinCode: null,
    status: 'running',
    hostUserId: 'u-lead',
    seats: [
      { role: REQUIRED_SEAT, occupant: who('u-lead', 'Cinder') },
      { role: 'log-analyst', occupant: who('u-log', 'Tarn') },
      { role: 'network-analyst', occupant: null },
    ],
    knocks: [],
    ...overrides,
  };
}

describe('whether the room has a door at all', () => {
  /*
   * Before it starts, a floor is filling and anybody may take a free chair.
   * A door on a scheduled room would stop the room forming.
   */
  it('is open before the shift starts', () => {
    expect(doorIsShut(room({ status: 'scheduled' }))).toBe(false);
  });

  it('is shut while the shift is running', () => {
    expect(doorIsShut(room())).toBe(true);
  });
});

describe('who may answer it', () => {
  it('is the lead', () => {
    expect(canAdmit(room(), 'u-lead')).toBe(true);
  });

  it('is not somebody else in the room while the lead is present', () => {
    expect(canAdmit(room(), 'u-log')).toBe(false);
  });

  it('is never somebody outside the room', () => {
    expect(canAdmit(room(), 'u-stranger')).toBe(false);
  });

  /*
   * The fallback that matters. A room whose lead has gone to find the missing
   * person cannot let that person back in if only the lead can answer, which
   * is the exact situation the fallback exists for.
   */
  it('falls to anybody seated when the lead has stepped out', () => {
    const r = stepOut(room(), 'u-lead');
    expect(canAdmit(r, 'u-log')).toBe(true);
    expect(canAdmit(r, 'u-stranger')).toBe(false);
  });

  it('falls to anybody seated when the lead chair is empty', () => {
    const r = room({
      seats: [
        { role: REQUIRED_SEAT, occupant: null },
        { role: 'log-analyst', occupant: who('u-log', 'Tarn') },
      ],
    });
    expect(canAdmit(r, 'u-log')).toBe(true);
  });

  it('does not fall to somebody who has themselves stepped out', () => {
    let r = stepOut(room(), 'u-lead');
    r = stepOut(r, 'u-log');
    expect(canAdmit(r, 'u-log')).toBe(false);
  });
});

describe('stepping out', () => {
  /*
   * The chair stays theirs. Somebody who leaves for four minutes should not
   * return to find a stranger holding their seat, and a floor that works that
   * way teaches people never to leave.
   */
  it('holds the chair', () => {
    const r = stepOut(room(), 'u-log');
    const seat = r.seats.find((s) => s.role === 'log-analyst')!;
    expect(seat.occupant?.userId).toBe('u-log');
    expect(seat.steppedOut).toBe(true);
  });

  it('does not offer that chair to anybody else', () => {
    const r = stepOut(room(), 'u-log');
    const view = seatingFor(r, 'u-stranger', NOW).find((s) => s.role === 'log-analyst')!;
    expect(view.selectable).toBe(false);
  });

  /*
   * The lead may step out like anybody else. A lead who has to hand the chair
   * over to answer the phone will not answer the phone.
   */
  it('is available to the lead without handing the chair over', () => {
    const r = stepOut(room(), 'u-lead');
    expect(r.seats.find((s) => s.role === REQUIRED_SEAT)!.occupant?.userId).toBe('u-lead');
  });

  it('refuses somebody who is not in a seat', () => {
    expect(() => stepOut(room(), 'u-stranger')).toThrow();
  });
});

describe('coming back', () => {
  it('is refused while the shift runs and nobody has admitted them', () => {
    const r = stepOut(room(), 'u-log');
    expect(() => stepBackIn(r, 'u-log')).toThrow();
  });

  it('is free before the shift starts', () => {
    const r = stepOut(room({ status: 'scheduled' }), 'u-log');
    expect(stepBackIn(r, 'u-log').seats.find((s) => s.role === 'log-analyst')!.steppedOut).toBe(false);
  });

  it('works once the room has admitted them', () => {
    let r = stepOut(room(), 'u-log');
    r = knock(r, who('u-log', 'Tarn'), NOW);
    r = answerDoor(r, 'u-lead', 'u-log', 'admitted');
    r = stepBackIn(r, 'u-log');
    expect(r.seats.find((s) => s.role === 'log-analyst')!.steppedOut).toBe(false);
  });

  it('clears their knock once they are back through it', () => {
    let r = stepOut(room(), 'u-log');
    r = knock(r, who('u-log', 'Tarn'), NOW);
    r = answerDoor(r, 'u-lead', 'u-log', 'admitted');
    r = stepBackIn(r, 'u-log');
    expect(r.knocks?.some((k) => k.who.userId === 'u-log')).toBe(false);
  });
});

describe('knocking', () => {
  it('puts somebody in the waiting list', () => {
    const r = knock(room(), who('u-new', 'Vell'), NOW);
    expect(isWaiting(r, 'u-new')).toBe(true);
  });

  /*
   * The person outside cannot see whether the first press landed, so they will
   * press it again. A second knock has to be a no-op rather than an error or a
   * second row, or one impatient person fills the room's door with themselves.
   */
  it('is idempotent, because the person outside cannot see it worked', () => {
    let r = knock(room(), who('u-new', 'Vell'), NOW);
    r = knock(r, who('u-new', 'Vell'), NOW);
    expect(r.knocks?.filter((k) => k.who.userId === 'u-new')).toHaveLength(1);
  });

  it('marks somebody coming back as returning, so the room knows who it is answering', () => {
    let r = stepOut(room(), 'u-log');
    r = knock(r, who('u-log', 'Tarn'), NOW);
    expect(r.knocks?.[0]!.returning).toBe(true);
  });

  it('marks a stranger as not returning', () => {
    const r = knock(room(), who('u-new', 'Vell'), NOW);
    expect(r.knocks?.[0]!.returning).toBe(false);
  });

  it('is refused on a room that has not started, where there is nothing to knock on', () => {
    expect(() => knock(room({ status: 'scheduled' }), who('u-new', 'Vell'), NOW)).toThrow();
  });
});

describe('answering the door', () => {
  it('lets the lead admit somebody', () => {
    let r = knock(room(), who('u-new', 'Vell'), NOW);
    r = answerDoor(r, 'u-lead', 'u-new', 'admitted');
    expect(hasBeenAdmitted(r, 'u-new')).toBe(true);
  });

  it('refuses somebody in the room who is not the lead', () => {
    const r = knock(room(), who('u-new', 'Vell'), NOW);
    expect(() => answerDoor(r, 'u-log', 'u-new', 'admitted')).toThrow();
  });

  it('refuses somebody outside the room entirely', () => {
    const r = knock(room(), who('u-new', 'Vell'), NOW);
    expect(() => answerDoor(r, 'u-other', 'u-new', 'admitted')).toThrow();
  });

  /*
   * A declined knock is kept rather than deleted, so the room can see what it
   * decided and the same person cannot quietly ask ten times.
   */
  it('keeps a refusal on the record', () => {
    let r = knock(room(), who('u-new', 'Vell'), NOW);
    r = answerDoor(r, 'u-lead', 'u-new', 'declined');
    expect(r.knocks?.[0]!.status).toBe('declined');
    expect(hasBeenAdmitted(r, 'u-new')).toBe(false);
  });

  it('records who answered', () => {
    let r = knock(room(), who('u-new', 'Vell'), NOW);
    r = answerDoor(r, 'u-lead', 'u-new', 'admitted');
    expect(r.knocks?.[0]!.decidedByUserId).toBe('u-lead');
  });

  it('refuses to answer for somebody who is not at the door', () => {
    expect(() => answerDoor(room(), 'u-lead', 'u-nobody', 'admitted')).toThrow();
  });

  /*
   * An admitted person can take a free chair. Without this the admission is a
   * message rather than a permission.
   */
  it('opens the free chairs to somebody admitted', () => {
    let r = knock(room(), who('u-new', 'Vell'), NOW);
    expect(seatingFor(r, 'u-new', NOW).find((s) => s.role === 'network-analyst')!.selectable).toBe(false);
    r = answerDoor(r, 'u-lead', 'u-new', 'admitted');
    expect(seatingFor(r, 'u-new', NOW).find((s) => s.role === 'network-analyst')!.selectable).toBe(true);
  });
});

describe('freeing a chair whose occupant is not coming back', () => {
  it('is the lead decision', () => {
    const r = stepOut(room(), 'u-log');
    expect(releaseSeat(r, 'u-lead', 'log-analyst').seats.find((s) => s.role === 'log-analyst')!.occupant)
      .toBeNull();
  });

  it('refuses somebody who cannot answer the door', () => {
    const r = stepOut(room(), 'u-log');
    expect(() => releaseSeat(r, 'u-stranger', 'log-analyst')).toThrow();
  });

  /*
   * Only a chair somebody has stepped out of. Freeing a chair with somebody
   * sitting in it is removing a person from the room, which is a different
   * decision and is not this one.
   */
  it('refuses a chair whose occupant is still in the room', () => {
    expect(() => releaseSeat(room(), 'u-lead', 'log-analyst')).toThrow();
  });

  it('leaves the freed chair genuinely open rather than still marked away', () => {
    const r = releaseSeat(stepOut(room(), 'u-log'), 'u-lead', 'log-analyst');
    expect(r.seats.find((s) => s.role === 'log-analyst')!.steppedOut).toBe(false);
  });
});
