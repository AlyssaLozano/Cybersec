/**
 * Identity and Access Foundations: the discipline that decides who can do what.
 *
 * WHY IT IS ITS OWN TRACK
 *
 * Identity is where most intrusions in this catalogue actually begin. The
 * simulated host was compromised through a stale account with a guessable
 * password and sudo rights it should never have had, and every package that
 * touches that story arrives at the same place from a different direction. This
 * one starts there instead.
 *
 * It is also a genuinely separate career. An IAM analyst spends their week on
 * joiners and leavers, access reviews, entitlement models and a help desk that
 * resets passwords, and almost none of it looks like incident response. The
 * roles pay well, the demand is steady, and the work suits people who like
 * systems and process more than they like chasing alerts.
 *
 * WHY IT NEEDS NO TERMINAL
 *
 * There is no simulated directory or identity provider in this platform, and
 * inventing one would teach a product rather than the discipline. What can be
 * taught honestly is the judgement: what an account is worth, which control
 * actually stops the attack, why the mover case is the one everybody gets wrong,
 * and how to run a review that means something. Every exercise grades a
 * determination.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

// --- shared teaching material ------------------------------------------------

const AAA_TEACH = {
  concept:
    'Four words get used interchangeably and mean different things, and almost every muddled ' +
    'identity conversation is really a mix-up between them.\n\n' +
    'IDENTIFICATION is the claim: I am this person. AUTHENTICATION is the proof: here is evidence ' +
    'the claim is true. AUTHORISATION is the decision that follows: given who you are, may you do ' +
    'this? ACCOUNTING is the record: what did that identity actually do.\n\n' +
    'Three more distinctions matter as much. An IDENTITY is the person or service. An ACCOUNT is a ' +
    'representation of that identity in one system, and one identity usually has many. A ' +
    'CREDENTIAL is what proves control of an account, and it is not the account: revoking a ' +
    'password does not remove access if a key, a token, or a second account still works.\n\n' +
    'That last point is the one that turns into incidents. Teams say "we disabled the user" and ' +
    'mean they reset one password, while the API token, the SSH key and the account in the ' +
    'unfederated legacy system all still authenticate perfectly.',
} as const;

const FACTOR_TEACH = {
  concept:
    'Authentication factors are traditionally grouped as something you KNOW (a password), ' +
    'something you HAVE (a phone, a hardware key, a certificate), and something you ARE (a ' +
    'fingerprint or face). Multi-factor means genuinely different categories: a password plus a ' +
    'security question is two things you know, and buys almost nothing.\n\n' +
    'What matters far more than the count is whether a factor resists PHISHING. A code you can ' +
    'read out or type in can be relayed by an attacker in real time, which covers SMS codes, ' +
    'authenticator app codes, and push approvals. A factor bound to the site you are actually ' +
    'visiting cannot be relayed, because the browser will not release it to the wrong origin, and ' +
    'that is what makes security keys and passkeys categorically stronger rather than incrementally.\n\n' +
    'So the useful hierarchy is not one factor, two factors, three factors. It is: password alone, ' +
    'password plus something relayable, and password plus something bound to the origin. The step ' +
    'that removes the most attacks is the last one, and it is the one organisations defer longest.',
} as const;

// --- Module idm.1: what identity actually is ---------------------------------

const MODULE_IDM_1: Exercise[] = [
  {
    id: 'idm.1.1',
    moduleId: 'idm.1',
    packageId: 'identity-foundations',
    order: 1,
    title: 'Four words that are not the same word',
    kind: 'multiple-choice',
    goal: 'Separate identification, authentication, authorisation and accounting.',
    prompt:
      'A user signs in and opens a payroll record. Which of the following describe the steps ' +
      'correctly? Select all that apply.',
    teach: AAA_TEACH,
    options: [
      { id: 'a', label: 'Entering a username is identification: a claim about who they are.' },
      { id: 'b', label: 'Providing a password or a key is authentication: evidence for the claim.' },
      { id: 'c', label: 'Deciding whether they may open that payroll record is authorisation.' },
      { id: 'd', label: 'Recording that they opened it is accounting, and is what makes the other three reviewable.' },
      { id: 'e', label: 'A successfully authenticated user is by definition authorised for what they then request.' },
    ],
    hints: [
      'Four are correct. One collapses two separate decisions into one.',
      'Proving who you are and being allowed to do something are different questions.',
      'If authentication implied authorisation, what would permissions be for?',
    ],
    solution:
      'A, B, C, and D. Claim, proof, decision, record. E is the collapse that produces real ' +
      'breaches: proving who you are says nothing about what you may do, and a system that treats ' +
      'a valid login as blanket permission is one where any compromised account reaches everything. ' +
      'Keeping the two apart is what makes least privilege possible at all.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats a successful login as permission for whatever is requested next.',
      },
    ],
    debrief:
      'Accounting is the one people skip. Without a record of what an identity did, you cannot ' +
      'investigate a compromise or evidence an access review, and both of those are most of this ' +
      'job.',
    practice: [],
  },
  {
    id: 'idm.1.2',
    moduleId: 'idm.1',
    packageId: 'identity-foundations',
    order: 2,
    title: 'One person, many accounts',
    kind: 'multiple-choice',
    goal: 'Tell identity, account and credential apart, and see why it matters on a leaver.',
    prompt:
      'An employee leaves and the service desk reports that the account has been disabled. Which ' +
      'of the following are legitimate concerns? Select all that apply.',
    teach: {
      concept:
        'One person is usually many accounts: the directory account, a local account on a server ' +
        'somebody made in 2019, a SaaS account provisioned by a team card, an API token, an SSH ' +
        'key, a shared mailbox they still hold. Disabling the directory account addresses one of ' +
        'them.\n\n' +
        'The gap between them is the gap between IDENTITY and ACCOUNT. Where an application is ' +
        'federated to the central identity provider, disabling the identity really does close the ' +
        'door, because the application asks the provider on every login. Where it is not federated, ' +
        'the application has its own account store and no idea anything happened.\n\n' +
        'Credentials add a third layer. A token or key issued to an account often keeps working ' +
        'until it expires or is explicitly revoked, and some sessions survive the account being ' +
        'disabled until they time out. So "disabled the account" is three different claims ' +
        'depending on what the system is, and a leaver process that does not distinguish them ' +
        'leaves doors open for months.',
    },
    options: [
      { id: 'a', label: 'Applications not federated to the identity provider hold their own accounts and are unaffected.' },
      { id: 'b', label: 'Tokens and SSH keys issued to that person may keep working until explicitly revoked.' },
      { id: 'c', label: 'Existing sessions can survive the account being disabled until they expire.' },
      { id: 'd', label: 'Local accounts created directly on individual servers are outside the directory entirely.' },
      { id: 'e', label: 'Disabling the directory account is sufficient, because everything authenticates through it.' },
    ],
    hints: [
      'Four are legitimate. One assumes a level of federation that almost no estate has.',
      'Ask what the legacy application does when somebody signs in.',
      'What happens to a token that was issued yesterday?',
    ],
    solution:
      'A, B, C, and D. Unfederated applications, long-lived credentials, live sessions and local ' +
      'accounts all survive. E is the assumption behind a great many findings: full federation is ' +
      'the goal and almost nowhere has reached it, so a leaver process built on that assumption ' +
      'quietly leaves access behind every time. The honest version of the report is a list of what ' +
      'was actually revoked and what was not checked.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option assumes every application authenticates through the central provider.',
      },
    ],
    debrief:
      'This is the mechanism behind the stale account in the incident packages. Nobody left it open ' +
      'deliberately; a process that only knew about one account store did exactly what it was ' +
      'designed to do.',
    practice: [],
  },
  {
    id: 'idm.1.3',
    moduleId: 'idm.1',
    packageId: 'identity-foundations',
    order: 3,
    title: 'Accounts that are not people',
    kind: 'multiple-choice',
    goal: 'Recognise service and machine accounts as the harder half of the estate.',
    prompt:
      'Which of the following are true of service accounts, meaning accounts used by software ' +
      'rather than by a person? Select all that apply.',
    teach: {
      concept:
        'Most estates have more non-human accounts than human ones, and they are systematically ' +
        'less well managed because every control was designed for people.\n\n' +
        'They rarely rotate credentials, because something breaks when they do and nobody is sure ' +
        'what. They frequently hold more privilege than they need, because the fastest way to make ' +
        'an integration work is to grant more. They usually cannot do MFA, since there is no human ' +
        'to approve anything. They often have no owner once the person who created them has moved ' +
        'on, so nobody can answer whether they are still needed. And they do not appear in a ' +
        'joiner-mover-leaver process at all, because nobody joins or leaves.\n\n' +
        'What makes them attractive to an attacker is exactly that combination: high privilege, ' +
        'static credentials, no second factor, and nobody watching. The countermeasure is not ' +
        'clever, it is ownership: every non-human account needs a named human owner, a stated ' +
        'purpose, and a review date, and that single piece of bookkeeping is most of the fix.',
    },
    options: [
      { id: 'a', label: 'They usually cannot use multi-factor authentication, because no human is present to approve.' },
      { id: 'b', label: 'Their credentials are rotated rarely, because rotation risks breaking an integration.' },
      { id: 'c', label: 'They frequently accumulate more privilege than they need.' },
      { id: 'd', label: 'They often outlive the person who created them, leaving no owner to say whether they are needed.' },
      { id: 'e', label: 'They are lower risk than user accounts, because no person is using them.' },
    ],
    hints: [
      'Four are true. One treats the absence of a human as a reduction in risk.',
      'List the controls you rely on for a person, and ask which apply here.',
      'Which kind of account would you rather compromise: a marketing assistant, or an integration with database rights?',
    ],
    solution:
      'A, B, C, and D. No second factor, static credentials, excess privilege and no owner. E is ' +
      'backwards: the absence of a person removes the controls rather than the risk, and a service ' +
      'account is usually a better target than a user because it is more privileged and less ' +
      'watched. If you inherit an estate with no non-human account inventory, that is the first ' +
      'thing to build.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats the absence of a human user as making the account safer.',
      },
    ],
    debrief:
      'The account created during the simulated intrusion was named to look like monitoring ' +
      'software for exactly this reason: a plausible service account is the least examined thing on ' +
      'a host.',
    practice: [],
  },
  {
    id: 'idm.1.4',
    moduleId: 'idm.1',
    packageId: 'identity-foundations',
    order: 4,
    title: 'Identity as the control plane',
    kind: 'multiple-choice',
    goal: 'See why the identity provider is the most consequential system in a modern estate.',
    prompt:
      'An organisation moves most applications behind a single cloud identity provider. Which of ' +
      'the following are accurate? Select all that apply.',
    teach: {
      concept:
        'Once applications federate to one provider, that provider decides who gets into ' +
        'everything. That is a large security gain and a concentration of risk, and both are true ' +
        'at once.\n\n' +
        'The gain is real: one place to enforce MFA, one place to disable a leaver, one set of ' +
        'logs, conditional policy applied consistently rather than per application. Estates without ' +
        'it cannot answer basic questions about who has access to what.\n\n' +
        'The concentration is equally real. Compromise of the provider, or of an administrator of ' +
        'it, is compromise of everything downstream, and it does not require touching any of the ' +
        'applications. That is why identity provider administrators are the most privileged people ' +
        'in a modern organisation, frequently more so than domain admins were, and why the ' +
        'protections around those accounts matter more than almost anything else.\n\n' +
        'The old boundary was the network. The new one is identity, and defenders who have not made ' +
        'that shift are still spending on firewalls while the actual perimeter is a login page.',
    },
    options: [
      { id: 'a', label: 'It lets MFA, conditional policy and leaver disablement be enforced in one place consistently.' },
      { id: 'b', label: 'It concentrates risk: compromise of the provider is compromise of everything federated to it.' },
      { id: 'c', label: 'Administrators of the identity provider become among the most privileged people in the organisation.' },
      { id: 'd', label: 'The practical security boundary shifts from the network towards identity.' },
      { id: 'e', label: 'Because access is centralised, per-application authorisation no longer needs to be managed.' },
    ],
    hints: [
      'Four are accurate. One confuses centralised authentication with centralised authorisation.',
      'The provider says who you are. Who says what you may do inside the application?',
      'Which accounts become the crown jewels after this change?',
    ],
    solution:
      'A, B, C, and D. Consistent enforcement, concentrated risk, extremely privileged ' +
      'administrators, and a boundary that has moved. E is the misunderstanding that leaves ' +
      'entitlements rotting: federation centralises AUTHENTICATION, and each application still ' +
      'decides what a user may do once inside. Roles and entitlements still need managing, ' +
      'reviewing and cleaning up, and centralising the login can make people believe otherwise.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option assumes centralised login also centralises what a user may do inside each ' +
          'application.',
      },
    ],
    debrief:
      'Remember this when somebody says identity is a back-office function. It is the control ' +
      'plane, and the people administering it can reach more than anybody else in the building.',
    practice: [],
  },
  {
    id: 'idm.1.5',
    moduleId: 'idm.1',
    packageId: 'identity-foundations',
    order: 5,
    title: 'What actually gets revoked',
    kind: 'short-answer',
    goal: 'Turn "we disabled the account" into a claim somebody can check.',
    prompt:
      'A manager asks you to confirm that a departed contractor no longer has access. In three or ' +
      'four sentences, say what you would check before answering.',
    teach: {
      concept:
        'The question sounds like a yes or no and is really a list. Answering it well is the ' +
        'clearest demonstration of understanding this module.\n\n' +
        'Check the DIRECTORY ACCOUNT, obviously, and then everything the directory does not cover. ' +
        'UNFEDERATED APPLICATIONS with their own account stores, which for a contractor often ' +
        'includes the specific tools they were brought in for. LOCAL ACCOUNTS on servers or ' +
        'appliances they worked on. CREDENTIALS that outlive the account: API tokens, SSH keys, ' +
        'certificates, and anything in a shared password store. And ACTIVE SESSIONS, which can ' +
        'continue after disablement until they expire, so a forced sign-out matters.\n\n' +
        'Then say what you did NOT check, because a contractor may have had access to systems ' +
        'nobody told identity about. The honest answer is a list of what was revoked and what was ' +
        'out of scope, and that is far more useful than a yes.\n\n' +
        'A good answer covers accounts beyond the directory, credentials that survive disablement ' +
        'such as tokens or keys, and states the limits of the check.',
    },
    hints: [
      'The question sounds binary and is really a list. What is on it?',
      'Disabling an account and revoking a credential are different actions.',
      'A good answer looks beyond the directory account to unfederated or local accounts, names credentials such as tokens or keys that survive disablement, and says what was not checked.',
    ],
    solution:
      'I would confirm the directory account is disabled and then look at everything the directory ' +
      'does not reach: applications that are not federated and hold their own accounts, any local ' +
      'accounts on servers or appliances they worked on, and shared accounts they may have had the ' +
      'password for. Separately from accounts, I would revoke credentials that outlive them, ' +
      'meaning API tokens, SSH keys and certificates issued to that person, and force existing ' +
      'sessions to end rather than waiting for them to expire. I would then say plainly what I ' +
      'checked and what I could not: a contractor may have been given access to systems that never ' +
      'went through our process, so the answer is that these specific things are revoked rather ' +
      'than that no access exists anywhere.',
    expectedOutput:
      'An answer covering accounts beyond the directory, credentials such as tokens or keys that ' +
      'survive disablement, and an explicit statement of what was not checked.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['not federated', 'unfederated', 'local account', 'own account', 'shared account', 'other systems'],
          ['token', 'key', 'certificate', 'session', 'revoke', 'sign-out', 'sign out'],
          ['could not', 'did not check', 'out of scope', 'never went through', 'limits', 'rather than that no access'],
        ],
        hint:
          'Three ideas: the accounts the directory does not cover, the credentials that outlive an ' +
          'account, and the honest limit of your answer.',
      },
    ],
    debrief:
      'The last sentence is what makes you trusted. Everybody can say yes; the person who says ' +
      'exactly what they verified is the one whose answers get relied on.',
    practice: [],
  },
];

// --- Module idm.2: proving who you are ----------------------------------------

const MODULE_IDM_2: Exercise[] = [
  {
    id: 'idm.2.1',
    moduleId: 'idm.2',
    packageId: 'identity-foundations',
    order: 1,
    title: 'Factors, and what makes two of them count',
    kind: 'multiple-choice',
    goal: 'Judge whether an authentication scheme is genuinely multi-factor.',
    prompt:
      'Which of the following are genuinely two-factor? Select all that apply.',
    teach: FACTOR_TEACH,
    options: [
      { id: 'a', label: 'A password plus a code from a hardware token.' },
      { id: 'b', label: 'A password plus a fingerprint.' },
      { id: 'c', label: 'A certificate on the device plus a PIN that unlocks it.' },
      { id: 'd', label: 'A password plus a one-time code sent by SMS: two factors, though a weak second one.' },
      { id: 'e', label: 'A password plus three security questions.' },
    ],
    hints: [
      'Four qualify. One is the same category twice.',
      'Something you know, something you have, something you are. Which category is a security question in?',
      'Weak and not-a-factor are different criticisms.',
    ],
    solution:
      'A, B, C, and D. Each combines two different categories, and D is worth including precisely ' +
      'because SMS is genuinely a second factor and genuinely a weak one: it is vulnerable to SIM ' +
      'swapping and to real-time relay, and it is still far better than a password alone. E is not ' +
      'two-factor at all: security questions are things you know, so this is one factor repeated, ' +
      'and the answers are frequently discoverable from public sources or a social media profile.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option pairs a password with more things the user knows.',
      },
    ],
    debrief:
      'Do not let "weak factor" and "not a factor" collapse into each other. SMS MFA is worth ' +
      'deploying while you work towards something better; security questions are not MFA at all.',
    practice: [],
  },
  {
    id: 'idm.2.2',
    moduleId: 'idm.2',
    packageId: 'identity-foundations',
    order: 2,
    title: 'Why some MFA still gets phished',
    kind: 'multiple-choice',
    goal: 'Understand real-time relay, and what defeats it.',
    prompt:
      'An organisation with MFA on everything still loses accounts to phishing. Which of the ' +
      'following explain how? Select all that apply.',
    teach: {
      concept:
        'MFA that a user can read out or approve is MFA an attacker can relay in real time, and ' +
        'this is now routine rather than advanced.\n\n' +
        'The mechanism is a proxy. The victim lands on a site that looks like the real one; ' +
        'whatever they type is forwarded to the genuine site immediately; the genuine site asks for ' +
        'the code; the fake site asks the victim; the victim supplies it; the attacker completes ' +
        'the login. The code was valid, used once, within its time window, and none of that helped ' +
        'because the victim was the one supplying it.\n\n' +
        'Push approvals fail similarly, with an extra failure mode: MFA FATIGUE, where an attacker ' +
        'holding a password sends approval prompts repeatedly until somebody taps accept to make ' +
        'them stop. Number matching helps and does not eliminate it.\n\n' +
        'What breaks the relay is binding the factor to the ORIGIN. A security key or passkey ' +
        'signs a challenge tied to the site actually being visited, and the browser will not ' +
        'release that signature to a lookalike domain, so the proxy has nothing to forward. That is ' +
        'a categorical difference rather than a stronger version of the same thing.',
    },
    options: [
      { id: 'a', label: 'An attacker proxy can forward a typed code to the real site inside its validity window.' },
      { id: 'b', label: 'Push approvals can be defeated by sending prompts until the user approves one to stop them.' },
      { id: 'c', label: 'The stolen session token can be reused, so the login only has to succeed once.' },
      { id: 'd', label: 'Factors bound to the origin, such as security keys and passkeys, cannot be relayed this way.' },
      { id: 'e', label: 'These attacks require the attacker to break the cryptography behind the one-time code.' },
    ],
    hints: [
      'Four explain it. One assumes cryptography has to be broken.',
      'The code is valid. Who typed it in, and into what?',
      'What does a security key check that a typed code cannot?',
    ],
    solution:
      'A, B, C, and D. Real-time relay, fatigue, session token reuse, and origin binding as the ' +
      'countermeasure. E misplaces the attack entirely: nothing is broken cryptographically, the ' +
      'code is genuine and the victim hands it over. That is why the fix is not a longer code or a ' +
      'shorter window, it is a factor that refuses to be given to the wrong site.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option assumes the attack requires breaking the one-time code cryptography.',
      },
    ],
    debrief:
      'When somebody says they have MFA, the useful follow-up is which kind. Phishing-resistant ' +
      'and relayable are different products wearing the same three letters.',
    practice: [],
  },
  {
    id: 'idm.2.3',
    moduleId: 'idm.2',
    packageId: 'identity-foundations',
    order: 3,
    title: 'Password policy that survives contact with people',
    kind: 'multiple-choice',
    goal: 'Recommend password rules that modern guidance actually supports.',
    prompt:
      'You are rewriting the password policy. Which of the following are supported by current ' +
      'mainstream guidance? Select all that apply.',
    teach: {
      concept:
        'Password guidance changed substantially and a lot of policy has not caught up, so this is ' +
        'a place where you can improve security and reduce user pain at the same time.\n\n' +
        'What current guidance supports: LENGTH over composition, because a long passphrase beats a ' +
        'short string with a symbol bolted on and is easier to remember. CHECKING AGAINST KNOWN ' +
        'BREACHED PASSWORDS, which blocks the attack that actually happens. NO ROUTINE EXPIRY, ' +
        'because forced ninety-day rotation produces predictable increments rather than better ' +
        'passwords, with expiry reserved for evidence of compromise. And SUPPORTING PASSWORD ' +
        'MANAGERS, including allowing paste, since blocking it pushes people towards passwords they ' +
        'can type from memory.\n\n' +
        'What it no longer supports is mandatory complexity rules, which mostly generate ' +
        'Password1! and its relatives, and routine expiry. Both feel rigorous and both make ' +
        'passwords worse, which is a useful reminder that a control which annoys users is not ' +
        'automatically effective.',
    },
    options: [
      { id: 'a', label: 'Favour length and passphrases over mandatory symbol and case composition rules.' },
      { id: 'b', label: 'Screen new passwords against lists of known breached passwords.' },
      { id: 'c', label: 'Drop routine expiry, and force a change when there is evidence of compromise.' },
      { id: 'd', label: 'Allow paste and support password managers rather than blocking them.' },
      { id: 'e', label: 'Require a change every ninety days and enforce four character classes.' },
    ],
    hints: [
      'Four are supported. One is the policy most organisations still have.',
      'What does a person actually do when forced to change a password every ninety days?',
      'Which of these blocks the attack that really happens, which is reuse of a breached password?',
    ],
    solution:
      'A, B, C, and D. Length, breach screening, no routine expiry, and password manager support. ' +
      'E is the familiar policy and it is counterproductive on both halves: complexity rules ' +
      'produce predictable substitutions, and routine expiry produces incrementing suffixes that ' +
      'an attacker with last quarter password can guess. Both trade real security for the ' +
      'appearance of rigour.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option is the traditional ninety-day complexity policy that current guidance moved ' +
          'away from.',
      },
    ],
    debrief:
      'This is a rare chance to be the person who removes a hated control and improves security ' +
      'doing it. Bring the guidance, because you will be asked to justify dropping expiry.',
    practice: [],
  },
  {
    id: 'idm.2.4',
    moduleId: 'idm.2',
    packageId: 'identity-foundations',
    order: 4,
    title: 'Conditional access, and its blind spots',
    kind: 'multiple-choice',
    goal: 'Use signals beyond the password without over-trusting them.',
    prompt:
      'Your identity provider can apply conditions to a sign-in. Which of the following are sound ' +
      'uses? Select all that apply.',
    teach: {
      concept:
        'Conditional access decides not just whether credentials are valid but whether this ' +
        'particular sign-in looks acceptable, using signals like device, location, and risk score. ' +
        'Used well it removes friction for ordinary logins and adds it exactly where it is needed.\n\n' +
        'Sound uses: requiring a managed, compliant DEVICE for access to sensitive applications, ' +
        'which is one of the strongest controls available because it is hard to steal. Requiring ' +
        'stronger authentication for privileged ROLES rather than for everybody equally. Stepping ' +
        'up when RISK SIGNALS fire, such as an impossible journey or an unfamiliar sign-in ' +
        'property. And blocking legacy authentication protocols that cannot carry MFA at all, ' +
        'which is often the single highest-value rule in the whole policy set.\n\n' +
        'The blind spot is treating location as identity. Geographic blocking stops opportunistic ' +
        'noise and stops nothing determined, because a proxy or a compromised machine inside the ' +
        'allowed country costs an attacker very little. Country blocking is a noise filter, not a ' +
        'control, and describing it as one leads to real gaps being left unaddressed.',
    },
    options: [
      { id: 'a', label: 'Requiring a managed, compliant device for sensitive applications.' },
      { id: 'b', label: 'Requiring stronger authentication for privileged roles rather than uniformly for everybody.' },
      { id: 'c', label: 'Stepping up authentication when risk signals such as an impossible journey fire.' },
      { id: 'd', label: 'Blocking legacy protocols that cannot carry multi-factor authentication.' },
      { id: 'e', label: 'Treating a sign-in from an allowed country as trusted enough to skip other controls.' },
    ],
    hints: [
      'Four are sound. One treats geography as identity.',
      'What does a proxy cost an attacker?',
      'Which of these rules would close the most attack paths in one change?',
    ],
    solution:
      'A, B, C, and D. Device compliance, role-based strength, risk-based step-up, and killing ' +
      'legacy authentication, which is frequently the highest-value single rule available. E is the ' +
      'blind spot: country conditions filter opportunistic noise and are trivially bypassed, so ' +
      'treating a permitted location as a reason to relax other controls converts a weak filter ' +
      'into a hole.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats an allowed sign-in country as a reason to relax other controls.',
      },
    ],
    debrief:
      'If you inherit an estate and can make one change, look for legacy authentication protocols ' +
      'still enabled. They bypass MFA entirely and turning them off closes more than most projects.',
    practice: [],
  },
  {
    id: 'idm.2.5',
    moduleId: 'idm.2',
    packageId: 'identity-foundations',
    order: 5,
    title: 'Make the case for phishing-resistant MFA',
    kind: 'short-answer',
    goal: 'Argue for hardware-bound authentication to somebody who thinks MFA is already done.',
    prompt:
      'Your organisation has app-based MFA everywhere and an executive asks why you want to spend ' +
      'money on security keys. In three or four sentences, make the case.',
    teach: {
      concept:
        'The executive is not being obtuse. They funded MFA, it was a real improvement, and asking ' +
        'what more money buys is the correct question.\n\n' +
        'The case rests on one specific and demonstrable gap. A code or a push approval can be ' +
        'relayed by an attacker in real time, and this is a routine commodity attack rather than a ' +
        'theoretical one. The user does nothing obviously wrong; they approve a login they believe ' +
        'they initiated.\n\n' +
        'A security key or passkey removes that class entirely, because the factor is bound to the ' +
        'site and cannot be handed to a lookalike. That is a different KIND of protection rather ' +
        'than a stronger version of the same one, and it is the strongest argument you have.\n\n' +
        'Then be practical about scope. Deploying to everybody at once is expensive and slow; ' +
        'deploying to administrators, finance and executives first covers the accounts that matter ' +
        'most for a fraction of the cost, and that phased proposal is far likelier to be funded ' +
        'than an all-or-nothing one.\n\n' +
        'A good answer names real-time relay or phishing of existing MFA, explains origin binding ' +
        'as categorically different, and proposes starting with high-value accounts.',
    },
    hints: [
      'Do not argue that the current MFA is bad. Name the specific attack it does not stop.',
      'Why can a security key not be handed to a fake site?',
      'A good answer names relay or phishing of the current MFA, explains that a key is bound to the real site and so cannot be relayed, and proposes starting with privileged and high-value accounts.',
    ],
    solution:
      'The MFA we have was a real improvement and it does not stop the attack we are most likely to ' +
      'see now: an attacker running a proxy site relays whatever the user types or approves to the ' +
      'genuine login in real time, so a valid code or a tapped approval completes the attacker ' +
      'sign-in rather than the user one. A security key or passkey removes that whole class, ' +
      'because the credential is cryptographically bound to the site actually being visited and the ' +
      'browser will not release it to a lookalike domain, which is a different kind of protection ' +
      'rather than a stronger code. I am not proposing we buy one for everybody at once: starting ' +
      'with administrators, finance and the executive team covers the accounts an attacker would ' +
      'most want for a small fraction of the cost. We can extend from there once the process is ' +
      'proven.',
    expectedOutput:
      'An answer naming real-time relay of existing MFA, explaining origin binding as categorically ' +
      'different, and proposing a phased start with high-value accounts.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['relay', 'proxy', 'real time', 'forwards', 'lookalike', 'phish'],
          ['bound', 'binding', 'tied to the site', 'origin', 'will not release', 'cannot be handed'],
          ['start with', 'administrators', 'privileged', 'phased', 'not everybody', 'high-value'],
        ],
        hint:
          'Three ideas: the attack the current MFA does not stop, why a key is different in kind, ' +
          'and a phased scope that is affordable.',
      },
    ],
    debrief:
      'The phasing sentence is what gets this funded. An all-or-nothing ask on a large workforce ' +
      'gets deferred; a proposal covering the fifty accounts that matter gets approved in the ' +
      'meeting.',
    practice: [],
  },
];

// --- Module idm.3: single sign-on and sessions --------------------------------

const MODULE_IDM_3: Exercise[] = [
  {
    id: 'idm.3.1',
    moduleId: 'idm.3',
    packageId: 'identity-foundations',
    order: 1,
    title: 'What happens during a single sign-on',
    kind: 'multiple-choice',
    goal: 'Follow the steps of a federated login, conceptually.',
    prompt:
      'A user opens an application and is signed in without typing a password. Which of the ' +
      'following describe what happened? Select all that apply.',
    teach: {
      concept:
        'Federated sign-on is a redirect and a signed message, and knowing the shape lets you ' +
        'reason about the whole category without learning any one protocol.\n\n' +
        'The application, called the relying party or service provider, does not check credentials ' +
        'itself. It redirects the browser to the identity provider. The provider either recognises ' +
        'an existing session or authenticates the user, then sends the browser back to the ' +
        'application carrying a signed assertion or token: this user, authenticated this way, at ' +
        'this time, with these attributes. The application validates the signature and creates its ' +
        'own local session.\n\n' +
        'Three consequences follow. The application never sees the password, which is most of the ' +
        'security benefit. The application trusts the provider completely, so anything that can ' +
        'produce a valid signed assertion can be anybody. And the application session is SEPARATE ' +
        'from the provider session, which is why signing out of one does not necessarily sign you ' +
        'out of the other, and why a stolen application session survives a password reset.',
    },
    options: [
      { id: 'a', label: 'The application redirected the browser to the identity provider rather than checking a password itself.' },
      { id: 'b', label: 'The provider returned a signed assertion or token asserting who the user is.' },
      { id: 'c', label: 'The application validated the signature and created its own local session.' },
      { id: 'd', label: 'The application never saw the password, which is a large part of the benefit.' },
      { id: 'e', label: 'The application checked the password against the identity provider directly on each request.' },
    ],
    hints: [
      'Four describe it. One has the application handling credentials, which is what federation avoids.',
      'What does the application actually receive back?',
      'How many sessions exist after this is finished?',
    ],
    solution:
      'A, B, C, and D. Redirect, signed assertion, local session, and no password at the ' +
      'application. E describes the thing federation was designed to eliminate: the application ' +
      'never handles the credential, which is why a compromised application cannot harvest ' +
      'passwords, and why federation reduces risk even before any other control is added.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option has the application handling the password, which is exactly what federation ' +
          'removes.',
      },
    ],
    debrief:
      'The two-session detail is the one that matters operationally. Disabling an account stops new ' +
      'sign-ons and does not always end sessions already established, which is why forced sign-out ' +
      'is a separate action in a leaver process.',
    practice: [],
  },
  {
    id: 'idm.3.2',
    moduleId: 'idm.3',
    packageId: 'identity-foundations',
    order: 2,
    title: 'Stolen sessions',
    kind: 'multiple-choice',
    goal: 'Understand why a token can be worth more than a password.',
    prompt:
      'Malware on a laptop steals the browser session cookies for several corporate applications. ' +
      'Which of the following are accurate? Select all that apply.',
    teach: {
      concept:
        'Session theft has become one of the most common ways accounts are taken over, and it ' +
        'sidesteps most of what organisations have invested in.\n\n' +
        'A session token represents an already-completed authentication. Presenting it does not ' +
        'require the password and does not require MFA, because both already happened. So an ' +
        'attacker holding a valid token is inside without touching any of the controls at the front ' +
        'door, and resetting the password does not necessarily evict them: the existing session ' +
        'often remains valid until it expires or is explicitly revoked.\n\n' +
        'What limits it is BINDING and LIFETIME. Tokens bound to a device or a client certificate ' +
        'are much harder to reuse elsewhere. Shorter lifetimes reduce the window. Re-evaluating ' +
        'conditions during a session, rather than only at sign-in, lets a provider notice that the ' +
        'session is now being used from somewhere implausible.\n\n' +
        'The operational lesson for a responder is blunt: after a credential compromise, revoke ' +
        'sessions and refresh tokens explicitly. A password reset alone is a half-measure that ' +
        'feels complete.',
    },
    options: [
      { id: 'a', label: 'Presenting a valid session token bypasses both the password and MFA, because both already happened.' },
      { id: 'b', label: 'Resetting the password does not necessarily end an existing session.' },
      { id: 'c', label: 'Binding tokens to a device makes them much harder to reuse elsewhere.' },
      { id: 'd', label: 'Response to credential compromise should revoke sessions and refresh tokens explicitly.' },
      { id: 'e', label: 'Because MFA is enabled, a stolen session cannot be used from an attacker machine.' },
    ],
    hints: [
      'Four are accurate. One assumes MFA is re-checked on every request.',
      'When was MFA actually evaluated?',
      'What has to happen, other than a password reset, to evict somebody?',
    ],
    solution:
      'A, B, C, and D. Tokens represent completed authentication, password resets do not end ' +
      'sessions, binding helps, and revocation has to be explicit. E is the belief that leaves ' +
      'attackers in place: MFA is evaluated at sign-in, and a token issued after a successful ' +
      'sign-in carries that result with it, so the second factor provides no protection at all ' +
      'against replay of the session it produced.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option assumes MFA is re-evaluated on every request rather than at sign-in.',
      },
    ],
    debrief:
      'Add "revoke sessions" to any account-compromise runbook you inherit. It is the step most ' +
      'often missing and it is the difference between evicting somebody and inconveniencing them.',
    practice: [],
  },
  {
    id: 'idm.3.3',
    moduleId: 'idm.3',
    packageId: 'identity-foundations',
    order: 3,
    title: 'The blast radius of the provider',
    kind: 'multiple-choice',
    goal: 'Reason about what a compromised identity provider reaches.',
    prompt:
      'An attacker gains administrative access to the corporate identity provider. Which of the ' +
      'following are accurate? Select all that apply.',
    teach: {
      concept:
        'This is the worst day in a federated estate, and it is worth reasoning through before it ' +
        'happens because the response is unlike other incidents.\n\n' +
        'An administrator of the provider can do more than read: they can create identities, alter ' +
        'group memberships that drive entitlements everywhere, weaken or exempt accounts from MFA, ' +
        'register additional credentials on existing accounts, and in many products add a ' +
        'federation trust so that assertions from somewhere else are accepted. That last one is ' +
        'particularly nasty because it can survive a password reset of every account.\n\n' +
        'Detection is hard because everything they do is a legitimate administrative action ' +
        'performed with valid credentials. What catches it is the provider own audit log, which is ' +
        'why exporting those logs somewhere the provider administrators cannot alter is a control ' +
        'worth arguing for.\n\n' +
        'Recovery is not a password reset. It is a review of every configuration change, every ' +
        'trust relationship, every credential registered on privileged accounts, and every ' +
        'entitlement granted during the window, because the attacker had the ability to make ' +
        'themselves legitimate.',
    },
    options: [
      { id: 'a', label: 'They can grant entitlements across every federated application by changing group membership.' },
      { id: 'b', label: 'They can register additional credentials on existing accounts, including privileged ones.' },
      { id: 'c', label: 'Adding a federation trust can create access that survives resetting every password.' },
      { id: 'd', label: 'Recovery requires reviewing configuration changes and trusts, not just resetting credentials.' },
      { id: 'e', label: 'Their actions stand out clearly, because administrative changes are inherently anomalous.' },
    ],
    hints: [
      'Four are accurate. One assumes legitimate-looking administrative activity is easy to spot.',
      'What does an administrator do all day, and how would you tell it apart from this?',
      'Which of these persists after you reset every password in the organisation?',
    ],
    solution:
      'A, B, C, and D. Entitlements, extra credentials, federation trusts, and a recovery that is ' +
      'about configuration rather than passwords. E is the difficulty rather than the reassurance: ' +
      'these are the same actions administrators perform legitimately every week, so nothing is ' +
      'anomalous in isolation and detection depends on tamper-resistant logging plus somebody ' +
      'reviewing changes to the most sensitive configuration.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option assumes administrative actions are inherently easy to distinguish from an ' +
          'attack.',
      },
    ],
    debrief:
      'Send identity provider audit logs somewhere the provider administrators cannot edit. It is ' +
      'a small piece of engineering and it is the only reason you would ever reconstruct this.',
    practice: [],
  },
  {
    id: 'idm.3.4',
    moduleId: 'idm.3',
    packageId: 'identity-foundations',
    order: 4,
    title: 'Federation with a third party',
    kind: 'multiple-choice',
    goal: 'Judge the risk of trusting somebody else identities.',
    prompt:
      'A partner organisation asks to federate, so their staff can access one of your applications ' +
      'with their own accounts. Which of the following are sound considerations? Select all that ' +
      'apply.',
    teach: {
      concept:
        'Federating with a partner means accepting their word about who somebody is, and inheriting ' +
        'their identity practices whether you have seen them or not.\n\n' +
        'What to establish before agreeing. Their AUTHENTICATION STANDARD: if they do not enforce ' +
        'MFA, neither do you for those users, whatever your own policy says. Their LEAVER PROCESS, ' +
        'because a departed partner employee keeps access until the partner disables them, and you ' +
        'will not know. What ATTRIBUTES you will trust from them, and specifically whether you ' +
        'accept group membership they assert, which would let them grant themselves entitlements ' +
        'in your systems.\n\n' +
        'And scope it: federation should reach exactly the application involved, not become a ' +
        'general trust. Adding your own authorisation layer on top, so that being authenticated by ' +
        'the partner still requires being entitled in your system, keeps a decision that is yours ' +
        'on your side of the boundary.\n\n' +
        'A contract clause about their security posture is worth having and is not a control. It ' +
        'allocates blame afterwards; it does not stop anything at the time.',
    },
    options: [
      { id: 'a', label: 'Their authentication standard becomes yours for those users, so MFA needs establishing up front.' },
      { id: 'b', label: 'Their leaver process becomes your leaver risk, because you will not know when somebody departs.' },
      { id: 'c', label: 'Decide which asserted attributes you trust, especially group membership that drives entitlements.' },
      { id: 'd', label: 'Keep your own authorisation layer, so authentication by the partner is not automatically permission.' },
      { id: 'e', label: 'A contractual security clause substitutes for these technical controls.' },
    ],
    hints: [
      'Four are sound. One mistakes a legal remedy for a preventive control.',
      'If the partner does not require MFA, what protects those sessions?',
      'What does a contract clause actually do on the day it goes wrong?',
    ],
    solution:
      'A, B, C, and D. Their standards, their leavers, the attributes you accept, and keeping ' +
      'authorisation on your side. E is worth having in the contract and is not a control: it ' +
      'determines who is liable after an incident and prevents nothing during one. Ask for both, ' +
      'and never let the clause be the reason the technical questions are skipped.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats a contract clause as a substitute for a technical control.',
      },
    ],
    debrief:
      'The leaver question is the one nobody asks and it produces the longest-lived access in most ' +
      'estates. Agree a notification process, and review the partner user list yourself on a ' +
      'schedule.',
    practice: [],
  },
  {
    id: 'idm.3.5',
    moduleId: 'idm.3',
    packageId: 'identity-foundations',
    order: 5,
    title: 'Explain why the reset was not enough',
    kind: 'short-answer',
    goal: 'Say what else has to happen after a phished account.',
    prompt:
      'An account was phished, the password has been reset, and the service desk considers it ' +
      'closed. In three or four sentences, explain what else is needed and why.',
    teach: {
      concept:
        'This is the most useful thing an identity person contributes to an incident, and it is ' +
        'usually contributed too late.\n\n' +
        'A password reset stops NEW sign-ons with the old password. It does not end sessions the ' +
        'attacker already holds, and those sessions carry the completed authentication with them, ' +
        'so the attacker is unaffected until the session expires or is explicitly revoked.\n\n' +
        'It also does nothing about anything the attacker ADDED while they had access. The common ' +
        'ones are an extra MFA method registered on the account, which gives them a durable way ' +
        'back in that survives every password change, and a mailbox forwarding rule or delegation ' +
        'that continues quietly exfiltrating mail. Both are trivial to set up and neither is ' +
        'touched by a reset.\n\n' +
        'So the closing checklist is: revoke sessions and refresh tokens, review and remove ' +
        'unrecognised MFA methods, check mail rules and delegations, and look at what the account ' +
        'accessed during the window.\n\n' +
        'A good answer names session or token revocation and at least one persistence mechanism ' +
        'the attacker could have added.',
    },
    hints: [
      'The reset blocks the old password. What does it not block?',
      'What could the attacker have added to the account while they were in it?',
      'A good answer names revoking sessions or tokens, and at least one thing the attacker may have registered such as an extra MFA method or a mail forwarding rule.',
    ],
    solution:
      'Resetting the password stops anybody signing in with the old one, and it does not end the ' +
      'sessions the attacker already has: a live session carries the completed authentication with ' +
      'it, so they keep working until it expires unless we revoke sessions and refresh tokens ' +
      'explicitly. It also does nothing about anything they added while they were in the account, ' +
      'and the two common ones are registering an extra MFA method, which gives them a durable way ' +
      'back that survives every future password change, and setting a mailbox forwarding rule or ' +
      'delegation that keeps sending mail out quietly. So before this is closed we need sessions ' +
      'revoked, the registered authentication methods reviewed for anything the user does not ' +
      'recognise, and mail rules and delegations checked. We should also look at what the account ' +
      'accessed during the window, because that decides whether this is a closed ticket or the ' +
      'start of an incident.',
    expectedOutput:
      'An answer naming session or token revocation and at least one attacker-added persistence ' +
      'mechanism such as an extra MFA method or a mail rule.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['session', 'token', 'revoke', 'sign out', 'still logged in'],
          ['mfa method', 'authentication method', 'registered', 'enrolled', 'forwarding', 'mail rule', 'delegation'],
          ['what the account accessed', 'window', 'what they did', 'data', 'reviewed', 'incident'],
        ],
        hint:
          'Three ideas: what the reset did not end, what the attacker may have added, and looking ' +
          'at what was accessed.',
      },
    ],
    debrief:
      'The extra MFA method is the one that keeps organisations compromised for months. It is ' +
      'invisible in a password-focused response and it defeats every subsequent reset.',
    practice: [],
  },
];

// --- Module idm.4: deciding what somebody may do ------------------------------

const MODULE_IDM_4: Exercise[] = [
  {
    id: 'idm.4.1',
    moduleId: 'idm.4',
    packageId: 'identity-foundations',
    order: 1,
    title: 'Roles, attributes, and what each is good at',
    kind: 'multiple-choice',
    goal: 'Choose a permission model that fits the organisation rather than the fashion.',
    prompt:
      'You are designing how permissions are granted. Which of the following are accurate? Select ' +
      'all that apply.',
    teach: {
      concept:
        'Two models dominate and the argument between them is usually less important than doing ' +
        'either one properly.\n\n' +
        'ROLE BASED access control grants permissions to roles and assigns people to roles. It is ' +
        'simple, reviewable, and easy to explain to an auditor, and its failure mode is ROLE ' +
        'EXPLOSION: every exception becomes a new role, and an organisation ends up with more roles ' +
        'than employees, at which point the model has stopped simplifying anything.\n\n' +
        'ATTRIBUTE BASED access control decides from attributes at request time: department, ' +
        'location, device, sensitivity of the record, time of day. It expresses fine-grained ' +
        'policy that roles cannot, and its failure mode is that nobody can answer "what can this ' +
        'person access" without evaluating the policy against every resource, which makes review ' +
        'genuinely hard.\n\n' +
        'Most real estates are hybrid: roles for the coarse grant, attributes for conditions and ' +
        'exceptions. The thing that decides whether either works is not the model, it is whether ' +
        'anybody removes access when it is no longer needed.',
    },
    options: [
      { id: 'a', label: 'Role based control is easy to review and explain, and tends towards role explosion.' },
      { id: 'b', label: 'Attribute based control expresses fine-grained policy that roles cannot.' },
      { id: 'c', label: 'Attribute based control makes "what can this person access" much harder to answer.' },
      { id: 'd', label: 'Most estates end up hybrid: roles for the coarse grant, attributes for conditions.' },
      { id: 'e', label: 'Choosing the more modern model removes the need to remove access that is no longer needed.' },
    ],
    hints: [
      'Four are accurate. One expects a model to solve a housekeeping problem.',
      'What is the failure mode of each, and which is easier to audit?',
      'Does any permission model automatically revoke access when somebody changes job?',
    ],
    solution:
      'A, B, C, and D. Each model has a characteristic strength and a characteristic failure, and ' +
      'hybrids are normal. E is the belief that sells products and fixes nothing: no model removes ' +
      'access on its own, accumulation is a process problem rather than a modelling one, and an ' +
      'estate that does not deprovision will drown in entitlements whichever model it picked.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option expects the choice of model to solve the problem of access that is never ' +
          'removed.',
      },
    ],
    debrief:
      'When somebody proposes a model migration to fix entitlement sprawl, ask what will remove ' +
      'access afterwards. If the answer is nothing, the new model will sprawl too.',
    practice: [],
  },
  {
    id: 'idm.4.2',
    moduleId: 'idm.4',
    packageId: 'identity-foundations',
    order: 2,
    title: 'Least privilege, honestly',
    kind: 'multiple-choice',
    goal: 'Apply least privilege in a way that survives contact with a working organisation.',
    prompt:
      'Which of the following are accurate about least privilege in practice? Select all that ' +
      'apply.',
    teach: {
      concept:
        'Least privilege means somebody has the access their job needs and no more. Everybody ' +
        'agrees with it and most organisations do not achieve it, and the reasons are worth ' +
        'understanding rather than moralising about.\n\n' +
        'The pressures all point one way. Granting is fast and revoking is slow, because granting ' +
        'unblocks somebody today and revoking risks breaking something tomorrow. Nobody is ' +
        'rewarded for removing access and everybody notices when work stops. And the person best ' +
        'placed to know whether access is still needed, the line manager, has no visibility of what ' +
        'their reports actually hold.\n\n' +
        'What works is making removal cheap and reversible rather than exhorting people to be ' +
        'strict. Time-bound grants that expire by default, so the effort is in KEEPING access ' +
        'rather than in removing it. Requesting access as a normal self-service action, so ' +
        'restoring wrongly-removed access takes minutes and nobody hoards. And attaching access to ' +
        'a job role so a move recalculates it rather than adding to it.\n\n' +
        'Least privilege enforced by nagging fails everywhere. Least privilege enforced by expiry ' +
        'works, because the default becomes correct.',
    },
    options: [
      { id: 'a', label: 'Granting is fast and revoking is slow, so access accumulates without anybody deciding it should.' },
      { id: 'b', label: 'Time-bound grants that expire by default put the effort into keeping access rather than removing it.' },
      { id: 'c', label: 'Easy self-service re-request reduces hoarding, because losing access is not a disaster.' },
      { id: 'd', label: 'Line managers usually cannot see what their reports actually hold.' },
      { id: 'e', label: 'The main obstacle is that people are careless, so the answer is stricter policy and reminders.' },
    ],
    hints: [
      'Four are accurate. One blames individuals for a structural incentive.',
      'What happens to the person who removes access that turned out to be needed?',
      'How do you make the correct outcome the default rather than the effortful one?',
    ],
    solution:
      'A, B, C, and D. Asymmetric effort, expiry as the mechanism, cheap re-request, and managers ' +
      'without visibility. E is the diagnosis that produces a decade of failed initiatives: people ' +
      'respond rationally to the incentives in front of them, and a policy that asks them to ' +
      'volunteer for risk and inconvenience will lose to the pressure to keep work moving every ' +
      'time. Change the default, not the exhortation.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats structural incentives as individual carelessness.',
      },
    ],
    debrief:
      'Expiry is the single most effective idea in this module. Access that lapses unless renewed ' +
      'turns a housekeeping problem nobody has time for into a default that is correct.',
    practice: [],
  },
  {
    id: 'idm.4.3',
    moduleId: 'idm.4',
    packageId: 'identity-foundations',
    order: 3,
    title: 'Separation of duties',
    kind: 'multiple-choice',
    goal: 'Recognise combinations of access that are dangerous together.',
    prompt:
      'Which of the following are genuine separation of duties concerns? Select all that apply.',
    teach: {
      concept:
        'Some pairs of permissions are individually reasonable and dangerous held together, because ' +
        'one person can then complete a harmful action end to end with nobody else involved.\n\n' +
        'The classic financial case is creating a supplier and approving payments to one: either ' +
        'alone is a normal job, and together it is fraud waiting for a bad month. The classic ' +
        'technical case is being able to change a system AND to alter or delete its logs, which ' +
        'removes the record of what was changed.\n\n' +
        'Two more matter in identity specifically. Granting yourself access, which is why the ' +
        'ability to modify your own entitlements is separated from using them. And approving your ' +
        'own requests, which is a control most workflow tools can enforce and many are configured ' +
        'not to.\n\n' +
        'Separation costs money, because it needs two people where one would do, so it is applied ' +
        'where the consequence justifies it rather than everywhere. The judgement is which ' +
        'combinations are worth the friction, and that is a conversation with the business rather ' +
        'than a rule you can import.',
    },
    options: [
      { id: 'a', label: 'One person able to create a supplier and approve payments to it.' },
      { id: 'b', label: 'One person able to change a system and to alter or delete its logs.' },
      { id: 'c', label: 'One person able to grant themselves entitlements and then use them.' },
      { id: 'd', label: 'One person able to raise and approve their own access request.' },
      { id: 'e', label: 'One person holding read access to two different departments reporting systems.' },
    ],
    hints: [
      'Four are genuine. One is broad access rather than a dangerous combination.',
      'Ask what harmful action each pair lets one person complete alone.',
      'Is being able to read two things a separation of duties problem, or a different one?',
    ],
    solution:
      'A, B, C, and D. Each lets one person complete a harmful sequence unobserved. E is a ' +
      'different concern: reading two departments data may well be excessive access and it is a ' +
      'least privilege question, not a separation of duties one, because no harmful action is ' +
      'completed by the combination. Keeping the two ideas apart matters, because the remedies ' +
      'differ: separation needs a second person, excess access needs removal.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option describes broad read access rather than a combination that completes a ' +
          'harmful action.',
      },
    ],
    debrief:
      'The logs one is the finding you will make most often as a security person, because ' +
      'administrators are routinely given full control of the systems that record what they did.',
    practice: [],
  },
  {
    id: 'idm.4.4',
    moduleId: 'idm.4',
    packageId: 'identity-foundations',
    order: 4,
    title: 'Groups that nobody understands',
    kind: 'multiple-choice',
    goal: 'Diagnose the entitlement sprawl every mature estate accumulates.',
    prompt:
      'You inherit a directory with thousands of groups, many nested, and no documentation. Which ' +
      'of the following are sound first steps? Select all that apply.',
    teach: {
      concept:
        'Every organisation over about ten years old has this, and it is a data problem before it ' +
        'is a security one.\n\n' +
        'Start by finding out what is actually USED. Groups that grant nothing, because the ' +
        'resource they protected is gone, can be removed with almost no risk once you can ' +
        'demonstrate they grant nothing. Groups with no members are similar. Together these are ' +
        'often a large fraction of the total and clearing them makes everything else legible.\n\n' +
        'Then resolve NESTING, because a group inside a group inside a group means the effective ' +
        'membership of the outer one is not what anybody thinks. Computing effective access per ' +
        'person, rather than reading the group tree, is the only way to see what is really granted.\n\n' +
        'Then find OWNERS for what remains, because a group nobody owns cannot be reviewed and will ' +
        'be rubber-stamped forever.\n\n' +
        'What does not work is deleting groups that look unused without checking what they grant. ' +
        'Directory groups are used for things other than access, including mail distribution and ' +
        'software deployment, and the outage you cause will be attributed to security for years.',
    },
    options: [
      { id: 'a', label: 'Identify groups that grant no access at all, which can be removed with little risk once demonstrated.' },
      { id: 'b', label: 'Resolve nesting and compute effective access per person rather than reading the group tree.' },
      { id: 'c', label: 'Find an owner for every group that remains, since an unowned group cannot be reviewed.' },
      { id: 'd', label: 'Check what a group is used for before deleting it, since groups drive more than access.' },
      { id: 'e', label: 'Delete every group with fewer than three members, as a quick reduction in complexity.' },
    ],
    hints: [
      'Four are sound. One deletes by a metric that has nothing to do with what a group does.',
      'What else, besides access, might a directory group control?',
      'Why is nesting the thing that makes the tree unreadable?',
    ],
    solution:
      'A, B, C, and D. Find what grants nothing, compute effective access, assign owners, and check ' +
      'purpose before deleting. E is how a cleanup project becomes an incident: a two-member group ' +
      'might be the one controlling access to the payroll system, or the distribution list the ' +
      'board uses, and member count tells you nothing about consequence.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option deletes groups based on member count rather than on what they actually grant.',
      },
    ],
    debrief:
      'Effective access per person is the artefact worth building. It answers the question ' +
      'everybody asks, it makes reviews possible, and almost nobody has it.',
    practice: [],
  },
  {
    id: 'idm.4.5',
    moduleId: 'idm.4',
    packageId: 'identity-foundations',
    order: 5,
    title: 'Refuse a request without blocking the work',
    kind: 'short-answer',
    goal: 'Handle an over-broad access request the way it actually gets handled well.',
    prompt:
      'A developer requests full administrative access to the production database, saying they ' +
      'need it to debug an urgent issue. In three or four sentences, say how you respond.',
    teach: {
      concept:
        'This request arrives constantly and both obvious answers are wrong. Granting it creates ' +
        'standing production access for a temporary problem; refusing it leaves an urgent issue ' +
        'unresolved and teaches the requester to route around you next time.\n\n' +
        'The productive move is to separate the NEED from the ASK. They asked for administrative ' +
        'access; what they need is to see why something is failing, which is usually read access to ' +
        'specific tables or the logs. Asking what they are trying to find out, rather than ' +
        'debating the permission, gets to a narrower grant that solves the problem.\n\n' +
        'Then make it TIME-BOUND and VISIBLE. Access that expires in hours, granted through a path ' +
        'that records who approved it and what was done, addresses the urgency without creating a ' +
        'permanent entitlement nobody revisits.\n\n' +
        'And do it FAST, because the speed of the alternative is what determines whether people use ' +
        'it. A narrow grant in ten minutes beats a broad one in two days, and it is what stops the ' +
        'shared admin password existing.\n\n' +
        'A good answer asks what they are actually trying to do, offers a narrower and time-limited ' +
        'grant, and does not simply refuse.',
    },
    hints: [
      'Neither yes nor no is the right answer. What is the third option?',
      'They asked for a permission. What are they actually trying to find out?',
      'A good answer asks what they need to diagnose, offers narrower access that is time-limited and logged, and treats speed as part of the solution.',
    ],
    solution:
      'I would ask what they are trying to find out rather than debating the permission, because ' +
      'administrative access is the ask and seeing why something fails is the need, and those are ' +
      'usually solved by read access to specific tables or to the logs. Whatever we land on I would ' +
      'grant time-bound rather than standing, expiring in hours, through a route that records who ' +
      'approved it and what was run, so the urgency is met without creating a permanent entitlement ' +
      'nobody revisits. I would also do it quickly, because if the sanctioned path is slower than ' +
      'asking a colleague for the shared admin password then the shared admin password is what ' +
      'gets used. If it does turn out they need broad access, that is a decision worth making ' +
      'explicitly with the data owner rather than one I quietly refuse.',
    expectedOutput:
      'An answer that asks what they are trying to diagnose, offers narrower time-limited and ' +
      'logged access, and treats responsiveness as part of the control.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['what they are trying', 'what they need', 'ask what', 'diagnose', 'find out', 'narrower', 'read'],
          ['time-bound', 'time limited', 'expire', 'temporary', 'hours', 'standing'],
          ['quickly', 'fast', 'slower', 'shared password', 'route around', 'logged', 'recorded'],
        ],
        hint:
          'Three ideas: getting to the underlying need, making the grant temporary, and why speed ' +
          'is part of the control rather than a courtesy.',
      },
    ],
    debrief:
      'The last point is the one experienced identity people insist on. Every slow approval process ' +
      'creates a shadow one, and the shadow process has no logging at all.',
    practice: [],
  },
];

// --- Module idm.5: joiners, movers and leavers --------------------------------

const MODULE_IDM_5: Exercise[] = [
  {
    id: 'idm.5.1',
    moduleId: 'idm.5',
    packageId: 'identity-foundations',
    order: 1,
    title: 'The mover is the one everybody gets wrong',
    kind: 'multiple-choice',
    goal: 'See why internal moves produce more excess access than joiners or leavers.',
    prompt:
      'An organisation has a solid joiner process and a solid leaver process. Which of the ' +
      'following are accurate about internal moves? Select all that apply.',
    teach: {
      concept:
        'Joiners and leavers get attention because they are visible: somebody arrives and needs ' +
        'things, somebody departs and HR raises a ticket. Movers are neither, and they are where ' +
        'the excess access comes from.\n\n' +
        'When somebody changes role, the new access gets requested because they cannot do the job ' +
        'without it. The old access does not get removed, because nobody is blocked by it ' +
        'remaining and nobody owns noticing. Do that three or four times over a decade and you have ' +
        'somebody with the accumulated permissions of every job they have held, which is the ' +
        'classic insider risk profile and is nobody fault in particular.\n\n' +
        'The fix is structural rather than procedural. Access attached to a job ROLE can be ' +
        'RECALCULATED on a move, so the change is a replacement rather than an addition. Where ' +
        'access is granted ad hoc it has to be reviewed on move, which means the move has to ' +
        'trigger something, which means HR data has to reach the identity system.\n\n' +
        'And there is a legitimate transition period: people hand over, and removing everything on ' +
        'the day is disruptive. Time-bound retention of the old access, expiring in weeks rather ' +
        'than never, handles that honestly.',
    },
    options: [
      { id: 'a', label: 'New access is requested because work is blocked; old access is not removed because nothing is blocked.' },
      { id: 'b', label: 'Repeated moves accumulate the permissions of every job the person has held.' },
      { id: 'c', label: 'Role-based access can be recalculated on a move, making it a replacement rather than an addition.' },
      { id: 'd', label: 'A legitimate handover period is best handled by time-bound retention rather than indefinite retention.' },
      { id: 'e', label: 'Movers are lower risk than leavers, because the person is still trusted and employed.' },
    ],
    hints: [
      'Four are accurate. One confuses trusting a person with them needing the access.',
      'What triggers a leaver process, and what triggers a mover one?',
      'Whose account would you rather compromise: a leaver who is disabled, or a ten-year employee with four jobs worth of access?',
    ],
    solution:
      'A, B, C, and D. Asymmetric triggers, accumulation over a career, recalculation as the ' +
      'structural fix, and time-bound handover. E confuses trust with need: the person may be ' +
      'entirely trustworthy and their ACCOUNT is a richer target than any leaver, because a leaver ' +
      'is disabled and this one is active, well-connected, and holds permissions across four ' +
      'departments. Least privilege is not a statement about somebody character.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats a trusted employee as low risk regardless of accumulated access.',
      },
    ],
    debrief:
      'If you audit one thing in a new job, pull the people who have changed role three or more ' +
      'times and look at what they hold. It is the highest-yield review in identity.',
    practice: [],
  },
  {
    id: 'idm.5.2',
    moduleId: 'idm.5',
    packageId: 'identity-foundations',
    order: 2,
    title: 'Where the joiner process gets its truth',
    kind: 'multiple-choice',
    goal: 'Understand why identity depends on HR data and what happens when it is wrong.',
    prompt:
      'Your provisioning is driven from the HR system. Which of the following are accurate? Select ' +
      'all that apply.',
    teach: {
      concept:
        'Automated provisioning needs an authoritative source for who exists and what they do, and ' +
        'in most organisations that is HR. This is a strength and a dependency at once.\n\n' +
        'It works well for permanent employees, because HR has a record before day one, knows the ' +
        'department and manager, and knows the leaving date usually in advance. Driving identity ' +
        'from it means joiners are ready on day one and leavers are disabled automatically.\n\n' +
        'It works badly for everybody else, and that is the finding you will make. CONTRACTORS are ' +
        'frequently not in HR at all, because they are procured rather than employed, so the ' +
        'automation that handles employees perfectly leaves an entire population managed by hand ' +
        'and forgotten on exit. Same for temporary staff, interns handled locally, and third-party ' +
        'support staff.\n\n' +
        'The data quality also matters more than people expect: if a manager field is wrong, ' +
        'approvals route to the wrong person and get rubber-stamped, and if the leaving date is not ' +
        'updated when somebody resigns early, access continues past their last day.',
    },
    options: [
      { id: 'a', label: 'It handles permanent employees well, because HR knows about them before day one.' },
      { id: 'b', label: 'Contractors are often absent from HR entirely, leaving a population managed by hand.' },
      { id: 'c', label: 'A wrong manager field routes approvals to somebody with no basis to judge them.' },
      { id: 'd', label: 'An unchanged leaving date means access continues past somebody actual last day.' },
      { id: 'e', label: 'Because provisioning is automated, the accuracy of the HR record no longer matters.' },
    ],
    hints: [
      'Four are accurate. One assumes automation removes a dependency on data quality.',
      'Which population is procured rather than employed, and who tells identity when they leave?',
      'If the input is wrong, what does the automation do faithfully?',
    ],
    solution:
      'A, B, C, and D. Good for employees, bad for contractors, and dependent on field accuracy for ' +
      'both routing and timing. E inverts the relationship: automation makes data quality matter ' +
      'MORE, because errors are now applied consistently and at speed rather than being caught by ' +
      'somebody who knew the person. Automating a bad record produces wrong access reliably.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option assumes automating provisioning removes the dependency on accurate HR data.',
      },
    ],
    debrief:
      'The contractor gap is the finding to look for first. It is where the stale privileged ' +
      'accounts live in most organisations, including the one in this platform simulated intrusion.',
    practice: [],
  },
  {
    id: 'idm.5.3',
    moduleId: 'idm.5',
    packageId: 'identity-foundations',
    order: 3,
    title: 'Leaving in a hurry',
    kind: 'multiple-choice',
    goal: 'Handle a hostile or urgent departure differently from a routine one.',
    prompt:
      'Somebody is being dismissed this afternoon and the business asks you to prepare. Which of ' +
      'the following are appropriate? Select all that apply.',
    teach: {
      concept:
        'Most leavers are routine and can follow the normal process on the normal timetable. A ' +
        'small number are not, and the difference has to be planned before the day.\n\n' +
        'What changes for an urgent departure: TIMING is coordinated with the conversation rather ' +
        'than run overnight, so access ends as it happens rather than hours before, which would tip ' +
        'them off, or hours after, which is the risk. SESSIONS are revoked as well as accounts ' +
        'disabled, because an active session survives disablement. Anything only they know, such as ' +
        'shared credentials or keys they held, is ROTATED, since disabling their account does ' +
        'nothing about a password they can remember. And DATA ACCESS in the preceding period is ' +
        'reviewed, because the highest-risk window is often before the meeting rather than after.\n\n' +
        'What is not appropriate is doing any of this on your own initiative. Employment matters ' +
        'are legally sensitive, and identity acts on instruction from HR with an agreed timetable. ' +
        'Disabling somebody account because a manager mentioned something in a corridor is a way to ' +
        'end up in an employment tribunal transcript.',
    },
    options: [
      { id: 'a', label: 'Coordinate the timing with the conversation itself, rather than early or late.' },
      { id: 'b', label: 'Revoke active sessions as well as disabling accounts.' },
      { id: 'c', label: 'Rotate shared credentials and keys the person knew, since those survive disablement.' },
      { id: 'd', label: 'Review what they accessed in the preceding period, since that window carries real risk.' },
      { id: 'e', label: 'Act immediately on any manager who mentions a dismissal, without waiting for HR.' },
    ],
    hints: [
      'Four are appropriate. One acts on an employment matter without authority.',
      'What does disabling an account fail to do about a password somebody has memorised?',
      'Who is allowed to tell you that somebody is being dismissed?',
    ],
    solution:
      'A, B, C, and D. Coordinated timing, session revocation, rotation of anything shared, and ' +
      'review of the preceding window. E is the one to refuse: acting on an unconfirmed report ' +
      'about a dismissal can cut off somebody who has not been dismissed, is an employment matter ' +
      'rather than a security one, and belongs to HR. Have the process agreed with HR in advance so ' +
      'that when it is genuinely needed it is fast and authorised.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option acts on an employment matter without HR authorisation.',
      },
    ],
    debrief:
      'Agree the urgent-leaver runbook with HR before you need it, including who can authorise it ' +
      'out of hours. Improvising this on the afternoon is how the wrong person gets locked out.',
    practice: [],
  },
  {
    id: 'idm.5.4',
    moduleId: 'idm.5',
    packageId: 'identity-foundations',
    order: 4,
    title: 'Orphaned and dormant accounts',
    kind: 'multiple-choice',
    goal: 'Find the accounts that belong to nobody, and decide what to do with them.',
    prompt:
      'A review finds accounts with no recent sign-in and accounts whose owner cannot be ' +
      'identified. Which of the following are sound? Select all that apply.',
    teach: {
      concept:
        'Every estate has these and they are the cheapest genuine risk reduction available, ' +
        'because closing them costs nothing and removes real attack surface.\n\n' +
        'DORMANT accounts, with no recent authentication, are candidates for disablement. Disable ' +
        'rather than delete first: disablement is instantly reversible, and deletion can break ' +
        'file ownership, break references, and destroy evidence. Give it a notice period and a way ' +
        'to object, because a genuine six-month sabbatical exists.\n\n' +
        'ORPHANED accounts, where no owner can be found, are more serious, because an account ' +
        'nobody owns is an account nobody reviews, and it is frequently a service account holding ' +
        'more privilege than any person. The remedy is to find an owner or close it, and the ' +
        'forcing move is a deadline: an account with no claimed owner by a stated date is disabled.\n\n' +
        'What does not work is bulk deletion on a dormancy metric alone. Break-glass accounts are ' +
        'dormant by design, disaster recovery accounts are dormant until they are desperately ' +
        'needed, and both look exactly like abandoned accounts in a report.',
    },
    options: [
      { id: 'a', label: 'Disable dormant accounts rather than deleting them, since disablement is reversible.' },
      { id: 'b', label: 'Give a notice period and a route to object, because legitimate long absences exist.' },
      { id: 'c', label: 'Treat unowned accounts as more serious than dormant ones, since nobody reviews them.' },
      { id: 'd', label: 'Use a deadline to force ownership: unclaimed by a stated date means disabled.' },
      { id: 'e', label: 'Delete everything with no sign-in for ninety days, as a single scheduled cleanup.' },
    ],
    hints: [
      'Four are sound. One deletes in bulk on a metric that misidentifies two important categories.',
      'Which accounts are supposed to be dormant?',
      'Why disable before deleting?',
    ],
    solution:
      'A, B, C, and D. Reversible disablement, a notice period, unowned as the worse category, and ' +
      'a deadline to force ownership. E will delete the break-glass accounts and the disaster ' +
      'recovery accounts, which are dormant precisely because they are working as designed, and ' +
      'you will find out during the incident where they were needed.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option bulk-deletes on dormancy, which is exactly the profile of a break-glass ' +
          'account.',
      },
    ],
    debrief:
      'Dormant account cleanup is the easiest win a new identity person can deliver, and the ' +
      'fastest way to cause an outage if done without a notice period. Do both halves.',
    practice: [],
  },
  {
    id: 'idm.5.5',
    moduleId: 'idm.5',
    packageId: 'identity-foundations',
    order: 5,
    title: 'Design the mover process',
    kind: 'short-answer',
    goal: 'Propose a process that removes old access without blocking a handover.',
    prompt:
      'Your organisation adds access on a move and never removes it. In three or four sentences, ' +
      'propose how the mover process should work.',
    teach: {
      concept:
        'The proposal has to solve the structural problem rather than adding a step somebody will ' +
        'skip.\n\n' +
        'The core idea is that a move should RECALCULATE entitlements rather than add to them: ' +
        'access derived from the job role is replaced when the role changes, which handles the bulk ' +
        'of it with no human decision at all. That requires the move to trigger something, which ' +
        'means HR change data has to reach the identity system, so name that dependency.\n\n' +
        'For access that is not role-derived, the move should generate a REVIEW addressed to the ' +
        'new manager, listing what the person currently holds with a default of removal if nobody ' +
        'acts. Default-remove is doing the work there: default-keep produces the situation you ' +
        'already have.\n\n' +
        'And handle the HANDOVER honestly, because it is the real reason old access lingers. Old ' +
        'access retained for a defined period, expiring automatically, gives people the transition ' +
        'they genuinely need without the retention being permanent.\n\n' +
        'A good answer recalculates rather than adds, defaults to removal, and provides a bounded ' +
        'handover window.',
    },
    hints: [
      'The problem is that adding is triggered and removing is not. What has to trigger removal?',
      'What should happen if the new manager does nothing at all?',
      'A good answer recalculates role-based access on the move, sends the rest for review with removal as the default, and allows a time-bounded handover period.',
    ],
    solution:
      'A move should recalculate entitlements rather than add to them: anything derived from the ' +
      'job role is replaced automatically when the role changes, which handles most of it with no ' +
      'human decision, and that depends on HR role changes reaching the identity system promptly. ' +
      'Whatever is left, the access granted ad hoc, should generate a review addressed to the new ' +
      'manager listing what the person currently holds, with removal as the DEFAULT if nobody ' +
      'responds, because default-keep is exactly what produced the current situation. For the ' +
      'genuine handover need, old access can be retained for a defined period of a few weeks and ' +
      'then expire automatically, so the transition is supported without the retention becoming ' +
      'permanent. That way the effort falls on keeping access rather than on removing it.',
    expectedOutput:
      'A proposal that recalculates role-derived access on the move, defaults to removal for the ' +
      'rest, and gives a time-bounded handover window.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['recalculat', 'replace', 'derived from the role', 'rather than add', 'role change'],
          ['default', 'removal', 'if nobody', 'expire', 'lapse', 'unless'],
          ['handover', 'transition', 'period', 'few weeks', 'bounded', 'temporar'],
        ],
        hint:
          'Three ideas: replacing rather than adding, what happens when nobody acts, and the ' +
          'legitimate handover need.',
      },
    ],
    debrief:
      'The word default is the whole design. Every identity process that relies on somebody ' +
      'choosing to remove access fails; every one where access lapses unless somebody chooses to ' +
      'keep it works.',
    practice: [],
  },
];

// --- Module idm.6: privileged access ------------------------------------------

const MODULE_IDM_6: Exercise[] = [
  {
    id: 'idm.6.1',
    moduleId: 'idm.6',
    packageId: 'identity-foundations',
    order: 1,
    title: 'Standing privilege is the problem',
    kind: 'multiple-choice',
    goal: 'See why permanent administrative rights are the thing to reduce.',
    prompt:
      'Which of the following are accurate about standing administrative access? Select all that ' +
      'apply.',
    teach: {
      concept:
        'Standing privilege means somebody holds administrative rights all the time, whether or not ' +
        'they are using them. It is the normal arrangement and it is the thing worth changing.\n\n' +
        'The problem is that an account is exposed for every hour it holds privilege, not for the ' +
        'hours it is being used. An administrator who needs those rights for two hours a month has ' +
        'an account worth compromising for the whole month, and the attacker chooses the timing.\n\n' +
        'JUST IN TIME access inverts that: the rights are granted on request, for a bounded period, ' +
        'with a reason recorded, and removed automatically. The same work happens and the window ' +
        'shrinks from permanent to hours. Combined with approval for the most sensitive roles, it ' +
        'turns silent standing power into a visible, reviewable event.\n\n' +
        'A separate and equally important idea is SEPARATE ADMIN ACCOUNTS: the same person browses ' +
        'the web and reads email as themselves, and administers as a different account that cannot ' +
        'do either. Most administrative compromise begins with ordinary user activity, and this ' +
        'separation means a phished session does not carry administrative rights.',
    },
    options: [
      { id: 'a', label: 'An account is exposed for every hour it holds privilege, not only when it is being used.' },
      { id: 'b', label: 'Just-in-time access shrinks the window from permanent to the duration of a task.' },
      { id: 'c', label: 'Requesting privilege with a reason turns silent standing power into a reviewable event.' },
      { id: 'd', label: 'Separate admin accounts stop ordinary phishing from landing on a privileged session.' },
      { id: 'e', label: 'Standing privilege is acceptable when the administrator is trustworthy and experienced.' },
    ],
    hints: [
      'Four are accurate. One treats a technical exposure as a question about a person.',
      'Who chooses when an attack happens: the administrator, or the attacker?',
      'What is being compromised in an account takeover, the person or the account?',
    ],
    solution:
      'A, B, C, and D. Exposure is continuous, just-in-time shrinks it, request-with-reason makes ' +
      'it visible, and account separation breaks the usual path in. E confuses the person with the ' +
      'account: an experienced administrator is no less phishable, and the attacker picks the ' +
      'moment, so trustworthiness does not reduce the window at all. Reducing standing privilege ' +
      'is not a statement about anybody.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats standing privilege as acceptable based on the trustworthiness of the ' +
          'person holding it.',
      },
    ],
    debrief:
      'Frame this carefully when you propose it. Administrators hear "we do not trust you", and the ' +
      'honest answer is that the control is about the account being stolen rather than about them.',
    practice: [],
  },
  {
    id: 'idm.6.2',
    moduleId: 'idm.6',
    packageId: 'identity-foundations',
    order: 2,
    title: 'Break-glass access',
    kind: 'multiple-choice',
    goal: 'Design emergency access that works when everything else does not.',
    prompt:
      'You are designing break-glass accounts for use when normal authentication is unavailable. ' +
      'Which of the following are sound? Select all that apply.',
    teach: {
      concept:
        'Break-glass accounts exist for the day the identity provider is down, the MFA service is ' +
        'broken, or an administrator locked everybody out including themselves. They are a ' +
        'deliberate exception and they need designing rather than accumulating.\n\n' +
        'What makes them work. They must NOT DEPEND on the systems likely to fail, which usually ' +
        'means excluding them from conditional access policies and from the MFA service, because ' +
        'an emergency account that requires the broken system is not an emergency account. Their ' +
        'credentials are stored PHYSICALLY, split, in a safe, with a documented process for ' +
        'retrieval. Their use is ALARMED loudly: any authentication by one of these accounts should ' +
        'page somebody immediately, because either it is a genuine emergency or it is the worst ' +
        'thing that could be happening. And they are TESTED periodically, because an untested ' +
        'emergency credential is a hypothesis.\n\n' +
        'What breaks them is treating them like normal accounts. Applying the standard MFA policy ' +
        'to a break-glass account defeats its purpose; leaving it out of monitoring turns it into ' +
        'an unwatched permanent backdoor.',
    },
    options: [
      { id: 'a', label: 'They must not depend on the systems most likely to be unavailable, such as the MFA service.' },
      { id: 'b', label: 'Credentials are held physically and retrieved by a documented process.' },
      { id: 'c', label: 'Any use should raise an immediate high-priority alert.' },
      { id: 'd', label: 'They are tested periodically, because an untested emergency credential is only a hypothesis.' },
      { id: 'e', label: 'They should be covered by the standard conditional access and MFA policies, for consistency.' },
    ],
    hints: [
      'Four are sound. One applies the policy that the account exists to bypass.',
      'What is the scenario these accounts are for?',
      'What should happen the moment one of them signs in?',
    ],
    solution:
      'A, B, C, and D. Independence from likely failures, physical custody, loud alerting, and ' +
      'periodic testing. E defeats the purpose: if the break-glass account requires the MFA service, ' +
      'it cannot be used on the day the MFA service is the thing that failed. The exception is ' +
      'deliberate, and the compensating control is that its use is extremely visible rather than ' +
      'that it is protected identically to everything else.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option applies to the emergency account the very policy it exists to work around.',
      },
    ],
    debrief:
      'Test them. Every organisation that has needed a break-glass account and found the password ' +
      'wrong, the account expired, or the safe combination unknown learned this the same way.',
    practice: [],
  },
  {
    id: 'idm.6.3',
    moduleId: 'idm.6',
    packageId: 'identity-foundations',
    order: 3,
    title: 'Shared accounts',
    kind: 'multiple-choice',
    goal: 'Handle accounts several people use, where accountability disappears.',
    prompt:
      'A team shares one administrative account for a legacy system that cannot support individual ' +
      'logins. Which of the following are accurate? Select all that apply.',
    teach: {
      concept:
        'Shared accounts destroy accounting, which is one of the four things identity exists to ' +
        'provide. When six people know a password, the audit log records the account and not the ' +
        'person, so no action can be attributed and no leaver can be cleanly removed without ' +
        'disrupting five others.\n\n' +
        'Sometimes the system genuinely cannot do better, and the answer is to reintroduce ' +
        'attribution around it. A PASSWORD VAULT that checks the credential out to a named person, ' +
        'rotates it afterwards, and records who held it when, restores most of the accountability ' +
        'without changing the legacy system. SESSION RECORDING through a jump host does the same ' +
        'from the other direction.\n\n' +
        'And the credential has to ROTATE ON DEPARTURE, because a shared password is known rather ' +
        'than held, and disabling somebody directory account does nothing about what they can ' +
        'remember.\n\n' +
        'What does not work is a policy banning shared accounts on a system that cannot support ' +
        'anything else. The account will exist regardless, and a ban only guarantees it exists ' +
        'undocumented.',
    },
    options: [
      { id: 'a', label: 'Audit logs record the account rather than the person, so actions cannot be attributed.' },
      { id: 'b', label: 'A vault that checks the credential out to a named person restores most of the attribution.' },
      { id: 'c', label: 'The shared credential must be rotated when any holder leaves, since they know it.' },
      { id: 'd', label: 'Session recording through a jump host is another way to reintroduce accountability.' },
      { id: 'e', label: 'A policy banning shared accounts resolves the problem on systems that cannot support individual logins.' },
    ],
    hints: [
      'Four are accurate. One bans something the system makes unavoidable.',
      'What does the audit log actually contain for a shared account?',
      'If a policy forbids something people still need to do, what happens to the documentation?',
    ],
    solution:
      'A, B, C, and D. Lost attribution, vaulting and session recording as remedies, and rotation ' +
      'on departure. E is the policy that produces undocumented shared accounts: banning the ' +
      'arrangement on a system that supports nothing else does not remove it, it removes the ' +
      'record of it, and you end up with the same risk plus no inventory. Permit it, control it, ' +
      'and put a date on replacing the system.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option bans an arrangement the system leaves no alternative to, which drives it ' +
          'underground rather than removing it.',
      },
    ],
    debrief:
      'The vault checkout pattern is the practical answer and it is cheap. It converts an ' +
      'unattributable shared password into a logged, rotating, named checkout without touching the ' +
      'legacy system at all.',
    practice: [],
  },
  {
    id: 'idm.6.4',
    moduleId: 'idm.6',
    packageId: 'identity-foundations',
    order: 4,
    title: 'Protecting the administrators of identity',
    kind: 'multiple-choice',
    goal: 'Apply the strongest controls to the accounts that can grant everything else.',
    prompt:
      'Which of the following should apply to administrators of the identity provider itself? ' +
      'Select all that apply.',
    teach: {
      concept:
        'These accounts can grant, revoke, and impersonate across everything federated to the ' +
        'provider, which makes them the most consequential accounts in the organisation. They ' +
        'deserve controls that would be disproportionate anywhere else.\n\n' +
        'PHISHING-RESISTANT AUTHENTICATION without exception, because a relayed code on this ' +
        'account is a total compromise. DEDICATED ACCOUNTS not used for mail or browsing, so the ' +
        'usual route in does not reach them. Ideally PRIVILEGED WORKSTATIONS, meaning administration ' +
        'is performed from a hardened machine that does not do general-purpose work.\n\n' +
        'JUST IN TIME elevation with approval, so the role is held for a task rather than ' +
        'permanently, and TAMPER-RESISTANT LOGGING exported outside the provider, because an ' +
        'administrator can otherwise alter the record of what they did.\n\n' +
        'The mistake to avoid is exempting them for convenience. These are the people most likely ' +
        'to find MFA prompts annoying, most able to configure an exemption, and most catastrophic ' +
        'to lose, and exemptions granted quietly to senior administrators are a recurring feature ' +
        'of real breaches.',
    },
    options: [
      { id: 'a', label: 'Phishing-resistant authentication with no exceptions.' },
      { id: 'b', label: 'Dedicated administrative accounts that are not used for mail or browsing.' },
      { id: 'c', label: 'Just-in-time elevation with approval, rather than permanently held roles.' },
      { id: 'd', label: 'Audit logs exported somewhere the provider administrators cannot alter.' },
      { id: 'e', label: 'A policy exemption for senior administrators, whose time is expensive and who understand the risks.' },
    ],
    hints: [
      'Four apply. One creates the exemption that appears in breach reports.',
      'Who is most able to configure an exemption for themselves?',
      'What is the point of an audit log the subject can edit?',
    ],
    solution:
      'A, B, C, and D. Strong authentication, dedicated accounts, temporary elevation, and logs out ' +
      'of reach. E is the specific failure that recurs: the exemption is granted for convenience to ' +
      'the person whose compromise is worst, understanding the risk does not reduce it, and this ' +
      'pattern shows up repeatedly in incident write-ups. If the controls are too painful for ' +
      'administrators, fix the pain rather than the coverage.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option exempts the most consequential accounts from the controls, for convenience.',
      },
    ],
    debrief:
      'Check for exemptions in your first week anywhere. They are almost never documented as ' +
      'decisions, they are configured quietly, and they are the shortest path to the whole estate.',
    practice: [],
  },
  {
    id: 'idm.6.5',
    moduleId: 'idm.6',
    packageId: 'identity-foundations',
    order: 5,
    title: 'Sell just-in-time to the people it constrains',
    kind: 'short-answer',
    goal: 'Propose removing standing privilege without the administrators resisting it.',
    prompt:
      'You want to move the infrastructure team from permanent administrative rights to ' +
      'just-in-time elevation. They are not enthusiastic. In three or four sentences, make the case ' +
      'to them.',
    teach: {
      concept:
        'This lands badly when it sounds like distrust, and administrators hear that first because ' +
        'it is what the change implies about them if you frame it carelessly.\n\n' +
        'Lead with the ACCOUNT rather than the person: the risk is that their account gets stolen, ' +
        'and while they hold permanent rights the attacker chooses the timing rather than being ' +
        'confined to the hours they are working. That framing is true and it is not about their ' +
        'competence.\n\n' +
        'Then acknowledge the FRICTION honestly, because pretending it is free is how you lose ' +
        'credibility with people who will feel it daily. Commit to making elevation fast, ' +
        'self-service, and available out of hours without waiting for anybody, because a process ' +
        'that blocks an outage response will be worked around and should be.\n\n' +
        'And offer something back: elevation records give them evidence of what was done and when, ' +
        'which protects them when something breaks and somebody asks who changed it.\n\n' +
        'A good answer frames the risk as account theft rather than distrust, acknowledges the ' +
        'friction with a commitment to speed, and does not simply assert policy.',
    },
    hints: [
      'They will hear distrust. What is the honest framing that is not about them?',
      'What is the objection they will actually raise, and what do you owe them in return?',
      'A good answer frames it as the account being stolen rather than the person being doubted, and commits to elevation being fast and available out of hours.',
    ],
    solution:
      'This is not about whether I trust you, it is about what happens if one of your accounts is ' +
      'stolen: while the rights are permanent, an attacker who gets in at three in the morning has ' +
      'the same power you do, and they pick the timing rather than being limited to when you are ' +
      'actually working. Moving to elevation on request shrinks that window from always to the ' +
      'length of a task, and it is the single biggest reduction available to us without changing ' +
      'anything else. I know it adds friction, so the commitment I am making is that elevation is ' +
      'self-service, takes under a minute, and works at three in the morning without anybody having ' +
      'to be woken up, because a process that blocks an outage response deserves to be worked ' +
      'around. It also gives you a record of what was elevated and why, which is useful the next ' +
      'time something breaks and somebody asks who changed what.',
    expectedOutput:
      'An answer framing the risk as account theft rather than distrust, acknowledging friction ' +
      'with a concrete commitment to speed and out-of-hours availability.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['stolen', 'compromis', 'attacker', 'not about whether i trust', 'account is taken'],
          ['window', 'shrink', 'length of a task', 'permanent', 'always'],
          ['friction', 'fast', 'self-service', 'under a minute', 'three in the morning', 'out of hours'],
        ],
        hint:
          'Three ideas: the risk being account theft rather than distrust, the window shrinking, ' +
          'and a concrete commitment about how fast elevation will be.',
      },
    ],
    debrief:
      'The out-of-hours commitment is the one that decides whether this succeeds. Any privileged ' +
      'access process that cannot be used at three in the morning gets a standing exemption within ' +
      'a month.',
    practice: [],
  },
];

// --- Module idm.7: governance and reviews -------------------------------------

const MODULE_IDM_7: Exercise[] = [
  {
    id: 'idm.7.1',
    moduleId: 'idm.7',
    packageId: 'identity-foundations',
    order: 1,
    title: 'Why access reviews get rubber-stamped',
    kind: 'multiple-choice',
    goal: 'Diagnose the failure mode of the control most organisations rely on.',
    prompt:
      'Managers approve 99% of entitlements in every access review. Which of the following explain ' +
      'it? Select all that apply.',
    teach: {
      concept:
        'Access recertification is the control auditors ask for and it is very often theatre. ' +
        'Understanding why is more useful than deploring it.\n\n' +
        'VOLUME: a manager with fifteen reports and forty entitlements each is being asked to make ' +
        'six hundred decisions, and nobody does that carefully in an afternoon. ' +
        'UNINTELLIGIBILITY: entitlements are presented as technical group names that mean nothing ' +
        'to the person approving them, so the honest answer to most lines is that they do not know. ' +
        'ASYMMETRIC RISK: approving is safe and revoking might break somebody work and generate a ' +
        'complaint, so the incentive points one way. And NO CONSEQUENCE: nobody checks the quality ' +
        'of a review afterwards, so approving everything and reading nothing produces the same ' +
        'outcome as care.\n\n' +
        'The fixes follow the diagnosis. Review less, more often, targeting the privileged and ' +
        'unusual rather than everything. Describe entitlements in business language. Show ' +
        'usage data, because "not used in six months" makes a decision easy. And sample the ' +
        'reviews for quality so that care is at least visible.',
    },
    options: [
      { id: 'a', label: 'Volume: hundreds of decisions in one sitting cannot be made carefully.' },
      { id: 'b', label: 'Entitlements are described in technical names the approver cannot interpret.' },
      { id: 'c', label: 'Approving is safe and revoking risks a complaint, so incentives point one way.' },
      { id: 'd', label: 'Nobody checks the quality of a review, so care and rubber-stamping look identical.' },
      { id: 'e', label: 'Managers are negligent, and the fix is to remind them of their responsibilities.' },
    ],
    hints: [
      'Four explain it. One blames the people rather than the design.',
      'What would you do, faced with six hundred lines of group names you do not recognise?',
      'What is the cost to a manager of wrongly revoking access, compared to wrongly approving it?',
    ],
    solution:
      'A, B, C, and D. Volume, unintelligibility, asymmetric risk, and no quality check. E is the ' +
      'response that has been tried everywhere and changed nothing: the managers are behaving ' +
      'rationally given what they are shown and how long they are given, and a reminder does not ' +
      'alter any of those conditions. Fix the review, not the reviewer.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option attributes a design failure to negligence by the reviewers.',
      },
    ],
    debrief:
      'Adding usage data is the highest-value single change. "This person has not used this in ' +
      'eight months" converts an impossible judgement into an obvious one.',
    practice: [],
  },
  {
    id: 'idm.7.2',
    moduleId: 'idm.7',
    packageId: 'identity-foundations',
    order: 2,
    title: 'What evidence a review has to produce',
    kind: 'multiple-choice',
    goal: 'Run a review that satisfies an auditor and improves security.',
    prompt:
      'Your access review has to satisfy an external auditor. Which of the following belong in the ' +
      'evidence? Select all that apply.',
    teach: {
      concept:
        'An auditor is testing whether the control OPERATED, which is a different question from ' +
        'whether it exists, and the evidence has to show operation end to end.\n\n' +
        'That means: the POPULATION reviewed and how it was derived, so completeness can be tested ' +
        'and it is clear nothing was quietly excluded. The DECISIONS made, by whom, and when. The ' +
        'ACTIONS that followed a revocation decision, with evidence the access was actually ' +
        'removed, which is the step that most often breaks. And EXCEPTIONS with a reason and an ' +
        'owner, because a review where everything was approved needs to show why.\n\n' +
        'The gap auditors find most often is between decision and action: managers revoke ' +
        'entitlements, the tickets are raised, and nobody confirms the access was removed. A review ' +
        'that decides and does not act is a paperwork exercise, and it fails on both counts, ' +
        'because the auditor writes it up and the access is still there.',
    },
    options: [
      { id: 'a', label: 'The population reviewed and how it was derived, so completeness can be tested.' },
      { id: 'b', label: 'Who decided what, and when.' },
      { id: 'c', label: 'Evidence that revoked access was actually removed, not only that it was decided.' },
      { id: 'd', label: 'Exceptions recorded with a reason and an owner.' },
      { id: 'e', label: 'A summary stating the review was completed, signed by the security team.' },
    ],
    hints: [
      'Four belong. One is an assertion rather than evidence.',
      'Which step between decision and outcome most often fails silently?',
      'What would an auditor be able to test in a signed summary?',
    ],
    solution:
      'A, B, C, and D. Population, decisions, completed actions, and exceptions. E is an assertion ' +
      'that the control operated, which is exactly what the auditor is trying to establish ' +
      'independently, so it evidences nothing. C is the one to build deliberately: the gap between ' +
      'deciding to revoke and the access actually going is where most reviews fail, and it fails ' +
      'quietly.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option is a signed statement that the control operated rather than evidence of it.',
      },
    ],
    debrief:
      'Close the loop from decision to removal automatically if you can. It is the difference ' +
      'between a review that reduces access and one that produces a spreadsheet.',
    practice: [],
  },
  {
    id: 'idm.7.3',
    moduleId: 'idm.7',
    packageId: 'identity-foundations',
    order: 3,
    title: 'Reviewing the right things',
    kind: 'multiple-choice',
    goal: 'Target review effort where it changes outcomes.',
    prompt:
      'You can only review a fraction of entitlements properly. Which should you prioritise? ' +
      'Select all that apply.',
    teach: {
      concept:
        'Reviewing everything badly is worse than reviewing a tenth of it well, because the first ' +
        'produces false assurance and the second produces decisions.\n\n' +
        'Prioritise by CONSEQUENCE and by ANOMALY. Privileged and administrative entitlements come ' +
        'first, because the blast radius is largest. Access to regulated or high-value data comes ' +
        'next, for the same reason plus the obligation. Then the anomalies: people whose access ' +
        'differs markedly from peers in the same role, which surfaces both accumulation and error, ' +
        'and entitlements not used in a long time, which are almost free to remove.\n\n' +
        'Movers deserve their own pass, because as the lifecycle module established, they are where ' +
        'accumulation comes from.\n\n' +
        'What to deprioritise is the large, low-consequence bulk: everybody having access to the ' +
        'intranet is not worth a manager attention, and putting it in front of them is exactly what ' +
        'creates the volume problem that makes the important lines get approved unread.',
    },
    options: [
      { id: 'a', label: 'Privileged and administrative entitlements, where the blast radius is largest.' },
      { id: 'b', label: 'Access to regulated or high-value data.' },
      { id: 'c', label: 'People whose access differs markedly from peers in the same role.' },
      { id: 'd', label: 'Entitlements that have not been used for a long time.' },
      { id: 'e', label: 'Universal low-consequence access such as the intranet, since it affects the most people.' },
    ],
    hints: [
      'Four are worth prioritising. One is the bulk that creates the volume problem.',
      'What does reviewing everybody intranet access actually change?',
      'Which lines get approved unread, and why?',
    ],
    solution:
      'A, B, C, and D. Consequence first, then anomaly, then disuse. E is the material to strip ' +
      'OUT of reviews: it affects everybody, changes nothing, and its volume is precisely what ' +
      'trains reviewers to click approve on every line, including the administrative ones three ' +
      'pages later. Removing it from the review improves the review.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option prioritises universal low-consequence access, which is what creates the ' +
          'volume problem.',
      },
    ],
    debrief:
      'Peer comparison is underused and very effective. An outlier in a team of twelve is either an ' +
      'error or a story, and both are worth a manager thirty seconds.',
    practice: [],
  },
  {
    id: 'idm.7.4',
    moduleId: 'idm.7',
    packageId: 'identity-foundations',
    order: 4,
    title: 'Metrics for an identity programme',
    kind: 'multiple-choice',
    goal: 'Measure identity in ways that drive the right behaviour.',
    prompt:
      'Leadership wants metrics for the identity programme. Which of these would improve it? ' +
      'Select all that apply.',
    teach: {
      concept:
        'As everywhere, a metric is an instruction, so the question is what each one makes people ' +
        'do.\n\n' +
        'Good ones point at outcomes. TIME FROM DEPARTURE TO ACCESS REMOVED measures the leaver ' +
        'risk directly, and it is uncomfortable in a useful way. PROPORTION OF PRIVILEGED ACCESS ' +
        'HELD JUST IN TIME measures progress on the biggest single exposure. COVERAGE OF ' +
        'PHISHING-RESISTANT AUTHENTICATION on privileged accounts measures the control that matters ' +
        'most. And ACCOUNTS WITHOUT A NAMED OWNER measures the thing that makes every other control ' +
        'unenforceable.\n\n' +
        'A bad one is the count of entitlements reviewed, which rewards putting more lines in front ' +
        'of managers and produces exactly the rubber-stamping the previous exercises described. It ' +
        'is popular because it is easy to collect and it goes up, which is the profile of most ' +
        'harmful metrics.',
    },
    options: [
      { id: 'a', label: 'Time from a person departing to their access actually being removed.' },
      { id: 'b', label: 'Proportion of privileged access granted just in time rather than held permanently.' },
      { id: 'c', label: 'Coverage of phishing-resistant authentication across privileged accounts.' },
      { id: 'd', label: 'Number of accounts with no named owner.' },
      { id: 'e', label: 'Number of entitlements reviewed per quarter.' },
    ],
    hints: [
      'Four are good. One rewards volume in the exact place volume causes harm.',
      'What would somebody do to improve each number if they were judged on it?',
      'Which of these could rise every quarter while identity gets worse?',
    ],
    solution:
      'A, B, C, and D. Leaver latency, standing privilege, strong authentication coverage, and ' +
      'ownership. E is the one to argue against: it improves by reviewing more lines, which is ' +
      'exactly what makes reviews meaningless, so the metric can rise every quarter while the ' +
      'control it measures degrades. If review has to be measured, measure the actions that ' +
      'followed rather than the lines shown.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option counts entitlements reviewed, which rewards the volume that causes ' +
          'rubber-stamping.',
      },
    ],
    debrief:
      'Leaver latency is the metric to introduce first. It is easy to compute, impossible to game ' +
      'without actually improving, and it makes an invisible risk visible to people who can fund ' +
      'fixing it.',
    practice: [],
  },
  {
    id: 'idm.7.5',
    moduleId: 'idm.7',
    packageId: 'identity-foundations',
    order: 5,
    title: 'Redesign a failing review',
    kind: 'short-answer',
    goal: 'Turn a rubber-stamped review into one that produces decisions.',
    prompt:
      'Your quarterly access review covers every entitlement in the organisation and 99% are ' +
      'approved. In three or four sentences, say how you would change it.',
    teach: {
      concept:
        'The instinct is to demand more care. The effective move is to change what is being asked, ' +
        'because the current design makes care impossible.\n\n' +
        'CUT THE SCOPE: review privileged, sensitive and anomalous access properly rather than ' +
        'everything superficially, and take the universal low-consequence entitlements out ' +
        'entirely. That alone can reduce the volume by an order of magnitude.\n\n' +
        'CHANGE WHAT IS SHOWN: describe entitlements in business language rather than group names, ' +
        'and include last-used data, because a manager who is told this has not been used in eight ' +
        'months can decide in a second.\n\n' +
        'CLOSE THE LOOP: make sure a revocation decision actually results in removal, with ' +
        'evidence, because the current process may be producing decisions that go nowhere.\n\n' +
        'And consider making the DEFAULT lapse for the highest-risk items, so inaction removes ' +
        'access rather than preserving it.\n\n' +
        'A good answer reduces the scope to what matters, improves what the reviewer is shown, and ' +
        'does not rely on asking people to try harder.',
    },
    hints: [
      'Do not ask for more care. Ask why care is currently impossible.',
      'What single piece of data would make most of these decisions easy?',
      'A good answer narrows the scope to privileged and anomalous access, shows business-language descriptions and last-used data, and does not simply ask reviewers to be more diligent.',
    ],
    solution:
      'I would stop reviewing everything, because covering the whole estate is what makes the ' +
      'volume impossible and trains people to approve without reading. Instead I would review ' +
      'privileged access, access to regulated data, and anomalies such as people whose access ' +
      'differs from their peers, and take universal low-consequence entitlements out of the review ' +
      'altogether. I would also change what the reviewer sees: entitlements described in business ' +
      'language rather than group names, with last-used data alongside, since a manager told that ' +
      'something has not been used in eight months can decide immediately. And I would verify that ' +
      'revocation decisions actually result in the access being removed, because a review that ' +
      'produces decisions nobody executes is worse than useless, and none of this depends on asking ' +
      'managers to try harder.',
    expectedOutput:
      'An answer narrowing scope to privileged and anomalous access, improving what the reviewer is ' +
      'shown, and verifying that revocations are executed.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['stop reviewing everything', 'narrow', 'privileged', 'anomal', 'scope', 'take out'],
          ['last used', 'business language', 'plain', 'what the reviewer sees', 'describe', 'usage'],
          ['actually removed', 'executed', 'close the loop', 'verify', 'result in'],
        ],
        hint:
          'Three changes: what gets reviewed, what the reviewer is shown, and what happens after a ' +
          'decision.',
      },
    ],
    debrief:
      'Auditors accept a narrower scope far more readily than people expect, provided the ' +
      'rationale is written down. What they object to is a scope that was narrowed silently.',
    practice: [],
  },
];

// --- Module idm.8: when identity fails ----------------------------------------

const MODULE_IDM_8: Exercise[] = [
  {
    id: 'idm.8.1',
    moduleId: 'idm.8',
    packageId: 'identity-foundations',
    order: 1,
    title: 'How accounts are actually taken',
    kind: 'multiple-choice',
    goal: 'Know the attacks that account for most real account compromise.',
    prompt:
      'Which of the following are common ways corporate accounts are compromised? Select all that ' +
      'apply.',
    teach: {
      concept:
        'The attacks that matter are unglamorous and they work at scale.\n\n' +
        'CREDENTIAL STUFFING replays username and password pairs from other breaches, and works ' +
        'because people reuse passwords. PASSWORD SPRAYING tries a small number of likely passwords ' +
        'against many accounts, which avoids lockout thresholds because each account sees only one ' +
        'or two attempts, and it is the reason lockout policy alone does not stop this. PHISHING ' +
        'with a relaying proxy captures both the password and the second factor, as the earlier ' +
        'module described. SESSION THEFT via malware skips authentication entirely.\n\n' +
        'And HELP DESK SOCIAL ENGINEERING, which is increasingly prominent: an attacker calls ' +
        'pretending to be an employee who has lost their phone and asks for an MFA reset. It ' +
        'defeats every technical control by using the process designed to help people who are ' +
        'genuinely locked out.\n\n' +
        'What almost never happens is cryptographic attack on the authentication protocol. Defences ' +
        'should be proportioned to what occurs, which means identity verification at the help desk ' +
        'deserves more attention than most organisations give it.',
    },
    options: [
      { id: 'a', label: 'Credential stuffing, replaying pairs from other breaches against corporate logins.' },
      { id: 'b', label: 'Password spraying, which avoids lockouts by trying few passwords across many accounts.' },
      { id: 'c', label: 'Phishing through a relaying proxy that captures the password and the second factor.' },
      { id: 'd', label: 'Social engineering of the help desk to obtain an MFA reset.' },
      { id: 'e', label: 'Cryptographic attacks against the authentication protocol itself.' },
    ],
    hints: [
      'Four are common. One is vanishingly rare in practice.',
      'Which of these does a lockout policy fail to stop, and why?',
      'What is the process an attacker abuses when somebody genuinely loses their phone?',
    ],
    solution:
      'A, B, C, and D. Stuffing, spraying, relayed phishing, and help desk social engineering. E is ' +
      'essentially theoretical against modern protocols and gets disproportionate attention because ' +
      'it is interesting. D deserves the most attention relative to what it gets: it bypasses every ' +
      'technical control by exploiting the recovery process, and hardening identity verification at ' +
      'the help desk is cheap and rarely done.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option is a cryptographic attack, which is rare compared to the others.',
      },
    ],
    debrief:
      'Recovery is the weakest link in most identity systems, because it is designed for the ' +
      'genuinely stuck user and every control is relaxed to help them. Look at yours.',
    practice: [],
  },
  {
    id: 'idm.8.2',
    moduleId: 'idm.8',
    packageId: 'identity-foundations',
    order: 2,
    title: 'Harden the recovery path',
    kind: 'multiple-choice',
    goal: 'Design account recovery that helps real users without helping attackers.',
    prompt:
      'You are redesigning how the help desk verifies somebody who has lost their authentication ' +
      'device. Which of the following are sound? Select all that apply.',
    teach: {
      concept:
        'Recovery has to work, because people genuinely lose phones, and every control you add ' +
        'costs somebody time on a bad day. The design problem is verifying identity using something ' +
        'an attacker cannot easily obtain.\n\n' +
        'What works: verification through a SEPARATE CHANNEL already on record, such as calling ' +
        'the registered number back rather than trusting the number that called in. VERIFICATION BY ' +
        'THE LINE MANAGER, or in person, for privileged accounts, because the consequence justifies ' +
        'the friction. PRE-ENROLLED BACKUP FACTORS, so a lost phone means using a second key rather ' +
        'than starting a recovery process at all, which is the best outcome for everybody. And ' +
        'ALERTING the account owner through every channel when a recovery is performed, so an ' +
        'illegitimate one surfaces quickly.\n\n' +
        'What does not work is knowledge-based verification: employee number, date of birth, ' +
        'manager name, last four of a national identifier. All of it is discoverable or guessable, ' +
        'and it is exactly what a prepared attacker will have ready before they call.',
    },
    options: [
      { id: 'a', label: 'Call back on the number already on record rather than trusting the caller number.' },
      { id: 'b', label: 'Require manager or in-person verification for privileged accounts.' },
      { id: 'c', label: 'Pre-enrol backup factors, so a lost device does not require recovery at all.' },
      { id: 'd', label: 'Alert the account owner through all channels whenever a recovery is performed.' },
      { id: 'e', label: 'Verify with employee number, date of birth and manager name.' },
    ],
    hints: [
      'Four are sound. One relies on facts an attacker can look up.',
      'Which of these is best because it avoids the recovery process entirely?',
      'What would a prepared attacker have in front of them before calling?',
    ],
    solution:
      'A, B, C, and D. Call-back on a known channel, stronger verification where consequence is ' +
      'high, backup factors that avoid recovery entirely, and alerting so an illegitimate recovery ' +
      'surfaces. E is the standard approach and the weakest: employee numbers appear in email ' +
      'signatures, dates of birth are findable, and manager names are on professional networks. ' +
      'Anything a stranger can research is not verification.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option verifies with facts that are discoverable from public sources.',
      },
    ],
    debrief:
      'Pre-enrolled backup factors are the underrated one. Every recovery you avoid is a recovery ' +
      'process an attacker cannot abuse, and it is better for the user too.',
    practice: [],
  },
  {
    id: 'idm.8.3',
    moduleId: 'idm.8',
    packageId: 'identity-foundations',
    order: 3,
    title: 'Detecting identity attacks',
    kind: 'multiple-choice',
    goal: 'Choose detections that suit authentication data.',
    prompt:
      'You are building detections from identity provider logs. Which of the following are worth ' +
      'building? Select all that apply.',
    teach: {
      concept:
        'Identity logs are unusually good detection material, because authentication is a ' +
        'structured event with strong patterns.\n\n' +
        'Worth building: FAILURES ACROSS MANY ACCOUNTS from one source, which is spraying and looks ' +
        'nothing like ordinary user error. IMPOSSIBLE JOURNEYS, where the same account authenticates ' +
        'from two places too far apart for the time between, which is imperfect because of VPNs and ' +
        'is still informative. NEW MFA METHOD REGISTRATION, especially soon after a password change ' +
        'or from an unfamiliar device, because that is the persistence step from the earlier ' +
        'module. And LEGACY PROTOCOL AUTHENTICATION SUCCEEDING, which usually means something ' +
        'bypassed MFA entirely.\n\n' +
        'What is a poor detection on its own is a single failed login, which happens thousands of ' +
        'times a day for entirely innocent reasons. The art here is aggregation: the signal is ' +
        'almost always in the pattern across accounts, sources or time, rather than in any ' +
        'individual event.',
    },
    options: [
      { id: 'a', label: 'Authentication failures spread across many accounts from one source.' },
      { id: 'b', label: 'Successful authentications from locations too far apart for the elapsed time.' },
      { id: 'c', label: 'Registration of a new MFA method, especially shortly after a password change.' },
      { id: 'd', label: 'Successful authentication over a legacy protocol that cannot carry MFA.' },
      { id: 'e', label: 'Any single failed login attempt, alerted individually.' },
    ],
    hints: [
      'Four are worth building. One would produce thousands of alerts a day.',
      'How many times do people mistype a password in a large organisation daily?',
      'Which of these is the persistence step from the sessions module?',
    ],
    solution:
      'A, B, C, and D. Spraying patterns, impossible journeys, new factor registration, and legacy ' +
      'protocol success. E is the classic mistake: individual failures are overwhelmingly innocent, ' +
      'and alerting on each one produces a queue nobody can work, which then trains everybody to ' +
      'ignore the alert that mattered. The signal is in the aggregate.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option alerts on every individual failed login.',
      },
    ],
    debrief:
      'New MFA method registration is the detection most worth having and least often built. It ' +
      'catches the step that turns a phished password into months of persistent access.',
    practice: [],
  },
  {
    id: 'idm.8.4',
    moduleId: 'idm.8',
    packageId: 'identity-foundations',
    order: 4,
    title: 'Where this career goes',
    kind: 'multiple-choice',
    goal: 'Understand identity as a career and where it leads.',
    prompt:
      'Which of the following are accurate about identity and access management as a career? ' +
      'Select all that apply.',
    teach: {
      concept:
        'Identity is one of the most reliable ways into security and one of the least discussed, ' +
        'largely because it is not what security looks like in films.\n\n' +
        'It has an unusually good ENTRY PATH: service desk work involves resetting passwords and ' +
        'granting access, which is identity work, so the transition is short and many people make ' +
        'it without a security background. Audit and administration backgrounds transfer similarly ' +
        'well, because the work is process and evidence as much as technology.\n\n' +
        'The DEMAND is steady and structural rather than fashionable: every organisation of any ' +
        'size has this problem permanently, and regulation keeps access review in scope. The work ' +
        'is BUSINESS HOURS with predictable rhythms around joiners, leavers and review cycles.\n\n' +
        'And it leads somewhere. Identity engineering, privileged access management, identity ' +
        'governance, cloud security through the permissions door, and security architecture. The ' +
        'honest caveat is that the day-to-day involves a lot of process, ticketing and stakeholder ' +
        'work, which suits some people extremely well and bores others, and it is worth knowing ' +
        'which you are before committing.',
    },
    options: [
      { id: 'a', label: 'Service desk experience transfers directly, because resetting passwords and granting access is identity work.' },
      { id: 'b', label: 'Demand is structural rather than fashionable: every organisation has this problem permanently.' },
      { id: 'c', label: 'The work is business hours with predictable cycles around joiners, leavers and reviews.' },
      { id: 'd', label: 'It leads into identity engineering, privileged access, governance, cloud and architecture.' },
      { id: 'e', label: 'It is mostly technical engineering work, with little process or stakeholder involvement.' },
    ],
    hints: [
      'Four are accurate. One misdescribes what the job actually involves day to day.',
      'How much of this package was about process, evidence and conversations?',
      'Who does an identity analyst spend their week talking to?',
    ],
    solution:
      'A, B, C, and D. Good entry path, structural demand, predictable hours, and real progression. ' +
      'E is the misdescription worth correcting before somebody takes the job: identity is heavily ' +
      'process and stakeholder work, involving managers, HR, audit and application owners, and ' +
      'somebody who wants to spend the day in a terminal will find it frustrating. Somebody who ' +
      'likes making systems and people work together will find it unusually satisfying.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option describes the role as primarily technical with little process or stakeholder ' +
          'work.',
      },
    ],
    debrief:
      'If the exercises in this package that you enjoyed most were the written ones about ' +
      'explaining and negotiating, this is a good sign. That is most of the job.',
    practice: [],
  },
  {
    id: 'idm.8.5',
    moduleId: 'idm.8',
    packageId: 'identity-foundations',
    order: 5,
    title: 'The first thing you would fix',
    kind: 'short-answer',
    goal: 'Prioritise identity work in a new organisation with limited time.',
    prompt:
      'You join an organisation with no identity programme at all. In three or four sentences, say ' +
      'what you would do first and why.',
    teach: {
      concept:
        'There is a defensible order and it starts with knowing rather than fixing.\n\n' +
        'First, find out WHAT EXISTS: which accounts, which are privileged, which have no owner, ' +
        'and which have not been used. Almost nowhere has this, everything else depends on it, and ' +
        'producing it is immediately useful to other people, which buys you standing.\n\n' +
        'Then the two highest-consequence fixes, which are usually the same everywhere. ' +
        'PHISHING-RESISTANT AUTHENTICATION on privileged accounts, because those are the accounts ' +
        'whose compromise ends the argument, and the population is small enough to do quickly. And ' +
        'the LEAVER PATH, because stale accounts with live access are the most common way ' +
        'organisations get compromised and the fix is process rather than budget.\n\n' +
        'Dormant and orphaned account cleanup is a good early win alongside those: cheap, visible, ' +
        'and genuinely risk-reducing.\n\n' +
        'What to resist is starting with an entitlement model or a governance tool, both of which ' +
        'take a year, require the inventory you do not have, and produce nothing visible in the ' +
        'meantime.\n\n' +
        'A good answer starts with inventory or discovery, prioritises privileged accounts or the ' +
        'leaver path, and gives a reason for the order.',
    },
    hints: [
      'What has to be true before any other identity work is possible?',
      'Of the fixes, which one has the largest consequence and the smallest population?',
      'A good answer starts by finding out what accounts exist and which are privileged, then fixes privileged authentication or the leaver process, and explains why that order.',
    ],
    solution:
      'I would start by finding out what actually exists: an inventory of accounts, which of them ' +
      'are privileged, which have no named owner, and which have not been used in months. Almost ' +
      'no organisation without a programme has that, everything else depends on it, and producing ' +
      'it is immediately useful to other teams rather than only to me. Then I would fix the two ' +
      'things with the largest consequence and the smallest effort: phishing-resistant ' +
      'authentication on privileged accounts, since that population is small and its compromise is ' +
      'the worst case, and the leaver path, since stale accounts with live access are the most ' +
      'common way organisations are breached and fixing it is process rather than budget. I would ' +
      'deliberately not start with an entitlement model or a governance platform, because both ' +
      'take a year, depend on the inventory I do not have yet, and show nothing in the meantime.',
    expectedOutput:
      'An answer starting with account inventory or discovery, then prioritising privileged ' +
      'authentication or the leaver path, with a stated reason for the order.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['inventory', 'what exists', 'discovery', 'which accounts', 'find out what'],
          ['privileged', 'admin', 'leaver', 'stale', 'departed'],
          ['because', 'depends on', 'largest', 'smallest', 'why', 'first'],
        ],
        hint:
          'Three things: finding out what exists, the highest-consequence fix, and a reason for ' +
          'doing them in that order.',
      },
    ],
    debrief:
      'That inventory is the artefact everything else in this package rests on. Build it early, ' +
      'keep it current, and you will be the person who can answer the question nobody else can.',
    practice: [],
  },
];

export const IDENTITY_FOUNDATIONS: LearningPackage = {
  id: 'identity-foundations',
  order: 15,
  title: 'Identity and Access Foundations',
  summary:
    'The discipline that decides who can do what: identification against authorisation, factors ' +
    'and why some MFA still gets phished, single sign-on and the blast radius of the provider, ' +
    'permission models and privilege creep, the joiner-mover-leaver process and the case everybody ' +
    'gets wrong, privileged and break-glass access, access reviews that are not rubber stamps, and ' +
    'what an identity attack actually looks like.',
  outcomes: [
    'Separate identification, authentication, authorisation and accounting, and use each word correctly',
    'Tell identity, account and credential apart, and say what a leaver process actually revoked',
    'Judge whether an authentication scheme is genuinely multi-factor and genuinely phishing-resistant',
    'Explain single sign-on well enough to reason about what a compromised provider reaches',
    'Choose between role and attribute based models, and recognise privilege creep',
    'Design a joiner-mover-leaver process that handles the mover case',
    'Reduce standing privilege, and design break-glass access that can be audited',
    'Run an access review that produces decisions rather than rubber stamps',
  ],
  /*
   * No prerequisite. This is a no-terminal discipline whose audience arrives
   * from service desk, audit and administration rather than from engineering,
   * and the identity track declares no Linux requirement for the same reason.
   */
  prerequisites: [],
  modules: [
    {
      id: 'idm.1',
      packageId: 'identity-foundations',
      order: 1,
      title: 'What identity actually is',
      summary:
        'The four words people mix up, one person as many accounts, the non-human accounts nobody ' +
        'owns, identity as the control plane, and what a revocation really covered.',
      exercises: MODULE_IDM_1,
    },
    {
      id: 'idm.2',
      packageId: 'identity-foundations',
      order: 2,
      title: 'Proving who you are',
      summary:
        'Factors that genuinely count, why relayable MFA still gets phished, password policy that ' +
        'current guidance supports, conditional access and its blind spots.',
      exercises: MODULE_IDM_2,
    },
    {
      id: 'idm.3',
      packageId: 'identity-foundations',
      order: 3,
      title: 'Single sign-on and sessions',
      summary:
        'What a federated login actually does, why a stolen session beats a password, the blast ' +
        'radius of the provider, and what a password reset does not fix.',
      exercises: MODULE_IDM_3,
    },
    {
      id: 'idm.4',
      packageId: 'identity-foundations',
      order: 4,
      title: 'Deciding what somebody may do',
      summary:
        'Roles against attributes, least privilege as an incentive problem, separation of duties, ' +
        'entitlement sprawl, and refusing a request without blocking the work.',
      exercises: MODULE_IDM_4,
    },
    {
      id: 'idm.5',
      packageId: 'identity-foundations',
      order: 5,
      title: 'Joiners, movers and leavers',
      summary:
        'Why the mover case produces the excess access, where the process gets its truth, urgent ' +
        'departures, orphaned accounts, and designing a mover process that removes.',
      exercises: MODULE_IDM_5,
    },
    {
      id: 'idm.6',
      packageId: 'identity-foundations',
      order: 6,
      title: 'Privileged access',
      summary:
        'Standing privilege as the thing to reduce, break-glass accounts, shared accounts, ' +
        'protecting the administrators of identity, and selling just-in-time to the people it ' +
        'constrains.',
      exercises: MODULE_IDM_6,
    },
    {
      id: 'idm.7',
      packageId: 'identity-foundations',
      order: 7,
      title: 'Governance and reviews',
      summary:
        'Why reviews get rubber-stamped, what evidence one has to produce, reviewing the right ' +
        'things, metrics that drive the right behaviour, and redesigning a failing review.',
      exercises: MODULE_IDM_7,
    },
    {
      id: 'idm.8',
      packageId: 'identity-foundations',
      order: 8,
      title: 'When identity fails',
      summary:
        'How accounts are actually taken, hardening the recovery path, detections worth building, ' +
        'the career, and what to fix first.',
      exercises: MODULE_IDM_8,
    },
  ],
};
