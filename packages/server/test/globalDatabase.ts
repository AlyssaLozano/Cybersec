/**
 * Builds the template database every test file is given a private copy of, and
 * sweeps the copies away afterwards.
 *
 * Tests used to run against the developer's own `prisma/dev.db`. That made the
 * result of a test file depend on whatever else happened to be holding the
 * file -- a second `npm test`, a running dev server, `prisma studio`, an
 * interrupted run that left its rows behind. SQLite has one writer, and a test
 * that loses that race fails somewhere unrelated to what it was checking.
 *
 * Migrating a fresh database costs a couple of seconds, so the template is
 * cached between runs and rebuilt only when a migration is newer than it. The
 * per-file copies are cheap: a file copy of a hundred kilobytes or so.
 */

import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { RUN_ID_VAR, schemaPath, scratchDir, serverRoot, templatePath, scratchUrl } from './paths.js';

/** Newest mtime anywhere under `prisma/migrations`, or 0 if there are none. */
function migrationsChangedAt(): number {
  const root = join(serverRoot, 'prisma', 'migrations');
  if (!existsSync(root)) return 0;

  let newest = statSync(root).mtimeMs;
  for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    newest = Math.max(newest, statSync(join(entry.parentPath ?? entry.path, entry.name)).mtimeMs);
  }
  return newest;
}

function buildTemplate(runId: string): void {
  // Migrate under this run's own name and move it into place, so a test file
  // always copies a finished database even if a second run is rebuilding right
  // now. The name is swept with the run's other copies if the move fails.
  const pending = `${runId}-template.db`;

  // Run the CLI through node rather than `npx`, which on Windows is a shell
  // script and would need `shell: true`, and with it quoting problems.
  const cli = createRequire(import.meta.url).resolve('prisma/build/index.js');
  execFileSync(process.execPath, [cli, 'migrate', 'deploy', '--schema', schemaPath], {
    cwd: serverRoot,
    env: { ...process.env, DATABASE_URL: scratchUrl(pending) },
    stdio: 'pipe',
  });

  try {
    renameSync(join(scratchDir, pending), templatePath);
  } catch {
    // Another run won the race and installed an identical template. Use theirs;
    // the sweep below clears the loser.
  }
}

export default function setup(): () => void {
  mkdirSync(scratchDir, { recursive: true });

  const runId = randomUUID();
  process.env[RUN_ID_VAR] = runId;

  const stale = !existsSync(templatePath) || statSync(templatePath).mtimeMs < migrationsChangedAt();
  if (stale) buildTemplate(runId);

  return () => {
    // Only this run's copies. The template stays, because rebuilding it every
    // run is the slow part, and another run's copies stay because it may still
    // be using them. A copy whose process has not released its handle yet is
    // left for a later sweep rather than failing this run.
    for (const entry of readdirSync(scratchDir)) {
      if (!entry.startsWith(`${runId}-`)) continue;
      rmSync(join(scratchDir, entry), { force: true, maxRetries: 3 });
    }
  };
}
