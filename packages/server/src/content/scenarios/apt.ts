/**
 * Scenario 07: Long Weather.
 *
 * An intrusion that has been in the estate for eleven weeks, discovered by
 * accident.
 *
 * WHAT THIS TEACHES THAT THE FAST SCENARIOS CANNOT
 *
 * Every other scenario on this platform happens inside the hour it is worked.
 * The attacker arrives, does something, and leaves a trail with a beginning. A
 * floor learns to reconstruct a morning.
 *
 * This one has no beginning on the board. The earliest thing anybody can see is
 * eleven weeks old, the logs before it have rolled, and the answer to "how did
 * they get in" is genuinely not available tonight. That is the lesson: patient
 * intrusions are found in the middle, and the discipline is separating what you
 * can evidence from what you can infer from what has simply been lost.
 *
 * The scored trap is the opposite of the usual one. Here the danger is not
 * missing things, it is a floor that reconstructs a confident eleven-week
 * narrative out of six surviving artefacts and presents it as fact. Two of the
 * events below are deliberately unresolvable from the available data, and the
 * correct answer on both is to say so.
 *
 * WHY THE ADVERSARY IS SLOW ON PURPOSE
 *
 * Everything here is spaced to sit under a threshold. Beaconing every 47 hours
 * with jitter, one credential at a time, one host a fortnight. Nothing this
 * attacker does would trip a rule designed around a burst, which is what most
 * rules are designed around.
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

const ID = 'long-weather';

export const LONG_WEATHER: Scenario = {
  id: ID,
  title: 'Long Weather',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 13:00. A firewall replacement last night rebuilt the egress rules from scratch, and ' +
    'this morning something that had been quietly allowed for eleven weeks started getting ' +
    'blocked. Nobody was looking for this. Work out how far it goes.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'threat-intel',
    'forensics',
    'fusion-analyst',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'New egress ruleset blocked an outbound connection from rmg-print-02',
      detail:
        'The rebuilt firewall dropped a connection from the print server to 198.51.100.203:443 at ' +
        '11:47. The old ruleset contained a permit entry for that destination added on 14 June by ' +
        'an account that no longer exists. There is no change ticket for it. Rule history: this ' +
        'ruleset is one day old and has fired 190 times, 188 closed as expected breakage.',
      source: 'rmg-print-02',
      target: '198.51.100.203:443',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'network-flow',
      summary: 'That destination has been contacted every 47 hours since 14 June',
      detail:
        'Flow records covering ninety days show 41 connections to 198.51.100.203, spaced between ' +
        '46 and 48 hours apart with the interval jittered by up to eighty minutes. Each lasts ' +
        'between four and nine seconds and moves 2 to 6 KB. Retention is ninety days, so the ' +
        'record begins on 3 June and the first observed connection is 14 June.',
      source: 'rmg-print-02',
      target: '198.51.100.203:443',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'process-tree',
      summary: 'A signed system utility running from an unexpected path on a schedule',
      detail:
        'A scheduled task on rmg-print-02 runs a copy of a Microsoft-signed remote management ' +
        'binary from C:\\ProgramData\\PrintSpoolSvc\\ rather than its install location. The ' +
        'signature is valid and the file hash matches the vendor release. The task was registered ' +
        'on 14 June under the SYSTEM account and its name matches the naming pattern of the print ' +
        'management software.',
      source: 'rmg-print-02',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'raw-log',
      summary: 'Service account rmg-svc-print authenticated to nine hosts it has no reason to touch',
      detail:
        'The print service account authenticated to nine servers between 22 June and 19 August, ' +
        'roughly one a fortnight, always between 02:00 and 04:00, always a single session under ' +
        'four minutes. The nine include two domain controllers and the finance file server. The ' +
        'account is a member of a group granted broad rights during a 2019 migration.',
      source: 'rmg-svc-print',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 640,
      surface: 'host-artefact',
      summary: 'Credential dumping output on a domain controller, dated 6 July, already deleted',
      detail:
        'File carving on rmg-dc-01 recovered a fragment of a credential dump output file in ' +
        'unallocated space, with a filesystem timestamp of 6 July. Roughly 40 percent of the file ' +
        'is recoverable and it contains hashes for nine accounts. The tool that produced it is not ' +
        'present on the host. Windows event logs on this server roll every fourteen days.',
      source: 'rmg-dc-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 800,
      surface: 'network-flow',
      summary: 'A single 890 MB transfer to the same destination on 2 August',
      detail:
        'One connection on 2 August at 03:14 moved 890 MB outbound over four hours, against a ' +
        'beacon average of 4 KB. It came from the finance file server rather than the print ' +
        'server. Flow records prove the volume and the destination and carry nothing about ' +
        'content. No file access logging was enabled on that server until 20 August.',
      source: 'rmg-fin-01',
      target: '198.51.100.203:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 900,
      surface: 'alert-queue',
      summary: 'Antivirus quarantined a password recovery tool on a helpdesk workstation',
      detail:
        'Endpoint protection quarantined a well-known password recovery utility on RMG-WS-0140 at ' +
        '10:20 this morning. The workstation belongs to a helpdesk engineer whose team uses that ' +
        'tool for locked-out kiosk machines, and it is on the documented exception list that the ' +
        'new endpoint agent has not yet imported. Rule history: fired 22 times in thirty days, 21 ' +
        'closed as approved tooling.',
      source: 'RMG-WS-0140',
      claimedSeverity: 'medium',
    },
  ],
};

export const LONG_WEATHER_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody has been in the estate since at least 14 June. How they first got in is not on the board and the logs that would answer it rolled weeks ago.',
    'They kept access through a scheduled task running a legitimate signed remote management tool from a directory named to look like print software.',
    'It called home every 47 hours with jitter, moving kilobytes, which is under every threshold the estate had.',
    'They took the print service account, which a 2019 migration had left with rights across the estate, and used it to reach nine servers at a fortnightly pace.',
    'On 6 July they dumped credentials on a domain controller and deleted the output. Forty percent of it survived in unallocated space.',
    'On 2 August, 890 MB left the finance file server for the same destination. What was in it cannot be established, because file access logging was not turned on until 20 August.',
    'None of this was found by a detection. It was found because a firewall replacement removed a permit rule nobody could explain.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562.004'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.declare'],
      escalateTo: ['network-analyst', 'log-analyst'],
      why:
        'A one-day-old ruleset that has already broken 190 things, 188 of them legitimately. The ' +
        'overwhelming pressure is to close this as more migration breakage. Two details make it ' +
        'different and both are visible without leaving the row: the permit rule was added by an ' +
        'account that no longer exists, and there is no change ticket. A firewall permit with no ' +
        'author and no paperwork is not a configuration mistake, it is a question. This is also ' +
        'worth noticing as a matter of luck: nothing detected this intrusion, a hardware refresh ' +
        'did, and that belongs in the debrief.',
      standIn:
        'New ruleset blocked the print server reaching an external address. The old permit for it ' +
        'was added on 14 June by an account that no longer exists and has no change ticket. Raising ' +
        'it rather than closing it as migration breakage.',
      commandOptions: [
        { command: 'grep 198.51.100.203 /var/log/firewall/blocked.log', ...WRONG_TARGET },
        { command: 'grep -B2 -A2 "198.51.100.203" /etc/firewall/rules.old', correct: true, teaches: CORRECT_STEP },
        { command: 'iptables -L -n | head -40', ...WRONG_TARGET },
        { command: 'systemctl status firewalld', ...STATUS_CHECK },
        { command: 'cat /var/log/firewall/blocked.log | wc -l', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the old rule that used to permit this and check who added it and when.',
      guidance:
        'Most of these blocks are real breakage. Ask whether anybody can explain why the old rule ' +
        'existed.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1071.001', 'T1029'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'fusion-analyst'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'Forty-one connections at 47 hours with jitter is the signature, and every part of it is ' +
        'chosen. Not 24 hours, because daily is the interval people look for. Jittered, so it does ' +
        'not appear as a clean periodic series. Kilobytes, so no volume threshold fires. This is an ' +
        'adversary who knows what the defences count. The other half of this event is a limit that ' +
        'must be stated: retention is ninety days and the first observed connection is 14 June, ' +
        'eleven days after the record starts. That does NOT establish when the intrusion began, and ' +
        'a report saying it began on 14 June has turned the edge of the data into a fact.',
      standIn:
        'Forty-one connections to that address since 14 June, every 46 to 48 hours with jitter, ' +
        'four to nine seconds and a few kilobytes each. That is beaconing built to stay under ' +
        'thresholds. Our flow retention is ninety days, so 14 June is where my data starts, not ' +
        'where this started.',
      commandOptions: [
        { command: 'awk \'/198.51.100.203/ {print $1, $2}\' /var/log/flows.log', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c 198.51.100.203 /var/log/flows.log', ...COUNT_ONLY },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'tcpdump -r /var/cap/print02.pcap -c 20', ...WRONG_TARGET },
        { command: 'dig -x 198.51.100.203', ...WRONG_TARGET },
      ],
      commandNudge:
        'Work out the interval between connections, and check how far back your records go.',
      guidance:
        'Ask what the gap between connections is, and whether your oldest record is the beginning ' +
        'or just the edge of what you kept.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1053.005', 'T1218', 'T1036.005'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['log-analyst', 'forensics'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'There is no malware here and there never will be. The binary is a genuine Microsoft-signed ' +
        'remote management tool, the hash matches the vendor release, and any signature check ' +
        'passes. Three things are wrong and none of them are the file: it runs from ProgramData ' +
        'instead of its install path, it was registered as SYSTEM on the same day the firewall ' +
        'rule appeared, and the directory is named to look like print software. This is the ' +
        'scenario where "is it malicious" is the wrong question and "why is this here" is the ' +
        'right one, and it is why an analyst who only knows how to submit hashes is stuck.',
      standIn:
        'Scheduled task runs a legitimately signed Microsoft remote management binary out of ' +
        'ProgramData under a directory named to look like print software. Hash matches the vendor ' +
        'release, signature is valid. Registered as SYSTEM on 14 June, same day as the firewall ' +
        'rule. The file is not the problem. Where it is and who put it there is.',
      commandOptions: [
        { command: 'schtasks /query /fo LIST /v | grep -A5 PrintSpool', ...WRONG_TARGET },
        { command: 'sigcheck C:\\\\ProgramData\\\\PrintSpoolSvc\\\\*.exe', correct: true, teaches: CORRECT_STEP },
        { command: 'strings C:\\\\ProgramData\\\\PrintSpoolSvc\\\\svc.exe | head', ...WRONG_TARGET },
        { command: 'dir C:\\\\ProgramData\\\\PrintSpoolSvc', ...WRONG_TARGET },
        { command: 'tasklist /svc', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check where that binary normally lives, and compare it to where this copy is running from.',
      guidance:
        'A valid signature tells you the vendor made it. Ask why THIS copy is in THAT directory.',
    },
    {
      eventId: 'ev.4',
      critical: true,
      verdict: 'malicious',
      stage: 'lateral-movement',
      techniques: ['T1078.002', 'T1021.002'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'One host a fortnight for two months. Any rule watching for a service account touching many ' +
        'hosts quickly would see nothing here, because the pace is deliberately below the window ' +
        'every such rule uses. The finding that changes the incident is the destination list: two ' +
        'domain controllers and the finance file server, reached by an account that exists to talk ' +
        'to printers. And the reason it could is a 2019 migration that put it in a group with broad ' +
        'rights, which nobody has looked at in six years. That is the actual vulnerability, and it ' +
        'is older than the intrusion.',
      standIn:
        'The print service account authenticated to nine servers between 22 June and 19 August, ' +
        'about one a fortnight, always between 02:00 and 04:00, always short. Two of them are ' +
        'domain controllers and one is the finance file server. It has those rights because of a ' +
        '2019 migration.',
      commandOptions: [
        { command: 'grep rmg-svc-print /var/log/auth.log', ...WRONG_TARGET },
        { command: 'awk \'$5=="rmg-svc-print" {print $1, $9}\' /var/log/auth-archive.log | sort -u', correct: true, teaches: CORRECT_STEP },
        { command: 'net user rmg-svc-print /domain', ...WRONG_TARGET },
        { command: 'last | grep print', ...WRONG_TARGET },
        { command: 'cat /etc/group | grep print', ...WRONG_TARGET },
      ],
      commandNudge:
        'List every host that account has authenticated to, and check what it is supposed to reach.',
      guidance:
        'Ask what this account is FOR, then look at the list of what it actually touched.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1003.001', 'T1070.004'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'Forty percent of a deleted file, carved out of unallocated space eight weeks after the ' +
        'fact, is genuinely good evidence and genuinely partial, and the report has to hold both. ' +
        'What it establishes: credentials were dumped on a domain controller on or around 6 July, ' +
        'and nine accounts appear in what survived. What it does not establish: which nine, whether ' +
        'there were more in the missing sixty percent, or how the tool got there, because the tool ' +
        'is gone and the event logs rolled a month and a half ago. The correct posture on the ' +
        'accounts is that everything on that domain controller should be treated as compromised, ' +
        'not because it is proven but because the absence of proof here is a retention artefact ' +
        'rather than evidence of absence.',
      standIn:
        'Carved a partial credential dump output from unallocated space on the domain controller, ' +
        'timestamped 6 July, about 40 percent recoverable, nine account hashes visible. The tool ' +
        'is not on the host and the event logs rolled six weeks ago. I cannot tell you what was in ' +
        'the other sixty percent. Hashed and sealed.',
      commandNudge:
        'Check how long the event logs on that host are kept before you decide what is missing.',
      guidance:
        'Say what the evidence proves and what it cannot. A partial file is not a partial fact.',
    },
    {
      eventId: 'ev.6',
      critical: true,
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1041', 'T1030'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The single most consequential event of the eleven weeks and the one the floor can say the ' +
        'least about. 890 MB left the finance file server on 2 August for the same address the ' +
        'print server had been beaconing to, which ties the exfiltration to the intrusion beyond ' +
        'argument. What was in it is unknowable: flow records carry volume and destination and ' +
        'nothing else, and file access logging on that server was not enabled until 20 August. The ' +
        'temptation to write "890 MB of financial records were stolen" is enormous and it is not ' +
        'supported. The honest sentence is that 890 MB left the finance file server, its contents ' +
        'cannot be determined from available logging, and the gap is a logging decision rather ' +
        'than an investigative failure. Which is also the most useful finding the business will ' +
        'get from tonight.',
      standIn:
        '890 MB out of the finance file server on 2 August over four hours, to the same address the ' +
        'print server beacons to. Against a 4 KB beacon average. I can prove the volume and the ' +
        'destination. I cannot tell you what was in it: file access logging on that host was not ' +
        'turned on until 20 August.',
      commandOptions: [
        { command: 'awk \'$4 ~ /198.51.100.203/ && $6 > 1000000\' /var/log/flows.log', correct: true, teaches: CORRECT_STEP },
        { command: 'grep "2 Aug" /var/log/flows-archive.log | grep rmg-fin-01', ...WRONG_TARGET },
        { command: 'ls -la /var/log/audit/', ...WRONG_TARGET },
        { command: 'du -sh /mnt/finance', ...WRONG_TARGET },
        { command: 'auditctl -l', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find the largest transfer to that destination, and then check what logging was on that ' +
        'host at the time.',
      guidance:
        'Ask what your evidence can actually establish about contents, and say so plainly if the ' +
        'answer is nothing.',
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
        'A password recovery tool quarantined on a helpdesk workstation, on a day when the floor ' +
        'has just found real credential dumping on a domain controller. The pull is almost ' +
        'irresistible, and it is wrong: the tool is on the documented exception list, it belongs to ' +
        'the team that uses it for locked kiosks, and the only reason it fired is that the new ' +
        'endpoint agent has not imported the exceptions yet. Believing it costs the floor an ' +
        'afternoon and, worse, puts a helpdesk engineer in an interview about an eleven-week ' +
        'intrusion they had nothing to do with. Two categories of thing can be true on the same ' +
        'day.',
      standIn:
        'AV quarantined a password recovery tool on a helpdesk workstation. It is on the documented ' +
        'exception list and the new agent has not imported exceptions yet. Twenty-one of twenty-two ' +
        'this month were the same thing. Not related, closing it.',
      commandOptions: [
        { command: 'grep RMG-WS-0140 /var/log/edr/quarantine.log', ...WRONG_TARGET },
        { command: 'cat /etc/edr/exceptions.d/helpdesk.conf', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c quarantine /var/log/edr/quarantine.log', ...COUNT_ONLY },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'ls -la /opt/helpdesk/tools/', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether that tool is on an approved exception list and whether the new agent has it.',
      guidance:
        'A real tool on the right machine in the wrong week is still not your incident. Check the ' +
        'exception list.',
    },
  ],
};
