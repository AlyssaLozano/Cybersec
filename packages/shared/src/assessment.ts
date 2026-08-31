/**
 * The Cybersecurity Career Fit Analyzer.
 *
 * WHAT THIS IS
 *
 * A 60-80 item instrument that scores someone against fourteen technical lanes
 * and three organisational environments, then produces a ranked report with
 * reasoning attached.
 *
 * WHAT THIS IS NOT
 *
 * A validated psychometric. It has not been normed on a population, its
 * constructs have not been factor-analysed, and its predictive validity is
 * unmeasured. It is a structured, honest conversation about fit. Every surface
 * that shows a result says so, because dressing career guidance up as science is
 * how people end up trusting a number that was never earned.
 *
 * THE TWO AXES
 *
 *   Environment: government, corporate, or consulting. Scored separately from
 *   lane, because someone can be perfectly suited to incident response and
 *   miserable doing it at a consultancy that flies them somewhere new each week.
 *
 *   Lane: the technical work itself.
 *
 * HOW REDUNDANCY WORKS
 *
 * Each item also indicates a TRAIT. Traits are measured by several items across
 * different dimensions, some reverse-coded, so the instrument can notice when
 * somebody's answers disagree with each other. That disagreement is not thrown
 * away or averaged into mush -- it becomes a confidence score, and a lane whose
 * recommendation rests on an inconsistent trait is flagged rather than asserted.
 */

// --- dimensions --------------------------------------------------------------

export const DIMENSIONS = [
  'pace_pressure',
  'problem_solving',
  'interpersonal',
  'detail_bigpicture',
  'interests_energy',
  'life_balance',
] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_LABELS: Record<Dimension, string> = {
  pace_pressure: 'Work Pace and Pressure',
  problem_solving: 'Problem-Solving Style',
  interpersonal: 'Working With People',
  detail_bigpicture: 'Detail and Big Picture',
  interests_energy: 'Interests and Energy',
  life_balance: 'Life and Work Balance',
};

// --- lanes -------------------------------------------------------------------

export const LANES = [
  'soc-ops',
  'detection-engineering',
  'incident-response',
  'threat-intel',
  'pentest',
  'red-team',
  'security-engineering',
  'risk-compliance',
  'iam',
  'network-security',
  'cloud-security',
  'appsec',
  'vuln-management',
  'forensics',
  'security-architecture',
  'ai-security',
] as const;
export type LaneId = (typeof LANES)[number];

// --- environments ------------------------------------------------------------

export const ENVIRONMENTS = ['government', 'corporate', 'consulting'] as const;
export type EnvironmentId = (typeof ENVIRONMENTS)[number];

/**
 * The four underlying needs that decide environment fit.
 *
 * Scored from the items, then compared against each environment's profile,
 * rather than asking "do you want to work for the government?", which measures
 * what somebody has heard about government work, not whether they would like it.
 */
export const ENVIRONMENT_FACTORS = ['stability', 'pace', 'rules', 'autonomy'] as const;
export type EnvironmentFactor = (typeof ENVIRONMENT_FACTORS)[number];

// --- traits ------------------------------------------------------------------

/**
 * Constructs measured by several items each, so answers can be cross-checked.
 *
 * A trait needs at least three indicators before the consistency check will
 * report on it; below that, disagreement is as likely to be noise as signal.
 */
export const TRAITS = [
  'detail_orientation',
  'pressure_tolerance',
  'interrupt_tolerance',
  'people_orientation',
  'structure_need',
  'adversarial_pull',
  'depth_preference',
  'novelty_seeking',
  'autonomy_need',
  'stability_need',
  'research_orientation',
  'building_drive',
] as const;
export type TraitId = (typeof TRAITS)[number];

export const TRAIT_LABELS: Record<TraitId, string> = {
  detail_orientation: 'attention to detail',
  pressure_tolerance: 'comfort under pressure',
  interrupt_tolerance: 'tolerance for interruption',
  people_orientation: 'preference for working with people',
  structure_need: 'need for structure and clear rules',
  adversarial_pull: 'pull toward adversarial work',
  depth_preference: 'preference for depth over breadth',
  novelty_seeking: 'appetite for new tools and change',
  autonomy_need: 'need for autonomy',
  stability_need: 'need for stability',
  research_orientation: 'pull toward research and reading',
  building_drive: 'drive to build things',
};

// --- items -------------------------------------------------------------------

/** Weights applied to lanes when an answer is endorsed. */
export type LaneWeights = Partial<Record<LaneId, number>>;
export type EnvironmentFactorWeights = Partial<Record<EnvironmentFactor, number>>;

/**
 * A 5-point agreement item.
 *
 * Responses run 1 (strongly disagree) to 5 (strongly agree) and are centred to
 * -2..+2 before weighting, so disagreeing with a statement counts against the
 * lanes it favours instead of merely failing to count for them.
 */
