import { describe, expect, it } from 'vitest';

import type { Claim, LeadReadout, SocRoleId } from '@soc/shared';

import { buildAfterAction, reviewIsAvailable } from './afterAction.js';
import { historyFor, historyForTier, pickerLabel, qualifiesAsAttempt } from './attempts.js';
import type { AttemptRecord } from './attempts.js';
import { truthFor } from './scenarios.js';
import { SCENARIO_TRUTH } from '../content/scenarios/index.js';

const ID = 'ridgeline';

const EMPTY_READOUT: LeadReadout = { findings: [], mitigations: [], missingReports: [] };

function claim(over: Partial<Claim> & Pick<Claim, 'eventId' | 'role'>): Claim {
  return {
    disposition: 'escalate',
    reasoning: 'x'.repeat(80),
    actionIds: [],
    escalateTo: null,
    confidence: 60,
    atSeconds: 60,
    ...over,
  };
}

function review(over: Partial<Parameters<typeof buildAfterAction>[0]> = {}) {
  return buildAfterAction({
    scenarioId: ID,
    difficulty: 'intermediate',
    claims: [],
    readout: EMPTY_READOUT,
    filedReports: [],
    controlProposedAtSeconds: 900,
    closedAtSeconds: 1800,
    ...over,
  })!;
}

describe('the ideal run', () => {
  it('is derived from truth, so it cannot describe a step scoring would not credit', () => {
    const r = review();
    const truth = truthFor(ID)!;
    expect(r.ideal).toHaveLength(truth.events.length);
    for (const step of r.ideal) {
      const entry = truth.events.find((e) => e.eventId === step.eventId)!;
      expect(step.owner).toBe(entry.firstResponder);
      expect(step.what).toBe(entry.why);
      expect(step.move.length).toBeGreaterThan(0);
    }
  });

  it('orders every event and says what this run did with each', () => {
    const r = review({ claims: [claim({ eventId: 'ev.1', role: 'soc-operator', atSeconds: 30 })] });
    expect(r.ideal.find((s) => s.eventId === 'ev.1')!.actual).toBe('caught');
    // Nobody touched the rest.
    expect(r.ideal.filter((s) => s.actual === 'missed').length).toBeGreaterThan(0);
  });

  it('never counts a stage this run never showed', () => {
    // At expert the lateral movement pivot is withheld from every seat, so it
    // is not a step the floor failed to take.
    const r = review({ difficulty: 'expert' });
    expect(r.ideal.find((s) => s.eventId === 'ev.4')!.actual).toBe('not-shown');
    // And the expert-only events are steps at expert and not below.
    expect(r.ideal.find((s) => s.eventId === 'ev.11')!.actual).not.toBe('not-shown');
    expect(review().ideal.find((s) => s.eventId === 'ev.11')!.actual).toBe('not-shown');
  });
});

describe('what to do differently', () => {
  it('says nothing about mistakes this floor did not make', () => {
    // Every improvement is triggered by something that happened in THIS run.
    // A floor that filed everything is not told to file reports.
    const r = review({ readout: EMPTY_READOUT, controlProposedAtSeconds: 900 });
    expect(r.improvements.some((i) => i.observed.includes('closed without filing'))).toBe(false);
    expect(r.improvements.some((i) => i.observed.includes('No control was proposed'))).toBe(false);
  });

  it('names the seats a lane violation belongs to', () => {
    // ev.1 is the operator's. Forensics taking it is not wrong knowledge, it is
    // somebody else's queue going unwatched.
    const r = review({ claims: [claim({ eventId: 'ev.1', role: 'forensics' })] });
    const lane = r.improvements.find((i) => i.observed.includes('belonging to another seat'))!;
    expect(lane).toBeDefined();
    expect(lane.forRoles).toContain('forensics');
    expect(lane.eventIds).toContain('ev.1');
  });

  it('flags a claim committed without opening anything', () => {
    const r = review({
      claims: [claim({ eventId: 'ev.1', role: 'soc-operator' })],
      traces: { 'ev.1': { commandCount: 0, opened: [], secondsSpent: 9 } },
    });
    expect(r.improvements.some((i) => i.observed.includes('no evidence opened'))).toBe(true);
  });

  it('flags confidence the evidence did not support', () => {
    // ev.7 is the inbound scan: noise. Dismissing it is right; calling it a
    // threat at 95% is the expensive kind of wrong.
    const r = review({
      claims: [claim({ eventId: 'ev.7', role: 'soc-operator', confidence: 95 })],
    });
    expect(r.improvements.some((i) => i.observed.includes('high confidence'))).toBe(true);
  });

  it('asks for a control when nobody proposed one', () => {
    const r = review({ controlProposedAtSeconds: null });
    const item = r.improvements.find((i) => i.observed === 'No control was proposed.')!;
    expect(item.forRoles).toContain('detection-engineer');
  });

  it('names seats that never filed rather than averaging them away', () => {
    const missing: SocRoleId[] = ['forensics', 'threat-intel'];
    const r = review({ readout: { ...EMPTY_READOUT, missingReports: missing } });
    const item = r.improvements.find((i) => i.observed.includes('closed without filing'))!;
    expect(item.forRoles).toEqual(missing);
  });
});

