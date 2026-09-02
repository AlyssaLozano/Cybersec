/**
 * The event centre: creating things, listing them, and saying you will be there.
 *
 * WHY CAPACITY ONLY GATES "GOING"
 *
 * A full session that refuses every further answer throws away the one piece of
 * information the host most needs: that a second sitting is worth running.
 * Interest is always accepted, and it is the number that tells somebody to
 * schedule again.
 *
 * WHY A CANCELLED EVENT STAYS
 *
 * People planned around it. Deleting the row means everybody who said they were
 * going finds out by turning up, which is the worst possible way to be told.
 * Cancelling stamps a time and leaves the entry on the calendar, struck
 * through, with whoever said they were going still able to see it.
 */

import type {
  CommunityEvent,
  EventAudience,
  EventKind,
  FloorIdentity,
  RsvpStatus,
  UserRole,
} from '@soc/shared';
import { checkEvent, isAvatarId } from '@soc/shared';

import { prisma } from '../db/client.js';

export class EventError extends Error {}

export interface CreateEventInput {
  title: string;
  description: string;
  kind: EventKind;
  audience: EventAudience;
  startsAt: string;
  durationMinutes: number;
  roomId: string | null;
  capacity: number | null;
}

interface EventRow {
  id: string;
  title: string;
  description: string;
  kind: string;
  audience: string;
  startsAt: Date;
  durationMinutes: number;
  hostUserId: string;
  hostCallSign: string;
  hostAvatarId: string;
  roomId: string | null;
  capacity: number | null;
  cancelledAt: Date | null;
  createdAt: Date;
}

function rowToEvent(
  row: EventRow,
  counts: { going: number; interested: number },
  myRsvp: RsvpStatus | null,
  viewerId: string,
): CommunityEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    kind: row.kind as EventKind,
    audience: row.audience as EventAudience,
    startsAt: row.startsAt.toISOString(),
    durationMinutes: row.durationMinutes,
    host: {
      userId: row.hostUserId,
      callSign: row.hostCallSign,
      avatarId: isAvatarId(row.hostAvatarId) ? row.hostAvatarId : 'ash',
    },
    roomId: row.roomId,
    capacity: row.capacity,
    cancelledAt: row.cancelledAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    goingCount: counts.going,
    interestedCount: counts.interested,
    myRsvp,
    mine: row.hostUserId === viewerId,
  };
}

/**
 * RSVP tallies for a set of events, in one query.
 *
 * The calendar renders sixty events at a time, and a count per event would be
 * sixty queries per page turn.
 */
async function tallies(
  eventIds: readonly string[],
  viewerId: string,
): Promise<{
  counts: Map<string, { going: number; interested: number }>;
  mine: Map<string, RsvpStatus>;
}> {
  const counts = new Map<string, { going: number; interested: number }>();
  const mine = new Map<string, RsvpStatus>();
  if (eventIds.length === 0) return { counts, mine };

  const grouped = await prisma.eventRsvp.groupBy({
    by: ['eventId', 'status'],
    where: { eventId: { in: [...eventIds] } },
    _count: { _all: true },
  });
  for (const row of grouped) {
    const entry = counts.get(row.eventId) ?? { going: 0, interested: 0 };
    if (row.status === 'going') entry.going = row._count._all;
    else entry.interested = row._count._all;
    counts.set(row.eventId, entry);
  }

  const own = await prisma.eventRsvp.findMany({
    where: { eventId: { in: [...eventIds] }, userId: viewerId },
    select: { eventId: true, status: true },
  });
  for (const row of own) mine.set(row.eventId, row.status as RsvpStatus);

  return { counts, mine };
}

async function project(rows: EventRow[], viewerId: string): Promise<CommunityEvent[]> {
  const { counts, mine } = await tallies(
    rows.map((row) => row.id),
    viewerId,
  );
  return rows.map((row) =>
    rowToEvent(row, counts.get(row.id) ?? { going: 0, interested: 0 }, mine.get(row.id) ?? null, viewerId),
  );
}

export interface ListEventsQuery {
  /** ISO 8601. Defaults to the start of today in UTC. */
  from?: string;
  /** ISO 8601. Defaults to the horizon. */
  to?: string;
  /** Narrow to one crowd. 'all'-audience events always come back too. */
  audience?: EventAudience;
  kind?: EventKind;
}

/**
 * Events in a window.
 *
 * An 'all' event is returned whatever the audience filter says, because
 * filtering it out would hide the platform-wide things from exactly the people
 * who filtered, which is the opposite of what a filter is for.
 */
