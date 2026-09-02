/**
 * The event centre: things people schedule for each other.
 *
 * WHY THIS IS NOT THE WAR ROOM SCHEDULE
 *
 * A war room is one scenario, one tier, one seat chart, and joining it means
 * taking a chair. Most of what a group of career changers wants to arrange is
 * not that: a study hour before an exam, somebody walking through their
 * portfolio, a Saturday of mock interviews, a watch-along of a public CTF. None
 * of those have seats, scenarios, or a grader, and forcing them through the
 * room scheduler would mean inventing a fake scenario for each one.
 *
 * So an event is the loose thing, and it can POINT AT a war room when that is
 * what it is for. "SOC room, Thursday 8pm, come and take the network chair" is
 * an event with a roomId; the room is still the room.
 *
 * WHY THERE IS NO LINK FIELD
 *
 * The obvious next field is a URL, and on a platform that teaches people to
 * recognise phishing, a user-posted link in a feed strangers read is the exact
 * thing being taught about. It would also be the first place an account
 * compromise gets monetised. An event points at things inside the platform or
 * at nothing, and the description says where to meet in words.
 */

import type { FloorIdentity } from './rooms.js';
import type { LobbyDoorId } from './lobby.js';

/**
 * What kind of thing this is.
 *
 * The kind is what somebody scans the calendar for: a person with two free
 * hours is looking for a study group, and a person a week from an interview is
 * looking for mock interviews. It is not decoration, it is the filter.
 */
export const EVENT_KINDS = [
  'war-room',
  'study-group',
  'mock-interview',
  'walkthrough',
  'ctf',
  'ama',
  'social',
] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

export const EVENT_KIND_LABELS: Record<EventKind, string> = {
  'war-room': 'War room',
  'study-group': 'Study group',
  'mock-interview': 'Mock interviews',
  walkthrough: 'Walkthrough',
  ctf: 'CTF',
  ama: 'Ask me anything',
  social: 'Social',
};

/** Which crowd it is aimed at. 'all' is the honest default. */
export type EventAudience = LobbyDoorId | 'all';

export const RSVP_STATUSES = ['going', 'interested'] as const;
export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export interface CommunityEvent {
  id: string;
  title: string;
  /** What will happen and where to meet, in the host's own words. */
  description: string;
  kind: EventKind;
  audience: EventAudience;
  /** ISO 8601, UTC. Rendered in the viewer's zone; never stored in one. */
  startsAt: string;
  durationMinutes: number;
  host: FloorIdentity;
  /**
   * The war room this event is for, when it is for one.
   *
   * A plain id rather than a relation: an event outlives the room it pointed
   * at, and a cascade that deleted somebody's calendar entry because a room was
   * cancelled would be worse than a dangling reference the client can render as
   * "that room is gone".
   */
  roomId: string | null;
  /** Null means no limit, which is the common case. */
  capacity: number | null;
  /** ISO 8601 once cancelled. A cancelled event stays visible, struck through. */
  cancelledAt: string | null;
  createdAt: string;
  goingCount: number;
  interestedCount: number;
  /** This viewer's own answer, or null. */
  myRsvp: RsvpStatus | null;
  /** Whether this viewer created it, so the client can offer cancel. */
  mine: boolean;
}

export const EVENT_TITLE_MAX = 70;
export const EVENT_DESCRIPTION_MIN = 20;
export const EVENT_DESCRIPTION_MAX = 700;
export const EVENT_DURATION_MIN = 15;
export const EVENT_DURATION_MAX = 480;
/**
 * How far ahead somebody may schedule.
 *
 * A year out is not a plan, it is a row that will be stale and misleading long
 * before it arrives, and a calendar full of those is a calendar nobody trusts.
 */
export const EVENT_HORIZON_DAYS = 120;

export interface EventCheck {
  ok: boolean;
  problem: string | null;
}

/**
 * Whether an event can be created.
 *
 * Pure, and takes `now` rather than reading the clock, so the rules are
 * testable and the server owns the time.
 */
