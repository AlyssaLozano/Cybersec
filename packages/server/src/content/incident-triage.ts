/**
 * Incident Detection and Alert Triage -- 21 exercises across 4 modules.
 *
 * WHAT CHANGES HERE
 *
 * Linux Fundamentals and Log Analysis taught a student to find a thing in a log. This package is
 * the first one where the answer is a judgement rather than a fact, and it is
 * graded accordingly: on precision and recall against ground truth, not on
 * whether a string matched.
 *
 * The queue a student works is the SAME 15 August that Log Analysis taught them to
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
import { INCIDENT_TRIAGE_PRACTICE } from './incident-triage-practice.js';

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
        'The alert corpus and Alert Triage have drifted apart.',
    );
  }
  return found[0]!;
}

/**
 * Enrichment values read straight off a named alert in the corpus.
 *
 * Modules 3.6 to 3.8 teach students to read the enrichment block, so the
 * numbers in those exercises have to be the numbers the student is looking at.
 * Throwing on a missing field is deliberate: a regenerated corpus that drops
 * one should stop the server rather than quietly grade against undefined.
 */
function enrichmentOf(queueId: string, ruleId: string): Record<string, unknown> {
  const alert = (queueForStudent(queueId)?.alerts ?? []).find((item) => item.ruleId === ruleId);
  if (!alert?.enrichment) {
    throw new Error(
      `Alert Triage expects an enriched "${ruleId}" alert in queue "${queueId}". The corpus and ` +
        'the package have drifted apart.',
    );
  }
  return alert.enrichment as unknown as Record<string, unknown>;
}

const num = (value: unknown): number => (typeof value === 'number' ? value : 0);

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

// --- Module 3.5's answer key, derived from the copilot\'s flaw table ----------
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
    'Start with what an alert even is. Somewhere behind every security platform sits a piece of ' +
    'software called a RULE: a small, narrow watcher that looks at one stream of activity, such as ' +
    'logins or network connections, for one specific pattern. The instant it sees that pattern, it ' +
    'writes an ALERT: a short record that says, in effect, "I just saw this happen, at this time, ' +
    'involving this account or address." A QUEUE is simply the list of those alerts waiting for a ' +
    'person to look at them, the same way a hospital corridor is a queue of patients waiting to be ' +
    'seen. Nothing in that list has been judged yet: the software only reports, it does not decide.\n\n' +
    'Two labels ride along with every alert the moment it is created. SEVERITY is a word, critical, ' +
    'high, medium, or low, describing how bad the person who WROTE the rule thought this class of ' +
    'event would be, in general, if it turned out to be real. CONFIDENCE is a percentage describing ' +
    'how sure the software is that the pattern it was watching for actually matched, not how sure ' +
    'it is that anything bad happened. Both numbers are set once, in advance, by a rule author who ' +
    'has never seen your network and cannot see this specific alert any better than you can.\n\n' +
    'Severity and confidence are claims made by the rule that fired, not facts about the world. ' +
    'A rule author guessed at them months ago, before this alert existed. An antivirus signature ' +
    'match on a harmless test file is critical with 99% confidence; a successful login by an ' +
    'attacker who just brute-forced their way in is medium with 60%. Reading the queue by ' +
    'severity is the fastest way to miss the intrusion.\n\n' +
    'This matters because a new operator, without being told otherwise, naturally works a queue ' +
    'top to bottom by the biggest, reddest label first. That instinct is exactly backwards here, ' +
    'and learning to distrust the label enough to read the actual alert underneath it is the first ' +
    'skill this whole package is built around.',
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
    'Alerts do not arrive bare. Most detection platforms attach an ENRICHMENT block underneath each ' +
    'one: extra facts the software looked up automatically, the way a caller ID display adds a ' +
    'name and location to a phone number before you decide whether to answer. One of the most ' +
    'useful things in that block is a running count kept for the rule itself, not for this single ' +
    'alert: how many times has this exact rule fired before, anywhere on the network, and of those, ' +
    'how many turned out, once a person looked, to be worth acting on.\n\n' +
    'Two numbers on every alert change the decision more than severity does: how many times this ' +
    'rule has fired before, and how many of those were worth acting on. A rule that has fired ' +
    '8,412 times and been right 14 times is telling you something about itself, not about the ' +
    'traffic. A rule firing for the third time ever deserves your attention even at low severity.\n\n' +
    'The reason this beats severity is that severity is a one-time guess written before the rule ' +
    'ever ran, while the firing history is built from what this exact rule has actually done on ' +
    'this exact network, alert after alert, for as long as it has existed. It updates itself. A ' +
    'rule that is wrong almost every time is telling you, honestly, that most of its future firings ' +
    'will probably also be wrong, which is a far more grounded piece of information than a label ' +
    'somebody typed in a form a year ago.',
  examples: [
    {
      command: 'priorFirings 8412 / priorFalsePositives 8398',
      explains:
        'This rule is wrong 99.8% of the time. That does not make this instance wrong, but it ' +
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
    id: 'triage.1.1',
    moduleId: '3.1',
    packageId: 'incident-triage',
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
        'TRIAGE is a word borrowed from emergency medicine: sorting a group of cases quickly by how ' +
        'urgently each one needs attention, before you have time to fully examine any of them. In a ' +
        'security operations centre, or SOC, the same word describes the job of looking at a list of ' +
        'automated alerts and deciding, one by one, what each one deserves. Triage is deciding, ' +
        'quickly and correctly, which alerts deserve a human. The queue is not sorted by importance ' +
        'and cannot be: the tooling does not know which of its own alerts matter. Your first pass is ' +
        'about disposal: most of these will be closed, and closing them correctly is the job, not a ' +
        'preliminary to it.\n\n' +
        'Every alert you look at gets one of three outcomes, and it helps to know all three before ' +
        'you look at your first one. You can ESCALATE it, meaning you hand it to a second, more ' +
        'senior analyst because it genuinely might be an active attack. You can DISMISS it, meaning ' +
        'you close it because it was correct but harmless, or because nothing about it needs further ' +
        'action. Or you can flag it for TUNING, meaning you close it but also mark the underlying ' +
        'rule as needing to be adjusted, because it is going to keep producing alerts just like this ' +
        'one until somebody changes it. Almost every alert in a real queue ends in one of the last ' +
        'two: escalation is the exception, not the default.',
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
      `Escalate ${INTRO_ESCALATE.join(', ')}: the successful login from an external address that ` +
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
          'ask what each of the others actually proves: a blocked connection proves the firewall ' +
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
      'for a while: closing an alert you are not certain about is uncomfortable, and doing it ' +
      'eighty times a shift is the job. The discomfort is why new operators escalate too much, and ' +
      'why tier-two queues stop being read.\n\n' +
      'The reasoning behind that discomfort is worth naming, because it does not go away on its ' +
      'own. Escalating feels safe because the cost is invisible to you: somebody else spends the ' +
      'time, and if you were wrong, nobody usually tells you. Dismissing correctly feels risky ' +
      'because if you are wrong, it is your name on it. That asymmetry pushes every new operator ' +
      'toward escalating too much, and the fix is not willpower, it is understanding that a queue ' +
      'nobody actually reads because it is flooded with routine escalations protects nobody. A queue ' +
      'kept small and accurate is the thing that actually catches the real intrusion.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.1.1'] ?? [],
  },
  {
    id: 'triage.1.2',
    moduleId: '3.1',
    packageId: 'incident-triage',
    order: 2,
    title: 'Severity is an assertion, not a fact',
    kind: 'alert-triage',
    queueId: INTRO,
    goal: 'Recognise that a rule\'s severity says what the rule author guessed, not what happened.',
    prompt:
      'This queue contains one alert rated CRITICAL with 99% confidence. Find it, read what it ' +
      'actually describes, and give it the disposition it deserves. Write a one-line justification ' +
      'saying why the severity is wrong: mention what the file actually is and that it is a test.',
    teach: SEVERITY_TEACH,
    hints: [
      'Filter to critical severity. There is only one.',
      'Read the detail field. What is the name of the file that matched?',
      'EICAR is a deliberately inert string the antivirus industry publishes so people can prove ' +
        'their scanner works. It contains no payload and cannot execute anything harmful.',
    ],
    solution:
      `Dismiss ${INTRO_EICAR}. It is an EICAR test file: the standard harmless string used to ` +
      'verify that antivirus is functioning: downloaded during security awareness training the ' +
      'previous day. The signature match is correct and the severity is meaningless.',
    expectedOutput: 'The critical alert dismissed, with a justification naming EICAR as a test file.',
    checks: [
      {
        type: 'triage-selection',
        decision: 'dismiss',
        alertIds: [INTRO_EICAR],
        hint:
          'The critical-severity alert should be dismissed. Read its detail field before you decide: ' +
          'the file it matched is named in there.',
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
          'matter (it is inert: it contains no payload).',
      },
    ],
    debrief:
      'The most alarming alert in the queue was the least important one, and it was rated critical ' +
      'with near-perfect confidence. Meanwhile the alert describing an actual compromise was rated ' +
      'medium at 60%. This inversion is not a flaw in the simulation: severity is assigned by ' +
      'whoever wrote the rule, in advance, without knowing anything about the event that would ' +
      'eventually trigger it.\n\n' +
      'It happens because the two ratings are answering completely different questions. "How bad ' +
      'would malware on an endpoint be, in general?" is a question you can answer sitting at a desk ' +
      'writing rules, and the honest answer is: very bad, so mark it critical. "How bad would this ' +
      'specific successful login after a run of failures be?" cannot be answered in general at all, ' +
      'because it depends on facts the rule author never has, like whether the account was disabled ' +
      'or stale, or whether the source address had already been trying and failing all morning. The ' +
      'rule author picks a cautious, unremarkable-sounding rating for that kind of alert because ' +
      'most instances of it really are unremarkable. Your job is to be the one exception that reads ' +
      'the specific case instead of trusting the general guess.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.1.2'] ?? [],
  },
  {
    id: 'triage.1.3',
    moduleId: '3.1',
    packageId: 'incident-triage',
    order: 3,
    title: 'What a rule\'s history tells you',
    kind: 'multiple-choice',
    goal: 'Use prior firing counts to weigh an alert, without treating them as a verdict.',
    prompt:
      'A rule has fired 8,412 times in the last 30 days. 8,398 of those were closed as not worth ' +
      'acting on. It has just fired again. Which of these are sound conclusions? Select all that apply.',
    teach: ENRICHMENT_TEACH,
    options: [
      { id: 'a', label: 'This instance is almost certainly not worth acting on either.' },
      { id: 'b', label: 'The rule is generating far more work than value and should be tuned.' },
      { id: 'c', label: 'This instance still has to be read: history is a prior, not a verdict.' },
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
      'one gets missed. D over-reaches: the rule caught something real 14 times, and deleting it ' +
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
      'brute-force rule in the full night shift has been wrong 44 times out of 61, and the 62nd ' +
      'firing is real. Base rates tell you how much scrutiny to spend, never whether to look.\n\n' +
      'The word for this kind of statistic is a BASE RATE: how often something has been true across ' +
      'many past cases. A base rate is genuinely useful for deciding how much time to spend and how ' +
      'worried to be walking in, the way knowing that most late-night phone calls are wrong numbers ' +
      'lets you answer calmly instead of in a panic. What it cannot do is tell you about the one ' +
      'call actually happening right now. Treating a base rate as a verdict on the specific case in ' +
      'front of you is the single reasoning error this whole package keeps testing for, because it ' +
      'is the one that lets a real intrusion hide inside a rule that is usually noise.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.1.3'] ?? [],
  },
  {
    id: 'triage.1.4',
    moduleId: '3.1',
    packageId: 'incident-triage',
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
        'When you close an alert, you are not just filing it away, you are also writing down a ' +
        'judgement about the RULE that raised it, and that judgement gets counted. Two very ' +
        'different judgements sound alike unless you separate them on purpose. A POSITIVE, in this ' +
        'context, simply means the rule fired: it saw a match and produced an alert. A TRUE positive ' +
        'means the event it described genuinely happened. A FALSE positive means it did not, the ' +
        'rule was wrong about the world.\n\n' +
        'Both of these get closed, so it is tempting to call them both false positives. They are ' +
        'not. The overnight login genuinely happened and the rule described it accurately: it is a ' +
        'benign true positive, and the rule is working. The SQL injection alert describes something ' +
        'that did not occur: the rule is broken. Conflating them is how a SOC ends up deleting ' +
        'rules that work, because "false positive rate" gets measured and someone acts on it.\n\n' +
        'A BENIGN true positive is the specific case where the rule was completely right and the ' +
        'thing it found simply does not matter: it happened, it was authorised, and there is nothing ' +
        'to fix. That third category is what most new operators are missing, because "closed" feels ' +
        'like it should mean one thing, and here it can mean two very different verdicts about the ' +
        'health of the detection itself.',
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
          ['tune', 'fix the rule', 'rewrite', 'exclusion', 'detection logic', 'word boundary', 'word-boundary'],
        ],
        hint:
          'Name both categories, say which is which, and say what each one implies you should do ' +
          'about the rule.',
      },
    ],
    debrief:
      'Most SOC metrics dashboards get this wrong, and it has consequences: a team that reports a ' +
      '96% false positive rate will be told to disable rules, and the rules disabled will be the ' +
      'ones firing correctly on activity nobody bothered to allowlist.\n\n' +
      'Follow the chain to see why the mislabelling is dangerous rather than just untidy. Somebody, ' +
      'usually a manager who never reads individual alerts, watches a dashboard that adds up how ' +
      'many closures were marked "false positive" per rule. If benign true positives get folded ' +
      'into that count because the distinction was never made, a perfectly working rule looks like a ' +
      'broken one on the dashboard, and the next reasonable-sounding decision is to switch it off to ' +
      'save everyone the trouble. Getting this one word right at the moment you close the alert is ' +
      'the only thing standing between a working detection and it quietly disappearing.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.1.4'] ?? [],
  },
  {
    id: 'triage.1.5',
    moduleId: '3.1',
    packageId: 'incident-triage',
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
        'A real SOC is usually organised in tiers: tier one is the first set of eyes on the queue, ' +
        'often newer analysts working through a high volume of alerts quickly, and tier two is a ' +
        'smaller, more experienced group who take the harder cases tier one escalates to them. That ' +
        'structure only works if the handoff between the tiers stays small. Escalation is not free. ' +
        'Every alert you send up consumes an analyst who is not then reading the queue behind you, ' +
        'and a tier-two queue that receives forty escalations a shift is functionally the same as no ' +
        'escalation process at all. Capping escalations is artificial here and entirely real in ' +
        'practice: the cap is just usually implicit, and discovered the hard way.\n\n' +
        'Think of it like a hospital again: if the triage nurse sent every patient straight to the ' +
        'trauma surgeon, the surgeon would drown and the genuinely critical cases would wait behind ' +
        'sprained ankles. A cap forces the same discipline here, and it teaches you to ask the ' +
        'question that matters before you send anything up: what would the next person actually DO ' +
        'with this that I have not already done myself?',
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
      'here: even with two slots available, only one alert in this queue has a next step that ' +
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
      'question (what would the next person actually do with this) is the most useful one in ' +
      'triage, and a cap is just a way of making you ask it every time.\n\n' +
      'Without a hard limit, it is easy to escalate anything you feel even slightly unsure about, ' +
      'because escalating never feels like the wrong choice in the moment: it feels like caution. ' +
      'The budget removes that comfortable option and forces you to actually decide, which is ' +
      'uncomfortable at first and is, in fact, the entire skill this exercise is teaching.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.1.5'] ?? [],
  },
];

