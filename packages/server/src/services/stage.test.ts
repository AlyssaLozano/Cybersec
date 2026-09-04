/**
 * Stage talk tests: run against the real SQLite database, creating and
 * deleting their own users and talks, because the behaviour under test IS
 * the persistence (same reasoning as assessment.test.ts).
 */

import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import type { ProposeStageTalkRequest } from '@soc/shared';
import { checkStageTalkRequest } from '@soc/shared';

import { prisma } from '../db/client.js';
import {
  StageError,
  cancelTalk,
  generateMeetingLink,
  myTalks,
  pendingTalkCount,
  pendingTalks,
  proposeTalk,
  reviewTalk,
  upcomingTalks,
} from './stage.js';

const TEST_USER_PREFIX = 'vitest-stage-';
const createdUserIds: string[] = [];
const createdTalkIds: string[] = [];

async function makeUser(overrides: { callSign?: string; avatarId?: string; role?: string } = {}): Promise<string> {
  const suffix = String(createdUserIds.length);
  const user = await prisma.user.create({
    data: {
      username: `${TEST_USER_PREFIX}${suffix}`,
      email: `${TEST_USER_PREFIX}${suffix}@example.test`,
      passwordHash: 'not-a-real-hash',
      callSign: overrides.callSign,
      avatarId: overrides.avatarId,
      role: overrides.role ?? 'student',
    },
  });
  createdUserIds.push(user.id);
  return user.id;
}

function validInput(overrides: Partial<ProposeStageTalkRequest> = {}): ProposeStageTalkRequest {
  return {
    title: 'Reading a Suricata alert queue without panicking',
    topic: 'Alert triage',
    description:
      'A walkthrough of how to triage a queue of Suricata alerts without treating every single one as urgent.',
    proposedStartsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 45,
    ...overrides,
  };
}

async function propose(userId: string, overrides: Partial<ProposeStageTalkRequest> = {}) {
  const talk = await proposeTalk(userId, validInput(overrides));
  createdTalkIds.push(talk.id);
  return talk;
}

afterAll(async () => {
  await prisma.stageTalk.deleteMany({ where: { id: { in: createdTalkIds } } });
  // SuperadminAction is not linked to User by a Prisma relation, so nothing
  // cascades: the log rows have to go before the users they point at.
  await prisma.superadminAction.deleteMany({
    where: { OR: [{ actorUserId: { in: createdUserIds } }, { targetUserId: { in: createdUserIds } }] },
  });
  await prisma.user.deleteMany({ where: { username: { startsWith: TEST_USER_PREFIX } } });
  await prisma.$disconnect();
});

describe('proposeTalk', () => {
  let userId: string;
  beforeEach(async () => {
    userId = await makeUser();
  });

  it('creates a pending talk when the request passes checkStageTalkRequest', async () => {
    const talk = await propose(userId);
    expect(talk.status).toBe('pending');
    expect(talk.title).toBe('Reading a Suricata alert queue without panicking');
  });

  it('throws StageError with checkStageTalkRequest\'s own problem when the request fails it', async () => {
    const bad = validInput({ proposedStartsAt: new Date(Date.now() - 1000).toISOString() });
    const check = checkStageTalkRequest(bad);
    expect(check.ok).toBe(false);

    await expect(proposeTalk(userId, bad)).rejects.toThrow(StageError);
    await expect(proposeTalk(userId, bad)).rejects.toThrow(check.problem!);
  });
});

describe('presenter identity', () => {
  it('falls back to the username and a fixed avatar when unset', async () => {
    const userId = await makeUser();
    const talk = await propose(userId);
    expect(talk.presenter.callSign).toBe(`${TEST_USER_PREFIX}${createdUserIds.indexOf(userId)}`);
    expect(talk.presenter.avatarId).toBe('ash');
  });

  it('uses the real call sign and avatar when set', async () => {
    const userId = await makeUser({ callSign: 'Vitest-Presenter', avatarId: 'birch' });
    const talk = await propose(userId);
    expect(talk.presenter.callSign).toBe('Vitest-Presenter');
    expect(talk.presenter.avatarId).toBe('birch');
  });
});

