/**
 * The departing insider: Groveport Dynamics.
 *
 * THE SKILL EACH SIDE IS ACTUALLY LEARNING
 *
 * Red here is not an intruder. Red is an employee who has already accepted a job
 * at a competitor and intends to leave with the designs. Every single action is
 * AUTHORISED, so the whole game is the gap between permitted and appropriate.
 * Red is graded on staying inside that gap: taking data through channels a
 * normal working day would use, at volumes and times that blend in. The clumsy
 * insider zips the whole repository to a USB stick at midnight; the effective
 * one drips it through email and cloud sync in amounts that never trip a
 * threshold.
 *
 * Blue is learning the thing that makes insider cases unlike every other: you
 * almost never contain immediately, because the evidence is a pattern that takes
 * time to establish and because moving too early destroys both the proof and the
 * employment case. The high-value early moves are quiet: baseline the behaviour,
 * preserve the evidence, and bring in HR and legal. Blindly cutting the account
 * the moment something looks odd tips off the insider, loses the forensic
 * timeline, and can collapse a dismissal that would otherwise have held. The
 * scoring rewards patience and preparation, and punishes the reflex to act.
 *
 * THE TARGET IS FABRICATED, ON PURPOSE AND BY RULE
 *
 * Groveport Dynamics does not exist. `.example` is reserved and the addresses
 * are RFC 1918 internal ranges.
 */

import type { MatchSide, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type MoveResolution } from '../../services/matchEngine.js';
import { registerMatchScenario } from '../../services/matchContent.js';
import { lastRedMove, redHasPlayed, scored } from './linear-kit.js';
import type { AttackerConsole, MoveOption, RedBlueScenario, TargetDossier } from './types.js';

const SCENARIO_ID = 'ln-insider-groveport';
const MAX_TURNS = 6;

const TERMS = ['insider', 'authorised', 'baseline', 'behaviour', 'volume', 'evidence', 'preserve', 'legal', 'blend', 'exfil'];

const DOSSIER: TargetDossier = {
  org: 'Groveport Dynamics',
  summary:
    'An engineering firm holding valuable design work. A senior engineer has accepted a role at a ' +
    'competitor and has not yet told anyone. They hold legitimate access to almost everything they ' +
    'would want to take. Authorised insider-threat exercise, run with HR and legal aware.',
  facts: [
    { k: 'Domain', v: 'groveport.example' },
    { k: 'File share', v: 'FS01, 10.25.4.20, design repository' },
    { k: 'Mail', v: 'Cloud tenant, external send permitted' },
    { k: 'Endpoint', v: 'Managed laptop, USB allowed for engineering' },
    { k: 'Insider', v: 'Senior engineer, broad legitimate access' },
    { k: 'DLP', v: 'Deployed, tuned conservatively to avoid blocking work' },
  ],
};

const RED_OPTIONS: MoveOption[] = [
  { id: 'browse-normal', label: 'Work as normal', description: 'Access what you usually access. Establish that today looks like any day.' },
  { id: 'scope-designs', label: 'Locate the designs', description: 'Find the specific files worth taking.' },
  { id: 'email-small', label: 'Email a few files out', description: 'Send small batches to a personal address, spread over days.' },
  { id: 'cloud-sync', label: 'Sync to personal cloud', description: 'A trickle to a personal cloud account through the browser.' },
  { id: 'usb-bulk', label: 'Copy everything to USB', description: 'Zip the repository and take it on a drive. Fast, and obvious.' },
  { id: 'print-designs', label: 'Print the designs', description: 'Physical copies. Slow, and outside most monitoring.' },
  { id: 'delete-tracks', label: 'Clear your history', description: 'Wipe browser and recent-file history to muddy the timeline.' },
  { id: 'resign', label: 'Hand in notice', description: 'Formally resign. The clock on your access starts now.' },
];

const BLUE_OPTIONS: MoveOption[] = [
  { id: 'hold', label: 'Hold and monitor', description: 'No action. Nothing yet justifies more.' },
  { id: 'baseline', label: 'Baseline the behaviour', description: 'Compare current activity against this user’s own history.' },
  { id: 'preserve', label: 'Preserve evidence', description: 'Quietly image and log, so the timeline survives.' },
  { id: 'engage-hr', label: 'Engage HR and legal', description: 'Bring in the people who own the employment and legal process.' },
  { id: 'restrict-quietly', label: 'Reduce access quietly', description: 'Trim access to role, without tipping the user off.' },
  { id: 'confront', label: 'Confront the user', description: 'Interview them now about what they have been doing.' },
  { id: 'cut-access', label: 'Cut all access', description: 'Disable the account immediately.' },
  { id: 'block-channel', label: 'Block the channel used', description: 'Stop the specific exfiltration route in use.' },
];

