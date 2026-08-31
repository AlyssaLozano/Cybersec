/**
 * Capability baseline: what can this person actually do today?
 *
 * WHY THIS EXISTS SEPARATELY FROM THE CAREER ASSESSMENT
 *
 * The Career Fit Analyzer measures what somebody WANTS. This measures what they
 * can DO. They are different questions and conflating them helps nobody: plenty
 * of people want SOC work and cannot yet read a netstat table, and plenty of
 * capable sysadmins assume they are further behind than they are.
 *
 * WHY IT PROBES RATHER THAN ASKS
 *
 * "Rate your Linux skills 1-5" measures confidence, not competence, and the two
 * correlate badly in both directions. Every probe here puts a real artifact in
 * front of somebody — an actual line from the seeded auth.log, a real netstat
 * table — and asks what it means. You cannot bluff a question about output you
 * are looking at.
 *
 * WHAT IT IS FOR
 *
 * Routing. A baseline is only worth taking if it ends in "here are the eight
 * exercises that close your biggest gaps", which is what `ReadinessReport`
 * produces. It is not a score to feel bad about.
 */

import type { LaneId } from './assessment.js';

// --- capabilities ------------------------------------------------------------

/**
 * How central a capability is to a lane.
 *
 * `core` means you cannot do the job without it. `supporting` means it comes up
 * regularly. `peripheral` means it helps but you would not be blocked.
 */
export const CAPABILITY_WEIGHTS = { core: 3, supporting: 2, peripheral: 1 } as const;
export type CapabilityImportance = keyof typeof CAPABILITY_WEIGHTS;

export interface Capability {
  id: string;
  title: string;
  /** Plain language, describing the doing. */
  summary: string;
  /** The foundation that teaches it. */
  foundationId: string;
  /**
   * Which lanes need it and how badly. A capability with no entry for a lane is
   * simply not counted toward that lane's readiness.
   */
  lanes: Partial<Record<LaneId, CapabilityImportance>>;
  /**
   * Exercises that teach this specific capability, in order. Empty when the
   * foundation has not been written yet, which the UI reports honestly rather
   * than routing somebody nowhere.
   */
  exerciseIds: string[];
}

// --- probes ------------------------------------------------------------------

export interface ProbeOption {
  id: string;
  label: string;
}

/**
 * A single question testing one capability.
 *
 * Every probe carries an `explanation` shown after answering, because a baseline
 * that only tells you that you were wrong has wasted the most teachable moment
 * it will ever get.
 */
export interface Probe {
  id: string;
  capabilityId: string;
  /** The question. */
  prompt: string;
  /**
   * Real output the learner reads to answer: a log extract, a netstat table, a
   * process listing. Rendered monospaced.
   */
  artifact?: string;
  options: ProbeOption[];
  /** Exactly one correct option id. */
  answerId: string;
  /** Shown after answering, whether right or wrong. */
  explanation: string;
  /**
   * Difficulty, used only to order probes gently upward. It does not weight
   * scoring: getting a hard one right does not excuse missing an easy one.
   */
  level: 'recall' | 'apply' | 'analyse';
}

// --- results -----------------------------------------------------------------

export interface ProbeResponse {
  probeId: string;
  optionId: string;
}

export interface CapabilityResult {
  capabilityId: string;
  title: string;
  /** Probes answered for this capability. */
  attempted: number;
  correct: number;
  /** True when every probe for it was answered correctly. */
  demonstrated: boolean;
  /** Importance to the lane being measured. */
  importance: CapabilityImportance;
  /** Exercises that would close this gap. Empty when not yet written. */
  exerciseIds: string[];
  foundationId: string;
  foundationTitle: string;
  /** True when the foundation behind it has playable content today. */
  teachable: boolean;
}

/** A recommended next step: some exercises, and what they would buy. */
export interface ReadinessStep {
  capabilityId: string;
  title: string;
  foundationTitle: string;
  exerciseIds: string[];
  /** Readiness percentage after closing this gap, all else unchanged. */
  readinessAfter: number;
  teachable: boolean;
}

export interface ReadinessReport {
  laneId: LaneId;
  laneTitle: string;
  /** 0-100, weighted by capability importance for this lane. */
  readiness: number;
  /** Readiness counting only capabilities we can actually teach today. */
  readinessOfTeachable: number;
  results: CapabilityResult[];
  /** Gaps in the order worth closing them, biggest lever first. */
  steps: ReadinessStep[];
  /**
   * The headline projection: closing the top gaps takes you from here to there.
   * Null when there is nothing left to close, or nothing teachable yet.
   */
  projection: {
    exerciseCount: number;
    from: number;
    to: number;
    capabilityCount: number;
  } | null;
  probesAnswered: number;
  probesTotal: number;
  /** Honest note when much of the lane cannot be taught here yet. */
  coverageNote: string | null;
}
