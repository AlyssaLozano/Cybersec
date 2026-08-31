/**
 * Learning-mode routes: the catalogue, exercises, the terminal, and progress.
 */

import { Router } from 'express';
import { z } from 'zod';

import { API_ERROR_CODES } from '@soc/shared';

import {
  getExercise,
  getPackage,
  nextExerciseId,
  packageSummaries,
  toStudentView,
} from '../content/index.js';
import { TRACKS, getTrack, trackPackageIds } from '../content/tracks.js';
import { asyncRoute, HttpError, requireAuth, sendOk } from '../http.js';
import { canAccess, getOverview, getPracticeState } from '../services/progress.js';
import { openSession, resetSession, runCommand } from '../services/terminalSession.js';
import { prisma } from '../db/client.js';

export const learningRouter = Router();

learningRouter.use(requireAuth);

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
      const packages = trackPackageIds(track.id)
        .map((id) => byPackageId.get(id))
        .filter((pkg): pkg is NonNullable<typeof pkg> => pkg !== undefined);

      const exerciseCount = packages.reduce((sum, pkg) => sum + pkg.exerciseCount, 0);
      const passedCount = packages.reduce((sum, pkg) => sum + pkg.passedCount, 0);

      return {
        ...track,
        exerciseCount,
        passedCount,
        percentComplete: exerciseCount === 0 ? 0 : Math.round((passedCount / exerciseCount) * 100),
      };
    });

    sendOk(response, { tracks });
  }),
);

learningRouter.get(
  '/tracks/:trackId',
  asyncRoute(async (request, response) => {
    const track = getTrack(request.params.trackId!);
    if (!track) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such track.');
    sendOk(response, { track, packages: packageSummaries().filter((pkg) => trackPackageIds(track.id).includes(pkg.id)) });
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

    const [session, progress, practiceState] = await Promise.all([
      openSession(userId, exerciseId),
      prisma.exerciseProgress.findUnique({
        where: { userId_exerciseId: { userId, exerciseId } },
      }),
      getPracticeState(userId, exerciseId),
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
      // Drill prompts ship freely; their checks and answers do not.
      practice: exercise.practice.map((drill) => ({ id: drill.id, prompt: drill.prompt })),
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
