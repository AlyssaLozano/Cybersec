/**
 * Package 1: Linux Fundamentals -- 22 exercises across 4 modules.
 *
 * The source specification claimed 24. The real count is 22, and the numbering
 * here follows the exercises that actually exist (see docs/content-issues.md).
 *
 * TEACHING MODEL
 *
 * Every exercise carries four layers, and a student may stop at whichever one
 * gets them moving:
 *
 *   1. `teach`    -- the concept, the command's shape, and worked examples that
 *                    are deliberately NOT the answer. Available before the first
 *                    attempt, because this audience has never used a shell and
 *                    "practise what you already know" would fail them by design.
 *   2. `hints`    -- nudges of increasing directness, revealed one at a time.
 *   3. `solution` -- the literal answer, behind an explicit request, so a student
 *                    always knows when they chose to be told.
 *   4. `debrief`  -- shown after passing: why an analyst cares.
 *
 * Every count-based expected answer is COMPUTED from the seeded logs rather than
 * typed in by hand, so regenerating the world cannot leave a stale answer key.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

import { AUTH_LOG } from '../vfs/data/generated.js';
import { PACKAGE_1_PRACTICE } from './package1-practice.js';

const authLines = AUTH_LOG.split('\n');

/** Number of auth.log lines containing a literal string. */
function countAuth(needle: string, caseInsensitive = false): number {
  const target = caseInsensitive ? needle.toLowerCase() : needle;
  return authLines.filter((line) => (caseInsensitive ? line.toLowerCase() : line).includes(target))
    .length;
}

const HOME = '/home/student';

// --- Module 1.1: Navigation --------------------------------------------------

