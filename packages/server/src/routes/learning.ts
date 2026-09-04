/**
 * Learning-mode routes: the catalogue, exercises, the terminal, and progress.
 */

import { Router } from 'express';
import { z } from 'zod';

import { API_ERROR_CODES, DEFENCES, PROBE_CHANNELS, TRIAGE_DECISIONS } from '@soc/shared';

import {
  getExercise,
  getPackage,
  nextExerciseId,
  packageSummaries,
  practiceAnswerFormatFor,
  practiceKindOf,
  toStudentView,
} from '../content/index.js';
import { TRACKS, getTrack } from '../content/tracks.js';
import { trackFoundations, trackPackages, trackReadiness } from '../content/curriculum.js';
import { CERT_PHILOSOPHY, resolveCertifications } from '../content/certifications.js';
import { laneIdForTrack } from '../content/lanes.js';
import { asyncRoute, HttpError, requireActiveAccount, requireAuth, sendOk } from '../http.js';
import { canAccess, getOverview, getPracticeState } from '../services/progress.js';
import { openSession, resetSession, runCommand } from '../services/terminalSession.js';
import { queueForStudent } from '../services/alerts.js';
import { pointForStudent } from '../services/incidents.js';
import { analysisFor } from '../services/copilot.js';
import { consultedAlerts, recordConsultation } from '../services/copilotConsults.js';
import { AI_PATH_NOTE, CERT_STUDY_PLAN, PLANS, PRICING_PHILOSOPHY } from '../content/pricing.js';
import { modelCard, postMortemFor, probe, suite } from '../services/modelLab.js';
import { portfolioFor } from '../services/portfolio.js';
import {
  capstoneStateFor,
  capstoneSubmissionsFor,
  capstoneTrackIds,
  capstoneUnlocked,
  CapstoneNotSelectedError,
  CapstoneOptionNotFoundError,
  hasCapstone,
  selectCapstone,
  submitCapstone,
} from '../services/capstone.js';
import { capstoneOptions, GITHUB_WALKTHROUGH } from '../content/capstones.js';
import { submitAnswer } from '../services/submission.js';
import { prisma } from '../db/client.js';

export const learningRouter = Router();

learningRouter.use(requireAuth, requireActiveAccount);

/** Every route below needs the signed-in user's id. */
function userIdOf(request: { session?: { sub: string } }): string {
  const id = request.session?.sub;
  if (!id) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
  return id;
}

/**
 * The track list, with each track's progress for this student.
 *
 * Tracks whose content is not written yet are returned too, marked
 * in_development, so the UI can show where a student is heading rather than
 * pretending the product is only ever one track wide.
 */
learningRouter.get(
  '/tracks',
  asyncRoute(async (request, response) => {
    const overview = await getOverview(userIdOf(request));
    const byPackageId = new Map(overview.packages.map((pkg) => [pkg.packageId, pkg]));

    const tracks = TRACKS.map((track) => {
      const packages = trackPackages(track.id)
        .map((id) => byPackageId.get(id))
        .filter((pkg): pkg is NonNullable<typeof pkg> => pkg !== undefined);

      const exerciseCount = packages.reduce((sum, pkg) => sum + pkg.exerciseCount, 0);
      const passedCount = packages.reduce((sum, pkg) => sum + pkg.passedCount, 0);

      return {
        ...track,
        // Resolved here rather than in the client so the end of a track can
        // show exam cost and study time without a request per track.
        certificationDetail: resolveCertifications(track.certifications),
        // The lane whose "day in the life" page describes this track, when one
        // exists, so the picker can link straight into it before a student
        // commits to the curriculum.
        laneId: laneIdForTrack(track.id),
        exerciseCount,
        passedCount,
        percentComplete: exerciseCount === 0 ? 0 : Math.round((passedCount / exerciseCount) * 100),
        // Readiness is reported separately from progress on purpose: a track can
        // be 100% complete on the parts that exist while most of it is unwritten,
        // and a single percentage would hide that.
        readiness: trackReadiness(track.id),
      };
    });

    // The study offer is one object for the whole list: it is the same deal on
    // every track, and repeating it per track would invite it drifting apart.
    sendOk(response, { tracks, certStudy: CERT_STUDY_PLAN });
  }),
);

