/**
 * Package 3: Incident Detection and Alert Triage -- 21 exercises across 4 modules.
 *
 * WHAT CHANGES HERE
 *
 * Packages 1 and 2 taught a student to find a thing in a log. This package is
 * the first one where the answer is a judgement rather than a fact, and it is
 * graded accordingly: on precision and recall against ground truth, not on
 * whether a string matched.
 *
 * The queue a student works is the SAME 15 August that Package 2 taught them to
 * read by hand. They have already found the intrusion the slow way, one grep at
 * a time. Meeting it again as eight alerts inside eighty-two teaches the part
 * that actually transfers to the job: the detection stack saw nearly all of it
 * at the time, and the reason nobody acted is that it also saw everything else.
 *
 * THE FAILURE MODE THIS PACKAGE IS BUILT AROUND
 *
 * New operators escalate too much. It feels safe -- nobody is ever fired for
 * escalating -- and it is the single most destructive habit in a SOC, because a
 * tier-two queue that receives forty escalations a shift stops being read. So
 * several exercises here impose an escalation budget, and `triage-accuracy`
 * reports precision and recall separately rather than averaging them. A student
 * who escalates everything scores perfect recall and fails, which is the correct
 * outcome and the whole lesson.
 *
 * WHY `tune` IS A DECISION AND NOT A KIND OF DISMISSAL
 *
 * The monitoring host with a stale password produces more failed logins in a day
 * than the attacker does. Every one of those alerts is CORRECT. Dismissing them
 * individually is a losing game at 288 a day, and calling them false positives
 * would be a lie that eventually gets a working rule deleted. `tune` is the
 * disposition that says: close this, and fix the thing that generated it.
 *
 * EVERY EXPECTED ANSWER IS COMPUTED FROM THE CORPUS.
 *
 * Not one alert id is written by hand below. They are derived from
 * `alerts.generated.ts` through the helpers at the top of this file, so
 * regenerating the corpus can never leave a stale answer key behind.
 */

import type { Exercise, LearningPackage, Teach } from '@soc/shared';

import { alertsInIncident, alertsRequiring, queueForStudent } from '../services/alerts.js';
import { alertsWhereCopilotMisleads, alertsWithCopilotFlaw } from '../services/copilot.js';
import { PACKAGE_3_PRACTICE } from './package3-practice.js';

const INTRO = 'q-intro';
const NOISY = 'q-noisy-rule';
const NIGHT = 'q-nightshift';
const WINDOW = 'q-correlation';

/** The incident threaded through the corpus, matching generate-alerts.ts. */
const INCIDENT = 'INC-2026-0815';

// --- expected answers, derived from the generated corpus ---------------------

function queueSize(queueId: string): number {
  return queueForStudent(queueId)?.alerts.length ?? 0;
}

/** Alert ids in a queue raised by a given rule. */
function idsByRule(queueId: string, ruleId: string): string[] {
  return (queueForStudent(queueId)?.alerts ?? [])
    .filter((alert) => alert.ruleId === ruleId)
    .map((alert) => alert.id);
}

/**
 * The single alert a rule raised in a queue.
 *
 * Throws rather than returning undefined: an exercise that silently loses its
 * subject would grade every student against an empty id and fail all of them.
 */
function oneByRule(queueId: string, ruleId: string): string {
  const found = idsByRule(queueId, ruleId);
  if (found.length !== 1) {
    throw new Error(
      `Expected exactly one "${ruleId}" alert in queue "${queueId}", found ${found.length}. ` +
        'The alert corpus and Package 3 have drifted apart.',
    );
  }
  return found[0]!;
}

const INTRO_SIZE = queueSize(INTRO);
const INTRO_ESCALATE = alertsRequiring(INTRO, 'escalate');
const INTRO_DISMISS = alertsRequiring(INTRO, 'dismiss');
const INTRO_EICAR = oneByRule(INTRO, 'av-signature-match');

const NOISY_SIZE = queueSize(NOISY);
const NOISY_TUNE = alertsRequiring(NOISY, 'tune');
const NOISY_ESCALATE = alertsRequiring(NOISY, 'escalate');
const NOISY_MONITORING = idsByRule(NOISY, 'auth-failed-password');

const WINDOW_SIZE = queueSize(WINDOW);
const WINDOW_INCIDENT = alertsInIncident(WINDOW, INCIDENT);
const WINDOW_PIVOT = oneByRule(WINDOW, 'auth-success-after-failures');
const WINDOW_CONNTRACK = idsByRule(WINDOW, 'net-conntrack-exhaustion');

const NIGHT_SIZE = queueSize(NIGHT);
const NIGHT_ESCALATE = alertsRequiring(NIGHT, 'escalate');
const NIGHT_TUNE = alertsRequiring(NIGHT, 'tune');
const NIGHT_PIVOT = oneByRule(NIGHT, 'auth-success-after-failures');
const NIGHT_CRON = oneByRule(NIGHT, 'cron-modified');
const NIGHT_SQLI = oneByRule(NIGHT, 'web-sql-injection-keyword');
const NIGHT_STAGING = oneByRule(NIGHT, 'archive-of-sensitive-path');

/**
 * The escalation budget for a full shift.
 *
 * Derived rather than chosen: one and a half times the number of alerts that
 * genuinely warrant escalation. Tight enough that escalating on a hunch costs
 * something, loose enough that one honest mistake does not fail the exercise.
 */
const NIGHT_BUDGET = Math.ceil(NIGHT_ESCALATE.length * 1.5);

// --- Module 3.5's answer key, derived from the copilot's flaw table ----------
//
// Not one alert id below is written by hand. They are read out of the generated
// flaw table, so regenerating the copilot moves these exercises with it rather
// than leaving them demanding that a student disagree with advice that is now
// perfectly sound.

/**
 * Alerts in a queue where following the copilot leads to the wrong disposition.
 *
 * Throws when there are none, rather than returning an empty list. A
 * `copilot-override` check over zero alerts passes trivially, so an exercise
 * built on one would silently stop testing anything -- which is exactly what a
 * regenerated corpus that dropped a planted mistake would produce.
 */
function copilotTraps(queueId: string, kind?: 'volume-dismissal' | 'over-escalation'): string[] {
  const found = alertsWhereCopilotMisleads(queueId, kind);
  if (found.length === 0) {
    throw new Error(
      `Queue "${queueId}" has no misleading copilot analyses${kind ? ` of kind "${kind}"` : ''}, ` +
        'so Module 3.5 has nothing to teach against. The alert corpus and the copilot corpus have ' +
        'drifted apart -- re-run gen:copilot, or fix the flaw plan.',
    );
  }
  return found;
}

/** The two over-escalations sitting in the twelve-alert introductory queue. */
const INTRO_COPILOT_TRAPS = copilotTraps(INTRO);

/** The one in the correlation window. */
const WINDOW_COPILOT_TRAPS = copilotTraps(WINDOW);

/** Every misleading analysis in the full shift, and the two that matter most. */
const NIGHT_COPILOT_TRAPS = copilotTraps(NIGHT);
const NIGHT_BASE_RATE_TRAPS = copilotTraps(NIGHT, 'volume-dismissal');

/**
 * The alert where the copilot reaches the right answer for invented reasons.
 *
 * Used by the written exercise rather than by a triage check, because there is
 * no disposition that catches it: the recommendation is correct. The only way to
 * find this one is to have read the rationale.
 */
const NIGHT_FABRICATED = alertsWithCopilotFlaw(NIGHT, 'fabricated-attribution');
if (NIGHT_FABRICATED.length === 0) {
  throw new Error(
    'No fabricated-attribution analysis in the night-shift queue, so exercise 3.5.5 has no subject.',
  );
}

// --- shared teaching material ------------------------------------------------

const SEVERITY_TEACH: Teach = {
  concept:
    'Severity and confidence are claims made by the rule that fired, not facts about the world. ' +
    'A rule author guessed at them months ago, before this alert existed. An antivirus signature ' +
    'match on a harmless test file is critical with 99% confidence; a successful login by an ' +
    'attacker who just brute-forced their way in is medium with 60%. Reading the queue by ' +
    'severity is the fastest way to miss the intrusion.',
  examples: [
    {
      command: 'Sort by severity, work top-down',
      explains:
        'What every new operator does, and why the critical EICAR alert gets forty minutes while ' +
        'the medium-severity compromise sits unread.',
    },
    {
      command: 'Read the detail, then decide the severity yourself',
      explains:
        'What experienced operators do. The rule tells you what it saw; you decide what it means.',
    },
  ],
};

const ENRICHMENT_TEACH: Teach = {
  concept:
    'Two numbers on every alert change the decision more than severity does: how many times this ' +
    'rule has fired before, and how many of those were worth acting on. A rule that has fired ' +
    '8,412 times and been right 14 times is telling you something about itself, not about the ' +
    'traffic. A rule firing for the third time ever deserves your attention even at low severity.',
  examples: [
    {
      command: 'priorFirings 8412 / priorFalsePositives 8398',
      explains:
        'This rule is wrong 99.8% of the time. That does not make this instance wrong — but it ' +
        'does mean the rule cannot be trusted to have thought about it.',
    },
    {
      command: 'priorFirings 3 / priorFalsePositives 0',
      explains:
        'Rare and never yet wrong. Worth reading carefully whatever severity it claims.',
    },
  ],
};

// --- module 3.1: reading a queue ---------------------------------------------

