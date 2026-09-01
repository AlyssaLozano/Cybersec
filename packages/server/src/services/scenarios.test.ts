/**
 * Scenario scoring tests.
 *
 * The most important test here is the blocked-traffic pair. The draft spec
 * scored all blocked traffic as worth escalating, which contradicts the Alert
 * Triage corpus where every blocked-traffic alert is graded `dismiss`. The
 * distinction the content settled on is DIRECTION, and if that ever collapses
 * back into one rule, one of the two packages is teaching the opposite of the
 * other and a student is going to be marked wrong for learning what we taught
 * them. So it is asserted from both sides.
 */

import { describe, expect, it } from 'vitest';

import type { Claim, SocRoleId } from '@soc/shared';

import { SCENARIOS, SCENARIO_TRUTH } from '../content/scenarios/index.js';
import { eventsFor, getScenario, guidanceFor, scoreClaim, truthFor } from './scenarios.js';

const ID = 'ridgeline';

function claim(over: Partial<Claim> & Pick<Claim, 'eventId' | 'role'>): Claim {
  return {
    disposition: 'escalate',
    reasoning:
      'A long enough justification to be assessable, naming what was seen and why it matters.',
    actionIds: [],
    escalateTo: null,
    confidence: 70,
    atSeconds: 0,
    ...over,
  };
}

function line(scenarioId: string, c: Claim, label: string) {
  const score = scoreClaim(scenarioId, c)!;
  return score.lines.find((l) => l.label === label)!;
}

describe('scenario catalogue', () => {
  it('boots, which means every event has truth and every action resolves', () => {
    expect(SCENARIOS.length).toBeGreaterThan(0);
    expect(SCENARIO_TRUTH.length).toBe(SCENARIOS.length);
  });

  it('never ships a verdict on the student-facing event', () => {
    // The event type has no field for it, so this guards against somebody
    // widening the type later and quietly leaking the answer key.
    for (const scenario of SCENARIOS) {
      for (const event of scenario.events) {
        const keys = Object.keys(event);
        for (const forbidden of ['verdict', 'stage', 'firstResponder', 'why', 'correctActions']) {
          expect(keys, `${event.id} ships ${forbidden}`).not.toContain(forbidden);
        }
      }
    }
  });
});

describe('projection: no seat sees the whole board', () => {
  it('shows a cloud audit event to cloud security and not to the operator', () => {
    const late = 3600;
    const cloud = eventsFor(ID, 'cloud-security', late).map((e) => e.id);
    const operator = eventsFor(ID, 'soc-operator', late).map((e) => e.id);
    expect(cloud).toContain('ev.5');
    expect(operator).not.toContain('ev.5');
  });

  it('gives no single seat every event, so the room is required', () => {
    const scenario = getScenario(ID)!;
    const roles = scenario.roles.filter((r) => r !== 'ir-lead');
    for (const role of roles) {
      const seen = eventsFor(ID, role, 3600).length;
      expect(seen, `${role} can see the entire board alone`).toBeLessThan(scenario.events.length);
    }
  });

  it('withholds events that have not happened yet', () => {
    const early = eventsFor(ID, 'network-flow' as SocRoleId, 0);
    expect(early).toEqual([]);
    const atStart = eventsFor(ID, 'soc-operator', 0).map((e) => e.id);
    expect(atStart).toContain('ev.1');
    expect(atStart).not.toContain('ev.8');
  });
});

