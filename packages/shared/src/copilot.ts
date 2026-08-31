/**
 * The AI copilot: what it says, and how a student is scored on working with it.
 *
 * WHY THE COPILOT IS CONTENT AND NOT A LIVE MODEL CALL
 *
 * Several exercises here require the copilot to be *wrong in a specific way* --
 * to over-escalate a documented finance workflow, or to talk somebody out of the
 * one alert that mattered by quoting a base rate at them. A live model cannot be
 * relied upon to produce a particular mistake on cue, and an exercise whose
 * answer key depends on what a model felt like saying today is not an exercise.
 *
 * So copilot output is generated from a fixed seed and committed, exactly like
 * the log files and the alert corpus, for exactly the same reason: the expected
 * answers are computed from it, so it must not change unless somebody intends it
 * to. `CopilotProvider` on the server is the seam where a live model can later
 * answer free-form questions without any of this becoming non-deterministic.
 *
 * THE FLAW TABLE NEVER SHIPS
 *
 * `CopilotAnalysis` ships -- it has to, it is the thing being evaluated.
 * `CopilotFlaw`, which records whether an analysis is sound and how it fails,
 * does not. It is the third answer key in this codebase, alongside exercise
 * `checks` and `AlertTruth`, and it is kept in a separate type for the same
 * reason those are: forgetting to strip it should be a compile error rather than
 * a silent leak.
 *
 * A student who could read the flaw table would know which suggestions to
 * distrust without reading one of them, which is the entire skill this material
 * exists to teach.
 */

import type { TriageDecision } from './alerts.js';

/**
 * One line of the copilot's reasoning.
 *
 * Reasoning is a list of discrete claims rather than a paragraph because the
 * skill being taught is checking claims one at a time. A wall of confident prose
 * is read as a single take-it-or-leave-it verdict; five separate assertions
 * invite somebody to find the one that is unsupported -- which is what catching
 * a fabricated rationale actually looks like in practice.
 */
export interface CopilotClaim {
  /** The assertion, in the copilot's voice. */
  text: string;
  /**
   * Where the claim comes from.
   *
   * `observed` means it restates something on the alert. `inferred` means the
   * copilot reasoned to it. `assumed` means it is not supported by anything the
   * copilot was given -- the tell for a fabricated rationale, and shown to the
   * student on purpose. Real assistants do not label their own inventions, but a
   * student has to be taught what one looks like before being asked to spot an
   * unlabelled one.
   */
  basis: 'observed' | 'inferred' | 'assumed';
}

/**
 * The copilot's analysis of a single alert.
 *
 * Everything here is safe to send: it is what the operator is meant to read and
 * argue with. Whether any of it is correct lives in `CopilotFlaw`.
 */
export interface CopilotAnalysis {
  alertId: string;
  /** One-line verdict, in the copilot's voice. */
  headline: string;
  /** Reasons the copilot reads as pointing towards a threat. */
  riskFactors: CopilotClaim[];
  /** Reasons the copilot reads as pointing away from one. */
  mitigatingFactors: CopilotClaim[];
  /** What the copilot thinks the operator should do. Not always right. */
  recommendation: TriageDecision;
  /**
   * The copilot's stated confidence, 0-100.
   *
   * Deliberately uncorrelated with whether it is correct. Confidence is a
   * property of how a model writes, not of whether it is right, and a student who
   * learns to read it as a probability has learned something false.
   */
  confidence: number;
  /** What the copilot suggests doing next. Occasionally unworkable. */
  nextSteps: string[];
  /**
   * What the copilot could not see.
   *
   * Always populated, always shown. Most real copilot mistakes are not reasoning
   * failures but context failures, and the honest ones say so up front.
   */
  limits: string[];
}