const MODULE_1_1: Exercise[] = [
  {
    id: '1.1.1',
    moduleId: '1.1',
    packageId: '1',
    order: 1,
    title: 'Find out where you are',
    kind: 'terminal',
    goal: 'Learn the one command that always answers "where am I?"',
    prompt:
      'You have just logged into rmg-web-02, the patient portal web server. Before you touch anything, find out which directory you are sitting in.',
    teach: {
      concept:
        'A Linux filesystem is one big tree starting at / (the "root"). At any moment your shell sits in exactly one directory, called the working directory. Commands you type act on that directory unless you tell them otherwise, so knowing where you are is the difference between deleting a scratch file and deleting a log.',
      syntax: 'pwd',
      examples: [
        { command: 'pwd', explains: 'Prints the full path of the directory you are currently in.' },
      ],
    },
    hints: [
      'The command is three letters long and takes no arguments.',
      'It stands for "print working directory".',
    ],
    solution: 'pwd',
    expectedOutput: '/home/student',
    checks: [
      { type: 'command-matches', anyOf: ['pwd'], hint: 'The command is `pwd`, short for "print working directory".' },
      { type: 'output-contains', text: '/home/student', hint: 'The output should be the absolute path you are in, starting with a /.' },
    ],
    debrief:
      'Sounds trivial, and it is the command you will use most. Half of all mistakes on a live system come from running the right command in the wrong directory.',
     practice: PACKAGE_1_PRACTICE['1.1.1'] ?? [],
  },
  {
    id: '1.1.2',
    moduleId: '1.1',
    packageId: '1',
    order: 2,
    title: 'See what is here',
    kind: 'terminal',
    goal: 'List the contents of a directory.',
    prompt: 'List the files and directories in your current location.',
    teach: {
      concept:
        '`ls` lists what is inside a directory. With no arguments it lists the one you are in; give it a path and it lists that instead. It is the command you reach for constantly to orient yourself.',
      syntax: 'ls [OPTIONS] [PATH]',
      examples: [
        { command: 'ls', explains: 'Lists the current directory.' },
        { command: 'ls /var/log', explains: 'Lists a different directory without moving there.' },
      ],
    },
    hints: [
      'Two letters. It is short for "list".',
      'You do not need any options or a path for this one.',
    ],
    solution: 'ls',
    expectedOutput: 'Desktop  Documents  Downloads  notes.txt',
    checks: [
      { type: 'command-matches', anyOf: ['ls'], hint: 'Use `ls` on its own, with no arguments.' },
      { type: 'output-contains', text: 'Documents', hint: 'You should see the contents of your home directory listed.' },
    ],
    debrief: 'Notice that `ls` hides anything beginning with a dot. Attackers know that too.',
     practice: PACKAGE_1_PRACTICE['1.1.2'] ?? [],
  },
  {
    id: '1.1.3',
    moduleId: '1.1',
    packageId: '1',
    order: 3,
    title: 'See everything, with detail',
    kind: 'terminal',
    goal: 'Reveal hidden files, permissions, owners, and sizes.',
    prompt:
      'List everything in your home directory, including hidden files, with full details: permissions, owner, size, and date.',
    teach: {
      concept:
        'Options (also called flags) change how a command behaves. They start with a dash, and short ones can be grouped: `-l -a` and `-la` mean the same thing. Two matter enormously here. `-l` gives the long format, where the first column is the permission string: the leading character is `d` for a directory or `-` for a file, then three groups of rwx for the owner, the group, and everyone else. `-a` shows hidden entries, which on Linux is simply anything whose name starts with a dot.',
      syntax: 'ls -la [PATH]',
      flags: [
        { flag: '-l', means: 'Long format: permissions, owner, group, size, date.' },
        { flag: '-a', means: 'Show all entries, including hidden dotfiles.' },
        { flag: '-h', means: 'Human-readable sizes (4.0K instead of 4096).' },
        { flag: '-t', means: 'Sort by modification time, newest first.' },
      ],
      examples: [
        { command: 'ls -l /etc', explains: 'Long listing of /etc, without hidden files.' },
        { command: 'ls -lh /var/log', explains: 'Long listing with readable file sizes.' },
      ],
    },
    hints: [
      'You need two options on `ls` at once. You can write them separately or grouped behind a single dash.',
      'One option gives the long format; the other reveals hidden dotfiles.',
    ],
    solution: 'ls -la',
    expectedOutput:
      'A long listing including .bashrc and .profile, each row starting with a permission string like -rw-r--r--',
    checks: [
      { type: 'command-has-flag', command: 'ls', flags: ['l'], hint: 'Add `-l` for the long format that shows permissions and sizes.' },
      { type: 'command-has-flag', command: 'ls', flags: ['a'], hint: 'Add `-a` to include hidden dotfiles. You can group them as `-la`.' },
      { type: 'output-matches', pattern: '[-d]rw', hint: 'The output should include permission strings such as -rw-r--r--.' },
      { type: 'output-contains', text: '.bashrc', hint: 'Hidden files like .bashrc should now appear.' },
    ],
    debrief:
      'Compare this to plain `ls`. Two files were invisible a moment ago. On a compromised host, a directory called `.cache` in an unusual place is a classic hiding spot.',
     practice: PACKAGE_1_PRACTICE['1.1.3'] ?? [],
  },
  {
    id: '1.1.4',
    moduleId: '1.1',
    packageId: '1',
    order: 4,
    title: 'Move to another directory',
    kind: 'terminal',
    goal: 'Change directory using an absolute path.',
    prompt: 'Navigate to the /var directory, then confirm you actually got there.',
    teach: {
      concept:
        '`cd` changes your working directory. A path that begins with / is absolute: it is measured from the root of the filesystem and means the same thing no matter where you currently are. A path without a leading / is relative to where you are now. When in doubt, use an absolute path.',
      syntax: 'cd PATH',
      examples: [
        { command: 'cd /etc', explains: 'Absolute: goes to /etc from anywhere.' },
        { command: 'cd Documents', explains: 'Relative: goes to Documents inside the current directory.' },
      ],
    },
    hints: [
      'The command is two letters, short for "change directory".',
      'Give it the absolute path, starting with a forward slash.',
    ],
    solution: 'cd /var',
    expectedOutput: '/var',
    checks: [
      { type: 'cwd-equals', path: '/var', hint: 'Use `cd /var`. The leading slash makes it an absolute path from the root of the filesystem.' },
    ],
    debrief: '/var is where changing data lives: logs, spools, caches. You will spend most of your time here.',
     practice: PACKAGE_1_PRACTICE['1.1.4'] ?? [],
  },
  {
    id: '1.1.5',
    moduleId: '1.1',
    packageId: '1',
    order: 5,
    title: 'Get home in a hurry',
    kind: 'terminal',
    goal: 'Use the ~ shortcut for your home directory.',
    prompt:
      'You have been dropped into /etc/ssh. Get back to your home directory using the tilde (~) shortcut rather than typing the full path.',
    setup: ['cd /etc/ssh'],
    teach: {
      concept:
        'Every user has a home directory, and the shell has a shortcut for it: the tilde character, ~. It expands to your own home path wherever you use it, so `~/notes.txt` means the notes file in your home directory regardless of where you are standing.',
      syntax: 'cd ~',
      examples: [
        { command: 'ls ~', explains: 'Lists your home directory from anywhere.' },
        { command: 'cat ~/notes.txt', explains: 'Reads a file in your home directory by shortcut.' },
      ],
    },
    hints: [
      'Combine the change-directory command with the tilde character.',
      'The tilde is usually next to the 1 key, or shift-backtick.',
    ],
    solution: 'cd ~',
    expectedOutput: '/home/student',
    checks: [
      { type: 'cwd-equals', path: HOME, hint: 'Use `cd ~`. The tilde always expands to your own home directory.' },
      { type: 'command-matches', anyOf: ['cd ~', 'cd ~/', 'cd'], hint: 'This exercise is about the ~ shortcut specifically, so use `cd ~` rather than the full path.' },
    ],
    debrief: 'A bare `cd` with no argument does the same thing. Both beat typing /home/yourname on a bad day.',
     practice: PACKAGE_1_PRACTICE['1.1.5'] ?? [],
  },
  {
    id: '1.1.6',
    moduleId: '1.1',
    packageId: '1',
    order: 6,
    title: 'Go up one level',
    kind: 'terminal',
    goal: 'Navigate to the parent directory with ..',
    prompt:
      'You have been dropped into /var/log. Move up one level to /var, then confirm where you are.',
    setup: ['cd /var/log'],
    teach: {
      concept:
        'Every directory contains two special entries. A single dot (.) means "this directory", and two dots (..) mean "the directory above this one". They are ordinary path components, so you can chain them: `../..` goes up twice, and `../etc` goes up one level and then into etc.',
      syntax: 'cd ..',
      examples: [
        { command: 'cd ../..', explains: 'Moves up two levels in one step.' },
        { command: 'ls ..', explains: 'Lists the parent directory without moving there.' },
      ],
    },
    hints: [
      'You do not need to type any directory name at all.',
      'Two dots mean "the directory above this one".',
    ],
    solution: 'cd ..',
    expectedOutput: '/var',
    checks: [
      { type: 'cwd-equals', path: '/var', hint: 'Use `cd ..` -- two dots always means "the directory above this one".' },
      { type: 'command-matches', anyOf: ['cd ..', 'cd ../'], hint: 'Use the relative `cd ..` rather than typing the absolute path, since that is what this exercise teaches.' },
    ],
    debrief: 'One dot means "here", two means "up". `cd ../..` goes up twice, and so on.',
     practice: PACKAGE_1_PRACTICE['1.1.6'] ?? [],
  },
];

