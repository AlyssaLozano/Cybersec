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

import type { AttackCarrier, AttackIntent, DefenceId } from './ai.js';
import type { TriageDecision } from './alerts.js';

/** How a student answers an exercise, which determines the UI shown. */
export type ExerciseKind =
  | 'terminal'
  | 'multiple-choice'
  | 'short-answer'
  | 'alert-triage'
  /** Worked in the Model Lab: send payloads at a model under test, or harden one. */
  | 'model-probe'
  /** Worked in the incident console: commit to a decision, then live with it. */
  | 'incident-decision';

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
  | { type: 'answer-mentions'; conceptGroups: string[][]; hint: string }
  /* --- alert triage ------------------------------------------------------
   *
   * Triage checks grade a set of decisions against ground truth rather than a
   * string. They are computed from the generated alert corpus, never written by
   * hand, so regenerating the corpus cannot leave a stale answer key.
   */
  /** Named alerts must carry this decision. `forbidExtra` also fails the check
   *  when the student applied the decision to anything not on the list, which
   *  is what stops "escalate everything" from passing. */
  | {
      type: 'triage-selection';
      decision: TriageDecision;
      alertIds: string[];
      forbidExtra?: boolean;
      hint: string;
    }
  /** Precision and recall floors for one decision class. Kept separate because
   *  they fail in opposite directions and a student must know which they did. */
  | {
      type: 'triage-accuracy';
      decision: TriageDecision;
      minPrecision?: number;
      minRecall?: number;
      hint: string;
    }
  /** The written reason attached to one alert must hit every concept group. */
  | { type: 'triage-justifies'; alertId: string; conceptGroups: string[][]; hint: string }
  /** No more than this many alerts may carry the decision, regardless of which.
   *  Models a real constraint: an operator who escalates forty alerts a shift
   *  has escalated nothing, because nobody downstream can absorb that. */
  | { type: 'triage-budget'; decision: TriageDecision; max: number; hint: string }
  /* --- working with the copilot ------------------------------------------
   *
   * These grade the student's relationship with the AI assistant rather than
   * their answer. They are only meaningful on an exercise whose queue has
   * copilot analyses, and the catalogue validator enforces that at boot.
   *
   * As with triage checks, no alert id below is ever written by hand. They are
   * computed from the generated flaw table, so regenerating copilot output
   * cannot leave an exercise pointing at an analysis that is now sound.
   */
  /** The student must have opened the copilot on at least this many alerts.
   *  Grades reaching for the tool at all -- the cheapest thing to get wrong is
   *  working a hundred-alert queue with a second opinion sitting unread. */
  | { type: 'copilot-consulted'; minAlerts: number; hint: string }
  /** On these alerts the student must have consulted the copilot AND landed on
   *  a disposition other than the one it recommended. This is the check behind
   *  "the suggestion looked good and was wrong": passing it requires having
   *  read the advice and then declined it, and neither half alone will do. */
  | { type: 'copilot-override'; alertIds: string[]; hint: string }
  /** Thresholds on the collaboration metric.
   *
   *  Note what is NOT gradeable here: the deference rate. `CollaborationScore`
   *  reports it, and an instructor should read it, but failing somebody for it
   *  would mean failing them for agreeing with advice that was correct — and on
   *  a realistic queue the copilot is right about most alerts, so a careful
   *  student defers most of the time and should. What is gradeable is what
   *  happened at the alerts where deferring was wrong: `minCaught` and
   *  `maxMisled`. */
  | {
      type: 'copilot-collaboration';
      minScore?: number;
      /** Fail unless at least this many bad suggestions were overridden. */
      minCaught?: number;
      /** Fail once this many wrong recommendations were followed. */
      maxMisled?: number;
      hint: string;
    }
  /* --- the Model Lab -------------------------------------------------------
   *
   * These grade what happened when the student's payloads met a model under
   * test, never the text of the payloads themselves. That is the same rule as
   * everywhere else here — grade the outcome, not the keystrokes — and it
   * matters more in this package than in any other, because there is no single
   * correct jailbreak. There is a class of technique the deployment does not
   * defend against, and any payload in that class is a right answer.
   *
   * A student who invents a bypass nobody anticipated should pass. A student who
   * copies the worked answer from the teaching material should not, which is why
   * the material demonstrates techniques against a DIFFERENT model to the one
   * each exercise asks about.
   */
  /** At least `min` submitted probes must have got through, optionally of a
   *  particular technique. `intent` and `carrier` are separate because "make it
   *  say SAFE" and "hide the instruction from the filter" are different skills
   *  and several exercises test exactly one of them. */
  | {
      type: 'probe-bypass';
      min: number;
      intent?: AttackIntent;
      carrier?: AttackCarrier;
      hint: string;
    }
  /** Successful bypasses must span at least this many distinct carriers.
   *  Stops "found one encoding trick, submitted it eight times" from reading as
   *  a systematic assessment, which is the thing the suite exercises teach. */
  | { type: 'probe-carrier-variety'; minDistinct: number; hint: string }
  /** Every submitted probe must have been blocked. The defence-side inverse:
   *  the student hardens a deployment and then proves the suite dies against it. */
  | { type: 'probe-all-blocked'; hint: string }
  /** How many probes the submission may contain. `max` is the discipline half:
   *  an assessment report with four hundred payloads in it is not an assessment
   *  report, and submitting only what demonstrates the finding is part of the
   *  job. `min` is the evidence half, and it exists for the exercises that end
   *  in a NEGATIVE result — "I could not break it" is worth something only when
   *  it says how hard you tried, so an exercise that grades a model holding
   *  requires enough attempts to have meant it. */
  | { type: 'probe-budget'; max: number; min?: number; hint: string }
  /** With the student's chosen defences deployed, a named suite must be blocked.
   *  `minBlocked` defaults to the whole suite; exercises that teach an honest
   *  trade-off set it lower and pair it with a cost budget. */
  | { type: 'defence-blocks-suite'; suiteId: string; minBlocked?: number; hint: string }
  /** Total cost of the chosen defences must not exceed this. Present for the
   *  same reason `triage-budget` is: "turn everything on" is not an answer
   *  anybody ships, and an exercise that accepts it teaches a habit that gets
   *  overruled by the first product manager who reads a latency graph. */
  | { type: 'defence-cost-budget'; max: number; hint: string }
  /** The student's chosen defence set must contain each of these. Used only
   *  where an exercise is explicitly about learning one control, in the same
   *  spirit as `command-has-flag`. */
  | { type: 'defence-includes'; defences: DefenceId[]; hint: string }
  /* --- incident decisions -------------------------------------------------
   *
   * Graded on what the responder chose and in what order, never on prose. The
   * consequence of each option is the answer key and lives on the decision
   * point, not on the check.
   */
  /** These options must be chosen. `forbidExtra` also fails when anything else
   *  was selected, which is how "do all of it" stops being an answer. */
  | { type: 'decision-selects'; optionIds: string[]; forbidExtra?: boolean; hint: string }
  /** None of these options may be chosen. Separate from `decision-selects` so an
   *  exercise can be explicitly about the thing you must NOT do — pulling the
   *  power on a host whose memory has not been captured, say — and say so in
   *  its own hint. */
  | { type: 'decision-avoids'; optionIds: string[]; hint: string }
  /** The ordering must be within `maxDisplaced` positions of the intended one.
   *  A tolerance rather than an exact match: transposing two steps that do not
   *  interact is not the same mistake as imaging a disk before capturing RAM. */
  | {
      type: 'decision-orders';
      optionIds: string[];
      maxDisplaced?: number;
      hint: string;
    }
  /** The written reason for a decision must hit every concept group. */
  | { type: 'decision-justifies'; conceptGroups: string[][]; hint: string };

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
  /** Alert queue this exercise is worked against, for kind 'alert-triage'. */
  queueId?: string;
  /**
   * Whether the AI copilot panel is available on this exercise.
   *
   * Explicit rather than inferred from the presence of copilot checks, because
   * it is a teaching decision and belongs where a reviewer can see it. Modules
   * 3.1 to 3.4 deliberately withhold it: an operator handed an assistant before
   * they can read a queue unaided does not learn to work with one, they learn to
   * do what it says. The catalogue validator refuses to boot an exercise that
   * grades copilot use without enabling it.
   */
  copilotEnabled?: boolean;
  /**
   * Decision point this exercise puts the student at, for kind
   * 'incident-decision'. Names a point; the consequences stay server-side.
   */
  decisionPointId?: string;
  /** Model under test, for kind 'model-probe'. Names a card, never a defence list. */
  modelId?: string;
  /**
   * Attack suite the student's defences are measured against, for the
   * hardening exercises. Safe to ship: the payloads are the ones a tester would
   * write themselves, and knowing them does not reveal which controls stop them.
   */
  suiteId?: string;
  /** Shown after a pass, to connect the mechanic to real SOC work. */
  debrief?: string;
  /**
   * Bounds and required shape for a free-text answer.
   *
   * Authored only where the default is wrong -- see `answerFormatFor()`, which
   * derives one from the exercise's own rubric.
   */
  answerFormat?: AnswerFormat;
  /** Optional extra drills on the same skill, offered after a pass. */
  practice: PracticeItem[];
}