learningRouter.get(
  '/tracks/:trackId',
  asyncRoute(async (request, response) => {
    const track = getTrack(request.params.trackId!);
    if (!track) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such track.');

    sendOk(response, {
      track,
      // The foundations this track requires -- which is what makes it possible
      // for a risk analyst to never be shown a Linux package.
      foundations: trackFoundations(track.id),
      readiness: trackReadiness(track.id),
      certifications: resolveCertifications(track.certifications),
      certPhilosophy: CERT_PHILOSOPHY,
      certStudy: CERT_STUDY_PLAN,
      packages: packageSummaries().filter((pkg) => trackPackages(track.id).includes(pkg.id)),
    });
  }),
);

/**
 * What the platform costs, with the reasoning attached to every number.
 *
 * Served from content rather than configuration so the justification travels
 * with the price. See content/pricing.ts.
 */
learningRouter.get('/pricing', (_request, response) => {
  sendOk(response, {
    plans: PLANS,
    philosophy: PRICING_PHILOSOPHY,
    aiPathNote: AI_PATH_NOTE,
    certStudy: CERT_STUDY_PLAN,
  });
});

/**
 * The student's AI Security portfolio.
 *
 * Recomputed from progress rows on every request rather than stored, so there
 * is no second place a claim could be edited and it cannot drift away from what
 * the student actually passed. See services/portfolio.ts.
 */
learningRouter.get(
  '/portfolio/ai-security',
  asyncRoute(async (request, response) => {
    sendOk(response, await portfolioFor(userIdOf(request)));
  }),
);

/**
 * Every GitHub Lab submission a student has, across every track. See
 * services/capstone.ts.
 */
learningRouter.get(
  '/portfolio/capstones',
  asyncRoute(async (request, response) => {
    sendOk(response, {
      submissions: await capstoneSubmissionsFor(userIdOf(request)),
      tracks: capstoneTrackIds()
        .map((trackId) => getTrack(trackId))
        .filter((track): track is NonNullable<typeof track> => track !== null)
        .map((track) => ({ id: track.id, title: track.title })),
    });
  }),
);

/**
 * The GitHub Lab: a track's project menu, the walkthrough, and this
 * student's current state, whether or not the stage is unlocked yet -- the
 * client decides what to show; access to the WRITE routes below is what the
 * server actually gates.
 */
learningRouter.get(
  '/capstones/:trackId',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const trackId = request.params.trackId!;
    if (!hasCapstone(trackId)) throw new HttpError(404, API_ERROR_CODES.notFound, 'No GitHub Lab for that track.');

    sendOk(response, {
      trackId,
      options: capstoneOptions(trackId),
      walkthrough: GITHUB_WALKTHROUGH,
      unlocked: await capstoneUnlocked(userId, trackId),
      state: await capstoneStateFor(userId, trackId),
    });
  }),
);

const capstoneSelectSchema = z.object({ optionId: z.string().max(128) });

learningRouter.post(
  '/capstones/:trackId/select',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const trackId = request.params.trackId!;
    if (!hasCapstone(trackId)) throw new HttpError(404, API_ERROR_CODES.notFound, 'No GitHub Lab for that track.');
    if (!(await capstoneUnlocked(userId, trackId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'The GitHub Lab is not unlocked yet.');
    }

    const { optionId } = capstoneSelectSchema.parse(request.body);
    try {
      sendOk(response, await selectCapstone(userId, trackId, optionId));
    } catch (error) {
      if (error instanceof CapstoneOptionNotFoundError) {
        throw new HttpError(404, API_ERROR_CODES.notFound, 'No such project option.');
      }
      throw error;
    }
  }),
);

