/**
 * Scenario 89: Everybody Is Admin.
 *
 * A firewall rule was removed at twenty to midnight and the log says who did
 * it. It says admin, and admin is nine people.
 *
 * WHAT THIS TEACHES
 *
 * That a log which names an account has not necessarily named a person, and
 * that the difference is the whole of attribution. Ardal has a complete audit
 * trail here. It records the exact change, to the second, by a named account,
 * and it cannot answer the only question anybody is asking.
 *
 * The answer is reachable, which is the point of the exercise: three other
 * systems narrow nine people to one in about an hour. Every step of that is
 * ordinary work a beginner can do, and the finding at the end is that it took
 * an hour and three systems to answer a question the log was supposed to
 * answer instantly.
 *
 * THE DECOY IS A PERSON
 *
 * The obvious suspect is on annual leave abroad, which looks damning until
 * somebody checks the on-call rota. Shared credentials do not only destroy
 * attribution, they manufacture it, and the manufactured version points at
 * whoever looks strangest. That is the part worth carrying out of the room.
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

const ID = 'everybody-is-admin';

export const EVERYBODY_IS_ADMIN: Scenario = {
  id: ID,
  title: 'Everybody Is Admin',
  difficulty: 'beginner',
  durationMinutes: 50,
  situation:
    'It is 08:30 at Ardal Freight. Overnight, somebody opened a server to the internet from the ' +
    'jump box, and the log says the account that did it was admin.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
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
      summary: 'A firewall rule was removed at 23:40, opening a server to the internet',
      detail:
        'The overnight configuration report shows a deny rule removed from the perimeter firewall at ' +
        '23:40, which leaves remote desktop on ADF-APP-07 reachable from any address on the ' +
        'internet. The change was made from the jump box, ADF-JUMP-01. The audit line records the ' +
        'account as admin.',
      source: 'perimeter firewall',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 170,
      surface: 'raw-log',
      summary: 'Nine people know that password',
      detail:
        'The admin account on the jump box is a shared local account. Its password is held in a ' +
        'password manager entry shared with nine members of the infrastructure team, was last ' +
        'changed in 2023, and is not rotated when somebody leaves. The jump box records the account ' +
        'name on every action and nothing else about who was at the keyboard.',
      source: 'ADF-JUMP-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 340,
      surface: 'network-flow',
      summary: 'Only two of the nine were connected at the time',
      detail:
        'The VPN concentrator records individual accounts rather than shared ones. At 23:40 exactly ' +
        'two of the nine infrastructure accounts held a session: M. Oduya, connected 22:55 to 00:20, ' +
        'and P. Renshaw, connected 23:31 to 23:52. Nobody else from that team was connected at any ' +
        'point between 22:00 and 01:00.',
      source: 'VPN concentrator',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 520,
      surface: 'alert-queue',
      summary: 'One of those two is on annual leave',
      detail:
        'P. Renshaw has been on annual leave since Friday and is abroad. Their VPN session at 23:31 ' +
        'came from an address in the country they are visiting. They are not contactable this ' +
        'morning and their manager did not know they had connected.',
      source: 'people system',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 700,
      surface: 'raw-log',
      summary: 'The person on leave handed their access to whoever was covering',
      detail:
        'The on-call rota shows P. Renshaw was due to be on call this week and swapped with M. Oduya ' +
        'before going away. A service desk note from Friday records that Renshaw gave Oduya their ' +
        'VPN credential so Oduya could cover, because on-call is tied to the individual account and ' +
        'there is no way to hand it over. Oduya says they used both sessions themselves and were ' +
        'working from home.',
      source: 'service desk',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'There is a change ticket, raised and approved',
      detail:
        'Change ticket CHG-8842 was raised at 22:10 and approved by the infrastructure manager at ' +
        '22:34. It requests that remote desktop on ADF-APP-07 be reachable from the supplier ' +
        'integration host at 198.51.100.30, for a go-live at 06:00. It was assigned to M. Oduya.',
      source: 'change system',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 1060,
      surface: 'network-flow',
      summary: 'The rule that was made is wider than the rule that was asked for',
      detail:
        'The ticket names one source address. The change removed a deny rule rather than adding a ' +
        'permit for that address, which leaves remote desktop on ADF-APP-07 reachable from any ' +
        'address on the internet. The supplier integration works either way, which is why nothing ' +
        'looked wrong at go-live.',
      source: 'perimeter firewall',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1240,
      surface: 'network-flow',
      summary: 'The internet found it in under an hour',
      detail:
        'Since 00:31 the exposed port has received 4,100 connection attempts from 380 addresses, ' +
        'which is the ordinary background rate for an internet-facing remote desktop port. 47 of ' +
        'those attempted authentication. All 47 failed. The rule is still in place and has been for ' +
        'nine hours.',
      source: 'perimeter firewall',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1420,
      surface: 'alert-queue',
      summary: 'It took three systems and an hour to answer who',
      detail:
        'Answering the question took the firewall audit, the VPN log, the on-call rota, a service ' +
        'desk note and the change system. Ardal runs 14 shared administrative accounts across the ' +
        'estate on the same pattern. None of them can say who was at the keyboard, and the jump box ' +
        'is the one every administrative action passes through.',
      source: 'security programme',
      claimedSeverity: 'high',
    },
  ],
};

export const EVERYBODY_IS_ADMIN_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 22:10 a change ticket was raised and approved for a supplier integration going live at 06:00. It asks for remote desktop on ADF-APP-07 to be reachable from one address, 198.51.100.30, and it was assigned to M. Oduya.',
    'At 23:40 Oduya made the change from the jump box using the shared admin account. Instead of adding a permit for that one address, they removed a deny rule, which left remote desktop reachable from anywhere on the internet. The supplier integration works either way, so nothing looked wrong at go-live.',
    'The firewall audit records the change to the second and attributes it to admin, which is a local account whose password is shared with nine people and has not changed since 2023. It cannot say who was at the keyboard.',
    'Three other systems answer the question in about an hour. The VPN concentrator records individual accounts and shows exactly two of the nine connected at 23:40. The on-call rota and a service desk note from Friday explain the second one.',
    'P. Renshaw has been on leave since Friday and their session came from abroad, which looks damning and is not. They swapped on-call with Oduya before going away and handed over their VPN credential, because on-call is tied to an individual account with no way to transfer it. Both sessions were Oduya.',
    'So the change was authorised, made by the assigned engineer, and wrong. The rule is wider than the ticket asked for. Nothing here is malicious.',
    'The exposed port has taken 4,100 connection attempts from 380 addresses since 00:31, which is the ordinary background rate for internet-facing remote desktop. 47 tried to authenticate and all 47 failed. The rule has been in place for nine hours and still is.',
    'Ardal runs 14 shared administrative accounts on this pattern. None can say who was at the keyboard, and the jump box is the one every administrative action passes through.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['network-analyst', 'ir-lead'],
      why:
        'Remote desktop reachable from the whole internet, since twenty to midnight, and nobody ' +
        'noticed for nine hours. Raise it on the exposure alone and do not wait to find out who did ' +
        'it, because the two questions have different clocks: the server is exposed right now and ' +
        'the person is a matter of record that will still be there this afternoon. Then read the ' +
        'audit line properly, because it looks like it answers everything and does not. It names an ' +
        'account. Whether that account is a person is a separate fact nobody has checked yet, and ' +
        'the habit of asking it is most of what this shift is for.',
      standIn:
        'Remote desktop open to the internet since twenty to midnight and nobody noticed for nine ' +
        'hours. Raising it on the exposure, and I am not waiting on who did it. The server is open ' +
        'now, the person is a record that will still be there this afternoon. And read that audit ' +
        'line carefully. It names an account. Whether the account is a person is a different fact ' +
        'and nobody has checked it.',
      commandOptions: [
        { command: "grep -iE 'delete|remove|rule' /var/log/firewall/config-audit.log | grep '23:4'", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F'|' '$2 ~ /23:4/ {print $3, $4, $5}' /var/log/firewall/config-audit.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewalld', ...STATUS_CHECK },
        { command: 'cat /var/log/firewall/config-audit.log', ...DUMP_ALL },
        { command: 'firewall-cmd --reload', ...MUTATE },
      ],
      commandNudge:
        'Find the exact change and read every field on it, including who it says made it.',
      guidance:
        'A rule was removed. Ask what it was protecting.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'log-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.reset-password', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'Admin is nine people. The audit trail is complete, precise to the second, and cannot answer ' +
        'the only question being asked, which is a distinction worth naming out loud because it is ' +
        'not obvious: having a log is not the same as having attribution, and a room that hears ' +
        'audit trail relaxes. Two other things on this row matter more than they look. The password ' +
        'has not changed since 2023 and is not rotated when somebody leaves, so the nine is a lower ' +
        'bound rather than a number. And nobody should be reaching for a rotation yet, because ' +
        'changing it now is a change to the environment during an investigation, and the first job ' +
        'is to work out what happened rather than to tidy up.',
      standIn:
        'Admin is nine people. The audit trail is complete, accurate to the second, and cannot answer ' +
        'the question. Having a log is not the same as having attribution, and I want that said, ' +
        'because everybody relaxes when they hear audit trail. Two more things. It has not changed ' +
        'since 2023 and is not rotated when people leave, so nine is a floor, not a number. And ' +
        'nobody rotate it yet. That is a change to the environment in the middle of working out what ' +
        'happened.',
      commandOptions: [
        { command: "pwmgr-cli entry members --entry 'ADF-JUMP-01 admin'", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'admin|shared' /evidence/iam/local-accounts.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sshd', ...STATUS_CHECK },
        { command: 'cat /evidence/iam/local-accounts.csv', ...DUMP_ALL },
        { command: 'passwd admin', ...MUTATE },
      ],
      commandNudge:
        'Find out how many people can use the account the log named.',
      guidance:
        'The log names an account. Ask how many people that is.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['log-analyst', 'soc-operator'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['log-analyst'],
      why:
        'The jump box cannot say who, so go to a system that records individuals, and the VPN does. ' +
        'Two of the nine were connected at 23:40 and nobody else from that team was on between ten ' +
        'and one. Nine to two in one query. This is the move worth learning and it generalises past ' +
        'firewalls entirely: when a log cannot answer a question, ask what somebody had to do in ' +
        'order to be at that keyboard, and go and look at the record of that instead. Getting into ' +
        'the estate at midnight required a VPN session, and VPN sessions have names on them. Two is ' +
        'not an answer yet, and saying so is part of the job: this narrows, it does not conclude.',
      standIn:
        'The jump box cannot say who, so go to something that records individuals. The VPN does. Two ' +
        'of the nine were connected at 23:40 and nobody else from that team was on between ten and ' +
        'one. Nine down to two in one query. That is the move: when a log cannot answer, ask what ' +
        'somebody had to do to be at that keyboard and go look at the record of that. And two is not ' +
        'an answer. This narrows, it does not conclude.',
      commandOptions: [
        { command: "awk -F, '$3<=\"23:40\" && $4>=\"23:40\" {print $1, $2}' /var/log/vpn/sessions.csv", correct: true, teaches: CORRECT_STEP },
        { command: "grep -f /evidence/iam/infra-team.txt /var/log/vpn/sessions.csv | cut -d, -f1,3,4", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status openvpn', ...STATUS_CHECK },
        { command: 'cat /var/log/vpn/sessions.csv', ...DUMP_ALL },
        { command: 'grep -c infra /var/log/vpn/sessions.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find a log that records individual people, and see who was connected at that minute.',
      guidance:
        'One log cannot say who. Ask which other log can.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.attribute-named', 'act.declare', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'On leave, abroad, connected at half eleven at night, manager did not know, not contactable. ' +
        'Every one of those is true and the conclusion sitting on top of them is wrong. This is the ' +
        'moment the shift is actually about: the room now has a suspect who looks strange, an ' +
        'audience who will accept it, and no further work required to say so. Do not say it. What ' +
        'has been established is that Renshaw account was used, and an account is not a person, ' +
        'which is the same sentence as two rows ago and is easy to forget the second it points at ' +
        'somebody. Keep going and check the boring records first: the rota, the service desk, the ' +
        'change system. A person who is abroad and unreachable cannot correct you, which is a reason ' +
        'for more care rather than less.',
      standIn:
        'On leave, abroad, connected at half eleven, manager did not know, not contactable. All true, ' +
        'and the conclusion on top of it is wrong. This is the moment that matters: we have somebody ' +
        'who looks strange, an audience who will believe it, and no work left to do before saying ' +
        'it. Do not say it. We have established their account was used, and an account is not a ' +
        'person, which is the same sentence as two rows ago and it is easy to forget the second it ' +
        'points at somebody. Rota, service desk, change system, in that order. Somebody abroad and ' +
        'unreachable cannot correct us, and that is a reason for more care, not less.',
      commandOptions: [
        { command: "grep -iE 'renshaw|oncall|swap' /evidence/people/rota-september.csv", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i renshaw /evidence/servicedesk/notes-friday.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status openvpn', ...STATUS_CHECK },
        { command: 'cat /evidence/people/rota-september.csv', ...DUMP_ALL },
        { command: 'grep -rn "renshaw" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Before concluding anything about the person on leave, check the rota and the service desk.',
      guidance:
        'One of them is abroad. Ask why their account was in use.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'log-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.timeline'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Renshaw handed their VPN credential to Oduya on Friday so Oduya could cover on-call, and ' +
        'wrote it in a service desk note, which is about as honest as somebody can be about doing ' +
        'the wrong thing for a sensible reason. On-call is tied to an individual account with no ' +
        'way to hand it over, so the only route to covering a colleague holiday was to share a ' +
        'credential. Both sessions were Oduya, and Renshaw is not a suspect and never was. Two ' +
        'lessons come off this. The narrowing works: two to one, using a rota and a note. And the ' +
        'sharing was caused by a missing feature rather than by carelessness, so the fix is a ' +
        'handover mechanism and not a warning to Renshaw, who will otherwise be reprimanded for ' +
        'the only available way to do their job.',
      standIn:
        'Renshaw gave Oduya their VPN credential on Friday so Oduya could cover on-call, and wrote it ' +
        'in a service desk note, which is about as honest as you get about doing the wrong thing for ' +
        'a sensible reason. On-call is tied to the individual account and there is no way to hand it ' +
        'over, so sharing was the only route. Both sessions were Oduya. Renshaw is not a suspect and ' +
        'never was. Two to one on a rota and a note. And this was a missing feature, not ' +
        'carelessness, so the fix is a handover mechanism, not a word with Renshaw for the only way ' +
        'they could do the job.',
      commandOptions: [
        { command: "grep -iE 'handover|credential|cover' /evidence/servicedesk/notes-friday.txt", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"oncall\" {print $1, $3, $4}' /evidence/people/rota-september.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status oncall-pager', ...STATUS_CHECK },
        { command: 'cat /evidence/servicedesk/notes-friday.txt', ...DUMP_ALL },
        { command: 'grep -c oncall /evidence/people/rota-september.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out who was actually covering on-call, and how they were meant to get the access.',
      guidance:
        'Their account was used and they were away. Ask who was covering for them.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.dismiss'],
      outOfLaneActions: ['act.declare', 'act.attribute-named', 'act.isolate', 'act.triage-high'],
      escalateTo: [],
      why:
        'There is a ticket, raised at ten past ten, approved at half past, assigned to the person who ' +
        'made the change. So this was authorised work by the right engineer at the right time, and ' +
        'the intrusion the room has been half expecting does not exist. Say that clearly, because ' +
        'the shape of the morning has just changed and everybody needs to arrive at the same place ' +
        'at once: nobody attacked Ardal and there is still a serious problem, which are two ' +
        'statements people find hard to hold together. Checking the change system before concluding ' +
        'anything about a suspicious out of hours change is the cheapest step in the whole shift ' +
        'and the one most often skipped, because an approved ticket is a boring answer and the room ' +
        'has already committed to an interesting one.',
      standIn:
        'There is a ticket. Raised ten past ten, approved at half past, assigned to the person who ' +
        'made the change. Authorised work, right engineer, right time, and the intrusion we have ' +
        'half been expecting does not exist. I want everybody to land on that at the same moment, ' +
        'because nobody attacked us and we still have a serious problem, and people find those two ' +
        'hard to hold at once. Checking the change system is the cheapest step in the shift and the ' +
        'one we skip, because an approved ticket is boring and we had already committed to something ' +
        'interesting.',
      commandOptions: [
        { command: "grep -A6 'CHG-8842' /evidence/change/tickets.txt", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4 ~ /ADF-APP-07/ {print $1, $2, $5}' /evidence/change/tickets.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status change-portal', ...STATUS_CHECK },
        { command: 'cat /evidence/change/tickets.txt', ...DUMP_ALL },
        { command: 'grep -c CHG /evidence/change/tickets.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether anybody asked for this change before assuming nobody did.',
      guidance:
        'A change was made at midnight. Ask whether it was approved.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'network-analyst',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.corroborate', 'act.contain-scoped'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist'],
      why:
        'The ticket asked for one address and the change opened the whole internet, which is the ' +
        'actual finding and it is a mistake rather than an act. Removing a deny rule and adding a ' +
        'permit for one host both make the supplier integration work, and only one of them leaves ' +
        'remote desktop reachable from everywhere. Nothing about the go-live would have looked ' +
        'wrong, which is why it survived nine hours. Compare what was requested against what was ' +
        'implemented, because approved is not the same as correct and a room that stops at the ' +
        'ticket has verified the wrong thing. Nobody should be reaching for who to blame either: at ' +
        'twenty to midnight, covering somebody else on-call, this is the mistake anybody makes, and ' +
        'what deserves attention is that no second pair of eyes existed between the request and the ' +
        'firewall.',
      standIn:
        'The ticket asked for one address and the change opened the internet. That is the finding, ' +
        'and it is a mistake, not an act. Removing the deny and permitting one host both make the ' +
        'integration work, and only one of them exposes remote desktop to everywhere, so nothing ' +
        'looked wrong at go-live and it survived nine hours. Always compare what was asked for ' +
        'against what was built. Approved is not correct, and stopping at the ticket verifies the ' +
        'wrong thing. And nobody go looking for blame. Twenty to midnight covering somebody else ' +
        'on-call is where anyone makes this. What matters is that nothing stood between the request ' +
        'and the firewall.',
      commandOptions: [
        { command: "diff <(grep -A3 CHG-8842 /evidence/change/tickets.txt) /evidence/firewall/rule-after.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE '3389|rdp' /evidence/firewall/ruleset-current.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewalld', ...STATUS_CHECK },
        { command: 'cat /evidence/firewall/ruleset-current.txt', ...DUMP_ALL },
        { command: 'nmap -p3389 203.0.113.0/24', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Put the rule that was asked for next to the rule that exists, and read both.',
      guidance:
        'The change was approved. Ask whether it matches what was approved.',
    },
    {
      eventId: 'ev.8',
      verdict: 'blocked-reconnaissance',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.contain-scoped', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Four thousand attempts from 380 addresses, 47 tried to authenticate, all 47 failed. Read ' +
        'that correctly in both directions. Nothing got in, so this is not a breach and nobody ' +
        'should be told it is. And the volume is not evidence that Ardal was targeted, because it is ' +
        'the ordinary background rate for any internet-facing remote desktop port: the internet ' +
        'found it in fifty-one minutes and would find anything else in about the same time. The ' +
        'action is narrow and quick. Put the deny rule back and add the permit the ticket actually ' +
        'asked for, which restores the supplier integration and closes the exposure in the same ' +
        'change, and check with the supplier contact before doing it, because the one thing worse ' +
        'than nine hours of exposure is breaking a go-live at nine in the morning to fix it and ' +
        'discovering the integration needed something nobody wrote down.',
      standIn:
        'Four thousand attempts from 380 addresses, 47 tried to authenticate, all failed. Read that ' +
        'both ways. Nothing got in, so this is not a breach and nobody is telling anyone it is. And ' +
        'the volume does not mean we were targeted, it is the background rate for any internet-facing ' +
        'remote desktop port. The internet found it in fifty-one minutes and would find anything ' +
        'else just as fast. Fix is narrow: put the deny back and add the permit the ticket actually ' +
        'asked for, one change, closes the hole and keeps the integration. Ring the supplier contact ' +
        'first, because breaking a go-live at nine to fix this would be the one thing worse than the ' +
        'nine hours.',
      commandOptions: [
        { command: "awk '$0 ~ /3389/ && $0 ~ /accept/ {print $4}' /var/log/firewall/traffic.log | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "grep -c 'auth_fail' /var/log/rdp/ADF-APP-07.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status xrdp', ...STATUS_CHECK },
        { command: 'cat /var/log/firewall/traffic.log', ...DUMP_ALL },
        { command: 'nmap -sV 203.0.113.0/24', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out whether any of those attempts succeeded before deciding how bad this is.',
      guidance:
        'The port was open for nine hours. Ask whether anybody got in.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.scope-estate', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'An hour and five systems to answer who, and the answer turned out to be a colleague doing ' +
        'approved work. That cost is the finding. It was paid this morning by a team who found a ' +
        'mistake, and the same hour would be paid during an actual intrusion, when there is no ' +
        'ticket at the end of it and the narrowing stops at two people with nothing left to check. ' +
        'Fourteen shared administrative accounts across the estate are on this pattern and the jump ' +
        'box is the one every administrative action passes through, so the answer to who did it is ' +
        'currently a research project on every one of them. Two changes are worth proposing and ' +
        'neither is a detection: named accounts on the jump box, and a way to hand over on-call ' +
        'that does not require handing over a credential, which is what created the second session ' +
        'and nearly created an accusation. The prediction to write down is that the next time this ' +
        'happens the person who looks strangest will be somebody with a good reason nobody asked ' +
        'them for.',
      standIn:
        'An hour and five systems to answer who, and the answer was a colleague doing approved work. ' +
        'That cost is the finding. We paid it today over a mistake. We would pay the same hour ' +
        'during a real intrusion, except there is no ticket at the end and the narrowing stops at ' +
        'two people with nothing left to check. Fourteen shared admin accounts on this pattern, and ' +
        'the jump box is where every administrative action goes through, so who did it is a research ' +
        'project every single time. Two changes, neither of them a detection: named accounts on the ' +
        'jump box, and a way to hand over on-call without handing over a credential, which is what ' +
        'made the second session and nearly made an accusation. And write this down: next time, the ' +
        'person who looks strangest will have a good reason nobody asked them for.',
      commandOptions: [
        { command: "awk -F, '$3==\"shared\" {print $1, $2}' /evidence/iam/accounts-inventory.csv", correct: true, teaches: CORRECT_STEP },
        { command: "grep -ilE 'shared|generic' /evidence/iam/account-reviews/*.txt | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sssd', ...STATUS_CHECK },
        { command: 'cat /evidence/iam/accounts-inventory.csv', ...DUMP_ALL },
        { command: 'grep -rn "admin" /evidence/iam/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Count how many other accounts in the estate have the same problem this one has.',
      guidance:
        'This account could not say who. Ask how many others cannot.',
    },
  ],
};
