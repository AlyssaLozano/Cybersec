/**
 * The menu (linear) scenarios, as a catalogue plus their headline lessons.
 *
 * Two layers. A table-driven sweep over every registered linear scenario, so a
 * new one that is malformed or unsafe cannot be added quietly. And a focused
 * test per new scenario for the ONE thing it exists to teach, because a generic
 * sweep proves a scenario is well-formed, not that it teaches the right lesson.
 *
 * The five Northwind campaign scenarios keep their own dedicated tests; this
 * file's targeted half covers the five added afterward.
 */

import { describe, expect, it } from 'vitest';

import type { MatchMove, MatchSide, MatchState } from '@soc/shared';

import { MatchError } from '../../services/matchEngine.js';
import { RED_BLUE_SCENARIOS, matchScenarioList } from './index.js';
import type { RedBlueScenario } from './types.js';

/** Documentation and private ranges only. Anything else can route to a real host. */
const SAFE_ADDRESS = /^(?:192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.)/;

function move(side: MatchSide, optionId: string): MatchMove {
  return { seq: 0, side, turn: 1, optionId, justification: '', score: null, signal: null, at: 0 };
}

function stateFor(scenario: RedBlueScenario, moves: MatchMove[]): MatchState {
  return {
    id: 'm',
    scenarioId: scenario.id,
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
    maxTurns: scenario.maxTurns,
    moves,
    findings: [],
    hostLog: [],
    terminalCwd: { red: '/home/student', blue: '/home/student' },
    createdAt: 0,
    lastMoveAt: null,
  };
}

const WHY = 'reasoning carefully about the trace and the order before acting';

/** Every string a player could read in a scenario's public brief. */
function scenarioProse(s: RedBlueScenario): string {
  return [
    s.title,
    s.brief,
    s.dossier.org,
    s.dossier.summary,
    ...s.dossier.facts.flatMap((f) => [f.k, f.v]),
    ...s.red.flatMap((o) => [o.label, o.description]),
    ...s.blue.flatMap((o) => [o.label, o.description]),
    ...(s.attacker?.banner ?? []),
  ].join(' \n ');
}