const capstoneSubmitSchema = z.object({
  repoUrl: z.string().url('That does not look like a URL.').max(2_000),
  summary: z.string().max(4_000).optional(),
});

learningRouter.post(
  '/capstones/:trackId/submit',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const trackId = request.params.trackId!;
    if (!hasCapstone(trackId)) throw new HttpError(404, API_ERROR_CODES.notFound, 'No GitHub Lab for that track.');
    if (!(await capstoneUnlocked(userId, trackId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'The GitHub Lab is not unlocked yet.');
    }

    const { repoUrl, summary } = capstoneSubmitSchema.parse(request.body);
    try {
      sendOk(response, await submitCapstone(userId, trackId, repoUrl, summary ?? null));
    } catch (error) {
      if (error instanceof CapstoneNotSelectedError) {
        throw new HttpError(400, API_ERROR_CODES.validationFailed, 'Pick a project before submitting a link.');
      }
      throw error;
    }
  }),
);

learningRouter.get('/packages', (_request, response) => {
  sendOk(response, { packages: packageSummaries() });
});

learningRouter.get(
  '/packages/:packageId',
  asyncRoute(async (request, response) => {
    const pkg = getPackage(request.params.packageId!);
    if (!pkg) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such package.');

    // Send the structure without exercise bodies; the client fetches those one
    // at a time, and this response is what draws the sidebar.
    sendOk(response, {
      id: pkg.id,
      title: pkg.title,
      summary: pkg.summary,
      outcomes: pkg.outcomes,
      modules: pkg.modules.map((module) => ({
        id: module.id,
        title: module.title,
        summary: module.summary,
        order: module.order,
        exercises: module.exercises.map((exercise) => ({
          id: exercise.id,
          title: exercise.title,
          order: exercise.order,
          kind: exercise.kind,
        })),
      })),
    });
  }),
);

learningRouter.get(
  '/exercises/:exerciseId',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const exerciseId = request.params.exerciseId!;

    const exercise = getExercise(exerciseId);
    if (!exercise) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such exercise.');

    if (!(await canAccess(userId, exerciseId))) {
      throw new HttpError(
        403,
        API_ERROR_CODES.exerciseLocked,
        'Finish the earlier exercises first -- they build up to this one.',
      );
    }

    const [session, progress, practiceState, consultedAlertIds] = await Promise.all([
      openSession(userId, exerciseId),
      prisma.exerciseProgress.findUnique({
        where: { userId_exerciseId: { userId, exerciseId } },
      }),
      getPracticeState(userId, exerciseId),
      consultedAlerts(userId, exerciseId),
    ]);

    const passed = progress?.status === 'passed';

    sendOk(response, {
      exercise: toStudentView(exercise),
      session,
      progress: {
        status: progress?.status ?? 'not_started',
        attempts: progress?.attempts ?? 0,
        hintsRevealed: progress?.hintsRevealed ?? 0,
        solutionRevealed: progress?.solutionRevealed ?? false,
      },
      // Restore hints the student already unlocked, so a reload does not hide
      // help they have been relying on.
      hints: exercise.hints.slice(0, progress?.hintsRevealed ?? 0),
      // Likewise for copilot consultations: a reload must not make the queue
      // look as though nothing was ever asked about.
      consultedAlertIds,
      // Drill prompts ship freely; their checks and answers do not.
      // `teach` is teaching material and names no answer, so it ships with the
      // prompt. `solution` and `checks` stay here, as always.
      practice: exercise.practice.map((drill) => ({
        id: drill.id,
        prompt: drill.prompt,
        teach: drill.teach,
        // The surface this drill needs, which may differ from its parent's: a
        // drill on a multiple-choice exercise is usually free text. Safe to
        // ship, and it has to be, or the client cannot render an input the
        // student can actually answer with.
        kind: practiceKindOf(drill, exercise),
        answerFormat: practiceAnswerFormatFor(drill, exercise),
      })),
      practiceState,
      nextExerciseId: nextExerciseId(exerciseId),
      // The answer is released after a pass, or if the student asked for it.
      ...(passed || progress?.solutionRevealed
        ? {
            solution: exercise.solution,
            expectedOutput: exercise.expectedOutput,
            ...(passed ? { debrief: exercise.debrief } : {}),
          }
        : {}),
    });
  }),
);

