/**
 * Event centre routes.
 *
 * Everything an event can point at is inside the platform. There is no URL
 * field anywhere on this router, and that is deliberate rather than unbuilt:
 * see the header of @soc/shared/events.ts. A user-posted link in a feed that
 * strangers read is the exact thing this platform teaches people to distrust,
 * and it is the first thing a compromised account would be used for.
 */

import { Router } from 'express';
import { z } from 'zod';

import { API_ERROR_CODES, EVENT_KINDS, LOBBY_DOORS, RSVP_STATUSES } from '@soc/shared';
import type { EventAudience, UserRole } from '@soc/shared';

import { prisma } from '../db/client.js';
import { asyncRoute, HttpError, requireAuth, sendOk } from '../http.js';
import {
  EventError,
  cancelEvent,
  createEvent,
  getEvent,
  listEvents,
  setRsvp,
  withdrawRsvp,
} from '../services/events.js';
import { getIdentity } from '../services/roomStore.js';

export const eventsRouter = Router();

eventsRouter.use(requireAuth);

const AUDIENCES = ['all', ...LOBBY_DOORS.map((door) => door.id)] as [
  EventAudience,
  ...EventAudience[],
];

function userIdOf(request: { session?: { sub: string } }): string {
  const id = request.session?.sub;
  if (!id) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
  return id;
}

function asHttp(error: unknown): never {
  if (error instanceof EventError) {
    throw new HttpError(409, API_ERROR_CODES.validationFailed, error.message);
  }
  throw error;
}

/**
 * Hosting needs a call sign; reading does not.
 *
 * Somebody browsing what is on this month has not decided to take part yet, and
 * making them name themselves first is a door in front of a noticeboard.
 */
async function requireIdentity(userId: string) {
  const identity = await getIdentity(userId);
  if (!identity) {
    throw new HttpError(
      428,
      API_ERROR_CODES.validationFailed,
      'Choose a call sign and an avatar before you post an event.',
    );
  }
  return identity;
}

async function currentRole(userId: string): Promise<UserRole> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return (user?.role as UserRole | undefined) ?? 'student';
}

eventsRouter.get(
  '/',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const query = z
      .object({
        from: z.string().datetime().optional(),
        to: z.string().datetime().optional(),
        audience: z.enum(AUDIENCES).optional(),
        kind: z.enum(EVENT_KINDS).optional(),
      })
      .parse(request.query);

    try {
      sendOk(response, { events: await listEvents(query, userId, new Date()) });
    } catch (error) {
      asHttp(error);
    }
  }),
);

eventsRouter.get(
  '/:eventId',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const event = await getEvent(request.params.eventId!, userId);
    if (!event) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such event.');
    sendOk(response, { event });
  }),
);

const createBody = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  kind: z.enum(EVENT_KINDS),
  audience: z.enum(AUDIENCES).default('all'),
  startsAt: z.string().datetime(),
  durationMinutes: z.number().int(),
  /** A war room this event is for. Never an external address. */
  roomId: z.string().min(1).max(200).nullish(),
  capacity: z.number().int().nullish(),
});

eventsRouter.post(
  '/',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = createBody.parse(request.body);
    const identity = await requireIdentity(userId);
    try {
      const event = await createEvent(
        identity,
        { ...body, roomId: body.roomId ?? null, capacity: body.capacity ?? null },
        new Date(),
      );
      sendOk(response, { event }, 201);
    } catch (error) {
      asHttp(error);
    }
  }),
);

const rsvpBody = z.object({ status: z.enum(RSVP_STATUSES) });

eventsRouter.put(
  '/:eventId/rsvp',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = rsvpBody.parse(request.body);
    try {
      sendOk(response, {
        event: await setRsvp(request.params.eventId!, userId, body.status, new Date()),
      });
    } catch (error) {
      asHttp(error);
    }
  }),
);

eventsRouter.delete(
  '/:eventId/rsvp',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    try {
      sendOk(response, { event: await withdrawRsvp(request.params.eventId!, userId) });
    } catch (error) {
      asHttp(error);
    }
  }),
);

eventsRouter.post(
  '/:eventId/cancel',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const role = await currentRole(userId);
    try {
      sendOk(response, {
        event: await cancelEvent(request.params.eventId!, userId, role, new Date()),
      });
    } catch (error) {
      asHttp(error);
    }
  }),
);
