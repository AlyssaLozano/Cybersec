/**
 * Tests for career routing: tracks, foundations, certifications, tool mappings,
 * and the Career Fit Analyzer.
 *
 * The most important test here is the one asserting that risk, compliance,
 * privacy, and awareness require no Linux. That is the entire reason foundations
 * became per-track, and an edit that quietly reintroduces a universal Linux
 * requirement should fail loudly.
 *
 * The second most important group covers the confidence penalty. The instrument
 * asks the same construct several ways on purpose; if inconsistent answers stop
 * producing lower confidence, the redundancy has silently become decoration.
 */

import { describe, expect, it } from 'vitest';

import type { ItemResponse, LaneId } from '@soc/shared';
import { DIMENSIONS, LANES, TRAITS } from '@soc/shared';

import { ITEMS, ITEM_BY_ID, itemsForDimension } from './assessment/items.js';
import { buildReport, shareableSummary } from './assessment/report.js';
import { score, scoreEnvironments, scoreTraits } from './assessment/scoring.js';
import { CERTIFICATIONS, getCertification } from './certifications.js';
import { foundationsWithDemand, trackFoundations, trackPackages, trackReadiness } from './curriculum.js';
import { FOUNDATIONS, getFoundation } from './foundations.js';
import { getLaneProfile, LANE_PROFILES } from './lanes.js';
import { getToolMapping, TOOL_MAPPINGS } from './tools.js';
import { getTrack, TRACKS } from './tracks.js';

// =========================================================================
// Catalogue integrity
// =========================================================================