const runSchema = z.object({
  input: z.string().max(2_000, 'That command is too long.'),
  /** Grade against a practice drill rather than the exercise itself. */
  practiceId: z.string().max(64).optional(),
  /** Grade again even though the exercise is already passed ("try again"). */
  regrade: z.boolean().optional(),
});

learningRouter.post(
  '/exercises/:exerciseId/run',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const exerciseId = request.params.exerciseId!;

    if (!(await canAccess(userId, exerciseId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'That exercise is not unlocked yet.');
    }

    const { input, practiceId, regrade } = runSchema.parse(request.body);
    const result = await runCommand(userId, exerciseId, input, { practiceId, regrade });

    // A pass releases the worked solution and the debrief along with it.
    const exercise = getExercise(exerciseId)!;
    sendOk(response, {
      ...result,
      ...(result.evaluation?.passed && !practiceId
        ? {
            solution: exercise.solution,
            expectedOutput: exercise.expectedOutput,
            debrief: exercise.debrief,
            nextExerciseId: nextExerciseId(exerciseId),
          }
        : {}),
    });
  }),
);

/**
 * Reveal the next hint.
 *
 * Hints are handed out one at a time and the count is recorded, so a reload
 * restores the help a student already used rather than hiding it again. Asking
 * for help is never penalised -- the count exists so instructors can see which
 * exercises are too hard.
 */
learningRouter.post(
  '/exercises/:exerciseId/hint',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const exerciseId = request.params.exerciseId!;

    const exercise = getExercise(exerciseId);
    if (!exercise) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such exercise.');
    if (!(await canAccess(userId, exerciseId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'That exercise is not unlocked yet.');
    }

    const existing = await prisma.exerciseProgress.findUnique({
      where: { userId_exerciseId: { userId, exerciseId } },
    });

    const nextCount = Math.min((existing?.hintsRevealed ?? 0) + 1, exercise.hints.length);

    await prisma.exerciseProgress.upsert({
      where: { userId_exerciseId: { userId, exerciseId } },
      create: {
        userId,
        exerciseId,
        packageId: exercise.packageId,
        moduleId: exercise.moduleId,
        status: 'in_progress',
        hintsRevealed: nextCount,
      },
      update: { hintsRevealed: nextCount },
    });

    sendOk(response, {
      hints: exercise.hints.slice(0, nextCount),
      hintsRevealed: nextCount,
      hintCount: exercise.hints.length,
      /** Once the hints run out, the answer is the only place left to go. */
      exhausted: nextCount >= exercise.hints.length,
    });
  }),
);

/**
 * Show the worked answer, on explicit request.
 *
 * Deliberately a separate action from hints: a student should always know the
 * moment they chose to be told rather than shown. The exercise still has to be
 * run to be passed -- this hands over the answer, not the pass.
 */
learningRouter.post(
  '/exercises/:exerciseId/solution',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const exerciseId = request.params.exerciseId!;

    const exercise = getExercise(exerciseId);
    if (!exercise) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such exercise.');
    if (!(await canAccess(userId, exerciseId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'That exercise is not unlocked yet.');
    }

    await prisma.exerciseProgress.upsert({
      where: { userId_exerciseId: { userId, exerciseId } },
      create: {
        userId,
        exerciseId,
        packageId: exercise.packageId,
        moduleId: exercise.moduleId,
        status: 'in_progress',
        solutionRevealed: true,
      },
      update: { solutionRevealed: true },
    });

    sendOk(response, {
      solution: exercise.solution,
      expectedOutput: exercise.expectedOutput,
    });
  }),
);

