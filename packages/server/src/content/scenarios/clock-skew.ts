/**
 * Scenario 84: Before It Happened.
 *
 * The credential was used thirty-seven minutes before it was stolen.
 *
 * WHAT THIS TEACHES
 *
 * That a timeline is an artefact and not a fact. Every timestamp on the board
 * came off a clock somebody owns, through a parser somebody configured, into a
 * field somebody chose, and an analyst who treats the SIEM's ordering as
 * ground truth is reasoning about a construction rather than about events.
 *
 * The impossible sequence is the easy part: an effect before its cause is
 * visible to anybody and gets noticed. What this scenario is actually about is
 * everything downstream of it. A single offset applied to a clock that was
 * drifting rather than fixed produces a timeline that is plausibly wrong
 * instead of obviously wrong, which is worse, because nobody checks it again.
 * A second impossible sequence on the board is not a clock problem at all and
 * closing it as one would be the same mistake in the other direction. And a
 * different team has already acted on the uncorrected version, which is how a
 * clock fault becomes an accusation against a person.
 *
 * WHY EXPERT
 *
 * Nothing here is settled by finding an artefact. The offset has to be
 * rebuilt from a source whose clock can be argued for, the reconstruction has
 * to carry its own uncertainty into a document that will be read as fact, and
 * the question of whether anybody set that clock deliberately does not
 * resolve. The expert board withholds the vendor line that hands over the
 * offset, and adds the observation that the drift is not constant.
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

const ID = 'before-it-happened';

export const BEFORE_IT_HAPPENED: Scenario = {
  id: ID,
  title: 'Before It Happened',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 09:40 at Fenmarch Credit, day two of an investigation into a credential theft. The ' +
    'timeline the whole investigation is built on says the credential was used before it was stolen.',
  roles: [
    'soc-operator',
    'log-analyst',
    'forensics',
    'network-analyst',
    'cloud-security',
    'detection-engineer',
    'threat-intel',
    'fusion-analyst',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'The credential was used before it was stolen',
      detail:
        'The reconstructed timeline for the Hallam credential theft has the VPN session opening at ' +
        '02:14 and the phishing page receiving those same credentials at 02:51. Both entries are in ' +
        'the case file and the case file went to legal at 17:00 yesterday. Nobody flagged it, ' +
        'because both rows are correct in their own system.',
      source: 'case file',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 190,
      surface: 'raw-log',
      summary: 'The two rows came off two different clocks',
      detail:
        'The VPN concentrator writes its own host clock with no timezone marker. It has not reached ' +
        'an NTP server since a firmware update on 12 June, and at 09:30 today its clock read 37 ' +
        'minutes and 51 seconds ahead of true. The phishing page telemetry came from the takedown ' +
        'vendor, is stamped in UTC, and carries an offset. The SIEM parser for the concentrator ' +
        'was written to assume UTC, because on the day it was written the clock was right.',
      expertDetail:
        'Fenmarch runs 31 log sources. Nine write a timezone marker, fourteen are documented as UTC ' +
        'and are, six are documented as UTC and were last verified in 2024, and two write local ' +
        'time with no marker. There is no inventory of which is which; this list was assembled by ' +
        'the log analyst this morning.',
      expertAlsoOn: ['host-artefact'],
      source: 'log pipeline',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 380,
      surface: 'host-artefact',
      withheldAtExpert: true,
      summary: 'The vendor report states the offset outright',
      detail:
        'Page four of the concentrator vendor advisory for the June firmware release states that ' +
        'the update resets the NTP peer list to empty and that affected units drift at ' +
        'approximately 0.45 seconds per hour on the internal oscillator. Applied from 12 June, that ' +
        'predicts an offset of about 38 minutes today.',
      source: 'vendor advisory',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 560,
      surface: 'cloud-audit',
      summary: 'One source on this board can defend its own clock',
      detail:
        'The Fenmarch identity platform stamps every authentication in UTC from a disciplined ' +
        'clock, and its records are signed. It holds an authentication for the Hallam account from ' +
        '198.51.100.62 at 02:53:41 UTC, twelve seconds after the takedown vendor recorded the ' +
        'credential arriving at the phishing page, and it holds no authentication at 02:14 or ' +
        'anywhere near it.',
      source: 'identity platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 760,
      surface: 'raw-log',
      expertOnly: true,
      summary: 'The offset today is not the offset that night',
      detail:
        'A drifting clock has a different error at every moment, so the 37 minutes 51 seconds ' +
        'measured at 09:30 today is the offset now and not the offset at 02:14 on the night in ' +
        'question, which was nineteen days ago. Applying today figure to that night moves every ' +
        'concentrator row by a number that is close to right and is not right, and the result reads ' +
        'exactly like a corrected timeline.',
      source: 'log analyst',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 950,
      surface: 'alert-queue',
      summary: 'Somebody has already acted on the uncorrected version',
      detail:
        'On the strength of a credential used before it was phished, the insider threat process was ' +
        'opened against Dan Hallam yesterday at 16:20. His access was suspended, his manager was ' +
        'told there was an active investigation, and HR has him in at 11:00 this morning. Nothing ' +
        'in the file says anything other than what the timeline showed.',
      source: 'people team',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1140,
      surface: 'host-artefact',
      summary: 'A second impossible sequence, on a different pair of sources',
      detail:
        'Endpoint telemetry records the malicious document opening on FEN-LAP-19 at 02:58:04, and ' +
        'the mail gateway records delivering the message that carried it at 02:58:31, twenty-seven ' +
        'seconds later. Both sources are UTC, both are NTP-disciplined, and both check out against ' +
        'the identity platform on every other event today.',
      source: 'FEN-LAP-19',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1340,
      surface: 'network-flow',
      // Unsettled, so it only appears on an expert run. This scenario is
      // authored at expert and is still playable lower down, where a question
      // that does not resolve is a worse lesson than no question.
      expertOnly: true,
      summary: 'Whether anybody touched that clock does not resolve',
      detail:
        'The concentrator NTP peer list is empty, which the vendor advisory predicts and which an ' +
        'administrator could also have done in about four seconds. The configuration change audit ' +
        'on the concentrator retains 30 days and the firmware update was 83 days ago. Fourteen ' +
        'other Fenmarch units took the same firmware; nine of them show the same empty peer list ' +
        'and five do not, and the five were rebuilt for unrelated reasons in July.',
      source: 'concentrator',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.9',
      atSeconds: 1540,
      surface: 'alert-queue',
      summary: 'The corrected timeline has to say how confident it is',
      detail:
        'The case file goes to the insurer, and if the claim is disputed it goes to a court, where ' +
        'every line in it is asserted as fact by somebody under oath. Legal has asked for a ' +
        'corrected version by 14:00. The identity platform times are exact. The concentrator times ' +
        'are reconstructed. The document currently makes no distinction between the two, and the ' +
        'template has no field for one.',
      source: 'legal',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1720,
      surface: 'alert-queue',
      summary: 'Thirty-one sources, and nobody knows which of them are right',
      detail:
        'Two Fenmarch log sources write local time with no marker and six are documented as UTC ' +
        'without having been checked since 2024. Every investigation Fenmarch has run this year ' +
        'built its timeline from whatever those sources said. Nothing in the platform compares a ' +
        'source clock against a reference, and no alert exists for one that drifts.',
      source: 'log pipeline',
      claimedSeverity: 'high',
    },
  ],
};

export const BEFORE_IT_HAPPENED_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On 21 August, Dan Hallam was phished. The takedown vendor recorded his credentials arriving at the phishing page at 02:51:14 UTC, and the Fenmarch identity platform recorded an authentication for his account from the attacker address at 02:53:41 UTC, two minutes and twenty-seven seconds later. That is the whole of what happened, and it is an ordinary credential theft.',
    'The VPN concentrator wrote the session as 02:14, because its clock is fast. A firmware update on 12 June emptied its NTP peer list, and it has been free-running on its internal oscillator for eighty-three days at roughly 0.45 seconds an hour. The SIEM parser stamps concentrator rows as UTC, because on the day the parser was written the clock was correct.',
    'So the case file shows a credential used thirty-seven minutes before it was stolen, and both rows are correct in their own system. Nothing was tampered with and nobody made a mistake at the moment of writing.',
    'The offset measured this morning is 37 minutes 51 seconds. That is the error now, not the error nineteen days ago, because a drifting clock has a different error at every moment. Applying it uncorrected produces a timeline that is close to right and is not right, and reads exactly like a corrected one.',
    'The only source on the board that can defend its own clock is the identity platform, which is signed and disciplined. Every reconstruction has to be anchored there.',
    'The second impossible sequence is not a clock problem. The document opened twenty-seven seconds before the mail gateway logged delivering it because the gateway writes its delivery row when the message leaves its queue, and the message had already been released to the mailbox. Both clocks are right and the two rows record different moments than their field names suggest.',
    'Whether anybody emptied the peer list deliberately does not resolve. The advisory predicts it, an administrator could have done it in four seconds, the configuration audit retained 30 days against an 83 day gap, and the nine units that share the symptom also share the firmware.',
    'The cost of the uncorrected timeline has already been paid by a person. The insider threat process was opened against Hallam at 16:20 yesterday on the strength of a sequence that a clock invented, his access is suspended and HR has him in at 11:00. He was phished, which is the thing the file accuses him of covering up.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1078'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.declare', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'An effect before its cause, and the useful reflex is not to explain it but to stop ' +
        'everything built on top of it. Both rows are correct in their own system, which is why ' +
        'nobody caught it: nothing looks wrong until the two are put in one list, and the list is ' +
        'the thing nobody audits. Say plainly what has actually been established, which is that the ' +
        'timeline is unreliable rather than that either row is false, because a room that starts ' +
        'arguing about which log is lying will pick one and be wrong half the time. And say that ' +
        'the file went to legal at five o clock yesterday, because that turns a curiosity into a ' +
        'deadline: everything downstream of this ordering is now also unreliable and somebody has ' +
        'been reading it for sixteen hours.',
      standIn:
        'The credential was used at 02:14 and stolen at 02:51. That is not possible, and both rows ' +
        'are correct in their own system, which is why nobody caught it. Nothing looks wrong until ' +
        'you put the two in one list, and the list is what nobody audits. What we have established ' +
        'is that the timeline is unreliable, not that either log is lying. And this went to legal ' +
        'at five yesterday, so everything built on it has been read by somebody for sixteen hours.',
      commandOptions: [
        { command: "grep -h 'hallam' /var/log/vpn/sessions.log /evidence/vendor/capture.json | sort", correct: true, teaches: CORRECT_STEP },
        { command: "awk '{print $1, $2, $NF}' /var/log/vpn/sessions.log | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem-ingest', ...STATUS_CHECK },
        { command: 'cat /evidence/case/timeline.csv', ...DUMP_ALL },
        { command: 'grep -c hallam /var/log/vpn/sessions.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Put the two original rows side by side, as each system wrote them.',
      guidance:
        'The order is impossible. Ask where each row came from.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'log-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.declare', 'act.isolate'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'Two clocks, and neither was tampered with. The concentrator writes its own host clock with ' +
        'no timezone marker, has not reached an NTP server since a June firmware update, and reads ' +
        'thirty-seven minutes fast. The vendor telemetry is UTC and says so. The SIEM parser treats ' +
        'the concentrator as UTC because on the day it was written that was true, and a parser is a ' +
        'statement about the world at the moment somebody wrote it that nothing revisits. What ' +
        'matters more than this one fault is the shape of it: the absence of a timezone marker is ' +
        'not a missing field, it is an assumption that has to live somewhere, and it ended up in a ' +
        'parser nobody has read since. Two Fenmarch sources write local time with no marker and six ' +
        'more are documented as UTC on the strength of a check from 2024, so this is one instance ' +
        'of a class rather than a bad concentrator.',
      standIn:
        'Two clocks, and nobody touched either. The concentrator writes its own host clock with no ' +
        'timezone, has not reached NTP since a June firmware update, and is thirty-seven minutes ' +
        'fast. The vendor data is UTC and says so. Our parser calls the concentrator UTC because ' +
        'that was true the day somebody wrote it. A missing timezone is not a missing field, it is ' +
        'an assumption that has to live somewhere, and ours lives in a parser nobody has read ' +
        'since. Two of our sources write local with no marker and six more are UTC on a 2024 check.',
      commandOptions: [
        { command: "grep -iE 'ntp|peer|sync' /evidence/vpn/concentrator-status.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -A3 'vpn-concentrator' /etc/siem/parsers.d/*.conf", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ntpd', ...STATUS_CHECK },
        { command: 'cat /var/log/vpn/sessions.log', ...DUMP_ALL },
        { command: 'ntpdate -u pool.ntp.org', ...MUTATE },
      ],
      commandNudge:
        'Ask each source what time it thinks it is, and what timezone it thinks it writes.',
      guidance:
        'Two rows disagree. Ask what clock each one came off.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'threat-intel',
      alsoAppropriate: ['log-analyst', 'detection-engineer'],
      correctActions: ['act.corroborate', 'act.scope-estate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['log-analyst'],
      why:
        'The vendor already documented this: the June firmware empties the NTP peer list, and the ' +
        'oscillator drifts about 0.45 seconds an hour, which predicts roughly 38 minutes by today. ' +
        'That is a useful corroboration and it is not the measurement. It agrees with what the ' +
        'estate actually shows, which is the only reason to trust it, and a room that took the ' +
        'predicted figure instead of the measured one would be using a vendor average as evidence ' +
        'in a legal document. Read it for what it changes: this is a known defect with a known ' +
        'mechanism, which makes the deliberate-tampering reading less likely without excluding it, ' +
        'and it means fourteen other Fenmarch units are candidates before anybody has looked.',
      standIn:
        'The vendor documented it. June firmware empties the NTP peers, oscillator drifts about ' +
        '0.45 seconds an hour, which predicts around 38 minutes by now. That corroborates what we ' +
        'measured and it is not a substitute for measuring: I am not putting a vendor average in a ' +
        'document that goes to a court. What it changes is that this is a known defect with a known ' +
        'mechanism, which makes deliberate tampering less likely without ruling it out, and it puts ' +
        'fourteen other units on the list before anybody has looked at them.',
      commandOptions: [
        { command: "grep -iE 'ntp|drift|oscillator' /evidence/vendor/advisory-june.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -l 'FW-2026-06' /evidence/estate/firmware-inventory.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vpn', ...STATUS_CHECK },
        { command: 'cat /evidence/vendor/advisory-june.txt', ...DUMP_ALL },
        { command: 'grep -i ntp /var/log/vpn/sessions.log', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether the vendor already knows about this, and what they say it does.',
      guidance:
        'The clock is wrong in a specific way. Ask whether that is a known defect.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1078', 'T1566'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.tune'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'This is the anchor, and finding it is the actual move. The identity platform stamps UTC ' +
        'from a disciplined clock and signs its records, which means it is the one source here ' +
        'whose time can be argued for in front of somebody hostile rather than merely asserted. It ' +
        'holds the Hallam authentication at 02:53:41, twelve seconds after the vendor recorded the ' +
        'credential reaching the phishing page, and holds nothing near 02:14. So the sequence is ' +
        'ordinary: phished, then used, two and a half minutes apart. Every other source on this ' +
        'board is now measured against this one rather than against each other, which is the ' +
        'general habit worth taking away. Comparing two unreliable clocks tells you they disagree ' +
        'and never which is wrong, and the reason investigations stall on this is that the room ' +
        'keeps looking for a tiebreak among sources that all have the same problem.',
      standIn:
        'Here is the anchor. The identity platform is UTC from a disciplined clock and it signs its ' +
        'records, so it is the one source whose time I can defend in front of somebody hostile. It ' +
        'has Hallam authenticating at 02:53:41, twelve seconds after the vendor saw the credential ' +
        'hit the phishing page, and nothing anywhere near 02:14. Phished, then used, two and a half ' +
        'minutes apart. Ordinary. From now on everything gets measured against this and not against ' +
        'each other. Two unreliable clocks tell you they disagree, never which one is wrong.',
      commandOptions: [
        { command: "jq -r '.records[] | select(.user==\"hallam\") | \"\\(.time) \\(.ip) \\(.result)\"' /evidence/identity/auth.json", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i hallam /evidence/identity/auth-export.csv | cut -d, -f1,3,5", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/auth.json', ...DUMP_ALL },
        { command: 'curl -s https://198.51.100.62/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find the one source whose clock you could defend, and rebuild from that.',
      guidance:
        'Every clock here is arguable. Ask whether any of them is not.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'fusion-analyst'],
      correctActions: ['act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.declare', 'act.dismiss', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The trap that catches the people who spotted the first problem. Thirty-seven minutes and ' +
        'fifty-one seconds is the error at half past nine this morning, and the night in question ' +
        'was nineteen days ago on a clock that has been accumulating error the whole time. Subtract ' +
        'today figure from that night rows and the result is close to right, which is precisely ' +
        'what makes it dangerous: an obviously broken timeline gets checked and a plausible one ' +
        'does not, and this one will go into a document as though it were measured. The honest ' +
        'method is to anchor each concentrator row against a signed identity event near it and ' +
        'interpolate between anchors, and where there is no nearby anchor to say the row is ' +
        'reconstructed to a few minutes rather than to a second. The uncomfortable part is that ' +
        'this makes the corrected timeline coarser than the wrong one, and somebody will read that ' +
        'as the investigation going backwards.',
      standIn:
        'Careful, this is where we get caught. The 37 minutes 51 is the error at half nine this ' +
        'morning. That night was nineteen days ago on a clock that has been accumulating error ' +
        'since. Subtract today number and you get close to right, which is the dangerous answer: ' +
        'obviously broken gets checked, plausible does not, and it goes in the document as if we ' +
        'measured it. Anchor each row to a signed identity event near it, interpolate between ' +
        'anchors, and where there is no anchor say it is good to a few minutes and not to a second. ' +
        'That makes the corrected timeline coarser than the wrong one. It is still the right one.',
      commandOptions: [
        { command: "paste <(cut -d, -f1 /evidence/vpn/session-times.csv) <(cut -d, -f1 /evidence/identity/anchor-times.csv) | head -20", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, 'NR>1{print $1, $2-$3}' /evidence/analysis/offset-samples.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status chronyd', ...STATUS_CHECK },
        { command: 'cat /evidence/analysis/offset-samples.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/vpn/session-times.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Ask whether the offset you measured today was the offset nineteen days ago.',
      guidance:
        'You have an offset. Ask when you measured it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['fusion-analyst', 'mitigation-specialist'],
      correctActions: ['act.notify-legal', 'act.investigate-hold', 'act.preserve'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist'],
      why:
        'This is the cost, and it has already been paid by a person. The insider process was opened ' +
        'against Hallam yesterday afternoon on the strength of a sequence a clock invented, his ' +
        'access is suspended, his manager has been told there is an active investigation, and HR ' +
        'has him in at eleven. He was phished. That is what the file accuses him of covering up. ' +
        'The immediate action is not the report and not the correction: it is the eleven o clock ' +
        'meeting, which has to be stopped in the next hour by somebody senior enough that stopping ' +
        'it is believed, and the correction has to reach his manager rather than only the case ' +
        'file, because the sentence that damaged him was spoken and a quiet amendment does not ' +
        'reach the people who heard it. Say the general thing out loud too, because it is the ' +
        'reason this seat exists: an investigation output is not a document, it is a set of actions ' +
        'other people take, and a wrong timeline does not sit in a file waiting to be corrected.',
      standIn:
        'This is the cost and a person has already paid it. Insider process opened against Hallam at ' +
        '16:20 yesterday because a clock invented a sequence. Access suspended, manager told there ' +
        'is an active investigation, HR has him at eleven. He was phished, which is the thing the ' +
        'file says he covered up. First action is not the report, it is stopping that meeting in ' +
        'the next hour, and it needs somebody senior enough to be believed. Then the correction ' +
        'goes to his manager, not just into the case file. What damaged him was said out loud and ' +
        'an amendment nobody reads does not undo that. Our output is not a document, it is what ' +
        'other people do next.',
      commandNudge:
        'The clock is not the urgent thing on this row. Work out what has to be stopped, and by whom.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'network-analyst'],
      correctActions: ['act.corroborate', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['log-analyst'],
      why:
        'The same shape and a different cause, arriving on a floor that has spent an hour learning ' +
        'that impossible orderings mean broken clocks. Both of these clocks are right and check out ' +
        'against the anchor on every other event today. What is wrong is the assumption that the ' +
        'field names describe the same kind of moment: the endpoint stamps when the document ' +
        'opened, and the gateway stamps when the message left its queue, which happens after the ' +
        'message was already released to the mailbox. Nothing is out of order. Two rows record ' +
        'different events and the column header on both says time. Closing this as a clock fault ' +
        'would be the morning first mistake made in the opposite direction, and worse than the ' +
        'original one, because it would come with the confidence of a room that has already solved ' +
        'this once. The habit is to check the clock and then check what the timestamp is of.',
      standIn:
        'Same shape, different cause. Both clocks are right and both agree with the anchor on ' +
        'everything else today. The endpoint stamps when the document opened. The gateway stamps ' +
        'when the message left its queue, which is after it was already in the mailbox. Nothing is ' +
        'out of order, the two rows are timestamps of different events and both columns say time. ' +
        'Calling this a clock fault would be this morning mistake in the other direction, and worse ' +
        'for coming from a room that thinks it has already solved this. Check the clock, then check ' +
        'what the timestamp is of.',
      commandOptions: [
        { command: "grep -iE 'queue|release|deliver' /evidence/mail/gateway-schema.txt", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.fields[] | \"\\(.name): \\(.describes)\"' /evidence/mail/gateway-schema.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status postfix', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/gateway.log', ...DUMP_ALL },
        { command: 'chronyc makestep', ...MUTATE },
      ],
      commandNudge:
        'Both clocks are right. Read what each of those timestamp fields actually records.',
      guidance:
        'Another impossible order. Ask whether it is the same problem.',
    },
    {
      eventId: 'ev.8',
      verdict: 'ambiguous',
      leaning: 'benign',
      wouldSettleIt:
        'The concentrator configuration change audit for 12 June, which would show whether the peer ' +
        'list was emptied by the firmware update or by an administrator session. That log retains ' +
        '30 days and the update was 83 days ago, so it has not existed for seven weeks. The five ' +
        'units that took the same firmware and do not show the symptom were rebuilt in July for ' +
        'unrelated reasons, which removed the evidence from them as well.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.attribute-named', 'act.declare', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Two readings fit everything. The vendor advisory predicts an empty peer list from that ' +
        'firmware, and nine of the fourteen units that took it show exactly that, which is a ' +
        'population rather than a coincidence. An administrator could also empty it in four seconds ' +
        'and it would look identical afterwards, and a clock that makes a timeline impossible is ' +
        'genuinely useful to somebody who does not want a timeline built. The leaning is benign, on ' +
        'the population: a deliberate act that happens to reproduce a documented firmware defect on ' +
        'nine of fourteen units is a great deal of work for an effect the firmware was providing ' +
        'anyway. What stops it going further than a leaning is that the record which distinguishes ' +
        'the two retained thirty days against an eighty-three day gap, so it has not existed for ' +
        'seven weeks, and the five clean units were rebuilt in July, which removed it there too. ' +
        'Say leaning benign and say why it stops there, because a report that reads as settled ' +
        'when it is not is the same failure as the timeline, one level up.',
      standIn:
        'Two readings fit. The advisory predicts an empty peer list from that firmware and nine of ' +
        'fourteen units that took it show exactly that, which is a population, not a coincidence. ' +
        'An admin could also do it in four seconds and it would look the same, and a clock that ' +
        'makes timelines impossible is useful to somebody who does not want one built. I lean ' +
        'benign on the population: reproducing a documented defect on nine of fourteen units is a ' +
        'lot of work for something the firmware was doing anyway. It stops at leaning because the ' +
        'record that separates them kept thirty days against an eighty-three day gap, and the five ' +
        'clean units were rebuilt in July. Writing it as settled would be this morning mistake ' +
        'again, one level up.',
      commandNudge:
        'Ask what record would tell the two readings apart, and whether it still exists.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['fusion-analyst', 'forensics'],
      correctActions: ['act.notify-legal', 'act.timeline', 'act.sequence-remedy'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['mitigation-specialist'],
      why:
        'The corrected file goes to an insurer and possibly to a court, where every line is asserted ' +
        'as fact by somebody under oath, and the template has no field for how confident a row is. ' +
        'That missing field is the finding. Two kinds of row are going into one document: identity ' +
        'platform times that are exact and signed, and concentrator times that are reconstructed by ' +
        'interpolating between anchors and are good to a few minutes. Presenting those identically ' +
        'is not a formatting choice, it is a claim about precision that nobody in the room would ' +
        'make out loud. The right output says which rows are measured, which are reconstructed and ' +
        'by what method, and what the residual uncertainty is on each, and it will be less ' +
        'satisfying to read than the wrong version was. Say that last part to legal before they ' +
        'read it, because a document that suddenly hedges looks like an investigation losing ' +
        'confidence, and the opposite is true.',
      standIn:
        'This goes to an insurer and maybe a court, where every line is sworn to, and the template ' +
        'has no field for confidence. That missing field is the finding. Two kinds of row are going ' +
        'in: identity times that are exact and signed, and concentrator times reconstructed between ' +
        'anchors and good to a few minutes. Printing those the same way is a claim about precision ' +
        'none of us would make out loud. So: which rows are measured, which are reconstructed and ' +
        'how, and the uncertainty on each. And I am telling legal before they read it that it will ' +
        'look weaker than the wrong version did, because a document that starts hedging reads like ' +
        'us losing confidence and it is the reverse.',
      commandNudge:
        'Sort the rows into the ones you measured and the ones you rebuilt, and say so on each.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'mitigation-specialist'],
      correctActions: ['act.propose-rule', 'act.backtest', 'act.scope-estate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'The finding that outlives the case. Thirty-one sources, two writing local time with no ' +
        'marker, six documented as UTC on the strength of a check from 2024, and nothing anywhere ' +
        'that compares a source clock against a reference. Every timeline Fenmarch built this year ' +
        'rests on that, and none of them was checked, which means the question is not whether this ' +
        'happens again but how many times it has already happened without producing an ordering ' +
        'absurd enough to notice. This one was caught only because the error was large enough to ' +
        'invert two events; a source running four minutes out would have produced a wrong timeline ' +
        'that nobody would ever question. The detection is cheap and nobody builds it: compare each ' +
        'source newest timestamp against the platform own clock on ingest, and alert on a source ' +
        'whose offset moves. That turns a silent class of error into a row somebody sees, which is ' +
        'the only version of this problem that gets fixed.',
      standIn:
        'This is the bit that outlives the case. Thirty-one sources, two writing local with no ' +
        'marker, six called UTC on a 2024 check, and nothing comparing any source clock to a ' +
        'reference. Every timeline we built this year sits on that. The question is not whether it ' +
        'happens again, it is how often it already has without inverting two events loudly enough ' +
        'for anyone to notice. We caught this one because the error was big. Four minutes out and ' +
        'we would have shipped a wrong timeline nobody ever questions. The detection is cheap: ' +
        'compare each source newest timestamp to our own clock at ingest and alert when a source ' +
        'offset moves.',
      commandOptions: [
        { command: "awk -F, '{print $1, $3}' /evidence/pipeline/source-inventory.csv | sort -k2", correct: true, teaches: CORRECT_STEP },
        { command: "for s in $(cut -d, -f1 /evidence/pipeline/sources.csv); do echo \"$s $(date -u +%s)\"; done | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem-ingest', ...STATUS_CHECK },
        { command: 'cat /evidence/pipeline/source-inventory.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/pipeline/sources.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'List every source and what timezone it is believed to write, then ask who checked.',
      guidance:
        'One clock was wrong. Ask how you would know about the other thirty.',
    },
  ],
};
