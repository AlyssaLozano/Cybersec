/**
 * Scenario 55: On Leave.
 *
 * Two staff had their multi-factor authentication reset by phone before eight
 * this morning. One of those calls was not from the person it claimed to be.
 *
 * WHAT THIS TEACHES
 *
 * That you cannot catch impersonation at the moment of impersonation, and that
 * trying to is how real people get locked out.
 *
 * The caller who was lying answered five verification questions correctly in
 * under four minutes. The answers were a date of birth, a manager's name, a
 * ward, a covering colleague and a recent ticket reference, and every one of
 * them is published by the organisation itself: the group website names
 * attendings and their leads, the ward schedule is a public PDF, and the
 * attending's own out-of-office autoreply gives the ward, the covering
 * colleague and the return date to anybody who emails her. Harder questions do
 * not fix that. There is no question the help desk can ask at 07:40 that a
 * prepared caller cannot answer and a genuinely locked-out clinician can.
 *
 * THE ONE THAT LOOKS WORSE IS THE REAL ONE
 *
 * The other reset that morning has an international number, a hotel network in
 * Mexico and a brand new device at 06:12, and it is a registrar whose phone
 * broke on vacation. A floor that grades identity by how the login looks
 * locks her out with a patient list open and never touches the impersonator,
 * whose session came from a residential line four miles from the hospital.
 *
 * WHERE IT IS ACTUALLY CATCHABLE
 *
 * In what the account does next. One session opened a calendar, sent two emails
 * to her own team and read one record for a patient on her own list. The other
 * opened 341 patient records in nine minutes across six wards, two of which the
 * account has never touched in twelve months. That difference is unambiguous,
 * it arrives within fifteen minutes, and it is the same fifteen minutes for
 * every out-of-band reset the group will ever do.
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

const ID = 'on-leave';

export const ON_LEAVE: Scenario = {
  id: ID,
  title: 'On Leave',
  difficulty: 'advanced',
  durationMinutes: 75,
  situation:
    'It is 09:15 at Ridgeline Medical Group. Two members of clinical staff had their ' +
    'authentication reset over the phone before eight this morning. The service desk normally does ' +
    'three of those in a week.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
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
      summary: 'Two out-of-band authentication resets before 08:00, both by the same agent',
      detail:
        'The service desk performed telephone authentication resets for r.duthie at 06:12 and for ' +
        'c.abiade at 07:44, both handled by the same agent on the early shift. The group averages ' +
        'three out-of-band resets a week across 4,100 staff. Both callers passed identity ' +
        'verification as recorded in the ticket. Rule history: fired 14 times in thirty days, 14 ' +
        'closed as legitimate.',
      source: 'service desk',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'network-flow',
      summary: 'The 06:12 reset enrolled a new device from a hotel network in Mexico',
      detail:
        'The device enrolled against r.duthie at 06:14 authenticated from 198.51.100.61, a range ' +
        'belonging to a hotel operator in Cozumel, on a handset model the account has never used. The ' +
        'inbound service desk call came from an international number and lasted fourteen minutes. ' +
        'The account has no prior authentication from outside the United States in twelve months.',
      source: '198.51.100.61',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'cloud-audit',
      summary: 'What the r.duthie session did in its first twenty-two minutes',
      detail:
        'Between 06:14 and 06:36 the session opened the account calendar, sent two emails to the ' +
        'internal medicine resident group, opened one patient record for a patient on the ' +
        'account own admission list, and set an out-of-office. Twenty-two minutes, four actions, ' +
        'one record. The account is scheduled as on vacation until 8 September.',
      source: 'r.duthie',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 500,
      surface: 'cloud-audit',
      summary: 'What the c.abiade session did in its first nine minutes',
      detail:
        'Between 07:51 and 08:00 the session opened 341 patient records across six wards. Two of ' +
        'those wards have never been touched by this account in twelve months of audit history. ' +
        'The account baseline is 40 to 60 record opens across a full clinic day, confined to ' +
        'respiratory and one shared assessment unit. No record was edited. Nothing was printed or ' +
        'exported through the application.',
      source: 'c.abiade',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 660,
      surface: 'raw-log',
      summary: 'The 07:44 caller answered five verification questions in three minutes forty',
      detail:
        'The service desk transcript records the caller giving a date of birth, the name of the ' +
        'clinical lead, the ward covered, the name of the covering colleague during leave, and a ' +
        'recent ticket reference. All five matched. The call lasted three minutes forty seconds ' +
        'and the agent noted the caller as calm and unhurried. Trust policy requires three of five ' +
        'to pass.',
      source: 'service desk',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 820,
      surface: 'host-artefact',
      summary: 'Four of the five answers are published by the group',
      detail:
        'The group website lists c.abiade by name, specialty and clinical lead. The September ward ' +
        'schedule is a public PDF on the same site and names her ward. Her mailbox out-of-office, set ' +
        'on 26 August and running now, gives the covering colleague and the return date to anybody ' +
        'who emails the address. The ticket reference appears in a reply she sent to an external ' +
        'supplier on 21 August. Only the date of birth is not published, and it is on a public ' +
        'professional register.',
      source: 'open sources',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 980,
      surface: 'network-flow',
      summary: 'The same residential range enrolled a device three weeks ago',
      detail:
        '203.0.113.77, the address the c.abiade device enrolled from at 07:47, is a residential ' +
        'broadband range four miles from the main hospital site. The same /24 enrolled a device ' +
        'against a pharmacy technician account on 11 August, four minutes after an out-of-band ' +
        'reset for that account. That reset was closed as legitimate and nobody looked at what the ' +
        'session did afterwards.',
      source: '203.0.113.77',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1140,
      surface: 'alert-queue',
      summary: 'Out-of-band resets cannot simply be stopped',
      detail:
        'The group runs continuously and clinicians lose or break phones on shift. Suspending ' +
        'telephone resets means a doctor locked out at 03:00 with a deteriorating patient and no ' +
        'route back in until the day shift arrives. The clinical safety team has previously ' +
        'rejected a proposal to require in-person verification for this reason. The service desk ' +
        'handles roughly thirteen of these a month.',
      source: 'clinical safety',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.9',
      atSeconds: 1300,
      surface: 'alert-queue',
      summary: 'Nothing fired on either session at the time',
      detail:
        'No detection covers the period after an authentication reset. Record access volume is ' +
        'alerted on at a daily threshold of 400 per account, which neither session reached. The ' +
        'pharmacy technician session on 11 August did not fire either. Thirty days of history ' +
        'contains 13 out-of-band resets and 4 accounts exceeding 300 record opens in an hour.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.10',
      atSeconds: 1440,
      surface: 'alert-queue',
      summary: 'A night nurse account opened 90 records in twenty minutes',
      detail:
        'Retrospective review of the last week flags j.okonjo, a night-shift nurse, opening 90 ' +
        'patient records between 02:10 and 02:30 on Thursday. All 90 are patients on Fenwick ward, ' +
        'the account is scheduled to Fenwick that night, the pattern matches the same account on ' +
        'eleven previous night shifts, and the session came from a ward workstation. Rule history: ' +
        'no rule fired on this; it was surfaced by a manual review.',
      source: 'j.okonjo',
      claimedSeverity: 'medium',
    },
  ],
};

export const ON_LEAVE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody telephoned the Ridgeline service desk at 07:44 claiming to be c.abiade, a pulmonology attending who is on vacation, and asked for her authentication to be reset.',
    'They answered five verification questions correctly in three minutes forty. Four of the five answers are published by the group: the website gives her specialty and clinical lead, the September ward schedule is a public PDF, and her own out-of-office autoreply names her covering colleague and return date to anybody who emails her.',
    'A device was enrolled at 07:47 from 203.0.113.77, a residential broadband range four miles from the hospital.',
    'Between 07:51 and 08:00 that session opened 341 patient records across six wards, two of which the account has never touched in twelve months. Nothing was edited, printed or exported through the application.',
    'The same /24 enrolled a device against a pharmacy technician account on 11 August, four minutes after an out-of-band reset that was closed as legitimate. Nobody looked at what that session did.',
    'The other reset that morning is genuine. r.duthie is a resident on vacation in Mexico whose phone broke; she called from an international number, spoke to the agent for fourteen minutes, and her session opened a calendar, sent two emails to her own team and read one record for her own patient.',
    'No detection covered the period after either reset. Record access is alerted at a daily threshold of 400, which the nine-minute session never reached.',
    'The verification questions cannot be made to work. Nothing the desk can ask at 07:40 is answerable by a locked-out clinician and not by a prepared caller.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1556.006', 'T1598'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['cloud-security', 'ir-lead'],
      why:
        'Fourteen fired in thirty days and fourteen were legitimate, so the honest reading of the ' +
        'base rate is that this row is usually nothing. What makes it worth two minutes is the ' +
        'clustering: three a week across 4,100 staff is the norm and two arrived before eight on ' +
        'one morning through one agent. That is not evidence of anything on its own and it is a ' +
        'reason to look at both. Resist the shape the row invites, which is to pick whichever ' +
        'reset looks more foreign and work that one. Both get the same question, and the question ' +
        'is not who called but what the account did once it was back in.',
      standIn:
        'Two out-of-band resets before eight, both through the early shift agent, against a ' +
        'baseline of three a week across 4,100 people. Fourteen of these in thirty days were all ' +
        'legitimate, so this is probably nothing, but two in one morning is worth the look. I want ' +
        'both, not the foreign-looking one, and I want to know what each account did after it got ' +
        'back in.',
      commandOptions: [
        { command: "awk -F, '$4==\"OOB-RESET\"' /var/log/servicedesk/tickets.csv | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "reset" /var/log/servicedesk/tickets.csv | grep -c 2026-09', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mfa-broker', ...STATUS_CHECK },
        { command: 'cat /var/log/servicedesk/tickets.csv', ...DUMP_ALL },
        { command: 'grep -c RESET /var/log/servicedesk/tickets.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find how many of these normally happen in a week before you decide two is a lot.',
      guidance:
        'Two of something is only strange if you know what normal is. Go and find out.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.investigate-hold'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named', 'act.revoke-key'],
      escalateTo: ['cloud-security'],
      why:
        'Every field on this row is alarming and none of it is evidence. A hotel range in Cozumel, a ' +
        'handset the account has never used, an international number, no overseas authentication ' +
        'in twelve months, and 06:12 in the morning. It is also a resident on vacation whose ' +
        'phone broke, which produces exactly this row and produces it every summer. The one field ' +
        'that is quietly reassuring is the call duration: fourteen minutes, against three forty ' +
        'for the other one. Somebody reading prepared answers off a page is quick, and a real ' +
        'person on a bad hotel line explaining that their phone is in three pieces is slow. Hold ' +
        'it open rather than locking it. Getting this one wrong takes a doctor out of service ' +
        'abroad on the strength of a geolocation, and the account that is actually being abused is ' +
        'four miles away on a home broadband line that looks like nothing.',
      standIn:
        'This is the one that looks terrible and I do not think it is ours. Hotel range in Cozumel, ' +
        'new handset, international number, no overseas auth in twelve months. It is also exactly ' +
        'what a registrar on leave with a broken phone looks like. Note the call length: fourteen ' +
        'minutes here against three forty on the other one. Reading prepared answers is fast. ' +
        'Holding it open, not locking it.',
      commandOptions: [
        { command: "awk -F, '$2==\"r.duthie\" {print $1, $3, $5}' /var/log/identity/enrolments.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i duthie /var/log/servicedesk/calls.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 198.51.100.61', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/identity/enrolments.csv', ...DUMP_ALL },
        { command: 'grep -c 198.51.100 /var/log/identity/enrolments.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Before you act on where it came from, find how long the caller was on the phone.',
      guidance:
        'Ask what a real person with a broken phone abroad would look like in this log. Then check ' +
        'whether that is what you have.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.dismiss', 'act.iam-audit'],
      outOfLaneActions: ['act.revoke-key', 'act.isolate', 'act.reset-password', 'act.triage-high'],
      escalateTo: [],
      why:
        'The resolution of ev.2, and it takes one query. Twenty-two minutes, four actions, one ' +
        'patient record, and the record is for a patient on the account own admission list. ' +
        'Somebody who has bought or stolen an attending login does not spend it sending two emails ' +
        'to a resident group and setting an out-of-office. The behaviour is not merely innocuous, ' +
        'it is specifically the behaviour of the person whose account this is, doing the small ' +
        'catching-up that people do on leave. Close it, and notice what closed it: not the ' +
        'geolocation, not the device, not the hour, but what the session went and did. That is the ' +
        'same test that convicts the other one.',
      standIn:
        'Duthie is fine. Twenty-two minutes, four actions: calendar, two emails to her own ' +
        'resident group, one record for a patient on her own admission list, out-of-office set. ' +
        'Nobody buys an attending login to email a resident group. What cleared her is what she ' +
        'did, not where she did it from. Closing it.',
      commandOptions: [
        { command: "awk -F, '$2==\"r.duthie\" && $1 ~ /06:[1-4]/ {print $1, $4, $5}' /var/log/ehr/audit.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep r.duthie /var/log/ehr/audit.csv | wc -l', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ehr-audit', ...STATUS_CHECK },
        { command: 'cat /var/log/ehr/audit.csv', ...DUMP_ALL },
        { command: 'net user r.duthie /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Ask what the session actually did once it was back in.',
      guidance:
        'Where a login comes from is a guess about intent. What it does next is not.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1530'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.reimage-now', 'act.tune'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Three hundred and forty-one records in nine minutes, against a baseline of forty to sixty ' +
        'across a whole clinic day, and across six wards when the account has ever worked in two. ' +
        'That is thirty-eight records a minute, which is not a person reading anything. It is a ' +
        'person moving through a list. The two wards with no history in twelve months are the ' +
        'part that removes any remaining doubt, because an attending with a legitimate reason to ' +
        'look wide still looks where her patients are. Note carefully what is absent: no edit, no ' +
        'print, no export through the application, which means the loss is whatever was on screen ' +
        'and there is no export log to bound it with. That absence will tempt somebody to call the ' +
        'impact low. It is the opposite: it means the extent cannot be measured from the ' +
        'application at all, and the notification question goes to legal on 341 records rather ' +
        'than on a number anybody can defend.',
      standIn:
        'Three hundred and forty-one records in nine minutes. Baseline for that account is forty to ' +
        'sixty across a full clinic day in respiratory and one assessment unit, and this crossed ' +
        'six wards, two of which she has never touched in twelve months of audit. Thirty-eight a ' +
        'minute is not reading, it is walking a list. Nothing was edited, printed or exported, ' +
        'which is worse and not better: we cannot bound what left. Revoking the enrolled device ' +
        'now, and legal need the number 341.',
      commandOptions: [
        { command: "awk -F, '$2==\"c.abiade\" && $1 ~ /07:5|08:0/ {print $5}' /var/log/ehr/audit.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"c.abiade\"' /var/log/ehr/audit.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ehr-audit', ...STATUS_CHECK },
        { command: 'cat /var/log/ehr/audit.csv', ...DUMP_ALL },
        { command: 'grep -c c.abiade /var/log/ehr/audit.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count the records that session opened, then find which wards they were on and whether the ' +
        'account has ever been on them.',
      guidance:
        'A number is only high against a baseline. Find this account normal day before you judge ' +
        'this one.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1598.004', 'T1556.006'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'fusion-analyst'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.reset-password', 'act.tune'],
      escalateTo: ['forensics', 'ir-lead'],
      why:
        'Five out of five, when policy asks for three, and in three minutes forty. The instinct on ' +
        'reading this is that the agent was careless, and the agent was not: they exceeded the ' +
        'policy and recorded it properly. The instinct after that is that the questions were too ' +
        'easy, which is closer but still wrong, and it leads directly to the recommendation that ' +
        'will be made in the debrief and should not be. What the transcript actually shows is ' +
        'fluency. A person who has genuinely lost access is flustered, hunts for the ticket ' +
        'number, and takes fourteen minutes, which is what the other call took. This caller was ' +
        'calm, unhurried and quick, because the answers were in front of them. Establish where ' +
        'they were in front of them from, because that is the finding and asking harder questions ' +
        'is not.',
      standIn:
        'Five of five when policy needs three, in three minutes forty. The agent was not careless, ' +
        'they went past policy and documented it. What the transcript shows is fluency. Somebody ' +
        'genuinely locked out is flustered and hunts for the ticket number, which is why the other ' +
        'call took fourteen minutes. This one was calm and quick because the answers were in front ' +
        'of them. I want to know where they were reading from.',
      commandOptions: [
        { command: "awk -F, '$2==\"c.abiade\" {print $1, $4, $6}' /var/log/servicedesk/calls.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i abiade /var/log/servicedesk/transcripts.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status telephony', ...STATUS_CHECK },
        { command: 'cat /var/log/servicedesk/transcripts.txt', ...DUMP_ALL },
        { command: 'grep -c abiade /var/log/servicedesk/calls.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare how long each of the two callers spent on the phone, and what they were asked.',
      guidance:
        'They got every answer right. Ask where a stranger could have got those answers.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'reconnaissance',
      critical: true,
      techniques: ['T1591.004', 'T1589.002'],
      firstResponder: 'forensics',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'The organisation published its own verification answers. The website gives the specialty ' +
        'and the clinical lead, the September schedule is a public PDF naming the ward, and the ' +
        'out-of-office autoreply hands the covering colleague and the return date to anybody who ' +
        'sends an email to the address. The ticket reference was in a reply to an external ' +
        'supplier. Only the date of birth is not on the group site, and it is on a public ' +
        'professional register. So the caller needed no insider, no breach and no prior access; ' +
        'they needed a browser and one email. The autoreply is the part worth sitting with, ' +
        'because it is a courtesy feature working exactly as designed, and turning it off is a ' +
        'genuinely bad idea in a hospital where a covering clinician needs to be findable. The ' +
        'conclusion is therefore not that these answers should be secret. It is that verification ' +
        'built on facts about a person cannot work, and the control has to live somewhere else.',
      standIn:
        'We published four of the five answers ourselves. Website gives specialty and clinical ' +
        'lead, the September schedule is a public PDF with her ward on it, and her out-of-office hands ' +
        'the covering colleague and return date to anybody who emails her. The ticket reference was ' +
        'in a reply to a supplier. Date of birth is on the professional register. They needed a ' +
        'browser and one email. And I would not turn the autoreply off, because a covering ' +
        'clinician has to be findable. Verification on facts about a person cannot work.',
      commandOptions: [
        { command: 'grep -ri "out of office\\|automatic reply" /evidence/mailbox/abiade/ | head', correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/opensource/schedule-september.pdf | tee /evidence/opensource/schedule-september.pdf.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'curl -s https://203.0.113.77/', ...TOUCH_ATTACKER },
        { command: 'cat /evidence/mailbox/abiade/inbox.mbox', ...DUMP_ALL },
        { command: 'net user c.abiade /domain', ...WRONG_TARGET },
      ],
      commandNudge:
        'Take the five questions one at a time and find out whether the answer is published ' +
        'anywhere.',
      guidance:
        'Ask what a stranger with a browser could learn about this person before ringing.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1556.006'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'This stops being an incident and becomes a pattern. The address that enrolled the device ' +
        'is residential broadband four miles from the main site, which is the least remarkable ' +
        'address on the board and would never have been looked at on its own. The same /24 ' +
        'enrolled a device against a pharmacy technician on 11 August, four minutes after an ' +
        'out-of-band reset, and that ticket was closed as legitimate by somebody who had no reason ' +
        'to think otherwise. Nobody looked at what that session did, and three weeks later nobody ' +
        'still knows. Two things follow and both belong in the readout. The scope is not one ' +
        'account and the earliest known date is 11 August rather than this morning, which changes ' +
        'what legal are being asked about. And the reason it was missed is structural rather than ' +
        'anybody being careless: a reset closed as legitimate ends the story, and nothing in the ' +
        'process ever comes back to ask what happened next.',
      standIn:
        'The enrolment address is residential broadband four miles from the hospital, which is the ' +
        'most boring address on this board and is why nobody would ever look at it. The same range ' +
        'enrolled a device against a pharmacy technician on 11 August, four minutes after an ' +
        'out-of-band reset that was closed as legitimate. Nobody checked what that session did and ' +
        'nobody knows now. So this is not one account and it did not start this morning. Legal ' +
        'need that date.',
      commandNudge:
        'Take the enrolment address and look for it across more than today.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'initial-access',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The remedy everybody will propose is the one clinical safety has already refused, and ' +
        'they were right to. Requiring in-person verification means a doctor locked out at 03:00 ' +
        'with a deteriorating patient and no way back in until the day shift. That is a worse ' +
        'outcome than tonight, and a control that gets overridden in an emergency is not a ' +
        'control. So the containment cannot sit on the reset. It sits on the fifteen minutes ' +
        'after: keep telephone resets exactly as they are, and put every account that has just had ' +
        'one under a record access ceiling for an hour, sized somewhere above a busy ward round ' +
        'and well below three hundred. Thirteen resets a month is thirteen ceilings a month, which ' +
        'is affordable. Say what is deliberately left undone as well. The autoreply stays on, ' +
        'because a covering clinician has to be findable, and the schedule stays published. Those leak ' +
        'the verification answers and they will keep leaking them, and the compensating control is ' +
        'the ceiling rather than pretending the answers can be made secret.',
      standIn:
        'Do not touch the reset process. Clinical safety already refused in-person verification ' +
        'and they were right: a doctor locked out at three in the morning with a sick patient is a ' +
        'worse outcome than this. Put the control on the hour after instead. Keep telephone resets ' +
        'and give any account that just had one a record access ceiling for sixty minutes, above a ' +
        'busy ward round and far below three hundred. Thirteen a month, so it costs nothing. ' +
        'Deliberately left undone: autoreply stays on and the schedule stays published, because we ' +
        'cannot make those answers secret and should stop trying.',
      commandNudge:
        'Find out how many out-of-band resets a month you would actually be wrapping a control ' +
        'around.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1530'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The gap is not that nothing was watching record access. It is that the threshold was ' +
        'daily and the theft took nine minutes, so 341 records passed under a limit of 400 without ' +
        'coming close to it. A rate against a window catches this and a total against a day never ' +
        'will. The proposal that follows should be narrow rather than clever: within sixty minutes ' +
        'of an out-of-band reset, alert on record opens exceeding a per-minute rate. The ' +
        'backtesting numbers are the argument, so lead with them. Thirteen resets in thirty days ' +
        'bounds the population the rule can even look at, and four accounts exceeded three hundred ' +
        'opens in an hour in the same period, none of which followed a reset. A rule scoped to the ' +
        'intersection is close to silent, and it would have fired on 11 August. Resist the wider ' +
        'version that alerts on any account reading fast, which catches every ward round in the ' +
        'trust and will be turned off within two weeks.',
      standIn:
        'Something was watching record access. It was watching a daily total of 400, and this took ' +
        'nine minutes and 341, so it went under a threshold it never approached. A rate over a ' +
        'window catches it; a daily total never can. Proposal: within sixty minutes of an ' +
        'out-of-band reset, alert on a per-minute open rate. Thirteen resets in thirty days bounds ' +
        'it, four accounts passed three hundred in an hour and none of them followed a reset, so ' +
        'the intersection is nearly silent and it fires on 11 August. The wider version catches ' +
        'every ward round and gets switched off.',
      commandOptions: [
        { command: "awk -F, '{print $2, substr($1,12,5)}' /var/log/ehr/audit.csv | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4==\"OOB-RESET\" {print $1, $2}' /var/log/servicedesk/tickets.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/ehr/audit.csv', ...DUMP_ALL },
        { command: 'grep -c OOB-RESET /var/log/servicedesk/tickets.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the threshold that already exists on record access, then work out why 341 did not ' +
        'trip it.',
      guidance:
        'Something was already watching. Ask what it was watching for, and why this slipped under ' +
        'it.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.reset-password', 'act.declare'],
      escalateTo: [],
      why:
        'Ninety records in twenty minutes at two in the morning, surfaced by a manual review ' +
        'started because of everything above, and it is a night nurse doing the observations round ' +
        'she does every shift. All ninety patients are on Fenwick, the account is scheduled to ' +
        'Fenwick that night, the session came from a ward workstation, and the same pattern is on ' +
        'eleven previous night shifts. Every one of those checks is the ev.4 test run properly, ' +
        'and it comes back clean. The row is here because a floor that has just found a real ' +
        'bulk-access incident will start seeing bulk access everywhere, and the first casualty of ' +
        'that is always the night shift, whose entirely normal work looks like exfiltration to ' +
        'anybody reading volume without a roster. Close it, and note it as the exact traffic the ' +
        'wide version of the ev.9 rule would have generated.',
      standIn:
        'Ninety records in twenty minutes at two in the morning, and it is the obs round. All ' +
        'ninety are Fenwick patients, she is scheduled to Fenwick, it came from a ward workstation, ' +
        'and the same shape is on eleven previous nights. Same checks as the attending account, ' +
        'opposite answer. Closing it, and this is exactly what the wide version of that new rule ' +
        'would have sent us all night.',
      commandOptions: [
        { command: "awk -F, '$2==\"j.okonjo\" {print $5}' /var/log/ehr/audit.csv | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i okonjo /var/log/roster/september.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ehr-audit', ...STATUS_CHECK },
        { command: 'cat /var/log/ehr/audit.csv', ...DUMP_ALL },
        { command: 'grep -c j.okonjo /var/log/ehr/audit.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check which ward those records are on and which ward that account is scheduled to.',
      guidance:
        'Volume is not the test. Ask whether the records are the ones this person is supposed to ' +
        'be looking at.',
    },
  ],
};
