/**
 * Incident Response and Remediation -- 18 exercises across 4 modules.
 *
 * PACKAGE ID: 'incident-response', NOT a number.
 *
 * The numbered packages (1-4) keep their ids because progress rows reference
 * them and CLAUDE.md makes ids permanent. Every package written from here on
 * gets a NAME instead, because numbers collide the moment two people are adding
 * content at the same time -- which is exactly how this package and Networking
 * were written. Exercise ids follow: 'ir.1.1' rather than '5.1.1'.
 *
 * THE SAME INCIDENT, FOR THE THIRD TIME
 *
 * Log Analysis taught students to find this intrusion by hand, one grep at a time.
 * Alert Triage showed it to them again as eight alerts inside eighty-two. Here they
 * have to act on it: the attacker is still connected, an archive of patient
 * exports is sitting in /tmp/.cache, and somebody has to decide what happens in
 * the next five minutes.
 *
 * Meeting one incident from the analyst's chair, then the operator's, then the
 * responder's teaches what those roles actually are. Three unrelated scenarios
 * would teach three shallow things.
 *
 * WHAT IS BEING GRADED THAT WAS NOT BEFORE
 *
 * Judgement under incomplete information, and sequence. Half of forensics is
 * order rather than choice -- memory before disk, hash before touch -- and
 * getting five correct steps in the wrong order destroys evidence as thoroughly
 * as skipping them. `decision-orders` grades that directly.
 *
 * The decision points deliberately include options that are `defensible` rather
 * than sound: things a competent responder might reasonably choose, that cost
 * something. A student taught only right-versus-wrong freezes the first time
 * both available options are bad, which is most real incidents.
 *
 * ANSWERS ARE DERIVED, NOT TYPED. Option ids come from the decision point via
 * the helpers below, so re-authoring a decision point cannot leave a stale key.
 */

import type { Exercise, LearningPackage, Teach } from '@soc/shared';

import { intendedOrdering, optionsWithQuality } from '../services/incidents.js';
import { INCIDENT_RESPONSE_PRACTICE } from './incident-response-practice.js';

const PKG = 'incident-response';

// --- expected answers, derived from the decision points ----------------------

const CONTAIN_SOUND = optionsWithQuality('dp.contain', 'sound');
const CONTAIN_HARMFUL = optionsWithQuality('dp.contain', 'harmful');
const VOLATILITY_ORDER = intendedOrdering('dp.volatility');
const ERADICATE_SOUND = optionsWithQuality('dp.eradicate', 'sound');
const ERADICATE_HARMFUL = optionsWithQuality('dp.eradicate', 'harmful');
const NOTIFY_SOUND = optionsWithQuality('dp.notify', 'sound');
const NOTIFY_HARMFUL = optionsWithQuality('dp.notify', 'harmful');
const SCOPE_SOUND = optionsWithQuality('dp.scope', 'sound');
const SCOPE_HARMFUL = optionsWithQuality('dp.scope', 'harmful');
const RECOVER_SOUND = optionsWithQuality('dp.recover', 'sound');
const RECOVER_HARMFUL = optionsWithQuality('dp.recover', 'harmful');
const VALIDATE_SOUND = optionsWithQuality('dp.validate', 'sound');
const VALIDATE_HARMFUL = optionsWithQuality('dp.validate', 'harmful');

// --- shared teaching material ------------------------------------------------

const VOLATILITY_TEACH: Teach = {
  concept:
    'Evidence has a shelf life, and the order you collect it in decides how much of it survives. ' +
    'Memory disappears the instant power or state changes and is the only place some things ever ' +
    'exist: a decrypted key, an in-memory payload, the attacker’s live session. Disk will still ' +
    'be there in an hour. Collect in order of how fast a thing disappears, most volatile first.',
  examples: [
    {
      command: 'Memory → live connections → isolate → disk → logs',
      explains:
        'The standard order. Each step destroys or degrades something below it if performed too early.',
    },
    {
      command: 'Pull the power, then image the disk',
      explains:
        'The most common real-world mistake. Safe-feeling, and it discards everything that was only ' +
        'ever in RAM.',
    },
  ],
};

const UNCERTAINTY_TEACH: Teach = {
  concept:
    'You will make irreversible decisions on roughly sixty percent of the picture. The skill is not ' +
    'eliminating the uncertainty (there is no time) it is knowing precisely which part of your ' +
    'picture is missing and deciding anyway, out loud, so that somebody else can see what you were ' +
    'working from.',
  examples: [
    {
      command: 'Known: an archive of patient exports was staged at 11:06.',
      explains: 'Supported by evidence, and stated as fact.',
    },
    {
      command: 'Unknown: whether it left the network.',
      explains:
        'Stated as unknown rather than assumed either way. The difference decides whether a ' +
        'notification clock has started.',
    },
  ],
};

// --- module ir.1: containment ------------------------------------------------

const MODULE_1: Exercise[] = [
  {
    id: 'ir.1.1',
    moduleId: 'ir.1',
    packageId: PKG,
    order: 1,
    title: 'The attacker is still connected',
    kind: 'incident-decision',
    decisionPointId: 'dp.contain',
    goal: 'Contain a live intrusion without destroying the evidence of it.',
    prompt:
      'It is 11:42. The backdoor account is logged in right now and a 6.3 GB archive of patient ' +
      'exports is staged on disk. Choose what you do in the next five minutes. Read the snapshot ' +
      'first, including what is listed as unknown.',
    teach: {
      concept:
        'Containment is the first irreversible decision in most incidents, and it is usually made ' +
        'under time pressure by whoever noticed. Every option trades something: speed against ' +
        'evidence, evidence against exposure, exposure against service. There is no move that costs ' +
        'nothing, and looking for one is how people freeze.',
      examples: [
        {
          command: 'Preserve, then contain',
          explains:
            'Capture what disappears first, then cut access. Costs a few minutes and keeps everything.',
        },
        {
          command: 'Contain, then preserve',
          explains:
            'Faster to stop the bleeding, and whatever was only in memory is gone before you look.',
        },
      ],
    },
    hints: [
      'Two of these options stop the attacker and destroy evidence at the same time. Find them first.',
      'One option tells the attacker they have been seen without actually removing their access. Ask ' +
        'what an attacker does when they know they are being watched.',
      'The archive is still on disk and the portal is still serving patients. The best option ' +
        'preserves the running system, keeps the service up, and still removes access.',
    ],
    solution:
      'Capture memory, then isolate the host at the network layer, failing the portal over to ' +
      'rmg-web-01. The attacker loses access, the running system and its memory are preserved, and ' +
      'a clinical outage becomes a capacity reduction. Pulling the power and killing the session are ' +
      'both worse than doing nothing carefully.',
    expectedOutput: 'Memory captured, host isolated at the network layer, service failed over.',
    checks: [
      {
        type: 'decision-selects',
        optionIds: CONTAIN_SOUND,
        hint:
          'One option preserves the evidence, keeps the service up, and removes the attacker. You ' +
          'have not chosen it.',
      },
      {
        type: 'decision-avoids',
        optionIds: CONTAIN_HARMFUL,
        hint:
          'One of your choices either destroys volatile evidence or tips the attacker off without ' +
          'removing their access. Both make the incident worse than leaving it alone for five minutes.',
      },
      /*
       * The reasoning is graded here, not just the choice. Picking the right
       * option for the wrong reason is the failure this module is about: an
       * analyst who isolates because "isolating is the safe default" will pull
       * the power the day the runbook does not cover the situation.
       */
      {
        type: 'decision-justifies',
        conceptGroups: [
          ['memory', 'ram', 'volatil'],
          ['evidence', 'forensic', 'artefact', 'artifact', 'proof'],
          ['isolat', 'network', 'contain', 'access'],
        ],
        hint:
          'Say why in the box: what is lost if you act in the wrong order, and what isolating buys ' +
          'you that a shutdown does not.',
      },
    ],
    debrief:
      'Pulling the power is the single most common response to a live intrusion, and it is why so ' +
      'many incident reports contain the sentence "we were unable to determine whether the database ' +
      'was accessed". The answer was in memory, and somebody safe-ed it away.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.1.1'] ?? [],
  },
  {
    id: 'ir.1.2',
    moduleId: 'ir.1',
    packageId: PKG,
    order: 2,
    title: 'Order of volatility',
    kind: 'incident-decision',
    decisionPointId: 'dp.volatility',
    goal: 'Sequence evidence collection so that no step destroys what the next one needs.',
    prompt:
      'You have authorisation to contain and about twenty minutes. Put the five collection steps in ' +
      'the order you would perform them. Every step here is correct: only the order is being graded, ' +
      'and it is the whole answer.',
    teach: VOLATILITY_TEACH,
    hints: [
      'Ask of each step: what does this destroy that another step needs?',
      'Isolating the host kills the live network connections. So anything that reads them has to ' +
        'happen first.',
      'Disk and logs are not going anywhere. They belong at the end precisely because they are safe.',
    ],
    solution:
      'Capture volatile memory; record live network connections and their processes; isolate the ' +
      'host from the network; image and hash the disk; collect the log files. Memory first because ' +
      'it evaporates on any state change, connections second because isolation destroys them, ' +
      'isolation third because it is free once those two are done, then the non-volatile evidence in ' +
      'whatever order is convenient.',
    expectedOutput: 'The five steps in strict order of volatility, most volatile first.',
    checks: [
      {
        type: 'decision-orders',
        optionIds: VOLATILITY_ORDER,
        hint:
          'Something in your sequence destroys evidence that a later step needs. Work backwards: for ' +
          'each step, what would already be gone if you did it now?',
      },
    ],
    debrief:
      'This ordering is not a convention somebody agreed on: it falls out of physics. Every argument ' +
      'about it in a real incident is really an argument about time pressure, and the answer is ' +
      'always that capturing memory takes minutes and not capturing it takes the rest of the ' +
      'investigation.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.1.2'] ?? [],
  },
  {
    id: 'ir.1.3',
    moduleId: 'ir.1',
    packageId: PKG,
    order: 3,
    title: 'Defend the decision you did not make',
    kind: 'short-answer',
    goal: 'Explain why the fastest containment option is usually the wrong one.',
    prompt:
      'Your manager asks why you did not simply power the server off the moment you saw an active ' +
      'attacker session, which would have stopped everything instantly. Answer in three or four ' +
      'sentences. Say what would have been lost and why it mattered to this specific incident.',
    teach: VOLATILITY_TEACH,
    hints: [
      'What exists only in memory on a running system?',
      'This incident has an open question a memory image could answer. Look at the unknowns.',
      'There is a second cost besides evidence: what happens to the patient portal.',
    ],
    solution:
      'A hard power-off destroys everything that existed only in memory: the attacker’s live session ' +
      'state, any process that never wrote to disk, and decrypted key material. That matters here ' +
      'specifically because we still cannot establish whether the attacker reached rmg-db-01, and ' +
      'the live connection table was the fastest route to that answer. It would also have dropped the ' +
      'patient portal without warning anybody clinical, turning a contained security incident into a ' +
      'service outage. Isolating at the network layer stopped the attacker just as effectively and ' +
      'cost neither of those things.',
    expectedOutput:
      'An answer naming what memory holds, why it mattered to this incident, and the service cost.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['memory', 'ram', 'volatile'],
          ['session', 'process', 'connection', 'key', 'evidence'],
          ['isolat', 'network', 'disconnect', 'segment'],
        ],
        hint:
          'Name what is lost (memory and what lives in it), and name the alternative that stopped ' +
          'the attacker without that cost.',
      },
    ],
    debrief:
      'Being able to defend a slower decision is a large part of senior incident work. The pressure ' +
      'in the room is always toward the fastest visible action, and "I took four more minutes and ' +
      'kept the evidence" is a sentence you will need ready.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.1.3'] ?? [],
  },
  {
    id: 'ir.1.4',
    moduleId: 'ir.1',
    packageId: PKG,
    order: 4,
    title: 'What containment does not fix',
    kind: 'multiple-choice',
    goal: 'Recognise that cutting access is not the same as removing the attacker.',
    prompt:
      'The host is isolated and the attacker’s session is dead. Which of the following are still ' +
      'true? Select all that apply.',
    teach: {
      concept:
        'Containment stops the incident progressing. It does not undo anything. Every mechanism the ' +
        'attacker installed is still sitting on the disk waiting for the host to be reconnected, and ' +
        'the way in that they used is usually still open. Treating containment as resolution is the ' +
        'single most common reason incidents reopen.',
      examples: [
        {
          command: 'Contained',
          explains: 'The attacker cannot act right now. Nothing has been removed.',
        },
        {
          command: 'Eradicated',
          explains:
            'Every mechanism they installed is gone and the route they used is closed. A separate, ' +
            'later, slower job.',
        },
      ],
    },
    options: [
      { id: 'a', label: 'The sysmon account still exists on the host, with sudo rights.' },
      { id: 'b', label: 'The crontab will resume beaconing as soon as the host is reconnected.' },
      { id: 'c', label: 'The attacker’s SSH key is still in authorized_keys.' },
      { id: 'd', label: 'The stale testuser account and its weak password are still the original way in.' },
      { id: 'e', label: 'The incident can now be closed, since the attacker has no access.' },
    ],
    hints: [
      'Four of these five are true. Isolation changed the network, not the disk.',
      'Ask what a reconnection would restore.',
      'One option confuses containment with eradication.',
    ],
    solution:
      'A, B, C and D. Isolation removed the attacker’s access to a host and changed nothing on it. ' +
      'The account, its sudo membership, the crontab and the SSH key are all still present, and so is ' +
      'the stale test account that let them in. E is the trap: containment buys time, it does not end ' +
      'anything.',
    expectedOutput: 'Options A, B, C and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'Isolation is a network change, not a disk change. Everything the attacker wrote is still ' +
          'there, and one of these options mistakes containment for closure.',
      },
    ],
    debrief:
      'Ridgeline would have reset the testuser password here, congratulated themselves, and been ' +
      're-compromised the moment the host came back: by a cron job nobody looked for, because the ' +
      'alert about it was rated low.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.1.4'] ?? [],
  },
];

