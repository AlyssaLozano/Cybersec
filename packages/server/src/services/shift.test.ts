import { describe, expect, it } from 'vitest';

import { RoomError, scheduleRoom, takeSeat } from './rooms.js';
import {
  boardFor,
  buildClaim,
  canClose,
  canStart,
  closeShift,
  elapsedSeconds,
  startShift,
} from './shift.js';
import { SCENARIOS } from '../content/scenarios/index.js';
import type { FloorIdentity, RoomSession } from '@soc/shared';

const NOW = new Date('2026-09-02T18:00:00Z');
const START = '2026-09-02T19:00:00Z';
const SEATING_OPEN = new Date('2026-09-02T18:50:00Z');
const RUNNING = new Date('2026-09-02T19:05:00Z');

const LEAD: FloorIdentity = { userId: 'u.lead', callSign: 'Cinder', avatarId: 'ash' };
const OPERATOR: FloorIdentity = { userId: 'u.op', callSign: 'Kestrel', avatarId: 'birch' };

function seatedRoom(): RoomSession {
  const room = scheduleRoom({
    scenarioId: 'ridgeline',
    difficulty: 'beginner',
    startsAt: START,
    visibility: 'open',
    host: LEAD,
    now: NOW,
  });
  // The host is seated as lead at schedule time; add one specialist.
  return takeSeat(room, 'soc-operator', OPERATOR, SEATING_OPEN);
}

describe('the clock', () => {
  it('runs from the room start, not from when somebody looked', () => {
    const room = seatedRoom();
    expect(elapsedSeconds(room, RUNNING)).toBe(300);
  });

  /*
   * Somebody who opens the page before kickoff is at zero rather than at a
   * negative number, because a board that counts down would deliver events in
   * reverse on the way in.
   */
  it('does not run backwards before the start', () => {
    const room = seatedRoom();
    expect(elapsedSeconds(room, NOW)).toBe(0);
  });
});

describe('starting a shift', () => {
  it('is the lead\'s to start', () => {
    const room = seatedRoom();
    expect(canStart(room, LEAD.userId, RUNNING).ok).toBe(true);
    const denied = canStart(room, OPERATOR.userId, RUNNING);
    expect(denied.ok).toBe(false);
    expect(denied.ok === false && denied.reason).toContain('incident lead');
  });

  it('refuses a room whose window has passed', () => {
    const room = seatedRoom();
    const tooLate = new Date('2026-09-02T19:45:00Z');
    expect(canStart(room, LEAD.userId, tooLate).ok).toBe(false);
  });

  it('will not start twice', () => {
    const running = startShift(seatedRoom(), LEAD.userId, RUNNING);
    expect(() => startShift(running, LEAD.userId, RUNNING)).toThrow(RoomError);
  });
});

describe('a seat board', () => {
  /*
   * The whole projection model rests on this. If a board ever carried the
   * events of a surface the seat does not hold, every scenario in the
   * catalogue would be solvable from one chair.
   */
  it('carries only what that seat can see', () => {
    const running = startShift(seatedRoom(), LEAD.userId, RUNNING);
    const operator = boardFor(running, 'soc-operator', RUNNING);
    const lead = boardFor(running, 'ir-lead', RUNNING);
    // The lead sees every surface; the operator sees the queue alone, so the
    // operator's board must be a strict subset.
    const leadIds = new Set(lead.events.map((e) => e.id));
    for (const event of operator.events) expect(leadIds.has(event.id)).toBe(true);
    expect(operator.events.length).toBeLessThan(lead.events.length);
  });

  it('is empty until the shift starts, and the brief is not', () => {
    const room = seatedRoom();
    const board = boardFor(room, 'soc-operator', RUNNING);
    expect(board.events).toEqual([]);
    expect(board.briefing).not.toBeNull();
  });

  it('delivers events as the clock reaches them', () => {
    const running = startShift(seatedRoom(), LEAD.userId, RUNNING);
    const early = boardFor(running, 'ir-lead', new Date('2026-09-02T19:00:30Z'));
    const later = boardFor(running, 'ir-lead', new Date('2026-09-02T19:20:00Z'));
    expect(later.events.length).toBeGreaterThan(early.events.length);
  });
});

