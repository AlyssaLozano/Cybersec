/**
 * Exercise grading.
 *
 * Two principles shape this:
 *
 * 1. Grade the OUTCOME where possible, not the keystrokes. A student who reaches
 *    the right answer a different way has not made a mistake, and marking them
 *    wrong teaches them to guess at the answer key instead of at the system.
 *    Command-shape checks exist only where the exercise is explicitly about
 *    learning a specific flag.
 *
 * 2. Report EVERY failed check at once, each with its own hint. Revealing one
 *    problem at a time turns learning into a guessing game.
 */

import type {
  AlertTruth,
  Check,
  CheckReport,
  CollaborationInput,
  ConceptReport,
  DecisionSubmission,
  DefenceId,
  Evaluation,
  Exercise,
  FailedCheck,
  HardeningScore,
  ProbeEntry,
  ProbeResult,
  TriageDecision,
  TriageEntry,
} from '@soc/shared';
import { orderingDisplacement, scoreCollaboration, scoreTriage } from '@soc/shared';

import { normalizeCommand } from '../terminal/parser.js';
import type { Vfs } from '../vfs/vfs.js';

export interface Attempt {
  /** Raw text the student submitted. */
  input: string;
  /** Combined output the terminal displayed. */
  output: string;
  exitCode: number;
  /** Working directory after the command ran. */
  cwd: string;
  /** The student's filesystem, for state-based checks. */
  vfs: Vfs;
  /** Selected option ids, for multiple-choice exercises. */
  selectedOptionIds?: string[];
  /** Free text, for short-answer exercises. */
  answerText?: string;
  /** Dispositions the student assigned, for alert-triage exercises. */
  triage?: TriageEntry[];
  /**
   * Ground truth for the queue this attempt was made against.
   *
   * Supplied by the caller rather than imported here, so that grading stays a
   * pure function of the attempt and the answer key never becomes ambient state
   * that some other module could accidentally serialise into a response.
   */
  alertTruth?: AlertTruth[];
  /**
   * Alerts the student opened the AI copilot on, as recorded server-side.
   *
   * Not taken from the submission. "Did you consult it" is graded, so a
   * client-supplied list would be a list the student writes for themselves.
   */
  copilotConsulted?: string[];
  /**
   * What the copilot recommended for each alert in the queue.
   *
   * Passed in for the same reason as `alertTruth`: the copilot's flaw table is
   * an answer key, and grading should not be able to reach for it on its own.
   */
  copilotAdvice?: Array<{ alertId: string; recommendation: TriageDecision }>;
  /**
   * What the student committed to at an incident decision point.
   *
   * The consequences of each option are NOT here. They live on the decision
   * point server-side and are released only after the submission is graded, for
   * the same reason the worked solution is: seeing the outcome of every option
   * before choosing is not a decision.
   */
  decision?: DecisionSubmission;
  /* --- the Model Lab ------------------------------------------------------
   *
   * The submitted payloads, and what the harness decided about each of them.
   * The RESULTS are supplied by the caller rather than computed here, for the
   * same reason `alertTruth` is: grading stays a pure function of the attempt,
   * and the module that knows which defences a deployment has never becomes
   * something the grader can reach for on its own.
   */
  /** The payloads the student put their name to. */
  probes?: ProbeEntry[];
  /** What happened to each of them, in the same order. */
  probeResults?: ProbeResult[];
  /** The defence set the student chose, for the hardening exercises. */
  defences?: DefenceId[];
  /** Cost of that set, computed by the caller from the defence catalogue. */
  defenceCost?: number;
  /** How that set performed against each suite the exercise's checks name. */
  hardening?: HardeningScore[];
}

/** Non-empty output lines, which is what line-count checks care about. */
function outputLines(output: string): string[] {
  return output.split('\n').filter((line) => line.trim() !== '');
}

function contains(haystack: string, needle: string, caseSensitive: boolean): boolean {
  return caseSensitive
    ? haystack.includes(needle)
    : haystack.toLowerCase().includes(needle.toLowerCase());
}

/**
 * Whether a command line uses a given short flag.
 *
 * Flags may be grouped, so `-la` satisfies a requirement for `-l`. Only the
 * dash-prefixed tokens are examined, so a file named "n.log" never counts as
 * `-n`.
 */
