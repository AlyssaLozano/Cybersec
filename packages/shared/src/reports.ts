/**
 * The report each seat owes at the end of a shift.
 *
 * WHY THE REPORT IS THE ARTEFACT AND THE TALKING IS NOT
 *
 * On a real bridge you write the assessment and then read it out, and people
 * question you on it. The writing is what survives: it goes to the lead, into
 * the incident record, and sometimes to a regulator. The talking is delivery.
 *
 * So the report is persisted and graded, and the voice channel is neither. That
 * also removes the reason not to have voice at all: nothing is recorded, so
 * there is no consent problem and no transcript to secure, and the thing being
 * assessed was written down anyway.
 *
 * WHY THE SECTIONS DIFFER BY ROLE
 *
 * A forensics report and an intel assessment are not the same document, and
 * giving everybody one box labelled "findings" teaches nobody the shape of
 * their own deliverable. Each role writes the sections its job actually
 * produces, with the prompts that keep those sections honest.
 *
 * WHY EVERY TEMPLATE HAS A "WHAT YOU CANNOT SAY" SECTION
 *
 * It is the one section that is the same for everybody, and it is the section
 * most often missing in real reports. An assessment that states only what it
 * found reads as complete, and the reader cannot tell the difference between
 * "we checked and it did not happen" and "we did not check".
 */

import type { SocRoleId } from './roles.js';

export interface ReportSection {
  id: string;
  heading: string;
  /** What this section is for, shown above the box. */
  prompt: string;
  /** Bounds, for the same reason answers are bounded: an essay is not better. */
  minChars: number;
  maxChars: number;
  /** Groups of synonyms, all of which must be hit. Never shown to the writer. */
  rubric?: string[][];
}

export interface ReportTemplate {
  role: SocRoleId;
  title: string;
  /** One line on who reads this and what they do with it. */
  audience: string;
  sections: ReportSection[];
}

export interface ReportDraft {
  scenarioId: string;
  role: SocRoleId;
  /** Section id to text. */
  sections: Record<string, string>;
  submittedAt: number | null;
}

/** One section, marked. */
export interface SectionScore {
  sectionId: string;
  heading: string;
  /** Whether it is long enough to assess at all. */
  withinBounds: boolean;
  /** Per-concept, so a writer sees which idea is missing rather than a number. */
  concepts: Array<{ accepted: string[]; hit: boolean }>;
  notes: string[];
}

export interface ReportScore {
  role: SocRoleId;
  sections: SectionScore[];
  /** Sections left empty. Named, because an unwritten section is a decision. */
  omitted: string[];
  /** Reported, never scored: whether the lead actually engaged with it. */
  leadEngaged: boolean;
}

/**
 * The lead reading somebody's report.
 *
 * Recorded because "the lead heard it" and "the lead did something with it" are
 * different, and a floor where reports go into a void teaches people that
 * writing them is ceremony. The lead must either accept a report, ask it a
 * question, or say what they are doing differently because of it.
 */
export const LEAD_RESPONSES = ['accepted', 'questioned', 'acted-on'] as const;
export type LeadResponse = (typeof LEAD_RESPONSES)[number];

export interface LeadEngagement {
  role: SocRoleId;
  response: LeadResponse;
  /** Required for `questioned` and `acted-on`. An accepted report needs no words. */
  note: string;
  at: number;
}

/**
 * Voice, as a capability rather than a feature.
 *
 * Permission-based, ephemeral, and never part of the record. Declared here so
 * the client and the server agree that no path stores audio: there is no field
 * on any type that could hold it.
 */
export interface VoiceState {
  /** The browser has granted microphone access. */
  granted: boolean;
  /** They are transmitting right now. Push to talk, so silence is the default. */
  transmitting: boolean;
  /** Who else is audible. Presence only; no audio ever reaches the server. */
  audible: SocRoleId[];
}