const MODULE_3_1: Exercise[] = [
  {
    id: '3.1.1',
    moduleId: '3.1',
    packageId: '3',
    order: 1,
    title: 'Work your first queue',
    kind: 'alert-triage',
    queueId: INTRO,
    goal: 'Read every alert before deciding anything, and escalate only what warrants it.',
    prompt:
      `${INTRO_SIZE} alerts from one morning at Ridgeline Medical Group. Exactly one of them is an ` +
      'intrusion. Give every alert a disposition: escalate it, dismiss it, or flag its rule for ' +
      'tuning. Escalate only what genuinely needs a second analyst.',
    teach: {
      concept:
        'Triage is deciding, quickly and correctly, which alerts deserve a human. The queue is not ' +
        'sorted by importance and cannot be — the tooling does not know which of its own alerts ' +
        'matter. Your first pass is about disposal: most of these will be closed, and closing them ' +
        'correctly is the job, not a preliminary to it.',
      examples: [
        {
          command: 'escalate',
          explains: 'Hand this to a second analyst now. It is, or may be, an active intrusion.',
        },
        {
          command: 'dismiss',
          explains:
            'Close it. The alert was correct or harmless and needs nothing further. Most of the queue.',
        },
        {
          command: 'tune',
          explains:
            'Close it, and flag the rule. The alert will keep arriving until somebody changes something.',
        },
      ],
    },
    hints: [
      'Read all twelve before you decide any of them. The queue only makes sense as a whole.',
      'Ignore the severity column on this pass. Read what each alert says actually happened.',
      'One alert describes an authentication that SUCCEEDED from an address that had been failing.',
    ],
    solution:
      `Escalate ${INTRO_ESCALATE.join(', ')} — the successful login from an external address that ` +
      'had been failing against this host all morning. Everything else in this queue is either the ' +
      'monitoring host with a stale password, ordinary administration, or a scanner being blocked.',
    expectedOutput:
      'One escalation. The rest dismissed or flagged for tuning, with nothing left undecided.',
    checks: [
      {
        type: 'triage-selection',
        decision: 'escalate',
        alertIds: INTRO_ESCALATE,
        forbidExtra: true,
        hint:
          'Exactly one alert in this queue warrants escalation. If you escalated more than one, ' +
          'ask what each of the others actually proves — a blocked connection proves the firewall ' +
          'works, and an administrator running sudo proves they are an administrator.',
      },
      {
        type: 'triage-accuracy',
        decision: 'dismiss',
        minRecall: 0.6,
        hint:
          'Several of these are correct alerts about entirely ordinary activity, and closing them ' +
          'is the right answer. Leaving them undecided is not.',
      },
    ],
    debrief:
      'You escalated one alert out of twelve. That ratio is roughly right, and it will feel wrong ' +
      'for a while — closing an alert you are not certain about is uncomfortable, and doing it ' +
      'eighty times a shift is the job. The discomfort is why new operators escalate too much, and ' +
      'why tier-two queues stop being read.',
    practice: PACKAGE_3_PRACTICE['3.1.1'] ?? [],
  },
  {
    id: '3.1.2',
    moduleId: '3.1',
    packageId: '3',
    order: 2,
    title: 'Severity is an assertion, not a fact',
    kind: 'alert-triage',
    queueId: INTRO,
    goal: 'Recognise that a rule’s severity says what the rule author guessed, not what happened.',
    prompt:
      'This queue contains one alert rated CRITICAL with 99% confidence. Find it, read what it ' +
      'actually describes, and give it the disposition it deserves. Write a one-line justification ' +
      'saying why the severity is wrong — mention what the file actually is and that it is a test.',
    teach: SEVERITY_TEACH,
    hints: [
      'Filter to critical severity. There is only one.',
      'Read the detail field. What is the name of the file that matched?',
      'EICAR is a deliberately inert string the antivirus industry publishes so people can prove ' +
        'their scanner works. It contains no payload and cannot execute anything harmful.',
    ],
    solution:
      `Dismiss ${INTRO_EICAR}. It is an EICAR test file — the standard harmless string used to ` +
      'verify that antivirus is functioning — downloaded during security awareness training the ' +
      'previous day. The signature match is correct and the severity is meaningless.',
    expectedOutput: 'The critical alert dismissed, with a justification naming EICAR as a test file.',
    checks: [
      {
        type: 'triage-selection',
        decision: 'dismiss',
        alertIds: [INTRO_EICAR],
        hint:
          'The critical-severity alert should be dismissed. Read its detail field before you decide ' +
          '— the file it matched is named in there.',
      },
      {
        type: 'triage-justifies',
        alertId: INTRO_EICAR,
        conceptGroups: [
          ['eicar', 'test file', 'test string'],
          ['harmless', 'inert', 'no payload', 'not malicious', 'benign'],
        ],
        hint:
          'Your justification needs to name what the file is (EICAR) and say why it does not ' +
          'matter (it is inert — it contains no payload).',
      },
    ],
    debrief:
      'The most alarming alert in the queue was the least important one, and it was rated critical ' +
      'with near-perfect confidence. Meanwhile the alert describing an actual compromise was rated ' +
      'medium at 60%. This inversion is not a flaw in the simulation — severity is assigned by ' +
      'whoever wrote the rule, in advance, without knowing anything about the event that would ' +
      'eventually trigger it.',
    practice: PACKAGE_3_PRACTICE['3.1.2'] ?? [],
  },
  {
    id: '3.1.3',
    moduleId: '3.1',
    packageId: '3',
    order: 3,
    title: 'What a rule’s history tells you',
    kind: 'multiple-choice',
    goal: 'Use prior firing counts to weigh an alert, without treating them as a verdict.',
    prompt:
      'A rule has fired 8,412 times in the last 30 days. 8,398 of those were closed as not worth ' +
      'acting on. It has just fired again. Which of these are sound conclusions? Select all that apply.',
    teach: ENRICHMENT_TEACH,
    options: [
      { id: 'a', label: 'This instance is almost certainly not worth acting on either.' },
      { id: 'b', label: 'The rule is generating far more work than value and should be tuned.' },
      { id: 'c', label: 'This instance still has to be read — history is a prior, not a verdict.' },
      { id: 'd', label: 'The rule is broken and should be deleted.' },
    ],
    hints: [
      'Two of these four are sound. One is over-confident and one is over-reaching.',
      'Ask what the base rate actually licenses you to conclude about THIS alert.',
      'A rule that is right 14 times in 8,412 is still right 14 times. What would deleting it cost?',
    ],
    solution:
      'B and C. The rule is clearly generating more noise than value and needs tuning (B), but the ' +
      'individual alert still has to be read, because a base rate is a prior and not a verdict (C). ' +
      'A is the trap: it converts "usually noise" into "is noise", which is precisely how the real ' +
      'one gets missed. D over-reaches — the rule caught something real 14 times, and deleting it ' +
      'discards that for a tuning problem.',
    expectedOutput: 'Options B and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b', 'c'],
        hint:
          'One of your selections either treats a base rate as certainty, or throws away a rule ' +
          'that has genuinely caught things. Neither is safe.',
      },
    ],
    debrief:
      'This is the reasoning that decides whether you catch the intrusion in this package. The ' +
      'brute-force rule in the full night shift has been wrong 44 times out of 61 — and the 62nd ' +
      'firing is real. Base rates tell you how much scrutiny to spend, never whether to look.',
    practice: PACKAGE_3_PRACTICE['3.1.3'] ?? [],
  },
  {
    id: '3.1.4',
    moduleId: '3.1',
    packageId: '3',
    order: 4,
    title: 'Benign true positive versus false positive',
    kind: 'short-answer',
    goal: 'Distinguish a rule that was wrong from a rule that was right about something dull.',
    prompt:
      'A DBA logs in at 03:11 and restarts a database. The "login outside business hours" rule ' +
      'fires. Separately, a rule matches the word "select" inside the URL parameter ' +
      '"selected_labs" and reports SQL injection. Both alerts get closed. In two or three ' +
      'sentences, explain why they are different kinds of closure and why the difference changes ' +
      'what you do next.',
    teach: {
      concept:
        'Both of these get closed, so it is tempting to call them both false positives. They are ' +
        'not. The overnight login genuinely happened and the rule described it accurately — it is a ' +
        'benign true positive, and the rule is working. The SQL injection alert describes something ' +
        'that did not occur — the rule is broken. Conflating them is how a SOC ends up deleting ' +
        'rules that work, because "false positive rate" gets measured and someone acts on it.',
      examples: [
        {
          command: 'Benign true positive',
          explains:
            'The event happened, the rule described it correctly, and it was authorised. Fix: ' +
            'nothing, or an exclusion if the volume is high.',
        },
        {
          command: 'False positive',
          explains:
            'The event did not happen as described. The detection logic is defective. Fix: the rule.',
        },
      ],
    },
    hints: [
      'Ask, for each one: did the thing the alert describes actually occur?',
      'One rule reported an event accurately. The other reported an event that never happened.',
      'The remedies differ. One needs an exclusion or nothing at all; the other needs the ' +
        'detection logic rewritten.',
    ],
    solution:
      'The overnight login is a benign true positive: it really happened, the rule described it ' +
      'correctly, and it was authorised maintenance. Nothing about the detection needs changing. ' +
      'The SQL injection alert is a false positive: no injection occurred, and the rule matched a ' +
      'substring inside an ordinary parameter value. That rule is defective and needs a ' +
      'word-boundary match. Recording both as "false positive" would misstate the health of a ' +
      'working rule and hide a broken one.',
    expectedOutput:
      'An answer that separates "the event happened and was authorised" from "the event did not ' +
      'happen", and draws a different remedy from each.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['benign true positive', 'benign', 'really happened', 'actually happened', 'did happen', 'genuine'],
          ['false positive', 'did not happen', "didn't happen", 'never happened', 'wrong', 'broken'],
          ['tune', 'fix the rule', 'rewrite', 'exclusion', 'detection logic', 'word boundary'],
        ],
        hint:
          'Name both categories, say which is which, and say what each one implies you should do ' +
          'about the rule.',
      },
    ],
    debrief:
      'Most SOC metrics dashboards get this wrong, and it has consequences: a team that reports a ' +
      '96% false positive rate will be told to disable rules, and the rules disabled will be the ' +
      'ones firing correctly on activity nobody bothered to allowlist.',
    practice: PACKAGE_3_PRACTICE['3.1.4'] ?? [],
  },
  {
    id: '3.1.5',
    moduleId: '3.1',
    packageId: '3',
    order: 5,
    title: 'The escalation budget',
    kind: 'alert-triage',
    queueId: INTRO,
    goal: 'Escalate under a hard cap, and feel what that constraint does to your reasoning.',
    prompt:
      'Same queue, one new rule: you may escalate at most two alerts. Tier two has one analyst on ' +
      'nights and they cannot absorb more. Everything else must be dismissed or flagged for tuning. ' +
      'Decide every alert.',
    teach: {
      concept:
        'Escalation is not free. Every alert you send up consumes an analyst who is not then ' +
        'reading the queue behind you, and a tier-two queue that receives forty escalations a shift ' +
        'is functionally the same as no escalation process at all. Capping escalations is artificial ' +
        'here and entirely real in practice — the cap is just usually implicit, and discovered the ' +
        'hard way.',
      examples: [
        {
          command: 'Escalate 8 of 12',
          explains:
            'Feels thorough, achieves nothing. You have moved the triage problem one desk over.',
        },
        {
          command: 'Escalate 1 of 12, dismiss the rest with reasons',
          explains: 'The queue is genuinely reduced and the escalation gets real attention.',
        },
      ],
    },
    hints: [
      'You already know which one matters from the first exercise. The work here is defending the ' +
        'alerts you are NOT escalating.',
      'For each alert you are tempted to escalate, ask what a second analyst would do with it that ' +
        'you have not already done.',
      'A blocked connection to a closed port has no next step. There is nothing to escalate.',
    ],
    solution:
      `Escalate ${INTRO_ESCALATE.join(', ')} and nothing else. The budget is not the constraint ` +
      'here — even with two slots available, only one alert in this queue has a next step that ' +
      'requires another person.',
    expectedOutput: 'At most two escalations, including the compromise, everything else disposed of.',
    checks: [
      {
        type: 'triage-budget',
        decision: 'escalate',
        max: 2,
        hint: 'You escalated more than two. Which ones would a second analyst actually thank you for?',
      },
      {
        type: 'triage-selection',
        decision: 'escalate',
        alertIds: INTRO_ESCALATE,
        hint: 'The compromise still has to be one of your escalations.',
      },
    ],
    debrief:
      'Note what the budget did to your thinking: it forced you to ask what escalation is FOR. That ' +
      'question — what would the next person actually do with this — is the most useful one in ' +
      'triage, and a cap is just a way of making you ask it every time.',
    practice: PACKAGE_3_PRACTICE['3.1.5'] ?? [],
  },
];

