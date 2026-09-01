import { describe, expect, it } from 'vitest';

import type { FloorIdentity, MatchState } from '@soc/shared';

import {
  DEFAULT_MAX_TURNS,
  MatchError,
  abandonMatch,
  canJoin,
  commitMove,
  createMatch,
  joinMatch,
  matchViewFor,
  sideOf,
  terminalKindFor,
  type ResolveMove,
} from './matchEngine.js';

const NOW = Date.parse('2026-09-01T18:00:00Z');

const HOST: FloorIdentity = { userId: 'u.host', callSign: 'Rook', avatarId: 'ash' };
const GUEST: FloorIdentity = { userId: 'u.guest', callSign: 'Vega', avatarId: 'birch' };

/** A deterministic random so the join code is stable across runs. */
const fixedRandom = () => 0.5;

/** Content stub: a loud option leaks a signal, a quiet one does not. */
const resolve: ResolveMove = ({ optionId }) => ({
  score: { objectivePoints: optionId === 'loud' ? 2 : 10, maxObjective: 10, judgePoints: null, maxJudge: 20, note: null },
  signal:
    optionId === 'loud'
      ? { detected: true, label: 'IDS: enumeration', detail: 'many probes' }
      : null,
});

function openClosedMatch(): MatchState {
  return createMatch({
    id: 'm.1',
    scenarioId: 'rt-recon',
    difficulty: 'beginner',
    visibility: 'closed',
    hostUserId: HOST.userId,
    hostIdentity: HOST,
    hostSide: 'red',
    now: NOW,
    random: fixedRandom,
  });
}

/** Seat both players and get an active match with Red on the clock. */
function activeMatch(): MatchState {
  return joinMatch(openClosedMatch(), GUEST, matchCode());
}

function matchCode(): string {
  return openClosedMatch().joinCode!;
}

describe('createMatch', () => {
  it('opens a closed match waiting, with a join code and the host seated', () => {
    const m = openClosedMatch();
    expect(m.status).toBe('waiting');
    expect(m.joinCode).toMatch(/^[A-Z0-9]{6}$/);
    expect(m.red.userId).toBe(HOST.userId);
    expect(m.blue.userId).toBeNull();
    expect(m.toMove).toBe('red');
    expect(m.maxTurns).toBe(DEFAULT_MAX_TURNS);
  });

  it('gives an open (queue) match no join code', () => {
    const m = createMatch({
      id: 'm.2', scenarioId: 'rt-recon', difficulty: 'beginner', visibility: 'open',
      hostUserId: HOST.userId, hostIdentity: HOST, hostSide: 'blue', now: NOW,
    });
    expect(m.joinCode).toBeNull();
    expect(m.blue.userId).toBe(HOST.userId);
    expect(m.red.userId).toBeNull();
  });

  it('refuses a bad call sign', () => {
    expect(() =>
      createMatch({
        id: 'm.3', scenarioId: 'rt-recon', difficulty: 'beginner', visibility: 'open',
        hostUserId: HOST.userId, hostIdentity: { ...HOST, callSign: 'no' }, hostSide: 'red', now: NOW,
      }),
    ).toThrow(MatchError);
  });
});

describe('canJoin / joinMatch', () => {
  it('rejects the wrong code and accepts the right one', () => {
    const m = openClosedMatch();
    expect(canJoin(m, GUEST.userId, 'WRONG').ok).toBe(false);
    expect(canJoin(m, GUEST.userId, m.joinCode).ok).toBe(true);
  });

  it('will not let the host join their own match', () => {
    const m = openClosedMatch();
    expect(canJoin(m, HOST.userId, m.joinCode).ok).toBe(false);
  });

  it('seats the guest and starts the match with Red to move', () => {
    const m = activeMatch();
    expect(m.status).toBe('active');
    expect(m.blue.userId).toBe(GUEST.userId);
    expect(sideOf(m, GUEST.userId)).toBe('blue');
    expect(m.toMove).toBe('red');
  });

  it('refuses a duplicate call sign', () => {
    const m = openClosedMatch();
    expect(() => joinMatch(m, { ...GUEST, callSign: 'Rook' }, m.joinCode)).toThrow(MatchError);
  });

  it('refuses joining a full match', () => {
    const m = activeMatch();
    expect(() => joinMatch(m, { userId: 'u.third', callSign: 'Pike', avatarId: 'cedar' }, m.joinCode)).toThrow(
      MatchError,
    );
  });
});

describe('commitMove', () => {
  it('refuses a move from the side not on the clock', () => {
    const m = activeMatch();
    expect(() =>
      commitMove(m, { userId: GUEST.userId, optionId: 'quiet', justification: 'wait', now: NOW }, resolve),
    ).toThrow(/your turn/i);
  });

  it('refuses an empty justification', () => {
    const m = activeMatch();
    expect(() =>
      commitMove(m, { userId: HOST.userId, optionId: 'quiet', justification: '   ', now: NOW }, resolve),
    ).toThrow(MatchError);
  });

  it('records the move, scores it, and passes the clock', () => {
    const m = commitMove(
      activeMatch(),
      { userId: HOST.userId, optionId: 'quiet', justification: 'stay passive', now: NOW },
      resolve,
    );
    expect(m.moves).toHaveLength(1);
    expect(m.moves[0].score?.objectivePoints).toBe(10);
    expect(m.toMove).toBe('blue');
    expect(m.turn).toBe(1); // round does not close until Blue answers
    expect(m.lastMoveAt).toBe(NOW);
  });

  it('advances the round only after Blue answers', () => {
    let m = activeMatch();
    m = commitMove(m, { userId: HOST.userId, optionId: 'quiet', justification: 'a', now: NOW }, resolve);
    m = commitMove(m, { userId: GUEST.userId, optionId: 'quiet', justification: 'b', now: NOW }, resolve);
    expect(m.turn).toBe(2);
    expect(m.toMove).toBe('red');
  });

  it('completes the match when the turn budget is spent', () => {
    let m = { ...activeMatch(), maxTurns: 1 };
    m = commitMove(m, { userId: HOST.userId, optionId: 'quiet', justification: 'a', now: NOW }, resolve);
    m = commitMove(m, { userId: GUEST.userId, optionId: 'quiet', justification: 'b', now: NOW }, resolve);
    expect(m.status).toBe('complete');
  });
});

