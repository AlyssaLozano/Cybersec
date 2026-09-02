/**
 * Operation Tidewater, phase five: persistence inside Northwind Logistics.
 *
 * WHERE THIS PICKS UP
 *
 * Red has deep access. The last thing an operator does is make sure a reboot or a
 * remediation does not evict them. This scenario is establishing durable access,
 * and Blue hunting for the mechanism that keeps letting them back in.
 *
 * THE SKILL EACH SIDE IS LEARNING
 *
 * Red is learning that where you hide decides whether you survive. Surveying the
 * host first shows you what already runs and looks normal, so a backdoor tucked
 * into a legitimate service is nearly invisible. Skip the survey and you are left
 * with the loud, standard mechanisms, a new account or a fresh scheduled task,
 * that every hunt and every baseline check is tuned to find. So the scoring
 * rewards surveying then blending, and marks down the obvious mechanisms.
 *
 * Blue is learning that persistence is found by knowing normal. A new account
 * shows up in an account audit; a fresh task shows up in a hunt; but a backdoor
 * blended into an existing service only shows up against a known-good baseline.
 * Reaching for a full reimage removes everything and costs everything, and doing
 * it on a hunch is its own kind of failure.
 *
 * The target is fabricated; the host uses RFC 1918 internally.
 */

import type { MatchSide, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type MoveResolution } from '../../services/matchEngine.js';
import { registerMatchScenario } from '../../services/matchContent.js';
import type { AttackerConsole, MoveOption, RedBlueScenario, TargetDossier } from './types.js';

const SCENARIO_ID = 'rt-persist-northwind';
const MAX_TURNS = 5;
const MAX_OBJECTIVE = 10;
const MAX_JUDGE = 10;

const DOSSIER: TargetDossier = {
  org: 'Northwind Logistics',
  summary:
    'Deep access on the file server. Objective: durable access that survives a reboot and a ' +
    'remediation. The prize is staying in. Authorised assessment.',
  facts: [
    { k: 'Position', v: '10.10.5.20 (file server, SYSTEM)' },
    { k: 'Existing task', v: 'update-check runs hourly as SYSTEM (a good place to hide)' },
    { k: 'Telemetry', v: 'EDR on the host; account events on the DC' },
    { k: 'Baseline', v: 'A known-good image of the host exists' },
    { k: 'Internal range', v: '10.10.5.0/24 (private)' },
  ],
};

const RED_OPTIONS: MoveOption[] = [
  { id: 'wait', label: 'Hold and blend', description: 'No action. Rely on the access you have and stay quiet.' },
  { id: 'survey-autoruns', label: 'Survey autoruns', description: 'Enumerate the services and tasks that already run. Find where to hide.' },
  { id: 'scheduled-task', label: 'New scheduled task', description: 'Create a task that re-runs your payload. Durable, and logged.' },
  { id: 'create-account', label: 'Create an account', description: 'A new local account for a way back in. Durable, and very loud.' },
  { id: 'blend-backdoor', label: 'Blend into a service', description: 'Hide the backdoor inside an existing legitimate task. Quiet, if you surveyed first.' },
];

const BLUE_OPTIONS: MoveOption[] = [
  { id: 'monitor', label: 'Hold and monitor', description: 'No action. Keep watching the host telemetry.' },
  { id: 'hunt-persistence', label: 'Hunt persistence', description: 'Hunt autoruns, tasks, and services for what does not belong.' },
  { id: 'audit-accounts', label: 'Audit accounts', description: 'Review recent account creations and changes.' },
  { id: 'baseline-compare', label: 'Compare to baseline', description: 'Diff the host against its known-good image. Catches the subtle.' },
  { id: 'reimage-host', label: 'Reimage the host', description: 'Rebuild from clean. Removes all persistence, costs an outage.' },
];

/** True once Red has surveyed the host, so a blended backdoor can look native. */
function hasSurvey(state: MatchState): boolean {
  return state.moves.some((m) => m.side === 'red' && m.optionId === 'survey-autoruns');
}

type RedThreat = 'quiet' | 'survey' | 'task' | 'account' | 'blend';

function redThreat(state: MatchState): RedThreat {
  for (let i = state.moves.length - 1; i >= 0; i -= 1) {
    const m = state.moves[i];
    if (!m || m.side !== 'red') continue;
    switch (m.optionId) {
      case 'survey-autoruns':
        return 'survey';
      case 'scheduled-task':
        return 'task';
      case 'create-account':
        return 'account';
      case 'blend-backdoor':
        return 'blend';
      default:
        return 'quiet';
    }
  }
  return 'quiet';
}