learningRouter.post(
  '/exercises/:exerciseId/reset',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const session = await resetSession(userId, request.params.exerciseId!);
    sendOk(response, { session });
  }),
);

learningRouter.get(
  '/progress',
  asyncRoute(async (request, response) => {
    sendOk(response, await getOverview(userIdOf(request)));
  }),
);

/**
 * The alert queue for an exercise.
 *
 * Returns the queue exactly as an operator would see it in a console. The
 * ground truth lives in a different structure that this handler never touches --
 * see services/alerts.ts. Shipping it would be the alert-queue equivalent of
 * shipping the exercise's checks.
 */
learningRouter.get(
  '/exercises/:exerciseId/queue',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const exerciseId = request.params.exerciseId!;

    const exercise = getExercise(exerciseId);
    if (!exercise) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such exercise.');
    if (!(await canAccess(userId, exerciseId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'That exercise is not unlocked yet.');
    }
    if (!exercise.queueId) {
      throw new HttpError(400, API_ERROR_CODES.validationFailed, 'That exercise has no alert queue.');
    }

    const queue = queueForStudent(exercise.queueId);
    if (!queue) {
      throw new HttpError(500, API_ERROR_CODES.internal, 'The alert queue for this exercise is missing.');
    }

    sendOk(response, { queue });
  }),
);

/**
 * The AI copilot's analysis of one alert.
 *
 * Served one alert at a time, and the request is RECORDED. Both of those are
 * deliberate.
 *
 * Serving the whole queue's analyses at once would be cheaper and would destroy
 * the thing being taught: "did you ask the assistant about this alert before
 * dispositioning it" is graded, and it cannot be graded if every analysis
 * arrives whether or not anybody reads one.
 *
 * Recording it here rather than trusting a client report is the same reasoning
 * that keeps the terminal and the exercise checks on the server. A student can
 * see their own consultation count; they cannot write it.
 *
 * The response carries `CopilotAnalysis` and nothing else. Whether the analysis
 * is any good lives in the flaw table, which this handler never touches -- see
 * services/copilot.ts.
 */
learningRouter.get(
  '/exercises/:exerciseId/copilot/:alertId',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const exerciseId = request.params.exerciseId!;
    const alertId = request.params.alertId!;

    const exercise = getExercise(exerciseId);
    if (!exercise) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such exercise.');
    if (!(await canAccess(userId, exerciseId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'That exercise is not unlocked yet.');
    }
    if (!exercise.queueId) {
      throw new HttpError(400, API_ERROR_CODES.validationFailed, 'That exercise has no alert queue.');
    }

    // The alert must belong to THIS exercise's queue. Without this, a student
    // could pull analyses for a queue they have not unlocked, and -- worse --
    // rack up consultations against an exercise they are not working.
    const inQueue = queueForStudent(exercise.queueId)?.alerts.some((alert) => alert.id === alertId);
    if (!inQueue) {
      throw new HttpError(404, API_ERROR_CODES.notFound, 'That alert is not in this exercise’s queue.');
    }

    const analysis = analysisFor(alertId);
    if (!analysis) {
      throw new HttpError(500, API_ERROR_CODES.internal, 'The copilot has no analysis for that alert.');
    }

    await recordConsultation(userId, exerciseId, alertId);

    sendOk(response, {
      analysis,
      /** So the UI can show progress against a `copilot-consulted` requirement. */
      consultedAlertIds: await consultedAlerts(userId, exerciseId),
    });
  }),
);

