/**
 * Shared machinery for the menu (linear) scenarios.
 *
 * WHY THIS IS SMALLER THAN THE BOARD KIT
 *
 * A board scenario is data: the mechanics are the engine's, so the scoring
 * argument can be shared wholesale. A menu scenario is the opposite. Its whole
 * substance is the RESOLVER: which move gates which other move, what a move
 * leaks, and what Blue should have done about it. Two menu scenarios that shared
 * a resolver would be the same scenario with different nouns.
 *
 * So this file deliberately holds only the parts that must not drift: the
 * justification rubric, so a sentence is worth the same everywhere, and the
 * scoring envelope, so every move is out of ten on both halves. The judgement
 * stays in the scenario, where it belongs.
 *
 * The first five scenarios (the Northwind campaign) predate this file and each
 * carry their own copy. They are tested and shipped, so they were left alone;
 * new scenarios use this.
 */

import type { MatchMove, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import type { MoveResolution } from '../../services/matchEngine.js';

/** Both halves of a move are out of ten, so reasoning is worth as much as result. */
export const MAX_OBJECTIVE = 10;
export const MAX_JUDGE = 10;

/**
 * Score the written rationale. A DETERMINISTIC RUBRIC, NOT AN LLM.
 *
 * The platform is offline by design, so there is no model here to read a
 * sentence and judge it. What this can do honestly is reward the two things a
 * good rationale has: it is developed rather than a shrug, and it names the
 * consideration the move is actually about. It is gameable by stuffing the right
 * words, and it is a teaching nudge rather than a verdict. If a real judge is
 * ever wired up, it drops in exactly here.
 */
const SHARED_TERMS = [
  'quiet', 'loud', 'noise', 'trace', 'detect', 'seen', 'stealth', 'footprint',
  'signal', 'alert', 'log', 'queue', 'probe', 'baseline', 'block', 'contain',
  'investigate', 'evidence', 'overreact', 'fatigue', 'before', 'first', 'order',
  'because', 'risk', 'cost', 'they', 'likely', 'escalate', 'priority',
];

export function judgeJustification(text: string, extra: string[] = []): number {
  const t = text.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);
  let pts = 0;
  if (words.length >= 6) pts += 4;
  else if (words.length >= 3) pts += 2;
  const hits = [...SHARED_TERMS, ...extra].filter((term) => t.includes(term)).length;
  pts += Math.min(6, hits * 2);
  return Math.min(MAX_JUDGE, pts);
}

export interface ScoreInput {
  points: number;
  note: string;
  justification: string;
  /** Estate vocabulary the rubric should also recognise for this scenario. */
  terms?: string[];
  /** What leaked to the opponent. Omit for a silent move. */
  signal?: MatchSignal | null;
  reveals?: RevealedFinding[];
  hostLog?: string[];
}

/** The scoring envelope every move in every menu scenario shares. */
export function scored(input: ScoreInput): MoveResolution {
  return {
    score: {
      objectivePoints: input.points,
      maxObjective: MAX_OBJECTIVE,
      judgePoints: judgeJustification(input.justification, input.terms),
      maxJudge: MAX_JUDGE,
      note: input.note,
    },
    signal: input.signal ?? null,
    reveals: input.reveals,
    hostLog: input.hostLog,
  };
}

/** Every move Red has already committed. Used for chain gating. */
export function redMoves(state: MatchState): MatchMove[] {
  return state.moves.filter((m) => m.side === 'red');
}

/** Whether Red has already played a given move. The basis of a prerequisite. */
export function redHasPlayed(state: MatchState, optionId: string): boolean {
  return redMoves(state).some((m) => m.optionId === optionId);
}

/** Whether Red has played any of these. For "one of the following" prerequisites. */
export function redHasAnyOf(state: MatchState, optionIds: string[]): boolean {
  const played = new Set(redMoves(state).map((m) => m.optionId));
  return optionIds.some((id) => played.has(id));
}

/** Red's most recent move, which is what Blue is actually reacting to. */
export function lastRedMove(state: MatchState): string | null {
  const reds = redMoves(state);
  return reds.length ? reds[reds.length - 1]!.optionId : null;
}