function usesFlag(input: string, command: string, flag: string): boolean {
  const stages = input.split('|').map((stage) => stage.trim());
  for (const stage of stages) {
    const tokens = stage.split(/\s+/);
    if (tokens[0] !== command) continue;
    for (const token of tokens.slice(1)) {
      if (!token.startsWith('-') || token.startsWith('--')) continue;
      if (token.slice(1).includes(flag)) return true;
    }
  }
  return false;
}

/** Run one check. Returns null when it passes, or the failure to report. */
function runCheck(check: Check, attempt: Attempt): FailedCheck | null {
  const failed = (): FailedCheck => ({ type: check.type, hint: check.hint });

  switch (check.type) {
    case 'command-matches': {
      const actual = normalizeCommand(attempt.input);
      const matched = check.anyOf.some((pattern) =>
        check.regex ? new RegExp(pattern).test(actual) : normalizeCommand(pattern) === actual,
      );
      return matched ? null : failed();
    }

    case 'command-has-flag': {
      const hasAll = check.flags.every((flag) => usesFlag(attempt.input, check.command, flag));
      return hasAll ? null : failed();
    }

    case 'command-uses-pipe':
      return attempt.input.includes('|') ? null : failed();

    case 'output-contains':
      return contains(attempt.output, check.text, check.caseSensitive ?? false) ? null : failed();

    case 'output-excludes':
      return contains(attempt.output, check.text, check.caseSensitive ?? false) ? failed() : null;

    case 'output-matches':
      return new RegExp(check.pattern, check.flags ?? '').test(attempt.output) ? null : failed();

    case 'output-line-count':
      return outputLines(attempt.output).length === check.count ? null : failed();

    case 'output-numeric': {
      // Accept a bare number, or a number sitting alone on the last line, so
      // that `grep -c` and `... | wc -l` are both gradeable.
      const lines = outputLines(attempt.output);
      const candidate = lines.length === 1 ? lines[0]! : (lines[lines.length - 1] ?? '');
      const value = Number(candidate.trim());
      if (!Number.isFinite(value)) return failed();
      if (check.equals !== undefined && value !== check.equals) return failed();
      if (check.min !== undefined && value < check.min) return failed();
      if (check.max !== undefined && value > check.max) return failed();
      return null;
    }

    case 'fs-exists': {
      const node = attempt.vfs.stat(check.path);
      const present = node !== null;
      if (present !== check.exists) return failed();
      if (present && check.kind && node.kind !== check.kind) return failed();
      return null;
    }

    case 'cwd-equals':
      return attempt.cwd === check.path ? null : failed();

    case 'choice-equals': {
      const selected = [...(attempt.selectedOptionIds ?? [])].sort();
      const expected = [...check.optionIds].sort();
      const same =
        selected.length === expected.length && selected.every((id, index) => id === expected[index]);
      return same ? null : failed();
    }

    case 'answer-mentions': {
      const text = (attempt.answerText ?? '').toLowerCase();
      const hitsEveryGroup = check.conceptGroups.every((synonyms) =>
        synonyms.some((word) => text.includes(word.toLowerCase())),
      );
      return hitsEveryGroup ? null : failed();
    }

    case 'triage-selection': {
      const entries = attempt.triage ?? [];
      const assigned = new Set(
        entries.filter((entry) => entry.decision === check.decision).map((entry) => entry.alertId),
      );
      const missing = check.alertIds.some((id) => !assigned.has(id));
      if (missing) return failed();
      if (check.forbidExtra) {
        const wanted = new Set(check.alertIds);
        for (const id of assigned) if (!wanted.has(id)) return failed();
      }
      return null;
    }

    case 'triage-accuracy': {
      // Without ground truth there is nothing to measure against, and silently
      // passing would let a misconfigured exercise award an unearned pass.
      if (!attempt.alertTruth) return failed();
      const score = scoreTriage(attempt.triage ?? [], attempt.alertTruth, check.decision);
      if (check.minPrecision !== undefined && score.precision < check.minPrecision) return failed();
      if (check.minRecall !== undefined && score.recall < check.minRecall) return failed();
      return null;
    }

    case 'triage-justifies': {
      const entry = (attempt.triage ?? []).find((item) => item.alertId === check.alertId);
      const text = (entry?.justification ?? '').toLowerCase();
      const hitsEveryGroup = check.conceptGroups.every((synonyms) =>
        synonyms.some((word) => text.includes(word.toLowerCase())),
      );
      return hitsEveryGroup ? null : failed();
    }

    case 'triage-budget': {
      const used = (attempt.triage ?? []).filter((entry) => entry.decision === check.decision).length;
      return used <= check.max ? null : failed();
    }

    case 'copilot-consulted':
      return (attempt.copilotConsulted ?? []).length >= check.minAlerts ? null : failed();

    case 'copilot-override': {
      const consulted = new Set(attempt.copilotConsulted ?? []);
      const advice = new Map(
        (attempt.copilotAdvice ?? []).map((item) => [item.alertId, item.recommendation]),
      );
      const decisions = new Map(
        (attempt.triage ?? []).map((entry) => [entry.alertId, entry.decision]),
      );

      // Both halves are required. Disagreeing with advice nobody read is not
      // judgement, it is coincidence; reading it and deferring is the failure
      // this check exists to catch. Neither alone passes.
      for (const alertId of check.alertIds) {
        if (!consulted.has(alertId)) return failed();
        const decision = decisions.get(alertId);
        if (decision === undefined) return failed();
        if (decision === advice.get(alertId)) return failed();
      }
      return null;
    }

    case 'copilot-collaboration': {
      // Without the answer key or the copilot's side of it there is nothing to
      // measure, and passing silently would award a mark for a content bug.
      if (!attempt.alertTruth || !attempt.copilotAdvice) return failed();

      const truthByAlert = new Map(attempt.alertTruth.map((truth) => [truth.alertId, truth]));
      const adviceByAlert = new Map(
        attempt.copilotAdvice.map((item) => [item.alertId, item.recommendation]),
      );
      const consulted = new Set(attempt.copilotConsulted ?? []);

      const items: CollaborationInput[] = [];
      for (const entry of attempt.triage ?? []) {
        const truth = truthByAlert.get(entry.alertId);
        const recommendation = adviceByAlert.get(entry.alertId);
        if (!truth || !recommendation) continue;
        items.push({
          alertId: entry.alertId,
          decision: entry.decision,
          correctDecision: truth.correctDecision,
          recommendation,
          consulted: consulted.has(entry.alertId),
        });
      }

      const score = scoreCollaboration(items);
      if (check.minScore !== undefined && score.score < check.minScore) return failed();
      if (check.minCaught !== undefined && score.counts.caught < check.minCaught) return failed();
      if (check.maxMisled !== undefined && score.counts.misled > check.maxMisled) return failed();
      // `score.deferenceRate` is deliberately not gradeable here. See the note
      // on the check definition: on a queue where the copilot is usually right,
      // a careful student defers most of the time, and penalising that would be
      // penalising them for agreeing with correct advice.
      return null;
    }

    case 'decision-selects': {
      const chosen = new Set(attempt.decision?.optionIds ?? []);
      if (check.optionIds.some((id) => !chosen.has(id))) return failed();
      if (check.forbidExtra) {
        const wanted = new Set(check.optionIds);
        for (const id of chosen) if (!wanted.has(id)) return failed();
      }
      return null;
    }

    case 'decision-avoids': {
      const chosen = new Set(attempt.decision?.optionIds ?? []);
      return check.optionIds.some((id) => chosen.has(id)) ? failed() : null;
    }

    case 'decision-orders': {
      const submitted = attempt.decision?.ordering ?? [];
      // An empty ordering must fail rather than score zero displacement against
      // nothing, or "submit without answering" would pass a tolerant check.
      if (submitted.length === 0) return failed();
      const displaced = orderingDisplacement(submitted, check.optionIds);
      return displaced <= (check.maxDisplaced ?? 0) ? null : failed();
    }

    case 'decision-justifies': {
      const text = (attempt.decision?.justification ?? '').toLowerCase();
      const hitsEveryGroup = check.conceptGroups.every((synonyms) =>
        synonyms.some((word) => text.includes(word.toLowerCase())),
      );
      return hitsEveryGroup ? null : failed();
    }

    /* --- the Model Lab ---------------------------------------------------
     *
     * All of these grade `probeResults`, which the caller produced by running
     * the submitted payloads through the harness. Grading never runs the
     * harness itself, for the same reason it never loads `alertTruth`: a pure
     * function of the attempt cannot accidentally become the thing that decides
     * what a student is allowed to see.
     */

    case 'probe-bypass': {
      const bypassed = (attempt.probeResults ?? []).filter((result) => result.bypassed);
      const matching = bypassed.filter(
        (result) =>
          (check.intent === undefined || result.intents.includes(check.intent)) &&
          (check.carrier === undefined || result.carriers.includes(check.carrier)),
      );
      return matching.length >= check.min ? null : failed();
    }

    case 'probe-carrier-variety': {
      // Counted across successful probes only. Three carriers that were all
      // blocked demonstrate nothing about the target.
      const carriers = new Set<string>();
      for (const result of attempt.probeResults ?? []) {
        if (!result.bypassed) continue;
        for (const carrier of result.carriers) carriers.add(carrier);
      }
      return carriers.size >= check.minDistinct ? null : failed();
    }

    case 'probe-all-blocked': {
      const results = attempt.probeResults ?? [];
      // An empty submission is not a proof that nothing got through. Exercises
      // using this check pair it with `probe-budget.min`, and failing here on
      // zero probes means a client that sent none cannot pass by default.
      if (results.length === 0) return failed();
      return results.every((result) => !result.bypassed) ? null : failed();
    }

    case 'probe-budget': {
      const count = (attempt.probes ?? []).length;
      if (count > check.max) return failed();
      if (check.min !== undefined && count < check.min) return failed();
      return null;
    }

    case 'defence-blocks-suite': {
      const score = (attempt.hardening ?? []).find((item) => item.suiteId === check.suiteId);
      // No score means the caller did not run this suite, which is a content or
      // wiring bug. Passing silently would award a mark for it.
      if (!score) return failed();
      const required = check.minBlocked ?? score.total;
      return score.blocked >= required ? null : failed();
    }

    case 'defence-cost-budget': {
      // Cost is computed by the caller from the student's chosen set, so a
      // submission with no defences costs nothing and passes — which is correct:
      // the budget is a ceiling, and the suite checks are what require spending.
      return (attempt.defenceCost ?? 0) <= check.max ? null : failed();
    }

    case 'defence-includes': {
      const chosen = new Set(attempt.defences ?? []);
      return check.defences.every((defence) => chosen.has(defence)) ? null : failed();
    }

    default: {
      // Exhaustiveness guard: adding a Check variant without handling it here
      // becomes a compile error rather than a silently passing exercise.
      const unreachable: never = check;
      throw new Error(`Unhandled check type: ${JSON.stringify(unreachable)}`);
    }
  }
}