const submitSchema = z.object({
  /** Multiple-choice selections. */
  selectedOptionIds: z.array(z.string().max(64)).max(32).optional(),
  /** Short-answer text. Capped generously -- these are paragraphs, not essays. */
  answerText: z.string().max(8_000).optional(),
  /** Alert triage dispositions. The cap sits above the largest queue. */
  triage: z
    .array(
      z.object({
        alertId: z.string().max(32),
        decision: z.enum(TRIAGE_DECISIONS),
        justification: z.string().max(2_000).optional(),
      }),
    )
    .max(500)
    .optional(),
  /** Incident decision: what was chosen, or in what order it would be done. */
  decision: z
    .object({
      optionIds: z.array(z.string().max(64)).max(32).optional(),
      ordering: z.array(z.string().max(64)).max(32).optional(),
      justification: z.string().max(4_000).optional(),
    })
    .optional(),
  /**
   * Model Lab: the payloads the student is putting their name to.
   *
   * The cap is small on purpose. Several exercises impose a tighter budget of
   * their own, and a submission is evidence for a finding rather than a test
   * log -- there is no exercise here for which fifty payloads is the right
   * answer.
   */
  probes: z
    .array(
      z.object({
        payload: z.string().max(20_000),
        channel: z.enum(PROBE_CHANNELS).optional(),
        rationale: z.string().max(1_000).optional(),
      }),
    )
    .max(50)
    .optional(),
  /** Model Lab: the defence set the student chose, for hardening exercises. */
  defences: z.array(z.enum(DEFENCES)).max(DEFENCES.length).optional(),
  practiceId: z.string().max(64).optional(),
  regrade: z.boolean().optional(),
});

/**
 * Answer an exercise that is not worked in the terminal.
 *
 * Triage, multiple-choice, and short-answer all land here. As with the terminal
 * path, a pass releases the worked solution and the debrief -- and for triage,
 * the per-alert explanation of everything that was got wrong.
 */
learningRouter.post(
  '/exercises/:exerciseId/submit',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const exerciseId = request.params.exerciseId!;

    if (!(await canAccess(userId, exerciseId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'That exercise is not unlocked yet.');
    }

    const { practiceId, regrade, ...answer } = submitSchema.parse(request.body);
    const result = await submitAnswer(userId, exerciseId, answer, { practiceId, regrade });

    const exercise = getExercise(exerciseId)!;
    sendOk(response, {
      ...result,
      ...(result.evaluation.passed && !practiceId
        ? {
            solution: exercise.solution,
            expectedOutput: exercise.expectedOutput,
            debrief: exercise.debrief,
            nextExerciseId: nextExerciseId(exerciseId),
            // The Model Lab post-mortem explains which controls the deployment
            // had and why the attack landed. Released on a pass and never
            // before, on the same terms as the worked solution: being told
            // which control is missing before you have looked teaches nothing
            // about looking.
            ...(exercise.modelId ? { postMortem: postMortemFor(exercise.modelId) } : {}),
          }
        : {}),
    });
  }),
);

/**
 * The model under test for a Model Lab exercise.
 *
 * Returns the card: what the system is for, where it sits, how much traffic it
 * takes, and what the owning team claim about its defences. What it does NOT
 * return is which defences are actually deployed -- that is the answer key, it
 * lives on a different type, and no route assembles it. See
 * services/modelLab.ts.
 */
learningRouter.get(
  '/exercises/:exerciseId/model',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const exerciseId = request.params.exerciseId!;

    const exercise = getExercise(exerciseId);
    if (!exercise) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such exercise.');
    if (!(await canAccess(userId, exerciseId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'That exercise is not unlocked yet.');
    }
    // A practice drill may target a different deployment from its parent
    // exercise -- "same skill, different target" is the whole point of a drill,
    // and here the target is the model.
    const practiceId = typeof request.query.practiceId === 'string' ? request.query.practiceId : undefined;
    const drill = practiceId
      ? exercise.practice.find((item) => item.id === practiceId)
      : undefined;
    if (practiceId && !drill) {
      throw new HttpError(404, API_ERROR_CODES.notFound, `No practice drill "${practiceId}".`);
    }

    const modelId = drill?.modelId ?? exercise.modelId;
    if (!modelId) {
      throw new HttpError(400, API_ERROR_CODES.validationFailed, 'That exercise has no model under test.');
    }

    const card = modelCard(modelId);
    if (!card) {
      throw new HttpError(500, API_ERROR_CODES.internal, 'The model for this exercise is missing.');
    }

    sendOk(response, {
      model: card,
      // The suite the student's defences will be measured against, when there
      // is one. Shipped in full: grading somebody against a test set they were
      // not allowed to read would be a worse lesson than any it could teach.
      ...(exercise.suiteId ? { suite: suite(exercise.suiteId) } : {}),
    });
  }),
);

