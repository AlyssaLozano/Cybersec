/**
 * Grading for exercises that are not answered by typing a command.
 *
 * WHY THIS IS SEPARATE FROM terminalSession
 *
 * A terminal attempt is graded against the *state the command left behind*:
 * the filesystem, the working directory, the output. It needs a live session and
 * a copy-on-write overlay. A triage decision, a multiple-choice selection, and a
 * written answer need none of that: they are graded against the submission
 * itself. Routing them through the terminal machinery would mean creating a
 * filesystem session for an exercise that never touches a filesystem.
 *
 * WHAT THIS MODULE IS CAREFUL ABOUT
 *
 * The answer keys: both of them. `alertTruth` and the copilot's recommendations
 * are loaded here, handed to the grader, and never put anywhere near the
 * response. The debriefs that *are* returned are released only after the student
 * has committed their decisions: same principle as the worked solution, for the
 * same reason.
 *
 * The copilot adds one thing the other graders do not have: a fact about the
 * student that the student must not be able to assert. Whether they consulted an
 * alert's analysis is graded, so it is read from the consultation table rather
 * than from the submission body.
 */

import type {
  Check,
  CollaborationScore,
  CopilotDebriefEntry,
  DecisionOutcome,
  DecisionSubmission,
  DefenceId,
  Evaluation,
  HardeningScore,
  ProbeEntry,
  ProbeResult,
  TriageEntry,
} from '@soc/shared';

import { getExercise } from '../content/index.js';
import { evaluate } from '../content/validate.js';
import { HttpError } from '../http.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';
import { debriefFor, truthForQueue, type TriageDebrief } from './alerts.js';
import { adviceForQueue, collaborationFor, copilotDebriefFor } from './copilot.js';
import { consultedAlerts } from './copilotConsults.js';
import { outcomesAfterCommit } from './incidents.js';
import { defenceCostOf, probeForGrading, scoreHardening } from './modelLab.js';
import { recordAttempt, recordPracticeAttempt } from './progress.js';
import { prisma } from '../db/client.js';

/** Matches the simulated machine's student home directory. */
const HOME = '/home/student';

export interface SubmissionInput {
  /** Selected option ids, for multiple-choice. */
  selectedOptionIds?: string[];
  /** Free text, for short-answer. */
  answerText?: string;
  /** Per-alert dispositions, for alert-triage. */
  triage?: TriageEntry[];
  /** What the student committed to, for incident-decision. */
  decision?: DecisionSubmission;
  /** Payloads the student put their name to, for model-probe. */
  probes?: ProbeEntry[];
  /**
   * The defence set they chose, for the hardening exercises.
   *
   * Absent means "test the deployment as it stands". Present means "rebuild it
   * with exactly these", which is why it is part of the submission rather than
   * something the exercise declares.
   */
  defences?: DefenceId[];
}

export interface SubmissionResult {
  evaluation: Evaluation;
  /**
   * What happened to each submitted probe.
   *
   * Returned whether or not the exercise passed, because it is the evidence the
   * student is being graded on and hiding it would make a failure unreadable.
   * `ProbeResult` reports the STAGE a payload died at and never the control that
   * caught it -- see the note on the type.
   */
  probeResults?: ProbeResult[];
  /** How the chosen defence set scored against each suite the checks named. */
  hardening?: HardeningScore[];
  /**
   * Released after a triage attempt, so a student learns what they missed.
   *
   * Named distinctly from the exercise's own `debrief` prose, which the route
   * also returns on a pass -- one field for both would silently overwrite the
   * per-alert explanation with a paragraph of narrative.
   */
  triageDebrief?: TriageDebrief;
  /**
   * Which of the copilot's suggestions were unsound, and how.
   *
   * Released on the same terms as `triageDebrief`: after decisions are
   * committed, never before. Told in advance which two suggestions were rotten,
   * a student learns nothing about reading the other eighty.
   */
  copilotDebrief?: CopilotDebriefEntry[];
  /**
   * How the student worked with the copilot, when they had one.
   *
   * Returned alongside the triage scores rather than folded into them. Getting
   * the queue right and handling the assistant well are different skills, and a
   * student who did one and not the other needs to see which.
   */
  collaboration?: CollaborationScore;
  /**
   * What every option at a decision point would have done.
   *
   * Released only after the student commits, on the same terms as the worked
   * solution. All options are returned, not just the chosen ones: the value of
   * a decision exercise is largely in reading what the others would have cost.
   */
  decisionOutcomes?: DecisionOutcome[];
}