// --- module ir.2: evidence on the host ---------------------------------------

const MODULE_2: Exercise[] = [
  {
    id: 'ir.2.1',
    moduleId: 'ir.2',
    packageId: PKG,
    order: 1,
    title: 'Find the account that should not exist',
    kind: 'terminal',
    goal: 'Enumerate the accounts that can actually log in, and spot the one an attacker created.',
    prompt:
      'You are on the isolated host. Most accounts in /etc/passwd are system accounts that cannot ' +
      'log in at all. Show only the ones with a real login shell, so the backdoor account is visible ' +
      'among them.',
    teach: {
      concept:
        'The first thing a responder establishes on a compromised host is who can log in. ' +
        '/etc/passwd is one colon-separated line per account: name, placeholder, UID, GID, comment, ' +
        'home directory, shell. The shell is the last field, and it is the one that matters: an ' +
        'account whose shell is /usr/sbin/nologin cannot be used to log in no matter what its ' +
        'password is.',
      syntax: 'grep PATTERN FILE',
      examples: [
        {
          command: 'grep nologin /etc/passwd',
          explains: 'The inverse: every account that CANNOT log in. Most of the file, on a healthy server.',
        },
        {
          command: 'cut -d: -f1,3 /etc/passwd',
          explains: 'Account name and UID only, which is how you spot a UID that does not belong.',
        },
      ],
      flags: [
        { flag: '-d:', means: 'For cut: treat the colon as the field separator.' },
        { flag: '-f', means: 'For cut: which fields to keep, counting from 1.' },
      ],
    },
    hints: [
      'Every account that can log in has an interactive shell in the last field.',
      'On this host that shell is /bin/bash. Search for it.',
      'grep for bash against /etc/passwd.',
    ],
    solution: 'grep bash /etc/passwd',
    expectedOutput:
      'The accounts with a real login shell, including sysmon (UID 1501): a name chosen to look ' +
      'like monitoring infrastructure, on an account nothing provisioned.',
    checks: [
      {
        type: 'output-contains',
        text: 'sysmon',
        hint: 'The backdoor account has a login shell, so it should appear in your output.',
      },
      {
        type: 'output-excludes',
        text: 'nologin',
        hint:
          'Accounts with /usr/sbin/nologin cannot log in and are noise here. Your filter is letting ' +
          'them through.',
      },
    ],
    debrief:
      'sysmon is named to look like monitoring infrastructure and has an ordinary user UID of 1501. ' +
      'Real service accounts are either provisioned below 1000 or created by something that keeps a ' +
      'record. Nothing on this host has a record of creating this one. Note testuser is here too, ' +
      'described in its own comment field as a temporary migration account.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.2.1'] ?? [],
  },
  {
    id: 'ir.2.2',
    moduleId: 'ir.2',
    packageId: PKG,
    order: 2,
    title: 'Find who holds administrative rights',
    kind: 'terminal',
    goal: 'Read group membership to establish who can escalate to root.',
    prompt:
      'Show the sudo group line from /etc/group, so you can see every account that can run commands ' +
      'as root on this host.',
    teach: {
      concept:
        'Knowing who can become root matters more than knowing who exists. /etc/group lists group ' +
        'name, placeholder, GID, and a comma-separated member list. Membership of sudo is ' +
        'root-equivalent access, and it is exactly where an attacker puts an account they intend to ' +
        'keep: alongside, quite often, an account of yours that should have lost it years ago.',
      syntax: 'grep PATTERN FILE',
      examples: [
        {
          command: 'grep adm /etc/group',
          explains: 'The adm group and its members: historically the accounts allowed to read logs.',
        },
        {
          command: 'cut -d: -f1 /etc/group',
          explains: 'Every group name on the system, without the membership lists.',
        },
      ],
    },
    hints: [
      'The line you want names the group that grants root access.',
      'That group is called sudo on Debian-family systems, which this is.',
      'grep for sudo against /etc/group.',
    ],
    solution: 'grep sudo /etc/group',
    expectedOutput:
      'The sudo group line, listing jmartel, rchen, testuser and sysmon. Two of those four should ' +
      'not be there.',
    checks: [
      {
        type: 'output-contains',
        text: 'sysmon',
        hint: 'The backdoor account was added to a privileged group. Your output should show it.',
      },
      {
        type: 'output-contains',
        text: 'testuser',
        hint:
          'A second account in that group is also wrong: the stale test account the attacker used ' +
          'to get in. It should be in your output too.',
      },
    ],
    debrief:
      'Two findings, not one. sysmon is the attacker’s. testuser holding sudo is Ridgeline’s own ' +
      'mistake, made 619 days ago, and it is the reason a guessed password became root access rather ' +
      'than a nuisance. The second finding is the one that goes in the post-mortem.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.2.2'] ?? [],
  },
  {
    id: 'ir.2.3',
    moduleId: 'ir.2',
    packageId: PKG,
    order: 3,
    title: 'Read the attacker’s own keystrokes',
    kind: 'terminal',
    goal: 'Recover shell history and reconstruct what was done from the commands themselves.',
    prompt:
      'The compromised account left a shell history behind. Read ' +
      '/home/testuser/.bash_history and see what was actually run.',
    teach: {
      concept:
        'bash writes the commands a user typed to ~/.bash_history when the shell exits. It is the ' +
        'closest thing to a transcript of what somebody did, and attackers know it, which is why ' +
        'the last command in a compromised history is so often an attempt to erase it. That attempt ' +
        'is itself written to the file, so it survives and tells you something about intent.',
      syntax: 'cat FILE',
      examples: [
        {
          command: 'ls -la /home/testuser',
          explains: 'Shows which dotfiles exist in a home directory, and when each was last written.',
        },
        {
          command: 'cat /etc/crontab',
          explains: 'Reading a plain text file. Same shape as the command you need.',
        },
      ],
    },
    hints: [
      'Shell history lives in a hidden file in the user’s home directory.',
      'The file is called .bash_history: the leading dot makes it hidden.',
      'The compromised account is testuser, not sysmon.',
    ],
    solution: 'cat /home/testuser/.bash_history',
    expectedOutput:
      'The attacker orienting themselves, then creating the sysmon account, setting its password, ' +
      'granting it sudo, and finally trying to clear the history.',
    checks: [
      {
        type: 'output-contains',
        text: 'useradd',
        hint:
          'The history should show the backdoor account being created. Check the path: it is the ' +
          'compromised account’s home directory.',
      },
      {
        type: 'output-contains',
        text: 'usermod',
        hint: 'The same history shows the new account being granted privilege. Look for usermod.',
      },
    ],
    debrief:
      'Read the sequence: id, sudo -l, cat /etc/passwd (an attacker working out what they have) ' +
      'then useradd, passwd, usermod -aG sudo, then history -c. The `sudo -l` is the moment they ' +
      'discovered that a temporary test account could become root. The `history -c` at the end ran ' +
      'too late to remove anything, because the file had already been written.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.2.3'] ?? [],
  },
  {
    id: 'ir.2.4',
    moduleId: 'ir.2',
    packageId: PKG,
    order: 4,
    title: 'Find the staged data',
    kind: 'terminal',
    goal: 'Locate staged data and read its size and timestamp as evidence.',
    prompt:
      'The attacker collected data into an archive somewhere under /tmp. List the contents of ' +
      '/tmp/.cache in long form, so you can see what is there, how large it is, and when it was ' +
      'written.',
    teach: {
      concept:
        'Data staging is the step between access and theft: the attacker collects what they want ' +
        'into one file, then moves it. The staged copy tells you what they selected, how much of it ' +
        'there was, and exactly when: three facts that decide the scope of a breach notification. ' +
        'Dot-directories under /tmp are a favourite hiding place because plain ls does not show them.',
      syntax: 'ls [OPTIONS] PATH',
      examples: [
        {
          command: 'ls -la /tmp',
          explains: 'Long form including hidden entries, which is how you find a directory beginning with a dot.',
        },
        {
          command: 'ls -la /var/www/portal/exports',
          explains: 'The directory the archive was built from, and what was in it.',
        },
      ],
      flags: [
        { flag: '-l', means: 'Long form: permissions, owner, size, modification time.' },
        { flag: '-a', means: 'Include entries beginning with a dot.' },
      ],
    },
    hints: [
      'You need long form so the size and timestamp are visible.',
      'The flags can be grouped: -la.',
      'The path is /tmp/.cache: the dot is part of the directory name.',
    ],
    solution: 'ls -la /tmp/.cache',
    expectedOutput:
      'pt.tar.gz at roughly 6.3 GB, written at 11:09 and owned by root: plus a second file, the ' +
      'payload the scheduled job downloads.',
    checks: [
      {
        type: 'output-contains',
        text: 'pt.tar.gz',
        hint: 'The staged archive should be listed. Check you are looking inside /tmp/.cache.',
      },
      {
        type: 'command-has-flag',
        command: 'ls',
        flags: ['l'],
        hint:
          'Without long form you get names and nothing else. The size and the timestamp are the ' +
          'evidence here, so you need -l.',
      },
    ],
    debrief:
      'The size and timestamp are the finding, not the filename. 6,298,441 bytes written at 11:09 ' +
      'from a directory holding patient exports is what turns an intrusion into a potential regulated ' +
      'breach, and it is the number legal will ask for first. Note the second file, owned by sysmon: ' +
      'that is what the scheduled job fetches and runs.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.2.4'] ?? [],
  },
  {
    id: 'ir.2.5',
    moduleId: 'ir.2',
    packageId: PKG,
    order: 5,
    title: 'What you can see without being root',
    kind: 'terminal',
    goal: 'Read a directory listing as evidence, and recognise what your own privileges hide.',
    prompt:
      'List the backdoor account’s home directory in long form. You will not be able to read what is ' +
      'inside it (you are logged in as student, not root) but the listing alone is evidence.',
    teach: {
      concept:
        'You are not root on this host, and a real responder frequently is not either at first. That ' +
        'is not a dead end: metadata is evidence. A directory you cannot open still tells you it ' +
        'exists, who owns it, what its permissions are, and when it was last written, and for SSH ' +
        'key material, when it was written is very nearly the whole finding. Recording what you could ' +
        'not access, and why, is part of the job rather than a failure of it.',
      syntax: 'ls [OPTIONS] PATH',
      examples: [
        {
          command: 'ls -la /home',
          explains: 'Every home directory and when each was created: an account created today stands out.',
        },
        {
          command: 'ls -la /home/student',
          explains: 'Your own home directory, which you can read completely. Compare it with one you cannot.',
        },
      ],
      flags: [
        { flag: '-l', means: 'Long form: permissions, owner, size, modification time.' },
        { flag: '-a', means: 'Include entries beginning with a dot, such as .ssh.' },
      ],
    },
    hints: [
      'The account is the backdoor one you found in ir.2.1.',
      'Its home directory follows the usual pattern under /home.',
      'You need -a as well as -l, because the interesting entry starts with a dot.',
    ],
    solution: 'ls -la /home/sysmon',
    expectedOutput:
      'A .ssh directory owned by sysmon with permissions drwx------, written at 11:04: four minutes ' +
      'before the attacker logged back in using a key.',
    checks: [
      {
        type: 'output-contains',
        text: '.ssh',
        hint:
          'The interesting entry is a hidden directory. Without -a it will not be listed at all.',
      },
      {
        type: 'command-has-flag',
        command: 'ls',
        flags: ['l', 'a'],
        hint:
          'You need both: -a to show the hidden .ssh entry, and -l to show its owner, permissions ' +
          'and timestamp, which are the evidence.',
      },
    ],
    debrief:
      'You cannot read authorized_keys as student, and that is realistic. What you can establish is ' +
      'that SSH key material was written at 11:04 on an account created at 10:22, four minutes before ' +
      'a key-based login from the attacker’s address. That is enough to know a key exists and to ' +
      'record that reading it requires escalated access and an evidence request, which is exactly ' +
      'what you would write in the case notes.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.2.5'] ?? [],
  },
];


// --- module ir.3: scope and eradication --------------------------------------

