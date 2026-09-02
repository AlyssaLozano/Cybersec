/**
 * Operation Tidewater, phase two: initial access against Northwind Logistics.
 *
 * WHERE THIS PICKS UP
 *
 * Recon found the exposed Tomcat manager on 203.0.113.10:8080. This scenario is
 * the foothold: Red turns that finding into access, and Blue tries to catch it
 * before a webshell lands.
 *
 * THE SKILL EACH SIDE IS LEARNING
 *
 * Red is learning that access is a CHAIN, and that how you get in decides whether
 * you keep it. Brute force works and screams; a reused credential works and looks
 * like a Tuesday. The webshell is the objective, but deploying it before you have
 * a session is a loud nothing. So the scoring rewards getting in QUIETLY and IN
 * ORDER, and punishes reaching for the payload with no session behind it.
 *
 * Blue is learning to match the response to the intrusion. A brute-force spray is
 * loud and asks for an account lock; a single successful login from a reused
 * credential is nearly silent and asks for a rotation, not a lock; a deployed
 * webshell asks for the manager to come down now. Reading which of those actually
 * happened is the whole job.
 *
 * The target is fabricated. northwind.example is a reserved TLD and every address
 * is an RFC 5737 documentation range.
 */

import type { MatchSide, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type MoveResolution } from '../../services/matchEngine.js';
import { registerMatchScenario } from '../../services/matchContent.js';
import type { AttackerConsole, MoveOption, RedBlueScenario, TargetDossier } from './types.js';

const SCENARIO_ID = 'rt-foothold-northwind';
const MAX_TURNS = 5;
const MAX_OBJECTIVE = 10;
const MAX_JUDGE = 10;

const DOSSIER: TargetDossier = {
  org: 'Northwind Logistics',
  summary:
    'Recon complete. The Apache Tomcat 8.5.0 manager on 203.0.113.10:8080 is reachable from ' +
    'outside. Objective: a foothold on the web tier. Authorised assessment.',
  facts: [
    { k: 'Target', v: '203.0.113.10:8080 (Apache Tomcat 8.5.0)' },
    { k: 'Manager', v: '/manager/html reachable externally' },
    { k: 'Service account', v: 'deploy-svc (from job posts and a breach dump)' },
    { k: 'Auth log', v: '/var/log/edge.log on the edge appliance' },
    { k: 'Public range', v: '203.0.113.0/24' },
  ],
};

const RED_OPTIONS: MoveOption[] = [
  { id: 'wait', label: 'Hold and observe', description: 'Take no action this turn. Watch, and give nothing away.' },
  { id: 'try-default', label: 'Try default credentials', description: 'tomcat/tomcat and admin/admin. Cheap, and usually wrong.' },
  { id: 'spray-common', label: 'Spray common passwords', description: 'A common-password list against the manager. Loud.' },
  { id: 'use-leaked-creds', label: 'Use a reused credential', description: 'A deploy-svc password from a breach dump. One quiet login.' },
  { id: 'deploy-webshell', label: 'Deploy a webshell', description: 'Upload a WAR shell via the manager. The objective, if you have a session.' },
];

const BLUE_OPTIONS: MoveOption[] = [
  { id: 'monitor', label: 'Hold and monitor', description: 'No action. Keep watching the auth log.' },
  { id: 'investigate-auth', label: 'Investigate auth log', description: 'Read the manager logins on the edge appliance.' },
  { id: 'lock-account', label: 'Lock the manager account', description: 'Lock deploy-svc after repeated failures.' },
  { id: 'rotate-creds', label: 'Rotate the credential', description: 'Force a new manager password, killing a reused one.' },
  { id: 'disable-manager', label: 'Disable the manager', description: 'Take /manager offline. Kills the vector, breaks deploys.' },
];

/** True once Red holds a manager session (a quiet reuse, or a spray that landed). */
function hasAccess(state: MatchState): boolean {
  return state.moves.some(
    (m) => m.side === 'red' && (m.optionId === 'use-leaked-creds' || m.optionId === 'spray-common'),
  );
}

