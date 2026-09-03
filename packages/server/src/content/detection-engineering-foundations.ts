/**
 * Detection Engineering: turning an incident into a rule that survives contact.
 *
 * WHAT HAPPENED TO THIS FILE
 *
 * It began as five multiple-choice questions written against the Detection
 * Engineer role in roles.ts. The framing was right and the teaching prose is
 * kept almost verbatim below, but the assessment was definitional: asking
 * whether somebody had read the paragraph above the question, with distractors
 * nobody would pick. "Why hash an artefact" / "to compress it" tests reading,
 * not detection engineering.
 *
 * So the concepts stayed and the questions were rebuilt as work. A detection
 * rule IS a pattern plus a decision about what to do when it matches, and a
 * pattern is something you can write, run, count, and tune against real data.
 * The simulated host has 2,539 lines of authentication events, a rotated copy of
 * yesterday's, and a packet capture, which is enough to write a rule, measure
 * what it costs, tune it, and prove the tuning did not blind it.
 *
 * THE DECOY THAT MAKES THIS PACKAGE WORK
 *
 * 288 of the 718 failed passwords in auth.log come from an internal monitoring
 * host with a stale credential. It is the single loudest source in the log,
 * louder than the actual intrusion, and it is completely harmless. Every tuning
 * exercise here is built on it, because the central skill of this seat is
 * removing that kind of noise without removing the signal sitting next to it.
 *
 * ANSWERS
 *
 * Every count is derived from the generated logs. Nothing is typed in, so
 * regenerating the world cannot leave a stale answer key. See countAuth in
 * linux-fundamentals.ts for the same pattern.
 */

import type { Check, Exercise, LearningPackage, PracticeItem, PracticeTeach, Teach } from '@soc/shared';

import { AUTH_LOG } from '../vfs/data/generated.js';

const AUTH = '/var/log/auth.log';
const AUTH_ROTATED = '/var/log/auth.log.1';

const ATTACKER = '203.0.113.55';
const MONITOR = '10.20.9.40';

// --- the answer key, derived --------------------------------------------------

const LINES = AUTH_LOG.split('\n').filter((line) => line.trim() !== '');

const countWhere = (predicate: (line: string) => boolean) => LINES.filter(predicate).length;
const countText = (needle: string) => countWhere((line) => line.includes(needle));

/** What a rule matching only on the message text would fire on. */
const FAILED_TOTAL = countText('Failed password');

/** Of those, the ones that are the intrusion. */
const FAILED_ATTACKER = countWhere(
  (line) => line.includes('Failed password') && line.includes(ATTACKER),
);

/** Of those, the ones that are a monitoring box with an old password. */
const FAILED_MONITOR = countWhere(
  (line) => line.includes('Failed password') && line.includes(MONITOR),
);

/** What the same rule fires on once the known-benign source is excluded. */
const FAILED_TUNED = FAILED_TOTAL - FAILED_MONITOR;

const INVALID_USER = countText('Invalid user');
const ACCEPTED = countText('Accepted');
const ACCEPTED_ATTACKER = countWhere(
  (line) => line.includes('Accepted') && line.includes(ATTACKER),
);

/** Distinct addresses the naive rule would fire on. */
const FAILED_SOURCES = new Set(
  LINES.filter((line) => line.includes('Failed password')).flatMap((line) =>
    [...line.matchAll(/from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g)].map((match) => match[1]!),
  ),
).size;

/** Every address that appears anywhere in the log, benign or not. */
const ALL_SOURCES = new Set(
  LINES.flatMap((line) =>
    [...line.matchAll(/from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g)].map((match) => match[1]!),
  ),
).size;

/**
 * Precision: of everything the rule fires on, how much was the thing you wanted.
 *
 * Expressed as a percentage to one decimal place, because the point of these
 * exercises is the size of the change and not the third significant figure.
 */
const precision = (truePositives: number, fired: number) => ((truePositives / fired) * 100).toFixed(1);

const PRECISION_NAIVE = precision(FAILED_ATTACKER, FAILED_TOTAL);
const PRECISION_TUNED = precision(FAILED_ATTACKER, FAILED_TUNED);

// --- check helpers ------------------------------------------------------------

const numeric = (equals: number, hint: string): Check => ({ type: 'output-numeric', equals, hint });

const outHas = (text: string, hint?: string): Check => ({
  type: 'output-contains',
  text,
  hint: hint ?? `The output should include "${text}".`,
});

const outLacks = (text: string, hint: string): Check => ({ type: 'output-excludes', text, hint });

const drill = (
  id: string,
  prompt: string,
  teach: PracticeTeach,
  solution: string,
  checks: Check[],
): PracticeItem => ({ id, prompt, teach, solution, checks });

// --- teaching -----------------------------------------------------------------
//
// OUTPUT_TEACH, COST_TEACH and RIGOUR_TEACH are kept from the original file.
// They were the good half of it.

const OUTPUT_TEACH: Teach = {
  concept:
    'Detection engineering is the one seat whose work is preventive, not investigative. Everyone ' +
    'else on the floor handles what is in front of them; the detection engineer turns an incident ' +
    'nobody caught in time into a rule that catches the next one automatically. The deliverable is ' +
    'not a finding, it is a durable piece of logic that watches so a human does not have to. ' +
    'Stripped of the platform it runs on, that logic is a pattern and a decision: match these lines, ' +
    'and when you do, raise this. Everything else is plumbing.',
  syntax: 'grep -c "PATTERN" LOGFILE',
  examples: [
    {
      command: 'grep -c "session opened" /var/log/auth.log',
      explains: 'How many times a candidate pattern would have matched. This is the whole of a rule, before any platform gets involved.',
    },
    {
      command: 'grep -cE "sudo:.*COMMAND=" /var/log/auth.log',
      explains: 'A pattern with structure to it, which is what most real detections look like.',
    },
  ],
  flags: [
    { flag: 'grep -c', means: 'Count matching lines rather than printing them. The fire count of a rule.' },
    { flag: 'grep -E', means: 'Extended regular expressions, where alternation and grouping work.' },
  ],
};

const COST_TEACH: Teach = {
  concept:
    'Every rule has a cost, and it is paid in noise. A rule that fires constantly and is almost ' +
    'always nothing does not make the floor safer, it makes it deaf: the operators learn to dismiss ' +
    'that alert, and the one time it is real, it is dismissed too. A good detection is a balance ' +
    'between catching the thing and not drowning the queue, and a rule that ignores that balance is ' +
    'worse than no rule, because it trains people to stop looking. The number that captures this is ' +
    'precision: of everything the rule fired on, what fraction was the thing you wanted. A rule at ' +
    'twenty per cent precision is asking an operator to be wrong four times out of five.',
  syntax: 'grep "PATTERN" LOG | grep -c SOURCE',
  examples: [
    {
      command: 'grep "Invalid user" /var/log/auth.log | grep -c 192.0.2.44',
      explains: 'How much of one rule fires on one source, which is how you find out where its noise comes from.',
    },
  ],
  flags: [
    { flag: 'Fire count', means: 'How often the rule matches. How much work it creates.' },
    { flag: 'Precision', means: 'True positives divided by everything it fired on.' },
  ],
};

const RIGOUR_TEACH: Teach = {
  concept:
    'Two disciplines keep detections honest. Backtesting: before a rule ships, replay it over ' +
    'historical data to see what it would have caught and, just as important, how much noise it ' +
    'would have made. And coverage against technique: measure which attacker techniques you can see ' +
    'and which you cannot, so a blind spot shows up as a visible gap rather than as silence that ' +
    'feels like safety. A rule nobody backtested is a guess with a ticket queue attached.',
  syntax: 'grep -c "PATTERN" /var/log/auth.log.1',
  examples: [
    {
      command: 'grep -c "Accepted" /var/log/auth.log.1',
      explains: 'A different rule against yesterday, which is the cheapest backtest there is.',
    },
    {
      command: 'grep "Failed password" /var/log/auth.log | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn',
      explains: 'Fire count broken down by source, which is where a tuning decision comes from rather than a hunch.',
    },
  ],
  flags: [
    { flag: 'sort | uniq -c', means: 'Count occurrences of each distinct value. Needs a sort first.' },
    { flag: 'sort -rn', means: 'Sort numerically, largest first. Puts the noisiest source at the top.' },
  ],
};

// --- module de.1: a rule is a pattern and a decision ---------------------------

