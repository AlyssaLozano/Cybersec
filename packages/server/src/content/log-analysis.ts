/**
 * Log Analysis and Parsing -- 40 exercises across 9 modules.
 *
 * Linux Fundamentals taught the tools. This package points them at the only thing a SOC
 * analyst actually does with them: reading logs that are mostly boring in order
 * to find the handful of lines that are not.
 *
 * THE STORY UNDERNEATH
 *
 * Every exercise here runs against the same seeded day on rmg-web-02, and the
 * exercises are ordered so the intrusion assembles itself. A student who works
 * straight through will, without being told to look for it:
 *
 *   2.2.1  see 718 failed passwords and assume the worst
 *   2.2.2  discover most of them target accounts that do not exist
 *   2.2.3  find only nine successful logins -- and two from a foreign address
 *   2.4.1  extract the address behind both of them
 *   2.4.4  corroborate the same session in a second, independent log file
 *   2.5.1  discover one host accounts for most of the volume, and is internal
 *   2.6.1  set that host aside and see what is genuinely unexplained
 *   2.7.2  find the same activity in yesterday's rotated log, at lower volume
 *   2.8.5  meet the same external address in the WEB log, which is not a coincidence
 *   2.9.3  read the five sudo lines, three of which are the whole intrusion
 *   2.9.5  extract the path of the archive that was staged in /tmp
 *
 * The reveal is deliberately withheld from the prompts. Being handed "an attack
 * happened at 10:14" teaches nothing; noticing it does. Modules 2.5 to 2.9 carry
 * the arc past the break-in and into what the intruder actually did, which is
 * the half most log training never reaches.
 *
 * TWO DEVIATIONS FROM THE SOURCE SPEC (both recorded in docs/content-issues.md)
 *
 *   2.3.2  The spec greps for lowercase "started|stopped". Real syslog writes
 *          "Started" and "Stopping", so the spec's command finds one line out of
 *          four. This version teaches -i, which is the actual lesson.
 *   2.4.2  The spec pipes "Failed password" lines into a `user=` extraction, but
 *          sshd never puts `user=` on those lines -- it puts it on the pam_unix
 *          line. The spec's command returns nothing. This version greps the file
 *          directly, which works and is what the field does.
 *
 * As in Linux Fundamentals, every expected count is COMPUTED from the seeded logs, so
 * regenerating the world can never leave a stale answer key behind.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

import { AUTH_LOG, SYSLOG } from '../vfs/data/generated.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { LOG_ANALYSIS_PRACTICE } from './log-analysis-practice.js';

const authLines = AUTH_LOG.split('\n').filter((line) => line !== '');
const sysLines = SYSLOG.split('\n').filter((line) => line !== '');

function count(lines: string[], needle: string, caseInsensitive = false): number {
  const target = caseInsensitive ? needle.toLowerCase() : needle;
  return lines.filter((line) => (caseInsensitive ? line.toLowerCase() : line).includes(target)).length;
}

/**
 * Non-empty lines of a seeded file, read from the image the student will see.
 *
 * Modules 2.5 to 2.9 grade against the rotated auth log and the nginx logs,
 * neither of which is a named export: auth.log.1 is assembled from a slice of
 * AUTH_LOG inside image.ts, and the nginx logs are literals there. Reading the
 * image is therefore the only way to derive those answers from the same bytes
 * the student greps, which is the point of the rule. Throwing at module load is
 * deliberate: a seeded file that disappears should stop the server, not silently
 * become an exercise nobody can pass.
 */
function seededLines(path: string): string[] {
  const node = BASE_IMAGE.get(path);
  if (!node || node.kind !== 'file' || typeof node.content !== 'string') {
    throw new Error(`Log Analysis expects a seeded file at ${path}, which is not in the image.`);
  }
  return node.content.split('\n').filter((line) => line !== '');
}

const AUTH = '/var/log/auth.log';
const SYS = '/var/log/syslog';

// --- expected answers, derived from the seeded logs --------------------------

const IN_HOUR_10 = count(authLines, 'Aug 15 10:');
const FAILED_PASSWORD = count(authLines, 'Failed password');
const FAILED_ADMIN = authLines.filter(
  (line) => line.includes('Failed password') && line.includes('admin'),
).length;
const ACCEPTED = count(authLines, 'Accepted');
const SYSLOG_ERRORS = count(sysLines, 'error', true);
const SERVICE_TRANSITIONS = sysLines.filter((line) => /started|stopped/i.test(line)).length;
const KERNEL_IN_LAST_50 = sysLines.slice(-50).filter((line) => line.includes('kernel')).length;

/** Unique IPv4 addresses appearing on sshd lines. */
const SSHD_UNIQUE_IPS = (() => {
  const found = new Set<string>();
  for (const line of authLines) {
    if (!line.includes('sshd')) continue;
    for (const match of line.matchAll(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g)) found.add(match[0]);
  }
  return found;
})();

/** Distinct account names appearing as `user=` on pam_unix failure lines. */
const FAILED_USERNAMES = (() => {
  const found = new Set<string>();
  for (const line of authLines) {
    const match = /user=(\S+)/.exec(line);
    if (match) found.add(match[1]!);
  }
  return found;
})();

const TESTUSER_IN_SYSLOG = count(sysLines, 'testuser');

// --- derived answers for modules 2.5 to 2.9 ----------------------------------

const AUTH_ROTATED = '/var/log/auth.log.1';
const NGINX_ACCESS = '/var/log/nginx/access.log';

const rotatedLines = seededLines(AUTH_ROTATED);
const nginxLines = seededLines(NGINX_ACCESS);

/** Rank the values a regex pulls out of a set of lines, commonest first. */
function rank(lines: string[], pattern: RegExp): Array<[string, number]> {
  const tally = new Map<string, number>();
  for (const line of lines) {
    const match = pattern.exec(line);
    if (match?.[1]) tally.set(match[1], (tally.get(match[1]) ?? 0) + 1);
  }
  return [...tally.entries()].sort((a, b) => b[1] - a[1]);
}

const failedLines = authLines.filter((line) => line.includes('Failed password'));

const SOURCE_RANK = rank(failedLines, /from (\d{1,3}(?:\.\d{1,3}){3})/);
const TOP_SOURCE = SOURCE_RANK[0]![0];
const TOP_SOURCE_COUNT = SOURCE_RANK[0]![1];
const UNIQUE_FAILED_SOURCES = SOURCE_RANK.length;

const TARGET_RANK = rank(failedLines, /Failed password for (?:invalid user )?(\S+) from/);
const TOP_TARGET = TARGET_RANK[0]![0];
const TOP_TARGET_COUNT = TARGET_RANK[0]![1];

/** Failures left once the noisiest source is set aside. */
const FAILED_WITHOUT_TOP_SOURCE = failedLines.filter((line) => !line.includes(TOP_SOURCE)).length;

const ROTATED_TOTAL = rotatedLines.length;
const ROTATED_FAILED = count(rotatedLines, 'Failed password');

/** Busiest hour of the day in auth.log, as the two-digit hour and its volume. */
const HOUR_RANK = rank(authLines, /^\w{3} +\d+ (\d{2}):/);
const BUSIEST_HOUR = HOUR_RANK[0]![0];
const BUSIEST_HOUR_COUNT = HOUR_RANK[0]![1];

/** nginx logs the response status as the ninth space-separated field. */
const NGINX_STATUS_RANK = (() => {
  const tally = new Map<string, number>();
  for (const line of nginxLines) {
    const status = line.split(' ')[8];
    if (status) tally.set(status, (tally.get(status) ?? 0) + 1);
  }
  return [...tally.entries()].sort((a, b) => b[1] - a[1]);
})();
const NGINX_404 = NGINX_STATUS_RANK.find(([status]) => status === '404')?.[1] ?? 0;
const NGINX_TOTAL = nginxLines.length;

const SECOND_SOURCE = SOURCE_RANK[1]![0];
const FAILED_WITHOUT_TOP_TWO = failedLines.filter(
  (line) => !line.includes(TOP_SOURCE) && !line.includes(SECOND_SOURCE),
).length;

/** Lines in auth.log written by something other than sshd. */
const NON_SSHD = authLines.filter((line) => !line.includes('sshd')).length;

/** Failures across the current log and the rotated one together. */
const FAILED_BOTH_FILES = FAILED_PASSWORD + ROTATED_FAILED;

/** Distinct addresses that got a 404 out of nginx. */
const NGINX_404_SOURCES = (() => {
  const found = new Set<string>();
  for (const line of nginxLines) {
    if (line.split(' ')[8] !== '404') continue;
    const address = line.split(' ')[0];
    if (address) found.add(address);
  }
  return found;
})();

/** Addresses that appear in BOTH the web log and the auth log. */
const SEEN_IN_BOTH = (() => {
  const web = new Set<string>();
  for (const line of nginxLines) {
    const match = /^(\d{1,3}(?:\.\d{1,3}){3})/.exec(line);
    if (match) web.add(match[1]!);
  }
  return [...web].filter((address) => authLines.some((line) => line.includes(address)));
})();

/** How often the second-ranked source appears anywhere in each log. */
const SECOND_SOURCE_IN_AUTH = count(authLines, SECOND_SOURCE);
const SECOND_SOURCE_IN_WEB = count(nginxLines, SECOND_SOURCE);

/** Distinct paths requested in the web log. */
const NGINX_REQUEST_PATHS = new Set(
  nginxLines.map((line) => line.split('"')[1] ?? '').filter((request) => request !== ''),
);

/** Sudo lines that record a command actually run as root. */
const SUDO_COMMANDS = count(authLines, 'COMMAND=');

/** Successful logins from the second-ranked source. */
const ACCEPTED_FROM_SECOND = authLines.filter(
  (line) => line.includes('Accepted') && line.includes(SECOND_SOURCE),
).length;

/**
 * A source that failed repeatedly and never once succeeded.
 *
 * Derived rather than named, so the negative-result exercise cannot quietly
 * become a positive one if the world is regenerated with different traffic.
 */
const NEVER_SUCCEEDED = SOURCE_RANK.map(([address]) => address).find(
  (address) => !authLines.some((line) => line.includes('Accepted') && line.includes(address)),
)!;

// --- Module 2.1: Reading log formats -----------------------------------------

