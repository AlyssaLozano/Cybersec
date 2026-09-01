/**
 * Assessment flow tests: persistence, resume, retake, and the leak check.
 *
 * These run against a real SQLite database, creating and deleting their own
 * users, because the behaviour under test IS the persistence. Mocking Prisma
 * here would only prove the mock works.
 *
 * The database is this file's alone -- test/database.ts hands every test file a
 * private copy -- so nothing here can be disturbed by, or disturb, another file.
 */

import { randomUUID } from 'node:crypto';

import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { ITEMS } from '../content/assessment/items.js';
import { prisma } from '../db/client.js';
import {
  getProfile,
  getState,
  resetAssessment,
  retakeDimension,
  saveResponses,
  submit,
  updateProfile,
} from './assessment.js';

const TEST_USER_PREFIX = 'vitest-assessment-';
const createdUserIds: string[] = [];

async function makeUser(): Promise<string> {
  // Random rather than a counter: a fixed name is a unique-constraint failure
  // waiting for the first run that shares a database with anything else.
  const suffix = randomUUID();
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
  // Cascade deletes the assessment session with the user. Scoped to the ids
  // this run created, never to the prefix: a prefix match would also delete
  // rows belonging to anyone else pointed at the same database.
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  await prisma.$disconnect();
});

const likertItems = ITEMS.filter((item) => item.kind === 'likert');
const choiceItems = ITEMS.filter((item) => item.kind === 'choice');

describe('assessment persistence', () => {
  let userId: string;

  beforeEach(async () => {
    userId = await makeUser();
  });

  it('starts empty and points at the first item', async () => {
    const state = await getState(userId);
    expect(state.answeredItems).toBe(0);
    expect(state.totalItems).toBe(ITEMS.length);
    expect(state.nextItemId).toBe(ITEMS[0]!.id);
    expect(state.report).toBeNull();
  });

  it('saves an answer and advances the next item', async () => {
    const first = likertItems[0]!;
    const state = await saveResponses(userId, [{ itemId: first.id, value: 5 }]);
    expect(state.answeredItems).toBe(1);
    expect(state.nextItemId).not.toBe(first.id);
  });

  it('survives a reload, which is the whole point of saving as you go', async () => {
    await saveResponses(userId, [{ itemId: likertItems[0]!.id, value: 4 }]);
    const reloaded = await getState(userId);
    expect(reloaded.answeredItems).toBe(1);
    expect(reloaded.responses[0]).toMatchObject({ itemId: likertItems[0]!.id, value: 4 });
  });

  it('overwrites rather than duplicating when an answer changes', async () => {
    const item = likertItems[0]!;
    await saveResponses(userId, [{ itemId: item.id, value: 1 }]);
    const state = await saveResponses(userId, [{ itemId: item.id, value: 5 }]);
    expect(state.answeredItems).toBe(1);
    expect(state.responses.find((r) => r.itemId === item.id)?.value).toBe(5);
  });

  it('records a forced-choice answer', async () => {
    const item = choiceItems[0]!;
    if (item.kind !== 'choice') throw new Error('expected a choice item');
    const state = await saveResponses(userId, [{ itemId: item.id, optionId: item.options[0]!.id }]);
    expect(state.responses.find((r) => r.itemId === item.id)?.optionId).toBe(item.options[0]!.id);
  });

  it('tracks progress per dimension', async () => {
    const item = likertItems[0]!;
    const state = await saveResponses(userId, [{ itemId: item.id, value: 3 }]);
    const dimension = state.dimensions.find((d) => d.dimension === item.dimension)!;
    expect(dimension.answered).toBe(1);
    expect(dimension.total).toBeGreaterThan(1);
    expect(dimension.complete).toBe(false);
  });
});

