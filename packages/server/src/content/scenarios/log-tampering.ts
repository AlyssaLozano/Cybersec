/**
 * Scenario 54: Nothing Happened At Two.
 *
 * Forty minutes are missing from a domain controller's security log, and what
 * survives on either side of the hole names a colleague.
 *
 * WHAT THIS TEACHES
 *
 * That evidence can be placed, and that the tell is usually physical rather
 * than digital.
 *
 * The log records run continuously across the gap. The timestamps are tidy, the
 * sequence reads normally, and a floor that reads timestamps sees nothing
 * wrong. What does not run continuously is the record identifier, which the
 * writing service increments and nothing later can renumber: it steps by 2,847
 * across forty minutes that contain no events. Records were removed and the
 * remainder was made to look whole.
 *
 * WHY THAT MATTERS LESS THAN WHAT WAS LEFT
 *
 * Somebody who removes records and leaves it at that has hidden something.
 * Somebody who removes records and leaves a trail pointing at a named
 * administrator has done something else, and the second thing is what this
 * floor is at risk of finishing for them.
 *
 * The trail is good. It is also impossible: the workstation those actions came
 * from was handed back to IT on Friday afternoon, wiped, and spent the weekend
 * in a locked cage. Digitally the evidence is clean. Physically it cannot have
 * happened, and no amount of log analysis surfaces that. Somebody has to think
 * to ask where the machine actually was.
 *
 * WHAT THE HOUR IS FOR
 *
 * Not an arrest. The output is a retraction: HR are to be briefed at 08:30
 * about an administrator against whom the evidence is fabricated, and stopping
 * that briefing is the most valuable thing the floor does all night. Naming who
 * fabricated it narrows to three accounts and stops, and one of the three is
 * the person the evidence points at.
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
  WRONG_TARGET,
} from './distractors.js';

const ID = 'nothing-happened-at-two';

export const NOTHING_HAPPENED_AT_TWO: Scenario = {
  id: ID,
  title: 'Nothing Happened At Two',
  difficulty: 'advanced',
  durationMinutes: 75,
  situation:
    'It is 22:00 on Sunday at Ardal Freight. A domain controller reported no security events for ' +
    'forty minutes early on Saturday morning. HR have a meeting booked for 08:30 tomorrow.',
  roles: [
    'soc-operator',
    'log-analyst',
    'forensics',
    'cloud-security',
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
      summary: 'ADF-DC-02 reported no security events between 02:10 and 02:50 on Saturday',
      detail:
        'The monitoring platform recorded zero security events from ADF-DC-02 for forty minutes ' +
        'from 02:10 on Saturday. The host averages around 900 security events an hour overnight ' +
        'and reported normally either side. The host did not reboot, the forwarding agent did not ' +
        'restart, and no maintenance window covers Saturday. Rule history: fired 31 times in ' +
        'thirty days, 29 closed as patching reboots.',
      source: 'ADF-DC-02',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 180,
      surface: 'raw-log',
      summary: 'Record identifiers step by 2,847 across a gap that contains no time',
      detail:
        'The security log on ADF-DC-02 runs continuously by timestamp across 02:10 to 02:50 with ' +
        'no visible discontinuity. The record identifier, which the logging service assigns on ' +
        'write and which nothing downstream can renumber, is 55,204,113 at 02:09:58 and ' +
        '55,206,960 at 02:50:04. Two thousand eight hundred and forty-seven records are ' +
        'unaccounted for, and the timestamps on either side were adjusted so the remainder reads ' +
        'as unbroken.',
      source: 'ADF-DC-02',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 340,
      surface: 'raw-log',
      summary: 'The records either side of the gap name a senior administrator',
      detail:
        'The last record before the gap and the first four after it show m.rooke, a senior ' +
        'infrastructure administrator, adding a service account to Domain Admins and removing it ' +
        'eleven minutes later. The records carry a workstation name, ADF-WS-0413, and a full ' +
        'authentication chain. They are the only surviving records in a two-hour window that name ' +
        'any human account at all.',
      source: 'm.rooke',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 520,
      surface: 'host-artefact',
      summary: 'ADF-WS-0413 was handed back to IT on Friday and spent the weekend in a cage',
      detail:
        'The asset store holds a signed return note for ADF-WS-0413 dated Friday 15:50, a wipe log ' +
        'timestamped Friday 16:40 showing the disk overwritten and the machine powered down, and a ' +
        'cage entry showing it racked in the locked spares cage at 16:55. The cage door reader ' +
        'records no entries between Friday 17:12 and Monday 06:40. The machine was off, empty and ' +
        'behind a locked door for the whole of Saturday.',
      source: 'ADF-WS-0413',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 700,
      surface: 'cloud-audit',
      summary: 'The asset record for that workstation was edited at 03:12 on Saturday',
      detail:
        'The asset management system records an edit to the ADF-WS-0413 record at 03:12 on ' +
        'Saturday, twenty-two minutes after the log gap closed, changing its assignment status ' +
        'from RETURNED back to ASSIGNED: M.ROOKE. The edit was made through the administrative API ' +
        'using the shared automation credential svc-assetsync. The change made the workstation ' +
        'name in the security log resolve to a person again.',
      source: 'asset management',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 880,
      surface: 'raw-log',
      summary: 'The forwarded copy is sampled, and the three minutes that survived disagree',
      detail:
        'ADF-DC-02 forwards to the SIEM, but retention on forwarded domain controller logs was cut ' +
        'in March to a five-minute sample every hour to hold the ingest bill down. Three minutes ' +
        'of the affected window survive in that sample, from 02:04 to 02:07. They contain ordinary ' +
        'machine authentication and one log service configuration change at 02:04:31, six minutes ' +
        'before the gap on the host claims to begin.',
      source: 'SIEM',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 1040,
      surface: 'alert-queue',
      summary: 'Three accounts can edit both the security log and the asset record',
      detail:
        'Doing what was done needs the log management right on the domain controllers and ' +
        'administrative access to the asset system. Twenty-one accounts hold one of those. Three ' +
        'hold both: m.rooke, d.iyer, and the shared automation credential svc-assetsync, whose ' +
        'password sits in a team vault that eleven people can open. The 03:12 asset edit was made ' +
        'with svc-assetsync.',
      source: 'identity review',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1180,
      surface: 'alert-queue',
      summary: 'The freight scheduling run starts at 04:00 and two of the three accounts drive it',
      detail:
        'The overnight scheduling run that builds Monday driver routes and customs paperwork ' +
        'starts at 04:00 and is operated by the infrastructure team. Suspending m.rooke and d.iyer ' +
        'or disabling svc-assetsync before then stops the run. A missed run means drivers without ' +
        'routes at 05:30 and customs declarations filed late, which at this company is a ' +
        'regulatory matter as well as an operational one.',
      source: 'operations',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.9',
      atSeconds: 1320,
      surface: 'alert-queue',
      summary: 'ADF-DC-04 also stopped reporting on Sunday, for six minutes',
      detail:
        'ADF-DC-04 reported no security events between 01:00 and 01:06 on Sunday. The host is in ' +
        'the Sunday patch group, the change record covers it, the event log records a clean ' +
        'shutdown and start, and the record identifier is 41,882,306 at 00:59 and 41,882,309 at ' +
        '01:06. Rule history: same rule as ev.1, fired 31 times in thirty days.',
      source: 'ADF-DC-04',
      claimedSeverity: 'medium',
    },
  ],
};

export const NOTHING_HAPPENED_AT_TWO_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Early on Saturday morning somebody with the log management right on ADF-DC-02 removed 2,847 security records covering roughly forty minutes and adjusted the surrounding timestamps so the log reads as continuous.',
    'They left five records standing. Those five show m.rooke adding a service account to Domain Admins and removing it eleven minutes later, from a workstation named ADF-WS-0413.',
    'ADF-WS-0413 was returned to IT on Friday at 15:50, wiped at 16:40, powered down and racked in the locked spares cage at 16:55. The cage reader logs nobody through that door between Friday evening and Monday morning.',
    'At 03:12 on Saturday the asset record for that workstation was edited through the administrative API on the shared svc-assetsync credential, changing its status from RETURNED back to ASSIGNED: M.ROOKE, so the workstation name in the log would resolve to a person.',
    'The forwarded copy in the SIEM is sampled at five minutes an hour, a cost decision taken in March. Three minutes of the window survive and they carry a log service configuration change at 02:04:31, six minutes before the gap on the host claims to begin.',
    'So the evidence against m.rooke was manufactured, and the manufacture is provable from the record identifiers, the cage reader and the asset edit.',
    'Who manufactured it is not provable tonight. Three accounts hold both required rights: m.rooke, d.iyer, and svc-assetsync, whose vault password eleven people can open.',
    'Whatever was actually done between 02:10 and 02:50 went with the deleted records. Nothing recovers it.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562.002'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'Twenty-nine of thirty-one were patching reboots, which is the base rate that gets this ' +
        'closed in ten seconds. Three fields separate this one and all three are on the row: the ' +
        'host did not reboot, the forwarding agent did not restart, and no maintenance window ' +
        'covers Saturday. A silent host that did not go anywhere is not a host that stopped ' +
        'talking. It is a host whose record of that period was removed. Raise it and hold it open ' +
        'rather than declaring: the only established fact so far is an absence, and an absence is ' +
        'a reason to look rather than a reason to act.',
      standIn:
        'ADF-DC-02 went quiet for forty minutes on Saturday, against a baseline of 900 an hour. ' +
        'Twenty-nine of thirty-one of these are patching reboots, so I checked: no reboot, no agent ' +
        'restart, no maintenance window. It did not go anywhere, it just stopped being recorded. ' +
        'Raising it and holding it open.',
      commandOptions: [
        { command: "awk '$3==\"ADF-DC-02\" {print $1}' /var/log/siem/ingest.log | uniq -c | tail -30", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -E "boot|shutdown|agent-restart" /var/log/siem/ingest.log | grep ADF-DC-02', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem-forwarder', ...STATUS_CHECK },
        { command: 'cat /var/log/siem/ingest.log', ...DUMP_ALL },
        { command: 'grep -c ADF-DC-02 /var/log/siem/ingest.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Before you close it as a reboot, check whether it actually rebooted.',
      guidance:
        'Most quiet hosts rebooted. Ask whether this one did.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1070.001', 'T1070.006'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.tune', 'act.reimage-now'],
      escalateTo: ['forensics', 'ir-lead'],
      why:
        'The finding of the night, and it is available only to somebody who distrusts the field ' +
        'everybody reads. By timestamp this log is continuous and unremarkable, which is the ' +
        'condition it was deliberately put into. The record identifier is a different kind of ' +
        'number: the logging service assigns it on write, it only ever goes up, and nothing ' +
        'downstream can renumber it. It steps by 2,847 across a window that contains no time at ' +
        'all. That is not corruption and not a collection failure, both of which leave the ' +
        'identifiers intact and the timestamps ragged. It is deletion followed by tidying, and the ' +
        'tidying is what proves intent, because a crash does not adjust the surrounding timestamps ' +
        'so the remainder reads as whole. Say what it costs, too: whatever happened in those forty ' +
        'minutes is gone, and no part of tonight recovers it.',
      standIn:
        'By timestamp the log is continuous. The record IDs are not. 55,204,113 at 02:09:58 and ' +
        '55,206,960 at 02:50:04, so 2,847 records are missing from a window containing no time. ' +
        'The logging service assigns those on write and nothing downstream can renumber them. A ' +
        'crash leaves the IDs intact and the timestamps ragged; this is the other way round. ' +
        'Somebody deleted records and tidied the timestamps after. Whatever was in them is gone.',
      commandOptions: [
        { command: "awk -F'|' 'NR>1 && $2!=p+1 {print \"gap before\", $1, $2-p} {p=$2}' /evidence/adf-dc-02/security.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F'|' '$1 ~ /02:(09|1[0-9]|50)/ {print $1, $2}' /evidence/adf-dc-02/security.csv | head -40", correct: true, teaches: ALSO_WORKS },
        { command: 'grep "02:1[0-9]" /evidence/adf-dc-02/security.csv | wc -l', ...COUNT_ONLY },
        { command: 'cat /evidence/adf-dc-02/security.csv', ...DUMP_ALL },
        { command: 'wevtutil cl Security', ...MUTATE },
      ],
      commandNudge:
        'The timestamps are continuous. Find a field the writer controls that a later editor does ' +
        'not.',
      guidance:
        'If somebody removed records, which field would they have to fix, and which one could they ' +
        'not?',
    },
    {
      eventId: 'ev.3',
      verdict: 'decoy',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1036'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Read what is strange about these records before reading what they say. Two thousand eight ' +
        'hundred and forty-seven were removed and five were left, and the five that survived are ' +
        'the only records in two hours naming any human account. Somebody deleting to hide does ' +
        'not curate what remains. They are also complete in a way real evidence rarely is: ' +
        'workstation name, full authentication chain, an addition and a tidy removal eleven ' +
        'minutes later. That reads like a summary of a crime rather than the debris of one. None ' +
        'of which proves they are planted, and none of which is a reason to act on the name. Seal ' +
        'them and treat them as the most important artefact on the floor, because if they were ' +
        'placed then they are the only direct trace of the person who placed them.',
      standIn:
        'Careful with these five. Two thousand eight hundred and forty-seven records were removed ' +
        'and exactly five left standing, and those five are the only ones in two hours naming a ' +
        'human. Somebody hiding does not curate what survives. They are unusually complete too: ' +
        'workstation, full auth chain, an addition and a tidy removal. That is a summary, not ' +
        'debris. Sealed and hashed. Nobody acts on that name yet.',
      commandOptions: [
        { command: "awk -F'|' '$5 ~ /rooke/ {print $1, $2, $6}' /evidence/adf-dc-02/security.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/adf-dc-02/security.csv | tee /evidence/adf-dc-02/security.csv.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'net user m.rooke /domain', ...WRONG_TARGET },
        { command: 'cat /evidence/adf-dc-02/security.csv', ...DUMP_ALL },
        { command: 'net user m.rooke /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Ask why these particular records survived the deletion, and what makes them different ' +
        'from the 2,847 that did not.',
      guidance:
        'Somebody chose what to leave behind. Ask what that choice was for.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      firstResponder: 'forensics',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.reimage-now', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The row that ends the case against m.rooke, and it is not a log finding. A return note ' +
        'signed Friday at 15:50, a wipe at 16:40, a cage entry at 16:55, and a door reader that ' +
        'records nobody through it between Friday evening and Monday morning. The workstation ' +
        'named in the surviving records was off, empty and behind a locked door for the whole of ' +
        'Saturday. Digitally the ev.3 evidence is clean and would survive most scrutiny; ' +
        'physically it is impossible, and no log surfaces that. Somebody has to think to ask where ' +
        'the machine actually was and then go and check a cage and a door reader. That is the ' +
        'habit worth taking away: when digital evidence is unusually complete, test it against the ' +
        'physical world, which whoever wrote the evidence usually could not edit.',
      standIn:
        'ADF-WS-0413 was handed back Friday 15:50, wiped 16:40, racked in the locked spares cage at ' +
        '16:55. The cage reader has nobody through that door between Friday 17:12 and Monday ' +
        '06:40. The machine in those records was off, wiped and behind a locked door all Saturday. ' +
        'The evidence is digitally clean and physically impossible. Return note, wipe log and ' +
        'reader export sealed and hashed.',
      commandOptions: [
        { command: "awk -F, '$2==\"ADF-WS-0413\" {print $1, $3, $4}' /evidence/asset/history.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"SPARES-CAGE\"' /evidence/physical/door-reader.csv | tail -20", correct: true, teaches: ALSO_WORKS },
        { command: 'ping ADF-WS-0413', ...WRONG_TARGET },
        { command: 'cat /evidence/asset/history.csv', ...DUMP_ALL },
        { command: 'grep -c ADF-WS-0413 /evidence/asset/history.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out where that workstation physically was on Saturday.',
      guidance:
        'The log says a machine did something. Ask whether the machine was even plugged in.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1036', 'T1078.003'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'The second system, and the reason this stops being a deletion and becomes a fabrication. ' +
        'At 03:12, twenty-two minutes after the log gap closes, the asset record for a workstation ' +
        'that had already been returned and wiped was edited back to ASSIGNED: M.ROOKE. On its own ' +
        'that is a clerical correction of the sort that happens weekly. Placed after the deletion, ' +
        'its only function is to make a workstation name in a security log resolve to a person, ' +
        'and without it the planted records point at a decommissioned asset and land nowhere. Two ' +
        'systems were altered in one night to make one story stand up, which narrows the ' +
        'population sharply. Resist revoking the automation credential on the spot: it is the best ' +
        'lead on the floor and it is holding something up at 04:00.',
      standIn:
        'At 03:12, twenty-two minutes after the gap closes, somebody edited the asset record for ' +
        'ADF-WS-0413 from RETURNED back to ASSIGNED: M.ROOKE, through the admin API on ' +
        'svc-assetsync. On its own that is a clerical fix. After a deletion it is the thing that ' +
        'makes the workstation name in those records resolve to a person, and without it they ' +
        'point at a dead asset. Two systems altered to prop up one story. Not revoking that ' +
        'credential yet.',
      commandNudge:
        'Ask what the planted records would point at if nobody had touched the asset system.',
      guidance:
        'A workstation name is only a person if something maps it to one. Ask what does that.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562.002'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'fusion-analyst'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'A cost decision taken in March deciding what can be known in September, which is this ' +
        'seat existing to notice. Forwarded domain controller logs were cut to a five-minute ' +
        'sample per hour to hold the ingest bill down, so of forty minutes somebody went to real ' +
        'trouble to remove, three survive anywhere. Those three are worth more than everything ' +
        'else forwarded that night: they carry a log service configuration change at 02:04:31, six ' +
        'minutes before the host log claims the gap begins, which means the timestamps on the host ' +
        'were moved as well as the records removed. The proposal that follows is not a rule for ' +
        'this attack. It is that record identifier continuity is checkable cheaply and ' +
        'continuously, that a step in the identifier with no step in time cannot be faked from ' +
        'inside the host, and that a sampled forward of a domain controller is a decision to be ' +
        'unable to answer questions like this one. Backtest before promising it: thirty-one ' +
        'quiet-host alerts in thirty days is what the floor already carries.',
      standIn:
        'We have sampled forwarded DC logs at five minutes an hour since March, for cost. Of the ' +
        'forty minutes somebody worked to remove, three survive anywhere, and they carry a log ' +
        'service config change at 02:04:31, six minutes before the host says the gap starts. So ' +
        'the timestamps were moved too. My proposal is not a rule for this attack: it is ' +
        'continuous record ID continuity checking, which cannot be faked from inside the host, and ' +
        'revisiting a sampled forward on a domain controller. Let me backtest before I promise a ' +
        'volume.',
      commandOptions: [
        { command: "awk -F'|' '$1 ~ /02:0[4-7]/ {print $1, $2, $6}' /evidence/siem/dc02-sample.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "log service|eventlog" /evidence/siem/dc02-sample.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem-forwarder', ...STATUS_CHECK },
        { command: 'cat /evidence/siem/dc02-sample.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/siem/dc02-sample.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'The host log is not the only copy. Find out what the SIEM kept, and how much of it.',
      guidance:
        'Ask whether anything survived elsewhere, and why so little of it did.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1078.003'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.reset-password', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Where the hour lands, and it lands on a number rather than a name. Doing what was done ' +
        'needs two rights that rarely sit together: log management on the domain controllers and ' +
        'administrative access to the asset system. Twenty-one accounts hold one. Three hold both, ' +
        'and one of the three is the person the evidence points at, which is either why he was ' +
        'chosen or why he is guilty, and neither is decidable tonight. The third is a shared ' +
        'automation credential whose vault eleven people can open, and it made the 03:12 edit, so ' +
        'the technical trail terminates in a credential rather than a person by design. State it ' +
        'as a population of three, say plainly that it does not narrow further, and put the ' +
        'retraction first: the strongest finding of the night is that the evidence against a named ' +
        'administrator is fabricated, and there is a meeting at 08:30 that has not heard it.',
      standIn:
        'Two rights are needed and they rarely sit together. Twenty-one accounts hold one of them. ' +
        'Three hold both: m.rooke, d.iyer, and svc-assetsync, whose vault eleven people can open, ' +
        'and svc-assetsync made the 03:12 edit. The trail ends in a shared credential by design. ' +
        'Population of three, and it does not narrow further tonight. The headline is not who did ' +
        'it. It is that the evidence against Rooke is manufactured and HR are meeting at 08:30 ' +
        'without knowing that.',
      commandNudge:
        'Work out which rights were needed to do all of this, then find who holds every one of ' +
        'them rather than any of them.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'defense-evasion',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'Three suspects, two of whom run the process that puts drivers on the road at 05:30, and ' +
        'the obvious action costs more than it buys. Suspending both administrators or disabling ' +
        'the automation credential stops the 04:00 run, which means no routes at 05:30 and customs ' +
        'declarations filed late, and at a freight company late declarations are a regulatory ' +
        'matter rather than an inconvenience. The narrow move exists and is not the obvious one: ' +
        'leave every account working and remove one capability from all three, the log management ' +
        'right on the domain controllers, which nothing in the scheduling run touches. Then put a ' +
        'compensating control around what stays, by forwarding those logs somewhere none of the ' +
        'three can write, so the next attempt is recorded where the attempt cannot reach. ' +
        'Establish the rollback first, because pulling a right out of a directory at ten at night ' +
        'is exactly the change that becomes the outage everybody remembers. And say plainly what ' +
        'is deliberately left undone: nobody is suspended tonight, on evidence that names one ' +
        'person and does not narrow past three.',
      standIn:
        'Do not suspend anybody. Two of the three run the 04:00 scheduling run, so suspending them ' +
        'means no driver routes at 05:30 and late customs declarations, which here is regulatory. ' +
        'Narrow move: leave all three accounts working and pull one capability, the log management ' +
        'right on the DCs, which the scheduling run never touches. Compensating control: forward ' +
        'those logs somewhere none of the three can write. I want the rollback written down before ' +
        'we touch a directory at ten at night. Deliberately left undone: no suspensions, because ' +
        'we have three names and no way to choose.',
      commandNudge:
        'Find out what the 04:00 run actually needs from those accounts, and whether the right that ' +
        'was abused is one of them.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.isolate', 'act.attribute-named'],
      escalateTo: [],
      why:
        'The same rule, the same shape, and the opposite answer, arriving at the moment the floor ' +
        'has learned to distrust quiet hosts. Six minutes rather than forty, a change record that ' +
        'covers it, a clean shutdown and start in the event log, and record identifiers of ' +
        '41,882,306 and 41,882,309 either side. Three records across a six-minute outage is what a ' +
        'host that was switched off looks like, because a host that is off writes nothing and ' +
        'skips nothing. That is the ev.2 check run in the other direction, and it is the whole ' +
        'discriminator. A floor that raises this one has learned to fear the symptom instead of ' +
        'running the test.',
      standIn:
        'ADF-DC-04, six minutes on Sunday, and it is the opposite of the other one. Patch group, ' +
        'change record covers it, clean shutdown and start in the log, and the record IDs are ' +
        '41,882,306 and 41,882,309 either side. Three records across six minutes is what a ' +
        'switched-off host looks like: nothing written and nothing skipped. Same check as before, ' +
        'opposite answer. Closing it.',
      commandOptions: [
        { command: "awk -F'|' 'NR>1 && $2!=p+1 {print \"gap\", $1} {p=$2}' /evidence/adf-dc-04/security.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "shutdown|startup" /evidence/adf-dc-04/security.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem-forwarder', ...STATUS_CHECK },
        { command: 'cat /evidence/adf-dc-04/security.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/adf-dc-04/security.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Run the same identifier check here that found the tampering on the other host.',
      guidance:
        'You have a test that told you records were removed. Run it on this one before you raise ' +
        'it.',
    },
  ],
};
