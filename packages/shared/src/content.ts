/**
 * Content model for learning packages.
 *
 * Exercise content lives in code (not the database) so it is version-controlled,
 * reviewable in pull requests, and type-checked. The database stores only a
 * student's *progress against* these ids.
 *
 * Ids are stable strings ("1.1.3") taken from the source spec. Never renumber an
 * existing id — progress rows reference it. Add new ids instead.
 */

/** How a student answers an exercise, which determines the UI shown. */
export type ExerciseKind = 'terminal' | 'multiple-choice' | 'short-answer';

/**
 * A single pass/fail condition. An exercise passes only when *every* check
 * passes, so each check should test one idea and carry its own hint.
 */
export type Check =
  /** The command the student typed must match. Compared after normalising
   *  whitespace and quote style, so `grep -i "x" f` and `grep -i x f` are equal. */
  | {
      type: 'command-matches';
      /** Any one of these patterns satisfies the check (logical OR). */
      anyOf: string[];
      /** Treat patterns as regular expressions rather than literal strings. */
      regex?: boolean;
      hint: string;
    }
  /** A required flag must be present, in any position or grouping
   *  (`-la`, `-l -a`, and `-al` all contain `-l`). */
  | { type: 'command-has-flag'; command: string; flags: string[]; hint: string }
  /** The command must pipe into another (tests that the student chained tools). */
  | { type: 'command-uses-pipe'; hint: string }
  /** Command output must contain this text. */
  | { type: 'output-contains'; text: string; caseSensitive?: boolean; hint: string }
  /** Command output must NOT contain this text (e.g. filtering worked). */
  | { type: 'output-excludes'; text: string; caseSensitive?: boolean; hint: string }
  /** Command output must match this regular expression. */
  | { type: 'output-matches'; pattern: string; flags?: string; hint: string }
  /** Output must have an exact number of non-empty lines (e.g. `head -n 10`). */
  | { type: 'output-line-count'; count: number; hint: string }
  /** Output must be a single number, optionally within a tolerance band. */
  | { type: 'output-numeric'; equals?: number; min?: number; max?: number; hint: string }
  /** A path must exist (or not) in the student's simulated filesystem. */
  | { type: 'fs-exists'; path: string; exists: boolean; kind?: 'file' | 'dir'; hint: string }
  /** The student's working directory must be this path. */
  | { type: 'cwd-equals'; path: string; hint: string }
  /** Selected option ids must match exactly (order-insensitive). */
  | { type: 'choice-equals'; optionIds: string[]; hint: string }
  /** A free-text answer must mention these concepts. Each entry is a group of
   *  synonyms; the answer must hit at least one synonym from every group. */
  | { type: 'answer-mentions'; conceptGroups: string[][]; hint: string };

export interface ChoiceOption {
  id: string;
  label: string;
}

/** One worked example: a command and what it does, in plain language. */
export interface TeachExample {
  command: string;
  explains: string;
}

/**
 * The teaching material for an exercise, shown BEFORE the student attempts it.
 *
 * The audience holds Security+ but has never used a shell. Expecting them to
 * already know the answer and merely "practise" it would fail them by design, so
 * every exercise teaches the idea first and then asks for it.
 */
export interface Teach {
  /** Two or three sentences on the concept and why an analyst cares. */
  concept: string;
  /** The command's shape, e.g. "grep [OPTIONS] PATTERN FILE". */
  syntax?: string;
  /** Worked examples that are deliberately NOT the exercise's own answer. */
  examples?: TeachExample[];
  /** Flags or arguments worth knowing, as term/definition pairs. */
  flags?: Array<{ flag: string; means: string }>;
}

export interface Exercise {
  /** Stable id from the spec, e.g. "1.4.3". */
  id: string;
  moduleId: string;
  packageId: string;
  /** 1-based position within its module, used for ordering and "next" links. */
  order: number;
  title: string;
  kind: ExerciseKind;
  /** What the student is meant to learn. Shown above the prompt. */
  goal: string;
  /** The instruction shown to the student. */
  prompt: string;
  /** Teaching material, available before the first attempt. */
  teach: Teach;
  /**
   * Nudges of increasing directness, revealed one at a time on request.
   *
   * Ordered from gentlest to most specific, and none of them is the literal
   * answer -- that lives behind an explicit "show me the answer" action, so a
   * student always knows when they have chosen to be told.
   */
  hints: string[];
  /**
   * Commands run silently before the student sees the terminal, to put the
   * session in a known state (e.g. `cd /var/log` for "go up one level").
   */
  setup?: string[];
  /** A worked answer, revealed only after a pass or on explicit request. */
  solution: string;
  /** Plain-English description of correct output, shown alongside the solution. */
  expectedOutput: string;
  /** All must pass for the exercise to be marked passed. */
  checks: Check[];
  /** Options for multiple-choice exercises. */
  options?: ChoiceOption[];
  /** Shown after a pass, to connect the mechanic to real SOC work. */
  debrief?: string;
  /** Optional extra drills on the same skill, offered after a pass. */
  practice: PracticeItem[];
}

/**
 * An extra drill on the same skill as its parent exercise.
 *
 * Practice items are optional, never gate progression, and never appear in the
 * completion percentage. Their job is repetition for anyone who wants it: the
 * skill is identical, only the target changes, so a student who got the parent
 * exercise by luck cannot pass five of these by luck.
 */
export interface PracticeItem {
  /** Stable id, by convention the parent id plus "-p1", "-p2", and so on. */
  id: string;
  prompt: string;
  solution: string;
  /** Commands run before the drill, to set up the state it assumes. */
  setup?: string[];
  checks: Check[];
}

export interface PracticeState {
  practiceId: string;
  passed: boolean;
  attempts: number;
}

export interface LearningModule {
  id: string;
  packageId: string;
  order: number;
  title: string;
  summary: string;
  exercises: Exercise[];
}

export interface LearningPackage {
  id: string;
  order: number;
  title: string;
  summary: string;
  /** What a student should be able to do after finishing. */
  outcomes: string[];
  /** Package ids that must be complete first. Empty means available at once. */
  prerequisites: string[];
  modules: LearningModule[];
}

/*
 * Track, TrackStage, TrackStatus and TrackSummary used to live here. They moved
 * to career.ts when tracks gained foundations, certifications, and sector
 * guidance, so that everything about career routing sits in one module.
 */

/** Package metadata without exercise bodies, for list views. */
export interface PackageSummary {
  id: string;
  order: number;
  title: string;
  summary: string;
  outcomes: string[];
  prerequisites: string[];
  moduleCount: number;
  exerciseCount: number;
}
