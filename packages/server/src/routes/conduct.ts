/**
 * Reporting somebody, and the queue a person reads afterwards.
 *
 * ONE ROUTER FOR EVERY SHARED SPACE
 *
 * The SOC floor, the red versus blue match and the lobby chat are three
 * different products with three different tables, and it would be natural to
 * put a report button in each. That is how you end up with three thresholds
 * that drift, and with somebody ejected from the floor who moves to the lobby
 * and carries on. The space is a field, not a router.
 *
 * THE CLIENT NEVER SENDS THE CONTEXT
 *
 * The browser posts who and why. Everything else on the report -- the seats,
 * the call sign, how far into the shift it was, how many people were present,
 * and what the reported person had recently done -- is assembled here from the
 * room. A client that could supply the occupant count could set it to two and
 * lower the threshold, and a client that could supply the recent lines could
 * write them.
 */

import { Router } from 'express';
import { z } from 'zod';

import {
  API_ERROR_CODES,
  RECENT_CONTEXT_LINES,
  REPORT_NOTE_MAX,
  REPORT_REASONS,
  REPORT_SPACES,
} from '@soc/shared';
import type { ReportContext, ReportSpace } from '@soc/shared';

import { asyncRoute, HttpError, requireAuth, sendOk } from '../http.js';
import { prisma } from '../db/client.js';
import { getRoom } from '../services/roomStore.js';
import { recentActivityBy } from '../services/claimStore.js';
import { elapsedSeconds } from '../services/shift.js';
import { readRoom } from '../services/lobby.js';
import {
  ConductError,
  conductRecord,
  ejectedRoomIds,
  openReports,
  resolveReport,
  roomAccess,
  submitReport,
} from '../services/conduct.js';

export const conductRouter = Router();
conductRouter.use(requireAuth);

function userIdOf(request: { session?: { sub: string } }): string {
  const id = request.session?.sub;
  if (!id) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
  return id;
}

function asHttp(error: unknown): never {
  if (error instanceof ConductError) {
    throw new HttpError(error.status, API_ERROR_CODES.validationFailed, error.message);
  }
  throw error;
}

/** The categories, so the client never hardcodes a list that can drift. */
conductRouter.get(
  '/reasons',
  asyncRoute(async (_request, response) => {
    sendOk(response, { reasons: REPORT_REASONS });
  }),
);

/** This account's own standing: whether rooms are open, and which are not. */
conductRouter.get(
  '/me',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const [access, ejected] = await Promise.all([roomAccess(userId), ejectedRoomIds(userId)]);
    sendOk(response, { access, ejectedRoomIds: ejected });
  }),
);

const reportBody = z.object({
  space: z.enum(REPORT_SPACES),
  roomId: z.string().min(1),
  subjectUserId: z.string().min(1),
  reason: z.string().min(1).max(40),
  note: z.string().max(REPORT_NOTE_MAX).default(''),
});

conductRouter.post(
  '/report',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = reportBody.parse(request.body);
    const now = new Date();

    const context = await contextFor(body.space, body.roomId, userId, body.subjectUserId, now);

    try {
      const receipt = await submitReport(
        {
          space: body.space,
          roomId: body.roomId,
          reporterUserId: userId,
          subjectUserId: body.subjectUserId,
          reason: body.reason,
          note: body.note,
          context,
        },
        now,
      );
      sendOk(response, receipt, 201);
    } catch (error) {
      asHttp(error);
    }
  }),
);

/**
 * Assemble what the server knows, and refuse a reporter who is not there.
 *
 * The presence check is the important half. Without it, anybody with a room id
 * can report anybody in it, which turns the button into a way to follow a
 * person between rooms rather than a way to deal with the one you are in.
 */
