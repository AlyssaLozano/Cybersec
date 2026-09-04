/**
 * Where the per-test-file databases live.
 *
 * Shared by the global setup (which builds the template) and the per-file setup
 * (which copies it), so the two cannot drift apart.
 *
 * The path is expressed to Prisma as a URL relative to `prisma/schema.prisma`,
 * because that is what a relative `file:` URL means to both the CLI and the
 * generated client. Keeping the scratch directory under `prisma/` therefore
 * needs no absolute-path handling, which is one fewer thing to get wrong on
 * Windows.
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const serverRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const schemaPath = join(serverRoot, 'prisma', 'schema.prisma');
export const scratchDir = join(serverRoot, 'prisma', '.vitest');

export const templatePath = join(scratchDir, 'template.db');

/**
 * Names the copies belonging to one `vitest` run.
 *
 * The global setup stamps this into the environment, which the worker processes
 * inherit when they are forked. It exists so a finishing run sweeps up only its
 * own copies, and never the ones an overlapping run is still using.
 */
export const RUN_ID_VAR = 'SOC_TEST_DB_RUN';

/** A `file:` URL for a database inside the scratch directory. */
export function scratchUrl(fileName: string): string {
  return `file:./.vitest/${fileName}`;
}
