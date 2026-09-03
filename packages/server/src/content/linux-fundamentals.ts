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
        'Start with what you are looking at. A terminal is a window where you type commands as text instead of clicking icons, and a shell is the program reading what you type and running it. Every command you learn in this course is typed here and answered here, in plain text, one line at a time.\n\nBehind that text sits a filesystem: every file and every folder on the machine, arranged as one enormous tree. The tree has a single starting point, called root, written as a single forward slash: /. Everything else, every folder and every file, is somewhere underneath it, the way every room in a building is reachable by some path from the front door.\n\nYour shell is never floating loose in that tree. At every moment it is sitting inside exactly one folder, called the working directory, and any command you type that touches a file will touch it relative to that folder unless you spell out a different location. `pwd` (short for "print working directory") answers the one question that makes everything else safe: which folder, exactly, is the shell standing in right now.\n\nThis matters more than it sounds like it should. On a real server you will often be several folders deep, working alongside other analysts, sometimes under pressure. A command that deletes or overwrites something does exactly what you told it to, in whatever folder you happen to be in. Checking with `pwd` before you act is how you make sure that folder is the one you meant.',
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
      'Sounds trivial, and it is the command you will use most. The reason is that almost every command you type is relative to wherever `pwd` says you are: type the exact right command in the wrong folder and it will happily do the wrong thing, correctly, with no error to warn you. Checking where you stand first is a habit, not a formality, and it is the one that catches the mistake before it happens rather than after.',
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
        'A directory (what most people call a folder) is a container in the filesystem tree that holds other things: files, and other directories nested inside it. You cannot see what a directory contains just by knowing its name, any more than you can see what is in a filing cabinet drawer without opening it.\n\n`ls` opens that drawer. It lists whatever is inside a directory: files, subdirectories, everything one level deep. Typed on its own, with no argument, it lists the directory you are currently standing in, the one `pwd` would name. Give it a path instead and it lists that directory without moving you there at all, which is a useful distinction: `ls` looks, `cd` (which you will meet shortly) actually moves you.\n\nThis is the command you will reach for constantly, more than any other in this course. Before you read a file, search a folder, or trust that something exists, you look first. `ls` is how you orient yourself in an unfamiliar filesystem before you do anything else in it.',
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
    debrief:
      'Notice that `ls` on its own hides anything whose name begins with a dot. That is a long-standing Linux convention: a dot at the start of a filename marks it as a configuration file or working file that clutters an ordinary listing, so `ls` leaves it out unless you ask. It is not security, just a display default, but the effect is the same either way: something can sit in a directory that a quick look never reveals. Attackers know that convention as well as anyone, which is exactly why the next exercise teaches you the flag that turns it off.',
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
        'Most commands can be told to behave differently by adding options, usually called flags. A flag is extra text you add after the command, and it always starts with a dash so the shell can tell it apart from a filename. Short flags can be grouped behind one dash, so `-l -a` and `-la` are exactly the same instruction written two ways. You will type flags on nearly every command from here on, so get used to reading them as "the base command, plus a modifier".\n\nTwo flags matter here. `-a` (all) turns off the hiding you just learned about: it shows every entry, including anything starting with a dot. `-l` (long) switches `ls` from a bare list of names into one row per entry, packed with detail: who owns it, how big it is, when it last changed, and, first of all, its permissions.\n\nThat permission string is ten characters and worth learning to read on sight, because you will see it constantly. The first character says what kind of thing this is: `d` for a directory, `-` for an ordinary file. The remaining nine break into three groups of three, one group each for the owner of the file, everyone in its group, and everyone else on the machine, and each group is read the same way: r for read, w for write, x for execute, with a dash standing in for "not allowed". You will decode this properly in the permissions module; for now, just notice that it is there and that it is not the same for every file.',
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
      'Compare this to plain `ls` a moment ago: two files, .bashrc and .profile, simply were not there. Nothing was wrong, that is just the default. But the same mechanism that hides ordinary configuration files will just as happily hide anything else with a dot in its name. A directory called `.cache` sitting somewhere it has no business being is a classic hiding spot precisely because a casual `ls` walks straight past it, and only someone who thinks to add `-a` ever sees it.',
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
        '`cd` (change directory) is how you actually move through the filesystem tree, as opposed to `ls`, which only looks. Every path you give it is one of two kinds, and telling them apart matters.\n\nAn absolute path starts with a forward slash, and it is measured from the root of the tree every single time, the way a full street address works no matter which city you are calling from. `cd /var` always takes you to the same place, whether you were in your home directory or three levels down inside /etc.\n\nA relative path has no leading slash, and it is measured from wherever you currently stand, the way "second door on the left" only means something once you know which room you are already in. `cd Documents` only works if there happens to be a folder called Documents inside your current directory; run the exact same command from somewhere else and it does something different, or fails.\n\nWhen you are not certain exactly where you are, or you want a command to behave identically no matter where it is run from, use an absolute path. It removes an entire category of mistake.',
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
    debrief:
      '/var exists to hold data that changes while the system runs, as opposed to the program files that stay fixed once installed. That is why logs live there: something is always being appended, whether it is web requests, authentication attempts, or scheduled jobs. You will spend more time under /var than almost anywhere else in this course, because it is where a running system leaves a record of what it has been doing.',
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
        'Every account on a Linux machine gets its own home directory: a folder set aside for that user\'s files, the way each employee in an office gets their own desk drawer regardless of how the rest of the building is laid out. Yours in this course is /home/student, an absolute path like any other, but typing it out every time would get old fast.\n\nThe shell gives you a shortcut for it: the tilde character, ~. Wherever you use it, ~ expands to your own home directory, whatever that path happens to be, so `~/notes.txt` always means "the file called notes.txt, inside my home directory", no matter where in the filesystem you are currently standing when you type it.\n\n`cd ~` is therefore a fast way home from anywhere. It is not a special case of the absolute-versus-relative rule from the last exercise, it is a third thing: a piece of text the shell rewrites into an absolute path before the command ever runs.',
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
    debrief:
      'A bare `cd`, typed with no argument at all, does the exact same thing as `cd ~`: on Linux, "go home" is `cd`\'s default when you do not tell it otherwise. Both exist for the same reason, saving you from typing a full path when you are lost, tired, or several directories deep and just want solid ground under you again.',
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
        'Every single directory in the filesystem, without exception, secretly contains two entries you never created: a single dot (.), which means "this directory itself", and two dots (..), which means "the directory directly above this one", its parent. Think of the tree structure from the first exercise: if your current folder is a branch, .. is simply the branch it grew out of.\n\nBecause .. is an ordinary path component, not a special command, you can combine it like any other piece of a path. `cd ../..` climbs two levels in one step, and `../etc` means "go up one level, then into etc from there". You will use this constantly once you are several directories deep and want to back out without typing the whole absolute path again.\n\nThis is also the third kind of navigation you now know, alongside absolute paths and the ~ shortcut: dot notation, for moving relative to exactly where you are without naming anything by its full path.',
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
    debrief:
      'One dot means "here", two means "up", and both exist in every directory on the system whether you ever look at them or not; `ls -a` would show them sitting right alongside .bashrc. `cd ../..` goes up twice by chaining that same idea, and there is no upper limit: keep adding /.. and you keep climbing, until you hit root, which is its own parent and simply stays put.',
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
        'A file, at the most basic level, is just a named container for data that the filesystem keeps track of: where it lives, how big it is, who owns it, when it last changed. It can be empty and still exist, the same way an empty folder can still exist on a shelf even with nothing filed inside it yet.\n\n`touch` creates exactly that: an empty file, instantly, if nothing by that name is already there. If a file with that name already exists, `touch` does not touch its contents at all, it only updates the recorded time of "last modified" to right now, which is where the command\'s name comes from. Either way, it is the fastest way to bring a file into existence before you write anything into it.\n\nWatch what it prints back when it succeeds: nothing. That silence is deliberate and it is worth getting used to now, because it is the single most common pattern in this whole course.',
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
      'No output at all, and that is not a bug, it is a decades-old convention baked into Unix and every Linux system descended from it: a command that succeeds usually says nothing whatsoever, and only speaks up to report a problem. The reasoning is that a human running dozens of commands does not want to read "OK" after every single one; silence lets the failures actually stand out when they happen. Get comfortable with it: from here on, no news genuinely is good news.',
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
        'A directory is a special kind of entry in the filesystem that does not hold data itself, it holds other entries: files, and further directories nested inside it, the way a folder in a filing cabinet holds other folders. `mkdir` (make directory) creates one, fresh and empty, ready to hold whatever you put in it next.\n\nBy default `mkdir` is strict about the tree it already expects to exist: it will create exactly one new directory, but only if the directory that is supposed to contain it is already there. Try to create case/2026/notes in one go, with none of those three existing yet, and a plain `mkdir` refuses, because case does not exist yet for 2026 to go inside of. Add the `-p` flag and it stops being strict, quietly building every missing directory along the path in one pass.\n\nKnowing which one to reach for matters: plain `mkdir` failing loudly when a parent is missing is often useful information, telling you your assumption about the existing structure was wrong; `-p` is for when you already know you want the whole path built, gaps and all.',
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
    debrief:
      'Add `-p` any time you need the parent directories built along with the one you actually want: `mkdir -p a/b/c` creates all three levels in a single command, even though none of them existed a moment before, instead of forcing you to create a, then b inside it, then c inside that, one command at a time.',
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
        'Copying a file means creating a second, completely independent file with the same contents as the first: change one afterwards and the other does not follow along, unlike, say, a shortcut or a link. `cp` (copy) does exactly that, and it always takes its two arguments in the same fixed order, source then destination, read left to right the way you would say it out loud: "copy this, to here".\n\nThe original is never touched. That is worth stating plainly because it is the entire reason `cp` exists as a separate command from `mv`, which you will meet next and which does the opposite: `cp` leaves you with two files, `mv` leaves you with one, moved.\n\nAdd `-r` (recursive) when the source is a directory rather than a single file, so `cp` copies it and everything nested inside it, all the way down, instead of refusing or copying nothing.',
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
      'Copying evidence before you examine it further is standard practice in this field, and the reason is simple: the moment you start reading or testing a file, you risk changing something about it, whether that is its timestamps or, if you make a mistake, its actual contents. `cp` guarantees the original is left exactly as it was, untouched, which means a working copy can be examined, broken, or even destroyed without any risk to the evidence it came from.',
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
        'Renaming a file and moving a file sound like two different actions, but on Linux they are literally the same operation: a file\'s name is nothing more than its location in the filesystem tree, its path, so changing the name is just changing the path, and moving it to a different directory is changing the path in exactly the same way. There is no dedicated "rename" command because none is needed.\n\n`mv` (move) handles both, using the identical argument order as `cp`: source first, destination second. The difference from `cp` is total, though. Where `cp` leaves the original in place and creates a copy, `mv` leaves nothing behind at the old path at all; the file simply exists at the new one now, as if it had always been there.',
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
    debrief:
      'Renaming and moving are the same operation under the hood: you are changing the path, and nothing about the file\'s actual contents is touched at all. That is worth internalising early, because it explains behaviour you will meet later, such as why moving a huge file within the same disk is nearly instant (only the path record changes) while moving it to a different disk entirely is slow (the data itself has to be copied across, then the original erased).',
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
        'Deleting a file means telling the filesystem to forget it existed, and on Linux that is immediate and final. There is no recycle bin quietly holding onto it, no built-in undo, no confirmation dialog asking "are you sure". `rm` (remove) does exactly what you tell it, exactly once, and the file is gone the instant the command returns.\n\nThat directness is by design, not an oversight: Linux assumes you know what you typed. It is also why `rm` has the reputation it does, especially combined with wildcards or the `-r` flag (which deletes a directory and everything inside it) or `-f` (force, which silences the warnings `rm` would otherwise give you). Combine all three carelessly and you can erase far more than you meant to, with nothing to catch the mistake afterward.\n\nThe practical habit this teaches: read the exact command back to yourself before you press Enter, every time, particularly once wildcards or `-r` are involved.',
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
      'There is no recycle bin, and `rm` is immediate and permanent, which is exactly why `rm -rf` (recursive, forced, no questions asked) has become shorthand across the industry for "the command that ends careers when typed in the wrong directory". On a live investigation the working rule is simpler than remembering every flag: copy first, and do not delete anything at all until the case is closed.',
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
        '`rmdir` (remove directory) deletes a directory, but only under one condition: it must already be completely empty, with nothing inside it at all, not even a hidden file. If anything remains, `rmdir` refuses and tells you so, rather than guessing what you meant.\n\nThat refusal is a deliberate safety feature, not a limitation. A directory you expected to be empty but is not is often a sign you have the wrong one, or that something is in there you forgot about, and `rmdir` stopping to tell you is far safer than a command that would silently delete whatever it found. Compare that to `rm -r`, which you met last exercise: it will take a directory and every single thing inside it, without asking, which is exactly why reaching for the cautious command first is the better habit.',
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
      '`rmdir` refuses outright the moment there is still something inside the directory, and that refusal is the entire safety feature: it forces you to notice, before anything is destroyed, that the directory was not as empty as you assumed. `rm -r` has no such hesitation. It will take the whole tree, files and subdirectories together, without pausing to ask, which is exactly why it is the more dangerous of the two and worth reaching for last, not first.',
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
        'Reading a file\'s contents from the terminal needs a command, the same way opening a document needs an application; the shell will not show you what is inside a file just because you name it. `cat` is the simplest of these: it prints a file\'s entire contents to the screen, start to finish, all at once, and nothing more.\n\nThe name is short for "concatenate", meaning "join together", because `cat`\'s original purpose was combining several files into one continuous stream of text; printing a single file to the screen is really just that same behaviour with only one file given. That is also its weak point: `cat` has no concept of stopping partway through, so on a file with thousands of lines it will dump every single one, scrolling your screen past readability in a second. It is the right tool for something short, like a single configuration line or a hostname, and the wrong one for a log.',
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
      'rmg-web-02 is the name this particular machine identifies itself by, and knowing it matters because in this course, as in a real job, you will regularly be logged into more than one host, sometimes several at once in different terminal windows. A command run on the wrong machine does not fail, it just quietly does the wrong thing to the wrong server. Confirming the hostname first, before you act on anything you find, is a cheap habit that prevents an expensive mistake: this one is internet-facing and holds patient data, which is exactly the kind of host you want to be certain about before touching.',
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
        '`cat`, from the last exercise, has no brakes: it prints everything at once. A pager is the tool built for the opposite case, a file too long to read in one screenful, and `less` is the standard one on Linux. Instead of dumping the whole file, it shows you one screen at a time and waits, letting you move forward and backward, search for a specific word with /pattern, and quit whenever you are satisfied by pressing q.\n\nThis simulator has an honest limitation worth naming directly: a browser-based terminal like this one cannot run a genuinely interactive program that waits for keypresses the way a real terminal can. So here, `less` prints its first page and then explains that limitation to you, rather than pretending to be something it is not. On a real machine, practise the arrow keys and the search; here, the lesson is knowing the tool exists and what it is for.',
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
      'Worth practising properly on a real machine, where the search-and-scroll keys genuinely matter and save real time. But for the specific job of finding something inside a large file, `grep`, which you meet later in this module, beats scrolling through page after page every single time: instead of you reading past everything irrelevant, it throws the irrelevant lines away before you ever see them.',
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
        'Sometimes you do not want a whole file, just a look at the beginning of it, to check it is the file you expect or see how it starts. `head` does that: printed on its own, it shows the first 10 lines of a file and stops, and the `-n` flag lets you ask for a different number instead of the default.\n\nLog files matter here because of how they are written. A program does not rewrite a log file from scratch each time; it appends new lines to the bottom as events happen, one after another, in the order they occurred. That means the very top of a log file holds its oldest recorded activity, whatever was logged first, and the further down you read, the more recent things get. `head` is therefore how you check when a log\'s history begins, not where an incident is likely to be found.',
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
      'The first lines of a log are its oldest, for the reason above: new entries get appended to the bottom, never inserted at the top. `head` is useful for confirming when a log\'s recorded history begins and whether the file looks the way you expect, but it is rarely where an active incident shows up, because whatever is happening right now is happening at the other end of the file.',
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
        '`tail` is `head`\'s mirror image: instead of the beginning of a file, it prints the end, defaulting to the last 10 lines, with the same `-n` flag letting you ask for a different count. Given how logs are written, appending downward as events happen, the tail of a log file is its newest activity: whatever a service is doing right this moment lands at the bottom.\n\nThat is why `tail` is usually the very first command an analyst reaches for during a live incident. If something is happening now, the evidence of it is at the end of the file, not the beginning, and `tail` gets you there without reading through everything that came before. On a real system, `-f` (follow) keeps `tail` running and printing each new line the instant it is written, turning a static file into something closer to a live feed.',
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
      '`tail` is usually the first command run during a live incident, because the newest events are always at the bottom of an append-only log, and that is exactly where you need to be looking while something is actively unfolding. On a real machine, `tail -f` keeps that view open and current, printing each new line the instant it lands, so you can watch events arrive rather than repeatedly re-running the command to check for anything new.',
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
        'So far every command has shown you a file\'s contents wholesale: all of it, or the first chunk, or the last chunk. `grep` does something different: it searches. You give it a word or pattern and a file, and it prints only the lines that contain a match, throwing every other line away entirely. Nothing about the file changes; you are just choosing which lines of it you get to see.\n\nThis is the single most important command in log analysis, because real logs are enormous and only a tiny fraction of any given file is ever relevant to a specific question. Instead of reading thousands of lines to find the ones that matter, you describe what you are looking for and let `grep` do the reading.\n\nPut the pattern in double quotes as a habit. Without quotes, the shell itself tries to interpret spaces and certain special characters in what you typed before `grep` ever gets to see it, which can silently change what you are actually searching for. Quoting the pattern keeps it exactly as you wrote it.',
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
    debrief: `That is ${FAILED_COUNT.toLocaleString('en')} lines, and the number itself is the lesson as much as anything grep taught you. On any live host reachable from the internet, failed logins are constant background noise: automated scanners try usernames and passwords around the clock, all day, every day, against every server they can find. Finding the failed attempts is trivial, \`grep\` just did it in one command. Working out which handful, if any, actually matter is the real job, and it is a much harder one than searching.`,
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
        '`grep` compares text exactly as written by default, which makes it case-sensitive: to a plain `grep`, "Failed" and "failed" are two entirely different words, and searching for one will never match the other. That catches people out constantly on real systems, because different programs writing to the same log file often do not agree on capitalisation, even when they are describing the same kind of event.\n\nThe `-i` flag (ignore case) tells `grep` to stop caring about upper and lower case altogether, matching Failed, failed, and FAILED all as the same word. It is one of the flags worth reaching for automatically, since a case-sensitive search can silently miss real matches without ever telling you it did.',
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
    debrief: `Case-insensitive finds ${FAILED_LOWER_COUNT.toLocaleString('en')} lines against ${FAILED_COUNT.toLocaleString('en')} case-sensitive, a real difference caused entirely by capitalisation you would otherwise never notice was inconsistent. When you are searching to find evidence, rather than confirming something you already expect to be there, that gap is exactly the kind of thing that costs you a real result. Reach for \`-i\` by default.`,
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
        'Sometimes the question you are actually asking is "how many", not "show me each one", and reading through a wall of matching lines just to count them by eye is slow and error-prone. `grep -c` (count) skips printing the lines entirely and gives you back a single number: how many lines matched.\n\nCapitalisation still matters here exactly as it did last exercise, and this file is a good example of why: it contains both "Invalid user" at the start of a line and "invalid user" partway through a different message, and a plain `grep -c "invalid user"` will only count the second form unless you add `-i` on top of it. Watch what you type carefully; the count is only meaningful if the search actually matched what you meant it to.',
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
    debrief: `"invalid user" is the message auth.log writes when somebody tries to log in as an account that does not exist on this machine at all, as opposed to a real account with the wrong password. ${INVALID_USER_COUNT.toLocaleString('en')} of those in one log is not a person carefully targeting this server, it is the signature of a scanner working down a wordlist of common usernames, trying each one automatically and moving on the instant it fails. The volume itself is the tell.`,
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
        '`grep -n` (number) adds one more piece of information to each matching line: the exact line number it appears on within the file. Without it, a match is just text floating free of its position; with it, you have a precise coordinate you can return to.\n\nThat matters in an investigation for a very practical reason: when you tell a colleague, or write in a report, "line 4,812 of auth.log shows X", they can go straight to it and see exactly what you saw, including everything around it, rather than searching the whole file again hoping to land on the same spot you did.',
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
    debrief: `Only ${SUDO_COUNT} sudo lines in the whole day, against thousands of failed logins you found earlier in this module. That imbalance is worth sitting with: rare events are usually the interesting ones precisely because so few things happen that way, while common events, like automated login attempts, are usually just noise. Go back and read those few lines closely. One account is doing something that an ordinary user account has no reason to be doing.`,
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
        'A pipe, written as the `|` character, connects two commands so that whatever the first one prints becomes the input the second one reads, instead of landing on your screen in between. Nothing touches the disk; the data flows directly from one command into the next, as if you had handed a piece of paper straight from one person to another without setting it down.\n\nThis is the central idea the entire shell is built around: many small commands, each doing one narrow job well, chained together to do something bigger than any one of them does alone. `wc -l` ("word count", with `-l` for lines) counts however many lines it is given, so `grep "ssh" file | wc -l` reads as one continuous sentence: find the lines mentioning ssh, then count how many there were. `grep -c` from a couple of exercises ago does the identical job in fewer keystrokes, but this exercise is really about the pipe itself, which you will use to connect almost every pair of commands from here on.',
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
      'The pipe is arguably the single most important idea in the whole shell: it turns every command into a filter you can bolt onto the next one, so instead of memorising one giant tool that does everything, you learn a handful of small tools and combine them differently depending on the question. Almost all real log analysis, once you are past the basics, is three or four small commands chained together exactly this way, not one command that magically knows the answer.',
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
        'An asterisk, *, used in a filename or path is a wildcard: it stands in for "any characters at all". Critically, the wildcard is not something `grep` itself understands; the shell expands it into a matching list of actual filenames before the command ever runs, so by the time `grep` starts, it never sees a star at all, only a plain list of files it has been handed. That is also why, once more than one file is involved, `grep` starts prefixing every match with the name of the file it came from: it now knows there is more than one source to keep straight.\n\nLog rotation is the practical reason this matters. Systems routinely rename the current log at a fixed time (often midnight), starting a fresh one, so what actually happened over the last day or two can be split across auth.log and auth.log.1, or further back auth.log.2, and so on. Searching only the current file silently loses whatever fell into the older one.',
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
      'The shell expands the * into real filenames before `grep` ever runs, which is why the two file prefixes appeared automatically in your output rather than something you had to ask for. This matters more in practice than it looks: logs rotate at a fixed point in time, so an incident that starts shortly before midnight is split across two separate files. Search only the newer one and you silently lose the first half of the story, with no error to tell you anything is missing.',
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
        'Linux was designed from the start to be used by more than one person on the same machine at once, unlike a single laptop where you are the only account that exists. That means the filesystem needs a way to say who is allowed to do what with each file, the same way an office building assigns some rooms as open to everyone and others as key-card only. Permissions are that system, and every single file and directory on a Linux machine carries them.\n\nThe ten characters at the front of an `ls -l` line answer "who can do what". The first is the type: a dash for a normal file, d for a directory, l for a symbolic link. The remaining nine are three groups of three, and each group is read as rwx: read, write, execute.\n\nThe groups are OWNER, GROUP, then EVERYONE ELSE, in that order. So `-rw-r-----` is a file whose owner may read and write it, whose group may read it, and which everybody else cannot touch at all. The two names after the link count are the owner and the group, which is what makes those permission groups mean something concrete.',
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
      'The last three characters are dashes, meaning "everyone else: nothing at all", and that is the entire security model of this file in one string. /etc/shadow holds every account\'s password, not in plain text but hashed, meaning run through a one-way mathematical function that scrambles it into something that cannot be reversed back into the original password directly. Hashes can still be attacked, though, by guessing possible passwords, hashing each guess, and checking for a match, and that guessing is far faster once you have a private copy of the file to work on without the system watching or slowing you down. Blocking ordinary users from reading it at all is what prevents them from taking a copy away to attack in the first place. Any host where that permission string has changed is a finding worth chasing immediately.',
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
        'Every process running on Linux runs as some account, and that account\'s permissions are what decide what the process is allowed to touch: a process started by an ordinary user can only do what that user could do by hand. Privilege escalation is the general name for any way a process, or the person controlling it, ends up with more access than they started with, and setuid is one of the oldest and most important mechanisms for it, used both legitimately and against a system.\n\nNormally a program runs as whoever started it. A setuid binary runs as its OWNER instead, which for a root-owned file means it runs as root no matter who launched it. That is how `passwd` can edit /etc/shadow when you cannot: the program is trusted even though you are not.\n\nA short list of these is expected on any Linux host and is fine. A LONG list, or one containing something that has no business being there, is the first place an attacker looks, because a setuid program with a flaw in it is a direct route from ordinary user to root. `find -perm -4000` matches the setuid bit specifically, and the leading dash means "has at least these bits" rather than "matches exactly".',
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
      'Nine, and every one of them is a standard Ubuntu program that legitimately needs to briefly act with more privilege than the user running it, the same reasoning as `passwd` above. Learn roughly what that list looks like on a healthy host, because the danger sign is not any single setuid file, it is one that should never have that bit set at all: a setuid copy of bash, python, or find turns "run this program" into "become root", with no password needed. That is not a misconfiguration anyone stumbles into by accident, it is somebody deliberately keeping a way back into the system.',
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
        'Permissions, from the first exercise in this module, are split into three groups: owner, group, and everyone else, often just called "world". A world-writable file or directory is one where that third group, meaning literally every account on the machine, has been given permission to write to it. That is a much bigger circle of trust than most files should ever need.\n\nA world-writable file is one that any account on the host can modify, which matters because a file is only as trustworthy as the least trustworthy person who can edit it. A world-writable script that root runs on a schedule is a straight path to root.\n\n/tmp is world-writable by design, so files in it are not automatically a finding. The reason to look anyway is that /tmp is where things get staged: it is writable by everybody, it is rarely monitored, and its contents are expected to be junk, which makes it the natural place to leave something you do not want examined.',
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
      'Note what turned up: a compressed archive, sitting in a hidden directory under /tmp, that any account on this machine could write to or replace. None of that is proof of anything on its own: developers really do leave junk in /tmp, and hidden directories are common and mostly boring. But an archive that anyone could tamper with, sitting somewhere few people ever look, is exactly the combination worth two more minutes of your attention rather than a shrug.',
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
        'You have already learned to read a permission string like rw-r-----; `chmod` (change mode) is how you set one. Rather than writing out letters, the fastest way is octal notation, which compresses each permission group into one digit: read is 4, write is 2, execute is 1, and you add them together. So 6 is read plus write, 7 is all three, 5 is read plus execute, and 0 is nothing.\n\nThree digits, in the order owner, group, everyone else. 600 therefore means the owner may read and write, and nobody else may do anything. 644 is the common default for a document; 755 is the common default for a directory or a program, because a directory needs the execute bit to be entered at all.\n\nAlways check afterwards. Setting permissions is one of the easiest things to get subtly wrong, and the failure is silent: the command succeeds, the file is readable by the wrong people, and nothing tells you.',
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
      'The habit worth taking from this exercise is the third command, not the second. Setting a permission and checking it are two different actions: `chmod` will happily accept a typo\'d mode number and apply it without complaint, since 660 and 600 are both perfectly valid modes, just very different ones. Only reading the permission string back afterward tells you what actually happened, rather than what you meant to happen.',
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
        'Every real user account on a Linux machine is typically given its own home directory when it is created, which is why listing /home works as a rough map of who has ever been set up to use this machine as a person, as distinct from the many background accounts a system also has that never get a home directory at all.\n\nListing /home is a fast way to see who actually uses a machine, and it is often more honest than the account list, because a home directory only exists once somebody has been set up properly.\n\nWhat you are reading for is a name you cannot account for. Service accounts usually have no home directory or one somewhere else entirely, so a new directory in /home owned by an account nobody recognises is worth asking about. Compare what you find here against what the team says should be there: the mismatch is the finding.',
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
      'There is a home directory for an account called sysmon. It sounds exactly like the kind of low-level monitoring service every server runs, and that is precisely the point: it is not one. The Log Analysis package shows that same account being created through sudo at 10:22 on the day these logs cover, meaning a human being with elevated privileges deliberately made it that morning, not something installed months ago as part of the original server setup. A plausible-sounding name is the cheapest camouflage there is, and it works specifically because nobody stops to question something that sounds like it belongs.',
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
        'Not every command you run will succeed, and a refusal is not the same thing as nothing happening. It is worth learning to read an error message as a piece of evidence in its own right, rather than a dead end to shrug off and move past.\n\nA permission denied is not a failure of your command, it is an answer. It tells you the path EXISTS, that you are not permitted to read it, and therefore that somebody with more privilege would learn something you cannot. All three of those are useful, and the third is the one to write down: "I could not read X, and it should be checked by somebody who can" is a legitimate handover line.\n\nThe alternative error is worth telling apart. "No such file or directory" means the path is not there at all, which is a different fact entirely. Confusing the two leads to reporting that something is absent when it is merely out of reach.',
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
      'A scheduled task belonging to that account exists, on a machine that already gave you two other reasons to be suspicious of it, and you specifically cannot see what it runs because your account lacks the privilege to read it. That is a finding in its own right, and it is exactly what escalation exists for in a real team: you have not failed to answer the question, you have narrowed it down to one exact file and one exact privilege gap, which is a far more useful thing to hand to a colleague with root access than a vague "something seems off".',
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
        'Everything you have searched so far, with `grep`, has been inside a single file you named. `find` searches the other dimension: it walks an entire directory tree, every file and subdirectory nested underneath a starting point, and tests each one you meet against whatever conditions you give it, without you needing to know in advance which folder something is actually sitting in.\n\n`find` walks a directory tree and tests every entry it meets. `-name` matches the filename against a pattern, and the pattern uses the same wildcards the shell does, so `*.sql` means anything ending in .sql.\n\nQuote the pattern. Without quotes the shell expands the wildcard itself, against the CURRENT directory, before find ever runs, which usually produces either no results or the wrong ones. This trips up nearly everybody once and the failure looks like find not working.',
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
      'A database dump sitting in somebody\'s home directory. A .sql file like this is typically a full export of a database\'s contents, meant as a backup or for local debugging, and there is nothing inherently malicious about creating one. But the moment it leaves the actual database, it also leaves behind every access control the database enforces: no login required, no audit trail, just a plain file readable by anyone with the right filesystem permission. Probably a developer who was debugging something, and also a complete copy of patient data sitting somewhere it was never designed to be protected. Both things are true at once, which is why it is worth mentioning rather than dismissing.',
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
      'A six-megabyte archive and a small executable, sitting together in a hidden directory, owned by an account created that same morning. Staging is the general term for gathering and packaging data in one place before moving it somewhere else, and it is a normal step in a lot of legitimate work, which is exactly why none of this is proof by itself: archives get made, hidden directories get used for all sorts of ordinary reasons. What makes it worth a second look is the combination arriving together, in a place designed to be overlooked, tied to an account with no history before that morning.',
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
        'Every file on a Linux system carries a recorded modification time, the last moment its contents changed, and that timestamp is one of the most powerful things you can filter on, because most investigations start with at least a rough idea of when something happened.\n\nTime is the most useful filter an investigation has. If you know roughly when something happened, "what changed around then" turns a filesystem with hundreds of thousands of files into a list you can read.\n\n`-mtime` counts in days: `-mtime -1` means modified less than one day ago, `-mtime +7` means more than seven days ago, and a bare `-mtime 1` means exactly one day, which is almost never what you want. The minus sign is doing real work in that expression, and leaving it off is the usual reason this returns nothing.',
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
      'Notice what the filter excluded: the rotated log, which is exactly one day old and therefore fell just outside the window you asked for. That is the behaviour you want here, and it is also a reminder worth keeping in mind for every time-scoped search you run afterward: it will hide anything outside the window just as effectively as it surfaces anything inside it, with no indication that something was left out. Choose the window deliberately, and widen it if the first answer does not add up.',
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
        'Disk space is not infinite, and knowing what is actually using it is both a routine operational question and, sometimes, an investigative one: something that appeared out of nowhere and is taking up real space did not get there by accident.\n\n`du` reports how much space a path uses, adding up everything beneath it; `df` reports how much space a filesystem has left. The two get confused constantly and answer different questions: du is "what is taking the room", df is "how much room is there".\n\n`-h` on either one converts bytes into human-readable units. For an investigation the interesting version of this question is not "are we running out of disk" but "why is there six megabytes in a temporary directory nobody uses", which is the same command asked with a different intent.',
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
      'Six megabytes of something, sitting in a hidden temporary directory that is supposed to hold nothing but disposable scratch files. On a quiet server that is a meaningful amount of data to have appeared with no stated reason behind it, and size is often the thing that makes staged data visible when everything else about it was designed to blend in: a hidden name and careless permissions can go unnoticed, but six megabytes shows up the moment anyone actually measures the directory.',
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
        'Metadata is information a filesystem keeps about a file that is separate from the file\'s actual contents: its size, its owner, its permissions, and several different timestamps. `ls -l` shows you a useful summary of some of it; `stat` shows you the complete record.\n\n`ls -l` gives you one timestamp. `stat` gives you the file\'s exact size, its permissions in both octal and symbolic form, its owner and group as names and numbers, and three separate times: access, modify, and change.\n\nThose three are worth knowing apart. Modify is when the contents last changed. Change is when the metadata last changed, which includes permission and ownership edits, so a change time later than a modify time means somebody adjusted the file without editing it. Access is when it was last read, and it is the least reliable of the three because many systems stop updating it for performance.',
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
      'Mode 0666 means readable and writable by every single account on the host, owner, group, and everyone else alike, with the leading 0 just marking it as a plain permission mode rather than something more unusual. For an archive that turns out to hold exported patient data, that is a genuinely careless setting even in the best-case explanation, where the person who made it had every right to create it in the first place: leaving it wide open to modification by anyone on the machine was still a mistake worth catching.',
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
        'A search across a large part of the filesystem will not always succeed everywhere at once, especially when you are running it as an ordinary user rather than as root, and knowing how to read a partially successful search is its own skill.\n\nA find over a large tree as an ordinary user will meet directories it cannot enter, and it will say so on the error stream while continuing to search everything else. That is correct behaviour and not a failure: the results you got are real, they are simply incomplete.\n\nWhat matters is not pretending otherwise. An analyst who runs a search as an unprivileged user and reports the result as exhaustive has overstated their evidence. Either say the search was partial, or rerun it with the privilege to see everything, and know which one of those you did.',
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
      '`find` goes into hidden directories without being asked to, unlike a plain `ls`, which stops at anything starting with a dot unless you explicitly add `-a`. That makes `find` a better discovery tool specifically for the material somebody wanted overlooked: a search built to be thorough by default will surface exactly the things a search built to be tidy by default was designed to hide.',
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
        'A process is a running instance of a program: the moment you start something, whether by typing a command or the system launching a service on its own, Linux creates a process for it, tracks it, and keeps a record of who owns it and what it is doing. A machine that has been running for any length of time typically has dozens or hundreds of these running at once, most of them entirely mundane.\n\n`ps aux` is the process table in the form you will use most: every process on the system, whoever started it, with the user, the pid, the resource use, and the entire command line.\n\nThe last column is the one to read. A process name on its own tells you very little, whereas the full command line tells you what file it is operating on and where it is sending things. Two processes both called curl can be a package download and a data upload, and only the arguments separate them.',
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
      'There is a curl in that table (curl is a general-purpose tool for transferring data to or from a URL, commonly used for perfectly ordinary things like downloading a file or checking an API), uploading a file from /tmp to an address outside the company, and it is owned by the sysmon account you have already been tracking through this module. If you have done Networking, you found the same process from the other end: its socket was the one outbound connection nobody could explain. Two completely different commands, the process table here and a socket listing there, landing on the exact same activity is what makes a finding solid rather than a guess.',
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
        'A service is a program the system itself is responsible for keeping running, started automatically at boot or on demand rather than by a person typing a command, and systemd is the piece of software on modern Linux that manages all of them: starting, stopping, restarting them if they crash, and keeping a record of what it currently has running.\n\nThe process table is what IS running. The service list is what the system was TOLD to run, and the difference between the two is where a lot of findings live: a process with no service behind it was started by a person or by something pretending to be one.\n\nsystemd is the manager on modern Linux, and `systemctl list-units --type=service --state=running` asks it what it currently has up. Read the list against what the host is for. A web server running nginx, a database, and a mail agent is coherent. Anything you cannot map to the machine\'s purpose is a question.',
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
      'Every service in that list is explainable by the single sentence "this is a web server with a local database": nginx serving requests, postgresql holding the data behind them, and the small set of things any Linux host needs to function. Note what is conspicuously absent: the curl process you found earlier in the process table is not here at all, because nobody ever registered it with systemd as a service to be managed. It was simply run, directly, as a one-off command, which tells you a person or a script launched it in the moment rather than it being part of how this server was set up to normally operate.',
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
        'Alongside the plain text log files under /var/log, systemd keeps its own structured record of everything the services it manages have produced, called the journal. It exists partly because not every program writes to a file at all; some send their output only to whatever is managing them, and for those, the journal is the only record that exists at all.\n\n`journalctl -u UNIT` filters that journal down to a single service. That is often faster than hunting for the right file under /var/log, and on some systems it is the only place the output went in the first place.\n\n`-n` limits how many entries come back, newest last. Starting with a small number is the right instinct: you look at the tail, decide whether you are in the right place, and only then widen. Pulling ten thousand lines first and then trying to narrow them is how people lose twenty minutes.',
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
      'Look at what those requests are actually for. At least one is a probe for a file that does not exist anywhere on this host, the kind of request an automated scanner sends while checking for known vulnerable paths, and it is the exact same activity the Log Analysis package finds independently in the web server\'s access log. Corroboration is what it means when two entirely different views of a system, here the systemd journal, there a separate log file, land on the same event: it is much stronger evidence than either view alone.',
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
        '`top` is a live, constantly refreshing view of what the system is doing right now, similar in spirit to Task Manager on Windows: process activity, memory, load, all updating every second or two on screen. That works well when a person is watching it directly, and badly the moment you need to capture what it showed, hand it to someone else, or run it inside something automated.\n\nInteractively, `top` refreshes forever until you press q, which is useless in a transcript and impossible in a script. `-b` puts it in batch mode, printing plain text, and `-n1` takes exactly one sample and exits.\n\nThat pair is worth memorising: `top -bn1` is how you capture a snapshot of what a host was doing at a moment you can point at afterwards. During an incident, capturing state you can refer back to is worth more than watching it live, because live output is gone the moment the screen scrolls.',
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
      'Capture a snapshot like this at the very start of any investigation, before you change anything else on the host. The reason is straightforward: state you did not record is state you cannot compare against later, and the first few minutes of an incident are exactly when the system is most likely to look different from how it will look an hour afterward, once processes have started, stopped, or been cleaned up.',
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
        'Whether a Linux host is healthy or struggling usually comes down to a small number of numbers, and two of the most useful are how much memory it actually has room for and how long it has been running without a restart.\n\nTwo quick numbers describe whether a Linux host is coping. `free -h` shows memory, and the column that matters is "available" rather than "free": Linux deliberately uses spare memory as cache, so a host with very little "free" memory is usually working exactly as intended. Reading the wrong column here is one of the most common Linux misunderstandings.\n\n`uptime` gives you how long the machine has been up and its load average over one, five, and fifteen minutes. Uptime is worth checking for a reason that is not about performance: a server that rebooted an hour ago, when nobody scheduled a reboot, is a fact worth explaining.',
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
      'Look at "free" and then at "available". They are very different numbers for the reason explained above: Linux deliberately fills spare memory with cache to speed the system up, so "free" alone often looks alarmingly low even on a perfectly healthy host. "Available" already accounts for cache that can be reclaimed instantly if something actually needs it, which is why only that second number honestly answers the question "is this host short of memory". Reporting the first as though it were the second is a common enough mistake that it has a name in some teams: a healthy server escalated as an incident by someone reading the wrong column.',
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
        'Pivoting, in an investigation, means moving from one piece of evidence to a related one along some shared thread, an account name, a file, an address, rather than staring at a single log in isolation. It is how a handful of small, individually unremarkable observations turn into one coherent picture.\n\nFiltering the process table by account is the last step of a pivot you have now done from three directions: a log line named the account, a socket named the pid, and the filesystem held the file. Asking what that account is running right now closes the loop.\n\nWhat you are judging is whether the answer fits the account\'s job. A monitoring account should be running monitoring software. If instead it is running a general-purpose transfer tool, pointed at an archive in a temporary directory, addressed to a host outside the company, then the name on the account is the only monitoring-shaped thing about it.',
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
      'One process, and it is an upload of the exact archive you found back in module 1.6, sent to an address outside the company, run by an account that was created that same morning and has no legitimate reason to be transferring data anywhere. You reached this conclusion with `ls`, `find`, and `ps`, three of the plainest commands in this entire package, nothing exotic or specialised. Most of what a first responder actually does day to day is exactly this: simple tools, used carefully, followed in an order that keeps building on what the last command told you.',
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
