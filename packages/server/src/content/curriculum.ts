/**
 * Composition layer: joins tracks to the foundations they require.
 *
 * tracks.ts deliberately does not import foundations.ts, so that neither module
 * depends on the other and a track can be defined without knowing whether its
 * foundations are built yet. This module is where the two meet, and it is the
 * only place that knows how to turn a track into a concrete list of playable
 * packages.
 */

import type { Foundation, Track } from '@soc/shared';

import { FOUNDATIONS, getFoundation } from './foundations.js';
import { PACKAGES } from './index.js';
import { getTrack, TRACKS, trackPackageIds as resolveTrackPackages } from './tracks.js';

/** Map a foundation id to its package id, when one exists. */
function foundationPackageId(foundationId: string): string | undefined {
  return getFoundation(foundationId)?.packageId;
}

/** Playable package ids for a track, foundations first, in curriculum order. */
export function trackPackages(trackId: string): string[] {
  return resolveTrackPackages(trackId, foundationPackageId);
}

/** The track a package belongs to first, used to route a student back. */
export function trackForPackage(packageId: string): Track | null {
  return TRACKS.find((track) => trackPackages(track.id).includes(packageId)) ?? null;
}

export interface FoundationStatus extends Foundation {
  /** True when a playable package exists behind this foundation today. */
  playable: boolean;
}

/**
 * A track's required foundations, in the order the track declares them,
 * each marked with whether it can actually be started.
 */
export function trackFoundations(trackId: string): FoundationStatus[] {
  const track = getTrack(trackId);
  if (!track) return [];

  return track.foundations
    .map((id) => getFoundation(id))
    .filter((foundation): foundation is Foundation => foundation !== null)
    .map((foundation) => ({ ...foundation, playable: typeof foundation.packageId === 'string' }));
}

/**
 * How much of a track is buildable today.
 *
 * Used to show honest progress against a track whose later stages do not exist:
 * "2 of 8 foundations available" is more useful, and more truthful, than a
 * percentage bar that silently ignores unwritten content.
 */
export function trackReadiness(trackId: string): {
  foundationsTotal: number;
  foundationsPlayable: number;
  stagesTotal: number;
  stagesPlayable: number;
} {
  const track = getTrack(trackId);
  if (!track) {
    return { foundationsTotal: 0, foundationsPlayable: 0, stagesTotal: 0, stagesPlayable: 0 };
  }

  const foundations = trackFoundations(trackId);
  return {
    foundationsTotal: foundations.length,
    foundationsPlayable: foundations.filter((foundation) => foundation.playable).length,
    stagesTotal: track.curriculum.length,
    stagesPlayable: track.curriculum.filter((stage) => typeof stage.packageId === 'string').length,
  };
}

/** Every foundation, marked with which tracks need it. */
export function foundationsWithDemand(): Array<Foundation & { requiredBy: string[]; playable: boolean }> {
  return FOUNDATIONS.map((foundation) => ({
    ...foundation,
    playable: typeof foundation.packageId === 'string',
    requiredBy: TRACKS.filter((track) => track.foundations.includes(foundation.id)).map((track) => track.id),
  }));
}

/**
 * Where a named skill is actually taught, and whether it exists yet.
 *
 * Capabilities used to name a foundation, which worked while most built content
 * hung off the foundation pool. It does not any more: Linux is the only
 * foundation there is, and everything else a student works through is a stage in
 * a track's own curriculum. So an anchor is now either a foundation id or a
 * package id, and this is the one place that knows how to resolve both.
 */
export function teachingSource(id: string): { title: string; built: boolean } | null {
  const foundation = getFoundation(id);
  if (foundation) return { title: foundation.title, built: typeof foundation.packageId === 'string' };

  const pkg = PACKAGES.find((candidate) => candidate.id === id);
  // A package in PACKAGES is written and graded by definition, so it is built.
  if (pkg) return { title: pkg.title, built: true };

  return null;
}
