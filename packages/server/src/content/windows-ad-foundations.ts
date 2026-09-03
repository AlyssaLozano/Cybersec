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
        'A member server and a Domain Controller are not the same machine with a different label. ' +
        'Promotion installs Active Directory Domain Services and turns the box into the thing that ' +
        'holds the domain database (NTDS.dit), replicates it to any other DC in the domain, and ' +
        'answers Kerberos authentication requests for every account and computer that joins. It also ' +
        'almost always becomes a DNS server for the domain, because clients locate a DC by querying ' +
        'DNS for SRV records, not by any address you type in by hand.\n\n' +
        'None of that is true of an ordinary joined server. A file server that has been domain-joined ' +
        'for years holds no copy of the directory and issues no tickets, it just trusts the DC to ' +
        'vouch for whoever shows up.',
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
      'Hold onto the DNS point specifically. A huge share of "the domain is broken" tickets turn ' +
      'out to be a DNS problem wearing an Active Directory costume, because nothing about ' +
      'authentication works if a client cannot find the DC in the first place.',
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
        'Active Directory does not locate services by IP address, it locates them by querying DNS ' +
        'for specific SRV records: `_ldap._tcp.dc._msdcs.<domain>` finds a DC, `_kerberos._tcp` finds ' +
        'a ticket-granting server, and so on. A client that cannot resolve those records cannot find ' +
        'a domain controller at all, no matter how reachable that DC actually is on the network. This ' +
        'is why "can this host ping the DC" is the wrong first question during a join failure, and ' +
        '"is this host using the right DNS server" is the right one.',
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
      'Keep this exact distinction for module win.4: "cannot reach the DC" and "cannot find the DC" ' +
      'are different failures with different fixes, and telling them apart starts with checking DNS ' +
      'settings before anything else.',
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
        'A promotion that half-works is harder to fix than one that fails outright, so the checklist ' +
        'is worth doing in order rather than discovering gaps afterward.\n\n' +
        'A STATIC IP is first: a DC that changes address breaks every client pointed at it, and DHCP ' +
        'assumes a DC exists to hand out leases from, which is circular on a DC itself.\n\n' +
        'The server\'s DNS setting should point AT ITSELF (or another DC once one exists), because the ' +
        'promotion wizard creates the domain\'s DNS zone and the server needs to be able to query it ' +
        'immediately.\n\n' +
        'Time matters more than it looks: Kerberos rejects any ticket exchange where the two clocks ' +
        'differ by more than five minutes by default, so a server with a wildly wrong clock will let ' +
        'you promote it and then fail every authentication afterward in a way that looks unrelated.\n\n' +
        'And enough disk space for the database and SYSVOL, plus a hostname that will not need to ' +
        'change, since renaming a DC after promotion is its own separate headache.',
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
      'The clock requirement is the one people skip and regret. A lab built on a VM whose clock drifts ' +
      'every time the host sleeps will promote successfully and then fail authentication days later, ' +
      'and nothing about that failure will mention time unless you already know to suspect it.',
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
        'Losing the only DC does not just take down one server, it takes down authentication for ' +
        'every joined machine, because there is nowhere left to issue a Kerberos ticket from. Certain ' +
        'operations master roles (the FSMO roles: things like the schema master and the PDC emulator) ' +
        'exist on exactly one DC at a time by design, and if that DC is gone permanently, seizing those ' +
        'roles onto a surviving DC is a deliberate recovery procedure, not something that happens on ' +
        'its own. A second DC also means AD replication has somewhere to send changes, which is itself ' +
        'a form of backup: a change made on one DC exists on another within minutes.',
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
      'A one-DC lab is still the right way to learn this material, just say so honestly in a portfolio ' +
      'write-up rather than presenting it as production-ready. Naming the limitation is worth more to ' +
      'a reviewer than pretending it does not exist.',
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
        'A workstation compromise usually gives an attacker one user\'s access. A domain controller ' +
        'holds the database that every other machine trusts to say who everyone is and what they are ' +
        'allowed to do, so compromising it gives an attacker the ability to impersonate, or directly ' +
        'control, any account in the domain, including the administrators. In practice that means ' +
        'creating new accounts, changing group membership, resetting any password, and extracting ' +
        'password hashes for every user that has ever authenticated, which is why "the DC was ' +
        'compromised" and "we have to assume every credential in the domain is burned" are treated as ' +
        'the same sentence.',
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
      'This is the sentence that justifies every other control in this module: patching a DC harder ' +
      'than a normal server, restricting who can log onto it, and never treating "one DC" as production ' +
      'ready are all downstream of this single fact.',
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
        'A USER ACCOUNT represents a person and is what someone signs in with. A COMPUTER ACCOUNT ' +
        'represents a joined machine itself, created automatically at join time, with its own password ' +
        'that Windows rotates on a schedule, and it is what makes the machine (not any particular user ' +
        'on it) a trusted member of the domain. A SERVICE ACCOUNT represents a piece of software rather ' +
        'than a person, used to run something like a scheduled task or an application pool under an ' +
        'identity that is not tied to any one employee, and it is a common target because it is often ' +
        'over-privileged and its password is rarely changed.',
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
      'Keep the computer account in mind for module win.4: "the trust relationship between this ' +
      'workstation and the domain has failed" is almost always the computer account\'s password going ' +
      'out of sync, nothing to do with the user at all.',
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
        'A SECURITY GROUP can be granted permissions on a resource (a file share, an application, a ' +
        'GPO via security filtering) and can also receive email if mail-enabled. A DISTRIBUTION GROUP ' +
        'can only receive email, it has no security identifier that a permissions system can reference, ' +
        'so it cannot be put on an access control list at all. Using a distribution group for folder ' +
        'access is not a smaller version of the right answer, it silently does nothing: the group ' +
        'simply will not appear as an option to grant permissions to, or worse, an administrator ' +
        'creates a security group with the same name and the two get confused over time.',
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
      'This is a genuinely common home-lab mistake: creating a distribution group, adding people to it, ' +
      'and then being unable to find it when granting NTFS permissions. If a group is not showing up ' +
      'where you expect, check its type first.',
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
        'An OU is a container used to organise objects and scope two specific things: which Group ' +
        'Policy Objects apply to what is inside it, and which administrative rights can be delegated ' +
        'over it, for example letting a help desk group reset passwords only for users in one OU. What ' +
        'an OU is NOT is a permissions boundary in the file-share sense: putting a user in an OU grants ' +
        'them no access to anything by itself, and does not restrict what they can see or do on ' +
        'resources. That job belongs to security groups and access control lists, not the container an ' +
        'account happens to live in.',
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
      'This distinction is worth stating explicitly in a portfolio write-up: "I used OUs to scope GPOs ' +
      'and security groups to grant access" shows you understand the two mechanisms are separate, which ' +
      'is exactly what a reviewer is checking for.',
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
        'Two hundred accounts through a GUI, one dialog at a time, is not just slow, it is a two ' +
        'hundred-times repeated opportunity to fat-finger a department code or forget a group. ' +
        'Scripting the creation, typically reading from a CSV with each new hire\'s details and looping ' +
        'a creation command over it (PowerShell\'s New-ADUser is the standard tool for this), makes the ' +
        'output consistent by construction: every account gets the same attribute format, lands in the ' +
        'correct OU, and picks up the correct starting groups, because the same code ran for all two ' +
        'hundred rather than a person doing it slightly differently each time. It is also the difference ' +
        'between an afternoon and a week, and between a mistake that is easy to grep for in a script and ' +
        'one that is invisible until someone notices the wrong person has file access.',
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
      'This is a genuinely good portfolio talking point: "I scripted bulk account creation from a CSV" ' +
      'demonstrates PowerShell competency and operational judgement in one sentence, which is exactly ' +
      'what the entry-level ticket says a hiring manager is looking for.',
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
        'Granting permission directly to twelve individual users means twelve separate access control ' +
        'entries to audit, and a new hire who needs the same access requires editing the resource\'s ' +
        'permissions itself. Granting permission once to a group, and managing membership instead, ' +
        'means the resource\'s permissions never change: onboarding and offboarding become a single ' +
        'group-membership edit, and an access review only has to answer "who is in this group" rather ' +
        'than reading permissions off every resource in the company one at a time.',
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
      'around: group-based access is what makes joiner-mover-leaver manageable at any real scale, and it ' +
      'starts here, with how you set up a share in a home lab.',
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
        'LSDOU is Local policy, then Site, then Domain, then OU, applied in that sequence, with each ' +
        'later one able to override the ones before it. Because OU-linked policy applies last, of the ' +
        'built-in scopes it wins any direct conflict, and if an object sits in a nested OU, the closest ' +
        'OU to the object applies last of all and therefore wins over a GPO linked further up the ' +
        'chain. This is why "I set the domain password policy to require 14 characters, but this one OU ' +
        'still allows 8" is not a bug: something closer to those accounts is overriding it.',
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
      'Keep LSDOU in your head for the troubleshooting exercise later in this module: "policy is not ' +
      'applying the way I expect" is very often "something closer in the chain is overriding it", not a ' +
      'broken GPO at all.',
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
        'This is one of the most common surprises in a first AD lab. The Default Domain Policy\'s ' +
        'password and account lockout settings apply to domain user accounts at the domain level only, ' +
        'regardless of what OU a GPO enforcing different values is linked to, because Windows applies ' +
        'those particular settings from whichever GPO is linked at the domain root, not the closest one ' +
        'in the OU chain the way most other settings work. Getting different password requirements for ' +
        'a subset of users means using a FINE-GRAINED PASSWORD POLICY (a Password Settings Object) ' +
        'targeted at a specific security group instead of relying on GPO linking at all.',
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
      'This is exactly the kind of thing a portfolio write-up should mention explicitly, since it shows ' +
      'you debugged a genuinely non-obvious default rather than just following a tutorial that happened ' +
      'to avoid it.',
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
        'OU LINKING sets the broadest scope: which container the policy applies within. SECURITY ' +
        'FILTERING narrows it further by requiring the target to be a member of a specific security ' +
        'group (by default a GPO applies to Authenticated Users within its linked OU, and changing the ' +
        'security filtering to a specific group restricts it to just that group even though the link ' +
        'covers a wider OU). WMI FILTERING narrows by a query against the target machine\'s properties, ' +
        'commonly used to apply a policy only to a specific operating system version. All three can be ' +
        'combined on the same GPO to reach exactly the population you mean, rather than restructuring ' +
        'your entire OU layout every time a new targeting requirement shows up.',
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
      'Security filtering is the one worth knowing cold: it is the answer to "how do I apply this GPO to ' +
      'only some of the objects in this OU" without redesigning your OU structure around it.',
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
        'Group Policy PREFERENCES (drive maps, printer connections, and similar) differ from Group ' +
        'Policy SETTINGS in one important way: preferences are not strictly enforced, a user can change ' +
        'or remove them, whereas a true policy setting is reapplied and cannot be overridden by the ' +
        'user. Item-level targeting lets a single GPO apply a preference conditionally, for example ' +
        'mapping a drive only for members of a specific security group, without needing a separate GPO ' +
        'per department. And policy does not apply instantly: clients refresh on an interval (roughly ' +
        'every 90 minutes by default, with some randomised offset to avoid every machine hammering the ' +
        'DC at once), which is why forcing an immediate refresh with `gpupdate /force` is the standard ' +
        'move when testing a change rather than waiting.',
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
      'interval, not a broken policy. Run gpupdate /force on the client and check again before you ' +
      'start troubleshooting the GPO itself.',
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
        'This is one of the most common real tickets in an AD environment, and it rewards a checklist ' +
        'rather than guessing. First, confirm the GPO is actually LINKED and ENABLED, an unlinked GPO or ' +
        'one with its link disabled applies to nothing. Second, check for BLOCKED INHERITANCE somewhere ' +
        'in the OU chain between the link and the object, which stops policy from a higher level flowing ' +
        'down. Third, check SECURITY FILTERING, the object might not be in the group the GPO is scoped ' +
        'to even though it sits in the right OU. Fourth, remember the REFRESH INTERVAL and run `gpupdate ' +
        '/force` before assuming anything is broken. And finally, `gpresult /r` (or the fuller `/h` ' +
        'report) run on the target machine tells you directly which GPOs actually applied and, crucially, ' +
        'which were filtered out and why, which turns guessing into reading an answer.',
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
      'gpresult /r is worth memorising specifically: it is the single command that turns "I think this ' +
      'GPO should be applying" into a direct list of what did and did not, and why, which is the entire ' +
      'difference between troubleshooting and guessing.',
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
        'The client\'s DNS server setting has to be able to resolve the domain\'s SRV records, which in ' +
        'practice almost always means pointing it at the DC itself rather than a public or ISP resolver. ' +
        'The client\'s clock has to be within Kerberos\'s tolerance of the DC\'s clock, by default around ' +
        'five minutes, or authentication will fail even once the join technically completes. The account ' +
        'performing the join needs rights to create a computer object, either full domain admin or a ' +
        'delegated right scoped to just that. And the machine name has to be unique in the domain, ' +
        'joining with a name that collides with an existing computer account fails or silently reuses ' +
        'the wrong object depending on how it is configured.',
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
      'Notice that three of the four real prerequisites (DNS, time, and account rights) are exactly the ' +
      'same things you checked before promoting the DC in win.1.3. The same short checklist shows up ' +
      'again and again in AD work, which is worth noticing rather than treating each failure as new.',
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
        'Pinging an IP address only proves basic network reachability, it says nothing about whether the ' +
        'client can resolve the DNS records the join process actually depends on. The first thing to ' +
        'check is the client\'s DNS server setting: if it is pointed at a router, an ISP resolver, or ' +
        'anything other than the domain\'s own DNS server, it has no way to find the SRV records that ' +
        'locate a domain controller, and the join fails with exactly this kind of error even though the ' +
        'network path to the DC is fine. This is the same distinction from win.1.2, reachability and ' +
        'name resolution are not the same thing, showing up as a concrete troubleshooting step.',
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
      'This exact scenario, a working ping and a failed join, is the single most common "gotcha" people ' +
      'hit building their first AD home lab, usually because their client is still using the router\'s ' +
      'default DHCP-assigned DNS server instead of the domain controller.',
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
        'A single success dialog proves one moment worked. A reviewer looking at a portfolio project is ' +
        'really asking "do they understand what this system does", and the strongest way to show that is ' +
        'demonstrating the whole chain: log in as a domain user rather than a local account, show a ' +
        'linked GPO actually taking effect on the client (a mapped drive appearing, or `gpresult /r` ' +
        'listing the applied policy), and access a domain resource such as a shared folder that only ' +
        'works because of group membership granted through Active Directory. That sequence proves ' +
        'authentication, policy, and authorisation are all genuinely working together, not just that a ' +
        'join button was clicked once.',
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
      'This closes the loop on the whole lab: promotion, users and groups, Group Policy, and joining a ' +
      'client are not four separate demonstrations, they are one system, and proving that they work ' +
      'together is worth far more in a portfolio than proving each one worked in isolation.',
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
