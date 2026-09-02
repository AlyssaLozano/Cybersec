/**
 * Scenario 52: The Coffee Shop.
 *
 * Nobody did anything wrong on purpose, and member data was still exposed.
 *
 * WHAT THIS TEACHES
 *
 * That intent is a finding, and that establishing it changes the whole response
 * rather than softening it.
 *
 * Every technical fact here looks like the insider scenarios either side of it:
 * sensitive data pulled to a laptop, worked on outside the office, on a network
 * the organisation does not control. In `two-weeks-notice` that pattern is
 * theft. Here it is somebody doing their job on a Tuesday afternoon, and the
 * difference is not visible in any log. It is visible in what happened next,
 * which is nothing: no upload, no personal account, no copy anywhere, and the
 * files still sitting where work files sit.
 *
 * THE RESPONSE IS THE HARD PART
 *
 * The instinct is a disciplinary process, and it is the one response that
 * reliably makes the next incident worse. An organisation that disciplines
 * somebody for working on a train gets people who work on trains and do not
 * mention it. Every control that would have prevented this is technical and
 * none of it was in place: no enforced VPN, no full disk encryption on that
 * build, no screen lock under fifteen minutes, and a reporting tool that hands
 * out spreadsheets because there is no other way to get the numbers.
 *
 * WHY IT IS INTERMEDIATE
 *
 * The evidence is simple. Weighing it is not. A floor has to resist a
 * conclusion that fits the facts, is available in ten minutes, and is wrong.
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

const ID = 'the-coffee-shop';

export const THE_COFFEE_SHOP: Scenario = {
  id: ID,
  title: 'The Coffee Shop',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 15:10 at Fenmarch Credit Union. A member rang the branch to say she saw her own account ' +
    'details on a stranger laptop in a coffee shop this morning. She was not wrong.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
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
      summary: 'A member reports seeing her own account details on a laptop in a coffee shop',
      detail:
        'A member rang the Fremont branch at 14:40 to say she was sitting behind somebody in a ' +
        'coffee shop on Bridge Street at around 11:00 and recognised her own name, account number ' +
        'and balance on their screen. She could read it from the next table. She reported it ' +
        'because she was concerned, not because she was complaining. Rule history: this arrived by ' +
        'telephone and no rule fired at any point.',
      source: 'member report',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'An arrears officer exported a member list at 09:20',
      detail:
        'The account h.rowntree, an arrears support officer, exported the monthly arrears review ' +
        'list at 09:20 to a spreadsheet: 340 members with name, account number, balance, arrears ' +
        'stage and contact history. Export is a standard feature and is how the arrears team works ' +
        'the list, because the reporting tool has no way to work through cases on screen.',
      source: 'h.rowntree',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'network-flow',
      summary: 'The laptop was on a public wireless network with no VPN between 10:20 and 12:05',
      detail:
        'The device connected to an open wireless network named for a coffee chain between 10:20 ' +
        'and 12:05 and made no VPN connection in that window. The corporate VPN is available and is ' +
        'not enforced: it is a shortcut on the desktop and staff are asked to use it. Nothing ' +
        'sensitive traversed the network, because the spreadsheet was already local.',
      source: 'FCU-LT-0912',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'host-artefact',
      summary: 'The laptop has no full disk encryption and a fifteen minute screen lock',
      detail:
        'FCU-LT-0912 is a 2021 build that predates the encryption rollout and was never brought ' +
        'into it. Disk encryption is off. The screen lock timeout is fifteen minutes, which is the ' +
        'estate default. There is no privacy filter. Sixty-one other devices in the estate are on ' +
        'the same build with the same configuration.',
      source: 'FCU-LT-0912',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'alert-queue',
      summary: 'Nothing left the laptop and nothing was copied anywhere',
      detail:
        'The spreadsheet is still in the user documents folder. There is no upload to any cloud ' +
        'provider, no attachment to any outbound message, no removable media event, and no copy on ' +
        'any other device. The file was opened at 10:34 and closed at 11:52, and thirty-one member ' +
        'records were annotated during that period, which matches the arrears review task assigned ' +
        'to her this week.',
      source: 'FCU-LT-0912',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'Every control that would have prevented this is technical and absent',
      detail:
        'Enforced VPN would have made the network irrelevant. Full disk encryption would have made ' +
        'the device safe if taken. A five minute screen lock would have limited unattended ' +
        'exposure. A privacy filter would have prevented the shoulder view. Working the arrears ' +
        'list in the application rather than in a spreadsheet would have removed the local copy ' +
        'entirely. None of these are in place and none of them are the officer decision.',
      source: 'security controls review',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Forty staff worked outside an office this week',
      detail:
        'Forty staff connected from outside a branch or head office this week, all through the ' +
        'corporate VPN, on devices in the current build with encryption enabled and a five minute ' +
        'lock. Home and remote working is contractual for eleven of them. Rule history: fired 90 ' +
        'times in thirty days, 90 closed as expected remote working.',
      source: 'fcu-vpn-01',
      claimedSeverity: 'low',
    },
  ],
};

export const THE_COFFEE_SHOP_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'An arrears support officer exported the monthly arrears review list at 09:20, which is how the arrears team works the list because the reporting tool offers no way to do it on screen.',
    'She worked on it in a coffee shop between 10:20 and 12:05 on an open wireless network, without connecting the VPN, which is available and not enforced.',
    'Her laptop is a 2021 build that predates the encryption rollout and was never brought into it, so the disk is unencrypted. The screen lock is the estate default of fifteen minutes and there is no privacy filter.',
    'A member sitting at the next table read her own name, account number and balance off the screen and rang the branch about it.',
    'Nothing left the laptop. No upload, no attachment, no removable media, no copy anywhere. The file was open from 10:34 to 11:52 and thirty-one records were annotated, which matches the task assigned to her.',
    'So this is not theft and there is no attacker. It is a member data exposure caused by an ordinary person doing an ordinary task in a place the organisation never told her not to.',
    'Every control that would have prevented it is technical and none of them were in place: enforced VPN, disk encryption, a shorter lock, a privacy filter, or a way to work the list without a spreadsheet.',
    'Sixty-one other devices are on the same unencrypted build.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1005'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'Graded as a real incident because member data was genuinely exposed to somebody with no ' +
        'right to see it, and the word malicious is doing no work about intent. Nothing fired and ' +
        'nothing would have: it arrived by telephone from a member who was worried rather than ' +
        'angry, which is worth registering because she is the only detection in this story. Take it ' +
        'properly rather than treating a phone call as softer than an alert. The one thing to hold ' +
        'off on is the conclusion: at this point nobody knows whether this is somebody working, ' +
        'somebody careless or somebody stealing, and all three produce this call.',
      standIn:
        'Member rang the Fremont branch at 14:40. She was in a coffee shop on Bridge Street around ' +
        '11:00 and read her own name, account number and balance off the laptop in front of her. ' +
        'Nothing alerted and nothing would have. She is our detection. Raising it, and I do not yet ' +
        'know which of three things this is.',
      commandOptions: [
        { command: "awk '$4==\"EXPORT\" && $1 ~ /2026-09-17/ {print $1, $5, $7}' /var/log/reporting/exports.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i export /var/log/reporting/exports.log | grep 09:', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status reporting-platform', ...STATUS_CHECK },
        { command: 'cat /var/log/reporting/exports.log', ...DUMP_ALL },
        { command: 'grep -c EXPORT /var/log/reporting/exports.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out who had member data on a laptop this morning, before deciding what happened.',
      guidance:
        'A member saw data she should not have. Ask who had it out of the office, and do not decide ' +
        'why yet.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.reset-password', 'act.declare'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The export is real, it is 340 members with balances and arrears stages, and it is entirely ' +
        'routine. This is the row where a floor primed by the theft scenarios starts building the ' +
        'wrong case, because an export of 340 member records is exactly what the beginning of ' +
        '`two-weeks-notice` looks like. The sentence that stops it is the last one: export is a ' +
        'standard feature and is how the arrears team works the list, because the reporting tool ' +
        'has no way to work through cases on screen. The organisation built a process that requires ' +
        'a spreadsheet, so a spreadsheet is not evidence of anything. Worth noting as a finding ' +
        'rather than an excuse, because it is the thing that eventually gets fixed.',
      standIn:
        'An arrears support officer exported the monthly arrears review list at 09:20, 340 members ' +
        'with name, account number, balance, arrears stage and contact history. That is a standard ' +
        'feature and it is how the arrears team works, because the tool gives them no way to do it ' +
        'on screen. The export is not the finding.',
      commandOptions: [
        { command: "awk '$5==\"h.rowntree\" {print $1, $4, $7}' /var/log/reporting/exports.log | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "arrears review" /var/log/reporting/report-definitions.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status reporting-platform', ...STATUS_CHECK },
        { command: 'cat /var/log/reporting/exports.log', ...DUMP_ALL },
        { command: 'grep -c rowntree /var/log/reporting/exports.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out whether that export is unusual for this role, or how the job is normally done.',
      guidance:
        'An export of member data looks like theft. Ask how this team is supposed to do its work.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1040'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'Open wireless, no VPN, one hour forty-five minutes. The instinct is to treat the network as ' +
        'the exposure and it is worth being precise, because the precise answer is more useful than ' +
        'the alarming one: nothing sensitive traversed that network at all, because the spreadsheet ' +
        'was already on the disk before she left the office. The public wifi is a risk that did not ' +
        'materialise. What did materialise was a person reading a screen, which no VPN prevents. ' +
        'Reporting it accurately matters because the recommendation that follows should be the one ' +
        'that would have helped, and a floor that leads with unencrypted wifi will get an enforced ' +
        'VPN and the same incident again next month.',
      standIn:
        'The laptop was on open coffee shop wireless from 10:20 to 12:05 with no VPN. The VPN is ' +
        'available and not enforced. Nothing sensitive crossed that network though, because the ' +
        'spreadsheet was already local before she left the office. The wifi is a risk that did not ' +
        'go off. What happened was somebody reading a screen.',
      commandOptions: [
        { command: "awk '$2==\"FCU-LT-0912\" {print $1, $4, $6}' /var/log/network/associations.log | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep FCU-LT-0912 /var/log/vpn/sessions.log | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/network/associations.log', ...DUMP_ALL },
        { command: 'nmap -sn 192.0.2.0/24', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check what actually crossed that network, not just which network it was.',
      guidance:
        'Public wifi sounds like the answer. Ask what was actually sent over it.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1005'],
      firstResponder: 'forensics',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.attribute-named', 'act.power-off', 'act.dismiss'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'The finding that outlives this member and this officer. A 2021 build that predates the ' +
        'encryption rollout and was never brought into it, so the disk is unencrypted; the estate ' +
        'default fifteen minute screen lock; no privacy filter. None of that is a choice she made ' +
        'or could have made. The number is what turns it from an anecdote into work: sixty-one ' +
        'other devices are on the same build with the same configuration, and every one of them is ' +
        'a laptop that is a property loss today and a data breach if it is taken. Today the exposure ' +
        'was a person at the next table, which is the least severe version of this. The version ' +
        'where one of the sixty-one is stolen is `left-the-building` and it costs considerably more.',
      standIn:
        'That laptop is a 2021 build that predates the encryption rollout and was never brought in, ' +
        'so the disk is not encrypted. Fifteen minute screen lock, which is the estate default, and ' +
        'no privacy filter. None of that was her decision. Sixty-one other devices are on the same ' +
        'build. Today it was somebody at the next table. If one of those sixty-one gets taken it is ' +
        'a very different report.',
      commandOptions: [
        { command: "awk -F, '$4==\"2021-base\" && $6==\"disabled\" {print $1}' /var/inventory/devices.csv | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: 'grep FCU-LT-0912 /var/log/endpoint/compliance.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status endpoint-mgmt', ...STATUS_CHECK },
        { command: 'cat /var/inventory/devices.csv', ...DUMP_ALL },
        { command: 'grep -c 2021-base /var/inventory/devices.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check the device configuration, then check how many other devices share it.',
      guidance:
        'Ask what state that laptop was in, and whether the person had any say in it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.declare', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The negative finding that decides the whole incident, and it has to be established rather ' +
        'than assumed in either direction. No upload, no attachment, no removable media, no copy on ' +
        'any other device, and the file still where work files sit. Then the detail that settles ' +
        'intent as far as anything can: open 10:34 to 11:52, thirty-one records annotated, matching ' +
        'the arrears review task assigned to her this week. Somebody stealing a list does not ' +
        'annotate thirty-one records with case notes. This is what doing the job looks like. State ' +
        'it as clearly as a positive finding, because the whole rest of the response depends on it ' +
        'and it is the sentence that stops a disciplinary process starting on Monday.',
      standIn:
        'Nothing left that laptop. No upload, no attachment, no removable media, no copy anywhere, ' +
        'and the file is still in her documents folder. Open 10:34 to 11:52 with thirty-one records ' +
        'annotated, which matches the arrears review assigned to her this week. Somebody stealing a ' +
        'list does not write case notes on it. This is the job being done.',
      commandOptions: [
        { command: "awk '$3==\"h.rowntree\"' /var/log/dlp/uploads.log /var/log/mail/outbound.log | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "arrears-review" /var/log/endpoint/file-activity.log | tail -20', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dlp-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/endpoint/file-activity.log', ...DUMP_ALL },
        { command: 'grep -c rowntree /var/log/dlp/uploads.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Establish whether that file went anywhere at all, and what was done to it while it was ' +
        'open.',
      guidance:
        'You have three possible explanations. Ask what the file did next, because that separates ' +
        'them.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1005'],
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.sequence-remedy'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reset-password', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The response, and the recommendation this seat has to make is partly about what NOT to do. ' +
        'Five controls would each have prevented or limited this and every one is technical: ' +
        'enforced VPN, disk encryption, a five minute lock, a privacy filter, and a way to work the ' +
        'arrears list in the application so there is no local copy at all. None was her decision ' +
        'and none is fixed by telling her to be careful. A disciplinary process is the response the ' +
        'organisation will reach for and it is the one that reliably makes the next incident worse, ' +
        'because it produces people who work on trains and do not mention it, and this incident was ' +
        'only ever detected because somebody chose to report something. The sequencing is the ' +
        'sixty-one unencrypted devices first, because that is the severe version, then the lock ' +
        'timeout which is a policy change and free, then filters, then the reporting tool, which is ' +
        'the real fix and the slowest.',
      standIn:
        'Five things would each have prevented or limited this and all five are technical: enforced ' +
        'VPN, disk encryption, a five minute lock, a privacy filter, and working the arrears list ' +
        'in the application instead of a spreadsheet. None of them was her decision. Discipline is ' +
        'what we will be asked for and it makes the next one worse, because it produces people who ' +
        'do this and say nothing. Sixty-one unencrypted devices first, then the lock timeout which ' +
        'is free, then filters, then fix the tool.',
      commandNudge:
        'Work out which controls would actually have prevented this, and which of them she could ' +
        'have chosen.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.contain-scoped'],
      escalateTo: [],
      why:
        'Forty staff working outside an office this week, which after ev.3 looks like forty more of ' +
        'the same. It is not: all forty came through the corporate VPN, on current-build devices ' +
        'with encryption enabled and a five minute lock, and remote working is contractual for ' +
        'eleven of them. Ninety of ninety this month were closed the same way. This is here to stop ' +
        'the recommendation overreaching. A floor that has just watched remote working cause a ' +
        'member data exposure will be tempted to propose restricting it, and forty people are doing ' +
        'it safely today on the controls that already exist. The problem is not people working ' +
        'outside offices, it is one device build that never got the controls, and the difference ' +
        'between those two conclusions is the difference between a fix and a policy nobody follows.',
      standIn:
        'Forty staff worked outside an office this week, all through the VPN, all on current build ' +
        'with encryption on and a five minute lock, and it is contractual for eleven of them. Ninety ' +
        'of ninety this month were the same. Remote working is not the problem, one device build ' +
        'that never got the controls is. Closing it.',
      commandOptions: [
        { command: "awk '$4==\"VPN\" {print $3}' /var/log/vpn/sessions.log | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4!=\"2021-base\" && $6==\"enabled\"' /var/inventory/devices.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-vpn', ...STATUS_CHECK },
        { command: 'cat /var/log/vpn/sessions.log', ...DUMP_ALL },
        { command: 'grep -c VPN /var/log/vpn/sessions.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether those forty are working the same way, on the same kind of device.',
      guidance:
        'Ask whether the problem is people working remotely or one build that never got the ' +
        'controls.',
    },
  ],
};
