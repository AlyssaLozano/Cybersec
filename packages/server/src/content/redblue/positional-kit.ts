/**
 * The shared machinery behind every board scenario.
 *
 * WHY THIS EXISTS
 *
 * A board scenario is almost entirely CONTENT: an estate, six or so systems, one
 * of them the thing both sides are playing for, and a line of flavour for each
 * of the four things that can happen to it. The scoring on top of that is the
 * same argument every time, because the lesson is the same every time -- a
 * caught shot still bought you something, a round spent on ground you already
 * hold bought you nothing, and Blue covering a system it KNEW was already taken
 * is a worse mistake than covering one it could not have known about.
 *
 * So the argument lives here once and is tested once, and a scenario file is
 * the estate and the words. That is also what stops fifteen boards from drifting
 * into fifteen slightly different rubrics, which would make the same move score
 * differently depending on which hospital you were attacking.
 *
 * WHAT A SCENARIO STILL OWNS
 *
 * The board shape (how many systems, how many defences, how long the clock) is
 * the scenario's, and it is where the difficulty actually lives: four systems
 * with one defence is a very different game from nine with three. And every word
 * a player reads is the scenario's. None of that is here.
 */

import type { MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type BoardOutcome, type MoveResolution } from '../../services/matchEngine.js';
import { registerPositionalScenario } from '../../services/matchContent.js';
import { startingBoard, type PositionalScenario, type TargetDossier } from './types.js';

/** Both halves of a move are out of ten, so reasoning is worth as much as result. */
export const MAX_OBJECTIVE = 10;
export const MAX_JUDGE = 10;

/**
 * What each of the four outcomes MEANS on one particular system.
 *
 * This is the whole reason a board is a scenario rather than a grid of boxes:
 * "compromised" on a hospital's EHR and "compromised" on a water utility's HMI
 * are different sentences, and the sentence is what a student remembers.
 */
export interface TargetFlavour {
  /**
   * Red's own note when it takes the system quietly: HOW, specifically, with the
   * tooling and the reason it works. Written so a student can repeat it in an
   * interview, not so it sounds atmospheric.
   */
  compromise: string;
  /**
   * What Blue is told when it catches a shot here. The DETECTION: the data
   * source and the logic, not just "something bad happened".
   */
  detect: string;
  /** The artefact a Blue investigation actually pulls, named precisely. */
  evidence: string;
  /** What Red is told when Blue walls it: the containment actions, in order. */
  contain: string;
}

export interface BoardTargetSpec {
  id: string;
  label: string;
  /** What the system is, and the technical shape of it. Both sides see it. */
  note: string;
  /**
   * The ATT&CK technique this system falls to, e.g. "T1003.006 DCSync".
   *
   * Required, not optional, and that is the point: a board whose author cannot
   * name the technique for a system has not thought about what that system
   * teaches. It is public to both sides, because it is vocabulary rather than
   * position.
   */
  technique: string;
  /** Red's objective. At least one target must carry it. */
  crown?: boolean;
  flavour: TargetFlavour;
}

export interface PositionalSpec {
  id: string;
  title: string;
  brief: string;
  dossier: TargetDossier;
  /** Rounds (Red fires, Blue answers) before the clock decides it for Blue. */
  maxTurns: number;
  /** Systems Blue may cover at once. */
  coverageBudget: number;
  /** Repositions Blue gets for the whole match. */
  movesLeft: number;
  targets: BoardTargetSpec[];
  /**
   * Extra words the justification rubric should recognise for this estate, on
   * top of the shared game vocabulary. Keeps "encrypt" worth something in a
   * ransomware board without making it worth something in every board.
   */
  terms?: string[];
}

/**
 * Score the written rationale. A DETERMINISTIC RUBRIC, NOT AN LLM.
 *
 * The same honest limitation the linear scenarios carry (`recon-northwind.ts`
 * sets it out in full): the platform is offline, so nothing here can read a
 * sentence. What it can reward is a rationale that is developed rather than a
 * shrug, and one that names a consideration this game is about -- where the
 * defences might be, what a shot gives away, what a round costs. Gameable by
 * keyword stuffing, and meant as a nudge rather than a verdict. A real judge
 * drops in at exactly this seam.
 */
