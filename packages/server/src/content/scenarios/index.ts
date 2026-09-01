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
import { NOTHING_TO_RESTORE, NOTHING_TO_RESTORE_TRUTH } from './backup-deletion.js';
import { NOTHING_INSTALLED, NOTHING_INSTALLED_TRUTH } from './lotl.js';
import { LAST_FRIDAY, LAST_FRIDAY_TRUTH } from './ransomware.js';
import { NO_PATCH, NO_PATCH_TRUTH } from './zero-day.js';
import { KEY_RING, KEY_RING_TRUTH } from './cloud-creds.js';
import { QUIET_CHANNEL, QUIET_CHANNEL_TRUTH } from './dns-exfil.js';
import { LONG_WEATHER, LONG_WEATHER_TRUTH } from './apt.js';
import { SECOND_POST, SECOND_POST_TRUTH } from './phishing.js';
import { CHEAP_RENT, CHEAP_RENT_TRUTH } from './cryptominer.js';
import { THIRD_PARTY, THIRD_PARTY_TRUTH } from './supply-chain.js';
import { LONG_NOTICE, LONG_NOTICE_TRUTH } from './insider.js';
import { LOW_TIDE, LOW_TIDE_TRUTH } from './dictionary.js';

export const SCENARIOS: Scenario[] = [RIDGELINE, LOW_TIDE, LONG_NOTICE, THIRD_PARTY, CHEAP_RENT, SECOND_POST, LONG_WEATHER, QUIET_CHANNEL, KEY_RING, NO_PATCH, LAST_FRIDAY, NOTHING_INSTALLED, NOTHING_TO_RESTORE];
export const SCENARIO_TRUTH: ScenarioTruth[] = [RIDGELINE_TRUTH, LOW_TIDE_TRUTH, LONG_NOTICE_TRUTH, THIRD_PARTY_TRUTH, CHEAP_RENT_TRUTH, SECOND_POST_TRUTH, LONG_WEATHER_TRUTH, QUIET_CHANNEL_TRUTH, KEY_RING_TRUTH, NO_PATCH_TRUTH, LAST_FRIDAY_TRUTH, NOTHING_INSTALLED_TRUTH, NOTHING_TO_RESTORE_TRUTH];

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

    /*
     * Expert-difficulty coherence.
     *
     * Every rule here catches a flag that would silently do nothing. An author
     * reaches for `expertDetail` to manufacture a contradiction, forgets that a
     * degraded record only reaches a seat that does not own the home surface,
     * and ships an expert run identical to the advanced one. That failure is
     * invisible at runtime and obvious here.
     */
    const byEventId = new Map(scenario.events.map((e) => [e.id, e]));

    for (const event of scenario.events) {
      if (event.expertOnly && event.withheldAtExpert) {
        throw new Error(
          `Scenario "${scenario.id}" event "${event.id}" is both expert-only and withheld at expert, so it appears at no difficulty at all.`,
        );
      }
      // A degraded record is shown only to seats reached through `expertAlsoOn`.
      // Without one it is authored text nobody can ever be served.
      if (event.expertDetail && (event.expertAlsoOn ?? []).length === 0) {
        throw new Error(
          `Scenario "${scenario.id}" event "${event.id}" defines expertDetail but no expertAlsoOn, so the degraded view reaches nobody.`,
        );
      }
      if ((event.expertAlsoOn ?? []).includes(event.surface)) {
        throw new Error(
          `Scenario "${scenario.id}" event "${event.id}" lists its own surface in expertAlsoOn, which changes nothing.`,
        );
      }
    }

    for (const entry of truth.events) {
      const event = byEventId.get(entry.eventId)!;

      // Unsettled events are an expert instrument. Below expert a student is
      // still learning that dismissing is a decision, and an event where the
      // decision is unknowable reads as the exercise being broken.
      if (entry.verdict === 'ambiguous' && !event.expertOnly) {
        throw new Error(
          `Scenario "${scenario.id}" event "${entry.eventId}" is ambiguous but not expertOnly. Unsettled events are reserved for expert.`,
        );
      }
      // The debrief cannot teach "distrust the tidy story" without stating what
      // the story was, so planted misdirection has to say what it looked like.
      if (entry.verdict === 'ambiguous' && !entry.wouldSettleIt) {
        throw new Error(
          `Scenario "${scenario.id}" event "${entry.eventId}" is ambiguous but does not say what would have settled it, which is the whole lesson.`,
        );
      }
    }

    // An expert run that removed every malicious event leaves a floor with
    // nothing to find. The gap is meant to be part of the chain, not the chain.
    const maliciousIds = new Set(
      truth.events
        .filter((e) => e.verdict === 'malicious' || e.verdict === 'blocked-reconnaissance')
        .map((e) => e.eventId),
    );
    const maliciousAtExpert = scenario.events.filter(
      (e) => maliciousIds.has(e.id) && !e.withheldAtExpert,
    );
    if (maliciousIds.size > 0 && maliciousAtExpert.length === 0) {
      throw new Error(
        `Scenario "${scenario.id}" withholds every malicious event at expert, leaving nothing to find.`,
      );
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