export async function listEvents(
  query: ListEventsQuery,
  viewerId: string,
  now: Date,
): Promise<CommunityEvent[]> {
  const from = query.from ? new Date(query.from) : new Date(now.getTime() - 12 * 60 * 60 * 1000);
  const to = query.to ? new Date(query.to) : new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    throw new EventError('That date range is not valid.');
  }

  const rows = await prisma.communityEvent.findMany({
    where: {
      startsAt: { gte: from, lte: to },
      ...(query.kind ? { kind: query.kind } : {}),
      ...(query.audience && query.audience !== 'all'
        ? { audience: { in: [query.audience, 'all'] } }
        : {}),
    },
    orderBy: { startsAt: 'asc' },
    take: 200,
  });

  return project(rows, viewerId);
}

export async function getEvent(eventId: string, viewerId: string): Promise<CommunityEvent | null> {
  const row = await prisma.communityEvent.findUnique({ where: { id: eventId } });
  if (!row) return null;
  return (await project([row], viewerId))[0] ?? null;
}

/**
 * Put something on the calendar.
 *
 * The host is marked as going straight away. An event whose own host has not
 * said they are coming reads as abandoned, and there is no world in which they
 * are not attending the thing they just scheduled.
 */
export async function createEvent(
  host: FloorIdentity,
  input: CreateEventInput,
  now: Date,
): Promise<CommunityEvent> {
  const check = checkEvent(input, now);
  if (!check.ok) throw new EventError(check.problem ?? 'That event will not work.');

  // A ceiling on how much of the calendar one person can occupy. Not a
  // suspicion of anybody in particular: a calendar where one host holds every
  // slot stops being a community calendar.
  const upcoming = await prisma.communityEvent.count({
    where: { hostUserId: host.userId, startsAt: { gte: now }, cancelledAt: null },
  });
  if (upcoming >= 10) {
    throw new EventError('You already have ten events coming up. Run some of those first.');
  }

  if (input.roomId) {
    const room = await prisma.roomSession.findUnique({ where: { id: input.roomId } });
    if (!room) throw new EventError('That war room does not exist.');
  }

  const row = await prisma.communityEvent.create({
    data: {
      title: input.title.trim(),
      description: input.description.trim(),
      kind: input.kind,
      audience: input.audience,
      startsAt: new Date(input.startsAt),
      durationMinutes: input.durationMinutes,
      hostUserId: host.userId,
      hostCallSign: host.callSign,
      hostAvatarId: host.avatarId,
      roomId: input.roomId,
      capacity: input.capacity,
    },
  });

  await prisma.eventRsvp.create({
    data: { eventId: row.id, userId: host.userId, status: 'going' },
  });

  return (await project([row], host.userId))[0]!;
}

/**
 * Answer, or change your answer.
 *
 * Capacity is checked here rather than trusted from the client, and it is
 * checked against the live count rather than a cached one: two people taking
 * the last seat four hundred milliseconds apart is exactly the case a
 * client-side check misses.
 */
export async function setRsvp(
  eventId: string,
  userId: string,
  status: RsvpStatus,
  now: Date,
): Promise<CommunityEvent> {
  const row = await prisma.communityEvent.findUnique({ where: { id: eventId } });
  if (!row) throw new EventError('No such event.');
  if (row.cancelledAt) throw new EventError('That event was cancelled.');
  if (row.startsAt.getTime() + row.durationMinutes * 60_000 < now.getTime()) {
    throw new EventError('That event has already finished.');
  }

  if (status === 'going' && row.capacity !== null) {
    const existing = await prisma.eventRsvp.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (existing?.status !== 'going') {
      const going = await prisma.eventRsvp.count({ where: { eventId, status: 'going' } });
      if (going >= row.capacity) {
        throw new EventError('This is full. Mark interest and the host will see the demand.');
      }
    }
  }

  await prisma.eventRsvp.upsert({
    where: { eventId_userId: { eventId, userId } },
    create: { eventId, userId, status },
    update: { status },
  });

  return (await project([row], userId))[0]!;
}

export async function withdrawRsvp(eventId: string, userId: string): Promise<CommunityEvent> {
  const row = await prisma.communityEvent.findUnique({ where: { id: eventId } });
  if (!row) throw new EventError('No such event.');
  await prisma.eventRsvp.deleteMany({ where: { eventId, userId } });
  return (await project([row], userId))[0]!;
}

/**
 * Call it off.
 *
 * The host, or a reviewer. A reviewer needs it because the alternative to
 * removing something that should not be on a shared calendar is leaving it
 * there.
 */
export async function cancelEvent(
  eventId: string,
  userId: string,
  role: UserRole,
  now: Date,
): Promise<CommunityEvent> {
  const row = await prisma.communityEvent.findUnique({ where: { id: eventId } });
  if (!row) throw new EventError('No such event.');
  const privileged = role === 'admin' || role === 'instructor';
  if (row.hostUserId !== userId && !privileged) {
    throw new EventError('Only the host can cancel this.');
  }
  if (row.cancelledAt) return (await project([row], userId))[0]!;

  const updated = await prisma.communityEvent.update({
    where: { id: eventId },
    data: { cancelledAt: now },
  });
  return (await project([updated], userId))[0]!;
}
