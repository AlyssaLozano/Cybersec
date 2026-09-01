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
import {
  briefingFor,
  buildDebrief,
  contestedEvents,
  eventsFor,
  getScenario,
  guidanceFor,
  scoreClaim,
  truthFor,
} from './scenarios.js';

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

  /*
   * Found by asking what the Log Analyst does for the first ten minutes: the
   * answer was that Forensics had nothing to do for the entire hour. No event
   * existed on `host-artefact` or `raw-log`, which are the only surfaces that
   * seat can see, so it was seated in the scenario and permanently idle.
   *
   * A seated role with no events is worse than an unbalanced one. That person
   * paid for the session and is watching other people work.
   */
  it('gives every seated role something to do', () => {
    for (const scenario of SCENARIOS) {
      for (const role of scenario.roles) {
        const seen = eventsFor(scenario.id, role, 99_999);
        expect(
          seen.length,
          `${scenario.id}: ${role} is seated and sees ${seen.length} events`,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('starts every seat inside the first quarter of the shift', () => {
    // Somebody whose first event lands at minute forty has spent most of the
    // session watching.
    for (const scenario of SCENARIOS) {
      const cutoff = (scenario.durationMinutes * 60) / 4;
      for (const role of scenario.roles) {
        const seen = eventsFor(scenario.id, role, 99_999);
        const first = Math.min(...seen.map((e) => e.atSeconds));
        expect(first, `${scenario.id}: ${role} waits ${first}s for anything`).toBeLessThanOrEqual(
          cutoff,
        );
      }
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

describe('two operators reading one alert differently', () => {
  const grepwitch = claim({
    eventId: 'ev.7',
    role: 'soc-operator',
    disposition: 'dismiss',
    reasoning: 'Inbound to a closed port, dropped, on a rule closed as noise twenty thousand times.',
    confidence: 85,
    atSeconds: 200,
  });
  const nullroute = {
    ...grepwitch,
    disposition: 'escalate' as const,
    reasoning: 'Blocked or not, somebody is probing us. Raising it.',
    confidence: 70,
  };

  it('is surfaced as contested rather than resolved or overwritten', () => {
    const contested = contestedEvents([grepwitch, nullroute]);
    expect(contested).toHaveLength(1);
    expect(contested[0]!.eventId).toBe('ev.7');
    expect(contested[0]!.readings.map((r) => r.disposition).sort()).toEqual(['dismiss', 'escalate']);
    // Both readings survive with their reasoning, so the lead adjudicates on
    // the arguments rather than on who claimed second.
    expect(contested[0]!.readings.every((r) => r.reasoning.length > 0)).toBe(true);
  });

  it('does not treat agreement as contested, however many seats agree', () => {
    expect(contestedEvents([grepwitch, { ...grepwitch, role: 'log-analyst' }])).toEqual([]);
  });

  it('scores each seat against ground truth, not against each other', () => {
    // Being outvoted is not being wrong. ev.7 is genuinely noise, so the seat
    // that dismissed it scores well and the one that escalated does not,
    // regardless of what the other said.
    const dismissed = scoreClaim(ID, grepwitch)!;
    const escalated = scoreClaim(ID, nullroute)!;
    expect(dismissed.total).toBeGreaterThan(escalated.total);
  });
});

describe('escalation runs outward from the operator, never back to them', () => {
  it('never routes an event to the soc operator', () => {
    // Tier 1 is the entry point. A specialist who found something in deep
    // analysis has already done the work triage would have done, so handing it
    // back is a round trip that costs time and teaches the wrong reflex.
    for (const scenario of SCENARIOS) {
      const truth = truthFor(scenario.id)!;
      for (const entry of truth.events) {
        expect(
          entry.escalateTo,
          `${scenario.id} ${entry.eventId} escalates back to the operator`,
        ).not.toContain('soc-operator');
      }
    }
  });
});

describe('the seat briefing', () => {
  it('briefs every seated role', () => {
    const scenario = getScenario(ID)!;
    for (const role of scenario.roles) {
      expect(briefingFor(ID, role), `${role} sits down with no brief`).not.toBeNull();
    }
  });

  it('promises only consoles the projection actually gives that seat', () => {
    // A brief that names a console the seat cannot open is worse than no brief.
    const b = briefingFor(ID, 'soc-operator')!;
    expect(b.surfaces).toEqual(['Alert queue']);
    expect(briefingFor(ID, 'forensics')!.surfaces).toEqual(['Host artefacts', 'Raw logs']);
  });

  it('tells them what to ask, never what they will find', () => {
    const truth = truthFor(ID)!;
    for (const role of getScenario(ID)!.roles) {
      const text = JSON.stringify(briefingFor(ID, role));
      // No event id, and no phrase lifted from the answer key.
      for (const entry of truth.events) {
        expect(text).not.toContain(entry.eventId);
        expect(text).not.toContain(entry.why.slice(0, 30));
      }
      expect(text).not.toMatch(/203\.0\.113|198\.51\.100|testuser|sysmon/);
    }
  });

  it('says how much work is coming, so an empty seat is visible up front', () => {
    for (const role of getScenario(ID)!.roles) {
      expect(briefingFor(ID, role)!.expectedEvents).toBeGreaterThan(0);
    }
  });

  it('does not brief a role this scenario has not seated', () => {
    expect(briefingFor(ID, 'vulnerability-analyst')).toBeNull();
  });
});

describe('the investigation trace is reported, never scored', () => {
  const c = claim({
    eventId: 'ev.7',
    role: 'soc-operator',
    disposition: 'dismiss',
    reasoning:
      'Inbound to a closed port and dropped, on a rule closed as noise more than twenty thousand ' +
      'times. Nothing to investigate.',
    actionIds: ['act.dismiss'],
    escalateTo: null,
    confidence: 85,
    atSeconds: 200,
  });

  it('gives an identical mark whether they looked or guessed', () => {
    const guessed = scoreClaim(ID, c, { commandCount: 0, opened: [], secondsSpent: 9 })!;
    const checked = scoreClaim(ID, c, {
      commandCount: 3,
      opened: ['/var/log/auth.log'],
      secondsSpent: 95,
    })!;
    // Same disposition, same reasoning, same seat: the score cannot tell them
    // apart, and it should not try. Grading method makes people type for the
    // transcript.
    expect(guessed.total).toBe(checked.total);
  });

  it('says which one happened, which the score cannot', () => {
    const guessed = scoreClaim(ID, c, { commandCount: 0, opened: [], secondsSpent: 9 })!;
    const checked = scoreClaim(ID, c, {
      commandCount: 3,
      opened: ['/var/log/auth.log'],
      secondsSpent: 95,
    })!;
    expect(guessed.investigation?.looked).toBe(false);
    expect(guessed.investigation?.note).toMatch(/recognition/i);
    expect(checked.investigation?.looked).toBe(true);
    expect(checked.investigation?.note).toContain('/var/log/auth.log');
  });

  it('is absent entirely when no trace was recorded', () => {
    expect(scoreClaim(ID, c)!.investigation).toBeUndefined();
  });
});

describe('threat intel', () => {
  it('maps techniques on truth, never on the board', () => {
    // Naming the technique is most of the intel seat's answer, so printing
    // "T1110" on the event would hand it over.
    const withTech = truthFor(ID)!.events.filter((e) => e.techniques?.length);
    expect(withTech.length).toBeGreaterThan(4);
    const board = JSON.stringify(getScenario(ID)!.events);
    for (const entry of withTech) {
      for (const t of entry.techniques!) {
        expect(board, `${entry.eventId} leaks ${t}`).not.toContain(t.split(' ')[0]!);
      }
    }
  });

  it('makes assessing an actor class in-lane and naming a group out-of-lane', () => {
    const scenario = getScenario(ID)!;
    const byId = new Map(scenario.actions.map((a) => [a.id, a]));
    // Assessment with a stated basis is the job.
    expect(byId.get('act.assess-actor')!.forRoles).toContain('threat-intel');
    expect(byId.get('act.ttp-map')!.forRoles).toContain('threat-intel');
    expect(byId.get('act.predict')!.forRoles).toContain('threat-intel');
    // Asserting a named group as fact is in-lane for nobody, including them.
    expect(byId.get('act.attribute-named')!.forRoles).toEqual([]);
  });

  it('briefs the intel seat on motive and next move, not just mapping', () => {
    const b = briefingFor(ID, 'threat-intel')!;
    expect(b.remit).toMatch(/ATT&CK/);
    expect(JSON.stringify(b.questions)).toMatch(/motive|next move/i);
    expect(b.glossary.map((g) => g.term)).toEqual(
      expect.arrayContaining(['ATT&CK', 'Actor class', 'Analytic confidence']),
    );
  });
});

describe('the seat glossary', () => {
  it('defines all four dispositions for every seat', () => {
    for (const role of getScenario(ID)!.roles) {
      const terms = briefingFor(ID, role)!.glossary.map((g) => g.term);
      expect(terms).toEqual(expect.arrayContaining(['Escalate', 'Investigate', 'Dismiss', 'Tune the rule']));
    }
  });

  it('adds vocabulary specific to the seat', () => {
    const forensics = briefingFor(ID, 'forensics')!.glossary.map((g) => g.term);
    expect(forensics).toContain('Order of volatility');
    expect(forensics).not.toContain('Prompt injection');
  });

  it('explains terms without giving away the scenario', () => {
    for (const role of getScenario(ID)!.roles) {
      const text = JSON.stringify(briefingFor(ID, role)!.glossary);
      expect(text).not.toMatch(/203\.0\.113|198\.51\.100|testuser|sysmon|ev\./);
    }
  });
});

describe('hints reach the lead and nobody else', () => {
  it('gives a beginner lead the coaching line and gives every other seat nothing', () => {
    const beginner = SCENARIOS.find((s) => s.difficulty === 'beginner');
    if (!beginner) {
      // Ridgeline is intermediate, so assert the shape holds on it instead.
      expect(guidanceFor(ID, 'ev.8', 'ir-lead')).toBeNull();
      return;
    }
    const withGuidance = truthFor(beginner.id)!.events.find((e) => e.guidance)!;
    expect(guidanceFor(beginner.id, withGuidance.eventId, 'ir-lead')).not.toBeNull();
    for (const role of beginner.roles.filter((r) => r !== 'ir-lead')) {
      expect(guidanceFor(beginner.id, withGuidance.eventId, role)).toBeNull();
    }
  });

  it('still gives the lead nothing above beginner', () => {
    for (const entry of truthFor(ID)!.events.filter((e) => e.guidance)) {
      expect(guidanceFor(ID, entry.eventId, 'ir-lead')).toBeNull();
    }
  });
});

describe('the debrief', () => {
  const claims = [
    claim({ eventId: 'ev.1', role: 'soc-operator', disposition: 'escalate', confidence: 85, atSeconds: 40 }),
    claim({ eventId: 'ev.7', role: 'soc-operator', disposition: 'dismiss', confidence: 80, atSeconds: 200 }),
  ];

  it('reads back what happened, identically regardless of how the run went', () => {
    const good = buildDebrief(ID, claims)!;
    const nobody = buildDebrief(ID, [])!;
    // The attacker did the same thing whether or not anybody noticed.
    expect(good.whatHappened).toEqual(nobody.whatHappened);
    expect(good.whatHappened.length).toBeGreaterThan(3);
  });

  it('computes how this floor found it, which does differ', () => {
    const good = buildDebrief(ID, claims)!;
    const nobody = buildDebrief(ID, [])!;
    expect(good.missed.length).toBeLessThan(nobody.missed.length);

    const ev1 = good.stages.find((s) => s.eventId === 'ev.1')!;
    expect(ev1.spottedBy).toBe('soc-operator');
    expect(ev1.spottedAfterSeconds).toBe(40);
    expect(ev1.readCorrectly).toBe(true);
  });

  it('does not count noise as a missed stage', () => {
    // Nobody needs telling they failed to escalate the monitoring collector.
    const nobody = buildDebrief(ID, [])!;
    expect(nobody.missed).not.toContain('ev.8');
    expect(nobody.missed).not.toContain('ev.7');
    expect(nobody.missed).toContain('ev.1');
  });

  it('releases the explanation only now', () => {
    const d = buildDebrief(ID, claims)!;
    expect(d.stages.every((s) => s.why.length > 0)).toBe(true);
    const board = JSON.stringify(getScenario(ID)!.events);
    for (const s of d.stages) expect(board).not.toContain(s.why.slice(0, 30));
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
        guidanceFor(ID, entry.eventId, 'ir-lead'),
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
