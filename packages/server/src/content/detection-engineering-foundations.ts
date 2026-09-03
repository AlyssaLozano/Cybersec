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

/*
 * --- de.4 to de.8: the second half of the incident ---------------------------
 *
 * testuser was brute-forced open (de.1 to de.3 cover that half). Once inside,
 * testuser created a second account, sysmon, added it to sudo, and sysmon then
 * logged in clean and staged an archive of the portal export directory. That
 * second half is real, already sitting in AUTH_LOG, and untouched by any
 * exercise above this line. It is what de.4 to de.8 are built on.
 */

const TESTUSER = 'testuser';
const SYSMON = 'sysmon';
const DOKAFOR = 'dokafor';
const DOKAFOR_SOURCE = '10.20.4.58';

/** Failed passwords for the account that was eventually compromised, from the address that did it. */
const TESTUSER_FAILED_ATTACKER = countWhere(
  (line) => line.includes('Failed password for testuser') && line.includes(ATTACKER),
);

/** The same account's failures from every source, decoys included. */
const TESTUSER_FAILED_TOTAL = countText('Failed password for testuser');

/** How many distinct addresses tried to guess this one account. */
const TESTUSER_FAILED_SOURCES = new Set(
  LINES.filter((line) => line.includes('Failed password for testuser')).flatMap((line) =>
    [...line.matchAll(/from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g)].map((match) => match[1]!),
  ),
).size;

/** Every line mentioning both the account and the address that compromised it, in file order. */
const TESTUSER_ATTACKER_LINES = countWhere(
  (line) => line.includes('testuser') && line.includes(ATTACKER),
);

/** The other half of the correlation: the one successful login from that address. */
const TESTUSER_ACCEPTED_ATTACKER = countWhere(
  (line) => line.includes('Accepted') && line.includes('testuser') && line.includes(ATTACKER),
);

/** The account created after the compromise. It never once appears in a failed password. */
const SYSMON_FAILED = countWhere((line) => line.includes('Failed password') && line.includes(SYSMON));
const SYSMON_ACCEPTED = countWhere((line) => line.includes('Accepted') && line.includes(SYSMON));

/** A benign account that failed twice, from an internal address, before getting its own password right. */
const DOKAFOR_FAILED = countText('Failed password for dokafor');
const DOKAFOR_ACCEPTED = countWhere((line) => line.includes('Accepted') && line.includes(DOKAFOR));

/** How many times more the compromised account's burst was than the benign baseline, rounded down so the claim always understates it. */
const BASELINE_RATIO_FLOOR = Math.floor(TESTUSER_FAILED_ATTACKER / DOKAFOR_FAILED);

/** Account provisioning: every useradd/usermod line in the day, which all belong to one event. */
const PROVISION_COUNT = countWhere((line) => /useradd|usermod/.test(line));

/** The new account's first login, external, which the de.3.3 rule already sees on its own. */
const SYSMON_EXTERNAL_ACCEPT = countWhere(
  (line) => line.includes('Accepted') && !/from 10\./.test(line) && line.includes(SYSMON),
);
const TESTUSER_EXTERNAL_ACCEPT = countWhere(
  (line) => line.includes('Accepted') && !/from 10\./.test(line) && line.includes('testuser'),
);
const EXTERNAL_ACCEPTED_TOTAL = countWhere((line) => line.includes('Accepted') && !/from 10\./.test(line));

/**
 * Sudo commands run by one actor, keyed on the account field of the sudo log
 * line rather than on the command text. `.*` rather than `\s+` on purpose: the
 * actor field is padded with a variable number of spaces to line up the
 * colons, and `.*` matches that without needing a character class for it.
 */
const sudoActorCount = (account: string) =>
  countWhere((line) => new RegExp(`sudo:.*${account} :`).test(line));

const SYSMON_ACTOR_COMMANDS = sudoActorCount(SYSMON);
const TESTUSER_ACTOR_COMMANDS = sudoActorCount(TESTUSER);
const RCHEN_ACTOR_COMMANDS = sudoActorCount('rchen');
const JMARTEL_ACTOR_COMMANDS = sudoActorCount('jmartel');
const SVC_BACKUP_ACTOR_COMMANDS = sudoActorCount('svc-backup');

/** Every account that authenticated successfully today, distinct. */
const ACCEPTED_DISTINCT = new Set(
  LINES.filter((line) => line.includes('Accepted')).map((line) => {
    const match = line.match(/Accepted (?:password|publickey) for ([a-z-]+)/);
    return match ? match[1]! : '';
  }),
).size;

/** Every sudo command line, regardless of actor. */
const COMMAND_LINES = countText('; COMMAND=');

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

// --- module de.4: correlation, when one event only means something with another ---

