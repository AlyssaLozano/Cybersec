/**
 * Scoring for the Career Fit Analyzer.
 *
 * THE CONFIDENCE PENALTY
 *
 * The specification asks that "someone who says they like detail but has a low
 * detail score on other questions gets a confidence penalty". That is what the
 * redundant items are for, and it works like this:
 *
 *   1. Every item indicates a TRAIT as well as scoring lanes. Traits have three
 *      or more indicators each, spread across different dimensions, and some are
 *      reverse-coded so autopilot answering shows up as disagreement.
 *   2. For each trait we compute a mean and a consistency figure derived from
 *      how far the indicators sit from that mean.
 *   3. A lane's confidence is the weighted consistency of the traits that drove
 *      its score. A lane resting on a trait somebody answered three different
 *      ways is reported with low confidence rather than asserted.
 *
 * Confidence never changes the ranking. It changes what we claim about it. That
 * distinction matters: quietly demoting a lane because somebody was inconsistent
 * would hide the inconsistency rather than surfacing it.
 *
 * BURNOUT RISK
 *
 * Each lane carries a baseline risk. It is then adjusted for the person: low
 * pressure tolerance raises risk in reactive lanes, low people-orientation
 * raises it in lanes that are mostly persuasion, and a high need for structure
 * raises it in ambiguous ones.
 */

import type {
  AssessmentItem,
  EnvironmentFactor,
  EnvironmentId,
  EnvironmentScore,
  ItemResponse,
  LaneId,
  LaneScore,
  TraitId,
  TraitScore,
} from '@soc/shared';
import { ENVIRONMENT_FACTORS, LANES, TRAITS, TRAIT_LABELS } from '@soc/shared';

import { getLaneProfile } from '../lanes.js';
import { ITEM_BY_ID, ITEMS } from './items.js';

/** Likert responses arrive 1..5 and are centred to -2..+2. */
function centre(value: number): number {
  return Math.max(-2, Math.min(2, value - 3));
}

/** A trait needs this many indicators before inconsistency means anything. */
const MIN_INDICATORS_FOR_CONSISTENCY = 3;

interface Accumulator {
  lanes: Record<string, number>;
  factors: Record<string, number>;
  /** How many items bore on each factor, so factors can be averaged not summed. */
  factorCounts: Record<string, number>;
  traitReadings: Map<TraitId, number[]>;
  /** Lane -> traits that contributed to it, for the confidence calculation. */
  laneTraits: Map<string, Map<TraitId, number>>;
  /** Human-readable drivers per lane, strongest first. */
  laneReasons: Map<string, Array<{ text: string; weight: number }>>;
  answered: number;
}

function emptyAccumulator(): Accumulator {
  const lanes: Record<string, number> = {};
  for (const lane of LANES) lanes[lane] = 0;
  const factors: Record<string, number> = {};
  const factorCounts: Record<string, number> = {};
  for (const factor of ENVIRONMENT_FACTORS) {
    factors[factor] = 0;
    factorCounts[factor] = 0;
  }

  return {
    lanes,
    factors,
    factorCounts,
    traitReadings: new Map(),
    laneTraits: new Map(),
    laneReasons: new Map(),
    answered: 0,
  };
}

function recordTrait(acc: Accumulator, trait: TraitId, reading: number): void {
  const existing = acc.traitReadings.get(trait);
  if (existing) existing.push(reading);
  else acc.traitReadings.set(trait, [reading]);
}

function recordLaneTrait(acc: Accumulator, laneId: string, trait: TraitId, magnitude: number): void {
  let byTrait = acc.laneTraits.get(laneId);
  if (!byTrait) {
    byTrait = new Map();
    acc.laneTraits.set(laneId, byTrait);
  }
  byTrait.set(trait, (byTrait.get(trait) ?? 0) + magnitude);
}

function recordReason(acc: Accumulator, laneId: string, text: string, weight: number): void {
  const existing = acc.laneReasons.get(laneId);
  if (existing) existing.push({ text, weight });
  else acc.laneReasons.set(laneId, [{ text, weight }]);
}

