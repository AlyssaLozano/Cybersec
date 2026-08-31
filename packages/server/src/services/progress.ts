/**
 * Progress tracking and the resume calculation.
 *
 * Progress rows are created lazily on first attempt, so an untouched exercise
 * has no row at all. Everything here therefore treats "missing" as
 * "not_started" rather than assuming a row exists.
 */

import type {
  Evaluation,
  Exercise,
  ExerciseProgress,
  ExerciseStatus,
  ModuleProgress,
  PackageProgress,
  ProgressOverview,
} from '@soc/shared';

import { PACKAGES } from '../content/index.js';
import { prisma } from '../db/client.js';

/** Persist one attempt and update the exercise's status. */
export async function recordAttempt(
  userId: string,
  exercise: Exercise,
  input: string,
  evaluation: Evaluation,
): Promise<void> {
  const now = new Date();
  const status: ExerciseStatus = evaluation.passed ? 'passed' : 'in_progress';

  await prisma.$transaction([
    prisma.exerciseProgress.upsert({
      where: { userId_exerciseId: { userId, exerciseId: exercise.id } },
      create: {
        userId,
        exerciseId: exercise.id,
        packageId: exercise.packageId,
        moduleId: exercise.moduleId,
        status,
        attempts: 1,
        lastAttemptedAt: now,
        completedAt: evaluation.passed ? now : null,
      },
      update: {
        // A pass is permanent. Re-attempting a solved exercise to practise it
        // again must never be able to take the pass away.
        ...(evaluation.passed ? { status: 'passed', completedAt: now } : {}),
        attempts: { increment: 1 },
        lastAttemptedAt: now,
      },
    }),
    prisma.attemptLog.create({
      data: {
        userId,
        exerciseId: exercise.id,
        input,
        passed: evaluation.passed,
        failedJson: JSON.stringify(evaluation.failed.map((failure) => failure.type)),
      },
    }),
  ]);
}

/**
 * Persist one practice-drill attempt.
 *
 * Deliberately separate from recordAttempt: practice never affects unlocking,
 * the completion percentage, or an exercise's pass state. A student can drill as
 * often as they like with nothing at stake.
 */
export async function recordPracticeAttempt(
  userId: string,
  exerciseId: string,
  practiceId: string,
  input: string,
  evaluation: Evaluation,
): Promise<void> {
  const now = new Date();

  await prisma.$transaction([
    prisma.practiceProgress.upsert({
      where: { userId_practiceId: { userId, practiceId } },
      create: {
        userId,
        exerciseId,
        practiceId,
        passed: evaluation.passed,
        attempts: 1,
        lastAttemptedAt: now,
        completedAt: evaluation.passed ? now : null,
      },
      update: {
        // Once passed, a drill stays passed: re-practising can only help.
        ...(evaluation.passed ? { passed: true, completedAt: now } : {}),
        attempts: { increment: 1 },
        lastAttemptedAt: now,
      },
    }),
    prisma.attemptLog.create({
      data: {
        userId,
        exerciseId,
        practiceId,
        input,
        passed: evaluation.passed,
        failedJson: JSON.stringify(evaluation.failed.map((failure) => failure.type)),
      },
    }),
  ]);
}

/** Which drills a student has already passed, for the practice panel. */
export async function getPracticeState(
  userId: string,
  exerciseId: string,
): Promise<Array<{ practiceId: string; passed: boolean; attempts: number }>> {
  const rows = await prisma.practiceProgress.findMany({ where: { userId, exerciseId } });
  return rows.map((row) => ({
    practiceId: row.practiceId,
    passed: row.passed,
    attempts: row.attempts,
  }));
}

/**
 * Full progress across every package, including what to resume.
 *
 * One query for all progress rows, then assembled in memory. The catalogue is
 * small and lives in code, so this stays a single round trip regardless of how
 * many packages exist.
 */
export async function getOverview(userId: string): Promise<ProgressOverview> {
  const rows = await prisma.exerciseProgress.findMany({ where: { userId } });
  const byExerciseId = new Map(rows.map((row) => [row.exerciseId, row]));

  const progressFor = (exerciseId: string): ExerciseProgress => {
    const row = byExerciseId.get(exerciseId);
    return {
      exerciseId,
      status: (row?.status as ExerciseStatus) ?? 'not_started',
      attempts: row?.attempts ?? 0,
      completedAt: row?.completedAt?.toISOString() ?? null,
      lastAttemptedAt: row?.lastAttemptedAt?.toISOString() ?? null,
    };
  };

  const completedPackageIds = new Set<string>();
  const packages: PackageProgress[] = [];

  for (const pkg of PACKAGES) {
    const modules: ModuleProgress[] = pkg.modules.map((module) => {
      const exercises = module.exercises.map((exercise) => progressFor(exercise.id));
      return {
        moduleId: module.id,
        title: module.title,
        order: module.order,
        exerciseCount: exercises.length,
        passedCount: exercises.filter((exercise) => exercise.status === 'passed').length,
        exercises,
      };
    });

    const exerciseCount = modules.reduce((sum, module) => sum + module.exerciseCount, 0);
    const passedCount = modules.reduce((sum, module) => sum + module.passedCount, 0);
    const complete = exerciseCount > 0 && passedCount === exerciseCount;
    if (complete) completedPackageIds.add(pkg.id);

    // Resume points at the first exercise not yet passed, which is also the
    // furthest a student may go: progression is linear.
    const resumeExerciseId =
      pkg.modules
        .flatMap((module) => module.exercises)
        .find((exercise) => progressFor(exercise.id).status !== 'passed')?.id ?? null;

    packages.push({
      packageId: pkg.id,
      title: pkg.title,
      order: pkg.order,
      exerciseCount,
      passedCount,
      percentComplete: exerciseCount === 0 ? 0 : Math.round((passedCount / exerciseCount) * 100),
      complete,
      unlocked: pkg.prerequisites.every((id) => completedPackageIds.has(id)),
      resumeExerciseId,
      modules,
    });
  }

  const totalExercises = packages.reduce((sum, pkg) => sum + pkg.exerciseCount, 0);
  const totalPassed = packages.reduce((sum, pkg) => sum + pkg.passedCount, 0);

  const resumePackage = packages.find((pkg) => pkg.unlocked && pkg.resumeExerciseId !== null);

  return {
    packages,
    totalExercises,
    totalPassed,
    resume: resumePackage
      ? { packageId: resumePackage.packageId, exerciseId: resumePackage.resumeExerciseId! }
      : null,
  };
}

/**
 * Whether a student may open an exercise.
 *
 * Progression is linear, as the specification requires: every earlier exercise
 * must be passed first. The check runs on the server because a client-side lock
 * is decoration, not a rule.
 */
export async function canAccess(userId: string, exerciseId: string): Promise<boolean> {
  const ordered = PACKAGES.flatMap((pkg) => pkg.modules.flatMap((module) => module.exercises));
  const index = ordered.findIndex((exercise) => exercise.id === exerciseId);
  if (index <= 0) return index === 0;

  const requiredIds = ordered.slice(0, index).map((exercise) => exercise.id);
  const passed = await prisma.exerciseProgress.count({
    where: { userId, exerciseId: { in: requiredIds }, status: 'passed' },
  });
  return passed === requiredIds.length;
}