const RED_SIGNAL: Record<string, MatchSignal | null> = {
  'browse-normal': null,
  'scope-designs': null,
  'email-small': { detected: true, label: 'DLP: small external send', detail: 'A file matching a sensitive pattern sent to a personal address. Below the block threshold.' },
  'cloud-sync': { detected: true, label: 'Upload to personal cloud', detail: 'A steady trickle to a personal cloud domain from the browser.' },
  'usb-bulk': { detected: true, label: 'Large USB transfer', detail: 'An archive of the design repository written to a removable drive at night.' },
  'print-designs': { detected: true, label: 'Unusual print volume', detail: 'A large print job of engineering drawings after hours.' },
  'delete-tracks': { detected: true, label: 'History cleared', detail: 'Browser and recent-file history wiped on the endpoint.' },
  'resign': { detected: true, label: 'Resignation submitted', detail: 'The employee formally resigned this morning.' },
};

const RED_REVEALS: Record<string, RevealedFinding[]> = {
  'scope-designs': [{ id: 'designs', kind: 'service', title: 'The valuable set', detail: 'The current-generation design files, about 12 GB, on FS01.', severity: 'info' }],
  'email-small': [{ id: 'out-email', kind: 'service', title: 'Files leaving by email', detail: 'A slow drip below every threshold. Nobody notices a file a day.', severity: 'low' }],
  'cloud-sync': [{ id: 'out-cloud', kind: 'service', title: 'Files leaving by cloud', detail: 'A personal cloud account filling up quietly in the background.', severity: 'low' }],
  'usb-bulk': [{ id: 'out-usb', kind: 'vuln', title: 'Bulk copy done', detail: 'The whole set is on a drive. Fast, complete, and it lit up every sensor.', severity: 'high' }],
};

const RED_HOSTLOG: Record<string, string[]> = {
  'email-small': ['Sep 02 16:40 dlp: 1 file "assembly-rev7.step" -> personal address, action=allow (below threshold)'],
  'cloud-sync': ['Sep 02 16:55 proxy: 220 MB to personal-cloud.example over 40 min, user=e.faulkner'],
  'usb-bulk': ['Sep 02 23:10 endpoint: 12 GB archive written to USB VID_0781, user=e.faulkner'],
  'print-designs': ['Sep 02 22:30 print: 340 pages, engineering plotter, user=e.faulkner'],
  'delete-tracks': ['Sep 02 23:40 endpoint: browser history and recent items cleared, user=e.faulkner'],
  'resign': ['Sep 03 09:05 hr: resignation received, notice period 4 weeks, e.faulkner'],
};

/** How loudly the insider is currently taking data. */
type Channel = 'none' | 'quiet' | 'loud';

function activeChannel(state: MatchState): Channel {
  if (redHasPlayed(state, 'usb-bulk') || redHasPlayed(state, 'print-designs')) return 'loud';
  if (redHasPlayed(state, 'email-small') || redHasPlayed(state, 'cloud-sync')) return 'quiet';
  return 'none';
}

function anyExfil(state: MatchState): boolean {
  return activeChannel(state) !== 'none';
}

function blueEvidence(state: MatchState): RevealedFinding[] {
  switch (lastRedMove(state)) {
    case 'email-small':
      return [{ id: 'ev-email', kind: 'evidence', title: 'Low-and-slow email', detail: 'Sensitive files leaving to a personal address, each below the DLP threshold. The pattern is the signal, not any one send.', severity: 'medium' }];
    case 'cloud-sync':
      return [{ id: 'ev-cloud', kind: 'evidence', title: 'Personal cloud upload', detail: 'A sustained trickle to a personal cloud account. Volume against this user’s baseline is what makes it visible.', severity: 'medium' }];
    case 'usb-bulk':
      return [{ id: 'ev-usb', kind: 'evidence', title: 'Bulk USB export', detail: 'Twelve gigabytes to a removable drive at night. Unambiguous, and it hands you the timeline.', severity: 'high' }];
    case 'print-designs':
      return [{ id: 'ev-print', kind: 'evidence', title: 'After-hours printing', detail: 'A large plot of drawings out of hours. Physical exfiltration, easy to miss.', severity: 'medium' }];
    case 'delete-tracks':
      return [{ id: 'ev-wipe', kind: 'evidence', title: 'Anti-forensics', detail: 'History cleared. Intent to hide is itself evidence, and your preserved copy still has the timeline.', severity: 'medium' }];
    default:
      return [];
  }
}

