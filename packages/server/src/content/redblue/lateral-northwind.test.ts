import { describe, expect, it } from 'vitest';

import type { MatchMove, MatchSide, MatchState } from '@soc/shared';

import { MatchError } from '../../services/matchEngine.js';
import { maxTurnsFor, resolveMoveFor } from '../../services/matchContent.js';
import { LATERAL_NORTHWIND } from './lateral-northwind.js';

const { resolve, id } = LATERAL_NORTHWIND;
const WHY = 'dump the credential first, then move quietly with the hash';

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

const AFTER_CREDS = stateWith([move('red', 'dump-credentials')]);

describe('red: no movement without credentials', () => {
  it('fails a pass-the-hash with nothing dumped', () => {
    const r = red(stateWith([]), 'pass-the-hash');
    expect(r.score.objectivePoints).toBe(1);
    expect(r.reveals?.[0]?.id).toBe('lateral-failed');
  });

  it('reaches the file server quietly once a credential is in hand', () => {
    const r = red(AFTER_CREDS, 'pass-the-hash');
    expect(r.score.objectivePoints).toBe(10);
    expect(r.reveals?.some((f) => f.id === 'reached-fileserver')).toBe(true);
  });

  it('reaches the file server loudly with PsExec, and scores lower for the noise', () => {
    const r = red(AFTER_CREDS, 'psexec');
    expect(r.score.objectivePoints).toBe(6);
    expect(r.hostLog?.some((l) => /PSEXESVC/.test(l))).toBe(true);
  });

  it('marks the credential dump as loud on EDR', () => {
    const r = red(stateWith([]), 'dump-credentials');
    expect(r.signal?.label).toMatch(/Credential access/);
    expect(r.reveals?.[0]?.id).toBe('creds');
  });
});

describe('blue: catch the move in the middle', () => {
  const recon = stateWith([move('red', 'enumerate-internal')]);
  const creds = stateWith([move('red', 'dump-credentials')]);
  const quietMove = stateWith([move('red', 'dump-credentials'), move('red', 'pass-the-hash')]);
  const loudMove = stateWith([move('red', 'dump-credentials'), move('red', 'psexec')]);
  const quiet = stateWith([move('red', 'wait')]);

  it('resets the credential right after a dump, not on silence', () => {
    expect(blue(creds, 'reset-credentials').score.objectivePoints).toBe(10);
    expect(blue(quiet, 'reset-credentials').score.objectivePoints).toBe(3);
  });

  it('segments the core when Red is still mapping it', () => {
    expect(blue(recon, 'segment-network').score.objectivePoints).toBe(9);
  });

  it('isolates the beachhead once a pivot has happened, and overreacts on silence', () => {
    expect(blue(quietMove, 'isolate-host').score.objectivePoints).toBe(10);
    expect(blue(loudMove, 'isolate-host').score.objectivePoints).toBe(10);
    expect(blue(quiet, 'isolate-host').score.objectivePoints).toBe(2);
  });

  it('hunting surfaces the evidence for whatever happened', () => {
    expect(blue(loudMove, 'hunt-internal').reveals?.[0]?.id).toBe('ev-psexec');
    expect(blue(quiet, 'hunt-internal').reveals ?? []).toHaveLength(0);
  });

  it('refuses a red move on the blue path', () => {
    expect(() => blue(recon, 'psexec')).toThrow(MatchError);
  });
});

describe('attacker console', () => {
  const run = (cmd: string) => LATERAL_NORTHWIND.attacker!.run(cmd);

  it('maps the pivot chain to its actions', () => {
    expect(run('nmap 10.10.5.0/24').optionId).toBe('enumerate-internal');
    expect(run('secretsdump.py svc@10.10.5.10').optionId).toBe('dump-credentials');
    expect(run('crackmapexec smb 10.10.5.20 -H 5f4dcc...').optionId).toBe('pass-the-hash');
    expect(run('psexec \\\\10.10.5.20 cmd').optionId).toBe('psexec');
  });

  it('spends no turn on help or an unknown tool', () => {
    expect(run('help').optionId).toBeNull();
    expect(run('vim notes.txt').optionId).toBeNull();
  });
});

describe('registration', () => {
  it('is wired into the engine seam with its own turn budget', () => {
    const r = resolveMoveFor(id)({ state: AFTER_CREDS, side: 'red', optionId: 'pass-the-hash', justification: WHY });
    expect(r.score.objectivePoints).toBe(10);
    expect(maxTurnsFor(id)).toBe(5);
  });
});
