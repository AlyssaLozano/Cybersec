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
    'Evidence, here, just means anything on a computer that can show what an attacker did: a file, a ' +
    'log entry, a running program, a live connection. Not all of it lasts the same length of time. ' +
    'Some of it survives on a hard disk for years. Some of it exists only while the machine is ' +
    'switched on and vanishes the instant that changes, which is what "volatile" means: not ' +
    'dangerous, just short-lived. Evidence has a shelf life, and the order you collect it in decides ' +
    'how much of it survives to be looked at.\n\n' +
    'Picture the difference between a name carved into a stone wall and a word written in wet sand at ' +
    'low tide. The wall will read the same next year. The sand is gone with the next wave. A ' +
    'computer\'s memory, its RAM, is the sand: it holds the attacker\'s live session, any password or ' +
    'encryption key they had decrypted, anything a running program was working on but had not yet ' +
    'saved anywhere permanent. The instant the machine loses power, reboots, or its running state ' +
    'changes in some other way, everything that was only in memory is gone for good, and no tool ' +
    'anywhere can bring it back. The disk is the wall: a file written there stays until something ' +
    'deliberately removes it, so there is no rush to grab it first.\n\n' +
    'That is the entire reason an "order of volatility" exists as a rule: it is a checklist that puts ' +
    'the sand before the wall. Capture memory first, then whatever disappears next (live network ' +
    'connections, for instance, which die the moment you disconnect the machine), and only once the ' +
    'fragile things are safely copied do you move on to disk and log files, which were never going ' +
    'anywhere.',
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
    'In an incident you rarely get to wait for complete information before you act. Something is ' +
    'happening right now, and every hour spent trying to understand it fully is an hour the attacker ' +
    'gets to keep going. So you will make irreversible decisions on roughly sixty percent of the ' +
    'picture: some things you can prove, and some things you can only guess at, and both categories ' +
    'have to go into the same decision.\n\n' +
    'Think of it like a doctor in an emergency room. They do not wait for every test result before ' +
    'starting treatment, because the patient cannot wait that long, but they also do not pretend the ' +
    'missing results do not exist: they treat based on what is known, and they say out loud what is ' +
    'still unknown, so the next clinician who looks at the chart knows exactly where the gaps are.\n\n' +
    'The skill in incident response is the same. It is not eliminating the uncertainty, because there ' +
    'is no time to. It is knowing precisely which part of the picture is missing and deciding anyway, ' +
    'out loud, in writing, so that somebody else, a colleague, a manager, a lawyer reading the report ' +
    'months later, can see exactly what you were working from and was not simply asserted as fact.',
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
        'Containment is the act of stopping an attacker from doing anything further, right now, ' +
        'without necessarily removing them from the system yet. Think of a break-in at a building: ' +
        'containment is locking the doors and cutting the alarm the intruder disabled so they cannot ' +
        'get further in or take anything more out. It is not the same as catching them, searching the ' +
        'building, or fixing the lock they used, all of which come later. Its whole job is to stop the ' +
        'bleeding immediately.\n\n' +
        'Containment is usually the first irreversible decision in an incident, and it is usually made ' +
        'under time pressure by whoever noticed the intrusion, which is why it deserves its own module ' +
        'before anything else. Every way of containing an attacker trades something for something ' +
        'else: acting fast against preserving evidence of what happened, cutting the attacker off ' +
        'against tipping them off that they have been seen, keeping a service running against shutting ' +
        'it down cleanly. There is no move here that costs nothing, and looking for one is how people ' +
        'freeze at the exact moment a decision is needed.',
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
      'Pulling the power is the single most common response to a live intrusion, because it feels ' +
      'decisive and final: the attacker is gone, right now, no ambiguity. That instinct is exactly ' +
      'backwards. It is why so many incident reports contain the sentence "we were unable to ' +
      'determine whether the database was accessed": the answer to that question was sitting in the ' +
      'computer\'s memory, and somebody switched it off, believing they were making things safe, and ' +
      'erased it before anyone had a chance to look.',
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
      'This ordering is not a convention somebody in a committee agreed on: it falls directly out of ' +
      'physics, out of the simple fact that some things stop existing the instant power or state ' +
      'changes and some things do not. Every argument about it in a real incident is really an ' +
      'argument about time pressure, somebody wanting to skip ahead to the part that feels more ' +
      'urgent, and the answer is always that capturing memory takes minutes, while failing to capture ' +
      'it costs the rest of the investigation, because that evidence cannot be recreated afterwards.',
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
      'Being able to defend a slower decision, out loud, to somebody who was not there and only sees ' +
      'the outcome, is a large part of senior incident work. The pressure in the room during an ' +
      'incident is always toward the fastest visible action, the one that looks the most decisive on ' +
      'the day, and "I took four more minutes and kept the evidence" is a sentence you will need ready ' +
      'and be able to explain in plain terms.',
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
        'Containment and eradication sound similar and mean very different things. Containment stops ' +
        'the incident from progressing, the locked door from the last exercise. Eradication is what ' +
        'happens afterwards: actually going through the building, removing whatever the intruder left ' +
        'behind, and fixing the broken lock they got in through. Containment does not do any of that. ' +
        'It does not undo anything the attacker already did.\n\n' +
        'Every account the attacker created, every scheduled task they set up, every key they added so ' +
        'they could log back in later, is still sitting on the disk exactly as they left it, waiting ' +
        'for the host to be reconnected to the network. The original way in, whatever weakness let ' +
        'them get access in the first place, is usually still open too, because containment happened ' +
        'at the network layer and touched nothing on the machine itself. Treating containment as ' +
        'resolution, as though the problem were now solved, is the single most common reason ' +
        'incidents reopen.',
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
      'Ridgeline (the fictional company this incident happens to) would have reset the testuser ' +
      'password here, congratulated themselves on a job well done, and been re-compromised the moment ' +
      'the host came back online: by a cron job, a task the machine runs automatically on a schedule, ' +
      'that nobody looked for, because the alert about it was rated low priority and never checked.',
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
        'On a Linux computer, every user account that exists, real people and background system ' +
        'processes alike, is listed in a single plain text file: /etc/passwd. Despite the name it has ' +
        'not stored actual passwords for decades; what it holds is the roster of accounts, one per ' +
        'line, and some basic facts about each one.\n\n' +
        'Each line has seven fields separated by colons: the account name, a placeholder where a ' +
        'password hash used to live, a numeric user ID, a numeric group ID, a comment, the account\'s ' +
        'home directory, and finally its SHELL, the program that starts when that account logs in. ' +
        'The shell is the field that matters most here, because it is the one that decides whether an ' +
        'account can actually be used to log in at all. Most accounts on a healthy Linux server exist ' +
        'purely so that some background service can own its own files, and they are deliberately given ' +
        'the shell /usr/sbin/nologin: even if somebody had that account\'s password, typing it in would ' +
        'get them nowhere, because there is no interactive shell for them to land in. An account with ' +
        'a real shell, like /bin/bash, is one an actual person, or an attacker, can log into and start ' +
        'typing commands.\n\n' +
        'So the first thing a responder establishes on a compromised host is who can log in at all, ' +
        'which means finding the accounts with a real shell and treating the rest, the ones that ' +
        'cannot log in no matter what, as noise.',
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
      'sysmon is named to look like monitoring infrastructure, the kind of account a security tool ' +
      'might legitimately use, and it has an ordinary human user ID of 1501 rather than the low ' +
      'numbers (below 1000) that real service accounts are conventionally given. Genuine service ' +
      'accounts are also created by something that keeps a record, a deployment script, a package ' +
      'installer, a documented process. Nothing on this host has any record of creating this one, ' +
      'which is itself a finding. Note testuser is here too, described in its own comment field as a ' +
      'temporary migration account: a label that will matter a great deal in the exercises that ' +
      'follow.',
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
        'root is the name of the one account on a Linux machine that is allowed to do absolutely ' +
        'anything: read any file, kill any process, install anything, change anything. Ordinary ' +
        'accounts are deliberately restricted so that a mistake or a compromise on one of them cannot ' +
        'touch the rest of the system. sudo is the mechanism that lets a trusted ordinary account ' +
        'temporarily act as root, one command at a time, without ever needing the root password ' +
        'itself. Whether an account can do that is controlled by group membership.\n\n' +
        'Groups are Linux\'s way of bundling permissions and handing them to more than one account at ' +
        'once, rather than configuring each account individually. /etc/group lists them: group name, ' +
        'a placeholder field, a numeric group ID, and a comma-separated list of which accounts belong ' +
        'to it. The sudo group is the one that matters most of all, because being in it is ' +
        'root-equivalent access: anything root could do, a member of sudo can also do.\n\n' +
        'Knowing who can become root matters more than knowing who exists, because an attacker with an ' +
        'ordinary account can do very little damage, while an attacker with sudo can do anything a ' +
        'system administrator could. It is exactly where an attacker puts an account they intend to ' +
        'keep, and it is very often sitting alongside an account of yours that should have lost that ' +
        'privilege years ago and simply never did.',
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
      'Two findings here, not one. sysmon is the attacker\'s own creation. testuser holding sudo is a ' +
      'mistake Ridgeline (the company this incident happens to) made itself, 619 days earlier, and it ' +
      'is the reason a single guessed password turned into full administrative control of the machine ' +
      'rather than a minor nuisance somebody could shrug off. The second finding, not the attacker\'s ' +
      'cleverness but the organisation\'s own standing mistake, is the one that goes in the ' +
      'post-mortem, the write-up produced after an incident that asks what allowed it to happen.',
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
        'bash is the program most Linux accounts use to type commands into: the shell. As you type ' +
        'commands into it, bash quietly keeps a running list of them in memory, and when that shell ' +
        'session ends, it writes that whole list out to a file in the account\'s home directory called ' +
        '.bash_history. Nobody has to turn this on. It happens by default, every time, for every ' +
        'account, which is what makes it so valuable to a responder: it is the closest thing there is ' +
        'to a transcript of exactly what somebody typed, in the order they typed it.\n\n' +
        'Attackers know this file exists too, which is why the last command in a compromised history ' +
        'is so often an attempt to erase it, something like clearing the history or deleting the file. ' +
        'The trap for them is that history is only written out when the shell exits, so a command ' +
        'meant to erase the file has to be typed into the shell first, which means it gets recorded ' +
        'right alongside everything it was trying to hide. That attempt survives, and the fact that ' +
        'somebody tried to cover their tracks tells you something about intent all on its own.',
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
      'Read the sequence: id (who am I), sudo -l (what am I allowed to run as root), cat /etc/passwd ' +
      '(who else exists on this machine), an attacker methodically working out what they have just ' +
      'gained access to, followed by useradd (create an account), passwd (set its password), usermod ' +
      '-aG sudo (add it to the privileged group), and finally history -c, an attempt to clear the ' +
      'history. The `sudo -l` line is the exact moment they discovered that a supposedly temporary ' +
      'test account could become root. The `history -c` at the end ran too late to remove anything, ' +
      'because bash had already written everything typed before it out to the file on disk.',
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
        'Stealing data from a server is not usually one instant action. It is a two-step process: ' +
        'first the attacker gathers up whatever they want from wherever it is scattered on the ' +
        'filesystem and bundles it into a single file, usually a compressed archive, and only then do ' +
        'they move that file off the machine. That first step is called STAGING, and the bundled file ' +
        'it produces sits on disk, however briefly, as physical evidence of exactly what was taken.\n\n' +
        'A directory listing of that staged file tells you three things at once: what was selected ' +
        '(from the filename and location), how much of it there was (from the file size), and exactly ' +
        'when it was gathered (from the timestamp). Those three facts are precisely what later decide ' +
        'the scope of a breach notification, the legal process of telling regulators and customers ' +
        'that their data may have been exposed.\n\n' +
        'Attackers commonly stage this kind of file somewhere like /tmp, a directory every account can ' +
        'write to, inside a DOT-DIRECTORY: a folder whose name begins with a period. On Linux, a name ' +
        'starting with a dot is treated as hidden by convention, meaning the plain `ls` command will ' +
        'not show it in a normal listing. It is not real security, just an easy way to avoid being ' +
        'noticed by a quick glance, which is exactly why a responder never trusts a plain listing.',
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
      'The size and timestamp are the finding here, not the filename. 6,298,441 bytes written at ' +
      '11:09, staged from a directory that holds exported patient records, is what turns a technical ' +
      'intrusion into a potential regulated data breach, and the byte count is the very first number ' +
      'the legal team will ask for once they hear about this. Note the second file in the listing too, ' +
      'owned by sysmon: that is the payload a scheduled job on this host periodically fetches and ' +
      'runs, which the next few exercises pick up.',
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
        'On Linux, every file and directory has an owner and a set of permissions that decide who is ' +
        'allowed to read it, write to it, or (for a directory) look inside it. A directory with the ' +
        'permission mode drwx------ can only be entered by its owner: everybody else, including you as ' +
        'the student account, can see that it exists but cannot open it. You are not root on this ' +
        'host, and a real responder is frequently not either, at least not immediately.\n\n' +
        'That is not a dead end. METADATA, information about a file rather than its contents, such as ' +
        'who owns it, what its permissions are, and when it was last changed, is evidence in its own ' +
        'right and you do not need permission to read it. A directory you cannot open still tells you ' +
        'that it exists, who created it, and exactly when it was last touched, and for something like ' +
        'SSH key material (the cryptographic keys that let an account log in without typing a ' +
        'password), the timestamp of when it was written is very nearly the whole finding on its own.' +
        '\n\nRecording what you could not access, and precisely why, is part of doing the job properly ' +
        'rather than a failure of it: it tells the next person, or the next tool, exactly what still ' +
        'needs escalated access to examine.',
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
      'You cannot read the contents of authorized_keys (the file that lists which cryptographic keys ' +
      'are allowed to log into an account) as the student account, and that restriction is realistic, ' +
      'not a limitation of the exercise. What you CAN establish from the listing alone is that SSH key ' +
      'material was written at 11:04 on an account that was created at 10:22, four minutes before a ' +
      'key-based login arrived from the attacker\'s address. That is enough to know a key exists and ' +
      'roughly when it was planted, and to record that actually reading it requires escalated access ' +
      'and a formal evidence request, which is exactly what you would write in the case notes rather ' +
      'than leaving the question unanswered.',
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
        'Eradication is the step after containment where you actually remove everything the attacker ' +
        'left behind and close the way they got in. Where containment was locking the doors, ' +
        'eradication is walking through the whole building, taking out anything the intruder planted, ' +
        'and fixing the specific lock they picked so the same trick does not work twice.\n\n' +
        'Eradication has to be a checklist, not a judgement call, because missing even one item is ' +
        'indistinguishable, from the outside, from doing nothing at all: a single forgotten backdoor ' +
        'account is enough for the whole incident to happen again. Two things trip people up here in ' +
        'particular. One is forgetting the original way in, the underlying weakness that let the ' +
        'attacker get access in the first place, which was not something the attacker built and so is ' +
        'easy to overlook when you are focused on cleaning up what they did add. The other is deleting ' +
        'evidence in the name of tidying up, before anybody has finished using it to answer questions ' +
        'like how much data was taken.',
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
      'Note what deleting the archive would actually have cost. Not the evidence itself, since a ' +
      'forensic copy, a DISK IMAGE, a bit-for-bit backup of the entire drive taken before rebuilding, ' +
      'still has it. What it would have cost is the two hours of extra work needed to pull that one ' +
      'file back out of the disk image at the exact moment legal is asking how much data was involved ' +
      'and wants an answer today, not in two hours.',
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
        'An indicator of compromise, usually shortened to IOC, is any observable fact, a file, an ' +
        'address, a pattern of behaviour, that would only be present on a machine if the same attacker ' +
        'had been there. Once you have found one host an attacker touched, you turn what you learned ' +
        'about them into a short list of these indicators, and then check every other machine you have ' +
        'against that list, which is far faster than investigating each one from scratch.\n\n' +
        'A good indicator is specific enough that a match means something (not so generic it could be ' +
        'anybody) and durable enough to survive the attacker changing their tools between one host and ' +
        'the next. Not every indicator is equally durable. A network address is the weakest kind: it ' +
        'usually belongs to a rented server the attacker can swap out for the cost of a coffee, so its ' +
        'absence elsewhere proves very little. An account name, a cryptographic key, or a repeated ' +
        'pattern of behaviour costs the attacker real effort to change, which is exactly what makes ' +
        'those indicators worth building a sweep around.',
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
      'This list is the deliverable that makes the difference between remediating one host and ending ' +
      'an incident across an entire organisation. Everything on it can be handed to somebody else, or ' +
      'fed into an automated tool, and run across ten thousand machines by people who understand ' +
      'nothing about this specific case at all, which is exactly what makes it so valuable.',
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
        'Validation is the step where you try to prove yourself wrong, on purpose, before you tell ' +
        'anyone the incident is over. "We think it is clean" is a feeling, not a finding, because ' +
        'feelings are not something anyone else can check. Validation means picking specific tests ' +
        'that would actually FAIL if you had missed something, and running them anyway even though you ' +
        'expect them to pass: sweeping the wider network for the indicators you extracted, watching ' +
        'outbound traffic (EGRESS, meaning data leaving the network) for the address the malware was ' +
        'calling home to, and closing the route into the system that was never fully explained.\n\n' +
        'Failed remediation does not announce itself with an alarm. It looks identical, from the ' +
        'outside, to successful remediation, right up until the incident simply restarts later, ' +
        'usually worse, because the attacker now knows you looked and what you found.',
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
      'The credential reset is the one people argue about, because it is disruptive to everybody\'s ' +
      'day and the link to this specific incident feels speculative rather than proven. That is ' +
      'exactly why it belongs on the list: you never actually established how the password was ' +
      'obtained in the first place, so you cannot rule out that the same password, or the same habit ' +
      'of choosing weak ones, works somewhere else too.',
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
      'Overstating this turns a legal breach notification, a formal, public, hard-to-reverse ' +
      'statement, into something built on a guess rather than proof; understating it risks missing a ' +
      'statutory deadline, a legal cutoff for reporting that starts a clock the moment a breach is ' +
      'suspected. The people who make that call are not technical, so the precision has to come from ' +
      'you: "staged for exfiltration, transfer unconfirmed" is a sentence they can actually act on, ' +
      'while "we think it might be bad" is not.',
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
        'A root cause is the underlying condition that had to be true for something bad to happen, as ' +
        'opposed to the immediate trigger that set it off. If a building floods every time it rains, ' +
        '"it rained" is not the root cause, because it is always going to rain eventually; the root ' +
        'cause is whatever is broken about the drainage. Root cause analysis in incident response fails ' +
        'the same way when it stops at the attacker.\n\n' +
        '"Somebody brute-forced us", meaning tried password after password until one worked, is not a ' +
        'root cause, because attempted brute force is a constant background noise of being connected ' +
        'to the internet at all, and always will be: you cannot fix the fact that attackers exist. The ' +
        'actual root cause is the condition on your own side that turned an ordinary, unremarkable ' +
        'attack into an actual compromise, and it is nearly always something your own organisation did, ' +
        'months or years earlier, for a perfectly reasonable-sounding reason at the time.',
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
      'skipped because by this point the team is exhausted and the attacker is gone, so it feels like ' +
      'the work is finished. Without it, nothing about the organisation actually changes, and the next ' +
      'intrusion simply uses the next stale account that nobody was watching for.',
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
        'Notification is the formal, often legally required, act of telling regulators and the people ' +
        'affected (patients, customers) that their data may have been exposed. In organisations that ' +
        'handle regulated data such as health or financial records, this is not a courtesy: it is ' +
        'frequently a legal obligation with a strict deadline, and whether that obligation has been ' +
        'triggered is a legal question, not a technical one.\n\n' +
        'That is the key thing to hold onto here: whether to notify is not your decision as the ' +
        'incident responder, but the TIMING of telling the people whose decision it actually is (legal ' +
        'and the privacy officer) very much is. Obligations for regulated data generally start ' +
        'counting down from the moment somebody becomes AWARE of a potential compromise, not from the ' +
        'moment somebody has hard proof that data actually left the building. So "I will tell them once ' +
        'I am sure" is not caution, it is quietly spending a legal deadline on somebody else\'s behalf, ' +
        'without them ever getting the chance to weigh in.',
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
      'Regulators penalise delay far more consistently, and far more harshly, than they penalise the ' +
      'breach itself: an organisation that reports promptly with honest uncertainty is treated very ' +
      'differently from one that sat on the knowledge. The instinct to wait until you understand ' +
      'something properly before speaking up is a good engineering instinct almost everywhere else, ' +
      'and it is the wrong one here.',
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
        'The people leading an organisation are usually not technical, and during an incident they do ' +
        'not need to become technical: they need to make a small number of decisions quickly, with ' +
        'the right information in front of them. Executives need four things and no others: what ' +
        'happened, in plain terms; how bad it is; what is being done about it; and what decision you ' +
        'actually need from them.\n\n' +
        'Technical detail does not reassure this audience, however precise and correct it is. It ' +
        'obscures the decision they are there to make, forcing them to either interrupt and ask what a ' +
        'term means or nod along without really following. The most common failure in a brief like this ' +
        'is not being unclear about the facts, it is burying the ASK, the specific thing you need them ' +
        'to decide or approve, so far down in the explanation that nobody in the room realises they were ' +
        'actually meant to do something before the meeting ends.',
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
      'Notice how much shorter the plain version is than the technical one would have been. Jargon is ' +
      'usually a way of avoiding commitment rather than a way of being precise: "potential ' +
      'unauthorised data access event" actually says less than "someone took a copy of patient ' +
      'records" while managing to sound more careful, because the vague phrase commits to nothing an ' +
      'executive could act on.',
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
        'A timeline, in incident response, is a plain ordered list of what happened and when, each ' +
        'entry backed by a specific piece of evidence rather than memory or guesswork. It is the spine ' +
        'of every incident report: the thing every other section, the impact assessment, the ' +
        'notification decision, the executive brief, ultimately argues from.\n\n' +
        'Two rules make a timeline actually useful rather than just a list of events. First, every ' +
        'entry is tied to a specific piece of evidence, a log line, a file, an alert, so that anyone ' +
        'reading it later can check the claim themselves instead of taking your word for it. Second, ' +
        'OCCURRENCE time (when something actually happened) is recorded separately from DETECTION time ' +
        '(when somebody first noticed it). Those are very often not the same moment at all, and the gap ' +
        'between them is the single most important number in the whole report: it is what the entire ' +
        'detection programme, the alerts, the monitoring, the people watching them, ultimately gets ' +
        'judged on.',
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
      'The ninety-minute gap is the finding that changes anything about how this gets fixed. Every ' +
      'stage of this intrusion raised an alert while it was actually happening; the failure was not ' +
      'that nothing detected it, it was that the alerts landed in a queue nobody had the capacity to ' +
      'work through in time. That is a resourcing and tuning problem rather than a missing-tool ' +
      'problem, and the timeline, laid out with both times side by side, is what proves it.',
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
        'A playbook is a written, step-by-step procedure for handling a specific kind of situation, ' +
        'prepared calmly in advance so that nobody has to invent the right response from scratch while ' +
        'it is actually happening. It exists because judgement measurably degrades at 02:00, under ' +
        'pressure, with an attacker still active, and the answer to that is to decide the hard parts in ' +
        'advance rather than to simply try harder in the moment.\n\n' +
        'The playbooks that actually work are specific about order and about exactly who gets called at ' +
        'each point; the ones that do not work are just lists of good principles. "Preserve evidence" ' +
        'is a principle: true, and useless to somebody exhausted at 02:00 who now has to work out what ' +
        'it means for them to do right now. "Capture memory before you touch the network" is a playbook ' +
        'step: a single, concrete, unambiguous action.',
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
      'This is the strongest portfolio piece in the whole package. A playbook written in your own ' +
      'words, derived from an incident you actually worked through step by step rather than copied ' +
      'from a template, is something you can hand a hiring manager and talk through in detail for ' +
      'twenty minutes, which is considerably more convincing than a certificate on its own.',
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
        'A timeline is not a list of everything that happened on a machine, which for a busy server could run to millions of lines. It is the shortest ordered sequence of events that explains how the incident got from nothing to where it is now, and the fastest way to build its spine, its first solid set of fixed points, is to start with the actions that needed elevated PRIVILEGE (permission to act as an administrator), because those are the ones that actually changed something about the machine rather than merely reading from it.\n\nsudo is the command that lets a permitted account temporarily act as the all-powerful root account, one command at a time, and every time it is used it writes a record: which account used it, what directory they were standing in, and the exact command line they ran, all stamped with a time. That record lands in the system log in the order it happened, already sorted for you.\n\nRead the whole set before you try to interpret any single line of it. The entries that turn out to be routine, everyday administration are exactly what let you recognise, by contrast, the ones that are not.',
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
      'Two of those five sudo entries are ordinary administration and three are the incident itself: an account created, that account given sudo rights, and then that account archiving the exports directory. Your timeline already has three fixed, evidenced points, and notice that you have not opened a single specialised forensic tool to get them: a plain text log and a simple search did all of it.',
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
        'Every intrusion has a single moment where the attacker stopped being outside the system, merely knocking, and started being inside it, actually logged in and able to act. Finding that exact moment is what turns a pile of disconnected alerts into a coherent story with a beginning. Everything before it is just attempts, failed or otherwise irrelevant; everything after it is activity by that account you now have to account for and treat as suspect.\n\nThe authentication log records every login attempt in the order it happened, so the earliest matching entry in it is simply the first one your search returns, no extra sorting needed. Narrowing the search down to only successful logins, then only from the address you care about, and finally taking just the very first line of what is left, is the entire technique: three small filters stacked together. Getting this one timestamp right matters more than almost anything else you will do in the whole investigation, because every other question you ask from here on is asked relative to it: what happened before this moment, and what happened after.',
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
      '10:14:22, as testuser, using a password. That single timestamp is the boundary of your ' +
      'incident: the line between "before" and "after" that everything else in the investigation gets ' +
      'measured against. Everything testuser did after that moment is suspect and needs accounting ' +
      'for, and everything it did before that moment is probably just a real person doing their ' +
      'ordinary job.',
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
        'Dwell time is how long an attacker was present inside a system before anybody noticed them, and it is one of the very few numbers an executive will actually remember from your report, because it translates directly into "how bad was our detection". It needs exactly two timestamps to calculate: first contact, and detection.\n\nFirst contact is not the same thing as first SUCCESS. The earliest line in the log involving the source address is usually a failure or a probe, a knock that did not get answered, and that is the honest start of the story, because it is the first moment the host and the attacker actually interacted at all, however unsuccessfully. Reporting dwell time starting from the successful login instead quietly shortens the reported incident and makes detection look better than it really was, by hiding the whole stretch of time the attacker spent trying before they got in.',
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
      'First contact at 09:12, first success at 10:14, first privileged action at 10:22: an hour of brute force, meaning repeated password guessing, against a host that did not lock anybody out and did not alert anybody, before the attacker even got in. That hour of silence is the finding worth writing up, not the intrusion that followed it.',
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
        'A root cause is the underlying condition whose absence would have prevented the whole incident from happening, as distinct from the last visible event that actually triggered the alarm. It is almost never the thing people noticed first, because the thing people noticed first is usually the END of a chain of smaller events, not the start of it.\n\nEXFILTRATION, data actually leaving the network for somewhere the attacker controls, is the last event in that chain here and the one that set off the alarm. Fixing only that, blocking that one upload, would mean almost nothing, because it was made possible by everything that happened upstream of it, all the steps that led up to it being possible at all.\n\nWalk the chain backwards, one link at a time. Data left the host because an archive of it had been staged. The archive was staged because an account had sudo, administrator-level rights. That account existed because a different, already-compromised account was used to create it. That account was compromised because a password was successfully guessed, over an hour of completely unimpeded login attempts. So the causes actually worth writing down are the conditions that allowed that hour to happen unopposed: password authentication exposed to the internet with no rate limiting (a mechanism that slows down or blocks repeated attempts) and no account lockout, and no alert firing on repeated authentication failure. Everything downstream of that follows automatically once those conditions exist.\n\nA good answer names the guessable password, or the unlimited login attempts, as the actual entry point, notes the complete absence of detection or alerting on those failures, and says explicitly that the exfiltration was the consequence of all that rather than the cause of anything.',
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
      'Notice which recommendations actually fall out of that answer: rate limiting login attempts, and alerting on repeated failures. Neither of them mentions the archive, the account, or the upload at all, and that is exactly how you know you have reached a genuine cause rather than just described a symptom in more detail.',
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
        'Every incident report ends up containing claims the evidence does not fully support, unless somebody deliberately sits down and writes out the limits of what was actually looked at. Doing that yourself is not modesty or excessive caution, it is self-defence: the person who finds the gap after you have already published the report is going to doubt everything else you wrote, even the parts that were solid.\n\nThree limits apply here and they are worth naming precisely rather than gesturing at vaguely. First, these are HOST logs, meaning they are stored on the very machine that was compromised, and the attacker had root on that machine, so they could have edited or deleted entries in them; that means the absence of something suspicious in the logs is weak evidence, because a careful attacker could simply have removed it. Second, log ROTATION, the routine process of deleting the oldest log entries to save space, has already discarded whatever came before the retained window, so you genuinely cannot say when this really started, only when it started within what survived. Third, the logs record that an upload command RAN, not what was actually inside the file it uploaded: proving whether patient data genuinely left the building needs a capture of the network traffic itself, or evidence from the destination end, neither of which you have here.\n\nA good answer names at least the log integrity problem (root could have altered them), the retention or rotation boundary, and the inability to confirm what was actually transferred.',
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
      'The last limit is the one that changes what you can honestly say to a regulator. "Data was exfiltrated" and "a transfer of an archive of exports was initiated to an external address" sound similar but are different claims of very different strength, and only the second one is actually supported by what the host logs give you.',
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
        'Half of investigative speed is simply knowing where an answer lives before you go looking for it. A log file, a table, a record kept by some piece of software, each one is called an EVIDENCE SOURCE, and sources are not interchangeable: each was built to record one particular kind of thing, and it genuinely does not know about anything else. Pointing the wrong one at a question wastes an hour and, worse, often produces a confident-sounding wrong answer rather than an honest "I do not know".\n\nThe authentication log answers who logged in, from where, and when, because that is specifically what it was built to record. The sudo record answers what was run with elevated privilege. The web server logs answer what was requested over HTTP (the protocol web browsers use) and what the server sent back. The process table and socket table, which list what programs and network connections currently exist on a machine, answer what is happening RIGHT NOW, and they are volatile in exactly the sense the earlier modules covered: reboot the host and they are simply gone.\n\nWhat none of these sources answers is the actual contents of a network transfer, which needs a capture at the network layer itself, a recording of the raw traffic as it crossed the wire, and none of them tells you whether the same attacker is active on other hosts, which needs the same set of questions asked separately, on those other hosts. Knowing what a source cannot answer is just as useful, in practice, as knowing what it can.',
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
      'Option C is worth one more thought on its own: the process and socket tables only answer that question up until the host is rebooted, and no longer. Volatile sources like these have to be captured before you contain the host, which is the whole reason the containment module, back at the start of this package, puts capturing memory before anything else.',
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
        'SCROLLBACK is the text still visible in a terminal window that you can scroll up to see again, and anything that exists only there is not evidence, no matter how carefully you read it, because it disappears the moment the window closes. Terminals close by accident, sessions time out, and the host you are reading may be about to be rebuilt out from under you. Redirecting a command\'s output to a file instead turns a fleeting result into something you can attach to a ticket and something a second analyst, or a reviewer months later, can independently check.\n\nOn the command line, the `>` symbol is called a REDIRECT: it sends a command\'s output to a named file instead of printing it to the screen, creating the file if it does not exist yet and completely overwriting it if it does. `>>` does almost the same thing but appends to the end of the file instead of overwriting it, which is what you want for a running log that you keep adding entries to over the course of a whole shift.\n\nWrite the file into your own home directory, not into the evidence you are examining: writing to the host you are investigating changes that host, which is itself a kind of evidence contamination, and on a real engagement the actual capture belongs somewhere else entirely, off the compromised machine.',
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
      'Note that nothing appeared on screen, which is correct behaviour and slightly disconcerting the first time you see it: the redirect quietly took everything that would normally have printed. Check the file directly rather than assuming it worked, because a redirect that silently captured an error message instead of the results you wanted is a mistake you often only discover much later, when the evidence turns out to be missing.',
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
        'A running log is a written record kept DURING an incident, one short entry added each time something significant happens, rather than a report reconstructed afterwards from memory. It is the single artefact that turns a chaotic, fast-moving afternoon into a defensible account that somebody else can trust later. Four things go in every entry: the TIME it happened, the ACTION taken, the REASON it seemed right at the time, and the EFFECT you actually observed happening as a result.\n\nThe reason matters more than people expect it to when they first start keeping one of these. Decisions made during an incident are made on incomplete information, under time pressure, and they will very often be reviewed later by people who already know how everything turned out, which makes hindsight unfairly generous to alternatives that were never actually available in the moment. An entry that records exactly why a call looked right at 11:47, given only what was known at 11:47, is the difference between a decision that can be defended and one that simply looks reckless once you already know the ending.\n\nWrite each entry in plain past tense, name yourself as the person who acted, and avoid editorialising, meaning stick to what happened rather than how you feel about it. A good entry here names the time, the isolation, the memory capture that came before it, and what happened to the service as a result.',
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
      'The sentence that will matter in three months is the middle one, the reason. Nobody reviewing this later disputes what you did, since that is a plain fact recorded elsewhere; what gets disputed is whether it was reasonable given what was known at the time, and only a note written contemporaneously, meaning at the time rather than reconstructed afterwards, can actually answer that.',
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
        'An incident TICKET is the working record kept during a live response: contemporaneous, meaning written at the time, complete, and often messy, because it is capturing events as they happen rather than being tidied up afterwards. The finished REPORT is a different document entirely: edited, structured, and written afterwards for somebody who was not in the room. Confusing the two costs you either way: a ticket written like a polished report loses the raw detail that makes it credible as a record, and a report that still reads like a raw ticket does not get read at all by the people it is for.\n\nInto the ticket goes every action with its timestamp, every command actually run, every piece of evidence captured and exactly where it was stored, and every decision along with its reasoning. Also into the ticket, and this is the part people forget: things you tried that found nothing, because writing down a dead end is what stops the next person wasting an hour repeating it.\n\nWhat does NOT belong in a ticket is speculation stated as though it were an established fact, and the names of individuals framed as blame. Write "the account testuser authenticated from 203.0.113.55", not "Dana clicked a phishing link", unless you have actually established that as fact. Tickets are DISCLOSABLE, meaning they can end up being read by people well outside the immediate team, regulators, lawyers, auditors, and an unsupported accusation sitting inside one is a serious problem entirely separate from the incident itself.',
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
      'Write about accounts and hosts, not about people, until you can actually prove a specific person did something. It costs you nothing to phrase it that way, it is more accurate to what you actually know, and it keeps the entire investigation anchored to the evidence rather than to a guess about who is at fault.',
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
        'Most real incidents last far longer than a single work shift, and the HANDOVER, the point where one analyst hands the case to another, is where they most often go wrong: the next analyst either re-derives from scratch something you already knew, wasting time, or worse, quietly assumes something is finished simply because nobody explicitly said it was not.\n\nA handover has three parts, and each of them should be short. WHERE IT STANDS: what has been established as fact so far, and what has actually been done to the environment itself (isolated, captured, and so on). WHAT IS OPEN: the specific questions still unanswered, phrased as actual questions rather than vague topics. WHAT IS NEXT: the single most useful thing to do first, plus anything time-critical, including exactly who has already been told and who has not.\n\nBe explicit about what is specifically NOT done yet. "Memory captured, not yet analysed" prevents an hour of somebody downstream wrongly assuming the analysis already happened, and it is exactly the kind of sentence that gets left out when people are tired.',
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
      'The most valuable line in that handover is "captured and not yet analysed". Almost everything else in it could, in principle, be reconstructed later from the ticket; that one specific line is what prevents the incoming analyst from believing a piece of work is finished when it has not even started yet.',
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
        'A piece of digital evidence, an ARTEFACT such as a memory image or a disk copy, is only ever as good as the documented account of exactly where it came from and who has had it since. CHAIN OF CUSTODY is that account, and despite the technical-sounding name it is boring, contemporaneous paperwork rather than anything requiring specialised tools: it exists purely to answer the question "how do we know this file is really what you say it is, and that nobody tampered with it".\n\nFour things have to be recorded for it to hold up. WHAT was collected, precisely, including which host and which storage volume it came from. WHEN and by WHOM, with the time taken from a clock somebody else can independently vouch for. HOW, meaning the specific tool and version used to collect it, because a known-buggy acquisition tool is itself a real avenue to challenge your evidence later. And INTEGRITY: a cryptographic HASH, a short fixed-length fingerprint of the file\'s exact contents, computed at the moment of collection, so that anybody, at any later point, can recompute that fingerprint and demonstrate the copy in front of them is bit-for-bit identical to the one originally taken.\n\nFrom that point on, every subsequent transfer of the evidence has to be logged too: who held it, who they handed it to, and exactly when. A gap in that record does not, by itself, prove anything was altered during it. It simply means nobody can prove it was NOT altered, which in a legal or regulatory setting is usually enough on its own to lose the argument and have the evidence set aside.\n\nA good answer names the hash, the collector and the time of collection, and the unbroken record of everyone who has held the evidence since.',
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
      'None of this chain-of-custody paperwork is technical work in itself, and all of it is the difference between a memory image that actually proves something in front of a regulator and an expensive file nobody can reliably vouch for. Do it at the moment of collection: none of it can be convincingly added afterwards, because the whole point is that it was recorded at the time, not reconstructed from memory later.',
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
        'The closing summary is the single paragraph that ends up getting quoted for years afterwards, in board papers, in regulatory correspondence, and by whoever writes the next incident report and wants an example. It has to be short, specific, and honest about its own limits, because it will travel far beyond the room it was written in.\n\nThree things go in it. WHAT HAPPENED, laid out as a sequence with times, in plain language a non-specialist can follow without help. WHAT THE IMPACT WAS, stated as what has actually been established rather than what is merely feared. And WHAT IS STILL UNCERTAIN, which is the part most often quietly dropped and, for that exact reason, the part that protects everybody involved, because a summary that reads as complete will be treated by its readers as complete, whether or not that is actually true.\n\nResist two opposite temptations while writing it. Do not inflate the claim: describing a merely probable transfer as a confirmed breach commits the whole organisation to a position the evidence may not actually support. Do not minimise it either: an hour of undetected brute force, repeated password guessing, against a service exposed to the internet is a real failure, and saying so plainly is what actually gets it fixed afterwards.',
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
      'Read your last sentence again and check that it does not claim more than the evidence actually supports. The closing summary is the one part of the whole report that will get quoted on its own, stripped of all the surrounding context, so it has to be able to survive being read entirely alone.',
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
        'SCOPING is the process of working out how far an intrusion actually reached: which systems ' +
        'were touched, and just as importantly, which ones were checked and found untouched. It sounds ' +
        'like a purely technical exercise, but underneath it is really a resourcing decision wearing ' +
        'technical clothes. You almost never have enough people to look at everything properly at the ' +
        'same time, so the real question is not "what could the attacker theoretically have reached", ' +
        'it is "which single answer unblocks the most other decisions, and can I actually get it ' +
        'today".\n\n' +
        'Two things separate a good scope from a merely thorough-looking one. First, depth beats ' +
        'coverage: four shallow, rushed looks across four systems produce four inconclusive answers, ' +
        'and an inconclusive answer means the work has to be redone properly later anyway, so nothing ' +
        'was actually saved by spreading thin. Second, cheap estate-wide checks are a different kind of ' +
        'activity from a deep investigation, not a smaller version of one: asking one narrow, ' +
        'mechanical question across every system at once, such as whether a specific account or key ' +
        'exists anywhere, costs almost nothing and scales easily, so it can run alongside the deep work ' +
        'on the one host that matters most, rather than competing with it for the same people.',
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
      'Notice that the DEFENSIBLE option, checking the backup host first, is not actually wrong: it is ' +
      'a real system that genuinely deserves attention. It is simply not the first priority right now, ' +
      'and knowing the difference between "wrong" and "genuinely important, just not yet" is most of ' +
      'what scoping under pressure actually is.',
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
        'The estate-wide sweep decided on in the previous exercise is made up of many small questions ' +
        'exactly like this one: narrow, mechanical, with an answer shape you already know in advance ' +
        'before you even run it. On a real fleet of machines this same question runs automatically ' +
        'against every host through CONFIGURATION MANAGEMENT, tooling that can execute one command ' +
        'across thousands of machines at once; the actual question asked of each host is identical to ' +
        'what you are about to run here by hand, on just this one.\n\n' +
        '/etc/passwd, met earlier in this package, holds the local accounts on a machine, one per ' +
        'line, colon-separated. It is world-readable by design, meaning any account can read it, which ' +
        'is exactly what makes this check so cheap to run everywhere. What you are searching for is ' +
        'the account name, and what you are reading on the matching line once you find it is the UID ' +
        '(the account\'s numeric identity) and the shell: an account with a real, interactive login ' +
        'shell was set up for somebody, or something, to actually log in and use.',
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
      'A real login shell, and a UID in the ordinary human range, on an account deliberately named to ' +
      'look like monitoring software. Genuine monitoring accounts are usually plain SYSTEM accounts ' +
      'with no interactive shell at all, since nothing ever needs to log into them by typing a ' +
      'password, and it is exactly that comparison, real monitoring accounts versus this one, that ' +
      'makes sysmon stand out the moment you know what to look for.',
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
        '"Clean" is probably the single most dangerous word in a scoping conversation, because it ' +
        'sounds like a firm conclusion someone can rely on, while usually being nothing more than a ' +
        'quick summary of whatever that person happened to glance at, with no record of what was ' +
        'actually excluded.\n\n' +
        'A usable clearing statement, one strong enough to put in a report, has three parts. WHAT WAS ' +
        'CHECKED: which specific artefacts, on which specific host, by name. OVER WHAT PERIOD: a ' +
        'clearing that only covers the last hour of logs says nothing whatsoever about the actual ' +
        'intrusion window, which here runs all the way from 09:12 to the moment of isolation. AND WITH ' +
        'WHAT LIMITS: which sources were unavailable at the time, and what would still have been ' +
        'completely invisible even to a careful check, if the attacker had been careful themselves.\n\n' +
        'The strong form of a clearing statement is not "the database is clean". It is "no ' +
        'authentication from web-02 appears in the database logs between 09:12 and 11:42, and those ' +
        'logs are retained for thirty days and were not writable by the compromised host". That is a ' +
        'specific claim somebody else can independently check, and it is honest about being narrower, ' +
        'and therefore more trustworthy, than the single vague word it replaces.',
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
      'Push back on the word "clean" every time you hear it, including the times when you are about ' +
      'to say it yourself. The person quoting your report in six months will not have had the ' +
      'conversation you had, will not remember the caveats you meant to imply; they will only have the ' +
      'sentence you actually wrote down.',
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
        'Not every fact you know about an attacker is worth spending a sweep on. This exercise ' +
        'revisits the same idea as the indicator-of-compromise exercise earlier in the package, this ' +
        'time asking you to actually rank them: the useful ones are specific enough that a match means ' +
        'something real, and stable enough that the attacker cannot trivially change them between now ' +
        'and whenever your sweep actually runs.\n\n' +
        'Strong indicators here: the account name, because it had to be deliberately created and would ' +
        'have to be created again from scratch on a new host; the public key, because it is a fixed ' +
        'string the attacker genuinely needs to keep reusing in order to keep logging back in; the ' +
        'crontab entry (a scheduled task), because persistence, by its very definition, has to keep ' +
        'persisting to be any use to them. Each of those costs the attacker real, meaningful effort to ' +
        'change.\n\n' +
        'Weak ones: a source address, which typically belongs to a rented server the attacker can swap ' +
        'out for the price of a coffee, and a file hash (a fingerprint of a file\'s exact contents) of ' +
        'something that can be trivially recompiled into a file with a completely different fingerprint ' +
        'and identical behaviour. Neither of those is useless to check, and both of them produce a lot ' +
        'of confident FALSE NEGATIVES, meaning a clean-looking result that is actually wrong, if you ' +
        'treat their absence as proof of anything. Search on behaviour and on what the attacker is ' +
        'forced to keep, rather than on what they can freely discard.',
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
      'This is a well-known idea in the field, sometimes called the pyramid of pain, compressed into ' +
      'one exercise: the higher up the pyramid you search, from a disposable address at the bottom up ' +
      'to a genuine behavioural pattern at the top, the more it costs the attacker to evade you, and ' +
      'behaviour costs them the most of all to change.',
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
        'The scoping statement is the paragraph a regulator actually reads to decide how large this ' +
        'incident really was, and it is, of every paragraph in the report, the one most likely to end ' +
        'up wrong in the reassuring direction, simply because reassuring is what everyone in the room ' +
        'wants to hear.\n\n' +
        'It needs three things. WHAT WAS AFFECTED, stated positively and specifically rather than ' +
        'vaguely. WHAT WAS CHECKED AND FOUND NOT AFFECTED, with the actual check named rather than ' +
        'merely implied, because "no evidence of access" without saying what you actually looked at is ' +
        'not a finding at all, it is an unsupported assertion. And THE BOUNDARY OF THE SEARCH: which ' +
        'systems were even in scope for checking in the first place, and what would have been missed ' +
        'entirely by the methods that were used.\n\n' +
        'Write it so that somebody could, in principle, disagree with it. A statement nobody could ' +
        'possibly challenge is usually one that does not actually say anything concrete, and the ' +
        'statements that get organisations into serious trouble later are the ones that read as ' +
        'broader guarantees than the underlying work actually supports.',
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
      'The last sentence is the one that actually protects everybody who relies on this report later. ' +
      '"On the evidence available" is not hedging or covering yourself vaguely, it is the accurate, ' +
      'literal scope of every single claim in the paragraph above it.',
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
        'RECOVERY is the step where a system actually goes back into service after an incident, and ' +
        'recovery decisions get made under the strongest pressure of the entire response, because by ' +
        'this point the outage is visible to everybody in the organisation while the attacker, and ' +
        'whatever they left behind, is not visible to anyone. The question underneath every recovery ' +
        'option is the same one: does this plan still work even if my list of what the attacker did is ' +
        'incomplete?\n\n' +
        'That reframing is what settles the decision. You found four persistence mechanisms, meaning ' +
        'ways the attacker arranged to keep their access, on a host where somebody else held root, ' +
        'full administrative control, for roughly ninety minutes, and in that time they could have ' +
        'altered any program, background service, or shared code library on the machine. Removing the ' +
        'four things you actually found does nothing at all about the ones you did not find, and no ' +
        'amount of careful, patient checking turns "I found four" into a guarantee that "there were ' +
        'only four".\n\n' +
        'A REBUILD, replacing the machine entirely from a known-good starting image rather than ' +
        'cleaning the existing one, makes that whole question irrelevant instead of trying to answer ' +
        'it, which is exactly why it is the sound choice even though it takes longer. Rotating ' +
        'credentials (changing every password and key) is necessary no matter which recovery route you ' +
        'take, because anything readable by root while the attacker was present has to be treated as ' +
        'though the attacker now has a copy of it too.',
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
      'The restore-from-backup option is deliberately built to be defensible rather than genuinely ' +
      'sound: a competent responder could reasonably reach for it, but it comes with a real cost. It ' +
      'is a legitimate answer if you can actually show the backup predates the attacker\'s first ' +
      'access, and the same timeline that lets you argue that point also warns that you cannot be ' +
      'entirely certain 10:14 really was the first successful login. Defensible when backed by ' +
      'evidence you can point to; dangerous when reached for as a reflex.',
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
        'A host restored to exactly the same state it was in on the morning of the incident is a host ' +
        'that can be compromised the exact same way again this afternoon, by the same attacker or the ' +
        'next one who finds the same weakness. Recovery is not "back to how it was before", it is ' +
        '"back to better than it was", and the difference between the two is a short, specific list of ' +
        'changes each one directly traceable to the root cause identified earlier.\n\n' +
        'Here the root cause was unlimited password attempts against a service exposed to the ' +
        'internet, with no alerting on any of them, eventually reaching a stale account that should ' +
        'never have existed at all. So the hardening list practically writes itself: key-based ' +
        'authentication or rate limiting on SSH (limiting how many login attempts are allowed in a ' +
        'given time), an alert that actually fires on repeated failure, and the removal of accounts ' +
        'nobody can account for the existence of. Add monitoring you know genuinely works, because the ' +
        'monitoring already in place did not fire even once, all morning, while it was being tested by ' +
        'real events.\n\n' +
        'What does not belong on this list is anything not traceable to how this specific incident ' +
        'actually happened. Recovery is the exact moment when every unrelated pet project in the ' +
        'organisation tries to attach itself to the incident for funding and urgency, and a hardening ' +
        'list nobody can realistically finish just delays the restoration of service for no additional ' +
        'security benefit.',
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
      'Keep the recovery list short and causally connected to what actually happened. The fastest way ' +
      'to end up with none of it ever implemented is to make the list so long that finishing it quietly ' +
      'becomes somebody else\'s problem, indefinitely.',
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
        '"Eradicated" is a claim, and exactly like every other claim in this package, it needs actual ' +
        'evidence behind it rather than simple confidence. The evidence for it is mostly the absence of ' +
        'specific things you deliberately decided to watch for in advance, and that absence only counts ' +
        'as real evidence if you can independently show the watching itself was actually working.\n\n' +
        'Three kinds of evidence matter here. WATCHING FOR RETURN: alerting specifically on the ' +
        'indicators pulled from this incident, the account name, the key, the source address, and the ' +
        'behavioural pattern, so that a return produces a clear signal rather than passing by in ' +
        'silence. WATCHING THE ROUTE BACK IN: monitoring authentication attempts against the rebuilt ' +
        'host closely, so that a resumed brute force is visible on the very first day rather than the ' +
        'fortieth. And PROVING THE DETECTION ACTUALLY WORKS: deliberately firing a test event through ' +
        'it, because the alerting in place this morning was also completely silent through an hour of ' +
        'real failures, and nobody had ever actually confirmed beforehand that it would not be.\n\n' +
        'Give the whole exercise a defined period and a defined end. "We watched for a while and ' +
        'nothing happened" is not a finding worth writing down; "no indicator from this incident ' +
        'appeared over thirty days, on detection we had specifically verified was firing" is.',
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
      'The middle piece, actually testing that the detection fires, is the one teams skip most often. ' +
      'An untested alert and no alert at all produce exactly identical output on a quiet network, ' +
      'silence either way, and you cannot tell the two apart until the one day it actually matters and ' +
      'the silence turns out to mean the wrong thing.',
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
        'A BLAMELESS post-incident review is one that deliberately asks what allowed a mistake to ' +
        'happen, rather than who made it. Somebody created that stale account, and somebody else did ' +
        'not get around to removing it. Naming either of them in the finding achieves nothing useful ' +
        'and quietly costs you the next incident, because the next analyst who watches a colleague get ' +
        'blamed in writing for an honest mistake learns from that, and the lesson they learn is to ' +
        'raise problems later, and more quietly, next time.\n\n' +
        'The alternative to blame is not pretending nothing went wrong, it is asking why the SYSTEM ' +
        'made that particular outcome likely in the first place. The account survived 619 days because ' +
        'nothing ever reviewed dormant accounts, nothing ever flagged sudo rights sitting on an account ' +
        'that had not logged in for months, and nothing ever forced credentials that were never ' +
        'rotated to expire. Those are three specific missing controls, and each one is fixable in a way ' +
        'that "somebody should have noticed" simply is not, because nobody was ever assigned to notice.' +
        '\n\nA good finding therefore states the condition plainly, states the absent control that let ' +
        'it persist unnoticed, and proposes something specific and mechanical to fix it, without ever ' +
        'naming an individual.',
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
      'Read your answer back and check that no specific person appears in it anywhere. If one does, ' +
      'the finding becomes about them and will be read as an accusation, which is both less useful for ' +
      'actually preventing a repeat and less true than the version that names the missing control ' +
      'instead.',
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
        'Almost every incident produces a genuinely good list of recommendations at the end, and ' +
        'almost none of the items on it actually get implemented, because the list is typically written ' +
        'by people with no budget of their own, handed to people with no context on why it matters, at ' +
        'the exact moment everybody in the room most wants to stop thinking about the incident and move ' +
        'on.\n\n' +
        'Three things reliably change that. AN OWNER PER ITEM, named by person and role specifically, ' +
        'and never simply "the security team" for a piece of work the security team has no actual power ' +
        'to do, such as changing infrastructure they do not control. A DATE, because a recommendation ' +
        'with no date attached is really just a wish, and it needs to be a realistic date, because a ' +
        'list of dates nobody actually believes is worse for credibility than having no dates at all. ' +
        'And RUTHLESS PRIORITISATION: eleven recommendations are simply not all going to happen, so name ' +
        'the two or three that address the actual chain of events in this incident, and mark the rest ' +
        'explicitly as accepted or deliberately deferred, so their absence later is a recorded decision ' +
        'rather than something that just quietly drifted away.\n\n' +
        'Then track the surviving items somewhere that is genuinely reviewed on a schedule, the risk ' +
        'register or the normal engineering backlog, rather than leaving them inside the incident ' +
        'document itself. Incident documents get filed away and archived; backlogs get read, because ' +
        'people are already looking at them every week for other reasons.',
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
      'That is the actual end of this incident, and the beginning of the next one simply not ' +
      'happening. The true measure of an incident response is not how smoothly it was run on the day, ' +
      'it is whether the exact same route into the system still works again the following March.',
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