const MODULE_2_1: Exercise[] = [
  {
    id: 'logs.1.1',
    moduleId: '2.1',
    packageId: 'log-analysis',
    order: 1,
    title: 'Read the shape of a log line',
    kind: 'terminal',
    goal: 'Learn the four fields every syslog-format line carries, so you can read one at a glance.',
    prompt:
      'Print the first 3 lines of the authentication log on rmg-web-02, and look at how each line is built.',
    teach: {
      concept:
        'A log is just a running diary a program keeps as it works: every time something notable happens, it appends one line describing it, with a timestamp, and never edits or deletes an earlier line. Nobody watches a server happen live, so the log is how you find out afterward what it did, in the order it did it. Every program on a Linux machine that wants to record something writes to a log file for exactly this reason, and a machine running completely normally is still writing hundreds of these lines a day: most of the job is telling the boring ones from the ones that matter.\n\n' +
        'Almost every Linux log file uses the same layout, called syslog format, because decades of different programs settled on one shared shape instead of each inventing its own. Once you can see the four fields, a wall of text turns into a table. Left to right: WHEN it happened, WHICH machine it happened on, WHAT program reported it (with its process id in brackets, so you can tell one running copy of a program from another), and finally the message itself, in whatever words that program chose to describe what it did. Everything you do in this package is filtering on one of those four fields.\n\n' +
        'Run the command below and look at one line at a time: the date and time come first, then the hostname, then something like sshd[21426]: (the program\'s name, and in brackets the numeric id the operating system gave that particular running instance of it), then a colon, then the message. That shape repeats on every single line in the file, which is what makes it searchable: you are not reading free-form prose, you are reading rows of a table that happens to be written as plain text.',
      syntax: 'head -n COUNT FILE',
      examples: [
        {
          command: 'head -n 3 /var/log/dpkg.log',
          explains:
            'Shows the first 3 lines of the package manager log. A different file, so you can see that the same shape repeats everywhere.',
        },
      ],
      flags: [
        { flag: '-n COUNT', means: 'How many lines to show. Without it, head shows 10.' },
      ],
    },
    hints: [
      'You met this command in Linux Fundamentals: it shows you the beginning of a file.',
      'The authentication log lives at /var/log/auth.log.',
      'Use head with -n 3 to ask for exactly three lines.',
    ],
    solution: `head -n 3 ${AUTH}`,
    expectedOutput:
      'Three lines, each starting "Aug 15" then the hostname rmg-web-02, then a program name such as sshd[21426], then a colon and the message.',
    checks: [
      { type: 'output-line-count', count: 3, hint: 'Ask for exactly 3 lines with -n 3.' },
      {
        type: 'output-contains',
        text: 'rmg-web-02',
        hint: 'Read /var/log/auth.log: every line should carry this hostname.',
      },
      {
        type: 'output-matches',
        pattern: '^Aug 15 \\d{2}:\\d{2}:\\d{2} rmg-web-02 \\S+',
        flags: 'm',
        hint: 'Your output should be raw log lines, beginning with a timestamp and hostname.',
      },
    ],
    debrief:
      'Those four fields are your filters, and every tool you learn next is really just a way of asking for a subset of one of them. "Which machine" matters once you get past a single server: real companies ship every host\'s logs into one central place, so a hundred machines\' worth of lines end up interleaved in the same file, and the hostname is the only thing telling you which lines came from which box. "Which program" is how you separate an SSH problem from a database problem inside that same file, because both could physically write lines right next to each other. Learn to see these four columns before anything else: every exercise after this one assumes you already can.',
    practice: LOG_ANALYSIS_PRACTICE['logs.1.1'] ?? [],
  },
  {
    id: 'logs.1.2',
    moduleId: '2.1',
    packageId: 'log-analysis',
    order: 2,
    title: 'Pull out just the timestamps',
    kind: 'terminal',
    goal: 'Cut a line into fields and keep only the ones you want.',
    prompt:
      'From the first 10 lines of the authentication log, show only the date and time (the first three space-separated fields) and nothing else.',
    teach: {
      concept:
        'A log line looks like a sentence, but treat it as a row in a table instead: every space is a boundary between one COLUMN, more often called a FIELD, and the next. This is not a special property of logs, it is true of any line of text with consistent spacing, and it is the reason a program can process millions of log lines automatically instead of a human reading each one.\n\n' +
        '`cut` is the tool that turns that idea into a command: tell it what character separates the fields (the DELIMITER), and which numbered fields to keep, and it throws away everything else. Fields are numbered starting from 1, left to right, the same way you would count words in a sentence on your fingers.\n\n' +
        'In syslog format the timestamp you learned to spot in the last exercise is actually split across the first three fields rather than sitting in one: "Aug" is field 1, "15" is field 2, and "00:00:29" is field 3, because the month, day, and time-of-day are separated from each other by spaces just like everything else on the line. Ask cut for field 1 alone and you get only the month, which on its own tells you nothing useful, so you ask for the range 1 through 3 to get the whole timestamp back in one piece.\n\n' +
        'This is worth learning early because it is how a log line stops being something you read and becomes something you can compare: once a value is isolated to its own field, a later command in the pipe can sort it, count it, or check it against a list, none of which works while it is still buried inside a full line of text.',
      syntax: 'cut -d DELIMITER -f FIELDS',
      examples: [
        {
          command: "cut -d ':' -f 1 /etc/passwd",
          explains:
            'The passwd file is colon-separated, so this prints just the account names. Same tool, different delimiter.',
        },
        {
          command: "head -n 5 /etc/hosts | cut -d ' ' -f 1",
          explains: 'Takes the first five lines of a file and keeps only the first space-separated field.',
        },
      ],
      flags: [
        { flag: "-d ' '", means: 'Split on a space. The default is a tab, which log lines do not use.' },
        { flag: '-f 1-3', means: 'Keep fields 1 through 3. You can also write -f 1,4 for a non-adjacent pair.' },
      ],
    },
    hints: [
      'Two commands joined by a pipe: get the first 10 lines, then cut them down.',
      'head with no -n already gives you exactly 10 lines.',
      "Tell cut to split on a space with -d ' ', then keep fields 1-3 with -f 1-3.",
    ],
    solution: `head ${AUTH} | cut -d ' ' -f 1-3`,
    expectedOutput: 'Ten lines, each just a date and time such as "Aug 15 00:00:29".',
    checks: [
      { type: 'output-line-count', count: 10, hint: 'head with no -n gives 10 lines; keep all of them.' },
      {
        type: 'output-matches',
        pattern: '^Aug 15 \\d{2}:\\d{2}:\\d{2}$',
        flags: 'm',
        hint: 'Each line should be ONLY the timestamp: three fields, nothing after the seconds.',
      },
      {
        type: 'output-excludes',
        text: 'rmg-web-02',
        hint: 'The hostname is field 4. If you can still see it, you kept too many fields.',
      },
    ],
    debrief:
      'Field extraction is how a log line stops being a sentence and becomes data. Strip everything except the field you care about, and the next tool in the pipe never has to understand the rest of the line at all: it can sort what you kept, tally how often each value repeats, or spot the duplicates, because you already threw away everything that would have confused it. Almost every multi-step command later in this package starts with a cut or a grep -o doing exactly this.',
    practice: LOG_ANALYSIS_PRACTICE['logs.1.2'] ?? [],
  },
  {
    id: 'logs.1.3',
    moduleId: '2.1',
    packageId: 'log-analysis',
    order: 3,
    title: 'Narrow a log to one hour',
    kind: 'terminal',
    goal: 'Use the timestamp as a filter to scope an investigation to a time window.',
    prompt:
      'Something is reported to have happened mid-morning. Show every authentication log entry from the 10 o\'clock hour on August 15.',
    teach: {
      concept:
        'grep searches a file line by line and prints only the lines containing the text you give it: nothing clever, just a literal search for a piece of text anywhere on the line, which is exactly why it also works as a date filter with no special tooling. Because the timestamp sits at the very front of every line in a fixed, predictable shape, searching for "Aug 15 10:" finds every line whose timestamp literally begins with those characters, and because the hour is always written as two digits followed by a colon, that one search catches 10:00:00 through 10:59:59 and nothing outside it.\n\n' +
        'This works because the timestamp format never changes: every second of the 10 o\'clock hour is written "10:" followed by minutes and seconds, so a plain substring match at the start of the line does the same job a purpose-built date filter would, without you needing one. The trick generalises: narrow the search text further ("Aug 15 10:1") and you get just the ten minutes from 10:10 to 10:19, because that string is still an unbroken prefix of every timestamp in that range.\n\n' +
        'Scoping to a time window like this is usually the very first move in a real investigation. Somebody reports that something odd happened "around mid-morning," or a monitoring tool fires an alert with a timestamp attached, and your job is to go read everything the machine said in the minutes on either side of it. Without a way to carve out just that slice, you would be reading the whole day to find the handful of relevant lines.',
      syntax: 'grep "PATTERN" FILE',
      examples: [
        {
          command: `grep "Aug 15 03:" ${SYS}`,
          explains: 'Everything the system logged during the 3am hour. A different hour, and a different file.',
        },
        {
          command: `grep "Aug 15 07:4" ${AUTH}`,
          explains: 'Narrower still: the ten minutes from 07:40 to 07:49.',
        },
      ],
    },
    hints: [
      'The timestamp is just text at the start of the line, so grep can match it.',
      'You want every line whose time begins with 10: think about what those all have in common.',
      'Include the colon after the hour: "Aug 15 10:", without it you would also match day 10 in other contexts.',
    ],
    solution: `grep "Aug 15 10:" ${AUTH}`,
    expectedOutput: `${IN_HOUR_10} lines, all timestamped between 10:00 and 10:59.`,
    checks: [
      {
        type: 'output-line-count',
        count: IN_HOUR_10,
        hint: `The 10 o'clock hour holds ${IN_HOUR_10} lines. Make sure your pattern includes the colon after the hour.`,
      },
      {
        type: 'output-excludes',
        text: 'Aug 15 09:',
        hint: 'Lines from other hours got through: tighten the pattern.',
      },
    ],
    debrief:
      'You just scoped an investigation to a one-hour window using nothing but a text search on a timestamp. Look at what is actually sitting inside that window: an accepted login, a sudo command, and a new account being created, three very different kinds of event that happen to share the same hour. That sequence, someone getting in, then using the access, then leaving something behind, is the whole reason this package exists: everything from here forward is about noticing a pattern like that inside a file that, at first glance, looks like undifferentiated noise.',
    practice: LOG_ANALYSIS_PRACTICE['logs.1.3'] ?? [],
  },
];

// --- Module 2.2: Authentication logs -----------------------------------------

const MODULE_2_2: Exercise[] = [
  {
    id: 'logs.2.1',
    moduleId: '2.2',
    packageId: 'log-analysis',
    order: 1,
    title: 'Count failed logins',
    kind: 'terminal',
    goal: 'Turn a wall of log lines into a single number you can reason about.',
    prompt:
      'How many failed password attempts are recorded in the authentication log? Produce just the number.',
    teach: {
      concept:
        'sshd is the program on this machine that handles remote logins over SSH (secure shell): every time somebody, or something, tries to sign in remotely, sshd is what checks the password or key and writes a line recording what happened. When it rejects a password, that line contains the exact phrase "Failed password", written identically every time, which is what makes it searchable at all.\n\n' +
        'Counting those lines is the single most common thing anyone does with an auth log, because it is the cheapest possible signal that people are trying to get in. You can get the count two ways, and both matter: grep can count matches itself with the -c flag, printing a single number instead of the lines it found, or you can let grep print the matching lines as normal and pipe them into `wc -l` (word count, with -l for lines), which counts whatever text arrives on its input. Both are correct, both are used constantly in real work, and later in this package you will deliberately use both on the same question to prove they agree.\n\n' +
        'A number is only useful once you have it in front of you, and that is the entire point of this exercise: turn a file nobody could read end to end into a single figure that fits in a sentence.',
      syntax: 'grep -c "PATTERN" FILE     or     grep "PATTERN" FILE | wc -l',
      examples: [
        {
          command: `grep -c "Accepted publickey" ${AUTH}`,
          explains: 'Counts key-based logins. Same mechanic, different question.',
        },
        {
          command: `grep "nginx" ${SYS} | wc -l`,
          explains: 'The pipe version: find the lines, then count what came through.',
        },
      ],
      flags: [{ flag: '-c', means: 'Print how many lines matched instead of printing the lines.' }],
    },
    hints: [
      'The phrase to search for is "Failed password": two words, capital F.',
      'Either grep -c or a pipe into wc -l will give you a number.',
      'Quote the phrase so the space inside it does not split it into two arguments.',
    ],
    solution: `grep -c "Failed password" ${AUTH}`,
    expectedOutput: `${FAILED_PASSWORD}`,
    checks: [
      {
        type: 'output-numeric',
        equals: FAILED_PASSWORD,
        hint: 'The answer is a single number. Use grep -c, or pipe the matches into wc -l.',
      },
    ],
    debrief:
      `${FAILED_PASSWORD} failed logins in one day sounds like a siren, and that reaction is exactly what a raw count is designed to trigger: a big number with no context attached. Hold that thought, because the next exercise shows why this figure on its own is nearly meaningless: it does not say who was targeted, where the attempts came from, or whether a single misconfigured device produced most of them. Analysts who page people over a count like this, with nothing behind it, stop being trusted quickly, and trust is the only thing that makes an alert worth raising in the first place.`,
    practice: LOG_ANALYSIS_PRACTICE['logs.2.1'] ?? [],
  },
  {
    id: 'logs.2.2',
    moduleId: '2.2',
    packageId: 'log-analysis',
    order: 2,
    title: 'Narrow to one targeted account',
    kind: 'terminal',
    goal: 'Chain two filters together to answer a sharper question.',
    prompt:
      'Of those failed attempts, show only the ones against the account "admin".',
    teach: {
      concept:
        'You already know that a pipe (the | character) hands the output of one command to another as its input. Chain two greps together and each one narrows the set of lines a little further, because the second grep never sees the lines the first one threw away: it only ever searches what survived. The first grep finds every failure; the second grep keeps only the failures that also mention the account you care about.\n\n' +
        'This is how you go from "something is happening" to "something is happening to this specific thing", which is the difference between an observation and a finding. Anyone can say a file contains failures. Being able to say precisely how many of them targeted one named account, and produce the exact command that proves it, is what turns a hunch into something you can act on.',
      syntax: 'grep "PATTERN" FILE | grep "SECOND PATTERN"',
      examples: [
        {
          command: `grep "Failed password" ${AUTH} | grep "postgres"`,
          explains: 'Failures against the database account rather than admin.',
        },
        {
          command: `grep "Accepted" ${AUTH} | grep "publickey"`,
          explains: 'Successful logins, narrowed to those that used a key instead of a password.',
        },
      ],
    },
    hints: [
      'Start with the same search you used to count failures, but without -c so you get the lines back.',
      'Send those lines into a second grep with a pipe character.',
      'The second grep only needs the word admin.',
    ],
    solution: `grep "Failed password" ${AUTH} | grep "admin"`,
    expectedOutput: `${FAILED_ADMIN} lines, every one a failed password for the account "admin".`,
    checks: [
      {
        type: 'output-line-count',
        count: FAILED_ADMIN,
        hint: `There are ${FAILED_ADMIN} failed attempts against admin. Both filters need to apply.`,
      },
      {
        type: 'output-contains',
        text: 'admin',
        hint: 'Every line in your output should mention the admin account.',
      },
      {
        type: 'output-excludes',
        text: 'user=nagios',
        hint: 'Lines about other accounts got through: the second filter is not being applied.',
      },
    ],
    debrief:
      'Look closely at what these lines actually say: "Failed password for invalid user admin". sshd adds the word "invalid" specifically because there is no account named admin on this machine at all: the attempt failed before a password was even checked, because there was no account to check it against. Someone is working through a list of account names that sound plausible on any server (admin, root, test, guest) and trying each one in turn, which is an untargeted scanner running through a wordlist, not somebody who has actually studied this company and knows what its real accounts are called. That distinction, guessing blind versus knowing your target, is one of the first things you learn to read out of a failure line.',
    practice: LOG_ANALYSIS_PRACTICE['logs.2.2'] ?? [],
  },
  {
    id: 'logs.2.3',
    moduleId: '2.2',
    packageId: 'log-analysis',
    order: 3,
    title: 'Find what actually succeeded',
    kind: 'terminal',
    goal: 'Shift attention from noise to consequence.',
    prompt: 'Show every successful login recorded in the authentication log.',
    teach: {
      concept:
        'Failures are loud and usually meaningless; successes are quiet and almost always matter. When sshd actually lets someone in, it writes a line starting with the word "Accepted", followed by the method that worked (password, or publickey if the login used a cryptographic key instead of typing a password), then the account name, then the address the connection came from. Every field on that line is something you will want to check.\n\n' +
        'On a busy internet-facing host there can be thousands of failures generated by automated scanning and only a small handful of successes, and the handful is where you look, because a failure changes nothing on the machine while a success means somebody now has a working session on it. This is the pivot the whole package trains: stop being distracted by the loud, mostly-meaningless number, and go straight to the quiet line that actually matters.',
      syntax: 'grep "PATTERN" FILE',
      examples: [
        {
          command: `grep "session opened" ${AUTH}`,
          explains: 'A related view: every session that actually started, including sudo sessions.',
        },
      ],
    },
    hints: [
      'sshd logs a successful authentication with a single word beginning with a capital A.',
      'The word is "Accepted".',
      'No flags needed: just grep for the word and read what comes back.',
    ],
    solution: `grep "Accepted" ${AUTH}`,
    expectedOutput: `${ACCEPTED} lines, each naming an account and the address it connected from.`,
    checks: [
      {
        type: 'output-line-count',
        count: ACCEPTED,
        hint: `There are only ${ACCEPTED} successful logins in the whole day.`,
      },
      {
        type: 'output-contains',
        text: 'Accepted',
        hint: 'Search for the word sshd uses for a successful authentication.',
      },
    ],
    debrief:
      `Read the source addresses on those lines, because that single field tells you almost everything. Seven of these come from addresses starting 10.20.x.x, the internal office network: someone at a desk in the building, logging in exactly the way an employee should. Two come from 203.0.113.55, an address that belongs to nobody inside the company, for accounts called testuser and sysmon. An internal login from the office network is expected. An external login succeeding on accounts nobody normally uses day to day is not, and that gap is the whole finding. ${FAILED_PASSWORD} failures told you nothing actionable. These ${ACCEPTED} lines just told you everything.`,
    practice: LOG_ANALYSIS_PRACTICE['logs.2.3'] ?? [],
  },
  {
    id: 'logs.2.4',
    moduleId: '2.2',
    packageId: 'log-analysis',
    order: 4,
    title: 'Review activity for a privileged account',
    kind: 'terminal',
    goal: 'Inspect one high-value account, and cap the output so it stays readable.',
    prompt:
      'Show authentication activity involving the root account, limited to the first 20 lines so the screen stays manageable.',
    teach: {
      concept:
        'root is the one account on a Linux machine with no restrictions at all: it can read every file, install or remove any software, and change any setting, which is exactly why it gets special attention. Searching the auth log for the word "root" turns up two very different kinds of line: strangers on the internet trying to log in directly AS root, and legitimate staff using a command called sudo to temporarily borrow root\'s power for one specific action without ever logging in as root itself. Both kinds of line mention the word root, so grep alone cannot tell you which is which: reading the message is what does.\n\n' +
        'A single common word like this can return hundreds of matching lines on a busy day, more than you want scrolling past on one screen. Piping the result into `head` caps what actually reaches your terminal: you keep control of how much output you have to look at, while still being able to tell from the first screenful whether the pattern is worth pursuing further.',
      syntax: 'grep "PATTERN" FILE | head -n COUNT',
      examples: [
        {
          command: `grep "sudo" ${AUTH} | head -n 5`,
          explains: 'The first five lines mentioning sudo, rather than every one of them.',
        },
      ],
    },
    hints: [
      'Search the auth log for the word root.',
      'Pipe what comes back into head so you only see the beginning.',
      'head -n 20 gives you exactly twenty lines.',
    ],
    solution: `grep "root" ${AUTH} | head -n 20`,
    expectedOutput: '20 lines mentioning root, a mix of failed logins against it and sudo sessions opened as it.',
    checks: [
      {
        type: 'output-line-count',
        count: 20,
        hint: 'Cap the output at exactly 20 lines with head -n 20.',
      },
      {
        type: 'output-contains',
        text: 'root',
        hint: 'Every line should mention the root account.',
      },
    ],
    debrief:
      'Two very different things show up under one search: strangers failing to log in AS root from the outside, and staff legitimately escalating TO root with sudo from an account they already own. Same word, opposite meanings, and no flag or pattern trick tells them apart: only reading the actual message field does, which is why "grep for the interesting word" is always the first step of an investigation and never the last one.',
    practice: LOG_ANALYSIS_PRACTICE['logs.2.4'] ?? [],
  },
];

