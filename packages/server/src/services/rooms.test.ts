import { describe, expect, it } from 'vitest';

import {
  RoomError,
  canJoin,
  generateJoinCode,
  handOverLead,
  leaveSeat,
  readiness,
  scheduleRoom,
  seatingFor,
  takeSeat,
} from './rooms.js';
import { checkCallSign, SOC_ROLE_IDS } from '@soc/shared';
import type { FloorIdentity, RoomSession } from '@soc/shared';
import { SCENARIOS } from '../content/scenarios/index.js';

const NOW = new Date('2026-09-01T18:00:00Z');
const START = '2026-09-01T19:00:00Z';

const HOST: FloorIdentity = { userId: 'u.host', callSign: 'Cinder', avatarId: 'ash' };
const GUEST: FloorIdentity = { userId: 'u.guest', callSign: 'Kestrel', avatarId: 'birch' };

function room(overrides: Partial<Parameters<typeof scheduleRoom>[0]> = {}): RoomSession {
  return scheduleRoom({
    scenarioId: 'ridgeline',
    difficulty: 'beginner',
    startsAt: START,
    visibility: 'open',
    host: HOST,
    now: NOW,
    ...overrides,
  });
}

describe('call signs', () => {
  it('accepts something you could say over a microphone', () => {
    expect(checkCallSign('Cinder').ok).toBe(true);
    expect(checkCallSign('NOVA7').ok).toBe(true);
    expect(checkCallSign('grey-fox').ok).toBe(true);
  });

  it('rejects words the floor already uses to address a group', () => {
    // "Lead, can you confirm" has to mean the lead seat and nothing else.
    for (const reserved of ['Lead', 'all', 'FLOOR', 'everyone']) {
      expect(checkCallSign(reserved).ok).toBe(false);
    }
  });

  it('rejects anything that does not survive being read aloud', () => {
    expect(checkCallSign('a').ok).toBe(false);
    expect(checkCallSign('the quiet professional').ok).toBe(false); // spaces
    expect(checkCallSign('7up').ok).toBe(false); // has to start with a letter
    expect(checkCallSign('x'.repeat(20)).ok).toBe(false);
  });
});

describe('join codes', () => {
  it('avoids characters that collide when read out', () => {
    const random = (() => {
      let i = 0;
      return () => ((i += 7) % 100) / 100;
    })();
    for (let n = 0; n < 50; n += 1) {
      const code = generateJoinCode(random);
      expect(code).toHaveLength(6);
      // No vowels means it cannot accidentally spell anything, and the
      // lookalike pairs are gone so it survives a phone call.
      expect(code).not.toMatch(/[AEIOU01S5]/);
    }
  });
});

describe('scheduling', () => {
  it('seats the host as lead, because a room without one cannot run', () => {
    const r = room();
    expect(r.seats.find((s) => s.role === 'ir-lead')?.occupant).toEqual(HOST);
  });

  it('refuses a start time nobody could reach in time', () => {
    expect(() => room({ startsAt: '2026-09-01T18:02:00Z' })).toThrow(RoomError);
    expect(() => room({ startsAt: '2020-01-01T00:00:00Z' })).toThrow(RoomError);
  });

  it('gives a closed room a code and an open room none', () => {
    expect(room({ visibility: 'closed' }).joinCode).toMatch(/^[A-Z0-9]{6}$/);
    // A code on an open room would be a secret that gates nothing.
    expect(room({ visibility: 'open' }).joinCode).toBeNull();
  });

  it('carries the difficulty on the run rather than the scenario', () => {
    // The same incident, three ways. That is the point of the field.
    expect(room({ difficulty: 'expert' }).difficulty).toBe('expert');
    expect(room({ difficulty: 'beginner' }).difficulty).toBe('beginner');
  });
});

describe('joining', () => {
  it('lets anybody into an open room', () => {
    expect(canJoin(room(), null, 'u.stranger').ok).toBe(true);
  });

  it('holds a closed room shut without the code', () => {
    const closed = room({ visibility: 'closed' });
    expect(canJoin(closed, null, 'u.stranger').ok).toBe(false);
    expect(canJoin(closed, 'WRONGX', 'u.stranger').ok).toBe(false);
    expect(canJoin(closed, closed.joinCode!.toLowerCase(), 'u.stranger').ok).toBe(true);
  });

  it('never locks the host out of their own room', () => {
    const closed = room({ visibility: 'closed' });
    expect(canJoin(closed, null, HOST.userId).ok).toBe(true);
  });
});

