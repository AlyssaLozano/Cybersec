/**
 * Optional practice drills for Incident Response and Remediation.
 *
 * Same rules as everywhere: drills never gate progression, never appear in the
 * completion percentage, and never affect a pass.
 *
 * WHY ONLY THE TERMINAL MODULE HAS THEM
 *
 * A drill earns its place when repeating the same skill against a different
 * target teaches something. That is true of "find the evidence on this host":
 * there are several kinds and a student should meet more than one. It is false
 * of "write the executive brief", and it is false of the decision points, where
 * the whole value is committing once without knowing the outcome. Doing a
 * decision point twice is reading the answer key with extra steps.
 *
 * So module ir.2 carries drills and the rest do not, rather than padding every
 * exercise to a uniform five.
 *
 * EVERY DRILL HERE RUNS AS `student`, NOT ROOT.
 * The simulated host enforces real permissions, so a drill that reads another
 * user's crontab or SSH keys would fail with "Permission denied": correctly.
 * Targets are chosen accordingly, and the exercise that meets that wall meets it
 * deliberately.
 */

import type { PracticeItem } from '@soc/shared';

export const INCIDENT_RESPONSE_PRACTICE: Record<string, PracticeItem[]> = {
  'ir.2.1': [
    {
      id: 'ir.2.1-p1',
      prompt:
        'Same file, different cut: show only the account name and UID for every account, so a UID ' +
        'that does not belong is easy to spot.',
      solution: 'cut -d: -f1,3 /etc/passwd',
      checks: [
        {
          type: 'output-contains',
          text: 'sysmon:1501',
          hint:
            'Fields 1 and 3 of /etc/passwd are the name and the UID. cut can select both at once ' +
            'with a colon delimiter.',
        },
        {
          type: 'output-excludes',
          text: '/bin/bash',
          hint:
            'You are selecting more fields than you need. Only the name and the UID: fields 1 and 3.',
        },
      ],
    },
    {
      id: 'ir.2.1-p2',
      prompt:
        'Show the account name and login shell for every account, which is how you spot a service ' +
        'account that has been given an interactive shell it should not have.',
      solution: 'cut -d: -f1,7 /etc/passwd',
      checks: [
        {
          type: 'output-contains',
          text: 'svc-backup:/bin/bash',
          hint:
            'Fields 1 and 7 are the name and the shell. Note what the backup service account has.',
        },
      ],
    },
  ],

  'ir.2.2': [
    {
      id: 'ir.2.2-p1',
      prompt:
        'Different group, same technique: show the adm group line from /etc/group. Historically this ' +
        'is the group allowed to read system logs, and it is worth knowing who is in it.',
      solution: 'grep adm /etc/group',
      checks: [
        {
          type: 'output-contains',
          text: 'adm',
          hint: 'grep for the group name against /etc/group.',
        },
      ],
    },
  ],

  'ir.2.3': [
    {
      id: 'ir.2.3-p1',
      prompt:
        'cron is not only per-user. Read the system-wide crontab at /etc/crontab and check whether ' +
        'anything has been added to it as well.',
      solution: 'cat /etc/crontab',
      checks: [
        {
          type: 'output-contains',
          text: 'run-parts',
          hint: 'The system crontab is at /etc/crontab. Read it with cat.',
        },
      ],
    },
    {
      id: 'ir.2.3-p2',
      prompt:
        'List the compromised account’s home directory in long form, so you can see which files were ' +
        'written and when.',
      solution: 'ls -la /home/testuser',
      checks: [
        {
          type: 'output-contains',
          text: '.bash_history',
          hint: 'Use -a so hidden files are listed: the history file starts with a dot.',
        },
        {
          type: 'command-has-flag',
          command: 'ls',
          flags: ['l'],
          hint: 'Long form, so the timestamps are visible. That is the evidence.',
        },
      ],
    },
  ],

  'ir.2.4': [
    {
      id: 'ir.2.4-p1',
      prompt:
        'Look at the directory the archive was built from: list /var/www/portal/exports in long form ' +
        'so you can see what the attacker actually selected, and how much of it there was.',
      solution: 'ls -la /var/www/portal/exports',
      checks: [
        {
          type: 'output-contains',
          text: '.csv',
          hint: 'The exports directory holds generated CSV files. Long form shows their sizes.',
        },
      ],
    },
  ],

  'ir.2.5': [
    {
      id: 'ir.2.5-p1',
      prompt:
        'List /home in long form. Every home directory carries the time it was last written, and one ' +
        'of these was created during the intrusion window.',
      solution: 'ls -la /home',
      checks: [
        {
          type: 'output-contains',
          text: 'sysmon',
          hint: 'The backdoor account has a home directory like any other. It should be listed.',
        },
        {
          type: 'command-has-flag',
          command: 'ls',
          flags: ['l'],
          hint: 'Without long form there are no timestamps, and the timestamp is the finding.',
        },
      ],
    },
  ],
};
