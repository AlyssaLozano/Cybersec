/**
 * Reach the Core: the scoring, and the board it is played on.
 *
 * The engine's tests (`matchBoard.test.ts`) pin the mechanics and the redaction.
 * What is pinned here is the teaching: that a caught shot is worth something
 * rather than nothing, that spending a round on ground you already hold is worth
 * almost nothing, and that Blue is graded differently for a bad read than for
 * bad luck. Those are the judgements that make it a lesson instead of a dice
 * roll, so they are the ones worth freezing.
 */

import { describe, expect, it } from 'vitest';

import type { BoardTarget, MatchState } from '@soc/shared';

import { MatchError, type BoardOutcome } from '../../services/matchEngine.js';
import { boardFor, isPositional, maxTurnsFor, resolveBoardFor } from '../../services/matchContent.js';
import { getPositionalScenario, matchBriefFor, matchScenarioList } from './index.js';
import { REACH_THE_CORE } from './reach-the-core.js';
import { startingBoard } from './types.js';

const { resolveBoard, id } = REACH_THE_CORE;
const WHY = 'they have two eyes and I doubt either is on the quiet one';

function target(over: Partial<BoardTarget> = {}): BoardTarget {
  return {
    id: 'fileserver',
    label: 'File server',
    note: 'shares',
    crown: false,
    compromised: false,
    detectedHere: false,
    contained: false,
    ...over,
  };
}

/** A match around a board, so the resolver can read what Blue already knew. */
function stateWith(found: string[] = []): MatchState {
  return {
    id: 'm',
    scenarioId: id,
    difficulty: 'beginner',
    mode: 'positional',
    status: 'active',
    visibility: 'open',
    joinCode: null,
    hostUserId: 'h',
    red: { side: 'red', userId: 'r', identity: null },
    blue: { side: 'blue', userId: 'b', identity: null },
    toMove: 'red',
    turn: 1,
    maxTurns: REACH_THE_CORE.maxTurns,
    moves: [],
    findings: [],
    hostLog: [],
    terminalCwd: { red: '/home/student', blue: '/home/student' },
    board: { ...startingBoard(REACH_THE_CORE), phase: 'play', found },
    createdAt: 0,
    lastMoveAt: null,
  };
}

const red = (outcome: BoardOutcome, why = WHY) =>
  resolveBoard({ state: stateWith(), side: 'red', outcome, justification: why });
const blue = (outcome: BoardOutcome, found: string[] = [], why = WHY) =>
  resolveBoard({ state: stateWith(found), side: 'blue', outcome, justification: why });

const fired = (over: Partial<Extract<BoardOutcome, { kind: 'fire' }>> = {}) =>
  ({ kind: 'fire', target: target(), defended: false, spent: false, won: false, ...over }) as BoardOutcome;

describe('the board itself', () => {
  it('has exactly one crown, and it is the domain controller', () => {
    const crowns = REACH_THE_CORE.targets.filter((t) => t.crown);
    expect(crowns).toHaveLength(1);
    expect(crowns[0]!.id).toBe('dc');
  });

  it('gives Red more open ground than covered, so a shot is a bet worth taking', () => {
    expect(REACH_THE_CORE.coverageBudget).toBeLessThan(REACH_THE_CORE.targets.length / 2);
  });

  it('builds a clean board per match, sharing nothing between them', () => {
    const a = startingBoard(REACH_THE_CORE);
    const b = startingBoard(REACH_THE_CORE);
    a.targets[0]!.compromised = true;
    a.coverage.push('web');
    expect(b.targets[0]!.compromised).toBe(false);
    expect(b.coverage).toEqual([]);
    expect(b.phase).toBe('placement');
    expect(b.found).toEqual([]);
  });

  it('names only fabricated hosts on documentation and private ranges', () => {
    const text = REACH_THE_CORE.targets.map((t) => `${t.label} ${t.note}`).join(' ');
    const addresses = text.match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g) ?? [];
    expect(addresses.length).toBeGreaterThan(0);
    for (const a of addresses) {
      expect(a).toMatch(/^(203\.0\.113\.|198\.51\.100\.|192\.0\.2\.|10\.10\.5\.)/);
    }
    for (const host of text.match(/\b[a-z0-9.-]+\.[a-z]{2,}\b/g) ?? []) {
      expect(host).toMatch(/\.example$/);
    }
  });
});

describe('registration', () => {
  it('registers as a board scenario with its own turn budget', () => {
    expect(isPositional(id)).toBe(true);
    expect(maxTurnsFor(id)).toBe(REACH_THE_CORE.maxTurns);
    expect(boardFor(id)?.coverageBudget).toBe(REACH_THE_CORE.coverageBudget);
    expect(resolveBoardFor(id)).toBe(resolveBoard);
  });

  it('is in the catalogue, tagged positional, without disturbing the linear five', () => {
    const list = matchScenarioList();
    const mine = list.find((s) => s.id === id);
    expect(mine?.mode).toBe('positional');
    expect(list.filter((s) => s.mode === 'linear')).toHaveLength(5);
    expect(getPositionalScenario(id)).toBe(REACH_THE_CORE);
  });

  it('hands out a brief with no options, because the board is the menu', () => {
    const brief = matchBriefFor(id, 'red');
    expect(brief?.mode).toBe('positional');
    expect(brief?.options).toEqual([]);
    expect(brief?.dossier.org).toBe('Northwind Logistics');
  });

  it('leaves the linear briefs exactly as they were', () => {
    const brief = matchBriefFor('rt-recon-northwind', 'red');
    expect(brief?.mode).toBe('linear');
    expect(brief!.options.length).toBeGreaterThan(0);
  });
});

