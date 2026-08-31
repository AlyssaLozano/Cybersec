/**
 * Capability baseline persistence.
 *
 * Shares the AssessmentSession row with the career assessment, because the two
 * are one journey: what do you want, then what can you do, then here is what to
 * study. Splitting them across tables would mean two lookups every time a
 * dashboard renders and no benefit.
 *
 * Answers save one at a time, same as the assessment, for the same reason: this
 * takes ten minutes and somebody will close the tab halfway through it.
 */

import type { LaneId, ProbeResponse, ReadinessReport } from '@soc/shared';
import { LANES } from '@soc/shared';

import { PROBES, probesForLane } from '../content/capabilities.js';
import { buildReadinessReport } from '../content/readiness.js';
import { prisma } from '../db/client.js';

const PROBE_BY_ID = new Map(PROBES.map((probe) => [probe.id, probe]));

type ProbeMap = Record<string, string>;

function parseProbes(json: string): ProbeMap {
  try {
    const parsed: unknown = JSON.parse(json);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as ProbeMap;
  } catch {
    // A corrupt blob should not lock somebody out of their own baseline.
  }
  return {};
}

async function loadOrCreate(userId: string) {
  const existing = await prisma.assessmentSession.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.assessmentSession.create({ data: { userId } });
}

export interface BaselineState {
  laneId: LaneId | null;
  answered: number;
  total: number;
  responses: ProbeResponse[];
  /** The next unanswered probe for the chosen lane, or null when finished. */
  nextProbeId: string | null;
  report: ReadinessReport | null;
}

function toResponses(map: ProbeMap): ProbeResponse[] {
  return Object.entries(map)
    .filter(([probeId]) => PROBE_BY_ID.has(probeId))
    .map(([probeId, optionId]) => ({ probeId, optionId }));
}

function buildState(laneId: LaneId | null, map: ProbeMap): BaselineState {
  const responses = toResponses(map);

  if (!laneId) {
    return { laneId: null, answered: 0, total: 0, responses, nextProbeId: null, report: null };
  }

  const probes = probesForLane(laneId);
  const answeredIds = new Set(Object.keys(map));
  const next = probes.find((probe) => !answeredIds.has(probe.id)) ?? null;
  const relevant = responses.filter((response) =>
    probes.some((probe) => probe.id === response.probeId),
  );

  return {
    laneId,
    answered: probes.filter((probe) => answeredIds.has(probe.id)).length,
    total: probes.length,
    responses: relevant,
    nextProbeId: next?.id ?? null,
    // A report is only meaningful once something has been answered.
    report: relevant.length > 0 ? buildReadinessReport(laneId, relevant) : null,
  };
}

export async function getBaseline(userId: string): Promise<BaselineState> {
  const session = await loadOrCreate(userId);
  const laneId = (session.baselineLaneId as LaneId | null) ?? null;
  return buildState(laneId && LANES.includes(laneId) ? laneId : null, parseProbes(session.probeResponsesJson));
}

/**
 * Start (or restart) a baseline for a lane.
 *
 * Switching lanes keeps the answers. A probe about reading netstat output means
 * the same thing whichever job you are aiming at; only the weighting changes.
 */
export async function startBaseline(userId: string, laneId: LaneId): Promise<BaselineState> {
  await loadOrCreate(userId);
  const updated = await prisma.assessmentSession.update({
    where: { userId },
    data: { baselineLaneId: laneId },
  });
  return buildState(laneId, parseProbes(updated.probeResponsesJson));
}

export async function saveProbeResponses(
  userId: string,
  incoming: ProbeResponse[],
): Promise<BaselineState> {
  const session = await loadOrCreate(userId);
  const answers = parseProbes(session.probeResponsesJson);

  for (const response of incoming) {
    const probe = PROBE_BY_ID.get(response.probeId);
    if (!probe) continue;
    // Reject an option that does not belong to this probe, so a hand-crafted
    // request cannot record an answer that was never offered.
    if (!probe.options.some((option) => option.id === response.optionId)) continue;
    answers[response.probeId] = response.optionId;
  }

  const updated = await prisma.assessmentSession.update({
    where: { userId },
    data: { probeResponsesJson: JSON.stringify(answers) },
  });

  const laneId = (updated.baselineLaneId as LaneId | null) ?? null;
  return buildState(laneId && LANES.includes(laneId) ? laneId : null, parseProbes(updated.probeResponsesJson));
}

export async function resetBaseline(userId: string): Promise<BaselineState> {
  await loadOrCreate(userId);
  const updated = await prisma.assessmentSession.update({
    where: { userId },
    data: { probeResponsesJson: '{}' },
  });
  const laneId = (updated.baselineLaneId as LaneId | null) ?? null;
  return buildState(laneId && LANES.includes(laneId) ? laneId : null, {});
}
