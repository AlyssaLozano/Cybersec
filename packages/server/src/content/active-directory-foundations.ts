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
        'Every Active Directory domain has a DNS name (ridgelinemed.example, here) alongside a shorter NetBIOS name kept for compatibility with older tooling. `Get-ADDomain`, the PowerShell cmdlet that produced this export, is the standard way to ask a domain controller about itself, and its output is a flat list of labelled fields, exactly the shape /etc/resolv.conf or /etc/sshd_config already taught you to read.',
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
    debrief: `${DOMAIN_DNS} is the domain this whole package is about. You have already seen this name: it is the same one in every hostname on rmg-web-02, from ridgelinemed.example itself to the mail and backup servers in /etc/hosts.`,
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
        'A domain controller (DC) is the server that holds the directory itself: accounts, groups, and the authentication service everything else depends on. Larger domains run several DCs sharing the load, coordinated through a set of roles; PDCEmulator is the one that matters most day to day, since it is the authoritative source for password changes and time synchronisation across the domain. In a domain this size, one DC typically holds every role, which is exactly what you should expect to find here.',
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
    debrief: `${DC_HOSTNAME} is the domain controller. Every login, every group check, and every Kerberos ticket the rest of this package looks at was issued by this one machine.`,
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
        'The domain functional level is a floor on how old the domain controllers in this domain are allowed to be, set the last time somebody deliberately raised it. Raising it retires support for older, weaker domain controllers in exchange for newer AD features and, generally, better default security. A domain stuck on an old functional level for years is often a domain nobody has touched in years either, which is worth knowing before you assume its hygiene is current.',
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
    debrief: `${DOMAIN_FUNCTIONAL_LEVEL} is a reasonably current level. It rules out the very old, weakly authenticated domain controllers, but it says nothing about how the accounts and groups inside the domain are actually managed, which is exactly what the rest of this review is for.`,
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
        'A directory export is a list of accounts, one per line here, with a few comment lines at the top explaining the field order. Counting the real rows means excluding those comments, the same subtraction you have already done in Log Analysis: remove what you already understand, then count what is left. `grep -v` inverts a match, keeping every line that does NOT start with the comment marker.',
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
    debrief: `${AD_USERS.length} accounts in this domain: ordinary staff, a handful of disabled leftovers, and a few service accounts. Small enough that a careful review of every one of them is actually realistic, which is the point of starting here.`,
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
        `Every account row here records whether it is enabled, and when it last logged on. Disabled accounts are supposed to be harmless: nobody can authenticate as one. In practice they are worth reading anyway, because an account that gets disabled instead of deleted is a small piece of institutional memory: a contractor's access, a role nobody reassigned, evidence of exactly when somebody left. Read the last-logon date on each disabled account here and you will notice a pattern: every one of them went quiet long before anybody flipped the disabled flag.`,
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
    debrief: `${DISABLED_USERS.length} disabled accounts, and every one of them had already gone stale, more than a year without a logon, before it was disabled. That gap between "stopped being used" and "somebody noticed" is the real finding: a disabled account is safe, but the months it spent enabled and unused were not.`,
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
        'Domain Admins is the most powerful group in the directory: membership means full control over every account, every computer, and every other group in the domain. Because of that, the group should be small and every member should be there for an IT-administration reason you could state in one sentence. Reviewing its membership is one of the highest-value five minutes in any AD hygiene review, precisely because the group is usually small enough to read in full.',
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
    debrief: `${DOMAIN_ADMINS.length} names. Two are IT Infrastructure staff, which is exactly what this group should contain, one is the built-in Administrator account, and one does not obviously belong. Read the next exercise before you decide which.`,
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
        `A name alone rarely proves anything; the department field does. This is the same move Log Analysis taught with a second log file corroborating the first: one export raises the question, a second, independently maintained export answers it. Cross-referencing "who is in this powerful group" against "what does this account actually do" is one of the most repeatable findings in identity hygiene, and it is also the concrete version of a lesson Identity Foundations covers more generally: privileged group membership is supposed to track a job function, and the moment it stops doing that, the group stops meaning anything.`,
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
    debrief: `${ANOMALOUS_ADMIN.sam} works in ${ANOMALOUS_ADMIN.department}, and has full control over the domain anyway. Nothing about this proves malice, most overprivileged accounts are exactly this boring: somebody was added for a one-time task and never removed. It is still the finding that matters most in this whole export, because it is a standing risk every single day it goes unnoticed, not a one-time event.`,
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
        'Kerberos is how a Windows domain actually authenticates: instead of proving your password to every service you touch, you prove it once to get a Ticket Granting Ticket (TGT), then use that to request a separate service ticket for each thing you access, without your password ever leaving your workstation again. `klist` is the standard Windows tool for showing what is currently cached, and every entry in its output has a `Server:` line naming what the ticket is for.',
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
    debrief: `${KERBEROS_TICKETS.length} tickets. One of them is the TGT that started the session; the rest are service tickets requested with it. Reading the difference between the two is the next exercise.`,
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
        'Every service ticket in the cache is named for what it is FOR: HTTP for a web server, CIFS for a file share, LDAP for the directory itself. The TGT is different: its Server field names `krbtgt`, the special account every domain controller uses to sign these tickets, rather than any real service. It is issued once, at the start of a session, and every service ticket after it is requested using the TGT rather than the original password, which is the whole point: the password only has to touch the network once.',
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
    debrief: `That is the anchor for this whole session: every other ticket in the cache was requested using this one, without the password being typed again. Losing this ticket to an attacker is functionally as dangerous as losing the password itself, for as long as it stays valid.`,
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
        'Modern Kerberos tickets are encrypted with AES-256, which is what you should expect to see on every line here. RC4-HMAC is an older, much weaker cipher still supported for compatibility, and a ticket using it is a real signal: RC4 keys can be brute-forced offline dramatically faster than AES ones, so a ticket you can capture in this weaker form is a ticket worth trying to crack. In practice, an RC4 ticket usually means one of two things: a legacy service account whose configuration nobody updated when the domain moved to AES, or an attacker deliberately requesting a downgrade because the strong version is too expensive to attack. The encryption type and the service it belongs to sit on different lines of the same entry, so read the whole ticket rather than filtering to one line: grep would hand you the cipher without the context of which ticket it belongs to.',
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
    debrief: `${WEAK_TICKET.server} is the one ticket in this cache using RC4. A single weak ticket among several strong ones is exactly the shape a Kerberoasting attempt leaves behind, and module 5 shows what that ticket looks like once somebody extracts and tries to crack it.`,
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
        'A finding is only a finding in contrast to a baseline. Before you can say "one ticket stands out", you have to know how many did not. Confirming that every other ticket in this cache uses AES-256 is what turns "there is an RC4 ticket in here somewhere" into "there is exactly one, and everything else is normal", which is a much more precise, and more defensible, claim to put in a report.',
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
    debrief: `${AES_TICKET_COUNT} strong tickets, one weak one. That ratio is what makes the RC4 ticket worth escalating rather than shrugging off: it is not how this environment normally behaves.`,
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
        'LDAP names every object by its distinguished name (DN): a full path through the directory\'s tree, most-specific first, such as `CN=Ruoxi Chen,OU=Staff,DC=ridgelinemed,DC=example`. `ldapsearch` is the standard tool for querying an LDAP directory directly, and its output (or an LDIF-formatted export of it, as here) lists one attribute per line under each entry\'s `dn:` line. The DN itself is spelled out with the person\'s full name, not their short account name, which is why the cross-reference from the user export matters: it is what turns "rchen" into "Ruoxi Chen", the string that actually appears in this file.',
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
    debrief: `Her account lives in OU=Staff, the ordinary employee organisational unit. Where an account sits in the tree is itself informative: an account under OU=Service Accounts or OU=Clinical is a different kind of thing than one under OU=Staff, before you have read a single other attribute.`,
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
        'userAccountControl is a single number that packs together a whole set of account flags as bits: whether the account is enabled, whether it needs pre-authentication, and, among others, whether its password ever expires. A value of 512 is a completely ordinary enabled account. Adding 65536 (DONT_EXPIRE_PASSWORD) gives 66048: an account whose password is never forced to rotate. That is a real and common hygiene finding on service accounts, whose passwords are often deliberately left to never expire because rotating them would need every service that uses them updated in lockstep, and in practice that coordination often just never happens.',
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
    debrief: `${NOTABLE_LDAP_ENTRY.sam} never has to rotate its password. On its own that is a manageable, common trade-off for a service account. It stops being manageable the moment nobody remembers which services depend on that password, because then it can never be changed at all, only worked around.`,
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
        'A distinguished name encodes the object\'s position in the directory tree, and the OU= component names which organisational unit it sits in. Pulling that substring out of every dn: line and reducing it to the distinct values answers "how many different parts of the tree does this small sample even touch", which is the same rank-and-count shape you have already used on log files: extract the field you care about, then let sort -u tell you how many distinct values there really are.',
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
    debrief: `${DISTINCT_OUS.length} distinct OUs in this small sample: ordinary staff, clinical staff, and service accounts, each organised separately. A directory laid out like this makes an OU-scoped policy or a targeted access review possible; a directory with everyone dumped into one flat container does not.`,
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
        'Kerberoasting is what an attacker does with a weak-encryption service ticket like the one module 3 found: request the ticket (any authenticated domain account can request a service ticket for any SPN), extract the encrypted portion, and try to crack it offline, without ever touching the domain controller again after the initial request. `$krb5tgs$23$*account$realm$SPN*$hash` is the standard hashcat format for exactly that: etype 23 is RC4, the same weak cipher you already found, and the account name sits right there in the hash line, in the clear.',
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
    debrief: `${KERBEROAST_TARGET_SAM}: the same account whose ticket you found using RC4 back in module 3, and the same one whose password never expires from module 4. This is what actually requesting that ticket and extracting it for offline cracking looks like on disk.`,
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
        'Windows Event ID 4769 records every Kerberos service ticket request the domain controller processes, which on a real domain is thousands of routine events a day: ordinary users\' machines quietly asking for tickets to the file shares and web apps they use. A small, boring baseline like this one is exactly what you should expect to see most of, which is what makes the anomaly in the next exercise stand out at all.',
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
    debrief: `${EVENT_4769_ALL.length} events, short enough to read individually, which a real domain's volume almost never allows. Reading each one is exactly what the next exercise does.`,
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
        'A normal 4769 event is one account, one service, occasionally, spread across a working day: somebody\'s laptop asking for a ticket to the file share it always uses. Kerberoasting looks completely different: one account requesting tickets for many DIFFERENT services, often ones that account has no ordinary reason to touch, all within seconds, because the attacker is not trying to use any of those services, they are collecting tickets to crack offline afterward and casting as wide a net as the domain will tolerate before it notices.',
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
    debrief: `${ANOMALOUS_ADMIN_SAM} requested ${BURST_EVENT_COUNT} tickets for ${BURST_EVENT_COUNT} different services in the space of a few seconds: HTTP, CIFS, LDAP, a SQL server, and an FTP host, none of which a Marketing account has any ordinary reason to touch. That is the Kerberoasting signature: breadth and speed, not any one request looking wrong on its own.`,
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
        'This is the whole review, end to end. A Marketing account sat in Domain Admins for no stated reason (module 2). The service account with the weak, never-expiring credential got kerberoasted (modules 3 and 4). And the account that actually did the kerberoasting, requesting tickets for services it had no business touching, is the very same overprivileged Marketing account (module 5). None of those three findings needed the others to be true on their own, but together they describe one coherent path: an account that should never have had domain-wide privilege used exactly that privilege to go hunting for a crackable credential, and found one. Overprivileged group membership is not an abstract audit checkbox; it is the access an incident like this one runs on.',
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
    debrief: `Confirmed: the same account. An overprivileged Marketing account with no IT function was sitting in the one group that could ask the domain controller for anything, and it used that standing access to go looking for a credential to crack. Fixing this domain does not start with the Kerberos ticket; it starts with the group membership that let the request happen in the first place.`,
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
