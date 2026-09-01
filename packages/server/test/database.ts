/**
 * Gives each test file its own database, before the file imports anything.
 *
 * Vitest runs this once per test file, in that file's own process, ahead of the
 * file's imports -- which is the only window in which `DATABASE_URL` can still
 * be changed, because `src/env.ts` reads it at import time and the Prisma
 * client is built from it.
 *
 * A private database is what makes the fixtures safe. Two test files can create
 * "the same" user, or assume an empty table, without either one reaching the
 * other, so nothing has to be serialised and nothing has to be retried.
 */

import { randomUUID } from 'node:crypto';
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

import { RUN_ID_VAR, scratchDir, scratchUrl, templatePath } from './paths.js';

// The run id prefix is what lets the global teardown tell this run's copies
// apart from a concurrent run's. Absent only if a file is somehow run without
// the global setup, in which case the copy is simply swept later.
const fileName = `${process.env[RUN_ID_VAR] ?? 'orphan'}-${randomUUID()}.db`;
copyFileSync(templatePath, join(scratchDir, fileName));

// Deliberately unconditional: a developer's .env points at their working
// database, and tests must never write to it.
process.env.DATABASE_URL = scratchUrl(fileName);

// Test defaults, so `npm test` works on a checkout with no .env at all. Set
// only when absent, so CI can still override them. The secret is never used to
// protect anything here; it only has to satisfy the 32-character floor in
// src/env.ts.
process.env.JWT_SECRET ??= 'vitest-secret-not-used-for-anything-real';
process.env.CORS_ORIGIN ??= 'http://localhost:5173';