const SHARED_TERMS = [
  'cover', 'coverage', 'defend', 'defence', 'defense', 'detect', 'seen', 'quiet',
  'hidden', 'guess', 'predict', 'expect', 'probe', 'bait', 'draw', 'bluff',
  'crown', 'core', 'objective', 'path', 'pivot', 'stage', 'clock', 'round',
  'turn', 'risk', 'trade', 'cost', 'contain', 'investigate', 'reposition',
  'because', 'they', 'likely', 'unlikely',
];

export function judgeJustification(text: string, extra: string[] = []): number {
  const t = text.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);
  let pts = 0;
  if (words.length >= 6) pts += 4;
  else if (words.length >= 3) pts += 2;
  const hits = [...SHARED_TERMS, ...extra].filter((term) => t.includes(term)).length;
  pts += Math.min(6, hits * 2);
  return Math.min(MAX_JUDGE, pts);
}

/**
 * Build a board scenario from its estate and its shape.
 *
 * Validates on the way through and THROWS rather than returning something
 * playable-but-wrong, because this runs at import time: a board with no
 * objective, or a board covered edge to edge, is a content bug that should stop
 * the server booting rather than reach a student. Same call the exercise
 * catalogue validator makes.
 */
export function positionalScenario(spec: PositionalSpec): PositionalScenario {
  const ids = spec.targets.map((t) => t.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${spec.id}: two systems share an id.`);
  }
  if (spec.targets.length < 3) {
    throw new Error(`${spec.id}: a board needs at least three systems to be a guess.`);
  }
  if (!spec.targets.some((t) => t.crown)) {
    throw new Error(`${spec.id}: no crown. Red has nothing to play for.`);
  }
  // Coverage must leave Red somewhere to go. Covering half the board or more
  // turns a bet into a coin toss and stops rewarding the read.
  if (spec.coverageBudget < 1 || spec.coverageBudget >= spec.targets.length / 2) {
    throw new Error(
      `${spec.id}: coverage of ${spec.coverageBudget} on ${spec.targets.length} systems leaves Red no room.`,
    );
  }
  if (spec.maxTurns < 3) throw new Error(`${spec.id}: too few rounds to play a read.`);
  // A system nobody can name the technique for is a box, not a lesson.
  const untitled = spec.targets.find((t) => !/^T\d{4}(\.\d{3})? /.test(t.technique));
  if (untitled) {
    throw new Error(`${spec.id}: ${untitled.id} needs an ATT&CK technique id, got "${untitled.technique}".`);
  }

  const flavourOf = (targetId: string): TargetFlavour => {
    const found = spec.targets.find((t) => t.id === targetId);
    if (!found) throw new MatchError('That system is not on this board.');
    return found.flavour;
  };

  const score = (
    objectivePoints: number,
    note: string,
    signal: MatchSignal | null,
    justification: string,
    reveals?: RevealedFinding[],
  ): MoveResolution => ({
    score: {
      objectivePoints,
      maxObjective: MAX_OBJECTIVE,
      judgePoints: judgeJustification(justification, spec.terms),
      maxJudge: MAX_JUDGE,
      note,
    },
    signal,
    reveals,
  });

  /**
   * Red's shot. The scores encode the lesson rather than the outcome: a caught
   * shot is worth something real, because a known defensive position is intel
   * Red has no other way to buy.
   */
  const resolveFire = (
    outcome: Extract<BoardOutcome, { kind: 'fire' }>,
    justification: string,
  ): MoveResolution => {
    const { target, defended, spent, won } = outcome;
    const flavour = flavourOf(target.id);

    if (defended) {
      return score(
        3,
        `Covered. You are on their board now, but you know one of their ${spec.coverageBudget} eyes was on ` +
          `${target.label}, and they cannot move it for free.`,
        { detected: true, label: `Detection: ${target.label}`, detail: flavour.detect },
        justification,
        [
          {
            id: `red-defended-${target.id}`,
            kind: 'service',
            title: `Defended: ${target.label}`,
            detail: 'Your shot landed on active coverage here. Expensive, but now you know.',
            severity: 'medium',
          },
        ],
      );
    }

    if (spent) {
      return score(
        1,
        target.contained
          ? 'They walled that off. Nothing behind it any more, and you spent a round finding out.'
          : 'You already hold that system. A round spent learning nothing.',
        null,
        justification,
      );
    }

    const reveal: RevealedFinding = {
      id: `red-own-${target.id}`,
      kind: 'service',
      title: `Compromised: ${target.label}`,
      detail: flavour.compromise,
      severity: won ? 'high' : 'medium',
    };

    if (won) {
      return score(
        10,
        `${target.label} is yours and you were never seen taking it. That is the objective.`,
        null,
        justification,
        [reveal],
      );
    }
    return score(
      8,
      `${target.label} is yours, quietly. They will not know unless they go and look.`,
      null,
      justification,
      [reveal],
    );
  };

  /**
   * Blue's answer. `state.board` is read for exactly one thing: whether Blue
   * already KNEW about a compromise it is now covering over. A grade that cannot
   * tell a bad read from bad luck teaches the wrong lesson.
   */
  const resolveBlue = (
    state: MatchState,
    outcome: BoardOutcome,
    justification: string,
  ): MoveResolution => {
    switch (outcome.kind) {
      case 'reposition': {
        const { from, to } = outcome;
        const knew = state.board?.found.includes(to.id) === true;
        if (to.compromised && knew) {
          return score(
            3,
            'You knew that system was already taken. Coverage does not evict anyone; containment does.',
            null,
            justification,
          );
        }
        if (to.compromised) {
          return score(
            5,
            'They already hold it, though you had no way to know. Coverage there watches an open door.',
            null,
            justification,
          );
        }
        if (from.detectedHere) {
          return score(
            8,
            `They bounced off ${from.label} and will not walk into it twice. Moving that defence is the right read.`,
            null,
            justification,
          );
        }
        return score(
          6,
          `Coverage shifted to ${to.label}. A prediction, and you have fewer of those than you think.`,
          null,
          justification,
        );
      }
      case 'investigate': {
        const { target, found } = outcome;
        if (!found) {
          return score(
            4,
            `${target.label} is clean. It cost you the round, but a ruled-out system is still a read.`,
            null,
            justification,
          );
        }
        return score(
          9,
          `Found them on ${target.label}. Now you can wall it: containment only works where you have looked.`,
          null,
          justification,
          [
            {
              id: `blue-ev-${target.id}`,
              kind: 'evidence',
              title: `Compromise on ${target.label}`,
              detail: flavourOf(target.id).evidence,
              severity: target.crown ? 'high' : 'medium',
            },
          ],
        );
      }
      case 'contain': {
        const { target } = outcome;
        return score(
          10,
          `${target.label} is walled and their position on it is gone. That is ground taken back.`,
          { detected: true, label: `Contained: ${target.label}`, detail: flavourOf(target.id).contain },
          justification,
        );
      }
      default:
        throw new MatchError('That is not a move Blue can make on this board.');
    }
  };

  const resolveBoard = ({
    state,
    side,
    outcome,
    justification,
  }: {
    state: MatchState;
    side: 'red' | 'blue';
    outcome: BoardOutcome;
    justification: string;
  }): MoveResolution => {
    if (side === 'red') {
      if (outcome.kind !== 'fire') throw new MatchError('Red fires; it does not defend.');
      return resolveFire(outcome, justification);
    }
    if (outcome.kind === 'fire') throw new MatchError('Blue defends; it does not fire.');
    return resolveBlue(state, outcome, justification);
  };

  return {
    id: spec.id,
    title: spec.title,
    brief: spec.brief,
    maxTurns: spec.maxTurns,
    dossier: spec.dossier,
    targets: spec.targets.map((t) => ({
      id: t.id,
      label: t.label,
      note: t.note,
      technique: t.technique,
      ...(t.crown ? { crown: true } : {}),
    })),
    coverageBudget: spec.coverageBudget,
    movesLeft: spec.movesLeft,
    resolveBoard,
  };
}

/**
 * Build a board scenario and register it in one step.
 *
 * Every board scenario ends with the same three lines otherwise, and a scenario
 * that is built but not registered is the quiet failure mode: it appears in the
 * catalogue and then scores nothing.
 */
export function definePositional(spec: PositionalSpec): PositionalScenario {
  const scenario = positionalScenario(spec);
  registerPositionalScenario(scenario.id, {
    board: () => startingBoard(scenario),
    resolveBoard: scenario.resolveBoard,
    maxTurns: scenario.maxTurns,
  });
  return scenario;
}
