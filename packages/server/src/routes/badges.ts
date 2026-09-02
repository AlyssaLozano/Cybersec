/**
 * The badge case.
 *
 * Read-only. Badges are awarded by passing exercises, inside recordAttempt, and
 * there is deliberately no endpoint that grants one: an award route is a route
 * somebody can call, and a badge that can be requested is not evidence of
 * anything.
 */

import { Router } from 'express';

import { API_ERROR_CODES } from '@soc/shared';

import { asyncRoute, HttpError, requireAuth, sendOk } from '../http.js';
import { caseFor } from '../services/badges.js';

export const badgesRouter = Router();

badgesRouter.use(requireAuth);

badgesRouter.get(
  '/',
  asyncRoute(async (request, response) => {
    const userId = request.session?.sub;
    if (!userId) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
    sendOk(response, await caseFor(userId));
  }),
);
