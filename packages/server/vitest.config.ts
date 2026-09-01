import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Builds the migrated template database once per run; the per-file setup
    // copies it. See test/globalDatabase.ts for why tests no longer share the
    // developer's dev.db.
    globalSetup: ['./test/globalDatabase.ts'],
    setupFiles: ['./test/database.ts'],
  },
});