// --- Module 2.3: System logs -------------------------------------------------

const MODULE_2_3: Exercise[] = [
  {
    id: 'logs.3.1',
    moduleId: '2.3',
    packageId: 'log-analysis',
    order: 1,
    title: 'Find errors regardless of capitalisation',
    kind: 'terminal',
    goal: 'Search without being defeated by inconsistent capitalisation.',
    prompt:
      'Find every entry in the system log that mentions an error, no matter how it is capitalised.',
    teach: {
      concept:
        'You have been reading auth.log, which is about who did what: logins, sudo, sessions. syslog is the other major log on this machine, and it catches everything else a program might want to say: a service starting up, a disk filling past a threshold, a piece of hardware reporting a fault. Different teams wrote the hundreds of programs capable of writing to syslog, with no shared style guide, so one writes "error", another writes "Error", and a third writes "ERROR" in capitals, purely because whoever wrote that program made that choice years ago.\n\n' +
        'A case-sensitive search for "error" would only catch the first of those three and silently miss the other two, and grep would give you no warning that it did: it would simply return fewer lines than actually exist, and a plausible-looking number is far more dangerous than an obvious error message. The -i flag makes grep ignore the difference between upper and lower case entirely while matching, so "error", "Error", and "ERROR" are all treated as the same word. On real logs, where nobody controls how every program capitalises its own messages, -i is closer to a default habit than an occasional option.',
      syntax: 'grep -i "PATTERN" FILE',
      examples: [
        {
          command: `grep -i "warning" ${SYS}`,
          explains: 'Catches WARNING, Warning, and warning in one pass.',
        },
        {
          command: `grep -i "timeout" ${SYS}`,
          explains: 'Another word that different programs capitalise differently.',
        },
      ],
      flags: [{ flag: '-i', means: 'Ignore case when matching.' }],
    },
    hints: [
      'The system log is /var/log/syslog.',
      'A plain grep for "error" would miss lines written as ERROR.',
      'The flag that ignores capitalisation is -i.',
    ],
    solution: `grep -i "error" ${SYS}`,
    expectedOutput: `${SYSLOG_ERRORS} lines, all of them upstream timeouts reported by the portal application.`,
    checks: [
      {
        type: 'output-line-count',
        count: SYSLOG_ERRORS,
        hint: `There are ${SYSLOG_ERRORS} matching lines. Without -i you will miss the ones written in capitals.`,
      },
      {
        type: 'output-contains',
        text: 'ERROR',
        hint: 'The matches on this host are written in capitals, so your search must be case-insensitive.',
      },
    ],
    debrief:
      'These are genuine faults, the portal application cannot reach the lab interface, and they have nothing to do with the intrusion running through the rest of this package. Most errors in most logs are exactly like this: a real problem for whoever owns that application, but not a security problem for you. Learning to recognise and set these aside, without dismissing them outright in case that changes, is a large and unglamorous part of the job: an analyst who investigates every ERROR line as a possible attack never gets to the lines that actually are one.',
    practice: LOG_ANALYSIS_PRACTICE['logs.3.1'] ?? [],
  },
  {
    id: 'logs.3.2',
    moduleId: '2.3',
    packageId: 'log-analysis',
    order: 2,
    title: 'Match several patterns at once',
    kind: 'terminal',
    goal: 'Search for more than one word in a single pass using an extended regular expression.',
    prompt:
      'Find every system log entry about a service starting or stopping. Match both words in one command, and do not let capitalisation defeat you.',
    teach: {
      concept:
        'Up to now every pattern you have given grep has been a literal string: it looked for those exact characters, in that order, nothing more. A REGULAR EXPRESSION (regex for short) is a pattern language that can describe a whole family of text at once instead of one exact phrase, and grep understands it. Alternation, one word or another, is the simplest piece of that language: write "cat|dog" and it matches a line containing either word, because the pipe character inside a pattern means "or".\n\n' +
        'That alternation only works once you turn on EXTENDED regular expressions with the -E flag. Without -E, grep treats the pipe character as nothing special, just a literal character, so it would search for the literal text "cat|dog" and almost certainly find nothing. This is worth sitting with for a second, because the same pipe symbol you have been using to CONNECT commands together means something completely different when it sits INSIDE a quoted pattern: outside quotes it joins two commands, inside quotes with -E it means "or". Same symbol, two unrelated jobs, decided entirely by where it sits.\n\n' +
        'Combine -E with -i, which you already know ignores capitalisation, and you can search for two different words in one pass regardless of how each one happens to be capitalised. -iE, written together, is how you will actually type this in practice.',
      syntax: 'grep -E "ONE|OTHER" FILE',
      examples: [
        {
          command: `grep -E "nginx|postgres" ${SYS}`,
          explains: 'Lines about either service, in one pass instead of two commands.',
        },
        {
          command: `grep -iE "failed|invalid" ${AUTH}`,
          explains: 'Flags combine: -i for case, -E for alternation, written together as -iE.',
        },
      ],
      flags: [
        { flag: '-E', means: 'Treat the pattern as an extended regular expression, enabling | for alternation.' },
        { flag: '-iE', means: 'Both flags at once: the usual way you will actually type this.' },
      ],
    },
    hints: [
      'The two words are "started" and "stopped", but the log writes them with different capitalisation.',
      'Put both words in one pattern separated by a pipe character, and quote the whole thing.',
      'You need -E to enable the pipe as "or", and -i so capitalisation does not matter. Combine them as -iE.',
    ],
    solution: `grep -iE "started|stopped" ${SYS}`,
    expectedOutput: `${SERVICE_TRANSITIONS} lines: a backup starting, PostgreSQL stopping and restarting, and a user session starting.`,
    checks: [
      {
        type: 'output-line-count',
        count: SERVICE_TRANSITIONS,
        hint: `There are ${SERVICE_TRANSITIONS} matching lines. The log writes "Started" and "Stopping", so you need -i as well as -E.`,
      },
      {
        type: 'output-contains',
        text: 'Started',
        hint: 'Your pattern should match lines beginning a service, which this log capitalises.',
      },
    ],
    debrief:
      'The source specification for this course searched for lowercase "started|stopped" and would have found one line out of four, silently. That is the most common way a log search lies to you: it does not error out or warn you, it just returns SOME results, so on the surface it looks like it worked. Always sanity-check a count against what you actually expect to be there, because a plausible wrong answer is far more dangerous than an obviously broken command.',
    practice: LOG_ANALYSIS_PRACTICE['logs.3.2'] ?? [],
  },
  {
    id: 'logs.3.3',
    moduleId: '2.3',
    packageId: 'log-analysis',
    order: 3,
    title: 'Search only the most recent entries',
    kind: 'terminal',
    goal: 'Restrict a search to the end of a file, where the newest events are.',
    prompt:
      'Look at only the last 50 lines of the system log, and from those show the kernel messages.',
    teach: {
      concept:
        'Log files are APPEND-ONLY: every new event gets added to the end, and nothing already written is ever moved or rewritten, which means the newest entry is always the very last line of the file. `tail` is the mirror image of `head`, which you already know shows the beginning of a file: tail shows the end of it instead, and by default gives you the last 10 lines the same way head defaults to the first 10.\n\n' +
        'When you are asked "what is happening right now", you want the end of the file, not the whole thing, so piping `tail` into `grep` searches only that recent slice rather than the entire day\'s history. Order matters here in a way that is easy to get backwards: tail first, then grep, because you are choosing a TIME WINDOW first and filtering INSIDE it second. Reverse the two and you get a different question entirely: filtering the whole file for kernel messages and then taking the last 50 of THOSE matches, which could reach back hours or days depending on how rare kernel messages are, instead of the 50 most recent lines of any kind.',
      syntax: 'tail -n COUNT FILE | grep "PATTERN"',
      examples: [
        {
          command: `tail -n 100 ${AUTH} | grep "sshd"`,
          explains: 'SSH activity within the last hundred authentication entries.',
        },
        {
          command: `tail -n 20 ${SYS} | grep -i "cron"`,
          explains: 'Scheduled-task activity in the most recent twenty system entries.',
        },
      ],
    },
    hints: [
      'tail shows you the end of a file, the opposite of head.',
      'Take the last 50 lines first, then filter what comes out.',
      'Pipe tail -n 50 into a grep for the word kernel.',
    ],
    solution: `tail -n 50 ${SYS} | grep "kernel"`,
    expectedOutput: `${KERNEL_IN_LAST_50} lines, both firewall blocks recorded by the kernel.`,
    checks: [
      {
        type: 'output-line-count',
        count: KERNEL_IN_LAST_50,
        hint: `The last 50 lines contain ${KERNEL_IN_LAST_50} kernel messages. Take the tail first, then grep it.`,
      },
      {
        type: 'output-contains',
        text: 'kernel',
        hint: 'Every line in the result should be a kernel message.',
      },
    ],
    debrief:
      'Both hits are UFW BLOCK entries: UFW is the firewall running on this host, the software that decides which incoming connections are allowed to reach it at all, and BLOCK means it refused one. These two refused connections were aimed at ports 445 and 3389, the numbers Windows file sharing and remote desktop normally listen on, from outside the network, on a Linux web server that runs neither service. That is simply the internet knocking on every door it can find, all day long, on every host with a public address. It is background radiation, not an incident, and recognising it as such is what stops you from chasing it.',
    practice: LOG_ANALYSIS_PRACTICE['logs.3.3'] ?? [],
  },
];

// --- Module 2.4: Parsing and extraction --------------------------------------

