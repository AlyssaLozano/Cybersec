/**
 * Incident response: decision points, consequences, and evidence handling.
 *
 * WHY THIS IS A THIRD KIND OF ANSWER
 *
 * The terminal grades what a command left behind. Triage grades a set of
 * dispositions against ground truth. Neither fits the question this package
 * asks, which is: given six-tenths of the picture and a clock running, what do
 * you do, and can you defend it afterwards.
 *
 * A decision point is therefore not a quiz. Every option is something a real
 * responder has actually done, several are defensible, and the ones that are
 * wrong are wrong for reasons a student can only see AFTER committing — which is
 * exactly the position they will be in at 02:00. Consequences are revealed on
 * submission, never before.
 *
 * ORDERING IS A FIRST-CLASS ANSWER
 *
 * Half of forensics is sequence rather than choice. Memory before disk, hash
 * before touch, isolate before you reboot. Getting the same five steps in the
 * wrong order destroys evidence just as thoroughly as skipping them, so
 * `DecisionSubmission` carries an ordering and `decision-orders` grades it.
 *
 * THE ANSWER KEY DOES NOT SHIP
 *
 * `DecisionOption.consequence` and `DecisionOption.quality` are the answer.
 * `toStudentDecisionPoint()` is the one function permitted to build the client's
 * view, and it strips both — the same boundary `toStudentView()` enforces for
 * exercises and `queueForStudent()` enforces for alerts.
 */

/**
 * How good an option is.
 *
 * Three grades rather than right/wrong, because incident response rarely offers
 * a clean answer. `defensible` matters most: it is the option a competent
 * responder might reasonably pick, that costs something. A student who learns
 * only "correct vs incorrect" will freeze the first time both available choices
 * are bad, which is most real incidents.
 */
export const DECISION_QUALITIES = ['sound', 'defensible', 'harmful'] as const;
export type DecisionQuality = (typeof DECISION_QUALITIES)[number];

export interface DecisionOption {
  id: string;
  /** The action, as a responder would phrase it. */
  label: string;
  /** What taking this option actually involves. Safe to ship. */
  detail?: string;
  /**
   * What happens if you choose this. ANSWER KEY — never shipped before commit.
   */
  consequence: string;
  /** ANSWER KEY — never shipped before commit. */
  quality: DecisionQuality;
}

/**
 * What the responder knows at this moment.
 *
 * Deliberately incomplete. Each field that is absent is absent because nobody
 * has established it yet, and part of the exercise is noticing which decisions
 * are being made without it.
 */
export interface IncidentSnapshot {
  incidentId: string;
  /** Where the clock is, e.g. "11:42, thirty-six minutes after the archive was staged". */
  asOf: string;
  /** Systems known to be involved. */
  systems: Array<{ host: string; role: string; state: string }>;
  /** What has been established, each traceable to evidence. */
  known: string[];
  /** What has NOT been established. The most important field here. */
  unknown: string[];
  /** Regulatory or business pressure bearing on the decision. */
  pressures?: string[];
}

export interface DecisionPoint {
  id: string;
  title: string;
  /** The situation, in the present tense. */
  situation: string;
  snapshot: IncidentSnapshot;
  options: DecisionOption[];
  /**
   * When set, the answer is an ORDER over these option ids rather than a
   * selection. Used for sequence-critical work such as evidence collection.
   */
  ordered?: boolean;
}

/** What the client submits for an incident-decision exercise. */
export interface DecisionSubmission {
  /** Options chosen, for a selection decision. */
  optionIds?: string[];
  /** Option ids in the order the student would perform them. */
  ordering?: string[];
  /** Free text, for decisions that grade reasoning rather than choice. */
  justification?: string;
}

/** An option as the student sees it: no consequence, no quality. */
export interface StudentDecisionOption {
  id: string;
  label: string;
  detail?: string;
}

export interface StudentDecisionPoint {
  id: string;
  title: string;
  situation: string;
  snapshot: IncidentSnapshot;
  options: StudentDecisionOption[];
  ordered?: boolean;
}

/**
 * The student-facing view of a decision point.
 *
 * Exists so the boundary is a named, greppable thing rather than an assumption.
 * Returning `DecisionPoint` directly would ship `consequence` and `quality`,
 * which between them are the entire answer.
 */
export function toStudentDecisionPoint(point: DecisionPoint): StudentDecisionPoint {
  return {
    id: point.id,
    title: point.title,
    situation: point.situation,
    snapshot: point.snapshot,
    options: point.options.map((option) => ({
      id: option.id,
      label: option.label,
      ...(option.detail ? { detail: option.detail } : {}),
    })),
    ...(point.ordered ? { ordered: point.ordered } : {}),
  };
}

/** The consequence of every option, released only after the student commits. */
export interface DecisionOutcome {
  optionId: string;
  label: string;
  quality: DecisionQuality;
  consequence: string;
  /** True when the student picked this one. */
  chosen: boolean;
}

export function outcomesFor(point: DecisionPoint, chosenIds: string[]): DecisionOutcome[] {
  const chosen = new Set(chosenIds);
  return point.options.map((option) => ({
    optionId: option.id,
    label: option.label,
    quality: option.quality,
    consequence: option.consequence,
    chosen: chosen.has(option.id),
  }));
}

/**
 * How far an ordering is from the intended one.
 *
 * Counts positions that are out of place rather than requiring an exact match,
 * so that transposing two steps that do not interact is not scored the same as
 * imaging a disk before capturing memory. The grading check decides how many
 * displacements it will tolerate.
 */
export function orderingDisplacement(submitted: string[], expected: string[]): number {
  const position = new Map(expected.map((id, index) => [id, index]));
  let wrong = 0;
  for (let index = 0; index < submitted.length; index += 1) {
    const intended = position.get(submitted[index]!);
    if (intended === undefined || intended !== index) wrong += 1;
  }
  // Anything the student left out is also a displacement, or an incomplete
  // ordering would score better than a wrong one.
  wrong += Math.max(0, expected.length - submitted.length);
  return wrong;
}