describe('committing a claim', () => {
  function runningRoom(): RoomSession {
    return startShift(seatedRoom(), LEAD.userId, RUNNING);
  }
  const good = {
    disposition: 'escalate' as const,
    reasoning: 'No failed attempt preceded the success, so they already had the credential.',
    actionIds: [],
    escalateTo: null,
    confidence: 70,
  };

  it('accepts a claim on an event the seat can see', () => {
    const room = runningRoom();
    const eventId = boardFor(room, 'ir-lead', RUNNING).events[0]!.id;
    const claim = buildClaim(room, 'ir-lead', LEAD.userId, { ...good, eventId }, RUNNING);
    expect(claim.atSeconds).toBe(300);
    expect(claim.role).toBe('ir-lead');
  });

  /*
   * The two ways to score an event without doing the exercise: claim one that
   * belongs to another seat's surface, or claim one that has not arrived. Both
   * are refused with the same wording, because a distinct message for each
   * would tell the seat which it was and so tell them about a board they
   * cannot see.
   */
  it('refuses an event that is not on this seat\'s surfaces', () => {
    const room = runningRoom();
    const leadOnly = boardFor(room, 'ir-lead', RUNNING).events;
    const operatorIds = new Set(boardFor(room, 'soc-operator', RUNNING).events.map((e) => e.id));
    const hidden = leadOnly.find((e) => !operatorIds.has(e.id));
    expect(hidden).toBeDefined();
    expect(() =>
      buildClaim(room, 'soc-operator', OPERATOR.userId, { ...good, eventId: hidden!.id }, RUNNING),
    ).toThrow(/not on your board/);
  });

  it('refuses an event that has not happened yet', () => {
    const room = runningRoom();
    const scenario = SCENARIOS.find((s) => s.id === 'ridgeline')!;
    const future = scenario.events[scenario.events.length - 1]!;
    const justStarted = new Date('2026-09-02T19:00:10Z');
    expect(() =>
      buildClaim(room, 'ir-lead', LEAD.userId, { ...good, eventId: future.id }, justStarted),
    ).toThrow(/not on your board/);
  });

  it('refuses a claim from somebody else\'s chair', () => {
    const room = runningRoom();
    const eventId = boardFor(room, 'ir-lead', RUNNING).events[0]!.id;
    expect(() =>
      buildClaim(room, 'ir-lead', OPERATOR.userId, { ...good, eventId }, RUNNING),
    ).toThrow(/your own seat/);
  });

  it('refuses a claim with no reasoning, because the review reads it back', () => {
    const room = runningRoom();
    const eventId = boardFor(room, 'ir-lead', RUNNING).events[0]!.id;
    expect(() =>
      buildClaim(room, 'ir-lead', LEAD.userId, { ...good, eventId, reasoning: 'bad' }, RUNNING),
    ).toThrow(/Say why/);
  });

  it('refuses a claim before the shift is running', () => {
    const room = seatedRoom();
    expect(() =>
      buildClaim(room, 'ir-lead', LEAD.userId, { ...good, eventId: 'ev.1' }, RUNNING),
    ).toThrow(/not running/);
  });
});

describe('closing a shift', () => {
  it('is the lead\'s call and nobody else\'s', () => {
    const running = startShift(seatedRoom(), LEAD.userId, RUNNING);
    expect(canClose(running, OPERATOR.userId).ok).toBe(false);
    expect(canClose(running, LEAD.userId).ok).toBe(true);
    expect(closeShift(running, LEAD.userId).status).toBe('complete');
  });

  /*
   * Deliberately permissive about progress. Deciding you have enough of the
   * picture is part of the job being taught, so a floor that has worked three
   * events and wants to stop is allowed to.
   */
  it('does not require every event to have been worked', () => {
    const running = startShift(seatedRoom(), LEAD.userId, new Date('2026-09-02T19:00:05Z'));
    expect(canClose(running, LEAD.userId).ok).toBe(true);
  });
});

describe('every scenario can actually be run', () => {
  /*
   * The point of the run loop is that all of them are playable, not that one
   * is. This is the test that catches a scenario whose lead chair or event
   * schedule would leave a room unable to start or unable to show anybody
   * anything.
   */
  it('starts, delivers to the lead, and closes, for all of them', () => {
    for (const scenario of SCENARIOS) {
      const room = scheduleRoom({
        scenarioId: scenario.id,
        difficulty: scenario.difficulty,
        startsAt: START,
        visibility: 'open',
        host: LEAD,
        now: NOW,
      });
      const running = startShift(room, LEAD.userId, RUNNING);
      const board = boardFor(running, 'ir-lead', RUNNING);
      expect(board.events.length, `${scenario.id} showed the lead nothing at 5 minutes`).toBeGreaterThan(0);
      expect(board.briefing, `${scenario.id} has no lead briefing`).not.toBeNull();
      expect(closeShift(running, LEAD.userId).status).toBe('complete');
    }
  });
});
