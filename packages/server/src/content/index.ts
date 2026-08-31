/**
 * The content catalogue.
 *
 * Exercises live in code rather than the database so they are version
 * controlled, reviewable in a pull request, and type-checked. The database
 * stores only a student's progress *against* these ids.
 *
 * Phase 1 ships Package 1. Adding Packages 2-5 means writing the module files
 * and appending them to PACKAGES; nothing else in the system needs to change.
 */

import type { Exercise, LearningModule, LearningPackage, PackageSummary } from '@soc/shared';

import { PACKAGE_1 } from './package1.js';

export const PACKAGES: LearningPackage[] = [PACKAGE_1];

/** Every exercise across every package, in curriculum order. */
export const ALL_EXERCISES: Exercise[] = PACKAGES.flatMap((pkg) =>
  pkg.modules.flatMap((module) => module.exercises),
);

const EXERCISE_BY_ID = new Map(ALL_EXERCISES.map((exercise) => [exercise.id, exercise]));
const PACKAGE_BY_ID = new Map(PACKAGES.map((pkg) => [pkg.id, pkg]));

/**
 * Fail loudly at startup if the catalogue is malformed.
 *
 * A duplicate exercise id would silently corrupt progress tracking, because
 * progress rows are keyed by id. Better to refuse to boot than to award a pass
 * against the wrong exercise.
 */
function validateCatalogue(): void {
  const seen = new Set<string>();
  for (const exercise of ALL_EXERCISES) {
    if (seen.has(exercise.id)) {
      throw new Error(`Duplicate exercise id "${exercise.id}" in the content catalogue.`);
    }
    seen.add(exercise.id);

    if (exercise.checks.length === 0) {
      throw new Error(`Exercise "${exercise.id}" has no checks, so it could never be failed.`);
    }
    // A student who cannot already do the task must have something to read.
    if (!exercise.teach?.concept) {
      throw new Error(`Exercise "${exercise.id}" has no teaching material.`);
    }
    if (exercise.hints.length === 0) {
      throw new Error(`Exercise "${exercise.id}" has no hints, leaving a stuck student nowhere to go.`);
    }
    if (exercise.kind === 'multiple-choice' && (exercise.options?.length ?? 0) === 0) {
      throw new Error(`Multiple-choice exercise "${exercise.id}" has no options.`);
    }
  }
}
validateCatalogue();

export function getPackage(packageId: string): LearningPackage | null {
  return PACKAGE_BY_ID.get(packageId) ?? null;
}

export function getExercise(exerciseId: string): Exercise | null {
  return EXERCISE_BY_ID.get(exerciseId) ?? null;
}

export function getModule(moduleId: string): LearningModule | null {
  for (const pkg of PACKAGES) {
    const found = pkg.modules.find((module) => module.id === moduleId);
    if (found) return found;
  }
  return null;
}

/** Exercise ids in the order a student works through them. */
export function orderedExerciseIds(packageId?: string): string[] {
  const packages = packageId ? PACKAGES.filter((pkg) => pkg.id === packageId) : PACKAGES;
  return packages.flatMap((pkg) => pkg.modules.flatMap((module) => module.exercises.map((e) => e.id)));
}

/** The exercise after this one, or null at the end of the curriculum. */
export function nextExerciseId(exerciseId: string): string | null {
  const ids = orderedExerciseIds();
  const index = ids.indexOf(exerciseId);
  if (index === -1 || index === ids.length - 1) return null;
  return ids[index + 1]!;
}

/** Lightweight package list for menus, without shipping every exercise body. */
export function packageSummaries(): PackageSummary[] {
  return PACKAGES.map((pkg) => ({
    id: pkg.id,
    order: pkg.order,
    title: pkg.title,
    summary: pkg.summary,
    outcomes: pkg.outcomes,
    prerequisites: pkg.prerequisites,
    moduleCount: pkg.modules.length,
    exerciseCount: pkg.modules.reduce((sum, module) => sum + module.exercises.length, 0),
  }));
}

/**
 * The student-facing view of an exercise.
 *
 * Teaching material and hints ship freely -- they are the point, and withholding
 * them from someone who has never used a shell would just make them guess.
 *
 * The solution and the check definitions do NOT ship. Sending checks would hand
 * over the answer key, and the solution is released only on an explicit request
 * or after a pass, so a student always knows when they chose to be told.
 */
export function toStudentView(exercise: Exercise) {
  return {
    id: exercise.id,
    moduleId: exercise.moduleId,
    packageId: exercise.packageId,
    order: exercise.order,
    title: exercise.title,
    kind: exercise.kind,
    goal: exercise.goal,
    prompt: exercise.prompt,
    teach: exercise.teach,
    /** Only the count ships up front; the text arrives one hint at a time. */
    hintCount: exercise.hints.length,
    options: exercise.options,
  };
}
