/**
 * Scenario 80: Day One.
 *
 * Ardal completed an acquisition last week and connected the acquired network
 * on Monday. Everything started on Monday, which is also when anybody could
 * see anything.
 *
 * WHAT THIS TEACHES
 *
 * That a timeline built from your own telemetry starts when your telemetry
 * starts, and that reading the first thing you observed as the first thing that
 * happened is the commonest error in an inherited estate.
 *
 * Every finding on this board dates to Monday. The natural reading is that
 * connecting the two networks caused this, and it invites a comfortable
 * conclusion that somebody exploited the integration. The alternative reading
 * accounts for the same facts: something has been in the acquired estate for
 * months, and Monday is when Ardal gained the ability to notice it.
 *
 * WHY THE SECOND READING IS HARD TO PROVE
 *
 * The acquired company ran seven days of log retention, replaced its endpoint
 * tooling during the sale process, and decommissioned two domain controllers in
 * a pre-sale tidy-up. None of that was concealment: it is what a small IT team
 * does before a transaction, on advice, and it has removed exactly the evidence
 * that would date this.
 *
 * AND THE DECISION UNDERNEATH IT
 *
 * Disconnecting is available and ends the thing the acquisition was for. The
 * business case is the integration, the integration started on Monday, and the
 * people asking whether to pull it are the people who signed the deal.
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

const ID = 'day-one';

export const DAY_ONE: Scenario = {
  id: ID,
  title: 'Day One',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 16:00 on Thursday at Ardal Freight. The haulier acquired last month was connected to the ' +
    'network on Monday. Since Monday there has been activity nobody can account for, and nobody ' +
    'can see anything from before Monday.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
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
      summary: 'Authentication from the acquired estate against Ardal systems',
      detail:
        'Since Monday 09:20, accounts from the acquired company domain have authenticated to seven ' +
        'Ardal systems including the freight scheduling platform. The trust between the two ' +
        'directories was established on Monday morning as the first integration step, and 340 ' +
        'acquired staff are expected to reach Ardal systems. Rule history: this rule was created on ' +
        'Monday and has fired 900 times, all of them since.',
      source: 'directory',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'raw-log',
      summary: 'One of those accounts belongs to nobody',
      detail:
        'Of 340 acquired accounts, 339 map to a person in the acquired payroll extract. The ' +
        'three-hundred-and-fortieth, ops_backup, maps to nobody, is in the acquired domain ' +
        'administrators group, and has authenticated to four Ardal systems since Monday. The ' +
        'acquired IT manager says it predates him and he assumed it belonged to the backup product.',
      expertDetail:
        'The acquired security platform reports no findings for ops_backup and no alerts of any ' +
        'kind in its retained window. Its dashboard shows a clean estate. Retention on that ' +
        'platform is seven days and it was installed during the sale process in July, replacing the ' +
        'previous product.',
      expertAlsoOn: ['alert-queue'],
      source: 'ops_backup',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 340,
      surface: 'network-flow',
      summary: 'Everything visible starts on Monday, including the things that cannot have',
      detail:
        'Ardal network monitoring shows the first traffic from the acquired ranges at 09:20 Monday, ' +
        'which is when the link was enabled. Within four minutes of that, a host in the acquired ' +
        'estate connected outbound to 198.51.100.240 and has held or re-established that connection ' +
        'every 30 minutes since. Four minutes is not enough time to compromise a host, establish ' +
        'persistence and configure a beacon.',
      source: 'acquired estate',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 520,
      surface: 'host-artefact',
      withheldAtExpert: true,
      summary: 'The scheduled task on that host was created in March',
      detail:
        'The beaconing process on ACQ-SRV-04 runs from a scheduled task whose registry key carries ' +
        'a creation timestamp of 14 March, seven weeks before the acquisition was announced and ' +
        'four months before it completed. The binary it launches has a compile timestamp from ' +
        'February. Neither field is authoritative on its own and both agree.',
      source: 'ACQ-SRV-04',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 700,
      surface: 'raw-log',
      summary: 'The evidence that would date this was tidied away before the sale',
      detail:
        'The acquired company retained seven days of logs. Its endpoint product was replaced in ' +
        'July during the sale process, and the previous product\'s data was not migrated. Two ' +
        'domain controllers were decommissioned in June as part of a pre-sale estate tidy-up ' +
        'recommended by their advisers, and their disks were wiped and the hardware returned to ' +
        'lease. None of this was unusual and all of it is documented in the transaction file.',
      source: 'acquired estate',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 880,
      surface: 'cloud-audit',
      summary: 'Due diligence asked, and got an answer that was true',
      detail:
        'The technical due diligence questionnaire asked whether the company had experienced a ' +
        'security incident in the preceding 24 months. The answer given was no. The acquired IT ' +
        'manager confirms he answered honestly and that nothing was ever detected. With seven day ' +
        'retention, no endpoint product before July, and no security monitoring function, there was ' +
        'no mechanism by which anything would have been.',
      source: 'transaction file',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 1060,
      surface: 'alert-queue',
      expertOnly: true,
      summary: 'Whether this predates the acquisition cannot be settled',
      detail:
        'Two readings account for every observation. Something was in the acquired estate before ' +
        'the sale and became visible on Monday, or something entered through the new trust on ' +
        'Monday and the artefacts are backdated, which is trivial for anybody with administrative ' +
        'access. The artefacts agree with each other and both are attacker-writable. The logs that ' +
        'would settle it were destroyed by routine pre-sale activity, and the two decommissioned ' +
        'domain controllers are on lease return with their disks wiped.',
      source: 'incident assessment',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1240,
      surface: 'alert-queue',
      summary: 'The integration is the reason the company was bought',
      detail:
        'The acquisition business case is consolidation of the two scheduling operations, which ' +
        'requires the directory trust and started on Monday. Severing it strands 340 staff, stops ' +
        'the consolidated scheduling run, and is a board-level reversal of a completed transaction. ' +
        'The acquired estate has no endpoint agent Ardal can use, no log forwarding, and 41 servers ' +
        'nobody at Ardal has ever logged into.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1420,
      surface: 'raw-log',
      summary: 'Ardal has no visibility into the estate it now owns',
      detail:
        'The acquired estate forwards no logs to Ardal, runs a different endpoint product with its ' +
        'own console that three Ardal staff have accounts on, and is not in the Ardal asset ' +
        'register, the vulnerability scanning scope or the patching schedule. Everything known ' +
        'about it since Monday has come from Ardal network monitoring watching the link, which sees ' +
        'traffic crossing the boundary and nothing inside.',
      source: 'detection coverage',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1600,
      surface: 'network-flow',
      summary: 'A second unexplained destination from the acquired ranges',
      detail:
        'Hosts in the acquired estate also connect to 203.0.113.15 on a fifteen minute cycle, ' +
        'transferring 2 to 4 kilobytes each time. The address belongs to the remote monitoring ' +
        'platform of the acquired company\'s outsourced IT provider, whose contract is in the ' +
        'transaction file, runs until December, and covers 38 of the 41 servers. The cycle matches ' +
        'the documented agent check-in interval.',
      source: 'acquired estate',
      claimedSeverity: 'medium',
    },
  ],
};

export const DAY_ONE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Ardal completed the acquisition of a regional haulier last month and established a directory trust on Monday at 09:20 as the first integration step, because consolidating the two scheduling operations is the business case for the purchase.',
    'Within four minutes of the link being enabled, a host in the acquired estate connected outbound to 198.51.100.240 and has re-established that connection every thirty minutes since. Four minutes is not enough time to compromise a host, establish persistence and configure a beacon.',
    'The scheduled task running that beacon on ACQ-SRV-04 carries a registry creation timestamp of 14 March, seven weeks before the acquisition was announced, and the binary it launches has a February compile timestamp. Both fields agree and both are writable by anybody with administrative access.',
    'An account named ops_backup exists in the acquired domain administrators group, maps to nobody in the payroll extract, and has authenticated to four Ardal systems since Monday.',
    'The acquired company retained seven days of logs, replaced its endpoint product in July during the sale without migrating the old data, and decommissioned two domain controllers in June in a pre-sale tidy-up recommended by its advisers, with the disks wiped and the hardware returned to lease.',
    'Due diligence asked whether there had been a security incident in 24 months and was told no. That answer was given honestly and was true as far as anybody could know, because with seven day retention, no endpoint product before July and no monitoring function, there was no mechanism by which anything would have been detected.',
    'So everything observable dates to Monday, and Monday is when Ardal gained the ability to observe anything at all.',
    'Whether this predates the acquisition is not established and cannot be, because the records that would settle it were destroyed by routine activity nobody can be criticised for.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.attribute-named', 'act.tune'],
      escalateTo: ['log-analyst', 'cloud-security'],
      why:
        'Nine hundred firings since Monday from a rule created on Monday, covering 340 people who ' +
        'are supposed to be reaching these systems. Most of this is the integration working. The ' +
        'trap on this row is the rule history, which reads as an explosion of activity and is ' +
        'actually a rule with no baseline: it has never seen a normal day, so it cannot tell ' +
        'anybody what an abnormal one looks like, and a floor treating 900 as a signal is reading ' +
        'the age of a detection rather than the behaviour of an estate. What is worth doing ' +
        'immediately is the one thing that does not need a baseline, which is checking that the 340 ' +
        'accounts are 340 people. Raise it and hold it, and do not isolate anything: the newly ' +
        'connected estate is the acquisition, and cutting it on the first alert of the week is a ' +
        'board-level action taken by a queue.',
      standIn:
        'Nine hundred firings since Monday from a rule that was created on Monday, covering 340 ' +
        'people who are meant to be reaching these systems. That number is the age of the rule, not ' +
        'a signal: it has never seen a normal day so it cannot tell us what an abnormal one looks ' +
        'like. The thing that needs no baseline is checking whether 340 accounts are 340 people. ' +
        'Raising it, holding it, isolating nothing, because cutting the estate we just bought is ' +
        'not a decision a queue makes.',
      commandOptions: [
        { command: "awk -F, '$4 ~ /ACQ/ {print $2}' /var/log/directory/auth.csv | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4 ~ /ACQ/ {print $5}' /var/log/directory/auth.csv | sort | uniq -c | sort -rn | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status directory', ...STATUS_CHECK },
        { command: 'cat /var/log/directory/auth.csv', ...DUMP_ALL },
        { command: 'iptables -A FORWARD -s 10.60.0.0/16 -j DROP', ...MUTATE },
      ],
      commandNudge:
        'Count the distinct acquired accounts and compare that against how many people were ' +
        'acquired.',
      guidance:
        'The rule is new. Ask what it has to compare against.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1078.002'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['cloud-security', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['fusion-analyst', 'ir-lead'],
      why:
        'Three hundred and thirty-nine of 340 accounts map to a person in the payroll extract, and ' +
        'the odd one out is a domain administrator that maps to nobody and has reached four Ardal ' +
        'systems since Monday. The join against payroll is the whole technique and it needs no ' +
        'security tooling at all, which matters on an estate that has none: two lists and a ' +
        'comparison. The acquired IT manager saying it predates him and that he assumed it belonged ' +
        'to the backup product is the most ordinary explanation there is for an account like this ' +
        'and is probably true of how it survived, and it is not evidence about what it is now. ' +
        'Notice the disagreement arriving alongside it: the acquired security platform reports a ' +
        'clean estate and no findings for this account. That platform has seven days of retention ' +
        'and was installed in July, so a clean dashboard is a statement about one week and not ' +
        'about a history, and anybody quoting it as reassurance is quoting an instrument that ' +
        'cannot see the period in question.',
      standIn:
        'Three hundred and thirty-nine of the 340 map to a person in payroll. The odd one out is a ' +
        'domain administrator that maps to nobody and has reached four of our systems since Monday. ' +
        'Two lists and a comparison, no tooling needed, which matters because they have none. Their ' +
        'IT manager says it predates him and he assumed it was the backup product, which is ' +
        'probably how it survived and says nothing about what it is now. And their security ' +
        'platform says the estate is clean, with seven days of retention on a product installed in ' +
        'July. That is a statement about one week.',
      commandOptions: [
        { command: "comm -23 <(awk -F, '{print $2}' /evidence/acq/domain-accounts.csv | sort) <(awk -F, '{print $2}' /evidence/acq/payroll.csv | sort)", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "ops_backup" /evidence/acq/domain-groups.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status directory', ...STATUS_CHECK },
        { command: 'cat /evidence/acq/domain-accounts.csv', ...DUMP_ALL },
        { command: 'net user ops_backup /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Join the acquired account list against the acquired payroll list and look at what is left.',
      guidance:
        'You have 340 accounts. Ask whether you have 340 people.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'command-and-control',
      critical: true,
      techniques: ['T1071.001'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'A beacon on a thirty minute cycle, first seen four minutes after the link was enabled, and ' +
        'the four minutes are the finding. Everything about the timing invites the conclusion that ' +
        'connecting the networks caused this, and four minutes is not enough time for anybody to ' +
        'compromise a host, establish persistence and configure a beacon on a schedule. What ' +
        'happened at 09:20 on Monday is not that this started, it is that Ardal could see it: ' +
        'network monitoring watches the link, the link did not exist before Monday, and a timeline ' +
        'assembled from that telemetry begins when the telemetry begins. Say that explicitly and ' +
        'early, because every date on this board will otherwise be read as a start date, and the ' +
        'difference between "this began on Monday" and "we could first see it on Monday" is the ' +
        'difference between an integration failure and an inherited compromise.',
      standIn:
        'Beacon every thirty minutes, first seen four minutes after we enabled the link. Those four ' +
        'minutes are the point. Nobody compromises a host, sets up persistence and configures a ' +
        'scheduled beacon in four minutes. What happened at 09:20 is not that this started, it is ' +
        'that we could see it, because our monitoring watches the link and the link did not exist ' +
        'before Monday. Every date on this board is going to get read as a start date and they are ' +
        'all observation dates.',
      commandOptions: [
        { command: "awk '$5==\"198.51.100.240\" {print $1, $3}' /var/log/flows.log | head -20", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$5==\"198.51.100.240\" {print $1}' /var/log/flows.log | awk -F: '{print $2}' | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 198.51.100.240', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find when the beacon first appeared, then work out how long after the link opened that was.',
      guidance:
        'Everything starts on Monday. Ask what else started on Monday.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1053.005'],
      firstResponder: 'forensics',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'A registry creation timestamp of 14 March and a February compile timestamp, seven weeks ' +
        'before the acquisition was even announced. That is the strongest available support for the ' +
        'inherited reading and it has to be carried carefully, because neither field is ' +
        'authoritative: both are writable by anybody with administrative access, and an intruder ' +
        'who wanted this to look pre-existing would set exactly these two values to exactly this ' +
        'kind of date. The fact that they agree with each other is worth something and is not ' +
        'proof, since somebody setting one would set the other. So the honest report is that two ' +
        'independent-looking artefacts both place this in March, that both are attacker-writable, ' +
        'and that this is corroboration rather than a date. Preserve the host properly and by a ' +
        'route Ardal controls, because it is one of 41 servers nobody at Ardal has ever logged into ' +
        'and the acquired estate has no tooling that would preserve anything.',
      standIn:
        'Registry creation says 14 March and the binary compiles to February, which is seven weeks ' +
        'before the acquisition was announced. That is the best support we have for this being ' +
        'inherited and I am not going to overstate it: both fields are writable by anybody with ' +
        'admin, and somebody wanting this to look pre-existing would set exactly those two to ' +
        'exactly that kind of date. Them agreeing is worth something and is not proof, because ' +
        'whoever set one would set the other. Corroboration, not a date. Preserving that host our ' +
        'way, because they have nothing that would.',
      commandOptions: [
        { command: 'reg query "HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\Schedule\\\\TaskCache\\\\Tree" /s /t REG_BINARY | head -20', correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/acqsrv04/task-binary.exe | tee /evidence/acqsrv04/binary.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status schtasks', ...STATUS_CHECK },
        { command: 'cat /evidence/acqsrv04/task-export.xml', ...DUMP_ALL },
        { command: 'schtasks /delete /tn BackupMaintenance /f', ...MUTATE },
      ],
      commandNudge:
        'Find when the persistence was created, and then ask who is able to write that field.',
      guidance:
        'You have a timestamp. Ask whether it can be set.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Every record that would date this was destroyed by ordinary activity, and none of it was ' +
        'concealment. Seven days of log retention is what a company that size runs. Replacing the ' +
        'endpoint product in July without migrating the old data is what happens when a contract ' +
        'ends during a sale. Decommissioning two domain controllers in June, wiping the disks and ' +
        'returning the hardware to lease is what advisers tell a company to do before a ' +
        'transaction, and it is documented in the transaction file. There is nobody to accuse and ' +
        'that is exactly the point worth landing: an estate can arrive with its history already ' +
        'gone, through decisions each of which was sensible, and a floor looking for who destroyed ' +
        'the evidence will find a list of reasonable people. What follows for the rest of the hour ' +
        'is that no amount of further work recovers the period before July, so the question of when ' +
        'this started has to be answered with what exists or declared unanswerable.',
      standIn:
        'Everything that would date this is gone and none of it was hidden. Seven day retention is ' +
        'normal for a company that size. The endpoint product was replaced in July when the ' +
        'contract ended during the sale, old data not migrated. Two domain controllers ' +
        'decommissioned in June, disks wiped, hardware back to lease, on their advisers\' ' +
        'recommendation, and it is all in the transaction file. Nobody to accuse. An estate can ' +
        'arrive with its history already gone through a series of sensible decisions, and no ' +
        'further work recovers anything before July.',
      commandOptions: [
        { command: 'grep -iE "retention|decommission|migrat" /evidence/transaction/it-annex.txt', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"DECOMMISSION\" {print $1, $2}' /evidence/acq/asset-changes.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem', ...STATUS_CHECK },
        { command: 'cat /evidence/transaction/it-annex.txt', ...DUMP_ALL },
        { command: 'grep -c . /evidence/acq/asset-changes.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what logs the acquired company kept and what happened to its old systems.',
      guidance:
        'You want to know when this started. Ask what records exist from then.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.notify-legal', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Due diligence asked the right question and got a true answer that meant nothing. Had there ' +
        'been a security incident in 24 months: no. The IT manager answered honestly and was ' +
        'correct as far as anybody could know, because with seven day retention, no endpoint ' +
        'product before July and no monitoring function, there was no mechanism by which an ' +
        'incident would have been detected. A negative answer from an organisation with no ' +
        'detection capability carries no information at all, and this is the row where somebody ' +
        'will want to conclude that the seller misrepresented something. Do not, and say why ' +
        'plainly, because it is going to come up with lawyers in the room: the answer is not false ' +
        'and the question was the wrong one. What due diligence needed to ask is what would have ' +
        'happened if there had been an incident, and that question has an answer that would have ' +
        'been visible before the transaction closed.',
      standIn:
        'Due diligence asked whether there had been an incident in 24 months and was told no. That ' +
        'answer is honest and it is worthless: seven day retention, no endpoint product before ' +
        'July, no monitoring function, so there was no way anything would have been detected. A no ' +
        'from an organisation with no detection capability contains no information. Somebody is ' +
        'going to want to say they misrepresented this and I would not, because the answer is true ' +
        'and the question was wrong. What we should have asked is what would have happened if there ' +
        'had been one, and we could have known that before closing.',
      commandOptions: [
        { command: 'grep -inA3 "security incident" /evidence/transaction/dd-questionnaire.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -icE "monitoring|SOC|detection" /evidence/transaction/dd-questionnaire.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem', ...STATUS_CHECK },
        { command: 'cat /evidence/transaction/dd-questionnaire.txt', ...DUMP_ALL },
        { command: 'grep -c . /evidence/transaction/dd-questionnaire.txt', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read what due diligence asked, then ask whether they had any way to answer it.',
      guidance:
        'They said there had been no incident. Ask how they would have known.',
    },
    {
      eventId: 'ev.7',
      verdict: 'ambiguous',
      leaning: 'malicious',
      wouldSettleIt:
        'Authentication and endpoint records from the acquired estate for March, which would show ' +
        'whether ACQ-SRV-04 was beaconing before the acquisition. Seven day retention means the ' +
        'logs never existed by now, the previous endpoint product\'s data was not migrated in July, ' +
        'and the two domain controllers that held the authentication history were wiped and ' +
        'returned to lease in June.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.declare', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The question everybody wants answered and it is not answerable. Two readings account for ' +
        'every observation: something was in the acquired estate before the sale and became ' +
        'visible on Monday, or something entered through the new trust on Monday and the artefacts ' +
        'are backdated. Lean toward inherited, and be specific about why rather than gesturing at ' +
        'the timestamps: four minutes between the link opening and an established beacon is not ' +
        'enough time to do the work, and an account sitting in the domain administrators group ' +
        'mapping to nobody is not something created on Monday morning. Hold that well short of ' +
        'certainty, because both artefacts supporting March are attacker-writable and somebody who ' +
        'wanted this to look inherited would produce exactly this evidence. What settles it does ' +
        'not exist and will not: the logs expired, the endpoint data was not migrated, the domain ' +
        'controllers are wiped and off lease. Say which document would have answered it and where ' +
        'it went, because that sentence is what turns an argument into a finding about due ' +
        'diligence, and note what rides on it: if this is inherited the scope is an estate Ardal ' +
        'now owns and cannot see, and if it is not, the trust established on Monday is the entry ' +
        'point and the scope is Ardal.',
      standIn:
        'This is the question everybody wants and I cannot answer it. Either something was in there ' +
        'before the sale and became visible on Monday, or something came through the new trust on ' +
        'Monday and backdated the artefacts. I lean inherited, and not because of the timestamps: ' +
        'four minutes is not enough to compromise a host and stand up a beacon, and a domain admin ' +
        'account mapping to nobody was not created on Monday morning. Not going past leaning, ' +
        'because both March artefacts are attacker-writable and somebody wanting this to look ' +
        'inherited produces exactly this. What would settle it expired, was not migrated, or went ' +
        'back on lease. And it matters which: inherited means the scope is an estate we own and ' +
        'cannot see. The other way, the scope is us.',
      commandNudge:
        'Write down both readings, then find what evidence would separate them and where it went.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'lateral-movement',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'Severing the trust is available, contains this completely, and undoes a completed ' +
        'transaction. It strands 340 staff, stops the consolidated scheduling run, and is a ' +
        'board-level reversal of the thing the company was bought for, so it is a decision to ' +
        'recommend rather than to take, with the cost stated so the board can weigh it. What can ' +
        'be done tonight without anybody signing anything is narrower and does most of the work: ' +
        'disable ops_backup, which is one account that maps to nobody and belongs to no process ' +
        'anybody can name, and block 198.51.100.240 at the Ardal perimeter, which is the only ' +
        'egress path the acquired estate now has. That leaves 339 real people working and the ' +
        'integration running. Then the compensating control for the actual problem, which is not ' +
        'the beacon: Ardal owns 41 servers it cannot see, so the trust should be narrowed from ' +
        'whole-domain to the specific systems the scheduling consolidation needs, which is a ' +
        'change the integration can absorb and which bounds tomorrow. Establish the rollback ' +
        'before touching the trust, because a directory change at 16:00 on a Thursday that ' +
        'strands 340 people is the outage everybody remembers. Deliberately left undone and said ' +
        'plainly: 41 servers stay unmonitored tonight, nobody knows what else is on them, and ' +
        'blocking one address does not remove whatever is calling it.',
      standIn:
        'Cutting the trust contains this completely and undoes the transaction: 340 people stranded, ' +
        'consolidated scheduling stops, board-level reversal. I recommend it with the cost attached ' +
        'and I do not take it. Tonight, without anybody signing anything: disable ops_backup, which ' +
        'maps to nobody and belongs to no process anybody can name, and block that address at our ' +
        'perimeter, which is their only egress now. That leaves 339 real people working. Then the ' +
        'real fix, which is not the beacon: we own 41 servers we cannot see, so narrow the trust ' +
        'from whole-domain to the systems scheduling actually needs. Rollback written before we ' +
        'touch a directory at four on a Thursday. Left undone: 41 unmonitored servers, nobody knows ' +
        'what else is on them, and blocking an address does not remove what is calling it.',
      commandNudge:
        'Find the narrowest action that stops tonight without reversing the acquisition.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.scope-estate'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Ardal owns 41 servers it has never logged into, that forward no logs, run a different ' +
        'endpoint product, and appear in no asset register, scanning scope or patching schedule. ' +
        'Everything known since Monday came from watching the link, which sees traffic crossing the ' +
        'boundary and nothing at all inside, and that is why the only findings on this board are ' +
        'about egress: it is the only thing visible. The proposal has to be honest that this is not ' +
        'a detection gap to be closed with a rule, because there is no telemetry for a rule to read, ' +
        'and onboarding 41 servers into agents, logging and scanning is weeks of work that has to ' +
        'start being scheduled rather than discussed. What can be done immediately is to treat the ' +
        'boundary as the only sensor there is and instrument it properly: every destination the ' +
        'acquired ranges reach, baselined from today, alerting on anything new. That is a poor ' +
        'substitute for seeing inside and it is available tonight. Say the general lesson for the ' +
        'next acquisition, because there will be one: the integration connected the networks on ' +
        'day one and the visibility work had no date at all, and reversing that order is the ' +
        'finding.',
      standIn:
        'We own 41 servers we have never logged into. No log forwarding, different endpoint product, ' +
        'not in the asset register, the scanning scope or the patching schedule. Everything we know ' +
        'since Monday came from watching the link, which sees the boundary and nothing inside, ' +
        'which is why every finding here is about egress. That is not a gap a rule fixes, because ' +
        'there is no telemetry to read. Onboarding 41 servers is weeks and needs scheduling, not ' +
        'discussing. Tonight: treat the boundary as the only sensor we have, baseline every ' +
        'destination those ranges reach from today, alert on anything new. And for the next ' +
        'acquisition, because there will be one: the networks were connected on day one and the ' +
        'visibility work had no date.',
      commandOptions: [
        { command: "comm -13 <(awk -F, '{print $1}' /var/log/assets/register.csv | sort) <(awk -F, '{print $1}' /evidence/acq/server-list.csv | sort)", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3 ~ /^10\\.60\\./ {print $5}' /var/log/flows.log | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem', ...STATUS_CHECK },
        { command: 'cat /evidence/acq/server-list.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/acq/server-list.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Work out what telemetry exists for the acquired estate before proposing anything to read ' +
        'it.',
      guidance:
        'Everything you know came from one place. Ask what that place can see.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['soc-operator', 'cloud-security'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.contact-attacker', 'act.declare'],
      escalateTo: [],
      why:
        'A second periodic outbound destination from the acquired ranges, on the day the floor has ' +
        'learned that periodic outbound from the acquired ranges is a beacon, and it is the ' +
        'outsourced IT provider\'s remote monitoring platform. Four checks close it: the contract ' +
        'is in the transaction file, it runs until December, it covers 38 of the 41 servers, and ' +
        'the fifteen minute cycle matches the documented agent check-in interval. Close it, and ' +
        'notice which document did the work, because it is not one a SOC normally reads: the ' +
        'answer was in the transaction file rather than in any log, and on an inherited estate ' +
        'with no telemetry the contracts are frequently the best source of truth about what is ' +
        'supposed to be talking to what. Worth adding one thing to the readout rather than simply ' +
        'closing it: 38 of 41 servers are administered by a third party under a contract that runs ' +
        'until December, which means somebody outside Ardal has remote access to most of the ' +
        'estate this incident is happening in, and that is not tonight\'s finding but nobody should ' +
        'hear it for the first time next week.',
      standIn:
        'Second periodic outbound from the acquired ranges and it is their outsourced IT provider\'s ' +
        'monitoring platform. Contract is in the transaction file, runs to December, covers 38 of ' +
        'the 41 servers, and the fifteen minute cycle matches the documented check-in. Closing it. ' +
        'Note where the answer came from: the transaction file, not a log, because on an estate ' +
        'with no telemetry the contracts are the best source of truth about what should be talking ' +
        'to what. And one thing for the readout: 38 of 41 servers are administered by a third party ' +
        'until December, so somebody outside Ardal has remote access to most of the estate this is ' +
        'happening in. Not tonight\'s finding, but nobody should hear it first next week.',
      commandOptions: [
        { command: 'grep -inA4 "remote monitoring\\|managed service" /evidence/transaction/it-annex.txt', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$5==\"203.0.113.15\" {print $1}' /var/log/flows.log | awk -F: '{print $2}' | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status monitoring', ...STATUS_CHECK },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'nmap -Pn 203.0.113.15', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check the transaction file for a managed service contract before treating it as unknown.',
      guidance:
        'Another regular outbound connection. Ask whether somebody is paid to make it.',
    },
  ],
};