/** Apply one response to the accumulator. */
function applyResponse(acc: Accumulator, item: AssessmentItem, response: ItemResponse): void {
  if (item.kind === 'likert') {
    if (typeof response.value !== 'number') return;
    const centred = centre(response.value);
    acc.answered += 1;

    // A reverse-coded item means agreement indicates a LOW trait value.
    recordTrait(acc, item.trait, item.reverse ? -centred : centred);

    // Neutral answers move nothing, which is the correct behaviour for a
    // midpoint response rather than something to be interpreted.
    if (centred === 0) return;

    for (const [laneId, weight] of Object.entries(item.lanes)) {
      if (!(laneId in acc.lanes)) continue;
      const contribution = centred * (weight ?? 0);
      acc.lanes[laneId] = (acc.lanes[laneId] ?? 0) + contribution;
      recordLaneTrait(acc, laneId, item.trait, Math.abs(contribution));

      if (contribution >= 4) {
        recordReason(acc, laneId, `You agreed: "${item.statement}"`, contribution);
      } else if (contribution <= -4) {
        recordReason(acc, laneId, `You disagreed: "${item.statement}"`, contribution);
      }
    }

    for (const [factor, weight] of Object.entries(item.factors ?? {})) {
      acc.factors[factor] = (acc.factors[factor] ?? 0) + centred * (weight ?? 0);
      acc.factorCounts[factor] = (acc.factorCounts[factor] ?? 0) + 1;
    }
    return;
  }

  // Forced choice.
  const option = item.options.find((candidate) => candidate.id === response.optionId);
  if (!option) return;
  acc.answered += 1;

  if (option.traitValue) recordTrait(acc, option.traitValue.trait, option.traitValue.value);

  for (const [laneId, weight] of Object.entries(option.lanes ?? {})) {
    if (!(laneId in acc.lanes)) continue;
    const contribution = weight ?? 0;
    acc.lanes[laneId] = (acc.lanes[laneId] ?? 0) + contribution;
    if (option.traitValue) recordLaneTrait(acc, laneId, option.traitValue.trait, Math.abs(contribution));
    if (contribution >= 3) recordReason(acc, laneId, `You chose: "${option.label}"`, contribution);
    if (contribution <= -3) recordReason(acc, laneId, `You ruled out: "${option.label}"`, contribution);
  }

  for (const [factor, weight] of Object.entries(option.factors ?? {})) {
    acc.factors[factor] = (acc.factors[factor] ?? 0) + (weight ?? 0);
    acc.factorCounts[factor] = (acc.factorCounts[factor] ?? 0) + 1;
  }
}

/**
 * Trait scores with a consistency figure.
 *
 * Consistency is 1 minus the mean absolute deviation scaled against the widest
 * possible spread. Indicators that all agree give 1; indicators split between
 * the extremes give something near 0.
 */
export function scoreTraits(responses: ItemResponse[]): TraitScore[] {
  const acc = emptyAccumulator();
  for (const response of responses) {
    const item = ITEM_BY_ID.get(response.itemId);
    if (item) applyResponse(acc, item, response);
  }
  return traitScoresFrom(acc);
}

function traitScoresFrom(acc: Accumulator): TraitScore[] {
  const scores: TraitScore[] = [];

  for (const trait of TRAITS) {
    const readings = acc.traitReadings.get(trait) ?? [];
    if (readings.length === 0) continue;

    const mean = readings.reduce((sum, value) => sum + value, 0) / readings.length;

    let consistency = 1;
    if (readings.length >= MIN_INDICATORS_FOR_CONSISTENCY) {
      const deviation = readings.reduce((sum, value) => sum + Math.abs(value - mean), 0) / readings.length;
      // 2.0 is the largest mean deviation achievable on a -2..+2 scale.
      consistency = Math.max(0, Math.min(1, 1 - deviation / 2));
    }

    scores.push({
      trait,
      value: Number(mean.toFixed(2)),
      indicators: readings.length,
      consistency: Number(consistency.toFixed(2)),
    });
  }

  return scores.sort((a, b) => b.indicators - a.indicators || a.trait.localeCompare(b.trait));
}

