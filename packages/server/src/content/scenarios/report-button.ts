/**
 * Scenario 85: Forty People Told Us.
 *
 * The report button worked. Everything downstream of it did not.
 *
 * WHAT THIS TEACHES
 *
 * That staff reporting is a detection source, and that the number everybody
 * measures about it is the wrong one. Ridgeline reports forty-one submissions
 * as a success. The useful figure is the gap between the first report and the
 * first action, which was fifty-one minutes, and during it thirty-nine more
 * people reported the same message and four people entered credentials.
 *
 * The queue is the failure, not the button. Nothing on the board is a clever
 * attack: the phishing message is ordinary, the page is ordinary, and the
 * technique that mattered was sending it at 07:40 on a Monday. What went wrong
 * is that reports land in a mailbox that one person opens when they get in,
 * duplicates are not grouped, and the person who reported it first got the
 * same automated thank-you as the person who reported it fortieth.
 *
 * WHY BEGINNER
 *
 * Every fact is on the board and none of them is technical. The skill being
 * built is reading a queue as a clock: when did we first know, when did we
 * first act, and what happened in between. That question transfers to every
 * alert an operator will ever pick up.
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

const ID = 'forty-people-told-us';

export const FORTY_PEOPLE_TOLD_US: Scenario = {
  id: ID,
  title: 'Forty People Told Us',
  difficulty: 'beginner',
  durationMinutes: 50,
  situation:
    'It is 09:05 on a Monday at Ridgeline Medical. Forty-one people have reported the same email ' +
    'since twenty to eight, and nobody has looked at any of them yet.',
  roles: [
    'soc-operator',
    'log-analyst',
    'threat-intel',
    'detection-engineer',
    'cloud-security',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Forty-one reports of the same message, none of them read',
      detail:
        'The phishing report mailbox holds 41 submissions received between 07:42 and 09:03, all ' +
        'carrying the same attached message: a rota change notice appearing to come from the ' +
        'staffing office, with a link to review a shift swap. The mailbox has no rules and no ' +
        'grouping. It is opened by the security officer when they arrive, which today was 09:05.',
      source: 'phishing report mailbox',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'raw-log',
      summary: 'The first report was fifty-one minutes before the gateway noticed',
      detail:
        'The earliest submission is 07:42, from a healthcare assistant on an early shift. The mail ' +
        'gateway raised its own alert on the campaign at 08:33, after its supplier updated a ' +
        'reputation feed. So a member of staff identified this fifty-one minutes before any ' +
        'security product did, and the report sat unread for eighty-three minutes.',
      source: 'mail gateway',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 330,
      surface: 'cloud-audit',
      summary: 'Four people entered credentials, and three did so after the first report',
      detail:
        'The identity platform shows four Ridgeline accounts authenticating to the portal from ' +
        '203.0.113.121 between 07:51 and 08:58. One is at 07:51, nine minutes after the first ' +
        'report. The other three are at 08:20, 08:44 and 08:58, which is 38, 62 and 76 minutes ' +
        'after somebody told us.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 500,
      surface: 'raw-log',
      summary: 'Everybody who reported got the same reply',
      detail:
        'The mailbox sends an automatic acknowledgement: "Thank you. Our team reviews every report." ' +
        'The healthcare assistant who reported at 07:42 received it, and so did the fortieth person ' +
        'at 09:01. Nobody who reported was told the message was in fact malicious, and nobody who ' +
        'received the message and did not report it was told anything at all.',
      source: 'phishing report mailbox',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 670,
      surface: 'host-artefact',
      summary: 'The message and the page are entirely ordinary',
      detail:
        'The message has no attachment, no macro and no exploit. It is plain text with a link to ' +
        'ridgeline-rota.example, registered nine days ago, serving a copy of the Ridgeline portal ' +
        'sign-in page. There is nothing to reverse engineer and nothing novel in it. What it had ' +
        'was a subject line about a shift change, sent at 07:40 on a Monday to a rota-driven ' +
        'workforce.',
      source: 'ridgeline-rota.example',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 840,
      surface: 'alert-queue',
      summary: 'A second batch of reports that is not this campaign',
      detail:
        'Six of the 41 submissions are unrelated. Four are the monthly payroll notice, which is ' +
        'genuine and is reported every month by the same two people. One is a recruitment agency ' +
        'approach, which is unwanted rather than malicious. One is a colleague forwarding a joke, ' +
        'submitted to the wrong mailbox.',
      source: 'phishing report mailbox',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 1010,
      surface: 'alert-queue',
      summary: 'What can be done, and in what order',
      detail:
        'The four affected accounts can have sessions revoked and passwords reset in minutes. The ' +
        'domain can be blocked at the proxy in minutes. Removing the message from 900 mailboxes ' +
        'takes a mail administrator about twenty minutes and there is one on shift. Writing to ' +
        'everybody who reported takes an hour of somebody time and nothing technical.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1180,
      surface: 'alert-queue',
      summary: 'The report rate is being reported as the achievement',
      detail:
        'The security awareness dashboard shows report volume by month and is up 60 per cent since ' +
        'the training refresh in June. It does not show how long a report waits, whether anybody ' +
        'answered it, or whether the reported message was still in other mailboxes an hour later. ' +
        'The 60 per cent figure is in the board pack for Thursday.',
      source: 'awareness dashboard',
      claimedSeverity: 'high',
    },
  ],
};

export const FORTY_PEOPLE_TOLD_US_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 07:40 on Monday an ordinary phishing message reached about 900 Ridgeline mailboxes: plain text, no attachment, a link to a nine-day-old domain serving a copy of the portal sign-in page. Nothing about it is technically interesting. It was sent at twenty to eight on a Monday to a workforce that lives by the rota, with a subject line about a shift change.',
    'At 07:42, two minutes later, a healthcare assistant on an early shift reported it. That is fifty-one minutes before the mail gateway raised anything, and the gateway only did so because a supplier updated a reputation feed. The first and best detection Ridgeline had was a person.',
    'The report went to a mailbox with no rules, no grouping and no rota, opened by the security officer when they arrive. Today that was 09:05, eighty-three minutes after the first report and one hundred and twenty-one minutes after the message landed.',
    'Forty more people reported the same message in that window, and all forty-one received the same automatic acknowledgement, which promised review and delivered none. Nobody was told the message was real.',
    'Four people entered credentials at 07:51, 08:20, 08:44 and 08:58. Three of those four did so after somebody had already reported the message, and the last was seventy-six minutes after the first report. Every one of them was preventable by an action that takes minutes.',
    'Six of the 41 submissions are not this campaign at all: four are the genuine payroll notice, reported every month by the same two people, one is a recruitment approach, one is a forwarded joke. That mix is normal and is not a training failure.',
    'Everything remediable is cheap. Sessions and passwords for four accounts, a proxy block, twenty minutes of a mail administrator to pull the message from 900 mailboxes, and an hour of somebody writing back to the people who reported.',
    'The awareness dashboard reports volume, which is up 60 per cent, and does not report how long a report waits or whether anybody answered it. That figure goes in the board pack on Thursday as a success.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1566.002'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'Forty-one people reporting the same message is not forty-one alerts, it is one campaign ' +
        'with forty-one witnesses, and the first useful move is to treat it as one thing rather ' +
        'than work down a list. Raise it high on the count alone: whatever the message turns out to ' +
        'be, forty-one people in one morning means it reached a great many mailboxes, and the ' +
        'question of how many is already more urgent than the question of what it is. Note what the ' +
        'mailbox is, because it is the finding rather than the container: no rules, no grouping, ' +
        'and opened when somebody arrives. A detection source that only reports when a person walks ' +
        'through the door has an availability schedule, and nobody wrote it down.',
      standIn:
        'Forty-one reports of one message. That is one campaign with forty-one witnesses, not ' +
        'forty-one alerts, and I am not working down a list. Raising it high on the count alone, ' +
        'because forty-one people in a morning means this hit a lot of mailboxes and how many ' +
        'matters more right now than what it is. And look at the mailbox: no rules, no grouping, ' +
        'opened when somebody gets in. That is a detection source with an availability schedule ' +
        'nobody has written down.',
      commandOptions: [
        { command: "awk -F, '{print $2}' /evidence/reports/submissions.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: "cut -d, -f1 /evidence/reports/submissions.csv | sort | head -3", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dovecot', ...STATUS_CHECK },
        { command: 'cat /evidence/reports/submissions.csv', ...DUMP_ALL },
        { command: 'wc -l /evidence/reports/submissions.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Group the submissions by which message they carry before reading any of them.',
      guidance:
        'Forty-one reports. Ask how many different messages that is.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1566.002'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['ir-lead'],
      why:
        'A healthcare assistant beat every security product in the building by fifty-one minutes, ' +
        'and the gateway only caught up because a supplier updated a feed, which is somebody else ' +
        'detection arriving late rather than ours arriving at all. Say that plainly, because the ' +
        'room instinct will be to ask what the gateway missed and the more useful question is what ' +
        'the person saw. Then put the two numbers together, which is where this stops being a ' +
        'pleasant story: first report 07:42, first human eye 09:05, eighty-three minutes. Time to ' +
        'detect was two minutes and time to respond was eighty-three, and the second number is the ' +
        'one the incident is made of. A detection nobody reads is not a detection, it is a record ' +
        'that will be embarrassing later.',
      standIn:
        'A healthcare assistant beat every product we own by fifty-one minutes, and the gateway only ' +
        'caught up when a supplier updated a feed, which is somebody else detection arriving late. ' +
        'The question is not what the gateway missed, it is what she saw. Now the two numbers ' +
        'together: first report 07:42, first human eye 09:05. Detection took two minutes, response ' +
        'took eighty-three, and the incident is made of the second one. A detection nobody reads is ' +
        'not a detection.',
      commandOptions: [
        { command: "head -1 /evidence/reports/submissions.csv; sort -t, -k1 /evidence/reports/submissions.csv | head -2", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'rota|shift' /var/log/mail/gateway-alerts.log | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mail-gateway', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/gateway-alerts.log', ...DUMP_ALL },
        { command: 'grep -c report /var/log/mail/gateway-alerts.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the earliest report, then find when any product first said anything.',
      guidance:
        'Somebody told you. Ask when, and what you knew before that.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1078'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.iam-audit', 'act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Four accounts authenticated from the attacker address, and the timing is the whole finding. ' +
        'One at 07:51 was nine minutes after the first report, and could not have been stopped by ' +
        'anybody in this room. The other three, at 08:20, 08:44 and 08:58, were 38, 62 and 76 ' +
        'minutes after we were told, and every one of them was preventable by a proxy block that ' +
        'takes about four minutes to apply. Say that as three preventable compromises rather than ' +
        'as four affected accounts, because the second phrasing describes the attacker and the ' +
        'first describes us. Resetting these four is necessary and is not the finding: the ' +
        'attacker gets four accounts either way, and what this row establishes is that three of ' +
        'them were bought with our queue time.',
      standIn:
        'Four accounts authenticated from the attacker address. The timing is the finding. One at ' +
        '07:51, nine minutes after the first report, nobody could have stopped that. Three at 08:20, ' +
        '08:44, 08:58, which is 38, 62 and 76 minutes after we were told, and a proxy block takes ' +
        'four minutes. So this is three preventable compromises, not four affected accounts. The ' +
        'first phrasing is about us and the second is about the attacker. Resetting them is ' +
        'necessary and it is not the finding.',
      commandOptions: [
        { command: "jq -r '.records[] | select(.ip==\"203.0.113.121\") | \"\\(.time) \\(.user)\"' /evidence/identity/auth.json", correct: true, teaches: CORRECT_STEP },
        { command: "grep '203.0.113.121' /evidence/identity/auth-export.csv | cut -d, -f1,2", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/auth.json', ...DUMP_ALL },
        { command: 'curl -s https://ridgeline-rota.example/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find who authenticated from the attacker address, and put those times beside the first report.',
      guidance:
        'People reported it. Ask whether anybody also fell for it.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['mitigation-specialist', 'detection-engineer'],
      correctActions: ['act.notify-legal', 'act.sequence-remedy', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist'],
      why:
        'Everybody got the same sentence and it was not true. "Our team reviews every report" was ' +
        'sent to a person at 07:42 whose report nobody read for eighty-three minutes, and to the ' +
        'fortieth person at 09:01 who had told us something we already knew forty times over. This ' +
        'is not a courtesy problem. Staff reporting is the only detection here that worked, it runs ' +
        'entirely on people believing the button does something, and an acknowledgement that ' +
        'promises review and delivers none spends that belief a little at a time. The person to ' +
        'write to first is the healthcare assistant who reported at 07:42, by name, saying she was ' +
        'right and she was first, and the reason to do it today rather than in the write-up is that ' +
        'she will hear about the four compromised accounts either way and what she concludes about ' +
        'her own report depends on which arrives first.',
      standIn:
        'Everybody got the same sentence and it was not true. Our team reviews every report went to ' +
        'the woman at 07:42 whose report sat for eighty-three minutes, and to the fortieth person at ' +
        '09:01 telling us something we already knew forty times. This is not manners. Staff ' +
        'reporting is the only detection that worked here and it runs on people believing the ' +
        'button does something. First letter goes to the healthcare assistant who reported at 07:42, ' +
        'by name, today, saying she was right and she was first. She will hear about the four ' +
        'accounts anyway, and what she takes from that depends on which reaches her first.',
      commandNudge:
        'Read what the mailbox sent back, and who it went to first.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1566.002', 'T1583.001'],
      firstResponder: 'threat-intel',
      alsoAppropriate: ['log-analyst', 'soc-operator'],
      correctActions: ['act.ttp-map', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.sandbox', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['detection-engineer'],
      why:
        'There is nothing to analyse and that is worth saying out loud, because a room with a ' +
        'malware analyst in it will otherwise spend forty minutes proving it. Plain text, no ' +
        'attachment, no exploit, a nine-day-old domain and a copied sign-in page. The technique was ' +
        'the send time and the subject: twenty to eight on a Monday, a shift change, to a workforce ' +
        'whose week is built on the rota. That is the transferable observation, and it is about ' +
        'targeting rather than tooling. It also sets expectations correctly for the write-up, ' +
        'because a report describing a sophisticated attack would be false and would quietly ' +
        'excuse the eighty-three minutes. Nothing here was hard to catch. It was caught, in two ' +
        'minutes, by somebody with no security training.',
      standIn:
        'There is nothing to analyse, and I want that said before anybody spends forty minutes ' +
        'proving it. Plain text, no attachment, no exploit, nine-day-old domain, copied sign-in ' +
        'page. The technique was the timing and the subject line: twenty to eight on a Monday, a ' +
        'shift change, to a workforce that lives by the rota. That is targeting, not tooling. And it ' +
        'matters for the write-up, because calling this sophisticated would be false and would ' +
        'quietly excuse the eighty-three minutes. It was caught in two minutes by somebody with no ' +
        'security training.',
      commandOptions: [
        { command: "grep -iE 'created|registrar' /evidence/intel/ridgeline-rota-domain.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -icE 'attachment|content-type: application' /evidence/mail/sample.eml", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status clamav', ...STATUS_CHECK },
        { command: 'cat /evidence/mail/sample.eml', ...DUMP_ALL },
        { command: 'curl -sI https://ridgeline-rota.example/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check whether there is anything in the message to analyse before analysing it.',
      guidance:
        'It worked on four people. Ask what was actually clever about it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['detection-engineer', 'threat-intel'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.tune', 'act.attribute-named'],
      escalateTo: [],
      why:
        'Six of the forty-one are not this campaign: the genuine payroll notice reported by the same ' +
        'two people who report it every month, a recruitment approach that is unwanted rather than ' +
        'malicious, and a forwarded joke sent to the wrong mailbox. Close them, and resist the ' +
        'conclusion that sits right behind them. A queue where six in forty-one are false is a queue ' +
        'in good health, and the two people who report payroll every month are behaving exactly as ' +
        'trained: they cannot tell, so they ask. The instinct to tighten the guidance so they stop ' +
        'is the instinct that quietly produces the morning where nobody reports the real one, and ' +
        'the value of the 07:42 report was made possible by the same habit that produces these six.',
      standIn:
        'Six of the forty-one are not this. Four are the real payroll notice from the two people who ' +
        'report it every month, one is a recruitment approach, one is a joke sent to the wrong ' +
        'mailbox. Closing them. And nobody tighten the guidance over this. Six in forty-one false is ' +
        'a healthy queue, those two are doing exactly what we trained them to do, and the habit that ' +
        'produces these six is the habit that produced the 07:42 report.',
      commandOptions: [
        { command: "awk -F, '$2!=\"rota-notice\" {print $2, $3}' /evidence/reports/submissions.csv", correct: true, teaches: CORRECT_STEP },
        { command: "grep -v 'rota-notice' /evidence/reports/submissions.csv | cut -d, -f2 | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dovecot', ...STATUS_CHECK },
        { command: 'cat /evidence/reports/submissions.csv', ...DUMP_ALL },
        { command: 'grep -i payroll /var/log/mail/gateway.log', ...WRONG_TARGET },
      ],
      commandNudge:
        'Look at the submissions that are not the rota message and see what they are.',
      guidance:
        'Not all forty-one are the same. Ask what the others are.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.revoke-key', 'act.sequence-remedy', 'act.check-rollback'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Everything here is cheap, which changes the ordering question from what can we afford to ' +
        'what stops the bleeding first. The proxy block goes first, in four minutes, because until ' +
        'it is in place the next person to open that message becomes the fifth account and the ' +
        'message is still sitting in nine hundred mailboxes. Then sessions and passwords for the ' +
        'four, which closes what has already happened. Then the mail administrator pulling the ' +
        'message, twenty minutes, which removes the source rather than the symptom and is second ' +
        'only because the block already covers the same risk faster. The letters are last of the ' +
        'four and are not optional: the button is a detection source and this is its maintenance. ' +
        'Deliberately left undone: nothing here stops the same message arriving from a different ' +
        'domain this afternoon, and the eighty-three minutes is not fixed by any action on this ' +
        'list.',
      standIn:
        'All of it is cheap, so the question is what stops the bleeding first. Proxy block now, four ' +
        'minutes, because until then the next person to open it is account five and it is still in ' +
        'nine hundred mailboxes. Then sessions and passwords for the four. Then the mail admin pulls ' +
        'the message, twenty minutes, second only because the block already covers that risk faster. ' +
        'Then the letters, and those are not optional, the button is a detection source and that is ' +
        'its maintenance. Left undone: none of this stops the same message from a new domain this ' +
        'afternoon, and none of it fixes the eighty-three minutes.',
      commandNudge:
        'Rank the four actions by how long each takes and what each one stops.',
    },
    {
      eventId: 'ev.8',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.propose-rule', 'act.predict', 'act.scope-estate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'The dashboard measures the half that is working. Report volume is up 60 per cent, and every ' +
        'one of those extra reports lands in a mailbox that nobody opens before nine, which means ' +
        'the training refresh in June bought more of a thing whose bottleneck is elsewhere. Two ' +
        'numbers belong on that page and neither is there: how long a report waits before somebody ' +
        'reads it, and whether the reported message was still in other mailboxes an hour later. Both ' +
        'are computable from data already held. The reason to raise it before Thursday rather than ' +
        'after is that once 60 per cent is presented as the outcome it becomes the thing being ' +
        'managed, and the next round of effort goes into raising it again. The prediction is ' +
        'straightforward and worth writing down: the next campaign will also be reported within ' +
        'minutes, and will also wait, and the number of people compromised in between will depend on ' +
        'what hour of the day it arrives.',
      standIn:
        'The dashboard measures the half that works. Volume up sixty per cent, all of it landing in a ' +
        'mailbox nobody opens before nine. June bought us more of something whose bottleneck is ' +
        'somewhere else. Two numbers belong on that page: how long a report waits, and whether the ' +
        'message was still in other mailboxes an hour later. We can compute both today. And I want ' +
        'it raised before Thursday, because once sixty per cent is the outcome it becomes the thing ' +
        'we manage. Prediction for the file: the next one gets reported in minutes, waits, and the ' +
        'number of people caught depends on what time of day it lands.',
      commandOptions: [
        { command: "awk -F, 'NR>1{print $1}' /evidence/reports/submissions.csv | head -1", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'wait|response|time_to' /evidence/awareness/dashboard-fields.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status grafana', ...STATUS_CHECK },
        { command: 'cat /evidence/awareness/dashboard-fields.txt', ...DUMP_ALL },
        { command: 'awareness-cli metric set report_volume 0', ...MUTATE },
      ],
      commandNudge:
        'Read what the dashboard measures, then work out which number would have shown today.',
      guidance:
        'Reporting is up sixty per cent. Ask what that number does not say.',
    },
  ],
};
