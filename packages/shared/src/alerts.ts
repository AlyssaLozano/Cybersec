/**
 * The alert queue model, for the SOC Operator role.
 *
 * WHY THIS IS A SEPARATE SURFACE AND NOT MORE TERMINAL EXERCISES
 *
 * Linux Fundamentals and Log Analysis teach a student to find a thing in a log. Triage is a
 * different skill and grading it as a command would test the wrong one. The
 * question here is never "can you locate this alert": the alert is already in
 * front of you, formatted, with its severity asserted by a rule that has been
 * wrong before. The question is what you do about it, and whether you can
 * justify that when the queue is three hundred deep and eight of them matter.
 *
 * So the answer a student submits is a set of DECISIONS, and the grading is
 * done on precision and recall against ground truth rather than on string
 * matching.
 *
 * THE GROUND TRUTH NEVER SHIPS
 *
 * `AlertTruth` is the answer key. It carries the real verdict for every alert
 * and it must never reach the browser, for exactly the reason `checks` and
 * `solution` must never reach the browser: a student who can read it can clear
 * a queue perfectly without looking at a single alert. `toStudentAlert()` is
 * the one function permitted to cross that boundary, and it is the alert-queue
 * equivalent of `toStudentView()` in the content catalogue.
 */

/** Severity as asserted by the rule that fired, not necessarily the truth. */
export const ALERT_SEVERITIES = ['critical', 'high', 'medium', 'low', 'info'] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

/** The system that raised the alert. */
export const ALERT_SOURCES = [
  'ids',
  'edr',
  'siem-rule',
  'auth-monitor',
  'proxy',
  'dlp',
  'cloud-audit',
  'av',
] as const;
export type AlertSource = (typeof ALERT_SOURCES)[number];

/**
 * What a student can do with an alert.
 *
 * Four options rather than two, because the real decision space is not just
 * "real or not". `tune` exists because an alert that is correct but useless
 * (firing fifty times a day for a backup job) is a defect in the rule, and
 * closing those one at a time forever is how a queue becomes unworkable.
 */
export const TRIAGE_DECISIONS = ['escalate', 'investigate', 'dismiss', 'tune'] as const;
export type TriageDecision = (typeof TRIAGE_DECISIONS)[number];

/**
 * Why an alert is what it is.
 *
 * `benign_true_positive` is the category most training material omits and most
 * of a real queue consists of: the rule fired correctly, the activity genuinely
 * happened, and it was an administrator doing their job. Collapsing it into
 * "false positive" teaches students to distrust working rules.
 */
export const ALERT_VERDICTS = ['true_positive', 'benign_true_positive', 'false_positive'] as const;
export type AlertVerdict = (typeof ALERT_VERDICTS)[number];

export interface AlertEndpoint {
  ip: string;
  /** Resolved hostname, when the sensor knew one. */
  host?: string;
  port?: number;
  /** Account associated with the activity, when the sensor knew one. */
  user?: string;
}

/**
 * Enrichment the operator's "quick lookup" panel shows.
 *
 * `priorFirings` and `priorFalsePositives` are the two numbers that most change
 * a triage decision in real life, and the two most often missing from training
 * simulations. A rule that has fired 412 times and been wrong 411 times should
 * be read very differently from one firing for the first time.
 */
export interface AlertEnrichment {
  /** How many times this rule fired in the preceding 30 days. */
  priorFirings: number;
  /** How many of those were closed as not worth acting on. */
  priorFalsePositives: number;
  /** Reputation verdict for the external address, when there is one. */
  reputation?: 'known-malicious' | 'suspicious' | 'unknown' | 'known-good';
  /** Free-text note from the reputation source. */
  reputationNote?: string;
  /** Whether the destination appears on the organisation's egress allowlist. */
  allowlisted?: boolean;
}

/** One alert, as the student sees it. */
export interface Alert {
  /** Stable id, e.g. "A-5042". */
  id: string;
  /** ISO 8601, when the alert was raised. */
  raisedAt: string;
  source: AlertSource;
  /** Rule identifier, e.g. "auth-brute-force-threshold". */
  ruleId: string;
  ruleName: string;
  /** Severity the rule asserted. Frequently wrong, deliberately. */
  severity: AlertSeverity;
  /** The rule's own confidence, 0-100. Also frequently wrong. */
  confidence: number;
  from: AlertEndpoint;
  to?: AlertEndpoint;
  /** One line, as it appears in the queue. */
  summary: string;
  /** The detail pane: what the sensor actually observed. */
  detail: string;
  enrichment: AlertEnrichment;
}

/**
 * The answer key for one alert. Server-side only.
 *
 * Never add this to any type that crosses the API boundary. It is kept in a
 * separate structure rather than as an optional field on `Alert` precisely so
 * that forgetting to strip it is a compile error rather than a silent leak.
 */
export interface AlertTruth {
  alertId: string;
  verdict: AlertVerdict;
  /** The correct disposition for this alert. */
  correctDecision: TriageDecision;
  /** Incident this alert belongs to, when it is part of one. */
  incidentId?: string;
  /** Explanation shown in the debrief, after the student has committed. */
  why: string;
}

/** A student's disposition of a single alert. */
export interface TriageEntry {
  alertId: string;
  decision: TriageDecision;
  /** Free text, required by exercises that grade reasoning rather than choice. */
  justification?: string;
}

/** What the client submits for an alert-triage exercise. */
export interface TriageSubmission {
  entries: TriageEntry[];
}

/**
 * How a submission scored, per decision.
 *
 * Precision and recall are reported separately and never averaged into one
 * number. They fail in opposite directions and a student needs to know which
 * they did: escalating everything gives perfect recall and is worthless, and it
 * is the single most common failure mode in a real SOC.
 */
export interface TriageScore {
  decision: TriageDecision;
  /** Alerts the student assigned this decision. */
  selected: number;
  /** Alerts that genuinely warranted it. */
  expected: number;
  /** Correctly assigned. */
  correct: number;
  /** correct / selected, or 1 when nothing was selected. */
  precision: number;
  /** correct / expected, or 1 when nothing was expected. */
  recall: number;
}

/**
 * A queue of alerts belonging to one exercise.
 *
 * The corpus is generated from a fixed seed and committed, for the same reason
 * the log files are: exercise answers are computed from it, so it must not
 * change unless somebody intends it to.
 */
export interface AlertQueue {
  id: string;
  title: string;
  /** What the student is told about the window before they start. */
  briefing: string;
  alerts: Alert[];
}

/**
 * The student-facing view of an alert.
 *
 * Everything on `Alert` is safe to ship: it is what an operator would see in a
 * real console. The answer key lives in `AlertTruth`, which is a different type
 * and is never assembled into the response. This function exists so that the
 * boundary is a named, greppable thing rather than an assumption.
 */
export function toStudentAlert(alert: Alert): Alert {
  return alert;
}

/** Score one decision class of a submission against ground truth. */
export function scoreTriage(
  entries: TriageEntry[],
  truth: AlertTruth[],
  decision: TriageDecision,
): TriageScore {
  const truthById = new Map(truth.map((item) => [item.alertId, item]));

  const selected = entries.filter((entry) => entry.decision === decision);
  const expected = truth.filter((item) => item.correctDecision === decision);
  const correct = selected.filter(
    (entry) => truthById.get(entry.alertId)?.correctDecision === decision,
  );

  return {
    decision,
    selected: selected.length,
    expected: expected.length,
    correct: correct.length,
    precision: selected.length === 0 ? 1 : correct.length / selected.length,
    recall: expected.length === 0 ? 1 : correct.length / expected.length,
  };
}