const MODULE_DE_1: Exercise[] = [
  {
    id: 'de.1.1',
    moduleId: 'de.1',
    packageId: 'detection-engineering-foundations',
    order: 1,
    title: 'What the seat produces',
    kind: 'multiple-choice',
    goal: 'Fix the one thing that makes this seat different: its output is preventive.',
    prompt: 'What is the primary output of a detection engineer?',
    teach: OUTPUT_TEACH,
    options: [
      { id: 'a', label: 'A triaged alert queue at the end of a shift.' },
      { id: 'b', label: 'A rule that catches the next occurrence of a threat automatically.' },
      { id: 'c', label: 'A preserved disk image for a case.' },
      { id: 'd', label: 'A patched server.' },
    ],
    hints: [
      'Every other seat handles what is in front of them. This one builds something for next time.',
      'The output watches so a human does not have to.',
      'Turning an incident nobody caught into a rule that catches the next one is the job.',
    ],
    solution:
      'B. Detection engineering is preventive: its deliverable is a durable rule that catches ' +
      'the next occurrence without a human looking. A triaged queue (A) is the operator, a disk ' +
      'image (C) is forensics, and a patched server (D) is the mitigation engineer.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Which of these keeps working after the person who made it goes home?',
      },
    ],
    debrief:
      'Everything after this exercise is that rule, written as a pattern you can run against real logs and count.',
    practice: [],
  },
  {
    id: 'de.1.2',
    moduleId: 'de.1',
    packageId: 'detection-engineering-foundations',
    order: 2,
    title: 'Write the rule and count what it fires on',
    kind: 'terminal',
    goal: 'Turn a detection idea into a pattern, and measure how often it would fire.',
    prompt:
      'The incident on this host began with password guessing over SSH. The obvious detection is ' +
      `"alert on a failed password". Count how many times that rule would have fired today, against ${AUTH}.`,
    teach: OUTPUT_TEACH,
    hints: [
      'sshd writes the text "Failed password" on every rejected attempt.',
      '`grep -c` counts matching lines instead of printing them.',
      `Write \`grep -c "Failed password" ${AUTH}\`.`,
    ],
    solution: `grep -c "Failed password" ${AUTH}`,
    expectedOutput: `${FAILED_TOTAL}`,
    checks: [
      numeric(FAILED_TOTAL, `The rule would fire ${FAILED_TOTAL} times in one day on one host.`),
    ],
    debrief: `${FAILED_TOTAL} alerts. On one host, in one day. Nobody is reading ${FAILED_TOTAL} alerts, so as written this rule produces nothing but a number on a dashboard.`,
    practice: [
      drill(
        'de.1.2-p1',
        `Count how many times a rule matching "Invalid user" would fire.`,
        {
          note: 'A different detection idea against the same log. "Invalid user" means the account did not exist at all, which is a stronger signal than a wrong password because a legitimate user rarely mistypes their own username hundreds of times.',
          syntax: 'grep -c "PATTERN" LOGFILE',
        },
        `grep -c "Invalid user" ${AUTH}`,
        [numeric(INVALID_USER, `${INVALID_USER} lines mention an invalid user.`)],
      ),
      drill(
        'de.1.2-p2',
        'Count how many times a rule on successful authentication would fire.',
        {
          note: 'Nine. A rule on success is almost silent, and that is what makes it valuable: nine lines can be read by a person every morning. Detections do not have to be clever to be good, they have to be readable.',
          syntax: 'grep -c "PATTERN" LOGFILE',
        },
        `grep -c "Accepted" ${AUTH}`,
        [numeric(ACCEPTED, `${ACCEPTED} successful authentications.`)],
      ),
      drill(
        'de.1.2-p3',
        'Count what a rule matching either a failed password or an invalid user would fire on.',
        {
          note: 'Alternation with `grep -E` and a pipe character. Combining two patterns into one rule is common and it is also how a rule quietly doubles its own noise: the total here is larger than either pattern alone.',
          syntax: 'grep -cE "PATTERN A|PATTERN B" LOGFILE',
        },
        `grep -cE "Failed password|Invalid user" ${AUTH}`,
        [
          {
            type: 'output-numeric',
            equals: countWhere(
              (line) => line.includes('Failed password') || line.includes('Invalid user'),
            ),
            hint: 'Use `grep -E` with a pipe between the two patterns.',
          },
        ],
      ),
      drill(
        'de.1.2-p4',
        'Count how many times a rule on sudo usage would fire.',
        {
          note: 'Privilege escalation is worth watching and it is also routine administration, so this rule sits in the awkward middle: quiet enough to read, common enough that most of it is somebody doing their job.',
          syntax: 'grep -c "PATTERN" LOGFILE',
        },
        `grep -c "sudo:" ${AUTH}`,
        [numeric(countText('sudo:'), `${countText('sudo:')} sudo lines.`)],
      ),
      drill(
        'de.1.2-p5',
        'Count how many distinct source addresses appear anywhere in the log.',
        {
          note: 'Pull every "from <address>" out with `grep -oE`, deduplicate with `sort -u`, and count. This is the population your rule is firing across, and knowing it stops you concluding that a rule which fires on one address is broad.',
          syntax: 'grep -oE "from [0-9.]+" LOG | sort -u | wc -l',
        },
        `grep -oE "from [0-9.]+" ${AUTH} | sort -u | wc -l`,
        [numeric(ALL_SOURCES, `${ALL_SOURCES} distinct addresses appear in the log.`)],
      ),
    ],
  },
  {
    id: 'de.1.3',
    moduleId: 'de.1',
    packageId: 'detection-engineering-foundations',
    order: 3,
    title: 'How much of that was the incident',
    kind: 'terminal',
    goal: 'Measure the true positives inside a rule fire count.',
    prompt:
      `The intrusion came from ${ATTACKER}. Of all the failed passwords the rule matched, count how ` +
      'many came from that address.',
    teach: COST_TEACH,
    hints: [
      'Filter to the rule first, then narrow to the source.',
      'Two greps chained with a pipe: one for the pattern, one for the address.',
      `Write \`grep "Failed password" ${AUTH} | grep -c ${ATTACKER}\`.`,
    ],
    solution: `grep "Failed password" ${AUTH} | grep -c ${ATTACKER}`,
    expectedOutput: `${FAILED_ATTACKER}`,
    checks: [
      numeric(FAILED_ATTACKER, `${FAILED_ATTACKER} of the failed passwords came from the attacker.`),
      { type: 'command-uses-pipe', hint: 'Match the rule pattern first, then narrow by source.' },
    ],
    debrief: `${FAILED_ATTACKER} true positives out of ${FAILED_TOTAL} alerts. That is ${PRECISION_NAIVE} per cent precision: an operator working this rule is wrong roughly three times out of four.`,
    practice: [
      drill(
        'de.1.3-p1',
        `Count how many "Invalid user" lines came from ${ATTACKER}.`,
        {
          note: 'The same measurement on the other pattern. Comparing the two tells you which rule concentrates more of the attacker into fewer alerts, which is the question a tuning decision actually turns on.',
          syntax: 'grep "PATTERN" LOG | grep -c ADDRESS',
        },
        `grep "Invalid user" ${AUTH} | grep -c ${ATTACKER}`,
        [
          numeric(
            countWhere((line) => line.includes('Invalid user') && line.includes(ATTACKER)),
            'Filter to the pattern, then count the attacker lines.',
          ),
        ],
      ),
      drill(
        'de.1.3-p2',
        `Count how many successful authentications came from ${ATTACKER}.`,
        {
          note: 'Two. This is the single most important number in the whole log, and a rule that fires ' +
            `${FAILED_TOTAL} times a day buried it. A rule on success from an external address would have ` +
            'surfaced it on its own.',
          syntax: 'grep "Accepted" LOG | grep -c ADDRESS',
        },
        `grep "Accepted" ${AUTH} | grep -c ${ATTACKER}`,
        [numeric(ACCEPTED_ATTACKER, `${ACCEPTED_ATTACKER} successful logins from that address.`)],
      ),
      drill(
        'de.1.3-p3',
        `Count how many failed passwords came from the monitoring host ${MONITOR}.`,
        {
          note: 'More than the attacker produced. An internal box with a stale credential is the loudest thing in this log, and it is the reason the next module exists.',
          syntax: 'grep "PATTERN" LOG | grep -c ADDRESS',
        },
        `grep "Failed password" ${AUTH} | grep -c ${MONITOR}`,
        [numeric(FAILED_MONITOR, `${FAILED_MONITOR} failed passwords from the monitoring host.`)],
      ),
      drill(
        'de.1.3-p4',
        'Count the distinct source addresses the failed-password rule fires on.',
        {
          note: 'Thirteen sources, one of which is the incident. A rule spread thinly across many sources is one an operator cannot triage by looking, which is a design problem rather than a tuning problem.',
          syntax: 'grep "PATTERN" LOG | grep -oE "from [0-9.]+" | sort -u | wc -l',
        },
        `grep "Failed password" ${AUTH} | grep -oE "from [0-9.]+" | sort -u | wc -l`,
        [numeric(FAILED_SOURCES, `${FAILED_SOURCES} distinct sources trigger the rule.`)],
      ),
      drill(
        'de.1.3-p5',
        'Show the five noisiest sources for the failed-password rule, with their counts.',
        {
          note: 'The whole tuning decision on one screen: extract the source, `sort`, `uniq -c` to count each, then `sort -rn` to put the loudest first. Whatever sits at the top of this list is where your rule spends its budget.',
          syntax: 'grep "PATTERN" LOG | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 5',
        },
        `grep "Failed password" ${AUTH} | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 5`,
        [
          { type: 'output-line-count', count: 5, hint: 'Five lines, the noisiest first.' },
          outHas(MONITOR, 'The monitoring host should be at the top of the list.'),
        ],
      ),
    ],
  },
  {
    id: 'de.1.4',
    moduleId: 'de.1',
    packageId: 'detection-engineering-foundations',
    order: 4,
    title: 'The cost of a noisy rule',
    kind: 'multiple-choice',
    goal: 'Weigh a rule catch rate against the noise it makes.',
    prompt:
      `Your failed-password rule fires ${FAILED_TOTAL} times a day on this host, and ${FAILED_ATTACKER} ` +
      'of those are the intrusion you care about. What is the honest assessment?',
    teach: COST_TEACH,
    options: [
      { id: 'a', label: 'It works: it caught the intrusion, which is what a detection is for.' },
      { id: 'b', label: 'It is unusable as written: nobody triages that volume, so the true positives are never read.' },
      { id: 'c', label: 'The volume itself trains operators to dismiss this alert, including when it is real.' },
      { id: 'd', label: 'It should be deleted, since it is wrong most of the time.' },
      { id: 'e', label: 'Raising its severity would help operators find the real ones.' },
    ],
    hints: [
      'Two of these five are true. One is technically correct and useless in practice.',
      'What happens to an operator who works the same alert several hundred times?',
      'Does changing the severity change how many there are?',
    ],
    solution:
      'B and C. The rule does technically contain the intrusion, which is why A is the seductive ' +
      `wrong answer: ${FAILED_ATTACKER} true positives that nobody will ever reach are worth nothing. ` +
      'The volume makes it unusable (B) and actively harmful, because an operator who dismisses this ' +
      'alert several hundred times learns to dismiss it (C). D over-reaches: the signal is real and ' +
      'the rule needs tuning, not deleting. E changes the label on the noise without changing the ' +
      'amount of it, which is the most common non-fix in this job.',
    expectedOutput: 'Options B and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b', 'c'],
        hint:
          'One option calls a rule good because the answer is technically inside it. One throws away real signal. One relabels the noise instead of reducing it.',
      },
    ],
    debrief:
      'Severity inflation is the standard response to this problem and it never works, because the operator cost is a function of volume and severity does not change volume.',
    practice: [],
  },
  {
    id: 'de.1.5',
    moduleId: 'de.1',
    packageId: 'detection-engineering-foundations',
    order: 5,
    title: 'What makes a good detection',
    kind: 'short-answer',
    goal: 'State the trade-off a detection engineer is actually managing.',
    prompt:
      'In four or five sentences, say what makes a detection good. Use the numbers you have just ' +
      `measured on this host: a rule firing ${FAILED_TOTAL} times with ${FAILED_ATTACKER} true ` +
      'positives, against a rule on successful authentication that fires nine times. Say what you ' +
      'would ship and why.',
    teach: COST_TEACH,
    hints: [
      'A good detection is not the one that catches the most. It is the one somebody can act on.',
      'What does an operator do with nine alerts, and what do they do with seven hundred?',
      'Is a quiet rule that catches one thing worth more than a loud rule that catches the same thing?',
    ],
    solution:
      'A good detection catches the thing and produces a volume a person can actually work. The ' +
      `failed-password rule contains the intrusion, but at ${FAILED_TOTAL} alerts a day on one host ` +
      'nobody reaches the true positives, and the operators learn to dismiss it, so in practice it ' +
      'catches nothing. The success rule fires nine times, which one person can read every morning, ' +
      `and two of those nine are the attacker getting in. I would ship the quiet rule: precision ` +
      'matters more than recall when the recall is theoretical, because an alert nobody reads has ' +
      'not detected anything. The loud rule is worth keeping as context you can pivot into once ' +
      'something else has told you where to look, not as something that pages a human.',
    expectedOutput:
      'An answer that weighs volume against catch rate, names what an operator can actually work, and commits to shipping something.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['volume', 'noise', 'too many', 'hundreds', 'quantity', 'fires'],
          ['dismiss', 'ignore', 'fatigue', 'deaf', 'stop looking', 'never read', 'unread'],
          ['precision', 'true positive', 'accurate', 'signal', 'quiet', 'nine'],
          ['ship', 'would use', 'prefer', 'choose', 'keep'],
        ],
        hint:
          'Cover four things: the volume problem, what volume does to the operator, why the quieter rule is worth more, and which one you would actually ship.',
      },
    ],
    debrief:
      'Recall that nobody can act on is not recall. This is the judgement the seat exists to make, and it is why detection engineering is a separate job from writing the query.',
    practice: [],
  },
];

