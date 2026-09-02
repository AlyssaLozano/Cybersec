/**
 * First Contact: the phishing scenario's scoring.
 *
 * The engine's tests own the turn machinery; these own the teaching. The one
 * that matters most is the session-versus-password distinction: a password reset
 * must score well when Red holds only a password and badly when Red holds a live
 * session, because that is the entire point of the scenario.
 */

import { describe, expect, it } from 'vitest';

import type { MatchMove, MatchSide, MatchState } from '@soc/shared';

import { MatchError } from '../../services/matchEngine.js';
import { PHISH_HARBORVIEW } from './phish-harborview.js';

const { resolve, id, red: RED_OPTIONS, blue: BLUE_OPTIONS } = PHISH_HARBORVIEW;

function move(side: MatchSide, optionId: string): MatchMove {
  return { seq: 0, side, turn: 1, optionId, justification: '', score: null, signal: null, at: 0 };
}

function stateWith(moves: MatchMove[]): MatchState {
  return {
    id: 'm',
    scenarioId: id,
    difficulty: 'beginner',
    mode: 'linear',
    status: 'active',
    visibility: 'open',
    joinCode: null,
    hostUserId: 'h',
    red: { side: 'red', userId: 'r', identity: null },
    blue: { side: 'blue', userId: 'b', identity: null },
    toMove: 'red',
    turn: 1,
    maxTurns: PHISH_HARBORVIEW.maxTurns,
    moves,
    findings: [],
    hostLog: [],
    terminalCwd: { red: '/home/student', blue: '/home/student' },
    createdAt: 0,
    lastMoveAt: null,
  };
}

const WHY = 'staying quiet and reasoning about what they actually hold';
const red = (state: MatchState, optionId: string, why = WHY) => resolve({ state, side: 'red', optionId, justification: why });
const blue = (state: MatchState, optionId: string, why = WHY) => resolve({ state, side: 'blue', optionId, justification: why });

/** Red has done recon and stood up a lookalike: the credible starting point. */
const PREPARED = stateWith([move('red', 'osint-staff'), move('red', 'register-lookalike')]);

describe('menu integrity', () => {
  it('gives every option a distinct id on both sides', () => {
    const ids = [...RED_OPTIONS, ...BLUE_OPTIONS].map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('refuses a move that is not on the menu', () => {
    expect(() => red(stateWith([]), 'not-a-move')).toThrow(MatchError);
    expect(() => blue(stateWith([]), 'not-a-move')).toThrow(MatchError);
  });
});

describe('red: targeting and defeating the factor', () => {
  it('rewards silent recon and infrastructure, leaking nothing', () => {
    const r = red(stateWith([]), 'osint-staff');
    expect(r.score.objectivePoints).toBe(9);
    expect(r.signal).toBeNull();
  });

  it('marks down a tailored pretext with no recon behind it', () => {
    expect(red(stateWith([]), 'tailored-pretext').score.objectivePoints).toBeLessThan(
      red(PREPARED, 'tailored-pretext').score.objectivePoints,
    );
  });

  it('scores the AITM relay above the harvesting page, because MFA defeats one and not the other', () => {
    const harvest = red(PREPARED, 'harvest-page').score.objectivePoints;
    const relay = red(PREPARED, 'aitm-proxy').score.objectivePoints;
    expect(relay).toBeGreaterThan(harvest);
    expect(relay).toBe(10);
  });

  it('leaks a token-shaped signal for the relay and a location signal for the harvest', () => {
    expect(red(PREPARED, 'aitm-proxy').signal?.label).toMatch(/no fresh authentication/i);
    expect(red(PREPARED, 'harvest-page').signal?.label).toMatch(/unfamiliar location/i);
  });

  it('will not let prompt bombing happen without a password to bomb against', () => {
    expect(red(stateWith([]), 'mfa-fatigue').score.objectivePoints).toBe(3);
    const withPassword = stateWith([move('red', 'register-lookalike'), move('red', 'harvest-page')]);
    expect(red(withPassword, 'mfa-fatigue').score.objectivePoints).toBe(8);
  });

  it('scores a repeat move down and does not re-leak nothing new', () => {
    const afterRecon = stateWith([move('red', 'osint-staff')]);
    expect(red(afterRecon, 'osint-staff').score.objectivePoints).toBe(2);
  });
});

describe('blue: containing the right thing', () => {
  const harvested = stateWith([move('red', 'register-lookalike'), move('red', 'harvest-page')]);
  const relayed = stateWith([move('red', 'register-lookalike'), move('red', 'aitm-proxy')]);
  const consented = stateWith([move('red', 'osint-staff'), move('red', 'consent-app')]);

  it('THE lesson: a password reset ends a stolen password but not a stolen session', () => {
    expect(blue(harvested, 'reset-password').score.objectivePoints).toBeGreaterThanOrEqual(9);
    expect(blue(relayed, 'reset-password').score.objectivePoints).toBeLessThanOrEqual(2);
  });

  it('rewards revoking sessions exactly when a session was stolen', () => {
    expect(blue(relayed, 'revoke-sessions').score.objectivePoints).toBe(10);
    // Harmless but not the point when only a password was taken.
    expect(blue(harvested, 'revoke-sessions').score.objectivePoints).toBeLessThan(10);
  });

  it('rewards a consent audit only when a grant actually exists', () => {
    expect(blue(consented, 'audit-consent').score.objectivePoints).toBe(10);
    expect(blue(harvested, 'audit-consent').score.objectivePoints).toBeLessThan(10);
  });

  it('rewards holding while nothing has reached the estate, and punishes it once Red is inside', () => {
    expect(blue(stateWith([move('red', 'osint-staff')]), 'hold').score.objectivePoints).toBe(9);
    expect(blue(relayed, 'hold').score.objectivePoints).toBe(1);
  });

  it('gives an investigation the evidence behind the last red move', () => {
    const r = blue(relayed, 'triage-report');
    expect(r.score.objectivePoints).toBe(9);
    expect(r.reveals?.[0]?.detail).toMatch(/token/i);
  });

  it('does not reward chasing an empty queue', () => {
    expect(blue(stateWith([move('red', 'osint-staff')]), 'triage-report').score.objectivePoints).toBe(3);
  });
});

describe('the reasoning half', () => {
  it('scores a considered rationale above a shrug', () => {
    const thin = red(PREPARED, 'aitm-proxy', 'do it');
    const thought = red(PREPARED, 'aitm-proxy', 'relay the login so the user satisfies the second factor for me, capturing the session');
    expect(thought.score.judgePoints!).toBeGreaterThan(thin.score.judgePoints!);
  });
});
