/**
 * Human-operated ransomware: the hours before encryption at Castlepoint Foods.
 *
 * THE SKILL EACH SIDE IS ACTUALLY LEARNING
 *
 * This is the scenario where Red is not trying to stay hidden forever. Red is
 * trying to reach maximum leverage before it detonates, and the order is the
 * lesson: harvest credentials, move to a domain controller, neutralise the
 * backups, exfiltrate for the double-extortion threat, and only then encrypt. A
 * crew that encrypts before taking the backups has handed the victim an easy
 * recovery and thrown away its leverage. The single most important attacker move
 * on the board is the quiet one: inhibiting recovery, because that is what turns
 * an outage into a payment.
 *
 * Blue is learning incident response under time pressure, and specifically the
 * two things juniors get wrong. First, TRIAGE ORDER: isolating the patient-zero
 * host feels productive and is nearly useless once the operator is on the domain
 * controller; the high-value move is protecting the backups the moment recovery
 * is threatened. Second, EVIDENCE: powering a machine off destroys the memory
 * that holds the ransomware keys and the operator's tooling, so the reflex to
 * "pull the plug" can cost the investigation and, occasionally, the recovery.
 * Isolating at the network keeps the evidence; shutting down loses it.
 *
 * THE TARGET IS FABRICATED, ON PURPOSE AND BY RULE
 *
 * Castlepoint Foods does not exist. `.example` is reserved and the addresses are
 * RFC 1918 internal ranges, which cannot route to a real host.
 */

import type { MatchSide, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type MoveResolution } from '../../services/matchEngine.js';
import { registerMatchScenario } from '../../services/matchContent.js';
import { lastRedMove, redHasAnyOf, redHasPlayed, scored } from './linear-kit.js';
import type { AttackerConsole, MoveOption, RedBlueScenario, TargetDossier } from './types.js';

const SCENARIO_ID = 'ln-ransomware-castlepoint';
const MAX_TURNS = 7;

const TERMS = ['ransom', 'encrypt', 'backup', 'recovery', 'restore', 'exfil', 'isolate', 'contain', 'evidence', 'memory'];

const DOSSIER: TargetDossier = {
  org: 'Castlepoint Foods',
  summary:
    'A food distribution business, about 900 staff, Windows domain, on-prem backups. A human ' +
    'operator already has a foothold on one workstation and is working toward domain-wide ' +
    'encryption. Blue is the on-call SOC, mid-incident. Authorised purple-team exercise.',
  facts: [
    { k: 'Domain', v: 'castlepoint.example' },
    { k: 'Internal segment', v: '10.20.6.0/24' },
    { k: 'Domain controller', v: 'DC01, 10.20.6.5' },
    { k: 'Backups', v: 'BKP01, 10.20.6.60, domain-joined' },
    { k: 'Patient zero', v: 'WS-42, 10.20.6.142' },
    { k: 'EDR', v: 'Deployed on endpoints, not on the backup server' },
  ],
};

const RED_OPTIONS: MoveOption[] = [
  { id: 'dump-creds', label: 'Dump credentials', description: 'Read LSASS on the foothold host for cached credentials.' },
  { id: 'move-lateral', label: 'Move laterally', description: 'Use the credentials to reach another host.' },
  { id: 'reach-dc', label: 'Reach the domain controller', description: 'Get domain admin and command of the estate.' },
  { id: 'kill-backups', label: 'Inhibit recovery', description: 'Delete shadow copies, disable jobs, shorten retention.' },
  { id: 'exfil-data', label: 'Exfiltrate data', description: 'Stage and steal data for the double-extortion threat.' },
  { id: 'disable-edr', label: 'Disable defences', description: 'Stop or blind the endpoint agent across the estate.' },
  { id: 'deploy-encrypt', label: 'Deploy the encryptor', description: 'Push and run the payload domain-wide.' },
  { id: 'drop-note', label: 'Drop the ransom note', description: 'Announce yourself and open the negotiation.' },
];

