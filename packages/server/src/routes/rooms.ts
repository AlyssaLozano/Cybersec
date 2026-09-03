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
  aidFor,
  boardFor,
  buildClaim,
  buildReadout,
  canClose,
  canStart,
  closeShift,
  nudgeFor,
  startShift,
} from '../services/shift.js';
import { recordClaim, claimsForRoom, claimedEventIds } from '../services/claimStore.js';
import { scoreClaim, standInsFor, truthFor } from '../services/scenarios.js';
import { buildAfterAction, reviewIsAvailable } from '../services/afterAction.js';
import { qualifiesAsAttempt } from '../services/attempts.js';
import { attemptsFor, recordAttempt } from '../services/attemptStore.js';
import { historyFor, pickerLabel } from '../services/attempts.js';
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

/** Seats this scenario names as mandatory, beyond the lead. Usually none. */
function requiredSeatsOf(scenarioId: string): SocRoleId[] {
  return SCENARIOS.find((s) => s.id === scenarioId)?.requiredSeats ?? [];
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
  asyncRoute(async (request, response) => {
    const priorAttempts = await attemptsFor(userIdOf(request));
    sendOk(
      response,
      SCENARIOS.map((scenario) => ({
        /*
         * Which tiers this person has already cleared, as a letter each.
         * Nothing is blocked by it: running one again is the point, and the
         * badge exists so somebody choosing knows what they have already seen.
         */
        history: pickerLabel(historyFor(scenario.id, priorAttempts)),
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
      readiness: readiness(room, requiredSeatsOf(room.scenarioId)),
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
        readiness: readiness(seated, requiredSeatsOf(seated.scenarioId)),
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
        readiness: readiness(left, requiredSeatsOf(left.scenarioId)),
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
        readiness: readiness(moved, requiredSeatsOf(moved.scenarioId)),
      });
    } catch (error) {
      asHttp(error);
    }
  }),
);


/* ── running the shift ────────────────────────────────────────────────────
 *
 * Everything above gets people into chairs. Everything below is the exercise
 * actually happening: the clock starting, each seat's own screen, a claim
 * being committed, and the lead closing it.
 */

/** The seat this user is in, or a refusal. Every run-loop route needs it. */
function seatOf(room: { seats: { role: string; occupant: { userId: string } | null }[] }, userId: string): SocRoleId {
  const seat = room.seats.find((s) => s.occupant?.userId === userId);
  if (!seat) {
    throw new HttpError(403, API_ERROR_CODES.forbidden, 'You are not in a seat on this floor.');
  }
  return seat.role as SocRoleId;
}

/** The incident lead starts the shift, and the clock is the room's. */
roomsRouter.post(
  '/:id/start',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    const now = new Date();
    try {
      const running = await persistRoom(startShift(room, userId, now));
      sendOk(response, {
        room: toClientRoom(running, userId, titleOf(running.scenarioId)),
        board: boardFor(running, seatOf(running, userId), now),
      });
    } catch (error) {
      asHttp(error);
    }
  }),
);

/**
 * This seat's screen.
 *
 * Polled rather than pushed, because the events are on a fixed schedule and
 * the server can compute the whole board from elapsed time alone. A socket
 * would buy a few seconds of latency on a scenario measured in minutes.
 */
roomsRouter.get(
  '/:id/board',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    const role = seatOf(room, userId);
    const now = new Date();
    const claimed = await claimedEventIds(room.id, role);
    const board = boardFor(room, role, now, claimed);

    /*
     * Stand-ins go to the lead alone, and only for chairs nobody took.
     *
     * This is what makes a short floor work rather than a diminished one: the
     * incident still hangs together because the lead reads out what the empty
     * seat would have found, on the schedule it would have found it. Sending
     * them to every seat would hand each analyst the other surfaces, which is
     * the one thing the projection exists to prevent.
     */
    const filled = room.seats.filter((s) => s.occupant).map((s) => s.role);
    const standIns =
      role === 'ir-lead' && room.status === 'running'
        ? standInsFor(room.scenarioId, filled, board.elapsedSeconds)
        : [];

    sendOk(response, {
      room: toClientRoom(room, userId, titleOf(room.scenarioId)),
      board,
      standIns,
      canStart: canStart(room, userId, now),
      canClose: canClose(room, userId),
    });
  }),
);

/** What the terminal offers on one event, and the nudge if the tier gives one. */
roomsRouter.get(
  '/:id/event/:eventId/aid',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    const role = seatOf(room, userId);
    const eventId = request.params.eventId!;
    // Refuse aid on an event this seat cannot see, for the same reason the
    // claim refuses it: otherwise the hint leaks a board somebody else holds.
    const board = boardFor(room, role, new Date());
    if (!board.events.some((e) => e.id === eventId)) {
      throw new HttpError(404, API_ERROR_CODES.notFound, 'That event is not on your board.');
    }
    sendOk(response, {
      aid: aidFor(room, role, eventId),
      nudge: nudgeFor(room, role, eventId),
    });
  }),
);

