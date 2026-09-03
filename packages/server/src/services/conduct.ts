/**
 * Conduct reports, room ejection, and account-level consequences.
 *
 * The rules and the reasoning behind every threshold live in
 * `moderation.ts` in @soc/shared, which is pure and testable without a
 * database. This file is where they meet the tables, and it is responsible for
 * three things that a rule on its own cannot guarantee.
 *
 * THE THRESHOLD IS COUNTED FROM THE DATABASE, NOT FROM A CACHE
 *
 * Two people can press the button in the same second. Counting distinct
 * reporters after the write, inside the same call that did the write, is what
 * makes both of those posts see each other. The unique constraint on
 * (room, reporter, subject) does the other half: a second click from one
 * person cannot become a second vote no matter how it is timed.
 *
 * EJECTION IS RECORDED SEPARATELY FROM THE REPORTS THAT CAUSED IT
 *
 * Account-level action counts ejections, and an ejection is a fact about a
 * room that happened. If it were recomputed from live report counts, a
 * reviewer dismissing one report out of four would silently rewrite an
 * account's history months later. Reversing an ejection is a deliberate act
 * with its own flag, and everything else leaves it alone.
 *
 * NOTHING HERE TOUCHES THE LEARNING PLATFORM
 *
 * The only account fields written are the two war room ones. Progress,
 * badges, portfolio and the assessment are all untouched, on purpose: see the
 * header of the shared module for why removing those makes the platform worse
 * at the thing it is for.
 */

import {
  BAN_AFTER_EJECTIONS,
  EJECTION_WINDOW_DAYS,
  SUSPENSION_DAYS,
  conductAction,
  ejectionThreshold,
  reportReason,
} from '@soc/shared';
import type {
  ConductReport,
  ReportContext,
  ReportOutcome,
  ReportReceipt,
  ReportSpace,
  RoomAccess,
} from '@soc/shared';

import { prisma } from '../db/client.js';

export class ConductError extends Error {
  constructor(
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
    this.name = 'ConductError';
  }
}

const DAY_MS = 86_400_000;

function windowStart(now: Date): Date {
  return new Date(now.getTime() - EJECTION_WINDOW_DAYS * DAY_MS);
}

/* -- entering a room ---------------------------------------------------- */

/**
 * Whether this account may enter any shared room right now.
 *
 * Also lets a lapsed suspension go. Clearing it here rather than on a schedule
 * means there is no job to forget to run and no window where somebody is
 * refused a room the day after their suspension ended, which is the failure
 * people remember.
 */
export async function roomAccess(userId: string, now: Date = new Date()): Promise<RoomAccess> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { roomsBanned: true, roomsSuspendedUntil: true },
  });
  if (!user) return { allowed: false, problem: 'No such account.', until: null };

  if (user.roomsBanned) {
    return {
      allowed: false,
      problem:
        'War room access is on hold while somebody reviews reports from rooms you were in. ' +
        'The rest of the platform is unaffected, and your progress is untouched.',
      until: null,
    };
  }

  if (user.roomsSuspendedUntil) {
    if (user.roomsSuspendedUntil > now) {
      return {
        allowed: false,
        problem:
          'War room access is suspended after reports from more than one room. ' +
          'The rest of the platform is unaffected, and your progress is untouched.',
        until: user.roomsSuspendedUntil.toISOString(),
      };
    }
    await prisma.user.update({ where: { id: userId }, data: { roomsSuspendedUntil: null } });
  }

  return { allowed: true, problem: null, until: null };
}

/**
 * Whether this person was removed from this specific room.
 *
 * Separate from `roomAccess` because it is a much narrower thing: somebody
 * ejected from one room this morning may join a different one this afternoon,
 * and should. One bad room is not an account-level finding, which is exactly
 * the distinction the two-tier design exists to preserve.
 */
export async function ejectedFrom(roomId: string, userId: string): Promise<boolean> {
  const row = await prisma.roomEjection.findUnique({
    where: { roomId_userId: { roomId, userId } },
    select: { reversed: true },
  });
  return row !== null && !row.reversed;
}

/** Every room this person is currently barred from, for a client to grey out. */
export async function ejectedRoomIds(userId: string): Promise<string[]> {
  const rows = await prisma.roomEjection.findMany({
    where: { userId, reversed: false },
    select: { roomId: true },
  });
  return rows.map((r) => r.roomId);
}

/* -- making a report ---------------------------------------------------- */

export interface ReportInput {
  space: ReportSpace;
  roomId: string;
  reporterUserId: string;
  subjectUserId: string;
  reason: string;
  note: string;
  /** Assembled by the caller from the room, never from the browser. */
  context: ReportContext;
}

