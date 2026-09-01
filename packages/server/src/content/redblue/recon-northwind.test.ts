import { describe, expect, it } from 'vitest';

import type { MatchMove, MatchSide, MatchState } from '@soc/shared';

import { MatchError } from '../../services/matchEngine.js';
import { maxTurnsFor, resolveMoveFor } from '../../services/matchContent.js';
import { RECON_NORTHWIND } from './recon-northwind.js';

const { resolve, id } = RECON_NORTHWIND;

function move(side: MatchSide, optionId: string): MatchMove {
  return { seq: 0, side, turn: 1, optionId, justification: '', score: null, signal: null, at: 0 };
}

function stateWith(moves: MatchMove[]): MatchState {
  return {
    id: 'm',
    scenarioId: id,
    difficulty: 'beginner',
    status: 'active',
    visibility: 'open',
    joinCode: null,
    hostUserId: 'h',
    red: { side: 'red', userId: 'r', identity: null },
    blue: { side: 'blue', userId: 'b', identity: null },
    toMove: 'red',
    turn: 1,
    maxTurns: 5,
    moves,
    findings: [],
    hostLog: [],
    terminalCwd: { red: '/home/student', blue: '/home/student' },
    createdAt: 0,
    lastMoveAt: null,
  };
}

const WHY = 'staying passive to avoid leaving a trace';
const red = (state: MatchState, optionId: string, why = WHY) =>
  resolve({ state, side: 'red', optionId, justification: why });
const blue = (state: MatchState, optionId: string, why = WHY) =>
  resolve({ state, side: 'blue', optionId, justification: why });

/** Three distinct passive red moves already taken -- "passive well drained". */
const DISCIPLINED = stateWith([move('red', 'osint-sweep'), move('red', 'whois'), move('red', 'dns-passive')]);

describe('red scoring: quiet, and in order', () => {
  it('rewards a first passive source fully and leaks nothing', () => {
    const r = red(stateWith([]), 'osint-sweep');
    expect(r.score.objectivePoints).toBe(9);
    expect(r.signal).toBeNull();
  });

  it('gives little for repeating a source already run', () => {
    const r = red(stateWith([move('red', 'osint-sweep')]), 'osint-sweep');
    expect(r.score.objectivePoints).toBe(2);
  });

  it('punishes a loud scan taken before any passive recon, and leaks a loud signal', () => {
    const r = red(stateWith([]), 'vuln-scan');
    expect(r.score.objectivePoints).toBe(1);
    expect(r.signal?.detected).toBe(true);
    expect(r.signal?.label).toMatch(/IDS/);
  });

  it('docks an early active probe but not as hard as a loud one', () => {
    const r = red(stateWith([]), 'banner-grab');
    expect(r.score.objectivePoints).toBe(2);
    expect(r.signal?.label).toBe('Web banner probe');
  });

  it('accepts a careful active probe once passive is exhausted', () => {
    expect(red(DISCIPLINED, 'port-scan-slow').score.objectivePoints).toBe(5);
  });

  it('still marks a heavy scan down even when disciplined', () => {
    expect(red(DISCIPLINED, 'vuln-scan').score.objectivePoints).toBe(3);
  });

  it('refuses a move that is not a red option', () => {
    expect(() => red(stateWith([]), 'hold-baseline')).toThrow(MatchError);
  });
});

describe('blue scoring: match the response to the queue', () => {
  const quiet = stateWith([move('red', 'osint-sweep')]);
  const loud = stateWith([move('red', 'port-sweep-full')]);
  const faint = stateWith([move('red', 'banner-grab')]);

  it('rewards holding when nothing landed and misses when a scan did', () => {
    expect(blue(quiet, 'hold-baseline').score.objectivePoints).toBe(10);
    expect(blue(loud, 'hold-baseline').score.objectivePoints).toBe(2);
  });

  it('rewards investigating a real signal, not an empty queue', () => {
    expect(blue(loud, 'investigate').score.objectivePoints).toBe(9);
    expect(blue(quiet, 'investigate').score.objectivePoints).toBe(3);
  });

  it('rewards a block only when the traffic earns it, and leaks the block to red', () => {
    const onLoud = blue(loud, 'block-source');
    expect(onLoud.score.objectivePoints).toBe(10);
    expect(onLoud.signal?.label).toBe('Source blocked');

    expect(blue(faint, 'block-source').score.objectivePoints).toBe(5);
    expect(blue(quiet, 'block-source').score.objectivePoints).toBe(1);
  });

  it('refuses a move that is not a blue option', () => {
    expect(() => blue(quiet, 'osint-sweep')).toThrow(MatchError);
  });
});

