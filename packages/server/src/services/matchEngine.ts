/**
 * The rules of a match, as pure functions.
 *
 * WHY PURE, AND SEPARATE FROM PERSISTENCE
 *
 * Every rule a player could break -- moving out of turn, joining a match that
 * is full, reading the opponent's board -- is decided here, on plain objects,
 * with the clock and the randomness injected. That is what makes the turn
 * machinery testable without a database and impossible to bypass from the
 * client: `matches.ts` loads a row, hands the object to these functions, and
 * writes back whatever they return. The server is authoritative for the same
 * reason the terminal is (`live.ts` says it best).
 *
 * Content is injected, never imported. A move's score and the signal it leaks
 * are scenario logic; the engine takes a `ResolveMove` and asks it. So the
 * engine is complete and tested before any red-vs-blue scenario is written.
 */

import type {
  FloorIdentity,
  MatchFinding,
  MatchMove,
  MatchMoveScore,
  MatchSide,
  MatchSignal,
  MatchState,
  MatchTerminalKind,
  MatchView,
  OpponentMoveView,
  RevealedFinding,
  RoomVisibility,
  ScenarioDifficulty,
} from '@soc/shared';
import { checkCallSign, isAvatarId, otherSide } from '@soc/shared';

import { generateJoinCode } from './rooms.js';

/** Thrown for a rule a person could have broken. The message is shown to them. */
export class MatchError extends Error {}

/** Red always opens; a defender with nothing to react to has no move to make. */
const OPENING_SIDE: MatchSide = 'red';

/** Where every terminal prompt starts, matching the exercise sessions. */
const TERMINAL_HOME = '/home/student';

/** Tiers at which a side works through a terminal rather than the menu (Tier 3 and 4). */
const TERMINAL_TIERS = new Set<ScenarioDifficulty>(['advanced', 'expert']);

/**
 * Which terminal a side gets at this tier, if any.
 *
 * Blue is on the host, so Blue gets a real defender shell. Red is scanning a
 * remote target, so Red gets an attacker recon console. Below the higher tiers,
 * neither: both sides work from the menu and the findings panel.
 */
export function terminalKindFor(state: MatchState, side: MatchSide): MatchTerminalKind | null {
  if (!TERMINAL_TIERS.has(state.difficulty)) return null;
  return side === 'blue' ? 'defender' : 'attacker';
}

/** A sane default when a scenario does not name its own turn budget. */
export const DEFAULT_MAX_TURNS = 8;

export interface CreateMatchInput {
  id: string;
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  /** open = matched from the queue; closed = joined by invite code. */
  visibility: RoomVisibility;
  hostUserId: string;
  hostIdentity: FloorIdentity;
  /** The side the host takes. The opponent gets the other chair. */
  hostSide: MatchSide;
  maxTurns?: number;
  /** Epoch ms, injected. */
  now: number;
  random?: () => number;
}

/**
 * Open a match with the host seated and one chair empty.
 *
 * A closed match gets a join code to hand out; an open one gets none, because a
 * code that gates nothing is a secret worth less than no secret (the same call
 * `rooms.ts` makes). The match starts `waiting`: no turns happen until an
 * opponent fills the other seat.
 */
export function createMatch(input: CreateMatchInput): MatchState {
  const check = checkCallSign(input.hostIdentity.callSign);
  if (!check.ok) throw new MatchError(check.problem!);
  if (!isAvatarId(input.hostIdentity.avatarId)) {
    throw new MatchError('Pick an avatar before you open a match.');
  }
  if (input.hostIdentity.userId !== input.hostUserId) {
    throw new MatchError('The host identity does not match the host.');
  }

  const host = { userId: input.hostUserId, identity: input.hostIdentity };
  const empty = { userId: null, identity: null };

  return {
    id: input.id,
    scenarioId: input.scenarioId,
    difficulty: input.difficulty,
    status: 'waiting',
    visibility: input.visibility,
    joinCode: input.visibility === 'closed' ? generateJoinCode(input.random) : null,
    hostUserId: input.hostUserId,
    red: { side: 'red', ...(input.hostSide === 'red' ? host : empty) },
    blue: { side: 'blue', ...(input.hostSide === 'blue' ? host : empty) },
    toMove: OPENING_SIDE,
    turn: 1,
    maxTurns: input.maxTurns ?? DEFAULT_MAX_TURNS,
    moves: [],
    findings: [],
    hostLog: [],
    terminalCwd: { red: TERMINAL_HOME, blue: TERMINAL_HOME },
    createdAt: input.now,
    lastMoveAt: null,
  };
}

