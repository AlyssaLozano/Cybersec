/**
 * Package 2: Log Analysis and Parsing -- 14 exercises across 4 modules.
 *
 * Package 1 taught the tools. This package points them at the only thing a SOC
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
 *
 * The reveal is deliberately withheld from the prompts. Being handed "an attack
 * happened at 10:14" teaches nothing; noticing it does.
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
 * As in Package 1, every expected count is COMPUTED from the seeded logs, so
 * regenerating the world can never leave a stale answer key behind.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

import { AUTH_LOG, SYSLOG } from '../vfs/data/generated.js';
import { PACKAGE_2_PRACTICE } from './package2-practice.js';

const authLines = AUTH_LOG.split('\n').filter((line) => line !== '');
const sysLines = SYSLOG.split('\n').filter((line) => line !== '');

function count(lines: string[], needle: string, caseInsensitive = false): number {
  const target = caseInsensitive ? needle.toLowerCase() : needle;
  return lines.filter((line) => (caseInsensitive ? line.toLowerCase() : line).includes(target)).length;
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

// --- Module 2.1: Reading log formats -----------------------------------------

const MODULE_2_1: Exercise[] = [
  {
    id: '2.1.1',
    moduleId: '2.1',
    packageId: '2',
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
      'You met this command in Package 1: it shows you the beginning of a file.',
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
        hint: 'Read /var/log/auth.log — every line should carry this hostname.',
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
    practice: PACKAGE_2_PRACTICE['2.1.1'] ?? [],
  },
  {
    id: '2.1.2',
    moduleId: '2.1',
    packageId: '2',
    order: 2,
    title: 'Pull out just the timestamps',
    kind: 'terminal',
    goal: 'Cut a line into fields and keep only the ones you want.',
    prompt:
      'From the first 10 lines of the authentication log, show only the date and time — the first three space-separated fields — and nothing else.',
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
        hint: 'Each line should be ONLY the timestamp — three fields, nothing after the seconds.',
      },
      {
        type: 'output-excludes',
        text: 'rmg-web-02',
        hint: 'The hostname is field 4. If you can still see it, you kept too many fields.',
      },
    ],
    debrief:
      'Field extraction is how log lines become data you can count. Strip everything except the field you care about, and the next tool in the pipe can sort it, tally it, or find the duplicates.',
    practice: PACKAGE_2_PRACTICE['2.1.2'] ?? [],
  },
  {
    id: '2.1.3',
    moduleId: '2.1',
    packageId: '2',
    order: 3,
    title: 'Narrow a log to one hour',
    kind: 'terminal',
    goal: 'Use the timestamp as a filter to scope an investigation to a time window.',
    prompt:
      'Something is reported to have happened mid-morning. Show every authentication log entry from the 10 o\'clock hour on August 15.',
    teach: {
      concept:
        'Because the timestamp sits at the front of every line, you can filter by time with plain text matching — no special date tooling required. Searching for "Aug 15 10:" matches 10:00:00 through 10:59:59, because every one of those timestamps literally begins with that text. Scoping to a window is usually the first move in an investigation: an alert gives you a time, and you go read what the machine was saying around it.',
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
      'You want every line whose time begins with 10 — think about what those all have in common.',
      'Include the colon after the hour: "Aug 15 10:" — without it you would also match day 10 in other contexts.',
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
        hint: 'Lines from other hours got through — tighten the pattern.',
      },
    ],
    debrief:
      'You just scoped an investigation to a one-hour window. Look at what is in there: an accepted login, a sudo command, and a new account being created. That sequence is the whole reason this package exists.',
    practice: PACKAGE_2_PRACTICE['2.1.3'] ?? [],
  },
];

// --- Module 2.2: Authentication logs -----------------------------------------

const MODULE_2_2: Exercise[] = [
  {
    id: '2.2.1',
    moduleId: '2.2',
    packageId: '2',
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
      'The phrase to search for is "Failed password" — two words, capital F.',
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
      `${FAILED_PASSWORD} failed logins in one day sounds like a siren. Hold that thought — the next exercise shows why the raw number is nearly meaningless on its own. Analysts who page people over a count like this stop being trusted quickly.`,
    practice: PACKAGE_2_PRACTICE['2.2.1'] ?? [],
  },
  {
    id: '2.2.2',
    moduleId: '2.2',
    packageId: '2',
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
        hint: 'Lines about other accounts got through — the second filter is not being applied.',
      },
    ],
    debrief:
      'Look closely at what these lines say: "Failed password for invalid user admin". Invalid user means no such account exists on this box. Someone is guessing account names that were never here — that is an untargeted scanner working through a wordlist, not somebody who knows you.',
    practice: PACKAGE_2_PRACTICE['2.2.2'] ?? [],
  },
  {
    id: '2.2.3',
    moduleId: '2.2',
    packageId: '2',
    order: 3,
    title: 'Find what actually succeeded',
    kind: 'terminal',
    goal: 'Shift attention from noise to consequence.',
    prompt: 'Show every successful login recorded in the authentication log.',
    teach: {
      concept:
        'Failures are loud and usually meaningless; successes are quiet and always matter. When sshd lets someone in it writes "Accepted", followed by the method (password or publickey), the account, and the source address. On a busy internet-facing host there may be thousands of failures and a handful of successes — and the handful is where you look.',
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
      'No flags needed — just grep for the word and read what comes back.',
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
      `Read the source addresses. Seven of these come from 10.20.x.x — the internal office network. Two come from 203.0.113.55, an address outside the company entirely, for accounts called testuser and sysmon. ${FAILED_PASSWORD} failures told you nothing. These ${ACCEPTED} lines just told you everything.`,
    practice: PACKAGE_2_PRACTICE['2.2.3'] ?? [],
  },
  {
    id: '2.2.4',
    moduleId: '2.2',
    packageId: '2',
    order: 4,
    title: 'Review activity for a privileged account',
    kind: 'terminal',
    goal: 'Inspect one high-value account, and cap the output so it stays readable.',
    prompt:
      'Show authentication activity involving the root account, limited to the first 20 lines so the screen stays manageable.',
    teach: {
      concept:
        'root can do anything on the machine, so it gets special attention. Searching for it in the auth log turns up both failed attempts against it and legitimate privilege escalation by other accounts. Grepping a common word can return hundreds of lines, so pipe the result into `head` to cap what reaches your screen — you keep control of the terminal and still see whether the pattern is worth pursuing.',
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
    practice: PACKAGE_2_PRACTICE['2.2.4'] ?? [],
  },
];

// --- Module 2.3: System logs -------------------------------------------------

const MODULE_2_3: Exercise[] = [
  {
    id: '2.3.1',
    moduleId: '2.3',
    packageId: '2',
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
      'These are genuine faults — the portal cannot reach the lab interface — and they have nothing to do with the intrusion. Most errors in most logs are like this: real problems for somebody, just not security problems. Learning to set them aside without ignoring them is a large part of the job.',
    practice: PACKAGE_2_PRACTICE['2.3.1'] ?? [],
  },
  {
    id: '2.3.2',
    moduleId: '2.3',
    packageId: '2',
    order: 2,
    title: 'Match several patterns at once',
    kind: 'terminal',
    goal: 'Search for more than one word in a single pass using an extended regular expression.',
    prompt:
      'Find every system log entry about a service starting or stopping. Match both words in one command, and do not let capitalisation defeat you.',
    teach: {
      concept:
        'Sometimes one question needs two words. An extended regular expression lets you write alternatives separated by a pipe INSIDE the pattern: "cat|dog" matches a line containing either. This needs the -E flag, because without it grep treats the pipe as a literal character and searches for the text "cat|dog". Note that the pipe inside quotes means "or", while a pipe outside quotes joins two commands — same symbol, completely different jobs.',
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
        { flag: '-iE', means: 'Both flags at once — the usual way you will actually type this.' },
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
    practice: PACKAGE_2_PRACTICE['2.3.2'] ?? [],
  },
  {
    id: '2.3.3',
    moduleId: '2.3',
    packageId: '2',
    order: 3,
    title: 'Search only the most recent entries',
    kind: 'terminal',
    goal: 'Restrict a search to the end of a file, where the newest events are.',
    prompt:
      'Look at only the last 50 lines of the system log, and from those show the kernel messages.',
    teach: {
      concept:
        'Log files are append-only: the newest entry is the last line. When you are asked "what is happening right now", you want the end of the file, not the whole thing. Piping `tail` into `grep` searches only that recent slice. Order matters here — tail first, then grep — because you are choosing a time window and then filtering inside it. Reversing them would filter the whole file and then take the last 50 matches, which answers a different question.',
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
    practice: PACKAGE_2_PRACTICE['2.3.3'] ?? [],
  },
];

// --- Module 2.4: Parsing and extraction --------------------------------------

const MODULE_2_4: Exercise[] = [
  {
    id: '2.4.1',
    moduleId: '2.4',
    packageId: '2',
    order: 1,
    title: 'Extract every unique source address',
    kind: 'terminal',
    goal: 'Pull a pattern out of log lines and reduce it to a distinct list.',
    prompt:
      'Produce a sorted list of every unique IP address that appears on an sshd line in the authentication log. Output addresses only — no surrounding log text.',
    teach: {
      concept:
        'So far grep has returned whole lines. With -o it returns only the part that matched, which turns grep into an extraction tool. Describe an IP address as a pattern — four groups of one to three digits separated by dots — and grep will pull out every one it sees. Feed the result into `sort -u` and thousands of lines collapse into the handful of distinct addresses that produced them.',
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
      "An IP address pattern looks like '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' — the backslashes make each dot literal.",
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
        hint: 'Log text is still coming through — add -o so grep prints only the matched address.',
      },
    ],
    debrief:
      `Two thousand-odd lines reduced to ${SSHD_UNIQUE_IPS.size} addresses you can actually look at. Five are internal 10.20.x.x hosts. The rest are external, and one of them — 203.0.113.55 — is the address behind both of those successful logins you found earlier.`,
    practice: PACKAGE_2_PRACTICE['2.4.1'] ?? [],
  },
  {
    id: '2.4.2',
    moduleId: '2.4',
    packageId: '2',
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
        { flag: '[^ ]*', means: 'Any run of characters that are not spaces — i.e. the rest of the value.' },
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
        hint: 'The label is still in your output — \\K is what discards everything before it.',
      },
      {
        type: 'output-contains',
        text: 'testuser',
        hint: 'One of the accounts that failed repeatedly should appear in your list.',
      },
    ],
    debrief:
      'These are accounts that actually exist on this host, so each failure was a real guess against a real account. testuser is on the list — and testuser is one of the two accounts that later succeeded. Someone guessed until they got in.',
    practice: PACKAGE_2_PRACTICE['2.4.2'] ?? [],
  },
  {
    id: '2.4.3',
    moduleId: '2.4',
    packageId: '2',
    order: 3,
    title: 'Build a timeline of SSH activity',
    kind: 'terminal',
    goal: 'Read events in order, and understand why log order is already chronological.',
    prompt:
      'Show the first 20 SSH-related entries in the authentication log, in the order they occurred.',
    teach: {
      concept:
        'A timeline is the backbone of every incident report, and log files hand it to you for free: entries are appended as things happen, so the file is already in chronological order. You do not need to sort it — sorting by text would actually break it, because "Aug 9" sorts after "Aug 15" alphabetically. Filter to the events you care about and read top to bottom.',
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
        hint: 'The first entries of the day start just after midnight — you want the head of the file, not the tail.',
      },
    ],
    debrief:
      'Notice that the earliest entries are all the same account failing from the same internal address, every five minutes, all night. That is a monitoring box with a stale password — a misconfiguration that generates more failures than the actual attacker did. Volume is not evidence.',
    practice: PACKAGE_2_PRACTICE['2.4.3'] ?? [],
  },
  {
    id: '2.4.4',
    moduleId: '2.4',
    packageId: '2',
    order: 4,
    title: 'Corroborate an event across two logs',
    kind: 'terminal',
    goal: 'Search several files at once and use the filename prefix to correlate sources.',
    prompt:
      'The account "testuser" is worth a closer look. Search for it in both the authentication log and the system log at the same time.',
    teach: {
      concept:
        'Give grep more than one file and it searches all of them, prefixing each result with the filename it came from. That prefix is the point: it lets you confirm an event in a second, independently written log. A single log line is a claim. The same event recorded by two different subsystems is evidence — and if an attacker tampered with one file, the mismatch is itself a finding.',
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
      'No flags needed — grep adds the filename prefix automatically when searching multiple files.',
    ],
    solution: `grep "testuser" ${AUTH} ${SYS}`,
    expectedOutput:
      `Matches from both files, each prefixed with its filename — many from auth.log, and ${TESTUSER_IN_SYSLOG} from syslog.`,
    checks: [
      {
        type: 'output-contains',
        text: `${AUTH}:`,
        hint: 'Results from the auth log should be prefixed with its filename.',
      },
      {
        type: 'output-contains',
        text: `${SYS}:`,
        hint: 'You need to search the system log as well — pass both filenames to grep.',
      },
      {
        type: 'output-contains',
        text: 'testuser',
        hint: 'Search for the account name testuser.',
      },
    ],
    debrief:
      'Two independent subsystems recorded the same moment: sshd wrote "Accepted password for testuser from 203.0.113.55" at 10:14:22, and systemd-logind wrote "New session 4821 of user testuser" one second later. That agreement is what turns a suspicion into something you can put in a report — and it is where Package 3 picks up.',
    practice: PACKAGE_2_PRACTICE['2.4.4'] ?? [],
  },
];

// --- the package -------------------------------------------------------------

export const PACKAGE_2: LearningPackage = {
  id: '2',
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
  ],
  prerequisites: ['1'],
  modules: [
    {
      id: '2.1',
      packageId: '2',
      order: 1,
      title: 'Reading log formats',
      summary: 'Learn the shape of a log line, and filter on its fields.',
      exercises: MODULE_2_1,
    },
    {
      id: '2.2',
      packageId: '2',
      order: 2,
      title: 'Authentication logs',
      summary: 'Who tried to get in, who succeeded, and which of those matters.',
      exercises: MODULE_2_2,
    },
    {
      id: '2.3',
      packageId: '2',
      order: 3,
      title: 'System logs',
      summary: 'Everything the machine says when it is not talking about logins.',
      exercises: MODULE_2_3,
    },
    {
      id: '2.4',
      packageId: '2',
      order: 4,
      title: 'Parsing and extraction',
      summary: 'Turn log text into lists of facts you can count and compare.',
      exercises: MODULE_2_4,
    },
  ],
};