// --- module de.2: tuning without going blind -----------------------------------

const MODULE_DE_2: Exercise[] = [
  {
    id: 'de.2.1',
    moduleId: 'de.2',
    packageId: 'detection-engineering-foundations',
    order: 1,
    title: 'Exclude the known-benign source',
    kind: 'terminal',
    goal: 'Cut a rule fire count by removing one accountable source.',
    prompt:
      `The loudest source in the failed-password rule is ${MONITOR}, the monitoring host, which has ` +
      'been authenticating with a stale password for weeks. Somebody owns it and it is not an ' +
      'incident. Count what the rule fires on once that source is excluded.',
    teach: {
      concept:
        'Tuning is subtraction with a justification attached. `grep -v` inverts a match, so chaining ' +
        'it after your rule pattern is the shell equivalent of an exclusion in a detection platform. ' +
        'The justification matters more than the syntax: an exclusion is a promise that you will ' +
        'never see this thing again, and it needs to name something that is accountable rather than ' +
        'something that is merely frequent. "This internal host has a known stale credential and a ' +
        'ticket open" is accountable. "This address is noisy" is not.',
      syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | wc -l',
      examples: [
        {
          command: 'grep "Invalid user" /var/log/auth.log | grep -v 192.0.2.44 | wc -l',
          explains: 'The same shape against a different pattern and source, which is how you test an exclusion before committing to it.',
        },
        {
          command: 'grep "sudo:" /var/log/auth.log | grep -v "session closed" | wc -l',
          explains: 'Excluding on message text rather than on a source, which is usually the safer of the two.',
        },
      ],
      flags: [
        { flag: 'grep -v', means: 'Print lines that do NOT match. An exclusion.' },
        { flag: '| wc -l', means: 'Count what survived, which is the tuned fire count.' },
      ],
    },
    hints: [
      'Match the rule pattern first, then invert a match on the monitoring address.',
      '`grep -v` is the inverting one.',
      `Write \`grep "Failed password" ${AUTH} | grep -v ${MONITOR} | wc -l\`.`,
    ],
    solution: `grep "Failed password" ${AUTH} | grep -v ${MONITOR} | wc -l`,
    expectedOutput: `${FAILED_TUNED}`,
    checks: [
      numeric(FAILED_TUNED, `${FAILED_TUNED} alerts survive the exclusion, down from ${FAILED_TOTAL}.`),
      { type: 'command-uses-pipe', hint: 'Pattern, then exclusion, then count.' },
    ],
    debrief: `${FAILED_TOTAL} down to ${FAILED_TUNED}, from one exclusion, on one host. Precision went from ${PRECISION_NAIVE} per cent to ${PRECISION_TUNED} per cent without touching the detection logic at all.`,
    practice: [
      drill(
        'de.2.1-p1',
        `Count the failed passwords with the monitoring host excluded, then narrow to ${ATTACKER} to check the attacker survived.`,
        {
          note: 'The number that has to stay the same. Every exclusion should be followed by this check, because an exclusion that quietly removed the thing you were detecting is the worst outcome available and it looks exactly like success.',
          syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | grep -c ADDRESS',
        },
        `grep "Failed password" ${AUTH} | grep -v ${MONITOR} | grep -c ${ATTACKER}`,
        [numeric(FAILED_ATTACKER, `Still ${FAILED_ATTACKER}. The exclusion cost nothing.`)],
      ),
      drill(
        'de.2.1-p2',
        'Count what survives if you exclude the two noisiest sources instead of one.',
        {
          note: `Chain a second \`grep -v\`. Watch the fire count fall further, and then ask what you just did: the second noisiest source is the intrusion, so this exclusion buys quiet by deleting the detection.`,
          syntax: 'grep "PATTERN" LOG | grep -v A | grep -v B | wc -l',
        },
        `grep "Failed password" ${AUTH} | grep -v ${MONITOR} | grep -v ${ATTACKER} | wc -l`,
        [
          numeric(
            FAILED_TUNED - FAILED_ATTACKER,
            'Both exclusions applied. Notice what this number cost you.',
          ),
        ],
      ),
      drill(
        'de.2.1-p3',
        'Count the invalid-user lines with the monitoring host excluded.',
        {
          note: 'The same exclusion on a different rule barely changes anything, because the monitoring host authenticates as a real account. An exclusion is specific to the rule it sits on, and copying it across rules is how exclusions spread past their justification.',
          syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | wc -l',
        },
        `grep "Invalid user" ${AUTH} | grep -v ${MONITOR} | wc -l`,
        [
          numeric(
            countWhere((line) => line.includes('Invalid user') && !line.includes(MONITOR)),
            'Invalid user lines, monitoring host excluded.',
          ),
        ],
      ),
      drill(
        'de.2.1-p4',
        'Count the failed passwords from internal 10.x addresses only.',
        {
          note: 'Sizing the exclusion before you write it. Knowing how much of a rule comes from inside your own network tells you whether a broad internal exclusion is a small tidy-up or a hole you could drive an insider through.',
          syntax: 'grep "PATTERN" LOG | grep -c "from 10\\."',
        },
        `grep "Failed password" ${AUTH} | grep -c "from 10\\."`,
        [
          numeric(
            countWhere((line) => line.includes('Failed password') && /from 10\./.test(line)),
            'Failed passwords from internal addresses.',
          ),
        ],
      ),
      drill(
        'de.2.1-p5',
        'Show the noisiest sources again with the monitoring host already excluded.',
        {
          note: 'Re-running the ranking after a tuning pass is the loop this job actually runs in: exclude, re-rank, look at the new top entry, decide whether it is accountable. Stop when the top entry is something you would want to be woken for.',
          syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 3',
        },
        `grep "Failed password" ${AUTH} | grep -v ${MONITOR} | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 3`,
        [
          { type: 'output-line-count', count: 3, hint: 'Three lines.' },
          outHas(ATTACKER, 'With the monitoring host gone, the attacker is now at the top.'),
          outLacks(MONITOR, 'The monitoring host should be excluded.'),
        ],
      ),
    ],
  },
  {
    id: 'de.2.2',
    moduleId: 'de.2',
    packageId: 'detection-engineering-foundations',
    order: 2,
    title: 'Prove the tuning did not blind you',
    kind: 'terminal',
    goal: 'Regression-test an exclusion against the incident it must still catch.',
    prompt:
      'An exclusion is only safe if the thing you were detecting still gets through it. With the ' +
      `monitoring host excluded, count how many failed passwords from ${ATTACKER} still reach the rule.`,
    teach: {
      concept:
        'Every exclusion needs a regression test, and the test is the incident that made you write ' +
        'the rule. Run the tuned rule against the known-bad and confirm the count is unchanged. This ' +
        'is the discipline that separates tuning from suppression: both make the queue quieter, and ' +
        'only one of them still detects anything. In a real platform this is a saved detection test ' +
        'that runs on every change to the rule, for exactly the reason you are about to see.',
      syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | grep -c KNOWN_BAD',
      examples: [
        {
          command: 'grep "Invalid user" /var/log/auth.log | grep -v 10.20.9.40 | grep -c 203.0.113.12',
          explains: 'The same regression check against a different known-bad source.',
        },
      ],
      flags: [
        { flag: 'Before and after', means: 'The true-positive count must not move when you tune.' },
      ],
    },
    hints: [
      'Three stages: the rule pattern, the exclusion, then the count of the known-bad source.',
      'The number should match what you measured before you tuned anything.',
      `Write \`grep "Failed password" ${AUTH} | grep -v ${MONITOR} | grep -c ${ATTACKER}\`.`,
    ],
    solution: `grep "Failed password" ${AUTH} | grep -v ${MONITOR} | grep -c ${ATTACKER}`,
    expectedOutput: `${FAILED_ATTACKER}`,
    checks: [
      numeric(
        FAILED_ATTACKER,
        `Still ${FAILED_ATTACKER}, unchanged by the exclusion. That is what makes the tuning safe.`,
      ),
    ],
    debrief: `Unchanged at ${FAILED_ATTACKER}. The rule got ${FAILED_MONITOR} alerts quieter and lost nothing, which is the only kind of tuning worth shipping.`,
    practice: [
      drill(
        'de.2.2-p1',
        `Run the same regression against the successful-login rule: with the monitoring host excluded, how many "Accepted" lines from ${ATTACKER} remain?`,
        {
          note: 'A regression test on a second rule. The number should be the same as before, because the exclusion has nothing to do with this pattern, and confirming that is how you show a tuning change did not have side effects elsewhere.',
          syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | grep -c KNOWN_BAD',
        },
        `grep "Accepted" ${AUTH} | grep -v ${MONITOR} | grep -c ${ATTACKER}`,
        [numeric(ACCEPTED_ATTACKER, `Still ${ACCEPTED_ATTACKER}.`)],
      ),
      drill(
        'de.2.2-p2',
        `Show that excluding all of 203.0.113 would break the detection: count the attacker failures that survive it.`,
        {
          note: 'Zero. An exclusion written as a whole /24 because "that range is noisy" removes the incident completely, and the queue gets quieter, and the dashboard looks better. This is what suppression dressed as tuning looks like from the inside.',
          syntax: 'grep "PATTERN" LOG | grep -v PREFIX | grep -c KNOWN_BAD',
        },
        `grep "Failed password" ${AUTH} | grep -v "203.0.113" | grep -c ${ATTACKER}`,
        [numeric(0, 'Zero. The exclusion removed the thing the rule existed to find.')],
      ),
      drill(
        'de.2.2-p3',
        'Count what that over-broad exclusion would leave the rule firing on.',
        {
          note: 'Far quieter than the safe tuning, and blind. Put this number next to the previous drill and you have the argument you need when somebody asks why the noisy version is still running.',
          syntax: 'grep "PATTERN" LOG | grep -v PREFIX | wc -l',
        },
        `grep "Failed password" ${AUTH} | grep -v "203.0.113" | wc -l`,
        [
          numeric(
            countWhere((line) => line.includes('Failed password') && !line.includes('203.0.113')),
            'The over-broad exclusion applied.',
          ),
        ],
      ),
      drill(
        'de.2.2-p4',
        'Count the invalid-user lines that survive excluding the monitoring host and still come from the attacker.',
        {
          note: 'The regression test applied to the second candidate rule. Doing this for every rule an exclusion touches is tedious and it is the job: an exclusion added to a shared list affects rules whose authors are not in the room.',
          syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | grep -c KNOWN_BAD',
        },
        `grep "Invalid user" ${AUTH} | grep -v ${MONITOR} | grep -c ${ATTACKER}`,
        [
          numeric(
            countWhere(
              (line) =>
                line.includes('Invalid user') && !line.includes(MONITOR) && line.includes(ATTACKER),
            ),
            'Attacker invalid-user lines surviving the exclusion.',
          ),
        ],
      ),
      drill(
        'de.2.2-p5',
        'Confirm the tuned rule still contains the moment the attacker got in, by finding accepted logins from that address.',
        {
          note: 'The last regression worth running: not "does the rule still fire" but "does it still contain the event that mattered". A rule can keep its fire count and lose the one line somebody will need in the timeline.',
          syntax: 'grep "Accepted" LOG | grep ADDRESS',
        },
        `grep "Accepted" ${AUTH} | grep ${ATTACKER}`,
        [
          { type: 'output-line-count', count: ACCEPTED_ATTACKER, hint: `${ACCEPTED_ATTACKER} lines.` },
          outHas(ATTACKER, 'The attacker address should be on every line.'),
        ],
      ),
    ],
  },
  {
    id: 'de.2.3',
    moduleId: 'de.2',
    packageId: 'detection-engineering-foundations',
    order: 3,
    title: 'The exclusion that hides the incident',
    kind: 'multiple-choice',
    goal: 'Tell a tuning change from a suppression, when both make the queue quieter.',
    prompt:
      'Four exclusions are proposed for the failed-password rule. All four reduce the alert volume. ' +
      'Which of them are safe to ship? Select all that apply.',
    teach: {
      concept:
        'Tuning and suppression are indistinguishable on a dashboard: both make the number go down, ' +
        'and the person who shipped either gets thanked. The difference is whether the thing removed ' +
        'is accountable. An exclusion should name something somebody owns, can explain, and would ' +
        'notice if it changed. Excluding a source because it is noisy, or a range because most of it ' +
        'is scanners, removes a category rather than a known quantity, and categories are where ' +
        'attackers live. The regression test is the only thing that tells the two apart before ' +
        'production does.',
      examples: [
        {
          command: 'exclude host 10.20.9.40, ticket OPS-4412, stale credential, owner known',
          explains: 'Accountable. Somebody owns it, there is a record, and it will be fixed.',
        },
        {
          command: 'exclude 203.0.113.0/24, reason: mostly scanners',
          explains: 'A category, not a quantity. Anything that moves into that range becomes invisible.',
        },
      ],
    },
    options: [
      { id: 'a', label: `Exclude ${MONITOR}: an owned internal host with a stale credential and a ticket open.` },
      { id: 'b', label: 'Exclude the whole 203.0.113.0/24 range, since most traffic from it is scanning.' },
      { id: 'c', label: 'Exclude failed passwords for accounts that do not exist, since those are just bots.' },
      { id: 'd', label: 'Exclude any source that produced more than 100 alerts today, since that volume is clearly automated.' },
    ],
    hints: [
      'Only one of these is safe. For each, ask what an attacker would have to do to hide behind it.',
      'Two of them exclude a category rather than a specific accountable thing.',
      'One of them excludes precisely the behaviour that started this incident.',
    ],
    solution:
      'A only. It names one host, somebody owns it, there is a ticket, and a regression test shows ' +
      `the ${FAILED_ATTACKER} attacker alerts survive it. B removes an entire range and this ` +
      'intrusion came from inside it, so it would have hidden the incident completely. C excludes ' +
      'guessing at accounts that do not exist, which is exactly what the attacker did before they ' +
      'found one that did. D is the worst of the four despite sounding the most principled: it is a ' +
      'rule that automatically hides anything loud, so an attacker only has to be noisy enough to ' +
      'become invisible.',
    expectedOutput: 'Option A selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a'],
        hint:
          'For each option ask: does it name one accountable thing, or a category? And what would an attacker do to end up inside that category?',
      },
    ],
    debrief:
      'Option D is real and it gets built, usually as an automatic suppression on high-volume sources. It is a rule that rewards attackers for being loud.',
    practice: [],
  },
  {
    id: 'de.2.4',
    moduleId: 'de.2',
    packageId: 'detection-engineering-foundations',
    order: 4,
    title: 'Tune by pattern, not by source',
    kind: 'terminal',
    goal: 'Improve precision by narrowing the logic instead of excluding sources.',
    prompt:
      'Excluding sources does not scale: there is always another noisy one. The alternative is a ' +
      'narrower pattern. Count how many lines match "Invalid user", which fires only when the ' +
      'account being guessed does not exist at all.',
    teach: {
      concept:
        'An exclusion list grows forever and has to be maintained by somebody who remembers why each ' +
        'entry is there. A narrower pattern does not. Where you can improve precision by matching ' +
        'something more specific, do that instead: it needs no maintenance, it does not go stale, and ' +
        'nobody has to be told why it is there. Here, "Invalid user" is stronger evidence than a ' +
        'failed password, because a real user occasionally mistypes their password and essentially ' +
        'never mistypes their own username hundreds of times.',
      syntax: 'grep -c "NARROWER PATTERN" LOG',
      examples: [
        {
          command: 'grep -c "Failed password for root" /var/log/auth.log',
          explains: 'Narrowing to one account, which is a common way to make an authentication rule specific without excluding anybody.',
        },
        {
          command: 'grep -cE "Failed password for (root|admin|test)" /var/log/auth.log',
          explains: 'Narrowing to a set of accounts nobody should be logging in as remotely.',
        },
      ],
      flags: [
        { flag: 'Narrower pattern', means: 'No maintenance, no exclusion list, no stale entries.' },
        { flag: 'Exclusion list', means: 'Needs an owner, a reason per entry, and a review that never happens.' },
      ],
    },
    hints: [
      'One pattern, one count.',
      'The text sshd writes is "Invalid user".',
      `Write \`grep -c "Invalid user" ${AUTH}\`.`,
    ],
    solution: `grep -c "Invalid user" ${AUTH}`,
    expectedOutput: `${INVALID_USER}`,
    checks: [numeric(INVALID_USER, `${INVALID_USER} lines match the narrower pattern.`)],
    debrief: `${INVALID_USER} against ${FAILED_TOTAL}, with no exclusion list to maintain, and the monitoring host disappears from it on its own because it authenticates as a real account.`,
    practice: [
      drill(
        'de.2.4-p1',
        `Check whether the monitoring host appears in the invalid-user rule at all.`,
        {
          note: 'It does not, or barely. The narrower pattern excluded the noisiest source without anybody writing an exclusion, which is the entire argument for tuning the logic rather than maintaining a list.',
          syntax: 'grep "PATTERN" LOG | grep -c ADDRESS',
        },
        `grep "Invalid user" ${AUTH} | grep -c ${MONITOR}`,
        [
          numeric(
            countWhere((line) => line.includes('Invalid user') && line.includes(MONITOR)),
            'Count the monitoring host inside the narrower rule.',
          ),
        ],
      ),
      drill(
        'de.2.4-p2',
        'Count failed passwords aimed specifically at the root account.',
        {
          note: 'Narrowing by account rather than by source. On a properly configured host, remote root login is disabled entirely, so any attempt at it is worth an alert on its own regardless of who sent it.',
          syntax: 'grep -c "PATTERN" LOG',
        },
        `grep -c "Failed password for root" ${AUTH}`,
        [
          numeric(
            countText('Failed password for root'),
            'Match the whole phrase including the account name.',
          ),
        ],
      ),
      drill(
        'de.2.4-p3',
        'Count attempts against exactly root, admin or test using alternation, not accounts that merely contain those words.',
        {
          note: 'A rule keyed on a set of accounts nobody should be authenticating as remotely. The word boundary matters: this host also logs a "testuser" account, and a rule meant to catch "test" should not silently start matching every account that happens to contain those letters. This is precision bought with domain knowledge rather than with data, and it is the kind that survives a change in the traffic.',
          syntax: 'grep -cE "PATTERN (a|b|c)\\b" LOG',
        },
        `grep -cE "Failed password for (root|admin|test)\\b" ${AUTH}`,
        [
          {
            type: 'output-numeric',
            equals: LINES.filter((line) => /Failed password for (root|admin|test)\b/.test(line))
              .length,
            hint: 'Use `grep -E` with a bracketed alternation after the account word, anchored with `\\b` so it does not also match "testuser".',
          },
        ],
      ),
      drill(
        'de.2.4-p4',
        'Count invalid-user attempts that came from outside the internal network.',
        {
          note: 'Combining a narrow pattern with a direction. Internal invalid-user attempts are usually a misconfigured script; external ones are somebody who does not know your account names, which is a different thing entirely.',
          syntax: 'grep "PATTERN" LOG | grep -vc "from 10\\."',
        },
        `grep "Invalid user" ${AUTH} | grep -vc "from 10\\."`,
        [
          numeric(
            countWhere((line) => line.includes('Invalid user') && !/from 10\./.test(line)),
            'Invalid-user lines whose source is not internal.',
          ),
        ],
      ),
      drill(
        'de.2.4-p5',
        'List the distinct accounts that were guessed at, with counts, top five.',
        {
          note: 'Extract the username after "Invalid user", count each, rank them. The result is an attacker wordlist, and it is worth keeping: the same list turns up on the next host, and a rule keyed on those names is quieter than one keyed on failure.',
          syntax: 'grep -oE "Invalid user [a-z]+" LOG | sort | uniq -c | sort -rn | head -n 5',
        },
        `grep -oE "Invalid user [a-z]+" ${AUTH} | sort | uniq -c | sort -rn | head -n 5`,
        [
          { type: 'output-line-count', count: 5, hint: 'Five accounts, the most-guessed first.' },
          outHas('Invalid user', 'Each line should show the matched phrase and its count.'),
        ],
      ),
    ],
  },
  {
    id: 'de.2.5',
    moduleId: 'de.2',
    packageId: 'detection-engineering-foundations',
    order: 5,
    title: 'Report the change honestly',
    kind: 'short-answer',
    goal: 'Write the change note that lets somebody else audit a tuning decision.',
    prompt:
      `You are shipping the exclusion of ${MONITOR} from the failed-password rule. Write the change ` +
      'note, in four or five sentences. Include the before and after fire counts, what you did to ' +
      'prove the detection still works, and what would make this exclusion wrong in future.',
    teach: {
      concept:
        'An exclusion outlives the person who wrote it. Six months on, somebody finds a rule not ' +
        'firing on something it obviously should, traces it to an exclusion, and has to decide ' +
        'whether removing it is safe with no idea why it was added. The change note is what makes ' +
        'that decision possible: the numbers before and after, the regression that proved the ' +
        'detection survived, and the condition under which the exclusion stops being valid. That last ' +
        'part is the one everybody omits, and it is the one that turns an exclusion from permanent ' +
        'into reviewable.',
      examples: [
        {
          command: 'Before 718, after 430, true positives unchanged at 189',
          explains: 'Three numbers that let a reviewer check the claim rather than take it on trust.',
        },
        {
          command: 'Invalid once OPS-4412 closes and the credential is rotated',
          explains: 'The expiry condition. Without one, the exclusion is permanent by default.',
        },
      ],
    },
    hints: [
      'Give the numbers: what it fired before, what it fires now, and what the true-positive count did.',
      'Say what you ran to prove the detection still catches the intrusion.',
      'When should somebody delete this exclusion?',
    ],
    solution:
      `Excluded ${MONITOR} from the failed-password rule. The rule fired ${FAILED_TOTAL} times today ` +
      `before the change and ${FAILED_TUNED} after, a reduction of ${FAILED_MONITOR} alerts, all of ` +
      'them from one internal monitoring host authenticating with a credential that has been stale ' +
      `for weeks. I regression-tested against the known intrusion from ${ATTACKER}: it produced ` +
      `${FAILED_ATTACKER} matching lines before the exclusion and ${FAILED_ATTACKER} after, so the ` +
      `detection is unchanged and precision moves from about ${PRECISION_NAIVE} per cent to about ` +
      `${PRECISION_TUNED} per cent. This exclusion becomes wrong the moment that credential is ` +
      'rotated or the host is rebuilt, because after that any failed password from it is no longer ' +
      'explained, so it should be removed when the owning ticket closes rather than left in place.',
    expectedOutput:
      'A note carrying the before and after counts, the regression evidence, and the condition that would invalidate the exclusion.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['718', 'before', 'previously', 'was firing'],
          ['430', 'after', 'now', 'reduced to'],
          ['regression', 'tested', 'verified', 'confirmed', 'checked', 'still catches', 'unchanged'],
          ['rotated', 'fixed', 'ticket', 'rebuilt', 'review', 'remove', 'no longer', 'expire'],
        ],
        hint:
          'Four things are needed: the fire count before, the fire count after, the evidence that the detection survived, and when this exclusion should be removed.',
      },
    ],
    debrief:
      'The expiry condition is the part nobody writes, and it is why exclusion lists grow forever and are never reviewed. An exclusion without one is a permanent blind spot with a friendly name.',
    practice: [],
  },
];