const MODULE_3: Exercise[] = [
  {
    id: 'ir.3.1',
    moduleId: 'ir.3',
    packageId: PKG,
    order: 1,
    title: 'Everything that has to go',
    kind: 'incident-decision',
    decisionPointId: 'dp.eradicate',
    goal: 'Eradicate completely, without destroying evidence in the process.',
    prompt:
      'The host is isolated and imaged, and you are about to rebuild. Select everything that must be ' +
      'dealt with before it goes back into service. One of these options is a mistake that feels ' +
      'like thoroughness.',
    teach: {
      concept:
        'Eradication is a checklist, not a judgement call, because missing one item is ' +
        'indistinguishable from doing nothing. Two things trip people here: forgetting the original ' +
        'way in (which was not the attacker’s doing and is still open) and deleting evidence in the ' +
        'name of cleaning up.',
      examples: [
        {
          command: 'Rebuild from a known-good image',
          explains:
            'Correct whenever the attacker had root. Cleaning assumes you found everything; rebuilding ' +
            'does not need that assumption.',
        },
        {
          command: 'Delete the staged archive',
          explains:
            'Tempting and wrong while the investigation is live. Its size and timestamps are how the ' +
            'data impact gets scoped.',
        },
      ],
    },
    hints: [
      'You found four mechanisms in the previous module. All four belong here.',
      'There is a fifth item that is not the attacker’s creation but is still how they got in.',
      'One option destroys the evidence you need for the notification decision. Another mistakes an ' +
        'address block for eradication.',
    ],
    solution:
      'Remove the sysmon account, its sudo group membership, its crontab and its SSH key; disable ' +
      'testuser and revoke the sudo rights it should never have had; and rebuild the host from a ' +
      'known-good image rather than cleaning it. Leave the staged archive alone until the ' +
      'investigation has finished with it, and do not mistake a firewall block for eradication.',
    expectedOutput: 'Every persistence mechanism and the original entry route, with evidence preserved.',
    checks: [
      {
        type: 'decision-selects',
        optionIds: ERADICATE_SOUND,
        hint:
          'Something is missing. Count the persistence mechanisms you found on the host, then ask how ' +
          'the attacker got in before any of them existed.',
      },
      {
        type: 'decision-avoids',
        optionIds: ERADICATE_HARMFUL,
        hint:
          'One of your choices either destroys evidence the notification decision depends on, or ' +
          'returns a host to service with the backdoor still on it.',
      },
    ],
    debrief:
      'Note what deleting the archive would have cost: not the evidence itself, which is on the disk ' +
      'image, but the two hours of work needed to get it back off that image at the moment legal is ' +
      'asking how much data was involved.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.3.1'] ?? [],
  },
  {
    id: 'ir.3.2',
    moduleId: 'ir.3',
    packageId: PKG,
    order: 2,
    title: 'What to hunt the estate with',
    kind: 'short-answer',
    goal: 'Turn one compromised host into indicators you can sweep everything else with.',
    prompt:
      'The first host you find is rarely the only one. List the indicators you would sweep the rest ' +
      'of the estate for, and say what each one would prove if it hit. Four is enough.',
    teach: {
      concept:
        'An indicator of compromise is any observable that would only be present if the same actor ' +
        'had been there. Good ones are specific enough that a hit means something and durable enough ' +
        'to survive the attacker changing tools. Addresses are the weakest: they are cheap to ' +
        'change; account names, key material and behavioural patterns last longer.',
      examples: [
        {
          command: 'A source address',
          explains: 'Cheap to sweep, cheap for the attacker to change. Start here, do not stop here.',
        },
        {
          command: 'A scheduled job fetching a remote script every fifteen minutes',
          explains:
            'A behavioural pattern. Survives the attacker changing address, filename and account name.',
        },
      ],
    },
    hints: [
      'You have two external addresses from this incident, and they do different jobs.',
      'The account name and the key are both specific to this actor.',
      'The cron pattern is the most durable indicator you have. Why?',
    ],
    solution:
      'The source address 203.0.113.55, which would show the same actor authenticating elsewhere; ' +
      'the beacon destination 198.51.100.60, whose appearance in egress logs anywhere would mean ' +
      'another host is still calling home; the account name sysmon and its UID, which would show the ' +
      'same backdoor pattern; and the public key from authorized_keys, whose fingerprint appearing on ' +
      'any other host would be conclusive. The most durable of the four is the behavioural one: a ' +
      'crontab fetching a remote script on a fixed interval, because the attacker can change every ' +
      'address and filename but not the technique.',
    expectedOutput:
      'Four indicators, each with what a hit would prove, and some recognition that addresses are the ' +
      'weakest of them.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['203.0.113.55', '198.51.100.60', 'address', 'ip'],
          ['sysmon', 'account', 'username'],
          ['key', 'authorized_keys', 'fingerprint'],
          ['cron', 'scheduled', 'beacon', 'interval', 'behaviour', 'behavior', 'pattern'],
        ],
        hint:
          'Cover four distinct kinds of indicator: an address, the account, the key, and the ' +
          'behavioural pattern. A list of only addresses is the weakest possible sweep.',
      },
    ],
    debrief:
      'This list is the deliverable that makes the difference between remediating a host and ending ' +
      'an incident. Everything on it can be handed to somebody else and run across ten thousand ' +
      'machines without them understanding the case at all.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.3.2'] ?? [],
  },
  {
    id: 'ir.3.3',
    moduleId: 'ir.3',
    packageId: PKG,
    order: 3,
    title: 'Proving it is over',
    kind: 'incident-decision',
    decisionPointId: 'dp.validate',
    goal: 'Validate remediation instead of asserting it.',
    prompt:
      'Day three. The host is rebuilt and the portal is back. Somebody asks whether the incident is ' +
      'closed. Choose what you would do before saying yes.',
    teach: {
      concept:
        '"We think it is clean" is not a finding. Validation means picking tests that would FAIL if ' +
        'you were wrong, and running them: sweep the estate for your indicators, watch egress for the ' +
        'beacon destination, and close the route you never fully explained. Failed remediation does ' +
        'not announce itself: the incident simply restarts later, usually worse.',
      examples: [
        {
          command: 'Watch egress for the beacon destination',
          explains:
            'The cheapest possible test of "did we get it all". If anything still calls home, ' +
            'something you did not find is still running.',
        },
        {
          command: 'Declare closure because the host was rebuilt',
          explains:
            'Asserts the conclusion. Rebuilding one machine says nothing about the other nine thousand.',
        },
      ],
    },
    hints: [
      'You never established how the testuser password was obtained. What does that leave open?',
      'Which of these would actually FAIL if you had missed something?',
      'Two options here close the incident on the strength of work you have not done.',
    ],
    solution:
      'Hunt the whole estate for the indicators you extracted, watch egress for contact with the ' +
      'beacon destination for a defined period, and force a credential reset for accounts that could ' +
      'share the compromised password. Declaring closure now, or skipping the post-mortem, would end ' +
      'the incident on paper rather than in fact.',
    expectedOutput: 'The three validating actions selected, and neither closure shortcut taken.',
    checks: [
      {
        type: 'decision-selects',
        optionIds: VALIDATE_SOUND,
        hint:
          'At least one validating action is missing. Ask which of these would actually fail if your ' +
          'remediation had been incomplete.',
      },
      {
        type: 'decision-avoids',
        optionIds: VALIDATE_HARMFUL,
        hint:
          'One of your choices closes the incident on the strength of one rebuilt host, or skips the ' +
          'step that stops it happening again.',
      },
    ],
    debrief:
      'The credential reset is the one people argue about, because it is disruptive and the link is ' +
      'speculative. That is exactly why it belongs: you never established how the password was ' +
      'obtained, so you cannot rule out that it works somewhere else.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.3.3'] ?? [],
  },
  {
    id: 'ir.3.4',
    moduleId: 'ir.3',
    packageId: PKG,
    order: 4,
    title: 'How much data was involved',
    kind: 'short-answer',
    goal: 'Scope data impact honestly, separating what is proven from what is inferred.',
    prompt:
      'Legal asks how much patient data was involved. Answer in three or four sentences. Be precise ' +
      'about what the evidence establishes and equally precise about what it does not.',
    teach: UNCERTAINTY_TEACH,
    hints: [
      'You have a file, a size, a timestamp, and a source directory. That is what is proven.',
      'What you do not have is evidence of transfer. Say so explicitly.',
      'The distinction between "was collected" and "was taken" is the entire answer.',
    ],
    solution:
      'A 6.3 GB archive was created at 11:06 from /var/www/portal/exports, a directory holding ' +
      'generated patient record exports: appointment and billing data covering several thousand ' +
      'patients. That the data was collected and staged is established by the file itself, its size ' +
      'and its timestamp. Whether any of it left the network is NOT established: there was an active ' +
      'external session at the time, but egress records have not yet been reconciled against the ' +
      'archive size. So the correct statement today is that patient data was staged for exfiltration ' +
      'and transfer can neither be confirmed nor ruled out.',
    expectedOutput:
      'What the archive proves, what it does not, and the staged-versus-taken distinction stated ' +
      'plainly.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['6.3', '6.3 gb', 'archive', 'staged', 'tar'],
          ['patient', 'export', 'records', 'regulated'],
          ['not established', 'cannot confirm', 'unknown', 'unclear', 'no evidence', 'not proven', 'cannot rule out'],
        ],
        hint:
          'Say what the archive is and where it came from, and state explicitly that transfer is not ' +
          'established. An answer that omits the uncertainty is the one that causes trouble later.',
      },
    ],
    debrief:
      'Overstating this makes a breach notification out of an inference; understating it misses a ' +
      'statutory deadline. The people who decide are not technical, so the precision has to come from ' +
      'you: "staged for exfiltration, transfer unconfirmed" is a sentence they can act on.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.3.4'] ?? [],
  },
  {
    id: 'ir.3.5',
    moduleId: 'ir.3',
    packageId: PKG,
    order: 5,
    title: 'The actual root cause',
    kind: 'short-answer',
    goal: 'Identify the organisational failure rather than the attacker’s cleverness.',
    prompt:
      'What is the root cause of this incident? Not the immediate trigger: the condition that made ' +
      'it possible. Name it and say what control would have prevented it.',
    teach: {
      concept:
        'Root cause analysis fails when it stops at the attacker. "Somebody brute-forced us" is not a ' +
        'root cause, because brute force is a constant of the internet and always will be. The root ' +
        'cause is the condition on your side that turned an ordinary attack into a compromise, and ' +
        'it is nearly always something your own organisation did, months earlier, for a good reason.',
      examples: [
        {
          command: 'Cause: the attacker guessed a password',
          explains: 'Stops at the adversary. Produces no control, because you cannot patch an attacker.',
        },
        {
          command: 'Cause: a test account with sudo rights outlived its purpose by 619 days',
          explains: 'Names something you own, and implies a control you can actually build.',
        },
      ],
    },
    hints: [
      'The brute force succeeded against exactly one account. What was unusual about that account?',
      'Its password had not changed in 619 days, and it had privileges it was never meant to keep.',
      'Ask who created that condition. It was not the attacker.',
    ],
    solution:
      'The root cause is a stale test account, testuser, that survived its purpose by 619 days, kept ' +
      'a weak password, and held sudo rights it was never intended to have. The brute force was ' +
      'ordinary (this host is scanned continuously) and it succeeded because that one account was ' +
      'both guessable and privileged. The control is an account lifecycle process: non-human and ' +
      'temporary accounts get an expiry date at creation, privileged group membership is reviewed on ' +
      'a schedule, and anything unused for a defined period is disabled automatically rather than ' +
      'waiting for somebody to notice.',
    expectedOutput:
      'The stale privileged account named as the cause, and a lifecycle or access-review control ' +
      'proposed.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['testuser', 'test account', 'stale', 'dormant', 'unused'],
          ['sudo', 'privilege', 'admin', 'rights', 'access'],
          ['review', 'lifecycle', 'expiry', 'expire', 'disable', 'audit', 'deprovision', 'rotation'],
        ],
        hint:
          'Name the account and what was wrong with it (stale AND privileged) then propose a ' +
          'control that would have caught it before an attacker did.',
      },
    ],
    debrief:
      'This is the single most valuable paragraph in the whole incident, and it is the one most often ' +
      'skipped because the team is exhausted and the attacker is gone. Without it, the next intrusion ' +
      'uses the next stale account.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.3.5'] ?? [],
  },
];

// --- module ir.4: communication and closure ----------------------------------