/**
 * Plain-language statement of what a check required.
 *
 * Written for the student, not the author: "counted the failed logins and got
 * 1,847", not "output-numeric equals 1847". This is what makes a *passing*
 * submission informative -- until now a pass said only "Correct.", which tells
 * somebody they were right without telling them what they were right about.
 *
 * Exhaustive on purpose. Adding a `Check` variant without describing it is a
 * compile error, so a new check type cannot ship with a blank explanation.
 */
function describeCheck(check: Check): string {
  switch (check.type) {
    case 'command-matches':
      return `Ran one of: ${check.anyOf.join(', ')}`;
    case 'command-has-flag':
      return `Passed ${check.flags.join(' and ')} to ${check.command}`;
    case 'command-uses-pipe':
      return 'Chained one command into another with a pipe';
    case 'output-contains':
      return `Output included "${check.text}"`;
    case 'output-excludes':
      return `Output was filtered so that "${check.text}" no longer appears`;
    case 'output-matches':
      return 'Output matched the expected shape';
    case 'output-line-count':
      return `Output was exactly ${check.count} lines`;
    case 'output-numeric': {
      if (check.equals !== undefined) return `Answered with the number ${check.equals}`;
      const bounds = [
        check.min !== undefined ? `at least ${check.min}` : null,
        check.max !== undefined ? `at most ${check.max}` : null,
      ].filter(Boolean);
      return `Answered with a number ${bounds.join(' and ')}`;
    }
    case 'fs-exists':
      return check.exists ? `${check.path} exists` : `${check.path} is gone`;
    case 'cwd-equals':
      return `Ended up in ${check.path}`;
    case 'choice-equals':
      return 'Selected the correct option';
    case 'answer-mentions':
      return `Answer covered all ${check.conceptGroups.length} required ideas`;
    case 'triage-selection':
      return `Gave ${check.alertIds.length} specific alert(s) the disposition "${check.decision}"${
        check.forbidExtra ? ', and gave it to nothing else' : ''
      }`;
    case 'triage-accuracy':
      return 'Dispositioned the queue accurately enough against ground truth';
    case 'triage-budget':
      return `Used "${check.decision}" on at most ${check.max} alerts`;
    case 'triage-justifies':
      return `Justified the call on ${check.alertId} in terms of all ${check.conceptGroups.length} required ideas`;
    case 'copilot-consulted':
      return `Asked the copilot about at least ${check.minAlerts} alert(s) before deciding`;
    case 'copilot-override':
      return 'Disagreed with the copilot where it was wrong';
    case 'copilot-collaboration':
      return 'Worked with the copilot rather than deferring to or ignoring it';
    case 'decision-selects':
      return `Chose the sound option(s)${check.forbidExtra ? ' and nothing beyond them' : ''}`;
    case 'decision-avoids':
      return 'Avoided every harmful option';
    case 'decision-orders':
      return 'Sequenced the actions in a defensible order';
    case 'decision-justifies':
      return `Explained the decision in terms of all ${check.conceptGroups.length} required ideas`;
    case 'probe-bypass':
      return 'Got a payload past the deployed defences';
    case 'probe-budget':
      return `Used at most ${check.max} probes`;
    case 'probe-all-blocked':
      return 'Every probe was stopped by the controls in place';
    case 'probe-carrier-variety':
      return 'Tried genuinely different carriers rather than variations of one';
    case 'defence-blocks-suite':
      return 'The controls deployed stopped the attack suite';
    case 'defence-cost-budget':
      return `Kept the deployed controls within a cost of ${check.max}`;
    case 'defence-includes':
      return 'Deployed the control the finding calls for';
    default: {
      const unreachable: never = check;
      throw new Error(`Undescribed check type: ${JSON.stringify(unreachable)}`);
    }
  }
}

