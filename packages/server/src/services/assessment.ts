/**
 * Assessment persistence and flow.
 *
 * WHY RESPONSES ARE SAVED AS THEY GO
 *
 * The instrument is seventy items. Somebody will get halfway through, close the
 * tab, and come back tomorrow, and if that loses their answers they will not
 * start again. Every answer is written immediately, so the only thing an
 * abandoned session costs is the questions they had not reached.
 *
 * WHY RETAKING REPLACES RATHER THAN APPENDS
 *
 * There is one row per learner. Retaking a dimension overwrites the answers for
 * that dimension's items and clears the cached report. Keeping historical
 * answers would mean deciding which set counts, and a stale answer from three
 * months ago should not quietly keep steering a recommendation.
 */

import type { AssessmentReport, ItemResponse, LearnerProfile } from '@soc/shared';
import { DIMENSIONS } from '@soc/shared';

import { ITEMS, ITEM_BY_ID, itemsForDimension } from '../content/assessment/items.js';
import { buildReport } from '../content/assessment/report.js';
import { prisma } from '../db/client.js';

/** Responses keyed by item id, which is how they are stored. */
type ResponseMap = Record<string, { value?: number; optionId?: string }>;

function parseResponses(json: string): ResponseMap {
  try {
    const parsed: unknown = JSON.parse(json);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as ResponseMap;
  } catch {
    // A corrupt blob should not lock somebody out of their own assessment.
  }
  return {};
}

function parseProfile(json: string): LearnerProfile {
  try {
    const parsed: unknown = JSON.parse(json);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as LearnerProfile;
  } catch {
    // Same reasoning as above.
  }
  return {};
}

function toResponseList(map: ResponseMap): ItemResponse[] {
  return Object.entries(map)
    .filter(([itemId]) => ITEM_BY_ID.has(itemId))
    .map(([itemId, response]) => ({ itemId, ...response }));
}

/** Load, creating an empty session on first visit. */
async function loadOrCreate(userId: string) {
  const existing = await prisma.assessmentSession.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.assessmentSession.create({ data: { userId } });
}

export interface AssessmentState {
  /** Every item, in order, so the client can render a progress bar. */
  totalItems: number;
  answeredItems: number;
  /** Answers so far, for resuming mid-way. */
  responses: ItemResponse[];
  profile: LearnerProfile;
  /** The next unanswered item, or null when everything is answered. */
  nextItemId: string | null;
  /** Per-dimension progress, so a learner can retake just one section. */
  dimensions: Array<{
    dimension: string;
    label: string;
    total: number;
    answered: number;
    complete: boolean;
  }>;
  /** Present once submitted. */
  report: AssessmentReport | null;
  completedAt: string | null;
}

const DIMENSION_LABELS_LOCAL: Record<string, string> = {
  pace_pressure: 'Work Pace and Pressure',
  problem_solving: 'Problem-Solving Style',
  interpersonal: 'Working With People',
  detail_bigpicture: 'Detail and Big Picture',
  interests_energy: 'Interests and Energy',
  life_balance: 'Life and Work Balance',
};

function buildState(responsesMap: ResponseMap, profile: LearnerProfile, report: AssessmentReport | null, completedAt: Date | null): AssessmentState {
  const answeredIds = new Set(Object.keys(responsesMap).filter((id) => ITEM_BY_ID.has(id)));
  const next = ITEMS.find((item) => !answeredIds.has(item.id)) ?? null;

  return {
    totalItems: ITEMS.length,
    answeredItems: answeredIds.size,
    responses: toResponseList(responsesMap),
    profile,
    nextItemId: next?.id ?? null,
    dimensions: DIMENSIONS.map((dimension) => {
      const items = itemsForDimension(dimension);
      const answered = items.filter((item) => answeredIds.has(item.id)).length;
      return {
        dimension,
        label: DIMENSION_LABELS_LOCAL[dimension] ?? dimension,
        total: items.length,
        answered,
        complete: answered === items.length,
      };
    }),
    report,
    completedAt: completedAt?.toISOString() ?? null,
  };
}

function parseReport(json: string | null): AssessmentReport | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as AssessmentReport;
  } catch {
    return null;
  }
}