describe('the findings that decided it', () => {
  it('reports them separately rather than averaging them into a percentage', () => {
    const r = review();
    expect(r.criticalFindings.length).toBeGreaterThan(0);
    // Nobody claimed anything, so none were reached.
    expect(r.criticalFindings.every((c) => !c.caught)).toBe(true);
    expect(r.summary).toMatch(/decided this incident were not reached/);
  });

  it('says so plainly when every one was reached', () => {
    const critical = truthFor(ID)!.events.filter((e) => e.critical);
    const claims = critical.map((e) =>
      claim({ eventId: e.eventId, role: e.firstResponder, atSeconds: 30 }),
    );
    const r = review({ claims });
    expect(r.criticalFindings.every((c) => c.caught)).toBe(true);
    expect(r.summary).toMatch(/Every finding that decided this incident was reached/);
  });

  it('every scenario names at least one', () => {
    // A scenario where nothing is decisive is a scenario where a floor can miss
    // anything and still average well.
    for (const truth of SCENARIO_TRUTH) {
      const n = truth.events.filter((e) => e.critical).length;
      expect(n, `${truth.scenarioId} marks no finding as critical`).toBeGreaterThan(0);
    }
  });
});

describe('release', () => {
  it('holds the review until the lead has closed and read out', () => {
    // The floor commits to its own account first. A team that hears the model
    // answer before that remembers the model answer.
    expect(reviewIsAvailable({ closedAtSeconds: null, readoutDelivered: false }).ready).toBe(false);
    expect(reviewIsAvailable({ closedAtSeconds: 1800, readoutDelivered: false }).ready).toBe(false);
    expect(reviewIsAvailable({ closedAtSeconds: 1800, readoutDelivered: false }).waitingOn).toMatch(
      /read out findings and mitigations/,
    );
    expect(reviewIsAvailable({ closedAtSeconds: 1800, readoutDelivered: true }).ready).toBe(true);
  });

  it('carries the floor own account alongside what happened', () => {
    const readout: LeadReadout = {
      findings: ['Stale test account brute forced, key added for persistence.'],
      mitigations: ['Disable the account, alert on authorized_keys writes.'],
      missingReports: [],
    };
    const r = review({ readout });
    expect(r.readout.findings).toEqual(readout.findings);
    // Authored once, identical every run.
    expect(r.whatHappened).toEqual(truthFor(ID)!.narrative);
  });
});

describe('attempt history', () => {
  const base = { userId: 'u.1', scenarioId: ID, role: 'soc-operator' as SocRoleId, score: 80, caughtCritical: true };
  const at = (d: string) => new Date(d);

  it('shows a tier letter rather than a tick', () => {
    // A tick against beginner and expert claims they were the same run.
    const h = historyFor(ID, [
      { ...base, difficulty: 'beginner', completedAt: at('2026-08-01') },
      { ...base, difficulty: 'advanced', completedAt: at('2026-08-20') },
    ]);
    expect(h.badges).toEqual(['B', 'A']);
    expect(pickerLabel(h)).toBe('Completed B A');
  });

  it('orders badges by tier so a gap in the sequence is visible', () => {
    const h = historyFor(ID, [
      { ...base, difficulty: 'expert', completedAt: at('2026-08-25') },
      { ...base, difficulty: 'beginner', completedAt: at('2026-08-01') },
    ]);
    // Run out of order, still reads B then E, with the gap where I and A go.
    expect(h.badges).toEqual(['B', 'E']);
  });

  it('suggests the lowest tier not yet run', () => {
    expect(historyFor(ID, []).suggestedNext).toBe('beginner');
    expect(
      historyFor(ID, [{ ...base, difficulty: 'beginner', completedAt: at('2026-08-01') }])
        .suggestedNext,
    ).toBe('intermediate');
    const all = (['beginner', 'intermediate', 'advanced', 'expert'] as const).map((difficulty) => ({
      ...base,
      difficulty,
      completedAt: at('2026-08-01'),
    }));
    expect(historyFor(ID, all).suggestedNext).toBeNull();
  });

  it('labels a repeat without preventing one', () => {
    const records = [{ ...base, difficulty: 'beginner' as const, completedAt: at('2026-08-01') }];
    const h = historyForTier(ID, records, 'beginner');
    // Advisory only. Somebody running beginner again to teach a colleague gets
    // to, and the design wants repeats at harder tiers.
    expect(h.repeatOf).toBe('beginner');
    expect(historyForTier(ID, records, 'advanced').repeatOf).toBeNull();
  });

  it('keeps the best score per tier rather than the latest', () => {
    const h = historyFor(ID, [
      { ...base, difficulty: 'beginner', score: 91, completedAt: at('2026-08-01') },
      { ...base, difficulty: 'beginner', score: 64, completedAt: at('2026-08-09') },
    ]);
    expect(h.bestByTier.beginner).toBe(91);
    expect(h.attempts).toHaveLength(2);
    // Newest first.
    expect(h.attempts[0].score).toBe(64);
  });

  it('ignores other scenarios', () => {
    const h = historyFor(ID, [
      { ...base, scenarioId: 'cheap-rent', difficulty: 'expert', completedAt: at('2026-08-01') },
    ]);
    expect(h.badges).toEqual([]);
    expect(pickerLabel(h)).toBeNull();
  });

  it('does not record somebody who dropped out as having run it', () => {
    expect(qualifiesAsAttempt({ claimsCommitted: 0, wasPresentAtClose: true })).toBe(false);
    expect(qualifiesAsAttempt({ claimsCommitted: 3, wasPresentAtClose: false })).toBe(false);
    expect(qualifiesAsAttempt({ claimsCommitted: 1, wasPresentAtClose: true })).toBe(true);
  });
});
