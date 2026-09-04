/**
 * Stage routes: propose a talk, see what is coming up, and the superadmin
 * review queue.
 *
 * The review endpoints share `requireSuperadmin` with routes/superadmin.ts
 * rather than a second copy of the DB-backed role check, for the reason that
 * file's own header gives for reading the role from the database and not the
 * session token: a demotion has to take effect on the next request, not the
 * next login.
 */

import { Router } from 'express';
import { z } from 'zod';

import {
  API_ERROR_CODES,
  STAGE_DESCRIPTION_MAX,
  STAGE_DURATION_MAX_MINUTES,
  STAGE_DURATION_MIN_MINUTES,
  STAGE_TITLE_MAX,
  STAGE_TOPIC_MAX,
} from '@soc/shared';

import { asyncRoute, HttpError, requireActiveAccount, requireAuth, sendOk } from '../http.js';
import { requireSuperadmin } from './superadmin.js';
import {
  StageError,
  cancelTalk,
  myTalks,
  pendingTalks,
  proposeTalk,
  reviewTalk,
  upcomingTalks,
} from '../services/stage.js';

export const stageRouter = Router();

stageRouter.use(requireAuth, requireActiveAccount);

function userIdOf(request: { session?: { sub: string } }): string {
  const id = request.session?.sub;
  if (!id) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
  return id;
}

/** A StageError is somebody being told why they cannot do a thing, not a fault. */
function asHttp(error: unknown): never {
  if (error instanceof StageError) {
    throw new HttpError(409, API_ERROR_CODES.validationFailed, error.message);
  }
  throw error;
}

const proposeBody = z.object({
  title: z.string().min(1).max(STAGE_TITLE_MAX),
  topic: z.string().min(1).max(STAGE_TOPIC_MAX),
  description: z.string().min(1).max(STAGE_DESCRIPTION_MAX),
  proposedStartsAt: z.string().datetime(),
  durationMinutes: z.number().int().min(STAGE_DURATION_MIN_MINUTES).max(STAGE_DURATION_MAX_MINUTES),
  meetingLink: z.string().max(500).nullish(),
});

stageRouter.post(
  '/',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = proposeBody.parse(request.body);
    try {
      sendOk(response, { talk: await proposeTalk(userId, body) }, 201);
    } catch (error) {
      asHttp(error);
    }
  }),
);

/** Approved talks still ahead of us, for anybody signed in to browse. */
stageRouter.get(
  '/',
  asyncRoute(async (request, response) => {
    sendOk(response, { talks: await upcomingTalks(userIdOf(request)) });
  }),
);

/** This person's own proposals, so a decision reaches them. */
stageRouter.get(
  '/mine',
  asyncRoute(async (request, response) => {
    sendOk(response, { talks: await myTalks(userIdOf(request)) });
  }),
);

stageRouter.post(
  '/:id/cancel',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    try {
      await cancelTalk(request.params.id!, userId);
      sendOk(response, { cancelled: true });
    } catch (error) {
      asHttp(error);
    }
  }),
);

/* --- the review queue, superadmin only ---------------------------------- */

stageRouter.get(
  '/review',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireSuperadmin(userId);
    sendOk(response, { pending: await pendingTalks(userId) });
  }),
);

const reviewBody = z.object({
  decision: z.enum(['approve', 'reject']),
  /** Required on a refusal. The service enforces that, not this schema. */
  note: z.string().max(400).nullish(),
});

stageRouter.post(
  '/review/:id',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireSuperadmin(userId);
    const body = reviewBody.parse(request.body);
    try {
      const talk = await reviewTalk(request.params.id!, userId, body.decision, body.note ?? null);
      sendOk(response, { talk });
    } catch (error) {
      asHttp(error);
    }
  }),
);