function resolveRed(state: MatchState, optionId: string, justification: string): MoveResolution {
  const signal = RED_SIGNAL[optionId];
  if (signal === undefined) throw new MatchError('That is not a red move in this scenario.');
  const common = { justification, terms: TERMS, signal, reveals: RED_REVEALS[optionId], hostLog: RED_HOSTLOG[optionId] };

  if (redHasPlayed(state, optionId)) {
    return scored({ ...common, points: 2, note: 'Already done. Repeating it only sharpens the pattern against you.' });
  }

  const scoped = redHasPlayed(state, 'scope-designs');

  switch (optionId) {
    case 'browse-normal':
      return scored({ ...common, points: 8, note: 'Establishing that today looks like any day. Cover is built before it is needed.' });
    case 'scope-designs':
      return scored({ ...common, points: 8, note: 'Authorised, invisible, and it means you take only what is worth taking.' });
    case 'email-small':
      if (!scoped) return scored({ ...common, points: 5, note: 'Works, but scattergun. You do not yet know which files matter.' });
      return scored({ ...common, points: 9, note: 'A file a day, below every threshold, through a channel you use anyway. This is the effective insider.' });
    case 'cloud-sync':
      if (!scoped) return scored({ ...common, points: 5, note: 'A channel with no target is just risk.' });
      return scored({ ...common, points: 9, note: 'A quiet trickle to personal cloud. Blends into ordinary browsing.' });
    case 'usb-bulk':
      return scored({ ...common, points: 3, note: 'The whole set at once, at night, to a USB stick. Complete and instant, and it trips every sensor you have. This is the clumsy insider.' });
    case 'print-designs':
      return scored({ ...common, points: 6, note: 'Slow and physical, outside most monitoring, but it does not scale and the volume stands out.' });
    case 'delete-tracks':
      return scored({ ...common, points: 3, note: 'Clearing history is itself an alerting event, and it signals intent far more clearly than the copies did.' });
    case 'resign':
      if (anyExfil(state)) return scored({ ...common, points: 4, note: 'Resigning after you have taken data puts a spotlight on everything you just did. The order is backwards.' });
      return scored({ ...common, points: 7, note: 'Resigning cleanly first is defensible, but the clock on your access is now running.' });
    default:
      throw new MatchError('That is not a red move in this scenario.');
  }
}

