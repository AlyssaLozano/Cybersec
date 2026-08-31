/**
 * Practice drills for Package 1: five per exercise, 110 in total.
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

export const PACKAGE_1_PRACTICE: Record<string, PracticeItem[]> = {
  // --- 1.1.1 pwd -------------------------------------------------------------
  '1.1.1': [
    { id: '1.1.1-p1', setup: ['cd /etc'], prompt: 'You have been moved somewhere. Print your working directory.', solution: 'pwd', checks: [outHas('/etc')] },
    { id: '1.1.1-p2', setup: ['cd /var/log'], prompt: 'Where are you now? Print it.', solution: 'pwd', checks: [outHas('/var/log')] },
    { id: '1.1.1-p3', setup: ['cd /var/www/portal'], prompt: 'Confirm your location.', solution: 'pwd', checks: [outHas('/var/www/portal')] },
    { id: '1.1.1-p4', setup: ['cd /usr/bin'], prompt: 'Print the directory you are sitting in.', solution: 'pwd', checks: [outHas('/usr/bin')] },
    { id: '1.1.1-p5', setup: ['cd /tmp/.cache'], prompt: 'You have been dropped into a hidden directory. Which one?', solution: 'pwd', checks: [outHas('/tmp/.cache')] },
  ],

  // --- 1.1.2 ls --------------------------------------------------------------
  '1.1.2': [
    { id: '1.1.2-p1', prompt: 'List the contents of /etc without moving there.', solution: 'ls /etc', checks: [outHas('passwd'), outHas('hostname')] },
    { id: '1.1.2-p2', prompt: 'List the contents of /var/log.', solution: 'ls /var/log', checks: [outHas('auth.log'), outHas('syslog')] },
    { id: '1.1.2-p3', prompt: 'List every home directory on this server. They live under /home.', solution: 'ls /home', checks: [outHas('student'), outHas('testuser')] },
    { id: '1.1.2-p4', prompt: 'List what is inside /var/www/portal.', solution: 'ls /var/www/portal', checks: [outHas('exports')] },
    { id: '1.1.2-p5', prompt: 'List the contents of /tmp.', solution: 'ls /tmp', checks: [outHas('portal-debug.log')] },
  ],

  // --- 1.1.3 ls -la ----------------------------------------------------------
  '1.1.3': [
    { id: '1.1.3-p1', prompt: 'Show a long listing of /var/log, including permissions and sizes.', solution: 'ls -l /var/log', checks: [hasFlag('ls', 'l'), outHas('auth.log')] },
    { id: '1.1.3-p2', prompt: 'Show everything in /tmp including hidden entries, in long format. There is a hidden directory in there.', solution: 'ls -la /tmp', checks: [hasFlag('ls', 'l'), hasFlag('ls', 'a'), outHas('.cache')] },
    { id: '1.1.3-p3', prompt: 'List /var/log in long format with human-readable file sizes.', solution: 'ls -lh /var/log', checks: [hasFlag('ls', 'l'), hasFlag('ls', 'h')] },
    { id: '1.1.3-p4', prompt: "Show the hidden files in the compromised account's home directory, /home/testuser, in long format.", solution: 'ls -la /home/testuser', checks: [hasFlag('ls', 'a'), outHas('.bash_history')] },
    { id: '1.1.3-p5', prompt: 'List /var/log in long format sorted by modification time, newest first.', solution: 'ls -lt /var/log', checks: [hasFlag('ls', 'l'), hasFlag('ls', 't')] },
  ],

  // --- 1.1.4 cd absolute -----------------------------------------------------
  '1.1.4': [
    { id: '1.1.4-p1', prompt: 'Navigate to /etc/ssh, where the SSH server configuration lives.', solution: 'cd /etc/ssh', checks: [atCwd('/etc/ssh')] },
    { id: '1.1.4-p2', prompt: 'Navigate to /var/log.', solution: 'cd /var/log', checks: [atCwd('/var/log')] },
    { id: '1.1.4-p3', prompt: 'Navigate to the web root at /var/www/portal.', solution: 'cd /var/www/portal', checks: [atCwd('/var/www/portal')] },
    { id: '1.1.4-p4', prompt: 'Navigate to /tmp.', solution: 'cd /tmp', checks: [atCwd('/tmp')] },
    { id: '1.1.4-p5', prompt: 'Navigate to /usr/bin, where most commands actually live.', solution: 'cd /usr/bin', checks: [atCwd('/usr/bin')] },
  ],

  // --- 1.1.5 the ~ shortcut --------------------------------------------------
  '1.1.5': [
    { id: '1.1.5-p1', setup: ['cd /var/log'], prompt: 'Get back to your home directory using the tilde shortcut.', solution: 'cd ~', checks: [atCwd(HOME)] },
    { id: '1.1.5-p2', setup: ['cd /etc'], prompt: 'Move into your Documents folder using a tilde path, without typing /home.', solution: 'cd ~/Documents', checks: [atCwd(`${HOME}/Documents`)] },
    { id: '1.1.5-p3', setup: ['cd /usr/bin'], prompt: 'List your home directory using the tilde shortcut, without moving there.', solution: 'ls ~', checks: [outHas('notes.txt'), atCwd('/usr/bin')] },
    { id: '1.1.5-p4', setup: ['cd /tmp'], prompt: 'Read the file notes.txt in your home directory using a tilde path.', solution: 'cat ~/notes.txt', checks: [outHas('SOC onboarding')] },
    { id: '1.1.5-p5', setup: ['cd /var'], prompt: 'Move into your Downloads folder using a tilde path.', solution: 'cd ~/Downloads', checks: [atCwd(`${HOME}/Downloads`)] },
  ],

  // --- 1.1.6 cd .. -----------------------------------------------------------
  '1.1.6': [
    { id: '1.1.6-p1', setup: ['cd /etc/ssh'], prompt: 'Move up one level from /etc/ssh.', solution: 'cd ..', checks: [atCwd('/etc')] },
    { id: '1.1.6-p2', setup: ['cd /var/www/portal'], prompt: 'Move up one level.', solution: 'cd ..', checks: [atCwd('/var/www')] },
    { id: '1.1.6-p3', setup: ['cd /var/www/portal/exports'], prompt: 'Move up TWO levels in a single command, to /var/www.', solution: 'cd ../..', checks: [atCwd('/var/www')] },
    { id: '1.1.6-p4', setup: ['cd /home/student/Documents'], prompt: 'Move up one level, back to your home directory.', solution: 'cd ..', checks: [atCwd(HOME)] },
    { id: '1.1.6-p5', setup: ['cd /tmp/.cache'], prompt: 'List the parent directory without moving out of /tmp/.cache.', solution: 'ls ..', checks: [outHas('portal-debug.log'), atCwd('/tmp/.cache')] },
  ],

  // --- 1.2.1 touch -----------------------------------------------------------
  '1.2.1': [
    { id: '1.2.1-p1', prompt: 'Create an empty file called findings.txt in your home directory.', solution: 'touch findings.txt', checks: [exists(`${HOME}/findings.txt`)] },
    { id: '1.2.1-p2', prompt: 'Create an empty file called timeline.md.', solution: 'touch timeline.md', checks: [exists(`${HOME}/timeline.md`)] },
    { id: '1.2.1-p3', prompt: 'Create a file called scratch.txt inside your Documents folder.', solution: 'touch Documents/scratch.txt', checks: [exists(`${HOME}/Documents/scratch.txt`)] },
    { id: '1.2.1-p4', prompt: 'Create two files at once, called a.txt and b.txt. touch accepts several names.', solution: 'touch a.txt b.txt', checks: [exists(`${HOME}/a.txt`), exists(`${HOME}/b.txt`)] },
    { id: '1.2.1-p5', prompt: 'Create a file called shift-notes.txt in /tmp.', solution: 'touch /tmp/shift-notes.txt', checks: [exists('/tmp/shift-notes.txt')] },
  ],

  // --- 1.2.2 mkdir -----------------------------------------------------------
  '1.2.2': [
    { id: '1.2.2-p1', prompt: 'Create a directory called evidence in your home directory.', solution: 'mkdir evidence', checks: [exists(`${HOME}/evidence`, 'dir')] },
    { id: '1.2.2-p2', prompt: 'Create a directory called incident-4417.', solution: 'mkdir incident-4417', checks: [exists(`${HOME}/incident-4417`, 'dir')] },
    { id: '1.2.2-p3', prompt: 'Create the nested path case/2026/august in one command. You will need the option that makes parent directories.', solution: 'mkdir -p case/2026/august', checks: [exists(`${HOME}/case/2026/august`, 'dir')] },
    { id: '1.2.2-p4', prompt: 'Create a directory called notes inside your Documents folder.', solution: 'mkdir Documents/notes', checks: [exists(`${HOME}/Documents/notes`, 'dir')] },
    { id: '1.2.2-p5', prompt: 'Create two directories at once, called in and out.', solution: 'mkdir in out', checks: [exists(`${HOME}/in`, 'dir'), exists(`${HOME}/out`, 'dir')] },
  ],

  // --- 1.2.3 cp --------------------------------------------------------------
  '1.2.3': [
    { id: '1.2.3-p1', prompt: 'Copy your notes.txt to notes-backup.txt.', solution: 'cp notes.txt notes-backup.txt', checks: [exists(`${HOME}/notes-backup.txt`), exists(`${HOME}/notes.txt`)] },
    { id: '1.2.3-p2', prompt: 'Copy /etc/hostname into your home directory, keeping the name.', solution: 'cp /etc/hostname .', checks: [exists(`${HOME}/hostname`)] },
    { id: '1.2.3-p3', setup: ['mkdir -p evidence'], prompt: 'Copy /etc/passwd into your evidence directory. Preserving a copy before you analyse it is standard practice.', solution: 'cp /etc/passwd evidence/', checks: [exists(`${HOME}/evidence/passwd`)] },
    { id: '1.2.3-p4', prompt: 'Copy /etc/resolv.conf to your home directory under the name dns-config.txt.', solution: 'cp /etc/resolv.conf dns-config.txt', checks: [exists(`${HOME}/dns-config.txt`)] },
    { id: '1.2.3-p5', setup: ['mkdir -p archive'], prompt: 'Copy your whole Documents directory into archive. Copying a directory needs an extra option.', solution: 'cp -r Documents archive/', checks: [exists(`${HOME}/archive/Documents`, 'dir')] },
  ],

  // --- 1.2.4 mv --------------------------------------------------------------
  '1.2.4': [
    { id: '1.2.4-p1', setup: ['touch draft.txt'], prompt: 'Rename draft.txt to report.txt.', solution: 'mv draft.txt report.txt', checks: [exists(`${HOME}/report.txt`), gone(`${HOME}/draft.txt`)] },
    { id: '1.2.4-p2', setup: ['touch scratch.log'], prompt: 'Rename scratch.log to incident.log.', solution: 'mv scratch.log incident.log', checks: [exists(`${HOME}/incident.log`), gone(`${HOME}/scratch.log`)] },
    { id: '1.2.4-p3', setup: ['touch evidence.txt', 'mkdir -p case'], prompt: 'Move evidence.txt into the case directory, keeping its name.', solution: 'mv evidence.txt case/', checks: [exists(`${HOME}/case/evidence.txt`), gone(`${HOME}/evidence.txt`)] },
    { id: '1.2.4-p4', setup: ['touch old.txt'], prompt: 'Move old.txt into /tmp.', solution: 'mv old.txt /tmp/', checks: [exists('/tmp/old.txt'), gone(`${HOME}/old.txt`)] },
    { id: '1.2.4-p5', setup: ['mkdir -p wip'], prompt: 'Rename the directory wip to in-progress. mv renames directories too.', solution: 'mv wip in-progress', checks: [exists(`${HOME}/in-progress`, 'dir'), gone(`${HOME}/wip`)] },
  ],

  // --- 1.2.5 rm --------------------------------------------------------------
  '1.2.5': [
    { id: '1.2.5-p1', setup: ['touch junk.txt'], prompt: 'Delete junk.txt.', solution: 'rm junk.txt', checks: [gone(`${HOME}/junk.txt`)] },
    { id: '1.2.5-p2', setup: ['touch a.tmp', 'touch b.tmp'], prompt: 'Delete both a.tmp and b.tmp in a single command.', solution: 'rm a.tmp b.tmp', checks: [gone(`${HOME}/a.tmp`), gone(`${HOME}/b.tmp`)] },
    { id: '1.2.5-p3', setup: ['touch old.log'], prompt: 'Delete old.log from your home directory.', solution: 'rm old.log', checks: [gone(`${HOME}/old.log`)] },
    { id: '1.2.5-p4', setup: ['mkdir -p stale', 'touch stale/one.txt'], prompt: 'Delete the stale directory and everything inside it. This needs the recursive option, so read your command back before you run it.', solution: 'rm -r stale', checks: [gone(`${HOME}/stale`)] },
    { id: '1.2.5-p5', setup: ['touch x1.tmp', 'touch x2.tmp', 'touch keep.txt'], prompt: 'Delete every file ending in .tmp using a wildcard, and leave keep.txt alone.', solution: 'rm *.tmp', checks: [gone(`${HOME}/x1.tmp`), gone(`${HOME}/x2.tmp`), exists(`${HOME}/keep.txt`)] },
  ],

  // --- 1.2.6 rmdir -----------------------------------------------------------
  '1.2.6': [
    { id: '1.2.6-p1', setup: ['mkdir -p tmpdir'], prompt: 'Remove the empty directory tmpdir.', solution: 'rmdir tmpdir', checks: [gone(`${HOME}/tmpdir`)] },
    { id: '1.2.6-p2', setup: ['mkdir -p spare'], prompt: 'Remove the empty directory spare.', solution: 'rmdir spare', checks: [gone(`${HOME}/spare`)] },
    { id: '1.2.6-p3', setup: ['mkdir -p one', 'mkdir -p two'], prompt: 'Remove both empty directories one and two in a single command.', solution: 'rmdir one two', checks: [gone(`${HOME}/one`), gone(`${HOME}/two`)] },
    { id: '1.2.6-p4', setup: ['mkdir -p full', 'touch full/file.txt'], prompt: 'Try to remove the directory "full" with rmdir. It contains a file, so rmdir will refuse -- read the error, then remove the file first and try again.', solution: 'rm full/file.txt\nrmdir full', checks: [gone(`${HOME}/full`)] },
    { id: '1.2.6-p5', setup: ['mkdir -p a/b'], prompt: 'Remove the empty directory a/b, leaving a in place.', solution: 'rmdir a/b', checks: [gone(`${HOME}/a/b`), exists(`${HOME}/a`, 'dir')] },
  ],

  // --- 1.3.1 cat -------------------------------------------------------------
  '1.3.1': [
    { id: '1.3.1-p1', prompt: 'Print the contents of /etc/resolv.conf to see which DNS servers this host uses.', solution: 'cat /etc/resolv.conf', checks: [outHas('nameserver')] },
    { id: '1.3.1-p2', prompt: 'Print /etc/os-release to find out which Linux distribution this is.', solution: 'cat /etc/os-release', checks: [outHas('Ubuntu')] },
    { id: '1.3.1-p3', prompt: 'Print /etc/crontab to see what runs on a schedule.', solution: 'cat /etc/crontab', checks: [outHas('run-parts')] },
    { id: '1.3.1-p4', prompt: 'Print your own notes.txt.', solution: 'cat notes.txt', checks: [outHas('SOC onboarding')] },
    { id: '1.3.1-p5', prompt: 'Try to read /etc/shadow, which stores password hashes. You will be refused -- read the error carefully, because that refusal is the system working correctly.', solution: 'cat /etc/shadow', checks: [outHas('Permission denied')] },
  ],

  // --- 1.3.2 less ------------------------------------------------------------
  '1.3.2': [
    { id: '1.3.2-p1', prompt: 'Open /var/log/auth.log in the pager.', solution: 'less /var/log/auth.log', checks: [outHas('rmg-web-02')] },
    { id: '1.3.2-p2', prompt: 'Open /etc/ssh/sshd_config in the pager.', solution: 'less /etc/ssh/sshd_config', checks: [outHas('Port 22')] },
    { id: '1.3.2-p3', prompt: 'Open /var/log/nginx/access.log in the pager.', solution: 'less /var/log/nginx/access.log', checks: [outHas('GET')] },
    { id: '1.3.2-p4', prompt: 'Open /etc/passwd in the pager to see every account on the host.', solution: 'less /etc/passwd', checks: [outHas('root:x:0:0')] },
    { id: '1.3.2-p5', prompt: 'Open /var/log/syslog in the pager, then compare: how much more useful would a grep have been?', solution: 'less /var/log/syslog', checks: [outHas('systemd')] },
  ],

  // --- 1.3.3 head ------------------------------------------------------------
  '1.3.3': [
    { id: '1.3.3-p1', prompt: 'Show the first 5 lines of /etc/passwd.', solution: 'head -n 5 /etc/passwd', checks: [lines(5)] },
    { id: '1.3.3-p2', prompt: 'Show the first 3 lines of /var/log/syslog.', solution: 'head -n 3 /var/log/syslog', checks: [lines(3)] },
    { id: '1.3.3-p3', prompt: 'Show the first 20 lines of /var/log/auth.log.', solution: 'head -n 20 /var/log/auth.log', checks: [lines(20)] },
    { id: '1.3.3-p4', prompt: 'Show the first 10 lines of /var/log/nginx/access.log using head with no options at all.', solution: 'head /var/log/nginx/access.log', checks: [outHas('GET')] },
    { id: '1.3.3-p5', prompt: 'Show the first 2 lines of /etc/crontab.', solution: 'head -n 2 /etc/crontab', checks: [lines(2)] },
  ],

  // --- 1.3.4 tail ------------------------------------------------------------
  '1.3.4': [
    { id: '1.3.4-p1', prompt: 'Show the last 10 lines of /var/log/syslog.', solution: 'tail -n 10 /var/log/syslog', checks: [lines(10)] },
    { id: '1.3.4-p2', prompt: 'Show the last 3 lines of /var/log/auth.log -- the most recent authentication events on this host.', solution: 'tail -n 3 /var/log/auth.log', checks: [lines(3)] },
    { id: '1.3.4-p3', prompt: 'Show the last 20 lines of /var/log/syslog.', solution: 'tail -n 20 /var/log/syslog', checks: [lines(20)] },
    { id: '1.3.4-p4', prompt: 'Show the last 5 lines of /etc/passwd. Notice which accounts appear at the bottom of that file.', solution: 'tail -n 5 /etc/passwd', checks: [lines(5)] },
    { id: '1.3.4-p5', prompt: 'Show the last 2 lines of /var/log/nginx/error.log.', solution: 'tail -n 2 /var/log/nginx/error.log', checks: [lines(2)] },
  ],

  // --- 1.4.1 grep ------------------------------------------------------------
  '1.4.1': [
    { id: '1.4.1-p1', prompt: 'Find every line in /var/log/auth.log containing "Accepted" -- the logins that actually succeeded.', solution: 'grep "Accepted" /var/log/auth.log', checks: [outHas('Accepted'), { type: 'output-excludes', text: 'Failed password', hint: 'Only matching lines should appear.' }] },
    { id: '1.4.1-p2', prompt: 'Find every line in /etc/passwd containing "bash", showing which accounts have a real login shell.', solution: 'grep "bash" /etc/passwd', checks: [outHas('/bin/bash')] },
    { id: '1.4.1-p3', prompt: 'Find every line in /var/log/auth.log mentioning the account "testuser".', solution: 'grep "testuser" /var/log/auth.log', checks: [outHas('testuser')] },
    { id: '1.4.1-p4', prompt: 'Search /var/log/syslog for lines containing "nginx".', solution: 'grep "nginx" /var/log/syslog', checks: [outHas('nginx')] },
    { id: '1.4.1-p5', prompt: 'Search /var/log/auth.log for the address 203.0.113.55. Take a moment to notice how much of the file it appears in.', solution: 'grep "203.0.113.55" /var/log/auth.log', checks: [outHas('203.0.113.55')] },
  ],

  // --- 1.4.2 grep -i ---------------------------------------------------------
  '1.4.2': [
    { id: '1.4.2-p1', prompt: 'Search /var/log/syslog for "error" in any case.', solution: 'grep -i "error" /var/log/syslog', checks: [hasFlag('grep', 'i'), outHas('rror')] },
    { id: '1.4.2-p2', prompt: 'Search /var/log/auth.log for "invalid" in any case. Both "Invalid" and "invalid" appear in that file.', solution: 'grep -i "invalid" /var/log/auth.log', checks: [hasFlag('grep', 'i'), outHas('nvalid')] },
    { id: '1.4.2-p3', prompt: 'Search /var/log/syslog for "warning" in any case.', solution: 'grep -i "warning" /var/log/syslog', checks: [hasFlag('grep', 'i'), outHas('WARNING')] },
    { id: '1.4.2-p4', prompt: 'Search /etc/ssh/sshd_config for "password" in any case.', solution: 'grep -i "password" /etc/ssh/sshd_config', checks: [hasFlag('grep', 'i'), outHas('assword')] },
    { id: '1.4.2-p5', prompt: 'Search /var/log/syslog for "session" in any case.', solution: 'grep -i "session" /var/log/syslog', checks: [hasFlag('grep', 'i'), outHas('ession')] },
  ],

  // --- 1.4.3 grep -c ---------------------------------------------------------
  '1.4.3': [
    { id: '1.4.3-p1', prompt: 'Count how many lines of /var/log/auth.log contain "Accepted".', solution: 'grep -c "Accepted" /var/log/auth.log', checks: [numberIs(countIn(authLines, 'Accepted'))] },
    { id: '1.4.3-p2', prompt: 'Count how many lines of /var/log/auth.log contain "Failed password".', solution: 'grep -c "Failed password" /var/log/auth.log', checks: [numberIs(countIn(authLines, 'Failed password'))] },
    { id: '1.4.3-p3', prompt: 'Count how many lines of /var/log/auth.log mention the address 203.0.113.55.', solution: 'grep -c "203.0.113.55" /var/log/auth.log', checks: [numberIs(countIn(authLines, '203.0.113.55'))] },
    { id: '1.4.3-p4', prompt: 'Count how many lines of /var/log/auth.log mention the internal monitoring host 10.20.9.40. Compare that number to the previous drill before you decide which one is the attack.', solution: 'grep -c "10.20.9.40" /var/log/auth.log', checks: [numberIs(countIn(authLines, '10.20.9.40'))] },
    { id: '1.4.3-p5', prompt: 'Count how many lines of /var/log/syslog contain "CRON".', solution: 'grep -c "CRON" /var/log/syslog', checks: [numberIs(countIn(sysLines, 'CRON'))] },
  ],

  // --- 1.4.4 grep -n ---------------------------------------------------------
  '1.4.4': [
    { id: '1.4.4-p1', prompt: 'Find every "Accepted" line in /var/log/auth.log with its line number.', solution: 'grep -n "Accepted" /var/log/auth.log', checks: [hasFlag('grep', 'n'), { type: 'output-matches', pattern: '^\\d+:', flags: 'm', hint: 'Each line should start with a number and a colon.' }] },
    { id: '1.4.4-p2', prompt: 'Find every line mentioning "useradd" in /var/log/auth.log, with line numbers. This is how an account gets created.', solution: 'grep -n "useradd" /var/log/auth.log', checks: [hasFlag('grep', 'n'), outHas('new user')] },
    { id: '1.4.4-p3', prompt: 'Find "root" in /etc/passwd with its line number.', solution: 'grep -n "root" /etc/passwd', checks: [hasFlag('grep', 'n'), outHas('root')] },
    { id: '1.4.4-p4', prompt: 'Find every line mentioning "sysmon" in /var/log/auth.log, with line numbers.', solution: 'grep -n "sysmon" /var/log/auth.log', checks: [hasFlag('grep', 'n'), outHas('sysmon')] },
    { id: '1.4.4-p5', prompt: 'Find lines containing "postgresql" in /var/log/syslog, with line numbers.', solution: 'grep -n "postgresql" /var/log/syslog', checks: [hasFlag('grep', 'n'), outHas('postgresql')] },
  ],

  // --- 1.4.5 pipes -----------------------------------------------------------
  '1.4.5': [
    { id: '1.4.5-p1', prompt: 'Using a pipe, count how many accounts exist in /etc/passwd.', solution: 'cat /etc/passwd | wc -l', checks: [{ type: 'command-uses-pipe', hint: 'Use the | character.' }, numberIs(PASSWD_ACCOUNT_COUNT)] },
    { id: '1.4.5-p2', prompt: 'Using a pipe, count how many lines of /var/log/auth.log contain "Accepted".', solution: 'grep "Accepted" /var/log/auth.log | wc -l', checks: [{ type: 'command-uses-pipe', hint: 'Use the | character.' }, numberIs(countIn(authLines, 'Accepted'))] },
    { id: '1.4.5-p3', prompt: 'Using a pipe, count how many accounts in /etc/passwd use the bash shell.', solution: 'grep "/bin/bash" /etc/passwd | wc -l', checks: [{ type: 'command-uses-pipe', hint: 'Use the | character.' }] },
    { id: '1.4.5-p4', prompt: 'Using a pipe, count how many lines of /var/log/syslog mention "nginx".', solution: 'grep "nginx" /var/log/syslog | wc -l', checks: [{ type: 'command-uses-pipe', hint: 'Use the | character.' }, numberIs(countIn(sysLines, 'nginx'))] },
    { id: '1.4.5-p5', prompt: 'Chain THREE commands: take the last 100 lines of /var/log/auth.log, keep only the ones mentioning sshd, and count them.', solution: 'tail -n 100 /var/log/auth.log | grep "sshd" | wc -l', checks: [{ type: 'command-uses-pipe', hint: 'You need two pipes for three commands.' }, { type: 'output-numeric', min: 0, hint: 'The result should be a single number.' }] },
  ],

  // --- 1.4.6 wildcards -------------------------------------------------------
  '1.4.6': [
    { id: '1.4.6-p1', prompt: 'List every file in /var/log ending in .log, using a wildcard.', solution: 'ls /var/log/*.log', checks: [outHas('auth.log'), outHas('kern.log')] },
    { id: '1.4.6-p2', prompt: 'Search every .log file in /var/log for "sshd".', solution: 'grep "sshd" /var/log/*.log', checks: [{ type: 'command-matches', anyOf: ['\\*\\.log'], regex: true, hint: 'Use the *.log wildcard.' }, outHas('sshd')] },
    { id: '1.4.6-p3', prompt: 'Search every .log file in /var/log for "Failed".', solution: 'grep "Failed" /var/log/*.log', checks: [{ type: 'command-matches', anyOf: ['\\*\\.log'], regex: true, hint: 'Use the *.log wildcard.' }, outHas('Failed')] },
    { id: '1.4.6-p4', prompt: 'Search every .log file in /var/log for "cron", ignoring case.', solution: 'grep -i "cron" /var/log/*.log', checks: [hasFlag('grep', 'i'), { type: 'command-matches', anyOf: ['\\*\\.log'], regex: true, hint: 'Use the *.log wildcard.' }] },
    { id: '1.4.6-p5', prompt: 'List every file in /etc starting with "host", using a wildcard.', solution: 'ls /etc/host*', checks: [outHas('hostname'), outHas('hosts')] },
  ],
};
