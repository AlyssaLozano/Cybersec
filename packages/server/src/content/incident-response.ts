/**
 * Incident Response and Remediation -- 18 exercises across 4 modules.
 *
 * PACKAGE ID: 'incident-response', NOT a number.
 *
 * The numbered packages (1-4) keep their ids because progress rows reference
 * them and CLAUDE.md makes ids permanent. Every package written from here on
 * gets a NAME instead, because numbers collide the moment two people are adding
 * content at the same time -- which is exactly how this package and Package 4
 * were written. Exercise ids follow: 'ir.1.1' rather than '5.1.1'.
 *
 * THE SAME INCIDENT, FOR THE THIRD TIME
 *
 * Package 2 taught students to find this intrusion by hand, one grep at a time.
 * Package 3 showed it to them again as eight alerts inside eighty-two. Here they
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
const VALIDATE_SOUND = optionsWithQuality('dp.validate', 'sound');
const VALIDATE_HARMFUL = optionsWithQuality('dp.validate', 'harmful');

// --- shared teaching material ------------------------------------------------

const VOLATILITY_TEACH: Teach = {
  concept:
    'Evidence has a shelf life, and the order you collect it in decides how much of it survives. ' +
    'Memory disappears the instant power or state changes and is the only place some things ever ' +
    'exist — a decrypted key, an in-memory payload, the attacker’s live session. Disk will still ' +
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
    'eliminating the uncertainty — there is no time — it is knowing precisely which part of your ' +
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
      'the order you would perform them. Every step here is correct — only the order is being graded, ' +
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
      'This ordering is not a convention somebody agreed on — it falls out of physics. Every argument ' +
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
          'there — and one of these options mistakes containment for closure.',
      },
    ],
    debrief:
      'Ridgeline would have reset the testuser password here, congratulated themselves, and been ' +
      're-compromised the moment the host came back — by a cron job nobody looked for, because the ' +
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
        'home directory, shell. The shell is the last field, and it is the one that matters — an ' +
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
      'The accounts with a real login shell, including sysmon (UID 1501) — a name chosen to look ' +
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
        'keep — alongside, quite often, an account of yours that should have lost it years ago.',
      syntax: 'grep PATTERN FILE',
      examples: [
        {
          command: 'grep adm /etc/group',
          explains: 'The adm group and its members — historically the accounts allowed to read logs.',
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
          'A second account in that group is also wrong — the stale test account the attacker used ' +
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
        'closest thing to a transcript of what somebody did, and attackers know it — which is why ' +
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
      'The file is called .bash_history — the leading dot makes it hidden.',
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
          'The history should show the backdoor account being created. Check the path — it is the ' +
          'compromised account’s home directory.',
      },
      {
        type: 'output-contains',
        text: 'usermod',
        hint: 'The same history shows the new account being granted privilege. Look for usermod.',
      },
    ],
    debrief:
      'Read the sequence: id, sudo -l, cat /etc/passwd — an attacker working out what they have — ' +
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
        'there was, and exactly when — three facts that decide the scope of a breach notification. ' +
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
      'The path is /tmp/.cache — the dot is part of the directory name.',
    ],
    solution: 'ls -la /tmp/.cache',
    expectedOutput:
      'pt.tar.gz at roughly 6.3 GB, written at 11:09 and owned by root — plus a second file, the ' +
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
      'breach — and it is the number legal will ask for first. Note the second file, owned by sysmon: ' +
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
      'inside it — you are logged in as student, not root — but the listing alone is evidence.',
    teach: {
      concept:
        'You are not root on this host, and a real responder frequently is not either at first. That ' +
        'is not a dead end: metadata is evidence. A directory you cannot open still tells you it ' +
        'exists, who owns it, what its permissions are, and when it was last written — and for SSH ' +
        'key material, when it was written is very nearly the whole finding. Recording what you could ' +
        'not access, and why, is part of the job rather than a failure of it.',
      syntax: 'ls [OPTIONS] PATH',
      examples: [
        {
          command: 'ls -la /home',
          explains: 'Every home directory and when each was created — an account created today stands out.',
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
      'A .ssh directory owned by sysmon with permissions drwx------, written at 11:04 — four minutes ' +
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
          'and timestamp — which are the evidence.',
      },
    ],
    debrief:
      'You cannot read authorized_keys as student, and that is realistic. What you can establish is ' +
      'that SSH key material was written at 11:04 on an account created at 10:22, four minutes before ' +
      'a key-based login from the attacker’s address. That is enough to know a key exists and to ' +
      'record that reading it requires escalated access and an evidence request — which is exactly ' +
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
        'way in — which was not the attacker’s doing and is still open — and deleting evidence in the ' +
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
        'to survive the attacker changing tools. Addresses are the weakest — they are cheap to ' +
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
      'any other host would be conclusive. The most durable of the four is the behavioural one — a ' +
      'crontab fetching a remote script on a fixed interval — because the attacker can change every ' +
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
        'not announce itself — the incident simply restarts later, usually worse.',
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
      'generated patient record exports — appointment and billing data covering several thousand ' +
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
      'you — "staged for exfiltration, transfer unconfirmed" is a sentence they can act on.',
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
      'What is the root cause of this incident? Not the immediate trigger — the condition that made ' +
      'it possible. Name it and say what control would have prevented it.',
    teach: {
      concept:
        'Root cause analysis fails when it stops at the attacker. "Somebody brute-forced us" is not a ' +
        'root cause, because brute force is a constant of the internet and always will be. The root ' +
        'cause is the condition on your side that turned an ordinary attack into a compromise — and ' +
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
      'ordinary — this host is scanned continuously — and it succeeded because that one account was ' +
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
          'Name the account and what was wrong with it — stale AND privileged — then propose a ' +
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
        'potential compromise, not from proof of transfer — so "I will tell them once I am sure" can ' +
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
      'Two options here are wrong in opposite directions — one waits for certainty, one asserts it.',
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
      'you are doing, and what you need from them. No jargon — if a word would need explaining, it ' +
      'does not belong. Six sentences at most.',
    teach: {
      concept:
        'Executives need four things and no others: what happened in plain terms, how bad it is, what ' +
        'is being done, and what decision you need from them. Technical detail does not reassure ' +
        'them, it obscures the decision — and the most common failure is not being unclear, it is ' +
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
      'Say what you do not know as clearly as what you do — they will be asked.',
      'End with the ask. What decision or resource do you actually need?',
    ],
    solution:
      'Someone guessed the password to an old test account on the patient portal server and used it ' +
      'to give themselves administrator access. They collected a copy of patient appointment and ' +
      'billing records into a single file. We cut off their access this morning and the portal is ' +
      'running normally on a backup server. We do not yet know whether that copy actually left our ' +
      'network — establishing that is our priority today, and legal has been engaged in case patient ' +
      'notification is required. What we need from you is a decision on external communications ' +
      'before we know the answer, and authorisation to force a password reset across the ' +
      'organisation.',
    expectedOutput:
      'Plain-language impact, current status, the open question, and a specific ask — no jargon.',
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
      'Notice how much shorter the plain version is. Jargon is usually a way of avoiding commitment — ' +
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
        'important number in the report — it is what the whole detection programme gets judged on.',
      examples: [
        {
          command: '10:14 — password accepted for testuser from 203.0.113.55 (auth.log)',
          explains: 'Time, event, evidence. Anyone can verify it without asking you.',
        },
        {
          command: 'Morning — attacker got in somehow',
          explains: 'Unverifiable and unusable. It will be challenged and you will have nothing to offer.',
        },
      ],
    },
    hints: [
      'You already know the sequence from Packages 2 and 3: brute force, login, account, privilege, ' +
        'cron, beacon, key login, archive.',
      'Start earlier than the successful login. The brute force from 09:12 is the first evidence.',
      'End with containment, and note when detection actually happened versus when the events did.',
    ],
    solution:
      '09:12 — sustained brute force begins against multiple accounts from 203.0.113.55 and three ' +
      'other addresses (auth.log, SIEM alert at 09:14). 10:14 — password accepted for testuser from ' +
      '203.0.113.55 after 62 failures; this is initial access (auth.log). 10:22 — local account ' +
      'sysmon created via sudo by testuser (auth.log, EDR). 10:31 — sysmon added to the sudo group ' +
      '(auth.log, EDR). 10:40 — crontab installed for sysmon beaconing every 15 minutes (syslog, ' +
      'EDR). 10:45 — first outbound connection to 198.51.100.60 (proxy log). 11:05 — sysmon logs in ' +
      'by public key from 203.0.113.55 (auth.log). 11:06 — 6.3 GB archive of patient exports written ' +
      'to /tmp/.cache (EDR, filesystem). 11:42 — memory captured and host isolated. Detection lagged ' +
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
          'Cover the whole chain — brute force, initial access, account creation and privilege, ' +
          'persistence and beacon, data staging — and tie entries to the evidence they come from.',
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
      'Do not stop at eradication — validation and the post-mortem are steps too.',
    ],
    solution:
      'One: confirm the compromise is real — check the rule history and rule out a scheduled job or ' +
      'change record. Two: capture volatile memory before touching anything else. Three: record live ' +
      'network connections and their processes. Four: isolate the host at the network layer, failing ' +
      'the service over first if it is customer-facing; get containment authorised by the on-call ' +
      'incident lead. Five: image and hash the disk, and record chain of custody. Six: enumerate ' +
      'persistence — accounts, group memberships, cron and systemd units, SSH keys — and write down ' +
      'every mechanism found rather than removing them as you go. Seven: engage legal and the privacy ' +
      'officer as soon as regulated data is plausibly involved, stating what is known and what is ' +
      'not. Eight: rebuild rather than clean, extract indicators, sweep the estate, watch egress for ' +
      'the beacon destination, and hold a blameless post-mortem that produces at least one control.',
    expectedOutput:
      'Six to eight ordered, specific steps covering confirm, preserve, contain, image, enumerate, ' +
      'notify, rebuild and validate — with roles named.',
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
      'through for twenty minutes — which is considerably more than a certificate does.',
    practice: INCIDENT_RESPONSE_PRACTICE['ir.4.4'] ?? [],
  },
];

export const INCIDENT_RESPONSE: LearningPackage = {
  id: PKG,
  order: 5,
  title: 'Incident Response and Remediation',
  summary:
    'The intrusion you read in Package 2 and triaged in Package 3, now happening to you. Contain it ' +
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
  prerequisites: ['3'],
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
        'Four persistence mechanisms and the way in, found with the same commands Package 1 taught.',
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
  ],
};