function resolveBlue(state: MatchState, optionId: string, justification: string): MoveResolution {
  const last = lastRedMove(state);
  const channel = activeChannel(state);
  const exfil = anyExfil(state);
  const evidence = blueEvidence(state);
  const prepared = redHasPlayed(state, 'resign') || exfil;
  const common = { justification, terms: TERMS };

  switch (optionId) {
    case 'hold':
      if (!exfil) return scored({ ...common, points: 7, note: 'Nothing yet justifies more. An insider case is built slowly.' });
      if (channel === 'quiet') return scored({ ...common, points: 4, note: 'Something is leaking. Watching is only right if you are watching deliberately, not drifting.' });
      return scored({ ...common, points: 2, note: 'Twelve gigabytes went out the door and you held. That is not patience, that is a miss.' });

    case 'baseline':
      return scored({ ...common, points: 9, note: 'Comparing against this user’s own history is what turns "authorised" activity into a visible anomaly. The core insider skill.', reveals: evidence });

    case 'preserve':
      return scored({ ...common, points: 9, note: 'Quietly preserving the evidence protects both the investigation and any future dismissal. This is the move juniors skip.' });

    case 'engage-hr':
      return scored({ ...common, points: 9, note: 'Insider cases are HR and legal matters that happen to involve logs. Bringing them in early is almost always right.' });

    case 'restrict-quietly':
      if (exfil) return scored({ ...common, points: 8, note: 'Trimming to role, without tipping them off, slows the bleed while the case is built. Deft.' });
      return scored({ ...common, points: 6, note: 'Reasonable least-privilege housekeeping, though nothing yet demands it.' });

    case 'confront':
      if (prepared) return scored({ ...common, points: 6, note: 'Defensible once you have evidence and HR in the room, though it ends any chance of watching further.' });
      return scored({ ...common, points: 2, note: 'You confronted them with no evidence and no HR present. They deny it, delete the rest, and you have tipped your hand.' });

    case 'cut-access':
      if (channel === 'loud') return scored({ ...common, points: 6, note: 'With a bulk export in hand, cutting access is defensible, but do it after preserving evidence, not instead of it.' });
      if (exfil) return scored({ ...common, points: 3, note: 'You cut them off mid-pattern. You have stopped the bleed and lost the timeline and tipped them off, all at once.' });
      return scored({ ...common, points: 1, note: 'You disabled a senior engineer’s account on a hunch. If you are wrong, that is a very bad day; if you are right, you just destroyed your own evidence.' });

    case 'block-channel':
      if (last === 'email-small' || last === 'cloud-sync' || last === 'usb-bulk') {
        return scored({ ...common, points: 7, note: 'Closing the specific route in use, quietly, buys time without announcing that you know.' });
      }
      return scored({ ...common, points: 4, note: 'No channel is in use to block.' });

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
  'You are a Groveport engineer with legitimate access. Nothing here is an exploit.',
  '  work                     access what you normally access',
  '  find --designs           locate the valuable files',
  '  send --email <file>      email a small batch to a personal address',
  '  sync --cloud             trickle to a personal cloud account',
  '  copy --usb               archive everything to a USB drive   (loud)',
  '  print --designs          print physical copies',
  '  clear --history          wipe browser and recent-file history',
  '  resign                   hand in your notice',
  'Each real action is your move for the turn. Say why before you run it.',
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
    case 'work':
      return { output: 'Opened the usual project files. A normal morning.\n', optionId: 'browse-normal' };
    case 'find':
      return { output: 'Located the current-generation design set, ~12 GB on FS01.\n', optionId: 'scope-designs' };
    case 'send':
      return { output: 'Emailed 1 file to a personal address. Below the DLP threshold.\n', optionId: 'email-small' };
    case 'sync':
      return { output: 'Syncing a trickle to a personal cloud account.\n', optionId: 'cloud-sync' };
    case 'copy':
      return { output: 'Wrote a 12 GB archive to a USB drive.\n', optionId: 'usb-bulk' };
    case 'print':
      return { output: 'Printed 340 pages of drawings.\n', optionId: 'print-designs' };
    case 'clear':
      return { output: 'Cleared browser and recent-file history.\n', optionId: 'delete-tracks' };
    case 'resign':
      return { output: 'Resignation submitted. Four weeks notice.\n', optionId: 'resign' };
    default:
      if (lower.includes('exfil')) return { output: 'Be specific: send, sync, copy, or print.\n', optionId: null };
      return { output: `${tool || 'that'}: not an action on this console. Type help.\n`, optionId: null };
  }
}

const ATTACKER_CONSOLE: AttackerConsole = {
  banner: [
    'Insider console attached. You are a trusted Groveport engineer (authorised exercise).',
    'Nothing here is an exploit. Every real action is your move for the turn.',
  ],
  run: attackerRun,
};

export const INSIDER_GROVEPORT: RedBlueScenario = {
  id: SCENARIO_ID,
  title: 'Notice Period: Groveport Dynamics',
  brief:
    'The attacker is an employee who has already taken another job, and every move they make is ' +
    'permitted. The game is the gap between allowed and appropriate: Red wins by taking the designs ' +
    'through ordinary channels at volumes that blend in, and loses by grabbing everything at once. ' +
    'Blue wins by baselining, preserving evidence and bringing in HR before it acts, and loses by ' +
    'cutting the account on a hunch, which tips the insider off and destroys the case.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  red: RED_OPTIONS,
  blue: BLUE_OPTIONS,
  resolve,
  attacker: ATTACKER_CONSOLE,
};

registerMatchScenario(INSIDER_GROVEPORT.id, INSIDER_GROVEPORT.resolve, { maxTurns: INSIDER_GROVEPORT.maxTurns });
