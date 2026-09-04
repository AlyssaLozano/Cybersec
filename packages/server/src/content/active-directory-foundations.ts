/**
 * Active Directory Foundations -- 18 exercises across 5 modules.
 *
 * THE FRAME
 *
 * There is no simulated Active Directory service anywhere in this codebase,
 * and building a live one is out of scope: the terminal engine has exactly
 * one filesystem and one machine, and both already belong to rmg-web-02, a
 * Linux web server. What this package teaches instead is the form a SOC
 * analyst actually meets most AD evidence in: an export somebody already ran.
 * IT collected a hygiene review of the Ridgeline Med domain -- user and group
 * exports, a Kerberos ticket cache, an LDAP dump, and the security events
 * around it -- and dropped it all under /opt/ad-audit/ for the SOC team to
 * read. Every exercise here is a student reading those files the same way
 * log-analysis.ts teaches auth.log: cat, grep, wc, and a pipe.
 *
 * This complements windows-ad-foundations.ts rather than duplicating it: that
 * package teaches building and administering a domain (promotion, OUs, GPOs,
 * domain join), judgement content with no terminal. This one teaches reading
 * evidence from a domain that already exists, the investigative half of the
 * same subject, hands-on against the real terminal engine.
 *
 * THE THREAD
 *
 * The five modules are not independent. bfoster, a Marketing account, turns
 * up in Domain Admins in module 2 with nothing in their job to explain it.
 * svc-sql turns up in module 3 as the one ticket in the cache using weak RC4
 * encryption instead of AES, and again in module 4 with a password that
 * never expires. Module 5 closes the loop: svc-sql's ticket is the one in
 * the kerberoasting hash dump, and bfoster is the account that requested it,
 * along with a burst of tickets for services it had no reason to touch. None
 * of that is asserted in prose; every module's checks are derived from the
 * same structured records in ad-audit-fixtures.ts, so the story is a
 * consequence of the data rather than a claim sitting next to it.
 *
 * WHY GREP HERE NEVER REACHES ACROSS LINES
 *
 * This simulator's grep does not implement -A, -B, or -C: it accepts them
 * without erroring, but no context lines are ever added. Every exercise
 * below is written so the fact it asks for sits entirely on the one line its
 * grep pattern matches, or asks for a whole small file with cat when the
 * answer genuinely needs more than one line at once.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

import {
  AD_USERS,
  ANOMALOUS_ADMIN,
  ANOMALOUS_ADMIN_SAM,
  DC_HOSTNAME,
  DISABLED_USERS,
  DISTINCT_OUS,
  DOMAIN_ADMINS,
  DOMAIN_DNS,
  DOMAIN_FUNCTIONAL_LEVEL,
  EVENT_4769_ALL,
  KERBEROAST_TARGET_SAM,
  KERBEROS_TICKETS,
  NOTABLE_LDAP_ENTRY,
  UAC_DONT_EXPIRE_PASSWORD,
  WEAK_TICKET,
  AES_TICKET_COUNT,
  BURST_EVENT_COUNT,
} from '../vfs/data/ad-audit-fixtures.js';

const AUDIT = '/opt/ad-audit';

// --- Module 1: what a domain actually is ----------------------------------------

const MODULE_1: Exercise[] = [
  {
    id: 'ad.1.1',
    moduleId: '1',
    packageId: 'active-directory-foundations',
    order: 1,
    title: 'Find the domain name',
    kind: 'terminal',
    goal: 'Extract the DNS name of the domain from a domain-info export.',
    prompt: `IT exported the domain's basic details to ${AUDIT}/domain-info.txt. Find its DNS domain name.`,
    teach: {
      concept:
        'Start from the problem a domain solves. A company might have ten computers or a thousand, and for each one to work, something has to decide who is allowed to log into it and with what password. If every computer kept its own separate list of allowed users, adding a new employee would mean walking around creating their account on every single machine by hand, and disabling someone who was just fired would mean repeating that walk, hoping nothing gets missed. A DOMAIN is the answer to that problem: one central list of every user, computer, and group, held on a server, that every other computer on the network trusts instead of keeping a list of its own. This whole package is about a domain called ridgelinemed.example.\n\n' +
        'Like a company, a domain needs a name to identify it, and it actually carries two. Its DNS name (ridgelinemed.example, here) is the same kind of name you already know from web addresses. It also keeps a shorter NetBIOS name, a leftover from an older version of Windows, kept around only so old software that has never heard of DNS can still find the domain. `Get-ADDomain`, the PowerShell command that produced this export, is how an administrator asks a domain about its own basic facts, and it answers as a flat list of labelled lines, one fact per line, the same shape /etc/resolv.conf or /etc/sshd_config already taught you to read: a label, then the value.',
      syntax: 'grep "LABEL" FILE',
      examples: [
        { command: `grep "Forest" ${AUDIT}/domain-info.txt`, explains: 'A related field: the forest this domain belongs to, which can span several domains in a larger organisation.' },
      ],
    },
    hints: [
      `The file is ${AUDIT}/domain-info.txt.`,
      'Search for the line labelled DNSRoot.',
    ],
    solution: `grep "DNSRoot" ${AUDIT}/domain-info.txt`,
    expectedOutput: `A line naming ${DOMAIN_DNS} as the domain's DNS root.`,
    checks: [
      { type: 'output-contains', text: DOMAIN_DNS, hint: 'The DNSRoot line names the domain by its DNS name.' },
    ],
    debrief: `${DOMAIN_DNS} is the domain this whole package is about, and every machine that belongs to it shares this same name as a suffix, the same pattern a website uses when it puts www in front of its own domain name. You have already seen this without necessarily noticing: it is the same suffix on every hostname on rmg-web-02, from ridgelinemed.example itself to the mail and backup servers listed in /etc/hosts. One domain name, shared by every machine that belongs to it, is what lets you look at a hostname and immediately know which organisation's network it sits on.`,
    practice: [],
  },
  {
    id: 'ad.1.2',
    moduleId: '1',
    packageId: 'active-directory-foundations',
    order: 2,
    title: 'Find the domain controller',
    kind: 'terminal',
    goal: 'Identify the host that holds the domain\'s PDC emulator role.',
    prompt: 'Find the hostname of this domain\'s PDC emulator: in a small domain, the domain controller you would actually reach for.',
    teach: {
      concept:
        'A domain by itself is just an idea, a list of who is allowed to do what. Something has to actually hold that list and answer questions about it over the network, every time any computer needs to check a password or a group membership. That something is a DOMAIN CONTROLLER (DC): a server running a copy of the directory database, listening for those questions and giving definitive answers. Every login on every machine in this domain, every piece of evidence the rest of this package looks at, ultimately traces back to a domain controller answering yes or no.\n\n' +
        'A larger organisation often runs several DCs, so a single server going down does not stop everyone from logging in, and lets them share the database between themselves. A few jobs cannot safely be shared though, because two servers disagreeing about the same fact at the same moment would be worse than one being briefly unavailable, so those jobs are split into a handful of named roles, each held by exactly one server at a time. PDCEmulator is the one that matters most day to day: whichever DC holds it is the final word on password changes and on what time it currently is across the domain, both things that go badly wrong if two servers ever disagree about them. In a domain this size, with only a handful of accounts, there is usually only one DC to begin with, so it holds every role including this one, which is exactly what you should expect to find here.',
      syntax: 'grep "PDCEmulator" FILE',
      examples: [
        { command: `grep "RIDMaster" ${AUDIT}/domain-info.txt`, explains: 'A different FSMO role, the one responsible for handing out unique security identifiers as new objects are created.' },
      ],
    },
    hints: [
      'Search the same domain-info export for the PDCEmulator line.',
    ],
    solution: `grep "PDCEmulator" ${AUDIT}/domain-info.txt`,
    expectedOutput: `A line naming ${DC_HOSTNAME} as the PDC emulator.`,
    checks: [
      { type: 'output-contains', text: DC_HOSTNAME, hint: 'The PDCEmulator line names the domain controller\'s hostname.' },
    ],
    debrief: `${DC_HOSTNAME} is the domain controller: the one server in this domain that actually holds the directory database and answers every question asked of it. Every login, every group membership check, and every Kerberos ticket the rest of this package looks at was issued or verified by this one machine, which is exactly why it is worth being able to name on sight before reading anything else in this audit.`,
    practice: [],
  },
  {
    id: 'ad.1.3',
    moduleId: '1',
    packageId: 'active-directory-foundations',
    order: 3,
    title: 'Find the functional level',
    kind: 'terminal',
    goal: 'Read the domain functional level, and understand roughly what it constrains.',
    prompt: 'Find this domain\'s functional level.',
    teach: {
      concept:
        'Windows Server has been released in many versions over the years, and each new version added features to Active Directory that only work correctly if every domain controller in the domain understands them. That creates a tension: turn a new feature on too early, and an older DC that has no idea what it means could corrupt the directory trying to keep up. The DOMAIN FUNCTIONAL LEVEL is how that tension gets resolved. It is a setting, chosen deliberately by an administrator, that acts as a floor: raising it says no domain controller older than a certain version may join this domain any more, and in exchange for that restriction, the domain unlocks newer features and generally stronger default security, because the software no longer has to keep working around decades-old, weaker behaviour. It only ever moves up, never back down, and only when somebody decides on purpose to leave old hardware behind.\n\n' +
        'Because raising it takes a deliberate decision, it doubles as a rough proxy for how much attention this domain has actually gotten. A domain stuck on an old functional level for years is very often a domain nobody has touched in years either, which is worth knowing before you assume the rest of its hygiene is current.',
      syntax: 'grep "DomainMode" FILE',
      examples: [
        { command: `grep "DomainSID" ${AUDIT}/domain-info.txt`, explains: 'The domain\'s security identifier, a different fixed fact about it.' },
      ],
    },
    hints: [
      'Search the domain-info export for the DomainMode line.',
    ],
    solution: `grep "DomainMode" ${AUDIT}/domain-info.txt`,
    expectedOutput: `A line naming ${DOMAIN_FUNCTIONAL_LEVEL} as the domain functional level.`,
    checks: [
      { type: 'output-contains', text: DOMAIN_FUNCTIONAL_LEVEL, hint: 'The DomainMode line names the functional level.' },
    ],
    debrief: `${DOMAIN_FUNCTIONAL_LEVEL} is a reasonably current level, which already rules out the oldest, weakest domain controller versions from ever joining this domain. What it does not tell you is anything about the accounts and groups living inside that domain: whether the right people are in the right groups, whether stale accounts got cleaned up along the way. A modern functional level and a badly managed directory are not a contradiction; they are two separate questions, and the rest of this review is aimed squarely at the second one.`,
    practice: [],
  },
];

// --- Module 2: who is in the directory --------------------------------------------

const MODULE_2: Exercise[] = [
  {
    id: 'ad.2.1',
    moduleId: '2',
    packageId: 'active-directory-foundations',
    order: 1,
    title: 'Count the user accounts',
    kind: 'terminal',
    goal: 'Count the accounts in a directory export, ignoring the header comments.',
    prompt: `Count how many user accounts appear in ${AUDIT}/users-export.txt.`,
    teach: {
      concept:
        'Every person and every automated process that needs to log into something in this domain has a USER ACCOUNT: a record in the directory holding their username, their department, whether they are currently allowed to log in, and more. A DIRECTORY EXPORT, like this file, is simply somebody asking the domain controller to list every one of those records out to a text file so it can be reviewed by hand: one account per line here, with a few comment lines at the very top explaining what each column means. Counting the real rows means excluding those comment lines first, the same subtraction you have already done in Log Analysis: set aside the lines you already know are not the thing you are counting, remove them, then count what is left. `grep -v` does exactly that: instead of keeping lines that match a pattern, it inverts the search and keeps every line that does NOT match, which is exactly what you want when the thing to remove is easy to describe (comment lines start with #) but the thing to keep is everything else.',
      syntax: "grep -cv '^#' FILE",
      examples: [
        { command: `grep -v '^#' ${AUDIT}/domain-admins-members.txt`, explains: 'The same subtraction on a different, much shorter export: removing its header comments to see just the names.' },
      ],
      flags: [{ flag: '-v', means: 'Invert the match: keep lines that do NOT match the pattern.' }],
    },
    hints: [
      `The file is ${AUDIT}/users-export.txt.`,
      'Comment lines start with #. Remove them and count what remains.',
      "Combine -c and -v: grep -cv '^#' FILE.",
    ],
    solution: `grep -cv '^#' ${AUDIT}/users-export.txt`,
    expectedOutput: `${AD_USERS.length}`,
    checks: [
      { type: 'output-numeric', equals: AD_USERS.length, hint: 'Exclude the header comments, then count the rows that remain.' },
    ],
    debrief: `${AD_USERS.length} accounts in this domain in total: ordinary staff logins, a handful of disabled leftovers nobody deleted, and a few service accounts, accounts that belong to a piece of software rather than a person, used so an application can log into other systems without a human typing a password in. That is small enough that a careful review of every single one of them by hand is actually realistic, which is the whole point of starting here before judging any of them individually.`,
    practice: [],
  },
  {
    id: 'ad.2.2',
    moduleId: '2',
    packageId: 'active-directory-foundations',
    order: 2,
    title: 'Find the disabled and stale accounts',
    kind: 'terminal',
    goal: 'Identify accounts that are disabled, and notice what else is usually true of them.',
    prompt: `Show every account in ${AUDIT}/users-export.txt that is disabled.`,
    teach: {
      concept:
        `Every account record carries a flag saying whether it is currently ENABLED, meaning it can be used to log in right now, and a separate field recording the LAST LOGON, the most recent time anyone actually used it to do so. Disabling an account instead of deleting it is deliberate: it turns the account off without losing the history attached to it, so if it turns out later that somebody still needed it, or an investigator needs to know what it did while it was active, that record is still there to read. In principle a disabled account is completely harmless, since nobody can authenticate as one any more. In practice it is still worth reading, because an account that got disabled instead of deleted is a small piece of institutional memory: a contractor whose access was supposed to be temporary, a role nobody ever reassigned, evidence of roughly when somebody left the organisation. Read the last-logon date next to each disabled account here and a pattern shows up: every one of them had already gone quiet, unused, long before anybody actually flipped the disabled flag.`,
      syntax: 'grep "False" FILE',
      examples: [
        { command: `grep "svc-" ${AUDIT}/users-export.txt`, explains: 'A different filter on the same file: every service account, by their naming convention.' },
      ],
    },
    hints: [
      `The Enabled field is either True or False, and this export uses that exact spelling.`,
      'Search for the word False.',
    ],
    solution: `grep "False" ${AUDIT}/users-export.txt`,
    expectedOutput: `${DISABLED_USERS.length} disabled accounts.`,
    checks: [
      { type: 'output-line-count', count: DISABLED_USERS.length, hint: `There are ${DISABLED_USERS.length} disabled accounts in this export.` },
      { type: 'output-excludes', text: 'True', hint: 'Only disabled accounts should appear: make sure you searched for False, not True.' },
    ],
    debrief: `${DISABLED_USERS.length} disabled accounts, and every one of them had already gone stale, meaning more than a year passed with no logon at all, before it was finally disabled. That gap between the account going quiet and somebody actually noticing and disabling it is the real finding here: a disabled account is safe by definition, since nobody can log in as one, but the months or years it spent sitting there enabled and unused were not safe at all. A valid, working login that nobody is watching is exactly the kind of thing an attacker who compromises it can keep using quietly for a long time before anyone notices.`,
    practice: [],
  },
  {
    id: 'ad.2.3',
    moduleId: '2',
    packageId: 'active-directory-foundations',
    order: 3,
    title: 'See who holds the keys',
    kind: 'terminal',
    goal: 'Read the Domain Admins group membership.',
    prompt: `Show the membership of the Domain Admins group, from ${AUDIT}/domain-admins-members.txt.`,
    teach: {
      concept:
        'A GROUP in a directory is just a named list of accounts, created so a permission can be granted once, to the group, instead of separately to every person who needs it. Add someone to the group and they inherit everything it grants; remove them and they lose it, without anyone touching the underlying permission itself. Domain Admins is the single most powerful group that exists in any Active Directory domain: membership in it means full control over every account, every computer, and every other group in the entire domain, no exceptions. Because that much power sitting with the wrong person is one of the worst things that can happen to a domain, the group is supposed to stay small on purpose, and every single member should be there for a reason you could state in one sentence, something like "he manages the domain controllers." Reviewing this one group\'s membership is one of the highest-value five minutes in any AD hygiene review, precisely because the group is small enough, in a healthy domain, to read start to finish in one sitting.',
      syntax: "grep -v '^#' FILE",
      examples: [
        { command: `grep -c "svc-" ${AUDIT}/users-export.txt`, explains: 'A count from the user export, to contrast this group\'s small size against the whole directory.' },
      ],
    },
    hints: [
      'The comment lines at the top start with #. Remove them to see just the members.',
    ],
    solution: `grep -v '^#' ${AUDIT}/domain-admins-members.txt`,
    expectedOutput: `${DOMAIN_ADMINS.length} names, one per line.`,
    checks: [
      { type: 'output-line-count', count: DOMAIN_ADMINS.length, hint: `Domain Admins has ${DOMAIN_ADMINS.length} members once the header comments are excluded.` },
      { type: 'output-contains', text: 'rjenkins', hint: 'One of the members should be an IT Infrastructure account.' },
    ],
    debrief: `${DOMAIN_ADMINS.length} names. Two are IT Infrastructure staff, which is exactly the kind of member this group should contain: people whose job is literally to administer the domain. One is the built-in Administrator account, a special account Windows creates automatically with every domain and which effectively always belongs here. That leaves one name that does not obviously fit either pattern. Read the next exercise before deciding which one it is and why it matters.`,
    practice: [],
  },
  {
    id: 'ad.2.4',
    moduleId: '2',
    packageId: 'active-directory-foundations',
    order: 4,
    title: 'Find the account that does not belong',
    kind: 'terminal',
    goal: 'Cross-reference a Domain Admins member against the user export to find their actual department.',
    prompt:
      `One of the names in Domain Admins does not read like an IT account. Look it up in ${AUDIT}/users-export.txt and find out what department it actually belongs to.`,
    teach: {
      concept:
        `A name by itself proves nothing: you cannot tell someone's job just by reading their username. What proves it is the DEPARTMENT field recorded on their account, an independent fact somebody in HR or IT entered when the account was created, for a completely different reason than membership in any group. This is the same move Log Analysis taught with a second log file corroborating the first: one export raises a question, a second, separately maintained export answers it, and the two agreeing, or not, is stronger evidence than either alone. Cross-referencing "who is sitting in this powerful group" against "what does this account's own record say it actually does for a living" is one of the most repeatable, most useful findings in identity hygiene work, and it is the concrete version of a lesson Identity Foundations covers more generally: privileged group membership is only supposed to exist because it tracks a real job function, and the moment it stops tracking that, the membership stops meaning anything except risk.`,
      syntax: 'grep "sAMAccountName" FILE',
      examples: [
        { command: `grep "cmoreau" ${AUDIT}/users-export.txt`, explains: 'The same lookup for a different Domain Admins member, whose department turns out to match the role.' },
      ],
    },
    hints: [
      `Three of the four Domain Admins names read as IT staff or the built-in account. Look up the one that does not.`,
      `Search ${AUDIT}/users-export.txt for that account's name.`,
    ],
    solution: `grep "${ANOMALOUS_ADMIN.sam}" ${AUDIT}/users-export.txt`,
    expectedOutput: `A row showing the account works in ${ANOMALOUS_ADMIN.department}, not IT.`,
    checks: [
      { type: 'output-contains', text: ANOMALOUS_ADMIN.department, hint: 'The row you find should name a department that has nothing to do with running the domain.' },
      { type: 'output-contains', text: ANOMALOUS_ADMIN.sam, hint: 'Search for the account name that looked out of place in the Domain Admins list.' },
    ],
    debrief: `${ANOMALOUS_ADMIN.sam} works in ${ANOMALOUS_ADMIN.department}, and yet has full control over the entire domain anyway, the same level of access as the IT staff sitting in the same group. Nothing here proves malice on its own; most overprivileged accounts are exactly this boring, somebody was added for a single one-time task months or years ago and simply never removed afterward. It is still the single most important finding in this whole export, because unlike a one-time event, it is a standing risk that exists fresh every single day it goes unnoticed: any day this account or its password is compromised, whoever holds it owns the entire domain.`,
    practice: [],
  },
];

// --- Module 3: how authentication actually happens ---------------------------------

const MODULE_3: Exercise[] = [
  {
    id: 'ad.3.1',
    moduleId: '3',
    packageId: 'active-directory-foundations',
    order: 1,
    title: 'Count the cached tickets',
    kind: 'terminal',
    goal: 'Count entries in a Kerberos ticket cache dump.',
    prompt: `A workstation's ticket cache was exported to ${AUDIT}/klist-output.txt. Count how many tickets it holds.`,
    teach: {
      concept:
        'So far this package has been about who is allowed to log in. This module is about what actually happens, technically, at the moment someone does. The simplest way to prove who you are to a computer is to send it your password and let it check. The trouble is that if you did that every single time you touched a new file server or a new website, your password would be travelling across the network dozens of times a day, and every one of those trips is a chance for it to be intercepted. Kerberos is the protocol Windows domains use to avoid exactly that: you prove your password ONCE, to the domain controller, at the moment you log in, and get back a Ticket Granting Ticket (TGT) in exchange, essentially a signed note that says "the domain controller already checked this person\'s password and vouches for them." From then on, every time you need to reach a different service, a file share, a website, a database, you show that TGT to the domain controller instead of your password, and get back a separate, smaller service ticket good only for that one service. Your password itself never has to leave your workstation again for the rest of that login.\n\n' +
        '`klist` is the standard Windows tool for listing every ticket currently sitting in a computer\'s cache, both the one TGT and every service ticket requested since. This export is exactly that list, and every entry in it has a `Server:` line naming what the ticket is actually for.',
      syntax: 'grep -c "Server:" FILE',
      examples: [
        { command: `grep -c "Client:" ${AUDIT}/klist-output.txt`, explains: 'The same count from the other side: every ticket also names the client it was issued to.' },
      ],
    },
    hints: [
      `The file is ${AUDIT}/klist-output.txt.`,
      'Every cached ticket has exactly one Server: line. Count those.',
    ],
    solution: `grep -c "Server:" ${AUDIT}/klist-output.txt`,
    expectedOutput: `${KERBEROS_TICKETS.length}`,
    checks: [
      { type: 'output-numeric', equals: KERBEROS_TICKETS.length, hint: 'Count the Server: lines: one per cached ticket.' },
    ],
    debrief: `${KERBEROS_TICKETS.length} tickets sitting in this cache. Exactly one is the TGT that started this login session, the ticket that stood in for the password from that point on, and the rest are service tickets, each one requested using that TGT rather than the password itself, for a specific file share, website, or other resource this user touched. Telling the one TGT apart from the many service tickets, just by reading the cache, is the next exercise.`,
    practice: [],
  },
  {
    id: 'ad.3.2',
    moduleId: '3',
    packageId: 'active-directory-foundations',
    order: 2,
    title: 'Tell the TGT from a service ticket',
    kind: 'terminal',
    goal: 'Recognise the krbtgt ticket that anchors a Kerberos session.',
    prompt: 'Find the Ticket Granting Ticket in the cache: the one issued by krbtgt rather than for a specific service.',
    teach: {
      concept:
        'Every service ticket in the cache is named for what it is FOR: HTTP for a web server, CIFS for a Windows file share, LDAP for the directory service itself, and so on, because a service ticket only works against the one specific service it was issued for. The TGT is different, and it has to be, because it was not issued for any particular service, it was issued to let you get MORE tickets. Its Server field instead names `krbtgt`, a special hidden account that every domain controller keeps for exactly one purpose: to sign TGTs. Nobody actually logs into krbtgt the way a person logs into their own account; it exists purely as a cryptographic anchor. Recognising the difference matters because the TGT is issued once, right at the start of a session, and every service ticket that follows depends on it rather than on the original password, which is the whole design\'s payoff: the password only has to touch the network the one time.',
      syntax: 'grep "krbtgt" FILE',
      examples: [
        { command: `grep "LDAP" ${AUDIT}/klist-output.txt`, explains: 'One of the service tickets instead, this one for the directory service itself.' },
      ],
    },
    hints: [
      'Search the ticket cache for the special account name krbtgt.',
    ],
    solution: `grep "krbtgt" ${AUDIT}/klist-output.txt`,
    expectedOutput: `A line naming krbtgt/${DOMAIN_DNS.toUpperCase()} as the server.`,
    checks: [
      { type: 'output-contains', text: 'krbtgt', hint: 'The TGT\'s Server field names krbtgt, not a real service.' },
    ],
    debrief: `That is the anchor for this whole login session: every other ticket in the cache was requested using this one, without the user's password ever being typed or sent again. Because of that, stealing this ticket is functionally almost as dangerous as stealing the password itself, for as long as the ticket stays valid, since it can be used to request fresh tickets to anything the account is allowed to touch.`,
    practice: [],
  },
  {
    id: 'ad.3.3',
    moduleId: '3',
    packageId: 'active-directory-foundations',
    order: 3,
    title: 'Find the ticket using weak encryption',
    kind: 'terminal',
    goal: 'Spot the one ticket that downgrades to RC4 instead of AES.',
    prompt: 'Every ticket in this cache records its encryption type. Read the whole cache and find which service the RC4 ticket belongs to.',
    teach: {
      concept:
        'Every ticket in this cache is encrypted, scrambled with a mathematical cipher so that only someone holding the right key can read it, and the KerbTicket Encryption Type line on each entry records exactly which cipher was used. Modern Kerberos tickets use AES-256, a strong, current cipher, which is what you should expect to see on almost every line here. RC4-HMAC is a much older cipher, kept around purely for compatibility with software that has never been updated to support anything newer, and it has a specific, serious weakness: an attacker who captures an RC4 ticket can try to guess the key behind it offline, on their own hardware, trying billions of guesses a second with nobody on the network able to see or stop them, dramatically faster than the same attack against an AES ticket. So a ticket you find using this weaker cipher is realistically crackable, not just theoretically weaker on paper.\n\n' +
        'In practice, an RC4 ticket usually means one of two things: a legacy service account whose configuration nobody updated when the rest of the domain moved on to AES, or an attacker who deliberately requested a downgraded ticket because the strong version would be too expensive to attack. Either way, the cipher and the service the ticket belongs to sit on different lines of the same entry, so this is a case where reading the whole ticket beats filtering to one line: a plain grep for RC4 would hand you the cipher name without the context of which service the weak ticket actually belongs to.',
      syntax: 'cat FILE',
      examples: [
        { command: `grep -c "AES-256" ${AUDIT}/klist-output.txt`, explains: 'How many tickets use the strong cipher, for contrast with the one that does not.' },
      ],
    },
    hints: [
      'This file is short enough to read in full: cat it rather than filtering.',
      'Find the entry whose KerbTicket Encryption Type line says RC4-HMAC(NT), then read that entry\'s Server line.',
    ],
    solution: `cat ${AUDIT}/klist-output.txt`,
    expectedOutput: `The full cache, including the ${WEAK_TICKET.server} ticket using RC4-HMAC(NT).`,
    checks: [
      { type: 'output-contains', text: 'RC4', hint: 'The full cache should include the RC4-HMAC(NT) entry.' },
      { type: 'output-contains', text: WEAK_TICKET.server, hint: 'The weak ticket is for a specific service. Its Server field should be visible in your output.' },
    ],
    debrief: `${WEAK_TICKET.server} is the one ticket in this whole cache using the weaker RC4 cipher instead of AES. Finding a single weak ticket sitting among several strong ones is exactly the shape a Kerberoasting attempt leaves behind on a machine, and module 5 shows what that same ticket looks like once somebody actually extracts it and tries to crack it.`,
    practice: [],
  },
  {
    id: 'ad.3.4',
    moduleId: '3',
    packageId: 'active-directory-foundations',
    order: 4,
    title: 'Confirm the rest are strong',
    kind: 'terminal',
    goal: 'Count the AES tickets, to establish the RC4 ticket as the exception rather than the norm.',
    prompt: 'Count how many tickets in the cache use the strong AES-256 cipher.',
    teach: {
      concept:
        'A single unusual thing only counts as unusual because of what everything else around it looks like. Before you can honestly say "one ticket stands out", you first have to know how many did not, otherwise the RC4 ticket might just be normal for this environment and you would have no way to tell. Counting every ticket in this cache still using the strong AES-256 cipher establishes that baseline, and it is what turns a vague impression, "there is an RC4 ticket in here somewhere", into a precise, defensible claim: there is exactly one weak ticket, and everything else in this cache behaves exactly the way it should.',
      syntax: 'grep -c "AES-256" FILE',
      examples: [
        { command: `grep -c "RC4" ${AUDIT}/klist-output.txt`, explains: 'The inverse count, which this exercise\'s answer should be exactly one more than the total ticket count minus.' },
      ],
    },
    hints: [
      'Count the lines mentioning AES-256, the same way you counted Server: lines earlier.',
    ],
    solution: `grep -c "AES-256" ${AUDIT}/klist-output.txt`,
    expectedOutput: `${AES_TICKET_COUNT}`,
    checks: [
      { type: 'output-numeric', equals: AES_TICKET_COUNT, hint: `${AES_TICKET_COUNT} of the tickets use AES-256; only one uses RC4.` },
    ],
    debrief: `${AES_TICKET_COUNT} tickets using the strong cipher, one using the weak one. That ratio, overwhelmingly normal with a single exception, is exactly what makes the RC4 ticket worth escalating rather than shrugging off as noise: it is not how this environment behaves the rest of the time, so something specific explains why this one ticket is different.`,
    practice: [],
  },
];

// --- Module 4: reading LDAP -----------------------------------------------------

const MODULE_4: Exercise[] = [
  {
    id: 'ad.4.1',
    moduleId: '4',
    packageId: 'active-directory-foundations',
    order: 1,
    title: "Find an account's distinguished name",
    kind: 'terminal',
    goal: 'Locate a directory entry in an LDIF export using a name you already know from another file.',
    prompt: `You already know from the user export that rchen is Ruoxi Chen. Find her entry in ${AUDIT}/ldapsearch-users.ldif and read her distinguished name.`,
    teach: {
      concept:
        'Active Directory stores its data as a tree, the same shape a filesystem\'s folders and subfolders make, with the whole domain at the root and accounts, computers, and organisational groupings nested inside it. LDAP (Lightweight Directory Access Protocol) is the standard language used to ask a directory server questions about that tree, and every single object in it, whether a user, a computer, or a folder-like container, gets a distinguished name (DN): a full path down through that tree, written most-specific first, such as `CN=Ruoxi Chen,OU=Staff,DC=ridgelinemed,DC=example`. Read right to left, `DC=ridgelinemed,DC=example` is the domain itself, `OU=Staff` is the organisational grouping, or "folder", the account lives in, and `CN=Ruoxi Chen` is the object itself.\n\n' +
        '`ldapsearch` is the standard command-line tool for querying an LDAP directory directly, and its output (or an LDIF-formatted export of it, as here) lists one attribute per line underneath each object\'s `dn:` line. Notice the DN spells the person out by their full name, not their short account name, which is exactly why the earlier cross-reference against the user export matters here too: it is what turns "rchen" into "Ruoxi Chen", the actual string that appears in this file.',
      syntax: 'grep "Full Name" FILE',
      examples: [
        { command: `grep "Ben Foster" ${AUDIT}/ldapsearch-users.ldif`, explains: 'The same lookup for a different account, using the display name to find its entry.' },
      ],
    },
    hints: [
      'The account name "rchen" will not appear in a dn: line. The person\'s full display name will.',
      `Search ${AUDIT}/ldapsearch-users.ldif for "Ruoxi Chen".`,
    ],
    solution: `grep "Ruoxi Chen" ${AUDIT}/ldapsearch-users.ldif`,
    expectedOutput: `Her dn line: CN=Ruoxi Chen,OU=Staff,DC=ridgelinemed,DC=example`,
    checks: [
      { type: 'output-contains', text: 'CN=Ruoxi Chen', hint: 'Her distinguished name should name her by her full display name.' },
      { type: 'output-contains', text: 'OU=Staff', hint: 'Her entry sits in the Staff organisational unit.' },
    ],
    debrief: `Her account lives in OU=Staff: the ordinary rank-and-file employee container in this domain's tree. Where an account sits in that tree is informative on its own, before you have even read a single other attribute about it: an account filed under OU=Service Accounts or OU=Clinical is a fundamentally different kind of thing than one filed under OU=Staff, the same way finding a name in the "Contractors" folder tells you something different than finding it in "Full-Time Staff" before you have opened the file at all.`,
    practice: [],
  },
  {
    id: 'ad.4.2',
    moduleId: '4',
    packageId: 'active-directory-foundations',
    order: 2,
    title: 'Find the account with the notable flag',
    kind: 'terminal',
    goal: 'Read userAccountControl and identify an account with password expiry disabled.',
    prompt: `Read the whole LDIF export and find which account has userAccountControl set to ${UAC_DONT_EXPIRE_PASSWORD}.`,
    teach: {
      concept:
        'Every account carries a field called userAccountControl, and it is a single number that manages to pack together a whole set of yes-or-no facts about the account at once: whether it is currently enabled, whether it requires special pre-authentication, and, among quite a few others, whether its password is ever allowed to expire. It does this using binary flags: each individual fact is assigned its own fixed number behind the scenes, and those numbers are simply added together to build the total you see in this export, the same way flipping several light switches leaves you seeing only the combined result in the room, not which switches were flipped. A value of 512 is a completely ordinary, fully enabled account with nothing unusual set. Adding 65536, the number reserved for DONT_EXPIRE_PASSWORD, on top of that gives 66048: an account whose password is never forced to rotate on any schedule at all.\n\n' +
        'That specific combination is a real and genuinely common hygiene finding, especially on service accounts, accounts used by software rather than a person. Their passwords are often deliberately left to never expire, because rotating one safely would mean updating every single service that uses it, at the same time, without breaking anything, and in practice that coordination effort is exactly the kind of thing that quietly never happens.',
      syntax: 'cat FILE',
      examples: [
        { command: `grep -c "userAccountControl: 512" ${AUDIT}/ldapsearch-users.ldif`, explains: 'How many entries carry the ordinary flag value, for contrast with the one that does not.' },
      ],
    },
    hints: [
      'This file is small enough to read in full rather than filter.',
      `Look for the entry whose userAccountControl is ${UAC_DONT_EXPIRE_PASSWORD} rather than 512, and read the sAMAccountName just above it.`,
    ],
    solution: `cat ${AUDIT}/ldapsearch-users.ldif`,
    expectedOutput: `The full export, including ${NOTABLE_LDAP_ENTRY.sam}'s entry with userAccountControl: ${UAC_DONT_EXPIRE_PASSWORD}.`,
    checks: [
      { type: 'output-contains', text: NOTABLE_LDAP_ENTRY.sam, hint: 'Read the sAMAccountName on the entry whose userAccountControl is not the ordinary 512.' },
      { type: 'output-contains', text: String(UAC_DONT_EXPIRE_PASSWORD), hint: `The notable flag value is ${UAC_DONT_EXPIRE_PASSWORD}.` },
    ],
    debrief: `${NOTABLE_LDAP_ENTRY.sam} never has to rotate its password, on any schedule, ever, unless somebody changes it by hand. On its own that is a manageable, common trade-off organisations make for a service account. It stops being manageable the moment nobody left remembers which other services actually depend on that exact password, because at that point the password can never safely be changed at all, only worked around indefinitely.`,
    practice: [],
  },
  {
    id: 'ad.4.3',
    moduleId: '4',
    packageId: 'active-directory-foundations',
    order: 3,
    title: 'Count the distinct organisational units',
    kind: 'terminal',
    goal: 'Extract and count the distinct OUs referenced across every entry\'s distinguished name.',
    prompt: 'Count how many distinct organisational units (OUs) appear across every dn: line in the LDIF export.',
    teach: {
      concept:
        'An organisational unit (OU) is a container inside the directory tree, used to group related objects together, staff in one, service accounts in another, so that settings and policies can be applied to a whole group at once instead of one object at a time. Every object\'s distinguished name already records which OU it sits in, as the OU= piece of the path, so pulling that one piece out of every dn: line in this file and reducing it down to the distinct values answers a specific, useful question: how many genuinely different parts of the tree does even this small sample of accounts actually touch? That is the same rank-and-count shape already used earlier in this course on log files: pull out the one field you actually care about, then let sort -u tell you how many truly distinct values exist among everything you pulled.',
      syntax: "grep -oE 'OU=[A-Za-z ]+' FILE | sort -u | wc -l",
      examples: [
        { command: `grep -oE 'OU=[A-Za-z ]+' ${AUDIT}/ldapsearch-users.ldif | sort -u`, explains: 'The same extraction without the final count, so you can see the distinct OU names themselves.' },
      ],
      flags: [
        { flag: '-o', means: 'Print only the matched text, not the whole line.' },
        { flag: '-E', means: 'Enable extended regular expressions, needed for the + repetition operator.' },
      ],
    },
    hints: [
      `The pattern 'OU=[A-Za-z ]+' matches "OU=" followed by letters and spaces, stopping at the next comma.`,
      'Pipe the matches through sort -u to collapse duplicates, then wc -l to count what remains.',
    ],
    solution: `grep -oE 'OU=[A-Za-z ]+' ${AUDIT}/ldapsearch-users.ldif | sort -u | wc -l`,
    expectedOutput: `${DISTINCT_OUS.length}`,
    checks: [
      { type: 'output-numeric', equals: DISTINCT_OUS.length, hint: 'Extract the OU= text from every dn: line, deduplicate, then count.' },
    ],
    debrief: `${DISTINCT_OUS.length} distinct OUs turn up in this small sample: ordinary staff, clinical staff, and service accounts, each kept in its own separate container rather than dumped together. A directory organised this way makes an OU-scoped policy, or a targeted access review of just one category of account, actually possible to run. A directory with every account, staff and service alike, sitting in one flat, undivided container does not allow either.`,
    practice: [],
  },
];

// --- Module 5: when AD is attacked -----------------------------------------------

const MODULE_5: Exercise[] = [
  {
    id: 'ad.5.1',
    moduleId: '5',
    packageId: 'active-directory-foundations',
    order: 1,
    title: 'Find the account behind the cracked ticket',
    kind: 'terminal',
    goal: 'Read a hashcat-format Kerberoasting hash and identify the target account.',
    prompt: `A hash extracted during the review was saved to ${AUDIT}/kerberoast-hashes.txt. Find which service account it belongs to.`,
    teach: {
      concept:
        'Module 3 found a service ticket in this domain using the weak RC4 cipher instead of AES. Kerberoasting is exactly what an attacker does with a ticket like that: request a service ticket for any account with an SPN (a name registered to identify what service it runs), which any ordinary, already-authenticated domain account is allowed to do for essentially any service, without needing any special privilege at all; extract the encrypted portion of that ticket; and then try to crack it offline, on their own hardware, entirely separate from the network, so the domain controller has no further chance to notice or block anything after that one initial, completely unremarkable-looking request.\n\n' +
        '`$krb5tgs$23$*account$realm$SPN*$hash` is the standard format the password-cracking tool hashcat expects for exactly this kind of extracted ticket: the 23 is the encryption type number for RC4, the same weak cipher already flagged, and the account name the ticket belongs to sits right there in the hash line, in plain, readable text, because encrypting the ticket\'s contents was never meant to hide who it was issued for in the first place.',
      syntax: 'cat FILE',
      examples: [
        { command: `grep "krb5tgs" ${AUDIT}/kerberoast-hashes.txt`, explains: 'The same file, filtered to confirm the hashcat format marker is present.' },
      ],
    },
    hints: [
      'This is one line: cat is enough to read it.',
      'The account name sits between the first two dollar-sign-delimited fields after the etype number.',
    ],
    solution: `cat ${AUDIT}/kerberoast-hashes.txt`,
    expectedOutput: `A hashcat-format line naming ${KERBEROAST_TARGET_SAM} as the target account.`,
    checks: [
      { type: 'output-contains', text: KERBEROAST_TARGET_SAM, hint: 'The account name sits in the clear inside the hash line.' },
      { type: 'output-contains', text: 'krb5tgs', hint: 'This should be a $krb5tgs$ formatted line: the standard hashcat marker for a Kerberoasted ticket.' },
    ],
    debrief: `${KERBEROAST_TARGET_SAM}: the same account whose ticket you already found using RC4 back in module 3, and the same account whose password never expires from module 4. This hash line is what actually requesting that ticket and extracting it for offline cracking looks like once it lands on disk, the concrete, forensic evidence that connects the theory in module 3 to a real attempt against a real account.`,
    practice: [],
  },
  {
    id: 'ad.5.2',
    moduleId: '5',
    packageId: 'active-directory-foundations',
    order: 2,
    title: 'Count the 4769 events',
    kind: 'terminal',
    goal: 'Get an overall count of service ticket requests before hunting for the anomaly among them.',
    prompt: `Count how many Event ID 4769 entries appear in ${AUDIT}/security-events-4769.txt.`,
    teach: {
      concept:
        'Windows keeps a running log of security-relevant activity, and every entry in it is tagged with an EVENT ID, a fixed number identifying what kind of thing happened, so entries of the same type can be found and counted without having to read every line\'s full text. Event ID 4769 specifically records every single Kerberos service ticket request the domain controller processes, which on a real, busy domain adds up to thousands of routine events a day: ordinary users\' machines quietly, constantly asking for tickets to the file shares and web apps they normally use, one after another. A small, boring baseline like the one in this file is exactly what you should expect to see the overwhelming majority of the time, and it is precisely that boring baseline that makes the anomaly in the next exercise stand out as clearly as it does.',
      syntax: 'grep -c "4769" FILE',
      examples: [
        { command: `grep -c "Security-Auditing" ${AUDIT}/security-events-4769.txt`, explains: 'A different marker in the same lines, which should count identically since every event line carries both.' },
      ],
    },
    hints: [
      `The file is ${AUDIT}/security-events-4769.txt.`,
      'Count the lines mentioning the event ID.',
    ],
    solution: `grep -c "4769" ${AUDIT}/security-events-4769.txt`,
    expectedOutput: `${EVENT_4769_ALL.length}`,
    checks: [
      { type: 'output-numeric', equals: EVENT_4769_ALL.length, hint: `There are ${EVENT_4769_ALL.length} Event ID 4769 lines in this excerpt.` },
    ],
    debrief: `${EVENT_4769_ALL.length} events in total: short enough to read individually line by line, which a real domain's actual daily volume would almost never allow in practice. Reading each one by hand, looking for the pattern that does not belong, is exactly what the next exercise does.`,
    practice: [],
  },
  {
    id: 'ad.5.3',
    moduleId: '5',
    packageId: 'active-directory-foundations',
    order: 3,
    title: 'Find the account behind the burst',
    kind: 'terminal',
    goal: 'Identify the account requesting many different service tickets in a tight time window: the Kerberoasting signature.',
    prompt: 'One account in this log requests tickets for several different, unrelated services within seconds of each other. Find that account and count how many requests it made.',
    teach: {
      concept:
        'A normal 4769 event, the kind that makes up the vast majority of any domain\'s log, is one account requesting a ticket for one service it uses regularly, spaced out across a working day: somebody\'s laptop asking for the file share it always connects to, once, maybe twice. Kerberoasting produces a completely different pattern once you know to look for it: one single account requesting tickets for many DIFFERENT services in a row, often ones that account has no ordinary reason to touch at all, all within seconds of each other. That happens because the attacker is not actually trying to use any of those services; they are collecting as many crackable tickets as possible before anyone notices, casting as wide a net as the domain will tolerate in the short window before the activity looks unusual.',
      syntax: 'grep -c "ACCOUNT" FILE',
      examples: [
        { command: `grep "jmartel" ${AUDIT}/security-events-4769.txt`, explains: 'An ordinary account\'s single, unremarkable ticket request, for contrast with the burst pattern.' },
      ],
    },
    hints: [
      'Scan the file for one account name appearing several times in a row, each for a different Service Name.',
      'Once you have the account, count its lines with grep -c.',
    ],
    solution: `grep -c "${ANOMALOUS_ADMIN_SAM}" ${AUDIT}/security-events-4769.txt`,
    expectedOutput: `${BURST_EVENT_COUNT}`,
    checks: [
      { type: 'output-numeric', equals: BURST_EVENT_COUNT, hint: `${ANOMALOUS_ADMIN_SAM} requested ${BURST_EVENT_COUNT} service tickets within seconds of each other.` },
    ],
    debrief: `${ANOMALOUS_ADMIN_SAM} requested ${BURST_EVENT_COUNT} service tickets for ${BURST_EVENT_COUNT} different services within a few seconds of each other: HTTP, CIFS, LDAP, a SQL server, and an FTP host, none of which a Marketing account has any ordinary day-to-day reason to touch even once, let alone all five in a row. That is the Kerberoasting signature to look for: it is the breadth and the speed of the requests together that gives it away, not any single request looking suspicious sitting on its own.`,
    practice: [],
  },
  {
    id: 'ad.5.4',
    moduleId: '5',
    packageId: 'active-directory-foundations',
    order: 4,
    title: 'Connect it back to the privileged group',
    kind: 'terminal',
    goal: 'Confirm the account behind the ticket-request burst is the same one flagged as an overprivileged Domain Admin.',
    prompt: `Confirm whether the account behind the burst also appears in ${AUDIT}/domain-admins-members.txt.`,
    teach: {
      concept:
        'This is the whole review, laid end to end. A Marketing account was sitting inside Domain Admins with no stated reason for being there at all (module 2). The service account carrying a weak, never-expiring credential got kerberoasted (modules 3 and 4). And the account that actually carried out that kerberoasting, requesting tickets for a string of services it had no legitimate business touching, turns out to be that very same overprivileged Marketing account (module 5). None of those three findings needed the others to be true to matter on their own, but read together they describe one coherent chain of events: an account that should never have held domain-wide privilege in the first place used exactly that privilege to go hunting for a crackable credential, and found one. Overprivileged group membership is not an abstract line item on an audit checklist; it is the literal access an incident like this one runs on, from beginning to end.',
      syntax: 'grep "ACCOUNT" FILE',
      examples: [
        { command: `grep "cmoreau" ${AUDIT}/domain-admins-members.txt`, explains: 'A different Domain Admins member, present in the file for a straightforward IT reason.' },
      ],
    },
    hints: [
      `Search ${AUDIT}/domain-admins-members.txt for the account you just found requesting the ticket burst.`,
    ],
    solution: `grep "${ANOMALOUS_ADMIN_SAM}" ${AUDIT}/domain-admins-members.txt`,
    expectedOutput: `${ANOMALOUS_ADMIN_SAM}, confirmed as a Domain Admins member.`,
    checks: [
      { type: 'output-contains', text: ANOMALOUS_ADMIN_SAM, hint: 'The account behind the burst should appear in the Domain Admins membership file too.' },
    ],
    debrief: `Confirmed: it is the same account both times. An overprivileged Marketing account with no IT function to justify it was sitting inside the one group in this whole domain that could ask the domain controller for practically anything, and it used exactly that standing access to go looking for a credential worth cracking. Fixing this domain does not actually start with the Kerberos ticket or the weak cipher; it starts further back, with the group membership that let the request happen at all in the first place.`,
    practice: [],
  },
];

// --- the package -------------------------------------------------------------

export const ACTIVE_DIRECTORY_FOUNDATIONS: LearningPackage = {
  id: 'active-directory-foundations',
  order: 4.5,
  title: 'Active Directory Foundations',
  summary:
    'A hygiene review of the Ridgeline Med domain: what a domain and its accounts actually are, how Kerberos authenticates, how LDAP describes the directory, and how a weak service account and one overprivileged group turn into a real attack path.',
  outcomes: [
    'Read a domain export and identify the domain name, controller, and functional level',
    'Review a user and group export for stale, disabled, and overprivileged accounts',
    'Read a Kerberos ticket cache and recognise a weak-encryption ticket as a Kerberoasting indicator',
    'Read an LDIF export and interpret userAccountControl flags',
    'Trace a Kerberoasting attempt from the cracked ticket to the account and access that made it possible',
  ],
  prerequisites: ['linux-fundamentals'],
  modules: [
    {
      id: '1',
      packageId: 'active-directory-foundations',
      order: 1,
      title: 'What a domain actually is',
      summary: 'Reading a domain export: DNS name, domain controller, and functional level.',
      exercises: MODULE_1,
    },
    {
      id: '2',
      packageId: 'active-directory-foundations',
      order: 2,
      title: 'Who is in the directory',
      summary: 'User accounts, disabled and stale ones, and the Domain Admins group\'s one account that does not belong.',
      exercises: MODULE_2,
    },
    {
      id: '3',
      packageId: 'active-directory-foundations',
      order: 3,
      title: 'How authentication actually happens: Kerberos',
      summary: 'Reading a ticket cache, telling a TGT from a service ticket, and spotting a weak-encryption ticket.',
      exercises: MODULE_3,
    },
    {
      id: '4',
      packageId: 'active-directory-foundations',
      order: 4,
      title: 'Reading LDAP',
      summary: 'Distinguished names, organisational units, and userAccountControl flags.',
      exercises: MODULE_4,
    },
    {
      id: '5',
      packageId: 'active-directory-foundations',
      order: 5,
      title: 'When AD is attacked',
      summary: 'Kerberoasting from hash dump to event log, and back to the overprivileged account that made it possible.',
      exercises: MODULE_5,
    },
  ],
};
