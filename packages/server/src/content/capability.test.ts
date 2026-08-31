/**
 * Capability baseline tests.
 *
 * Two things matter most here. First, that a probe's answer key is never
 * derivable from what ships to the browser. Second, that readiness is honest:
 * it must not flatter somebody by hiding the skills this platform cannot teach
 * them, and it must not route them toward exercises that do not exist.
 */

import { describe, expect, it } from 'vitest';

import type { LaneId, ProbeResponse } from '@soc/shared';
import { CAPABILITY_WEIGHTS, LANES } from '@soc/shared';

import {
  CAPABILITIES,
  PROBES,
  capabilitiesForLane,
  getCapability,
  probesForCapability,
  probesForLane,
} from './capabilities.js';
import { getFoundation } from './foundations.js';
import { ALL_EXERCISES } from './index.js';
import { buildReadinessReport } from './readiness.js';

const exerciseIds = new Set(ALL_EXERCISES.map((exercise) => exercise.id));

describe('capability catalogue', () => {
  it('gives every capability and probe a unique id', () => {
    expect(new Set(CAPABILITIES.map((c) => c.id)).size).toBe(CAPABILITIES.length);
    expect(new Set(PROBES.map((p) => p.id)).size).toBe(PROBES.length);
  });

  it('points every capability at a real foundation', () => {
    const broken = CAPABILITIES.filter((c) => !getFoundation(c.foundationId)).map((c) => c.id);
    expect(broken).toEqual([]);
  });

  it('only ever weights lanes that exist', () => {
    const laneSet = new Set<string>(LANES);
    const unknown: string[] = [];
    for (const capability of CAPABILITIES) {
      for (const laneId of Object.keys(capability.lanes)) {
        if (!laneSet.has(laneId)) unknown.push(`${capability.id} -> ${laneId}`);
      }
    }
    expect(unknown).toEqual([]);
  });

  it('never routes to an exercise that does not exist', () => {
    // Routing somebody to a missing exercise is worse than admitting the gap.
    const broken: string[] = [];
    for (const capability of CAPABILITIES) {
      for (const id of capability.exerciseIds) {
        if (!exerciseIds.has(id)) broken.push(`${capability.id} -> ${id}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('only claims exercises for foundations that are actually built', () => {
    for (const capability of CAPABILITIES) {
      if (capability.exerciseIds.length === 0) continue;
      const foundation = getFoundation(capability.foundationId)!;
      expect(foundation.packageId, `${capability.id} routes to exercises but its foundation is unbuilt`).toBeTruthy();
    }
  });

  /*
   * The converse of the test above, and the one that was missing.
   *
   * An empty `exerciseIds` is correct while a foundation is unbuilt -- there is
   * genuinely nowhere to send anybody. It stops being correct the moment the
   * package lands, and nothing noticed: the test above skips empty arrays, so
   * four capabilities on the built `incident-concepts` foundation measured a
   * student and then routed them nowhere, silently, for as long as Alert Triage
   * and Incident Response had been shipping.
   *
   * A capability whose foundation is built has no excuse for routing nowhere.
   */
  it('routes somewhere whenever the foundation behind it is built', () => {
    const stranded = CAPABILITIES.filter(
      (c) => getFoundation(c.foundationId)?.packageId && c.exerciseIds.length === 0,
    ).map((c) => c.id);
    expect(stranded).toEqual([]);
  });

  it('gives every capability at least one probe', () => {
    const bare = CAPABILITIES.filter((c) => probesForCapability(c.id).length === 0).map((c) => c.id);
    expect(bare).toEqual([]);
  });

  it('points every probe at a real capability', () => {
    const broken = PROBES.filter((p) => !getCapability(p.capabilityId)).map((p) => p.id);
    expect(broken).toEqual([]);
  });

  it('gives every probe a valid answer among its own options', () => {
    for (const probe of PROBES) {
      expect(probe.options.length, probe.id).toBeGreaterThanOrEqual(3);
      expect(
        probe.options.some((option) => option.id === probe.answerId),
        `${probe.id} answer is not one of its options`,
      ).toBe(true);
      expect(new Set(probe.options.map((o) => o.id)).size, probe.id).toBe(probe.options.length);
    }
  });

  it('explains every probe, because a wrong answer is the teachable moment', () => {
    for (const probe of PROBES) {
      expect(probe.explanation.length, probe.id).toBeGreaterThan(60);
    }
  });

  it('covers the SOC lane broadly, since that is the flagship path', () => {
    expect(capabilitiesForLane('soc-ops').length).toBeGreaterThanOrEqual(15);
    expect(probesForLane('soc-ops').length).toBeGreaterThanOrEqual(20);
  });

  it('orders a lane\'s probes from recall toward analysis', () => {
    const levels = probesForLane('soc-ops').map((p) => p.level);
    const rank = { recall: 0, apply: 1, analyse: 2 };
    for (let i = 1; i < levels.length; i += 1) {
      expect(rank[levels[i]!]).toBeGreaterThanOrEqual(rank[levels[i - 1]!]);
    }
  });
});

/** Answer every probe for a lane, correctly or incorrectly. */
function answerAll(laneId: LaneId, correct: boolean): ProbeResponse[] {
  return probesForLane(laneId).map((probe) => ({
    probeId: probe.id,
    optionId: correct
      ? probe.answerId
      : (probe.options.find((option) => option.id !== probe.answerId)?.id ?? probe.answerId),
  }));
}

/** Answer only the probes belonging to given capabilities, correctly. */
function answerCapabilities(laneId: LaneId, capabilityIds: string[]): ProbeResponse[] {
  return probesForLane(laneId)
    .filter((probe) => capabilityIds.includes(probe.capabilityId))
    .map((probe) => ({ probeId: probe.id, optionId: probe.answerId }));
}

describe('readiness scoring', () => {
  it('scores zero when nothing is answered', () => {
    const report = buildReadinessReport('soc-ops', []);
    expect(report.readiness).toBe(0);
    expect(report.probesAnswered).toBe(0);
  });

  it('scores 100 when everything is answered correctly', () => {
    const report = buildReadinessReport('soc-ops', answerAll('soc-ops', true));
    expect(report.readiness).toBe(100);
    expect(report.steps).toEqual([]);
    expect(report.projection).toBeNull();
  });

  it('scores zero when everything is answered incorrectly', () => {
    const report = buildReadinessReport('soc-ops', answerAll('soc-ops', false));
    expect(report.readiness).toBe(0);
    expect(report.steps.length).toBeGreaterThan(0);
  });

  it('weights core capabilities above peripheral ones', () => {
    // Demonstrating one core skill should move readiness more than one
    // supporting skill, which is the entire point of the weighting.
    const soc = capabilitiesForLane('soc-ops');
    const core = soc.find((c) => c.lanes['soc-ops'] === 'core')!;
    const supporting = soc.find((c) => c.lanes['soc-ops'] === 'supporting')!;

    const withCore = buildReadinessReport('soc-ops', answerCapabilities('soc-ops', [core.id])).readiness;
    const withSupporting = buildReadinessReport(
      'soc-ops',
      answerCapabilities('soc-ops', [supporting.id]),
    ).readiness;

    expect(CAPABILITY_WEIGHTS.core).toBeGreaterThan(CAPABILITY_WEIGHTS.supporting);
    expect(withCore).toBeGreaterThan(withSupporting);
  });

  it('requires every probe for a capability to be correct before crediting it', () => {
    // cap-permissions has two probes; getting one right is not a pass.
    const probes = probesForCapability('cap-permissions');
    expect(probes.length).toBeGreaterThan(1);

    const partial: ProbeResponse[] = [
      { probeId: probes[0]!.id, optionId: probes[0]!.answerId },
      {
        probeId: probes[1]!.id,
        optionId: probes[1]!.options.find((o) => o.id !== probes[1]!.answerId)!.id,
      },
    ];
    const result = buildReadinessReport('soc-ops', partial).results.find(
      (r) => r.capabilityId === 'cap-permissions',
    )!;
    expect(result.correct).toBe(1);
    expect(result.demonstrated).toBe(false);
  });

  it('weighs the same capability differently depending on the lane', () => {
    /*
     * Reading a netstat table is core to SOC work and merely supporting to
     * forensics. Asserting the two READINESS numbers differ was a bad test: one
     * capability out of twenty can round to the same integer by coincidence,
     * which it did. Assert the mechanism instead.
     */
    const answers = answerCapabilities('soc-ops', ['cap-read-netstat']);

    const socResult = buildReadinessReport('soc-ops', answers).results.find(
      (r) => r.capabilityId === 'cap-read-netstat',
    )!;
    const forensicsResult = buildReadinessReport('forensics', answers).results.find(
      (r) => r.capabilityId === 'cap-read-netstat',
    )!;

    expect(socResult.importance).toBe('core');
    expect(forensicsResult.importance).toBe('supporting');
    expect(CAPABILITY_WEIGHTS[socResult.importance]).toBeGreaterThan(
      CAPABILITY_WEIGHTS[forensicsResult.importance],
    );
  });
});

describe('routing to exercises', () => {
  it('puts teachable gaps ahead of ones we cannot teach yet', () => {
    const report = buildReadinessReport('soc-ops', answerAll('soc-ops', false));
    const firstUnteachable = report.steps.findIndex((step) => !step.teachable);
    const lastTeachable = report.steps.map((s) => s.teachable).lastIndexOf(true);
    if (firstUnteachable !== -1 && lastTeachable !== -1) {
      expect(lastTeachable).toBeLessThan(firstUnteachable);
    }
  });

  it('only ever names real exercises in its steps', () => {
    const report = buildReadinessReport('soc-ops', answerAll('soc-ops', false));
    const broken: string[] = [];
    for (const step of report.steps) {
      for (const id of step.exerciseIds) if (!exerciseIds.has(id)) broken.push(id);
    }
    expect(broken).toEqual([]);
  });

  it('projects a real, achievable improvement', () => {
    const report = buildReadinessReport('soc-ops', answerAll('soc-ops', false));
    expect(report.projection).not.toBeNull();
    expect(report.projection!.from).toBe(report.readiness);
    expect(report.projection!.to).toBeGreaterThan(report.projection!.from);
    expect(report.projection!.exerciseCount).toBeGreaterThan(0);
  });

  it('does not overstate the projection by summing overlapping gains', () => {
    // Each step reports readiness "if this one gap closed". Adding those up
    // would double-count; the projection must be computed cumulatively.
    const report = buildReadinessReport('soc-ops', answerAll('soc-ops', false));
    const naiveSum = report.steps
      .filter((s) => s.teachable)
      .reduce((sum, step) => sum + (step.readinessAfter - report.readiness), 0);
    expect(report.projection!.to - report.projection!.from).toBeLessThanOrEqual(naiveSum + 1);
    expect(report.projection!.to).toBeLessThanOrEqual(100);
  });

  it('admits how much of the role it cannot teach', () => {
    const report = buildReadinessReport('soc-ops', []);
    // Most SOC foundations are unbuilt, so this must say so rather than imply
    // that finishing the platform makes somebody job-ready.
    expect(report.coverageNote).toBeTruthy();
    expect(report.coverageNote).toMatch(/not built on this platform yet/i);
  });

  it('reports readiness against teachable content separately from the whole role', () => {
    const answers = answerCapabilities('soc-ops', ['cap-grep', 'cap-pipes']);
    const report = buildReadinessReport('soc-ops', answers);
    // Doing well on what exists should look better against what exists than
    // against the whole job, and both numbers are shown.
    expect(report.readinessOfTeachable).toBeGreaterThan(report.readiness);
  });

  it('produces a usable report for every lane, including uncovered ones', () => {
    for (const laneId of LANES) {
      const report = buildReadinessReport(laneId, []);
      expect(report.laneTitle.length, laneId).toBeGreaterThan(0);

      // A lane with no coverage must say so rather than returning an empty
      // report that reads like a zero score.
      if (report.results.length === 0) {
        expect(report.coverageNote, `${laneId} has no coverage and no explanation`).toBeTruthy();
      }
    }
  });

  it('explains rather than scores a lane with no baseline', () => {
    const report = buildReadinessReport('security-architecture', []);
    expect(report.results).toEqual([]);
    expect(report.coverageNote).toMatch(/senior role/i);
  });

  it('covers every lane that is a realistic entry point', () => {
    // Architecture and red team are explicitly not entry points, so thin or
    // absent coverage there is correct. Everything else needs a real baseline.
    const entryLanes = LANES.filter(
      (lane) => lane !== 'security-architecture' && lane !== 'red-team',
    );
    const thin = entryLanes.filter((lane) => buildReadinessReport(lane, []).results.length < 2);
    expect(thin).toEqual([]);
  });
});
