/**
 * Operation Tidewater, endgame: Reach the Core.
 *
 * THE SKILL EACH SIDE IS ACTUALLY LEARNING
 *
 * The five linear scenarios teach sequencing: do the quiet thing before the loud
 * thing, read the queue before you reach for a block. This one teaches the layer
 * above that, which is the part nobody can drill from a menu -- PLAYING AN
 * OPPONENT WHO IS HIDING THINGS FROM YOU.
 *
 * Red is not graded on taking the most systems. Red is graded on reaching one
 * specific system without ever being seen, which means every shot is a bet on
 * where the two defences are NOT. A shot that lands on coverage costs the round
 * and puts Red on the board, but it also buys the one thing Red cannot get any
 * other way: a known position. That trade -- burn a turn and your cover to learn
 * where an eye is -- is the whole of offensive tradecraft in miniature.
 *
 * Blue is not graded on activity. Blue has three things it can do with a round
 * and can do exactly one, so every round is a real cost: move a defence and you
 * are predicting, look at a system and you are conceding that something may
 * already be past you, contain and you take ground back but only where you have
 * already looked. Blue's classic failure here is watching a system it has
 * already seen Red bounce off, which is the defensive equivalent of guarding a
 * door the burglar has left.
 *
 * WHAT MAKES IT A GAME RATHER THAN A QUIZ
 *
 * Red is never told where coverage is. Blue is never told about a compromise it
 * has not gone and looked for. Both facts are enforced in `boardViewFor`, not
 * here: content decides what a move is WORTH, the engine decides what a player
 * may SEE. Blue's silence after a quiet compromise is the mode working, not a
 * bug in the scoring.
 *
 * THE TARGET IS FABRICATED, ON PURPOSE AND BY RULE
 *
 * The same Northwind estate the linear scenarios use: `.example` names, RFC 5737
 * documentation ranges outside, RFC 1918 inside. Nothing here resolves anywhere.
 */

import type { MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type BoardOutcome, type MoveResolution } from '../../services/matchEngine.js';
import { registerPositionalScenario } from '../../services/matchContent.js';
import {
  startingBoard,
  type PositionalScenario,
  type PositionalTargetSpec,
  type TargetDossier,
} from './types.js';

const SCENARIO_ID = 'rt-core-northwind';

/** Ten rounds against six systems: enough to probe, not enough to brute force it. */
const MAX_TURNS = 10;
/** Two of six covered. Red is a favourite on any single shot, and should be. */
const COVERAGE_BUDGET = 2;
/** Three repositions across the match, so moving a defence is a decision. */
const REPOSITIONS = 3;

/** Both scores are out of ten, so a UI can show x/10 for either half of a move. */
const MAX_OBJECTIVE = 10;
const MAX_JUDGE = 10;

const DOSSIER: TargetDossier = {
  org: 'Northwind Logistics',
  summary:
    'The same estate as the Tidewater campaign, late in the engagement. Red already has a ' +
    'position on the perimeter and is working inward; Blue has budget to actively watch two ' +
    'systems at a time and no more. The domain controller is what both of them are playing for.',
  facts: [
    { k: 'Objective', v: 'DC01, 10.10.5.10 (crown)' },
    { k: 'Internal segment', v: '10.10.5.0/24' },
    { k: 'Public range', v: '203.0.113.0/24' },
    { k: 'Blue coverage', v: `${COVERAGE_BUDGET} systems at a time` },
    { k: 'Repositions', v: `${REPOSITIONS} for the whole match` },
    { k: 'Clock', v: `${MAX_TURNS} rounds` },
  ],
};

/**
 * The board. Six systems, one crown.
 *
 * Ordered roughly as an attacker would walk them, outside inward, so the grid
 * itself teaches the shape of an estate rather than reading as six equal boxes.
 */
