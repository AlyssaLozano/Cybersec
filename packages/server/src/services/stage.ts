/**
 * The Stage: somebody proposes a talk, a superadmin reviews it, and an
 * approved one shows up as upcoming for the whole lobby.
 *
 * Shaped after `services/lobby.ts`'s ChatRoom request/review pair on purpose
 * -- same "pending until a reviewer decides" flow -- but the reviewer here is
 * always a superadmin. See stage.ts in @soc/shared for why that is reserved
 * rather than open to any instructor/admin.
 *
 * WHY THE PRESENTER IDENTITY IS LOOKED UP LIVE INSTEAD OF DENORMALISED
 *
 * `ChatRoom` denormalises `requestedCallSign`/`requestedAvatarId` because a
 * transcript that rewrote itself on a rename would be unreadable. A talk that
 * has not happened yet is not a transcript, and `StageTalk` carries no such
 * columns to denormalise into anyway, so a presenter's card is built from the
 * live `User` row on every read. Somebody can propose a talk having never
 * taken a war room seat -- the Stage does not require one -- so a missing
 * call sign falls back to their username and a fixed avatar rather than a
 * broken card.
 */

import type { AvatarId, FloorIdentity, ProposeStageTalkRequest, StageTalk, StageTalkStatus } from '@soc/shared';
import { checkStageTalkRequest, isAvatarId } from '@soc/shared';

import { prisma } from '../db/client.js';

/** Thrown for a rule a person could have broken. The message is shown to them. */
export class StageError extends Error {}

const FALLBACK_AVATAR: AvatarId = 'ash';

interface StageTalkRow {
  id: string;
  presenterUserId: string;
  title: string;
  topic: string;
  description: string;
  proposedStartsAt: Date;
  durationMinutes: number;
  meetingLink: string | null;
  status: string;
  reviewedByUserId: string | null;
  reviewedAt: Date | null;
  reviewNote: string | null;
  createdAt: Date;
}

async function presenterIdentity(userId: string): Promise<FloorIdentity> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, callSign: true, avatarId: true },
  });
  return {
    userId,
    callSign: user?.callSign ?? user?.username ?? 'presenter',
    avatarId: isAvatarId(user?.avatarId ?? '') ? (user!.avatarId as AvatarId) : FALLBACK_AVATAR,
  };
}

async function rowToTalk(row: StageTalkRow, viewerId: string | null): Promise<StageTalk> {
  return {
    id: row.id,
    presenter: await presenterIdentity(row.presenterUserId),
    title: row.title,
    topic: row.topic,
    description: row.description,
    proposedStartsAt: row.proposedStartsAt.toISOString(),
    durationMinutes: row.durationMinutes,
    meetingLink: row.meetingLink,
    status: row.status as StageTalkStatus,
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
    reviewNote: row.reviewNote,
    createdAt: row.createdAt.toISOString(),
    mine: row.presenterUserId === viewerId,
  };
}

/**
 * Propose a talk.
 *
 * Validated the same way the client validates instantly (`checkStageTalkRequest`
 * in @soc/shared), and re-validated here because the client's copy is for
 * feedback, not enforcement.
 */
export async function proposeTalk(userId: string, input: ProposeStageTalkRequest): Promise<StageTalk> {
  const check = checkStageTalkRequest(input);
  if (!check.ok) throw new StageError(check.problem ?? 'That proposal will not work.');

  const row = await prisma.stageTalk.create({
    data: {
      presenterUserId: userId,
      title: input.title.trim(),
      topic: input.topic.trim(),
      description: input.description.trim(),
      proposedStartsAt: new Date(input.proposedStartsAt),
      durationMinutes: input.durationMinutes,
      meetingLink: input.meetingLink?.trim() || null,
      status: 'pending',
    },
  });
  return rowToTalk(row, userId);
}

/** Requests waiting on a decision, oldest first: a queue, not a stack. */
export async function pendingTalks(viewerId: string | null = null): Promise<StageTalk[]> {
  const rows = await prisma.stageTalk.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
  });
  return Promise.all(rows.map((row) => rowToTalk(row, viewerId)));
}

export async function pendingTalkCount(): Promise<number> {
  return prisma.stageTalk.count({ where: { status: 'pending' } });
}

export type StageDecision = 'approve' | 'reject';

/**
 * Approve or refuse a proposal.
 *
 * A refusal carries a note, the same rule `reviewRoom` in lobby.ts enforces
 * for the same reason: "no" with no reason is indistinguishable from being
 * ignored.
 */
export async function reviewTalk(
  talkId: string,
  reviewerId: string,
  decision: StageDecision,
  note: string | null,
): Promise<StageTalk> {
  const row = await prisma.stageTalk.findUnique({ where: { id: talkId } });
  if (!row) throw new StageError('No such talk.');
  if (row.status !== 'pending') throw new StageError('That talk has already been decided.');
  if (decision === 'reject' && !note?.trim()) {
    throw new StageError('Say why, so the presenter knows what to do differently.');
  }

  const updated = await prisma.stageTalk.update({
    where: { id: talkId },
    data: {
      status: decision === 'approve' ? 'approved' : 'rejected',
      reviewedByUserId: reviewerId,
      reviewedAt: new Date(),
      reviewNote: note?.trim() || null,
    },
  });

  // Logged alongside the account actions, since approving what reaches the
  // whole lobby is the same kind of reserved judgement call as a ban -- see
  // SuperadminActionKind in @soc/shared.
  await prisma.superadminAction.create({
    data: { actorUserId: reviewerId, action: 'stage-review', reason: note?.trim() || null, targetUserId: row.presenterUserId },
  });

  return rowToTalk(updated, null);
}

/** Approved talks still ahead of us, soonest first. */
export async function upcomingTalks(
  viewerId: string | null = null,
  now: Date = new Date(),
): Promise<StageTalk[]> {
  const rows = await prisma.stageTalk.findMany({
    where: { status: 'approved', proposedStartsAt: { gt: now } },
    orderBy: { proposedStartsAt: 'asc' },
  });
  return Promise.all(rows.map((row) => rowToTalk(row, viewerId)));
}

/** This person's own proposals, so a decision reaches them rather than vanishing. */
export async function myTalks(userId: string): Promise<StageTalk[]> {
  const rows = await prisma.stageTalk.findMany({
    where: { presenterUserId: userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return Promise.all(rows.map((row) => rowToTalk(row, userId)));
}

/** The presenter withdraws, or a superadmin pulls it. Never anybody else. */
export async function cancelTalk(talkId: string, userId: string): Promise<void> {
  const row = await prisma.stageTalk.findUnique({ where: { id: talkId } });
  if (!row) throw new StageError('No such talk.');

  if (row.presenterUserId !== userId) {
    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (actor?.role !== 'superadmin') {
      throw new StageError('Only the presenter or a superadmin can cancel this.');
    }
  }
  if (row.status === 'rejected' || row.status === 'cancelled') {
    throw new StageError('That talk is already settled.');
  }

  await prisma.stageTalk.update({ where: { id: talkId }, data: { status: 'cancelled' } });
}

/**
 * Swap-in point for Zoom's Server-to-Server OAuth REST API (POST
 * /users/{userId}/meetings) once Zoom API credentials exist. For now the
 * presenter supplies their own link.
 */
export function generateMeetingLink(talk: StageTalk): string | null {
  return talk.meetingLink ?? null;
}