const BLUE_OPTIONS: MoveOption[] = [
  { id: 'triage', label: 'Triage the alert', description: 'Establish what is actually happening and how far it has spread.' },
  { id: 'isolate-host', label: 'Isolate patient zero', description: 'Network-isolate the foothold workstation.' },
  { id: 'shutdown-host', label: 'Power off the host', description: 'Pull the plug on the affected machine.' },
  { id: 'protect-backups', label: 'Protect the backups', description: 'Isolate and lock the backup server, verify offline copies.' },
  { id: 'reset-krbtgt', label: 'Reset domain credentials', description: 'Reset krbtgt twice, force domain re-authentication.' },
  { id: 'block-exfil', label: 'Block exfiltration', description: 'Cut egress to the staging destination.' },
  { id: 'isolate-segment', label: 'Isolate the segment', description: 'Contain the whole affected network segment.' },
  { id: 'invoke-ir', label: 'Invoke the IR plan', description: 'Declare a major incident, engage the retainer, preserve evidence.' },
];

const RED_SIGNAL: Record<string, MatchSignal | null> = {
  'dump-creds': { detected: true, label: 'EDR: LSASS access', detail: 'A process read the memory of the security subsystem on WS-42.' },
  'move-lateral': { detected: true, label: 'Lateral authentication', detail: 'An administrative logon from WS-42 to another host.' },
  'reach-dc': { detected: true, label: 'DCSync from a workstation', detail: 'Directory replication requested by a non-DC principal.' },
  'kill-backups': { detected: true, label: 'Shadow copies deleted', detail: 'vssadmin delete shadows ran, and a backup job was disabled.' },
  'exfil-data': { detected: true, label: 'Bulk outbound transfer', detail: 'A large upload to an external host over several hours.' },
  'disable-edr': { detected: true, label: 'Security agent stopped', detail: 'The endpoint agent was tampered with across multiple hosts.' },
  'deploy-encrypt': { detected: true, label: 'Mass file modification', detail: 'High-entropy writes across shares at machine speed.' },
  'drop-note': { detected: true, label: 'Ransom note written', detail: 'A ransom note appeared on every share.' },
};

const RED_REVEALS: Record<string, RevealedFinding[]> = {
  'dump-creds': [{ id: 'creds', kind: 'vuln', title: 'Cached credentials', detail: 'A domain admin logged into this workstation last week. Their hash is here.', severity: 'high' }],
  'move-lateral': [{ id: 'reach', kind: 'service', title: 'Second host', detail: 'You hold a file server as well now.', severity: 'medium' }],
  'reach-dc': [{ id: 'da', kind: 'vuln', title: 'Domain admin', detail: 'You command the estate. Everything after this is a choice, not a fight.', severity: 'high' }],
  'kill-backups': [{ id: 'norecover', kind: 'vuln', title: 'Recovery inhibited', detail: 'Shadow copies gone, jobs disabled, retention cut. Their recovery is now a negotiation.', severity: 'high' }],
  'exfil-data': [{ id: 'leverage', kind: 'vuln', title: 'Data staged out', detail: 'You can threaten publication as well as encryption. Double leverage.', severity: 'high' }],
};

const RED_HOSTLOG: Record<string, string[]> = {
  'dump-creds': ['Sep 02 02:11 WS-42 sysmon EID10 target=lsass.exe granted=0x1410 image=C:\\Users\\Public\\t.exe'],
  'move-lateral': ['Sep 02 02:20 FS03 security EID4624 type=3 user=CASTLE\\svc-adm src=WS-42'],
  'reach-dc': ['Sep 02 02:34 DC01 security EID4662 props=DS-Replication-Get-Changes-All principal=WS-42$'],
  'kill-backups': [
    'Sep 02 02:40 BKP01 vssadmin: delete shadows /all /quiet',
    'Sep 02 02:41 BKP01 backupsvc: job "nightly-offsite" disabled by CASTLE\\svc-adm',
  ],
  'exfil-data': ['Sep 02 02:55 fw session src=10.20.6.60 dst=203.0.113.9 bytes=41000000000 dur=4200s'],
  'disable-edr': ['Sep 02 03:05 edr agent stopped on 40 hosts, tamper protection off'],
  'deploy-encrypt': ['Sep 02 03:20 FS03 mass rename *.castlelock across shares at 900 files/sec'],
  'drop-note': ['Sep 02 03:25 note "RECOVER-YOUR-FILES.txt" written to every share'],
};

