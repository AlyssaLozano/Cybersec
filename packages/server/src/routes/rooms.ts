/**
 * War room routes: schedule a room, find one, take a seat.
 *
 * TWO THINGS THIS FILE IS RESPONSIBLE FOR NOT LEAKING
 *
 * The join code, which is handled by `toClientRoom` in the store and never by a
 * handler here. And the seat chart, which must always come from the scenario's
 * own declared roles: a route that built a chart from `SOC_ROLE_IDS` would look
 * right and would offer somebody a chair with no evidence behind it. Every seat
 * view on this router comes from `seatingFor`, which reads the room, which was
 * built from the scenario.
 *
 * WHY SEATING IS SERVER-SIDE AT ALL
 *
 * The obvious alternative is to let the browser hold the chart and post a
 * choice. Two people take the same chair four hundred milliseconds apart and
 * both are told yes, and an hour later two people are grading themselves
 * against one remit while a seat nobody covered gets read out as a stand-in.
 * The chart is authoritative here for the same reason the terminal engine is.
 */

import { Router } from 'express';
import { z } from 'zod';

import {
  API_ERROR_CODES,
  AVATARS,
  ROOM_VISIBILITIES,
  SCENARIO_DIFFICULTIES,
  SOC_ROLE_IDS,
} from '@soc/shared';
import type { SocRoleId } from '@soc/shared';

import { SOC_ROLES } from '@soc/shared';

import { SCENARIOS } from '../content/scenarios/index.js';
import { asyncRoute, HttpError, requireAuth, sendOk } from '../http.js';
import {
  RoomError,
  canJoin,
  handOverLead,
  leaveSeat,
  readiness,
  seatingFor,
} from '../services/rooms.js';
import { takeSeat } from '../services/rooms.js';
import {
  createRoom,
  getIdentity,
  getRoom,
  listVisibleRooms,
  persistRoom,
  setIdentity,
  toClientRoom,
} from '../services/roomStore.js';

export const roomsRouter = Router();

roomsRouter.use(requireAuth);

function userIdOf(request: { session?: { sub: string } }): string {
  const id = request.session?.sub;
  if (!id) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
  return id;
}

/** A RoomError is somebody being told why they cannot do a thing, not a fault. */
function asHttp(error: unknown): never {
  if (error instanceof RoomError) {
    throw new HttpError(409, API_ERROR_CODES.validationFailed, error.message);
  }
  throw error;
}

function titleOf(scenarioId: string): string {
  return SCENARIOS.find((s) => s.id === scenarioId)?.title ?? scenarioId;
}

/**
 * Somebody has to have a name before they can sit down.
 *
 * Returned rather than thrown as a 401, because "you have not chosen a call
 * sign" is a step in a flow and not an authentication failure, and the client
 * needs to tell those apart to know whether to show a form or a login screen.
 */
async function requireIdentity(userId: string) {
  const identity = await getIdentity(userId);
  if (!identity) {
    throw new HttpError(
      428,
      API_ERROR_CODES.validationFailed,
      'Choose a call sign and an avatar before taking a seat.',
    );
  }
  return identity;
}

/** The scenarios somebody can schedule, with the seat count for each. */
roomsRouter.get(
  '/scenarios',
  asyncRoute(async (_request, response) => {
    sendOk(
      response,
      SCENARIOS.map((scenario) => ({
        id: scenario.id,
        title: scenario.title,
        situation: scenario.situation,
        defaultDifficulty: scenario.difficulty,
        durationMinutes: scenario.durationMinutes,
        // The seat list ships so the picker can show the floor before anybody
        // commits. It is the same list the room is built from, and it carries
        // the tier so somebody choosing a chair can see which one is the job
        // they would actually be hired into.
        roles: scenario.roles,
        seats: scenario.roles.map((role) => {
          const profile = SOC_ROLES.find((r) => r.id === role);
          return {
            role,
            title: profile?.title ?? role,
            tier: profile?.tier ?? 'tier-2',
            entryPoint: profile?.entryPoint ?? false,
            oneLine: profile?.oneLine ?? '',
          };
        }),
      })),
    );
  }),
);

roomsRouter.get(
  '/identity',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    sendOk(response, { identity: await getIdentity(userId), avatars: AVATARS });
  }),
);

