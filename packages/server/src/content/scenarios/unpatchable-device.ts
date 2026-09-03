/**
 * Scenario 93: The Patch Exists.
 *
 * There is a fix for the flaw being used against this machine, and applying it
 * is prohibited.
 *
 * HOW THIS DIFFERS FROM NO PATCH
 *
 * Scenario 10 is a zero-day: nothing exists yet, no advisory, no signature, no
 * fix, and the floor has to work from behaviour alone. This is the opposite
 * situation and is more common. The vulnerability is two years old, well
 * documented, and patched by the operating system vendor in 2023. The patch is
 * sitting there. Applying it voids the device certification, breaches the
 * support contract, and takes a regulated clinical device outside the
 * configuration it was approved in.
 *
 * WHAT THIS TEACHES
 *
 * That patch it is an answer the floor is not always allowed to give, and that
 * the seat which owns the machine may not be in the room. Ridgeline IT has no
 * administrative access to this device at all; clinical engineering owns it and
 * the manufacturer owns what runs on it. Every useful action tonight is
 * therefore around the device rather than on it.
 *
 * And that clinical impact is a real constraint rather than an excuse. Pulling
 * this workstation off the network stops imaging, which is a decision with
 * patients on the other end of it and is not the SOC to make alone.
 *
 * THE DECOY IS THE ONE YOU CAN FIX
 *
 * A second unsupported host on the board is not a medical device at all. It is
 * a lab machine nobody removed, it can be rebuilt this afternoon, and the risk
 * of treating both the same way is that the hard case swallows the easy one.
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

const ID = 'the-patch-exists';

export const THE_PATCH_EXISTS: Scenario = {
  id: ID,
  title: 'The Patch Exists',
  difficulty: 'advanced',
  durationMinutes: 70,
  situation:
    'It is 14:05 at Ridgeline Medical. An imaging workstation is beaconing, the flaw being used ' +
    'against it was patched in 2023, and we are not permitted to apply the patch.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'forensics',
    'vulnerability-analyst',
    'threat-intel',
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
      summary: 'An imaging workstation is calling out every thirty minutes',
      detail:
        'RAD-WS-04, an ultrasound reporting workstation in radiology, has been connecting outbound ' +
        'to 198.51.100.213 every thirty minutes since 11:40 today. Each connection lasts under two ' +
        'seconds and carries about 400 bytes. The endpoint agent does not cover this host, so the ' +
        'alert came from the network side only.',
      source: 'network monitoring',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 180,
      surface: 'network-flow',
      summary: 'The traffic is small, regular and has not moved anything yet',
      detail:
        'Forty-one connections since 11:40, all to the same address and port, all under two seconds, ' +
        'total volume 16 kilobytes outbound. There is no bulk transfer in either direction. The ' +
        'pattern is a check-in rather than a collection, which means somebody has a foothold and has ' +
        'not decided what to do with it.',
      source: 'perimeter firewall',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 370,
      surface: 'host-artefact',
      summary: 'The machine has had no security update since 2021',
      detail:
        'RAD-WS-04 runs an operating system version that left support in 2021 and carries the ' +
        'manufacturer imaging application. Its last applied security update is dated March 2021. ' +
        'The Ridgeline IT team has no administrative credential for it. Clinical engineering holds ' +
        'the device record and the manufacturer holds the software.',
      source: 'RAD-WS-04',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 560,
      surface: 'raw-log',
      summary: 'The patch was published two years ago and cannot be applied',
      detail:
        'The flaw used to reach this host is a remote code execution issue in a network service, ' +
        'published with a fix in June 2023. The manufacturer position, stated in the support ' +
        'contract and reconfirmed by email in January, is that any operating system change outside ' +
        'their validated release voids the device certification and withdraws support. Their next ' +
        'validated release is scheduled for the first quarter of next year.',
      source: 'clinical engineering',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 750,
      surface: 'network-flow',
      summary: 'What that workstation can reach',
      detail:
        'RAD-WS-04 sits on the imaging network with 58 other devices. That network reaches the ' +
        'patient record system through one permitted path, used by the reporting application to ' +
        'write findings back to the record. The path allows RAD-WS-04 to reach the record system on ' +
        'one port with an application credential held on the workstation.',
      source: 'network monitoring',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 940,
      surface: 'host-artefact',
      summary: 'A second unsupported host, which is nobody device',
      detail:
        'The same sweep finds LAB-PC-11, also running an unsupported operating system with no ' +
        'updates since 2020. It is not a medical device. It was a laboratory results terminal ' +
        'replaced in 2022, was never decommissioned, is used by nobody, and has no manufacturer ' +
        'restriction of any kind. It can be rebuilt or removed today.',
      source: 'LAB-PC-11',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 1130,
      surface: 'alert-queue',
      summary: 'Taking it off the network stops imaging',
      detail:
        'RAD-WS-04 is one of three reporting workstations and is in use this afternoon. Removing it ' +
        'from the network stops reporting on it, which pushes today list onto the other two and ' +
        'delays results. Radiology says that is survivable this afternoon and not survivable ' +
        'tomorrow, when there is a clinic. Restricting it to the imaging network alone takes about ' +
        'four hours and breaks the write-back to the patient record.',
      source: 'radiology',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1320,
      surface: 'alert-queue',
      summary: 'The manufacturer has an emergency route nobody has used',
      detail:
        'The support contract includes a security incident clause allowing an out-of-cycle validated ' +
        'change, requested through the manufacturer emergency line, with a stated response of five ' +
        'working days. Ridgeline has never invoked it. Clinical engineering has the contract and ' +
        'the account number and is available this afternoon.',
      source: 'clinical engineering',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.9',
      atSeconds: 1510,
      surface: 'alert-queue',
      summary: 'The risk was written down in 2023 and reviewed by nobody',
      detail:
        'A risk register entry from June 2023 records unsupported operating systems on regulated ' +
        'imaging devices, accepted by the medical director with a review date of June this year. ' +
        'The review did not happen. Ridgeline has 60 devices in the same category and no record of ' +
        'which of them the manufacturer would allow to be changed.',
      source: 'security programme',
      claimedSeverity: 'critical',
    },
  ],
};

export const THE_PATCH_EXISTS_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'RAD-WS-04 is an ultrasound reporting workstation running an operating system that left support in 2021, last security update March 2021, carrying the manufacturer imaging application. Ridgeline IT holds no administrative credential for it. Clinical engineering owns the device record and the manufacturer owns what runs on it.',
    'Somebody reached it through a remote code execution flaw in a network service, published with a fix in June 2023. Since 11:40 it has connected outbound to 198.51.100.213 every thirty minutes, forty-one times, under two seconds each, sixteen kilobytes total. That is a check-in, not a collection: somebody has a foothold and has not decided what to do with it.',
    'The patch exists and applying it voids the device certification and withdraws manufacturer support, which is stated in the contract and was reconfirmed in January. The next validated release is next year. Patch it is not an answer available to this floor.',
    'The workstation sits on the imaging network with 58 other devices, and that network reaches the patient record system through one permitted path used by the reporting application to write findings back, on one port, with an application credential held on the workstation.',
    'LAB-PC-11 is also unsupported and is not a medical device. It is a results terminal replaced in 2022, never decommissioned, used by nobody, with no manufacturer restriction. It can be removed today and the risk of the board is that the hard case swallows the easy one.',
    'Removing RAD-WS-04 from the network stops reporting on it. Radiology says that is survivable this afternoon and not survivable tomorrow. Restricting it to the imaging network alone takes four hours and breaks the write-back.',
    'The support contract has a security incident clause allowing an out-of-cycle validated change through the manufacturer emergency line, five working days, never invoked. Clinical engineering has the contract and is available this afternoon.',
    'A risk register entry from June 2023 records this exact condition, accepted by the medical director, with a review date of June this year that nobody kept. There are 60 devices in the same category and no record of which the manufacturer would allow to be changed.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'command-and-control',
      critical: true,
      techniques: ['T1071.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['network-analyst', 'ir-lead'],
      why:
        'Thirty minute intervals, two seconds, four hundred bytes. That is a beacon and the regular ' +
        'interval is what makes it one: software that checks for updates does it on a schedule too, ' +
        'so the interval alone is not the finding, but a destination nobody can name plus a fixed ' +
        'interval plus a host in radiology is enough to raise. The line worth reading twice is the ' +
        'one about the endpoint agent not covering this host, because it means everything the floor ' +
        'would normally do next is unavailable: no process tree, no command line, no file events. ' +
        'Say that early rather than discovering it in twenty minutes, because it changes who can ' +
        'usefully work this and the answer is the network seat rather than the host seat.',
      standIn:
        'Thirty minute intervals, two seconds, four hundred bytes. That is a beacon, and the fixed ' +
        'interval plus a destination nobody can name plus a host in radiology is enough for me to ' +
        'raise it. Read the second line twice though: the endpoint agent does not cover this host. ' +
        'So no process tree, no command lines, no file events, and everything we would normally do ' +
        'next is not available. Saying that now rather than in twenty minutes, because it means this ' +
        'is network work, not host work.',
      commandOptions: [
        { command: "awk '$3==\"RAD-WS-04\" {print $2, $5}' /var/log/netflow/today.log | head -20", correct: true, teaches: CORRECT_STEP },
        { command: "grep 'RAD-WS-04' /var/log/netflow/today.log | awk '{print $2}' | awk -F: '{print $1\":\"$2}' | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status suricata', ...STATUS_CHECK },
        { command: 'cat /var/log/netflow/today.log', ...DUMP_ALL },
        { command: 'curl -s http://198.51.100.213/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check whether the interval between those connections is regular, and what tooling covers that host.',
      guidance:
        'Something is calling out. Ask how regularly.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'command-and-control',
      critical: true,
      techniques: ['T1071.001'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.tune'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'Sixteen kilobytes in three hours and no bulk transfer either way. Read that as a clock ' +
        'rather than as reassurance. Nothing has been taken yet, which is genuinely good news and is ' +
        'not the same as nothing being at risk: a check-in with no collection is somebody holding a ' +
        'foothold and deciding, and the interval between now and their decision is the only ' +
        'advantage this floor has today. The low volume is also what will make somebody suggest ' +
        'watching it for a while, and on a normal host that would be a defensible call. It is not ' +
        'defensible here, because the machine cannot be patched, has no endpoint coverage, and ' +
        'reaches the patient record system, so time spent watching buys information the floor cannot ' +
        'act on and hands the initiative to the other end.',
      standIn:
        'Sixteen kilobytes in three hours, no bulk transfer either way. That is a clock, not ' +
        'reassurance. Nothing taken yet is good news and it is not the same as nothing at risk: this ' +
        'is somebody holding a foothold and deciding, and the gap before they decide is the only ' +
        'advantage we have. And the low volume is what will make somebody suggest we watch it a ' +
        'while. On a normal host, fair enough. Not here, because we cannot patch it, we have no ' +
        'endpoint coverage on it, and it reaches the record system. Watching buys us information we ' +
        'cannot act on and gives them the initiative.',
      commandOptions: [
        { command: "awk '$3==\"RAD-WS-04\" {b+=$8} END {print b}' /var/log/netflow/today.log", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"RAD-WS-04\" {print $8}' /var/log/netflow/today.log | sort -n | tail -5", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewalld', ...STATUS_CHECK },
        { command: 'cat /var/log/netflow/today.log', ...DUMP_ALL },
        { command: 'grep -c RAD-WS-04 /var/log/netflow/today.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Total the bytes in each direction and see whether anything has actually left.',
      guidance:
        'It is calling out. Ask whether it is carrying anything.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.preserve', 'act.investigate-hold'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.power-off', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'No security update since March 2021, and Ridgeline IT has no administrative credential for ' +
        'this machine. The second half is the one that changes the shift and it is easy to read past ' +
        'as a procurement detail. It means the floor cannot log in, cannot collect an image, cannot ' +
        'run a tool and cannot look at a process list, so every instinct that begins with go and ' +
        'look at the host is unavailable, and the investigation has to be built entirely from what ' +
        'the network saw. Say who does own it and say it precisely, because the room will otherwise ' +
        'spend the afternoon describing a machine nobody in the conversation can touch: clinical ' +
        'engineering holds the device record, the manufacturer holds the software, and any action on ' +
        'the box itself has to go through one of them.',
      standIn:
        'No security update since March 2021, and we have no administrative credential for it. The ' +
        'second half is the one that changes today and it reads like a procurement detail. We cannot ' +
        'log in, cannot image it, cannot run a tool, cannot see a process list. Everything that ' +
        'starts with go and look at the host is off the table and this gets built from what the ' +
        'network saw. And let us be precise about who owns it, or we will spend the afternoon ' +
        'discussing a machine nobody here can touch. Clinical engineering has the device record, the ' +
        'manufacturer has the software, and anything on the box goes through one of them.',
      commandOptions: [
        { command: "grep -iE 'os_version|last_update|owner' /evidence/assets/RAD-WS-04.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i 'RAD-WS-04' /evidence/assets/device-register.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status wsus', ...STATUS_CHECK },
        { command: 'cat /evidence/assets/device-register.csv', ...DUMP_ALL },
        { command: 'psexec \\\\RAD-WS-04 cmd', ...MUTATE },
      ],
      commandNudge:
        'Find out what that machine runs and, before anything else, who has administrative access to it.',
      guidance:
        'It is compromised. Ask who can actually touch it.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.corroborate', 'act.compensating-control', 'act.scope-estate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.reimage-now', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'The patch was published in June 2023 and applying it voids the device certification and ' +
        'withdraws support, which is in the contract and was reconfirmed in writing in January. This ' +
        'is the row where somebody says just patch it, and the answer is that doing so takes a ' +
        'regulated clinical device outside the configuration it was approved in, which is a decision ' +
        'with a regulator and a manufacturer on the other side of it and is not available to this ' +
        'room. Resist two wrong responses. It is not a stupid restriction: validating an operating ' +
        'system change on a device that produces clinical measurements is real work and the ' +
        'manufacturer doing it slowly is not the same as them doing it for no reason. And it is not ' +
        'an excuse either. What the constraint actually forces is that every control has to be built ' +
        'around the machine instead of on it, and naming that clearly is what turns an argument into ' +
        'a plan.',
      standIn:
        'Patch published June 2023, and applying it voids the certification and withdraws support. ' +
        'That is in the contract and they reconfirmed it in January. This is where somebody says ' +
        'just patch it, and the answer is that we would be taking a regulated clinical device ' +
        'outside its approved configuration, which is a decision with a regulator and a manufacturer ' +
        'on the other end and it is not ours. Two wrong reactions to avoid. It is not a stupid rule, ' +
        'validating an operating system change on something that produces clinical measurements is ' +
        'real work. And it is not an excuse either. It forces every control to be built around the ' +
        'machine rather than on it, and saying that turns the argument into a plan.',
      commandOptions: [
        { command: "grep -iE 'certification|validated|support' /evidence/contracts/imaging-support.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'CVE|published|fixed' /evidence/vuln/advisory-2023.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status wsus', ...STATUS_CHECK },
        { command: 'cat /evidence/contracts/imaging-support.txt', ...DUMP_ALL },
        { command: 'wusa /quiet /norestart \\\\RAD-WS-04', ...MUTATE },
      ],
      commandNudge:
        'Find out whether a fix exists, then find out whether you are permitted to install it.',
      guidance:
        'The machine is unpatched. Ask why.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'lateral-movement',
      critical: true,
      techniques: ['T1210'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.flow-map', 'act.scope-estate', 'act.contain-scoped'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Fifty-eight other devices on the same network, and one permitted path from there into the ' +
        'patient record system with an application credential sitting on the workstation. That path ' +
        'is the whole reason this is a serious incident rather than an untidy one: a compromised ' +
        'imaging workstation on an isolated island is a problem for radiology, and a compromised ' +
        'imaging workstation with a credentialed route to the record system is a problem for ' +
        'everybody. Map it precisely rather than describing it, because the detail is what the ' +
        'containment will be built from: one port, one credential, one application, which means the ' +
        'path is narrow enough to cut without cutting the network. Note the credential is on the ' +
        'host the attacker holds, so it should be treated as theirs already rather than as ' +
        'something that might be taken later.',
      standIn:
        'Fifty-eight other devices on that network and one permitted path into the patient record ' +
        'system with an application credential sitting on the workstation. That path is why this is ' +
        'serious rather than untidy. A compromised imaging box on an island is radiology problem. ' +
        'One with a credentialed route into the record system is everybody problem. Map it exactly, ' +
        'because the containment gets built from the detail: one port, one credential, one ' +
        'application, which is narrow enough to cut without cutting the network. And that credential ' +
        'lives on the host they hold, so treat it as already theirs, not as something they might ' +
        'take.',
      commandOptions: [
        { command: "grep -iE 'RAD-WS|imaging' /evidence/firewall/imaging-ruleset.txt", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3 ~ /^10\\.30\\./ && $5 ~ /^10\\.10\\./ {print $5, $6}' /var/log/netflow/week.log | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewalld', ...STATUS_CHECK },
        { command: 'cat /evidence/firewall/imaging-ruleset.txt', ...DUMP_ALL },
        { command: 'nmap -sn 10.30.0.0/24', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Work out everything that host can reach, and look hardest at anything outside its own network.',
      guidance:
        'One machine is compromised. Ask what it can reach.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['soc-operator', 'mitigation-specialist'],
      correctActions: ['act.contain-scoped', 'act.scope-estate', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist'],
      why:
        'Also unsupported, and not a medical device at all. LAB-PC-11 is a results terminal replaced ' +
        'in 2022, never decommissioned, used by nobody, with no manufacturer restriction of any ' +
        'kind. It is not part of this incident and it is worth two minutes anyway, because it is ' +
        'the opposite case and the contrast is the lesson: one of these machines cannot be touched ' +
        'and one can be removed this afternoon by somebody with a ticket. The risk on a board like ' +
        'this is that the hard case swallows the easy one, and unsupported becomes a category that ' +
        'the room treats as uniformly impossible when a third of it is just tidying nobody ' +
        'scheduled. Close it out of the incident and raise it as its own piece of work today, ' +
        'because next week it will look like part of a difficult clinical problem and stay where it ' +
        'is.',
      standIn:
        'Also unsupported and not a medical device. LAB-PC-11 is a results terminal replaced in 2022, ' +
        'never decommissioned, nobody uses it, no manufacturer restriction. Not part of this ' +
        'incident and worth the two minutes anyway, because it is the opposite case. One of these we ' +
        'cannot touch and one somebody can remove this afternoon with a ticket. The danger is the ' +
        'hard case swallowing the easy one until unsupported means uniformly impossible, when a ' +
        'third of it is tidying nobody scheduled. Closing it out of the incident and raising it ' +
        'separately today, because next week it looks like part of a clinical problem and stays ' +
        'exactly where it is.',
      commandOptions: [
        { command: "grep -i 'LAB-PC-11' /evidence/assets/device-register.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$5==\"unsupported\" {print $1, $3}' /evidence/assets/device-register.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status wsus', ...STATUS_CHECK },
        { command: 'cat /evidence/assets/device-register.csv', ...DUMP_ALL },
        { command: 'grep -rn "unsupported" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Check whether the second unsupported host has the same restriction as the first.',
      guidance:
        'A second machine is unsupported. Ask whether it is the same problem.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['mitigation-specialist', 'network-analyst'],
      correctActions: ['act.sequence-remedy', 'act.check-rollback', 'act.notify-legal'],
      outOfLaneActions: ['act.isolate', 'act.power-off', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['mitigation-specialist'],
      why:
        'Pulling it off the network delays results, and radiology says survivable this afternoon and ' +
        'not tomorrow, which is a clinical judgement made by the people qualified to make it and ' +
        'the room should take it as given rather than re-argue it. What the room owns is the ' +
        'security half: what the exposure costs per hour and what each option actually buys. Put ' +
        'those two things next to each other honestly and the answer becomes obvious rather than ' +
        'contested, which is the point of asking. Isolate today, while it is survivable, and use ' +
        'the afternoon to build the narrower control rather than spending the afternoon deciding. ' +
        'The four hour segmentation option is the one to be careful with, because it breaks the ' +
        'write-back to the patient record and that is not a security consequence, it is findings ' +
        'not reaching a clinician, so it needs radiology agreement before it is proposed and not ' +
        'after it is built.',
      standIn:
        'Taking it off delays results, and radiology say survivable this afternoon, not tomorrow. ' +
        'That is their call and we take it as given. What we own is what the exposure costs per hour ' +
        'and what each option buys. Put those honestly side by side and the answer stops being ' +
        'contested. Isolate today while it is survivable and spend the afternoon building the ' +
        'narrow control rather than deciding. Careful with the four hour segmentation: it breaks the ' +
        'write-back, and that is not a security consequence, that is findings not reaching a ' +
        'clinician. Radiology agree to that before we build it, not after.',
      commandNudge:
        'Get the clinical cost of each option from the people who own it, and put it beside the security cost.',
    },
    {
      eventId: 'ev.8',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'vulnerability-analyst'],
      correctActions: ['act.compensating-control', 'act.sequence-remedy', 'act.contain-scoped'],
      outOfLaneActions: ['act.reimage-now', 'act.contact-attacker', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'There is a route through the contract and nobody has ever used it. A security incident ' +
        'clause allowing an out-of-cycle validated change, five working days, and clinical ' +
        'engineering has the account number and is here this afternoon. Invoke it today, because ' +
        'five working days starts when somebody rings and every hour of not ringing is an hour ' +
        'added to the end. This is the row that teaches where the answers live on a constrained ' +
        'system: not in the security tooling, which has nothing to offer here, but in a contract ' +
        'somebody negotiated and filed. Order the rest around it. Isolation today buys the days the ' +
        'manufacturer needs. The narrow segmentation is what the machine lives behind afterwards. ' +
        'Deliberately left undone: the foothold is still there until the validated change lands, ' +
        'the application credential on that host has to be treated as compromised, and the other ' +
        '59 devices on that network have had no attention at all today.',
      standIn:
        'There is a route through the contract and nobody has ever used it. Security incident clause, ' +
        'out-of-cycle validated change, five working days, and clinical engineering have the account ' +
        'number and are here now. Invoke it today, because five days starts when somebody rings and ' +
        'every hour we do not is an hour on the end. That is where the answers live on a system like ' +
        'this. Not in our tooling, which has nothing for us here, but in a contract somebody ' +
        'negotiated and filed. Isolation today buys the days they need, segmentation is what it ' +
        'lives behind afterwards. Left undone: the foothold stays until the change lands, that ' +
        'application credential is theirs and we treat it that way, and nobody has looked at the ' +
        'other fifty-nine devices.',
      commandOptions: [
        { command: "grep -iE 'emergency|incident|out-of-cycle' /evidence/contracts/imaging-support.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'account|contact|line' /evidence/contracts/imaging-support.txt | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status wsus', ...STATUS_CHECK },
        { command: 'cat /evidence/contracts/imaging-support.txt', ...DUMP_ALL },
        { command: 'curl -s https://vendor.example/support/api', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Read the support contract for anything that applies during a security incident.',
      guidance:
        'The manufacturer forbids the change. Ask what the contract allows.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.scope-estate', 'act.propose-rule', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'The condition was written down in June 2023, accepted by the medical director, and given a ' +
        'review date this June that nobody kept. Report that carefully, because it is the sentence ' +
        'most likely to be misused. It is not that somebody accepted a risk and was wrong: ' +
        'accepting this was defensible in 2023 and may still be, given what the alternative costs a ' +
        'hospital. What failed is the review, which is the part of a risk acceptance that makes it a ' +
        'decision rather than a filing, and an acceptance with an unkept review date is indistinguishable ' +
        'from having never thought about it. The number that should go in front of somebody is 60 ' +
        'devices in the same category with no record of which the manufacturer would allow to be ' +
        'changed, because that is answerable by asking and nobody has asked. And the prediction is ' +
        'easy: the next one of these will also be found by network telemetry, because these devices ' +
        'carry no endpoint agent and that is the only sense the floor has of them.',
      standIn:
        'Written down June 2023, accepted by the medical director, review date this June, and nobody ' +
        'kept it. Report that carefully, because it is the sentence people will misuse. It is not ' +
        'that somebody accepted a risk and was wrong. Accepting it in 2023 was defensible and may ' +
        'still be, given what the alternative costs a hospital. What failed is the review, which is ' +
        'the part that makes an acceptance a decision rather than a filing, and one with an unkept ' +
        'review date looks exactly like never having thought about it. The number to put in front of ' +
        'somebody is sixty devices in the same category and no record of which the manufacturer ' +
        'would let us change, and that is answerable by asking. And the prediction is easy: we find ' +
        'the next one on network telemetry too, because these carry no agent and it is the only ' +
        'sense we have of them.',
      commandOptions: [
        { command: "awk -F, '$4==\"accepted\" {print $1, $6}' /evidence/risk/register.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$5==\"unsupported\" && $6==\"regulated\" {n++} END {print n}' /evidence/assets/device-register.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status grafana', ...STATUS_CHECK },
        { command: 'cat /evidence/risk/register.csv', ...DUMP_ALL },
        { command: 'grep -c accepted /evidence/risk/register.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find whether this condition was already known, and what was supposed to happen about it.',
      guidance:
        'This machine was always like this. Ask who knew.',
    },
  ],
};