const MODULE_DE_4: Exercise[] = [
  {
    id: 'de.4.1',
    moduleId: 'de.4',
    packageId: 'detection-engineering-foundations',
    order: 1,
    title: 'What a single event cannot tell you',
    kind: 'multiple-choice',
    goal: 'Tell a correlation rule from a single-event rule by what each can see.',
    prompt:
      'de.3.3 built a rule on successful logins from outside the internal network, and it was quiet ' +
      'and useful. It is also blind by construction to anything that happens on the inside, because it ' +
      'throws internal addresses away before it ever runs. A correlation rule instead: fire when a ' +
      'source produces several failed passwords for an account, then a success for that same account ' +
      'from that same source, wherever the source sits. What does the correlation version see that the ' +
      'external-success rule cannot?',
    teach: {
      concept:
        'A single-event rule is a pattern applied to one line. A correlation rule is a pattern applied ' +
        'to a relationship between lines: the same account, the same source, a failure followed by a ' +
        'success. Nothing in grep does this by itself, which is why correlation in a real platform is ' +
        'usually a stateful query rather than a one-line pattern, but the logic underneath is the same ' +
        'logic already in use: match a condition, then narrow by what else has to be true alongside it.',
      syntax: 'grep "PATTERN" LOG | grep -c SOURCE',
      examples: [
        {
          command: 'grep "Accepted" /var/log/auth.log | grep -c 192.0.2.44',
          explains:
            'Checking one address for the success half of a correlation, built the same way regardless of which two conditions are being joined.',
        },
        {
          command: 'grep "Failed password" /var/log/auth.log | grep -n 198.51.100.23',
          explains:
            "Line numbers for one address's failures, which is how you would eyeball whether they land before a success from the same place.",
        },
      ],
    },
    options: [
      { id: 'a', label: 'Nothing: the two rules catch the same thing, since both are ultimately about a success.' },
      {
        id: 'b',
        label:
          'A brute-force-then-compromise pattern that happens to originate from an internal address, which the external-success rule excludes by definition.',
      },
      { id: 'c', label: 'Everything: it replaces the need for a coverage map, since it catches any technique.' },
      { id: 'd', label: 'Nothing useful: it is strictly worse, since it needs two things to line up instead of one.' },
    ],
    hints: [
      "Look at exactly what de.3.3's rule throws away before it even starts matching.",
      'What would have to be true about an attacker for the external-success rule to miss them entirely?',
      'A correlation rule keys on the pattern of failure-then-success. An external-success rule keys on network position. Those are different conditions and can disagree.',
    ],
    solution:
      "B. de.3.3's rule is blind to this by construction: `grep -v \"from 10.\"` discards every " +
      'internal address before the rule runs, so an internal host doing the exact same ' +
      'failed-then-succeeded pattern is invisible to it. A correlation rule keyed on the pattern ' +
      'itself, not on where the source sits, would still catch that. A is wrong because the two rules ' +
      'key on different conditions. C overclaims: de.8 shows a case correlation misses too. D mistakes ' +
      'cost for value, needing two things to line up is what buys the precision.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'One option names something the external-success rule cannot see by its own definition.',
      },
    ],
    debrief:
      'The next four exercises measure exactly this pair of events on this host: a burst of failures, then a success, from the same address, against the same account.',
    practice: [],
  },
  {
    id: 'de.4.2',
    moduleId: 'de.4',
    packageId: 'detection-engineering-foundations',
    order: 2,
    title: 'Measure the burst',
    kind: 'terminal',
    goal: 'Count one half of a correlation: the failures that came before the success.',
    prompt:
      "Before testuser's account produced a successful login, the address that eventually succeeded " +
      'had already been failing against it. Count how many "Failed password for testuser" lines came ' +
      `from ${ATTACKER}.`,
    teach: {
      concept:
        'A correlation rule needs both halves measured before it needs to be written. This half is the ' +
        'size of the burst: how many times one source failed against one account before it got in. A ' +
        'burst of one or two is what a person produces mistyping a password. A burst in the double ' +
        'digits, against a single account, from a single source, is what a guessing tool produces, and ' +
        'the difference is not the shape of the log lines, it is how many of them there are.',
      syntax: 'grep "PATTERN" LOG | grep -c SOURCE',
      examples: [
        {
          command: 'grep "Failed password" /var/log/auth.log | grep -c 192.0.2.44',
          explains:
            'The same measurement against a different source, which is the check you would run against every candidate before deciding which one is the burst.',
        },
      ],
    },
    hints: [
      "Narrow to the account's failures first, then count how many of those came from one address.",
      'Two greps: one for the pattern plus account, one to filter by source.',
      `Write \`grep "Failed password for testuser" ${AUTH} | grep -c ${ATTACKER}\`.`,
    ],
    solution: `grep "Failed password for testuser" ${AUTH} | grep -c ${ATTACKER}`,
    expectedOutput: `${TESTUSER_FAILED_ATTACKER}`,
    checks: [
      numeric(
        TESTUSER_FAILED_ATTACKER,
        `${TESTUSER_FAILED_ATTACKER} failed passwords for testuser came from that address.`,
      ),
      { type: 'command-uses-pipe', hint: "Match the account's failures first, then narrow by source." },
    ],
    debrief: `${TESTUSER_FAILED_ATTACKER} failures, from one address, against one account, and then it got in. That is the shape a correlation rule is built to recognise.`,
    practice: [
      drill(
        'de.4.2-p1',
        'Count how many "Failed password for testuser" lines exist from any source at all.',
        {
          note: "The other sources add up to more than the eventual attacker's share, which matters: several addresses were guessing at the same account name, and only one of them happened to land it.",
          syntax: 'grep -c "PATTERN" LOGFILE',
        },
        `grep -c "Failed password for testuser" ${AUTH}`,
        [numeric(TESTUSER_FAILED_TOTAL, `${TESTUSER_FAILED_TOTAL} failed passwords for testuser in total.`)],
      ),
      drill(
        'de.4.2-p2',
        'Count how many distinct addresses tried to guess the testuser password.',
        {
          note: 'A distributed, low-and-slow guess against one account name is common, and correlating on account plus source rather than account alone is what lets you point at the one address that actually succeeded instead of an unhelpful crowd of four.',
          syntax: 'grep "PATTERN" LOG | grep -oE "from [0-9.]+" | sort -u | wc -l',
        },
        `grep "Failed password for testuser" ${AUTH} | grep -oE "from [0-9.]+" | sort -u | wc -l`,
        [numeric(TESTUSER_FAILED_SOURCES, `${TESTUSER_FAILED_SOURCES} distinct sources tried this account.`)],
      ),
      drill(
        'de.4.2-p3',
        `Count how many times testuser successfully authenticated from ${ATTACKER}, to confirm the other half of the correlation.`,
        {
          note: 'One. The burst and the success share a source and an account, which is the whole condition a correlation rule checks. Without this number the burst is just noise; with it, it is the tail of an intrusion.',
          syntax: 'grep "PATTERN" LOG | grep "ACCOUNT" | grep -c SOURCE',
        },
        `grep "Accepted" ${AUTH} | grep "testuser" | grep -c ${ATTACKER}`,
        [
          numeric(
            TESTUSER_ACCEPTED_ATTACKER,
            `${TESTUSER_ACCEPTED_ATTACKER} successful login for testuser from that address.`,
          ),
        ],
      ),
    ],
  },
  {
    id: 'de.4.3',
    moduleId: 'de.4',
    packageId: 'detection-engineering-foundations',
    order: 3,
    title: 'See the sequence',
    kind: 'terminal',
    goal: 'Confirm the correlation by reading the failures and the success together, in order.',
    prompt:
      `Show every line that mentions both testuser and ${ATTACKER}, so the failures and the eventual ` +
      'success are visible together in the order they happened, without reading the whole file.',
    teach: {
      concept:
        'grep preserves file order, and this log is append-only and chronological, so filtering down to ' +
        'exactly the lines that matter is enough to see a sequence without any timestamp arithmetic. ' +
        'This is the cheapest correlation there is: not a join, not a window function, just narrowing ' +
        'until only the story is left on the screen.',
      syntax: 'grep "PATTERN" LOG | grep SOURCE',
      examples: [
        {
          command: 'grep "testuser" /var/log/auth.log | grep 198.51.100.77',
          explains:
            'The same narrowing against one of the decoy sources, which never produces a success and so never earns a place in the sequence.',
        },
      ],
    },
    hints: [
      'Filter to the account first, then narrow to the address.',
      'No `-c` this time: the lines themselves are wanted, not a count.',
      `Write \`grep "testuser" ${AUTH} | grep ${ATTACKER}\`.`,
    ],
    solution: `grep "testuser" ${AUTH} | grep ${ATTACKER}`,
    expectedOutput: `${TESTUSER_ATTACKER_LINES} lines, ending in the successful login.`,
    checks: [
      { type: 'output-line-count', count: TESTUSER_ATTACKER_LINES, hint: `${TESTUSER_ATTACKER_LINES} lines mention both.` },
      outHas('Failed password', 'The failures should be in the result.'),
      outHas('Accepted', 'The eventual success should be the last line.'),
    ],
    debrief:
      'The whole correlation is readable on one screen once you filter to it: repeated failure, then one success, same account, same address, in that order.',
    practice: [
      drill(
        'de.4.3-p1',
        'Show every line mentioning both dokafor and its internal source, to compare a benign sequence with the attack sequence.',
        {
          note: "This account is not a clean single failure-then-success story: it logged in fine earlier the same morning, then produced two failures before logging in again, still from the same address. People do this to themselves; it is not evidence of anything.",
          syntax: 'grep "ACCOUNT" LOG | grep SOURCE',
        },
        `grep "dokafor" ${AUTH} | grep ${DOKAFOR_SOURCE}`,
        [outHas('Accepted', 'The account did succeed, at least once, in this result.')],
      ),
      drill(
        'de.4.3-p2',
        'Show every line mentioning both testuser and one of the decoy sources instead, and notice how it ends.',
        {
          note: 'No "Accepted" line at all: this source guessed and gave up. A correlation rule never fires on it, correctly, because the second half of the condition never happened.',
          syntax: 'grep "ACCOUNT" LOG | grep SOURCE',
        },
        `grep "testuser" ${AUTH} | grep 198.51.100.77`,
        [outLacks('Accepted', 'This source never succeeded, so it should not appear.')],
      ),
    ],
  },
  {
    id: 'de.4.4',
    moduleId: 'de.4',
    packageId: 'detection-engineering-foundations',
    order: 4,
    title: 'The account with no burst at all',
    kind: 'terminal',
    goal: 'Find the account a failed-then-succeeded rule is structurally blind to.',
    prompt:
      'The attacker did not stop at testuser. A second account was created and used directly. Count ' +
      'how many "Failed password" lines mention sysmon at all.',
    teach: {
      concept:
        'A correlation rule keyed on failure-then-success needs a failure to exist in the first place. ' +
        'An account created by an attacker and handed a working credential directly never produces one: ' +
        'there is nothing to guess, because nobody is guessing. The rule that caught testuser has ' +
        'nothing to say about this account, not because it is tuned wrong, but because the condition it ' +
        'is built on genuinely never happens here.',
      syntax: 'grep "PATTERN" LOG | grep -c ACCOUNT',
      examples: [
        {
          command: 'grep "Failed password" /var/log/auth.log | grep -c rchen',
          explains:
            'The same check against an ordinary account that also never fails, for the same reason: a person who knows their own password does not usually need to guess it either.',
        },
      ],
    },
    hints: [
      'Filter to the pattern, then narrow to the account name.',
      'This rule should fire zero times. Confirm why.',
      `Write \`grep "Failed password" ${AUTH} | grep -c sysmon\`.`,
    ],
    solution: `grep "Failed password" ${AUTH} | grep -c sysmon`,
    expectedOutput: `${SYSMON_FAILED}`,
    checks: [
      numeric(SYSMON_FAILED, 'Zero. This account never appears in a failed password.'),
      { type: 'command-uses-pipe', hint: 'Match the pattern, then narrow to the account.' },
    ],
    debrief:
      'Zero failures, one success. A correlation rule needs both halves, and this account only ever supplied one of them.',
    practice: [
      drill(
        'de.4.4-p1',
        'Count how many times sysmon successfully authenticated.',
        {
          note: 'One, the only event this account produces that any rule could key on at all.',
          syntax: 'grep "PATTERN" LOG | grep -c ACCOUNT',
        },
        `grep "Accepted" ${AUTH} | grep -c sysmon`,
        [numeric(SYSMON_ACCEPTED, `${SYSMON_ACCEPTED} successful login for sysmon.`)],
      ),
      drill(
        'de.4.4-p2',
        'Count how many failed passwords the other established accounts on this host produced today: rchen, jmartel and svc-backup, combined.',
        {
          note: "Also zero. On this host, a clean failure record is normal for a person who already knows their password. It is what makes sysmon's single, unearned success worth noticing, rather than what makes it suspicious on its own.",
          syntax: 'grep "PATTERN" LOG | grep -cE "a|b|c"',
        },
        `grep "Failed password" ${AUTH} | grep -cE "rchen|jmartel|svc-backup"`,
        [
          numeric(
            countWhere((line) => line.includes('Failed password') && /rchen|jmartel|svc-backup/.test(line)),
            'Zero failed passwords across all three accounts.',
          ),
        ],
      ),
    ],
  },
  {
    id: 'de.4.5',
    moduleId: 'de.4',
    packageId: 'detection-engineering-foundations',
    order: 5,
    title: 'What a correlation rule misses',
    kind: 'short-answer',
    goal: 'State the limit of a failed-then-succeeded rule, and what would cover the gap.',
    prompt:
      `In four or five sentences: testuser produced ${TESTUSER_FAILED_ATTACKER} failed passwords from ` +
      `${ATTACKER} before it succeeded, and sysmon produced zero failures before its one success. ` +
      'Explain why a failed-then-succeeded correlation rule catches the first and not the second, and ' +
      'name the different kind of rule you would need to see the second.',
    teach: {
      concept:
        'A rule is honest about the condition it checks, and dishonest the moment somebody assumes it ' +
        'checks something broader. "Catches account compromise" is a claim about intent; "fires on a ' +
        'failure followed by a success from the same source" is a claim about a specific mechanism, and ' +
        'the gap between those two claims is exactly where an attacker who avoids the mechanism gets ' +
        'through for free.',
      examples: [
        {
          command: 'correlation rule: fires on brute force that succeeds',
          explains: 'The intent, which is not what is actually checked.',
        },
        {
          command: 'correlation rule: fires on failure(s) then success, same account, same source',
          explains: 'The mechanism, which is what is actually checked, and is narrower than the intent.',
        },
      ],
    },
    hints: [
      'What condition does the rule actually check, in mechanical terms, not in terms of what it is meant to catch?',
      'Does sysmon ever satisfy that mechanical condition?',
      'What kind of event would a rule need to key on instead, to see an account that was handed a credential rather than guessed at?',
    ],
    solution:
      `A failed-then-succeeded correlation rule checks a mechanism, not an intent: it needs an actual ` +
      `failure to exist before it can pair it with a success. testuser supplies both halves, ${TESTUSER_FAILED_ATTACKER} ` +
      'failures then a success from the same address, so the rule fires. sysmon supplies only the ' +
      'second half: it was created by the attacker and handed a working credential directly, so it ' +
      'never produces a failed password for the rule to correlate against. The rule is not wrong or ' +
      'badly tuned, the condition it checks genuinely never occurs for this account. Seeing it would ' +
      'need a rule keyed on a different mechanism entirely, such as account provisioning or a brand new ' +
      "account's first login, which is exactly what de.6 builds.",
    expectedOutput:
      'An answer distinguishing the mechanism the rule checks from the intent behind it, and naming a provisioning- or first-login-based rule as the gap-filler.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['no failures', 'zero failures', 'never failed', 'handed', 'directly'],
          ['mechanism', 'condition', 'structurally', 'by definition', 'requires a failure'],
          ['new account', 'freshly created', 'provisioned', 'sysmon'],
          ['different rule', 'account creation', 'provisioning', 'new account', 'first login'],
        ],
        hint:
          'Cover four things: why sysmon never satisfies the correlation condition, that this is a mechanism limit rather than a tuning mistake, that the account was freshly created, and what other kind of rule would see it.',
      },
    ],
    debrief:
      'A rule is only ever as broad as the mechanism it checks. Naming that mechanism precisely, out loud, is what stops "we have a rule for account compromise" from becoming a false sense of coverage.',
    practice: [],
  },
];

