/**
 * Scenario 53: The Open Door.
 *
 * An external intrusion that worked first time, and an internal account that
 * was in the right place twelve minutes earlier.
 *
 * WHAT THIS TEACHES
 *
 * Correlating internal and external activity, and then refusing to draw the
 * conclusion the correlation invites.
 *
 * The timing is genuinely evidential. An administrator opened the credential
 * vault at 09:47, an external address authenticated to the payments gateway at
 * 09:59 with the right credential on the first attempt and no failures, and the
 * day before, the same account had queried which systems the monitoring platform
 * covers. Any one of those is unremarkable. In that order, twelve minutes apart,
 * they are a sequence.
 *
 * WHAT THE SEQUENCE DOES NOT ESTABLISH
 *
 * Whether the administrator did it knowingly. That is the whole scenario. A
 * phishing message three weeks ago, opened and never reported, is exactly what
 * a paid accomplice looks like and exactly what an unwitting victim looks like,
 * and every technical fact on this board fits both. A floor that reads
 * coordination and concludes collusion has accused a colleague of a criminal
 * offence on evidence that supports a much more ordinary explanation.
 *
 * So the finding is the coordination, stated plainly and with confidence. The
 * motive is a question for people with powers this floor does not have, and
 * saying so is the correct output rather than a failure to reach one.
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

const ID = 'the-open-door';

export const THE_OPEN_DOOR: Scenario = {
  id: ID,
  title: 'The Open Door',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 11:30 at Fenmarch Credit Union. Somebody signed in to the payments gateway from outside ' +
    'the estate this morning and it worked on the first attempt. Nothing was guessed.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
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
      summary: 'Payments gateway administration accessed from an external address at 09:59',
      detail:
        'The payments gateway administration interface accepted a session at 09:59 from ' +
        '203.0.113.132, authenticating as svc-pay-admin. The interface is not published to the ' +
        'internet and is reachable only through the administrative VPN, which this session used ' +
        'with valid credentials. No failed attempt preceded it. Rule history: fired 8 times in ' +
        'thirty days, 6 closed as engineers connecting from home.',
      source: '203.0.113.132',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'The credential vault was opened at 09:47 by an infrastructure administrator',
      detail:
        'The privileged credential vault records the svc-pay-admin entry being retrieved at 09:47 ' +
        'by k.deverell, an infrastructure administrator, from a workstation in the Norwich office. ' +
        'Retrieval is permitted for that role and requires no approval or ticket reference. The ' +
        'account retrieves credentials from the vault around forty times a month as part of routine ' +
        'work.',
      source: 'k.deverell',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'network-flow',
      summary: 'The external address has no history and made no reconnaissance',
      detail:
        '203.0.113.132 appears nowhere in ninety days of estate traffic before 09:58. It connected ' +
        'once, authenticated once, and went straight to the payments gateway administration path ' +
        'with no scanning, no enumeration and no wrong turns. It knew the VPN endpoint, the ' +
        'interface path and the credential before it connected.',
      source: '203.0.113.132',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'cloud-audit',
      summary: 'The same account queried monitoring coverage the previous afternoon',
      detail:
        'On Tuesday at 16:20 the k.deverell account ran a series of queries against the monitoring ' +
        'platform configuration, listing which systems have alerting enabled and which have log ' +
        'forwarding configured. The payments gateway appears in the results as forwarding logs but ' +
        'having no alerting rules. Those queries are available to any administrator and are used ' +
        'when onboarding a system.',
      source: 'k.deverell',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'A phishing message received three weeks ago, opened, never reported',
      detail:
        'The mailbox holds a message received on 26 August, opened the same day, presenting a ' +
        'credential prompt for the administrative VPN. It was not reported. Eleven other staff ' +
        'received the same message and nine reported it. The workstation browser history shows the ' +
        'linked page loaded on 26 August and a form submission of roughly 300 bytes forty seconds ' +
        'later.',
      source: 'FCU-WS-2277',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'The evidence fits collusion and it fits compromise',
      detail:
        'Both readings account for every fact. A paid accomplice retrieves a credential, checks ' +
        'monitoring coverage first, and ignores a phishing message they were expecting. An ' +
        'unwitting victim submits credentials to a convincing page, is watched from that point, and ' +
        'runs ordinary queries that are useful to whoever is watching. Nothing on this board ' +
        'distinguishes them: there is no communication, no payment record and no admission, and ' +
        'obtaining any of those requires powers this floor does not hold.',
      source: 'incident assessment',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Nineteen credential retrievals from the vault this morning',
      detail:
        'Nineteen credentials were retrieved from the vault by six administrators between 08:00 and ' +
        '11:00, which is a normal morning. Seventeen carry a ticket reference in the retrieval note ' +
        'and all six accounts connected from office ranges. None of the retrieved credentials was ' +
        'subsequently used from outside the estate. Rule history: vault retrievals are logged and ' +
        'no rule fires on them.',
      source: 'credential vault',
      claimedSeverity: 'low',
    },
  ],
};

export const THE_OPEN_DOOR_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On 26 August a phishing message presenting an administrative VPN credential prompt reached twelve staff. Nine reported it. One infrastructure administrator opened it, loaded the linked page and submitted a form.',
    'On Tuesday afternoon that account ran monitoring configuration queries, and the results show the payments gateway forwarding logs but having no alerting rules.',
    'On Wednesday at 09:47 the account retrieved the payments gateway administrator credential from the vault, which it does around forty times a month and which needs no approval or ticket.',
    'At 09:59 an external address with no history in ninety days connected once, authenticated once, and went straight to the payments gateway administration path with no scanning and no wrong turns.',
    'It knew the VPN endpoint, the interface path and the credential before it connected. Nothing was guessed and nothing failed.',
    'The sequence is real and the correlation is strong: three actions in the right order, twelve minutes apart at the closest point.',
    'Whether the administrator did any of it knowingly is not established. A paid accomplice and a person whose credentials were taken in August produce exactly this evidence.',
    'There is no communication, no payment record and no admission anywhere in reach of this floor, and getting any of those needs powers it does not have.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1078.004'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.reset-password', 'act.isolate'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'Six of eight this month were engineers connecting from home, and this looks like the ' +
        'seventh until you read one field. No failed attempt preceded it. An engineer connecting ' +
        'from home occasionally mistypes; something that authenticates correctly on the first ' +
        'attempt to an interface that is not published anywhere already had the credential. That is ' +
        'the difference between somebody guessing and somebody being given, and it is available in ' +
        'the first minute. Declare on it: this is the payments gateway at a credit union, and the ' +
        'question of how they got the credential can be answered after the session is closed.',
      standIn:
        'Payments gateway administration accepted a session at 09:59 from an external address, ' +
        'authenticating as svc-pay-admin through the admin VPN with valid credentials. No failed ' +
        'attempt before it. Six of eight this month were engineers at home, and engineers mistype. ' +
        'This did not. Declaring.',
      commandOptions: [
        { command: "awk '$5==\"svc-pay-admin\" {print $1, $3, $7}' /var/log/gateway/auth.log | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 203.0.113.132 /var/log/gateway/auth.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status pay-gateway', ...STATUS_CHECK },
        { command: 'cat /var/log/gateway/auth.log', ...DUMP_ALL },
        { command: 'iptables -A INPUT -s 203.0.113.132 -j DROP', ...MUTATE },
      ],
      commandNudge:
        'Check whether anything failed before that session succeeded.',
      guidance:
        'Ask whether they guessed the credential or already had it. Failed attempts tell you which.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1555'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['fusion-analyst', 'ir-lead'],
      why:
        'Twelve minutes, and that is the whole finding on this row. The credential used externally ' +
        'at 09:59 was retrieved from the vault at 09:47 by a named internal account. Everything ' +
        'about the retrieval is ordinary: permitted for the role, no approval required, no ticket ' +
        'reference needed, and the account does it forty times a month. So the retrieval on its own ' +
        'is invisible and always was. What makes it evidence is the pairing, and the pairing is ' +
        'only visible to somebody who thinks to ask where the credential came from rather than ' +
        'where the session came from. Resist naming this person as anything yet: a retrieval and a ' +
        'use twelve minutes apart is a sequence, and a sequence is not an intention.',
      standIn:
        'The credential used at 09:59 was pulled from the vault at 09:47 by k.deverell, an ' +
        'infrastructure administrator, from a Norwich workstation. Twelve minutes. The retrieval ' +
        'itself is completely ordinary: permitted, no approval, no ticket needed, and that account ' +
        'does it forty times a month. The pairing is the finding, not the retrieval, and I am not ' +
        'calling them anything yet.',
      commandOptions: [
        { command: "awk '$4==\"RETRIEVE\" && $6 ~ /pay-admin/ {print $1, $3}' /var/log/vault/access.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "svc-pay-admin" /var/log/vault/access.log | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vault', ...STATUS_CHECK },
        { command: 'cat /var/log/vault/access.log', ...DUMP_ALL },
        { command: 'grep -c RETRIEVE /var/log/vault/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find where that credential is stored and who took it out today.',
      guidance:
        'They already had the credential. Ask where it lives and who could have got it.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1078.004'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'An absence doing the work of a presence. No scanning, no enumeration, no wrong turns, and ' +
        'no history for that address in ninety days. Attackers who find their way in leave a trail ' +
        'of finding: ports tried, paths guessed, a failed login on the wrong interface. This one ' +
        'connected once and went straight there, which means it knew the VPN endpoint, the ' +
        'administration path and the credential before it started. Three pieces of internal ' +
        'knowledge, none of which is published, and that is what makes this an internal question ' +
        'rather than an external one. Worth saying carefully: knowledge reached them, and how it ' +
        'reached them is exactly what is not yet established.',
      standIn:
        'That address appears nowhere in ninety days before 09:58. One connection, one ' +
        'authentication, straight to the payments gateway admin path. No scanning, no enumeration, ' +
        'no wrong turns. It knew the VPN endpoint, the path and the credential before it connected. ' +
        'None of those three is published. That knowledge came from inside, and how it got there is ' +
        'the open question.',
      commandOptions: [
        { command: "awk '$3==\"203.0.113.132\" {print $1, $5, $7}' /var/log/flows.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c 203.0.113.132 /var/log/flows-archive.log', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'nmap -sT 203.0.113.132', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Look for what that address did BEFORE it succeeded, and note if there is nothing.',
      guidance:
        'Attackers usually leave a trail of looking. Ask what this one tried before it worked.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'discovery',
      techniques: ['T1518.001'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.attribute-named', 'act.reset-password', 'act.isolate', 'act.dismiss'],
      escalateTo: ['fusion-analyst', 'ir-lead'],
      why:
        'The third element of the sequence, and the most easily over-read on the board. The account ' +
        'listed which systems have alerting and which have log forwarding, the afternoon before, ' +
        'and the results show the payments gateway forwarding logs with no alerting rules. That is ' +
        'precisely the system that was then used, which is why it belongs in the timeline. It is ' +
        'also a query any administrator can run and routinely does when onboarding a system, so it ' +
        'is only meaningful in combination. Two readings again and both fit: somebody establishing ' +
        'where nobody is watching, or somebody doing onboarding work whose screen was being ' +
        'watched. Record it as part of the sequence and do not let it carry more weight than the ' +
        'other two.',
      standIn:
        'On Tuesday at 16:20 the same account listed which systems have alerting and which forward ' +
        'logs. The payments gateway comes back as forwarding but with no alerting rules, and that ' +
        'is the system used the next morning. Any administrator can run that query and they do it ' +
        'for onboarding. It belongs in the sequence and it does not mean more than the other two.',
      commandNudge:
        'Find out what that account was looking at the day before, and whether the answer names the ' +
        'system that was used.',
      guidance:
        'Ask what somebody would want to know before choosing a target. Then check whether anybody ' +
        'asked it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1566.002'],
      firstResponder: 'forensics',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.reimage-now', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The event that makes the innocent reading real rather than theoretical, and the numbers are ' +
        'the interesting part. A phishing message on 26 August presenting an administrative VPN ' +
        'credential prompt, opened the same day, the linked page loaded, a form submission of ' +
        'roughly 300 bytes forty seconds later. That is a credential being typed into somebody ' +
        'else page, three weeks before today. Eleven others got it and nine reported it, so not ' +
        'reporting puts this account in a minority of three rather than alone. Every fact here fits ' +
        'a person who fell for a convincing page and was too embarrassed to say, and every fact ' +
        'fits an accomplice ignoring a message they knew was coming. Preserve it and state it ' +
        'flatly, because it is the single piece of evidence most likely to be misread in either ' +
        'direction.',
      standIn:
        'There is a phishing message from 26 August in that mailbox presenting an admin VPN ' +
        'credential prompt. Opened the same day, page loaded, form submission of about 300 bytes ' +
        'forty seconds later. That is a credential being typed into somebody else page three weeks ' +
        'ago. Eleven others got it and nine reported it. It fits somebody who fell for it and was ' +
        'embarrassed, and it fits somebody who knew it was coming. Sealed.',
      commandOptions: [
        { command: 'grep -A6 "2026-08-26" /var/log/mail/inbound.log | grep -i deverell', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"FCU-WS-2277\" && $1 ~ /08-26/ {print $5, $7}' /var/log/proxy/access.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mailgw', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/inbound.log', ...DUMP_ALL },
        { command: 'curl -s https://203.0.113.44/vpn-login', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Look further back than today. Check whether that account has been targeted before.',
      guidance:
        'Before you decide somebody helped, ask whether somebody took it from them.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1078.004'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The output of the hour, and it is a refusal as much as a conclusion. The coordination is ' +
        'established and should be stated with confidence: three actions in the right order, twelve ' +
        'minutes apart at the closest point, using knowledge that is not published. What is not ' +
        'established is whether the administrator did any of it knowingly, and both readings account ' +
        'for every fact on the board. A paid accomplice checks monitoring coverage first, retrieves ' +
        'the credential, and ignores a message they were expecting. A person phished in August is ' +
        'watched from that point, and their ordinary queries and ordinary retrievals are useful to ' +
        'whoever is watching. There is no communication, no payment record and no admission ' +
        'anywhere this floor can reach, and obtaining any of them needs powers it does not have. So ' +
        'the report says coordination at high confidence, motive not established, and names the ' +
        'account rather than accusing the person. Getting that wrong in the confident direction ' +
        'accuses a colleague of a criminal offence on a timeline.',
      standIn:
        'Coordination is established and I will say so with confidence: three actions in order, ' +
        'twelve minutes apart at the closest, using knowledge that is not published anywhere. ' +
        'Whether he did it knowingly is not established and both readings fit every fact. No ' +
        'communications, no payment record, no admission, and getting those is not something we ' +
        'can do. Coordination high confidence, motive not established, and we name the account and ' +
        'not the man.',
      commandNudge:
        'Line the internal and external events up on one timeline, then write down what it does not ' +
        'tell you.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'Nineteen credential retrievals by six administrators in three hours, which is a normal ' +
        'morning and looks alarming only after ev.2. Seventeen carry a ticket reference, all six ' +
        'accounts connected from office ranges, and none of the retrieved credentials was used from ' +
        'outside the estate. That last check is the discriminator and it is the same one that made ' +
        'ev.2 matter: a retrieval is meaningless on its own and only becomes evidence when paired ' +
        'with an external use. This row exists because a floor that has just found a vault ' +
        'retrieval tied to an intrusion will want to treat every retrieval as suspect, and six ' +
        'administrators doing their jobs would be dragged into an investigation on nothing.',
      standIn:
        'Nineteen vault retrievals by six administrators between 08:00 and 11:00 is a normal ' +
        'morning. Seventeen have a ticket reference, all six connected from office ranges, and none ' +
        'of those credentials was used from outside the estate. That last one is the difference. A ' +
        'retrieval only means something paired with an external use. Closing it.',
      commandOptions: [
        { command: "awk '$4==\"RETRIEVE\" {print $3, $6}' /var/log/vault/access.log | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i ticket /var/log/vault/access.log | wc -l', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vault', ...STATUS_CHECK },
        { command: 'cat /var/log/vault/access.log', ...DUMP_ALL },
        { command: 'grep -c RETRIEVE /var/log/vault/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether any of the other retrieved credentials were used from outside the estate.',
      guidance:
        'You just found one retrieval that mattered. Ask what made it different from the other ' +
        'eighteen.',
    },
  ],
};