export interface LikertItem {
  id: string;
  kind: 'likert';
  dimension: Dimension;
  /** Concrete and specific. "I would rather analyse logs" beats "I value detail". */
  statement: string;
  /** Lanes this statement favours when agreed with. */
  lanes: LaneWeights;
  /** Environment factors this statement indicates. */
  factors?: EnvironmentFactorWeights;
  /** The construct this item indicates, for cross-checking. */
  trait: TraitId;
  /** True when agreement indicates a LOW value of the trait. */
  reverse?: boolean;
}

export interface ChoiceOptionSpec {
  id: string;
  label: string;
  detail?: string;
  lanes?: LaneWeights;
  factors?: EnvironmentFactorWeights;
  /** Trait reading this option implies, on the same -2..+2 scale. */
  traitValue?: { trait: TraitId; value: number };
}

/** A forced choice between concrete alternatives. */
export interface ChoiceItem {
  id: string;
  kind: 'choice';
  dimension: Dimension;
  prompt: string;
  detail?: string;
  options: ChoiceOptionSpec[];
  /** Only ask when a previous answer makes it relevant. */
  showWhen?: { itemId: string; optionIds?: string[]; minValue?: number; maxValue?: number };
}

export type AssessmentItem = LikertItem | ChoiceItem;

/** One response. `value` for Likert (1-5), `optionId` for choices. */
export interface ItemResponse {
  itemId: string;
  value?: number;
  optionId?: string;
}

// --- scoring output ----------------------------------------------------------

export interface LaneScore {
  laneId: LaneId;
  /** 0-100, normalised across lanes. */
  score: number;
  /** Raw accumulated weight, kept for debugging and transparency. */
  raw: number;
  /**
   * 0-100. Lowered when the traits driving this lane were answered
   * inconsistently, or when few items bearing on it were answered.
   */
  confidence: number;
  /** Plain-language reasons this lane scored where it did. */
  reasons: string[];
  /** Things about this profile that would make this lane hard. */
  concerns: string[];
  /** Estimated burnout risk for THIS person in THIS lane. */
  burnoutRisk: 'low' | 'medium' | 'high';
}

export interface TraitScore {
  trait: TraitId;
  /** -2..+2 average across indicators. */
  value: number;
  /** How many items contributed. */
  indicators: number;
  /**
   * 0-1, where 1 means every indicator agreed. Computed from spread across
   * indicators, which is what the redundant items exist to measure.
   */
  consistency: number;
}

export interface EnvironmentScore {
  environmentId: EnvironmentId;
  score: number;
  /** Why this environment suits, or does not. */
  reasons: string[];
}

/** A lane that fits on interest but has a specific disqualifying friction. */
export interface Mismatch {
  laneId: LaneId;
  /** What attracted them to it. */
  attraction: string;
  /** The specific problem. */
  problem: string;
}

export interface AssessmentReport {
  /** Top lanes, best first. Three or four depending on score separation. */
  topLanes: LaneScore[];
  /** Worth considering, with a reason. */
  alternatives: LaneScore[];
  /** Strong interest fit undermined by a specific weakness. */
  mismatches: Mismatch[];
  environments: EnvironmentScore[];
  traits: TraitScore[];
  /** Narrative tying strengths to the recommendation. */
  summary: string;
  /** Shown when the top pick carries high burnout risk for this profile. */
  burnoutWarning?: string;
  /** 0-100 across the whole instrument. */
  overallConfidence: number;
  /** Raised when responses were internally inconsistent or too few. */
  caveats: string[];
  /** Items answered, out of items applicable. */
  answered: number;
  applicable: number;
}

// --- lane profiles -----------------------------------------------------------

export interface LaneProfile {
  id: LaneId;
  title: string;
  /** One line, honest. */
  summary: string;
  /** Concrete, no marketing. What Tuesday actually looks like. */
  dayToDay: string[];
  /** Traits that predict success here. */
  personalityMatch: string[];
  /** What makes people quit this role. */
  painPoints: string[];
  /** Best to worst, with reasoning per environment. */
  environmentFit: Array<{ environmentId: EnvironmentId; rank: number; note: string }>;
  /** Realistic pathway, not every certificate in existence. */
  certPathway: string[];
  /** Baseline burnout risk before personal profile is considered. */
  baselineBurnout: 'low' | 'medium' | 'high';
  /** What burns people out here specifically. */
  burnoutDrivers: string[];
  /** Where this leads. */
  advancement: string;
  /** Track id this lane maps to, when a learning track exists. */
  trackId?: string;
  /** Honest note on entering this lane directly from another career. */
  entryReality: string;
}
