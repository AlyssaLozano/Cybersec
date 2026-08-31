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

import { hashPassword } from '../auth/password.js';
import { ALL_EXERCISES, PACKAGES } from '../content/index.js';
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

async function main(): Promise<void> {
  const username = process.env.SEED_USERNAME ?? 'demo';
  const email = process.env.SEED_EMAIL ?? 'demo@example.invalid';

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existing) {
    console.log(`Demo account "${existing.username}" already exists -- leaving it alone.`);
    console.log('To reset its password, delete the row and re-run this seed.');
  } else {
    // An explicit password may be supplied for automated environments.
    const password = process.env.SEED_PASSWORD ?? generatePassword();
    const generated = process.env.SEED_PASSWORD === undefined;

    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: await hashPassword(password),
        role: 'student',
      },
    });

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
