/**
 * The after-action review, and the record of who has run what.
 *
 * WHERE FEEDBACK LANDS, AND WHY IT MOVES
 *
 * At beginner the teaching is inline: five candidate commands, a lesson on
 * whichever one they picked, a coaching line for the lead. Somebody who has
 * never used a shell cannot be helped after the fact, because they never got
 * far enough to have made an interesting mistake.
 *
 * Above beginner the teaching moves to the end, and that is the point rather
 * than a consequence of removing the hints. An analyst who is told mid-incident
 * what to look for has been handed the finding; the same sentence an hour later,
 * against what they actually did, is a lesson. So intermediate and above run the
 * hour unaided and get everything in the review.
 *
 * THE SHAPE OF THE HOUR
 *
 *   WORKING    events arrive, seats claim them
 *   REPORTING  seats write up as their boards go quiet, lead calls presentations
 *   CONTROL    detection engineering proposes what stops it next time
 *   CLOSED     the lead reads out findings and mitigations, and the ops stops
 *   REVIEW     the floor talks. Then, and only then, the system says its piece.
 *
 * The lead reads out first and the system speaks second, deliberately. A floor
 * that hears the model answer before it has committed to its own account will
 * remember the model answer, and the thing worth practising is arriving at one
 * together on incomplete information.
 */

import type { ScenarioDifficulty } from './scenarios.js';
import type { SocRoleId } from './roles.js';

/**
 * One step of how the incident should have been worked.
 *
 * Derived from the scenario rather than authored, so it cannot drift from the
 * truth it describes. It is the run the floor did not have: events in the order
 * they landed, the seat that owned each, and the move that opened it up.
 */
export interface IdealStep {
  eventId: string;
  atSeconds: number;
  /** The seat that should have taken it first. */
  owner: SocRoleId;
  /** One line on what this event actually was. */
  what: string;
  /**
   * Every command or action that answered it, joined with "or".
   *
   * Plural on purpose. Several commands often reach the same finding, and
   * printing one of them as THE answer tells a student who took another route
   * that they were wrong when they were not.
   */
  move: string;
  /** True when more than one approach reached this finding. */
  alsoWorks: boolean;
  /** Whether this run got there, and how late. */
  actual: 'caught' | 'late' | 'misread' | 'missed' | 'not-shown';
  /** Seconds after landing, when somebody did take it. */
  afterSeconds: number | null;
}

/**
 * A specific, actionable thing to do differently.
 *
 * WHY THESE ARE DERIVED AND NOT A LIST OF PLATITUDES
 *
 * "Communicate better" is true of every floor that has ever run and helps
 * nobody. Each of these is computed from something that actually happened this
 * run: an event nobody took, a seat that worked somebody else's queue, a
 * dismissal reached in nine seconds without opening anything. A floor that did
 * not make the mistake does not get told about it.
 */
export interface Improvement {
  /** What the platform observed, in one line. */
  observed: string;
  /** What to do instead, specifically enough to act on. */
  instead: string;
  /** The events this was drawn from, so it can be checked rather than believed. */
  eventIds: string[];
  /** Seats this is addressed to. Empty means the whole floor. */
  forRoles: SocRoleId[];
}

/**
 * What the lead reads out before the system says anything.
 *
 * Assembled from the floor's own claims and reports, not from truth. It is
 * their account, and the review then compares it against what happened.
 */
export interface LeadReadout {
  /** The incident as the floor understood it, in their words. */
  findings: string[];
  /** Controls the floor proposed. */
  mitigations: string[];
  /** Seats that never filed, named rather than averaged away. */
  missingReports: SocRoleId[];
}

export interface AfterActionReview {
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  /** Authored once, identical every run: what the attacker actually did. */
  whatHappened: string[];
  /** What the lead said, before any of the below was shown. */
  readout: LeadReadout;
  /** How it should have gone, step by step. */
  ideal: IdealStep[];
  /** Computed from this run only. */
  improvements: Improvement[];
  /**
   * The finding whose absence means the incident was failed, and whether this
   * run got it. Averaging it into a percentage is how a floor concludes it did
   * fine after missing the only thing that mattered.
   */
  criticalFindings: Array<{ eventId: string; what: string; caught: boolean }>;
  /** Detect, analyse, correct. The three numbers a debrief is actually about. */
  timings: { detectSeconds: number | null; analyseSeconds: number | null; correctSeconds: number | null };
  /** One paragraph, derived. Shown at the top. */
  summary: string;
}

/* ------------------------------------------------------------------------- *
 * Attempt history
 * ------------------------------------------------------------------------- */

/**
 * The single letter shown against a scenario somebody has already run.
 *
 * A letter rather than a tick because which TIER they cleared is the whole
 * information. Somebody who has run Ridgeline at beginner and somebody who has
 * run it at expert have not done the same thing, and a tick against both says
 * they have.
 */
export const TIER_BADGE: Record<ScenarioDifficulty, string> = {
  beginner: 'B',
  intermediate: 'I',
  advanced: 'A',
  expert: 'E',
};

export interface ScenarioAttempt {
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  /** The seat they held. Running one twice from different chairs is different practice. */
  role: SocRoleId;
  /** ISO 8601. */
  completedAt: string;
  /** Out of 100, across every event they claimed. */
  score: number;
  /** Whether the run reached the critical findings. */
  caughtCritical: boolean;
}

/**
 * What the scenario picker shows against one scenario.
 *
 * REPEATING IS ENCOURAGED, NOT DISCOURAGED
 *
 * The badge says what has been done, and nothing anywhere stops it being done
 * again. That is deliberate: the same incident at a harder tier is the point of
 * the whole difficulty design, and running it a second time from a different
 * chair is genuinely different practice. What the picker prevents is somebody
 * running the same incident at the same tier four times without noticing,
 * because a scenario whose answer you remember teaches nothing.
 */
export interface ScenarioHistory {
  scenarioId: string;
  /** Tiers cleared at least once, in order, as letters. */
  badges: string[];
  /** Every attempt, newest first. */
  attempts: ScenarioAttempt[];
  /** Best score at each tier attempted. */
  bestByTier: Partial<Record<ScenarioDifficulty, number>>;
  /** Set when they have run this exact tier before. Advisory, never a block. */
  repeatOf: ScenarioDifficulty | null;
  /** The tier to suggest next, or null when they have cleared expert. */
  suggestedNext: ScenarioDifficulty | null;
}
