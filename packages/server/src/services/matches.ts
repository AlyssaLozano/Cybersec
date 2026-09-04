/**
 * Matches, persisted.
 *
 * This is the thin layer between the pure engine (`matchEngine.ts`) and the
 * database. It loads a row into a `MatchState`, hands it to an engine function,
 * and writes back whatever the engine returns -- the engine owns every rule, so
 * a client can no more move out of turn here than it can edit the filesystem.
 *
 * WHY A JSON BLOB PLUS COLUMNS
 * `stateJson` is the whole authoritative board and the only source of truth the
 * engine reads. The scalar columns are a projection of it, written on every save
 * so the lobby and "my matches" can filter without parsing every blob. They are
 * never read back into the engine, so they cannot disagree with it in a way that
 * matters.
 *
 * WHY MOVES RUN IN A TRANSACTION
 * Two players share one row and act on their own clocks. A move loads, mutates
 * and saves inside a single transaction so a read cannot straddle the other
 * side's write; the engine's turn check is the backstop that makes a lost update
 * fail loudly (as "not your turn") rather than silently overwrite.
 */

import { randomUUID } from 'node:crypto';

import type {
  BlueBoardAction,
  FloorIdentity,
  MatchSide,
  MatchState,
  MatchView,
  RoomVisibility,
  ScenarioDifficulty,
} from '@soc/shared';

