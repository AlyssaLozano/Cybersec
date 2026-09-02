/**
 * Scenario 73: Handover.
 *
 * You are inheriting three things from a night shift that has gone home. One of
 * the three is not what the note says it is.
 *
 * WHAT THIS TEACHES
 *
 * How to read somebody else's work, which is most of what an analyst actually
 * does and almost never gets taught.
 *
 * Every one of these notes was written in good faith by somebody competent at
 * five in the morning. None of them is a lie. What they have in common is that
 * a reasonable conclusion from partial information got written down as a
 * finished fact, and the sentence that records it gives no sign of which it
 * was. "Blocked by the firewall" and "escalated to the network team" and
 * "false positive, rule tuned" all read as completed work.
 *
 * THE TEST WORTH LEARNING
 *
 * Not whether the note is right. Whether the note is load-bearing. Three of
 * these claims are holding up a decision to stop looking, and a claim like that
 * is worth five minutes of checking no matter who wrote it. The rest of the
 * handover can be taken on trust, and taking it on trust is correct rather than
 * lazy.
 *
 * WHY THE OVER-CORRECTION IS ALSO A FAILURE
 *
 * Once one inherited note turns out to be wrong, the pull is to re-do all of
 * it. That burns the morning, insults a colleague who will read the case notes,
 * and finds nothing, because the other items are fine. Knowing when to stop
 * checking is the second half of the same skill.
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

const ID = 'handover';

export const HANDOVER: Scenario = {
  id: ID,
  title: 'Handover',
  difficulty: 'beginner',
  durationMinutes: 45,
  situation:
    'It is 07:05 at Ardal Freight. The night shift went home twenty minutes ago and left three ' +
    'items in the handover. All three are marked as dealt with.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'forensics',
    'detection-engineer',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Three handover items, all marked as dealt with',
      detail:
        'The overnight handover reads: (1) "Repeated inbound connection attempts to ADF-EDI-02 from ' +
        '203.0.113.51. Blocked by the firewall. No action." (2) "Certificate expiry warnings on the ' +
        'partner gateway. Escalated to the network team." (3) "Backup agent alerts on eleven hosts. ' +
        'False positive, rule tuned." The night shift was two people and the queue held 340 alerts. ' +
        'Rule history: handover items are not detections and nothing re-opens them automatically.',
      source: 'shift handover',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'Forty of sixty attempts were blocked',
      detail:
        'The firewall log records 60 connection attempts from 203.0.113.51 to ADF-EDI-02 between ' +
        '01:10 and 04:35. Forty were to port 22 and all forty were denied. Twenty were to port ' +
        '8443, which is permitted to that host because the partner EDI service listens on it, and ' +
        'all twenty were allowed. The night note is accurate about the forty and silent about the ' +
        'twenty.',
      source: 'perimeter firewall',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'network-flow',
      summary: 'What the twenty allowed connections did',
      detail:
        'The twenty permitted sessions to port 8443 each lasted between 2 and 4 seconds and ' +
        'transferred 900 bytes to 1.4 kilobytes. Nineteen received an HTTP 401. The twentieth, at ' +
        '04:31, received an HTTP 200 and transferred 340 kilobytes outbound over 26 seconds. The ' +
        'source has not returned since 04:35.',
      source: '203.0.113.51',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'alert-queue',
      summary: 'The network team never received the second item',
      detail:
        'The escalation was sent to network-ops@ardalfreight.example, a distribution list retired ' +
        'in March when the network team moved to a ticket queue. Mail to the old address is ' +
        'accepted and discarded silently, with no bounce. Four other escalations have been sent to ' +
        'it since March. The certificate on the partner gateway expires in six days.',
      source: 'mail gateway',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'The tuning was applied and reached further than intended',
      detail:
        'The suppression added at 03:50 matches on the backup agent process name. It correctly ' +
        'silences the eleven false positives. It also silences a separate rule that fires when that ' +
        'process writes outside its own directory, which is a different detection with a different ' +
        'purpose and has fired four times in the last year, twice on genuine findings. The ' +
        'suppression has no expiry.',
      source: 'detection platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'ADF-EDI-02 exchanges customs data with four partners',
      detail:
        'ADF-EDI-02 runs the partner EDI service that files customs declarations for four haulage ' +
        'partners, and the morning filing window opens at 08:00. Taking it off the network stops ' +
        'those filings. The 8443 service authenticates partners by client certificate and has no ' +
        'rate limit. The three staff who understand it start at 08:30.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 940,
      surface: 'alert-queue',
      summary: 'The night shift also closed nine other alerts',
      detail:
        'Beyond the three handover items, the night shift closed nine alerts during the shift. ' +
        'Sampling all nine: six are the nightly backup window, two are a monitoring agent restart ' +
        'covered by a change record, and one is a password spray against the guest wireless portal ' +
        'that has no route to anything. Each carries a one-line note naming the reason. All nine ' +
        'were correctly closed.',
      source: 'case management',
      claimedSeverity: 'low',
    },
  ],
};

export const HANDOVER_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Two people worked a night shift with 340 alerts in the queue and handed over three items, all marked as dealt with. All three notes were written in good faith and none is a lie.',
    'The first says inbound attempts from 203.0.113.51 were blocked by the firewall. Forty attempts to port 22 were denied. Twenty attempts to port 8443 were allowed, because the partner EDI service listens there. The note is accurate about the forty and silent about the twenty.',
    'Nineteen of the twenty got an HTTP 401. The twentieth, at 04:31, got an HTTP 200 and transferred 340 kilobytes outbound over 26 seconds.',
    'The second says the certificate expiry was escalated to the network team. It was sent to a distribution list retired in March, which accepts mail and discards it with no bounce. Four other escalations have gone the same way since. The certificate expires in six days.',
    'The third says a backup agent rule was tuned as a false positive. The suppression correctly silences the eleven false positives and also silences a separate detection for that process writing outside its own directory, which has fired four times in a year and twice on genuine findings. It has no expiry.',
    'Nine other alerts closed during the shift were all closed correctly, with a reason recorded on each.',
    'Nobody was careless. Each note records a reasonable conclusion from partial information, written in the same voice as a finished fact.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.investigate-hold', 'act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.tune'],
      escalateTo: ['log-analyst'],
      why:
        'Three items, all marked dealt with, from two people who worked a 340 alert queue overnight. ' +
        'The starting posture is not suspicion and it is not acceptance. It is a question about ' +
        'each note: is this holding up a decision to stop looking? All three are. Blocked, ' +
        'escalated and tuned each mean somebody else has it or it is finished, and each is the last ' +
        'thing anybody will ever look at on that item unless a person on this shift chooses to ' +
        'check. That makes them worth five minutes each regardless of who wrote them, and it is not ' +
        'a comment on the night shift: the same notes written by anybody in this room deserve the ' +
        'same five minutes. Do not reopen the whole night. Check the three that carry weight.',
      standIn:
        'Three handover items, all marked dealt with, from two people who had 340 alerts overnight. ' +
        'I am not suspicious and I am not just accepting them. The question on each one is whether ' +
        'it is holding up a decision to stop looking, and all three are: blocked, escalated and ' +
        'tuned all mean finished or somebody else has it. Five minutes each. Not because the night ' +
        'shift wrote them, the same notes from anyone here would get the same five minutes.',
      commandOptions: [
        { command: "awk -F, '$2==\"HANDOVER\" {print $1, $4, $5}' /var/log/cases/shift-log.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "blocked|escalated|tuned" /evidence/handover/2026-09-02-night.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status casemgmt', ...STATUS_CHECK },
        { command: 'cat /var/log/cases/shift-log.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/handover/2026-09-02-night.txt', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read the three notes and decide which of them stops anybody looking further.',
      guidance:
        'They are all marked done. Ask what each note is being relied on for.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1190'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.tune'],
      escalateTo: ['network-analyst', 'ir-lead'],
      why:
        'The note is true and incomplete, which is the hardest kind of wrong to catch. Sixty ' +
        'attempts: forty to port 22, all denied, which is exactly what the note describes. Twenty ' +
        'to port 8443, all allowed, because the partner EDI service legitimately listens there. ' +
        'Nothing in the note is false. What happened is that somebody at four in the morning ' +
        'searched the firewall log for that address, saw a screen of DENY, and wrote down what they ' +
        'saw, and the ALLOW lines were interleaved rather than absent. The habit worth taking from ' +
        'this is small and specific: when a note says blocked, ask blocked how many times out of ' +
        'how many, because blocked is a property of individual attempts and never of a source. ' +
        'Escalate on the twenty rather than the forty. The forty are the boring half.',
      standIn:
        'The note is true and it is not the whole thing. Sixty attempts from that address: forty to ' +
        'port 22, all denied, which is what the note says. Twenty to 8443, all allowed, because the ' +
        'partner EDI service actually listens there. Nothing in the note is false. Somebody at four ' +
        'in the morning searched that address, saw a screen full of DENY and wrote it down, and the ' +
        'ALLOW lines were mixed in rather than missing. Blocked is a property of an attempt, not of ' +
        'a source. It is the twenty I care about.',
      commandOptions: [
        { command: "awk '$5==\"203.0.113.51\" {print $7, $8}' /var/log/firewall/perimeter.log | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$5==\"203.0.113.51\" && $8==\"ALLOW\" {print $1, $7}' /var/log/firewall/perimeter.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewall', ...STATUS_CHECK },
        { command: 'cat /var/log/firewall/perimeter.log', ...DUMP_ALL },
        { command: 'grep -c 203.0.113.51 /var/log/firewall/perimeter.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count the attempts from that address by port and by whether they were allowed or denied.',
      guidance:
        'The note says blocked. Ask how many of them were.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1190', 'T1041'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.dismiss', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Nineteen failures and one success, and the one success is the incident. The nineteen each ' +
        'lasted two to four seconds, moved about a kilobyte, and came back 401, which is somebody ' +
        'trying credentials or certificates and being refused. The twentieth at 04:31 came back 200 ' +
        'and moved 340 kilobytes outbound over 26 seconds. That is not another attempt, it is a ' +
        'different kind of event: something was authorised and something was retrieved. The ' +
        'source has not come back since 04:35, which will be offered as reassurance and is the ' +
        'opposite: an attacker who stops immediately after one success has what they came for. ' +
        'Declare on this rather than continuing to characterise it, and note the timing for the ' +
        'readout, because 04:31 is nineteen minutes before the handover was written.',
      standIn:
        'Nineteen failures and one success, and the success is the incident. The nineteen are two to ' +
        'four seconds each, about a kilobyte, all 401, so somebody trying credentials and being ' +
        'refused. The twentieth at 04:31 came back 200 and moved 340 kilobytes out over 26 seconds. ' +
        'Something was authorised and something was retrieved. And they have not come back since ' +
        '04:35, which is not reassuring: somebody who stops right after one success has what they ' +
        'wanted. That was nineteen minutes before the handover was written.',
      commandOptions: [
        { command: "awk '$3==\"203.0.113.51\" {print $1, $6, $8}' /var/log/edi02/access.log", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"203.0.113.51\" && $6==200 {print $1, $8}' /var/log/edi02/access.log", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 203.0.113.51', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/edi02/access.log', ...DUMP_ALL },
        { command: 'grep -c 203.0.113.51 /var/log/edi02/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at the response code and the bytes transferred on each of the twenty sessions.',
      guidance:
        'Twenty connections got through. Ask what happened on each one.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'detection-engineer'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.tune'],
      escalateTo: ['ir-lead'],
      why:
        'The escalation was sent and nobody received it. The address was retired in March when the ' +
        'network team moved to a ticket queue, and mail to it is accepted and discarded with no ' +
        'bounce, which is the worst possible failure mode: a bounce would have told the sender ' +
        'within seconds. The night analyst did the right thing, did it correctly, and has no way of ' +
        'knowing it went nowhere. Four other escalations have gone the same way since March, which ' +
        'is the finding rather than this one certificate. Two consequences to carry: the ' +
        'certificate on the partner gateway expires in six days and now needs escalating again ' +
        'properly, and there are four other things somebody believes are being handled that are ' +
        'not. Chase both, and put the silent-discard in front of whoever owns the mail gateway, ' +
        'because it will keep doing this.',
      standIn:
        'It was escalated and nobody got it. That list was retired in March when the network team ' +
        'moved to a ticket queue, and mail to it is accepted and dropped with no bounce, which is ' +
        'the worst way for it to fail because a bounce would have told them immediately. The night ' +
        'analyst did the right thing and had no way to know. Four other escalations have gone the ' +
        'same way since March, and that is the actual finding. The certificate expires in six days ' +
        'and there are four other things somebody thinks are in hand.',
      commandOptions: [
        { command: 'grep -i "network-ops@" /var/log/mail/delivery.log | tail -10', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "network-ops" /evidence/mail/distribution-lists.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mailgw', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/delivery.log', ...DUMP_ALL },
        { command: 'grep -c network-ops /var/log/mail/delivery.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether that escalation address still delivers to anybody.',
      guidance:
        'It says escalated. Ask whether anybody received it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The tuning was correct and reached further than the person applying it could see. It ' +
        'matches on the backup agent process name, which silences the eleven genuine false ' +
        'positives exactly as intended, and also silences a separate detection for that same ' +
        'process writing outside its own directory. That second rule has a different purpose and ' +
        'has fired four times in a year, twice on genuine findings. Nothing about the night ' +
        'analyst\'s reasoning was wrong: they suppressed a noisy pattern at four in the morning, ' +
        'which is the job, and a suppression console does not tell you what else your match string ' +
        'catches. Two things follow. This particular suppression needs narrowing today so it stops ' +
        'covering the second rule. And the general one is worth more: a suppression with no expiry ' +
        'is a permanent change made under time pressure by one person with no review, which is the ' +
        'same shape as several other findings this floor has seen, and an expiry date turns it back ' +
        'into a decision somebody revisits.',
      standIn:
        'The tuning was right and it reached further than they could see. It matches on the backup ' +
        'agent process name, which kills the eleven false positives exactly as intended, and it ' +
        'also kills a separate rule for that process writing outside its own directory. That one ' +
        'has fired four times this year and twice it was real. Their reasoning was fine: they ' +
        'suppressed a noisy pattern at four in the morning, and the console does not tell you what ' +
        'else your match string catches. Narrowing it today. And it has no expiry, which makes it a ' +
        'permanent change made under time pressure with no review.',
      commandOptions: [
        { command: 'grep -A4 "03:50" /var/log/detection/suppressions.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3 ~ /backup-agent/ {print $2, $4}' /var/log/detection/rules.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/suppressions.log', ...DUMP_ALL },
        { command: 'detect-cli suppression delete --all', ...MUTATE },
      ],
      commandNudge:
        'Find out which rules that suppression matches, not just the one it was written for.',
      guidance:
        'A rule was tuned. Ask what else the tuning catches.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'exfiltration',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'network-analyst'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Taking the host off the network is available and stops customs filings for four haulage ' +
        'partners at 08:00, which is fifty-five minutes away, and the three people who understand ' +
        'the service start at 08:30. So the wide action costs a great deal and the narrow one costs ' +
        'nothing: block 203.0.113.51 at the perimeter, which stops this source without touching the ' +
        'service, takes two minutes and reverses in two. It is worth being honest in the readout ' +
        'that this is not containment of the incident, because whatever was retrieved at 04:31 is ' +
        'already gone and the source has not returned since. It buys time rather than fixing ' +
        'anything. The compensating control that matters more is the one this exposes: the 8443 ' +
        'service authenticates partners by client certificate and has no rate limit, so nineteen ' +
        'failed attempts followed by a success generated no alert and could run again from any ' +
        'other address this afternoon. Rate limit it before the window opens if that can be done ' +
        'without breaking partner filing, and if it cannot, say so and schedule it. Deliberately ' +
        'left undone: nobody knows what the 340 kilobytes was, and finding out needs the three ' +
        'people who arrive at 08:30.',
      standIn:
        'Do not pull the host. Customs filing for four partners opens at 08:00, that is fifty-five ' +
        'minutes, and the three people who understand this service get in at 08:30. Block the ' +
        'address at the perimeter instead: two minutes, reverses in two, does not touch the ' +
        'service. And I want it said plainly that this is not containment, because whatever left at ' +
        '04:31 is gone and they have not come back. It buys time. The thing that matters more is ' +
        'that 8443 authenticates by client certificate and has no rate limit, so nineteen failures ' +
        'then a success produced no alert and could run from a different address this afternoon. ' +
        'Left undone: nobody knows what those 340 kilobytes were until half eight.',
      commandNudge:
        'Find out what that host does for the business before you decide how to contain it.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.isolate', 'act.attribute-named'],
      escalateTo: [],
      why:
        'Nine other alerts closed overnight, and after finding one bad handover note the pull to ' +
        're-work all nine is strong and should be resisted. Sampling them takes a few minutes and ' +
        'they are fine: six are the nightly backup window, two are a monitoring agent restart with ' +
        'a change record, one is a password spray against a guest portal with no route to anything, ' +
        'and each carries a one-line note naming the reason. Closing them again is the correct ' +
        'outcome. This row exists because the lesson of the morning is easy to overshoot into ' +
        'distrusting a colleague, and that costs three ways: the morning goes on re-doing sound ' +
        'work, the actual incident on ADF-EDI-02 gets less attention than it needs, and the night ' +
        'analyst reads these case notes tomorrow. The finding was never that the night shift is ' +
        'unreliable. It was that three specific claims were holding up a decision to stop looking, ' +
        'and these nine are not.',
      standIn:
        'Nine other alerts closed overnight and I sampled all nine. Six are the backup window, two ' +
        'are a monitoring agent restart with a change record, one is a spray against the guest ' +
        'portal that routes nowhere, and every one has a note saying why. They stay closed. I know ' +
        'the temptation after this morning is to re-work the lot, and that costs us the morning, ' +
        'costs EDI-02 the attention it needs, and the night analyst reads these notes tomorrow. The ' +
        'finding was three claims holding up a decision to stop looking. Not that they are ' +
        'unreliable.',
      commandOptions: [
        { command: "awk -F, '$3==\"CLOSED\" && $1 ~ /0[0-6]:/ {print $4, $6}' /var/log/cases/shift-log.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "CLOSED" /var/log/cases/shift-log.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status casemgmt', ...STATUS_CHECK },
        { command: 'cat /var/log/cases/shift-log.csv', ...DUMP_ALL },
        { command: 'case-cli reopen --shift night --all', ...MUTATE },
      ],
      commandNudge:
        'Sample the nine closed alerts and check the reason recorded on each.',
      guidance:
        'One note was wrong. Ask whether that means all of them are.',
    },
  ],
};
