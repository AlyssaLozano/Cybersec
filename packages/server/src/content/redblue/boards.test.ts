/**
 * Every board scenario, checked as a catalogue rather than one file at a time.
 *
 * WHY TABLE-DRIVEN
 *
 * Sixteen near-identical test files would rot: someone adds a board, copies the
 * nearest test, and the copy quietly asserts nothing about the new one. Driving
 * off the registered catalogue means a board that is added and NOT checked is
 * impossible, because the loop finds it automatically. The cost is that a
 * failure names the board rather than the line, which is why every assertion
 * below carries the board id in its message.
 *
 * WHAT IS WORTH FREEZING HERE
 *
 * Two kinds of thing. Rules a student could be harmed by getting wrong: a real
 * address or a real domain reaching a scenario, which is the platform's hardest
 * non-negotiable. And rules that keep the game a game: an objective to play for,
 * coverage that leaves room to move, and enough clock to make a read.
 */

import { describe, expect, it } from 'vitest';

import { boardFor, isPositional, maxTurnsFor, resolveBoardFor } from '../../services/matchContent.js';
import { POSITIONAL_SCENARIOS, matchBriefFor, matchScenarioList } from './index.js';
import { startingBoard } from './types.js';

/** Documentation and private ranges only. Anything else can route to a real host. */
const SAFE_ADDRESS = /^(?:192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.)/;

/** Every string a player could ever read on this board. */
function allProse(scenarioId: string): string {
  const scenario = POSITIONAL_SCENARIOS.find((s) => s.id === scenarioId)!;
  return [
    scenario.title,
    scenario.brief,
    scenario.dossier.org,
    scenario.dossier.summary,
    ...scenario.dossier.facts.flatMap((f) => [f.k, f.v]),
    ...scenario.targets.flatMap((t) => [t.label, t.note, t.technique]),
  ].join(' \n ');
}

describe('the board catalogue', () => {
  it('has boards registered at all', () => {
    expect(POSITIONAL_SCENARIOS.length).toBeGreaterThan(0);
  });

  it('gives every board a unique id', () => {
    const ids = POSITIONAL_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('never collides with a linear scenario id', () => {
    const list = matchScenarioList();
    expect(new Set(list.map((s) => s.id)).size).toBe(list.length);
  });
});

describe.each(POSITIONAL_SCENARIOS.map((s) => [s.id, s] as const))('board %s', (id, scenario) => {
  it('is registered, playable and graded', () => {
    expect(isPositional(id), `${id} is not registered as positional`).toBe(true);
    expect(maxTurnsFor(id), `${id} has no turn budget`).toBe(scenario.maxTurns);
    expect(resolveBoardFor(id), `${id} is not graded`).toBe(scenario.resolveBoard);
    expect(boardFor(id), `${id} builds no board`).not.toBeNull();
  });

  it('has exactly one objective', () => {
    const crowns = scenario.targets.filter((t) => t.crown);
    expect(crowns.length, `${id} should have one crown, has ${crowns.length}`).toBe(1);
  });

  it('leaves Red somewhere to go', () => {
    // Coverage at or above half the board turns a read into a coin toss.
    expect(
      scenario.coverageBudget * 2,
      `${id} covers ${scenario.coverageBudget} of ${scenario.targets.length}`,
    ).toBeLessThan(scenario.targets.length);
    expect(scenario.coverageBudget, `${id} has no coverage at all`).toBeGreaterThan(0);
  });

  it('gives Blue fewer repositions than rounds, so moving one costs something', () => {
    expect(scenario.movesLeft, `${id} lets Blue reposition every round`).toBeLessThan(scenario.maxTurns);
    expect(scenario.movesLeft, `${id} gives Blue no repositions`).toBeGreaterThan(0);
  });

  it('runs long enough to play a read', () => {
    expect(scenario.maxTurns, `${id} is too short`).toBeGreaterThanOrEqual(8);
  });

  it('names an ATT&CK technique on every system', () => {
    for (const t of scenario.targets) {
      expect(t.technique, `${id}/${t.id} has no technique id`).toMatch(/^T\d{4}(\.\d{3})? \S/);
    }
  });

  it('gives every system a distinct id and a label', () => {
    const ids = scenario.targets.map((t) => t.id);
    expect(new Set(ids).size, `${id} repeats a system id`).toBe(ids.length);
    for (const t of scenario.targets) {
      expect(t.label.length, `${id}/${t.id} has no label`).toBeGreaterThan(0);
      expect(t.note.length, `${id}/${t.id} has no note`).toBeGreaterThan(0);
    }
  });

  it('starts every match on its own clean board', () => {
    const a = startingBoard(scenario);
    const b = startingBoard(scenario);
    a.targets[0]!.compromised = true;
    a.coverage.push(a.targets[0]!.id);
    expect(b.targets[0]!.compromised, `${id} shares target state between matches`).toBe(false);
    expect(b.coverage, `${id} shares coverage between matches`).toEqual([]);
    expect(b.phase).toBe('placement');
    expect(b.found).toEqual([]);
  });

  it('serves a brief with no options, because the board is the menu', () => {
    const brief = matchBriefFor(id, 'red');
    expect(brief?.mode, `${id} brief is not positional`).toBe('positional');
    expect(brief?.options, `${id} brief carries a move menu`).toEqual([]);
    expect(brief?.dossier.facts.length, `${id} has an empty dossier`).toBeGreaterThan(0);
  });

  /**
   * The platform's hardest rule. A simulated command must never be able to reach
   * a real host, and the first way that goes wrong is somebody writing a real
   * address into flavour text because it looked plausible.
   */
  it('uses only documentation and private addresses', () => {
    const prose = allProse(id);
    const addresses = prose.match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g) ?? [];
    expect(addresses.length, `${id} names no addresses at all`).toBeGreaterThan(0);
    for (const address of addresses) {
      expect(address, `${id} uses a routable address`).toMatch(SAFE_ADDRESS);
    }
  });

  it('uses only .example hostnames', () => {
    const prose = allProse(id);
    // Hostnames only: a bare "T1003.006" or "10.30.2.10" is not a domain.
    const hosts = prose.match(/\b[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+\b/g) ?? [];
    for (const host of hosts) {
      expect(host, `${id} names a non-.example host`).toMatch(/\.example$/);
    }
  });
});
