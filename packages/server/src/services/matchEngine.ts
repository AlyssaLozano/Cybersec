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
  BlueBoardAction,
  BoardState,
  BoardTarget,
  BoardTargetView,
  BoardViewForSide,
  FloorIdentity,
  MatchFinding,
  MatchMove,
  MatchMoveScore,
  MatchSide,
  MatchMode,
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

/**
 * Who is on the clock at the start.
 *
 * Red, except on a positional board still in placement: there, Blue lays its
 * coverage before anything can be fired at, so Blue holds the clock until it
 * locks in. Same rule at creation and at join, so the two cannot drift.
 */
function openerFor(board: BoardState | undefined): MatchSide {
  return board?.phase === 'placement' ? 'blue' : OPENING_SIDE;
}

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
  // A positional match IS its board: there is no host to read and no remote to
  // scan, so neither console applies at any tier.
  if (state.mode === 'positional') return null;
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
  /** Which game to play. Defaults to `linear`, so every existing caller is unchanged. */
  mode?: MatchMode;
  /**
   * The scenario's starting board, for a positional match. Passed in rather than
   * looked up, for the same reason `ResolveMove` is: the engine stays content-blind.
   */
  board?: BoardState;
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
  const mode: MatchMode = input.mode ?? 'linear';
  if (mode === 'positional' && !input.board) {
    throw new MatchError('A positional match needs a board.');
  }

  return {
    id: input.id,
    scenarioId: input.scenarioId,
    difficulty: input.difficulty,
    mode,
    status: 'waiting',
    visibility: input.visibility,
    joinCode: input.visibility === 'closed' ? generateJoinCode(input.random) : null,
    hostUserId: input.hostUserId,
    red: { side: 'red', ...(input.hostSide === 'red' ? host : empty) },
    blue: { side: 'blue', ...(input.hostSide === 'blue' ? host : empty) },
    toMove: openerFor(input.board),
    turn: 1,
    maxTurns: input.maxTurns ?? DEFAULT_MAX_TURNS,
    moves: [],
    findings: [],
    hostLog: [],
    terminalCwd: { red: TERMINAL_HOME, blue: TERMINAL_HOME },
    ...(mode === 'positional' ? { board: input.board } : {}),
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
    toMove: openerFor(state.board),
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
    mode: state.mode,
    ...(state.board ? { board: boardViewFor(state.board, you) } : {}),
    winner: state.board ? boardWinner(state.board) : null,
    joinCode: showCode ? state.joinCode : null,
  };
}

/* ---------------------------------------------------------------------------
 * POSITIONAL MODE: the board game.
 *
 * Everything below is the second match mode and touches nothing above it. The
 * shape is the same discipline as `commitMove`: pure functions, an injected
 * clock, a `MatchError` for any rule a player could break, and content injected
 * rather than imported. What differs is that here the engine owns the MECHANICS
 * -- whether a shot lands on coverage, what a containment does -- because those
 * are rules, not flavour. Content still owns the score and the words.
 *
 * The load-bearing secret is `board.coverage`. It is written only by Blue's own
 * actions and read only by `boardViewFor`, which never hands it to Red. If that
 * one function is right, Red cannot learn where the defences are except by
 * firing at them, which is the entire game.
 * ------------------------------------------------------------------------- */

/** What mechanically happened, so content can score and narrate it. Targets are pre-action. */
export type BoardOutcome =
  | {
      kind: 'fire';
      target: BoardTarget;
      /** The shot landed on coverage: Red is seen, and gains nothing here. */
      defended: boolean;
      /** The target was already taken or already walled, so the shot bought nothing. */
      spent: boolean;
      /** Red reached the objective undetected and the match is over. */
      won: boolean;
    }
  | { kind: 'reposition'; from: BoardTarget; to: BoardTarget; movesLeft: number }
  | { kind: 'investigate'; target: BoardTarget; found: boolean }
  | { kind: 'contain'; target: BoardTarget };

/** Injected from scenario content, exactly as `ResolveMove` is for the linear mode. */
export type ResolveBoardMove = (context: {
  state: MatchState;
  side: MatchSide;
  outcome: BoardOutcome;
  justification: string;
}) => MoveResolution;

/** The board, or a clear refusal. Positional calls against a linear match land here. */
function boardOf(state: MatchState): BoardState {
  if (state.mode !== 'positional' || !state.board) {
    throw new MatchError('This match is not played on a board.');
  }
  return state.board;
}

function targetOf(board: BoardState, targetId: string): BoardTarget {
  const target = board.targets.find((t) => t.id === targetId);
  if (!target) throw new MatchError('There is no such system on this board.');
  return target;
}

/** Every guard a board action shares: the match is live, and it is your move. */
function requireBoardTurn(state: MatchState, userId: string, expected: MatchSide): BoardState {
  if (state.status !== 'active') throw new MatchError('This match is not in play.');
  const board = boardOf(state);
  const side = sideOf(state, userId);
  if (!side) throw new MatchError('You are not in this match.');
  if (side !== expected) {
    throw new MatchError(
      expected === 'red' ? 'Only Red fires at the board.' : 'Only Blue moves the defences.',
    );
  }
  if (side !== state.toMove) throw new MatchError('It is not your turn.');
  return board;
}