/** Adjust a lane's baseline burnout risk for this particular person. */
function burnoutFor(laneId: LaneId, traits: Map<TraitId, number>): 'low' | 'medium' | 'high' {
  const profile = getLaneProfile(laneId);
  const levels = ['low', 'medium', 'high'] as const;
  let index = levels.indexOf(profile?.baselineBurnout ?? 'medium');

  const pressure = traits.get('pressure_tolerance') ?? 0;
  const people = traits.get('people_orientation') ?? 0;
  const structure = traits.get('structure_need') ?? 0;
  const interrupt = traits.get('interrupt_tolerance') ?? 0;
  const stability = traits.get('stability_need') ?? 0;

  const reactive: LaneId[] = ['soc-ops', 'incident-response'];
  const persuasion: LaneId[] = ['risk-compliance', 'vuln-management', 'security-architecture'];
  const ambiguous: LaneId[] = ['security-architecture', 'threat-intel', 'red-team', 'detection-engineering'];
  const unstable: LaneId[] = ['incident-response', 'pentest', 'red-team'];

  // Low tolerance for the thing a lane demands most raises risk.
  if (reactive.includes(laneId) && pressure < -0.5) index += 1;
  if (reactive.includes(laneId) && interrupt < -0.5) index += 1;
  if (persuasion.includes(laneId) && people < -0.5) index += 1;
  if (ambiguous.includes(laneId) && structure > 0.8) index += 1;
  if (unstable.includes(laneId) && stability > 1) index += 1;

  // Genuine strengths pull it back down.
  if (reactive.includes(laneId) && pressure > 1 && interrupt > 0.5) index -= 1;
  if (persuasion.includes(laneId) && people > 1) index -= 1;

  return levels[Math.max(0, Math.min(levels.length - 1, index))]!;
}

/** Concerns worth raising about a lane, given this person's traits. */
function concernsFor(laneId: LaneId, traits: Map<TraitId, number>): string[] {
  const concerns: string[] = [];
  const get = (trait: TraitId) => traits.get(trait) ?? 0;

  if ((laneId === 'soc-ops' || laneId === 'incident-response') && get('pressure_tolerance') < -0.5) {
    concerns.push('You said pressure gets to you, and this lane has a lot of it.');
  }
  if (laneId === 'soc-ops' && get('interrupt_tolerance') < -0.5) {
    concerns.push('You prefer sustained focus, and this work is interruption on purpose.');
  }
  if (laneId === 'soc-ops' && get('depth_preference') > 1) {
    concerns.push('You want depth. Tier 1 work is deliberately shallow and wide.');
  }
  if ((laneId === 'incident-response' || laneId === 'pentest' || laneId === 'red-team') && get('stability_need') > 1) {
    concerns.push('You value predictable hours, and this lane is unpredictable by nature.');
  }
  if ((laneId === 'risk-compliance' || laneId === 'vuln-management') && get('people_orientation') < -0.5) {
    concerns.push('Much of this job is persuading people who do not report to you, and you said that drains you.');
  }
  if (
    (laneId === 'security-architecture' ||
      laneId === 'threat-intel' ||
      laneId === 'detection-engineering') &&
    get('structure_need') > 1
  ) {
    concerns.push('You want clear right answers. This lane rarely offers them.');
  }
  if (
    (laneId === 'appsec' ||
      laneId === 'security-engineering' ||
      laneId === 'cloud-security' ||
      laneId === 'detection-engineering') &&
    get('building_drive') < -0.5
  ) {
    concerns.push('This lane involves writing code and configuration, which you did not seem drawn to.');
  }
  if (laneId === 'detection-engineering' && get('detail_orientation') < 0) {
    concerns.push(
      'A detection rule that is slightly wrong does not fail quietly: it makes hundreds of alerts somebody else has to close, and detail was not a strength in your answers.',
    );
  }
  if (laneId === 'detection-engineering' && get('depth_preference') < -0.5) {
    concerns.push('This is slow, iterative work on a small number of rules, and you said you prefer breadth and turnover.');
  }
  if (laneId === 'forensics' && get('detail_orientation') < 0) {
    concerns.push('Forensic work is unforgiving about small procedural mistakes, and detail was not a strength in your answers.');
  }
  if (laneId === 'risk-compliance' && get('research_orientation') < -0.5) {
    concerns.push('This role is largely reading and writing, which you said you would rather avoid.');
  }
  return concerns;
}

