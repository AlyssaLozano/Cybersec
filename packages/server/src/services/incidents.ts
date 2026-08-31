/**
 * Access to incident decision points.
 *
 * THE RULE THIS MODULE ENFORCES
 *
 * `DecisionOption.consequence` and `.quality` are the answer key. A student who
 * can read them before choosing is not making a decision: they are reading a
 * walkthrough. So the student-facing view goes through `pointForStudent()`,
 * which returns `StudentDecisionPoint`, a type with no field capable of
 * carrying either.
 *
 * Same shape as services/alerts.ts, deliberately. Three surfaces now share one
 * boundary pattern: a shipped type, a server-only answer type, and exactly one
 * named function that crosses between them.
 */

import type { DecisionOutcome, DecisionPoint, DecisionQuality, StudentDecisionPoint } from '@soc/shared';
import { outcomesFor, toStudentDecisionPoint } from '@soc/shared';

import { DECISION_POINTS, getDecisionPoint } from '../content/incident-0815.js';

/**
 * Fail loudly at startup if a decision point is malformed.
 *
 * A point with no sound option is unanswerable; a sequenced point with a
 * harmful option in it is ambiguous, because an ordering has no way to express
 * "and leave this one out". Both are content bugs that would fail every student.
 */
function validatePoints(): void {
  const seen = new Set<string>();
  for (const point of DECISION_POINTS) {
    if (seen.has(point.id)) {
      throw new Error(`Duplicate decision point id "${point.id}".`);
    }
    seen.add(point.id);

    if (point.options.length < 2) {
      throw new Error(`Decision point "${point.id}" offers fewer than two options.`);
    }
    if (!point.options.some((option) => option.quality === 'sound')) {
      throw new Error(`Decision point "${point.id}" has no sound option, so it cannot be answered.`);
    }
    for (const option of point.options) {
      if (!option.consequence) {
        throw new Error(`Option "${option.id}" at "${point.id}" has no consequence to show afterwards.`);
      }
    }
    if (point.ordered && point.options.some((option) => option.quality !== 'sound')) {
      throw new Error(
        `Sequenced decision point "${point.id}" contains a non-sound option. An ordering cannot ` +
          'express "leave this one out", so every step in a sequence must belong in it.',
      );
    }
  }
}
validatePoints();

/** The student-facing view. Carries no consequences and no qualities. */
export function pointForStudent(pointId: string): StudentDecisionPoint | null {
  const point = getDecisionPoint(pointId);
  return point ? toStudentDecisionPoint(point) : null;
}

/** Server-side only. */
export function pointWithAnswers(pointId: string): DecisionPoint | null {
  return getDecisionPoint(pointId);
}

/** Option ids of a given quality, so exercises derive answers rather than typing them. */
export function optionsWithQuality(pointId: string, quality: DecisionQuality): string[] {
  return (getDecisionPoint(pointId)?.options ?? [])
    .filter((option) => option.quality === quality)
    .map((option) => option.id);
}

/**
 * The intended order for a sequenced point.
 *
 * Authoring order IS the answer, which keeps the sequence in one place: if
 * somebody reorders the options in the content file to read better, the expected
 * answer moves with them rather than silently disagreeing.
 */
export function intendedOrdering(pointId: string): string[] {
  return (getDecisionPoint(pointId)?.options ?? []).map((option) => option.id);
}

/**
 * What every option would have done, released after the student commits.
 *
 * All options are returned, not just the chosen ones. The value of a decision
 * exercise is largely in reading what the other four would have cost.
 */
export function outcomesAfterCommit(pointId: string, chosenIds: string[]): DecisionOutcome[] {
  const point = getDecisionPoint(pointId);
  return point ? outcomesFor(point, chosenIds) : [];
}
