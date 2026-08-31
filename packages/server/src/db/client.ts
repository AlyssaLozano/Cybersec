/**
 * The Prisma client, as a single shared instance.
 *
 * A module-level singleton matters under `tsx watch`: each reload would
 * otherwise open a new pool and eventually exhaust database connections.
 */

import { PrismaClient } from '@prisma/client';

import { env, isProduction } from '../env.js';

declare global {
  // eslint-disable-next-line no-var
  var __socPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__socPrisma ??
  new PrismaClient({
    log: isProduction ? ['warn', 'error'] : ['warn', 'error'],
  });

if (!isProduction) globalThis.__socPrisma = prisma;

void env;
