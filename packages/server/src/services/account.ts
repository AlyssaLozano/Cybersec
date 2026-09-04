/**
 * Platform-wide account standing: a superadmin taking somebody off the whole
 * product, not the automatic room-conduct system in conduct.ts.
 *
 * WHY THIS IS A SEPARATE TABLE OF COLUMNS FROM roomsSuspendedUntil/roomsBanned
 *
 * Those two are the outcome of a threshold nobody chose to apply: enough
 * people in one room reported somebody and the system acted. These are the
 * opposite -- a person reading a report and deciding, with a reason attached
 * that survives them. Mixing the two would mean a reviewer clearing an
 * automatic room hold could accidentally lift a deliberate platform ban, which
 * is the same "nothing here touches the learning platform" boundary conduct.ts
 * draws, drawn again one level up.
 *
 * EVERY ACTION IS LOGGED, NEVER JUST APPLIED
 *
 * `SuperadminAction` is append-only and is the only place a "why" survives.
 * The columns on `User` say what is true right now; the log says who decided
 * it and when, which is what anybody auditing a ban six months from now needs
 * and a mutable column cannot give them.
 */

import type { UserRole, UserTier } from '@soc/shared';

import { prisma } from '../db/client.js';

export class AccountError extends Error {}

/** Whether this viewer's role, read fresh from the database, is superadmin. */
export function isSuperadmin(role: UserRole): boolean {
  return role === 'superadmin';
}

export interface PlatformAccountStatus {
  allowed: boolean;
  /** Written to be shown to the person, mirroring roomAccess's tone. */
  problem: string | null;
}

/**
 * Whether this account may use the platform at all right now.
 *
 * Also lets a lapsed suspension go, the same reasoning `roomAccess` in
 * conduct.ts gives for doing it inline: a scheduled job to clear it is a job
 * to forget, and a window where somebody is refused the day after their
 * suspension ended is the failure people remember.
 */
export async function platformAccountStatus(
  userId: string,
  now: Date = new Date(),
): Promise<PlatformAccountStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { platformBanned: true, platformSuspendedUntil: true },
  });
  if (!user) return { allowed: false, problem: 'No such account.' };

  if (user.platformBanned) {
    return {
      allowed: false,
      problem: 'This account has been removed from the platform. Contact staff if you believe this is a mistake.',
    };
  }

  if (user.platformSuspendedUntil) {
    if (user.platformSuspendedUntil > now) {
      return {
        allowed: false,
        problem: `This account is suspended from the platform until ${user.platformSuspendedUntil.toISOString()}.`,
      };
    }
    await prisma.user.update({ where: { id: userId }, data: { platformSuspendedUntil: null } });
  }

  return { allowed: true, problem: null };
}

async function requireTarget(targetUserId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true } });
  if (!user) throw new AccountError('No such account.');
}

function requireReason(reason: string): string {
  const trimmed = reason.trim();
  if (!trimmed) {
    throw new AccountError('Say why, so the record explains the action.');
  }
  return trimmed;
}

/** Suspend an account from the whole platform until a given time. */
export async function suspendAccount(
  actorUserId: string,
  targetUserId: string,
  until: Date,
  reason: string,
): Promise<void> {
  const note = requireReason(reason);
  if (Number.isNaN(until.getTime()) || until.getTime() <= Date.now()) {
    throw new AccountError('Suspend until a time in the future.');
  }
  await requireTarget(targetUserId);

  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      platformSuspendedUntil: until,
      platformActionReason: note,
      platformActionAt: new Date(),
      platformActionByUserId: actorUserId,
    },
  });
  await prisma.superadminAction.create({
    data: { actorUserId, action: 'suspend', targetUserId, reason: note },
  });
}

/** Remove an account from the platform indefinitely, pending review. */
export async function banAccount(actorUserId: string, targetUserId: string, reason: string): Promise<void> {
  const note = requireReason(reason);
  await requireTarget(targetUserId);

  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      platformBanned: true,
      platformActionReason: note,
      platformActionAt: new Date(),
      platformActionByUserId: actorUserId,
    },
  });
  await prisma.superadminAction.create({
    data: { actorUserId, action: 'ban', targetUserId, reason: note },
  });
}

/** Clear a ban and/or a suspension. Both columns, whichever was set. */
export async function reinstateAccount(
  actorUserId: string,
  targetUserId: string,
  reason: string,
): Promise<void> {
  const note = requireReason(reason);
  await requireTarget(targetUserId);

  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      platformBanned: false,
      platformSuspendedUntil: null,
      platformActionReason: note,
      platformActionAt: new Date(),
      platformActionByUserId: actorUserId,
    },
  });
  await prisma.superadminAction.create({
    data: { actorUserId, action: 'reinstate', targetUserId, reason: note },
  });
}

export interface AccountSearchResult {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  platformBanned: boolean;
  platformSuspendedUntil: string | null;
}

/**
 * Find who to act on, by username or email.
 *
 * `contains` with no `mode` is case-insensitive on SQLite's own LIKE, which is
 * what local dev runs on. Postgres does not share that default, so this needs
 * `mode: 'insensitive'` added the day the datasource moves -- one line, not a
 * rewrite, the same seam the schema header describes for the rest of the app.
 */
export async function searchAccounts(query: string): Promise<AccountSearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const rows = await prisma.user.findMany({
    where: { OR: [{ username: { contains: q } }, { email: { contains: q } }] },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      tier: true,
      platformBanned: true,
      platformSuspendedUntil: true,
    },
    take: 20,
  });

  return rows.map((row) => ({
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role as UserRole,
    tier: row.tier as UserTier,
    platformBanned: row.platformBanned,
    platformSuspendedUntil: row.platformSuspendedUntil?.toISOString() ?? null,
  }));
}