export function checkEvent(
  input: {
    title: string;
    description: string;
    startsAt: string;
    durationMinutes: number;
    capacity: number | null;
  },
  now: Date,
): EventCheck {
  const title = input.title.trim();
  if (title.length < 4) return { ok: false, problem: 'Give it a title people can scan.' };
  if (title.length > EVENT_TITLE_MAX) {
    return { ok: false, problem: `Titles are at most ${EVENT_TITLE_MAX} characters.` };
  }

  const description = input.description.trim();
  if (description.length < EVENT_DESCRIPTION_MIN) {
    return {
      ok: false,
      problem: `Say what will happen and where to meet, in at least ${EVENT_DESCRIPTION_MIN} characters.`,
    };
  }
  if (description.length > EVENT_DESCRIPTION_MAX) {
    return { ok: false, problem: `Keep the description under ${EVENT_DESCRIPTION_MAX} characters.` };
  }

  const startsAt = new Date(input.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return { ok: false, problem: 'That start time is not a valid date.' };
  }
  if (startsAt.getTime() <= now.getTime()) {
    return { ok: false, problem: 'That start time has already passed.' };
  }
  const horizon = now.getTime() + EVENT_HORIZON_DAYS * 24 * 60 * 60 * 1000;
  if (startsAt.getTime() > horizon) {
    return { ok: false, problem: `Schedule it within the next ${EVENT_HORIZON_DAYS} days.` };
  }

  if (
    !Number.isInteger(input.durationMinutes) ||
    input.durationMinutes < EVENT_DURATION_MIN ||
    input.durationMinutes > EVENT_DURATION_MAX
  ) {
    return {
      ok: false,
      problem: `Run it for between ${EVENT_DURATION_MIN} and ${EVENT_DURATION_MAX} minutes.`,
    };
  }

  if (input.capacity !== null) {
    if (!Number.isInteger(input.capacity) || input.capacity < 2 || input.capacity > 200) {
      return { ok: false, problem: 'A capacity, if you set one, is between 2 and 200.' };
    }
  }

  return { ok: true, problem: null };
}

/**
 * Whether somebody can still say they are going.
 *
 * Capacity only ever gates 'going'. Marking interest in a full event is how
 * somebody finds out a second sitting is worth running, so refusing that would
 * throw away the signal.
 */
export function canSayGoing(event: CommunityEvent): EventCheck {
  if (event.cancelledAt) return { ok: false, problem: 'This was cancelled.' };
  if (event.myRsvp === 'going') return { ok: true, problem: null };
  if (event.capacity !== null && event.goingCount >= event.capacity) {
    return { ok: false, problem: 'This is full. Mark interest and the host will see the demand.' };
  }
  return { ok: true, problem: null };
}

/**
 * One day on the calendar grid.
 *
 * The grid is built client-side from a flat listing because the server has no
 * business knowing which month somebody is looking at, and a month endpoint
 * would have to take a timezone to be correct about which day an event is on.
 */
export interface CalendarDay {
  /** Local date key, YYYY-MM-DD in the viewer's zone. */
  date: string;
  events: CommunityEvent[];
}

/**
 * Group events into local days.
 *
 * The zone matters: an 8pm Thursday event in New York is Friday in UTC, and a
 * calendar that puts it on Friday is wrong for the person reading it. Dates are
 * derived here, from the viewer's own clock, and never stored.
 */
export function groupByLocalDay(events: readonly CommunityEvent[]): CalendarDay[] {
  const byDate = new Map<string, CommunityEvent[]>();
  for (const event of events) {
    const when = new Date(event.startsAt);
    const key = [
      when.getFullYear(),
      String(when.getMonth() + 1).padStart(2, '0'),
      String(when.getDate()).padStart(2, '0'),
    ].join('-');
    const bucket = byDate.get(key);
    if (bucket) bucket.push(event);
    else byDate.set(key, [event]);
  }
  return [...byDate.entries()]
    .map(([date, dayEvents]) => ({
      date,
      events: [...dayEvents].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
