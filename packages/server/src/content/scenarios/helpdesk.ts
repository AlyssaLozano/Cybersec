/**
 * Scenario 34: Helpdesk Says Yes.
 *
 * Somebody phoned the service desk and was given the account.
 *
 * WHAT THIS TEACHES
 *
 * That a process is a control, and that an organisation which has hardened every
 * technical path usually still has a telephone.
 *
 * Nothing was exploited. The service desk followed its documented procedure
 * exactly: they asked the three approved verification questions, got three
 * correct answers, reset the password and re-registered the authenticator. Every
 * step is in the runbook and every step was performed correctly by somebody
 * doing their job well.
 *
 * The problem is what the questions ask for. Employee number, line manager and
 * office location are all discoverable: two are on the company website and the
 * third is on a professional networking profile. A verification scheme built
 * from facts an outsider can look up does not verify anything, and it has been
 * that way for years without anybody noticing, because until today everyone who
 * answered correctly happened to be the right person.
 *
 * WHY IT IS A BEGINNER SCENARIO
 *
 * The trail is short and nothing is hidden. What is being built is the instinct
 * to treat a human process as part of the attack surface, and the discipline of
 * writing that up without making it a story about one person on a phone.
 *
 * THE FRAMING THAT MATTERS
 *
 * The service desk analyst did nothing wrong. If the report says otherwise the
 * organisation gets a nervous service desk and keeps the same questions, which
 * is the worst available outcome: slower support and identical exposure.
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

const ID = 'helpdesk-says-yes';

export const HELPDESK_SAYS_YES: Scenario = {
  id: ID,
  title: 'Helpdesk Says Yes',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 11:05 at Fenmarch Credit Union. A payments officer came back from lunch unable to sign ' +
    'in, and the service desk record says her password was reset this morning at her own request. ' +
    'She did not call.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'detection-engineer',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Authenticator re-registered and password reset on a payments account at 09:52',
      detail:
        'The account s.bhattacharya, a payments officer, had its password reset and its ' +
        'authenticator device re-registered at 09:52, both actions performed by a service desk ' +
        'analyst against ticket SD-88214. The old authenticator was removed in the same action. ' +
        'Rule history: fired 120 times in thirty days, 120 closed as routine service desk activity.',
      source: 's.bhattacharya',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'The ticket records three correct answers to the approved verification questions',
      detail:
        'Ticket SD-88214 was raised at 09:44 from an inbound call. The analyst recorded the three ' +
        'approved verification questions: employee number, line manager name and office location. ' +
        'All three answers are recorded as correct. The runbook requires exactly these three and ' +
        'nothing further. The call lasted eight minutes and the analyst notes the caller was ' +
        '"apologetic, said she was between meetings".',
      source: 'service desk',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'network-flow',
      summary: 'The new authenticator was registered from an external address',
      detail:
        'The replacement authenticator was enrolled at 09:53 from 203.0.113.64, which is not an ' +
        'office range, not the corporate VPN, and has no prior history in the estate. The account ' +
        'holder was in the Norwich office and badged in at 08:31. Enrolment does not require the ' +
        'device to be on a corporate network.',
      source: '203.0.113.64',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'cloud-audit',
      summary: 'The session opened the payment approval queue and read pending items',
      detail:
        'Between 09:56 and 10:21 the session opened the payment approval queue and viewed 34 ' +
        'pending payments, including four above fifty thousand pounds. Nothing was approved, ' +
        'modified or released. The account is entitled to view the queue; approval above fifty ' +
        'thousand requires a second officer.',
      source: 's.bhattacharya',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'All three verification answers are publicly available',
      detail:
        'The organisation website lists office locations and publishes a leadership page naming ' +
        'department heads. The account holder professional networking profile names her line ' +
        'manager and her office. Employee numbers appear in the format shown on the public annual ' +
        'report contributor list, and hers is derivable from her start date. None of the three ' +
        'questions asks for anything only the account holder would know.',
      source: 'open source',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'The service desk performs around 340 resets a month with no callback step',
      detail:
        'Service desk records show 340 password resets a month on average, of which 96 also ' +
        're-register an authenticator. The runbook has no step requiring a callback to the number ' +
        'held on file, and no step distinguishing a payments or administrative account from any ' +
        'other. The three questions have been unchanged since 2019.',
      source: 'service desk',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'A second reset and re-registration the same morning',
      detail:
        'A second account, r.mbeki in mortgages, was reset and re-enrolled at 10:40 against ticket ' +
        'SD-88231. That enrolment came from the Ipswich branch range, the account holder badged in ' +
        'at Ipswich at 08:55, and she raised the ticket in person at the branch IT desk after ' +
        'breaking her phone at the weekend. Rule history: fired 120 times in thirty days, 120 ' +
        'closed as routine.',
      source: 'r.mbeki',
      claimedSeverity: 'low',
    },
  ],
};

export const HELPDESK_SAYS_YES_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 09:44 somebody phoned the service desk claiming to be a payments officer who could not sign in.',
    'The analyst followed the runbook exactly and asked the three approved verification questions: employee number, line manager and office location.',
    'The caller answered all three correctly, because all three are discoverable. Two are on our own website and the third is on a public professional profile.',
    'The analyst reset the password and re-registered the authenticator, removing the real one in the same action. That is what the runbook says to do.',
    'The new authenticator was enrolled a minute later from an external address, while the real account holder was sitting in the Norwich office having badged in at 08:31.',
    'The session opened the payment approval queue and read 34 pending payments, four of them above fifty thousand pounds. Nothing was approved, because approval above fifty thousand needs a second officer.',
    'They were finding out what the queue holds and how approval works, which is preparation rather than theft.',
    'Nothing technical was exploited. The verification scheme is built from facts an outsider can look up, and it has been since 2019.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1078.004', 'T1556.006'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst', 'cloud-security'],
      why:
        'A hundred and twenty of a hundred and twenty this month were routine, which is as strong a ' +
        'reason to close something as this platform ever offers. Two details on the row make it ' +
        'worth the ten minutes anyway. It is a payments account, so whatever the outcome the blast ' +
        'radius is money rather than a mailbox. And the old authenticator was removed in the same ' +
        'action, which means the real holder cannot get in and will notice, but only when they next ' +
        'try. The general habit worth building: a reset is an identity being handed to whoever ' +
        'asked, so the question is never whether the reset was performed correctly, it is who was ' +
        'on the phone.',
      standIn:
        'Password reset and authenticator re-registration on a payments officer account at 09:52, ' +
        'service desk ticket SD-88214, old authenticator removed in the same action. A hundred and ' +
        'twenty of a hundred and twenty this month were routine. Raising it because it is payments ' +
        'and because the holder is now locked out.',
      commandOptions: [
        { command: "awk '$4==\"MFA_REREGISTER\" {print $1, $5, $7}' /var/log/idp/admin.log | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep bhattacharya /var/log/idp/admin.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-idp', ...STATUS_CHECK },
        { command: 'cat /var/log/idp/admin.log', ...DUMP_ALL },
        { command: 'grep -c RESET /var/log/idp/admin.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find what else happened to that account at the same time as the password reset.',
      guidance:
        'A reset hands an identity to whoever asked for it. Ask who asked.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1598.004'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'The whole attack, recorded neatly by the person it was used against. Three approved ' +
        'questions asked, three correct answers given, runbook followed exactly. There is no error ' +
        'anywhere in the ticket and that is precisely the finding: the process performed correctly ' +
        'produced this outcome. The analyst note is worth reading rather than skipping, because ' +
        '"apologetic, said she was between meetings" is a technique. Time pressure and an apology ' +
        'discourage the extra question a suspicious analyst might otherwise ask, and it works ' +
        'because being helpful under pressure is what the job rewards.',
      standIn:
        'Ticket SD-88214, inbound call at 09:44, eight minutes. Analyst asked the three approved ' +
        'questions, employee number, line manager, office, and recorded all three correct. Runbook ' +
        'followed exactly, no error anywhere. The note says the caller was apologetic and between ' +
        'meetings, which is a technique rather than a detail.',
      commandOptions: [
        { command: 'grep -A10 SD-88214 /var/log/servicedesk/tickets.log', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "verification\\|identity check" /var/log/servicedesk/tickets.log | tail -20', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status servicedesk', ...STATUS_CHECK },
        { command: 'cat /var/log/servicedesk/tickets.log', ...DUMP_ALL },
        { command: 'grep -c SD-88 /var/log/servicedesk/tickets.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read the ticket and find out what the caller was actually asked to prove.',
      guidance:
        'Nothing went wrong in the process. Ask what the process actually checks.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1556.006'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The contradiction that proves it, and it takes two lookups. The replacement authenticator ' +
        'was enrolled from an address that is not an office range, not the VPN and has no history, ' +
        'at 09:53, while the account holder had been badged into Norwich since 08:31. Two places at ' +
        'once, and one of them has a door record. The finding underneath is that enrolment does not ' +
        'require the device to be on a corporate network, which is a reasonable decision for people ' +
        'setting up phones at home and is also the thing that let this complete. Badge records ' +
        'again: the cheapest way to prove a credential is being used by somebody other than its ' +
        'owner, and almost nobody pulls them.',
      standIn:
        'The new authenticator was enrolled at 09:53 from an address that is not an office range, ' +
        'not our VPN, and has no history anywhere. She badged into Norwich at 08:31 and was there ' +
        'all morning. Enrolment does not require a corporate network, which is why it completed.',
      commandOptions: [
        { command: 'grep 203.0.113.64 /var/log/idp/enrolment.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$4==\"ENROL\" {print $1, $3, $5}' /var/log/idp/enrolment.log | tail", correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/idp/enrolment.log', ...DUMP_ALL },
        { command: 'nmap -sT 203.0.113.64', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out where the new device was enrolled from, and where the account holder actually was.',
      guidance:
        'Ask where the new phone was registered, and check whether the person was somewhere else at ' +
        'the time.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1087'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'What they wanted, and the fact that nothing was approved is the most misread thing on this ' +
        'board. Thirty-four pending payments viewed, four above fifty thousand, nothing touched. A ' +
        'floor measuring harm by what moved will file this as a near miss. It is reconnaissance and ' +
        'it worked: they now know what the queue holds, roughly when payments sit in it, and that ' +
        'anything above fifty thousand needs a second officer. That last one is the useful ' +
        'intelligence, because it tells them the next call to the service desk should be for a ' +
        'second payments account rather than a bigger payment. The output the business needs is a ' +
        'warning that this is step one.',
      standIn:
        'The session opened the payment approval queue between 09:56 and 10:21 and viewed 34 ' +
        'pending payments, four over fifty thousand. Nothing approved or released. They were ' +
        'learning what the queue holds and that over fifty thousand needs a second officer. Expect ' +
        'a second call asking for a different payments account.',
      commandOptions: [
        { command: "awk '$3==\"QUEUE_VIEW\" {print $1, $5}' /var/log/core/audit.log | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep bhattacharya /var/log/core/audit.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status core-banking', ...STATUS_CHECK },
        { command: 'cat /var/log/core/audit.log', ...DUMP_ALL },
        { command: 'grep -c QUEUE_VIEW /var/log/core/audit.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at what the session did after the reset, and what it did not do.',
      guidance:
        'Nothing was approved. Ask what they learned, and what they would need next.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'reconnaissance',
      critical: true,
      techniques: ['T1589', 'T1591'],
      firstResponder: 'forensics',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'Why the answers were correct, and it is the finding the organisation will least want to ' +
        'hear because the exposure is its own website. Office locations and department heads are ' +
        'published deliberately. The line manager and office are on a public professional profile, ' +
        'which nobody can be asked to take down. The employee number is derivable from a format ' +
        'shown in the annual report and a start date. So the caller did no hacking at all: they did ' +
        'an afternoon of reading. Preserve the evidence of availability, because the recommendation ' +
        'that follows will be argued with, and "these are lookup-able" is much harder to dispute ' +
        'with the screenshots attached.',
      standIn:
        'All three answers are publicly available. Our own site lists offices and names department ' +
        'heads. Her professional profile gives line manager and office. Employee numbers follow the ' +
        'format in the annual report and hers is derivable from her start date. The caller did not ' +
        'hack anything, they read. Captured and sealed, because this recommendation will be argued ' +
        'with.',
      commandOptions: [
        { command: 'grep -i -A3 "verification questions" /var/log/servicedesk/runbook.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/osint/public-profile-review.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status webserver', ...STATUS_CHECK },
        { command: 'cat /var/log/servicedesk/runbook.txt', ...DUMP_ALL },
        { command: 'curl -s https://203.0.113.64/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Take the three questions and try to answer them about somebody without asking them.',
      guidance:
        'The answers were right. Ask whether a stranger could have found them.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1556.006'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['ir-lead', 'soc-operator'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The scope and the fix, and this seat has to resist proposing the easy version. 340 resets ' +
        'a month, 96 with a re-enrolment, no callback step, and no distinction between a payments ' +
        'account and any other. Alerting on every reset is useless at that volume and would be ' +
        'ignored within a week. The rule that would have fired here is narrow: an authenticator ' +
        'enrolled from an address outside the corporate estate within an hour of a service desk ' +
        'reset, which is rare and cheap to check. The better control is a callback to the number ' +
        'already on file, because it ends the attack at the phone rather than detecting it ' +
        'afterwards, and scoping it to payments and administrative accounts keeps it affordable.',
      standIn:
        '340 resets a month, 96 with re-enrolment, no callback step and no distinction for payments ' +
        'accounts. Alerting on all of them is noise nobody will read. The narrow rule is enrolment ' +
        'from outside the estate within an hour of a service desk reset, and I can backtest that ' +
        'over ninety days. The real fix is a callback to the number on file for payments and admin ' +
        'accounts, which stops it at the phone.',
      commandOptions: [
        { command: "awk '$4==\"RESET\" {print $1}' /var/log/idp/admin.log | cut -d- -f1-2 | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i callback /var/log/servicedesk/runbook.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status servicedesk', ...STATUS_CHECK },
        { command: 'cat /var/log/idp/admin.log', ...DUMP_ALL },
        { command: 'grep -c RESET /var/log/idp/admin.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Work out how many resets happen a month before proposing a rule that fires on all of them.',
      guidance:
        'Ask what a rule here would cost per shift. Then ask whether a process change would be ' +
        'cheaper than a detection.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.reset-password'],
      escalateTo: [],
      why:
        'The same event type on the same morning, and it is genuinely fine. Reset and re-enrolment ' +
        'at 10:40, enrolled from the Ipswich branch range, holder badged into Ipswich at 08:55, ' +
        'raised in person at the branch IT desk after breaking her phone at the weekend. Three ' +
        'checks and all three agree. It is here to stop the dismissal reflex inverting: a floor ' +
        'that has just found a malicious reset will want to escalate every reset, and doing that on ' +
        'a service desk handling 340 a month makes the SOC the reason nobody can get their password ' +
        'changed. The differentiator is precise and repeatable, which is where the enrolment came ' +
        'from against where the person was.',
      standIn:
        'Second reset at 10:40 is mortgages, enrolled from the Ipswich branch range, holder badged ' +
        'into Ipswich at 08:55, and she raised it in person at the branch desk after breaking her ' +
        'phone. Enrolment location matches where she was. That is the difference. Closing it.',
      commandOptions: [
        { command: "awk '$4==\"ENROL\" {print $1, $3, $5}' /var/log/idp/enrolment.log | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i mbeki /var/log/physical/access.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-idp', ...STATUS_CHECK },
        { command: 'cat /var/log/servicedesk/tickets.log', ...DUMP_ALL },
        { command: 'grep -c ENROL /var/log/idp/enrolment.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check where that second enrolment came from and where that account holder was.',
      guidance:
        'You just found a bad reset. Ask what makes this one different rather than escalating both.',
    },
  ],
};
