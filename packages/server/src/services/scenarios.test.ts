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
  commandLesson,
  scoreClaim,
  standInsFor,
  terminalAidFor,
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
  it('briefs every seated role of every scenario', () => {
    /*
     * Caught a real bug the first time it ran: detection-engineer and
     * fusion-analyst were added to the role union and seated in a scenario
     * without ever being given surfaces or a remit, so they would have sat
     * through an hour with a null brief and an empty board. A role union and a
     * projection table that can drift apart will.
     */
    for (const scenario of SCENARIOS) {
      for (const role of scenario.roles) {
        const brief = briefingFor(scenario.id, role);
        expect(brief, `${scenario.id}: ${role} sits down with no brief`).not.toBeNull();
        expect(brief!.remit, `${scenario.id}: ${role} has no remit`).not.toBe('');
        expect(
          brief!.surfaces.length,
          `${scenario.id}: ${role} is briefed with no consoles`,
        ).toBeGreaterThan(0);
      }
    }
  });

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

describe('terminal help is a function of difficulty', () => {
  it('gives intermediate the question and never the command', () => {
    // Ridgeline is intermediate. Naming what to look for is the analysis;
    // composing the pipeline is the skill, and it only transfers if they do it.
    const aid = terminalAidFor(ID, 'ev.1');
    expect(aid.options).toEqual([]);
    expect(aid.nudge).toMatch(/whether any attempt/i);
    // No command syntax leaked into the nudge.
    expect(aid.nudge).not.toMatch(/grep|cat |\||wc -l/);
  });

  it('offers five distinct, plausible candidates at beginner', () => {
    const authored = truthFor(ID)!.events.filter((e) => e.commandOptions?.length);
    expect(authored.length).toBeGreaterThan(0);
    for (const entry of authored) {
      expect(entry.commandOptions!.length, `${entry.eventId}`).toBe(5);
      // A menu where four options are obviously silly is a button with extra
      // steps, so every candidate has to be a real command somebody might run.
      expect(entry.commandOptions!.every((c) => c.command.trim().length > 6)).toBe(true);
      expect(new Set(entry.commandOptions!.map((c) => c.command)).size).toBe(5);
      // Exactly one is the answer, and every one of the five says what it
      // taught. A distractor that teaches nothing is a wrong answer with no
      // lesson in it, which is the whole reason the format exists.
      // At least one has to work and not all of them. More than one is fine and
      // common: several commands reach the same finding, and grading a working
      // approach as a mistake teaches students to guess the author's syntax
      // preference rather than to investigate.
      const working = entry.commandOptions!.filter((c) => c.correct).length;
      expect(working).toBeGreaterThanOrEqual(1);
      expect(working).toBeLessThan(entry.commandOptions!.length);
      // Destroying evidence is never an acceptable route to a finding.
      expect(entry.commandOptions!.every((c) => !(c.correct && c.harmful))).toBe(true);
      expect(entry.commandOptions!.every((c) => c.teaches.length > 40)).toBe(true);
    }
  });

  it('runs the same scenario at any difficulty', () => {
    // Difficulty is a setting on the RUN, not a property of the incident. The
    // same intrusion is worth meeting again with less help, and authoring one
    // incident four times over would be four chances to contradict yourself.
    expect(terminalAidFor(ID, 'ev.1', 'beginner').options).toHaveLength(5);
    expect(terminalAidFor(ID, 'ev.1', 'beginner').nudge).toBeNull();

    expect(terminalAidFor(ID, 'ev.1', 'intermediate').options).toEqual([]);
    expect(terminalAidFor(ID, 'ev.1', 'intermediate').nudge).not.toBeNull();

    for (const hard of ['advanced', 'expert'] as const) {
      expect(terminalAidFor(ID, 'ev.1', hard).options).toEqual([]);
      expect(terminalAidFor(ID, 'ev.1', hard).nudge).toBeNull();
    }
  });

  it('ships the candidates without the answer attached', () => {
    // The flag and the lesson ARE the answer. Every leak of this kind in this
    // codebase has come from one convenient function being called too early, so
    // the options payload is asserted to carry the command text and nothing else.
    const aid = terminalAidFor(ID, 'ev.1', 'beginner');
    expect(aid.options.length).toBe(5);
    for (const option of aid.options) {
      expect(Object.keys(option)).toEqual(['command']);
    }
    const blob = JSON.stringify(aid);
    for (const forbidden of ['correct', 'teaches', 'harmful']) {
      expect(blob).not.toContain(forbidden);
    }
  });

  it('releases the lesson only once a command has been chosen', () => {
    const entry = truthFor(ID)!.events.find((e) => e.commandOptions)!;
    const right = entry.commandOptions!.find((o) => o.correct)!;
    const wrong = entry.commandOptions!.find((o) => !o.correct)!;

    expect(commandLesson(ID, entry.eventId, right.command)).toMatchObject({ correct: true });
    const lesson = commandLesson(ID, entry.eventId, wrong.command)!;
    expect(lesson.correct).toBe(false);
    // A wrong answer has to say what it cost, not merely that it was wrong.
    expect(lesson.teaches.length).toBeGreaterThan(40);
    // A command nobody offered has no lesson to give.
    expect(commandLesson(ID, entry.eventId, 'rm -rf /')).toBeNull();
  });

  it('marks the two damaging categories as harmful rather than merely wrong', () => {
    // Wasting a minute and destroying the evidence are both wrong answers and
    // they are not the same wrong answer.
    let harmful = 0;
    for (const truth of SCENARIO_TRUTH) {
      for (const entry of truth.events) {
        for (const option of entry.commandOptions ?? []) {
          if (option.harmful) {
            harmful += 1;
            expect(option.correct).toBe(false);
          }
        }
      }
    }
    expect(harmful).toBeGreaterThan(0);
  });

  it('gives the lead a coaching line only when the run is set to beginner', () => {
    const withGuidance = truthFor(ID)!.events.find((e) => e.guidance)!;
    expect(guidanceFor(ID, withGuidance.eventId, 'ir-lead', 'beginner')).not.toBeNull();
    expect(guidanceFor(ID, withGuidance.eventId, 'ir-lead', 'advanced')).toBeNull();
    // Still lead-only, even at beginner.
    expect(guidanceFor(ID, withGuidance.eventId, 'soc-operator', 'beginner')).toBeNull();
  });

  it('stops asserting a severity at expert', () => {
    // The claimed severity is whoever wrote the rule guessing. Reading it off
    // the row is the habit expert difficulty exists to remove.
    const normal = eventsFor(ID, 'soc-operator', 99_999, 'intermediate');
    const expert = eventsFor(ID, 'soc-operator', 99_999, 'expert');
    expect(normal.some((e) => e.claimedSeverity !== null)).toBe(true);
    expect(expert.every((e) => e.claimedSeverity === null)).toBe(true);
  });

  /*
   * Expert changes the EVIDENCE, not the scaffolding.
   *
   * Withholding hints makes a scenario tedious. These four make it hard, and
   * each one is asserted separately because each is a flag an author can set
   * and get silently wrong.
   */
  describe('expert difficulty', () => {
    it('puts attacker-generated noise on the board, and only at expert', () => {
      const below = eventsFor(ID, 'soc-operator', 99_999, 'advanced').map((e) => e.id);
      const expert = eventsFor(ID, 'soc-operator', 99_999, 'expert').map((e) => e.id);
      // The decoy flood does not exist below expert. It is not hidden from a
      // seat, that run never had it.
      expect(below).not.toContain('ev.11');
      expect(expert).toContain('ev.11');
      expect(truthFor(ID)!.events.find((e) => e.eventId === 'ev.11')!.verdict).toBe('decoy');
    });

    it('removes a stage from every seat, so the gap has to be inferred', () => {
      for (const role of ['network-analyst', 'ir-lead', 'log-analyst'] as const) {
        const ids = eventsFor(ID, role, 99_999, 'expert').map((e) => e.id);
        expect(ids).not.toContain('ev.4');
      }
      // The lead sees every surface, so if anybody could still see it, they
      // could. Nobody can, which is what makes it a gap rather than a secret.
      expect(eventsFor(ID, 'ir-lead', 99_999, 'intermediate').map((e) => e.id)).toContain('ev.4');
    });

    it('makes two seats hold different accounts of one moment', () => {
      const operator = eventsFor(ID, 'soc-operator', 99_999, 'expert').find((e) => e.id === 'ev.5');
      const cloud = eventsFor(ID, 'cloud-security', 99_999, 'expert').find((e) => e.id === 'ev.5');
      expect(operator).toBeDefined();
      expect(cloud).toBeDefined();
      // The seat that owns the surface keeps the full record; the seat reached
      // through a lossy connector gets the degraded one. They disagree on the
      // count, and both consoles are working correctly.
      expect(operator!.detail).not.toBe(cloud!.detail);
      expect(cloud!.detail).toMatch(/[Ff]ive snapshots?|deleted five/);
      expect(operator!.detail).toMatch(/2 snapshot delete calls/);
      // Below expert there is no contradiction to find.
      expect(
        eventsFor(ID, 'soc-operator', 99_999, 'intermediate').find((e) => e.id === 'ev.5'),
      ).toBeUndefined();
    });

    it('stops telling a seat how many events are coming', () => {
      // "Am I done" is a question expert makes the floor answer from evidence
      // rather than from a progress bar.
      expect(briefingFor(ID, 'soc-operator', 'intermediate')!.expectedEvents).toBeGreaterThan(0);
      expect(briefingFor(ID, 'soc-operator', 'expert')!.expectedEvents).toBeNull();
      expect(briefingFor(ID, 'soc-operator', 'expert')!.glossary).toEqual([]);
    });

    it('reports a withheld stage in the debrief and never counts it as missed', () => {
      const debrief = buildDebrief(ID, [], 'expert')!;
      expect(debrief.withheld).toContain('ev.4');
      expect(debrief.missed).not.toContain('ev.4');
      expect(debrief.summary).toMatch(/never reached any console/);
      // Nobody claimed anything, so everything that WAS shown is missed. The
      // withheld stage is the only malicious event exempt.
      expect(debrief.stages.find((s) => s.eventId === 'ev.4')!.neverShown).toBe(true);
    });

    it('says what the planted evidence was built to suggest', () => {
      const staged = buildDebrief(ID, [], 'expert')!.stages.find((s) => s.eventId === 'ev.12')!;
      // Teaching "distrust the tidy story" requires stating the story.
      expect(staged.appearsToBe).toMatch(/named criminal group/i);
    });
  });

  describe('unsettled events', () => {
    const ambiguous = 'ev.13';

    function claim(confidence: number, reasoning: string) {
      return {
        eventId: ambiguous,
        role: 'soc-operator' as const,
        disposition: 'escalate' as const,
        reasoning,
        actionIds: ['act.triage-high'],
        escalateTo: 'ir-lead' as const,
        confidence,
        atSeconds: 360,
      };
    }

    const hedged = 'Cannot call this either way. MFA passed and they are on leave, which cuts ' +
      'both ways. I would need the device posture record to settle it.';

    it('marks calibration rather than correctness', () => {
      const score = scoreClaim(ID, claim(45, hedged))!;
      expect(score.lines[0].label).toBe('Calibration');
    });

    it('accepts either disposition when the confidence is honest', () => {
      const escalated = scoreClaim(ID, claim(45, hedged))!;
      const dismissed = scoreClaim(ID, { ...claim(45, hedged), disposition: 'dismiss', escalateTo: null })!;
      // Both are good work. There is nothing here to be right about.
      expect(escalated.lines[0].points).toEqual(dismissed.lines[0].points);
      expect(escalated.lines[0].points).toBeGreaterThan(30);
    });

    it('punishes certainty the evidence does not support', () => {
      const confident = scoreClaim(ID, claim(95, hedged))!;
      const honest = scoreClaim(ID, claim(45, hedged))!;
      expect(confident.lines[0].points).toBeLessThan(honest.lines[0].points);
      expect(confident.lines[0].notes.join(' ')).toMatch(/does not support it/);
    });

    it('also marks down refusing to have a view at all', () => {
      // Quieter failure, still a failure: it leaves the call with somebody
      // holding less evidence than you.
      const abdicated = scoreClaim(ID, claim(5, hedged))!;
      expect(abdicated.lines[0].points).toBeLessThan(scoreClaim(ID, claim(45, hedged))!.lines[0].points);
      expect(abdicated.lines[0].notes.join(' ')).toMatch(/declining to have a view/);
    });

    it('rewards naming what would settle it', () => {
      const names = scoreClaim(ID, claim(45, hedged))!;
      const does_not = scoreClaim(
        ID,
        claim(45, 'This is unclear to me and I am not confident about it in either direction at all.'),
      )!;
      expect(names.lines[0].points).toBeGreaterThan(does_not.lines[0].points);
    });
  });

  it('withholds both from advanced and expert', () => {
    // Asserted by construction: only beginner reaches options and only
    // intermediate reaches the nudge, so a harder scenario cannot leak either
    // however much its content defines.
    for (const scenario of SCENARIOS) {
      if (scenario.difficulty === 'beginner' || scenario.difficulty === 'intermediate') continue;
      for (const entry of truthFor(scenario.id)!.events) {
        const aid = terminalAidFor(scenario.id, entry.eventId);
        expect(aid.options).toEqual([]);
        expect(aid.nudge).toBeNull();
      }
    }
  });

  it('is available to every seat, not just the lead', () => {
    // Unlike guidanceFor. This is scaffolding for using a console, not a hint
    // about the incident: restricting it would mean nobody investigates.
    expect(terminalAidFor(ID, 'ev.9').nudge).not.toBeNull();
  });
});