// --- module 3.2: noise and tuning --------------------------------------------

const MODULE_3_2: Exercise[] = [
  {
    id: '3.2.1',
    moduleId: '3.2',
    packageId: '3',
    order: 1,
    title: 'The loudest rule in the queue',
    kind: 'alert-triage',
    queueId: NOISY,
    goal: 'Recognise a rule that is correct and unusable, and dispose of it as a rule.',
    prompt:
      `${NOISY_SIZE} alerts from three hours of one night. One rule accounts for most of them. ` +
      'Give every alert from that rule the disposition that will actually stop it, and handle the ' +
      'rest of the queue as well.',
    teach: {
      concept:
        'A rule can be completely correct and completely unusable. The monitoring collector on this ' +
        'network has a stale password in its config and fails SSH authentication every five minutes, ' +
        'all day, forever — 288 times a day. Each alert is accurate. Dismissing them one at a time ' +
        'is not triage, it is data entry, and it is how operators stop reading the queue.',
        examples: [
        {
          command: 'dismiss × 36',
          explains: 'Correct about each alert, and tomorrow there will be 288 more.',
        },
        {
          command: 'tune',
          explains:
            'Close them and flag the rule: add an exclusion for the collector, and raise a ticket ' +
            'to fix the password that is actually wrong.',
        },
      ],
    },
    hints: [
      'Group the queue by rule. One of them dwarfs the others.',
      'Look at the source address on those alerts. Is it external, or is it a machine you own?',
      'The alerts are correct — the authentication really is failing. That makes "dismiss" true but ' +
        'useless, and "false positive" simply wrong.',
    ],
    solution:
      `Flag all ${NOISY_MONITORING.length} alerts from the failed-authentication rule for tuning. ` +
      'They come from rmg-mon-01, the internal monitoring collector, which has a stale credential. ' +
      'The rule needs an exclusion for that host and the underlying password needs fixing.',
    expectedOutput: 'The monitoring rule’s alerts flagged for tuning rather than dismissed one by one.',
    checks: [
      {
        type: 'triage-accuracy',
        decision: 'tune',
        minRecall: 0.9,
        minPrecision: 0.75,
        hint:
          'Nearly every alert from the dominant rule should be flagged for tuning. If your ' +
          'precision is low, you have also flagged things that are not rule problems.',
      },
    ],
    debrief:
      'One misconfigured host produced more failed-authentication alerts in three hours than the ' +
      'attacker produced all day. That is not a contrived ratio — it is the normal state of an ' +
      'untuned SOC, and it is why "we had an alert for that" appears in so many breach reports.',
    practice: PACKAGE_3_PRACTICE['3.2.1'] ?? [],
  },
  {
    id: '3.2.2',
    moduleId: '3.2',
    packageId: '3',
    order: 2,
    title: 'What the volume was hiding',
    kind: 'alert-triage',
    queueId: NOISY,
    goal: 'Find the real detection buried under a rule firing every five minutes.',
    prompt:
      'Same three hours. Underneath the noise is one alert that describes a genuine attack in ' +
      'progress. Escalate it. Escalate nothing else.',
    teach: {
      concept:
        'This is what alert fatigue actually costs. The noisy rule is not dangerous because it is ' +
        'annoying — it is dangerous because it trains you to skim, and the real alert looks ' +
        'superficially similar to the noise. Both are about failed authentication. One is a ' +
        'monitoring box with a bad password; the other is four external addresses working a shared ' +
        'account list.',
      examples: [
        {
          command: 'Same rule, same severity, different meaning',
          explains:
            'Noise and signal frequently share a detection. The difference is in the source and ' +
            'the pattern, never in the rule name.',
        },
      ],
    },
    hints: [
      'Set the monitoring alerts aside first, then look at what is left.',
      'Sort the remainder by source address. Which sources are external?',
      'One alert describes failures against MANY DIFFERENT accounts from MULTIPLE sources in a ' +
        'short window. That is not one machine with a bad password.',
    ],
    solution:
      `Escalate ${NOISY_ESCALATE.join(', ')} — the coordinated brute force from ${''}` +
      'four external addresses working the same account list between 09:12 and 09:47. The ' +
      'monitoring noise is a single internal host failing against a single account.',
    expectedOutput: 'One escalation: the brute-force alert.',
    checks: [
      {
        type: 'triage-selection',
        decision: 'escalate',
        alertIds: NOISY_ESCALATE,
        forbidExtra: true,
        hint:
          'Exactly one alert here warrants escalation. The distinguishing features are multiple ' +
          'external sources and many target accounts in a short window.',
      },
    ],
    debrief:
      'You found it because you deliberately set the noise aside first. That is the technique: ' +
      'dispose of the known-noisy rule as a group, then triage what remains. Working the queue ' +
      'strictly top-to-bottom means arriving at the real alert having already read thirty-six ' +
      'near-identical ones, which is exactly when people stop reading.',
    practice: PACKAGE_3_PRACTICE['3.2.2'] ?? [],
  },
  {
    id: '3.2.3',
    moduleId: '3.2',
    packageId: '3',
    order: 3,
    title: 'Tune the rule, not the symptom',
    kind: 'short-answer',
    goal: 'Write a tuning change that suppresses noise without blinding the detection.',
    prompt:
      'The failed-authentication rule fires 288 times a day for one monitoring host with a stale ' +
      'password. Propose the tuning change. Be specific about what you would exclude and what must ' +
      'still fire, and say what else needs to happen besides the rule change.',
    teach: {
      concept:
        'Tuning is where operators do lasting damage. "Suppress failed-authentication alerts" would ' +
        'silence the noise and also blind you to every brute force forever. A good tuning change is ' +
        'the narrowest exclusion that removes the known-benign case and leaves everything else ' +
        'intact — and it is always paired with fixing the underlying cause, or the exclusion becomes ' +
        'permanent.',
      examples: [
        {
          command: 'Suppress rule auth-failed-password',
          explains: 'Silences the noise and the attack. This is how detections quietly die.',
        },
        {
          command: 'Exclude source=10.20.9.40 AND account=nagios',
          explains:
            'Removes exactly the known case. A failure from that host against any other account ' +
            'still fires, and so does any other source against nagios.',
        },
      ],
    },
    hints: [
      'What is the narrowest description of the benign case? Which fields identify it uniquely?',
      'Test your exclusion against the attack: would the brute force from four external addresses ' +
        'still fire under your rule?',
      'An exclusion treats the symptom. What is actually broken, and who fixes it?',
    ],
    solution:
      'Exclude the specific combination — source address 10.20.9.40 (rmg-mon-01) authenticating as ' +
      'the nagios account — rather than suppressing the rule or the host outright. That keeps the ' +
      'rule firing if the collector starts failing against a different account, or if any other ' +
      'source targets nagios. Alongside it, raise a ticket to fix the stale credential in the ' +
      'monitoring config, and set the exclusion to expire so it does not outlive the problem.',
    expectedOutput:
      'A narrow exclusion scoped to both source and account, plus a ticket to fix the underlying ' +
      'credential.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['10.20.9.40', 'rmg-mon-01', 'monitoring host', 'collector', 'source'],
          ['nagios', 'account', 'user'],
          ['ticket', 'fix the password', 'stale credential', 'root cause', 'underlying', 'expire', 'review'],
        ],
        hint:
          'Scope the exclusion to both the source AND the account, and say what happens about the ' +
          'password itself — an exclusion alone leaves a broken credential in place forever.',
      },
    ],
    debrief:
      'The pairing matters more than the exclusion. Exclusions that are not paired with a fix ' +
      'accumulate, nobody remembers why they exist, and three years later a genuine attack from a ' +
      'decommissioned monitoring range is invisible. Give every exclusion an owner and an expiry.',
    practice: PACKAGE_3_PRACTICE['3.2.3'] ?? [],
  },
  {
    id: '3.2.4',
    moduleId: '3.2',
    packageId: '3',
    order: 4,
    title: 'Justify a tuning decision',
    kind: 'alert-triage',
    queueId: NOISY,
    goal: 'Record a reason another analyst can act on without re-doing your work.',
    prompt:
      'Flag the monitoring rule’s alerts for tuning, and on any one of them write a justification ' +
      'that names the source host, the account, and what actually needs fixing. Somebody reading ' +
      'only your note should be able to act without opening the alert.',
    teach: {
      concept:
        'The note you leave is the entire durable output of triage. An alert closed with no reason ' +
        'is indistinguishable from an alert nobody read, and in a breach review that distinction ' +
        'matters enormously. A good disposition note answers: what was it, why is it not an ' +
        'incident, and what should happen next.',
      examples: [
        {
          command: 'Closed - noise',
          explains:
            'Worthless. Six months later nobody can tell whether this was analysed or skipped.',
        },
        {
          command: 'Closed - rmg-mon-01 (10.20.9.40) failing as nagios, stale credential in ' +
            'monitoring config. Exclusion requested, ticket OPS-2214 to fix password.',
          explains: 'Actionable, auditable, and stops the next operator repeating the analysis.',
        },
      ],
    },
    hints: [
      'Name the host, name the account, name the cause.',
      'Say what should happen next, not just what this alert was.',
      'Write it for somebody who has not seen the alert.',
    ],
    solution:
      'Flag the failed-authentication alerts for tuning, with a note along the lines of: ' +
      '"rmg-mon-01 (10.20.9.40) failing SSH auth as nagios every 5 minutes — stale credential in ' +
      'the monitoring config, not an attack. Requesting an exclusion scoped to this source and ' +
      'account, plus a ticket to correct the password."',
    expectedOutput: 'Tuning flags applied, with at least one justification naming host, account, and remedy.',
    checks: [
      {
        type: 'triage-accuracy',
        decision: 'tune',
        minRecall: 0.9,
        hint: 'Flag the monitoring rule’s alerts for tuning before writing the justification.',
      },
      {
        type: 'triage-justifies',
        alertId: NOISY_MONITORING[0]!,
        conceptGroups: [
          ['10.20.9.40', 'rmg-mon-01', 'monitoring'],
          ['nagios'],
          ['password', 'credential', 'config', 'exclusion', 'ticket'],
        ],
        hint:
          `Write your justification on alert ${NOISY_MONITORING[0]}. It needs the source host, the ` +
          'account name, and what needs fixing.',
      },
    ],
    debrief:
      'This is the habit that separates operators who get promoted from ones who do not. The ' +
      'analysis is the same; the difference is whether it survives you closing the tab.',
    practice: PACKAGE_3_PRACTICE['3.2.4'] ?? [],
  },
  {
    id: '3.2.5',
    moduleId: '3.2',
    packageId: '3',
    order: 5,
    title: 'A rule that is simply wrong',
    kind: 'alert-triage',
    queueId: NIGHT,
    goal: 'Separate a defective detection from a correct one firing on dull activity.',
    prompt:
      'Somewhere in the night shift queue is an alert claiming SQL injection against the patient ' +
      'portal. Find it, read the request it matched, and give it the right disposition. This is a ' +
      'different kind of problem from the monitoring noise — decide which.',
    teach: {
      concept:
        'The monitoring alerts are correct detections of real events. This one is not: the rule ' +
        'matched the letters "select" inside the ordinary parameter value "selected_labs". No ' +
        'injection was attempted. That is a defective rule, and the remedy is different — an ' +
        'exclusion would paper over logic that will misfire on the next parameter containing a SQL ' +
        'keyword, and there are many.',
      examples: [
        {
          command: 'Match "select" anywhere in the query string',
          explains: 'Fires on selected_labs, deselect, reselect, and any user named Seleste.',
        },
        {
          command: 'Match SQL syntax at word boundaries, with injection structure',
          explains: 'Fires on actual injection attempts. Considerably harder to write, and correct.',
        },
      ],
    },
    hints: [
      'Search the queue for an alert mentioning SQL. There is one.',
      'Read the full request in the detail field. Where exactly does the word "select" appear?',
      'The rule has fired 3,180 times and been wrong 3,180 times. It has never once been right.',
    ],
    solution:
      `Flag ${NIGHT_SQLI} for tuning. The rule matched the substring "select" inside the parameter ` +
      'value "selected_labs" in a legitimate request. It is a false positive — the event it ' +
      'describes never happened — and the detection logic needs word-boundary and syntax awareness, ' +
      'not an exclusion.',
    expectedOutput: 'The SQL injection alert flagged for tuning.',
    checks: [
      {
        type: 'triage-selection',
        decision: 'tune',
        alertIds: [NIGHT_SQLI],
        hint:
          'The SQL injection alert describes something that did not happen. That makes it a broken ' +
          'rule rather than benign activity, and broken rules get flagged for tuning.',
      },
    ],
    debrief:
      'Note that this alert is rated HIGH severity, and that a queue containing it also contains a ' +
      'genuine intrusion rated MEDIUM. A student sorting by severity meets this one first and the ' +
      'compromise considerably later.',
    practice: PACKAGE_3_PRACTICE['3.2.5'] ?? [],
  },
];

