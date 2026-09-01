/**
 * Scenario 41: Read Only.
 *
 * Nine legitimate actions in an order nobody anticipated.
 *
 * WHAT THIS TEACHES
 *
 * That there are incidents with no vulnerability in them at all. Nothing here is
 * exploited, misconfigured or bypassed. Every action is one the account is
 * entitled to take, performed through the interface it was built for, and every
 * one of them succeeds because it is supposed to.
 *
 * The flaw is in the sequence. A payment can be created, approved, and cancelled
 * before settlement. Cancelling releases the hold on the member balance but
 * leaves the approval attached to the payment record, and a cancelled payment
 * can be reinstated by the officer who raised it without a fresh approval. Loop
 * that and one approval can carry any number of payments, each individually
 * under the limit that would have required a second officer.
 *
 * WHY DETECTION ENGINEERING LEADS
 *
 * Because there is nothing to detect at the level everything is watched.
 * Create, approve, cancel and reinstate are all normal, all logged as successes,
 * and all boring. A rule on any single one of them fires hundreds of times a
 * day. The only thing that distinguishes this is the shape of the sequence, and
 * building a detection about a sequence rather than an event is a genuinely
 * different piece of work.
 *
 * THE HARD PART FOR THE FLOOR
 *
 * Explaining it. There is no malware to show anybody, no compromised account, no
 * external address. `ev.6` is where somebody has to make a business audience
 * understand that money left through a feature working correctly.
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

const ID = 'read-only';

export const READ_ONLY: Scenario = {
  id: ID,
  title: 'Read Only',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 10:00 at Fenmarch Credit Union. The monthly reconciliation is out by 214,000 pounds and ' +
    'every individual transaction in it was properly authorised. Nothing has been hacked.',
  roles: [
    'soc-operator',
    'log-analyst',
    'cloud-security',
    'detection-engineer',
    'fusion-analyst',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Monthly reconciliation out by 214,000 pounds with no unauthorised transactions',
      detail:
        'Finance reports the month end reconciliation short by 214,000 pounds across 61 payments. ' +
        'Every one of the 61 carries a valid approval record, a named approving officer and a ' +
        'timestamp. No transaction is unauthorised, no account is overdrawn and no control reports ' +
        'a failure. Rule history: reconciliation breaks are raised to finance, not to security, and ' +
        'no security rule has fired.',
      source: 'fcu core banking',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'All 61 payments carry the same approval identifier',
      detail:
        'The 61 payments reference approval APR-99140 in their authorisation field. That approval ' +
        'was granted once, on 3 August, by a second officer, against a single payment of 3,400 ' +
        'pounds. The approval record has no expiry and is not marked consumed. The 61 payments were ' +
        'raised between 3 August and yesterday, each between 3,100 and 4,900 pounds.',
      source: 'fcu core banking',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'cloud-audit',
      summary: 'The pattern is create, approve, cancel, reinstate, repeat',
      detail:
        'The audit trail shows a repeating sequence performed by one payments officer: raise a ' +
        'payment, obtain approval, cancel it before settlement, then reinstate the cancelled ' +
        'payment with a changed payee and amount. Reinstatement is available to the officer who ' +
        'raised the payment and does not request a fresh approval, because the payment already ' +
        'carries one. Each of the four actions is a normal operation performed hundreds of times a ' +
        'day across the credit union.',
      source: 'j.pemberton-vale',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'raw-log',
      summary: 'Every payment sits just under the second approval threshold',
      detail:
        'All 61 amounts fall between 3,100 and 4,900 pounds. The second approval threshold is 5,000 ' +
        'pounds. The officer daily aggregate limit is 25,000 pounds and no day exceeds 19,600. No ' +
        'individual payment, and no single day, breaches any configured limit. The limits check ' +
        'each payment and each day independently and there is no rolling total.',
      source: 'fcu core banking',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'The payees are eleven accounts opened in the four weeks before the first payment',
      detail:
        'The 61 payments went to eleven beneficiary accounts at four institutions, all opened ' +
        'between 6 July and 30 July. Names are close variants of genuine Fenmarch suppliers, ' +
        'differing by a word or a legal suffix. Nine of the eleven have since been emptied and ' +
        'closed. Two remain open holding a combined 18,400 pounds.',
      source: 'payments records',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'No control failed and no policy was breached',
      detail:
        'Review confirms the officer held the correct role, the approval was genuinely granted by a ' +
        'second officer, every payment was under the threshold, no daily limit was exceeded, and ' +
        'every action was performed through the standard interface. The vendor documentation ' +
        'describes reinstatement of a cancelled payment as intended behaviour to avoid re-keying. ' +
        'There is no configuration option to require re-approval on reinstatement.',
      source: 'fcu core banking',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Four hundred payments cancelled and reinstated across the credit union this month',
      detail:
        'Cancel and reinstate is used 400 times a month across all branches, almost always within ' +
        'minutes, to correct a mistyped payee reference or sort code before settlement. In 396 ' +
        'cases the reinstated payment has the same amount and the same payee as the cancelled one. ' +
        'Rule history: no rule covers this and none has ever fired.',
      source: 'fcu core banking',
      claimedSeverity: 'low',
    },
  ],
};

export const READ_ONLY_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On 3 August a payments officer raised a payment of 3,400 pounds and a second officer approved it, which is exactly what should happen.',
    'They cancelled it before settlement. Cancelling releases the hold on the balance and leaves the approval attached to the payment record.',
    'They then reinstated the cancelled payment with a different payee and a different amount. Reinstatement is available to the officer who raised it and does not ask for a fresh approval, because the payment already carries one.',
    'They repeated that loop 61 times between 3 August and yesterday, every payment between 3,100 and 4,900 pounds against a second approval threshold of 5,000.',
    'No daily aggregate exceeded 19,600 against a limit of 25,000, because the limits check each payment and each day independently and nothing keeps a rolling total.',
    'The money went to eleven accounts opened in the four weeks before the first payment, named as close variants of genuine suppliers. Nine have been emptied and closed.',
    'Nothing was exploited. The officer held the correct role, the approval was genuine, every payment was under the threshold, and every action went through the standard interface.',
    'The vendor documents reinstatement as intended behaviour so officers do not have to re-key a payment, and there is no configuration option to require re-approval.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1657'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.reset-password'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'It arrives as a finance problem and no security rule has fired or ever would, because ' +
        'nothing failed. The contradiction is the whole reason to take it: 214,000 pounds is ' +
        'missing and every transaction that moved it was properly authorised. Those two sentences ' +
        'cannot both be comfortable. A reconciliation break with no unauthorised transaction in it ' +
        'means either the reconciliation is wrong or something authorised was not intended, and the ' +
        'second of those is a security question even though nothing in the estate will ever call it ' +
        'one.',
      standIn:
        'Month end is short 214,000 pounds across 61 payments and every one carries a valid ' +
        'approval, a named approving officer and a timestamp. Nothing is unauthorised and no ' +
        'control reported a failure. Those two things cannot both be fine. Taking it.',
      commandOptions: [
        { command: "awk -F, '$6==\"UNRECONCILED\" {print $1, $3, $5}' /var/log/core/reconciliation.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c UNRECONCILED /var/log/core/reconciliation.csv', ...COUNT_ONLY },
        { command: 'systemctl status core-banking', ...STATUS_CHECK },
        { command: 'cat /var/log/core/reconciliation.csv', ...DUMP_ALL },
        { command: 'curl -s http://198.51.100.10/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'List the payments in the break and check what they have in common.',
      guidance:
        'Money is missing and everything was authorised. Ask how both of those can be true.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1657'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The finding, and it takes one grouping to reach. Sixty-one payments all referencing the ' +
        'same approval identifier, granted once, on 3 August, by a second officer, against a single ' +
        'payment of 3,400 pounds. One approval and sixty-one payments. That is the entire fraud in ' +
        'a single comparison, and the reason nobody saw it is that every report in the bank is ' +
        'written per payment: each row shows an approval reference and a name, and looks correct in ' +
        'isolation. Grouping by the approval rather than reading down the payments is the whole ' +
        'move, and it is the sort of question nobody asks because approvals are assumed to be ' +
        'consumed.',
      standIn:
        'All 61 payments reference the same approval, APR-99140. That was granted once, on 3 ' +
        'August, by a second officer, against one payment of 3,400 pounds. One approval, sixty-one ' +
        'payments. Every report we have is per payment, so each row looks correct on its own.',
      commandOptions: [
        { command: "awk -F, '{print $7}' /var/log/core/payments.csv | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep APR-99140 /var/log/core/payments.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status core-banking', ...STATUS_CHECK },
        { command: 'cat /var/log/core/payments.csv', ...DUMP_ALL },
        { command: 'grep -c APR- /var/log/core/payments.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Group the payments by their approval reference rather than reading them one by one.',
      guidance:
        'Every payment has an approval. Ask whether they all have the same one.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1657'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.dismiss', 'act.reimage-now'],
      escalateTo: ['detection-engineer', 'ir-lead'],
      why:
        'The mechanism, and every step of it is legal. Raise, approve, cancel before settlement, ' +
        'reinstate with a changed payee and amount. Cancelling releases the hold and leaves the ' +
        'approval attached; reinstatement is available to the officer who raised it and does not ' +
        'ask for a fresh approval, because the payment already carries one. Nothing is bypassed at ' +
        'any point. The four actions are performed hundreds of times a day across the credit union ' +
        'and every one of them is logged as a success. This is the definition of a business logic ' +
        'flaw: the individual permissions are correct and the state machine allows a path nobody ' +
        'drew.',
      standIn:
        'The pattern is raise, approve, cancel before settlement, reinstate with a different payee ' +
        'and amount. Cancelling releases the hold and leaves the approval on the record, and ' +
        'reinstatement does not ask for a new one because the payment already has one. All four ' +
        'actions happen hundreds of times a day here and all four log as successes. Nothing was ' +
        'bypassed.',
      commandOptions: [
        { command: "awk -F, '$4==\"j.pemberton-vale\" {print $2, $5}' /var/log/core/audit.csv | head -40", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -E "CANCEL|REINSTATE" /var/log/core/audit.csv | head -30', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status core-banking', ...STATUS_CHECK },
        { command: 'cat /var/log/core/audit.csv', ...DUMP_ALL },
        { command: 'grep -c REINSTATE /var/log/core/audit.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Put the actions on one payment in order and see what the sequence does to the approval.',
      guidance:
        'Every action succeeded. Ask what the ORDER of them achieves that none of them does alone.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1657'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.backtest', 'act.propose-rule'],
      outOfLaneActions: ['act.write-rule', 'act.isolate', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'How it stayed under every control, and the numbers say it was deliberate. Sixty-one ' +
        'payments between 3,100 and 4,900 against a threshold of 5,000, and no day above 19,600 ' +
        'against a limit of 25,000. Somebody knew both numbers. The structural finding is in the ' +
        'last sentence and it is the useful one: the limits check each payment and each day ' +
        'independently, and nothing keeps a rolling total. So a control that stops one large theft ' +
        'permits an unlimited slow one, which is a design assumption rather than a bug. A rule on ' +
        'payments just under a threshold would fire constantly and mean nothing; the detection has ' +
        'to be about the approval being reused, which is rare, cheap and specific.',
      standIn:
        'Every payment is between 3,100 and 4,900 and the second approval threshold is 5,000. No day ' +
        'goes above 19,600 against a 25,000 limit. Somebody knew both numbers. And our limits check ' +
        'each payment and each day on its own, with no rolling total, so a control that stops one ' +
        'big theft allows an unlimited slow one. A rule on amounts near the threshold is noise. The ' +
        'rule is an approval used more than once.',
      commandOptions: [
        { command: "awk -F, '{print $5}' /var/log/core/payments.csv | sort -n | awk 'NR==1{min=$1} {max=$1} END {print min, max}'", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "threshold\\|limit" /etc/core-banking/approval-policy.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status core-banking', ...STATUS_CHECK },
        { command: 'cat /var/log/core/payments.csv', ...DUMP_ALL },
        { command: 'wc -l /var/log/core/payments.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the payment amounts against the approval threshold, and the daily totals against ' +
        'the daily limit.',
      guidance:
        'Nothing breached a limit. Ask what the limits actually measure, and over what period.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1657'],
      firstResponder: 'forensics',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Where the money went, and it establishes premeditation beyond argument. Eleven beneficiary ' +
        'accounts at four institutions, all opened between 6 July and 30 July, which is the four ' +
        'weeks before the first payment on 3 August. Names are close variants of genuine Fenmarch ' +
        'suppliers, differing by a word or a legal suffix, which is what makes a payment record ' +
        'read as ordinary to anybody scanning it. Nine emptied and closed, two still open with ' +
        '18,400 between them. That last number is the only recoverable money on this board and it ' +
        'is time-critical, so it goes to the front of the report rather than the end. Preserve ' +
        'carefully: this will be a criminal matter and an insurance claim.',
      standIn:
        'Eleven beneficiary accounts at four institutions, all opened between 6 July and 30 July, ' +
        'four weeks before the first payment. Names are close variants of real suppliers, off by a ' +
        'word or a legal suffix, so the payment records read as ordinary. Nine emptied and closed. ' +
        'Two still open with 18,400 between them, and that is the only money we can still stop. ' +
        'Sealed for the police and the insurer.',
      commandOptions: [
        { command: "awk -F, '{print $8, $9}' /var/log/core/payments.csv | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -f /var/log/core/beneficiaries.txt /var/log/finance/supplier-master.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status core-banking', ...STATUS_CHECK },
        { command: 'cat /var/log/core/payments.csv', ...DUMP_ALL },
        { command: 'grep -c BENEFICIARY /var/log/core/payments.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find where the 61 payments went, and check those accounts against the real supplier list.',
      guidance:
        'Ask who received this. Then ask when those accounts were opened.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'ir-lead',
      alsoAppropriate: ['detection-engineer', 'fusion-analyst'],
      correctActions: ['act.declare', 'act.notify-legal'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.reset-password'],
      escalateTo: [],
      why:
        'Graded a true positive because the review is correct and the finding is real: nothing ' +
        'failed. Correct role, genuine approval, every payment under the threshold, no daily limit ' +
        'exceeded, standard interface throughout, and the vendor documents reinstatement as ' +
        'intended behaviour with no option to require re-approval. That is the hardest thing on ' +
        'this board to communicate, and it is this seat job. An audience expects a breach story ' +
        'with malware and a stolen password, and what they are getting is that 214,000 pounds left ' +
        'through a feature working exactly as designed. Two things follow that have to be said in ' +
        'the same breath, because either alone is misleading. Nothing was hacked, so no technical ' +
        'control needs replacing. And nothing being hacked is not reassuring, because the same ' +
        'sequence works again tomorrow and the vendor has no setting that stops it.',
      standIn:
        'Everything checks out. Correct role, genuine second officer approval, every payment under ' +
        'threshold, no daily limit exceeded, standard interface throughout. The vendor documents ' +
        'reinstatement as intended so officers do not re-key, and there is no setting to require ' +
        're-approval. Nothing was hacked. That is not reassuring: the same sequence works again ' +
        'tomorrow and the vendor cannot switch it off.',
      commandNudge:
        'Read what the vendor says reinstatement is for, and check whether it can be configured off.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['detection-engineer'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.reset-password'],
      escalateTo: ['detection-engineer'],
      why:
        'Four hundred cancel-and-reinstate operations a month, which is the exact sequence the ' +
        'fraud used, and 396 of them are somebody fixing a mistyped sort code within minutes. This ' +
        'is here because after ev.3 the instinct is to treat the sequence as the finding, and if ' +
        'the floor recommends alerting on cancel-and-reinstate the bank gets 400 alerts a month and ' +
        'switches it off by Christmas. The discriminator is in the row and it is precise: in 396 ' +
        'cases the reinstated payment has the same amount and the same payee. The fraud changed ' +
        'both. That is the rule, and the difference between it and the naive version is the ' +
        'difference between a control that survives and one that gets tuned to nothing.',
      standIn:
        'Cancel and reinstate happens 400 times a month across the branches and 396 of those have ' +
        'the same amount and the same payee, somebody fixing a sort code within minutes. Ours ' +
        'changed both. If we alert on the sequence we get 400 a month and it gets switched off. ' +
        'Alert on reinstatement where the payee or amount changed.',
      commandOptions: [
        { command: "awk -F, '$2==\"REINSTATE\"' /var/log/core/audit.csv | awk -F, '{print $8, $5}' | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c REINSTATE /var/log/core/audit.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status core-banking', ...STATUS_CHECK },
        { command: 'cat /var/log/core/audit.csv', ...DUMP_ALL },
        { command: 'sed -i "/REINSTATE/d" /etc/core-banking/approval-policy.conf', ...MUTATE },
      ],
      commandNudge:
        'Check what changes between the cancelled payment and the reinstated one in the normal ' +
        'cases.',
      guidance:
        'The sequence itself is common. Ask what is different about the ones that mattered.',
    },
  ],
};
