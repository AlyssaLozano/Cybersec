/**
 * Badges: the record of what somebody has actually finished.
 *
 * WHY BADGES AT ALL
 *
 * The curriculum is long. A career changer who starts Linux Fundamentals in
 * February and is meant to reach a SOC Analyst track badge in July has five
 * months of no visible arrival, and the thing that gets people through that is
 * not motivation, it is evidence of progress they can see. A badge is that
 * evidence, and it happens to be the same evidence an interviewer wants.
 *
 * WHY THERE ARE TWO KINDS
 *
 * A track badge alone would be nearly unearnable: a track is several packages
 * of work, so the first one would land months in. Package badges are the steps
 * on the way, and a case with four of them in it reads as progress rather than
 * as an empty shelf.
 *
 * WHY AN EARNED BADGE IS A STORED ROW AND NOT A DERIVED FACT
 *
 * Track curricula grow. A package written next month becomes a requirement of
 * a track badge somebody already holds, and a derived badge would silently
 * vanish from their case. That is the same failure mode the platform refuses
 * everywhere else: nothing may downgrade a pass. Awarding writes a row, and the
 * row is never deleted or recomputed.
 */

/** What a badge is awarded for. */
export const BADGE_KINDS = ['package', 'track'] as const;
export type BadgeKind = (typeof BADGE_KINDS)[number];

/**
 * The shape drawn on the badge.
 *
 * A fixed set rather than free-form art for the same reason avatars are fixed:
 * it costs one afternoon of SVG and has no moderation queue behind it. The
 * emblem carries meaning -- a shield is defensive work, a blade is offensive --
 * so a case is readable before any of the labels are.
 */
export const BADGE_EMBLEMS = [
  'shield',
  'blade',
  'scope',
  'terminal',
  'scales',
  'chip',
  'beacon',
  'key',
] as const;
export type BadgeEmblem = (typeof BADGE_EMBLEMS)[number];

/**
 * Colour family.
 *
 * Wider than the app's own six-colour palette, and deliberately so. The rest of
 * the product keeps colour scarce because red and amber have to keep meaning
 * "this is wrong" and "look at this"; a badge case is the one screen where
 * nothing is a status, so a shelf of twenty-three near-identical blue discs is
 * only discipline for its own sake. Every badge gets its own colour so the case
 * is a collection rather than a table, and so somebody can find the one they
 * are proud of at a glance.
 */
export const BADGE_ACCENTS = [
  'green',
  'blue',
  'red',
  'amber',
  'violet',
  'cyan',
  'rose',
  'teal',
  'lime',
  'gold',
  'magenta',
  'orange',
  'indigo',
  'sky',
] as const;
export type BadgeAccent = (typeof BADGE_ACCENTS)[number];

export interface BadgeDefinition {
  /** Stable and permanent, like an exercise id. Earned rows reference it. */
  id: string;
  kind: BadgeKind;
  /** What it is called on the shelf. */
  title: string;
  /**
   * One line, written to be read by somebody who did not do the work: an
   * interviewer, or a stranger in the lobby. "Read a real server's logs and
   * found the intrusion in them" says more than "completed Log Analysis".
   */
  citation: string;
  /**
   * What has to be true to earn it, in plain words.
   *
   * Shown BEFORE it is earned, on purpose. A badge that appears as a surprise
   * is a nice moment once; a badge you can see the shape of is a goal for five
   * months.
   */
  requirement: string;
  /** Package ids that must all be complete. Never empty. */
  requires: string[];
  /**
   * Package id to the title a person would recognise.
   *
   * Carried on the badge rather than looked up by the client, because the
   * catalogue lives in server content and the browser has no map from
   * "log-analysis" to "Log Analysis and Parsing". Without it the shelf tells
   * somebody their remaining work in slugs, which is the internal name for the
   * thing and not the name of the thing.
   */
  requirementTitles: Record<string, string>;
  /** Track this belongs to, for grouping the case. Null for standalone packages. */
  trackId: string | null;
  emblem: BadgeEmblem;
  accent: BadgeAccent;
}