describe('blocked traffic is scored by direction, not by the word blocked', () => {
  /*
   * ev.2 is outbound from an internal host to a hostile address. The control
   * worked and something inside still tried to call home.
   */
  it('rewards escalating an OUTBOUND blocked connection', () => {
    const score = scoreClaim(
      ID,
      claim({
        eventId: 'ev.2',
        role: 'network-analyst',
        disposition: 'investigate',
        reasoning:
          'Blocked, but outbound from our own host to an address off the allowlist. Something ' +
          'inside ran and tried to reach out. Suspicious regardless of the block.',
        actionIds: ['act.flow-map', 'act.probe-pattern'],
        escalateTo: 'ir-lead',
        confidence: 85,
        atSeconds: 60,
      }),
    )!;
    expect(score.total).toBeGreaterThan(85);
  });

  /*
   * ev.7 is inbound against a closed port, on a rule closed as noise 20,131
   * times. The Alert Triage corpus grades every one of these `dismiss`.
   */
  it('rewards dismissing an INBOUND blocked scan', () => {
    const score = scoreClaim(
      ID,
      claim({
        eventId: 'ev.7',
        role: 'soc-operator',
        disposition: 'dismiss',
        reasoning:
          'Inbound to a closed port and dropped. This rule has fired 23,487 times and been closed ' +
          'as noise nearly every time. There is nothing here to investigate.',
        actionIds: ['act.dismiss'],
        escalateTo: null,
        confidence: 85,
        atSeconds: 200,
      }),
    )!;
    expect(score.total).toBeGreaterThan(85);
  });

  it('punishes escalating the inbound scan, because that is alert fatigue', () => {
    const score = scoreClaim(
      ID,
      claim({
        eventId: 'ev.7',
        role: 'soc-operator',
        disposition: 'escalate',
        reasoning:
          'Blocked traffic is still a threat indicator, the attacker is probing us, so this is ' +
          'malicious reconnaissance and I am escalating it.',
        actionIds: ['act.triage-high'],
        escalateTo: 'ir-lead',
        confidence: 90,
        atSeconds: 200,
      }),
    )!;
    expect(score.total).toBeLessThan(50);
  });
});

describe('role discipline is scored separately from being right', () => {
  it('marks a correct read taken from the wrong seat as a lane violation', () => {
    const c = claim({
      eventId: 'ev.1',
      role: 'malware-analyst',
      disposition: 'escalate',
      reasoning:
        'Sixty-two failed attempts on one account from one external source is a brute force ' +
        'attempt and it should be escalated immediately.',
      escalateTo: 'log-analyst',
      confidence: 85,
      atSeconds: 30,
    });
    const score = scoreClaim(ID, c)!;
    expect(score.laneViolation).toBe('soc-operator');
    // Still credited for reading the threat correctly.
    expect(line(ID, c, 'Accuracy').points).toBeGreaterThan(30);
    // But not for the seat.
    expect(line(ID, c, 'Role discipline').points).toBeLessThan(10);
  });

  it('penalises doing another role job even from the right seat', () => {
    const inLane = claim({
      eventId: 'ev.1',
      role: 'soc-operator',
      reasoning: 'Sixty-two failures against one live account from one source. Brute force. Routing it.',
      actionIds: ['act.triage-high'],
      escalateTo: 'log-analyst',
      atSeconds: 30,
    });
    const overreaching = { ...inLane, actionIds: ['act.triage-high', 'act.write-rule'] };
    expect(line(ID, overreaching, 'Role discipline').points).toBeLessThan(
      line(ID, inLane, 'Role discipline').points,
    );
  });
});

describe('confidence scales accuracy in both directions', () => {
  it('pays more for being right and sure than right and hedging', () => {
    const base = claim({
      eventId: 'ev.1',
      role: 'soc-operator',
      reasoning: 'Sixty-two failures against one live account from one external source. Brute force.',
      actionIds: ['act.triage-high'],
      escalateTo: 'log-analyst',
      atSeconds: 20,
    });
    const sure = line(ID, { ...base, confidence: 95 }, 'Accuracy').points;
    const hedged = line(ID, { ...base, confidence: 30 }, 'Accuracy').points;
    expect(sure).toBeGreaterThan(hedged);
  });

  it('costs more for being wrong and sure than wrong and hedging', () => {
    const base = claim({
      eventId: 'ev.1',
      role: 'soc-operator',
      disposition: 'dismiss',
      reasoning: 'Nothing here, this is not a threat, the account is fine and I am dismissing it.',
      actionIds: ['act.dismiss'],
      atSeconds: 20,
    });
    const sure = line(ID, { ...base, confidence: 95 }, 'Accuracy').points;
    const hedged = line(ID, { ...base, confidence: 20 }, 'Accuracy').points;
    expect(sure).toBeLessThan(hedged);
  });

  it('refuses to assess a disposition with no reasoning behind it', () => {
    const c = claim({
      eventId: 'ev.1',
      role: 'soc-operator',
      reasoning: 'brute force',
      actionIds: ['act.triage-high'],
      escalateTo: 'log-analyst',
      confidence: 95,
      atSeconds: 10,
    });
    expect(line(ID, c, 'Accuracy').points).toBeLessThanOrEqual(12);
  });
});