// --- module de.3: backtesting and coverage -------------------------------------

const MODULE_DE_3: Exercise[] = [
  {
    id: 'de.3.1',
    moduleId: 'de.3',
    packageId: 'detection-engineering-foundations',
    order: 1,
    title: 'Backtest against yesterday',
    kind: 'terminal',
    goal: 'Replay a candidate rule over historical data before shipping it.',
    prompt:
      `Yesterday's authentication log is still on disk, rotated to ${AUTH_ROTATED}. Run the ` +
      'failed-password rule against it and count what it would have fired.',
    teach: RIGOUR_TEACH,
    hints: [
      'The same pattern, a different file.',
      'The rotated log keeps the same name with .1 on the end.',
      `Write \`grep -c "Failed password" ${AUTH_ROTATED}\`.`,
    ],
    solution: `grep -c "Failed password" ${AUTH_ROTATED}`,
    expectedOutput: 'The fire count against the rotated log.',
    checks: [
      { type: 'output-numeric', min: 1, hint: 'The rule should match something in yesterday\'s log.' },
      { type: 'command-has-flag', command: 'grep', flags: ['c'], hint: 'Use -c to count rather than print.' },
    ],
    debrief:
      'A day of history costs one command and tells you whether the volume you measured today is normal or is itself the incident.',
    practice: [
      drill(
        'de.3.1-p1',
        'Backtest the invalid-user rule against the rotated log.',
        {
          note: 'A second rule against the same history. Backtesting both candidates before choosing between them means the choice is made on evidence rather than on which pattern felt more precise.',
          syntax: 'grep -c "PATTERN" ROTATED_LOG',
        },
        `grep -c "Invalid user" ${AUTH_ROTATED}`,
        [{ type: 'output-numeric', min: 0, hint: 'Count the matches in the rotated log.' }],
      ),
      drill(
        'de.3.1-p2',
        'Backtest the successful-authentication rule against the rotated log.',
        {
          note: 'Almost silent yesterday too. A rule whose historical volume is stable is one you can size a rota around; a rule whose volume swings by an order of magnitude between days cannot be triaged by a fixed number of people.',
          syntax: 'grep -c "PATTERN" ROTATED_LOG',
        },
        `grep -c "Accepted" ${AUTH_ROTATED}`,
        [{ type: 'output-numeric', min: 0, hint: 'Count successful authentications yesterday.' }],
      ),
      drill(
        'de.3.1-p3',
        `Check whether ${ATTACKER} appears in yesterday's log at all.`,
        {
          note: 'The question a backtest is really for: was this address here before today. An attacker who appears for the first time this morning is one story, and one who has been quietly present for a week is a much worse one.',
          syntax: 'grep -c ADDRESS ROTATED_LOG',
        },
        `grep -c ${ATTACKER} ${AUTH_ROTATED}`,
        [{ type: 'output-numeric', min: 0, hint: 'Count the attacker address in the rotated log.' }],
      ),
      drill(
        'de.3.1-p4',
        'Count the distinct sources the failed-password rule would have fired on yesterday.',
        {
          note: 'Comparing the source count across two days tells you whether the rule population is stable. A jump in distinct sources usually means a scanning campaign; a jump in volume from the same sources usually means one of them got serious.',
          syntax: 'grep "PATTERN" ROTATED | grep -oE "from [0-9.]+" | sort -u | wc -l',
        },
        `grep "Failed password" ${AUTH_ROTATED} | grep -oE "from [0-9.]+" | sort -u | wc -l`,
        [{ type: 'output-numeric', min: 1, hint: 'Extract, deduplicate, count.' }],
      ),
      drill(
        'de.3.1-p5',
        'Rank yesterday\'s noisiest sources for the same rule, top three.',
        {
          note: 'If the monitoring host is at the top of yesterday\'s list too, the exclusion you wrote is justified by more than one day of data. One day is an anecdote, and an exclusion built on an anecdote is how blind spots get created.',
          syntax: 'grep "PATTERN" ROTATED | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 3',
        },
        `grep "Failed password" ${AUTH_ROTATED} | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 3`,
        [{ type: 'output-line-count', count: 3, hint: 'Three lines, noisiest first.' }],
      ),
    ],
  },
  {
    id: 'de.3.2',
    moduleId: 'de.3',
    packageId: 'detection-engineering-foundations',
    order: 2,
    title: 'Rank the noise before you tune',
    kind: 'terminal',
    goal: 'Build the source breakdown a tuning decision should be based on.',
    prompt:
      'Tuning by hunch produces exclusion lists nobody can justify. Produce the evidence instead: ' +
      'show the three noisiest sources for the failed-password rule, with a count against each.',
    teach: RIGOUR_TEACH,
    hints: [
      'Filter to the rule, pull out just the "from <address>" part, then count each distinct one.',
      '`grep -oE` prints only the matching part. `sort | uniq -c` counts them. `sort -rn` ranks them.',
      `Write \`grep "Failed password" ${AUTH} | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 3\`.`,
    ],
    solution: `grep "Failed password" ${AUTH} | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 3`,
    expectedOutput: `Three lines, ${MONITOR} at the top with ${FAILED_MONITOR}.`,
    checks: [
      { type: 'output-line-count', count: 3, hint: 'Three lines: `head -n 3`.' },
      outHas(MONITOR, 'The monitoring host is the noisiest source and should be first.'),
      outHas(ATTACKER, 'The attacker is the second noisiest and should be on the list.'),
      { type: 'command-uses-pipe', hint: 'This needs several stages chained together.' },
    ],
    debrief:
      'The two loudest sources in this rule are a monitoring box and an active intrusion, and they are adjacent in the ranking. Anybody tuning by volume alone excludes both.',
    practice: [
      drill(
        'de.3.2-p1',
        'Rank the sources for the invalid-user rule instead, top three.',
        {
          note: 'A different rule produces a different ranking, and the monitoring host is absent from this one. Ranking per rule rather than per host is what stops one loud machine dictating exclusions on rules it never triggers.',
          syntax: 'grep "PATTERN" LOG | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 3',
        },
        `grep "Invalid user" ${AUTH} | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 3`,
        [{ type: 'output-line-count', count: 3, hint: 'Three lines.' }],
      ),
      drill(
        'de.3.2-p2',
        'Show the full ranking rather than the top three, and count how many lines it has.',
        {
          note: 'The length of this list is the size of the exclusion list you would need to silence the rule by source alone. Compare it against the single narrower pattern from de.2.4 and the maintenance argument makes itself.',
          syntax: 'grep "PATTERN" LOG | grep -oE "from [0-9.]+" | sort | uniq -c | wc -l',
        },
        `grep "Failed password" ${AUTH} | grep -oE "from [0-9.]+" | sort | uniq -c | wc -l`,
        [numeric(FAILED_SOURCES, `${FAILED_SOURCES} distinct sources.`)],
      ),
      drill(
        'de.3.2-p3',
        'Rank the accounts that failed to authenticate, top five.',
        {
          note: 'Ranking by target rather than by source. If one account dominates, the right rule may be about that account rather than about failure in general, and account-keyed rules are much quieter.',
          syntax: 'grep -oE "Failed password for [a-z]+" LOG | sort | uniq -c | sort -rn | head -n 5',
        },
        `grep -oE "Failed password for [a-z]+" ${AUTH} | sort | uniq -c | sort -rn | head -n 5`,
        [{ type: 'output-line-count', count: 5, hint: 'Five accounts.' }],
      ),
      drill(
        'de.3.2-p4',
        'Show only the single noisiest source for the failed-password rule.',
        {
          note: 'The first line of the ranking is the first tuning candidate, and it should be the first thing you go and find an owner for. If nobody owns it, that is a finding in itself rather than a candidate for exclusion.',
          syntax: 'grep "PATTERN" LOG | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 1',
        },
        `grep "Failed password" ${AUTH} | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 1`,
        [
          { type: 'output-line-count', count: 1, hint: 'One line.' },
          outHas(MONITOR, 'The monitoring host is the noisiest.'),
        ],
      ),
      drill(
        'de.3.2-p5',
        'Rank the noise after excluding the monitoring host, top three.',
        {
          note: 'The tuning loop closing: exclude, re-rank, look at the new top entry. Here the new top entry is the intrusion, which is exactly the outcome you want and the moment to stop tuning and start escalating.',
          syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 3',
        },
        `grep "Failed password" ${AUTH} | grep -v ${MONITOR} | grep -oE "from [0-9.]+" | sort | uniq -c | sort -rn | head -n 3`,
        [
          { type: 'output-line-count', count: 3, hint: 'Three lines.' },
          outLacks(MONITOR, 'The monitoring host should be gone.'),
          outHas(ATTACKER, 'The attacker should now be first.'),
        ],
      ),
    ],
  },
  {
    id: 'de.3.3',
    moduleId: 'de.3',
    packageId: 'detection-engineering-foundations',
    order: 3,
    title: 'The rule that would have caught it',
    kind: 'terminal',
    goal: 'Write the detection that surfaces the incident without the volume.',
    prompt:
      'Neither failure rule was usable. Write the one that would have worked: show every successful ' +
      'authentication in the log that did not come from an internal 10.x address.',
    teach: {
      concept:
        'Detections built on failure are loud because failure is common. Detections built on success ' +
        'plus an unexpected condition are quiet, because the condition does the filtering. A ' +
        'successful login is rare on a server; a successful login from outside the corporate network ' +
        'is rarer still, and on a host that only staff and automation should reach it is close to ' +
        'never. That combination is worth waking somebody for, and it fires a handful of times a day ' +
        'rather than hundreds.',
      syntax: 'grep "Accepted" LOG | grep -v "from 10\\."',
      examples: [
        {
          command: 'grep "session opened" /var/log/auth.log | grep -v "user root"',
          explains: 'The same shape on a different pair: a common event narrowed by an unexpected condition.',
        },
        {
          command: 'grep "Accepted" /var/log/auth.log | grep -c "publickey"',
          explains: 'Splitting successes by authentication method, which is another cheap way to narrow.',
        },
      ],
      flags: [
        { flag: 'Detect on success', means: 'Rare by nature, so the rule is quiet without tuning.' },
        { flag: 'Plus a condition', means: 'The condition carries the precision, not the volume.' },
      ],
    },
    hints: [
      'Start from the successful authentications, then remove the internal ones.',
      'Internal addresses in this estate all begin "from 10.".',
      `Write \`grep "Accepted" ${AUTH} | grep -v "from 10\\."\`.`,
    ],
    solution: `grep "Accepted" ${AUTH} | grep -v "from 10\\."`,
    expectedOutput: 'A short list, containing the attacker sessions.',
    checks: [
      outHas(ATTACKER, 'The attacker\'s successful logins should be in the result.'),
      outLacks('from 10.', 'Internal sources should be excluded.'),
      { type: 'command-uses-pipe', hint: 'Successes first, then remove the internal ones.' },
    ],
    debrief:
      'A handful of lines a day, and the intrusion is in them. This is the rule that should have existed before the incident, and writing it afterwards is exactly what this seat is for.',
    practice: [
      drill(
        'de.3.3-p1',
        'Count how many alerts that rule would produce.',
        {
          note: 'Small enough that a person reads every one. Put this number beside the 718 from de.1.2 and you have the argument for the rule in a single comparison.',
          syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | wc -l',
        },
        `grep "Accepted" ${AUTH} | grep -v "from 10\\." | wc -l`,
        [
          numeric(
            countWhere((line) => line.includes('Accepted') && !/from 10\./.test(line)),
            'External successful authentications.',
          ),
        ],
      ),
      drill(
        'de.3.3-p2',
        'Narrow it further to successful password authentication only, excluding key-based logins.',
        {
          note: 'Key-based logins from outside are usually automation with a deployed key; password logins from outside are usually a person, and a person with a password is the case worth waking somebody for.',
          syntax: 'grep "Accepted password" LOG | grep -v "from 10\\." | wc -l',
        },
        `grep "Accepted password" ${AUTH} | grep -v "from 10\\." | wc -l`,
        [
          numeric(
            countWhere((line) => line.includes('Accepted password') && !/from 10\./.test(line)),
            'External password-based successes.',
          ),
        ],
      ),
      drill(
        'de.3.3-p3',
        'Backtest the same rule against yesterday, and count what it would have fired.',
        {
          note: 'If this rule was silent yesterday and fires today, the volume change IS the alert. A quiet rule earns the right to be trusted precisely because a change in its output means something.',
          syntax: 'grep "PATTERN" ROTATED | grep -v EXCLUSION | wc -l',
        },
        `grep "Accepted" ${AUTH_ROTATED} | grep -v "from 10\\." | wc -l`,
        [{ type: 'output-numeric', min: 0, hint: 'The same rule against the rotated log.' }],
      ),
      drill(
        'de.3.3-p4',
        'Show every successful authentication in the log, internal ones included, to see the whole population.',
        {
          note: 'Nine lines. Seeing the unfiltered set is worth doing once: it shows how small the population is that your condition is narrowing, and therefore how little the condition is actually buying you here.',
          syntax: 'grep "PATTERN" LOG',
        },
        `grep "Accepted" ${AUTH}`,
        [{ type: 'output-line-count', count: ACCEPTED, hint: `${ACCEPTED} successful authentications.` }],
      ),
      drill(
        'de.3.3-p5',
        'Count how many accounts successfully authenticated, distinct.',
        {
          note: 'Extract the account name from each success and deduplicate. A new account appearing in this set is one of the highest-value low-volume detections there is, and it needs no tuning at all.',
          syntax: 'grep -oE "Accepted [a-z]+ for [a-z]+" LOG | sort -u | wc -l',
        },
        `grep -oE "Accepted [a-z]+ for [a-z]+" ${AUTH} | sort -u | wc -l`,
        [{ type: 'output-numeric', min: 1, hint: 'Extract, deduplicate, count.' }],
      ),
    ],
  },
  {
    id: 'de.3.4',
    moduleId: 'de.3',
    packageId: 'detection-engineering-foundations',
    order: 4,
    title: 'A gap you can see',
    kind: 'multiple-choice',
    goal: 'Read coverage against technique so a blind spot is visible rather than silent.',
    prompt:
      'Your coverage map shows detections for credential access and for lateral movement, and ' +
      'nothing at all under exfiltration. What does that tell you?',
    teach: {
      concept:
        'Coverage measured against a technique framework turns "we have 340 rules" into "we can see ' +
        'these techniques and not those". The value is entirely in the second half. Silence from a ' +
        'technique you have no detection for is indistinguishable from silence because it is not ' +
        'happening, and the only way to tell them apart is to have written down which is which in ' +
        'advance. A gap on a map is a decision waiting to be made. A gap nobody mapped is a belief ' +
        'that you are safe.',
      examples: [
        {
          command: '0 detections under exfiltration',
          explains: 'Not evidence of no exfiltration. Evidence that exfiltration would not be seen.',
        },
        {
          command: '14 detections under credential access',
          explains: 'Also not a guarantee. Count is not coverage, and fourteen bad rules see less than one good one.',
        },
      ],
    },
    options: [
      { id: 'a', label: 'Exfiltration is not happening, since nothing has fired.' },
      { id: 'b', label: 'If exfiltration happened, you would not see it, and the absence of alerts says nothing.' },
      { id: 'c', label: 'It is a prioritised gap: you now know where to build next, and can say so to a budget holder.' },
      { id: 'd', label: 'The count of rules in the covered categories proves those techniques are handled.' },
    ],
    hints: [
      'Two of these four are sound. Start by asking what an empty column can and cannot tell you.',
      'Does having fourteen rules in a category mean the category is covered?',
      'What is the practical value of knowing about a gap?',
    ],
    solution:
      'B and C. An empty column means the technique would not be seen, so the absence of alerts ' +
      'from it carries no information at all (B), and knowing that converts an invisible risk into a ' +
      'prioritised piece of work you can argue for (C). A is the failure this whole discipline exists ' +
      'to prevent: reading silence as safety. D confuses count with coverage, and a category with ' +
      'fourteen noisy rules that nobody reads is less covered than one with a single good one.',
    expectedOutput: 'Options B and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b', 'c'],
        hint:
          'One option reads silence as safety. One treats rule count as though it were coverage. Neither survives contact.',
      },
    ],
    debrief:
      'On this host, exfiltration was the gap: 417 kilobytes left for an unnamed address and no rule anywhere would have said so. The packet capture in Networking is where that detection gets built.',
    practice: [],
  },
  {
    id: 'de.3.5',
    moduleId: 'de.3',
    packageId: 'detection-engineering-foundations',
    order: 5,
    title: 'What a backtest cannot tell you',
    kind: 'short-answer',
    goal: 'State the limits of historical replay, so it is not mistaken for proof.',
    prompt:
      'You backtested a rule over thirty days of logs. It fired four times, all four were real, and ' +
      'you are about to ship it as high-confidence. In four or five sentences, say what that ' +
      'backtest does and does not establish, and what you would do about the gap.',
    teach: RIGOUR_TEACH,
    hints: [
      'What is a backtest actually a sample of?',
      'If an attacker was present for those thirty days and you never detected them, what would the backtest show?',
      'Does firing four times tell you what the rule missed?',
    ],
    solution:
      'The backtest establishes the fire rate and the precision against thirty days of this ' +
      'estate, which is genuinely useful: it tells me the rule will not drown the queue and that ' +
      'what it caught was real. It does not establish recall. I have no idea what the rule missed, ' +
      'because the historical data has no labels on it: anything an attacker did during those thirty ' +
      'days that the rule did not match is invisible to the test, and if the estate was already ' +
      'compromised the backtest would look exactly the same. It also only covers what this estate ' +
      'happened to experience, so a technique nobody has used here yet is untested rather than ' +
      'handled. I would pair the backtest with a deliberate test: run the technique myself or with ' +
      'the red team and confirm the rule fires, which is the only way to measure recall rather than ' +
      'assume it.',
    expectedOutput:
      'An answer separating fire rate and precision from recall, naming the unlabelled-history problem, and proposing a deliberate test.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['precision', 'false positive', 'fire rate', 'volume', 'noise'],
          ['recall', 'missed', 'miss', 'what it did not catch', 'blind', 'unknown'],
          ['label', 'ground truth', 'already compromised', 'no way to know', 'unlabelled', 'unlabeled'],
          ['red team', 'purple team', 'test', 'simulate', 'emulate', 'atomic', 'run the technique'],
        ],
        hint:
          'Cover four things: what a backtest does measure, the recall it cannot measure, why the history has no ground truth in it, and what you would run instead to find out.',
      },
    ],
    debrief:
      'This is why purple teaming exists as a discipline. A backtest measures the noise a rule makes; only a deliberate emulation measures whether it catches the thing.',
    practice: [],
  },
];

