/**
 * Scenario 30: The Contractor's Laptop.
 *
 * Their device, your network, their patching.
 *
 * WHAT THIS TEACHES
 *
 * That the estate is not the same thing as the network. Every control this
 * organisation runs applies to machines it owns: the endpoint agent, the patch
 * cycle, the disk encryption, the browsing policy. A contractor laptop has none
 * of them and sits on the same wire, which means the weakest machine on the
 * network is one nobody in the building has ever seen the inside of.
 *
 * It is a beginner scenario because every step is visible and nothing is
 * disguised. The skill being built is not detection, it is the habit of asking
 * who owns a machine before deciding what the alerts about it mean, and of
 * noticing that "we cannot see inside it" is itself the finding rather than an
 * obstacle to reporting one.
 *
 * THE THING THAT MAKES IT AWKWARD
 *
 * There is no clean containment. The contractor is halfway through a warehouse
 * management upgrade that the operation depends on, they are billing by the day,
 * and pulling their access stops work on a site that does not pause. `ev.6`
 * exists so a beginner floor meets that trade-off early, in its simplest form.
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

const ID = 'contractors-laptop';

export const CONTRACTORS_LAPTOP: Scenario = {
  id: ID,
  title: "The Contractor's Laptop",
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 10:15 at Ardal Freight. A machine on the office network is behaving oddly and the ' +
    'endpoint console has no record of it at all. Somewhere in the building is a laptop nobody ' +
    'here has ever configured.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'vulnerability-analyst',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'A host on the office network with no endpoint agent and no inventory record',
      detail:
        'Network access control admitted a device at 08:41 that authenticated with a valid ' +
        'contractor account. It has no endpoint agent, no asset tag, and no entry in the device ' +
        'inventory. It has been assigned an address on the office network, which is the same ' +
        'segment as the finance and scheduling workstations. Rule history: fired 40 times in thirty ' +
        'days, 37 closed as contractor or visitor equipment.',
      source: 'ADF-UNKNOWN-4471',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 130,
      surface: 'network-flow',
      summary: 'The device is reaching a residential address on a high port every ninety seconds',
      detail:
        'Since 08:44 the device has connected to 203.0.113.203 on port 8443 every ninety seconds, ' +
        'exchanging 2 to 5 KB each time. The address has no history in the estate. Between those ' +
        'connections it browses ordinary business sites and reaches the warehouse management ' +
        'system, which is what the contractor is here to work on.',
      source: 'ADF-UNKNOWN-4471',
      target: '203.0.113.203:8443',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 290,
      surface: 'raw-log',
      summary: 'The account belongs to an upgrade contractor engaged for six weeks',
      detail:
        'The account maps to a contractor from the warehouse management vendor, engaged for a six ' +
        'week upgrade that began eleven days ago. Their onboarding record grants network access and ' +
        'application administrator rights on the warehouse platform. There is no requirement in the ' +
        'engagement for their device to run our endpoint agent or meet our patch standard.',
      source: 'ADF-UNKNOWN-4471',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 440,
      surface: 'process-tree',
      summary: 'A remote support tool running from a user profile directory',
      detail:
        'Passive fingerprinting and the warehouse platform own session logs show the device running ' +
        'a commercial remote support product from a user profile directory rather than an install ' +
        'location. The product is legitimate and widely used. It was started at 08:44, which is ' +
        'three minutes after the device joined the network and matches the start of the outbound ' +
        'pattern.',
      source: 'ADF-UNKNOWN-4471',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 590,
      surface: 'host-artefact',
      summary: 'The device is running an operating system build eighteen months behind',
      detail:
        'Fingerprinting puts the operating system at a build released eighteen months ago, missing ' +
        'four cumulative updates and two that address remotely reachable flaws. The browser is two ' +
        'major versions behind. None of this is a policy breach, because the engagement never set ' +
        'a patch standard for contractor equipment.',
      source: 'ADF-UNKNOWN-4471',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 740,
      surface: 'alert-queue',
      summary: 'The upgrade this contractor is running has a hard cutover date',
      detail:
        'The warehouse management upgrade has a cutover booked for the 14th, agreed with three ' +
        'major customers whose contracts carry service credits. The contractor is the only person ' +
        'engaged on it. Removing their access stops the work. The site runs 24 hours and does not ' +
        'have a maintenance window before the cutover.',
      source: 'adf operations',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Eleven handheld scanners failed to check in this morning',
      detail:
        'Eleven picking scanners have not reported since 06:00. The wireless controller at the ' +
        'Felixstowe site was rebooted at 05:55 as part of scheduled firmware maintenance with a ' +
        'change record, and scanners re-associate on their next scan cycle. Nine have already come ' +
        'back. Rule history: fired 55 times in thirty days, 54 closed as wireless maintenance.',
      source: 'adf-wifi-01',
      claimedSeverity: 'low',
    },
  ],
};

export const CONTRACTORS_LAPTOP_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'A contractor from the warehouse management vendor has been on site for eleven days, working a six week upgrade with a cutover on the 14th.',
    'They connect their own laptop to the office network with a valid account, which the engagement permits and which nothing in our policy covers.',
    'That laptop runs no endpoint agent, is eighteen months behind on operating system updates, and is two major browser versions old.',
    'Three minutes after joining, it starts a commercial remote support tool from a user profile directory and begins calling a residential address every ninety seconds.',
    'The contractor is not the attacker. Their laptop is compromised, and the support tool is how somebody else reaches it and therefore reaches our network.',
    'It sits on the same segment as finance and scheduling, and holds application administrator rights on the warehouse platform.',
    'Every control this organisation runs applies to machines it owns. This is not one, and nobody here has ever seen inside it.',
    'Removing their access stops an upgrade with a contractual cutover on a site that runs 24 hours and does not pause.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1199'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.declare'],
      escalateTo: ['network-analyst', 'log-analyst'],
      why:
        'Thirty-seven of forty this month were contractor kit and this is contractor kit, so the ' +
        'firing history points straight at closing it. What makes it worth taking is not that the ' +
        'device is unknown, it is where it was put: the office segment, alongside finance and ' +
        'scheduling. An unmanaged machine on a guest segment is a policy question; the same machine ' +
        'next to the finance workstations is a security one, and the difference is a single field ' +
        'on this row. The habit to build here is asking who owns a machine before deciding what an ' +
        'alert about it means, because ownership decides which of your controls apply to it, and ' +
        'here the answer is none of them.',
      standIn:
        'Device joined at 08:41 on a valid contractor account, no endpoint agent, no asset tag, no ' +
        'inventory record, and it is on the office segment with finance and scheduling. Thirty-seven ' +
        'of forty this month were contractor kit. Raising it because of where it landed, not ' +
        'because it is unknown.',
      commandOptions: [
        { command: 'grep ADF-UNKNOWN-4471 /var/log/nac/events.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$4==\"ADMITTED\" {print $2, $6}' /var/log/nac/events.log | tail -20", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status nac-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/nac/events.log', ...DUMP_ALL },
        { command: 'grep -c ADMITTED /var/log/nac/events.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out which network segment that device was placed on and what else is on it.',
      guidance:
        'Ask who owns this machine, then ask which of our controls apply to a machine we do not ' +
        'own. The answer changes what the alert means.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'command-and-control',
      critical: true,
      techniques: ['T1071.001', 'T1219'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'malware-analyst'],
      why:
        'The finding, and it is the one thing on the board that cannot be explained by the ' +
        'contractor doing their job. A connection every ninety seconds, same size each time, to a ' +
        'residential address with no history: that regularity is the tell. People browse in bursts ' +
        'and stop; machines keep time. The other half is that the normal traffic is also there, ' +
        'ordinary business browsing and legitimate work on the warehouse platform, which is exactly ' +
        'why nobody noticed. The beaconing is not instead of the work, it is underneath it. This is ' +
        'also where the report has to be careful: the laptop is compromised, and that is not the ' +
        'same sentence as the contractor doing something wrong.',
      standIn:
        'That device has hit a residential address on 8443 every ninety seconds since 08:44, two to ' +
        'five kilobytes a time, no history for that address anywhere. In between it browses normally ' +
        'and works on the warehouse platform. The regular interval is the tell. That laptop is ' +
        'compromised, which is not the same as the contractor being the problem.',
      commandOptions: [
        { command: "awk '$2==\"ADF-UNKNOWN-4471\" {print $1, $4}' /var/log/flows.log | tail -40", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 203.0.113.203 /var/log/flows.log', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 8443', ...WRONG_TARGET },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'nmap -p 8443 203.0.113.203', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Look at the gaps between those connections rather than the destinations.',
      guidance:
        'People browse in bursts. Ask whether the timing of this looks like a person or a clock.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'Everything on this row is legitimate, which is the point of including it. A real ' +
        'contractor, a real engagement, a real account, real administrator rights on the platform ' +
        'they were hired to upgrade. Establishing that early stops the floor building a story about ' +
        'a rogue insider out of a device they cannot see inside. The finding hiding in the ' +
        'legitimacy is the last sentence: the engagement sets no requirement for their device to ' +
        'run our agent or meet our patch standard. Nobody decided contractor laptops were exempt, ' +
        'which is worse than deciding it, because it means nobody weighed it.',
      standIn:
        'The account is a contractor from the warehouse vendor, eleven days into a six week upgrade, ' +
        'with application admin rights on the platform they are here to work on. All of it ' +
        'legitimate and properly onboarded. The gap is that the engagement never required their ' +
        'device to run our agent or meet our patch standard.',
      commandOptions: [
        { command: 'grep -A6 "ADF-UNKNOWN-4471\\|contractor" /var/log/hr/engagements.log', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "endpoint\\|patch" /var/log/contracts/engagement-wms.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ad-sync', ...STATUS_CHECK },
        { command: 'cat /var/log/hr/engagements.log', ...DUMP_ALL },
        { command: 'grep -c contractor /var/log/hr/engagements.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out who that account belongs to and what the engagement actually requires of their ' +
        'equipment.',
      guidance:
        'Before you treat somebody as a suspect, find out whether they are supposed to be here.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1219'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.decode'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'What is making the connections, and the timing settles it. A legitimate commercial support ' +
        'tool, which is exactly the sort of thing a contractor would plausibly have, running from a ' +
        'user profile directory rather than an install location, started three minutes after the ' +
        'device joined the network and matching the beacon exactly. Support tools are the most ' +
        'common way an already-compromised machine is reached, because they are designed to give ' +
        'remote control and no security product objects to them. The limit worth stating: with no ' +
        'agent on the device, this is fingerprinting and platform session logs rather than host ' +
        'telemetry, so it is strong inference and not a host confirmation.',
      standIn:
        'The device is running a commercial remote support product out of a user profile directory ' +
        'rather than an install path, started 08:44, three minutes after it joined and exactly when ' +
        'the beaconing starts. That is how somebody reaches an already compromised laptop. I have ' +
        'no agent on it, so this is fingerprinting and platform session logs, not host telemetry.',
      commandOptions: [
        { command: "awk '/ADF-UNKNOWN-4471/ {print $1, $7}' /var/log/wms/sessions.log | head -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "remote\\|support" /var/log/nac/fingerprint.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status wms', ...STATUS_CHECK },
        { command: 'cat /var/log/wms/sessions.log', ...DUMP_ALL },
        { command: 'curl -sI https://203.0.113.203:8443', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find what started at 08:44 on that device, and compare it against when the beaconing began.',
      guidance:
        'You cannot install anything on this machine. Ask what you can learn about it from the ' +
        'systems it talks to.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1190'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'network-analyst'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.preserve', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Probably how the laptop was compromised in the first place, and definitely the finding ' +
        'that outlives today. Eighteen months behind, four cumulative updates missing, two of them ' +
        'for remotely reachable flaws, and a browser two major versions old. That is a machine that ' +
        'would be compromised eventually wherever it was plugged in. And no policy was broken, ' +
        'which is the part to put in the report: the engagement never set a standard, so this is a ' +
        'contracting gap rather than a compliance failure. The question this seat owns and nobody ' +
        'else will ask is how many other contractor devices are currently on the network under the ' +
        'same absence of a requirement.',
      standIn:
        'That laptop is on a build eighteen months old, missing four cumulative updates, two of them ' +
        'for remotely reachable flaws, browser two majors behind. It was going to be compromised ' +
        'wherever it plugged in. No policy was breached because the engagement never set one. I want ' +
        'to know how many other contractor devices are on the network under the same absence.',
      commandOptions: [
        { command: "awk '$3==\"UNMANAGED\" {print $2, $5}' /var/log/nac/fingerprint.log | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c UNMANAGED /var/log/nac/fingerprint.log', ...COUNT_ONLY },
        { command: 'systemctl status patch-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/nac/fingerprint.log', ...DUMP_ALL },
        { command: 'find / -name "*.msu" -type f', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find out how many other unmanaged devices are currently on the network, not just this one.',
      guidance:
        'Ask whether this machine is unusual or typical. One is an incident; a category is a ' +
        'programme.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1199'],
      firstResponder: 'ir-lead',
      alsoAppropriate: ['vulnerability-analyst'],
      correctActions: ['act.declare', 'act.isolate'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.reset-password'],
      escalateTo: [],
      why:
        'The trade-off, in its simplest form, which is why it belongs in a beginner scenario. ' +
        'Cutting the access contains a compromised machine on a segment with finance on it. It also ' +
        'stops an upgrade with a cutover on the 14th, agreed with three customers whose contracts ' +
        'carry service credits, on a site that runs 24 hours and has no maintenance window. Both ' +
        'costs are real and the SOC only owns one of them. The answer is not to pick bravely, it is ' +
        'to bring operations into the decision with the technical position stated plainly, and to ' +
        'look for the middle option a beginner floor tends not to see: the contractor can keep ' +
        'working from a managed device or a restricted segment, which contains the machine without ' +
        'stopping the work.',
      standIn:
        'Cutting their access contains a compromised laptop sitting next to finance. It also stops ' +
        'the upgrade, and the cutover on the 14th has service credits attached with three customers. ' +
        'That second cost is not mine to accept alone. I want operations on this now, and I want the ' +
        'middle option looked at: managed device or restricted segment, so they keep working and the ' +
        'laptop stops being on our network.',
      commandNudge:
        'Find out what stops if that access is removed, before recommending that it is removed.',
      guidance:
        'Containment has a cost somebody else pays. Ask what it is, and whether there is a third ' +
        'option.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'Eleven devices dropping off on the morning a compromised device is found on the network. ' +
        'It is a wireless controller rebooted at 05:55 under scheduled firmware maintenance with a ' +
        'change record, scanners re-associate on their next scan cycle, nine are already back, and ' +
        '54 of 55 this month were the same. The check is the change record and whether they are ' +
        'returning. The specific trap for a beginner is that both stories involve devices and the ' +
        'network, so they feel adjacent, and the tell that they are not is direction: our devices ' +
        'went quiet and came back, while the one that matters arrived and stayed.',
      standIn:
        'Eleven scanners have not checked in since 06:00. Wireless controller at Felixstowe was ' +
        'rebooted at 05:55 for scheduled firmware, change record exists, and nine are already back. ' +
        'Fifty-four of fifty-five this month were the same. Ours went quiet and are returning. ' +
        'Closing it.',
      commandOptions: [
        { command: 'grep -i "wireless\\|firmware" /var/log/change-management.log | tail', correct: true, teaches: CORRECT_STEP },
        { command: "awk '/scanner/ {print $3, $5}' /var/log/wifi/associations.log | tail -20", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status hostapd', ...STATUS_CHECK },
        { command: 'cat /var/log/wifi/associations.log', ...DUMP_ALL },
        { command: 'grep -c OFFLINE /var/log/wifi/associations.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether anybody had a change open on the wireless, and whether those scanners are ' +
        'coming back.',
      guidance:
        'Devices leaving and a device arriving are opposite stories. Check which direction this one ' +
        'goes.',
    },
  ],
};