/**
 * Record one report and act on it if it was the one that tipped the room.
 *
 * The refusals here are the load-bearing part. Reporting yourself is not a
 * mistake worth a friendly message, it is the first thing somebody tries when
 * probing what the button does, and so is reporting from outside the room.
 */
export async function submitReport(input: ReportInput, now: Date = new Date()): Promise<ReportReceipt> {
  if (input.reporterUserId === input.subjectUserId) {
    throw new ConductError('You cannot report yourself.', 400);
  }
  if (!reportReason(input.reason)) {
    throw new ConductError('Pick one of the listed reasons.', 400);
  }

  // Upsert rather than create, so a second press from the same person is a
  // quiet no-op instead of an error page. They may have changed their mind
  // about the category, so the newer reason and note win; the row, and
  // therefore the count, does not move.
  const existing = await prisma.conductReport.findUnique({
    where: {
      roomId_reporterUserId_subjectUserId: {
        roomId: input.roomId,
        reporterUserId: input.reporterUserId,
        subjectUserId: input.subjectUserId,
      },
    },
    select: { id: true },
  });

  await prisma.conductReport.upsert({
    where: {
      roomId_reporterUserId_subjectUserId: {
        roomId: input.roomId,
        reporterUserId: input.reporterUserId,
        subjectUserId: input.subjectUserId,
      },
    },
    create: {
      space: input.space,
      roomId: input.roomId,
      reporterUserId: input.reporterUserId,
      subjectUserId: input.subjectUserId,
      reason: input.reason,
      note: input.note.trim(),
      contextJson: JSON.stringify(input.context),
    },
    update: {
      reason: input.reason,
      note: input.note.trim(),
      contextJson: JSON.stringify(input.context),
    },
  });

  const removed = await evaluateRoom(input.space, input.roomId, input.subjectUserId, input.context.occupants, now);

  return {
    recorded: existing === null,
    removedFromRoom: removed,
    /*
     * Deliberately identical whether this was the first report or the one
     * that tipped it, and it never says how many others have reported.
     *
     * A reporter who is told "one more and they are out" has been handed a
     * countdown, and the person told "two people have reported you" starts
     * working out which two. The reporter learns that something happened; the
     * room shows them the rest.
     */
    message:
      'Reported. Somebody will read this. If several people in the room report the same ' +
      'person, the room removes them automatically.',
  };
}

/**
 * Has this person been reported by enough different people in this room.
 *
 * Returns whether they were removed by this call, so the reporter can be told
 * something true without being told a count.
 */
async function evaluateRoom(
  space: ReportSpace,
  roomId: string,
  subjectUserId: string,
  occupants: number,
  now: Date,
): Promise<boolean> {
  if (await ejectedFrom(roomId, subjectUserId)) return false;

  const reports = await prisma.conductReport.findMany({
    where: { roomId, subjectUserId, outcome: { not: 'dismissed' } },
    select: { reporterUserId: true, reason: true },
  });

  // Distinct reporters, which is what the rule is written in terms of. The
  // unique constraint should already guarantee it; counting distinctly anyway
  // means a future change to that key cannot quietly turn one person into
  // three votes.
  const reporters = new Set(reports.map((r) => r.reporterUserId)).size;
  if (reporters < ejectionThreshold(occupants)) return false;

  await prisma.roomEjection.create({
    data: { space, roomId, userId: subjectUserId, reason: commonestReason(reports), reporters },
  });

  await evaluateAccount(subjectUserId, now);
  return true;
}

/** The reason most of the reporters picked, for the review queue to sort by. */
function commonestReason(reports: { reason: string }[]): string {
  const tally = new Map<string, number>();
  for (const r of reports) tally.set(r.reason, (tally.get(r.reason) ?? 0) + 1);
  let best = 'other';
  let bestCount = 0;
  for (const [reason, count] of tally) {
    if (count > bestCount) {
      best = reason;
      bestCount = count;
    }
  }
  return best;
}

/**
 * Suspend or hold the account, if enough separate rooms have ejected them.
 *
 * Idempotent: it recomputes from the standing ejections rather than
 * incrementing, so running it twice cannot stack two suspensions, and a
 * reviewer reversing an ejection genuinely lowers the count.
 */
export async function evaluateAccount(userId: string, now: Date = new Date()): Promise<void> {
  const ejections = await prisma.roomEjection.count({
    where: { userId, reversed: false, createdAt: { gte: windowStart(now) } },
  });

  const action = conductAction(ejections);
  if (action === 'ban') {
    await prisma.user.update({ where: { id: userId }, data: { roomsBanned: true } });
    return;
  }
  if (action === 'suspend') {
    const until = new Date(now.getTime() + SUSPENSION_DAYS * DAY_MS);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { roomsSuspendedUntil: true },
    });
    // Never shorten one already running, and never extend one on a re-run
    // that found no new ejection.
    if (!user?.roomsSuspendedUntil || user.roomsSuspendedUntil < until) {
      await prisma.user.update({ where: { id: userId }, data: { roomsSuspendedUntil: until } });
    }
  }
}