// --- Module 1.2: File operations --------------------------------------------

const MODULE_1_2: Exercise[] = [
  {
    id: '1.2.1',
    moduleId: '1.2',
    packageId: '1',
    order: 1,
    title: 'Create a file',
    kind: 'terminal',
    goal: 'Create an empty file.',
    prompt: 'Create a new empty file called test.txt in your home directory.',
    teach: {
      concept:
        '`touch` creates an empty file if it does not exist, and updates the timestamp if it does. It is the quickest way to make a file you are about to write into. Note what it prints when it works: nothing at all.',
      syntax: 'touch FILENAME',
      examples: [
        { command: 'touch report.md', explains: 'Creates an empty file called report.md here.' },
        { command: 'touch ~/scratch.txt', explains: 'Creates it in your home directory instead.' },
      ],
    },
    hints: [
      'The command is named after what it does to a file’s timestamp.',
      'It takes one argument: the name of the file to create.',
    ],
    solution: 'touch test.txt',
    expectedOutput: 'No output. Silence means success.',
    checks: [
      { type: 'fs-exists', path: `${HOME}/test.txt`, exists: true, kind: 'file', hint: 'After this runs, a file named test.txt should exist. Check with `ls`.' },
    ],
    debrief:
      'No output at all. That is the Unix convention: commands that succeed usually say nothing. Silence is good news.',
     practice: PACKAGE_1_PRACTICE['1.2.1'] ?? [],
  },
  {
    id: '1.2.2',
    moduleId: '1.2',
    packageId: '1',
    order: 2,
    title: 'Create a directory',
    kind: 'terminal',
    goal: 'Make a new directory.',
    prompt: 'Create a directory called logs in your home directory.',
    teach: {
      concept:
        '`mkdir` makes a directory. By default it will only create one level: if the parent does not exist, it fails. The `-p` option creates any missing parents along the way.',
      syntax: 'mkdir [-p] DIRECTORY',
      flags: [{ flag: '-p', means: 'Create parent directories as needed, and do not complain if it already exists.' }],
      examples: [
        { command: 'mkdir evidence', explains: 'Creates one directory here.' },
        { command: 'mkdir -p case/2026/notes', explains: 'Creates all three nested directories at once.' },
      ],
    },
    hints: ['The name is an abbreviation of "make directory".', 'It takes the directory name as its only argument.'],
    solution: 'mkdir logs',
    expectedOutput: 'No output.',
    checks: [
      { type: 'fs-exists', path: `${HOME}/logs`, exists: true, kind: 'dir', hint: 'A directory named logs should exist afterwards. `mkdir logs` creates it.' },
    ],
    debrief: 'Add `-p` when you need parent directories too: `mkdir -p a/b/c` creates all three.',
     practice: PACKAGE_1_PRACTICE['1.2.2'] ?? [],
  },
  {
    id: '1.2.3',
    moduleId: '1.2',
    packageId: '1',
    order: 3,
    title: 'Copy a file',
    kind: 'terminal',
    goal: 'Duplicate a file under a new name.',
    prompt: 'A file called test.txt already exists. Copy it to test_backup.txt.',
    setup: ['touch test.txt'],
    teach: {
      concept:
        '`cp` copies a file. The order of the two arguments matters and always reads left to right: source first, destination second. The original is left completely untouched. To copy a whole directory and everything inside it, add `-r` for recursive.',
      syntax: 'cp SOURCE DESTINATION',
      flags: [{ flag: '-r', means: 'Recursive: copy a directory and its contents.' }],
      examples: [
        { command: 'cp notes.txt notes.bak', explains: 'Copies a file to a new name in the same directory.' },
        { command: 'cp notes.txt /tmp/', explains: 'Copies it into another directory, keeping the name.' },
      ],
    },
    hints: [
      'Two letters, short for "copy". It takes two arguments.',
      'Source comes first, then the destination: cp WHAT WHERE.',
    ],
    solution: 'cp test.txt test_backup.txt',
    expectedOutput: 'No output.',
    checks: [
      { type: 'fs-exists', path: `${HOME}/test_backup.txt`, exists: true, kind: 'file', hint: 'The copy `test_backup.txt` should exist. The order is `cp SOURCE DESTINATION`.' },
      { type: 'fs-exists', path: `${HOME}/test.txt`, exists: true, kind: 'file', hint: 'The original test.txt must still be there -- `cp` copies, it does not move.' },
    ],
    debrief:
      'Copying evidence before you touch it is standard practice. `cp` never removes the original, which is exactly what you want during an investigation.',
     practice: PACKAGE_1_PRACTICE['1.2.3'] ?? [],
  },
  {
    id: '1.2.4',
    moduleId: '1.2',
    packageId: '1',
    order: 4,
    title: 'Rename a file',
    kind: 'terminal',
    goal: 'Rename (or move) a file.',
    prompt: 'Rename test_backup.txt to backup.txt.',
    setup: ['touch test_backup.txt'],
    teach: {
      concept:
        'Unix has no separate "rename" command, because renaming and moving are the same operation: you are changing a file’s path. `mv` does both. Same argument order as cp -- source first, destination second -- but the original name disappears.',
      syntax: 'mv SOURCE DESTINATION',
      examples: [
        { command: 'mv draft.txt final.txt', explains: 'Renames the file.' },
        { command: 'mv final.txt /tmp/', explains: 'Moves it elsewhere, keeping its name.' },
      ],
    },
    hints: ['Two letters, short for "move".', 'Old name first, new name second.'],
    solution: 'mv test_backup.txt backup.txt',
    expectedOutput: 'No output.',
    checks: [
      { type: 'fs-exists', path: `${HOME}/backup.txt`, exists: true, kind: 'file', hint: 'backup.txt should exist after the rename.' },
      { type: 'fs-exists', path: `${HOME}/test_backup.txt`, exists: false, hint: 'The old name should be gone -- `mv` moves rather than copies.' },
    ],
    debrief: 'Renaming and moving are the same operation in Unix: you are changing the path, nothing else.',
     practice: PACKAGE_1_PRACTICE['1.2.4'] ?? [],
  },
  {
    id: '1.2.5',
    moduleId: '1.2',
    packageId: '1',
    order: 5,
    title: 'Delete a file',
    kind: 'terminal',
    goal: 'Remove a file.',
    prompt: 'Delete the file test.txt.',
    setup: ['touch test.txt'],
    teach: {
      concept:
        '`rm` removes a file. There is no recycle bin and no confirmation prompt: the file is gone. This is the command that ends careers when combined carelessly with wildcards, so read your command back before pressing Enter.',
      syntax: 'rm FILENAME',
      flags: [
        { flag: '-r', means: 'Recursive: delete a directory and everything inside it.' },
        { flag: '-f', means: 'Force: do not complain about files that do not exist.' },
      ],
      examples: [{ command: 'rm scratch.txt', explains: 'Deletes one file, permanently and immediately.' }],
    },
    hints: ['Two letters, short for "remove".', 'It takes the filename as its only argument.'],
    solution: 'rm test.txt',
    expectedOutput: 'No output.',
    checks: [
      { type: 'fs-exists', path: `${HOME}/test.txt`, exists: false, hint: 'test.txt should no longer exist. `rm test.txt` removes it.' },
    ],
    debrief:
      'There is no recycle bin. `rm` is immediate and permanent, which is why `rm -rf` has its reputation. On a live investigation, copy first and delete never.',
     practice: PACKAGE_1_PRACTICE['1.2.5'] ?? [],
  },
  {
    id: '1.2.6',
    moduleId: '1.2',
    packageId: '1',
    order: 6,
    title: 'Delete a directory',
    kind: 'terminal',
    goal: 'Remove an empty directory.',
    prompt: 'Delete the logs directory.',
    setup: ['mkdir logs'],
    teach: {
      concept:
        '`rmdir` removes a directory, but only if it is completely empty. That restriction is a safety feature: if you have the wrong directory, it usually refuses. `rm -r` will take a directory and everything in it without asking, which is why you should reach for rmdir first.',
      syntax: 'rmdir DIRECTORY',
      examples: [
        { command: 'rmdir empty-folder', explains: 'Removes it, if nothing is inside.' },
        { command: 'rm -r full-folder', explains: 'Removes a directory and all its contents. Dangerous.' },
      ],
    },
    hints: ['It is "remove" and "directory" run together.', 'The directory must be empty for it to work.'],
    solution: 'rmdir logs',
    expectedOutput: 'No output.',
    checks: [
      { type: 'fs-exists', path: `${HOME}/logs`, exists: false, hint: 'The logs directory should be gone. `rmdir logs` removes an empty directory.' },
    ],
    debrief:
      '`rmdir` refuses to delete anything that still has files in it. That refusal is a safety feature -- it is `rm -r` that will take the whole tree without asking.',
     practice: PACKAGE_1_PRACTICE['1.2.6'] ?? [],
  },
];