/** Which chair, if either, this user holds. */
export function sideOf(state: MatchState, userId: string): MatchSide | null {
  if (state.red.userId === userId) return 'red';
  if (state.blue.userId === userId) return 'blue';
  return null;
}

/**
 * Whether a user could join this match, without mutating it.
 *
 * Split out from `joinMatch` so the lobby can grey out a full or wrong-code
 * match with a reason, rather than only finding out on the attempt.
 */
export function canJoin(
  state: MatchState,
  userId: string,
  suppliedCode: string | null,
): { ok: boolean; problem: string | null } {
  if (state.status === 'abandoned') return { ok: false, problem: 'This match was cancelled.' };
  if (state.status === 'complete') return { ok: false, problem: 'This match has already finished.' };
  if (state.status === 'active') return { ok: false, problem: 'This match is already full.' };
  if (sideOf(state, userId)) return { ok: false, problem: 'You are already in this match.' };
  if (state.hostUserId === userId) return { ok: false, problem: 'You cannot join your own match.' };
  if (state.visibility === 'closed') {
    if (!suppliedCode) return { ok: false, problem: 'This match needs its join code.' };
    if (suppliedCode.trim().toUpperCase() !== state.joinCode) {
      return { ok: false, problem: 'That join code does not match.' };
    }
  }
  return { ok: true, problem: null };
}

/**
 * Seat the opponent and start the match.
 *
 * The joiner lands in whichever chair the host left open, the status flips to
 * `active`, and Red is on the clock. Call signs must be distinct: two players
 * answering to the same handle in one match is a coordination failure, refused
 * at the door exactly as a room refuses it.
 */
export function joinMatch(
  state: MatchState,
  identity: FloorIdentity,
  suppliedCode: string | null,
): MatchState {
  const gate = canJoin(state, identity.userId, suppliedCode);
  if (!gate.ok) throw new MatchError(gate.problem!);

  const idCheck = checkCallSign(identity.callSign);
  if (!idCheck.ok) throw new MatchError(idCheck.problem!);
  if (!isAvatarId(identity.avatarId)) throw new MatchError('Pick an avatar before you sit down.');

  const openSide: MatchSide = state.red.userId === null ? 'red' : 'blue';
  const host = openSide === 'red' ? state.blue : state.red;
  if (
    host.identity &&
    host.identity.callSign.toLowerCase() === identity.callSign.toLowerCase()
  ) {
    throw new MatchError(
      `The other player is already using "${identity.callSign}". Pick another for this match.`,
    );
  }

  const seated = { userId: identity.userId, identity };
  return {
    ...state,
    status: 'active',
    red: openSide === 'red' ? { side: 'red', ...seated } : state.red,
    blue: openSide === 'blue' ? { side: 'blue', ...seated } : state.blue,
    toMove: OPENING_SIDE,
    turn: 1,
  };
}

/** What a move needs from scenario content: its score and the signal it leaks. */
export interface MoveResolution {
  score: MatchMoveScore;
  signal: MatchSignal | null;
  /**
   * What the move let the mover SEE: services and vulns for a recon move, the
   * evidence behind a signal for an investigation. The engine stamps the side
   * and turn and drops any it has already recorded, so a repeated move reveals
   * nothing new rather than duplicating what is on the board.
   */
  reveals?: RevealedFinding[];
  /**
   * Log lines this move wrote to the host. Appended to the shared host log so a
   * defender investigating in the terminal finds the trace the move left.
   */
  hostLog?: string[];
}

/** Injected by the caller from scenario content. Pure; the engine only asks. */
export type ResolveMove = (context: {
  state: MatchState;
  side: MatchSide;
  optionId: string;
  /** The mover's one-line rationale, so a scenario can score the reasoning too. */
  justification: string;
}) => MoveResolution;

export interface MoveInput {
  userId: string;
  optionId: string;
  justification: string;
  /** Epoch ms, injected. */
  now: number;
}

/**
 * Commit a move for the side whose turn it is.
 *
 * The turn check is the load-bearing rule: a move is refused unless the match is
 * active and the mover holds the side on the clock. After it commits, the clock
 * passes to the other side, and a round closes (the turn number advances) when
 * Blue has answered Red. When the turn budget is spent the match completes.
 *
 * Scoring and the leaked signal come from `resolve` -- the engine records what
 * content decides, it does not decide it.
 */
