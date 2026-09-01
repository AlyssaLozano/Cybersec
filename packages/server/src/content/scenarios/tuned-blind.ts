/**
 * Scenario 40: Tuned To Nothing.
 *
 * The rule that would have caught this was switched off in March by somebody
 * being helpful.
 *
 * WHAT THIS TEACHES
 *
 * That tuning is a security change, and almost nowhere treats it as one. Adding
 * an exclusion to a detection rule takes two minutes, needs no review, leaves no
 * ticket, and permanently removes a category of thing the organisation can see.
 * A code change of that consequence would go through review; a rule change of
 * that consequence goes through a text box.
 *
 * The exclusion here was reasonable when it was made. A backup service account
 * legitimately touched the paths the rule watched, it fired forty times a month
 * on that one account, and somebody excluded it so the queue would stop
 * drowning. Nobody was careless. The consequence, which nobody could see from
 * inside the change, is that the estate now has a named account that can do the
 * watched thing invisibly, and that account is exactly what an attacker wants.
 *
 * WHY IT IS A BEGINNER SCENARIO
 *
 * There is no cleverness anywhere. The intrusion is ordinary, the artefacts are
 * plain, and the whole board reads in twenty minutes. What is being built is the
 * habit of asking why a detection did not fire, rather than accepting that it
 * did not, and the recognition that a rule firing zero times is a question and
 * not an achievement.
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

const ID = 'tuned-to-nothing';

export const TUNED_TO_NOTHING: Scenario = {
  id: ID,
  title: 'Tuned To Nothing',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 13:30 at Ridgeline Medical Group. A ward manager rang the service desk because a file ' +
    'on her shared drive has a different name than it did on Friday. Nothing alerted, and there is ' +
    'a rule that should have.',
  roles: [
    'soc-operator',
    'log-analyst',
    'malware-analyst',
    'detection-engineer',
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
      summary: 'A user reports a renamed file on a clinical shared drive',
      detail:
        'A ward manager reports that a rota spreadsheet on the clinical shared drive has a different ' +
        'filename than it did on Friday and will not open. The service desk found four further ' +
        'files in the same folder with the same changed extension. No security alert has been ' +
        'raised for this drive at any point. Rule history: this arrived as a service desk ticket, ' +
        'not as a detection.',
      source: 'rmg-fs-04',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'A detection rule exists for exactly this activity and did not fire',
      detail:
        'Rule DR-0140, "mass file rename or extension change on clinical shares", has been in ' +
        'production since 2023 and covers the affected path. The activity on rmg-fs-04 matches its ' +
        'logic on every field: 340 files renamed inside eleven minutes on a monitored share. The ' +
        'rule did not fire and produced no error.',
      source: 'detection platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'alert-queue',
      summary: 'The rule was modified on 14 March to exclude a service account',
      detail:
        'DR-0140 was edited on 14 March by a SOC analyst, adding an exclusion for the account ' +
        'svc-backup-agent. The change note reads "excluding backup agent, 40 fp per month". There ' +
        'is no ticket, no review and no approver: the platform allows any analyst to edit a rule ' +
        'and does not require a second pair of eyes.',
      source: 'detection platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'process-tree',
      summary: 'The renaming ran under the excluded service account',
      detail:
        'The process that renamed the files ran as svc-backup-agent, launched from a scheduled task ' +
        'created on rmg-fs-04 at 09:12 today. The account is a genuine backup service account with ' +
        'write access to every clinical share, and it does legitimately touch those paths every ' +
        'night between 01:00 and 03:00.',
      source: 'rmg-fs-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'alert-queue',
      summary: 'The rule has fired zero times since 14 March',
      detail:
        'DR-0140 fired an average of 41 times a month between 2023 and March, of which 40 a month ' +
        'were the backup agent and one a month was something else. Since 14 March it has fired ' +
        'zero times in five months. The detection platform dashboard lists it as healthy and ' +
        'enabled. Nothing anywhere reports on rules that have stopped firing.',
      source: 'detection platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'raw-log',
      summary: 'Twenty-two other rules have exclusions added in the last year',
      detail:
        'The rule change history shows 22 other production rules with exclusions added since last ' +
        'September, by six different analysts. Eleven exclude a named account, six exclude a host, ' +
        'five exclude a path. None has a ticket, a review or a stated expiry. Four of the twenty-two ' +
        'have also fired zero times since their change.',
      source: 'detection platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 850,
      surface: 'host-artefact',
      summary: 'A staged executable and a scheduled task on the file server',
      detail:
        'A 3.4 MB packed executable was written to a temporary directory on rmg-fs-04 at 09:08 and ' +
        'a scheduled task created at 09:12 to run it under svc-backup-agent. The task has run once. ' +
        'The executable renames files and writes a text file into each affected directory. Three ' +
        'other clinical file servers hold the same executable, staged this morning, with tasks not ' +
        'yet run.',
      source: 'rmg-fs-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'A different rule produced 1,900 alerts this month',
      detail:
        'Rule DR-0311, "unusual outbound connection from a server", produced 1,900 alerts in thirty ' +
        'days, of which 1,896 were closed as the monitoring collector. It has never been tuned. ' +
        'The queue shows it as the highest volume rule in the estate. Rule history: fired 1,900 ' +
        'times in thirty days, 1,896 closed as not worth acting on.',
      source: 'detection platform',
      claimedSeverity: 'low',
    },
  ],
};

export const TUNED_TO_NOTHING_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'In 2023 a rule was written to catch mass file renames on clinical shares. It fired about 41 times a month, of which 40 were the backup service account doing its job.',
    'On 14 March an analyst excluded that account so the queue would stop drowning. The change took two minutes, needed no review, and left a one line note.',
    'It was a reasonable change on the day. What it created is an account that can rename files across every clinical share without anything noticing.',
    'The rule has fired zero times in the five months since, and the dashboard has listed it as healthy the whole time, because nothing anywhere reports on a rule that has stopped firing.',
    'This morning somebody staged an executable on four clinical file servers and created scheduled tasks to run it as that same excluded account.',
    'On rmg-fs-04 the task ran at 09:12 and renamed 340 files in eleven minutes. It matched the rule on every field and the rule ignored it.',
    'Nothing detected this. A ward manager noticed a spreadsheet would not open and rang the service desk.',
    'Twenty-two other production rules have exclusions added in the last year with no ticket, no review and no expiry, and four of those have also fired zero times since.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1486'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.power-off', 'act.isolate'],
      escalateTo: ['ir-lead', 'malware-analyst'],
      why:
        'It arrives as a service desk ticket about a spreadsheet, which is as low as an incident ' +
        'entry point gets. Renamed files that will not open, four more in the same folder, on a ' +
        'clinical share. Take it immediately and declare: renaming plus unopenable is encryption ' +
        'until somebody proves otherwise, and clinical shares are what wards run on. The detail ' +
        'worth registering for later is the last line, that no security alert has ever been raised ' +
        'for this drive. That is not the same as nothing having happened, and it is the thread the ' +
        'rest of the hour pulls.',
      standIn:
        'Ward manager rang about a rota spreadsheet that will not open and has a different name. ' +
        'Four more in the same folder with the same changed extension, clinical share. Renamed and ' +
        'unopenable is encryption until proven otherwise. Declaring. Note that no security alert ' +
        'has ever fired on this drive.',
      commandOptions: [
        { command: 'find /mnt/clinical/rota -newermt "today" -type f | head -20', correct: true, teaches: CORRECT_STEP },
        { command: 'ls -la /mnt/clinical/rota/', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status smbd', ...STATUS_CHECK },
        { command: 'cat /var/log/samba/audit.log', ...DUMP_ALL },
        { command: 'mv /mnt/clinical/rota/*.locked /tmp/', ...MUTATE },
      ],
      commandNudge:
        'Find out how many files on that share changed today, not just the ones she noticed.',
      guidance:
        'A file that will not open and has a new name is encryption until somebody shows otherwise. ' +
        'Find out how many.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1562.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.write-rule'],
      escalateTo: ['detection-engineer', 'ir-lead'],
      why:
        'The question that turns a small ransomware incident into the finding this scenario is ' +
        'about, and it is one nobody asks: not why did nothing catch this, but is there something ' +
        'that should have. There is. DR-0140 has been in production since 2023, covers the path, ' +
        'and the activity matches its logic on every field, 340 renames in eleven minutes on a ' +
        'monitored share. It did not fire and it did not error. A rule that is present, correct and ' +
        'silent is a much worse problem than no rule at all, because the organisation has been ' +
        'counting on it for five months.',
      standIn:
        'DR-0140 covers exactly this: mass file rename on clinical shares, in production since 2023. ' +
        'What happened on rmg-fs-04 matches its logic on every field, 340 renames in eleven minutes ' +
        'on a monitored share. It did not fire and it did not error. There is a rule for this and it ' +
        'stayed quiet.',
      commandOptions: [
        { command: 'grep -A8 "DR-0140" /etc/detection/rules.yaml', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "rename\\|extension" /etc/detection/rules.yaml | head', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /etc/detection/rules.yaml', ...DUMP_ALL },
        { command: 'grep -c rule /etc/detection/rules.yaml', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether a rule exists that covers this activity, before asking why nothing fired.',
      guidance:
        'Nothing alerted. Ask whether that is because no rule exists, or because one exists and ' +
        'stayed quiet.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1562.001'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.isolate', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Why it stayed quiet, and the answer is a colleague being helpful in March. An exclusion for ' +
        'svc-backup-agent, one line of note reading "excluding backup agent, 40 fp per month", no ' +
        'ticket, no review, no approver. It was a defensible change: the account genuinely did that ' +
        'thing forty times a month and the queue genuinely was drowning. Nobody could see from ' +
        'inside the edit that they were creating a named account which can rename files across ' +
        'every clinical share invisibly. The finding for the report is the platform rather than the ' +
        'analyst: any analyst can edit a production rule with no second pair of eyes, and a change ' +
        'with this consequence would never be allowed near code without one.',
      standIn:
        'DR-0140 was edited on 14 March to exclude svc-backup-agent. Note says excluding backup ' +
        'agent, 40 false positives a month. No ticket, no review, no approver, because the platform ' +
        'lets any analyst edit a production rule. It was a reasonable change on the day and it ' +
        'created an account that can rename anything on a clinical share invisibly.',
      commandOptions: [
        { command: 'git -C /etc/detection log -p --follow rules.yaml | grep -B6 -A6 "DR-0140"', correct: true, teaches: CORRECT_STEP },
        { command: "awk '/DR-0140/ {print $1, $3, $6}' /var/log/detection/rule-changes.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/rule-changes.log', ...DUMP_ALL },
        { command: 'grep -c DR-0140 /var/log/detection/rule-changes.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at the change history for that rule and find out what was altered and when.',
      guidance:
        'The rule is enabled and it did not fire. Ask what has changed about it since it was ' +
        'written.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1078.003', 'T1053.005'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['log-analyst', 'forensics'],
      correctActions: ['act.decode'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.reset-password', 'act.isolate'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The join, and it is the sentence that makes the whole thing one story. The renaming ran as ' +
        'svc-backup-agent, which is the account the exclusion names. Whether that was chosen ' +
        'deliberately or was simply the most convenient account on a file server is not knowable ' +
        'from here and should not be asserted either way. What is knowable is the effect: running ' +
        'as that account meant the one rule covering this activity was guaranteed not to fire. The ' +
        'account is genuine, has write access to every clinical share, and legitimately touches ' +
        'those paths nightly, which is exactly why it was excluded and exactly why it is useful.',
      standIn:
        'The renaming ran as svc-backup-agent, which is the account named in the exclusion, from a ' +
        'scheduled task created on the box at 09:12. I cannot tell you whether they picked it ' +
        'because of the exclusion or because it was the obvious account on a file server. The ' +
        'effect is the same: the one rule for this was guaranteed not to fire.',
      commandOptions: [
        { command: "awk '$4==\"svc-backup-agent\" {print $1, $6}' /var/log/audit/process.log | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'schtasks /query /fo LIST /v | grep -B3 -A6 backup-agent', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status smbd', ...STATUS_CHECK },
        { command: 'cat /var/log/audit/process.log', ...DUMP_ALL },
        { command: 'net user svc-backup-agent /domain /active:no', ...MUTATE },
      ],
      commandNudge:
        'Find out which account the renaming process ran as.',
      guidance:
        'Ask what account did this, then compare it against the exclusion you just found.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562.001'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.backtest', 'act.propose-rule'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.write-rule'],
      escalateTo: ['ir-lead'],
      why:
        'The number that should have raised this five months ago. Forty-one firings a month for two ' +
        'years, then zero for five months, with the dashboard reporting the rule as healthy and ' +
        'enabled throughout. Healthy means the rule is running, not that it is working, and nothing ' +
        'anywhere reports on a rule that has stopped firing, because monitoring is built to notice ' +
        'things happening rather than things ceasing. The arithmetic in the row is the useful part ' +
        'too: forty a month were the backup agent and one a month was something else, so the ' +
        'exclusion did not remove noise from a useless rule, it removed the noise and the twelve ' +
        'genuine findings a year along with it.',
      standIn:
        'DR-0140 fired 41 times a month for two years and zero times in the five months since the ' +
        'change. The dashboard has said healthy the whole time, which means running, not working. ' +
        'Forty a month were the backup agent and one a month was something real, so we did not ' +
        'remove noise from a useless rule. We removed twelve genuine findings a year.',
      commandOptions: [
        { command: "awk '$3==\"DR-0140\" {print $1}' /var/log/detection/firings.log | cut -d- -f1-2 | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c DR-0140 /var/log/detection/firings.log', ...COUNT_ONLY },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/firings.log', ...DUMP_ALL },
        { command: 'curl -s http://detection.local/api/rules/DR-0140/health', ...WRONG_TARGET },
      ],
      commandNudge:
        'Plot how often that rule fired per month before and after the change.',
      guidance:
        'A rule that fires zero times is a question, not an achievement. Ask what it was doing ' +
        'before.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1562.001'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.isolate', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The scope, and it is the reason this seat is here rather than log analysis. Twenty-two ' +
        'production rules with exclusions added since September by six different analysts, none ' +
        'with a ticket, a review or a stated expiry, and four of them also firing zero times since. ' +
        'Those four are the immediate work: each is a rule the organisation believes it has and ' +
        'does not. The broader finding is that the estate has no idea what it can no longer see, ' +
        'because exclusions accumulate silently and nothing ever reviews them. Two proposals come ' +
        'out of this and they are different in kind: a report on rules whose firing rate has ' +
        'collapsed, which is cheap and catches the next one, and an expiry on every exclusion so ' +
        'they have to be re-argued rather than inherited.',
      standIn:
        'Twenty-two other production rules have exclusions added since September, six different ' +
        'analysts, no tickets, no reviews, no expiry dates. Four of them have also fired zero times ' +
        'since. Those four are rules we think we have and do not. We do not know what we can no ' +
        'longer see. I want a report on rules whose firing rate collapses, and an expiry date on ' +
        'every exclusion so somebody has to re-argue it.',
      commandOptions: [
        { command: "awk '/EXCLUSION_ADDED/ {print $1, $3, $5}' /var/log/detection/rule-changes.log", correct: true, teaches: CORRECT_STEP },
        { command: 'git -C /etc/detection log --since="1 year ago" --oneline -- rules.yaml | wc -l', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/rule-changes.log', ...DUMP_ALL },
        { command: 'grep -c EXCLUSION /var/log/detection/rule-changes.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find every rule that has had an exclusion added in the last year and check what happened to ' +
        'its firing rate.',
      guidance:
        'One rule was tuned blind. Ask how many others were, and whether anybody would know.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1486', 'T1053.005'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The thing that stops this being an interesting story about rule hygiene and makes it an ' +
        'incident with a clock. Three other clinical file servers hold the same executable, staged ' +
        'this morning, with scheduled tasks created and not yet run. One has fired; three have not. ' +
        'Everything the floor does for the rest of the hour should be about those three, and the ' +
        'sequencing matters: the tasks come off first because they are what runs the payload, and ' +
        'the executable is preserved before it is removed because it is the evidence. Getting to ' +
        'the three unrun servers is worth more than every other finding on this board combined.',
      standIn:
        'A 3.4 MB packed executable staged on rmg-fs-04 at 09:08 and a task created at 09:12 to run ' +
        'it as the backup account. It has run once. Three other clinical file servers have the same ' +
        'executable staged this morning with tasks that have not run yet. Preserve a copy, then ' +
        'remove those three tasks. That is the whole rest of the hour.',
      commandOptions: [
        { command: 'schtasks /query /fo LIST /v /s rmg-fs-05 | grep -B3 -A6 backup-agent', correct: true, teaches: CORRECT_STEP },
        { command: 'find /tmp /var/tmp -newermt "09:00" -size +1M -type f -ls', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status smbd', ...STATUS_CHECK },
        { command: 'cat /var/log/audit/audit.log', ...DUMP_ALL },
        { command: 'rm -f /var/tmp/svcupd.exe', ...MUTATE },
      ],
      commandNudge:
        'Check whether the same thing has been staged anywhere else, and whether it has run there.',
      guidance:
        'Ask whether this happened anywhere else, and whether it has finished happening.',
    },
    {
      eventId: 'ev.8',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['detection-engineer'],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: ['detection-engineer'],
      why:
        'The counterweight, and it is here so the floor does not walk away with the wrong lesson. ' +
        'DR-0311 produces 1,900 alerts a month and 1,896 of them are the monitoring collector. It ' +
        'has never been tuned and it should be, because a rule nobody can read is a rule nobody is ' +
        'reading. Today is a bad day to argue that tuning is dangerous: it is not, untracked tuning ' +
        'is. The correct answer here is to raise a tuning ticket, which is exactly what the March ' +
        'analyst did not have available, and the difference between this and DR-0140 is a record ' +
        'somebody can review rather than an edit somebody made.',
      standIn:
        'DR-0311 fires 1,900 times a month and 1,896 are the monitoring collector. It has never been ' +
        'tuned and it needs to be. Today does not make tuning wrong, it makes untracked tuning ' +
        'wrong. Raising a ticket for it, which is the bit that was missing in March.',
      commandOptions: [
        { command: "awk '$3==\"DR-0311\" {print $6}' /var/log/detection/firings.log | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c DR-0311 /var/log/detection/firings.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/firings.log', ...DUMP_ALL },
        { command: 'sed -i "/DR-0311/d" /etc/detection/rules.yaml', ...MUTATE },
      ],
      commandNudge:
        'Check what is producing the volume on that rule before deciding what to do about it.',
      guidance:
        'This one genuinely is too noisy. Ask what makes fixing it different from what happened in ' +
        'March.',
    },
  ],
};
