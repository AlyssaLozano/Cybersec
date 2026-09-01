/**
 * Which operations somebody has already run.
 *
 * WHY A TIER LETTER AND NOT A TICK
 *
 * A tick against a scenario says it has been done. That is the wrong fact.
 * Somebody who ran Ridgeline at beginner, with five candidate commands and a
 * coaching line, and somebody who ran it at expert, with the severity stripped
 * and a stage missing from the board, have not done the same thing, and a tick
 * against both claims they have.
 *
 * So the picker shows letters: B, I, A, E. Seeing "B I" against a scenario and
 * a blank where A should be is the whole prompt to run it again harder, and
 * that prompt is the point of the difficulty design.
 *
 * WHY NOTHING HERE BLOCKS A REPEAT
 *
 * Repeating is encouraged. The same incident at a harder tier is the intended
 * progression, and running it again from a different chair is genuinely
 * different practice: the Forensics view of Cheap Rent and the Cloud Security
 * view are different hours. What the history does is make sure nobody repeats
 * the same tier by accident, because a scenario whose answer you already
 * remember teaches nothing and still feels like work.
 */

import type {
  ScenarioAttempt,
  ScenarioDifficulty,
  ScenarioHistory,
  SocRoleId,
} from '@soc/shared';
import { SCENARIO_DIFFICULTIES, TIER_BADGE } from '@soc/shared';

/** Ascending, so "the next one up" is a lookup rather than a conditional. */
const TIER_ORDER: ScenarioDifficulty[] = [...SCENARIO_DIFFICULTIES];

export interface AttemptRecord {
  userId: string;
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  role: SocRoleId;
  completedAt: Date;
  score: number;
  caughtCritical: boolean;
}

/**
 * What counts as having run it.
 *
 * A session somebody dropped out of after four minutes is not an attempt, and
 * recording it would put a letter against a scenario they have not seen. The
 * bar is deliberately low but not zero: they have to have committed at least
 * one claim and been present when it closed.
 */
export const MIN_CLAIMS_FOR_ATTEMPT = 1;

export function qualifiesAsAttempt(input: {
  claimsCommitted: number;
  wasPresentAtClose: boolean;
}): boolean {
  return input.claimsCommitted >= MIN_CLAIMS_FOR_ATTEMPT && input.wasPresentAtClose;
}

/**
 * Build the history for one scenario from that user's attempts.
 *
 * Takes records rather than reading a database so it can be tested without one,
 * and so the caller decides how far back to look.
 */
export function historyFor(scenarioId: string, records: AttemptRecord[]): ScenarioHistory {
  const mine = records
    .filter((r) => r.scenarioId === scenarioId)
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

  const attempts: ScenarioAttempt[] = mine.map((r) => ({
    scenarioId: r.scenarioId,
    difficulty: r.difficulty,
    role: r.role,
    completedAt: r.completedAt.toISOString(),
    score: r.score,
    caughtCritical: r.caughtCritical,
  }));

  const bestByTier: Partial<Record<ScenarioDifficulty, number>> = {};
  for (const a of attempts) {
    const held = bestByTier[a.difficulty];
    if (held === undefined || a.score > held) bestByTier[a.difficulty] = a.score;
  }

  // Badges in tier order rather than the order they happened, so the gap in a
  // sequence is visible at a glance. Somebody who ran expert before advanced
  // should still see the advanced slot empty.
  const badges = TIER_ORDER.filter((t) => bestByTier[t] !== undefined).map((t) => TIER_BADGE[t]);

  const cleared = new Set(attempts.map((a) => a.difficulty));
  const suggestedNext = TIER_ORDER.find((t) => !cleared.has(t)) ?? null;

  return {
    scenarioId,
    badges,
    attempts,
    bestByTier,
    // Advisory only. Set when the tier the picker would default to has been run
    // before, so the UI can say so without preventing anything.
    repeatOf: null,
    suggestedNext,
  };
}

/**
 * The same, with a tier in mind.
 *
 * `repeatOf` is filled when the tier about to be launched has already been run.
 * It is a label, never a block: somebody who wants a fourth run at beginner
 * because they are teaching a colleague should get one.
 */
export function historyForTier(
  scenarioId: string,
  records: AttemptRecord[],
  intendedTier: ScenarioDifficulty,
): ScenarioHistory {
  const history = historyFor(scenarioId, records);
  return {
    ...history,
    repeatOf: history.bestByTier[intendedTier] !== undefined ? intendedTier : null,
  };
}

/** Every scenario the user has touched, for the picker. */
export function historyIndex(
  scenarioIds: string[],
  records: AttemptRecord[],
): Record<string, ScenarioHistory> {
  const index: Record<string, ScenarioHistory> = {};
  for (const id of scenarioIds) index[id] = historyFor(id, records);
  return index;
}

/**
 * One line for the picker, next to the scenario title.
 *
 * Written to be read at a glance in a list of twenty-five, so it says the tiers
 * cleared and nothing else. Score belongs on the scenario page, not in a list:
 * a number beside every row turns a catalogue into a leaderboard, and the point
 * of running one again is to run it harder rather than to beat a score.
 */
export function pickerLabel(history: ScenarioHistory): string | null {
  if (history.badges.length === 0) return null;
  return `Completed ${history.badges.join(' ')}`;
}
