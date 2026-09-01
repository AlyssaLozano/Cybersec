/**
 * Scenario 03: Long Notice.
 *
 * A clinical research coordinator working their notice period takes the dataset
 * they built with them.
 *
 * WHY THIS ONE IS DIFFERENT FROM EVERY OTHER SCENARIO
 *
 * Every other incident on this platform has an attacker. This one has a
 * colleague, and almost everything they do is inside their permissions,
 * consistent with their job, and defensible in isolation. There is no
 * compromised credential, no malware, no external infrastructure, and no moment
 * where a control fails.
 *
 * That makes it the scenario where the floor is most likely to do harm. The
 * failure mode is not missing it, it is a seat writing "exfiltration by
 * departing employee" in a report at minute twenty on evidence that supports
 * "downloaded files they had access to", and that sentence follows a real
 * person into an HR meeting. The correct output is a factual account of what
 * was accessed, when, and in what volume, handed to the people whose job it is
 * to decide what it means, with the analyst's own inference clearly separated
 * from the record.
 *
 * WHAT IT TEACHES
 *
 * That "authorised" and "appropriate" are different questions, and that only one
 * of them belongs to the SOC. And that the hardest part of some incidents is
 * writing down what you found without writing down what you assume.
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

const ID = 'long-notice';

export const LONG_NOTICE: Scenario = {
  id: ID,
  title: 'Long Notice',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 14:00 at Ridgeline Medical Group. Data loss prevention raised something small this ' +
    'morning and it has been sitting in the queue. Nothing here is a break-in. Establish what ' +
    'happened and be careful about what you can actually prove.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'forensics',
    'fusion-analyst',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'DLP flagged 340 MB copied to removable media by k.osei',
      detail:
        'Endpoint DLP recorded a copy to a USB mass storage device on the workstation assigned to ' +
        'k.osei at 07:58. The device is on the approved encrypted list and is registered to that ' +
        'user. The account is a clinical research coordinator with legitimate access to the ' +
        'material copied. Rule history: fired 214 times in thirty days, 209 closed as not worth ' +
        'acting on.',
      source: 'k.osei',
      target: 'RMG-WS-4417',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 120,
      surface: 'raw-log',
      summary: 'File access volume for this account is 40 times its ninety-day average',
      detail:
        'The account opened 4,190 files between 06:40 and 07:56. The ninety-day daily average for ' +
        'this account is 104. Every file is inside the research share the account is entitled to ' +
        'reach. The access pattern is sequential by folder, at a rate of roughly one file per ' +
        'second, with no file held open longer than two seconds.',
      source: 'k.osei',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 280,
      surface: 'cloud-audit',
      summary: 'Personal cloud storage sync client authorised against the corporate account',
      detail:
        'An OAuth grant was issued at 06:31 to a consumer file sync application, scoped to read ' +
        'the user profile and offline access. The grant was made by k.osei through the standard ' +
        'consent screen. This application is not on the approved list and is not blocked by ' +
        'policy: the consent screen presents it the same as any other.',
      source: 'k.osei',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 420,
      surface: 'network-flow',
      summary: '1.2 GB uploaded from RMG-WS-4417 to a consumer file sync service',
      detail:
        'A sustained upload from the workstation to a commercial file sharing provider between ' +
        '06:44 and 07:51. The destination is a legitimate business service used elsewhere in the ' +
        'organisation and is allowlisted for egress. Normal outbound for this workstation is ' +
        'under 60 MB a day.',
      source: 'RMG-WS-4417',
      target: '198.51.100.24:443',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.5',
      atSeconds: 560,
      surface: 'alert-queue',
      summary: 'Badge record shows k.osei entering the building at 06:22',
      detail:
        'Physical access logs show a badge-in at the north entrance at 06:22, roughly ninety ' +
        'minutes before this account normally arrives. Ninety days of badge history put this ' +
        'account between 07:45 and 08:20 on every working day. The badge is valid and the entry ' +
        'was permitted.',
      source: 'k.osei',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.6',
      atSeconds: 700,
      surface: 'host-artefact',
      summary: 'A folder of research data compressed into a single archive before the copy',
      detail:
        'A 340 MB archive was created on the workstation desktop at 07:52 and removed at 08:04, ' +
        'six minutes after the USB copy completed. Filesystem metadata shows it contained the ' +
        'same folder tree as the 4,190 files opened that morning. The archiving tool is the one ' +
        'built into the operating system.',
      source: 'RMG-WS-4417',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 840,
      surface: 'alert-queue',
      summary: 'Overnight backup job on rmg-fs-01 reported a 41 percent size increase',
      detail:
        'The nightly incremental for the research file server grew from a typical 2.1 GB to ' +
        '2.96 GB. The backup team reopened the retention policy last week and the change log ' +
        'shows a longer retention window applied on Monday. Rule history: fired 61 times in ' +
        'thirty days, 61 closed as not worth acting on.',
      source: 'rmg-fs-01',
      claimedSeverity: 'low',
    },
  ],
};

export const LONG_NOTICE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'A clinical research coordinator in their notice period arrived ninety minutes early.',
    'They authorised a personal cloud sync application through the standard consent screen, which policy does not block.',
    'They read 4,190 files from a share they are entitled to reach, at machine speed, folder by folder.',
    'They uploaded 1.2 GB to that personal service and copied a 340 MB archive to a registered encrypted USB device.',
    'They deleted the archive six minutes after the copy finished.',
    'Every individual action was permitted. No control failed and no credential was stolen.',
    'What the SOC can establish is what was accessed, when, in what volume, and where it went. Whether that was allowed is not a SOC question, and answering it anyway is how this scenario goes wrong.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1052.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.reset-password'],
      escalateTo: ['log-analyst'],
      why:
        'Approved device, entitled user, entitled data, and a rule that is wrong 209 times out of ' +
        '214. Everything about this row says close it. It is graded as worth escalating not ' +
        'because 340 MB to USB is inherently wrong, but because it is the only visible end of ' +
        'something the operator cannot see the rest of, and one look at the account activity ' +
        'settles it in under a minute. The distinction worth holding: raising this is correct, and ' +
        'raising it as "employee stealing data" is not. It goes up as unusual volume on an account, ' +
        'because that is all anybody knows yet.',
      standIn:
        '340 MB to an approved USB device by a research coordinator who is entitled to the data. ' +
        'Rule is noisy, 209 of 214 closed this month. I am raising it anyway because the volume is ' +
        'unusual for the account and I cannot see what else that account did this morning.',
      commandOptions: [
        { command: 'grep osei /var/log/dlp.log', ...WRONG_TARGET },
        { command: 'awk \'$3=="k.osei"\' /var/log/fileaccess.log | wc -l', correct: true, teaches: CORRECT_STEP },
        { command: 'lsblk', ...WRONG_TARGET },
        { command: 'cat /var/log/dlp.log | tail -50', ...WRONG_TARGET },
        { command: 'dmesg | grep -i usb', ...WRONG_TARGET },
      ],
      commandNudge: 'Look at what that account did in the hours before the copy, not just the copy.',
      guidance:
        'The device being approved answers whether it was permitted. It does not answer what was ' +
        'on it or why.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1005', 'T1083'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.revoke-key', 'act.reset-password'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Forty times the average is the number people quote, and the rate is the number that ' +
        'actually proves something. One file per second, sequential by folder, nothing held open ' +
        'longer than two seconds: nobody read these. That distinction matters because "accessed ' +
        '4,190 files" and "copied a folder tree" sound the same in a report and mean different ' +
        'things, and only the second one is supported. Say the rate, not just the count.',
      standIn:
        '4,190 files opened between 06:40 and 07:56 against a daily average of 104. One per second, ' +
        'sequential, nothing held open. That is a copy operation, not somebody reading.',
      commandOptions: [
        { command: 'awk \'$3=="k.osei"\' /var/log/fileaccess.log | wc -l', ...COUNT_ONLY },
        { command: 'awk \'$3=="k.osei" {print $1}\' /var/log/fileaccess.log | uniq -c', correct: true, teaches: CORRECT_STEP },
        { command: 'ls -la /mnt/research/', ...WRONG_TARGET },
        { command: 'grep -c osei /var/log/auth.log', ...COUNT_ONLY },
        { command: 'find /mnt/research -mmin -400', ...WRONG_TARGET },
      ],
      commandNudge:
        'Count is one thing. Look at the timestamps and work out the rate they were opened at.',
      guidance:
        'Ask whether a person could physically have read what the logs say they opened.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1567.002', 'T1550.001'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.timeline', 'act.preserve', 'act.write-rule'],
      escalateTo: ['ir-lead'],
      why:
        'The user consented, the consent screen worked exactly as designed, and the application is ' +
        'a real product millions of people use. There is no compromise here at all. What there is ' +
        'is a gap: the consent screen presents an unapproved consumer sync client identically to ' +
        'any other application, so the decision to trust it was delegated to somebody with no ' +
        'reason to think about it. Revoking the grant is right and it is containment, not ' +
        'judgement. The finding for the debrief is that the consent screen is the control here, ' +
        'and it is not one.',
      standIn:
        'OAuth grant issued at 06:31 to a consumer sync client, scoped read plus offline access, ' +
        'consented by the user through the normal screen. Not on the approved list, not blocked by ' +
        'policy. I have revoked it.',
      commandNudge:
        'Look at when the grant was issued relative to everything else this morning.',
      guidance:
        'Nothing was bypassed here. Ask what control was supposed to catch it and whether one exists.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1567.002'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Allowlisted destination, legitimate service, encrypted, and twenty times the workstation ' +
        'baseline. This is the event that makes the difference between "took a copy home on a ' +
        'stick" and "put it somewhere they will still have access to after their account is ' +
        'closed", and those have very different consequences for the business. Be precise about ' +
        'the limit: flow records prove 1.2 GB went to that provider. They do not prove which ' +
        'files, and a report that says the research data was uploaded has stated something the ' +
        'network seat cannot see.',
      standIn:
        '1.2 GB out to a commercial file sync provider between 06:44 and 07:51, allowlisted ' +
        'destination, against a 60 MB daily baseline for that workstation. I can prove the volume ' +
        'and the destination. I cannot prove the contents from flow data.',
      commandOptions: [
        { command: 'grep 198.51.100.24 /var/log/flows.log', ...WRONG_TARGET },
        { command: 'awk \'$2=="RMG-WS-4417" {sum+=$6} END {print sum}\' /var/log/flows.log', correct: true, teaches: CORRECT_STEP },
        { command: 'netstat -an', ...WRONG_TARGET },
        { command: 'tcpdump -r /var/cap/today.pcap -c 20', ...WRONG_TARGET },
        { command: 'dig 198.51.100.24', ...WRONG_TARGET },
      ],
      commandNudge:
        'Total the bytes out of that workstation for the morning and compare it to its baseline.',
      guidance:
        'Allowlisted means the traffic was permitted. Ask whether the VOLUME is normal for this host.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1078.003'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.declare', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'On its own a badge-in at 06:22 is a person arriving early, which is not a security event ' +
        'and never will be. It is here because it is the piece that only makes sense next to the ' +
        'others: the OAuth grant at 06:31, first file at 06:40, upload from 06:44. Nine minutes ' +
        'from badge to grant. That sequence is what turns a set of individually defensible actions ' +
        'into a morning that was planned, and no specialist seat can see it because it is spread ' +
        'across four surfaces none of them share. This is what the fusion seat is FOR. It is also ' +
        'the point of maximum danger: "planned" is a reasonable inference and it is still an ' +
        'inference, and it belongs in a report labelled as one.',
      standIn:
        'Badge-in at 06:22, ninety minutes early against ninety days of history. Cloud grant nine ' +
        'minutes later, first file eighteen minutes after that. I am reporting the sequence. What ' +
        'it means is not mine to say.',
      commandNudge: 'Line up the badge time against the first thing that happened on the account.',
      guidance:
        'One early arrival is nothing. Ask what happened in the nine minutes after it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1560.001', 'T1070.004'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The archive is what ties the file reads to the USB copy: same folder tree, created four ' +
        'minutes after the last file, matching the 340 MB. Without it those are two separate ' +
        'observations. The deletion six minutes after the copy is worth stating carefully. It is ' +
        'consistent with tidying up a temporary file, and it is consistent with removing evidence, ' +
        'and nothing here distinguishes those. Say what it is: an archive was created, copied, and ' +
        'deleted, in that order, with these timestamps. Preserve it properly, because in a case ' +
        'that may end up in an employment tribunal the custody record is the difference between ' +
        'evidence and an assertion.',
      standIn:
        '340 MB archive created on the desktop at 07:52 containing the same folder tree as the ' +
        'morning file reads, copied to USB, deleted at 08:04. Recovered from unallocated space, ' +
        'hashed and sealed, custody recorded.',
      commandNudge:
        'Find when the archive was created relative to the last file read and the USB copy.',
      guidance:
        'A deleted file is not automatically a cover-up. Establish the order of events and let the ' +
        'order speak.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.preserve', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'The backup grew because somebody lengthened the retention window on Monday and the change ' +
        'is in the change log. It is on the board because it involves the same file server, on the ' +
        'same night, with a number that went up, and a floor that has just found a data theft will ' +
        'reach for it. Two things follow. Corroborating against the change log takes ninety ' +
        'seconds. And a report that lists this as related has inflated the incident with something ' +
        'that has a documented cause, which makes every other finding in that report easier to ' +
        'doubt.',
      standIn:
        'Backup grew 41 percent on the research file server. Change log shows the retention window ' +
        'was extended Monday. Rule has fired 61 times this month and closed 61 times. Not related, ' +
        'closing it.',
      commandOptions: [
        { command: 'cat /var/log/backup/nightly.log | tail -30', ...WRONG_TARGET },
        { command: 'grep retention /var/log/change-management.log', correct: true, teaches: CORRECT_STEP },
        { command: 'du -sh /mnt/research', ...WRONG_TARGET },
        { command: 'df -h', ...STATUS_CHECK },
        { command: 'systemctl status backup.timer', ...STATUS_CHECK },
      ],
      commandNudge: 'Something changed on that server this week. Find out what and when.',
      guidance:
        'Same host and same night is not the same incident. Look for a documented cause before you ' +
        'attach it to yours.',
    },
  ],
};
