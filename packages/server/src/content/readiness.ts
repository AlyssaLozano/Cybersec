/**
 * Readiness scoring: turning probe answers into "these eight exercises take you
 * from 34% to 72%".
 *
 * HOW READINESS IS WEIGHTED
 *
 * Not all capabilities matter equally to a lane. Reading a netstat table is core
 * to SOC work and peripheral to risk work, so each capability carries an
 * importance per lane (core 3, supporting 2, peripheral 1) and readiness is the
 * weighted share demonstrated. A learner who has the three core skills and none
 * of the peripheral ones scores far better than the reverse, which is correct.
 *
 * THE HONESTY PROBLEM THIS FILE HAS TO SOLVE
 *
 * Most foundations are not built yet. A naive readiness figure would tell
 * somebody they are 22% ready and then offer nothing to do about it, which is
 * worse than useless: it is discouraging AND unactionable.
 *
 * So two numbers are reported. `readiness` is the true figure against the whole
 * job. `readinessOfTeachable` is the figure against what this platform can
 * currently teach. The gap between them is stated plainly in `coverageNote`
 * rather than hidden, because a learner deserves to know that finishing
 * everything available here still leaves them short of the role.
 */

import type {
  Capability,
  CapabilityResult,
  LaneId,
  ProbeResponse,
  ReadinessReport,
  ReadinessStep,
} from '@soc/shared';
import { CAPABILITY_WEIGHTS } from '@soc/shared';

import { capabilitiesForLane, probesForCapability } from './capabilities.js';
import { getFoundation } from './foundations.js';
import { getLaneProfile } from './lanes.js';

/** Weighted readiness across a set of capability results. */
function weightedReadiness(results: CapabilityResult[]): number {
  const total = results.reduce((sum, result) => sum + CAPABILITY_WEIGHTS[result.importance], 0);
  if (total === 0) return 0;
  const earned = results.reduce(
    (sum, result) => sum + (result.demonstrated ? CAPABILITY_WEIGHTS[result.importance] : 0),
    0,
  );
  return Math.round((earned / total) * 100);
}

/** Readiness if one more capability were demonstrated. */
function readinessWith(results: CapabilityResult[], extraId: string): number {
  return weightedReadiness(
    results.map((result) =>
      result.capabilityId === extraId ? { ...result, demonstrated: true } : result,
    ),
  );
}

function resultFor(
  capability: Capability,
  laneId: LaneId,
  answers: Map<string, string>,
): CapabilityResult {
  const probes = probesForCapability(capability.id);
  const answered = probes.filter((probe) => answers.has(probe.id));
  const correct = answered.filter((probe) => answers.get(probe.id) === probe.answerId);

  const foundation = getFoundation(capability.foundationId);
  const teachable = typeof foundation?.packageId === 'string' && capability.exerciseIds.length > 0;

  return {
    capabilityId: capability.id,
    title: capability.title,
    attempted: answered.length,
    correct: correct.length,
    /*
     * Demonstrated means every probe answered, and every one right. A partial
     * pass is not a pass: these are two-question checks on foundational skills,
     * and "mostly reads netstat correctly" is not a thing.
     */
    demonstrated: answered.length > 0 && correct.length === probes.length,
    importance: capability.lanes[laneId] ?? 'peripheral',
    exerciseIds: capability.exerciseIds,
    foundationId: capability.foundationId,
    foundationTitle: foundation?.title ?? capability.foundationId,
    teachable,
  };
}

export function buildReadinessReport(laneId: LaneId, responses: ProbeResponse[]): ReadinessReport {
  const answers = new Map(responses.map((response) => [response.probeId, response.optionId]));
  const capabilities = capabilitiesForLane(laneId);
  const laneTitle = getLaneProfile(laneId)?.title ?? laneId;

  /*
   * Some lanes have no capability coverage at all, and that is the honest state
   * rather than a bug. Security architecture is the clear case: it is explicitly
   * not an entry-level role, this platform teaches none of it, and inventing a
   * readiness percentage for it would be theatre. Say so instead.
   */
  if (capabilities.length === 0) {
    return {
      laneId,
      laneTitle,
      readiness: 0,
      readinessOfTeachable: 0,
      results: [],
      steps: [],
      projection: null,
      probesAnswered: 0,
      probesTotal: 0,
      coverageNote:
        `There is no capability baseline for ${laneTitle} yet. This is a senior role that people reach after ` +
        'years in other lanes, so measuring entry-level readiness for it would not tell you anything useful. ' +
        'Baseline yourself against the lane you would actually start in.',
    };
  }

  const results = capabilities.map((capability) => resultFor(capability, laneId, answers));

  const readiness = weightedReadiness(results);
  const teachableResults = results.filter((result) => result.teachable);
  const readinessOfTeachable = weightedReadiness(teachableResults);

  /*
   * Order the gaps by leverage: how much readiness each one buys per exercise.
   * A core capability taught by three exercises beats a supporting one taught by
   * eight, and that is the ordering a learner short on time actually wants.
   */
  const gaps = results.filter((result) => !result.demonstrated);
  const steps: ReadinessStep[] = gaps
    .map((gap) => ({
      capabilityId: gap.capabilityId,
      title: gap.title,
      foundationTitle: gap.foundationTitle,
      exerciseIds: gap.exerciseIds,
      readinessAfter: readinessWith(results, gap.capabilityId),
      teachable: gap.teachable,
    }))
    .sort((a, b) => {
      const aGain = a.readinessAfter - readiness;
      const bGain = b.readinessAfter - readiness;
      // Teachable gaps first: a step somebody can actually take beats a bigger
      // one they cannot.
      if (a.teachable !== b.teachable) return a.teachable ? -1 : 1;
      const aCost = Math.max(1, a.exerciseIds.length);
      const bCost = Math.max(1, b.exerciseIds.length);
      return bGain / bCost - aGain / aCost;
    });

  /*
   * The headline projection covers the teachable gaps only, and it is computed
   * cumulatively rather than by adding up individual gains -- those overlap,
   * and summing them would overstate the result.
   */
  const teachableSteps = steps.filter((step) => step.teachable);
  const projectedResults = results.map((result) =>
    teachableSteps.some((step) => step.capabilityId === result.capabilityId)
      ? { ...result, demonstrated: true }
      : result,
  );
  const exerciseCount = new Set(teachableSteps.flatMap((step) => step.exerciseIds)).size;

  const projection =
    teachableSteps.length > 0
      ? {
          exerciseCount,
          from: readiness,
          to: weightedReadiness(projectedResults),
          capabilityCount: teachableSteps.length,
        }
      : null;

  const untaught = results.filter((result) => !result.teachable);
  const coverageNote =
    untaught.length > 0
      ? `${untaught.length} of the ${results.length} skills this role needs are not built on this platform yet` +
        ` (${[...new Set(untaught.map((r) => r.foundationTitle))].join(', ')}).` +
        ' Finishing everything available here will not by itself make you job-ready, and pretending otherwise would not help you.'
      : null;

  const probesTotal = capabilities.reduce(
    (sum, capability) => sum + probesForCapability(capability.id).length,
    0,
  );

  return {
    laneId,
    laneTitle,
    readiness,
    readinessOfTeachable,
    results,
    steps,
    projection,
    probesAnswered: results.reduce((sum, result) => sum + result.attempted, 0),
    probesTotal,
    coverageNote,
  };
}
