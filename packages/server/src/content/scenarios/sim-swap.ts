/**
 * Scenario 88: The Phone Number Was The Password.
 *
 * Every authentication record on this board says the login was legitimate,
 * and the second factor was taken at a mobile phone shop.
 *
 * WHAT THIS TEACHES
 *
 * That a control you did not build and cannot see is not a control you have.
 * Ridgeline requires a second factor, the second factor was supplied, and the
 * platform is telling the truth when it reports a successful challenge: a code
 * went to the registered number and the correct code came back. The failure
 * happened at a carrier, in a shop, to a person whose name nobody in this room
 * knows, and there is no log for it anywhere in the estate.
 *
 * THE TELL IS NOT IN THE SECURITY DATA
 *
 * What breaks this open is a sentence from the account holder about losing
 * signal that morning, which is not an alert, is not on any dashboard, and
 * arrives only if somebody rings her. A room that works this from the
 * authentication logs alone will conclude the login was fine, because
 * according to the authentication logs the login was fine.
 *
 * THE PART EVERYBODY GETS WRONG
 *
 * Ridgeline migrated to an authenticator app last year and reports full
 * coverage. The recovery flow still falls back to SMS for every account,
 * including the migrated ones, so the weakest factor was never removed. It was
 * moved to a path nobody measures.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  BROAD_SEARCH,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
} from './distractors.js';

const ID = 'the-phone-number-was-the-password';

export const THE_PHONE_NUMBER_WAS_THE_PASSWORD: Scenario = {
  id: ID,
  title: 'The Phone Number Was The Password',
  difficulty: 'advanced',
  durationMinutes: 70,
  situation:
    'It is 11:20 at Ridgeline Medical. An account with multi-factor authentication enabled was ' +
    'taken over this morning, and every record we hold says the login was legitimate.',
  roles: [
    'soc-operator',
    'log-analyst',
    'cloud-security',
    'threat-intel',
    'network-analyst',
    'detection-engineer',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'cloud-audit',
      summary: 'A password reset and a clean second factor, from a new city',
      detail:
        'At 08:12 the account of J. Ilori, finance manager, completed a self-service password reset, ' +
        'then authenticated from 203.0.113.77 in a city she has never signed in from. The identity ' +
        'platform records the second factor as satisfied: an SMS code was sent to the registered ' +
        'number and the correct code was submitted 41 seconds later. Since then the session has ' +
        'opened the supplier payment system twice.',
      source: 'identity platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 180,
      surface: 'alert-queue',
      summary: 'She lost mobile signal at about eight this morning',
      detail:
        'Rung on her desk phone, Ilori says she is at her usual desk, has not travelled, has not ' +
        'reset her password, and that her mobile stopped having any signal at around 08:00. She ' +
        'assumed it was the building and was going to visit the shop at lunchtime. She has had no ' +
        'calls or messages since.',
      source: 'account holder',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 360,
      surface: 'raw-log',
      summary: 'The reset was authorised by the same number that carried the code',
      detail:
        'The self-service reset flow verifies identity by sending a code to the registered mobile ' +
        'number, then issues a new password. The same number then received the login challenge. ' +
        'Both messages were delivered and both codes were entered correctly. Whoever held that ' +
        'number at 08:12 held both the reset and the second factor.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 550,
      surface: 'cloud-audit',
      summary: 'The authenticator app rollout does not remove the SMS path',
      detail:
        'Ridgeline moved to an authenticator app in November and reports 100 per cent coverage. ' +
        'Ilori is enrolled and uses it daily. The account recovery flow falls back to SMS for every ' +
        'account regardless of enrolment, because removing it locked people out during the ' +
        'rollout and the exception was made permanent. 1,100 accounts have the app. All 1,100 have ' +
        'the fallback.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 740,
      surface: 'network-flow',
      summary: 'The session went straight to the payment system',
      detail:
        'The session opened the supplier payment system within ninety seconds of authenticating, ' +
        'viewed the pending payment run, and changed the bank details on one supplier record. It ' +
        'opened nothing else. The payment run is released at 14:00 and the amended record is in it ' +
        'for 43,900 dollars.',
      source: 'payment system',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 930,
      surface: 'cloud-audit',
      summary: 'A second account with the same pattern, which is a new phone',
      detail:
        'B. Achterberg in radiology also completed a self-service reset this morning at 09:40 and ' +
        'authenticated by SMS from an address he has not used before. He is on the ward and ' +
        'confirms he did it: his phone was replaced yesterday, the authenticator app did not ' +
        'migrate, and he used the recovery flow from the guest wireless to get back in.',
      source: 'identity platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 1120,
      surface: 'alert-queue',
      summary: 'Nothing at Ridgeline can see or stop what happened at the carrier',
      detail:
        'The number was ported or re-issued by the mobile carrier. Ridgeline has no relationship ' +
        'with that carrier, no visibility of the port, and no way to be notified of one. A port ' +
        'authorisation lock can be requested by the subscriber and cannot be requested by an ' +
        'employer. Some carriers expose a recent-port signal to enterprise customers and this ' +
        'one does not.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1310,
      surface: 'alert-queue',
      summary: 'What can be changed today, and what it costs',
      detail:
        'The SMS fallback can be disabled for a named group in minutes, and for everybody in about ' +
        'an hour, which will lock out anybody who loses a device until a person verifies them. The ' +
        'help desk has two people. Supplier bank detail changes can be put behind a second approver ' +
        'today. The 14:00 payment run can be held. Ilori sessions can be revoked and her number ' +
        'removed from the account immediately.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1500,
      surface: 'alert-queue',
      summary: 'Coverage is reported as complete because the metric counts enrolment',
      detail:
        'The security dashboard shows multi-factor coverage at 100 per cent, which is true: every ' +
        'account is enrolled in the app. It does not report how many accounts can authenticate by ' +
        'SMS, which is also every account. No metric anywhere distinguishes the factor somebody ' +
        'normally uses from the weakest factor their account will accept.',
      source: 'security programme',
      claimedSeverity: 'high',
    },
  ],
};

export const THE_PHONE_NUMBER_WAS_THE_PASSWORD_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At about 08:00 somebody persuaded a mobile carrier to move J. Ilori number onto a SIM they controlled. Her handset lost signal, she assumed it was the building, and she planned to visit the shop at lunchtime.',
    'At 08:12 they used the Ridgeline self-service reset flow, which verifies identity by sending a code to the registered mobile number. They received that code, set a new password, then authenticated and received the login challenge on the same number. Both codes were correct. The identity platform records a satisfied second factor and is telling the truth.',
    'So every authentication record Ridgeline holds says the login was legitimate, and a room working from those logs alone will conclude it was. What breaks it open is a sentence from Ilori about losing signal, which is not an alert, is on no dashboard, and arrives only because somebody rang her desk.',
    'Ridgeline moved to an authenticator app in November and reports 100 per cent coverage, which is true. The recovery flow still falls back to SMS for all 1,100 accounts, because removing it locked people out during the rollout and the exception became permanent. The weakest factor was not removed, it was moved to a path nobody measures.',
    'The session went straight to the supplier payment system, viewed the pending run, changed the bank details on one supplier record, and opened nothing else. That record is in the 14:00 run for 43,900 dollars.',
    'B. Achterberg in radiology matches the same pattern this morning and is genuine: his phone was replaced yesterday, the app did not migrate, and he used the recovery flow from guest wireless. That is the flow working as designed, which is the problem rather than a reassurance.',
    'Nothing at Ridgeline can see or prevent the carrier side. There is no relationship with that carrier, no port notification, and a port lock can only be requested by the subscriber. Some carriers expose a recent-port signal to enterprises and this one does not.',
    'Everything remediable is on the Ridgeline side and most of it is quick: hold the payment run, revoke the sessions, remove the number, put supplier bank changes behind a second approver, and disable the SMS fallback for the finance group first and everybody after, at the cost of lockouts landing on a help desk with two people.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1621', 'T1078'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'A reset, a clean second factor and a new city, and the platform is reporting all three ' +
        'honestly. That is what makes this hard: there is no failed challenge, no anomaly flag and ' +
        'nothing malformed, so a room reading the authentication record gets a legitimate login. ' +
        'What should stop somebody is the shape rather than any single field: a self-service reset ' +
        'and a first-ever location in the same minute, on a finance manager, at ten past eight. ' +
        'Raise it and hold it, and be explicit that nothing so far proves anything, because the ' +
        'temptation is to either close it as travel or declare a compromise on a pattern. The ' +
        'action that settles it is not in this console. Somebody has to ring her.',
      standIn:
        'Reset, clean second factor, new city, and the platform is telling the truth about all three. ' +
        'That is what makes it hard. No failed challenge, no anomaly, nothing malformed, so on the ' +
        'record this is a legitimate login. What should stop you is the shape: self-service reset ' +
        'and a first-ever location in the same minute, on a finance manager, at ten past eight. ' +
        'Raising it and holding it. Nothing here proves anything yet, and the thing that settles it ' +
        'is not in this console. Somebody ring her desk.',
      commandOptions: [
        { command: "jq -r '.events[] | select(.user==\"j.ilori\") | \"\\(.time) \\(.type) \\(.ip) \\(.mfa)\"' /evidence/identity/audit.json", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i 'j.ilori' /evidence/identity/signins.csv | cut -d, -f1,2,4,6", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/audit.json', ...DUMP_ALL },
        { command: 'idp-cli user reset-password j.ilori', ...MUTATE },
      ],
      commandNudge:
        'Put the reset and the login side by side and look at how far apart they are.',
      guidance:
        'The second factor passed. Ask what that establishes.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1621'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.corroborate', 'act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'One sentence, and it is the whole case: her mobile lost signal at about eight, an hour ' +
        'before a code was delivered to that number and entered correctly. A phone that stops ' +
        'receiving anything at the moment somebody else starts receiving its messages is a SIM ' +
        'taken over at the carrier, and everything else on the board follows from it. Two things ' +
        'are worth taking away beyond the answer. The first is where this came from: not an alert, ' +
        'not a dashboard, not the identity platform, but a person answering a desk phone, and the ' +
        'only reason it exists is that somebody rang her instead of reading logs for another forty ' +
        'minutes. The second is what she did with it, which was nothing, because losing signal is ' +
        'an ordinary annoyance and there is no reason a finance manager should read it as an ' +
        'attack. Nobody trained her to. That is a gap in what people are told, not a failure on ' +
        'her part.',
      standIn:
        'One sentence and it is the whole case. Her mobile lost signal at about eight, an hour before ' +
        'a code went to that number and came back correct. A phone that stops receiving anything ' +
        'exactly when somebody else starts receiving its messages is a SIM taken over at the ' +
        'carrier. Two things to take from this. It did not come from an alert or a dashboard, it ' +
        'came from ringing her desk instead of reading logs for another forty minutes. And she did ' +
        'nothing with it, because losing signal is an annoyance and nobody ever told her it could be ' +
        'an attack. That is on us, not her.',
      commandOptions: [
        { command: "grep -iE 'delivered|sent' /evidence/identity/sms-delivery.log | grep '07:5\\|08:0\\|08:1'", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.deliveries[] | select(.msisdn==\"REGISTERED\") | \"\\(.time) \\(.status)\"' /evidence/identity/sms-delivery.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sms-gateway', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/sms-delivery.log', ...DUMP_ALL },
        { command: 'grep -rn "signal" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Line up when her handset went quiet against when the codes were delivered.',
      guidance:
        'She lost signal at eight. Ask what happened to that number afterwards.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.chain', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'The design fault, stated plainly: the reset flow proves identity with the same number that ' +
        'later supplies the second factor. Whoever held that SIM at 08:12 held both, so what looks ' +
        'like two independent checks was one check counted twice. That is the transferable idea and ' +
        'it is worth more than the SIM swap itself, because the pattern turns up everywhere. Two ' +
        'factors that depend on the same thing are one factor with paperwork, and the dependency is ' +
        'usually invisible on the diagram: here the diagram shows a password and a phone, and the ' +
        'password was obtained using the phone. Whenever you are told something has two ' +
        'independent controls, ask what happens if one shared component is taken, and count the ' +
        'recovery path as a control, because it is the one that gets left out.',
      standIn:
        'Here is the design fault. The reset proves identity with the same number that then supplies ' +
        'the second factor, so whoever held that SIM at 08:12 held both, and two independent checks ' +
        'was one check counted twice. That idea is worth more than the SIM swap. Two factors that ' +
        'depend on the same thing are one factor with paperwork, and the dependency never shows on ' +
        'the diagram. Ours shows a password and a phone, and the password was obtained with the ' +
        'phone. Any time somebody tells you there are two independent controls, ask what one shared ' +
        'component takes out, and count the recovery path, because it is the one left off.',
      commandOptions: [
        { command: "grep -iE 'verify|challenge|channel' /evidence/identity/recovery-flow.yaml", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.flows[] | \"\\(.name): \\(.factors|join(\\\" + \\\"))\"' /evidence/identity/flows.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/recovery-flow.yaml', ...DUMP_ALL },
        { command: 'grep -c sms /evidence/identity/recovery-flow.yaml', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read the reset flow and the login flow, and see what they have in common.',
      guidance:
        'Two checks were passed. Ask whether they were independent.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['detection-engineer', 'mitigation-specialist'],
      correctActions: ['act.scope-estate', 'act.iam-audit', 'act.predict'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The rollout everybody remembers as finished. Eleven hundred accounts have the authenticator ' +
        'app, Ilori uses hers daily, and every one of those accounts also has an SMS path through ' +
        'recovery, because removing it locked people out during the migration and the exception ' +
        'became permanent in the way that temporary exceptions do. So the November project did not ' +
        'remove the weak factor, it moved it somewhere nobody looks: the strong factor is what ' +
        'people use and the weak one is what the account will still accept. An attacker only ever ' +
        'has to beat the weakest thing an account accepts, which means the number worth knowing is ' +
        'not how many accounts have the app but how many can be authenticated without it, and the ' +
        'answer here is all of them. Say the eleven hundred out loud, because Ilori is not one ' +
        'unlucky account and treating this as her incident is how the room misses that.',
      standIn:
        'This is the rollout everyone remembers as finished. Eleven hundred accounts have the app, ' +
        'she uses hers every day, and all eleven hundred still have SMS through recovery, because ' +
        'removing it locked people out during migration and the exception became permanent the way ' +
        'they do. November did not remove the weak factor, it moved it where nobody looks. The ' +
        'strong factor is what people use, the weak one is what the account accepts, and an attacker ' +
        'only has to beat the second. So the number is not how many have the app, it is how many can ' +
        'get in without it, and that is all of them. Ilori is not one unlucky account.',
      commandOptions: [
        { command: "jq -r '[.users[] | select(.recovery|index(\"sms\"))] | length' /evidence/identity/users.json", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4 ~ /sms/ {n++} END {print n}' /evidence/identity/user-factors.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/users.json', ...DUMP_ALL },
        { command: 'idp-cli policy set recovery.sms disabled --all', ...MUTATE },
      ],
      commandNudge:
        'Count how many accounts can still be authenticated by SMS, whatever they normally use.',
      guidance:
        'Everybody has the app. Ask what else their account accepts.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1565.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.timeline', 'act.corroborate', 'act.contain-scoped'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.tune'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'Ninety seconds from authenticating to the payment system, one supplier record amended, ' +
        'nothing else opened. That focus is the finding: this was not somebody exploring an account ' +
        'to see what it could do, it was somebody who knew what this account was for before they ' +
        'took it, which says the target was chosen and the SIM swap was arranged around it. The ' +
        'urgent fact is the clock rather than the technique. The amended record is in a run that ' +
        'releases at 14:00 for 43,900 dollars, so there are under three hours and the action that ' +
        'matters most today is holding a payment run, which is not a security control and is not ' +
        'this room to press. Somebody in finance has to be told now, in those words, and the ' +
        'temptation to finish understanding the intrusion first is how the money leaves while the ' +
        'timeline is being tidied.',
      standIn:
        'Ninety seconds from login to the payment system, one supplier record changed, nothing else ' +
        'opened. That focus is the finding: nobody was exploring, they knew what this account was ' +
        'for before they took it, so the target was picked and the SIM swap was arranged around it. ' +
        'And the urgent thing is the clock, not the technique. That record is in a run releasing at ' +
        'two for 43,900 dollars. Under three hours. The most important action today is holding a ' +
        'payment run, which is not a security control and not ours to press, so finance gets told ' +
        'now. Finishing the intrusion story first is how the money leaves.',
      commandOptions: [
        { command: "grep -iE 'supplier|bank|amend' /evidence/payments/audit-today.log | head", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.changes[] | select(.by==\"j.ilori\") | \"\\(.time) \\(.record) \\(.field)\"' /evidence/payments/changes.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status payments', ...STATUS_CHECK },
        { command: 'cat /evidence/payments/audit-today.log', ...DUMP_ALL },
        { command: 'curl -s http://203.0.113.77/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find what the session actually changed, and when that change takes effect.',
      guidance:
        'They got in. Ask what they went to first.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'log-analyst'],
      correctActions: ['act.corroborate', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'Same pattern, genuine person. Achterberg replaced his phone yesterday, the app did not ' +
        'migrate, and he used the recovery flow from guest wireless, which explains the reset, the ' +
        'SMS and the unfamiliar address in one sentence. Close it, and notice what closing it costs ' +
        'to establish: a phone call, because nothing in the data distinguishes his morning from ' +
        'hers. That is the uncomfortable part and it is the real lesson of this row. The signal ' +
        'everybody will want to build a rule on is reset plus SMS plus new address, and here it ' +
        'fires identically on a compromise and on a man who dropped his phone. His case is also the ' +
        'reason the fallback exists at all, so anybody about to argue for removing it has just met ' +
        'the person it was kept for, and should hold both facts at once rather than picking the ' +
        'convenient one.',
      standIn:
        'Same pattern, real person. New phone yesterday, app did not migrate, recovery flow from ' +
        'guest wireless. That explains the reset, the SMS and the strange address in one sentence. ' +
        'Closing it. Notice what it cost to close: a phone call, because nothing in the data tells ' +
        'his morning from hers. The rule everybody wants to write is reset plus SMS plus new ' +
        'address, and it fires the same on a compromise and on a man who dropped his phone. He is ' +
        'also exactly who the fallback was kept for, so whoever argues for removing it has just met ' +
        'him. Hold both.',
      commandOptions: [
        { command: "jq -r '.events[] | select(.user==\"b.achterberg\") | \"\\(.time) \\(.type) \\(.ip)\"' /evidence/identity/audit.json", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i 'achterberg' /evidence/servicedesk/tickets-today.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/audit.json', ...DUMP_ALL },
        { command: 'idp-cli user disable b.achterberg', ...MUTATE },
      ],
      commandNudge:
        'The second account looks the same in the data. Find out what is different outside it.',
      guidance:
        'A second account matches. Ask whether the pattern is the finding.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'threat-intel',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.assess-actor', 'act.corroborate', 'act.predict'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['mitigation-specialist'],
      why:
        'The part of this attack that happened is entirely outside anything Ridgeline owns, sees or ' +
        'can influence. No relationship with the carrier, no port notification, and a port ' +
        'authorisation lock is a thing only the subscriber can request, so the strongest available ' +
        'control belongs to the employee personally and Ridgeline can at best tell people it exists. ' +
        'Say that plainly and early, because a room that does not will spend the afternoon looking ' +
        'for the Ridgeline failure that let this happen and there is not one on the carrier side. ' +
        'The useful conclusion is the one that follows: since the attack surface cannot be defended, ' +
        'stop depending on it. Every argument today should be about removing the dependency rather ' +
        'than about detecting the swap, because detecting it requires a signal this carrier does ' +
        'not sell and removing it requires a configuration change we already have.',
      standIn:
        'The part of this that happened is completely outside anything we own or can see. No ' +
        'relationship with the carrier, no port notification, and a port lock can only be asked for ' +
        'by the subscriber, so the strongest control here belongs to the employee and the most we ' +
        'can do is tell people it exists. I want that said early, because otherwise we spend the ' +
        'afternoon hunting the Ridgeline failure that allowed it and there is not one on that side. ' +
        'The conclusion follows: if we cannot defend the surface, stop depending on it. Every ' +
        'argument today should be about removing the dependency, not detecting the swap. Detecting ' +
        'needs a signal this carrier does not sell. Removing needs a setting we already have.',
      commandNudge:
        'Work out which parts of this you could have seen, and be honest about the rest.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.sequence-remedy', 'act.check-rollback'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Order by what has a deadline. The 14:00 payment run comes first because it is the only item ' +
        'here that becomes irreversible, and holding it costs a delayed supplier payment against ' +
        '43,900 dollars leaving. Then revoke her sessions and take that number off the account, ' +
        'which ends the access and closes the route back in, and note that a password reset alone ' +
        'would not: the number still receives the recovery code. Then the second approver on ' +
        'supplier bank changes, which is today, is cheap, and would have stopped the loss even with ' +
        'the account fully compromised, which makes it the best value control on the board. The SMS ' +
        'fallback goes last and in stages: finance first in minutes, everybody else behind a plan, ' +
        'because switching it off for eleven hundred people sends every lost device to a help desk ' +
        'of two and the rollback question is what happens when that queue is forty deep at nine ' +
        'tomorrow. Deliberately left undone: nothing here prevents the next SIM swap, and if the ' +
        'payment run has already released the money is gone before the bank opens.',
      standIn:
        'Order by what has a deadline. Payment run at two first, because it is the only thing that ' +
        'becomes irreversible, and a late supplier payment against 43,900 dollars is not a close ' +
        'call. Then revoke her sessions and take that number off the account. Both, because a ' +
        'password reset alone leaves the number receiving the recovery code. Then second approver on ' +
        'supplier bank changes, today, cheap, and it would have stopped the loss with the account ' +
        'fully compromised, which makes it the best thing on this board. SMS fallback last and in ' +
        'stages: finance in minutes, everyone else behind a plan, because eleven hundred people and ' +
        'a help desk of two is a queue forty deep at nine tomorrow. Left undone: none of this stops ' +
        'the next swap, and if that run releases the money is gone before the bank opens.',
      commandNudge:
        'Find the one thing on this list that becomes impossible to undo, and start there.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'A hundred per cent coverage is a true number answering a question nobody meant to ask. It ' +
        'counts enrolment, and enrolment is what people use rather than what an account will ' +
        'accept, so the dashboard has been green throughout a year in which every account could be ' +
        'authenticated by SMS. Nothing was falsified: the metric was chosen when it was the ' +
        'interesting one and never revisited when the fallback exception made it uninteresting. The ' +
        'replacement is one line and is computable today, which is the awkward part, because it ' +
        'means nobody was prevented from knowing this. Report the weakest factor each account will ' +
        'accept, not the strongest it has enrolled, and the number goes from 100 per cent to nought. ' +
        'The detection worth building alongside it is a reset and an SMS challenge from an address ' +
        'the account has never used, which will fire on Achterberg every time, so it needs to route ' +
        'to somebody who rings the person rather than to a queue that closes it.',
      standIn:
        'A hundred per cent is a true number answering a question nobody meant to ask. It counts ' +
        'enrolment, which is what people use, not what the account accepts, so that dashboard has ' +
        'been green through a year where every account could be done by SMS. Nobody falsified it. ' +
        'The metric was right when it was picked and nobody revisited it when the fallback exception ' +
        'made it meaningless. The replacement is one line and we can compute it today, which is the ' +
        'uncomfortable bit. Report the weakest factor an account will accept, not the strongest it ' +
        'has enrolled, and we go from a hundred per cent to nothing. And the rule to build with it ' +
        'fires on Achterberg every time, so it has to reach somebody who rings the person, not a ' +
        'queue that closes it.',
      commandOptions: [
        { command: "jq -r '.users[] | \"\\(.name) \\(.recovery|join(\\\",\\\"))\"' /evidence/identity/users.json | grep sms | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'coverage|enrolled|metric' /evidence/dashboard/mfa-definition.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status grafana', ...STATUS_CHECK },
        { command: 'cat /evidence/dashboard/mfa-definition.txt', ...DUMP_ALL },
        { command: 'grep -c enrolled /evidence/identity/users.json', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read what the coverage metric counts, then work out what it would say if it counted the weakest factor.',
      guidance:
        'Coverage is a hundred per cent. Ask what is being counted.',
    },
  ],
};
