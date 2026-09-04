/**
 * Windows and Active Directory Foundations: the domain, top down.
 *
 * WHY THIS PACKAGE EXISTS
 *
 * The `windows` foundation has sat unbuilt since foundations.ts was written,
 * and the gap shows: `identity` and `incident-response` both name it as a
 * prerequisite, but a student arriving from a help desk background has
 * nothing here that teaches the thing most enterprise compromise actually
 * runs on. This is the portfolio-lab version of that gap: promote a domain
 * controller, organise users and groups, enforce policy at scale with Group
 * Policy, and join a client, then know exactly what to check when any one of
 * those steps quietly does not work.
 *
 * WHY IT NEEDS NO TERMINAL
 *
 * There is no simulated Windows Server or domain in this platform, and
 * building one (a working NTDS-equivalent, a GPO engine, a fake AD PowerShell
 * surface) would be its own multi-session project, not a portfolio lab. What
 * is teachable honestly here is the same thing `identity-foundations.ts`
 * teaches: the judgement. What actually changes when you promote a server,
 * why an OU is not a permissions boundary, why a password policy linked to
 * the wrong place does nothing, and what "the trust relationship failed"
 * actually means. Every exercise grades a determination, the same way a real
 * AD home lab write-up has to explain WHY each step worked rather than just
 * screenshotting that it did.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

// --- Module win.1: the domain controller -------------------------------------

const MODULE_WIN_1: Exercise[] = [
  {
    id: 'win.1.1',
    moduleId: 'win.1',
    packageId: 'windows-ad-foundations',
    order: 1,
    title: 'What promotion actually changes',
    kind: 'multiple-choice',
    goal: 'Separate what a Domain Controller does from what any joined server does.',
    prompt:
      'You promote a Windows Server to a Domain Controller for a new domain. Which of the ' +
      'following actually happen as a result? Select all that apply.',
    teach: {
      concept:
        'Picture a small office before anything like Active Directory exists. Every computer keeps its ' +
        'own private list of who is allowed to log in and what their password is. That works fine for ' +
        'one or two machines, but the moment you have ten computers, it falls apart: a new employee ' +
        'needs an account created ten separate times, and when someone leaves, somebody has to remember ' +
        'to delete their account from every single machine or their access never actually goes away.\n\n' +
        'Active Directory fixes this by picking one machine to be the single, trusted source of truth ' +
        'for every account in the whole office. That machine is called a DOMAIN CONTROLLER, and the ' +
        'act of turning an ordinary Windows Server into one is called PROMOTION. Once a server is ' +
        'promoted, it is not just relabeled, it starts doing real, new work: it holds a database of ' +
        'every user and computer (a file called NTDS.dit), it copies that database to any other domain ' +
        'controller so there is a backup, and it becomes the machine other computers check with, in a ' +
        'process called Kerberos authentication, whenever someone tries to log in anywhere in the ' +
        'office. It also almost always takes on the job of DNS server for the office, because a computer ' +
        'that wants to log in does not know the domain controller\'s address by heart, it looks it up ' +
        'the same way your phone looks up a website\'s address, and that lookup only works if something ' +
        'is running DNS for the domain.\n\n' +
        'None of this is true of a computer that has simply joined the domain as a regular member. A ' +
        'file server that has sat on the network for years, letting people log into it, holds none of ' +
        'that master account list itself and issues no logins on its own, it just trusts the domain ' +
        'controller to vouch for whoever shows up. Knowing that difference matters on the job because ' +
        'when authentication breaks anywhere in a real company, the domain controller is almost always ' +
        'where the actual problem, and the actual fix, lives.',
    },
    options: [
      { id: 'a', label: 'The server starts holding a writable copy of the Active Directory database.' },
      { id: 'b', label: 'The server typically becomes a DNS server responsible for the domain\'s zone.' },
      { id: 'c', label: 'The server begins issuing Kerberos tickets for domain authentication.' },
      { id: 'd', label: 'Any server that has ever joined the domain could have been promoted instead, it makes no real difference which one.' },
      { id: 'e', label: 'Clients start locating this server via DNS SRV records rather than a hardcoded address.' },
    ],
    hints: [
      'Four of the five describe a genuine change in what the machine does. One describes something that was already true before promotion and stays true regardless.',
      'Ask what a plain file server does NOT do that a DC does.',
      'SRV records are how a client finds a DC without anyone typing its address in.',
    ],
    solution:
      'A, B, C, and E. Promotion is not cosmetic: the server starts holding the directory, usually ' +
      'takes on DNS, issues Kerberos tickets, and becomes discoverable via SRV records. D describes ' +
      'domain membership, which every joined machine already has and which promotion has nothing to ' +
      'do with.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'One option describes domain membership, which every joined machine already has, not promotion.',
      },
    ],
    debrief:
      'Hold onto the DNS point specifically. Think of DNS as an address book: your phone does not ' +
      'memorize the numeric address of every website you visit, it looks the name up in an address ' +
      'book first. A domain controller works the same way, computers do not have its address ' +
      'memorized, they look it up. So a huge share of "the domain is broken" tickets turn out to be a ' +
      'DNS problem wearing an Active Directory costume, because nothing about logging in works if a ' +
      'computer cannot look up where the domain controller even is in the first place.',
    practice: [],
  },
  {
    id: 'win.1.2',
    moduleId: 'win.1',
    packageId: 'windows-ad-foundations',
    order: 2,
    title: 'Why the domain needs its own DNS zone',
    kind: 'multiple-choice',
    goal: 'Explain the dependency between Active Directory and DNS rather than just naming it.',
    prompt:
      'A colleague asks why the domain controller has to run DNS at all, since every machine already ' +
      'has an IP address. Which of the following are accurate reasons? Select all that apply.',
    teach: {
      concept:
        'Start from what DNS actually is: a directory that turns a name into an address, the same way ' +
        'a phone book turns a person\'s name into a phone number. Every time you type a website name ' +
        'into a browser, something behind the scenes is asking a DNS server "what address does this ' +
        'name point to" before your browser can connect to anything.\n\n' +
        'Active Directory leans on that same lookup system, but it is not looking up a website, it is ' +
        'looking up a SERVICE. When a computer needs to find a domain controller, it does not have that ' +
        'address memorized and it does not ask a person, it asks DNS a very specific question, in the ' +
        'form of what is called an SRV record: something like `_ldap._tcp.dc._msdcs.<domain>` to find a ' +
        'domain controller, or `_kerberos._tcp` to find the machine that hands out login tickets. If a ' +
        'computer cannot get an answer to that question, it has no way to find a domain controller at ' +
        'all, even if that domain controller is sitting right there on the network and would happily ' +
        'answer if only the computer knew where to ask.\n\n' +
        'This is why, when a computer cannot join or use the domain, "can this computer reach the ' +
        'domain controller by pinging it" is the wrong first question. A computer can ping a machine ' +
        'successfully and still have no idea it is a domain controller, because ping only tests whether ' +
        'a signal gets there, not whether the computer knows where to send that signal in the first ' +
        'place. The right first question is "is this computer even asking the right address book," ' +
        'meaning is it configured to use the domain\'s own DNS server. Getting comfortable with that ' +
        'distinction is one of the most useful troubleshooting habits you can build in this whole field.',
    },
    options: [
      { id: 'a', label: 'Clients locate a domain controller by querying DNS for SRV records, not by a hardcoded address.' },
      { id: 'b', label: 'Kerberos ticket requests are also located via DNS SRV records.' },
      { id: 'c', label: 'A domain functions identically on plain IP addressing, DNS is only used for convenience.' },
      { id: 'd', label: 'A client pointed at the wrong DNS server can be fully reachable on the network and still fail to find the domain.' },
    ],
    hints: [
      'Three of these describe the real dependency. One claims DNS is optional convenience.',
      'What record type does a client actually query to find a DC?',
      'Reachability and name resolution are two different things.',
    ],
    solution:
      'A, B, and D. Active Directory is built on SRV-record lookups, which means DNS is not an add-on, ' +
      'it is the discovery mechanism. C is the misconception this exercise exists to correct: a fully ' +
      'reachable network with the wrong DNS configuration still looks broken to every client on it.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'One option claims DNS is only convenience, which is the opposite of how AD actually locates a DC.',
      },
    ],
    debrief:
      'Keep this exact distinction in mind for module win.4, where you will use it directly: "the ' +
      'computer cannot reach the domain controller" and "the computer cannot find the domain ' +
      'controller" are two completely different problems with two completely different fixes, and ' +
      'telling them apart starts with checking which DNS server a computer is configured to use before ' +
      'you check anything else.',
    practice: [],
  },
  {
    id: 'win.1.3',
    moduleId: 'win.1',
    packageId: 'windows-ad-foundations',
    order: 3,
    title: 'Before you promote anything',
    kind: 'short-answer',
    goal: 'List the prerequisites that make a first-domain promotion succeed cleanly.',
    prompt:
      'You are about to promote a fresh Windows Server install into a brand-new domain, for the AD ' +
      'home lab most people build first. In two or three sentences, name the things you would check ' +
      'or set before running the promotion, and why each matters.',
    teach: {
      concept:
        'Before you promote a server, it helps to understand why each prerequisite exists rather than ' +
        'just memorizing a checklist, because a promotion that half-works is much harder to diagnose ' +
        'afterward than one that fails outright and tells you immediately.\n\n' +
        'A STATIC IP ADDRESS means an address that never changes. Normally, computers on a network are ' +
        'handed a temporary address automatically by a service called DHCP, the same way a hotel might ' +
        'assign you a room number when you check in rather than you owning that room permanently. A ' +
        'domain controller cannot work that way: every other computer will be configured to look for it ' +
        'at one specific address, so if that address changes, every one of those computers loses track ' +
        'of it. And ironically, DHCP itself is often a service the domain controller provides, so ' +
        'relying on DHCP to give the domain controller its own address is circular.\n\n' +
        'The server\'s OWN DNS SETTING, meaning which DNS server it asks when it needs to look something ' +
        'up, should point at itself (or at another domain controller once a second one exists), because ' +
        'promotion is the moment the domain\'s own DNS records get created, and the server needs to be ' +
        'able to find those brand new records immediately, not ask some outside DNS server that has ' +
        'never heard of this domain.\n\n' +
        'TIME matters more than it looks like it should. Computers prove who they are to each other ' +
        'using a system called Kerberos, and Kerberos includes a safety check: if two computers\' clocks ' +
        'disagree by more than about five minutes, it assumes something suspicious is going on and ' +
        'refuses the login. A server with a wrong clock will promote just fine, since promotion itself ' +
        'does not check the time, and then quietly fail every single login afterward in a way that looks ' +
        'completely unrelated to time at all.\n\n' +
        'And finally, there needs to be enough DISK SPACE for the account database and a related folder ' +
        'called SYSVOL, plus a HOSTNAME (the computer\'s name) that will not need to change later, ' +
        'because renaming a domain controller after promotion is its own separate, messy project. ' +
        'Getting all four right before you start is the difference between a promotion that just works ' +
        'and one that leaves you debugging mystery failures days later.',
    },
    hints: [
      'Four things: an address that will not move, a DNS setting, a clock, and disk/name stability.',
      'Why would a DC need to be able to query its own DNS immediately after promotion?',
      'Kerberos has a hard tolerance for clock drift, name it.',
    ],
    solution:
      'I would set a static IP address before promoting, since a DC that changes address breaks every ' +
      'client relying on it. I would point the server\'s own DNS setting at itself, because the ' +
      'promotion creates the domain\'s DNS zone and the server needs to resolve it immediately. I ' +
      'would confirm the system clock is correct, since Kerberos rejects authentication once client ' +
      'and server time drift by more than a few minutes by default, which produces confusing failures ' +
      'much later if it is wrong now. And I would check disk space for the database and SYSVOL, and ' +
      'settle on a hostname I do not plan to change.',
    expectedOutput: 'An answer naming a static IP, self-pointing DNS, correct system time, and disk/hostname stability.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['static ip', 'static address', 'ip address'],
          ['dns', 'point', 'resolve', 'itself'],
          ['time', 'clock', 'kerberos', 'skew', 'drift'],
        ],
        hint: 'Three ideas at minimum: a stable address, why DNS needs to point at the server itself, and the clock requirement Kerberos enforces.',
      },
    ],
    debrief:
      'The clock requirement is the one people skip and regret. Picture a lab built on a virtual machine ' +
      'whose clock quietly drifts every time the physical computer it runs on goes to sleep. That lab ' +
      'will promote successfully, because promotion does not check the clock, and then start failing ' +
      'logins days later for a reason that has nothing to do with anything you actually changed, unless ' +
      'you already know to suspect the clock.',
    practice: [],
  },
  {
    id: 'win.1.4',
    moduleId: 'win.1',
    packageId: 'windows-ad-foundations',
    order: 4,
    title: 'One domain controller is a single point of failure',
    kind: 'multiple-choice',
    goal: 'Explain what a single-DC design actually risks, beyond "it could go down".',
    prompt:
      'A one-DC home lab is fine for learning, but in a real environment a single domain controller ' +
      'is considered a serious design flaw. Which of the following describe why? Select all that apply.',
    teach: {
      concept:
        'A "single point of failure" is a phrase worth unpacking plainly: it means one piece of a system ' +
        'that, if it breaks, takes the whole system down with it, the way a house with only one entrance ' +
        'becomes completely inaccessible the moment that one door is blocked, no matter how sound the ' +
        'rest of the house is.\n\n' +
        'A domain with only one domain controller is exactly that kind of single point of failure. ' +
        'Losing that one machine does not just take down one server, it takes down the ability to log in ' +
        'anywhere in the entire company, because there is nowhere left that can issue a login ticket. ' +
        'Making it worse, certain administrative jobs, called FSMO roles (things like the schema master ' +
        'and the PDC emulator), are designed to live on exactly one domain controller at a time, on ' +
        'purpose, so if that specific domain controller is gone for good, moving those jobs onto a ' +
        'surviving domain controller is a deliberate, manual recovery procedure that someone has to ' +
        'choose to do, not something that happens automatically. A second domain controller also gives ' +
        'the directory\'s changes somewhere to copy themselves to as they happen, which acts as a form of ' +
        'built-in backup: a change made on one domain controller shows up on another within minutes, so ' +
        'losing one does not mean losing the data.\n\n' +
        'On the job, this is exactly the kind of design flaw a real IT team gets asked to explain and ' +
        'defend, because "what happens if this one server dies" is one of the first questions any ' +
        'competent reviewer or auditor asks about any system.',
    },
    options: [
      { id: 'a', label: 'If the only DC is unreachable, no client can authenticate anywhere in the domain.' },
      { id: 'b', label: 'Certain FSMO roles exist on only one DC at a time, and recovering them after a permanent loss is a deliberate manual procedure.' },
      { id: 'c', label: 'A second DC gives directory changes somewhere to replicate to, which is itself a form of resilience.' },
      { id: 'd', label: 'Windows automatically promotes another joined server to DC if the original one goes offline.' },
    ],
    hints: [
      'Three of these describe real consequences of a single-DC design. One describes automatic behaviour Windows does not actually have.',
      'Nothing about Active Directory self-heals a missing DC without someone deliberately acting.',
    ],
    solution:
      'A, B, and C. Authentication has nowhere to go, certain roles are stuck on the dead DC until ' +
      'someone seizes them, and there is no replication partner. D is false: Windows never silently ' +
      'promotes a replacement, that only happens if an administrator runs the promotion themselves.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'One option claims Windows automatically replaces a lost DC, which is not something it does.',
      },
    ],
    debrief:
      'A one-domain-controller lab is still the right way to learn this material, the point is not to ' +
      'avoid it, it is to describe it honestly in a portfolio write-up rather than presenting it as ' +
      'something production-ready. Naming a limitation you understand is worth more to a reviewer than ' +
      'pretending it does not exist.',
    practice: [],
  },
  {
    id: 'win.1.5',
    moduleId: 'win.1',
    packageId: 'windows-ad-foundations',
    order: 5,
    title: 'The crown jewel, explained plainly',
    kind: 'short-answer',
    goal: 'State in plain language what compromising a domain controller actually gives an attacker.',
    prompt:
      'A non-technical stakeholder asks why "the domain controller got compromised" is treated as far ' +
      'more serious than any single workstation getting infected. In two or three sentences, explain ' +
      'what an attacker actually gains.',
    teach: {
      concept:
        'Think about what a single stolen house key gets a burglar: access to one house. Now think about ' +
        'what a stolen master key from a building superintendent gets them: access to every apartment in ' +
        'the building, because that one key was never meant to open just one door, it was built to open ' +
        'all of them.\n\n' +
        'A compromised workstation is the stolen house key: an attacker who breaks into one employee\'s ' +
        'laptop typically gets that one employee\'s access and nothing more. A compromised domain ' +
        'controller is the master key, because it holds the single database that every other machine in ' +
        'the company already trusts to answer the question "who is this, and what are they allowed to ' +
        'do." An attacker who controls that database is not limited to one account, they can create ' +
        'brand new accounts, add themselves to any group including administrators, reset any password in ' +
        'the company, and pull out the stored credential material for every single person who has ever ' +
        'logged in anywhere in the domain.\n\n' +
        'That is exactly why "the domain controller was compromised" and "we have to assume every ' +
        'credential in the company is burned" get treated as the same sentence in a real incident, and ' +
        'why a domain controller gets locked down, patched, and watched far more carefully than any ' +
        'ordinary server.',
    },
    hints: [
      'A workstation compromise is one user\'s access. A DC compromise is a different order of magnitude, say why.',
      'What database does the DC hold, and what does that database decide?',
      'A good answer connects "holds the directory" to "can impersonate or control any account".',
    ],
    solution:
      'A workstation compromise typically gives an attacker one user\'s access. A domain controller ' +
      'holds the database every machine in the company trusts to decide who someone is and what they ' +
      'may do, so an attacker who controls it can create accounts, change group membership, reset any ' +
      'password, and extract credential material for the entire organisation. That is why a compromised ' +
      'DC is treated as a full domain compromise rather than a single incident: every credential in ' +
      'the domain has to be assumed exposed.',
    expectedOutput: 'An answer distinguishing single-account impact from domain-wide impact, and naming what the DC actually controls.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['every account', 'any account', 'whole domain', 'entire domain', 'all users'],
          ['directory', 'database', 'trusts', 'authenticate', 'controls'],
        ],
        hint: 'Cover two ideas: what the DC actually holds, and why that scales an attacker\'s reach to the whole domain rather than one account.',
      },
    ],
    debrief:
      'This is the sentence that justifies every other control in this module: patching a domain ' +
      'controller harder than a normal server, tightly restricting who is even allowed to log onto it, ' +
      'and never treating a single domain controller as good enough for production are all downstream ' +
      'of this one fact about what that machine actually holds.',
    practice: [],
  },
];

// --- Module win.2: users, groups, and OUs ------------------------------------

const MODULE_WIN_2: Exercise[] = [
  {
    id: 'win.2.1',
    moduleId: 'win.2',
    packageId: 'windows-ad-foundations',
    order: 1,
    title: 'Three kinds of account, three different purposes',
    kind: 'multiple-choice',
    goal: 'Tell a user account, a computer account, and a service account apart.',
    prompt: 'Which of the following correctly describe the three main account types in Active Directory? Select all that apply.',
    teach: {
      concept:
        'Active Directory tracks more than just people. It needs an entry for anything that has to ' +
        'prove who it is before it is trusted to do something, and three different kinds of "who" show ' +
        'up constantly in a real company.\n\n' +
        'A USER ACCOUNT represents an actual person and is what someone types their username and ' +
        'password into. A COMPUTER ACCOUNT represents the machine itself, not any person sitting at it, ' +
        'and it gets created automatically the moment a computer joins the domain, before anyone has ' +
        'even logged into it. That computer account has its own password, one that Windows changes on a ' +
        'schedule behind the scenes without a person doing anything, and it is what makes the machine ' +
        'itself, independent of whoever happens to be using it, a trusted member of the domain. A ' +
        'SERVICE ACCOUNT represents a piece of software rather than a person, used to run something like ' +
        'a scheduled task or a background application under an identity that is not tied to any one ' +
        'employee\'s name, since that software needs to keep running even after the employee who set it ' +
        'up goes on vacation or leaves the company. Service accounts are a common target for attackers ' +
        'specifically because they are often given more access than they need and their passwords are ' +
        'rarely, if ever, changed.\n\n' +
        'Knowing these three apart matters because a lot of confusing AD behavior only makes sense once ' +
        'you remember which kind of account is actually involved: a login problem, a machine trust ' +
        'problem, and a scheduled task failing are three different categories of issue, even though all ' +
        'three ultimately trace back to some kind of account.',
    },
    options: [
      { id: 'a', label: 'A user account represents a person and is what someone authenticates with.' },
      { id: 'b', label: 'A computer account represents the joined machine itself, with its own rotating password.' },
      { id: 'c', label: 'A service account runs software under an identity not tied to a specific employee.' },
      { id: 'd', label: 'Computer accounts are optional, a machine can join the domain using only its user\'s account.' },
    ],
    hints: [
      'Three describe real, distinct account types. One claims a machine does not need its own identity to join.',
      'What gets created automatically the moment you domain-join a machine, before anyone even logs in?',
    ],
    solution:
      'A, B, and C. Every joined machine gets its own computer account regardless of who logs into it, ' +
      'which is what D gets wrong: a machine\'s trust relationship with the domain does not depend on ' +
      'any user account at all.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'One option claims a computer account is optional, but every joined machine gets one automatically.',
      },
    ],
    debrief:
      'Keep the computer account in mind for module win.4. The error "the trust relationship between ' +
      'this workstation and the domain has failed" sounds like it is about a person, but it is almost ' +
      'always the computer account\'s own password going out of sync with what the domain controller has ' +
      'on record, and has nothing to do with any user at all.',
    practice: [],
  },
  {
    id: 'win.2.2',
    moduleId: 'win.2',
    packageId: 'windows-ad-foundations',
    order: 2,
    title: 'Security group, or distribution group',
    kind: 'multiple-choice',
    goal: 'Pick the right group type for the job, and explain what the wrong choice actually breaks.',
    prompt:
      'You need to grant a team access to a shared folder. Which of the following are true about ' +
      'choosing a security group versus a distribution group for this? Select all that apply.',
    teach: {
      concept:
        'A GROUP in Active Directory is just a named bucket of accounts, useful for treating many ' +
        'people as one unit instead of handling each of them individually. But not every group does the ' +
        'same job, and mixing up which kind you have is a genuinely easy mistake to make.\n\n' +
        'A SECURITY GROUP can be handed permission to something, like being allowed into a shared ' +
        'folder, being allowed to run an application, or being targeted by a Group Policy. It can also ' +
        'receive email if someone turns that feature on for it. A DISTRIBUTION GROUP can only ever ' +
        'receive email, the way a mailing list works, because it was never built with the kind of ' +
        'underlying identifier (called a security identifier) that a permissions system can actually ' +
        'check against. That means a distribution group cannot be placed on an access list at all, not ' +
        'as a lesser option, but literally not at all.\n\n' +
        'Using a distribution group where a security group was needed does not give you a smaller or ' +
        'weaker version of what you wanted, it silently does nothing: the group will not even show up ' +
        'as something you can grant folder access to. Worse, it is common for someone to notice the ' +
        'problem, create a brand new security group with a nearly identical name to work around it, and ' +
        'now there are two similarly named groups in the directory that get confused with each other for ' +
        'years afterward. Picking the right group type on day one avoids that entire mess.',
    },
    options: [
      { id: 'a', label: 'A security group can be granted permissions on resources like a file share.' },
      { id: 'b', label: 'A distribution group has no security identifier and cannot be used for access control at all.' },
      { id: 'c', label: 'A distribution group works for file share access as long as it is also mail-enabled.' },
      { id: 'd', label: 'A security group can also send email if mail-enabled, so it is rarely the wrong choice when access might be needed.' },
    ],
    hints: [
      'Mail-enabling a distribution group changes what it can receive, not what it can be assigned permissions to.',
      'A security group covers both use cases; a distribution group covers only one.',
    ],
    solution:
      'A, B, and D. A distribution group cannot be used for access control no matter what else you do ' +
      'to it, which is what makes C wrong. A security group is close to a safe default, since it can be ' +
      'mail-enabled if needed later.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Mail-enabling does not give a distribution group a security identifier, so it still cannot be used for access control.',
      },
    ],
    debrief:
      'This is a genuinely common home-lab mistake: creating a distribution group, carefully adding ' +
      'people to it, and then being unable to find it anywhere when trying to grant NTFS folder ' +
      'permissions. If a group you expect to see is not showing up where it should, check its type ' +
      'before you assume anything else is wrong.',
    practice: [],
  },
  {
    id: 'win.2.3',
    moduleId: 'win.2',
    packageId: 'windows-ad-foundations',
    order: 3,
    title: 'What an OU actually controls',
    kind: 'multiple-choice',
    goal: 'Correct the most common misconception about Organisational Units.',
    prompt: 'Which of the following correctly describe what an Organisational Unit (OU) does? Select all that apply.',
    teach: {
      concept:
        'An OU, short for Organisational Unit, is a folder-like container inside Active Directory used ' +
        'to organize accounts and computers, the same basic idea as folders you use to organize files on ' +
        'your own computer. But it is easy to assume a folder-like container also controls who can ' +
        'access what, the way a locked physical filing cabinet controls who can see the papers inside ' +
        'it, and that assumption is wrong here.\n\n' +
        'An OU genuinely controls two specific things. First, which Group Policy settings apply to ' +
        'whatever is inside it, meaning you can point a specific set of rules at just the accounts and ' +
        'computers in one OU. Second, which administrative rights can be handed off, or delegated, over ' +
        'the objects inside it, for example letting a help desk team reset passwords only for the users ' +
        'sitting in one particular OU, without giving them any power over the rest of the company.\n\n' +
        'What an OU does NOT do is grant or restrict access to anything, in the way a locked cabinet ' +
        'would. Putting a user into an OU gives them no new access to any file, folder, or application ' +
        'by itself, and it does not take any access away either. That job belongs entirely to security ' +
        'groups and access control lists, which are a separate mechanism from where an account happens ' +
        'to sit in the OU structure. Confusing the two is one of the most common misunderstandings ' +
        'people carry out of their first exposure to Active Directory.',
    },
    options: [
      { id: 'a', label: 'An OU scopes which Group Policy Objects apply to the objects inside it.' },
      { id: 'b', label: 'An OU scopes which administrative rights can be delegated over the objects inside it.' },
      { id: 'c', label: 'Placing a user in an OU by itself grants or restricts their access to resources.' },
      { id: 'd', label: 'An OU is primarily an organisational container, not a security or permissions mechanism on its own.' },
    ],
    hints: [
      'Two things an OU genuinely controls, and one thing people wrongly assume it controls.',
      'Access to a resource comes from security groups and ACLs, not from which folder an account sits in in AD.',
    ],
    solution:
      'A, B, and D. GPO scope and delegation are real, direct consequences of OU placement. Resource ' +
      'access is not: C describes a mechanism OUs do not have. A user moved into a "Finance" OU gains ' +
      'no access to Finance resources unless they are also added to a group that grants it.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Resource access comes from group membership and ACLs, not from OU placement, so one option overstates what an OU does.',
      },
    ],
    debrief:
      'This distinction is worth stating explicitly in a portfolio write-up: saying "I used OUs to scope ' +
      'Group Policy and security groups to grant access" in so many words shows a reviewer you ' +
      'understand these are two separate mechanisms doing two separate jobs, which is exactly the kind ' +
      'of thing they are checking for.',
    practice: [],
  },
  {
    id: 'win.2.4',
    moduleId: 'win.2',
    packageId: 'windows-ad-foundations',
    order: 4,
    title: 'Two hundred accounts, one afternoon',
    kind: 'short-answer',
    goal: 'Justify scripting a bulk operation instead of using the GUI.',
    prompt:
      'You need to create 200 new-hire accounts for a seasonal intake, each with a specific OU, ' +
      'department attribute, and starting group memberships. In two or three sentences, explain what ' +
      'you would script rather than do by hand in Active Directory Users and Computers, and why.',
    teach: {
      concept:
        'Creating one user account by clicking through a series of dialog boxes is easy. Creating two ' +
        'hundred of them the same way is not just two hundred times slower, it is two hundred separate ' +
        'chances to mistype a department code, forget to add someone to a group, or place one person in ' +
        'the wrong OU, and every one of those small mistakes is invisible the moment you make it.\n\n' +
        'The alternative is SCRIPTING: writing a set of instructions that a computer carries out ' +
        'automatically instead of a person clicking through the same steps by hand. In this case, that ' +
        'typically means starting from a spreadsheet-style file (a CSV) listing each new hire\'s ' +
        'details, and looping a single account-creation command over every row of it, PowerShell\'s ' +
        '`New-ADUser` being the standard tool for exactly this. The value is not really about saving ' +
        'time, although it does that too, it is that the exact same code runs for all two hundred ' +
        'accounts, so every single one comes out with the same attribute format, lands in the correct ' +
        'OU, and gets the correct starting group memberships, because a computer does not get tired or ' +
        'distracted on account number 147 the way a person does.\n\n' +
        'This matters on the job because the mistakes manual entry produces are exactly the kind that ' +
        'stay hidden until someone notices, months later, that a former contractor still has file access ' +
        'they should never have kept, or that a whole department\'s accounts were set up slightly wrong ' +
        'from day one.',
    },
    hints: [
      'The core argument is consistency at scale, not just speed.',
      'What tool creates AD user accounts from a script, and what would you feed it two hundred rows of?',
      'A good answer names a CSV-driven loop and explains what manual repetition actually risks.',
    ],
    solution:
      'I would script it rather than click through the GUI 200 times, reading each new hire\'s details ' +
      'from a CSV and looping a creation command like PowerShell\'s New-ADUser over it to set the OU, ' +
      'department attribute, and starting groups consistently. The point is not just speed, it is that ' +
      'every account gets built the same way: a manual process repeated 200 times will eventually place ' +
      'someone in the wrong OU or miss a group, and that kind of mistake is invisible until someone ' +
      'notices they have the wrong access.',
    expectedOutput: 'An answer naming a scripted, CSV-driven approach and explaining why consistency at scale matters more than raw speed.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['script', 'powershell', 'new-aduser', 'csv', 'loop', 'automate'],
          ['consistent', 'consistency', 'mistake', 'error', 'wrong ou', 'wrong group', 'repeat'],
        ],
        hint: 'Name the scripted approach specifically, and connect it to why manual repetition at this scale is where mistakes actually happen.',
      },
    ],
    debrief:
      'This is a genuinely good portfolio talking point. Saying "I scripted bulk account creation from a ' +
      'CSV" demonstrates both a real, useful technical skill (PowerShell) and the operational judgement ' +
      'to know when a repetitive manual task is actually a liability, which is exactly the combination ' +
      'an entry-level hiring manager is looking for.',
    practice: [],
  },
  {
    id: 'win.2.5',
    moduleId: 'win.2',
    packageId: 'windows-ad-foundations',
    order: 5,
    title: 'Grant access to a group, not a person',
    kind: 'multiple-choice',
    goal: 'Explain why granting a file share permission directly to a user, rather than a group, is a maintenance problem waiting to happen.',
    prompt:
      'A manager asks why you always grant folder permissions to a security group and add users to the ' +
      'group, rather than granting each person permission directly. Which of the following are good ' +
      'reasons? Select all that apply.',
    teach: {
      concept:
        'Imagine granting building access by handing a physical key to each of twelve employees ' +
        'individually, rather than giving all twelve of them a single type of keycard that a security ' +
        'system recognizes as one group. The moment one of those twelve leaves the company, someone has ' +
        'to remember exactly which physical key that person had and go get it back. The moment a ' +
        'thirteenth person joins the team, someone has to cut them a whole new key.\n\n' +
        'Granting folder access directly to twelve individual people works exactly like the ' +
        'individual-keys approach: it means twelve separate entries to keep track of and audit, and ' +
        'adding a new team member means going back into that specific folder\'s permission settings and ' +
        'editing them by hand, one more time, forever. Granting access once to a security GROUP, and ' +
        'then managing who belongs to that group instead, works like the keycard system: the folder\'s ' +
        'own permissions never have to change again. Adding someone to the team becomes a single ' +
        'group-membership edit rather than an edit to the resource itself, removing someone becomes the ' +
        'same single edit in reverse, and answering "who currently has access to this" later becomes as ' +
        'simple as looking at one group\'s member list instead of checking every resource in the company ' +
        'one at a time.\n\n' +
        'This is exactly the kind of habit that separates a setup that stays manageable as a company ' +
        'grows from one that quietly turns into a mess nobody can fully account for a year later.',
    },
    options: [
      { id: 'a', label: 'Onboarding a new person becomes a group-membership change instead of an edit to the resource itself.' },
      { id: 'b', label: 'An access review can answer "who has access" by reading one group\'s membership instead of every resource\'s permissions.' },
      { id: 'c', label: 'Direct per-user grants are functionally identical to group membership and offer no real difference in practice.' },
      { id: 'd', label: 'Offboarding someone from every resource they had access to becomes one group removal instead of hunting down each grant.' },
    ],
    hints: [
      'Three of these describe real maintenance benefits. One claims there is no practical difference, which is the misconception this exercise corrects.',
    ],
    solution:
      'A, B, and D. The whole value of group-based access is that membership becomes the single place ' +
      'access lives, which makes both onboarding and offboarding, and reviewing access later, ' +
      'dramatically simpler. C is the trap: direct grants look identical on the day you make them and ' +
      'diverge badly the moment someone leaves or a review has to happen.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'One option claims there is no real difference between direct grants and group membership, which is the opposite of the point.',
      },
    ],
    debrief:
      'This is the same principle the Identity and Access Foundations package builds an entire module ' +
      'around: group-based access is what keeps onboarding, role changes, and offboarding manageable at ' +
      'any real scale, and it starts here, with a basic decision about how you set up a single shared ' +
      'folder in a home lab.',
    practice: [],
  },
];

// --- Module win.3: group policy ----------------------------------------------

const MODULE_WIN_3: Exercise[] = [
  {
    id: 'win.3.1',
    moduleId: 'win.3',
    packageId: 'windows-ad-foundations',
    order: 1,
    title: 'The order policy applies in',
    kind: 'multiple-choice',
    goal: 'Learn the precedence order that decides which GPO wins when two conflict.',
    prompt: 'Group Policy applies in a specific order, commonly remembered as LSDOU. Which of the following correctly describe that order and its consequence? Select all that apply.',
    teach: {
      concept:
        'GROUP POLICY is Active Directory\'s way of pushing a setting out to many computers or users at ' +
        'once, things like "require a screen lock after five minutes" or "map this network drive ' +
        'automatically," rather than someone configuring each machine by hand. A single bundle of these ' +
        'settings is called a Group Policy Object, or GPO for short.\n\n' +
        'The tricky part is that more than one GPO can apply to the same computer at the same time, from ' +
        'different places, and they do not always agree with each other. Windows resolves that by ' +
        'applying them in a strict, fixed order, commonly remembered by the acronym LSDOU: Local policy ' +
        'first, then Site, then Domain, then Organisational Unit, with each one applied after the last ' +
        'able to override whatever came before it, the same way a more specific instruction given later ' +
        'overrides a more general one given earlier. Because OU-linked policy is applied last of these ' +
        'four, it wins any direct disagreement with a Domain-linked or Site-linked policy. And if an ' +
        'account sits inside a nested OU, meaning an OU inside another OU, the OU closest to that account ' +
        'applies last of all and wins over anything linked further up the chain.\n\n' +
        'This is why "I set the whole domain\'s password policy to require 14 characters, but this one ' +
        'specific OU still only requires 8" is not evidence of a bug. It means some GPO linked closer to ' +
        'those particular accounts is deliberately, or accidentally, overriding the domain-wide setting, ' +
        'and tracing that chain is exactly the kind of troubleshooting this module builds toward.',
    },
    options: [
      { id: 'a', label: 'Local policy applies first and Organisational Unit policy applies last.' },
      { id: 'b', label: 'Because it applies last, an OU-linked GPO can override a conflicting setting from a Domain-linked GPO.' },
      { id: 'c', label: 'A GPO linked to a nested OU closer to the object applies after one linked further up the OU chain, and wins any conflict.' },
      { id: 'd', label: 'Whichever GPO was created most recently always wins, regardless of where it is linked.' },
    ],
    hints: [
      'LSDOU spells out the order: Local, Site, Domain, OU.',
      'Precedence is about link location, not creation date.',
    ],
    solution:
      'A, B, and C. The order is fixed and location-based, and the closer-to-the-object link wins on ' +
      'conflict. D describes something Group Policy does not consider at all: creation time has no ' +
      'bearing on precedence.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'Precedence is determined by where a GPO is linked, not by when it was created.',
      },
    ],
    debrief:
      'Keep LSDOU in your head for the troubleshooting exercise later in this module. "Policy is not ' +
      'applying the way I expect" is very often "something closer in the chain is overriding it," not a ' +
      'broken GPO at all, and knowing the order lets you go find that closer setting instead of ' +
      'guessing.',
    practice: [],
  },
  {
    id: 'win.3.2',
    moduleId: 'win.3',
    packageId: 'windows-ad-foundations',
    order: 2,
    title: 'Why the password policy did nothing',
    kind: 'short-answer',
    goal: 'Explain a genuinely counterintuitive AD default: password policy linked to an OU is silently ignored for domain accounts.',
    prompt:
      'You link a GPO enforcing a 14-character minimum password to the "Finance" OU, expecting it to ' +
      'tighten password requirements for everyone in that OU. It has no effect. In two or three ' +
      'sentences, explain why, and what you would use instead.',
    teach: {
      concept:
        'Most Group Policy settings follow the LSDOU order from the previous exercise: whichever GPO is ' +
        'linked closest to an account wins. Password and account lockout settings for domain accounts ' +
        'are the one major exception to that rule, and it catches almost everyone the first time they ' +
        'run into it.\n\n' +
        'No matter what GPO you link to a specific OU, and no matter how directly it conflicts with the ' +
        'domain-wide setting, Windows only looks at the password and lockout policy from whichever GPO ' +
        'is linked at the very root of the domain, full stop. It ignores anything linked closer to the ' +
        'account for this one category of setting specifically. So a GPO requiring 14-character ' +
        'passwords, linked to a "Finance" OU, is not overruled or ignored by accident, Windows was never ' +
        'designed to check it for this particular setting in the first place.\n\n' +
        'Getting a genuinely different password requirement for one subset of users means reaching for a ' +
        'different tool entirely: a FINE-GRAINED PASSWORD POLICY, technically an object called a ' +
        'Password Settings Object, which is targeted directly at a security group of accounts rather ' +
        'than linked to a place in the OU structure at all. It is a completely separate mechanism from ' +
        'ordinary GPO linking, built specifically to work around this exception.',
    },
    hints: [
      'Password and lockout policy is the one exception to the normal LSDOU precedence rule for domain accounts.',
      'The fix does not involve GPO linking at all.',
      'The feature is called a fine-grained password policy, applied via a Password Settings Object targeted at a group.',
    ],
    solution:
      'Domain account password and lockout policy only takes effect from whichever GPO is linked at the ' +
      'domain root, regardless of what other GPO is linked closer to the OU, so my Finance-linked GPO ' +
      'was simply never consulted for that setting. To enforce a different password policy for one ' +
      'group of users, I would use a fine-grained password policy, a Password Settings Object targeted ' +
      'directly at a security group containing those accounts, rather than relying on OU-linked GPOs at ' +
      'all.',
    expectedOutput: 'An answer naming the domain-root-only rule for password policy and the fine-grained password policy fix.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['domain root', 'domain level', 'domain policy', 'only applies at the domain'],
          ['fine-grained', 'password settings object', 'pso', 'targeted', 'security group'],
        ],
        hint: 'Two ideas: why the OU-linked GPO was never consulted for this setting, and the specific feature that does let you target a subset of users.',
      },
    ],
    debrief:
      'This is exactly the kind of thing a portfolio write-up should mention explicitly, since running ' +
      'into it and figuring out why shows you actually debugged a genuinely non-obvious default, rather ' +
      'than just following a tutorial that happened to route around it without explaining why.',
    practice: [],
  },
  {
    id: 'win.3.3',
    moduleId: 'win.3',
    packageId: 'windows-ad-foundations',
    order: 3,
    title: 'Scoping who a GPO applies to',
    kind: 'multiple-choice',
    goal: 'Distinguish OU linking, security filtering, and WMI filtering as three separate scoping mechanisms.',
    prompt: 'A GPO can be scoped down using several different mechanisms. Which of the following are genuine ways to narrow what a GPO applies to? Select all that apply.',
    teach: {
      concept:
        'Sometimes you do not want a Group Policy to apply to everyone in an OU, only to some of them, ' +
        'and Active Directory gives you three separate tools for narrowing that down, each working at a ' +
        'different level.\n\n' +
        'OU LINKING is the broadest of the three: it decides which container the policy applies within ' +
        'in the first place, and everything from here on narrows that starting point further. SECURITY ' +
        'FILTERING narrows it by requiring whoever the policy would apply to also be a member of a ' +
        'specific security group. By default, a GPO applies to everyone described as "Authenticated ' +
        'Users" within its linked OU, and changing that filtering to a specific group restricts the ' +
        'policy to just that group, even though the OU it is linked to might contain plenty of other ' +
        'accounts. WMI FILTERING narrows it a third way, by running a small query against a target ' +
        'computer\'s own properties, commonly used to apply a setting only to machines running a specific ' +
        'version of Windows.\n\n' +
        'All three of these can be combined on a single GPO at the same time, which means you can reach ' +
        'exactly the specific population you actually mean, a particular group of people, on a ' +
        'particular OS version, inside a particular OU, without having to redesign your whole OU ' +
        'structure every time a new, more specific targeting need shows up.',
    },
    options: [
      { id: 'a', label: 'Security filtering restricts a linked GPO to members of a specific security group.' },
      { id: 'b', label: 'WMI filtering can restrict a GPO to targets matching a query, such as a specific OS version.' },
      { id: 'c', label: 'OU linking alone is the only mechanism that exists; the other two are legacy features with no real use today.' },
      { id: 'd', label: 'Security filtering and OU linking can be combined on the same GPO to reach a narrower population than either alone.' },
    ],
    hints: [
      'Three real, still-used scoping mechanisms exist. One option dismisses two of them as unused, which is false.',
    ],
    solution:
      'A, B, and D. All three mechanisms are current and commonly combined. C is wrong on its face: this ' +
      'exercise just described two of them working exactly as intended.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Security filtering and WMI filtering are both real, actively used scoping mechanisms, not legacy leftovers.',
      },
    ],
    debrief:
      'Security filtering is the one worth knowing cold: it is the direct answer to "how do I apply this ' +
      'GPO to only some of the objects in this OU" without tearing apart and redesigning your OU ' +
      'structure around every new requirement that comes up.',
    practice: [],
  },
  {
    id: 'win.3.4',
    moduleId: 'win.3',
    packageId: 'windows-ad-foundations',
    order: 4,
    title: 'Drive maps, targeting, and when policy actually lands',
    kind: 'multiple-choice',
    goal: 'Understand Group Policy Preferences item-level targeting and the refresh cycle.',
    prompt: 'You use Group Policy Preferences to map a network drive for one department only. Which of the following are true? Select all that apply.',
    teach: {
      concept:
        'Group Policy actually comes in two different flavors that look similar but behave very ' +
        'differently. A Group Policy SETTING, the kind covered so far, is enforced: it gets reapplied ' +
        'automatically and a user cannot get around it by changing it themselves. A Group Policy ' +
        'PREFERENCE, things like a mapped network drive or a configured printer connection, is not ' +
        'enforced the same way, a user is free to change or remove it themselves, Windows just sets it ' +
        'up as a starting point rather than locking it in place.\n\n' +
        'ITEM-LEVEL TARGETING lets a single GPO apply a preference conditionally, for instance mapping a ' +
        'network drive only for members of one specific security group, so you do not need a separate ' +
        'GPO for every single department that needs a different drive mapped.\n\n' +
        'And policy of either kind does not take effect the instant you save it. A client computer only ' +
        'checks in for updated policy on a recurring interval, roughly every 90 minutes by default, with ' +
        'a bit of randomness added to each machine\'s timing so that not every computer in the company ' +
        'hammers the domain controller with a request at exactly the same moment. That delay is exactly ' +
        'why the command `gpupdate /force`, which tells a single computer to check for updated policy ' +
        'right now instead of waiting, is the standard move when you are testing a change and do not ' +
        'want to sit around for up to an hour and a half to see if it worked.',
    },
    options: [
      { id: 'a', label: 'A Group Policy Preference like a drive map can be changed or removed by the user, unlike an enforced policy setting.' },
      { id: 'b', label: 'Item-level targeting lets one GPO apply a preference conditionally, such as only to members of a specific group.' },
      { id: 'c', label: 'Group Policy changes apply to a client the moment they are saved, with no refresh delay.' },
      { id: 'd', label: '`gpupdate /force` is commonly used to apply a change immediately rather than waiting for the normal refresh interval.' },
    ],
    hints: [
      'Preferences and enforced settings are not the same category of thing, and one option confuses them.',
      'Clients refresh policy on an interval, not instantly, which is exactly why a manual refresh command exists.',
    ],
    solution:
      'A, B, and D. Preferences are user-changeable by design, item-level targeting is the real mechanism ' +
      'for conditional application, and gpupdate /force exists precisely because C is false: policy does ' +
      'not land instantly, it waits for the next refresh cycle unless someone forces it.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Policy does not apply the instant it is saved, there is a refresh interval, which is exactly why gpupdate /force exists.',
      },
    ],
    debrief:
      'In a home lab, testing a GPO change and seeing nothing happen is very often just the refresh ' +
      'interval, not a broken policy. Run `gpupdate /force` on the client and check again before you ' +
      'start assuming there is something wrong with the GPO itself.',
    practice: [],
  },
  {
    id: 'win.3.5',
    moduleId: 'win.3',
    packageId: 'windows-ad-foundations',
    order: 5,
    title: 'Policy that will not apply',
    kind: 'short-answer',
    goal: 'Build a troubleshooting checklist for a GPO that does not seem to be taking effect.',
    prompt:
      'A GPO you created and linked to an OU does not seem to be applying to a computer inside it. In ' +
      'three or four sentences, describe the order you would check things in to find out why.',
    teach: {
      concept:
        'A GPO that does not seem to be taking effect on a computer is one of the most common real ' +
        'support tickets in any company using Active Directory, and it genuinely rewards working through ' +
        'a checklist in order rather than guessing at a single cause.\n\n' +
        'First, confirm the GPO is actually LINKED to that OU and that the link is ENABLED, since a GPO ' +
        'that was never linked anywhere, or one whose link was switched off, applies to nothing at all, ' +
        'no matter how correctly it is configured internally. Second, check for BLOCKED INHERITANCE ' +
        'somewhere between where the GPO is linked and the actual object, a setting that deliberately ' +
        'stops policy from a higher level flowing down any further, the same way a locked door on one ' +
        'floor of a building stops something from an upper floor reaching the floors below it. Third, ' +
        'check SECURITY FILTERING from the previous exercises, since the object might sit in exactly the ' +
        'right OU but simply not be a member of the group the GPO is scoped to. Fourth, remember the ' +
        'refresh interval from the last exercise and run `gpupdate /force` before assuming anything is ' +
        'actually broken. And finally, run `gpresult /r` (or the fuller `/h` report) directly on the ' +
        'target machine, which does not make you guess at all, it tells you plainly which GPOs actually ' +
        'applied to that machine and, just as importantly, which ones were filtered out and the specific ' +
        'reason why.',
    },
    hints: [
      'A checklist, not a single cause: link/enabled state, blocked inheritance, security filtering, refresh timing.',
      'One command run on the target machine will actually tell you which GPOs applied and which were filtered, name it.',
    ],
    solution:
      'I would first confirm the GPO link is enabled, since an unlinked or disabled link applies to ' +
      'nothing. I would check whether inheritance is blocked anywhere in the OU chain between the link ' +
      'and the object. I would check the GPO\'s security filtering, since the object could sit in the ' +
      'right OU but not be in the group the policy is scoped to. I would rule out the refresh interval ' +
      'by running gpupdate /force on the client. And finally I would run gpresult /r on the target ' +
      'machine, which directly reports which GPOs applied and which were filtered out and why, rather ' +
      'than guessing.',
    expectedOutput: 'An ordered checklist covering link/enabled state, blocked inheritance, security filtering, refresh timing, and gpresult.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['linked', 'enabled', 'inheritance', 'blocked'],
          ['security filtering', 'filtering', 'group membership'],
          ['gpresult', 'gpupdate'],
        ],
        hint: 'Cover the link/inheritance state, security filtering, and name the diagnostic command (gpresult) that actually tells you what applied.',
      },
    ],
    debrief:
      '`gpresult /r` is worth memorizing specifically. It is the single command that turns "I think ' +
      'this GPO should be applying" into a direct, factual list of what did and did not apply, and why, ' +
      'which is the entire difference between troubleshooting with evidence and troubleshooting by ' +
      'guessing.',
    practice: [],
  },
];

// --- Module win.4: domain join and troubleshooting ---------------------------

const MODULE_WIN_4: Exercise[] = [
  {
    id: 'win.4.1',
    moduleId: 'win.4',
    packageId: 'windows-ad-foundations',
    order: 1,
    title: 'What has to be true before a join can succeed',
    kind: 'multiple-choice',
    goal: 'List the prerequisites for a clean domain join.',
    prompt: 'Which of the following need to be true for a Windows client to successfully join a domain? Select all that apply.',
    teach: {
      concept:
        'Joining a domain means telling a Windows computer "stop trusting only your own local list of ' +
        'accounts, and start trusting the domain controller\'s list instead." For that handoff to ' +
        'succeed, a handful of things have to already be true, most of which trace back to ideas covered ' +
        'earlier in this package.\n\n' +
        'The client\'s DNS setting has to be able to resolve the domain\'s SRV records, the same lookup ' +
        'covered back in win.1.2, which in practice almost always means the computer needs to be pointed ' +
        'at the domain controller itself for DNS, not at a router or an outside internet resolver that ' +
        'has never heard of this domain. The client\'s clock has to be close enough to the domain ' +
        'controller\'s clock, within Kerberos\'s tolerance, by default around five minutes, the same ' +
        'requirement covered in win.1.3, or logins will fail even after the join technically finishes. ' +
        'The account actually performing the join needs permission to create a new computer object in ' +
        'the domain, either full domain administrator rights or a narrower, delegated right scoped to ' +
        'just that task. And the computer\'s own name has to be unique within the domain, since joining ' +
        'with a name that collides with an existing computer account either fails outright or, depending ' +
        'on configuration, silently takes over the wrong existing object.\n\n' +
        'Notice that this is largely the same short list from win.1.3, applied to a client machine ' +
        'instead of to the domain controller itself. That repetition is not an accident, the same few ' +
        'things (DNS, time, and permissions) turn out to matter constantly throughout real AD work.',
    },
    options: [
      { id: 'a', label: 'The client must be able to resolve the domain\'s DNS records, which usually means pointing DNS at the DC.' },
      { id: 'b', label: 'The client\'s clock must be within Kerberos\'s tolerance of the DC\'s clock.' },
      { id: 'c', label: 'The account performing the join needs rights to create a computer object in the domain.' },
      { id: 'd', label: 'The client\'s computer name must be unique within the domain.' },
      { id: 'e', label: 'The client must already have a user account created in Active Directory before it can join.' },
    ],
    hints: [
      'Four are genuine prerequisites. One confuses computer accounts with user accounts.',
      'A computer account is created automatically at join time, it is not a pre-existing requirement.',
    ],
    solution:
      'A, B, C, and D. All four are real gates on a successful join. E is false: nothing about joining a ' +
      'domain requires a user account to already exist, the computer account itself is created as part ' +
      'of the join, and any domain user can then log onto the machine once it is joined.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'A computer account is created automatically during the join itself, it is not a pre-existing user account requirement.',
      },
    ],
    debrief:
      'Notice that three of the four real prerequisites here (DNS, time, and account rights) are ' +
      'exactly the same things you checked before promoting the domain controller back in win.1.3. The ' +
      'same short checklist keeps showing up across AD work, which is worth noticing and reusing rather ' +
      'than treating every new failure as something completely unfamiliar.',
    practice: [],
  },
  {
    id: 'win.4.2',
    moduleId: 'win.4',
    packageId: 'windows-ad-foundations',
    order: 2,
    title: 'The domain cannot be found',
    kind: 'short-answer',
    goal: 'Diagnose the most common domain-join failure correctly.',
    prompt:
      'A client fails to join the domain with an error saying the domain could not be found, even ' +
      'though you can ping the domain controller\'s IP address successfully from the client. In two or ' +
      'three sentences, say what you would check first, and why pinging the DC did not rule it out.',
    teach: {
      concept:
        'A successful ping only proves one narrow thing: that a signal sent to an address got a response ' +
        'back. It says absolutely nothing about whether the sending computer can look up the right DNS ' +
        'records, the ones covered back in win.1.2, that the domain-join process actually depends on to ' +
        'find a domain controller in the first place.\n\n' +
        'So when a client fails to join with a "domain could not be found" error despite pinging the ' +
        'domain controller\'s IP address successfully, the first thing worth checking is not the network ' +
        'at all, it is the client\'s own DNS server setting, meaning which DNS server that computer is ' +
        'configured to actually ask. If it is pointed at a home router, an ISP\'s resolver, or anything ' +
        'other than the domain\'s own DNS server, it has no way to find the SRV records that locate a ' +
        'domain controller, and the join fails with exactly this kind of error even though the raw ' +
        'network path to that domain controller works completely fine.\n\n' +
        'This is the same distinction from win.1.2, that reachability and name resolution are two ' +
        'entirely separate things, showing up here as a concrete, practical troubleshooting step instead ' +
        'of an abstract idea.',
    },
    hints: [
      'What does a successful ping actually prove, and what does it not prove?',
      'The join process depends on DNS SRV records, not on raw IP reachability.',
      'Check what DNS server the client is actually configured to use.',
    ],
    solution:
      'I would check the client\'s DNS server setting first, since pinging an IP only proves basic ' +
      'network reachability and says nothing about name resolution. If the client is pointed at a ' +
      'router or a public resolver instead of the domain\'s own DNS server, it has no way to find the ' +
      'SRV records the join process depends on to locate a domain controller, which produces exactly ' +
      'this error even though the network path to the DC itself works fine.',
    expectedOutput: 'An answer naming the client DNS setting as the first check, and explaining why ping does not rule that out.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['dns', 'resolve', 'srv record', 'name resolution'],
          ['ping', 'reachab', 'network path', 'does not prove', 'only proves'],
        ],
        hint: 'Name the DNS setting as the actual first check, and explain specifically why a successful ping does not already rule that out.',
      },
    ],
    debrief:
      'This exact scenario, a working ping paired with a failed join, is the single most common ' +
      '"gotcha" people run into building their first AD home lab, usually because their client machine ' +
      'is still quietly using the router\'s own default DHCP-assigned DNS server instead of being ' +
      'pointed at the domain controller.',
    practice: [],
  },
  {
    id: 'win.4.3',
    moduleId: 'win.4',
    packageId: 'windows-ad-foundations',
    order: 3,
    title: 'The trust relationship failed',
    kind: 'multiple-choice',
    goal: 'Understand what "the trust relationship between this workstation and the primary domain failed" actually means and how to fix it.',
    prompt:
      'A previously working domain-joined machine now shows "the trust relationship between this ' +
      'workstation and the primary domain failed" at login. Which of the following are accurate about ' +
      'this error? Select all that apply.',
    teach: {
      concept:
        'The computer account has its own password, separate from any user\'s, which Windows silently ' +
        'rotates on a schedule (every 30 days by default). This error means the password the machine ' +
        'has locally no longer matches what the DC has on record for that computer account, most ' +
        'commonly because the machine was restored from an old snapshot or backup taken before the ' +
        'last rotation, or because someone reset or deleted the computer account in Active Directory. ' +
        'The fix is not a user password reset, since this has nothing to do with any user account, it ' +
        'is to reset the computer account\'s secure channel, most simply by removing the machine from ' +
        'the domain and rejoining it, which re-establishes a fresh, matching password on both sides.',
    },
    options: [
      { id: 'a', label: 'This error is about the computer account\'s own password being out of sync with the DC, unrelated to any user password.' },
      { id: 'b', label: 'Restoring a machine from an old VM snapshot taken before a scheduled password rotation is a common cause.' },
      { id: 'c', label: 'Resetting the affected user\'s domain password will fix this error.' },
      { id: 'd', label: 'Removing the machine from the domain and rejoining it re-establishes a matching computer account password.' },
    ],
    hints: [
      'This error is specifically about the computer account, not any user account.',
      'One option proposes a fix that targets the wrong account type entirely.',
    ],
    solution:
      'A, B, and D. This is entirely a computer-account problem, and VM snapshots are a genuinely common ' +
      'real-world cause of it because they roll the machine\'s stored password back in time. C is the ' +
      'trap: resetting a user\'s password does nothing here, because the broken trust is between the ' +
      'machine and the domain, not the person and the domain.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'This error concerns the computer account\'s password, not any user\'s, so a user password reset will not fix it.',
      },
    ],
    debrief:
      'This is worth calling out by name in a portfolio write-up if you hit it, because it is exactly ' +
      'the kind of failure a tutorial-follower never sees (nobody\'s lab VM gets snapshotted and rolled ' +
      'back mid-tutorial) but a real environment produces constantly.',
    practice: [],
  },
  {
    id: 'win.4.4',
    moduleId: 'win.4',
    packageId: 'windows-ad-foundations',
    order: 4,
    title: 'Confirming a join actually worked',
    kind: 'multiple-choice',
    goal: 'Go beyond "the wizard said success" to real verification.',
    prompt: 'Which of the following are legitimate ways to confirm a domain join actually succeeded, beyond the join wizard\'s own success message? Select all that apply.',
    teach: {
      concept:
        'The join wizard reporting success confirms the join request completed, it does not confirm the ' +
        'machine is now behaving as a real domain member day to day. Stronger evidence includes: the ' +
        'computer object appearing in the correct OU in Active Directory Users and Computers, a domain ' +
        'user (not a local account) being able to log in interactively, `whoami /fqdn` or `systeminfo` ' +
        'on the client reporting the correct domain, and a Group Policy actually applying, confirmed with ' +
        '`gpresult /r`, which proves the machine is both joined and receiving policy, not just present in ' +
        'the directory.',
    },
    options: [
      { id: 'a', label: 'The computer object appears in Active Directory Users and Computers in the expected OU.' },
      { id: 'b', label: 'A domain user account can log in to the machine interactively.' },
      { id: 'c', label: 'Only the join wizard\'s own success message is needed; nothing else meaningfully adds confidence.' },
      { id: 'd', label: 'gpresult /r on the client shows a domain GPO actually applied.' },
    ],
    hints: [
      'Three of these are genuine, independent pieces of evidence. One dismisses everything except the weakest signal.',
    ],
    solution:
      'A, B, and D. Each is independent evidence that the machine is behaving as a real domain member, ' +
      'not just that a wizard reported success. C undersells what you should actually verify, especially ' +
      'for a portfolio project where "it worked" needs to be demonstrable.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'A wizard\'s success message is the weakest evidence available; several stronger, independent checks exist.',
      },
    ],
    debrief:
      'This is a direct answer to a very practical portfolio question: what do you actually screenshot? ' +
      'The computer object in the right OU, a domain login, and a gpresult /r output are all far more ' +
      'convincing to a reviewer than a single "join successful" dialog.',
    practice: [],
  },
  {
    id: 'win.4.5',
    moduleId: 'win.4',
    packageId: 'windows-ad-foundations',
    order: 5,
    title: 'Proving it works, for a hiring manager',
    kind: 'short-answer',
    goal: 'Turn "domain join succeeded" into evidence a reviewer would actually trust.',
    prompt:
      'You are writing up this home lab for a portfolio. A screenshot of the "welcome to the domain" ' +
      'dialog is not convincing on its own. In two or three sentences, describe what else you would ' +
      'demonstrate to prove the domain is actually functioning end to end, not just that one join ' +
      'wizard succeeded.',
    teach: {
      concept:
        'Think about the difference between telling someone you did a job and actually showing them it ' +
        'works. Saying "I built a house" proves nothing on its own, but a working front door lock, water ' +
        'that runs when you turn the tap, and lights that come on when you flip a switch prove the house ' +
        'genuinely functions as a house, not just that it has walls and a roof. A domain login deserves ' +
        'the same skepticism, because what looks like one moment, typing a password and getting in, is ' +
        'actually three separate systems working correctly in sequence, and any one of them can be broken ' +
        'while the other two still work fine.\n\n' +
        'The first of those three is AUTHENTICATION: the domain controller confirming this really is who ' +
        'they claim to be, using Kerberos tickets instead of each machine keeping its own private ' +
        'password list, the mechanism covered back in win.1.1. The second is GROUP POLICY, covered in ' +
        'win.3.1, settings that get pushed down and applied automatically once that login succeeds, ' +
        'things like a network drive mapping itself or a screen lock timer being enforced, without anyone ' +
        'touching that machine by hand. The third is AUTHORISATION: whether that now-logged-in person can ' +
        'actually open a specific shared folder or run a specific application, which depends entirely on ' +
        'which security groups they belong to, covered in win.2.3, and has nothing to do with whether the ' +
        'login itself succeeded. A person can authenticate perfectly and still be authorised for almost ' +
        'nothing, those are genuinely separate questions with separate answers.\n\n' +
        'A join wizard\'s "welcome to the domain" dialog only proves the join request itself completed. ' +
        'It says nothing about whether authentication, policy, and authorisation are actually working for ' +
        'a real person doing real work afterward, which is exactly why it is not convincing on its own. A ' +
        'screenshot of a domain user logging in demonstrates authentication is working. A screenshot of ' +
        '`gpresult /r`, or a mapped drive appearing without anyone configuring it by hand, demonstrates ' +
        'policy is actually reaching that machine. And a screenshot of that same user opening a shared ' +
        'folder that only a specific security group can reach demonstrates authorisation is wired up ' +
        'correctly too, three independent pieces of evidence instead of one.\n\n' +
        'This matters on the job because a hiring manager reading a portfolio write-up is not checking ' +
        'whether you clicked "Join" successfully, plenty of tutorials get that far without the person ' +
        'following them understanding anything. They are checking whether you understand that a working ' +
        'domain is three separate, cooperating systems, and whether you can prove each one is genuinely ' +
        'doing its job rather than just describing the finished result in a sentence.',
    },
    hints: [
      'A single screenshot proves a moment, not a working system. What sequence proves the whole chain?',
      'Think authentication, then policy, then authorisation, each demonstrated separately.',
    ],
    solution:
      'I would show a domain user, not a local account, logging into the joined machine, then show a ' +
      'linked GPO actually taking effect, either a mapped drive appearing or a gpresult /r output listing ' +
      'the applied policy, and finally show that user accessing a domain resource, like a shared folder, ' +
      'that only works because of group membership granted through Active Directory. That sequence ' +
      'demonstrates authentication, policy, and authorisation all genuinely working together, rather than ' +
      'just that a join wizard reported success once.',
    expectedOutput: 'An answer describing a domain login, a GPO actually applying, and access to a resource gated by group membership.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['domain user', 'log in', 'login', 'sign in'],
          ['gpo', 'group policy', 'gpresult', 'drive map', 'policy applied'],
          ['resource', 'share', 'folder', 'access'],
        ],
        hint: 'Cover the three-part chain: a domain login, a GPO visibly taking effect, and access to a resource gated by group membership.',
      },
    ],
    debrief:
      'This closes the loop on the whole lab. Promotion, users and groups, Group Policy, and joining a ' +
      'client are not four separate demonstrations, they are one system, and authentication, policy, and ' +
      'authorisation are the three threads that tie them together. Proving all three work is worth far ' +
      'more in a portfolio than proving any one of them worked in isolation, because it is the difference ' +
      'between "I followed the steps" and "I understand what the steps actually did."',
    practice: [],
  },
];

// --- the package -------------------------------------------------------------

export const WINDOWS_AD_FOUNDATIONS: LearningPackage = {
  id: 'windows-ad-foundations',
  order: 21,
  title: 'Active Directory Home Lab',
  summary:
    'Promote a domain controller, organise users and groups with OUs, enforce policy at scale with ' +
    'Group Policy, and join a client, then know exactly what to check when any one of those steps ' +
    'quietly does not work.',
  outcomes: [
    'Explain what actually changes when a server is promoted to a Domain Controller, and why it depends on DNS',
    'Choose the right account and group type for a given job, and scope access through groups rather than individuals',
    'Predict how Group Policy precedence, security filtering, and the domain-root password policy exception behave',
    'Diagnose the most common domain-join failures, including a broken computer-account trust relationship',
  ],
  prerequisites: ['linux-fundamentals'],
  modules: [
    {
      id: 'win.1',
      packageId: 'windows-ad-foundations',
      order: 1,
      title: 'The Domain Controller',
      summary: 'What promotion changes, why DNS is load-bearing, and why one DC is a real design flaw.',
      exercises: MODULE_WIN_1,
    },
    {
      id: 'win.2',
      packageId: 'windows-ad-foundations',
      order: 2,
      title: 'Users, Groups, and OUs',
      summary: 'Account and group types, what an OU actually scopes, and why access lives in groups.',
      exercises: MODULE_WIN_2,
    },
    {
      id: 'win.3',
      packageId: 'windows-ad-foundations',
      order: 3,
      title: 'Group Policy',
      summary: 'Precedence, scoping mechanisms, the password-policy exception, and troubleshooting a GPO that will not apply.',
      exercises: MODULE_WIN_3,
    },
    {
      id: 'win.4',
      packageId: 'windows-ad-foundations',
      order: 4,
      title: 'Domain Join and Troubleshooting',
      summary: 'Join prerequisites, the DNS-not-reachability trap, the trust relationship error, and proving it actually works.',
      exercises: MODULE_WIN_4,
    },
  ],
};