describe('input validation', () => {
  let userId: string;
  beforeEach(async () => {
    userId = await makeUser();
  });

  it('ignores an unknown item id', async () => {
    const state = await saveResponses(userId, [{ itemId: 'not-a-real-item', value: 5 }]);
    expect(state.answeredItems).toBe(0);
  });

  it('rejects an out-of-range Likert value', async () => {
    const state = await saveResponses(userId, [{ itemId: likertItems[0]!.id, value: 99 }]);
    expect(state.answeredItems).toBe(0);
  });

  it('rejects a non-integer Likert value', async () => {
    const state = await saveResponses(userId, [{ itemId: likertItems[0]!.id, value: 2.5 }]);
    expect(state.answeredItems).toBe(0);
  });

  it('rejects an option id that does not belong to the item', async () => {
    const item = choiceItems[0]!;
    const state = await saveResponses(userId, [{ itemId: item.id, optionId: 'fabricated' }]);
    expect(state.answeredItems).toBe(0);
  });

  it('rejects a Likert value sent for a choice item', async () => {
    const state = await saveResponses(userId, [{ itemId: choiceItems[0]!.id, value: 4 }]);
    expect(state.answeredItems).toBe(0);
  });
});

describe('submitting and retaking', () => {
  let userId: string;
  beforeEach(async () => {
    userId = await makeUser();
  });

  it('produces a report and caches it', async () => {
    await saveResponses(
      userId,
      likertItems.slice(0, 20).map((item) => ({ itemId: item.id, value: 5 })),
    );
    const report = await submit(userId);
    expect(report.topLanes.length).toBeGreaterThanOrEqual(3);

    const state = await getState(userId);
    expect(state.report).not.toBeNull();
    expect(state.completedAt).not.toBeNull();
  });

  it('invalidates the cached report when an answer changes', async () => {
    await saveResponses(userId, [{ itemId: likertItems[0]!.id, value: 5 }]);
    await submit(userId);
    expect((await getState(userId)).report).not.toBeNull();

    await saveResponses(userId, [{ itemId: likertItems[1]!.id, value: 2 }]);
    // A report that no longer matches the answers is worse than no report.
    expect((await getState(userId)).report).toBeNull();
  });

  it('clears only the retaken dimension', async () => {
    const pace = ITEMS.filter((item) => item.dimension === 'pace_pressure' && item.kind === 'likert');
    const people = ITEMS.filter((item) => item.dimension === 'interpersonal' && item.kind === 'likert');

    await saveResponses(userId, [
      ...pace.map((item) => ({ itemId: item.id, value: 5 })),
      ...people.map((item) => ({ itemId: item.id, value: 5 })),
    ]);

    const state = await retakeDimension(userId, 'pace_pressure');
    expect(state.dimensions.find((d) => d.dimension === 'pace_pressure')!.answered).toBe(0);
    expect(state.dimensions.find((d) => d.dimension === 'interpersonal')!.answered).toBe(people.length);
  });

  it('refuses an unknown dimension', async () => {
    await expect(retakeDimension(userId, 'not-a-dimension')).rejects.toThrow(/Unknown dimension/);
  });

  it('resets everything', async () => {
    await saveResponses(userId, [{ itemId: likertItems[0]!.id, value: 5 }]);
    await submit(userId);
    const state = await resetAssessment(userId);
    expect(state.answeredItems).toBe(0);
    expect(state.report).toBeNull();
    expect(state.completedAt).toBeNull();
  });
});

describe('profile', () => {
  let userId: string;
  beforeEach(async () => {
    userId = await makeUser();
  });

  it('starts empty', async () => {
    expect(await getProfile(userId)).toEqual({});
  });

  it('merges patches rather than replacing', async () => {
    await updateProfile(userId, { sector: 'government' });
    const profile = await updateProfile(userId, { govLevel: 'federal' });
    expect(profile).toMatchObject({ sector: 'government', govLevel: 'federal' });
  });

  it('survives a retake of the questions', async () => {
    await updateProfile(userId, { chosenTrackId: 'soc' });
    await saveResponses(userId, [{ itemId: likertItems[0]!.id, value: 5 }]);
    await retakeDimension(userId, likertItems[0]!.dimension);
    expect((await getProfile(userId)).chosenTrackId).toBe('soc');
  });
});