const MODULE_4: Exercise[] = [
  {
    id: 'ir.4.1',
    moduleId: 'ir.4',
    packageId: PKG,
    order: 1,
    title: 'Whether the clock has started',
    kind: 'incident-decision',
    decisionPointId: 'dp.notify',
    goal: 'Route a notification decision to the people who own it, at the right moment.',
    prompt:
      'You can prove an archive of patient exports was staged. You cannot prove it left. Legal is ' +
      'asking whether the notification clock has started. Decide what you do.',
    teach: {
      concept:
        'Notification is not your decision, and the timing of telling the people whose decision it is ' +
        '*is* your decision. Obligations for regulated data generally run from awareness of a ' +
        'potential compromise, not from proof of transfer, so "I will tell them once I am sure" can ' +
        'consume a statutory deadline on somebody else’s behalf.',
      examples: [
        {
          command: 'Tell legal what you know and what you do not, now',
          explains:
            'They own the decision. Your contribution is an accurate picture including the gaps.',
        },
        {
          command: 'Declare a confirmed breach',
          explains:
            'Overstates the evidence, reaches patients and regulators, and is very hard to walk back.',
        },
      ],
    },
    hints: [
      'Whose decision is this, actually?',
      'Notification timelines usually run from awareness, not from proof.',
      'Two options here are wrong in opposite directions: one waits for certainty, one asserts it.',
    ],
    solution:
      'Notify legal and the privacy officer now, stating the facts and the uncertainty plainly: an ' +
      'archive of patient exports was staged at 11:06, there was an active external session at the ' +
      'time, and transfer is neither confirmed nor excluded. They own whether the clock has started; ' +
      'your job is to make sure they decide knowing both halves.',
    expectedOutput: 'Legal and the privacy officer engaged immediately, with the uncertainty stated.',
    checks: [
      {
        type: 'decision-selects',
        optionIds: NOTIFY_SOUND,
        hint:
          'The people who own the notification decision need the picture now, including what you ' +
          'cannot establish.',
      },
      {
        type: 'decision-avoids',
        optionIds: NOTIFY_HARMFUL,
        hint:
          'One of your choices waits for a certainty that notification law does not require, which ' +
          'risks consuming a deadline that is already running.',
      },
    ],
    debrief:
      'Regulators penalise delay far more consistently than they penalise the breach. The instinct to ' +
      'wait until you understand it properly is a good engineering instinct and the wrong one here.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.4.1'] ?? [],
  },
  {
    id: 'ir.4.2',
    moduleId: 'ir.4',
    packageId: PKG,
    order: 2,
    title: 'The executive brief',
    kind: 'short-answer',
    goal: 'Explain the incident to people who cannot act on technical detail.',
    prompt:
      'You have four minutes with the executive team. Explain what happened, who is affected, what ' +
      'you are doing, and what you need from them. No jargon: if a word would need explaining, it ' +
      'does not belong. Six sentences at most.',
    teach: {
      concept:
        'Executives need four things and no others: what happened in plain terms, how bad it is, what ' +
        'is being done, and what decision you need from them. Technical detail does not reassure ' +
        'them, it obscures the decision, and the most common failure is not being unclear, it is ' +
        'burying the ask so far down that nobody realises they were meant to do something.',
      examples: [
        {
          command: 'An attacker brute-forced SSH and escalated via a sudo-enabled stale account',
          explains: 'Accurate, and to this audience it is noise. They cannot act on any word of it.',
        },
        {
          command:
            'Someone guessed the password to an old test account and used it to take copies of ' +
            'patient records. We stopped it and are checking whether the copies left our network.',
          explains: 'Same facts, and now they can follow it and ask the right question.',
        },
      ],
    },
    hints: [
      'Lead with impact, not chronology. They want to know about patient data.',
      'Say what you do not know as clearly as what you do: they will be asked.',
      'End with the ask. What decision or resource do you actually need?',
    ],
    solution:
      'Someone guessed the password to an old test account on the patient portal server and used it ' +
      'to give themselves administrator access. They collected a copy of patient appointment and ' +
      'billing records into a single file. We cut off their access this morning and the portal is ' +
      'running normally on a backup server. We do not yet know whether that copy actually left our ' +
      'network: establishing that is our priority today, and legal has been engaged in case patient ' +
      'notification is required. What we need from you is a decision on external communications ' +
      'before we know the answer, and authorisation to force a password reset across the ' +
      'organisation.',
    expectedOutput:
      'Plain-language impact, current status, the open question, and a specific ask, no jargon.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['patient', 'record', 'data', 'customer'],
          ['access', 'account', 'password', 'stopped', 'contained', 'cut off'],
          ['not know', 'unknown', 'unclear', 'establishing', 'investigating', 'not yet'],
          ['need', 'authoris', 'authoriz', 'decision', 'approve', 'ask'],
        ],
        hint:
          'Cover all four: what was affected, what you have done, what is still open, and what you ' +
          'need from them. The ask is the part people leave out.',
      },
    ],
    debrief:
      'Notice how much shorter the plain version is. Jargon is usually a way of avoiding commitment: ' +
      '"potential unauthorised data access event" says less than "someone took a copy of patient ' +
      'records" while sounding more careful.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.4.2'] ?? [],
  },
  {
    id: 'ir.4.3',
    moduleId: 'ir.4',
    packageId: PKG,
    order: 3,
    title: 'The incident timeline',
    kind: 'short-answer',
    goal: 'Write the timeline the incident report is built on.',
    prompt:
      'Write the timeline of this incident from first evidence to containment. Each entry needs a ' +
      'time, what happened, and what it is evidenced by. Cover at least six points.',
    teach: {
      concept:
        'The timeline is the spine of every incident report and the thing everyone else argues from. ' +
        'Two rules make it useful: every entry is tied to a piece of evidence, and detection time is ' +
        'recorded separately from occurrence time. The gap between those two is the single most ' +
        'important number in the report: it is what the whole detection programme gets judged on.',
      examples: [
        {
          command: '10:14: password accepted for testuser from 203.0.113.55 (auth.log)',
          explains: 'Time, event, evidence. Anyone can verify it without asking you.',
        },
        {
          command: 'Morning: attacker got in somehow',
          explains: 'Unverifiable and unusable. It will be challenged and you will have nothing to offer.',
        },
      ],
    },
    hints: [
      'You already know the sequence from Log Analysis and Alert Triage: brute force, login, account, privilege, ' +
        'cron, beacon, key login, archive.',
      'Start earlier than the successful login. The brute force from 09:12 is the first evidence.',
      'End with containment, and note when detection actually happened versus when the events did.',
    ],
    solution:
      '09:12: sustained brute force begins against multiple accounts from 203.0.113.55 and three ' +
      'other addresses (auth.log, SIEM alert at 09:14). 10:14: password accepted for testuser from ' +
      '203.0.113.55 after 62 failures; this is initial access (auth.log). 10:22: local account ' +
      'sysmon created via sudo by testuser (auth.log, EDR). 10:31: sysmon added to the sudo group ' +
      '(auth.log, EDR). 10:40: crontab installed for sysmon beaconing every 15 minutes (syslog, ' +
      'EDR). 10:45: first outbound connection to 198.51.100.60 (proxy log). 11:05: sysmon logs in ' +
      'by public key from 203.0.113.55 (auth.log). 11:06: 6.3 GB archive of patient exports written ' +
      'to /tmp/.cache (EDR, filesystem). 11:42: memory captured and host isolated. Detection lagged ' +
      'occurrence by roughly ninety minutes: every stage raised an alert at the time, and none was ' +
      'escalated until the archive was written.',
    expectedOutput:
      'Six or more entries with times, events and evidence, plus the gap between occurrence and ' +
      'detection.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['09:1', '9:1', '09:4', 'brute'],
          ['10:14', 'testuser', 'initial access'],
          ['10:22', '10:31', 'sysmon', 'created', 'sudo'],
          ['10:40', '10:45', 'cron', 'beacon', 'outbound'],
          ['11:06', 'archive', 'tar', 'exports'],
          ['auth.log', 'syslog', 'log', 'alert', 'edr', 'evidence'],
        ],
        hint:
          'Cover the whole chain: brute force, initial access, account creation and privilege, ' +
          'persistence and beacon, data staging, and tie entries to the evidence they come from.',
      },
    ],
    debrief:
      'The ninety-minute gap is the finding that changes anything. Every stage of this intrusion ' +
      'raised an alert while it was happening; the failure was not detection, it was a queue nobody ' +
      'could work. That is a resourcing and tuning problem, and the timeline is what proves it.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.4.3'] ?? [],
  },
  {
    id: 'ir.4.4',
    moduleId: 'ir.4',
    packageId: PKG,
    order: 4,
    title: 'The response playbook',
    kind: 'short-answer',
    goal: 'Turn one incident into a procedure somebody else can follow at 02:00.',
    prompt:
      'Write the playbook for the next compromised Linux host. Steps in order, each one specific ' +
      'enough to follow while exhausted. Include who to involve and at what point. Six to eight steps.',
    teach: {
      concept:
        'A playbook exists because judgement degrades at 02:00 and the answer is to decide in advance ' +
        'rather than to try harder. The ones that work are specific about order and about who gets ' +
        'called; the ones that do not are lists of principles. "Preserve evidence" is a principle. ' +
        '"Capture memory before you touch the network" is a playbook step.',
      examples: [
        {
          command: 'Step 2: Capture memory before making any network change',
          explains: 'Specific, ordered, and impossible to misread at 02:00.',
        },
        {
          command: 'Step 2: Follow forensic best practice',
          explains: 'Means nothing to somebody who does not already know what to do.',
        },
      ],
    },
    hints: [
      'You have already done this once. The order is the one you used.',
      'Include the decision point about containment, and who authorises it.',
      'Do not stop at eradication: validation and the post-mortem are steps too.',
    ],
    solution:
      'One: confirm the compromise is real: check the rule history and rule out a scheduled job or ' +
      'change record. Two: capture volatile memory before touching anything else. Three: record live ' +
      'network connections and their processes. Four: isolate the host at the network layer, failing ' +
      'the service over first if it is customer-facing; get containment authorised by the on-call ' +
      'incident lead. Five: image and hash the disk, and record chain of custody. Six: enumerate ' +
      'persistence (accounts, group memberships, cron and systemd units, SSH keys) and write down ' +
      'every mechanism found rather than removing them as you go. Seven: engage legal and the privacy ' +
      'officer as soon as regulated data is plausibly involved, stating what is known and what is ' +
      'not. Eight: rebuild rather than clean, extract indicators, sweep the estate, watch egress for ' +
      'the beacon destination, and hold a blameless post-mortem that produces at least one control.',
    expectedOutput:
      'Six to eight ordered, specific steps covering confirm, preserve, contain, image, enumerate, ' +
      'notify, rebuild and validate: with roles named.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['confirm', 'verify', 'is it real', 'validate the alert', 'rule out'],
          ['memory', 'ram', 'volatile'],
          ['isolat', 'contain', 'disconnect', 'segment'],
          ['image', 'disk', 'hash', 'custody', 'preserve'],
          ['persistence', 'cron', 'account', 'key', 'enumerate'],
          ['legal', 'privacy', 'notify', 'escalate', 'lead', 'manager'],
          ['rebuild', 'reimage', 'sweep', 'hunt', 'post-mortem', 'postmortem', 'validate'],
        ],
        hint:
          'A usable playbook covers all of: confirm it is real, capture memory, contain, image the ' +
          'disk, enumerate persistence, involve legal, and rebuild-and-validate. Name who to involve.',
      },
    ],
    debrief:
      'This is the strongest portfolio piece in the package. A playbook in your own words, derived ' +
      'from an incident you actually worked, is something you can hand a hiring manager and talk ' +
      'through for twenty minutes, which is considerably more than a certificate does.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.4.4'] ?? [],
  },
];

// --- module ir.5: timeline and root cause ------------------------------------