export async function getState(userId: string): Promise<AssessmentState> {
  const session = await loadOrCreate(userId);
  return buildState(
    parseResponses(session.responsesJson),
    parseProfile(session.profileJson),
    parseReport(session.reportJson),
    session.completedAt,
  );
}

/**
 * Record answers.
 *
 * Any new answer invalidates a cached report, because a report that no longer
 * reflects the answers is worse than no report at all.
 */
export async function saveResponses(userId: string, incoming: ItemResponse[]): Promise<AssessmentState> {
  const session = await loadOrCreate(userId);
  const responses = parseResponses(session.responsesJson);

  let changed = false;
  for (const response of incoming) {
    const item = ITEM_BY_ID.get(response.itemId);
    if (!item) continue;

    // Validate against the item's own shape, so a malformed or hand-crafted
    // request cannot poison the scoring with an out-of-range value.
    if (item.kind === 'likert') {
      if (typeof response.value !== 'number' || !Number.isInteger(response.value)) continue;
      if (response.value < 1 || response.value > 5) continue;
      responses[response.itemId] = { value: response.value };
      changed = true;
    } else {
      if (typeof response.optionId !== 'string') continue;
      if (!item.options.some((option) => option.id === response.optionId)) continue;
      responses[response.itemId] = { optionId: response.optionId };
      changed = true;
    }
  }

  const updated = await prisma.assessmentSession.update({
    where: { userId },
    data: {
      responsesJson: JSON.stringify(responses),
      ...(changed ? { reportJson: null } : {}),
    },
  });

  return buildState(
    parseResponses(updated.responsesJson),
    parseProfile(updated.profileJson),
    parseReport(updated.reportJson),
    updated.completedAt,
  );
}

/** Score the answers so far and cache the report. */
export async function submit(userId: string): Promise<AssessmentReport> {
  const session = await loadOrCreate(userId);
  const responses = toResponseList(parseResponses(session.responsesJson));
  const report = buildReport(responses);

  await prisma.assessmentSession.update({
    where: { userId },
    data: {
      reportJson: JSON.stringify(report),
      completedAt: session.completedAt ?? new Date(),
    },
  });

  return report;
}

/**
 * Clear one dimension's answers so it can be retaken.
 *
 * The spec asks for this explicitly, and it is the humane option: somebody who
 * realises halfway through that they misread the pressure questions should not
 * have to redo all seventy items to fix it.
 */
export async function retakeDimension(userId: string, dimension: string): Promise<AssessmentState> {
  if (!DIMENSIONS.includes(dimension as never)) {
    throw new Error(`Unknown dimension: ${dimension}`);
  }

  const session = await loadOrCreate(userId);
  const responses = parseResponses(session.responsesJson);

  for (const item of itemsForDimension(dimension)) {
    delete responses[item.id];
  }

  const updated = await prisma.assessmentSession.update({
    where: { userId },
    data: { responsesJson: JSON.stringify(responses), reportJson: null },
  });

  return buildState(
    parseResponses(updated.responsesJson),
    parseProfile(updated.profileJson),
    null,
    updated.completedAt,
  );
}

/** Wipe everything and start over. */
export async function resetAssessment(userId: string): Promise<AssessmentState> {
  await loadOrCreate(userId);
  const updated = await prisma.assessmentSession.update({
    where: { userId },
    data: { responsesJson: '{}', reportJson: null, completedAt: null },
  });
  return buildState({}, parseProfile(updated.profileJson), null, null);
}

/**
 * Update the durable profile.
 *
 * Kept separate from responses because a learner may choose a track without
 * ever taking the assessment, and because their chosen track should survive a
 * retake of the questions.
 */
export async function updateProfile(userId: string, patch: Partial<LearnerProfile>): Promise<LearnerProfile> {
  const session = await loadOrCreate(userId);
  const profile = { ...parseProfile(session.profileJson), ...patch };

  const updated = await prisma.assessmentSession.update({
    where: { userId },
    data: { profileJson: JSON.stringify(profile) },
  });

  return parseProfile(updated.profileJson);
}

export async function getProfile(userId: string): Promise<LearnerProfile> {
  const session = await loadOrCreate(userId);
  return parseProfile(session.profileJson);
}
