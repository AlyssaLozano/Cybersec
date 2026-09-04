/**
 * Platform account standing tests: run against the real SQLite database,
 * creating and deleting their own users, because the behaviour under test IS
 * the persistence (same reasoning as assessment.test.ts).
 */

import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '../db/client.js';
import {
  AccountError,
  banAccount,
  platformAccountStatus,
  reinstateAccount,
  searchAccounts,
  suspendAccount,
} from './account.js';

const TEST_USER_PREFIX = 'vitest-account-';
const ACTOR_ID = 'vitest-account-actor';
const createdUserIds: string[] = [];

async function makeUser(): Promise<string> {
  const suffix = String(createdUserIds.length);
  const user = await prisma.user.create({
    data: {
      username: `${TEST_USER_PREFIX}${suffix}`,
      email: `${TEST_USER_PREFIX}${suffix}@example.test`,
      passwordHash: 'not-a-real-hash',
    },
  });
  createdUserIds.push(user.id);
  return user.id;
}

afterAll(async () => {
  // SuperadminAction and User are not linked by a Prisma relation, so nothing
  // cascades: the log rows have to go before the users they point at.
  await prisma.superadminAction.deleteMany({
    where: { OR: [{ actorUserId: { in: createdUserIds } }, { targetUserId: { in: createdUserIds } }] },
  });
  await prisma.user.deleteMany({ where: { username: { startsWith: TEST_USER_PREFIX } } });
  await prisma.$disconnect();
});

describe('platformAccountStatus', () => {
  let userId: string;
  beforeEach(async () => {
    userId = await makeUser();
  });

  it('allows an ordinary account', async () => {
    expect(await platformAccountStatus(userId)).toEqual({ allowed: true, problem: null });
  });

  it('blocks with the ban message when banned', async () => {
    await prisma.user.update({ where: { id: userId }, data: { platformBanned: true } });
    const status = await platformAccountStatus(userId);
    expect(status.allowed).toBe(false);
    expect(status.problem).toMatch(/removed from the platform/);
  });

  it('blocks with the suspension message and the until-time when suspended into the future', async () => {
    const until = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.user.update({ where: { id: userId }, data: { platformSuspendedUntil: until } });
    const status = await platformAccountStatus(userId);
    expect(status.allowed).toBe(false);
    expect(status.problem).toContain(until.toISOString());
  });

  it('allows the account and clears a suspension that has already lapsed', async () => {
    const until = new Date(Date.now() - 60 * 60 * 1000);
    await prisma.user.update({ where: { id: userId }, data: { platformSuspendedUntil: until } });

    const status = await platformAccountStatus(userId);
    expect(status).toEqual({ allowed: true, problem: null });

    // Not just the return value: the column itself has to be cleared, or the
    // next read pays the same lapsed-suspension cost again.
    const row = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    expect(row.platformSuspendedUntil).toBeNull();
  });
});

describe('suspendAccount', () => {
  let userId: string;
  beforeEach(async () => {
    userId = await makeUser();
  });

  it('sets the suspension columns and logs a suspend action', async () => {
    const until = new Date(Date.now() + 60 * 60 * 1000);
    await suspendAccount(ACTOR_ID, userId, until, 'Repeated harassment reports.');

    const row = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    expect(row.platformSuspendedUntil?.getTime()).toBe(until.getTime());
    expect(row.platformActionReason).toBe('Repeated harassment reports.');
    expect(row.platformActionByUserId).toBe(ACTOR_ID);
    expect(row.platformActionAt).not.toBeNull();

    const action = await prisma.superadminAction.findFirst({ where: { targetUserId: userId, action: 'suspend' } });
    expect(action).not.toBeNull();
    expect(action?.actorUserId).toBe(ACTOR_ID);
    expect(action?.reason).toBe('Repeated harassment reports.');
  });

  it('requires a non-empty reason', async () => {
    const until = new Date(Date.now() + 60 * 60 * 1000);
    await expect(suspendAccount(ACTOR_ID, userId, until, '')).rejects.toThrow(AccountError);
    await expect(suspendAccount(ACTOR_ID, userId, until, '   ')).rejects.toThrow(AccountError);
  });

  it('rejects a time in the past', async () => {
    const past = new Date(Date.now() - 60 * 60 * 1000);
    await expect(suspendAccount(ACTOR_ID, userId, past, 'because')).rejects.toThrow(AccountError);
  });

  it('rejects an invalid date', async () => {
    await expect(suspendAccount(ACTOR_ID, userId, new Date('not-a-date'), 'because')).rejects.toThrow(AccountError);
  });

  it('throws for a target that does not exist', async () => {
    const until = new Date(Date.now() + 60 * 60 * 1000);
    await expect(suspendAccount(ACTOR_ID, 'no-such-user', until, 'because')).rejects.toThrow(AccountError);
  });
});

