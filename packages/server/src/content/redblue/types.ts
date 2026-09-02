/**
 * The shape of a red-vs-blue match scenario.
 *
 * A scenario carries three things the engine cannot know: the seeded target both
 * sides work against, the move menu each side chooses from, and a resolver that
 * scores a move and decides what it leaks. The first two are public and the
 * third is not, which is the whole reason they live in different fields: options
 * ship to the browser, the resolver never does.
 */

import type { BoardState, MatchMode, MatchSide } from '@soc/shared';

import type { ResolveBoardMove, ResolveMove } from '../../services/matchEngine.js';

/** One move a side can pick. Public: nothing here reveals what it scores. */
export interface MoveOption {
  id: string;
  label: string;
  description: string;
}

/** A single seeded fact about the target. */
export interface DossierFact {
  k: string;
  v: string;
}

/**
 * The target both sides can see.
 *
 * Always a fabricated org on documentation ranges (RFC 5737 for addresses, the
 * `.example` TLD for names), so no move a student imagines could reach a real
 * host. This is the same non-negotiable the rest of the platform holds; here it
 * matters more, because the exercise is literally about pointing tools at a
 * target.
 */
export interface TargetDossier {
  org: string;
  summary: string;
  facts: DossierFact[];
}

/**
 * What Red types a command into at the higher tiers, in place of the menu.
 *
 * The attacker is scanning a remote target they have no shell on, so this is not
 * the host shell: it is a recon console that recognises attacker tools and
 * answers with realistic output. A recognised recon command maps to a scored
 * move (`optionId`, graded by the same resolver the menu uses); anything else
 * returns output and `optionId: null`, so `help` and typos cost no turn.
 */
export interface AttackerConsole {
  /** The lines shown when the console first opens. */
  banner: string[];
  /** Run one typed command. Pure: same input, same output. */
  run(command: string): { output: string; optionId: string | null };
}

export interface RedBlueScenario {
  id: string;
  title: string;
  /** One paragraph of framing, shown to both sides. */
  brief: string;
  /** How many rounds (red then blue) the match runs. */
  maxTurns: number;
  dossier: TargetDossier;
  red: MoveOption[];
  blue: MoveOption[];
  /** How a move scores and what it leaks. Server-only; never serialised out. */
  resolve: ResolveMove;
  /** Red's recon console for the terminal tiers. Server-only. */
  attacker?: AttackerConsole;
}

/**
 * One system on a positional board, as content declares it.
 *
 * Deliberately not a `BoardTarget`: the four state flags on a target belong to a
 * match in progress, and a scenario has no business shipping them. The board a
 * match starts on is built from these, clean, one per match.
 */
export interface PositionalTargetSpec {
  id: string;
  label: string;
  /** One line on what the system is. Shown to both sides; it is the map. */
  note: string;
  /** Red's objective. Exactly one target carries it. */
  crown?: boolean;
}

/**
 * A scenario played on a board rather than a menu.
 *
 * Sibling to `RedBlueScenario`, not a variant of it, because almost nothing
 * carries over: there is no move menu (the board is the menu), no attacker
 * console (there is no host to scan), and scoring answers a mechanical outcome
 * rather than an option id. What they do share is the dossier and the rule that
 * the resolver never leaves the server.
 */
export interface PositionalScenario {
  id: string;
  title: string;
  /** One paragraph of framing, shown to both sides. */
  brief: string;
  /** How many rounds (red fires, blue answers) before the clock runs out. */
  maxTurns: number;
  dossier: TargetDossier;
  targets: PositionalTargetSpec[];
  /** How many systems Blue may cover at once. */
  coverageBudget: number;
  /** How many times Blue may move a defence across the whole match. */
  movesLeft: number;
  /** How a board action scores and what it leaks. Server-only; never serialised out. */
  resolveBoard: ResolveBoardMove;
}

/**
 * A clean starting board for one match.
 *
 * Built fresh every time on purpose: two matches on the same scenario must not
 * be able to see each other's compromises, which sharing one object would allow.
 */
export function startingBoard(scenario: PositionalScenario): BoardState {
  return {
    phase: 'placement',
    targets: scenario.targets.map((t) => ({
      id: t.id,
      label: t.label,
      note: t.note,
      crown: t.crown === true,
      compromised: false,
      detectedHere: false,
      contained: false,
    })),
    coverage: [],
    coverageBudget: scenario.coverageBudget,
    movesLeft: scenario.movesLeft,
    found: [],
  };
}

/**
 * The scrubbed brief one side may receive.
 *
 * The dossier and the side's own option menu, and nothing about scoring or the
 * signals a move leaks. This is `toStudentView` for a match scenario: the one
 * shape a route is allowed to hand the browser.
 */
export interface RedBlueBrief {
  scenarioId: string;
  title: string;
  brief: string;
  you: MatchSide;
  /** Which game this is. `positional` briefs carry no options: the board is the menu. */
  mode: MatchMode;
  dossier: TargetDossier;
  options: MoveOption[];
}