describe('empty seats are covered by the lead', () => {
  const ALL = getScenario(ID)!.roles;

  it('gives the lead nothing for a seat somebody is sitting in', () => {
    // Everyone present: the people in the chairs do the work.
    expect(standInsFor(ID, ALL, 99_999)).toEqual([]);
  });

  it('covers only the chairs nobody filled', () => {
    const short = ALL.filter((r) => r !== 'forensics' && r !== 'cloud-security');
    const due = standInsFor(ID, short, 99_999);
    const roles = new Set(due.map((d) => d.role));
    expect(roles).toEqual(new Set(['forensics', 'cloud-security']));
    expect(due.every((d) => d.text.length > 40)).toBe(true);
  });

  it('paces them, rather than dumping a feed the moment each event lands', () => {
    const short = ALL.filter((r) => r !== 'forensics');
    // ev.10 lands at 180s. Forensics does not have something to say instantly.
    expect(standInsFor(ID, short, 200).some((d) => d.eventId === 'ev.10')).toBe(false);
    expect(standInsFor(ID, short, 600).some((d) => d.eventId === 'ev.10')).toBe(true);
  });

  it('is a finding, not a verdict', () => {
    // It reports what that seat saw. It does not tell the floor what to do,
    // because the lead relaying it still has to decide.
    const due = standInsFor(ID, ALL.filter((r) => r !== 'network-analyst'), 99_999);
    const text = due.map((d) => d.text).join(' ').toLowerCase();
    expect(text).not.toMatch(/you should|escalate this to|declare an incident/);
  });

  it('arrives in the order the shift would have produced it', () => {
    const due = standInsFor(ID, ['ir-lead'], 99_999);
    const times = due.map((d) => d.dueAtSeconds);
    expect([...times].sort((a, b) => a - b)).toEqual(times);
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
