/**
 * The badge catalogue.
 *
 * Badges are DERIVED from the packages and tracks that already exist, not
 * hand-listed alongside them. A second hand-maintained list would drift: the
 * session that adds a package would add it to PACKAGES, wire it to a track
 * stage, and forget the badge, and nobody would notice until a student finished
 * a track and got nothing.
 *
 * What IS hand-written is the wording. A citation generated from a package
 * title reads like a receipt ("Completed Log Analysis and Parsing"), and the
 * whole value of a badge is that somebody else can read it and understand what
 * the person can do. So each package carries a line written for that reader,
 * and `badges.test.ts` fails if a package is added without one.
 *
 * WHY ONLY TRACKS WITH PLAYABLE CONTENT GET A BADGE
 *
 * Sixteen track badges of which thirteen can never be earned is a shelf that
 * tells somebody the platform is mostly empty. The honesty rule from tracks.ts
 * applies here too: show what exists.
 */

import type { BadgeAccent, BadgeDefinition, BadgeEmblem } from '@soc/shared';

import { PACKAGES } from './index.js';
import { TRACKS } from './tracks.js';
import { trackPackages } from './curriculum.js';

/** The wording and the look for one package badge. */
interface PackageBadgeArt {
  /**
   * What the badge is called, which is NOT the package title.
   *
   * A badge names the person, not the syllabus: "Log Reader" is a thing to be,
   * "Log Analysis and Parsing" is a thing to sit through.
   */
  title: string;
  citation: string;
  emblem: BadgeEmblem;
  accent: BadgeAccent;
}

const PACKAGE_ART: Record<string, PackageBadgeArt> = {
  'human-risk-foundations': {
    title: 'Human Factor',
    citation: 'Learned that people are the most relied-upon control, and how to support one.',
    emblem: 'beacon',
    accent: 'rose',
  },
  'identity-foundations': {
    title: 'Keyholder',
    citation: 'Learned who should be able to do what, and how access quietly accumulates.',
    emblem: 'key',
    accent: 'indigo',
  },
  'ot-security-foundations': {
    title: 'Plant Floor',
    citation: 'Learned to secure a process that cannot be paused, patched, or scanned.',
    emblem: 'chip',
    accent: 'amber',
  },
  'linux-fundamentals': {
    title: 'Ground Floor',
    citation: 'Found their way around a live Linux host from the command line alone.',
    emblem: 'terminal',
    accent: 'lime',
  },
  'log-analysis': {
    title: 'Log Reader',
    citation: 'Cut thousands of lines of real server log down to the few that mattered.',
    emblem: 'scope',
    accent: 'green',
  },
  networking: {
    title: 'On the Wire',
    citation: 'Worked out what a host was talking to, and whether it had any business doing so.',
    emblem: 'beacon',
    accent: 'teal',
  },
  'incident-triage': {
    title: 'The Queue',
    citation: 'Worked a full alert queue and told signal from noise under time pressure.',
    emblem: 'shield',
    accent: 'sky',
  },
  'incident-response': {
    title: 'First Responder',
    citation: 'Contained a live compromise, scoped it, eradicated it, and wrote it up.',
    emblem: 'shield',
    accent: 'red',
  },
  'soc-foundations': {
    title: 'Floor Ready',
    citation: 'Knows how work moves through a SOC and which of its many jobs the SOC actually is.',
    emblem: 'shield',
    accent: 'blue',
  },
  'blue-team-foundations': {
    title: 'Defender',
    citation: 'Built the timeline, ran the triage, and turned an incident into a defence.',
    emblem: 'shield',
    accent: 'indigo',
  },
  'red-team-foundations': {
    title: 'Other Side',
    citation: 'Learned how an intrusion is actually built, from reconnaissance to objective.',
    emblem: 'blade',
    accent: 'rose',
  },
  'malware-analysis': {
    title: 'Reverser',
    citation: 'Worked out what a suspicious file does, and turned the answer into a detection.',
    emblem: 'scope',
    accent: 'magenta',
  },
  'ai-foundations': {
    title: 'Model Literate',
    citation: 'Understands what a model is doing well enough to reason about how it fails.',
    emblem: 'chip',
    accent: 'cyan',
  },
  'ai-security': {
    title: 'Model Breaker',
    citation: 'Broke the guardrails on a deployed model in the lab, then closed what they opened.',
    emblem: 'chip',
    accent: 'violet',
  },
  'ai-security-pathway': {
    title: 'AI Security Analyst',
    citation: 'Took AI security end to end: attack surface, evaluation, defence, and governance.',
    emblem: 'chip',
    accent: 'orange',
  },
  'risk-governance-pathway': {
    title: 'Risk Desk',
    citation: 'Weighed real risk decisions and produced the evidence an auditor would ask for.',
    emblem: 'scales',
    accent: 'amber',
  },
};