// --- module 3.2: noise and tuning --------------------------------------------

const MODULE_3_2: Exercise[] = [
  {
    id: 'triage.2.1',
    moduleId: '3.2',
    packageId: 'incident-triage',
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
        'A NOISY rule is one that fires far more often than it needs to, drowning out everything ' +
        'else in the queue around it, the way a single car alarm that never actually means a theft ' +
        'trains an entire street to ignore it. A rule can be completely correct and completely ' +
        'unusable. The monitoring collector on this network has a stale password in its config and ' +
        'fails SSH authentication every five minutes, all day, forever: 288 times a day. Each alert ' +
        'is accurate. Dismissing them one at a time is not triage, it is data entry, and it is how ' +
        'operators stop reading the queue.\n\n' +
        'This matters because attention is a limited resource, not an infinite one. Every minute ' +
        'spent clicking dismiss on the 200th identical alert of the day is a minute not spent reading ' +
        'the one alert in the queue that is actually different, and after enough repetitions, the eye ' +
        'stops distinguishing them at all. Recognising that a whole rule, not just this one alert, ' +
        'is the problem is what lets you deal with 288 near-identical alerts in one decision instead ' +
        'of 288 separate ones.',
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
      'The alerts are correct: the authentication really is failing. That makes "dismiss" true but ' +
        'useless, and "false positive" simply wrong.',
    ],
    solution:
      `Flag all ${NOISY_MONITORING.length} alerts from the failed-authentication rule for tuning. ` +
      'They come from rmg-mon-01, the internal monitoring collector, which has a stale credential. ' +
      'The rule needs an exclusion for that host and the underlying password needs fixing.',
    expectedOutput: 'The monitoring rule\'s alerts flagged for tuning rather than dismissed one by one.',
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
      'attacker produced all day. That is not a contrived ratio: it is the normal state of an ' +
      'untuned SOC, and it is why "we had an alert for that" appears in so many breach reports.\n\n' +
      'When investigators later ask why nobody caught an intrusion that, in hindsight, was sitting ' +
      'right there in the logs, the honest answer in a lot of real breaches is that the alert was ' +
      'buried under thousands of correct-but-worthless ones, and by the time anyone reached it the ' +
      'damage was done. Tuning the noisy rule away is not paperwork, it is the single change most ' +
      'likely to make the next real alert visible.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.2.1'] ?? [],
  },
  {
    id: 'triage.2.2',
    moduleId: '3.2',
    packageId: 'incident-triage',
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
        'ALERT FATIGUE is the name for what happens to a person, not a machine, after they have ' +
        'read enough near-identical alerts: attention quietly degrades, and everything starts ' +
        'looking like everything else, the same way a sound you hear constantly eventually stops ' +
        'registering at all. This is what alert fatigue actually costs. The noisy rule is not ' +
        'dangerous because it is annoying: it is dangerous because it trains you to skim, and the ' +
        'real alert looks superficially similar to the noise. Both are about failed authentication. ' +
        'One is a monitoring box with a bad password; the other is four external addresses working a ' +
        'shared account list.\n\n' +
        'The two alerts share a rule name and a rough shape, which is exactly why fatigue is ' +
        'dangerous here: it is not that the real alert is hidden behind unrelated noise, it is that ' +
        'it is disguised as MORE of the same noise. Catching it means deliberately fighting the skim ' +
        'reflex and reading each one for what actually happened, not just which rule fired.',
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
      `Escalate ${NOISY_ESCALATE.join(', ')}: the coordinated brute force from ${''}` +
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
      'near-identical ones, which is exactly when people stop reading.\n\n' +
      'Order matters more than most new operators expect. If you read the queue in the order it ' +
      'arrived, the thirty-sixth monitoring alert and the one brute-force alert sitting among them ' +
      'get exactly the same amount of tired attention. Clearing the known-noisy group first is not ' +
      'just tidier, it changes what your remaining attention is spent on.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.2.2'] ?? [],
  },
  {
    id: 'triage.2.3',
    moduleId: '3.2',
    packageId: 'incident-triage',
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
        'TUNING means changing the rule itself, not just closing the alerts it produces, so that it ' +
        'stops firing on a specific, known-harmless situation while continuing to fire on everything ' +
        'else. Tuning is where operators do lasting damage. "Suppress failed-authentication alerts" ' +
        'would silence the noise and also blind you to every brute force forever. A good tuning ' +
        'change is the narrowest exclusion that removes the known-benign case and leaves everything ' +
        'else intact, and it is always paired with fixing the underlying cause, or the exclusion ' +
        'becomes permanent.\n\n' +
        'Think of it like disabling a single smoke alarm because it keeps going off from steam near ' +
        'the shower, versus ripping out the wiring for every smoke alarm in the house because one of ' +
        'them is annoying. The first is a narrow, deliberate fix; the second removes protection you ' +
        'still needed. The width of the exclusion, how narrowly it is aimed at the exact benign ' +
        'case and nothing more, is what separates a safe tuning change from a dangerous one.',
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
      'Exclude the specific combination: source address 10.20.9.40 (rmg-mon-01) authenticating as ' +
      'the nagios account, rather than suppressing the rule or the host outright. That keeps the ' +
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
          'password itself: an exclusion alone leaves a broken credential in place forever.',
      },
    ],
    debrief:
      'The pairing matters more than the exclusion. Exclusions that are not paired with a fix ' +
      'accumulate, nobody remembers why they exist, and three years later a genuine attack from a ' +
      'decommissioned monitoring range is invisible. Give every exclusion an owner and an expiry.\n\n' +
      'An exclusion with no expiry is a promise nobody is keeping. It gets added under time pressure ' +
      'by whoever was on shift, and unless it is written down with a reason and a date, it simply ' +
      'sits there indefinitely, quietly widening the blind spot in the rule long after the reason for ' +
      'it stopped being true. Attaching an owner and an expiry is what turns a one-off fix into ' +
      'something the SOC can actually be trusted to review.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.2.3'] ?? [],
  },
  {
    id: 'triage.2.4',
    moduleId: '3.2',
    packageId: 'incident-triage',
    order: 4,
    title: 'Justify a tuning decision',
    kind: 'alert-triage',
    queueId: NOISY,
    goal: 'Record a reason another analyst can act on without re-doing your work.',
    prompt:
      'Flag the monitoring rule\'s alerts for tuning, and on any one of them write a justification ' +
      'that names the source host, the account, and what actually needs fixing. Somebody reading ' +
      'only your note should be able to act without opening the alert.',
    teach: {
      concept:
        'Every time you close or tune an alert on this platform, you can attach a short piece of ' +
        'text called a JUSTIFICATION or disposition note, explaining in your own words why you made ' +
        'the decision you made. The note you leave is the entire durable output of triage. An alert ' +
        'closed with no reason is indistinguishable from an alert nobody read, and in a breach ' +
        'review that distinction matters enormously. A good disposition note answers: what was it, ' +
        'why is it not an incident, and what should happen next.\n\n' +
        'The click that closes an alert vanishes the moment you make it: nothing about it is visible ' +
        'to anyone else unless you write it down. Six months from now, when somebody is trying to ' +
        'reconstruct what actually happened during a security incident, the click tells them nothing ' +
        'and the note tells them everything. Writing one well is not extra work bolted onto triage, ' +
        'it is the part of triage that actually survives past the moment you did it.',
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
      '"rmg-mon-01 (10.20.9.40) failing SSH auth as nagios every 5 minutes: stale credential in ' +
      'the monitoring config, not an attack. Requesting an exclusion scoped to this source and ' +
      'account, plus a ticket to correct the password."',
    expectedOutput: 'Tuning flags applied, with at least one justification naming host, account, and remedy.',
    checks: [
      {
        type: 'triage-accuracy',
        decision: 'tune',
        minRecall: 0.9,
        hint: 'Flag the monitoring rule\'s alerts for tuning before writing the justification.',
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
      'analysis is the same; the difference is whether it survives you closing the tab.\n\n' +
      'Managers and reviewers cannot see the thinking you did in your head, only what you wrote ' +
      'down, so an operator who reasons carefully but writes "closed, noise" looks, on paper, exactly ' +
      'like one who did not think about it at all. The note is the only evidence anyone else will ever ' +
      'have of the judgement you actually exercised.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.2.4'] ?? [],
  },
  {
    id: 'triage.2.5',
    moduleId: '3.2',
    packageId: 'incident-triage',
    order: 5,
    title: 'A rule that is simply wrong',
    kind: 'alert-triage',
    queueId: NIGHT,
    goal: 'Separate a defective detection from a correct one firing on dull activity.',
    prompt:
      'Somewhere in the night shift queue is an alert claiming SQL injection against the patient ' +
      'portal. Find it, read the request it matched, and give it the right disposition. This is a ' +
      'different kind of problem from the monitoring noise: decide which.',
    teach: {
      concept:
        'A web request carries a web address, and often a PARAMETER, a piece of extra data tacked ' +
        'onto that address, such as ?patient=selected_labs, telling the server which page or record ' +
        'to load. A SQL INJECTION attack tries to smuggle database commands inside a parameter value ' +
        'so the server accidentally runs them, which is a genuinely serious attack. A rule built to ' +
        'catch it here was written carelessly: it flags any request containing the letters s-e-l-e-c-' +
        't anywhere at all, with no regard for whether those letters form the SQL command SELECT or ' +
        'are simply part of an ordinary word.\n\n' +
        'The monitoring alerts are correct detections of real events. This one is not: the rule ' +
        'matched the letters "select" inside the ordinary parameter value "selected_labs". No ' +
        'injection was attempted. That is a defective rule, and the remedy is different: an ' +
        'exclusion would paper over logic that will misfire on the next parameter containing a SQL ' +
        'keyword, and there are many.\n\n' +
        'This is a different flavour of problem from the noisy-but-correct monitoring rule you just ' +
        'handled. That rule was telling the truth every single time; this one is not telling the ' +
        'truth at all, it is pattern-matching on the wrong thing. Recognising which kind of problem ' +
        'you are looking at determines the fix: excluding a known-benign source works for a correct ' +
        'rule firing too often, but a rule that is simply wrong needs its logic rewritten, not an ' +
        'exception carved out of it.',
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
      'value "selected_labs" in a legitimate request. It is a false positive: the event it ' +
      'describes never happened, and the detection logic needs word-boundary and syntax awareness, ' +
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
      'compromise considerably later.\n\n' +
      'This is the exact inversion from the very first exercise in this package, showing up again in ' +
      'a new shape: a loud, high-severity alert that is completely empty of substance, sitting in the ' +
      'same queue as a quiet, medium-severity alert that is the whole story. The lesson is not "SQL ' +
      'injection alerts are usually fake," it is that severity keeps failing to track what actually ' +
      'happened, and reading the underlying request is the only thing that reliably does.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.2.5'] ?? [],
  },
];

// --- module 3.3: correlation -------------------------------------------------

const MODULE_3_3: Exercise[] = [
  {
    id: 'triage.3.1',
    moduleId: '3.3',
    packageId: 'incident-triage',
    order: 1,
    title: 'Three alerts, one actor',
    kind: 'alert-triage',
    queueId: WINDOW,
    goal: 'Escalate a set of individually unremarkable alerts that are damning together.',
    prompt:
      `Every alert raised between 10:10 and 10:35: ${WINDOW_SIZE} of them. Several are ` +
      'individually the kind of thing you would close without much thought. Find the ones that ' +
      'belong to the same actor and escalate exactly those.',
    teach: {
      concept:
        'CORRELATION means looking at several separate alerts together and noticing that they share ' +
        'something, an account, a source address, a tight window of time, that turns them into one ' +
        'connected story rather than several unrelated events. Single events are almost never ' +
        'conclusive. A successful login is normal. Creating an account is normal. Adding an account ' +
        'to a privileged group is normal. The same user doing all three within seventeen minutes, ' +
        'from an external address, is not normal at all. Correlation is what turns three shrugs into ' +
        'an incident.\n\n' +
        'It works the way a detective reads a set of small, individually unremarkable clues, one ' +
        'muddy footprint, a lock left unlocked, a light on that is normally off, and realises that ' +
        'together they only make sense as one sequence of events. No single alert here would earn an ' +
        'escalation on its own. What earns it is asking a question none of the individual alerts can ' +
        'answer by itself: did the same actor do more than one of these things, close together?',
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
      'You have just done the thing correlation rules exist to automate, and you did it better, ' +
      'because you could see that "account created" and "account added to sudo" involved an account ' +
      'that did not exist an hour ago. Most correlation rules cannot express that.\n\n' +
      'Automated correlation is usually built from fixed patterns somebody thought of in advance, ' +
      '"alert A followed by alert B within N minutes." A human reading the same alerts can notice a ' +
      'connection nobody wrote a rule for, like a brand-new account being the one that gets escalated ' +
      'privileges, which is exactly the kind of reasoning that is hardest to encode as a rule and ' +
      'easiest for an attentive person to spot.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.3.1'] ?? [],
  },
  {
    id: 'triage.3.2',
    moduleId: '3.3',
    packageId: 'incident-triage',
    order: 2,
    title: 'The alert that changes everything',
    kind: 'alert-triage',
    queueId: WINDOW,
    goal: 'Identify the moment an attempt became an intrusion, and say why it is the pivot.',
    prompt:
      'One alert in this window is the hinge: before it, an attacker was outside; after it, they ' +
      'were inside with valid credentials. Escalate it and justify it: your note must say that the ' +
      'authentication succeeded and that it followed earlier failures from the same source.',
    teach: {
      concept:
        'A BRUTE FORCE is an attack where somebody, or more often a piece of automated software, ' +
        'simply tries password after password against an account until one happens to work, the way ' +
        'trying every key on a ring against a locked door eventually finds the right one. Every ' +
        'intrusion has a moment where the story changes, and everything after it is different in ' +
        'kind. A brute force that fails ten thousand times is noise. The same brute force succeeding ' +
        'once is an incident, and every subsequent action by that account, however ordinary it ' +
        'looks, has to be re-read as possible attacker activity.\n\n' +
        'This is called the PIVOT: the specific moment where an attempt turns into actual access. ' +
        'Before it, the attacker is locked outside and everything they do is contained to failed ' +
        'attempts. After it, they are logged in as a real, valid account, and anything that account ' +
        'does from then on, however mundane it looks on its own, is worth re-examining, because you ' +
        'can no longer assume it was done by the person who is supposed to hold that account.',
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
      'negligent, because it was rated medium, on a rule with a mediocre history, in a queue ' +
      'containing 288 daily alerts from a monitoring box with a bad password.\n\n' +
      'Every individual factor working against this alert was reasonable on its own: medium severity ' +
      'is not unreasonable for a login rule, a mediocre history is not unreasonable for a rule that ' +
      'is often triggered by legitimate retries, and a busy queue is simply what an unturned SOC ' +
      'looks like. Stacked together, those reasonable factors buried the single most important alert ' +
      'in the entire dataset, which is exactly why pivots need to be actively hunted for rather than ' +
      'trusted to surface on their own.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.3.2'] ?? [],
  },
  {
    id: 'triage.3.3',
    moduleId: '3.3',
    packageId: 'incident-triage',
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
        'Correlation, the useful kind you practised in the previous exercise, is about showing that ' +
        'a real MECHANISM connects two events, not just that they happened close together in time. ' +
        'Correlation by timestamp is the most seductive and least reliable technique in triage. On ' +
        'a busy host, dozens of unrelated things happen every minute, and if you go looking for ' +
        'events that share a timestamp with something you already believe, you will always find ' +
        'them. A shared clock is not a shared cause.\n\n' +
        'This is the same trap as a familiar saying outside security: correlation is not causation, ' +
        'just because two things happened at the same time does not mean one caused the other. Ice ' +
        'cream sales and drowning deaths both rise in summer, but nobody thinks selling ice cream ' +
        'causes drowning; hot weather causes both, independently. A busy server produces dozens of ' +
        'events every minute, and two of them lining up on a clock is nowhere near enough evidence to ' +
        'claim they are the same story.',
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
      'undersized: a capacity defect that happened to surface in the same minute. C is wrong ' +
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
      'the real capacity bug stays unfixed.\n\n' +
      'Once an incorrect cause gets written down and repeated, it is extremely hard to walk back: ' +
      'people start investigating around the assumption instead of testing it. Recording an honest ' +
      '"these happened at the same time and I do not yet know why" costs nothing and keeps the door ' +
      'open. Recording a confident but unsupported cause sends real effort down a path that leads ' +
      'nowhere, while the actual problem sits untouched.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.3.3'] ?? [],
  },
  {
    id: 'triage.3.4',
    moduleId: '3.3',
    packageId: 'incident-triage',
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
        'A NARRATIVE, in triage, is simply putting what happened into plain, ordered sentences: this ' +
        'happened, then this, and because of that, this followed. An escalation is only as useful as ' +
        'the story attached to it. "Three suspicious alerts, please review" makes tier two start ' +
        'from nothing. A short ordered narrative: this, then this, therefore that: lets them begin ' +
        'at containment instead of at reconstruction. Stay inside the evidence: what you cannot ' +
        'support belongs in a separate sentence marked as inference.\n\n' +
        'Think about the difference between handing someone a stack of unsorted photographs and ' +
        'handing them a short paragraph explaining what the photographs show, in order. The raw ' +
        'material is the same either way, but only one version lets the reader act immediately ' +
        'instead of having to do your reconstruction work over again themselves, under time ' +
        'pressure, during an active incident.',
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
          'Name both accounts, say that the new one gained privilege, and make the order explicit: ' +
          'either with timestamps or with sequencing words.',
      },
    ],
    debrief:
      'What you just wrote is the top of an incident report. In most SOCs the operator\'s escalation ' +
      'note becomes the first paragraph of the eventual write-up almost verbatim, which is a good ' +
      'reason to write it as though it will be read by someone senior. It usually is.\n\n' +
      'Very few people rewrite an escalation note from scratch once the incident is underway: there ' +
      'is rarely time. The version written in the first few minutes, by whoever noticed it first, is ' +
      'usually the version that survives into the final report, which means the habits you are ' +
      'practising in this exercise are the ones that end up in front of executives and, sometimes, ' +
      'regulators.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.3.4'] ?? [],
  },
  {
    id: 'triage.3.5',
    moduleId: '3.3',
    packageId: 'incident-triage',
    order: 5,
    title: 'What you cannot yet say',
    kind: 'short-answer',
    goal: 'Draw the line between what the alerts prove and what they merely suggest.',
    prompt:
      'From this window alone, what do you NOT know? Name at least two things a decision-maker ' +
      'would ask that these alerts cannot answer, and say what evidence would settle them.',
    teach: {
      concept:
        'SCOPE, in an investigation, means how far an intrusion actually reaches: which hosts, which ' +
        'accounts, which data. It is one of the most important things a decision-maker needs to know ' +
        'and one of the easiest things to get quietly wrong, because a set of alerts telling a story ' +
        'about one host can feel like it tells you about the whole network even when it says nothing ' +
        'of the sort. The most valuable sentence in an escalation is often the one about ' +
        'uncertainty. An operator who says "the attacker has root on this host and I cannot yet tell ' +
        'whether they reached others" gets the right response. One who omits the second half gets a ' +
        'containment decision made on a false assumption of scope. Being precise about the edge of ' +
        'your knowledge is a skill, and it is rarer than technical ability.\n\n' +
        'It helps to think of what you know as sitting inside a circle, and everything outside that ' +
        'circle as unknown, not "probably fine." Naming the edge of the circle out loud, saying ' +
        'exactly where your evidence stops, is what stops a decision-maker from silently assuming the ' +
        'circle is bigger than it actually is.',
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
      'The alerts do not establish scope: nothing here shows whether the attacker used sysmon to ' +
      'reach other hosts, which would need authentication logs from the rest of the estate. They ' +
      'do not establish data impact, no alert in this window shows a file being read, copied, or ' +
      'sent anywhere, which would need file and egress telemetry. And they do not establish the ' +
      'true start of the intrusion, only when detection noticed: the brute force is visible from ' +
      '09:12, but whether this source had prior access needs a longer log retention window.',
    expectedOutput:
      'At least two named unknowns (scope, data impact, or dwell time) each with the evidence ' +
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
          'Name at least two distinct unknowns: whether other systems are affected, and whether ' +
          'any data was touched, and for each say what evidence would answer it.',
      },
    ],
    debrief:
      'You were right to say nothing about data impact: in this window there is no evidence of it. ' +
      'The staging of patient records happens at 11:06, thirty-one minutes after the last alert you ' +
      'saw here. An operator who assumed "no data alerts, so no data impact" would have been ' +
      'confidently wrong within the hour.\n\n' +
      'Notice the shape of that mistake: it is not that the operator saw evidence of safety, it is ' +
      'that they mistook the absence of evidence for evidence of absence. Nothing in this window said ' +
      'data was safe; the window simply had not reached the part of the timeline where data was ' +
      'touched yet. "I have not seen it happen" and "it did not happen" are different claims, and ' +
      'collapsing them into one is how confident, wrong assumptions about scope get made.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.3.5'] ?? [],
  },
];