type Stage = 'foothold' | 'creds' | 'lateral' | 'domain';

function redStage(state: MatchState): Stage {
  if (redHasPlayed(state, 'reach-dc')) return 'domain';
  if (redHasPlayed(state, 'move-lateral')) return 'lateral';
  if (redHasPlayed(state, 'dump-creds')) return 'creds';
  return 'foothold';
}

function backupsGone(state: MatchState): boolean {
  return redHasPlayed(state, 'kill-backups');
}

function blueEvidence(state: MatchState): RevealedFinding[] {
  switch (lastRedMove(state)) {
    case 'dump-creds':
      return [{ id: 'ev-creds', kind: 'evidence', title: 'Credential theft', detail: 'LSASS was read on WS-42. Treat every credential used on that host as compromised.', severity: 'high' }];
    case 'move-lateral':
      return [{ id: 'ev-lat', kind: 'evidence', title: 'Lateral movement', detail: 'An admin logon spread from WS-42. This is no longer one host.', severity: 'high' }];
    case 'reach-dc':
      return [{ id: 'ev-dc', kind: 'evidence', title: 'Domain compromise', detail: 'DCSync from a workstation account. They hold the domain. Encryption is now imminent.', severity: 'high' }];
    case 'kill-backups':
      return [{ id: 'ev-bkp', kind: 'evidence', title: 'Recovery inhibited', detail: 'Shadow copies deleted and a job disabled on BKP01. Your recovery capability is under attack right now.', severity: 'high' }];
    case 'exfil-data':
      return [{ id: 'ev-exfil', kind: 'evidence', title: 'Exfiltration', detail: 'Forty gigabytes left BKP01 for an external host. Expect a publication threat.', severity: 'high' }];
    case 'deploy-encrypt':
      return [{ id: 'ev-enc', kind: 'evidence', title: 'Encryption underway', detail: 'Mass file modification across shares. This is the detonation.', severity: 'high' }];
    default:
      return [];
  }
}

function resolveRed(state: MatchState, optionId: string, justification: string): MoveResolution {
  const signal = RED_SIGNAL[optionId];
  if (signal === undefined) throw new MatchError('That is not a red move in this scenario.');
  const common = { justification, terms: TERMS, signal, reveals: RED_REVEALS[optionId], hostLog: RED_HOSTLOG[optionId] };

  if (redHasPlayed(state, optionId)) {
    return scored({ ...common, points: 2, note: 'Already done.' });
  }

  const stage = redStage(state);

  switch (optionId) {
    case 'dump-creds':
      return scored({ ...common, points: 8, note: 'The right opener. Credentials are what turn one host into an estate.' });
    case 'move-lateral':
      if (stage === 'foothold') return scored({ ...common, points: 3, note: 'Move with what? You have not taken any credentials yet.' });
      return scored({ ...common, points: 8, note: 'Spreading on stolen credentials. On track.' });
    case 'reach-dc':
      if (stage === 'foothold' || stage === 'creds') return scored({ ...common, points: 4, note: 'Reaching for the DC before you have moved is a leap. Sometimes it lands; usually it is loud.' });
      return scored({ ...common, points: 9, note: 'Domain admin. From here you set the terms.' });
    case 'kill-backups':
      if (stage !== 'domain') return scored({ ...common, points: 3, note: 'You cannot touch the backup server without the rights the domain gives you.' });
      // The most important attacker move in the scenario. Quiet, and decisive.
      return scored({ ...common, points: 10, note: 'This is the move that matters. No backups means the outage is a payment. And it is quiet, which is why it is missed.' });
    case 'exfil-data':
      if (stage !== 'domain') return scored({ ...common, points: 4, note: 'You do not have broad enough access to stage a real exfiltration yet.' });
      return scored({ ...common, points: 8, note: 'Double extortion. Even a perfect restore does not undo a publication threat.' });
    case 'disable-edr':
      if (stage !== 'domain') return scored({ ...common, points: 4, note: 'Disabling defences estate-wide needs the domain, and it is a very loud act.' });
      return scored({ ...common, points: 6, note: 'It clears the way for the encryptor, and it screams. A trade.' });
    case 'deploy-encrypt':
      if (stage !== 'domain') return scored({ ...common, points: 2, note: 'You cannot push domain-wide without the domain. Premature.' });
      if (!backupsGone(state)) {
        return scored({ ...common, points: 4, note: 'You encrypted with their backups intact. They restore by morning and you have no leverage. This is the classic amateur mistake.' });
      }
      return scored({ ...common, points: 9, note: 'Backups neutralised first, then detonation. Maximum leverage, correctly sequenced.' });
    case 'drop-note':
      if (!redHasPlayed(state, 'deploy-encrypt')) return scored({ ...common, points: 2, note: 'A ransom note with nothing encrypted is just a warning you gave them for free.' });
      return scored({ ...common, points: 7, note: 'The negotiation opens. Loud by definition; the damage is already done.' });
    default:
      throw new MatchError('That is not a red move in this scenario.');
  }
}