/**
 * A summary of the submission for the attempt log.
 *
 * The log column is a single string shared with terminal attempts, so a triage
 * submission is reduced to a compact, greppable form rather than a wall of JSON.
 * Instructors reviewing where students go wrong need the shape of the answer,
 * not every keystroke of justification.
 */
function describe(input: SubmissionInput): string {
  if (input.triage) {
    const tally = new Map<string, number>();
    for (const entry of input.triage) {
      tally.set(entry.decision, (tally.get(entry.decision) ?? 0) + 1);
    }
    const counts = [...tally.entries()].map(([decision, n]) => `${decision}=${n}`).join(' ');
    const escalated = input.triage
      .filter((entry) => entry.decision === 'escalate')
      .map((entry) => entry.alertId)
      .join(',');
    return `triage ${counts}${escalated ? ` escalated:[${escalated}]` : ''}`;
  }
  if (input.decision) {
    const chosen = input.decision.optionIds?.join(',') ?? '';
    const order = input.decision.ordering?.join('>') ?? '';
    return `decision${chosen ? ` chose:[${chosen}]` : ''}${order ? ` order:[${order}]` : ''}`;
  }
  if (input.probes) {
    // Payloads can be thousands of characters and several of them are base64,
    // so the log records the shape of the submission rather than its contents.
    // An instructor reviewing where students go wrong needs to know how many
    // probes were submitted and what was deployed, not every byte of payload.
    const defences = input.defences?.length ? ` defences:[${[...input.defences].sort().join(',')}]` : '';
    return `probe n=${input.probes.length}${defences}`;
  }
  if (input.selectedOptionIds) return `choice ${[...input.selectedOptionIds].sort().join(',')}`;
  return input.answerText ?? '';
}

/**
 * Run the Model Lab for one submission.
 *
 * Everything the grader needs and nothing it should be able to fetch itself:
 * the probe results, the chosen defence set with its cost, and a score for each
 * suite the active checks name.
 *
 * Suites are collected from the checks rather than from a field on the exercise
 * because an exercise may be graded against several -- 7.2.4 requires one
 * defence set to hold against all three -- and running only the one the
 * exercise names would silently pass a student on the other two.
 */
function runModelLab(
  modelId: string,
  checks: readonly Check[],
  input: SubmissionInput,
): {
  probes: ProbeEntry[];
  probeResults: ProbeResult[];
  defences: DefenceId[];
  defenceCost: number;
  hardening: HardeningScore[];
} {
  const probes = input.probes ?? [];
  const defences = input.defences;

  const run = probeForGrading(modelId, probes, defences);

  const suiteIds = [
    ...new Set(
      checks
        .filter((check): check is Extract<Check, { type: 'defence-blocks-suite' }> =>
          check.type === 'defence-blocks-suite',
        )
        .map((check) => check.suiteId),
    ),
  ];

  const hardening = suiteIds
    .map((suiteId) => scoreHardening(modelId, suiteId, defences ?? []))
    .filter((score): score is HardeningScore => score !== null);

  return {
    probes,
    probeResults: run?.results ?? [],
    defences: defences ?? [],
    defenceCost: defenceCostOf(defences ?? []),
    hardening,
  };
}

/**
 * Grade one non-terminal submission.
 *
 * `regrade` mirrors the terminal path: without it, a student who has already
 * passed can revisit an exercise to re-read it without their idle clicking being
 * graded and logged as a fresh failure.
 */
