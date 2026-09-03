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
    'Start with the plainest version of the problem this whole package is about: a computer needs ' +
    'to decide, many times a second, whether to let someone do something. It cannot see the ' +
    'person. All it has is whatever they typed, tapped, or plugged in, and from that alone it has ' +
    'to work out who they are and what they are allowed to touch. Everything in identity and ' +
    'access management is really an elaboration of that one problem.\n\n' +
    'It helps to picture a building with a front desk. Walking up and saying your name is a CLAIM: ' +
    '"I am Alex, here for the 2 o\'clock." The desk does not just take your word for it, so it asks ' +
    'for proof, an ID card or a name on a visitor list. That proof step is AUTHENTICATION. Once the ' +
    'desk believes you are who you say, it still has a second, separate decision to make: does ' +
    'Alex get a badge for the whole building, or only for the meeting room upstairs? That is ' +
    'AUTHORISATION, a completely different question from who you are. A log recording that Alex ' +
    'arrived at 2:04 and left at 2:51 is the building\'s version of ACCOUNTING: a record kept so it ' +
    'can be checked later.\n\n' +
    'Four words, four different jobs. IDENTIFICATION is the claim: I am this person. ' +
    'AUTHENTICATION is the proof behind the claim: here is evidence it is true. AUTHORISATION is ' +
    'the decision that follows, given who you are, may you do this specific thing. ACCOUNTING is ' +
    'the record: what did that identity actually go on to do. In everyday speech people say ' +
    '"login" to mean all four at once, and that collapsing is exactly what causes confused designs ' +
    'and confused incidents, because proving who you are says nothing at all about what you should ' +
    'be allowed to do. A company badge proves you are an employee; it does not by itself mean you ' +
    'may walk into the server room. A system that skips the authorisation question and just checks ' +
    '"are you logged in" hands every logged-in person access to everything, which is exactly the ' +
    'design mistake that turns one stolen password into a full breach.\n\n' +
    'Three more distinctions carry the same weight and trip people up just as often. An IDENTITY ' +
    'is the actual person or piece of software behind all this. An ACCOUNT is that identity\'s ' +
    'presence inside one particular system, like a hotel keycard that only opens rooms in that one ' +
    'hotel: the same person can hold a dozen accounts across a dozen systems, one keycard per ' +
    'hotel. A CREDENTIAL is whatever proves you control an account, a password, a key, a ' +
    'fingerprint, and it is not the account itself, the same way a keycard is not the room. ' +
    'Cancelling a card at the front desk does nothing to a spare copy sitting in someone else\'s ' +
    'pocket.\n\n' +
    'That last point is where good intentions turn into real incidents. A team says "we disabled ' +
    'the user" and means they reset one password on one system, while an API token issued weeks ' +
    'ago, an SSH key copied onto a laptop, and an account on an older system that never got ' +
    'connected to the main one all keep working exactly as before, because none of them were the ' +
    'thing that actually changed. Knowing that a disabled account, a revoked credential, and a ' +
    'closed identity are three different claims, not one, is the difference between a leaver ' +
    'process that means something and one that only feels like it does.',
} as const;