const probeSchema = z.object({
  probes: z
    .array(
      z.object({
        payload: z.string().max(20_000),
        channel: z.enum(PROBE_CHANNELS).optional(),
        rationale: z.string().max(1_000).optional(),
      }),
    )
    .min(1)
    .max(10),
  defences: z.array(z.enum(DEFENCES)).max(DEFENCES.length).optional(),
  /** Probe the drill's model rather than the exercise's, when one is active. */
  practiceId: z.string().max(64).optional(),
});

/**
 * Fire probes at a model WITHOUT grading anything.
 *
 * This is the Send button, and it is deliberately not the Submit button. A
 * student may probe as much as they like at no cost: testing is mostly failure,
 * and a platform that recorded every failed payload as a failed attempt would
 * teach people to think before trying rather than to try systematically, which
 * is precisely backwards for this discipline.
 *
 * Nothing here touches progress. The graded path is POST /submit with `probes`.
 */
learningRouter.post(
  '/exercises/:exerciseId/probe',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const exerciseId = request.params.exerciseId!;

    const exercise = getExercise(exerciseId);
    if (!exercise) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such exercise.');
    if (!(await canAccess(userId, exerciseId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'That exercise is not unlocked yet.');
    }
    const { probes, defences, practiceId } = probeSchema.parse(request.body);
    const drill = practiceId
      ? exercise.practice.find((item) => item.id === practiceId)
      : undefined;
    if (practiceId && !drill) {
      throw new HttpError(404, API_ERROR_CODES.notFound, `No practice drill "${practiceId}".`);
    }

    const modelId = drill?.modelId ?? exercise.modelId;
    if (!modelId) {
      throw new HttpError(400, API_ERROR_CODES.validationFailed, 'That exercise has no model under test.');
    }

    const results = probe(modelId, probes, defences);
    if (!results) {
      throw new HttpError(500, API_ERROR_CODES.internal, 'The model for this exercise is missing.');
    }

    sendOk(response, { results });
  }),
);

/**
 * The decision point an incident exercise puts the student at.
 *
 * Returns the situation, the snapshot, and the options as labels. What each
 * option would actually cause is the answer key and lives on the server-side
 * decision point -- see services/incidents.ts. Shipping it would turn a decision
 * into a walkthrough.
 */
learningRouter.get(
  '/exercises/:exerciseId/decision',
  asyncRoute(async (request, response) => {
    const userId = userIdOf(request);
    const exerciseId = request.params.exerciseId!;

    const exercise = getExercise(exerciseId);
    if (!exercise) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such exercise.');
    if (!(await canAccess(userId, exerciseId))) {
      throw new HttpError(403, API_ERROR_CODES.exerciseLocked, 'That exercise is not unlocked yet.');
    }
    if (!exercise.decisionPointId) {
      throw new HttpError(
        400,
        API_ERROR_CODES.validationFailed,
        'That exercise has no decision point.',
      );
    }

    const point = pointForStudent(exercise.decisionPointId);
    if (!point) {
      throw new HttpError(
        500,
        API_ERROR_CODES.internal,
        'The decision point for this exercise is missing.',
      );
    }

    sendOk(response, { point });
  }),
);