describe('findings revealed (the investigation layer)', () => {
  it('a red banner grab surfaces the exposed Tomcat vuln', () => {
    const r = red(stateWith([]), 'banner-grab');
    const tomcat = r.reveals?.find((f) => f.id === 'tomcat-manager');
    expect(tomcat?.kind).toBe('vuln');
    expect(tomcat?.severity).toBe('high');
  });

  it('passive recon surfaces only informational services, never a vuln', () => {
    const r = red(stateWith([]), 'whois');
    expect((r.reveals ?? []).every((f) => f.kind === 'service')).toBe(true);
  });

  it('blue investigate after a loud red move pulls up high-severity evidence', () => {
    const r = blue(stateWith([move('red', 'port-sweep-full')]), 'investigate');
    expect(r.reveals?.[0]?.kind).toBe('evidence');
    expect(r.reveals?.[0]?.severity).toBe('high');
  });

  it('blue investigate with a clean queue turns up nothing', () => {
    const r = blue(stateWith([move('red', 'osint-sweep')]), 'investigate');
    expect(r.reveals ?? []).toHaveLength(0);
  });

  it('a loud red move writes a trace to the host log; passive writes nothing', () => {
    const loud = red(stateWith([]), 'port-sweep-full');
    expect(loud.hostLog?.some((line) => /UFW BLOCK/.test(line))).toBe(true);
    expect(red(stateWith([]), 'whois').hostLog).toBeUndefined();
  });
});

describe('attacker recon console', () => {
  const run = (cmd: string) => RECON_NORTHWIND.attacker!.run(cmd);

  it('maps a full nmap to a loud port sweep with realistic output', () => {
    const r = run('nmap 203.0.113.10');
    expect(r.optionId).toBe('port-sweep-full');
    expect(r.output).toMatch(/8080\/tcp/);
    expect(r.output).toMatch(/Tomcat 8\.5\.0/);
  });

  it('maps a fast nmap to the quieter slow scan', () => {
    expect(run('nmap -F 203.0.113.10').optionId).toBe('port-scan-slow');
  });

  it('maps whois and dig to the quiet passive actions', () => {
    expect(run('whois northwind.example').optionId).toBe('whois');
    expect(run('dig northwind.example').optionId).toBe('dns-passive');
  });

  it('maps curl against the manager to a banner grab', () => {
    const r = run('curl -I http://203.0.113.10:8080/manager');
    expect(r.optionId).toBe('banner-grab');
    expect(r.output).toMatch(/Tomcat/);
  });

  it('spends no turn on help or an unknown tool', () => {
    expect(run('help').optionId).toBeNull();
    expect(run('ls').optionId).toBeNull();
    expect(run('ls').output).toMatch(/not a recon tool/);
  });
});

describe('justification judge (deterministic rubric)', () => {
  const s = stateWith([]);

  it('rewards a developed rationale that names the tradeoff', () => {
    const r = red(s, 'osint-sweep', 'staying passive to avoid leaving a trace before I go loud');
    expect(r.score.judgePoints).toBe(10);
    expect(r.score.maxJudge).toBe(10);
  });

  it('gives little for an empty-headed one-liner', () => {
    const r = red(s, 'osint-sweep', 'idk');
    expect(r.score.judgePoints).toBe(0);
  });

  it('rewards substance even without perfect vocabulary, but less', () => {
    const r = red(s, 'osint-sweep', 'this seems like the safest thing to do right now');
    expect(r.score.judgePoints).toBeGreaterThan(0);
    expect(r.score.judgePoints).toBeLessThan(10);
  });
});

describe('registration', () => {
  it('wires its resolver into the engine seam (not the ungraded placeholder)', () => {
    const resolved = resolveMoveFor(id)({
      state: stateWith([]),
      side: 'red',
      optionId: 'osint-sweep',
      justification: WHY,
    });
    expect(resolved.score.objectivePoints).toBe(9);
    expect(resolved.score.maxObjective).toBe(10);
  });

  it('declares its own turn budget', () => {
    expect(maxTurnsFor(id)).toBe(5);
  });
});