const claimBody = z.object({
  eventId: z.string().min(1),
  disposition: z.enum(['escalate', 'investigate', 'dismiss', 'tune']),
  reasoning: z.string().min(1).max(4000),
  actionIds: z.array(z.string()).max(8),
  escalateTo: z.string().nullable(),
  confidence: z.number().int().min(0).max(100),
});

/**
 * Commit a claim.
 *
 * The score comes back in the response and not before, which is the whole
 * point of committing: `why` is on the truth, and releasing it earlier would
 * turn every event into a lookup.
 */
roomsRouter.post(
  '/:id/claim',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = claimBody.parse(request.body);
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    const role = seatOf(room, userId);
    const now = new Date();
    try {
      const claim = buildClaim(
        room,
        role,
        userId,
        { ...body, escalateTo: (body.escalateTo as SocRoleId | null) ?? null },
        now,
      );
      await recordClaim(room.id, userId, claim);
      sendOk(
        response,
        {
          claim,
          score: scoreClaim(room.scenarioId, claim),
          board: boardFor(room, role, now, await claimedEventIds(room.id, role)),
        },
        201,
      );
    } catch (error) {
      asHttp(error);
    }
  }),
);

const closeBody = z.object({
  findings: z.array(z.string().max(2000)).min(1).max(20),
  mitigations: z.array(z.string().max(2000)).max(20),
});

/**
 * The lead closes the shift by reading out.
 *
 * The readout is required rather than optional, and is taken here rather than
 * afterwards, because it is what the floor believed at the moment it stopped.
 * The review is worth something only because it compares that against what was
 * true, and a readout written after the answer key is visible is a
 * transcription.
 */
roomsRouter.post(
  '/:id/close',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = closeBody.parse(request.body);
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    try {
      const readout = buildReadout(room, body);
      const done = await persistRoom(closeShift(room, userId, readout, new Date()));

      /*
       * One attempt row per seat, not one per room.
       *
       * Five people in one room had five different exercises, because each only
       * ever saw their own surfaces. A single row against the room would say
       * the operator who worked the queue and the forensics seat who imaged a
       * host did the same thing.
       */
      const claims = await claimsForRoom(done.id);
      const truth = truthFor(done.scenarioId);
      const criticalIds = new Set(
        (truth?.events ?? []).filter((e) => e.critical).map((e) => e.eventId),
      );
      for (const seat of done.seats) {
        if (!seat.occupant) continue;
        const own = claims.filter((c) => c.role === seat.role);
        if (!qualifiesAsAttempt({ claimsCommitted: own.length, wasPresentAtClose: true })) continue;
        const scores = own.map((c) => scoreClaim(done.scenarioId, c)).filter(Boolean);
        const total = scores.reduce((sum, sc) => sum + (sc?.total ?? 0), 0);
        const outOf = scores.reduce((sum, sc) => sum + (sc?.outOf ?? 0), 0);
        await recordAttempt({
          userId: seat.occupant.userId,
          scenarioId: done.scenarioId,
          difficulty: done.difficulty,
          role: seat.role,
          score: outOf > 0 ? Math.round((total / outOf) * 100) : 0,
          // Never averaged into the score. Catching nine of ten and missing the
          // one that decided it is not ninety per cent of a response.
          caughtCritical: own.some((c) => criticalIds.has(c.eventId)),
          roomId: done.id,
        });
      }

      sendOk(response, {
        room: toClientRoom(done, userId, titleOf(done.scenarioId)),
        readout,
      });
    } catch (error) {
      asHttp(error);
    }
  }),
);

/**
 * The after action review.
 *
 * Gated on the readout existing, which is the same gate the debrief has always
 * had: a floor that reads the review before saying what it thought has not
 * been reviewed, it has been told.
 */
roomsRouter.get(
  '/:id/review',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const room = await getRoom(request.params.id!);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');
    // Anybody who held a seat may read it, including seats that went quiet.
    seatOf(room, userId);

    const gate = reviewIsAvailable({
      closedAtSeconds: room.closedAtSeconds ?? null,
      readoutDelivered: Boolean(room.readout),
    });
    if (!gate.ready) {
      throw new HttpError(409, API_ERROR_CODES.forbidden, gate.waitingOn ?? 'Not ready yet.');
    }

    const claims = await claimsForRoom(room.id);
    const review = buildAfterAction({
      scenarioId: room.scenarioId,
      difficulty: room.difficulty,
      claims,
      readout: room.readout!,
      // Seats that committed anything at all are the ones that filed.
      filedReports: [...new Set(claims.map((c) => c.role))],
      controlProposedAtSeconds:
        claims.find((c) => c.actionIds.some((a) => a.startsWith('act.propose-rule')))?.atSeconds ??
        null,
      closedAtSeconds: room.closedAtSeconds ?? null,
    });
    sendOk(response, { review, claims });
  }),
);