describe('banAccount', () => {
  let userId: string;
  beforeEach(async () => {
    userId = await makeUser();
  });

  it('sets platformBanned and logs a ban action', async () => {
    await banAccount(ACTOR_ID, userId, 'Confirmed doxxing.');

    const row = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    expect(row.platformBanned).toBe(true);
    expect(row.platformActionReason).toBe('Confirmed doxxing.');
    expect(row.platformActionByUserId).toBe(ACTOR_ID);

    const action = await prisma.superadminAction.findFirst({ where: { targetUserId: userId, action: 'ban' } });
    expect(action).not.toBeNull();
    expect(action?.actorUserId).toBe(ACTOR_ID);
  });

  it('requires a non-empty reason', async () => {
    await expect(banAccount(ACTOR_ID, userId, '')).rejects.toThrow(AccountError);
    await expect(banAccount(ACTOR_ID, userId, '   ')).rejects.toThrow(AccountError);
  });

  it('throws for a target that does not exist', async () => {
    await expect(banAccount(ACTOR_ID, 'no-such-user', 'because')).rejects.toThrow(AccountError);
  });
});

describe('reinstateAccount', () => {
  let userId: string;
  beforeEach(async () => {
    userId = await makeUser();
  });

  it('clears a ban and logs a reinstate action', async () => {
    await banAccount(ACTOR_ID, userId, 'Confirmed doxxing.');
    await reinstateAccount(ACTOR_ID, userId, 'Appeal upheld.');

    const row = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    expect(row.platformBanned).toBe(false);
    expect(row.platformSuspendedUntil).toBeNull();

    const action = await prisma.superadminAction.findFirst({ where: { targetUserId: userId, action: 'reinstate' } });
    expect(action).not.toBeNull();
  });

  it('clears a suspension too, regardless of which was set', async () => {
    const until = new Date(Date.now() + 60 * 60 * 1000);
    await suspendAccount(ACTOR_ID, userId, until, 'Repeated harassment reports.');
    await reinstateAccount(ACTOR_ID, userId, 'Appeal upheld.');

    const row = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    expect(row.platformBanned).toBe(false);
    expect(row.platformSuspendedUntil).toBeNull();
  });

  it('requires a non-empty reason', async () => {
    await expect(reinstateAccount(ACTOR_ID, userId, '')).rejects.toThrow(AccountError);
    await expect(reinstateAccount(ACTOR_ID, userId, '   ')).rejects.toThrow(AccountError);
  });

  it('throws for a target that does not exist', async () => {
    await expect(reinstateAccount(ACTOR_ID, 'no-such-user', 'because')).rejects.toThrow(AccountError);
  });
});

describe('searchAccounts', () => {
  it('matches by username substring', async () => {
    const userId = await makeUser();
    const row = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const results = await searchAccounts(row.username.slice(0, -1));
    expect(results.some((r) => r.id === userId)).toBe(true);
  });

  it('matches by email substring', async () => {
    const userId = await makeUser();
    const row = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const results = await searchAccounts(row.email.split('@')[0]!);
    expect(results.some((r) => r.id === userId)).toBe(true);
  });

  // SQLite's default LIKE is case-insensitive for ASCII, which is what local
  // dev and this test suite run on -- see the comment on searchAccounts.
  it('matches regardless of case, on this database', async () => {
    const userId = await makeUser();
    const row = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const results = await searchAccounts(row.username.toUpperCase());
    expect(results.some((r) => r.id === userId)).toBe(true);
  });

  it('returns nothing for an empty or whitespace query', async () => {
    expect(await searchAccounts('')).toEqual([]);
    expect(await searchAccounts('   ')).toEqual([]);
  });
});