const MODULE_IR_5: Exercise[] = [
  {
    id: 'ir.5.1',
    moduleId: 'ir.5',
    packageId: PKG,
    order: 1,
    title: 'Put the privileged actions in order',
    kind: 'terminal',
    goal: 'Build the spine of a timeline out of the events that required privilege.',
    prompt:
      'Pull every command that was run through sudo on rmg-web-02, in the order the log recorded them.',
    teach: {
      concept:
        'A timeline is not a list of everything that happened. It is the shortest ordered sequence that explains how the incident got from nothing to now, and the fastest way to build its spine is to start with the actions that needed privilege, because those are the ones that changed the machine.\n\nsudo records the account, the working directory, and the exact command line, and it is written in time order already. Read the whole set before interpreting any of it: the entries that turn out to be routine administration are what let you recognise the ones that are not.',
      syntax: 'grep PATTERN FILE',
      examples: [
        {
          command: "grep 'session opened' /var/log/auth.log | tail -n 5",
          explains: 'The other spine of a timeline: when sessions started, rather than what was run inside them.',
        },
      ],
    },
    hints: [
      'Every sudo line that records a command contains the same literal marker.',
      'Print the lines rather than counting them. There are few enough to read in full.',
    ],
    solution: "grep 'COMMAND=' /var/log/auth.log",
    expectedOutput: 'Five sudo commands, in time order.',
    checks: [
      {
        type: 'output-line-count',
        count: 5,
        hint: 'There are five sudo command entries in the log.',
      },
      {
        type: 'output-contains',
        text: 'useradd',
        hint: 'One of them creates an account and must be in your output.',
      },
    ],
    debrief:
      'Two of those five are ordinary administration and three are the incident: an account created, that account given sudo, and then that account archiving the exports directory. Your timeline now has three fixed points and you have not opened a forensic tool.',
    practice: [],
  },
  {
    id: 'ir.5.2',
    moduleId: 'ir.5',
    packageId: PKG,
    order: 2,
    title: 'Find the moment access was gained',
    kind: 'terminal',
    goal: 'Locate the first successful authentication from the hostile source.',
    prompt:
      'Show the FIRST successful login from 203.0.113.55. One line.',
    teach: {
      concept:
        'Every incident has a moment where the attacker stopped being outside and started being inside, and finding it is what turns a pile of alerts into a story. Everything before it is attempts; everything after it is activity you have to account for.\n\nThe log is in time order, so the earliest matching entry is simply the first one that comes back. Narrowing to successes and then taking the head of the result is the whole technique. Getting this timestamp right matters more than almost anything else you will do, because every other question in the investigation is asked relative to it.',
      syntax: 'grep SUCCESS FILE | grep SOURCE | head -n 1',
      examples: [
        {
          command: "grep 'Accepted' /var/log/auth.log | tail -n 1",
          explains: 'The opposite end: the most recent successful login on the host, whoever it was.',
        },
      ],
    },
    hints: [
      'Narrow to successful logins, then to the address, then take the first line.',
      'sshd writes "Accepted" when authentication succeeds.',
    ],
    solution: "grep 'Accepted' /var/log/auth.log | grep '203.0.113.55' | head -n 1",
    expectedOutput: 'A password login as testuser at 10:14:22.',
    checks: [
      {
        type: 'output-line-count',
        count: 1,
        hint: 'You want one line: the earliest success from that address.',
      },
      {
        type: 'output-contains',
        text: '10:14:22',
        hint: 'The first success from that address happened at 10:14:22.',
      },
      {
        type: 'output-contains',
        text: 'testuser',
        hint: 'The account that was first compromised should be named in the line.',
      },
    ],
    debrief:
      '10:14:22, as testuser, with a password. That is the boundary of your incident. Everything testuser did after that time is suspect, and everything it did before is probably a real person doing their job.',
    practice: [],
  },
  {
    id: 'ir.5.3',
    moduleId: 'ir.5',
    packageId: PKG,
    order: 3,
    title: 'Measure how long they were in',
    kind: 'terminal',
    goal: 'Establish first contact, which is what dwell time is measured from.',
    prompt:
      'Show the earliest line in auth.log mentioning 203.0.113.55, whatever kind of line it is.',
    teach: {
      concept:
        'Dwell time is how long the attacker was present before anybody noticed, and it is one of the few numbers an executive will remember from your report. It needs two timestamps: first contact, and detection.\n\nFirst contact is not the same as first success. The earliest line involving the source is usually a failure or a probe, and it is the honest start of the story because it is the first moment the host and the attacker interacted. Reporting dwell from the successful login instead quietly shortens the incident and makes detection look better than it was.',
      syntax: 'grep SOURCE FILE | head -n 1',
      examples: [
        {
          command: "grep '10.20.9.15' /var/log/auth.log | head -n 1",
          explains: 'The same first-contact question for the backup server, which is the benign comparison.',
        },
      ],
    },
    hints: [
      'Do not filter by event type this time. You want the earliest line of any kind.',
      'The file is in time order, so the first match is the earliest.',
    ],
    solution: "grep '203.0.113.55' /var/log/auth.log | head -n 1",
    expectedOutput: 'A probe at 09:12:03, an hour before the successful login.',
    checks: [
      {
        type: 'output-line-count',
        count: 1,
        hint: 'One line: the earliest mention of that address.',
      },
      {
        type: 'output-contains',
        text: '09:12:03',
        hint: 'First contact from that address was at 09:12:03.',
      },
    ],
    debrief:
      'First contact at 09:12, first success at 10:14, first privileged action at 10:22. An hour of brute force against a host that did not lock anybody out and did not alert anybody. That hour is the finding, not the intrusion.',
    practice: [],
  },
  {
    id: 'ir.5.4',
    moduleId: 'ir.5',
    packageId: PKG,
    order: 4,
    title: 'Root cause, not symptom',
    kind: 'short-answer',
    goal: 'State the cause somebody can fix, rather than the event everybody noticed.',
    prompt:
      'The incident is being written up. In three or four sentences, state the root cause of this intrusion, and say why the exfiltration is not the answer.',
    teach: {
      concept:
        'Root cause is the condition whose absence would have prevented the incident, and it is almost never the thing people noticed first. The exfiltration is the last event in the chain and the one that caused the alarm; fixing it means nothing, because it was made possible by everything upstream.\n\nWalk the chain backwards. Data left the host because an archive was staged. The archive was staged because an account had sudo. That account existed because a compromised account created it. That account was compromised because a password was guessed over an hour of unimpeded attempts. So the causes worth writing down are the ones that allowed that hour: password authentication exposed with no rate limiting and no lockout, and no alert on repeated failure. Everything after that follows.\n\nA good answer names the guessable password or the unlimited attempts as the entry, notes the absence of detection or alerting on the failures, and says explicitly that the exfiltration was the consequence rather than the cause.',
    },
    hints: [
      'Walk the chain backwards from the upload and keep asking what made the previous step possible.',
      'Stop when you reach something that, if it had been different, would have prevented everything after it.',
      'A good answer names password guessing over an hour of unthrottled attempts, the lack of any alert on those failures, and says the exfiltration is the consequence rather than the cause.',
    ],
    solution:
      'The root cause is that an internet-facing SSH service accepted unlimited password attempts against a valid account, and nothing alerted on an hour of failures from a single external address, so the password was eventually guessed at 10:14. Everything after that follows from it: the compromised account had sudo, so it created a second account, gave that account sudo, and used it to archive the exports directory and upload it. The exfiltration is the last link in the chain and the one that triggered the alarm, which is exactly why it is not the root cause: blocking that upload would have left the same account, the same access, and the same hour of undetected guessing in place. The fixes that matter are rate limiting or key-only authentication on SSH, and detection on repeated authentication failure.',
    expectedOutput:
      'An answer naming the unthrottled password guessing and the absent alerting as the cause, and stating that the exfiltration is a consequence rather than the cause.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['password', 'guess', 'brute', 'credential'],
          ['no alert', 'nothing alerted', 'undetected', 'not detected', 'no lockout', 'rate limit', 'unlimited', 'unthrottled'],
          ['consequence', 'last link', 'follows from', 'not the root', 'symptom', 'end of the chain'],
        ],
        hint:
          'Three ideas: how they got in, what let it continue unnoticed, and why the upload is the consequence rather than the cause.',
      },
    ],
    debrief:
      'Notice which recommendations fall out of that answer: rate limiting and alerting. Neither of them mentions the archive, the account, or the upload, which is how you know you have reached a cause rather than a symptom.',
    practice: [],
  },
  {
    id: 'ir.5.5',
    moduleId: 'ir.5',
    packageId: PKG,
    order: 5,
    title: 'Say what you cannot establish',
    kind: 'short-answer',
    goal: 'State the limits of your evidence, before somebody else finds them.',
    prompt:
      'Your timeline is built entirely from auth.log, syslog and the nginx logs on the host itself. In three or four sentences, say what those sources cannot tell you.',
    teach: {
      concept:
        'Every incident report contains claims the evidence does not support, unless somebody deliberately writes down the limits. Doing it yourself is not modesty, it is self-defence: the person who finds the gap after you published is going to doubt everything else you wrote.\n\nThree limits apply here and they are worth naming precisely. Host logs are on the host, so anybody with root could have edited or deleted them, which means absence of evidence is weak. Rotation has already discarded whatever came before the retained window, so you cannot say when this really started. And the logs record that an upload happened, not what was in it: proving whether patient data actually left needs network capture or the destination, neither of which you have.\n\nA good answer names at least the log integrity problem, the retention or rotation boundary, and the inability to confirm what was actually transferred.',
    },
    hints: [
      'Ask who could have changed these files, and with what privilege.',
      'Ask what happened to the logs older than the ones you read.',
      'A good answer names that root could have altered the logs, that rotation limits how far back you can see, and that the logs show an upload occurred but not what it contained.',
    ],
    solution:
      'These are all logs held on the compromised host, and the attacker had root, so they could have removed or altered entries and I cannot treat an absence of evidence as evidence of absence. Rotation also bounds what I can see: anything older than the retained generations is gone, so I can say when activity starts in the RETAINED logs but not when it truly began. And the auth log records that a transfer command ran, not what was transferred, so I cannot confirm from the host alone that patient data actually reached the external address. Establishing that would need network capture, egress logs from the firewall, or the destination itself, and until then the transfer should be treated as probable rather than proven.',
    expectedOutput:
      'An answer naming the possibility that logs were altered on a host the attacker had root on, the rotation or retention boundary, and the inability to confirm what was actually transferred.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['root', 'altered', 'edited', 'deleted', 'tamper', 'modified'],
          ['rotation', 'rotated', 'retained', 'retention', 'older than', 'how far back'],
          ['what was transferred', 'what it contained', 'not what', 'network capture', 'egress', 'confirm', 'contents'],
        ],
        hint:
          'Three limits: who could have changed the logs, how far back they go, and what the transfer record does not prove.',
      },
    ],
    debrief:
      'The last one changes what you can say to a regulator. "Data was exfiltrated" and "a transfer of an archive of exports was initiated to an external address" are different claims, and only one of them is supported by what you have.',
    practice: [],
  },
  {
    id: 'ir.5.6',
    moduleId: 'ir.5',
    packageId: PKG,
    order: 6,
    title: 'Which source answers which question',
    kind: 'multiple-choice',
    goal: 'Choose the right evidence source for the question being asked.',
    prompt:
      'You have four questions still open. Which of the following pair a question with a source that can actually answer it? Select all that apply.',
    teach: {
      concept:
        'Half of investigative speed is knowing where an answer lives before you go looking. Sources are not interchangeable, and pointing the wrong one at a question wastes an hour and often produces a confident wrong answer.\n\nThe authentication log answers who logged in, from where, and when. The sudo record answers what was run with privilege. The web server logs answer what was requested over HTTP and what the server returned. The process table and socket table answer what is happening RIGHT NOW, and they are volatile: reboot the host and they are gone.\n\nWhat none of them answers is the contents of a network transfer, which needs capture at the network layer, and none of them tells you whether the same actor is on other hosts, which needs the same questions asked elsewhere. Knowing what a source cannot answer is as useful as knowing what it can.',
      },
    options: [
      { id: 'a', label: 'When the attacker first authenticated successfully: the authentication log.' },
      { id: 'b', label: 'What was run with root privilege: the sudo entries in the authentication log.' },
      { id: 'c', label: 'Whether the upload is still running right now: the process and socket tables on the host.' },
      { id: 'd', label: 'What paths were probed over HTTP: the web server access log.' },
      { id: 'e', label: 'What was inside the uploaded archive: the authentication log.' },
    ],
    hints: [
      'Four pair correctly. One asks a log to know something it never saw.',
      'For each source, ask what it physically records at the moment it writes a line.',
      'The authentication log records that a command ran. Does it record what the command sent?',
    ],
    solution:
      'A, B, C, and D. Each names a source that genuinely observed the thing being asked about. E is the one to reject, and it is the mistake that produces overstated reports: the authentication log recorded that a transfer command was executed, and it never had visibility of a single byte of what that command sent. Answering that question needs network capture, firewall egress records, or the destination, and if none of those exist then the honest answer is that it cannot currently be established.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option expects a log to know the contents of a transfer it only observed being launched.',
      },
    ],
    debrief:
      'Option C is worth one more thought: the process and socket tables answer that question only until the host is rebooted. Volatile sources have to be captured before you contain, which is the whole reason the containment module puts memory acquisition first.',
    practice: [],
  },
];

// --- module ir.6: the written record -----------------------------------------