function requireJustification(text: string): string {
  const justification = text.trim();
  if (!justification) {
    throw new MatchError('Say why, in a line. The reasoning is half of what is scored.');
  }
  return justification;
}

/**
 * Who took the match, once the board is done.
 *
 * Derived, never stored: Red's win condition is literally "the crown is
 * compromised", so reading it off the board cannot drift from what the board
 * says. Null while the game is still live, which is also what a linear match
 * reports, because a linear match is scored rather than won.
 */
export function boardWinner(board: BoardState): MatchSide | null {
  if (board.phase !== 'done') return null;
  return board.targets.some((t) => t.crown && t.compromised) ? 'red' : 'blue';
}

/**
 * The board as ONE side may see it. The positional `toStudentView`.
 *
 * Detections and containments are public because both players witnessed them --
 * Red felt the shot land on a defence, and a wall going up is visible from both
 * sides. Everything else is asymmetric: Red knows its own quiet hits and nothing
 * about coverage; Blue knows its own coverage and only the hits it has actually
 * uncovered. `coverageBudget` is public on purpose, the way a fleet's size is in
 * Battleship: knowing two of six are defended is what makes probing a decision
 * rather than a coin toss.
 */
export function boardViewFor(board: BoardState, side: MatchSide): BoardViewForSide {
  const found = new Set(board.found);
  const covered = new Set(board.coverage);
  const targets: BoardTargetView[] = board.targets.map((t) => ({
    id: t.id,
    label: t.label,
    note: t.note,
    crown: t.crown,
    detectedHere: t.detectedHere,
    contained: t.contained,
    compromised: side === 'red' ? t.compromised : t.compromised && found.has(t.id),
    covered: side === 'blue' && covered.has(t.id),
  }));
  return {
    phase: board.phase,
    targets,
    coverageBudget: board.coverageBudget,
    movesLeft: side === 'blue' ? board.movesLeft : null,
    winner: boardWinner(board),
  };
}

/**
 * Blue lays its coverage and the game starts.
 *
 * Not recorded as a move, and deliberately: a move is a thing the opponent is
 * told happened, and the whole point of placement is that Red learns nothing
 * from it. The count must match the budget exactly -- placing fewer would be a
 * quiet self-handicap and placing more would be cheating.
 */
export function placeCoverage(state: MatchState, userId: string, targetIds: string[]): MatchState {
  if (state.status !== 'active') throw new MatchError('This match is not in play.');
  const board = boardOf(state);
  const side = sideOf(state, userId);
  if (!side) throw new MatchError('You are not in this match.');
  if (side !== 'blue') throw new MatchError('Only Blue places coverage.');
  if (board.phase !== 'placement') throw new MatchError('Coverage is already placed.');

  const unique = [...new Set(targetIds)];
  if (unique.length !== targetIds.length) {
    throw new MatchError('You cannot stack two defences on one system.');
  }
  if (unique.length !== board.coverageBudget) {
    throw new MatchError(`Cover exactly ${board.coverageBudget} systems.`);
  }
  unique.forEach((id) => targetOf(board, id));

  return {
    ...state,
    board: { ...board, coverage: unique, phase: 'play' },
    toMove: OPENING_SIDE,
  };
}

/** The shared tail of every board action: record the move and pass the clock. */
function commitBoardMove(
  state: MatchState,
  side: MatchSide,
  optionId: string,
  justification: string,
  now: number,
  resolution: MoveResolution,
  board: BoardState,
): MatchState {
  const known = new Set(state.findings.filter((f) => f.side === side).map((f) => f.id));
  const newFindings: MatchFinding[] = (resolution.reveals ?? [])
    .filter((r) => !known.has(r.id))
    .map((r) => ({ ...r, side, turn: state.turn }));

  const move: MatchMove = {
    seq: state.moves.length + 1,
    side,
    turn: state.turn,
    optionId,
    justification,
    score: resolution.score,
    signal: resolution.signal,
    at: now,
  };

  // A round is Red then Blue, the same as the linear mode, so the turn budget
  // means the same thing in both and the shared turn strip stays honest.
  const roundCloses = side === 'blue';
  const nextTurn = roundCloses ? state.turn + 1 : state.turn;
  const outOfTime = roundCloses && nextTurn > state.maxTurns;
  // The clock is Blue's ONLY win, and deliberately so. There is no "Red has run
  // out of targets" ending, because there cannot be one: reaching the crown ends
  // the match on the spot, so a compromised crown never sits around to be
  // contained, so the crown is always still there to be fired at. Blue does not
  // win by walling Red out; Blue wins by still holding the core at the end.
  const done = board.phase === 'done' || outOfTime;

  return {
    ...state,
    board: { ...board, phase: done ? 'done' : board.phase },
    moves: [...state.moves, move],
    findings: [...state.findings, ...newFindings],
    toMove: otherSide(side),
    turn: nextTurn,
    status: done ? 'complete' : state.status,
    lastMoveAt: now,
  };
}