/** How well each environment matches the person's four factor needs. */
const ENVIRONMENT_PROFILES: Record<EnvironmentId, Record<EnvironmentFactor, number>> = {
  // Values are the environment's character on each factor, -2..+2.
  government: { stability: 2, pace: -2, rules: 2, autonomy: -1 },
  corporate: { stability: 0, pace: 1, rules: 0, autonomy: 0 },
  consulting: { stability: -2, pace: 2, rules: -2, autonomy: 2 },
};

const FACTOR_PHRASES: Record<EnvironmentFactor, { high: string; low: string }> = {
  stability: {
    high: 'you want predictability and job security',
    low: 'you are comfortable with change and uncertainty',
  },
  pace: { high: 'you want things to move quickly', low: 'you prefer a considered pace' },
  rules: {
    high: 'you are comfortable working inside documented process',
    low: 'you get impatient with process',
  },
  autonomy: { high: 'you want freedom in how you work', low: 'you would rather have clear direction' },
};

export function scoreEnvironments(responses: ItemResponse[]): EnvironmentScore[] {
  const acc = emptyAccumulator();
  for (const response of responses) {
    const item = ITEM_BY_ID.get(response.itemId);
    if (item) applyResponse(acc, item, response);
  }
  return environmentScoresFrom(acc);
}

function environmentScoresFrom(acc: Accumulator): EnvironmentScore[] {
  /*
   * Normalise each factor by how many items actually bore on it, rather than by
   * a fixed divisor.
   *
   * This matters more than it looks. Dividing by a constant shrinks a genuine
   * signal from one or two strong answers toward zero, and a person sitting near
   * zero on every factor is closest to whichever environment sits in the middle
   *, which is always corporate. That produced a quiet bias where anybody who
   * answered only a few questions was told they suit corporate work, regardless
   * of what they said. Averaging over contributing items removes it.
   */
  const person: Record<string, number> = {};
  for (const factor of ENVIRONMENT_FACTORS) {
    const raw = acc.factors[factor] ?? 0;
    const count = acc.factorCounts[factor] ?? 0;
    person[factor] = count === 0 ? 0 : Math.max(-2, Math.min(2, raw / count));
  }

  const raw = ENVIRONMENTS_LIST.map((environmentId) => {
    const profile = ENVIRONMENT_PROFILES[environmentId];
    // Fit is the negative distance between what they want and what it offers.
    let distance = 0;
    for (const factor of ENVIRONMENT_FACTORS) {
      distance += Math.abs((person[factor] ?? 0) - profile[factor]);
    }

    const reasons: string[] = [];
    for (const factor of ENVIRONMENT_FACTORS) {
      const personValue = person[factor] ?? 0;
      if (Math.abs(personValue) < 0.5) continue;
      const aligned = Math.sign(personValue) === Math.sign(profile[factor]) && profile[factor] !== 0;
      const phrase = personValue > 0 ? FACTOR_PHRASES[factor].high : FACTOR_PHRASES[factor].low;
      reasons.push(`${aligned ? 'Fits' : 'Tension'}: ${phrase}.`);
    }

    return { environmentId, distance, reasons };
  });

  const worst = Math.max(...raw.map((entry) => entry.distance), 1);

  return raw
    .map((entry) => ({
      environmentId: entry.environmentId,
      score: Math.round(((worst - entry.distance) / worst) * 100),
      reasons: entry.reasons.slice(0, 3),
    }))
    .sort((a, b) => b.score - a.score);
}

const ENVIRONMENTS_LIST: EnvironmentId[] = ['government', 'corporate', 'consulting'];

export interface ScoringResult {
  lanes: LaneScore[];
  environments: EnvironmentScore[];
  traits: TraitScore[];
  answered: number;
  applicable: number;
  overallConfidence: number;
  caveats: string[];
}