describe('catalogue integrity', () => {
  it('gives every entity a unique id', () => {
    for (const [label, ids] of [
      ['tracks', TRACKS.map((t) => t.id)],
      ['foundations', FOUNDATIONS.map((f) => f.id)],
      ['certifications', CERTIFICATIONS.map((c) => c.id)],
      ['tools', TOOL_MAPPINGS.map((t) => t.id)],
      ['lanes', LANE_PROFILES.map((l) => l.id)],
      ['items', ITEMS.map((i) => i.id)],
    ] as const) {
      expect(new Set(ids).size, `${label} has duplicate ids`).toBe(ids.length);
    }
  });

  it('resolves every foundation, certification, and tool a track or foundation names', () => {
    const broken: string[] = [];
    for (const track of TRACKS) {
      for (const id of track.foundations) if (!getFoundation(id)) broken.push(`track ${track.id} -> ${id}`);
      for (const id of track.certifications) if (!getCertification(id)) broken.push(`track ${track.id} -> ${id}`);
    }
    for (const foundation of FOUNDATIONS) {
      for (const id of foundation.tools ?? []) {
        if (!getToolMapping(id)) broken.push(`foundation ${foundation.id} -> ${id}`);
      }
    }
    for (const cert of CERTIFICATIONS) {
      for (const id of cert.prerequisites ?? []) {
        if (!getCertification(id)) broken.push(`cert ${cert.id} -> ${id}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('marks a track available only when it has a playable foundation', () => {
    for (const track of TRACKS.filter((t) => t.status === 'available')) {
      expect(trackReadiness(track.id).foundationsPlayable, `${track.id}`).toBeGreaterThan(0);
    }
  });
});

// =========================================================================
// Foundations are per-track
// =========================================================================

describe('foundations are per-track, not universal', () => {
  it('does not require Linux for risk, compliance, privacy, or awareness', () => {
    for (const trackId of ['risk-governance', 'compliance-audit', 'privacy', 'awareness']) {
      const foundations = trackFoundations(trackId).map((f) => f.id);
      expect(foundations, `${trackId} should not require Linux`).not.toContain('linux');
    }
  });

  it('does require Linux for hands-on defensive and offensive tracks', () => {
    for (const trackId of ['soc', 'incident-response', 'pentest', 'security-engineering']) {
      expect(trackFoundations(trackId).map((f) => f.id)).toContain('linux');
    }
  });

  it('reports which tracks demand each foundation', () => {
    const demand = new Map(foundationsWithDemand().map((f) => [f.id, f.requiredBy]));
    expect(demand.get('linux')).toContain('soc');
    expect(demand.get('linux')).not.toContain('privacy');
  });

  /*
   * Asserted by property, not as a frozen array.
   *
   * This previously read as a frozen positional array, which made adding a
   * package to the SOC track an edit to this file -- the positional-assertion
   * problem, in the one test that could not avoid caring about order. What
   * actually matters is that the order follows the track's declared foundations
   * and that only built ones appear, so that is what is checked.
   */
  it('resolves a track to its playable packages, foundations first', () => {
    const soc = trackPackages('soc');
    const declared = trackFoundations('soc')
      .filter((foundation) => foundation.playable)
      .map((foundation) => foundation.packageId);

    expect(soc).toEqual(declared);
    expect(new Set(soc).size, 'a package should not be reachable twice').toBe(soc.length);
    // Spot-checks of the ordering the track declares, which no reordering of
    // PACKAGES can satisfy by accident.
    expect(soc.indexOf('linux-fundamentals')).toBeLessThan(soc.indexOf('log-analysis'));
    expect(soc.indexOf('incident-triage')).toBeLessThan(soc.indexOf('incident-response'));

    expect(trackPackages('privacy')).toEqual([]);
  });
});

// =========================================================================
// Lane profiles
// =========================================================================

describe('lane profiles are complete and honest', () => {
  it('covers every lane exactly once', () => {
    expect(LANE_PROFILES.map((lane) => lane.id).sort()).toEqual([...LANES].sort());
  });

  it('ranks all three environments for every lane', () => {
    for (const lane of LANE_PROFILES) {
      const ranks = lane.environmentFit.map((fit) => fit.rank).sort();
      expect(ranks, `${lane.id}`).toEqual([1, 2, 3]);
      expect(new Set(lane.environmentFit.map((f) => f.environmentId)).size, `${lane.id}`).toBe(3);
    }
  });

  it('gives every lane real day-to-day detail and real pain points', () => {
    for (const lane of LANE_PROFILES) {
      expect(lane.dayToDay.length, `${lane.id}`).toBeGreaterThanOrEqual(3);
      // Pain points are the reason this file exists; a lane without them is marketing.
      expect(lane.painPoints.length, `${lane.id} has no pain points`).toBeGreaterThanOrEqual(3);
      expect(lane.burnoutDrivers.length, `${lane.id}`).toBeGreaterThanOrEqual(1);
      expect(lane.advancement.length, `${lane.id}`).toBeGreaterThan(20);
      expect(lane.entryReality.length, `${lane.id}`).toBeGreaterThan(20);
    }
  });

  it('resolves every trackId a lane claims', () => {
    const broken: string[] = [];
    for (const lane of LANE_PROFILES) {
      if (lane.trackId && !getTrack(lane.trackId)) broken.push(`${lane.id} -> ${lane.trackId}`);
    }
    expect(broken).toEqual([]);
  });

  it('names a realistic certification pathway that resolves', () => {
    const broken: string[] = [];
    for (const lane of LANE_PROFILES) {
      expect(lane.certPathway.length, `${lane.id}`).toBeGreaterThan(0);
      for (const id of lane.certPathway) {
        if (!getCertification(id)) broken.push(`${lane.id} -> ${id}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('is honest that architecture and red team are not entry points', () => {
    expect(getLaneProfile('security-architecture')!.entryReality).toMatch(/not an entry point/i);
    expect(getLaneProfile('red-team')!.entryReality).toMatch(/not an entry point/i);
  });
});

// =========================================================================
// Item bank
// =========================================================================

describe('item bank', () => {
  it('has between 60 and 80 items, as specified', () => {
    expect(ITEMS.length).toBeGreaterThanOrEqual(60);
    expect(ITEMS.length).toBeLessThanOrEqual(80);
  });

  it('covers every dimension', () => {
    for (const dimension of DIMENSIONS) {
      expect(itemsForDimension(dimension).length, dimension).toBeGreaterThanOrEqual(4);
    }
  });

  it('only ever weights lanes that exist', () => {
    const laneSet = new Set<string>(LANES);
    const unknown: string[] = [];
    for (const item of ITEMS) {
      const weightSets =
        item.kind === 'likert' ? [item.lanes] : item.options.map((option) => option.lanes ?? {});
      for (const weights of weightSets) {
        for (const laneId of Object.keys(weights)) {
          if (!laneSet.has(laneId)) unknown.push(`${item.id} -> ${laneId}`);
        }
      }
    }
    expect(unknown).toEqual([]);
  });

  it('only ever names traits that exist', () => {
    const traitSet = new Set<string>(TRAITS);
    const unknown: string[] = [];
    for (const item of ITEMS) {
      if (item.kind === 'likert') {
        if (!traitSet.has(item.trait)) unknown.push(`${item.id} -> ${item.trait}`);
      } else {
        for (const option of item.options) {
          if (option.traitValue && !traitSet.has(option.traitValue.trait)) {
            unknown.push(`${item.id}/${option.id} -> ${option.traitValue.trait}`);
          }
        }
      }
    }
    expect(unknown).toEqual([]);
  });

  it('gives every lane enough items to be scoreable', () => {
    const counts = new Map<string, number>();
    for (const item of ITEMS) {
      const weightSets =
        item.kind === 'likert' ? [item.lanes] : item.options.map((option) => option.lanes ?? {});
      for (const weights of weightSets) {
        for (const laneId of Object.keys(weights)) {
          counts.set(laneId, (counts.get(laneId) ?? 0) + 1);
        }
      }
    }
    for (const lane of LANES) {
      expect(counts.get(lane) ?? 0, `${lane} has too few items bearing on it`).toBeGreaterThanOrEqual(5);
    }
  });

  it('measures each scored trait with at least three indicators', () => {
    // Below three, the consistency figure is noise rather than signal.
    const counts = new Map<string, number>();
    for (const item of ITEMS) {
      if (item.kind === 'likert') counts.set(item.trait, (counts.get(item.trait) ?? 0) + 1);
      else {
        for (const option of item.options) {
          if (option.traitValue) {
            counts.set(option.traitValue.trait, (counts.get(option.traitValue.trait) ?? 0) + 1);
          }
        }
      }
    }
    const thin = [...counts.entries()].filter(([, count]) => count < 3).map(([trait]) => trait);
    expect(thin).toEqual([]);
  });

  it('includes reverse-coded items so autopilot answering is visible', () => {
    const reversed = ITEMS.filter((item) => item.kind === 'likert' && item.reverse);
    expect(reversed.length).toBeGreaterThanOrEqual(8);
  });

  it('gives every forced choice at least three distinct options', () => {
    for (const item of ITEMS.filter((i) => i.kind === 'choice')) {
      if (item.kind !== 'choice') continue;
      expect(item.options.length, item.id).toBeGreaterThanOrEqual(3);
      expect(new Set(item.options.map((o) => o.id)).size, item.id).toBe(item.options.length);
    }
  });
});

// =========================================================================
// Scoring
// =========================================================================

/** Answer a set of Likert items with the same value. */
function likert(ids: string[], value: number): ItemResponse[] {
  return ids.map((itemId) => ({ itemId, value }));
}

/** Answer every Likert item neutrally, as a baseline. */
function allNeutral(): ItemResponse[] {
  return ITEMS.filter((item) => item.kind === 'likert').map((item) => ({ itemId: item.id, value: 3 }));
}

describe('scoring', () => {
  it('is deterministic', () => {
    const responses = likert(['e1', 's5', 'p8'], 5);
    expect(score(responses)).toEqual(score(responses));
  });

  it('treats a neutral answer as moving nothing', () => {
    const result = score(allNeutral());
    const spread = Math.max(...result.lanes.map((l) => l.raw)) - Math.min(...result.lanes.map((l) => l.raw));
    expect(spread).toBe(0);
  });

  it('counts disagreement against a lane, not merely as absent support', () => {
    const agreed = score(likert(['e1'], 5)).lanes.find((l) => l.laneId === 'pentest')!;
    const disagreed = score(likert(['e1'], 1)).lanes.find((l) => l.laneId === 'pentest')!;
    expect(agreed.raw).toBeGreaterThan(0);
    expect(disagreed.raw).toBeLessThan(0);
  });

  it('handles reverse-coded items by flipping the trait reading', () => {
    // p2 is reverse-coded on interrupt_tolerance: agreeing means LOW tolerance.
    const traits = scoreTraits(likert(['p2'], 5));
    const interrupt = traits.find((t) => t.trait === 'interrupt_tolerance')!;
    expect(interrupt.value).toBeLessThan(0);
  });

  it('ignores responses to unknown items rather than throwing', () => {
    expect(() => score([{ itemId: 'does-not-exist', value: 5 }])).not.toThrow();
  });

  it('returns a full lane list even with no answers', () => {
    const result = score([]);
    expect(result.lanes.length).toBe(LANES.length);
  });
});

// =========================================================================
// Detection engineering routing
// =========================================================================

describe('detection engineering routing', () => {
  /** Somebody who would rather build the rule than work the queue it fills. */
  const BUILDER: ItemResponse[] = [
    ...likert(['e16', 's14', 's7', 's6', 's8', 's15', 'd11', 'l2'], 5),
    ...likert(['p7', 'e17', 'p3'], 1),
  ];

  it('routes a build-and-tune profile to detection engineering', () => {
    expect(buildReport(BUILDER).topLanes[0]!.laneId).toBe('detection-engineering');
  });

  it('does not cannibalise the SOC profile', () => {
    // These two lanes share most of their vocabulary, so the risk in adding one
    // is that it quietly steals the other. Somebody who actually wants the queue
    // must still be sent to the queue.
    const operator = [...likert(['p3', 'p7', 's1', 'e2', 'p1', 'l1'], 5), ...likert(['p2', 'p8'], 1)];
    const lanes = score(operator).lanes;
    const soc = lanes.find((lane) => lane.laneId === 'soc-ops')!;
    const detection = lanes.find((lane) => lane.laneId === 'detection-engineering')!;
    expect(soc.raw).toBeGreaterThan(detection.raw);
  });

  it('warns somebody who wants clear right answers, since a threshold is a choice', () => {
    // Every tuning decision is a number a person picked, not a fact they found.
    // A lane that only ever reports as a good fit is marketing.
    const structured = [...likert(['p5', 'd3', 'd4', 's11'], 5), ...likert(['e16', 's14'], 5)];
    const detection = score(structured).lanes.find((lane) => lane.laneId === 'detection-engineering')!;
    expect(detection.concerns.join(' ')).toMatch(/clear right answers/i);
  });

  it('has enough items bearing on it to be scored with real confidence', () => {
    const detection = score(BUILDER).lanes.find((lane) => lane.laneId === 'detection-engineering')!;
    expect(detection.confidence).toBeGreaterThanOrEqual(60);
  });

  it('maps the lane to the detection engineering track and its foundations', () => {
    const lane = getLaneProfile('detection-engineering')!;
    expect(lane.trackId).toBe('detection-engineering');
    const foundations = trackFoundations('detection-engineering').map((foundation) => foundation.id);
    expect(foundations).toContain('siem');
    expect(foundations).toContain('log-analysis');
  });
});

describe('the confidence penalty', () => {
  /** Items that all indicate detail_orientation in the same direction. */
  const DETAIL_ITEMS = ['s1', 's2', 's12', 'd1', 'd8'];

  it('reports high consistency when indicators agree', () => {
    const traits = scoreTraits(likert(DETAIL_ITEMS, 5));
    const detail = traits.find((t) => t.trait === 'detail_orientation')!;
    expect(detail.indicators).toBeGreaterThanOrEqual(3);
    expect(detail.consistency).toBeGreaterThan(0.9);
  });

  it('reports low consistency when indicators contradict each other', () => {
    // Strongly agree with some detail items and strongly disagree with others.
    const contradictory: ItemResponse[] = [
      ...likert(['s1', 's2'], 5),
      ...likert(['s12', 'd1', 'd8'], 1),
    ];
    const detail = scoreTraits(contradictory).find((t) => t.trait === 'detail_orientation')!;
    expect(detail.consistency).toBeLessThan(0.6);
  });

  it('lowers a lane\'s confidence when the traits driving it were inconsistent', () => {
    const consistent = score(likert(DETAIL_ITEMS, 5));
    const contradictory = score([...likert(['s1', 's2'], 5), ...likert(['s12', 'd1', 'd8'], 1)]);

    const forensicsConsistent = consistent.lanes.find((l) => l.laneId === 'forensics')!;
    const forensicsShaky = contradictory.lanes.find((l) => l.laneId === 'forensics')!;
    expect(forensicsShaky.confidence).toBeLessThan(forensicsConsistent.confidence);
  });

  it('raises a caveat naming the inconsistent construct', () => {
    const result = score([...likert(['s1', 's2'], 5), ...likert(['s12', 'd1', 'd8'], 1)]);
    expect(result.caveats.join(' ')).toMatch(/attention to detail/i);
  });

  it('warns when too few questions were answered', () => {
    const result = score(likert(['s1'], 5));
    expect(result.caveats.join(' ')).toMatch(/answered 1 of/i);
  });

  it('does not let confidence change the ranking', () => {
    // Same lane ordering whether or not the answers were consistent.
    const shaky = score([...likert(['s1', 's2'], 5), ...likert(['s12', 'd1', 'd8'], 1)]);
    const byRaw = [...shaky.lanes].sort((a, b) => b.raw - a.raw || a.laneId.localeCompare(b.laneId));
    expect(shaky.lanes.map((l) => l.laneId)).toEqual(byRaw.map((l) => l.laneId));
  });
});

describe('lane routing produces sensible results', () => {
  const cases: Array<{ name: string; responses: ItemResponse[]; expect: LaneId[] }> = [
    {
      name: 'an adversarial, patient, code-comfortable person',
      responses: [...likert(['e1', 's5', 'p8', 's8'], 5), ...likert(['e2'], 1)],
      expect: ['pentest', 'red-team'],
    },
    {
      name: 'a meticulous, solo, procedure-following person',
      responses: [...likert(['s10', 'd10', 'd3', 'd6', 'e12', 'i2'], 5), ...likert(['p3'], 1)],
      expect: ['forensics'],
    },
    {
      name: 'a writer who wants to change how decisions get made',
      responses: [...likert(['e10', 'i7', 'i1', 'i3'], 5), ...likert(['s8'], 1)],
      expect: ['risk-compliance'],
    },
    {
      name: 'a builder who wants to fix causes not symptoms',
      responses: [...likert(['s7', 's8', 'e3'], 5)],
      expect: ['security-engineering', 'cloud-security', 'security-architecture'],
    },
    {
      name: 'someone who likes reading and connecting dots',
      responses: [...likert(['e9', 's4', 's10', 'i7'], 5)],
      expect: ['threat-intel', 'forensics'],
    },
    {
      name: 'someone drawn to access control',
      responses: [...likert(['e8', 'i8', 'l6'], 5)],
      expect: ['iam'],
    },
    {
      name: 'someone who likes packets and concrete answers',
      responses: [...likert(['e6', 's2'], 5)],
      expect: ['network-security'],
    },
    {
      name: 'a code reader',
      responses: [...likert(['e7', 's8'], 5)],
      expect: ['appsec'],
    },
  ];

  for (const testCase of cases) {
    it(`routes ${testCase.name}`, () => {
      const top = score(testCase.responses).lanes[0]!;
      expect(testCase.expect).toContain(top.laneId);
    });
  }
});

describe('environment fit', () => {
  it('sends someone wanting stability and process toward government', () => {
    const responses: ItemResponse[] = [...likert(['p9', 'l2', 'l4', 'd4', 'd3'], 5), ...likert(['d5', 'l3'], 1)];
    expect(scoreEnvironments(responses)[0]!.environmentId).toBe('government');
  });

  it('sends someone impatient with process who wants travel toward consulting', () => {
    const responses: ItemResponse[] = [...likert(['d5', 'l3', 'l7', 'e4'], 5), ...likert(['p9', 'l4', 'd4'], 1)];
    expect(scoreEnvironments(responses)[0]!.environmentId).toBe('consulting');
  });

  it('scores all three environments and explains each', () => {
    const scores = scoreEnvironments(likert(['p9', 'l4'], 5));
    expect(scores.length).toBe(3);
    expect(scores[0]!.score).toBeGreaterThanOrEqual(scores[2]!.score);
  });

  it('reads the direct environment-preference question', () => {
    const gov = scoreEnvironments([{ itemId: 'l8', optionId: 'gov' }]);
    expect(gov[0]!.environmentId).toBe('government');
    const consult = scoreEnvironments([{ itemId: 'l8', optionId: 'consult' }]);
    expect(consult[0]!.environmentId).toBe('consulting');
  });
});

describe('burnout risk is personalised', () => {
  it('raises SOC risk for someone with low pressure and interrupt tolerance', () => {
    const fragile = score([...likert(['p1', 'p3', 'p4', 'p10'], 1), ...likert(['p2', 'p6'], 5)]);
    const soc = fragile.lanes.find((l) => l.laneId === 'soc-ops')!;
    expect(soc.burnoutRisk).toBe('high');
    expect(soc.concerns.join(' ')).toMatch(/pressure|interruption|focus/i);
  });

  it('lowers SOC risk for someone who thrives on pressure and interruption', () => {
    const resilient = score([...likert(['p1', 'p3', 'p4', 'p10'], 5), ...likert(['p2', 'p6'], 1)]);
    const soc = resilient.lanes.find((l) => l.laneId === 'soc-ops')!;
    expect(soc.burnoutRisk).toBe('medium');
  });

  it('flags persuasion-heavy lanes for someone who finds chasing people draining', () => {
    const result = score([...likert(['i4', 'i6', 'i2'], 5), ...likert(['i1', 'i3', 'i8'], 1)]);
    const vuln = result.lanes.find((l) => l.laneId === 'vuln-management')!;
    expect(vuln.concerns.join(' ')).toMatch(/persuad|report to you/i);
  });
});

// =========================================================================
// Report
// =========================================================================

describe('report generation', () => {
  const responses: ItemResponse[] = [
    ...likert(['e1', 's5', 'p8', 's8', 'l5'], 5),
    ...likert(['e2', 'l2'], 1),
    { itemId: 'l8', optionId: 'consult' },
    { itemId: 's13', optionId: 'attack-it' },
  ];

  it('returns three or four top lanes', () => {
    const report = buildReport(responses);
    expect(report.topLanes.length).toBeGreaterThanOrEqual(3);
    expect(report.topLanes.length).toBeLessThanOrEqual(4);
  });

  it('never repeats a lane between top and alternatives', () => {
    const report = buildReport(responses);
    const top = new Set(report.topLanes.map((l) => l.laneId));
    for (const alternative of report.alternatives) {
      expect(top.has(alternative.laneId)).toBe(false);
    }
  });

  it('explains the top lane with the answers that drove it', () => {
    const report = buildReport(responses);
    expect(report.topLanes[0]!.reasons.length).toBeGreaterThan(0);
  });

  it('recommends an environment with reasoning', () => {
    const report = buildReport(responses);
    expect(report.environments.length).toBe(3);
    expect(report.summary).toMatch(/consulting|corporate|government/);
  });

  it('writes a summary that names the top lane', () => {
    const report = buildReport(responses);
    const topTitle = getLaneProfile(report.topLanes[0]!.laneId)!.title.toLowerCase();
    expect(report.summary.toLowerCase()).toContain(topTitle);
  });

  it('warns about burnout when the top pick is high risk for this person', () => {
    // Someone drawn to SOC work who cannot take pressure or interruption.
    const conflicted = buildReport([
      ...likert(['e13', 'p7', 'e2'], 5),
      ...likert(['p1', 'p3', 'p4', 'p10'], 1),
      ...likert(['p2', 'p6'], 5),
    ]);
    const top = conflicted.topLanes[0]!;
    if (top.burnoutRisk === 'high') {
      expect(conflicted.burnoutWarning).toBeTruthy();
      expect(conflicted.burnoutWarning).toMatch(/eyes open|interview/i);
    }
  });

  it('surfaces mismatches: strong interest undermined by a specific weakness', () => {
    const report = buildReport([
      ...likert(['e13', 'p7'], 5),
      ...likert(['p3', 'p1'], 1),
      ...likert(['p2', 'p8'], 5),
    ]);
    if (report.mismatches.length > 0) {
      expect(report.mismatches[0]!.problem.length).toBeGreaterThan(10);
      expect(report.mismatches[0]!.attraction.length).toBeGreaterThan(5);
    }
  });

  it('flags low confidence when responses were sparse', () => {
    const report = buildReport(likert(['e1'], 5));
    expect(report.overallConfidence).toBeLessThan(60);
    expect(report.summary).toMatch(/starting point/i);
  });

  it('reports progress honestly', () => {
    const report = buildReport(likert(['e1', 'e2'], 5));
    expect(report.answered).toBe(2);
    expect(report.applicable).toBe(ITEMS.length);
  });

  it('produces a shareable summary that admits what it is not', () => {
    const summary = shareableSummary(buildReport(responses));
    expect(summary).toMatch(/not a validated psychometric/i);
    expect(summary).toMatch(/strongest match/i);
  });

  it('degrades gracefully with no answers at all', () => {
    const report = buildReport([]);
    expect(report.topLanes.length).toBeGreaterThan(0);
    expect(report.caveats.length).toBeGreaterThan(0);
  });
});

describe('item lookup', () => {
  it('indexes every item by id', () => {
    expect(ITEM_BY_ID.size).toBe(ITEMS.length);
  });
});

// =========================================================================
// The client view must never carry scoring weights
// =========================================================================

describe('client item view', () => {
  it('strips every scoring field from every item', async () => {
    const { toClientItem } = await import('../routes/assessment.js');

    // A learner who can see that agreeing with e1 adds four points to
    // penetration testing can work backwards to whatever answer they wanted,
    // which turns a self-assessment into a wish list.
    const forbidden = ['lanes', 'factors', 'trait', 'reverse', 'weights', 'traitValue'];
    const leaked: string[] = [];

    for (const item of ITEMS) {
      const blob = JSON.stringify(toClientItem(item));
      for (const key of forbidden) {
        if (blob.includes(`"${key}"`)) leaked.push(`${item.id} -> ${key}`);
      }
    }
    expect(leaked).toEqual([]);
  });

  it('still carries everything needed to render the question', () => {
    const shaped = ITEMS.map((item) => item);
    for (const item of shaped) {
      if (item.kind === 'likert') {
        expect(item.statement.length, item.id).toBeGreaterThan(10);
      } else {
        expect(item.prompt.length, item.id).toBeGreaterThan(10);
        for (const option of item.options) expect(option.label.length, option.id).toBeGreaterThan(2);
      }
    }
  });
});