export interface FireInput {
  userId: string;
  targetId: string;
  justification: string;
  /** Epoch ms, injected. */
  now: number;
}

/**
 * Red fires at one system.
 *
 * Only three things can happen: the shot lands on coverage and Red is seen (and
 * learns that system is defended, which is worth something); it lands on an open
 * system and Red owns it quietly, with Blue told only that a turn was taken; or
 * it lands on ground already taken or already walled and buys nothing. Reaching
 * the crown quietly ends the match on the spot -- there is nothing left to
 * defend once the objective is in hand.
 */
export function fire(state: MatchState, input: FireInput, resolve: ResolveBoardMove): MatchState {
  const board = requireBoardTurn(state, input.userId, 'red');
  if (board.phase !== 'play') throw new MatchError('Blue has not placed its defences yet.');
  const justification = requireJustification(input.justification);
  const target = targetOf(board, input.targetId);

  const defended = board.coverage.includes(target.id);
  const spent = target.compromised || target.contained;
  // A defence catches the shot whatever the ground beneath it: firing into a
  // covered system is how Red gets seen, even where there was nothing to take.
  const compromised = !defended && !spent;
  const won = compromised && target.crown;

  const targets = board.targets.map((t) =>
    t.id === target.id
      ? { ...t, detectedHere: t.detectedHere || defended, compromised: t.compromised || compromised }
      : t,
  );
  const next: BoardState = { ...board, targets, phase: won ? 'done' : board.phase };

  const resolution = resolve({
    state,
    side: 'red',
    outcome: { kind: 'fire', target, defended, spent, won },
    justification,
  });
  return commitBoardMove(state, 'red', `fire:${target.id}`, justification, input.now, resolution, next);
}

export interface BlueActionInput {
  userId: string;
  action: BlueBoardAction;
  /** The system acted on: investigated, contained, or moved coverage ONTO. */
  targetId: string;
  /** For a reposition only: the system coverage moves OFF. */
  fromId?: string;
  justification: string;
  /** Epoch ms, injected. */
  now: number;
}

/**
 * Blue answers: move a defence, look somewhere, or wall off what it found.
 *
 * The three are a genuine trilemma and that is the design. Repositioning is a
 * read of where Red goes next and is limited, so it cannot be spammed.
 * Investigating is the only way to learn about a quiet hit, and it costs the
 * turn whether or not anything is there. Containing is the only thing that takes
 * ground back, and it is available only where Blue has already looked -- you
 * cannot wall off a compromise you have not found.
 */
export function blueAct(
  state: MatchState,
  input: BlueActionInput,
  resolve: ResolveBoardMove,
): MatchState {
  const board = requireBoardTurn(state, input.userId, 'blue');
  if (board.phase !== 'play') throw new MatchError('Place your coverage first.');
  const justification = requireJustification(input.justification);
  const target = targetOf(board, input.targetId);

  let next: BoardState;
  let outcome: BoardOutcome;
  let optionId: string;

  switch (input.action) {
    case 'reposition': {
      if (board.movesLeft <= 0) throw new MatchError('You have no repositions left.');
      if (!input.fromId) throw new MatchError('Say which defence you are moving.');
      const from = targetOf(board, input.fromId);
      if (!board.coverage.includes(from.id)) {
        throw new MatchError('There is no coverage on that system to move.');
      }
      if (board.coverage.includes(target.id)) {
        throw new MatchError('That system is already covered.');
      }
      const movesLeft = board.movesLeft - 1;
      next = {
        ...board,
        coverage: [...board.coverage.filter((id) => id !== from.id), target.id],
        movesLeft,
      };
      outcome = { kind: 'reposition', from, to: target, movesLeft };
      optionId = `reposition:${from.id}->${target.id}`;
      break;
    }
    case 'investigate': {
      // Repeatable on purpose: a system that looked clean last round can have
      // been taken since, and finding that out is what the turn is for.
      const found = target.compromised;
      next = {
        ...board,
        found: found && !board.found.includes(target.id) ? [...board.found, target.id] : board.found,
      };
      outcome = { kind: 'investigate', target, found };
      optionId = `investigate:${target.id}`;
      break;
    }
    case 'contain': {
      if (!board.found.includes(target.id) || !target.compromised) {
        throw new MatchError('You have not found anything to contain there.');
      }
      next = {
        ...board,
        targets: board.targets.map((t) =>
          t.id === target.id ? { ...t, compromised: false, contained: true } : t,
        ),
        found: board.found.filter((id) => id !== target.id),
      };
      outcome = { kind: 'contain', target };
      optionId = `contain:${target.id}`;
      break;
    }
    default:
      throw new MatchError('That is not a move Blue can make.');
  }

  const resolution = resolve({ state, side: 'blue', outcome, justification });
  return commitBoardMove(state, 'blue', optionId, justification, input.now, resolution, next);
}