export function score(responses: ItemResponse[]): ScoringResult {
  const acc = emptyAccumulator();
  for (const response of responses) {
    const item = ITEM_BY_ID.get(response.itemId);
    if (item) applyResponse(acc, item, response);
  }

  const traits = traitScoresFrom(acc);
  const traitValues = new Map(traits.map((trait) => [trait.trait, trait.value]));
  const traitConsistency = new Map(traits.map((trait) => [trait.trait, trait.consistency]));
  const traitIndicators = new Map(traits.map((trait) => [trait.trait, trait.indicators]));

  const rawValues = Object.values(acc.lanes);
  const highest = Math.max(1, ...rawValues);
  const lowest = Math.min(0, ...rawValues);
  const span = Math.max(1, highest - lowest);

  const lanes: LaneScore[] = LANES.map((laneId) => {
    const raw = acc.lanes[laneId] ?? 0;

    // Confidence is the contribution-weighted mean consistency of the traits
    // that produced this lane's score.
    const byTrait = acc.laneTraits.get(laneId) ?? new Map<TraitId, number>();
    let weightedConsistency = 0;
    let totalWeight = 0;
    for (const [trait, magnitude] of byTrait) {
      // A trait with too few indicators reports consistency 1 by default, since
      // there is nothing to disagree. That is an absence of evidence, not
      // agreement, so discount it rather than treating it as certainty.
      const indicators = traitIndicators.get(trait) ?? 0;
      const raw = traitConsistency.get(trait) ?? 1;
      const effective =
        indicators >= MIN_INDICATORS_FOR_CONSISTENCY
          ? raw
          : raw * (indicators / MIN_INDICATORS_FOR_CONSISTENCY);
      weightedConsistency += effective * magnitude;
      totalWeight += magnitude;
    }
    const consistencyPart = totalWeight > 0 ? weightedConsistency / totalWeight : 0.5;

    // A lane nothing bore on cannot be spoken about confidently either.
    const evidencePart = Math.min(1, totalWeight / 20);
    const confidence = Math.round((consistencyPart * 0.7 + evidencePart * 0.3) * 100);

    const reasons = (acc.laneReasons.get(laneId) ?? [])
      .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
      .slice(0, 4)
      .map((entry) => entry.text);

    return {
      laneId,
      raw,
      score: Math.round(((raw - lowest) / span) * 100),
      confidence,
      reasons,
      concerns: concernsFor(laneId, traitValues),
      burnoutRisk: burnoutFor(laneId, traitValues),
    };
  }).sort((a, b) => b.raw - a.raw || a.laneId.localeCompare(b.laneId));

  const applicable = ITEMS.length;
  const caveats: string[] = [];

  if (acc.answered < applicable * 0.6) {
    caveats.push(
      `You answered ${acc.answered} of ${applicable} questions. The fewer you answer, the more this is guesswork.`,
    );
  }

  const shaky = traits.filter(
    (trait) => trait.indicators >= MIN_INDICATORS_FOR_CONSISTENCY && trait.consistency < 0.55,
  );
  for (const trait of shaky) {
    caveats.push(
      `Your answers about ${TRAIT_LABELS[trait.trait]} pointed in different directions, so results resting on it are less certain.`,
    );
  }

  /*
   * Overall confidence has three parts, and the third is what stops a single
   * answer producing a confident-looking result: traits nobody measured cannot
   * vouch for anything, so coverage counts separately from agreement.
   */
  const wellMeasured = traits.filter((trait) => trait.indicators >= MIN_INDICATORS_FOR_CONSISTENCY);
  const meanConsistency =
    wellMeasured.length > 0
      ? wellMeasured.reduce((sum, trait) => sum + trait.consistency, 0) / wellMeasured.length
      : 0.5;
  const completeness = applicable > 0 ? acc.answered / applicable : 0;
  const coverage = TRAITS.length > 0 ? wellMeasured.length / TRAITS.length : 0;
  const overallConfidence = Math.round(
    (meanConsistency * 0.5 + completeness * 0.3 + coverage * 0.2) * 100,
  );

  return {
    lanes,
    environments: environmentScoresFrom(acc),
    traits,
    answered: acc.answered,
    applicable,
    overallConfidence,
    caveats,
  };
}