const MODULE_2_4: Exercise[] = [
  {
    id: 'logs.4.1',
    moduleId: '2.4',
    packageId: 'log-analysis',
    order: 1,
    title: 'Extract every unique source address',
    kind: 'terminal',
    goal: 'Pull a pattern out of log lines and reduce it to a distinct list.',
    prompt:
      'Produce a sorted list of every unique IP address that appears on an sshd line in the authentication log. Output addresses only, no surrounding log text.',
    teach: {
      concept:
        'So far grep has returned whole lines. With the -o flag it returns only the part of the line that actually matched the pattern, discarding the rest, which turns grep from a line filter into an extraction tool: you get back just the fragment you asked for, one per matching line.\n\n' +
        'An IP address is the numeric label a device uses to identify itself on a network, written as four numbers from 0 to 255 separated by dots, like 203.0.113.55. Describe that shape as a pattern (four groups of one to three digits, each group separated by a literal dot) and grep will pull one out of every line it appears on, regardless of what text surrounds it. The pattern uses two pieces of extended regex syntax you have not seen yet: {1,3} means "between 1 and 3 of the previous character", so [0-9]{1,3} matches one, two, or three digits in a row, and the backslash before each dot (\\.) is needed because a bare dot in a regex means "any character at all", so escaping it forces it to match a literal dot and nothing else.\n\n' +
        'Feed the extracted addresses into `sort -u`, sort with its -u flag for unique, and thousands of lines collapse into the handful of distinct addresses that actually produced them: sort first arranges identical values next to each other, then -u keeps only one copy of each run, which only works correctly once matching values are already adjacent.',
      syntax: "grep -oE 'PATTERN' FILE | sort -u",
      examples: [
        {
          command: `grep -oE 'port [0-9]+' ${AUTH} | sort -u | head`,
          explains: 'Same mechanic against a different pattern: the distinct port numbers seen.',
        },
        {
          command: `grep -oE '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' ${SYS} | sort -u`,
          explains: 'The identical address pattern, run against the system log instead.',
        },
      ],
      flags: [
        { flag: '-o', means: 'Print only the matching part of the line, not the whole line.' },
        { flag: '-E', means: 'Enable extended regular expressions, so {1,3} and + work.' },
        { flag: 'sort -u', means: 'Sort the results and discard duplicates.' },
      ],
    },
    hints: [
      'First narrow to sshd lines, then extract from those.',
      "An IP address pattern looks like '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}': the backslashes make each dot literal.",
      'Use grep -oE to print only the matches, then pipe into sort -u to remove duplicates.',
    ],
    solution: `grep "sshd" ${AUTH} | grep -oE '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' | sort -u`,
    expectedOutput: `${SSHD_UNIQUE_IPS.size} addresses, one per line, in sorted order.`,
    checks: [
      {
        type: 'output-line-count',
        count: SSHD_UNIQUE_IPS.size,
        hint: `There are ${SSHD_UNIQUE_IPS.size} distinct addresses. Make sure you used sort -u to collapse duplicates.`,
      },
      {
        type: 'output-matches',
        pattern: '^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$',
        flags: 'm',
        hint: 'Each line should be an address on its own. Use -o so only the match is printed.',
      },
      {
        type: 'output-excludes',
        text: 'sshd',
        hint: 'Log text is still coming through: add -o so grep prints only the matched address.',
      },
    ],
    debrief:
      `Two thousand-odd lines reduced to ${SSHD_UNIQUE_IPS.size} addresses you can actually look at, which is the entire value of extraction: nobody can hold two thousand lines in their head, but a handful of addresses is something you can genuinely review one by one. Five are internal 10.20.x.x hosts. The rest are external, and one of them, 203.0.113.55, is the address behind both of those successful logins you found earlier.`,
    practice: LOG_ANALYSIS_PRACTICE['logs.4.1'] ?? [],
  },
  {
    id: 'logs.4.2',
    moduleId: '2.4',
    packageId: 'log-analysis',
    order: 2,
    title: 'Extract the account names being attacked',
    kind: 'terminal',
    goal: 'Capture just the value that follows a labelled field.',
    prompt:
      'The authentication failure lines record the account involved as "user=NAME". Produce a sorted list of the distinct account names that appear that way.',
    teach: {
      concept:
        'Many log formats label their fields directly inside the message, writing something like `user=root` or `rhost=10.20.9.40` rather than relying on position alone: the text before the equals sign names the field, and the text after it is the value. That is convenient to read, but it means a plain extraction pattern would capture the label along with the value, and you only want the value.\n\n' +
        '\\K is a Perl-style regex feature meaning "forget everything matched so far and start the match here": grep matches the label as normal, hits \\K, and throws away that part of the match before continuing, so only what comes after \\K ends up in the result. So `user=\\K[^ ]*` works in two steps: `user=` finds the literal label, \\K discards it from the output, and `[^ ]*` (the caret inside square brackets means "not", so this reads as "any run of characters that are not spaces") keeps everything up to the next space, which is the value itself.\n\n' +
        'This needs the -P flag, for Perl-compatible regular expressions, because \\K is not part of the extended regex you used in the last module. Together, `grep -oP \'label=\\K[^ ]*\'` is close to a standard one-liner in the field: whenever you meet a new labelled log format, this is the shape of the command you reach for first.',
      syntax: "grep -oP 'label=\\K[^ ]*' FILE | sort -u",
      examples: [
        {
          command: `grep -oP 'rhost=\\K[^ ]*' ${AUTH} | sort -u`,
          explains: 'The same trick against a different label: the distinct remote hosts.',
        },
        {
          command: `grep -oP 'uid=\\K[0-9]*' ${AUTH} | sort -u`,
          explains: 'Numeric user ids, using a digits-only pattern after the \\K.',
        },
      ],
      flags: [
        { flag: '-P', means: 'Use Perl-compatible regular expressions, which is what enables \\K.' },
        { flag: '\\K', means: 'Drop everything matched before this point, keeping only what follows.' },
        { flag: '[^ ]*', means: 'Any run of characters that are not spaces: i.e. the rest of the value.' },
      ],
    },
    hints: [
      'The label you are looking for is user= and it appears on the pam_unix failure lines.',
      "Use grep -oP so you can write 'user=\\K[^ ]*' as the pattern.",
      'Pipe the extracted names into sort -u to get the distinct list.',
    ],
    solution: `grep -oP 'user=\\K[^ ]*' ${AUTH} | sort -u`,
    expectedOutput: `${FAILED_USERNAMES.size} account names, one per line: ${[...FAILED_USERNAMES].sort().join(', ')}.`,
    checks: [
      {
        type: 'output-line-count',
        count: FAILED_USERNAMES.size,
        hint: `There are ${FAILED_USERNAMES.size} distinct names. Pipe into sort -u to collapse the repeats.`,
      },
      {
        type: 'output-excludes',
        text: 'user=',
        hint: 'The label is still in your output: \\K is what discards everything before it.',
      },
      {
        type: 'output-contains',
        text: 'testuser',
        hint: 'One of the accounts that failed repeatedly should appear in your list.',
      },
    ],
    debrief:
      'These are accounts that actually exist on this host, which is a meaningfully different situation from the invalid-user guessing you saw earlier: each failure here was a real guess against a real, existing account, not a wordlist bouncing off nothing. testuser is on the list, and testuser is one of the two accounts that later succeeded in logging in. Someone kept guessing against a target they knew was real, until eventually one guess landed.',
    practice: LOG_ANALYSIS_PRACTICE['logs.4.2'] ?? [],
  },
  {
    id: 'logs.4.3',
    moduleId: '2.4',
    packageId: 'log-analysis',
    order: 3,
    title: 'Build a timeline of SSH activity',
    kind: 'terminal',
    goal: 'Read events in order, and understand why log order is already chronological.',
    prompt:
      'Show the first 20 SSH-related entries in the authentication log, in the order they occurred.',
    teach: {
      concept:
        'A timeline, a plain list of what happened in the order it happened, is the backbone of every incident report, and log files hand you one for free: because entries are appended as events occur and never reordered afterward, the file itself is already in chronological order from top to bottom.\n\n' +
        'This means you should never sort a log file by its text to get it into time order: it already is, and sorting it as text would actually break that order. A text sort compares characters one at a time, left to right, so "Aug 9" would sort AFTER "Aug 15", because the character \'9\' comes after the character \'1\' when compared position by position, even though the 9th of the month happened before the 15th. Trust the file\'s natural order instead of imposing one on it.\n\n' +
        'Filter to the events you care about and simply read top to bottom: the first 20 matching lines are the earliest 20 matching events of the day, exactly because you did nothing to disturb the order they arrived in.',
      syntax: 'grep "PATTERN" FILE | head -n COUNT',
      examples: [
        {
          command: `grep "sudo" ${AUTH} | head -n 10`,
          explains: 'The first ten privilege escalations of the day, in order.',
        },
        {
          command: `grep "Accepted" ${AUTH} | head -n 3`,
          explains: 'The earliest three successful logins.',
        },
      ],
    },
    hints: [
      'Filter the auth log to lines mentioning sshd.',
      'The file is already in time order, so you do not need to sort anything.',
      'Pipe into head -n 20 to take the first twenty.',
    ],
    solution: `grep "sshd" ${AUTH} | head -n 20`,
    expectedOutput: '20 sshd lines, earliest first, starting just after midnight.',
    checks: [
      {
        type: 'output-line-count',
        count: 20,
        hint: 'Take exactly the first 20 lines with head -n 20.',
      },
      {
        type: 'output-contains',
        text: 'sshd',
        hint: 'Every line should be an sshd entry.',
      },
      {
        type: 'output-contains',
        text: 'Aug 15 00:',
        hint: 'The first entries of the day start just after midnight: you want the head of the file, not the tail.',
      },
    ],
    debrief:
      'Notice that the earliest entries are all the same account failing from the same internal address, every five minutes, all night long, with a regularity no human typing a password by hand ever produces. That rhythm is the signature of a monitoring box with a stale password: some automated check retrying on a fixed schedule with credentials nobody updated after a password rotation, a misconfiguration rather than an attack, and one that generates more failure lines than the actual attacker managed all day. Volume is not evidence: a machine that is merely broken can outshout one that is genuinely hostile.',
    practice: LOG_ANALYSIS_PRACTICE['logs.4.3'] ?? [],
  },
  {
    id: 'logs.4.4',
    moduleId: '2.4',
    packageId: 'log-analysis',
    order: 4,
    title: 'Corroborate an event across two logs',
    kind: 'terminal',
    goal: 'Search several files at once and use the filename prefix to correlate sources.',
    prompt:
      'The account "testuser" is worth a closer look. Search for it in both the authentication log and the system log at the same time.',
    teach: {
      concept:
        'Give grep more than one filename and it searches all of them in turn, and as soon as there is more than one file to search, it automatically prefixes every result with the name of the file it came from, so you can tell a hit in auth.log apart from a hit in syslog even though both appear in the same scrolling output. No new flag is needed for this: it happens by default the moment you list a second file.\n\n' +
        'That filename prefix is the whole point of running the search this way. A single log line is one program\'s claim about what happened, written by one piece of software that could, in principle, be wrong, misconfigured, or tampered with. The same event, at the same moment, recorded independently by a SECOND program that has no idea what the first one wrote, is much closer to evidence: two separate witnesses agreeing is far stronger than one. And if an attacker managed to edit one log file to cover their tracks, a mismatch between what it says and what the second, untouched log says becomes a finding in its own right.',
      syntax: 'grep "PATTERN" FILE1 FILE2',
      examples: [
        {
          command: `grep "sysmon" ${AUTH} ${SYS}`,
          explains: 'The same cross-check against the other account of interest.',
        },
        {
          command: 'grep "postgres" /var/log/syslog /var/log/auth.log',
          explains: 'Database activity as seen by two different logs.',
        },
      ],
    },
    hints: [
      'You can pass grep two filenames instead of one.',
      'The two files are /var/log/auth.log and /var/log/syslog.',
      'No flags needed: grep adds the filename prefix automatically when searching multiple files.',
    ],
    solution: `grep "testuser" ${AUTH} ${SYS}`,
    expectedOutput:
      `Matches from both files, each prefixed with its filename: many from auth.log, and ${TESTUSER_IN_SYSLOG} from syslog.`,
    checks: [
      {
        type: 'output-contains',
        text: `${AUTH}:`,
        hint: 'Results from the auth log should be prefixed with its filename.',
      },
      {
        type: 'output-contains',
        text: `${SYS}:`,
        hint: 'You need to search the system log as well: pass both filenames to grep.',
      },
      {
        type: 'output-contains',
        text: 'testuser',
        hint: 'Search for the account name testuser.',
      },
    ],
    debrief:
      'Two independent subsystems recorded the same moment: sshd, which handles the actual authentication, wrote "Accepted password for testuser from 203.0.113.55" at 10:14:22, and systemd-logind, the separate program responsible for managing user sessions once someone is in, wrote "New session 4821 of user testuser" one second later. Neither program consulted the other before writing its line, which is exactly why their agreement means something: that agreement is what turns a suspicion into something you can put in a report, and it is where Alert Triage picks up.',
    practice: LOG_ANALYSIS_PRACTICE['logs.4.4'] ?? [],
  },
];

// --- Module 2.5: Counting and ranking ----------------------------------------

