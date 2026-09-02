/**
 * Scenario 72: No Evidence.
 *
 * A supplier has been breached and will not tell you whether it reached you.
 * Everything you learn tonight, you learn from your own side of the connection.
 *
 * HOW THIS DIFFERS FROM SCENARIO 29
 *
 * "Somebody Else's Breach" is the case where there is genuinely nothing on your
 * estate to look at: you push a file out nightly, the supplier holds it, and
 * every technical reflex is useless. This is the harder and commoner version.
 * The supplier holds a service principal inside your directory, which means
 * there IS evidence here, it is sufficient on its own, and the floor's failure
 * mode is not helplessness but waiting: assuming the answers must come from the
 * vendor, because the incident is theirs.
 *
 * WHAT THIS TEACHES
 *
 * How to read a breach notification, and how to work an incident on somebody
 * else's estate with none of their telemetry.
 *
 * "No evidence of unauthorised access to customer data" is a statement about
 * evidence rather than about access, written by the party that also decides
 * what evidence gets collected and how long it is kept. It is very probably
 * true and it carries almost no information, and it is the single sentence most
 * likely to close this incident early.
 *
 * WHAT YOU ACTUALLY HAVE
 *
 * A machine integration with a rigid 31 month baseline, which makes a deviation
 * from it obvious without anybody's cooperation. It did something different at
 * three in the morning on the fifth of August, nine days before the vendor says
 * they detected anything.
 *
 * EXPERT INSTRUMENTS IN USE
 *
 * The notification and the vendor's own public status history give two seats
 * two different accounts of the same month. The vendor log export is withheld,
 * so the floor has to reach the conclusion from its own directory alone. And
 * whether the most sensitive field was included cannot be settled, because the
 * only field-level record belongs to the company that will not send it.
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

const ID = 'no-evidence';

export const NO_EVIDENCE: Scenario = {
  id: ID,
  title: 'No Evidence',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 16:40 at Ridgeline Medical Group. The workforce scheduling supplier has sent a breach ' +
    'notification. It runs to four paragraphs and answers none of the questions anybody here needs ' +
    'answered.',
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
      summary: 'A supplier breach notification, nineteen days after their detection date',
      detail:
        'Vantail, which provides the workforce scheduling platform used by all 4,100 Ridgeline ' +
        'staff, has notified customers of a security incident. The notification states the incident ' +
        'was detected on 14 August, that an unauthorised third party accessed parts of their ' +
        'production environment, that they have engaged external specialists, and that there is no ' +
        'evidence of unauthorised access to customer data. It names no systems, no dates of access, ' +
        'and no affected tenants.',
      source: 'Vantail notification',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'alert-queue',
      summary: 'The vendor status history does not match the vendor notification',
      detail:
        'Vantail\'s public status page incident history records a two-hour "elevated error rates in ' +
        'the identity service" event on 2 August, and a four-hour "scheduled emergency maintenance" ' +
        'on 6 August. Neither is referenced in the notification. The notification\'s detection date ' +
        'of 14 August is twelve days after the first of those and eight after the second.',
      expertDetail:
        'The Vantail notification states: "Our security team detected anomalous activity on 14 ' +
        'August 2026 and immediately began an investigation. We have no evidence of unauthorised ' +
        'access to customer data. Out of an abundance of caution we are notifying all customers."',
      expertAlsoOn: ['raw-log'],
      source: 'Vantail status page',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'cloud-audit',
      summary: 'The vendor holds a service principal in the Ridgeline directory',
      detail:
        'svc-vantail-sync holds directory read access across all staff objects, granted at ' +
        'integration in 2023 so the scheduling platform can keep its roster current. Its normal ' +
        'pattern is a delta query every 30 minutes returning changed objects only, averaging 40 ' +
        'objects, and one full synchronisation at 02:00 on the first Sunday of each month. It has ' +
        'run that way for 31 months.',
      source: 'svc-vantail-sync',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 490,
      surface: 'cloud-audit',
      summary: 'It pulled every staff object at 03:12 on 5 August, on a Wednesday',
      detail:
        'On 5 August at 03:12 svc-vantail-sync issued a full directory query returning all 4,140 ' +
        'staff objects, complete with every attribute the grant permits. 5 August is a Wednesday ' +
        'and is not the first Sunday of any month. No corresponding full synchronisation appears in ' +
        'the Vantail scheduling platform\'s own change history. The delta queries continued ' +
        'normally before and after it.',
      source: 'svc-vantail-sync',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 660,
      surface: 'host-artefact',
      withheldAtExpert: true,
      summary: 'The vendor eventually supplies a partial log export',
      detail:
        'Under pressure Vantail supplies a filtered export covering the Ridgeline tenant. It shows ' +
        'the 03:12 query on 5 August originating from an internal Vantail host that is not part of ' +
        'the synchronisation service, authenticated with the integration credential, in a session ' +
        'that also enumerated seven other customer tenants. The export is truncated at 5 August and ' +
        'carries a footer stating that it is provided without warranty as to completeness.',
      source: 'Vantail export',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 830,
      surface: 'network-flow',
      summary: 'The response to that query was two hundred times a normal one',
      detail:
        'Outbound volume to the Vantail integration endpoint averages 30 to 60 kilobytes per delta ' +
        'query. The 03:12 exchange on 5 August transferred 11.4 megabytes in a single session ' +
        'lasting 94 seconds. The only comparable transfers in twelve months are the monthly full ' +
        'synchronisations, all at 02:00 on first Sundays, all between 10.9 and 11.6 megabytes.',
      source: 'network monitoring',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1000,
      surface: 'alert-queue',
      summary: 'What the notification actually claims',
      detail:
        'The operative sentence is "no evidence of unauthorised access to customer data". The ' +
        'notification does not state that customer data was not accessed, does not say what ' +
        'logging exists in the affected environment, and does not say whether that logging covers ' +
        'the integration path. Vantail\'s published security documentation states that ' +
        'customer-facing API access logs are retained for 30 days and internal service-to-service ' +
        'logs for 7.',
      source: 'Vantail notification',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1170,
      surface: 'raw-log',
      expertOnly: true,
      summary: 'Whether the identifier field was included cannot be established here',
      detail:
        'The directory grant permits reading a staff attribute set that includes the national ' +
        'identifier, held for payroll. Ridgeline directory audit records that a query was made and ' +
        'which objects were returned, but not which attributes were serialised into the response. ' +
        'The 11.4 megabyte size is consistent with the full attribute set and also with the ' +
        'attribute set minus that field. Only Vantail holds a field-level record, and their counsel ' +
        'has declined to release it without a court order.',
      source: 'directory audit',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1340,
      surface: 'alert-queue',
      summary: 'The platform rosters every clinical shift in the organisation',
      detail:
        'Vantail holds the shift roster for all 4,100 staff including the on-call schedules for ' +
        'emergency, operating rooms and critical care. Suspending the integration stops roster ' +
        'synchronisation, so new starters, leavers and shift swaps stop propagating, and the ' +
        'weekend roster publishes on Thursday at 18:00. Rotating the integration credential ' +
        'requires Vantail to accept the new one, and their support queue is currently answering in ' +
        'four days.',
      source: 'workforce operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1510,
      surface: 'raw-log',
      summary: 'Nothing watches what a supplier integration does',
      detail:
        'Fourteen third-party integrations hold service principals in the Ridgeline directory. ' +
        'Alerting covers failed authentication and permission changes on those principals. Nothing ' +
        'alerts on query volume, on a full read outside its schedule, or on a response size ' +
        'anomaly. The 5 August query generated no alert of any kind and was found tonight only ' +
        'because somebody went looking after the notification arrived.',
      source: 'detection coverage',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.11',
      atSeconds: 1680,
      surface: 'alert-queue',
      summary: 'A second integration also performed a full read this month',
      detail:
        'svc-medrota-import performed a full directory read of all 4,140 staff objects on 12 ' +
        'August at 01:00. Its contract and integration document specify a full read on the second ' +
        'Tuesday of each month at 01:00, it has done so on the second Tuesday for 19 consecutive ' +
        'months, the transfer size matches its previous 18 runs within two per cent, and the ' +
        'corresponding import appears in that supplier\'s job history.',
      source: 'svc-medrota-import',
      claimedSeverity: 'medium',
    },
  ],
};

export const NO_EVIDENCE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Vantail, which provides workforce scheduling for all 4,100 Ridgeline staff, notified customers of a security incident nineteen days after a stated detection date of 14 August.',
    'The notification names no systems, no dates of access and no affected tenants, and its operative sentence is that there is no evidence of unauthorised access to customer data.',
    'Vantail holds svc-vantail-sync in the Ridgeline directory, with read access to all staff objects. Its pattern for 31 months has been a delta query every 30 minutes returning around 40 changed objects, plus one full synchronisation at 02:00 on the first Sunday of each month.',
    'On Wednesday 5 August at 03:12, that principal issued a full query returning all 4,140 staff objects with every permitted attribute, transferring 11.4 megabytes against a normal delta of 30 to 60 kilobytes. No corresponding synchronisation appears in the vendor platform\'s own change history.',
    'That is nine days before the date the vendor says they detected anything, and three days after a two-hour identity service disruption on their public status page that the notification does not mention.',
    'The directory records which objects were returned and not which attributes were serialised, so whether the national identifier field was included cannot be established at Ridgeline. Only Vantail holds a field-level record and their counsel has declined to release it.',
    'Vantail retains customer-facing API logs for 30 days and internal service-to-service logs for 7, so by the time the notification arrived, the internal logs covering 5 August no longer existed.',
    'Nothing at Ridgeline alerts on integration query volume, on a full read outside schedule, or on response size, and the 5 August query produced no alert at all.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1199'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.tune'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'Nineteen days, four paragraphs, and no answer to any question this organisation needs ' +
        'answered. The reflex is to wait for more information from the vendor, and it is wrong for ' +
        'a reason worth stating at the start: the vendor is the only party who can answer the ' +
        'questions and is also the party with the strongest interest in the answers, and they have ' +
        'already had nineteen days to write four paragraphs. Nothing better is coming tonight. ' +
        'Declare on it and reframe the work immediately, because this is not an investigation into ' +
        'a vendor breach, which is not possible from here. It is an investigation into what that ' +
        'vendor touched on the Ridgeline side, which is entirely possible and does not need ' +
        'anybody\'s permission.',
      standIn:
        'Vantail have notified a breach, nineteen days after they say they detected it, four ' +
        'paragraphs, no systems, no dates, no tenants named. We are not waiting for a better ' +
        'version: they are the only ones who can answer and the ones with the most to lose by ' +
        'answering, and they have had nineteen days. Declaring. And we are not investigating their ' +
        'breach, we cannot. We are investigating what they touched on our side, which we can do ' +
        'without asking anybody.',
      commandOptions: [
        { command: "awk -F, '$3 ~ /vantail/ {print $1, $2, $4}' /var/log/suppliers/integrations.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -in "detect\\|access\\|evidence" /evidence/vendor/vantail-notification.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status directory', ...STATUS_CHECK },
        { command: 'cat /evidence/vendor/vantail-notification.txt', ...DUMP_ALL },
        { command: 'curl -s https://status.vantail.example/api/incidents', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out what access that supplier holds on your own estate.',
      guidance:
        'You cannot investigate their systems. Ask what they can reach in yours.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'threat-intel',
      alsoAppropriate: ['log-analyst', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.assess-actor'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.contact-attacker', 'act.declare'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The vendor is publishing two accounts of their own August and neither seat holds both. The ' +
        'notification gives a detection date of 14 August. The public status history records ' +
        'elevated error rates in the identity service on 2 August and four hours of emergency ' +
        'maintenance on 6 August, and the notification mentions neither. Those may be unrelated ' +
        'operational events and frequently are; what makes them worth carrying is that the identity ' +
        'service is the component an integration credential authenticates against, and that ' +
        'emergency maintenance is what an incident response looks like from outside before anybody ' +
        'has decided to call it one. This does not establish that the breach began on 2 August. It ' +
        'establishes that 14 August is the vendor\'s detection date rather than a start date, that ' +
        'the two are not the same thing, and that the Ridgeline investigation must not use 14 ' +
        'August as its earliest boundary. Search the full window, not theirs.',
      standIn:
        'They are publishing two accounts of their own August. The notification says detected 14 ' +
        'August. Their status page has elevated errors in the identity service on 2 August and four ' +
        'hours of emergency maintenance on the sixth, neither of which the notification mentions. ' +
        'Could be unrelated, often is. But the identity service is what an integration credential ' +
        'authenticates against, and emergency maintenance is what incident response looks like from ' +
        'outside before anybody calls it that. Fourteen August is their detection date, not a start ' +
        'date. We do not use it as our earliest boundary.',
      commandOptions: [
        { command: 'grep -iE "august|incident|maintenance" /evidence/vendor/vantail-status-history.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'diff <(grep -oE "[0-9]+ August" /evidence/vendor/vantail-notification.txt) <(grep -oE "[0-9]+ August" /evidence/vendor/vantail-status-history.txt)', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem', ...STATUS_CHECK },
        { command: 'cat /evidence/vendor/vantail-status-history.txt', ...DUMP_ALL },
        { command: 'curl -s https://status.vantail.example/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Compare the dates in the notification against the vendor\'s own public incident history.',
      guidance:
        'They gave you one date. Ask what else they have published about that month.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Establishing normal before looking for abnormal, which on a night with no vendor telemetry ' +
        'is the entire method. The principal holds directory read across all staff objects, granted ' +
        'at integration in 2023 for a legitimate reason, and has behaved identically for 31 months: ' +
        'a delta query every 30 minutes returning about 40 changed objects, plus one full ' +
        'synchronisation at 02:00 on the first Sunday of each month. That is an unusually crisp ' +
        'baseline and it is the good news on this board, because an integration with a rigid ' +
        'schedule and a stable response size is one where a deviation is obvious without needing ' +
        'anybody else\'s logs. Note what is not a finding: the breadth of the grant. Read access to ' +
        'every staff object is a lot and it is also what a scheduling platform genuinely needs, so ' +
        'the grant is a governance conversation for another day rather than evidence of anything ' +
        'tonight.',
      standIn:
        'Before I look for anything odd I want normal. This principal reads all staff objects, ' +
        'granted in 2023 for a real reason, and it has behaved identically for 31 months: delta ' +
        'query every thirty minutes, about forty changed objects, plus one full sync at 02:00 on ' +
        'the first Sunday of the month. That is a very crisp baseline, which is the good news, ' +
        'because a deviation from it is visible without needing anything from them. And the grant ' +
        'being broad is not a finding tonight, it is what a scheduling platform actually needs.',
      commandOptions: [
        { command: "awk -F, '$2==\"svc-vantail-sync\" {print substr($1,1,10), $5}' /var/log/directory/queries.csv | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"svc-vantail-sync\" && $5>1000 {print $1, $5}' /var/log/directory/queries.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status directory', ...STATUS_CHECK },
        { command: 'cat /var/log/directory/queries.csv', ...DUMP_ALL },
        { command: 'az ad sp delete --id svc-vantail-sync', ...MUTATE },
      ],
      commandNudge:
        'Establish what that service principal normally does before looking for what it did.',
      guidance:
        'You have no vendor logs. Ask what you can learn from your own.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1199', 'T1213'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.dismiss', 'act.reset-password'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The finding, and it came entirely from this side of the connection. A full query returning ' +
        'all 4,140 staff objects with every permitted attribute, at 03:12 on Wednesday 5 August, ' +
        'from an integration whose full reads happen at 02:00 on first Sundays and have done for 31 ' +
        'months. Three properties make it unarguable rather than merely odd: wrong day of week, ' +
        'wrong hour, and no corresponding synchronisation in the vendor platform\'s own change ' +
        'history, so the vendor\'s own product does not think it did this either. And the date is ' +
        'the part to put in front of the lead first: 5 August is nine days before the detection ' +
        'date in the notification. Whatever Vantail found on the fourteenth, something was using ' +
        'this integration on the fifth. That single fact converts a vague vendor notification into ' +
        'a Ridgeline incident with a timestamp, and it is available without asking anybody for ' +
        'anything.',
      standIn:
        'Here it is, and it is entirely from our side. Full query, all 4,140 staff objects, every ' +
        'permitted attribute, 03:12 on Wednesday 5 August. That integration does full reads at ' +
        '02:00 on first Sundays and has for 31 months. Wrong day, wrong hour, and no matching sync ' +
        'in their own platform change history, so their product does not think it did this either. ' +
        'And 5 August is nine days before the detection date in their notification. Whatever they ' +
        'found on the fourteenth, something was using this integration on the fifth.',
      commandOptions: [
        { command: "awk -F, '$2==\"svc-vantail-sync\" && $5>4000 {print $1, $5, $6}' /var/log/directory/queries.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "full-sync\\|fullsync" /evidence/vendor/vantail-job-history.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status directory', ...STATUS_CHECK },
        { command: 'cat /var/log/directory/queries.csv', ...DUMP_ALL },
        { command: 'az ad sp credential reset --id svc-vantail-sync', ...MUTATE },
      ],
      commandNudge:
        'Find every full read that principal made and check each against its schedule.',
      guidance:
        'You know its schedule. Ask whether anything happened off it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1199'],
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'What the vendor eventually sends, and how to hold it. The export shows the 03:12 query ' +
        'originating from an internal Vantail host that is not part of the synchronisation service, ' +
        'authenticated with the integration credential, in a session that also enumerated seven ' +
        'other customer tenants. That confirms the Ridgeline finding from the other side and widens ' +
        'it: this is not a Ridgeline incident, it is one of at least eight. Two things about the ' +
        'artefact itself have to be recorded rather than assumed away. It is truncated at 5 August, ' +
        'so it shows nothing about what happened after the query that Ridgeline already knew about, ' +
        'and it carries a footer disclaiming completeness, which means the vendor has explicitly ' +
        'declined to assert that this is all of it. Preserve it with that footer intact, because ' +
        'the temptation in the report will be to quote the useful part and drop the caveat, and ' +
        'the caveat is the vendor telling you what the document is worth. Where no export arrives ' +
        'at all, the Ridgeline directory evidence stands on its own and the conclusion does not ' +
        'change.',
      standIn:
        'The export confirms it from their side and makes it worse. The 03:12 query came from an ' +
        'internal Vantail host that is not part of the sync service, on our integration credential, ' +
        'in a session that also enumerated seven other tenants. So this is not our incident, it is ' +
        'at least eight. Two things about the document: it is truncated at 5 August, so it says ' +
        'nothing about anything after the query we already found, and it has a footer disclaiming ' +
        'completeness, which is them declining to assert this is all of it. Preserving it with the ' +
        'footer, because the report will want to quote the useful part and drop the caveat.',
      commandOptions: [
        { command: 'jq -r \'.[] | "\\(.ts) \\(.source_host) \\(.tenant)"\' /evidence/vendor/vantail-export.json | head -20', correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/vendor/vantail-export.json | tee /evidence/vendor/export.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status directory', ...STATUS_CHECK },
        { command: 'cat /evidence/vendor/vantail-export.json', ...DUMP_ALL },
        { command: 'curl -s https://api.vantail.example/logs', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Read what the export covers and, more importantly, what it does not.',
      guidance:
        'They sent you a log. Ask what period it covers and what the footer says.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1213'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.corroborate'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The independent confirmation, and it matters because it comes from a completely different ' +
        'system. The directory says a query returned 4,140 objects; the network says 11.4 megabytes ' +
        'crossed in 94 seconds against a normal delta of 30 to 60 kilobytes. Two systems that share ' +
        'no code and no operator agree, which is what turns a directory record into a fact that ' +
        'survives a vendor disputing it. The comparison set is the useful part: the only ' +
        'transfers of that size in twelve months are the monthly full synchronisations, all at ' +
        '02:00 on first Sundays, all between 10.9 and 11.6 megabytes. So the 5 August exchange is ' +
        'not merely large, it is the same size as a full export of the staff directory, which ' +
        'bounds what was taken without needing the vendor to describe it. Say the number plainly in ' +
        'the readout, because 4,140 staff records is what the notification obligation will turn on ' +
        'and the vendor has not offered a number at all.',
      standIn:
        'Independent confirmation from a completely different system. Directory says 4,140 objects ' +
        'returned; the network says 11.4 megabytes in 94 seconds against a normal delta of thirty ' +
        'to sixty kilobytes. Two systems that share nothing agree, which is what makes this survive ' +
        'them disputing it. And the only comparable transfers all year are the monthly full syncs, ' +
        '10.9 to 11.6 megabytes, all at 02:00 on first Sundays. So the fifth of August is the same ' +
        'size as a full export of our staff directory. Four thousand one hundred and forty records. ' +
        'They have not given us a number at all.',
      commandOptions: [
        { command: "awk '$5 ~ /vantail/ {print $1, $8}' /var/log/flows-12mo.log | sort -k2 -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$5 ~ /vantail/ && $1 ~ /08-05/ {s+=$8} END {print s}' /var/log/flows.log", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn api.vantail.example', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/flows-12mo.log', ...DUMP_ALL },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
      ],
      commandNudge:
        'Compare the transfer size on 5 August against every other transfer to that endpoint.',
      guidance:
        'The directory says what was queried. Ask the network how much actually left.',
    },
    {
      eventId: 'ev.7',
      verdict: 'decoy',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1199'],
      appearsToBe:
        'Reassurance that customer data was not touched, and the sentence most likely to close this ' +
        'incident early. It is a statement about evidence rather than about access, written by the ' +
        'party that also decides what evidence exists, and their own documentation puts retention ' +
        'on internal service-to-service logs at seven days, so by the notification date the records ' +
        'covering 5 August were already gone.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.declare'],
      escalateTo: ['ir-lead'],
      why:
        'Read the sentence exactly as written. No evidence of unauthorised access to customer data ' +
        'is not a statement that customer data was not accessed, and the difference is not lawyerly ' +
        'pedantry, it is the whole of the vendor\'s position. It is a claim about what their ' +
        'evidence shows, made by the organisation that decides what evidence gets collected and how ' +
        'long it is kept, and their published documentation answers that: customer-facing API logs ' +
        'for 30 days, internal service-to-service logs for 7. The 5 August query was 29 days before ' +
        'the notification. Whatever internal records covered it expired three weeks before anybody ' +
        'was told. So the sentence is very probably true and carries almost no information, and the ' +
        'error to avoid is treating it as either a lie or a reassurance. It is neither. Ridgeline ' +
        'has direct evidence from two independent systems that customer data was accessed, and that ' +
        'evidence outranks a statement about somebody else\'s absent logs.',
      standIn:
        'Read it exactly as written. No evidence of unauthorised access to customer data is not ' +
        'a statement that customer data was not accessed. It is a claim about their evidence, made ' +
        'by the people who decide what evidence exists and how long it is kept, and their own ' +
        'documentation says internal service-to-service logs last seven days. The query was 29 days ' +
        'before the notification. Whatever covered it expired three weeks before they told anyone. ' +
        'It is probably a true sentence and it contains almost nothing. We have direct evidence ' +
        'from two independent systems that our data was read, and that beats a statement about ' +
        'their missing logs.',
      commandNudge:
        'Read the operative sentence word by word, then find out what logging the vendor says it ' +
        'keeps and for how long.',
    },
    {
      eventId: 'ev.8',
      verdict: 'ambiguous',
      leaning: 'malicious',
      wouldSettleIt:
        'Vantail\'s field-level API audit record for the 03:12 query on 5 August, which would show ' +
        'which attributes were serialised into the response. It exists, it is within their ' +
        '30 day customer-facing retention as of the notification date, and their counsel has ' +
        'declined to release it without a court order.',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.investigate-hold', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.declare', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'The question the notification obligation turns on, and it cannot be answered from here. The ' +
        'grant permits reading an attribute set that includes the national identifier held for ' +
        'payroll. The Ridgeline directory audit records that a query was made and which objects ' +
        'came back, and not which attributes were serialised into the response, which is an ' +
        'ordinary limitation of directory logging rather than a failure by anybody. And the size ' +
        'does not discriminate: 11.4 megabytes is consistent with the full attribute set and with ' +
        'the set minus that field. Lean toward inclusion, because the query requested everything ' +
        'the grant permitted and there is no mechanism by which a caller taking a full export would ' +
        'exclude one field, and hold that short of certainty because it is an inference about ' +
        'behaviour rather than a record of it. Name the document that would settle it and name who ' +
        'holds it, because that sentence is what turns an unanswerable question into a legal ' +
        'request somebody can actually make in the morning. Certainty in either direction is the ' +
        'failure, and certainty toward exclusion is the expensive one, because it is the version ' +
        'that decides 4,140 people do not need telling.',
      standIn:
        'This is the one the notification obligation turns on and I cannot answer it. The grant ' +
        'covers an attribute set that includes the national identifier. Our directory logs which ' +
        'objects came back, not which attributes were serialised, and 11.4 megabytes fits the full ' +
        'set and the set minus that field equally. I lean toward it being included, because the ' +
        'query asked for everything the grant allowed and nobody taking a full export excludes one ' +
        'field, but that is an inference about behaviour, not a record. Vantail hold the field-level ' +
        'audit, it is inside their thirty day retention, and their counsel wants a court order. ' +
        'That is the request somebody makes in the morning.',
      commandNudge:
        'Establish what the directory audit records about a query, and what it does not.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.revoke-key', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The containment depends on a company that is not answering the phone, which is the ' +
        'condition that makes third-party incidents different from every other kind. Suspending the ' +
        'integration stops roster synchronisation, so starters, leavers and shift swaps stop ' +
        'propagating and the weekend roster publishes Thursday at 18:00 carrying on-call schedules ' +
        'for emergency, operating rooms and critical care. Rotating the credential is the correct ' +
        'action and requires Vantail to accept the new one, and their support queue is answering in ' +
        'four days. So the move is the one that does not need them: narrow the grant rather than ' +
        'revoke the credential. The integration needs name, role, site and shift eligibility to ' +
        'build a roster; it does not need the national identifier, and removing that single ' +
        'attribute from the grant takes effect immediately on the Ridgeline side, requires no ' +
        'vendor cooperation, and means a repeat of 5 August returns materially less. Verify it does ' +
        'not break the roster before Thursday and write the rollback first, because a scheduling ' +
        'platform that stops accepting the directory feed on a Thursday afternoon is a clinical ' +
        'staffing problem by Saturday. Then the compensating control while the credential rotation ' +
        'waits in a four-day queue: alert on any query from that principal outside its schedule, ' +
        'which is trivial given a 31 month baseline. Deliberately left undone and said out loud: ' +
        'the credential is unrotated and will stay unrotated for days, the 4,140 records already ' +
        'taken are not recoverable by any action here, and the other thirteen integrations have not ' +
        'been looked at.',
      standIn:
        'Our containment depends on a company that is not picking up. Suspend the integration and ' +
        'roster sync stops, which means the weekend roster publishes Thursday at six carrying ' +
        'on-call for emergency, operating rooms and critical care. Rotating the credential is right ' +
        'and needs them to accept it, and their support queue is four days. So do the thing that ' +
        'does not need them: narrow the grant instead of revoking the credential. They need name, ' +
        'role, site and shift eligibility to build a roster. They do not need the national ' +
        'identifier. Drop that one attribute, it takes effect on our side immediately, and a repeat ' +
        'of 5 August gets materially less. Test it does not break the roster before Thursday, ' +
        'rollback written first. Meanwhile alert on any query off that principal\'s schedule, which ' +
        'is easy with 31 months of baseline. Left undone: the credential stays unrotated for days, ' +
        'the 4,140 records are gone, and nobody has looked at the other thirteen integrations.',
      commandNudge:
        'Work out which attributes the integration actually needs to do its job.',
    },
    {
      eventId: 'ev.10',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Fourteen supplier integrations hold service principals in this directory and the alerting ' +
        'on them covers failed authentication and permission changes, which are the two things an ' +
        'abused integration does not need to do. The credential worked, so authentication ' +
        'succeeded, and the grant was already sufficient, so nothing needed changing. The 5 August ' +
        'query produced no alert of any kind and was found tonight only because a notification ' +
        'arrived and somebody went looking, which means the detection capability for this class of ' +
        'incident is currently a letter from the vendor. Three cheap rules follow and all of them ' +
        'exploit the same property that made tonight solvable: these integrations are ' +
        'machine-driven and therefore rigidly predictable. A full read outside its documented ' +
        'schedule, a response size outside its established band, and a query rate outside its ' +
        'normal cadence, per principal. Backtest across all fourteen over twelve months before ' +
        'promising volumes, because the two legitimate monthly full reads will be the whole of the ' +
        'first run and the rule is worthless if it fires on those every month.',
      standIn:
        'Fourteen supplier principals in our directory, and we alert on failed authentication and ' +
        'permission changes, which are the two things an abused integration never needs to do. The ' +
        'credential worked and the grant was already enough. Nothing fired on 5 August and we found ' +
        'it because a letter arrived, so our detection capability for this is currently the vendor ' +
        'writing to us. Three cheap rules, all using the thing that made tonight solvable, which is ' +
        'that these are machines and rigidly predictable: full read off schedule, response size ' +
        'outside its band, query rate off cadence, per principal. Backtesting all fourteen over ' +
        'twelve months first, because the legitimate monthly full reads will be the entire first ' +
        'run.',
      commandOptions: [
        { command: "awk -F, '{print $2}' /var/log/directory/queries.csv | sort | uniq -c | sort -rn | head -15", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -icE "failed_auth|permission_change" /evidence/monitoring/directory-alerts.yaml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status directory', ...STATUS_CHECK },
        { command: 'cat /evidence/monitoring/directory-alerts.yaml', ...DUMP_ALL },
        { command: 'grep -c . /var/log/directory/queries.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what the alerting on supplier principals actually covers.',
      guidance:
        'Nothing fired. Ask what the rules on those accounts are watching for.',
    },
    {
      eventId: 'ev.11',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'log-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.revoke-key', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'A second integration performing a full read of all 4,140 staff objects this month, arriving ' +
        'while the floor is holding exactly that as the finding, and it is contractual. Four checks ' +
        'close it and they are the four that convicted the other one, run in the opposite ' +
        'direction: the contract and integration document specify a full read on the second Tuesday ' +
        'at 01:00, it has done that on the second Tuesday for 19 consecutive months, the transfer ' +
        'size matches its previous 18 runs within two per cent, and the corresponding import ' +
        'appears in the supplier\'s job history. That last check is the one that did the real work ' +
        'in both cases: the vendor platform agreeing that it did this, or not agreeing. Close it. ' +
        'The row exists because the correct reflex after tonight is to look hard at every supplier ' +
        'integration, and the first thing that inspection surfaces will be thirteen other ' +
        'integrations doing scheduled bulk reads that all look alarming to somebody who has just ' +
        'learned what a bulk read can mean.',
      standIn:
        'Second integration doing a full read of all 4,140 objects this month and it is in the ' +
        'contract. Full read on the second Tuesday at 01:00, done exactly that for 19 consecutive ' +
        'months, transfer size within two per cent of its previous 18 runs, and the import shows up ' +
        'in their job history. That last one is what did the work in both cases: their platform ' +
        'agreeing it did this, or not agreeing. Closing it. And everybody is about to go and look ' +
        'at all fourteen integrations, which will surface thirteen more scheduled bulk reads that ' +
        'look terrifying tonight.',
      commandOptions: [
        { command: "awk -F, '$2==\"svc-medrota-import\" && $5>4000 {print $1, $5}' /var/log/directory/queries.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "medrota" /evidence/contracts/integrations.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status directory', ...STATUS_CHECK },
        { command: 'cat /var/log/directory/queries.csv', ...DUMP_ALL },
        { command: 'az ad sp credential reset --id svc-medrota-import', ...MUTATE },
      ],
      commandNudge:
        'Check whether that integration has done this before, and whether its contract says it ' +
        'should.',
      guidance:
        'Another full read. Ask whether it is on a schedule.',
    },
  ],
};