// --- module de.5: baselining a normal account against an odd, uncompromised one ---

const MODULE_DE_5: Exercise[] = [
  {
    id: 'de.5.1',
    moduleId: 'de.5',
    packageId: 'detection-engineering-foundations',
    order: 1,
    title: 'The shape is not the signal',
    kind: 'multiple-choice',
    goal: 'Tell a pattern match from an anomaly by asking what a benign account actually does.',
    prompt:
      `dokafor produced two failed passwords, then a successful login, from the same internal address ` +
      `(${DOKAFOR_SOURCE}). That is structurally the same shape a correlation rule looks for: failure, ` +
      'failure, success, one source. Is this the incident?',
    teach: {
      concept:
        'A pattern is not a threshold. "Failure then success from the same source" describes dokafor\'s ' +
        "ordinary Tuesday exactly as well as it describes testuser's compromise, because the shape does " +
        'not carry a magnitude. Baselining is the discipline of measuring what a known-good account ' +
        'actually does, so a rule has something honest to compare an outlier against, instead of a ' +
        'number somebody picked because it sounded strict.',
      examples: [
        {
          command: 'grep -c "Failed password for jmartel" /var/log/auth.log',
          explains: 'Checking whether a different ordinary account produced any failures at all today, a second point on the same baseline.',
        },
      ],
    },
    options: [
      { id: 'a', label: 'Yes, since it matches exactly the pattern a correlation rule was written to catch.' },
      { id: 'b', label: 'No, since a correlation rule only ever fires on external addresses.' },
      {
        id: 'c',
        label:
          'No: two failures from an internal address is the ordinary shape of a mistyped password. The shape alone is not the signal, the size of it is.',
      },
      { id: 'd', label: 'It cannot be judged without the packet capture.' },
    ],
    hints: [
      'Two failures is a small number. Ask what a real person produces by accident.',
      'A correlation rule as described in de.4 never mentioned internal versus external at all.',
      "What is missing from the rule's definition that would let it tell dokafor and testuser apart?",
    ],
    solution:
      'C. Two failed passwords from an internal address, followed by a success, is the ordinary shape ' +
      'of somebody mistyping their own password. The rule as defined in de.4 only checks the shape, not ' +
      "the size, so on its own it cannot distinguish dokafor's two failures from testuser's fifteen. B " +
      "is a distractor: de.4's rule was explicitly built to also catch an internal source. D reaches for " +
      'data this host does not need: the answer is sitting in the account history already measured.',
    expectedOutput: 'Option C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['c'],
        hint: 'Ask what an ordinary person does by accident, and how many failures that produces.',
      },
    ],
    debrief:
      "The rest of this module measures dokafor's baseline and testuser's burst side by side, so the threshold that separates them comes from the data rather than a guess.",
    practice: [],
  },
  {
    id: 'de.5.2',
    moduleId: 'de.5',
    packageId: 'detection-engineering-foundations',
    order: 2,
    title: "Measure the baseline",
    kind: 'terminal',
    goal: 'Derive a normal-account number from data instead of assuming one.',
    prompt:
      'Establish the baseline. Count how many "Failed password for dokafor" lines exist, the account ' +
      'whose sign-in you have just read as ordinary.',
    teach: {
      concept:
        'A baseline is a number, taken from an account known to be doing nothing wrong, that a ' +
        'threshold can be measured against later. It has to come from this environment on a real day, ' +
        "not from a security vendor's slide deck, because what counts as a normal number of mistyped " +
        'passwords is a property of the humans who use this host, not a universal constant.',
      syntax: 'grep -c "PATTERN" LOGFILE',
      examples: [
        {
          command: 'grep -c "Failed password for rchen" /var/log/auth.log',
          explains: "A second, independent baseline point, from a different ordinary account's day.",
        },
      ],
    },
    hints: [
      'One pattern, naming the account directly.',
      'A plain `grep -c` is enough, no source filtering needed here.',
      `Write \`grep -c "Failed password for dokafor" ${AUTH}\`.`,
    ],
    solution: `grep -c "Failed password for dokafor" ${AUTH}`,
    expectedOutput: `${DOKAFOR_FAILED}`,
    checks: [numeric(DOKAFOR_FAILED, `${DOKAFOR_FAILED} failed passwords for a known-benign account.`)],
    debrief: `${DOKAFOR_FAILED}. That is what an account doing nothing wrong produced today. Any threshold this rule uses should be measured against that number, not against one that merely felt strict.`,
    practice: [
      drill(
        'de.5.2-p1',
        "Confirm dokafor's failures came from the same address that later succeeded.",
        {
          note: 'They do. The baseline is not just a count, it is a count with a source attached, which is what makes it comparable to testuser\'s burst in the next exercise.',
          syntax: 'grep "PATTERN" LOG | grep -c SOURCE',
        },
        `grep "Failed password for dokafor" ${AUTH} | grep -c ${DOKAFOR_SOURCE}`,
        [numeric(DOKAFOR_FAILED, `Both failures came from ${DOKAFOR_SOURCE}.`)],
      ),
      drill(
        'de.5.2-p2',
        "Count dokafor's total successful logins today.",
        {
          note: 'Two: one earlier in the day with no failures anywhere near it, and the one that followed the two failures. A baseline account can look slightly different from itself at different points in the same day and still be fine.',
          syntax: 'grep "PATTERN" LOG | grep -c ACCOUNT',
        },
        `grep "Accepted" ${AUTH} | grep -c dokafor`,
        [numeric(DOKAFOR_ACCEPTED, `${DOKAFOR_ACCEPTED} successful logins for dokafor.`)],
      ),
      drill(
        'de.5.2-p3',
        "Confirm none of dokafor's failures came from outside the internal network.",
        {
          note: 'Zero. The baseline account never once produced a failure from an external address, which is a second, independent fact worth knowing before trusting the number two as typical.',
          syntax: 'grep "PATTERN" LOG | grep -vc "from 10\\."',
        },
        `grep "Failed password for dokafor" ${AUTH} | grep -vc "from 10\\."`,
        [
          numeric(
            countWhere((line) => line.includes('Failed password for dokafor') && !/from 10\./.test(line)),
            'Zero external failures for this account.',
          ),
        ],
      ),
    ],
  },
  {
    id: 'de.5.3',
    moduleId: 'de.5',
    packageId: 'detection-engineering-foundations',
    order: 3,
    title: 'Measure the outlier',
    kind: 'terminal',
    goal: 'Put the anomalous number next to the baseline.',
    prompt:
      `Now the other number. Count how many "Failed password for testuser" lines came from ${ATTACKER}, ` +
      'the address that went on to compromise it.',
    teach: {
      concept:
        'A baseline is only useful in contrast. Two is meaningless on its own, and so is fifteen: the ' +
        'threshold this rule needs is the relationship between them, not either number read in ' +
        'isolation. This is the same reason a doctor needs a normal range before a single blood test ' +
        'result means anything.',
      syntax: 'grep "PATTERN" LOG | grep -c SOURCE',
      examples: [
        {
          command: 'grep -c "Failed password for rchen" /var/log/auth.log',
          explains: "A third baseline point from a different, unrelated account, none of which will be anywhere near testuser's number.",
        },
      ],
    },
    hints: [
      "Same shape as measuring dokafor's baseline, different account and address.",
      'Filter to the account, then narrow to the compromising address.',
      `Write \`grep "Failed password for testuser" ${AUTH} | grep -c ${ATTACKER}\`.`,
    ],
    solution: `grep "Failed password for testuser" ${AUTH} | grep -c ${ATTACKER}`,
    expectedOutput: `${TESTUSER_FAILED_ATTACKER}`,
    checks: [
      numeric(TESTUSER_FAILED_ATTACKER, `${TESTUSER_FAILED_ATTACKER} failed passwords for the account that was compromised.`),
    ],
    debrief: `${TESTUSER_FAILED_ATTACKER} against a baseline of ${DOKAFOR_FAILED}: more than ${BASELINE_RATIO_FLOOR} times the number a known-benign account produced on the same host on the same day. That ratio, not either number alone, is the threshold worth building a rule around.`,
    practice: [
      drill(
        'de.5.3-p1',
        'Count how many failed passwords for testuser came from sources other than the eventual attacker.',
        {
          note: "Sixteen, spread across several decoy addresses. None of those individual sources came anywhere near the attacker's fifteen, which is why keying a threshold on any single source's count, not on the account's total, is what actually separates this from ordinary background noise.",
          syntax: 'grep "PATTERN" LOG | grep -vc SOURCE',
        },
        `grep "Failed password for testuser" ${AUTH} | grep -vc ${ATTACKER}`,
        [
          numeric(
            TESTUSER_FAILED_TOTAL - TESTUSER_FAILED_ATTACKER,
            'Total minus the attacker\'s share.',
          ),
        ],
      ),
      drill(
        'de.5.3-p2',
        "Count jmartel's failed passwords, a third baseline point.",
        {
          note: "Zero. Two of the three ordinary accounts checked in this module never failed at all, which makes dokafor's two look less like a typical number and more like the higher end of what a benign account does on a bad day.",
          syntax: 'grep -c "PATTERN" LOGFILE',
        },
        `grep -c "Failed password for jmartel" ${AUTH}`,
        [numeric(countText('Failed password for jmartel'), "jmartel's failed password count.")],
      ),
    ],
  },
  {
    id: 'de.5.4',
    moduleId: 'de.5',
    packageId: 'detection-engineering-foundations',
    order: 4,
    title: 'Set the threshold',
    kind: 'short-answer',
    goal: 'Turn two measured numbers into a threshold, and say what to do with the middle.',
    prompt:
      `In four or five sentences: dokafor's baseline is ${DOKAFOR_FAILED} failed passwords before a ` +
      `success. testuser produced ${TESTUSER_FAILED_ATTACKER} from the address that got in. State a ` +
      'threshold for this rule that is derived from the baseline rather than picked arbitrarily, and ' +
      'say what you would do with an account that lands between the two, say six or seven failures.',
    teach: {
      concept:
        'A threshold set as a multiple of a measured baseline survives the question "why this number", ' +
        'because the answer is a fact about this environment rather than a guess. It does not, on its ' +
        'own, solve every case: there is a middle ground between two and fifteen where the honest answer ' +
        'is not "safe" or "compromised" but "look at it", and a rule that pretends otherwise is hiding a ' +
        'judgement call rather than making one.',
      examples: [
        { command: 'threshold: more than 2x the benign baseline', explains: 'Derived, and defensible to a reviewer who asks where the number came from.' },
        { command: 'threshold: more than 5 failures', explains: 'A number that sounds reasonable and answers to nobody.' },
      ],
    },
    hints: [
      'State the threshold as a multiple or function of the baseline, not as a number on its own.',
      "Fifteen is far past any reasonable multiple of two. Six or seven is not, obviously, one way or the other.",
      'What is the honest thing to do with a case the threshold cannot cleanly decide?',
    ],
    solution:
      `The baseline is ${DOKAFOR_FAILED} failed passwords for an account doing nothing wrong. A ` +
      `threshold of several times that, for example more than ${DOKAFOR_FAILED * 3} failures from a ` +
      'single source against a single account, is derived from what this environment actually does ' +
      `rather than picked for sounding strict. testuser's ${TESTUSER_FAILED_ATTACKER} clears that ` +
      'threshold with room to spare. An account with six or seven failures sits in the gap between the ' +
      'baseline and a confident alert, and the honest response is not to force it into either bucket: ' +
      'flag it for a human to look at rather than auto-closing it as benign or auto-escalating it as ' +
      'confirmed, since the data does not support certainty either way.',
    expectedOutput:
      'A threshold expressed as a multiple of the measured baseline, plus an honest, non-automatic handling of the ambiguous middle case.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['baseline', 'dokafor', 'two', 'typo', 'benign'],
          ['multiple', 'times the baseline', 'derived', 'several times'],
          ['fifteen', 'testuser', 'far above', 'well past', 'clears'],
          ['review', 'investigate', 'uncertain', 'grey area', 'human', 'flag it'],
        ],
        hint:
          'Cover four things: the baseline value, a threshold expressed as a multiple of it, where testuser sits relative to that threshold, and how to handle a case in between.',
      },
    ],
    debrief:
      'A threshold that can name the data it came from survives a review. A threshold that can only say "it felt right" does not.',
    practice: [],
  },
  {
    id: 'de.5.5',
    moduleId: 'de.5',
    packageId: 'detection-engineering-foundations',
    order: 5,
    title: 'A baseline is still one day',
    kind: 'multiple-choice',
    goal: 'Weigh what a derived threshold buys against what it does not.',
    prompt:
      "dokafor's baseline of two failures came from a single account on a single day. Which of these " +
      'are true about a threshold built on it? Select all that apply.',
    teach: {
      concept:
        'Deriving a number from data is strictly better than inventing one, and it is not the end of the ' +
        'exercise. One account on one day is still an anecdote, the same limit de.3 put on a thirty-day ' +
        'backtest: it tells you what actually happened, and says nothing about what a different account, ' +
        'or a bad Monday, would have produced.',
      examples: [
        { command: '1 account, 1 day, threshold set to 3x it', explains: 'Real data, small sample.' },
        { command: '20 accounts, 30 days, threshold set to 3x the 95th percentile', explains: 'The same idea, harder to argue with.' },
      ],
    },
    options: [
      { id: 'a', label: 'It reflects what real behaviour on this host actually looks like, not a guess.' },
      { id: 'b', label: 'It is still a single data point, and should be confirmed against more accounts or more days before being trusted fully.' },
      { id: 'c', label: 'Once derived from data, a threshold never needs revisiting.' },
      { id: 'd', label: 'A fixed number picked without reference to any real account is safer, since it never changes.' },
    ],
    hints: [
      'Two of these are true. Two describe the exact failure mode the "derive it from data" rule exists to prevent.',
      'Does a single account on a single day count as a large sample?',
      'Does "it never changes" describe an advantage or a way of never noticing it went stale?',
    ],
    solution:
      "A and B. Deriving the threshold from dokafor's real day is genuinely better than a guess (A), " +
      'and it is also just one account on one day, so it should be widened with more accounts and more ' +
      'days before being trusted the way a thirty-day backtest would be (B). C repeats the mistake ' +
      "de.2.5's expiry condition exists to prevent: no threshold is permanent. D is the anti-pattern this " +
      'whole module argues against, a number that never changes only because nobody is checking it ' +
      'against anything.',
    expectedOutput: 'Options A and B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b'],
        hint: 'One option treats "derived from data" as the finish line rather than a starting point. One treats "never changes" as a virtue.',
      },
    ],
    debrief:
      'A derived threshold is a hypothesis backed by one real data point, not a proof. Treating it as the latter is how a good tuning decision quietly turns into next year\'s stale exclusion.',
    practice: [],
  },
];