/** How an analysis fails, when it does. */
export const COPILOT_FLAW_KINDS = [
  /** Recommends escalating documented, routine, already-explained activity. */
  'over-escalation',
  /** Talks the operator out of a real finding by quoting the rule's base rate. */
  'volume-dismissal',
  /** Recommendation is right; the reasoning that supports it is invented. */
  'fabricated-attribution',
  /** Recommendation is right; a suggested next step is not workable at scale. */
  'unworkable-advice',
] as const;
export type CopilotFlawKind = (typeof COPILOT_FLAW_KINDS)[number];

/**
 * The answer key for one analysis. Server-side only.
 *
 * Never add this to a type that crosses the API boundary, and never assemble it
 * into a response. It is released -- as prose, in the debrief -- only after a
 * student has committed their decisions.
 */
export interface CopilotFlaw {
  alertId: string;
  kind: CopilotFlawKind;
  /**
   * Whether following the recommendation leads to the wrong disposition.
   *
   * False for `fabricated-attribution` and `unworkable-advice`, and that is the
   * point of having them. If every flawed analysis also carried a wrong
   * recommendation, "spot the flaw" would collapse into "notice which ones I
   * happened to disagree with", and a student could clear the exercise without
   * reading a single rationale.
   */
  misleads: boolean;
  /** Shown in the debrief: what the copilot got wrong and how to have seen it. */
  why: string;
}

/**
 * A copilot consultation, as recorded server-side.
 *
 * Recorded when the analysis is served rather than reported by the client,
 * because "did you actually look" is graded, and a client-supplied claim about
 * it would be a claim the student controls.
 */
export interface CopilotConsultation {
  alertId: string;
  /** ISO 8601. */
  at: string;
}

/**
 * How one alert's handling shook out, once the copilot is in the picture.
 *
 * The names are exhaustive over (was the copilot right) x (was the student
 * right) x (did they take its advice), given that agreeing with a correct
 * recommendation and being correct are the same event.
 */
export const COLLABORATION_OUTCOMES = [
  /** Consulted, copilot wrong, student right anyway. The skill, in one word. */
  'caught',
  /** Consulted, copilot right, student agreed. Ordinary good use of a tool. */
  'corroborated',
  /** Consulted, copilot wrong, student did what it said. The failure mode. */
  'misled',
  /** Consulted, copilot right, student went elsewhere and was wrong. */
  'strayed',
  /** Consulted, copilot wrong, student wrong differently. Independent, and off. */
  'both-wrong',
  /** Not consulted, student right. */
  'solo-right',
  /** Not consulted, student wrong, and the copilot would have said so. */
  'solo-missed-help',
  /** Not consulted, student wrong, copilot would have been wrong too. */
  'solo-wrong',
] as const;
export type CollaborationOutcome = (typeof COLLABORATION_OUTCOMES)[number];

/**
 * Points per outcome.
 *
 * WHY CONSULTING IS NOT REWARDED FOR ITS OWN SAKE
 *
 * `corroborated` and `solo-right` are worth the same. An operator who reads an
 * alert, knows what it is, and dispositions it correctly without asking anybody
 * has done the job; paying them less than somebody who asked first would be
 * teaching dependence and calling it collaboration.
 *
 * What is worth more is `caught` -- consulting, and then disagreeing correctly.
 * That is the only outcome requiring both the tool and the judgement, and the one
 * thing here that does not happen by accident.
 *
 * `misled` is the heaviest penalty because it is the specific harm: the operator
 * had the alert in front of them, had a second opinion, and deferred to the wrong
 * one. `solo-wrong` costs nothing -- getting an alert wrong that the copilot
 * would also have got wrong is not a collaboration failure.
 */
export const COLLABORATION_POINTS: Record<CollaborationOutcome, number> = {
  caught: 3,
  corroborated: 1,
  misled: -3,
  strayed: -1,
  'both-wrong': -1,
  'solo-right': 1,
  'solo-missed-help': -1,
  'solo-wrong': 0,
};

