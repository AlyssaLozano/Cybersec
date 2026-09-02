/**
 * The positional (board) mode, tested at the engine.
 *
 * Two things are being pinned here and they are not equally important. The
 * mechanics -- who may act, when, and what a shot does -- are ordinary rules and
 * are tested as such. The REDACTION is the load-bearing one: if Red can read
 * `coverage` out of a view, or Blue can see a compromise it never went looking
 * for, the mode is not a game, it is a scoreboard. Those cases are asserted on
 * the serialised view rather than on a field, because what matters is what
 * crosses the wire.
 */

import { describe, expect, it } from 'vitest';

import type { BoardState, FloorIdentity, MatchState } from '@soc/shared';

import {
  MatchError,
  blueAct,
  boardViewFor,
  boardWinner,
  createMatch,
  fire,
  joinMatch,
  matchViewFor,
  placeCoverage,
  terminalKindFor,
  type ResolveBoardMove,
} from './matchEngine.js';

const NOW = Date.parse('2026-09-02T10:00:00Z');

const HOST: FloorIdentity = { userId: 'u.red', callSign: 'Rook', avatarId: 'ash' };
const GUEST: FloorIdentity = { userId: 'u.blue', callSign: 'Vega', avatarId: 'birch' };

const RED = HOST.userId;
const BLUE = GUEST.userId;
const WHY = 'they will not expect the quiet one';

/** Four systems, one crown. Small enough to reason about, big enough to hide in. */
function board(): BoardState {
  return {
    phase: 'placement',
    targets: [
      { id: 'web', label: 'Web', note: 'front door', crown: false, compromised: false, detectedHere: false, contained: false },
      { id: 'mail', label: 'Mail', note: 'relay', crown: false, compromised: false, detectedHere: false, contained: false },
      { id: 'fs', label: 'Files', note: 'shares', crown: false, compromised: false, detectedHere: false, contained: false },
      { id: 'dc', label: 'DC', note: 'the core', crown: true, compromised: false, detectedHere: false, contained: false },
    ],
    coverage: [],
    coverageBudget: 2,
    movesLeft: 2,
    found: [],
  };
}

/** Content stub: a caught shot leaks a signal, everything else is silent. */
const resolve: ResolveBoardMove = ({ outcome }) => ({
  score: { objectivePoints: 5, maxObjective: 10, judgePoints: null, maxJudge: 10, note: null },
  signal:
    outcome.kind === 'fire' && outcome.defended
      ? { detected: true, label: 'Detection', detail: null }
      : null,
});

/** Both seats filled, board still in placement, Blue on the clock. */
function seated(maxTurns = 4): MatchState {
  const opened = createMatch({
    id: 'm.board',
    scenarioId: 'rt-core-test',
    difficulty: 'beginner',
    visibility: 'open',
    hostUserId: HOST.userId,
    hostIdentity: HOST,
    hostSide: 'red',
    mode: 'positional',
    board: board(),
    maxTurns,
    now: NOW,
  });
  return joinMatch(opened, GUEST, null);
}

/** In play, with Blue covering web and mail, and Red to fire. */
function inPlay(maxTurns = 4): MatchState {
  return placeCoverage(seated(maxTurns), BLUE, ['web', 'mail']);
}

const shoot = (state: MatchState, targetId: string) =>
  fire(state, { userId: RED, targetId, justification: WHY, now: NOW }, resolve);

const answer = (
  state: MatchState,
  action: 'reposition' | 'investigate' | 'contain',
  targetId: string,
  fromId?: string,
) => blueAct(state, { userId: BLUE, action, targetId, fromId, justification: WHY, now: NOW }, resolve);

describe('opening a board match', () => {
  it('starts in placement with Blue on the clock, not Red', () => {
    const m = seated();
    expect(m.mode).toBe('positional');
    expect(m.board?.phase).toBe('placement');
    // Red opens every linear match; here there is nothing to shoot at yet.
    expect(m.toMove).toBe('blue');
  });

  it('refuses a positional match with no board', () => {
    expect(() =>
      createMatch({
        id: 'm.x',
        scenarioId: 'rt-core-test',
        difficulty: 'beginner',
        visibility: 'open',
        hostUserId: HOST.userId,
        hostIdentity: HOST,
        hostSide: 'red',
        mode: 'positional',
        now: NOW,
      }),
    ).toThrow(MatchError);
  });

  it('leaves a linear match exactly as it was', () => {
    const linear = createMatch({
      id: 'm.linear',
      scenarioId: 'rt-recon-northwind',
      difficulty: 'beginner',
      visibility: 'open',
      hostUserId: HOST.userId,
      hostIdentity: HOST,
      hostSide: 'red',
      now: NOW,
    });
    expect(linear.mode).toBe('linear');
    expect(linear.board).toBeUndefined();
    expect(linear.toMove).toBe('red');
  });

  it('gives neither side a terminal, at any tier', () => {
    const advanced = createMatch({
      id: 'm.adv',
      scenarioId: 'rt-core-test',
      difficulty: 'advanced',
      visibility: 'open',
      hostUserId: HOST.userId,
      hostIdentity: HOST,
      hostSide: 'red',
      mode: 'positional',
      board: board(),
      now: NOW,
    });
    expect(terminalKindFor(advanced, 'red')).toBeNull();
    expect(terminalKindFor(advanced, 'blue')).toBeNull();
  });
});