// --- module de.6: one technique, several signals -------------------------------

const MODULE_DE_6: Exercise[] = [
  {
    id: 'de.6.1',
    moduleId: 'de.6',
    packageId: 'detection-engineering-foundations',
    order: 1,
    title: 'A technique is more than one line',
    kind: 'multiple-choice',
    goal: 'Map one attacker technique to several different kinds of rule.',
    prompt:
      'Once inside, testuser created a second account, sysmon, added it to the sudo group, and sysmon ' +
      'later logged in and ran a command as root. That is one technique, persistence via a new ' +
      'privileged account, executed as a chain of separate actions. Which of these rules would catch ' +
      'some part of that second stage of the intrusion? Select all that apply.',
    teach: {
      concept:
        'A technique is not a single line in a log, it is a chain of actions, and each action can leave ' +
        'its own kind of trace: a tool that provisions, a login that follows, a command that gets run. A ' +
        'ruleset that only ever watches one of those traces sees the technique exactly when the attacker ' +
        'performs that one step, and is silent for the rest of the chain.',
      examples: [
        {
          command: 'useradd, then a login, then a command: three actions, three kinds of trace',
          explains: 'The same technique, viewed as a sequence rather than a single event.',
        },
      ],
    },
    options: [
      {
        id: 'a',
        label:
          'A rule on useradd/usermod activity, since account creation is rare enough on this host to be worth flagging regardless of who typed it.',
      },
      {
        id: 'b',
        label: "The failed-password rule from de.1, since password guessing is how this attacker got in.",
      },
      {
        id: 'c',
        label:
          'A rule on a successful login from outside 10.x by an account that has never logged in before.',
      },
      {
        id: 'd',
        label: 'A rule on a sudo command run by an account that was created a few minutes earlier.',
      },
    ],
    hints: [
      'This question is about the second stage of the intrusion, the part that happens after testuser is already inside.',
      'Ask, for each option, whether sysmon itself would ever trip it.',
      'One option is true of the first stage and has nothing to say about the second.',
    ],
    solution:
      'A, C and D. Each watches a different action in the same chain: account provisioning (A), the new ' +
      "account's first login from outside (C), and a command run by a suspiciously new account (D). B " +
      "is true of testuser's compromise and silent about sysmon's: sysmon never appears in a failed " +
      'password anywhere in the log, so a rule built entirely around guessing would see the first stage ' +
      'of this intrusion and nothing of the second.',
    expectedOutput: 'Options A, C and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'c', 'd'],
        hint: 'Ask which rules would fire specifically on the account that was created, not the account that was guessed.',
      },
    ],
    debrief:
      'The next three exercises measure each of those three angles on this host, none of which mention a failed password at all.',
    practice: [],
  },
  {
    id: 'de.6.2',
    moduleId: 'de.6',
    packageId: 'detection-engineering-foundations',
    order: 2,
    title: 'The first angle: provisioning',
    kind: 'terminal',
    goal: 'Count the rarest, quietest signal this incident produces.',
    prompt:
      'Persistence here started with administrative commands: creating an account and adding it to the ' +
      'sudo group. Count every useradd or usermod line in the log.',
    teach: {
      concept:
        'Account provisioning is intrinsically rare on a server that is not actively being administered, ' +
        "which is what makes a rule on it usable without any tuning at all: there is no monitoring host's " +
        'stale credential drowning it out, because normal administration of this host is itself ' +
        'infrequent. A rare event does not need a clever pattern, it needs to be noticed at all.',
      syntax: 'grep -cE "PATTERN A|PATTERN B" LOG',
      examples: [
        {
          command: 'grep -cE "useradd|usermod" /var/log/auth.log.1',
          explains: "The same rule backtested against yesterday, to see whether today's count is typical for this host.",
        },
      ],
    },
    hints: [
      'useradd and usermod each write their own log line.',
      'Alternation with `-E` catches both tools in one pass.',
      `Write \`grep -cE "useradd|usermod" ${AUTH}\`.`,
    ],
    solution: `grep -cE "useradd|usermod" ${AUTH}`,
    expectedOutput: `${PROVISION_COUNT}`,
    checks: [numeric(PROVISION_COUNT, `${PROVISION_COUNT} provisioning lines today.`)],
    debrief: `${PROVISION_COUNT} lines, all about one account, on one host, in one day. This is close to the quietest kind of rule there is: the event is intrinsically rare, so the rule needs no tuning to be usable.`,
    practice: [
      drill(
        'de.6.2-p1',
        'Confirm all of those provisioning lines belong to the same account.',
        {
          note: 'They do, all of them. Every provisioning event in the whole day is one attacker building one account, which is as quiet as this rule ever needs to be.',
          syntax: 'grep "PATTERN A|PATTERN B" LOG | grep -c ACCOUNT',
        },
        `grep -E "useradd|usermod" ${AUTH} | grep -c sysmon`,
        [numeric(PROVISION_COUNT, `All ${PROVISION_COUNT} lines mention sysmon.`)],
      ),
      drill(
        'de.6.2-p2',
        "Count how many lines record the new account's very first password being set.",
        {
          note: 'One: a password is set exactly once when the account is created, which is a fourth angle on this same event, distinct from the two tools already counted.',
          syntax: 'grep -c "PATTERN" LOGFILE',
        },
        `grep -c "new user:" ${AUTH}`,
        [numeric(countText('new user:'), 'One new-user line.')],
      ),
      drill(
        'de.6.2-p3',
        'Count how many sudo commands testuser ran to build this second account, using the account field rather than free text.',
        {
          note: 'Two: the useradd and the usermod were both run by testuser as sudo. Keying on the actor rather than on the command text is the technique de.6.4 and de.7 build on directly.',
          syntax: 'grep -c "sudo:.*ACCOUNT :" LOGFILE',
        },
        `grep -c "sudo:.*testuser :" ${AUTH}`,
        [numeric(TESTUSER_ACTOR_COMMANDS, `${TESTUSER_ACTOR_COMMANDS} commands run by testuser as sudo.`)],
      ),
    ],
  },
  {
    id: 'de.6.3',
    moduleId: 'de.6',
    packageId: 'detection-engineering-foundations',
    order: 3,
    title: 'The second angle: a first login',
    kind: 'terminal',
    goal: 'Confirm an already-built rule covers a second stage of the same incident for free.',
    prompt:
      "The new account's first login already matches a rule built earlier in this package. Count how " +
      'many successful logins from outside the internal network belong to sysmon.',
    teach: {
      concept:
        'The same detection can cover more than one stage of an incident without anybody planning it ' +
        'that way. de.3.3\'s rule watches for a success from outside 10.x, and it does not care whether ' +
        'the account being logged into is one that has been guessed at for an hour or one that was ' +
        'created five minutes ago. A general, well-chosen rule earns a second angle on a technique for ' +
        'free.',
      syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | grep -c ACCOUNT',
      examples: [
        {
          command: 'grep "Accepted" /var/log/auth.log | grep -c publickey',
          explains: 'A different narrowing of the same successful-logins population, by authentication method rather than by account.',
        },
      ],
    },
    hints: [
      "Start from de.3.3's rule: successful logins, external only.",
      'Narrow the result to the account name.',
      `Write \`grep "Accepted" ${AUTH} | grep -v "from 10\\." | grep -c sysmon\`.`,
    ],
    solution: `grep "Accepted" ${AUTH} | grep -v "from 10\\." | grep -c sysmon`,
    expectedOutput: `${SYSMON_EXTERNAL_ACCEPT}`,
    checks: [
      numeric(SYSMON_EXTERNAL_ACCEPT, `${SYSMON_EXTERNAL_ACCEPT} external login for the new account.`),
      { type: 'command-uses-pipe', hint: 'Successes, then external only, then narrow to the account.' },
    ],
    debrief: `One, and it is the same rule from de.3.3 doing the work. The technique now has two independent detections without a third being written on purpose.`,
    practice: [
      drill(
        'de.6.3-p1',
        'Run the same check for testuser, to confirm the same rule covers both stages of this intrusion.',
        {
          note: "One, same as sysmon. A single general rule, written once, independently caught both the account that was guessed open and the account that was handed a credential directly.",
          syntax: 'grep "PATTERN" LOG | grep -v EXCLUSION | grep -c ACCOUNT',
        },
        `grep "Accepted" ${AUTH} | grep -v "from 10\\." | grep -c testuser`,
        [numeric(TESTUSER_EXTERNAL_ACCEPT, `${TESTUSER_EXTERNAL_ACCEPT} external login for testuser.`)],
      ),
      drill(
        'de.6.3-p2',
        'Count the total number of external successful logins today, across every account.',
        {
          note: "Two, and they are entirely accounted for by this one intrusion's two accounts. The whole external-success population, on this host, on this day, is this incident and nothing else.",
          syntax: 'grep "PATTERN" LOG | grep -vc EXCLUSION',
        },
        `grep "Accepted" ${AUTH} | grep -vc "from 10\\."`,
        [numeric(EXTERNAL_ACCEPTED_TOTAL, `${EXTERNAL_ACCEPTED_TOTAL} external successful logins in total.`)],
      ),
    ],
  },
  {
    id: 'de.6.4',
    moduleId: 'de.6',
    packageId: 'detection-engineering-foundations',
    order: 4,
    title: 'The third angle: what it did once in',
    kind: 'terminal',
    goal: 'Key a rule on the actor rather than on the command text.',
    prompt:
      'The third angle: what the new account did immediately after logging in. Count how many sudo ' +
      'commands were run by sysmon specifically, using the account field of the sudo line rather than ' +
      'free text.',
    teach: {
      concept:
        'A free-text search for a command name, "tar", "curl", "scp", is trivially evaded by using a ' +
        'different tool for the same job. Keying on the actor field of the sudo log line, the account ' +
        'that invoked the command, is not: whatever this account runs as root, the rule sees it, without ' +
        'caring what the command was.',
      syntax: 'grep -c "sudo:.*ACCOUNT :" LOGFILE',
      examples: [
        {
          command: 'grep -c "sudo:.*rchen :" /var/log/auth.log',
          explains: 'The same actor-scoped pattern against an ordinary account, which fires on routine administration rather than anything suspicious.',
        },
      ],
    },
    hints: [
      'The pattern is `sudo:` followed by anything, followed by the account name and a space then a colon.',
      '`.*` stands in for the variable amount of padding sudo puts before the account name.',
      `Write \`grep -c "sudo:.*sysmon :" ${AUTH}\`.`,
    ],
    solution: `grep -c "sudo:.*sysmon :" ${AUTH}`,
    expectedOutput: `${SYSMON_ACTOR_COMMANDS}`,
    checks: [numeric(SYSMON_ACTOR_COMMANDS, `${SYSMON_ACTOR_COMMANDS} sudo command run by sysmon.`)],
    debrief:
      'One command, minutes after the account first logged in: an archive of the portal export directory, staged as root. Three independent angles now cover this one technique, and none of them is a failed password.',
    practice: [
      drill(
        'de.6.4-p1',
        "Show the command sysmon actually ran, not just the count.",
        {
          note: 'An archive of the export directory, staged under /tmp. Staging is the step before exfiltration, which is where the packet capture in Networking picks the story up.',
          syntax: 'grep "sudo:.*ACCOUNT :" LOGFILE',
        },
        `grep "sudo:.*sysmon :" ${AUTH}`,
        [
          { type: 'output-line-count', count: SYSMON_ACTOR_COMMANDS, hint: `${SYSMON_ACTOR_COMMANDS} line.` },
          outHas('tar', 'The command sysmon ran should be visible.'),
        ],
      ),
      drill(
        'de.6.4-p2',
        'Count sudo commands run by testuser, with the same actor-scoped pattern.',
        {
          note: 'Two: the account-creation commands from de.6.2. The same pattern, one field changed, and it moves cleanly from one actor to the next.',
          syntax: 'grep -c "sudo:.*ACCOUNT :" LOGFILE',
        },
        `grep -c "sudo:.*testuser :" ${AUTH}`,
        [numeric(TESTUSER_ACTOR_COMMANDS, `${TESTUSER_ACTOR_COMMANDS} commands run by testuser.`)],
      ),
    ],
  },
  {
    id: 'de.6.5',
    moduleId: 'de.6',
    packageId: 'detection-engineering-foundations',
    order: 5,
    title: 'What the failed-password rule alone would have missed',
    kind: 'short-answer',
    goal: 'Name the angles a technique needed, and what a single-signal ruleset would have missed.',
    prompt:
      'In four or five sentences, name the three angles that together cover the persistence technique ' +
      '(account provisioning, the first login, the first command), and say what a detection posture ' +
      'built only around a failed-password rule would have missed about this half of the intrusion.',
    teach: {
      concept:
        'A ruleset that only watches for guessing is a ruleset that only watches the first stage of a ' +
        'lot of intrusions. Whatever happens after the door is open, provisioning, lateral movement, ' +
        'exfiltration staging, needs its own signal, because none of it necessarily produces another ' +
        'failed password.',
      examples: [
        {
          command: 'a ruleset with one rule: Failed password',
          explains: "Covers the first stage of this intrusion completely, and nothing after the door opened.",
        },
      ],
    },
    hints: [
      'Name the three rules from this module, in your own words, not by exercise number.',
      'Ask how many of them mention "Failed password" at all.',
      "What did testuser's account do, after logging in, that a guessing-only ruleset would have zero visibility into?",
    ],
    solution:
      'The three angles are: watching account provisioning (useradd/usermod activity), watching a ' +
      "successful login from outside the network by an account with no history, and watching sudo " +
      'commands keyed on an actor who was recently created. None of them mentions a failed password. A ' +
      'detection posture built only around the failed-password rule from de.1 would have caught testuser ' +
      "guessing its way in and then gone completely silent: the new account's creation, its first login, " +
      'and the command it ran as root would all have passed with zero alerts, because guessing is not ' +
      'part of any of those three actions.',
    expectedOutput:
      'An answer naming all three angles and stating plainly that a failed-password-only ruleset sees none of the second stage.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['useradd', 'usermod', 'provisioning', 'account creation'],
          ['login', 'external', 'first login', 'new account'],
          ['sudo', 'command', 'actor', 'root'],
          ['missed', 'blind', 'silent', 'nothing', 'no alerts', 'zero visibility'],
        ],
        hint:
          'Name all three rules from this module, then say plainly what a guessing-only ruleset would have missed about the second stage.',
      },
    ],
    debrief:
      'A single good rule catches a single mechanism. Covering a technique means covering the actions that make it up, not writing one clever pattern and calling the technique handled.',
    practice: [],
  },
];