// --- Module 1.3: Viewing files ----------------------------------------------

const MODULE_1_3: Exercise[] = [
  {
    id: '1.3.1',
    moduleId: '1.3',
    packageId: '1',
    order: 1,
    title: 'Read a whole file',
    kind: 'terminal',
    goal: 'Print the entire contents of a small file.',
    prompt: 'Display the full contents of /etc/hostname to confirm which machine you are on.',
    teach: {
      concept:
        '`cat` prints a file to the screen. It is perfect for short files and terrible for long ones, because it dumps everything at once with no way to stop. The name is short for "concatenate", since it will also join several files together.',
      syntax: 'cat FILE',
      examples: [
        { command: 'cat /etc/os-release', explains: 'Shows which Linux distribution this is.' },
        { command: 'cat /etc/resolv.conf', explains: 'Shows which DNS servers the host uses.' },
      ],
    },
    hints: [
      'Three letters, short for "concatenate".',
      'Give it the full path: /etc/hostname.',
    ],
    solution: 'cat /etc/hostname',
    expectedOutput: 'rmg-web-02',
    checks: [
      { type: 'command-matches', anyOf: ['cat /etc/hostname'], hint: 'Use `cat /etc/hostname`.' },
      { type: 'output-contains', text: 'rmg-web-02', hint: 'The output should be the hostname of this server.' },
    ],
    debrief:
      'rmg-web-02 is an internet-facing web server holding patient data. Always confirm which host you are on before you act on what you find.',
     practice: PACKAGE_1_PRACTICE['1.3.1'] ?? [],
  },
  {
    id: '1.3.2',
    moduleId: '1.3',
    packageId: '1',
    order: 2,
    title: 'Open a file too big to read at once',
    kind: 'terminal',
    goal: 'Reach for a pager instead of flooding your screen.',
    prompt:
      'Open /var/log/syslog with the standard pager, `less`. Read what this simulator tells you about it afterwards.',
    teach: {
      concept:
        'A pager shows a long file one screen at a time instead of dumping it all. `less` is the standard one. On a real system you move with the arrow keys or Space, search by typing /pattern, and quit with q. Be aware of this simulator’s honest limitation: a browser terminal cannot run an interactive pager, so `less` here prints one page and then explains itself.',
      syntax: 'less FILE',
      examples: [
        { command: 'less /etc/ssh/sshd_config', explains: 'Opens the SSH server configuration in the pager.' },
        { command: 'head -n 20 /var/log/syslog', explains: 'Often more practical: just take the first 20 lines.' },
      ],
    },
    hints: [
      'The pager’s name is the opposite of "more" -- and `more` is also a real, older pager.',
      'It takes the file path as its argument.',
    ],
    solution: 'less /var/log/syslog',
    expectedOutput:
      'The first page of the file, followed by a note explaining that this simulator has no interactive pager.',
    checks: [
      { type: 'command-matches', anyOf: ['less /var/log/syslog', 'more /var/log/syslog'], hint: 'Use `less /var/log/syslog`.' },
    ],
    debrief:
      'Worth practising on a real box, where the search-and-scroll keys matter. But for finding things, `grep` beats scrolling every single time -- which is exactly where this module is heading.',
     practice: PACKAGE_1_PRACTICE['1.3.2'] ?? [],
  },
  {
    id: '1.3.3',
    moduleId: '1.3',
    packageId: '1',
    order: 3,
    title: 'Read the start of a file',
    kind: 'terminal',
    goal: 'Preview the beginning of a large file.',
    prompt: `Show just the first 10 lines of /var/log/auth.log. The whole file is ${authLines.length.toLocaleString('en')} lines, so do not print all of it.`,
    teach: {
      concept:
        '`head` shows the beginning of a file. By default it gives you 10 lines; `-n` lets you ask for a specific number. Because log files are written in time order, the top of a log is its oldest content.',
      syntax: 'head [-n COUNT] FILE',
      flags: [{ flag: '-n COUNT', means: 'Show COUNT lines instead of the default 10.' }],
      examples: [
        { command: 'head /etc/passwd', explains: 'First 10 lines, the default.' },
        { command: 'head -n 3 /etc/passwd', explains: 'Just the first 3 lines.' },
      ],
    },
    hints: [
      'The command is named after the top of something.',
      'Use the -n option to say how many lines you want.',
    ],
    solution: 'head -n 10 /var/log/auth.log',
    expectedOutput: 'The 10 oldest entries in the authentication log.',
    checks: [
      { type: 'output-line-count', count: 10, hint: 'Exactly 10 lines should come back. `head -n 10 FILE` does that.' },
      { type: 'output-contains', text: 'rmg-web-02', hint: 'You should be reading /var/log/auth.log, whose lines all name this host.' },
    ],
    debrief:
      'The first lines of a log are its oldest. `head` tells you when logging started; it is rarely where an incident is.',
     practice: PACKAGE_1_PRACTICE['1.3.3'] ?? [],
  },
  {
    id: '1.3.4',
    moduleId: '1.3',
    packageId: '1',
    order: 4,
    title: 'Read the end of a file',
    kind: 'terminal',
    goal: 'See the most recent entries in a log.',
    prompt: 'Show the last 5 lines of /var/log/auth.log -- the most recent authentication events.',
    teach: {
      concept:
        '`tail` is the mirror image of `head`: it shows the end of a file, defaulting to the last 10 lines. Since logs append downward, the tail of a log is the newest activity, which is why it is usually the first thing an analyst looks at during a live incident.',
      syntax: 'tail [-n COUNT] FILE',
      flags: [
        { flag: '-n COUNT', means: 'Show the last COUNT lines.' },
        { flag: '-f', means: 'Follow: keep printing new lines as they are written. (Real systems only.)' },
      ],
      examples: [
        { command: 'tail /var/log/syslog', explains: 'The last 10 lines.' },
        { command: 'tail -n 50 /var/log/syslog', explains: 'The last 50 lines.' },
      ],
    },
    hints: [
      'It is the opposite of the command you used in the previous exercise.',
      'Same -n option, asking for 5 this time.',
    ],
    solution: 'tail -n 5 /var/log/auth.log',
    expectedOutput: 'The 5 newest entries in the authentication log.',
    checks: [
      { type: 'output-line-count', count: 5, hint: 'Exactly 5 lines should come back. `tail -n 5 FILE` does that.' },
      { type: 'command-matches', anyOf: ['^tail\\b'], regex: true, hint: 'Use `tail`, not `head` -- you want the end of the file.' },
    ],
    debrief:
      '`tail` is the command you run first during a live incident, because the newest events are at the bottom. On a real box `tail -f` follows a log as it is written.',
     practice: PACKAGE_1_PRACTICE['1.3.4'] ?? [],
  },
];