/** The free text a check reads, or null when it does not read any. */
function textFor(check: Check, attempt: Attempt): string | null {
  switch (check.type) {
    case 'answer-mentions':
      return attempt.answerText ?? '';
    case 'decision-justifies':
      return attempt.decision?.justification ?? '';
    case 'triage-justifies':
      return (attempt.triage ?? []).find((item) => item.alertId === check.alertId)?.justification ?? '';
    default:
      return null;
  }
}

/**
 * Per-concept breakdown for a free-text check.
 *
 * This is the whole point of the reporting layer. A text check is an AND over
 * concept groups; failing it told the student "not quite" and left them to
 * guess which of four ideas was missing. Now each concept says whether it
 * landed and on which word.
 */
function conceptReportsFor(check: Check, attempt: Attempt): ConceptReport[] | undefined {
  const raw = textFor(check, attempt);
  if (raw === null) return undefined;
  const groups = (check as { conceptGroups?: string[][] }).conceptGroups;
  if (!groups) return undefined;

  const text = raw.toLowerCase();
  return groups.map((synonyms) => {
    const matched = synonyms.find((word) => text.includes(word.toLowerCase())) ?? null;
    return { accepted: synonyms, matched, hit: matched !== null };
  });
}

export function evaluate(exercise: Exercise, attempt: Attempt, attemptNumber: number): Evaluation {
  const failed: FailedCheck[] = [];
  const reports: CheckReport[] = [];

  for (const check of exercise.checks) {
    const failure = runCheck(check, attempt);
    if (failure) failed.push(failure);

    const concepts = conceptReportsFor(check, attempt);
    reports.push({
      type: check.type,
      looksFor: describeCheck(check),
      passed: failure === null,
      ...(failure ? { hint: failure.hint } : {}),
      ...(concepts ? { concepts } : {}),
    });
  }

  if (failed.length === 0) {
    return { passed: true, summary: 'Correct.', failed: [], reports, attempt: attemptNumber };
  }

  // A command the shell rejected outright is nearly always the real problem, so
  // say that rather than listing consequences of it.
  const summary =
    attempt.exitCode === 127
      ? 'That command does not exist on this system. Type "help" to see what is available.'
      : failed.length === 1
        ? 'Not quite yet.'
        : `Not quite yet -- ${failed.length} things to fix.`;

  return { passed: false, summary, failed, reports, attempt: attemptNumber };
}