describe('placement', () => {
  it('flips the board to play with Red to move', () => {
    const m = inPlay();
    expect(m.board?.phase).toBe('play');
    expect(m.board?.coverage).toEqual(['web', 'mail']);
    expect(m.toMove).toBe('red');
    // Placement is not a move: Red must learn nothing from the fact it happened.
    expect(m.moves).toHaveLength(0);
  });

  it('refuses the wrong number of systems', () => {
    expect(() => placeCoverage(seated(), BLUE, ['web'])).toThrow(/exactly 2/);
    expect(() => placeCoverage(seated(), BLUE, ['web', 'mail', 'fs'])).toThrow(/exactly 2/);
  });

  it('refuses two defences stacked on one system', () => {
    expect(() => placeCoverage(seated(), BLUE, ['web', 'web'])).toThrow(MatchError);
  });

  it('refuses a system that is not on the board', () => {
    expect(() => placeCoverage(seated(), BLUE, ['web', 'printer'])).toThrow(/no such system/i);
  });

  it('refuses Red, and refuses a second placement', () => {
    expect(() => placeCoverage(seated(), RED, ['web', 'mail'])).toThrow(/only blue/i);
    expect(() => placeCoverage(inPlay(), BLUE, ['fs', 'dc'])).toThrow(/already placed/i);
  });

  it('refuses a board action before coverage is placed', () => {
    expect(() => shoot(seated(), 'dc')).toThrow(MatchError);
  });
});

describe('Red fires', () => {
  it('is seen when the shot lands on coverage, and takes nothing', () => {
    const m = shoot(inPlay(), 'web');
    const web = m.board!.targets.find((t) => t.id === 'web')!;
    expect(web.detectedHere).toBe(true);
    expect(web.compromised).toBe(false);
    expect(m.status).toBe('active');
    expect(m.moves[0]!.signal?.label).toBe('Detection');
    expect(m.toMove).toBe('blue');
  });

  it('takes an uncovered system quietly, leaking nothing', () => {
    const m = shoot(inPlay(), 'fs');
    const fs = m.board!.targets.find((t) => t.id === 'fs')!;
    expect(fs.compromised).toBe(true);
    expect(fs.detectedHere).toBe(false);
    expect(m.moves[0]!.signal).toBeNull();
  });

  it('ends the match for Red on an uncovered crown', () => {
    const m = shoot(inPlay(), 'dc');
    expect(m.status).toBe('complete');
    expect(m.board!.phase).toBe('done');
    expect(boardWinner(m.board!)).toBe('red');
  });

  it('does not win when the crown is covered -- it just gets Red seen', () => {
    const covered = placeCoverage(seated(), BLUE, ['dc', 'web']);
    const m = shoot(covered, 'dc');
    expect(m.status).toBe('active');
    expect(boardWinner(m.board!)).toBeNull();
    expect(m.board!.targets.find((t) => t.id === 'dc')!.detectedHere).toBe(true);
  });

  it('refuses Blue, an off-turn shot, and a system that does not exist', () => {
    const m = inPlay();
    expect(() => fire(m, { userId: BLUE, targetId: 'fs', justification: WHY, now: NOW }, resolve)).toThrow(
      /only red/i,
    );
    expect(() => shoot(shoot(m, 'fs'), 'dc')).toThrow(/not your turn/i);
    expect(() => shoot(m, 'printer')).toThrow(/no such system/i);
  });

  it('refuses a shot with no reasoning behind it', () => {
    expect(() =>
      fire(inPlay(), { userId: RED, targetId: 'fs', justification: '   ', now: NOW }, resolve),
    ).toThrow(/say why/i);
  });

  it('refuses any board action on a linear match', () => {
    const linear = joinMatch(
      createMatch({
        id: 'm.l2',
        scenarioId: 'rt-recon-northwind',
        difficulty: 'beginner',
        visibility: 'open',
        hostUserId: HOST.userId,
        hostIdentity: HOST,
        hostSide: 'red',
        now: NOW,
      }),
      GUEST,
      null,
    );
    expect(() => shoot(linear, 'web')).toThrow(/not played on a board/i);
    expect(() => placeCoverage(linear, BLUE, ['web', 'mail'])).toThrow(/not played on a board/i);
  });
});