// --- module 3.3: correlation -------------------------------------------------

const MODULE_3_3: Exercise[] = [
  {
    id: '3.3.1',
    moduleId: '3.3',
    packageId: '3',
    order: 1,
    title: 'Three alerts, one actor',
    kind: 'alert-triage',
    queueId: WINDOW,
    goal: 'Escalate a set of individually unremarkable alerts that are damning together.',
    prompt:
      `Every alert raised between 10:10 and 10:35 — ${WINDOW_SIZE} of them. Several are ` +
      'individually the kind of thing you would close without much thought. Find the ones that ' +
      'belong to the same actor and escalate exactly those.',
    teach: {
      concept:
        'Single events are almost never conclusive. A successful login is normal. Creating an ' +
        'account is normal. Adding an account to a privileged group is normal. The same user doing ' +
        'all three within seventeen minutes, from an external address, is not normal at all. ' +
        'Correlation is what turns three shrugs into an incident.',
      examples: [
        {
          command: 'Group by user, then by time window',
          explains:
            'The two dimensions that matter most. An actor leaves a trail across rules, not within one.',
        },
        {
          command: 'Ask what the sequence would look like if it were legitimate',
          explains:
            'Real provisioning has a ticket, comes from a management host, and does not follow a ' +
            'login from an unknown address by eight minutes.',
        },
      ],
    },
    hints: [
      'Two of the alerts name the same user in their source field. Start there.',
      'A third alert involves an account that did not exist twenty minutes earlier.',
      'Put them in time order and read the sequence as one story: get in, create an account, give ' +
        'it root.',
    ],
    solution:
      `Escalate ${WINDOW_INCIDENT.join(', ')}. In sequence: a password accepted for a stale test ` +
      'account from an external address that had been failing all morning; that account creating a ' +
      'new local user eight minutes later; and that new user being added to the sudo group nine ' +
      'minutes after that. Individually forgettable, together a compromise with persistence.',
    expectedOutput: 'The three alerts belonging to the intrusion escalated, and nothing else.',
    checks: [
      {
        type: 'triage-selection',
        decision: 'escalate',
        alertIds: WINDOW_INCIDENT,
        forbidExtra: true,
        hint:
          'Three alerts in this window share an actor. If you have more than three, check whether ' +
          'the extras actually connect to the same user or are just nearby in time.',
      },
    ],
    debrief:
      'You have just done the thing correlation rules exist to automate — and you did it better, ' +
      'because you could see that "account created" and "account added to sudo" involved an account ' +
      'that did not exist an hour ago. Most correlation rules cannot express that.',
    practice: PACKAGE_3_PRACTICE['3.3.1'] ?? [],
  },
  {
    id: '3.3.2',
    moduleId: '3.3',
    packageId: '3',
    order: 2,
    title: 'The alert that changes everything',
    kind: 'alert-triage',
    queueId: WINDOW,
    goal: 'Identify the moment an attempt became an intrusion, and say why it is the pivot.',
    prompt:
      'One alert in this window is the hinge: before it, an attacker was outside; after it, they ' +
      'were inside with valid credentials. Escalate it and justify it — your note must say that the ' +
      'authentication succeeded and that it followed earlier failures from the same source.',
    teach: {
      concept:
        'Every intrusion has a moment where the story changes, and everything after it is different ' +
        'in kind. A brute force that fails ten thousand times is noise. The same brute force ' +
        'succeeding once is an incident, and every subsequent action by that account — however ' +
        'ordinary it looks — has to be re-read as possible attacker activity.',
      examples: [
        {
          command: 'Failed password × 62',
          explains: 'An attempt. Worth watching, not worth waking anybody.',
        },
        {
          command: 'Accepted password, same source',
          explains:
            'An intrusion. Everything that account does from here is suspect until proven otherwise.',
        },
      ],
    },
    hints: [
      'Which alert describes an authentication that SUCCEEDED?',
      'Look at its detail field: how many times had that same source failed beforehand?',
      'Note its severity and confidence. This is the most consequential alert in the package and ' +
        'it is rated medium at 60%.',
    ],
    solution:
      `Escalate ${WINDOW_PIVOT} with a note recording that a password was ACCEPTED for a stale test ` +
      'account from an external address which had failed 62 times against this host earlier the ' +
      'same morning. That is the transition from attempted to actual compromise.',
    expectedOutput: 'The successful-login alert escalated with a justification naming both facts.',
    checks: [
      {
        type: 'triage-selection',
        decision: 'escalate',
        alertIds: [WINDOW_PIVOT],
        hint: 'The pivot is the alert describing a successful authentication, not a failed one.',
      },
      {
        type: 'triage-justifies',
        alertId: WINDOW_PIVOT,
        conceptGroups: [
          ['succeed', 'success', 'accepted', 'successful', 'got in', 'logged in'],
          ['fail', 'failure', 'brute', '62', 'prior attempt', 'earlier attempt'],
        ],
        hint:
          'Your note needs both halves: that this authentication SUCCEEDED, and that the same ' +
          'source had been FAILING beforehand. Either fact alone is unremarkable.',
      },
    ],
    debrief:
      'In the real Ridgeline timeline this alert sat unread for six days. Not because anybody was ' +
      'negligent — because it was rated medium, on a rule with a mediocre history, in a queue ' +
      'containing 288 daily alerts from a monitoring box with a bad password.',
    practice: PACKAGE_3_PRACTICE['3.3.2'] ?? [],
  },
  {
    id: '3.3.3',
    moduleId: '3.3',
    packageId: '3',
    order: 3,
    title: 'Coincidence is not correlation',
    kind: 'multiple-choice',
    goal: 'Resist the pull of a timestamp that lines up for no reason.',
    prompt:
      'At 11:12 the connection-tracking table on the web server fills up and starts dropping ' +
      'packets. At the same minute, the attacker is transferring a staged archive off the host. ' +
      'The conntrack rule has fired 96 times before and been wrong 88 of them. What is the sound ' +
      'reading?',
    teach: {
      concept:
        'Correlation by timestamp is the most seductive and least reliable technique in triage. On ' +
        'a busy host, dozens of unrelated things happen every minute, and if you go looking for ' +
        'events that share a timestamp with something you already believe, you will always find ' +
        'them. A shared clock is not a shared cause.',
      examples: [
        {
          command: 'Same minute, therefore related',
          explains:
            'The reasoning that produces confident, wrong incident reports. Ask what mechanism ' +
            'would connect the two.',
        },
        {
          command: 'Same user, same source, same session, and a plausible mechanism',
          explains: 'Correlation worth acting on.',
        },
      ],
    },
    options: [
      { id: 'a', label: 'The exfiltration caused the conntrack exhaustion; treat it as part of the incident.' },
      { id: 'b', label: 'Note the coincidence, but treat the conntrack alert as a separate capacity problem unless a mechanism links them.' },
      { id: 'c', label: 'Dismiss the conntrack alert entirely; it has been wrong 88 times.' },
      { id: 'd', label: 'Escalate both together so tier two can decide.' },
    ],
    hints: [
      'Ask what volume of traffic a single archive transfer produces, and whether it could plausibly ' +
        'exhaust a connection table.',
      'The detail field says inbound request rate was within one standard deviation of the weekly mean.',
      'You can record a coincidence without asserting a cause. That is what a good note does.',
    ],
    solution:
      'B. Record the coincidence so the next analyst is not surprised by it, but do not fold it ' +
      'into the incident without a mechanism. A single archive transfer does not exhaust a ' +
      'connection-tracking table, and the traffic volume at the time was ordinary. The table is ' +
      'undersized — a capacity defect that happened to surface in the same minute. C is wrong ' +
      'because the base rate does not license ignoring it, and D pushes an unexamined decision ' +
      'upward, which is what escalation is not for.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint:
          'One of the options asserts a causal link with no mechanism, one throws away the alert ' +
          'on its base rate, and one escalates rather than deciding. The remaining one records the ' +
          'coincidence honestly.',
      },
    ],
    debrief:
      'Incident reports are full of this error, and it is expensive: a coincidence written up as ' +
      'causation sends a networking team hunting a non-existent attack technique for a week, while ' +
      'the real capacity bug stays unfixed.',
    practice: PACKAGE_3_PRACTICE['3.3.3'] ?? [],
  },
  {
    id: '3.3.4',
    moduleId: '3.3',
    packageId: '3',
    order: 4,
    title: 'State the sequence',
    kind: 'short-answer',
    goal: 'Turn a set of correlated alerts into a narrative another analyst can act on.',
    prompt:
      'Using only the alerts in this window, write the sequence of what happened in three or four ' +
      'sentences, in order. Say what the attacker achieved at each step. Do not speculate beyond ' +
      'what the alerts support.',
    teach: {
      concept:
        'An escalation is only as useful as the story attached to it. "Three suspicious alerts, ' +
        'please review" makes tier two start from nothing. A short ordered narrative — this, then ' +
        'this, therefore that — lets them begin at containment instead of at reconstruction. Stay ' +
        'inside the evidence: what you cannot support belongs in a separate sentence marked as ' +
        'inference.',
      examples: [
        {
          command: 'Three alerts on user testuser, escalating',
          explains: 'True and nearly useless.',
        },
        {
          command:
            'At 10:14 a password was accepted for testuser from an external address after 62 ' +
            'failures. At 10:22 that session created the local account sysmon. At 10:31 sysmon was ' +
            'added to the sudo group.',
          explains: 'The reader now knows what to contain and which accounts to disable.',
        },
      ],
    },
    hints: [
      'Put the three alerts in timestamp order first.',
      'For each one, say what the attacker gained: access, then an account, then privilege.',
      'Name the accounts involved. Tier two needs to know what to disable.',
    ],
    solution:
      'At 10:14 a password was accepted for the stale test account "testuser" from an external ' +
      'address that had failed against this host 62 times that morning, giving the attacker ' +
      'interactive access. At 10:22 that session used sudo to create a new local account, "sysmon", ' +
      'named to resemble a monitoring service. At 10:31 sysmon was added to the sudo group, giving ' +
      'the attacker a privileged account that survives a password reset on testuser. The sequence ' +
      'is initial access followed by persistence and privilege escalation inside twenty minutes.',
    expectedOutput:
      'An ordered narrative naming both accounts, the external source, and what each step achieved.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['testuser'],
          ['sysmon'],
          ['sudo', 'privilege', 'admin', 'root'],
          ['10:14', '10:22', '10:31', 'then', 'after', 'next', 'followed'],
        ],
        hint:
          'Name both accounts, say that the new one gained privilege, and make the order explicit — ' +
          'either with timestamps or with sequencing words.',
      },
    ],
    debrief:
      'What you just wrote is the top of an incident report. In most SOCs the operator’s escalation ' +
      'note becomes the first paragraph of the eventual write-up almost verbatim, which is a good ' +
      'reason to write it as though it will be read by someone senior. It usually is.',
    practice: PACKAGE_3_PRACTICE['3.3.4'] ?? [],
  },
  {
    id: '3.3.5',
    moduleId: '3.3',
    packageId: '3',
    order: 5,
    title: 'What you cannot yet say',
    kind: 'short-answer',
    goal: 'Draw the line between what the alerts prove and what they merely suggest.',
    prompt:
      'From this window alone, what do you NOT know? Name at least two things a decision-maker ' +
      'would ask that these alerts cannot answer, and say what evidence would settle them.',
    teach: {
      concept:
        'The most valuable sentence in an escalation is often the one about uncertainty. An ' +
        'operator who says "the attacker has root on this host and I cannot yet tell whether they ' +
        'reached others" gets the right response. One who omits the second half gets a containment ' +
        'decision made on a false assumption of scope. Being precise about the edge of your ' +
        'knowledge is a skill, and it is rarer than technical ability.',
      examples: [
        {
          command: 'Known: the sysmon account exists and has sudo.',
          explains: 'Supported directly by an alert.',
        },
        {
          command: 'Unknown: whether the attacker used it to reach other hosts.',
          explains:
            'Requires authentication logs from other systems. Say so rather than assuming either way.',
        },
      ],
    },
    hints: [
      'Scope: do these alerts tell you anything about other hosts?',
      'Data: do they tell you whether anything was read, copied, or taken?',
      'Duration: do they tell you when the attacker first got in, or only when this rule noticed?',
    ],
    solution:
      'The alerts do not establish scope — nothing here shows whether the attacker used sysmon to ' +
      'reach other hosts, which would need authentication logs from the rest of the estate. They ' +
      'do not establish data impact — no alert in this window shows a file being read, copied, or ' +
      'sent anywhere, which would need file and egress telemetry. And they do not establish the ' +
      'true start of the intrusion, only when detection noticed: the brute force is visible from ' +
      '09:12, but whether this source had prior access needs a longer log retention window.',
    expectedOutput:
      'At least two named unknowns — scope, data impact, or dwell time — each with the evidence ' +
      'that would resolve it.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['other host', 'other system', 'other server', 'lateral', 'scope', 'spread', 'elsewhere'],
          ['data', 'file', 'exfil', 'copied', 'stolen', 'read', 'accessed', 'taken'],
          ['log', 'telemetry', 'evidence', 'need', 'would show', 'check'],
        ],
        hint:
          'Name at least two distinct unknowns — whether other systems are affected, and whether ' +
          'any data was touched — and for each say what evidence would answer it.',
      },
    ],
    debrief:
      'You were right to say nothing about data impact: in this window there is no evidence of it. ' +
      'The staging of patient records happens at 11:06, thirty-one minutes after the last alert you ' +
      'saw here. An operator who assumed "no data alerts, so no data impact" would have been ' +
      'confidently wrong within the hour.',
    practice: PACKAGE_3_PRACTICE['3.3.5'] ?? [],
  },
];

