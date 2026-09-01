/**
 * Scenario 13: Nothing To Restore.
 *
 * Somebody methodically removing the organisation's ability to recover, three
 * weeks before anything else happens.
 *
 * WHY THIS IS ITS OWN SCENARIO AND NOT PART OF THE RANSOMWARE ONE
 *
 * In `last-friday` the backup destruction happens ninety minutes before
 * detonation, so the floor sees it in context and the meaning is obvious. That
 * is not how it usually arrives.
 *
 * Real backup sabotage is slow, spread over weeks, and every individual step
 * looks like housekeeping performed by somebody with a legitimate reason. A
 * retention window shortened here, a job silently excluded there, a restore test
 * that quietly stops running. Each one is a ticket somebody could have raised. It
 * is only the pattern across three weeks that says anything, and no alert exists
 * for a pattern.
 *
 * WHAT MAKES IT HARD
 *
 * The absence of a crime. Nothing is encrypted, nothing is stolen, no credential
 * is compromised, and the account doing all of it is a real backup administrator
 * account behaving within its permissions. The floor has to conclude that
 * preparation is itself the incident and act on it while there is still
 * something to protect. A floor that waits for harm will get harm.
 *
 * THE TRAP
 *
 * `ev.6` gives the floor a satisfying answer that is wrong. A departing
 * contractor with the right access at the right time is a tidy story, and the
 * timestamps do not fit. Reaching for it is the failure this scenario is built
 * to punish.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  BROAD_SEARCH,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'nothing-to-restore';

export const NOTHING_TO_RESTORE: Scenario = {
  id: ID,
  title: 'Nothing To Restore',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 09:00 on a Tuesday. A quarterly recovery assurance review flagged that a restore test ' +
    'has not run since the eleventh. Nothing is broken, nothing is encrypted, and no alert has ' +
    'fired. This arrived as an audit finding, not a security one.',
  roles: [
    'soc-operator',
    'log-analyst',
    'cloud-security',
    'fusion-analyst',
    'forensics',
    'detection-engineer',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Automated restore verification has not completed since the eleventh',
      detail:
        'The weekly restore test last completed successfully on the eleventh, nineteen days ago. ' +
        'Since then it has reported "skipped: source set empty" three times. A skip is not a ' +
        'failure, so no alert was generated and the monitoring dashboard shows green. The audit ' +
        'review picked it up by reading the completion dates rather than the status.',
      source: 'backup service',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'cloud-audit',
      summary: 'Backup selection rules edited four times over eighteen days',
      detail:
        'The backup job definition was modified on the 11th, 16th, 22nd and 27th, each time ' +
        'removing one or two directory paths from the selection set. The four removals together ' +
        'account for the clinical records, finance and research shares. Every change was made by ' +
        'the bkp-admin account and every one is permitted. No change tickets exist for any of them.',
      source: 'bkp-admin',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 310,
      surface: 'raw-log',
      summary: 'bkp-admin sessions originate from a workstation, not the backup server',
      detail:
        'All four edits came from RMG-WS-3390, a general-purpose workstation. The bkp-admin account ' +
        'is a service account documented as being used only from the backup management server ' +
        'through a jump host. Ninety days of history show every prior session from that server. ' +
        'The workstation is assigned to a member of the infrastructure team.',
      source: 'RMG-WS-3390',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 470,
      surface: 'cloud-audit',
      summary: 'Offsite replication paused on the 22nd and never resumed',
      detail:
        'Replication to the secondary region was paused at 23:14 on the 22nd. The interface offers ' +
        'pause as a routine maintenance function and it does not expire or notify. The secondary ' +
        'region still holds everything replicated up to that point, which is now eight days stale ' +
        'and includes none of the removed shares.',
      source: 'bkp-admin',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'Backup catalogue entries for the removed shares deleted from the index',
      detail:
        'The backup catalogue no longer contains index entries for the three removed shares before ' +
        'the eleventh, though the underlying tape and object storage still hold that data. Without ' +
        'catalogue entries the restore tooling cannot locate it. Rebuilding a catalogue from raw ' +
        'media is possible and takes several days.',
      source: 'rmg-bkp-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'A contractor with backup administration access left on the twelfth',
      detail:
        'An infrastructure contractor whose engagement ended on the twelfth held membership of the ' +
        'backup administrators group. Their account was disabled by the leaver process on the ' +
        'twelfth at 17:30 and shows no authentication after 16:12 that day. Their assigned ' +
        'workstation was RMG-WS-2204.',
      source: 'identity system',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Storage array reported 14 media errors on the tape library this month',
      detail:
        'The tape library logged 14 read errors across three cartridges, all of which retried ' +
        'successfully. The vendor support case notes drive head wear and a scheduled replacement ' +
        'next month. Rule history: fired 96 times in thirty days, 96 closed as expected media ' +
        'wear.',
      source: 'tape library',
      claimedSeverity: 'low',
    },
  ],
};

export const NOTHING_TO_RESTORE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody with the backup administrator credential has spent nineteen days removing the ability to recover.',
    'They took the clinical records, finance and research shares out of the backup selection across four edits, one or two paths at a time.',
    'Because the source set went empty, the weekly restore test reported skipped rather than failed, and a skip raises no alert.',
    'They paused offsite replication on the 22nd. The interface treats pause as routine maintenance and it neither expires nor notifies.',
    'They deleted the catalogue entries for the removed shares, so the data still exists on media that the restore tooling can no longer find.',
    'Every action was performed by a real backup administrator account, within its permissions, with no failed attempt anywhere.',
    'Nothing has been encrypted or stolen. The preparation is the incident, and it is not finished.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1490'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst', 'cloud-security'],
      why:
        'This did not arrive as a security alert and never would have, because "skipped" is not ' +
        '"failed" and no monitoring system alerts on a job that politely declined to run. The ' +
        'dashboard is green and has been green for nineteen days. The reason to take it is the ' +
        'skip reason itself: source set empty means somebody changed what was being backed up, and ' +
        'a backup set that empties itself is not a thing that happens. Worth noticing how it was ' +
        'found, because an auditor reading completion dates rather than statuses caught what every ' +
        'automated control missed.',
      standIn:
        'Restore verification has not actually completed since the eleventh. It reports skipped, ' +
        'source set empty, three times, and a skip does not alert so the dashboard is green. Empty ' +
        'source set means somebody changed the selection. Raising it.',
      commandOptions: [
        { command: 'grep -i skipped /var/log/backup/verify.log | tail', correct: true, teaches: CORRECT_STEP },
        { command: 'awk \'/verify/ {print $1, $5}\' /var/log/backup/verify.log | tail -20', ...WRONG_TARGET },
        { command: 'systemctl status backup-verify.timer', ...STATUS_CHECK },
        { command: 'df -h /backup', ...STATUS_CHECK },
        { command: 'ls -la /var/log/backup/', ...WRONG_TARGET },
      ],
      commandNudge: 'Read the reason it skipped, not just that it skipped.',
      guidance:
        'A green dashboard can mean nothing went wrong or that nothing ran. Ask which.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1490', 'T1562'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.preserve', 'act.isolate', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Four edits over eighteen days, one or two paths each, every one permitted and every one ' +
        'individually defensible as tidying a backup set. Spaced deliberately: four changes in one ' +
        'afternoon would be noticed by somebody, and four across three weeks are four separate ' +
        'unremarkable Tuesdays. Two things convert this from housekeeping into intent. The removals ' +
        'add up to exactly the clinical records, finance and research shares, which is the ' +
        'organisation, and there is no change ticket for any of them. Backup configuration changes ' +
        'without paperwork are the finding, not the changes themselves.',
      standIn:
        'Backup selection edited on the 11th, 16th, 22nd and 27th, one or two paths removed each ' +
        'time. Together they are the clinical records, finance and research shares. All by ' +
        'bkp-admin, all permitted, and not one has a change ticket.',
      commandNudge:
        'Look at what the four edits add up to, rather than at any one of them.',
      guidance:
        'Each change is defensible alone. Ask what they total, and whether anybody approved them.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1078.003'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The event that proves this is not an administrator being careless. bkp-admin is documented ' +
        'as usable only from the backup management server through a jump host, and ninety days of ' +
        'history agree. All four edits came from a general-purpose workstation. That is not a ' +
        'permissions failure, it is a credential being used somewhere it has never been used, which ' +
        'is the strongest single statement available tonight. Worth being careful about the next ' +
        'sentence: the workstation is assigned to somebody, and that person having a machine the ' +
        'credential was used from is not the same as that person using it. Establish the machine ' +
        'and stop.',
      standIn:
        'All four edits came from RMG-WS-3390, a general-purpose workstation. bkp-admin is ' +
        'documented as jump host only and ninety days of history show every prior session from the ' +
        'backup server. The credential is being used from somewhere it never has been. I am ' +
        'reporting the machine, not the person.',
      commandOptions: [
        { command: 'grep bkp-admin /var/log/auth.log', ...WRONG_TARGET },
        { command: 'awk \'$5=="bkp-admin" {print $9}\' /var/log/auth-archive.log | sort | uniq -c', correct: true, teaches: CORRECT_STEP },
        { command: 'last | grep bkp', ...WRONG_TARGET },
        { command: 'cat /etc/security/access.conf', ...WRONG_TARGET },
        { command: 'who', ...STATUS_CHECK },
      ],
      commandNudge:
        'Check where that account has connected from over its whole history, not just this month.',
      guidance:
        'Ask where this credential is SUPPOSED to be used from, then check where it actually was.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1490'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'detection-engineer'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.dismiss', 'act.preserve', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'Pause is offered as a routine maintenance function, it does not expire, and it notifies ' +
        'nobody. A control that can be switched off indefinitely with no timeout and no ' +
        'notification is not really a control, and that is the finding for the debrief. The urgent ' +
        'part is what is left: the secondary region still holds everything up to the 22nd, so there ' +
        'IS a recovery point, it is eight days stale, and it is missing the removed shares. ' +
        'Resuming replication now protects what remains, and it is the highest-value action ' +
        'available before anybody works out who did this.',
      standIn:
        'Offsite replication was paused at 23:14 on the 22nd and never resumed. Pause is a routine ' +
        'function, it does not expire and it notifies nobody. Secondary region still holds ' +
        'everything up to the 22nd, eight days stale, without the removed shares. Resuming it now.',
      commandNudge:
        'Check what the secondary region still holds before deciding how bad this is.',
      guidance:
        'Find out what recovery capability is LEFT, and protect that first.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1485', 'T1490'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The most sophisticated step and the best news of the hour, which is an unusual pair. ' +
        'Deleting catalogue entries rather than data means the restore tooling reports the backups ' +
        'as gone while the tape and object storage still physically hold them. Anybody checking ' +
        'whether the data survived by asking the backup software gets the wrong answer. The right ' +
        'question is whether the MEDIA still has it, and it does, so recovery is possible and takes ' +
        'several days of catalogue rebuild rather than being impossible. Getting this distinction ' +
        'into the report is the difference between telling a board the records are unrecoverable ' +
        'and telling them recovery will take a week.',
      standIn:
        'Catalogue entries for the three removed shares are deleted for everything before the ' +
        'eleventh, but the tape and object storage still hold the data. The restore tooling cannot ' +
        'find it without the catalogue. This is recoverable by rebuilding from raw media, several ' +
        'days of work. Catalogue state preserved and hashed before anybody touches it.',
      commandNudge:
        'Check whether the underlying media still holds the data, not just what the catalogue says.',
      guidance:
        'The tooling says it is gone. Ask whether the DATA is gone or only the index to it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'false-positive',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.triage-high', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'The tidy story, and the trap. A departing contractor with backup administration rights ' +
        'leaving on the twelfth is exactly the answer a floor wants at minute forty, and it is ' +
        'wrong on the timestamps. Their account was disabled on the twelfth at 17:30 with no ' +
        'authentication after 16:12, and three of the four edits happened on the 16th, 22nd and ' +
        '27th. Their workstation was RMG-WS-2204 and the edits came from RMG-WS-3390. It is not ' +
        'them, and the checks that prove it take two minutes. Naming them anyway would put a real ' +
        'person into a criminal allegation on a coincidence of timing, and it would stop the ' +
        'investigation while somebody is still actively working through the backup estate. Being ' +
        'wrong here is worse than being slow.',
      standIn:
        'Contractor left on the twelfth, account disabled 17:30, no authentication after 16:12, ' +
        'workstation RMG-WS-2204. Three of the four edits are after that date and all four came ' +
        'from a different workstation. It is not them. Ruling it out rather than following it.',
      commandNudge:
        'Compare when that account was disabled against when the four edits happened.',
      guidance:
        'A story that fits the timing is not the same as one that fits the timestamps. Check the ' +
        'dates before you follow it.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.preserve', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'Fourteen media read errors, all retried successfully, with an open vendor case naming head ' +
        'wear and a replacement scheduled. Ninety-six of ninety-six closed the same way this month. ' +
        'It is on the board because the floor is working an incident about backup integrity and ' +
        'these are errors on backup media, which is close enough to feel connected. It is genuinely ' +
        'not: nothing failed, the data read fine, and hardware wear has a support case with a date ' +
        'on it. Attaching it would tell a board that the tapes are degrading at the same moment the ' +
        'floor is telling them the tapes are the recovery path, which is the opposite of useful.',
      standIn:
        'Fourteen tape read errors this month, all retried successfully, vendor case open for head ' +
        'wear with a replacement scheduled. Ninety-six of ninety-six this month were the same. Not ' +
        'related, and the media is fine. Closing it.',
      commandOptions: [
        { command: 'grep -c "read error" /var/log/tape/library.log', ...COUNT_ONLY },
        { command: 'awk \'/read error/ {print $6}\' /var/log/tape/library.log | sort | uniq -c', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/tape/vendor-case-4471.txt', ...DUMP_ALL },
        { command: 'mt -f /dev/nst0 status', ...STATUS_CHECK },
        { command: 'systemctl status tape-library', ...STATUS_CHECK },
      ],
      commandNudge:
        'Check whether those errors actually resulted in any data loss, and whether anybody has a ' +
        'case open.',
      guidance:
        'Errors that retried successfully are not data loss. Check the vendor case before you ' +
        'attach it.',
    },
  ],
};