describe('seating', () => {
  const seatingOpen = new Date('2026-09-01T18:50:00Z');

  it('holds seats shut until the window opens', () => {
    const early = seatingFor(room(), GUEST.userId, NOW);
    expect(early.every((s) => !s.selectable)).toBe(true);
    const open = seatingFor(room(), GUEST.userId, seatingOpen);
    expect(open.some((s) => s.selectable)).toBe(true);
  });

  it('shows filled chairs too, so somebody can see the floor is short', () => {
    const view = seatingFor(room(), GUEST.userId, seatingOpen);
    const lead = view.find((s) => s.role === 'ir-lead')!;
    expect(lead.occupant?.callSign).toBe('Cinder');
    expect(lead.selectable).toBe(false);
  });

  /*
   * A seat a scenario does not use must not exist in the room at all.
   *
   * Not merely unselectable: absent. A malware analyst chair on a floor whose
   * incident has no malware invites somebody to sit in it, wait an hour for
   * evidence that is never going to arrive, and conclude they were bad at the
   * job. The scenario declares which seats it runs and the room is built from
   * that declaration, so the guarantee is structural. These tests exist because
   * it is structural: nothing downstream re-checks it, and a seat chart built
   * from the role catalogue instead of the scenario would look correct on
   * screen and be wrong for every scenario that does not seat all thirteen.
   */
  it('never offers a chair the scenario does not use', () => {
    const scenario = SCENARIOS.find((s) => s.id === 'ridgeline')!;
    const view = seatingFor(room(), GUEST.userId, seatingOpen);
    expect(view.map((s) => s.role).sort()).toEqual([...scenario.roles].sort());
    // The point of the assertion: the catalogue is bigger than this scenario.
    expect(scenario.roles.length).toBeLessThan(SOC_ROLE_IDS.length);
    for (const role of SOC_ROLE_IDS) {
      if (scenario.roles.includes(role)) continue;
      expect(view.some((s) => s.role === role)).toBe(false);
    }
  });

  it('refuses a chair the scenario does not use, even when it is free', () => {
    const scenario = SCENARIOS.find((s) => s.id === 'ridgeline')!;
    const absent = SOC_ROLE_IDS.find((r) => !scenario.roles.includes(r))!;
    expect(() => takeSeat(room(), absent, GUEST, seatingOpen)).toThrow(RoomError);
  });

  it('builds every scenario room from the roles that scenario declares', () => {
    for (const scenario of SCENARIOS) {
      const view = seatingFor(
        room({ scenarioId: scenario.id, difficulty: scenario.difficulty }),
        GUEST.userId,
        seatingOpen,
      );
      expect(view.map((s) => s.role).sort()).toEqual([...scenario.roles].sort());
    }
  });

  it('gives one person one chair', () => {
    const seated = takeSeat(room(), 'forensics', GUEST, seatingOpen);
    // Every score in the model assumes a seat is one person's remit.
    expect(() => takeSeat(seated, 'network-analyst', GUEST, seatingOpen)).toThrow(RoomError);
  });

  it('refuses a taken chair', () => {
    const seated = takeSeat(room(), 'forensics', GUEST, seatingOpen);
    const other: FloorIdentity = { userId: 'u.third', callSign: 'Rowan', avatarId: 'cedar' };
    expect(() => takeSeat(seated, 'forensics', other, seatingOpen)).toThrow(/Taken by Kestrel/);
  });

  it('refuses a duplicate call sign in the same room', () => {
    // Two people answering to one name over voice cannot be recovered from
    // mid-incident, so it is stopped at the door.
    const twin: FloorIdentity = { userId: 'u.twin', callSign: 'cinder', avatarId: 'delta' };
    expect(() => takeSeat(room(), 'forensics', twin, seatingOpen)).toThrow(/already using/);
  });

  it('refuses an avatar that does not exist', () => {
    const bogus = { userId: 'u.x', callSign: 'Pike', avatarId: 'dragon' } as unknown as FloorIdentity;
    expect(() => takeSeat(room(), 'forensics', bogus, seatingOpen)).toThrow(RoomError);
  });
});

describe('leaving and handover', () => {
  const seatingOpen = new Date('2026-09-01T18:50:00Z');

  it('lets a specialist leave', () => {
    const seated = takeSeat(room(), 'forensics', GUEST, seatingOpen);
    const left = leaveSeat(seated, GUEST.userId);
    expect(left.seats.find((s) => s.role === 'forensics')?.occupant).toBeNull();
  });

  it('will not let the lead simply vacate', () => {
    expect(() => leaveSeat(room(), HOST.userId)).toThrow(/Hand the lead seat/);
  });

  it('swaps rather than empties on handover', () => {
    const seated = takeSeat(room(), 'forensics', GUEST, seatingOpen);
    const handed = handOverLead(seated, GUEST.userId);
    expect(handed.seats.find((s) => s.role === 'ir-lead')?.occupant).toEqual(GUEST);
    // The outgoing lead lands in the chair the new lead vacated, so a handover
    // never quietly costs the room a seat.
    expect(handed.seats.find((s) => s.role === 'forensics')?.occupant).toEqual(HOST);
    expect(handed.hostUserId).toBe(GUEST.userId);
  });
});

describe('readiness', () => {
  it('blocks only on the lead chair', () => {
    const r = room();
    const state = readiness(r);
    // A short floor is a real shift on a bad night. It runs.
    expect(state.canStart).toBe(true);
    expect(state.empty.length).toBeGreaterThan(0);
    expect(state.notes.join(' ')).toMatch(/chair\(s\) empty/);
  });

  it('will not start without a lead', () => {
    const r = room();
    const headless: RoomSession = {
      ...r,
      seats: r.seats.map((s) => (s.role === 'ir-lead' ? { ...s, occupant: null } : s)),
    };
    expect(readiness(headless).canStart).toBe(false);
  });

  it('says plainly when one person is running a ten-seat scenario', () => {
    expect(readiness(room()).notes.join(' ')).toMatch(/only person here/);
  });
});
