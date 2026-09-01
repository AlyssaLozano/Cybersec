/**
 * Scenario 12: Nothing Installed.
 *
 * An intrusion conducted entirely with software that shipped with the operating
 * system.
 *
 * WHAT THIS TEACHES
 *
 * That "no malware was found" and "nothing happened" are different sentences,
 * and a floor that treats them as the same one will close this in fifteen
 * minutes.
 *
 * Nothing here is malicious as a file. Every binary involved is a genuine
 * Microsoft utility, signed, on its correct path, with a hash that matches the
 * vendor. Antivirus is not wrong to be silent, application allowlisting is not
 * bypassed, and there is no sample to submit anywhere. An analyst whose entire
 * method is "find the bad file and hash it" has nothing to do all hour.
 *
 * The signal is exclusively in CONTEXT: who ran it, from where, parented by
 * what, and whether that combination has ever happened before. A scripting host
 * spawned by a spreadsheet is not a bad binary, it is a bad sentence, and
 * learning to read the sentence rather than the noun is the entire scenario.
 *
 * WHY DETECTION ENGINEERING IS SEATED
 *
 * Because the honest answer to "how do we catch this next time" is
 * uncomfortable and worth reaching properly. You cannot block these tools;
 * administrators need every one of them. The control has to be a behavioural
 * rule about parentage, and writing one that does not fire two hundred times a
 * day on legitimate administration is genuinely hard. That difficulty is the
 * lesson rather than an obstacle to it.
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

const ID = 'nothing-installed';

export const NOTHING_INSTALLED: Scenario = {
  id: ID,
  title: 'Nothing Installed',
  difficulty: 'advanced',
  durationMinutes: 60,
  situation:
    'It is 11:15. Antivirus has found nothing, application control has blocked nothing, and the ' +
    'endpoint agent is healthy on every host. A finance workstation has been behaving oddly since ' +
    'Tuesday and the service desk has run out of ideas. There is no malware on this board.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'forensics',
    'detection-engineer',
    'threat-intel',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Scripting host spawned by a spreadsheet application on RMG-WS-1180',
      detail:
        'A Windows scripting host process was started with the office spreadsheet application as ' +
        'its parent at 09:41 on Tuesday. Both binaries are Microsoft-signed, on their correct ' +
        'paths, with hashes matching the vendor release. Antivirus scanned both and returned ' +
        'clean, correctly. Rule history: fired 90 times in thirty days, 88 closed as macro-enabled ' +
        'finance templates.',
      source: 'RMG-WS-1180',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'process-tree',
      summary: 'Certificate utility used to download a file from an external address',
      detail:
        'The built-in certificate management utility was invoked with parameters that fetch a ' +
        'remote file and write it to disk, retrieving content from 203.0.113.58. This utility is ' +
        'a legitimate administrative tool present on every Windows host by default. It is on the ' +
        'application allowlist because removing it breaks certificate enrolment. Its documented ' +
        'purpose has nothing to do with downloading arbitrary files.',
      source: 'RMG-WS-1180',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'raw-log',
      summary: 'Scheduled task registered under a name matching the Windows update pattern',
      detail:
        'A scheduled task named to match the operating system update task naming convention was ' +
        'registered at 09:48 Tuesday. It runs a system scripting binary against a file in a user ' +
        'profile temporary directory, every ninety minutes, under the logged-on user. Two hundred ' +
        'and forty legitimate scheduled tasks exist across the estate with similar names.',
      source: 'RMG-WS-1180',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'network-flow',
      summary: 'Regular short connections to a content delivery domain since Tuesday',
      detail:
        'The workstation has connected to a legitimate, widely used content delivery network every ' +
        'ninety minutes since Tuesday morning, exchanging 3 to 8 KB each time. That provider is ' +
        'allowlisted and used by several business applications. The specific hostname within it ' +
        'has been seen from no other host in the estate.',
      source: 'RMG-WS-1180',
      target: 'cdn provider',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.5',
      atSeconds: 640,
      surface: 'process-tree',
      summary: 'System management framework used to query domain accounts and group membership',
      detail:
        'The built-in system management framework enumerated domain users, groups and computers ' +
        'across three queries on Wednesday afternoon, run under the finance user account. The ' +
        'framework is standard administrative tooling, used daily by the infrastructure team, and ' +
        'cannot be removed. This account is not an administrator and has never run it before.',
      source: 'RMG-WS-1180',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 790,
      surface: 'host-artefact',
      summary: 'Encoded command string stored in a registry value rather than a file',
      detail:
        'A registry value under the user hive holds 14 KB of base64 text. Decoded, it is the ' +
        'script the scheduled task executes. Nothing is written to disk when it runs: the task ' +
        'reads the value, decodes it in memory and executes it. Endpoint scanning inspects files ' +
        'and does not scan registry value contents.',
      source: 'RMG-WS-1180',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Application control blocked 62 unsigned binaries across the estate this week',
      detail:
        'Application control prevented 62 unsigned executables from running this week, in line ' +
        'with the weekly average of 50 to 80. All 62 trace to developers running locally compiled ' +
        'test builds, and every one has an owner who has been contacted. Rule history: fired 52 ' +
        'times in thirty days, 51 closed as developer tooling.',
      source: 'application control',
      claimedSeverity: 'medium',
    },
  ],
};

export const NOTHING_INSTALLED_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'A macro-enabled spreadsheet opened on Tuesday morning spawned a scripting host.',
    'That used the built-in certificate utility, an allowlisted administrative tool, to download a script from outside.',
    'The script was stored as base64 in a registry value rather than as a file, so nothing exists on disk for antivirus to scan.',
    'A scheduled task named to match the Windows update convention decodes and runs it in memory every ninety minutes.',
    'It calls home through a legitimate allowlisted content delivery network, moving kilobytes at a time.',
    'On Wednesday it enumerated domain users, groups and computers using the standard system management framework, under a finance account that had never run it.',
    'No malware exists anywhere in this incident. Every binary is Microsoft-signed and on its correct path, and every control in the estate is working exactly as designed.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1204.002', 'T1059.005'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['log-analyst', 'malware-analyst'],
      why:
        'Eighty-eight of ninety closed as finance templates, both binaries signed and clean, and ' +
        'antivirus correct to say so. Every fact on this row argues for closing it. The thing that ' +
        'does not is the relationship: a spreadsheet is a document viewer and a scripting host is ' +
        'an execution engine, and the first starting the second is a sentence that only makes ' +
        'sense if the document contained instructions. That is true whether or not the instructions ' +
        'turn out to be malicious. The habit worth building is reading the PARENTAGE rather than ' +
        'the binaries, because both binaries will always be clean here.',
      standIn:
        'Scripting host started by the spreadsheet application on a finance workstation on Tuesday. ' +
        'Both signed, both clean, antivirus correct. Eighty-eight of ninety this month were macro ' +
        'templates. Raising it anyway: a spreadsheet starting an execution engine is a document ' +
        'that contained instructions.',
      commandOptions: [
        { command: 'grep -B2 -A5 "wscript" /var/log/edr/process.log', correct: true, teaches: CORRECT_STEP },
        { command: 'awk \'/wscript|cscript/ {print $2, $6}\' /var/log/edr/process.log | tail -20', ...WRONG_TARGET },
        { command: 'ps -ef | grep office', ...WRONG_TARGET },
        { command: 'sigcheck C:\\\\Windows\\\\System32\\\\wscript.exe', ...WRONG_TARGET },
        { command: 'ls -la /home/finance/Documents/', ...WRONG_TARGET },
      ],
      commandNudge: 'Look at what started that process, not at the process itself.',
      guidance:
        'Both files are clean and always will be. Ask what started what, and whether that pairing ' +
        'makes sense.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1105', 'T1218'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['log-analyst', 'forensics'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'The certificate utility is on the allowlist because removing it breaks certificate ' +
        'enrolment, so it is present on every host and permitted to run everywhere. It also happens ' +
        'to accept parameters that fetch a remote file and write it to disk, which is a documented ' +
        'feature nobody uses for that. This is what living off the land means concretely: not ' +
        'evading a control, but using a tool the control has to permit, for something other than ' +
        'its purpose. The finding is the PARAMETERS, not the binary, and any report that names the ' +
        'utility as suspicious will be argued down by an infrastructure engineer who needs it.',
      standIn:
        'The built-in certificate utility was invoked with parameters that fetch a remote file and ' +
        'write it to disk, pulling from an external address. That utility is on the allowlist ' +
        'because certificate enrolment needs it. Nothing was bypassed. It was used for something ' +
        'other than its job.',
      commandOptions: [
        { command: 'grep -i certutil /var/log/edr/process.log', ...WRONG_TARGET },
        { command: 'awk \'/certutil/ {print $0}\' /var/log/edr/process.log | tail', correct: true, teaches: CORRECT_STEP },
        { command: 'sigcheck C:\\\\Windows\\\\System32\\\\certutil.exe', ...WRONG_TARGET },
        { command: 'cat /etc/appcontrol/allowlist.conf | grep -i cert', ...WRONG_TARGET },
        { command: 'ls -la /tmp/', ...WRONG_TARGET },
      ],
      commandNudge:
        'Read the arguments that tool was given, not just which tool was used.',
      guidance:
        'Ask what this tool is FOR, and then read what it was actually asked to do.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1053.005', 'T1036.004'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'detection-engineer'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.write-rule'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'Named to match the operating system update convention, alongside 240 legitimate tasks with ' +
        'similar names, which is precisely why the name cannot be the detection. Two things ' +
        'separate it and both need somebody to look rather than search. Genuine update tasks run as ' +
        'SYSTEM and this one runs as the logged-on user, because whoever wrote it did not have ' +
        'administrator rights. And it points at a file in a user profile temporary directory, which ' +
        'no operating system task does. Ninety minutes is also a choice: frequent enough to keep ' +
        'control, spaced enough to look like maintenance.',
      standIn:
        'Scheduled task registered Tuesday 09:48 named to match the Windows update pattern, running ' +
        'a system scripting binary against a file in a user temp directory, every ninety minutes, ' +
        'as the logged-on user. Real update tasks run as SYSTEM and do not point at user temp.',
      commandOptions: [
        { command: 'schtasks /query /fo LIST /v | grep -B3 -A8 Update', correct: true, teaches: CORRECT_STEP },
        { command: 'awk \'/schtasks|Task Registered/ {print $1, $7}\' /var/log/audit/audit.log', ...WRONG_TARGET },
        { command: 'ls -la /var/spool/cron/', ...WRONG_TARGET },
        { command: 'systemctl list-timers', ...WRONG_TARGET },
        { command: 'cat /etc/crontab', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check which account that task runs as, and compare it to the real update tasks.',
      guidance:
        'The name is chosen to blend in. Look at what account it runs as and what file it points at.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1071.001', 'T1102'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'detection-engineer'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'A legitimate, allowlisted content delivery network used by real business applications, ' +
        'which is the point: blocking the provider is not available and reputation gives nothing, ' +
        'because the provider reputation is excellent. Two observations get there anyway. The ' +
        'interval matches the scheduled task exactly, so the traffic and the persistence are the ' +
        'same thing seen from two surfaces. And the specific hostname inside the provider has been ' +
        'seen from no other host in the estate, which is the comparison that works when the domain ' +
        'reputation does not. Uniqueness within a trusted provider is the finding.',
      standIn:
        'Workstation has hit a legitimate allowlisted CDN every ninety minutes since Tuesday, 3 to ' +
        '8 KB each time. The interval matches the scheduled task exactly. The specific hostname ' +
        'inside that provider has been seen from no other host in the estate.',
      commandOptions: [
        { command: 'awk \'$2=="RMG-WS-1180" {print $1, $4}\' /var/log/flows.log | tail -30', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c cdn /var/log/proxy/access.log', ...COUNT_ONLY },
        { command: 'awk \'/cdn/ {print $6}\' /var/log/proxy/access.log | sort | uniq -c', ...WRONG_TARGET },
        { command: 'dig +short cdn-provider.example', ...WRONG_TARGET },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
      ],
      commandNudge:
        'Compare the interval of those connections against anything else you have found.',
      guidance:
        'You cannot block a trusted provider. Ask whether any OTHER host talks to that same ' +
        'hostname.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1087.002', 'T1059.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The system management framework is used by the infrastructure team every day and cannot be ' +
        'removed, so the tool is not the finding and the queries are not either. The finding is ' +
        'WHO: a finance account, not an administrator, that has never run it in its history. That ' +
        'comparison turns an ordinary administrative action into an unambiguous one, and it is ' +
        'available to anybody who checks the account rather than the command. It also tells the ' +
        'floor what stage this is at: enumerating users, groups and computers is somebody mapping ' +
        'the domain before deciding where to go, so this is not finished.',
      standIn:
        'The system management framework enumerated domain users, groups and computers on Wednesday ' +
        'under the finance account. Infrastructure use that daily and we cannot remove it. This ' +
        'account is not an administrator and has never run it before. They are mapping the domain.',
      commandOptions: [
        { command: 'grep -i "powershell" /var/log/edr/process.log | tail -20', ...WRONG_TARGET },
        { command: 'awk \'$5=="finance\\\\\\\\\\\\\\\\j.reyes" {print $6}\' /var/log/edr/process.log | sort -u', correct: true, teaches: CORRECT_STEP },
        { command: 'net user j.reyes /domain', ...WRONG_TARGET },
        { command: 'last | grep reyes', ...WRONG_TARGET },
        { command: 'cat /etc/group', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether that account has ever run this tool before, not whether the tool is normal.',
      guidance:
        'Administrators run this constantly. Ask whether THIS account ever has.',
    },
    {
      eventId: 'ev.6',
      critical: true,
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1027.011', 'T1140'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'The answer to why nothing found this. There is no file. The payload is 14 KB of base64 in ' +
        'a registry value, decoded and executed in memory, and endpoint scanning inspects files ' +
        'rather than registry value contents. Nothing was evaded, because nothing was ever in a ' +
        'place that gets scanned. This also changes remediation: deleting a file is not available, ' +
        'so the value and the task both have to go, and it changes evidence handling, because a ' +
        'registry value is trivially overwritten by anybody tidying up. Preserve the hive before ' +
        'touching either.',
      standIn:
        'The payload is 14 KB of base64 in a registry value under the user hive, decoded in memory ' +
        'by the scheduled task. Nothing is ever written to disk. Endpoint scanning looks at files ' +
        'and does not read registry value contents. Hive exported, hashed and sealed before we ' +
        'remove anything.',
      commandNudge:
        'Ask where the script the task runs actually lives, if it is not a file on disk.',
      guidance:
        'Antivirus scans files. Ask whether this ever WAS a file, and where it is kept if not.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.decode'],
      escalateTo: [],
      why:
        'Sixty-two unsigned binaries blocked, inside the weekly average, every one a developer test ' +
        'build with a named owner already contacted. Application control worked correctly all week. ' +
        'It is the most tempting wrong answer on this board because the floor has spent the hour ' +
        'unable to find anything unsigned, and here is a list of sixty-two unsigned things. The ' +
        'irony is the lesson: this incident used nothing unsigned at all, which is exactly why ' +
        'application control never saw it. A report that includes these has attached a working ' +
        'control to an incident it had no bearing on.',
      standIn:
        'Sixty-two unsigned binaries blocked this week, inside the 50 to 80 average, all developer ' +
        'test builds with owners contacted. That is the control working. Nothing in our incident was ' +
        'unsigned. Closing it.',
      commandOptions: [
        { command: 'grep -c BLOCKED /var/log/appcontrol/events.log', ...COUNT_ONLY },
        { command: 'awk \'/BLOCKED/ {print $5}\' /var/log/appcontrol/events.log | sort | uniq -c | sort -rn', ...WRONG_TARGET },
        { command: 'grep RMG-WS-1180 /var/log/appcontrol/events.log', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/appcontrol/weekly-summary.log', ...DUMP_ALL },
        { command: 'systemctl status appcontrol', ...STATUS_CHECK },
      ],
      commandNudge:
        'Check whether any of those blocks came from the workstation you are working on.',
      guidance:
        'Ask whether anything in your incident was unsigned. If not, this list is a different story.',
    },
  ],
};
