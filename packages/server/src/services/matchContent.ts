/**
 * The seam between the match engine and scenario content.
 *
 * The engine is deliberately content-blind: it knows how turns pass and what a
 * side may see, not what a move is worth or what it leaks. That knowledge is a
 * scenario's, and it arrives here. A red-vs-blue scenario registers a resolver
 * keyed by its id; the engine asks for one at the moment a move commits, and the
 * match layer asks for its turn budget when a match is opened.
 *
 * Until the first such scenario is authored, an unregistered scenario resolves
 * every move to no score and no leaked signal. That keeps the whole match
 * backend runnable and testable end to end before any content exists -- a move
 * is recorded and the turn passes, it simply is not yet graded.
 */

import type { ResolveMove } from './matchEngine.js';

interface RegisteredScenario {
  resolve: ResolveMove;
  /** How many rounds this scenario runs, if it fixes its own budget. */
  maxTurns?: number;
}

const registry = new Map<string, RegisteredScenario>();

/** Register how one scenario scores a move, what it leaks, and its turn budget. */
export function registerMatchScenario(
  scenarioId: string,
  resolve: ResolveMove,
  options: { maxTurns?: number } = {},
): void {
  registry.set(scenarioId, { resolve, maxTurns: options.maxTurns });
}

/** Test hook: forget registrations so a suite starts clean. */
export function clearMatchScenarios(): void {
  registry.clear();
}

/**
 * The placeholder for a scenario nobody has written scoring for yet.
 *
 * A zero-of-zero objective score is honest: it says "not graded" rather than
 * "graded zero", and it never leaks a signal, so the redaction boundary has
 * nothing to carry. Real content replaces this the moment it registers.
 */
const UNGRADED: ResolveMove = () => ({
  score: {
    objectivePoints: 0,
    maxObjective: 0,
    judgePoints: null,
    maxJudge: 0,
    note: 'Scoring for this scenario has not been authored yet.',
  },
  signal: null,
});

/** The resolver for a scenario, or the ungraded placeholder if none is registered. */
export function resolveMoveFor(scenarioId: string): ResolveMove {
  return registry.get(scenarioId)?.resolve ?? UNGRADED;
}

/** A scenario's own turn budget, or undefined to let the match default apply. */
export function maxTurnsFor(scenarioId: string): number | undefined {
  return registry.get(scenarioId)?.maxTurns;
}
