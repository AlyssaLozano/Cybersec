/**
 * Scenario 75: How Many.
 *
 * Data left, legal need a number by two o'clock, and the number changes three
 * times before lunch.
 *
 * WHAT THIS TEACHES
 *
 * That a count is a finding with a basis and an error bar, and that reporting
 * one without those is how a floor ends up correcting itself in public.
 *
 * Every estimate here is honestly arrived at and every one of them is wrong in
 * a different direction. The query log says 400 because it records statements
 * rather than rows above a sampling threshold, so 400 is a floor. The transfer
 * size says far more than 400, but bytes are not records. The table holds
 * 2,100, which is a ceiling and not an answer. The WHERE clause narrows it to
 * one clinic, which is 900 people, and that is the closest thing to a number
 * anybody will get today.
 *
 * WHY THE PRESSURE IS THE EXERCISE
 *
 * Legal are not asking out of curiosity: the notification decision needs a
 * scope, and a communications draft already says "fewer than 500" because
 * somebody heard the first estimate. Every revision after that costs
 * credibility that is spent on the regulator rather than on the incident. The
 * way out is not a better point estimate. It is a range, a basis for each end
 * of it, and a plain statement of what would move it.
 *
 * AND THE LINE THE FLOOR MUST NOT CROSS
 *
 * Whether to notify is not this floor's decision, and being asked for it under
 * time pressure by people who outrank everybody in the room is exactly how a
 * SOC ends up making a legal call it cannot carry. The output is the number and
 * its basis. The decision belongs to somebody else, and saying so is not
 * evasion.
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

const ID = 'how-many';

export const HOW_MANY: Scenario = {
  id: ID,
  title: 'How Many',
  difficulty: 'advanced',
  durationMinutes: 75,
  situation:
    'It is 10:40 at Ridgeline Medical Group. Patient data left the estate overnight and legal need ' +
    'a number by 14:00. The communications draft on the shared drive already says fewer than 500.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'forensics',
    'cloud-security',
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
      summary: 'Confirmed extraction from the patient database, and a deadline attached to it',
      detail:
        'A service account queried the patient database at 02:14 and the result left the estate. ' +
        'The intrusion itself is established and contained: the credential is revoked and the ' +
        'source address blocked. Legal have asked for the number of affected patients by 14:00 to ' +
        'decide on notification. Rule history: not applicable, this arrived as an escalation.',
      source: 'incident RMG-IR-0311',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'The query log shows four hundred rows',
      detail:
        'The database audit log records the 02:14 statement with a returned row count of 400. That ' +
        'number was passed to legal at 09:20 as an early estimate and is the basis for the ' +
        '"fewer than 500" line in the communications draft. The audit configuration records the ' +
        'full statement and a row count for every query.',
      source: 'patient database',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'network-flow',
      summary: 'Sixty-one megabytes left, which is not four hundred rows',
      detail:
        'The outbound transfer at 02:16 was 61.4 megabytes over four minutes. A patient record in ' +
        'this schema averages 3.1 kilobytes serialised, so 400 rows is about 1.2 megabytes. The ' +
        'transfer is fifty times that. The connection carried one file and no other traffic from ' +
        'that host in the window.',
      source: 'network monitoring',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'host-artefact',
      summary: 'The audit log counts statements, not rows, past a threshold',
      detail:
        'The database audit configuration records a row count accurately up to 400 and then stops ' +
        'counting, writing 400 for any result at or above it. This is documented in the platform ' +
        'reference under audit sampling and was configured at install in 2021 to bound audit ' +
        'volume. Every large query in twelve months of logs shows exactly 400. So 400 is a floor ' +
        'and carries no information about how far above it the real number is.',
      source: 'patient database',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'cloud-audit',
      summary: 'The table holds 2,100 rows in total',
      detail:
        'The patients table contains 2,100 active records. That is a hard ceiling: no query against ' +
        'it can return more. Serialised in full, 2,100 records is approximately 6.5 megabytes, ' +
        'which is a tenth of what actually left. The remaining volume is unexplained by row count ' +
        'alone.',
      source: 'patient database',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'raw-log',
      summary: 'The statement joined to the attachments table',
      detail:
        'The recovered statement selects from patients joined to clinical_attachments, filtered by ' +
        'clinic_id = 14. Attachments are stored inline and average 68 kilobytes. Clinic 14 is the ' +
        'respiratory clinic and has 900 patients on its list, of whom 780 have at least one ' +
        'attachment. 780 attachments at 68 kilobytes plus 900 records at 3.1 kilobytes is ' +
        'approximately 55 megabytes.',
      source: 'patient database',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 940,
      surface: 'alert-queue',
      summary: 'The number has now moved three times before lunch',
      detail:
        'Legal were told 400 at 09:20. The floor is about to tell them 900. Between those, an ' +
        'estimate of 2,100 was mentioned on the incident bridge and is in the minutes. The ' +
        'communications draft still reads "fewer than 500". The executive on the bridge has asked ' +
        'for "the smallest number we can defend".',
      source: 'incident bridge',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1100,
      surface: 'alert-queue',
      summary: 'What is actually known, and what is assumed',
      detail:
        'Known: the statement text, the clinic filter, the row counts of the clinic list and the ' +
        'attachment population, and the transfer size. Assumed: that the query completed, that no ' +
        'rows were filtered after the join, and that the average record and attachment sizes hold ' +
        'for this clinic. The arithmetic lands at 55 megabytes against an observed 61.4, a ' +
        'difference of about 11 per cent that nothing on the board explains.',
      source: 'incident assessment',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1260,
      surface: 'alert-queue',
      summary: 'What the notification actually requires',
      detail:
        'A notification may be made in stages where full information is not available, and a later ' +
        'revision upward is expected and normal. A number given as fact and revised downward is ' +
        'treated differently from one given as a range and narrowed. The regulator asks for the ' +
        'basis of the figure. Whether to notify at all is a decision for legal and the caldicott ' +
        'guardian, not for this floor.',
      source: 'legal',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.10',
      atSeconds: 1420,
      surface: 'network-flow',
      summary: 'A second large transfer the same night',
      detail:
        'A 2.1 gigabyte transfer left RMG-DB-02 at 01:00 to 10.20.4.61, an internal address. It ' +
        'is the nightly database backup, has run at 01:00 every night for three years within ten ' +
        'per cent of the same size, went to the backup appliance on the internal network, and is ' +
        'recorded in the backup catalogue with a successful completion.',
      source: 'RMG-DB-02',
      claimedSeverity: 'medium',
    },
  ],
};

export const HOW_MANY_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 02:14 a compromised service account ran one statement against the patient database, selecting from patients joined to clinical_attachments, filtered to clinic_id = 14.',
    'Clinic 14 is the respiratory clinic. It has 900 patients on its list, of whom 780 have at least one clinical attachment stored inline at an average of 68 kilobytes.',
    'The result left the estate at 02:16 as a single 61.4 megabyte transfer over four minutes.',
    'The database audit log records a row count of 400, because the audit configuration counts accurately to 400 and then writes 400 for anything at or above it. Every large query in twelve months shows exactly 400. It is a floor and carries no information about the real figure.',
    'The patients table holds 2,100 rows, which is a hard ceiling and not an estimate. Serialised in full that is about 6.5 megabytes, a tenth of what left, so row count alone cannot explain the volume.',
    'The attachments do. 900 records at 3.1 kilobytes plus 780 attachments at 68 kilobytes is approximately 55 megabytes against an observed 61.4, a difference of about 11 per cent that nothing on the board explains.',
    'So the defensible answer is 900 patients, with a floor of 400 and a ceiling of 2,100, and the basis stated for each.',
    'Legal were told 400 at 09:20, 2,100 was said on the bridge and is in the minutes, and the communications draft still reads "fewer than 500".',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1530'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.notify-legal', 'act.attribute-named', 'act.tune'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'The intrusion is over and the hard part has not started. The credential is revoked, the ' +
        'address is blocked, and what remains is a counting problem with a deadline on it, which ' +
        'is unfamiliar work for a floor trained to contain things. The first thing worth saying ' +
        'out loud is what the deadline is for: legal need a scope in order to make a notification ' +
        'decision, and the number this floor produces is an input to that decision rather than the ' +
        'decision itself. Getting that distinction established at 10:40 is much easier than ' +
        'establishing it at 13:55 with an executive on the line. Raise it and hold it: nothing has ' +
        'been counted yet and the first number anybody says will be repeated for the rest of the ' +
        'day.',
      standIn:
        'Intrusion is done: credential revoked, address blocked. What is left is a counting problem ' +
        'with a two o\'clock deadline, which is not what this floor is built for. Legal need a ' +
        'scope so they can decide about notification. Our number is an input to their decision, ' +
        'not the decision, and I want that said now rather than at five to two. And nobody says a ' +
        'number yet, because the first one gets repeated all day.',
      commandOptions: [
        { command: "awk -F, '$3==\"QUERY\" && $1 ~ /02:1/ {print $1, $4, $6}' /var/log/patientdb/audit.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "02:14" /var/log/patientdb/audit.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status patientdb', ...STATUS_CHECK },
        { command: 'cat /var/log/patientdb/audit.csv', ...DUMP_ALL },
        { command: 'grep -c QUERY /var/log/patientdb/audit.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the statement that ran at 02:14 before anybody estimates anything.',
      guidance:
        'Legal want a number. Ask what the number is for before producing one.',
    },
    {
      eventId: 'ev.2',
      verdict: 'decoy',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1530'],
      appearsToBe:
        'The answer, and it is already in a communications draft as "fewer than 500". The audit log ' +
        'is the authoritative record of what the database did, it says 400, and nothing about the ' +
        'row looks like an estimate. It is a ceiling imposed by an audit sampling threshold, which ' +
        'is documented in the platform reference and visible in the fact that every large query in ' +
        'twelve months reports exactly 400.',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.notify-legal', 'act.dismiss', 'act.attribute-named', 'act.triage-high'],
      escalateTo: ['network-analyst', 'fusion-analyst'],
      why:
        'Four hundred is in the audit log, the audit log is the database describing its own ' +
        'behaviour, and the number is already downstream in a communications draft. All of that ' +
        'makes it feel settled, and none of it makes it right. The check that matters costs one ' +
        'query and almost nobody runs it: look at the row counts on other large queries in the ' +
        'log. Every one of them is 400 as well. A figure that appears identically on every large ' +
        'result is not a measurement, it is a limit, and the moment that is established the 400 ' +
        'stops being an estimate and becomes a floor with no upper bound attached. Corroborate ' +
        'before reporting, because this number has already travelled and the cost of moving it ' +
        'later is not technical.',
      standIn:
        'The audit log says 400 and that is already in a comms draft, which makes it feel settled. ' +
        'One query says otherwise: look at the row counts on every other large query in the log. ' +
        'They are all 400 too. A number that shows up identically on every big result is a limit, ' +
        'not a measurement. So 400 is a floor with nothing attached to the top of it, and it has ' +
        'already travelled.',
      commandOptions: [
        { command: "awk -F, '$3==\"QUERY\" {print $6}' /var/log/patientdb/audit.csv | sort -n | uniq -c | tail", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$6==400' /var/log/patientdb/audit.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status patientdb', ...STATUS_CHECK },
        { command: 'cat /var/log/patientdb/audit.csv', ...DUMP_ALL },
        { command: 'grep -c 400 /var/log/patientdb/audit.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at the row counts on every other large query in that log, not just this one.',
      guidance:
        'The log says 400. Ask what it says about other big queries.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1030'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.corroborate'],
      outOfLaneActions: ['act.contact-attacker', 'act.dismiss', 'act.notify-legal', 'act.isolate'],
      escalateTo: ['fusion-analyst', 'ir-lead'],
      why:
        'Sixty-one point four megabytes against an expected 1.2, which is fifty times the size the ' +
        'audit log implies, and this is the row that breaks the comfortable answer. State the ' +
        'arithmetic rather than the conclusion: a record in this schema serialises to about 3.1 ' +
        'kilobytes, 400 of them is roughly 1.2 megabytes, and 61.4 is not that. What follows is ' +
        'only that 400 is wrong, and specifically that it is too small, which is the useful ' +
        'direction to be wrong in early. Resist converting bytes into a patient count here, ' +
        'because bytes are not records and dividing 61.4 by 3.1 produces a confident number that ' +
        'is also wrong. The transfer size bounds the problem and does not solve it, and saying so ' +
        'precisely is what keeps the next estimate from being another guess dressed as a ' +
        'measurement.',
      standIn:
        'Sixty-one point four megabytes. A record in this schema is about 3.1 kilobytes, so 400 ' +
        'rows is roughly 1.2 megabytes. This is fifty times that. All that tells us is 400 is ' +
        'wrong and wrong on the small side, which is the good direction to find out early. I am ' +
        'not dividing 61.4 by 3.1 and calling it a patient count, because bytes are not records ' +
        'and that would be another guess with a decimal point on it.',
      commandOptions: [
        { command: "awk '$1 ~ /02:1[5-9]/ && $3==\"RMG-DB-01\" {print $1, $5, $8}' /var/log/flows.log", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"RMG-DB-01\" {s+=$8} END {print s/1048576 \" MB\"}' /var/log/flows.log", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 203.0.113.71', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'netstat -an | grep 5432', ...WRONG_TARGET },
      ],
      commandNudge:
        'Work out how large 400 records would be, then compare it to what actually left.',
      guidance:
        'You have a row count and a transfer size. Ask whether they agree.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.corroborate'],
      outOfLaneActions: ['act.notify-legal', 'act.attribute-named', 'act.dismiss', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'The explanation, and it is documented rather than discovered. The audit configuration ' +
        'counts rows accurately up to 400 and writes 400 for anything at or above it, which is in ' +
        'the platform reference under audit sampling and was set at install in 2021 to bound audit ' +
        'volume. Nobody did anything wrong and nothing is broken. What matters for the next three ' +
        'hours is the shape of what this leaves: 400 is a floor with no ceiling attached, so it is ' +
        'not a small number, it is an unbounded one, and the difference is the whole reason the ' +
        'communications draft is dangerous. Preserve the audit configuration alongside the log ' +
        'itself, because the number in that log will be quoted by somebody who has not read this ' +
        'row, and the configuration is what explains why the record says what it says.',
      standIn:
        'Here is why it says 400. The audit counts accurately to 400 and then writes 400 for ' +
        'anything at or above it, documented in the platform reference, set at install in 2021 to ' +
        'bound audit volume. Nothing is broken and nobody did anything wrong. But it means 400 is a ' +
        'floor with nothing on top of it. That is not a small number, it is an unbounded one, and ' +
        'that is exactly why the comms draft is a problem. Preserving the audit config with the ' +
        'log, because somebody will quote that 400 without reading this.',
      commandOptions: [
        { command: 'grep -iA3 "audit_row_limit\\|sampling" /etc/patientdb/audit.conf', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$6>=400 {c++} END {print c}' /var/log/patientdb/audit-12mo.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status patientdb', ...STATUS_CHECK },
        { command: 'cat /etc/patientdb/audit.conf', ...DUMP_ALL },
        { command: 'sed -i "s/400/100000/" /etc/patientdb/audit.conf', ...MUTATE },
      ],
      commandNudge:
        'Read the audit configuration and find out what it does with a large result.',
      guidance:
        'Every big query says 400. Ask the configuration why.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.notify-legal', 'act.revoke-key', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['fusion-analyst', 'ir-lead'],
      why:
        'A ceiling, which is worth having and is not an answer. The patients table holds 2,100 ' +
        'rows, so no query against it can return more, and that bounds the problem from above for ' +
        'the first time today. It is also the number most likely to be misused in the next hour, ' +
        'because somebody under pressure will reach for the worst case and report it as the scope, ' +
        'and 2,100 was already said on the bridge and is in the minutes. Note what it does not ' +
        'resolve: 2,100 records serialised in full is about 6.5 megabytes against an observed 61.4, ' +
        'so even the ceiling does not explain the volume. Something in that transfer is not a ' +
        'patient row, and finding out what is the difference between a bounded estimate and a real ' +
        'one.',
      standIn:
        'The table holds 2,100 rows, so nothing can have returned more. That is a real ceiling and ' +
        'it is the number somebody is going to grab and report, and 2,100 is already in the bridge ' +
        'minutes. It also does not explain the volume: 2,100 records in full is about 6.5 ' +
        'megabytes and 61.4 left. Something in that transfer is not a patient row.',
      commandOptions: [
        { command: 'psql -c "select count(*) from patients where active"', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, 'END {print NR}' /evidence/patientdb/patients-export.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status patientdb', ...STATUS_CHECK },
        { command: 'cat /evidence/patientdb/patients-export.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/patientdb/patients-export.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the total size of the table, which is the most anything could have returned.',
      guidance:
        'You have a floor. Ask what the ceiling is.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1530'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.timeline'],
      outOfLaneActions: ['act.notify-legal', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The statement is the answer and everything before it was an approximation of the ' +
        'statement. It selects from patients joined to clinical_attachments filtered by clinic_id ' +
        '= 14, which is the respiratory clinic, 900 patients, 780 of them with at least one ' +
        'attachment. Attachments are stored inline and average 68 kilobytes, which is the missing ' +
        'variable that made the byte arithmetic incoherent all morning: 900 records at 3.1 ' +
        'kilobytes plus 780 attachments at 68 kilobytes is about 55 megabytes against an observed ' +
        '61.4. That is the first estimate today where the row count and the transfer size are ' +
        'explained by the same story, which is what makes it defensible rather than merely newer. ' +
        'The number is 900 patients, and it is 900 because of a WHERE clause rather than because ' +
        'of a division.',
      standIn:
        'The statement is the answer. Patients joined to clinical_attachments, filtered on clinic ' +
        '14, which is respiratory: 900 patients, 780 of them with an attachment, attachments stored ' +
        'inline at about 68 kilobytes each. That is the variable that has been missing all ' +
        'morning. Nine hundred records at 3.1k plus 780 attachments at 68k is about 55 megabytes ' +
        'against 61.4 observed. First time today the row count and the byte count tell the same ' +
        'story. Nine hundred patients, and it is 900 because of a WHERE clause, not a division.',
      commandOptions: [
        { command: "awk -F, '$1 ~ /02:14/ {print $5}' /var/log/patientdb/audit.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'psql -c "select count(*) from patients where clinic_id=14"', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status patientdb', ...STATUS_CHECK },
        { command: 'cat /var/log/patientdb/audit.csv', ...DUMP_ALL },
        { command: 'grep -c clinic /var/log/patientdb/audit.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read the statement itself, including its WHERE clause, and count what that clause selects.',
      guidance:
        'Stop estimating from sizes. Ask what the query actually asked for.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['fusion-analyst', 'mitigation-specialist'],
      correctActions: ['act.notify-legal', 'act.sequence-remedy'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.triage-high'],
      escalateTo: [],
      why:
        'Three numbers before lunch, all honestly arrived at, and that is the finding this row ' +
        'exists for. Four hundred went to legal at 09:20 and is in a communications draft as fewer ' +
        'than 500. Two thousand one hundred was said on the bridge and is in the minutes. The ' +
        'floor is about to say 900. Nobody has been careless: each figure was the best available ' +
        'when it was given, and each was given as a number rather than as an estimate with a ' +
        'basis, which is the actual mistake and it was made at 09:20. The request for "the ' +
        'smallest number we can defend" has to be answered directly and without hedging, because ' +
        'it is not a request for analysis: the smallest defensible number and the correct number ' +
        'are the same thing or the word defensible means nothing. Say 900, say why, say what would ' +
        'move it, and correct the draft before it goes anywhere.',
      standIn:
        'Three numbers before lunch and none of us was careless. Four hundred went to legal at ' +
        '09:20 and is in a comms draft as fewer than 500. Two thousand one hundred is in the bridge ' +
        'minutes. We are about to say 900. The mistake was at 09:20 and it was giving a number ' +
        'instead of an estimate with a basis. And on the smallest number we can defend: the ' +
        'smallest defensible number is the correct one or the word means nothing. Nine hundred, ' +
        'here is why, here is what would move it, and somebody fix that draft now.',
      commandNudge:
        'List every number that has been said today, who has it, and where it is written down.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.notify-legal', 'act.dismiss', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The output is not a number, it is a number with a basis and an error bar, and this is the ' +
        'row that separates a floor that reports well from one that is merely right. Known: the ' +
        'statement text, the clinic filter, 900 on the clinic list, 780 with attachments, and 61.4 ' +
        'megabytes observed. Assumed: that the query completed, that nothing was filtered after ' +
        'the join, and that the average sizes hold for this clinic. The arithmetic lands at 55 ' +
        'against 61.4, an unexplained 11 per cent, and that gap belongs in the report rather than ' +
        'being rounded away, because the honest position is 900 with a floor of 400 and a ceiling ' +
        'of 2,100 and a discrepancy nobody has closed. A range given as a range can be narrowed ' +
        'later without anybody losing credibility. A point estimate given as fact and revised is ' +
        'what makes a regulator start asking about the rest of the submission.',
      standIn:
        'What legal get is not a number, it is a number with a basis and an error bar. Known: the ' +
        'statement, the clinic filter, 900 on the list, 780 with attachments, 61.4 megabytes out. ' +
        'Assumed: the query completed, nothing was filtered after the join, and the average sizes ' +
        'hold here. That gives 55 against 61.4 observed, an unexplained eleven per cent, and that ' +
        'goes in the report rather than getting rounded away. Nine hundred, floor 400, ceiling ' +
        '2,100, one gap we have not closed. A range narrows later without costing anything. A ' +
        'point estimate that gets revised is what makes a regulator start reading the rest of it ' +
        'twice.',
      commandNudge:
        'Write down what is measured and what is assumed, in two lists, before writing the number.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.sequence-remedy', 'act.compensating-control'],
      outOfLaneActions: ['act.notify-legal', 'act.isolate', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The line this floor must not cross, and the pressure to cross it is coming from people ' +
        'who outrank everybody in the room. Whether to notify is a decision for legal and the ' +
        'caldicott guardian. What this floor owes them is the scope, the basis, and the honest ' +
        'uncertainty, delivered before 14:00, and it does not owe them a recommendation about ' +
        'notification even when asked for one directly. That is not evasion and should be said ' +
        'without apology: a SOC that makes the legal call under time pressure has taken on a ' +
        'decision it cannot carry and has given legal a conclusion instead of the facts they need ' +
        'to reach their own. Two things are worth telling them because they change the shape of ' +
        'the decision and are easy to miss: a notification may be staged where full information is ' +
        'not available, and a figure revised upward from a stated range is routine where one ' +
        'revised downward from an asserted fact is not. And there is a control finding for the ' +
        'week after: an audit configuration that stops counting at 400 means this problem recurs ' +
        'on every future incident, and it is a one line change.',
      standIn:
        'We do not decide whether to notify. That is legal and the caldicott guardian. What we owe ' +
        'them by two o\'clock is the scope, the basis and the honest uncertainty, and we do not owe ' +
        'them a recommendation even when somebody asks for one, and I am not apologising for that. ' +
        'Two things they may not know: notification can be staged when you do not have full ' +
        'information, and a number revised up from a stated range is routine where one revised ' +
        'down from an asserted fact is not. And for next week: an audit config that stops counting ' +
        'at 400 means we have this exact argument on every future incident. One line change.',
      commandNudge:
        'Establish who actually makes the notification decision before drafting anything for them.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['soc-operator', 'cloud-security'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.notify-legal', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'Two point one gigabytes leaving a database server on the night of a confirmed exfiltration ' +
        'is the most alarming row on the board and it is the nightly backup. Four checks close it ' +
        'and each is quicker than the last: it went to an internal address, it has run at 01:00 ' +
        'every night for three years within ten per cent of the same size, the destination is the ' +
        'backup appliance, and the backup catalogue records a successful completion. The row is ' +
        'here because the floor is three hours into a counting problem with a deadline, and 2.1 ' +
        'gigabytes is thirty-four times the transfer everybody is arguing about. Adding it to the ' +
        'scope would take the estimate from 900 patients to the entire database in one step, on a ' +
        'day when the number has already moved three times and a communications draft is being ' +
        'rewritten. Close it, and say plainly on the bridge that it was checked and why, because ' +
        'somebody else will see the same flow record within the hour.',
      standIn:
        'Two point one gigabytes off a database server on this of all nights, and it is the backup. ' +
        'Internal address, 01:00 every night for three years within ten per cent, destination is ' +
        'the backup appliance, catalogue says completed. Closing it. And I am saying so on the ' +
        'bridge with the reasons, because somebody else is going to find that same flow record ' +
        'within the hour and we do not need a fourth number today.',
      commandOptions: [
        { command: "awk '$3==\"RMG-DB-02\" && $1 ~ /01:0/ {print $1, $5, $8}' /var/log/flows-3y.log | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "2026-09-02" /var/log/backup/catalogue.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status backup-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/flows-3y.log', ...DUMP_ALL },
        { command: 'grep -c RMG-DB-02 /var/log/flows.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check where that transfer went and whether it happens every night.',
      guidance:
        'It is thirty times larger. Ask whether it has happened before.',
    },
  ],
};