// --- Module 1.4: Searching and filtering -------------------------------------

const FAILED_COUNT = countAuth('Failed');
const FAILED_LOWER_COUNT = countAuth('failed', true);
const INVALID_USER_COUNT = countAuth('invalid user');
const SUDO_COUNT = countAuth('sudo');
const SSH_COUNT = countAuth('ssh');

const MODULE_1_4: Exercise[] = [
  {
    id: '1.4.1',
    moduleId: '1.4',
    packageId: '1',
    order: 1,
    title: 'Search a file for a word',
    kind: 'terminal',
    goal: 'Filter a log down to matching lines.',
    prompt:
      'Search /var/log/auth.log for every line containing the word Failed. Do not worry about counting them yet -- just get the matching lines on screen.',
    teach: {
      concept:
        '`grep` is the single most important command in log analysis. You give it something to look for and a file to look in, and it prints every line that matches, throwing away the rest. Quoting the pattern is a good habit: without quotes, the shell may try to interpret spaces or special characters before grep ever sees them.',
      syntax: 'grep "PATTERN" FILE',
      examples: [
        { command: 'grep "root" /etc/passwd', explains: 'Prints only the lines of /etc/passwd mentioning root.' },
        { command: 'grep "nameserver" /etc/resolv.conf', explains: 'Pulls the DNS server lines out of the resolver config.' },
      ],
    },
    hints: [
      'Four letters. The order is: command, then what to look for, then where to look.',
      'Put the word in double quotes, then give the path /var/log/auth.log.',
    ],
    solution: 'grep "Failed" /var/log/auth.log',
    expectedOutput: 'Many lines, each containing "Failed password for ...".',
    checks: [
      { type: 'command-matches', anyOf: ['^grep\\b'], regex: true, hint: 'Use `grep PATTERN FILE`.' },
      { type: 'output-contains', text: 'Failed password', hint: 'The matching lines should contain "Failed password".' },
      { type: 'output-excludes', text: 'Accepted', hint: 'Only matching lines should appear. If you see "Accepted" lines, you printed the whole file rather than filtering it.' },
    ],
    debrief: `That is ${FAILED_COUNT.toLocaleString('en')} lines. Far too many to read, and that is the real lesson: on a live host, failed logins are constant background noise. Finding them is easy. Deciding which ones matter is the job.`,
     practice: PACKAGE_1_PRACTICE['1.4.1'] ?? [],
  },
  {
    id: '1.4.2',
    moduleId: '1.4',
    packageId: '1',
    order: 2,
    title: 'Search without caring about case',
    kind: 'terminal',
    goal: 'Match regardless of capitalisation.',
    prompt:
      'Search /var/log/auth.log for the word "failed" in any combination of upper and lower case.',
    teach: {
      concept:
        'grep is case-sensitive by default: "Failed" and "failed" are different searches. That trips people up constantly, because different services on the same machine capitalise differently in the same log file. The `-i` option makes the match case-insensitive.',
      syntax: 'grep -i "PATTERN" FILE',
      flags: [{ flag: '-i', means: 'Ignore case when matching.' }],
      examples: [
        { command: 'grep -i "error" /var/log/syslog', explains: 'Finds Error, error, and ERROR alike.' },
      ],
    },
    hints: [
      'You need one extra option on the grep command you just used.',
      'The option is a single letter, and it stands for "ignore case".',
    ],
    solution: 'grep -i "failed" /var/log/auth.log',
    expectedOutput: 'Lines containing Failed, failed, or FAILED.',
    checks: [
      { type: 'command-has-flag', command: 'grep', flags: ['i'], hint: 'Add the `-i` flag to make the search case-insensitive.' },
      { type: 'output-contains', text: 'ailed', hint: 'You should still be searching auth.log for "failed".' },
    ],
    debrief: `Case-insensitive finds ${FAILED_LOWER_COUNT.toLocaleString('en')} lines against ${FAILED_COUNT.toLocaleString('en')} case-sensitive. When you are searching for evidence rather than confirming a hunch, reach for -i by default.`,
     practice: PACKAGE_1_PRACTICE['1.4.2'] ?? [],
  },
  {
    id: '1.4.3',
    moduleId: '1.4',
    packageId: '1',
    order: 3,
    title: 'Count matches instead of listing them',
    kind: 'terminal',
    goal: 'Get a number rather than a wall of text.',
    prompt:
      'Count how many lines in /var/log/auth.log contain the phrase "invalid user". You want a single number, not the lines themselves.',
    teach: {
      concept:
        'Often the count is the finding, not the lines. `grep -c` prints how many lines matched instead of printing them. Watch your capitalisation here: this log contains both "Invalid user" at the start of one message and "invalid user" inside another, and they are different searches unless you add -i.',
      syntax: 'grep -c "PATTERN" FILE',
      flags: [{ flag: '-c', means: 'Count matching lines instead of printing them.' }],
      examples: [
        { command: 'grep -c "bash" /etc/passwd', explains: 'How many accounts have a bash shell.' },
      ],
    },
    hints: [
      'One option turns grep’s output into a single number.',
      'The option letter stands for "count". Keep the phrase in lower case exactly as written.',
    ],
    solution: 'grep -c "invalid user" /var/log/auth.log',
    expectedOutput: String(INVALID_USER_COUNT),
    checks: [
      { type: 'output-numeric', equals: INVALID_USER_COUNT, hint: `The answer is a single number. Use \`grep -c "invalid user" /var/log/auth.log\`. Watch the case -- "Invalid user" with a capital I appears on different lines.` },
    ],
    debrief: `"invalid user" means the account did not exist at all -- somebody guessing usernames. ${INVALID_USER_COUNT.toLocaleString('en')} of those is a scanner working through a wordlist, not a targeted attack.`,
     practice: PACKAGE_1_PRACTICE['1.4.3'] ?? [],
  },
  {
    id: '1.4.4',
    moduleId: '1.4',
    packageId: '1',
    order: 4,
    title: 'Show which line each match is on',
    kind: 'terminal',
    goal: 'Get line numbers alongside matches.',
    prompt:
      'Find every line mentioning sudo in /var/log/auth.log, and show the line number of each one.',
    teach: {
      concept:
        '`grep -n` prefixes every match with its line number in the source file. That matters during an investigation: line numbers let you point a colleague at exactly what you saw, and let you go back to the surrounding context later.',
      syntax: 'grep -n "PATTERN" FILE',
      flags: [{ flag: '-n', means: 'Prefix each match with its line number.' }],
      examples: [
        { command: 'grep -n "root" /etc/passwd', explains: 'Shows which line of the file root is defined on.' },
      ],
    },
    hints: [
      'One more single-letter option on grep.',
      'It stands for "number".',
    ],
    solution: 'grep -n "sudo" /var/log/auth.log',
    expectedOutput: 'Lines formatted as "1234:Aug 15 ... sudo: ...".',
    checks: [
      { type: 'command-has-flag', command: 'grep', flags: ['n'], hint: 'Add `-n` to prefix each match with its line number.' },
      { type: 'output-matches', pattern: '^\\d+:', flags: 'm', hint: 'Each output line should start with a number and a colon, like "412:".' },
      { type: 'output-contains', text: 'sudo', hint: 'You should be searching for sudo.' },
    ],
    debrief: `Only ${SUDO_COUNT} sudo lines in the whole day, against thousands of failed logins. Rare events are usually the interesting ones. Read those lines closely: one account does something no ordinary user should be doing.`,
     practice: PACKAGE_1_PRACTICE['1.4.4'] ?? [],
  },
  {
    id: '1.4.5',
    moduleId: '1.4',
    packageId: '1',
    order: 5,
    title: 'Chain two commands with a pipe',
    kind: 'terminal',
    goal: 'Feed one command’s output into another.',
    prompt:
      'Count how many lines in /var/log/auth.log mention ssh, using a pipe to connect two commands rather than grep’s own counting flag.',
    teach: {
      concept:
        'The pipe character | takes the output of the command on its left and feeds it as input to the command on its right. Nothing is written to disk; the data flows straight through. This is the central idea of the shell: lots of small tools, each doing one thing, chained into something bigger. `wc -l` counts the lines it is given, so "grep something | wc -l" means "find the matching lines, then count them".',
      syntax: 'COMMAND | COMMAND',
      flags: [{ flag: 'wc -l', means: 'Count lines of whatever is piped in.' }],
      examples: [
        { command: 'cat /etc/passwd | wc -l', explains: 'How many accounts exist on the system.' },
        { command: 'grep "bash" /etc/passwd | wc -l', explains: 'How many of those accounts use bash.' },
      ],
    },
    hints: [
      'The pipe character is | -- usually shift-backslash.',
      'Run a normal grep for "ssh", then pipe it into a command that counts lines.',
    ],
    solution: 'grep "ssh" /var/log/auth.log | wc -l',
    expectedOutput: String(SSH_COUNT),
    checks: [
      { type: 'command-uses-pipe', hint: 'This exercise is about the pipe. Connect two commands with the | character.' },
      { type: 'output-numeric', equals: SSH_COUNT, hint: 'Pipe grep into `wc -l`, which counts lines: `grep "ssh" /var/log/auth.log | wc -l`.' },
    ],
    debrief:
      'The pipe is the single most important idea in the shell: every command becomes a filter you can bolt onto the next. Almost all real log analysis is three or four small tools chained this way.',
     practice: PACKAGE_1_PRACTICE['1.4.5'] ?? [],
  },
  {
    id: '1.4.6',
    moduleId: '1.4',
    packageId: '1',
    order: 6,
    title: 'Search across many files at once',
    kind: 'terminal',
    goal: 'Use a wildcard to search a whole directory.',
    prompt:
      "Logs get rotated at midnight: today's authentication log is auth.log, and yesterday's is auth.log.1. Search BOTH of them for \"Failed password\" in one command, using a wildcard rather than naming each file.",
    teach: {
      concept:
        'The asterisk * is a wildcard meaning "any characters". The shell expands it into a list of matching filenames BEFORE the command runs, so grep never sees the star -- it just receives several filenames. That is also why grep starts prefixing each result with the file it came from: it now knows it is searching more than one.',
      syntax: 'grep "PATTERN" /path/prefix*',
      examples: [
        { command: 'ls /var/log/*.log', explains: 'Lists every file in /var/log whose name ends in .log.' },
        { command: 'grep "sshd" /var/log/*.log', explains: 'Searches all of those at once, prefixing each hit with the file it came from.' },
      ],
    },
    hints: [
      'Both files start with the same word, so a single wildcard can catch the pair.',
      'The path you want is /var/log/auth* -- the star matches both ".log" and ".log.1".',
    ],
    solution: 'grep "Failed password" /var/log/auth*',
    expectedOutput: 'Matching lines from both log files, each prefixed with the file it came from.',
    checks: [
      { type: 'command-matches', anyOf: ['auth\\*'], regex: true, hint: 'Use the wildcard pattern /var/log/auth* so the shell expands it to both log files.' },
      { type: 'output-contains', text: '/var/log/auth.log:', hint: "Matches from today's log should be prefixed with its filename." },
      { type: 'output-contains', text: '/var/log/auth.log.1:', hint: "Yesterday's rotated log should be searched too -- widen the wildcard." },
    ],
    debrief:
      'The shell expands the * before grep ever runs, which is why the filename prefixes appear automatically. This matters more than it looks: logs rotate at midnight, so an incident that starts late at night is split across two files. Searching only the current one silently loses half the story.',
     practice: PACKAGE_1_PRACTICE['1.4.6'] ?? [],
  },
];

