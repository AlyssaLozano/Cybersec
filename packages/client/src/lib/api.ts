/**
 * The one place the client talks to the server.
 *
 * Every response arrives in the same envelope, so unwrapping happens once here
 * rather than at every call site. Failures become thrown ApiCallError, which the
 * UI catches and shows.
 */

import type {
  AlertQueue,
  ApiError,
  BadgeCase,
  BadgeDefinition,
  ChatMessage,
  ChatRoom,
  CommunityEvent,
  EventAudience,
  EventKind,
  LobbyDoorId,
  LobbyView,
  RsvpStatus,
  BlueBoardAction,
  MatchMode,
  MatchSide,
  MatchView,
  RoomVisibility,
  FloorIdentity,
  SocRoleId,
  ScenarioDifficulty,
  AvatarId,
  AttackSuite,
  DefenceId,
  HardeningScore,
  ModelCard,
  ProbeEntry,
  ProbeResult,
  ApiResponse,
  AssessmentReport,
  DecisionOutcome,
  DecisionSubmission,
  StudentDecisionPoint,
  TriageDecision,
  TriageEntry,
  TriageScore,
  Certification,
  CollaborationScore,
  CopilotAnalysis,
  CopilotDebriefEntry,
  Dimension,
  Foundation,
  ItemResponse,
  LaneProfile,
  LearnerProfile,
  Track,
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

  register: (username: string, email: string, password: string, entryCode: string) =>
    request<{ user: PublicUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, entryCode }),
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
  /** Choices for multiple-choice exercises. */
  options?: Array<{ id: string; label: string }>;
  /**
   * Which alert queue to load, for triage exercises.
   *
   * Safe to hold client-side: the queue is what a real operator sees. The
   * ground truth is a server-only structure and never crosses the wire.
   */
  queueId?: string;
  /**
   * Whether this exercise offers the AI copilot.
   *
   * False for every triage exercise before Module 3.5, deliberately: those are
   * worked unaided, so that a student has judgement of their own to weigh an
   * assistant against by the time they meet one.
   */
  copilotEnabled?: boolean;
  /**
   * Which decision point to load, for incident-decision exercises.
   *
   * Safe to hold client-side: the point ships without the consequence or the
   * quality of any option, which between them are the entire answer.
   */
  decisionPointId?: string;
  /**
   * Which model the Model Lab loads, for model-probe exercises.
   *
   * Safe to hold client-side: it names a card, and a card has no field that
   * could carry a defence. Which controls the deployment actually has is the
   * answer key and never leaves the server.
   */
  modelId?: string;
  /** Which attack suite the student's defences are measured against, if any. */
  suiteId?: string;
  /**
   * Whether this exercise lets the student rebuild the deployment.
   *
   * Derived server-side from the exercise's own checks, so the control panel
   * appears exactly when something grades it. Not the same as having a suite:
   * one exercise asks the student to deploy a control and then break their own
   * fix with their own payloads.
   */
  defencesConfigurable?: boolean;
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
  /**
   * Alerts this student has already asked the copilot about.
   *
   * Restored on load for the same reason as hints: a reload must not make the
   * queue look as though nothing was ever asked, particularly when an exercise
   * requires a minimum number of consultations to pass.
   */
  consultedAlertIds: string[];
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
  /**
   * Badges this pass just earned, present only when it earned any.
   *
   * Carried on the pass rather than polled from the case, so the badge lands in
   * the same moment as the pass instead of being found later on a shelf.
   */
  earnedBadges?: BadgeDefinition[];
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

  /** The alert queue for a triage exercise. Carries no answer key. */
  queue: (exerciseId: string) =>
    request<{ queue: AlertQueue }>(`/learning/exercises/${exerciseId}/queue`),

  /**
   * The model under test, and the suite it will be measured against.
   *
   * `practiceId` matters here: a Model Lab drill may target a different
   * deployment from its parent exercise, which is the whole point of a drill in
   * this package: the same three payloads against different controls.
   */
  model: (exerciseId: string, practiceId?: string) =>
    request<{ model: ModelCard; suite?: AttackSuite }>(
      `/learning/exercises/${exerciseId}/model${practiceId ? `?practiceId=${encodeURIComponent(practiceId)}` : ''}`,
    ),

  /**
   * Fire probes at a model without being graded.
   *
   * This is the Send button, and it deliberately records nothing. Testing is
   * mostly failure, and a platform that logged every failed payload as a failed
   * attempt would teach people to guess carefully instead of testing
   * systematically. The graded path is `submitAnswer` with `probes`.
   */
  probe: (
    exerciseId: string,
    probes: ProbeEntry[],
    options: { defences?: DefenceId[]; practiceId?: string } = {},
  ) =>
    request<{ results: ProbeResult[] }>(`/learning/exercises/${exerciseId}/probe`, {
      method: 'POST',
      body: JSON.stringify({ probes, ...options }),
    }),

  /**
   * The AI copilot's read on one alert.
   *
   * Fetched one alert at a time rather than for the whole queue, because asking
   * is recorded and graded. Pre-loading every analysis would mean every alert
   * counted as consulted whether or not anybody read a word of it.
   *
   * The response carries what the assistant said and nothing about whether it is
   * any good. That is a separate table the server never sends before a student
   * has committed.
   */
  copilot: (exerciseId: string, alertId: string) =>
    request<{ analysis: CopilotAnalysis; consultedAlertIds: string[] }>(
      `/learning/exercises/${exerciseId}/copilot/${alertId}`,
    ),

  /**
   * Answer an exercise that is not worked in the terminal.
   *
   * Triage, multiple-choice, and short-answer share this endpoint: all three are
   * graded against the submission itself rather than against filesystem state.
   */
  /**
   * The decision point an incident exercise puts the student at.
   *
   * Carries the situation, the snapshot and the option labels. What each option
   * would actually cause stays server-side until the student commits.
   */
  decision: (exerciseId: string) =>
    request<{ point: StudentDecisionPoint }>(`/learning/exercises/${exerciseId}/decision`),

  submitAnswer: (
    exerciseId: string,
    answer: {
      selectedOptionIds?: string[];
      answerText?: string;
      triage?: TriageEntry[];
      decision?: DecisionSubmission;
      probes?: ProbeEntry[];
      defences?: DefenceId[];
    },
    options: { practiceId?: string; regrade?: boolean } = {},
  ) =>
    request<SubmitResult>(`/learning/exercises/${exerciseId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ ...answer, ...options }),
    }),
};

/** What the server returns from a non-terminal submission. */
export interface SubmitResult {
  evaluation: Evaluation;
  /**
   * Badges this pass just earned, present only when it earned any.
   *
   * Carried on the pass rather than polled from the case, so the badge lands in
   * the same moment as the pass instead of being found later on a shelf.
   */
  earnedBadges?: BadgeDefinition[];
  /**
   * Per-alert explanation of everything the student got wrong.
   *
   * Released only after decisions are committed: the same rule that governs the
   * worked solution, for the same reason.
   */
  triageDebrief?: {
    scores: TriageScore[];
    missed: Array<{
      alertId: string;
      yourDecision: TriageDecision | null;
      correct: TriageDecision;
      why: string;
    }>;
  };
  /**
   * Which of the copilot's suggestions were unsound, and how.
   *
   * Released on the same terms as `triageDebrief`. One entry per kind of
   * mistake rather than one per affected alert: a single planted mistake spans
   * seventy-nine alerts in the night shift, and repeating it that many times
   * would bury the entries that mattered.
   */
  copilotDebrief?: CopilotDebriefEntry[];
  /**
   * How the student worked with the copilot.
   *
   * Reported next to the triage scores, never merged into them: getting the
   * queue right and handling the assistant well are different skills.
   */
  collaboration?: CollaborationScore;
  /**
   * What every option at a decision point would have done.
   *
   * All options, not just the chosen ones: most of the learning in a decision
   * exercise is in reading what the others would have cost.
   */
  decisionOutcomes?: DecisionOutcome[];
  /**
   * What happened to each submitted probe.
   *
   * Returned whether or not the exercise passed: it is the evidence being
   * graded, and hiding it would make a failure unreadable. Each result reports
   * the STAGE a payload died at and never the control that caught it.
   */
  probeResults?: ProbeResult[];
  /** How the chosen defence set scored against each suite the checks named. */
  hardening?: HardeningScore[];
  /**
   * Why the deployment held or failed, in terms of the controls it had.
   *
   * Released on a pass and never before, on the same terms as the worked
   * solution: being told which control is missing before you have looked
   * teaches nothing about looking.
   */
  postMortem?: string;
  solution?: string;
  expectedOutput?: string;
  debrief?: string;
  nextExerciseId?: string | null;
}

// --- Career Fit Analyzer -----------------------------------------------------

/** An item as the client sees it: no scoring weights, by design. */
export type ClientItem =
  | { id: string; kind: 'likert'; dimension: Dimension; statement: string }
  | {
      id: string;
      kind: 'choice';
      dimension: Dimension;
      prompt: string;
      detail?: string;
      options: Array<{ id: string; label: string; detail?: string }>;
    };

export interface DimensionProgress {
  dimension: Dimension;
  label: string;
  total: number;
  answered: number;
  complete: boolean;
}

export interface AssessmentState {
  totalItems: number;
  answeredItems: number;
  responses: ItemResponse[];
  profile: LearnerProfile;
  nextItemId: string | null;
  dimensions: DimensionProgress[];
  report: AssessmentReport | null;
  completedAt: string | null;
}

export interface LaneDetail {
  lane: LaneProfile;
  certifications: Certification[];
  certPhilosophy: { headline: string; body: string[] };
  track?: Track;
  foundations?: Array<Foundation & { playable: boolean }>;
  readiness?: {
    foundationsTotal: number;
    foundationsPlayable: number;
    stagesTotal: number;
    stagesPlayable: number;
  };
}

export const assessment = {
  items: () =>
    request<{ items: ClientItem[]; dimensions: Dimension[]; disclaimer: string }>('/assessment/items'),

  state: () => request<AssessmentState>('/assessment/state'),

  save: (responses: ItemResponse[]) =>
    request<AssessmentState>('/assessment/responses', {
      method: 'POST',
      body: JSON.stringify({ responses }),
    }),

  submit: () =>
    request<{ report: AssessmentReport; shareable: string }>('/assessment/submit', { method: 'POST' }),

  retake: (dimension: Dimension) =>
    request<AssessmentState>('/assessment/retake', {
      method: 'POST',
      body: JSON.stringify({ dimension }),
    }),

  reset: () => request<AssessmentState>('/assessment/reset', { method: 'POST' }),

  lanes: () =>
    request<{ lanes: LaneProfile[]; toolPhilosophy: { headline: string; body: string[] } }>(
      '/assessment/lanes',
    ),

  lane: (laneId: string) => request<LaneDetail>(`/assessment/lanes/${laneId}`),

  profile: () => request<{ profile: LearnerProfile }>('/assessment/profile'),

  updateProfile: (patch: Partial<LearnerProfile>) =>
    request<{ profile: LearnerProfile }>('/assessment/profile', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),
};

// --- war rooms ---------------------------------------------------------------

/**
 * A room as the browser is allowed to see it.
 *
 * `joinCode` is null for everybody except the host. The server decides that in
 * `toClientRoom`; nothing here should try to reconstruct it.
 */
export interface ClientRoom {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  difficulty: ScenarioDifficulty;
  startsAt: string;
  visibility: RoomVisibility;
  joinCode: string | null;
  status: 'scheduled' | 'running' | 'complete' | 'cancelled';
  hostUserId: string;
  seats: Array<{ role: SocRoleId; occupant: FloorIdentity | null }>;
  seatsTotal: number;
  seatsFilled: number;
  isHost: boolean;
  mySeat: SocRoleId | null;
}

/**
 * One chair as this viewer sees it.
 *
 * There is no entry here for a role the scenario does not seat, because the
 * room was built from the scenario's own role list. The picker renders this
 * array and never the role catalogue: a chart built from SOC_ROLE_IDS would
 * look right and would offer a chair with no evidence behind it.
 */
export interface SeatView {
  role: SocRoleId;
  occupant: FloorIdentity | null;
  selectable: boolean;
  blockedBecause: string | null;
}

export interface RoomDetail {
  room: ClientRoom;
  seating: SeatView[];
  readiness: {
    canStart: boolean;
    filled: number;
    total: number;
    /** Chairs nobody took. The lead reads a stand-in for each of these. */
    empty: SocRoleId[];
    /** Only the lead chair ever blocks a start. */
    blockers: string[];
    /** Costs of running short, which are warnings and not refusals. */
    notes: string[];
  };
  identity: FloorIdentity | null;
}

export interface RoomScenarioSummary {
  id: string;
  title: string;
  situation: string;
  defaultDifficulty: ScenarioDifficulty;
  durationMinutes: number;
  roles: SocRoleId[];
}

export const rooms = {
  /** Scenarios that can be scheduled, each with the seats it actually runs. */
  scenarios: () => request<RoomScenarioSummary[]>('/rooms/scenarios'),

  /** Open rooms, plus closed ones the caller hosts or holds a seat in. */
  list: () => request<{ rooms: ClientRoom[] }>('/rooms'),

  /** Room plus seat chart in one response, so the chart cannot go stale between two fetches. */
  get: (id: string, code?: string | null) =>
    request<RoomDetail>(`/rooms/${id}${code ? `?code=${encodeURIComponent(code)}` : ''}`),

  create: (body: {
    scenarioId: string;
    difficulty: ScenarioDifficulty;
    startsAt: string;
    visibility: RoomVisibility;
  }) => request<{ room: ClientRoom }>('/rooms', { method: 'POST', body: JSON.stringify(body) }),

  takeSeat: (id: string, role: SocRoleId, code?: string | null) =>
    request<Omit<RoomDetail, 'identity'>>(`/rooms/${id}/seat`, {
      method: 'POST',
      body: JSON.stringify({ role, code: code ?? null }),
    }),

  leaveSeat: (id: string) =>
    request<Omit<RoomDetail, 'identity'>>(`/rooms/${id}/seat`, { method: 'DELETE' }),

  handOver: (id: string, toUserId: string) =>
    request<Omit<RoomDetail, 'identity'>>(`/rooms/${id}/handover`, {
      method: 'POST',
      body: JSON.stringify({ toUserId }),
    }),

  /** The call sign and face this person uses on a floor. Null until they choose one. */
  identity: () => request<{ identity: FloorIdentity | null; avatars: readonly AvatarId[] }>(
    '/rooms/identity',
  ),

  setIdentity: (callSign: string, avatarId: AvatarId) =>
    request<{ identity: FloorIdentity }>('/rooms/identity', {
      method: 'PUT',
      body: JSON.stringify({ callSign, avatarId }),
    }),
};

// --- matches (red vs blue) ---------------------------------------------------

/** How the caller appears to their opponent. Never their real name. */
export interface MatchIdentityInput {
  callSign: string;
  avatarId: AvatarId;
}

/**
 * The target dossier and the caller's own move menu, scrubbed of scoring.
 *
 * Mirrors the server's RedBlueBrief. Defined here rather than imported because
 * it lives in server content, not in @soc/shared: the browser only ever sees
 * this scrubbed shape, never the resolver behind it.
 */
export interface MatchBrief {
  scenarioId: string;
  title: string;
  brief: string;
  you: MatchSide;
  /** `positional` briefs carry no options: the board in the view is the menu. */
  mode: MatchMode;
  dossier: { org: string; summary: string; facts: Array<{ k: string; v: string }> };
  options: Array<{ id: string; label: string; description: string }>;
}

/** A queue result also reports whether we joined a waiting match or opened one. */
export type QueueResult = MatchView & { joined: boolean };

/** A red-vs-blue scenario a match can be opened on. */
export interface MatchScenarioInfo {
  id: string;
  title: string;
  org: string;
  brief: string;
  /** Which game it is, so the lobby can say so before anyone commits to a seat. */
  mode: MatchMode;
}

export const matches = {
  /** The scenarios a match can be opened on. */
  scenarios: () => request<MatchScenarioInfo[]>('/matches/scenarios'),

  /** Every match the caller has a seat in, each already redacted to their side. */
  list: () => request<MatchView[]>('/matches'),

  /** The caller's redacted view of one match. Poll this to pick up a move. */
  get: (id: string) => request<MatchView>(`/matches/${id}`),

  /** Dossier and the caller's move menu. No scoring crosses the wire. */
  brief: (id: string) => request<MatchBrief>(`/matches/${id}/brief`),

  /** Open a match. Closed hands back a join code; open enters the queue. */
  open: (body: {
    scenarioId: string;
    difficulty: ScenarioDifficulty;
    visibility: RoomVisibility;
    side: MatchSide;
    identity: MatchIdentityInput;
  }) => request<MatchView>('/matches', { method: 'POST', body: JSON.stringify(body) }),

  /** Join the oldest waiting open match for this scenario, or open one and wait. */
  queue: (body: {
    scenarioId: string;
    difficulty: ScenarioDifficulty;
    side: MatchSide;
    identity: MatchIdentityInput;
  }) => request<QueueResult>('/matches/queue', { method: 'POST', body: JSON.stringify(body) }),

  /** Join a specific closed match by its invite code. */
  join: (body: { code: string; identity: MatchIdentityInput }) =>
    request<MatchView>('/matches/join', { method: 'POST', body: JSON.stringify(body) }),

  /** Take a turn. Rejected with 409 if it is not the caller's move. */
  move: (id: string, optionId: string, justification: string) =>
    request<MatchView>(`/matches/${id}/move`, {
      method: 'POST',
      body: JSON.stringify({ optionId, justification }),
    }),

  /**
   * Blue locks in its coverage on a board match, which opens it for play.
   *
   * The ids never come back out to Red: the response is the caller's own
   * redacted view, and the server is the only thing that ever holds the board.
   */
  place: (id: string, targetIds: string[]) =>
    request<MatchView>(`/matches/${id}/place`, {
      method: 'POST',
      body: JSON.stringify({ targetIds }),
    }),

  /** Red fires at one system. Rejected with 409 off-turn or out of phase. */
  fire: (id: string, targetId: string, justification: string) =>
    request<MatchView>(`/matches/${id}/fire`, {
      method: 'POST',
      body: JSON.stringify({ targetId, justification }),
    }),

  /** Blue's half of a board round. One of the three, and it costs the round. */
  blueAct: (
    id: string,
    action: BlueBoardAction,
    targetId: string,
    justification: string,
    fromId?: string,
  ) =>
    request<MatchView>(`/matches/${id}/blue-act`, {
      method: 'POST',
      body: JSON.stringify({ action, targetId, justification, fromId }),
    }),

  /** Forfeit or cancel. */
  abandon: (id: string) => request<MatchView>(`/matches/${id}/abandon`, { method: 'POST' }),

  /** Run one command in the defender's investigation terminal (higher tiers). */
  terminal: (id: string, command: string) =>
    request<{ output: string; cwd: string }>(`/matches/${id}/terminal`, {
      method: 'POST',
      body: JSON.stringify({ command }),
    }),

  /**
   * Run one command in Red's recon console (higher tiers). A recognised recon
   * command is a move, so this returns the tool output and the refreshed view.
   */
  attack: (id: string, command: string, justification: string) =>
    request<{ output: string; view: MatchView }>(`/matches/${id}/attack`, {
      method: 'POST',
      body: JSON.stringify({ command, justification }),
    }),
};

// --- the lobby ---------------------------------------------------------------

/**
 * The lobby is polled, not subscribed to.
 *
 * `presence` is both the heartbeat and the read: one call rather than a POST
 * followed by a GET, because they always happen together on a timer and
 * splitting them doubles the traffic while opening a window where the viewer is
 * missing from the list they were just added to.
 */
export const lobby = {
  /** Read the room without announcing yourself. Used before the first beat. */
  read: () => request<{ lobby: LobbyView; notice: string }>('/lobby'),

  /** Walk in, or say you are still here, and get the room back. */
  presence: (headingFor: LobbyDoorId | null) =>
    request<{ lobby: LobbyView; notice: string }>('/lobby/presence', {
      method: 'POST',
      body: JSON.stringify({ headingFor }),
    }),

  /** Leave deliberately, rather than fading out over seventy-five seconds. */
  leave: () => request<{ left: boolean }>('/lobby/presence', { method: 'DELETE' }),

  /**
   * Read a chat room.
   *
   * `after` is a message id and not a timestamp: two messages can share a
   * millisecond, and a timestamp cursor silently drops one of them.
   */
  messages: (roomId: string, after?: string | null) =>
    request<{ messages: ChatMessage[] }>(
      `/lobby/rooms/${encodeURIComponent(roomId)}/messages${after ? `?after=${encodeURIComponent(after)}` : ''}`,
    ),

  say: (roomId: string, body: string, eventId?: string | null) =>
    request<{ message: ChatMessage }>(`/lobby/rooms/${encodeURIComponent(roomId)}/messages`, {
      method: 'POST',
      body: JSON.stringify({ body, eventId: eventId ?? null }),
    }),

  /** Ask for a new room. It is public, and it waits for a reviewer. */
  requestRoom: (title: string, topic: string) =>
    request<{ room: ChatRoom }>('/lobby/rooms', {
      method: 'POST',
      body: JSON.stringify({ title, topic }),
    }),

  /** This person's own requests, so a decision reaches them. */
  myRequests: () => request<{ requests: ChatRoom[] }>('/lobby/rooms/mine'),

  /** Staff only. A 403 here is the client asking a question it should not have. */
  reviewQueue: () => request<{ pending: ChatRoom[] }>('/lobby/review'),

  review: (roomId: string, decision: 'approve' | 'reject', note: string | null) =>
    request<{ room: ChatRoom }>(`/lobby/review/${encodeURIComponent(roomId)}`, {
      method: 'POST',
      body: JSON.stringify({ decision, note }),
    }),

  closeRoom: (roomId: string, note: string) =>
    request<{ closed: boolean }>(`/lobby/review/${encodeURIComponent(roomId)}/close`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),

  hideMessage: (messageId: string) =>
    request<{ hidden: boolean }>(`/lobby/review/messages/${encodeURIComponent(messageId)}/hide`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),
};

// --- the event center --------------------------------------------------------

export const events = {
  list: (query: { from?: string; to?: string; audience?: EventAudience; kind?: EventKind } = {}) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    const suffix = params.toString();
    return request<{ events: CommunityEvent[] }>(`/events${suffix ? `?${suffix}` : ''}`);
  },

  get: (id: string) => request<{ event: CommunityEvent }>(`/events/${encodeURIComponent(id)}`),

  create: (body: {
    title: string;
    description: string;
    kind: EventKind;
    audience: EventAudience;
    startsAt: string;
    durationMinutes: number;
    roomId: string | null;
    capacity: number | null;
  }) => request<{ event: CommunityEvent }>('/events', { method: 'POST', body: JSON.stringify(body) }),

  rsvp: (id: string, status: RsvpStatus) =>
    request<{ event: CommunityEvent }>(`/events/${encodeURIComponent(id)}/rsvp`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  withdraw: (id: string) =>
    request<{ event: CommunityEvent }>(`/events/${encodeURIComponent(id)}/rsvp`, {
      method: 'DELETE',
    }),

  cancel: (id: string) =>
    request<{ event: CommunityEvent }>(`/events/${encodeURIComponent(id)}/cancel`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),
};

// --- badges ------------------------------------------------------------------

/**
 * Read-only, deliberately.
 *
 * Badges are awarded on the server when an exercise passes. A client route that
 * could grant one would make the badge evidence of nothing.
 */
export const badges = {
  case: () => request<BadgeCase>('/badges'),
};
