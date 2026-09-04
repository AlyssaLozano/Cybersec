/**
 * Superadmin routes: platform-wide account actions, and read-only oversight
 * of a live room or match without holding a seat in either.
 *
 * WHY OBSERVATION NEVER JOINS
 *
 * `GET /rooms/:id` and `GET /matches/:id` build the same per-seat views a
 * real occupant would get -- `boardFor` for a room, `matchViewFor` for a
 * match -- but only ever by reading, never by calling `takeSeat`, `getIdentity`
 * or any join function. A superadmin who could accidentally occupy a chair
 * would be a superadmin who could accidentally change the outcome of a room
 * or match they were only supposed to be reading, which defeats the reason
 * this exists.
 *
 * It is also SILENT to the people being watched: no occupant list gains an
 * entry, no door opens, nothing about a room or match looks different from
 * the inside. `SuperadminAction` rows are the only trace, written for
 * accountability toward the superadmin, never served back to a room's own
 * participants.
 *
 * WHY THE MATCH ROUTE RETURNS BOTH SIDES' OWN VIEWS RATHER THAN ONE NEW SHAPE
 *
 * `matchViewFor` is the one place the adversarial redaction rules live --
 * your own moves whole, the opponent's reduced to what leaked. Building a
 * third "oversight" shape from the raw `MatchState` would mean maintaining a
 * second copy of those rules, and the first place it drifted would leak
 * exactly what the redaction exists to hide. Calling `matchViewFor` twice,
 * once per side, gives full oversight for free and cannot drift.
 */

import { Router } from 'express';
import { z } from 'zod';

import { API_ERROR_CODES } from '@soc/shared';
import type { SocRoleId, UserRole } from '@soc/shared';

import { SCENARIOS } from '../content/scenarios/index.js';
import { prisma } from '../db/client.js';
import { asyncRoute, HttpError, requireActiveAccount, requireAuth, sendOk } from '../http.js';
import {
  AccountError,
  banAccount,
  reinstateAccount,
  searchAccounts,
  suspendAccount,
} from '../services/account.js';
import { matchViewFor } from '../services/matchEngine.js';
import { MatchError, listActiveMatches, matchStateById } from '../services/matches.js';
import { readiness, seatingFor } from '../services/rooms.js';
import { getRoom, listVisibleRooms, toClientRoom } from '../services/roomStore.js';
import { boardFor } from '../services/shift.js';
import { claimedEventIds } from '../services/claimStore.js';

export const superadminRouter = Router();

superadminRouter.use(requireAuth, requireActiveAccount);

function userIdOf(request: { session?: { sub: string } }): string {
  const id = request.session?.sub;
  if (!id) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
  return id;
}

/** Read from the database, never from the token. Same reasoning as lobby.ts's currentRole. */
async function currentRole(userId: string): Promise<UserRole> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return ((user?.role as UserRole | undefined) ?? 'student') satisfies UserRole;
}

/** The one gate every route below shares, DB-backed so a demotion takes effect immediately. */
export async function requireSuperadmin(userId: string): Promise<void> {
  const role = await currentRole(userId);
  if (role !== 'superadmin') {
    throw new HttpError(403, API_ERROR_CODES.forbidden, 'Only a superadmin can do that.');
  }
}

function asHttp(error: unknown): never {
  if (error instanceof AccountError) {
    throw new HttpError(409, API_ERROR_CODES.validationFailed, error.message);
  }
  if (error instanceof MatchError) {
    throw new HttpError(409, 'conflict', error.message);
  }
  throw error;
}

function requiredSeatsOf(scenarioId: string): SocRoleId[] {
  return SCENARIOS.find((s) => s.id === scenarioId)?.requiredSeats ?? [];
}

function titleOf(scenarioId: string): string {
  return SCENARIOS.find((s) => s.id === scenarioId)?.title ?? scenarioId;
}

/* --- accounts ------------------------------------------------------------ */

