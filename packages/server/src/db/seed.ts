/**
 * Database seed.
 *
 * Creates a demo account for local development so you can sign in without
 * registering by hand.
 *
 * The password is GENERATED and printed once, never hardcoded. A training
 * platform that ships with a known default password is a live vulnerability the
 * moment somebody deploys it without reading the seed file -- and this one, of
 * all projects, should not do that.
 *
 * Run with:  npm run db:seed --workspace @soc/server
 */

import { randomBytes } from 'node:crypto';

import type { SeatAssignment } from '@soc/shared';
import { isAvatarId } from '@soc/shared';

import { hashPassword } from '../auth/password.js';
import { ALL_EXERCISES, PACKAGES } from '../content/index.js';
import { SCENARIOS } from '../content/scenarios/index.js';
import { prisma } from './client.js';

/** A readable but genuinely random password, e.g. "harbor-42-quilt-widen". */
function generatePassword(): string {
  const words = [
    'harbor', 'quilt', 'widen', 'ember', 'lantern', 'ridge', 'cobalt', 'marsh',
    'tundra', 'willow', 'cedar', 'basalt', 'anchor', 'thicket', 'meadow', 'gable',
  ];
  const bytes = randomBytes(4);
  const pick = (index: number) => words[bytes[index]! % words.length]!;
  return `${pick(0)}-${(bytes[1]! % 90) + 10}-${pick(2)}-${pick(3)}`;
}

/**
 * A war room that is joinable the moment the app opens, for local dev.
 *
 * A real room enforces a lead time -- SEATING_OPENS_MINUTES_BEFORE in
 * @soc/shared -- so people have time to read their brief before seating opens.
 * That rule is correct for students and this seed does not touch it or the
 * service that enforces it; it writes straight to the tables the same way the
 * demo account above does, as a fixture, so a developer can open the war room
 * list and take a seat immediately instead of scheduling one and waiting.
 *
 * Upserted on a fixed id so re-running the seed pulls it back to "starts now"
 * rather than piling up stale rooms that age out of the list.
 */
async function seedDemoWarRoom(hostUserId: string): Promise<void> {
  const scenario = SCENARIOS.find((s) => s.id === 'ridgeline');
  if (!scenario) return;

  let host = await prisma.user.findUnique({
    where: { id: hostUserId },
    select: { callSign: true, avatarId: true },
  });

  if (!host?.callSign || !host.avatarId || !isAvatarId(host.avatarId)) {
    try {
      host = await prisma.user.update({
        where: { id: hostUserId },
        data: { callSign: host?.callSign ?? 'Duty-Officer', avatarId: 'ash' },
        select: { callSign: true, avatarId: true },
      });
    } catch {
      console.log('Could not set a call sign for the demo war room host -- skipping it.');
      return;
    }
  }

  const identity = {
    userId: hostUserId,
    callSign: host.callSign!,
    avatarId: host.avatarId && isAvatarId(host.avatarId) ? host.avatarId : 'ash',
  } as const;

  const roomId = 'room.seed.demo-now';
  const eventId = 'event.seed.demo-now';
  const now = new Date();

  const seats: SeatAssignment[] = scenario.roles.map((role) => ({
    role,
    occupant: role === 'ir-lead' ? identity : null,
  }));

  const roomFields = {
    startsAt: now,
    status: 'scheduled',
    visibility: 'open',
    joinCode: null,
    seatsJson: JSON.stringify(seats),
  };
  await prisma.roomSession.upsert({
    where: { id: roomId },
    create: { id: roomId, scenarioId: scenario.id, difficulty: scenario.difficulty, hostUserId, ...roomFields },
    update: roomFields,
  });

  const eventFields = { startsAt: now, cancelledAt: null };
  await prisma.communityEvent.upsert({
    where: { id: eventId },
    create: {
      id: eventId,
      title: 'Operation Ridgeline -- open floor',
      description:
        'A standing war room seeded for local development. The lead chair is already filled by the ' +
        'demo host -- take any other seat and go.',
      kind: 'war-room',
      audience: 'all',
      durationMinutes: scenario.durationMinutes,
      hostUserId,
      hostCallSign: identity.callSign,
      hostAvatarId: identity.avatarId,
      roomId,
      capacity: null,
      ...eventFields,
    },
    update: eventFields,
  });

  await prisma.eventRsvp.upsert({
    where: { eventId_userId: { eventId, userId: hostUserId } },
    create: { eventId, userId: hostUserId, status: 'going' },
    update: { status: 'going' },
  });

  console.log(`Seeded a demo war room ("${scenario.title}") that is joinable right now.`);
}

async function main(): Promise<void> {
  const username = process.env.SEED_USERNAME ?? 'demo';
  const email = process.env.SEED_EMAIL ?? 'demo@example.invalid';

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  let userId: string;

  if (existing) {
    userId = existing.id;
    console.log(`Demo account "${existing.username}" already exists -- leaving it alone.`);
    console.log('To reset its password, delete the row and re-run this seed.');
  } else {
    // An explicit password may be supplied for automated environments.
    const password = process.env.SEED_PASSWORD ?? generatePassword();
    const generated = process.env.SEED_PASSWORD === undefined;

    const created = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: await hashPassword(password),
        role: 'student',
      },
    });
    userId = created.id;

    console.log('');
    console.log('  Created a demo account for local development:');
    console.log(`    username: ${username}`);
    if (generated) {
      console.log(`    password: ${password}`);
      console.log('');
      console.log('  This password was randomly generated and is shown only once.');
      console.log('  It is not stored anywhere in the repository.');
    } else {
      console.log('    password: (taken from SEED_PASSWORD)');
    }
    console.log('');
  }

  await seedDemoWarRoom(userId);

  const exerciseCount = ALL_EXERCISES.length;
  console.log(`Content catalogue: ${PACKAGES.length} package(s), ${exerciseCount} exercises.`);
  console.log('Exercise content lives in code, not the database, so there is nothing to seed for it.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
