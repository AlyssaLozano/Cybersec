/**
 * Scenario 46: Cold Room.
 *
 * The building management system, reached from the office network, controlling
 * things that are physical.
 *
 * WHAT THIS TEACHES
 *
 * That containment can cause the harm it is meant to prevent. Everywhere else on
 * this platform, isolating a compromised system is the conservative move and the
 * only argument is about evidence. Here the compromised system holds the
 * setpoints on eleven chilled bays, the fire suppression interlocks and the door
 * releases, and pulling it off the network does not stop it controlling any of
 * them: it stops anybody being able to see or change what it is doing.
 *
 * So the usual instinct inverts. The safe action is not to disconnect, it is to
 * establish what the system is currently doing, get somebody physically next to
 * the local panels, and only then decide. That sequencing is the whole scenario
 * and it belongs to the Mitigation Specialist, who has to say plainly that the
 * containment everybody is reaching for would leave a compromised controller
 * running eleven refrigeration circuits with nobody watching.
 *
 * WHY IT IS ADVANCED
 *
 * The technical chain is ordinary. What is hard is that every remedy has a
 * physical consequence, the constraints are not in any system the SOC can read,
 * and the correct answer requires knowing what a warehouse actually does.
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

const ID = 'cold-room';

export const COLD_ROOM: Scenario = {
  id: ID,
  title: 'Cold Room',
  difficulty: 'advanced',
  durationMinutes: 60,
  situation:
    'It is 03:20 at Ardal Freight. Three chilled bays at the Immingham depot are running warmer ' +
    'than they should and the building management system says everything is fine. There are ' +
    'nineteen tonnes of pharmaceutical freight in bay four.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
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
      summary: 'Three chilled bays two degrees above setpoint with no alarm raised',
      detail:
        'The depot night supervisor rang because a handheld probe reads 4.1, 4.3 and 3.9 degrees in ' +
        'bays two, four and seven against a setpoint of 2.0. The building management console shows ' +
        'all three at 2.0 and reports no alarm. Bay four holds nineteen tonnes of pharmaceutical ' +
        'freight with a two to eight degree excursion limit and a documented stability window. Rule ' +
        'history: no security rule covers the building management system.',
      source: 'adf-bms-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 130,
      surface: 'network-flow',
      summary: 'The controller has held an outbound connection since 02:44',
      detail:
        'adf-bms-01 has an established connection to 203.0.113.176:8081 since 02:44, exchanging ' +
        'small amounts at irregular intervals. The controller normally speaks only to the depot ' +
        'workstations and the vendor update endpoint. The address has no history in the estate. The ' +
        'temperature drift began at 02:51.',
      source: 'adf-bms-01',
      target: '203.0.113.176:8081',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 290,
      surface: 'raw-log',
      summary: 'A vendor remote support tunnel has been open since March',
      detail:
        'The controller runs a vendor remote support agent that maintains a permanent outbound ' +
        'tunnel, installed at commissioning and open continuously since March. It is how the vendor ' +
        'performs maintenance without a site visit and is contractually required for the support ' +
        'agreement. Access through it is controlled entirely by the vendor. There is no record on ' +
        'our side of who has used it or when.',
      source: 'adf-bms-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 450,
      surface: 'host-artefact',
      summary: 'Setpoints were changed through the management interface, and the display was not',
      detail:
        'The controller configuration shows the actual setpoints for bays two, four and seven ' +
        'changed to 4.2 degrees at 02:51. The console display value is a separate stored field and ' +
        'still reads 2.0, which is why no alarm fired: the alarm compares the reading against the ' +
        'display value rather than the operating value. Both fields are writable through the ' +
        'management interface.',
      source: 'adf-bms-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 610,
      surface: 'alert-queue',
      summary: 'The same controller holds fire suppression interlocks and door releases',
      detail:
        'adf-bms-01 controls refrigeration on eleven bays, the fire suppression interlocks for the ' +
        'whole warehouse, and the emergency door releases. Disconnecting it from the network does ' +
        'not stop it operating any of them: the control loops run locally on the unit. It removes ' +
        'remote visibility and remote control, including the ability to correct the setpoints. ' +
        'Local panels exist at each bay and require somebody physically present.',
      source: 'adf-bms-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 760,
      surface: 'network-flow',
      summary: 'The building management segment is reachable from the office network',
      detail:
        'The building management segment is routed to the office VLAN through an exception added in ' +
        '2019 so the facilities team could view dashboards from their desks. Every workstation in ' +
        'the Immingham office can reach the controller management interface. The interface ' +
        'authenticates with a shared password held in the facilities team password manager, ' +
        'unchanged since commissioning.',
      source: 'adf-bms-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Compressor fault alarm on bay nine',
      detail:
        'Bay nine raised a genuine compressor fault at 01:40 and the standby compressor cut in ' +
        'automatically, holding the bay at setpoint. Maintenance have an open work order and the ' +
        'part is due Thursday. The bay is at 2.0 degrees on both the probe and the console. Rule ' +
        'history: fired 30 times in thirty days, 30 closed as plant maintenance.',
      source: 'adf-bms-01',
      claimedSeverity: 'medium',
    },
  ],
};

export const COLD_ROOM_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The building management controller has run a vendor remote support tunnel continuously since it was commissioned in March, and it is contractually required.',
    'Its management segment is also routed to the office VLAN through a 2019 exception so facilities could see dashboards from their desks, and it authenticates with a shared password unchanged since commissioning.',
    'At 02:44 somebody established an outbound connection from the controller to an address with no history in the estate.',
    'At 02:51 they changed the operating setpoints for bays two, four and seven from 2.0 to 4.2 degrees.',
    'They did not change the console display value, which is a separate stored field. The alarm compares the reading against the display value rather than the operating value, so nothing alarmed and the console still says everything is fine.',
    'Nobody would have noticed if a night supervisor had not walked the floor with a handheld probe.',
    'Bay four holds nineteen tonnes of pharmaceutical freight with a two to eight degree excursion limit, so nothing is spoiled yet and the window is not open indefinitely.',
    'The same controller runs the fire suppression interlocks and the emergency door releases, and disconnecting it stops nobody controlling it remotely while it keeps controlling everything locally.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1565.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.power-off', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'Two measurements of the same thing disagree, and one of them came from a person holding a ' +
        'probe. That is the finding: a handheld reads 4.1 and the console reads 2.0, so either the ' +
        'probe is wrong or the console is lying, and a console that is lying about eleven ' +
        'refrigeration circuits is a security event. Declare immediately, and note what is on the ' +
        'clock rather than treating it as background: nineteen tonnes of pharmaceutical freight ' +
        'with a two to eight degree limit means nothing is ruined yet and the window is finite. ' +
        'Isolation is graded out of lane on this row and it will feel wrong, which is what ev.5 is ' +
        'for.',
      standIn:
        'Night supervisor at Immingham has a handheld reading 4.1, 4.3 and 3.9 in bays two, four and ' +
        'seven against a setpoint of 2.0, and the console says 2.0 with no alarm. Two measurements ' +
        'of the same thing disagree. Bay four is nineteen tonnes of pharma with a two to eight ' +
        'limit. Declaring.',
      commandOptions: [
        { command: "awk -F, '$2 ~ /bay/ {print $2, $4, $5}' /var/log/bms/readings.csv | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "setpoint\\|alarm" /var/log/bms/controller.log | tail -20', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status bms-collector', ...STATUS_CHECK },
        { command: 'cat /var/log/bms/readings.csv', ...DUMP_ALL },
        { command: 'curl -X POST http://adf-bms-01/api/setpoint -d "bay=4&value=2.0"', ...MUTATE },
      ],
      commandNudge:
        'Compare what the sensors are reporting against what the console is displaying.',
      guidance:
        'Two readings of the same bay disagree. Ask which one is measuring and which one is being ' +
        'told.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'command-and-control',
      critical: true,
      techniques: ['T1071.001'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'Seven minutes between the connection at 02:44 and the drift at 02:51, which is somebody ' +
        'arriving and then acting. The baseline is what makes it provable and it is tight: this ' +
        'controller speaks to the depot workstations and the vendor update endpoint, and nothing ' +
        'else, ever. An operational device has a far shorter list of legitimate destinations than ' +
        'any office machine, which is the one advantage this class of kit gives a defender. ' +
        'Irregular intervals rather than a fixed beacon says somebody is present at the other end ' +
        'now, and that matters for sequencing: whatever the floor does next, they will see it.',
      standIn:
        'The controller has had an outbound connection to an address with no history since 02:44, ' +
        'small amounts at irregular intervals. It normally talks to the depot workstations and the ' +
        'vendor update endpoint and nothing else. Drift starts at 02:51, seven minutes later. ' +
        'Irregular means somebody is on the other end right now.',
      commandOptions: [
        { command: "awk '$2==\"adf-bms-01\" {print $4}' /var/log/flows.log | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 203.0.113.176 /var/log/flows.log | tail -20', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 8081', ...WRONG_TARGET },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'nmap -p 8081 203.0.113.176', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'List everything that controller has ever connected to, then find what is new.',
      guidance:
        'Ask what this device normally talks to. Operational kit has a much shorter list than a ' +
        'laptop.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1199', 'T1133'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.reset-password'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'A permanent outbound tunnel, installed at commissioning, contractually required, and ' +
        'controlled entirely by the vendor. That is a supported configuration rather than a ' +
        'compromise, and it is worth being precise about what it does and does not establish. It ' +
        'is a standing route into the controller that this organisation cannot see into, cannot ' +
        'audit, and cannot close without breaching a support agreement. It does not prove the ' +
        'attacker used it: ev.6 offers a second route that is equally viable. Saying which one was ' +
        'used is not possible tonight, and saying so is better than guessing, because the two lead ' +
        'to completely different conversations, one with a vendor and one with the facilities team.',
      standIn:
        'The controller runs a vendor remote support agent with a permanent outbound tunnel, open ' +
        'since commissioning in March, contractually required, and access through it is controlled ' +
        'entirely by the vendor. We have no record of who has used it or when. That is a standing ' +
        'route in that we cannot see into or close. It is not proof they used it, and there is a ' +
        'second route.',
      commandOptions: [
        { command: 'grep -i "support agent\\|tunnel" /var/log/bms/controller.log | head -20', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"adf-bms-01\" && $5 ~ /vendor/ {print $1, $4}' /var/log/flows-archive.log | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status bms-collector', ...STATUS_CHECK },
        { command: 'cat /var/log/bms/controller.log', ...DUMP_ALL },
        { command: 'grep -c tunnel /var/log/bms/controller.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what standing remote access exists to that controller and who controls it.',
      guidance:
        'Ask how the vendor maintains this thing. The answer is usually a tunnel nobody remembers ' +
        'agreeing to.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1565.001'],
      firstResponder: 'forensics',
      alsoAppropriate: ['vulnerability-analyst', 'mitigation-specialist'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'How the console was made to lie, and it is a deliberate use of a design flaw rather than a ' +
        'trick. The operating setpoint and the console display value are separate stored fields, ' +
        'both writable, and the alarm compares the reading against the DISPLAY value. So changing ' +
        'the operating value alone produces a bay running warm, a console reading normal, and no ' +
        'alarm, permanently. Whoever did this knew that, which is a meaningful statement about ' +
        'them: it is product knowledge rather than general skill. Preserve both fields before ' +
        'anybody corrects the setpoint, because the moment somebody fixes the temperature the ' +
        'evidence that they diverged is gone and the excursion record is what a regulator and a ' +
        'pharmaceutical customer will both ask for.',
      standIn:
        'Operating setpoints for bays two, four and seven were changed to 4.2 at 02:51. The console ' +
        'display value is a separate stored field, still reads 2.0, and the alarm compares the ' +
        'reading against the display rather than the operating value. That is why nothing alarmed. ' +
        'Whoever did this knew the product. Capturing both fields before anybody corrects anything.',
      commandOptions: [
        { command: "diff <(curl -s http://adf-bms-01/api/setpoints/operating) <(curl -s http://adf-bms-01/api/setpoints/display)", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -A4 "02:51" /var/log/bms/config-changes.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status bms-collector', ...STATUS_CHECK },
        { command: 'cat /var/log/bms/config-changes.log', ...DUMP_ALL },
        { command: 'curl -X POST http://adf-bms-01/api/setpoint -d "bay=2&value=2.0"', ...MUTATE },
      ],
      commandNudge:
        'Compare the operating setpoint against whatever value the console is displaying.',
      guidance:
        'The console is wrong and no alarm fired. Ask what the alarm actually compares against.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.power-off', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The row that inverts the usual instinct, and the reason this seat exists. Everybody in the ' +
        'room wants to disconnect the controller, and disconnecting it does not stop it doing ' +
        'anything: the control loops run locally on the unit, so it keeps operating eleven ' +
        'refrigeration circuits, the fire suppression interlocks and the emergency door releases ' +
        'exactly as it is currently configured. What isolation removes is the ability to SEE it and ' +
        'the ability to CORRECT it. So the proposal that looks conservative would leave a ' +
        'compromised controller running a warehouse with nobody able to change anything remotely, ' +
        'and the setpoints would stay at 4.2. The right sequence is the other way round: get ' +
        'somebody to the local panels first, correct the operating setpoints, confirm by probe ' +
        'rather than by console, and only then cut the network. Saying that out loud against a room ' +
        'that wants to act is the job.',
      standIn:
        'Everybody wants to pull it off the network and that is the wrong move. The control loops ' +
        'run locally, so disconnecting stops nothing: it keeps running eleven bays, the fire ' +
        'suppression interlocks and the door releases exactly as configured, and we lose the ability ' +
        'to see it or fix it. The setpoints would stay at 4.2. Get somebody to the local panels ' +
        'first, correct the setpoints there, confirm by probe not by console, then cut the network.',
      commandNudge:
        'Find out what that controller actually operates, and what stops working if you disconnect ' +
        'it.',
      guidance:
        'Ask what the controller keeps doing after you unplug it. If the answer is everything, ' +
        'isolation is not containment.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1078.001'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'The second route, and it is the one nobody in the estate thinks of as a route at all. The ' +
        'building management segment is reachable from the office VLAN through a 2019 exception ' +
        'added so facilities could see dashboards from their desks, which was a reasonable request ' +
        'answered in the simplest way available. So every workstation in the Immingham office can ' +
        'reach the management interface, and that interface authenticates with a shared password ' +
        'held in a team password manager and unchanged since commissioning. Combined, that is a ' +
        'route from any phished office laptop straight to eleven refrigeration circuits. The ' +
        'finding for the debrief is that the operational network was never separate: it was ' +
        'separate on the diagram and routed in the configuration, and only one of those is a ' +
        'control.',
      standIn:
        'The building management segment is routed to the office VLAN through a 2019 exception so ' +
        'facilities could see dashboards at their desks. Every workstation in the Immingham office ' +
        'can reach the management interface, and it authenticates with a shared password from the ' +
        'team password manager, unchanged since commissioning. Any phished office laptop reaches ' +
        'eleven refrigeration circuits. It is separate on the diagram and routed in the config.',
      commandOptions: [
        { command: "awk '$4 ~ /10.60.9/ {print $2}' /var/log/flows.log | sort -u | head -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -A5 -i "bms\\|facilities" /etc/network/segments.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -rn', ...WRONG_TARGET },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'nmap -sn 10.60.9.0/24', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out which networks can reach the building management segment.',
      guidance:
        'Ask whether the operational network is actually separate, or only separate on the diagram.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'A genuine compressor fault on bay nine, ninety minutes before the drift, on the same ' +
        'controller. It is real plant failure: the standby cut in automatically, the bay is holding ' +
        'at setpoint, maintenance have a work order and the part arrives Thursday, and 30 of 30 ' +
        'this month were the same. The discriminator is the one that matters across this whole ' +
        'board and it is worth stating in those terms: bay nine reads 2.0 on the probe AND 2.0 on ' +
        'the console, and the two agree. Bays two, four and seven do not. Equipment failing and ' +
        'equipment being lied about look identical on a console, and the only way to separate them ' +
        'is a physical measurement.',
      standIn:
        'Bay nine is a genuine compressor fault at 01:40, standby cut in automatically, bay is ' +
        'holding at setpoint, work order open and the part lands Thursday. Thirty of thirty this ' +
        'month were the same. Probe and console both read 2.0 and they agree, which is exactly what ' +
        'our three bays do not do. Closing it.',
      commandOptions: [
        { command: "awk -F, '$2==\"bay9\" {print $4, $5}' /var/log/bms/readings.csv | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "compressor\\|work order" /var/log/maintenance/orders.log | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status bms-collector', ...STATUS_CHECK },
        { command: 'cat /var/log/bms/alarms.log', ...DUMP_ALL },
        { command: 'grep -c FAULT /var/log/bms/alarms.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether the probe and the console agree on that bay, and whether maintenance know ' +
        'about it.',
      guidance:
        'Equipment fails all the time. Ask whether the two readings for this bay agree with each ' +
        'other.',
    },
  ],
};
