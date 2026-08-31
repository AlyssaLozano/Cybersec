/**
 * Progress tracking contracts.
 *
 * Status is a string union rather than a database enum so the schema ports
 * cleanly from SQLite (local) to Postgres (AWS) without a type migration.
 */

export const EXERCISE_STATUSES = ['not_started', 'in_progress', 'passed'] as const;
export type ExerciseStatus = (typeof EXERCISE_STATUSES)[number];

export interface ExerciseProgress {
  exerciseId: string;
  status: ExerciseStatus;
  attempts: number;
  /** ISO 8601. Null until the student passes. */
  completedAt: string | null;
  lastAttemptedAt: string | null;
}

export interface ModuleProgress {
  moduleId: string;
  title: string;
  order: number;
  exerciseCount: number;
  passedCount: number;
  exercises: ExerciseProgress[];
}

export interface PackageProgress {
  packageId: string;
  title: string;
  order: number;
  exerciseCount: number;
  passedCount: number;
  /** 0-100, rounded. */
  percentComplete: number;
  /** True once every exercise in the package has been passed. */
  complete: boolean;
  /** False when a prerequisite package is still incomplete. */
  unlocked: boolean;
  /** The exercise a "Resume" button should jump to; null when complete. */
  resumeExerciseId: string | null;
  modules: ModuleProgress[];
}

export interface ProgressOverview {
  packages: PackageProgress[];
  totalExercises: number;
  totalPassed: number;
  /** Where "Continue where you left off" should land. */
  resume: { packageId: string; exerciseId: string } | null;
}
