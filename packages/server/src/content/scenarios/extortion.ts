/**
 * Scenario 47: Pay Us Or We Publish.
 *
 * Nothing is encrypted, nothing is broken, and there is nothing to recover.
 *
 * WHAT THIS TEACHES
 *
 * That an incident can be entirely a set of decisions. Every technical question
 * is already answered by the time the floor sits down: the data is gone, it went
 * weeks ago, and no action available to anybody gets it back. There is no
 * containment that helps, no eradication that matters, and no recovery.
 *
 * What is left is judgement under a deadline, which is the thing this platform
 * is least able to teach anywhere else. How much of the claim is true. Whether
 * the sample proves what they say it proves. What paying would actually buy,
 * which is a promise from somebody who has already broken one. Who has to be
 * told, when, and in what order. And the sentence nobody wants to write, which
 * is that the organisation cannot know whether the data is deleted and never
 * will.
 *
 * WHY THE LEAD LEADS
 *
 * Because almost every event here ends in a decision rather than a finding, and
 * the analysis exists to inform it. This is the closest the set gets to a pure
 * command exercise.
 *
 * THE TRAP
 *
 * `ev.5`. The proof-of-possession sample is genuine and it is not what they say
 * it is. A floor that validates the sample and stops has confirmed the smaller
 * claim and accepted the larger one.
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

const ID = 'pay-us-or-we-publish';

export const PAY_US_OR_WE_PUBLISH: Scenario = {
  id: ID,
  title: 'Pay Us Or We Publish',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 07:30 at Ridgeline Medical Group. An email arrived overnight demanding payment within ' +
    '72 hours or a dataset will be published. Nothing is encrypted and every system is running ' +
    'normally.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'threat-intel',
    'fusion-analyst',
    'forensics',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Extortion demand received with a 72 hour deadline',
      detail:
        'An email to the chief executive and the communications director at 02:40 claims possession ' +
        'of 61,000 patient records and demands payment within 72 hours or the dataset will be ' +
        'published on a leak site. It names a specific export and includes a link to a sample. It ' +
        'was delivered normally and quarantined nothing. Rule history: this arrived as email, not ' +
        'as a detection, and nothing in the estate has alerted at any point.',
      source: 'external mail',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'network-flow',
      summary: 'A 9 GB transfer from the reporting server on 2 August',
      detail:
        'Flow records show 9.1 GB from rmg-rpt-02 to 198.51.100.212 between 01:20 and 04:55 on 2 ' +
        'August, six weeks ago. That is the only transfer of any size from that host in ninety ' +
        'days. The address has no other history. Flow retention is ninety days, so 2 August is ' +
        'inside the window and anything earlier is not.',
      source: 'rmg-rpt-02',
      target: '198.51.100.212',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'The reporting server was reachable with a service account that had no password rotation',
      detail:
        'rmg-rpt-02 accepted an interactive session at 01:14 on 2 August using svc-reporting, a ' +
        'service account whose password has not changed since 2021 and which appears in a combined ' +
        'credential list published in June. The session came from a residential address. The ' +
        'account holds read access to the reporting warehouse, which contains extracts from the ' +
        'clinical system.',
      source: 'rmg-rpt-02',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'host-artefact',
      summary: 'The reporting warehouse holds 61,000 patient records',
      detail:
        'The reporting warehouse contains a patient extract of 61,400 rows with name, NHS number, ' +
        'date of birth, GP practice, and coded diagnosis and procedure history. It is refreshed ' +
        'nightly and retained indefinitely. It exists so the analytics team can produce activity ' +
        'reporting without querying the live clinical system.',
      source: 'rmg-rpt-02',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'alert-queue',
      summary: 'The sample they published contains 40 records and every one is genuine',
      detail:
        'The linked sample holds 40 patient records. All 40 match the reporting warehouse exactly, ' +
        'field for field, including two records corrected in July which appear in their corrected ' +
        'form. The sample proves possession of at least 40 records taken after those corrections. ' +
        'It does not demonstrate possession of 61,000, and nothing in the sample or the email ' +
        'evidences the larger number.',
      source: 'leak site sample',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'Payment buys a promise from somebody who has already broken one',
      detail:
        'The demand offers deletion of the dataset on payment. There is no mechanism by which ' +
        'deletion can be verified, no way to establish whether copies were made or sold, and ' +
        'published research on this class of group records re-extortion of previously paid victims. ' +
        'Payment may also engage sanctions and money laundering obligations depending on the ' +
        'recipient, which is a question for legal rather than for this floor.',
      source: 'legal',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'A second extortion email arrived at 06:10 naming a different dataset',
      detail:
        'A second message at 06:10 to the same recipients demands payment for a "staff payroll ' +
        'database" and shows a sample of eleven records. The eleven names do not appear in any ' +
        'Ridgeline system and the salary figures are inconsistent with published pay scales. The ' +
        'sending domain differs from the first and the wording is copied from a public template. ' +
        'Rule history: opportunistic follow-on demands are common after a public listing.',
      source: 'external mail',
      claimedSeverity: 'medium',
    },
  ],
};

export const PAY_US_OR_WE_PUBLISH_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On 2 August somebody signed in to the reporting server with a service account whose password had not changed since 2021 and which appeared in a credential list published in June.',
    'They took 9.1 GB out over three and a half hours. It is the only transfer of any size from that host in ninety days.',
    'The reporting warehouse holds 61,400 patient records with name, NHS number, date of birth, GP practice and coded diagnosis history.',
    'Six weeks later they emailed the chief executive demanding payment within 72 hours or they publish.',
    'The sample they linked is genuine: 40 records matching the warehouse field for field, including two corrected in July, which proves they took it after those corrections.',
    'It proves possession of 40 records. Nothing anywhere evidences the 61,000 they claim, and the volume is consistent with the whole extract without confirming it.',
    'Nothing is encrypted, nothing is broken, and no action available to this organisation gets the data back.',
    'Payment buys a promise to delete from somebody who cannot demonstrate deletion, and the second demand that arrived at 06:10 is an opportunist copying a public template.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1657'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'Nothing in the estate has alerted at any point and nothing will, because there is nothing ' +
        'happening: the theft was six weeks ago and every system is running normally. This is the ' +
        'purest example on the platform of an incident that arrives entirely from outside. Declare ' +
        'immediately, because the clock is somebody else clock and 72 hours from 02:40 is a real ' +
        'deadline the organisation did not choose. And nobody replies to this email. Engaging is ' +
        'graded out of lane for everybody: it confirms the address is monitored, it starts a ' +
        'negotiation nobody has authorised, and it is a decision several levels above this floor.',
      standIn:
        'Extortion email to the chief executive and comms director at 02:40, 72 hours, claims 61,000 ' +
        'patient records, links a sample. Delivered normally, nothing quarantined, and nothing in ' +
        'the estate has alerted because nothing is happening now. Declaring. Nobody replies to it.',
      commandOptions: [
        { command: 'grep -A10 "02:40" /var/log/mail/inbound-exec.log', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "72 hours\\|publish" /var/log/mail/inbound-exec.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mailgw', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/inbound-exec.log', ...DUMP_ALL },
        { command: 'curl -s http://198.51.100.212/sample', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Read the demand itself and find out exactly what they claim to have.',
      guidance:
        'Nothing is happening right now. Ask when it happened, and who set the deadline you are ' +
        'working to.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1041'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'The one piece of hard corroboration available, and the limit on it matters as much as the ' +
        'finding. 9.1 GB from the reporting server over three and a half hours on 2 August, the ' +
        'only transfer of any size from that host in ninety days, to an address with no other ' +
        'history. That confirms something substantial left and dates it six weeks before the ' +
        'demand, which is a normal gap: they take it, they assess it, they come back. What it does ' +
        'not do is confirm the contents, and the retention boundary is the second limit worth ' +
        'stating plainly. Ninety days means 2 August sits just inside the window and anything ' +
        'earlier does not exist for us, so this is the earliest transfer we can see rather than ' +
        'the earliest that happened.',
      standIn:
        '9.1 GB out of the reporting server between 01:20 and 04:55 on 2 August, the only transfer ' +
        'of any size from that host in ninety days, to an address with no other history. Something ' +
        'substantial left and it was six weeks before they emailed. Flow retention is ninety days, ' +
        'so that is the earliest I can see, not necessarily the earliest there was.',
      commandOptions: [
        { command: "awk '$2==\"rmg-rpt-02\" && $6>1000000 {print $1, $4, $6}' /var/log/flows-archive.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 198.51.100.212 /var/log/flows-archive.log', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/flows-archive.log', ...DUMP_ALL },
        { command: 'traceroute 198.51.100.212', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Look for a large transfer out of that host, and check how far back your records go.',
      guidance:
        'They claim to have taken something. Ask whether your own records show anything leaving, ' +
        'and when.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1078.003'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'How they got in, and it is unglamorous in a way worth putting in the report exactly as it ' +
        'is. A service account password unchanged since 2021, appearing in a combined credential ' +
        'list published in June, used from a residential address six weeks later. No exploit, no ' +
        'malware, no clever technique. That matters for the board conversation, because the ' +
        'organisation will want to know what went wrong and the honest answer is a password nobody ' +
        'rotated on an account nobody reviewed. The other half is what the account could reach: ' +
        'read access to a warehouse of clinical extracts, which is a scoping decision made once ' +
        'and never revisited.',
      standIn:
        'Interactive session at 01:14 on 2 August using svc-reporting, from a residential address. ' +
        'That password has not changed since 2021 and it appears in a combined credential list ' +
        'published in June. No exploit and no malware. The account holds read on the reporting ' +
        'warehouse, which is clinical extracts.',
      commandOptions: [
        { command: "awk '$5==\"svc-reporting\" {print $1, $9}' /var/log/auth-archive.log | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep svc-reporting /var/log/osint/credential-monitor.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sshd', ...STATUS_CHECK },
        { command: 'cat /var/log/auth-archive.log', ...DUMP_ALL },
        { command: 'passwd -l svc-reporting', ...MUTATE },
      ],
      commandNudge:
        'Find the session that preceded the transfer and check the history of the account it used.',
      guidance:
        'Ask how they got onto that server. It is usually less interesting than people expect.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1213'],
      firstResponder: 'forensics',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'What was reachable, which bounds the worst case. 61,400 rows with name, NHS number, date ' +
        'of birth, GP practice and coded diagnosis and procedure history, refreshed nightly and ' +
        'retained indefinitely. Diagnosis codes make this special category health data at the most ' +
        'serious end, and the combination of NHS number and date of birth makes every record ' +
        'individually identifying with no re-identification work required. Two things worth saying ' +
        'that nobody else will. Retained indefinitely means the extract has been accumulating for ' +
        'years with no expiry anybody chose, and the warehouse exists so analytics can avoid ' +
        'querying the live system, which is a sensible design that produced a second complete copy ' +
        'of the patient population on a server nobody thinks of as clinical.',
      standIn:
        'The reporting warehouse holds 61,400 rows: name, NHS number, date of birth, GP practice, ' +
        'coded diagnosis and procedure history. Refreshed nightly, retained indefinitely. Diagnosis ' +
        'codes make it special category and NHS number with date of birth makes every row ' +
        'identifying on its own. It exists so analytics do not query the live system, which gave us ' +
        'a second complete copy of the patient population.',
      commandNudge:
        'Find out what is actually in the warehouse that account could read, column by column.',
      guidance:
        'Ask what they could have taken, not what they say they took. That bounds the worst case.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1657'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The trap, and it is a careful piece of reasoning rather than a discovery. The sample is ' +
        'genuine: 40 records matching the warehouse field for field, including two corrected in ' +
        'July in their corrected form, which dates the theft after those corrections and rules out ' +
        'an old copy or a fabrication. A floor that validates the sample and stops has done real ' +
        'work and reached the wrong conclusion, because what has been proved is possession of 40 ' +
        'records and what has been claimed is 61,000. Those are three orders of magnitude apart ' +
        'and nothing in the sample or the email bridges them. The 9.1 GB is consistent with the ' +
        'whole extract and consistent with a great deal else, so it supports the claim without ' +
        'confirming it. The correct output is three separate statements: proven, consistent with, ' +
        'and asserted, with the notification written on the assumption that the worst case is true ' +
        'and the language distinguishing all three.',
      standIn:
        'The sample is genuine. Forty records match the warehouse field for field including two ' +
        'corrected in July in their corrected form, so it was taken after those corrections and it ' +
        'is not fabricated or old. That proves forty. They claim sixty-one thousand and nothing ' +
        'bridges those. The 9.1 GB is consistent with the full extract and with plenty else. Three ' +
        'statements: proven, consistent with, asserted. We notify on the worst case and we say ' +
        'which is which.',
      commandOptions: [
        { command: 'comm -12 <(sort /var/evidence/sample-40.csv) <(sort /var/warehouse/patient-extract.csv) | wc -l', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, 'NR==FNR{a[$2];next} $2 in a' /var/evidence/sample-40.csv /var/warehouse/patient-extract.csv | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status warehouse-db', ...STATUS_CHECK },
        { command: 'cat /var/warehouse/patient-extract.csv', ...DUMP_ALL },
        { command: 'wc -l /var/evidence/sample-40.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check the sample against the warehouse, then count how many records it actually proves.',
      guidance:
        'The sample is real. Ask how many records it proves, and compare that to how many they ' +
        'claim.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'ir-lead',
      alsoAppropriate: ['threat-intel', 'mitigation-specialist'],
      correctActions: ['act.declare', 'act.notify-legal'],
      outOfLaneActions: ['act.contact-attacker', 'act.dismiss', 'act.isolate', 'act.reimage-now'],
      escalateTo: [],
      why:
        'The decision, and the honest framing is that there is no good option rather than that one ' +
        'is obviously right. Payment buys a promise to delete from somebody who cannot demonstrate ' +
        'deletion, from a class of group documented to re-extort victims who have already paid, ' +
        'and it may engage sanctions and money laundering obligations which are legal questions ' +
        'and not this floor. Not paying means publication is likely and the organisation should ' +
        'plan for it rather than hope. What this seat owes is the thing nobody wants to write: the ' +
        'organisation cannot know whether the data is deleted, will never be able to know, and ' +
        'that is true whichever way the payment decision goes. Every downstream choice, the ' +
        'notification, the patient communications, the press position, has to be built on ' +
        'publication being possible at any time.',
      standIn:
        'Paying buys a promise to delete from people who cannot show deletion, from a class of group ' +
        'known to come back to victims who paid, and it may engage sanctions and money laundering ' +
        'questions that belong to legal. Not paying means we should plan for publication rather ' +
        'than hope. Either way we cannot ever know whether it is deleted, and everything downstream ' +
        'has to assume publication is possible at any time.',
      commandNudge:
        'Find out what is actually being offered in exchange for payment, and whether it can be ' +
        'verified.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'threat-intel',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.assess-actor'],
      outOfLaneActions: ['act.contact-attacker', 'act.triage-high', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'A second demand three and a half hours after the first, on the same morning, to the same ' +
        'people, and it is an opportunist. Three checks and all three fail: the eleven names appear ' +
        'in no Ridgeline system, the salary figures are inconsistent with published pay scales, and ' +
        'the wording is copied from a public template. Opportunistic follow-on demands are common ' +
        'after a listing, because anybody watching a leak site knows an organisation is under ' +
        'pressure and will believe things it would normally check. The cost of getting it wrong is ' +
        'specific and large: a second confirmed dataset changes the notification, the board ' +
        'briefing and the press position, and withdrawing it afterwards damages every other ' +
        'statement the organisation has made. Validating against our own records takes ten minutes ' +
        'and the pressure not to spend them is the point.',
      standIn:
        'Second demand at 06:10 for a staff payroll database. The eleven names are in no system we ' +
        'have, the salaries do not match published pay scales, and the wording is lifted from a ' +
        'public template. This is an opportunist who saw the first one. Ten minutes to check and it ' +
        'stays out of the notification.',
      commandOptions: [
        { command: 'comm -12 <(cut -d, -f1 /var/evidence/sample-payroll.csv | sort) <(cut -d, -f2 /var/hr/staff-list.csv | sort)', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -f /var/evidence/payroll-names.txt /var/hr/staff-list.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status hr-system', ...STATUS_CHECK },
        { command: 'cat /var/evidence/sample-payroll.csv', ...DUMP_ALL },
        { command: 'curl -s http://203.0.113.240/payroll', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check whether the names in the second sample exist in any of our systems.',
      guidance:
        'A second demand on the same morning is not automatically a second breach. Check the sample ' +
        'against your own records.',
    },
  ],
};