const MODULE_2_5: Exercise[] = [
  {
    id: 'logs.5.1',
    moduleId: '2.5',
    packageId: 'log-analysis',
    order: 1,
    title: 'Rank the sources instead of counting them',
    kind: 'terminal',
    goal: 'Turn a pile of matching lines into a ranked list, which is the shape a finding needs.',
    prompt:
      'You already know how many failed passwords there are. That number tells nobody what to do. Produce a ranked list of the source addresses behind those failures, commonest first, and show only the top line.',
    teach: {
      concept:
        'Four commands chained together answer most log questions you will ever be asked, and they always go in the same order: isolate the lines, extract the one field you care about, sort so identical values sit together, then count them. The new tool here is `uniq`, short for unique: given a stream of lines, it collapses each run of ADJACENT, identical lines into a single line, and its -c flag prefixes that single line with how many times it repeated.\n\n' +
        'The reason sort has to run before uniq is right there in the word ADJACENT: uniq only notices duplicates that are already next to each other, it does not scan the whole file looking for matches. Handed unsorted input where the same address appears on lines 3, 40, and 900, uniq treats all three as unrelated, because none of them sit beside each other, and it silently produces a count of 1 for each instead of 3. sort\'s job is to gather every occurrence of a value into one place first, so uniq has something contiguous to collapse.\n\n' +
        'The second sort, with -rn, then orders those counts numerically (-n, so 9 sorts before 10, unlike a plain text sort) and largest first (-r, for reverse), which is what turns an unordered list of counts into an actual ranking with the busiest value on line one.',
      syntax: 'grep PATTERN FILE | grep -oE FIELD | sort | uniq -c | sort -rn | head -n N',
      examples: [
        {
          command: "grep 'Accepted' /var/log/auth.log | grep -oE 'for [a-z-]+' | sort | uniq -c | sort -rn",
          explains: 'Ranks the accounts that logged in SUCCESSFULLY. Same shape as the exercise, pointed at a different question.',
        },
        {
          command: "grep -oE 'rhost=[0-9.]+' /var/log/auth.log | sort | uniq -c | sort -rn | head -n 3",
          explains: 'The three busiest rhost values across the whole file, ignoring what the lines say.',
        },
      ],
      flags: [
        { flag: '-o', means: 'Print only the matching part of the line, not the whole line.' },
        { flag: '-c (on uniq)', means: 'Prefix each group with how many times it occurred.' },
        { flag: '-rn (on sort)', means: 'Sort numerically (-n) and put the largest first (-r).' },
      ],
    },
    hints: [
      'Start from the command that finds the failures, then pipe it into something that extracts just the address.',
      'grep -oE "from [0-9.]+" gets you the address with a word in front of it, which is fine: the word is the same on every line.',
      'Remember the order: sort, then uniq -c, then sort -rn. Skipping the first sort makes uniq return nonsense that looks plausible.',
    ],
    solution:
      "grep 'Failed password' /var/log/auth.log | grep -oE 'from [0-9.]+' | sort | uniq -c | sort -rn | head -n 1",
    expectedOutput: `The single busiest source, ${TOP_SOURCE}, with ${TOP_SOURCE_COUNT} failures against it.`,
    checks: [
      {
        type: 'output-contains',
        text: TOP_SOURCE,
        hint: 'The top line should name the address responsible for the most failures.',
      },
      {
        type: 'output-contains',
        text: String(TOP_SOURCE_COUNT),
        hint: 'The count belongs on the line too. If you are missing it, you skipped uniq -c.',
      },
      {
        type: 'command-uses-pipe',
        hint: 'This one genuinely needs a pipeline: isolate, extract, sort, count, rank.',
      },
    ],
    debrief: `One address accounts for ${TOP_SOURCE_COUNT} of the ${FAILED_PASSWORD} failures, which is most of them. That is the difference between "we are under attack from many directions" and "one host is misconfigured", and a single total number cannot tell you which of those two very different situations you are in: you have to break the total apart by source before the shape of it becomes visible.`,
    practice: [],
  },
  {
    id: 'logs.5.2',
    moduleId: '2.5',
    packageId: 'log-analysis',
    order: 2,
    title: 'How many distinct sources are there really',
    kind: 'terminal',
    goal: 'Separate volume from breadth, because they lead to different conclusions.',
    prompt:
      'Count how many DISTINCT source addresses produced at least one failed password. Your answer should be a single number.',
    teach: {
      concept:
        'Volume and breadth are different measurements and they support different conclusions. Hundreds of failures from one address is a single misbehaving host or one determined attacker. The same total spread across two hundred addresses is a botnet, a large number of separate machines all attacking at once, and the response to each of those situations is nothing like the response to the other.\n\n' +
        'The tool for breadth is `sort -u`, which you have seen before: it removes duplicate lines outright and keeps one copy of each, rather than counting how many times each one occurred the way uniq -c does. Piped into `wc -l` to count what survives, you get straight to "how many DIFFERENT values were there", skipping the counting step entirely because this question does not need it.\n\n' +
        'Note that this is `sort -u` and not `uniq` running on its own without a sort in front of it, which is the mistake that quietly under-counts: exactly as in the ranking pipeline, uniq alone only removes duplicates that are already sitting next to each other, and unsorted input would let the same address slip through more than once.',
      syntax: 'grep -oE FIELD FILE | sort -u | wc -l',
      examples: [
        {
          command: "grep -oE 'user=[a-z-]+' /var/log/auth.log | sort -u | wc -l",
          explains: 'Counts the distinct account names that appear on pam_unix failure lines.',
        },
      ],
      flags: [
        { flag: '-u (on sort)', means: 'Discard duplicate lines, keeping one of each.' },
        { flag: '-l (on wc)', means: 'Count lines rather than words or characters.' },
      ],
    },
    hints: [
      'The pipeline is the same as the ranking one until the point where you counted. Replace the counting half.',
      'sort -u gives you one line per distinct address. What counts lines?',
    ],
    solution:
      "grep 'Failed password' /var/log/auth.log | grep -oE 'from [0-9.]+' | sort -u | wc -l",
    expectedOutput: `${UNIQUE_FAILED_SOURCES}`,
    checks: [
      {
        type: 'output-numeric',
        equals: UNIQUE_FAILED_SOURCES,
        hint: 'Extract just the address, discard duplicates with sort -u, then count the lines.',
      },
    ],
    debrief: `${FAILED_PASSWORD} failures from only ${UNIQUE_FAILED_SOURCES} addresses. That ratio, many failures concentrated in very few sources, is not the signature of a botnet, which would spread the same total across dozens or hundreds of distinct addresses instead. It is a small number of sources being persistent, and persistence from a handful of addresses is a much easier problem to act on than an attack with no single point to block.`,
    practice: [],
  },
  {
    id: 'logs.5.3',
    moduleId: '2.5',
    packageId: 'log-analysis',
    order: 3,
    title: 'Which account is being hunted',
    kind: 'terminal',
    goal: 'Rank the targets, not just the attackers.',
    prompt:
      'Rank the account names those failed passwords were aimed at, commonest first, and show only the top line.',
    teach: {
      concept:
        'You have ranked where the traffic came from. The other half of the question is what it was reaching for, and the answer changes how worried you are. A spread across hundreds of invented account names is a dictionary attack running blind, trying anything that might exist. Concentrated fire on one real, specific account is somebody who has done their homework and already knows what they are aiming at.\n\n' +
        'Extracting the account is slightly harder than extracting the address, because the name sits BETWEEN two fixed words rather than at the very end of the line. Anchoring the pattern on both sides is the general technique for this: match the literal word "for" immediately before the value and the literal word "from" immediately after it, and let the variable part in between be whatever grep is allowed to capture. Anchoring on both ends like this is what stops the match from accidentally running too far in either direction.',
      syntax: "grep -oE 'for [a-z]+ from'",
      examples: [
        {
          command: "grep 'Accepted' /var/log/auth.log | grep -oE 'from [0-9.]+' | sort | uniq -c | sort -rn",
          explains: 'The same ranking shape aimed at successful logins by source, which is a different question again.',
        },
      ],
    },
    hints: [
      'The account name sits between the word "for" and the word "from" on a Failed password line.',
      'Anchor on both words: an extraction pattern of "for [a-z]+ from" keeps the name and pins it in place.',
      'Once extracted, it is the same sort, uniq -c, sort -rn ending you already know.',
    ],
    solution:
      "grep 'Failed password' /var/log/auth.log | grep -oE 'for [a-z]+ from' | sort | uniq -c | sort -rn | head -n 1",
    expectedOutput: `The most-targeted account, ${TOP_TARGET}, with ${TOP_TARGET_COUNT} attempts.`,
    checks: [
      {
        type: 'output-contains',
        text: TOP_TARGET,
        hint: 'The top line should name the account that was tried most often.',
      },
      {
        type: 'output-contains',
        text: String(TOP_TARGET_COUNT),
        hint: 'Include the count: that is what uniq -c is for.',
      },
    ],
    debrief: `The most-hunted account is ${TOP_TARGET}, and it is a monitoring account rather than a person who works here. Hold that thought: an account that genuinely exists and is being hammered from one single address, rather than from many, is usually a service whose password changed at some point and whose configuration file nobody went back and updated, so it keeps retrying the old, now-wrong credentials on a schedule. That is a maintenance problem wearing the same shape as an attack, and telling the two apart is exactly what the next exercise is for.`,
    practice: [],
  },
  {
    id: 'logs.5.4',
    moduleId: '2.5',
    packageId: 'log-analysis',
    order: 4,
    title: 'Attribute the volume to one source',
    kind: 'terminal',
    goal: 'Test a hypothesis with a count rather than believing a ranking.',
    prompt: `Your ranking says ${TOP_SOURCE} is the loudest source. Count exactly how many failed passwords came from that address, as a single number.`,
    teach: {
      concept:
        'A ranking is a summary, and summaries are where mistakes hide: a sort or a count step earlier in a long pipeline could have gone subtly wrong, and the final line would still look entirely plausible. Before you put a number in a report, count the specific thing you are about to claim on its own, with a short command somebody else could rerun and check without having to trust the pipeline that originally produced it.\n\n' +
        'Chaining two greps is the plainest way to say "lines that match both": the first narrows to the event you care about, the second narrows further to the source you care about. It is also easier to read six months from now, by you or by somebody else, than one clever pattern trying to do both jobs at once.',
      syntax: 'grep PATTERN FILE | grep -c OTHER',
      examples: [
        {
          command: "grep 'Accepted' /var/log/auth.log | grep -c 'publickey'",
          explains: 'Counts successful logins that used a key rather than a password, by narrowing twice.',
        },
      ],
      flags: [{ flag: '-c', means: 'Print how many lines matched instead of printing the lines.' }],
    },
    hints: [
      'Two greps in a row: one for the event, one for the address.',
      'Put -c on the second grep so you get a number rather than several hundred lines.',
    ],
    solution: `grep 'Failed password' /var/log/auth.log | grep -c '${TOP_SOURCE}'`,
    expectedOutput: `${TOP_SOURCE_COUNT}`,
    checks: [
      {
        type: 'output-numeric',
        equals: TOP_SOURCE_COUNT,
        hint: 'Narrow to Failed password first, then count the lines mentioning that address.',
      },
    ],
    debrief: `Confirmed independently of the ranking. That is the habit worth keeping for the rest of your career: the long pipeline suggested the answer, and a second, much simpler command proved it by an entirely different route. Anything you cannot reproduce twice, by two different paths, does not go in the report.`,
    practice: [],
  },
  {
    id: 'logs.5.5',
    moduleId: '2.5',
    packageId: 'log-analysis',
    order: 5,
    title: 'Find the busiest hour',
    kind: 'terminal',
    goal: 'Rank by time to find the burst, rather than reading the whole day.',
    prompt:
      'Work out which hour of the day generated the most auth.log lines. Show the top line only, with its count.',
    teach: {
      concept:
        'Attacks are rarely spread evenly across a whole day. Finding the single hour with the most activity tells you where to look before you read a single line of the file, and it turns a 2,500-line investigation into a five-minute question: which hour, and how much.\n\n' +
        'You have used `cut` before to split a line on a delimiter and keep numbered fields. `cut -c` works differently: instead of counting fields between delimiters, it counts raw CHARACTERS from the start of the line, ignoring spaces and structure entirely. That only works reliably when a value always sits at exactly the same character position on every line, which the timestamp does, because syslog format pads every date and time to a fixed width. "Aug 15 09:14:02" and "Aug 15 23:59:59" are both exactly the same length, so the two-digit hour is always characters 8 and 9, and `cut -c8-9` lifts it straight out without caring what the rest of the line says.\n\n' +
        'Once every line has been reduced to just its hour, it feeds into the same sort, uniq -c, sort -rn ranking pipeline you already know, and the busiest hour of the day falls out of that in one command.',
      syntax: 'cut -c START-END FILE',
      examples: [
        {
          command: 'cut -c1-6 /var/log/syslog | sort -u',
          explains: 'Lifts the month and day out of syslog by position, showing which dates the file covers.',
        },
      ],
      flags: [{ flag: '-c', means: 'Select by character position rather than by delimited field.' }],
    },
    hints: [
      'Count the characters: "Aug 15 09:14:02" puts the hour at positions 8 and 9.',
      'Once you have one hour per line, it is the ranking pipeline you already know.',
    ],
    solution: 'cut -c8-9 /var/log/auth.log | sort | uniq -c | sort -rn | head -n 1',
    expectedOutput: `Hour ${BUSIEST_HOUR}, with ${BUSIEST_HOUR_COUNT} lines.`,
    checks: [
      {
        type: 'output-contains',
        text: String(BUSIEST_HOUR_COUNT),
        hint: 'The busiest hour has a count far above the others. Rank numerically with sort -rn.',
      },
      {
        type: 'output-contains',
        text: BUSIEST_HOUR,
        hint: 'The line should show which hour it was, as two digits.',
      },
    ],
    debrief: `${BUSIEST_HOUR_COUNT} lines in the ${BUSIEST_HOUR}:00 hour, against a couple of hundred in a normal one: a spike large enough that it could not be explained by ordinary daily variation. You now know exactly where in the day to start reading, and you got there without opening the file once, which is the entire value of ranking by time before you start reading by eye.`,
    practice: [],
  },
];

// --- Module 2.6: Filtering out the noise -------------------------------------

const MODULE_2_6: Exercise[] = [
  {
    id: 'logs.6.1',
    moduleId: '2.6',
    packageId: 'log-analysis',
    order: 1,
    title: 'Set the known-benign source aside',
    kind: 'terminal',
    goal: 'Use an exclusion to see what is left once the loudest thing is removed.',
    prompt: `${TOP_SOURCE} is the internal monitoring host, and its failures are a known misconfiguration somebody is already fixing. Count the failed passwords that did NOT come from it.`,
    teach: {
      concept:
        'Most of what a log contains has a perfectly good explanation once you go looking for one: a monitoring box with a stale password, a scanner working through a wordlist, a backup job running on schedule. The skill from here on is removing the explained part without removing anything else, so that what remains is small enough to actually read, while still containing everything you have not accounted for yet.\n\n' +
        '`grep -v` inverts a match: instead of printing the lines that DO contain the pattern, it prints every line that does NOT. Chained after a grep that has already narrowed to the event you care about, it effectively says "these events, except the ones from that particular explained source", peeling one accounted-for slice off the pile without touching anything else in it.',
      syntax: 'grep PATTERN FILE | grep -v EXCLUDE | wc -l',
      examples: [
        {
          command: "grep 'Accepted' /var/log/auth.log | grep -v 'publickey' | wc -l",
          explains: 'Counts the successful logins that were NOT key-based, by removing the ones that were.',
        },
      ],
      flags: [{ flag: '-v', means: 'Invert: print the lines that do not match.' }],
    },
    hints: [
      'Narrow to the failures first, then remove the address, then count.',
      'The flag that inverts a match is -v.',
    ],
    solution: `grep 'Failed password' /var/log/auth.log | grep -v '${TOP_SOURCE}' | wc -l`,
    expectedOutput: `${FAILED_WITHOUT_TOP_SOURCE}`,
    checks: [
      {
        type: 'output-numeric',
        equals: FAILED_WITHOUT_TOP_SOURCE,
        hint: 'Filter to Failed password, invert-match the monitoring address away, then count what is left.',
      },
    ],
    debrief: `${FAILED_PASSWORD} became ${FAILED_WITHOUT_TOP_SOURCE} by removing one explained source. Every exclusion you make is a claim, specifically the claim that this particular source is benign and safe to set aside, so it belongs written down in your notes just as much as anything you kept: an analyst who cannot say exactly what they filtered out, and why, cannot defend what they concluded from what was left.`,
    practice: [],
  },
  {
    id: 'logs.6.2',
    moduleId: '2.6',
    packageId: 'log-analysis',
    order: 2,
    title: 'Remove the top two and see what survives',
    kind: 'terminal',
    goal: 'Stack exclusions, and watch how quickly the remainder stops shrinking.',
    prompt: `Now set aside both ${TOP_SOURCE} and ${SECOND_SOURCE}, and count the failed passwords that remain.`,
    teach: {
      concept:
        'Exclusions stack: each `grep -v` in the chain removes another explained slice, and the number that survives at the end of the chain is your genuinely unexplained remainder, the part nobody has accounted for yet.\n\n' +
        'Watch how that remainder behaves as you add more filters. If it collapses towards zero, the activity you were looking at was concentrated in a small number of sources and you have now accounted for essentially all of it. If it barely moves even after excluding the two biggest sources, the noise is spread thin across many small contributors instead, and you are dealing with something broader than a couple of misbehaving hosts. That shape, how fast the remainder shrinks, is worth more to your investigation than either individual number on its own.',
      syntax: 'grep PATTERN FILE | grep -v FIRST | grep -v SECOND | wc -l',
      examples: [
        {
          command: "grep 'sshd' /var/log/auth.log | grep -v 'Failed' | grep -v 'Invalid' | wc -l",
          explains: 'Counts sshd lines that are neither failures nor invalid-user notices, which is roughly the benign remainder.',
        },
      ],
    },
    hints: [
      'One -v per thing you are excluding, chained with pipes.',
      'Order does not matter here, since each filter removes a different set of lines.',
    ],
    solution: `grep 'Failed password' /var/log/auth.log | grep -v '${TOP_SOURCE}' | grep -v '${SECOND_SOURCE}' | wc -l`,
    expectedOutput: `${FAILED_WITHOUT_TOP_TWO}`,
    checks: [
      {
        type: 'output-numeric',
        equals: FAILED_WITHOUT_TOP_TWO,
        hint: 'Chain a second -v for the other address before counting.',
      },
    ],
    debrief: `Two addresses account for most of the volume, and ${FAILED_WITHOUT_TOP_TWO} lines are left over once both are excluded. That remainder is now small enough to read line by line without skimming, which is the whole point of filtering: not to make a number smaller for its own sake, but to shrink a file down to something a human can actually get through.`,
    practice: [],
  },
  {
    id: 'logs.6.3',
    moduleId: '2.6',
    packageId: 'log-analysis',
    order: 3,
    title: 'What else writes to this file',
    kind: 'terminal',
    goal: 'Invert on the dominant process to discover what you have been ignoring.',
    prompt:
      'auth.log is mostly sshd, and you have been reading nothing else. Count the lines in it that do NOT come from sshd.',
    teach: {
      concept:
        'Inverting a match is also a discovery tool, not just a noise filter. When one process dominates a file the way sshd dominates auth.log, removing it shows you everything you have been scrolling straight past: sudo, cron (the scheduler that runs jobs automatically on a timer), useradd, password changes, and account creations, all the entries that got lost in a sea of login attempts.\n\n' +
        'This is worth doing on any unfamiliar log before you start hunting for something specific, because the interesting minority of a file is frequently sitting in the part you were never actually looking at.',
      syntax: 'grep -v PATTERN FILE | wc -l',
      examples: [
        {
          command: "grep -v 'nginx' /var/log/syslog | wc -l",
          explains: 'Counts the syslog lines written by anything other than the web server, which dominates that file.',
        },
      ],
    },
    hints: [
      'One grep, one flag, one pipe to count.',
      'You are not narrowing to an event this time. Invert on the process name directly against the file.',
    ],
    solution: "grep -v 'sshd' /var/log/auth.log | wc -l",
    expectedOutput: `${NON_SSHD}`,
    checks: [
      {
        type: 'output-numeric',
        equals: NON_SSHD,
        hint: 'Invert-match sshd against the whole file and count what is left.',
      },
    ],
    debrief: `${NON_SSHD} lines out of ${authLines.length} that you had never actually looked at, buried underneath everything sshd was writing. Go and read them at some point: sudo, cron and account changes all live in there, and account changes are exactly the kind of thing an attacker makes after they get in, precisely because most analysts never think to look past the login noise to find them.`,
    practice: [],
  },
  {
    id: 'logs.6.4',
    moduleId: '2.6',
    packageId: 'log-analysis',
    order: 4,
    title: 'An exclusion that takes too much with it',
    kind: 'terminal',
    goal: 'Exclude precisely, because a sloppy pattern quietly removes evidence.',
    prompt: `A colleague filtered the internal monitoring traffic out with \`grep -v '10.'\`, which removes far more than they meant. Count the failed passwords excluding ONLY the full address ${TOP_SOURCE}, and confirm you get more lines than their filter would have left.`,
    teach: {
      concept:
        'A grep pattern is matched as a substring, not understood as an address, and inside a regex a bare dot matches any single character at all unless you escape it, a detail that already mattered once when you extracted IP addresses and now bites in the opposite direction. `grep -v "10."` therefore removes every line containing a literal 1, followed by a literal 0, followed by ANY character at all: port 1024, uid 1001, the timestamp 10:14, and every address that happens to start with 10, whether or not it was the one you actually meant to exclude.\n\n' +
        'Whole hours of evidence can disappear this way and nothing warns you, because the command runs without any error and returns a smaller, entirely plausible-looking number.\n\n' +
        'The defensive habit is to make an exclusion as specific as the thing you are actually trying to exclude. Match the full address rather than a fragment of it. Better still, match the labelled field it appears in (rhost=10.20.9.40 rather than the bare digits), so the same digits showing up somewhere else on the line cannot accidentally trigger the exclusion.',
      syntax: 'grep -v FULL-SPECIFIC-PATTERN',
      examples: [
        {
          command: "grep -v 'rhost=10.20.9.40' /var/log/auth.log | wc -l",
          explains: 'Excludes the address only where it appears as the rhost field, which is as specific as this gets.',
        },
      ],
    },
    hints: [
      'Use the whole address in the exclusion, not a prefix of it.',
      'The count you want is the same one you computed when you first set that source aside.',
    ],
    solution: `grep 'Failed password' /var/log/auth.log | grep -v '${TOP_SOURCE}' | wc -l`,
    expectedOutput: `${FAILED_WITHOUT_TOP_SOURCE}`,
    checks: [
      {
        type: 'output-numeric',
        equals: FAILED_WITHOUT_TOP_SOURCE,
        hint: 'Exclude the complete address rather than a fragment of it.',
      },
    ],
    debrief:
      'The dangerous part of a bad exclusion is that it succeeds exactly as far as running without an error message. You get a number back, it looks smaller than before, and the evidence it silently removed along the way leaves absolutely no trace that it was ever there. When you filter anything out of a log, filter on the most specific string that still does the job, and prefer matching a labelled field over matching a bare fragment of text that could appear anywhere.',
    practice: [],
  },
  {
    id: 'logs.6.5',
    moduleId: '2.6',
    packageId: 'log-analysis',
    order: 5,
    title: 'Rank what is left after filtering',
    kind: 'terminal',
    goal: 'Combine exclusion with ranking, which is how a real triage pass runs.',
    prompt: `Set aside ${TOP_SOURCE}, then rank the remaining failed-password sources and show the top line.`,
    teach: {
      concept:
        'This is the pattern you will run most often in a real shift, and it is just the two halves of this module joined together: remove what is already explained, then rank what is left so that the biggest still-unexplained thing lands on the very first line of the output.\n\n' +
        'Run it repeatedly and it becomes a loop you can lean on for the rest of your career: rank, explain the top entry, exclude it, rank again. You stop when the top of the list is either something you genuinely cannot explain, which is your finding, or small enough that it plainly does not matter, which is also a valid, reportable answer.',
      syntax: 'grep EVENT FILE | grep -v KNOWN | grep -oE FIELD | sort | uniq -c | sort -rn | head',
      examples: [
        {
          command: "grep 'sshd' /var/log/auth.log | grep -v 'Failed' | grep -oE 'from [0-9.]+' | sort | uniq -c | sort -rn | head -n 2",
          explains: 'Ranks the sources of sshd lines that are not failures, which is the benign traffic profile.',
        },
      ],
    },
    hints: [
      'The exclusion goes early, before you extract the field.',
      'After the -v, it is exactly the pipeline from the first exercise in the previous module.',
    ],
    solution: `grep 'Failed password' /var/log/auth.log | grep -v '${TOP_SOURCE}' | grep -oE 'from [0-9.]+' | sort | uniq -c | sort -rn | head -n 1`,
    expectedOutput: `${SECOND_SOURCE}, now the top source with the monitoring host removed.`,
    checks: [
      {
        type: 'output-contains',
        text: SECOND_SOURCE,
        hint: 'With the monitoring host filtered out, a different address should be on top.',
      },
      {
        type: 'command-uses-pipe',
        hint: 'Exclude, extract, sort, count, rank.',
      },
    ],
    debrief: `${SECOND_SOURCE} is now the loudest thing left standing that you cannot yet explain away as routine. It is external, meaning it does not belong to this company at all, and after everything else has been filtered out, it is the address worth spending the next hour of your shift on.`,
    practice: [],
  },
];

