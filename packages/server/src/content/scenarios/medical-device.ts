/**
 * Scenario 22: Infusion.
 *
 * Compromised infusion pumps on a clinical ward, where every containment action
 * has a patient attached to it.
 *
 * WHY THIS ONE IS DIFFERENT
 *
 * Everywhere else on this platform, isolating a host is the safe conservative
 * move and the debate is only about evidence. Here the affected devices are
 * delivering medication to people in beds. Pulling them off the network,
 * rebooting them or blocking their traffic are all clinical decisions wearing
 * technical clothes, and the SOC does not get to make them alone.
 *
 * The scenario teaches the discipline of establishing clinical impact BEFORE
 * proposing containment, and of handing a decision to the people who own it with
 * the technical facts attached rather than a recommendation dressed as one.
 * `act.isolate` is out of lane on almost every event here, which is true nowhere
 * else in the set.
 *
 * THE OTHER LESSON
 *
 * That you cannot patch what the manufacturer will not let you patch. These
 * devices are regulated: modifying the software voids certification, and the
 * fix has to be a compensating control around the device rather than a change to
 * it. A floor that reports "patch the pumps" has produced an action nobody is
 * legally allowed to take.
 *
 * WHAT IS ACTUALLY HAPPENING
 *
 * The pumps are not the target. They are a foothold on a flat clinical network,
 * chosen because nothing monitors them and nobody can turn them off.
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

const ID = 'infusion';

export const INFUSION: Scenario = {
  id: ID,
  title: 'Infusion',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 20:15. A biomedical engineering technician raised a ticket because four infusion pumps ' +
    'on ward 4B are showing unexpected network activity. All four are in use. Nothing you do here ' +
    'is only a technical decision.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'vulnerability-analyst',
    'forensics',
    'threat-intel',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Four infusion pumps on ward 4B making outbound connections to an external address',
      detail:
        'Biomedical engineering reports that four pumps show sustained network activity to ' +
        '203.0.113.150. The pumps are in active clinical use on four patients. The clinical ' +
        'network is flat: these devices share a segment with 900 other clinical endpoints. No ' +
        'security tooling monitors this segment. Rule history: no rule covers this device class.',
      source: 'ward 4B pumps',
      target: '203.0.113.150:8080',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'network-flow',
      summary: 'The pumps are relaying traffic for other hosts on the clinical segment',
      detail:
        'Flow analysis shows the four pumps receiving connections from eleven other devices on the ' +
        'clinical segment and forwarding that traffic outbound. Volumes are small and steady. The ' +
        'eleven include two nurse workstations and a pharmacy terminal. The pumps are acting as a ' +
        'route out of a segment that has no direct internet path.',
      source: 'clinical segment',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'process-tree',
      summary: 'Pump firmware running an additional service on a port not in the vendor documentation',
      detail:
        'The pumps are listening on a port that appears in no vendor documentation, running a small ' +
        'forwarding service. The device firmware version is current and the vendor has issued no ' +
        'advisory. The pumps run an embedded operating system whose last vendor security update was ' +
        'in 2019. Modifying the software voids the device certification.',
      source: 'ward 4B pumps',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'alert-queue',
      summary: 'Medication delivery parameters on all four pumps match the prescribed values',
      detail:
        'Biomedical engineering and the ward pharmacist have compared the delivery rate, dose and ' +
        'schedule on all four pumps against the prescriptions in the electronic record. All four ' +
        'match exactly. Device event logs show no parameter change since each infusion started. ' +
        'The pumps are delivering correctly.',
      source: 'ward 4B',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'Default management credentials still in place on 140 clinical devices',
      detail:
        'An inventory review shows 140 devices across the clinical estate still using the ' +
        'manufacturer default management credential, including all four pumps. The credentials are ' +
        'published in the vendor manual. Changing them on 96 of the 140 requires a vendor engineer ' +
        'visit under the support contract.',
      source: 'device inventory',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'raw-log',
      summary: 'The pharmacy terminal has been reached from outside through this route',
      detail:
        'Session logs on the pharmacy terminal show four interactive sessions between 18:40 and ' +
        '20:05, sourced from one of the pumps. The terminal holds the controlled drugs register and ' +
        'ordering system. The sessions authenticated with a local account whose password matches a ' +
        'default in the same vendor manual.',
      source: 'pharmacy terminal',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Eleven clinical devices dropped off the network during a scheduled ward reboot',
      detail:
        'Eleven devices on ward 2A stopped responding between 19:00 and 19:20 during a scheduled ' +
        'electrical safety test that required a ward power cycle. Biomedical engineering has the ' +
        'work order and all eleven came back. Rule history: fired 14 times in thirty days, 14 ' +
        'closed as planned maintenance.',
      source: 'ward 2A',
      claimedSeverity: 'medium',
    },
  ],
};

export const INFUSION_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody reached four infusion pumps using the manufacturer default management credential, which is printed in the vendor manual.',
    'They added a small forwarding service on an undocumented port, turning the pumps into a route out of a clinical network that has no direct internet path.',
    'Eleven other devices on that flat segment now route through the pumps, including two nurse workstations and a pharmacy terminal.',
    'They used that route to reach the pharmacy terminal interactively four times, authenticating with another default credential from the same manual.',
    'That terminal holds the controlled drugs register and ordering system.',
    'The medication delivery parameters on all four pumps are correct and unaltered. Nobody has been harmed and no dose has changed.',
    'The pumps were never the target. They were chosen because nothing monitors them, nobody can switch them off, and their credentials are published.',
    '140 clinical devices still hold that default credential, and 96 of them need a vendor engineer on site to change it.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1078.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.isolate', 'act.power-off', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['network-analyst', 'ir-lead'],
      why:
        'Raise it immediately and do not touch anything. Four devices delivering medication to four ' +
        'people are making unexplained external connections, and the instinct every other scenario ' +
        'has built, which is to isolate the affected hosts, is the wrong reflex here and is graded ' +
        'as out of lane. Cutting a pump off the network is a clinical decision with a patient ' +
        'attached, and the SOC does not own it. The other thing to register early is that no rule ' +
        'covers this device class and no security tooling watches this segment, so everything the ' +
        'floor learns tonight comes from somewhere other than the security stack.',
      standIn:
        'Four infusion pumps on 4B making sustained outbound connections to an external address. All ' +
        'four are running on patients. Flat clinical segment with 900 other devices on it and no ' +
        'security monitoring. Raising it. I am not touching the devices.',
      commandOptions: [
        { command: 'grep 203.0.113.150 /var/log/flows.log | tail -20', ...WRONG_TARGET },
        { command: 'awk \'$2 ~ /pump/ {print $2, $4}\' /var/log/flows.log | sort -u', ...WRONG_TARGET },
        { command: 'ping -c1 10.44.2.31', ...TOUCH_ATTACKER },
        { command: 'cat /etc/inventory/clinical-devices.csv | head', correct: true, teaches: CORRECT_STEP },
        { command: 'nmap -sn 10.44.2.0/24', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Establish what those devices are doing clinically before you propose doing anything to ' +
        'them.',
      guidance:
        'Ask what happens to a patient if you take one of these off the network. That decision is ' +
        'not yours alone.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'lateral-movement',
      techniques: ['T1090', 'T1572'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.power-off'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The finding that says what this actually is. The pumps are not being attacked, they are ' +
        'being used: eleven other devices route through them to reach a network the clinical ' +
        'segment has no direct path to. That reframes the incident from four compromised medical ' +
        'devices to a compromised network segment with a route out, and the eleven include a ' +
        'pharmacy terminal. The flat segment is the underlying condition and it is worth naming ' +
        'plainly, because 900 clinical endpoints sharing one segment with no monitoring is why a ' +
        'foothold on a pump reaches anything at all.',
      standIn:
        'The pumps are relaying. Eleven other devices on the clinical segment connect to them and ' +
        'they forward it outbound, including two nurse workstations and a pharmacy terminal. That ' +
        'segment has no direct internet path, so the pumps are the route out. This is not four ' +
        'compromised pumps, it is a compromised segment.',
      commandOptions: [
        { command: 'awk \'$4 ~ /pump/ {print $2}\' /var/log/flows.log | sort | uniq -c', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c 203.0.113.150 /var/log/flows.log', ...COUNT_ONLY },
        { command: 'netstat -rn', ...WRONG_TARGET },
        { command: 'cat /etc/network/segments.conf', ...WRONG_TARGET },
        { command: 'traceroute 203.0.113.150', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check whether anything else on that segment is connecting TO the pumps.',
      guidance:
        'Ask why somebody would want a foothold on a device like this. It is probably not about the ' +
        'device.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1601', 'T1090'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'forensics'],
      correctActions: ['act.decode'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.isolate', 'act.write-rule'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'A forwarding service on an undocumented port, on firmware that is current, from a vendor ' +
        'who has issued no advisory. The constraint is the finding: the embedded operating system ' +
        'last had a vendor security update in 2019 and modifying the software voids the device ' +
        'certification, so there is no patch and there will not be one. That rules out the entire ' +
        'category of response a floor would normally reach for, and it means the answer has to be a ' +
        'control AROUND the device rather than a change to it. Reporting "patch the pumps" here is ' +
        'proposing something nobody is legally permitted to do.',
      standIn:
        'The pumps are listening on a port that is in no vendor documentation, running a small ' +
        'forwarder. Firmware is current and there is no advisory. The embedded OS last had a vendor ' +
        'security update in 2019, and changing the software voids certification. There is no patch ' +
        'available and there will not be one.',
      commandOptions: [
        { command: 'nmap -sV -p- 10.44.2.31', ...TOUCH_ATTACKER },
        { command: 'curl -s http://10.44.2.31:8080/ | head', ...TOUCH_ATTACKER },
        { command: 'cat /etc/inventory/firmware-versions.csv | grep pump', ...WRONG_TARGET },
        { command: 'grep -i pump /var/log/vendor/advisories.log', correct: true, teaches: CORRECT_STEP },
        { command: 'ssh admin@10.44.2.31 uname -a', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out whether a patch exists for this device, and what applying one would cost.',
      guidance:
        'Ask whether you are allowed to change this device at all. The answer changes what you can ' +
        'recommend.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.power-off', 'act.declare'],
      escalateTo: ['ir-lead'],
      why:
        'The most important negative finding of the night and the one that decides how fast ' +
        'everybody has to move. Two independent people, biomedical engineering and the ward ' +
        'pharmacist, compared delivery rate, dose and schedule on all four pumps against the ' +
        'prescriptions, and device event logs show no parameter change since each infusion started. ' +
        'Nobody is being harmed. That is what makes it possible to take a measured hour over this ' +
        'rather than pulling four pumps off patients in the first five minutes. Establishing it ' +
        'early is worth more than any technical finding, and it belongs at the top of the report ' +
        'rather than buried in it, because it is the first question anybody outside the SOC will ' +
        'ask.',
      standIn:
        'Biomed and the ward pharmacist have both checked delivery rate, dose and schedule on all ' +
        'four against the prescriptions. All four match and device logs show no parameter change ' +
        'since the infusions started. The pumps are delivering correctly and no patient is being ' +
        'harmed. That is the first thing anybody will ask.',
      commandOptions: [
        { command: 'cat /var/log/biomed/pump-parameters-4b.csv', ...DUMP_ALL },
        { command: 'awk -F, \'$3!=$4 {print $1}\' /var/log/biomed/pump-parameters-4b.csv', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "parameter change" /var/log/biomed/device-events.log', ...WRONG_TARGET },
        { command: 'cat /var/log/pharmacy/prescriptions-4b.log | head', ...WRONG_TARGET },
        { command: 'systemctl status biomed-collector', ...STATUS_CHECK },
      ],
      commandNudge:
        'Check the delivery parameters against the prescriptions before anything else.',
      guidance:
        'Ask whether anybody is being harmed right now. The answer sets how much time you have.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1078.001'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'How they got in, and the reason this is not over. The management credential is the ' +
        'manufacturer default, published in the vendor manual, so no exploit was needed and no ' +
        'skill was required. 140 devices across the clinical estate still hold it, which is the ' +
        'real scope of tonight rather than four. The hard part is the remediation cost: 96 of the ' +
        '140 need a vendor engineer on site under the support contract, so this is a scheduling and ' +
        'procurement problem measured in weeks, not a change somebody makes tonight. That is ' +
        'exactly why the compensating control matters more than the credential rotation, and this ' +
        'seat is the only one that can put a number on it.',
      standIn:
        'They used the manufacturer default management credential, which is printed in the vendor ' +
        'manual. No exploit needed. 140 clinical devices across the estate still have it, including ' +
        'all four pumps. Ninety-six of those need a vendor engineer on site to change, so this is ' +
        'weeks of work, not tonight.',
      commandNudge:
        'Find out how many other devices share this credential and what changing it would take.',
      guidance:
        'Ask how they authenticated. Then ask how many other devices would accept the same thing.',
    },
    {
      eventId: 'ev.6',
      critical: true,
      verdict: 'malicious',
      stage: 'lateral-movement',
      techniques: ['T1021', 'T1078.001'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.power-off', 'act.reimage-now', 'act.reset-password', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'What the route was for. Four interactive sessions on the pharmacy terminal between 18:40 ' +
        'and 20:05, sourced from one of the pumps, authenticated with another default credential ' +
        'from the same manual. That terminal holds the controlled drugs register and the ordering ' +
        'system, which makes this a controlled substances matter with its own regulatory ' +
        'notification obligations quite separate from any data breach. Interactive rather than ' +
        'automated is worth stating: somebody was sitting at a keyboard driving this, which changes ' +
        'both the urgency and what the next hour might look like. Preserve carefully, because a ' +
        'controlled drugs investigation has evidentiary standards a routine incident does not.',
      standIn:
        'Four interactive sessions on the pharmacy terminal between 18:40 and 20:05, sourced from ' +
        'one of the pumps, using another default credential from the same vendor manual. That ' +
        'terminal holds the controlled drugs register and the ordering system. Interactive, so ' +
        'somebody was driving it. Preserved and sealed.',
      commandNudge:
        'Check what the eleven relayed devices were used to REACH, not just that they relayed.',
      guidance:
        'Follow the route to its destination. Ask what the thing at the end of it holds.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'Eleven clinical devices dropping off the network on a night when the floor has just found ' +
        'eleven devices relaying through compromised pumps. The number matching is a coincidence ' +
        'and it is a compelling one. It is a scheduled electrical safety test on a different ward ' +
        'with a work order, all eleven came back, and fourteen of fourteen were closed the same way ' +
        'this month. Two checks settle it, which are the ward and the work order. The cost of ' +
        'getting it wrong is specific: reporting devices dropping off ward 2A alongside a live ' +
        'clinical compromise would put a second ward into an incident response, and on a ward that ' +
        'means disrupting patient care over a planned power cycle.',
      standIn:
        'Eleven devices dropped on ward 2A between 19:00 and 19:20 during a scheduled electrical ' +
        'safety test that needed a ward power cycle. Biomed has the work order and all eleven came ' +
        'back. Different ward, and the count matching ours is coincidence. Fourteen of fourteen ' +
        'this month were the same. Closing it.',
      commandOptions: [
        { command: 'grep "ward 2A" /var/log/biomed/device-events.log | tail -20', ...WRONG_TARGET },
        { command: 'cat /var/log/biomed/work-orders.log | grep -i safety', correct: true, teaches: CORRECT_STEP },
        { command: 'awk \'/OFFLINE/ {print $3}\' /var/log/biomed/device-events.log | sort | uniq -c', ...WRONG_TARGET },
        { command: 'ping -c1 10.44.1.14', ...TOUCH_ATTACKER },
        { command: 'cat /etc/inventory/clinical-devices.csv | grep 2A', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check which ward those devices are on and whether biomed has a work order for it.',
      guidance:
        'The count matching yours is not evidence. Check the ward and the maintenance schedule.',
    },
  ],
};
