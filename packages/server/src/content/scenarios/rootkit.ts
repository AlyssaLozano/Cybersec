/**
 * Scenario 19: Below The Floor.
 *
 * A kernel module that makes the host lie about itself.
 *
 * WHAT THIS TEACHES
 *
 * That every tool a floor uses to look at a machine is a program running on
 * that machine, asking that machine questions. When something sits below those
 * tools, the answers come back clean and confident and wrong, and no amount of
 * looking harder from the same vantage point helps.
 *
 * The skill is learning to distrust a specific source and reach for one the
 * compromised host does not control. Almost everything on this board is
 * discovered from OUTSIDE the affected machine: the network sees traffic the
 * host denies making, the storage array sees writes the filesystem denies, and
 * an offline image sees files the live system denies having. That triangulation
 * is the entire method.
 *
 * WHY IT IS FOUND BY ARITHMETIC
 *
 * The opening event is a number that does not add up: the switch counted more
 * bytes than the host admits sending. Nobody detected the rootkit, because
 * nothing can. What was detected is a discrepancy between two independent
 * counters, and the discipline of noticing that two sources disagree is the
 * same one taught at expert difficulty in `ridgeline`.
 *
 * THE TRAP
 *
 * `ev.5`. Antivirus, the endpoint agent and the integrity checker all report
 * the host clean, and they are all being lied to by the same thing. A floor that
 * treats three agreeing tools as three independent confirmations has ignored
 * that all three ask the same kernel the same question.
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

const ID = 'below-the-floor';

export const BELOW_THE_FLOOR: Scenario = {
  id: ID,
  title: 'Below The Floor',
  difficulty: 'expert',
  durationMinutes: 60,
  situation:
    'It is 14:00. A network capacity reconciliation found a host that is sending more than it ' +
    'says it is. Every security tool on that machine reports it clean. Two of those statements ' +
    'cannot both be true.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'forensics',
    'detection-engineer',
    'vulnerability-analyst',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Switch counters show 40 GB more outbound from rmg-db-04 than the host reports',
      detail:
        'Monthly reconciliation between switch port counters and host network statistics found a ' +
        '40 GB discrepancy on one port over thirty days. The switch counted 40 GB more outbound ' +
        'than the host operating system reports sending. Every other port in the estate ' +
        'reconciles within 0.2 percent. This was raised by the network team as a possible counter ' +
        'fault.',
      source: 'rmg-db-04',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'network-flow',
      summary: 'Flow records show nightly transfers the host has no record of',
      detail:
        'Flow collection at the switch shows a transfer from rmg-db-04 to 198.51.100.88 every ' +
        'night between 02:15 and 03:40, averaging 1.3 GB. The host own connection logs, process ' +
        'accounting and firewall logs contain no record of any of these sessions. The switch is a ' +
        'separate device and the host has no ability to alter what it recorded.',
      source: 'rmg-db-04',
      target: '198.51.100.88:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'raw-log',
      summary: 'A gap in the process accounting log that the log itself does not acknowledge',
      detail:
        'Process accounting records on the host run continuously except between 02:14 and 03:41 ' +
        'each night, where there are no entries at all. The service reports no restart, no error ' +
        'and no gap. Sequence numbers in the log run continuously across the missing window, which ' +
        'means entries were removed and the numbering rewritten rather than simply never written.',
      source: 'rmg-db-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'process-tree',
      summary: 'A kernel module loaded at boot that is not in the distribution package manifest',
      detail:
        'The loaded module list includes an entry not present in any installed package and not ' +
        'signed by the distribution. It was loaded at boot through an initramfs hook added on the ' +
        '3rd. Listing loaded modules from userspace returns a list that does not include it: it ' +
        'was found by comparing the boot loader configuration against the running system from a ' +
        'rescue environment.',
      source: 'rmg-db-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 640,
      surface: 'alert-queue',
      summary: 'Antivirus, endpoint agent and file integrity checker all report the host clean',
      detail:
        'All three tools completed scheduled scans in the last 24 hours and reported no findings. ' +
        'The file integrity checker confirms no monitored file has changed since its baseline. All ' +
        'three run as userspace processes on the host and obtain their information through ' +
        'standard operating system interfaces.',
      source: 'rmg-db-04',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.6',
      atSeconds: 790,
      surface: 'host-artefact',
      summary: 'Offline image shows files and a directory the live system does not report',
      detail:
        'An image taken from the storage array snapshot rather than from the running host contains ' +
        'a directory under /lib/modules and four files that the live filesystem does not list. ' +
        'Total 61 MB. Byte counts on the array show writes to those blocks nightly, matching the ' +
        'transfer windows. The live host reports the volume as having 61 MB more free space than ' +
        'the array does.',
      source: 'rmg-db-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Kernel version on nine database servers is four months behind current',
      detail:
        'Patch reporting shows nine database servers running a kernel four months old, including ' +
        'rmg-db-04. The delay is a documented decision: the database vendor certifies specific ' +
        'kernel versions and support is void outside them. A certified newer version was released ' +
        'eleven days ago and is scheduled for the next maintenance window. Rule history: fired 30 ' +
        'times in thirty days, 30 closed as vendor certification constraint.',
      source: 'patch reporting',
      claimedSeverity: 'medium',
    },
  ],
};

export const BELOW_THE_FLOOR_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On the 3rd somebody loaded a kernel module on rmg-db-04 through an initramfs hook, so it loads before anything that could observe it.',
    'The module hides itself from the loaded module list, hides a directory and four files from the filesystem, and hides its own network sessions from the host.',
    'Every night between 02:15 and 03:40 it transfers about 1.3 GB of database content out, and removes the process accounting entries afterwards, rewriting the sequence numbers so the log looks continuous.',
    'Antivirus, the endpoint agent and the file integrity checker all report clean, correctly, because all three ask the kernel and the kernel lies.',
    'It was found because the switch counted 40 GB more outbound than the host admitted to, and a switch is a separate device the host cannot reach.',
    'Everything that proved it came from outside the machine: switch counters, flow records, the storage array byte counts, and an offline image.',
    'Roughly 40 GB of database content has left over thirty days, and nothing running on that host could ever have told anybody.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1014'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.reimage-now', 'act.isolate'],
      escalateTo: ['network-analyst', 'log-analyst'],
      why:
        'A reconciliation report from the network team about a possible counter fault, which is ' +
        'about as far from a security alert as a thing can get. The reason to take it is the ' +
        'comparison sitting right there in the row: every other port in the estate reconciles ' +
        'within 0.2 percent and this one is out by 40 GB. A single faulty counter is possible; one ' +
        'faulty counter that is wrong in exactly one direction, by a large amount, on one host, is ' +
        'a coincidence worth ninety seconds. The framing that unlocks the whole hour is that two ' +
        'independent counters disagree, so at least one of them is wrong, and the question is which.',
      standIn:
        'Switch counted 40 GB more outbound on that port over thirty days than the host says it ' +
        'sent. Every other port in the estate reconciles within 0.2 percent. Two counters disagree ' +
        'and one of them is lying. Raising it.',
      commandOptions: [
        { command: 'cat /var/log/network/reconciliation-monthly.txt | head -20', ...WRONG_TARGET },
        { command: 'awk \'$3 > 1000 {print $1, $3}\' /var/log/network/reconciliation-monthly.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'ifconfig eth0', ...WRONG_TARGET },
        { command: 'cat /proc/net/dev', ...WRONG_TARGET },
        { command: 'ethtool -S eth0 | head', ...WRONG_TARGET },
      ],
      commandNudge:
        'Compare that discrepancy against what every other port in the estate looks like.',
      guidance:
        'Two counters disagree. Ask which one the host can influence and which one it cannot.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1014', 'T1029'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The finding that names the problem, and the reasoning is worth stating carefully because ' +
        'it is the method for the whole scenario. Flow collection at the switch shows 1.3 GB a ' +
        'night to one address. The host has no record in its connection logs, its process ' +
        'accounting or its firewall logs. Both cannot be right, and the switch is a separate ' +
        'device the host cannot reach, so the host is the one that is wrong. That is not a logging ' +
        'gap or a misconfiguration: a machine that does not know about its own network sessions has ' +
        'something running below the layer that would know, and from this point every answer the ' +
        'host gives is suspect.',
      standIn:
        'Flow records at the switch show 1.3 GB a night from that host to one external address, ' +
        '02:15 to 03:40, every night. The host has no record of any of it in connection logs, ' +
        'process accounting or firewall logs. The switch is a separate box the host cannot touch. ' +
        'The host is lying about its own traffic.',
      commandOptions: [
        { command: 'grep 198.51.100.88 /var/log/switch/flows.log | tail -20', correct: true, teaches: CORRECT_STEP },
        { command: 'awk \'$2=="rmg-db-04" {print $1, $6}\' /var/log/switch/flows.log | tail', ...WRONG_TARGET },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'ss -tnp', ...WRONG_TARGET },
        { command: 'iptables -L -n -v', ...WRONG_TARGET },
      ],
      commandNudge:
        'Compare what the switch recorded against what the host says about the same sessions.',
      guidance:
        'The host and the switch disagree. Ask which of them the attacker could have changed.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1070.002', 'T1014'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.power-off'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'A gap in the log that the log denies having, and the sequence numbers are what make it ' +
        'conclusive. If the accounting service had stopped there would be a restart record and the ' +
        'numbering would jump. Instead the numbering runs continuously across a window with no ' +
        'entries, which means entries were removed and the numbers rewritten to close the hole. ' +
        'That is deliberate and it is careful. The window also matches the transfer window exactly, ' +
        'so this is not a separate problem: whatever moved the data cleaned up after itself in the ' +
        'same ninety minutes.',
      standIn:
        'Process accounting has no entries between 02:14 and 03:41 every night, and the service ' +
        'reports no restart or error. The sequence numbers run continuously across the gap, so ' +
        'entries were removed and the numbering rewritten. Same window as the transfers.',
      commandOptions: [
        { command: 'lastcomm | head -30', ...WRONG_TARGET },
        { command: 'awk \'{print $NF}\' /var/log/pacct.log | head -40', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c . /var/log/pacct.log', ...COUNT_ONLY },
        { command: 'systemctl status psacct', ...STATUS_CHECK },
        { command: 'journalctl -u psacct --since yesterday', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether the sequence numbers in that log jump across the gap or run continuously.',
      guidance:
        'A missing hour is one thing. Ask whether the log admits the hour is missing.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1014', 'T1547.006'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The thing itself, and how it was found matters as much as what it is. Listing loaded ' +
        'modules from userspace does not include it, because the module edits that list. It was ' +
        'found by comparing the boot loader configuration against the running system from a rescue ' +
        'environment, which is to say by asking a question the compromised kernel was not in a ' +
        'position to answer. Loading through an initramfs hook means it is running before anything ' +
        'that could observe it starts, which is why no endpoint tool was ever going to see it. Not ' +
        'signed by the distribution and in no package manifest settles what it is.',
      standIn:
        'There is a kernel module loaded at boot through an initramfs hook added on the 3rd. It is ' +
        'in no package manifest and not signed by the distribution. Listing modules from userspace ' +
        'does not show it: we found it by comparing the boot configuration against the running ' +
        'system from a rescue environment.',
      commandOptions: [
        { command: 'lsmod | head -20', ...WRONG_TARGET },
        { command: 'diff <(lsmod | awk "{print \\\\$1}" | sort) <(ls /lib/modules/$(uname -r)/kernel -R | sort)', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /proc/modules | wc -l', ...COUNT_ONLY },
        { command: 'modinfo hidden_mod', ...WRONG_TARGET },
        { command: 'dmesg | grep -i module | tail', ...WRONG_TARGET },
      ],
      commandNudge:
        'Ask the running system what modules are loaded, then ask something outside it the same ' +
        'question.',
      guidance:
        'If something is hiding from the tools, stop asking the tools. Ask from somewhere it does ' +
        'not control.',
    },
    {
      eventId: 'ev.5',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.reimage-now', 'act.declare'],
      escalateTo: [],
      why:
        'Three tools agreeing that the host is clean, all three wrong, and the reason is the point ' +
        'of the scenario. Antivirus, the endpoint agent and the file integrity checker are three ' +
        'products from three vendors, which feels like three independent confirmations. They are ' +
        'not independent at all: all three are userspace processes asking the same kernel the same ' +
        'questions through the same interfaces, and that kernel has been modified to answer wrong. ' +
        'Three tools with a shared dependency give you one opinion, not three. The integrity ' +
        'checker is the sharpest version, since it confirms no monitored file changed while an ' +
        'offline image shows four files it cannot see. Graded as a false positive because the tools ' +
        'genuinely reported clean and the report is genuinely false.',
      standIn:
        'Antivirus, the endpoint agent and the integrity checker all scanned in the last 24 hours ' +
        'and all report clean. All three are userspace processes asking the same kernel through the ' +
        'same interfaces, and that kernel is modified. Three tools with one dependency is one ' +
        'opinion. Their clean results are not evidence of anything.',
      commandOptions: [
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/aide/last-check.log | tail -20', ...WRONG_TARGET },
        { command: 'ps -ef | grep -E "av-scan|edr|aide"', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/av/scan-results.log | tail', ...WRONG_TARGET },
        { command: 'aide --check | head -20', ...MUTATE },
      ],
      commandNudge:
        'Work out how those three tools get their information, and whether the sources differ.',
      guidance:
        'Three tools agreed. Ask whether they are independent, or whether they all ask the same ' +
        'thing.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1014', 'T1564'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The proof, and it exists only because it was taken from the array snapshot rather than ' +
        'from the running host. Sixty-one megabytes of files and a directory the live filesystem ' +
        'does not list, with array byte counts showing nightly writes to those blocks matching the ' +
        'transfer windows. The free space discrepancy is the neatest single fact available: the ' +
        'live host reports 61 MB more free space than the array does, which is the hiding measured ' +
        'in bytes. Method matters more than the finding here. A live image taken through the ' +
        'compromised kernel would have come back clean and would have been worse than useless, ' +
        'because it would have been believed.',
      standIn:
        'Image from the array snapshot, not the live host, has a directory under /lib/modules and ' +
        'four files the live filesystem does not list, 61 MB total. Array byte counts show nightly ' +
        'writes to those blocks matching the transfer windows. The live host reports 61 MB more ' +
        'free space than the array does. Sealed and hashed.',
      commandNudge:
        'Take the image from somewhere other than the running host, then compare the two.',
      guidance:
        'A live image is produced by the thing you suspect. Ask whether you can get one from ' +
        'underneath it.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.triage-high', 'act.reimage-now', 'act.isolate', 'act.declare'],
      escalateTo: ['ir-lead'],
      why:
        'A real finding with a documented reason, and the wrong conclusion is sitting right next to ' +
        'the right one. The kernel is four months old because the database vendor certifies ' +
        'specific versions and support is void outside them, which is a genuine business ' +
        'constraint rather than negligence, and a certified update is already scheduled. So this is ' +
        'not the cause and blaming it would be wrong: nothing establishes that the module got in ' +
        'through a kernel vulnerability, and it more likely arrived with root access somebody ' +
        'already had. What this seat should take from the row is the number. Nine database servers ' +
        'share this configuration, and the question nobody else will ask is whether any of the ' +
        'other eight shows the same counter discrepancy.',
      standIn:
        'Nine database servers are four months behind on kernel, including this one, because the ' +
        'database vendor certifies specific versions and a certified update is already scheduled. ' +
        'That is a constraint, not the cause, and nothing says the module came in through a kernel ' +
        'bug. What matters is that eight other hosts share this build, and I want the counter ' +
        'reconciliation run against all of them.',
      commandNudge:
        'Find out how many other hosts share this configuration, and check them the way this one ' +
        'was checked.',
      guidance:
        'An old kernel is not automatically how they got in. Ask what else looks like this host.',
    },
  ],
};