// --- Module 2.7: Logs that have been rotated ---------------------------------

const MODULE_2_7: Exercise[] = [
  {
    id: 'logs.7.1',
    moduleId: '2.7',
    packageId: 'log-analysis',
    order: 1,
    title: 'The log you were reading is not all of it',
    kind: 'terminal',
    goal: 'Discover that yesterday lives in a different file, and measure it.',
    prompt: 'Count the lines in the rotated authentication log, /var/log/auth.log.1.',
    teach: {
      concept:
        'A log file that nothing ever cleaned up would grow forever, because every event ever recorded just keeps getting appended to the end of it, day after day, for as long as the machine runs. Left unmanaged that eventually fills the disk completely, which can crash the very services the logs were supposed to be monitoring. LOG ROTATION is the fix: on a schedule, usually once a day, the live file is renamed with a .1 on the end, a brand new, empty file takes over the original name and starts collecting today\'s events, and whatever was previously named .1 gets pushed down to .2, and so on, with the oldest generations eventually compressed to save space (you will see those as .gz files).\n\n' +
        'This matters more than it sounds like it should. Every search you have run in this package so far pointed at /var/log/auth.log, the live file, which means it only ever covered the period since the last rotation happened. An incident that started before that rotation is completely invisible to a search of the live file alone, and you would have absolutely no way of knowing you had missed it, because every command you ran still succeeded and returned a confident-looking answer.',
      syntax: 'wc -l FILE',
      examples: [
        {
          command: 'ls -l /var/log/',
          explains: 'Shows the rotated generations sitting alongside the live files, with their sizes and dates.',
        },
      ],
    },
    hints: [
      'It is a normal file with a slightly odd name. Count its lines the way you would any other.',
      'The path is /var/log/auth.log.1 exactly.',
    ],
    solution: 'wc -l /var/log/auth.log.1',
    expectedOutput: `${ROTATED_TOTAL} /var/log/auth.log.1`,
    checks: [
      {
        type: 'output-contains',
        text: String(ROTATED_TOTAL),
        hint: 'Count the lines in the rotated file, not the live one.',
      },
    ],
    debrief:
      'Every search you have run in this package so far ignored this file entirely, simply because you never pointed a command at it. That is the single most common way a real investigation misses the beginning of an incident: not because the evidence was hidden, but because nobody thought to look in the file one rotation back.',
    practice: [],
  },
  {
    id: 'logs.7.2',
    moduleId: '2.7',
    packageId: 'log-analysis',
    order: 2,
    title: 'Was it happening yesterday too',
    kind: 'terminal',
    goal: 'Establish whether activity predates the window you were given.',
    prompt: 'Count the failed passwords in the rotated log, /var/log/auth.log.1.',
    teach: {
      concept:
        'The most valuable question about any suspicious activity is when it started, because the answer separates "somebody probed us this morning" from "this has been running for a fortnight and nobody noticed", and those two situations call for completely different responses.\n\n' +
        'The method is unglamorous: run the exact same count you ran on the live file against the previous generation instead, and compare the two numbers by eye. A similar count in both is ongoing background noise that has been happening at roughly the same rate for a while. A sharp jump in the current file compared to the rotated one means something changed recently, and the change itself, not the noise around it, is what you go and investigate.',
      syntax: 'grep -c PATTERN FILE',
      examples: [
        {
          command: "grep -c 'Accepted' /var/log/auth.log.1",
          explains: 'Counts successful logins in the previous generation, for comparison against today.',
        },
      ],
    },
    hints: [
      'Same count you ran on day one of this package, pointed at a different file.',
      'Use -c so you get the number rather than the lines.',
    ],
    solution: "grep -c 'Failed password' /var/log/auth.log.1",
    expectedOutput: `${ROTATED_FAILED}`,
    checks: [
      {
        type: 'output-numeric',
        equals: ROTATED_FAILED,
        hint: 'Count the Failed password lines in the rotated file.',
      },
    ],
    debrief: `${ROTATED_FAILED} yesterday against ${FAILED_PASSWORD} today. The failures themselves are not new activity, this has clearly been going on for at least two days, but the VOLUME is new: whatever changed, changed recently, somewhere between yesterday and today, and that comparison narrows down what you are actually looking for far more than either number would have on its own.`,
    practice: [],
  },
  {
    id: 'logs.7.3',
    moduleId: '2.7',
    packageId: 'log-analysis',
    order: 3,
    title: 'Search both generations at once',
    kind: 'terminal',
    goal: 'Count an event across the whole retained history rather than one file.',
    prompt:
      'Count the failed passwords across BOTH the live and rotated auth logs, as one number.',
    teach: {
      concept:
        'When you want a total across several files, `grep -c` will not give it to you directly: handed more than one file, it prints a separate per-file count for each one, which is useful information but is not the single combined total you actually asked for.\n\n' +
        'The fix is to join the files into one stream before grep ever sees them. `cat` (short for concatenate) with several filenames as arguments prints them one after another, in the order you list them, as if they were a single unbroken file. The grep downstream then sees one continuous stream of input rather than two separate files, and returns one number instead of two. This is the real reason `cat file | grep` shows up constantly in real usage: not because it is necessary for a single file, where it adds nothing, but because it is how you build one combined stream out of several.',
      syntax: 'cat FILE1 FILE2 | grep -c PATTERN',
      examples: [
        {
          command: "cat /var/log/syslog /var/log/syslog.1 | grep -c 'nginx'",
          explains: 'One nginx total across both syslog generations, rather than a count per file.',
        },
      ],
    },
    hints: [
      'Join the two files into one stream before you count.',
      'cat takes more than one filename, and the order you list them in is the order they arrive.',
    ],
    solution: "cat /var/log/auth.log /var/log/auth.log.1 | grep -c 'Failed password'",
    expectedOutput: `${FAILED_BOTH_FILES}`,
    checks: [
      {
        type: 'output-numeric',
        equals: FAILED_BOTH_FILES,
        hint: 'Concatenate both files first, then count once over the joined stream.',
      },
    ],
    debrief: `${FAILED_BOTH_FILES} across everything still on disk right now. Note carefully the ceiling on that claim, because it matters for exactly how you word a report: it is a count of everything RETAINED, not a count of everything that ever actually happened, and the gap between those two numbers is whatever rotation had already deleted before you ever ran a command.`,
    practice: [],
  },
  {
    id: 'logs.7.4',
    moduleId: '2.7',
    packageId: 'log-analysis',
    order: 4,
    title: 'Which files mention it at all',
    kind: 'terminal',
    goal: 'Find where evidence lives before reading any of it.',
    prompt: `Of the three files /var/log/auth.log, /var/log/auth.log.1 and /var/log/syslog, list which ones mention the account ${TOP_TARGET}. You want the filenames, not the lines.`,
    teach: {
      concept:
        'Early in an investigation the useful question is often not what the lines say, but which files are even worth opening in the first place. `grep -l` answers exactly that: instead of printing matching lines, it prints only the NAME of each file that contains at least one match, and then it stops reading that file entirely rather than continuing to scan for more matches it does not need, which keeps it fast even over a large set of files.\n\n' +
        'It is the natural first move whenever somebody hands you a single piece of information, an address, a username, a hostname, and no idea where in the logs it turns up.',
      syntax: 'grep -l PATTERN FILE...',
      examples: [
        {
          command: "grep -l 'nginx' /var/log/syslog /var/log/auth.log",
          explains: 'Says which of those two files mentions nginx at all, without printing a single log line.',
        },
      ],
      flags: [{ flag: '-l', means: 'Print the names of matching files instead of the matching lines.' }],
    },
    hints: [
      'List all three filenames as arguments after the pattern.',
      'The flag that switches grep from printing lines to printing filenames is -l.',
    ],
    solution: `grep -l '${TOP_TARGET}' /var/log/auth.log /var/log/auth.log.1 /var/log/syslog`,
    expectedOutput: 'Both auth logs, and not syslog.',
    checks: [
      {
        type: 'output-contains',
        text: '/var/log/auth.log.1',
        hint: 'The rotated file mentions the account too, so it should be in your list.',
      },
      {
        type: 'output-excludes',
        text: '/var/log/syslog',
        hint: 'syslog does not mention this account. If it appears, you printed all the filenames rather than only the matching ones.',
      },
    ],
    debrief:
      'Two files to read instead of three, established with one short command instead of opening each file by hand to check. On a real host with fifty different log files scattered across a dozen directories, that is the difference between spending a focused hour on the two that actually matter and wasting an entire day skimming forty-eight that do not.',
    practice: [],
  },
  {
    id: 'logs.7.5',
    moduleId: '2.7',
    packageId: 'log-analysis',
    order: 5,
    title: 'Search a whole directory tree',
    kind: 'terminal',
    goal: 'Sweep every log on the host for one indicator.',
    prompt: `Search everything under /var/log for the address ${SECOND_SOURCE}, showing which file each hit came from, and count the hits per file rather than printing them.`,
    teach: {
      concept:
        'When you are handed an indicator and asked whether it has been seen anywhere at all on this host, you want a sweep across every log file at once rather than a list of files to check by hand one at a time. `grep -r` walks a directory and every directory underneath it (RECURSE means "go into subdirectories, and their subdirectories, and so on"), searching every file it finds, and prefixing each result with the file it came from, exactly the way searching multiple named files did back in module 2.4.\n\n' +
        'Combined with `-c` it gives you a per-file tally instead of a wall of matching lines, which is the most useful first output for this kind of question: it tells you at a glance which log has the most to say about the indicator, and therefore which one is worth opening first.',
      syntax: 'grep -rc PATTERN DIRECTORY',
      examples: [
        {
          command: "grep -rl 'svc-backup' /var/log",
          explains: 'Sweeps every log for a service account and lists only the filenames that mention it.',
        },
      ],
      flags: [{ flag: '-r', means: 'Recurse into a directory, searching every file underneath it.' }],
    },
    hints: [
      'Two flags on one grep: recurse, and count.',
      'Point it at the directory /var/log rather than at any individual file.',
    ],
    solution: `grep -rc '${SECOND_SOURCE}' /var/log`,
    expectedOutput: `Per-file counts, with ${SECOND_SOURCE_IN_AUTH} in auth.log and ${SECOND_SOURCE_IN_WEB} in the nginx access log.`,
    checks: [
      {
        type: 'output-contains',
        text: `/var/log/auth.log:${SECOND_SOURCE_IN_AUTH}`,
        hint: 'The auth log should report its count next to its own filename.',
      },
      {
        type: 'output-contains',
        text: '/var/log/nginx/access.log',
        hint: 'The sweep should reach into subdirectories, so the nginx log needs to appear too.',
      },
    ],
    debrief: `That address is in the auth log ${SECOND_SOURCE_IN_AUTH} times and in the WEB log as well, two entirely separate services on the same machine. The same source touching two different services is a much stronger signal than either count on its own, because coincidence gets harder to believe every additional place the same address turns up, and you would not have found this second appearance at all without sweeping the whole directory instead of checking one file at a time.`,
    practice: [],
  },
];

