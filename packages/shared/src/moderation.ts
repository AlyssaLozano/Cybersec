/**
 * Reporting somebody in a war room, and what the system does about it.
 *
 * WHY THIS IS NOT A SIMPLE COUNTER
 *
 * A report button that ejects on N clicks is a weapon. Three people who know
 * each other can clear a stranger out of any room they like, and the person
 * removed has no idea why. Every rule below exists to make that harder without
 * making a genuine report slow.
 *
 * The unit is DISTINCT REPORTERS, never reports. One person may report one
 * other person once per room, and clicking again changes nothing.
 *
 * A reporter has to be in the room. Somebody who is not sitting in it has not
 * seen anything, and letting outsiders pile on is how a grudge from one room
 * follows a person into the next.
 *
 * The threshold scales with how many people are actually present, so a room of
 * three cannot be a majority of one, and a room of two cannot eject at all.
 * With one other person in the room the answer is to leave, not to vote.
 *
 * WHY EJECTION IS THE UNIT OF ACCOUNT-LEVEL ACTION
 *
 * Suspension counts ejections, not reports. An ejection already means several
 * unconnected people in one room agreed at the same time, which is a far
 * better signal than a raw total that one determined person can run up alone.
 *
 * WHAT IS DELIBERATELY NOT AUTOMATED
 *
 * Nothing here touches the learning platform. Somebody who was unpleasant in a
 * room at nine o'clock keeps their coursework, their progress and their
 * portfolio: those were earned, and taking them is a punishment nobody asked
 * for that also destroys the reason they might come back and behave.
 *
 * And every automatic action is provisional. Staff can dismiss the reports
 * behind it, which reverses it. The automation exists to make a room usable in
 * the next sixty seconds, not to decide anything permanently.
 */

/**
 * Where a report came from.
 *
 * Every shared space has to be covered or the rule has a hole in it, and the
 * hole is always the space somebody moves to once they are ejected from the
 * first one.
 */
export const REPORT_SPACES = ['soc-floor', 'redblue', 'lobby'] as const;
export type ReportSpace = (typeof REPORT_SPACES)[number];

export interface ReportReasonDefinition {
  id: string;
  /** What the reporter picks. Written as the thing that happened, not a policy term. */
  label: string;
  /** Shown under the label so the categories are told apart in a hurry. */
  detail: string;
  /**
   * True for categories where waiting for a second reporter is not acceptable.
   *
   * These still need the normal threshold to eject, because one person must
   * never be able to remove another on their own say-so. What they change is
   * that the report reaches staff immediately rather than sitting in a total.
   */
  escalatesImmediately: boolean;
}

export const REPORT_REASONS: ReportReasonDefinition[] = [
  {
    id: 'harassment',
    label: 'Targeting or harassing somebody',
    detail: 'Personal attacks, following somebody between rooms, or refusing to leave them alone.',
    escalatesImmediately: true,
  },
  {
    id: 'hate',
    label: 'Slurs or hate speech',
    detail: 'Abuse aimed at who somebody is rather than at anything they did.',
    escalatesImmediately: true,
  },
  {
    id: 'sexual',
    label: 'Sexual content or unwanted advances',
    detail: 'Sexual material, or approaches that continued after being told to stop.',
    escalatesImmediately: true,
  },
  {
    id: 'threats',
    label: 'Threats',
    detail: 'Threatening harm, or claiming to hold somebody personal details.',
    escalatesImmediately: true,
  },
  {
    id: 'disruption',
    label: 'Deliberately wrecking the session',
    detail: 'Spam on the bridge, false claims to run the clock down, or holding a seat to stop it running.',
    escalatesImmediately: false,
  },
  {
    id: 'impersonation',
    label: 'Pretending to be staff or somebody else',
    detail: 'Claiming to be an instructor, an administrator, or another person on the floor.',
    escalatesImmediately: false,
  },
  {
    id: 'answers',
    label: 'Handing out answers',
    detail: 'Posting the answer key, or pasting the review from a previous run of this scenario.',
    escalatesImmediately: false,
  },
  {
    id: 'other',
    label: 'Something else',
    detail: 'Say what happened in your own words. A person reads this one.',
    escalatesImmediately: false,
  },
];

export const REPORT_REASON_IDS = REPORT_REASONS.map((r) => r.id);
export type ReportReasonId = string;

export function reportReason(id: string): ReportReasonDefinition | null {
  return REPORT_REASONS.find((r) => r.id === id) ?? null;
}

/** "open" until somebody reads it. Automatic action never sets these. */
export const REPORT_OUTCOMES = ['open', 'upheld', 'dismissed'] as const;
export type ReportOutcome = (typeof REPORT_OUTCOMES)[number];