const TARGETS: PositionalTargetSpec[] = [
  { id: 'web', label: 'Web tier', note: 'nginx on 203.0.113.10. The front door, and the loudest place to stand.' },
  { id: 'mail', label: 'Mail relay', note: 'mx1 on 203.0.113.25. Where a phish lands, and where credentials leak.' },
  { id: 'vpn', label: 'VPN concentrator', note: 'vpn.northwind.example, 203.0.113.44. Remote staff, and remote attackers.' },
  { id: 'dns', label: 'Internal DNS', note: 'ns1 on 198.51.100.53. Quiet, dull, and asked a question by everything.' },
  { id: 'fileserver', label: 'File server', note: 'FS01, 10.10.5.20. Contracts and payroll exports. A natural staging point.' },
  { id: 'dc', label: 'Domain controller', note: 'DC01, 10.10.5.10. Every credential in the estate. The objective.', crown: true },
];

/** What each system means when it falls, when a shot bounces, and when it is walled. */
interface Flavour {
  /** Red's own finding on a quiet compromise. */
  compromise: string;
  /** What Blue is told when it catches a shot there. */
  detect: string;
  /** The evidence a Blue investigation turns up. */
  evidence: string;
  /** What Red is told when Blue walls it. */
  contain: string;
}

const FLAVOUR: Record<string, Flavour> = {
  web: {
    compromise: 'A webshell under the uploads directory. It survives a restart and nobody reads that log.',
    detect: 'WAF: request chain matching a known upload bypass, blocked at the edge.',
    evidence: 'An unfamiliar .aspx under wwwroot/uploads, written outside any deploy window.',
    contain: 'The upload path is gone and the shell with it. That route is closed.',
  },
  mail: {
    compromise: 'A forwarding rule on a shared mailbox. Everything finance receives, you receive.',
    detect: 'Mail security: a transport rule change from an unrecognised session.',
    evidence: 'An inbox rule created at 02:40 forwarding externally. No ticket, no change record.',
    contain: 'The rule is removed and the mailbox session revoked. Nothing is flowing out of it now.',
  },
  vpn: {
    compromise: 'A valid session on the concentrator. From here you look exactly like remote staff.',
    detect: 'VPN: authentication from an address with no prior history for that account.',
    evidence: 'A concurrent session for an account already signed in from the office subnet.',
    contain: 'The session is killed and the account forced through re-enrolment. You are outside again.',
  },
  dns: {
    compromise: 'Resolution is yours. Quiet, and it tells you what every host is asking for.',
    detect: 'Resolver: zone transfer attempt from an unauthorised source.',
    evidence: 'A resolver config edit and a burst of queries no internal host would make.',
    contain: 'The resolver is rebuilt from config management. Your view of the estate is gone.',
  },
  fileserver: {
    compromise: 'Read across the shares, and somewhere to stage before anything leaves.',
    detect: 'EDR: remote service creation on FS01 from an internal host.',
    evidence: 'A service created and deleted inside a minute, and an archive nobody asked for.',
    contain: 'The share is isolated and the staged archive removed. You are staging nowhere.',
  },
  dc: {
    compromise: 'The core. Every credential in the estate, and you got here without being seen.',
    detect: 'Domain controller: replication request from a host that is not a DC.',
    evidence: 'Directory replication from a workstation account. There is no benign version of this.',
    contain: 'The account is disabled and the tickets are being flushed estate-wide.',
  },
};

function flavourFor(targetId: string): Flavour {
  const flavour = FLAVOUR[targetId];
  if (!flavour) throw new MatchError('That system is not on this board.');
  return flavour;
}

/**
 * Score the written rationale. A DETERMINISTIC RUBRIC, NOT AN LLM.
 *
 * The same honest limitation as the linear scenarios (`recon-northwind.ts` sets
 * it out in full): the platform is offline, so there is no model to read a
 * sentence. What it can reward is a rationale that is developed rather than a
 * shrug, and one that names a consideration this game is actually about --
 * where the defences might be, what a shot gives away, what a round costs.
 * Gameable by keyword stuffing, and meant as a nudge rather than a verdict.
 */
const CONCEPT_TERMS = [
  'cover', 'coverage', 'defend', 'defence', 'defense', 'detect', 'seen', 'quiet',
  'hidden', 'guess', 'predict', 'expect', 'probe', 'bait', 'draw', 'bluff',
  'crown', 'core', 'objective', 'path', 'pivot', 'stage', 'clock', 'round',
  'turn', 'risk', 'trade', 'cost', 'contain', 'investigate', 'reposition',
  'because', 'they', 'likely', 'unlikely',
];

