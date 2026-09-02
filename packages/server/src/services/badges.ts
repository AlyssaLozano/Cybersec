/**
 * Awarding badges, and reading somebody's case back.
 *
 * WHY AWARDING RUNS INSIDE recordAttempt AND NOT IN A ROUTE
 *
 * There are two paths to a pass: the terminal and the answer submitter. Putting
 * the award on one of them means the other silently never awards, and the bug
 * only surfaces months later when somebody finishes a terminal-only package and
 * gets nothing. Both paths already funnel through `recordAttempt`, so the award
 * hangs off that instead, and a third path added later inherits it for free.
 *
 * WHY IT IS SAFE TO RUN ON EVERY PASS
 *
 * Only on a pass, and a pass is rare relative to attempts. The work is one read
 * of the person's progress rows plus one read of their held badges, which is
 * the same read the overview does. On a failure nothing runs at all.
 */

import type { BadgeCase, BadgeDefinition, EarnedBadge, PinnedBadge } from '@soc/shared';
import { buildCase, pinnedBadges, standingFor } from '@soc/shared';

import { BADGES } from '../content/badges.js';
import { PACKAGES } from '../content/index.js';
import { prisma } from '../db/client.js';

/**
 * Which packages this person has finished.
 *
 * Counted from their passed exercise rows against the catalogue rather than
 * from a stored flag, because the catalogue is the only thing that knows how
 * many exercises a package has, and it grows. A package that gains an exercise
 * stops being complete for somebody mid-way, which is correct: they have not
 * done the new one. It does NOT take away a badge they already hold, because
 * that is a row.
 */
export async function completedPackageIds(userId: string): Promise<Set<string>> {
  const passed = await prisma.exerciseProgress.findMany({
    where: { userId, status: 'passed' },
    select: { exerciseId: true, packageId: true },
  });

  const passedByPackage = new Map<string, Set<string>>();
  for (const row of passed) {
    const bucket = passedByPackage.get(row.packageId);
    if (bucket) bucket.add(row.exerciseId);
    else passedByPackage.set(row.packageId, new Set([row.exerciseId]));
  }

  const complete = new Set<string>();
  for (const pkg of PACKAGES) {
    const total = pkg.modules.reduce((sum, module) => sum + module.exercises.length, 0);
    if (total === 0) continue;
    // Counted by id rather than by row count: a stale row for an exercise that
    // has since been removed from the package would otherwise inflate the total
    // and hand somebody a badge they did not finish.
    const ids = new Set(pkg.modules.flatMap((module) => module.exercises.map((e) => e.id)));
    const mine = passedByPackage.get(pkg.id);
    if (!mine) continue;
    let hit = 0;
    for (const id of ids) if (mine.has(id)) hit += 1;
    if (hit === total) complete.add(pkg.id);
  }
  return complete;
}

async function heldBadgeIds(userId: string): Promise<Set<string>> {
  const rows = await prisma.earnedBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  return new Set(rows.map((row) => row.badgeId));
}

/**
 * Award everything this person has just qualified for.
 *
 * Returns the definitions, so the caller can hand them to the client and the
 * moment is not lost. An already-held badge is filtered out before the write,
 * and the unique index is the backstop for two passes landing at once: a
 * duplicate is swallowed rather than failing the submission, because losing
 * somebody's pass to a badge race would be an absurd trade.
 */
export async function awardFor(userId: string): Promise<BadgeDefinition[]> {
  const [complete, held] = await Promise.all([
    completedPackageIds(userId),
    heldBadgeIds(userId),
  ]);

  const earned = BADGES.filter(
    (badge) =>
      !held.has(badge.id) &&
      badge.requires.length > 0 &&
      badge.requires.every((packageId) => complete.has(packageId)),
  );
  if (earned.length === 0) return [];

  const awarded: BadgeDefinition[] = [];
  for (const badge of earned) {
    try {
      await prisma.earnedBadge.create({ data: { userId, badgeId: badge.id } });
      awarded.push(badge);
    } catch {
      // Unique constraint: somebody else's request got there first. Held is
      // held, so there is nothing to report and nothing to fix.
    }
  }
  return awarded;
}

export async function earnedFor(userId: string): Promise<EarnedBadge[]> {
  const rows = await prisma.earnedBadge.findMany({
    where: { userId },
    orderBy: { earnedAt: 'desc' },
  });
  return rows.map((row) => ({ badgeId: row.badgeId, earnedAt: row.earnedAt.toISOString() }));
}

/** The whole shelf, held and not, for the case screen. */
export async function caseFor(userId: string): Promise<BadgeCase> {
  const [complete, earned] = await Promise.all([completedPackageIds(userId), earnedFor(userId)]);
  return buildCase(BADGES, complete, earned);
}

/**
 * The two or three badges shown beside a name in the lobby.
 *
 * Batched across everybody in the room, because the alternative is one query
 * per occupant on every four-second poll, which is how a lobby of thirty people
 * becomes a load problem.
 */
export async function pinnedFor(userIds: readonly string[]): Promise<Map<string, PinnedBadge[]>> {
  const result = new Map<string, PinnedBadge[]>(userIds.map((id) => [id, []]));
  if (userIds.length === 0) return result;

  const rows = await prisma.earnedBadge.findMany({
    where: { userId: { in: [...userIds] } },
    orderBy: { earnedAt: 'desc' },
  });

  const byUser = new Map<string, EarnedBadge[]>();
  for (const row of rows) {
    const entry = { badgeId: row.badgeId, earnedAt: row.earnedAt.toISOString() };
    const bucket = byUser.get(row.userId);
    if (bucket) bucket.push(entry);
    else byUser.set(row.userId, [entry]);
  }

  // Held badges only, so `standingFor` is given an empty completion set: what
  // is on the wall is what was awarded, and a package later gaining an exercise
  // must not blank somebody's lobby badges.
  const none = new Set<string>();
  const definitionsById = new Map(BADGES.map((badge) => [badge.id, badge]));

  for (const [userId, earned] of byUser) {
    const standings = earned
      .map((row) => {
        const definition = definitionsById.get(row.badgeId);
        return definition ? standingFor(definition, none, row.earnedAt) : null;
      })
      .filter((standing): standing is NonNullable<typeof standing> => standing !== null);

    result.set(
      userId,
      pinnedBadges(standings).map((badge) => ({
        id: badge.id,
        title: badge.title,
        emblem: badge.emblem,
        accent: badge.accent,
        kind: badge.kind,
      })),
    );
  }

  return result;
}