const MODULE_IR_6: Exercise[] = [
  {
    id: 'ir.6.1',
    moduleId: 'ir.6',
    packageId: PKG,
    order: 1,
    title: 'Preserve the evidence before you interpret it',
    kind: 'terminal',
    goal: 'Capture command output to a file, so the evidence survives the shell session.',
    prompt:
      'Save the sudo command entries from auth.log into a file called sudo-evidence.txt in your home directory.',
    teach: {
      concept:
        'Anything that exists only in your scrollback is not evidence. Terminals close, sessions time out, and the host you are reading may be about to be rebuilt. Redirecting output to a file makes the result something you can attach to a ticket and something a second analyst can check.\n\nThe `>` operator sends output to a file instead of the screen, creating it or overwriting it. `>>` appends instead, which is what you want for a running log you add to through a shift. Write to your own home directory rather than into the evidence you are reading: writing to the host you are investigating changes it, and on a real engagement the capture belongs somewhere else entirely.',
      syntax: 'COMMAND > FILE',
      examples: [
        {
          command: 'ps aux > /home/student/process-snapshot.txt',
          explains: 'Capturing volatile state, which is the case where this matters most: the process table will not exist after a reboot.',
        },
      ],
      flags: [
        { flag: '>', means: 'Write output to a file, replacing what was there.' },
        { flag: '>>', means: 'Append output to a file, keeping what was there.' },
      ],
    },
    hints: [
      'The command that finds the sudo entries has not changed. Send its output somewhere.',
      'A single greater-than sign writes to a file.',
    ],
    solution: "grep 'COMMAND=' /var/log/auth.log > sudo-evidence.txt",
    expectedOutput: 'No output on screen: it went into the file.',
    checks: [
      {
        type: 'fs-exists',
        path: '/home/student/sudo-evidence.txt',
        exists: true,
        kind: 'file',
        hint: 'The file should exist in your home directory afterwards.',
      },
    ],
    debrief:
      'Note that nothing appeared on screen, which is correct and disconcerting the first time. Check the file rather than assuming: a redirect that silently captured an error message instead of your results is a mistake you only find later.',
    practice: [],
  },
  {
    id: 'ir.6.2',
    moduleId: 'ir.6',
    packageId: PKG,
    order: 2,
    title: 'Write the running log entry',
    kind: 'short-answer',
    goal: 'Record an action so somebody else can reconstruct what you did and why.',
    prompt:
      'At 11:47 you isolated rmg-web-02 from the network, after capturing memory, and failed the portal over to rmg-web-01. In two or three sentences, write the entry for the incident running log.',
    teach: {
      concept:
        'A running log is written as you go, not reconstructed afterwards, and it is the artefact that turns a chaotic afternoon into a defensible account. Four things go in every entry: the TIME, the ACTION taken, the REASON at the time, and the EFFECT observed.\n\nThe reason matters more than people expect. Decisions during an incident are made on incomplete information, and they will be reviewed by people who know how it turned out. An entry that records why the call looked right at 11:47, with what was known at 11:47, is the difference between a defensible decision and one that looks reckless in hindsight.\n\nWrite in plain past tense, name yourself, and do not editorialise. A good entry here names the time, the isolation, the memory capture that preceded it, and what happened to the service.',
    },
    hints: [
      'The facts are in the question. What the log entry has to add is the part nobody else can reconstruct later.',
      'Say why this was the right call at 11:47, on what was known at 11:47.',
      'A good entry states that memory was captured before isolation, gives the reason it was done in that order, and records what you observed happening to the attacker session and to the service.',
    ],
    solution:
      'At 11:47 I captured a memory image from rmg-web-02 and then isolated the host at the network layer, leaving it powered on. The reason was that an active session from 203.0.113.55 was still established and a staged archive of patient exports was present, so stopping further transfer was urgent, while a shutdown would have destroyed the volatile evidence needed to establish what had been accessed. The patient portal failed over to rmg-web-01 and remained available; the attacker session dropped at the point of isolation.',
    expectedOutput:
      'An entry giving the time, the memory capture before isolation, the reason it was done then, and the effect on the service and the session.',
    checks: [
      {
        type: 'answer-mentions',
        /*
         * These groups deliberately do NOT grade the facts in the prompt.
         * The prompt already states the time, the isolation, the memory
         * capture and the failover, so a rubric built on those passes when a
         * student pastes the question back, which is exactly what
         * incident-response.test.ts caught. What the entry has to ADD is the
         * reasoning and the observed outcome, so that is what is graded.
         */
        conceptGroups: [
          ['memory', 'ram', 'volatile', 'image'],
          ['because', 'reason', 'so that', 'in order to', 'would have destroyed', 'urgent'],
          ['session dropped', 'lost access', 'remained available', 'attacker session', 'stayed up'],
        ],
        hint:
          'The entry has to add what the prompt does not: why the call was made at that moment, and what you observed happening as a result.',
      },
    ],
    debrief:
      'The sentence that will matter in three months is the middle one, the reason. Nobody disputes what you did; they dispute whether it was reasonable, and only the contemporaneous note answers that.',
    practice: [],
  },
  {
    id: 'ir.6.3',
    moduleId: 'ir.6',
    packageId: PKG,
    order: 3,
    title: 'What goes in the ticket, and what does not',
    kind: 'multiple-choice',
    goal: 'Separate the working record from the finished report.',
    prompt:
      'You are keeping an incident ticket during a live response. Which of the following belong in it? Select all that apply.',
    teach: {
      concept:
        'The ticket is the working record: contemporaneous, complete, and messy. The report is the finished account: edited, structured, and written afterwards for somebody who was not there. Confusing them costs you either way. A ticket that is written like a report loses the raw detail that makes it credible; a report that reads like a ticket does not get read at all.\n\nInto the ticket goes every action with a timestamp, every command run, every artefact captured and where it was put, and the decisions with their reasoning. Also into the ticket: things you tried that found nothing, because that is what stops the next person repeating them.\n\nWhat does NOT belong is speculation stated as fact, and the names of individuals framed as blame. Write "the account testuser authenticated from 203.0.113.55", not "Dana clicked a phishing link", unless you have established it. Tickets are disclosable, they get read by people outside the team, and an unsupported accusation in one is a serious problem separately from the incident.',
    },
    options: [
      { id: 'a', label: 'Every action taken, with the time it was taken.' },
      { id: 'b', label: 'The exact commands run, so a second analyst can reproduce the result.' },
      { id: 'c', label: 'Checks that found nothing, so the next person does not repeat them.' },
      { id: 'd', label: 'Where each captured artefact was stored, and who has it.' },
      { id: 'e', label: 'A working theory about which employee was careless, recorded as the cause.' },
    ],
    hints: [
      'Four belong. One states something unestablished about a named person.',
      'Ask who else reads this document, and when.',
      'Negative results are worth writing down for the same reason positive ones are.',
    ],
    solution:
      'A, B, C, and D. Times, commands, negative results, and artefact custody are exactly what the working record is for, and the negative results in C are the most commonly omitted and among the most useful. E is the one to keep out. A theory about a named individual, written as though it were established, is disclosable, is frequently wrong, and does damage that survives the correction. Record what the evidence shows about the ACCOUNT, and leave the question of how the credential was obtained open until something supports an answer.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option records an unestablished theory about a named person as though it were the cause.',
      },
    ],
    debrief:
      'Write about accounts and hosts, not about people, until you can prove otherwise. It costs nothing, it is more accurate, and it keeps the investigation about the evidence.',
    practice: [],
  },
  {
    id: 'ir.6.4',
    moduleId: 'ir.6',
    packageId: PKG,
    order: 4,
    title: 'Hand over mid-incident',
    kind: 'short-answer',
    goal: 'Write the handover that lets the next shift continue without losing an hour.',
    prompt:
      'Your shift ends with the host isolated, memory captured, and the question of whether the database was reached still open. In three or four sentences, write the handover for the analyst taking over.',
    teach: {
      concept:
        'Most incidents outlive a shift, and the handover is where they most often go wrong: the next analyst re-derives what you already knew, or worse, assumes something is done because nobody said it was not.\n\nA handover has three parts and they are all short. WHERE IT STANDS: what is established, and what has been done to the environment. WHAT IS OPEN: the specific questions still unanswered, phrased as questions rather than as topics. WHAT IS NEXT: the single most useful thing to do first, and anything time-critical, including who has been told and who has not.\n\nBe explicit about what is NOT done. "Memory captured, not yet analysed" prevents an hour of somebody assuming otherwise, and it is the sentence most often left out.',
    },
    hints: [
      'Three parts: where it stands, what is still open, and what to do next.',
      'Say what has been done to the environment, because that changes what the next person is looking at.',
      'A good handover states the containment already performed, names the open question about the database, and gives a concrete next action.',
    ],
    solution:
      'Where it stands: rmg-web-02 is isolated at the network layer and still powered on, a memory image was captured at 11:47 and has not yet been analysed, and the portal is running on rmg-web-01. Established so far: the account testuser was compromised at 10:14 from 203.0.113.55, a second account called sysmon was created through sudo and used to archive the exports directory and start an upload. Still open: whether the database itself was reached, and whether any of the archive actually left the network. Next: check the database logs for access from the host during the 10:14 to 11:47 window, and ask the network team for egress records to 198.51.100.60 for the same period. Legal and the privacy lead have been notified; clinical staff have not.',
    expectedOutput:
      'A handover stating the containment already performed, what has been established, the open question about the database or the transfer, and a concrete next action.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['isolated', 'contained', 'captured', 'powered on', 'not yet analysed'],
          ['still open', 'unanswered', 'whether the database', 'not yet known', 'unknown', 'unclear'],
          ['next', 'check', 'ask', 'request', 'egress', 'database logs'],
        ],
        hint:
          'Three parts: what has been done to the environment, what question is still open, and the concrete next step.',
      },
    ],
    debrief:
      'The most valuable line in that handover is "captured and not yet analysed". Everything else could be reconstructed from the ticket; that one prevents the incoming analyst from believing a job is finished when it has not started.',
    practice: [],
  },
  {
    id: 'ir.6.5',
    moduleId: 'ir.6',
    packageId: PKG,
    order: 5,
    title: 'Make the evidence defensible',
    kind: 'short-answer',
    goal: 'Say what has to be true of an artefact for it to survive challenge.',
    prompt:
      'The memory image may end up in front of a regulator or a court. In three or four sentences, say what has to be recorded about it for it to be worth anything.',
    teach: {
      concept:
        'An artefact is only as good as the account of where it came from. Chain of custody is that account, and it is boring, contemporaneous paperwork rather than anything technical.\n\nFour things have to be recorded. WHAT was collected, precisely, including which host and which volume. WHEN and by WHOM, with the time taken from a clock somebody can vouch for. HOW, meaning the tool and its version, because a known-buggy acquisition tool is a real challenge to your evidence. And INTEGRITY: a cryptographic hash computed at collection, so anybody can later demonstrate the copy they are looking at is the copy you took.\n\nThen every subsequent transfer is logged: who held it, who they gave it to, when. A gap in that record does not prove anything was altered. It means nobody can prove it was not, which is enough to lose the argument.\n\nA good answer names the hash, the collector and time, and the unbroken record of who has held it since.',
    },
    hints: [
      'Think about what somebody hostile would ask about this file in a year.',
      'One of the four items is what lets anybody prove the file has not changed since collection.',
      'A good answer names a hash taken at collection, who collected it and when, and the record of everyone who has held it since.',
    ],
    solution:
      'It needs a record of exactly what was collected and from which host, who collected it and at what time, and the tool and version used to acquire it, because the acquisition method itself can be challenged. It also needs a cryptographic hash computed at the moment of collection, so that anybody can later demonstrate the image they are examining is bit-for-bit the one that was taken. From that point every transfer has to be logged: who held it, who they passed it to, and when, with no unexplained gaps. A break in that record does not prove the image was altered, it just means nobody can prove it was not, and that is usually enough for the evidence to be set aside.',
    expectedOutput:
      'An answer naming a hash computed at collection, the collector and time, the acquisition method, and an unbroken record of custody.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['hash', 'checksum', 'sha', 'md5', 'bit-for-bit', 'integrity'],
          ['who collected', 'collector', 'by whom', 'at what time', 'when it was taken'],
          ['transfer', 'custody', 'who held', 'handed', 'passed', 'gap'],
        ],
        hint:
          'Three ideas: what proves the image is unchanged, who took it and when, and the record of everyone who has held it since.',
      },
    ],
    debrief:
      'None of this is technical work and all of it is the difference between an image that proves something and an expensive file nobody can rely on. Do it at collection time: it cannot be added convincingly afterwards.',
    practice: [],
  },
  {
    id: 'ir.6.6',
    moduleId: 'ir.6',
    packageId: PKG,
    order: 6,
    title: 'Close it honestly',
    kind: 'short-answer',
    goal: 'Write a closing summary that says what was established and what was not.',
    prompt:
      'The incident is being closed. In three or four sentences, write the summary paragraph, covering what happened, what the impact was, and what remains uncertain.',
    teach: {
      concept:
        'The closing summary is the paragraph that gets quoted for years, in board papers, in regulatory correspondence, and by whoever writes the next report. It has to be short, specific, and honest about its own limits.\n\nThree things go in it. WHAT HAPPENED, as a sequence with times, in language a non-specialist can follow. WHAT THE IMPACT WAS, stated as what is established rather than what is feared. And WHAT IS STILL UNCERTAIN, which is the part most often dropped and the part that protects everybody, because a summary that reads as complete will be treated as complete.\n\nResist two temptations. Do not inflate: describing a probable transfer as a confirmed breach commits the organisation to a position the evidence may not support. Do not minimise either: an hour of undetected brute force against an internet-facing service is a real failure and saying so is what gets it fixed.',
    },
    hints: [
      'Three parts: the sequence with times, the established impact, and what remains unknown.',
      'Be careful with the word confirmed. What do you actually have evidence for?',
      'A good summary gives the sequence from the guessed password through to the upload, states the impact in terms of what is established, and names what could not be determined.',
    ],
    solution:
      'Between 09:12 and 10:14 on 15 August an external address brute-forced SSH on the patient portal server and guessed the password for the testuser account. Using that access it created a second account with sudo, archived the portal exports directory, and started an upload of that archive to an external host; the host was isolated at 11:47, roughly ninety minutes after the first successful login. What is established is that patient export data was collected and staged on the host and that a transfer was initiated; what could not be determined from the available logs is how much of it reached the destination, or whether the database itself was accessed, because the host logs record the transfer starting and not its contents. The failures that allowed it were unlimited password attempts on an internet-facing service and no alerting on repeated authentication failure, both of which are being remediated.',
    expectedOutput:
      'A summary giving the sequence with times, the established impact, and an explicit statement of what could not be determined.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['brute', 'guessed', 'password attempts', 'authentication failure'],
          ['staged', 'archive', 'upload', 'transfer', 'exports'],
          ['could not be determined', 'not established', 'uncertain', 'unknown', 'unable to confirm', 'not confirmed'],
        ],
        hint:
          'Three parts: how they got in, what happened to the data, and what you could not establish.',
      },
    ],
    debrief:
      'Read your last sentence again and check it does not claim more than the evidence supports. The summary is the one part of the report that will be quoted without its context, so it has to survive being read alone.',
    practice: [],
  },
];

// --- module ir.7: how far did it go ------------------------------------------