// --- the package ---------------------------------------------------------------

export const DETECTION_ENGINEERING_FOUNDATIONS: LearningPackage = {
  id: 'detection-engineering-foundations',
  order: 19,
  title: 'Detection Engineering',
  summary:
    'Write a rule as a pattern you can run, measure what it costs in noise, tune it without going ' +
    'blind, and back the whole thing with a regression test and a coverage map. Built on the same ' +
    'intrusion the rest of the estate has been carrying, plus the monitoring host that is louder ' +
    'than the attacker.',
  outcomes: [
    'Express a detection as a pattern, and measure its fire count against real logs',
    'Compute the precision of a rule and say what its noise costs an operator',
    'Tune a rule by exclusion and by narrowing, and argue for one over the other',
    'Regression-test a tuning change against the incident it must still catch',
    'Backtest against history, and state what a backtest cannot establish',
    'Read a coverage map so a blind spot is visible rather than silent',
  ],
  prerequisites: ['linux-fundamentals', 'log-analysis'],
  modules: [
    {
      id: 'de.1',
      packageId: 'detection-engineering-foundations',
      order: 1,
      title: 'A rule is a pattern and a decision',
      summary:
        'What the seat produces, writing the rule as something you can run, and measuring how much of what it fires on is the thing you wanted.',
      exercises: MODULE_DE_1,
    },
    {
      id: 'de.2',
      packageId: 'detection-engineering-foundations',
      order: 2,
      title: 'Tuning without going blind',
      summary:
        'Excluding an accountable source, proving the detection survived it, narrowing the logic instead, and the change note that lets somebody audit the decision.',
      exercises: MODULE_DE_2,
    },
    {
      id: 'de.3',
      packageId: 'detection-engineering-foundations',
      order: 3,
      title: 'Backtesting, ranking, and coverage',
      summary:
        'Replaying a rule over history, building the evidence a tuning decision needs, writing the rule that would have caught this incident, and the limits of both.',
      exercises: MODULE_DE_3,
    },
  ],
};
