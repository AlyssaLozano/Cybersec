/**
 * Scenario 74: Their Phone.
 *
 * Nine hundred emails left the estate through a phone at two in the morning,
 * and the phone belongs to the person you are about to accuse.
 *
 * WHAT THIS TEACHES
 *
 * How to work an incident where the evidence sits on property the organisation
 * does not own, and where the obvious next step is one somebody is entitled to
 * refuse.
 *
 * The mailbox sync record names a device. The reflex is to ask for that device,
 * and the officer declines, which the policy she signed permits: the agreement
 * gives Fenmarch the right to remove corporate data from a personal handset and
 * no right to inspect one. A floor that treats the refusal as a finding has
 * mistaken somebody exercising a documented right for consciousness of guilt,
 * and the case notes recording that will outlive the incident.
 *
 * WHAT THE ESTATE STILL KNOWS
 *
 * Plenty, because the mail platform is Fenmarch property even when the handset
 * is not. It records which device identifier synced, when it registered, from
 * where, and on what operating system. That is enough, and it is available in
 * ten minutes without anybody's consent.
 *
 * THE ANSWER NOBODY EXPECTS
 *
 * Two devices are registered to that mailbox. The one that took the messages is
 * not hers, was enrolled eleven days ago from an address her account has never
 * otherwise used, and runs an operating system her handset does not. She is not
 * the suspect. She is the second victim, and the first was the enrolment
 * process.
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

const ID = 'their-phone';

export const THEIR_PHONE: Scenario = {
  id: ID,
  title: 'Their Phone',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 10:30 at Fenmarch Credit Union. Nine hundred emails synced to a phone at two this ' +
    'morning. The phone is enrolled under the personal device policy, and HR are already asking ' +
    'whether the member of staff should be suspended.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'forensics',
    'detection-engineer',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Nine hundred messages synced to a mobile device at 02:14',
      detail:
        'A mailbox sync rule fired at 02:54 for the account of j.marrable, a member services ' +
        'officer of six years. Between 02:14 and 02:54, 900 messages were synchronised to a mobile ' +
        'device, including the full contents of a folder holding member complaint correspondence. ' +
        'Her normal pattern is 30 to 60 messages a day during working hours. Rule history: fired 6 ' +
        'times in ninety days, 5 closed as staff setting up new handsets.',
      source: 'j.marrable',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'alert-queue',
      summary: 'She declines to hand over her phone, and is entitled to',
      detail:
        'Asked at 10:10, j.marrable states that she was asleep, that she has not set up a new ' +
        'phone, and that she does not consent to her personal handset being examined. The personal ' +
        'device agreement she signed in 2021 grants Fenmarch the right to remove corporate data ' +
        'from an enrolled device and explicitly reserves no right of inspection or forensic ' +
        'imaging. HR have asked whether she should be suspended today.',
      source: 'HR',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'cloud-audit',
      summary: 'Two devices are registered to that mailbox',
      detail:
        'The mail platform lists two active device registrations for the account. Device A ' +
        'registered in March 2024, syncs on weekday mornings and evenings from mobile carrier ' +
        'ranges, and last synced yesterday at 18:40. Device B registered on 22 August at 23:07 and ' +
        'has synced four times, all between 01:00 and 03:00. The 02:14 sync was Device B.',
      source: 'mail platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'raw-log',
      summary: 'Device B does not match her handset in any respect',
      detail:
        'Device A reports a handset model and operating system version consistent with the phone ' +
        'j.marrable has used since 2024. Device B reports a different manufacturer, a different ' +
        'operating system family, and a client version six releases behind. Device B has never ' +
        'connected from a mobile carrier range. It registered from 198.51.100.202 and has used ' +
        'that address and two neighbours ever since.',
      source: 'mail platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 640,
      surface: 'network-flow',
      summary: 'That address belongs to a hosting provider',
      detail:
        '198.51.100.202 and its two neighbours belong to a low-cost virtual server provider. They ' +
        'appear nowhere in Fenmarch traffic before 22 August. No mobile carrier allocation exists ' +
        'in that range. Every Device B session originates there, which is not how a phone behaves: ' +
        'a handset moves between carrier and home broadband addresses continuously.',
      source: '198.51.100.202',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 800,
      surface: 'cloud-audit',
      summary: 'Enrolling a device needs a password and nothing else',
      detail:
        'Multi-factor authentication is enforced on the web portal and on the VPN. Mobile device ' +
        'enrolment authenticates against the same directory with username and password only, ' +
        'because the authentication method the mail protocol uses does not support the second ' +
        'factor and the exemption was granted in 2021 to allow staff to use their own phones. ' +
        'Forty-one devices have enrolled across the credit union in the last year.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 960,
      surface: 'host-artefact',
      summary: 'Her password appears in a credential dump from July',
      detail:
        'The email address and a password matching the complexity policy appear in a credential ' +
        'collection published in July and mirrored on three forums. The account password was last ' +
        'changed in November 2024 and the platform does not check credentials against breach ' +
        'corpora. Fourteen other Fenmarch addresses appear in the same collection.',
      source: 'credential monitoring',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1120,
      surface: 'alert-queue',
      summary: 'What can and cannot be done to each device',
      detail:
        'The platform can remove corporate data from any enrolled device and can deregister it. It ' +
        'cannot image a device, and Fenmarch has no right to. Deregistering Device B ends its ' +
        'access immediately. j.marrable handles member complaints and is rostered today; removing ' +
        'corporate data from Device A would take her off mail entirely. The 900 messages include ' +
        'complaint correspondence for 214 members.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1280,
      surface: 'raw-log',
      summary: 'Nothing alerts on a device enrolling',
      detail:
        'Device enrolment generates an audit record and no alert. Nothing compares a new ' +
        'registration against the account\'s existing devices, against the address it registers ' +
        'from, or against the hour. The sync volume rule that fired this morning is the only ' +
        'control in this path, it fires on volume alone, and it fired forty minutes after the sync ' +
        'began and eleven days after the device was enrolled.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.10',
      atSeconds: 1420,
      surface: 'alert-queue',
      summary: 'Another account also has two devices',
      detail:
        'A sweep for accounts with multiple registrations flags d.abernathy, with a phone ' +
        'registered in 2023 and a tablet registered on 30 August at 12:40. The tablet registered ' +
        'from the branch wireless range, reports a manufacturer matching the phone, syncs during ' +
        'working hours, and a service desk ticket from 30 August records the tablet being issued ' +
        'and set up at the counter.',
      source: 'mail platform',
      claimedSeverity: 'medium',
    },
  ],
};

export const THEIR_PHONE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The credentials of j.marrable, a member services officer, appear in a credential collection published in July and mirrored on three forums. Her password was last changed in November 2024 and the platform does not check credentials against breach corpora.',
    'On 22 August at 23:07 somebody enrolled a mobile device against her mailbox using that username and password. Device enrolment authenticates with a password only, under an exemption granted in 2021 because the mail protocol does not support the second factor.',
    'That device reports a different manufacturer, a different operating system family and a client six releases behind the handset she has used since 2024, and it has never connected from a mobile carrier range.',
    'Every one of its sessions originates from 198.51.100.202 or two neighbouring addresses, which belong to a low-cost virtual server provider and appear nowhere in Fenmarch traffic before 22 August. A real handset moves between carrier and broadband addresses continuously.',
    'Between 02:14 and 02:54 today it synchronised 900 messages, including a complete folder of member complaint correspondence covering 214 members.',
    'Asked at 10:10, she said she was asleep, had not set up a new phone, and did not consent to her personal handset being examined. The personal device agreement she signed grants Fenmarch the right to remove corporate data and reserves no right of inspection.',
    'She is telling the truth. Her own device synced normally yesterday evening and has done since 2024.',
    'Device enrolment generates an audit record and no alert, and nothing compares a new registration against the account\'s existing devices, its address, or the hour.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1114.002'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.reset-password', 'act.declare'],
      escalateTo: ['cloud-security', 'ir-lead'],
      why:
        'Nine hundred messages against a normal thirty to sixty a day, at two in the morning, ' +
        'including a full folder of member complaints. That is worth raising immediately and it is ' +
        'not worth naming anybody over. Five of the last six firings were staff setting up new ' +
        'handsets, which is the honest base rate and is exactly what this looks like: a large ' +
        'initial sync is what a new phone does. The one field that separates the two readings is ' +
        'not in this row, and the correct instinct is to notice that and go and get it rather than ' +
        'to reason from the hour. Hold the account holder out of it for now. The alert names a ' +
        'mailbox, and a mailbox is not a person until somebody establishes which device did this.',
      standIn:
        'Nine hundred messages at 02:14 against a normal thirty to sixty a day, including a whole ' +
        'folder of member complaints. Raising it. Five of the last six of these were people setting ' +
        'up new phones, and a big first sync is exactly what a new phone does, so I am not naming ' +
        'anybody. The alert names a mailbox and a mailbox is not a person until we know which ' +
        'device did it.',
      commandOptions: [
        { command: "awk -F, '$2==\"j.marrable\" {print $1, $4, $5}' /var/log/mail/sync-events.csv | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"j.marrable\" {s+=$5} END {print s/NR}' /var/log/mail/sync-events.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mail-platform', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/sync-events.csv', ...DUMP_ALL },
        { command: 'net user j.marrable /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Find out what that account normally syncs, and which device this sync went to.',
      guidance:
        'A big sync can be a new phone. Ask what would tell those apart.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['forensics', 'soc-operator'],
      correctActions: ['act.investigate-hold', 'act.notify-legal'],
      outOfLaneActions: ['act.attribute-named', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['forensics', 'cloud-security'],
      why:
        'She declined, and the agreement she signed says she may. It grants Fenmarch the right to ' +
        'remove corporate data from an enrolled handset and reserves no right of inspection or ' +
        'imaging, which is the ordinary shape of a personal device policy and is the price of ' +
        'letting people use their own phones. Two things have to be said out loud on this row ' +
        'because both will otherwise be assumed. A refusal that a policy permits is not evidence of ' +
        'anything, and treating it as consciousness of guilt is a mistake that goes into case notes ' +
        'and outlives the incident. And the request itself was premature: nobody has yet ' +
        'established that her handset is the device in question, so the floor asked a person to ' +
        'surrender personal property before checking which device the platform actually named. HR ' +
        'asking about suspension at 10:10 is the pressure this row exists to model, and the correct ' +
        'answer to them is that there is no finding about this employee yet, not that the ' +
        'investigation is blocked.',
      standIn:
        'She said no and the agreement she signed says she can. We get to remove corporate data from ' +
        'an enrolled phone, we get no right to inspect or image one. Two things I want on the ' +
        'record: a refusal the policy permits is not evidence of anything, and I do not want it ' +
        'written up as though it is. And we asked too early, because nobody has established her ' +
        'handset is the device in the sync record. HR are asking about suspension. The answer is ' +
        'that we have no finding about this employee, not that we are blocked.',
      commandOptions: [
        { command: 'grep -inE "inspect|image|remove|corporate data" /evidence/policy/byod-agreement-2021.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "marrable" /evidence/policy/signed-agreements.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mdm', ...STATUS_CHECK },
        { command: 'cat /evidence/policy/byod-agreement-2021.txt', ...DUMP_ALL },
        { command: 'mdm-cli wipe --user j.marrable --all', ...MUTATE },
      ],
      commandNudge:
        'Read what the personal device agreement actually permits before asking for anything.',
      guidance:
        'She said no. Ask whether the policy says she can.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1098.005'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'Two devices, and the whole case turns on which one. Device A registered in March 2024, ' +
        'syncs on weekday mornings and evenings from mobile carrier ranges, and last synced ' +
        'yesterday evening, which is a person using a phone. Device B registered on 22 August at ' +
        '23:07 and has synced four times, all between one and three in the morning. The 02:14 sync ' +
        'was Device B. That single lookup, available in the platform Fenmarch owns and needing ' +
        'nobody\'s consent, does more than seizing a handset would have done: it establishes that ' +
        'the device in the alert is not the device the account holder uses. Note the sequencing ' +
        'failure for the debrief rather than moving past it. This was ten minutes of work in a ' +
        'system already in reach, and it was available before anybody asked her for her phone.',
      standIn:
        'Two devices and the case turns on which. Device A registered March 2024, syncs weekday ' +
        'mornings and evenings from carrier ranges, last synced yesterday at 18:40. That is a ' +
        'person with a phone. Device B registered 22 August at 23:07 and has synced four times, all ' +
        'between one and three in the morning, and 02:14 was Device B. Ten minutes in a platform we ' +
        'own, no consent needed from anybody, and it tells us more than her handset would have. It ' +
        'was also available before we asked her for it.',
      commandOptions: [
        { command: "awk -F, '$2==\"j.marrable\" {print $3, $4, $6}' /var/log/mail/device-registrations.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"j.marrable\" {print $3}' /var/log/mail/sync-events.csv | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mail-platform', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/device-registrations.csv', ...DUMP_ALL },
        { command: 'grep -c marrable /var/log/mail/device-registrations.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'List every device registered to that mailbox and find which one did the sync.',
      guidance:
        'You cannot look at her phone. Ask what the mail platform knows about it.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1098.005'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'cloud-security', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.reset-password', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'Three independent properties and every one of them says Device B is not her handset. A ' +
        'different manufacturer, a different operating system family, and a client version six ' +
        'releases behind, where Device A matches the phone she has used since 2024. Any one of ' +
        'those could be explained by somebody buying a new phone; all three together cannot, ' +
        'because a person replacing a handset does not also move to an older client on a different ' +
        'platform. And the fourth property is the strongest: Device B has never connected from a ' +
        'mobile carrier range, not once, in eleven days. This is the row that clears her, and ' +
        'clearing somebody is a finding that deserves the same care as accusing them. Write it as ' +
        'positive evidence rather than as absence of evidence, because HR are waiting on an answer ' +
        'and there is a real difference between we cannot show she did it and the device that did ' +
        'it is demonstrably not hers.',
      standIn:
        'Three properties and all three say Device B is not her phone. Different manufacturer, ' +
        'different operating system family, client six releases behind, where Device A matches what ' +
        'she has used since 2024. Any one could be a new phone. All three cannot, because nobody ' +
        'upgrades onto an older client on another platform. And it has never once connected from a ' +
        'carrier range in eleven days. This clears her, and I want that written as positive ' +
        'evidence, not as we cannot show she did it. Those are different sentences and HR are ' +
        'waiting on one of them.',
      commandOptions: [
        { command: "awk -F, '$2==\"j.marrable\" {print $3, $7, $8, $9}' /var/log/mail/device-registrations.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"device-B\" {print $5}' /var/log/mail/sync-events.csv | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mail-platform', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/device-registrations.csv', ...DUMP_ALL },
        { command: 'grep -c device-B /var/log/mail/sync-events.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the reported hardware and operating system of the two devices.',
      guidance:
        'Two devices on one mailbox. Ask what each of them says it is.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1114.002'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'A phone that has never been on a phone network. Every Device B session comes from ' +
        '198.51.100.202 or two neighbours, all belonging to a low-cost virtual server provider, ' +
        'none of them a mobile carrier allocation, and none of them seen anywhere in Fenmarch ' +
        'traffic before 22 August. The reasoning worth naming is about movement rather than ' +
        'reputation: a handset changes address constantly as it moves between carrier and home ' +
        'broadband, so a device that has held three addresses in one hosting range for eleven days ' +
        'is not a handset regardless of what it claims to be. That converts Device B from an ' +
        'unexplained registration into something running in a data centre pretending to be a phone, ' +
        'which is a mail client on a rented server. It also means there is no device to recover ' +
        'anywhere and no handset that was ever involved.',
      standIn:
        'It is a phone that has never been on a phone network. Every Device B session comes from one ' +
        'hosting provider range, three addresses, nothing before 22 August, and no carrier ' +
        'allocation anywhere in it. A real handset changes address constantly as it moves between ' +
        'carrier and home broadband. Something sitting on three addresses in a data centre for ' +
        'eleven days is not a phone whatever it says it is. That is a mail client on a rented ' +
        'server, and there is no handset to recover from anybody.',
      commandOptions: [
        { command: "awk -F, '$3==\"device-B\" {print $6}' /var/log/mail/sync-events.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "198.51.100.20" /var/log/flows-90d.log', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 198.51.100.202', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/mail/sync-events.csv', ...DUMP_ALL },
        { command: 'netstat -an | grep 993', ...WRONG_TARGET },
      ],
      commandNudge:
        'Look at every address Device B has connected from and check whether any is a carrier ' +
        'range.',
      guidance:
        'It claims to be a phone. Ask whether it has ever been on a mobile network.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1078.004'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.scope-estate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'How it was possible, and it is a documented exemption rather than a misconfiguration. ' +
        'Multi-factor is enforced on the web portal and the VPN. Device enrolment authenticates ' +
        'against the same directory with a password alone, because the authentication method the ' +
        'mail protocol uses cannot carry the second factor, and the exemption was granted in 2021 ' +
        'so that staff could use their own phones. Everybody involved in that decision was ' +
        'trading a real risk against a real benefit with the information they had. What it means ' +
        'today is that the strongest control this credit union operates has a path around it that ' +
        'needs only a password, and that path enrols a device which then holds mailbox access ' +
        'indefinitely. Scope it immediately, because the exposure is not one account: forty-one ' +
        'devices have enrolled in the last year, and every one of them enrolled the same way.',
      standIn:
        'This is a documented exemption, not a misconfiguration. Multi-factor is on the web portal ' +
        'and the VPN. Device enrolment takes a password and nothing else, because the mail ' +
        'protocol\'s authentication method cannot carry the second factor, and that was granted in ' +
        '2021 so people could use their own phones. Real risk against real benefit with what they ' +
        'knew then. Today it means our strongest control has a path around it needing only a ' +
        'password, and that path enrols a device that keeps mailbox access indefinitely. Forty-one ' +
        'devices enrolled this year, all the same way.',
      commandOptions: [
        { command: 'grep -iE "exempt|mfa|enrol" /evidence/identity/auth-policy.yaml', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4==\"ENROL\" {print $1, $2}' /var/log/mail/device-registrations.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/auth-policy.yaml', ...DUMP_ALL },
        { command: 'grep -c ENROL /var/log/mail/device-registrations.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what authentication device enrolment requires, and how that differs from the ' +
        'portal.',
      guidance:
        'Somebody enrolled a device. Ask what they needed in order to do that.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1589.001'],
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.preserve', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Where the password came from, and it completes the account without touching anybody\'s ' +
        'property. The address and a matching password appear in a credential collection published ' +
        'in July and mirrored on three forums, the account password was last changed in November ' +
        '2024, and the platform does not check credentials against breach corpora. So the chain is ' +
        'ordinary all the way through: a password reused or leaked elsewhere, published in July, ' +
        'used in August against the one authentication path that accepts a password alone. Nothing ' +
        'in it required skill or targeting. The number to carry into the readout is the other one: ' +
        'fourteen further Fenmarch addresses appear in the same collection, and every one of those ' +
        'accounts can have a device enrolled against it tonight by anybody holding the file. That ' +
        'is the scope of this incident, and it is larger than the mailbox everybody has been ' +
        'looking at.',
      standIn:
        'Here is where the password came from, and we got it without touching anybody\'s property. ' +
        'Her address and a matching password are in a collection published in July and mirrored on ' +
        'three forums. Her password was last changed in November 2024 and we do not check ' +
        'credentials against breach corpora. Leaked in July, used in August, against the one path ' +
        'that takes a password on its own. No skill, no targeting. And fourteen other Fenmarch ' +
        'addresses are in the same file, and every one of them can have a device enrolled tonight ' +
        'by anybody who has it.',
      commandOptions: [
        { command: 'grep -ic "@fenmarch" /evidence/credmon/july-collection-hits.txt', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"j.marrable\" && $3==\"PASSWORD_CHANGE\" {print $1}' /var/log/directory/audit.csv | tail -1", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity', ...STATUS_CHECK },
        { command: 'cat /evidence/credmon/july-collection-hits.txt', ...DUMP_ALL },
        { command: 'curl -s http://198.51.100.202/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check whether that account appears in any published credential collection.',
      guidance:
        'They had her password. Ask where somebody would have got it.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The containment is unusually clean and the order still matters. Deregister Device B, which ' +
        'ends its access immediately, is entirely within the platform, and touches nothing that ' +
        'belongs to anybody. Do not remove corporate data from Device A: it is her phone, it has ' +
        'done nothing, she is rostered today handling member complaints, and wiping it takes her ' +
        'off mail for a reason that no longer exists. Reset the password and end existing sessions, ' +
        'in that order relative to the deregistration, because resetting first while Device B is ' +
        'still enrolled invites a re-enrolment attempt against an account whose owner is now being ' +
        'asked for a new password. Then the compensating control, which is the part that outlives ' +
        'today: the fourteen other credentials in that July collection need forcing to change ' +
        'tonight, and until enrolment can carry a second factor the practical mitigation is an ' +
        'alert on new device registrations rather than a policy nobody can enforce. Say plainly ' +
        'what is left undone: 900 messages covering complaint correspondence for 214 members were ' +
        'read eight hours ago and nothing here recovers them, and the exemption that made this ' +
        'possible is still in place and cannot be closed by this floor.',
      standIn:
        'Deregister Device B. Immediate, entirely in our platform, touches nobody\'s property. Do ' +
        'not wipe Device A: it is her phone, it has done nothing, she is on the counter today ' +
        'handling complaints, and taking her off mail punishes her for our enrolment process. Reset ' +
        'the password and kill sessions after the deregistration, not before, or we invite a ' +
        're-enrolment while she is being asked for a new password. Then the fourteen other ' +
        'credentials in that July file get forced tonight. And until enrolment can carry a second ' +
        'factor, the real mitigation is alerting on new registrations. Left undone: nine hundred ' +
        'messages covering 214 members were read eight hours ago and nothing gets them back.',
      commandNudge:
        'Work out which device you can act on without touching property the organisation does not ' +
        'own.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'defense-evasion',
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The device enrolled eleven days ago, generated an audit record, and produced no alert, so ' +
        'the only control in this path fired on sync volume forty minutes after 900 messages had ' +
        'already been read. That is eleven days of available warning spent, and the fix is not a ' +
        'better volume threshold, because a slower attacker syncing sixty messages a day would ' +
        'never have tripped one. What is missing is anything looking at the registration itself, ' +
        'and three comparisons are available at the moment it happens, all against data the ' +
        'platform already holds: a new device whose manufacturer or operating system family does ' +
        'not match any existing device on that account, a registration from an address that is not ' +
        'a mobile carrier allocation, and a registration outside working hours. Any one would have ' +
        'fired on 22 August at 23:07. Backtest all three across the forty-one enrolments in the ' +
        'last year before promising a volume, and expect the tablet issued at a branch counter to ' +
        'be the argument against the first of them.',
      standIn:
        'It enrolled eleven days ago, wrote an audit record, and alerted nobody. Our only control in ' +
        'this path fired on sync volume forty minutes after nine hundred messages were already ' +
        'read, so we spent eleven days of warning. And a better volume threshold does not fix it, ' +
        'because somebody syncing sixty a day would never trip one. Nothing looks at the ' +
        'registration itself, and three comparisons are available the moment it happens, all on ' +
        'data we already hold: manufacturer or OS family not matching any existing device on the ' +
        'account, an address that is not a carrier allocation, and a registration outside working ' +
        'hours. Any one fires on 22 August at 23:07. Backtesting against the forty-one enrolments ' +
        'this year.',
      commandOptions: [
        { command: "awk -F, '$4==\"ENROL\" {print $1, $2, $6, $7}' /var/log/mail/device-registrations.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -icE "enrol|registration" /evidence/monitoring/mail-alerts.yaml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /evidence/monitoring/mail-alerts.yaml', ...DUMP_ALL },
        { command: 'grep -c ENROL /var/log/mail/device-registrations.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what happens when a device enrols, and what would have to exist to alert on it.',
      guidance:
        'The device enrolled eleven days ago. Ask what noticed.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'detection-engineer'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.reset-password', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'A second account with two registered devices, surfacing at the moment the floor has learned ' +
        'that a second device is the finding, and it is a tablet issued at a branch counter. Four ' +
        'checks close it and each is the mirror of one that convicted Device B: it registered from ' +
        'the branch wireless range rather than a hosting provider, its manufacturer matches the ' +
        'phone already on the account rather than differing from it, it syncs during working hours ' +
        'rather than between one and three in the morning, and a service desk ticket from the same ' +
        'day records it being issued and set up at the counter. Close it. The row is here because ' +
        'the proposal on the table right now is an alert on any account gaining a second device, ' +
        'and this is what that alert looks like when it fires legitimately: an ordinary person ' +
        'being handed an ordinary tablet by an ordinary colleague. A rule that treats that as ' +
        'suspicious will be switched off within a month, and the version that survives is the one ' +
        'comparing the new device against the old rather than counting them.',
      standIn:
        'Second account with two devices and it is a tablet issued at a branch counter. Registered ' +
        'from branch wireless rather than a hosting provider, manufacturer matches the phone already ' +
        'on the account rather than differing, syncs in working hours rather than at two in the ' +
        'morning, and there is a service desk ticket from the same day recording it being set up at ' +
        'the counter. Closing it. And this is exactly what the proposed second-device alert looks ' +
        'like when it fires legitimately, so the rule has to compare the new device against the ' +
        'old, not count them.',
      commandOptions: [
        { command: "awk -F, '$2==\"d.abernathy\" {print $3, $6, $7}' /var/log/mail/device-registrations.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "abernathy" /var/log/servicedesk/tickets.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mail-platform', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/device-registrations.csv', ...DUMP_ALL },
        { command: 'mdm-cli deregister --device tablet-01', ...MUTATE },
      ],
      commandNudge:
        'Check where that second device registered from and whether it matches the first.',
      guidance:
        'Another account with two devices. Ask what is different about this one.',
    },
  ],
};
