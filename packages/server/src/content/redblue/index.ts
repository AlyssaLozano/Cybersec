/**
 * The red-vs-blue scenario catalogue.
 *
 * Importing this module loads every scenario, and each self-registers its
 * resolver and turn budget with the engine seam (`matchContent.ts`) as a side
 * effect. So the one import here is what turns a bare match id into a graded,
 * playable match. Add a scenario by importing it and listing it in SCENARIOS.
 */

import type { MatchMode, MatchSide } from '@soc/shared';

import type { PositionalScenario, RedBlueBrief, RedBlueScenario } from './types.js';
import { RECON_NORTHWIND } from './recon-northwind.js';
import { FOOTHOLD_NORTHWIND } from './foothold-northwind.js';
import { LATERAL_NORTHWIND } from './lateral-northwind.js';
import { EXFIL_NORTHWIND } from './exfil-northwind.js';
import { PERSIST_NORTHWIND } from './persist-northwind.js';
import { REACH_THE_CORE } from './reach-the-core.js';
import {
  INTAKE_TIDEWATER,
  REGISTRY_HAVENPORT,
  THESIS_KINGSBRIDGE,
  WARD_MERIDIAN,
} from './boards-healthcare-public.js';
import {
  CLAIMS_PINNACLE,
  SUBSCRIBER_ORBIT,
  SWITCH_CASTLEBAY,
  TILL_HALLORAN,
} from './boards-finance-retail.js';
import {
  AIRSIDE_PORTMORE,
  FORMULA_VERITY,
  SIGNING_SUMMIT,
  SUBSTATION_FAIRHAVEN,
} from './boards-industry-ot.js';
import { MATTER_KESTREL, SOURCE_BEACON, TENANT_LUMEN } from './boards-information.js';
import {
  CONSOLE_ARGENT,
  FLEET_ARDEN,
  PROGRAMME_HALSTEAD,
  TERMINAL_KESTRELPORT,
  VAULT_MERIDIANEX,
} from './boards-specialist.js';

const SCENARIOS = new Map<string, RedBlueScenario>([
  [RECON_NORTHWIND.id, RECON_NORTHWIND],
  [FOOTHOLD_NORTHWIND.id, FOOTHOLD_NORTHWIND],
  [LATERAL_NORTHWIND.id, LATERAL_NORTHWIND],
  [EXFIL_NORTHWIND.id, EXFIL_NORTHWIND],
  [PERSIST_NORTHWIND.id, PERSIST_NORTHWIND],
]);

/**
 * The scenarios played on a board rather than a menu.
 *
 * A separate map, not an entry in SCENARIOS, because the two shapes have almost
 * nothing in common (see `PositionalScenario`) and a union in the map would put
 * a narrowing branch in every caller. Both self-register their scoring on
 * import; this file's job is only to make sure the import happens.
 */
const POSITIONAL_LIST: PositionalScenario[] = [
  REACH_THE_CORE,
  WARD_MERIDIAN,
  INTAKE_TIDEWATER,
  THESIS_KINGSBRIDGE,
  REGISTRY_HAVENPORT,
  SWITCH_CASTLEBAY,
  TILL_HALLORAN,
  CLAIMS_PINNACLE,
  SUBSCRIBER_ORBIT,
  SUBSTATION_FAIRHAVEN,
  SIGNING_SUMMIT,
  FORMULA_VERITY,
  AIRSIDE_PORTMORE,
  SOURCE_BEACON,
  MATTER_KESTREL,
  TENANT_LUMEN,
  VAULT_MERIDIANEX,
  FLEET_ARDEN,
  TERMINAL_KESTRELPORT,
  PROGRAMME_HALSTEAD,
  CONSOLE_ARGENT,
];

const POSITIONAL = new Map<string, PositionalScenario>(POSITIONAL_LIST.map((s) => [s.id, s]));

/** Every linear red-blue scenario. */
export const RED_BLUE_SCENARIOS: RedBlueScenario[] = [...SCENARIOS.values()];

/** Every board scenario. */
export const POSITIONAL_SCENARIOS: PositionalScenario[] = [...POSITIONAL.values()];

export function getRedBlueScenario(id: string): RedBlueScenario | null {
  return SCENARIOS.get(id) ?? null;
}

export function getPositionalScenario(id: string): PositionalScenario | null {
  return POSITIONAL.get(id) ?? null;
}

/** What a scenario picker needs: names, framing, and which game it is. */
export interface MatchScenarioSummary {
  id: string;
  title: string;
  org: string;
  brief: string;
  mode: MatchMode;
}

/** Both catalogues, for the lobby. Linear first, so the existing five stay where they were. */
export function matchScenarioList(): MatchScenarioSummary[] {
  return [
    ...RED_BLUE_SCENARIOS.map((s) => ({
      id: s.id,
      title: s.title,
      org: s.dossier.org,
      brief: s.brief,
      mode: 'linear' as const,
    })),
    ...POSITIONAL_SCENARIOS.map((s) => ({
      id: s.id,
      title: s.title,
      org: s.dossier.org,
      brief: s.brief,
      mode: 'positional' as const,
    })),
  ];
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
    mode: 'linear',
    dossier: scenario.dossier,
    options: side === 'red' ? scenario.red : scenario.blue,
  };
}

/**
 * The brief for either kind of scenario, or null if the id is not one.
 *
 * A board scenario carries no options on purpose: the board IS the menu, and it
 * arrives already redacted in the match view. So the brief is the framing and
 * the dossier, which is exactly what both sides are allowed to read.
 */
export function matchBriefFor(scenarioId: string, side: MatchSide): RedBlueBrief | null {
  const linear = getRedBlueScenario(scenarioId);
  if (linear) return redBlueBriefFor(linear, side);
  const board = getPositionalScenario(scenarioId);
  if (!board) return null;
  return {
    scenarioId: board.id,
    title: board.title,
    brief: board.brief,
    you: side,
    mode: 'positional',
    dossier: board.dossier,
    options: [],
  };
}
