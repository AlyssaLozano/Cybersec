/**
 * Scenario 87: Do Not Touch It.
 *
 * A law enforcement request arrives asking Fenmarch to preserve an account and
 * not to tip anybody off, and the account in question is being read right now.
 *
 * WHAT THIS TEACHES
 *
 * That the binding constraint on an incident is sometimes not technical, and
 * that a room whose only instincts are contain and remediate will do damage
 * with every one of them.
 *
 * Three obligations are live at once and they do not agree. Preserve the
 * evidence, which forbids the deletion job that runs at two o'clock. Do not
 * tip off, which forbids the password reset that would ordinarily be the
 * first action. And notify the customer whose data is being read, which has a
 * statutory clock that started before anybody in this room heard about it.
 *
 * VERIFY THE REQUEST BEFORE OBEYING IT
 *
 * The first move is not compliance. A request that arrives by email, invokes
 * urgency, forbids telling anybody, and asks for account data in reply is the
 * exact shape of a fraudulent emergency data request, and firms hand over
 * customer records to them regularly. The domain being right is not
 * verification, because the domain is the easiest part to get right.
 *
 * What makes this expert is that verification comes back partial. The officer
 * exists and the case reference is well formed, and the unit will not confirm
 * or deny the request by telephone at eight in the evening. Nothing on this
 * board resolves into permission to act.
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

const ID = 'do-not-touch-it';

export const DO_NOT_TOUCH_IT: Scenario = {
  id: ID,
  title: 'Do Not Touch It',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 20:10 on a Thursday at Fenmarch Credit. A request has arrived asking us to preserve an ' +
    'account and tell nobody, and that account has an active session on it right now.',
  roles: [
    'soc-operator',
    'log-analyst',
    'forensics',
    'cloud-security',
    'network-analyst',
    'threat-intel',
    'fusion-analyst',
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
      summary: 'A preservation request, and an instruction to tell nobody',
      detail:
        'An email reached the Fenmarch support mailbox at 19:48 from an address on a genuine police ' +
        'force domain. It carries a signed PDF referencing an operation name and a case number, ' +
        'asks that all records for the account belonging to R. Vasey be preserved and not altered, ' +
        'states that the account holder must not be informed, and asks for a reply attaching the ' +
        'last ninety days of transaction and access records. It is marked urgent and asks for a ' +
        'response tonight.',
      source: 'support mailbox',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 170,
      surface: 'cloud-audit',
      summary: 'That account is being used right now, from somewhere it has never been used',
      detail:
        'The Vasey account has an active session opened at 19:31 from 203.0.113.44, a hosting ' +
        'provider range the account has never authenticated from in two years. Since it opened, the ' +
        'session has read the statement archive for eleven other customers through a reporting ' +
        'feature the account should not have, and has changed the notification email address.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 350,
      surface: 'raw-log',
      summary: 'The request has every feature of a fraudulent one',
      detail:
        'It arrived by email to a public support address rather than through the single point of ' +
        'contact Fenmarch publishes for law enforcement. It invokes urgency, forbids telling the ' +
        'subject, and asks for customer records to be sent in reply. The sending domain resolves ' +
        'correctly and the message passes SPF and DKIM for that domain. Every one of those ' +
        'properties is also true of a genuine request written by somebody in a hurry.',
      source: 'mail gateway',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 540,
      surface: 'alert-queue',
      expertOnly: true,
      summary: 'Verification comes back partial and stays partial',
      detail:
        'The force switchboard confirms an officer of that name is attached to that unit. The case ' +
        'reference matches the format that unit uses. The duty inspector states that the unit does ' +
        'not confirm or deny the existence of a request outside working hours and that the named ' +
        'officer is next on duty at 08:00. Fenmarch legal counsel is contactable and has been ' +
        'reached; the police single point of contact mailbox is not staffed until morning.',
      source: 'verification calls',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 730,
      surface: 'host-artefact',
      summary: 'A deletion job at two o clock will destroy the records either way',
      detail:
        'The routine retention job runs nightly at 02:00 and removes access and session records ' +
        'older than ninety days. Tonight it will remove 14 to 21 June, which includes the period ' +
        'the request names. Suspending it is a one-line change made by the platform team, who have ' +
        'somebody on call. It has never been suspended before and there is no documented way to ' +
        'do it.',
      source: 'data platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 920,
      surface: 'alert-queue',
      summary: 'Eleven other customers had their statements read tonight',
      detail:
        'The eleven customers whose statement archives were read during the active session are not ' +
        'the subject of the request. Under the notification duty Fenmarch operates to, the clock on ' +
        'informing them started when the access occurred at 19:31. The request instruction not to ' +
        'inform anybody names the account holder and says nothing about anybody else.',
      source: 'legal counsel',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1110,
      surface: 'alert-queue',
      summary: 'A second urgent request arrives, and this one is obvious',
      detail:
        'At 20:04 a second message reached the same mailbox, from a free webmail address, styled as ' +
        'an emergency disclosure request, referencing a different case number in a format no force ' +
        'uses, with two misspellings in the force name and a reply-to on a lookalike domain. It ' +
        'asks for the same ninety days of records for the same account.',
      source: 'support mailbox',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1300,
      surface: 'network-flow',
      expertOnly: true,
      summary: 'Whether the account holder is a victim or a participant does not resolve',
      detail:
        'The session comes from a hosting range the account has never used, which fits a stolen ' +
        'credential. The notification email was changed to an address on a domain registered eight ' +
        'months ago, which fits either a thief covering their tracks or an account holder who set ' +
        'that up deliberately in March. The eleven statement archives read tonight belong to ' +
        'customers with no relationship to Vasey. Two prior logins in April came from the same ' +
        'hosting provider on a different address and were not flagged.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1490,
      surface: 'alert-queue',
      summary: 'What can be done that neither tips off nor leaves people exposed',
      detail:
        'A password reset ends the session and tells whoever holds the account that they were seen. ' +
        'Revoking the session token ends it with no message sent and no visible change to the ' +
        'account. Disabling the reporting feature that exposed the eleven archives is a global ' +
        'change affecting 300 users and is not specific to this account. Preserving a full copy of ' +
        'the account records takes twenty minutes and changes nothing anybody can observe.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1680,
      surface: 'alert-queue',
      summary: 'There is no process for receiving one of these',
      detail:
        'Fenmarch publishes a single point of contact address for law enforcement, which is a ' +
        'mailbox nobody monitors out of hours. Tonight the request arrived at public support ' +
        'instead, was read by a first line agent who forwarded it to security, and reached the SOC ' +
        'twenty-two minutes after it was sent. There is no runbook for verifying such a request, no ' +
        'named person to authorise a response, and no record of how many have been received before.',
      source: 'security programme',
      claimedSeverity: 'high',
    },
  ],
};

export const DO_NOT_TOUCH_IT_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 19:31 somebody opened a session on the Fenmarch account belonging to R. Vasey from a hosting provider range that account has never used. During that session they read the statement archives of eleven unrelated customers through a reporting feature the account should not have had, and changed the notification email address.',
    'At 19:48 a preservation request arrived at the public support mailbox from a genuine police force domain, passing SPF and DKIM, carrying a signed PDF with an operation name and a well formed case reference. It asks that records be preserved and not altered, that the account holder not be informed, and that ninety days of transaction and access records be sent in reply tonight.',
    'That request has every feature of a fraudulent emergency data request: wrong channel, urgency, secrecy, and a request for customer records by return. It also has every feature of a genuine request written by somebody in a hurry, and the domain being correct proves nothing, because the domain is the easiest part to get right.',
    'Verification comes back partial and stays partial. The officer exists and is attached to that unit, the reference matches the unit format, and the duty inspector will neither confirm nor deny a request outside working hours. The named officer is next on duty at 08:00 and the police single point of contact mailbox is unstaffed until morning. Nothing resolves tonight.',
    'The nightly retention job at 02:00 will delete records for 14 to 21 June, which is inside the period the request names. It has never been suspended and there is no documented way to do it, though the platform team on call can make the change.',
    'Three obligations are live and they conflict. Preserve, which forbids the deletion job. Do not tip off, which forbids the password reset. And notify eleven customers whose statements were read at 19:31, whose clock is already running and who are not named anywhere in the request.',
    'The second message at 20:04 is a crude fake: free webmail, a case reference in a format no force uses, two misspellings, and a lookalike reply-to. It asks for the same records. Its arrival sixteen minutes after the first is the interesting part.',
    'Whether Vasey is a victim or a participant does not resolve. The hosting range and the eleven unrelated archives fit a stolen credential. The notification address was changed to a domain registered eight months ago, and two unflagged logins in April came from the same hosting provider on a different address, which fits either reading.',
    'Revoking the session token ends the access with nothing sent and nothing visible on the account, which is the only action here that satisfies all three obligations at once.',
    'Fenmarch publishes a law enforcement contact address that nobody monitors out of hours. Tonight the request went to public support, was forwarded by a first line agent, and reached the SOC twenty-two minutes later. There is no verification runbook, no named authoriser, and no record of how many such requests have been received before.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['soc-operator', 'fusion-analyst'],
      correctActions: ['act.notify-legal', 'act.preserve', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['fusion-analyst', 'cloud-security'],
      why:
        'The first move is not compliance and it is not refusal. It is to notice that this document ' +
        'is an instruction from outside the organisation that would change what the SOC does, and ' +
        'that nobody has established it is real. Get legal on it now rather than after acting, ' +
        'because the decision about what to hand a police force is not a security decision and this ' +
        'room does not own it. Preserve immediately, since preservation is the one thing that is ' +
        'right whether the request is genuine or fraudulent and costs nothing either way. And ' +
        'notice what is being asked for: a reply attaching ninety days of customer records. A ' +
        'preservation request asks you to keep records. This one asks you to send them, and those ' +
        'are different requests with different risks, sitting in one paragraph.',
      standIn:
        'Nobody comply and nobody refuse. This is an instruction from outside that would change what ' +
        'we do, and no part of it is established. Legal now, before we act, because what we hand a ' +
        'police force is not our decision. Preserve immediately, since that is right whether this is ' +
        'genuine or fraudulent and costs nothing. And read what it actually asks: a reply attaching ' +
        'ninety days of customer records. Preservation means keep. This says send. Two different ' +
        'requests in one paragraph.',
      commandOptions: [
        { command: "grep -iE 'from:|return-path:|received:' /evidence/mail/request-19-48.eml | head", correct: true, teaches: CORRECT_STEP },
        { command: 'pdfinfo /evidence/mail/preservation-notice.pdf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status postfix', ...STATUS_CHECK },
        { command: 'cat /evidence/mail/request-19-48.eml', ...DUMP_ALL },
        { command: 'mail -s "Re: preservation" officer@police.example < /evidence/export/records.csv', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Read what the request asks you to do, separating what it asks you to keep from what it asks you to send.',
      guidance:
        'Somebody outside has told you what to do. Ask who established that they can.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1078', 'T1114'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.iam-audit', 'act.triage-high', 'act.preserve'],
      outOfLaneActions: ['act.reset-password', 'act.contact-attacker', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'While the room reads a document, somebody is reading customer statements. An active session ' +
        'from a hosting range this account has never touched, eleven unrelated statement archives ' +
        'already read, and the notification address changed so the account holder will not hear ' +
        'about anything that happens next. Every instinct says reset the password, and that is the ' +
        'one action the request forbids and the one that tells whoever is on the other end that ' +
        'they were seen. Hold it. What the room actually needs in the next two minutes is the ' +
        'distinction between ending the access and announcing that you ended it, because those are ' +
        'usually the same button and tonight they must not be. Say the eleven out loud as well, ' +
        'because they are the part of this nobody has been instructed about and their clock is ' +
        'already running.',
      standIn:
        'While we read a document somebody is reading customer statements. Live session from a ' +
        'hosting range this account has never used, eleven unrelated statement archives already ' +
        'read, notification address changed so the account holder hears nothing. Everyone wants to ' +
        'reset the password. That is the action the request forbids and the one that tells them they ' +
        'were seen. Hold it. What I need in two minutes is the difference between ending the access ' +
        'and announcing we ended it, because those are normally the same button. And say the eleven ' +
        'out loud. Nobody has instructed us about them and their clock is running.',
      commandOptions: [
        { command: "jq -r '.sessions[] | select(.user==\"r.vasey\") | \"\\(.opened) \\(.ip) \\(.actions|length)\"' /evidence/identity/sessions.json", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i 'r.vasey' /evidence/identity/activity.csv | cut -d, -f1,3,4", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/sessions.json', ...DUMP_ALL },
        { command: 'idp-cli user reset-password r.vasey', ...MUTATE },
      ],
      commandNudge:
        'Find what that session has actually done since it opened, and what it touched that was not its own.',
      guidance:
        'A request names an account. Ask what that account is doing.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.investigate-hold', 'act.notify-legal'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.declare'],
      escalateTo: ['ir-lead'],
      why:
        'Every feature that makes this look fraudulent also appears on genuine requests written by ' +
        'somebody in a hurry, which is exactly why the technique works. Wrong channel, urgency, ' +
        'secrecy, and a request for records by return: that is the documented shape of a fraudulent ' +
        'emergency data request, and firms hand over customer records to them regularly. It is also ' +
        'what an officer produces at eight in the evening when they are working from a template and ' +
        'do not know Fenmarch publishes a contact address. The domain, the SPF pass and the DKIM ' +
        'signature establish that the message came from that force mail system and nothing beyond ' +
        'it: they say the envelope is real, not that the request is. Lean benign, because a genuine ' +
        'but sloppy request is the more common object, and act as though it might not be, because ' +
        'the two readings differ in what it costs to be wrong. Being wrong about a genuine request ' +
        'delays a police enquiry by twelve hours. Being wrong about a fraudulent one hands a ' +
        'stranger ninety days of a customer financial life.',
      standIn:
        'Everything that makes this look fake also appears on real requests written in a hurry, which ' +
        'is why the technique works. Wrong channel, urgency, secrecy, records by return: that is the ' +
        'documented shape of a fraudulent emergency request, and it is also what an officer produces ' +
        'at eight at night off a template without knowing we publish a contact address. The domain, ' +
        'SPF and DKIM say the message came from that force mail system. They say the envelope is ' +
        'real, not the request. I lean genuine but sloppy, and I want us acting as if it might not ' +
        'be, because the costs are not symmetrical. Wrong about a real one and we delay a police ' +
        'enquiry twelve hours. Wrong about a fake one and a stranger gets ninety days of somebody ' +
        'financial life.',
      commandOptions: [
        { command: "grep -iE 'dkim=|spf=|dmarc=' /evidence/mail/request-19-48.eml", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'single point of contact|law enforcement' /evidence/policy/disclosure-policy.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status opendkim', ...STATUS_CHECK },
        { command: 'cat /evidence/policy/disclosure-policy.txt', ...DUMP_ALL },
        { command: 'dig +short police.example', ...WRONG_TARGET },
      ],
      commandNudge:
        'Work out what the mail authentication result actually proves, and what it does not.',
      guidance:
        'The domain is right. Ask what that establishes.',
    },
    {
      eventId: 'ev.4',
      verdict: 'ambiguous',
      leaning: 'benign',
      wouldSettleIt:
        'The named officer confirming the request at 08:00, or the force single point of contact ' +
        'mailbox answering in the morning. Neither is available tonight, and the refusal to confirm ' +
        'out of hours is standing policy rather than a signal about this particular request, so no ' +
        'inference can be drawn from it in either direction.',
      firstResponder: 'ir-lead',
      alsoAppropriate: ['fusion-analyst', 'threat-intel'],
      correctActions: ['act.notify-legal', 'act.investigate-hold', 'act.corroborate'],
      outOfLaneActions: ['act.declare', 'act.dismiss', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist'],
      why:
        'The verification came back neither yes nor no, and the room has to be stopped from reading ' +
        'that as a no. The officer exists, the reference is well formed, and the unit will not ' +
        'confirm a request outside working hours as standing policy, which means the refusal ' +
        'carries no information about this request at all. A room that treats an unhelpful answer ' +
        'as a negative one has invented evidence. What this actually establishes is a deadline ' +
        'rather than a fact: nothing resolves before 08:00, so every decision tonight has to be one ' +
        'that survives finding out in the morning that the request was genuine, and also one that ' +
        'survives finding out it was not. That is a narrow set and it is worth naming out loud, ' +
        'because it is the criterion the rest of the shift is judged against.',
      standIn:
        'It came back neither yes nor no, and nobody read that as a no. The officer exists, the ' +
        'reference is right, and the unit will not confirm out of hours as policy, so the refusal ' +
        'says nothing about this request. Treating an unhelpful answer as a negative one is ' +
        'inventing evidence. What we have is a deadline, not a fact: nothing resolves before eight. ' +
        'So every decision tonight has to survive finding out in the morning that it was real, and ' +
        'also survive finding out it was not. That is a narrow set and it is the test for everything ' +
        'else we do.',
      commandNudge:
        'Write down what would have to be true for each reading, and what you can do that fits both.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.preserve', 'act.sequence-remedy', 'act.check-rollback'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'A deletion job at two o clock, six hours away, that will remove the exact week the request ' +
        'names. This is the one item on the board that is genuinely urgent and it does not look ' +
        'urgent, because nothing about it is happening yet, and a room absorbed in a live session ' +
        'and a legal argument will let two o clock arrive. Preservation is also the action that is ' +
        'correct under every reading: if the request is genuine, destroying those records after ' +
        'receiving it is the serious failure; if it is fraudulent, Fenmarch has an active ' +
        'compromise and needs its own evidence; and if nothing else about tonight is resolved, ' +
        'keeping records costs almost nothing. Do it by taking a copy rather than by suspending the ' +
        'job, and prefer the copy because it needs nobody to remember to switch retention back on ' +
        'in three weeks. The uncomfortable part is that this job has never been suspended and has no ' +
        'documented procedure, so a change to it at eight in the evening carries its own risk and ' +
        'somebody should say what happens if it goes wrong.',
      standIn:
        'Deletion job at two, six hours out, and it takes the exact week the request names. This is ' +
        'the only genuinely urgent thing on the board and it does not feel urgent, because nothing ' +
        'is happening yet, which is how two o clock arrives while we argue. Preservation is right ' +
        'under every reading. If the request is real, destroying those after receiving it is the ' +
        'bad failure. If it is fake, we have a live compromise and need our own evidence. Take a ' +
        'copy rather than suspend the job, because a copy needs nobody to remember to switch ' +
        'retention back on in three weeks. And this job has never been suspended and has no ' +
        'procedure, so somebody tell me what happens if we get the change wrong.',
      commandOptions: [
        { command: "grep -iE 'retention|schedule|02:00' /evidence/platform/retention-job.conf", correct: true, teaches: CORRECT_STEP },
        { command: "pg_dump --table=access_log --where=\"ts >= '2026-06-14'\" fenmarch > /preserve/access-june.sql", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status retention.timer', ...STATUS_CHECK },
        { command: 'cat /evidence/platform/retention-job.conf', ...DUMP_ALL },
        { command: 'systemctl disable --now retention.timer', ...MUTATE },
      ],
      commandNudge:
        'Find out what runs tonight on a schedule and whether it touches the period in the request.',
      guidance:
        'You were asked to preserve. Ask what is scheduled to delete.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1114'],
      firstResponder: 'ir-lead',
      alsoAppropriate: ['fusion-analyst', 'mitigation-specialist'],
      correctActions: ['act.notify-legal', 'act.timeline', 'act.sequence-remedy'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['mitigation-specialist'],
      why:
        'Eleven people had their bank statements read tonight and nobody has instructed Fenmarch ' +
        'about them. The request names one account holder and says nothing about anybody else, and ' +
        'a room reading a secrecy instruction broadly will silently extend it to cover eleven ' +
        'customers who are owed a notification whose clock started at 19:31. Read the instruction ' +
        'narrowly, because that is what it says, and put the question to legal rather than ' +
        'resolving it here: whether a preservation request from a police force can defer a ' +
        'notification duty to uninvolved customers is a question with an answer, and the answer is ' +
        'not in this room. What this row is really teaching is that an instruction from outside ' +
        'expands to fill whatever space you give it, and the eleven are the space. They are also ' +
        'the only people in this incident who have lost something concrete tonight.',
      standIn:
        'Eleven people had their bank statements read tonight and nobody has instructed us about ' +
        'them. The request names one account holder and is silent on everyone else. Read it ' +
        'narrowly, because that is what it says. Whether a police preservation request defers a ' +
        'notification duty to uninvolved customers is a real question with a real answer and it is ' +
        'not ours, so it goes to legal tonight, not in the morning. An instruction from outside ' +
        'expands to fill whatever space you give it, and the eleven are the space. They are also the ' +
        'only people here who have actually lost something.',
      commandOptions: [
        { command: "jq -r '.sessions[] | select(.user==\"r.vasey\") | .actions[] | select(.type==\"statement_read\") | .subject' /evidence/identity/sessions.json | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i 'statement_read' /evidence/identity/activity.csv | cut -d, -f5 | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status reporting', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/activity.csv', ...DUMP_ALL },
        { command: 'grep -c statement_read /evidence/identity/activity.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'List whose records were read, and check whether the request says anything about them.',
      guidance:
        'You were told not to tell one person. Ask who else there is.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'reconnaissance',
      critical: true,
      techniques: ['T1585.002'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['threat-intel', 'fusion-analyst'],
      correctActions: ['act.triage-high', 'act.preserve', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.tune'],
      escalateTo: ['fusion-analyst', 'ir-lead'],
      why:
        'This one is a crude fake and closing it as such takes ten seconds: free webmail, a case ' +
        'reference in a format no force uses, two misspellings, a lookalike reply-to. The mistake ' +
        'is stopping there. What matters is not that it is fake but that it arrived sixteen minutes ' +
        'after the first one and asks for the same ninety days of the same account, which means ' +
        'somebody knows this account is interesting tonight and is trying more than one way in. ' +
        'That reframes the first request rather than settling it, and the direction it points is ' +
        'genuinely unclear: two attempts at the same target could mean the first was also fraudulent ' +
        'and this is a second attempt by the same person, or that a real request exists and somebody ' +
        'with visibility of it is riding alongside. Preserve it, correlate the two, and do not let ' +
        'the room conclude that an obvious fake makes the plausible one obviously real.',
      standIn:
        'This one is fake and that takes ten seconds: webmail, a case reference in a format nobody ' +
        'uses, two misspellings, lookalike reply-to. Do not stop there. It landed sixteen minutes ' +
        'after the first and asks for the same ninety days of the same account, so somebody knows ' +
        'this account is interesting tonight and is trying more than one way in. That reframes the ' +
        'first request, it does not settle it, and it points both ways: same person trying twice, or ' +
        'a real request with somebody riding alongside it. Preserve it, correlate the two, and ' +
        'nobody conclude that an obvious fake makes the other one obviously real.',
      commandOptions: [
        { command: "grep -iE 'from:|reply-to:|subject:' /evidence/mail/request-20-04.eml", correct: true, teaches: CORRECT_STEP },
        { command: "grep -oE '[A-Z]{2,}/[0-9]{2,}/[0-9]+' /evidence/mail/request-*.eml", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status postfix', ...STATUS_CHECK },
        { command: 'cat /evidence/mail/request-20-04.eml', ...DUMP_ALL },
        { command: 'mail -s "Re:" enquiries@pollice-force.example < /dev/null', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Compare the two requests against each other rather than judging the second one alone.',
      guidance:
        'A second request arrived. Ask what it has in common with the first.',
    },
    {
      eventId: 'ev.8',
      verdict: 'ambiguous',
      leaning: 'malicious',
      wouldSettleIt:
        'Speaking to Vasey, which the request forbids, or device and location evidence from the ' +
        'April logins, which fell outside the ninety day retention window and were removed in July. ' +
        'The registrar record for the notification domain shows privacy protection and no ' +
        'connection either way.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.investigate-hold', 'act.assess-actor'],
      outOfLaneActions: ['act.attribute-named', 'act.declare', 'act.dismiss', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'Both readings survive every observation. A session from a hosting range and eleven ' +
        'unrelated archives read fits a stolen credential being used by somebody who got in ' +
        'tonight. A notification address changed to a domain registered eight months ago, and two ' +
        'unflagged logins from the same hosting provider in April, fit an account holder who has ' +
        'been doing this for a while. The leaning is malicious activity on the account either way, ' +
        'which is the part worth saying, because the room will want to resolve victim against ' +
        'participant and that question is not what tonight turns on: the eleven customers were ' +
        'harmed under both readings and the response is identical under both. What stops it ' +
        'resolving is that the obvious test is to ask him, and the request forbids exactly that, ' +
        'while the April device evidence aged out in July. Note also that a room which decided he ' +
        'was a participant would be doing the investigating that the request implies somebody else ' +
        'is already doing, using an account they were asked not to disturb.',
      standIn:
        'Both readings survive everything. Hosting range and eleven unrelated archives fits a stolen ' +
        'credential used tonight. A notification address on a domain registered eight months ago and ' +
        'two unflagged logins from the same provider in April fits somebody who has been at this a ' +
        'while. I lean malicious activity on the account either way, and I want the room to notice ' +
        'that victim against participant is not what tonight turns on: the eleven were harmed under ' +
        'both and our response is the same under both. It does not resolve because the obvious test ' +
        'is to ask him, which the request forbids, and the April device data aged out in July. And ' +
        'if we decided he was a participant we would be running the investigation the request ' +
        'implies somebody else is running, on an account we were asked to leave alone.',
      commandNudge:
        'Ask what evidence would separate the two readings, and whether you are allowed to go and get it.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.preserve', 'act.compensating-control', 'act.sequence-remedy'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'One action on this list satisfies all three obligations and the room has to find it rather ' +
        'than compromise between them. Revoking the session token ends the access immediately, ' +
        'sends no message, and leaves nothing visible on the account: the person on the other end ' +
        'sees a session expire, which happens to everybody. A password reset does the same job and ' +
        'announces it, which is the tipping off the request forbids and would also, if the request ' +
        'is fraudulent, tell an attacker exactly when they were detected. Preserving a full copy is ' +
        'free and unobservable and should already be running. Disabling the reporting feature is a ' +
        'global change affecting three hundred users and is not tonight decision, though it is ' +
        'someone decision this week, because it is what allowed one account to read eleven others. ' +
        'The general habit is the one to take away: when instincts conflict, look for the action ' +
        'that is invisible rather than the one that is decisive, because most containment actions ' +
        'are also notifications and nobody labels them that way. Deliberately left undone: the ' +
        'eleven statement archives have been read and nothing recovers them, and the question of ' +
        'whether the request is real is still open until eight in the morning.',
      standIn:
        'One action here satisfies all three obligations and I want it found, not compromised ' +
        'towards. Revoke the session token. It ends the access now, sends nothing, and leaves ' +
        'nothing visible: they see a session expire, which happens to everyone. A password reset ' +
        'does the same job and announces it, which is the tipping off we were told not to do and ' +
        'also tells an attacker exactly when we spotted them. Full copy preserved, free and ' +
        'invisible, should already be running. The reporting feature is a global change for three ' +
        'hundred users and is not tonight, though it is somebody this week, because it is what let ' +
        'one account read eleven. When instincts conflict, look for the invisible action, not the ' +
        'decisive one. Most containment is also a notification and nobody labels it that way. Left ' +
        'undone: eleven archives are read and nothing un-reads them, and we do not know if the ' +
        'request is real until eight.',
      commandNudge:
        'Sort the four actions by whether anybody on the other end would notice, and start there.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.propose-rule', 'act.scope-estate', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'The finding that outlives tonight. Fenmarch publishes a law enforcement contact address ' +
        'that nobody monitors out of hours, which means the published channel is a statement about ' +
        'working hours rather than a channel, and every out of hours request will arrive somewhere ' +
        'else by design. Tonight one reached a first line support agent who made a judgement call ' +
        'with no training and, as it happens, the right one; the twenty-two minutes it took to ' +
        'reach the SOC were spent well and nothing guarantees the next one goes the same way. Three ' +
        'things are missing and none of them is technical: a verification runbook, a named person ' +
        'who can authorise a response at any hour, and a register of how many such requests have ' +
        'been received. That last one is the quiet finding, because with no register nobody can ' +
        'answer whether this has happened before, and a firm that cannot answer that has no way of ' +
        'knowing whether it has already handed customer records to somebody who asked convincingly.',
      standIn:
        'This is the bit that outlives tonight. We publish a law enforcement address nobody watches ' +
        'out of hours, which makes it a statement about working hours rather than a channel, so ' +
        'every out of hours request arrives somewhere else by design. Tonight it hit a first line ' +
        'agent with no training who made the right call, and the twenty-two minutes were spent well, ' +
        'and nothing says the next one goes that way. Three things missing, none technical: a ' +
        'verification runbook, a named person who can authorise a response at any hour, and a ' +
        'register of these requests. The register is the quiet one. Without it nobody can say ' +
        'whether this has happened before, which means we cannot say whether we have already handed ' +
        'records to somebody who asked convincingly.',
      commandOptions: [
        { command: "grep -riE 'law enforcement|disclosure|single point' /evidence/policy/ | head", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'received|forwarded' /evidence/support/ticket-4471.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status support-portal', ...STATUS_CHECK },
        { command: 'cat /evidence/policy/disclosure-policy.txt', ...DUMP_ALL },
        { command: 'grep -c request /evidence/support/tickets.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find where such a request is supposed to arrive, and check whether anybody is there.',
      guidance:
        'It came to the support mailbox. Ask where it was supposed to come.',
    },
  ],
};
