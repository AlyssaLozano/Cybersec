/**
 * Practice drills for Package 2: five per exercise, 70 in total.
 *
 * Same design rules as Package 1:
 *
 * - Same skill, different target. A drill never introduces a new command.
 * - Graded on outcome, and every expected count is COMPUTED from the seeded
 *   logs rather than typed in, so regenerating the world cannot strand an
 *   answer key.
 * - Optional. Drills never gate progression and never move the completion
 *   percentage.
 * - Targets are drawn from the real seeded host, so repetition doubles as
 *   familiarity with the machine students will later investigate.
 *
 * A note on two labels that look like good drill material and are not:
 * `name=` also matches inside `logname=`, and `uid=` picks up a trailing
 * parenthesis from session lines (`uid=1004)`). Both would teach a student that
 * their correct command was wrong, so the extraction drills use `rhost=`,
 * `euid=`, `UID=` and `GID=` instead.
 */

import type { Check, PracticeItem } from '@soc/shared';

import { AUTH_LOG, SYSLOG } from '../vfs/data/generated.js';
import { BASE_IMAGE } from '../vfs/image.js';

const authLines = AUTH_LOG.split('\n').filter((line) => line !== '');
const sysLines = SYSLOG.split('\n').filter((line) => line !== '');

/** Lines of a seeded file, read from the image so counts cannot drift. */
function fileLines(path: string): string[] {
  return (BASE_IMAGE.get(path)?.content ?? '').split('\n').filter((line) => line !== '');
}

const authOldLines = fileLines('/var/log/auth.log.1');

function countIn(lines: string[], needle: string, caseInsensitive = false): number {
  const target = caseInsensitive ? needle.toLowerCase() : needle;
  return lines.filter((line) => (caseInsensitive ? line.toLowerCase() : line).includes(target)).length;
}

function countRegex(lines: string[], pattern: RegExp): number {
  return lines.filter((line) => pattern.test(line)).length;
}

function countBoth(lines: string[], a: string, b: string): number {
  return lines.filter((line) => line.includes(a) && line.includes(b)).length;
}

/** Distinct values captured by a pattern's first group. */
function distinct(lines: string[], pattern: RegExp): number {
  const found = new Set<string>();
  for (const line of lines) {
    for (const match of line.matchAll(new RegExp(pattern, 'g'))) {
      if (match[1]) found.add(match[1]);
    }
  }
  return found.size;
}

const AUTH = '/var/log/auth.log';
const SYS = '/var/log/syslog';
const IPV4 = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/;

// --- shared check builders ---------------------------------------------------

const outHas = (text: string): Check => ({
  type: 'output-contains',
  text,
  hint: `The output should include "${text}".`,
});

const outLacks = (text: string): Check => ({
  type: 'output-excludes',
  text,
  hint: `"${text}" should not appear — your filter is letting extra text through.`,
});

const lines = (count: number): Check => ({
  type: 'output-line-count',
  count,
  hint: `Exactly ${count} lines should come back.`,
});

const numberIs = (value: number): Check => ({
  type: 'output-numeric',
  equals: value,
  hint: 'The answer should be a single number.',
});

const hasFlag = (command: string, flag: string): Check => ({
  type: 'command-has-flag',
  command,
  flags: [flag],
  hint: `Use the ${flag} option on ${command}.`,
});

const usesPipe: Check = { type: 'command-uses-pipe', hint: 'Join the two commands with the | character.' };

const eachLineIsIp: Check = {
  type: 'output-matches',
  pattern: '^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$',
  flags: 'm',
  hint: 'Each line should be a bare address. Use -o so only the match is printed.',
};

