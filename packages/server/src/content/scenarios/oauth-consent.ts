/**
 * Scenario 90: They Said Yes.
 *
 * Sixty people granted an application access to their mail, and every control
 * Ridgeline owns is pointed at passwords.
 *
 * WHAT THIS TEACHES
 *
 * That a consent grant is a credential, and that almost nothing in a standard
 * response touches it. No password was stolen, so resetting passwords changes
 * nothing. No malware was installed, so the endpoint tooling has nothing to
 * find. Multi-factor authentication was satisfied honestly by every one of the
 * sixty, and the refresh token that came out the other side keeps working
 * after all of it.
 *
 * The room's whole instinct set is wrong here, and finding that out is the
 * exercise. The one action that matters is revoking grants, which most
 * responders have never done and which is not in any runbook on the floor.
 *
 * THE DECOY IS SOMETHING PEOPLE NEED
 *
 * One of the applications on the board is a genuine tool the finance team
 * depends on, holding the same scopes for the same reason. Revoking every
 * third-party grant is the tempting broad action and it stops month end. The
 * skill is separating an application by what it is rather than by what it can
 * do, because the malicious one and the necessary one ask for exactly the same
 * permissions.
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

const ID = 'they-said-yes';

export const THEY_SAID_YES: Scenario = {
  id: ID,
  title: 'They Said Yes',
  difficulty: 'advanced',
  durationMinutes: 70,
  situation:
    'It is 15:40 at Ridgeline Medical. An application nobody has heard of is reading sixty ' +
    'mailboxes, and every one of those people gave it permission.',
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
      surface: 'alert-queue',
      expertAlsoOn: ['cloud-audit'],
      summary: 'An application is reading mail for sixty accounts',
      detail:
        'The identity platform reports an application named Rota Sync Pro holding delegated ' +
        'permissions for 60 Ridgeline accounts. It has been reading mail through the API since ' +
        '11:20 today, at a steady rate, across all sixty mailboxes. The application was first ' +
        'consented to at 11:04 and was registered in a directory tenant created eleven days ago.',
      source: 'identity platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 180,
      surface: 'raw-log',
      summary: 'Everybody clicked the button on purpose',
      detail:
        'Each of the sixty saw the standard consent screen and approved it. The link came in a ' +
        'message styled as a rota tool announcement from the staffing office, which is plausible ' +
        'because Ridgeline announced a rota system review last month. There is no exploit, no ' +
        'attachment and no credential theft anywhere in the sequence.',
      source: 'identity platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 360,
      surface: 'cloud-audit',
      summary: 'The permissions it asked for',
      detail:
        'Rota Sync Pro requested and received Mail.Read, Mail.Send, Files.Read.All and ' +
        'offline_access. The consent screen displayed all four in plain language. The offline ' +
        'access permission is what allows it to hold a refresh token and continue without the ' +
        'person being present.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 550,
      surface: 'cloud-audit',
      summary: 'A password reset does not stop it',
      detail:
        'Twelve of the sixty accounts had their passwords reset at 14:30 as a precaution when the ' +
        'first report came in. The application has continued reading mail for all twelve without ' +
        'interruption. Its refresh token is not tied to the password and survives a reset, a ' +
        'multi-factor challenge and a session revocation.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 740,
      surface: 'network-flow',
      summary: 'What it has actually taken',
      detail:
        'API call records show the application has enumerated all mail in each of the sixty ' +
        'mailboxes and retrieved the full content of messages matching a search for the words ' +
        'invoice, remittance, bank and payment. Roughly 4,200 messages have been retrieved. Nine of ' +
        'the sixty accounts belong to the finance team. It has also sent four messages.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 930,
      surface: 'cloud-audit',
      summary: 'A second application with identical permissions, which finance needs',
      detail:
        'A review of consented applications finds Statement Reconciler, which holds Mail.Read, ' +
        'Files.Read.All and offline_access for eleven finance accounts. It was consented to in ' +
        'March, is on the vendor marketplace with a verified publisher, appears in the approved ' +
        'supplier register, and is the tool the finance team uses to match remittances against ' +
        'invoices. Month end starts on Thursday.',
      source: 'identity platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 1120,
      surface: 'raw-log',
      summary: 'Anybody could grant this and nobody had to approve it',
      detail:
        'The tenant setting allows any user to consent to any third-party application requesting ' +
        'delegated permissions, which is the default and has never been changed. There is no admin ' +
        'consent workflow, no publisher verification requirement and no alert on a new application ' +
        'appearing. Ridgeline currently has 214 consented third-party applications and no register ' +
        'of which are sanctioned.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1310,
      surface: 'alert-queue',
      summary: 'What can be done and what each thing breaks',
      detail:
        'The application registration can be blocked in the tenant in about two minutes, which stops ' +
        'all sixty grants at once. Individual grants can be revoked one at a time. Turning off user ' +
        'consent entirely takes one setting and will block every new third-party application until ' +
        'somebody builds an approval process, which nobody owns. Revoking all third-party grants ' +
        'would stop Statement Reconciler and month end with it.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1500,
      surface: 'alert-queue',
      summary: 'Nothing in the estate was watching for this',
      detail:
        'Ridgeline has endpoint detection, mail filtering, a password policy and multi-factor ' +
        'authentication on every account. None of them has any view of a consent grant. The ' +
        'incident was found because a member of staff thought the rota tool looked wrong after ' +
        'approving it and rang the service desk at 15:12, four hours after the first consent.',
      source: 'security programme',
      claimedSeverity: 'high',
    },
  ],
};

export const THEY_SAID_YES_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 11:04 somebody sent Ridgeline staff a message styled as a rota tool announcement from the staffing office, which was plausible because Ridgeline announced a rota system review last month. The link went to a standard consent screen for an application called Rota Sync Pro, registered in a directory tenant created eleven days earlier.',
    'Sixty people read the screen and approved it. It asked for Mail.Read, Mail.Send, Files.Read.All and offline_access, and displayed all four in plain language. Nobody was tricked into revealing anything and no credential was stolen. They said yes.',
    'From 11:20 the application read mail across all sixty mailboxes, enumerated everything, and retrieved the full content of messages matching invoice, remittance, bank and payment. About 4,200 messages. Nine of the sixty are finance accounts. It has also sent four messages.',
    'Twelve passwords were reset at 14:30 as a precaution and the application kept reading all twelve mailboxes without interruption, because its refresh token is not tied to the password and survives a reset, a multi-factor challenge and a session revocation. Every instinct pointed at passwords and none of them touched this.',
    'Statement Reconciler holds the same scopes for eleven finance accounts, was consented to in March, is on the vendor marketplace with a verified publisher, is in the approved supplier register, and is what finance uses to match remittances against invoices. Month end starts Thursday. The malicious application and the necessary one asked for the same permissions.',
    'The tenant allows any user to consent to any application, which is the default and was never changed. No admin consent workflow, no publisher requirement, no alert on a new application. There are 214 consented third-party applications and no register of which are sanctioned.',
    'Blocking the Rota Sync Pro registration in the tenant stops all sixty grants in about two minutes.',
    'Ridgeline has endpoint detection, mail filtering, a password policy and multi-factor authentication, and none of them can see a consent grant. This was found because somebody thought the tool looked wrong after approving it and rang the service desk at 15:12, four hours in.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1528'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'Sixty mailboxes being read right now by an application from a tenant that is eleven days ' +
        'old. Raise it on those two facts alone: the age of the tenant is the strongest single ' +
        'signal here, because a legitimate vendor with sixty customers at one hospital did not ' +
        'register their directory a week and a half ago. What matters more than the severity is ' +
        'noticing early what kind of incident this is, because the labels the room reaches for will ' +
        'be wrong. Nothing has been compromised in the sense the word usually carries. No account ' +
        'was taken, no host was touched, and there is no malware to look for. An application is ' +
        'holding permission it was given, and the response to that lives in a console most of the ' +
        'floor has never opened.',
      standIn:
        'Sixty mailboxes being read right now by an application from a tenant registered eleven days ' +
        'ago. That age is the strongest thing on the row, because no real vendor with sixty ' +
        'customers here set up their directory a week and a half back. Raising it. And everybody get ' +
        'the shape right early, because the words we normally use are wrong. Nothing was ' +
        'compromised. No account taken, no host touched, no malware to find. An application is using ' +
        'permission we gave it, and the fix lives in a console most of us have never opened.',
      commandOptions: [
        { command: "idp-cli app list --with-grants --sort-by created | head -20", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.applications[] | select(.name==\"Rota Sync Pro\") | \"\\(.tenantCreated) \\(.grants|length)\"' /evidence/identity/apps.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/apps.json', ...DUMP_ALL },
        { command: 'curl -s https://rotasyncpro.example/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out when that application and its tenant were registered.',
      guidance:
        'An application is reading mail. Ask how old it is.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1566.002', 'T1528'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.sandbox', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'There is no exploit here and there is nothing to reverse. Sixty people were shown the ' +
        'standard consent screen, read it, and pressed approve, and the screen was the real one. ' +
        'The only deception was the message that carried the link, which claimed to be a rota tool ' +
        'from the staffing office at an organisation that announced a rota system review last ' +
        'month. That timing is the technique. Say clearly that nobody was tricked into revealing ' +
        'anything, because the room will keep reaching for the moment somebody typed a password ' +
        'and there is not one, and because the write-up will otherwise describe a phishing attack ' +
        'and send everybody back to mail filtering. The useful framing is that the attacker asked ' +
        'for permission and was given it, which means the defence is about what people can grant ' +
        'rather than about what they can be fooled into typing.',
      standIn:
        'No exploit, nothing to reverse. Sixty people saw the real consent screen, read it, and ' +
        'pressed approve. The only lie was the message carrying the link, claiming to be a rota tool ' +
        'from staffing, at a place that announced a rota review last month. That timing is the ' +
        'technique. Nobody was tricked into revealing anything, and I want that said, because we ' +
        'will keep hunting the moment somebody typed a password and there is not one. He asked for ' +
        'permission and we gave it. So the defence is about what people can grant, not what they can ' +
        'be fooled into typing.',
      commandOptions: [
        { command: "jq -r '.consents[] | select(.app==\"Rota Sync Pro\") | \"\\(.time) \\(.user)\"' /evidence/identity/consents.json | sort | head", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'rota|staffing' /var/log/mail/delivered-today.log | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mail-gateway', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/consents.json', ...DUMP_ALL },
        { command: 'grep -rn "rota" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Find how the sixty people arrived at the consent screen, and what the screen showed them.',
      guidance:
        'Sixty people approved it. Ask what they were shown.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1528'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.chain', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Four permissions, and the fourth is the one that turns an incident into a residency. ' +
        'Mail.Read is the collection, Mail.Send means it can write as those people, Files.Read.All ' +
        'reaches beyond mail entirely, and offline_access is what lets it hold a refresh token and ' +
        'keep working when nobody is at a screen. Without that fourth scope this stops when everyone ' +
        'goes home. With it, it does not stop for anything the room is about to try. Read the scopes ' +
        'as a sentence about capability rather than as a list, because the list looks like ' +
        'configuration and the sentence is the impact statement. And note the uncomfortable part ' +
        'before somebody else does: the consent screen displayed all four in plain language and ' +
        'sixty people approved anyway, which is a fact about how that screen performs rather than ' +
        'about sixty individuals.',
      standIn:
        'Four permissions, and the fourth is what turns an incident into a residency. Mail.Read is ' +
        'the collection. Mail.Send means it can write as those people. Files.Read.All goes past mail ' +
        'altogether. And offline_access is the refresh token, which is why it keeps working when ' +
        'nobody is at a screen. Without that this stops when everyone goes home. With it, it does ' +
        'not stop for anything we are about to try. Read the scopes as a sentence, not a list. And ' +
        'the screen showed all four in plain English and sixty people said yes anyway, which is a ' +
        'fact about the screen, not about sixty people.',
      commandOptions: [
        { command: "jq -r '.applications[] | select(.name==\"Rota Sync Pro\") | .scopes[]' /evidence/identity/apps.json", correct: true, teaches: CORRECT_STEP },
        { command: "idp-cli app show 'Rota Sync Pro' --scopes", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/apps.json', ...DUMP_ALL },
        { command: 'grep -c scope /evidence/identity/apps.json', ...COUNT_ONLY },
      ],
      commandNudge:
        'List every permission it was granted and say what each one lets it do.',
      guidance:
        'It has permission. Ask exactly what for.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1528'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.iam-audit', 'act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.dismiss', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'Twelve passwords were reset at half past two and the application never missed a message. ' +
        'This is the most useful row on the board and it is useful because it is a failure: the ' +
        'standard response was applied, in good faith, promptly, and it did nothing. A refresh ' +
        'token is not tied to the password, so it survives a reset, survives a multi-factor ' +
        'challenge and survives a session revocation, and every one of those is an action a ' +
        'competent responder reaches for first. Somebody should say out loud that the twelve resets ' +
        'were not wasted effort but were the wrong tool, and that the room now knows something ' +
        'about this class of incident it can carry forever: when the thing holding access is a ' +
        'grant rather than a credential, you have to revoke the grant, and nothing else is a ' +
        'substitute for it.',
      standIn:
        'Twelve passwords reset at half two and it did not miss a message. This is the most useful ' +
        'thing on the board and it is useful because it failed. We did the standard thing, promptly ' +
        'and in good faith, and it did nothing. A refresh token is not tied to the password, so it ' +
        'survives a reset, an MFA challenge and a session revocation, and those are the first three ' +
        'things any of us reach for. The twelve resets were not wasted, they were the wrong tool. ' +
        'When what holds access is a grant and not a credential, you revoke the grant. Nothing else ' +
        'substitutes.',
      commandOptions: [
        { command: "jq -r '.apiCalls[] | select(.app==\"Rota Sync Pro\" and .time > \"14:30\") | .user' /evidence/identity/api-calls.json | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "grep -c 'Rota Sync Pro' /var/log/identity/graph-access-1430-1540.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/api-calls.json', ...DUMP_ALL },
        { command: 'idp-cli user reset-password --bulk /evidence/identity/sixty.txt', ...MUTATE },
      ],
      commandNudge:
        'Check whether the application stopped for the twelve accounts whose passwords changed.',
      guidance:
        'Passwords were reset. Ask whether it made any difference.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1114.002'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ir-lead', 'network-analyst'],
      correctActions: ['act.timeline', 'act.scope-estate', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.tune'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'It enumerated everything and pulled the content of anything matching invoice, remittance, ' +
        'bank and payment, which is about 4,200 messages, and nine of the sixty are finance. Those ' +
        'search terms are the intent statement and they arrive before any theory does: this is ' +
        'preparation for payment fraud, not general espionage, and the four messages it has sent ' +
        'are the part that should move fastest, because a message sent from a real Ridgeline ' +
        'mailbox in an existing thread is the hardest thing to defend against downstream. Find out ' +
        'who those four went to before anything else on this row. The volume figure is what the ' +
        'notification obligation will turn on and the four sent messages are what tomorrow ' +
        'incident will turn on, and it is easy to spend the afternoon on the first and miss the ' +
        'second.',
      standIn:
        'It enumerated everything and pulled the content of anything matching invoice, remittance, ' +
        'bank and payment. Four thousand two hundred messages, nine finance accounts. Those search ' +
        'terms are the intent, and they arrive before any theory: this is preparation for payment ' +
        'fraud, not espionage. And it has sent four messages. Those move fastest, because a message ' +
        'from a real Ridgeline mailbox inside an existing thread is the hardest thing anybody ' +
        'downstream can defend against. Who did the four go to. The 4,200 is what the notification ' +
        'turns on. The four are what tomorrow turns on.',
      commandOptions: [
        { command: "jq -r '.apiCalls[] | select(.app==\"Rota Sync Pro\" and .op==\"sendMail\") | \"\\(.time) \\(.user) \\(.to)\"' /evidence/identity/api-calls.json", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.apiCalls[] | select(.app==\"Rota Sync Pro\") | .query' /evidence/identity/api-calls.json | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status exchange', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/api-calls.json', ...DUMP_ALL },
        { command: 'grep -c sendMail /evidence/identity/api-calls.json', ...COUNT_ONLY },
      ],
      commandNudge:
        'It read and it also sent. Find the four messages it sent and who received them.',
      guidance:
        'It has been reading. Ask whether it has been writing.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['soc-operator', 'mitigation-specialist'],
      correctActions: ['act.corroborate', 'act.dismiss'],
      outOfLaneActions: ['act.revoke-key', 'act.triage-high', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'Identical permissions, entirely different application. Statement Reconciler has the same ' +
        'scopes for the same reason a malicious application would want them, and it is on the ' +
        'marketplace with a verified publisher, in the approved supplier register, consented in ' +
        'March, and is what finance uses to match remittances against invoices with month end on ' +
        'Thursday. Close it. The reason this row exists is that the broad action is about to be ' +
        'proposed, and revoking every third-party grant would take this with it and stop month end. ' +
        'The discriminator is not the permission set, because both applications ask for the same ' +
        'thing and always will: it is publisher, register entry, consent age and whether anybody ' +
        'can name a person who asked for it. Judge an application by what it is, not by what it ' +
        'can do, and be ready to say that to somebody who wants one decisive click.',
      standIn:
        'Same permissions, completely different application. Statement Reconciler wants those scopes ' +
        'for the reason a malicious one would, and it is marketplace, verified publisher, in the ' +
        'supplier register, consented in March, and it is what finance uses to match remittances ' +
        'with month end on Thursday. Closing it. This row exists because somebody is about to ' +
        'propose revoking every third-party grant, and that stops month end. The discriminator is ' +
        'not the scopes, both ask for the same and always will. It is publisher, register, consent ' +
        'age, and whether anyone can name who asked for it. Judge what it is, not what it can do.',
      commandOptions: [
        { command: "grep -i 'statement reconciler' /evidence/procurement/approved-suppliers.csv", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.applications[] | \"\\(.name) \\(.publisherVerified) \\(.firstConsent)\"' /evidence/identity/apps.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/procurement/approved-suppliers.csv', ...DUMP_ALL },
        { command: 'idp-cli grant revoke --all-third-party', ...MUTATE },
      ],
      commandNudge:
        'The permissions are the same. Find something about the applications that is not.',
      guidance:
        'A second application has the same access. Ask what else is true of it.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.scope-estate', 'act.predict'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Any user can consent to any application, which is the default and has never been changed, ' +
        'and there are 214 consented applications with no register of which are sanctioned. That is ' +
        'the actual condition being exploited today, and nobody chose it: it is what the tenant ' +
        'shipped with. The number to sit with is 214, because it means that until today nobody at ' +
        'Ridgeline could have answered what has access to our mail, and after today somebody has to ' +
        'go through all of them applying exactly the judgement the previous row needed. That is a ' +
        'piece of work with no owner and it should be named as such rather than implied. The ' +
        'prediction is straightforward: with this setting unchanged, the next application takes one ' +
        'message and one plausible pretext, and nothing on the floor sees it any faster than four ' +
        'hours.',
      standIn:
        'Any user can consent to any application. That is the default, it was never changed, and it ' +
        'is the condition being used today. Nobody chose it, it is what the tenant shipped with. The ' +
        'number to sit with is 214, because until this afternoon nobody here could answer what has ' +
        'access to our mail, and now somebody has to go through all of them applying the judgement ' +
        'we just used on Statement Reconciler. That job has no owner and I want it named, not ' +
        'implied. Prediction: leave the setting and the next one needs a message and a plausible ' +
        'pretext, and we see it in four hours again.',
      commandOptions: [
        { command: "idp-cli policy show consent --tenant", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.applications | length' /evidence/identity/apps.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status sso', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/tenant-policy.json', ...DUMP_ALL },
        { command: 'idp-cli policy set consent disabled', ...MUTATE },
      ],
      commandNudge:
        'Find out who is allowed to grant an application access, and how many have been granted.',
      guidance:
        'Sixty people could say yes. Ask who else can.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.check-rollback', 'act.compensating-control', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'One action ends this and it is narrow. Blocking the Rota Sync Pro registration in the ' +
        'tenant kills all sixty grants at once in about two minutes, which beats revoking sixty ' +
        'grants individually and beats every broad option on cost and on blast radius. Do that ' +
        'first and do not do anything else until it is confirmed, because while the room debates ' +
        'the tenant-wide consent setting the application is still reading. The consent setting is a ' +
        'real decision and it is not an incident action: turning off user consent blocks every new ' +
        'application until somebody builds an approval process, and nobody owns that process, so ' +
        'switching it off this afternoon means a queue of blocked legitimate requests by Monday ' +
        'with nobody to answer them. Propose it with the owner named or do not propose it. Never ' +
        'revoke all third-party grants: that is the click that stops month end. Deliberately left ' +
        'undone: 4,200 messages have been read and nothing recovers them, four messages went out ' +
        'from real mailboxes, and the other 213 applications are unreviewed tonight.',
      standIn:
        'One action ends this. Block the Rota Sync Pro registration in the tenant, two minutes, kills ' +
        'all sixty grants at once. Better than revoking sixty individually and better than anything ' +
        'broad. Do it now and nothing else until it is confirmed, because while we discuss the ' +
        'consent setting it is still reading. The consent setting is a real decision and it is not ' +
        'an incident action. Turn off user consent this afternoon and by Monday there is a queue of ' +
        'blocked legitimate requests and nobody owning the approval process. Propose it with a name ' +
        'attached or do not propose it. And nobody revoke all third-party grants, that is the click ' +
        'that stops month end. Left undone: 4,200 messages read and unrecoverable, four sent from ' +
        'real mailboxes, and 213 other applications nobody has looked at.',
      commandNudge:
        'Find the single action that stops all sixty at once, and check what else it affects.',
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
        'Endpoint detection, mail filtering, a password policy and multi-factor authentication on ' +
        'every account, and not one of them can see a consent grant. The whole security programme is ' +
        'built around two assumptions, that an attacker steals a credential or lands code on a ' +
        'machine, and this attacker did neither. It is worth stating that as a gap in the model ' +
        'rather than a gap in the tooling, because a request for another product will not fix it and ' +
        'the signal needed is already being emitted by the identity platform for free. What actually ' +
        'found this was a member of staff who approved the application, felt uneasy afterwards, and ' +
        'rang the service desk, four hours in, which is the second time this quarter that a person ' +
        'has been the detection. The rule to write is a new third-party application receiving ' +
        'consent from more than a handful of accounts in a day, and it is cheap; the harder ' +
        'recommendation is that a consent grant should be as visible on a dashboard as a password ' +
        'reset, and nobody currently thinks of it as an authentication event at all.',
      standIn:
        'Endpoint detection, mail filtering, password policy, MFA on every account, and none of them ' +
        'can see a consent grant. Our whole programme assumes an attacker steals a credential or ' +
        'lands code on a machine, and this one did neither. That is a gap in the model, not the ' +
        'tooling, so nobody go asking for a product. The identity platform is already emitting what ' +
        'we need for nothing. What found this was somebody who approved it, felt uneasy, and rang ' +
        'the desk four hours in, and that is the second time this quarter a person has been the ' +
        'detection. Rule is easy: a new third-party application consented by more than a handful of ' +
        'accounts in a day. The harder ask is that a consent grant belongs on the dashboard beside a ' +
        'password reset, and right now nobody here even calls it an authentication event.',
      commandOptions: [
        { command: "jq -r '.consents[] | \"\\(.time[0:10]) \\(.app)\"' /evidence/identity/consents.json | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: "grep -icE 'consent|oauth|grant' /evidence/detections/rule-inventory.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem', ...STATUS_CHECK },
        { command: 'cat /evidence/detections/rule-inventory.txt', ...DUMP_ALL },
        { command: 'grep -rn "oauth" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Check how many existing detections mention consent, and work out what one would look like.',
      guidance:
        'Nothing alerted for four hours. Ask what would have.',
    },
  ],
};
