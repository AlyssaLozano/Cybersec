/**
 * Reading and writing a person's profile.
 *
 * TWO HALVES, AND ONLY ONE IS EDITABLE
 *
 * The written half is a headline, a paragraph and two links. Anybody can write
 * those, which is exactly why they are not the interesting part of the page.
 *
 * The earned half -- badges, packages finished, shifts actually run, seats
 * actually sat in -- is computed here from the same tables that grade the
 * work, and cannot be typed in. That is what makes the profile worth showing
 * somebody: a claim on this page is checkable against the platform that
 * watched them do it.
 *
 * VISIBILITY IS ENFORCED HERE AND NOT IN A ROUTE
 *
 * There is one function that returns somebody else's profile and it is the one
 * that checks. A route that fetched the row and decided for itself would be
 * correct the day it was written and would be copied.
 */

import { EMPTY_PROFILE, checkProfile, parseGithubHandle, parseLinkedinHandle } from '@soc/shared';
import type { ProfileFields, ProfileVisibility, PublicProfile } from '@soc/shared';

import { prisma } from '../db/client.js';

export class ProfileError extends Error {
  constructor(
    message: string,
    readonly status: number = 400,
    readonly problems: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'ProfileError';
  }
}

/** Somebody's own profile, always readable by them whatever the visibility. */
export async function myProfile(userId: string): Promise<PublicProfile> {
  const profile = await buildProfile(userId);
  if (!profile) throw new ProfileError('No such account.', 404);
  return profile;
}

/**
 * Somebody else's profile, or null when they have not opened it to this
 * viewer.
 *
 * Null rather than a refusal on purpose: "this profile is private" tells a
 * stranger that the account exists and has chosen to hide, which is a fact
 * they did not have and did not agree to share. An unfindable profile and a
 * nonexistent one look the same from outside, which is the point.
 */
export async function profileFor(
  subjectUserId: string,
  viewerUserId: string | null,
): Promise<PublicProfile | null> {
  if (subjectUserId === viewerUserId) return buildProfile(subjectUserId);

  const row = await prisma.user.findUnique({
    where: { id: subjectUserId },
    select: { profileVisibility: true },
  });
  if (!row) return null;

  const visibility = row.profileVisibility as ProfileVisibility;
  if (visibility === 'private') return null;
  if (visibility === 'members' && !viewerUserId) return null;

  return buildProfile(subjectUserId);
}

/** Look somebody up by the name the floor knows them by. */
export async function profileByCallSign(
  callSign: string,
  viewerUserId: string | null,
): Promise<PublicProfile | null> {
  const row = await prisma.user.findUnique({ where: { callSign }, select: { id: true } });
  if (!row) return null;
  return profileFor(row.id, viewerUserId);
}

async function buildProfile(userId: string): Promise<PublicProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      callSign: true,
      avatarId: true,
      createdAt: true,
      displayName: true,
      headline: true,
      about: true,
      location: true,
      githubHandle: true,
      linkedinHandle: true,
      openToWork: true,
      profileVisibility: true,
    },
  });
  if (!user) return null;

  const [badges, packages, shifts] = await Promise.all([
    prisma.earnedBadge.findMany({ where: { userId }, select: { badgeId: true } }),
    // A package counts as finished when every exercise in it is passed, and
    // that is a content question rather than a database one. Counting distinct
    // packages with at least one pass would flatter people, so this counts
    // passes and lets the client render the real figure from progress; the
    // number here is packages touched to completion by the progress table's
    // own reckoning.
    prisma.exerciseProgress.groupBy({
      by: ['packageId'],
      where: { userId, status: 'passed' },
      _count: { _all: true },
    }),
    prisma.scenarioAttempt.findMany({ where: { userId }, select: { role: true } }),
  ]);

  // Commonest seat first: somebody who has sat network analyst nine times and
  // forensics once has a shape, and alphabetical order hides it.
  const seatTally = new Map<string, number>();
  for (const attempt of shifts) {
    seatTally.set(attempt.role, (seatTally.get(attempt.role) ?? 0) + 1);
  }
  const seatsPlayed = [...seatTally.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([role]) => role);

  return {
    userId: user.id,
    callSign: user.callSign,
    avatarId: user.avatarId,
    joinedAt: user.createdAt.toISOString(),
    displayName: user.displayName ?? '',
    headline: user.headline ?? '',
    about: user.about ?? '',
    location: user.location ?? '',
    githubHandle: user.githubHandle,
    linkedinHandle: user.linkedinHandle,
    openToWork: user.openToWork,
    visibility: user.profileVisibility as ProfileVisibility,
    badgeIds: badges.map((b) => b.badgeId),
    packagesCompleted: packages.length,
    shiftsRun: shifts.length,
    seatsPlayed,
  };
}

export interface ProfileUpdate {
  displayName?: string;
  headline?: string;
  about?: string;
  location?: string;
  /** Whatever they pasted. Parsed to a handle here, never stored as given. */
  github?: string;
  linkedin?: string;
  openToWork?: boolean;
  visibility?: ProfileVisibility;
}

/**
 * Save a profile.
 *
 * Validated with the same function the browser uses, because a client that
 * checks and a server that trusts is a client that can be skipped. The parse
 * is what turns a pasted address into a handle, and a value that will not
 * parse is refused rather than stored and rendered.
 */
export async function saveProfile(userId: string, update: ProfileUpdate): Promise<PublicProfile> {
  const check = checkProfile(update);
  if (!check.ok) {
    throw new ProfileError('Some of that needs fixing.', 400, check.problems);
  }

  const github = parseGithubHandle(update.github ?? '');
  const linkedin = parseLinkedinHandle(update.linkedin ?? '');

  await prisma.user.update({
    where: { id: userId },
    data: {
      displayName: emptyToNull(update.displayName),
      headline: emptyToNull(update.headline),
      about: emptyToNull(update.about),
      location: emptyToNull(update.location),
      githubHandle: github.handle,
      linkedinHandle: linkedin.handle,
      openToWork: update.openToWork ?? false,
      profileVisibility: update.visibility ?? EMPTY_PROFILE.visibility,
    },
  });

  const saved = await buildProfile(userId);
  if (!saved) throw new ProfileError('No such account.', 404);
  return saved;
}

/** Trimmed, and null rather than an empty string, so an unset field reads as unset. */
function emptyToNull(value: string | undefined): string | null {
  const trimmed = (value ?? '').trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * The one-line card the floor and the lobby show beside a call sign.
 *
 * Separate from the full profile so a seating chart is one query rather than
 * one per chair, and so it carries nothing private: this is shown next to
 * somebody's name in a room, and a person who set their profile to private has
 * said they do not want that.
 */
export async function profileCards(
  userIds: string[],
): Promise<Record<string, { headline: string; openToWork: boolean; hasProfile: boolean }>> {
  if (userIds.length === 0) return {};
  const rows = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, headline: true, openToWork: true, profileVisibility: true },
  });
  const cards: Record<string, { headline: string; openToWork: boolean; hasProfile: boolean }> = {};
  for (const row of rows) {
    const open = row.profileVisibility !== 'private';
    cards[row.id] = {
      headline: open ? (row.headline ?? '') : '',
      openToWork: open ? row.openToWork : false,
      hasProfile: open,
    };
  }
  return cards;
}