import { prisma } from '../db/client.js';
import { getRedBlueScenario } from '../content/redblue/index.js';
import { runLine } from '../terminal/shell.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { MACHINE } from '../vfs/machine.js';
import type { Overlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';
import {
  MatchError,
  abandonMatch,
  blueAct,
  commitMove,
  createMatch,
  fire,
  joinMatch,
  matchViewFor,
  placeCoverage,
  sideOf,
  terminalKindFor,
} from './matchEngine.js';
import { boardFor, maxTurnsFor, resolveBoardFor, resolveMoveFor } from './matchContent.js';

const TERMINAL_HOME = '/home/student';
/** Where Red's activity lands, for the defender to read with the real shell. */
const HOST_LOG_PATH = '/var/log/edge.log';
const MAX_TERMINAL_INPUT = 2_000;

/**
 * Materialise the match's host log into a readable file on the seeded host.
 *
 * The base image is shared and immutable, so Red's activity is layered in as a
 * copy-on-write overlay: one log file the defender can `cat`, `grep`, and `tail`
 * exactly as they would a real appliance log. Nothing else about the host moves.
 */
function hostOverlay(state: MatchState): Overlay {
  const body =
    ['# Edge appliance log -- northwind.example, 203.0.113.0/24', ...state.hostLog].join('\n') + '\n';
  return {
    writes: {
      [HOST_LOG_PATH]: {
        kind: 'file',
        mode: 0o644,
        owner: 'root',
        group: 'adm',
        mtime: state.lastMoveAt ?? state.createdAt,
        content: body,
      },
    },
    deletes: [],
  };
}

export { MatchError } from './matchEngine.js';

/** The scalar projection written alongside the blob on every save. */
function rowData(state: MatchState) {
  return {
    scenarioId: state.scenarioId,
    difficulty: state.difficulty,
    status: state.status,
    visibility: state.visibility,
    joinCode: state.joinCode,
    hostUserId: state.hostUserId,
    redUserId: state.red.userId,
    blueUserId: state.blue.userId,
    stateJson: JSON.stringify(state),
    lastMoveAt: state.lastMoveAt === null ? null : new Date(state.lastMoveAt),
  };
}

/** The blob is the truth; the columns are only for querying. */
function fromRow(row: { stateJson: string }): MatchState {
  const state = JSON.parse(row.stateJson) as MatchState;
  // Defensive: a row written before these fields existed has none of them. Every
  // match that predates the board mode is a linear one, which is why `mode`
  // defaults rather than being backfilled by a migration.
  return {
    ...state,
    mode: state.mode ?? 'linear',
    findings: state.findings ?? [],
    hostLog: state.hostLog ?? [],
    terminalCwd: state.terminalCwd ?? { red: TERMINAL_HOME, blue: TERMINAL_HOME },
  };
}

export interface OpenMatchInput {
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  /** open = joinable from the queue; closed = joinable by invite code only. */
  visibility: RoomVisibility;
  hostUserId: string;
  hostIdentity: FloorIdentity;
  /** The chair the host takes; the opponent gets the other. */
  hostSide: MatchSide;
  maxTurns?: number;
}

/**
 * Open a new match with the host seated and one chair waiting.
 *
 * The scenario decides which game gets played: a scenario that registered a
 * board opens positional and carries a fresh one, anything else opens linear.
 * The client never chooses the mode, so a crafted request cannot ask for a board
 * on a menu scenario or the reverse.
 */
export async function openMatch(input: OpenMatchInput): Promise<MatchState> {
  const board = boardFor(input.scenarioId);
  const state = createMatch({
    id: randomUUID(),
    scenarioId: input.scenarioId,
    difficulty: input.difficulty,
    visibility: input.visibility,
    hostUserId: input.hostUserId,
    hostIdentity: input.hostIdentity,
    hostSide: input.hostSide,
    maxTurns: input.maxTurns ?? maxTurnsFor(input.scenarioId),
    mode: board ? 'positional' : 'linear',
    ...(board ? { board } : {}),
    now: Date.now(),
  });
  await prisma.match.create({ data: { id: state.id, ...rowData(state) } });
  return state;
}

/** Join a specific closed match by its code. */
export async function joinByCode(code: string, identity: FloorIdentity): Promise<MatchState> {
  const row = await prisma.match.findFirst({
    where: { joinCode: code.trim().toUpperCase(), status: 'waiting', visibility: 'closed' },
  });
  if (!row) throw new MatchError('No match is waiting on that code.');
  const next = joinMatch(fromRow(row), identity, code);
  await prisma.match.update({ where: { id: next.id }, data: rowData(next) });
  return next;
}

export interface MatchmakeResult {
  state: MatchState;
  /** True when we joined an existing match; false when we opened a fresh one. */
  joined: boolean;
}

/**
 * The open queue: join the oldest waiting match for this scenario, or open one.
 *
 * A player who finds no opponent becomes the opponent the next player finds,
 * which is what keeps a thin user base from staring at an empty queue. The
 * claim runs in a transaction and re-checks the match is still waiting, so two
 * players racing for the last open match cannot both seat into it.
 */
export async function matchmake(
  scenarioId: string,
  difficulty: ScenarioDifficulty,
  identity: FloorIdentity,
  hostSide: MatchSide,
): Promise<MatchmakeResult> {
  const joined = await prisma.$transaction(async (tx) => {
    const candidate = await tx.match.findFirst({
      where: {
        status: 'waiting',
        visibility: 'open',
        scenarioId,
        difficulty,
        hostUserId: { not: identity.userId },
      },
      orderBy: { createdAt: 'asc' },
    });
    if (!candidate) return null;

    const next = joinMatch(fromRow(candidate), identity, null);
    // Guard on the status we read: if another player seated first, this updates
    // zero rows and we fall through to opening our own match.
    const claimed = await tx.match.updateMany({
      where: { id: candidate.id, status: 'waiting' },
      data: rowData(next),
    });
    return claimed.count === 1 ? next : null;
  });

  if (joined) return { state: joined, joined: true };

  const opened = await openMatch({
    scenarioId,
    difficulty,
    visibility: 'open',
    hostUserId: identity.userId,
    hostIdentity: identity,
    hostSide,
  });
  return { state: opened, joined: false };
}

/** Commit a move for the side on the clock. Scored by the scenario's resolver. */
export async function move(
  matchId: string,
  userId: string,
  optionId: string,
  justification: string,
): Promise<MatchState> {
  return prisma.$transaction(async (tx) => {
    const row = await tx.match.findUnique({ where: { id: matchId } });
    if (!row) throw new MatchError('No such match.');
    const next = commitMove(
      fromRow(row),
      { userId, optionId, justification, now: Date.now() },
      resolveMoveFor(row.scenarioId),
    );
    await tx.match.update({ where: { id: matchId }, data: rowData(next) });
    return next;
  });
}

/**
 * Blue lays its coverage, and the board opens for play.
 *
 * Same transaction discipline as a move: two players share one row, and the
 * engine's phase check is what makes a lost update fail loudly rather than
 * silently replace somebody's placement.
 */
export async function place(
  matchId: string,
  userId: string,
  targetIds: string[],
): Promise<MatchState> {
  return prisma.$transaction(async (tx) => {
    const row = await tx.match.findUnique({ where: { id: matchId } });
    if (!row) throw new MatchError('No such match.');
    const next = placeCoverage(fromRow(row), userId, targetIds);
    await tx.match.update({ where: { id: matchId }, data: rowData(next) });
    return next;
  });
}

/** Red fires at one system. Scored by the scenario's board resolver. */
export async function fireAt(
  matchId: string,
  userId: string,
  targetId: string,
  justification: string,
): Promise<MatchState> {
  return prisma.$transaction(async (tx) => {
    const row = await tx.match.findUnique({ where: { id: matchId } });
    if (!row) throw new MatchError('No such match.');
    const next = fire(
      fromRow(row),
      { userId, targetId, justification, now: Date.now() },
      resolveBoardFor(row.scenarioId),
    );
    await tx.match.update({ where: { id: matchId }, data: rowData(next) });
    return next;
  });
}

/** Blue repositions, investigates, or contains. One of the three, per round. */
export async function blueBoardMove(
  matchId: string,
  userId: string,
  action: BlueBoardAction,
  targetId: string,
  fromId: string | undefined,
  justification: string,
): Promise<MatchState> {
  return prisma.$transaction(async (tx) => {
    const row = await tx.match.findUnique({ where: { id: matchId } });
    if (!row) throw new MatchError('No such match.');
    const next = blueAct(
      fromRow(row),
      { userId, action, targetId, fromId, justification, now: Date.now() },
      resolveBoardFor(row.scenarioId),
    );
    await tx.match.update({ where: { id: matchId }, data: rowData(next) });
    return next;
  });
}

/**
 * Run one command in the defender's investigation terminal.
 *
 * The whole engine runs here on the server, for the same reason the exercise
 * terminal does: state a client could edit is state a client could cheat. Only
 * the caller's working directory is persisted between commands; scratch files
 * they create are ephemeral, because this shell is for reading the host, not
 * living on it.
 */
export async function runTerminal(
  matchId: string,
  userId: string,
  command: string,
): Promise<{ output: string; cwd: string }> {
  if (command.length > MAX_TERMINAL_INPUT) throw new MatchError('That command is too long.');
  return prisma.$transaction(async (tx) => {
    const row = await tx.match.findUnique({ where: { id: matchId } });
    if (!row) throw new MatchError('No such match.');
    const state = fromRow(row);
    const side = sideOf(state, userId);
    if (!side) throw new MatchError('You are not in this match.');
    if (terminalKindFor(state, side) !== 'defender') {
      throw new MatchError('No defender shell at this tier. Work from the findings panel.');
    }

    const vfs = new Vfs(BASE_IMAGE, hostOverlay(state), TERMINAL_HOME);
    const result = runLine(command, { vfs, machine: MACHINE, cwd: state.terminalCwd[side] });

    const next: MatchState = {
      ...state,
      terminalCwd: { ...state.terminalCwd, [side]: result.cwd },
    };
    await tx.match.update({ where: { id: matchId }, data: rowData(next) });
    return { output: result.output, cwd: result.cwd };
  });
}

/**
 * Run one command in Red's recon console (attacker tiers).
 *
 * Unlike the defender shell, this is not the host engine: the attacker has no
 * session on the target, so the scenario answers scanning tools with realistic
 * output. A recognised recon command IS Red's move -- it goes through the engine
 * `commitMove` with the optionId the scenario mapped it to, so scoring, findings,
 * and the trace left for Blue all run through the one resolver. Anything else
 * (help, a typo) returns output and spends no turn.
 */
export async function runRedTerminal(
  matchId: string,
  userId: string,
  command: string,
  justification: string,
): Promise<{ output: string; view: MatchView }> {
  if (command.length > MAX_TERMINAL_INPUT) throw new MatchError('That command is too long.');
  return prisma.$transaction(async (tx) => {
    const row = await tx.match.findUnique({ where: { id: matchId } });
    if (!row) throw new MatchError('No such match.');
    const state = fromRow(row);
    const side = sideOf(state, userId);
    if (!side) throw new MatchError('You are not in this match.');
    if (terminalKindFor(state, side) !== 'attacker') {
      throw new MatchError('No recon console at this tier.');
    }
    const scenario = getRedBlueScenario(state.scenarioId);
    if (!scenario?.attacker) throw new MatchError('This scenario has no recon console.');

    const { output, optionId } = scenario.attacker.run(command);
    if (optionId === null) {
      // Free exploration: help, or a command that is not a recon tool. No move.
      return { output, view: matchViewFor(state, userId) };
    }

    // A recognised recon command is the move. The engine refuses it off-turn or
    // without a justification, which surfaces as a 409 shown in the console.
    const next = commitMove(
      state,
      { userId, optionId, justification, now: Date.now() },
      resolveMoveFor(state.scenarioId),
    );
    await tx.match.update({ where: { id: matchId }, data: rowData(next) });
    return { output, view: matchViewFor(next, userId) };
  });
}

/** Forfeit or cancel. Distinct from a completed match. */
export async function abandon(matchId: string, userId: string): Promise<MatchState> {
  const row = await prisma.match.findUnique({ where: { id: matchId } });
  if (!row) throw new MatchError('No such match.');
  const next = abandonMatch(fromRow(row), userId);
  await prisma.match.update({ where: { id: matchId }, data: rowData(next) });
  return next;
}

/** The redacted view one player is allowed to see. */
export async function viewFor(matchId: string, userId: string): Promise<MatchView> {
  const row = await prisma.match.findUnique({ where: { id: matchId } });
  if (!row) throw new MatchError('No such match.');
  return matchViewFor(fromRow(row), userId);
}

/** Every match a user has a seat in, newest first, each as their own view. */
export async function listFor(userId: string): Promise<MatchView[]> {
  const rows = await prisma.match.findMany({
    where: { OR: [{ redUserId: userId }, { blueUserId: userId }] },
    orderBy: { updatedAt: 'desc' },
  });
  return rows.map((row) => matchViewFor(fromRow(row), userId));
}

/**
 * Every match still worth watching, for the superadmin observation picker.
 *
 * Ordinary players never browse the whole table -- they queue or join by
 * code -- so there was no listing to reuse here the way `listVisibleRooms`
 * already existed for rooms. This is that listing's match-side counterpart:
 * waiting or active only, newest activity first.
 */
export async function listActiveMatches(): Promise<MatchState[]> {
  const rows = await prisma.match.findMany({
    where: { status: { in: ['waiting', 'active'] } },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  });
  return rows.map(fromRow);
}

/**
 * The raw match, for the superadmin oversight route only.
 *
 * Never sent to a client as-is -- see routes/superadmin.ts, which builds each
 * side's own `matchViewFor` from this and returns those, so oversight never
 * duplicates the redaction logic or invents a new unredacted shape.
 */
export async function matchStateById(matchId: string): Promise<MatchState> {
  const row = await prisma.match.findUnique({ where: { id: matchId } });
  if (!row) throw new MatchError('No such match.');
  return fromRow(row);
}
