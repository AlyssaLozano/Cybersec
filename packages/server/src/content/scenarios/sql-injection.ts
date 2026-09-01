/**
 * Scenario 24: Select Star.
 *
 * A research database being read out through a reporting form, one page at a
 * time, over eleven days.
 *
 * WHAT THIS TEACHES
 *
 * That an attacker who is patient defeats every threshold-based control the
 * estate has, and that the evidence of a slow theft lives in the application
 * rather than in security tooling. Nothing here trips a rule, because every rule
 * is built around a burst: too many requests, too much data, too many errors.
 * This is 50 rows every four minutes inside working hours from an address that
 * looks like a customer.
 *
 * The finding that turns it from an oddity into a quantity is arithmetic on
 * application logs, and application logs are the one source most SOCs never look
 * at. The web server access log and the database slow query log between them
 * hold the entire incident, and neither is a security product.
 *
 * WHY IT IS FOUND BY A DEVELOPER
 *
 * It opens as a performance ticket, because a query that reads a whole table is
 * slow, and slow is something the business notices when nothing else does.
 * That is realistic and it is the argument for a SOC that talks to engineering.
 *
 * THE ARITHMETIC IS THE DELIVERABLE
 *
 * 3,900 requests at 50 rows is 195,000 rows. Turning that into "the research
 * participant table has 190,000 rows and it has all been read" is the sentence
 * that makes this a notifiable breach rather than an anomaly, and no other seat
 * produces it.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  BROAD_SEARCH,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'select-star';

export const SELECT_STAR: Scenario = {
  id: ID,
  title: 'Select Star',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 11:45. A developer raised a performance ticket about the research portal reporting page ' +
    'being intermittently slow for the last week and a half. Nothing has alerted. The database is ' +
    'not under load and the page is not broken.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'vulnerability-analyst',
    'detection-engineer',
    'forensics',
    'fusion-analyst',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Research portal reporting page intermittently slow for eleven days',
      detail:
        'A developer ticket reports the reporting page taking 8 to 14 seconds intermittently since ' +
        'the 20th, against a normal 300 milliseconds. Database load is normal, the connection pool ' +
        'is healthy, and no other page is affected. The slowness does not reproduce for internal ' +
        'users. This came through engineering, not through any security tooling.',
      source: 'research portal',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'raw-log',
      summary: 'Slow queries all originate from one reporting parameter',
      detail:
        'The database slow query log holds 3,900 entries since the 20th, all from the reporting ' +
        'endpoint. Each contains a UNION clause appended to the intended query, selecting from a ' +
        'table the report does not use. The queries differ only in an incrementing offset. The ' +
        'application builds this query by string concatenation from a URL parameter.',
      source: 'research database',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 310,
      surface: 'network-flow',
      summary: 'Requests arrive at one every four minutes inside working hours only',
      detail:
        'The 3,900 requests come from 14 addresses in a residential range, one request every three ' +
        'to five minutes, only between 08:00 and 18:00 on weekdays. Rate limiting on the portal ' +
        'triggers at 100 requests a minute per address. Nothing here has ever approached that. The ' +
        'pattern is indistinguishable from a slow human user.',
      source: 'residential range',
      target: 'research portal',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 470,
      surface: 'host-artefact',
      summary: 'The extracted table is the research participant register',
      detail:
        'The table named in the UNION clause is the research participant register, holding 190,000 ' +
        'rows with name, date of birth, contact details, recruiting site and study arm. The ' +
        'reporting endpoint runs as a database user with read access to the whole schema rather ' +
        'than to the two views the report needs.',
      source: 'research database',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'raw-log',
      summary: 'Offsets run from 0 to 194,950 in steps of 50',
      detail:
        'The incrementing offset in the 3,900 queries runs from 0 to 194,950 in steps of 50, with ' +
        'no gaps and no repeats. Each request returned 50 rows successfully. The final request ' +
        'completed at 09:12 this morning.',
      source: 'research database',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'The same parameter pattern appears in two other applications',
      detail:
        'A code search across the estate finds the same string-concatenated query construction in ' +
        'the clinical audit tool and the staff directory, both written by the same team using the ' +
        'same internal template. Neither shows any sign of exploitation. Both are internet facing.',
      source: 'code search',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Web application firewall blocked 2,300 injection attempts this month',
      detail:
        'The WAF blocked 2,300 requests matching injection signatures this month, in line with the ' +
        'monthly average of 2,000 to 2,600. All were generic automated probes against paths the ' +
        'estate does not serve. None targeted the research portal reporting endpoint. Rule ' +
        'history: fired 30 times in thirty days, 30 closed as expected background.',
      source: 'web application firewall',
      claimedSeverity: 'medium',
    },
  ],
};

export const SELECT_STAR_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The research portal reporting endpoint builds its query by concatenating a URL parameter into SQL.',
    'Somebody appended a UNION clause selecting from the research participant register, and added an offset they could increment.',
    'They pulled 50 rows at a time, one request every three to five minutes, only during weekday working hours, from 14 residential addresses.',
    'Rate limiting triggers at 100 requests a minute and nothing here came close. No threshold anywhere in the estate was designed for this pace.',
    'The offsets run 0 to 194,950 in steps of 50 with no gaps and no repeats. The register holds 190,000 rows.',
    'The last request completed at 09:12 this morning, which means the extraction is finished.',
    'The only reason anybody looked is that a query reading a whole table is slow, and a developer raised a performance ticket.',
    'The same query construction exists in two other internet-facing applications built from the same internal template.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1190'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'A performance ticket from engineering with no security alert behind it, which is how this ' +
        'class of thing usually arrives. The details that make it worth a look are all in the ' +
        'shape: 8 to 14 seconds against 300 milliseconds is not gradual degradation, database load ' +
        'is normal so nothing is overloaded, one page is affected and the rest are fine, and it ' +
        'does not reproduce for internal users. A single endpoint being slow only for outsiders, ' +
        'with no resource pressure anywhere, means specific requests are expensive rather than the ' +
        'system being busy, and expensive requests are a question worth asking.',
      standIn:
        'Developer ticket says the research portal reporting page has been intermittently slow ' +
        'since the 20th, 8 to 14 seconds against a normal 300 milliseconds. Database load is fine, ' +
        'no other page affected, and it does not reproduce internally. Specific requests are ' +
        'expensive rather than the system being busy. Taking it.',
      commandOptions: [
        { command: 'grep "reporting" /var/log/portal/access.log | tail -20', correct: true, teaches: ALSO_WORKS },
        { command: 'awk \'$10 > 5000 {print $7}\' /var/log/portal/access.log | sort | uniq -c | sort -rn', correct: true, teaches: CORRECT_STEP },
        { command: 'top -b -n1 | head', ...STATUS_CHECK },
        { command: 'systemctl status postgresql', ...STATUS_CHECK },
        { command: 'df -h', ...STATUS_CHECK },
      ],
      commandNudge:
        'Find the slow requests and see whether they all hit the same endpoint.',
      guidance:
        'The system is not busy and one page is slow. Ask what makes those particular requests ' +
        'expensive.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1190'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.write-rule'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'The database slow query log holds the entire attack in plain text, and it is not a ' +
        'security product, which is the point worth taking away. Every one of the 3,900 entries ' +
        'has a UNION clause appended to the intended query, selecting from a table the report does ' +
        'not use, differing only in an offset. There is no ambiguity to weigh: the queries say what ' +
        'they did. The root cause is in the same row, which is that the application builds SQL by ' +
        'concatenating a URL parameter, and that is a code defect rather than a configuration or ' +
        'an operational one.',
      standIn:
        '3,900 slow queries since the 20th, all from the reporting endpoint, every one with a UNION ' +
        'appended selecting from a table the report does not use, differing only in an offset. The ' +
        'application builds the query by concatenating a URL parameter. It is all in the database ' +
        'slow query log.',
      commandOptions: [
        { command: 'grep -i union /var/log/postgresql/slow-query.log | head -20', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c UNION /var/log/postgresql/slow-query.log', ...COUNT_ONLY },
        { command: 'awk \'/UNION/ {print $NF}\' /var/log/postgresql/slow-query.log | head', correct: true, teaches: ALSO_WORKS },
        { command: 'grep -rn "SELECT.*+" /opt/portal/src/reporting.js', ...WRONG_TARGET },
        { command: 'psql -c "select count(*) from pg_stat_statements"', ...WRONG_TARGET },
      ],
      commandNudge:
        'Read the actual text of the slow queries, not just how many there were.',
      guidance:
        'The database logs the queries it ran. Go and read them.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1030', 'T1029'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['detection-engineer', 'fusion-analyst'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['detection-engineer', 'ir-lead'],
      why:
        'Every element of this pattern is chosen to defeat a threshold. One request every three to ' +
        'five minutes against a rate limit of 100 a minute is not close to the line, it is three ' +
        'orders of magnitude below it. Working hours only, weekdays only, residential addresses, ' +
        'fourteen of them: the profile is deliberately indistinguishable from slow human use, and ' +
        'no volumetric control anywhere in the estate would ever fire. The useful conclusion for ' +
        'the debrief is that rate limiting is a control against speed and not against patience, and ' +
        'the detection has to be about query SHAPE rather than request count.',
      standIn:
        '3,900 requests from 14 residential addresses, one every three to five minutes, weekdays ' +
        '08:00 to 18:00 only. Our rate limit is 100 a minute per address. Nothing here got within ' +
        'three orders of magnitude of it. This is built to look like a slow human and no volume ' +
        'control was ever going to see it.',
      commandOptions: [
        { command: 'awk \'{print $1}\' /var/log/portal/access.log | sort | uniq -c | sort -rn | head', correct: true, teaches: CORRECT_STEP },
        { command: 'awk \'/reporting/ {print $4}\' /var/log/portal/access.log | cut -d: -f2 | sort | uniq -c', correct: true, teaches: ALSO_WORKS },
        { command: 'cat /etc/portal/rate-limit.conf', ...WRONG_TARGET },
        { command: 'grep -c reporting /var/log/portal/access.log', ...COUNT_ONLY },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
      ],
      commandNudge:
        'Work out the request rate per address and compare it against the rate limit.',
      guidance:
        'Ask what our thresholds actually catch. Then ask whether being slow gets past all of them.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1213'],
      firstResponder: 'forensics',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'What was taken, which decides everything the organisation does next. The research ' +
        'participant register holds 190,000 rows with name, date of birth, contact details, ' +
        'recruiting site and study arm, and study arm is the field that matters most: it can imply ' +
        'a diagnosis, which makes this special category health data rather than a contact list. ' +
        'The second finding is the reason it was reachable at all. The reporting endpoint runs as a ' +
        'database user with read access to the entire schema instead of the two views the report ' +
        'needs, so the injection reached a table the feature has no business touching. The ' +
        'injection is the bug and the over-broad grant is what made it a breach.',
      standIn:
        'The table they targeted is the research participant register: 190,000 rows with name, date ' +
        'of birth, contact details, recruiting site and study arm. Study arm can imply a diagnosis, ' +
        'so this is special category health data. The reporting endpoint has read on the whole ' +
        'schema rather than the two views it needs.',
      commandNudge:
        'Find out what that table holds and what the reporting user is entitled to read.',
      guidance:
        'Ask what is in the table. Then ask why this feature could reach it at all.',
    },
    {
      eventId: 'ev.5',
      critical: true,
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1030'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.dismiss', 'act.declare'],
      escalateTo: ['ir-lead'],
      why:
        'The arithmetic, and it is the deliverable of the whole hour. Offsets running 0 to 194,950 ' +
        'in steps of 50 with no gaps and no repeats, every request returning successfully, against ' +
        'a table of 190,000 rows. That is not a sample and it is not an attempt: the register has ' +
        'been read in full, and the final request at 09:12 this morning means it is finished rather ' +
        'than ongoing. Both halves change the response. Complete extraction makes this a notifiable ' +
        'breach with a known scope rather than an estimate, and finished means the urgent question ' +
        'is notification rather than containment. Blocking the endpoint now protects nothing that ' +
        'has not already gone, and saying so plainly is more useful than an action that looks ' +
        'decisive.',
      standIn:
        'The offsets run 0 to 194,950 in steps of 50, no gaps, no repeats, every request returned ' +
        '50 rows. The table has 190,000. They have the whole register, not a sample. Last request ' +
        'completed 09:12 this morning, so it is finished. Blocking the endpoint now does not ' +
        'protect anything that has not already left.',
      commandNudge:
        'Extract the offset from each query and check whether the sequence is complete.',
      guidance:
        'Work out how many rows were actually returned in total, and compare it to the size of the ' +
        'table.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1190'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.preserve', 'act.isolate', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The finding that stops this being one application. The same string-concatenated query ' +
        'construction exists in the clinical audit tool and the staff directory, both internet ' +
        'facing, both from the same internal template written by the same team. Neither shows any ' +
        'sign of exploitation, and that is the point: they are exposed and quiet, which is exactly ' +
        'the state the research portal was in until the 20th. A template defect is a class of ' +
        'problem rather than a bug, so the fix is not three patches, it is finding everything built ' +
        'from that template and fixing the template. No other seat produces this, because it comes ' +
        'from searching the estate rather than from investigating the incident.',
      standIn:
        'The same string-concatenated query construction is in the clinical audit tool and the ' +
        'staff directory, both internet facing, both from the same internal template by the same ' +
        'team. Neither has been exploited yet. That is a class of defect, not one bug, and the fix ' +
        'is the template plus everything built from it.',
      commandNudge:
        'Search the rest of the estate for the same query construction.',
      guidance:
        'Ask whether anything else was built the same way. One bad pattern usually has copies.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['detection-engineer'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.scope-estate'],
      escalateTo: [],
      why:
        '2,300 blocked injection attempts, inside the monthly average, all generic automated probes ' +
        'against paths the estate does not serve, and none of them against the reporting endpoint. ' +
        'The firewall worked all month on the traffic it saw. It is here because a floor that has ' +
        'just found SQL injection will reach for a folder labelled blocked SQL injection, and the ' +
        'relationship is the opposite of the obvious one: the successful attack never appeared in ' +
        'this log at all, because a single well-formed UNION every four minutes does not match a ' +
        'signature built for automated probing. Reporting these alongside the incident would ' +
        'suggest the firewall was involved, and point remediation at tuning a control that had ' +
        'nothing to do with it.',
      standIn:
        '2,300 injection attempts blocked this month, inside the normal range, all generic ' +
        'automated probes against paths we do not serve, none against the reporting endpoint. The ' +
        'one that worked never appeared in this log, because one well-formed query every four ' +
        'minutes does not match a signature built for probing. Closing it.',
      commandOptions: [
        { command: 'grep -c BLOCK /var/log/waf/events.log', ...COUNT_ONLY },
        { command: 'awk \'/BLOCK/ {print $7}\' /var/log/waf/events.log | sort | uniq -c | sort -rn | head', correct: true, teaches: ALSO_WORKS },
        { command: 'grep reporting /var/log/waf/events.log', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/waf/monthly-summary.log', ...DUMP_ALL },
        { command: 'systemctl status waf', ...STATUS_CHECK },
      ],
      commandNudge:
        'Check whether any of those blocked attempts hit the endpoint you care about.',
      guidance:
        'Ask why the attack that worked is not in this log. The answer is the finding.',
    },
  ],
};