function judge(text: string): number {
  const t = text.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);
  const terms = [
    'quiet', 'loud', 'noise', 'detect', 'edr', 'persist', 'survive', 'reboot', 'blend', 'hide',
    'service', 'task', 'account', 'survey', 'baseline', 'reimage', 'native', 'before', 'first', 'durable',
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
  const surveyed = hasSurvey(state);
  switch (optionId) {
    case 'wait':
      return score(5, 'Relying on the access you have. Nothing new to find.', null, justification);
    case 'survey-autoruns':
      return score(
        7,
        'You cannot blend in until you know what normal looks like. Reading the existing tasks and services is quiet, and it is what makes the next move invisible.',
        { detected: true, label: 'Autoruns enumerated', detail: 'A read of scheduled tasks and service configs on the host.' },
        justification,
        [{ id: 'update-task', kind: 'service', title: 'A place to hide', detail: 'update-check runs hourly as SYSTEM. Blending a backdoor into it would look native.', severity: 'low' }],
        ['Sep 05 08:02:11 edr fileserver: 4688 process create schtasks.exe /query'],
      );
    case 'scheduled-task':
      return score(
        6,
        'It survives a reboot, and it is the first thing every hunt looks at. A brand new task is durable and obvious.',
        { detected: true, label: 'Scheduled task created', detail: 'A new task was registered on the host.' },
        justification,
        [{ id: 'task-backdoor', kind: 'vuln', title: 'Scheduled-task backdoor', detail: 'A new task re-runs the payload at logon. Durable, but stands out in any task listing.', severity: 'high' }],
        ['Sep 05 08:10:44 edr fileserver: 4698 scheduled task created name=SysUpdate2 by SYSTEM'],
      );
    case 'create-account':
      return score(
        4,
        'A new account is a way back in and a flare. Account creation is one of the loudest events on the estate, and the first thing an audit turns up.',
        { detected: true, label: 'New account created', detail: 'A new local account appeared on the host.' },
        justification,
        [{ id: 'rogue-account', kind: 'vuln', title: 'Rogue account', detail: 'A new local account svc-update was created for re-entry. Durable, and very loud.', severity: 'high' }],
        ['Sep 05 08:12:03 edr fileserver: 4720 account created name=svc-update by SYSTEM'],
      );
    case 'blend-backdoor':
      if (!surveyed) {
        return score(
          6,
          'The backdoor is planted, but you did not learn what normal looks like first, so it does not match the host and a baseline check will notice.',
          { detected: true, label: 'Unfamiliar autorun', detail: 'A service entry that does not match the host baseline.' },
          justification,
          [{ id: 'backdoor-loud', kind: 'vuln', title: 'Backdoor planted (stands out)', detail: 'Persistence set, but it does not resemble the host normal services.', severity: 'high' }],
          ['Sep 05 08:15:20 edr fileserver: service config changed name=UpdateSvcX (new)'],
        );
      }
      return score(
        10,
        'Tucked inside the update-check task, running as the account it always runs as. Unless someone diffs against a known-good baseline, this reads as the host doing its job.',
        { detected: true, label: 'Service config change', detail: 'A small modification to an existing, legitimate task.' },
        justification,
        [{ id: 'backdoor-blend', kind: 'vuln', title: 'Backdoor blended in', detail: 'The backdoor rides inside update-check, looking native. Only a baseline diff reliably catches it.', severity: 'high' }],
        ['Sep 05 08:16:07 edr fileserver: update-check task modified (minor)'],
      );
    default:
      throw new MatchError('That is not a red move in this scenario.');
  }
}

function blueEvidence(threat: RedThreat): RevealedFinding[] {
  switch (threat) {
    case 'survey':
      return [{ id: 'ev-survey', kind: 'evidence', title: 'Autorun enumeration', detail: 'schtasks and service queries from a SYSTEM process. Someone is learning the host.', severity: 'medium' }];
    case 'task':
      return [{ id: 'ev-task', kind: 'evidence', title: 'New scheduled task', detail: 'A task SysUpdate2 that nobody created through change control.', severity: 'high' }];
    case 'account':
      return [{ id: 'ev-account', kind: 'evidence', title: 'New local account', detail: 'svc-update created outside of any onboarding. A textbook persistence account.', severity: 'high' }];
    case 'blend':
      return [{ id: 'ev-blend', kind: 'evidence', title: 'Modified legitimate task', detail: 'update-check was altered. It looks native, and only a baseline diff shows the change.', severity: 'medium' }];
    default:
      return [];
  }
}

