/**
 * Operation Tidewater, phase three: lateral movement inside Northwind Logistics.
 *
 * WHERE THIS PICKS UP
 *
 * Red holds a webshell on the web tier (203.0.113.10). The prize is inside: a
 * file server and a domain controller on the internal network. This scenario is
 * the pivot from the edge to the core.
 *
 * THE SKILL EACH SIDE IS LEARNING
 *
 * Red is learning that moving inside is its own chain, and that the loud way and
 * the quiet way reach the same place. You cannot move with credentials you have
 * not taken, and once you have them, a pass-the-hash login looks like the service
 * account doing its job while PsExec drops a service that lights up every EDR on
 * the estate. So the scoring rewards taking the credentials first and then moving
 * QUIETLY, and it marks down the noisy shortcut even though it works.
 *
 * Blue is learning that lateral movement is caught in the middle of the estate,
 * not at the edge. The tools are hunting for internal reconnaissance, resetting a
 * dumped credential before it is used, isolating the beachhead, and segmenting
 * the crown jewels off. The wrong-sized response, isolating on a hunch or sitting
 * on a live credential dump, is the failure this rehearses away.
 *
 * Internal hosts use RFC 1918 private ranges; the external foothold and anything
 * routable use RFC 5737 documentation ranges. Northwind is fabricated.
 */

import type { MatchSide, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type MoveResolution } from '../../services/matchEngine.js';
import { registerMatchScenario } from '../../services/matchContent.js';
import type { AttackerConsole, MoveOption, RedBlueScenario, TargetDossier } from './types.js';

const SCENARIO_ID = 'rt-lateral-northwind';
const MAX_TURNS = 5;
const MAX_OBJECTIVE = 10;
const MAX_JUDGE = 10;

const DOSSIER: TargetDossier = {
  org: 'Northwind Logistics',
  summary:
    'Foothold established on the web tier via a webshell. Objective: reach the internal file ' +
    'server. The prize is inside, behind the edge. Authorised assessment.',
  facts: [
    { k: 'Foothold', v: '203.0.113.10 (web tier, deploy-svc)' },
    { k: 'Internal range', v: '10.10.5.0/24 (private)' },
    { k: 'File server', v: '10.10.5.20 (the objective)' },
    { k: 'Domain controller', v: '10.10.5.10' },
    { k: 'Telemetry', v: 'EDR on internal hosts; edge log at /var/log/edge.log' },
  ],
};

const RED_OPTIONS: MoveOption[] = [
  { id: 'wait', label: 'Hold and blend', description: 'No action. Sit on the foothold and look like traffic.' },
  { id: 'enumerate-internal', label: 'Enumerate internal', description: 'Map the internal network from the foothold. Find the targets.' },
  { id: 'dump-credentials', label: 'Dump credentials', description: 'Pull cached credentials off the compromised host. Loud on EDR.' },
  { id: 'pass-the-hash', label: 'Pass the hash', description: 'Authenticate to the file server with a dumped credential. Quiet, if you have one.' },
  { id: 'psexec', label: 'Remote exec (PsExec)', description: 'Drop a service on the file server. Reaches it, and screams.' },
];

const BLUE_OPTIONS: MoveOption[] = [
  { id: 'monitor', label: 'Hold and monitor', description: 'No action. Keep watching the telemetry.' },
  { id: 'hunt-internal', label: 'Threat hunt', description: 'Hunt the internal telemetry for recon and odd logins.' },
  { id: 'reset-credentials', label: 'Reset the credential', description: 'Force a reset of the service account, killing a dumped one.' },
  { id: 'isolate-host', label: 'Isolate the beachhead', description: 'Network-isolate the compromised web host. Contains the pivot.' },
  { id: 'segment-network', label: 'Segment the core', description: 'Tighten segmentation to the file server and DC.' },
];

/** True once Red has dumped credentials to move with. */
function hasCreds(state: MatchState): boolean {
  return state.moves.some((m) => m.side === 'red' && m.optionId === 'dump-credentials');
}

type RedThreat = 'quiet' | 'recon' | 'creds' | 'lateral-quiet' | 'lateral-loud';