const MODULE_IR_7: Exercise[] = [
  {
    id: 'ir.7.1',
    moduleId: 'ir.7',
    packageId: PKG,
    order: 1,
    title: 'Four hosts, two analysts',
    kind: 'incident-decision',
    decisionPointId: 'dp.scope',
    goal: 'Direct limited people at the host that answers the blocking question.',
    prompt:
      'It is 12:15. The compromised host is isolated and captured, and you have two analysts and ' +
      'four systems the attacker could have reached. Decide where they go first. Read the unknown ' +
      'list before you choose: one of those questions is holding up every other decision.',
    teach: {
      concept:
        'Scoping is a resourcing decision wearing technical clothes. You almost never have enough ' +
        'people to look at everything properly, so the question is not "what could have been ' +
        'reached" but "which answer unblocks the most other decisions, and can I get it today".\n\n' +
        'Two things separate a good scope from a thorough one. Depth beats coverage: four shallow ' +
        'looks produce four inconclusive answers, and inconclusive means the work has to be done ' +
        'again. And cheap estate-wide checks are different in kind from investigations: asking one ' +
        'narrow question everywhere, such as whether an account or a key exists, costs almost ' +
        'nothing and scales, so it runs alongside the deep work rather than competing with it.',
      examples: [
        {
          command: 'Depth on the host that matters',
          explains: 'One conclusive answer about the highest-value system, inside the window where it is useful.',
        },
        {
          command: 'A narrow sweep everywhere else',
          explains: 'One specific indicator checked across the estate. Fast, mechanical, and it finds spread.',
        },
      ],
    },
    hints: [
      'Read the pressures. One question is named as the thing leadership is waiting on, and only one host can answer it.',
      'One option is thorough and produces nothing usable. Ask what an hour per host actually buys you.',
      'One option follows the loudest host rather than the most consequential one, and its noise was already explained before today.',
    ],
    solution:
      'Put the depth on rmg-db-01, because whether patient records were accessed is the question ' +
      'blocking notification and every leadership conversation, and it was reachable from the ' +
      'compromised host. Run the credential and key sweep across the estate alongside it, because ' +
      'it is cheap, mechanical, and finds persistence that has already spread. Splitting two people ' +
      'across four hosts produces four answers you cannot rely on, and starting with the noisy ' +
      'monitoring box spends the afternoon on a misconfiguration that was understood yesterday.',
    expectedOutput: 'Depth on the database host, plus an estate-wide sweep for the account and key.',
    checks: [
      {
        type: 'decision-selects',
        optionIds: SCOPE_SOUND,
        hint:
          'One host answers the question everything else is waiting on, and one check is cheap ' +
          'enough to run everywhere at the same time. You have not chosen both.',
      },
      {
        type: 'decision-avoids',
        optionIds: SCOPE_HARMFUL,
        hint:
          'One of your choices spreads two people so thin that nothing gets established, or follows ' +
          'the noisiest host rather than the one that matters.',
      },
      {
        type: 'decision-justifies',
        conceptGroups: [
          ['database', 'db-01', 'records', 'patient data'],
          ['block', 'waiting', 'notification', 'leadership', 'cannot answer', 'unblock'],
          ['sweep', 'key', 'account', 'estate', 'everywhere', 'spread'],
        ],
        hint:
          'Say why in the box: which host answers the blocking question, and why the estate-wide ' +
          'check runs alongside rather than instead.',
      },
    ],
    debrief:
      'Notice that the defensible option, the backup host, is not wrong. It is genuinely important ' +
      'and it is not first, and knowing the difference between "wrong" and "not yet" is most of ' +
      'what scoping is.',
    practice: [],
  },
  {
    id: 'ir.7.2',
    moduleId: 'ir.7',
    packageId: PKG,
    order: 2,
    title: 'Check whether the account spread',
    kind: 'terminal',
    goal: 'Run the cheap estate-wide question against the evidence you have.',
    prompt:
      'Check whether the account the attacker created exists in the local account list on this host, ' +
      'and show the line if it does.',
    teach: {
      concept:
        'The sweep decided on in the previous exercise is made of questions like this one: narrow, ' +
        'mechanical, with an answer shape you know in advance. On a real estate it runs against ' +
        'every host through configuration management; the question asked of each one is identical ' +
        'to what you run here by hand.\n\n' +
        '/etc/passwd holds the local accounts, one per line, colon-separated. It is world-readable ' +
        'by design, which is what makes this check cheap. What you are looking for is the account ' +
        'name, and what you are reading on the line is the UID and the shell: an account with a real ' +
        'login shell was made for somebody to use.',
      syntax: 'grep NAME /etc/passwd',
      examples: [
        {
          command: 'grep www-data /etc/passwd',
          explains: 'The same check for a legitimate service account, which has no interactive shell.',
        },
      ],
    },
    hints: [
      'The local account list is a plain text file you can read.',
      'The account created during the intrusion is called sysmon.',
    ],
    solution: 'grep sysmon /etc/passwd',
    expectedOutput: 'One line, with UID 1501 and an interactive shell.',
    checks: [
      {
        type: 'output-contains',
        text: 'sysmon',
        hint: 'The account should be found in the local account list.',
      },
      {
        type: 'output-contains',
        text: '1501',
        hint: 'Read the whole line: the UID is part of what makes this account suspicious.',
      },
    ],
    debrief:
      'A login shell and a UID in the human range, on an account named to look like monitoring ' +
      'software. Real monitoring accounts are usually system accounts with no shell, which is the ' +
      'comparison that makes this one stand out.',
    practice: [],
  },
  {
    id: 'ir.7.3',
    moduleId: 'ir.7',
    packageId: PKG,
    order: 3,
    title: 'What clearing a host actually means',
    kind: 'short-answer',
    goal: 'State a scoping conclusion at the strength the evidence supports.',
    prompt:
      'Your colleague checked rmg-db-01 and reports it is clean. In three or four sentences, say ' +
      'what that claim needs to mean before it can go in the report.',
    teach: {
      concept:
        '"Clean" is the most dangerous word in a scoping conversation, because it sounds like a ' +
        'conclusion and is usually a summary of whatever somebody happened to look at.\n\n' +
        'A usable clearing statement has three parts. WHAT WAS CHECKED: which artefacts, on which ' +
        'host. OVER WHAT PERIOD: a clearing that covers the last hour says nothing about the ' +
        'intrusion window, and the window here runs from 09:12 to isolation. AND WITH WHAT ' +
        'LIMITS: which sources were unavailable, and what would still be invisible if the attacker ' +
        'was careful.\n\n' +
        'The strong form is not "the database is clean". It is "no authentication from web-02 ' +
        'appears in the database logs between 09:12 and 11:42, and those logs are retained for ' +
        'thirty days and were not writable by the compromised host". That is a claim somebody can ' +
        'check, and it is honest about being narrower than the sentence it replaces.',
    },
    hints: [
      'Ask three questions of the claim: what was looked at, over what period, and what would not have shown up.',
      'The intrusion window is not the same as the last hour, and a check that covers the wrong period proves nothing.',
      'A good answer names the specific artefacts examined, pins the time window to the intrusion, and states what the check could not have seen.',
    ],
    solution:
      'It has to say what was actually examined rather than that the host is clean: which logs and ' +
      'artefacts on rmg-db-01 were reviewed, and whether that included authentication records, ' +
      'query activity, and local account changes. It has to state the period, and that period has ' +
      'to be the intrusion window from 09:12 through to isolation, because a review of the last ' +
      'hour would have found nothing whether or not anything happened. And it has to name its ' +
      'limits: which sources were missing or too short in retention, and the fact that an attacker ' +
      'with credentials could have made a legitimate-looking connection that no log would ' +
      'distinguish. Written that way it supports a conclusion; written as "clean" it supports ' +
      'nothing and will be quoted as though it did.',
    expectedOutput:
      'An answer naming the specific artefacts checked, the intrusion time window they were checked ' +
      'over, and the limits of what such a check could have detected.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['which logs', 'artefact', 'artifact', 'authentication records', 'what was examined', 'query'],
          ['window', 'period', '09:12', 'intrusion window', 'time range', 'retention'],
          ['limits', 'would not', 'could not', 'missing', 'legitimate-looking', 'indistinguish', 'not distinguish'],
        ],
        hint:
          'Three parts: what was examined, over what period, and what such a check could not have seen.',
      },
    ],
    debrief:
      'Push back on "clean" every time you hear it, including when you say it. The person quoting ' +
      'your report in six months will not have the conversation you had; they will only have the ' +
      'sentence.',
    practice: [],
  },
  {
    id: 'ir.7.4',
    moduleId: 'ir.7',
    packageId: PKG,
    order: 4,
    title: 'Which indicators are worth pivoting on',
    kind: 'multiple-choice',
    goal: 'Choose indicators that will still be true tomorrow over ones that change hourly.',
    prompt:
      'You are about to sweep the estate. Which of these indicators are worth searching on? Select ' +
      'all that apply.',
    teach: {
      concept:
        'Not every fact about an attacker is worth searching for. The useful ones are specific ' +
        'enough that a hit means something, and stable enough that the attacker cannot trivially ' +
        'change them between now and when your sweep runs.\n\n' +
        'Strong indicators here: the account name, because it had to be created and would have to be ' +
        'created again; the public key, because it is a fixed string the attacker needs to keep ' +
        'using; the crontab entry, because persistence has to persist. Each of those costs the ' +
        'attacker real effort to change.\n\n' +
        'Weak ones: a source address, which is a rented server and changes for the price of a coffee, ' +
        'and a file hash of something that is trivially recompiled. Neither is useless, and both ' +
        'produce a lot of confident false negatives if you treat absence as evidence. Search on ' +
        'behaviour and on what the attacker must keep, rather than on what they can discard.',
    },
    options: [
      { id: 'a', label: 'The sysmon account name, which had to be created and would have to be created again.' },
      { id: 'b', label: 'The public key added to authorized_keys, which the attacker needs in order to keep using it.' },
      { id: 'c', label: 'The crontab entry that re-fetches a script, because persistence has to keep running.' },
      { id: 'd', label: 'The pattern of a login immediately followed by an account creation, whatever the names are.' },
      { id: 'e', label: 'The source address 203.0.113.55, treating its absence elsewhere as evidence nothing else was touched.' },
    ],
    hints: [
      'Four are worth it. One is fine to search for and dangerous to draw a conclusion from.',
      'Ask what each indicator costs the attacker to change.',
      'The problem with the last one is not the search, it is the word "absence".',
    ],
    solution:
      'A, B, C, and D. Each is either something the attacker had to create or something they have to ' +
      'keep in order to retain access, which makes a hit meaningful and a miss informative. D is the ' +
      'strongest of the four and the one people forget: behaviour survives every cosmetic change to ' +
      'names and addresses. E is the trap, and the trap is in the second half of the sentence: ' +
      'searching for the address is fine and cheap, but a rented address changes hourly, so ' +
      'concluding from its absence that nothing else was touched is exactly the false negative that ' +
      'ends investigations early.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats the absence of an easily-changed indicator as proof that nothing else ' +
          'was reached.',
      },
    ],
    debrief:
      'This is the pyramid of pain in one exercise: the higher up you search, the more it costs the ' +
      'attacker to evade you, and behaviour costs them the most.',
    practice: [],
  },
  {
    id: 'ir.7.5',
    moduleId: 'ir.7',
    packageId: PKG,
    order: 5,
    title: 'Write the scoping statement',
    kind: 'short-answer',
    goal: 'State how far the incident reached, and how far you actually looked.',
    prompt:
      'The scope work is finished: the database showed no authentication from the compromised host ' +
      'in the window, and the estate sweep found the account and key nowhere else. In three or four ' +
      'sentences, write the scoping statement for the report.',
    teach: {
      concept:
        'The scoping statement is the paragraph a regulator reads to decide how large this was, and ' +
        'it is the one most likely to be wrong in the reassuring direction.\n\n' +
        'It needs three things. WHAT WAS AFFECTED, stated positively and specifically. WHAT WAS ' +
        'CHECKED AND NOT AFFECTED, with the check named rather than implied, because "no evidence of ' +
        'access" without saying what you looked at is not a finding. And THE BOUNDARY OF THE SEARCH: ' +
        'which systems were in scope at all, and what would have been missed by the methods used.\n\n' +
        'Write it so that somebody could disagree with it. A statement nobody could challenge is ' +
        'usually one that does not say anything, and the ones that get organisations into trouble ' +
        'are the ones that read as broader guarantees than the work supports.',
    },
    hints: [
      'Three parts: what was affected, what you checked and found clear, and where you did not look.',
      'Name the check rather than implying it: "no authentication from web-02 in the window" beats "no evidence of access".',
      'A good statement confines the confirmed compromise to the one host, names the database and estate checks with their method, and states the limits of the search.',
    ],
    solution:
      'Confirmed compromise is limited to rmg-web-02: the account creation, privilege escalation, ' +
      'persistence and data staging all occurred on that host. rmg-db-01 was examined for ' +
      'authentication and query activity originating from web-02 across the intrusion window of ' +
      '09:12 to 11:42, and none was found; an estate-wide check for the sysmon account and for the ' +
      'attacker SSH key returned no matches on any other system. The boundary of that work is worth ' +
      'stating: the sweep covered systems under configuration management and the database review ' +
      'relied on logs retained for thirty days, so activity outside that retention, or a connection ' +
      'made with valid credentials that looked routine, would not have been distinguished. On the ' +
      'evidence available the incident is contained to one host.',
    expectedOutput:
      'A statement confining confirmed compromise to the one host, naming the database and sweep ' +
      'checks with their method and window, and stating the limits of the search.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['web-02', 'one host', 'single host', 'limited to'],
          ['no authentication', 'none was found', 'no matches', 'returned nothing', 'not found'],
          ['boundary', 'limits', 'retention', 'would not have been', 'outside that', 'covered systems'],
        ],
        hint:
          'Three parts: what is confirmed, what was checked and came back clear, and what the search ' +
          'could not have covered.',
      },
    ],
    debrief:
      'The last sentence is the one that protects everybody. "On the evidence available" is not ' +
      'hedging, it is the accurate scope of every claim in the paragraph above it.',
    practice: [],
  },
];

// --- module ir.8: recovery and afterwards ------------------------------------

