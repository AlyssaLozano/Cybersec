/**
 * Scenario 11: Last Friday.
 *
 * Ransomware, caught in the ninety minutes before it detonates.
 *
 * WHY THE ENCRYPTION IS NOT ON THE BOARD
 *
 * A scenario that opens with files already encrypted teaches nothing except how
 * to write a bad afternoon down. By the time the ransom note appears every
 * decision that mattered has been made by somebody else, hours earlier, and the
 * floor is doing recovery rather than security.
 *
 * So this one runs entirely in the preparation window. Everything on the board
 * happens before detonation: the tooling being staged, the security agent being
 * turned off host by host, the shadow copies going, the account being made. All
 * of it is quiet, all of it is reversible, and the whole hour is worth more than
 * the whole of the day after.
 *
 * THE ONE THAT DECIDES THE OUTCOME
 *
 * `ev.3`. Endpoint protection reporting itself healthy on 340 hosts and absent
 * on eleven is not an alert, it is the absence of alerts, and no rule fires for
 * a thing that stopped happening. Eleven silent agents is the single loudest
 * signal available tonight and it is only visible to somebody who thinks to
 * compare the estate against itself.
 *
 * THE CLOCK
 *
 * Ransomware groups detonate at the worst moment on purpose: Friday evening,
 * public holidays, the start of a long weekend. The situation text says so, and
 * the floor should feel it.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';

const ID = 'last-friday';

export const LAST_FRIDAY: Scenario = {
  id: ID,
  title: 'Last Friday',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 17:10 on the Friday of a bank holiday weekend. Most of the organisation has gone home ' +
    'and the on-call rota is two people until Tuesday. Something has been moving through the ' +
    'estate since about half past three. Nothing is encrypted yet.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'cloud-security',
    'forensics',
    'ir-lead',
    // Threat Intel is deliberately unseated. Everything tonight is host,
    // identity and backup configuration, and the tradecraft question is
    // answered the moment somebody reads the shadow copy deletion correctly.
    // Seating them to fill a chair would give one person an hour of watching
    // somebody else work, which is the failure the per-role event floor exists
    // to prevent. Network stays: they hold the queue rows and are the seat that
    // would catch the staged payload calling out if it runs before 19:00.
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Remote management tool installed on eleven servers in forty minutes',
      detail:
        'A commercial remote access product was installed on eleven servers between 15:32 and ' +
        '16:14. The installer is signed by its vendor and the software is legitimate: the ' +
        'infrastructure team uses a different one, but this product is not blocked. All eleven ' +
        'installs used the same silent install parameters. Rule history: fired 4 times in thirty ' +
        'days, 4 closed as engineer tooling.',
      source: 'multiple servers',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 130,
      surface: 'raw-log',
      summary: 'Domain account created at 15:28 and added to a privileged group',
      detail:
        'An account named svc_backup_admin was created at 15:28 and added to a group holding local ' +
        'administrator rights across the server estate four minutes later. The creating account is ' +
        'a helpdesk administrator whose owner badged out at 14:50 and whose session came from a ' +
        'server rather than their workstation. There is no change ticket.',
      source: 'rmg-dc-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'alert-queue',
      summary: 'Endpoint protection reporting healthy on 340 hosts and absent on eleven',
      detail:
        'The management console shows 340 of 351 servers checking in normally. Eleven have not ' +
        'reported since between 15:40 and 16:20. The console does not raise an alert for an agent ' +
        'that stops reporting: it shows them greyed out on a dashboard nobody watches on a Friday. ' +
        'The eleven are the same eleven from the remote access installs.',
      source: 'endpoint console',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.4',
      atSeconds: 450,
      surface: 'process-tree',
      summary: 'Shadow copy deletion executed across the eleven hosts',
      detail:
        'A command deleting all volume shadow copies ran on each of the eleven servers between ' +
        '16:22 and 16:41, invoked through the newly installed remote access tool. The command is a ' +
        'standard operating system utility. Backup administrators legitimately run it during ' +
        'certain maintenance, though not on eleven servers in nineteen minutes.',
      source: 'multiple servers',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 600,
      surface: 'cloud-audit',
      summary: 'Backup retention policy modified and immutability disabled at 16:48',
      detail:
        'The cloud backup vault had its retention lock removed and retention reduced from 35 days ' +
        'to 1 day at 16:48, called by the svc_backup_admin principal from inside the estate. The ' +
        'change is permitted for that group. No deletion has been requested yet, and the existing ' +
        'restore points remain until the shortened retention expires them.',
      source: 'svc_backup_admin',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 760,
      surface: 'host-artefact',
      summary: 'An unfamiliar executable staged in a shared directory on all eleven hosts',
      detail:
        'A 4.8 MB executable was written to C:\\PerfLogs\\ on each of the eleven servers between ' +
        '16:50 and 17:02, identical hash on every host. It is packed, unsigned, and not present on ' +
        'any other server. It has not been executed. A scheduled task exists on each host set to ' +
        'run it at 19:00.',
      source: 'multiple servers',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Backup job failures on six workstations overnight',
      detail:
        'Six workstation backup jobs failed between 01:00 and 03:00 with a storage timeout. All ' +
        'six are on the same floor switch, which was replaced on Wednesday, and the platform team ' +
        'has an open ticket for intermittent timeouts on that segment. Rule history: fired 140 ' +
        'times in thirty days, 138 closed as infrastructure.',
      source: 'backup service',
      claimedSeverity: 'low',
    },
  ],
};

export const LAST_FRIDAY_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody holding a helpdesk administrator credential created a privileged account at 15:28 and named it to look like backup tooling.',
    'They installed a legitimate, signed commercial remote access product on eleven servers, which gave them a way in that no security tool objects to.',
    'They turned the endpoint protection agent off on those eleven hosts. Nothing alerted, because the console does not raise anything for an agent that goes quiet.',
    'They deleted the volume shadow copies on all eleven, removing local recovery.',
    'They removed the immutability lock on the cloud backup vault and cut retention from 35 days to 1, removing remote recovery.',
    'They staged an identical packed executable on every host with a scheduled task to run it at 19:00, when nobody would be in until Tuesday.',
    'Nothing is encrypted. Every step so far is preparation, all of it is reversible tonight, and none of it will be at 19:01.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1219'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'Signed, legitimate, commercial software that thousands of support desks use. Nothing about ' +
        'the file is wrong and it never will be, which is exactly why this product turns up in ' +
        'ransomware incidents constantly: it is a remote access tool that no security control ' +
        'objects to. The finding is not the software, it is eleven installs in forty minutes with ' +
        'identical silent parameters, on a Friday evening, of a product this organisation does not ' +
        'use. Any one of those alone is explainable. All four at once is not.',
      standIn:
        'Commercial remote access product installed on eleven servers between 15:32 and 16:14, same ' +
        'silent parameters every time. Signed and legitimate. We do not use this product, and it is ' +
        'eleven servers in forty minutes on a Friday. Raising it.',
      commandOptions: [
        'grep -i "installed" /var/log/software/inventory.log | tail -20',
        "awk '/remoteaccess/ {print $1, $5}' /var/log/software/inventory.log",
        'systemctl list-units --type=service | head',
        'ps aux | grep -i remote',
        'cat /etc/software-policy/blocked.conf',
      ],
      commandNudge:
        'Check how many hosts got this and over what period, and whether we use this product.',
      guidance:
        'Legitimate software is still a finding when it appears eleven times in forty minutes on a ' +
        'Friday.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      techniques: ['T1136.002', 'T1098'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'Three independent things are wrong and each is checkable in under a minute. The account is ' +
        'named to look like backup tooling, which is how a new privileged account survives a casual ' +
        'review. It was created by an administrator who badged out thirty-eight minutes earlier, so ' +
        'the person whose credential it is was not in the building. And the session came from a ' +
        'server rather than their workstation, which is not how helpdesk staff work. The badge ' +
        'correlation is the one worth teaching: physical access records are the cheapest way to ' +
        'prove a credential is being used by somebody other than its owner, and almost nobody ' +
        'thinks to pull them.',
      standIn:
        'svc_backup_admin created at 15:28 and given estate-wide local admin four minutes later. ' +
        'Created by a helpdesk administrator who badged out at 14:50, from a server rather than ' +
        'their workstation, with no change ticket. That credential is not being used by its owner.',
      commandOptions: [
        'grep svc_backup_admin /var/log/auth.log',
        "awk '/useradd|net user/ {print $1, $6}' /var/log/audit/audit.log | tail",
        'net group "Server Admins" /domain',
        'grep -i badge /var/log/physical/access.log | tail -20',
        'last -30',
      ],
      commandNudge:
        'Find who created that account, then check where that person was at the time.',
      guidance:
        'A new privileged account has an author. Check whether that person was even in the building.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.reimage-now', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The most important row on the board and the hardest to notice, because it is not an alert. ' +
        'It is an absence: eleven agents stopped reporting and the console does not raise anything ' +
        'for a thing that stopped happening, it just greys them out on a dashboard nobody watches ' +
        'on a Friday. Every security tool in the estate is now blind on precisely the hosts that ' +
        'matter, and that blindness is the reason nothing else will alert tonight. The habit worth ' +
        'building is comparing the estate against itself: 340 healthy and 11 silent is a question, ' +
        'and it is the same eleven as the remote access installs, which no single tool will tell ' +
        'you.',
      standIn:
        'Console shows 340 of 351 servers healthy and eleven not reporting since between 15:40 and ' +
        '16:20. No alert was raised because nothing fires when an agent goes quiet. They are the ' +
        'same eleven that got the remote access tool. We are blind on those hosts.',
      commandOptions: [
        'grep -c "checkin" /var/log/edr/console.log',
        "awk '$4==\"NO_CHECKIN\" {print $2}' /var/log/edr/console.log",
        'systemctl status edr-agent',
        'ping -c1 rmg-srv-14',
        'cat /var/log/edr/console.log | tail -30',
      ],
      commandNudge:
        'Compare how many agents are reporting against how many hosts there are.',
      guidance:
        'Nothing alerts when a tool goes silent. Ask which hosts have STOPPED talking, not which ' +
        'ones are complaining.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1490'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.power-off', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'This is the sentence that names what is coming. Deleting shadow copies has exactly one ' +
        'purpose, which is to stop a machine being restored to how it was an hour ago, and nobody ' +
        'does it as an end in itself. Backup administrators do run this utility during maintenance, ' +
        'so the command is not the finding: eleven servers in nineteen minutes, driven through a ' +
        'remote access tool installed forty minutes earlier, is. From here the floor is no longer ' +
        'investigating a compromise, it is racing a detonation, and the report should say that ' +
        'plainly rather than describing an anomaly.',
      standIn:
        'Shadow copy deletion ran on all eleven servers between 16:22 and 16:41, through the remote ' +
        'access tool they installed. That command exists to stop a restore. This is ransomware ' +
        'preparation and the encryption has not happened yet.',
      commandOptions: [
        'grep -i "vssadmin\\|shadow" /var/log/audit/audit.log',
        "awk '/delete shadows/ {print $1, $3}' /var/log/audit/audit.log",
        'ls -la /var/backups/',
        'systemctl status vss',
        'df -h',
      ],
      commandNudge: 'Work out what deleting those copies actually prevents.',
      guidance:
        'Ask why somebody would remove the ability to roll a machine back. The answer names what ' +
        'happens next.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1490', 'T1485'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.dismiss', 'act.preserve', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The shadow copies were local recovery. This is remote recovery, and taking it out is what ' +
        'turns an expensive weekend into an existential one. Two details decide the response. It ' +
        'was permitted, because the group genuinely holds that right, so nothing was bypassed and ' +
        'nothing will alert. And nothing has been deleted yet: the restore points still exist and ' +
        'will until the shortened retention expires them, which means putting the lock back and ' +
        'restoring retention right now is the single highest-value action available on this floor ' +
        'tonight. Contain the backups before the hosts. Encrypted servers with good backups is a ' +
        'bad week; encrypted servers without them is a different kind of event.',
      standIn:
        'Retention lock removed on the cloud backup vault at 16:48 and retention cut from 35 days to ' +
        '1, by svc_backup_admin, from inside the estate. Permitted for that group so nothing ' +
        'alerted. Nothing has been deleted yet. I am putting the lock back and restoring retention ' +
        'now.',
      commandNudge:
        'Check whether the restore points are actually gone, or only scheduled to expire.',
      guidance:
        'Local recovery is one thing and remote recovery is another. Ask what is left, and how long ' +
        'you have to protect it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1053.005', 'T1027'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'malware-analyst'],
      why:
        'The payload, staged and not yet run, with a scheduled task naming the exact moment: 19:00, ' +
        'on the Friday of a bank holiday, with two people on call until Tuesday. That timing is a ' +
        'deliberate choice about response capacity rather than a coincidence. Identical hash on ' +
        'every host means one operator pushing one tool rather than something spreading, so the ' +
        'eleven are the whole scope unless proven otherwise. And because it has not executed, the ' +
        'floor is in the rarest position in this job: holding the thing before it happens, with a ' +
        'known deadline. Preserve a copy first, because the moment the tasks are removed the ' +
        'evidence tends to go with them.',
      standIn:
        '4.8 MB packed unsigned executable in PerfLogs on all eleven hosts, identical hash, not yet ' +
        'executed. Scheduled task on each set to run it at 19:00. That is one hour and fifty-eight ' +
        'minutes from now, on the Friday of a bank holiday. Copy preserved and sealed.',
      commandNudge:
        'Check whether that file has run yet, and whether anything is scheduled to run it.',
      guidance:
        'Ask whether it has executed. If it has not, find out what is going to execute it and when.',
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
        'Six failed backup jobs on a night when somebody is systematically destroying the ' +
        'organisation ability to recover. It looks like the same story and it is a switch replaced ' +
        'on Wednesday with an open ticket, on workstations rather than servers, 138 of 140 closed ' +
        'the same way this month. Two checks settle it: which hosts, and is there an existing ' +
        'ticket. On a night with a 19:00 deadline the cost of getting this wrong is not a wrong ' +
        'entry in a report, it is minutes spent on workstation backups while the vault retention ' +
        'is still at one day.',
      standIn:
        'Six workstation backup failures overnight, all on the floor switch replaced Wednesday, ' +
        'platform has an open ticket for timeouts on that segment. Workstations, not servers. 138 ' +
        'of 140 this month were the same. Closing it.',
      commandOptions: [
        'grep FAILED /var/log/backup/jobs.log | tail -20',
        "awk '/FAILED/ {print $4}' /var/log/backup/jobs.log | sort | uniq -c",
        'grep -i switch /var/log/platform/tickets.log',
        'ping -c2 rmg-ws-3301',
        'systemctl status backup.timer',
      ],
      commandNudge:
        'Check which hosts those failures are on and whether anybody already has a ticket open.',
      guidance:
        'Backups failing on a night about backups is not automatically related. Check the hosts and ' +
        'the open tickets.',
    },
  ],
};
