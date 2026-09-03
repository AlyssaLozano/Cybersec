/**
 * Scenario 81: Back To Tuesday.
 *
 * Three servers were restored from backup on Saturday. By Sunday all three were
 * beaconing again, from a persistence mechanism that was in the backup.
 *
 * WHAT THIS TEACHES
 *
 * That a recovery point is only clean relative to a dwell time nobody
 * established, and that "restore to before the incident" means before the
 * compromise rather than before the detection.
 *
 * The Tuesday snapshot was chosen because the incident was detected on
 * Wednesday, which is a reasonable-sounding rule and is the wrong one. The
 * incident report says the activity was first observed on Wednesday, and first
 * observed is not first occurred. Nobody ever established when the intrusion
 * began, so nobody could know which snapshot predated it, and the restore
 * reinstalled the thing it was performed to remove.
 *
 * THE UNCOMFORTABLE PART
 *
 * Once dwell time is unknown, every recovery point is a guess. Going further
 * back costs data, and the last snapshot anybody can positively show is clean
 * may sit outside retention altogether, at which point the honest answer is
 * that no clean restore point exists and rebuilding is the only route.
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

const ID = 'back-to-tuesday';

export const BACK_TO_TUESDAY: Scenario = {
  id: ID,
  title: 'Back To Tuesday',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 08:30 on Monday at Fenmarch Credit Union. Three servers were restored from backup on ' +
    'Saturday to close out an incident, and since yesterday all three have been doing exactly what ' +
    'they were restored to stop.',
  roles: [
    'soc-operator',
    'log-analyst',
    'forensics',
    'cloud-security',
    'fusion-analyst',
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
      summary: 'The beacon is back on all three restored servers',
      detail:
        'FCU-APP-02, 05 and 09 have been connecting to 198.51.100.117 every twenty minutes since ' +
        'Sunday 04:00. The destination, the interval and the request shape match the beacon ' +
        'documented in incident FCU-IR-0288, which was closed on Saturday. All three servers were ' +
        'restored from backup on Saturday morning as the remediation for that incident. Rule ' +
        'history: this signature was written during that incident and has fired 41 times since ' +
        'Sunday.',
      source: 'FCU-APP-02',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'raw-log',
      summary: 'They were restored to the Tuesday snapshot',
      detail:
        'The restore records show all three servers rebuilt from the snapshot taken at 01:00 on ' +
        'Tuesday 16 September. The incident was detected on Wednesday 17 September at 11:20. The ' +
        'closure note for FCU-IR-0288 records the recovery point as "the last backup before the ' +
        'incident". Restores completed at 09:40 Saturday and the servers returned to service at ' +
        '11:00.',
      source: 'backup platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'host-artefact',
      summary: 'The persistence is inside the Tuesday snapshot itself',
      detail:
        'Mounting the Tuesday 16 September snapshot read-only shows a scheduled task named ' +
        'FenmarchUpdateAssist and its associated binary already present in the image, with the same ' +
        'hash as the one recovered during the original incident. The snapshot from Monday 15 ' +
        'September also contains it. The snapshot from Sunday 14 September does not.',
      source: 'backup platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 490,
      surface: 'alert-queue',
      summary: 'The incident report says first observed, and was read as first occurred',
      detail:
        'FCU-IR-0288 records "activity first observed 17 September 11:20" and, under scope, "extent ' +
        'of prior activity not established: endpoint telemetry retained 14 days, no earlier data ' +
        'available". The closure note selects the Tuesday snapshot as the last backup before the ' +
        'incident. Nobody involved in the restore decision was on the original investigation, and ' +
        'the handover was the report.',
      source: 'FCU-IR-0288',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 660,
      surface: 'host-artefact',
      summary: 'The earliest evidence anybody can find is 11 September',
      detail:
        'The binary in the Sunday-to-Monday window has a first-write timestamp of 11 September on ' +
        'FCU-APP-05, which is the earliest artefact anywhere in the estate. Endpoint telemetry ' +
        'covers 14 days and now begins on 8 September. Nothing establishes what happened before ' +
        'that, and the 11 September write is a first-seen date on one host rather than a start ' +
        'date for the intrusion.',
      source: 'FCU-APP-05',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 830,
      surface: 'cloud-audit',
      summary: 'What restore points still exist',
      detail:
        'The backup policy holds daily snapshots for 30 days and monthly snapshots for 12 months. ' +
        'Daily snapshots therefore reach back to 2 September. Monthly snapshots are taken on the ' +
        'first of each month, so the nearest monthly point is 1 September. Restoring to 1 ' +
        'September loses 29 days of member transactions on systems that write continuously.',
      source: 'backup platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1000,
      surface: 'alert-queue',
      summary: 'What the three servers do and what a rebuild costs',
      detail:
        'The three run the member statement generation service. Rebuilding from base image and ' +
        'reapplying configuration takes an estimated two days per server and the build ' +
        'documentation was last updated in 2023. Restoring to 14 September loses six days of ' +
        'generated statements, which can be regenerated. Month end statement generation begins on ' +
        'Wednesday.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1170,
      surface: 'raw-log',
      summary: 'Nothing checked the restored servers against the incident they came from',
      detail:
        'The restore process validates that the image mounts, that services start and that the ' +
        'application responds. It does not compare the restored system against the indicators from ' +
        'the incident that prompted the restore. The beacon signature written during FCU-IR-0288 ' +
        'existed on Saturday and nothing ran it against the restored hosts. The first alert came 19 ' +
        'hours later, from the beacon itself.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.9',
      atSeconds: 1340,
      surface: 'host-artefact',
      summary: 'A fourth server from the same snapshot is clean',
      detail:
        'FCU-APP-11 was also affected by the original incident and also returned to service on ' +
        'Saturday. It is not beaconing. Its records show it was rebuilt from the current base image ' +
        'and had its configuration reapplied from the configuration repository, rather than being ' +
        'restored from a snapshot, because its backup had failed verification in August and nobody ' +
        'had fixed it.',
      source: 'FCU-APP-11',
      claimedSeverity: 'medium',
    },
  ],
};

export const BACK_TO_TUESDAY_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Incident FCU-IR-0288 was detected on Wednesday 17 September at 11:20. Its report records the activity as first observed then, and records under scope that the extent of prior activity was not established because endpoint telemetry is retained for 14 days.',
    'On Saturday, three servers were restored from the snapshot taken at 01:00 on Tuesday 16 September, chosen as the last backup before the incident.',
    'That snapshot already contains the scheduled task FenmarchUpdateAssist and its binary, with the same hash recovered during the original investigation. The Monday 15 September snapshot contains it too. The Sunday 14 September snapshot does not.',
    'So the restore reinstalled the persistence it was performed to remove, and all three servers resumed beaconing at 04:00 on Sunday.',
    'The earliest artefact anywhere in the estate is a first-write timestamp of 11 September on FCU-APP-05, which is a first-seen date on one host rather than a start date for the intrusion. Endpoint telemetry now reaches back only to 8 September.',
    'Daily snapshots are held for 30 days and reach 2 September; the nearest monthly point is 1 September and restoring to it loses 29 days of member transactions.',
    'The restore process validates that the image mounts, services start and the application responds, and does not compare the restored system against the indicators from the incident that caused the restore. The signature existed on Saturday and nothing ran it.',
    'A fourth affected server is clean, because its backup had failed verification in August and it was therefore rebuilt from base image instead of restored.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1053.005'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'The same destination, the same twenty minute interval and the same request shape as an ' +
        'incident closed on Saturday, on the three servers that were restored to close it. Declare ' +
        'and reopen the original rather than raising a new one, because treating this as a fresh ' +
        'intrusion loses the only useful fact available in the first minute: this is not a ' +
        'reinfection unless somebody got back in, and nothing yet suggests anybody did. The ' +
        'question worth asking immediately is not how they returned but whether they ever left, ' +
        'and the restore is the obvious place that answer lives. Do not rebuild anything yet: the ' +
        'previous remediation was a rebuild, and repeating it without understanding why it failed ' +
        'produces the same Sunday next weekend.',
      standIn:
        'Same address, same twenty minute interval, same request shape as the incident we closed on ' +
        'Saturday, on the three servers we restored to close it. I am reopening 0288 rather than ' +
        'raising a new one, because calling this a reinfection assumes somebody got back in and ' +
        'nothing says they did. The question is whether they ever left. And nobody rebuilds ' +
        'anything yet: the last remediation was a rebuild and repeating it blind gets us the same ' +
        'Sunday next week.',
      commandOptions: [
        { command: "awk '$5==\"198.51.100.117\" {print $1, $3}' /var/log/flows.log | head -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "198.51.100.117" /evidence/incidents/FCU-IR-0288.md', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status statement-gen', ...STATUS_CHECK },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'nmap -Pn 198.51.100.117', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Compare this beacon against the one documented in the incident that closed on Saturday.',
      guidance:
        'It looks like last week. Ask whether it is the same thing.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.reimage-now', 'act.isolate'],
      escalateTo: ['forensics', 'ir-lead'],
      why:
        'Restored to the Tuesday snapshot, detected on Wednesday, and the closure note calls that ' +
        '"the last backup before the incident". Read that phrase carefully, because it contains the ' +
        'whole failure and it reads as obviously correct. The last backup before the incident was ' +
        'detected and the last backup before the incident began are different snapshots, and only ' +
        'one of them is a safe recovery point. Choosing by detection date is a rule that works ' +
        'exactly when dwell time is zero and is wrong by however long the intruder was there ' +
        'otherwise. Nobody involved was careless: the phrase is the standard one, it appears in ' +
        'recovery runbooks everywhere, and it quietly assumes an answer nobody had. The next step ' +
        'is not to argue about it but to settle it, and it is settleable in minutes: mount the ' +
        'snapshot and look.',
      standIn:
        'Restored to Tuesday, detected Wednesday, and the closure note says the last backup before ' +
        'the incident. That phrase is the whole failure and it reads as obviously right. The last ' +
        'backup before we detected it and the last backup before it started are different ' +
        'snapshots, and only one is safe. Picking by detection date is correct only if dwell time ' +
        'is zero. Nobody was careless, that phrase is in runbooks everywhere. And we can settle it ' +
        'in minutes by mounting the snapshot.',
      commandOptions: [
        { command: "awk -F, '$3==\"RESTORE\" {print $1, $2, $5}' /var/log/backup/operations.csv | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "recovery point|last backup" /evidence/incidents/FCU-IR-0288.md', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status backup-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/backup/operations.csv', ...DUMP_ALL },
        { command: 'grep -c RESTORE /var/log/backup/operations.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find which snapshot they restored from and what the closure note says about choosing it.',
      guidance:
        'They restored to before the incident. Ask what before the incident meant.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1053.005'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.corroborate'],
      outOfLaneActions: ['act.reimage-now', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The persistence is inside the image, with the same hash recovered during the original ' +
        'investigation, so nobody came back: it was restored. Mounting the snapshot read-only ' +
        'answers in minutes a question the whole floor has been treating as a mystery, and it is ' +
        'worth noticing that this check was equally available on Saturday morning before the ' +
        'restore ran. The Monday 15 September snapshot has it too and the Sunday 14 September one ' +
        'does not, which is the most valuable thing on this board: it is a boundary, established ' +
        'by looking rather than assumed from a detection date, and it converts the recovery ' +
        'decision from a guess into a choice between two dates. Say clearly what it does not ' +
        'establish, because somebody will take it too far: the boundary is when this artefact ' +
        'appeared in the image, not when the intrusion began, and an intruder present since ' +
        'August who installed persistence in September produces exactly this picture.',
      standIn:
        'The task and the binary are in the image, same hash as the original investigation. Nobody ' +
        'came back. We restored it. Mounting the snapshot read-only took minutes and was equally ' +
        'available on Saturday morning before the restore. And here is the useful part: Monday the ' +
        'fifteenth has it, Sunday the fourteenth does not. That is a boundary we established by ' +
        'looking rather than assumed from a detection date. What it is not is a start date. ' +
        'Somebody in since August who installed this in September looks exactly like this.',
      commandOptions: [
        { command: "for d in 14 15 16; do echo -n \"$d: \"; ls /mnt/snap-09$d/Windows/System32/Tasks/ | grep -c FenmarchUpdateAssist; done", correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /mnt/snap-0916/opt/updateassist/bin && grep -i hash /evidence/incidents/FCU-IR-0288.md', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status backup-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/incidents/FCU-IR-0288.md', ...DUMP_ALL },
        { command: 'rm /mnt/snap-0916/Windows/System32/Tasks/FenmarchUpdateAssist', ...MUTATE },
      ],
      commandNudge:
        'Mount the snapshot they restored from, read-only, and look for the persistence in it.',
      guidance:
        'The beacon came back after a restore. Ask what was in the thing they restored.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.tune'],
      escalateTo: ['ir-lead'],
      why:
        'The original report was right and was read wrong, and both halves matter. It records ' +
        'activity first observed on 17 September, which is accurate, and under scope it says ' +
        'plainly that the extent of prior activity was not established because telemetry is ' +
        'retained for fourteen days. That is an honest and well written limitation. What happened ' +
        'next is that nobody on the restore decision had been on the investigation, the handover ' +
        'was the document, and a reader looking for a recovery point found a date and used it. The ' +
        'sentence saying the start was unknown was not contradicted, it was simply not the sentence ' +
        'anybody was looking for. Treat this as a handover failure rather than a reporting one, ' +
        'because the report cannot be improved much: it already said the thing. What was missing ' +
        'is that the limitation was written as context when it needed to be written as an ' +
        'instruction, which is that no recovery point can be chosen until dwell time is bounded.',
      standIn:
        'The report was right and got read wrong. It says activity first observed 17 September, ' +
        'which is accurate, and under scope it says the extent of prior activity was not ' +
        'established because telemetry is fourteen days. That is honest and well written. Then ' +
        'nobody on the restore had been on the investigation, the handover was the document, and ' +
        'somebody looking for a recovery point found a date and used it. The sentence about the ' +
        'start being unknown was not contradicted, it just was not what they were reading for. It ' +
        'was written as context and it needed to be an instruction.',
      commandOptions: [
        { command: 'grep -inE "first observed|not established|retained" /evidence/incidents/FCU-IR-0288.md', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"FCU-IR-0288\" {print $3, $4}' /var/log/cases/participants.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status casemgmt', ...STATUS_CHECK },
        { command: 'cat /evidence/incidents/FCU-IR-0288.md', ...DUMP_ALL },
        { command: 'grep -c . /evidence/incidents/FCU-IR-0288.md', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read what the original report says about scope, not just about detection.',
      guidance:
        'Somebody picked that snapshot. Ask what they were reading when they did.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.timeline'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.reimage-now', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Eleven September is the earliest artefact anywhere and it is not a start date. It is a ' +
        'first-write timestamp on one host, endpoint telemetry now reaches back only to 8 ' +
        'September, and everything before that is not absent because it was checked, it is absent ' +
        'because it expired. The distinction has to be stated in exactly those terms because the ' +
        'floor is about to choose a recovery point and will otherwise treat 11 September as a ' +
        'boundary in the same way that Wednesday was treated as one last week, which is the ' +
        'identical error at a different date. What can honestly be said is bounded: the persistence ' +
        'entered the image between the Sunday and Monday snapshots, the earliest artefact anywhere ' +
        'is 11 September, and the beginning of the intrusion is unknown and unknowable with what ' +
        'exists. That last clause is the finding, and repeating the mistake means saying 11 ' +
        'September out loud without it.',
      standIn:
        'Eleven September is the earliest artefact and it is not a start date. First write on one ' +
        'host, and telemetry only reaches back to the eighth, so everything before is missing ' +
        'because it expired rather than because we checked. I am saying that plainly, because we ' +
        'are about to pick a recovery point and treating the eleventh as a boundary is exactly what ' +
        'was done with Wednesday last week. What we can say: the persistence entered the image ' +
        'between Sunday and Monday, the earliest artefact anywhere is the eleventh, and when this ' +
        'started is unknowable with what we have.',
      commandOptions: [
        { command: "find /evidence/app05 -newermt '2026-09-01' ! -newermt '2026-09-17' -printf '%T+ %p\\n' | sort | head", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, 'NR==2 {print $1}' /var/log/edr/retention-window.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/edr/retention-window.csv', ...DUMP_ALL },
        { command: 'grep -c . /var/log/edr/telemetry.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the earliest artefact you can, then find out how far back the telemetry actually ' +
        'goes.',
      guidance:
        'You have an earliest date. Ask whether it is earliest because you looked or because you ' +
        'ran out.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.scope-estate', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.reimage-now', 'act.isolate'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'What restore points still exist, which is a different question from which ones would be ' +
        'safe. Daily snapshots reach back to 2 September and the nearest monthly is 1 September. ' +
        'The Sunday 14 September snapshot is known clean of this artefact and is inside retention, ' +
        'so a defensible recovery point does exist and it costs six days. Say that clearly, ' +
        'because the alternative framing that will otherwise take hold is that everything is ' +
        'contaminated and only a rebuild will do. What has to accompany it is the honest caveat: 14 ' +
        'September is clean of this persistence and is not established as clean of the intrusion, ' +
        'because the intrusion has no known start. Going back further buys progressively less ' +
        'certainty for progressively more lost data, and at 1 September the cost is 29 days of ' +
        'member transactions on systems that write continuously, which is not a recovery, it is a ' +
        'different incident.',
      standIn:
        'Daily snapshots reach 2 September, nearest monthly is the first. The Sunday the fourteenth ' +
        'snapshot is clean of this artefact and it is inside retention, so a defensible point does ' +
        'exist and it costs six days. I want that said, because otherwise the room decides ' +
        'everything is contaminated and only a rebuild will do. The caveat goes with it: the ' +
        'fourteenth is clean of this persistence, not established as clean of the intrusion, ' +
        'because the intrusion has no known start. And going back to the first costs 29 days of ' +
        'member transactions, which is not a recovery, it is a different incident.',
      commandOptions: [
        { command: "awk -F, '$3==\"SNAPSHOT\" {print $1, $2}' /var/log/backup/operations.csv | sort | head -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "retention|daily|monthly" /evidence/backup/policy.yaml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status backup-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/backup/policy.yaml', ...DUMP_ALL },
        { command: 'backup-cli delete --older-than 30d', ...MUTATE },
      ],
      commandNudge:
        'List the snapshots that still exist and work out which of them predate the artefact.',
      guidance:
        'You know which snapshot is dirty. Ask which ones you still have.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Three options and the cheapest is not the fastest. Restoring to 14 September loses six days ' +
        'of generated statements, which can be regenerated, and is clean of this persistence ' +
        'without being established as clean of the intrusion. Rebuilding from base image is the ' +
        'only option that does not depend on dwell time at all, and it is two days per server ' +
        'against build documentation last updated in 2023, which in practice means longer, and ' +
        'month end statement generation starts on Wednesday. The move that makes either survivable ' +
        'is the one to do first and it takes minutes: block the beacon destination at the ' +
        'perimeter, which stops the active channel on all three servers immediately and buys the ' +
        'time to choose properly rather than at eight in the morning under pressure. Then restore ' +
        'to 14 September and, before anything returns to service, run the indicators from ' +
        'FCU-IR-0288 against the restored hosts, which is the step whose absence caused this. ' +
        'Check the rollback and keep the current disks rather than overwriting them, because they ' +
        'are the only evidence of what happened between Tuesday and now. Deliberately left undone ' +
        'and stated plainly: 14 September is a bet that the intrusion began after 14 September, ' +
        'nothing available supports or refutes that, and if it is wrong this recurs and the next ' +
        'honest option is a rebuild.',
      standIn:
        'Three options and the cheapest is not the fastest. The fourteenth loses six days of ' +
        'statements, which regenerate, and is clean of this artefact but not established as clean ' +
        'of the intrusion. Rebuild from base image does not depend on dwell time at all, and it is ' +
        'two days a server on 2023 documentation, so longer, and month end starts Wednesday. First ' +
        'thing, takes minutes: block that destination at the perimeter, which kills the channel on ' +
        'all three and buys us the time to choose properly instead of at half eight. Then restore ' +
        'to the fourteenth and run the 0288 indicators against them before they go back into ' +
        'service, which is the step whose absence caused this. Keep the current disks, they are the ' +
        'only evidence. And say it out loud: the fourteenth is a bet that this started after the ' +
        'fourteenth, nothing supports or refutes that, and if it is wrong we rebuild.',
      commandNudge:
        'Find the action that stops it today without committing to a recovery point.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The signature that would have caught this was written during the original incident, existed ' +
        'on Saturday morning, and nothing ran it against the servers being restored because of that ' +
        'incident. That is not a detection gap in the usual sense: the detection existed and was ' +
        'correct, and the failure is that the restore process validates the wrong things. It ' +
        'checks that the image mounts, that services start and that the application responds, all ' +
        'of which are questions about whether the restore worked, and none of which is a question ' +
        'about whether the restore is safe. The first alert came nineteen hours later from the ' +
        'beacon itself, which means the estate detected the problem it had reintroduced rather than ' +
        'preventing it. The proposal is a process step and not a rule, and that should be said ' +
        'rather than dressed up: no host returns to service from a restore until the indicators ' +
        'from the incident that caused it have been run against it. It costs minutes, it needs ' +
        'nothing built, and on Saturday it would have caught this before eleven o\'clock.',
      standIn:
        'The signature that catches this was written during the original incident and existed on ' +
        'Saturday morning, and nothing ran it against the servers we were restoring because of that ' +
        'incident. The detection was fine. The restore process validates the image mounts, services ' +
        'start and the application responds, which are all questions about whether the restore ' +
        'worked and none about whether it is safe. We detected the problem we had just ' +
        'reintroduced, nineteen hours later, from the beacon. My proposal is a process step, not a ' +
        'rule: nothing returns to service from a restore until the indicators from the incident ' +
        'that caused it have been run against it. Minutes, nothing to build, and it catches this ' +
        'before eleven on Saturday.',
      commandOptions: [
        { command: 'grep -iE "validate|check" /evidence/runbooks/restore-procedure.md', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"FCU-IR-0288\" && $3==\"SIGNATURE\" {print $1, $4}' /var/log/detection/artifacts.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /evidence/runbooks/restore-procedure.md', ...DUMP_ALL },
        { command: 'grep -c . /evidence/runbooks/restore-procedure.md', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read what the restore procedure checks before a server goes back into service.',
      guidance:
        'A signature for this existed on Saturday. Ask what would have had to run it.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'soc-operator'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.reimage-now', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'A fourth server from the same incident, back in service on the same Saturday, and it is ' +
        'clean. The reason is the useful part and it is entirely accidental: its backup had failed ' +
        'verification in August and nobody had fixed it, so there was no snapshot to restore and it ' +
        'was rebuilt from the current base image with configuration reapplied from the repository ' +
        'instead. A failed backup that nobody remediated is the only reason one of the four servers ' +
        'is not beaconing this morning. Close it, and put that in the readout rather than letting ' +
        'it pass as a curiosity, because it is the strongest available evidence for what the ' +
        'remediation should have been: the one host that was rebuilt rather than restored is the ' +
        'one host that is clean, and it demonstrates that rebuild-and-reapply is achievable here ' +
        'rather than theoretical, on a morning when somebody will argue it takes too long.',
      standIn:
        'Fourth server from the same incident, back in service the same Saturday, and it is clean. ' +
        'Its backup had failed verification in August and nobody fixed it, so there was nothing to ' +
        'restore and they rebuilt it from base image with config from the repository. A failed ' +
        'backup nobody remediated is the only reason one of the four is not beaconing. That goes in ' +
        'the readout: the one host we rebuilt instead of restored is the one that is clean, and it ' +
        'proves rebuild-and-reapply is achievable here, which somebody is about to argue takes too ' +
        'long.',
      commandOptions: [
        { command: "awk -F, '$2==\"FCU-APP-11\" {print $1, $3, $5}' /var/log/backup/operations.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "FCU-APP-11" /var/log/backup/verification.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status backup-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/backup/operations.csv', ...DUMP_ALL },
        { command: 'grep -c FCU-APP-11 /var/log/backup/operations.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check how the fourth server was returned to service, and whether it was restored at all.',
      guidance:
        'Three are beaconing and one is not. Ask what was different about the fourth.',
    },
  ],
};
