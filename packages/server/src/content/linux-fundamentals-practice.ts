/**
 * Practice drills for Linux Fundamentals: five per exercise, 200 in total.
 *
 * Kept in their own file so the main curriculum stays readable.
 *
 * DESIGN RULES
 *
 * - Same skill, different target. A drill never introduces a new command, so
 *   "more practice" is always practice rather than a surprise exam.
 * - Graded on outcome wherever possible, exactly like the parent exercise.
 * - Optional. Drills never gate progression and never move the completion
 *   percentage, so a student can take five or none without penalty.
 * - Targets are drawn from the real seeded world, so repetition doubles as
 *   familiarity with the host they will later investigate.
 */

import type { Check, PracticeItem } from '@soc/shared';

import { AUTH_LOG, SYSLOG } from '../vfs/data/generated.js';
import { BASE_IMAGE } from '../vfs/image.js';

const authLines = AUTH_LOG.split('\n');
const sysLines = SYSLOG.split('\n');

/**
 * Read straight from the seeded filesystem so the expected answer can never
 * disagree with the file the student is being asked to count.
 */
function baseFileLines(path: string): number {
  const content = BASE_IMAGE.get(path)?.content ?? '';
  return content.split('\n').filter((line) => line !== '').length;
}

const PASSWD_ACCOUNT_COUNT = baseFileLines('/etc/passwd');

function countIn(lines: string[], needle: string, caseInsensitive = false): number {
  const target = caseInsensitive ? needle.toLowerCase() : needle;
  return lines.filter((line) => (caseInsensitive ? line.toLowerCase() : line).includes(target)).length;
}

const HOME = '/home/student';

/** Shorthand builders, so each drill below stays one readable line. */
const atCwd = (path: string): Check => ({
  type: 'cwd-equals',
  path,
  hint: `You should end up in ${path}.`,
});

const outHas = (text: string): Check => ({
  type: 'output-contains',
  text,
  hint: `The output should include "${text}".`,
});

const exists = (path: string, kind: 'file' | 'dir' = 'file'): Check => ({
  type: 'fs-exists',
  path,
  exists: true,
  kind,
  hint: `${path} should exist afterwards.`,
});