// --- module 3.4: a full shift ------------------------------------------------

const MODULE_3_4: Exercise[] = [
  {
    id: 'triage.4.1',
    moduleId: '3.4',
    packageId: 'incident-triage',
    order: 1,
    title: 'Clear the night shift',
    kind: 'alert-triage',
    queueId: NIGHT,
    goal: 'Find every alert belonging to the intrusion in a full shift\'s queue.',
    prompt:
      `${NIGHT_SIZE} alerts, midnight to noon. An intrusion runs through them that reached patient ` +
      'data. Find every alert that belongs to it and escalate them. Dispose of everything else.',
    teach: {
      concept:
        'A SHIFT is a working period, typically eight or twelve hours, during which one operator is ' +
        'responsible for the queue. Everything so far has been a slice, a deliberately narrowed ' +
        'window handed to you to practise one skill at a time. This is the whole shift, and the ' +
        'intrusion is spread across eight alerts, five rules, and three hours: mixed into a queue ' +
        'where one rule fires every five minutes and the loudest alert is a harmless test file. Work ' +
        'it in passes: dispose of the known-noisy rule as a group, then read what remains properly.\n\n' +
        'Every technique from the exercises before this one, reading past severity, disposing of ' +
        'noisy rules as a group, correlating alerts that share an actor, applies here at once, on a ' +
        'much bigger and much noisier queue, exactly the way a real shift actually feels. Working in ' +
        'deliberate passes rather than reading top to bottom is what keeps that combination ' +
        'manageable instead of overwhelming.',
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
          'cron change (rated low) and the outbound connection (rated medium): persistence and ' +
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
      'detection stack did its job; the queue is what failed.\n\n' +
      'That distinction is worth sitting with, because it is a common one in real breach post-' +
      'mortems: the tools did exactly what they were built to do, alert on the right thing at the ' +
      'right time. The failure was downstream of the tools, in whether a human reading the queue was ' +
      'ever going to reach those eight alerts before the intrusion did its damage. This package puts ' +
      'you in the seat where that failure either happens again or does not.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.4.1'] ?? [],
  },
  {
    id: 'triage.4.2',
    moduleId: '3.4',
    packageId: 'incident-triage',
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
        'Two words describe the two ways a triage decision can be graded, and they come up ' +
        'constantly in this field. RECALL asks: of everything that genuinely belonged to the ' +
        'intrusion, how much of it did you find? PRECISION asks: of everything you flagged as the ' +
        'intrusion, how much of it actually was? This is the actual job. Recall alone is easy: ' +
        'escalate everything. Precision alone is easy: escalate nothing. Doing both is what ' +
        'separates an operator from a forwarding rule, and it is why the two are reported separately ' +
        'here rather than averaged into one score that would hide which one you failed.\n\n' +
        'Picture a fisherman who catches every fish in the lake by draining it entirely: perfect ' +
        'recall, since nothing escaped, but almost none of what is in the net was worth keeping. ' +
        'Compare that to one who throws back everything and keeps nothing: perfect precision, ' +
        'trivially, and also useless. The actual skill is catching the fish that were worth catching ' +
        'and only those, which is exactly what an escalation budget forces you to practise.',
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
        'denial do not: they are somebody else\'s queue.',
    ],
    solution:
      `Escalate exactly the ${NIGHT_ESCALATE.length} intrusion alerts and nothing else. The ` +
      'benign true positives (the backup service account, the overnight DBA, the administrator ' +
      'patching, the mistyped password) are dismissed. The monitoring noise and the two defective ' +
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
      'half the queue. No real SOC scores triage that way either.\n\n' +
      'A single averaged number is easy to game without meaning to: escalate generously and your ' +
      'recall covers for your poor precision, or dismiss generously and the reverse happens. Grading ' +
      'the two separately, and requiring both to clear a bar, is what stops either failure from ' +
      'hiding behind the other, which is exactly why performance reviews in real SOCs tend to track ' +
      'them the same way.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.4.2'] ?? [],
  },
  {
    id: 'triage.4.3',
    moduleId: '3.4',
    packageId: 'incident-triage',
    order: 3,
    title: 'The quietest alert that mattered',
    kind: 'alert-triage',
    queueId: NIGHT,
    goal: 'Escalate a low-severity alert on its content, and justify overriding the rating.',
    prompt:
      'One alert in this queue is rated LOW and describes the mechanism that would have kept the ' +
      'attacker on this host through a reboot and a password reset. Escalate it, and justify why ' +
      'the severity is wrong: say what the scheduled task actually does and why it matters.',
    teach: {
      concept:
        'PERSISTENCE is any technique an attacker uses to keep their access even after the door they ' +
        'originally walked through gets shut, the way a burglar who cuts a spare key before leaving ' +
        'can still get back in after you change the front lock. CRON is a built-in Linux feature that ' +
        'runs a command automatically on a repeating schedule, such as every fifteen minutes, and it ' +
        'is a common, completely legitimate way for administrators to automate routine tasks, which ' +
        'is exactly what makes it useful cover for an attacker too. Persistence is what makes an ' +
        'intrusion expensive. Without it, containment is a password reset; with it, the attacker ' +
        'returns after you have declared the incident closed. Cron changes are rated low because ' +
        'they are usually configuration management: 331 of the last 340 firings were. This one ' +
        'downloads a remote script every fifteen minutes and pipes it into a shell, under an account ' +
        'created twenty minutes earlier.\n\n' +
        'The mechanism matters because it changes what "fixing" the problem actually requires. ' +
        'Resetting the password on the account the attacker first logged in with feels like closing ' +
        'the incident, but if a scheduled task somewhere else on the system is still quietly fetching ' +
        'and running the attacker\'s instructions every fifteen minutes, the door was never actually ' +
        'shut. Finding every mechanism like this one is what separates a real containment from one ' +
        'that only looks finished.',
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
      'Ask what happens to this alert\'s subject if you reset the compromised account\'s password. ' +
        'Nothing, that is why it matters.',
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
          'that matters (it survives containment: the attacker gets back in).',
      },
    ],
    debrief:
      'Missed persistence is the most common reason incidents reopen. Ridgeline would have reset ' +
      'the testuser password, congratulated themselves, and been re-compromised within fifteen ' +
      'minutes by a cron job nobody looked for, because the alert about it was rated low.\n\n' +
      'This is the same pattern from earlier in the package, a low-severity label masking the alert ' +
      'that mattered most, and it keeps appearing on purpose. Severity is set by what a rule author ' +
      'guessed a category of change usually means, and "somebody edited a cron job" usually does mean ' +
      'nothing. Reading past that guess, every single time, is what finds the fifteen percent of ' +
      'cases where it does not.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.4.3'] ?? [],
  },
  {
    id: 'triage.4.4',
    moduleId: '3.4',
    packageId: 'incident-triage',
    order: 4,
    title: 'Leave the queue better than you found it',
    kind: 'alert-triage',
    queueId: NIGHT,
    goal: 'Flag every rule that needs work, without flagging rules that are simply doing their job.',
    prompt:
      'Work the full queue once more and concentrate on tuning. Flag every alert whose rule needs ' +
      'changing: whether because it fires on known-benign activity or because its logic is broken. ' +
      'Do not flag rules that are working correctly on activity that merely happens to be dull.',
    teach: {
      concept:
        'COMPOUNDING means an effect that keeps paying off, or keeps costing you, on every future ' +
        'day, rather than a one-off that happens once and is done. Tuning is the only part of triage ' +
        'that compounds. Every other decision you make tonight evaporates; a tuning flag reduces ' +
        'tomorrow\'s queue permanently. The discipline is not flagging everything you closed: the ' +
        'backup service account alert has fired 730 times and been correct 730 times, and it should ' +
        'keep firing, because the day it fires at an unusual hour you want to see it.\n\n' +
        'A dismissal only ever affects the one alert you clicked on; tomorrow the queue is exactly ' +
        'as noisy as it was before you started. A tuning flag, once acted on, changes the rule ' +
        'itself, which means it changes every single future firing of that rule, for as long as the ' +
        'exclusion lasts. That is why the discipline here is not "flag anything that annoyed me": a ' +
        'rule that has fired 730 times and been right every single one of those times is not noise, ' +
        'it is a rule waiting for the one time it will not be, and tuning it away would remove that ' +
        'protection along with the annoyance.',
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
      'that cannot be delegated. Leave the backup, sudo, and out-of-hours rules alone: they are ' +
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
          'have flagged a rule that is doing its job correctly: check the backup and sudo alerts.',
      },
    ],
    debrief:
      'If Ridgeline had acted on the monitoring exclusion alone, the night-shift queue would have ' +
      'been forty alerts instead of eighty-two, and the eight that mattered would have been a ' +
      'fifth of it rather than a tenth. Tuning is not housekeeping: it is the highest-leverage ' +
      'thing an operator does.\n\n' +
      'LEVERAGE here means getting an outsized result from a small, well-placed action. Reading and ' +
      'closing one more alert helps only that one alert. Flagging the one rule responsible for half ' +
      'the queue\'s volume helps every operator on every future shift, which is why an experienced ' +
      'analyst spends real effort chasing tuning opportunities instead of just working through the ' +
      'pile in front of them.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.4.4'] ?? [],
  },
  {
    id: 'triage.4.5',
    moduleId: '3.4',
    packageId: 'incident-triage',
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
        'A HANDOVER is the short briefing one shift gives to the next, so that the incoming operator ' +
        'does not have to start from zero, the way one nurse briefs the next at a shift change so the ' +
        'patients are not left to explain their own charts. Handover is where incidents get dropped. ' +
        'The outgoing operator knows the shape of the night; the incoming one sees a queue with some ' +
        'things already closed and no idea why. A good handover is three things: what is live, what ' +
        'you are unsure about, and what is outstanding. The uncertainty section is the one people ' +
        'omit and the one that matters most.\n\n' +
        'Everything you decided during the shift lived in your head while you were making it: which ' +
        'alerts you connected, which ones you are not fully confident about, which loose ends you ' +
        'ran out of time to chase. None of that is visible in the queue itself, where an alert simply ' +
        'looks closed whether it was closed after careful thought or in the last five minutes before ' +
        'you clocked off. The handover is the only place that reasoning gets transferred to the next ' +
        'person at all.',
      examples: [
        {
          command: 'Quiet night, nothing major.',
          explains: 'The most dangerous sentence in SOC operations.',
        },
        {
          command: 'INC-2026-0815 escalated: compromise on rmg-web-02, persistence not yet removed.',
          explains: 'The incoming analyst knows in one line what they are walking into.',
        },
      ],
    },
    hints: [
      'Lead with the live incident and the host it is on.',
      'Say explicitly what you do NOT know: scope beyond this host is the obvious one.',
      'End with the outstanding actions: the tuning requests you raised and who owns them.',
    ],
    solution:
      'Escalated INC-2026-0815: rmg-web-02 compromised at 10:14 via the stale testuser account from ' +
      'an external address, with a backdoor account (sysmon) created, granted sudo, and used to ' +
      'stage an archive of patient exports at 11:06. Persistence via a cron job beaconing every ' +
      'fifteen minutes is still in place: containment is not complete. I have not established ' +
      'whether the attacker reached any other host; that needs authentication logs from the rest of ' +
      'the estate. Raised tuning requests for the monitoring collector\'s failed-auth noise and for ' +
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
      'completed work are how a live intrusion goes quiet for a shift: the incoming analyst sees ' +
      'closed alerts and assumes resolution.\n\n' +
      'A closed alert and a solved problem look identical from the outside unless somebody says ' +
      'otherwise, so if the note only lists what went well, the reader has every reason to assume ' +
      'nothing is left to do. Naming the unfinished work out loud, even when it feels like admitting ' +
      'you did not get everything done, is what keeps an active intrusion from going quiet simply ' +
      'because the shift ended.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.4.5'] ?? [],
  },
  {
    id: 'triage.4.6',
    moduleId: '3.4',
    packageId: 'incident-triage',
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
        'A PROCEDURE, here, is simply a fixed sequence of steps written down in advance, so that in ' +
        'the moment you do not have to invent a plan from scratch, you just follow the one you ' +
        'already trust. Judgement degrades badly at 02:00, and the answer is not to try harder: it is ' +
        'to decide in advance. A procedure written while rested is worth more than analysis performed ' +
        'while exhausted. The good ones start by establishing whether the thing is real at all, ' +
        'because the most common 02:00 outcome is a rule misfiring on a batch job.\n\n' +
        'This is the same idea behind an emergency evacuation plan practised while calm rather than ' +
        'invented mid-fire: thinking clearly is much easier before adrenaline and exhaustion are ' +
        'involved than during them. Writing the checklist now, while you can reason carefully about ' +
        'each step, means that at 02:00 you only have to remember the first step, and the checklist ' +
        'carries you the rest of the way.',
      examples: [
        {
          command: 'Step 1: Is it real?',
          explains:
            'Before scope, before comms. Check the rule\'s history and whether the activity is ' +
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
      'The first question is never "how bad is it": it is "is it real".',
      'Then scope: one host or many? Then impact: what data or service is exposed?',
      'End with the two actions that are always available: contain, or escalate to a human who can ' +
        'authorise containment.',
    ],
    solution:
      'One: establish whether it is real: check the rule\'s prior firing history, and whether a ' +
      'change record or scheduled job explains the activity. Two: establish scope: is this one ' +
      'host or several, one account or many, and does the source appear elsewhere tonight. Three: ' +
      'establish impact: what data or service sits on the affected systems, and is any of it ' +
      'regulated. Four: decide containment: can I isolate this without destroying evidence, and am ' +
      'I authorised to. Five: notify, who needs to know now rather than at 09:00, and does a ' +
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
      'You have just written the artefact that turns a good night into a survivable one, and the ' +
      'first genuinely portfolio-worthy thing in this package. An on-call procedure in your own ' +
      'words, defensible in an interview, is worth more to a hiring manager than a certificate.\n\n' +
      'A certificate says you sat through material. A procedure you wrote and can explain shows that ' +
      'you thought through, in your own words, what actually has to happen when the pressure is on. ' +
      'That is a far more convincing thing to bring to an interview, because it demonstrates ' +
      'judgement rather than attendance.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.4.6'] ?? [],
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
    'A COPILOT here is an AI assistant built into the platform that can read a single alert and ' +
    'write out an analysis of it in plain English: what it thinks is concerning, what it thinks is ' +
    'reassuring, and what it recommends you do. It works the way a junior colleague sitting next to ' +
    'you might: you can ask it to look at something and tell you what it thinks, and it answers in ' +
    'seconds, but the final decision, and the responsibility for that decision, stays with you.\n\n' +
    'The copilot reads one alert and tells you what it thinks. It is right most of the time, which ' +
    'is what makes it worth having and also what makes it dangerous: an assistant that was wrong ' +
    'half the time would be easy to ignore. Every analysis comes in four parts -- what it reads as ' +
    'risk, what it reads as mitigating, what it recommends, and what it could not see. The last ' +
    'part is the one operators skip, and it explains nearly every mistake it makes.\n\n' +
    'Being right most of the time is exactly what makes an assistant worth building a habit around, ' +
    'and exactly what makes that habit risky. A tool that is obviously unreliable gets checked every ' +
    'time out of instinct. A tool that is right ninety-five times out of a hundred earns your trust, ' +
    'and trust is precisely what makes the other five times dangerous: you stop reading closely ' +
    'right around when reading closely would have mattered most.',
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
    id: 'triage.5.1',
    moduleId: '3.5',
    packageId: 'incident-triage',
    order: 1,
    title: 'Read what the assistant cannot see',
    kind: 'multiple-choice',
    goal: 'Learn to check a copilot claim against what the copilot actually had access to.',
    prompt:
      'Reviewing a sudo alert, the copilot writes: "I see no approved change record covering this ' +
      'window." Its own limits section says it can see the alert and the rule\'s firing history, and ' +
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
      'the copilot wants you to escalate.\n\n' +
      'The reason this sentence is so easy to miss is that it is grammatically identical to a real ' +
      'finding. "I see no approved change record" reads the same whether it means "I checked the ' +
      'change records and there genuinely is not one" or "I was never given access to change records ' +
      'in the first place." Only the limits section tells you which. Making a habit of reading that ' +
      'section first is what stops the second kind of sentence from being mistaken for the first.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.5.1'] ?? [],
  },
  {
    id: 'triage.5.2',
    moduleId: '3.5',
    packageId: 'incident-triage',
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
          'Two of the copilot\'s recommendations are wrong, and both want you to escalate routine ' +
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
      'reasoning rather than sampling the verdicts.\n\n' +
      'Knowing the count in advance made this exercise a search problem: find the two. In a real ' +
      'shift there is no count, no hint that anything is wrong at all, and a confidently written ' +
      'wrong recommendation looks exactly like a confidently written right one from the outside. The ' +
      'only defence that works in both settings is reading why the copilot reached its conclusion, ' +
      'not just what the conclusion was.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.5.2'] ?? [],
  },
  {
    id: 'triage.5.3',
    moduleId: '3.5',
    packageId: 'incident-triage',
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
        'Remember correlation from Module 3.3: connecting several alerts together because they share ' +
        'an actor, an address, or a tight window of time. This exercise exists to show you where an ' +
        'AI assistant structurally cannot do that. The copilot is given one alert. Not the queue, ' +
        'not the shift, not the other three alerts that share a source address with this one. Its ' +
        'limits section says so on every single analysis: "I have not read the other alerts in this ' +
        'queue." Correlation is the thing you have that it does not, and on this queue correlation ' +
        'is the entire answer.\n\n' +
        'It helps to picture how the copilot actually receives its work: each alert is handed to it ' +
        'on its own, like a single page torn out of a much longer report, with no way to see the ' +
        'pages before or after it. It can reason brilliantly about that one page. It cannot notice a ' +
        'pattern that only exists across several pages, because it was never shown them together, and ' +
        'no amount of clever wording in the alert would change that.',
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
          'The alerts belonging to one actor\'s sequence go together. Individually the copilot rated ' +
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
      'triage difficult, and it is the reason the job still exists.\n\n' +
      'It is tempting to assume this gap closes as AI assistants get more capable, but notice what is ' +
      'actually missing here: it is not intelligence, it is access. A smarter assistant given the ' +
      'same single alert and nothing else would hit the identical wall. The fix is architectural, ' +
      'giving it the rest of the queue, not a better model, and until a platform does that, reading ' +
      'across alerts stays a human responsibility.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.5.3'] ?? [],
  },
  {
    id: 'triage.5.4',
    moduleId: '3.5',
    packageId: 'incident-triage',
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
        'Recall the base-rate reasoning from Module 3.1: a statistic about how a rule has behaved in ' +
        'the past is a legitimate starting expectation, but it is not a verdict on the one alert in ' +
        'front of you. The most dangerous thing an assistant can say to you is a correct fact ' +
        'deployed as the wrong argument. "This rule has been wrong 331 times out of 340, so close ' +
        'it" is sound reasoning about a population and worthless reasoning about an instance. Base ' +
        'rates tell you where to look first. They never tell you what a particular alert is, and ' +
        'specific evidence on the alert in front of you outranks them every time.\n\n' +
        'What makes this harder to catch than an outright fabrication is that every word of it is ' +
        'true. The copilot is not lying about the number, 331 out of 340 really is the rule\'s ' +
        'history. The mistake is entirely in what that true number is being used to prove, and ' +
        'catching that kind of error means checking the argument\'s logic, not just fact-checking its ' +
        'numbers.',
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
      'statistic is accurate and its inference is not: a base rate describes the rule\'s history, and ' +
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
          'Two analyses argue from the rule\'s history to a disposition of this firing. Read them, ' +
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
      'the case where you overruled it.\n\n' +
      'Notice the shape of the trade you just made: the assistant saved you a great deal of reading ' +
      'across the eighty other alerts, and cost you two moments where confident, factually accurate ' +
      'advice pointed the wrong way. That trade is worth making, but only if you stay the one who ' +
      'checks the two moments, which is exactly why "it drafts, you decide" is a genuine skill and ' +
      'not just a slogan.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.5.4'] ?? [],
  },
  {
    id: 'triage.5.5',
    moduleId: '3.5',
    packageId: 'incident-triage',
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
        'ATTRIBUTION means naming who is behind an attack, a specific group or individual, rather ' +
        'than just describing what they did. It is one of the hardest things to establish honestly in ' +
        'this field, because it usually requires evidence, like known infrastructure or tooling, ' +
        'that most SOCs simply do not have access to. A recommendation can be correct and its ' +
        'justification worthless, and you cannot tell the difference from the recommendation. This ' +
        'is the failure mode that survives every check in this module, because no disposition ' +
        'catches it: agree with the copilot and you get the alert right. The damage happens ' +
        'downstream, in what you wrote in the handover.\n\n' +
        'This is worth sitting with because it breaks the pattern every previous exercise in this ' +
        'module trained you to expect: usually a wrong copilot claim leads you toward a wrong ' +
        'disposition, and getting the disposition right proves you caught it. Here the disposition is ' +
        'right regardless, so there is no automatic feedback telling you anything went wrong at all. ' +
        'The only way to catch this one is to actually read and evaluate the reasoning, not just the ' +
        'conclusion.',
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
      '-- hunting for that actor\'s known tooling, and possibly not looking for what is actually ' +
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
      'around. Read the recommendation, then read why. They fail independently.\n\n' +
      'That last sentence is the whole module in miniature. Whether a recommendation is right and ' +
      'whether its reasoning is sound are two separate questions with two separate answers, and this ' +
      'exercise is the one built specifically to show they do not always move together. A tool that ' +
      'is right for the wrong reasons will keep being useful right up until the one time its wrong ' +
      'reasoning happens to point somewhere the right answer does not.',
    practice: INCIDENT_TRIAGE_PRACTICE['triage.5.5'] ?? [],
  },
];

