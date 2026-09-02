import { describe, expect, it } from 'vitest';

import type { MatchMove, MatchSide, MatchState } from '@soc/shared';

import { MatchError } from '../../services/matchEngine.js';
import { maxTurnsFor, resolveMoveFor } from '../../services/matchContent.js';
import { FOOTHOLD_NORTHWIND } from './foothold-northwind.js';

const { resolve, id } = FOOTHOLD_NORTHWIND;
const WHY = 'quiet reused credential first, then the shell';

function move(side: MatchSide, optionId: string): MatchMove {
  return { seq: 0, side, turn: 1, optionId, justification: '', score: null, signal: null, at: 0 };
}

function stateWith(moves: MatchMove[]): MatchState {
  return {
    id: 'm',
    scenarioId: id,
    difficulty: 'advanced',
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

const AFTER_QUIET_ACCESS = stateWith([move('red', 'use-leaked-creds')]);

describe('red: access is a chain', () => {
  it('rejects a webshell with no session behind it', () => {
    const r = red(stateWith([]), 'deploy-webshell');
    expect(r.score.objectivePoints).toBe(1);
    expect(r.reveals?.[0]?.id).toBe('deploy-rejected');
  });

  it('rewards the webshell once a session is in hand', () => {
    const r = red(AFTER_QUIET_ACCESS, 'deploy-webshell');
    expect(r.score.objectivePoints).toBe(10);
    expect(r.reveals?.some((f) => f.id === 'webshell')).toBe(true);
  });

  it('prefers a quiet reused credential over a loud spray', () => {
    expect(red(stateWith([]), 'use-leaked-creds').score.objectivePoints).toBe(9);
    const spray = red(stateWith([]), 'spray-common');
    expect(spray.score.objectivePoints).toBe(5);
    expect(spray.signal?.label).toMatch(/Brute force/);
  });

  it('a spray leaves a loud trail; a reused login barely a line', () => {
    expect(red(stateWith([]), 'spray-common').hostLog?.length).toBeGreaterThan(1);
    expect(red(stateWith([]), 'use-leaked-creds').hostLog).toHaveLength(1);
  });

  it('refuses a blue move on the red path', () => {
    expect(() => red(stateWith([]), 'monitor')).toThrow(MatchError);
  });
});

describe('blue: match the response to the intrusion', () => {
  const brute = stateWith([move('red', 'spray-common')]);
  const compromise = stateWith([move('red', 'use-leaked-creds')]);
  const shell = stateWith([move('red', 'use-leaked-creds'), move('red', 'deploy-webshell')]);
  const quiet = stateWith([move('red', 'wait')]);

  it('locks the account for a brute force, not for silence', () => {
    expect(blue(brute, 'lock-account').score.objectivePoints).toBe(10);
    expect(blue(quiet, 'lock-account').score.objectivePoints).toBe(3);
  });

  it('rotates the credential for a quiet compromise', () => {
    expect(blue(compromise, 'rotate-creds').score.objectivePoints).toBe(10);
    expect(blue(quiet, 'rotate-creds').score.objectivePoints).toBe(3);
  });

  it('pulls the manager once a shell is live, and overreacts on silence', () => {
    const r = blue(shell, 'disable-manager');
    expect(r.score.objectivePoints).toBe(10);
    expect(r.signal?.label).toMatch(/offline/i);
    expect(blue(quiet, 'disable-manager').score.objectivePoints).toBe(2);
  });

  it('investigating pulls up the evidence for what happened', () => {
    expect(blue(brute, 'investigate-auth').reveals?.[0]?.severity).toBe('high');
    expect(blue(quiet, 'investigate-auth').reveals ?? []).toHaveLength(0);
  });
});

describe('attacker console', () => {
  const run = (cmd: string) => FOOTHOLD_NORTHWIND.attacker!.run(cmd);

  it('maps hydra to a loud spray and curl -u to a quiet login', () => {
    expect(run('hydra -l deploy-svc -P rockyou.txt 203.0.113.10 http-get').optionId).toBe('spray-common');
    expect(run('curl -u deploy-svc:Summer2024 http://203.0.113.10:8080/manager/html').optionId).toBe('use-leaked-creds');
  });

  it('maps a WAR upload to the webshell deploy and default creds to try-default', () => {
    expect(run('curl -T shell.war http://203.0.113.10:8080/manager/deploy').optionId).toBe('deploy-webshell');
    expect(run('curl -u tomcat:tomcat http://203.0.113.10:8080/manager/html').optionId).toBe('try-default');
  });

  it('spends no turn on help or an unknown tool', () => {
    expect(run('help').optionId).toBeNull();
    expect(run('ssh root@203.0.113.10').optionId).toBeNull();
  });
});

describe('registration', () => {
  it('is wired into the engine seam with its own turn budget', () => {
    const r = resolveMoveFor(id)({ state: AFTER_QUIET_ACCESS, side: 'red', optionId: 'deploy-webshell', justification: WHY });
    expect(r.score.objectivePoints).toBe(10);
    expect(maxTurnsFor(id)).toBe(5);
  });
});