describe('timing comes from arrival, not from a countdown', () => {
  it('pays full marks inside the grace window and nothing once the queue has moved on', () => {
    const base = claim({
      eventId: 'ev.5',
      role: 'cloud-security',
      reasoning:
        'Snapshots inside retention, a delete permission never used before, and the calls came ' +
        'from inside the estate rather than the scheduler. This is deliberate.',
      actionIds: ['act.iam-audit', 'act.revoke-key'],
      escalateTo: 'ir-lead',
      confidence: 90,
    });
    const fast = line(ID, { ...base, atSeconds: 240 }, 'Timing').points;
    const slow = line(ID, { ...base, atSeconds: 210 + 900 }, 'Timing').points;
    expect(fast).toBe(15);
    expect(slow).toBe(0);
  });
});

describe('escalation', () => {
  it('rewards stopping at an event that ends with you', () => {
    const c = claim({
      eventId: 'ev.8',
      role: 'soc-operator',
      disposition: 'tune',
      reasoning:
        'The monitoring collector failing on a five-minute cadence all day. Stale credential in a ' +
        'config. Dismiss and raise a tuning ticket.',
      actionIds: ['act.dismiss', 'act.tune'],
      escalateTo: null,
      confidence: 90,
      atSeconds: 260,
    });
    expect(line(ID, c, 'Escalation').points).toBe(20);
  });

  it('does not reward handing an event to the wrong seat', () => {
    const c = claim({
      eventId: 'ev.5',
      role: 'cloud-security',
      disposition: 'escalate',
      reasoning: 'Deliberate destruction of the snapshots that would have allowed a recovery.',
      actionIds: ['act.iam-audit'],
      escalateTo: 'malware-analyst',
      confidence: 80,
      atSeconds: 240,
    });
    expect(line(ID, c, 'Escalation').points).toBeLessThan(10);
  });
});

describe('coaching lines are gated by difficulty', () => {
  it('withholds guidance above beginner, even where the content defines it', () => {
    const scenario = getScenario(ID)!;
    expect(scenario.difficulty).not.toBe('beginner');

    const defined = truthFor(ID)!.events.filter((e) => e.guidance);
    expect(defined.length, 'no guidance authored, so this test proves nothing').toBeGreaterThan(0);

    for (const entry of defined) {
      expect(
        guidanceFor(ID, entry.eventId),
        `${entry.eventId} leaked its coaching line at ${scenario.difficulty}`,
      ).toBeNull();
    }
  });

  it('never puts a coaching line in the shipped event detail', () => {
    // The interpretation must not migrate into `detail` to dodge the gate.
    const board = JSON.stringify(getScenario(ID)!.events);
    for (const entry of truthFor(ID)!.events) {
      if (!entry.guidance) continue;
      expect(board).not.toContain(entry.guidance.slice(0, 30));
    }
  });
});

describe('the answer key stays server-side', () => {
  it('releases the explanation only through the score, never through the board', () => {
    const truth = truthFor(ID)!;
    expect(truth.events.every((e) => e.why.length > 0)).toBe(true);
    const board = JSON.stringify(getScenario(ID)!.events);
    for (const entry of truth.events) {
      expect(board).not.toContain(entry.why.slice(0, 40));
    }
  });
});