// --- module de.7: detection as code ---------------------------------------------

const MODULE_DE_7: Exercise[] = [
  {
    id: 'de.7.1',
    moduleId: 'de.7',
    packageId: 'detection-engineering-foundations',
    order: 1,
    title: 'What structure actually buys you',
    kind: 'multiple-choice',
    goal: 'Separate the real benefits of detection-as-code from the ones that only sound real.',
    prompt:
      'A detection written as structured fields, `{ pattern: "Failed password", exclude: ' +
      `["${MONITOR}"], action: "alert" }\`, says the same thing as the grep pipeline from de.2.1. What ` +
      'does writing it this way actually buy you, compared to the raw pipeline? Select all that apply.',
    teach: {
      concept:
        'Detection as code means expressing a rule as data, pattern, exclusion, condition, action, ' +
        'rather than as a one-off shell command or a paragraph of prose. The value is entirely in what ' +
        'that data shape makes possible afterward: diffing, testing, and review. It does not, on its ' +
        'own, make the underlying logic any more correct.',
      examples: [
        {
          command: '{ pattern: "Invalid user", exclude: [], action: "alert" }',
          explains: 'The narrower rule from de.2.4, in the same shape, with an empty exclusion list because none was needed.',
        },
      ],
    },
    options: [
      {
        id: 'a',
        label:
          'A change to the exclusion list is now one line in a diff, not a rewritten pipeline, so a reviewer can see exactly what changed.',
      },
      {
        id: 'b',
        label: 'The rule becomes more accurate, since a structured format catches mistakes a shell command cannot.',
      },
      {
        id: 'c',
        label: 'The pattern and the exclusion can be tested against sample lines in isolation, without a live host or a shell.',
      },
      {
        id: 'd',
        label: 'It removes the need for the regression test from de.2.2, since the schema already encodes safety.',
      },
    ],
    hints: [
      'Two of these are true of any well-factored configuration. Two describe benefits that do not actually follow from using a schema.',
      'Does turning a command into a data structure make the logic inside it any more correct?',
      "Does a field named 'exclude' verify itself, or does something still have to check it?",
    ],
    solution:
      'A and C. Structure makes a change reviewable as a diff (A) and testable in isolation, feeding ' +
      'sample lines through the pattern and condition without touching a live host (C). B is false: ' +
      "structure does not add accuracy, the pattern is exactly as correct or wrong as it was as a " +
      'pipeline. D is the same false comfort de.2.5 warned about with exclusion expiry: a schema field ' +
      'existing is not the same as somebody having filled it in correctly, and it never replaces the ' +
      'regression test.',
    expectedOutput: 'Options A and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'c'],
        hint: 'One option claims structure fixes correctness. One claims structure removes the need for a test. Neither follows from writing a rule as data.',
      },
    ],
    debrief:
      'Detection as code is a delivery mechanism, not a proof. It makes a rule easier to review and test, and it does not do either of those jobs for you.',
    practice: [],
  },
  {
    id: 'de.7.2',
    moduleId: 'de.7',
    packageId: 'detection-engineering-foundations',
    order: 2,
    title: 'Formalize the tuned rule',
    kind: 'short-answer',
    goal: 'Write an existing ad hoc rule as a small set of structured fields.',
    prompt:
      `Take the failed-password exclusion from de.2: pattern "Failed password", exclude ${MONITOR}, ` +
      'with the owner, ticket and expiry from de.2.5. In four or five sentences, list the fields you ' +
      'would use to express this as structured data, and what goes in each.',
    teach: {
      concept:
        'A change note like de.2.5\'s is written prose, true and complete, and unenforceable: nothing ' +
        'stops the next person from shipping an exclusion with no ticket and no expiry, because prose is ' +
        'not a shape a validator can check. The same content as named fields, pattern, exclude, owner, ' +
        'ticket, expiry, condition, action, can be required, and a rule missing one is a rule that fails ' +
        'to compile rather than a rule that quietly ships incomplete.',
      examples: [
        {
          command: '{ pattern: "Invalid user", exclude: [], owner: null, expiry: null }',
          explains: 'A rule with no exclusion needs no owner or expiry, and the fields being empty for a real reason is different from them being missing because nobody filled them in.',
        },
      ],
    },
    hints: [
      'Name at least: what the rule matches, what it excludes and why, who owns the exclusion, and when it stops applying.',
      "de.2.5's change note already has every value you need; the task is naming the field each value belongs in.",
      'A field with nothing in it should still exist and be visibly empty, not simply absent.',
    ],
    solution:
      'The fields: `pattern` holds "Failed password", the match itself. `exclude` holds the monitoring ' +
      `host's address, ${MONITOR}. \`owner\` and \`ticket\` hold whoever is accountable for that host and ` +
      'the tracking ticket, OPS-4412 in de.2.5\'s note. `expiry` holds the condition that invalidates the ' +
      'exclusion, the credential being rotated or the host being rebuilt. `action` holds what happens on ' +
      'a match, alerting an operator. Naming these as fields rather than leaving them as prose means a ' +
      'rule missing an owner or an expiry is visibly incomplete rather than quietly under-specified.',
    expectedOutput:
      'A short list of named fields (pattern, exclude, owner/ticket, expiry, action) mapped to the actual values from de.2 and de.2.5.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['pattern', 'match'],
          ['exclude', 'exclusion', 'suppress'],
          ['owner', 'ticket', 'accountable'],
          ['expire', 'expiry', 'review', 'revisit', 'rotate', 'stale'],
        ],
        hint:
          'Name a field for the match itself, a field for the exclusion, a field for who owns it, and a field for when it stops applying.',
      },
    ],
    debrief:
      "A field that is required and empty is a visible gap. The same fact left out of a paragraph of prose is invisible until somebody goes looking for it, which is usually after it has already mattered.",
    practice: [],
  },
  {
    id: 'de.7.3',
    moduleId: 'de.7',
    packageId: 'detection-engineering-foundations',
    order: 3,
    title: 'A rule with a parameter',
    kind: 'terminal',
    goal: 'Implement a structured rule whose account field is a parameter, not a rewrite.',
    prompt:
      'Formalize a rule: `{ pattern: "sudo actor", account: "testuser" }`, meaning fire on every sudo ' +
      'command run by that specific account. Write the command this compiles to, and count what it ' +
      'fires on.',
    teach: {
      concept:
        'A structured rule with an `account` field is one rule, run with different parameters, rather ' +
        'than a new pipeline written from scratch for every account. The shell command underneath does ' +
        'not change shape between runs, only the value that gets substituted into it, which is exactly ' +
        'what makes the field worth naming in the first place.',
      syntax: 'grep -c "sudo:.*ACCOUNT :" LOGFILE',
      examples: [
        {
          command: 'grep -c "sudo:.*svc-backup :" /var/log/auth.log',
          explains: 'The same parameterised rule run for an account that never once appears as a sudo actor.',
        },
      ],
    },
    hints: [
      'This is the same actor-scoped pattern from de.6.4, with a different account value.',
      '`.*` stands in for the padding between "sudo:" and the account name.',
      `Write \`grep -c "sudo:.*testuser :" ${AUTH}\`.`,
    ],
    solution: `grep -c "sudo:.*testuser :" ${AUTH}`,
    expectedOutput: `${TESTUSER_ACTOR_COMMANDS}`,
    checks: [numeric(TESTUSER_ACTOR_COMMANDS, `${TESTUSER_ACTOR_COMMANDS} sudo commands for the account field "testuser".`)],
    debrief: `${TESTUSER_ACTOR_COMMANDS}. The rule did not change shape to answer this, only the parameter did.`,
    practice: [
      drill(
        'de.7.3-p1',
        'Run the same parameterised rule for account "rchen".',
        {
          note: "One. A different parameter, the same rule, the same shell shape underneath. This is what 'a rule is a pattern plus a decision' looks like once the decision has a named input.",
          syntax: 'grep -c "sudo:.*ACCOUNT :" LOGFILE',
        },
        `grep -c "sudo:.*rchen :" ${AUTH}`,
        [numeric(RCHEN_ACTOR_COMMANDS, `${RCHEN_ACTOR_COMMANDS} sudo command for rchen.`)],
      ),
      drill(
        'de.7.3-p2',
        'Run it again for account "jmartel".',
        {
          note: 'One again. Three different accounts, three runs of the identical rule, and nothing about the pattern itself had to be rewritten each time.',
          syntax: 'grep -c "sudo:.*ACCOUNT :" LOGFILE',
        },
        `grep -c "sudo:.*jmartel :" ${AUTH}`,
        [numeric(JMARTEL_ACTOR_COMMANDS, `${JMARTEL_ACTOR_COMMANDS} sudo command for jmartel.`)],
      ),
    ],
  },
  {
    id: 'de.7.4',
    moduleId: 'de.7',
    packageId: 'detection-engineering-foundations',
    order: 4,
    title: 'The diff is the whole story',
    kind: 'terminal',
    goal: 'See what a one-field change actually does, and why that is worth being able to see.',
    prompt:
      'Change only the account field to "sysmon", the value a reviewer would see change in a one-line ' +
      'diff, and count what the same rule now fires on.',
    teach: {
      concept:
        'A raw, hand-typed pipeline hides the fact that only one thing changed between two runs: two ' +
        'commands that look almost identical still have to be read in full to spot the difference. A ' +
        'structured rule with one named field changed makes the difference the entire diff, which is ' +
        'what a reviewer, or a second pair of eyes six months from now, actually needs to be able to see ' +
        'at a glance.',
      syntax: 'grep -c "sudo:.*ACCOUNT :" LOGFILE',
      examples: [
        {
          command: 'grep -cE "sudo:.*(testuser|sysmon) :" /var/log/auth.log.1',
          explains: "Both accounts' commands counted together, backtested against yesterday, where this incident had not happened yet.",
        },
      ],
    },
    hints: [
      'Same pattern as de.7.3, one value changed.',
      'The account field is now "sysmon".',
      `Write \`grep -c "sudo:.*sysmon :" ${AUTH}\`.`,
    ],
    solution: `grep -c "sudo:.*sysmon :" ${AUTH}`,
    expectedOutput: `${SYSMON_ACTOR_COMMANDS}`,
    checks: [numeric(SYSMON_ACTOR_COMMANDS, `${SYSMON_ACTOR_COMMANDS} sudo command for the account field "sysmon".`)],
    debrief: `${TESTUSER_ACTOR_COMMANDS} commands for testuser, ${SYSMON_ACTOR_COMMANDS} for sysmon, from the same rule with one field changed. That difference is the whole argument for formalizing it: it is reviewable and testable, and nobody has to remember what the original pipeline looked like to check it.`,
    practice: [
      drill(
        'de.7.4-p1',
        'Count sudo commands for either account at once, using the account field as an alternation.',
        {
          note: 'Three, the sum of the two runs above. A structured rule can take a list of accounts as easily as one, which a hand-written pipeline would need rebuilding to do.',
          syntax: 'grep -cE "sudo:.*(A|B) :" LOGFILE',
        },
        `grep -cE "sudo:.*(testuser|sysmon) :" ${AUTH}`,
        [
          numeric(
            TESTUSER_ACTOR_COMMANDS + SYSMON_ACTOR_COMMANDS,
            'Both accounts counted together.',
          ),
        ],
      ),
    ],
  },
  {
    id: 'de.7.5',
    moduleId: 'de.7',
    packageId: 'detection-engineering-foundations',
    order: 5,
    title: 'The risk structure introduces',
    kind: 'short-answer',
    goal: 'Name a cost of formalizing a rule, not just a benefit.',
    prompt:
      'In four or five sentences, name one risk that formalizing a rule as structured fields introduces, ' +
      'that a raw shell pipeline does not have.',
    teach: {
      concept:
        'A schema with a field called "owner" looks accountable whether or not anybody put a real name ' +
        'in it. That is the specific danger structure adds: it can manufacture the appearance of rigour ' +
        "without the substance, because a filled-in-looking form is more persuasive than an obviously " +
        'ad hoc shell command, even when both are equally unreviewed.',
      examples: [
        {
          command: '{ owner: "", expiry: null, pattern: "Failed password" }',
          explains: 'A rule that looks structured and accountable and has an empty owner field nobody ever checked.',
        },
      ],
    },
    hints: [
      'A raw grep pipeline never pretends to be more rigorous than it is. What can a schema pretend?',
      "What happens when a required field like 'owner' is present but left blank or filled with a placeholder?",
      'Does a structured format do the reviewing for you, or does it still need somebody to look?',
    ],
    solution:
      'A schema can create false confidence: a rule with fields named `owner`, `ticket` and `expiry` ' +
      'looks accountable and reviewed whether or not anybody actually filled those fields in correctly, ' +
      'in a way an obviously ad hoc shell command never pretends to be. A raw pipeline looks exactly as ' +
      'unreviewed as it is, which paradoxically makes it harder to mistake for something safer than it ' +
      'is. Structure does not replace review, it just gives an unreviewed rule a more convincing costume, ' +
      'so the fields still have to be checked, not merely present.',
    expectedOutput:
      'An answer naming the false-confidence risk: structure can look accountable without anybody having actually filled it in correctly.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['false confidence', 'looks accountable', 'looks safe', 'feels rigorous', 'appears'],
          ['empty', 'blank', 'placeholder', 'not filled in', 'nobody checks', 'unfilled'],
          ['schema', 'structure', 'fields', 'format'],
          ['review', 'audit', 'human', 'still has to', 'does not replace'],
        ],
        hint:
          'Name the false-confidence risk: a schema can look accountable without the fields having been filled in for real, and say that structure never replaces an actual check.',
      },
    ],
    debrief:
      "A field is not a fact. It is a place a fact is supposed to live, and somebody still has to put one there.",
    practice: [],
  },
];