// --- module 3.6: reading the enrichment --------------------------------------

const EGRESS_ENR = enrichmentOf(NIGHT, 'egress-uncategorised-destination');
const EGRESS_FIRINGS = num(EGRESS_ENR.priorFirings);
const EGRESS_FALSE = num(EGRESS_ENR.priorFalsePositives);
const DLP_ENR = enrichmentOf(NIGHT, 'dlp-outbound-attachment');
const DLP_FIRINGS = num(DLP_ENR.priorFirings);
const EICAR_ENR = enrichmentOf(INTRO, 'av-signature-match');
const EICAR_FALSE = num(EICAR_ENR.priorFalsePositives);
const EICAR_FIRINGS = num(EICAR_ENR.priorFirings);

const MODULE_3_6: Exercise[] = [
  {
    id: 'triage.6.1',
    moduleId: '3.6',
    packageId: 'incident-triage',
    order: 1,
    title: 'What a history of false positives is worth',
    kind: 'multiple-choice',
    goal: 'Use prior firings as evidence without letting them make the decision.',
    prompt: `An alert carries an enrichment block showing it has fired ${EGRESS_FIRINGS} times before and been a false positive on ${EGRESS_FALSE} of them. Which of the following are correct readings? Select all that apply.`,
    teach: {
      concept:
        'Recall from Module 3.1 what an enrichment block is: extra facts, like this rule\'s history, ' +
        'attached automatically underneath an alert. Prior firing counts are the most useful field ' +
        'in an enrichment block and the easiest to misuse. What they genuinely tell you is a prior ' +
        'probability: a rule that has been wrong nine times out of ten is probably wrong again, and ' +
        'that is a legitimate input to a decision made in ninety seconds.\n\n' +
        'What they do not tell you is anything about THIS firing. The history is a property of the ' +
        'rule, and the alert in front of you is a specific event with its own details, and the whole ' +
        'reason an operator exists rather than a threshold is that the two can disagree. Every rule ' +
        'that ever caught a real intrusion had a history of false positives up until the moment it ' +
        'did not.\n\n' +
        'So the number sets your starting expectation and never finishes the job. Read the history ' +
        'first because it is fast, then read the alert, and let the specifics overrule the prior ' +
        'when they are strange enough. A high false positive count also has a second meaning worth ' +
        'noting separately: it is a tuning case, whatever you decide about this one.',
    },
    options: [
      { id: 'a', label: 'It sets a prior: this rule is usually wrong, so start from that expectation.' },
      { id: 'b', label: 'It says nothing specific about this firing, which has its own details to read.' },
      { id: 'c', label: 'A rule with this history is a tuning candidate regardless of how you dispose of this alert.' },
      { id: 'd', label: 'Details in this alert that differ from the usual pattern can legitimately overrule the prior.' },
      { id: 'e', label: 'With that history the alert can be closed without reading it, since the odds are overwhelming.' },
    ],
    hints: [
      'Four are correct. One turns a prior into a decision.',
      'Ask what the history is a property of: the rule, or this event?',
      'Every rule that ever caught a real intrusion had a run of false positives before it.',
    ],
    solution:
      'A, B, C, and D. The history is a fast and legitimate prior, it is a fact about the rule ' +
      'rather than this event, it is independently a tuning signal, and specifics can overrule it. ' +
      'E is the habit that produces the incident nobody caught: closing on the counter alone is ' +
      'exactly the automation described in the tuning module, except performed by a human who then ' +
      'carries the responsibility for it. If the rule genuinely can be closed without reading, say ' +
      'so and get it automated with a record, rather than doing it by hand and calling it triage.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option closes the alert on the counter alone, without reading what this particular ' +
          'firing says.',
      },
    ],
    debrief:
      'Hold both halves. Ignoring the history makes you slow; obeying it makes you blind. The ' +
      'operators who are good at this read the counter, form an expectation, and then genuinely ' +
      'look.\n\n' +
      'This tension does not fully resolve, and that is the honest answer, not a gap in the ' +
      'teaching. Reading every alert as if it had no history wastes time you do not have; treating ' +
      'the history as the answer misses the rare alert that matters. Good operators live inside that ' +
      'tension rather than picking a side of it permanently, adjusting how hard they look based on ' +
      'the number, but never skipping the look entirely.',
    practice: [],
  },
  {
    id: 'triage.6.2',
    moduleId: '3.6',
    packageId: 'incident-triage',
    order: 2,
    title: 'Three numbers that disagree',
    kind: 'multiple-choice',
    goal: 'Read severity, confidence, and history as three different claims.',
    prompt: `The EICAR alert in your queue is severity critical with confidence ${num(EICAR_ENR.priorFirings) > 0 ? '99' : '99'}, and its enrichment shows ${EICAR_FALSE} false positives out of ${EICAR_FIRINGS} firings. Which of the following are accurate? Select all that apply.`,
    teach: {
      concept:
        'You have now met severity (Module 3.1) and prior firing history (earlier in this module) ' +
        'separately. This exercise puts a third number, confidence, alongside them and asks what ' +
        'happens when all three genuinely disagree at once. Three numbers arrive with most alerts ' +
        'and they answer three different questions. SEVERITY ' +
        'is what the rule author thought this class of event would mean if it were real: it is a ' +
        'statement about a category, decided in advance by somebody who has never seen your ' +
        'estate. CONFIDENCE is how sure the detection is that the pattern actually matched, which is ' +
        'usually near certain for a signature and much lower for a heuristic. PRIOR HISTORY is what ' +
        'happened the last time this rule fired here.\n\n' +
        'A signature match on a test file shows all three at once and they point in different ' +
        'directions. Confidence is 99 because the signature genuinely matched. Severity is critical ' +
        'because malware detected on an endpoint is a critical class of event. And the history says ' +
        'this fires constantly and is almost always nothing.\n\n' +
        'None of them is lying. They are answering "how bad would this be", "did the pattern ' +
        'match", and "what has this rule been like here", and an operator who collapses them into ' +
        'one impression loses the ability to say why they decided what they decided.',
    },
    options: [
      { id: 'a', label: 'Severity is a statement about the class of event, set in advance by the rule author.' },
      { id: 'b', label: 'Confidence is about whether the pattern matched, not about whether it matters.' },
      { id: 'c', label: 'A signature can match with near-total confidence and still be a benign true positive.' },
      { id: 'd', label: 'The three numbers can legitimately point in different directions without any of them being wrong.' },
      { id: 'e', label: 'Critical severity plus 99 confidence means this must be escalated regardless of what it is.' },
    ],
    hints: [
      'Four are accurate. One reads two of the numbers and stops.',
      'What is EICAR, and did the signature match correctly?',
      'Ask what each number is a claim about before combining them.',
    ],
    solution:
      'A, B, C, and D. Severity describes the class, confidence describes the match, and the two ' +
      'plus the history can all be right while pointing different ways. E is the mistake the EICAR ' +
      'file exists to teach: the signature matched perfectly, the class of event is genuinely ' +
      'critical, and the file is a deliberately harmless test string that somebody downloaded on ' +
      'purpose. It is a true positive and a non-event, and escalating it because two numbers are ' +
      'high is how an escalation budget gets spent on nothing.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option escalates on the two headline numbers without asking what the file actually ' +
          'was.',
      },
    ],
    debrief:
      'When you write the closure, name which number you overruled and why. "Critical severity, but ' +
      'EICAR test string, benign true positive" is a sentence that survives review; "closed, false ' +
      'positive" is not even accurate.\n\n' +
      'Naming the number you overruled does two things at once: it proves to a reviewer that you saw ' +
      'the alarming number and consciously decided it did not apply here, rather than missing it, ' +
      'and it gives the next person who reads this rule\'s history a real example of exactly the kind ' +
      'of firing that should not raise alarm, which is useful input the next time somebody considers ' +
      'tuning the rule.',
    practice: [],
  },
  {
    id: 'triage.6.3',
    moduleId: '3.6',
    packageId: 'incident-triage',
    order: 3,
    title: 'Reputation and allowlists',
    kind: 'multiple-choice',
    goal: 'Read the two enrichment fields that most often decide a disposition, and their limits.',
    prompt:
      'Enrichment blocks in this queue carry a reputation and sometimes an allowlist flag. Which of ' +
      'the following are accurate? Select all that apply.',
    teach: {
      concept:
        'A REPUTATION FEED is a service, usually run by a security vendor, that keeps a running list ' +
        'of internet addresses, domains and files other people have already reported as malicious, ' +
        'the way a neighbourhood watch list tracks cars that have already been seen casing houses. An ' +
        'ALLOWLIST is a separate, internal list your own organisation keeps of things it has decided ' +
        'to treat as expected and safe. Reputation is somebody else opinion about an address, domain ' +
        'or file, usually a vendor feed. It is genuinely useful and it is a lagging indicator: ' +
        'infrastructure gets a bad reputation after it has been used and reported, so freshly ' +
        'registered or freshly rented infrastructure reads as unknown rather than as bad.\n\n' +
        'That makes UNKNOWN the interesting value, and the one most often read as a synonym for ' +
        'fine. It is not. It means nobody has an opinion, which for a destination your estate has ' +
        'never contacted before is a reason to look harder rather than a reason to relax.\n\n' +
        'An allowlist is a stronger statement and a more dangerous one: somebody decided this is ' +
        'expected. That decision was made at a point in time, by a person, for a reason that is ' +
        'often not recorded, and it keeps applying long after the reason expires. An allowlisted ' +
        'alert deserves the question of who allowlisted it and when, and a queue where most things ' +
        'are allowlisted has usually been quietened rather than tuned.',
    },
    options: [
      { id: 'a', label: 'Reputation lags: new infrastructure reads as unknown because nobody has reported it yet.' },
      { id: 'b', label: 'Unknown means nobody has an opinion, which is not the same as known good.' },
      { id: 'c', label: 'An allowlist entry is a decision somebody made at a point in time, and it keeps applying afterwards.' },
      { id: 'd', label: 'An allowlisted alert is still worth asking who added it and when.' },
      { id: 'e', label: 'Unknown reputation on a destination the estate has never contacted before is reassuring.' },
    ],
    hints: [
      'Four are accurate. One treats an absence of information as good news.',
      'Ask why a brand new attacker server would have any reputation at all.',
      'What does an allowlist entry from two years ago actually assert today?',
    ],
    solution:
      'A, B, C, and D. Reputation lags reality, unknown is an absence rather than a verdict, and an ' +
      'allowlist is a decision with a date on it that nobody revisits. E is exactly backwards, and ' +
      'it is the reading that lets the interesting alerts through: a destination with no reputation ' +
      'that your estate has never talked to before is the profile of infrastructure that was rented ' +
      'last week for this, and it deserves more attention than a known-bad address that your ' +
      'firewall already blocks.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats an unknown reputation on a first-ever destination as a comfort rather ' +
          'than a question.',
      },
    ],
    debrief:
      'The allowlist question is worth asking out loud once a quarter. Most SOCs have entries ' +
      'nobody living can explain, and each one is a rule somebody turned off with no expiry.\n\n' +
      'This is the same lesson from tuning exclusions in Module 3.2, showing up in a different form: ' +
      'a decision made once, under time pressure, quietly outlives the person and the reason behind ' +
      'it. An allowlist without an owner and a reason attached is not a safeguard any more, it is a ' +
      'blind spot with a reassuring name.',
    practice: [],
  },
  {
    id: 'triage.6.4',
    moduleId: '3.6',
    packageId: 'incident-triage',
    order: 4,
    title: 'One line of context outweighing the counter',
    kind: 'short-answer',
    goal: 'Explain why a specific detail can beat a strong statistical prior.',
    prompt: `An egress alert has fired ${EGRESS_FIRINGS} times before and been a false positive ${EGRESS_FALSE} times. Its enrichment adds one line: the destination has no category, and first contact from Ridgeline infrastructure was 10:45 today. In three or four sentences, say how you would weigh those against each other.`,
    teach: {
      concept:
        'EGRESS is the general term for traffic leaving your network heading outward to the internet, ' +
        'as opposed to traffic arriving. An egress alert fires when a machine inside your network ' +
        'talks to somewhere outside it that the rule considers worth flagging, which is exactly the ' +
        'kind of alert that matters most when data is being taken off a compromised host. This is ' +
        'the judgement the whole module exists for. The counter says the rule is usually wrong. One ' +
        'line of context says something about THIS firing that has never been true of the previous ' +
        'ones.\n\n' +
        'The prior is a statement about the rule across all its firings, most of which were routine ' +
        'traffic to destinations the estate talks to constantly. A destination contacted for the ' +
        'first time today is not a member of that population. The history is evidence about a ' +
        'different set of events, which is why it can be strong and still not apply.\n\n' +
        'Add what the absence of a category means. No reputation is not a clean bill of health, it ' +
        'is nobody having formed an opinion yet, which is the normal state of infrastructure that ' +
        'was set up recently. First contact plus no category plus repeating outbound traffic is a ' +
        'shape, and the shape is what you escalate on, not the counter.\n\n' +
        'A good answer says the prior applies to the rule rather than this event, identifies first ' +
        'contact or the absent reputation as the detail that separates this firing from the ' +
        'history, and reaches escalation or further investigation rather than closure.',
    },
    hints: [
      'The history is about the rule. What is the one line about?',
      'Ask whether this firing belongs to the same population as the previous ones.',
      'A good answer notes that the prior describes other events, names first contact today or the missing reputation as what makes this one different, and lands on looking further rather than closing.',
    ],
    solution:
      'The false positive count describes the rule across its previous firings, and almost all of ' +
      'those were traffic to destinations this estate contacts routinely. The line about first ' +
      'contact at 10:45 today says this firing is not a member of that population, so the prior is ' +
      'strong evidence about a different set of events and does not carry over. The absent category ' +
      'reinforces it rather than softening it, because no reputation means nobody has formed a view ' +
      'yet, which is the normal state of infrastructure that was stood up recently. Repeating ' +
      'outbound traffic to a destination we have never contacted before is worth investigating on ' +
      'its own terms, so I would look rather than close, whatever the counter says.',
    expectedOutput:
      'An answer noting the prior applies to the rule rather than this firing, naming first contact ' +
      'or the missing reputation as the distinguishing detail, and choosing to investigate.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['population', 'previous firings', 'about the rule', 'different set', 'does not carry', 'other events'],
          ['first contact', 'never contacted', '10:45', 'new destination', 'no category', 'no reputation'],
          ['investigat', 'escalat', 'look', 'not close', 'worth'],
        ],
        hint:
          'Three ideas: what the prior is actually about, the detail that makes this firing ' +
          'different, and what you do as a result.',
      },
    ],
    debrief:
      'That destination is the exfiltration channel the rest of the platform finds from four other ' +
      'directions. The counter said ignore it, and one line of context said otherwise.\n\n' +
      'EXFILTRATION is the term for an attacker actually moving stolen data out of your network, ' +
      'which is usually the final and most damaging stage of an intrusion. It is worth noticing that ' +
      'the same egress rule that fires constantly on harmless traffic is also the rule that would ' +
      'catch exfiltration, which is exactly why a rule with a poor track record still cannot simply ' +
      'be dismissed on that record alone: the harmless firings and the one that matters can share the ' +
      'same detection.',
    practice: [],
  },
  {
    id: 'triage.6.5',
    moduleId: '3.6',
    packageId: 'incident-triage',
    order: 5,
    title: 'What enrichment cannot tell you',
    kind: 'multiple-choice',
    goal: 'Know which context an alert never carries, and go and get it.',
    prompt:
      'Enrichment gives you history, reputation and allowlist state. Which of the following are ' +
      'things it typically does NOT tell you, and that you have to establish yourself? Select all ' +
      'that apply.',
    teach: {
      concept:
        'This exercise closes out the enrichment module by naming its limits directly. An ' +
        'enrichment block is what the detection platform could look up automatically. It is almost ' +
        'never the context that decides the disposition, and knowing what is missing is what stops ' +
        'an operator from deciding on the half of the picture they were handed.\n\n' +
        'Four things are usually absent. HOW IMPORTANT THE ASSET IS: the same alert on a test box ' +
        'and on the payment gateway are different alerts, and the enrichment rarely knows which is ' +
        'which. WHO THE USER IS: a failed login for a departing contractor and one for the finance ' +
        'director carry different weight. WHAT CHANGED RECENTLY: half of all anomalies are a ' +
        'deployment, a migration, or a new monitoring agent, and the change record is where that ' +
        'lives. And WHETHER ANYTHING ELSE IS HAPPENING: one alert is a data point, and the same ' +
        'host appearing in three unrelated rules within an hour is something else entirely.\n\n' +
        'Two of those you can answer in seconds if your organisation has an asset inventory and a ' +
        'change calendar, which is why triage quality depends so heavily on things that are not the ' +
        'SIEM.',
    },
    options: [
      { id: 'a', label: 'How business-critical the affected asset is.' },
      { id: 'b', label: 'Who the user is and what their role would normally do.' },
      { id: 'c', label: 'Whether a change, deployment or migration happened around the same time.' },
      { id: 'd', label: 'Whether the same host or user appears in other alerts right now.' },
      { id: 'e', label: 'Whether the detection pattern actually matched the event.' },
    ],
    hints: [
      'Four are missing from a typical enrichment block. One is precisely what the alert is telling you.',
      'Ask which of these lives in a system other than the detection platform.',
      'The confidence field already answers one of these.',
    ],
    solution:
      'A, B, C, and D. Asset criticality, user context, recent change, and concurrent activity are ' +
      'the four pieces of context that most often flip a disposition, and none of them usually ' +
      'arrives with the alert. E is the one thing the alert does tell you: the confidence field is ' +
      'exactly the claim that the pattern matched. Notice that C is the cheapest of the four to ' +
      'check and the most often skipped, and that a surprising share of anomalies resolve to ' +
      'somebody deploying something on a Tuesday.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option is the thing the confidence field already tells you.',
      },
    ],
    debrief:
      'Ask for a change calendar in your first week. Knowing that the anomaly at 02:00 was a ' +
      'scheduled migration turns a twenty-minute investigation into a ten-second one, several times ' +
      'a shift.\n\n' +
      'The pattern across all four missing pieces here is the same: none of them live inside the ' +
      'detection platform at all, they live in an asset inventory, an HR system, a change calendar, ' +
      'or simply in what else is on your screen right now. Good triage means knowing which systems ' +
      'to go and check, not just knowing how to read the alert that is already in front of you.',
    practice: [],
  },
];