const MODULE_IR_8: Exercise[] = [
  {
    id: 'ir.8.1',
    moduleId: 'ir.8',
    packageId: PKG,
    order: 1,
    title: 'Putting the host back',
    kind: 'incident-decision',
    decisionPointId: 'dp.recover',
    goal: 'Choose a recovery that does not depend on your eradication list being complete.',
    prompt:
      'It is 15:00. The portal is running on one server with no redundancy and leadership wants a ' +
      'restoration time. Decide how rmg-web-02 comes back. Read what is still unknown before you ' +
      'choose.',
    teach: {
      concept:
        'Recovery decisions are made under the strongest pressure in the whole incident, because ' +
        'the outage is now visible to everybody and the attacker is not. The question underneath ' +
        'every option is the same: does this plan work even if my list of what the attacker did is ' +
        'incomplete?\n\n' +
        'That reframing settles it. You found four persistence mechanisms on a host where somebody ' +
        'else had root for ninety minutes, and they could have altered any binary, service unit or ' +
        'library in that time. Removing four known things does not address the unknown ones, and no ' +
        'amount of careful enumeration turns "I found four" into "there were four".\n\n' +
        'A rebuild makes the question irrelevant instead of answering it, which is why it is the ' +
        'sound answer even though it is slower. Credential rotation is necessary alongside whatever ' +
        'you choose, because anything readable by root while the attacker was present has to be ' +
        'treated as theirs.',
      examples: [
        {
          command: 'Rebuild from known-good',
          explains: 'Costs hours you can state up front, and does not rely on your enumeration being complete.',
        },
        {
          command: 'Clean in place',
          explains: 'Fast, feels complete, and assumes the list of four was exhaustive.',
        },
      ],
    },
    hints: [
      'Ask of each option: does this still work if I missed a fifth persistence mechanism?',
      'One option restores redundancy fastest and relies on detection that has already failed once today.',
      'One thing has to happen whichever way the host comes back, and it is easy to defer and then never do.',
    ],
    solution:
      'Rebuild rmg-web-02 from a known-good image and redeploy the application from source control, ' +
      'and rotate every credential and key that was readable on the host. The rebuild is the only ' +
      'option that does not depend on the four persistence mechanisms being all of them, on a host ' +
      'where an attacker held root for ninety minutes and could have modified anything. Cleaning in ' +
      'place is faster and returns a possibly-compromised host to service; returning it now and ' +
      'watching relies on the same detection that missed an hour of brute force this morning.',
    expectedOutput: 'Rebuild from a known-good image, with credentials and keys rotated.',
    checks: [
      {
        type: 'decision-selects',
        optionIds: RECOVER_SOUND,
        hint:
          'One option survives your eradication list being incomplete, and one has to happen no ' +
          'matter which recovery you choose. You have not chosen both.',
      },
      {
        type: 'decision-avoids',
        optionIds: RECOVER_HARMFUL,
        hint:
          'One of your choices returns a host to service on the assumption that everything the ' +
          'attacker left has been found.',
      },
      {
        type: 'decision-justifies',
        conceptGroups: [
          ['rebuild', 'known-good', 'from scratch', 'wipe'],
          ['root', 'ninety minutes', 'binary', 'modified', 'anything', 'incomplete', 'missed'],
          ['credential', 'key', 'rotate', 'password', 'token'],
        ],
        hint:
          'Say why in the box: what a rebuild buys that cleaning does not, and what has to happen ' +
          'regardless of which route you take.',
      },
    ],
    debrief:
      'The restore-from-backup option is deliberately defensible rather than sound. It is a real ' +
      'answer if you can show the backup predates first access, and the same timeline that lets you ' +
      'argue that also says you cannot be certain 10:14 was the first login. Defensible with ' +
      'evidence; dangerous as a reflex.',
    practice: [],
  },
  {
    id: 'ir.8.2',
    moduleId: 'ir.8',
    packageId: PKG,
    order: 2,
    title: 'What has to change before it goes back',
    kind: 'multiple-choice',
    goal: 'Separate restoring service from removing the conditions that allowed the incident.',
    prompt:
      'rmg-web-02 is being rebuilt. Which of the following should be true before it carries traffic ' +
      'again? Select all that apply.',
    teach: {
      concept:
        'A host restored to exactly the state it was in on the morning of the incident is a host ' +
        'that can be compromised the same way this afternoon. Recovery is not "back to normal", it ' +
        'is "back to better than it was", and the difference is a short list of specific changes ' +
        'traceable to the root cause.\n\n' +
        'Here the root cause was unlimited password attempts against an internet-facing service with ' +
        'no alerting, reaching a stale account that should not have existed. So the list writes ' +
        'itself: key-based authentication or rate limiting on SSH, an alert on repeated failure, ' +
        'and the removal of accounts nobody can account for. Add monitoring you know works, because ' +
        'the monitoring you had did not fire once all morning.\n\n' +
        'What does not belong on the list is anything that is not traceable to how this happened. ' +
        'Recovery is the moment when every unrelated project tries to attach itself to an incident, ' +
        'and a hardening list nobody can finish delays the restoration for no security benefit.',
    },
    options: [
      { id: 'a', label: 'SSH accepts keys only, or rate-limits and locks out repeated password failures.' },
      { id: 'b', label: 'An alert fires on repeated authentication failure from one source, and somebody has seen it fire.' },
      { id: 'c', label: 'Stale accounts with sudo rights have been reviewed and removed across the estate.' },
      { id: 'd', label: 'Credentials and keys that were readable on the host have been rotated.' },
      { id: 'e', label: 'A full estate-wide migration to a new identity platform is completed first.' },
    ],
    hints: [
      'Four are traceable to how this incident actually happened. One is a project.',
      'Every item should answer "and that would have stopped or caught this".',
      'Ask which of these could realistically be true before the host returns.',
    ],
    solution:
      'A, B, C, and D. Each maps directly onto a link in the chain: the guessing, the silence while ' +
      'it happened, the stale account it reached, and the credentials the attacker could read once ' +
      'inside. B is worth insisting on in its exact wording, because an alert nobody has watched ' +
      'fire is a hypothesis. E is the one to push back on: it may well be a good idea, it is not ' +
      'traceable to this incident, and attaching it here means either the host stays down for ' +
      'months or the condition is quietly dropped and the credibility of the whole list goes with it.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option is a large programme of work that is not traceable to how this incident ' +
          'happened.',
      },
    ],
    debrief:
      'Keep the recovery list short and causally connected. The fastest way to have none of it ' +
      'implemented is to make it long enough that finishing it is somebody else problem.',
    practice: [],
  },
  {
    id: 'ir.8.3',
    moduleId: 'ir.8',
    packageId: PKG,
    order: 3,
    title: 'Know that eradication worked',
    kind: 'short-answer',
    goal: 'Say what evidence would show the attacker is actually gone.',
    prompt:
      'The rebuilt host is back in service. In three or four sentences, say how you would establish ' +
      'over the following days that the attacker no longer has access.',
    teach: {
      concept:
        'Eradication is a claim, and like every other claim in this package it needs evidence rather ' +
        'than confidence. The evidence is mostly the absence of specific things you decided to watch ' +
        'for in advance, which only counts if you can show the watching was working.\n\n' +
        'Three kinds of evidence matter. WATCHING FOR RETURN: alerting specifically on the indicators ' +
        'from this incident, the account name, the key, the source, and on the behaviour, so a return ' +
        'produces a signal rather than a silence. WATCHING THE ROUTE BACK IN: authentication ' +
        'attempts against the rebuilt host, so a resumed brute force is visible on the first day ' +
        'rather than the fortieth. And PROVING THE DETECTION WORKS: firing a test through it, because ' +
        'the alerting that existed this morning was also silent and nobody had ever confirmed it ' +
        'would not be.\n\n' +
        'Give it a defined period and a defined end. "We watched for a while and nothing happened" is ' +
        'not a finding; "no indicator from this incident appeared over thirty days, on detection ' +
        'we verified was firing" is.',
    },
    hints: [
      'Absence only counts as evidence if you can show you were actually looking.',
      'One of the three things to do is about the detection itself rather than about the attacker.',
      'A good answer names monitoring for the specific indicators, watching authentication against the rebuilt host, verifying the alerting actually fires, and gives a defined period.',
    ],
    solution:
      'I would alert specifically on the indicators from this incident, the sysmon account name, the ' +
      'attacker key, and the pattern of a login followed by an account creation, so that a return ' +
      'produces a signal rather than passing unnoticed. I would watch authentication against the ' +
      'rebuilt host closely for the first weeks, since a resumed brute force from the same actor is ' +
      'the cheapest thing for them to try and the easiest thing for us to see. Crucially I would ' +
      'test that this detection actually fires, by generating a matching event, because the ' +
      'monitoring in place this morning was silent through an hour of failures and nobody had ever ' +
      'confirmed it would not be. I would set a defined period, thirty days, and record at the end ' +
      'that no indicator appeared on detection we had verified, which is a finding rather than an ' +
      'impression.',
    expectedOutput:
      'An answer naming alerting on the incident indicators, watching authentication on the rebuilt ' +
      'host, verifying the detection actually fires, and a defined review period.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['alert', 'monitor', 'watch', 'detect'],
          ['test', 'verify', 'confirm', 'fires', 'firing', 'generating'],
          ['thirty days', '30 days', 'defined period', 'for the first weeks', 'period'],
        ],
        hint:
          'Three ideas: what you watch for, how you prove the watching works, and over what period.',
      },
    ],
    debrief:
      'The middle one is the one teams skip. An untested alert and no alert produce identical output ' +
      'on a quiet network, and you cannot tell them apart until the day it matters.',
    practice: [],
  },
  {
    id: 'ir.8.4',
    moduleId: 'ir.8',
    packageId: PKG,
    order: 4,
    title: 'Run the review without blame',
    kind: 'short-answer',
    goal: 'Write a post-incident finding about the system rather than about a person.',
    prompt:
      'The stale testuser account had sudo rights and a guessable password, and had been unused for ' +
      '619 days. In three or four sentences, write that up as a post-incident finding.',
    teach: {
      concept:
        'Somebody created that account, and somebody else did not remove it. Naming them achieves ' +
        'nothing and costs you the next incident, because the analyst who watches a colleague blamed ' +
        'for a mistake learns to raise things later and more quietly.\n\n' +
        'The alternative is not pretending nothing went wrong. It is asking why the system made the ' +
        'outcome likely: the account survived 619 days because nothing reviewed dormant accounts, ' +
        'nothing flagged sudo rights on an account that had not logged in, and nothing expired ' +
        'credentials that were never rotated. Those are three missing controls, and each one is ' +
        'fixable in a way that "somebody should have noticed" is not.\n\n' +
        'A good finding therefore states the condition, states the absent control that allowed it to ' +
        'persist, and proposes something specific and mechanical, without naming an individual.',
    },
    hints: [
      'Do not ask who. Ask what would have had to exist for this to be caught without anybody being vigilant.',
      'The gap is not that somebody forgot. It is that nothing ever looked.',
      'A good finding names the dormant privileged account as the condition, names the missing review or expiry control, and proposes a specific recurring mechanism.',
    ],
    solution:
      'An account with sudo rights remained active and unused for 619 days with a password that had ' +
      'never been rotated, and it was the entry point for this incident. The condition persisted ' +
      'because no control existed to find it: nothing reviewed dormant accounts, nothing flagged ' +
      'privileged rights on an account with no recent login, and nothing forced credential rotation ' +
      'or expiry. This is a missing process rather than an individual failure, and it would have ' +
      'survived any amount of care from the people involved, because nobody was ever prompted to ' +
      'look. The remediation is a recurring automated review that disables accounts with no ' +
      'authentication in ninety days and reports privileged accounts that are dormant.',
    expectedOutput:
      'A finding naming the dormant privileged account as the condition, the absence of any review or ' +
      'expiry control as the reason it persisted, and a specific recurring remediation, without ' +
      'naming an individual.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['dormant', 'unused', '619', 'stale', 'no recent login'],
          ['no control', 'nothing reviewed', 'missing process', 'nothing flagged', 'never prompted', 'no review'],
          ['automat', 'recurring', 'disable', 'expiry', 'ninety days', '90 days', 'quarterly'],
        ],
        hint:
          'Three parts: the condition, the control whose absence let it persist, and a specific ' +
          'recurring remediation.',
      },
    ],
    debrief:
      'Read your answer back and check no person appears in it. If one does, the finding is about ' +
      'them and it will be read as an accusation, which is both less useful and less true than the ' +
      'version about the missing control.',
    practice: [],
  },
  {
    id: 'ir.8.5',
    moduleId: 'ir.8',
    packageId: PKG,
    order: 5,
    title: 'Make the lessons survive the week',
    kind: 'short-answer',
    goal: 'Turn review findings into commitments that actually get done.',
    prompt:
      'The review produced eleven recommendations. In three or four sentences, say how you would ' +
      'hand them over so that they are still real in three months.',
    teach: {
      concept:
        'Almost every incident produces a good list of recommendations and almost none of them get ' +
        'implemented, because the list is written by people with no budget, handed to people with no ' +
        'context, at the exact moment everybody wants to stop thinking about it.\n\n' +
        'Three things change that. AN OWNER PER ITEM, by name and role, and never the security team ' +
        'for work the security team cannot do. A DATE, because an item with no date is a wish, and a ' +
        'realistic one, because a list of dates nobody believes is worse than no dates. And ' +
        'RUTHLESS PRIORITISATION: eleven recommendations will not happen, so name the two or three ' +
        'that address the actual chain of this incident and mark the rest explicitly as accepted or ' +
        'deferred, so their absence is a decision rather than a drift.\n\n' +
        'Then track them somewhere that is reviewed, in the risk register or the normal engineering ' +
        'backlog, not in the incident document. Incident documents get archived; backlogs get read.',
    },
    hints: [
      'Eleven items will not get done. Which of them address the chain that actually happened?',
      'Two fields turn a recommendation into a commitment.',
      'A good answer assigns a named owner and a date per item, cuts the list to the few that address the root cause, and moves them somewhere that is actually reviewed.',
    ],
    solution:
      'I would cut the eleven down to the two or three that address the chain this incident actually ' +
      'used, which here is rate limiting or key-only authentication on SSH, alerting on repeated ' +
      'failure, and dormant privileged account review, and mark the remainder explicitly as ' +
      'accepted or deferred so their absence is a recorded decision rather than a drift. Each ' +
      'surviving item gets a named owner who can actually deliver it, which for infrastructure ' +
      'changes is not the security team, and a realistic date. Then they move out of the incident ' +
      'report and into the risk register or the engineering backlog, because that is what gets ' +
      'reviewed after the incident stops being interesting. Finally I would put a date in the diary ' +
      'to check them, since an unreviewed commitment is indistinguishable from one nobody made.',
    expectedOutput:
      'An answer that cuts the list to the items addressing the root cause, assigns a named owner and ' +
      'a date to each, and moves them somewhere that is routinely reviewed.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['cut', 'two or three', 'prioritis', 'prioritiz', 'the few', 'reduce', 'shortlist'],
          ['owner', 'named', 'who can deliver', 'accountable'],
          ['risk register', 'backlog', 'reviewed', 'diary', 'date', 'tracked'],
        ],
        hint:
          'Three ideas: which items survive the cut, who owns each one, and where they are tracked ' +
          'so somebody looks at them again.',
      },
    ],
    debrief:
      'That is the end of the incident and the beginning of the next one not happening. The measure ' +
      'of a response is not how well it was run, it is whether the same route works again in March.',
    practice: [],
  },
];

export const INCIDENT_RESPONSE: LearningPackage = {
  id: PKG,
  order: 5,
  title: 'Incident Response and Remediation',
  summary:
    'The intrusion you read in Log Analysis and triaged in Alert Triage, now happening to you. Contain it ' +
    'without destroying the evidence, find every mechanism the attacker left behind, work out what ' +
    'was taken, and write the things other people will act on.',
  outcomes: [
    'Contain a live intrusion without losing the evidence that explains it',
    'Collect evidence in order of volatility, and say why the order matters',
    'Find every persistence mechanism on a compromised host from the command line',
    'Separate what the evidence proves from what it merely suggests, in writing',
    'Brief executives and legal in language they can act on',
    'Turn one incident into indicators, a root cause, and a playbook',
  ],
  prerequisites: ['incident-triage'],
  modules: [
    {
      id: 'ir.1',
      packageId: PKG,
      order: 1,
      title: 'Containment',
      summary:
        'The attacker is still connected and every option costs something. Decide, then live with it.',
      exercises: MODULE_1,
    },
    {
      id: 'ir.2',
      packageId: PKG,
      order: 2,
      title: 'Evidence on the host',
      summary:
        'Four persistence mechanisms and the way in, found with the same commands Linux Fundamentals taught.',
      exercises: MODULE_2,
    },
    {
      id: 'ir.3',
      packageId: PKG,
      order: 3,
      title: 'Scope and eradication',
      summary:
        'Remove all of it, work out how much data was involved, and name the cause that was not the ' +
        'attacker.',
      exercises: MODULE_3,
    },
    {
      id: 'ir.4',
      packageId: PKG,
      order: 4,
      title: 'Communication and closure',
      summary: 'Legal, the executives, the timeline, and the playbook for the next one.',
      exercises: MODULE_4,
    },
    {
      id: 'ir.5',
      packageId: PKG,
      order: 5,
      title: 'Timeline and root cause',
      summary:
        'Order the privileged actions, find the moment access was gained, measure dwell, separate ' +
        'cause from symptom, and state what the evidence cannot show.',
      exercises: MODULE_IR_5,
    },
    {
      id: 'ir.6',
      packageId: PKG,
      order: 6,
      title: 'The written record',
      summary:
        'Preserving output, the running log, what belongs in a ticket, handing over mid-incident, ' +
        'chain of custody, and closing honestly.',
      exercises: MODULE_IR_6,
    },
    {
      id: 'ir.7',
      packageId: PKG,
      order: 7,
      title: 'How far did it go',
      summary:
        'Directing limited people at the host that answers the blocking question, sweeping for what ' +
        'the attacker cannot discard, and stating scope at the strength the evidence supports.',
      exercises: MODULE_IR_7,
    },
    {
      id: 'ir.8',
      packageId: PKG,
      order: 8,
      title: 'Recovery and afterwards',
      summary:
        'Rebuilding rather than cleaning, what has to change before a host returns, proving ' +
        'eradication worked, and turning review findings into commitments somebody keeps.',
      exercises: MODULE_IR_8,
    },
  ],
};
