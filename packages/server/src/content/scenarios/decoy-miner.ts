/**
 * Scenario 68: Loud On Purpose.
 *
 * Twelve servers are mining cryptocurrency. The mining is the least important
 * thing that has happened to them.
 *
 * WHAT THIS TEACHES
 *
 * That a noisy finding ends investigations, and that some intrusions rely on
 * exactly that.
 *
 * A miner is the most satisfying thing a floor can find. It is unambiguous,
 * nobody has to argue about whether it is malicious, the remedy is obvious, and
 * the case closes with a clean outcome and a number attached. Everything about
 * it invites a floor to stop, and stopping is the failure this scenario is built
 * around.
 *
 * The tell is economic before it is technical. Twelve servers of this size earn
 * a few pounds a day. Whoever put the miner there added a layer to a container
 * image in an internal registry, which is patient, careful work worth far more
 * than the mining revenue it produced. When the effort is wildly out of
 * proportion to the payoff, the payoff on display is not the objective.
 *
 * IT HAS ALREADY WORKED ONCE
 *
 * A miner was found on three of these same hosts in July, removed, and the case
 * closed with a good outcome. The quiet thing survived that response and has
 * been collecting service account credentials since. The most uncomfortable
 * finding available tonight is a closed ticket with somebody's name on it.
 *
 * EXPERT INSTRUMENTS IN USE
 *
 * The July remediation reaches two seats through two systems and they disagree
 * about what was actually rebuilt. The quiet payload's own detection is
 * withheld, so at expert the floor has to infer that something else is there
 * from credentials appearing where they should not. And whether July and
 * tonight are the same actor cannot be settled, because the host that would
 * have answered it was cleaned in place and its disk reused.
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

const ID = 'loud-on-purpose';

export const LOUD_ON_PURPOSE: Scenario = {
  id: ID,
  title: 'Loud On Purpose',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 08:00 at Ridgeline Medical Group. Twelve servers spent the night at full load mining ' +
    'cryptocurrency. The service desk has already drafted the closure note.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'forensics',
    'cloud-security',
    'threat-intel',
    'detection-engineer',
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
      summary: 'Twelve servers at sustained full load overnight',
      detail:
        'Capacity monitoring raised sustained 95 per cent processor utilisation across twelve ' +
        'application servers from 23:40 to 06:20. The endpoint platform identifies a known ' +
        'cryptocurrency mining binary on all twelve. Rule history: this rule fired 4 times in ' +
        'ninety days, 3 closed as batch reporting jobs and 1 closed in July as a mining incident, ' +
        'remediated.',
      source: 'capacity monitoring',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'process-tree',
      summary: 'The miner is off-the-shelf and makes no attempt to hide',
      detail:
        'The binary is an unmodified build of a widely distributed mining program, running under ' +
        'its own name, with a configuration file in the same directory naming a public mining pool ' +
        'and a wallet address. It is not packed, not obfuscated, and takes no steps to avoid ' +
        'monitoring. It starts from a systemd unit written in plain text. The wallet has received ' +
        'the equivalent of 41 pounds since 14 July.',
      source: 'RMG-APP-14',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'host-artefact',
      withheldAtExpert: true,
      summary: 'A second component exists only in memory',
      detail:
        'Memory capture from RMG-APP-14 contains a loaded module with no corresponding file on ' +
        'disk, mapped by the same parent process that starts the miner. It hooks the local ' +
        'authentication path and writes credential material to a buffer that is flushed to an ' +
        'external address every six hours. It has no persistence of its own: it is loaded fresh ' +
        'each time by the miner\'s unit file, which is the only thing on disk that references it.',
      source: 'RMG-APP-14',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'raw-log',
      summary: 'Service accounts are authenticating from hosts they have no business on',
      detail:
        'Six service accounts belonging to the pathology interface, the pharmacy stock system and ' +
        'the appointment reminder service have authenticated from hosts outside their own ' +
        'application estate on 34 occasions since 22 July. Every one of the source hosts is one of ' +
        'the twelve. The accounts are used correctly and do nothing unusual once authenticated. No ' +
        'password for any of them has been changed since 2024.',
      source: 'directory',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 640,
      surface: 'host-artefact',
      summary: 'What was actually done in July',
      detail:
        'Three of these twelve hosts carried a miner in July. Host build records show RMG-APP-03 ' +
        'and RMG-APP-07 rebuilt from image on 16 July. RMG-APP-14 has no rebuild record: its ' +
        'install date is unchanged from 2023, and a shell history entry on 16 July shows the miner ' +
        'binary and its unit file deleted by hand, followed by a service reload. Its disk was ' +
        'never taken.',
      expertDetail:
        'Case RMG-IR-0294, opened 15 July and closed 17 July: "Cryptominer identified on three ' +
        'application servers. All three rebuilt from clean image and returned to service. No ' +
        'evidence of onward access. Root cause not established. Closed."',
      expertAlsoOn: ['alert-queue'],
      source: 'RMG-APP-14',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 800,
      surface: 'cloud-audit',
      summary: 'The image in the internal registry carries a layer nobody added deliberately',
      detail:
        'All twelve hosts run containers built from internal base image rmg/appbase, tag 4.2. That ' +
        'tag was pushed on 11 July by the build service account and carries one layer more than ' +
        'the 4.1 tag and than the build pipeline produces. The extra layer adds the miner binary, ' +
        'its unit file and one shared object. The push came from an address inside the build ' +
        'network. No pipeline run corresponds to it.',
      source: 'container registry',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 960,
      surface: 'network-flow',
      summary: 'One loud channel and one that sends forty kilobytes a day',
      detail:
        'All twelve hosts hold continuous connections to a public mining pool on its documented ' +
        'port, averaging 2.1 megabytes an hour each, which is 96 per cent of the anomalous traffic ' +
        'from these hosts. Separately, each host sends approximately 40 kilobytes to ' +
        '203.0.113.188 every six hours, over HTTPS, at times that do not align with any scheduled ' +
        'job. That address has no history in the estate before 12 July.',
      source: 'network monitoring',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1120,
      surface: 'alert-queue',
      expertOnly: true,
      summary: 'Whether July and tonight are the same operation cannot be settled',
      detail:
        'The July miner used a different wallet address and a different mining pool. The deployment ' +
        'route is the same, and that route is described in public tooling documentation used by ' +
        'many unrelated actors. RMG-APP-14 was cleaned by hand in July and its disk reused, so the ' +
        'artefacts that would show whether the quiet component was present before 16 July no longer ' +
        'exist. The two rebuilt hosts were reimaged, which removed the same evidence for a ' +
        'different reason.',
      source: 'incident assessment',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.9',
      atSeconds: 1280,
      surface: 'alert-queue',
      summary: 'The mining earned forty-one pounds in seven weeks',
      detail:
        'The wallet has received the equivalent of 41 pounds since 14 July across twelve servers. ' +
        'Compromising an internal container registry, producing a modified base image that passes ' +
        'as a legitimate tag, and maintaining it undetected across a remediation is many days of ' +
        'skilled work. Commodity mining operations typically deploy to thousands of hosts and do ' +
        'not build supply chain access to reach twelve.',
      source: 'assessment',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.10',
      atSeconds: 1440,
      surface: 'alert-queue',
      summary: 'Four of the twelve carry clinical traffic',
      detail:
        'Of the twelve hosts, four run the pathology results interface that delivers laboratory ' +
        'results into the clinical record, and two run the appointment reminder service. The ' +
        'remaining six are administrative. Rebuilding all twelve from the current image redeploys ' +
        'tag 4.2. The pathology interface has no standby. Six service account passwords, unchanged ' +
        'since 2024, are embedded in configuration on 60 other systems.',
      source: 'clinical systems',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.11',
      atSeconds: 1600,
      surface: 'raw-log',
      summary: 'Everything that fired, fired on the noise',
      detail:
        'Detection coverage on these hosts consists of processor utilisation thresholds, known ' +
        'malicious binary hashes, and connections to known mining pools. All three fired within ' +
        'twenty minutes of the miner starting on 14 July. Nothing covers a service account ' +
        'authenticating from an unexpected host, an image tag gaining a layer, or a small regular ' +
        'outbound transfer. The July case closed in under 48 hours with a positive outcome ' +
        'recorded.',
      source: 'detection coverage',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.12',
      atSeconds: 1760,
      surface: 'alert-queue',
      summary: 'A thirteenth host is also at full load',
      detail:
        'RMG-RES-11 has been at 99 per cent processor utilisation since Sunday. It is a genomics ' +
        'analysis node running a variant calling job submitted through the research scheduler by a ' +
        'named user, with a job record, an expected runtime of 70 hours and an expected finish on ' +
        'Wednesday. It runs no containers, does not use rmg/appbase, holds no connection to any ' +
        'mining pool, and its load profile matches eleven previous runs.',
      source: 'RMG-RES-11',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.13',
      atSeconds: 1900,
      surface: 'alert-queue',
      summary: 'What the incident actually is',
      detail:
        'Twelve hosts run an image carrying an unauthorised layer pushed on 11 July. That layer ' +
        'delivers a miner and one shared object. Six service accounts with passwords unchanged ' +
        'since 2024 have been used from those hosts since 22 July, and 40 kilobytes leaves each ' +
        'host every six hours to an address with no history before 12 July. A remediation in July ' +
        'removed miners from three hosts and did not remove the cause from any of them.',
      source: 'incident assessment',
      claimedSeverity: 'critical',
    },
  ],
};

export const LOUD_ON_PURPOSE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On 11 July somebody pushed tag 4.2 of the internal base image rmg/appbase from inside the build network, with no corresponding pipeline run. The tag carries one layer more than the pipeline produces, adding a mining binary, its unit file and one shared object.',
    'Twelve application servers run containers built from that image. From 14 July they mined cryptocurrency, loudly, on a public pool, under the binary\'s own name, with the wallet address in a plain text file beside it.',
    'The shared object is loaded fresh by the miner\'s unit file, exists only in memory, hooks the local authentication path and flushes credential material to an external address every six hours.',
    'Since 22 July six service accounts belonging to the pathology interface, the pharmacy stock system and the appointment reminder service have authenticated from those hosts on 34 occasions. None of their passwords has changed since 2024, and they are embedded in configuration on 60 other systems.',
    'On 15 July a miner was found on three of these hosts. Two were rebuilt from image, which redeployed the same compromised tag. The third was cleaned by hand: the binary and unit file were deleted, the service reloaded, and the disk never taken.',
    'The case closed on 17 July with the outcome recorded as all three rebuilt, no evidence of onward access, root cause not established.',
    'The wallet has received 41 pounds in seven weeks, against many days of skilled work to compromise a registry and hold that access across a remediation.',
    'The mining is not the objective. It is the thing that gets found.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1496'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.tune', 'act.attribute-named'],
      escalateTo: ['malware-analyst', 'ir-lead'],
      why:
        'The service desk has drafted the closure note before anybody has investigated, and that is ' +
        'the most informative thing on this row. A miner is the most satisfying finding a floor ' +
        'gets: unambiguous, nobody argues about whether it is malicious, the remedy is obvious, and ' +
        'the case closes with a good outcome and a number attached. Every part of that invites ' +
        'stopping. The line to read twice is the rule history, which records one previous firing ' +
        'closed in July as a mining incident, remediated. A thing that was remediated seven weeks ' +
        'ago and is back is not a recurrence, it is evidence that the remediation missed ' +
        'something, and that is worth declaring on rather than repeating. Do not rebuild anything ' +
        'yet: rebuilding is what happened in July.',
      standIn:
        'Twelve servers mining overnight, and the service desk has already drafted the closure note. ' +
        'That is the bit I am flagging. The rule history says one previous firing, closed in July ' +
        'as a mining incident, remediated. Something remediated seven weeks ago that is back is not ' +
        'a recurrence, it is a remediation that missed something. Declaring, and nobody rebuilds ' +
        'anything yet, because rebuilding is what we did in July.',
      commandOptions: [
        { command: "awk -F, '$3==\"CPU_SUSTAINED\" {print $1, $2}' /var/log/monitoring/capacity.csv | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "miner\\|xmrig\\|mining" /var/log/cases/history.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status monitoring', ...STATUS_CHECK },
        { command: 'cat /var/log/monitoring/capacity.csv', ...DUMP_ALL },
        { command: 'systemctl stop miner && rm /usr/local/bin/miner', ...MUTATE },
      ],
      commandNudge:
        'Read the rule history and find out what the previous firing was.',
      guidance:
        'This has fired before. Ask what happened last time.',
    },
    {
      eventId: 'ev.2',
      verdict: 'decoy',
      stage: 'execution',
      critical: true,
      techniques: ['T1496'],
      appearsToBe:
        'The incident. An unmodified miner running under its own name with the wallet in a plain ' +
        'text file beside it reads as an opportunistic nuisance with an obvious remedy, and the ' +
        'case closes cleanly the moment it is removed. It is doing exactly the job it was deployed ' +
        'to do, which is to be found.',
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'threat-intel', 'ir-lead'],
      correctActions: ['act.decode', 'act.ttp-map'],
      outOfLaneActions: ['act.reimage-now', 'act.sandbox', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Every property of this binary says it does not care whether it is found. Unmodified, ' +
        'running under its own name, not packed, not obfuscated, no attempt to evade monitoring, ' +
        'started from a plain text unit file, with the pool and wallet in a configuration file in ' +
        'the same directory. Set that against how it arrived, which was inside a modified base ' +
        'image in an internal registry, and the two halves do not belong to the same intention. ' +
        'Somebody capable of quietly adding a layer to a trusted image does not then run a ' +
        'commodity miner under its own name by accident. The correct reading is that the ' +
        'concealment budget was spent on delivery and deliberately not spent on the payload, and ' +
        'the useful next question is therefore what else that delivery brought. Do not rebuild ' +
        'while answering it: this is the only running copy of whatever else is here.',
      standIn:
        'This binary does not care whether we find it. Unmodified, own name, not packed, not ' +
        'obfuscated, plain text unit file, pool and wallet sitting in a config file next to it. ' +
        'Now set that against how it arrived, which is a modified layer inside a trusted internal ' +
        'image. Those two do not belong to the same intention. Nobody quietly compromises a ' +
        'registry and then accidentally runs a commodity miner under its own name. The hiding was ' +
        'spent on delivery and deliberately not on the payload, so the question is what else came ' +
        'down that path. And nothing gets rebuilt while I answer it.',
      commandOptions: [
        { command: 'systemctl cat rmg-appcache.service && cat /opt/rmg/appcache/config.json', correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /opt/rmg/appcache/bin/* && strings -n 8 /opt/rmg/appcache/bin/* | grep -i pool', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status rmg-appcache', ...STATUS_CHECK },
        { command: 'cat /opt/rmg/appcache/bin/miner', ...DUMP_ALL },
        { command: 'curl -s https://pool.example:3333/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Establish how much effort went into hiding this binary, and compare it to how it was ' +
        'delivered.',
      guidance:
        'This one was easy to find. Ask whether it was meant to be.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1056.001', 'T1620'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.preserve'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.sandbox', 'act.dismiss'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The thing the miner was covering, and it is only in memory. A module with no file on disk, ' +
        'mapped by the same parent process that starts the miner, hooking the local authentication ' +
        'path and flushing credential material to an external address every six hours. It has no ' +
        'persistence of its own, which is the part that makes the July response so costly in ' +
        'hindsight: the only thing on disk that references it is the miner\'s unit file, so ' +
        'deleting the miner removes the loader and leaves no trace of what was loaded, while ' +
        'rebuilding from the compromised image puts both straight back. Where this capture is not ' +
        'available the same conclusion still has to be reached, from credentials appearing on ' +
        'hosts that have no business with them: something on these machines is collecting, it does ' +
        'not have to be on disk, and an intrusion that shows only its noisy half has a quiet half ' +
        'by construction. Capture memory before anybody touches a host.',
      standIn:
        'Here is what the miner was covering. Module with no file on disk, mapped by the same parent ' +
        'as the miner, hooking authentication and flushing credentials out every six hours. No ' +
        'persistence of its own. That is why July cost us: the only thing on disk that references ' +
        'it is the miner\'s unit file, so deleting the miner deletes the loader and leaves no ' +
        'trace of what it loaded, and rebuilding from the image puts both back. Memory capture on ' +
        'every one of the twelve before anybody touches anything.',
      commandOptions: [
        { command: "grep -E '\\[deleted\\]|no such file' /evidence/app14/proc-maps.txt", correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/app14/memory.raw | tee /evidence/app14/memory.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status rmg-appcache', ...STATUS_CHECK },
        { command: 'cat /evidence/app14/memory.raw', ...DUMP_ALL },
        { command: 'systemctl restart rmg-appcache', ...MUTATE },
      ],
      commandNudge:
        'Look at what else the miner\'s parent process has mapped, and whether it exists on disk.',
      guidance:
        'You found one thing. Ask what loaded it and what else that thing loaded.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1078.003'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['cloud-security', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'Six service accounts, thirty-four authentications, every source host one of the twelve, ' +
        'starting eight days after the image was pushed. The accounts belong to the pathology ' +
        'interface, the pharmacy stock system and the appointment reminder service, and none of ' +
        'them has any business originating from an application server. What makes this the ' +
        'load-bearing row rather than a curiosity is that the accounts do nothing unusual once ' +
        'authenticated: whoever holds them is using them correctly, which is what somebody does ' +
        'while establishing that a credential works and where it reaches. This is also the ' +
        'evidence that stands on its own if no memory capture exists, and it should be stated that ' +
        'way: credentials are appearing where they cannot have come from unless something on those ' +
        'hosts is collecting them. Resist rotating them on this row. Six passwords unchanged since ' +
        '2024 are embedded in configuration across the estate, and a rotation before anybody knows ' +
        'where breaks systems nobody has listed yet.',
      standIn:
        'Six service accounts, thirty-four authentications, every source host one of our twelve, ' +
        'starting eight days after the image was pushed. Pathology interface, pharmacy stock, ' +
        'appointment reminders, and none of them has any business originating from an application ' +
        'server. They do nothing unusual once in, which is what you do while checking a credential ' +
        'works and seeing how far it goes. Even with no memory capture this says it: credentials ' +
        'are turning up where they cannot have come from unless something on those hosts is ' +
        'collecting them. And nobody rotates anything yet, those passwords are in configuration ' +
        'on sixty other systems.',
      commandOptions: [
        { command: "awk -F, '$4 ~ /^svc-/ {print $4, $5}' /var/log/directory/auth.csv | sort | uniq -c | sort -rn | head -20", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$5 ~ /RMG-APP-/ && $4 ~ /^svc-/ {print $1, $4, $5}' /var/log/directory/auth.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status directory', ...STATUS_CHECK },
        { command: 'cat /var/log/directory/auth.csv', ...DUMP_ALL },
        { command: 'net user svc-pathology /random /domain', ...MUTATE },
      ],
      commandNudge:
        'List which hosts each service account has authenticated from, and flag any that are not ' +
        'its own.',
      guidance:
        'Ask where each service account is supposed to log in from, then check where it did.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1195.002'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.preserve', 'act.chain', 'act.timeline'],
      outOfLaneActions: ['act.reimage-now', 'act.attribute-named', 'act.dismiss', 'act.power-off'],
      escalateTo: ['ir-lead'],
      why:
        'Two systems describe the same remediation and they do not agree, and the difference is the ' +
        'whole of why this is happening twice. The case record says all three hosts were rebuilt ' +
        'from clean image and returned to service, which is what closed the ticket and what any ' +
        'seat reading the queue will believe. The host tells a different story: two were rebuilt ' +
        'on 16 July, and RMG-APP-14 has no rebuild record at all, an install date unchanged from ' +
        '2023, and a shell history entry showing the binary and unit file deleted by hand followed ' +
        'by a service reload. Its disk was never taken. Choose the host, for the ordinary reason: ' +
        'the case record is what somebody wrote afterwards and the install date is what the machine ' +
        'did. And then say the harder half, which is that the two hosts that were rebuilt properly ' +
        'were rebuilt from the compromised image, so the diligent response and the shortcut ' +
        'produced the same outcome by different routes. Nobody on this floor gets to be pleased ' +
        'about that.',
      standIn:
        'The case record and the host disagree. The case says all three rebuilt from clean image, no ' +
        'evidence of onward access, closed. The host says two were rebuilt on 16 July and APP-14 ' +
        'was not: install date unchanged since 2023, and shell history showing the binary and unit ' +
        'file deleted by hand and the service reloaded. Disk never taken. I am taking the host, ' +
        'because the case record is what somebody wrote afterwards and the install date is what the ' +
        'machine did. And the worse half: the two that were rebuilt properly were rebuilt from the ' +
        'compromised image. Doing it right and cutting the corner landed in the same place.',
      commandOptions: [
        { command: 'stat -c "%n %w" /etc/machine-id && grep -i "install" /var/log/build/host-history.csv', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -nE "rm |systemctl (daemon-reload|reload)" /evidence/app14/root-bash-history', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status rmg-appcache', ...STATUS_CHECK },
        { command: 'cat /var/log/cases/RMG-IR-0294.json', ...DUMP_ALL },
        { command: 'rm /evidence/app14/root-bash-history', ...MUTATE },
      ],
      commandNudge:
        'Check the install date and build record of each host against what the July case says was ' +
        'done.',
      guidance:
        'The ticket says the hosts were rebuilt. Ask the hosts.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1195.002'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.scope-estate'],
      outOfLaneActions: ['act.revoke-key', 'act.reimage-now', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The cause, and it makes rebuilding actively harmful rather than merely useless. Tag 4.2 of ' +
        'the internal base image was pushed on 11 July by the build service account, from inside ' +
        'the build network, with no corresponding pipeline run, and it carries one layer more than ' +
        'the pipeline produces. Three facts to keep separate. The layer count is objective and ' +
        'checkable in seconds, and it is the strongest evidence in the incident because it needs no ' +
        'interpretation. The missing pipeline run means the push did not come from the build ' +
        'process even though it came from inside the build network, which narrows the question ' +
        'sharply. And the tag is what every one of the twelve hosts is built from, so the standard ' +
        'remedy of rebuilding from image reinstalls the intrusion, which is precisely what ' +
        'happened to two hosts in July. Scope this before anything else: any host, anywhere, built ' +
        'from 4.2 is affected whether or not it is on tonight\'s list of twelve.',
      standIn:
        'Here is the cause, and it makes rebuilding worse than useless. Tag 4.2 was pushed on 11 ' +
        'July by the build service account from inside the build network with no pipeline run ' +
        'behind it, and it has one layer more than the pipeline produces. The layer count needs no ' +
        'interpretation, which makes it the strongest thing we have. Every one of the twelve is ' +
        'built from that tag, so rebuilding from image reinstalls the intrusion, which is exactly ' +
        'what we did to two hosts in July. First job: find every host anywhere built from 4.2, not ' +
        'just tonight\'s twelve.',
      commandOptions: [
        { command: 'skopeo inspect docker://registry.rmg.internal/rmg/appbase:4.2 | jq \'.Layers | length\'', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"PUSH\" && $4 ~ /appbase/ {print $1, $2, $5}' /var/log/registry/audit.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status registry', ...STATUS_CHECK },
        { command: 'cat /var/log/registry/audit.csv', ...DUMP_ALL },
        { command: 'skopeo delete docker://registry.rmg.internal/rmg/appbase:4.2', ...MUTATE },
      ],
      commandNudge:
        'Compare the layer count of the image tag those hosts run against what the pipeline builds.',
      guidance:
        'All twelve run the same image. Ask where that image came from.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1041', 'T1030'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Ninety-six per cent of the anomalous traffic from these hosts is the mining pool, and it is ' +
        'the four per cent that matters. Forty kilobytes every six hours from each host to ' +
        '203.0.113.188, over HTTPS, at times matching no scheduled job, to an address with no ' +
        'history in the estate before 12 July. On any ordinary night that channel is invisible: it ' +
        'is small, encrypted, regular but infrequent, and nothing about it crosses a threshold. ' +
        'Tonight it is visible only because somebody went looking past the obvious answer, and ' +
        'that is the general lesson worth taking rather than the specific address. A loud channel ' +
        'in the same traffic as a quiet one does not merely distract attention, it consumes the ' +
        'analysis: whoever is summing bytes and ranking destinations sees the pool at the top and ' +
        'stops. Establish the six hour interval carefully, because it matches the flush cadence ' +
        'and is what ties this row to the module.',
      standIn:
        'Ninety-six per cent of the odd traffic is the mining pool and the four per cent is the ' +
        'incident. Forty kilobytes every six hours from each host to an address with no history ' +
        'before 12 July, HTTPS, matching no scheduled job. On a normal night that is invisible: ' +
        'small, encrypted, regular, under every threshold. It is only visible tonight because ' +
        'somebody looked past the obvious answer. A loud channel next to a quiet one does not just ' +
        'distract you, it eats the analysis, because anybody ranking destinations by volume sees ' +
        'the pool and stops. And the six hour interval is the flush cadence, which is what ties ' +
        'this to the module.',
      commandOptions: [
        { command: "awk '$3 ~ /RMG-APP-/ && $5!=\"pool\" {print $1, $3, $5, $8}' /var/log/flows.log | sort -k3", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$5==\"203.0.113.188\" {print $1, $3}' /var/log/flows.log | head -20", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 203.0.113.188', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'netstat -an | grep ESTABLISHED', ...WRONG_TARGET },
      ],
      commandNudge:
        'Take the mining pool traffic out and look at what is left.',
      guidance:
        'Most of the traffic is the miner. Ask what the rest of it is.',
    },
    {
      eventId: 'ev.8',
      verdict: 'ambiguous',
      leaning: 'malicious',
      wouldSettleIt:
        'The disk of RMG-APP-14 as it stood in July, which would show whether the shared object was ' +
        'present before 16 July. It was cleaned by hand and the disk reused, so the artefact no ' +
        'longer exists; the other two hosts were reimaged, which removed the same evidence for a ' +
        'different reason.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.investigate-hold', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.declare', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Whether this is one operation that survived July or two unrelated ones cannot be settled, ' +
        'and the reason is that the evidence was destroyed by the response rather than by the ' +
        'actor. Different wallet, different pool, same deployment route, and that route is ' +
        'described in public tooling documentation used by many unrelated people, so it supports ' +
        'continuity weakly and proves nothing. The artefact that would answer it is the July state ' +
        'of RMG-APP-14, and it is gone: cleaned by hand, disk reused. The two hosts that were ' +
        'handled properly are no better, because reimaging removed the same evidence. Lean toward ' +
        'continuity, because a fresh actor would have to have independently compromised the same ' +
        'registry within days of the first being cleaned, and hold that well short of certainty. ' +
        'What is at stake is the date: if it is one operation the credential collection may run ' +
        'from mid-July rather than 22 July, and the accounts to treat as compromised are a wider ' +
        'set. Say the number and name the missing disk, because a clear statement of what was lost ' +
        'and how is the most useful thing this floor can leave for whoever handles the next one.',
      standIn:
        'I cannot settle whether this is one operation or two, and it is our response that destroyed ' +
        'the evidence, not the actor. Different wallet, different pool, same deployment route, and ' +
        'that route is in public documentation, so it leans continuity and proves nothing. What ' +
        'would answer it is APP-14 as it was in July, and that disk was cleaned by hand and reused. ' +
        'The two we did properly are no better, because reimaging took the same evidence. I lean ' +
        'continuity, because a fresh actor would have had to compromise the same registry within ' +
        'days of the first being cleaned, and I am not going past leaning. What hangs on it is the ' +
        'date and therefore how many accounts we treat as compromised.',
      commandNudge:
        'Work out what would distinguish one operation from two, then find out whether it still ' +
        'exists.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1496'],
      firstResponder: 'threat-intel',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.assess-actor', 'act.predict', 'act.ttp-map'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Forty-one pounds in seven weeks, and the arithmetic is the assessment. Compromising an ' +
        'internal container registry, producing a modified base image that passes as a legitimate ' +
        'tag, and holding that access through a remediation is many days of skilled work by ' +
        'somebody who knew the estate. Nobody does that for forty-one pounds. The comparison ' +
        'strengthens it: commodity mining operations deploy to thousands of hosts opportunistically ' +
        'and do not build supply chain access to reach twelve, because the economics only work at ' +
        'volume. So the mining is not the objective, and once that is stated the rest of the ' +
        'board rearranges around it, which is what this seat is for. Say what follows and what ' +
        'does not. It follows that somebody chose Ridgeline specifically and wanted persistent ' +
        'access to credentials, and that they were content to be found in a way that would produce ' +
        'a satisfying closure. It does not follow that anybody can be named, and the deployment ' +
        'route is public, so there is nothing here to attribute with. The prediction is the useful ' +
        'output: an operation this patient will return through the registry, and the thing to watch ' +
        'is the next tag rather than the next miner.',
      standIn:
        'Forty-one pounds in seven weeks, and that is the assessment. Compromising an internal ' +
        'registry, building an image that passes as a real tag, and holding it through a ' +
        'remediation is days of skilled work by somebody who knows this estate. Nobody does that ' +
        'for forty-one pounds. Commodity miners hit thousands of hosts opportunistically because ' +
        'the economics only work at volume; they do not build supply chain access to reach twelve. ' +
        'So mining is not the objective, somebody chose us, and they were happy to be found in a ' +
        'way that would close cleanly. I am not naming anyone, the route is public. What I will ' +
        'predict is that they come back through the registry, so watch the next tag, not the next ' +
        'miner.',
      commandNudge:
        'Work out what the mining actually earned, then what the delivery would have cost to build.',
    },
    {
      eventId: 'ev.10',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Both reflexes are wrong here and one of them is the July mistake repeated. Rebuilding all ' +
        'twelve redeploys tag 4.2 and reinstalls everything, so the image has to be fixed before ' +
        'any host is touched: rebuild the tag from the pipeline, verify the layer count, and only ' +
        'then rebuild hosts. Rotating the six service accounts immediately is the other reflex, ' +
        'and it is worse than it looks: those passwords are unchanged since 2024 and embedded in ' +
        'configuration on sixty other systems, so rotating before somebody has enumerated where ' +
        'breaks systems nobody has listed, and four of the twelve hosts run the pathology results ' +
        'interface that has no standby. So the order is: cut the exfiltration channel at the ' +
        'perimeter, which stops the collection tonight without touching a host; enumerate every ' +
        'place those six credentials are written down; rebuild the image; then rotate and rebuild ' +
        'together, clinical hosts last and one at a time. Establish the rollback on the perimeter ' +
        'block, and check nothing clinical routes through that address before it goes in. Left ' +
        'undone and stated plainly: the credentials collected since 22 July are already elsewhere, ' +
        'rotation ends the future and does nothing about the past, and until the enumeration is ' +
        'finished nobody knows how many systems those six accounts can reach.',
      standIn:
        'Both reflexes are wrong and one of them is what we did in July. Rebuilding all twelve ' +
        'redeploys 4.2 and reinstalls the lot, so we fix the image first: rebuild the tag from the ' +
        'pipeline, verify the layer count, then touch hosts. And do not rotate those six accounts ' +
        'yet. Unchanged since 2024, embedded in configuration on sixty other systems, and four of ' +
        'these hosts run the pathology results interface with no standby. Order: block the ' +
        'exfiltration address at the perimeter, which stops collection tonight without touching a ' +
        'host; enumerate everywhere those credentials are written; rebuild the image; then rotate ' +
        'and rebuild together, clinical last and one at a time. Rollback written, and check nothing ' +
        'clinical routes through that address first. Left undone: everything collected since 22 ' +
        'July is already gone, and rotation fixes the future only.',
      commandNudge:
        'Find out what rebuilding a host from the current image would actually install.',
    },
    {
      eventId: 'ev.11',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562.001'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Everything fired, and everything that fired fired on the decoy. Processor thresholds, known ' +
        'malicious hashes and mining pool connections all triggered within twenty minutes of the ' +
        'miner starting on 14 July, which by any ordinary measure is excellent coverage and is why ' +
        'the July case closed inside 48 hours with a positive outcome recorded. Nothing covers a ' +
        'service account authenticating from an unexpected host, an image tag gaining a layer, or ' +
        'a small regular outbound transfer, so the entire quiet half of this operation was outside ' +
        'the detection estate for seven weeks. The proposal has to be careful about what it ' +
        'concludes from that, because the tempting version is that the existing detections are bad ' +
        'and they are not: they did their job in twenty minutes. The problem is that the estate ' +
        'detects resource abuse and hashes, which are the cheapest things to detect and the ' +
        'cheapest for an actor to spend. Propose the three that were missing, in order of how ' +
        'cheaply they can be built: image layer count against the pipeline, which is a comparison ' +
        'of two numbers; service account source host against an allow list, which is a join the ' +
        'directory already supports; and small periodic outbound to a first-seen destination, which ' +
        'is the expensive one and should be backtested hard before it is promised.',
      standIn:
        'Everything fired and everything that fired fired on the decoy. Processor thresholds, known ' +
        'hashes and pool connections, all inside twenty minutes on 14 July, which is genuinely good ' +
        'coverage and is exactly why the case closed in 48 hours with a positive outcome. Nothing ' +
        'covers a service account authenticating from the wrong host, an image tag gaining a layer, ' +
        'or a small regular outbound transfer, so the quiet half was outside our detection estate ' +
        'for seven weeks. The existing detections are not bad. The problem is we detect resource ' +
        'abuse and hashes, which are the cheapest things to spot and the cheapest for them to ' +
        'spend. Three proposals, cheapest first: layer count against the pipeline, service account ' +
        'source host against an allow list, and small periodic outbound to a first-seen ' +
        'destination, which I will backtest hard before promising.',
      commandOptions: [
        { command: "awk -F, '{print $3}' /var/log/detection/coverage.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -icE "service.account|image.layer|periodic.outbound" /var/log/detection/coverage.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/coverage.csv', ...DUMP_ALL },
        { command: 'grep -c . /var/log/detection/coverage.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'List what fired in July and what would have had to exist to catch the other half.',
      guidance:
        'The detections worked. Ask what they were watching for, and what they were not.',
    },
    {
      eventId: 'ev.12',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'network-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.reimage-now', 'act.declare'],
      escalateTo: [],
      why:
        'A thirteenth host at 99 per cent since Sunday, arriving at the moment the floor has learned ' +
        'that full load means mining, and it is a genomics job. Five checks close it and every one ' +
        'is a discriminator that appeared earlier tonight: there is a job record with a named ' +
        'submitter and an expected finish, it runs no containers and does not use the compromised ' +
        'image, it holds no connection to any mining pool, and its load profile matches eleven ' +
        'previous runs. Close it. The reason this row exists is that stopping a variant calling job ' +
        'seventy hours into a research protocol is a real cost paid by somebody who did nothing ' +
        'wrong, and a floor that has just been badly burned will reach for the drastic option on ' +
        'every host that looks similar. High utilisation is the symptom the decoy was built to ' +
        'produce, and treating the symptom as the finding is the error the whole scenario is ' +
        'about, in both directions.',
      standIn:
        'Thirteenth host at 99 per cent and it is a genomics job. Job record, named submitter, ' +
        'seventy hour runtime, finishing Wednesday, no containers, does not use the compromised ' +
        'image, no pool connection, and the load profile matches eleven previous runs. Closing it. ' +
        'Killing a variant calling job seventy hours in costs somebody real work, and high ' +
        'utilisation is the exact symptom the decoy was built to produce. Treating the symptom as ' +
        'the finding is the mistake tonight, and it goes both ways.',
      commandOptions: [
        { command: "awk -F, '$2==\"RMG-RES-11\" {print $1, $4, $6}' /var/log/research/scheduler.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"RMG-RES-11\" {print $5}' /var/log/flows.log | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status monitoring', ...STATUS_CHECK },
        { command: 'cat /var/log/research/scheduler.csv', ...DUMP_ALL },
        { command: 'scancel --user=all --partition=genomics', ...MUTATE },
      ],
      commandNudge:
        'Check whether that host runs the compromised image and whether the load has a job record.',
      guidance:
        'It is at full load like the others. Ask what else it has in common with them.',
    },
    {
      eventId: 'ev.13',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.reimage-now', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The readout, and its whole job is to stop the incident being remembered as a mining ' +
        'incident. Twelve hosts run an image carrying a layer nobody added deliberately, pushed on ' +
        '11 July with no pipeline run behind it. That layer delivers a miner and one shared object. ' +
        'Six service accounts with passwords unchanged since 2024 have been used from those hosts ' +
        'since 22 July, and forty kilobytes leaves each host every six hours to an address with no ' +
        'prior history. The mining earned forty-one pounds. State the July finding in the same ' +
        'breath rather than as a footnote: a remediation removed miners from three hosts and the ' +
        'cause from none, and two of those hosts were rebuilt from the compromised image by people ' +
        'doing exactly the right thing. That sentence is the one worth carrying, because it is not ' +
        'about anybody being careless. It is about a response that answered the question the ' +
        'evidence invited, closed on a satisfying outcome, and never asked why an unmodified ' +
        'commodity miner was sitting inside a modified trusted image.',
      standIn:
        'Do not let this be remembered as a mining incident. Twelve hosts run an image with a layer ' +
        'nobody added on purpose, pushed 11 July with no pipeline run behind it, delivering a miner ' +
        'and one shared object. Six service accounts, passwords unchanged since 2024, used from ' +
        'those hosts since 22 July, and forty kilobytes leaving each host every six hours to an ' +
        'address with no history. The mining made forty-one pounds. And July goes in the same ' +
        'sentence, not a footnote: we removed miners from three hosts and the cause from none, and ' +
        'two of those were rebuilt from the compromised image by people doing exactly the right ' +
        'thing. Nobody was careless. We answered the question the evidence invited and never asked ' +
        'why a commodity miner was sitting inside a trusted image.',
      commandNudge:
        'Write the summary somebody reads in six months, and decide what it has to say first.',
    },
  ],
};