/** What Red's most recent move was, as Blue would classify the threat. */
type RedThreat = 'quiet' | 'brute' | 'compromise' | 'webshell';

function redThreat(state: MatchState): RedThreat {
  for (let i = state.moves.length - 1; i >= 0; i -= 1) {
    const m = state.moves[i];
    if (!m || m.side !== 'red') continue;
    switch (m.optionId) {
      case 'spray-common':
        return 'brute';
      case 'use-leaked-creds':
        return 'compromise';
      case 'deploy-webshell':
        return hasAccessBefore(state, i) ? 'webshell' : 'brute';
      default:
        return 'quiet';
    }
  }
  return 'quiet';
}

/** Whether access existed at the point move `index` was made. */
function hasAccessBefore(state: MatchState, index: number): boolean {
  return state.moves
    .slice(0, index)
    .some((m) => m.side === 'red' && (m.optionId === 'use-leaked-creds' || m.optionId === 'spray-common'));
}

function judge(text: string): number {
  const t = text.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);
  const terms = [
    'quiet', 'loud', 'noise', 'detect', 'log', 'session', 'access', 'credential', 'reuse',
    'brute', 'lock', 'rotate', 'webshell', 'shell', 'foothold', 'contain', 'before', 'first', 'chain',
  ];
  let pts = words.length >= 6 ? 4 : words.length >= 3 ? 2 : 0;
  pts += Math.min(6, terms.filter((k) => t.includes(k)).length * 3);
  return Math.min(MAX_JUDGE, pts);
}

function score(
  objectivePoints: number,
  note: string,
  signal: MatchSignal | null,
  justification: string,
  reveals?: RevealedFinding[],
  hostLog?: string[],
): MoveResolution {
  return {
    score: { objectivePoints, maxObjective: MAX_OBJECTIVE, judgePoints: judge(justification), maxJudge: MAX_JUDGE, note },
    signal,
    reveals,
    hostLog,
  };
}

function resolveRed(state: MatchState, optionId: string, justification: string): MoveResolution {
  const access = hasAccess(state);
  switch (optionId) {
    case 'wait':
      return score(5, 'Patience. Nothing given away this turn.', null, justification);
    case 'try-default':
      return score(
        3,
        'Default creds are the first thing anyone tries, and the first thing anyone disables. Low yield, and it makes noise.',
        { detected: true, label: 'Failed manager logins', detail: 'A couple of rejected logins to /manager.' },
        justification,
        [{ id: 'default-rejected', kind: 'service', title: 'Default creds rejected', detail: 'tomcat/tomcat and admin/admin do not work.', severity: 'info' }],
        [
          'Sep 02 09:14:02 edge tomcat: 401 /manager/html user=tomcat from 203.0.113.9',
          'Sep 02 09:14:05 edge tomcat: 401 /manager/html user=admin from 203.0.113.9',
        ],
      );
    case 'spray-common':
      return score(
        access ? 2 : 5,
        access
          ? 'You already have a session. Spraying now is noise for nothing.'
          : 'It works, and it is the loudest way in. Dozens of failures then a hit is the clearest brute-force signature there is.',
        { detected: true, label: 'Brute force on manager', detail: 'Many rejected logins then one success from a single source.' },
        justification,
        [{ id: 'weak-cred', kind: 'vuln', title: 'Manager access via weak password', detail: 'deploy-svc used a common password. Session obtained, loudly.', severity: 'high' }],
        [
          'Sep 02 09:20:11 edge tomcat: 401 /manager/html user=deploy-svc (x38) from 203.0.113.9',
          'Sep 02 09:20:49 edge tomcat: 200 /manager/html user=deploy-svc from 203.0.113.9',
        ],
      );
    case 'use-leaked-creds':
      return score(
        9,
        'A reused credential is the quiet way in. One successful login looks like the service account doing its job.',
        { detected: true, label: 'Manager login', detail: 'A single successful login to /manager as deploy-svc.' },
        justification,
        [{ id: 'reuse-access', kind: 'vuln', title: 'Authenticated as deploy-svc', detail: 'A breach-dump password still works. Quiet session obtained.', severity: 'high' }],
        ['Sep 02 09:31:07 edge tomcat: 200 /manager/html user=deploy-svc from 203.0.113.9'],
      );
    case 'deploy-webshell':
      if (!access) {
        return score(
          1,
          'The manager rejected the upload: you have no session. A loud attempt at the payload with nothing behind it.',
          { detected: true, label: 'Unauthorized deploy attempt', detail: 'A 403 on a manager deploy from an unauthenticated source.' },
          justification,
          [{ id: 'deploy-rejected', kind: 'service', title: 'Deploy rejected', detail: 'No manager session; the WAR upload was refused.', severity: 'info' }],
          ['Sep 02 09:33:40 edge tomcat: 403 /manager/deploy from 203.0.113.9 (no session)'],
        );
      }
      return score(
        10,
        'Foothold. The shell is live. This is the objective, and you reached it with a session already in hand.',
        { detected: true, label: 'New application deployed', detail: 'A previously unseen WAR was deployed via the manager.' },
        justification,
        [{ id: 'webshell', kind: 'vuln', title: 'Webshell deployed', detail: 'A WAR shell is live at /shell/. Foothold established on the web tier.', severity: 'high' }],
        ['Sep 02 09:35:12 edge tomcat: 200 /manager/deploy?path=/shell user=deploy-svc from 203.0.113.9'],
      );
    default:
      throw new MatchError('That is not a red move in this scenario.');
  }
}