superadminRouter.get(
  '/accounts',
  asyncRoute(async (request, response) => {
    await requireSuperadmin(userIdOf(request));
    const query = typeof request.query.query === 'string' ? request.query.query : '';
    sendOk(response, { accounts: await searchAccounts(query) });
  }),
);

const suspendBody = z.object({
  until: z.string().datetime(),
  reason: z.string().min(1).max(1000),
});

superadminRouter.post(
  '/accounts/:userId/suspend',
  asyncRoute(async (request, response) => {
    const actorUserId = userIdOf(request);
    await requireSuperadmin(actorUserId);
    const body = suspendBody.parse(request.body);
    try {
      await suspendAccount(actorUserId, request.params.userId!, new Date(body.until), body.reason);
      sendOk(response, { done: true });
    } catch (error) {
      asHttp(error);
    }
  }),
);

const reasonBody = z.object({ reason: z.string().min(1).max(1000) });

superadminRouter.post(
  '/accounts/:userId/ban',
  asyncRoute(async (request, response) => {
    const actorUserId = userIdOf(request);
    await requireSuperadmin(actorUserId);
    const body = reasonBody.parse(request.body);
    try {
      await banAccount(actorUserId, request.params.userId!, body.reason);
      sendOk(response, { done: true });
    } catch (error) {
      asHttp(error);
    }
  }),
);

superadminRouter.post(
  '/accounts/:userId/reinstate',
  asyncRoute(async (request, response) => {
    const actorUserId = userIdOf(request);
    await requireSuperadmin(actorUserId);
    const body = reasonBody.parse(request.body);
    try {
      await reinstateAccount(actorUserId, request.params.userId!, body.reason);
      sendOk(response, { done: true });
    } catch (error) {
      asHttp(error);
    }
  }),
);

/* --- picking something to observe ----------------------------------------- */

superadminRouter.get(
  '/rooms-open',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireSuperadmin(userId);
    const rooms = await listVisibleRooms(userId, new Date());
    sendOk(response, {
      rooms: rooms.map((room) => toClientRoom(room, userId, titleOf(room.scenarioId))),
    });
  }),
);

superadminRouter.get(
  '/matches-open',
  asyncRoute(async (request, response) => {
    await requireSuperadmin(userIdOf(request));
    const states = await listActiveMatches();
    // The host always holds a seat (matches are created with the host already
    // seated), so the host's own `matchViewFor` is always available -- a real,
    // legitimate view, not a fabricated one, same reasoning as the /:id route.
    sendOk(response, { matches: states.map((state) => matchViewFor(state, state.hostUserId)) });
  }),
);

/* --- observing one room ---------------------------------------------------- */

superadminRouter.get(
  '/rooms/:id',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireSuperadmin(userId);
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    const now = new Date();
    const occupied = room.seats.filter((s) => s.occupant);
    const boards = await Promise.all(
      occupied.map(async (seat) => {
        const { role } = seat;
        return { role, board: boardFor(room, role, now, await claimedEventIds(room.id, role)) };
      }),
    );

    await prisma.superadminAction.create({
      data: { actorUserId: userId, action: 'observe-room', roomKind: 'room', roomId: room.id },
    });

    sendOk(response, {
      room: toClientRoom(room, userId, titleOf(room.scenarioId)),
      seating: seatingFor(room, userId, now),
      readiness: readiness(room, requiredSeatsOf(room.scenarioId)),
      boards,
    });
  }),
);

/* --- observing one match ---------------------------------------------------- */

superadminRouter.get(
  '/matches/:id',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireSuperadmin(userId);
    const state = await matchStateById(request.params.id!).catch(asHttp);

    await prisma.superadminAction.create({
      data: { actorUserId: userId, action: 'observe-match', roomKind: 'match', roomId: state.id },
    });

    sendOk(response, {
      red: state.red.userId ? matchViewFor(state, state.red.userId) : null,
      blue: state.blue.userId ? matchViewFor(state, state.blue.userId) : null,
    });
  }),
);
