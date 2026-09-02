/**
 * Server entry point.
 */

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { ALL_EXERCISES, PACKAGES } from './content/index.js';
import { corsOrigins, env } from './env.js';
import { errorHandler, sendError } from './http.js';
import { authRouter } from './routes/auth.js';
import { assessmentRouter } from './routes/assessment.js';
import { learningRouter } from './routes/learning.js';
import { matchesRouter } from './routes/matches.js';
import { roomsRouter } from './routes/rooms.js';

export function createApp() {
  const app = express();

  // Behind a load balancer this is what makes secure cookies and client IPs work.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    cors({
      origin: corsOrigins,
      // Sessions ride in a cookie, so the browser must be allowed to send it.
      credentials: true,
    }),
  );

  // Terminal input is small; a low cap limits the damage a bad actor can do.
  app.use(express.json({ limit: '64kb' }));
  app.use(cookieParser());

  app.get('/api/health', (_request, response) => {
    response.json({
      ok: true,
      packages: PACKAGES.length,
      exercises: ALL_EXERCISES.length,
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/learning', learningRouter);
  app.use('/api/assessment', assessmentRouter);
  app.use('/api/matches', matchesRouter);
  app.use('/api/rooms', roomsRouter);

  app.use((_request, response) => {
    sendError(response, 404, { code: 'not_found', message: 'No such endpoint.' });
  });

  app.use(errorHandler);
  return app;
}

// Only listen when run directly, so tests can import createApp without binding
// a port.
const isDirectRun = process.argv[1]?.includes('index');
if (isDirectRun) {
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`SOC simulator API listening on http://localhost:${env.PORT}`);
    console.log(`  ${PACKAGES.length} package(s), ${ALL_EXERCISES.length} exercises loaded`);
    console.log(`  CORS origins: ${corsOrigins.join(', ')}`);
  });
}
