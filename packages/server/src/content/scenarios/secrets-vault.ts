/**
 * Scenario 86: The Vault Did Its Job.
 *
 * Every vault control worked exactly as designed, and the credential has been
 * readable by forty people for eleven months.
 *
 * WHAT THIS TEACHES
 *
 * That a secrets vault does not stop a secret from leaking. It changes where
 * the leak happens, and the new place is downstream of everything the vault
 * can see.
 *
 * The audit log on this board is spotless and stays spotless. The right
 * service read the right secret at the right time under a thirty minute lease,
 * and an analyst who spends the hour looking for an unauthorised read will
 * find nothing, because there was not one. The secret left through the front
 * door, in the hands of the application that was supposed to have it, and then
 * kept going.
 *
 * TWO THINGS THAT LOOK LIKE CONTROLS AND ARE NOT
 *
 * A thirty minute lease on a static database password expires the lease, not
 * the password. The value handed out is the same value in thirty minutes and
 * in eleven months, and the TTL on the dashboard describes the wrapper.
 *
 * And the vault rollout was measured as finished when secrets stopped
 * appearing in the source repository. Nobody asked where they went instead.
 *
 * WHY ADVANCED
 *
 * Nothing is hidden and nothing is ambiguous, but the whole exercise runs
 * against the room's instincts: the evidence that would normally settle a
 * credential theft is clean, and the answer is found by asking what the
 * application did with a secret it was entitled to.
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

const ID = 'the-vault-did-its-job';

export const THE_VAULT_DID_ITS_JOB: Scenario = {
  id: ID,
  title: 'The Vault Did Its Job',
  difficulty: 'advanced',
  durationMinutes: 70,
  situation:
    'It is 13:15 at Fenmarch Credit. An engineer at a partner firm has sent us a screenshot of one ' +
    'of our database passwords, which they found while reading an error report.',
  roles: [
    'soc-operator',
    'log-analyst',
    'cloud-security',
    'forensics',
    'threat-intel',
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
      summary: 'A partner engineer found one of our database passwords',
      detail:
        'An engineer at a partner firm emailed our support address at 12:50 with a screenshot. It ' +
        'shows an error report in the shared error tracking workspace both firms use, and in the ' +
        'environment section of that report is FENMARCH_LEDGER_DB_PASSWORD with its value in ' +
        'plain text. They say they were looking at an unrelated issue and scrolled past it.',
      source: 'partner firm',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 190,
      surface: 'raw-log',
      summary: 'The vault audit log is completely clean',
      detail:
        'Every read of that secret in the retained twelve months came from the ledger service role, ' +
        'from the expected network, under a thirty minute lease, renewed on schedule and never ' +
        'renewed after the service stopped. There are no denied reads, no reads from a human ' +
        'account, no reads from an unexpected role and no gaps. The vault did precisely what it was ' +
        'installed to do.',
      source: 'secrets vault',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 370,
      surface: 'host-artefact',
      summary: 'The application puts it in the environment at startup',
      detail:
        'The ledger service reads the secret at boot through the vault agent and exports it as an ' +
        'environment variable, which is how the framework expects database credentials to be ' +
        'supplied. From that moment it is in the process environment, readable by anything that can ' +
        'read the process, and present in anything that captures the environment.',
      source: 'FEN-LEDGER-02',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 560,
      surface: 'cloud-audit',
      summary: 'The crash handler sends the environment to a third party',
      detail:
        'The error tracking SDK captures the full process environment with every unhandled ' +
        'exception and posts it to the vendor. The workspace is shared with two partner firms, has ' +
        '40 members including 6 contractors, and retains reports for 14 months. Nothing about this ' +
        'is a misconfiguration: capturing the environment is the default and is why the SDK is ' +
        'useful.',
      source: 'error tracking vendor',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 750,
      surface: 'raw-log',
      summary: 'The lease was thirty minutes and the password has not changed since 2024',
      detail:
        'The vault issues this secret under a thirty minute lease, which is what the dashboard ' +
        'reports and what the design document describes. The secret itself is a static value stored ' +
        'in the vault, last changed in November 2024. The lease governs how long a client may hold ' +
        'the handle. The value it returns is the same value every time.',
      source: 'secrets vault',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 940,
      surface: 'cloud-audit',
      summary: 'The oldest report containing it is from last October',
      detail:
        'A search of the workspace returns 1,340 reports from the ledger service carrying that ' +
        'environment variable. The oldest is 14 October, eleven months ago, which is also the ' +
        'retention limit, so it is the oldest that still exists rather than the first. The vault ' +
        'agent was deployed to that service in September of last year.',
      source: 'error tracking vendor',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1130,
      surface: 'host-artefact',
      summary: 'A second credential in the same reports, which does not matter',
      detail:
        'The same environment blocks contain SANDBOX_PAYMENTS_KEY. It belongs to the payment ' +
        'provider test environment, is documented in the provider public quickstart with the same ' +
        'value for every customer, and reaches no live system. It is in the reports for the same ' +
        'reason and carries no exposure at all.',
      source: 'error tracking vendor',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1320,
      surface: 'alert-queue',
      summary: 'Changing the password stops nine services',
      detail:
        'The ledger database account is used by the ledger service and eight others, all of which ' +
        'read the same static secret from the vault at boot and hold it for the life of the ' +
        'process. There is no rotation runbook, no dual-credential support on the database account, ' +
        'and no way to change the value without restarting all nine. Two of the nine are in the ' +
        'overnight settlement path.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1500,
      surface: 'alert-queue',
      summary: 'The vault programme was closed when the repository was clean',
      detail:
        'The secrets programme closed in March with a report stating that no credentials remain in ' +
        'source control, which is true and was verified. The report does not say where the ' +
        'credentials went instead, and no piece of work looked at what applications do with a ' +
        'secret after they receive it. Fenmarch runs 61 services on the vault agent, and 44 of ' +
        'them use the same error tracking SDK.',
      source: 'security programme',
      claimedSeverity: 'critical',
    },
  ],
};

export const THE_VAULT_DID_ITS_JOB_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The Fenmarch ledger database password has been readable by about forty people, including six contractors at two other firms, for at least eleven months. Nobody stole it and no control failed in the sense the word is usually used.',
    'The vault behaved perfectly and its audit log stays clean under every query anybody runs today. The ledger service role read the secret it was entitled to, from the expected network, under a thirty minute lease, renewed on schedule. There is no unauthorised read to find.',
    'The service exports the secret as an environment variable at boot, which is how the framework expects database credentials to arrive. From then on it is in the process environment.',
    'The error tracking SDK captures the full process environment with every unhandled exception and posts it to the vendor. That is the default and it is why the SDK is useful. The workspace is shared with two partner firms, has 40 members and 6 contractors, and retains 14 months.',
    'So the secret left through the front door, held by the application that was supposed to have it, and kept going. 1,340 reports carry it. The oldest is 14 October, which is the retention limit rather than the beginning: the vault agent went on that service in September of the year before, so the true exposure starts earlier and cannot be measured.',
    'The thirty minute lease is a lease on a handle, not on a value. The secret is a static string last changed in November 2024, and the number on the dashboard describes the wrapper rather than the password.',
    'SANDBOX_PAYMENTS_KEY is in the same environment blocks and is a published test value from the provider quickstart, identical for every customer, reaching nothing live.',
    'Rotation stops nine services. All nine read the same static secret at boot and hold it for the life of the process, the database account has no dual-credential support, there is no runbook, and two of the nine sit in the overnight settlement path.',
    'The secrets programme closed in March having proved that no credentials remain in source control, which was true. Nothing in it asked where the credentials went instead. Forty-four of the 61 services on the vault agent use the same SDK.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1552.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.triage-high', 'act.preserve', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'A live database password in a workspace shared with two other firms, reported by somebody ' +
        'outside who scrolled past it. Raise it and preserve the screenshot and the message, ' +
        'because the reporter is a witness at a partner firm and their account of how they found it ' +
        'will matter more in a week than it does now. Two questions follow and only one of them is ' +
        'the obvious one. How did it get out is where the room will go. Who else can see it is the ' +
        'one that decides what the next hour looks like, because a shared workspace has a member ' +
        'list and that list is knowable in five minutes. Do not treat this as a vault breach yet: ' +
        'nothing so far says anybody read the secret improperly, only that it is somewhere it ' +
        'should not be, and those are different incidents with different first moves.',
      standIn:
        'Live database password sitting in a workspace we share with two other firms, and an outsider ' +
        'found it by scrolling. Raising it, preserving the screenshot and their email, because they ' +
        'are a witness at another firm and how they found it will matter more next week. Two ' +
        'questions: how did it get out, which is where everyone wants to go, and who else can see ' +
        'it, which decides the next hour and takes five minutes to answer. And nobody call this a ' +
        'vault breach yet. Nothing says anybody read it improperly, only that it is in the wrong ' +
        'place.',
      commandOptions: [
        { command: "grep -rn 'FENMARCH_LEDGER_DB_PASSWORD' /evidence/partner/report-export.json", correct: true, teaches: CORRECT_STEP },
        { command: 'errortrack-cli workspace members --workspace fenmarch-shared', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vault', ...STATUS_CHECK },
        { command: 'cat /evidence/partner/report-export.json', ...DUMP_ALL },
        { command: 'grep -rn "password" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Find out who can read that workspace before working out how the value reached it.',
      guidance:
        'A secret is somewhere it should not be. Ask who can see that place.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.revoke-key', 'act.contact-attacker'],
      escalateTo: ['forensics', 'ir-lead'],
      why:
        'The audit log is clean, and the room has to be told that this is an answer rather than a ' +
        'dead end. Every read came from the ledger service role, from the expected network, under a ' +
        'thirty minute lease, renewed on schedule and stopped when the service stopped. No denied ' +
        'reads, no human accounts, no gaps. An hour spent looking for the unauthorised read will ' +
        'find nothing, because there was not one, and the shape of that failure is worth naming: ' +
        'clean evidence where you expected dirty evidence is information, and treating it as ' +
        'missing evidence is how a room searches the same log four times. What it establishes is ' +
        'that the secret left in the hands of the service entitled to hold it, which moves the ' +
        'whole investigation downstream of the vault to a place the vault cannot see.',
      standIn:
        'The audit log is clean, and that is an answer, not a dead end. Every read is the ledger ' +
        'service role, expected network, thirty minute lease, renewed on schedule, stopped when the ' +
        'service stopped. No denials, no human accounts, no gaps. Do not spend an hour hunting the ' +
        'unauthorised read, there is not one. Clean evidence where you expected dirty evidence is ' +
        'information. What it tells us is that this left in the hands of the service that was ' +
        'supposed to have it, so we are now downstream of the vault, where the vault cannot see.',
      commandOptions: [
        { command: "jq -r '.entries[] | select(.path==\"ledger/db\") | \"\\(.time) \\(.role) \\(.result)\"' /evidence/vault/audit.json | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.entries[] | select(.result!=\"granted\")' /evidence/vault/audit.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vault', ...STATUS_CHECK },
        { command: 'cat /evidence/vault/audit.json', ...DUMP_ALL },
        { command: 'vault kv metadata delete secret/ledger/db', ...MUTATE },
      ],
      commandNudge:
        'Check the audit for a read that should not have happened, and be ready for there not to be one.',
      guidance:
        'The secret got out. Ask whether anybody took it improperly.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'detection-engineer'],
      correctActions: ['act.corroborate', 'act.chain'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.attribute-named', 'act.power-off'],
      escalateTo: ['cloud-security', 'ir-lead'],
      why:
        'Here is the hinge, and it is one line of ordinary application design. The service reads the ' +
        'secret at boot and exports it as an environment variable, because that is how the framework ' +
        'expects database credentials to arrive and how nearly every framework does. From that ' +
        'instant the secret is in the process environment: readable by anything that can read the ' +
        'process, and present in anything that captures the environment. This is not a bug and ' +
        'nobody should be looking for the person who wrote it. What it is is the moment the ' +
        'secret stops being under the vault control and starts being under the application, and ' +
        'the useful habit is to look for that moment in every design rather than at this one line. ' +
        'Handing a secret to something is not the end of the story, it is the point at which the ' +
        'story stops being told by your logs.',
      standIn:
        'Here is the hinge, and it is one line of completely ordinary code. The service reads the ' +
        'secret at boot and exports it as an environment variable, which is how the framework wants ' +
        'database credentials and how nearly all of them do it. From that instant it is in the ' +
        'process environment: readable by anything that can read the process, present in anything ' +
        'that captures the environment. Not a bug, and nobody go looking for who wrote it. It is the ' +
        'moment the secret leaves the vault control and joins the application, which is the moment ' +
        'our logs stop telling the story.',
      commandOptions: [
        { command: "grep -nE 'export|environ|getenv' /evidence/ledger/bootstrap.py", correct: true, teaches: CORRECT_STEP },
        { command: "tr '\\0' '\\n' < /evidence/ledger/proc-environ.dump | grep -i password", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ledger', ...STATUS_CHECK },
        { command: 'cat /evidence/ledger/bootstrap.py', ...DUMP_ALL },
        { command: 'kill -9 $(pgrep ledger)', ...MUTATE },
      ],
      commandNudge:
        'Read what the service does with the secret in the seconds after it receives it.',
      guidance:
        'The right service read it. Ask what it did with it next.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1552.001'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.iam-audit', 'act.scope-estate', 'act.corroborate'],
      outOfLaneActions: ['act.contact-attacker', 'act.dismiss', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The route out, and every part of it is a default nobody chose. The SDK captures the full ' +
        'process environment on an unhandled exception and posts it to the vendor, which is not a ' +
        'misconfiguration and is the reason anybody installs it: the environment is exactly what ' +
        'you want when you are debugging a crash at two in the morning. The exposure is who is on ' +
        'the other end. Forty members, six contractors, two partner firms, fourteen months of ' +
        'retention. Say that as a number of people rather than as a vendor name, because the board ' +
        'will otherwise hear that a third party has our data and reach for the contract, when the ' +
        'actual finding is that six contractors at other companies could read a live database ' +
        'password and one of them did, by accident, while looking at something else.',
      standIn:
        'Here is the route out, and every step is a default nobody chose. The SDK grabs the whole ' +
        'process environment on an unhandled exception and posts it to the vendor. That is not a ' +
        'misconfiguration, it is why you install it, because the environment is what you want at two ' +
        'in the morning. The exposure is who is on the other end: forty members, six contractors, ' +
        'two partner firms, fourteen months. I want that said as people, not as a vendor. Six ' +
        'contractors at other companies could read a live database password, and one of them did, ' +
        'by accident, while looking at something else.',
      commandOptions: [
        { command: "grep -iE 'send_default_pii|environment|attach' /evidence/ledger/errortrack.conf", correct: true, teaches: CORRECT_STEP },
        { command: 'errortrack-cli workspace members --workspace fenmarch-shared --show-org', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ledger', ...STATUS_CHECK },
        { command: 'cat /evidence/ledger/errortrack.conf', ...DUMP_ALL },
        { command: 'curl -s https://errortrack.example/api/0/projects/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find what the crash handler attaches, and who can read what it sends.',
      guidance:
        'It is in the environment. Ask what reads the environment.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.revoke-key', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The thirty minutes on the dashboard is real and describes the wrong object. It is a lease ' +
        'on the handle: how long a client may hold this issuance before renewing. The value behind ' +
        'the handle is a static string last changed in November 2024, so every renewal for two ' +
        'years has returned the same password. Anybody reading the design document would conclude ' +
        'that a leaked value is stale within half an hour, and the value in that screenshot works ' +
        'right now. The general lesson is worth more than this instance: a TTL is a property of ' +
        'something, and it is worth saying out loud which thing, because dynamic credentials and ' +
        'leased static ones present identically on a dashboard and behave completely differently ' +
        'the moment one of them escapes.',
      standIn:
        'The thirty minutes is real and it describes the wrong thing. It is a lease on the handle, ' +
        'how long a client holds an issuance before renewing. The value behind it is a static string ' +
        'last changed in November 2024, so every renewal for two years handed back the same ' +
        'password. Read the design document and you would think a leaked value goes stale in half an ' +
        'hour. The one in that screenshot works right now. A TTL is a property of something, and it ' +
        'is worth saying which: dynamic credentials and leased static ones look identical on a ' +
        'dashboard and behave nothing alike once one gets out.',
      commandOptions: [
        { command: "vault kv metadata get -format=json secret/ledger/db | jq '.data.updated_time, .data.versions'", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.entries[] | select(.path==\"ledger/db\") | .lease_id' /evidence/vault/audit.json | sort -u | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vault', ...STATUS_CHECK },
        { command: 'cat /evidence/vault/config.hcl', ...DUMP_ALL },
        { command: 'vault lease revoke -prefix secret/ledger', ...MUTATE },
      ],
      commandNudge:
        'Ask what the thirty minute lease applies to, and when the value itself last changed.',
      guidance:
        'The lease is short. Ask what has a lease on it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1552.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.scope-estate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['ir-lead'],
      why:
        'Thirteen hundred and forty reports, oldest 14 October. The number that matters is the one ' +
        'that is not there. Fourteen October is exactly the retention limit, so it is the oldest ' +
        'report that still exists rather than the first one that carried the secret, and the vault ' +
        'agent went onto that service the September before. So the exposure began earlier than the ' +
        'evidence can show and the honest answer to how long is at least eleven months, with no ' +
        'upper bound available from this source. Write it that way, because the version that gets ' +
        'repeated in a meeting is whichever number sounds definite, and eleven months stated ' +
        'flatly will be read as the answer by everybody who was not here. A boundary that coincides ' +
        'with a retention limit is almost never the real boundary, and noticing that is most of the ' +
        'skill on this row.',
      standIn:
        'Thirteen hundred and forty reports, oldest the fourteenth of October. The number that ' +
        'matters is the one that is not there: the fourteenth of October is exactly our retention ' +
        'limit, so that is the oldest surviving report, not the first one. The vault agent went on ' +
        'that service the September before. So it is at least eleven months and there is no upper ' +
        'bound from this source. I want it written that way, because whichever number sounds ' +
        'definite is the one that gets repeated. A boundary that lands on a retention limit is ' +
        'almost never the real boundary.',
      commandOptions: [
        { command: "errortrack-cli search --workspace fenmarch-shared --query FENMARCH_LEDGER_DB_PASSWORD --oldest", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'retention|days' /evidence/errortrack/workspace-settings.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ledger', ...STATUS_CHECK },
        { command: 'cat /evidence/errortrack/report-index.json', ...DUMP_ALL },
        { command: 'errortrack-cli search --workspace fenmarch-shared --count', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the oldest report carrying it, then check what the retention setting is.',
      guidance:
        'You have an earliest date. Ask whether it is the earliest that happened.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'threat-intel',
      alsoAppropriate: ['cloud-security', 'soc-operator'],
      correctActions: ['act.corroborate', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.revoke-key', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'A second credential in the same environment blocks, and it carries no exposure at all. ' +
        'SANDBOX_PAYMENTS_KEY belongs to the provider test environment, is printed in their public ' +
        'quickstart with the same value for every customer in the world, and reaches nothing live. ' +
        'Close it. The reason to check rather than assume is that it looks exactly like the finding ' +
        'that matters and sits three lines below it, so the cost of being wrong in either direction ' +
        'is real: reported as a second exposure it inflates a serious incident with something ' +
        'anybody can already read, and waved away without looking it would be the one time the ' +
        'variable name lied. One search of the provider documentation settles it, and that check is ' +
        'the whole of the work here.',
      standIn:
        'Second credential in the same blocks, and it is nothing. Sandbox payments key, provider test ' +
        'environment, printed in their public quickstart with the same value for every customer ' +
        'alive, reaches nothing live. Closing it. Worth the check rather than the assumption, ' +
        'because it looks exactly like the real finding and sits three lines under it. Report it as ' +
        'a second exposure and we inflate a serious incident with something anybody can already ' +
        'read. Wave it away without looking and it is the one time the name lied.',
      commandOptions: [
        { command: "grep -iE 'sandbox|test key' /evidence/intel/payments-quickstart.txt", correct: true, teaches: CORRECT_STEP },
        { command: "grep -rl 'SANDBOX_PAYMENTS_KEY' /evidence/config/ | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status payments', ...STATUS_CHECK },
        { command: 'cat /evidence/intel/payments-quickstart.txt', ...DUMP_ALL },
        { command: 'curl -s https://payments.example/v1/charges', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out what that second key actually reaches before treating it as a second exposure.',
      guidance:
        'There are two credentials here. Ask what the second one opens.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Rotation is the obvious answer and it stops nine services, two of them in the overnight ' +
        'settlement path, with no runbook and no dual-credential support on the account. Do not ' +
        'lead with it. The cheap actions are elsewhere and they are what buys time: turn off ' +
        'environment capture in the SDK, which is a configuration change and stops the bleeding ' +
        'immediately; get the vendor to purge the 1,340 reports, which is a support request; and ' +
        'cut the workspace membership from forty to the people who need it, which takes minutes and ' +
        'is worth doing whatever else happens. Then restrict the database account at the network ' +
        'layer so the password alone is not enough from outside, which is the compensating control ' +
        'that makes the rotation schedulable rather than urgent. Rotation itself goes into a change ' +
        'window with all nine services and a rollback plan, and the rollback question is the one to ' +
        'ask out loud, because a rotation that half succeeds at three in the morning is a worse ' +
        'incident than the one being fixed. Deliberately left undone: the password has been ' +
        'readable by forty people for at least eleven months, nothing can un-read it, and until it ' +
        'is rotated the exposure continues.',
      standIn:
        'Rotation is the obvious answer and it stops nine services, two of them in overnight ' +
        'settlement, no runbook, no dual credentials on the account. We are not leading with it. ' +
        'Cheap things first: turn off environment capture in the SDK, that is config and it stops ' +
        'the bleeding now. Ask the vendor to purge the thirteen hundred reports. Cut that workspace ' +
        'from forty people to the ones who need it, which takes minutes and is right anyway. Then ' +
        'lock the database account at the network layer so the password alone is not enough from ' +
        'outside, which turns rotation from urgent into scheduled. Rotation goes in a change window ' +
        'with all nine and a rollback plan, and somebody answer the rollback question out loud, ' +
        'because a half-finished rotation at three in the morning is worse than what we have. Left ' +
        'undone: forty people have had this for eleven months and nothing un-reads it.',
      commandNudge:
        'Find the actions that reduce exposure without restarting anything, and do those first.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.propose-rule', 'act.scope-estate', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'The finding that outlives the incident, and it is about a definition rather than a control. ' +
        'The secrets programme closed in March having proved that no credentials remain in source ' +
        'control. That was true, it was verified, and it was the wrong finish line: nothing in the ' +
        'programme asked where the credentials went instead, so the work moved every secret from a ' +
        'place that is audited into a place that is not, and then declared success. Forty-four of ' +
        'sixty-one services on the vault agent run the same SDK, so the prediction writes itself and ' +
        'should be written down with a number rather than a worry. The detection is cheap and ' +
        'nobody builds it because it looks like somebody else job: scan outbound crash reports for ' +
        'values that match vault secrets before they leave, which is a comparison against a list ' +
        'the platform already holds. What makes this the important row is the general shape. A ' +
        'control programme measured by what it removed will always look finished, because the ' +
        'question of what it created is not on the form.',
      standIn:
        'This is the bit that outlives the incident, and it is a definition problem, not a control ' +
        'problem. The programme closed in March having proved no credentials remain in source ' +
        'control. True, verified, and the wrong finish line. Nothing asked where they went instead, ' +
        'so we moved every secret from somewhere audited to somewhere that is not and called it ' +
        'done. Forty-four of sixty-one services run the same SDK, so write the prediction down with ' +
        'a number. The detection is cheap and looks like somebody else job: compare outbound crash ' +
        'reports against the vault secret values before they leave. A programme measured by what it ' +
        'removed always looks finished, because what it created is not on the form.',
      commandOptions: [
        { command: "grep -rl 'errortrack' /evidence/estate/service-manifests/ | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"vault-agent\" {print $1}' /evidence/estate/services.csv | sort", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vault-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/estate/services.csv', ...DUMP_ALL },
        { command: 'grep -rn "secret" /evidence/estate/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Count how many other services do both of the things this one did.',
      guidance:
        'This service leaked it. Ask how many others are built the same way.',
    },
  ],
};
