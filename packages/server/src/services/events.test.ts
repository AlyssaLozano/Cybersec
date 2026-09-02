import { describe, expect, it } from 'vitest';

import {
  EVENT_DESCRIPTION_MIN,
  EVENT_HORIZON_DAYS,
  EVENT_KINDS,
  EVENT_KIND_LABELS,
  canSayGoing,
  checkEvent,
  groupByLocalDay,
} from '@soc/shared';
import type { CommunityEvent } from '@soc/shared';

const NOW = new Date('2026-09-02T18:00:00Z');

function draft(overrides: Partial<Parameters<typeof checkEvent>[0]> = {}) {
  return {
    title: 'Thursday SOC room',
    description: 'We will take the network and forensics chairs and run the Ridgeline incident.',
    startsAt: '2026-09-04T19:00:00.000Z',
    durationMinutes: 90,
    capacity: null as number | null,
    ...overrides,
  };
}

describe('scheduling an event', () => {
  it('accepts a sensible one', () => {
    expect(checkEvent(draft(), NOW).ok).toBe(true);
  });

  it('refuses one in the past, because nobody can attend it', () => {
    expect(checkEvent(draft({ startsAt: '2026-09-01T19:00:00.000Z' }), NOW).ok).toBe(false);
  });

  /*
   * A year out is not a plan, it is a row that will be stale long before it
   * arrives, and a calendar full of those is a calendar nobody trusts.
   */
  it('refuses one past the horizon', () => {
    const far = new Date(NOW.getTime() + (EVENT_HORIZON_DAYS + 2) * 24 * 60 * 60 * 1000);
    const result = checkEvent(draft({ startsAt: far.toISOString() }), NOW);
    expect(result.ok).toBe(false);
    expect(result.problem).toContain(String(EVENT_HORIZON_DAYS));
  });

  it('refuses a description too thin to turn up to', () => {
    const result = checkEvent(draft({ description: 'come along' }), NOW);
    expect(result.ok).toBe(false);
    expect(result.problem).toContain(String(EVENT_DESCRIPTION_MIN));
  });

  it('refuses an unrunnable duration', () => {
    expect(checkEvent(draft({ durationMinutes: 5 }), NOW).ok).toBe(false);
    expect(checkEvent(draft({ durationMinutes: 900 }), NOW).ok).toBe(false);
    expect(checkEvent(draft({ durationMinutes: 45.5 }), NOW).ok).toBe(false);
  });

  it('refuses a capacity that is not a real number of people', () => {
    expect(checkEvent(draft({ capacity: 1 }), NOW).ok).toBe(false);
    expect(checkEvent(draft({ capacity: 12 }), NOW).ok).toBe(true);
  });

  it('refuses an unreadable date rather than storing NaN', () => {
    expect(checkEvent(draft({ startsAt: 'thursday-ish' }), NOW).ok).toBe(false);
  });
});

function event(overrides: Partial<CommunityEvent> = {}): CommunityEvent {
  return {
    id: 'e1',
    title: 'Thursday SOC room',
    description: 'Running the Ridgeline incident together.',
    kind: 'war-room',
    audience: 'soc',
    startsAt: '2026-09-04T19:00:00.000Z',
    durationMinutes: 90,
    host: { userId: 'u.host', callSign: 'Cinder', avatarId: 'ash' },
    roomId: null,
    capacity: null,
    cancelledAt: null,
    createdAt: '2026-09-02T10:00:00.000Z',
    goingCount: 0,
    interestedCount: 0,
    myRsvp: null,
    mine: false,
    ...overrides,
  };
}

describe('saying you will be there', () => {
  it('lets somebody in when there is room', () => {
    expect(canSayGoing(event({ capacity: 6, goingCount: 3 })).ok).toBe(true);
  });

  it('refuses when full, and says to mark interest instead', () => {
    const result = canSayGoing(event({ capacity: 6, goingCount: 6 }));
    expect(result.ok).toBe(false);
    expect(result.problem).toContain('interest');
  });

  /*
   * Capacity must not push somebody out of a seat they already hold: they are
   * counted in goingCount, so a naive check would refuse them their own place.
   */
  it('does not refuse somebody who is already going to a full event', () => {
    expect(canSayGoing(event({ capacity: 6, goingCount: 6, myRsvp: 'going' })).ok).toBe(true);
  });

  it('refuses a cancelled event', () => {
    expect(canSayGoing(event({ cancelledAt: '2026-09-03T09:00:00.000Z' })).ok).toBe(false);
  });
});

describe('the calendar grid', () => {
  it('groups by the local day and orders within it', () => {
    const days = groupByLocalDay([
      event({ id: 'late', startsAt: '2026-09-04T22:00:00.000Z' }),
      event({ id: 'early', startsAt: '2026-09-04T13:00:00.000Z' }),
      event({ id: 'next', startsAt: '2026-09-06T13:00:00.000Z' }),
    ]);
    expect(days).toHaveLength(2);
    expect(days[0]!.events.map((e) => e.id)).toEqual(['early', 'late']);
    expect(days[1]!.events.map((e) => e.id)).toEqual(['next']);
  });

  /*
   * The day key comes from the viewer's own clock, so an evening event does not
   * jump to the following day for anybody west of UTC.
   */
  it('keys days off the local date, not the UTC one', () => {
    const when = new Date('2026-09-04T19:00:00.000Z');
    const expected = [
      when.getFullYear(),
      String(when.getMonth() + 1).padStart(2, '0'),
      String(when.getDate()).padStart(2, '0'),
    ].join('-');
    expect(groupByLocalDay([event()])[0]!.date).toBe(expected);
  });

  it('returns nothing for an empty month', () => {
    expect(groupByLocalDay([])).toEqual([]);
  });
});

describe('event kinds', () => {
  it('labels every kind, so no filter chip renders a raw slug', () => {
    for (const kind of EVENT_KINDS) {
      expect(EVENT_KIND_LABELS[kind], kind).toBeTruthy();
    }
  });
});
