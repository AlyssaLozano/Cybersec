/**
 * Lobby routes: presence, chat, and the chat room request queue.
 *
 * WHAT THIS FILE IS RESPONSIBLE FOR NOT GETTING WRONG
 *
 * The reviewer check. `canReview` decides who can approve a room that everybody
 * on the platform will then be able to post in, and the role it checks is read
 * from the DATABASE rather than from the session token. The token is signed at
 * login and carries whatever the role was then: trusting it means a demotion
 * does not take effect until the person signs out, which is precisely backwards
 * for a privilege check. `requirePaid` in http.ts makes the same call for the
 * same reason.
 *
 * The rate limit and the message length, which are enforced in services/lobby.ts
 * and never here, so a second route added later cannot skip them.
 */

import { Router } from 'express';
import { z } from 'zod';

import { API_ERROR_CODES, CHAT_ROOM_PUBLIC_NOTICE, LOBBY_DOORS } from '@soc/shared';
import type { LobbyDoorId, UserRole } from '@soc/shared';

import { prisma } from '../db/client.js';
import { asyncRoute, HttpError, requireAuth, sendOk } from '../http.js';
import { requireRoomAccess } from './guards.js';
import {
  LobbyError,
  canReview,
  closeRoom,
  heartbeat,
  hideMessage,
  leaveLobby,
  lobbyView,
  myRoomRequests,
  pendingRooms,
  postMessage,
  readRoom,
  requestRoom,
  reviewRoom,
} from '../services/lobby.js';
import { getIdentity } from '../services/roomStore.js';

export const lobbyRouter = Router();

lobbyRouter.use(requireAuth);

function userIdOf(request: { session?: { sub: string } }): string {
  const id = request.session?.sub;
  if (!id) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
  return id;
}

/** A LobbyError is somebody being told why they cannot do a thing, not a fault. */
function asHttp(error: unknown): never {
  if (error instanceof LobbyError) {
    throw new HttpError(409, API_ERROR_CODES.validationFailed, error.message);
  }
  throw error;
}

/**
 * Nobody stands in a lobby without a name people can say.
 *
 * 428 rather than 401, matching the war room routes: "you have not chosen a
 * call sign" is a step in a flow, and a client that cannot tell it apart from
 * an authentication failure shows a login screen to somebody already signed in.
 */
async function requireIdentity(userId: string) {
  const identity = await getIdentity(userId);
  if (!identity) {
    throw new HttpError(
      428,
      API_ERROR_CODES.validationFailed,
      'Choose a call sign and an avatar before you walk in.',
    );
  }
  return identity;
}

/** Read from the database, never from the token. See the header note. */
async function currentRole(userId: string): Promise<UserRole> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return ((user?.role as UserRole | undefined) ?? 'student') satisfies UserRole;
}

async function requireReviewer(userId: string): Promise<UserRole> {
  const role = await currentRole(userId);
  if (!canReview(role)) {
    throw new HttpError(403, API_ERROR_CODES.forbidden, 'Only staff can review chat rooms.');
  }
  return role;
}

/* --- walking in -------------------------------------------------------- */

const heartbeatBody = z.object({
  /** Which door they are heading for, or null for "just here". */
  headingFor: z
    .enum(LOBBY_DOORS.map((door) => door.id) as [LobbyDoorId, ...LobbyDoorId[]])
    .nullish(),
});

/**
 * Arrive, or say you are still here, and get the room back.
 *
 * One call rather than a POST followed by a GET, because they always happen
 * together on a timer and splitting them doubles the traffic while opening a
 * window where the viewer is missing from the list they were just added to.
 */
lobbyRouter.post(
  '/presence',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = heartbeatBody.parse(request.body ?? {});
    // The lobby is a shared space like any other, and is the first place
    // somebody removed from a room goes looking for the next one.
    await requireRoomAccess(userId);
    const identity = await requireIdentity(userId);
    const now = new Date();

    await heartbeat(identity, body.headingFor ?? null, now);
    const role = await currentRole(userId);
    sendOk(response, {
      lobby: await lobbyView(identity, role, now),
      notice: CHAT_ROOM_PUBLIC_NOTICE,
    });
  }),
);

/** Read the room without joining it. Used before the first heartbeat lands. */
lobbyRouter.get(
  '/',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const identity = await requireIdentity(userId);
    const role = await currentRole(userId);
    sendOk(response, {
      lobby: await lobbyView(identity, role, new Date()),
      notice: CHAT_ROOM_PUBLIC_NOTICE,
    });
  }),
);

lobbyRouter.delete(
  '/presence',
  asyncRoute(async (request, response) => {
    await leaveLobby(userIdOf(request));
    sendOk(response, { left: true });
  }),
);

/* --- chat -------------------------------------------------------------- */

lobbyRouter.get(
  '/rooms/:roomId/messages',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireIdentity(userId);
    const after = typeof request.query.after === 'string' ? request.query.after : null;
    try {
      sendOk(response, { messages: await readRoom(request.params.roomId!, after) });
    } catch (error) {
      asHttp(error);
    }
  }),
);

const postBody = z.object({
  body: z.string().min(1).max(2000),
  /** Set when sharing an event into the room, so the client draws a card. */
  eventId: z.string().min(1).max(64).nullish(),
});

lobbyRouter.post(
  '/rooms/:roomId/messages',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = postBody.parse(request.body);
    await requireRoomAccess(userId);
    const identity = await requireIdentity(userId);
    try {
      const message = await postMessage(
        request.params.roomId!,
        identity,
        body.body,
        body.eventId ?? null,
        new Date(),
      );
      sendOk(response, { message }, 201);
    } catch (error) {
      asHttp(error);
    }
  }),
);

/* --- asking for a room ------------------------------------------------- */

const requestBody = z.object({
  title: z.string().min(1).max(200),
  topic: z.string().min(1).max(1000),
});

lobbyRouter.post(
  '/rooms',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = requestBody.parse(request.body);
    const identity = await requireIdentity(userId);
    try {
      sendOk(response, { room: await requestRoom(identity, body.title, body.topic) }, 201);
    } catch (error) {
      asHttp(error);
    }
  }),
);

/** This person's own requests, so a decision reaches them. */
lobbyRouter.get(
  '/rooms/mine',
  asyncRoute(async (request, response) => {
    sendOk(response, { requests: await myRoomRequests(userIdOf(request)) });
  }),
);

/* --- the review queue -------------------------------------------------- */

lobbyRouter.get(
  '/review',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireReviewer(userId);
    sendOk(response, { pending: await pendingRooms() });
  }),
);

const reviewBody = z.object({
  decision: z.enum(['approve', 'reject']),
  /** Required on a refusal. The service enforces that, not this schema. */
  note: z.string().max(400).nullish(),
});

lobbyRouter.post(
  '/review/:roomId',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireReviewer(userId);
    const body = reviewBody.parse(request.body);
    try {
      const room = await reviewRoom(request.params.roomId!, userId, body.decision, body.note ?? null);
      sendOk(response, { room });
    } catch (error) {
      asHttp(error);
    }
  }),
);

const closeBody = z.object({ note: z.string().max(400).default('') });

lobbyRouter.post(
  '/review/:roomId/close',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireReviewer(userId);
    const body = closeBody.parse(request.body ?? {});
    try {
      await closeRoom(request.params.roomId!, userId, body.note);
      sendOk(response, { closed: true });
    } catch (error) {
      asHttp(error);
    }
  }),
);

lobbyRouter.post(
  '/review/messages/:messageId/hide',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireReviewer(userId);
    await hideMessage(request.params.messageId!);
    sendOk(response, { hidden: true });
  }),
);