export async function submitAnswer(
  userId: string,
  exerciseId: string,
  input: SubmissionInput,
  options: { practiceId?: string; regrade?: boolean } = {},
): Promise<SubmissionResult> {
  const exercise = getExercise(exerciseId);
  if (!exercise) throw new HttpError(404, 'not_found', 'No such exercise.');

  if (exercise.kind === 'terminal') {
    throw new HttpError(
      400,
      'validation_failed',
      'That exercise is answered in the terminal. Run a command instead.',
    );
  }

  const drill = options.practiceId
    ? (exercise.practice.find((item) => item.id === options.practiceId) ?? null)
    : null;
  if (options.practiceId && !drill) {
    throw new HttpError(404, 'not_found', `No practice drill "${options.practiceId}".`);
  }

  // Triage grading needs the ground truth for whichever queue this exercise is
  // worked against. Loaded here and passed to the grader; never returned.
  const truth = exercise.queueId ? truthForQueue(exercise.queueId) : undefined;

  // The copilot's side of it: what it advised, and which analyses this student
  // actually opened. The consultation list comes from the database rather than
  // the request body because `copilot-consulted` grades it.
  const advice = exercise.queueId ? adviceForQueue(exercise.queueId) : undefined;
  const consulted = exercise.queueId ? await consultedAlerts(userId, exerciseId) : [];

  // The Model Lab's side of it. The harness runs here, in the service layer,
  // and hands the grader results -- the grader must never be able to reach for
  // the defence list itself, on the same principle as `alertTruth` above.
  //
  // Which suites to run comes from the ACTIVE checks, so a practice drill that
  // names a different suite from its parent exercise is scored against its own.
  //
  // A drill may also name a DIFFERENT model from its parent: the drill premise
  // is "same skill, different target", and in this lab the target is the model.
  const activeChecks = drill ? drill.checks : exercise.checks;
  const activeModelId = drill?.modelId ?? exercise.modelId;
  const lab = activeModelId ? runModelLab(activeModelId, activeChecks, input) : null;

  const attempt = {
    input: describe(input),
    output: '',
    exitCode: 0,
    cwd: HOME,
    // State-based checks are meaningless here, but `Attempt` requires a
    // filesystem. An empty overlay over the base image is the honest answer:
    // this submission changed nothing on disk.
    vfs: new Vfs(BASE_IMAGE, emptyOverlay(), HOME),
    ...(input.selectedOptionIds ? { selectedOptionIds: input.selectedOptionIds } : {}),
    ...(input.answerText ? { answerText: input.answerText } : {}),
    ...(input.triage ? { triage: input.triage } : {}),
    ...(input.decision ? { decision: input.decision } : {}),
    ...(truth ? { alertTruth: truth } : {}),
    ...(advice ? { copilotAdvice: advice } : {}),
    ...(exercise.queueId ? { copilotConsulted: consulted } : {}),
    ...(lab ?? {}),
  };

  const progress = await prisma.exerciseProgress.findUnique({
    where: { userId_exerciseId: { userId, exerciseId } },
  });
  const alreadyPassed = progress?.status === 'passed';

  if (drill) {
    // Drills are graded against their own checks and never touch the parent
    // exercise's progress -- practice must not be able to change a pass.
    const drillProgress = await prisma.practiceProgress.findUnique({
      where: { userId_practiceId: { userId, practiceId: drill.id } },
    });
    const evaluation = evaluate(
      { ...exercise, checks: drill.checks },
      attempt,
      (drillProgress?.attempts ?? 0) + 1,
    );
    await recordPracticeAttempt(userId, exerciseId, drill.id, attempt.input, evaluation);
    return { evaluation };
  }

  const evaluation = evaluate(exercise, attempt, (progress?.attempts ?? 0) + 1);

  if (!alreadyPassed || options.regrade) {
    await recordAttempt(userId, exercise, attempt.input, evaluation);
  }

  return {
    evaluation,
    // The debriefs explain every alert the student got wrong, and every
    // suggestion that was not worth taking. Both are released only once
    // decisions have been committed -- handing either over beforehand would be
    // handing over an answer key.
    ...(exercise.queueId && input.triage
      ? {
          triageDebrief: debriefFor(exercise.queueId, input.triage),
          copilotDebrief: copilotDebriefFor(exercise.queueId, input.triage, consulted),
          collaboration: collaborationFor(exercise.queueId, input.triage, consulted),
        }
      : {}),
    // What every option would have done -- including the ones not taken, which
    // is where most of the learning in a decision exercise actually is.
    ...(exercise.decisionPointId && input.decision
      ? {
          decisionOutcomes: outcomesAfterCommit(
            exercise.decisionPointId,
            input.decision.optionIds ?? input.decision.ordering ?? [],
          ),
        }
      : {}),
  };
}