export function commitMove(state: MatchState, input: MoveInput, resolve: ResolveMove): MatchState {
  if (state.status !== 'active') {
    throw new MatchError('This match is not in play.');
  }
  const side = sideOf(state, input.userId);
  if (!side) throw new MatchError('You are not in this match.');
  if (side !== state.toMove) throw new MatchError('It is not your turn.');

  const justification = input.justification.trim();
  if (!justification) {
    throw new MatchError('Say why, in a line. The reasoning is half of what is scored.');
  }
  if (!input.optionId.trim()) throw new MatchError('Pick a move.');

  const { score, signal, reveals, hostLog } = resolve({ state, side, optionId: input.optionId, justification });

  // Stamp the mover's side and this turn onto each reveal, and drop any this side
  // has already discovered, so running the same recon twice adds nothing new.
  const known = new Set(state.findings.filter((f) => f.side === side).map((f) => f.id));
  const newFindings: MatchFinding[] = (reveals ?? [])
    .filter((r) => !known.has(r.id))
    .map((r) => ({ ...r, side, turn: state.turn }));

  const move: MatchMove = {
    seq: state.moves.length + 1,
    side,
    turn: state.turn,
    optionId: input.optionId,
    justification,
    score,
    signal,
    at: input.now,
  };

  // A round is Red then Blue. The turn number advances only when Blue closes it,
  // so `turn` counts completed exchanges rather than half-moves.
  const roundCloses = side === 'blue';
  const nextTurn = roundCloses ? state.turn + 1 : state.turn;
  const complete = roundCloses && nextTurn > state.maxTurns;

  return {
    ...state,
    moves: [...state.moves, move],
    findings: [...state.findings, ...newFindings],
    hostLog: [...state.hostLog, ...(hostLog ?? [])],
    toMove: otherSide(side),
    turn: nextTurn,
    status: complete ? 'complete' : state.status,
    lastMoveAt: input.now,
  };
}

/**
 * End a match early. A forfeit or a cancel, never a completion.
 *
 * Kept distinct from the turn budget running out: an abandoned match must never
 * read as a match somebody played to the end, because progress and any future
 * ladder both care about the difference.
 */
export function abandonMatch(state: MatchState, userId: string): MatchState {
  if (state.status === 'complete' || state.status === 'abandoned') return state;
  if (state.hostUserId !== userId && !sideOf(state, userId)) {
    throw new MatchError('You are not in this match.');
  }
  return { ...state, status: 'abandoned' };
}

/**
 * The match as ONE side may see it -- the adversarial `toStudentView`.
 *
 * Your own moves pass through whole; the opponent's are reduced to the signal
 * each one leaked, so their reasoning, their scores and their exact actions
 * never cross. The join code is handed back only to the host of a match still
 * waiting behind a code, so they can pass it on and nobody else can read it.
 */
export function matchViewFor(state: MatchState, userId: string): MatchView {
  const you = sideOf(state, userId);
  if (!you) throw new MatchError('You are not in this match.');
  const opp = otherSide(you);
  const yours = you === 'red' ? state.red : state.blue;
  const opponent = opp === 'red' ? state.red : state.blue;

  const yourMoves = state.moves.filter((m) => m.side === you);
  const opponentActivity: OpponentMoveView[] = state.moves
    .filter((m) => m.side === opp)
    .map((m) => ({ seq: m.seq, turn: m.turn, side: m.side, signal: m.signal, at: m.at }));

  const showCode =
    state.status === 'waiting' && state.hostUserId === userId && state.visibility === 'closed';

  return {
    id: state.id,
    scenarioId: state.scenarioId,
    difficulty: state.difficulty,
    status: state.status,
    you,
    youIdentity: yours.identity,
    opponent: { identity: opponent.identity, present: opponent.userId !== null },
    toMove: state.toMove,
    yourTurn: state.status === 'active' && state.toMove === you,
    turn: state.turn,
    maxTurns: state.maxTurns,
    yourMoves,
    opponentActivity,
    yourFindings: state.findings.filter((f) => f.side === you),
    terminal: (() => {
      const kind = terminalKindFor(state, you);
      return kind ? { kind, cwd: state.terminalCwd[you] } : null;
    })(),
    joinCode: showCode ? state.joinCode : null,
  };
}