// --- Module 2.8: Web server logs ---------------------------------------------

const MODULE_2_8: Exercise[] = [
  {
    id: 'logs.8.1',
    moduleId: '2.8',
    packageId: 'log-analysis',
    order: 1,
    title: 'A different format, the same skills',
    kind: 'terminal',
    goal: 'Read the combined log format and find the field you need by counting from the left.',
    prompt:
      'Print the whole nginx access log, /var/log/nginx/access.log, and read its shape before you filter anything.',
    teach: {
      concept:
        'Everything up to this point has been a syslog-format line written by the operating system itself. nginx is different: it is the web server software running on this host, the program that answers every request a browser (or a scanner) makes for a page, and it does not write syslog format at all. It writes its own well-known layout called the COMBINED LOG FORMAT, which almost every web server on the internet uses, precisely so that tools built to read one web server\'s logs work on any other\'s.\n\n' +
        'A line in that format goes, left to right: the client\'s address, two placeholder fields that are rarely used and usually just show a dash, the timestamp in square brackets, the REQUEST in double quotes (what the client actually asked for), the response STATUS CODE (a number the server sends back describing what happened, such as 200 for success or 404 for "nothing here"), the number of bytes sent back, the referrer, and finally the user agent, a string identifying what browser or tool made the request.\n\n' +
        'Nothing you have learned about grep, cut, or pipes stops working against this new shape, but WHERE each piece of information sits changes completely, and that is the whole adjustment you need to make. The address is field one instead of being buried mid-line the way it was in auth.log. The status code is field nine. The request sits inside the first pair of double quotes rather than being a plain space-separated field at all. Read one line carefully and count the fields by hand before you write a single command against a format you have not worked with before: five minutes spent counting saves an hour of a command silently returning the wrong column.',
      syntax: 'cat FILE',
      examples: [
        {
          command: 'head -n 2 /var/log/nginx/error.log',
          explains: 'The error log alongside it, which uses a different layout again: even one server writes several formats.',
        },
      ],
    },
    hints: [
      'The file is small enough to print whole.',
      'As you read it, count the space-separated fields on one line and find where the status code sits.',
    ],
    solution: 'cat /var/log/nginx/access.log',
    expectedOutput: `All ${NGINX_TOTAL} requests, including several that were not for anything real.`,
    checks: [
      {
        type: 'output-contains',
        text: '/wp-login.php',
        hint: 'Print the whole file. One of the requests is for WordPress, on a server that does not run WordPress.',
      },
      {
        type: 'output-line-count',
        count: NGINX_TOTAL,
        hint: `The file has ${NGINX_TOTAL} request lines. Print all of them.`,
      },
    ],
    debrief:
      'Two of those requests are for /wp-login.php (the login page for WordPress, a content management system) and /.env (a file where applications commonly store database passwords and API keys), on a host that runs neither WordPress nor an application that would expose a file like that. Nobody stumbles onto exactly those two paths by accident: they are two of the most commonly probed paths on the entire internet, and requesting them is somebody methodically checking whether you left something lying around that a default, out-of-the-box install would have.',
    practice: [],
  },
  {
    id: 'logs.8.2',
    moduleId: '2.8',
    packageId: 'log-analysis',
    order: 2,
    title: 'Rank the response codes',
    kind: 'terminal',
    goal: 'Cut a field out by position and rank it.',
    prompt:
      'Extract the HTTP status code from every line of the access log, rank the codes by how often they occur, and show the commonest.',
    teach: {
      concept:
        'When a format is reliably delimited the same way on every single line, the way combined log format is, you do not need a search pattern at all, you need a field number. `cut -d \' \' -f 9` splits each line on spaces and hands you the ninth piece, which in this format is always the response status code, regardless of what request or address happened to be on that particular line.\n\n' +
        'Status codes are the fastest triage signal a web log offers, because the server itself is telling you, in one short number, how each request ended. A wall of 404s ("not found") aimed at one source is somebody methodically enumerating paths that do not exist, hoping to stumble on one that does. A single 200 ("success") on a path that should never have been reachable by anyone is a much worse day, because it means whatever they were probing for, they actually got. Ranking the codes first, before reading a single full line, tells you which of those two very different conversations you are about to have.',
      syntax: 'cut -d DELIMITER -f FIELD FILE',
      examples: [
        {
          command: "cut -d' ' -f1 /var/log/nginx/access.log | sort -u",
          explains: 'Takes the first field instead, giving the distinct client addresses that made requests.',
        },
      ],
      flags: [
        { flag: '-d', means: 'The delimiter to split each line on.' },
        { flag: '-f', means: 'Which field or fields to keep, counting from one.' },
      ],
    },
    hints: [
      'Count the space-separated fields on a line: address, two dashes, two timestamp pieces, three request pieces, then the status.',
      'Once you have one status per line, it is the sort, uniq -c, sort -rn ranking again.',
    ],
    solution: "cut -d' ' -f9 /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -n 1",
    expectedOutput: `404, with ${NGINX_404} of the ${NGINX_TOTAL} requests.`,
    checks: [
      {
        type: 'output-contains',
        text: '404',
        hint: 'The commonest status on this host is the not-found code.',
      },
      {
        type: 'output-contains',
        text: String(NGINX_404),
        hint: 'Include the count alongside the code.',
      },
    ],
    debrief: `More requests failed than succeeded, on what is supposed to be a production web server. On a real site serving real visitors that ratio is normally inverted, the overwhelming majority of requests succeed, because people mostly click links that exist. An inverted ratio like this one on an otherwise quiet host almost always means the traffic driving it is not coming from ordinary users clicking around, but from something automated trying paths that were never going to work.`,
    practice: [],
  },
  {
    id: 'logs.8.3',
    moduleId: '2.8',
    packageId: 'log-analysis',
    order: 3,
    title: 'Who was probing',
    kind: 'terminal',
    goal: 'Pivot from a suspicious response code to the addresses behind it.',
    prompt:
      'List the distinct client addresses that received a 404, one per line.',
    teach: {
      concept:
        'This is the pivot that makes a web log genuinely worth reading, rather than just a curiosity: find the response you care about first, then extract the field that identifies who caused it. Filter first, cut second, the same order you have been using throughout this package.\n\n' +
        'Be careful about how you match the status, though. A bare `404` also matches a byte count that happens to equal 404, or any path that happens to contain those three digits somewhere in it, which is why the pattern is written with a literal space on either side of the number: that pins the digits to their own isolated field, the way a labelled field pinned a value earlier in this package. Sloppy matching against a numeric value like this is the exact same class of mistake as the over-broad exclusion you saw in module 2.6, and it fails in exactly the same silent way: the command runs, returns a number, and gives you no hint that the number is wrong.',
      syntax: "grep ' CODE ' FILE | cut -d' ' -f1 | sort -u",
      examples: [
        {
          command: "grep ' 200 ' /var/log/nginx/access.log | cut -d' ' -f1 | sort -u",
          explains: 'The addresses whose requests actually succeeded, which is the useful comparison set.',
        },
      ],
    },
    hints: [
      'Filter the lines down to the ones with that status, then cut the first field.',
      'Put spaces either side of the code in your pattern so it cannot match a byte count.',
      'sort -u collapses the list to one line per address.',
    ],
    solution: "grep ' 404 ' /var/log/nginx/access.log | cut -d' ' -f1 | sort -u",
    expectedOutput: `${NGINX_404_SOURCES.size} distinct addresses.`,
    checks: [
      {
        type: 'output-line-count',
        count: NGINX_404_SOURCES.size,
        hint: 'One line per distinct address. If you have more, you have not removed duplicates.',
      },
      {
        type: 'output-contains',
        text: [...NGINX_404_SOURCES][0]!,
        hint: 'The addresses that got a 404 should each appear once.',
      },
    ],
    debrief:
      'Three different sources, each probing for something that is not there on this particular host. Individually, any one of them is forgettable, indistinguishable from ordinary internet noise. As a set, it is simply the background radiation every public server sits in permanently, and a large part of the job is knowing which of it to ignore so you have attention left for the one request that actually gets a 200 it should not have.',
    practice: [],
  },
  {
    id: 'logs.8.4',
    moduleId: '2.8',
    packageId: 'log-analysis',
    order: 4,
    title: 'Cut on something other than a space',
    kind: 'terminal',
    goal: 'Choose a delimiter that suits the field you want.',
    prompt:
      'Extract the request line from every entry in the access log, using the double quotes around it as the delimiter.',
    teach: {
      concept:
        'The request field in a combined log line, something like "GET /wp-login.php HTTP/1.1", itself contains spaces (between the method, the path, and the protocol version), so splitting the whole line on spaces the way you have been doing breaks that one field apart into three separate pieces instead of keeping it together. But the request is wrapped in a pair of double quotes, and nothing else anywhere on the line is, which makes the quote character a far better delimiter than the space for this particular job.\n\n' +
        'That is the general lesson worth carrying forward: the right delimiter for `cut` is whatever character reliably separates the ONE field you actually want, not whatever character happens to separate most of the other fields on the line. Splitting on `"` puts the request cleanly in field two, everything between the first and second quote. Picking your delimiter deliberately like this is usually the difference between one clean command and a chain of three trying to patch up each other\'s mistakes.',
      syntax: "cut -d'\"' -f2 FILE",
      examples: [
        {
          command: "cut -d':' -f1 /etc/passwd",
          explains: 'The same idea on a colon-separated file: field one of /etc/passwd is the username.',
        },
      ],
    },
    hints: [
      'The delimiter is the double quote character, which needs quoting itself so the shell does not eat it.',
      'Between the first and second double quote is field two.',
    ],
    solution: `cut -d'"' -f2 /var/log/nginx/access.log`,
    expectedOutput: `${NGINX_REQUEST_PATHS.size} request lines, method and path together.`,
    checks: [
      {
        type: 'output-contains',
        text: 'GET /.env',
        hint: 'Each line should be a request like GET /path HTTP/1.1, with no address or status around it.',
      },
      {
        type: 'output-excludes',
        text: 'Mozilla',
        hint: 'If the user agent is still showing, you took the wrong field: the agent is inside a later pair of quotes.',
      },
    ],
    debrief:
      'A request for /.env is an attempt to read the file where applications commonly keep their database passwords and API keys in plain text. It got a 404 here, meaning the file was not there to be found. It is worth remembering what that specific request means the next time you see it in a log, because a 404 against it is a near miss, and a 200 against it means the file existed and the requester now has it.',
    practice: [],
  },
  {
    id: 'logs.8.5',
    moduleId: '2.8',
    packageId: 'log-analysis',
    order: 5,
    title: 'The same address in two services',
    kind: 'terminal',
    goal: 'Correlate a web-log source against the authentication log.',
    prompt: `Count how many times ${SECOND_SOURCE}, which appears in the web log, also appears in /var/log/auth.log.`,
    teach: {
      concept:
        'A single address showing up once in a web log is close to meaningless on its own: the internet scans every public web server constantly, all day, from thousands of unrelated addresses, so one hit proves almost nothing by itself. The same address turning up in a SECOND, completely unrelated service on the same host, the web server AND the SSH authentication log, is a different matter entirely, because coincidence stops being a believable explanation once the same source is touching two independent things.\n\n' +
        'Correlation like this is the core move of an entire investigation, and it needs no new commands at all, only the discipline to take an indicator you found in one place and go looking for it, deliberately, in another. What you are testing with a search like this is a single, sharp question: did one actor touch two things, or did you just imagine a connection between two unrelated events?',
      syntax: 'grep -c INDICATOR OTHER-FILE',
      examples: [
        {
          command: "grep -c '10.20.4.31' /var/log/auth.log",
          explains: 'The same correlation for an internal address from the web log, which is the control case.',
        },
      ],
    },
    hints: [
      'You already know the count command. The only new thing is which file you point it at.',
      'The address came from the web log. Go and count it in the auth log.',
    ],
    solution: `grep -c '${SECOND_SOURCE}' /var/log/auth.log`,
    expectedOutput: `${SECOND_SOURCE_IN_AUTH}`,
    checks: [
      {
        type: 'output-numeric',
        equals: SECOND_SOURCE_IN_AUTH,
        hint: 'Count that address in the authentication log.',
      },
    ],
    debrief: `${SECOND_SOURCE_IN_WEB} request to the web server and ${SECOND_SOURCE_IN_AUTH} lines in the authentication log, both from one single address. A source that only ever touched the web server could plausibly be a stray scanner passing through. One that touched two separate services on purpose did not wander in by accident. Go back to what it was doing in auth.log, because that is now the single most interesting thing happening on this host.`,
    practice: [],
  },
];

// --- Module 2.9: What happened after they got in -----------------------------

