/**
 * Scenario 44: Left The Building.
 *
 * A laptop taken from a car, and the difference between what everybody assumes
 * and what anybody can prove.
 *
 * WHAT THIS TEACHES
 *
 * That "it was encrypted" is a claim requiring evidence, and that the evidence
 * usually exists, and that almost nobody goes and gets it.
 *
 * The reflex answer to a stolen laptop is that full disk encryption makes it a
 * property loss rather than a data breach. That is often true and it is not a
 * thing to assume. Encryption can be suspended, and it routinely is, for
 * firmware updates that reboot without a user present. A machine suspended in
 * September and never re-enabled is encrypted in the console, encrypted in
 * policy, and readable on a bench.
 *
 * WHY FORENSICS LEADS A SCENARIO WITH NO HOST
 *
 * Because the whole hour is about the difference between an assertion and a
 * finding, and that is this seat's discipline. There is nothing to image and
 * nothing to analyse. What there is is a set of records that either support a
 * statement to a regulator or do not, and somebody has to say which.
 *
 * WHY IT IS A BEGINNER SCENARIO
 *
 * No attacker, no malware, no clever technique, and a short trail. What is hard
 * is writing the sentence honestly when a much more comfortable sentence is
 * available and everybody in the room would prefer it.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'left-the-building';

export const LEFT_THE_BUILDING: Scenario = {
  id: ID,
  title: 'Left The Building',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 09:15 at Ridgeline Medical Group. An attending had a work laptop taken from her car ' +
    'overnight. Everybody in the room already believes this is fine because the estate is ' +
    'encrypted.',
  roles: [
    'soc-operator',
    'log-analyst',
    'cloud-security',
    'vulnerability-analyst',
    'forensics',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Attending physician reports work laptop stolen from a vehicle overnight',
      detail:
        'A pulmonology attending reported at 08:40 that her assigned laptop was taken from her car ' +
        'between 19:00 and 07:30. A police reference has been raised. The device is RMG-LT-2288 and ' +
        'was issued in 2023. The service desk closed the ticket as "device encrypted, no further ' +
        'action" at 08:52. Rule history: theft reports go to the service desk and no security rule ' +
        'covers them.',
      source: 'RMG-LT-2288',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'The device last checked in at 18:12 and has not been seen since',
      detail:
        'The endpoint management console records a last check-in at 18:12 yesterday, from the ' +
        'hospital wireless network. There has been no contact since. The console lists the device ' +
        'compliance state as compliant and its encryption state as enabled. Compliance state is ' +
        'evaluated at check-in and is not re-evaluated while a device is offline.',
      source: 'endpoint console',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'host-artefact',
      summary: 'Encryption was suspended on 3 September for a firmware update and never resumed',
      detail:
        'The device event history shows disk encryption suspended at 02:14 on 3 September by the ' +
        'firmware update process, which suspends protection so the machine can reboot unattended. ' +
        'Protection is normally resumed at the next successful boot. This device shows no resume ' +
        'event in the twelve days since. Eleven other devices show the same pattern.',
      source: 'endpoint console',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'cloud-audit',
      summary: 'The account holds an active session token valid until Friday',
      detail:
        'The attending account has an active session issued at 08:30 yesterday with a seven day ' +
        'refresh window, valid until Friday. It was last used at 17:58 yesterday from the device. ' +
        'The token is stored on the device and does not require the password to reuse. No sign-in ' +
        'from any unfamiliar location has occurred since the theft.',
      source: 'identity platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'alert-queue',
      summary: 'The device holds local copies of clinical exports',
      detail:
        'Backup records from the last successful sync at 17:40 yesterday show a local documents ' +
        'folder containing four spreadsheets exported from the clinical system between June and ' +
        'September, holding a combined 4,100 patient records with name, medical record number, diagnosis code ' +
        'and appointment history. Local export is permitted and is how clinicians prepare audit ' +
        'submissions.',
      source: 'backup service',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'Remote wipe requires the device to come online and it has not',
      detail:
        'A remote wipe was queued at 08:55 and is pending. It executes only when the device next ' +
        'contacts the management service, which requires it to be powered on and connected to a ' +
        'network. A device that is never connected never receives it. There is no mechanism to ' +
        'confirm destruction and no way to distinguish "not yet wiped" from "will never be wiped".',
      source: 'endpoint console',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Two hundred and forty devices flagged non-compliant this morning',
      detail:
        'The compliance report lists 240 devices as non-compliant, the large majority for a pending ' +
        'operating system update released on Tuesday with a fourteen day grace period. The estate ' +
        'is 3,100 devices and this figure is inside the normal range for the week after a release. ' +
        'Rule history: fired 30 times in thirty days, 30 closed as expected patch lag.',
      source: 'endpoint console',
      claimedSeverity: 'low',
    },
  ],
};

export const LEFT_THE_BUILDING_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'An attending laptop was taken from a car overnight, and the service desk closed the ticket in twelve minutes as device encrypted, no further action.',
    'The management console does say encrypted, and the console is describing the last state it observed rather than the current one.',
    'On 3 September the firmware update process suspended disk encryption so the machine could reboot unattended, which is normal and is meant to resume at the next successful boot.',
    'It never resumed. There is no resume event in the twelve days since, and eleven other devices are in the same state.',
    'So the disk is readable by anybody who opens the machine, and everything anybody has said about this being fine rests on a console field that has been wrong for twelve days.',
    'The device holds four clinical exports covering 4,100 patients with name, medical record number, diagnosis code and appointment history, which local export policy permits.',
    'It also holds a session token valid until Friday that does not need the password to reuse.',
    'The remote wipe is queued and will execute only if the device is ever powered on and connected, and there is no way to tell not yet wiped from never will be.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1078'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['forensics', 'ir-lead'],
      why:
        'Closed by the service desk in twelve minutes as device encrypted, no further action, and ' +
        'that is the whole reason to reopen it. Encrypted is a claim, and nobody checked it: the ' +
        'ticket was closed on an assumption about the estate rather than a fact about this machine. ' +
        'Theft reports do not reach security at all here, which is the process finding worth ' +
        'noting. The rest of this hour is about the difference between what the console says and ' +
        'what can be proved, and it starts with somebody refusing to accept a twelve minute ' +
        'closure.',
      standIn:
        'Attending physician laptop taken from a car overnight, RMG-LT-2288, police reference raised. Service ' +
        'desk closed it at 08:52 as device encrypted, no further action, twelve minutes after it was ' +
        'reported. Nobody checked. Reopening it.',
      commandOptions: [
        { command: 'grep RMG-LT-2288 /var/log/endpoint/devices.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$1==\"RMG-LT-2288\" {print $3, $5, $7}' /var/inventory/devices.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status endpoint-mgmt', ...STATUS_CHECK },
        { command: 'cat /var/log/endpoint/devices.log', ...DUMP_ALL },
        { command: 'grep -c STOLEN /var/log/servicedesk/tickets.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the record for that specific device rather than accepting what the policy says about ' +
        'the estate.',
      guidance:
        'Somebody said it was encrypted. Ask how they know, and whether they checked this machine.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.reset-password'],
      escalateTo: ['forensics', 'ir-lead'],
      why:
        'The console is not lying and it is not answering the question. Last check-in 18:12, nothing ' +
        'since, compliance state compliant and encryption state enabled. The sentence that matters ' +
        'is the last one on the row: compliance is evaluated at check-in and is not re-evaluated ' +
        'while a device is offline. So the console is reporting the state it last observed, which ' +
        'was yesterday evening on the hospital wireless, and it will keep reporting it forever. ' +
        'Reading a management console as current truth rather than as a timestamped observation is ' +
        'one of the most common mistakes available in this job, and it is the entire mechanism of ' +
        'the wrong answer here.',
      standIn:
        'Last check-in 18:12 yesterday from hospital wireless, nothing since. Console says compliant ' +
        'and encrypted. That is the state it last observed, not the current one, and it does not ' +
        're-evaluate while a device is offline. It will say encrypted forever now.',
      commandOptions: [
        { command: "awk -F, '$1==\"RMG-LT-2288\" {print $2, $8}' /var/log/endpoint/checkins.csv | tail -5", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "evaluated\\|checkin" /etc/endpoint/compliance-policy.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status endpoint-mgmt', ...STATUS_CHECK },
        { command: 'cat /var/log/endpoint/checkins.csv', ...DUMP_ALL },
        { command: 'grep -c compliant /var/log/endpoint/checkins.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out when the console last actually looked at that device, and whether it re-checks ' +
        'while offline.',
      guidance:
        'The console says encrypted. Ask when it last checked, and what it does while a device is ' +
        'gone.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1005'],
      firstResponder: 'forensics',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.reset-password', 'act.isolate'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'The finding that inverts the entire incident, and it is one field in a device history ' +
        'nobody opens. Encryption suspended at 02:14 on 3 September by the firmware update process, ' +
        'which is normal and necessary so a machine can reboot unattended, and which is supposed to ' +
        'resume at the next successful boot. No resume event in twelve days. So the disk is ' +
        'readable by anybody who opens the machine, and every reassuring sentence anybody has said ' +
        'this morning rests on a console field that has been wrong since the third. The eleven other ' +
        'devices in the same state are the finding beyond today, and they are the reason this ' +
        'belongs to vulnerability management afterwards rather than to forensics.',
      standIn:
        'Encryption was suspended at 02:14 on 3 September by the firmware update process so the ' +
        'machine could reboot unattended. It is meant to resume at next boot. There is no resume ' +
        'event in twelve days. That disk is readable on a bench. Eleven other devices are in the ' +
        'same state right now.',
      commandOptions: [
        { command: "awk -F, '$1==\"RMG-LT-2288\" && $4 ~ /Bitlocker|encryption/ {print $2, $4, $5}' /var/log/endpoint/device-events.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "suspend\\|resume" /var/log/endpoint/device-events.csv | grep RMG-LT-2288', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status endpoint-mgmt', ...STATUS_CHECK },
        { command: 'cat /var/log/endpoint/device-events.csv', ...DUMP_ALL },
        { command: 'grep -c SUSPEND /var/log/endpoint/device-events.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at the encryption events for that device over the last few weeks, not just its current ' +
        'state.',
      guidance:
        'Encryption can be turned off temporarily. Ask whether it ever came back on.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1539'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'log-analyst', 'mitigation-specialist'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.reset-password', 'act.dismiss', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The part that is not about the disk. An active session token valid until Friday, stored on ' +
        'the device, reusable without the password. On an unencrypted disk that is a working ' +
        'credential sitting in a car park, and it reaches everything the account can reach rather ' +
        'than only what happens to be saved locally. Resetting the password is graded out of lane ' +
        'because it does not end a session, which this platform teaches in `already-logged-in` and ' +
        'is worth relearning here in a completely different context. The absence of any unfamiliar ' +
        'sign-in is worth reporting and worth not over-reading: nobody has used it yet is a ' +
        'statement about the last thirteen hours, not about the next four days.',
      standIn:
        'The account has an active session token valid until Friday, stored on the device, reusable ' +
        'without the password. On an unencrypted disk that is a live credential in somebody car ' +
        'park, and it reaches everything the account reaches. No unfamiliar sign-in yet, which ' +
        'covers thirteen hours and says nothing about the next four days. Revoking it now.',
      commandNudge:
        'Check what sessions that account has open and how long they last without a password.',
      guidance:
        'The disk is one problem. Ask what else was on the machine that would let somebody in.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1005'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'What is on it, which sizes the notification, and the last sentence is the one that keeps ' +
        'the report fair. Four exports, 4,100 patients, name, medical record number, diagnosis code and ' +
        'appointment history, which is special category health data by any reading. Local export is ' +
        'permitted and is how clinicians prepare audit submissions, so the attending did nothing ' +
        'wrong and the report has to say so plainly or the organisation will conclude the answer is ' +
        'to discipline her. The useful observation is that the backup record is the only reason ' +
        'anybody knows what was on the machine at all: without a sync at 17:40 the honest answer to ' +
        'what was lost would have been that nobody knows.',
      standIn:
        'Last sync at 17:40 shows four clinical exports in her documents folder, 4,100 patients, ' +
        'name, medical record number, diagnosis code, appointment history. Local export is permitted and it is ' +
        'how audit submissions get prepared, so she did nothing wrong. And that backup is the only ' +
        'reason we know what was on it.',
      commandOptions: [
        { command: 'grep -A8 "RMG-LT-2288" /var/log/backup/last-sync-manifest.txt', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$1==\"RMG-LT-2288\" {print $4, $6}' /var/log/backup/inventory.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status backup-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/backup/last-sync-manifest.txt', ...DUMP_ALL },
        { command: 'grep -c xlsx /var/log/backup/last-sync-manifest.txt', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what was actually on the device at its last backup, field by field.',
      guidance:
        'Ask what was on it. Then ask whether the person did anything they were not allowed to do.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['forensics', 'cloud-security'],
      correctActions: ['act.declare', 'act.notify-legal'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.isolate'],
      escalateTo: [],
      why:
        'The remote wipe is queued and working exactly as designed, and it is not a control anybody ' +
        'can rely on here. It executes only when the device next contacts the service, which needs ' +
        'it powered on and connected, and somebody who has taken a laptop for the data will not do ' +
        'either. There is no confirmation of destruction and no way to distinguish not yet wiped ' +
        'from never will be, so the queued wipe will sit at pending indefinitely and mean nothing. ' +
        'The trap is treating it as mitigation in the notification: writing "a remote wipe has been ' +
        'issued" invites a reader to believe the data is gone. The honest position is unencrypted ' +
        'disk, 4,100 records, wipe queued and unlikely to execute, and it goes to the regulator on ' +
        'that basis.',
      standIn:
        'Wipe is queued and will only run if the device is powered on and connected, and there is no ' +
        'confirmation of destruction either way. Somebody who took this for the data will do ' +
        'neither. It will sit at pending forever. I am not putting it in the notification as ' +
        'mitigation. Unencrypted disk, 4,100 records, wipe unlikely to execute.',
      commandNudge:
        'Find out what has to happen for that wipe to run, and whether anything confirms it did.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['vulnerability-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'Two hundred and forty non-compliant devices on the morning a non-compliant device turns out ' +
        'to matter. They are a pending operating system update released on Tuesday with a fourteen ' +
        'day grace period, 240 out of an estate of 3,100 is inside the normal range for the week ' +
        'after a release, and 30 of 30 this month were the same. The check is what kind of ' +
        'non-compliance, which takes a minute. The contrast is the point: this list is 240 devices ' +
        'the console correctly knows are behind on patches, and the device that mattered was ' +
        'sitting on the same console marked compliant. Volume of known problems is not the same as ' +
        'exposure, and the compliant list is where the eleven suspended-encryption devices are ' +
        'hiding.',
      standIn:
        '240 non-compliant is a pending OS update from Tuesday inside its fourteen day grace, out of ' +
        '3,100 devices, normal for the week after a release. Thirty of thirty this month the same. ' +
        'Worth saying: our device was on the compliant list, and so are the eleven with encryption ' +
        'suspended. Closing this one.',
      commandOptions: [
        { command: "awk -F, '$5==\"NONCOMPLIANT\" {print $6}' /var/log/endpoint/compliance.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "grace\\|release" /var/log/change-management.log | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status endpoint-mgmt', ...STATUS_CHECK },
        { command: 'cat /var/log/endpoint/compliance.csv', ...DUMP_ALL },
        { command: 'grep -c NONCOMPLIANT /var/log/endpoint/compliance.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check what those devices are non-compliant FOR before treating the number as a problem.',
      guidance:
        'A long list of known problems is not the same as exposure. Ask what kind of non-compliance ' +
        'this is.',
    },
  ],
};
