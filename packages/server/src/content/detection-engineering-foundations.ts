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
    'Start from what most jobs on a security team actually are: reactive. Somebody notices something ' +
    'wrong right now, an alert, a report, a strange login, and works out what happened. Detection ' +
    'engineering is the one seat that is not reactive. Think of the difference between a locksmith ' +
    'called out after a break-in, who figures out how the thief got in this one time, and the person ' +
    'who afterward redesigns the lock itself so that trick stops working on every door in the ' +
    'building, whether anyone is watching or not. The locksmith solves one event. A detection ' +
    'engineer builds something that keeps working after they have gone home for the day.\n\n' +
    'That "something left behind" is called a RULE, and underneath all the software it might run ' +
    'inside, a rule is only ever two things bolted together: a PATTERN, a precise description of what ' +
    'suspicious activity looks like in the data, and a DECISION, what should happen automatically the ' +
    'moment that pattern shows up. Strip away the dashboard, the ticketing system, the alerting ' +
    'platform built on top, and a rule is still just that: match these lines, and when you do, raise ' +
    'this. Everything else is plumbing around one small idea.\n\n' +
    'You can build the simplest possible version of a rule with a single command, which is why this ' +
    'package starts here instead of inside some detection platform. `grep` searches text for a pattern ' +
    'and prints every line that matches it. Add `-c` and, instead of printing the lines, it counts ' +
    'them: `grep -c "PATTERN" LOGFILE` tells you exactly how many times that pattern occurs in that ' +
    'file. That count is the FIRE COUNT of a rule, how many times it would have gone off, which is the ' +
    'first number a detection engineer needs before they can judge whether a rule is any good at all.\n\n' +
    'This matters before anything else in the package because every skill that follows, tuning a rule, ' +
    'testing it against history, mapping what it can and cannot see, is really just refinement of this ' +
    'one pair: the pattern, and the decision wired to it. A detection engineer who cannot say plainly ' +
    'what their rule matches, and what it does when it matches, does not have a rule yet, no matter how ' +
    'much software surrounds it.',
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
    'Every rule has a cost, and it is not paid in computer time, it is paid in a human being\'s ' +
    'attention. Every time a rule fires, some person on the security floor has to stop what they are ' +
    'doing, open the alert, and decide whether it is real. That decision takes minutes even when the ' +
    'answer is "no, nothing is wrong," and a rule that fires constantly and is almost always nothing is ' +
    'like a car alarm that goes off every time a leaf lands on the hood: everyone on the street learns ' +
    'to ignore it within a week, including the one night somebody is actually breaking in.\n\n' +
    'That is why a detection engineer treats noise as seriously as they treat catching the thing. A ' +
    'rule that ignores the balance between the two is worse than no rule at all, not merely useless, ' +
    'because it actively trains the people watching it to stop looking. Once an alert has been wrong a ' +
    'hundred times in a row, the hundred-and-first time, when it is finally real, gets dismissed just ' +
    'as fast as the rest.\n\n' +
    'The number that puts a figure on this is called PRECISION: of everything the rule fired on, what ' +
    'fraction of it was actually the thing you were trying to catch. It is a simple fraction, true ' +
    'positives divided by everything the rule matched, expressed as a percentage. A rule sitting at ' +
    'twenty per cent precision is asking a human operator to open five alerts to find one real one, ' +
    'which means being wrong four times out of every five, and doing that all day is exactly what burns ' +
    'an operator out on a specific alert until they stop trusting it at all.\n\n' +
    'Measuring precision starts the same way measuring the fire count did: filter the log to the ' +
    'pattern, then filter again to the source you already know is the real intrusion, and compare the ' +
    'two counts. Chaining two `grep` commands with a pipe, `grep "PATTERN" LOG | grep -c SOURCE`, does ' +
    'exactly that: the first stage narrows the log down to everything the rule would match, and the ' +
    'second counts how much of that narrowed set belongs to one specific source. That comparison, the ' +
    'whole versus the part that mattered, is precision made visible on a terminal.',
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
    'Writing a rule that looks reasonable on paper is not the same as knowing what it will actually ' +
    'do once it is turned on, and two disciplines exist to close that gap before a rule ever reaches a ' +
    'real operator.\n\n' +
    'The first is BACKTESTING: before a rule ships, run it against data that has already happened, ' +
    'yesterday\'s logs, last week\'s, rather than waiting to find out today. Think of it the way a pilot ' +
    'runs a flight plan through a simulator before ever taking off: the simulator cannot promise ' +
    'nothing will go wrong in the air, but it catches the mistakes that would have been obvious in ' +
    'hindsight, cheaply, before anyone is depending on the outcome. A rule backtested against history ' +
    'tells you two things at once, how often it would have fired, and how much of that firing would ' +
    'have been noise, both of which are far cheaper to learn from a log file than from an operator\'s ' +
    'wasted morning.\n\n' +
    'The second is COVERAGE: measuring which attacker techniques your rules can actually see, and, ' +
    'just as importantly, which ones they cannot. This matters because silence is ambiguous on its own. ' +
    'A quiet dashboard can mean nothing bad is happening, or it can mean something bad is happening in ' +
    'a way none of your rules were built to notice, and those two situations feel identical from behind ' +
    'the screen. Coverage turns that ambiguity into a list: a technique with no rule against it becomes ' +
    'a visible, nameable gap instead of a silence that gets mistaken for safety.\n\n' +
    'Both disciplines run on the same tool you have already been using. Pointing `grep -c "PATTERN"` at ' +
    'a rotated, historical log file instead of today\'s is a backtest. Breaking a rule\'s fire count down ' +
    'by source with `sort | uniq -c | sort -rn` is how you build the evidence a coverage or tuning ' +
    'decision should be based on, rather than a hunch about which source looks suspicious. A rule ' +
    'nobody has backtested is not a finished rule, it is a guess with a ticket queue attached to it.',
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
      'B. Detection engineering is preventive: the thing it produces is a durable rule that keeps ' +
      'watching and catches the next occurrence of a threat automatically, with no human needing to ' +
      'look at anything in the moment. The other three options are all real, valuable jobs on a ' +
      'security floor, but each one belongs to a different seat: a triaged alert queue (A) is what an ' +
      'operator, sometimes called an analyst, produces by working through alerts one at a time; a ' +
      'preserved disk image (C) is evidence gathered by a forensic investigator after something has ' +
      'already happened; and a patched server (D) is the outcome of whoever fixes the underlying ' +
      'vulnerability. Only the rule keeps working, unattended, after everyone involved in writing it ' +
      'has logged off.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Which of these keeps working after the person who made it goes home?',
      },
    ],
    debrief:
      'Hold onto that distinction, because it explains the shape of this entire package: everything after this exercise is spent building that one rule, first as a pattern you can literally run against real logs and count, then tuning it, testing it, and mapping what it does and does not see. None of that is investigation. All of it is building something that keeps working after you stop looking at it.',
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
    debrief: `${FAILED_TOTAL} alerts. On one host, in one day. Stop and picture what happens to that number in a real environment: a company does not run one server, it runs hundreds, so this same simple rule, on this same simple pattern, would generate many multiples of ${FAILED_TOTAL} alerts a day across the estate. Nobody is reading a number that size, which means this rule, exactly as written, produces nothing more useful than a figure on a dashboard that nobody has time to open. Writing the pattern was the easy part. Everything from here on is about making that number mean something an actual person can act on.`,
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
    debrief: `${FAILED_ATTACKER} true positives out of ${FAILED_TOTAL} alerts. Turn that into the precision figure from this exercise's teaching: ${FAILED_ATTACKER} divided by ${FAILED_TOTAL} comes out to ${PRECISION_NAIVE} per cent. In plain terms, an operator sitting down to work through this rule's alerts one by one would be looking at nothing, an accident, or an already-explained event roughly three times out of every four they open, and only find the real intrusion on the fourth. That ratio is the actual cost of the rule as written, not a guess about how annoying it might be.`,
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
      `B and C. It is true that the ${FAILED_ATTACKER} true positives are technically sitting inside ` +
      `the ${FAILED_TOTAL} alerts, which is exactly why A is the tempting wrong answer: on paper the ` +
      'rule "worked," but true positives nobody will ever actually reach are worth nothing in practice, ' +
      'since no operator has time to open every single one. That volume makes the rule unusable as a ' +
      'day-to-day tool (B), and it is worse than merely unusable: an operator who opens this same alert ' +
      'hundreds of times and finds nothing wrong learns, correctly from their point of view, that this ' +
      'alert is not worth their time, and starts dismissing it on reflex, including the one time it is ' +
      'real (C). D goes too far in the other direction: the underlying signal is genuine, an actual ' +
      'attacker really is in that log, so the fix is to tune the rule down to something usable, not to ' +
      'throw it away. E sounds like a fix and is not one: relabelling the alert as more severe changes ' +
      'how it looks on a screen without changing how many of them there are, and volume, not the label, ' +
      'is what wears an operator down.',
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
      'Severity inflation, marking a noisy rule as "critical" instead of fixing it, is the standard first response to this problem in a real security team, and it never actually works. The reason is simple once you say it out loud: how tired an operator gets of an alert is a function of how many times they see it, not what color or label is attached to it. Making a rule louder does not make it quieter.',
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
      'A good detection is not the one that catches the most things in theory, it is the one whose ' +
      'output a real person can actually work through in a normal day. The failed-password rule does, ' +
      `technically, contain the intrusion somewhere inside it, but at ${FAILED_TOTAL} alerts a day on a ` +
      'single host, nobody ever reaches the true positives buried in there, and the operators assigned ' +
      'to it learn, reasonably, to dismiss it without reading it closely, so in practice it catches ' +
      'nothing at all. The success rule fires only nine times, a number one person can read start to ' +
      'finish every single morning with coffee still in hand, and two of those nine lines are the ' +
      'attacker actually getting in. Given that choice, I would ship the quiet rule: precision matters ' +
      'more than recall when the recall is only theoretical, because an alert that exists on paper but ' +
      'that nobody ever reads has not detected anything in any way that matters. The loud rule is not ' +
      'worthless, it is worth keeping around as context to pull up once something else has already told ' +
      'you where to look, but it should never be the thing that pages a human awake at three in the ' +
      'morning.',
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
      'Recall, the fraction of real incidents a rule technically catches, that nobody can actually act on is not really recall at all, it is a number on a slide. This is the judgement call a detection engineer is paid to make: not "does the logic contain the answer" but "will a human, at the end of a long shift, actually get to it," and it is exactly why detection engineering is treated as its own job rather than something anyone who can write a search query can do on the side.',
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
        'The previous module measured a real problem: a rule that is technically right and practically ' +
        'unusable because it fires too often. TUNING is the general name for the work of fixing that, ' +
        'and the simplest form of tuning is subtraction: taking a specific, known source of noise out ' +
        'of a rule\'s output so what remains is worth an operator\'s time. Not subtraction for its own ' +
        'sake, though, subtraction with a reason attached that somebody else could check later. That ' +
        'reason is what makes it tuning and not just deleting evidence because it is inconvenient.\n\n' +
        'The tool for this is `grep -v`, the mirror image of the plain `grep` you have been using. ' +
        'Plain `grep "PATTERN"` prints lines that match. `grep -v "PATTERN"` prints lines that do NOT ' +
        'match, so chaining it onto the end of a rule, after the pipe that already narrowed the log to ' +
        'your pattern, removes one specific thing from the result. This is the shell\'s version of ' +
        'what a real detection platform calls an EXCLUSION: a standing instruction that says "this rule ' +
        'fires on everything matching the pattern, except this."\n\n' +
        'The syntax is the easy part. What actually makes an exclusion safe to ship is the reason ' +
        'behind it, because an exclusion is really a promise: "I am telling this rule to stop looking ' +
        'at this thing, forever, until somebody changes it back." A promise like that needs to name ' +
        'something ACCOUNTABLE, a specific host with a specific, known, explainable cause, someone owns ' +
        'it, someone could be asked about it. "This internal monitoring host has a stale password and a ' +
        'ticket already open to fix it" is accountable: it names one thing, gives a reason, and implies ' +
        'an end date. "This address shows up a lot" is not accountable at all, it only describes a ' +
        'symptom, and excluding on a symptom is how a detection quietly stops looking at exactly the ' +
        'kind of thing it was built to catch.',
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
    debrief: `${FAILED_TOTAL} down to ${FAILED_TUNED}, from one exclusion, on one host. Line that up against the precision figure from the previous module: it moved from ${PRECISION_NAIVE} per cent to ${PRECISION_TUNED} per cent, a real, measurable improvement, and notice what did not change to get it. The pattern is identical. The decision attached to it is identical. The only thing that moved was one accountable exclusion, which is what makes this kind of tuning cheap: it improves the rule an operator experiences without touching the detection logic itself at all.`,
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
        'An exclusion, on its own, is only half finished. Removing a source from a rule and never ' +
        'checking what that removal actually cost is how a well-intentioned tuning change quietly ' +
        'turns into the thing it was supposed to avoid: making the rule blind to the exact intrusion it ' +
        'exists to catch. A REGRESSION TEST is the check that closes that gap, and the idea is borrowed ' +
        'from software engineering, where a regression test re-runs old, already-passing checks after a ' +
        'change, specifically to catch anything the change accidentally broke.\n\n' +
        'Here, the test is simple and specific: the incident that made you write the rule in the first ' +
        'place is the thing that must still get caught. Run the newly tuned rule, exclusion and all, ' +
        'against the known-bad source, the one you already confirmed is the real intrusion, and confirm ' +
        'the count did not move. If it is unchanged, the exclusion removed noise and nothing else. If it ' +
        'dropped, the exclusion removed part of the very thing you were trying to catch, which you would ' +
        'have no way of knowing without running this check.\n\n' +
        'This single habit is what separates real TUNING from SUPPRESSION, and the reason it needs its ' +
        'own name is that the two are indistinguishable from the outside: both make an alert queue ' +
        'quieter, both look identical on a dashboard, and only one of them still detects anything at ' +
        'all. In a mature detection platform, this is not something a person remembers to do by hand ' +
        'each time, it is a saved test attached to the rule that runs automatically on every future ' +
        'change, for exactly the reason you are about to watch play out below.',
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
    debrief: `Unchanged at ${FAILED_ATTACKER}. That number staying exactly where it was before the exclusion is the whole point: the rule got ${FAILED_MONITOR} alerts quieter and lost nothing it was actually there to catch. A tuning change that cannot show you this comparison, before and after, on the exact incident that mattered, is not one you should trust yet, no matter how reasonable the justification for it sounds.`,
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
        'TUNING makes a rule quieter without losing what it was built to catch. SUPPRESSION makes a ' +
        'rule quieter by giving something up, whether or not anyone meant to. Both produce the exact ' +
        'same visible result on a dashboard: a smaller number, and a person thanked for fixing a noisy ' +
        'alert. Nothing about looking at the "after" number tells you which one you are looking at.\n\n' +
        'The difference lives entirely in what got removed. A safe exclusion names something ' +
        'ACCOUNTABLE: one specific host or address that somebody owns, can explain the presence of, and ' +
        'would notice if its behaviour changed. An unsafe one excludes a CATEGORY instead, "this whole ' +
        'range," "anything noisy," "accounts that do not exist," because a category describes many ' +
        'things at once, most of them harmless, and categories are exactly where an attacker who wants ' +
        'to stay hidden goes looking for cover. If you have ever heard "hiding in plain sight," this is ' +
        'the mechanical version of it: get yourself classified into the group that already gets ' +
        'excluded, and the rule stops looking at you specifically because it stopped looking at anyone ' +
        'wearing that label.\n\n' +
        'The regression test from the previous exercise is the only thing that reliably tells the two ' +
        'apart before a real intrusion does it for you the hard way. An accountable exclusion passes it: ' +
        'the known-bad source still gets caught. A category-shaped exclusion often fails it silently, ' +
        'because the incident you cared about turns out to live inside the very category you just told ' +
        'the rule to ignore.',
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
      'A only. It names one host, somebody owns it, there is an open ticket explaining exactly why it ' +
      `is noisy, and running the regression test from the previous exercise shows the ${FAILED_ATTACKER} ` +
      'real attacker alerts survive it untouched. B removes an entire address range as a category, and ' +
      'this specific intrusion happened to come from inside that range, so shipping it would have hidden ' +
      'the incident completely, exactly the failure mode the previous exercise was built to prevent. C ' +
      'excludes every attempt to guess at accounts that do not exist, which sounds like harmless bot ' +
      'traffic and is, mechanically, precisely what this attacker did before landing on an account name ' +
      'that did exist: excluding it removes the earliest visible warning sign of the whole intrusion. D ' +
      'is the most dangerous of the four precisely because it sounds the most reasonable: an automatic ' +
      'rule that hides anything loud enough teaches an attacker exactly one lesson, be loud enough to ' +
      'qualify, and you disappear.',
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
      'Option D is not a hypothetical trap answer, teams really do build automatic suppression on high-volume sources, usually with good intentions, to stop the loudest alerts from drowning out everything else. Look at what it actually is, mechanically: a standing rule that any source loud enough gets hidden from view. That is a rule that rewards an attacker for being loud, which is the exact opposite of what a detection engineer is trying to build.',
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
        'Excluding a known source, the technique from earlier in this module, works, and it does not ' +
        'scale. Every noisy source you find needs its own exclusion, each one needs its own owner and ' +
        'ticket and expiry, and the list only ever grows, because somebody has to remember, months ' +
        'later, why each individual line is there before they can safely remove it. There is a second, ' +
        'entirely different way to improve a rule that avoids that problem altogether: instead of ' +
        'telling the rule what to ignore, tell it more precisely what to look for in the first place.\n\n' +
        'That is what a NARROWER PATTERN means. Where the earlier "Failed password" pattern matched any ' +
        'wrong password at all, "Invalid user" only matches an attempt against an account name that ' +
        'does not exist on this host. Think about what a real, honest employee does by accident: they ' +
        'occasionally fat-finger their own password, everyone does, but they essentially never mistype ' +
        'their own username, since that is not something people get wrong about themselves. A wave of ' +
        '"Invalid user" attempts against dozens of made-up account names is not a typo, it is somebody ' +
        'guessing, which makes it a stronger, cleaner signal to begin with.\n\n' +
        'A narrower pattern like this needs no maintenance at all. There is no list to keep, no owner to ' +
        'track down, no entry that quietly goes stale after the person who added it moves teams. Where ' +
        'you can buy the same improvement in precision by matching something more specific instead of by ' +
        'excluding something noisy, that option is almost always the better one, because it is a fact ' +
        'about the pattern itself rather than a fact somebody has to keep remembering.',
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
    debrief: `${INVALID_USER} against ${FAILED_TOTAL}. That is a real improvement in volume, and it came with no exclusion list to maintain: the monitoring host disappears from this rule entirely on its own, not because anybody excluded it, but because it authenticates as a real, existing account and this pattern was never looking at that kind of failure to begin with. A narrower pattern earns precision as a fact about what it matches, not as a promise somebody has to keep remembering to honor.`,
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
        'An exclusion, once shipped, tends to outlive the person who wrote it. Picture the situation ' +
        'six months from now: a different engineer notices a rule staying silent about something it ' +
        'obviously should have caught, traces the silence back to an exclusion nobody documented, and ' +
        'has to decide, with zero context, whether it is safe to remove. Without anything written down, ' +
        'that decision gets made by guesswork, and either guess is bad: leave a possibly-stale exclusion ' +
        'in place and the blind spot continues, or remove it blind and risk breaking something that was ' +
        'actually still valid.\n\n' +
        'A CHANGE NOTE is what turns that guesswork into an actual decision. It is a short written record ' +
        'attached to the exclusion at the moment it ships, covering three things: the fire count before ' +
        'and after, so a reader can see the size of what changed; the regression evidence, so a reader ' +
        'can see that the real detection survived it; and the condition under which the exclusion stops ' +
        'being valid, so a reader six months later does not have to reconstruct that condition from ' +
        'nothing.\n\n' +
        'That last piece, the expiry condition, is the one almost everybody skips, because at the moment ' +
        'you write the exclusion the reason for it feels obvious and permanent. It rarely is. A stale ' +
        'credential gets rotated, a host gets rebuilt, a temporary workaround becomes load-bearing ' +
        'infrastructure nobody remembers is temporary. Writing down in advance what would make this ' +
        'exclusion wrong is the one habit that turns a permanent, silent blind spot into something a ' +
        'future reviewer can actually check and close.',
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
      `${PRECISION_TUNED} per cent, meaning an operator working this rule now spends noticeably less ` +
      'time opening alerts that turn out to be nothing. This exclusion becomes wrong the moment that ' +
      'credential is rotated or the host is rebuilt, because after either of those events any failed ' +
      'password from this address is no longer explained by a known stale password, so it should be ' +
      'removed when the owning ticket closes rather than left sitting in the rule indefinitely.',
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
      'The expiry condition is the part almost nobody writes, and its absence is the actual reason exclusion lists grow forever and never get reviewed: without a written trigger for "this no longer applies," there is never a moment that forces anyone to look at an old exclusion again. An exclusion with no expiry condition is not really temporary tuning at all. It is a permanent blind spot wearing a change note as a disguise.',
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
      'A day of somebody else\'s history costs you a single command to check. That is a good trade: it tells you whether the volume you measured today is simply what this host normally looks like, or whether today\'s number is itself the first sign something is wrong, a distinction you cannot make at all by staring at today\'s number in isolation.',
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
      'Look closely at what sits at the top of this ranking: the two loudest sources in the whole rule are a harmless monitoring box and an active intrusion, sitting right next to each other. Anybody who tunes purely by volume, excluding whatever is loudest without asking who it belongs to, would remove both in the same afternoon and call it progress.',
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
        'Step back and ask why every rule built on failure in this package has been so loud. It is ' +
        'not bad luck, and it is not bad rule-writing, failure is simply common: people mistype ' +
        'passwords, scripts retry, scanners knock on doors that are not open. A detection built on top ' +
        'of something common will always need heavy tuning just to be usable, because the thing it ' +
        'watches for happens constantly for entirely innocent reasons.\n\n' +
        'There is a different way to build a rule that starts quiet instead of starting loud: base it ' +
        'on something that is already rare on its own, then narrow it with one more unexpected ' +
        'condition. A successful login is already rare on a server, most of the traffic hitting it is ' +
        'failed guesses and automated noise, not real people getting in. A successful login from ' +
        'outside the company network is rarer again, and on a host that only staff and internal ' +
        'automation are ever supposed to reach, it edges close to never. Two ordinary conditions ' +
        'stacked together, "logged in successfully" and "came from outside," do the filtering work that ' +
        'an exclusion list would otherwise have to do by hand.\n\n' +
        'That combination, success plus an unexpected condition, is worth waking a person up for, ' +
        'because it genuinely does not happen very often, and when it happens it usually means ' +
        'something. Instead of hundreds of alerts a day like the failure-based rules earlier in this ' +
        'package, a rule shaped this way fires a small handful of times, which a person can actually ' +
        'read every one of.',
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
      'A handful of lines a day, small enough to read every one, and the intrusion is sitting right there among them. This is the rule that should have existed before the incident ever happened, quiet enough that nobody would have tuned it out, specific enough that it would have caught the very first successful login the attacker made. Writing it afterwards, once you already know what to look for, is exactly what this seat exists to do: turn one incident into a rule that would have stopped the next one from ever needing to happen.',
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
        'A COVERAGE MAP is a simple idea: list out the known attacker techniques, guessing passwords, ' +
        'moving between machines, stealing data, and next to each one, note whether you actually have a ' +
        'rule that would notice it happening. Building one turns a vague, comforting sentence like "we ' +
        'have 340 rules" into a much more useful, and much more uncomfortable, sentence: "we can see ' +
        'these specific techniques, and we cannot see those." All of the real value sits in the second ' +
        'half of that sentence.\n\n' +
        'Here is why that second half matters so much. Imagine a technique with zero rules against it. ' +
        'On any given day, no alerts fire under that heading. Now imagine the exact same thing is true ' +
        'because nobody has ever actually attempted that technique against you. From the dashboard, ' +
        'these two situations look completely identical: silence, either way. The only way to tell them ' +
        'apart is to have already written down, in advance, which kind of silence you are looking at, ' +
        'which is the entire reason a coverage map has to exist before the silence happens, not after.\n\n' +
        'A gap that has been mapped is a decision waiting to be made: you know exactly where the blind ' +
        'spot is, and you can choose to build a rule for it, accept the risk, or add a different kind of ' +
        'control. A gap that nobody ever mapped is not a decision at all, it is an unexamined belief that ' +
        'everything is fine, resting on nothing but the absence of noise.',
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
      'B and C. An empty column on a coverage map means the technique underneath it would not be seen ' +
      'even if it happened right now, so the fact that no alerts have fired from it carries no ' +
      'information at all about whether it is actually happening (B). Once you know that, the gap stops ' +
      'being a vague worry and becomes something concrete: a prioritised piece of work you can point to ' +
      'and argue a budget holder into funding (C). A is the exact failure this whole discipline exists to ' +
      'prevent, mistaking the absence of alerts for the absence of danger, when really it might just be ' +
      'the absence of a rule. D confuses raw count with genuine coverage: a category stuffed with ' +
      'fourteen noisy, low-quality rules that nobody actually reads is worse covered in any way that ' +
      'matters than a category with a single rule that is quiet and trustworthy.',
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
      'On this host, exfiltration, data actually leaving the network to somewhere it should not go, was exactly that kind of gap: 417 kilobytes left for an unnamed address, and not a single rule anywhere in this ruleset would have said a word about it. That silence was never evidence that nothing was leaving. It was evidence that nobody had built anything to look. The packet capture covered in the Networking package is where a detection for that gap actually gets built.',
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
      'The backtest genuinely establishes two things: the fire rate, how often this rule would go off ' +
      'across thirty real days, and the precision of what it caught, since all four hits turned out to ' +
      'be real. That tells me the rule will not drown the queue and that what little it catches is ' +
      'trustworthy, which is worth knowing. It does not establish RECALL, the fraction of everything it ' +
      'should have caught that it actually caught, and I genuinely have no way to know what this rule ' +
      'missed over those thirty days, because historical log data has no labels on it saying "this line ' +
      'was an attacker and the rule ignored it." Anything an attacker did during that month that this ' +
      'rule\'s pattern did not match is completely invisible to the test, and if the estate had already ' +
      'been quietly compromised the whole time, the backtest would look exactly the same as it does now: ' +
      'four confident hits and a clean bill of health. It is also bounded by what actually happened here: ' +
      'a technique nobody has ever attempted against this estate is untested by this backtest, not ' +
      'proven safe. Before shipping this as high-confidence, I would pair the backtest with a deliberate ' +
      'test instead, running the actual technique myself or asking the red team to run it, and confirming ' +
      'the rule fires when I already know the answer, which is the only way to measure recall rather than ' +
      'quietly assume it.',
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
      'This gap between what a backtest can prove and what it cannot is exactly why purple teaming exists as its own discipline, deliberately running real attacker techniques against your own systems, with the defenders watching, specifically to see whether the rules fire. A backtest measures the noise a rule makes against whatever already happened. Only a deliberate, known test measures whether it actually catches the thing it was built for.',
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
        'Every rule built so far in this package is a SINGLE-EVENT rule: a pattern applied to one line ' +
        'of the log at a time, with no memory of any other line. That is powerful and it has a ceiling, ' +
        'because some of the most useful things worth detecting are not visible in any single line at ' +
        'all, only in the relationship between several of them.\n\n' +
        'A CORRELATION rule is what you build to see that relationship. Instead of asking "does this one ' +
        'line look bad," it asks something like "did the same account, from the same source, fail ' +
        'several times and then succeed." No single line in that story is suspicious on its own, a ' +
        'failed password happens constantly, a successful login happens constantly, but the same actor ' +
        'producing a burst of failures immediately before a success is a pattern that only exists across ' +
        'lines, not within one.\n\n' +
        'Plain `grep` cannot hold that kind of memory by itself, it only ever looks at one line at a ' +
        'time, which is why correlation in a real detection platform is usually built as a stateful ' +
        'query, something that can remember what it saw a moment ago and compare it against what it is ' +
        'seeing now. The underlying logic is not actually new, though: it is the same idea you have ' +
        'already been using, match a condition, then narrow by something else that has to be true ' +
        'alongside it, just applied across a sequence of events instead of inside a single one.',
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
      "B. The earlier rule is blind to this by construction, not by accident: `grep -v \"from 10.\"` " +
      'throws every internal address out of the results before the rule ever gets a chance to look at ' +
      'it, so an internal host performing the exact same failed-then-succeeded pattern is invisible to ' +
      'it no matter how suspicious that pattern is. A correlation rule keyed on the pattern of failure ' +
      'followed by success itself, rather than on where the source happens to sit on the network, would ' +
      'still catch that case. A is wrong because the two rules are keyed on entirely different ' +
      'conditions and can disagree about the same event. C overclaims: a later exercise in this package ' +
      'shows a case correlation misses too, so it is not a catch-all either. D mistakes cost for lack of ' +
      'value, needing two separate things to line up before firing is precisely what buys a correlation ' +
      'rule its precision, not a weakness of it.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'One option names something the external-success rule cannot see by its own definition.',
      },
    ],
    debrief:
      'The next four exercises measure exactly this pair of events on this host, one piece at a time: a burst of failures, then a success, from the same address, against the same account, so the relationship between the lines becomes as measurable as any single line already was.',
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
        'Before a correlation rule can be written, both halves of it need to be measured separately, ' +
        'the same way you would not draw a conclusion from a single blood test without knowing the ' +
        'normal range first. This exercise measures the first half: the size of the BURST, how many ' +
        'times one specific source failed against one specific account before it finally got in.\n\n' +
        'Size is what turns an ordinary event into a signal here, not shape. A burst of one or two ' +
        'failed attempts is exactly what a real person produces by fat-fingering their own password a ' +
        'couple of times before getting it right, which happens constantly and means nothing. A burst in ' +
        'the double digits, from one source, against one account, is not something a person does by ' +
        'accident, it is the fingerprint of an automated tool working through possibilities far faster ' +
        'and more patiently than any human would bother to. The log lines themselves look identical ' +
        'either way, "Failed password," over and over. The only thing that tells the two apart is ' +
        'counting how many of them there are.',
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
    debrief: `${TESTUSER_FAILED_ATTACKER} failures, from one address, against one account, and then, immediately after, it got in. That count is well past what a person mistyping their own password would ever produce, which is exactly the shape a correlation rule is built to recognise: not one suspicious line, but a burst followed by a success.`,
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
        'A log file like this one is written APPEND-ONLY: every new event gets added to the bottom, in ' +
        'the exact order it happened, and nothing already written ever gets rearranged. `grep` does not ' +
        'reorder anything either, it only removes lines that do not match, so whatever survives a ' +
        'filter comes back in the same chronological order it was written in.\n\n' +
        'That fact alone is enough to see a sequence of events without needing anything more ' +
        'complicated. Filter the log down to exactly the lines that mention both the account and the ' +
        'address you care about, and what is left, read top to bottom, is the story in the order it ' +
        'happened, no timestamp math required.\n\n' +
        'This is the cheapest form of correlation there is. A real detection platform can do this with a ' +
        'database join or a window function that explicitly compares timestamps across events, and ' +
        'those tools exist for good reasons at scale. But the underlying trick, in a log this small, is ' +
        'nothing more than narrowing the file down until only the story you care about is left on the ' +
        'screen.',
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
      'The whole correlation is readable on one screen once you filter down to it: repeated failure, then one success, same account, same address, in exactly that order. Nothing about that story required timestamps, a database, or a fancy platform, only narrowing the log until the noise around it was gone.',
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
        'A correlation rule built around "failure, then success" is only ever as good as its assumption ' +
        'that a failure will actually occur first, and that assumption is not always true. Guessing a ' +
        'password produces failures because guessing takes attempts. Being handed a working password ' +
        'directly, by someone who already has full control of the system, produces no failures at all, ' +
        'because there is nothing left to guess: nobody is guessing anymore, they already know the ' +
        'answer.\n\n' +
        'That is exactly the situation with an account an attacker creates for themselves after they are ' +
        'already inside. They set the password. They already know it. The first time that account logs ' +
        'in, it goes in clean, with zero failed attempts anywhere before it. The correlation rule that ' +
        'caught the earlier compromise has nothing at all to say about an account like this one, and it ' +
        'is important to be precise about why: it is not that the rule is poorly tuned or missing a ' +
        'setting, it is that the specific condition the rule is built to notice, a failure followed by a ' +
        'success, genuinely never happens for this kind of account.',
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
      'Zero failures, one success. A correlation rule needs both halves of its condition to be present before it can fire at all, and this account, by the nature of how it was created, only ever supplied one of them. That gap is not a flaw to be fixed in this rule. It is a limit to be aware of and to cover with a different kind of rule entirely.',
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
        'A rule only ever tells the truth about the exact mechanical condition it checks. It becomes ' +
        'dishonest, quietly, the moment somebody describes it using a bigger word than the mechanism ' +
        'actually supports. "Catches account compromise" is a claim about INTENT, what the rule is ' +
        'meant to accomplish in the abstract. "Fires on a failure followed by a success from the same ' +
        'source" is a claim about MECHANISM, the specific, narrow thing the rule actually checks for. ' +
        'Those two sentences sound like they describe the same rule, and they do not: the gap between ' +
        'them is precisely the space an attacker who does not trigger that specific mechanism can walk ' +
        'straight through, for free, while everyone believes "account compromise" is covered.',
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
      'A failed-then-succeeded correlation rule checks a mechanism, not the broader intent behind it: ' +
      'specifically, it needs a real, logged failure to exist before it has anything to pair with a ' +
      `success. testuser supplies both halves of that mechanism, ${TESTUSER_FAILED_ATTACKER} logged ` +
      'failures followed by a success from the same address, so the rule correctly fires. sysmon ' +
      'supplies only the second half: it was created by the attacker and handed a working password ' +
      'directly, so it never produces a single failed password for the rule to correlate against in the ' +
      'first place. The rule is not wrong, and it is not badly tuned, the mechanical condition it checks ' +
      'genuinely never occurs for an account provisioned this way. Seeing this second kind of compromise ' +
      'would need a rule keyed on an entirely different mechanism, such as watching for account ' +
      "provisioning itself, or watching for a brand-new account's very first login, which is exactly " +
      'what the next module in this package builds.',
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
      'A rule is only ever as broad as the exact mechanism it checks, never as broad as the name somebody gave it afterward. Naming that mechanism precisely, out loud, in the specific and slightly less impressive terms it actually deserves, is what stops a comfortable phrase like "we have a rule for account compromise" from quietly turning into a false sense of coverage.',
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
        'It is worth being precise here about what a PATTERN actually is and is not. A pattern describes ' +
        'a shape, "a failure, then another event, then a success," and a shape on its own carries no ' +
        'sense of scale. "Failure then success from the same source" describes an ordinary account\'s ' +
        'completely unremarkable Tuesday exactly as well as it describes a real compromise, word for ' +
        'word, because the shape never says how many failures, only that failures happened before the ' +
        'success. Something else has to supply the sense of how much is normal, and a pattern by itself ' +
        'does not carry that.\n\n' +
        'That something else is called a THRESHOLD, and the discipline of setting one honestly is called ' +
        'BASELINING: measuring what an account known to be doing nothing wrong actually produces on a ' +
        'real day, so a rule has an honest, factual number to compare an outlier against. Think of it the ' +
        'way a doctor reads a blood test, a single number means nothing on its own, it only becomes ' +
        'useful once you know the normal range for a healthy person, so you can see how far outside it ' +
        'this particular result falls.\n\n' +
        'Without a baseline, a threshold is just a number somebody picked because it sounded strict, and ' +
        'a number that sounds strict is not the same as a number that is actually true about this ' +
        'specific environment.',
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
      'C. Two failed passwords from an internal address, followed by a success, is the completely ' +
      'ordinary shape of somebody mistyping their own password once or twice before getting it right. ' +
      'The correlation rule from the previous module only ever checks the shape of events, not the size ' +
      'of them, so on its own it has no way to tell dokafor\'s two harmless failures apart from ' +
      'testuser\'s fifteen suspicious ones, both look identical to a rule that only asks "did a failure ' +
      'happen before a success." B is a distractor: that earlier correlation rule was explicitly built to ' +
      'also catch an internal source, so it is not limited to external addresses. D reaches for data this ' +
      'host does not actually need to answer the question: the account\'s own history, already measured, ' +
      'is enough on its own.',
    expectedOutput: 'Option C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['c'],
        hint: 'Ask what an ordinary person does by accident, and how many failures that produces.',
      },
    ],
    debrief:
      "The rest of this module measures dokafor's baseline and testuser's burst side by side, on purpose, so that whatever threshold ends up separating a harmless typo from a real intrusion comes from actual data about this specific host, rather than from a number that merely felt strict enough.",
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
        'A baseline is nothing more exotic than a number, taken from an account already known to be ' +
        'doing nothing wrong, that a future threshold can be measured against. It has to come from ' +
        "real, actual data on this specific host, on a real day, not from a generic industry slide deck " +
        'or somebody\'s gut feeling, because what counts as a normal number of mistyped passwords ' +
        'depends entirely on the actual humans who use this particular host, their habits, their typing, ' +
        'their memory for passwords, and not on some universal constant that applies everywhere equally.',
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
    debrief: `${DOKAFOR_FAILED}. That is the actual number an account doing nothing wrong produced on a real day on this host. Any threshold this rule ends up using should be measured against that real figure, not against a number that merely sounded strict when somebody typed it into a form.`,
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
        'A baseline is only ever useful in contrast to something else. The number two, on its own, ' +
        'means nothing at all, and neither does the number fifteen: what this rule actually needs is the ' +
        'relationship between the two numbers, not either one read by itself in isolation. This is the ' +
        'exact same reason a doctor needs to know the normal range for a healthy person before a single ' +
        'blood test result can be called high, low, or fine: the raw number on the lab report is ' +
        'meaningless until it is placed next to what normal actually looks like.',
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
    debrief: `${TESTUSER_FAILED_ATTACKER} against a baseline of ${DOKAFOR_FAILED}: more than ${BASELINE_RATIO_FLOOR} times the number a known-benign account produced on this same host, on this same day. Notice what is actually doing the work here: it is that ratio, the relationship between the two measured numbers, and not either number read on its own, that is the threshold worth building a rule around.`,
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
        'A threshold set as a multiple of a real, measured baseline can survive the obvious follow-up ' +
        'question, "why this number specifically," because the honest answer is a fact about this ' +
        'environment, "it is several times what a real account produced on a real day here," rather than ' +
        'a shrug. That does not mean a derived threshold magically resolves every case cleanly, though. ' +
        'There is real ground between the low baseline and the high, obvious outlier where the honest ' +
        'answer is neither a confident "this is fine" nor a confident "this is compromised," but a plain ' +
        '"this needs a person to look at it." A rule that pretends every case sorts neatly into safe or ' +
        'confirmed is not removing the judgement call, it is only hiding it somewhere nobody can see it ' +
        'being made.',
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
      `The baseline, measured from real data, is ${DOKAFOR_FAILED} failed passwords for an account ` +
      `that was doing nothing wrong. A threshold of several times that, for example more than ` +
      `${DOKAFOR_FAILED * 3} failures from a single source against a single account, is derived from ` +
      'what this environment actually produces day to day, rather than picked because it sounded ' +
      `appropriately strict on paper. testuser's ${TESTUSER_FAILED_ATTACKER} clears that threshold with ` +
      'plenty of room to spare, so it belongs firmly in the confident-alert bucket. An account that ' +
      'instead produced six or seven failures sits in the uncomfortable gap between the measured ' +
      'baseline and a confident alert, and the honest response is not to force a number in that gap into ' +
      'either bucket by guesswork: flag it for a human to actually look at, rather than auto-closing it ' +
      'as harmless or auto-escalating it as confirmed, because the data genuinely does not support ' +
      'certainty in either direction for a case like that.',
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
      'A threshold that can point to the actual data it came from survives a review by a skeptical colleague. A threshold that can only shrug and say "it felt right" does not, and it is worth remembering that "it felt right" is exactly how most bad thresholds get written.',
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
        'Deriving a threshold from real, measured data is strictly better than inventing a number that ' +
        'merely sounds strict, and it is important not to mistake that improvement for the finish line. ' +
        'One account, checked on one single day, is still a small anecdote, the exact same limit a ' +
        'thirty-day backtest earlier in this package ran into: it tells you what really happened in that ' +
        'one instance, and it says nothing at all about what a different, quieter account, or this same ' +
        'account on a genuinely bad Monday full of forgotten passwords, would have produced instead.',
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
      "A and B. Deriving the threshold from dokafor's real, measured day is genuinely better than " +
      'inventing a number out of thin air (A), and at the same time it really is only one account ' +
      'checked on one day, so it deserves to be widened with more accounts and more days before it is ' +
      'trusted the same way a full thirty-day backtest would be (B). C repeats the exact mistake the ' +
      'expiry-condition habit from earlier in this package exists to prevent: no threshold, however well ' +
      'derived, is permanent. D is the anti-pattern this entire module has been arguing against from the ' +
      'start, a number that "never changes" only because nobody has ever bothered to check it against ' +
      'anything since the day it was written.',
    expectedOutput: 'Options A and B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b'],
        hint: 'One option treats "derived from data" as the finish line rather than a starting point. One treats "never changes" as a virtue.',
      },
    ],
    debrief:
      'A derived threshold is best thought of as a hypothesis backed by one real data point, not as a proof of anything permanent. Treating it as a settled fact instead of a working hypothesis is exactly how a genuinely good tuning decision made today quietly turns into next year\'s stale, unreviewed exclusion.',
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
        'An attacker TECHNIQUE, a named goal like "stay on this system after breaking in," is almost ' +
        'never a single line in a log. It is a chain of separate actions carried out one after another, ' +
        'creating an account, logging into it, running a command with it, and each individual action in ' +
        'that chain can leave its own distinct kind of trace behind: a provisioning tool gets used, a ' +
        'login happens, a command gets run. Those are three different kinds of evidence, sitting in ' +
        'three different places in the log.\n\n' +
        'A ruleset that only ever watches for one of those traces will only ever see the technique at the ' +
        'exact moment the attacker happens to perform that one specific step, and will stay completely ' +
        'silent for every other link in the same chain. Believing that one good rule "covers" a whole ' +
        'technique, when it really only watches one link of it, is how a real gap in coverage hides ' +
        'behind a false sense that the technique is handled.',
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
      'A, C and D. Each of these three watches a different action in the same chain of events: account ' +
      "provisioning itself (A), the new account's first login specifically from outside the network " +
      '(C), and a command run by an account that was only very recently created (D). B is true only of ' +
      "testuser's earlier compromise, and it has nothing to say about sysmon's: sysmon never appears in " +
      'a single failed password anywhere in this log, so a rule built entirely around watching for ' +
      'guessing would have seen the first stage of this intrusion perfectly and stayed completely silent ' +
      'for the second.',
    expectedOutput: 'Options A, C and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'c', 'd'],
        hint: 'Ask which rules would fire specifically on the account that was created, not the account that was guessed.',
      },
    ],
    debrief:
      'The next three exercises measure each of those three angles on this host in turn, and it is worth noticing in advance that not one of them mentions a failed password anywhere in its logic.',
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
        'ACCOUNT PROVISIONING, creating or modifying a user account, is intrinsically rare on a server ' +
        'that is not being actively administered at that exact moment. That rarity is not a coincidence ' +
        'to work around, it is what makes a rule watching for it usable straight out of the box, with no ' +
        'tuning required at all: there is no equivalent of the monitoring host\'s stale credential ' +
        'drowning this rule in noise, because ordinary day-to-day administration of a host is itself an ' +
        'infrequent event. A rare event does not need a clever, narrow pattern to be worth alerting on, ' +
        'it just needs to be noticed at all, because on most days nothing will trigger it whether the ' +
        'pattern is broad or narrow.',
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
    debrief: `${PROVISION_COUNT} lines, all about one account, on one host, in one day. This sits close to the quietest kind of rule that exists: because the underlying event it watches is intrinsically rare on a healthy day, the rule needs no tuning at all before it becomes usable, unlike the failed-password rule that opened this package.`,
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
        'A single detection can end up covering more than one stage of an incident without anybody ' +
        'having planned it that way in advance. The earlier rule watching for a successful login from ' +
        'outside the internal network does not care in the slightest whether the account being logged ' +
        'into is one that was just guessed open after an hour of failed attempts, or one that was ' +
        "created by an attacker five minutes ago and handed a working password directly. The rule's " +
        'condition, "success, from outside," is true either way, so a general, well-chosen rule earns a ' +
        'second angle on a completely different stage of the same technique for free, without a second ' +
        'rule ever needing to be written.',
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
    debrief: `One, and it is the same rule from earlier in this package doing the work, unmodified. The technique now has two independent detections covering two different stages of it, without a second, separate rule ever having been written on purpose for this account.`,
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
        'A rule that searches for a specific command name in free text, "tar", "curl", "scp", is ' +
        'trivially evaded: an attacker only has to reach for a different tool that does the same job, ' +
        'and the rule never even notices the substitution happened. A rule keyed instead on the ACTOR ' +
        'FIELD of the sudo log line, the account name that invoked the command rather than the command ' +
        'itself, does not have that weakness: whatever this specific account runs as root, whichever ' +
        'tool it happens to reach for, the rule sees it, because it was never paying attention to the ' +
        'command text in the first place, only to who ran something.',
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
      'One command, run only minutes after this account first logged in: an archive of the portal export directory, staged as root. Between this exercise and the two before it, three independent angles now cover this one technique end to end, and none of the three is a failed password.',
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
        'A ruleset that only ever watches for password guessing is, in practice, a ruleset that only ' +
        'ever watches the very first stage of a great many intrusions, the part where an attacker is ' +
        'still trying to get in at all. Whatever happens once the door is already open, creating new ' +
        'accounts, moving to other machines, staging data to steal, needs its own signal built ' +
        'specifically to watch for it, because none of those later actions necessarily produces another ' +
        'failed password anywhere for the original rule to catch.',
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
      'The three angles are: watching account provisioning directly (useradd and usermod activity), ' +
      'watching for a successful login from outside the network by an account with no prior history, ' +
      'and watching sudo commands keyed specifically on an actor account that was only recently created. ' +
      'None of those three mentions a failed password anywhere in its logic. A detection posture built ' +
      'only around the failed-password rule from the first module of this package would have caught ' +
      "testuser guessing its way in, correctly, and then gone completely silent from that point on: the " +
      "new account's creation, its very first login, and the command it ran as root moments later would " +
      'all have passed with zero alerts, simply because guessing a password is not part of any of those ' +
      'three later actions.',
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
      'A single good rule, however well written, catches a single mechanism and nothing beyond it. Genuinely covering a technique means covering every action that makes the technique up, one signal per link in the chain, not writing one clever pattern for the most obvious step and calling the whole technique handled.',
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
        'Every rule in this package so far has existed as a one-off shell command, or as a sentence of ' +
        'plain English describing what it should do. DETECTION AS CODE means writing the same rule in a ' +
        'different shape instead: as DATA, a small, consistent set of named slots, pattern, exclusion, ' +
        'condition, action, filled in with specific values, rather than as a paragraph of prose or a ' +
        'command somebody has to read in full to understand.\n\n' +
        'The value of doing this is not that the rule becomes smarter or more correct just by being ' +
        'reformatted, it does not. The value is entirely in what that consistent shape makes possible ' +
        'afterward: two versions of the same rule can be compared automatically to see exactly what ' +
        'changed, a rule\'s pattern can be tested against sample lines without needing a real running ' +
        'system, and a reviewer looking at a change can see precisely which field moved instead of ' +
        'having to re-read an entire command from scratch.',
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
      'A and C. Writing a rule as structure makes a single change reviewable as a small, focused diff ' +
      'instead of a wall of text to re-read (A), and it makes the rule testable in isolation, feeding ' +
      'sample log lines through just the pattern and condition without needing to touch a real, live ' +
      'host at all (C). B is false: structure does not add accuracy on its own, the pattern inside it is ' +
      'exactly as correct, or exactly as wrong, as it was when it lived in a raw shell pipeline. D is the ' +
      'same false comfort warned about earlier in this package with exclusion expiry conditions: a ' +
      'schema having a field for something is not the same as a human having filled that field in ' +
      'correctly, and structure never replaces the actual regression test.',
    expectedOutput: 'Options A and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'c'],
        hint: 'One option claims structure fixes correctness. One claims structure removes the need for a test. Neither follows from writing a rule as data.',
      },
    ],
    debrief:
      'Detection as code is a delivery mechanism, not a proof of anything. It makes a rule genuinely easier to review and test than a raw command would be, and it stops there: it never does the reviewing or the testing for you, a person still has to do both.',
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
        'A written change note, the kind built earlier in this package, is genuinely true and complete ' +
        'when it is written, and it is also unenforceable: nothing about a paragraph of prose stops the ' +
        'next person, in a hurry six months from now, from shipping an exclusion with no ticket attached ' +
        'and no expiry condition at all, because plain prose is not a shape any automated check can ' +
        'inspect. A computer can read a sentence, it cannot verify that the sentence covered everything ' +
        'it was supposed to.\n\n' +
        'The exact same content, expressed instead as named fields, pattern, exclude, owner, ticket, ' +
        'expiry, condition, action, can be REQUIRED by a validator. A rule missing one of those fields ' +
        'is not a rule that quietly ships half-finished and hopes nobody notices, it is a rule that fails ' +
        'to compile at all, and gets stopped before it ever reaches production. Turning "please remember ' +
        'to include this" into "this cannot ship without it" is the entire value structure adds here.',
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
      'The fields would be: `pattern` holds "Failed password", the actual text being matched. `exclude` ' +
      `holds the monitoring host's address, ${MONITOR}, the specific thing being carved out. \`owner\` ` +
      'and `ticket` hold whoever is accountable for that host and the ticket tracking the fix, OPS-4412 ' +
      'in the earlier change note. `expiry` holds the exact condition that would make this exclusion ' +
      'wrong, the credential being rotated or the host being rebuilt. `action` holds what actually ' +
      'happens the moment the pattern matches, alerting an operator. Naming each of these as its own ' +
      'field, rather than leaving them scattered inside a paragraph of prose, means a rule shipped ' +
      'without an owner or an expiry is visibly, obviously incomplete, an empty box staring back at ' +
      'whoever reviews it, instead of a fact quietly missing from a sentence nobody double-checked.',
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
      "A field that is required by the schema and sitting empty is a visible gap that jumps out at anyone looking at the rule. The exact same fact, simply left out of a paragraph of prose, is invisible until somebody goes looking for it specifically, and by the time somebody goes looking, it is usually because the gap has already mattered.",
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
        'A structured rule with a named `account` field is one single rule, run repeatedly with ' +
        'different values plugged into that field, rather than a brand new pipeline that somebody has to ' +
        'write from scratch every time a different account needs checking. The shell command underneath ' +
        'does not change shape at all between runs, the words around it stay identical, only the one ' +
        'value that gets substituted into the account slot changes, and that stability is exactly what ' +
        'makes naming the field worthwhile in the first place: it turns "write a new command" into "fill ' +
        'in a blank."',
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
    debrief: `${TESTUSER_ACTOR_COMMANDS}. Notice that the rule itself did not change shape at all to answer this question, only the one parameter fed into it did, which is the entire benefit of writing a rule this way instead of as a series of one-off commands.`,
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
        'A raw, hand-typed shell pipeline quietly hides the fact that only one small thing changed ' +
        'between two runs of it: two commands that look almost identical, character for character, still ' +
        'have to be read in full, word by word, before a person can be confident they have spotted the ' +
        'one difference. A structured rule with a single named field changed instead makes that ' +
        'difference the entire diff, the whole visible change fits in one line naming one field and its ' +
        'new value, which is exactly what a reviewer, or a tired second pair of eyes looking at this six ' +
        'months from now, actually needs in order to trust a change at a glance rather than having to ' +
        're-derive it from scratch.',
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
    debrief: `${TESTUSER_ACTOR_COMMANDS} commands for testuser, ${SYSMON_ACTOR_COMMANDS} for sysmon, from the exact same rule with a single field changed between the two runs. That small, visible difference is the whole argument for formalizing a rule this way: the change is reviewable and testable on its own, and nobody has to remember what the original hand-typed pipeline used to look like just to check that this one worked correctly.`,
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
        'A schema, the named-field format from this module, with a field labelled "owner" looks ' +
        'accountable to anyone glancing at it, whether or not a real, checked, correct name was actually ' +
        'typed into that slot. That is the specific new danger structure introduces, one a raw shell ' +
        'command never had: structure can manufacture the appearance of rigour without any of the actual ' +
        'substance behind it, because a form that looks filled in is far more persuasive at a glance than ' +
        'an obviously ad hoc, unpolished shell command, even in a case where both of them are equally ' +
        'unreviewed and equally untrustworthy.',
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
      'looks accountable and properly reviewed at a glance, whether or not anybody actually took the ' +
      'time to fill those fields in correctly, in a way an obviously ad hoc, hand-typed shell command ' +
      'never pretends to be in the first place. A raw pipeline looks exactly as unreviewed as it ' +
      'genuinely is, which, oddly, makes it harder to mistake for something safer or more trustworthy ' +
      'than it actually is. Structure never replaces the human act of review, it only gives an ' +
      'unreviewed rule a more convincing costume to wear, so the fields inside it still have to be ' +
      'checked for real content, not merely confirmed to exist.',
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
      "A field is not a fact by itself. It is only a labelled place where a fact is supposed to live, and somebody, a real person, still has to go and put a true one there before the field means anything at all.",
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
        'Whether a technique genuinely has good coverage is not purely a property of your ruleset sitting ' +
        'there by itself, it is also a fact about which specific choice the attacker happened to make. ' +
        'Three good rules cover the goal of "staying on this host after breaking in" exactly as well as ' +
        'this particular attacker chose to pursue it this time, by creating a brand-new, visible account. ' +
        'The same underlying goal, reached instead by quietly reusing an existing, already-privileged ' +
        'credential that nobody would think twice about, would leave none of those three signals behind ' +
        'at all, even though the technique, "persistence," has the same name either way.',
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
      'B and C. All three rules built earlier key on the exact same precondition, a visible, newly ' +
      'created account, so an attacker who instead reuses an existing, quiet, already-privileged ' +
      'credential leaves none of those three signals behind at all (B). Coverage, honestly described, is ' +
      'really a property of one specific variant of a technique, not of the technique\'s name in general, ' +
      'because two different attackers both aiming for "persistence" can leave completely different log ' +
      'evidence, or none at all (C). A repeats exactly the overclaiming failure this package has already ' +
      'warned about, reading a rule that covers one variant as though it covered the whole named ' +
      'technique. D repeats a second mistake already flagged earlier too: nothing built in this package ' +
      'is permanent, coverage included.',
    expectedOutput: 'Options B and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b', 'c'],
        hint: 'One option claims three rules for one variant means the whole technique is handled. One claims a covered technique needs no more attention, ever.',
      },
    ],
    debrief:
      'The next three exercises go looking for exactly this gap on this real host: actual accounts that could be quietly compromised and leave none of the three signals built earlier in this package behind them.',
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
        'A coverage claim about accounts is only ever as trustworthy as the full POPULATION it was ' +
        'actually checked against, meaning every account that could plausibly have been affected, not ' +
        'just the ones already involved in the incident everybody is looking at. If several accounts ' +
        'logged into this host today, a rule that only ever gets exercised against the two accounts tied ' +
        'to this one incident has not been checked against the rest of them at all, and calling it ' +
        '"covered" without doing that broader check quietly narrows the word "covered" down to mean only ' +
        'the interesting part of the population, not the whole thing.',
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
    debrief: `${ACCEPTED_DISTINCT} accounts logged in successfully today. Two of them belong to this one incident. The other accounts are the population a sudo- or provisioning-based rule has never once had a reason to fire on, and that untested remainder is exactly where an unexamined assumption about coverage tends to live undetected.`,
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
        'A rule keyed on sudo activity only ever fires if the account in question actually uses sudo in ' +
        'the first place. That dependency is a fact about the account and its normal role, not a flaw in ' +
        'the rule itself, and an account that never touches sudo, whether because its job never requires ' +
        'elevated privileges or simply out of habit, will produce a permanent absence of this particular ' +
        'trail, whether that account is behaving exactly as expected or has quietly been compromised.',
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
    debrief: `${COMMAND_LINES} commands, coming from only four of the six accounts that logged in today. The other two never appear here at all, and the next exercise asks exactly what that absence should mean for a coverage claim built on this signal.`,
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
        'An account that never touches sudo is not suspicious just for that reason, most accounts on ' +
        'most hosts genuinely never need to use it, and that ordinariness is exactly what makes this a ' +
        'real problem rather than a false alarm: a quiet, low-privilege pattern of access from an account ' +
        'behaving exactly as it always has is indistinguishable, in this log, from the same quiet, ' +
        'low-privilege pattern of access produced by somebody who should not be there at all, using that ' +
        'account\'s credential without anyone\'s knowledge. The three rules built earlier in this package ' +
        'have nothing whatsoever to say about an account like that, in either direction.',
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
      'appear running a sudo command. For a detection posture built entirely on the three rules from ' +
      'earlier in this package, compromising either credential would be completely invisible: no ' +
      'provisioning event fires, because nothing new was ever created; no external-first-login event ' +
      'fires either, for svc-backup at least, since it logs in from an internal address every single ' +
      'time; and no sudo-actor event fires, because this account never touches sudo by role, whether it ' +
      'is being used exactly as intended or has quietly been handed to somebody who should not have it. A ' +
      'quiet, low-privilege account produces identical log evidence in both situations.',
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
      'This is the genuinely harder half of coverage work, harder than mapping which techniques have no rule at all: asking, account by account, "which real, ordinary accounts on this host would a compromise of look exactly identical to nothing happening at all."',
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
        'An honest coverage-map entry does three specific things: it names the gap precisely, states ' +
        'plainly why detection alone cannot close it, and points toward a control that lives outside ' +
        'detection entirely and could close it instead. Writing an entry that quietly undercounts a gap ' +
        'because today\'s population of affected accounts happens to be small is exactly how a real risk ' +
        'affecting two accounts today grows, unnoticed, into a risk affecting twenty accounts a year from ' +
        'now, with the same stale, too-optimistic map entry still sitting on file, unread, since the day ' +
        'it was first written.',
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
      'B. It names the gap precisely, no sudo history and no external-login history, states plainly ' +
      'that detection alone cannot close it, and points toward a control that lives outside detection ' +
      'entirely, a periodic access review, that could actually close it. A confuses "has not been ' +
      'observed yet" with "is not a risk," which is exactly the failure this package warned about when ' +
      'discussing empty columns on a coverage map earlier. C repeats the same overclaim flagged at the ' +
      'start of this module: the earlier rules genuinely cover a different variant of the technique ' +
      'entirely, not this one. D undercounts the risk by treating today\'s small population as a ceiling ' +
      'on tomorrow\'s, when an honest entry should hold true regardless of how many accounts happen to ' +
      'fit the profile on the specific day it was written.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Look for the option that names the gap, states the limit of detection honestly, and proposes a control outside it.',
      },
    ],
    debrief:
      'A coverage map, in the end, is really just a list of honest sentences about what cannot currently be seen, not a scoreboard counting how many rules have been shipped. The entry that still holds up on a second reading six months from now is the one that never quietly depended on how many accounts happened to fit the profile on the particular day it was first written down.',
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