describe('pendingTalks / pendingTalkCount', () => {
  it('returns only pending talks, oldest first', async () => {
    const userId = await makeUser();
    const first = await propose(userId, { title: 'First proposal, oldest of the three' });
    const second = await propose(userId, { title: 'Second proposal, created after the first' });
    const approved = await propose(userId, { title: 'This one gets approved and should not show' });

    // Force a strict, unambiguous order: two calls in the same test can land
    // in the same millisecond on this database.
    await prisma.stageTalk.update({ where: { id: first.id }, data: { createdAt: new Date('2026-01-01T00:00:00Z') } });
    await prisma.stageTalk.update({ where: { id: second.id }, data: { createdAt: new Date('2026-01-02T00:00:00Z') } });

    const reviewer = await makeUser({ role: 'superadmin' });
    await reviewTalk(approved.id, reviewer, 'approve', null);

    const pending = await pendingTalks();
    const pendingIds = pending.map((t) => t.id);
    expect(pendingIds).toContain(first.id);
    expect(pendingIds).toContain(second.id);
    expect(pendingIds).not.toContain(approved.id);
    expect(pendingIds.indexOf(first.id)).toBeLessThan(pendingIds.indexOf(second.id));

    const count = await pendingTalkCount();
    expect(count).toBe(pending.length);
  });
});

describe('reviewTalk', () => {
  let userId: string;
  let reviewerId: string;
  beforeEach(async () => {
    userId = await makeUser();
    reviewerId = await makeUser({ role: 'superadmin' });
  });

  it('approves: sets status, reviewedBy and reviewedAt', async () => {
    const talk = await propose(userId);
    const reviewed = await reviewTalk(talk.id, reviewerId, 'approve', null);

    expect(reviewed.status).toBe('approved');
    expect(reviewed.reviewedAt).not.toBeNull();

    const row = await prisma.stageTalk.findUniqueOrThrow({ where: { id: talk.id } });
    expect(row.reviewedByUserId).toBe(reviewerId);
  });

  it('rejecting requires a non-empty note', async () => {
    const talk = await propose(userId);
    await expect(reviewTalk(talk.id, reviewerId, 'reject', null)).rejects.toThrow(StageError);

    const talk2 = await propose(userId);
    await expect(reviewTalk(talk2.id, reviewerId, 'reject', '   ')).rejects.toThrow(StageError);
  });

  it('rejecting with a note sets reviewNote', async () => {
    const talk = await propose(userId);
    const reviewed = await reviewTalk(talk.id, reviewerId, 'reject', 'Topic overlaps last month\'s talk.');
    expect(reviewed.status).toBe('rejected');
    expect(reviewed.reviewNote).toBe('Topic overlaps last month\'s talk.');
  });

  it('throws on a talk that has already been decided', async () => {
    const talk = await propose(userId);
    await reviewTalk(talk.id, reviewerId, 'approve', null);
    await expect(reviewTalk(talk.id, reviewerId, 'approve', null)).rejects.toThrow(StageError);
  });

  it('logs a stage-review action', async () => {
    const talk = await propose(userId);
    await reviewTalk(talk.id, reviewerId, 'approve', null);

    const action = await prisma.superadminAction.findFirst({
      where: { targetUserId: userId, action: 'stage-review' },
    });
    expect(action).not.toBeNull();
    expect(action?.actorUserId).toBe(reviewerId);
  });
});

describe('upcomingTalks', () => {
  it('returns only approved talks still ahead of us', async () => {
    const userId = await makeUser();
    const reviewer = await makeUser({ role: 'superadmin' });

    const future = await propose(userId, { title: 'Approved talk still in the future' });
    await reviewTalk(future.id, reviewer, 'approve', null);

    // proposeTalk refuses a past date, so the past-but-approved case has to
    // be built by approving a future talk and then backdating it directly.
    const pastApproved = await propose(userId, { title: 'Approved talk that already happened' });
    await reviewTalk(pastApproved.id, reviewer, 'approve', null);
    await prisma.stageTalk.update({
      where: { id: pastApproved.id },
      data: { proposedStartsAt: new Date(Date.now() - 60 * 60 * 1000) },
    });

    const stillPending = await propose(userId, { title: 'Still pending, not approved at all' });

    const upcoming = await upcomingTalks();
    const upcomingIds = upcoming.map((t) => t.id);
    expect(upcomingIds).toContain(future.id);
    expect(upcomingIds).not.toContain(pastApproved.id);
    expect(upcomingIds).not.toContain(stillPending.id);
  });
});

