/**
 * Report generation.
 *
 * Turns raw scores into the thing the person actually reads: a ranked set of
 * lanes with reasoning, an environment recommendation, honest warnings, and a
 * summary paragraph that sounds like a person wrote it.
 *
 * THE MISMATCH SECTION
 *
 * The specification asks for '"This isn't a match" lanes with explanations if
 * they're strong fits for something but have a weakness that would be
 * problematic.' That is the most useful part of the whole report and the part
 * most career tools omit, because it is the only place somebody learns something
 * they did not already suspect. A lane qualifies when it scored well on interest
 * but carries a concern the scoring engine could name specifically.
 */

import type {
  AssessmentReport,
  ItemResponse,
  LaneScore,
  Mismatch,
  TraitId,
} from '@soc/shared';
import { TRAIT_LABELS } from '@soc/shared';

import { getLaneProfile } from '../lanes.js';
import { score } from './scoring.js';

const ENVIRONMENT_LABELS = {
  government: 'government',
  corporate: 'corporate',
  consulting: 'consulting',
} as const;

/** Lanes that fit on interest but carry a specific, nameable problem. */
function findMismatches(lanes: LaneScore[]): Mismatch[] {
  const mismatches: Mismatch[] = [];

  for (const lane of lanes) {
    // Only worth raising if they scored respectably AND we can name the problem.
    if (lane.score < 55 || lane.concerns.length === 0) continue;
    const profile = getLaneProfile(lane.laneId);
    if (!profile) continue;

    mismatches.push({
      laneId: lane.laneId,
      attraction: lane.reasons[0] ?? `${profile.title} scored well on your interests.`,
      problem: lane.concerns[0]!,
    });
  }

  return mismatches.slice(0, 3);
}

/** A readable sentence describing the strongest few traits. */
function describeStrengths(traits: Array<{ trait: TraitId; value: number; indicators: number }>): string {
  const strong = traits
    .filter((trait) => trait.indicators >= 2 && Math.abs(trait.value) >= 0.8)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 3);

  if (strong.length === 0) return 'Your answers did not point strongly in any one direction';

  const phrases = strong.map((trait) => {
    const label = TRAIT_LABELS[trait.trait];
    return trait.value > 0 ? `high ${label}` : `low ${label}`;
  });

  if (phrases.length === 1) return `What stands out most is your ${phrases[0]}`;
  const last = phrases.pop();
  return `What stands out most is your ${phrases.join(', ')}, and ${last}`;
}

export function buildReport(responses: ItemResponse[]): AssessmentReport {
  const result = score(responses);

  // Take four when the fourth is genuinely close to the third, otherwise three.
  const ranked = result.lanes;
  const third = ranked[2]?.score ?? 0;
  const fourth = ranked[3]?.score ?? 0;
  const topCount = fourth >= third - 6 ? 4 : 3;

  const topLanes = ranked.slice(0, topCount);
  const alternatives = ranked.slice(topCount, topCount + 3).filter((lane) => lane.score >= 50);

  const top = topLanes[0];
  const topProfile = top ? getLaneProfile(top.laneId) : null;
  const bestEnvironment = result.environments[0];

  // --- burnout warning ------------------------------------------------------
  let burnoutWarning: string | undefined;
  if (top && topProfile && top.burnoutRisk === 'high') {
    const drivers = topProfile.burnoutDrivers.slice(0, 2).join(', and ');
    const personal = top.concerns[0];
    burnoutWarning =
      `${topProfile.title} is your strongest match, but it carries a high burnout risk for your profile. ` +
      `What burns people out in this lane: ${drivers}. ` +
      (personal ? `In your case specifically: ${personal} ` : '') +
      'That does not mean avoid it. It means go in with your eyes open, ask about alert tuning and shift patterns at interview, and have a plan for moving on within two years.';
  }

  // --- summary --------------------------------------------------------------
  const strengths = describeStrengths(result.traits);
  const environmentSentence = bestEnvironment
    ? ` You look best suited to a ${ENVIRONMENT_LABELS[bestEnvironment.environmentId]} environment${
        bestEnvironment.reasons[0] ? `, because ${bestEnvironment.reasons[0].replace(/^(Fits|Tension): /, '').replace(/\.$/, '')}` : ''
      }.`
    : '';

  const confidenceSentence =
    result.overallConfidence < 60
      ? ' Treat this as a starting point rather than a conclusion: your answers were not consistent enough to say more than that.'
      : '';

  const summary = topProfile
    ? `${strengths}. That points toward ${topProfile.title.toLowerCase()}: ${topProfile.summary.toLowerCase()}` +
      `${environmentSentence}` +
      `${confidenceSentence}`
    : 'There were not enough answers to draw a conclusion. Answering more questions would help.';

  return {
    topLanes,
    alternatives,
    mismatches: findMismatches(ranked.slice(0, 8)),
    environments: result.environments,
    traits: result.traits,
    summary,
    ...(burnoutWarning ? { burnoutWarning } : {}),
    overallConfidence: result.overallConfidence,
    caveats: result.caveats,
    answered: result.answered,
    applicable: result.applicable,
  };
}

/**
 * A short shareable summary.
 *
 * Deliberately plain text with no scores attached beyond the top lane: sharing a
 * numeric profile invites people to compare, and these numbers are not precise
 * enough to bear that weight.
 */
export function shareableSummary(report: AssessmentReport): string {
  const top = report.topLanes[0];
  const profile = top ? getLaneProfile(top.laneId) : null;
  if (!profile) return 'Career Fit Analyzer, not enough answers to summarise.';

  const environment = report.environments[0];
  const lines = [
    `Cybersecurity Career Fit: strongest match: ${profile.title}`,
    '',
    profile.summary,
    '',
    environment ? `Best environment: ${ENVIRONMENT_LABELS[environment.environmentId]}` : '',
    report.topLanes.length > 1
      ? `Also worth looking at: ${report.topLanes
          .slice(1)
          .map((lane) => getLaneProfile(lane.laneId)?.title)
          .filter(Boolean)
          .join(', ')}`
      : '',
    '',
    'This is a career-guidance tool, not a validated psychometric test.',
  ];

  return lines.filter((line) => line !== '').join('\n');
}