function blueEvidence(threat: RedThreat): RevealedFinding[] {
  switch (threat) {
    case 'brute':
      return [{ id: 'ev-brute', kind: 'evidence', title: 'Brute force in the auth log', detail: 'Dozens of 401s to /manager then a 200, all from 203.0.113.9.', severity: 'high' }];
    case 'compromise':
      return [{ id: 'ev-login', kind: 'evidence', title: 'Lone successful login', detail: 'One 200 to /manager as deploy-svc from an external address. No failures before it.', severity: 'medium' }];
    case 'webshell':
      return [{ id: 'ev-deploy', kind: 'evidence', title: 'Unexpected deploy', detail: 'A manager deploy of an app nobody scheduled, from an external source.', severity: 'high' }];
    default:
      return [];
  }
}

function resolveBlue(state: MatchState, optionId: string, justification: string): MoveResolution {
  const threat = redThreat(state);
  const offline: MatchSignal = { detected: true, label: 'Manager offline', detail: 'The Tomcat manager stopped responding.' };
  const rotated: MatchSignal = { detected: true, label: 'Credential rejected', detail: 'The deploy-svc password no longer works.' };
  const locked: MatchSignal = { detected: true, label: 'Account locked', detail: 'The deploy-svc account was locked out.' };

  switch (optionId) {
    case 'monitor':
      if (threat === 'quiet') return score(8, 'Nothing actionable landed. Holding was right.', null, justification);
      if (threat === 'compromise') return score(4, 'A quiet login slipped by. Understandable, but it slipped by.', null, justification);
      return score(threat === 'webshell' ? 1 : 3, 'Something real happened and you sat on it.', null, justification);
    case 'investigate-auth':
      if (threat === 'quiet') return score(5, 'Little to find, but reading the log is never wrong.', null, justification, blueEvidence(threat));
      return score(9, 'You pulled the log and saw exactly what happened.', null, justification, blueEvidence(threat));
    case 'lock-account':
      if (threat === 'brute') return score(10, 'A brute-force spray, met with an account lock. Correct.', locked, justification);
      if (threat === 'quiet') return score(3, 'Locking an account nothing has attacked yet just pages the owner.', locked, justification);
      return score(5, 'A lock helps, but this intrusion was past the login already.', locked, justification);
    case 'rotate-creds':
      if (threat === 'compromise') return score(10, 'A reused credential, rotated out from under them. The right counter to a quiet login.', rotated, justification);
      if (threat === 'brute') return score(6, 'Rotating helps, though a lock is the sharper answer to a spray.', rotated, justification);
      return score(threat === 'webshell' ? 5 : 3, 'Rotating a credential does not remove a shell that is already deployed.', rotated, justification);
    case 'disable-manager':
      if (threat === 'webshell') return score(10, 'A shell is live. Taking the manager down now is the call, cost and all.', offline, justification);
      if (threat === 'compromise' || threat === 'brute') return score(8, 'They are in or nearly in. Pulling the manager is defensible.', offline, justification);
      return score(2, 'Taking the manager offline before anything happened breaks deploys for no reason.', offline, justification);
    default:
      throw new MatchError('That is not a blue move in this scenario.');
  }
}