describe('Blue answers', () => {
  it('repositions, spending one of a limited number of moves', () => {
    const m = answer(shoot(inPlay(), 'fs'), 'reposition', 'dc', 'web');
    expect(m.board!.coverage.sort()).toEqual(['dc', 'mail']);
    expect(m.board!.movesLeft).toBe(1);
    expect(m.toMove).toBe('red');
    // A round is red then blue, exactly as in the linear mode.
    expect(m.turn).toBe(2);
  });

  it('refuses a reposition off a system with no coverage, or onto a covered one', () => {
    const m = shoot(inPlay(), 'fs');
    expect(() => answer(m, 'reposition', 'dc', 'fs')).toThrow(/no coverage/i);
    expect(() => answer(m, 'reposition', 'mail', 'web')).toThrow(/already covered/i);
    expect(() => answer(m, 'reposition', 'dc')).toThrow(/which defence/i);
  });

  it('refuses a reposition once the moves are gone', () => {
    let m = inPlay(6);
    m = answer(shoot(m, 'fs'), 'reposition', 'dc', 'web');
    m = answer(shoot(m, 'fs'), 'reposition', 'web', 'mail');
    expect(m.board!.movesLeft).toBe(0);
    expect(() => answer(shoot(m, 'fs'), 'reposition', 'mail', 'dc')).toThrow(/no repositions left/i);
  });

  it('finds a quiet compromise only by investigating it', () => {
    const taken = shoot(inPlay(), 'fs');
    expect(taken.board!.found).toEqual([]);
    const looked = answer(taken, 'investigate', 'fs');
    expect(looked.board!.found).toEqual(['fs']);
  });

  it('learns nothing from investigating a clean system', () => {
    const m = answer(shoot(inPlay(), 'fs'), 'investigate', 'dc');
    expect(m.board!.found).toEqual([]);
  });

  it('walls off a found compromise, and tells Red it did', () => {
    const found = answer(shoot(inPlay(), 'fs'), 'investigate', 'fs');
    const walled = answer(shoot(found, 'web'), 'contain', 'fs');
    const fs = walled.board!.targets.find((t) => t.id === 'fs')!;
    expect(fs.contained).toBe(true);
    expect(fs.compromised).toBe(false);
    expect(walled.board!.found).toEqual([]);
    // A wall is public: Red sees it on the board without content having to leak
    // a signal about it. What the wall is CALLED is the scenario's business.
    expect(matchViewFor(walled, RED).board!.targets.find((t) => t.id === 'fs')!.contained).toBe(true);
    expect(matchViewFor(walled, RED).board!.targets.find((t) => t.id === 'fs')!.compromised).toBe(false);
  });

  it('refuses to contain what it has not found', () => {
    const taken = shoot(inPlay(), 'fs');
    expect(() => answer(taken, 'contain', 'fs')).toThrow(/not found anything/i);
    expect(() => answer(taken, 'contain', 'dc')).toThrow(/not found anything/i);
  });

  it('gives Red nothing back for firing at walled or already-taken ground', () => {
    const found = answer(shoot(inPlay(), 'fs'), 'investigate', 'fs');
    const walled = answer(shoot(found, 'web'), 'contain', 'fs');
    const again = shoot(walled, 'fs');
    const fs = again.board!.targets.find((t) => t.id === 'fs')!;
    expect(fs.compromised).toBe(false);
    expect(fs.contained).toBe(true);
  });

  it('refuses Red, and refuses Blue off-turn', () => {
    const m = inPlay();
    expect(() =>
      blueAct(m, { userId: RED, action: 'investigate', targetId: 'fs', justification: WHY, now: NOW }, resolve),
    ).toThrow(/only blue/i);
    // Red has not fired yet, so it is not Blue's move.
    expect(() => answer(m, 'investigate', 'fs')).toThrow(/only blue|not your turn/i);
  });
});