describe('myTalks', () => {
  it('is scoped to the presenter, newest first', async () => {
    const userId = await makeUser();
    const otherId = await makeUser();
    await propose(otherId, { title: 'Belongs to somebody else entirely' });

    const older = await propose(userId, { title: 'My older proposal' });
    const newer = await propose(userId, { title: 'My newer proposal' });
    await prisma.stageTalk.update({ where: { id: older.id }, data: { createdAt: new Date('2026-01-01T00:00:00Z') } });
    await prisma.stageTalk.update({ where: { id: newer.id }, data: { createdAt: new Date('2026-01-02T00:00:00Z') } });

    const mine = await myTalks(userId);
    expect(mine.map((t) => t.id)).toEqual([newer.id, older.id]);
  });
});

describe('cancelTalk', () => {
  it('lets the presenter cancel their own pending talk', async () => {
    const userId = await makeUser();
    const talk = await propose(userId);
    await cancelTalk(talk.id, userId);

    const row = await prisma.stageTalk.findUniqueOrThrow({ where: { id: talk.id } });
    expect(row.status).toBe('cancelled');
  });

  it('lets the presenter cancel their own approved talk', async () => {
    const userId = await makeUser();
    const reviewer = await makeUser({ role: 'superadmin' });
    const talk = await propose(userId);
    await reviewTalk(talk.id, reviewer, 'approve', null);

    await cancelTalk(talk.id, userId);
    const row = await prisma.stageTalk.findUniqueOrThrow({ where: { id: talk.id } });
    expect(row.status).toBe('cancelled');
  });

  it('refuses a different, non-superadmin user', async () => {
    const userId = await makeUser();
    const strangerId = await makeUser();
    const talk = await propose(userId);

    await expect(cancelTalk(talk.id, strangerId)).rejects.toThrow(StageError);
  });

  it('lets a superadmin cancel somebody else\'s talk', async () => {
    const userId = await makeUser();
    const superadminId = await makeUser({ role: 'superadmin' });
    const talk = await propose(userId);

    await cancelTalk(talk.id, superadminId);
    const row = await prisma.stageTalk.findUniqueOrThrow({ where: { id: talk.id } });
    expect(row.status).toBe('cancelled');
  });

  it('throws when the talk is already settled', async () => {
    const userId = await makeUser();
    const reviewer = await makeUser({ role: 'superadmin' });
    const talk = await propose(userId);
    await reviewTalk(talk.id, reviewer, 'reject', 'Not a fit right now.');

    await expect(cancelTalk(talk.id, userId)).rejects.toThrow(StageError);
  });
});

describe('the mine flag', () => {
  it('is true only when the viewer matches the presenter', async () => {
    const userId = await makeUser();
    const otherId = await makeUser();
    const talk = await propose(userId);

    const asPresenter = (await pendingTalks(userId)).find((t) => t.id === talk.id);
    const asOther = (await pendingTalks(otherId)).find((t) => t.id === talk.id);
    expect(asPresenter?.mine).toBe(true);
    expect(asOther?.mine).toBe(false);
  });
});

describe('generateMeetingLink', () => {
  it('returns the link when set, and null when not', async () => {
    const userId = await makeUser();
    const withLink = await propose(userId, { meetingLink: 'https://example.test/meet/abc' });
    const withoutLink = await propose(userId, { meetingLink: null });

    expect(generateMeetingLink(withLink)).toBe('https://example.test/meet/abc');
    expect(generateMeetingLink(withoutLink)).toBeNull();
  });
});
