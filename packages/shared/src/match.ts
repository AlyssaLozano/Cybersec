/**
 * A one-on-one adversarial match: one student attacks, one defends, turn for
 * turn, on a board neither of them owns.
 *
 * WHY THIS IS SEPARATE FROM `rooms.ts` AND `live.ts`
 *
 * The floor in `rooms.ts` is cooperative: several analysts sit different SOC
 * seats and work one incident *together*, and `live.ts` streams that in real
 * time. A match is the opposite shape. Two people, opposed, and deliberately
 * NOT synchronous -- a move is taken, the opponent is notified, and they answer
 * when they are next at a keyboard. That is what lets a lone career changer play
 * a real human at all: nobody has to be online at the same minute.
 *
 * WHAT THE ENGINE KNOWS AND WHAT IT DOES NOT
 *
 * The engine owns turns, seating, join codes and the redaction boundary. It does
 * NOT know how a move is scored or what signal it leaves -- that is scenario
 * content, injected at the point of a move (`ResolveMove`). Keeping content out
 * of the engine is what lets the turn machinery be built and tested before a
 * single red-vs-blue scenario exists.
 *
 * THE REDACTION BOUNDARY IS THE WHOLE POINT
 *
 * Red must never see Blue's board and Blue must never see Red's reasoning; each
 * side sees only what *leaked* to it. `matchViewFor` is the one place that
 * decides what a connection may receive -- the adversarial equivalent of
 * `toStudentView`. A move carries its full truth on the server and only a
 * `MatchSignal` crosses to the other side.
 */

import type { FloorIdentity, RoomVisibility } from './rooms.js';
import type { ScenarioDifficulty } from './scenarios.js';

/** The two chairs. Unlike a SOC seat, these are opposed. */
export const MATCH_SIDES = ['red', 'blue'] as const;
export type MatchSide = (typeof MATCH_SIDES)[number];

export function otherSide(side: MatchSide): MatchSide {
  return side === 'red' ? 'blue' : 'red';
}

/**
 * Where a match is in its life.
 *
 * waiting    seated on one side, holding for an opponent (a join code or the
 *            open queue). The only state a second player can enter through.
 * active     both seats filled; turns are being taken.
 * complete   the scenario's turn budget is spent, or an objective decided it.
 * abandoned  a player forfeited, or it was cancelled before it ran. Terminal,
 *            and deliberately distinct from `complete` so a walked-away match
 *            never counts as a played one.
 */
export const MATCH_STATUSES = ['waiting', 'active', 'complete', 'abandoned'] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

/**
 * What the OTHER side is allowed to perceive of a move.
 *
 * This is the only thing that crosses the boundary. A red enumeration either
 * trips something in Blue's queue or it does not; Blue never sees the command,
 * only the alert it raised. Symmetrically, a blue control either becomes visible
 * to Red or stays silent. Everything else about the move -- the reasoning, the
 * score, the exact option -- stays with the mover.
 */
export interface MatchSignal {
  /** True when the move surfaced to the opponent at all. */
  detected: boolean;
  /** The one line the opponent sees, e.g. "IDS: network enumeration". */
  label: string;
  /** Optional second line; still nothing that reveals the mover's intent. */
  detail: string | null;
}

/**
 * The score a move earned, held privately for the mover.
 *
 * Two parts, mirroring the platform's hybrid grading: an objective component the
 * server computes deterministically, and a judge component the copilot fills in
 * asynchronously (null until it has). A move is playable and the turn passes
 * before the judge has run -- the async turn model cannot block on it.
 */
export interface MatchMoveScore {
  objectivePoints: number;
  maxObjective: number;
  /** Null until the copilot judge has scored the justification. */
  judgePoints: number | null;
  maxJudge: number;
  note: string | null;
}

/** One committed move by one side. Held in full only on the server. */
export interface MatchMove {
  /** 1-based order across the whole match, both sides interleaved. */
  seq: number;
  side: MatchSide;
  /** Round number the move belongs to. */
  turn: number;
  /** The chosen action. Meaning is scenario content's; the engine treats it as opaque. */
  optionId: string;
  /** The mover's one-line rationale. Never crosses to the opponent. */
  justification: string;
  /** Filled server-side when the move commits. */
  score: MatchMoveScore | null;
  /** What leaked to the opponent. Null means the move was silent. */
  signal: MatchSignal | null;
  /** Epoch ms. Passed in, never read from a clock the engine owns. */
  at: number;
}

/**
 * Something a player has DISCOVERED, so a move follows from evidence rather than
 * a blind pick from a menu.
 *
 * For Red it is the attack surface their recon has surfaced: a service, or a
 * vulnerability worth a vector. For Blue it is the evidence behind a signal --
 * the log line an investigation pulled up, which is what a severity call should
 * rest on. Each finding is tagged with the side that may see it, and
 * `matchViewFor` only ever hands a side its own: Red never sees Blue's evidence,
 * and Blue never sees Red's map.
 */
