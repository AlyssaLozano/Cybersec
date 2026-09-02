/**
 * Linux Fundamentals -- 40 exercises across 7 modules.
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
import { LINUX_FUNDAMENTALS_PRACTICE } from './linux-fundamentals-practice.js';

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
    id: 'linux.1.1',
    moduleId: '1.1',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.1.1'] ?? [],
  },
  {
    id: 'linux.1.2',
    moduleId: '1.1',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.1.2'] ?? [],
  },
  {
    id: 'linux.1.3',
    moduleId: '1.1',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.1.3'] ?? [],
  },
  {
    id: 'linux.1.4',
    moduleId: '1.1',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.1.4'] ?? [],
  },
  {
    id: 'linux.1.5',
    moduleId: '1.1',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.1.5'] ?? [],
  },
  {
    id: 'linux.1.6',
    moduleId: '1.1',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.1.6'] ?? [],
  },
];

// --- Module 1.2: File operations --------------------------------------------

const MODULE_1_2: Exercise[] = [
  {
    id: 'linux.2.1',
    moduleId: '1.2',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.2.1'] ?? [],
  },
  {
    id: 'linux.2.2',
    moduleId: '1.2',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.2.2'] ?? [],
  },
  {
    id: 'linux.2.3',
    moduleId: '1.2',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.2.3'] ?? [],
  },
  {
    id: 'linux.2.4',
    moduleId: '1.2',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.2.4'] ?? [],
  },
  {
    id: 'linux.2.5',
    moduleId: '1.2',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.2.5'] ?? [],
  },
  {
    id: 'linux.2.6',
    moduleId: '1.2',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.2.6'] ?? [],
  },
];

// --- Module 1.3: Viewing files ----------------------------------------------

const MODULE_1_3: Exercise[] = [
  {
    id: 'linux.3.1',
    moduleId: '1.3',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.3.1'] ?? [],
  },
  {
    id: 'linux.3.2',
    moduleId: '1.3',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.3.2'] ?? [],
  },
  {
    id: 'linux.3.3',
    moduleId: '1.3',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.3.3'] ?? [],
  },
  {
    id: 'linux.3.4',
    moduleId: '1.3',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.3.4'] ?? [],
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
    id: 'linux.4.1',
    moduleId: '1.4',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.4.1'] ?? [],
  },
  {
    id: 'linux.4.2',
    moduleId: '1.4',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.4.2'] ?? [],
  },
  {
    id: 'linux.4.3',
    moduleId: '1.4',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.4.3'] ?? [],
  },
  {
    id: 'linux.4.4',
    moduleId: '1.4',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.4.4'] ?? [],
  },
  {
    id: 'linux.4.5',
    moduleId: '1.4',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.4.5'] ?? [],
  },
  {
    id: 'linux.4.6',
    moduleId: '1.4',
    packageId: 'linux-fundamentals',
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
     practice: LINUX_FUNDAMENTALS_PRACTICE['linux.4.6'] ?? [],
  },
];

// --- Module 1.5: Permissions and ownership -----------------------------------

const MODULE_1_5: Exercise[] = [
  {
    id: 'linux.5.1',
    moduleId: '1.5',
    packageId: 'linux-fundamentals',
    order: 1,
    title: 'Read a permission string',
    kind: 'terminal',
    goal: 'Decode the ten characters at the start of an ls -l line.',
    prompt:
      'Show the detailed listing for /etc/shadow, the file that holds password hashes, and read who is allowed to do what with it.',
    teach: {
      concept:
        'The ten characters at the front of an `ls -l` line answer "who can do what". The first is the type: a dash for a normal file, d for a directory, l for a symbolic link. The remaining nine are three groups of three, and each group is read as rwx: read, write, execute.\n\nThe groups are OWNER, GROUP, then EVERYONE ELSE, in that order. So `-rw-r-----` is a file whose owner may read and write it, whose group may read it, and which everybody else cannot touch at all. The two names after the link count are the owner and the group, which is what makes those permission groups mean something concrete.',
      syntax: 'ls -l FILE',
      examples: [
        {
          command: 'ls -l /etc/passwd',
          explains: 'The account list, which is readable by everyone, unlike the file of hashes beside it.',
        },
      ],
      flags: [{ flag: '-l', means: 'Long format: permissions, owner, group, size, and time.' }],
    },
    hints: [
      'One command, one flag, one path.',
      'Read the output from the left: type, then owner, then group, then everyone else.',
    ],
    solution: 'ls -l /etc/shadow',
    expectedOutput: 'A file owned by root, group shadow, with no permissions at all for other users.',
    checks: [
      {
        type: 'output-contains',
        text: 'shadow',
        hint: 'The listing should name the file and its group.',
      },
      {
        type: 'output-contains',
        text: 'rw-r-----',
        hint: 'The permission string should be visible, which needs the -l flag.',
      },
    ],
    debrief:
      'The last three characters are dashes, which is the whole security model of this file: an ordinary user cannot read it, so they cannot take the hashes away and attack them offline. Any host where that string has changed is a finding.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.5.1'] ?? [],
  },
  {
    id: 'linux.5.2',
    moduleId: '1.5',
    packageId: 'linux-fundamentals',
    order: 2,
    title: 'Find the programs that run as root',
    kind: 'terminal',
    goal: 'Search for setuid binaries, which are the classic privilege escalation surface.',
    prompt:
      'Find every file under /usr/bin that has the setuid bit set, which means it runs with its owner\'s privileges rather than yours.',
    teach: {
      concept:
        'Normally a program runs as whoever started it. A setuid binary runs as its OWNER instead, which for a root-owned file means it runs as root no matter who launched it. That is how `passwd` can edit /etc/shadow when you cannot: the program is trusted even though you are not.\n\nA short list of these is expected on any Linux host and is fine. A LONG list, or one containing something that has no business being there, is the first place an attacker looks, because a setuid program with a flaw in it is a direct route from ordinary user to root. `find -perm -4000` matches the setuid bit specifically, and the leading dash means "has at least these bits" rather than "matches exactly".',
      syntax: 'find PATH -perm -4000',
      examples: [
        {
          command: 'find /usr/sbin -perm -4000',
          explains: 'The same hunt in the system binaries directory, which on a healthy host finds nothing.',
        },
      ],
      flags: [{ flag: '-perm -MODE', means: 'Match files having at least the given permission bits set.' }],
    },
    hints: [
      'find takes the directory first, then the test.',
      'The setuid bit is 4000, and the leading dash means "at least these bits".',
    ],
    solution: 'find /usr/bin -perm -4000',
    expectedOutput: 'Nine setuid binaries, all of them standard Ubuntu programs.',
    checks: [
      {
        type: 'output-contains',
        text: '/usr/bin/sudo',
        hint: 'sudo is setuid by design, so it should be in the list.',
      },
      {
        type: 'output-contains',
        text: '/usr/bin/passwd',
        hint: 'passwd is setuid too: that is how it edits a file you cannot read.',
      },
      {
        type: 'output-excludes',
        text: '/usr/bin/bash',
        hint: 'A setuid shell would be a serious finding. It is not on this host, so it should not appear.',
      },
    ],
    debrief:
      'Nine, and every one of them is a standard Ubuntu program. Learn roughly what that list looks like: a setuid copy of bash, python, or find in it is not a misconfiguration, it is somebody keeping a way back to root.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.5.2'] ?? [],
  },
  {
    id: 'linux.5.3',
    moduleId: '1.5',
    packageId: 'linux-fundamentals',
    order: 3,
    title: 'Find what anybody can write to',
    kind: 'terminal',
    goal: 'Search by permission for world-writable files.',
    prompt:
      'Find every regular file under /tmp that any user on the system can write to.',
    teach: {
      concept:
        'A world-writable file is one that any account on the host can modify, which matters because a file is only as trustworthy as the least trustworthy person who can edit it. A world-writable script that root runs on a schedule is a straight path to root.\n\n/tmp is world-writable by design, so files in it are not automatically a finding. The reason to look anyway is that /tmp is where things get staged: it is writable by everybody, it is rarely monitored, and its contents are expected to be junk, which makes it the natural place to leave something you do not want examined.',
      syntax: 'find PATH -type f -perm -002',
      examples: [
        {
          command: 'find /etc -type f -perm -002',
          explains: 'The same search somewhere it genuinely matters: a world-writable file in /etc would be a real finding.',
        },
      ],
      flags: [
        { flag: '-type f', means: 'Regular files only, not directories.' },
        { flag: '-perm -002', means: 'Has at least the write bit for other users.' },
      ],
    },
    hints: [
      'Two tests on the same find: the type, and the permission.',
      'The write bit for everybody else is the 2 in the last position: 002.',
    ],
    solution: 'find /tmp -type f -perm -002',
    expectedOutput: 'Three files, one of them a compressed archive.',
    checks: [
      {
        type: 'output-contains',
        text: 'pt.tar.gz',
        hint: 'One of the world-writable files is an archive. It should appear.',
      },
      {
        type: 'output-excludes',
        text: '/tmp/.cache\n',
        hint: 'Restrict to regular files with -type f, so directories do not appear.',
      },
    ],
    debrief:
      'Note what turned up: a compressed archive in a hidden directory under /tmp. Nothing about that is proof of anything on its own, and it is exactly the kind of thing worth two more minutes of your attention.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.5.3'] ?? [],
  },
  {
    id: 'linux.5.4',
    moduleId: '1.5',
    packageId: 'linux-fundamentals',
    order: 4,
    title: 'Change what a file allows',
    kind: 'terminal',
    goal: 'Use chmod with octal notation, and verify the result rather than assuming it.',
    prompt:
      'Create a file called notes-private.txt in your home directory, then set its permissions so that only you can read and write it, and nobody else can do anything with it.',
    teach: {
      concept:
        'Octal notation compresses each permission group into one digit: read is 4, write is 2, execute is 1, and you add them together. So 6 is read plus write, 7 is all three, 5 is read plus execute, and 0 is nothing.\n\nThree digits, in the order owner, group, everyone else. 600 therefore means the owner may read and write, and nobody else may do anything. 644 is the common default for a document; 755 is the common default for a directory or a program, because a directory needs the execute bit to be entered at all.\n\nAlways check afterwards. Setting permissions is one of the easiest things to get subtly wrong, and the failure is silent: the command succeeds, the file is readable by the wrong people, and nothing tells you.',
      syntax: 'chmod OCTAL FILE',
      examples: [
        {
          command: 'chmod 644 /home/student/notes.txt',
          explains: 'Owner may read and write; everybody else may read. The usual setting for an ordinary document.',
        },
      ],
    },
    hints: [
      'Two commands: create the file, then change its mode.',
      'Read plus write is 4 plus 2. Nothing at all is 0.',
      'The mode you want is 600.',
    ],
    solution: 'touch notes-private.txt\nchmod 600 notes-private.txt\nls -l notes-private.txt',
    expectedOutput: 'A file with permissions rw-------.',
    checks: [
      {
        type: 'fs-exists',
        path: '/home/student/notes-private.txt',
        exists: true,
        kind: 'file',
        hint: 'Create the file first, in your home directory.',
      },
      {
        type: 'output-contains',
        text: 'rw-------',
        hint: 'After chmod, list the file so you can see the permissions you set.',
      },
    ],
    debrief:
      'The habit worth taking from this is the third command. Setting a permission and checking it are two different actions, and only one of them tells you what actually happened.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.5.4'] ?? [],
  },
  {
    id: 'linux.5.5',
    moduleId: '1.5',
    packageId: 'linux-fundamentals',
    order: 5,
    title: 'Who owns the home directories',
    kind: 'terminal',
    goal: 'Read ownership across a directory, and notice an account you were not expecting.',
    prompt: 'Show the detailed listing of /home, so you can see which accounts have a home directory and who owns each one.',
    teach: {
      concept:
        'Listing /home is a fast way to see who actually uses a machine, and it is often more honest than the account list, because a home directory only exists once somebody has been set up properly.\n\nWhat you are reading for is a name you cannot account for. Service accounts usually have no home directory or one somewhere else entirely, so a new directory in /home owned by an account nobody recognises is worth asking about. Compare what you find here against what the team says should be there: the mismatch is the finding.',
      syntax: 'ls -l DIRECTORY',
      examples: [
        {
          command: 'ls -la /home/student',
          explains: 'One home directory in detail, including the dotfiles that a plain ls hides.',
        },
      ],
    },
    hints: [
      'Same long listing as before, pointed at a directory instead of a file.',
      'Read the owner column, and ask whether you can name every account in it.',
    ],
    solution: 'ls -l /home',
    expectedOutput: 'Several home directories, each owned by its own account.',
    checks: [
      {
        type: 'output-contains',
        text: 'sysmon',
        hint: 'One of the directories belongs to an account called sysmon.',
      },
      {
        type: 'output-contains',
        text: 'testuser',
        hint: 'The listing should show every home directory, testuser included.',
      },
    ],
    debrief:
      'There is a home directory for an account called sysmon. It sounds like monitoring software and it is not: the Log Analysis package shows that account being created through sudo at 10:22 on the day these logs cover. A plausible-sounding name is the cheapest camouflage there is.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.5.5'] ?? [],
  },
  {
    id: 'linux.5.6',
    moduleId: '1.5',
    packageId: 'linux-fundamentals',
    order: 6,
    title: 'What permission denied actually tells you',
    kind: 'terminal',
    goal: 'Read a refusal as information rather than as a dead end.',
    prompt:
      'Try to read the crontab file belonging to the sysmon account, at /var/spool/cron/crontabs/sysmon, and read the error you get back.',
    teach: {
      concept:
        'A permission denied is not a failure of your command, it is an answer. It tells you the path EXISTS, that you are not permitted to read it, and therefore that somebody with more privilege would learn something you cannot. All three of those are useful, and the third is the one to write down: "I could not read X, and it should be checked by somebody who can" is a legitimate handover line.\n\nThe alternative error is worth telling apart. "No such file or directory" means the path is not there at all, which is a different fact entirely. Confusing the two leads to reporting that something is absent when it is merely out of reach.',
      syntax: 'cat FILE',
      examples: [
        {
          command: 'cat /etc/shadow',
          explains: 'The same refusal on the password hash file, for the same reason.',
        },
      ],
    },
    hints: [
      'Just try to read it. The error is the point of the exercise.',
      'Read the message carefully: it is not saying the file is missing.',
    ],
    solution: 'cat /var/spool/cron/crontabs/sysmon',
    expectedOutput: 'Permission denied.',
    checks: [
      {
        type: 'output-contains',
        text: 'Permission denied',
        hint: 'You should be refused. Read what the refusal says.',
      },
      {
        type: 'output-excludes',
        text: 'No such file',
        hint: 'The file exists. If you got a missing-file error, check the path.',
      },
    ],
    debrief:
      'A scheduled task belonging to that account exists, and you cannot see what it runs. That is a finding in its own right and it is exactly what escalation is for: you have narrowed a question down to one file and one privilege you do not have.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.5.6'] ?? [],
  },
];

// --- Module 1.6: Finding things on disk --------------------------------------

const MODULE_1_6: Exercise[] = [
  {
    id: 'linux.6.1',
    moduleId: '1.6',
    packageId: 'linux-fundamentals',
    order: 1,
    title: 'Find a file by name',
    kind: 'terminal',
    goal: 'Search a directory tree by filename pattern.',
    prompt: 'Find every file under /home whose name ends in .sql.',
    teach: {
      concept:
        '`find` walks a directory tree and tests every entry it meets. `-name` matches the filename against a pattern, and the pattern uses the same wildcards the shell does, so `*.sql` means anything ending in .sql.\n\nQuote the pattern. Without quotes the shell expands the wildcard itself, against the CURRENT directory, before find ever runs, which usually produces either no results or the wrong ones. This trips up nearly everybody once and the failure looks like find not working.',
      syntax: "find PATH -name 'PATTERN'",
      examples: [
        {
          command: "find /var/log -name '*.log'",
          explains: 'Every log file under /var/log, including the ones in subdirectories.',
        },
      ],
      flags: [{ flag: '-name', means: 'Match the filename against a shell-style pattern.' }],
    },
    hints: [
      'find takes the directory to search first, then the test.',
      'Put the pattern in quotes so the shell leaves it alone.',
    ],
    solution: "find /home -name '*.sql'",
    expectedOutput: 'One database dump, in a user home directory.',
    checks: [
      {
        type: 'output-contains',
        text: 'portal-db-dump.sql',
        hint: 'There is one .sql file under /home.',
      },
    ],
    debrief:
      'A database dump sitting in somebody\'s home directory. Probably a developer who was debugging something; also a complete copy of patient data outside the database, with none of its access controls. Both things are true at once, which is why it is worth mentioning.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.6.1'] ?? [],
  },
  {
    id: 'linux.6.2',
    moduleId: '1.6',
    packageId: 'linux-fundamentals',
    order: 2,
    title: 'See the files that are hidden',
    kind: 'terminal',
    goal: 'Reveal dotfiles, which ls omits by default.',
    prompt: 'List everything in /tmp/.cache, including hidden entries, in long format.',
    teach: {
      concept:
        'Any name beginning with a dot is hidden from a plain `ls`. There is no security in that: it is a display convention, and it exists so your home directory is not full of configuration files. `-a` shows them.\n\nThe convention gets used deliberately. A directory called `.cache` in /tmp looks like something a program made and nobody reads, which is precisely why it is a good place to put something. Any time you are looking at a machine seriously, look with -a, because half of what is interesting starts with a dot.',
      syntax: 'ls -la DIRECTORY',
      examples: [
        {
          command: 'ls -la /home/student',
          explains: 'A home directory with its dotfiles showing: .bashrc, .profile, and anything else left there.',
        },
      ],
      flags: [
        { flag: '-a', means: 'Show entries beginning with a dot.' },
        { flag: '-l', means: 'Long format, with permissions, owner, size and time.' },
      ],
    },
    hints: [
      'Two flags, and they can be written together.',
      'The one that reveals hidden entries is -a.',
    ],
    solution: 'ls -la /tmp/.cache',
    expectedOutput: 'An archive and a small executable file, both owned by sysmon or root.',
    checks: [
      {
        type: 'output-contains',
        text: 'pt.tar.gz',
        hint: 'The directory contains an archive.',
      },
      {
        type: 'output-contains',
        text: 'sysmon',
        hint: 'Use -l so the owner column shows.',
      },
    ],
    debrief:
      'A six-megabyte archive and a small executable, in a hidden directory, owned by an account created that morning. Nothing here is proof on its own. Together they are the shape of somebody staging data before taking it away.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.6.2'] ?? [],
  },
  {
    id: 'linux.6.3',
    moduleId: '1.6',
    packageId: 'linux-fundamentals',
    order: 3,
    title: 'Find what changed recently',
    kind: 'terminal',
    goal: 'Search by modification time, which is how you scope to an incident window.',
    prompt: 'Find every regular file under /var/log that was modified in the last day.',
    teach: {
      concept:
        'Time is the most useful filter an investigation has. If you know roughly when something happened, "what changed around then" turns a filesystem with hundreds of thousands of files into a list you can read.\n\n`-mtime` counts in days: `-mtime -1` means modified less than one day ago, `-mtime +7` means more than seven days ago, and a bare `-mtime 1` means exactly one day, which is almost never what you want. The minus sign is doing real work in that expression, and leaving it off is the usual reason this returns nothing.',
      syntax: 'find PATH -mtime -DAYS -type f',
      examples: [
        {
          command: "find /home -mtime -1 -type f",
          explains: 'The same window applied to user home directories, which is where changes are more suspicious.',
        },
      ],
      flags: [{ flag: '-mtime -N', means: 'Modified less than N days ago.' }],
    },
    hints: [
      'The test is -mtime, and the value needs a minus sign to mean "less than".',
      'Add -type f so you get files rather than the directories containing them.',
    ],
    solution: 'find /var/log -mtime -1 -type f',
    expectedOutput: 'The logs that have been written to today.',
    checks: [
      {
        type: 'output-contains',
        text: '/var/log/auth.log',
        hint: 'The authentication log has been written to recently and should appear.',
      },
      {
        type: 'output-excludes',
        text: 'auth.log.1',
        hint: 'The rotated log is older than a day, so a correct time filter excludes it.',
      },
    ],
    debrief:
      'Notice what the filter excluded: the rotated log, which is a day old. That is the behaviour you want, and it is also a reminder that a time-scoped search will hide anything outside the window you chose. Choose it deliberately.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.6.3'] ?? [],
  },
  {
    id: 'linux.6.4',
    moduleId: '1.6',
    packageId: 'linux-fundamentals',
    order: 4,
    title: 'Find out what is using the space',
    kind: 'terminal',
    goal: 'Measure disk usage, which is both an operational and an investigative question.',
    prompt: 'Show the total size of /tmp/.cache in human-readable units.',
    teach: {
      concept:
        '`du` reports how much space a path uses, adding up everything beneath it; `df` reports how much space a filesystem has left. The two get confused constantly and answer different questions: du is "what is taking the room", df is "how much room is there".\n\n`-h` on either one converts bytes into human-readable units. For an investigation the interesting version of this question is not "are we running out of disk" but "why is there six megabytes in a temporary directory nobody uses", which is the same command asked with a different intent.',
      syntax: 'du -h PATH',
      examples: [
        {
          command: 'df -h',
          explains: 'The other question: how much free space each filesystem has left.',
        },
      ],
      flags: [
        { flag: '-h', means: 'Human-readable sizes: K, M, G rather than raw blocks.' },
        { flag: '-s', means: 'Summarise: one total for the path rather than a line per subdirectory.' },
      ],
    },
    hints: [
      'The command that measures what a path uses is du.',
      'Add -h so you get megabytes rather than a block count.',
    ],
    solution: 'du -h /tmp/.cache',
    expectedOutput: 'About six megabytes.',
    checks: [
      {
        type: 'output-contains',
        text: 'M',
        hint: 'With -h the size should be shown in megabytes rather than blocks.',
      },
      {
        type: 'output-contains',
        text: '/tmp/.cache',
        hint: 'The path should appear alongside its size.',
      },
    ],
    debrief:
      'Six megabytes of something in a hidden temporary directory. On a quiet server that is a lot of data to have appeared for no stated reason, and size is often the thing that makes staged data visible when nothing else does.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.6.4'] ?? [],
  },
  {
    id: 'linux.6.5',
    moduleId: '1.6',
    packageId: 'linux-fundamentals',
    order: 5,
    title: 'Get every detail about one file',
    kind: 'terminal',
    goal: 'Read full metadata, including the timestamps ls does not show.',
    prompt: 'Show the full metadata for /tmp/.cache/pt.tar.gz.',
    teach: {
      concept:
        '`ls -l` gives you one timestamp. `stat` gives you the file\'s exact size, its permissions in both octal and symbolic form, its owner and group as names and numbers, and three separate times: access, modify, and change.\n\nThose three are worth knowing apart. Modify is when the contents last changed. Change is when the metadata last changed, which includes permission and ownership edits, so a change time later than a modify time means somebody adjusted the file without editing it. Access is when it was last read, and it is the least reliable of the three because many systems stop updating it for performance.',
      syntax: 'stat FILE',
      examples: [
        {
          command: 'stat /etc/passwd',
          explains: 'The same detail for a file that should be old and unchanged, as a comparison.',
        },
      ],
    },
    hints: [
      'One command, one path, no flags needed.',
      'Read the size and the permission line carefully when it comes back.',
    ],
    solution: 'stat /tmp/.cache/pt.tar.gz',
    expectedOutput: 'A six-megabyte regular file, world-writable.',
    checks: [
      {
        type: 'output-contains',
        text: '0666',
        hint: 'stat shows the mode in octal as well as symbolically.',
      },
      {
        type: 'output-contains',
        text: 'regular file',
        hint: 'The output should state what kind of thing the path is.',
      },
    ],
    debrief:
      'Mode 0666: readable and writable by every account on the host. For an archive of exported patient data, that is careless even if the person who made it had every right to.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.6.5'] ?? [],
  },
  {
    id: 'linux.6.6',
    moduleId: '1.6',
    packageId: 'linux-fundamentals',
    order: 6,
    title: 'Search where you have no permission',
    kind: 'terminal',
    goal: 'Run a broad find and understand why some of it fails.',
    prompt: 'Find every regular file under /tmp, and read whatever comes back.',
    teach: {
      concept:
        'A find over a large tree as an ordinary user will meet directories it cannot enter, and it will say so on the error stream while continuing to search everything else. That is correct behaviour and not a failure: the results you got are real, they are simply incomplete.\n\nWhat matters is not pretending otherwise. An analyst who runs a search as an unprivileged user and reports the result as exhaustive has overstated their evidence. Either say the search was partial, or rerun it with the privilege to see everything, and know which one of those you did.',
      syntax: 'find PATH -type f',
      examples: [
        {
          command: 'find /home -type d',
          explains: 'Directories rather than files, which is how you map a tree before searching it.',
        },
      ],
    },
    hints: [
      'One find, one path, one type test.',
      'Do not filter this one. The point is to see the whole result.',
    ],
    solution: 'find /tmp -type f',
    expectedOutput: 'Four files, two of them in a hidden directory.',
    checks: [
      {
        type: 'output-contains',
        text: '/tmp/.cache/pt.tar.gz',
        hint: 'find descends into hidden directories, so the archive should be listed.',
      },
      {
        type: 'output-line-count',
        count: 4,
        hint: 'There are four regular files under /tmp.',
      },
    ],
    debrief:
      'find goes into hidden directories without being asked, which makes it a better discovery tool than ls for exactly the material somebody wanted overlooked.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.6.6'] ?? [],
  },
];

// --- Module 1.7: Processes and services --------------------------------------

const MODULE_1_7: Exercise[] = [
  {
    id: 'linux.7.1',
    moduleId: '1.7',
    packageId: 'linux-fundamentals',
    order: 1,
    title: 'See what is running',
    kind: 'terminal',
    goal: 'Read the process table, including who owns each process.',
    prompt: 'Show every process running on the host, with its owner and full command line.',
    teach: {
      concept:
        '`ps aux` is the process table in the form you will use most: every process on the system, whoever started it, with the user, the pid, the resource use, and the entire command line.\n\nThe last column is the one to read. A process name on its own tells you very little, whereas the full command line tells you what file it is operating on and where it is sending things. Two processes both called curl can be a package download and a data upload, and only the arguments separate them.',
      syntax: 'ps aux',
      examples: [
        {
          command: 'ps aux | grep nginx',
          explains: 'Narrowing the table to one service, which is how you check that something is actually running.',
        },
      ],
      flags: [
        { flag: 'a', means: 'Processes belonging to all users, not just yours.' },
        { flag: 'u', means: 'User-oriented format: show who owns each process.' },
        { flag: 'x', means: 'Include processes with no controlling terminal, which is most services.' },
      ],
    },
    hints: [
      'Three letters after ps, written together and with no dash.',
      'Read the rightmost column when it comes back.',
    ],
    solution: 'ps aux',
    expectedOutput: 'The full process table, including services and one upload.',
    checks: [
      {
        type: 'output-contains',
        text: 'nginx',
        hint: 'The web server should be in the table.',
      },
      {
        type: 'output-contains',
        text: 'curl',
        hint: 'Something is running curl. It should be visible in the full table.',
      },
    ],
    debrief:
      'There is a curl in that table, uploading a file from /tmp to an external address, and it is owned by the sysmon account. If you have done Networking, you found the same process from the other end: its socket was the one outbound connection nobody could explain.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.7.1'] ?? [],
  },
  {
    id: 'linux.7.2',
    moduleId: '1.7',
    packageId: 'linux-fundamentals',
    order: 2,
    title: 'List the services the system manages',
    kind: 'terminal',
    goal: 'Read the service list, which is what is supposed to be running.',
    prompt: 'List the services that are currently running under systemd.',
    teach: {
      concept:
        'The process table is what IS running. The service list is what the system was TOLD to run, and the difference between the two is where a lot of findings live: a process with no service behind it was started by a person or by something pretending to be one.\n\nsystemd is the manager on modern Linux, and `systemctl list-units --type=service --state=running` asks it what it currently has up. Read the list against what the host is for. A web server running nginx, a database, and a mail agent is coherent. Anything you cannot map to the machine\'s purpose is a question.',
      syntax: 'systemctl list-units --type=service --state=running',
      examples: [
        {
          command: 'systemctl status nginx',
          explains: 'One service in detail: whether it is up, since when, and what it last logged.',
        },
      ],
    },
    hints: [
      'The command is systemctl, and it needs to be told which units and which state.',
      'Ask for --type=service and --state=running.',
    ],
    solution: 'systemctl list-units --type=service --state=running',
    expectedOutput: 'Around a dozen services, all of them consistent with a web server.',
    checks: [
      {
        type: 'output-contains',
        text: 'nginx.service',
        hint: 'The web server should be in the list.',
      },
      {
        type: 'output-contains',
        text: 'postgresql.service',
        hint: 'The database is running too.',
      },
    ],
    debrief:
      'Every service here is explainable by "this is a web server with a local database". Note that the curl you found in the process table is NOT here, because nobody installed it as a service. It was simply run, which tells you a person or a script started it.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.7.2'] ?? [],
  },
  {
    id: 'linux.7.3',
    moduleId: '1.7',
    packageId: 'linux-fundamentals',
    order: 3,
    title: 'Read one service\'s own log',
    kind: 'terminal',
    goal: 'Pull the journal for a single unit instead of reading a whole log file.',
    prompt: 'Show the last five journal entries for the nginx service.',
    teach: {
      concept:
        'systemd keeps its own journal, and `journalctl -u UNIT` filters it to one service. That is often faster than finding the right file under /var/log, and on some systems the journal is the only place the output went.\n\n`-n` limits how many entries come back, newest last. Starting with a small number is the right instinct: you look at the tail, decide whether you are in the right place, and only then widen. Pulling ten thousand lines first and then trying to narrow them is how people lose twenty minutes.',
      syntax: 'journalctl -u UNIT -n COUNT',
      examples: [
        {
          command: 'journalctl -u ssh -n 10',
          explains: 'The last ten entries from the SSH daemon, which is where login problems show up.',
        },
      ],
      flags: [
        { flag: '-u', means: 'Restrict to one systemd unit.' },
        { flag: '-n', means: 'Show this many of the most recent entries.' },
      ],
    },
    hints: [
      'Two flags: the unit, and how many lines.',
      'The unit is nginx and the count is 5.',
    ],
    solution: 'journalctl -u nginx -n 5',
    expectedOutput: 'Five recent request lines from the web server.',
    checks: [
      {
        type: 'output-line-count',
        count: 5,
        hint: 'Ask for exactly five entries with -n.',
      },
      {
        type: 'output-contains',
        text: 'nginx',
        hint: 'The entries should come from the nginx unit.',
      },
    ],
    debrief:
      'Look at what those requests are for. At least one is a probe for a file that does not exist on this host, which is the same activity the Log Analysis package finds in the access log. Two views of one event is what corroboration means.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.7.3'] ?? [],
  },
  {
    id: 'linux.7.4',
    moduleId: '1.7',
    packageId: 'linux-fundamentals',
    order: 4,
    title: 'Find the busiest processes',
    kind: 'terminal',
    goal: 'Use top in a form that works in a script or a transcript.',
    prompt: 'Show the current process activity using top, in a single non-interactive snapshot.',
    teach: {
      concept:
        'Interactively, `top` refreshes forever until you press q, which is useless in a transcript and impossible in a script. `-b` puts it in batch mode, printing plain text, and `-n1` takes exactly one sample and exits.\n\nThat pair is worth memorising: `top -bn1` is how you capture a snapshot of what a host was doing at a moment you can point at afterwards. During an incident, capturing state you can refer back to is worth more than watching it live, because live output is gone the moment the screen scrolls.',
      syntax: 'top -bn1',
      examples: [
        {
          command: 'uptime',
          explains: 'The short version of the same question: how long the host has been up, and its load average.',
        },
      ],
      flags: [
        { flag: '-b', means: 'Batch mode: plain output, no interactive screen.' },
        { flag: '-n1', means: 'Take one sample and exit.' },
      ],
    },
    hints: [
      'Two flags, which can be written together as one argument.',
      'Batch mode, and exactly one iteration.',
    ],
    solution: 'top -bn1',
    expectedOutput: 'A one-off snapshot of load, memory, and the busiest processes.',
    checks: [
      {
        type: 'output-contains',
        text: 'load average',
        hint: 'The header should include the load average.',
      },
      {
        type: 'output-contains',
        text: 'nginx',
        hint: 'The process list should be included in the snapshot.',
      },
    ],
    debrief:
      'Capture this at the start of any investigation, before you change anything. State you did not record is state you cannot compare against later.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.7.4'] ?? [],
  },
  {
    id: 'linux.7.5',
    moduleId: '1.7',
    packageId: 'linux-fundamentals',
    order: 5,
    title: 'Check the host is healthy',
    kind: 'terminal',
    goal: 'Read memory and uptime, and know what normal looks like.',
    prompt: 'Show the memory usage of this host in human-readable units.',
    teach: {
      concept:
        'Two quick numbers describe whether a Linux host is coping. `free -h` shows memory, and the column that matters is "available" rather than "free": Linux deliberately uses spare memory as cache, so a host with very little "free" memory is usually working exactly as intended. Reading the wrong column here is one of the most common Linux misunderstandings.\n\n`uptime` gives you how long the machine has been up and its load average over one, five, and fifteen minutes. Uptime is worth checking for a reason that is not about performance: a server that rebooted an hour ago, when nobody scheduled a reboot, is a fact worth explaining.',
      syntax: 'free -h',
      examples: [
        {
          command: 'uptime',
          explains: 'How long the host has been up, and how loaded it is over three time windows.',
        },
      ],
      flags: [{ flag: '-h', means: 'Human-readable: gibibytes and mebibytes rather than kibibytes.' }],
    },
    hints: [
      'One command, one flag.',
      'The flag that makes sizes readable is the same one du and df use.',
    ],
    solution: 'free -h',
    expectedOutput: 'Total, used, free and available memory in readable units.',
    checks: [
      {
        type: 'output-contains',
        text: 'available',
        hint: 'The header should include the available column, which is the one worth reading.',
      },
      {
        type: 'output-contains',
        text: 'Mem:',
        hint: 'The memory row should be shown.',
      },
    ],
    debrief:
      'Look at "free" and then at "available". They are very different numbers, and only the second one answers "is this host short of memory". Reporting the first as though it were the second is how a healthy server gets escalated as an incident.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.7.5'] ?? [],
  },
  {
    id: 'linux.7.6',
    moduleId: '1.7',
    packageId: 'linux-fundamentals',
    order: 6,
    title: 'Find the process that does not belong',
    kind: 'terminal',
    goal: 'Filter the process table to one account and judge what you find.',
    prompt: 'Show every process owned by the sysmon account.',
    teach: {
      concept:
        'Filtering the process table by account is the last step of a pivot you have now done from three directions: a log line named the account, a socket named the pid, and the filesystem held the file. Asking what that account is running right now closes the loop.\n\nWhat you are judging is whether the answer fits the account\'s job. A monitoring account should be running monitoring software. If instead it is running a general-purpose transfer tool, pointed at an archive in a temporary directory, addressed to a host outside the company, then the name on the account is the only monitoring-shaped thing about it.',
      syntax: 'ps aux | grep ACCOUNT',
      examples: [
        {
          command: 'ps aux | grep www-data',
          explains: 'The same filter for the web server account, which is what a legitimate service account looks like.',
        },
      ],
    },
    hints: [
      'The full process table, piped into a filter on the account name.',
      'Read the whole command line of anything that comes back.',
    ],
    solution: 'ps aux | grep sysmon',
    expectedOutput: 'One curl process uploading an archive to an external address.',
    checks: [
      {
        type: 'output-contains',
        text: '/tmp/.cache/pt.tar.gz',
        hint: 'The command line should name the file being uploaded.',
      },
      {
        type: 'output-contains',
        text: '198.51.100.60',
        hint: 'The command line should also name where it is being sent.',
      },
    ],
    debrief:
      'One process, and it is an upload of the archive you found in module 1.6 to an address outside the company, run by an account created that morning. You reached this with ls, find, and ps: nothing exotic. Most of what a first responder does is exactly this, done carefully and in an order that makes sense.',
    practice: LINUX_FUNDAMENTALS_PRACTICE['linux.7.6'] ?? [],
  },
];

export const LINUX_FUNDAMENTALS: LearningPackage = {
  id: 'linux-fundamentals',
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
      packageId: 'linux-fundamentals',
      order: 1,
      title: 'Navigation and the filesystem',
      summary: 'Find out where you are and move somewhere else.',
      exercises: MODULE_1_1,
    },
    {
      id: '1.2',
      packageId: 'linux-fundamentals',
      order: 2,
      title: 'File operations',
      summary: 'Create, copy, rename, and remove files and directories.',
      exercises: MODULE_1_2,
    },
    {
      id: '1.3',
      packageId: 'linux-fundamentals',
      order: 3,
      title: 'Viewing file contents',
      summary: 'Read files, including ones far too large to print.',
      exercises: MODULE_1_3,
    },
    {
      id: '1.4',
      packageId: 'linux-fundamentals',
      order: 4,
      title: 'Searching and filtering',
      summary: 'Find the handful of lines that matter inside thousands.',
      exercises: MODULE_1_4,
    },
    {
      id: '1.5',
      packageId: 'linux-fundamentals',
      order: 5,
      title: 'Permissions and ownership',
      summary:
        'Reading a permission string, hunting setuid binaries and world-writable files, changing a mode, and what a refusal tells you.',
      exercises: MODULE_1_5,
    },
    {
      id: '1.6',
      packageId: 'linux-fundamentals',
      order: 6,
      title: 'Finding things on disk',
      summary:
        'Search by name, by time, and by type; reveal hidden files; measure what is using the space; read full metadata.',
      exercises: MODULE_1_6,
    },
    {
      id: '1.7',
      packageId: 'linux-fundamentals',
      order: 7,
      title: 'Processes and services',
      summary:
        'The process table against the service list, the journal for a single unit, a snapshot you can refer back to, and the process that does not belong.',
      exercises: MODULE_1_7,
    },
  ],
};
