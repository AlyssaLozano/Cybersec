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
import { NOT_ON_THE_LIST, NOT_ON_THE_LIST_TRUTH } from './shadow-estate.js';
import { BUILT_IN, BUILT_IN_TRUTH } from './living-off-land.js';
import { NO_CHANGES_MADE, NO_CHANGES_MADE_TRUTH } from './agent-injection.js';
import { ATTRIBUTED, ATTRIBUTED_TRUTH } from './attribution.js';
import { THE_OTHER_ATTACHMENT, THE_OTHER_ATTACHMENT_TRUTH } from './other-attachment.js';
import { NINE_POINT_EIGHT, NINE_POINT_EIGHT_TRUTH } from './cvss.js';
import { ASK_IT_NICELY, ASK_IT_NICELY_TRUTH } from './assistant-disclosure.js';
import { THREE_THINGS_AT_ONCE, THREE_THINGS_AT_ONCE_TRUTH } from './layered.js';
import { THREE_SIGNATURES, THREE_SIGNATURES_TRUTH } from './collusion.js';
import { THE_RECRUITER, THE_RECRUITER_TRUTH } from './recruitment.js';
import { ON_LEAVE, ON_LEAVE_TRUTH } from './impersonation.js';
import { NOTHING_HAPPENED_AT_TWO, NOTHING_HAPPENED_AT_TWO_TRUTH } from './log-tampering.js';
import { THE_OPEN_DOOR, THE_OPEN_DOOR_TRUTH } from './insider-external.js';
import { THE_COFFEE_SHOP, THE_COFFEE_SHOP_TRUTH } from './negligence.js';
import { STILL_ON_THE_LIST, STILL_ON_THE_LIST_TRUTH } from './privilege-creep.js';
import { TWO_WEEKS_NOTICE, TWO_WEEKS_NOTICE_TRUTH } from './contractor-theft.js';
import { LAST_DAY, LAST_DAY_TRUTH } from './insider-sabotage.js';
import { THE_VOICE_ON_THE_PHONE, THE_VOICE_ON_THE_PHONE_TRUTH } from './voice-fraud.js';
import { PAY_US_OR_WE_PUBLISH, PAY_US_OR_WE_PUBLISH_TRUTH } from './extortion.js';
import { COLD_ROOM, COLD_ROOM_TRUTH } from './cold-room.js';
import { THE_PRINTER, THE_PRINTER_TRUTH } from './printer.js';
import { LEFT_THE_BUILDING, LEFT_THE_BUILDING_TRUTH } from './stolen-laptop.js';
import { THE_MODEL_SAYS_BENIGN, THE_MODEL_SAYS_BENIGN_TRUTH } from './model-evasion.js';
import { PROMPT_AND_CIRCUMSTANCE, PROMPT_AND_CIRCUMSTANCE_TRUTH } from './prompt-injection.js';
import { READ_ONLY, READ_ONLY_TRUTH } from './business-logic.js';
import { TUNED_TO_NOTHING, TUNED_TO_NOTHING_TRUTH } from './tuned-blind.js';
import { THE_APP_KNOWS, THE_APP_KNOWS_TRUTH } from './mobile-key.js';
import { EVERYONE_HAS_IT, EVERYONE_HAS_IT_TRUTH } from './mass-cve.js';
import { THE_BUILD_SAYS_SO, THE_BUILD_SAYS_SO_TRUTH } from './pipeline.js';
import { OUT_OF_THE_BOX, OUT_OF_THE_BOX_TRUTH } from './container-escape.js';
import { OPEN_SHELF, OPEN_SHELF_TRUTH } from './public-bucket.js';
import { HELPDESK_SAYS_YES, HELPDESK_SAYS_YES_TRUTH } from './helpdesk.js';
import { APPROVE_APPROVE_APPROVE, APPROVE_APPROVE_APPROVE_TRUTH } from './mfa-fatigue.js';
import { ALREADY_LOGGED_IN, ALREADY_LOGGED_IN_TRUTH } from './session-theft.js';
import { SHADOW_COPY, SHADOW_COPY_TRUTH } from './shadow-saas.js';
import { CONTRACTORS_LAPTOP, CONTRACTORS_LAPTOP_TRUTH } from './contractor-laptop.js';
import { SOMEBODY_ELSES_BREACH, SOMEBODY_ELSES_BREACH_TRUTH } from './vendor-breach.js';
import { CERTIFICATE_OF_TRUST, CERTIFICATE_OF_TRUST_TRUTH } from './cert-abuse.js';
import { GOLDEN_HOUR, GOLDEN_HOUR_TRUTH } from './golden-hour.js';
import { NOTHING_LEFT, NOTHING_LEFT_TRUTH } from './wiper.js';
import { FOUND_IN_THE_CAR_PARK, FOUND_IN_THE_CAR_PARK_TRUTH } from './rogue-device.js';
import { SELECT_STAR, SELECT_STAR_TRUTH } from './sql-injection.js';
import { OWN_KEYS, OWN_KEYS_TRUTH } from './rogue-admin.js';
import { INFUSION, INFUSION_TRUTH } from './medical-device.js';
import { CHANGE_OF_BANK, CHANGE_OF_BANK_TRUTH } from './bec.js';
import { CRY_WOLF, CRY_WOLF_TRUTH } from './alert-flood.js';
import { BELOW_THE_FLOOR, BELOW_THE_FLOOR_TRUTH } from './rootkit.js';
import { ALL_AT_ONCE, ALL_AT_ONCE_TRUTH } from './multi-vector.js';
import { BAD_TEACHER, BAD_TEACHER_TRUTH } from './model-poisoning.js';
import { WRONG_ADDRESS, WRONG_ADDRESS_TRUTH } from './false-flag.js';
import { SECOND_FLOOR, SECOND_FLOOR_TRUTH } from './nested-backdoors.js';
import { SIGNED_AND_TRUSTED, SIGNED_AND_TRUSTED_TRUTH } from './signed-update.js';
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

