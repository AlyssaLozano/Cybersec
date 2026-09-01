/**
 * The red-vs-blue scenario catalogue.
 *
 * Importing this module loads every scenario, and each self-registers its
 * resolver and turn budget with the engine seam (`matchContent.ts`) as a side
 * effect. So the one import here is what turns a bare match id into a graded,
 * playable match. Add a scenario by importing it and listing it in SCENARIOS.
 */

import type { MatchSide } from '@soc/shared';

import type { RedBlueBrief, RedBlueScenario } from './types.js';
import { RECON_NORTHWIND } from './recon-northwind.js';

const SCENARIOS = new Map<string, RedBlueScenario>([[RECON_NORTHWIND.id, RECON_NORTHWIND]]);

/** Every red-blue scenario, for a picker. */
export const RED_BLUE_SCENARIOS: RedBlueScenario[] = [...SCENARIOS.values()];

export function getRedBlueScenario(id: string): RedBlueScenario | null {
  return SCENARIOS.get(id) ?? null;
}

/**
 * The scrubbed brief one side may see: the dossier and their own move menu,
 * never the resolver. This is the one shape a route hands the browser -- the
 * scenario's `toStudentView`.
 */
export function redBlueBriefFor(scenario: RedBlueScenario, side: MatchSide): RedBlueBrief {
  return {
    scenarioId: scenario.id,
    title: scenario.title,
    brief: scenario.brief,
    you: side,
    dossier: scenario.dossier,
    options: side === 'red' ? scenario.red : scenario.blue,
  };
}