/* -- staff review ------------------------------------------------------- */

function toReport(row: {
  id: string;
  space: string;
  roomId: string;
  reporterUserId: string;
  subjectUserId: string;
  reason: string;
  note: string;
  contextJson: string;
  outcome: string;
  createdAt: Date;
}): ConductReport {
  return {
    id: row.id,
    space: row.space as ReportSpace,
    roomId: row.roomId,
    reporterUserId: row.reporterUserId,
    subjectUserId: row.subjectUserId,
    reason: row.reason,
    note: row.note,
    context: JSON.parse(row.contextJson) as ReportContext,
    outcome: row.outcome as ReportOutcome,
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * The open queue, urgent categories first.
 *
 * Sorted by whether the category escalates rather than by age, because a
 * threat sitting behind forty spam reports is the failure mode that makes a
 * queue worthless. Within each group it is oldest first, so nothing rots.
 */
export async function openReports(limit = 100): Promise<ConductReport[]> {
  const rows = await prisma.conductReport.findMany({
    where: { outcome: 'open' },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
  const reports = rows.map(toReport);
  return reports.sort((a, b) => {
    const urgency = Number(reportReason(b.reason)?.escalatesImmediately ?? false) -
      Number(reportReason(a.reason)?.escalatesImmediately ?? false);
    return urgency !== 0 ? urgency : a.createdAt.localeCompare(b.createdAt);
  });
}

/**
 * A reviewer settles one report.
 *
 * Dismissing recomputes the room, which is what reverses an ejection that
 * should not have happened: the dismissed report stops counting toward the
 * threshold, and if that drops the room below it the ejection is set aside and
 * the account count with it.
 */
export async function resolveReport(
  reportId: string,
  reviewerUserId: string,
  outcome: Exclude<ReportOutcome, 'open'>,
  now: Date = new Date(),
): Promise<void> {
  const row = await prisma.conductReport.findUnique({ where: { id: reportId } });
  if (!row) throw new ConductError('No such report.', 404);

  await prisma.conductReport.update({
    where: { id: reportId },
    data: { outcome, reviewedByUserId: reviewerUserId, reviewedAt: now },
  });

  if (outcome === 'dismissed') await reconsiderEjection(row.roomId, row.subjectUserId, now);
}

/**
 * After a dismissal, does the ejection that stands still have the reporters to
 * justify it.
 *
 * The occupant count comes off the ejection's own record of how many reporters
 * it fired on rather than from the room, which may since have emptied. What is
 * being asked is whether the reports that remain would still have reached the
 * threshold that applied at the time, not what a different room would need
 * today.
 */
async function reconsiderEjection(roomId: string, userId: string, now: Date): Promise<void> {
  const ejection = await prisma.roomEjection.findUnique({ where: { roomId_userId: { roomId, userId } } });
  if (!ejection || ejection.reversed) return;

  const remaining = await prisma.conductReport.findMany({
    where: { roomId, subjectUserId: userId, outcome: { not: 'dismissed' } },
    select: { reporterUserId: true },
  });
  const reporters = new Set(remaining.map((r) => r.reporterUserId)).size;
  if (reporters >= ejection.reporters) return;

  await prisma.roomEjection.update({ where: { id: ejection.id }, data: { reversed: true } });

  // The account may now be under the bar for whatever it is carrying. Lifting
  // a ban here is deliberate: an automatic hold that a reviewer has just
  // undermined should not survive because nobody remembered a second step.
  await prisma.user.update({ where: { id: userId }, data: { roomsBanned: false } });
  await prisma.user.update({ where: { id: userId }, data: { roomsSuspendedUntil: null } });
  await evaluateAccount(userId, now);
}

/** What one account is carrying, for a reviewer looking at a person. */
export async function conductRecord(userId: string, now: Date = new Date()) {
  const [ejections, reports, user] = await Promise.all([
    prisma.roomEjection.count({
      where: { userId, reversed: false, createdAt: { gte: windowStart(now) } },
    }),
    prisma.conductReport.count({ where: { subjectUserId: userId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { callSign: true, roomsBanned: true, roomsSuspendedUntil: true },
    }),
  ]);
  return {
    callSign: user?.callSign ?? null,
    ejectionsInWindow: ejections,
    reportsAllTime: reports,
    banned: user?.roomsBanned ?? false,
    suspendedUntil: user?.roomsSuspendedUntil?.toISOString() ?? null,
    /** How many more ejections before the next step, for a reviewer's context. */
    ejectionsUntilBan: Math.max(0, BAN_AFTER_EJECTIONS - ejections),
  };
}