export const PACKAGE_2_PRACTICE: Record<string, PracticeItem[]> = {
  // --- 2.1.1 read the shape of a log line ------------------------------------
  '2.1.1': [
    { id: '2.1.1-p1', prompt: 'Show the first 5 lines of the system log.', solution: `head -n 5 ${SYS}`, checks: [lines(5), outHas('rmg-web-02')] },
    { id: '2.1.1-p2', prompt: 'Show the first 2 lines of the package manager log, /var/log/dpkg.log.', solution: 'head -n 2 /var/log/dpkg.log', checks: [lines(2)] },
    { id: '2.1.1-p3', prompt: 'Show the first 4 lines of the web server access log, /var/log/nginx/access.log.', solution: 'head -n 4 /var/log/nginx/access.log', checks: [lines(4)] },
    { id: '2.1.1-p4', prompt: 'Show the first line only of /var/log/kern.log.', solution: 'head -n 1 /var/log/kern.log', checks: [lines(1), outHas('kernel')] },
    { id: '2.1.1-p5', prompt: 'Yesterday\'s rotated authentication log is /var/log/auth.log.1. Show its first 7 lines.', solution: 'head -n 7 /var/log/auth.log.1', checks: [lines(7)] },
  ],

  // --- 2.1.2 cut fields out of a line ----------------------------------------
  '2.1.2': [
    { id: '2.1.2-p1', prompt: 'Show only the timestamps from the first 5 lines of the system log.', solution: `head -n 5 ${SYS} | cut -d ' ' -f 1-3`, checks: [lines(5), outLacks('rmg-web-02')] },
    { id: '2.1.2-p2', prompt: '/etc/passwd is colon-separated. Print just the account names (field 1).', solution: "cut -d ':' -f 1 /etc/passwd", checks: [outHas('student'), outHas('testuser'), outLacks('/bin/bash')] },
    { id: '2.1.2-p3', prompt: 'From the first 3 lines of the auth log, print only field 4 — the hostname.', solution: `head -n 3 ${AUTH} | cut -d ' ' -f 4`, checks: [lines(3), outHas('rmg-web-02'), outLacks('Aug')] },
    { id: '2.1.2-p4', prompt: 'Print just the group names from /etc/group (field 1, colon-separated).', solution: "cut -d ':' -f 1 /etc/group", checks: [outHas('adm'), outHas('sudo')] },
    { id: '2.1.2-p5', prompt: 'Print the login shell of every account in /etc/passwd (field 7).', solution: "cut -d ':' -f 7 /etc/passwd", checks: [outHas('/bin/bash'), outLacks('student:')] },
  ],

  // --- 2.1.3 scope to a time window ------------------------------------------
  '2.1.3': [
    { id: '2.1.3-p1', prompt: 'Show every system log entry from the 3 o\'clock hour.', solution: `grep "Aug 15 03:" ${SYS}`, checks: [lines(countIn(sysLines, 'Aug 15 03:'))] },
    { id: '2.1.3-p2', prompt: 'Show every authentication entry from the 9 o\'clock hour.', solution: `grep "Aug 15 09:" ${AUTH}`, checks: [lines(countIn(authLines, 'Aug 15 09:'))] },
    { id: '2.1.3-p3', prompt: 'Show every authentication entry from the 11 o\'clock hour.', solution: `grep "Aug 15 11:" ${AUTH}`, checks: [lines(countIn(authLines, 'Aug 15 11:'))] },
    { id: '2.1.3-p4', prompt: 'Show every system log entry from the 18 o\'clock (6pm) hour.', solution: `grep "Aug 15 18:" ${SYS}`, checks: [lines(countIn(sysLines, 'Aug 15 18:'))] },
    { id: '2.1.3-p5', prompt: 'Narrow to ten minutes: show authentication entries from 07:40 to 07:49.', solution: `grep "Aug 15 07:4" ${AUTH}`, checks: [lines(countIn(authLines, 'Aug 15 07:4'))] },
  ],

  // --- 2.2.1 count matches ---------------------------------------------------
  '2.2.1': [
    { id: '2.2.1-p1', prompt: 'How many lines in the auth log say "Invalid user"?', solution: `grep -c "Invalid user" ${AUTH}`, checks: [numberIs(countIn(authLines, 'Invalid user'))] },
    { id: '2.2.1-p2', prompt: 'How many successful logins ("Accepted") are in the auth log?', solution: `grep -c "Accepted" ${AUTH}`, checks: [numberIs(countIn(authLines, 'Accepted'))] },
    { id: '2.2.1-p3', prompt: 'How many auth log lines involve sudo?', solution: `grep -c "sudo" ${AUTH}`, checks: [numberIs(countIn(authLines, 'sudo'))] },
    { id: '2.2.1-p4', prompt: 'How many system log lines mention nginx?', solution: `grep -c "nginx" ${SYS}`, checks: [numberIs(countIn(sysLines, 'nginx'))] },
    { id: '2.2.1-p5', prompt: 'How many failed passwords are in yesterday\'s rotated log, /var/log/auth.log.1?', solution: 'grep -c "Failed password" /var/log/auth.log.1', checks: [numberIs(countIn(authOldLines, 'Failed password'))] },
  ],

  // --- 2.2.2 chain two filters -----------------------------------------------
  '2.2.2': [
    { id: '2.2.2-p1', prompt: 'Show failed passwords against the "postgres" account.', solution: `grep "Failed password" ${AUTH} | grep "postgres"`, checks: [usesPipe, lines(countBoth(authLines, 'Failed password', 'postgres'))] },
    { id: '2.2.2-p2', prompt: 'Show failed passwords against the "root" account.', solution: `grep "Failed password" ${AUTH} | grep "root"`, checks: [usesPipe, lines(countBoth(authLines, 'Failed password', 'root'))] },
    { id: '2.2.2-p3', prompt: 'Show successful logins that used a key rather than a password.', solution: `grep "Accepted" ${AUTH} | grep "publickey"`, checks: [usesPipe, lines(countBoth(authLines, 'Accepted', 'publickey'))] },
    { id: '2.2.2-p4', prompt: 'Show "Invalid user" lines that name the account "oracle".', solution: `grep "Invalid user" ${AUTH} | grep "oracle"`, checks: [usesPipe, lines(countBoth(authLines, 'Invalid user', 'oracle'))] },
    { id: '2.2.2-p5', prompt: 'Show sudo lines that involve the account "testuser".', solution: `grep "sudo" ${AUTH} | grep "testuser"`, checks: [usesPipe, lines(countBoth(authLines, 'sudo', 'testuser'))] },
  ],

  // --- 2.2.3 find what succeeded ---------------------------------------------
  '2.2.3': [
    { id: '2.2.3-p1', prompt: 'Show only the logins that authenticated with a public key.', solution: `grep "Accepted publickey" ${AUTH}`, checks: [lines(countIn(authLines, 'Accepted publickey'))] },
    { id: '2.2.3-p2', prompt: 'Show only the logins that authenticated with a password.', solution: `grep "Accepted password" ${AUTH}`, checks: [lines(countIn(authLines, 'Accepted password'))] },
    { id: '2.2.3-p3', prompt: 'How many sessions were opened in total? Count lines containing "session opened".', solution: `grep -c "session opened" ${AUTH}`, checks: [numberIs(countIn(authLines, 'session opened'))] },
    { id: '2.2.3-p4', prompt: 'Show the successful logins in yesterday\'s log, /var/log/auth.log.1.', solution: 'grep "Accepted" /var/log/auth.log.1', checks: [lines(countIn(authOldLines, 'Accepted'))] },
    { id: '2.2.3-p5', prompt: 'Show every auth log line involving the address 203.0.113.55 that was accepted.', solution: `grep "Accepted" ${AUTH} | grep "203.0.113.55"`, checks: [usesPipe, lines(countBoth(authLines, 'Accepted', '203.0.113.55'))] },
  ],

  // --- 2.2.4 cap output with head --------------------------------------------
  '2.2.4': [
    { id: '2.2.4-p1', prompt: 'Show the first 5 auth log lines mentioning sudo.', solution: `grep "sudo" ${AUTH} | head -n 5`, checks: [usesPipe, lines(5), outHas('sudo')] },
    { id: '2.2.4-p2', prompt: 'Show the first 10 auth log lines mentioning the nagios account.', solution: `grep "nagios" ${AUTH} | head -n 10`, checks: [usesPipe, lines(10)] },
    { id: '2.2.4-p3', prompt: 'Show the first 3 auth log lines mentioning CRON.', solution: `grep "CRON" ${AUTH} | head -n 3`, checks: [usesPipe, lines(3)] },
    { id: '2.2.4-p4', prompt: 'Show the first 8 system log lines mentioning nginx.', solution: `grep "nginx" ${SYS} | head -n 8`, checks: [usesPipe, lines(8)] },
    { id: '2.2.4-p5', prompt: 'Show the first 15 "Invalid user" lines from the auth log.', solution: `grep "Invalid user" ${AUTH} | head -n 15`, checks: [usesPipe, lines(15)] },
  ],

  // --- 2.3.1 ignore case -----------------------------------------------------
  '2.3.1': [
    { id: '2.3.1-p1', prompt: 'Find every system log line mentioning a warning, whatever its capitalisation.', solution: `grep -i "warning" ${SYS}`, checks: [hasFlag('grep', 'i'), lines(countIn(sysLines, 'warning', true))] },
    { id: '2.3.1-p2', prompt: 'Find every system log line mentioning a timeout, ignoring case.', solution: `grep -i "timeout" ${SYS}`, checks: [hasFlag('grep', 'i'), lines(countIn(sysLines, 'timeout', true))] },
    { id: '2.3.1-p3', prompt: 'Count auth log lines mentioning "failed" in any capitalisation.', solution: `grep -ci "failed" ${AUTH}`, checks: [hasFlag('grep', 'i'), numberIs(countIn(authLines, 'failed', true))] },
    { id: '2.3.1-p4', prompt: 'Find system log lines mentioning "denied", ignoring case.', solution: `grep -i "denied" ${SYS}`, checks: [hasFlag('grep', 'i'), lines(countIn(sysLines, 'denied', true))] },
    { id: '2.3.1-p5', prompt: 'Find system log lines mentioning "block", ignoring case.', solution: `grep -i "block" ${SYS}`, checks: [hasFlag('grep', 'i'), lines(countIn(sysLines, 'block', true))] },
  ],

  // --- 2.3.2 alternation with -E ---------------------------------------------
  '2.3.2': [
    { id: '2.3.2-p1', prompt: 'In one command, find system log lines about either nginx or postgres.', solution: `grep -E "nginx|postgres" ${SYS}`, checks: [hasFlag('grep', 'E'), lines(countRegex(sysLines, /nginx|postgres/))] },
    { id: '2.3.2-p2', prompt: 'In one command, find auth log lines containing either "Failed" or "Invalid".', solution: `grep -E "Failed|Invalid" ${AUTH}`, checks: [hasFlag('grep', 'E'), lines(countRegex(authLines, /Failed|Invalid/))] },
    { id: '2.3.2-p3', prompt: 'In one command, find system log lines mentioning cron or systemd, ignoring case.', solution: `grep -iE "cron|systemd" ${SYS}`, checks: [hasFlag('grep', 'E'), lines(countRegex(sysLines, /cron|systemd/i))] },
    { id: '2.3.2-p4', prompt: 'In one command, find auth log lines containing either "Accepted" or "opened".', solution: `grep -E "Accepted|opened" ${AUTH}`, checks: [hasFlag('grep', 'E'), lines(countRegex(authLines, /Accepted|opened/))] },
    { id: '2.3.2-p5', prompt: 'The firewall blocks show a destination port. Find system log lines mentioning port 445 or 3389.', solution: `grep -E "445|3389" ${SYS}`, checks: [hasFlag('grep', 'E'), lines(countRegex(sysLines, /445|3389/))] },
  ],

  // --- 2.3.3 search only the recent tail -------------------------------------
  '2.3.3': [
    { id: '2.3.3-p1', prompt: 'Search only the last 100 auth log lines for sshd activity.', solution: `tail -n 100 ${AUTH} | grep "sshd"`, checks: [usesPipe, lines(authLines.slice(-100).filter((l) => l.includes('sshd')).length)] },
    { id: '2.3.3-p2', prompt: 'Search only the last 30 system log lines for cron activity, ignoring case.', solution: `tail -n 30 ${SYS} | grep -i "cron"`, checks: [usesPipe, lines(sysLines.slice(-30).filter((l) => /cron/i.test(l)).length)] },
    { id: '2.3.3-p3', prompt: 'Search only the last 20 auth log lines for the word "Failed".', solution: `tail -n 20 ${AUTH} | grep "Failed"`, checks: [usesPipe, lines(authLines.slice(-20).filter((l) => l.includes('Failed')).length)] },
    { id: '2.3.3-p4', prompt: 'Search only the last 60 system log lines for nginx.', solution: `tail -n 60 ${SYS} | grep "nginx"`, checks: [usesPipe, lines(sysLines.slice(-60).filter((l) => l.includes('nginx')).length)] },
    { id: '2.3.3-p5', prompt: 'Search only the last 10 system log lines for systemd.', solution: `tail -n 10 ${SYS} | grep "systemd"`, checks: [usesPipe, lines(sysLines.slice(-10).filter((l) => l.includes('systemd')).length)] },
  ],

  // --- 2.4.1 extract with -o and reduce with sort -u -------------------------
  '2.4.1': [
    { id: '2.4.1-p1', prompt: 'List the unique IP addresses that appear anywhere in the system log.', solution: `grep -oE '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' ${SYS} | sort -u`, checks: [usesPipe, eachLineIsIp, lines(distinct(sysLines, IPV4))] },
    { id: '2.4.1-p2', prompt: 'List the unique IP addresses in the web server access log, /var/log/nginx/access.log.', solution: "grep -oE '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' /var/log/nginx/access.log | sort -u", checks: [usesPipe, eachLineIsIp, lines(distinct(fileLines('/var/log/nginx/access.log'), IPV4))] },
    { id: '2.4.1-p3', prompt: 'List the unique IP addresses that appear anywhere in the auth log, not just on sshd lines.', solution: `grep -oE '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' ${AUTH} | sort -u`, checks: [usesPipe, eachLineIsIp, lines(distinct(authLines, IPV4))] },
    { id: '2.4.1-p4', prompt: 'List the unique IP addresses in the web server error log, /var/log/nginx/error.log.', solution: "grep -oE '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' /var/log/nginx/error.log | sort -u", checks: [usesPipe, eachLineIsIp, lines(distinct(fileLines('/var/log/nginx/error.log'), IPV4))] },
    { id: '2.4.1-p5', prompt: 'List the unique IP addresses in yesterday\'s rotated log, /var/log/auth.log.1.', solution: "grep -oE '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' /var/log/auth.log.1 | sort -u", checks: [usesPipe, eachLineIsIp, lines(distinct(authOldLines, IPV4))] },
  ],

  // --- 2.4.2 capture a labelled field with \K --------------------------------
  '2.4.2': [
    { id: '2.4.2-p1', prompt: 'The failure lines record the source as "rhost=ADDRESS". List the distinct addresses.', solution: `grep -oP 'rhost=\\K[^ ]*' ${AUTH} | sort -u`, checks: [usesPipe, outLacks('rhost='), lines(distinct(authLines, /rhost=(\S+)/))] },
    { id: '2.4.2-p2', prompt: 'List the distinct values of the "euid=" field in the auth log.', solution: `grep -oP 'euid=\\K[^ ]*' ${AUTH} | sort -u`, checks: [outLacks('euid='), lines(distinct(authLines, /euid=(\S+)/))] },
    { id: '2.4.2-p3', prompt: 'The useradd line records the new account\'s numeric id as "UID=". Extract it.', solution: `grep -oP 'UID=\\K[^,]*' ${AUTH} | sort -u`, checks: [outLacks('UID='), lines(distinct(authLines, /\bUID=([^,\s]+)/))] },
    { id: '2.4.2-p4', prompt: 'Extract the distinct "GID=" values from the auth log.', solution: `grep -oP 'GID=\\K[^,]*' ${AUTH} | sort -u`, checks: [outLacks('GID='), lines(distinct(authLines, /\bGID=([^,\s]+)/))] },
    { id: '2.4.2-p5', prompt: 'List the distinct "rhost=" addresses in yesterday\'s log, /var/log/auth.log.1.', solution: "grep -oP 'rhost=\\K[^ ]*' /var/log/auth.log.1 | sort -u", checks: [usesPipe, outLacks('rhost='), lines(distinct(authOldLines, /rhost=(\S+)/))] },
  ],

  // --- 2.4.3 read events in order --------------------------------------------
  '2.4.3': [
    { id: '2.4.3-p1', prompt: 'Show the first 10 sudo events of the day, in order.', solution: `grep "sudo" ${AUTH} | head -n 10`, checks: [usesPipe, lines(10), outHas('sudo')] },
    { id: '2.4.3-p2', prompt: 'Show the earliest 3 successful logins.', solution: `grep "Accepted" ${AUTH} | head -n 3`, checks: [usesPipe, lines(3), outHas('Accepted')] },
    { id: '2.4.3-p3', prompt: 'Show the first 12 system log lines mentioning systemd, in order.', solution: `grep "systemd" ${SYS} | head -n 12`, checks: [usesPipe, lines(12)] },
    { id: '2.4.3-p4', prompt: 'Show the first 6 CRON entries in the system log.', solution: `grep "CRON" ${SYS} | head -n 6`, checks: [usesPipe, lines(6)] },
    { id: '2.4.3-p5', prompt: 'Show the LAST 5 sudo events of the day instead of the first.', solution: `grep "sudo" ${AUTH} | tail -n 5`, checks: [usesPipe, lines(5), outHas('sudo')] },
  ],

  // --- 2.4.4 corroborate across files ----------------------------------------
  '2.4.4': [
    { id: '2.4.4-p1', prompt: 'Search both the auth log and the system log for the account "sysmon".', solution: `grep "sysmon" ${AUTH} ${SYS}`, checks: [outHas(`${AUTH}:`), outHas(`${SYS}:`), outHas('sysmon')] },
    { id: '2.4.4-p2', prompt: 'Search both logs for anything mentioning postgres.', solution: `grep "postgres" ${AUTH} ${SYS}`, checks: [outHas(`${AUTH}:`), outHas(`${SYS}:`)] },
    { id: '2.4.4-p3', prompt: 'Search both logs for the word "session".', solution: `grep "session" ${AUTH} ${SYS}`, checks: [outHas(`${AUTH}:`), outHas(`${SYS}:`)] },
    { id: '2.4.4-p4', prompt: 'Search both logs for the word "root".', solution: `grep "root" ${AUTH} ${SYS}`, checks: [outHas(`${AUTH}:`), outHas(`${SYS}:`)] },
    { id: '2.4.4-p5', prompt: 'Search today\'s and yesterday\'s auth logs together for "Accepted".', solution: `grep "Accepted" ${AUTH} /var/log/auth.log.1`, checks: [outHas(`${AUTH}:`), outHas('/var/log/auth.log.1:')] },
  ],
};
