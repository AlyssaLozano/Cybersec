/**
 * Scenario 49: Last Day.
 *
 * A systems administrator who has been told they are leaving, destroying things
 * on the way out.
 *
 * WHY THIS ONE IS DELIBERATELY OBVIOUS
 *
 * Almost every scenario on this platform teaches restraint: the finding is
 * quieter than it looks, the tidy story is planted, the confident answer is the
 * expensive one. That is correct for most incidents and it is a bad habit if it
 * is the only one a student has.
 *
 * Sometimes it is exactly what it looks like. Backups deleted, access revoked,
 * servers renamed, a format attempted, all from one trusted account at two in
 * the morning three days after a redundancy notice. There is no misdirection
 * here and looking for some wastes the only thing that matters, which is time.
 *
 * WHAT IT ACTUALLY TEACHES
 *
 * That destructive and stealthy are opposites, and the difference is diagnostic.
 * An external intruder who wants to stay wants nobody to notice; somebody
 * renaming servers wants everybody to. Reading intent off behaviour narrows the
 * question from "who is in our estate" to "which of our own people is doing
 * this", and those need completely different first moves.
 *
 * THE PART THAT IS NOT OBVIOUS
 *
 * It is a colleague, it will end in a tribunal or a prosecution, and every
 * action taken in the next hour has to survive being read out by somebody
 * hostile. That is `ev.6`, and it is the reason this is not simply a fast
 * scenario.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'last-day';

export const LAST_DAY: Scenario = {
  id: ID,
  title: 'Last Day',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 02:40 at Ardal Freight. A systems administrator account has been active since 02:00 and ' +
    'things are being deleted. This is not subtle and you do not have long.',
  roles: [
    'soc-operator',
    'log-analyst',
    'cloud-security',
    'forensics',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Administrator account signed in at 02:00 from home broadband',
      detail:
        'The account t.ashworth, a senior systems administrator, authenticated through the VPN at ' +
        '02:03 from a residential address that matches his registered home connection. He is not ' +
        'on the on-call rota this week and there is no change record open. Ninety days of history ' +
        'show him signing in between 07:40 and 18:30 on weekdays only. Rule history: fired 22 times ' +
        'in thirty days, 20 closed as out-of-hours engineering work.',
      source: 't.ashworth',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 120,
      surface: 'cloud-audit',
      summary: 'Backup vault retention lock removed and 41 restore points deleted',
      detail:
        'At 02:14 the retention lock was removed from the primary backup vault and 41 restore ' +
        'points were deleted between 02:16 and 02:31, covering the warehouse management system, the ' +
        'customs filing service and the route planner. The account holds vault administrator rights ' +
        'legitimately. Deletion is permitted for that role and required no approval.',
      source: 't.ashworth',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 260,
      surface: 'raw-log',
      summary: 'Two hundred and ten accounts removed from access groups at 02:34',
      detail:
        'Two hundred and ten user accounts were removed from the groups granting access to the ' +
        'warehouse management system and the depot terminals, in a single scripted operation at ' +
        '02:34. Nobody can sign in to those systems now. Night shift at three depots is currently ' +
        'working from paper. The removals are recorded and reversible.',
      source: 't.ashworth',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 400,
      surface: 'host-artefact',
      summary: 'Nine servers renamed with abusive strings',
      detail:
        'Nine production servers were renamed at 02:38 to strings containing abuse directed at the ' +
        'operations director by name. The renames are cosmetic and have broken two service ' +
        'references that resolve by hostname. Nothing about this action conceals anything or helps ' +
        'anybody remain on the estate.',
      source: 'multiple servers',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.5',
      atSeconds: 540,
      surface: 'process-tree',
      summary: 'A format command issued against the warehouse database volume and refused',
      detail:
        'At 02:41 a format was issued against the data volume on adf-wms-01. It failed because the ' +
        'volume is in use by the database service, which holds an exclusive lock. A second attempt ' +
        'at 02:43 also failed. The session is still open and the account still holds the rights to ' +
        'stop that service and try again.',
      source: 'adf-wms-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 680,
      surface: 'alert-queue',
      summary: 'A redundancy notice was served to this administrator on Monday',
      detail:
        'Human resources confirm a redundancy notice was served on Monday with a leaving date of ' +
        'the end of next month. Access removal was scheduled for the leaving date in line with ' +
        'normal practice. Two escalating emails from him to the operations director on Tuesday and ' +
        'Wednesday are held in the mail archive. This information came from a phone call to the HR ' +
        'director, not from any system available to this floor.',
      source: 'human resources',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 850,
      surface: 'alert-queue',
      summary: 'Scheduled patching activity on the Felixstowe depot servers tonight',
      detail:
        'Four servers at Felixstowe show reboots and service restarts between 01:00 and 02:20. ' +
        'This is the monthly patching window, documented in the change record, executed by the ' +
        'platform automation account, and all four came back healthy. Rule history: fired 24 times ' +
        'in thirty days, 24 closed as scheduled maintenance.',
      source: 'adf-fxt cluster',
      claimedSeverity: 'low',
    },
  ],
};

export const LAST_DAY_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'A senior systems administrator was served a redundancy notice on Monday, with a leaving date at the end of next month and access scheduled for removal on that date.',
    'At 02:03 on Thursday he signed in through the VPN from home, outside the on-call rota, with no change record open.',
    'At 02:14 he removed the retention lock from the backup vault and deleted 41 restore points covering warehouse management, customs filing and route planning.',
    'At 02:34 he removed 210 accounts from the groups that grant access to the warehouse system and the depot terminals, so nobody can sign in and three depots are working from paper.',
    'At 02:38 he renamed nine production servers to abuse directed at the operations director by name.',
    'At 02:41 and again at 02:43 he tried to format the warehouse database volume. Both attempts failed because the database service holds an exclusive lock.',
    'He still holds the rights to stop that service and try again, and the session is still open.',
    'Every action was permitted for his role. Nothing was exploited and nothing was hidden, because hiding was never the point.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1078.002'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'Twenty of twenty-two this month were engineers working late, and this is an engineer ' +
        'working late. Three things on the row put it above that: he is not on the on-call rota, ' +
        'there is no change record, and ninety days of history put him on weekdays between 07:40 ' +
        'and 18:30. None of those individually is much and together they mean nobody expected him ' +
        'to be there. Declare on the combination rather than waiting for something worse, because ' +
        'the next four events all happen inside forty minutes and the value of this row is entirely ' +
        'in how fast it is taken.',
      standIn:
        'Senior administrator signed in through the VPN at 02:03 from his home connection. Not on ' +
        'the rota, no change record open, and ninety days of history put him on weekdays in office ' +
        'hours. Twenty of twenty-two this month were late engineering. Declaring on this one.',
      commandOptions: [
        { command: "awk '$5==\"t.ashworth\" {print $1, $9}' /var/log/auth.log | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep ashworth /var/log/vpn/sessions.log | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status openvpn', ...STATUS_CHECK },
        { command: 'cat /var/log/auth.log', ...DUMP_ALL },
        { command: 'net user t.ashworth /domain /active:no', ...MUTATE },
      ],
      commandNudge:
        'Check whether that account normally signs in at this hour, and whether anybody expected it ' +
        'tonight.',
      guidance:
        'Somebody is working at two in the morning. Ask whether anybody was expecting them to be.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1490', 'T1485'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Forty-one restore points across the three systems the business runs on, deleted in fifteen ' +
        'minutes, with the retention lock removed first because it would otherwise have refused. ' +
        'Every step is permitted for the role and required no approval, which is the finding rather ' +
        'than an excuse: a single administrator can remove the organisation ability to recover ' +
        'without anybody agreeing to it. Killing the session is the action here and it matters more ' +
        'than understanding anything, because the deletions have stopped and only because he moved ' +
        'on to something else. A password reset is the wrong instrument: the session is already ' +
        'open and it will not close it.',
      standIn:
        'Retention lock removed at 02:14 and 41 restore points deleted by 02:31, covering warehouse ' +
        'management, customs filing and route planning. All permitted for his role, no approval ' +
        'needed. One administrator can delete our ability to recover on his own. Killing the ' +
        'session and the token now, not resetting a password.',
      commandNudge:
        'Find out what was deleted and whether the account can still delete more.',
      guidance:
        'Ask what he removed first, before he removed the backups. The order tells you it was ' +
        'planned.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1531'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reimage-now', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'Two hundred and ten accounts removed from access groups in one scripted operation, and ' +
        'the consequence is physical: three depots are working from paper right now while freight ' +
        'moves. This is the highest business impact on the board and it is also the most recoverable ' +
        'thing on it, because group membership removals are recorded and reversible. Saying both ' +
        'halves quickly is what matters, because a floor that reports only the first half will have ' +
        'operations panicking about something that can be undone in minutes. That is a mitigation ' +
        'question and it should go there immediately rather than waiting for the investigation to ' +
        'finish.',
      standIn:
        'Two hundred and ten accounts removed from the warehouse and depot terminal groups in one ' +
        'scripted operation at 02:34. Three depots are on paper right now. It is also fully ' +
        'reversible: the removals are recorded and we can put them back. Mitigation needs that now, ' +
        'not at the end.',
      commandOptions: [
        { command: "awk '/GroupRemove/ {print $1, $5, $7}' /var/log/audit/directory.log | tail -30", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c GroupRemove /var/log/audit/directory.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status wms', ...STATUS_CHECK },
        { command: 'cat /var/log/audit/directory.log', ...DUMP_ALL },
        { command: 'net group "WMS-Users" /domain /add', ...MUTATE },
      ],
      commandNudge:
        'Find out how many accounts were affected and whether the change was recorded.',
      guidance:
        'Ask what this stops people doing, and then ask whether it can be put back.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1565.001'],
      firstResponder: 'forensics',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The least damaging action on the board and the most informative. Renaming nine servers to ' +
        'abuse aimed at a named director conceals nothing, enables nothing, and helps nobody stay ' +
        'on the estate. An intruder who wants to remain wants nobody to look; this wants somebody ' +
        'to. That is the diagnostic that narrows the whole incident, and it is available at 02:38 ' +
        'to anybody who asks what an action is FOR. It is also evidence of state of mind rather ' +
        'than of access, which is why it is preserved carefully: the technical damage is two broken ' +
        'hostname references, and the value of the artefact is entirely in what it will mean to a ' +
        'tribunal.',
      standIn:
        'Nine production servers renamed at 02:38 to abuse aimed at the operations director by name. ' +
        'Two service references that resolve by hostname are broken and that is the whole technical ' +
        'damage. It hides nothing and helps nobody stay. That tells us what this is. Captured and ' +
        'sealed, because it is evidence of intent rather than of access.',
      commandNudge:
        'Ask what renaming a server actually achieves for somebody trying to stay on the estate.',
      guidance:
        'This action helps them with nothing. Ask why somebody would do it anyway.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1485'],
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.contain-scoped', 'act.isolate', 'act.check-rollback'],
      outOfLaneActions: ['act.dismiss', 'act.power-off', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The thing that has not happened yet, and the only reason it has not is that a database ' +
        'service holds a lock. Two attempts, both refused, and he still holds the rights to stop ' +
        'that service and try a third time. So the session is not a source of evidence to be ' +
        'preserved, it is an ongoing capability, and the argument for watching a little longer to ' +
        'learn more is wrong here in a way it is right almost everywhere else. Cut the session and ' +
        'the account now. Pulling the power on the server is the tempting version and it is graded ' +
        'out of lane: it would stop the format and take down the warehouse system across three ' +
        'depots, which is most of the damage he is trying to cause.',
      standIn:
        'Format issued against the warehouse database volume at 02:41 and again at 02:43. Both ' +
        'failed because the database service holds a lock, and he has the rights to stop that ' +
        'service and try again. That is the only thing standing between us and the whole volume. Cut ' +
        'the session and disable the account now. Do not pull the power on the server, that does his ' +
        'job for him.',
      commandOptions: [
        { command: 'ss -tnp | grep ESTAB | grep 10.60 && last -a | head -5', correct: true, teaches: CORRECT_STEP },
        { command: "awk '/format|mkfs/ {print $1, $6}' /var/log/audit/audit.log | tail", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status wms-db', ...STATUS_CHECK },
        { command: 'cat /var/log/audit/audit.log', ...DUMP_ALL },
        { command: 'systemctl stop wms-db', ...MUTATE },
      ],
      commandNudge:
        'Find out why the format failed and whether the reason will still hold in five minutes.',
      guidance:
        'Something stopped this working. Ask whether it will keep stopping it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'reconnaissance',
      critical: true,
      techniques: ['T1078.002'],
      firstResponder: 'ir-lead',
      alsoAppropriate: ['forensics'],
      correctActions: ['act.declare', 'act.notify-legal'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss', 'act.reimage-now'],
      escalateTo: [],
      why:
        'The context that makes sense of everything else, and the reason this scenario is not simply ' +
        'fast. A redundancy notice on Monday, access removal scheduled for a leaving date at the ' +
        'end of next month, and two escalating emails to the named director. Note where it came ' +
        'from: a phone call to the HR director, because nothing available to this floor holds it. ' +
        'A SOC that never picks up the phone will work this hour without the single most ' +
        'explanatory fact in it. Two things follow and both are this seat. Everything from here ' +
        'ends in a tribunal or a prosecution, so every action has to survive being read out by ' +
        'somebody hostile, and HR and legal belong on the call now rather than in the morning. And ' +
        'the report says what he did and when, in order, with nothing about his state of mind ' +
        'beyond the artefacts, because that is not the SOC to assert.',
      standIn:
        'Redundancy notice served Monday, leaving date end of next month, access removal scheduled ' +
        'for then. Two escalating emails to the operations director on Tuesday and Wednesday. I got ' +
        'that from a phone call to the HR director, not from anything we can query. This ends in a ' +
        'tribunal or a prosecution, so HR and legal join now, and our report says what he did and ' +
        'when and nothing about why.',
      commandNudge:
        'Some of the context you need is not in any system. Work out who to ring.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'Four servers rebooting and restarting services at Felixstowe between 01:00 and 02:20, ' +
        'overlapping the start of the real incident. It is the monthly patching window with a change ' +
        'record, executed by the platform automation account, and all four came back healthy. ' +
        'Twenty-four of twenty-four this month were the same. The check is which account and is ' +
        'there a change, and both are instant. It is here because on a night with a format command ' +
        'still being retried, minutes spent on four healthy servers are minutes not spent cutting a ' +
        'session, and the discriminator is the one that runs through the whole board: automation ' +
        'account with a change record, or a named human with neither.',
      standIn:
        'Four Felixstowe servers rebooting between 01:00 and 02:20 is the monthly patching window, ' +
        'change record exists, platform automation account, all four healthy. Twenty-four of ' +
        'twenty-four this month. Automation with a change record, not a person without one. Closing ' +
        'it.',
      commandOptions: [
        { command: "awk '$5==\"svc-platform-automation\" {print $1, $7}' /var/log/audit/audit.log | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "patch\\|maintenance" /var/log/change-management.log | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status patch-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/audit/audit.log', ...DUMP_ALL },
        { command: 'grep -c reboot /var/log/audit/audit.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check which account performed those reboots and whether a change was open for them.',
      guidance:
        'Servers restart at night all the time. Ask who told them to and whether it was a person.',
    },
  ],
};