const resolve = ({
  state,
  side,
  optionId,
  justification,
}: {
  state: MatchState;
  side: MatchSide;
  optionId: string;
  justification: string;
}): MoveResolution =>
  side === 'red' ? resolveRed(state, optionId, justification) : resolveBlue(state, optionId, justification);

/** Red's exploitation console for the terminal tiers. */
const HELP = [
  'Foothold console. Target: 203.0.113.10:8080 (Tomcat manager). Tools:',
  '  curl -u tomcat:tomcat .../manager   try default credentials  (low yield)',
  '  hydra -l deploy-svc -P list ...      spray common passwords    (loud)',
  '  curl -u deploy-svc:<pass> .../manager   use an obtained credential (quiet)',
  '  curl -T shell.war .../manager/deploy    deploy a webshell (needs a session)',
  '  wait                                 hold and observe',
  'Each real action is your move for the turn. Say why before you run it.',
  '',
].join('\n');

function attackerRun(command: string): { output: string; optionId: string | null } {
  const cmd = command.trim();
  const tool = (cmd.split(/\s+/)[0] ?? '').toLowerCase();
  const lower = cmd.toLowerCase();
  if (tool === 'help' || tool === '?') return { output: HELP, optionId: null };
  if (tool === 'wait' || tool === 'sleep') return { output: 'Holding. No packets sent.\n', optionId: 'wait' };
  if (tool === 'hydra' || tool === 'medusa' || tool === 'patator') {
    return { output: '[8080][http-get] host: 203.0.113.10   login: deploy-svc   password: Summer2024\n1 of 1 target successfully completed\n', optionId: 'spray-common' };
  }
  if (tool === 'curl' || tool === 'wget') {
    if (lower.includes('.war') || lower.includes('/deploy') || lower.includes('--upload-file')) {
      return { output: 'OK - Deployed application at context path [/shell]\n', optionId: 'deploy-webshell' };
    }
    if (lower.includes('tomcat:tomcat') || lower.includes('admin:admin')) {
      return { output: 'HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Basic realm="Tomcat Manager Application"\n', optionId: 'try-default' };
    }
    if (lower.includes('-u ') || lower.includes('deploy-svc')) {
      return { output: 'HTTP/1.1 200 OK\nTomcat Manager Application - deploy-svc authenticated\n', optionId: 'use-leaked-creds' };
    }
    return { output: 'HTTP/1.1 401 Unauthorized\n', optionId: 'try-default' };
  }
  return { output: `${tool || 'that'}: not a tool on this console. Type help.\n`, optionId: null };
}

const ATTACKER_CONSOLE: AttackerConsole = {
  banner: [
    'Foothold console attached. Target: 203.0.113.10:8080 (Tomcat manager).',
    'Type help for tools. Every real action is your move for the turn.',
  ],
  run: attackerRun,
};

export const FOOTHOLD_NORTHWIND: RedBlueScenario = {
  id: SCENARIO_ID,
  title: 'Operation Tidewater: Foothold',
  brief:
    'The recon is in: the Tomcat manager is exposed. Red turns that into access and a foothold; ' +
    'Blue reads the auth log and decides how hard to hit back. Red wins by getting in quietly and ' +
    'in order; Blue wins by matching the response to what actually happened.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  red: RED_OPTIONS,
  blue: BLUE_OPTIONS,
  resolve,
  attacker: ATTACKER_CONSOLE,
};

registerMatchScenario(FOOTHOLD_NORTHWIND.id, FOOTHOLD_NORTHWIND.resolve, { maxTurns: FOOTHOLD_NORTHWIND.maxTurns });
