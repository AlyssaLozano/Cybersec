/**
 * Configuration, validated once at startup.
 *
 * Everything comes from the environment with no host-specific defaults baked in,
 * so the same build runs locally and on AWS with only the environment changing.
 *
 * Misconfiguration fails the process immediately rather than surfacing later as
 * a confusing runtime error -- and in the case of JWT_SECRET, rather than
 * silently signing sessions with a guessable key.
 */

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

/**
 * Load a local .env file, if one exists.
 *
 * Uses Node's built-in loader rather than a dotenv dependency. Real deployments
 * (AWS task definitions, systemd units) set actual environment variables and
 * have no .env file at all, so a missing file is normal and never an error.
 *
 * Variables already present in the environment win: `process.loadEnvFile` does
 * not overwrite them, which is what lets CI and production override the file.
 */
function loadDotEnv(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    process.env.ENV_FILE,
    join(here, '..', '.env'), // packages/server/.env
    join(here, '..', '..', '..', '.env'), // repository root .env
  ].filter((path): path is string => typeof path === 'string');

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    try {
      process.loadEnvFile(path);
      return;
    } catch {
      // A malformed .env should surface as a validation error below, with a
      // message naming the offending variable, rather than a parse crash here.
    }
  }
}
loadDotEnv();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required. Copy .env.example to .env.'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  COOKIE_SECURE: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
});

function load() {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${problems}\n`);
  }

  const env = parsed.data;

  // A placeholder secret in production would mean forgeable sessions.
  if (env.NODE_ENV === 'production') {
    if (env.JWT_SECRET.includes('replace-me')) {
      throw new Error('JWT_SECRET is still the example value. Set a real secret before running in production.');
    }
    if (!env.COOKIE_SECURE) {
      throw new Error('COOKIE_SECURE must be true in production so session cookies are only sent over HTTPS.');
    }
  }

  return env;
}

export const env = load();

/** Origins allowed to call the API with credentials. */
export const corsOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);

export const isProduction = env.NODE_ENV === 'production';