/** The best score obtainable on one alert, which depends on the copilot. */
function bestPossible(copilotRight: boolean): number {
  return copilotRight ? COLLABORATION_POINTS.corroborated : COLLABORATION_POINTS.caught;
}

export interface CollaborationScore {
  /** 0-100. Never read on its own -- see the note on `deferenceRate`. */
  score: number;
  /** Alerts the student dispositioned. Zero means the score means nothing. */
  decided: number;
  /** Alerts they asked the copilot about. */
  consulted: number;
  /**
   * Of the consulted alerts, the share where the student took the copilot's
   * recommendation verbatim. Null when nothing was consulted.
   *
   * Reported next to the score rather than folded into it. A student can defer on
   * every single alert and still score respectably when the copilot happens to be
   * right most of the time -- which is exactly the habit that gets somebody hurt
   * the first time it is not. The number an instructor wants is this one.
   */
  deferenceRate: number | null;
  /** One entry per outcome, so the score can be read apart rather than trusted. */
  counts: Record<CollaborationOutcome, number>;
}

export interface CollaborationInput {
  alertId: string;
  /** The disposition the student committed. */
  decision: TriageDecision;
  /** The correct disposition. */
  correctDecision: TriageDecision;
  /** What the copilot recommended for this alert. */
  recommendation: TriageDecision;
  /** Whether the student opened the copilot on this alert. */
  consulted: boolean;
}

/** Classify one alert's handling. */
export function classifyCollaboration(item: CollaborationInput): CollaborationOutcome {
  const copilotRight = item.recommendation === item.correctDecision;
  const studentRight = item.decision === item.correctDecision;

  if (!item.consulted) {
    if (studentRight) return 'solo-right';
    return copilotRight ? 'solo-missed-help' : 'solo-wrong';
  }
  if (copilotRight) return studentRight ? 'corroborated' : 'strayed';
  if (studentRight) return 'caught';
  return item.decision === item.recommendation ? 'misled' : 'both-wrong';
}

/**
 * Score a whole submission on how the student worked with the copilot.
 *
 * Only alerts the student actually dispositioned are counted. Leaving an alert
 * undecided is a triage failure and is already scored as one by recall; counting
 * it again here would penalise the same omission twice under a different name.
 */
export function scoreCollaboration(items: CollaborationInput[]): CollaborationScore {
  const counts = Object.fromEntries(COLLABORATION_OUTCOMES.map((outcome) => [outcome, 0])) as Record<
    CollaborationOutcome,
    number
  >;

  let points = 0;
  let possible = 0;
  let consulted = 0;
  let deferred = 0;

  for (const item of items) {
    const outcome = classifyCollaboration(item);
    counts[outcome] += 1;
    points += COLLABORATION_POINTS[outcome];
    possible += bestPossible(item.recommendation === item.correctDecision);
    if (item.consulted) {
      consulted += 1;
      if (item.decision === item.recommendation) deferred += 1;
    }
  }

  return {
    // Clamped at zero: the ratio goes negative once somebody is deferring into
    // wrong answers, and "minus forty out of a hundred" is not actionable.
    score: possible === 0 ? 0 : Math.max(0, Math.round((points / possible) * 100)),
    decided: items.length,
    consulted,
    deferenceRate: consulted === 0 ? null : deferred / consulted,
    counts,
  };
}

/**
 * The copilot half of a triage debrief.
 *
 * Released only after decisions are committed, on the same principle as the
 * worked solution and the per-alert triage explanation: being told in advance
 * which two suggestions were rotten teaches nothing about reading the other
 * eighty.
 */
export interface CopilotDebriefEntry {
  alertId: string;
  kind: CopilotFlawKind;
  /** What the copilot advised. */
  recommendation: TriageDecision;
  /** What the student did, if anything. */
  yourDecision: TriageDecision | null;
  /** Whether following the advice would have been wrong. */
  misleads: boolean;
  /** Whether the student consulted it before deciding. */
  consulted: boolean;
  why: string;
}
