/**
 * Scenario 06: Second Post.
 *
 * A credential phish against the finance team, and the thing that happens after
 * the click.
 *
 * WHAT THIS TEACHES
 *
 * That the click is not the incident. Every floor knows to look for who opened
 * the mail and who typed their password, and both of those are answerable in
 * ten minutes. The part that decides whether this is a bad morning or a bad
 * quarter is the inbox rule created ninety seconds after the login, which moves
 * anything mentioning invoices or payments into a folder nobody opens.
 *
 * That rule is why the victim never sees the replies, why the finance team never
 * sees the queries, and why this runs for weeks in the real world. It arrives on
 * the cloud audit surface as a routine configuration change with severity LOW,
 * and it is the single most important row on the board.
 *
 * THE OTHER LESSON: RESETTING THE PASSWORD IS NOT CONTAINMENT
 *
 * The instinct is to reset and move on. The session token issued at login
 * survives a password reset, the OAuth grant survives it, and the inbox rule
 * survives all three. `act.reset-password` is in-lane for nobody in this
 * platform precisely because of incidents shaped like this one.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  BROAD_SEARCH,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'second-post';

export const SECOND_POST: Scenario = {
  id: ID,
  title: 'Second Post',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 09:30 at Ridgeline Medical Group. A member of the finance team reported a suspicious ' +
    'email twenty minutes ago and the service desk forwarded it on. Find out who else got it, ' +
    'and what happened to anybody who believed it.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'threat-intel',
    'detection-engineer',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'User-reported phishing message delivered to 34 finance and procurement mailboxes',
      detail:
        'A message titled "Remittance advice 4471 requires approval" was delivered to 34 mailboxes ' +
        'at 07:12. It claims to come from a supplier the organisation genuinely uses and links to ' +
        'a sign-in page. The sending domain differs from the real supplier by one transposed ' +
        'letter. The mail gateway scored it clean: no attachment, no known bad link, and correct ' +
        'authentication records for the domain it was actually sent from.',
      source: 'external mail',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'network-flow',
      summary: 'Nine workstations reached the linked sign-in page, six posted form data',
      detail:
        'Between 07:14 and 08:51, nine internal hosts connected to 203.0.113.212. Six of the nine ' +
        'sessions included a POST of roughly 400 bytes, consistent with a submitted form. The ' +
        'site presents a copy of the organisation sign-in page and its certificate was issued at ' +
        '04:40 that morning.',
      source: 'finance workstations',
      target: '203.0.113.212:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'One successful sign-in from outside for h.marchetti at 07:31',
      detail:
        'A successful authentication for h.marchetti from 203.0.113.212 at 07:31:44, seventeen ' +
        'seconds after that host posted to the phishing page. MFA was satisfied by a push approval ' +
        'sent at 07:31:39 and approved at 07:31:42. Five other accounts that posted credentials ' +
        'produced push prompts that were never approved.',
      source: '203.0.113.212',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 450,
      surface: 'cloud-audit',
      summary: 'Inbox rule created on the h.marchetti mailbox at 07:33',
      detail:
        'A rule named " " was created ninety seconds after the sign-in. It matches messages ' +
        'containing invoice, payment, remittance, bank or supplier in the subject or body, marks ' +
        'them read, and moves them to RSS Subscriptions. Users create inbox rules constantly and ' +
        'this event type is not alerted on. Rule history: this event has never been raised for ' +
        'review.',
      source: 'h.marchetti',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'cloud-audit',
      summary: 'Mailbox searched for supplier and banking terms, 41 messages opened',
      detail:
        'Between 07:35 and 08:04 the session ran nine mailbox searches for terms including bank ' +
        'details, remittance, sort code and account change, and opened 41 messages. No message was ' +
        'sent, forwarded or deleted. The account holds no elevated permissions and is a standard ' +
        'finance mailbox.',
      source: 'h.marchetti',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'host-artefact',
      summary: 'Browser profile shows the sign-in page reached from a link in the mail client',
      detail:
        'The workstation browser history records the phishing URL opened at 07:31:22 with a ' +
        'referrer from the local mail client, followed by a redirect to the genuine sign-in page ' +
        'four seconds after the POST. The user landed on a working, legitimate mailbox and had no ' +
        'reason to think anything had failed.',
      source: 'RMG-WS-2210',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 900,
      surface: 'alert-queue',
      summary: 'Mail gateway blocked 1,290 messages overnight as bulk or unwanted',
      detail:
        'The gateway rejected or quarantined 1,290 inbound messages between 00:00 and 09:00, in ' +
        'line with the daily average of 1,100 to 1,400. None of the blocked messages relate to the ' +
        'reported campaign. Rule history: fired 30 times in thirty days, 30 closed as expected ' +
        'volume.',
      source: 'mail gateway',
      claimedSeverity: 'low',
    },
  ],
};

export const SECOND_POST_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'A lookalike domain sent a remittance-themed message to 34 finance and procurement mailboxes at 07:12.',
    'The gateway passed it because it had no attachment, no known bad link, and valid authentication for the domain it was genuinely sent from.',
    'Nine people clicked and six submitted credentials to a copy of the sign-in page whose certificate was minted that morning.',
    'One of the six approved the push prompt, so MFA stopped five of them and not the sixth.',
    'Ninety seconds after signing in, the attacker created an inbox rule that hides anything mentioning invoices, payments or bank details.',
    'They then searched the mailbox for banking terms and read 41 messages. Nothing was sent yet.',
    'They now know which suppliers are owed money and when, and the person whose mailbox it is will not see the replies when the fraudulent invoice goes out.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1566.002', 'T1583.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'threat-intel'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst', 'network-analyst'],
      why:
        'The gateway scored it clean and was not wrong about anything it checked. There is no ' +
        'attachment to detonate, the link had no reputation because the site was built that ' +
        'morning, and the authentication records are valid for the domain it was actually sent ' +
        'from, which is a domain the attacker owns. That is the lesson: mail authentication proves ' +
        'a message came from where it says, not that the sender is who you think. The transposed ' +
        'letter is the whole deception. And 34 recipients is not 34 problems, it is 34 chances, so ' +
        'the first question is not "is this phishing" but "who acted on it".',
      standIn:
        'Remittance-themed message to 34 finance and procurement mailboxes at 07:12, lookalike ' +
        'domain one letter off a real supplier, links to a sign-in page. Gateway passed it clean. ' +
        'Raising it and asking who clicked.',
      commandOptions: [
        { command: 'grep "Remittance advice 4471" /var/log/mail/delivery.log', ...WRONG_TARGET },
        { command: 'awk \'/4471/ {print $5}\' /var/log/mail/delivery.log | sort -u | wc -l', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/mail/gateway.log | tail -40', ...WRONG_TARGET },
        { command: 'dig supplier-domain.example TXT', ...WRONG_TARGET },
        { command: 'systemctl status postfix', ...STATUS_CHECK },
      ],
      commandNudge: 'Find out how many mailboxes it reached before deciding what it is worth.',
      guidance:
        'A message passing authentication only proves it came from the domain it claims. Look at ' +
        'the domain itself.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1056.003'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'Nine connections is who clicked. Six POSTs is who typed. Separating those two numbers is ' +
        'the entire value of this seat here, because they lead to different work: the three who ' +
        'looked and left need an email, the six who submitted need their sessions killed. The ' +
        'certificate issued at 04:40 is the other finding, and it is why no reputation service ' +
        'flagged the link. Infrastructure built the morning it is used has no history to check, ' +
        'which is exactly why attackers build it that way.',
      standIn:
        'Nine hosts reached the page and six of them posted about 400 bytes, which is a submitted ' +
        'form. Certificate on that site was issued at 04:40 this morning, so nothing had any ' +
        'reputation to go on.',
      commandOptions: [
        { command: 'grep 203.0.113.212 /var/log/flows.log', ...WRONG_TARGET },
        { command: 'awk \'$4 ~ /203.0.113.212/ && $7=="POST"\' /var/log/proxy.log', correct: true, teaches: CORRECT_STEP },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'dig 203.0.113.212', ...WRONG_TARGET },
        { command: 'curl -I https://203.0.113.212', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Separate the hosts that only connected from the hosts that actually sent something.',
      guidance:
        'Clicking and submitting are different failures with different fixes. Count them separately.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1078.004', 'T1621'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['cloud-security', 'ir-lead'],
      why:
        'Five of six were saved by MFA and one was not, and the three seconds between the prompt ' +
        'and the approval says why: the prompt arrived while they were still on the page, so it ' +
        'looked like the login they had just started. That is not carelessness, it is the attack ' +
        'working as designed, and a report that frames it as user error will produce awareness ' +
        'training instead of number matching on the push prompts, which is the control that ' +
        'actually stops it. Note also what MFA did do. Five accounts survived because of it, and ' +
        'the debrief should say so rather than only counting the failure.',
      standIn:
        'One successful external sign-in for h.marchetti at 07:31, seventeen seconds after that ' +
        'host posted to the page. Push prompt approved in three seconds. Five other accounts ' +
        'posted credentials and their prompts were never approved.',
      commandOptions: [
        { command: 'grep marchetti /var/log/auth.log', ...WRONG_TARGET },
        { command: 'grep \'Accepted\' /var/log/auth.log | grep 203.0.113.212', correct: true, teaches: CORRECT_STEP },
        { command: 'last -30', ...WRONG_TARGET },
        { command: 'grep -c push /var/log/mfa.log', ...COUNT_ONLY },
        { command: 'cat /var/log/auth.log | tail -60', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find which of the six that submitted actually resulted in a successful sign-in.',
      guidance:
        'Look at how long passed between the prompt being sent and approved, and what the person ' +
        'was looking at when it arrived.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1564.008', 'T1114.003'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'detection-engineer'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.reset-password', 'act.dismiss', 'act.timeline', 'act.preserve'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'The most important row on the board, arriving as a routine configuration change with ' +
        'severity LOW on an event type nobody has ever reviewed. A rule named with a single space, ' +
        'matching invoice, payment, remittance, bank and supplier, marking them read and filing ' +
        'them somewhere nobody looks. This is what makes the fraud survive: the mailbox owner will ' +
        'not see the supplier querying the changed bank details, and the finance team will not see ' +
        'the owner failing to answer. Ninety seconds after login means it was the first thing they ' +
        'did, which tells you the objective before anything else does. And it outlives a password ' +
        'reset, a token revocation and a device wipe, because it is a setting on the mailbox.',
      standIn:
        'Inbox rule created ninety seconds after the sign-in, named with a single space, matching ' +
        'invoice, payment, remittance, bank and supplier, marking read and moving to RSS ' +
        'Subscriptions. That hides the replies. It survives a password reset. Removed and ' +
        'preserved.',
      commandNudge:
        'Look at what the account CHANGED in the first two minutes, not just what it read.',
      guidance:
        'Ask what the attacker did first. The first action after a login usually names the ' +
        'objective.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1114.002'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.reset-password', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Nine searches for banking terms and 41 messages opened, nothing sent. A floor that ' +
        'measures harm by what left will call this a near miss, and it is the opposite: this is ' +
        'preparation, and it succeeded. They now know which suppliers are owed what, on what ' +
        'schedule, and how this organisation words a payment request. The fraudulent invoice comes ' +
        'later, from a mailbox that has been read carefully enough to sound exactly right. The ' +
        'output the business needs is not "no data was exfiltrated", it is the list of suppliers ' +
        'whose next payment request should be verified by phone.',
      standIn:
        'Nine mailbox searches for banking and remittance terms, 41 messages opened, nothing sent ' +
        'or forwarded. They were reading, not taking. They know which suppliers are owed money and ' +
        'how we word a payment request.',
      commandNudge: 'Look at what they searched for, and what that tells you they want.',
      guidance:
        'Nothing was taken. Ask what they LEARNED, and what they would do with it next.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1566.002'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The redirect is the finding. Four seconds after submitting, the user was dropped on the ' +
        'genuine sign-in page and then into a working mailbox, so from where they sat nothing went ' +
        'wrong at all. That is why nobody reported it: there was nothing to report. It matters for ' +
        'the debrief because "why did the user not tell us" has a real answer, and the answer is ' +
        'not that they were careless. It also fixes the entry point precisely, from the mail client ' +
        'referrer, which rules out a browser compromise or a watering hole and keeps the ' +
        'investigation from widening for no reason.',
      standIn:
        'Browser history has the phishing URL opened at 07:31:22 with a referrer from the mail ' +
        'client, then a redirect to the real sign-in page four seconds after the POST. The user ' +
        'ended up in a working mailbox. Nothing looked wrong to them. Captured and sealed.',
      commandNudge:
        'Look at where the browser went immediately AFTER the credentials were submitted.',
      guidance:
        'Ask what the person saw on their screen. It explains why nothing was reported.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.isolate', 'act.iam-audit'],
      escalateTo: [],
      why:
        '1,290 blocked messages against a 1,100 to 1,400 daily average, none of them related to ' +
        'the campaign. The gateway did its job all night. It is on the board because a floor ' +
        'working a phishing incident will see a four-figure number next to the word "blocked" and ' +
        'reach for it, and because a report that opens with "1,290 malicious messages blocked" ' +
        'sounds like a busy night and is describing a normal one. The number that matters today is ' +
        'one, which is the message that was not blocked.',
      standIn:
        '1,290 messages blocked overnight, inside the normal daily range, none of them from this ' +
        'campaign. That is the gateway working. Closing it.',
      commandOptions: [
        { command: 'grep -c BLOCKED /var/log/mail/gateway.log', ...COUNT_ONLY },
        { command: 'awk \'/BLOCKED/ {print $6}\' /var/log/mail/gateway.log | sort | uniq -c', ...WRONG_TARGET },
        { command: 'cat /var/log/mail/stats-daily.log', ...DUMP_ALL },
        { command: 'grep 4471 /var/log/mail/gateway.log', correct: true, teaches: CORRECT_STEP },
        { command: 'systemctl status mailgw', ...STATUS_CHECK },
      ],
      commandNudge:
        'Check whether any of the blocked messages have anything to do with the one that got through.',
      guidance:
        'A big number is not a finding. Compare it to a normal day before you put it in a report.',
    },
  ],
};
