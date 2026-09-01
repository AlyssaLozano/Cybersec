/**
 * Match routes: open a match, join one, take a turn, see the board.
 *
 * Every response is a redacted `MatchView`, never the raw `MatchState`: the
 * route hands back what the caller's side is allowed to see and nothing of the
 * opponent's board. `matchViewFor` in the engine is where that line is drawn;
 * this router simply never returns anything else.
 *
 * Async by design. There is no socket here -- a player takes their turn over
 * plain HTTP and the opponent picks it up when they next poll or open the match.
 * That is the whole reason two people can play without being online together.
 */

import { Router } from 'express';
import { z } from 'zod';

import { API_ERROR_CODES, MATCH_SIDES, ROOM_VISIBILITIES, SCENARIO_DIFFICULTIES } from '@soc/shared';
import type { FloorIdentity } from '@soc/shared';
import { AVATARS, checkCallSign } from '@soc/shared';

import { asyncRoute, HttpError, requireAuth, sendOk } from '../http.js';
import { getRedBlueScenario, redBlueBriefFor } from '../content/redblue/index.js';
import { matchViewFor } from '../services/matchEngine.js';
import {
  MatchError,
  abandon,
  joinByCode,
  listFor,
  matchmake,
  move,
  openMatch,
  runRedTerminal,
  runTerminal,
  viewFor,
} from '../services/matches.js';

export const matchesRouter = Router();

matchesRouter.use(requireAuth);

function userIdOf(request: { session?: { sub: string } }): string {
  const id = request.session?.sub;
  if (!id) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
  return id;
}

function matchIdOf(request: { params: Record<string, string | undefined> }): string {
  const id = request.params.id;
  if (!id) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such match.');
  return id;
}

/** A match rule the player broke turns into a 409 they can read and act on. */
function guard<T>(work: () => Promise<T>): Promise<T> {
  return work().catch((error: unknown) => {
    if (error instanceof MatchError) {
      throw new HttpError(409, 'conflict', error.message);
    }
    throw error;
  });
}

const identitySchema = z.object({
  callSign: z.string(),
  avatarId: z.enum(AVATARS),
});

/** Build the caller's floor identity, validating the call sign the same way a room does. */
function identityFrom(
  userId: string,
  raw: { callSign: string; avatarId: FloorIdentity['avatarId'] },
): FloorIdentity {
  const check = checkCallSign(raw.callSign);
  if (!check.ok) throw new HttpError(422, API_ERROR_CODES.validationFailed, check.problem!);
  return { userId, callSign: raw.callSign.trim(), avatarId: raw.avatarId };
}

const openSchema = z.object({
  scenarioId: z.string().min(1),
  difficulty: z.enum(SCENARIO_DIFFICULTIES),
  visibility: z.enum(ROOM_VISIBILITIES),
  side: z.enum(MATCH_SIDES),
  identity: identitySchema,
});

/** Open a new match. Closed → hand back a join code; open → it enters the queue. */
matchesRouter.post(
  '/',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = openSchema.parse(request.body);
    const identity = identityFrom(userId, body.identity);
    const state = await guard(() =>
      openMatch({
        scenarioId: body.scenarioId,
        difficulty: body.difficulty,
        visibility: body.visibility,
        hostUserId: userId,
        hostIdentity: identity,
        hostSide: body.side,
      }),
    );
    sendOk(response, matchViewFor(state, userId), 201);
  }),
);

const queueSchema = z.object({
  scenarioId: z.string().min(1),
  difficulty: z.enum(SCENARIO_DIFFICULTIES),
  side: z.enum(MATCH_SIDES),
  identity: identitySchema,
});

/** Queue up: join the oldest waiting open match, or open one and wait. */
matchesRouter.post(
  '/queue',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = queueSchema.parse(request.body);
    const identity = identityFrom(userId, body.identity);
    const result = await guard(() => matchmake(body.scenarioId, body.difficulty, identity, body.side));
    sendOk(
      response,
      { ...matchViewFor(result.state, userId), joined: result.joined },
      result.joined ? 200 : 201,
    );
  }),
);

const joinSchema = z.object({
  code: z.string().min(1),
  identity: identitySchema,
});

/** Join a specific closed match by its invite code. */
matchesRouter.post(
  '/join',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = joinSchema.parse(request.body);
    const identity = identityFrom(userId, body.identity);
    const state = await guard(() => joinByCode(body.code, identity));
    sendOk(response, matchViewFor(state, userId));
  }),
);

/** Every match the caller has a seat in, each redacted to their side. */
matchesRouter.get(
  '/',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    sendOk(response, await listFor(userId));
  }),
);

/** The caller's view of one match. Polled to pick up the opponent's move. */
matchesRouter.get(
  '/:id',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    sendOk(response, await guard(() => viewFor(matchIdOf(request), userId)));
  }),
);

/**
 * The caller's brief: the target dossier and their own move menu.
 *
 * Scrubbed of scoring, and only ever the caller's own side, so it leaks nothing
 * about how a move grades or what the opponent can play.
 */
matchesRouter.get(
  '/:id/brief',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const view = await guard(() => viewFor(matchIdOf(request), userId));
    const scenario = getRedBlueScenario(view.scenarioId);
    if (!scenario) throw new HttpError(404, API_ERROR_CODES.notFound, 'No brief for this scenario yet.');
    sendOk(response, redBlueBriefFor(scenario, view.you));
  }),
);

const moveSchema = z.object({
  optionId: z.string().min(1),
  justification: z.string().min(1),
});

/** Take a turn. Refused with 409 if it is not the caller's move. */
matchesRouter.post(
  '/:id/move',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = moveSchema.parse(request.body);
    const state = await guard(() =>
      move(matchIdOf(request), userId, body.optionId, body.justification),
    );
    sendOk(response, matchViewFor(state, userId));
  }),
);

const terminalSchema = z.object({ command: z.string() });

/**
 * Run one command in the defender's investigation terminal.
 *
 * Only the defender, and only at a tier that grants a shell; the service refuses
 * otherwise. Returns just the output and the new prompt location, never the
 * match state.
 */
matchesRouter.post(
  '/:id/terminal',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = terminalSchema.parse(request.body);
    sendOk(response, await guard(() => runTerminal(matchIdOf(request), userId, body.command)));
  }),
);

const attackSchema = z.object({
  command: z.string(),
  /** Required only when the command is a scored recon action; the service enforces it. */
  justification: z.string().default(''),
});

/**
 * Run one command in Red's recon console.
 *
 * Returns the tool output and the caller's refreshed view, since a recognised
 * command is a move that changes the board (findings, whose turn it is).
 */
matchesRouter.post(
  '/:id/attack',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const body = attackSchema.parse(request.body);
    sendOk(
      response,
      await guard(() => runRedTerminal(matchIdOf(request), userId, body.command, body.justification)),
    );
  }),
);

/** Forfeit or cancel a match. */
matchesRouter.post(
  '/:id/abandon',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const state = await guard(() => abandon(matchIdOf(request), userId));
    sendOk(response, matchViewFor(state, userId));
  }),
);