// --- module 3.4: a full shift ------------------------------------------------

const MODULE_3_4: Exercise[] = [
  {
    id: '3.4.1',
    moduleId: '3.4',
    packageId: '3',
    order: 1,
    title: 'Clear the night shift',
    kind: 'alert-triage',
    queueId: NIGHT,
    goal: 'Find every alert belonging to the intrusion in a full shift’s queue.',
    prompt:
      `${NIGHT_SIZE} alerts, midnight to noon. An intrusion runs through them that reached patient ` +
      'data. Find every alert that belongs to it and escalate them. Dispose of everything else.',
    teach: {
      concept:
        'Everything so far has been a slice. This is the whole shift, and the intrusion is spread ' +
        'across eight alerts, five rules, and three hours — mixed into a queue where one rule fires ' +
        'every five minutes and the loudest alert is a harmless test file. Work it in passes: ' +
        'dispose of the known-noisy rule as a group, then read what remains properly.',
      examples: [
        {
          command: 'Pass 1: group and dispose of the noisy rule',
          explains: 'Removes most of the volume without reading each one individually.',
        },
        {
          command: 'Pass 2: read the remainder, grouping by source and user',
          explains: 'The intrusion assembles itself once the noise is out of the way.',
        },
      ],
    },
    hints: [
      'Start by disposing of the monitoring rule as a group. That is most of the queue gone.',
      'Of what remains, group by source address and by user. The intrusion touches one external ' +
        'address and two accounts.',
      'The chain runs: brute force, successful login, account created, privilege granted, cron ' +
        'installed, outbound beacon, key-based return, archive staged. Eight alerts.',
    ],
    solution:
      `Escalate all ${NIGHT_ESCALATE.length} alerts belonging to ${INCIDENT}: the coordinated brute ` +
      'force at 09:14, the successful login at 10:14, the account creation at 10:22, the sudo group ' +
      'change at 10:31, the cron replacement at 10:40, the outbound beacon at 10:45, the key-based ' +
      'login as the new account at 11:05, and the archive of patient exports at 11:06.',
    expectedOutput: `${NIGHT_ESCALATE.length} escalations covering the full intrusion chain.`,
    checks: [
      {
        type: 'triage-accuracy',
        decision: 'escalate',
        minRecall: 1,
        hint:
          'You have missed at least one alert belonging to the intrusion. The quiet ones are the ' +
          'cron change (rated low) and the outbound connection (rated medium) — persistence and ' +
          'command-and-control rarely announce themselves.',
      },
      {
        type: 'triage-accuracy',
        decision: 'escalate',
        minPrecision: 0.6,
        hint:
          'Too many of your escalations do not belong to the intrusion. Re-read the ones you are ' +
          'least sure about and ask what a second analyst would do with each.',
      },
    ],
    debrief:
      'Eight alerts out of eighty-two, spread over three hours and five different rules, with the ' +
      'two most important ones rated medium and low. Every one of them fired at the time. The ' +
      'detection stack did its job; the queue is what failed.',
    practice: PACKAGE_3_PRACTICE['3.4.1'] ?? [],
  },
  {
    id: '3.4.2',
    moduleId: '3.4',
    packageId: '3',
    order: 2,
    title: 'The same shift, under budget',
    kind: 'alert-triage',
    queueId: NIGHT,
    goal: 'Achieve full coverage of the intrusion without flooding the analyst above you.',
    prompt:
      `Work the same queue again, with a cap: at most ${NIGHT_BUDGET} escalations. You still need ` +
      'every alert belonging to the intrusion. Precision and recall at the same time.',
    teach: {
      concept:
        'This is the actual job. Recall alone is easy — escalate everything. Precision alone is easy ' +
        '— escalate nothing. Doing both is what separates an operator from a forwarding rule, and ' +
        'it is why the two are reported separately here rather than averaged into one score that ' +
        'would hide which one you failed.',
      examples: [
        {
          command: 'Escalate 40 of 82',
          explains: 'Perfect recall, useless precision. Tier two now has your job as well as theirs.',
        },
        {
          command: 'Escalate 8 of 82, all correct',
          explains: 'What good looks like.',
        },
      ],
    },
    hints: [
      'You know which eight matter from the previous exercise. The work is in what you leave out.',
      'For each borderline alert, ask: does this change what anyone would DO?',
      'The archive alert and the cron alert both belong. The disk-space warning and the AppArmor ' +
        'denial do not — they are somebody else’s queue.',
    ],
    solution:
      `Escalate exactly the ${NIGHT_ESCALATE.length} intrusion alerts and nothing else. The ` +
      'benign true positives — the backup service account, the overnight DBA, the administrator ' +
      'patching, the mistyped password — are dismissed. The monitoring noise and the two defective ' +
      'rules are flagged for tuning.',
    expectedOutput: 'Full coverage of the intrusion within the escalation cap.',
    checks: [
      {
        type: 'triage-budget',
        decision: 'escalate',
        max: NIGHT_BUDGET,
        hint: `You are over the cap of ${NIGHT_BUDGET}. Something on your list does not change what anybody would do.`,
      },
      {
        type: 'triage-accuracy',
        decision: 'escalate',
        minRecall: 1,
        hint: 'Under the cap, but you have dropped an alert that belongs to the intrusion.',
      },
    ],
    debrief:
      'Precision and recall are reported separately for a reason you have now felt: they fail in ' +
      'opposite directions, and a single blended score would have let you pass this by escalating ' +
      'half the queue. No real SOC scores triage that way either.',
    practice: PACKAGE_3_PRACTICE['3.4.2'] ?? [],
  },
  {
    id: '3.4.3',
    moduleId: '3.4',
    packageId: '3',
    order: 3,
    title: 'The quietest alert that mattered',
    kind: 'alert-triage',
    queueId: NIGHT,
    goal: 'Escalate a low-severity alert on its content, and justify overriding the rating.',
    prompt:
      'One alert in this queue is rated LOW and describes the mechanism that would have kept the ' +
      'attacker on this host through a reboot and a password reset. Escalate it, and justify why ' +
      'the severity is wrong — say what the scheduled task actually does and why it matters.',
    teach: {
      concept:
        'Persistence is what makes an intrusion expensive. Without it, containment is a password ' +
        'reset; with it, the attacker returns after you have declared the incident closed. Cron ' +
        'changes are rated low because they are usually configuration management — 331 of the last ' +
        '340 firings were. This one downloads a remote script every fifteen minutes and pipes it ' +
        'into a shell, under an account created twenty minutes earlier.',
      examples: [
        {
          command: 'Reset the compromised password, close the incident',
          explains: 'What happens when persistence is missed. The attacker returns via cron by teatime.',
        },
        {
          command: 'Find every persistence mechanism before containing',
          explains: 'Slower, and the only version that actually ends the incident.',
        },
      ],
    },
    hints: [
      'Filter to low severity and read each one. Only one describes a change to a scheduled task.',
      'Read what the new cron entry runs. It fetches something and executes it.',
      'Ask what happens to this alert’s subject if you reset the compromised account’s password. ' +
        'Nothing — that is why it matters.',
    ],
    solution:
      `Escalate ${NIGHT_CRON} with a note recording that the replaced crontab runs curl against an ` +
      'external address every fifteen minutes and pipes the response into bash, under an account ' +
      'created twenty minutes earlier. It is a persistence mechanism that survives a password reset ' +
      'and a reboot, and containment is incomplete until it is removed.',
    expectedOutput: 'The cron alert escalated with a justification naming persistence.',
    checks: [
      {
        type: 'triage-selection',
        decision: 'escalate',
        alertIds: [NIGHT_CRON],
        hint:
          'The low-severity alert describing a replaced crontab is the one. It is the persistence ' +
          'mechanism.',
      },
      {
        type: 'triage-justifies',
        alertId: NIGHT_CRON,
        conceptGroups: [
          ['persist', 'survive', 'reboot', 'come back', 'return', 'regain', 'maintain access'],
          ['cron', 'scheduled', 'curl', 'download', 'script', 'every 15', 'beacon'],
        ],
        hint:
          'Say both what the task does (fetches and runs a remote script on a schedule) and why ' +
          'that matters (it survives containment — the attacker gets back in).',
      },
    ],
    debrief:
      'Missed persistence is the most common reason incidents reopen. Ridgeline would have reset ' +
      'the testuser password, congratulated themselves, and been re-compromised within fifteen ' +
      'minutes by a cron job nobody looked for — because the alert about it was rated low.',
    practice: PACKAGE_3_PRACTICE['3.4.3'] ?? [],
  },
  {
    id: '3.4.4',
    moduleId: '3.4',
    packageId: '3',
    order: 4,
    title: 'Leave the queue better than you found it',
    kind: 'alert-triage',
    queueId: NIGHT,
    goal: 'Flag every rule that needs work, without flagging rules that are simply doing their job.',
    prompt:
      'Work the full queue once more and concentrate on tuning. Flag every alert whose rule needs ' +
      'changing — whether because it fires on known-benign activity or because its logic is broken. ' +
      'Do not flag rules that are working correctly on activity that merely happens to be dull.',
    teach: {
      concept:
        'Tuning is the only part of triage that compounds. Every other decision you make tonight ' +
        'evaporates; a tuning flag reduces tomorrow’s queue permanently. The discipline is not ' +
        'flagging everything you closed — the backup service account alert has fired 730 times and ' +
        'been correct 730 times, and it should keep firing, because the day it fires at an unusual ' +
        'hour you want to see it.',
      examples: [
        {
          command: 'Flag: fires 288 times daily for one misconfigured host',
          explains: 'Volume with no discriminating value. Tune it.',
        },
        {
          command: 'Do not flag: fires twice nightly for the backup account, always correct',
          explains: 'Low volume, and the exception would be meaningful. Leave it alone.',
        },
      ],
    },
    hints: [
      'Two distinct categories need flagging: the very high volume rule, and the rules whose logic ' +
        'is demonstrably wrong.',
      'The SQL keyword rule and the connection-tracking rule both describe events that did not ' +
        'happen as claimed.',
      'Resist flagging the low-volume rules that were simply right about boring things.',
    ],
    solution:
      `Flag the ${NIGHT_TUNE.length} alerts whose rules need work: the failed-authentication rule ` +
      'firing continuously for the monitoring collector, the SQL keyword rule matching inside ' +
      'ordinary parameter values, the connection-tracking rule asserting a denial of service that ' +
      'the traffic volume contradicts, and the cloud root-principal rule firing on billing reads ' +
      'that cannot be delegated. Leave the backup, sudo, and out-of-hours rules alone — they are ' +
      'correct and low volume.',
    expectedOutput: 'Tuning flags on the noisy and defective rules only.',
    checks: [
      {
        type: 'triage-accuracy',
        decision: 'tune',
        minRecall: 0.85,
        minPrecision: 0.8,
        hint:
          'Low recall means you have left a rule that needs work unflagged. Low precision means you ' +
          'have flagged a rule that is doing its job correctly — check the backup and sudo alerts.',
      },
    ],
    debrief:
      'If Ridgeline had acted on the monitoring exclusion alone, the night-shift queue would have ' +
      'been forty alerts instead of eighty-two, and the eight that mattered would have been a ' +
      'fifth of it rather than a tenth. Tuning is not housekeeping — it is the highest-leverage ' +
      'thing an operator does.',
    practice: PACKAGE_3_PRACTICE['3.4.4'] ?? [],
  },
  {
    id: '3.4.5',
    moduleId: '3.4',
    packageId: '3',
    order: 5,
    title: 'The handover note',
    kind: 'short-answer',
    goal: 'Write the shift handover a day-shift analyst can act on immediately.',
    prompt:
      'Your shift ends at 08:00 and the day analyst takes the queue. Write the handover: what you ' +
      'escalated and why, what you are uncertain about, and what needs doing that you could not ' +
      'finish. Six sentences at most.',
    teach: {
      concept:
        'Handover is where incidents get dropped. The outgoing operator knows the shape of the ' +
        'night; the incoming one sees a queue with some things already closed and no idea why. A ' +
        'good handover is three things: what is live, what you are unsure about, and what is ' +
        'outstanding. The uncertainty section is the one people omit and the one that matters most.',
      examples: [
        {
          command: 'Quiet night, nothing major.',
          explains: 'The most dangerous sentence in SOC operations.',
        },
        {
          command: 'INC-2026-0815 escalated — compromise on rmg-web-02, persistence not yet removed.',
          explains: 'The incoming analyst knows in one line what they are walking into.',
        },
      ],
    },
    hints: [
      'Lead with the live incident and the host it is on.',
      'Say explicitly what you do NOT know — scope beyond this host is the obvious one.',
      'End with the outstanding actions: the tuning requests you raised and who owns them.',
    ],
    solution:
      'Escalated INC-2026-0815: rmg-web-02 compromised at 10:14 via the stale testuser account from ' +
      'an external address, with a backdoor account (sysmon) created, granted sudo, and used to ' +
      'stage an archive of patient exports at 11:06. Persistence via a cron job beaconing every ' +
      'fifteen minutes is still in place — containment is not complete. I have not established ' +
      'whether the attacker reached any other host; that needs authentication logs from the rest of ' +
      'the estate. Raised tuning requests for the monitoring collector’s failed-auth noise and for ' +
      'the SQL keyword rule. The disk-space warning on /var is real but belongs to platform ops.',
    expectedOutput:
      'A handover naming the incident, the host, the outstanding persistence, the unknown scope, ' +
      'and the tuning actions raised.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['rmg-web-02', 'web-02', 'the web server'],
          ['sysmon', 'backdoor', 'account'],
          ['persist', 'cron', 'not contained', 'still', 'outstanding', 'remains'],
          ['unknown', 'not established', 'unclear', 'other host', 'scope', 'do not know', "don't know"],
        ],
        hint:
          'A handover needs the host, the backdoor account, the fact that persistence is still in ' +
          'place, and an explicit statement of what you could not determine.',
      },
    ],
    debrief:
      'Note how much of this is about what you did not finish. Handover notes that only report ' +
      'completed work are how a live intrusion goes quiet for a shift — the incoming analyst sees ' +
      'closed alerts and assumes resolution.',
    practice: PACKAGE_3_PRACTICE['3.4.5'] ?? [],
  },
  {
    id: '3.4.6',
    moduleId: '3.4',
    packageId: '3',
    order: 6,
    title: 'Your own triage procedure',
    kind: 'short-answer',
    goal: 'Write the checklist you would follow at 02:00, before you have thought about anything.',
    prompt:
      'You are on call. An alert fires at 02:00 and wakes you. Write the checklist you will work ' +
      'through, in order, before deciding anything. Four to six steps. It has to be usable by ' +
      'somebody who has been awake for ninety seconds.',
    teach: {
      concept:
        'Judgement degrades badly at 02:00, and the answer is not to try harder — it is to decide ' +
        'in advance. A procedure written while rested is worth more than analysis performed while ' +
        'exhausted. The good ones start by establishing whether the thing is real at all, because ' +
        'the most common 02:00 outcome is a rule misfiring on a batch job.',
      examples: [
        {
          command: 'Step 1: Is it real?',
          explains:
            'Before scope, before comms. Check the rule’s history and whether the activity is ' +
            'explained by a scheduled job or a change record.',
        },
        {
          command: 'Step 4: Who needs to know, and by when?',
          explains:
            'Notification clocks for regulated data start at discovery, not at the morning stand-up.',
        },
      ],
    },
    hints: [
      'The first question is never "how bad is it" — it is "is it real".',
      'Then scope: one host or many? Then impact: what data or service is exposed?',
      'End with the two actions that are always available: contain, or escalate to a human who can ' +
        'authorise containment.',
    ],
    solution:
      'One: establish whether it is real — check the rule’s prior firing history, and whether a ' +
      'change record or scheduled job explains the activity. Two: establish scope — is this one ' +
      'host or several, one account or many, and does the source appear elsewhere tonight. Three: ' +
      'establish impact — what data or service sits on the affected systems, and is any of it ' +
      'regulated. Four: decide containment — can I isolate this without destroying evidence, and am ' +
      'I authorised to. Five: notify — who needs to know now rather than at 09:00, and does a ' +
      'notification clock start tonight. Six: write it down as I go, because I will not remember ' +
      'this accurately in the morning.',
    expectedOutput:
      'An ordered checklist that establishes reality first, then scope and impact, then containment ' +
      'and notification.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['is it real', 'real', 'verify', 'confirm', 'validate', 'false positive'],
          ['scope', 'how many', 'other host', 'spread', 'extent'],
          ['contain', 'isolate', 'block', 'disable'],
          ['notify', 'escalate', 'tell', 'inform', 'who needs to know', 'call'],
        ],
        hint:
          'Your checklist needs all four: confirm it is real, determine scope, decide on ' +
          'containment, and identify who to notify.',
      },
    ],
    debrief:
      'You have just written the artefact that turns a good night into a survivable one — and the ' +
      'first genuinely portfolio-worthy thing in this package. An on-call procedure in your own ' +
      'words, defensible in an interview, is worth more to a hiring manager than a certificate.',
    practice: PACKAGE_3_PRACTICE['3.4.6'] ?? [],
  },
];