/**
 * A package with no hand-written art still gets a badge.
 *
 * The alternative is throwing at boot, and a missing citation is not a reason
 * to take the platform down: a student finishing that package should still be
 * awarded something. The test is where this gets caught, so the wording is
 * written before release rather than never.
 */
function artFor(packageId: string, packageTitle: string): PackageBadgeArt {
  return (
    PACKAGE_ART[packageId] ?? {
      title: packageTitle,
      citation: `Completed every exercise in ${packageTitle}.`,
      emblem: 'key',
      accent: 'green',
    }
  );
}

/** Look for the track badges. Keyed by track id so a new track is one line. */
const TRACK_ART: Record<string, { emblem: BadgeEmblem; accent: BadgeAccent }> = {
  soc: { emblem: 'shield', accent: 'blue' },
  'incident-response': { emblem: 'scope', accent: 'red' },
  'detection-engineering': { emblem: 'beacon', accent: 'green' },
  'threat-intel': { emblem: 'scope', accent: 'cyan' },
  pentest: { emblem: 'blade', accent: 'rose' },
  appsec: { emblem: 'key', accent: 'lime' },
  'vuln-management': { emblem: 'scales', accent: 'orange' },
  'cloud-security': { emblem: 'key', accent: 'sky' },
  identity: { emblem: 'key', accent: 'indigo' },
  'security-engineering': { emblem: 'terminal', accent: 'teal' },
  'ot-ics': { emblem: 'beacon', accent: 'gold' },
  'risk-governance': { emblem: 'scales', accent: 'amber' },
  'compliance-audit': { emblem: 'scales', accent: 'gold' },
  privacy: { emblem: 'scales', accent: 'violet' },
  awareness: { emblem: 'beacon', accent: 'magenta' },
  'ai-security': { emblem: 'chip', accent: 'violet' },
};

/** Package badge ids are namespaced so a package and a track can share a slug. */
export function packageBadgeId(packageId: string): string {
  return `badge.package.${packageId}`;
}

export function trackBadgeId(trackId: string): string {
  return `badge.track.${trackId}`;
}

/** Package id to its catalogue title, for the "what is left" line on a tile. */
const PACKAGE_TITLES = new Map(PACKAGES.map((pkg) => [pkg.id, pkg.title]));

function titlesFor(packageIds: readonly string[]): Record<string, string> {
  const titles: Record<string, string> = {};
  for (const id of packageIds) titles[id] = PACKAGE_TITLES.get(id) ?? id;
  return titles;
}

function buildCatalogue(): BadgeDefinition[] {
  const packageBadges: BadgeDefinition[] = PACKAGES.map((pkg) => {
    const art = artFor(pkg.id, pkg.title);
    return {
      id: packageBadgeId(pkg.id),
      kind: 'package',
      title: art.title,
      citation: art.citation,
      requirement: `Pass every exercise in ${pkg.title}.`,
      requires: [pkg.id],
      requirementTitles: titlesFor([pkg.id]),
      // The track a package belongs to first, so the case groups sensibly. A
      // package reachable from several tracks is filed under the first, which
      // is the same call trackForPackage makes for routing.
      trackId: TRACKS.find((track) => trackPackages(track.id).includes(pkg.id))?.id ?? null,
      emblem: art.emblem,
      accent: art.accent,
    };
  });

  const trackBadges: BadgeDefinition[] = TRACKS.flatMap((track) => {
    const requires = trackPackages(track.id);
    // A track whose modules are all still outlines cannot be finished, and a
    // badge for it would be a locked door with nothing behind it.
    if (requires.length === 0) return [];
    const art = TRACK_ART[track.id] ?? { emblem: 'shield' as BadgeEmblem, accent: 'blue' as BadgeAccent };
    return [
      {
        id: trackBadgeId(track.id),
        kind: 'track' as const,
        title: track.title,
        citation: `Completed the ${track.title} track: ${track.summary}`,
        // Said out loud, because the requirement grows as the track does and a
        // student who finishes today should not think they were shortchanged
        // when a fourteenth module lands next month. Awarded badges are rows,
        // and a row is never taken back.
        requirement:
          `Finish all ${requires.length} module(s) of this track that are built today. ` +
          'More land over time, and a badge you have already earned stays yours.',
        requires,
        requirementTitles: titlesFor(requires),
        trackId: track.id,
        emblem: art.emblem,
        accent: art.accent,
      },
    ];
  });

  return [...trackBadges, ...packageBadges];
}

export const BADGES: BadgeDefinition[] = buildCatalogue();

const BADGE_BY_ID = new Map(BADGES.map((badge) => [badge.id, badge]));

export function getBadge(badgeId: string): BadgeDefinition | null {
  return BADGE_BY_ID.get(badgeId) ?? null;
}

/** Exposed for the test that holds every package to a written citation. */
export function hasHandWrittenArt(packageId: string): boolean {
  return packageId in PACKAGE_ART;
}
