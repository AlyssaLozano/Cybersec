/**
 * Live scenarios: one incident, worked by a whole floor, against a clock.
 *
 * WHY THIS IS ONE DATA MODEL AND NOT NINE
 *
 * A scenario needs a SOC Operator to see an alert queue, a Log Analyst to see
 * raw lines, a Network Analyst to see flows, and a Cloud Security specialist to
 * see API calls, all describing the same intrusion. Authoring those nine views
 * separately would be nine chances for them to contradict each other, and 25
 * scenarios times nine roles is 225 hand-written views that nobody will keep in
 * sync.
 *
 * So a scenario is ONE `ScenarioTruth`, and each role's surface is a projection
 * of it computed in code. The Network Analyst and the Log Analyst cannot
 * disagree about when the attacker moved, because both are derived from the
 * same event.
 *
 * WHY EACH ROLE IS SHOWN LESS THAN THE WHOLE
 *
 * A projection deliberately drops what that seat could not know. Network sees a
 * 2.3 GB transfer and not what was in it; Forensics sees an archive staged and
 * not whether it left. No single seat can reconstruct the incident, which is
 * what makes the room necessary rather than decorative, and what gives the
 * Fusion seat something real to do.
 *
 * WHERE THE ANSWER KEY LIVES
 *
 * `ScenarioTruth` is an answer key, exactly like `ALERT_TRUTH` and
 * `COPILOT_FLAWS`. It is reached through differently-named functions from the
 * student-facing ones and no route assembles it before a claim is committed.
 * `ScenarioEvent` has no field capable of carrying a verdict.
 */

import type { AlertSeverity, TriageDecision } from './alerts.js';
import type { SocRoleId } from './roles.js';

export const SCENARIO_DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
export type ScenarioDifficulty = (typeof SCENARIO_DIFFICULTIES)[number];

/**
 * Which surface an event appears on, and therefore which seats can see it at
 * all. An event on `cloud-audit` never reaches the alert queue, which is how a
 * scenario teaches that not every threat arrives as an alert.
 */
export const EVENT_SURFACES = [
  'alert-queue',
  'raw-log',
  'network-flow',
  'cloud-audit',
  'process-tree',
  'host-artefact',
] as const;
export type EventSurface = (typeof EVENT_SURFACES)[number];

/** What an event turns out to be. Lives on truth, never on the event. */
export const EVENT_VERDICTS = [
  /** Genuinely part of the intrusion. */
  'malicious',
  /** Real activity, correctly detected, and no threat. The firewall doing its job. */
  'benign-true-positive',
  /** The detection was simply wrong. */
  'false-positive',
  /** Blocked, and still worth a look because the pattern is reconnaissance. */
  'blocked-reconnaissance',
  /** Deliberate noise generated to bury the real signal. */
  'decoy',
] as const;
export type EventVerdict = (typeof EVENT_VERDICTS)[number];

export const KILL_CHAIN_STAGES = [
  'reconnaissance',
  'initial-access',
  'execution',
  'persistence',
  'privilege-escalation',
  'lateral-movement',
  'collection',
  'exfiltration',
  'impact',
] as const;
export type KillChainStage = (typeof KILL_CHAIN_STAGES)[number];

/**
 * One thing that happens, as a student sees it.
 *
 * Safe to ship in full. Everything here is what a console would actually
 * display; nothing states whether it matters.
 */
export interface ScenarioEvent {
  id: string;
  /** Seconds after the shift starts. Arrival is the pressure, not a countdown. */
  atSeconds: number;
  surface: EventSurface;
  /** One line, as it would appear on the board. */
  summary: string;
  /** What the console shows when the event is opened. */
  detail: string;
  source?: string;
  target?: string;
  /**
   * Severity as the tooling claims it, which is an assertion and not a fact.
   * Null at expert difficulty, where the student assigns it themselves.
   */
  claimedSeverity: AlertSeverity | null;
}

/**
 * What an action costs a role to take. Actions are declared per scenario so a
 * claim form can offer real choices rather than free text alone.
 */
export interface ScenarioAction {
  id: string;
  label: string;
  /** Roles for whom this action is in-lane. Empty means anybody may take it. */
  forRoles: SocRoleId[];
}

/** The answer key for one event. Never shipped before a claim is committed. */
export interface EventTruth {
  eventId: string;
  verdict: EventVerdict;
  stage?: KillChainStage;
  /**
   * The seat that should get to this FIRST. Claiming ahead of it is not wrong
   * knowledge, it is a lane violation, and the two are scored separately.
   */
  firstResponder: SocRoleId;
  /** Seats that may also work it, once the first responder has escalated. */
  alsoAppropriate: SocRoleId[];
  /** Actions that are correct for the first responder. */
  correctActions: string[];
  /** Actions that belong to somebody else's job. Scored as overreach. */
  outOfLaneActions: string[];
  /** Where this should go next. Empty means it stops here. */
  escalateTo: SocRoleId[];
  /** Shown in the debrief, after the claim is committed. */
  why: string;
}

export interface ScenarioTruth {
  scenarioId: string;
  events: EventTruth[];
  /** The narrative the debrief reconstructs, in order. */
  narrative: string[];
}

export interface Scenario {
  id: string;
  title: string;
  difficulty: ScenarioDifficulty;
  /** Minutes on the clock. Students may stay longer; scoring snapshots here. */
  durationMinutes: number;
  situation: string;
  events: ScenarioEvent[];
  actions: ScenarioAction[];
  /** Seats this scenario actually needs filled. */
  roles: SocRoleId[];
}

/**
 * A student's claim on one event. `atSeconds` is recorded server-side.
 *
 * WHY THE DISPOSITION IS A FIELD AND NOT READ OUT OF THE PROSE
 *
 * The first version of the scorer inferred what the student had concluded by
 * keyword-matching their justification, and it got both directions wrong in
 * testing: "sixty-two failures, brute force" contains no threat word, and
 * "this is not a threat" contains one. Free text can be assessed for whether
 * the reasoning covers the right ideas. It cannot be trusted to say what the
 * conclusion was. So the conclusion is structured and the prose is graded as
 * prose.
 */
export interface Claim {
  eventId: string;
  role: SocRoleId;
  /** What the student decided to do with it. */
  disposition: TriageDecision;
  /** Why, in their own words. Graded for reasoning, never parsed for a verdict. */
  reasoning: string;
  actionIds: string[];
  escalateTo: SocRoleId | null;
  /** 0 to 100. Being confidently wrong is scored harder than being unsure. */
  confidence: number;
  atSeconds: number;
}

/** One scored dimension, with the reason attached so a number is never bare. */
export interface ClaimScoreLine {
  label: string;
  points: number;
  outOf: number;
  notes: string[];
}

export interface ClaimScore {
  eventId: string;
  role: SocRoleId;
  /** Accuracy, role discipline, timing, escalation. */
  lines: ClaimScoreLine[];
  total: number;
  outOf: number;
  /** Set when the seat claimed something another seat should have taken first. */
  laneViolation: SocRoleId | null;
  /** Released only once the claim is committed. */
  why: string;
}

/** How long a role may sit on an event before timing points start to go. */
export const CLAIM_GRACE_SECONDS = 90;
/** Past this, the queue has outrun them and timing scores zero. */
export const CLAIM_LATE_SECONDS = 420;