// --- Module 3.5: working with the copilot ------------------------------------
//
// WHY THIS MODULE IS LAST
//
// Everything before it teaches a student to disposition an alert on their own
// judgement. That has to come first. An operator handed an assistant before they
// can read a queue does not learn to work with it -- they learn to do what it
// says, because they have nothing of their own to weigh against it.
//
// So the copilot arrives only after the full shift in Module 3.4, and the first
// thing it does is get two alerts wrong.
//
// WHAT THIS MODULE IS NOT
//
// It is not a lesson in distrusting AI. The copilot in this queue is right about
// most alerts, and a student who reacts by ignoring it has learned something as
// useless as one who defers to it. `solo-right` and `corroborated` score
// identically in the collaboration metric on purpose: the tool is not the point,
// and neither is refusing the tool. What is scored is the handful of alerts
// where the advice was wrong and somebody had to notice.

const COPILOT_TEACH: Teach = {
  concept:
    'The copilot reads one alert and tells you what it thinks. It is right most of the time, which ' +
    'is what makes it worth having and also what makes it dangerous: an assistant that was wrong ' +
    'half the time would be easy to ignore. Every analysis comes in four parts -- what it reads as ' +
    'risk, what it reads as mitigating, what it recommends, and what it could not see. The last ' +
    'part is the one operators skip, and it explains nearly every mistake it makes.',
  examples: [
    {
      command: 'Basis: observed',
      explains:
        'The copilot is restating something printed on the alert. You can check it in one glance, ' +
        'and it is almost never where the error is.',
    },
    {
      command: 'Basis: inferred',
      explains:
        'The copilot reasoned to this from what it observed. The observation can be true and the ' +
        'inference still wrong -- this is where most bad advice actually lives.',
    },
    {
      command: 'Basis: assumed',
      explains:
        'Nothing it was given supports this. Real assistants do not label these; this one does, ' +
        'because you have to know what one looks like before you can spot an unlabelled one.',
    },
  ],
  flags: [
    {
      flag: 'Confidence',
      means:
        'How the copilot writes, not how likely it is to be right. The two are unrelated here on ' +
        'purpose, so you can prove it to yourself.',
    },
    { flag: 'Limits', means: 'What it could not see. Read this before the recommendation, not after.' },
  ],
};

