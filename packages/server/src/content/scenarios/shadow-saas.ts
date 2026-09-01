/**
 * Scenario 31: Shadow Copy.
 *
 * Patient data in a free online tool nobody in security has ever heard of.
 *
 * WHAT THIS TEACHES
 *
 * That the most common way data leaves an organisation is not an attacker. It
 * is somebody with a problem the organisation did not solve for them, solving it
 * themselves, in an afternoon, for free.
 *
 * There is no intrusion here. A clinical team needed a shared waiting list, IT
 * quoted nine months, and somebody found a tool that did it in twenty minutes.
 * Everything they did was reasonable from where they were standing, and the
 * result is real patient data sitting on a free tier whose terms permit the
 * provider to use uploaded content.
 *
 * WHY IT IS A BEGINNER SCENARIO
 *
 * Every step is visible and none of it is disguised. What is hard is the
 * writing, not the finding: a report that treats the clinical team as the threat
 * is both wrong and counterproductive, because the next team with the same
 * problem will then hide it better. The correct output is a factual account of
 * what data is where, the exposure the terms create, and the unmet need that
 * caused it, in that order.
 *
 * THE PART FLOORS GET WRONG
 *
 * Revoking the grant looks like containment and is not. The data is already in
 * the provider, uploaded copies do not come back when access is withdrawn, and
 * `ev.5` is where a floor has to notice that the terms it never read are the
 * whole exposure.
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

const ID = 'shadow-copy';

export const SHADOW_COPY: Scenario = {
  id: ID,
  title: 'Shadow Copy',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 11:00 at Ridgeline Medical Group. A routine review of application permissions found a ' +
    'grant to something nobody recognises. Nothing has been attacked and nobody has done anything ' +
    'they thought was wrong.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'OAuth grant to an unrecognised application by a clinical account',
      detail:
        'A quarterly permissions review found a grant issued on 14 April to an application called ' +
        'ListBoard, consented by a.okonkwo, a clinical nurse specialist, through the standard ' +
        'consent screen. The application is not on the approved list, is not blocked by policy, and ' +
        'has never been reviewed. Rule history: this is a quarterly review, not a detection, and no ' +
        'rule fires on consent to an unapproved application.',
      source: 'a.okonkwo',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'cloud-audit',
      summary: 'The grant carries read access to shared drives, not just the profile',
      detail:
        'The consented scopes include read access to files the account can reach, and offline ' +
        'access, which lets the application act without the user present. The account has ' +
        'permission to the respiratory clinic shared drive. Eleven further accounts have consented ' +
        'to the same application since April, nine of them clinical.',
      source: 'identity platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'network-flow',
      summary: 'Uploads to the provider from fourteen workstations over five months',
      detail:
        'Flow records show sustained uploads to the ListBoard platform from fourteen workstations ' +
        'between April and today, totalling 6.8 GB. Traffic is allowlisted because the provider ' +
        'shares infrastructure with a content delivery network the estate uses. Upload volume rises ' +
        'each Monday, consistent with a weekly working pattern.',
      source: 'clinical workstations',
      target: 'ListBoard platform',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'raw-log',
      summary: 'The uploaded content is a patient waiting list with identifiers',
      detail:
        'A copy of the most recent upload recovered from a workstation contains 2,300 rows with ' +
        'patient name, date of birth, NHS number, referral date, clinic and a free text ' +
        'clinical priority note. The file is named respiratory-waiting-list. It is maintained by ' +
        'hand and updated weekly.',
      source: 'RMG-WS-1804',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'The service is a free tier whose terms permit provider use of uploaded content',
      detail:
        'The account is a free tier registered to a personal email address. The terms of service ' +
        'grant the provider a licence to use uploaded content to operate and improve the service, ' +
        'permit storage in any jurisdiction, and disclaim liability for data loss. There is no ' +
        'contract, no data processing agreement, and no deletion guarantee. Revoking the grant ' +
        'removes future access and does not remove uploaded data.',
      source: 'ListBoard terms',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'The team requested a waiting list tool in March and was quoted nine months',
      detail:
        'The service desk holds a request from the respiratory team dated 3 March for a shared ' +
        'waiting list, closed on 28 March with a note that the request would enter the digital ' +
        'roadmap with an estimated nine to twelve month delivery. The ListBoard grant is dated 14 ' +
        'April. Four other clinical teams have open requests of a similar kind.',
      source: 'service desk',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Forty new grants to an approved collaboration platform this week',
      detail:
        'The same permissions review flagged 40 new consents to the organisation approved ' +
        'collaboration suite, all from the pharmacy department, all this week. The department is ' +
        'part of a documented rollout that began on Monday with a change record and a completed ' +
        'security review. Rule history: fired 20 times in thirty days, 20 closed as approved ' +
        'rollout.',
      source: 'identity platform',
      claimedSeverity: 'low',
    },
  ],
};

export const SHADOW_COPY_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'In March the respiratory team asked for a shared waiting list. The request was closed with a nine to twelve month estimate.',
    'In April a nurse specialist found a free online tool that did it, consented to it through the standard screen, and started using it.',
    'Eleven colleagues did the same. Nobody hid anything and nobody thought they were doing something wrong.',
    'The grant carries read access to files the accounts can reach and offline access, so the application can act without anybody present.',
    'Fourteen workstations have uploaded 6.8 GB over five months, rising every Monday, and the traffic was allowlisted because the provider shares infrastructure with a content delivery network we already use.',
    'The uploaded file holds 2,300 patients with name, date of birth, NHS number, referral date, clinic and a free text clinical priority note.',
    'The account is a free tier registered to a personal email. The terms license the provider to use uploaded content, permit storage in any jurisdiction, and offer no deletion guarantee.',
    'Revoking the grant stops future access and does not remove what is already there. There is no attacker in this incident at all.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1567'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['cloud-security'],
      why:
        'A grant to an application nobody has heard of, consented through the normal screen, with ' +
        'no rule anywhere that fires on it. Graded as malicious in the sense that matters here, ' +
        'which is that data has left where it should be, without implying anybody acted in bad ' +
        'faith. The reason to take it rather than close it is that "unrecognised" is the whole ' +
        'point: the approved list exists so somebody reviews what data an application can reach, ' +
        'and nothing has reviewed this one. Note also how it was found, because it matters for the ' +
        'debrief: a quarterly manual review, not a detection. Nothing in the estate would ever have ' +
        'raised this on its own.',
      standIn:
        'Quarterly permissions review found a grant from 14 April to an application called ' +
        'ListBoard, consented by a clinical nurse specialist through the normal screen. Not on the ' +
        'approved list, not blocked, never reviewed. No rule fires on this. Raising it to cloud.',
      commandOptions: [
        { command: 'grep -i listboard /var/log/identity/oauth-grants.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$5==\"CONSENT\" {print $6}' /var/log/identity/oauth-grants.log | sort | uniq -c | sort -rn", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity-sync', ...STATUS_CHECK },
        { command: 'cat /var/log/identity/oauth-grants.log', ...DUMP_ALL },
        { command: 'grep -c CONSENT /var/log/identity/oauth-grants.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what that application is and how many people have consented to it.',
      guidance:
        'Nobody attacked anything. Ask what this application is allowed to read, and who decided ' +
        'that was acceptable.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1550.001'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Two details turn this from a curiosity into an exposure. The scopes include read access to ' +
        'files the account can reach, which for a clinical account means a clinical shared drive, ' +
        'and offline access, which means the application can read those files at three in the ' +
        'morning with nobody logged in. Neither is unusual for a genuine productivity tool, which ' +
        'is exactly why the consent screen presented it like any other. The second number is the ' +
        'one for the report: eleven more accounts, nine of them clinical. One person trying ' +
        'something is a choice, twelve is a workaround that has become the way the team works.',
      standIn:
        'The grant carries read on files the account can reach, which includes the respiratory ' +
        'shared drive, plus offline access so it can read with nobody logged in. Eleven more ' +
        'accounts have consented since April, nine clinical. This is not one person trying ' +
        'something, it is how a team works now. Revoking.',
      commandOptions: [
        { command: "awk '/ListBoard/ {print $4, $7}' /var/log/identity/oauth-grants.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -A4 -i "scope" /var/log/identity/oauth-grants.log | grep -i listboard -A4', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity-sync', ...STATUS_CHECK },
        { command: 'cat /var/log/identity/oauth-grants.log', ...DUMP_ALL },
        { command: 'grep -c ListBoard /var/log/identity/oauth-grants.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read the scopes on that grant, and count how many accounts hold one.',
      guidance:
        'Ask what the application can read and whether it needs somebody logged in to read it.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1567.002'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The scale, and the reason nobody saw it. 6.8 GB from fourteen workstations over five ' +
        'months, allowlisted because the provider shares infrastructure with a content delivery ' +
        'network the estate already uses. That is a genuinely hard detection problem and worth ' +
        'naming rather than treating as an oversight: destination reputation cannot separate them ' +
        'because it is the same infrastructure. The Monday rise is the detail that says what this ' +
        'is. Attacks do not have a working week; a file that grows every Monday is somebody ' +
        'maintaining a list, which points at routine business use rather than theft and shapes how ' +
        'the report should read.',
      standIn:
        '6.8 GB uploaded to that platform from fourteen workstations since April. It is allowlisted ' +
        'because the provider sits behind a CDN we already use, so reputation could never have ' +
        'separated it. Volume rises every Monday, which is a working pattern, not an attack.',
      commandOptions: [
        { command: "awk '/listboard/ {print $2}' /var/log/proxy/access.log | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk '/listboard/ {sum+=$8} END {print sum}' /var/log/proxy/access.log", correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/proxy/access.log', ...DUMP_ALL },
        { command: 'curl -sI https://listboard.example', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Work out how many workstations are uploading to that platform and how much has gone.',
      guidance:
        'Ask why the proxy allowed this. The answer is usually about who else lives at that address.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1005'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'What is actually in it, which is the sentence the organisation needs and the only one that ' +
        'sizes the exposure. 2,300 patients with name, date of birth, NHS number, referral date, ' +
        'clinic and a free text clinical priority note. Two of those fields do more work than the ' +
        'rest: the clinic discloses a specialty, and a free text priority note written by a ' +
        'clinician will contain clinical detail nobody intended to be structured data. That makes ' +
        'this special category health data rather than a contact list, and it is the difference ' +
        'between an internal process failure and a notifiable one.',
      standIn:
        'The file is a respiratory waiting list, 2,300 rows: name, date of birth, NHS number, ' +
        'referral date, clinic and a free text clinical priority note. The clinic name discloses ' +
        'the specialty and the free text will have clinical detail in it. That is special category ' +
        'health data for 2,300 people.',
      commandOptions: [
        { command: 'head -2 /home/a.okonkwo/Documents/respiratory-waiting-list.csv', correct: true, teaches: CORRECT_STEP },
        { command: 'awk -F, \'NR==1 {print}\' /home/a.okonkwo/Documents/respiratory-waiting-list.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'wc -l /home/a.okonkwo/Documents/respiratory-waiting-list.csv', ...COUNT_ONLY },
        { command: 'cat /home/a.okonkwo/Documents/respiratory-waiting-list.csv', ...DUMP_ALL },
        { command: 'shred -u /home/a.okonkwo/Documents/respiratory-waiting-list.csv', ...MUTATE },
      ],
      commandNudge:
        'Look at the columns in that file, not the number of rows.',
      guidance:
        'Ask what is in each column. One field can turn a list of names into health data.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1567'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.contact-attacker', 'act.dismiss', 'act.power-off'],
      escalateTo: ['ir-lead'],
      why:
        'Where the floor usually stops too early. Revoking the grant feels like containment and is ' +
        'not: it removes future access and removes nothing that has already been uploaded. The ' +
        'exposure is in a document nobody read. A free tier registered to a personal email, terms ' +
        'that license the provider to use uploaded content, storage in any jurisdiction, no ' +
        'deletion guarantee and no data processing agreement. There is no contractual route to ' +
        'getting this back, no audit right, and nobody to serve a request on. Reading terms of ' +
        'service is not what most analysts think the job is, and on this incident it is the entire ' +
        'finding.',
      standIn:
        'It is a free tier on a personal email address. The terms license them to use uploaded ' +
        'content, allow storage anywhere, and give no deletion guarantee. No contract, no DPA, no ' +
        'audit right. Revoking the grant stops future access and removes nothing already uploaded. ' +
        'There is no contractual route to getting this back.',
      commandOptions: [
        { command: 'grep -i -A4 "licen\\|retention\\|deletion" /var/log/legal/listboard-tos.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "jurisdiction\\|processor" /var/log/legal/listboard-tos.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'cat /var/log/legal/listboard-tos.txt', ...DUMP_ALL },
        { command: 'grep -c clause /var/log/legal/listboard-tos.txt', ...COUNT_ONLY },
        { command: 'curl -s https://listboard.example/terms', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out what the provider is allowed to do with what was uploaded, and whether we can ' +
        'get it deleted.',
      guidance:
        'You revoked the access. Ask whether that does anything about the data already there.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The cause, and the reason this scenario is not about a nurse. A request on 3 March, closed ' +
        'on 28 March with a nine to twelve month estimate, and the grant dated 14 April. Somebody ' +
        'with a real operational problem was told to wait most of a year and solved it in an ' +
        'afternoon. Every step they took was reasonable from where they were standing. The four ' +
        'other clinical teams with open requests of the same kind are the finding that matters ' +
        'beyond today, because they are the next four instances of this. A report that treats the ' +
        'team as the threat gets the immediate fix and guarantees the next team hides it better, ' +
        'which is a strictly worse outcome than this one.',
      standIn:
        'Respiratory asked for a shared waiting list on 3 March. It was closed on 28 March with a ' +
        'nine to twelve month estimate. The grant is dated 14 April. They had a real problem and ' +
        'were told to wait a year. Four other clinical teams have the same request open, and they ' +
        'are the next four of these.',
      commandOptions: [
        { command: 'grep -i "waiting list" /var/log/servicedesk/tickets.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk '/respiratory/ {print $1, $4, $8}' /var/log/servicedesk/tickets.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status servicedesk', ...STATUS_CHECK },
        { command: 'cat /var/log/servicedesk/tickets.log', ...DUMP_ALL },
        { command: 'grep -c CLOSED /var/log/servicedesk/tickets.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether anybody asked for this properly before they went and found their own.',
      guidance:
        'Ask why somebody would do this. The answer is usually in the service desk queue.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.revoke-key', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'Forty new consents in one week, from the same review, on the morning the floor has found ' +
        'an unapproved application. Forty is a bigger number than twelve and it is the approved ' +
        'collaboration suite under a documented rollout that began Monday, with a change record and ' +
        'a completed security review. Twenty of twenty this month were the same. The check is which ' +
        'application, which takes seconds. It is here to teach that volume is not the signal: the ' +
        'twelve grants that mattered were quiet and reviewed by nobody, and the forty that do not ' +
        'were loud and reviewed properly.',
      standIn:
        'Forty new consents this week are all pharmacy, all to our approved collaboration suite, ' +
        'part of a rollout that started Monday with a change record and a completed security ' +
        'review. Twenty of twenty this month were the same. Closing it.',
      commandOptions: [
        { command: "awk '$5==\"CONSENT\" {print $6}' /var/log/identity/oauth-grants.log | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i rollout /var/log/change-management.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity-sync', ...STATUS_CHECK },
        { command: 'cat /var/log/identity/oauth-grants.log', ...DUMP_ALL },
        { command: 'grep -c CONSENT /var/log/identity/oauth-grants.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check which application those forty consents are actually for.',
      guidance:
        'A bigger number is not a bigger problem. Check what it is before you act on the size of it.',
    },
  ],
};