function resolveBlue(state: MatchState, optionId: string, justification: string): MoveResolution {
  const last = lastRedMove(state);
  const stage = redStage(state);
  const backupsThreatened = backupsGone(state) || stage === 'domain';
  const evidence = blueEvidence(state);
  const common = { justification, terms: TERMS };

  switch (optionId) {
    case 'triage':
      if (last === null) return scored({ ...common, points: 5, note: 'Nothing has fired yet, but knowing your ground never hurts.' });
      return scored({ ...common, points: 9, note: 'Establishing scope before acting. In a live ransomware case this is what stops you fixing the wrong thing.', reveals: evidence });

    case 'isolate-host':
      if (stage === 'foothold' || stage === 'creds') {
        return scored({ ...common, points: 8, note: 'Early, and while it is still one host. This is the cheap win, if you catch it here.' });
      }
      return scored({ ...common, points: 3, note: 'You isolated patient zero, but the operator is already on the domain controller. You closed a door they left through hours ago.' });

    case 'shutdown-host':
      if (redHasPlayed(state, 'deploy-encrypt')) {
        return scored({ ...common, points: 4, note: 'Understandable in the panic, but powering off destroys the memory that may hold the keys and the tooling. Isolate at the network instead.' });
      }
      return scored({ ...common, points: 3, note: 'Pulling the plug loses the volatile evidence and the chance of an in-memory key. Network isolation keeps both.' });

    case 'protect-backups':
      if (backupsThreatened) {
        return scored({ ...common, points: 10, note: 'The most valuable move on the board. Recovery capability is what decides whether this is a bad week or a paid ransom.' });
      }
      return scored({ ...common, points: 7, note: 'Nothing is threatening them yet, but protecting recovery early is never the wrong instinct.' });

    case 'reset-krbtgt':
      if (stage === 'domain') {
        return scored({ ...common, points: 9, note: 'They hold the domain, so resetting krbtgt twice is exactly the containment for it. Do not stop at once.' });
      }
      return scored({ ...common, points: 5, note: 'Sound preparation, though they do not hold the domain yet.' });

    case 'block-exfil':
      if (redHasPlayed(state, 'exfil-data')) {
        return scored({ ...common, points: 8, note: 'Cutting the transfer limits what they can threaten to publish. Worth doing even mid-flight.' });
      }
      return scored({ ...common, points: 4, note: 'Nothing is leaving yet.' });

    case 'isolate-segment':
      if (stage === 'lateral' || stage === 'domain') {
        return scored({ ...common, points: 9, note: 'Once it is more than one host, containing the segment is proportionate. It hurts, and it is right.' });
      }
      return scored({ ...common, points: 5, note: 'Heavy for a single foothold. Isolating the one host is enough for now.' });

    case 'invoke-ir':
      if (stage !== 'foothold') {
        return scored({ ...common, points: 9, note: 'Declaring the major incident gets you the people and the authority to act at this scale, and it preserves evidence by process.' });
      }
      return scored({ ...common, points: 6, note: 'Perhaps early, but nobody was ever fired for invoking the plan.' });

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
  'Operator console. You have a foothold on WS-42 in castlepoint.example.',
  '  mimikatz                 dump credentials from LSASS',
  '  psexec <host>            move laterally with stolen credentials',
  '  dcsync                   replicate the domain controller',
  '  vssadmin delete shadows  inhibit recovery (also disables jobs)',
  '  rclone <dest>            exfiltrate staged data',
  '  edr-kill                 stop the endpoint agent estate-wide',
  '  deploy encrypt           push and run the encryptor',
  '  note                     drop the ransom note',
  'Each real command is your move for the turn. Say why before you run it.',
  '',
].join('\n');

function attackerRun(command: string): { output: string; optionId: string | null } {
  const cmd = command.trim();
  const tool = (cmd.split(/\s+/)[0] ?? '').toLowerCase();
  const lower = cmd.toLowerCase();
  switch (tool) {
    case 'help':
    case '?':
      return { output: HELP, optionId: null };
    case 'mimikatz':
      return { output: 'sekurlsa::logonpasswords -> CASTLE\\svc-adm (domain admin) hash recovered.\n', optionId: 'dump-creds' };
    case 'psexec':
    case 'wmic':
      return { output: 'Authenticated to FS03 as CASTLE\\svc-adm.\n', optionId: 'move-lateral' };
    case 'dcsync':
      return { output: 'Replicated DC01. krbtgt and all domain hashes recovered.\n', optionId: 'reach-dc' };
    case 'vssadmin':
      return { output: 'Shadow copies deleted. Backup job "nightly-offsite" disabled.\n', optionId: 'kill-backups' };
    case 'rclone':
      return { output: 'Uploaded 40 GB to the staging host.\n', optionId: 'exfil-data' };
    case 'edr-kill':
      return { output: 'Endpoint agent stopped on 40 hosts.\n', optionId: 'disable-edr' };
    case 'deploy':
      return { output: 'Encryptor pushed via GPO and executed across the domain.\n', optionId: 'deploy-encrypt' };
    case 'note':
      return { output: 'Ransom note written to every share.\n', optionId: 'drop-note' };
    default:
      return { output: `${tool || 'that'}: not a tool on this console. Type help.\n`, optionId: null };
  }
}

const ATTACKER_CONSOLE: AttackerConsole = {
  banner: [
    'Operator console attached. Foothold on WS-42, castlepoint.example (authorised).',
    'Type help for tooling. Every real command is your move for the turn.',
  ],
  run: attackerRun,
};

export const RANSOMWARE_CASTLEPOINT: RedBlueScenario = {
  id: SCENARIO_ID,
  title: 'Detonation: Castlepoint Foods',
  brief:
    'A human operator is inside, hours from encrypting a food distributor domain-wide. The board is ' +
    'a race with an order to it: Red wins by neutralising recovery and stealing data before it ' +
    'detonates, not by rushing the encryptor. Blue wins by protecting the backups and containing at ' +
    'the network without destroying the evidence, and by resisting the two reflexes that make a bad ' +
    'night worse: isolating the wrong host, and pulling the plug.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  red: RED_OPTIONS,
  blue: BLUE_OPTIONS,
  resolve,
  attacker: ATTACKER_CONSOLE,
};

registerMatchScenario(RANSOMWARE_CASTLEPOINT.id, RANSOMWARE_CASTLEPOINT.resolve, { maxTurns: RANSOMWARE_CASTLEPOINT.maxTurns });
