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
        'Almost every Linux log file uses the same layout, called syslog format. Once you can see the four fields, a wall of text turns into a table. Left to right: WHEN it happened, WHICH machine it happened on, WHAT program reported it (with its process id in brackets), and finally the message itself. Everything you do in this package is filtering on one of those four fields.',
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
      'Those four fields are your filters. "Which machine" matters when you are reading logs shipped from a hundred hosts into one place, and "which program" is how you separate an SSH problem from a database problem in the same file.',
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
        'A log line is a row; the spaces between words make it a set of columns. `cut` splits each line on a delimiter and keeps the fields you name. In syslog format the timestamp is spread across the first three fields ("Aug", "15", "00:00:29"), which is why you ask for fields 1 through 3 rather than just field 1.',
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
      'Field extraction is how log lines become data you can count. Strip everything except the field you care about, and the next tool in the pipe can sort it, tally it, or find the duplicates.',
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
        'Because the timestamp sits at the front of every line, you can filter by time with plain text matching, no special date tooling required. Searching for "Aug 15 10:" matches 10:00:00 through 10:59:59, because every one of those timestamps literally begins with that text. Scoping to a window is usually the first move in an investigation: an alert gives you a time, and you go read what the machine was saying around it.',
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
      'You just scoped an investigation to a one-hour window. Look at what is in there: an accepted login, a sudo command, and a new account being created. That sequence is the whole reason this package exists.',
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
        'When sshd rejects a password it writes a line containing "Failed password". Counting those lines is the single most common thing anyone does with an auth log. You can get the count two ways: grep can count matches itself with -c, or you can pipe the matching lines into `wc -l`. Both are correct and both are used in the wild.',
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
      `${FAILED_PASSWORD} failed logins in one day sounds like a siren. Hold that thought: the next exercise shows why the raw number is nearly meaningless on its own. Analysts who page people over a count like this stop being trusted quickly.`,
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
        'One grep narrows; two greps in a pipe narrow twice. The first finds every failure, the second keeps only the failures mentioning the account you care about. This is how you go from "something is happening" to "something is happening to this specific thing", which is the difference between an observation and a finding.',
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
      'Look closely at what these lines say: "Failed password for invalid user admin". Invalid user means no such account exists on this box. Someone is guessing account names that were never here, that is an untargeted scanner working through a wordlist, not somebody who knows you.',
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
        'Failures are loud and usually meaningless; successes are quiet and always matter. When sshd lets someone in it writes "Accepted", followed by the method (password or publickey), the account, and the source address. On a busy internet-facing host there may be thousands of failures and a handful of successes, and the handful is where you look.',
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
      `Read the source addresses. Seven of these come from 10.20.x.x: the internal office network. Two come from 203.0.113.55, an address outside the company entirely, for accounts called testuser and sysmon. ${FAILED_PASSWORD} failures told you nothing. These ${ACCEPTED} lines just told you everything.`,
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
        'root can do anything on the machine, so it gets special attention. Searching for it in the auth log turns up both failed attempts against it and legitimate privilege escalation by other accounts. Grepping a common word can return hundreds of lines, so pipe the result into `head` to cap what reaches your screen: you keep control of the terminal and still see whether the pattern is worth pursuing.',
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
      'Two very different things show up under one search: strangers failing to log in AS root, and staff legitimately escalating TO root with sudo. Same word, opposite meanings. Reading the message field rather than pattern-matching the account name is what separates the two.',
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
        'auth.log is about who did what. syslog is about everything else the machine has to say: services starting, disks filling, hardware complaining. Different programs write "error", "Error", and "ERROR" with no coordination whatsoever, so a case-sensitive search silently misses most of them. The -i flag makes grep ignore case, and on real logs it is closer to a default than an option.',
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
      'These are genuine faults (the portal cannot reach the lab interface) and they have nothing to do with the intrusion. Most errors in most logs are like this: real problems for somebody, just not security problems. Learning to set them aside without ignoring them is a large part of the job.',
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
        'Sometimes one question needs two words. An extended regular expression lets you write alternatives separated by a pipe INSIDE the pattern: "cat|dog" matches a line containing either. This needs the -E flag, because without it grep treats the pipe as a literal character and searches for the text "cat|dog". Note that the pipe inside quotes means "or", while a pipe outside quotes joins two commands: same symbol, completely different jobs.',
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
      'The source specification for this course searched for lowercase "started|stopped" and would have found one line out of four. That is the most common way a log search lies to you: it returns results, so it looks like it worked. Always sanity-check a count against what you expect to be there.',
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
        'Log files are append-only: the newest entry is the last line. When you are asked "what is happening right now", you want the end of the file, not the whole thing. Piping `tail` into `grep` searches only that recent slice. Order matters here (tail first, then grep) because you are choosing a time window and then filtering inside it. Reversing them would filter the whole file and then take the last 50 matches, which answers a different question.',
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
      'Both hits are UFW BLOCK entries: the firewall dropping connection attempts to ports 445 and 3389 from outside. That is the internet knocking on every door it can find, all day, on every public host. It is background radiation, not an incident.',
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
        'So far grep has returned whole lines. With -o it returns only the part that matched, which turns grep into an extraction tool. Describe an IP address as a pattern (four groups of one to three digits separated by dots) and grep will pull out every one it sees. Feed the result into `sort -u` and thousands of lines collapse into the handful of distinct addresses that produced them.',
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
      `Two thousand-odd lines reduced to ${SSHD_UNIQUE_IPS.size} addresses you can actually look at. Five are internal 10.20.x.x hosts. The rest are external, and one of them: 203.0.113.55: is the address behind both of those successful logins you found earlier.`,
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
        'Many log formats label their fields, as in `user=root` or `rhost=10.20.9.40`. To grab the value without the label, use a Perl-style pattern with \\K, which means "forget everything matched so far and start the match here". So `user=\\K[^ ]*` finds the text `user=`, discards it, and keeps the run of non-space characters after it. This is the standard one-liner for pulling a labelled field out of a log.',
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
      'These are accounts that actually exist on this host, so each failure was a real guess against a real account. testuser is on the list, and testuser is one of the two accounts that later succeeded. Someone guessed until they got in.',
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
        'A timeline is the backbone of every incident report, and log files hand it to you for free: entries are appended as things happen, so the file is already in chronological order. You do not need to sort it: sorting by text would actually break it, because "Aug 9" sorts after "Aug 15" alphabetically. Filter to the events you care about and read top to bottom.',
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
      'Notice that the earliest entries are all the same account failing from the same internal address, every five minutes, all night. That is a monitoring box with a stale password: a misconfiguration that generates more failures than the actual attacker did. Volume is not evidence.',
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
        'Give grep more than one file and it searches all of them, prefixing each result with the filename it came from. That prefix is the point: it lets you confirm an event in a second, independently written log. A single log line is a claim. The same event recorded by two different subsystems is evidence, and if an attacker tampered with one file, the mismatch is itself a finding.',
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
      'Two independent subsystems recorded the same moment: sshd wrote "Accepted password for testuser from 203.0.113.55" at 10:14:22, and systemd-logind wrote "New session 4821 of user testuser" one second later. That agreement is what turns a suspicion into something you can put in a report, and it is where Alert Triage picks up.',
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
        'Four commands chained together answer most log questions you will ever be asked, and they always go in the same order: isolate the lines, extract the one field you care about, sort so identical values sit together, then count them.\n\nThe reason sort comes before uniq is that uniq only collapses ADJACENT duplicates. Unsorted input makes it do nothing at all, silently. The second sort, with -rn, then orders those counts numerically and largest first, which is what turns a list into a ranking.',
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
    debrief: `One address accounts for ${TOP_SOURCE_COUNT} of the ${FAILED_PASSWORD} failures, which is most of them. That is the difference between "we are under attack" and "one host is misconfigured", and you cannot tell which from a total.`,
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
        'Volume and breadth are different measurements and they support different conclusions. Hundreds of failures from one address is a single misbehaving host or one determined attacker. The same total spread across two hundred addresses is a botnet, and the response to each is nothing like the response to the other.\n\nThe tool for breadth is `sort -u`, which removes duplicates outright rather than counting them, piped into `wc -l` to count what survives. Note that this is `sort -u` and not `uniq` without a sort in front of it, which is the mistake that quietly under-counts.',
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
    debrief: `${FAILED_PASSWORD} failures from only ${UNIQUE_FAILED_SOURCES} addresses. That is not a botnet. It is a small number of sources being persistent, and it is a much easier problem to act on.`,
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
        'You have ranked where the traffic came from. The other half of the question is what it was reaching for, and the answer changes how worried you are. A spread across hundreds of invented names is a dictionary running blind. Concentrated fire on one real account is somebody who has done their homework.\n\nExtracting the account is slightly harder than extracting the address, because the name sits between two fixed words rather than at the end. Anchoring the pattern on both sides is the general technique: match the words either side and let the variable part sit in the middle.',
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
    debrief: `The most-hunted account is ${TOP_TARGET}, and it is a monitoring account rather than a person. Hold that thought: an account that exists and is being hammered from one address is usually a service whose password changed and whose config nobody updated.`,
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
        'A ranking is a summary, and summaries are where mistakes hide. Before you put a number in a report, count the specific thing you are about to claim, on its own, with a command somebody else could rerun and check.\n\nChaining two greps is the plainest way to say "lines that match both": the first narrows to the event, the second narrows to the source. It is also easier to read six months later than one clever pattern that does both.',
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
    debrief: `Confirmed independently of the ranking. That is the habit: the pipeline suggested the answer, and a second, simpler command proved it. Anything you cannot reproduce twice does not go in the report.`,
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
        'Attacks are rarely spread evenly. Finding the hour with the most activity tells you where to look before you read a single line, and it turns a 2,500-line file into a five-minute question.\n\nThe timestamp sits at a FIXED POSITION at the start of every syslog-format line, which means you can slice it out by character position instead of matching a pattern. `cut -c` takes a character range, so `cut -c8-9` lifts the two-digit hour out of "Aug 15 09:14:02" without caring what the rest of the line says.',
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
    debrief: `${BUSIEST_HOUR_COUNT} lines in the ${BUSIEST_HOUR}:00 hour, against a couple of hundred in a normal one. You now know exactly where in the day to start reading, and you got there without opening the file.`,
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
        'Most of what a log contains is explained. The skill is removing the explained part without removing anything else, so that what remains is small enough to read and still contains everything you have not accounted for.\n\n`grep -v` inverts a match: it prints the lines that do NOT contain the pattern. Chained after a grep that narrows to the event, it says "these events, except the ones from there".',
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
    debrief: `${FAILED_PASSWORD} became ${FAILED_WITHOUT_TOP_SOURCE} by removing one explained source. Every exclusion you make is a claim that something is benign, so it belongs in your notes: an analyst who cannot say what they filtered out cannot defend what they concluded.`,
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
        'Exclusions stack: each `grep -v` in the chain removes another explained slice, and the number that comes out the end is your genuinely unexplained remainder.\n\nWatch how the remainder behaves as you add filters. If it collapses towards zero, the activity was concentrated in a few sources and you have accounted for it. If it barely moves, the noise is spread thin and you are dealing with something broader. That shape is worth more than either individual number.',
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
    debrief: `Two addresses account for most of the volume, and ${FAILED_WITHOUT_TOP_TWO} lines are left over. That remainder is now small enough to read line by line, which is the whole point of filtering.`,
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
        'Inverting a match is also a discovery tool, not just a noise filter. When one process dominates a file, removing it shows you everything you have been scrolling past: sudo, cron, useradd, the password changes, the account creations.\n\nThis is worth doing on any unfamiliar log before you start hunting, because the interesting minority is frequently in the part you were never looking at.',
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
    debrief: `${NON_SSHD} lines out of ${authLines.length} that you had never looked at. Go and read them at some point: sudo, cron and account changes all live in there, and account changes are exactly what an attacker makes after they get in.`,
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
        'A grep pattern is a substring, not an address, and a dot matches any character unless you escape it. `grep -v "10."` therefore removes every line containing a 1 followed by a 0 followed by anything: port 1024, uid 1001, the timestamp 10:14, and every other address starting 10. Whole hours of evidence disappear and nothing warns you.\n\nThe defensive habit is to make exclusions as specific as the thing you are excluding. Match the full address. Better still, match the field it appears in, so that the same digits somewhere else on the line cannot trigger it.',
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
      'The dangerous part of a bad exclusion is that it succeeds. You get a number, it looks smaller, and the evidence it removed leaves no trace. When you filter, filter on the most specific string that does the job.',
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
        'This is the pattern you will run most often in a real shift, and it is just the two halves of this module joined: remove what is explained, then rank what is left so the biggest unexplained thing is on the first line.\n\nRun it repeatedly and it becomes a loop. Rank, explain the top entry, exclude it, rank again. You stop when the top of the list is either something you cannot explain, which is your finding, or small enough not to matter, which is also an answer.',
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
    debrief: `${SECOND_SOURCE} is now the loudest thing you cannot explain. It is external, and it is the address worth spending the next hour on.`,
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
        'Logs are rotated so they do not grow forever. On a schedule, the live file is renamed with a `.1` on the end, a fresh empty one takes its place, and older generations get pushed further down the numbering and eventually compressed to `.gz`.\n\nThis matters more than it sounds. Every search you have run so far covered only the current file, which means it covered only the period since the last rotation. An incident that started before that is invisible to you and you would have no way of knowing, because your commands succeeded and returned an answer.',
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
      'Every search you have run in this package so far ignored this file entirely. That is the single most common way an investigation misses the beginning of an incident.',
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
        'The most valuable question about any suspicious activity is when it started, because the answer separates "somebody probed us this morning" from "this has been running for a fortnight and we never noticed".\n\nThe method is unglamorous: run the same count against the previous generation and compare. A similar number in both means it is ongoing background noise. A sharp increase in the current file means something changed, and the change is what you investigate.',
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
    debrief: `${ROTATED_FAILED} yesterday against ${FAILED_PASSWORD} today. The failures are not new, but the volume is: whatever changed, changed recently, and that narrows what you are looking for.`,
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
        'When you want a total across several files, `grep -c` will not give it to you: handed more than one file it prints a per-file count, which is useful but is not a total.\n\nThe fix is to join the files into one stream first. `cat` with several arguments concatenates them in order, and the grep downstream sees one continuous input and returns one number. This is the same reason `cat file | grep` shows up everywhere: not because it is necessary for one file, but because it is how you build a stream out of several.',
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
    debrief: `${FAILED_BOTH_FILES} across everything still on disk. Note the ceiling on that claim: it is everything RETAINED, not everything that happened, and the difference is whatever rotation has already deleted.`,
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
        'Early in an investigation the useful question is not what the lines say but which files are worth opening. `grep -l` answers exactly that: it prints the name of each file containing at least one match and then stops reading that file, so it stays fast over large sets.\n\nIt is the natural first move when somebody hands you an address, a username, or a hostname and no idea where it turns up.',
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
      'Two files to read instead of three, established in one command. On a real host with fifty log files this is the difference between a focused hour and a wasted day.',
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
        'When you are handed an indicator and asked whether it has been seen anywhere, you want a sweep rather than a list of files to check by hand. `grep -r` walks a directory tree and searches every file under it, prefixing each result with the file it came from.\n\nCombined with `-c` it gives you a per-file tally, which is the most useful first output: it tells you at a glance which log has the most to say about the indicator, and therefore which one to open first.',
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
    debrief: `That address is in the auth log ${SECOND_SOURCE_IN_AUTH} times and in the WEB log as well. The same source touching two different services is a much stronger signal than either count on its own, and you would not have found it without the sweep.`,
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
        'The web server does not write syslog format. A line in the combined log format goes: client address, two placeholder fields, the timestamp in brackets, the request in quotes, the response status, the bytes sent, the referrer, and the user agent.\n\nNothing you have learned stops working, but WHERE things sit changes, and that is the whole adjustment. The address is field one instead of being buried mid-line. The status code is field nine. The request sits inside the first pair of double quotes. Read one line carefully and count the fields before you write a single command against a format you have not seen before.',
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
      'Two of those requests are for /wp-login.php and /.env on a host that serves neither. Nobody browses to those by accident: that is somebody checking whether you left something lying around.',
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
        'When a format is reliably delimited you do not need a pattern, you need a field number. `cut -d " " -f 9` splits each line on spaces and hands you the ninth piece, which in the combined log format is the response status.\n\nStatus codes are the fastest triage signal a web log offers. A wall of 404s from one source is somebody enumerating paths that do not exist. A 200 on a path that should never have been reachable is a much worse day. Ranking them first tells you which of those conversations you are about to have.',
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
    debrief: `More requests failed than succeeded, on a production web server. On a real site that ratio is inverted, and an inverted ratio on a quiet host almost always means the traffic is not coming from users.`,
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
        'This is the pivot that makes a web log worth reading: find the response you care about, then extract the field that identifies who caused it. Filter first, cut second.\n\nBe careful about how you match the status. Bare `404` also matches a byte count of 404 or a path containing those digits, which is why the pattern is written with the surrounding spaces: it pins the digits to their own field. Sloppy matching on a numeric field is the same class of mistake as an over-broad exclusion, and it fails in the same silent way.',
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
      'Three different sources, each probing for something that is not there. Individually forgettable. As a set, it is the background radiation of the internet, and the job is knowing which of it to ignore.',
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
        'The request in a combined log line contains spaces, so splitting on spaces breaks it into three pieces. But it is wrapped in double quotes, and nothing else on the line is, which makes the quote character a better delimiter than the space.\n\nThat is the general lesson: the right delimiter is whatever separates the field you actually want, not whatever separates most fields. Splitting on `"` puts the request in field two, between the first and second quote. Picking your delimiter deliberately is usually the difference between one clean command and a chain of three fixing each other up.',
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
      'A request for /.env is an attempt to read the file where applications keep their database passwords and API keys. It got a 404 here. It is worth knowing what that request means the next time it gets a 200.',
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
        'A single address in a web log is close to meaningless: the internet scans everything constantly. The same address turning up in a SECOND, unrelated service is a different matter, because coincidence stops being a good explanation.\n\nCorrelation like this is the core move of an investigation and it needs no new commands, only the discipline to take an indicator from one source and go looking for it in another. What you are testing is whether one actor touched two things.',
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
    debrief: `${SECOND_SOURCE_IN_WEB} request to the web server and ${SECOND_SOURCE_IN_AUTH} lines in the authentication log, from one address. It did not wander in. Go back to what it was doing in auth.log, because that is now the most interesting thing on this host.`,
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
        'Failed logins are a nuisance report. A successful login from the same source that was failing is an incident, and the two are separated by one command that most people never run because the failure count is so absorbing.\n\nMake this the reflex: whenever you finish counting failures, immediately go and look for successes from the same place. The answer is usually none, which is worth knowing and takes ten seconds. When it is not none, everything about your day changes.',
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
      'Two of them. One with a password, one with a key, from the address you had written off as background noise. Read the account names on those two lines carefully, because they are not the same account.',
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
        'Half of what you report is that something did NOT happen, and a negative needs to be as carefully produced as a positive. "I did not see anything" is not a finding. "No successful authentication from that address appears in the retained logs" is, because it names what was searched and what was searched for.\n\nA count of zero is the right shape for this. It is unambiguous, it is reproducible by whoever reads your report, and it forces you to say which file you looked in. State the bound as well: you searched the retained logs, and rotation has already deleted whatever came before them.',
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
      'That address tried and never got in, and you can now say so with a command anybody can rerun. Note that grep exits with status 1 when it matches nothing, which is why scripts that chain on success sometimes stop dead on a perfectly good negative result.',
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
        'Getting in is not the objective, it is the prerequisite. What somebody does with the access is the actual incident, and on a Linux host most of that leaves a record in one place: sudo logs the account, the terminal, the working directory, and the exact command line, every time.\n\nThe string `COMMAND=` appears on precisely those lines. It is a short list on any healthy host, it is readable in full, and it is the first thing to pull once you believe an account is compromised. Read all of it, including the entries that are obviously routine, because the shape of normal is what makes the abnormal entry stand out.',
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
      'Read those five lines in order. Two of them are routine administration. Three of them are one account creating a second account, giving it sudo, and then that new account archiving a directory full of exports. That is the whole intrusion, in three lines, in a file you have had open all along.',
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
        'Once you have a name, the next move is always the same: collect everything about it in one place, in time order, before you interpret any of it. Accounts, addresses, process ids and filenames are all pivots, and the discipline is to gather first and conclude second.\n\nFiltering the failures out matters here. An account name that also appears in hundreds of brute-force attempts will bury its own real activity, and what you want is the handful of lines where something actually happened: the session opening, what it ran, the session closing.',
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
      'An account created at 10:22, given sudo at 10:31, logging in with a key at 11:05 from the same address that had been failing all morning, and archiving the exports directory a minute later. Nobody legitimate does that sequence.',
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
        'A command line in a log is not only evidence of what happened, it is a set of leads. Filenames in it are things you can go and look for on disk, and whether they are still there tells you how far along the attacker got and how much time you have.\n\nExtracting the path rather than reading it off the screen is worth the extra keystrokes, because the same command scales to a thousand sudo lines and because it is copy-pasteable into the next step without a transcription mistake.',
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
      'A dot at the front of .cache hides it from a plain ls, and /tmp is world-writable and routinely ignored. Go and look for that file when you next have a terminal on this host: whether it is still there is the difference between staged and gone.',
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
        'Before a number goes in front of anybody, get to it twice by different routes. `grep -c` counts matches internally; `grep | wc -l` counts the lines that came out. They should agree, and when they do not the disagreement is itself informative: a pattern matching twice on one line, a file without a trailing newline, a stray filename argument turning on per-file output.\n\nThis costs seconds and it is the habit that keeps you credible. The number in a report is the part people remember and the part they check.',
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
    debrief: `Both routes give ${SECOND_SOURCE_IN_AUTH}. You now have a source that brute-forced the host, got in, created an account, escalated it, and staged an archive of the exports directory, and every step of that is a number or a line you can reproduce on demand. That is a finding.`,
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
