/**
 * Scenario 25: Found In The Car Park.
 *
 * A device somebody plugged into a wall port in an outpatient waiting area.
 *
 * WHY THIS ONE CLOSES THE SET
 *
 * Every other scenario in these twenty-five is reachable from a console.
 * Somebody arrives over the network, through an email, in a package, or with a
 * credential. This one begins with a person walking into a building where the
 * public is invited, and it ends with a piece of hardware that has to be
 * physically retrieved by somebody who walks to a room.
 *
 * It is here because a floor that has worked twenty-four network incidents will
 * reach for network answers, and the correct actions include telling facilities
 * which wall port to disable and sending an engineer to a waiting room. Security
 * is not entirely a thing that happens on screens, and the last scenario in the
 * set should say so.
 *
 * WHAT IT TEACHES TECHNICALLY
 *
 * That network access control fails open in most estates, because it has to.
 * Clinical devices that predate the standard, contractor laptops, and the
 * hundred exceptions a hospital accumulates mean the fallback for an
 * unrecognised device is usually a guest or quarantine segment rather than no
 * access at all, and the interesting question is what that segment can still
 * reach.
 *
 * THE TRAP
 *
 * `ev.6` looks like a second rogue device on another floor and is a genuine
 * piece of clinical equipment with a work order. Sending security to a
 * children ward over it is a specific and avoidable harm.
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
  WRONG_TARGET,
} from './distractors.js';

const ID = 'found-in-the-car-park';

export const FOUND_IN_THE_CAR_PARK: Scenario = {
  id: ID,
  title: 'Found In The Car Park',
  difficulty: 'advanced',
  durationMinutes: 60,
  situation:
    'It is 12:30. An unrecognised device appeared on the network this morning and network access ' +
    'control put it where it puts anything it does not recognise. It is still connected. Some of ' +
    'what you need to do today involves somebody physically walking somewhere.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'vulnerability-analyst',
    'forensics',
    'threat-intel',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Unrecognised device authenticated to the quarantine segment at 08:14',
      detail:
        'A device with no inventory record connected to wall port 2F-114 at 08:14 and failed ' +
        'certificate-based network access control. Policy places unrecognised devices in the ' +
        'quarantine segment rather than denying access, because clinical equipment predating the ' +
        'standard would otherwise stop working. Rule history: fired 60 times in thirty days, 58 ' +
        'closed as unregistered contractor equipment.',
      source: 'port 2F-114',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'network-flow',
      summary: 'The device is scanning the quarantine segment and reaching two other segments',
      detail:
        'The device has swept the quarantine segment and made connections into the clinical device ' +
        'segment and the guest wireless segment. Quarantine is routed to both for a printing ' +
        'service and a captive portal, exceptions added in 2022 and 2023. It has also established ' +
        'a persistent outbound connection to 203.0.113.72 over the guest path.',
      source: 'quarantine segment',
      target: '203.0.113.72:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'Port 2F-114 is in an outpatient waiting area',
      detail:
        'The cable plant record puts 2F-114 in the second floor outpatient waiting area, behind a ' +
        'row of seating near a vending machine. The area is open to the public between 07:00 and ' +
        '19:00 and has no badge control. There is a camera covering the entrance to the corridor ' +
        'but not the seating area itself.',
      source: 'facilities',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'process-tree',
      summary: 'The device is presenting a captured authentication exchange back to the network',
      detail:
        'Traffic analysis shows the device capturing broadcast name resolution requests and ' +
        'responding to them, then relaying the resulting authentication exchanges. Three staff ' +
        'workstations on the clinical segment have responded. The technique needs no credential and ' +
        'works because the protocol trusts any answer it receives.',
      source: 'rogue device',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'Three captured authentication exchanges belong to clinical staff accounts',
      detail:
        'The three responding workstations were logged in as clinical staff accounts. One holds ' +
        'membership of a group with access to the electronic patient record administrative ' +
        'interface. The captured material is sufficient to attempt offline recovery of the ' +
        'credentials, and whether that succeeds depends entirely on password strength.',
      source: 'rogue device',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'A second unrecognised device appeared on the fourth floor at 11:20',
      detail:
        'Another device without an inventory record joined the quarantine segment at 11:20 from ' +
        'port 4C-208, on the paediatric ward. Biomedical engineering has a work order for a ' +
        'replacement vital signs monitor delivered this morning, serial number matching, awaiting ' +
        'registration. Its traffic is limited to the vendor configuration endpoint.',
      source: 'port 4C-208',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Quarantine segment routes to four other segments through accumulated exceptions',
      detail:
        'A review of quarantine segment routing finds four permitted paths out, added between 2021 ' +
        'and 2024 for a printing service, a captive portal, a device registration service and a ' +
        'vendor support tool. Each has a change record and a business justification. Together they ' +
        'mean quarantine reaches most of the estate.',
      source: 'network configuration',
      claimedSeverity: 'medium',
    },
  ],
};

export const FOUND_IN_THE_CAR_PARK_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 08:14 somebody plugged a small device into a wall port behind the seating in the second floor outpatient waiting area, which is open to the public and has no badge control.',
    'Network access control did not recognise it and placed it in quarantine, which is the correct configured behaviour and not a failure.',
    'Quarantine has four permitted routes out, each added for a real reason with a change record, and together they reach most of the estate.',
    'The device swept the segment, reached the clinical and guest segments, and opened a persistent outbound connection over the guest path.',
    'It answered broadcast name resolution requests and relayed the resulting authentication exchanges. Three clinical workstations responded.',
    'One of those accounts holds administrative access to the electronic patient record. Whether the captured material yields a usable credential depends on password strength alone.',
    'It is still plugged in, and removing it requires a person to walk to the second floor.',
    'The second device that appeared at 11:20 is a replacement vital signs monitor with a work order and a matching serial number.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1200'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.reimage-now', 'act.declare'],
      escalateTo: ['network-analyst', 'ir-lead'],
      why:
        'Fifty-eight of sixty closed as unregistered contractor equipment, and most days that is ' +
        'exactly what this is. The reason to look rather than close is that this row says nothing ' +
        'about WHERE, and location is the whole question for a physical connection: an ' +
        'unregistered laptop in an engineering office and an unknown device in a public waiting ' +
        'area are the same alert and completely different problems. Worth registering early that ' +
        'the access control did not fail. It placed an unrecognised device in quarantine, which is ' +
        'the configured behaviour, and it exists because clinical equipment predating the standard ' +
        'would otherwise stop working mid-treatment.',
      standIn:
        'Unrecognised device on port 2F-114 since 08:14, failed certificate NAC, dropped into ' +
        'quarantine as configured. Fifty-eight of sixty this month were contractor kit. Raising it ' +
        'because I do not know where that port is and I want to.',
      commandOptions: [
        { command: 'grep 2F-114 /var/log/nac/events.log', ...WRONG_TARGET },
        { command: 'awk \'/QUARANTINE/ {print $4}\' /var/log/nac/events.log | sort | uniq -c', ...WRONG_TARGET },
        { command: 'cat /etc/inventory/devices.csv | grep -i 2F', correct: true, teaches: CORRECT_STEP },
        { command: 'arp -a | head -20', ...STATUS_CHECK },
        { command: 'systemctl status nac-agent', ...STATUS_CHECK },
      ],
      commandNudge: 'Find out which physical port that is and where in the building it sits.',
      guidance:
        'Ask where this device physically is. The same alert means different things in different ' +
        'rooms.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'discovery',
      techniques: ['T1046', 'T1071.001'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'malware-analyst'],
      why:
        'Settles what it is in one observation: contractor laptops do not sweep the segment they ' +
        'land on. Sweeping, then reaching two other segments, then holding a persistent outbound ' +
        'connection is a device doing a job. The important finding underneath is that quarantine ' +
        'was never the containment everybody assumed. It routes to the clinical segment for a ' +
        'printing service and to guest for a captive portal, exceptions added in 2022 and 2023, ' +
        'each sensible on the day it was made. The outbound connection over the guest path is the ' +
        'part that makes this interactive rather than autonomous: somebody is on the other end and ' +
        'can change what it does.',
      standIn:
        'It swept quarantine, then reached the clinical device segment and guest wireless, and it ' +
        'is holding a persistent outbound connection over the guest path. Quarantine routes to both ' +
        'through exceptions from 2022 and 2023. Contractor laptops do not port scan. Somebody is on ' +
        'the other end of that connection.',
      commandOptions: [
        { command: 'awk \'$2 ~ /10.99/ {print $4}\' /var/log/flows.log | sort | uniq -c | sort -rn | head', ...WRONG_TARGET },
        { command: 'grep 203.0.113.72 /var/log/flows.log', ...WRONG_TARGET },
        { command: 'cat /etc/network/quarantine-routes.conf', correct: true, teaches: CORRECT_STEP },
        { command: 'netstat -rn', ...WRONG_TARGET },
        { command: 'traceroute 203.0.113.72', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check what the quarantine segment can actually reach before assuming it is contained.',
      guidance:
        'Ask what quarantine really means here. A segment named for isolation is not necessarily ' +
        'isolated.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1200'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The answer to where, and it changes the entire response. Port 2F-114 is behind seating in ' +
        'a public outpatient waiting area, open 07:00 to 19:00, no badge control, and the camera ' +
        'covers the corridor entrance rather than the seating. So anybody could have plugged this ' +
        'in without doing anything suspicious, and there may be no footage of the act itself. Two ' +
        'consequences the floor has to state rather than assume. Retrieval is a physical task ' +
        'needing a named person to walk to the second floor, and it should happen carefully rather ' +
        'than by a security officer confronting whoever is sitting nearby. And the camera covering ' +
        'the corridor is still worth pulling for the window around 08:14, even though it does not ' +
        'cover the port.',
      standIn:
        'Port 2F-114 is behind the seating in the second floor outpatient waiting area. Public ' +
        'access 07:00 to 19:00, no badge control, and the camera covers the corridor entrance, not ' +
        'the seating. Anybody could have plugged this in. We need somebody to physically go and get ' +
        'it, and the corridor footage around 08:14 is worth pulling.',
      commandOptions: [
        { command: 'grep 2F-114 /etc/facilities/cable-plant.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'awk -F, \'$1=="2F-114" {print $3, $4}\' /etc/facilities/cable-plant.csv', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /etc/facilities/camera-coverage.csv | grep 2F', ...WRONG_TARGET },
        { command: 'grep -i outpatient /etc/facilities/access-control.csv', ...WRONG_TARGET },
        { command: 'ls /var/log/facilities/', ...WRONG_TARGET },
      ],
      commandNudge: 'Look up the cable plant record for that port and see what room it is in.',
      guidance:
        'Somebody physically put this here. Ask who could get to that room and whether anything ' +
        'recorded it.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1557.001'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['network-analyst', 'forensics'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.contact-attacker', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'What it is actually for. It answers broadcast name resolution requests and relays the ' +
        'authentication exchanges that follow, which needs no credential, no vulnerability and no ' +
        'exploit: the protocol trusts any answer it receives, and it is enabled by default. That ' +
        'is why this device does not need to reach anything sensitive itself. It waits for ' +
        'workstations to mistype a hostname or look for a share that has moved, and three have ' +
        'already responded. The control that stops it is disabling those broadcast protocols, ' +
        'which is a configuration change rather than a patch, and the reason it is still on in most ' +
        'estates is that something old always breaks when you turn it off.',
      standIn:
        'The device is answering broadcast name resolution requests and relaying the authentication ' +
        'exchanges that follow. No credential, no exploit, no vulnerability. The protocol trusts ' +
        'whatever answers, and it is on by default. Three staff workstations have already responded.',
      commandOptions: [
        { command: 'tcpdump -r /var/cap/quarantine.pcap -c 30', ...WRONG_TARGET },
        { command: 'awk \'/NBT-NS|LLMNR/ {print $3}\' /var/log/network/broadcast.log | sort | uniq -c', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c LLMNR /var/log/network/broadcast.log', ...COUNT_ONLY },
        { command: 'nmap -sU -p137 10.99.0.0/24', ...TOUCH_ATTACKER },
        { command: 'cat /etc/network/protocols-enabled.conf', ...WRONG_TARGET },
      ],
      commandNudge:
        'Look at what the device is answering, not just what it is connecting to.',
      guidance:
        'It has no credentials and it is collecting something. Ask what a workstation would hand it ' +
        'voluntarily.',
    },
    {
      eventId: 'ev.5',
      critical: true,
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1557.001', 'T1110.002'],
      firstResponder: 'forensics',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reset-password', 'act.reimage-now', 'act.dismiss', 'act.power-off'],
      escalateTo: ['ir-lead'],
      why:
        'What is at stake, and it needs stating with its uncertainty intact. Three captured ' +
        'exchanges from clinical staff accounts, one of which holds administrative access to the ' +
        'electronic patient record. The material is sufficient to ATTEMPT offline credential ' +
        'recovery, and whether that succeeds depends entirely on password strength, which nobody ' +
        'here knows. So the honest report says three credentials are at risk and one of them would ' +
        'be serious, not that three credentials are compromised. The other honest part is timing: ' +
        'offline recovery happens on the attacker hardware at their pace, so there is no window to ' +
        'race and no way to observe it. That argues for rotating those three now rather than ' +
        'waiting to find out.',
      standIn:
        'The three workstations that responded were logged in as clinical staff, and one of those ' +
        'accounts has administrative access to the electronic patient record. The captured material ' +
        'is enough to attempt offline recovery. Whether it works depends on password strength and I ' +
        'cannot tell you. Three credentials at risk, one of them serious. Rotate them.',
      commandNudge:
        'Find out which accounts were logged in on the workstations that responded.',
      guidance:
        'Ask what they can do with what they captured, and be honest about what you cannot know.',
    },
    {
      eventId: 'ev.6',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'A second unrecognised device three hours after the first, which on this board reads as a ' +
        'campaign. It is a replacement vital signs monitor delivered this morning, with a work ' +
        'order, a matching serial number, and traffic limited to the vendor configuration endpoint. ' +
        'Two checks settle it in two minutes: the work order and what the device is actually ' +
        'talking to. The cost of getting it wrong is unusually concrete here, because the wrong ' +
        'answer sends security staff onto a paediatric ward to seize a piece of monitoring ' +
        'equipment that is about to be attached to a child. Ordinary hospital operations continue ' +
        'during an incident, and a floor that treats every unregistered device as hostile will ' +
        'interrupt patient care roughly sixty times a month.',
      standIn:
        'Second device on the paediatric ward at 11:20 is a replacement vital signs monitor ' +
        'delivered this morning. Biomed have the work order, the serial matches, and its traffic ' +
        'only goes to the vendor configuration endpoint. Not related. Closing it, and nobody is ' +
        'going to that ward.',
      commandOptions: [
        { command: 'grep 4C-208 /var/log/nac/events.log', ...WRONG_TARGET },
        { command: 'cat /var/log/biomed/work-orders.log | grep -i monitor', correct: true, teaches: CORRECT_STEP },
        { command: 'awk \'$2 ~ /4C-208/ {print $4}\' /var/log/flows.log | sort -u', ...WRONG_TARGET },
        { command: 'grep -i paediatric /etc/inventory/devices.csv', ...WRONG_TARGET },
        { command: 'cat /etc/facilities/cable-plant.csv | grep 4C', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether biomedical engineering has a work order for that device, and what it is ' +
        'talking to.',
      guidance:
        'A second unknown device is not automatically a second attacker. Ask whether anybody was ' +
        'expecting it.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: ['ir-lead'],
      why:
        'The condition that made today possible, and every part of it was reasonable when it ' +
        'happened. Four permitted routes out of quarantine, added between 2021 and 2024 for a ' +
        'printing service, a captive portal, a device registration service and a vendor support ' +
        'tool, each with a change record and a real justification. Nobody made a bad decision, and ' +
        'together they mean the segment named for isolation reaches most of the estate. That is the ' +
        'finding worth carrying out of the whole set: controls erode through individually ' +
        'defensible exceptions rather than through failure, and nothing in the estate reviews the ' +
        'accumulated total. The output is the list and the question of which of the four are still ' +
        'needed, which is a different conversation from tonight and the more valuable one.',
      standIn:
        'Quarantine has four permitted routes out, added between 2021 and 2024 for printing, the ' +
        'captive portal, device registration and a vendor support tool. Every one has a change ' +
        'record and a real reason. Together they mean quarantine reaches most of the estate. Nobody ' +
        'made a bad call; nobody reviewed the total.',
      commandNudge:
        'List every route out of the quarantine segment and check when each was added and why.',
      guidance:
        'Ask how a segment meant to isolate ended up reaching everything. Then ask which exceptions ' +
        'are still needed.',
    },
  ],
};