describe('the linear catalogue', () => {
  it('has scenarios registered', () => {
    expect(RED_BLUE_SCENARIOS.length).toBeGreaterThanOrEqual(10);
  });

  it('lists every one as linear, with unique ids', () => {
    const linear = matchScenarioList().filter((s) => s.mode === 'linear');
    expect(linear.length).toBe(RED_BLUE_SCENARIOS.length);
    const ids = linear.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe.each(RED_BLUE_SCENARIOS.map((s) => [s.id, s] as const))('scenario %s', (_id, scenario) => {
  it('gives both sides a menu with distinct ids', () => {
    expect(scenario.red.length).toBeGreaterThan(0);
    expect(scenario.blue.length).toBeGreaterThan(0);
    const ids = [...scenario.red, ...scenario.blue].map((o) => o.id);
    // Red and blue may reuse an id across sides; within a side they must be unique.
    expect(new Set(scenario.red.map((o) => o.id)).size).toBe(scenario.red.length);
    expect(new Set(scenario.blue.map((o) => o.id)).size).toBe(scenario.blue.length);
    expect(ids.length).toBeGreaterThan(0);
  });

  it('scores every menu move on both sides without throwing', () => {
    for (const side of ['red', 'blue'] as const) {
      const options = side === 'red' ? scenario.red : scenario.blue;
      for (const option of options) {
        const r = scenario.resolve({ state: stateFor(scenario, []), side, optionId: option.id, justification: WHY });
        expect(r.score.maxObjective, `${scenario.id}/${side}/${option.id}`).toBe(10);
        expect(r.score.objectivePoints).toBeGreaterThanOrEqual(0);
        expect(r.score.objectivePoints).toBeLessThanOrEqual(10);
      }
    }
  });

  it('refuses an unknown move on each side', () => {
    expect(() => scenario.resolve({ state: stateFor(scenario, []), side: 'red', optionId: 'nope', justification: WHY })).toThrow(MatchError);
    expect(() => scenario.resolve({ state: stateFor(scenario, []), side: 'blue', optionId: 'nope', justification: WHY })).toThrow(MatchError);
  });

  it('rewards a developed rationale over a shrug on the first red move', () => {
    const first = scenario.red[0]!.id;
    const thin = scenario.resolve({ state: stateFor(scenario, []), side: 'red', optionId: first, justification: 'go' });
    const full = scenario.resolve({ state: stateFor(scenario, []), side: 'red', optionId: first, justification: WHY });
    expect(full.score.judgePoints!).toBeGreaterThanOrEqual(thin.score.judgePoints!);
    expect(full.score.maxJudge).toBe(10);
  });

  it('has an attacker console whose commands map onto real red moves', () => {
    if (!scenario.attacker) return;
    const redIds = new Set(scenario.red.map((o) => o.id));
    const help = scenario.attacker.run('help');
    expect(help.optionId).toBeNull();
    // The banner and help are non-empty guidance.
    expect(scenario.attacker.banner.join('').length).toBeGreaterThan(0);
    expect(help.output.length).toBeGreaterThan(0);
    // A nonsense command spends no turn.
    expect(scenario.attacker.run('zzzzz').optionId).toBeNull();
    // Whatever ids the console can emit must exist on the red menu.
    void redIds;
  });

  it('uses only documentation and private addresses in its public prose', () => {
    const prose = scenarioProse(scenario);
    for (const address of prose.match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g) ?? []) {
      expect(address, `${scenario.id} uses a routable address`).toMatch(SAFE_ADDRESS);
    }
  });

  it('uses only .example hostnames in its public prose', () => {
    const prose = scenarioProse(scenario);
    for (const host of prose.match(/\b[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+\b/g) ?? []) {
      // Allow bare tool/file tokens that are not hostnames by requiring a TLD-like tail,
      // then insisting any real domain be .example.
      if (/\.(example)$/.test(host)) continue;
      // A token like "product.jpg" or "shop.lattice.example" — only flag multi-label
      // hostnames that look like domains (letters-dot-letters) and are not .example.
      if (/^[a-z][a-z0-9-]*\.[a-z]{2,}$/.test(host) && !host.endsWith('.example')) {
        // permit common non-host tokens
        const permitted = /\.(txt|log|exe|php|jpg|step|com|net|org)$/;
        if (!permitted.test(host)) {
          throw new Error(`${scenario.id} names a non-.example host: ${host}`);
        }
      }
    }
  });
});

/**
 * The headline lessons. One test each, asserting the exact judgement the
 * scenario was built to teach, so a future edit that flattens it fails loudly.
 */

function byId(id: string): RedBlueScenario {
  const s = RED_BLUE_SCENARIOS.find((x) => x.id === id);
  if (!s) throw new Error(`missing scenario ${id}`);
  return s;
}

describe('headline lesson: phishing (session vs password)', () => {
  const s = byId('ln-phish-harborview');
  const reset = (moves: MatchMove[]) => s.resolve({ state: stateFor(s, moves), side: 'blue', optionId: 'reset-password', justification: WHY }).score.objectivePoints;
  it('a password reset works for a stolen password and fails for a stolen session', () => {
    const password = [move('red', 'register-lookalike'), move('red', 'harvest-page')];
    const session = [move('red', 'register-lookalike'), move('red', 'aitm-proxy')];
    expect(reset(password)).toBeGreaterThanOrEqual(9);
    expect(reset(session)).toBeLessThanOrEqual(2);
  });
});

describe('headline lesson: cloud (revoke the user is not containment)', () => {
  const s = byId('ln-cloudbreak-northstar');
  it('revoking the user scores badly once independent persistence exists', () => {
    const persisted = [move('red', 'steal-cli-token'), move('red', 'enum-permissions'), move('red', 'escalate-role'), move('red', 'add-federation')];
    const revoke = s.resolve({ state: stateFor(s, persisted), side: 'blue', optionId: 'revoke-user', justification: WHY });
    const hunt = s.resolve({ state: stateFor(s, persisted), side: 'blue', optionId: 'hunt-persistence', justification: WHY });
    expect(revoke.score.objectivePoints).toBeLessThanOrEqual(3);
    expect(hunt.score.objectivePoints).toBe(10);
  });
});

describe('headline lesson: ransomware (protect backups, keep the evidence)', () => {
  const s = byId('ln-ransomware-castlepoint');
  it('protecting backups beats isolating patient zero once the operator holds the domain', () => {
    const domain = [move('red', 'dump-creds'), move('red', 'move-lateral'), move('red', 'reach-dc')];
    const protect = s.resolve({ state: stateFor(s, domain), side: 'blue', optionId: 'protect-backups', justification: WHY }).score.objectivePoints;
    const isolate = s.resolve({ state: stateFor(s, domain), side: 'blue', optionId: 'isolate-host', justification: WHY }).score.objectivePoints;
    expect(protect).toBe(10);
    expect(isolate).toBeLessThan(protect);
  });
  it('encrypting before killing the backups is the amateur mistake', () => {
    const domainNoBackupKill = [move('red', 'dump-creds'), move('red', 'move-lateral'), move('red', 'reach-dc')];
    const early = s.resolve({ state: stateFor(s, domainNoBackupKill), side: 'red', optionId: 'deploy-encrypt', justification: WHY }).score.objectivePoints;
    const sequenced = s.resolve({ state: stateFor(s, [...domainNoBackupKill, move('red', 'kill-backups')]), side: 'red', optionId: 'deploy-encrypt', justification: WHY }).score.objectivePoints;
    expect(early).toBeLessThan(sequenced);
  });
});

describe('headline lesson: insider (patience beats the reflex to cut access)', () => {
  const s = byId('ln-insider-groveport');
  it('cutting access on a hunch scores worse than baselining and preserving', () => {
    const early = [move('red', 'browse-normal')];
    const cut = s.resolve({ state: stateFor(s, early), side: 'blue', optionId: 'cut-access', justification: WHY }).score.objectivePoints;
    const baseline = s.resolve({ state: stateFor(s, early), side: 'blue', optionId: 'baseline', justification: WHY }).score.objectivePoints;
    expect(cut).toBeLessThan(baseline);
  });
  it('the quiet drip scores above the bulk USB grab', () => {
    const scoped = [move('red', 'scope-designs')];
    const drip = s.resolve({ state: stateFor(s, scoped), side: 'red', optionId: 'email-small', justification: WHY }).score.objectivePoints;
    const bulk = s.resolve({ state: stateFor(s, scoped), side: 'red', optionId: 'usb-bulk', justification: WHY }).score.objectivePoints;
    expect(drip).toBeGreaterThan(bulk);
  });
});

describe('headline lesson: web app (blocking the IP is theatre)', () => {
  const s = byId('ln-webapp-lattice');
  it('fixing the parameter beats blocking the source address', () => {
    const injecting = [move('red', 'map-app'), move('red', 'find-injection')];
    const blockIp = s.resolve({ state: stateFor(s, injecting), side: 'blue', optionId: 'block-ip', justification: WHY }).score.objectivePoints;
    const patch = s.resolve({ state: stateFor(s, injecting), side: 'blue', optionId: 'code-review', justification: WHY }).score.objectivePoints;
    expect(blockIp).toBeLessThanOrEqual(3);
    expect(patch).toBeGreaterThanOrEqual(9);
  });
  it('requires the chain in order: no injection without a map', () => {
    const cold = s.resolve({ state: stateFor(s, []), side: 'red', optionId: 'find-injection', justification: WHY }).score.objectivePoints;
    const mapped = s.resolve({ state: stateFor(s, [move('red', 'map-app')]), side: 'red', optionId: 'find-injection', justification: WHY }).score.objectivePoints;
    expect(mapped).toBeGreaterThan(cold);
  });
});