describe('red scoring: what a shot is worth', () => {
  it('pays the most for the crown, taken quietly', () => {
    const r = red(fired({ target: target({ id: 'dc', label: 'Domain controller', crown: true }), won: true }));
    expect(r.score.objectivePoints).toBe(10);
    expect(r.signal).toBeNull();
    expect(r.reveals?.[0]?.severity).toBe('high');
  });

  it('pays well for a quiet compromise, and leaks nothing to Blue', () => {
    const r = red(fired());
    expect(r.score.objectivePoints).toBe(8);
    expect(r.signal).toBeNull();
    expect(r.reveals?.[0]?.id).toBe('red-own-fileserver');
  });

  it('still pays something for a caught shot -- a known position is intel', () => {
    const r = red(fired({ defended: true }));
    expect(r.score.objectivePoints).toBeGreaterThan(0);
    expect(r.score.objectivePoints).toBeLessThan(8);
    expect(r.signal?.detected).toBe(true);
    // Red's own record of where a defence was, which is the thing it bought.
    expect(r.reveals?.[0]?.id).toBe('red-defended-fileserver');
  });

  it('pays almost nothing for a round spent on ground already held or walled', () => {
    expect(red(fired({ spent: true })).score.objectivePoints).toBe(1);
    const walled = red(fired({ spent: true, target: target({ contained: true }) }));
    expect(walled.score.objectivePoints).toBe(1);
    expect(walled.score.note).toMatch(/walled/i);
  });

  it('refuses to score a defensive action as Red', () => {
    expect(() =>
      resolveBoard({
        state: stateWith(),
        side: 'red',
        outcome: { kind: 'investigate', target: target(), found: true },
        justification: WHY,
      }),
    ).toThrow(MatchError);
  });
});

describe('blue scoring: a bad read is not the same as bad luck', () => {
  it('pays most for containing what it found', () => {
    const b = blue({ kind: 'contain', target: target() });
    expect(b.score.objectivePoints).toBe(10);
    // A wall is something Red is told about; there is no hiding one.
    expect(b.signal?.detected).toBe(true);
  });

  it('pays well for an investigation that lands, with the evidence to act on', () => {
    const b = blue({ kind: 'investigate', target: target(), found: true });
    expect(b.score.objectivePoints).toBe(9);
    expect(b.reveals?.[0]?.kind).toBe('evidence');
    expect(b.signal).toBeNull();
  });

  it('pays a little for a clean look: a ruled-out system is still a read', () => {
    const b = blue({ kind: 'investigate', target: target(), found: false });
    expect(b.score.objectivePoints).toBe(4);
    expect(b.reveals ?? []).toEqual([]);
  });

  it('rewards moving a defence Red has already bounced off', () => {
    const b = blue({
      kind: 'reposition',
      from: target({ id: 'web', label: 'Web tier', detectedHere: true }),
      to: target({ id: 'dc', label: 'Domain controller', crown: true }),
      movesLeft: 2,
    });
    expect(b.score.objectivePoints).toBe(8);
  });

  it('scores a plain prediction as a plain prediction', () => {
    const b = blue({
      kind: 'reposition',
      from: target({ id: 'web', label: 'Web tier' }),
      to: target({ id: 'dns', label: 'Internal DNS' }),
      movesLeft: 2,
    });
    expect(b.score.objectivePoints).toBe(6);
  });

  it('marks down covering a system Blue KNEW was already taken', () => {
    const to = target({ id: 'mail', label: 'Mail relay', compromised: true });
    const knew = blue({ kind: 'reposition', from: target({ id: 'web' }), to, movesLeft: 1 }, ['mail']);
    expect(knew.score.objectivePoints).toBe(3);
    expect(knew.score.note).toMatch(/containment/i);
  });

  it('is gentler when Blue had no way to know', () => {
    const to = target({ id: 'mail', label: 'Mail relay', compromised: true });
    const blind = blue({ kind: 'reposition', from: target({ id: 'web' }), to, movesLeft: 1 });
    expect(blind.score.objectivePoints).toBe(5);
    expect(blind.score.note).toMatch(/no way to know/i);
  });

  it('refuses to score a shot as Blue', () => {
    expect(() =>
      resolveBoard({ state: stateWith(), side: 'blue', outcome: fired(), justification: WHY }),
    ).toThrow(MatchError);
  });
});

describe('the reasoning half of a move', () => {
  it('scores a considered rationale above a shrug', () => {
    const thin = red(fired(), 'idk');
    const thought = red(fired(), 'they likely cover the obvious path, so I take the quiet one and stay unseen');
    expect(thought.score.judgePoints!).toBeGreaterThan(thin.score.judgePoints!);
    expect(thought.score.maxJudge).toBe(10);
  });

  it('never exceeds its own ceiling, however stuffed the sentence is', () => {
    const stuffed = red(fired(), CONCEPT_STUFFING);
    expect(stuffed.score.judgePoints!).toBeLessThanOrEqual(stuffed.score.maxJudge);
  });
});

const CONCEPT_STUFFING =
  'cover coverage defend detect seen quiet hidden guess predict probe bait crown core objective ' +
  'path pivot stage clock round turn risk trade cost contain investigate reposition because';
