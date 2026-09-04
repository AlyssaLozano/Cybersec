/**
 * The Stage: a professional signs up to present a topic to the lobby.
 *
 * Shaped after ChatRoom's request/review pair in lobby.ts -- same "pending
 * until a reviewer decides" flow -- but the reviewer here is always the
 * superadmin, never an instructor/admin: what gets presented to the whole
 * lobby is reserved to that one role.
 *
 * There is no live video/streaming built into this platform yet. A talk
 * carries a plain `meetingLink` the presenter supplies themselves (Zoom,
 * Meet, whatever they use). Auto-creating a Zoom meeting is future work --
 * see generateMeetingLink in the server's services/stage.ts for the seam.
 */
import type { FloorIdentity } from './rooms.js';

export const STAGE_TALK_STATUSES = ['pending', 'approved', 'rejected', 'cancelled'] as const;
export type StageTalkStatus = (typeof STAGE_TALK_STATUSES)[number];

export interface StageTalk {
  id: string;
  presenter: FloorIdentity;
  title: string;
  topic: string;
  description: string;
  /** ISO 8601. When the presenter proposes to go live. */
  proposedStartsAt: string;
  durationMinutes: number;
  /** Presenter-supplied for now. Null until they add one. */
  meetingLink: string | null;
  status: StageTalkStatus;
  /** ISO 8601, set once reviewed. Null while pending. */
  reviewedAt: string | null;
  /** Shown to the presenter on a rejection, so a no comes with a reason. */
  reviewNote: string | null;
  /** ISO 8601. */
  createdAt: string;
  /** Whether the viewer is the presenter, so the client can offer cancel. */
  mine: boolean;
}

export interface ProposeStageTalkRequest {
  title: string;
  topic: string;
  description: string;
  proposedStartsAt: string;
  durationMinutes: number;
  meetingLink?: string | null;
}

export const STAGE_TITLE_MAX = 80;
export const STAGE_TOPIC_MAX = 120;
export const STAGE_DESCRIPTION_MIN = 40;
export const STAGE_DESCRIPTION_MAX = 1000;
export const STAGE_DURATION_MIN_MINUTES = 15;
export const STAGE_DURATION_MAX_MINUTES = 180;

export interface StageCheck {
  ok: boolean;
  /** Written to be shown to the person, so it says how to fix it. */
  problem: string | null;
}

/**
 * Validated on the server; mirrored here for instant client feedback. Worked
 * example below teaches the shape against a different topic than any real
 * exercise, same rule content authoring already follows for `teach` text.
 *
 * A talk about, say, "Reading a Suricata alert queue without panicking" is
 * the kind of thing this should accept; "Cybersecurity" alone should not.
 */
export function checkStageTalkRequest(input: {
  title: string;
  topic: string;
  description: string;
  proposedStartsAt: string;
  durationMinutes: number;
}): StageCheck {
  const title = input.title.trim();
  const topic = input.topic.trim();
  const description = input.description.trim();

  if (title.length < 3) return { ok: false, problem: 'Give the talk a title, at least 3 characters.' };
  if (title.length > STAGE_TITLE_MAX) {
    return { ok: false, problem: `Titles are at most ${STAGE_TITLE_MAX} characters.` };
  }
  if (topic.length < 3) return { ok: false, problem: 'Say what the topic is, at least 3 characters.' };
  if (topic.length > STAGE_TOPIC_MAX) {
    return { ok: false, problem: `Keep the topic under ${STAGE_TOPIC_MAX} characters.` };
  }
  if (description.length < STAGE_DESCRIPTION_MIN) {
    return {
      ok: false,
      problem: `Say what you will cover in at least ${STAGE_DESCRIPTION_MIN} characters. This is what gets it approved.`,
    };
  }
  if (description.length > STAGE_DESCRIPTION_MAX) {
    return { ok: false, problem: `Keep the description under ${STAGE_DESCRIPTION_MAX} characters.` };
  }

  const startsAt = new Date(input.proposedStartsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return { ok: false, problem: 'That start time did not parse.' };
  }
  if (startsAt.getTime() <= Date.now()) {
    return { ok: false, problem: 'Propose a time in the future.' };
  }

  if (
    !Number.isInteger(input.durationMinutes) ||
    input.durationMinutes < STAGE_DURATION_MIN_MINUTES ||
    input.durationMinutes > STAGE_DURATION_MAX_MINUTES
  ) {
    return {
      ok: false,
      problem: `Duration must be between ${STAGE_DURATION_MIN_MINUTES} and ${STAGE_DURATION_MAX_MINUTES} minutes.`,
    };
  }

  return { ok: true, problem: null };
}