const identityBody = z.object({
  callSign: z.string().min(1).max(64),
  avatarId: z.string().min(1).max(64),
});

roomsRouter.put(
  '/identity',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = identityBody.parse(request.body);
    try {
      sendOk(response, { identity: await setIdentity(userId, body.callSign, body.avatarId) });
    } catch (error) {
      asHttp(error);
    }
  }),
);

roomsRouter.get(
  '/',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const rooms = await listVisibleRooms(userId, new Date());
    sendOk(response, {
      rooms: rooms.map((room) => toClientRoom(room, userId, titleOf(room.scenarioId))),
    });
  }),
);

const createBody = z.object({
  scenarioId: z.string().min(1),
  difficulty: z.enum(SCENARIO_DIFFICULTIES),
  startsAt: z.string().datetime(),
  visibility: z.enum(ROOM_VISIBILITIES),
});

roomsRouter.post(
  '/',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = createBody.parse(request.body);
    const identity = await requireIdentity(userId);

    if (!SCENARIOS.some((s) => s.id === body.scenarioId)) {
      throw new HttpError(404, API_ERROR_CODES.notFound, 'No such scenario.');
    }

    try {
      const room = await createRoom({ ...body, host: identity, now: new Date() });
      sendOk(response, { room: toClientRoom(room, userId, titleOf(room.scenarioId)) }, 201);
    } catch (error) {
      asHttp(error);
    }
  }),
);

/**
 * One room, with this viewer's seat chart.
 *
 * The chart and the room go together in one response deliberately. Fetching
 * them separately means the browser can render a chair as free that was taken
 * between the two requests, and somebody clicks it and is refused for no
 * visible reason.
 */
roomsRouter.get(
  '/:id',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const code = typeof request.query.code === 'string' ? request.query.code : null;
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    const entry = canJoin(room, code, userId);
    if (!entry.ok) {
      throw new HttpError(403, API_ERROR_CODES.forbidden, entry.problem ?? 'This room is closed.');
    }

    const now = new Date();
    sendOk(response, {
      room: toClientRoom(room, userId, titleOf(room.scenarioId)),
      seating: seatingFor(room, userId, now),
      readiness: readiness(room),
      identity: await getIdentity(userId),
    });
  }),
);

const seatBody = z.object({
  role: z.enum(SOC_ROLE_IDS),
  code: z.string().nullish(),
});

roomsRouter.post(
  '/:id/seat',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = seatBody.parse(request.body);
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    const entry = canJoin(room, body.code ?? null, userId);
    if (!entry.ok) {
      throw new HttpError(403, API_ERROR_CODES.forbidden, entry.problem ?? 'This room is closed.');
    }

    const identity = await requireIdentity(userId);
    const now = new Date();
    try {
      // takeSeat refuses a role this scenario does not seat, so a client that
      // offered one anyway is told no here rather than being trusted.
      const seated = await persistRoom(takeSeat(room, body.role as SocRoleId, identity, now));
      sendOk(response, {
        room: toClientRoom(seated, userId, titleOf(seated.scenarioId)),
        seating: seatingFor(seated, userId, now),
        readiness: readiness(seated),
      });
    } catch (error) {
      asHttp(error);
    }
  }),
);

roomsRouter.delete(
  '/:id/seat',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    const now = new Date();
    try {
      const left = await persistRoom(leaveSeat(room, userId));
      sendOk(response, {
        room: toClientRoom(left, userId, titleOf(left.scenarioId)),
        seating: seatingFor(left, userId, now),
        readiness: readiness(left),
      });
    } catch (error) {
      asHttp(error);
    }
  }),
);

const handoverBody = z.object({ toUserId: z.string().min(1) });

roomsRouter.post(
  '/:id/handover',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = handoverBody.parse(request.body);
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    const now = new Date();
    try {
      const moved = await persistRoom(handOverLead(room, body.toUserId));
      sendOk(response, {
        room: toClientRoom(moved, userId, titleOf(moved.scenarioId)),
        seating: seatingFor(moved, userId, now),
        readiness: readiness(moved),
      });
    } catch (error) {
      asHttp(error);
    }
  }),
);