export const SCENARIOS: Scenario[] = [RIDGELINE, LOW_TIDE, LONG_NOTICE, THIRD_PARTY, CHEAP_RENT, SECOND_POST, LONG_WEATHER, QUIET_CHANNEL, KEY_RING, NO_PATCH, LAST_FRIDAY, NOTHING_INSTALLED, NOTHING_TO_RESTORE, SIGNED_AND_TRUSTED, SECOND_FLOOR, WRONG_ADDRESS, BAD_TEACHER, ALL_AT_ONCE, BELOW_THE_FLOOR, CRY_WOLF, CHANGE_OF_BANK, INFUSION, OWN_KEYS, SELECT_STAR, FOUND_IN_THE_CAR_PARK, NOTHING_LEFT, GOLDEN_HOUR, CERTIFICATE_OF_TRUST, SOMEBODY_ELSES_BREACH, CONTRACTORS_LAPTOP, SHADOW_COPY, ALREADY_LOGGED_IN, APPROVE_APPROVE_APPROVE, HELPDESK_SAYS_YES, OPEN_SHELF, OUT_OF_THE_BOX, THE_BUILD_SAYS_SO, EVERYONE_HAS_IT, THE_APP_KNOWS, TUNED_TO_NOTHING, READ_ONLY, PROMPT_AND_CIRCUMSTANCE, THE_MODEL_SAYS_BENIGN, LEFT_THE_BUILDING, THE_PRINTER, COLD_ROOM, PAY_US_OR_WE_PUBLISH, THE_VOICE_ON_THE_PHONE, LAST_DAY, TWO_WEEKS_NOTICE, STILL_ON_THE_LIST, THE_COFFEE_SHOP, THE_OPEN_DOOR, NOTHING_HAPPENED_AT_TWO, ON_LEAVE, THE_RECRUITER, THREE_SIGNATURES, THREE_THINGS_AT_ONCE, ASK_IT_NICELY, NINE_POINT_EIGHT, THE_OTHER_ATTACHMENT, ATTRIBUTED, NO_CHANGES_MADE, BUILT_IN, NOT_ON_THE_LIST];
export const SCENARIO_TRUTH: ScenarioTruth[] = [RIDGELINE_TRUTH, LOW_TIDE_TRUTH, LONG_NOTICE_TRUTH, THIRD_PARTY_TRUTH, CHEAP_RENT_TRUTH, SECOND_POST_TRUTH, LONG_WEATHER_TRUTH, QUIET_CHANNEL_TRUTH, KEY_RING_TRUTH, NO_PATCH_TRUTH, LAST_FRIDAY_TRUTH, NOTHING_INSTALLED_TRUTH, NOTHING_TO_RESTORE_TRUTH, SIGNED_AND_TRUSTED_TRUTH, SECOND_FLOOR_TRUTH, WRONG_ADDRESS_TRUTH, BAD_TEACHER_TRUTH, ALL_AT_ONCE_TRUTH, BELOW_THE_FLOOR_TRUTH, CRY_WOLF_TRUTH, CHANGE_OF_BANK_TRUTH, INFUSION_TRUTH, OWN_KEYS_TRUTH, SELECT_STAR_TRUTH, FOUND_IN_THE_CAR_PARK_TRUTH, NOTHING_LEFT_TRUTH, GOLDEN_HOUR_TRUTH, CERTIFICATE_OF_TRUST_TRUTH, SOMEBODY_ELSES_BREACH_TRUTH, CONTRACTORS_LAPTOP_TRUTH, SHADOW_COPY_TRUTH, ALREADY_LOGGED_IN_TRUTH, APPROVE_APPROVE_APPROVE_TRUTH, HELPDESK_SAYS_YES_TRUTH, OPEN_SHELF_TRUTH, OUT_OF_THE_BOX_TRUTH, THE_BUILD_SAYS_SO_TRUTH, EVERYONE_HAS_IT_TRUTH, THE_APP_KNOWS_TRUTH, TUNED_TO_NOTHING_TRUTH, READ_ONLY_TRUTH, PROMPT_AND_CIRCUMSTANCE_TRUTH, THE_MODEL_SAYS_BENIGN_TRUTH, LEFT_THE_BUILDING_TRUTH, THE_PRINTER_TRUTH, COLD_ROOM_TRUTH, PAY_US_OR_WE_PUBLISH_TRUTH, THE_VOICE_ON_THE_PHONE_TRUTH, LAST_DAY_TRUTH, TWO_WEEKS_NOTICE_TRUTH, STILL_ON_THE_LIST_TRUTH, THE_COFFEE_SHOP_TRUTH, THE_OPEN_DOOR_TRUTH, NOTHING_HAPPENED_AT_TWO_TRUTH, ON_LEAVE_TRUTH, THE_RECRUITER_TRUTH, THREE_SIGNATURES_TRUTH, THREE_THINGS_AT_ONCE_TRUTH, ASK_IT_NICELY_TRUTH, NINE_POINT_EIGHT_TRUTH, THE_OTHER_ATTACHMENT_TRUTH, ATTRIBUTED_TRUTH, NO_CHANGES_MADE_TRUTH, BUILT_IN_TRUTH, NOT_ON_THE_LIST_TRUTH];

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

      /*
       * At least one option has to work, and not all of them.
       *
       * Zero means a beginner picks from five candidates and every one is
       * graded wrong, which reads as the exercise being broken. All five means
       * the choice teaches nothing. Between those, any number is fine: several
       * commands genuinely reach the same finding, and grading a working
       * approach as a mistake teaches students to guess the author's syntax
       * preference rather than to investigate.
       *
       * Both failures are invisible at runtime, because the flag is stripped
       * before the options ship, and both are obvious here.
       */
      if (entry.commandOptions) {
        const right = entry.commandOptions.filter((o) => o.correct).length;
        if (right < 1) {
          throw new Error(
            `Scenario "${scenario.id}" event "${entry.eventId}" has no correct command option, so every choice a student makes is graded wrong.`,
          );
        }
        if (right === entry.commandOptions.length) {
          throw new Error(
            `Scenario "${scenario.id}" event "${entry.eventId}" marks every command option correct, so the choice teaches nothing.`,
          );
        }
        // Destroying evidence or alerting the attacker is never an acceptable
        // route to a finding, however well it works.
        for (const option of entry.commandOptions) {
          if (option.correct && option.harmful) {
            throw new Error(
              `Scenario "${scenario.id}" event "${entry.eventId}" marks a harmful option correct.`,
            );
          }
        }
        if (entry.commandOptions.some((o) => !o.teaches.trim())) {
          throw new Error(
            `Scenario "${scenario.id}" event "${entry.eventId}" has a command option with no lesson. A wrong answer that teaches nothing is the least useful thing a wrong answer can be.`,
          );
        }
      }

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