const gone = (path: string): Check => ({
  type: 'fs-exists',
  path,
  exists: false,
  hint: `${path} should no longer exist.`,
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

export const LINUX_FUNDAMENTALS_PRACTICE: Record<string, PracticeItem[]> = {
  // --- 1.1.1 pwd -------------------------------------------------------------
  'linux.1.1': [
    { id: 'linux.1.1-p1', setup: ['cd /etc'], prompt: 'You have been moved somewhere. Print your working directory.', solution: 'pwd', checks: [outHas('/etc')] },
    { id: 'linux.1.1-p2', setup: ['cd /var/log'], prompt: 'Where are you now? Print it.', solution: 'pwd', checks: [outHas('/var/log')] },
    { id: 'linux.1.1-p3', setup: ['cd /var/www/portal'], prompt: 'Confirm your location.', solution: 'pwd', checks: [outHas('/var/www/portal')] },
    { id: 'linux.1.1-p4', setup: ['cd /usr/bin'], prompt: 'Print the directory you are sitting in.', solution: 'pwd', checks: [outHas('/usr/bin')] },
    { id: 'linux.1.1-p5', setup: ['cd /tmp/.cache'], prompt: 'You have been dropped into a hidden directory. Which one?', solution: 'pwd', checks: [outHas('/tmp/.cache')] },
  ],

  // --- 1.1.2 ls --------------------------------------------------------------
  'linux.1.2': [
    { id: 'linux.1.2-p1', prompt: 'List the contents of /etc without moving there.', solution: 'ls /etc', checks: [outHas('passwd'), outHas('hostname')] },
    { id: 'linux.1.2-p2', prompt: 'List the contents of /var/log.', solution: 'ls /var/log', checks: [outHas('auth.log'), outHas('syslog')] },
    { id: 'linux.1.2-p3', prompt: 'List every home directory on this server. They live under /home.', solution: 'ls /home', checks: [outHas('student'), outHas('testuser')] },
    { id: 'linux.1.2-p4', prompt: 'List what is inside /var/www/portal.', solution: 'ls /var/www/portal', checks: [outHas('exports')] },
    { id: 'linux.1.2-p5', prompt: 'List the contents of /tmp.', solution: 'ls /tmp', checks: [outHas('portal-debug.log')] },
  ],

  // --- 1.1.3 ls -la ----------------------------------------------------------
  'linux.1.3': [
    { id: 'linux.1.3-p1', prompt: 'Show a long listing of /var/log, including permissions and sizes.', solution: 'ls -l /var/log', checks: [hasFlag('ls', 'l'), outHas('auth.log')] },
    { id: 'linux.1.3-p2', prompt: 'Show everything in /tmp including hidden entries, in long format. There is a hidden directory in there.', solution: 'ls -la /tmp', checks: [hasFlag('ls', 'l'), hasFlag('ls', 'a'), outHas('.cache')] },
    { id: 'linux.1.3-p3', prompt: 'List /var/log in long format with human-readable file sizes.', solution: 'ls -lh /var/log', checks: [hasFlag('ls', 'l'), hasFlag('ls', 'h')] },
    { id: 'linux.1.3-p4', prompt: "Show the hidden files in the compromised account's home directory, /home/testuser, in long format.", solution: 'ls -la /home/testuser', checks: [hasFlag('ls', 'a'), outHas('.bash_history')] },
    { id: 'linux.1.3-p5', prompt: 'List /var/log in long format sorted by modification time, newest first.', solution: 'ls -lt /var/log', checks: [hasFlag('ls', 'l'), hasFlag('ls', 't')] },
  ],

  // --- 1.1.4 cd absolute -----------------------------------------------------
  'linux.1.4': [
    { id: 'linux.1.4-p1', prompt: 'Navigate to /etc/ssh, where the SSH server configuration lives.', solution: 'cd /etc/ssh', checks: [atCwd('/etc/ssh')] },
    { id: 'linux.1.4-p2', prompt: 'Navigate to /var/log.', solution: 'cd /var/log', checks: [atCwd('/var/log')] },
    { id: 'linux.1.4-p3', prompt: 'Navigate to the web root at /var/www/portal.', solution: 'cd /var/www/portal', checks: [atCwd('/var/www/portal')] },
    { id: 'linux.1.4-p4', prompt: 'Navigate to /tmp.', solution: 'cd /tmp', checks: [atCwd('/tmp')] },
    { id: 'linux.1.4-p5', prompt: 'Navigate to /usr/bin, where most commands actually live.', solution: 'cd /usr/bin', checks: [atCwd('/usr/bin')] },
  ],

  // --- 1.1.5 the ~ shortcut --------------------------------------------------
  'linux.1.5': [
    { id: 'linux.1.5-p1', setup: ['cd /var/log'], prompt: 'Get back to your home directory using the tilde shortcut.', solution: 'cd ~', checks: [atCwd(HOME)] },
    { id: 'linux.1.5-p2', setup: ['cd /etc'], prompt: 'Move into your Documents folder using a tilde path, without typing /home.', solution: 'cd ~/Documents', checks: [atCwd(`${HOME}/Documents`)] },
    { id: 'linux.1.5-p3', setup: ['cd /usr/bin'], prompt: 'List your home directory using the tilde shortcut, without moving there.', solution: 'ls ~', checks: [outHas('notes.txt'), atCwd('/usr/bin')] },
    { id: 'linux.1.5-p4', setup: ['cd /tmp'], prompt: 'Read the file notes.txt in your home directory using a tilde path.', solution: 'cat ~/notes.txt', checks: [outHas('SOC onboarding')] },
    { id: 'linux.1.5-p5', setup: ['cd /var'], prompt: 'Move into your Downloads folder using a tilde path.', solution: 'cd ~/Downloads', checks: [atCwd(`${HOME}/Downloads`)] },
  ],

  // --- 1.1.6 cd .. -----------------------------------------------------------
  'linux.1.6': [
    { id: 'linux.1.6-p1', setup: ['cd /etc/ssh'], prompt: 'Move up one level from /etc/ssh.', solution: 'cd ..', checks: [atCwd('/etc')] },
    { id: 'linux.1.6-p2', setup: ['cd /var/www/portal'], prompt: 'Move up one level.', solution: 'cd ..', checks: [atCwd('/var/www')] },
    { id: 'linux.1.6-p3', setup: ['cd /var/www/portal/exports'], prompt: 'Move up TWO levels in a single command, to /var/www.', solution: 'cd ../..', checks: [atCwd('/var/www')] },
    { id: 'linux.1.6-p4', setup: ['cd /home/student/Documents'], prompt: 'Move up one level, back to your home directory.', solution: 'cd ..', checks: [atCwd(HOME)] },
    { id: 'linux.1.6-p5', setup: ['cd /tmp/.cache'], prompt: 'List the parent directory without moving out of /tmp/.cache.', solution: 'ls ..', checks: [outHas('portal-debug.log'), atCwd('/tmp/.cache')] },
  ],

  // --- 1.2.1 touch -----------------------------------------------------------
  'linux.2.1': [
    { id: 'linux.2.1-p1', prompt: 'Create an empty file called findings.txt in your home directory.', solution: 'touch findings.txt', checks: [exists(`${HOME}/findings.txt`)] },
    { id: 'linux.2.1-p2', prompt: 'Create an empty file called timeline.md.', solution: 'touch timeline.md', checks: [exists(`${HOME}/timeline.md`)] },
    { id: 'linux.2.1-p3', prompt: 'Create a file called scratch.txt inside your Documents folder.', solution: 'touch Documents/scratch.txt', checks: [exists(`${HOME}/Documents/scratch.txt`)] },
    { id: 'linux.2.1-p4', prompt: 'Create two files at once, called a.txt and b.txt. touch accepts several names.', solution: 'touch a.txt b.txt', checks: [exists(`${HOME}/a.txt`), exists(`${HOME}/b.txt`)] },
    { id: 'linux.2.1-p5', prompt: 'Create a file called shift-notes.txt in /tmp.', solution: 'touch /tmp/shift-notes.txt', checks: [exists('/tmp/shift-notes.txt')] },
  ],

  // --- 1.2.2 mkdir -----------------------------------------------------------
  'linux.2.2': [
    { id: 'linux.2.2-p1', prompt: 'Create a directory called evidence in your home directory.', solution: 'mkdir evidence', checks: [exists(`${HOME}/evidence`, 'dir')] },
    { id: 'linux.2.2-p2', prompt: 'Create a directory called incident-4417.', solution: 'mkdir incident-4417', checks: [exists(`${HOME}/incident-4417`, 'dir')] },
    { id: 'linux.2.2-p3', prompt: 'Create the nested path case/2026/august in one command. You will need the option that makes parent directories.', solution: 'mkdir -p case/2026/august', checks: [exists(`${HOME}/case/2026/august`, 'dir')] },
    { id: 'linux.2.2-p4', prompt: 'Create a directory called notes inside your Documents folder.', solution: 'mkdir Documents/notes', checks: [exists(`${HOME}/Documents/notes`, 'dir')] },
    { id: 'linux.2.2-p5', prompt: 'Create two directories at once, called in and out.', solution: 'mkdir in out', checks: [exists(`${HOME}/in`, 'dir'), exists(`${HOME}/out`, 'dir')] },
  ],

  // --- 1.2.3 cp --------------------------------------------------------------
  'linux.2.3': [
    { id: 'linux.2.3-p1', prompt: 'Copy your notes.txt to notes-backup.txt.', solution: 'cp notes.txt notes-backup.txt', checks: [exists(`${HOME}/notes-backup.txt`), exists(`${HOME}/notes.txt`)] },
    { id: 'linux.2.3-p2', prompt: 'Copy /etc/hostname into your home directory, keeping the name.', solution: 'cp /etc/hostname .', checks: [exists(`${HOME}/hostname`)] },
    { id: 'linux.2.3-p3', setup: ['mkdir -p evidence'], prompt: 'Copy /etc/passwd into your evidence directory. Preserving a copy before you analyse it is standard practice.', solution: 'cp /etc/passwd evidence/', checks: [exists(`${HOME}/evidence/passwd`)] },
    { id: 'linux.2.3-p4', prompt: 'Copy /etc/resolv.conf to your home directory under the name dns-config.txt.', solution: 'cp /etc/resolv.conf dns-config.txt', checks: [exists(`${HOME}/dns-config.txt`)] },
    { id: 'linux.2.3-p5', setup: ['mkdir -p archive'], prompt: 'Copy your whole Documents directory into archive. Copying a directory needs an extra option.', solution: 'cp -r Documents archive/', checks: [exists(`${HOME}/archive/Documents`, 'dir')] },
  ],

  // --- 1.2.4 mv --------------------------------------------------------------
  'linux.2.4': [
    { id: 'linux.2.4-p1', setup: ['touch draft.txt'], prompt: 'Rename draft.txt to report.txt.', solution: 'mv draft.txt report.txt', checks: [exists(`${HOME}/report.txt`), gone(`${HOME}/draft.txt`)] },
    { id: 'linux.2.4-p2', setup: ['touch scratch.log'], prompt: 'Rename scratch.log to incident.log.', solution: 'mv scratch.log incident.log', checks: [exists(`${HOME}/incident.log`), gone(`${HOME}/scratch.log`)] },
    { id: 'linux.2.4-p3', setup: ['touch evidence.txt', 'mkdir -p case'], prompt: 'Move evidence.txt into the case directory, keeping its name.', solution: 'mv evidence.txt case/', checks: [exists(`${HOME}/case/evidence.txt`), gone(`${HOME}/evidence.txt`)] },
    { id: 'linux.2.4-p4', setup: ['touch old.txt'], prompt: 'Move old.txt into /tmp.', solution: 'mv old.txt /tmp/', checks: [exists('/tmp/old.txt'), gone(`${HOME}/old.txt`)] },
    { id: 'linux.2.4-p5', setup: ['mkdir -p wip'], prompt: 'Rename the directory wip to in-progress. mv renames directories too.', solution: 'mv wip in-progress', checks: [exists(`${HOME}/in-progress`, 'dir'), gone(`${HOME}/wip`)] },
  ],

  // --- 1.2.5 rm --------------------------------------------------------------
  'linux.2.5': [
    { id: 'linux.2.5-p1', setup: ['touch junk.txt'], prompt: 'Delete junk.txt.', solution: 'rm junk.txt', checks: [gone(`${HOME}/junk.txt`)] },
    { id: 'linux.2.5-p2', setup: ['touch a.tmp', 'touch b.tmp'], prompt: 'Delete both a.tmp and b.tmp in a single command.', solution: 'rm a.tmp b.tmp', checks: [gone(`${HOME}/a.tmp`), gone(`${HOME}/b.tmp`)] },
    { id: 'linux.2.5-p3', setup: ['touch old.log'], prompt: 'Delete old.log from your home directory.', solution: 'rm old.log', checks: [gone(`${HOME}/old.log`)] },
    { id: 'linux.2.5-p4', setup: ['mkdir -p stale', 'touch stale/one.txt'], prompt: 'Delete the stale directory and everything inside it. This needs the recursive option, so read your command back before you run it.', solution: 'rm -r stale', checks: [gone(`${HOME}/stale`)] },
    { id: 'linux.2.5-p5', setup: ['touch x1.tmp', 'touch x2.tmp', 'touch keep.txt'], prompt: 'Delete every file ending in .tmp using a wildcard, and leave keep.txt alone.', solution: 'rm *.tmp', checks: [gone(`${HOME}/x1.tmp`), gone(`${HOME}/x2.tmp`), exists(`${HOME}/keep.txt`)] },
  ],

  // --- 1.2.6 rmdir -----------------------------------------------------------
  'linux.2.6': [
    { id: 'linux.2.6-p1', setup: ['mkdir -p tmpdir'], prompt: 'Remove the empty directory tmpdir.', solution: 'rmdir tmpdir', checks: [gone(`${HOME}/tmpdir`)] },
    { id: 'linux.2.6-p2', setup: ['mkdir -p spare'], prompt: 'Remove the empty directory spare.', solution: 'rmdir spare', checks: [gone(`${HOME}/spare`)] },
    { id: 'linux.2.6-p3', setup: ['mkdir -p one', 'mkdir -p two'], prompt: 'Remove both empty directories one and two in a single command.', solution: 'rmdir one two', checks: [gone(`${HOME}/one`), gone(`${HOME}/two`)] },
    { id: 'linux.2.6-p4', setup: ['mkdir -p full', 'touch full/file.txt'], prompt: 'Try to remove the directory "full" with rmdir. It contains a file, so rmdir will refuse -- read the error, then remove the file first and try again.', solution: 'rm full/file.txt\nrmdir full', checks: [gone(`${HOME}/full`)] },
    { id: 'linux.2.6-p5', setup: ['mkdir -p a/b'], prompt: 'Remove the empty directory a/b, leaving a in place.', solution: 'rmdir a/b', checks: [gone(`${HOME}/a/b`), exists(`${HOME}/a`, 'dir')] },
  ],

  // --- 1.3.1 cat -------------------------------------------------------------
  'linux.3.1': [
    { id: 'linux.3.1-p1', prompt: 'Print the contents of /etc/resolv.conf to see which DNS servers this host uses.', solution: 'cat /etc/resolv.conf', checks: [outHas('nameserver')] },
    { id: 'linux.3.1-p2', prompt: 'Print /etc/os-release to find out which Linux distribution this is.', solution: 'cat /etc/os-release', checks: [outHas('Ubuntu')] },
    { id: 'linux.3.1-p3', prompt: 'Print /etc/crontab to see what runs on a schedule.', solution: 'cat /etc/crontab', checks: [outHas('run-parts')] },
    { id: 'linux.3.1-p4', prompt: 'Print your own notes.txt.', solution: 'cat notes.txt', checks: [outHas('SOC onboarding')] },
    { id: 'linux.3.1-p5', prompt: 'Try to read /etc/shadow, which stores password hashes. You will be refused -- read the error carefully, because that refusal is the system working correctly.', solution: 'cat /etc/shadow', checks: [outHas('Permission denied')] },
  ],

  // --- 1.3.2 less ------------------------------------------------------------
  'linux.3.2': [
    { id: 'linux.3.2-p1', prompt: 'Open /var/log/auth.log in the pager.', solution: 'less /var/log/auth.log', checks: [outHas('rmg-web-02')] },
    { id: 'linux.3.2-p2', prompt: 'Open /etc/ssh/sshd_config in the pager.', solution: 'less /etc/ssh/sshd_config', checks: [outHas('Port 22')] },
    { id: 'linux.3.2-p3', prompt: 'Open /var/log/nginx/access.log in the pager.', solution: 'less /var/log/nginx/access.log', checks: [outHas('GET')] },
    { id: 'linux.3.2-p4', prompt: 'Open /etc/passwd in the pager to see every account on the host.', solution: 'less /etc/passwd', checks: [outHas('root:x:0:0')] },
    { id: 'linux.3.2-p5', prompt: 'Open /var/log/syslog in the pager, then compare: how much more useful would a grep have been?', solution: 'less /var/log/syslog', checks: [outHas('systemd')] },
  ],

  // --- 1.3.3 head ------------------------------------------------------------
  'linux.3.3': [
    { id: 'linux.3.3-p1', prompt: 'Show the first 5 lines of /etc/passwd.', solution: 'head -n 5 /etc/passwd', checks: [lines(5)] },
    { id: 'linux.3.3-p2', prompt: 'Show the first 3 lines of /var/log/syslog.', solution: 'head -n 3 /var/log/syslog', checks: [lines(3)] },
    { id: 'linux.3.3-p3', prompt: 'Show the first 20 lines of /var/log/auth.log.', solution: 'head -n 20 /var/log/auth.log', checks: [lines(20)] },
    { id: 'linux.3.3-p4', prompt: 'Show the first 10 lines of /var/log/nginx/access.log using head with no options at all.', solution: 'head /var/log/nginx/access.log', checks: [outHas('GET')] },
    { id: 'linux.3.3-p5', prompt: 'Show the first 2 lines of /etc/crontab.', solution: 'head -n 2 /etc/crontab', checks: [lines(2)] },
  ],

  // --- 1.3.4 tail ------------------------------------------------------------
  'linux.3.4': [
    { id: 'linux.3.4-p1', prompt: 'Show the last 10 lines of /var/log/syslog.', solution: 'tail -n 10 /var/log/syslog', checks: [lines(10)] },
    { id: 'linux.3.4-p2', prompt: 'Show the last 3 lines of /var/log/auth.log -- the most recent authentication events on this host.', solution: 'tail -n 3 /var/log/auth.log', checks: [lines(3)] },
    { id: 'linux.3.4-p3', prompt: 'Show the last 20 lines of /var/log/syslog.', solution: 'tail -n 20 /var/log/syslog', checks: [lines(20)] },
    { id: 'linux.3.4-p4', prompt: 'Show the last 5 lines of /etc/passwd. Notice which accounts appear at the bottom of that file.', solution: 'tail -n 5 /etc/passwd', checks: [lines(5)] },
    { id: 'linux.3.4-p5', prompt: 'Show the last 2 lines of /var/log/nginx/error.log.', solution: 'tail -n 2 /var/log/nginx/error.log', checks: [lines(2)] },
  ],

  // --- 1.4.1 grep ------------------------------------------------------------
  'linux.4.1': [
    { id: 'linux.4.1-p1', prompt: 'Find every line in /var/log/auth.log containing "Accepted" -- the logins that actually succeeded.', solution: 'grep "Accepted" /var/log/auth.log', checks: [outHas('Accepted'), { type: 'output-excludes', text: 'Failed password', hint: 'Only matching lines should appear.' }] },
    { id: 'linux.4.1-p2', prompt: 'Find every line in /etc/passwd containing "bash", showing which accounts have a real login shell.', solution: 'grep "bash" /etc/passwd', checks: [outHas('/bin/bash')] },
    { id: 'linux.4.1-p3', prompt: 'Find every line in /var/log/auth.log mentioning the account "testuser".', solution: 'grep "testuser" /var/log/auth.log', checks: [outHas('testuser')] },
    { id: 'linux.4.1-p4', prompt: 'Search /var/log/syslog for lines containing "nginx".', solution: 'grep "nginx" /var/log/syslog', checks: [outHas('nginx')] },
    { id: 'linux.4.1-p5', prompt: 'Search /var/log/auth.log for the address 203.0.113.55. Take a moment to notice how much of the file it appears in.', solution: 'grep "203.0.113.55" /var/log/auth.log', checks: [outHas('203.0.113.55')] },
  ],

  // --- 1.4.2 grep -i ---------------------------------------------------------
  'linux.4.2': [
    { id: 'linux.4.2-p1', prompt: 'Search /var/log/syslog for "error" in any case.', solution: 'grep -i "error" /var/log/syslog', checks: [hasFlag('grep', 'i'), outHas('rror')] },
    { id: 'linux.4.2-p2', prompt: 'Search /var/log/auth.log for "invalid" in any case. Both "Invalid" and "invalid" appear in that file.', solution: 'grep -i "invalid" /var/log/auth.log', checks: [hasFlag('grep', 'i'), outHas('nvalid')] },
    { id: 'linux.4.2-p3', prompt: 'Search /var/log/syslog for "warning" in any case.', solution: 'grep -i "warning" /var/log/syslog', checks: [hasFlag('grep', 'i'), outHas('WARNING')] },
    { id: 'linux.4.2-p4', prompt: 'Search /etc/ssh/sshd_config for "password" in any case.', solution: 'grep -i "password" /etc/ssh/sshd_config', checks: [hasFlag('grep', 'i'), outHas('assword')] },
    { id: 'linux.4.2-p5', prompt: 'Search /var/log/syslog for "session" in any case.', solution: 'grep -i "session" /var/log/syslog', checks: [hasFlag('grep', 'i'), outHas('ession')] },
  ],

  // --- 1.4.3 grep -c ---------------------------------------------------------
  'linux.4.3': [
    { id: 'linux.4.3-p1', prompt: 'Count how many lines of /var/log/auth.log contain "Accepted".', solution: 'grep -c "Accepted" /var/log/auth.log', checks: [numberIs(countIn(authLines, 'Accepted'))] },
    { id: 'linux.4.3-p2', prompt: 'Count how many lines of /var/log/auth.log contain "Failed password".', solution: 'grep -c "Failed password" /var/log/auth.log', checks: [numberIs(countIn(authLines, 'Failed password'))] },
    { id: 'linux.4.3-p3', prompt: 'Count how many lines of /var/log/auth.log mention the address 203.0.113.55.', solution: 'grep -c "203.0.113.55" /var/log/auth.log', checks: [numberIs(countIn(authLines, '203.0.113.55'))] },
    { id: 'linux.4.3-p4', prompt: 'Count how many lines of /var/log/auth.log mention the internal monitoring host 10.20.9.40. Compare that number to the previous drill before you decide which one is the attack.', solution: 'grep -c "10.20.9.40" /var/log/auth.log', checks: [numberIs(countIn(authLines, '10.20.9.40'))] },
    { id: 'linux.4.3-p5', prompt: 'Count how many lines of /var/log/syslog contain "CRON".', solution: 'grep -c "CRON" /var/log/syslog', checks: [numberIs(countIn(sysLines, 'CRON'))] },
  ],

  // --- 1.4.4 grep -n ---------------------------------------------------------
  'linux.4.4': [
    { id: 'linux.4.4-p1', prompt: 'Find every "Accepted" line in /var/log/auth.log with its line number.', solution: 'grep -n "Accepted" /var/log/auth.log', checks: [hasFlag('grep', 'n'), { type: 'output-matches', pattern: '^\\d+:', flags: 'm', hint: 'Each line should start with a number and a colon.' }] },
    { id: 'linux.4.4-p2', prompt: 'Find every line mentioning "useradd" in /var/log/auth.log, with line numbers. This is how an account gets created.', solution: 'grep -n "useradd" /var/log/auth.log', checks: [hasFlag('grep', 'n'), outHas('new user')] },
    { id: 'linux.4.4-p3', prompt: 'Find "root" in /etc/passwd with its line number.', solution: 'grep -n "root" /etc/passwd', checks: [hasFlag('grep', 'n'), outHas('root')] },
    { id: 'linux.4.4-p4', prompt: 'Find every line mentioning "sysmon" in /var/log/auth.log, with line numbers.', solution: 'grep -n "sysmon" /var/log/auth.log', checks: [hasFlag('grep', 'n'), outHas('sysmon')] },
    { id: 'linux.4.4-p5', prompt: 'Find lines containing "postgresql" in /var/log/syslog, with line numbers.', solution: 'grep -n "postgresql" /var/log/syslog', checks: [hasFlag('grep', 'n'), outHas('postgresql')] },
  ],

  // --- 1.4.5 pipes -----------------------------------------------------------
  'linux.4.5': [
    { id: 'linux.4.5-p1', prompt: 'Using a pipe, count how many accounts exist in /etc/passwd.', solution: 'cat /etc/passwd | wc -l', checks: [{ type: 'command-uses-pipe', hint: 'Use the | character.' }, numberIs(PASSWD_ACCOUNT_COUNT)] },
    { id: 'linux.4.5-p2', prompt: 'Using a pipe, count how many lines of /var/log/auth.log contain "Accepted".', solution: 'grep "Accepted" /var/log/auth.log | wc -l', checks: [{ type: 'command-uses-pipe', hint: 'Use the | character.' }, numberIs(countIn(authLines, 'Accepted'))] },
    { id: 'linux.4.5-p3', prompt: 'Using a pipe, count how many accounts in /etc/passwd use the bash shell.', solution: 'grep "/bin/bash" /etc/passwd | wc -l', checks: [{ type: 'command-uses-pipe', hint: 'Use the | character.' }] },
    { id: 'linux.4.5-p4', prompt: 'Using a pipe, count how many lines of /var/log/syslog mention "nginx".', solution: 'grep "nginx" /var/log/syslog | wc -l', checks: [{ type: 'command-uses-pipe', hint: 'Use the | character.' }, numberIs(countIn(sysLines, 'nginx'))] },
    { id: 'linux.4.5-p5', prompt: 'Chain THREE commands: take the last 100 lines of /var/log/auth.log, keep only the ones mentioning sshd, and count them.', solution: 'tail -n 100 /var/log/auth.log | grep "sshd" | wc -l', checks: [{ type: 'command-uses-pipe', hint: 'You need two pipes for three commands.' }, { type: 'output-numeric', min: 0, hint: 'The result should be a single number.' }] },
  ],

  // --- 1.4.6 wildcards -------------------------------------------------------
  'linux.4.6': [
    { id: 'linux.4.6-p1', prompt: 'List every file in /var/log ending in .log, using a wildcard.', solution: 'ls /var/log/*.log', checks: [outHas('auth.log'), outHas('kern.log')] },
    { id: 'linux.4.6-p2', prompt: 'Search every .log file in /var/log for "sshd".', solution: 'grep "sshd" /var/log/*.log', checks: [{ type: 'command-matches', anyOf: ['\\*\\.log'], regex: true, hint: 'Use the *.log wildcard.' }, outHas('sshd')] },
    { id: 'linux.4.6-p3', prompt: 'Search every .log file in /var/log for "Failed".', solution: 'grep "Failed" /var/log/*.log', checks: [{ type: 'command-matches', anyOf: ['\\*\\.log'], regex: true, hint: 'Use the *.log wildcard.' }, outHas('Failed')] },
    { id: 'linux.4.6-p4', prompt: 'Search every .log file in /var/log for "cron", ignoring case.', solution: 'grep -i "cron" /var/log/*.log', checks: [hasFlag('grep', 'i'), { type: 'command-matches', anyOf: ['\\*\\.log'], regex: true, hint: 'Use the *.log wildcard.' }] },
    { id: 'linux.4.6-p5', prompt: 'List every file in /etc starting with "host", using a wildcard.', solution: 'ls /etc/host*', checks: [outHas('hostname'), outHas('hosts')] },
  ],

  // --- 1.5.1 reading permissions ---------------------------------------------
  'linux.5.1': [
    { id: 'linux.5.1-p1', prompt: 'Show the detailed listing for /etc/passwd and compare its permissions to the shadow file.', solution: 'ls -l /etc/passwd', checks: [outHas('rw-r--r--')] },
    { id: 'linux.5.1-p2', prompt: 'Show the detailed listing for the SSH daemon configuration, /etc/ssh/sshd_config.', solution: 'ls -l /etc/ssh/sshd_config', checks: [outHas('sshd_config')] },
    { id: 'linux.5.1-p3', prompt: 'Show the permissions on your own home directory.', solution: 'ls -ld /home/student', checks: [outHas('student')] },
    { id: 'linux.5.1-p4', prompt: 'Show the detailed listing for the crontab file /etc/crontab.', solution: 'ls -l /etc/crontab', checks: [outHas('crontab')] },
    { id: 'linux.5.1-p5', prompt: 'Show the permissions on the backup script in /usr/local/bin.', solution: 'ls -l /usr/local/bin/rmg-backup.sh', checks: [outHas('rmg-backup.sh')] },
  ],

  // --- 1.5.2 setuid ----------------------------------------------------------
  'linux.5.2': [
    { id: 'linux.5.2-p1', prompt: 'Count how many setuid binaries there are under /usr/bin.', solution: 'find /usr/bin -perm -4000 | wc -l', checks: [numberIs(9)] },
    { id: 'linux.5.2-p2', prompt: 'Search /usr/sbin for setuid binaries, and see that there are none.', solution: 'find /usr/sbin -perm -4000', checks: [{ type: 'output-excludes', text: '/usr/sbin/', hint: 'Nothing in /usr/sbin is setuid on this host.' }] },
    { id: 'linux.5.2-p3', prompt: 'Using a pipe, show only the setuid binaries whose name contains "pass".', solution: 'find /usr/bin -perm -4000 | grep pass', checks: [outHas('/usr/bin/passwd')] },
    { id: 'linux.5.2-p4', prompt: 'Show the detailed listing of /usr/bin/sudo so you can see the s in the permission string.', solution: 'ls -l /usr/bin/sudo', checks: [outHas('sudo')] },
    { id: 'linux.5.2-p5', prompt: 'Search the whole of /usr for setuid binaries.', solution: 'find /usr -perm -4000', checks: [outHas('/usr/bin/su')] },
  ],

  // --- 1.5.3 world-writable --------------------------------------------------
  'linux.5.3': [
    { id: 'linux.5.3-p1', prompt: 'Count the world-writable regular files under /tmp.', solution: 'find /tmp -type f -perm -002 | wc -l', checks: [numberIs(3)] },
    { id: 'linux.5.3-p2', prompt: 'Search /etc for world-writable files, which should find nothing.', solution: 'find /etc -type f -perm -002', checks: [{ type: 'output-excludes', text: '/etc/', hint: 'Nothing in /etc should be world-writable.' }] },
    { id: 'linux.5.3-p3', prompt: 'Search /home for world-writable regular files.', solution: 'find /home -type f -perm -002', checks: [{ type: 'output-excludes', text: '/home/student/.bashrc', hint: 'Your own dotfiles are not world-writable.' }] },
    { id: 'linux.5.3-p4', prompt: 'Using a pipe, show only the world-writable file in /tmp whose name ends in .gz.', solution: 'find /tmp -type f -perm -002 | grep gz', checks: [outHas('pt.tar.gz')] },
    { id: 'linux.5.3-p5', prompt: 'List /tmp in long form, including hidden entries, and look at the permission column.', solution: 'ls -la /tmp', checks: [outHas('.cache')] },
  ],

  // --- 1.5.4 chmod -----------------------------------------------------------
  'linux.5.4': [
    { id: 'linux.5.4-p1', prompt: 'Create a file called drill-a.txt and give it the usual document permissions, 644.', solution: 'touch drill-a.txt\nchmod 644 drill-a.txt\nls -l drill-a.txt', checks: [exists('/home/student/drill-a.txt'), outHas('rw-r--r--')] },
    { id: 'linux.5.4-p2', prompt: 'Create a file called drill-b.sh and make it executable by everyone, 755.', solution: 'touch drill-b.sh\nchmod 755 drill-b.sh\nls -l drill-b.sh', checks: [exists('/home/student/drill-b.sh'), outHas('rwxr-xr-x')] },
    { id: 'linux.5.4-p3', prompt: 'Create a file called drill-c.txt and make it readable by nobody at all except its owner, read only: 400.', solution: 'touch drill-c.txt\nchmod 400 drill-c.txt\nls -l drill-c.txt', checks: [exists('/home/student/drill-c.txt'), outHas('r--------')] },
    { id: 'linux.5.4-p4', prompt: 'Create a directory called drill-dir and set it to 700 so only you may enter it.', solution: 'mkdir drill-dir\nchmod 700 drill-dir\nls -ld drill-dir', checks: [exists('/home/student/drill-dir', 'dir'), outHas('rwx------')] },
    { id: 'linux.5.4-p5', prompt: 'Create a file called drill-e.txt, set it to 600, then confirm the mode with stat rather than ls.', solution: 'touch drill-e.txt\nchmod 600 drill-e.txt\nstat drill-e.txt', checks: [exists('/home/student/drill-e.txt'), outHas('0600')] },
  ],

  // --- 1.5.5 ownership -------------------------------------------------------
  'linux.5.5': [
    { id: 'linux.5.5-p1', prompt: 'List the home directories one per line, so each account is on its own row.', solution: 'ls -1 /home', checks: [outHas('sysmon'), outHas('student')] },
    { id: 'linux.5.5-p2', prompt: 'Using a pipe, show only the /home entry belonging to sysmon.', solution: 'ls -l /home | grep sysmon', checks: [outHas('sysmon')] },
    { id: 'linux.5.5-p3', prompt: 'List the contents of the testuser home directory, hidden files included.', solution: 'ls -la /home/testuser', checks: [outHas('.bash_history')] },
    { id: 'linux.5.5-p4', prompt: 'Show the account list and find the sysmon entry in it.', solution: 'grep sysmon /etc/passwd', checks: [outHas('sysmon')] },
    { id: 'linux.5.5-p5', prompt: 'Using a pipe, count how many accounts are defined in /etc/passwd.', solution: 'wc -l /etc/passwd', checks: [outHas('/etc/passwd')] },
  ],

  // --- 1.5.6 permission denied -----------------------------------------------
  'linux.5.6': [
    { id: 'linux.5.6-p1', prompt: 'Try to read /etc/shadow and read the refusal.', solution: 'cat /etc/shadow', checks: [outHas('Permission denied')] },
    { id: 'linux.5.6-p2', prompt: 'Try to read a file that genuinely does not exist, /etc/nonexistent.conf, and compare the error.', solution: 'cat /etc/nonexistent.conf', checks: [outHas('No such file')] },
    { id: 'linux.5.6-p3', prompt: 'Try to list the root user\'s home directory.', solution: 'ls /root', checks: [outHas('Permission denied')] },
    { id: 'linux.5.6-p4', prompt: 'Confirm you CAN read /etc/passwd, which is the deliberate contrast to the shadow file.', solution: 'head -n 1 /etc/passwd', checks: [outHas('root')] },
    { id: 'linux.5.6-p5', prompt: 'Try to read the crontab directory listing at /var/spool/cron/crontabs.', solution: 'ls /var/spool/cron/crontabs', checks: [outHas('Permission denied')] },
  ],

  // --- 1.6.1 find by name ----------------------------------------------------
  'linux.6.1': [
    { id: 'linux.6.1-p1', prompt: 'Find every file under /var/log whose name ends in .log.', solution: "find /var/log -name '*.log'", checks: [outHas('/var/log/auth.log')] },
    { id: 'linux.6.1-p2', prompt: 'Using a pipe, count how many .log files there are under /var/log.', solution: "find /var/log -name '*.log' | wc -l", checks: [numberIs(5)] },
    { id: 'linux.6.1-p3', prompt: 'Find every shell script under /home and /usr/local, searching /home first.', solution: "find /home -name '*.sh'", checks: [outHas('deploy.sh')] },
    { id: 'linux.6.1-p4', prompt: 'Find every compressed archive under /tmp.', solution: "find /tmp -name '*.tar.gz'", checks: [outHas('pt.tar.gz')] },
    { id: 'linux.6.1-p5', prompt: 'Find every CSV export under /var/www.', solution: "find /var/www -name '*.csv'", checks: [outHas('billing-2026-08-14.csv')] },
  ],

  // --- 1.6.2 hidden files ----------------------------------------------------
  'linux.6.2': [
    { id: 'linux.6.2-p1', prompt: 'List your own home directory including hidden files.', solution: 'ls -la /home/student', checks: [outHas('.bashrc')] },
    { id: 'linux.6.2-p2', prompt: 'List the sysmon home directory including hidden entries.', solution: 'ls -la /home/sysmon', checks: [outHas('.ssh')] },
    { id: 'linux.6.2-p3', prompt: 'Try reading the authorised keys file inside the sysmon account\'s .ssh directory.', solution: 'cat /home/sysmon/.ssh/authorized_keys', checks: [outHas('Permission denied')] },
    { id: 'linux.6.2-p4', prompt: 'List /tmp including hidden entries, in long form.', solution: 'ls -la /tmp', checks: [outHas('.cache')] },
    { id: 'linux.6.2-p5', prompt: 'Show the shell history left behind in the testuser home directory.', solution: 'cat /home/testuser/.bash_history', checks: [outHas('useradd')] },
  ],

  // --- 1.6.3 find by time ----------------------------------------------------
  'linux.6.3': [
    { id: 'linux.6.3-p1', prompt: 'Using a pipe, count how many files under /var/log changed in the last day.', solution: 'find /var/log -mtime -1 -type f | wc -l', checks: [numberIs(8)] },
    { id: 'linux.6.3-p2', prompt: 'Find the files under /tmp that changed in the last day.', solution: 'find /tmp -mtime -1 -type f', checks: [outHas('pt.tar.gz')] },
    { id: 'linux.6.3-p3', prompt: 'Find files under /home that changed in the last day.', solution: 'find /home -mtime -1 -type f', checks: [{ type: 'output-excludes', text: 'No such file', hint: 'The search itself should succeed.' }] },
    { id: 'linux.6.3-p4', prompt: 'Using a pipe, show only the recently changed log in the nginx subdirectory.', solution: 'find /var/log -mtime -1 -type f | grep nginx', checks: [outHas('/var/log/nginx/')] },
    { id: 'linux.6.3-p5', prompt: 'Find directories rather than files under /var/log.', solution: 'find /var/log -type d', checks: [outHas('/var/log/nginx')] },
  ],

  // --- 1.6.4 disk usage ------------------------------------------------------
  'linux.6.4': [
    { id: 'linux.6.4-p1', prompt: 'Show a single summarised, human-readable total for /var/log.', solution: 'du -sh /var/log', checks: [outHas('/var/log')] },
    { id: 'linux.6.4-p2', prompt: 'Show how much free space each filesystem has, in human-readable units.', solution: 'df -h', checks: [outHas('Filesystem')] },
    { id: 'linux.6.4-p3', prompt: 'Show a summarised human-readable total for /var/www.', solution: 'du -sh /var/www', checks: [outHas('/var/www')] },
    { id: 'linux.6.4-p4', prompt: 'Show the human-readable size of your own home directory.', solution: 'du -sh /home/student', checks: [outHas('/home/student')] },
    { id: 'linux.6.4-p5', prompt: 'Show the size of /tmp/.cache without the -s flag, so you see it broken down.', solution: 'du -h /tmp/.cache', checks: [outHas('M')] },
  ],

  // --- 1.6.5 stat ------------------------------------------------------------
  'linux.6.5': [
    { id: 'linux.6.5-p1', prompt: 'Show the full metadata for /etc/passwd.', solution: 'stat /etc/passwd', checks: [outHas('regular file')] },
    { id: 'linux.6.5-p2', prompt: 'Show the full metadata for your home directory.', solution: 'stat /home/student', checks: [outHas('directory')] },
    { id: 'linux.6.5-p3', prompt: 'Show the metadata for the small executable in the hidden cache directory.', solution: 'stat /tmp/.cache/u', checks: [outHas('regular file')] },
    { id: 'linux.6.5-p4', prompt: 'Show the metadata for the current authentication log.', solution: 'stat /var/log/auth.log', checks: [outHas('auth.log')] },
    { id: 'linux.6.5-p5', prompt: 'Show the metadata for the database dump in the jmartel home directory.', solution: 'stat /home/jmartel/portal-db-dump.sql', checks: [outHas('portal-db-dump.sql')] },
  ],

  // --- 1.6.6 broad find ------------------------------------------------------
  'linux.6.6': [
    { id: 'linux.6.6-p1', prompt: 'Using a pipe, count every regular file under /home.', solution: 'find /home -type f | wc -l', checks: [numberIs(12)] },
    { id: 'linux.6.6-p2', prompt: 'Find every directory under /home.', solution: 'find /home -type d', checks: [outHas('/home/student')] },
    { id: 'linux.6.6-p3', prompt: 'Using a pipe, show only the files under /home belonging to the jmartel account.', solution: 'find /home -type f | grep jmartel', checks: [outHas('/home/jmartel/')] },
    { id: 'linux.6.6-p4', prompt: 'Find every regular file under /var/www.', solution: 'find /var/www -type f', checks: [outHas('README.md')] },
    { id: 'linux.6.6-p5', prompt: 'Using a pipe, count the regular files under /var/log.', solution: 'find /var/log -type f | wc -l', checks: [numberIs(10)] },
  ],

  // --- 1.7.1 the process table -----------------------------------------------
  'linux.7.1': [
    { id: 'linux.7.1-p1', prompt: 'Using a pipe, count the lines the process table produces, header included.', solution: 'ps aux | wc -l', checks: [numberIs(24)] },
    { id: 'linux.7.1-p2', prompt: 'Using a pipe, show only the process table lines mentioning postgres.', solution: 'ps aux | grep postgres', checks: [outHas('postgres')] },
    { id: 'linux.7.1-p3', prompt: 'Using a pipe, show only the processes owned by www-data.', solution: 'ps aux | grep www-data', checks: [outHas('nginx')] },
    { id: 'linux.7.1-p4', prompt: 'Using a pipe, count how many process lines mention nginx.', solution: 'ps aux | grep -c nginx', checks: [numberIs(3)] },
    { id: 'linux.7.1-p5', prompt: 'Using a pipe, show only the processes owned by root.', solution: 'ps aux | grep root', checks: [outHas('/sbin/init')] },
  ],

  // --- 1.7.2 services --------------------------------------------------------
  'linux.7.2': [
    { id: 'linux.7.2-p1', prompt: 'Using a pipe, show only the running service whose name mentions ssh.', solution: 'systemctl list-units --type=service --state=running | grep ssh', checks: [outHas('ssh.service')] },
    { id: 'linux.7.2-p2', prompt: 'Using a pipe, count the lines the running-service list produces.', solution: 'systemctl list-units --type=service --state=running | wc -l', checks: [numberIs(13)] },
    { id: 'linux.7.2-p3', prompt: 'Using a pipe, show only the running service for the patient portal application.', solution: 'systemctl list-units --type=service --state=running | grep portal', checks: [outHas('portal-app.service')] },
    { id: 'linux.7.2-p4', prompt: 'Using a pipe, show only the running database service.', solution: 'systemctl list-units --type=service --state=running | grep postgres', checks: [outHas('postgresql.service')] },
    { id: 'linux.7.2-p5', prompt: 'Using a pipe, show only the running scheduling service.', solution: 'systemctl list-units --type=service --state=running | grep cron', checks: [outHas('cron.service')] },
  ],

  // --- 1.7.3 journals --------------------------------------------------------
  'linux.7.3': [
    { id: 'linux.7.3-p1', prompt: 'Show the last three journal entries for the nginx service.', solution: 'journalctl -u nginx -n 3', checks: [lines(3)] },
    { id: 'linux.7.3-p2', prompt: 'Show the last two journal entries for the nginx service.', solution: 'journalctl -u nginx -n 2', checks: [lines(2)] },
    { id: 'linux.7.3-p3', prompt: 'Show the last ten journal entries for nginx, then confirm nginx is named in them.', solution: 'journalctl -u nginx -n 10', checks: [outHas('nginx')] },
    { id: 'linux.7.3-p4', prompt: 'Using a pipe, show only the nginx journal entries mentioning a 404 response.', solution: 'journalctl -u nginx -n 20 | grep 404', checks: [outHas('404')] },
    { id: 'linux.7.3-p5', prompt: 'Using a pipe, count the last twenty nginx journal entries.', solution: 'journalctl -u nginx -n 20 | wc -l', checks: [{ type: 'output-numeric', min: 1, hint: 'The answer should be a single number.' }] },
  ],

  // --- 1.7.4 snapshots -------------------------------------------------------
  'linux.7.4': [
    { id: 'linux.7.4-p1', prompt: 'Show how long the host has been up, and its load average.', solution: 'uptime', checks: [outHas('load average')] },
    { id: 'linux.7.4-p2', prompt: 'Using a pipe, show only the header lines of a top snapshot.', solution: 'top -bn1 | head -n 5', checks: [outHas('load average')] },
    { id: 'linux.7.4-p3', prompt: 'Using a pipe, show only the top snapshot lines mentioning nginx.', solution: 'top -bn1 | grep nginx', checks: [outHas('nginx')] },
    { id: 'linux.7.4-p4', prompt: 'Show the kernel and system information for this host.', solution: 'uname -a', checks: [outHas('Linux')] },
    { id: 'linux.7.4-p5', prompt: 'Show the current date and time as the host sees it.', solution: 'date', checks: [outHas('2026')] },
  ],

  // --- 1.7.5 host health -----------------------------------------------------
  'linux.7.5': [
    { id: 'linux.7.5-p1', prompt: 'Show memory usage without the human-readable flag, so you see the raw numbers.', solution: 'free', checks: [outHas('Mem:')] },
    { id: 'linux.7.5-p2', prompt: 'Using a pipe, show only the memory row of the human-readable output.', solution: 'free -h | grep Mem', checks: [outHas('Mem:')] },
    { id: 'linux.7.5-p3', prompt: 'Show the raw memory information the kernel exposes in /proc.', solution: 'cat /proc/meminfo', checks: [outHas('MemTotal')] },
    { id: 'linux.7.5-p4', prompt: 'Show the load average straight from /proc.', solution: 'cat /proc/loadavg', checks: [outHas('0.')] },
    { id: 'linux.7.5-p5', prompt: 'Show free disk space in human-readable units.', solution: 'df -h', checks: [outHas('Filesystem')] },
  ],

  // --- 1.7.6 the odd process -------------------------------------------------
  'linux.7.6': [
    { id: 'linux.7.6-p1', prompt: 'Using a pipe, show every process line mentioning curl.', solution: 'ps aux | grep curl', checks: [outHas('/tmp/.cache/pt.tar.gz')] },
    { id: 'linux.7.6-p2', prompt: 'Using a pipe, show the processes owned by the gunicorn application server account.', solution: 'ps aux | grep gunicorn', checks: [outHas('gunicorn')] },
    { id: 'linux.7.6-p3', prompt: 'Using a pipe, count how many process lines mention sysmon.', solution: 'ps aux | grep -c sysmon', checks: [numberIs(3)] },
    { id: 'linux.7.6-p4', prompt: 'Using a pipe, show the process lines that mention the external address the upload is going to.', solution: 'ps aux | grep 198.51.100.60', checks: [outHas('curl')] },
    { id: 'linux.7.6-p5', prompt: 'Using a pipe, show the sshd processes so you can compare a legitimate daemon against the odd one.', solution: 'ps aux | grep sshd', checks: [outHas('/usr/sbin/sshd')] },
  ],
};