// --- module 3.7: the alerts that are not logins ------------------------------

const MODULE_3_7: Exercise[] = [
  {
    id: 'triage.7.1',
    moduleId: '3.7',
    packageId: 'incident-triage',
    order: 1,
    title: 'A malware alert that is not malware',
    kind: 'multiple-choice',
    goal: 'Dispose of a signature match correctly, and record it accurately.',
    prompt:
      'An antivirus alert reports the EICAR test file quarantined in a user Downloads folder. Which ' +
      'of the following are correct? Select all that apply.',
    teach: {
      concept:
        'This module moves through several kinds of alert that are not about logins at all, starting ' +
        'with malware, and each one turns out to need its own reading. EICAR is a short, ' +
        'deliberately harmless string that every antivirus product is required to detect, so that ' +
        'people can test whether their scanner works without handling real malware. Finding it means ' +
        'the scanner worked, which is the opposite of bad news.\n\n' +
        'Dispose of it as a BENIGN TRUE POSITIVE rather than a false positive, and the distinction ' +
        'is not pedantry. A false positive means the detection was wrong and points at tuning. A ' +
        'benign true positive means the detection was right and the activity was harmless, which ' +
        'points at nothing and should not be tuned away, because the same rule catching a real ' +
        'sample tomorrow is exactly what you want.\n\n' +
        'There is one genuine question left, and it is not about the file. Somebody put it there, ' +
        'and it is worth knowing whether that was an administrator testing the deployment or a user ' +
        'who downloaded something from a page that claimed to be a virus test. The alert is closed ' +
        'either way; the second case is a conversation.',
    },
    options: [
      { id: 'a', label: 'EICAR is a harmless test string, so no malicious code was present.' },
      { id: 'b', label: 'The detection worked correctly, so this is a benign true positive rather than a false positive.' },
      { id: 'c', label: 'It should not be tuned away, because the same rule catching a real sample is the point.' },
      { id: 'd', label: 'It is still worth knowing who put the file there and why.' },
      { id: 'e', label: 'It should be closed as a false positive and the rule tuned to reduce noise.' },
    ],
    hints: [
      'Four are correct. One both mislabels the closure and proposes tuning away a working detection.',
      'Was the detection wrong, or was the thing it found harmless? Those are different.',
      'Ask what tuning this rule would cost you the next time something real arrives.',
    ],
    solution:
      'A, B, C, and D. Harmless string, correct detection, keep the rule, and one residual question ' +
      'about how it got there. E is wrong twice over: labelling it a false positive puts a wrong ' +
      'entry in the data that detection engineering uses to decide what to tune, and acting on that ' +
      'label would weaken the antivirus signature that is doing precisely its job. The disposition ' +
      'taxonomy exists so that closures like this one do not read as evidence against the rule.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option calls a correct detection a false positive, and then proposes tuning on the ' +
          'strength of that label.',
      },
    ],
    debrief:
      'Every wrong disposition is a small lie told to whoever reads the triage data later. This one ' +
      'would show up as a noisy antivirus rule, and somebody would eventually act on it.\n\n' +
      'None of this is unique to antivirus alerts specifically. It is the same benign-true-positive ' +
      'reasoning from Module 3.1, applied again in a new setting, which is worth noticing: once you ' +
      'have the concept, it keeps reapplying itself to alert types you have never seen before, ' +
      'because the underlying question, did the detection work, and was the thing it found actually ' +
      'harmful, never changes.',
    practice: [],
  },
  {
    id: 'triage.7.2',
    moduleId: '3.7',
    packageId: 'incident-triage',
    order: 2,
    title: 'A data loss alert that is business as usual',
    kind: 'multiple-choice',
    goal: 'Recognise a rule that is producing nothing but noise, and say what to do about it.',
    prompt: `A data loss rule has fired ${DLP_FIRINGS} times, been a false positive on all ${DLP_FIRINGS} of them, is allowlisted, and has just fired again on the nightly appointment reminder batch. Which of the following are correct? Select all that apply.`,
    teach: {
      concept:
        'A DATA LOSS PREVENTION, or DLP, rule watches for information leaving the organisation that ' +
        'should not, such as a spreadsheet of customer records attached to an outbound email. A rule ' +
        'with a perfect false positive record is not a detection, it is a scheduled interruption. ' +
        'Every firing costs an operator attention that is then unavailable for something real, and ' +
        'the cost is invisible because it is spread thinly across every shift.\n\n' +
        'The right disposition for this firing is quick and the right ACTION is not about this ' +
        'firing at all. A rule that has never once been right in over a thousand attempts needs ' +
        'either a tuning change that excludes the known batch, or removal, and either way that is a ' +
        'case to be made rather than a decision an operator takes alone.\n\n' +
        'The allowlist flag is worth reading sceptically here too. Somebody has already tried to ' +
        'quieten this and it is still generating alerts, which usually means the allowlist is ' +
        'matching on something narrower than the actual pattern. Note the residual risk honestly: ' +
        'tuning out the reminder batch means genuine exfiltration disguised as that batch would ' +
        'also be missed, which is an acceptable trade in most organisations and should be stated ' +
        'rather than assumed.',
    },
    options: [
      { id: 'a', label: 'A rule that has never been right in over a thousand firings is a tuning or removal case.' },
      { id: 'b', label: 'The cost of the noise is real but invisible, because it is spread across every shift.' },
      { id: 'c', label: 'The allowlist already existing suggests it matches something narrower than the actual pattern.' },
      { id: 'd', label: 'Tuning it out means genuine exfiltration disguised as that batch would be missed, which should be stated.' },
      { id: 'e', label: 'The operator should simply delete the rule at the end of the shift.' },
    ],
    hints: [
      'Four are correct. One takes a decision that is not the operator to take.',
      'Ask who owns the detection content, and what happens if rules disappear without a record.',
      'What is the honest cost of tuning this away, and who should hear it?',
    ],
    solution:
      'A, B, C, and D. It is a tuning case, the cost is real and hidden, the existing allowlist is ' +
      'evidence of a partial fix, and the residual risk of tuning it out deserves saying out loud. ' +
      'E is the boundary: an operator makes the case, detection engineering makes the change, and ' +
      'the reason is not hierarchy but reversibility. A rule deleted by whoever was annoyed by it ' +
      'at 03:00 leaves no record of what coverage was given up, and the gap is only discovered ' +
      'after something walks through it.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option has the operator removing detection content unilaterally at the end of a ' +
          'shift.',
      },
    ],
    debrief:
      'The residual risk sentence in D is what makes a tuning request credible. An operator who ' +
      'says what the change would cost as well as what it saves gets their tuning requests actioned.\n\n' +
      'A request that only lists benefits reads as sales pitch, and experienced reviewers discount ' +
      'it accordingly. A request that also names the honest cost, what would slip through unnoticed ' +
      'if the change were made, reads as somebody who actually thought it through, and that is the ' +
      'request that gets approved without a lot of back and forth.',
    practice: [],
  },
  {
    id: 'triage.7.3',
    moduleId: '3.7',
    packageId: 'incident-triage',
    order: 3,
    title: 'A critical alert about a billing query',
    kind: 'multiple-choice',
    goal: 'Read a privileged-account alert for what the account actually did.',
    prompt:
      'A cloud alert reports that the root principal invoked a cost and usage API. It is severity ' +
      'critical and the account is allowlisted for this call. Which of the following are correct? ' +
      'Select all that apply.',
    teach: {
      concept:
        'On a cloud platform, the ROOT PRINCIPAL is the single most powerful account that exists, ' +
        'the one with permission to do absolutely anything, comparable to a master key that opens ' +
        'every door in a building. Ordinary staff normally use narrower, ROLE-scoped accounts that ' +
        'can only do the specific job they need, so root even being used at all is unusual by design. ' +
        'Root and administrator accounts are watched closely, and rightly: any use of them is ' +
        'unusual by design, because well-run environments do routine work with scoped roles. That ' +
        'is why the severity is critical before anybody looks at what happened.\n\n' +
        'What happened here is that root read a billing figure. The action is read-only, it changes ' +
        'nothing, and it is the kind of thing a finance process or a cost dashboard does on a ' +
        'schedule. The alert is a true positive about an account and a non-event about an action.\n\n' +
        'Two things still deserve a moment. Root being used at all, even harmlessly, is worth ' +
        'knowing about, because the direction of travel should be towards nobody using it. And the ' +
        'question that actually matters for any privileged-account alert is not what was done but ' +
        'WHO DID IT and from where: the same read-only call from an unfamiliar address at an ' +
        'unusual hour is a different alert with the same rule id.',
    },
    options: [
      { id: 'a', label: 'The severity is high because the account is privileged, before anybody knows what it did.' },
      { id: 'b', label: 'The specific action is read-only and changes nothing, which lowers the concern considerably.' },
      { id: 'c', label: 'The useful question for a privileged-account alert is who used it and from where.' },
      { id: 'd', label: 'Root being used routinely at all is worth raising separately, even when each use is harmless.' },
      { id: 'e', label: 'Since the account is allowlisted for this call, no further reading of the alert is needed.' },
    ],
    hints: [
      'Four are correct. One stops reading because a flag is set.',
      'Ask what the same rule would look like if the call came from somewhere unexpected.',
      'The allowlist covers the action. Does it cover the source?',
    ],
    solution:
      'A, B, C, and D. Severity tracks the account, the action is harmless, the source is the real ' +
      'question, and habitual root use is its own finding. E is the trap the allowlist sets: it ' +
      'says this CALL is expected, and it says nothing about who made it or from where. An ' +
      'allowlisted action performed by a compromised credential from an unfamiliar address is ' +
      'exactly the alert an attacker would most like you to close on the flag alone.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option stops at the allowlist flag without asking who performed the action.',
      },
    ],
    debrief:
      'Make "who and from where" your reflex on any privileged-account alert. The action is often ' +
      'boring and the source is where the answer is.\n\n' +
      'An allowlist tells you a specific action is expected, and says nothing about who is taking ' +
      'it. A stolen credential performing an allowlisted action from a location that credential has ' +
      'never used before is invisible if you only check the flag, which is precisely why that ' +
      'question, who and from where, has to become automatic rather than optional.',
    practice: [],
  },
  {
    id: 'triage.7.4',
    moduleId: '3.7',
    packageId: 'incident-triage',
    order: 4,
    title: 'Internet background noise',
    kind: 'multiple-choice',
    goal: 'Tell untargeted scanning apart from somebody interested in you.',
    prompt:
      'Your queue contains web alerts for requests to paths that do not exist on your server, and ' +
      'one for a request containing SQL keywords. Which of the following are accurate? Select all ' +
      'that apply.',
    teach: {
      concept:
        'Any server reachable from the public internet is being probed constantly by automated ' +
        'tools called SCANNERS, which methodically try thousands of known web addresses and common ' +
        'software weaknesses against every reachable machine they can find, the way junk mail arrives ' +
        'whether or not anyone at that address wants it. Anything with a public address is scanned ' +
        'continuously by automated tools looking for common software. Requests for WordPress login ' +
        'pages on a server that does not run WordPress, or for environment files, are the ambient ' +
        'weather of the internet rather than evidence of interest in you.\n\n' +
        'What separates noise from attention is not the payload, it is the SHAPE. Untargeted ' +
        'scanning sprays a standard list of paths, gets 404s, and moves on within seconds. Somebody ' +
        'interested in you specifically probes paths that exist on YOUR application, adapts to the ' +
        'responses they get, and comes back. One request for a path you do not have is nothing; ' +
        'twenty requests walking your actual URL structure is a person.\n\n' +
        'The other thing that changes the reading is the response code. A scan that gets 404s ' +
        'everywhere found nothing. The same scan getting a 200 on something it should not have ' +
        'reached is no longer background noise, whatever the source looks like, because the ' +
        'interesting fact is now about your server rather than about them.',
    },
    options: [
      { id: 'a', label: 'Requests for software you do not run are usually untargeted scanning rather than interest in you.' },
      { id: 'b', label: 'Adapting to responses and probing paths that actually exist is what distinguishes a person from a scanner.' },
      { id: 'c', label: 'The response code matters: a 200 where you expected a 404 changes the alert entirely.' },
      { id: 'd', label: 'Volume and persistence from one source over time is more informative than any single request.' },
      { id: 'e', label: 'A request containing SQL keywords is by itself evidence of a targeted attack.' },
    ],
    hints: [
      'Four are accurate. One reads a payload as intent.',
      'Ask what a scanner does after it gets a 404, and what a person does.',
      'Which matters more: what they asked for, or what your server answered?',
    ],
    solution:
      'A, B, C, and D. Scanning for absent software is weather, adaptation and persistence indicate ' +
      'a person, the response code can change everything, and the pattern over time beats any one ' +
      'request. E is the reflex to unlearn: injection keywords appear in automated scanning ' +
      'constantly, and in legitimate traffic occasionally, so the string alone is not evidence of ' +
      'targeting. What would be evidence is the same source adjusting its payloads after seeing ' +
      'your responses.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats a payload string as proof of targeting, without looking at the shape ' +
          'of the traffic.',
      },
    ],
    debrief:
      'The response code habit is the cheapest upgrade to web alert triage there is. Filter your ' +
      'scanning alerts to the ones that got a 200 and the queue shrinks to the ones worth reading.\n\n' +
      'A RESPONSE CODE is the short number a web server sends back with every reply, such as 404 ' +
      'meaning "nothing here" or 200 meaning "here is what you asked for." Filtering on that one ' +
      'number turns a queue of thousands of scanning attempts, almost all of which found nothing, ' +
      'into a much smaller list of the handful that actually got somewhere, which is the difference ' +
      'between reading everything and reading what matters.',
    practice: [],
  },
  {
    id: 'triage.7.5',
    moduleId: '3.7',
    packageId: 'incident-triage',
    order: 5,
    title: 'The question each alert class asks',
    kind: 'short-answer',
    goal: 'Say what changes when the alert is not about a login.',
    prompt:
      'Most of your queue is authentication alerts, and you have now met malware, data loss, cloud ' +
      'and web alerts. In three or four sentences, say what you have to do differently when an ' +
      'alert is not about a login.',
    teach: {
      concept:
        'This exercise ties together everything the module just walked through: malware, data loss, ' +
        'privileged accounts, and web scanning, into one general principle. Operators trained on a ' +
        'queue that is mostly authentication develop a single habit: check ' +
        'the source, check the account, check whether it succeeded. It works on logins and ' +
        'transfers badly, because each alert class turns on a different question.\n\n' +
        'For authentication the question is did it work, and from where. For MALWARE it is what the ' +
        'file actually was and whether it executed, since detection and quarantine are usually the ' +
        'system working. For DATA LOSS it is where the data went and whether the recipient is ' +
        'expected, because volume alone is meaningless. For PRIVILEGED ACCOUNT alerts it is who ' +
        'used the account and from where, since the action is often routine. For WEB alerts it is ' +
        'what the server answered, because the request tells you about them and the response tells ' +
        'you about you.\n\n' +
        'The general skill is to work out what the alert class is a proxy for before applying a ' +
        'habit. A good answer names at least two classes with the specific question each one turns ' +
        'on, and says that the login habit does not transfer unchanged.',
    },
    hints: [
      'Your login habit is check the source, check the account, check whether it worked. Which parts of that survive on a malware alert?',
      'For each class, finish the sentence: the thing that decides this alert is...',
      'A good answer names at least two non-login classes with the specific question each turns on, and says the authentication habit does not carry over.',
    ],
    solution:
      'The authentication habit of checking the source, the account and whether it succeeded does ' +
      'not carry over, because each class turns on a different fact. On a malware alert the ' +
      'question is what the file actually was and whether it ran, since a quarantine is usually the ' +
      'system working correctly rather than an incident. On a data loss alert it is where the data ' +
      'went and whether that recipient is expected, because size on its own says nothing. On a web ' +
      'alert it is what the server answered rather than what was requested, since the response is ' +
      'the part that is about us. So before applying any habit I would name what this class of ' +
      'alert is actually a proxy for, and check that first.',
    expectedOutput:
      'An answer naming at least two non-login alert classes with the distinct question each turns ' +
      'on, and stating that the authentication habit does not transfer unchanged.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['does not carry', 'not transfer', 'different fact', 'different question', 'each class'],
          ['what the file', 'whether it ran', 'executed', 'quarantine', 'where the data went', 'recipient'],
          ['server answered', 'response', 'status', 'who used', 'from where'],
        ],
        hint:
          'Three ideas: that the login habit does not transfer, the question a malware or data loss ' +
          'alert turns on, and the question a web or privileged-account alert turns on.',
      },
    ],
    debrief:
      'Write these down as a card for your first months. Four sentences, one per alert class, saved ' +
      'somewhere you can see them, is worth more than any amount of memorising rule names.\n\n' +
      'The reason a short card of "what question does this alert class turn on" beats memorising ' +
      'individual rule names is that new alert types appear constantly, faster than anyone can learn ' +
      'them all by name. Knowing how to ask "what is this class of alert actually a proxy for" is a ' +
      'transferable skill that works on a rule you have never seen before; memorised rule names are ' +
      'not.',
    practice: [],
  },
];

