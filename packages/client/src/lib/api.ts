/**
 * The one place the client talks to the server.
 *
 * Every response arrives in the same envelope, so unwrapping happens once here
 * rather than at every call site. Failures become thrown ApiCallError, which the
 * UI catches and shows.
 */

import type {
  ApiError,
  ApiResponse,
  Evaluation,
  ExerciseKind,
  PackageSummary,
  ProgressOverview,
  PublicUser,
  ScrollbackEntry,
  Teach,
  TrackSummary,
  TerminalSessionState,
} from '@soc/shared';

export class ApiCallError extends Error {
  constructor(
    readonly status: number,
    readonly error: ApiError,
  ) {
    super(error.message);
    this.name = 'ApiCallError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    // Sessions live in an httpOnly cookie, so it must ride along.
    credentials: 'include',
    headers: init.body ? { 'Content-Type': 'application/json' } : {},
    ...init,
  });

  let body: ApiResponse<T>;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiCallError(response.status, {
      code: 'internal_error',
      message: `The server returned an unreadable response (HTTP ${response.status}).`,
    });
  }

  if (!body.ok) throw new ApiCallError(response.status, body.error);
  return body.data;
}

// --- auth --------------------------------------------------------------------

export const auth = {
  me: () => request<{ user: PublicUser }>('/auth/me'),

  login: (identifier: string, password: string) =>
    request<{ user: PublicUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),

  register: (username: string, email: string, password: string) =>
    request<{ user: PublicUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  logout: () => request<unknown>('/auth/logout', { method: 'POST' }),
};

// --- learning ----------------------------------------------------------------

export interface PackageDetail {
  id: string;
  title: string;
  summary: string;
  outcomes: string[];
  modules: Array<{
    id: string;
    title: string;
    summary: string;
    order: number;
    exercises: Array<{ id: string; title: string; order: number; kind: ExerciseKind }>;
  }>;
}

export interface ExerciseView {
  id: string;
  moduleId: string;
  packageId: string;
  order: number;
  title: string;
  kind: ExerciseKind;
  goal: string;
  prompt: string;
  teach: Teach;
  hintCount: number;
}

export interface ExerciseDetail {
  exercise: ExerciseView;
  session: TerminalSessionState;
  progress: {
    status: string;
    attempts: number;
    hintsRevealed: number;
    solutionRevealed: boolean;
  };
  /** Hints the student has already unlocked, restored across reloads. */
  hints: string[];
  /** Optional extra drills on the same skill. Prompts only; no answers. */
  practice: Array<{ id: string; prompt: string }>;
  practiceState: Array<{ practiceId: string; passed: boolean; attempts: number }>;
  nextExerciseId: string | null;
  /** Present once passed, or once the student asked to be shown the answer. */
  solution?: string;
  expectedOutput?: string;
  debrief?: string;
}

export interface HintResult {
  hints: string[];
  hintsRevealed: number;
  hintCount: number;
  exhausted: boolean;
}

export interface RunResult {
  input: string;
  output: string;
  exitCode: number;
  cwd: string;
  evaluation?: Evaluation;
  solution?: string;
  expectedOutput?: string;
  debrief?: string;
  nextExerciseId?: string | null;
}

export const learning = {
  packages: () => request<{ packages: PackageSummary[] }>('/learning/packages'),

  packageDetail: (packageId: string) => request<PackageDetail>(`/learning/packages/${packageId}`),

  exercise: (exerciseId: string) => request<ExerciseDetail>(`/learning/exercises/${exerciseId}`),

  tracks: () => request<{ tracks: TrackSummary[] }>('/learning/tracks'),

  run: (exerciseId: string, input: string, options: { practiceId?: string; regrade?: boolean } = {}) =>
    request<RunResult>(`/learning/exercises/${exerciseId}/run`, {
      method: 'POST',
      body: JSON.stringify({ input, ...options }),
    }),

  hint: (exerciseId: string) =>
    request<HintResult>(`/learning/exercises/${exerciseId}/hint`, { method: 'POST' }),

  solution: (exerciseId: string) =>
    request<{ solution: string; expectedOutput: string }>(
      `/learning/exercises/${exerciseId}/solution`,
      { method: 'POST' },
    ),

  reset: (exerciseId: string) =>
    request<{ session: { exerciseId: string; cwd: string; scrollback: ScrollbackEntry[] } }>(
      `/learning/exercises/${exerciseId}/reset`,
      { method: 'POST' },
    ),

  progress: () => request<ProgressOverview>('/learning/progress'),
};