/**
 * What the system captured by itself at the moment the button was pressed.
 *
 * WHY THIS IS RECORDED RATHER THAN LOOKED UP LATER
 *
 * Everything a reviewer would want is ephemeral. The seats change, the room
 * closes, the shift ends and the board is rebuilt from the scenario. A report
 * read three days later against a finished room shows an empty floor and a
 * sentence of free text, which is not enough to act on and not enough to
 * dismiss either.
 *
 * The reporter is not asked to assemble any of this. Somebody being harassed
 * is the last person who should be collecting evidence, and a form that
 * demands it gets abandoned halfway.
 */
export interface ReportContext {
  /** Scenario or match the room was running, so a reviewer can see the room. */
  subjectRef: string;
  /** The seat the reported person held, or null in a space without seats. */
  subjectSeat: string | null;
  /** Their call sign at the time. Call signs can be changed afterwards. */
  subjectCallSign: string;
  /** The reporter's seat, so a reviewer can see who was watching what. */
  reporterSeat: string | null;
  /** Seconds into the shift, or null if it had not started. */
  atSeconds: number | null;
  /**
   * The last few things the reported person did or said, newest last.
   *
   * Bounded on purpose. A full transcript is a privacy problem of its own and
   * nobody reads it; what settles almost every report is the handful of lines
   * either side of the moment somebody reached for the button.
   */
  recent: string[];
  /** How many people were in the room. The threshold is derived from this. */
  occupants: number;
}

export const RECENT_CONTEXT_LINES = 12;

export interface ConductReport {
  id: string;
  space: ReportSpace;
  roomId: string;
  reporterUserId: string;
  subjectUserId: string;
  reason: ReportReasonId;
  /** The reporter's own words. May be empty for the specific categories. */
  note: string;
  context: ReportContext;
  outcome: ReportOutcome;
  createdAt: string;
}

export const REPORT_NOTE_MAX = 1000;

/* -- thresholds --------------------------------------------------------- */

/**
 * How many DIFFERENT people have to report somebody before the room removes
 * them.
 *
 * Three, except in rooms too small for three to mean anything. In a room of
 * four or more, three separate people is a clear signal and still leaves the
 * majority of a full floor uninvolved. Below that the number has to come down
 * or it can never be reached, and it must never come down to one.
 *
 * A room of two returns 2, which cannot be reached, because only one other
 * person is there to press it. That is the intended answer: with one other
 * person in the room, leaving is the remedy, and handing either of them a
 * button that removes the other is worse than having no button.
 */
export const EJECTION_REPORTERS = 3;
export const EJECTION_REPORTERS_MIN = 2;

export function ejectionThreshold(occupants: number): number {
  return Math.min(EJECTION_REPORTERS, Math.max(EJECTION_REPORTERS_MIN, occupants - 1));
}

/**
 * Ejections, in a rolling window, that suspend an account from war rooms.
 *
 * Two, because one is a bad hour. People have them, including people who will
 * be good at this job, and an account-level consequence for a single room is
 * how you lose somebody permanently over something they would not have done
 * twice. Two separate rooms of strangers reaching the same conclusion is a
 * pattern rather than a night.
 */
export const SUSPEND_AFTER_EJECTIONS = 2;
export const SUSPENSION_DAYS = 14;

/**
 * Ejections that stop war room access indefinitely, pending a person reading
 * the file.
 *
 * Indefinite rather than permanent, and the distinction is the point: the
 * account keeps the whole learning platform, and a reviewer can lift this.
 * Nothing in this file decides anything permanent by itself.
 */
export const BAN_AFTER_EJECTIONS = 3;

/** The window ejections are counted over. */
export const EJECTION_WINDOW_DAYS = 90;

export type ConductAction = 'none' | 'suspend' | 'ban';

/**
 * What an account has earned, given how many ejections stand against it.
 *
 * Pure, and takes a count rather than a database, so the rule can be read and
 * tested without one.
 */
export function conductAction(ejectionsInWindow: number): ConductAction {
  if (ejectionsInWindow >= BAN_AFTER_EJECTIONS) return 'ban';
  if (ejectionsInWindow >= SUSPEND_AFTER_EJECTIONS) return 'suspend';
  return 'none';
}

/** Whether somebody may enter any shared room right now, and why not. */
export interface RoomAccess {
  allowed: boolean;
  /**
   * Written to the person, and says what it is about and how long.
   *
   * Deliberately does not name who reported them. A person who has just been
   * removed and handed a list of names goes looking for those names.
   */
  problem: string | null;
  /** ISO 8601 when a suspension lifts. Null for an indefinite one. */
  until: string | null;
}

/** What the reporter is told after pressing the button. */
export interface ReportReceipt {
  /** False when the same person had already reported this person here. */
  recorded: boolean;
  /** True when that report was the one that reached the threshold. */
  removedFromRoom: boolean;
  /** Written to the reporter. Never says how many others have reported. */
  message: string;
}
