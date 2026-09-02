import { describe, expect, it } from 'vitest';

import type { MatchMove, MatchSide, MatchState } from '@soc/shared';

import { MatchError } from '../../services/matchEngine.js';
import { maxTurnsFor, resolveMoveFor } from '../../services/matchContent.js';
import { PERSIST_NORTHWIND } from './persist-northwind.js';

const { resolve, id } = PERSIST_NORTHWIND;
const WHY = 'survey the host first so the backdoor blends into a normal service';

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

const AFTER_SURVEY = stateWith([move('red', 'survey-autoruns')]);

describe('red: survey first, then hide well', () => {
  it('rewards a blend more once the host has been surveyed', () => {
    expect(red(stateWith([]), 'blend-backdoor').score.objectivePoints).toBe(6);
    expect(red(AFTER_SURVEY, 'blend-backdoor').score.objectivePoints).toBe(10);
  });

  it('scores a rogue account lowest of the durable options for the noise', () => {
    expect(red(stateWith([]), 'create-account').score.objectivePoints).toBe(4);
    expect(red(stateWith([]), 'scheduled-task').score.objectivePoints).toBe(6);
  });

  it('the loud mechanisms leave the events a hunt is written to find', () => {
    expect(red(stateWith([]), 'create-account').hostLog?.some((l) => /4720/.test(l))).toBe(true);
    expect(red(stateWith([]), 'scheduled-task').hostLog?.some((l) => /4698/.test(l))).toBe(true);
  });

  it('a survey reveals a service to hide behind', () => {
    expect(red(stateWith([]), 'survey-autoruns').reveals?.[0]?.id).toBe('update-task');
  });
});

describe('blue: match the hunt to the mechanism', () => {
  const account = stateWith([move('red', 'create-account')]);
  const task = stateWith([move('red', 'scheduled-task')]);
  const blend = stateWith([move('red', 'survey-autoruns'), move('red', 'blend-backdoor')]);
  const quiet = stateWith([move('red', 'wait')]);

  it('an account audit catches the rogue account', () => {
    expect(blue(account, 'audit-accounts').score.objectivePoints).toBe(10);
    expect(blue(blend, 'audit-accounts').score.objectivePoints).toBeLessThan(6);
  });

  it('only a baseline diff reliably catches the blended backdoor', () => {
    expect(blue(blend, 'baseline-compare').score.objectivePoints).toBe(10);
    expect(blue(blend, 'hunt-persistence').score.objectivePoints).toBe(6);
  });

  it('a persistence hunt catches the scheduled task', () => {
    expect(blue(task, 'hunt-persistence').score.objectivePoints).toBe(9);
  });

  it('reimaging is the sure removal once something durable is planted, and an overreaction on silence', () => {
    expect(blue(blend, 'reimage-host').score.objectivePoints).toBe(9);
    expect(blue(quiet, 'reimage-host').score.objectivePoints).toBe(2);
  });

  it('refuses a red move on the blue path', () => {
    expect(() => blue(task, 'blend-backdoor')).toThrow(MatchError);
  });
});

describe('attacker console', () => {
  const run = (cmd: string) => PERSIST_NORTHWIND.attacker!.run(cmd);

  it('maps the persistence mechanisms to their actions', () => {
    expect(run('schtasks /query').optionId).toBe('survey-autoruns');
    expect(run('schtasks /create /tn UpdateSync /tr implant.exe /sc onlogon').optionId).toBe('scheduled-task');
    expect(run('net user svc-update P@ss /add').optionId).toBe('create-account');
    expect(run('sc config update-check binPath= C:\\svc\\helper.exe').optionId).toBe('blend-backdoor');
  });

  it('spends no turn on help or an unknown tool', () => {
    expect(run('help').optionId).toBeNull();
    expect(run('whoami').optionId).toBeNull();
  });
});

describe('registration', () => {
  it('is wired into the engine seam with its own turn budget', () => {
    const r = resolveMoveFor(id)({ state: AFTER_SURVEY, side: 'red', optionId: 'blend-backdoor', justification: WHY });
    expect(r.score.objectivePoints).toBe(10);
    expect(maxTurnsFor(id)).toBe(5);
  });
});
