/**
 * Scenario 33: Approve Approve Approve.
 *
 * Forty push prompts at three in the morning, and the thirty-eighth one gets
 * approved.
 *
 * WHAT THIS TEACHES
 *
 * That a control can work exactly as specified and still fail, because the
 * person it depends on is asleep.
 *
 * The password was already stolen. Everything that follows is the attacker
 * pressing sign in over and over, which sends a push prompt to a phone on a
 * bedside table, over and over, until somebody taps approve to make it stop.
 * Nothing is bypassed. The second factor is requested and satisfied, exactly as
 * designed, and the log records a successful authentication with MFA.
 *
 * WHY IT IS A BEGINNER SCENARIO
 *
 * The evidence is simple and the arithmetic is visible: thirty-seven denials
 * and one approval in thirty-eight minutes. Nothing is disguised. What is being
 * built is the instinct to look at the shape of a sequence rather than its
 * outcome, and to notice that a successful authentication at the end of thirty
 * seven failures is not a successful authentication.
 *
 * THE FRAMING THAT MATTERS
 *
 * There is a strong pull towards writing this up as user error. It is not, and
 * a report that says so produces awareness training rather than the fix. The
 * control has no number matching, so the only information the person gets at
 * 03:14 is "approve or deny", with no way to tell which login they are being
 * asked about. Number matching would have ended this at the first prompt.
 * `ev.6` is where the floor decides which of those two things it recommends.
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

const ID = 'approve-approve-approve';

export const APPROVE_APPROVE_APPROVE: Scenario = {
  id: ID,
  title: 'Approve Approve Approve',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 07:20 at Ridgeline Medical Group. Overnight there was a burst of multi-factor prompts ' +
    'against one account, and one of them was approved. Nothing was bypassed and every control ' +
    'did what it was configured to do.',
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
      summary: 'Thirty-eight multi-factor prompts against one account between 02:36 and 03:14',
      detail:
        'The identity platform sent 38 push notifications to the registered device for d.whitcombe, ' +
        'a ward administrator, between 02:36 and 03:14. Thirty-seven were denied or expired. The ' +
        'thirty-eighth, at 03:14:22, was approved. The correct password was supplied on every ' +
        'attempt. Rule history: fired 6 times in thirty days, 4 closed as users retrying on a bad ' +
        'signal.',
      source: 'd.whitcombe',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 130,
      surface: 'raw-log',
      summary: 'Every attempt supplied the correct password from the same external address',
      detail:
        'All 38 attempts came from 203.0.113.117 and supplied the correct password. There is not a ' +
        'single password failure in the sequence. The account has no password change in ninety days ' +
        'and the address has no prior history with this organisation. Attempts arrive at intervals ' +
        'between 45 and 90 seconds.',
      source: '203.0.113.117',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 290,
      surface: 'network-flow',
      summary: 'The address appears in a credential list traded three weeks ago',
      detail:
        'The account email address and a password appear in a combined credential list published on ' +
        'the 9th, aggregated from unrelated consumer service breaches. The password in the list ' +
        'matches the pattern the organisation permits and the account has not changed its password ' +
        'since 2024. No system belonging to this organisation was breached to produce that list.',
      source: 'open source',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 450,
      surface: 'cloud-audit',
      summary: 'The session that followed read a shared mailbox for nineteen minutes',
      detail:
        'From 03:15 to 03:34 the session opened the ward administration shared mailbox and read 62 ' +
        'messages, searching for terms including rota, bank staff, agency and payroll. Nothing was ' +
        'sent, forwarded or deleted. The mailbox contains staffing schedules and agency contact ' +
        'details, and the account is entitled to reach it.',
      source: 'd.whitcombe',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 610,
      surface: 'host-artefact',
      summary: 'The registered device shows the prompts arriving overnight on a locked phone',
      detail:
        'The authenticator application on the registered device logs 38 prompts between 02:36 and ' +
        '03:14. The prompt shows the application name and an approve or deny choice. It does not ' +
        'show a number to match, the source address, or the location of the sign-in. Number ' +
        'matching is available in this product and is not enabled in the current policy.',
      source: 'registered device',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 770,
      surface: 'alert-queue',
      summary: 'No rule exists for repeated denials followed by an approval',
      detail:
        'The identity platform alerts on ten failed passwords in ten minutes and on impossible ' +
        'travel. It has no rule for repeated multi-factor denials, because a denial is a successful ' +
        'control action rather than a failure. Thirty-seven denials generated no alert of any kind. ' +
        'The approval generated a routine successful sign-in record.',
      source: 'identity platform',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Ninety multi-factor prompts across the estate overnight',
      detail:
        'The estate generated 90 push prompts overnight, in line with the nightly range of 70 to ' +
        '120. Almost all are night shift clinical staff signing in at handover, each with one or ' +
        'two prompts and an approval. None of the other accounts shows a run of denials. Rule ' +
        'history: fired 30 times in thirty days, 30 closed as expected overnight volume.',
      source: 'identity platform',
      claimedSeverity: 'low',
    },
  ],
};

export const APPROVE_APPROVE_APPROVE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The password was already stolen, from a combined credential list published on the 9th and aggregated from consumer service breaches that had nothing to do with this organisation.',
    'The account had not changed its password since 2024, so the one in the list still worked.',
    'From 02:36 somebody signed in with it, over and over, from one external address, every 45 to 90 seconds.',
    'Each attempt sent a push prompt to a phone on a bedside table. Thirty-seven were denied or expired.',
    'At 03:14 the thirty-eighth was approved, by somebody who had been woken thirty-eight times and had no way to tell what they were approving.',
    'The prompt shows an application name and approve or deny. It does not show a number to match, an address, or a location. Number matching is available in the product and is not switched on.',
    'The session read the ward administration shared mailbox for nineteen minutes, searching for rota, bank staff, agency and payroll, and took nothing.',
    'Nothing was bypassed. The second factor was requested and satisfied exactly as designed, and thirty-seven denials generated no alert because a denial is a control working.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1621'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'The arithmetic is the finding and it is right there on the row. Thirty-seven denials and ' +
        'one approval in thirty-eight minutes, with the correct password every time. Four of six ' +
        'previous firings were people retrying on a bad signal, and that is what this is supposed ' +
        'to look like, but somebody retrying on a bad signal gets a password wrong occasionally and ' +
        'gives up long before the thirty-eighth attempt at three in the morning. The instinct this ' +
        'event is building is to read the SHAPE of a sequence rather than its outcome: an approval ' +
        'at the end of thirty-seven denials is not an approval, it is somebody giving in.',
      standIn:
        'Thirty-eight push prompts on one account between 02:36 and 03:14. Thirty-seven denied, the ' +
        'thirty-eighth approved, correct password on all of them. Four of six this month were bad ' +
        'signal, but nobody retries thirty-eight times at three in the morning. Raising it.',
      commandOptions: [
        { command: "awk '$5==\"d.whitcombe\" {print $1, $6}' /var/log/idp/mfa.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep whitcombe /var/log/idp/mfa.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status idp-push', ...STATUS_CHECK },
        { command: 'cat /var/log/idp/mfa.log', ...DUMP_ALL },
        { command: 'grep -c DENY /var/log/idp/mfa.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count the denials and the approvals on that account, and look at when each happened.',
      guidance:
        'The last prompt was approved. Ask how many came before it, and what time it was.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1621', 'T1078.004'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ir-lead', 'network-analyst'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.write-rule'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The detail that removes any innocent reading, and it is an absence again: not one password ' +
        'failure in thirty-eight attempts. A person retrying gets it wrong sometimes. Something ' +
        'that has the password and is only waiting on the second factor never does. That single ' +
        'observation tells the floor the password is already gone, which changes what containment ' +
        'means, and it tells them the attacker was never guessing. The 45 to 90 second interval is ' +
        'the other half: that is a script pacing itself, and it is also long enough to be maximally ' +
        'annoying to somebody trying to sleep.',
      standIn:
        'All thirty-eight from one external address with the correct password every single time. ' +
        'Not one password failure in the whole sequence. Somebody retrying gets it wrong sometimes; ' +
        'this never did. The password is already stolen and they were only ever waiting on the ' +
        'second factor.',
      commandOptions: [
        { command: "awk '$5==\"d.whitcombe\" {print $7}' /var/log/idp/auth.log | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 203.0.113.117 /var/log/idp/auth.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-idp', ...STATUS_CHECK },
        { command: 'cat /var/log/idp/auth.log', ...DUMP_ALL },
        { command: 'nmap -p 443 203.0.113.117', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check how many of those attempts got the password wrong.',
      guidance:
        'Ask whether they ever mistyped it. What it means if they never did is the whole finding.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1589.001'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.probe-pattern'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Where the password came from, and the answer is nowhere near this organisation. A combined ' +
        'list published on the 9th, aggregated from consumer service breaches, containing a work ' +
        'email address and a password that still works because the account has not changed it since ' +
        '2024. Nothing here was breached to produce that. Saying so explicitly matters, because a ' +
        'floor that assumes an internal compromise will spend the day looking for one that does not ' +
        'exist. The finding for the debrief is the reuse and the age: a password that has been ' +
        'unchanged for two years will eventually appear in somebody else breach.',
      standIn:
        'The account email and a working password appear in a combined list published on the 9th, ' +
        'built from consumer breaches nothing to do with us. Password unchanged since 2024, so it ' +
        'still worked. Nothing of ours was breached to produce that list. Do not go looking for an ' +
        'internal compromise.',
      commandOptions: [
        { command: 'grep -i whitcombe /var/log/osint/credential-monitor.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk '/2026-08-09/ {print $3, $5}' /var/log/osint/credential-monitor.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status osint-feed', ...STATUS_CHECK },
        { command: 'cat /var/log/osint/credential-monitor.log', ...DUMP_ALL },
        { command: 'grep -c LISTED /var/log/osint/credential-monitor.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out whether that password has turned up anywhere outside this organisation.',
      guidance:
        'They already had the password. Ask where somebody would have got it, and whether it was ' +
        'from us.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1114.002'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.reset-password', 'act.dismiss', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'What it was for, and the search terms say it plainly: rota, bank staff, agency, payroll. ' +
        'Nothing was sent, forwarded or deleted, so a floor measuring harm by what left will call ' +
        'this a near miss. It is preparation and it succeeded. Somebody now knows the ward staffing ' +
        'pattern, which agencies are used and who is contacted about shifts, which is exactly what ' +
        'is needed to phone a ward at four in the morning and sound like they belong. The useful ' +
        'output is not "no data exfiltrated", it is a warning to the ward and the agencies about ' +
        'the specific approach this enables.',
      standIn:
        'The session read the ward administration mailbox for nineteen minutes, sixty-two messages, ' +
        'searching rota, bank staff, agency and payroll. Nothing sent, forwarded or deleted. They ' +
        'were not stealing, they were learning how ward staffing works and who gets called about ' +
        'shifts.',
      commandOptions: [
        { command: "awk '$4==\"MailboxSearch\" {print $1, $7}' /var/log/cloud/audit.log | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "MailItemsAccessed\\|MailboxSearch" /var/log/cloud/audit.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mail-audit', ...STATUS_CHECK },
        { command: 'cat /var/log/cloud/audit.log', ...DUMP_ALL },
        { command: 'grep -c MailboxSearch /var/log/cloud/audit.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at what the session searched for, not just how many messages it opened.',
      guidance:
        'Nothing was taken. Ask what they were looking for and what they would do with it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'detection-engineer'],
      correctActions: ['act.preserve'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['detection-engineer', 'ir-lead'],
      why:
        'The device did exactly what it was configured to do, which is why this is graded a true ' +
        'positive rather than a failure, and it is also where the report is most likely to go ' +
        'wrong. The prompt shows an application name and approve or deny. It does not show a number ' +
        'to match, an address, or a location. So at 03:14, after being woken thirty-eight times, ' +
        'the person had no information available with which to make the decision correctly. That is ' +
        'not carelessness, it is a design that assumed the user could tell one prompt from another. ' +
        'Number matching is available in this product and switched off, and naming that plainly is ' +
        'the difference between a fix and a training slide.',
      standIn:
        'The authenticator logged all thirty-eight prompts. The prompt shows an app name and approve ' +
        'or deny. No number to match, no address, no location. At 03:14 she had no way to tell what ' +
        'she was approving. Number matching exists in this product and it is not switched on.',
      commandOptions: [
        { command: 'grep -i "number matching\\|numberMatch" /etc/idp/mfa-policy.conf', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -A6 push /etc/idp/mfa-policy.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status idp-push', ...STATUS_CHECK },
        { command: 'cat /etc/idp/mfa-policy.conf', ...DUMP_ALL },
        { command: 'grep -c prompt /var/log/idp/mfa.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what information the prompt actually gives somebody before they tap approve.',
      guidance:
        'Ask what she could see when she approved it. If the answer is almost nothing, this is not ' +
        'her mistake.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1621'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['ir-lead', 'soc-operator'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'Why nothing fired, and it is a genuinely interesting gap rather than an oversight. The ' +
        'platform alerts on failed passwords and impossible travel. It has no rule for repeated ' +
        'multi-factor denials, because a denial is a successful control action and monitoring is ' +
        'built around failures. So thirty-seven consecutive successes of a security control ' +
        'produced silence, and the one moment it stopped working produced an ordinary sign-in ' +
        'record. Two recommendations come out of this seat and only one of them is a rule. The rule ' +
        'is repeated denials followed by an approval, which is cheap and would have fired here. The ' +
        'better fix is number matching, because it ends the attack at the first prompt rather than ' +
        'detecting it at the thirty-eighth, and saying which is which is the job.',
      standIn:
        'Nothing fired because we alert on failures and thirty-seven denials are thirty-seven ' +
        'successes. The approval logged as an ordinary sign-in. I can write a rule for repeated ' +
        'denials followed by an approval and backtest it over thirty days, and it would have caught ' +
        'this. Number matching would have stopped it at the first prompt. I would rather have the ' +
        'second and the rule as backup.',
      commandNudge:
        'Work out why thirty-seven denials generated no alert, and what a rule for this would ' +
        'actually look for.',
      guidance:
        'Ask what our alerting counts. If it only counts failures, a control succeeding thirty-seven ' +
        'times is invisible.',
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
        'Ninety push prompts overnight, inside the nightly range of 70 to 120, almost all night ' +
        'shift clinical staff signing in at handover with one or two prompts each and an approval. ' +
        'The volume is a bigger number than thirty-eight and it means nothing. The comparison that ' +
        'settles it is in the last sentence of the row: none of the other accounts shows a run of ' +
        'denials, which is the exact property that made the one account worth working. This is here ' +
        'so a beginner floor practises checking the distribution rather than the total, because ' +
        'ninety prompts across sixty accounts and thirty-eight prompts against one are opposite ' +
        'findings.',
      standIn:
        'Ninety prompts across the estate overnight, inside the normal 70 to 120, almost all night ' +
        'shift handover with one or two each and an approval. None of them has a run of denials. ' +
        'That is what normal looks like. Closing it.',
      commandOptions: [
        { command: "awk '$6==\"DENY\" {print $5}' /var/log/idp/mfa.log | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: "awk '{print $5}' /var/log/idp/mfa.log | sort | uniq -c | sort -rn | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status idp-push', ...STATUS_CHECK },
        { command: 'cat /var/log/idp/mfa.log', ...DUMP_ALL },
        { command: 'grep -c PROMPT /var/log/idp/mfa.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Group the overnight prompts by account and see whether any other account looks like yours.',
      guidance:
        'Ninety is a bigger number than thirty-eight. Ask how they are spread before you decide it ' +
        'matters.',
    },
  ],
};