// --- module 3.8: closing well ------------------------------------------------

const MODULE_3_8: Exercise[] = [
  {
    id: 'triage.8.1',
    moduleId: '3.8',
    packageId: 'incident-triage',
    order: 1,
    title: 'Why the disposition taxonomy matters',
    kind: 'multiple-choice',
    goal: 'Close alerts into categories that mean something to whoever reads them next.',
    prompt:
      'Your platform offers several closure categories rather than just closed. Which of the ' +
      'following are reasons that matters? Select all that apply.',
    teach: {
      concept:
        'This final module is about the last step of triage: closing the alert well, in a way that ' +
        'is useful to everyone who comes after you. A closure category is a message to the future. ' +
        'It is read by detection engineering deciding what to tune, by whoever reports on the SOC, ' +
        'and by the next operator meeting the same rule at 03:00.\n\n' +
        'Three categories carry most of the weight and they are routinely confused. FALSE POSITIVE ' +
        'means the detection was wrong: the thing it claimed to see did not happen. BENIGN TRUE ' +
        'POSITIVE means the detection was right and the activity was harmless, which is a ' +
        'completely different message. And TRUE POSITIVE means it was real, whatever happened ' +
        'next.\n\n' +
        'The difference is not bookkeeping. False positive counts drive tuning, so mislabelling a ' +
        'benign true positive as a false positive is an argument for weakening a rule that is ' +
        'working, made accidentally, by somebody who will never know they made it. It also ruins ' +
        'the one metric that tells you whether a queue is workable, because a queue full of correct ' +
        'detections of harmless activity is a very different problem from one full of broken ' +
        'rules.',
    },
    options: [
      { id: 'a', label: 'False positive means the detection was wrong; benign true positive means it was right about harmless activity.' },
      { id: 'b', label: 'False positive counts drive tuning, so a wrong label argues for weakening a rule that works.' },
      { id: 'c', label: 'The categories are how triage output becomes input to detection engineering.' },
      { id: 'd', label: 'They separate a queue full of broken rules from one full of correct but unimportant detections.' },
      { id: 'e', label: 'The distinction is administrative, since either way the alert ends up closed.' },
    ],
    hints: [
      'Four are reasons it matters. One says the label has no consequence.',
      'Ask who reads these categories after you go home, and what they do with them.',
      'What happens to a working rule that accumulates false positive labels?',
    ],
    solution:
      'A, B, C, and D. The two labels mean opposite things about the detection, they feed tuning ' +
      'decisions, they are the channel from triage to detection engineering, and they separate two ' +
      'very different kinds of unhealthy queue. E is the attitude that makes triage data useless: ' +
      'the alert being closed is the least consequential thing about the closure, and the label is ' +
      'the part that still exists in six months when somebody is deciding which rules to keep.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats the closure category as paperwork with no downstream effect.',
      },
    ],
    debrief:
      'If your platform does not distinguish these, say so. Working without a benign true positive ' +
      'category means every correct detection of harmless activity is being recorded as a broken ' +
      'rule.\n\n' +
      'This is worth raising even when it feels like a small process complaint, because the harm it ' +
      'causes compounds silently: every wrongly-labelled closure nudges the reported false positive ' +
      'rate up a little, and eventually somebody who never read a single alert makes a decision to ' +
      'weaken a rule based on a number that was never accurate in the first place.',
    practice: [],
  },
  {
    id: 'triage.8.2',
    moduleId: '3.8',
    packageId: 'incident-triage',
    order: 2,
    title: 'Write the closure',
    kind: 'short-answer',
    goal: 'Leave a note that answers the next reader question without them reopening anything.',
    prompt:
      'You are closing the EICAR antivirus alert. In two or three sentences, write the closure ' +
      'comment.',
    teach: {
      concept:
        'A CLOSURE COMMENT is the short written note you attach when you close an alert, the actual ' +
        'sentence or two, not just the category dropdown, explaining what you found. A closure ' +
        'comment is read by somebody who was not there, usually months later, and usually because ' +
        'something else has gone wrong. It has to stand alone.\n\n' +
        'Three things make it stand alone. WHAT YOU ESTABLISHED, specifically: the file, the host, ' +
        'the account, whatever the concrete facts were. WHAT YOU CHECKED to establish it, so the ' +
        'reader knows how far the conclusion is supported and does not have to redo it. And THE ' +
        'CATEGORY WITH ITS REASON, in words, because the dropdown value alone does not explain ' +
        'itself.\n\n' +
        'Leave out anything you did not verify. "Probably a test" is a guess and reads as a fact ' +
        'six months later, so either check who put the file there or write that you did not. The ' +
        'best closure comments are boring, specific, and about a paragraph shorter than people ' +
        'expect. A good one here names EICAR as a harmless test file, says the detection worked, ' +
        'and closes it as a benign true positive rather than as a false positive.',
    },
    hints: [
      'Write for somebody reading it in six months with no memory of today.',
      'The category name alone does not explain itself. Say why in words.',
      'A good comment identifies the file as the EICAR test string, states that the detection and quarantine worked, and closes it as a benign true positive rather than a false positive.',
    ],
    solution:
      'The quarantined file is the EICAR test string, which is a harmless standard string used to ' +
      'verify that antivirus is working and contains no executable code. The detection and ' +
      'quarantine both behaved correctly, so this is a benign true positive rather than a false ' +
      'positive and the rule should not be tuned on the strength of it. I have not established who ' +
      'placed the file in the Downloads folder; if that matters it is worth a note to the user, ' +
      'but it does not change the disposition.',
    expectedOutput:
      'A comment identifying EICAR as a harmless test file, stating the detection worked, and ' +
      'closing as a benign true positive rather than a false positive.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['harmless', 'no executable', 'test string', 'standard string', 'not malicious'],
          ['detection worked', 'behaved correctly', 'quarantine', 'working', 'correctly detected'],
          ['benign true positive', 'not a false positive', 'true positive'],
        ],
        hint:
          'Three things: what the file actually is, that the detection did its job, and the ' +
          'category you are closing it as, stated in words.',
      },
    ],
    debrief:
      'The last sentence, admitting what you did not establish, is what makes the rest credible. ' +
      'Closures that only contain conclusions read as guesses.\n\n' +
      'This is the written form of the same discipline from Module 3.3\'s lesson on scope: naming the ' +
      'edge of what you actually know. A closure that states its conclusions but never says what was ' +
      'checked to reach them gives the next reader no way to tell a careful analysis from a hunch, ' +
      'and both look identical on the page.',
    practice: [],
  },
  {
    id: 'triage.8.3',
    moduleId: '3.8',
    packageId: 'incident-triage',
    order: 3,
    title: 'How triage output becomes better detection',
    kind: 'multiple-choice',
    goal: 'See the loop your closures feed, and what makes them useful to it.',
    prompt:
      'Detection engineering wants to improve the rules using triage data. Which of the following ' +
      'would genuinely help them? Select all that apply.',
    teach: {
      concept:
        'DETECTION ENGINEERING is the separate team, or sometimes the separate hat the same person ' +
        'wears, responsible for writing and improving the rules that produce alerts in the first ' +
        'place, as opposed to triage, which works the alerts those rules already produced. The ' +
        'improvement loop in a SOC runs on triage output, and it starves when the output is thin. ' +
        'Detection engineering cannot see the queue the way an operator does; what they can see is ' +
        'what operators recorded.\n\n' +
        'Four kinds of record are actually usable. Accurate categories, so the false positive rate ' +
        'per rule is real. A stated REASON for benign closures, because "this fires on the nightly ' +
        'batch" is a tuning specification and "false positive" is not. The specific field or ' +
        'condition that would have excluded the benign case, which is the single most valuable ' +
        'thing an operator can leave. And notes on near misses: alerts that were nearly closed and ' +
        'turned out to matter, which are the strongest possible evidence about where a rule sits ' +
        'relative to the line.\n\n' +
        'What does not help is volume without detail. A thousand alerts closed with no reason ' +
        'tells detection engineering that a rule is noisy and nothing about what to do, and the ' +
        'usual outcome is that the rule gets disabled rather than fixed.',
    },
    options: [
      { id: 'a', label: 'Categories applied accurately, so the false positive rate per rule reflects reality.' },
      { id: 'b', label: 'A stated reason on benign closures, such as which recurring job triggers it.' },
      { id: 'c', label: 'The specific condition that would have excluded the benign case without blinding the rule.' },
      { id: 'd', label: 'Notes on alerts that were nearly closed and turned out to matter.' },
      { id: 'e', label: 'A high volume of closures with no reason recorded, which at least shows the rule is noisy.' },
    ],
    hints: [
      'Four help. One provides a number and nothing actionable.',
      'Ask what detection engineering can actually change on the strength of each item.',
      'What usually happens to a rule that is known to be noisy and has no diagnosis?',
    ],
    solution:
      'A, B, C, and D. Accurate labels give a real rate, the reason gives a specification, the ' +
      'excluding condition is close to a finished change, and near misses tell you where the line ' +
      'actually is. E is the state most SOCs are in and it is worse than it looks: a rule known to ' +
      'be noisy with no diagnosis attached tends to get disabled, so uninformative closures do not ' +
      'just fail to improve detection, they actively cost coverage.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option offers a volume of undiagnosed closures. Ask what can be changed on the ' +
          'strength of that.',
      },
    ],
    debrief:
      'Option C is the one that will get you noticed. An operator who writes "excluding source ' +
      '10.20.9.40 would remove 80% of these without affecting external sources" has done detection ' +
      'engineering work from the triage seat.\n\n' +
      'The reason it stands out is that it hands detection engineering a finished, testable proposal ' +
      'instead of a complaint. Anyone can say a rule is noisy. Very few operators say exactly which ' +
      'field to exclude, and what proportion of the noise that single change would remove, and that ' +
      'specificity is what turns a triage note into work somebody else can act on the same day.',
    practice: [],
  },
  {
    id: 'triage.8.4',
    moduleId: '3.8',
    packageId: 'incident-triage',
    order: 4,
    title: 'What a wrong closure costs',
    kind: 'multiple-choice',
    goal: 'Weigh the two ways of being wrong, and know how each one gets discovered.',
    prompt:
      'Every operator closes something incorrectly eventually. Which of the following are accurate ' +
      'about the two ways of getting it wrong? Select all that apply.',
    teach: {
      concept:
        'This is the last exercise in the package, and it steps back to name the two ways every ' +
        'triage decision in this entire package can go wrong. Closing something real is a missed ' +
        'detection. Escalating something benign is a wasted investigation. Both are errors and they ' +
        'are not symmetrical, which is worth being explicit about rather than absorbing as anxiety.\n\n' +
        'The costs differ. A wasted escalation costs an analyst an hour and is discovered ' +
        'immediately, because somebody looks and finds nothing. A missed detection costs whatever ' +
        'the attacker does with the time and is discovered late or never, because nothing looks for ' +
        'it. That asymmetry is why triage guidance leans towards escalating when genuinely ' +
        'uncertain, and why an escalation budget exists to stop that leaning becoming a reflex.\n\n' +
        'The discovery asymmetry has a consequence people miss: you get feedback on your ' +
        'over-escalations and almost none on your misses. An operator can therefore feel they are ' +
        'improving while getting worse, because the only errors they hear about are the ones that ' +
        'were visible. That is what makes deliberate review of your own closed alerts, rather than ' +
        'waiting for feedback, the habit that actually improves judgement.',
    },
    options: [
      { id: 'a', label: 'A wasted escalation is discovered almost immediately; a missed detection often is not discovered at all.' },
      { id: 'b', label: 'The asymmetry is why guidance leans towards escalating under genuine uncertainty.' },
      { id: 'c', label: 'You receive feedback on over-escalations and almost none on misses, which can make you feel you are improving while getting worse.' },
      { id: 'd', label: 'Reviewing your own closed alerts is more reliable than waiting for feedback to arrive.' },
      { id: 'e', label: 'Since misses are rarely discovered, they are the less serious of the two errors.' },
    ],
    hints: [
      'Four are accurate. One confuses being unnoticed with being harmless.',
      'Ask how each error is found out, and how long that takes.',
      'If you only ever hear about one kind of mistake, what happens to your sense of how good you are?',
    ],
    solution:
      'A, B, C, and D. The errors differ in cost and in how they surface, the asymmetry justifies ' +
      'leaning towards escalation when genuinely unsure, the feedback you get is skewed towards ' +
      'your visible mistakes, and reviewing your own work is the only correction for that. E ' +
      'inverts the point: a miss being invisible is what makes it dangerous, not what makes it ' +
      'minor, and the incidents that end up in the news are almost always ones somebody closed.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats an error that is rarely discovered as an error that matters less.',
      },
    ],
    debrief:
      'Spend twenty minutes of a quiet shift rereading alerts you closed a fortnight ago. It is the ' +
      'only feedback loop on the half of your work nobody else checks.\n\n' +
      'That habit is a fitting place to end this package, because it is the same discipline every ' +
      'exercise before it has been building toward: not trusting a single signal, whether it is a ' +
      'severity label, a base rate, an AI assistant, or your own sense of how the shift went, without ' +
      'occasionally going back and checking it against what actually happened.',
    practice: [],
  },
];