describe('matchViewFor (the redaction boundary)', () => {
  it("shows a side its own moves in full but only the opponent's leaked signal", () => {
    let m = activeMatch();
    m = commitMove(m, { userId: HOST.userId, optionId: 'loud', justification: 'secret red plan', now: NOW }, resolve);

    const blueView = matchViewFor(m, GUEST.userId);
    expect(blueView.you).toBe('blue');
    // Blue sees Red's move only as the leaked signal -- never the justification.
    expect(blueView.opponentActivity).toHaveLength(1);
    expect(blueView.opponentActivity[0].signal?.label).toBe('IDS: enumeration');
    expect(JSON.stringify(blueView)).not.toContain('secret red plan');
    expect(blueView.yourMoves).toHaveLength(0);

    const redView = matchViewFor(m, HOST.userId);
    expect(redView.yourMoves[0].justification).toBe('secret red plan');
    expect(redView.yourTurn).toBe(false); // Blue is on the clock now
  });

  it('reveals the join code only to the host while waiting behind a code', () => {
    const waiting = openClosedMatch();
    expect(matchViewFor(waiting, HOST.userId).joinCode).toBe(waiting.joinCode);

    const active = activeMatch();
    expect(matchViewFor(active, HOST.userId).joinCode).toBeNull();
    expect(matchViewFor(active, GUEST.userId).joinCode).toBeNull();
  });

  it('refuses a view to someone not in the match', () => {
    expect(() => matchViewFor(activeMatch(), 'u.stranger')).toThrow(MatchError);
  });
});

describe('findings (the investigation layer)', () => {
  const revealing: ResolveMove = ({ side }) => ({
    score: { objectivePoints: 5, maxObjective: 10, judgePoints: null, maxJudge: 10, note: null },
    signal: null,
    reveals:
      side === 'red'
        ? [{ id: 'svc-1', kind: 'service', title: 'Web', detail: 'nginx', severity: 'info' }]
        : [{ id: 'ev-1', kind: 'evidence', title: 'Log line', detail: 'a probe', severity: 'low' }],
  });

  it('stamps a reveal with side and turn and shows it only to that side', () => {
    const m = commitMove(
      activeMatch(),
      { userId: HOST.userId, optionId: 'recon', justification: 'why', now: NOW },
      revealing,
    );
    const red = matchViewFor(m, HOST.userId);
    const blue = matchViewFor(m, GUEST.userId);
    expect(red.yourFindings).toHaveLength(1);
    expect(red.yourFindings[0].side).toBe('red');
    expect(red.yourFindings[0].turn).toBe(1);
    // Red's map is not Blue's; the boundary holds for findings too.
    expect(blue.yourFindings).toHaveLength(0);
  });

  it('does not duplicate a finding already discovered', () => {
    let m = activeMatch();
    m = commitMove(m, { userId: HOST.userId, optionId: 'recon', justification: 'a', now: NOW }, revealing);
    m = commitMove(m, { userId: GUEST.userId, optionId: 'invest', justification: 'b', now: NOW }, revealing);
    m = commitMove(m, { userId: HOST.userId, optionId: 'recon', justification: 'c', now: NOW }, revealing);
    expect(matchViewFor(m, HOST.userId).yourFindings).toHaveLength(1);
    expect(matchViewFor(m, GUEST.userId).yourFindings).toHaveLength(1);
  });
});

describe('the defender terminal (higher tiers)', () => {
  it('gives Blue a defender shell and Red a recon console at the higher tiers', () => {
    const advanced: MatchState = { ...activeMatch(), difficulty: 'advanced' };
    expect(terminalKindFor(advanced, 'blue')).toBe('defender');
    expect(terminalKindFor(advanced, 'red')).toBe('attacker');
    expect(terminalKindFor(activeMatch(), 'blue')).toBeNull(); // beginner
    expect(matchViewFor(advanced, GUEST.userId).terminal?.kind).toBe('defender');
    expect(matchViewFor(advanced, HOST.userId).terminal?.kind).toBe('attacker');
    expect(matchViewFor(activeMatch(), GUEST.userId).terminal).toBeNull();
  });

  it('appends a move host log to the shared host log', () => {
    const logging: ResolveMove = () => ({
      score: { objectivePoints: 3, maxObjective: 10, judgePoints: null, maxJudge: 10, note: null },
      signal: null,
      hostLog: ['edge kernel: [UFW BLOCK] scan'],
    });
    const m = commitMove(
      activeMatch(),
      { userId: HOST.userId, optionId: 'sweep', justification: 'w', now: NOW },
      logging,
    );
    expect(m.hostLog).toEqual(['edge kernel: [UFW BLOCK] scan']);
  });
});

describe('abandonMatch', () => {
  it('marks a match abandoned, distinct from complete', () => {
    const m = abandonMatch(activeMatch(), HOST.userId);
    expect(m.status).toBe('abandoned');
  });

  it('will not abandon on behalf of a stranger', () => {
    expect(() => abandonMatch(activeMatch(), 'u.stranger')).toThrow(MatchError);
  });
});