export interface EarnedBadge {
  badgeId: string;
  /** ISO 8601. */
  earnedAt: string;
}

/** A badge as one person's case shows it: the definition plus where they are. */
export interface BadgeStanding extends BadgeDefinition {
  /** ISO 8601 when held, null when not. */
  earnedAt: string | null;
  /** Requirement package ids this person has finished. */
  done: string[];
  /** Requirement package ids still outstanding. Empty for a held badge. */
  outstanding: string[];
  /** 0-100, rounded. 100 with a null earnedAt means the award has not run yet. */
  percent: number;
}

export interface BadgeCase {
  badges: BadgeStanding[];
  earnedCount: number;
  total: number;
  /** The most recent award, for the "just earned" banner. Null when none. */
  latest: EarnedBadge | null;
}

/**
 * Which badges this person has now qualified for and does not already hold.
 *
 * Pure, so the award rule is testable without a database, and so the one place
 * that decides "you have earned this" cannot drift from the one place that
 * displays it.
 *
 * A badge with no requirements can never be earned. That is deliberate: an
 * empty `requires` array means somebody wired a badge to nothing, and awarding
 * it to everybody would be worse than awarding it to nobody.
 */
export function newlyEarned(
  definitions: readonly BadgeDefinition[],
  completePackageIds: ReadonlySet<string>,
  alreadyHeld: ReadonlySet<string>,
): BadgeDefinition[] {
  return definitions.filter(
    (badge) =>
      !alreadyHeld.has(badge.id) &&
      badge.requires.length > 0 &&
      badge.requires.every((packageId) => completePackageIds.has(packageId)),
  );
}

/** One person's standing against one badge. */
export function standingFor(
  badge: BadgeDefinition,
  completePackageIds: ReadonlySet<string>,
  earnedAt: string | null,
): BadgeStanding {
  const done = badge.requires.filter((packageId) => completePackageIds.has(packageId));
  const outstanding = badge.requires.filter((packageId) => !completePackageIds.has(packageId));
  return {
    ...badge,
    earnedAt,
    done,
    outstanding,
    percent:
      badge.requires.length === 0 ? 0 : Math.round((done.length / badge.requires.length) * 100),
  };
}

/**
 * The whole case.
 *
 * Held badges sort first and by recency, because the case is something people
 * show off and the newest thing is the thing they want seen. Unearned badges
 * follow by how close they are, which turns the shelf into a to-do list.
 */
export function buildCase(
  definitions: readonly BadgeDefinition[],
  completePackageIds: ReadonlySet<string>,
  earned: readonly EarnedBadge[],
): BadgeCase {
  const earnedAt = new Map(earned.map((row) => [row.badgeId, row.earnedAt]));
  const badges = definitions
    .map((badge) => standingFor(badge, completePackageIds, earnedAt.get(badge.id) ?? null))
    .sort((a, b) => {
      if (a.earnedAt && b.earnedAt) return b.earnedAt.localeCompare(a.earnedAt);
      if (a.earnedAt) return -1;
      if (b.earnedAt) return 1;
      return b.percent - a.percent;
    });

  const latest = [...earned].sort((a, b) => b.earnedAt.localeCompare(a.earnedAt))[0] ?? null;
  return {
    badges,
    earnedCount: badges.filter((badge) => badge.earnedAt).length,
    total: badges.length,
    latest,
  };
}

/**
 * The handful of badges shown next to somebody's name in the lobby.
 *
 * Track badges first: "SOC Analyst" is the thing worth knowing about a stranger
 * you are deciding whether to talk to, and a row of eight package badges buries
 * it.
 */
export function pinnedBadges(held: readonly BadgeStanding[], limit = 3): BadgeStanding[] {
  return [...held]
    .filter((badge) => badge.earnedAt)
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'track' ? -1 : 1;
      return (b.earnedAt ?? '').localeCompare(a.earnedAt ?? '');
    })
    .slice(0, limit);
}
