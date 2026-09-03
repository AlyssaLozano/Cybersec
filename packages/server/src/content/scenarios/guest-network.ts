/**
 * Scenario 91: The Diagram Says Isolated.
 *
 * A visitor laptop on the guest wireless is scanning the corporate network,
 * and every document Ardal holds says that is impossible.
 *
 * WHAT THIS TEACHES
 *
 * That a control described in a diagram is a claim, and that somebody has to
 * test it before it counts. Ardal guest network is isolated on every drawing,
 * in the design document and in last year audit response. It is not isolated,
 * and finding that out takes one command that anybody on the floor could run
 * and nobody ever has.
 *
 * Nothing here is targeted. The visitor laptop is doing what infected laptops
 * do everywhere they connect, and it happened to be plugged into the one place
 * that turned an ordinary nuisance into a real question. The attacker in this
 * scenario is a piece of commodity malware with no idea where it is.
 *
 * THE CAUSE IS A REASONABLE DECISION FROM 2023
 *
 * The route that breaks the isolation was added so visitors could reach the
 * reception display and the meeting room printer, which is a sensible thing to
 * want. It permits the entire corporate range because that was quicker than
 * finding out which two addresses were needed, and nobody looked again.
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

const ID = 'the-diagram-says-isolated';

export const THE_DIAGRAM_SAYS_ISOLATED: Scenario = {
  id: ID,
  title: 'The Diagram Says Isolated',
  difficulty: 'beginner',
  durationMinutes: 50,
  situation:
    'It is 10:15 at Ardal Freight. Something on the visitor wireless is scanning the corporate ' +
    'network, which the network diagram says it cannot reach.',
  roles: [
    'soc-operator',
    'network-analyst',
    'log-analyst',
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
      summary: 'Something on the guest wireless is scanning the corporate range',
      detail:
        'An internal scanning alert fired at 09:52 for source 192.0.2.61, which is on the visitor ' +
        'wireless range. It has attempted connections to 1,900 addresses in the corporate range on ' +
        'ports 445, 3389 and 22. The rule fires about four times a month, almost always on the ' +
        'vulnerability scanner, and this source is not the scanner.',
      source: 'network monitoring',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 170,
      surface: 'network-flow',
      summary: 'Most of the attempts failed, and forty did not',
      detail:
        'Of 1,900 attempted connections, 1,860 were dropped at the boundary between the visitor and ' +
        'corporate ranges. Forty reached a host and completed a connection. All forty are in ' +
        '10.20.4.0/24, which is the office services range holding the print servers, the reception ' +
        'display controller and eleven other systems.',
      source: 'perimeter firewall',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 350,
      surface: 'raw-log',
      summary: 'One firewall rule permits the whole range',
      detail:
        'Rule 47 permits any source on the visitor range to reach any address in 10.20.4.0/24 on any ' +
        'port. Its description reads guest access to reception display and meeting room printer, ' +
        'and it was added in March 2023 by a change ticket requesting exactly those two devices. ' +
        'The two devices are 10.20.4.15 and 10.20.4.22.',
      source: 'perimeter firewall',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 530,
      surface: 'host-artefact',
      summary: 'The device is a visitor laptop with commodity malware on it',
      detail:
        'Reception confirms 192.0.2.61 is a laptop belonging to a supplier representative who ' +
        'arrived at 09:40 for a meeting. Their laptop is not managed by Ardal. The scanning pattern ' +
        'matches a well-documented worm component that scans whatever network it finds itself on, ' +
        'has been in circulation for four years, and has no targeting of any kind.',
      source: 'reception',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 710,
      surface: 'network-flow',
      summary: 'A second scanner on the same range, which is authorised',
      detail:
        'Source 192.0.2.44 is also scanning, from the same visitor range, on ports 80, 443 and 502. ' +
        'It belongs to the building management contractor carrying out a survey of the heating ' +
        'controls this week. There is an approved ticket, the survey was announced to the facilities ' +
        'team on Monday, and its traffic reaches only the building systems range.',
      source: 'network monitoring',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'The guest password is on a poster and staff use the guest network',
      detail:
        'The visitor wireless password is printed on a card at the reception desk and has not been ' +
        'changed since 2022. Of 61 devices currently on the visitor range, 34 are staff mobile ' +
        'phones. Staff use it because joining the corporate wireless requires a certificate and a ' +
        'service desk ticket, and the guest network requires typing eight characters from a poster.',
      source: 'wireless controller',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 1070,
      surface: 'host-artefact',
      summary: 'What the forty connections actually reached',
      detail:
        'The forty completed connections were to print servers and the reception display ' +
        'controller. No authentication succeeded on any of them. The print servers hold spooled ' +
        'documents from the last seven days, and the display controller has a shared local ' +
        'administrator account with the same password as four other office systems.',
      source: '10.20.4.0/24',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1250,
      surface: 'alert-queue',
      summary: 'What can be changed and what it stops',
      detail:
        'Rule 47 can be narrowed to the two named addresses in about five minutes, which stops the ' +
        'scanning reaching anything and keeps the display and the printer working. The visitor ' +
        'laptop can be removed from the network by reception at any time. Changing the guest ' +
        'password disconnects 34 staff phones as well as every visitor. Making corporate wireless ' +
        'easy to join is a project.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1430,
      surface: 'alert-queue',
      summary: 'Nobody had ever tested the isolation',
      detail:
        'The network diagram shows the visitor range isolated from all corporate ranges. The design ' +
        'document says the same. Last year audit response says the same. No test has ever been run ' +
        'from the visitor range to check, and Ardal has three other network boundaries documented as ' +
        'isolated which have also never been tested.',
      source: 'security programme',
      claimedSeverity: 'high',
    },
  ],
};

export const THE_DIAGRAM_SAYS_ISOLATED_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 09:40 a supplier representative arrived for a meeting and joined the visitor wireless. Their laptop, which Ardal does not manage, carries a four year old commodity worm component that scans whatever network it finds itself on. It has no targeting and no idea where it is.',
    'From 09:52 it attempted 1,900 connections into the corporate range on ports 445, 3389 and 22. 1,860 were dropped at the boundary. Forty completed, all of them into 10.20.4.0/24.',
    'Firewall rule 47 permits any visitor source to reach any address in 10.20.4.0/24 on any port. It was added in March 2023 against a ticket asking for two devices, the reception display on 10.20.4.15 and the meeting room printer on 10.20.4.22. Permitting the whole range was quicker than finding out which two addresses were needed, and nobody looked again.',
    'The forty connections reached print servers and the display controller and authenticated to nothing. The print servers hold seven days of spooled documents and the display controller has a shared local administrator password used on four other office systems, so the exposure is real and was not exploited.',
    'The second scanner, 192.0.2.44, is the building management contractor doing an announced heating survey with an approved ticket, reaching only the building systems range.',
    'The visitor password is on a card at reception, unchanged since 2022, and 34 of the 61 devices on the visitor range are staff phones. Staff use it because corporate wireless needs a certificate and a service desk ticket and the guest network needs eight characters from a poster.',
    'Narrowing rule 47 to the two named addresses takes about five minutes, stops the scanning reaching anything, and keeps the display and printer working.',
    'The diagram, the design document and last year audit response all say the visitor range is isolated. No test has ever been run from it. Three other boundaries documented as isolated have also never been tested.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'discovery',
      techniques: ['T1046'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['network-analyst'],
      why:
        'A scanning alert that usually turns out to be the vulnerability scanner, and this source is ' +
        'not the scanner. That is the one field worth reading before anything else, because it is ' +
        'the difference between the row everybody closes four times a month and this one. What ' +
        'should genuinely stop somebody is where the source sits: 192.0.2.61 is on the visitor ' +
        'wireless, and the visitor wireless is not supposed to be able to address the corporate ' +
        'range at all. So the alert is asserting something the network is documented as preventing, ' +
        'and that is worth raising even if the scanning turns out to be nothing, because either the ' +
        'alert is wrong or the documentation is. Do not assume which. That question is the whole ' +
        'shift.',
      standIn:
        'Scanning alert, and that rule is normally the vulnerability scanner. This source is not the ' +
        'scanner, which is the field that separates this from the four we close every month. And ' +
        'look where it is coming from: the visitor wireless, which is not supposed to be able to ' +
        'address the corporate range at all. So the alert is claiming something our network is ' +
        'documented as preventing. Raising it even if the scanning is nothing, because either the ' +
        'alert is wrong or the documentation is, and I am not assuming which.',
      commandOptions: [
        { command: "awk '$3==\"192.0.2.61\" {print $5}' /var/log/netflow/today.log | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "grep '192.0.2.61' /var/log/netflow/today.log | awk '{print $6}' | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status suricata', ...STATUS_CHECK },
        { command: 'cat /var/log/netflow/today.log', ...DUMP_ALL },
        { command: 'nmap -sn 192.0.2.0/24', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out where the scanning source sits on the network before looking at what it scanned.',
      guidance:
        'Something is scanning. Ask where it is scanning from.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1046'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Eighteen hundred and sixty dropped and forty through, and the forty are the finding. The ' +
        'high block rate is the thing that will make somebody want to close this, and it is exactly ' +
        'backwards: the boundary working 98 per cent of the time is not a boundary, it is a boundary ' +
        'with a hole in it, and the hole is what the report is about. Notice also that the forty are ' +
        'not scattered. They all land in one range, which means this is not a boundary that leaks ' +
        'randomly but a specific permitted path, and a permitted path exists because somebody wrote ' +
        'it. That is the next question and it is answerable in one query. Do not report a ' +
        'percentage. Report the range that was reachable.',
      standIn:
        'Eighteen sixty dropped, forty through, and the forty are the finding. The block rate is what ' +
        'will make somebody want to close this and it is backwards: a boundary that works ninety-' +
        'eight per cent of the time is a boundary with a hole in it, and the hole is the report. And ' +
        'the forty are not scattered, they all land in one range, so this is not leakage, it is a ' +
        'permitted path, and a permitted path exists because somebody wrote it. That is the next ' +
        'query. Nobody report a percentage. Report the range that was reachable.',
      commandOptions: [
        { command: "awk '$3==\"192.0.2.61\" && $7==\"ACCEPT\" {print $5}' /var/log/firewall/traffic.log | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: "grep '192.0.2.61' /var/log/firewall/traffic.log | awk '{print $7}' | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewalld', ...STATUS_CHECK },
        { command: 'cat /var/log/firewall/traffic.log', ...DUMP_ALL },
        { command: 'grep -c 192.0.2.61 /var/log/firewall/traffic.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Separate the attempts that were blocked from the ones that were not, and see where the latter went.',
      guidance:
        'It tried nineteen hundred addresses. Ask how many it reached.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'network-analyst',
      alsoAppropriate: ['mitigation-specialist', 'detection-engineer'],
      correctActions: ['act.corroborate', 'act.flow-map', 'act.contain-scoped'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'Here is the hole and it has a name and a date. Rule 47 permits any visitor source to reach ' +
        'any address in that range on any port, and the ticket behind it asked for two devices. ' +
        'Nobody did anything malicious: writing the whole range was quicker than finding out which ' +
        'two addresses were needed, the display and the printer worked, and the ticket closed. The ' +
        'transferable habit is to read a rule against the request that produced it, because a rule ' +
        'that works is not the same as a rule that is right, and nothing ever complains about a ' +
        'permission that is too wide. Note the description too: it says reception display and ' +
        'meeting room printer, so the rule documents the intent correctly and permits something ' +
        'else entirely, which is why nobody reviewing the list would have caught it by reading.',
      standIn:
        'Here is the hole, with a name and a date. Rule 47 permits any visitor source to any address ' +
        'in that range on any port, and the ticket asked for two devices. Nobody did anything wrong: ' +
        'writing the range was quicker than finding out which two addresses, the printer worked, the ' +
        'ticket closed. Read a rule against the request that produced it. A rule that works is not a ' +
        'rule that is right, and nothing ever complains about a permission being too wide. And look ' +
        'at the description: it says display and printer. It documents the intent perfectly and ' +
        'permits something else, which is why reading the rule list would never have caught it.',
      commandOptions: [
        { command: "grep -A4 'rule 47' /evidence/firewall/ruleset.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'display|printer|guest' /evidence/change/tickets-2023.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewalld', ...STATUS_CHECK },
        { command: 'cat /evidence/firewall/ruleset.txt', ...DUMP_ALL },
        { command: 'firewall-cmd --remove-rule 47 --permanent', ...MUTATE },
      ],
      commandNudge:
        'Find the rule that let those forty through, then find the ticket that asked for it.',
      guidance:
        'Something was permitted. Ask who permitted it and for what.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'discovery',
      techniques: ['T1046'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.ttp-map'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'A supplier representative laptop, unmanaged by Ardal, carrying a four year old worm ' +
        'component that scans whatever network it lands on. Nobody targeted Ardal and there is no ' +
        'campaign to attribute, which is worth saying because the room has been treating a boundary ' +
        'failure as an intrusion and the write-up will be wrong if that framing survives. It also ' +
        'changes what happens next in a specific way: this laptop is not Ardal to seize, image or ' +
        'reimage, it belongs to a supplier employee who came to a meeting, and the only reasonable ' +
        'actions are asking them to disconnect and telling their firm what was found. Do not ' +
        'lose the useful half either. The scan was indiscriminate, which means the exposure it ' +
        'found is available to anything that connects to that wireless, and the next infected ' +
        'laptop through the door finds the same forty hosts.',
      standIn:
        'Supplier rep laptop, not managed by us, carrying a four year old worm that scans whatever ' +
        'network it lands on. Nobody targeted Ardal and there is nothing to attribute, and I want ' +
        'that said, because we have been treating a boundary failure as an intrusion and the ' +
        'write-up will be wrong if that sticks. It also changes what we can do: that is not our ' +
        'laptop to seize or reimage, it belongs to somebody who came to a meeting. Ask them to ' +
        'disconnect and tell their firm what we saw. And keep the useful half: the scan was ' +
        'indiscriminate, so the next infected laptop through the door finds the same forty hosts.',
      commandOptions: [
        { command: "grep -iE 'port|pattern|interval' /evidence/network/scan-signature.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i '192.0.2.61' /evidence/wireless/dhcp-leases.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status hostapd', ...STATUS_CHECK },
        { command: 'cat /evidence/wireless/dhcp-leases.log', ...DUMP_ALL },
        { command: 'ssh admin@192.0.2.61', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out whose device that is and what the scanning pattern matches.',
      guidance:
        'A device is scanning. Ask whose it is.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['soc-operator', 'log-analyst'],
      correctActions: ['act.corroborate', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'A second scanner on the same range and it is the building management contractor doing an ' +
        'announced survey. Approved ticket, told to facilities on Monday, ports 80, 443 and 502, ' +
        'and its traffic reaches only the building systems range. Close it. The reason this is worth ' +
        'the two minutes rather than being waved through is that it is a genuinely different thing ' +
        'wearing the same clothes: same range, same behaviour, same alert. The discriminators are ' +
        'the ports, which are web and an industrial control protocol rather than file sharing and ' +
        'remote access, and the existence of somebody who can say they asked for it. A floor in the ' +
        'middle of an incident is primed to see a second attacker, and this is the moment that ' +
        'instinct costs an afternoon and a phone call to a contractor who did nothing wrong.',
      standIn:
        'Second scanner, same range, and it is the building management contractor doing the heating ' +
        'survey. Approved ticket, announced to facilities Monday, ports 80, 443 and 502, and it only ' +
        'reaches the building systems range. Closing it. Worth the two minutes because it is a ' +
        'different thing in the same clothes: same range, same behaviour, same alert. What separates ' +
        'them is the ports, web and an industrial protocol rather than file sharing and remote ' +
        'access, and that somebody can say they asked for it. Mid-incident we are primed to see a ' +
        'second attacker, and that is what costs an afternoon and an awkward call.',
      commandOptions: [
        { command: "awk '$3==\"192.0.2.44\" {print $5, $6}' /var/log/netflow/today.log | sort -u | head", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'survey|heating|bms' /evidence/change/tickets-current.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status suricata', ...STATUS_CHECK },
        { command: 'cat /var/log/netflow/today.log', ...DUMP_ALL },
        { command: 'grep -rn "192.0.2.44" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Look at what ports the second scanner uses and where its traffic actually goes.',
      guidance:
        'There are two scanners. Ask whether they are doing the same thing.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'detection-engineer'],
      correctActions: ['act.scope-estate', 'act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'A password on a poster since 2022, and 34 of the 61 devices on the visitor range are staff ' +
        'phones. The second fact is the one that changes the afternoon. Everybody arrives at this ' +
        'row planning to change the password, and doing that disconnects a third of the workforce ' +
        'phones along with every visitor, which turns a five minute fix into an incident of its own ' +
        'at the service desk. The reason the staff are there is worth stating plainly rather than ' +
        'as a criticism: joining corporate wireless needs a certificate and a ticket, and joining ' +
        'guest needs eight characters from a poster, so people did the reasonable thing and the ' +
        'security control lost to convenience because it was harder. Every control that is harder ' +
        'than the alternative eventually loses that way, and reporting this as staff behaviour ' +
        'rather than as a design outcome puts the fix in the wrong place.',
      standIn:
        'Password on a poster since 2022, and thirty-four of the sixty-one devices on that range are ' +
        'staff phones. The second one changes the afternoon. Everybody comes to this row wanting to ' +
        'change the password, and that drops a third of the workforce phones along with the ' +
        'visitors, and now we have a service desk incident instead of a five minute fix. And the ' +
        'staff are there for a reason: corporate needs a certificate and a ticket, guest needs eight ' +
        'characters off a poster. They did the sensible thing and the control lost because it was ' +
        'harder. Report that as a design outcome, not as staff behaviour, or the fix lands in the ' +
        'wrong place.',
      commandOptions: [
        { command: "awk -F, '$3==\"guest\" {print $4}' /evidence/wireless/associated-devices.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "grep -icE 'corporate-owned|staff' /evidence/wireless/associated-devices.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status hostapd', ...STATUS_CHECK },
        { command: 'cat /evidence/wireless/associated-devices.csv', ...DUMP_ALL },
        { command: 'wifi-cli network set guest --rotate-psk', ...MUTATE },
      ],
      commandNudge:
        'Find out who is actually on the guest network before proposing to change its password.',
      guidance:
        'The guest password is public. Ask who is using it.',
    },
    {
      eventId: 'ev.7',
      verdict: 'blocked-reconnaissance',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.timeline', 'act.scope-estate'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Nothing authenticated, so nothing was taken, and the honest report says so first rather ' +
        'than burying it under what could have happened. Then say what was reachable, because that ' +
        'is the actual finding and it is uncomfortable: print servers holding seven days of spooled ' +
        'documents, and a display controller with a shared local administrator password used on ' +
        'four other office systems. The worm did not try any of that because it is a scanner with no ' +
        'idea where it is, and a person on that laptop would have had a straightforward afternoon. ' +
        'Hold both halves at once, which is the difficult part of writing this up. This was not a ' +
        'breach and reporting it as one would be false. It was also not a near miss in the sense of ' +
        'good luck, because the boundary that was supposed to prevent it was not working, and the ' +
        'thing that saved Ardal was the attacker being uninterested.',
      standIn:
        'Nothing authenticated, so nothing was taken, and that goes first in the report, not buried ' +
        'under what could have happened. Then what was reachable, and it is uncomfortable: print ' +
        'servers with seven days of spooled documents, and a display controller with a shared local ' +
        'admin password used on four other systems. The worm tried none of it because it is a ' +
        'scanner with no idea where it is. A person on that laptop has a straightforward afternoon. ' +
        'Hold both halves. This was not a breach and saying it was would be false, and it was not ' +
        'good luck either, because the boundary that should have stopped it was not working. What ' +
        'saved us was the attacker not being interested.',
      commandOptions: [
        { command: "grep -icE 'auth_success|logon' /var/log/office-services/access-today.log", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"192.0.2.61\" {print $5}' /var/log/firewall/traffic.log | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status cups', ...STATUS_CHECK },
        { command: 'cat /var/log/office-services/access-today.log', ...DUMP_ALL },
        { command: 'grep -c connect /var/log/office-services/access-today.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether any of the forty connections got past a login prompt.',
      guidance:
        'Forty connections completed. Ask whether any of them got in.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.contain-scoped', 'act.check-rollback', 'act.sequence-remedy', 'act.compensating-control'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The right action is narrow, cheap and obvious once the rule has been read: change rule 47 ' +
        'from the whole range to the two addresses the ticket asked for. Five minutes, stops the ' +
        'scanning reaching anything, and the display and the printer keep working, which means ' +
        'there is no trade-off to argue about and it should be done before the meeting ends. Ask ' +
        'reception to have the visitor disconnect, which costs nothing and is a courtesy to their ' +
        'firm as much as to Ardal. Then stop, because the next two items are not incident actions. ' +
        'Changing the guest password drops 34 staff phones and needs to be planned rather than ' +
        'done, and making corporate wireless easy to join is a project with a budget, and both will ' +
        'be proposed in the next ten minutes by somebody with adrenaline. Deliberately left undone: ' +
        'the display controller shared administrator password is still on four other systems, and ' +
        'the three other boundaries nobody has tested are still untested tonight.',
      standIn:
        'Narrow and cheap. Change rule 47 from the whole range to the two addresses the ticket asked ' +
        'for. Five minutes, stops the scanning reaching anything, display and printer keep working, ' +
        'so there is nothing to argue about and it should be done before the meeting ends. Reception ' +
        'asks the visitor to disconnect, costs nothing, and it is a courtesy to their firm too. Then ' +
        'stop. The guest password drops thirty-four staff phones and gets planned, not done, and ' +
        'making corporate wireless easy to join is a project with a budget. Somebody will propose ' +
        'both in the next ten minutes on adrenaline. Left undone: that shared admin password is ' +
        'still on four other systems, and three other boundaries are still untested.',
      commandNudge:
        'Find the change that closes this without breaking the thing the rule was written for.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.scope-estate', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'The diagram says isolated, the design document says isolated, and last year audit response ' +
        'says isolated, and all three are describing an intention rather than a measurement. Nobody ' +
        'lied: the network was isolated when it was drawn, a rule was added in 2023 for a good ' +
        'reason, and no document updates itself. That is the finding and it is about a missing ' +
        'habit rather than a missing control. An isolation claim is testable in about ten minutes by ' +
        'plugging into the visitor range and trying to reach something, and the reason nobody has ' +
        'done it is that it feels like checking something already known. Three other boundaries ' +
        'documented as isolated have also never been tested, so the prediction has a number on it ' +
        'and should be written down: at least one of those three is also wrong, and the way Ardal ' +
        'will find out is the way it found out today, which is by accident and in front of a ' +
        'supplier.',
      standIn:
        'Diagram says isolated, design document says isolated, last year audit answer says isolated, ' +
        'and all three describe an intention, not a measurement. Nobody lied. It was isolated when it ' +
        'was drawn, a rule went in for a good reason in 2023, and documents do not update ' +
        'themselves. The finding is a missing habit, not a missing control. You can test an ' +
        'isolation claim in ten minutes by plugging into the visitor range and trying to reach ' +
        'something, and nobody does because it feels like checking something we already know. Three ' +
        'other boundaries are documented the same way and never tested. Write the prediction down: ' +
        'at least one of those three is also wrong, and we will find out the way we found out today, ' +
        'by accident and in front of a supplier.',
      commandOptions: [
        { command: "grep -icE 'isolated|segregated' /evidence/network/design-document.txt", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4==\"isolated\" {print $1}' /evidence/network/boundaries.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewalld', ...STATUS_CHECK },
        { command: 'cat /evidence/network/design-document.txt', ...DUMP_ALL },
        { command: 'grep -rn "isolated" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Count how many other boundaries are documented as isolated, and find out who has tested them.',
      guidance:
        'The diagram was wrong. Ask what else the diagram claims.',
    },
  ],
};