export const PACKAGE_1: LearningPackage = {
  id: '1',
  order: 1,
  title: 'Linux Fundamentals',
  summary:
    'Move around a Linux server, work with files, read logs, and search them. Everything else in this course assumes these 22 commands.',
  outcomes: [
    'Navigate the filesystem confidently and know where you are at all times',
    'Create, copy, rename, and delete files and directories',
    'Read large log files without drowning in them',
    'Search and filter text with grep, and chain commands together with pipes',
  ],
  prerequisites: [],
  modules: [
    {
      id: '1.1',
      packageId: '1',
      order: 1,
      title: 'Navigation and the filesystem',
      summary: 'Find out where you are and move somewhere else.',
      exercises: MODULE_1_1,
    },
    {
      id: '1.2',
      packageId: '1',
      order: 2,
      title: 'File operations',
      summary: 'Create, copy, rename, and remove files and directories.',
      exercises: MODULE_1_2,
    },
    {
      id: '1.3',
      packageId: '1',
      order: 3,
      title: 'Viewing file contents',
      summary: 'Read files, including ones far too large to print.',
      exercises: MODULE_1_3,
    },
    {
      id: '1.4',
      packageId: '1',
      order: 4,
      title: 'Searching and filtering',
      summary: 'Find the handful of lines that matter inside thousands.',
      exercises: MODULE_1_4,
    },
  ],
};