// --- module de.8: a harder pass at coverage --------------------------------------

const MODULE_DE_8: Exercise[] = [
  {
    id: 'de.8.1',
    moduleId: 'de.8',
    packageId: 'detection-engineering-foundations',
    order: 1,
    title: 'Coverage depends on the attacker\'s choices',
    kind: 'multiple-choice',
    goal: 'Read a covered technique honestly, as one variant of it rather than the whole thing.',
    prompt:
      "de.6 built three rules for persistence via a new privileged account, and all three depend on the " +
      'attacker creating a visible new account. Which statements are the honest, harder reading of that ' +
      'coverage? Select all that apply.',
    teach: {
      concept:
        "A technique having good coverage is itself an attacker-dependent fact, not a property of the " +
        'ruleset alone: three good rules cover persistence exactly as the attacker chose to do it this ' +
        'time. The same goal, staying on the host after initial access, reached by reusing a valid, ' +
        'quiet, already-privileged account instead, would leave none of those three signals behind.',
      examples: [
        {
          command: 'persistence via a new account: 3 rules, well covered',
          explains: 'True, for this attacker\'s choice.',
        },
        {
          command: 'persistence via an existing, quiet account: 0 of those 3 rules apply',
          explains: 'Also true, for a different choice achieving the same goal.',
        },
      ],
    },
    options: [
      {
        id: 'a',
        label:
          'Since three separate rules now cover persistence via a new account, the technique is fully covered no matter how an attacker attempts it.',
      },
      {
        id: 'b',
        label:
          'All three of de.6\'s rules depend on the attacker creating a visible new account; an attacker who instead reuses a valid, quiet account leaves none of those three signals.',
      },
      {
        id: 'c',
        label:
          'Coverage should be described per variant of a technique, not per technique name, because two attackers achieving "persistence" can look completely different in the log.',
      },
      { id: 'd', label: 'A technique with three good rules never needs revisiting.' },
    ],
    hints: [
      'Ask what all three of de.6\'s rules have in common as a precondition.',
      'Is "persistence" one thing that always looks the same, or a goal reachable several different ways?',
      'Does having three rules for one variant say anything about a variant nobody has built a rule for yet?',
    ],
    solution:
      "B and C. All three rules key on the same precondition, a visible new account, so an attacker who " +
      'reuses an existing, quiet, already-privileged credential instead leaves none of those signals ' +
      '(B). Coverage is honestly a property of a variant, not of a technique name, because two attackers ' +
      'reaching "persistence" can produce completely different, or completely absent, log evidence (C). ' +
      'A overclaims exactly the failure de.3.4 warned about, reading a covered variant as the whole ' +
      'technique. D repeats the mistake de.5.5 already flagged: nothing here is permanent.',
    expectedOutput: 'Options B and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b', 'c'],
        hint: 'One option claims three rules for one variant means the whole technique is handled. One claims a covered technique needs no more attention, ever.',
      },
    ],
    debrief:
      'The next three exercises find exactly this gap on this host: real accounts that could be compromised and leave none of the three signals de.6 built.',
    practice: [],
  },
  {
    id: 'de.8.2',
    moduleId: 'de.8',
    packageId: 'detection-engineering-foundations',
    order: 2,
    title: 'The population coverage has to reach',
    kind: 'terminal',
    goal: 'Size the population any account-based coverage claim has to be measured against.',
    prompt:
      'Count how many distinct accounts show a successful login in the log at all, the population any ' +
      'sudo- or provisioning-based rule would need to reach to be honestly called "covered".',
    teach: {
      concept:
        'A coverage claim about accounts is only as good as the population it was checked against. Six ' +
        'accounts logged into this host today; a rule that only ever gets exercised against the two ' +
        'involved in this incident has not been checked against the other four at all, and "covered" ' +
        'should mean checked against the whole population, not just the interesting part of it.',
      syntax: 'grep -oE "PATTERN" LOG | sort -u | wc -l',
      examples: [
        {
          command: 'grep -oE "Accepted (password|publickey) for [a-z-]+" /var/log/auth.log.1 | sort -u | wc -l',
          explains: 'The same distinct-account count against yesterday, to check whether six is a typical population size for this host.',
        },
      ],
    },
    hints: [
      'Extract the method and the account together, since the same account never uses more than one method here.',
      '`sort -u` collapses repeat logins from the same account into one.',
      `Write \`grep -oE "Accepted (password|publickey) for [a-z-]+" ${AUTH} | sort -u | wc -l\`.`,
    ],
    solution: `grep -oE "Accepted (password|publickey) for [a-z-]+" ${AUTH} | sort -u | wc -l`,
    expectedOutput: `${ACCEPTED_DISTINCT}`,
    checks: [
      numeric(ACCEPTED_DISTINCT, `${ACCEPTED_DISTINCT} distinct accounts logged in successfully today.`),
      { type: 'command-uses-pipe', hint: 'Extract the method and account, deduplicate, then count.' },
    ],
    debrief: `${ACCEPTED_DISTINCT} accounts. Two of them belong to this incident. The other four are the population a sudo- or provisioning-based rule has never had reason to fire on, which is exactly where an untested assumption lives.`,
    practice: [],
  },
  {
    id: 'de.8.3',
    moduleId: 'de.8',
    packageId: 'detection-engineering-foundations',
    order: 3,
    title: 'The trail an escalation rule depends on',
    kind: 'terminal',
    goal: 'Measure how much of the account population ever produces the signal de.6 relies on.',
    prompt:
      'Count how many sudo command lines exist in the whole log, the trail every rule in de.6 that ' +
      'watches privilege escalation actually depends on.',
    teach: {
      concept:
        'A rule keyed on sudo activity depends on the account actually using sudo. That is a fact about ' +
        'the account, not about the rule, and an account that never touches sudo, by role or by habit, ' +
        'produces this trail\'s absence permanently, compromise or not.',
      syntax: 'grep -c "PATTERN" LOGFILE',
      examples: [
        {
          command: 'grep -c "; COMMAND=" /var/log/auth.log.1',
          explains: 'The same count against yesterday, to see whether five sudo commands in a day is typical for this host.',
        },
      ],
    },
    hints: [
      'Every sudo command line carries the literal text "; COMMAND=".',
      'A plain `grep -c` is enough.',
      `Write \`grep -c "; COMMAND=" ${AUTH}\`.`,
    ],
    solution: `grep -c "; COMMAND=" ${AUTH}`,
    expectedOutput: `${COMMAND_LINES}`,
    checks: [numeric(COMMAND_LINES, `${COMMAND_LINES} sudo commands in total today.`)],
    debrief: `${COMMAND_LINES} commands, from four of the six accounts that logged in. The other two never appear here at all, and de.8.4 asks what that means.`,
    practice: [
      drill(
        'de.8.3-p1',
        'Count sudo commands run by testuser, using the actor-scoped pattern from de.6.4.',
        {
          note: 'Two, already known from earlier in this package. Repeating it here is the point: the same measurement, read again from a coverage angle rather than a technique angle.',
          syntax: 'grep -c "sudo:.*ACCOUNT :" LOGFILE',
        },
        `grep -c "sudo:.*testuser :" ${AUTH}`,
        [numeric(TESTUSER_ACTOR_COMMANDS, `${TESTUSER_ACTOR_COMMANDS} commands for testuser.`)],
      ),
      drill(
        'de.8.3-p2',
        'Count sudo commands run by rchen.',
        {
          note: 'One, for routine administration, an ordinary account actually producing this trail.',
          syntax: 'grep -c "sudo:.*ACCOUNT :" LOGFILE',
        },
        `grep -c "sudo:.*rchen :" ${AUTH}`,
        [numeric(RCHEN_ACTOR_COMMANDS, `${RCHEN_ACTOR_COMMANDS} command for rchen.`)],
      ),
      drill(
        'de.8.3-p3',
        'Count sudo commands run by svc-backup, an account that logged in twice today.',
        {
          note: 'Zero. This account logged in successfully and never once produced the trail a sudo-based rule depends on, not because anything is wrong, but because its role never requires it.',
          syntax: 'grep -c "sudo:.*ACCOUNT :" LOGFILE',
        },
        `grep -c "sudo:.*svc-backup :" ${AUTH}`,
        [numeric(SVC_BACKUP_ACTOR_COMMANDS, 'Zero sudo commands for svc-backup.')],
      ),
    ],
  },
  {
    id: 'de.8.4',
    moduleId: 'de.8',
    packageId: 'detection-engineering-foundations',
    order: 4,
    title: 'The quiet accounts',
    kind: 'short-answer',
    goal: 'Name exactly which accounts a sudo- and provisioning-based ruleset cannot see, and why.',
    prompt:
      `Six accounts logged in successfully today. Only four (rchen, jmartel, testuser and sysmon) ever ` +
      'appear running a sudo command. In four or five sentences, name the accounts that logged in and ' +
      'left no privilege-escalation trail at all, and say what that means for a detection posture built ' +
      'only on sudo activity and account provisioning.',
    teach: {
      concept:
        'An account that never uses sudo is not thereby suspicious, most accounts on most hosts never ' +
        'need to, and that is exactly the problem: a quiet, low-privilege pattern of access is ' +
        'indistinguishable in this log from a quiet, low-privilege pattern of access by somebody who ' +
        "should not be there. The rules de.6 built have nothing to say about that account either way.",
      examples: [
        {
          command: 'svc-backup: 2 logins, 0 sudo commands, ever',
          explains: 'A real account whose normal behaviour and a quiet compromise would look identical to every rule built so far.',
        },
      ],
    },
    hints: [
      'Compare the six accounts from de.8.2 against the four named in the prompt.',
      "One of the two missing accounts logs in from an internal address, so even de.3.3's rule would not help there.",
      'What would a rule built on sudo or provisioning activity see if either of these two credentials were compromised?',
    ],
    solution:
      'svc-backup and dokafor are the two accounts that logged in successfully today and never once ' +
      'appear running a sudo command. For a detection posture built on de.6\'s three rules, compromising ' +
      'either credential would be invisible: no provisioning event, because nothing was created; no ' +
      'external-first-login event either, for svc-backup at least, since it logs in from an internal ' +
      'address every time; and no sudo-actor event, because the account never touches sudo, by role, ' +
      'compromised or not. A quiet, low-privilege account is the same log evidence whether it is being ' +
      'used exactly as intended or has been quietly handed to somebody else.',
    expectedOutput:
      'An answer naming svc-backup and dokafor specifically, and stating that a sudo/provisioning ruleset produces zero signal for either, compromised or not.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['svc-backup'],
          ['dokafor'],
          ['no sudo', 'never use sudo', 'no privilege escalation', 'no trail', 'quiet'],
          ['invisible', 'blind', 'nothing would fire', 'no rule catches', 'zero signal'],
        ],
        hint:
          'Name both accounts by name, and say plainly that none of de.6\'s three rules produces any signal for either of them, compromised or not.',
      },
    ],
    debrief:
      'This is the harder half of coverage: not "what technique has no rule" but "which real, ordinary accounts would a compromise of look exactly like nothing happening at all."',
    practice: [],
  },
  {
    id: 'de.8.5',
    moduleId: 'de.8',
    packageId: 'detection-engineering-foundations',
    order: 5,
    title: 'Writing the honest entry',
    kind: 'multiple-choice',
    goal: 'Choose the coverage-map entry that states a gap honestly rather than minimising it.',
    prompt:
      'You are writing the coverage-map entry for "compromise of a quiet, low-privilege account with no ' +
      'sudo or provisioning history." Which entry is the honest one?',
    teach: {
      concept:
        'An honest coverage-map entry names the gap, says why detection cannot close it, and points at a ' +
        'control outside detection that could. Undercounting a gap because today\'s population happens ' +
        'to be small is how a two-account risk quietly becomes a twenty-account risk with the same map ' +
        'entry still on file, unread, from when it was written.',
      examples: [
        {
          command: '"Uncovered: 0 accounts fit this profile" (written the day before a new hire)',
          explains: 'True on the day it was written, and stale the moment the population changes.',
        },
      ],
    },
    options: [
      { id: 'a', label: 'Not applicable, since no such account has been compromised yet.' },
      {
        id: 'b',
        label:
          'Uncovered: any account with no sudo history and no external-login history is invisible to every rule in this package. A compensating control is needed outside detection, such as a periodic access review of quiet service and low-privilege accounts.',
      },
      { id: 'c', label: "Covered, since de.6 built three rules for account-based persistence." },
      {
        id: 'd',
        label: 'Low priority, since only two accounts (svc-backup, dokafor) fit this profile today.',
      },
    ],
    hints: [
      "An entry should be true regardless of whether the gap has been exploited yet.",
      'Does de.6\'s coverage of new-account persistence say anything about an account that was never new and never provisioned?',
      "Does today's small population bound tomorrow's?",
    ],
    solution:
      'B. It names the gap precisely (no sudo history and no external-login history), states plainly ' +
      'that detection cannot close it, and points at a control outside detection, an access review, that ' +
      'could. A confuses "not yet observed" with "not a risk", which is the exact failure de.3.4 named. C ' +
      "repeats de.8.1's overclaim: de.6's rules cover a different variant entirely. D undercounts by " +
      "treating today's population as a ceiling, when the honest entry should hold regardless of how " +
      'many accounts happen to fit the profile on the day it was written.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Look for the option that names the gap, states the limit of detection honestly, and proposes a control outside it.',
      },
    ],
    debrief:
      'A coverage map is a list of honest sentences about what cannot be seen, not a scoreboard of rules shipped. The entry that survives a second reading six months later is the one that never depended on how many accounts fit the profile the day it was written.',
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
    {
      id: 'de.4',
      packageId: 'detection-engineering-foundations',
      order: 4,
      title: 'Correlation: what several events mean together',
      summary:
        'Measuring a burst of failures that ends in a success from the same source, reading the sequence in order, and the account this kind of rule is structurally blind to.',
      exercises: MODULE_DE_4,
    },
    {
      id: 'de.5',
      packageId: 'detection-engineering-foundations',
      order: 5,
      title: 'Baselining a normal account against an odd one',
      summary:
        'Telling a pattern from a threshold by measuring what a known-benign account actually does, then setting a threshold derived from that baseline instead of a guess.',
      exercises: MODULE_DE_5,
    },
    {
      id: 'de.6',
      packageId: 'detection-engineering-foundations',
      order: 6,
      title: 'One technique, several signals',
      summary:
        'Mapping account-creation persistence to three independent rules, provisioning, a first login, and an actor-scoped command, and what a guessing-only ruleset misses about it.',
      exercises: MODULE_DE_6,
    },
    {
      id: 'de.7',
      packageId: 'detection-engineering-foundations',
      order: 7,
      title: 'Detection as code',
      summary:
        'Writing a rule as structured fields instead of a one-off pipeline, what that buys in review and testing, and the false confidence it can manufacture instead.',
      exercises: MODULE_DE_7,
    },
    {
      id: 'de.8',
      packageId: 'detection-engineering-foundations',
      order: 8,
      title: 'A harder pass at coverage',
      summary:
        'Reading a covered technique as one variant rather than the whole thing, sizing the account population coverage has to reach, and naming the quiet accounts a sudo-based ruleset cannot see.',
      exercises: MODULE_DE_8,
    },
  ],
};