async function contextFor(
  space: ReportSpace,
  roomId: string,
  reporterUserId: string,
  subjectUserId: string,
  now: Date,
): Promise<ReportContext> {
  if (space === 'soc-floor') {
    const room = await getRoom(roomId);
    if (!room) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such room.');

    const reporterSeat = room.seats.find((s) => s.occupant?.userId === reporterUserId);
    const subjectSeat = room.seats.find((s) => s.occupant?.userId === subjectUserId);
    if (!reporterSeat) {
      throw new HttpError(403, API_ERROR_CODES.forbidden, 'You can only report somebody in a room you are in.');
    }
    if (!subjectSeat?.occupant) {
      throw new HttpError(404, API_ERROR_CODES.notFound, 'That person is not on this floor.');
    }

    return {
      subjectRef: room.scenarioId,
      subjectSeat: subjectSeat.role,
      subjectCallSign: subjectSeat.occupant.callSign,
      reporterSeat: reporterSeat.role,
      atSeconds: room.status === 'running' ? elapsedSeconds(room, now) : null,
      recent: await recentActivityBy(roomId, subjectUserId, RECENT_CONTEXT_LINES),
      occupants: room.seats.filter((s) => s.occupant).length,
    };
  }

  if (space === 'lobby') {
    // A chat room has no seats and no fixed roster, so the occupant count is
    // who has spoken recently. Using the whole lobby population instead would
    // set a threshold nobody in a quiet room could ever reach.
    const messages = await readRoom(roomId, null);
    const recent = messages.slice(-80);
    const speakers = new Set(recent.map((m) => m.author.userId));
    if (!speakers.has(reporterUserId) && recent.length > 0) {
      // Reading a room without having spoken in it is normal and is not a
      // reason to refuse: somebody who has been lurking has still seen it.
      speakers.add(reporterUserId);
    }
    const theirs = recent.filter((m) => m.author.userId === subjectUserId);
    if (theirs.length === 0) {
      throw new HttpError(404, API_ERROR_CODES.notFound, 'That person has not said anything in this room.');
    }

    return {
      subjectRef: roomId,
      subjectSeat: null,
      subjectCallSign: theirs[theirs.length - 1]!.author.callSign,
      reporterSeat: null,
      atSeconds: null,
      recent: theirs.slice(-RECENT_CONTEXT_LINES).map((m) => `${m.sentAt} ${m.author.callSign}: ${m.body}`),
      occupants: speakers.size,
    };
  }

  // Red versus blue is two people. The threshold function returns 2 for a room
  // of two, which cannot be reached by the one other person present, and that
  // is deliberate: in a duel the report goes to staff and nobody gets to
  // remove their opponent mid-match.
  const match = await prisma.match.findUnique({ where: { id: roomId } });
  if (!match) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such match.');
  const sides = [match.redUserId, match.blueUserId];
  if (!sides.includes(reporterUserId)) {
    throw new HttpError(403, API_ERROR_CODES.forbidden, 'You can only report somebody in a match you are in.');
  }
  if (!sides.includes(subjectUserId)) {
    throw new HttpError(404, API_ERROR_CODES.notFound, 'That person is not in this match.');
  }
  const them = await prisma.user.findUnique({ where: { id: subjectUserId }, select: { callSign: true } });

  return {
    subjectRef: match.scenarioId,
    subjectSeat: match.redUserId === subjectUserId ? 'red' : 'blue',
    subjectCallSign: them?.callSign ?? 'unknown',
    reporterSeat: match.redUserId === reporterUserId ? 'red' : 'blue',
    atSeconds: null,
    recent: [],
    occupants: sides.filter(Boolean).length,
  };
}

/* -- staff review ------------------------------------------------------- */

async function requireReviewer(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'instructor' && user?.role !== 'admin') {
    throw new HttpError(403, API_ERROR_CODES.forbidden, 'Only staff can read conduct reports.');
  }
}

conductRouter.get(
  '/queue',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireReviewer(userId);
    sendOk(response, { reports: await openReports() });
  }),
);

const resolveBody = z.object({ outcome: z.enum(['upheld', 'dismissed']) });

conductRouter.post(
  '/reports/:id/resolve',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireReviewer(userId);
    const body = resolveBody.parse(request.body);
    try {
      await resolveReport(request.params.id!, userId, body.outcome);
      sendOk(response, { resolved: true });
    } catch (error) {
      asHttp(error);
    }
  }),
);

conductRouter.get(
  '/record/:userId',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    await requireReviewer(userId);
    sendOk(response, await conductRecord(request.params.userId!));
  }),
);
