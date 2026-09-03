/**
 * Career routing: the assessment, the learner profile, tracks, and certifications.
 *
 * WHY THIS EXISTS
 *
 * Someone entering security from another career does not know what the jobs are.
 * "SOC Analyst" and "GRC Analyst" are meaningless labels until somebody explains
 * that one means watching alerts on a rota and the other means writing policy and
 * arguing with auditors. Dropping that person straight into a Linux terminal is a
 * good way to lose someone who would have been excellent at risk work.
 *
 * So the assessment asks about WORK, not job titles: what they enjoy, what they
 * can tolerate, what they already bring. The scoring maps those answers onto
 * tracks, and the profile they build along the way changes what we recommend.
 *
 * WHY THE SECTOR QUESTIONS MATTER
 *
 * Private versus government, large versus small, federal versus local: none of
 * these change how `grep` works. They change which job exists, which
 * certification is mandatory rather than nice to have, and how the work feels
 * day to day. Federal defence work has a mandated certification baseline and a
 * clearance process measured in months. A two-person team at a small company
 * needs a generalist. Those are different careers, and pretending otherwise
 * would waste somebody's year.
 */

// --- profile -----------------------------------------------------------------

export const SECTORS = ['private', 'government', 'either'] as const;
export type Sector = (typeof SECTORS)[number];

export const ORG_SIZES = ['small', 'large', 'either'] as const;
export type OrgSize = (typeof ORG_SIZES)[number];

/** Only meaningful when sector is 'government'. */
export const GOV_LEVELS = ['federal', 'state_local', 'either', 'not_applicable'] as const;
export type GovLevel = (typeof GOV_LEVELS)[number];

/** Clearance eligibility gates a large share of federal security work. */
export const CLEARANCE_STATUSES = ['holds', 'eligible', 'unsure', 'not_eligible'] as const;
export type ClearanceStatus = (typeof CLEARANCE_STATUSES)[number];

/**
 * What a learner has told us about themselves.
 *
 * Every field is optional because the assessment can be abandoned halfway and
 * the profile is still worth keeping.
 */
export interface LearnerProfile {
  sector?: Sector;
  orgSize?: OrgSize;
  govLevel?: GovLevel;
  clearance?: ClearanceStatus;
  /** Background they arrive with, which shapes which foundations they can skip. */
  background?: BackgroundKind;
  /** The track they actually chose, which may differ from what we recommended. */
  chosenTrackId?: string;
  /** ISO 8601, set when the assessment was last completed. */
  assessedAt?: string;
}

export const BACKGROUND_KINDS = [
  'it_support',
  'software',
  'military',
  'compliance_legal',
  'finance',
  'healthcare',
  'education',
  'trades_other',
  'none',
] as const;
export type BackgroundKind = (typeof BACKGROUND_KINDS)[number];

// --- assessment ------------------------------------------------------------
//
// The assessment instrument moved to assessment.ts when it grew from a dozen
// routing questions into a 68-item scored analyzer. LearnerProfile below is
// still the durable record of what somebody told us about themselves.

// --- certifications ----------------------------------------------------------

/** Where a certification sits in someone's progression. */
export const CERT_STAGES = ['entry', 'core', 'advanced'] as const;
export type CertStage = (typeof CERT_STAGES)[number];

export interface Certification {
  id: string;
  name: string;
  /** Issuing body, e.g. "CompTIA", "ISC2", "Offensive Security". */
  issuer: string;
  stage: CertStage;
  /** One or two sentences: what it proves and who asks for it. */
  summary: string;
  /** Rough cost in USD for the exam itself, excluding training. */
  approxCostUsd: number;
  /** Realistic study time for someone new to the field. */
  typicalStudyWeeks: number;
  /** True when some employer or regulation genuinely mandates it. */
  mandatedSomewhere?: boolean;
  /** Notes on where it is mandated, e.g. DoD 8140 baseline roles. */
  mandateNote?: string;
  /** Certifications worth holding first. */
  prerequisites?: string[];
  /** Official reference, for people who want the authoritative page. */
  url?: string;
}

/**
 * The paid study aid that sits beside a track's certification list.
 *
 * Modelled rather than hardcoded in the UI because it is a price with a
 * justification attached, and because it is not built yet: `status` is what
 * stops the interface from implying a student can buy it today. See
 * `content/pricing.ts` on the server for the values and the reasoning.
 */
export interface CertStudyOffer {
  status: 'coming-soon' | 'available';
  /** One line, shown at the end of a track. */
  headline: string;
  /** USD, per certification, for one access window. */
  amountUsd: number;
  /** Length of that window in days. */
  windowDays: number;
  /** What the window would buy. */
  includes: string[];
  /** What it would not, stated before anybody asks. */
  excludes: string[];
  /** Why it costs this, in the student's words rather than ours. */
  rationale: string;
}

/** A certification recommendation, contextualised by the learner's profile. */
export interface CertRecommendation {
  certId: string;
  /** Why this one, for this person, given their sector and stage. */
  reason: string;
  /** 'start_here' | 'next' | 'later': sequencing guidance. */
  timing: 'start_here' | 'next' | 'later';
}

// --- foundations and tracks --------------------------------------------------

/**
 * A foundational skill area, which may or may not be built yet.
 *
 * Foundations are shared across tracks and required conditionally: a SOC analyst
 * needs Linux, a risk analyst does not. This is the mechanism that stops the
 * curriculum being one long line everybody has to walk.
 */
export interface Foundation {
  id: string;
  title: string;
  summary: string;
  /** Set when a playable package implements this foundation. */
  packageId?: string;
  /** Rough size when written, for the outline view. */
  plannedExercises?: number;
  /** Tool mapping ids this foundation teaches against. */
  tools?: string[];
}