/**
 * What a free-text answer is allowed to be.
 *
 * WHY FREE TEXT IS BOUNDED AT ALL
 *
 * An unbounded box invites an essay, and an essay is the worst possible input
 * to a rubric: a student who writes six paragraphs will hit every keyword by
 * accident and learn nothing, while the check reports a pass. A tight bound
 * forces a claim instead of a spray, which is both the skill being taught --
 * incident writing is compression under time pressure -- and the only form a
 * rubric can honestly grade.
 *
 * `minChars` exists for the opposite failure: a two-word answer that happens to
 * contain the right noun.
 *
 * Shipping this to the browser is safe. It states the shape expected, never the
 * content: "two sentences: the decision, and its cost" tells nobody what the
 * decision is.
 */
export interface AnswerFormat {
  /** Hard cap, enforced in the browser and again on the server. */
  maxChars: number;
  /** Below this the answer is too thin to be assessed. */
  minChars: number;
  /** The shape being asked for, shown above the box. */
  shape: string;
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
  /**
   * A different model under test, for Model Lab drills.
   *
   * A drill's whole premise is "same skill, different target", and in the Model
   * Lab the target IS the model — running the same three payloads against a
   * deployment with different controls is the entire lesson. Absent means the
   * drill uses its parent exercise's model.
   */
  modelId?: string;
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