export const MATCH_FINDING_KINDS = ['service', 'vuln', 'evidence'] as const;
export type MatchFindingKind = (typeof MATCH_FINDING_KINDS)[number];

export const MATCH_FINDING_SEVERITIES = ['info', 'low', 'medium', 'high'] as const;
export type MatchFindingSeverity = (typeof MATCH_FINDING_SEVERITIES)[number];

export interface MatchFinding {
  /** Stable within a match: revealing the same thing twice does not duplicate it. */
  id: string;
  /** Which side may see it (the side that discovered it). */
  side: MatchSide;
  /** The round it was discovered on. */
  turn: number;
  kind: MatchFindingKind;
  title: string;
  detail: string;
  /** Set for a vuln or a graded piece of evidence; null for plain intel. */
  severity: MatchFindingSeverity | null;
}

/** What a move reveals, before the engine stamps the side and turn onto it. */
export type RevealedFinding = Omit<MatchFinding, 'side' | 'turn'>;

/** A chair and who, if anyone, is in it. */
export interface MatchPlayer {
  side: MatchSide;
  userId: string | null;
  /** How they appear to the opponent. Never their real name -- see `rooms.ts`. */
  identity: FloorIdentity | null;
}

/**
 * The authoritative match, as the server holds it.
 *
 * NEVER sent whole to a client: it contains both sides' full move history. A
 * connection receives `matchViewFor(state, userId)` instead.
 */
export interface MatchState {
  id: string;
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  status: MatchStatus;
  visibility: RoomVisibility;
  /** Set for closed matches (invite by code), null for open (queue) ones. */
  joinCode: string | null;
  hostUserId: string;
  red: MatchPlayer;
  blue: MatchPlayer;
  /** Whose move it is while `active`. Red always opens. */
  toMove: MatchSide;
  /** Round number, 1-based. Increments when a round (red then blue) closes. */
  turn: number;
  /** How many rounds the scenario runs before it completes. */
  maxTurns: number;
  moves: MatchMove[];
  /** Everything discovered so far, each tagged with the side that may see it. */
  findings: MatchFinding[];
  /**
   * Log lines Red's loud moves have written to the host, for Blue to find in a
   * real terminal at the higher tiers. Append-only; the defender reads them.
   */
  hostLog: string[];
  /** Each side's terminal working directory, so the shell survives page reloads. */
  terminalCwd: Record<MatchSide, string>;
  /** Epoch ms. */
  createdAt: number;
  /** Epoch ms of the last committed move, or null before the first. */
  lastMoveAt: number | null;
}

/**
 * A terminal a side works through at the higher tiers.
 *
 * `defender` is a real shell on the seeded host: Blue reads the logs Red left.
 * `attacker` is a recon console: Red runs scanning tools against the remote
 * target, and each recognised command is a scored move. Different surfaces,
 * different endpoints, one `kind` to tell the client which to render.
 */
export const MATCH_TERMINAL_KINDS = ['defender', 'attacker'] as const;
export type MatchTerminalKind = (typeof MATCH_TERMINAL_KINDS)[number];

export interface MatchTerminalView {
  kind: MatchTerminalKind;
  /** Where the defender prompt sits. Unused by the attacker console. */
  cwd: string;
}

/** What you are allowed to see of an opponent's move: only what leaked. */
export interface OpponentMoveView {
  seq: number;
  turn: number;
  side: MatchSide;
  signal: MatchSignal | null;
  at: number;
}

/**
 * The redacted match, as ONE side is allowed to receive it.
 *
 * Your own moves in full (they are yours); the opponent's only as the signals
 * they leaked to you. This is the boundary `matchViewFor` enforces.
 */
export interface MatchView {
  id: string;
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  status: MatchStatus;
  /** Which side the viewer holds. */
  you: MatchSide;
  /** The viewer's own identity, so the board can label their own chair. */
  youIdentity: FloorIdentity | null;
  opponent: {
    identity: FloorIdentity | null;
    /** True once the opponent seat is filled. */
    present: boolean;
  };
  toMove: MatchSide;
  yourTurn: boolean;
  turn: number;
  maxTurns: number;
  /** Your moves, with your private scores. */
  yourMoves: MatchMove[];
  /** The opponent's moves, reduced to what you may see. */
  opponentActivity: OpponentMoveView[];
  /** What your side has discovered: your attack surface, or your evidence. */
  yourFindings: MatchFinding[];
  /**
   * A real investigation shell, present for the defender at the higher tiers
   * (advanced and expert). Null when the tier or seat does not grant one, in
   * which case the side works from the findings panel instead.
   */
  terminal: MatchTerminalView | null;
  /**
   * The join code, surfaced ONLY to the host of a still-waiting closed match so
   * they can pass it on. Null in every other case.
   */
  joinCode: string | null;
}