function resolveBlue(state: MatchState, optionId: string, justification: string): MoveResolution {
  const threat = redThreat(state);
  const reimaged: MatchSignal = { detected: true, label: 'Host reimaged', detail: 'The host was rebuilt from a clean image.' };
  const persistence = threat === 'task' || threat === 'account' || threat === 'blend';

  switch (optionId) {
    case 'monitor':
      if (threat === 'quiet') return score(8, 'Nothing to act on. Holding was right.', null, justification);
      if (threat === 'survey') return score(5, 'Enumeration showed and you watched. Defensible, briefly.', null, justification);
      return score(threat === 'blend' ? 2 : 3, 'They set persistence while you held. That is a miss you will pay for later.', null, justification);
    case 'hunt-persistence':
      if (threat === 'quiet') return score(5, 'Little to find, but hunting the autoruns is never wasted.', null, justification, blueEvidence(threat));
      if (threat === 'blend') return score(6, 'You hunted, but a backdoor riding a legitimate task barely stands out to a hunt.', null, justification, blueEvidence(threat));
      return score(9, 'A hunt through tasks and services turned the mechanism up.', null, justification, blueEvidence(threat));
    case 'audit-accounts':
      if (threat === 'account') return score(10, 'A new account, met with an account audit. Exactly the right lens.', null, justification, blueEvidence(threat));
      return score(threat === 'quiet' ? 2 : 4, 'Auditing accounts when the persistence was not an account looks in the wrong place.', null, justification);
    case 'baseline-compare':
      if (threat === 'blend') return score(10, 'A backdoor hidden in a legitimate task, caught by diffing against known-good. The only lens that reliably sees it.', null, justification, blueEvidence(threat));
      if (persistence) return score(7, 'A baseline diff is a strong lens, and it would flag a new task or account too.', null, justification, blueEvidence(threat));
      return score(threat === 'quiet' ? 3 : 5, 'Comparing to baseline with nothing changed yet is thorough, if early.', null, justification);
    case 'reimage-host':
      if (persistence) return score(9, 'Persistence is set. Rebuilding from clean removes all of it, and yes, it costs an outage.', reimaged, justification);
      return score(2, 'Reimaging a host that has nothing on it yet is an outage you chose for a hunch.', reimaged, justification);
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

const HELP = [
  'Persistence console. Host: 10.10.5.20 (SYSTEM). Tools:',
  '  schtasks /query          survey existing tasks and services (quiet)',
  '  schtasks /create ...     new scheduled task backdoor         (durable, loud)',
  '  net user /add ...        new local account                   (durable, very loud)',
  '  sc config / reg add ...  blend a backdoor into a real task   (quiet, survey first)',
  '  wait                     hold and rely on current access',
  'Each real action is your move for the turn. Say why before you run it.',
  '',
].join('\n');

function attackerRun(command: string): { output: string; optionId: string | null } {
  const cmd = command.trim();
  const tool = (cmd.split(/\s+/)[0] ?? '').toLowerCase();
  const lower = cmd.toLowerCase();
  if (tool === 'help' || tool === '?') return { output: HELP, optionId: null };
  if (tool === 'wait' || tool === 'sleep') return { output: 'Holding. Relying on current access.\n', optionId: 'wait' };
  if (tool === 'autoruns' || tool === 'autorunsc' || (tool === 'schtasks' && lower.includes('/query')) || (tool === 'sc' && lower.includes('query'))) {
    return { output: 'update-check   Hourly   SYSTEM   \\Windows\\update-check.exe\n... 41 tasks, 63 services\n', optionId: 'survey-autoruns' };
  }
  if (tool === 'schtasks' && lower.includes('/create')) {
    return { output: 'SUCCESS: The scheduled task "SysUpdate2" has been created.\n', optionId: 'scheduled-task' };
  }
  if (tool === 'net' && lower.includes('user') && lower.includes('/add')) {
    return { output: 'The command completed successfully. (svc-update)\n', optionId: 'create-account' };
  }
  if (tool === 'sc' || tool === 'reg' || lower.includes('config') || lower.includes('update-check')) {
    return { output: '[SC] ChangeServiceConfig SUCCESS (update-check)\n', optionId: 'blend-backdoor' };
  }
  return { output: `${tool || 'that'}: not a tool on this console. Type help.\n`, optionId: null };
}

const ATTACKER_CONSOLE: AttackerConsole = {
  banner: [
    'Persistence console attached. Host: 10.10.5.20 (SYSTEM).',
    'Type help for tools. Every real action is your move for the turn.',
  ],
  run: attackerRun,
};

export const PERSIST_NORTHWIND: RedBlueScenario = {
  id: SCENARIO_ID,
  title: 'Operation Tidewater: Persistence',
  brief:
    'Deep access, and the last job: make it durable. Red decides how to survive a reboot, loudly ' +
    'or by blending in; Blue decides which lens to bring, from an account audit to a full reimage. ' +
    'Red wins by surveying then hiding in plain sight; Blue wins by knowing normal well enough to ' +
    'see the one thing that changed.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  red: RED_OPTIONS,
  blue: BLUE_OPTIONS,
  resolve,
  attacker: ATTACKER_CONSOLE,
};

registerMatchScenario(PERSIST_NORTHWIND.id, PERSIST_NORTHWIND.resolve, { maxTurns: PERSIST_NORTHWIND.maxTurns });
