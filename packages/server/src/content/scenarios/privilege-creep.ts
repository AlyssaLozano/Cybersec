/**
 * Scenario 51: Still On The List.
 *
 * Somebody moved department three months ago and kept everything they had.
 *
 * WHAT THIS TEACHES
 *
 * That leavers get offboarded and movers do not. Every organisation has a
 * process for somebody walking out of the door, because it is a single event
 * with a date on it and somebody owns it. Nobody owns a transfer. The new
 * manager raises a request for the access the new job needs, that request is
 * granted, and the access the old job needed is still there because removing it
 * was nobody's task.
 *
 * Repeat that over a career and a fifteen-year employee holds permissions from
 * four roles, none of which anybody would grant them today.
 *
 * WHY IT IS INTERMEDIATE RATHER THAN OBVIOUS
 *
 * Because the innocent explanation is genuinely available for most of the hour
 * and it is a good one. People finishing a handover legitimately touch their old
 * systems for weeks. A finance report opened by somebody who spent four years in
 * finance is not evidence of anything on its own. What makes this different is
 * not the access, it is what happens to the data afterwards, and a floor that
 * concludes too early on the access alone will be wrong about a colleague.
 *
 * THE LINE THE SCENARIO IS ABOUT
 *
 * Holding access you should not have is a control failure and belongs to
 * whoever owns joiners and movers. Using it to send commercially sensitive
 * material to a personal address is a different thing entirely, and only `ev.4`
 * establishes which one this is.
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

const ID = 'still-on-the-list';

export const STILL_ON_THE_LIST: Scenario = {
  id: ID,
  title: 'Still On The List',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 10:45 at Fenmarch Credit Union. A quarterly access review flagged somebody in marketing ' +
    'opening finance reports. They worked in finance until June and there may be nothing in this ' +
    'at all.',
  roles: [
    'soc-operator',
    'log-analyst',
    'cloud-security',
    'fusion-analyst',
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
      summary: 'Access review flagged finance reporting access held by a marketing account',
      detail:
        'The quarterly entitlement review found that d.okonjo, a marketing campaigns manager, holds ' +
        'membership of the finance reporting group. They transferred from finance to marketing on ' +
        '14 June. The review flags entitlements that do not match the current role and produced 140 ' +
        'such findings this quarter. Rule history: this is a quarterly review, not a detection, and ' +
        'no rule fires on an entitlement that outlives a transfer.',
      source: 'd.okonjo',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'The account has opened finance reports weekly since the transfer',
      detail:
        'Access logs show the account opening the management accounts pack and the branch ' +
        'profitability report most weeks since 14 June, usually on a Thursday afternoon. Before the ' +
        'transfer the same account opened them daily, which was its job. Marketing campaign ' +
        'planning legitimately uses branch performance data, and the marketing team has its own ' +
        'summary feed for exactly that.',
      source: 'd.okonjo',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'cloud-audit',
      summary: 'Reports were downloaded rather than viewed, from September onward',
      detail:
        'Until the end of August the reports were opened in the browser viewer. From 4 September ' +
        'they have been downloaded as spreadsheets, eleven times across five weeks. Downloading is ' +
        'permitted for anybody with access and is how finance staff work with the same reports. ' +
        'Nothing changed in the account entitlements in that window.',
      source: 'd.okonjo',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'cloud-audit',
      summary: 'Nine of the downloads were attached to messages sent to a personal address',
      detail:
        'Mail audit shows nine messages from the account to a personal address at a consumer mail ' +
        'provider between 5 September and yesterday, each carrying one of the downloaded ' +
        'spreadsheets. The personal address is the one recorded in the human resources system as ' +
        'this employee own contact address. The messages have no body text and no subject.',
      source: 'd.okonjo',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'The reports carry unpublished branch closure modelling',
      detail:
        'The branch profitability report has included a modelling annexe since the August refresh, ' +
        'covering eleven branches under review for closure, with headcount and timing assumptions. ' +
        'The review is not public and has not been shared with the affected branches. The August ' +
        'refresh is the first version to contain it, and 4 September is the first download.',
      source: 'reporting platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'One hundred and forty accounts hold entitlements from a previous role',
      detail:
        'The same review found 140 accounts holding entitlements that do not match their current ' +
        'role, across every department. The leaver process removes all access on a leaving date and ' +
        'is reliable. There is no equivalent step for a transfer: the receiving manager requests ' +
        'what the new role needs and nobody is tasked with removing what the old role had. The ' +
        'longest-standing finding in the report is eleven years old.',
      source: 'identity platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'A finance analyst downloaded the same report forty times this month',
      detail:
        'A finance analyst downloaded the branch profitability report 40 times in September, which ' +
        'is the highest count of any user. She is in the finance team, the report is core to her ' +
        'role, every download went to her managed workstation, and none has been attached to any ' +
        'outbound message. Rule history: this rule counts downloads and does not consider role or ' +
        'destination.',
      source: 'reporting platform',
      claimedSeverity: 'medium',
    },
  ],
};

export const STILL_ON_THE_LIST_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody transferred from finance to marketing on 14 June and kept their finance reporting access, because nothing removes it when a person moves rather than leaves.',
    'They kept opening the management accounts pack and the branch profitability report weekly, which is explainable: marketing does use branch performance data.',
    'Until the end of August they viewed the reports in the browser. From 4 September they started downloading them as spreadsheets.',
    'The August refresh of the branch profitability report added a modelling annexe covering eleven branches under review for closure, with headcount and timing. That review is not public.',
    'Nine of the eleven downloads were emailed to their own personal address, with no subject and no body text.',
    'So the access is a control failure that predates any of this, and the emailing is a separate act that the access merely made possible.',
    'One hundred and forty accounts across the organisation hold entitlements from a previous role, the oldest eleven years, because the leaver process is reliable and there is no mover process at all.',
    'What this employee intended is not established by anything on this board, and the SOC is not the function that decides it.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst', 'cloud-security'],
      why:
        'Graded a true positive because the review is right and the entitlement really does not ' +
        'match the role, and it is deliberately not evidence of anything yet. One of 140 findings ' +
        'in a quarterly report, on somebody who worked in that department until June, which is the ' +
        'most ordinary explanation available. The reason to look rather than close is that nothing ' +
        'here is a detection: no rule fires on an entitlement outliving a transfer, so if this is ' +
        'not looked at now it waits a quarter. Reaching for a disposition on this row is premature ' +
        'in both directions, and the honest next step is finding out whether the access has been ' +
        'used.',
      standIn:
        'Quarterly review flagged a marketing campaigns manager holding finance reporting access. ' +
        'They transferred out of finance on 14 June. One of 140 findings this quarter and no rule ' +
        'fires on this, so nobody looks until next quarter. Taking it. I am not calling it anything ' +
        'yet.',
      commandOptions: [
        { command: "awk -F, '$3==\"d.okonjo\" {print $4, $6}' /var/log/identity/entitlements.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep okonjo /var/log/hr/transfers.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity-sync', ...STATUS_CHECK },
        { command: 'cat /var/log/identity/entitlements.csv', ...DUMP_ALL },
        { command: 'net group "Finance-Reporting" /domain /delete d.okonjo', ...MUTATE },
      ],
      commandNudge:
        'Find out what access they hold and when they changed role, before deciding what it means.',
      guidance:
        'Somebody has access from an old job. Ask whether they have actually used it before ' +
        'deciding anything.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named', 'act.declare'],
      escalateTo: ['fusion-analyst', 'ir-lead'],
      why:
        'Still not evidence, and this row exists to make a floor sit with that. Weekly access on a ' +
        'Thursday afternoon, down from daily when it was their job, on reports that marketing ' +
        'legitimately has a use for. Every part of that is consistent with somebody who kept a ' +
        'habit and finds the detail useful. The one detail worth carrying rather than resolving is ' +
        'that marketing has its own summary feed for exactly this purpose, which is a reason to ' +
        'keep looking and not a reason to conclude: people use the report they already know rather ' +
        'than the one they were given, constantly, and it is not misconduct.',
      standIn:
        'They have opened the management accounts pack and branch profitability most weeks since the ' +
        'transfer, Thursday afternoons, down from daily when it was their job. Marketing does use ' +
        'branch performance data, though they have their own summary feed. That is consistent with ' +
        'somebody keeping a habit. I have nothing yet.',
      commandOptions: [
        { command: "awk '$4==\"d.okonjo\" {print $1}' /var/log/reporting/access.log | uniq -c | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep okonjo /var/log/reporting/access.log | tail -30', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status reporting-platform', ...STATUS_CHECK },
        { command: 'cat /var/log/reporting/access.log', ...DUMP_ALL },
        { command: 'grep -c okonjo /var/log/reporting/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare how they use that access now against how they used it before the transfer.',
      guidance:
        'There is an innocent explanation for this. Ask what would have to be true for it to be the ' +
        'wrong one.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1005'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.declare', 'act.attribute-named'],
      escalateTo: ['fusion-analyst', 'ir-lead'],
      why:
        'The first thing that is actually a change rather than a continuation. Viewing in a browser ' +
        'until the end of August, downloading spreadsheets from 4 September, eleven times in five ' +
        'weeks, with no entitlement change in that window. Downloading is permitted and is how ' +
        'finance staff work with the same reports, so the act is not wrong. What is worth noticing ' +
        'is that behaviour changed with nothing in the systems changing to cause it, which means ' +
        'something outside them did. That is a question rather than a finding, and holding it as a ' +
        'question through one more event is the discipline this scenario is built around.',
      standIn:
        'Browser viewing until the end of August, then downloading spreadsheets from 4 September, ' +
        'eleven times in five weeks. Nothing changed in their entitlements in that window. ' +
        'Downloading is permitted and finance staff do it. The behaviour changed and nothing in our ' +
        'systems changed to cause it, so something outside them did.',
      commandNudge:
        'Compare how the reports were accessed before September against how they were accessed ' +
        'after.',
      guidance:
        'Something about the behaviour changed. Ask when, and whether anything in the systems ' +
        'changed at the same time.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1567'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.attribute-named', 'act.reset-password', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The line, and everything before it was preparation to be able to say so. Nine of the eleven ' +
        'downloads attached to messages sent to a personal address, no subject, no body text. That ' +
        'is not access misuse any more, it is commercially sensitive material leaving the ' +
        'organisation, and the emptiness of the messages is the detail that removes the last ' +
        'innocent reading: somebody sending themselves a document to work on writes something, even ' +
        'a full stop. Two things the report must not do. It must not say what they intended, ' +
        'because nothing here establishes it and the address is their own registered contact ' +
        'address rather than anything hidden. And it must not merge this with the entitlement ' +
        'finding: the access is a control failure that predates all of this, and this is a separate ' +
        'act that the failure made possible.',
      standIn:
        'Nine of the eleven downloads went out as attachments to a personal address at a consumer ' +
        'provider, no subject, no body text. That address is their own registered contact address in ' +
        'HR, so nothing is hidden. This is commercially sensitive material leaving the organisation. ' +
        'I am not saying what they meant by it, and this is a separate thing from the entitlement.',
      commandOptions: [
        { command: "awk '$3==\"d.okonjo\" && $6 ~ /attachment/ {print $1, $5}' /var/log/mail/outbound.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep okonjo /var/log/mail/outbound.log | grep -i attach', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mailgw', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/outbound.log', ...DUMP_ALL },
        { command: 'grep -c okonjo /var/log/mail/outbound.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what happened to the files after they were downloaded.',
      guidance:
        'They downloaded something. Ask where it went next, because that is where the line is.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1213'],
      firstResponder: 'forensics',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.reimage-now', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'What is actually in the reports, and the dates are the finding. The August refresh added a ' +
        'modelling annexe covering eleven branches under review for closure, with headcount and ' +
        'timing, and the review is not public or shared with the affected branches. The first ' +
        'download is 4 September, which is the first version to contain it. That correlation is ' +
        'strong and it is still a correlation: it is entirely consistent with somebody who saw ' +
        'something alarming about their old colleagues and started keeping copies, and equally ' +
        'consistent with somebody collecting it to use. Both readings fit every fact on this board ' +
        'and nothing available today separates them. Preserve carefully and state the dates without ' +
        'the inference, because this will be an HR process and the temptation to write the tidy ' +
        'version is exactly what would make the evidence useless.',
      standIn:
        'The August refresh added a modelling annexe on eleven branches under review for closure, ' +
        'with headcount and timing. Not public and not shared with those branches. First download is ' +
        '4 September, the first version containing it. That is a strong correlation and it is still ' +
        'a correlation: somebody alarmed about their old colleagues and somebody collecting it to ' +
        'use both fit. Sealed, with the dates and no inference.',
      commandNudge:
        'Find out what changed in the report itself around the time the downloads started.',
      guidance:
        'Ask what is actually inside these reports, and whether that changed recently.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      critical: true,
      techniques: ['T1078.003'],
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.contain-scoped', 'act.sequence-remedy'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reset-password', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The finding that outlives the individual, and the reason it exists is worth stating exactly ' +
        'because it explains every other organisation too. The leaver process is reliable, because ' +
        'leaving is one event with a date and an owner. There is no mover process at all: the ' +
        'receiving manager asks for what the new job needs, and removing what the old job had is ' +
        'nobody task. So 140 accounts hold entitlements that do not match their role, the oldest ' +
        'eleven years, and none of it is anybody misbehaving. The containment split matters here. ' +
        'Removing this one entitlement takes a minute and is obviously right. Removing 140 without ' +
        'checking will break somebody mid-handover, so the sequence is this account now, a review of ' +
        'the 140 with the receiving managers, and a mover step added to the joiners and leavers ' +
        'process so the list stops growing.',
      standIn:
        'A hundred and forty accounts hold entitlements from a previous role, oldest one eleven ' +
        'years. Our leaver process works because leaving is one event with an owner. There is no ' +
        'mover process at all, so removing old access is nobody job. This one entitlement goes now. ' +
        'The other 139 get reviewed with the receiving managers rather than cut, because some of ' +
        'them are mid-handover, and we add a mover step or the list just grows again.',
      commandOptions: [
        { command: "awk -F, '$5==\"ROLE_MISMATCH\" {print $3, $7}' /var/log/identity/review-q3.csv | sort -k2", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c ROLE_MISMATCH /var/log/identity/review-q3.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity-sync', ...STATUS_CHECK },
        { command: 'cat /var/log/identity/review-q3.csv', ...DUMP_ALL },
        { command: 'net group "Finance-Reporting" /domain /delete', ...MUTATE },
      ],
      commandNudge:
        'Find out how many other accounts are in the same position and how old the oldest is.',
      guidance:
        'Ask why this access survived the transfer. The answer usually applies to everybody who has ' +
        'ever moved.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['fusion-analyst'],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.iam-audit'],
      escalateTo: [],
      why:
        'Forty downloads of the same report in one month, four times the count of the account under ' +
        'investigation, and it is completely fine. She is in the finance team, the report is core ' +
        'to her role, every download went to her managed workstation, and none was attached to an ' +
        'outbound message. The rule counts downloads and considers neither role nor destination, ' +
        'which is why the highest count in the organisation is the person with the best reason. It ' +
        'is here because volume is the most seductive wrong signal on this board: the account that ' +
        'mattered did eleven downloads and this one did forty. The discriminator is the same pair ' +
        'that decided ev.4, which is whether the role explains it and where the file went ' +
        'afterwards.',
      standIn:
        'Forty downloads of the same report this month by a finance analyst, four times our subject. ' +
        'It is core to her role, every download went to her managed workstation, and none of them ' +
        'left as an attachment. The rule counts downloads and ignores role and destination. Volume ' +
        'is not the signal. Closing it.',
      commandOptions: [
        { command: "awk '$5==\"DOWNLOAD\" {print $4}' /var/log/reporting/access.log | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "t.aldridge" /var/log/mail/outbound.log | grep -ci attach', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status reporting-platform', ...STATUS_CHECK },
        { command: 'cat /var/log/reporting/access.log', ...DUMP_ALL },
        { command: 'grep -c DOWNLOAD /var/log/reporting/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whose role explains the downloads, and whether any of them left the organisation.',
      guidance:
        'The biggest number is not the finding. Ask whether the role explains it and where the ' +
        'files went.',
    },
  ],
};
