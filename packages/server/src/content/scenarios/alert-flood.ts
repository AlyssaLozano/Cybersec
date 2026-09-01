/**
 * Scenario 20: Cry Wolf.
 *
 * Eleven thousand alerts in one shift, and one of them matters.
 *
 * WHAT THIS TEACHES
 *
 * That alert fatigue is not a personal failing and cannot be solved by trying
 * harder. Nobody reads eleven thousand alerts. The floor either finds a way to
 * make the volume smaller, or it works whatever happens to be on the first page,
 * and the second option is what most floors do while believing they are doing
 * the first.
 *
 * The method that works is subtraction, and it is the opposite of the usual
 * instinct. Rather than looking for the interesting alert among eleven thousand,
 * the floor identifies the small number of causes producing almost all of the
 * volume and removes them, which is a handful of decisions rather than eleven
 * thousand. What is left is small enough for a person.
 *
 * WHY THE FLOOD IS NOT AN ATTACK
 *
 * At expert difficulty `ridgeline` has an attacker generating noise on purpose.
 * Here nobody did. The flood is four ordinary operational causes landing in the
 * same window: a certificate expiry, a misconfigured scanner, a threshold nobody
 * revisited, and a rule that was never tuned after a migration. That is more
 * common and more instructive than sabotage, because it is the normal condition
 * of most security operations centres.
 *
 * THE COST OF GETTING IT WRONG BOTH WAYS
 *
 * A floor that escalates too much drowns. A floor that bulk-closes to survive
 * closes the one that mattered along with the rest, and `ev.6` is where that is
 * scored: the correct action is not to dismiss the class, it is to remove the
 * causes so the class becomes readable.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';

const ID = 'cry-wolf';

export const CRY_WOLF: Scenario = {
  id: ID,
  title: 'Cry Wolf',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 06:00 and the overnight queue has 11,400 unworked alerts against a normal 600. Two ' +
    'people are on. You are not going to read them all, and one of them is real. Decide how you ' +
    'are going to approach this before you open anything.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'detection-engineer',
    'fusion-analyst',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Overnight queue at 11,400 alerts against a nightly average of 600',
      detail:
        'The queue holds 11,400 unworked alerts from the last twelve hours. Grouping by rule shows ' +
        'four rules producing 10,970 of them and 340 other rules producing the remaining 430. No ' +
        'rule is broken: all four are firing correctly on things that are genuinely happening. Two ' +
        'analysts are on shift.',
      source: 'alert queue',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 130,
      surface: 'alert-queue',
      summary: 'An expired certificate is generating 4,100 TLS validation alerts an hour',
      detail:
        'An internal service certificate expired at 23:00. Every client that connects to it raises ' +
        'a TLS validation alert, and 61 services connect to it on a loop. The certificate renewal ' +
        'is a known task that missed its window. Every one of the 4,100 alerts is correct and ' +
        'describes the same single fact.',
      source: 'internal PKI',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 290,
      surface: 'network-flow',
      summary: 'An authenticated vulnerability scan is generating 3,900 alerts',
      detail:
        'The monthly authenticated vulnerability scan started at 22:00 and is scanning 2,100 hosts. ' +
        'It generates port scan, unusual authentication and service enumeration alerts as it goes. ' +
        'The scanner source address is documented in a suppression list that was not migrated when ' +
        'the platform moved in June. The scan is legitimate and scheduled.',
      source: 'vulnerability scanner',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 440,
      surface: 'raw-log',
      summary: 'A backup window threshold rule firing 2,600 times',
      detail:
        'A rule alerting on transfers above 500 MB fires on every file the nightly backup moves. ' +
        'The threshold was set in 2021 when the backup ran differently. It has fired between 2,400 ' +
        'and 2,800 times every night for four months and every instance has been closed. Nobody has ' +
        'raised a tuning ticket.',
      source: 'backup service',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.5',
      atSeconds: 590,
      surface: 'cloud-audit',
      summary: 'A permissions rule firing 370 times after a role restructure',
      detail:
        'A rule alerting on role assignment changes has fired 370 times since a documented identity ' +
        'restructure began at 21:00, executed by the platform team under an approved change. Each ' +
        'alert corresponds to one real role assignment. The change record lists 374 planned ' +
        'assignments.',
      source: 'identity platform',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 740,
      surface: 'alert-queue',
      summary: 'Four alerts on the same account that do not belong to any of the four causes',
      detail:
        'Filtering out the four high-volume rules leaves 430 alerts. Four of them concern the ' +
        'account r.kowalczyk: an impossible travel alert at 01:12, a first-time cloud console ' +
        'sign-in at 01:19, a mailbox rule creation at 01:24, and a permission grant at 01:31. ' +
        'Each is a different rule and none is in the top four. Individually all four are common.',
      source: 'r.kowalczyk',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'host-artefact',
      summary: 'The permission grant at 01:31 added the account to a group with mailbox export rights',
      detail:
        'The 01:31 grant added r.kowalczyk to a group holding organisation-wide mailbox export ' +
        'permissions. That group has eleven other members, all in the legal and compliance teams. ' +
        'The grant occurred during the identity restructure window and is not on the change record ' +
        'list of 374 planned assignments.',
      source: 'identity platform',
      claimedSeverity: 'high',
    },
  ],
};

export const CRY_WOLF_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Four ordinary operational causes produced 10,970 of the 11,400 overnight alerts, and none of them is an attack.',
    'A certificate expired at 23:00 and 61 services raise a validation alert every time they reconnect.',
    'The monthly authenticated vulnerability scan runs from an address whose suppression entry was lost in the June platform migration.',
    'A 500 MB threshold set in 2021 fires on every file the backup moves, and has done nightly for four months.',
    'A documented identity restructure produced 370 legitimate role assignment alerts.',
    'Somebody used that restructure window as cover. Four alerts on one account, each from a different rule and none in the top four, describe a compromise: impossible travel, a first console sign-in, a mailbox rule, and a permission grant.',
    'The grant put that account in a group with organisation-wide mailbox export rights, and it is not on the change record list of 374 planned assignments.',
    'Nobody hid anything. It was buried by ordinary noise nobody had got round to removing, which is how most of these are missed.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'detection-engineer'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'The most useful thing on this row is the grouping: four rules account for 10,970 of 11,400 ' +
        'and 340 rules produce the other 430. That turns an unreadable queue into four decisions ' +
        'plus a queue of 430, which two people can genuinely work. It is graded as a benign true ' +
        'positive because the volume is real and correctly reported, and the right response is to ' +
        'raise it as a floor-level problem rather than to start opening alerts. A floor that begins ' +
        'at the top of the list and works down will spend the shift on certificate warnings. Group ' +
        'first, then subtract, then read what is left.',
      standIn:
        '11,400 overnight against a normal 600, and four rules account for 10,970 of them. That ' +
        'leaves 430 across 340 rules. I am not reading eleven thousand alerts. I am going to ' +
        'account for the four causes and work what is left.',
      commandOptions: [
        "awk '{print $4}' /var/log/queue/alerts.log | sort | uniq -c | sort -rn | head",
        'grep -c . /var/log/queue/alerts.log',
        'tail -100 /var/log/queue/alerts.log',
        'cat /var/log/queue/nightly-summary.json',
        'systemctl status alert-pipeline',
      ],
      commandNudge:
        'Group the queue by rule before you open anything, and see how the volume distributes.',
      guidance:
        'You cannot read them all. Ask how few causes account for how much of the volume.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['detection-engineer'],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: ['detection-engineer'],
      why:
        'Four thousand one hundred correct alerts describing one fact, which is that a certificate ' +
        'expired at 23:00 and 61 services keep reconnecting to it. Nothing is wrong with the ' +
        'detection and nothing is wrong with the alerts. What is wrong is that the system reports ' +
        'one condition 4,100 times instead of once, and that design decision is the finding. ' +
        'Accounting for it takes one lookup and removes 36 percent of the queue, which is a better ' +
        'use of five minutes than anything else available at this point in the shift.',
      standIn:
        'The certificate on that internal service expired at 23:00 and 61 clients raise a ' +
        'validation alert every reconnect. 4,100 alerts, all correct, all the same fact. Renewal ' +
        'missed its window. Accounting for the whole class and getting the certificate renewed.',
      commandOptions: [
        'openssl s_client -connect internal-svc:443 2>/dev/null | openssl x509 -noout -dates',
        "awk '/TLS validation/ {print $6}' /var/log/queue/alerts.log | sort -u | wc -l",
        'grep -c "TLS validation" /var/log/queue/alerts.log',
        'cat /var/log/pki/renewal-schedule.txt',
        'systemctl status internal-svc',
      ],
      commandNudge:
        'Find out how many distinct facts those four thousand alerts actually describe.',
      guidance:
        'Ask whether these are four thousand problems or one problem reported four thousand times.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['soc-operator', 'detection-engineer'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.contact-attacker'],
      escalateTo: ['detection-engineer'],
      why:
        'Three thousand nine hundred alerts from our own scanner doing its scheduled monthly job, ' +
        'and the cause is small and specific: the suppression entry for its source address was not ' +
        'migrated when the platform moved in June. That is worth stating precisely rather than as ' +
        '"scanner noise", because a lost suppression entry is a fixable configuration error with a ' +
        'date attached, and the same migration probably lost others. The verification is one check ' +
        'of the source address against the scanner inventory, and doing it matters: an attacker ' +
        'scanning from inside would look almost identical on the queue.',
      standIn:
        'Three thousand nine hundred of these are our own authenticated vulnerability scan, ' +
        'scheduled, running since 22:00 across 2,100 hosts. Its suppression entry was lost in the ' +
        'June platform migration. Source address matches the scanner inventory. Accounting for the ' +
        'class and getting the suppression restored.',
      commandOptions: [
        "awk '/port scan/ {print $3}' /var/log/queue/alerts.log | sort | uniq -c | sort -rn | head",
        'cat /etc/scanner/inventory.txt',
        'grep -c 10.20.4.11 /var/log/queue/alerts.log',
        'cat /etc/siem/suppressions.conf | grep -i scan',
        'systemctl status vuln-scanner',
      ],
      commandNudge:
        'Check whether that source address belongs to something of ours before dismissing it.',
      guidance:
        'Confirm it is our scanner rather than assuming. An intruder scanning from inside looks the ' +
        'same on this queue.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: ['ir-lead'],
      why:
        'The clearest case for tuning in the whole set and the one that shows why nobody does it. ' +
        'A 500 MB threshold set in 2021 for a backup that no longer runs that way, firing 2,400 to ' +
        '2,800 times a night for four months, every instance closed, and not one tuning ticket ' +
        'raised. That is roughly 300,000 closures nobody thought worth fixing, because closing an ' +
        'alert takes two seconds and raising a ticket takes ten minutes. Backtesting is what makes ' +
        'the fix safe rather than a guess: a threshold moved without replaying it against thirty ' +
        'days is how a floor stops seeing something that mattered.',
      standIn:
        'A 500 MB transfer threshold set in 2021 fires on every file the backup moves. Two and a ' +
        'half thousand a night for four months, every one closed, and no tuning ticket in that ' +
        'whole time. I want to raise the threshold and scope it to the backup account, and I will ' +
        'backtest it over thirty days before it ships.',
      commandNudge:
        'Check how long this rule has been firing this way and whether anybody ever raised a ticket.',
      guidance:
        'Ask why nobody has fixed this. The answer is usually that closing is cheaper than fixing, ' +
        'which is how a floor ends up here.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['soc-operator', 'fusion-analyst'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.revoke-key'],
      escalateTo: ['fusion-analyst', 'ir-lead'],
      why:
        'Three hundred and seventy real role assignments from a documented restructure with an ' +
        'approved change record. Every other high-volume cause tonight can be accounted for with a ' +
        'single check; this one cannot, and the difference matters. The change record lists 374 ' +
        'planned assignments and 370 fired, so the correct action is to reconcile the two lists ' +
        'rather than close the class. Reconciling is what finds ev.7. A floor that dismisses this ' +
        'because it has a change ticket has done the reasonable thing and missed the incident, and ' +
        'that is exactly why an attacker chose this window.',
      standIn:
        '370 role assignment alerts from the identity restructure that started at 21:00 under an ' +
        'approved change. The change record lists 374 planned. Those numbers are close and not the ' +
        'same, so I am reconciling what fired against what was planned rather than closing the ' +
        'class.',
      commandNudge:
        'Compare the assignments that actually happened against the ones the change record lists.',
      guidance:
        'A change ticket explains most of these. Ask whether it explains ALL of them.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1078.004', 'T1564.008'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The real incident, and the reason it survives is that it is spread across four different ' +
        'rules and none of them is in the top four. Impossible travel, a first-time console ' +
        'sign-in, a mailbox rule and a permission grant are each common enough to close ' +
        'individually, and on any ordinary night four of them on one account inside nineteen ' +
        'minutes would be obvious. Tonight they are four rows in a queue of 11,400. Nobody hid ' +
        'this: it was buried by noise the floor had not got round to removing, which is how most ' +
        'real ones are missed. The method that finds it is pivoting on the ACCOUNT rather than ' +
        'reading down the rule, and that is only possible once the four causes have been ' +
        'subtracted.',
      standIn:
        'After taking out the four big causes there are 430 left, and four of them are the same ' +
        'account inside nineteen minutes: impossible travel at 01:12, first cloud console sign-in ' +
        'at 01:19, mailbox rule at 01:24, permission grant at 01:31. Four different rules, none in ' +
        'the top four. That is a compromise.',
      commandOptions: [
        "awk '$6==\"r.kowalczyk\" {print $1, $4}' /var/log/queue/alerts.log",
        "awk '{print $6}' /var/log/queue/alerts.log | sort | uniq -c | sort -rn | head -20",
        'grep kowalczyk /var/log/auth.log',
        'grep -c kowalczyk /var/log/queue/alerts.log',
        'last | grep kowalczyk',
      ],
      commandNudge:
        'Once the big causes are removed, group what is left by account rather than by rule.',
      guidance:
        'Stop reading down the queue. Ask whether any single account appears more than once in what ' +
        'is left.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      techniques: ['T1098.003', 'T1114.002'],
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reset-password', 'act.reimage-now', 'act.dismiss', 'act.power-off'],
      escalateTo: ['ir-lead'],
      why:
        'What they were actually after, and the sentence that settles it is that the grant is not ' +
        'on the change record list of 374. That is the difference between a legitimate restructure ' +
        'assignment and one riding on top of it, and it is a document comparison rather than a ' +
        'technical finding, which is worth noticing: the most important check tonight is reading a ' +
        'change record carefully. The group holds organisation-wide mailbox export rights and its ' +
        'other eleven members are all legal and compliance, so this account can now export any ' +
        'mailbox in the organisation. Timing it inside an approved change window is the clever ' +
        'part, because it means the alert fires into a class everybody has already agreed to ' +
        'expect.',
      standIn:
        'The 01:31 grant put that account into a group with organisation-wide mailbox export ' +
        'rights. Eleven other members, all legal and compliance. It is not on the change record ' +
        'list of 374 planned assignments. It was timed inside the approved window so it would land ' +
        'in a class we had already agreed to expect. Preserved and sealed.',
      commandNudge:
        'Check that grant against the list of assignments the change record actually authorised.',
      guidance:
        'Ask what that permission lets the account do, and whether anybody approved this particular ' +
        'grant.',
    },
  ],
};