function judgeJustification(text: string): number {
  const t = text.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);
  let pts = 0;
  if (words.length >= 6) pts += 4;
  else if (words.length >= 3) pts += 2;
  const hits = CONCEPT_TERMS.filter((term) => t.includes(term)).length;
  pts += Math.min(6, hits * 2);
  return Math.min(MAX_JUDGE, pts);
}

function score(
  objectivePoints: number,
  note: string,
  signal: MatchSignal | null,
  justification: string,
  reveals?: RevealedFinding[],
): MoveResolution {
  return {
    score: {
      objectivePoints,
      maxObjective: MAX_OBJECTIVE,
      judgePoints: judgeJustification(justification),
      maxJudge: MAX_JUDGE,
      note,
    },
    signal,
    reveals,
  };
}

/**
 * Red's shot.
 *
 * The scores encode the lesson rather than the outcome: a caught shot is worth
 * something real, because a known defensive position is intel Red has no other
 * way to buy, and re-firing at ground you already hold is worth almost nothing,
 * because it spends the scarcest thing in the game (a round) on no information.
 */
function resolveFire(
  outcome: Extract<BoardOutcome, { kind: 'fire' }>,
  justification: string,
): MoveResolution {
  const { target, defended, spent, won } = outcome;
  const flavour = flavourFor(target.id);

  if (defended) {
    return score(
      3,
      `Covered. You are on their board now -- but you know one of their ${COVERAGE_BUDGET} eyes was on ${target.label}, ` +
        'and they only get three chances to move it.',
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
        ? 'They walled that off. There is nothing behind it any more, and you spent a round finding out.'
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
      'You reached the core and were never seen doing it. That is the entire objective.',
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
}

/**
 * Blue's answer.
 *
 * `state.board` is read here for one thing only: whether Blue had ALREADY found
 * a compromise it is now covering over. That distinction is the difference
 * between a bad read and bad luck, and a grade that cannot tell them apart
 * teaches the wrong lesson.
 */
function resolveBlue(
  state: MatchState,
  outcome: BoardOutcome,
  justification: string,
): MoveResolution {
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
          'They already hold that system, though you had no way to know. Coverage there watches an open door.',
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
      const flavour = flavourFor(target.id);
      return score(
        9,
        `Found them on ${target.label}. Now you can wall it -- containment is only available where you have looked.`,
        null,
        justification,
        [
          {
            id: `blue-ev-${target.id}`,
            kind: 'evidence',
            title: `Compromise on ${target.label}`,
            detail: flavour.evidence,
            severity: target.crown ? 'high' : 'medium',
          },
        ],
      );
    }
    case 'contain': {
      const { target } = outcome;
      const flavour = flavourFor(target.id);
      return score(
        10,
        `${target.label} is walled and their position on it is gone. That is ground taken back.`,
        { detected: true, label: `Contained: ${target.label}`, detail: flavour.contain },
        justification,
      );
    }
    default:
      throw new MatchError('That is not a move Blue can make on this board.');
  }
}

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

export const REACH_THE_CORE: PositionalScenario = {
  id: SCENARIO_ID,
  title: 'Operation Tidewater: Reach the Core',
  brief:
    'Six systems, one objective, and neither of you can see the other. Blue covers two systems ' +
    'at a time and Red never learns which. Red fires at one system a round: land on coverage and ' +
    'you are seen, land anywhere else and it is quietly yours. Blue may move a defence, look for ' +
    'what it cannot see, or wall off what it has found -- one of the three, each round. Red wins ' +
    'by taking the domain controller undetected. Blue wins by still holding it when the clock runs out.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  targets: TARGETS,
  coverageBudget: COVERAGE_BUDGET,
  movesLeft: REPOSITIONS,
  resolveBoard,
};

// Self-register on import, exactly as the linear scenarios do, so loading the
// red-blue catalogue is what makes the board playable and graded.
registerPositionalScenario(REACH_THE_CORE.id, {
  board: () => startingBoard(REACH_THE_CORE),
  resolveBoard: REACH_THE_CORE.resolveBoard,
  maxTurns: REACH_THE_CORE.maxTurns,
});
