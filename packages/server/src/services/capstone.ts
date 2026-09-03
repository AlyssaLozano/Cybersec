/**
 * The GitHub Lab: reading and recording a student's capstone progress.
 *
 * Unlike portfolio.ts, this genuinely stores state -- a picked option and a
 * repo link are facts nobody but the student can supply, not something
 * derivable from graded progress. What it never does is reach out to the
 * URL the student pasted in: fetching a student-supplied address from the
 * server is the one thing content/capstones.ts explicitly rules out, so this
 * file stores and returns `repoUrl` as an opaque string and nothing more.
 */

import type { CapstoneState, CapstoneSubmissionStatus, CapstoneSubmissionView } from '@soc/shared';

import { capstoneOption, CAPSTONES } from '../content/capstones.js';
import { trackPackages } from '../content/curriculum.js';
import { getTrack, TRACKS } from '../content/tracks.js';
import { getOverview } from './progress.js';
import { prisma } from '../db/client.js';

/**
 * Whether a track's GitHub Lab stage is open yet.
 *
 * Mirrors the "everything earlier must be passed" rule the terminal engine
 * already enforces server-side for exercises (see canAccess in
 * services/progress.ts), applied at package granularity: every package the
 * track resolves to, foundations first, must be complete.
 */
export async function capstoneUnlocked(userId: string, trackId: string): Promise<boolean> {
  const packageIds = trackPackages(trackId);
  if (packageIds.length === 0) return false;

  const overview = await getOverview(userId);
  const completeById = new Map(overview.packages.map((pkg) => [pkg.packageId, pkg.complete]));
  return packageIds.every((id) => completeById.get(id) === true);
}

function emptyState(trackId: string): CapstoneState {
  return {
    trackId,
    optionId: null,
    status: null,
    repoUrl: null,
    summary: null,
    selectedAt: null,
    submittedAt: null,
  };
}

/** A student's current state on one track's capstone, or the empty state if they haven't started. */
export async function capstoneStateFor(userId: string, trackId: string): Promise<CapstoneState> {
  const row = await prisma.capstoneSubmission.findUnique({
    where: { userId_trackId: { userId, trackId } },
  });
  if (!row) return emptyState(trackId);

  return {
    trackId,
    optionId: row.optionId,
    status: row.status as CapstoneSubmissionStatus,
    repoUrl: row.repoUrl,
    summary: row.summary,
    selectedAt: row.selectedAt.toISOString(),
    submittedAt: row.submittedAt?.toISOString() ?? null,
  };
}

export class CapstoneOptionNotFoundError extends Error {}
export class CapstoneNotSelectedError extends Error {}

/** Pick (or switch to) one project option. Resets any repo link from a previous choice. */
export async function selectCapstone(userId: string, trackId: string, optionId: string): Promise<CapstoneState> {
  if (!capstoneOption(trackId, optionId)) throw new CapstoneOptionNotFoundError(optionId);

  await prisma.capstoneSubmission.upsert({
    where: { userId_trackId: { userId, trackId } },
    create: { userId, trackId, optionId, status: 'selected' },
    update: { optionId, status: 'selected', repoUrl: null, summary: null, submittedAt: null, selectedAt: new Date() },
  });

  return capstoneStateFor(userId, trackId);
}

/** Submit the finished repo link and writeup for the option already selected. */
export async function submitCapstone(
  userId: string,
  trackId: string,
  repoUrl: string,
  summary: string | null,
): Promise<CapstoneState> {
  const existing = await prisma.capstoneSubmission.findUnique({
    where: { userId_trackId: { userId, trackId } },
  });
  if (!existing) throw new CapstoneNotSelectedError(trackId);

  await prisma.capstoneSubmission.update({
    where: { userId_trackId: { userId, trackId } },
    data: { status: 'submitted', repoUrl, summary, submittedAt: new Date() },
  });

  return capstoneStateFor(userId, trackId);
}

/** Every submission a student has, across every track, for the portfolio page. */
export async function capstoneSubmissionsFor(userId: string): Promise<CapstoneSubmissionView[]> {
  const rows = await prisma.capstoneSubmission.findMany({ where: { userId } });

  return rows
    .map((row): CapstoneSubmissionView | null => {
      const track = getTrack(row.trackId);
      if (!track) return null;
      const option = capstoneOption(row.trackId, row.optionId);
      return {
        trackId: row.trackId,
        trackTitle: track.title,
        optionId: row.optionId,
        optionTitle: option?.title ?? null,
        status: row.status as CapstoneSubmissionStatus,
        repoUrl: row.repoUrl,
        summary: row.summary,
        selectedAt: row.selectedAt.toISOString(),
        submittedAt: row.submittedAt?.toISOString() ?? null,
      };
    })
    .filter((view): view is CapstoneSubmissionView => view !== null);
}

/** Every track id that declares a GitHub Lab stage, in track order. */
export function capstoneTrackIds(): string[] {
  return TRACKS.filter((track) => track.curriculum.some((stage) => stage.capstoneTrack)).map(
    (track) => track.id,
  );
}

export function hasCapstone(trackId: string): boolean {
  return trackId in CAPSTONES;
}