export const INCIDENT_TRIAGE: LearningPackage = {
  id: 'incident-triage',
  order: 3,
  title: 'Incident Detection and Alert Triage',
  summary:
    'Work a real alert queue: mostly noise, some correct alerts about entirely ordinary activity, ' +
    'and an intrusion spread thinly across eight of them. Learn to find it without escalating ' +
    'everything, and to leave the queue smaller than you found it.',
  outcomes: [
    'Triage a full shift\'s alert queue and escalate only what warrants another analyst',
    'Tell a broken rule apart from a correct rule firing on authorised activity',
    'Correlate individually unremarkable alerts into a single actor\'s sequence',
    'Read severity and confidence as claims to be tested rather than facts',
    'Write disposition notes, escalations, and a handover that somebody else can act on',
  ],
  prerequisites: ['log-analysis'],
  modules: [
    {
      id: '3.1',
      packageId: 'incident-triage',
      order: 1,
      title: 'Reading a queue',
      summary:
        'What an alert actually asserts, why severity is unreliable, and what it costs to escalate.',
      exercises: MODULE_3_1,
    },
    {
      id: '3.2',
      packageId: 'incident-triage',
      order: 2,
      title: 'Noise and tuning',
      summary:
        'The rule that fires 288 times a day, the rule that has never once been right, and what to ' +
        'do about each.',
      exercises: MODULE_3_2,
    },
    {
      id: '3.3',
      packageId: 'incident-triage',
      order: 3,
      title: 'Correlation',
      summary:
        'Turning unremarkable alerts into one actor\'s sequence, and resisting timestamps that line ' +
        'up for no reason.',
      exercises: MODULE_3_3,
    },
    {
      id: '3.4',
      packageId: 'incident-triage',
      order: 4,
      title: 'A full shift',
      summary:
        'Eighty-two alerts, eight of them an intrusion, under an escalation budget. Then write the ' +
        'handover.',
      exercises: MODULE_3_4,
    },
    {
      id: '3.5',
      packageId: 'incident-triage',
      order: 5,
      title: 'Working with the copilot',
      summary:
        'The same queues again with an AI assistant attached -- one that is right about most alerts, ' +
        'wrong about a handful, and confident throughout.',
      exercises: MODULE_3_5,
    },
    {
      id: '3.6',
      packageId: 'incident-triage',
      order: 6,
      title: 'Reading the enrichment',
      summary:
        'What a history of false positives is worth, severity against confidence against history, ' +
        'reputation and allowlists, and the one line of context that can outweigh the counter.',
      exercises: MODULE_3_6,
    },
    {
      id: '3.7',
      packageId: 'incident-triage',
      order: 7,
      title: 'The alerts that are not logins',
      summary:
        'Malware, data loss, privileged cloud accounts and web scanning: four classes that each ' +
        'turn on a different question from the authentication habit.',
      exercises: MODULE_3_7,
    },
    {
      id: '3.8',
      packageId: 'incident-triage',
      order: 8,
      title: 'Closing well',
      summary:
        'Why the disposition taxonomy matters, writing a closure that stands alone, how triage ' +
        'output becomes better detection, and the two ways of being wrong.',
      exercises: MODULE_3_8,
    },
  ],
};