function credsBefore(state: MatchState, index: number): boolean {
  return state.moves.slice(0, index).some((m) => m.side === 'red' && m.optionId === 'dump-credentials');
}

function redThreat(state: MatchState): RedThreat {
  for (let i = state.moves.length - 1; i >= 0; i -= 1) {
    const m = state.moves[i];
    if (!m || m.side !== 'red') continue;
    switch (m.optionId) {
      case 'enumerate-internal':
        return 'recon';
      case 'dump-credentials':
        return 'creds';
      case 'pass-the-hash':
        return credsBefore(state, i) ? 'lateral-quiet' : 'recon';
      case 'psexec':
        return credsBefore(state, i) ? 'lateral-loud' : 'recon';
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
    'quiet', 'loud', 'noise', 'detect', 'edr', 'credential', 'hash', 'dump', 'lateral', 'pivot',
    'move', 'internal', 'segment', 'isolate', 'reset', 'session', 'before', 'first', 'chain', 'blend',
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
  const creds = hasCreds(state);
  switch (optionId) {
    case 'wait':
      return score(5, 'Sitting still and looking like traffic. Nothing given away.', null, justification);
    case 'enumerate-internal':
      return score(
        7,
        'You cannot move toward what you have not mapped. Necessary, and internal scanning does leave a trace on EDR.',
        { detected: true, label: 'Internal host discovery', detail: 'Sweeps across 10.10.5.0/24 from the web host.' },
        justification,
        [
          { id: 'int-fileserver', kind: 'service', title: 'File server', detail: '10.10.5.20, the objective, reachable from the foothold.', severity: 'low' },
          { id: 'int-dc', kind: 'service', title: 'Domain controller', detail: '10.10.5.10 on the internal segment.', severity: 'info' },
        ],
        ['Sep 03 11:02:14 edr web-tier: internal scan 203.0.113.10 -> 10.10.5.0/24 (host discovery)'],
      );
    case 'dump-credentials':
      return score(
        6,
        'The key to moving, and one of the loudest things you can do on a host. Credential access is what EDR is tuned hardest to catch.',
        { detected: true, label: 'Credential access on host', detail: 'A process read credential material on the web host.' },
        justification,
        [{ id: 'creds', kind: 'vuln', title: 'Cached credentials dumped', detail: 'svc-backup credential recovered from the web host. Usable for lateral movement.', severity: 'high' }],
        ['Sep 03 11:08:41 edr web-tier: credential-access alert (LSASS read) pid=4820'],
      );
    case 'pass-the-hash':
      if (!creds) {
        return score(
          1,
          'Nothing to pass. You have taken no credential, so there is no hash to move with.',
          { detected: true, label: 'Failed authentication', detail: 'A rejected login to the file server.' },
          justification,
          [{ id: 'lateral-failed', kind: 'service', title: 'Lateral move failed', detail: 'No credential in hand; the file server refused the login.', severity: 'info' }],
          ['Sep 03 11:10:03 edr fileserver: 4625 failed logon svc-backup from 203.0.113.10'],
        );
      }
      return score(
        10,
        'On the file server, and it looks like the service account signing in as it does every day. The quiet way is the whole point.',
        { detected: true, label: 'Service account login', detail: 'A successful svc-backup login to the file server. Looks routine.' },
        justification,
        [{ id: 'reached-fileserver', kind: 'vuln', title: 'Reached the file server', detail: '10.10.5.20 accessed via svc-backup. Reads like normal authentication.', severity: 'high' }],
        ['Sep 03 11:12:20 edr fileserver: 4624 logon svc-backup from 203.0.113.10 (network)'],
      );
    case 'psexec':
      if (!creds) {
        return score(
          1,
          'PsExec needs a credential, and you have none. A loud attempt that goes nowhere.',
          { detected: true, label: 'Failed remote exec', detail: 'A rejected service-creation attempt on the file server.' },
          justification,
          [{ id: 'lateral-failed', kind: 'service', title: 'Lateral move failed', detail: 'No credential; the remote exec was refused.', severity: 'info' }],
          ['Sep 03 11:11:15 edr fileserver: 4625 failed logon from 203.0.113.10 (service create)'],
        );
      }
      return score(
        6,
        'On the file server, but you announced it. A new service and a spawned process is the textbook PsExec signature. It works, and it is the loud way.',
        { detected: true, label: 'Remote service creation', detail: 'A new service and a spawned shell on the file server.' },
        justification,
        [{ id: 'reached-fileserver', kind: 'vuln', title: 'Reached the file server', detail: '10.10.5.20 accessed via PsExec. A service was created; this is noisy.', severity: 'high' }],
        [
          'Sep 03 11:12:44 edr fileserver: 7045 service installed name=PSEXESVC from 203.0.113.10',
          'Sep 03 11:12:45 edr fileserver: 4688 process create cmd.exe parent=services.exe',
        ],
      );
    default:
      throw new MatchError('That is not a red move in this scenario.');
  }
}

function blueEvidence(threat: RedThreat): RevealedFinding[] {
  switch (threat) {
    case 'recon':
      return [{ id: 'ev-scan', kind: 'evidence', title: 'Internal host discovery', detail: 'The web host swept 10.10.5.0/24. A foothold does not do that on its own.', severity: 'medium' }];
    case 'creds':
      return [{ id: 'ev-creds', kind: 'evidence', title: 'Credential-access alert', detail: 'A credential read on the web host. The beachhead is arming to move.', severity: 'high' }];
    case 'lateral-quiet':
      return [{ id: 'ev-login', kind: 'evidence', title: 'Service account from the wrong place', detail: 'svc-backup logged into the file server from the web tier, which it never does.', severity: 'high' }];
    case 'lateral-loud':
      return [{ id: 'ev-psexec', kind: 'evidence', title: 'Service creation on the file server', detail: 'A PSEXESVC service and a spawned cmd.exe. Unmistakable remote exec.', severity: 'high' }];
    default:
      return [];
  }
}

function resolveBlue(state: MatchState, optionId: string, justification: string): MoveResolution {
  const threat = redThreat(state);
  const isolated: MatchSignal = { detected: true, label: 'Beachhead isolated', detail: 'The web host was cut off the network.' };
  const reset: MatchSignal = { detected: true, label: 'Credential reset', detail: 'The svc-backup credential no longer works.' };
  const segmented: MatchSignal = { detected: true, label: 'Segmentation tightened', detail: 'Routes from the web tier to the core were cut.' };
  const lateral = threat === 'lateral-quiet' || threat === 'lateral-loud';

  switch (optionId) {
    case 'monitor':
      if (threat === 'quiet') return score(8, 'Nothing to act on. Holding was right.', null, justification);
      if (threat === 'recon') return score(5, 'Internal scanning showed and you watched. Defensible, briefly.', null, justification);
      return score(lateral ? 1 : 3, 'They armed and moved while you held. That is a miss.', null, justification);
    case 'hunt-internal':
      if (threat === 'quiet') return score(5, 'Little to find, but hunting is never wasted.', null, justification, blueEvidence(threat));
      return score(9, 'You hunted the internal telemetry and found the movement.', null, justification, blueEvidence(threat));
    case 'reset-credentials':
      if (threat === 'creds') return score(10, 'A credential was just dumped, and you reset it before it moved. The right counter.', reset, justification);
      if (threat === 'lateral-quiet') return score(7, 'Resetting limits them, though they are already on the file server.', reset, justification);
      return score(threat === 'quiet' ? 3 : 5, 'Resetting a credential that was not the vector spends goodwill for little.', reset, justification);
    case 'isolate-host':
      if (lateral) return score(10, 'They pivoted off the beachhead. Cutting it off is the call.', isolated, justification);
      if (threat === 'creds') return score(9, 'Credentials dumped means a pivot is next. Isolating the host now is sound.', isolated, justification);
      if (threat === 'recon') return score(6, 'Early, but isolating a host that is actively scanning inside is defensible.', isolated, justification);
      return score(2, 'Isolating a host that has done nothing yet is an outage you chose.', isolated, justification);
    case 'segment-network':
      if (threat === 'recon') return score(9, 'They are mapping the core. Segmenting it off before they reach it is the sharp move.', segmented, justification);
      if (lateral) return score(7, 'Segmenting slows further spread, though this one is already across.', segmented, justification);
      if (threat === 'creds') return score(6, 'Segmentation helps, but the credential still needs handling.', segmented, justification);
      return score(3, 'Segmenting against nothing is a change with cost and no cause yet.', segmented, justification);
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
  'Pivot console. Foothold: 203.0.113.10. Internal: 10.10.5.0/24. Tools:',
  '  nmap 10.10.5.0/24        enumerate the internal network   (some noise)',
  '  secretsdump / mimikatz   dump cached credentials          (loud on EDR)',
  '  crackmapexec -H <hash>   pass the hash to the file server (quiet, needs a credential)',
  '  psexec \\\\10.10.5.20      remote exec on the file server   (loud, needs a credential)',
  '  wait                     hold and blend',
  'Each real action is your move for the turn. Say why before you run it.',
  '',
].join('\n');

function attackerRun(command: string): { output: string; optionId: string | null } {
  const cmd = command.trim();
  const tool = (cmd.split(/\s+/)[0] ?? '').toLowerCase();
  const lower = cmd.toLowerCase();
  if (tool === 'help' || tool === '?') return { output: HELP, optionId: null };
  if (tool === 'wait' || tool === 'sleep') return { output: 'Holding. Blending with normal traffic.\n', optionId: 'wait' };
  if (tool === 'nmap' || tool === 'arp' || tool === 'ping') {
    return { output: 'Nmap: hosts up on 10.10.5.0/24\n10.10.5.10 (dc)\n10.10.5.20 (fileserver)\n10.10.5.30 (backup)\n', optionId: 'enumerate-internal' };
  }
  if (tool === 'secretsdump' || tool === 'secretsdump.py' || tool === 'mimikatz' || tool === 'lsassy') {
    return { output: 'svc-backup:aad3b435b51404eeaad3b435b51404ee:5f4dcc3b5aa765d61d8327deb882cf99\n', optionId: 'dump-credentials' };
  }
  if (tool === 'psexec' || tool === 'psexec.py' || tool === 'smbexec' || tool === 'smbexec.py') {
    return { output: '[*] Creating service PSEXESVC on 10.10.5.20\n[*] cmd.exe on 10.10.5.20\n', optionId: 'psexec' };
  }
  if (tool === 'crackmapexec' || tool === 'cme' || tool === 'wmiexec' || tool === 'wmiexec.py' || tool === 'evil-winrm' || lower.includes('-h ') || lower.includes('--hash')) {
    return { output: 'SMB 10.10.5.20  [+] svc-backup (Pwn3d via hash)\n', optionId: 'pass-the-hash' };
  }
  return { output: `${tool || 'that'}: not a tool on this console. Type help.\n`, optionId: null };
}

const ATTACKER_CONSOLE: AttackerConsole = {
  banner: [
    'Pivot console attached. Foothold: 203.0.113.10. Internal: 10.10.5.0/24.',
    'Type help for tools. Every real action is your move for the turn.',
  ],
  run: attackerRun,
};

export const LATERAL_NORTHWIND: RedBlueScenario = {
  id: SCENARIO_ID,
  title: 'Operation Tidewater: Lateral Movement',
  brief:
    'A foothold on the web tier, and the prize inside. Red maps the internal network, takes a ' +
    'credential, and moves toward the file server; Blue hunts the middle of the estate and decides ' +
    'how to cut the pivot. Red wins by moving quietly and in order; Blue wins by catching the move, ' +
    'not the beachhead.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  red: RED_OPTIONS,
  blue: BLUE_OPTIONS,
  resolve,
  attacker: ATTACKER_CONSOLE,
};

registerMatchScenario(LATERAL_NORTHWIND.id, LATERAL_NORTHWIND.resolve, { maxTurns: LATERAL_NORTHWIND.maxTurns });