describe('redaction: what each side may see', () => {
  it('never puts coverage in front of Red, in any form', () => {
    const m = shoot(inPlay(), 'fs');
    const view = matchViewFor(m, RED);
    const wire = JSON.stringify(view);

    expect(view.board).toBeDefined();
    expect(wire).not.toContain('"coverage"');
    expect(view.board!.targets.every((t) => t.covered === false)).toBe(true);
    // Not even indirectly: Blue's remaining repositions are Blue's business.
    expect(view.board!.movesLeft).toBeNull();
  });

  it('shows Blue its own coverage and its remaining moves', () => {
    const view = matchViewFor(shoot(inPlay(), 'fs'), BLUE);
    const covered = view.board!.targets.filter((t) => t.covered).map((t) => t.id);
    expect(covered.sort()).toEqual(['mail', 'web']);
    expect(view.board!.movesLeft).toBe(2);
  });

  it('hides a quiet compromise from Blue until it goes and looks', () => {
    const taken = shoot(inPlay(), 'fs');

    const blind = matchViewFor(taken, BLUE);
    expect(blind.board!.targets.find((t) => t.id === 'fs')!.compromised).toBe(false);
    // Red, whose hit it is, knows perfectly well.
    expect(matchViewFor(taken, RED).board!.targets.find((t) => t.id === 'fs')!.compromised).toBe(true);

    const looked = answer(taken, 'investigate', 'fs');
    expect(matchViewFor(looked, BLUE).board!.targets.find((t) => t.id === 'fs')!.compromised).toBe(true);
  });

  it('does not let one investigation stand as a season ticket', () => {
    // Blue looks at a system while it is still clean; Red takes it the round
    // after. A standing permission to see that system would hand Blue the hit
    // for free, which is exactly the information the mode is built on.
    const clean = answer(shoot(inPlay(6), 'web'), 'investigate', 'fs');
    expect(clean.board!.found).toEqual([]);

    const taken = shoot(clean, 'fs');
    expect(taken.board!.targets.find((t) => t.id === 'fs')!.compromised).toBe(true);
    expect(matchViewFor(taken, BLUE).board!.targets.find((t) => t.id === 'fs')!.compromised).toBe(false);
  });

  it('shows detections and containments to both sides', () => {
    const seen = shoot(inPlay(), 'web');
    for (const who of [RED, BLUE]) {
      const web = matchViewFor(seen, who).board!.targets.find((t) => t.id === 'web')!;
      expect(web.detectedHere).toBe(true);
    }
  });

  it('tells both sides the fleet size, which is what makes probing a decision', () => {
    expect(matchViewFor(inPlay(), RED).board!.coverageBudget).toBe(2);
    expect(matchViewFor(inPlay(), BLUE).board!.coverageBudget).toBe(2);
  });

  it('reports no board and no winner for a linear match', () => {
    const linear = joinMatch(
      createMatch({
        id: 'm.l3',
        scenarioId: 'rt-recon-northwind',
        difficulty: 'beginner',
        visibility: 'open',
        hostUserId: HOST.userId,
        hostIdentity: HOST,
        hostSide: 'red',
        now: NOW,
      }),
      GUEST,
      null,
    );
    const view = matchViewFor(linear, RED);
    expect(view.mode).toBe('linear');
    expect(view.board).toBeUndefined();
    expect(view.winner).toBeNull();
  });
});

describe('endings', () => {
  it('gives the match to Blue when the clock runs out with the crown safe', () => {
    let m = inPlay(2);
    m = answer(shoot(m, 'fs'), 'investigate', 'fs');
    expect(m.status).toBe('active');
    m = answer(shoot(m, 'web'), 'investigate', 'mail');

    expect(m.status).toBe('complete');
    expect(m.board!.phase).toBe('done');
    expect(boardWinner(m.board!)).toBe('blue');
    expect(matchViewFor(m, RED).winner).toBe('blue');
    expect(matchViewFor(m, BLUE).winner).toBe('blue');
  });

  it('reports no winner while the board is still in play', () => {
    expect(boardWinner(inPlay().board!)).toBeNull();
    expect(matchViewFor(inPlay(), RED).winner).toBeNull();
  });

  it('refuses any action once the match is over', () => {
    const won = shoot(inPlay(), 'dc');
    expect(() => shoot(won, 'web')).toThrow(/not in play/i);
    expect(() => answer(won, 'investigate', 'web')).toThrow(/not in play/i);
  });
});

describe('boardViewFor is the boundary, on its own', () => {
  it('redacts the same way whether or not a match is wrapped around it', () => {
    const b = { ...board(), phase: 'play' as const, coverage: ['web'], found: [] };
    const red = boardViewFor(b, 'red');
    const blue = boardViewFor(b, 'blue');
    expect(red.targets.find((t) => t.id === 'web')!.covered).toBe(false);
    expect(blue.targets.find((t) => t.id === 'web')!.covered).toBe(true);
  });
});