const FACTOR_TEACH = {
  concept:
    'Think about how you might prove your identity to someone who has never met you, in the ' +
    'physical world. You could tell them a secret only you would know, like a family story. You ' +
    'could show them something only you would be carrying, like the key to your own front door. Or ' +
    'you could let them check something about your actual body, a face they recognise, a ' +
    'fingerprint. Authentication factors are the digital version of exactly those three ideas, ' +
    'grouped into three categories: something you KNOW (a password, a PIN), something you HAVE (a ' +
    'phone, a physical security key, a certificate stored on a device), and something you ARE (a ' +
    'fingerprint, a face scan).\n\n' +
    'MULTI-FACTOR authentication means combining factors from genuinely different categories, not ' +
    'just asking for two things from the same one. A password plus a security question is still ' +
    'just two things you know, the digital equivalent of asking for the secret story twice in ' +
    'different words, and it buys almost no additional protection, because anything that can be ' +
    'guessed, looked up, or phished once can usually be guessed, looked up, or phished twice.\n\n' +
    'What matters far more than how many factors are stacked up is whether a factor can resist ' +
    'PHISHING specifically, because that is the attack that actually happens at scale. A code you ' +
    'can read out loud or type into a box, whether it arrived by text message, by an authenticator ' +
    'app, or as a push notification you tap to approve, can be intercepted and relayed by an ' +
    'attacker sitting in the middle, in real time, faster than you can notice something is wrong. A ' +
    'factor that is cryptographically bound to the exact website you are visiting cannot be relayed ' +
    'this way, because the browser itself refuses to hand that proof over to any site other than ' +
    'the real one, the way a key cut for one specific lock simply will not turn in a different lock ' +
    'no matter how convincingly it is disguised. That is what makes security keys and passkeys a ' +
    'different kind of protection, not just a stronger version of the same one.\n\n' +
    'So the useful way to think about MFA on the job is not "one factor, two factors, three ' +
    'factors," as though more is automatically safer. It is three tiers: password alone, password ' +
    'plus something an attacker can relay, and password plus something bound to the real site that ' +
    'cannot be relayed. The step from the middle tier to the last one removes an entire category of ' +
    'attack, and it is also, consistently, the step organisations put off longest, because the ' +
    'middle tier already feels like "we have MFA" and the extra step to the top tier feels ' +
    'optional.',
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
      'A, B, C, and D are each one of the four separate jobs: entering a username is the claim ' +
      '(identification), providing a password or key is the proof behind it (authentication), ' +
      'deciding whether the payroll record may be opened is the permission decision ' +
      '(authorisation), and recording that it was opened is the audit trail (accounting). E is the ' +
      'one to reject, and it is worth being precise about why: authentication only ever answers ' +
      '"is this really who they claim to be." It has no opinion at all about what that person ' +
      'should then be allowed to touch. A design that treats a successful login as automatic ' +
      'permission for anything the user asks for has quietly merged authentication and ' +
      'authorisation into one step, and the moment that happens, a single stolen password stops ' +
      'being "one account compromised" and becomes "everything that account\'s owner could ever ' +
      'touch, compromised." Keeping proof and permission as two separate checks is what makes it ' +
      'possible to grant someone exactly what their job needs and nothing more, which is the whole ' +
      'idea behind least privilege.',
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
      'Accounting is the one people skip, because unlike the other three it does not stop anyone ' +
      'doing anything in the moment, so nothing breaks if it is missing and nobody notices until ' +
      'much later. But without a record of what an identity actually did, you cannot reconstruct a ' +
      'compromise after the fact, and you cannot prove to an auditor that access was used the way ' +
      'it was supposed to be. Both of those are most of what this job actually is, day to day.',
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
        'Picture someone who works at a company with one main office and a handful of satellite ' +
        'offices that were set up independently over the years and never wired back into the main ' +
        'building\'s key system. Take away that person\'s master keycard for the main building, and ' +
        'the satellite offices are completely unaffected, because their locks were never connected ' +
        'to the main system in the first place. That is the situation with a real person\'s digital ' +
        'footprint at a company: the DIRECTORY ACCOUNT, the main, central account most companies ' +
        'manage everyone through, is usually just one of many. There is often also a local account ' +
        'somebody set up directly on a server years ago, a SaaS tool account created when a manager ' +
        'signed up with a company card and never told IT, an API token issued to a script, an SSH ' +
        'key copied onto a laptop, and a shared mailbox they had access to. "Disable the account" ' +
        'usually addresses only one of these.\n\n' +
        'The reason this happens is the gap between an IDENTITY and an ACCOUNT. An identity is the ' +
        'actual person. An account is one system\'s local record of that person, and how connected ' +
        'that record is to everything else varies a lot. When an application is FEDERATED, meaning ' +
        'it checks with the central identity provider on every login rather than keeping its own ' +
        'password list, disabling the person centrally really does lock every door at once, the ' +
        'same way disabling a hotel guest\'s key at the front desk locks every door that key opened. ' +
        'When an application is not federated, it keeps its own separate account and has no idea ' +
        'anything happened centrally, the same way the satellite office never hears about a policy ' +
        'change at head office.\n\n' +
        'There is a third layer on top of accounts and identities: credentials. A password, a ' +
        'token, or an SSH key is what proves control of one specific account, and revoking the ' +
        'account does not automatically revoke the credential. A token issued to a script often ' +
        'keeps authenticating perfectly well until it expires on its own schedule or somebody ' +
        'explicitly revokes it, regardless of what happened to the human\'s main account, and some ' +
        'sessions already in progress keep working even after the account behind them is disabled, ' +
        'until they time out on their own. So "we disabled the account" can mean three genuinely ' +
        'different things depending on which system, which account, and which credential you mean, ' +
        'and treating them as interchangeable is exactly how access outlives the reason it was ' +
        'granted.\n\n' +
        'This matters on the job because a leaver process that only reaches the central directory, ' +
        'and stops there, leaves every satellite office\'s lock untouched. Whoever left keeps ' +
        'working access to those systems for as long as nobody notices, which in practice is often ' +
        'months, and by then it is not a tidy offboarding step anymore, it is the gap an ' +
        'investigation finds after something has already gone wrong.',
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
      'A, B, C, and D are all real gaps: unfederated applications never hear about the change, ' +
      'long-lived credentials such as tokens and keys keep authenticating on their own schedule, ' +
      'live sessions can outlast the account being disabled until they time out, and local accounts ' +
      'on individual servers sit entirely outside the directory. E is the assumption behind a great ' +
      'many overconfident offboarding reports: it treats "we have an identity provider" as though it ' +
      'means "everything checks with it," when full federation is a goal almost no organisation has ' +
      'actually reached. A leaver process built on that assumption will look complete on paper and ' +
      'quietly leave access behind every single time it runs, because it was never designed to look ' +
      'anywhere else. The honest version of a leaver confirmation is not a yes, it is a specific ' +
      'list of what was checked and revoked, and a separate list of what was not checked because ' +
      'nobody has mapped it yet.',
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
      'This is the exact mechanism behind the stale account that shows up elsewhere in this ' +
      'platform\'s incident scenarios. Nobody left it open on purpose: a leaver process that only ' +
      'ever knew how to check one account store did precisely what it was built to do, and the ' +
      'account it never saw simply kept working.',
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
        'Not every account belongs to a person. A SERVICE ACCOUNT is an account created for a piece ' +
        'of software instead of a human being: a backup job that needs to log into a database every ' +
        'night, a script that pulls data from one system into another, an integration that lets two ' +
        'products talk to each other automatically. Think of it as a key cut for a machine rather ' +
        'than a person, a maintenance robot\'s own set of keys, still opens doors, still needs ' +
        'managing, but nobody is ever going to walk up to a front desk holding it.\n\n' +
        'Most organisations, once they actually count, have more of these machine accounts than ' +
        'human ones, and they are managed worse across the board, for a simple reason: every ' +
        'control anyone ever built for accounts assumes a human is on the other end. Multi-factor ' +
        'authentication assumes somebody can glance at a phone and tap approve, but there is no ' +
        'human present to do that for a nightly backup job, so service accounts usually skip it ' +
        'entirely. Password rotation assumes somebody will update the password everywhere it is ' +
        'used, but nobody is quite sure what a decade-old integration will break if its credential ' +
        'changes, so it never gets rotated. The fastest way to make an integration work under a ' +
        'deadline is to grant it more access than it strictly needs, so these accounts accumulate ' +
        'privilege quietly. And because nobody "joins" or "leaves" a piece of software, these ' +
        'accounts never trigger the onboarding or offboarding processes built for people, so once ' +
        'whoever created one moves to a different job, there is often nobody left who can even say ' +
        'what it is for.\n\n' +
        'Put those four things together and you get exactly the profile an attacker is looking for: ' +
        'high privilege, a credential that never changes, no second factor standing in the way, and ' +
        'nobody watching it closely enough to notice. That combination is why a service account is ' +
        'very often a better target than a person\'s account, not a lower-risk one.\n\n' +
        'The fix is not a clever technical control, it is bookkeeping: every non-human account needs ' +
        'a named human owner, a written-down reason it exists, and a date by which someone has to ' +
        'confirm it is still needed. That single habit, applied consistently, closes most of the ' +
        'gap, because it turns "nobody knows what this is for" into "someone has to answer for it."',
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
      'A, B, C, and D describe the same underlying pattern from four angles: no second factor ' +
      'because there is no human present to approve one, credentials that rarely rotate because ' +
      'nobody is confident what will break, excess privilege because granting more is the fast way ' +
      'to make an integration work, and frequently no owner once whoever set it up moves on. E gets ' +
      'the logic backwards: removing the human does not remove the risk, it removes the controls ' +
      'that were built assuming a human would be there, which is a very different thing. A service ' +
      'account is very often a richer target than a person\'s account precisely because it tends to ' +
      'be more privileged and less watched, not less. If you ever inherit an estate that has no ' +
      'inventory of its non-human accounts at all, building that inventory is the first thing worth ' +
      'doing, because you cannot manage risk in accounts you cannot even list.',
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
      'The account created during the simulated intrusion elsewhere on this platform was ' +
      'deliberately named to look like monitoring software, and that choice was not incidental. A ' +
      'plausible-looking service account is the single least examined thing on a host, exactly ' +
      'because everyone has learned to assume machine accounts are boring and safe to ignore.',
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
        'An IDENTITY PROVIDER is the single system a company designates to answer one question on ' +
        'behalf of every other application: is this really who they say they are. Instead of each ' +
        'application checking its own password list, dozens or hundreds of applications all ' +
        'redirect to this one system and trust whatever it says. Think of it as a company building ' +
        'a single, central lobby with one security desk, and retiring every side door each ' +
        'department used to guard on its own: it is far more consistent, and it also means whoever ' +
        'controls that one desk now controls entry to the entire building, not just one ' +
        'department\'s floor.\n\n' +
        'That concentration cuts both ways, and both directions are equally true rather than a ' +
        'tradeoff to be resolved. The gain is real and large: multi-factor authentication can be ' +
        'enforced in one place instead of application by application, a departing employee can be ' +
        'locked out everywhere with one action instead of dozens, every sign-in produces logs in ' +
        'one consistent format, and policy can actually be applied evenly rather than depending on ' +
        'which team remembered to configure it. Organisations without a central provider genuinely ' +
        'cannot answer a question as basic as "what does this person have access to," because the ' +
        'answer is scattered across every application\'s own separate records.\n\n' +
        'The risk is just as real. If the provider itself is compromised, or if someone with ' +
        'administrative rights over it is compromised, that is compromise of everything downstream, ' +
        'and none of the individual applications need to be touched at all. This is exactly why the ' +
        'administrators of an identity provider are among the most privileged people in a modern ' +
        'organisation, often more so than the old-style "domain admin" role that used to carry that ' +
        'title, and why the handful of accounts that can administer the identity provider deserve ' +
        'protection out of proportion to almost anything else in the company.\n\n' +
        'There used to be a fairly reliable rule of thumb: the network was the boundary, and if you ' +
        'were inside the building\'s network, you were probably trusted. That rule no longer holds. ' +
        'The practical boundary now runs through identity, specifically through the login page, and ' +
        'a defender who is still spending their whole budget on firewalls while that login page is ' +
        'loosely protected is defending a perimeter that has already moved somewhere else.',
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
      'A, B, C, and D each describe a real consequence of centralising who gets to prove their ' +
      'identity: consistent enforcement of controls, a single point whose compromise reaches ' +
      'everything, administrators who end up holding extraordinary power, and a security boundary ' +
      'that has effectively relocated. E is the misunderstanding that quietly lets entitlements rot ' +
      'for years: federation centralises AUTHENTICATION, meaning the single question of who ' +
      'someone is, but it says nothing about AUTHORISATION, meaning what that person is then ' +
      'allowed to do once an application accepts they are who they say. Each application still ' +
      'makes that second decision entirely on its own. Roles and permissions inside every one of ' +
      'those applications still have to be managed, reviewed and cleaned up individually, and the ' +
      'comfort of a single login page can quietly convince people that this second job no longer ' +
      'needs doing, which is exactly how a company ends up with excellent authentication and a mess ' +
      'of stale permissions underneath it.',
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
      'Remember this the next time somebody describes identity as a back-office, administrative ' +
      'function, the kind of thing that keeps the lights on rather than actually protecting ' +
      'anything. It is the control plane for the entire organisation, and the small number of ' +
      'people who administer it can reach further, faster, than anybody else who works there.',
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
        'A manager asking "do they still have access" sounds like it wants a yes or no, but as the ' +
        'earlier exercises in this module established, one person is really many accounts, several ' +
        'credentials, and possibly a live session, so a true yes-or-no answer would require ' +
        'checking every single one of those separately. Answering this well, by working through the ' +
        'list rather than guessing at a single answer, is the clearest way to show you actually ' +
        'understood the rest of this module rather than just memorised it.\n\n' +
        'Start with the obvious place, the DIRECTORY ACCOUNT, and then work outward to everything a ' +
        'directory does not automatically cover. UNFEDERATED APPLICATIONS keep their own separate ' +
        'account records, and for a contractor this often means exactly the specialised tools they ' +
        'were brought in to use, which are frequently the ones least connected to the central ' +
        'system. LOCAL ACCOUNTS created directly on individual servers or appliances they worked on ' +
        'sit outside the directory entirely. CREDENTIALS such as API tokens, SSH keys, ' +
        'certificates, or anything stored in a shared password vault can outlive the account they ' +
        'were issued from and keep authenticating on their own schedule. And ACTIVE SESSIONS ' +
        'already in progress can continue working after an account is disabled until they naturally ' +
        'expire, which is why forcing a sign-out is its own separate step rather than something ' +
        'disablement does automatically.\n\n' +
        'The part people skip is saying, out loud, what you did NOT check. A contractor may well ' +
        'have been given access to a system nobody in identity ever knew existed, and pretending ' +
        'your check was exhaustive when it was not is worse than being honest about its limits. The ' +
        'genuinely useful answer to "do they still have access" is a specific list of what was ' +
        'revoked, plus a plain statement of what was out of scope, because that is something the ' +
        'manager can actually act on, unlike a confident yes that turns out to be wrong.',
    },
    hints: [
      'The question sounds binary and is really a list. What is on it?',
      'Disabling an account and revoking a credential are different actions.',
      'A good answer looks beyond the directory account to unfederated or local accounts, names credentials such as tokens or keys that survive disablement, and says what was not checked.',
    ],
    solution:
      'I would start with the directory account, confirm it is disabled, and then deliberately look ' +
      'at everything the directory does not reach, because that is where access actually survives ' +
      'an offboarding. That means applications that are not federated and keep their own accounts, ' +
      'any local accounts set up directly on servers or appliances they worked on, and shared ' +
      'accounts they may have known the password for, since none of those hear about a change made ' +
      'centrally. Separately from accounts entirely, I would revoke credentials that can outlive ' +
      'them: API tokens, SSH keys and certificates issued to that person keep authenticating on ' +
      'their own schedule regardless of what happened to their main account, so they need to be ' +
      'found and revoked explicitly, and I would force existing sessions to end rather than trust ' +
      'that they expire on their own. Finally, I would say plainly what I checked and what I could ' +
      'not, because a contractor may have been given access to systems that never went through our ' +
      'process and identity has no visibility of, so the honest answer is that these specific things ' +
      'are confirmed revoked rather than that no access exists anywhere, and that distinction is the ' +
      'whole value of the answer.',
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
      'The last sentence is what makes you trusted in this job. Anybody under pressure can say yes ' +
      'to make the question go away. The person whose answers people actually rely on later is the ' +
      'one who says exactly what they verified and exactly where the edge of that verification was.',
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
      'A, B, C, and D each pair a password (something you know) with a genuinely different ' +
      'category: a hardware token code or a fingerprint is something you have or something you ' +
      'are, and a device certificate plus the PIN that unlocks it is a have-and-know pair too, ' +
      'since the PIN only protects the certificate rather than standing on its own. D is worth ' +
      'including deliberately, because SMS shows that "counts as two-factor" and "weak" are not ' +
      'contradictory: an SMS code is vulnerable to SIM swapping, where an attacker convinces a ' +
      'phone carrier to move your number to their device, and to the same real-time relay that ' +
      'catches other typed codes, and it is still meaningfully better than a password by itself. E ' +
      'is not two-factor at all, whatever it looks like on paper: a security question is something ' +
      'you know, exactly the same category as a password, so this is one factor asked for twice ' +
      'under different names, and the answers to most security questions, a childhood pet, a ' +
      'mother\'s maiden name, are frequently discoverable from a social media profile or a public ' +
      'records search.',
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
      'Do not let "weak factor" and "not a factor" collapse into each other in your own thinking, ' +
      'because they call for different responses. SMS MFA is a real, if imperfect, improvement ' +
      'worth deploying while you work towards something stronger; security questions are not ' +
      'multi-factor authentication at all, no matter how official they look sitting next to a ' +
      'password field.',
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
        'It is natural to assume that once a company has MFA turned on everywhere, phishing stops ' +
        'working. It does not, and the reason is worth understanding precisely rather than taking ' +
        'on faith, because "we have MFA" and "we are safe from phishing" are not the same claim.\n\n' +
        'Any MFA a person can read out loud or approve with a tap can be relayed by an attacker in ' +
        'real time, and this is now a routine, off-the-shelf attack rather than something only a ' +
        'sophisticated adversary can pull off. The mechanism is a proxy, essentially a fake building ' +
        'lobby set up right in front of the real one. The victim lands on a website that looks ' +
        'exactly like the real login page; everything they type is silently forwarded, instantly, ' +
        'to the genuine site behind the scenes; the genuine site, thinking it is talking to the ' +
        'real user, asks for the one-time code; the fake site asks the victim for the same code; ' +
        'the victim, believing they are logging into the real service, types it in; the attacker\'s ' +
        'fake site forwards that code onward and completes the login as the attacker. The code was ' +
        'completely genuine, used exactly once, well within its time window, and none of that ' +
        'protected anything, because the person supplying it to the attacker was the real, ' +
        'legitimate user the whole time.\n\n' +
        'Push approvals, where you just tap "yes" on your phone instead of typing a code, fail the ' +
        'same way and add a second failure mode on top: MFA FATIGUE. An attacker who already has a ' +
        'stolen password can trigger approval prompts on the victim\'s phone over and over, at ' +
        'inconvenient times, until the victim taps accept purely to make the buzzing stop. ' +
        'Requiring the user to match a number shown on screen to one in the prompt raises the bar a ' +
        'little, but it does not remove the underlying weakness, because a victim who is confused ' +
        'or in a hurry can still be talked or tricked into matching the wrong thing.\n\n' +
        'What actually breaks this entire attack is binding the factor to the ORIGIN, meaning the ' +
        'specific website actually being visited. A security key or a passkey does not produce a ' +
        'code a person can read out at all. Instead it signs a cryptographic challenge that is tied ' +
        'to the real site\'s exact address, and the browser itself simply refuses to hand that ' +
        'signed proof to a lookalike domain, no matter how convincing the copy looks to a human ' +
        'eye. There is nothing for the attacker\'s proxy to forward, because the proof was never ' +
        'something that could be typed or spoken in the first place. That is not a stronger version ' +
        'of app-based MFA, it is a categorically different mechanism that closes off the entire ' +
        'class of attack rather than making it somewhat harder.',
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
      'A, B, C, and D each name a real piece of the picture: a proxy forwarding a typed code within ' +
      'its valid window, push fatigue wearing down a victim until they approve, a stolen session ' +
      'token letting the attacker skip re-authenticating at all, and origin binding as the one ' +
      'countermeasure that actually closes the door. E misplaces where the attack happens entirely: ' +
      'nothing about the code\'s cryptography is broken, the code is completely genuine, and the ' +
      'victim is the one who hands it over, believing they are logging into the real site. That is ' +
      'exactly why the fix was never going to be a longer code or a shorter validity window, both ' +
      'of which only make the same trick slightly harder to time. The fix has to be a factor that ' +
      'structurally refuses to be handed to the wrong site at all, which is what origin binding ' +
      'provides and a typed code never can.',
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
      'When somebody tells you they have MFA, the useful follow-up question is which kind, because ' +
      '"phishing-resistant" and "relayable" are two very different products wearing the same three ' +
      'letters, and the gap between them is exactly the gap this exercise walked through.',
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
        'A password is, at bottom, just a shared secret: a string of characters that both you and ' +
        'the system agree proves it is really you. For a long time, the advice on how to make that ' +
        'secret strong was built more on intuition about what looks complicated than on evidence ' +
        'about what actually stops attackers, and a lot of company policy still reflects that older ' +
        'intuition even though the underlying guidance has moved on substantially. That gap is ' +
        'worth knowing about, because it is one of the rare places where you can make security ' +
        'better and make people\'s daily lives easier at the same time, rather than trading one for ' +
        'the other.\n\n' +
        'Current mainstream guidance favours LENGTH over composition rules. A long passphrase made ' +
        'of several ordinary words is genuinely harder for a computer to guess than a short string ' +
        'with a symbol bolted onto the end, and it is far easier for a human being to actually ' +
        'remember, which matters because a password nobody can remember gets written on a sticky ' +
        'note. It also recommends CHECKING NEW PASSWORDS AGAINST LISTS OF KNOWN BREACHED PASSWORDS, ' +
        'because the attack that actually happens at scale is not a computer guessing randomly, it ' +
        'is an attacker trying passwords that have already leaked from some other breach, on the ' +
        'assumption that people reuse them. It recommends dropping ROUTINE EXPIRY, meaning forced ' +
        'changes every ninety days regardless of anything happening, because in practice people ' +
        'respond to forced rotation by incrementing a password slightly, Summer2024! becoming ' +
        'Summer2025!, which is trivially predictable rather than actually more secure, and expiry ' +
        'is far more useful reserved for the specific case where a password is known or suspected ' +
        'to be compromised. And it recommends SUPPORTING PASSWORD MANAGERS, including allowing ' +
        'paste into password fields, because blocking paste does not stop people using a manager, ' +
        'it just pushes them back toward memorising something short enough to type, which is ' +
        'worse.\n\n' +
        'What current guidance has moved away from is mandatory complexity rules and routine ' +
        'expiry, the two things that used to define a "strong" password policy. Complexity rules ' +
        'mostly produce Password1! and its close relatives rather than genuinely random strings, ' +
        'because humans satisfying a rule under pressure tend to do the minimum the rule demands. ' +
        'Both complexity and expiry feel rigorous, in the sense that they are annoying and visible, ' +
        'and that feeling is exactly the trap: a control that inconveniences users is not ' +
        'automatically an effective one, and this is one of the clearest cases in the whole field ' +
        'where the two have come apart.',
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
      'A, B, C, and D are the four pieces of current guidance: length over composition, screening ' +
      'against breached passwords, dropping routine expiry, and supporting password managers ' +
      'including paste. E is the familiar policy most organisations still run, and it is ' +
      'counterproductive on both halves at once: complexity rules push people toward predictable ' +
      'substitutions like swapping an "a" for an "@", which attackers already account for, and ' +
      'routine expiry produces incrementing suffixes, so an attacker who has last quarter\'s leaked ' +
      'password can often guess this quarter\'s by trying the obvious next number. Both rules feel ' +
      'rigorous because they are visible and mildly painful, and both trade real security for the ' +
      'appearance of it.',
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
      'This is a rare chance to be the person who removes a control everybody hates and makes ' +
      'security better in the same move. Bring the actual guidance with you when you propose it, ' +
      'because dropping expiry in particular tends to sound reckless to somebody who has not seen ' +
      'the reasoning, and you will be asked to justify it.',
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
        'So far this module has been about proving who somebody is at the moment they log in. ' +
        'CONDITIONAL ACCESS adds a second layer on top of that: even after somebody proves who they ' +
        'are, the system looks at the circumstances of that particular sign-in, which device it is ' +
        'coming from, roughly where in the world it is coming from, and how risky it looks compared ' +
        'to that person\'s usual pattern, and can demand more proof or block it outright based on ' +
        'what it sees. Think of it as a security desk that does not just check your ID, it also ' +
        'notices you are trying to badge in through a door you have never used before, at three in ' +
        'the morning, and asks a follow-up question before letting you through.\n\n' +
        'Used well, this removes friction from the ordinary, low-risk logins that make up almost ' +
        'all sign-in traffic, and adds it exactly where something looks unusual. Sound examples ' +
        'include requiring a managed, company-issued and policy-compliant DEVICE before allowing ' +
        'access to the most sensitive applications, which is one of the strongest controls ' +
        'available precisely because a physical device is genuinely hard for a remote attacker to ' +
        'steal or fake. Requiring stronger authentication specifically for privileged ROLES, such as ' +
        'administrators, rather than applying the same bar to everyone regardless of what they can ' +
        'do, concentrates the friction where the consequence of getting it wrong is largest. ' +
        'Stepping up the authentication requirement when RISK SIGNALS fire, such as a sign-in that ' +
        'would require physically impossible travel from the previous one, or a device and location ' +
        'the account has never used before, catches genuine anomalies without punishing everyone. ' +
        'And blocking legacy authentication protocols that were built before MFA existed and simply ' +
        'cannot carry a second factor at all is often the single highest-value rule available, ' +
        'because it closes a door that skips every other control entirely.\n\n' +
        'The blind spot is treating LOCATION as though it were the same thing as identity. Blocking ' +
        'sign-ins from countries a company does not operate in stops some opportunistic, low-effort ' +
        'attacks, and it stops essentially nothing from a determined attacker, because routing ' +
        'traffic through a proxy server or a compromised machine sitting inside the allowed country ' +
        'costs very little effort. Geographic blocking is a filter that reduces noise, not a ' +
        'control that establishes trust, and the danger is in calling it a control: doing so leads ' +
        'people to believe a real gap is covered when it is not, and to leave the actually ' +
        'meaningful protections, device compliance, role-based strength, legacy protocol blocking, ' +
        'less prioritised than they should be.',
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
      'A, B, C, and D are all sound, targeted uses of conditional access: device compliance for the ' +
      'most sensitive applications, stronger authentication concentrated on privileged roles, ' +
      'stepping up when a genuine risk signal fires, and killing legacy authentication protocols, ' +
      'which is frequently the single highest-value rule in the whole policy set because it closes ' +
      'a door every other control gets skipped through. E is the blind spot the exercise is testing ' +
      'for: country-based conditions filter out opportunistic, low-effort noise and are trivially ' +
      'bypassed by anyone routing through a proxy or a compromised machine inside the allowed ' +
      'country, so treating a permitted location as a reason to relax other controls does not add ' +
      'safety, it converts an already-weak filter into an actual hole in the policy.',
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
      'If you inherit an unfamiliar estate and can only make one change in your first week, look ' +
      'for legacy authentication protocols still enabled somewhere. They bypass MFA entirely by ' +
      'design, and turning them off tends to close more real risk than most multi-month projects ' +
      'manage.',
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
        'It helps to start by taking the executive\'s question seriously rather than treating it as ' +
        'resistance. They already funded MFA once, it was a genuine improvement over passwords ' +
        'alone, and asking what additional money actually buys on top of that is exactly the right ' +
        'question for someone responsible for the budget to ask. The job here is to answer it ' +
        'precisely, not to make them feel behind for asking.\n\n' +
        'The case rests on one specific, demonstrable gap rather than a vague sense that more ' +
        'security is always better. As the earlier exercise in this module covered, a code the user ' +
        'reads out or a push notification they approve can be relayed by an attacker sitting ' +
        'between the user and the real site, in real time, and this is now a routine, commodity ' +
        'attack that criminal groups run at scale rather than something only a nation-state could ' +
        'pull off. The critical detail to land is that the user does nothing obviously careless in ' +
        'this scenario: they approve a login screen that looks completely normal, believing they ' +
        'are the one who started it.\n\n' +
        'A security key or a passkey removes that entire class of attack, not by being a stronger ' +
        'version of the same code-based approach, but by working differently in kind: the proof it ' +
        'produces is cryptographically tied to the exact site being visited, and a browser will not ' +
        'hand that proof to a lookalike domain no matter how convincing the copy is. That ' +
        'distinction, a different kind of protection rather than a stronger dose of the same one, ' +
        'is the strongest single argument available, because it explains precisely why the money ' +
        'already spent was not wasted and precisely why more is still needed.\n\n' +
        'Then be practical about scope, because a proposal that sounds enormous gets deferred ' +
        'regardless of how sound the reasoning is. Rolling security keys out to everyone at once is ' +
        'expensive and slow to execute; starting with administrators, finance, and executives ' +
        'covers the accounts an attacker would most want to compromise, for a small fraction of the ' +
        'cost of a company-wide rollout, and a phased plan like that is far more likely to actually ' +
        'get approved in the room than an all-or-nothing ask.',
    },
    hints: [
      'Do not argue that the current MFA is bad. Name the specific attack it does not stop.',
      'Why can a security key not be handed to a fake site?',
      'A good answer names relay or phishing of the current MFA, explains that a key is bound to the real site and so cannot be relayed, and proposes starting with privileged and high-value accounts.',
    ],
    solution:
      'The MFA we already have was a real improvement over passwords alone, and it genuinely does ' +
      'not stop the attack we are most likely to see now: an attacker running a fake login page ' +
      'relays whatever the user types or approves straight through to the genuine site in real ' +
      'time, so a valid code or a tapped approval completes the attacker\'s sign-in rather than the ' +
      'real user\'s, and the user never realises anything went wrong. A security key or passkey ' +
      'removes that whole class of attack, not by being a stronger code, but because the credential ' +
      'it produces is cryptographically bound to the exact site actually being visited, and the ' +
      'browser itself will not release that proof to a lookalike domain no matter how convincing it ' +
      'looks. That is a different kind of protection, which is why I am not proposing we buy one ' +
      'for everybody at once: starting with administrators, finance and the executive team covers ' +
      'the accounts an attacker would most want to compromise, for a small fraction of the cost of ' +
      'a full rollout, and we can extend from there once the process is proven to work.',
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
      'The phasing sentence is what actually gets a proposal like this funded. An all-or-nothing ' +
      'ask covering the whole workforce tends to get deferred to next year\'s budget cycle; a ' +
      'proposal covering the fifty accounts that genuinely matter most gets approved in the same ' +
      'meeting it is raised in.',
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
        'SINGLE SIGN-ON is the experience of logging into one thing and then opening a dozen other ' +
        'applications without being asked for a password again. It feels almost magical the first ' +
        'time you notice it, so it is worth understanding the actual mechanism underneath, because ' +
        'that mechanism is what explains both its biggest benefit and its biggest risk.\n\n' +
        'Underneath, it works as a redirect and a signed note passed between two parties, and the ' +
        'shape is worth learning once because it applies across almost every implementation you ' +
        'will encounter, even though the technical names for the pieces vary. The application you ' +
        'are trying to use, sometimes called the RELYING PARTY or SERVICE PROVIDER, does not check ' +
        'your password itself at all. Instead, when you try to sign in, it sends your browser away ' +
        'to a separate system, the IDENTITY PROVIDER, essentially saying "go prove who you are over ' +
        'there, and come back and tell me." The identity provider either recognises that you ' +
        'already have a valid session from earlier, or asks you to authenticate now, and then sends ' +
        'your browser back to the original application carrying a signed message: this is who this ' +
        'user is, they authenticated this way, at this time, with these attributes. Think of it as ' +
        'a bouncer at one club who, instead of checking your ID directly, sends you to a trusted ' +
        'friend\'s booth down the street, and lets you back in the moment you return holding a note ' +
        'that friend signed. The application checks that the signature on the note is genuine and, ' +
        'if so, creates its own local session for you.\n\n' +
        'Three consequences follow from that shape, and they explain most of what matters about ' +
        'single sign-on in practice. First, the application never actually sees your password, ' +
        'which is most of the security benefit: a flaw or a breach in that one application cannot ' +
        'leak a password it was never handed in the first place. Second, the application trusts the ' +
        'identity provider completely and unconditionally, which means anything capable of ' +
        'producing a validly signed note, whether that is the real provider or an attacker who has ' +
        'compromised it, can claim to be anybody at all. Third, the session the application creates ' +
        'for you is SEPARATE from the session you hold with the identity provider itself, which is ' +
        'why signing out of one application does not necessarily sign you out of the identity ' +
        'provider or any other application, and why a session an attacker has already stolen from ' +
        'one application can keep working even after your main password gets reset, because ' +
        'resetting the password only affects the identity provider\'s side of things.',
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
      'A, B, C, and D describe the actual sequence: the application redirects the browser elsewhere ' +
      'rather than checking a password itself, the identity provider returns a signed assertion ' +
      'vouching for who the user is, the application checks that signature and builds its own local ' +
      'session from it, and the application never once sees the password itself. E describes ' +
      'precisely the thing federation was invented to eliminate: under federation the application ' +
      'never handles the credential at all, which is exactly why a compromised or badly written ' +
      'application cannot leak passwords it was never given, and why adopting federation reduces ' +
      'risk immediately, before a single additional control such as MFA or conditional access is ' +
      'layered on top.',
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
      'The two-session detail is the one that matters most once you are actually operating this ' +
      'rather than just describing it. Disabling an account at the identity provider stops new ' +
      'sign-ons from succeeding, and it does not automatically end sessions an application already ' +
      'established earlier, which is exactly why forcing a sign-out has to be its own separate, ' +
      'deliberate action in a leaver process rather than something you can assume disablement ' +
      'covers for free.',
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
        'Once you have successfully proven who you are, logging in again for every single click ' +
        'would be unbearable, so systems issue you a SESSION TOKEN, a small piece of data your ' +
        'browser holds onto that essentially says "this browser already proved it belongs to this ' +
        'user, stop asking." It is the digital equivalent of a wristband handed out at the door of ' +
        'an event once your ticket has been checked: nobody re-checks your ticket every time you ' +
        'walk past a different room, they just glance at the wristband.\n\n' +
        'That convenience is also exactly what makes stealing a session token so valuable to an ' +
        'attacker, and session theft has become one of the most common ways corporate accounts ' +
        'actually get taken over today, because it walks straight past most of what an organisation ' +
        'has invested in. A session token represents authentication that has ALREADY happened. ' +
        'Presenting it does not require the password, and it does not require MFA, because both of ' +
        'those checks already occurred earlier and the token is proof they occurred. An attacker ' +
        'who steals a valid token, typically by getting malware onto a laptop that can read it out ' +
        'of the browser, is simply inside, without touching the password field or the MFA prompt at ' +
        'all. Resetting the victim\'s password afterwards does not automatically evict that attacker ' +
        'either, because the session token is a separate thing from the password, and it often ' +
        'remains valid on its own until it naturally expires or somebody explicitly revokes it.\n\n' +
        'What limits the damage a stolen token can do is BINDING and LIFETIME. A token that is tied ' +
        'to the specific device or browser that first received it, similar to a wristband printed ' +
        'with the wearer\'s photo, is much harder for an attacker to reuse somewhere else. A shorter ' +
        'lifetime shrinks the window during which a stolen token is still worth anything. And ' +
        'systems that re-check conditions periodically during a session, rather than only once at ' +
        'the original sign-in, can notice a session suddenly being used from an implausible ' +
        'location or device and cut it off mid-use.\n\n' +
        'The practical lesson for anyone responding to a suspected compromise is blunt and easy to ' +
        'forget under pressure: after a credential is compromised, revoke sessions and refresh ' +
        'tokens explicitly, as a deliberate additional step. A password reset by itself is a ' +
        'half-measure that feels complete and often is not, because it leaves the wristband the ' +
        'attacker already grabbed working exactly as before.',
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
      'A, B, C, and D describe the mechanics correctly: a token represents authentication and MFA ' +
      'that already happened, so presenting it skips both; resetting a password does not ' +
      'automatically end a live session; binding a token to a device makes it harder for an ' +
      'attacker to reuse it elsewhere; and explicit revocation is the actual fix. E is the belief ' +
      'that leaves an attacker sitting comfortably in place after everyone thinks the incident is ' +
      'closed: MFA is evaluated once, at the moment of sign-in, and a session token issued after ' +
      'that successful sign-in carries the result of that check with it from then on, so the second ' +
      'factor provides no ongoing protection whatsoever against somebody replaying a session token ' +
      'that was stolen after the fact.',
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
      'Add "revoke sessions and refresh tokens" to any account-compromise runbook you inherit, and ' +
      'check whether it is already there before assuming it is. It is the step most often missing ' +
      'from an otherwise sensible-looking process, and it is the actual difference between evicting ' +
      'an attacker and merely inconveniencing them for a moment.',
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
        'By this point in the module it should be clear that the identity provider decides who ' +
        'gets into everything, which means it is worth spending a moment on what it actually looks ' +
        'like when the worst case happens: an attacker gets administrative control over the ' +
        'provider itself. This is the single worst day in a federated estate, and it is worth ' +
        'reasoning through calmly before it ever happens, because the response is unlike almost any ' +
        'other kind of incident.\n\n' +
        'An administrator of the identity provider can do far more than just read information: they ' +
        'can create brand new identities from nothing, alter group memberships that drive ' +
        'entitlements across every application connected to the provider, weaken or exempt specific ' +
        'accounts from MFA entirely, register additional credentials such as a new authenticator on ' +
        'accounts that already exist, and in many products even add a federation trust, essentially ' +
        'telling the provider to also accept sign-in proof from somewhere else the attacker ' +
        'controls. That last one is particularly dangerous, because a trust relationship set up ' +
        'this way can survive resetting the password on every single account in the organisation, ' +
        'since it never depended on any of those passwords in the first place.\n\n' +
        'Detecting this while it is happening is genuinely hard, because every one of these actions ' +
        'is something a legitimate administrator does routinely, performed with a valid, working ' +
        'login. Nothing about the action itself looks wrong in isolation. What actually catches it ' +
        'is the identity provider\'s own audit log, which is exactly why exporting those logs ' +
        'somewhere the provider\'s own administrators cannot edit or delete is a control worth ' +
        'arguing hard for, because otherwise the only record of the attack is sitting inside the ' +
        'system the attacker controls.\n\n' +
        'Recovering from this cannot just be a password reset, however thorough. It has to be a ' +
        'review of every configuration change, every trust relationship, every credential ' +
        'registered on privileged accounts, and every entitlement granted during the window the ' +
        'attacker had access, because the attacker had the ability to quietly make themselves, or ' +
        'something they control, look completely legitimate, and a password reset does nothing to ' +
        'undo any of that.',
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
      'A, B, C, and D describe the real reach of a compromised provider administrator: granting ' +
      'entitlements across every federated application through group membership, registering extra ' +
      'credentials on existing accounts, adding federation trusts that can outlast a full password ' +
      'reset, and a recovery process built around reviewing configuration rather than just ' +
      'resetting passwords. E states the actual difficulty rather than a reassurance: these are the ' +
      'exact same actions a legitimate administrator performs every week as part of the job, so ' +
      'nothing about any single one of them looks anomalous in isolation, and detection ends up ' +
      'depending entirely on tamper-resistant logging that the attacker cannot edit, plus somebody ' +
      'actually reviewing changes made to the most sensitive configuration in the organisation.',
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
      'Send identity provider audit logs somewhere its own administrators cannot edit or delete ' +
      'them. It is a comparatively small piece of engineering to set up, and it is the only reason ' +
      'you would ever be able to reconstruct exactly what happened after an incident like this one.',
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
        'Everything covered so far in this module has assumed your own organisation runs the ' +
        'identity provider. FEDERATING WITH A THIRD PARTY means trusting somebody else\'s identity ' +
        'provider instead, or in addition, and it deserves its own care because it means accepting ' +
        'an outside organisation\'s word about who somebody is, and quietly inheriting their ' +
        'identity practices whether you have ever actually seen them or not. It is the equivalent ' +
        'of your building\'s front desk agreeing to let in anyone holding a badge issued by a ' +
        'different company\'s front desk, without ever checking how carefully that other company ' +
        'issues its badges.\n\n' +
        'Before agreeing to this, a few things are worth establishing explicitly rather than ' +
        'assuming. Their AUTHENTICATION STANDARD: if the partner does not enforce MFA on their ' +
        'side, then effectively neither do you for those users, no matter how strict your own ' +
        'written policy is, because the strength of the login that got them in front of you was set ' +
        'by them, not you. Their LEAVER PROCESS: a partner employee who has left their own ' +
        'organisation keeps whatever access you granted them until the partner gets around to ' +
        'disabling them, and you have no visibility into when, or whether, that actually happens. ' +
        'What ATTRIBUTES you are willing to trust the partner to assert about their own people, and ' +
        'specifically whether you accept a claim of group membership from them, because doing so ' +
        'effectively lets them decide what entitlements their own staff get inside your systems.\n\n' +
        'It also matters to scope the trust deliberately. Federation should reach exactly the one ' +
        'application involved in the agreement, not quietly become a general trust that extends ' +
        'further than anyone intended. Keeping your own authorisation layer on top, so that being ' +
        'authenticated by the partner still requires being separately entitled inside your own ' +
        'system, keeps the decision of who gets what firmly on your side of the boundary rather ' +
        'than handing it to somebody else\'s process.\n\n' +
        'A contractual clause requiring the partner to maintain a certain security posture is worth ' +
        'having in the agreement, and it is important to be clear-eyed that it is not a control: it ' +
        'determines who is legally on the hook after something goes wrong, and it does nothing at ' +
        'all to prevent that thing from going wrong in the first place.',
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
      'A, B, C, and D are the questions worth pinning down before agreeing to federate: their ' +
      'authentication standard, their leaver process, exactly which attributes you will trust them ' +
      'to assert, and keeping authorisation decisions on your own side of the boundary. E is worth ' +
      'having written into the contract and is not, itself, a technical control: it determines who ' +
      'is liable after something goes wrong, and it prevents absolutely nothing at the moment it is ' +
      'actually going wrong. Ask for both a solid contract and solid technical answers, and never ' +
      'let the existence of the clause become the reason the harder technical questions get ' +
      'skipped.',
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
      'The leaver question is the one nobody thinks to ask before signing, and it is exactly the ' +
      'one that produces the longest-lived unnecessary access in most estates that federate with ' +
      'partners. Agree a notification process up front, and review the partner\'s user list against ' +
      'your own systems yourself, on a fixed schedule, rather than trusting them to remember to ' +
      'tell you.',
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
        'This exercise draws together the two previous ones in this module, sessions and provider ' +
        'trust, into the single most useful thing an identity person contributes to a live ' +
        'incident, and it is usually contributed too late, once the service desk has already told ' +
        'everyone the ticket is closed.\n\n' +
        'A password reset only ever stops NEW sign-ons that would have used the old password. It ' +
        'does nothing at all to sessions the attacker already holds from before the reset, because ' +
        'as covered earlier in this module, those sessions carry the completed authentication with ' +
        'them rather than depending on the password continuing to be valid, so the attacker keeps ' +
        'working exactly as before until that specific session expires on its own or somebody ' +
        'explicitly revokes it.\n\n' +
        'A password reset also does nothing about anything the attacker ADDED while they had ' +
        'access, and this is the part that surprises people most. The two common additions are an ' +
        'extra MFA method registered on the account, which hands the attacker a durable way back in ' +
        'that survives every future password change, since the account now believes that new ' +
        'method belongs to the real user, and a mailbox forwarding rule or delegation, which ' +
        'quietly keeps copies of new mail flowing to the attacker long after the original ' +
        'break-in. Both take an attacker seconds to set up, and neither is touched even slightly by ' +
        'resetting a password.\n\n' +
        'So the honest closing checklist for an account compromise is: revoke sessions and refresh ' +
        'tokens explicitly, review every registered MFA method for anything the account owner does ' +
        'not recognise, check mail rules and delegations for anything added without their ' +
        'knowledge, and look at what the account actually accessed during the time the attacker had ' +
        'it, because that last answer decides whether this stays a closed ticket or becomes the ' +
        'start of a much bigger incident.',
    },
    hints: [
      'The reset blocks the old password. What does it not block?',
      'What could the attacker have added to the account while they were in it?',
      'A good answer names revoking sessions or tokens, and at least one thing the attacker may have registered such as an extra MFA method or a mail forwarding rule.',
    ],
    solution:
      'Resetting the password only stops anybody signing in with the old one, and it does not end ' +
      'the sessions the attacker already has, because a live session carries the completed ' +
      'authentication with it rather than checking the password again, so the attacker keeps ' +
      'working exactly as before until that session expires unless we revoke sessions and refresh ' +
      'tokens explicitly ourselves. It also does nothing about anything the attacker added while ' +
      'they were in the account, and the two common additions are registering an extra MFA method, ' +
      'which gives them a durable way back in that survives every future password change because ' +
      'the account now trusts that method as genuinely theirs, and setting a mailbox forwarding ' +
      'rule or delegation that keeps quietly sending copies of mail out. So before this is actually ' +
      'closed we need sessions and tokens revoked, the registered authentication methods reviewed ' +
      'for anything the user does not recognise and removed, and mail rules and delegations checked ' +
      'and cleared. We should also look at what the account actually accessed during the window it ' +
      'was compromised, because that answer is what decides whether this stays a closed ticket or ' +
      'becomes the start of a real incident.',
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
      'The extra MFA method the attacker registers is the one that keeps organisations quietly ' +
      'compromised for months after everyone believes the incident is over. It is completely ' +
      'invisible to a response that only thinks in terms of passwords, and it defeats every ' +
      'subsequent password reset, because the account now genuinely believes that method belongs ' +
      'to its real owner.',
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
        'So far this package has mostly asked "is this really them." This module turns to the ' +
        'second question entirely, deciding what somebody who has proven who they are should ' +
        'actually be allowed to do, and the starting point is the two dominant ways organisations ' +
        'decide that, because the argument between them matters far less in practice than doing ' +
        'either one properly.\n\n' +
        'ROLE BASED access control works the way a job title works in a well-run organisation: ' +
        'permissions are granted to a ROLE, like "finance analyst" or "warehouse supervisor," and a ' +
        'person gets those permissions simply by being assigned to that role, the same way anyone ' +
        'hired as a security guard automatically gets a set of keys that comes with the job rather ' +
        'than being handed a custom set. It is simple to explain, simple to review, and easy to ' +
        'justify to an auditor, because you can point at a role and say exactly what it grants. Its ' +
        'characteristic failure is ROLE EXPLOSION: the moment somebody needs slightly more or ' +
        'slightly less than their role provides, the easy fix is to create a new, near-identical ' +
        'role just for them, and repeated hundreds of times across an organisation this produces ' +
        'more roles than there are employees, at which point the model has stopped simplifying ' +
        'anything at all.\n\n' +
        'ATTRIBUTE BASED access control works differently: instead of a fixed role, a decision is ' +
        'calculated at the moment access is requested, based on attributes like which department ' +
        'someone is in, where they are physically located, what device they are using, how ' +
        'sensitive the specific record is, or even the time of day. It can express fine-grained ' +
        'policy that no fixed role ever could, such as "finance staff may view this record only ' +
        'from a company laptop during business hours." Its characteristic failure is the opposite ' +
        'of role explosion: because access is calculated fresh each time rather than fixed in ' +
        'advance, nobody can answer a simple question like "what can this person access" without ' +
        'running the policy against every single resource, which makes reviewing access at all ' +
        'genuinely difficult.\n\n' +
        'Most real organisations end up running a hybrid of the two: roles for the broad, ' +
        'coarse-grained grant that covers most of a job, and attributes layered on top for ' +
        'conditions and exceptions. What actually decides whether either approach works well has ' +
        'almost nothing to do with which model was chosen. It is whether anybody actually removes ' +
        'access once it is no longer needed, which is a process question rather than a modelling ' +
        'one, and it is the thread the rest of this module keeps pulling on.',
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
      'A, B, C, and D correctly describe the characteristic strength and characteristic failure of ' +
      'each model: role based access is easy to review and tends toward role explosion as ' +
      'exceptions pile up, attribute based access expresses fine-grained policy roles cannot but ' +
      'makes "what can this person access" much harder to answer, and most real estates end up ' +
      'hybrid. E is the belief that sells migration projects and fixes nothing: no access model ' +
      'removes anything on its own, because a model only decides how access is granted, not ' +
      'whether anybody ever takes it away again. Accumulation is a process problem, not a modelling ' +
      'one, and an organisation that never deprovisions will drown in entitlements no matter how ' +
      'modern or fashionable the model it switched to.',
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
      'When somebody proposes a whole model migration as the fix for entitlement sprawl, the single ' +
      'most useful question to ask is what will actually remove access afterwards. If the honest ' +
      'answer is nothing, the expensive new model will sprawl exactly the same way the old one did, ' +
      'just with different terminology.',
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
        'LEAST PRIVILEGE is a simple-sounding rule: somebody should have exactly the access their ' +
        'job needs, and no more. Almost everybody in security agrees with it in principle, and ' +
        'almost no organisation actually achieves it in practice, and the interesting question is ' +
        'why, because the reasons are structural rather than a matter of anyone being careless, and ' +
        'understanding them is more useful than repeating the rule louder.\n\n' +
        'Every pressure in a normal organisation points the same direction: toward granting and ' +
        'away from revoking. Granting access is fast and it unblocks somebody today, so it happens ' +
        'readily. Revoking access is slow and it risks breaking something tomorrow for a person who ' +
        'might genuinely still need it, so it gets put off. Nobody is ever thanked or rewarded for ' +
        'quietly removing access that turned out not to be needed, while everybody notices ' +
        'immediately if access that was needed gets removed by mistake and work grinds to a halt. ' +
        'And the person theoretically best placed to know whether someone still needs a given ' +
        'permission, their line manager, usually has no visibility at all into the long, technical ' +
        'list of things that person actually holds.\n\n' +
        'What actually works is not asking people to be stricter, it is making removal cheap and ' +
        'reversible by default, so the natural drift of the organisation points toward correctness ' +
        'instead of away from it. TIME-BOUND grants that expire automatically unless renewed flip ' +
        'the effort: instead of somebody having to notice and act to remove access, somebody has to ' +
        'notice and act to KEEP it, which is a far easier thing to enforce mechanically. Making ' +
        're-requesting access a normal, fast, self-service action means that losing access by ' +
        'mistake costs someone a few minutes rather than a day, which removes the main reason ' +
        'people hoard access defensively in the first place. And attaching access to a job role, so ' +
        'that a role change recalculates what someone holds rather than simply adding more on top, ' +
        'prevents the slow accumulation this module keeps returning to.\n\n' +
        'Least privilege enforced by asking people to be more careful fails almost everywhere it is ' +
        'tried, because it fights every incentive already described above. Least privilege enforced ' +
        'by expiry actually works, because it changes what the default outcome is: instead of ' +
        'access lingering unless somebody remembers to remove it, access disappears unless somebody ' +
        'bothers to keep it, and the correct outcome becomes the one that happens automatically.',
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
      'A, B, C, and D name the actual structural pressures: granting being faster and lower-risk ' +
      'than revoking, expiry as the mechanism that changes the default outcome, cheap re-request ' +
      'removing the reason people hoard, and line managers lacking real visibility into what their ' +
      'reports hold. E is the diagnosis that has produced a decade of failed least-privilege ' +
      'initiatives across the industry: people are behaving entirely rationally given the ' +
      'incentives actually in front of them, and a policy that asks somebody to volunteer for extra ' +
      'risk and inconvenience, with no reward for getting it right and real consequences for ' +
      'getting it wrong, will lose to the pressure to keep work moving every single time. The fix ' +
      'is changing what the default outcome is, not asking people to try harder against incentives ' +
      'that have not changed.',
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
      'Expiry is arguably the single most effective idea in this whole module, precisely because it ' +
      'does not depend on anyone remembering to do anything. Access that quietly lapses unless ' +
      'somebody actively renews it turns a housekeeping task nobody ever has time for into a ' +
      'default outcome that is simply correct on its own.',
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
        'SEPARATION OF DUTIES is the idea that certain pairs of permissions are each individually ' +
        'completely reasonable, and dangerous the moment one person holds both, because together ' +
        'they let that one person complete a harmful action from start to finish with nobody else ' +
        'ever having to be involved or notice. It is the same logic behind requiring two keys ' +
        'turned at the same time to launch something dangerous, or requiring a second signature on ' +
        'a large cheque: neither key alone does anything, and either job alone is unremarkable.\n\n' +
        'The classic financial example is one person being able to both create a new supplier in ' +
        'the system and approve payments to suppliers. Either ability by itself is an entirely ' +
        'normal part of somebody\'s job. Held together, they let one person invent a fake supplier ' +
        'and pay it, which is fraud waiting for a bad month rather than a hypothetical risk. The ' +
        'classic technical example is one person being able to both change a system and to alter or ' +
        'delete that system\'s own logs, because that combination removes the record of what was ' +
        'changed at the exact moment it matters most.\n\n' +
        'Two further combinations matter specifically in identity work. Being able to grant ' +
        'yourself access is dangerous on its own terms, which is why the ability to modify ' +
        'entitlements is normally kept separate from the ability to use them, the same way the ' +
        'person who cuts new keys for a building should not also be the one deciding they need a ' +
        'key to the vault. And being able to approve your own access requests is a control most ' +
        'approval workflow tools can technically enforce, and a surprising number of organisations ' +
        'leave switched off, usually because nobody thought to check.\n\n' +
        'Separation of duties costs real money, because it requires two people involved where one ' +
        'alone would technically be capable, so it is applied selectively, where the consequence of ' +
        'getting it wrong genuinely justifies the added friction, rather than blanket across every ' +
        'process in the company. Working out which combinations are worth that cost is a judgement ' +
        'made together with the business that owns the process, not a rule that can simply be ' +
        'imported wholesale from somewhere else.',
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
      'A, B, C, and D each let one person complete a genuinely harmful sequence from start to ' +
      'finish with nobody else involved: creating and paying a supplier, changing a system and its ' +
      'own logs, granting yourself entitlements and using them, and approving your own request. E ' +
      'describes a different concern entirely: holding broad read access to two departments\' ' +
      'reporting data might well be excessive, and if so it is a least privilege problem rather ' +
      'than a separation of duties one, because no single harmful action is completed by that ' +
      'combination, it is simply more access than the job requires. Keeping these two ideas apart ' +
      'matters in practice, because the remedies are different: separation of duties calls for a ' +
      'second person in the process, while excess access calls for removing the access altogether.',
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
      'The logs example is the finding you will make most often as a security person over an actual ' +
      'career, because administrators are very routinely given full control over the exact systems ' +
      'that record what they themselves did, usually without anyone deciding that on purpose.',
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
        'A GROUP, in most directory systems, is a named bucket of people that permissions can be ' +
        'granted to all at once, rather than one at a time. It is a genuinely useful idea when it ' +
        'is kept tidy: instead of granting a file share to fifty individual people, you grant it to ' +
        'one group and add or remove people from that group as they join or leave. Left unmanaged ' +
        'for a decade, though, groups become one of the least understood corners of most estates, ' +
        'and essentially every organisation over about ten years old ends up with thousands of ' +
        'them, nested inside each other, undocumented. This is a data problem before it is a ' +
        'security one: you cannot secure what you cannot even read.\n\n' +
        'Start by finding out what is actually USED. Groups that grant nothing at all, because the ' +
        'resource they once protected has since been retired, can usually be removed with almost no ' +
        'risk, once you can actually demonstrate that they grant nothing rather than just assuming ' +
        'it. Groups with no members left in them at all are similar. Together these two categories ' +
        'are often a large fraction of the total group count, and clearing them out is what makes ' +
        'everything else about the estate legible enough to work with.\n\n' +
        'Next, resolve NESTING, meaning groups that contain other groups, which contain other ' +
        'groups again. A group inside a group inside a group means the effective membership of the ' +
        'outer group is genuinely not what it looks like from reading the group\'s own member list, ' +
        'the same way a company org chart does not tell you who ultimately reports to whom without ' +
        'tracing every branch. Computing each person\'s EFFECTIVE ACCESS, meaning everything that ' +
        'actually reaches them once every layer of nesting is unwound, rather than reading the ' +
        'group structure and trying to guess, is the only reliable way to see what is really ' +
        'granted to anybody.\n\n' +
        'Then find OWNERS for whatever remains, because a group nobody can name an owner for cannot ' +
        'meaningfully be reviewed by anyone, and will simply be rubber-stamped in every future ' +
        'access review forever, since nobody is positioned to say whether it is still needed.\n\n' +
        'What does not work, and is worth actively guarding against, is deleting groups that merely ' +
        'look unused without first checking exactly what they grant. Directory groups get used for ' +
        'plenty of things besides access permissions, including mail distribution lists and ' +
        'software deployment targeting, and an outage caused by deleting the wrong one will get ' +
        'attributed to "security broke something" for years afterward.',
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
      'A, B, C, and D describe the actual sequence of a sound cleanup: find what grants nothing at ' +
      'all, compute effective access rather than trusting the group tree at a glance, assign an ' +
      'owner to whatever remains, and check a group\'s real purpose before ever deleting it. E is ' +
      'how a well-intentioned cleanup project turns into an actual incident: a group with only two ' +
      'members might be the one controlling access to the payroll system, or the distribution list ' +
      'the board itself uses to receive minutes, and the number of members a group has tells you ' +
      'absolutely nothing about the consequence of getting rid of it.',
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
      'Effective access per person is the single artefact worth building first in a messy estate ' +
      'like this. It answers the question everybody eventually asks, "what does this person ' +
      'actually have," it is what makes a genuine access review possible at all, and almost no ' +
      'organisation over ten years old actually has it sitting ready to hand.',
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
        'This kind of request arrives constantly in a working organisation, and both of the obvious ' +
        'responses to it are wrong in their own way. Granting full administrative access outright ' +
        'creates a standing, permanent entitlement to production for what is actually a temporary ' +
        'problem, and that entitlement rarely gets revisited or removed once the emergency passes. ' +
        'Refusing it outright leaves a genuinely urgent issue unresolved, and it teaches the ' +
        'requester exactly one lesson: next time, find a way around identity rather than through ' +
        'it.\n\n' +
        'The productive move is to separate what was ASKED for from what is actually NEEDED, which ' +
        'are usually not the same thing. They asked for administrative access, because that is the ' +
        'blunt tool they know will definitely work. What they actually need, almost always, is to ' +
        'see why something is failing, which is normally satisfied by read access to a handful of ' +
        'specific tables or to the relevant logs, a far narrower thing than full administrative ' +
        'control. Asking what they are actually trying to find out, rather than arguing about ' +
        'whether the specific permission they named should be granted, is what gets you to that ' +
        'narrower answer.\n\n' +
        'Once you know the narrower need, make the grant TIME-BOUND and VISIBLE rather than ' +
        'standing and quiet. Access that automatically expires in a matter of hours, granted ' +
        'through a path that records who approved it, when, and what was actually done with it, ' +
        'addresses the urgency of the moment without leaving behind a permanent entitlement that ' +
        'nobody will ever think to revisit.\n\n' +
        'And do all of this FAST, because speed is not a courtesy here, it is the actual mechanism ' +
        'that makes the safer path win. A narrow, appropriate grant delivered in ten minutes will ' +
        'always beat a broad, excessive one delivered in two days, in the sense that people will ' +
        'actually use the fast option. This is precisely what stops a shared admin password from ' +
        'quietly existing somewhere, because the whole reason those exist is that the official path ' +
        'was too slow to bother with.',
    },
    hints: [
      'Neither yes nor no is the right answer. What is the third option?',
      'They asked for a permission. What are they actually trying to find out?',
      'A good answer asks what they need to diagnose, offers narrower access that is time-limited and logged, and treats speed as part of the solution.',
    ],
    solution:
      'I would ask what they are actually trying to find out rather than debating the specific ' +
      'permission they named, because administrative access is the ask and seeing why something is ' +
      'failing is the underlying need, and those are usually two very different things, with the ' +
      'need typically solved by read access to specific tables or to the logs. Whatever we land ' +
      'on, I would grant it time-bound rather than standing, expiring in a matter of hours, through ' +
      'a route that records who approved it and what was actually run, so the urgency of the moment ' +
      'is met without quietly creating a permanent entitlement that nobody ever revisits ' +
      'afterward. I would also do all of this quickly, because if the sanctioned path is slower ' +
      'than just asking a colleague for the shared admin password, then the shared admin password ' +
      'is what will actually get used, official policy notwithstanding. If it genuinely does turn ' +
      'out they need broad access, that is a decision worth making explicitly and visibly with the ' +
      'data owner, rather than one I quietly refuse or quietly grant on my own.',
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
      'The point about speed is the one experienced identity people insist on above almost ' +
      'everything else in this module. Every approval process that is too slow to actually use ' +
      'creates an unofficial shadow process alongside it, and the shadow process, by definition, ' +
      'has no logging, no approval, and no visibility at all.',
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
        'JOINER-MOVER-LEAVER, often shortened to JML, is the standard name for the three moments in ' +
        'someone\'s employment where their access needs to change: arriving, changing role ' +
        'internally, and departing. Joiners and leavers get most of the attention in a typical ' +
        'organisation because they are visible events with a clear trigger: somebody arrives on ' +
        'their first day and obviously needs things to do their job, somebody departs and HR raises ' +
        'a ticket that everyone knows to act on. The MOVER case, someone changing role while ' +
        'staying at the same company, is neither visible nor clearly triggered, and it is where the ' +
        'bulk of excess access in a real organisation actually comes from.\n\n' +
        'Here is the mechanism, and it is worth understanding precisely because it is nobody\'s ' +
        'fault in particular. When somebody changes role, the new access they need gets requested ' +
        'quickly, because they genuinely cannot do the new job without it and somebody will notice ' +
        'and complain if it is missing. The old access from their previous role does not get ' +
        'removed, because nothing is blocked by it remaining, so nobody is under any pressure to ' +
        'notice, and typically nobody even owns the responsibility of checking. Do that three or ' +
        'four times over the course of somebody\'s ten-year career at one company, and you end up ' +
        'with a person holding the accumulated permissions of every job they have ever held there, ' +
        'which is the textbook insider risk profile: not because the person is untrustworthy, but ' +
        'simply because their account has become a far richer target than anyone intended.\n\n' +
        'The fix has to be structural rather than procedural, meaning it has to be built into how ' +
        'the system works rather than relying on somebody remembering to do the right thing. Access ' +
        'that is attached to a job ROLE can be RECALCULATED automatically the moment a move ' +
        'happens, so the change becomes a genuine replacement rather than an addition on top of ' +
        'what was already there. Access that was granted ad hoc, outside of any role, still has to ' +
        'be reviewed on a move, which means the move itself has to trigger something, which in turn ' +
        'means the HR system\'s record of the change actually has to reach the identity system ' +
        'promptly rather than sitting unprocessed.\n\n' +
        'There is also a genuinely legitimate reason old access sometimes needs to linger briefly: ' +
        'people hand over work to whoever is taking over their old responsibilities, and cutting ' +
        'everything off the instant the move happens can be disruptive to that handover. Time-bound ' +
        'retention of the old access, set to expire automatically in a small number of weeks rather ' +
        'than never expiring at all, handles that legitimate need honestly, without it quietly ' +
        'becoming permanent.',
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
      'A, B, C, and D describe the actual mechanism: new access is requested because work is ' +
      'blocked and old access is not because nothing is, repeated moves accumulate access across an ' +
      'entire career, recalculation is the structural fix rather than a procedural reminder, and ' +
      'time-bound retention handles a genuine handover honestly. E confuses trust in a person with ' +
      'the risk carried by their account: the person may be completely trustworthy, and their ' +
      'ACCOUNT is still a considerably richer target than any leaver\'s, because a leaver\'s account ' +
      'is disabled while this one is active, well-connected inside the organisation, and holds ' +
      'working permissions across four different departments. Least privilege was never a statement ' +
      'about anybody\'s character, it is a statement about how much damage a compromised account ' +
      'could do.',
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
      'If you can only audit one thing in a new job, pull the list of people who have changed role ' +
      'three or more times and look closely at what they currently hold. It is consistently the ' +
      'highest-yield review available in identity work, because it finds real, accumulated excess ' +
      'access almost every single time.',
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
        'Automated provisioning, meaning a system that creates and removes access automatically ' +
        'rather than a human doing it by hand every time, needs to be told, from somewhere it ' +
        'trusts completely, who actually exists and what they do. In most organisations that ' +
        'trusted source is the HR system, and leaning on it is simultaneously one of the smartest ' +
        'design decisions available and a genuine dependency worth understanding, because ' +
        'everything downstream inherits whatever HR gets right or wrong.\n\n' +
        'It works well for permanent employees, because HR typically has a record of them before ' +
        'their first day even starts, knows their department and manager from the moment they are ' +
        'hired, and usually knows their leaving date well in advance of it happening. Driving ' +
        'identity provisioning from that record means a new employee\'s accounts are genuinely ' +
        'ready on day one, and a departing employee\'s access can be disabled automatically the ' +
        'moment their last day arrives, with no human having to remember to act.\n\n' +
        'It works badly for almost everybody who is not a permanent employee, and that gap is ' +
        'exactly the finding you will make in most organisations you look at closely. CONTRACTORS ' +
        'are frequently not represented in the HR system at all, because they are procured through ' +
        'a purchasing process rather than formally employed, which means the automation that ' +
        'handles permanent staff flawlessly leaves an entire population of people managed entirely ' +
        'by hand, and very often simply forgotten when their contract ends. The same gap tends to ' +
        'affect temporary staff, interns handled locally by one team rather than centrally, and ' +
        'third-party support staff who never go through the normal hiring process at all.\n\n' +
        'Data quality inside HR matters more than most people expect, too, precisely because the ' +
        'automation trusts it completely. If a manager field is recorded incorrectly, approval ' +
        'requests route to somebody with no real basis to judge them, and they typically get ' +
        'approved anyway simply because the approver does not know enough to say no. If a leaving ' +
        'date is not updated promptly when somebody resigns earlier than originally planned, their ' +
        'access quietly continues running past their actual last day, because the automation is ' +
        'only ever as accurate as the record it was told to trust.',
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
      'A, B, C, and D describe the real shape of the dependency: it works well for permanent ' +
      'employees whom HR knows about early, contractors are frequently absent from HR entirely and ' +
      'end up managed by hand, and the accuracy of fields like manager and leaving date drives both ' +
      'who approves a request and when access actually stops. E inverts the relationship in a way ' +
      'that sounds reassuring and is not: automation makes data quality matter MORE, not less, ' +
      'because errors in the HR record now get applied consistently and immediately, rather than ' +
      'being caught by a human who happened to personally know the person and noticed something ' +
      'looked wrong. Automating a bad record does not average out to something roughly right, it ' +
      'produces wrong access reliably, every time, at speed.',
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
      'The contractor gap is the finding worth looking for first in almost any organisation you ' +
      'join. It is where the stale, forgotten, privileged accounts tend to live, including, ' +
      'deliberately, the account at the centre of the simulated intrusion elsewhere on this ' +
      'platform.',
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
        'Most people who leave an organisation do so routinely: they hand in notice, work out an ' +
        'agreed period, and the standard leaver process runs on its normal, unhurried timetable ' +
        'without anyone needing to think twice about it. A small number of departures are not ' +
        'routine at all, someone being dismissed for cause, or leaving under circumstances where ' +
        'they might react badly, and the difference in how these need to be handled has to be ' +
        'planned and agreed with HR well before the actual day arrives, because there is no time to ' +
        'work it out from scratch once it is happening.\n\n' +
        'What changes for an urgent departure, compared to a routine one, is worth being specific ' +
        'about. TIMING is coordinated precisely with the actual conversation taking place, rather ' +
        'than left to run overnight on the usual schedule, so access ends right as the conversation ' +
        'happens, not hours before, which risks tipping the person off before they have even been ' +
        'told, and not hours after, which is exactly the window where damage could be done. ' +
        'SESSIONS are explicitly revoked in addition to disabling the account, because as covered ' +
        'earlier in this module, an active session can survive an account being disabled. Anything ' +
        'only that person knows, such as a shared password or a physical key they held, is ROTATED ' +
        'or changed, because disabling their directory account does absolutely nothing about a ' +
        'password they still remember by heart. And DATA ACCESS in the period immediately before ' +
        'the departure is reviewed, because the genuinely highest-risk window is very often the ' +
        'days before the difficult conversation happens, not the hours after it.\n\n' +
        'What is never appropriate is acting on any of this on your own initiative, however ' +
        'well-intentioned. Employment matters are legally sensitive territory, and identity should ' +
        'only ever act on a clear instruction from HR with a properly agreed timetable. Disabling ' +
        'somebody\'s account because a manager mentioned something informally in a corridor is a ' +
        'fast way to end up quoted in an employment tribunal transcript, having locked out someone ' +
        'who was never actually being dismissed at all.',
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
      'A, B, C, and D describe what genuinely changes for an urgent departure: coordinating the ' +
      'exact timing with the conversation itself, revoking sessions on top of disabling accounts, ' +
      'rotating anything shared that the person still knows, and reviewing the preceding window of ' +
      'access. E is the one to refuse without exception: acting on an unconfirmed, informal report ' +
      'about a dismissal risks cutting off someone who has not actually been dismissed at all, and ' +
      'the decision to dismiss somebody is an employment matter rather than a security one, which ' +
      'belongs to HR to authorise, not to identity to infer. Having the urgent-leaver process fully ' +
      'agreed with HR in advance is what makes it possible to act fast and correctly when it is ' +
      'genuinely needed, instead of improvising on the day.',
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
      'Agree the urgent-leaver runbook with HR well before you ever actually need it, including ' +
      'exactly who is authorised to trigger it out of hours if the situation demands it. ' +
      'Improvising this process for the first time on the actual afternoon it is needed is how the ' +
      'wrong person ends up locked out of their own account.',
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
        'Every estate that has been running for a while accumulates two related but distinct ' +
        'problems, and finding and clearing them is genuinely one of the cheapest, lowest-risk ways ' +
        'to reduce real attack surface available to anybody, because it costs almost nothing to do ' +
        'and closes doors that were never being watched.\n\n' +
        'A DORMANT account is one with no recent authentication activity, essentially a login ' +
        'nobody has used in a long time. These are good candidates for disablement, and the right ' +
        'move is to disable rather than immediately delete: disablement is instantly reversible if ' +
        'it turns out to be a mistake, while deletion can break file ownership records, break ' +
        'references other systems hold to that account, and destroy evidence that might matter ' +
        'later. Giving a notice period and a straightforward way to object before disabling matters ' +
        'too, because a genuine six-month parental leave or sabbatical does exist and looks ' +
        'identical to abandonment from the outside.\n\n' +
        'An ORPHANED account, where nobody can even be identified as the current owner, is a more ' +
        'serious version of the same problem, because an account nobody owns is an account nobody ' +
        'is ever going to review, and it is frequently a service account, as covered earlier in ' +
        'this package, quietly holding more privilege than any single person in the building. The ' +
        'remedy is to actively find an owner or close the account, and the practical way to force ' +
        'that outcome is a firm deadline: an account with no claimed owner by a stated date gets ' +
        'disabled automatically, regardless of whose it might once have been.\n\n' +
        'What does not work, and causes real damage when tried, is bulk deletion based on a ' +
        'dormancy metric alone, with no further checking. Break-glass accounts, covered later in ' +
        'this package, are deliberately dormant by design and are meant to sit unused until the ' +
        'exact day everything else has failed. Disaster recovery accounts are dormant until the ' +
        'rare moment they are desperately needed. Both look exactly like an abandoned, forgotten ' +
        'account in a simple usage report, and deleting either one on that basis alone is how a ' +
        'cleanup project causes the very outage it was meant to prevent.',
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
      'A, B, C, and D describe the sound approach: disabling rather than deleting because ' +
      'disablement is reversible, giving a notice period before acting, treating unowned accounts ' +
      'as the more serious category because nobody reviews them, and using a deadline to force ' +
      'ownership to be claimed or the account closed. E will, in practice, delete the break-glass ' +
      'accounts and the disaster recovery accounts along with everything genuinely abandoned, ' +
      'because those accounts are dormant precisely because they are working exactly as designed, ' +
      'sitting unused until the specific rare moment they are needed, and you will find out they ' +
      'are gone during the exact incident where you needed one of them to still exist.',
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
      'Dormant account cleanup is one of the easiest genuine wins a new identity person can deliver ' +
      'early on, and it is also one of the fastest ways to cause an outage if the notice period and ' +
      'the exceptions for break-glass and disaster recovery accounts get skipped. Do both halves ' +
      'properly, not just the satisfying part.',
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
        'This exercise asks you to design the actual fix for the mover problem the first exercise ' +
        'in this module described, so the proposal has to solve the structural problem underneath ' +
        'it rather than simply adding one more procedural step that somebody, inevitably, will ' +
        'eventually skip under pressure.\n\n' +
        'The core idea is that a move should RECALCULATE a person\'s entitlements rather than add ' +
        'to them: access that is derived from a job role gets automatically replaced the moment the ' +
        'role changes, which handles the bulk of a typical move with no human decision required at ' +
        'all. That mechanism only works if the move actually triggers something in the identity ' +
        'system, which means HR\'s record of the role change has to reach identity promptly, so ' +
        'naming that dependency explicitly is part of a complete answer.\n\n' +
        'For access that was granted ad hoc, outside of any role, the move should instead generate ' +
        'a REVIEW addressed to the person\'s new manager, listing exactly what they currently hold, ' +
        'with removal as the DEFAULT outcome if nobody actively responds. The word default is doing ' +
        'essentially all of the work here: a default of removal, requiring action to keep ' +
        'something, produces a very different outcome from a default of keeping everything, ' +
        'requiring action to remove it, which is precisely the arrangement that produced the ' +
        'problem in the first place.\n\n' +
        'And handle the HANDOVER need honestly rather than pretending it does not exist, because it ' +
        'is the genuine, legitimate reason old access lingers in most organisations. Old access ' +
        'retained for a clearly defined, short period, and set to expire automatically rather than ' +
        'requiring anyone to remember to remove it, supports the transition people actually need ' +
        'without that retention quietly becoming permanent.',
    },
    hints: [
      'The problem is that adding is triggered and removing is not. What has to trigger removal?',
      'What should happen if the new manager does nothing at all?',
      'A good answer recalculates role-based access on the move, sends the rest for review with removal as the default, and allows a time-bounded handover period.',
    ],
    solution:
      'A move should recalculate entitlements rather than add to them: anything derived from the ' +
      'job role is replaced automatically when the role changes, which handles most of a typical ' +
      'move with no human decision required, and that mechanism depends entirely on HR role ' +
      'changes actually reaching the identity system promptly rather than sitting unprocessed. ' +
      'Whatever is left, the access that was granted ad hoc outside of any role, should generate a ' +
      'review addressed to the new manager listing exactly what the person currently holds, with ' +
      'removal as the DEFAULT outcome if nobody responds, because default-keep is precisely the ' +
      'arrangement that produced the current situation in the first place. For the genuine ' +
      'handover need, old access can be retained for a clearly defined period of a few weeks and ' +
      'then expire automatically without anyone having to remember it, so the transition is ' +
      'genuinely supported without that retention quietly becoming permanent. That way the effort ' +
      'falls on keeping access rather than on removing it, which is the same shift the least ' +
      'privilege module argued for.',
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
      'The word default is really the whole design, in this exercise and in most of this module. ' +
      'Every identity process that relies on somebody actively choosing to remove access eventually ' +
      'fails, because that choice competes with everything else on that person\'s plate; every ' +
      'process where access lapses automatically unless somebody actively chooses to keep it tends ' +
      'to work, because inaction produces the safe outcome instead of the risky one.',
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
        'STANDING PRIVILEGE means somebody holds administrative rights permanently, twenty-four ' +
        'hours a day, whether or not they happen to be using them at any given moment. It is the ' +
        'normal, default arrangement in most organisations, and it is also, once you see the ' +
        'reasoning, one of the clearest things worth changing.\n\n' +
        'The problem is genuinely simple once it is stated plainly: an account is exposed to ' +
        'compromise for every single hour it holds privilege, not only for the hours somebody is ' +
        'actively using that privilege. An administrator who genuinely needs elevated rights for ' +
        'two hours a month still has an account worth compromising for the entire month, because ' +
        'the attacker, not the administrator, gets to choose the timing of the attack. Think of it ' +
        'like leaving the keys to a building in the front door permanently, on the reasoning that ' +
        'the security guard only needs to open it twice a shift: the door being unlocked the rest ' +
        'of the time is the actual risk, regardless of how rarely the guard uses it.\n\n' +
        'JUST IN TIME access inverts that arrangement entirely: instead of holding privilege ' +
        'permanently, the rights are requested when actually needed, granted for a bounded and ' +
        'specific period, with a reason recorded at the time, and then removed automatically once ' +
        'that period ends. Exactly the same administrative work still gets done, and the window ' +
        'during which the account is worth attacking shrinks from an entire month down to a couple ' +
        'of hours. Combined with requiring approval for the most sensitive roles, this turns what ' +
        'used to be silent, invisible standing power into a visible event that somebody could ' +
        'actually review afterward.\n\n' +
        'A separate and equally important idea is SEPARATE ADMIN ACCOUNTS: the same person browses ' +
        'the web, reads email, and does ordinary daily work under their normal account, and ' +
        'performs administration under a completely different account that cannot do either of ' +
        'those ordinary things. Most administrative compromise in the real world begins with ' +
        'something mundane, a phishing email opened during ordinary browsing, and this separation ' +
        'means that even if the ordinary account is phished, the session an attacker gains never ' +
        'carries administrative rights with it.',
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
      'A, B, C, and D describe the mechanism accurately: exposure runs continuously for as long as ' +
      'privilege is held, just-in-time access shrinks the exposure window, requesting elevation ' +
      'with a recorded reason turns it into something reviewable, and separating admin accounts ' +
      'from ordinary ones breaks the usual route in through phishing. E confuses the trustworthiness ' +
      'of the person with the risk carried by the account: an experienced, trusted administrator is ' +
      'no less phishable than anyone else in practice, and the attacker is the one who picks the ' +
      'moment to strike, so how much anyone trusts the administrator personally does nothing at all ' +
      'to shrink that window. Reducing standing privilege was never a statement about anybody\'s ' +
      'competence or integrity.',
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
      'Frame this very carefully when you actually propose it to a team. Administrators reflexively ' +
      'hear "we do not trust you" the moment standing privilege is mentioned, and the honest, ' +
      'accurate answer is that the control has nothing to do with them personally, it is entirely ' +
      'about the possibility of their account being stolen by somebody else.',
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
        'BREAK-GLASS ACCOUNTS take their name from the emergency glass box on a wall holding a fire ' +
        'alarm lever: something nobody touches under normal circumstances, kept ready for the one ' +
        'day everything else has already failed. In identity terms, they exist for the day the ' +
        'identity provider itself is down, the MFA service is broken, or an administrator has ' +
        'somehow locked everybody out, including themselves. They are a deliberate, carefully ' +
        'designed exception rather than something that should ever be allowed to just accumulate ' +
        'informally.\n\n' +
        'What actually makes a break-glass account work when it is genuinely needed comes down to ' +
        'a handful of specific choices. It must NOT DEPEND on the systems most likely to be the ' +
        'ones that have failed, which usually means deliberately excluding it from the normal ' +
        'conditional access policies and from the regular MFA service, because an emergency ' +
        'account that itself requires the exact system that just broke is not really an emergency ' +
        'account at all, it is just a normal account with an optimistic label. Its credentials are ' +
        'stored PHYSICALLY, often split across more than one person or location, in a safe, with a ' +
        'clearly documented process for retrieving them when actually needed. Its use is ALARMED ' +
        'loudly: any authentication using one of these accounts should page somebody immediately, ' +
        'because there are only two possibilities when it happens, either a genuine emergency is ' +
        'unfolding or something has gone very badly wrong, and both deserve immediate attention. ' +
        'And it is TESTED periodically, because an emergency credential nobody has ever actually ' +
        'tried using is not a safety net, it is a hypothesis that happens to look reassuring on ' +
        'paper.\n\n' +
        'What breaks a break-glass account is treating it like any other normal account out of a ' +
        'misplaced sense of consistency. Applying the standard MFA policy to it defeats the entire ' +
        'reason it exists, since the standard MFA service is exactly the kind of thing that might ' +
        'be down on the day it is needed. Leaving it out of ordinary monitoring, on the other hand, ' +
        'turns it into an unwatched, permanent backdoor that nobody would notice being misused.',
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
      'A, B, C, and D describe what a working break-glass design actually requires: independence ' +
      'from the systems most likely to fail, physical custody of the credentials, loud alerting on ' +
      'any use, and periodic testing to confirm it genuinely works. E defeats the entire purpose of ' +
      'having one at all: if the break-glass account requires the MFA service to authenticate, it ' +
      'becomes useless on precisely the day the MFA service is the thing that has failed, which is ' +
      'the exact scenario it was created for. The exception these accounts represent is a ' +
      'deliberate one, and the compensating control that keeps it safe is that their use is made ' +
      'extremely visible, not that they are protected in exactly the same way as everything else.',
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
      'Test them, on a real schedule, not just once when they are first set up. Every organisation ' +
      'that has ever genuinely needed a break-glass account and discovered the recorded password ' +
      'was wrong, the account had silently expired, or nobody remembered the safe combination, ' +
      'learned that lesson the same way: by needing it during an actual emergency and finding it ' +
      'did not work.',
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
        'Go back to the very first exercise in this whole package for a moment: ACCOUNTING, the ' +
        'record of what an identity actually did, was one of the four separate jobs identity is ' +
        'meant to provide. A shared account, where several real people all know and use the same ' +
        'login, destroys accounting completely. When six people know one password, the audit log ' +
        'faithfully records that the account did something, and it has no way at all to say which ' +
        'of the six people actually did it, which means no individual action can ever be ' +
        'attributed, and no single person can be cleanly removed from access without disrupting the ' +
        'other five who still need it.\n\n' +
        'Sometimes the underlying system genuinely offers no better option, usually because it is ' +
        'old enough that it was never built to support individual logins for each person, and in ' +
        'that case the answer is to build attribution back in around the outside of it rather than ' +
        'pretending the problem does not exist. A PASSWORD VAULT that checks the shared credential ' +
        'out to one named person at a time, automatically rotates it afterward, and records exactly ' +
        'who held it and when, restores most of the missing accountability without requiring any ' +
        'change to the legacy system itself. SESSION RECORDING through a jump host, a machine that ' +
        'all access is routed through and that records what happens, achieves much the same thing ' +
        'from the opposite direction.\n\n' +
        'And the shared credential has to be ROTATED whenever anyone who knew it departs, because a ' +
        'shared password is something everyone who ever used it simply KNOWS, and disabling that ' +
        'one person\'s directory account does absolutely nothing about a password sitting in their ' +
        'memory that still works perfectly well.\n\n' +
        'What does not work at all is a blanket policy simply banning shared accounts on a system ' +
        'that has no real alternative to offer. The shared account will continue to exist ' +
        'regardless of the policy, because people still have a job to do, and a ban only guarantees ' +
        'that it now exists completely undocumented and unmanaged rather than openly acknowledged ' +
        'and controlled.',
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
      'A, B, C, and D describe the actual problem and the actual remedies: audit logs recording ' +
      'only the account rather than the person, a checkout vault and session recording as ways to ' +
      'reintroduce attribution, and rotation whenever a holder departs. E is the policy that ' +
      'reliably produces undocumented shared accounts: banning the arrangement on a system that ' +
      'genuinely supports nothing else does not make the shared account disappear, it only removes ' +
      'the official record that it exists, and the organisation ends up carrying exactly the same ' +
      'underlying risk with no inventory of it at all. The better path is to permit it openly, ' +
      'control it with a vault or equivalent, and set a firm date for replacing the legacy system ' +
      'that made it necessary in the first place.',
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
      'The vault checkout pattern is the practical answer here and it is genuinely cheap to ' +
      'implement. It converts an unattributable shared password into a logged, automatically ' +
      'rotating, named checkout, and it does all of that without requiring a single change to the ' +
      'legacy system underneath it.',
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
        'This exercise pulls together nearly everything the module has covered so far and points ' +
        'it at one specific, small group of accounts: the administrators of the identity provider ' +
        'itself. As an earlier exercise in this module established, these accounts can grant ' +
        'access, revoke it, and effectively impersonate anyone across every single application ' +
        'federated to the provider, which makes them the single most consequential accounts ' +
        'anywhere in the organisation. They genuinely deserve a level of control that would be ' +
        'excessive and unreasonable to apply anywhere else.\n\n' +
        'PHISHING-RESISTANT AUTHENTICATION without any exception whatsoever, because a relayed code ' +
        'accepted on one of these accounts, as the earlier module on authentication covered, is not ' +
        'a minor incident, it is a total compromise of everything the provider touches. DEDICATED ' +
        'ACCOUNTS that are never used for reading mail or ordinary web browsing, so that the usual, ' +
        'mundane route an attacker takes in through phishing never actually reaches them. Ideally, ' +
        'PRIVILEGED WORKSTATIONS as well, meaning administration is carried out from a hardened, ' +
        'purpose-built machine that never does any general-purpose work at all, and so has a far ' +
        'smaller chance of ever being compromised.\n\n' +
        'JUST IN TIME elevation with approval required, so that the role is held only for the ' +
        'duration of a specific task rather than sitting there permanently, exactly as covered ' +
        'earlier for standing privilege generally, but applied here with the least tolerance for ' +
        'exception anywhere in the organisation. And TAMPER-RESISTANT LOGGING exported somewhere ' +
        'outside the provider itself, because otherwise an administrator with full control of the ' +
        'provider can quietly alter the very record of what they did, leaving no reliable trail ' +
        'behind at all.\n\n' +
        'The mistake to actively avoid is exempting these particular people from the controls for ' +
        'the sake of convenience. These are precisely the people most likely to find repeated MFA ' +
        'prompts genuinely annoying, most technically able to quietly configure an exemption for ' +
        'themselves, and most catastrophic of all to lose to an attacker. Exemptions granted ' +
        'quietly to senior administrators, usually meant kindly and never written down as a formal ' +
        'decision, are a recurring feature of real breach investigations.',
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
      'A, B, C, and D describe the specific controls that genuinely belong on these accounts: ' +
      'phishing-resistant authentication with no exceptions, dedicated accounts kept separate from ' +
      'ordinary use, temporary rather than standing elevation, and audit logs stored somewhere the ' +
      'administrator cannot reach and alter. E is the specific failure that shows up again and ' +
      'again in real incident write-ups: the exemption gets granted for convenience to precisely ' +
      'the person whose compromise would be the worst possible outcome, and understanding the risk ' +
      'intellectually does not actually reduce it one bit once the exemption is in place. If the ' +
      'standard controls are genuinely too painful for administrators to live with day to day, the ' +
      'right response is to fix the pain, perhaps by making elevation faster or the workflow ' +
      'smoother, rather than to quietly reduce the coverage.',
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
      'Check for exemptions like this in your very first week anywhere new. They are almost never ' +
      'written down as a deliberate, documented decision, they are configured quietly by somebody ' +
      'trying to be helpful, and once found, they are consistently the shortest possible path to ' +
      'the entire estate an attacker could ask for.',
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
        'This proposal lands badly, almost every time, when it sounds like distrust, and ' +
        'administrators hear that meaning first, because it genuinely is what the change implies ' +
        'about them if you frame it carelessly or lead with policy language instead of the actual ' +
        'reasoning.\n\n' +
        'Lead with the ACCOUNT rather than the person, as the earlier exercise on standing ' +
        'privilege in this module explained: the real risk is that their account gets stolen by ' +
        'somebody else, and while they hold permanent administrative rights, an attacker who steals ' +
        'that account gets to choose the timing of the attack freely, rather than being confined to ' +
        'the hours the real administrator happens to be actively working. That framing is factually ' +
        'true, and critically, it is not a statement about their competence or trustworthiness as a ' +
        'person.\n\n' +
        'Then acknowledge the FRICTION this change genuinely creates, honestly and up front, ' +
        'because pretending the change is free of any cost is how you lose credibility fast with ' +
        'the people who will actually feel that cost every single day. Commit to something ' +
        'concrete: making elevation fast, self-service, and available at any hour without waiting ' +
        'on anybody else\'s approval, because a process that gets in the way of a genuine outage ' +
        'response will simply be worked around by the people who need to fix the outage, and ' +
        'honestly, it should be.\n\n' +
        'And offer something back in return, not just a restriction: elevation records give ' +
        'administrators actual evidence of exactly what was done and when, which protects them ' +
        'personally the next time something breaks in production and somebody starts asking who ' +
        'changed what.',
    },
    hints: [
      'They will hear distrust. What is the honest framing that is not about them?',
      'What is the objection they will actually raise, and what do you owe them in return?',
      'A good answer frames it as the account being stolen rather than the person being doubted, and commits to elevation being fast and available out of hours.',
    ],
    solution:
      'This is not about whether I trust you, it is about what happens the day one of your accounts ' +
      'gets stolen by somebody else: while the rights are held permanently, an attacker who gets in ' +
      'at three in the morning has exactly the same power you do at that moment, and they are the ' +
      'ones who get to pick the timing, rather than being limited to the hours you are actually ' +
      'sitting at your desk working. Moving to elevation on request shrinks that window of exposure ' +
      'from always to the length of a single task, and it is genuinely the single biggest risk ' +
      'reduction available to us here without touching anything else about how the team works. I ' +
      'know it adds friction, so the commitment I am making back to you is concrete: elevation is ' +
      'self-service, takes under a minute, and works at three in the morning without anybody having ' +
      'to be woken up to approve it, because a process that gets in the way of an actual outage ' +
      'response deserves to be worked around rather than obeyed. It also gives you a clear record ' +
      'of exactly what was elevated and why, which is genuinely useful to have the next time ' +
      'something breaks in production and somebody starts asking who changed what.',
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
      'The out-of-hours commitment is the single detail that actually decides whether a proposal ' +
      'like this succeeds or quietly dies. Any privileged access process that genuinely cannot be ' +
      'used at three in the morning during a real outage will earn itself a standing exemption ' +
      'within a month, negotiated informally, and the whole careful design will have been for ' +
      'nothing.',
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
        'An ACCESS REVIEW, sometimes called a recertification, is the process of periodically ' +
        'asking somebody, usually a manager, to look at what their team currently has access to and ' +
        'confirm whether each item is still actually needed. It is the control an external auditor ' +
        'almost always asks to see evidence of, and in practice it is very often theatre: a form ' +
        'that gets filled in and approved without anyone genuinely deciding anything. Understanding ' +
        'precisely why that happens is far more useful on the job than simply being frustrated by ' +
        'it.\n\n' +
        'Four separate pressures combine to produce this outcome, and each is worth naming. VOLUME: ' +
        'a manager with fifteen direct reports, each holding around forty separate entitlements, is ' +
        'effectively being asked to make roughly six hundred individual decisions in one sitting, ' +
        'and nobody does that many decisions carefully in a single afternoon squeezed between ' +
        'meetings. UNINTELLIGIBILITY: entitlements are usually presented as raw technical group ' +
        'names that mean genuinely nothing to the person being asked to approve them, so the honest ' +
        'answer to most lines on the form is simply "I do not know what this is." ASYMMETRIC RISK: ' +
        'approving something is completely safe from the manager\'s point of view, while revoking ' +
        'something risks breaking a colleague\'s work and generating an angry complaint, so every ' +
        'incentive in the room points toward clicking approve. And NO CONSEQUENCE: nobody ever ' +
        'checks the actual quality of a completed review afterward, so approving everything without ' +
        'reading any of it produces exactly the same visible outcome as reading everything ' +
        'carefully, which means there is no real reward for doing the harder thing.\n\n' +
        'The fixes follow directly from that diagnosis rather than from simply asking people to try ' +
        'harder. Review LESS, but more often, deliberately targeting privileged and unusual access ' +
        'rather than the entire estate at once. Describe entitlements in plain business language a ' +
        'manager can actually understand, rather than in raw technical group names. Show usage data ' +
        'alongside each line, because "this has not been used in six months" turns an impossible ' +
        'judgement call into an easy, obvious decision. And sample completed reviews for quality ' +
        'afterward, so that genuine care becomes at least visible and worth something.',
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
      'A, B, C, and D name the four real pressures driving the outcome: an overwhelming volume of ' +
      'decisions, entitlements described in language nobody understands, an asymmetric incentive ' +
      'that rewards approving and punishes revoking, and no consequence at all for a careless ' +
      'review. E is the response that has been tried at almost every organisation that has this ' +
      'problem and has changed essentially nothing: the managers are behaving entirely rationally ' +
      'given exactly what they are shown and exactly how long they are given to look at it, and a ' +
      'reminder email about their responsibilities does not alter a single one of those underlying ' +
      'conditions. Fix the review itself, not the reviewer\'s supposed lack of diligence.',
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
      'Adding usage data next to each entitlement is arguably the single highest-value change ' +
      'available here. The sentence "this person has not used this in eight months" converts what ' +
      'was an impossible, uninformed judgement call into an obvious, easy decision, without ' +
      'requiring the manager to understand anything about what the entitlement technically does.',
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
        'There is an important difference between a control EXISTING, meaning a process is ' +
        'documented and could theoretically run, and a control OPERATING, meaning it actually ran, ' +
        'on real data, with real decisions made and real actions taken as a result. An external ' +
        'auditor is specifically testing the second thing, and the evidence you provide has to ' +
        'demonstrate the whole chain from start to finish, not just that a review meeting was ' +
        'scheduled.\n\n' +
        'That means the evidence needs to include: the POPULATION that was reviewed and exactly how ' +
        'it was derived, so that completeness can genuinely be tested and it is clear nothing was ' +
        'quietly left out of scope without anyone noticing. The DECISIONS that were actually made, ' +
        'by whom specifically, and when. The ACTIONS that followed any decision to revoke access, ' +
        'with concrete evidence that the access was actually removed afterward, which is, in ' +
        'practice, the single step most likely to quietly fail. And any EXCEPTIONS, recorded with a ' +
        'stated reason and a named owner, because a review where absolutely everything was approved ' +
        'needs to be able to explain why that happened rather than simply presenting the number.\n\n' +
        'The gap auditors find most often, across almost every organisation, sits between decision ' +
        'and action: a manager decides to revoke somebody\'s access, a ticket gets correctly raised ' +
        'to reflect that decision, and nobody ever actually confirms afterward that the access was ' +
        'removed. A review that makes good decisions and never verifies they were carried out is a ' +
        'paperwork exercise dressed up as a control, and it fails on both counts at once, because ' +
        'the auditor eventually writes up the gap and the access, despite everyone\'s good ' +
        'intentions, is still sitting there.',
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
      'A, B, C, and D describe the actual chain of evidence an auditor needs: the population ' +
      'reviewed, the decisions made and by whom, proof the resulting actions were completed, and ' +
      'any exceptions with a reason attached. E is simply an assertion that the control operated, ' +
      'which is precisely the thing the auditor is trying to establish independently through ' +
      'evidence, so a signed statement by itself proves nothing at all no matter how confidently it ' +
      'is worded. C is the piece worth building deliberately and checking for specifically: the gap ' +
      'between deciding to revoke something and the access actually being removed is where most ' +
      'reviews genuinely fail in practice, and it fails silently, with nobody noticing until an ' +
      'auditor or an incident finds it.',
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
      'Close the loop from decision to removal automatically wherever you technically can. That ' +
      'single piece of engineering is the actual difference between a review that genuinely reduces ' +
      'access in the organisation and one that simply produces a spreadsheet nobody ever checks ' +
      'against reality.',
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
        'Reviewing literally everything, badly, is genuinely worse than reviewing a careful tenth ' +
        'of it well, because the first produces FALSE ASSURANCE, a comforting sense that access has ' +
        'been checked when it really has not been, while the second produces real decisions that ' +
        'actually mean something.\n\n' +
        'Prioritise by CONSEQUENCE first, and by ANOMALY second. Privileged and administrative ' +
        'entitlements come first in the queue, because their blast radius, the scope of damage if ' +
        'they are misused or compromised, is by far the largest. Access to regulated or genuinely ' +
        'high-value data comes next, for the same underlying reason plus a separate legal ' +
        'obligation to actually demonstrate that access is controlled. Then the anomalies: people ' +
        'whose access looks markedly different from their peers doing the same job, which surfaces ' +
        'both accumulation from past roles and simple data-entry error, and entitlements that have ' +
        'not been used in a long time, which cost almost nothing to remove and carry real, if ' +
        'quiet, risk while they sit there unused.\n\n' +
        'Movers, as the earlier module on the joiner-mover-leaver lifecycle established, deserve ' +
        'their own dedicated pass in a review, because they are specifically where accumulated ' +
        'excess access tends to originate in the first place.\n\n' +
        'What to actively deprioritise, and remove from the review altogether where possible, is ' +
        'the large, low-consequence bulk: everybody in the company having read access to the ' +
        'intranet is not worth a single minute of a manager\'s attention, and including it anyway ' +
        'is exactly what creates the volume problem from the previous exercise, the one that trains ' +
        'reviewers to approve every line without reading, including the genuinely important ' +
        'administrative ones sitting three pages further down.',
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
      'A, B, C, and D describe the correct priority order: consequence first, through privileged ' +
      'access and regulated data, then anomaly, through peer comparison and disuse. E is the ' +
      'material worth actively stripping OUT of a review rather than prioritising: it affects ' +
      'everybody equally, revoking it changes essentially nothing, and its sheer volume is ' +
      'precisely what trains reviewers to click approve on every line without reading, including ' +
      'the genuinely consequential administrative ones sitting a few pages further down the same ' +
      'list. Removing it from the review actually improves the review, rather than merely ' +
      'shortening it.',
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
      'Peer comparison is underused across the industry and it is genuinely effective when it is ' +
      'used. Somebody whose access is a clear outlier compared to eleven peers doing the same job ' +
      'is either a data entry error or a real story worth understanding, and either way it is worth ' +
      'thirty seconds of an actual manager\'s attention, which is not true of most of what gets put ' +
      'in front of them.',
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
        'As is true almost everywhere in an organisation, a metric functions as an instruction ' +
        'whether anyone intends it that way or not: whatever gets measured and reported upward is ' +
        'what people quietly start optimising for, sometimes at the expense of the thing the metric ' +
        'was actually meant to track. So the real question worth asking about any proposed metric ' +
        'is what it would actually make people do if they were judged on it.\n\n' +
        'Good metrics point directly at real-world outcomes rather than at activity. TIME FROM ' +
        'DEPARTURE TO ACCESS ACTUALLY REMOVED measures the leaver risk this package has returned to ' +
        'repeatedly, directly and honestly, and it is uncomfortable to look at in exactly the ' +
        'useful way, because a bad number cannot hide behind good intentions. PROPORTION OF ' +
        'PRIVILEGED ACCESS HELD JUST IN TIME rather than permanently measures real progress on the ' +
        'single biggest exposure covered in the earlier module on privileged access. COVERAGE OF ' +
        'PHISHING-RESISTANT AUTHENTICATION specifically on privileged accounts measures the one ' +
        'control that matters most for the accounts that matter most. And the COUNT OF ACCOUNTS ' +
        'WITHOUT A NAMED OWNER measures the exact thing that makes every single other control on ' +
        'this list unenforceable in practice.\n\n' +
        'A genuinely bad metric is simply the count of entitlements reviewed. It rewards putting ' +
        'more lines in front of a manager, and putting more lines in front of a manager produces ' +
        'exactly the rubber-stamping the earlier exercises in this module described in detail. It ' +
        'stays popular anyway because it is trivially easy to collect and it reliably goes up over ' +
        'time, which, worryingly, is the general profile of most genuinely harmful metrics.',
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
      'A, B, C, and D are all good metrics because each one points directly at a real outcome: ' +
      'leaver latency, the shrinking proportion of standing privilege, coverage of strong ' +
      'authentication where it matters most, and account ownership. E is the one worth arguing ' +
      'against whenever it comes up: it improves simply by reviewing more lines in front of ' +
      'managers, which is exactly the behaviour that makes reviews meaningless in the first place, ' +
      'so this specific metric can rise steadily every quarter while the actual control it is ' +
      'supposed to represent quietly degrades underneath it. If access review absolutely has to be ' +
      'measured at all, measure the actions that followed a decision rather than the raw number of ' +
      'lines shown to a reviewer.',
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
      'Leaver latency is the metric worth introducing first in any organisation that has none of ' +
      'this yet. It is easy to compute from data that already exists, genuinely difficult to game ' +
      'without actually improving the underlying process, and it takes a risk that was previously ' +
      'invisible and puts a number in front of the people who actually control the budget to fix ' +
      'it.',
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
        'This exercise asks you to put the whole module together into a single, concrete redesign, ' +
        'given a review where ninety-nine percent gets approved every single quarter without ' +
        'exception. The natural instinct here is to demand that people simply be more careful next ' +
        'time. The effective move, as the earlier exercises in this module established, is to ' +
        'change what is actually being asked of people, because the current design makes genuine ' +
        'care essentially impossible regardless of anyone\'s intentions.\n\n' +
        'CUT THE SCOPE first: review privileged, sensitive, and genuinely anomalous access properly ' +
        'and in real depth, rather than skimming across the entire estate superficially, and take ' +
        'the large, universal, low-consequence entitlements out of the review altogether. That ' +
        'single change alone can reduce the total volume by an order of magnitude, which is what ' +
        'actually makes careful attention possible again.\n\n' +
        'CHANGE WHAT IS SHOWN to the reviewer: describe each entitlement in plain business language ' +
        'rather than a raw technical group name, and include last-used data alongside every line, ' +
        'because a manager who is told plainly "this has not been used in eight months" can make a ' +
        'confident decision in a second, where the same manager faced with a bare group name cannot ' +
        'decide anything at all.\n\n' +
        'CLOSE THE LOOP by making sure a decision to revoke actually results in the access being ' +
        'removed, with evidence recorded that it happened, because as covered earlier, the current ' +
        'process may well be producing perfectly good decisions that silently go nowhere ' +
        'afterward.\n\n' +
        'And consider making the DEFAULT for the highest-risk items an automatic lapse rather than ' +
        'automatic retention, so that inaction removes access rather than quietly preserving it, ' +
        'echoing the same default-driven design used elsewhere in this module for time-bound ' +
        'grants.',
    },
    hints: [
      'Do not ask for more care. Ask why care is currently impossible.',
      'What single piece of data would make most of these decisions easy?',
      'A good answer narrows the scope to privileged and anomalous access, shows business-language descriptions and last-used data, and does not simply ask reviewers to be more diligent.',
    ],
    solution:
      'I would stop reviewing everything at once, because trying to cover the whole estate in one ' +
      'pass is exactly what makes the volume impossible for anyone to manage carefully, and it is ' +
      'what trains people to approve without reading in the first place. Instead I would review ' +
      'privileged access, access to regulated data, and genuine anomalies such as people whose ' +
      'access clearly differs from their peers, and I would take universal, low-consequence ' +
      'entitlements out of the review altogether rather than diluting the important lines with ' +
      'them. I would also change what the reviewer actually sees: entitlements described in plain ' +
      'business language rather than raw group names, with last-used data shown alongside each ' +
      'one, since a manager who is told something has not been used in eight months can decide ' +
      'immediately and confidently rather than guessing. And I would verify, with evidence, that ' +
      'revocation decisions actually result in the access being removed, because a review that ' +
      'produces good decisions nobody ever executes is arguably worse than useless, since it ' +
      'creates a false paper trail of assurance. None of this depends on asking managers to simply ' +
      'try harder, because the current design is what makes trying harder impossible, not any lack ' +
      'of effort on their part.',
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
      'Auditors accept a deliberately narrower review scope far more readily than most people ' +
      'expect, provided the reasoning behind it is written down clearly and available if asked. ' +
      'What they genuinely object to is a scope that was narrowed quietly, with no documented ' +
      'rationale, because that looks like corners being cut rather than a considered decision.',
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
        'This final module turns to what actually happens when identity fails, starting with how ' +
        'accounts are genuinely taken over in the real world, because the popular image of ' +
        'hacking, someone cleverly breaking cryptography, is almost entirely wrong for identity ' +
        'attacks. The attacks that actually matter are unglamorous, repetitive, and effective ' +
        'specifically because they work at scale rather than through cleverness.\n\n' +
        'CREDENTIAL STUFFING takes username and password pairs that have already leaked from some ' +
        'other, unrelated breach, and simply tries them against a completely different company\'s ' +
        'login page, on the entirely reasonable assumption that plenty of people reuse the same ' +
        'password everywhere. PASSWORD SPRAYING tries a small handful of very common passwords ' +
        'against a huge number of different accounts, spreading the guesses out so that each ' +
        'individual account only ever sees one or two attempts, which is specifically why simple ' +
        'account lockout policies, which trigger after several failed attempts on ONE account, do ' +
        'not stop this attack at all. PHISHING through a relaying proxy, as the earlier module on ' +
        'authentication covered in detail, captures both the password and the second factor in ' +
        'real time by sitting between the victim and the real site. SESSION THEFT via malware on a ' +
        'device skips the authentication step entirely, because it steals proof of a login that ' +
        'already happened rather than trying to produce a new one.\n\n' +
        'And HELP DESK SOCIAL ENGINEERING is an increasingly prominent method: an attacker simply ' +
        'calls the service desk pretending to be an employee who has lost their phone, and asks for ' +
        'their MFA to be reset. This defeats every technical control covered so far in this package ' +
        'at once, because it does not attack any of them directly, it exploits the human process ' +
        'specifically designed to help genuinely locked-out people, which by necessity has to relax ' +
        'the normal checks somewhat to actually be useful.\n\n' +
        'What almost never actually happens, despite getting disproportionate attention in films ' +
        'and popular writing, is a genuine cryptographic attack against the authentication protocol ' +
        'itself. Defences should be proportioned to what really happens rather than to what sounds ' +
        'impressive, which means identity verification procedures at the help desk deserve ' +
        'considerably more serious attention than most organisations currently give them.',
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
      'A, B, C, and D are the attacks that actually account for the overwhelming majority of real ' +
      'account compromise: credential stuffing from other breaches, password spraying that evades ' +
      'simple lockouts, relayed phishing that captures both factors, and help desk social ' +
      'engineering that bypasses every technical control at once. E is essentially theoretical ' +
      'against modern authentication protocols and receives disproportionate attention purely ' +
      'because it sounds interesting and technically impressive, not because it is common. D ' +
      'deserves considerably more attention relative to what it currently gets in most ' +
      'organisations: it defeats every other control on this list simultaneously by exploiting the ' +
      'human recovery process rather than attacking any of them directly, and hardening identity ' +
      'verification at the help desk is genuinely cheap to do and is rarely actually done.',
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
      'Recovery is the weakest link in most identity systems for a structural reason, not an ' +
      'accidental one: it is specifically designed to help a genuinely stuck user, and every normal ' +
      'control gets deliberately relaxed in order to actually help them. Look closely at how your ' +
      'own organisation\'s recovery process actually works, because that is exactly where an ' +
      'attacker will look first too.',
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
        'This exercise picks up directly from the previous one: help desk social engineering was ' +
        'named as a real, common attack, and now it is worth actually designing the process it ' +
        'targets. Account recovery genuinely has to work well, because people really do lose phones ' +
        'on ordinary bad days, and every additional control added to the process costs a genuinely ' +
        'stuck person real time and frustration at the worst possible moment. The actual design ' +
        'problem is verifying somebody\'s identity using something a prepared attacker cannot ' +
        'easily also obtain.\n\n' +
        'What works: verification through a SEPARATE CHANNEL that is already on record, such as ' +
        'calling the phone number already registered for that employee back, rather than simply ' +
        'trusting whatever number happens to be calling in, since an attacker can spoof or fake the ' +
        'second but not easily intercept a call to the first. VERIFICATION BY THE LINE MANAGER, or ' +
        'in person, specifically for privileged accounts, because the consequence of getting it ' +
        'wrong justifies the extra friction this adds for that smaller, higher-risk population. ' +
        'PRE-ENROLLED BACKUP FACTORS, so that a lost phone simply means switching to a second ' +
        'security key that was already set up in advance, rather than starting a recovery ' +
        'conversation with the help desk at all, which is honestly the best outcome available for ' +
        'everybody involved. And ALERTING the actual account owner through every channel available ' +
        'the moment any recovery is performed, so that an illegitimate recovery, one the real owner ' +
        'did not request, surfaces and gets challenged quickly.\n\n' +
        'What does not work, despite being extremely common, is KNOWLEDGE-BASED verification: an ' +
        'employee number, a date of birth, a manager\'s name, the last four digits of a national ' +
        'identifier. Every single one of these is either discoverable through a basic search or ' +
        'simply guessable, and worse, it is precisely the list of facts a genuinely prepared ' +
        'attacker will already have sitting ready before they even pick up the phone to call.',
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
      'A, B, C, and D describe the actual design of a recovery process that works against this ' +
      'specific attack: calling back through a channel already on record, requiring stronger ' +
      'verification exactly where the consequence of getting it wrong is high, pre-enrolled backup ' +
      'factors that avoid needing recovery at all, and alerting the real owner so an illegitimate ' +
      'attempt surfaces quickly. E is the standard approach in most organisations and it is also ' +
      'the weakest one available: employee numbers appear in email signatures and out-of-office ' +
      'replies, dates of birth are findable through public records or social media, and manager ' +
      'names sit openly on professional networking profiles. Anything a determined stranger could ' +
      'research from outside the company is not genuine verification, whatever it might feel like ' +
      'on the phone.',
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
      'Pre-enrolled backup factors are the most underrated fix on this list. Every single recovery ' +
      'conversation avoided entirely, because someone simply switches to a backup key instead, is a ' +
      'recovery process an attacker never gets the chance to abuse, and it is genuinely a better, ' +
      'faster experience for the legitimate user too, which is rare for a security improvement.',
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
        'Identity provider logs are unusually good raw material for detecting attacks, for a ' +
        'simple reason: authentication is a highly structured, repeatable event, which means ' +
        'genuine patterns stand out clearly against it in a way that is much harder in messier, ' +
        'less structured data.\n\n' +
        'Worth building deliberately: FAILURES ACROSS MANY DIFFERENT ACCOUNTS coming from one ' +
        'source, which is exactly the shape password spraying leaves behind, and looks completely ' +
        'unlike the ordinary pattern of one confused user mistyping their own password a couple of ' +
        'times. IMPOSSIBLE JOURNEYS, where the same account successfully authenticates from two ' +
        'physical locations too far apart to have travelled between in the time that actually ' +
        'elapsed, which is an imperfect signal because of VPNs and travelling users, and is still ' +
        'genuinely informative when combined with other signals. NEW MFA METHOD REGISTRATION, ' +
        'especially soon after a password change or from a device the account has never used ' +
        'before, because as the earlier module on sessions covered, this is exactly the persistence ' +
        'step an attacker takes to keep access after the original break-in. And LEGACY PROTOCOL ' +
        'AUTHENTICATION SUCCEEDING at all, which as the earlier module on conditional access ' +
        'explained, usually means something bypassed MFA entirely by using a route that was never ' +
        'able to carry a second factor.\n\n' +
        'What is a genuinely poor detection on its own is a single failed login, because that ' +
        'happens many thousands of times a day across a large organisation for entirely innocent ' +
        'reasons, mistyped passwords, expired sessions, forgotten changes. The real skill here is ' +
        'aggregation: the actual signal is almost always found in the pattern across many accounts, ' +
        'many sources, or across time, rather than sitting inside any one individual event looked ' +
        'at by itself.',
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
      'A, B, C, and D describe detections that genuinely work because they look for a pattern ' +
      'rather than a single event: spraying patterns spread across many accounts, impossible ' +
      'journeys, new factor registration, and legacy protocol authentication succeeding. E is the ' +
      'classic mistake almost everyone building identity detections makes at first: individual ' +
      'login failures are overwhelmingly innocent on their own, and alerting on every single one ' +
      'produces a queue of alerts nobody can realistically work through, which then quietly trains ' +
      'the whole team to start ignoring alerts altogether, including the rare one that actually ' +
      'mattered. The real signal is almost always in the aggregate pattern, not in any one event.',
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
      'New MFA method registration is the detection most worth having in almost any identity ' +
      'estate, and it is consistently the least often actually built. It is exactly the detection ' +
      'that catches the step covered earlier in this package that turns one phished password into ' +
      'months of quiet, persistent access afterward.',
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
        'Having worked through this entire package, it is worth stepping back and talking honestly ' +
        'about identity as an actual career, because it is one of the most reliable ways into ' +
        'security work available, and one of the least discussed, largely because it looks nothing ' +
        'like the version of security shown in films and television.\n\n' +
        'It has an unusually accessible ENTRY PATH: ordinary service desk work already involves ' +
        'resetting passwords and granting access to systems, which is, quite literally, identity ' +
        'work under a different job title, so the transition from service desk into a dedicated ' +
        'identity role is short, and plenty of people make that move without any formal security ' +
        'background at all. Backgrounds in audit and general administration transfer similarly ' +
        'well, because a large part of the actual work is process and evidence rather than deep ' +
        'technical engineering.\n\n' +
        'The DEMAND for this work is steady and structural rather than fashionable or tied to ' +
        'whatever is currently trending in security news: every organisation of any real size has ' +
        'this exact problem permanently, on an ongoing basis, and regulation reliably keeps access ' +
        'review firmly in scope no matter what else changes. The work itself tends to run on ' +
        'BUSINESS HOURS, with predictable rhythms built around joiner and leaver cycles and ' +
        'periodic access reviews, rather than the unpredictable, three-in-the-morning nature of a ' +
        'lot of other security work.\n\n' +
        'And it genuinely leads somewhere from here. Identity engineering, privileged access ' +
        'management, identity governance, cloud security approached through the permissions and ' +
        'entitlements door, and security architecture more broadly are all realistic next steps. ' +
        'The honest caveat worth stating plainly is that the day-to-day work involves a great deal ' +
        'of process, ticketing, and talking to stakeholders across the business, which suits some ' +
        'people extremely well and genuinely bores others, and it is worth being honest with ' +
        'yourself about which one you are before committing to it as a path.',
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
      'A, B, C, and D describe identity work accurately: it has a genuinely good entry path from ' +
      'service desk or administration roles, demand for it is structural rather than a passing ' +
      'trend, the hours are predictable, and it leads to real further specialisation. E is the ' +
      'misdescription worth correcting before somebody actually takes the job expecting something ' +
      'else: identity is heavily process and stakeholder work, involving constant conversation with ' +
      'managers, HR, audit, and the owners of individual applications, and somebody who wants to ' +
      'spend their whole day working in a terminal, as this package\'s own header comment explains ' +
      'it deliberately has none of, will genuinely find it frustrating. Somebody who enjoys making ' +
      'systems and people actually work together well will find it unusually satisfying instead.',
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
      'If the exercises in this package you personally enjoyed most were the short-answer ones ' +
      'about explaining a decision or negotiating a tricky request, take that as a genuinely good ' +
      'sign about fit. That kind of explaining and negotiating is most of what the actual job looks ' +
      'like day to day.',
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
        'This final exercise asks you to bring together everything this package has covered into a ' +
        'single, defensible plan for someone starting from nothing, and there is a genuinely ' +
        'defensible order to follow, one that starts with finding out what is actually true rather ' +
        'than jumping straight into fixing things.\n\n' +
        'First, find out WHAT EXISTS: which accounts are out there, which of them are privileged, ' +
        'which have no identifiable owner, and which have not actually been used in a long time. ' +
        'Almost no organisation without an existing identity programme has this basic inventory ' +
        'sitting ready, everything else in this package genuinely depends on having it, and ' +
        'producing it is immediately useful and visible to other people around you, which is ' +
        'exactly what buys a new person real standing early on.\n\n' +
        'Then move to the two highest-consequence fixes, which turn out to be broadly the same ' +
        'almost everywhere you go. PHISHING-RESISTANT AUTHENTICATION on privileged accounts ' +
        'specifically, because as the earlier modules covered in depth, those are the accounts ' +
        'whose compromise ends the argument entirely, and the population needing it is small enough ' +
        'to actually cover quickly. And the LEAVER PATH, because stale accounts with live access, ' +
        'as this package has returned to repeatedly, are consistently one of the most common ways ' +
        'real organisations actually get compromised, and fixing that gap is genuinely a process ' +
        'problem rather than something that requires a large budget.\n\n' +
        'Dormant and orphaned account cleanup, covered earlier in this package, is a good early win ' +
        'to run alongside those two: it is cheap, it is visible to leadership, and it is genuinely ' +
        'risk-reducing rather than merely reassuring.\n\n' +
        'What is worth actively resisting is starting with an entirely new entitlement model or an ' +
        'expensive governance tool. Both of those genuinely take about a year to deliver anything, ' +
        'both depend on the inventory that does not exist yet, and both produce nothing visible to ' +
        'show anyone in the meantime, which is a bad place to be standing as the new person in the ' +
        'room.',
    },
    hints: [
      'What has to be true before any other identity work is possible?',
      'Of the fixes, which one has the largest consequence and the smallest population?',
      'A good answer starts by finding out what accounts exist and which are privileged, then fixes privileged authentication or the leaver process, and explains why that order.',
    ],
    solution:
      'I would start by finding out what actually exists: an inventory of accounts, which of them ' +
      'are privileged, which have no named owner, and which have not been used in months. Almost ' +
      'no organisation without an existing programme has that inventory ready, everything else in ' +
      'identity genuinely depends on it, and producing it is immediately useful to other teams ' +
      'around me rather than only to my own work, which helps build trust early. Then I would fix ' +
      'the two things with the largest consequence relative to the smallest effort required: ' +
      'phishing-resistant authentication on privileged accounts, since that population is small ' +
      'enough to cover quickly and its compromise is consistently the worst-case scenario, and the ' +
      'leaver path, since stale accounts with live access are the most common way real ' +
      'organisations actually get breached, and fixing that gap is a process change rather than ' +
      'something that needs a large budget. I would deliberately not start with a new entitlement ' +
      'model or an expensive governance platform, because both genuinely take about a year to show ' +
      'anything, both depend on the inventory I do not have yet, and both would leave me with ' +
      'nothing visible to point to in the meantime.',
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
      'That inventory is the one artefact everything else covered across this entire package ' +
      'genuinely rests on. Build it early in any role you take on, keep it current rather than ' +
      'letting it go stale, and you will consistently be the person in the room who can actually ' +
      'answer the question nobody else can.',
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