const MODULE_3_5: Exercise[] = [
  {
    id: '3.5.1',
    moduleId: '3.5',
    packageId: '3',
    order: 1,
    title: 'Read what the assistant cannot see',
    kind: 'multiple-choice',
    goal: 'Learn to check a copilot claim against what the copilot actually had access to.',
    prompt:
      'Reviewing a sudo alert, the copilot writes: "I see no approved change record covering this ' +
      'window." Its own limits section says it can see the alert and the rule’s firing history, and ' +
      'cannot see change records, ticket queues, or what the person involved says they were doing. ' +
      'What is wrong with that sentence?',
    teach: COPILOT_TEACH,
    hints: [
      'Compare the claim against the limits section on the same analysis.',
      'It is not a question of tone or confidence. Ask what it would have had to look at to know this.',
      'Reporting that something is absent requires being able to look at the place it would be.',
    ],
    options: [
      { id: 'a', label: 'Nothing -- the absence of a change record is a useful triage observation.' },
      {
        id: 'b',
        label:
          'It reports the absence of something it has no access to, so the sentence carries no information.',
      },
      { id: 'c', label: 'It is too hedged; it should state a confidence percentage alongside it.' },
      { id: 'd', label: 'Change records are an operations concern and are not relevant to triage.' },
    ],
    solution: 'b',
    expectedOutput: 'Option b.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint:
          'Read the limits section and the claim together. The copilot cannot see change records at ' +
          'all, so "I see no approved change record" describes its own blindness, not the change record.',
      },
    ],
    debrief:
      'This is the most useful habit in the module and it costs one glance. An assistant reporting ' +
      'the absence of evidence it cannot observe is reporting nothing at all -- but the sentence ' +
      'reads exactly like a finding, and it is the sentence that turns a routine sudo alert into an ' +
      'escalation. You will meet this exact claim again in the next exercise, attached to an alert ' +
      'the copilot wants you to escalate.',
    practice: PACKAGE_3_PRACTICE['3.5.1'] ?? [],
  },
  {
    id: '3.5.2',
    moduleId: '3.5',
    packageId: '3',
    order: 2,
    title: 'Work the queue with a second opinion',
    kind: 'alert-triage',
    queueId: INTRO,
    copilotEnabled: true,
    goal: 'Use the copilot on a queue you have already worked, and find where it is wrong.',
    prompt:
      'The same twelve alerts you started this package with, now with an assistant attached. Open ' +
      'the copilot on at least eight of them before you commit. It is right about most of this ' +
      `queue. It is wrong about ${INTRO_COPILOT_TRAPS.length}, and on those it wants you to escalate ` +
      'something that should be closed. Disposition all twelve.',
    teach: COPILOT_TEACH,
    hints: [
      'Open the copilot on an alert and read the mitigating factors before the recommendation.',
      'Look for the move where it names a mitigating fact and then talks itself past it. "Allowlists ' +
        'are frequently stale" is a general truth being used as if it were a finding about this record.',
      'Both alerts it is wrong about are correct detections of somebody doing their job on schedule. ' +
        'What settles them is not printed on the alert -- it is what you know about this organisation.',
    ],
    solution:
      'Escalate the intrusion alert. Close the rest. On the service-account and sudo alerts the ' +
      'copilot wants escalated, disposition them as dismiss anyway: both are documented, recurring, ' +
      'authorised activity, and the copilot has said in its own limits section that it cannot see ' +
      'change records or ask the account owner.',
    expectedOutput:
      'Twelve dispositions, one escalation, and a disagreement with the copilot on the alerts where ' +
      'its recommendation rests on a claim it had no basis for.',
    checks: [
      {
        type: 'copilot-consulted',
        minAlerts: 8,
        hint:
          'Open the copilot on at least eight alerts. Working a queue with a second opinion sitting ' +
          'unread is the cheapest mistake available here.',
      },
      {
        type: 'copilot-override',
        alertIds: INTRO_COPILOT_TRAPS,
        hint:
          'Two of the copilot’s recommendations are wrong, and both want you to escalate routine ' +
          'authorised work. Read those analyses, then disposition against them.',
      },
      {
        type: 'triage-accuracy',
        decision: 'escalate',
        minPrecision: 1,
        minRecall: 1,
        hint:
          'Exactly one alert in this queue warrants escalation. Escalating the ones the copilot ' +
          'pointed at as well would mean it triaged the queue, not you.',
      },
    ],
    debrief:
      'You were told in advance that two suggestions were wrong and you still had to find which. ' +
      'That is the easy version. Nobody tells you the number in a real shift, and the recommendation ' +
      'reads identically whether it is sound or not -- which is why the habit has to be reading the ' +
      'reasoning rather than sampling the verdicts.',
    practice: PACKAGE_3_PRACTICE['3.5.2'] ?? [],
  },
  {
    id: '3.5.3',
    moduleId: '3.5',
    packageId: '3',
    order: 3,
    title: 'The thing one alert at a time cannot show you',
    kind: 'alert-triage',
    queueId: WINDOW,
    copilotEnabled: true,
    goal: 'Find the limit that no amount of prompting fixes: the copilot sees one alert at a time.',
    prompt:
      'The twenty-minute window again. Open the copilot on at least six of these and read what it ' +
      'says about each one individually. Every analysis is defensible on its own. Then disposition ' +
      'the queue on what they have in common -- which is a thing none of those analyses mention.',
    teach: {
      concept:
        'The copilot is given one alert. Not the queue, not the shift, not the other three alerts ' +
        'that share a source address with this one. Its limits section says so on every single ' +
        'analysis: "I have not read the other alerts in this queue." Correlation is the thing you ' +
        'have that it does not, and on this queue correlation is the entire answer.',
      examples: [
        {
          command: 'One alert on its own: a failed login',
          explains:
            'Unremarkable. Thousands a day. Any assistant reading it alone will tell you to close ' +
            'it, and will be right to.',
        },
        {
          command: 'The same alert plus the two either side of it',
          explains:
            'Failures, then a success, then an archive of a sensitive path -- one account, five ' +
            'minutes. Nothing about the middle alert changed. What changed is that you read three.',
        },
      ],
    },
    hints: [
      'Read the limits section on any two analyses. They both end with the same sentence.',
      'Sort by source or by rule rather than by time, and look at what repeats.',
      'The copilot will not tell you these belong together. That judgement is the one it cannot make ' +
        'from what it was given.',
    ],
    solution:
      'Escalate the alerts belonging to the intrusion as one sequence: the failures, the success ' +
      'that follows them, and what that account did next. The copilot rates each of them ' +
      'individually and never connects them, because it is handed one alert at a time and says so.',
    expectedOutput:
      'The correlated alerts escalated as a sequence, and a disagreement with the copilot on the ' +
      'routine privileged activity it wanted escalated.',
    checks: [
      {
        type: 'copilot-consulted',
        minAlerts: 6,
        hint: 'Open the copilot on at least six of these before committing.',
      },
      {
        type: 'copilot-override',
        alertIds: WINDOW_COPILOT_TRAPS,
        hint:
          'One recommendation here is wrong in the same way as the last exercise: routine authorised ' +
          'work, escalated on a claim the copilot had no basis for.',
      },
      {
        type: 'triage-selection',
        decision: 'escalate',
        alertIds: WINDOW_INCIDENT,
        hint:
          'The alerts belonging to one actor’s sequence go together. Individually the copilot rated ' +
          'several of them as ordinary, and individually it was not being unreasonable.',
      },
      {
        type: 'triage-budget',
        decision: 'escalate',
        max: WINDOW_INCIDENT.length + 1,
        hint:
          'Correlating is not the same as escalating everything in the window -- only the alerts that ' +
          'belong to the sequence.',
      },
    ],
    debrief:
      'This is the limit worth remembering, because prompting does not fix it and a better model does ' +
      'not either: it is a question of what the assistant was handed. Anything that needs reading ' +
      'across alerts, across a shift, or across a change record is yours. That is most of what makes ' +
      'triage difficult, and it is the reason the job still exists.',
    practice: PACKAGE_3_PRACTICE['3.5.3'] ?? [],
  },
  {
    id: '3.5.4',
    moduleId: '3.5',
    packageId: '3',
    order: 4,
    title: 'A full shift, with an assistant that argues back',
    kind: 'alert-triage',
    queueId: NIGHT,
    copilotEnabled: true,
    goal: 'Hold a correct escalation against a confident, well-argued, and wrong recommendation.',
    prompt:
      'The night shift again -- eighty-two alerts, the same intrusion inside it, the same escalation ' +
      `budget of ${NIGHT_BUDGET}. This time the copilot is on. Open it on at least twenty alerts. On ` +
      'two of them it will quote you a real number and use it to argue that you should close ' +
      'something that matters. The number will be true.',
    teach: {
      concept:
        'The most dangerous thing an assistant can say to you is a correct fact deployed as the ' +
        'wrong argument. "This rule has been wrong 331 times out of 340, so close it" is sound ' +
        'reasoning about a population and worthless reasoning about an instance. Base rates tell you ' +
        'where to look first. They never tell you what a particular alert is, and specific evidence ' +
        'on the alert in front of you outranks them every time.',
      examples: [
        {
          command: 'Correct use of a base rate',
          explains:
            'Deciding which of two hundred alerts to read first, or arguing that a rule needs tuning ' +
            'because it has never once been right.',
        },
        {
          command: 'Incorrect use of the same base rate',
          explains:
            'Closing the alert in front of you because most firings of that rule were noise. A prior ' +
            'is what you fall back on when you have no specific evidence. Here you have some.',
        },
      ],
    },
    hints: [
      'When the copilot recommends closing something, read its risk factors. On the two it gets wrong ' +
        'here, that list is one line long.',
      'It also writes "nothing here looks different from the firings that were closed before". Check ' +
        'whether it was in any position to know that.',
      'Both alerts it argues away are things happening on a host, at an hour, by an account that you ' +
        'have already learned to read. Ask what this particular firing shows, not what the rule ' +
        'usually shows.',
    ],
    solution:
      'Escalate the intrusion sequence, including the two alerts the copilot argues for closing. Its ' +
      'statistic is accurate and its inference is not: a base rate describes the rule’s history, and ' +
      'what settles these two is the account, the hour, and what was touched. Stay inside the ' +
      'escalation budget on everything else.',
    expectedOutput:
      'The intrusion escalated within budget, including the two alerts the copilot recommended ' +
      'closing on historical grounds.',
    checks: [
      {
        type: 'copilot-consulted',
        minAlerts: 20,
        hint: 'Open the copilot on at least twenty of the eighty-two before committing.',
      },
      {
        type: 'copilot-override',
        alertIds: NIGHT_BASE_RATE_TRAPS,
        hint:
          'Two analyses argue from the rule’s history to a disposition of this firing. Read them, ' +
          'then escalate anyway -- the evidence on these alerts outranks the prior.',
      },
      {
        type: 'copilot-collaboration',
        minCaught: 3,
        maxMisled: 1,
        hint:
          `The copilot is wrong about ${NIGHT_COPILOT_TRAPS.length} alerts in this queue. Catching ` +
          'most of them means opening the analysis and then disagreeing with it. Following more than ' +
          'one of them into the wrong disposition fails this check.',
      },
      {
        type: 'triage-accuracy',
        decision: 'escalate',
        minRecall: 0.75,
        hint:
          'Most of the intrusion still has to be escalated. Argued out of two parts of it, you have ' +
          'missed it.',
      },
      {
        type: 'triage-budget',
        decision: 'escalate',
        max: NIGHT_BUDGET,
        hint:
          `The budget is still ${NIGHT_BUDGET}. Disagreeing with the copilot does not mean escalating ` +
          'everything it wanted closed.',
      },
    ],
    debrief:
      'You have now worked the same shift twice, once alone and once with an assistant, and the ' +
      'assistant made the two most important alerts harder rather than easier. That is not a reason ' +
      'to turn it off -- it read eighty-two alerts with you and was right about most of them. It is ' +
      'the reason the operator is still accountable for the disposition. Asked in an interview how ' +
      'you use AI in triage, this is the answer worth giving: it drafts, you decide, and you can name ' +
      'the case where you overruled it.',
    practice: PACKAGE_3_PRACTICE['3.5.4'] ?? [],
  },
  {
    id: '3.5.5',
    moduleId: '3.5',
    packageId: '3',
    order: 5,
    title: 'Right answer, invented reasons',
    kind: 'short-answer',
    goal: 'Learn that a correct recommendation can still be unusable, and say why in writing.',
    prompt:
      `On the credential-pivot alert in the night shift (${NIGHT_FABRICATED[0]}), the copilot ` +
      'recommended escalating -- and it was right. Its reasoning said the sequence matched APT28 ' +
      'tradecraft catalogued in campaigns against financial services, and that infrastructure ' +
      'overlapping the source address had been reported in prior activity by the same actor. No ' +
      'threat-intelligence source was attached to that alert, and Ridgeline Medical Group is a ' +
      'healthcare provider. In your own words: what is wrong with that reasoning, and what harm does ' +
      'it do if you escalate with it attached?',
    teach: {
      concept:
        'A recommendation can be correct and its justification worthless, and you cannot tell the ' +
        'difference from the recommendation. This is the failure mode that survives every check in ' +
        'this module, because no disposition catches it: agree with the copilot and you get the alert ' +
        'right. The damage happens downstream, in what you wrote in the handover.',
      examples: [
        {
          command: 'What the next analyst inherits',
          explains:
            'An actor name in a handover stops being your guess by the second time it is repeated. ' +
            'Scope, urgency, and who gets called are all decided from it.',
        },
        {
          command: 'What to write instead',
          explains:
            'What was observed, in what order, by which account -- and "attribution unknown". An ' +
            'escalation without an actor name is not a weaker escalation.',
        },
      ],
    },
    hints: [
      'Start with the simplest question: where would the copilot have got those two claims from?',
      'One of them can be checked against something you already know about this organisation.',
      'Then think about the handover. Who reads the actor name next, and what do they do with it?',
    ],
    solution:
      'Both claims are generated rather than retrieved. No threat-intelligence source was attached to ' +
      'the alert, nothing in the enrichment mentions an actor, and the campaign it cites targets ' +
      'financial services while Ridgeline is a healthcare provider -- so the one claim I can check is ' +
      'wrong, which tells me what to make of the one I cannot. The recommendation to escalate is ' +
      'still correct, and that is what makes it dangerous: agreeing with it costs nothing, and ' +
      'repeating its reasoning costs a great deal. If I escalate with an actor name attached, the ' +
      'next analyst inherits my attribution as an established fact and scopes the incident around it ' +
      '-- hunting for that actor’s known tooling, and possibly not looking for what is actually ' +
      'here. The escalation should say what was observed, in what order, by which account, and that ' +
      'attribution is unknown.',
    expectedOutput:
      'A written answer identifying the claims as unsupported, using the sector mismatch as the ' +
      'checkable tell, and naming the downstream cost of passing them on.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          [
            'no evidence',
            'no source',
            'not supported',
            'unsupported',
            'nothing in the alert',
            'nothing in the enrichment',
            'no intel',
            'no threat intel',
            'no threat-intelligence',
            'rather than retrieved',
            'not retrieved',
            'made up',
            'made-up',
            'invent',
            'fabricat',
            'hallucin',
            'no basis',
            'not attached',
          ],
          [
            'healthcare',
            'health care',
            'medical',
            'hospital',
            'patient',
            'not financial',
            'different sector',
            'wrong sector',
          ],
          [
            'handover',
            'hand over',
            'next analyst',
            'tier two',
            'tier 2',
            'downstream',
            'scope',
            'inherit',
            'anchor',
            'bias',
            'wrong direction',
          ],
        ],
        hint:
          'Your answer needs three things: that the claims have no source behind them, the checkable ' +
          'tell that shows it (the sector the cited campaign targets, against the sector this ' +
          'organisation is in), and what it costs the person who reads your escalation next.',
      },
    ],
    debrief:
      'This is the last exercise in the package and the one most worth carrying into an interview. ' +
      'Every other mistake in this module changed a disposition, so a check could catch it. This one ' +
      'did not -- the copilot was right -- and it is still the mistake that does the most damage, ' +
      'because a fabricated attribution repeated once becomes a fact the whole incident is scoped ' +
      'around. Read the recommendation, then read why. They fail independently.',
    practice: PACKAGE_3_PRACTICE['3.5.5'] ?? [],
  },
];