const MODULE_2_9: Exercise[] = [
  {
    id: 'logs.9.1',
    moduleId: '2.9',
    packageId: 'log-analysis',
    order: 1,
    title: 'Did any of it work',
    kind: 'terminal',
    goal: 'Ask the only question that changes the severity of a brute-force finding.',
    prompt: `You have spent this package counting failures from ${SECOND_SOURCE}. Show every SUCCESSFUL login from that address.`,
    teach: {
      concept:
        'Failed logins on their own are a nuisance report: noise you note and move past. A successful login from that exact same source that had just spent all day failing is an incident, full stop, and the only thing standing between those two very different conclusions is one extra command that most people never bother to run, because the failure count in front of them is so absorbing it feels like the whole story.\n\n' +
        'Make this the reflex for the rest of your career: whenever you finish counting failures from a source, immediately go and check for successes from that same source. The answer is usually none, which is genuinely worth knowing and costs you about ten seconds to confirm. When it is not none, everything about the rest of your day changes.',
      syntax: 'grep SUCCESS-PATTERN FILE | grep SOURCE',
      examples: [
        {
          command: "grep 'Accepted' /var/log/auth.log | grep '10.20.9.15'",
          explains: 'The same question asked about the backup server, which is the boring and expected answer.',
        },
      ],
    },
    hints: [
      'sshd writes "Accepted" when a login works, whatever the method was.',
      'Two greps: successes, then narrow to that address. Print the lines, do not count them.',
    ],
    solution: `grep 'Accepted' /var/log/auth.log | grep '${SECOND_SOURCE}'`,
    expectedOutput: `${ACCEPTED_FROM_SECOND} successful logins from that address.`,
    checks: [
      {
        type: 'output-contains',
        text: 'Accepted',
        hint: 'You are looking for lines sshd wrote when a login succeeded.',
      },
      {
        type: 'output-line-count',
        count: ACCEPTED_FROM_SECOND,
        hint: `There are ${ACCEPTED_FROM_SECOND} of them. If you have none, check the address; if you have hundreds, you are still looking at failures.`,
      },
    ],
    debrief:
      'Two of them. One login with a password, one with a key, both from the address you had spent this whole package half-writing off as background noise. Read the account names on those two lines carefully, because they are not the same account, and the fact that two different accounts were reached from one external source in one day is itself a detail worth sitting with before you move on.',
    practice: [],
  },
  {
    id: 'logs.9.2',
    moduleId: '2.9',
    packageId: 'log-analysis',
    order: 2,
    title: 'Prove that something did not happen',
    kind: 'terminal',
    goal: 'Produce a defensible negative result, which is a real finding and not an absence of one.',
    prompt: `${NEVER_SUCCEEDED} also appears in the failure list. Show, as a number, how many successful logins came from it.`,
    teach: {
      concept:
        'Half of what you report is that something did NOT happen, and a negative result needs to be produced just as carefully as a positive one. "I did not see anything" is not a finding, it is a shrug. "No successful authentication from that address appears in the retained logs" is a finding, because it names exactly what was searched, what it was searched for, and by implication, what was NOT covered by the search.\n\n' +
        'A count of zero is the right shape for an answer like this. It is unambiguous, it is reproducible by anyone who reads your report and reruns the command, and producing it forces you to say precisely which file you looked in. State the bound alongside it too: you searched the RETAINED logs, and rotation has already permanently deleted whatever came before those, so "zero" describes what you can prove, not necessarily everything that ever happened.',
      syntax: 'grep SUCCESS-PATTERN FILE | grep -c SOURCE',
      examples: [
        {
          command: "grep 'COMMAND=' /var/log/auth.log | grep -c 'rm -rf'",
          explains: 'Checks whether anybody ran a destructive delete through sudo. Zero is the answer you want, and you should still run it.',
        },
      ],
    },
    hints: [
      'Same shape as the previous exercise, with -c on the second grep.',
      'A count of zero is a valid, useful answer here. Do not assume you got the command wrong.',
    ],
    solution: `grep 'Accepted' /var/log/auth.log | grep -c '${NEVER_SUCCEEDED}'`,
    expectedOutput: '0',
    checks: [
      {
        type: 'output-numeric',
        equals: 0,
        hint: 'Count successful logins from that address. Zero is the correct answer, and the command still has to be right to prove it.',
      },
    ],
    debrief:
      'That address tried repeatedly and never once got in, and you can now say so precisely, with a command anybody can rerun to check you. Note a quirk worth remembering: grep signals failure (technically, exit status 1) whenever it matches nothing at all, even though finding nothing was the correct and expected answer here. That is why an automated script chaining commands together on success can stop dead the moment it hits a perfectly good negative result, mistaking "found nothing" for "something went wrong".',
    practice: [],
  },
  {
    id: 'logs.9.3',
    moduleId: '2.9',
    packageId: 'log-analysis',
    order: 3,
    title: 'Everything that was run as root',
    kind: 'terminal',
    goal: 'Read the record of privilege being used, which is where intent becomes visible.',
    prompt:
      'Print every line in auth.log that records a command run through sudo.',
    teach: {
      concept:
        'Getting in is not the objective, it is only the prerequisite. What somebody does with the access afterward is the actual incident, and on a Linux host most of that leaves a direct record in one place: sudo, the command that lets an approved account temporarily run something as root, logs the account that ran it, the terminal it ran from, the working directory it ran in, and the exact command line, every single time it is used.\n\n' +
        'The string `COMMAND=` appears on precisely those lines and nowhere else. It is typically a short list on any healthy host, short enough to read in full rather than sample, and it is the first thing worth pulling once you believe an account has been compromised. Read all of it, including the entries that are obviously routine, because knowing what normal sudo usage looks like on this host is exactly what makes the abnormal entry stand out against it.',
      syntax: 'grep PATTERN FILE',
      examples: [
        {
          command: "grep 'session opened' /var/log/auth.log | tail -n 5",
          explains: 'The other half of the picture: who had a session, rather than what they ran inside it.',
        },
      ],
    },
    hints: [
      'Every one of those lines contains the literal text COMMAND= and no other line does.',
      'Print the lines rather than counting them. There are few enough to read.',
    ],
    solution: "grep 'COMMAND=' /var/log/auth.log",
    expectedOutput: `${SUDO_COMMANDS} sudo commands, covering the whole day.`,
    checks: [
      {
        type: 'output-line-count',
        count: SUDO_COMMANDS,
        hint: `There are ${SUDO_COMMANDS} such lines in the file.`,
      },
      {
        type: 'output-contains',
        text: 'useradd',
        hint: 'One of those commands creates an account. It should be in your output.',
      },
    ],
    debrief:
      'Read those five lines in order, because order is doing real work here. Two of them are routine administration, the kind of sudo usage you would expect on any given day. Three of them are one account creating a second account, giving that new account sudo privileges of its own, and then that new account archiving a directory full of exports. That is the whole intrusion, laid out in three lines, inside a file you have had open in front of you since module 2.2.',
    practice: [],
  },
  {
    id: 'logs.9.4',
    moduleId: '2.9',
    packageId: 'log-analysis',
    order: 4,
    title: 'Follow the account that was created',
    kind: 'terminal',
    goal: 'Pivot from an artefact to the account, and gather everything about it.',
    prompt:
      'The sudo log shows an account named sysmon being created. Show every non-failure line in auth.log that mentions sysmon.',
    teach: {
      concept:
        'Once you have a name, the next move is always the same: collect everything about it in one place, in time order, before you interpret any of it. Accounts, addresses, process ids, and filenames are all PIVOTS, things you jump to and search for in their own right once one investigation surfaces them, and the discipline is to gather first and only start drawing conclusions second.\n\n' +
        'Filtering the failures out matters here specifically. An account name that also happens to appear in hundreds of unrelated brute-force attempts against it would bury its own real activity under noise, and what you actually want is the small handful of lines where something genuinely happened: the session opening, what it ran once inside, and the session closing again.',
      syntax: 'grep NAME FILE | grep -v NOISE',
      examples: [
        {
          command: "grep 'svc-backup' /var/log/auth.log | grep -v 'Failed'",
          explains: 'The same gathering step for the backup service account, which is what a legitimate one looks like.',
        },
      ],
    },
    hints: [
      'Gather on the account name first, then remove the failure lines with -v.',
      'Print the lines. There are few enough that reading them in order is the point.',
    ],
    solution: "grep 'sysmon' /var/log/auth.log | grep -v 'Failed'",
    expectedOutput: 'The creation, the key-based login, the sudo command, and the session closing.',
    checks: [
      {
        type: 'output-contains',
        text: 'Accepted publickey',
        hint: 'The account logged in with a key. That line should be in your output.',
      },
      {
        type: 'output-contains',
        text: 'tar',
        hint: 'The account also ran an archiving command through sudo. Keep that line.',
      },
      {
        type: 'output-excludes',
        text: 'Failed password',
        hint: 'Filter the brute-force noise out, or the few lines that matter are buried.',
      },
    ],
    debrief:
      'An account created at 10:22, given sudo at 10:31, logging in with a cryptographic key at 11:05 from the same address that had spent the whole morning failing password attempts against other accounts, and archiving the exports directory a single minute later. Read that sequence end to end and there is no legitimate administrative task it describes: nobody sets up an account and immediately uses it to package up data and walk away.',
    practice: [],
  },
  {
    id: 'logs.9.5',
    moduleId: '2.9',
    packageId: 'log-analysis',
    order: 5,
    title: 'Where the archive was written',
    kind: 'terminal',
    goal: 'Extract the artefact path from the command line that created it.',
    prompt:
      'From the sudo lines, extract just the path of the archive file that was created under /tmp.',
    teach: {
      concept:
        'A command line captured in a log is not only evidence of what already happened, it is also a set of leads for what to do next. A filename inside it is something you can go and physically look for on disk, and whether it is still there tells you how far along the attacker got, and how much time you realistically have to respond before it moves further.\n\n' +
        'Extracting the path with a command, rather than just reading it off the screen and retyping it, is worth the extra keystrokes for two reasons: the same extraction command scales unchanged to a thousand sudo lines instead of five, and the extracted text is copy-pasteable straight into your next command without the risk of a transcription mistake turning one character of a filename into the wrong one.',
      syntax: "grep PATTERN FILE | grep -oE 'PATH-PATTERN'",
      examples: [
        {
          command: "grep 'COMMAND=' /var/log/auth.log | grep -oE '/usr/[a-z/]+'",
          explains: 'Pulls the binary being run out of each sudo line instead of the file it operated on.',
        },
      ],
    },
    hints: [
      'Narrow to the sudo lines first, then extract only the part that starts with /tmp.',
      'A pattern of /tmp/ followed by non-space characters will do it.',
      'grep -o prints only the matching part, which is what turns a log line into a path.',
    ],
    solution: `grep 'COMMAND=' /var/log/auth.log | grep -oE '/tmp/[^ ]+'`,
    expectedOutput: '/tmp/.cache/pt.tar.gz',
    checks: [
      {
        type: 'output-contains',
        text: '/tmp/.cache/pt.tar.gz',
        hint: 'The archive path should come out on its own, with no surrounding log line.',
      },
      {
        type: 'output-excludes',
        text: 'COMMAND=',
        hint: 'If the whole line is still showing, you have not used -o to keep only the match.',
      },
    ],
    debrief:
      'A dot at the front of .cache hides it from a plain ls (files beginning with a dot are treated as hidden on Linux, and only show up if you specifically ask to see them), and /tmp is a directory every account on the machine is allowed to write into and that most administrators routinely ignore, which is exactly why both were chosen. Go and look for that file the next time you have a terminal on this host: whether it is still sitting there is the difference between an archive that was staged and never collected, and one that is already gone.',
    practice: [],
  },
  {
    id: 'logs.9.6',
    moduleId: '2.9',
    packageId: 'log-analysis',
    order: 6,
    title: 'Count it twice before you report it',
    kind: 'terminal',
    goal: 'Verify a number by a second, independent route.',
    prompt: `Your report will say that ${SECOND_SOURCE} appears ${SECOND_SOURCE_IN_AUTH} times in auth.log. Confirm that figure using a DIFFERENT command from the one that produced it, by piping the matching lines into a line count.`,
    teach: {
      concept:
        'Before a number goes in front of anybody, get to it twice, by two genuinely different routes. `grep -c` counts matches internally and reports one figure; `grep | wc -l` lets grep print the matching lines as normal and counts whatever text arrives downstream. The two SHOULD always agree, and when they do not, the disagreement itself is informative: it can mean a pattern matching twice within a single line, a file missing its trailing newline, or a stray filename argument quietly turning on per-file output instead of a single combined count.\n\n' +
        'This costs a few extra seconds and it is the single habit that keeps you credible over time. The number in a report is the part people remember and the part somebody, eventually, will check.',
      syntax: 'grep PATTERN FILE | wc -l',
      examples: [
        {
          command: "grep 'Accepted' /var/log/auth.log | wc -l",
          explains: 'The line-counting route to a figure you produced earlier with grep -c, for comparison.',
        },
      ],
    },
    hints: [
      'Do not use -c this time. Let grep print the lines and count them downstream.',
      'wc -l counts the lines arriving on its input.',
    ],
    solution: `grep '${SECOND_SOURCE}' /var/log/auth.log | wc -l`,
    expectedOutput: `${SECOND_SOURCE_IN_AUTH}, agreeing with the earlier count.`,
    checks: [
      {
        type: 'output-numeric',
        equals: SECOND_SOURCE_IN_AUTH,
        hint: 'Pipe the matching lines into wc -l rather than asking grep to count them.',
      },
      {
        type: 'command-uses-pipe',
        hint: 'The whole point is to reach the number by a different route, which means a pipe rather than -c.',
      },
    ],
    debrief: `Both routes give ${SECOND_SOURCE_IN_AUTH}, in agreement. You now have a source that brute-forced the host, got in, created an account, escalated that account to root, and staged an archive of the exports directory, and every single step of that chain is a number or a line you can reproduce on demand, by more than one command if asked. That, not the raw failure count you started this package with, is what a finding actually looks like.`,
    practice: [],
  },
];

// --- the package -------------------------------------------------------------

export const LOG_ANALYSIS: LearningPackage = {
  id: 'log-analysis',
  order: 2,
  title: 'Log Analysis and Parsing',
  summary:
    'Read the logs a real server produces, filter thousands of lines down to the few that matter, and pull structured facts out of unstructured text.',
  outcomes: [
    'Read any syslog-format line and know which field to filter on',
    'Scope an investigation to a time window, an account, or a service',
    'Tell routine noise apart from events that deserve attention',
    'Extract addresses and field values out of log text and reduce them to distinct lists',
    'Corroborate an event across two independent log sources',
    'Rank a field by frequency, and tell volume apart from breadth',
    'Filter out what is already explained without silently removing evidence',
    'Search across rotated generations, and state what a search did not cover',
    'Read a web server log, and correlate one source across two services',
    'Produce a defensible negative result, and verify a figure by a second route',
  ],
  prerequisites: ['linux-fundamentals'],
  modules: [
    {
      id: '2.1',
      packageId: 'log-analysis',
      order: 1,
      title: 'Reading log formats',
      summary: 'Learn the shape of a log line, and filter on its fields.',
      exercises: MODULE_2_1,
    },
    {
      id: '2.2',
      packageId: 'log-analysis',
      order: 2,
      title: 'Authentication logs',
      summary: 'Who tried to get in, who succeeded, and which of those matters.',
      exercises: MODULE_2_2,
    },
    {
      id: '2.3',
      packageId: 'log-analysis',
      order: 3,
      title: 'System logs',
      summary: 'Everything the machine says when it is not talking about logins.',
      exercises: MODULE_2_3,
    },
    {
      id: '2.4',
      packageId: 'log-analysis',
      order: 4,
      title: 'Parsing and extraction',
      summary: 'Turn log text into lists of facts you can count and compare.',
      exercises: MODULE_2_4,
    },
    {
      id: '2.5',
      packageId: 'log-analysis',
      order: 5,
      title: 'Counting and ranking',
      summary:
        'Turn matching lines into a ranked list, separate volume from breadth, and find the hour worth reading.',
      exercises: MODULE_2_5,
    },
    {
      id: '2.6',
      packageId: 'log-analysis',
      order: 6,
      title: 'Filtering out the noise',
      summary:
        'Remove what is already explained without removing evidence, and rank what survives.',
      exercises: MODULE_2_6,
    },
    {
      id: '2.7',
      packageId: 'log-analysis',
      order: 7,
      title: 'Logs that have been rotated',
      summary:
        'Yesterday lives in another file. Search across generations, and know what your search did not cover.',
      exercises: MODULE_2_7,
    },
    {
      id: '2.8',
      packageId: 'log-analysis',
      order: 8,
      title: 'Web server logs',
      summary:
        'A different format with the same skills: fields by position, status codes, and correlating a source across two services.',
      exercises: MODULE_2_8,
    },
    {
      id: '2.9',
      packageId: 'log-analysis',
      order: 9,
      title: 'What happened after they got in',
      summary:
        'Successes, defensible negatives, the record of privilege being used, and verifying a number before you report it.',
      exercises: MODULE_2_9,
    },
  ],
};
