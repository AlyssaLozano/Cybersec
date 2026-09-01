/**
 * The scenario catalogue.
 *
 * Scenarios and their truth are exported as two separate arrays on purpose. A
 * single object holding both would mean any code with a scenario in its hand
 * also has the answer key in its hand, and the one thing this model has to
 * guarantee is that a route cannot accidentally serialise a verdict.
 *
 * Adding a scenario means writing its module and appending it to both arrays.
 * The validator below refuses to boot if the two ever drift.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { RIDGELINE, RIDGELINE_TRUTH } from './ridgeline.js';

export const SCENARIOS: Scenario[] = [RIDGELINE];
export const SCENARIO_TRUTH: ScenarioTruth[] = [RIDGELINE_TRUTH];

function validateScenarios(): void {
  const truthById = new Map(SCENARIO_TRUTH.map((t) => [t.scenarioId, t]));

  for (const scenario of SCENARIOS) {
    const truth = truthById.get(scenario.id);
    if (!truth) {
      throw new Error(`Scenario "${scenario.id}" has no truth, so nothing it contains can be graded.`);
    }

    const eventIds = new Set(scenario.events.map((e) => e.id));
    if (eventIds.size !== scenario.events.length) {
      throw new Error(`Scenario "${scenario.id}" has duplicate event ids.`);
    }

    // An ungraded event is one a student can claim and never be scored on.
    for (const event of scenario.events) {
      if (!truth.events.some((t) => t.eventId === event.id)) {
        throw new Error(`Scenario "${scenario.id}" event "${event.id}" has no truth entry.`);
      }
    }
    // Truth for an event that does not exist is a key nobody can reach.
    for (const entry of truth.events) {
      if (!eventIds.has(entry.eventId)) {
        throw new Error(`Scenario "${scenario.id}" truth names event "${entry.eventId}", which is not on the board.`);
      }

      // An action id that does not exist could never be selected, so a check
      // against it would silently never fire. Same failure the catalogue
      // validator exists to prevent for exercises.
      const actionIds = new Set(scenario.actions.map((a) => a.id));
      for (const id of [...entry.correctActions, ...entry.outOfLaneActions]) {
        if (!actionIds.has(id)) {
          throw new Error(
            `Scenario "${scenario.id}" truth for "${entry.eventId}" names action "${id}", which the scenario does not offer.`,
          );
        }
      }
      // A first responder who is not seated cannot claim anything.
      if (!scenario.roles.includes(entry.firstResponder)) {
        throw new Error(
          `Scenario "${scenario.id}" makes "${entry.firstResponder}" first responder for "${entry.eventId}", but that seat is not in the scenario.`,
        );
      }
    }
  }
}

validateScenarios();

export function scenarioSummaries(): Array<Pick<Scenario, 'id' | 'title' | 'difficulty' | 'durationMinutes'>> {
  return SCENARIOS.map(({ id, title, difficulty, durationMinutes }) => ({
    id,
    title,
    difficulty,
    durationMinutes,
  }));
}