/**
 * An open-source tool we teach, mapped to the commercial tools it stands in for.
 *
 * WHY TEACH THE OPEN-SOURCE ONE
 *
 * Three reasons, and only one of them is licensing. First, we cannot legally
 * ship Splunk or Nessus inside a training platform. Second, a student who has to
 * buy a licence to practise will not practise. Third, and most important: the
 * transferable thing is the SKILL, not the button layout. Someone who can write a
 * search that isolates failed logins by source address has learned the job;
 * whether they type it in SPL, KQL, or Lucene is a dialect they pick up in a week.
 *
 * What this mapping must never do is imply the open-source tool IS the commercial
 * one, or that learning the commercial tool is unnecessary. Job adverts name
 * products. Knowing the product name, and having touched it even in a free tier,
 * is worth real money at interview -- so every mapping says so plainly.
 */
export interface ToolMapping {
  id: string;
  /** The open-source tool the platform teaches on. */
  teaches: string;
  /** Why this one is a fair stand-in. */
  teachesNote: string;
  /** Commercial or industry-standard tools this skill transfers to. */
  industryTools: string[];
  /** The underlying capability, stated so it survives any tool change. */
  skill: string;
  /**
   * What genuinely differs in the commercial tool, stated honestly so nobody is
   * surprised on day one of the job.
   */
  differences: string;
  /** How to get hands on the real thing for free, where that is possible. */
  freeAccessNote?: string;
}

export const TRACK_STATUSES = ['available', 'in_development', 'planned'] as const;
export type TrackStatus = (typeof TRACK_STATUSES)[number];

export interface TrackStage {
  title: string;
  summary: string;
  /** Set only when the package exists and is playable. */
  packageId?: string;
  plannedExercises?: number;
  /**
   * Marks this stage as the track's capstone: a self-directed real-world
   * project, specced in content/capstones.ts and keyed by track id, rather
   * than a graded package. Never set alongside packageId.
   */
  capstoneTrack?: boolean;
}

// --- capstone (the GitHub Lab) ------------------------------------------------

export const CAPSTONE_DIFFICULTIES = ['accessible', 'moderate', 'hard'] as const;
export type CapstoneDifficulty = (typeof CAPSTONE_DIFFICULTIES)[number];

/**
 * One project option in a track's capstone menu.
 *
 * This is guidance for real work on infrastructure the student controls, not
 * a graded exercise -- there is no `checks` array because nothing here can be
 * verified server-side without reaching into a real network, which the
 * simulated engine exists specifically to avoid doing.
 */
export interface CapstoneOption {
  id: string;
  title: string;
  /** One line: why an employer looking at this repo would care. */
  pitch: string;
  /** What a good writeup/repo includes, shown as a checklist. */
  deliverables: string[];
  /** Honest range, e.g. "6 to 10 hours". */
  estimatedHours: string;
  difficulty: CapstoneDifficulty;
}

/** One step in the "connect your GitHub" walkthrough shown before the picker. */
export interface CapstoneWalkthroughStep {
  title: string;
  detail: string;
  /** A command to show verbatim, when the step has one. */
  command?: string;
}

export const CAPSTONE_SUBMISSION_STATUSES = ['selected', 'submitted'] as const;
export type CapstoneSubmissionStatus = (typeof CAPSTONE_SUBMISSION_STATUSES)[number];

/** A student's progress against one track's capstone. Self-attested throughout. */
export interface CapstoneState {
  trackId: string;
  optionId: string | null;
  status: CapstoneSubmissionStatus | null;
  repoUrl: string | null;
  summary: string | null;
  selectedAt: string | null;
  submittedAt: string | null;
}

/** One track's capstone submission, resolved with its option and track titles. */
export interface CapstoneSubmissionView extends CapstoneState {
  trackTitle: string;
  optionTitle: string | null;
}

/** How relevant a track is in a given sector, used to tailor the results page. */
export interface SectorNote {
  /** Which slice of the profile this note applies to. */
  when: Partial<LearnerProfile>;
  /** What is different about this track in that world. */
  note: string;
}

export interface Track {
  id: string;
  order: number;
  title: string;
  summary: string;
  /** Who it is for, in plain language. */
  audience: string;
  /** Job titles this prepares someone for. */
  roles: string[];
  /**
   * Foundation ids this track requires before its own material makes sense.
   * THIS is what determines whether a given student needs Linux at all.
   */
  foundations: string[];
  /** The track's own curriculum, after the foundations. */
  curriculum: TrackStage[];
  /** Certifications that matter for this track, in rough order. */
  certifications: string[];
  /** Sector-specific guidance shown when the profile matches. */
  sectorNotes?: SectorNote[];
  status: TrackStatus;
  /** Rough day-to-day feel: is this shift work, project work, or deadline work? */
  workRhythm: string;
  /** Honest note on how hard this is to enter directly from another career. */
  entryDifficulty: 'accessible' | 'moderate' | 'hard';
}

export interface TrackSummary extends Track {
  /**
   * The track's certifications resolved to full records.
   *
   * Carried alongside the `certifications` id list so the end of a track can
   * show cost and study time without a second request. The ids stay: they are
   * the content's source of truth, and this is a convenience for the UI.
   */
  certificationDetail: Certification[];
  exerciseCount: number;
  passedCount: number;
  percentComplete: number;
  /**
   * How much of the track exists today.
   *
   * Reported separately from progress because a track can be 100% complete on
   * the parts that are written while most of it is not, and a single percentage
   * would hide that. Foundations count here too -- after foundations became
   * per-track, most playable content lives there rather than in `curriculum`.
   */
  readiness: {
    foundationsTotal: number;
    foundationsPlayable: number;
    stagesTotal: number;
    stagesPlayable: number;
  };
}