export const PACKAGE_3: LearningPackage = {
  id: '3',
  order: 3,
  title: 'Incident Detection and Alert Triage',
  summary:
    'Work a real alert queue: mostly noise, some correct alerts about entirely ordinary activity, ' +
    'and an intrusion spread thinly across eight of them. Learn to find it without escalating ' +
    'everything, and to leave the queue smaller than you found it.',
  outcomes: [
    'Triage a full shift’s alert queue and escalate only what warrants another analyst',
    'Tell a broken rule apart from a correct rule firing on authorised activity',
    'Correlate individually unremarkable alerts into a single actor’s sequence',
    'Read severity and confidence as claims to be tested rather than facts',
    'Write disposition notes, escalations, and a handover that somebody else can act on',
  ],
  prerequisites: ['2'],
  modules: [
    {
      id: '3.1',
      packageId: '3',
      order: 1,
      title: 'Reading a queue',
      summary:
        'What an alert actually asserts, why severity is unreliable, and what it costs to escalate.',
      exercises: MODULE_3_1,
    },
    {
      id: '3.2',
      packageId: '3',
      order: 2,
      title: 'Noise and tuning',
      summary:
        'The rule that fires 288 times a day, the rule that has never once been right, and what to ' +
        'do about each.',
      exercises: MODULE_3_2,
    },
    {
      id: '3.3',
      packageId: '3',
      order: 3,
      title: 'Correlation',
      summary:
        'Turning unremarkable alerts into one actor’s sequence — and resisting timestamps that line ' +
        'up for no reason.',
      exercises: MODULE_3_3,
    },
    {
      id: '3.4',
      packageId: '3',
      order: 4,
      title: 'A full shift',
      summary:
        'Eighty-two alerts, eight of them an intrusion, under an escalation budget. Then write the ' +
        'handover.',
      exercises: MODULE_3_4,
    },
    {
      id: '3.5',
      packageId: '3',
      order: 5,
      title: 'Working with the copilot',
      summary:
        'The same queues again with an AI assistant attached -- one that is right about most alerts, ' +
        'wrong about a handful, and confident throughout.',
      exercises: MODULE_3_5,
    },
  ],
};
