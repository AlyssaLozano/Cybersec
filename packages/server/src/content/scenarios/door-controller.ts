/**
 * Scenario 97: It Opens Doors.
 *
 * The box on the internet with the default password on it controls 340 doors
 * in a hospital.
 *
 * WHAT THIS TEACHES
 *
 * That some systems have consequences you cannot express in records or
 * downtime, and that the job of the person triaging it is to notice which kind
 * they are looking at. Everything on this board would be a routine exposure
 * finding on a web server. On a door controller it is a stranger being able to
 * open the pharmacy store.
 *
 * It also teaches a specific and very common evidence trap. The controller
 * keeps the last five hundred log entries and then overwrites the oldest, so
 * the earliest entry in its log is not the earliest thing that happened. A
 * beginner reading that log will report a start date that is simply the point
 * at which the log filled up.
 *
 * THE DECOY IS A DOOR THAT OPENED AT THREE IN THE MORNING
 *
 * It looks exactly like somebody walking in, and it is a night pharmacist
 * doing a documented controlled drug count. Checking it costs one phone call,
 * and reporting it without checking would put a nurse into an incident report.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  BROAD_SEARCH,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
} from './distractors.js';

const ID = 'it-opens-doors';

export const IT_OPENS_DOORS: Scenario = {
  id: ID,
  title: 'It Opens Doors',
  difficulty: 'beginner',
  durationMinutes: 50,
  situation:
    'It is 09:30 at Ridgeline Medical. Something of ours has been answering the internet since ' +
    'June, and it is the system that unlocks the doors.',
  roles: [
    'soc-operator',
    'network-analyst',
    'log-analyst',
    'vulnerability-analyst',
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
      summary: 'Somebody outside tells us we have a device on the internet',
      detail:
        'A vulnerability disclosure service emailed at 08:50 to say that 203.0.113.31, which belongs ' +
        'to Ridgeline, is serving an unauthenticated web interface identifying itself as a building ' +
        'access controller. They found it in a routine internet-wide scan, say they did not log in, ' +
        'and asked for a contact address.',
      source: 'external notification',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 170,
      surface: 'network-flow',
      summary: 'It has been reachable since a firewall change in June',
      detail:
        'The address maps to RID-ACS-01, the door access controller in the facilities plant room. It ' +
        'serves a web interface on port 80 with no encryption. A firewall rule added on 11 June ' +
        'permits inbound access from any address, requested by the access control supplier so their ' +
        'engineers could support it remotely without visiting site.',
      source: 'perimeter firewall',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 350,
      surface: 'host-artefact',
      summary: 'The password is the one printed in the manual',
      detail:
        'The administrator account on RID-ACS-01 uses the manufacturer default credential, which is ' +
        'printed in the installation manual available on the manufacturer public website. It has ' +
        'never been changed. The supplier support process uses that account, and their engineers ' +
        'expect it to work.',
      source: 'RID-ACS-01',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 530,
      surface: 'raw-log',
      summary: 'Its log holds five hundred lines and then starts again',
      detail:
        'The controller keeps the most recent 500 log entries and overwrites the oldest as new ones ' +
        'arrive. The earliest entry currently in it is dated 19 August. The device has been running ' +
        'since 2019 and the firewall rule was added on 11 June, so anything between June and August ' +
        'has already been overwritten and is not recoverable from the device.',
      source: 'RID-ACS-01',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 710,
      surface: 'raw-log',
      summary: 'Eight sign-ins from outside in what is left of the log',
      detail:
        'Since 19 August the log shows eight successful administrator sign-ins from external ' +
        'addresses. Six are from the supplier documented support range and correspond to two ticket ' +
        'numbers. Two, on 26 August and 1 September, are from a hosting provider range that appears ' +
        'nowhere in the supplier contract. Both lasted under two minutes and neither is followed by ' +
        'a configuration change in the log.',
      source: 'RID-ACS-01',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 890,
      surface: 'host-artefact',
      summary: 'What it controls, and what it does not',
      detail:
        'RID-ACS-01 governs 340 doors including the pharmacy store, the medical records room and the ' +
        'ground floor server room. It does not govern fire doors or emergency exits, which are ' +
        'mechanical and fail open by building regulation, so nobody can be trapped by this system. ' +
        'It can unlock any door it governs from the web interface.',
      source: 'facilities',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1070,
      surface: 'network-flow',
      summary: 'A second Ridgeline device answering the internet',
      detail:
        'The same sweep finds 203.0.113.44 serving a read-only status page for the theatre air ' +
        'handling plant. It is listed in the estates maintenance contract, was agreed in 2022, ' +
        'exposes temperature and fan status and nothing else, has no login and no control function, ' +
        'and is monitored by the maintenance supplier under that agreement.',
      source: 'network monitoring',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.8',
      atSeconds: 1250,
      surface: 'raw-log',
      summary: 'A door opened at ten past three in the morning',
      detail:
        'The door log shows the pharmacy store opening at 03:14 on 27 August, the night after one of ' +
        'the unexplained sign-ins. There was no scheduled access. The badge recorded is that of a ' +
        'night pharmacist, and the controlled drug register for that night carries a countersigned ' +
        'entry timed 03:15 for a routine stock count.',
      source: 'RID-ACS-01',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1430,
      surface: 'alert-queue',
      summary: 'What can be done this morning',
      detail:
        'The firewall rule can be removed in five minutes, which ends the exposure and stops the ' +
        'supplier supporting the system remotely. Changing the default password requires the ' +
        'supplier, because their engineers use that account and nobody at Ridgeline knows what else ' +
        'depends on it. The supplier can be given a restricted route in about a day. Nothing about ' +
        'any of this affects a door working from the inside with a badge.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1610,
      surface: 'alert-queue',
      summary: 'Nobody has a list of what answers the internet',
      detail:
        'The June rule was raised as a supplier request through facilities and approved by the ' +
        'facilities manager. It did not pass through any security review, because none exists for ' +
        'that route. Ridgeline has no inventory of internet-facing devices, and a scan of its own ' +
        'external range has never been run. The disclosure service found this before Ridgeline did.',
      source: 'security programme',
      claimedSeverity: 'critical',
    },
  ],
};

export const IT_OPENS_DOORS_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On 11 June a firewall rule was added at the request of the access control supplier, so their engineers could support the system without visiting site. It permits inbound access from any address to RID-ACS-01, the door access controller, which serves an unencrypted web interface on port 80.',
    'The administrator account uses the manufacturer default credential, printed in an installation manual on the manufacturer public website, and has never been changed. The supplier support process depends on that account working.',
    'So since 11 June anybody on the internet could sign in to the system that unlocks 340 doors, including the pharmacy store, the medical records room and the ground floor server room. Fire doors and emergency exits are mechanical and fail open by regulation, so nobody can be trapped by it.',
    'The controller keeps the last 500 log entries and overwrites the oldest. Its earliest surviving entry is 19 August, which is not when anything started: everything between 11 June and 19 August has been overwritten and cannot be recovered from the device.',
    'In what remains there are eight external administrator sign-ins. Six are the supplier support range against two ticket numbers. Two, on 26 August and 1 September, come from a hosting range that appears nowhere in the contract, lasted under two minutes each, and are followed by no configuration change in the log.',
    'The pharmacy store opened at 03:14 on 27 August, the night after one of those sign-ins, with no scheduled access. It is a night pharmacist doing a routine controlled drug count, countersigned in the register at 03:15.',
    'The theatre air handling status page is contractually agreed, read-only, has no login and no control function.',
    'Removing the firewall rule takes five minutes and ends both the exposure and the supplier remote support. Changing the default password needs the supplier, because nobody at Ridgeline knows what else uses that account.',
    'The June rule went through facilities and was approved by the facilities manager. No security review exists for that route, Ridgeline has no inventory of internet-facing devices, and has never scanned its own external range. A stranger found this first.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'network-analyst'],
      correctActions: ['act.triage-high', 'act.preserve', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.tune'],
      escalateTo: ['network-analyst', 'ir-lead'],
      why:
        'Somebody outside found this and wrote in, which is the whole reason Ridgeline knows. Treat ' +
        'the message as a finding rather than as a claim to be sceptical about, and check the ' +
        'address is Ridgeline before anything else, because that is one lookup and everything else ' +
        'depends on it. Raise it high on two words: building access controller. That phrase is the ' +
        'difference between a routine exposure and this, and an operator who reads unauthenticated ' +
        'web interface and stops there has read the ordinary half of the sentence. The question ' +
        'that follows is not how bad is the vulnerability, it is what does this box actually do, and ' +
        'nobody in the room can answer that yet.',
      standIn:
        'Somebody outside found this and wrote in, which is why we know at all. Treat it as a finding ' +
        'and check the address is ours, which is one lookup and everything else hangs off it. Raising ' +
        'it high on two words: building access controller. That is the difference between a routine ' +
        'exposure and this one, and if you read unauthenticated web interface and stopped there you ' +
        'read the ordinary half. The next question is not how bad the vulnerability is, it is what ' +
        'that box does, and none of us can answer that yet.',
      commandOptions: [
        { command: "grep -i '203.0.113.31' /evidence/assets/external-addresses.csv", correct: true, teaches: CORRECT_STEP },
        { command: "dig -x 203.0.113.31 +short", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status httpd', ...STATUS_CHECK },
        { command: 'cat /evidence/assets/external-addresses.csv', ...DUMP_ALL },
        { command: 'curl -s http://203.0.113.31/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Confirm the address is yours, then find out which device it is.',
      guidance:
        'Somebody says you have a device on the internet. Ask which one.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'network-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.corroborate', 'act.timeline'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'A firewall rule added on 11 June at the supplier request, permitting any address inbound, ' +
        'so their engineers could support the system without driving to site. That is a sensible ' +
        'thing to want and a bad way to get it, and nobody involved was being careless: facilities ' +
        'asked for remote support, somebody made remote support work, and the word any in the source ' +
        'field is the entire difference between what was asked for and what was built. The date is ' +
        'the important output of this row. Eleven June is the start of the exposure, which means ' +
        'the window is nearly three months, and every question that follows about what happened has ' +
        'to be asked against that window rather than against whatever the logs happen to hold.',
      standIn:
        'Firewall rule added on the eleventh of June at the supplier request so engineers could ' +
        'support it without driving to site. Sensible thing to want, bad way to get it, and nobody ' +
        'was careless. Facilities asked for remote support, somebody made remote support work, and ' +
        'the word any in the source field is the whole gap between what was asked for and what got ' +
        'built. The date is what matters here. Eleventh of June, so the window is nearly three ' +
        'months, and every question about what happened gets asked against that window and not ' +
        'against whatever the logs happen to hold.',
      commandOptions: [
        { command: "grep -iE '203.0.113.31|RID-ACS' /evidence/firewall/ruleset.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'access control|supplier' /evidence/change/tickets-june.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewalld', ...STATUS_CHECK },
        { command: 'cat /evidence/firewall/ruleset.txt', ...DUMP_ALL },
        { command: 'firewall-cmd --remove-port=80/tcp --permanent', ...MUTATE },
      ],
      commandNudge:
        'Find the rule that exposes it and the ticket that asked for it, and note the date.',
      guidance:
        'It is reachable. Ask since when.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.corroborate', 'act.compensating-control', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.reset-password'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The password is the one in the manual and the manual is on the manufacturer public website, ' +
        'so there is no attack here to describe. Anybody who found the device could read the ' +
        'documentation and sign in, and describing this as an exploit in the write-up would be ' +
        'wrong. Resist the obvious action for one more minute, because the supplier support process ' +
        'uses that account and nobody at Ridgeline knows what else expects it to work. Changing it ' +
        'this morning without asking is how the door system stops responding to its own supplier ' +
        'during an incident about the door system. The right move is to close the exposure at the ' +
        'firewall, which needs nobody permission, and to treat the credential as a separate piece of ' +
        'work with the supplier in the room.',
      standIn:
        'The password is the one in the manual and the manual is on their public website. There is no ' +
        'attack to describe here. Anybody who found the box could read the documentation and sign ' +
        'in, and calling that an exploit in the write-up would be wrong. Now hold off on the obvious ' +
        'action for a minute, because supplier support uses that account and nobody here knows what ' +
        'else expects it. Change it this morning without asking and the door system stops answering ' +
        'its own supplier in the middle of an incident about the door system. Close it at the ' +
        'firewall, which needs nobody permission, and do the credential with the supplier in the ' +
        'room.',
      commandOptions: [
        { command: "grep -iE 'default|admin' /evidence/vendor/acs-installation-manual.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'password_changed|last_set' /evidence/acs/account-status.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status acs', ...STATUS_CHECK },
        { command: 'cat /evidence/acs/account-status.txt', ...DUMP_ALL },
        { command: 'acs-cli passwd admin --set NewPass123', ...MUTATE },
      ],
      commandNudge:
        'Find out whether the credential is a default, and who else relies on it before changing it.',
      guidance:
        'It is on the internet. Ask what stops somebody signing in.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.preserve', 'act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.declare', 'act.contact-attacker'],
      escalateTo: ['forensics', 'ir-lead'],
      why:
        'The log holds five hundred entries and then writes over the oldest, so the earliest line in ' +
        'it is 19 August and that is not when anything began. The device has been exposed since 11 ' +
        'June. Everything in between has already been destroyed by the device itself in the course ' +
        'of working normally, and no amount of care from here recovers it. This is the trap on the ' +
        'board and it is worth saying in one sentence the room can carry: the oldest entry in a log ' +
        'is the oldest entry the log still has, which is only the start of anything if you know the ' +
        'log never filled. A report saying activity began on 19 August would be wrong, would be ' +
        'believed, and would understate the window by ten weeks. Take a copy of what is there before ' +
        'anybody touches the device, because every new entry destroys an old one.',
      standIn:
        'It keeps five hundred entries and writes over the oldest. Earliest line is the nineteenth of ' +
        'August, and that is not when anything started. It has been exposed since the eleventh of ' +
        'June. Everything in between was destroyed by the device working normally and nothing gets ' +
        'it back. One sentence to carry: the oldest entry in a log is the oldest entry it still has, ' +
        'and that is only a start date if you know it never filled. Say activity began on the ' +
        'nineteenth and you will be believed and you will be ten weeks wrong. Copy what is there ' +
        'before anybody touches it, because every new entry destroys an old one.',
      commandOptions: [
        { command: "head -1 /evidence/acs/controller.log; wc -l /evidence/acs/controller.log", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'ring|buffer|max_entries|rotate' /evidence/vendor/acs-installation-manual.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status acs', ...STATUS_CHECK },
        { command: 'cat /evidence/acs/controller.log', ...DUMP_ALL },
        { command: 'acs-cli log clear', ...MUTATE },
      ],
      commandNudge:
        'Check the oldest entry against the exposure date, and find out how many entries the device keeps.',
      guidance:
        'The log starts in August. Ask whether that is when it started.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1078.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate', 'act.preserve'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.tune'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Eight external sign-ins, six of them the supplier support range against two ticket numbers, ' +
        'and two from a hosting range that is nowhere in the contract. Separating those two groups ' +
        'is the work, and the method is worth learning because it applies to every third party: ' +
        'compare the source against the contract, and compare the timing against the tickets. Six ' +
        'match on both and two match on neither. Report the two carefully. They lasted under two ' +
        'minutes and produced no configuration change in the log, which is consistent with somebody ' +
        'signing in, looking, and leaving, and is also consistent with somebody doing something the ' +
        'log does not record. Do not resolve that from the log alone, and remember that the ten ' +
        'weeks before 19 August are gone, so eight is the number in what survives rather than the ' +
        'number that happened.',
      standIn:
        'Eight external sign-ins. Six are the supplier support range against two ticket numbers, two ' +
        'are a hosting range that is nowhere in the contract. Separating them is the work and the ' +
        'method works for every third party: compare source against the contract and timing against ' +
        'the tickets. Six match both, two match neither. Report those two carefully. Under two ' +
        'minutes each, no configuration change in the log, which fits somebody signing in and ' +
        'looking, and also fits somebody doing something this log does not record. And eight is what ' +
        'survives, not what happened. The ten weeks before the nineteenth are gone.',
      commandOptions: [
        { command: "grep -i 'login' /evidence/acs/controller.log | awk '{print $4}' | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'support range|ip' /evidence/contracts/acs-support.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status acs', ...STATUS_CHECK },
        { command: 'cat /evidence/acs/controller.log', ...DUMP_ALL },
        { command: 'grep -c login /evidence/acs/controller.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Group the sign-ins by source address and check each group against the supplier contract.',
      guidance:
        'Somebody signed in. Ask whether it was the supplier.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['vulnerability-analyst', 'mitigation-specialist'],
      correctActions: ['act.scope-estate', 'act.notify-legal', 'act.sequence-remedy'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist'],
      why:
        'Three hundred and forty doors, including the pharmacy store, the records room and the ' +
        'server room, and the interface can unlock any of them. That sentence is the severity and it ' +
        'should be the first line of anything written about this, because every other fact on the ' +
        'board is ordinary and this one is not. Say the reassuring half accurately too rather than ' +
        'leaving it out: fire doors and emergency exits are mechanical and fail open by building ' +
        'regulation, so nobody can be locked in by this system, and a hospital hearing that its door ' +
        'system was on the internet will ask that question within a minute. Getting the safety ' +
        'answer right and unprompted is what makes the rest of the report credible to people who do ' +
        'not work in security.',
      standIn:
        'Three hundred and forty doors including the pharmacy store, the records room and the server ' +
        'room, and that interface can unlock any of them. That is the severity and it is the first ' +
        'line of anything we write, because everything else here is ordinary and that is not. And ' +
        'get the reassuring half right and say it before anybody asks: fire doors and emergency ' +
        'exits are mechanical and fail open by regulation, so nobody can be locked in. A hospital ' +
        'hearing its door system was on the internet asks that within a minute, and answering it ' +
        'correctly and unprompted is what makes the rest of the report believable to people who are ' +
        'not us.',
      commandNudge:
        'Find out what that controller governs, and specifically whether it governs anything to do with escape.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['soc-operator', 'vulnerability-analyst'],
      correctActions: ['act.corroborate', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'A second device answering the internet, and it is fine. Read-only status page for the ' +
        'theatre air handling, in the estates maintenance contract since 2022, no login, no control ' +
        'function, temperature and fan status and nothing else, monitored by the supplier under that ' +
        'agreement. Close it. Worth the two minutes because the room has just learned that an ' +
        'internet-facing facilities device is a serious finding, and the lesson from this one is ' +
        'that internet-facing is not the finding: what it can do is. One box lets a stranger open ' +
        'the pharmacy and one lets them read a fan speed. Sorting by exposure alone puts those in ' +
        'the same bucket, and a floor that reports both at the same severity will not be believed ' +
        'about either.',
      standIn:
        'Second device on the internet and it is fine. Read-only status page for theatre air ' +
        'handling, in the estates contract since 2022, no login, no control function, temperature ' +
        'and fan speed. Closing it. Worth two minutes because we have just learned that an ' +
        'internet-facing facilities box is serious, and this one teaches the opposite half: ' +
        'internet-facing is not the finding, what it can do is. One box lets a stranger open the ' +
        'pharmacy, one lets them read a fan speed. Report those at the same severity and nobody ' +
        'believes us about either.',
      commandOptions: [
        { command: "grep -i '203.0.113.44' /evidence/contracts/estates-maintenance.csv", correct: true, teaches: CORRECT_STEP },
        { command: "curl -s -o /dev/null -w '%{http_code}' http://203.0.113.44/api/control", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status bms', ...STATUS_CHECK },
        { command: 'cat /evidence/contracts/estates-maintenance.csv', ...DUMP_ALL },
        { command: 'grep -rn "203.0.113" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'For the second device, find out what it can actually do rather than that it is reachable.',
      guidance:
        'There is a second exposed device. Ask what it controls.',
    },
    {
      eventId: 'ev.8',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.timeline', 'act.dismiss'],
      outOfLaneActions: ['act.declare', 'act.attribute-named', 'act.isolate', 'act.triage-high'],
      escalateTo: ['ir-lead'],
      why:
        'The pharmacy store opening at ten past three on the night after an unexplained sign-in is ' +
        'the most alarming line on the board, and it is a night pharmacist doing a routine ' +
        'controlled drug count, countersigned in the register at 03:15. One phone call and one ' +
        'register. Check it before writing anything, because this is the row where a floor produces ' +
        'real harm: reporting an unexplained overnight pharmacy access in an incident about a ' +
        'compromised door system puts a named nurse into a document that will be read by people who ' +
        'will not read the correction. The lesson is about the order of operations rather than about ' +
        'suspicion. A badge event is a record that a badge was used, and the person it names is the ' +
        'cheapest source of evidence available and is usually sitting somewhere with an answer.',
      standIn:
        'Pharmacy store at ten past three, the night after an unexplained sign-in. Most alarming line ' +
        'on the board, and it is a night pharmacist doing a controlled drug count, countersigned in ' +
        'the register at 03:15. One phone call and one register. Check it before writing anything, ' +
        'because this is where we do real harm. An unexplained overnight pharmacy access inside an ' +
        'incident about a compromised door system puts a named nurse into a document, and the people ' +
        'who read that will not read the correction. A badge event is a record that a badge was ' +
        'used. The person it names is the cheapest evidence available and is usually sitting ' +
        'somewhere with an answer.',
      commandOptions: [
        { command: "grep -iE '03:1|pharmacy' /evidence/acs/door-events-august.log", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE '27 August|03:15' /evidence/pharmacy/cd-register.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status acs', ...STATUS_CHECK },
        { command: 'cat /evidence/acs/door-events-august.log', ...DUMP_ALL },
        { command: 'grep -rn "pharmacy" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Before reporting an overnight door event, check the paper record for that night.',
      guidance:
        'A door opened at three in the morning. Ask who was on shift.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'network-analyst'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Remove the firewall rule first, five minutes, and be clear about what it costs: the ' +
        'supplier loses remote support for the door system, which means a site visit for the next ' +
        'fault. That is a real cost and it is obviously worth paying, so make the trade explicitly ' +
        'rather than presenting it as free, because facilities will find out either way and it is ' +
        'better they hear it from this room. Ring the supplier this morning to arrange a restricted ' +
        'route, about a day, which gets support back properly. The credential comes after that ' +
        'conversation rather than before it, for the reason already given. And say the thing ' +
        'everybody in a hospital wants to hear: none of this touches a door working from the inside ' +
        'with a badge, so nothing about the remedy affects anybody doing their job. Deliberately ' +
        'left undone: ten weeks of the device log are gone and nothing recovers them, so what ' +
        'happened between June and August cannot be established, and the two unexplained sign-ins ' +
        'cannot be resolved from anything Ridgeline holds.',
      standIn:
        'Firewall rule off first, five minutes, and be honest about the cost: the supplier loses ' +
        'remote support for the door system, so the next fault is a site visit. Real cost, obviously ' +
        'worth paying, and make the trade out loud rather than pretending it is free, because ' +
        'facilities find out either way and better from us. Ring the supplier this morning for a ' +
        'restricted route, about a day, and support comes back properly. Credential after that ' +
        'conversation, not before. And say the thing a hospital wants to hear: none of this touches ' +
        'a door working from the inside with a badge. Nobody doing their job notices. Left undone: ' +
        'ten weeks of log are gone, June to August cannot be established, and those two sign-ins ' +
        'cannot be resolved from anything we hold.',
      commandNudge:
        'Find the action that ends the exposure now, and say plainly what it breaks.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.scope-estate', 'act.propose-rule', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'A stranger found this before Ridgeline did, and that is the finding rather than an ' +
        'embarrassment. There is no inventory of internet-facing devices and the external range has ' +
        'never been scanned, so the same disclosure service is running a better check on Ridgeline ' +
        'estate than Ridgeline is, for free, without being asked. The fix is one scheduled scan of ' +
        'an address range the organisation already owns and knows, which is a small enough piece of ' +
        'work that its absence is the interesting part. The second half is the route: the June rule ' +
        'came through facilities and was approved by the facilities manager, because no security ' +
        'review exists for supplier requests raised that way, and that is not a failure of the ' +
        'facilities manager, who approved a supplier request for supplier support exactly as they ' +
        'are meant to. Predict it plainly: with that route unchanged, the next supplier who wants ' +
        'remote access will get it the same way, and the only question is what their box does.',
      standIn:
        'A stranger found this before we did, and that is the finding, not an embarrassment. No ' +
        'inventory of what faces the internet, and we have never scanned our own external range, so ' +
        'a disclosure service is running a better check on our estate than we are, for free, without ' +
        'being asked. The fix is one scheduled scan of a range we already own and know, which is ' +
        'small enough that its absence is the interesting bit. Second half is the route: the June ' +
        'rule went through facilities and the facilities manager approved it, because no security ' +
        'review exists for supplier requests raised that way. That is not his failure, he approved a ' +
        'supplier request for supplier support exactly as he is supposed to. Leave the route alone ' +
        'and the next supplier who wants remote access gets it the same way, and the only question ' +
        'is what their box does.',
      commandOptions: [
        { command: "awk -F, '$3==\"external\" {print $1, $2}' /evidence/assets/external-addresses.csv", correct: true, teaches: CORRECT_STEP },
        { command: "grep -icE 'security review|approved by security' /evidence/change/tickets-june.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status nessus', ...STATUS_CHECK },
        { command: 'cat /evidence/assets/external-addresses.csv', ...DUMP_ALL },
        { command: 'grep -c external /evidence/assets/external-addresses.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out who checks what Ridgeline exposes to the internet, and how the June rule was approved.',
      guidance:
        'Somebody outside found it first. Ask who was supposed to.',
    },
  ],
};
