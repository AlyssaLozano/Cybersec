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
 * bug in the scoring. The rubric itself lives in `positional-kit.ts`, shared by
 * every board, so the same move is worth the same thing on every estate.
 *
 * THE TARGET IS FABRICATED, ON PURPOSE AND BY RULE
 *
 * The same Northwind estate the linear scenarios use: `.example` names, RFC 5737
 * documentation ranges outside, RFC 1918 inside. Nothing here resolves anywhere.
 */

import { definePositional } from './positional-kit.js';

/** Ten rounds against six systems: enough to probe, not enough to brute force it. */
const MAX_TURNS = 10;
/** Two of six covered. Red is a favourite on any single shot, and should be. */
const COVERAGE_BUDGET = 2;
/** Three repositions across the match, so moving a defence is a decision. */
const REPOSITIONS = 3;

export const REACH_THE_CORE = definePositional({
  id: 'rt-core-northwind',
  title: 'Operation Tidewater: Reach the Core',
  brief:
    'Six systems, one objective, and neither of you can see the other. Blue covers two systems ' +
    'at a time and Red never learns which. Red fires at one system a round: land on coverage and ' +
    'you are seen, land anywhere else and it is quietly yours. Blue may move a defence, look for ' +
    'what it cannot see, or wall off what it has found -- one of the three, each round. Red wins ' +
    'by taking the domain controller undetected. Blue wins by still holding it when the clock runs out.',
  maxTurns: MAX_TURNS,
  coverageBudget: COVERAGE_BUDGET,
  movesLeft: REPOSITIONS,
  dossier: {
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
  },
  // Ordered roughly as an attacker would walk them, outside inward, so the grid
  // itself teaches the shape of an estate rather than reading as six equal boxes.
  targets: [
    {
      id: 'web',
      label: 'Web tier',
      note: 'nginx on 203.0.113.10. The front door, and the loudest place to stand.',
      technique: 'T1505.003 Server Software Component: Web Shell',
      flavour: {
        compromise: 'A webshell under the uploads directory. It survives a restart and nobody reads that log.',
        detect: 'WAF: request chain matching a known upload bypass, blocked at the edge.',
        evidence: 'An unfamiliar .aspx under wwwroot/uploads, written outside any deploy window.',
        contain: 'The upload path is gone and the shell with it. That route is closed.',
      },
    },
    {
      id: 'mail',
      label: 'Mail relay',
      note: 'mx1 on 203.0.113.25. Where a phish lands, and where credentials leak.',
      technique: 'T1114.003 Email Collection: Email Forwarding Rule',
      flavour: {
        compromise: 'A forwarding rule on a shared mailbox. Everything finance receives, you receive.',
        detect: 'Mail security: a transport rule change from an unrecognised session.',
        evidence: 'An inbox rule created at 02:40 forwarding externally. No ticket, no change record.',
        contain: 'The rule is removed and the mailbox session revoked. Nothing is flowing out of it now.',
      },
    },
    {
      id: 'vpn',
      label: 'VPN concentrator',
      note: 'vpn.northwind.example, 203.0.113.44. Remote staff, and remote attackers.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise: 'A valid session on the concentrator. From here you look exactly like remote staff.',
        detect: 'VPN: authentication from an address with no prior history for that account.',
        evidence: 'A concurrent session for an account already signed in from the office subnet.',
        contain: 'The session is killed and the account forced through re-enrolment. You are outside again.',
      },
    },
    {
      id: 'dns',
      label: 'Internal DNS',
      note: 'ns1 on 198.51.100.53. Quiet, dull, and asked a question by everything.',
      technique: 'T1071.004 Application Layer Protocol: DNS',
      flavour: {
        compromise: 'Resolution is yours. Quiet, and it tells you what every host is asking for.',
        detect: 'Resolver: zone transfer attempt from an unauthorised source.',
        evidence: 'A resolver config edit and a burst of queries no internal host would make.',
        contain: 'The resolver is rebuilt from config management. Your view of the estate is gone.',
      },
    },
    {
      id: 'fileserver',
      label: 'File server',
      note: 'FS01, 10.10.5.20. Contracts and payroll exports. A natural staging point.',
      technique: 'T1021.002 Remote Services: SMB/Windows Admin Shares',
      flavour: {
        compromise: 'Read across the shares, and somewhere to stage before anything leaves.',
        detect: 'EDR: remote service creation on FS01 from an internal host.',
        evidence: 'A service created and deleted inside a minute, and an archive nobody asked for.',
        contain: 'The share is isolated and the staged archive removed. You are staging nowhere.',
      },
    },
    {
      id: 'dc',
      label: 'Domain controller',
      note: 'DC01, 10.10.5.10. Every credential in the estate. The objective.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      crown: true,
      flavour: {
        compromise: 'The core. Every credential in the estate, and you got here without being seen.',
        detect: 'Domain controller: replication request from a host that is not a DC.',
        evidence: 'Directory replication from a workstation account. There is no benign version of this.',
        contain: 'The account is disabled and the tickets are being flushed estate-wide.',
      },
    },
  ],
});
