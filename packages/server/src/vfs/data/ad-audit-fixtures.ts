/**
 * Static evidence for the Active Directory Foundations package: an export of
 * the Ridgeline Med domain, collected by IT before handing it to the SOC
 * team for a hygiene review.
 *
 * There is no simulated Active Directory service anywhere in this codebase,
 * and building one live is out of scope -- the terminal engine has exactly
 * one filesystem and one machine, both already spoken for by rmg-web-02.
 * What a SOC analyst gets in real life is rarely a live directory anyway:
 * it is an export somebody ran and handed over. This package teaches that
 * skill, the same way log-analysis.ts teaches auth.log by having students
 * grep a file rather than query a live host.
 *
 * Every user record, group membership, ticket, LDAP entry, and log line
 * below is structured data first and rendered text second, and every
 * exercise check is derived from these same arrays -- never a hand-typed
 * count sitting next to the array that could silently disagree with it.
 *
 * THE THREAD THROUGH ALL FIVE MODULES
 *
 * bfoster (Marketing) sits in Domain Admins despite having no IT function --
 * module 2's overprivileged-group finding. The same account is the one
 * requesting a burst of service tickets for services it has no business
 * touching in module 5's event log, and svc-sql, the service account whose
 * ticket downgrades to RC4 in module 3, is the one that burst manages to
 * crack in module 5's hash dump. None of this is invented after the fact:
 * the account list, the group membership, and the ticket/event data all
 * point at the same two accounts because they are built from the same
 * constants below.
 */

import { ageInDays, daysAgo, onAugust15 } from '../clock.js';

function ymd(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DOMAIN_DNS = 'ridgelinemed.example';
export const DOMAIN_NETBIOS = 'RIDGELINEMED';
export const DC_HOSTNAME = 'rmg-dc-01.ridgelinemed.example';
export const DOMAIN_SID = 'S-1-5-21-3841286579-2718281828-1414213562';
export const DOMAIN_FUNCTIONAL_LEVEL = 'Windows2016Domain';

// The account this whole package's narrative turns on: overprivileged in
// module 2, and the one kerberoasting in module 5.
export const ANOMALOUS_ADMIN_SAM = 'bfoster';
// The account whose weak ticket module 3 finds and module 5's hash dump cracks.
export const KERBEROAST_TARGET_SAM = 'svc-sql';

// --- module 1: domain-info.txt ----------------------------------------------

export const DOMAIN_INFO_FILE = `DistinguishedName            : DC=ridgelinemed,DC=example
DNSRoot                       : ${DOMAIN_DNS}
NetBIOSName                   : ${DOMAIN_NETBIOS}
DomainSID                     : ${DOMAIN_SID}
DomainMode                    : ${DOMAIN_FUNCTIONAL_LEVEL}
Forest                        : ${DOMAIN_DNS}
InfrastructureMaster          : ${DC_HOSTNAME}
PDCEmulator                   : ${DC_HOSTNAME}
RIDMaster                     : ${DC_HOSTNAME}
`;

// --- module 2: users-export.txt and domain-admins-members.txt --------------

export interface AdUserRecord {
  sam: string;
  displayName: string;
  department: string;
  enabled: boolean;
  lastLogon: number;
}

export const AD_USERS: AdUserRecord[] = [
  { sam: 'jmartel', displayName: 'Jean Martel', department: 'Operations', enabled: true, lastLogon: onAugust15(7, 38, 0) },
  { sam: 'dokafor', displayName: 'Dara Okafor', department: 'Engineering', enabled: true, lastLogon: daysAgo(2) },
  { sam: 'rchen', displayName: 'Ruoxi Chen', department: 'Database', enabled: true, lastLogon: daysAgo(1) },
  { sam: 'kbryant', displayName: 'Kayla Bryant', department: 'Finance', enabled: true, lastLogon: daysAgo(3) },
  { sam: 'twalsh', displayName: 'Theo Walsh', department: 'Finance', enabled: true, lastLogon: daysAgo(4) },
  { sam: 'mkapoor', displayName: 'Meera Kapoor', department: 'Human Resources', enabled: true, lastLogon: daysAgo(2) },
  { sam: 'jsantos', displayName: 'Javier Santos', department: 'Clinical Operations', enabled: true, lastLogon: daysAgo(1) },
  { sam: 'lreyes', displayName: 'Lena Reyes', department: 'Clinical Operations', enabled: true, lastLogon: daysAgo(5) },
  { sam: 'bfoster', displayName: 'Ben Foster', department: 'Marketing', enabled: true, lastLogon: onAugust15(11, 6, 40) },
  { sam: 'agupta', displayName: 'Anika Gupta', department: 'Marketing', enabled: true, lastLogon: daysAgo(6) },
  { sam: 'dcollins', displayName: 'Drew Collins', department: 'Helpdesk', enabled: true, lastLogon: daysAgo(1) },
  { sam: 'nwhite', displayName: 'Nora White', department: 'Helpdesk', enabled: true, lastLogon: daysAgo(2) },
  { sam: 'rjenkins', displayName: 'Ray Jenkins', department: 'IT Infrastructure', enabled: true, lastLogon: daysAgo(1) },
  { sam: 'cmoreau', displayName: 'Chloe Moreau', department: 'IT Infrastructure', enabled: true, lastLogon: daysAgo(1) },
  { sam: 'pdiallo', displayName: 'Paul Diallo', department: 'Legal', enabled: true, lastLogon: daysAgo(9) },
  { sam: 'hsong', displayName: 'Hana Song', department: 'Radiology', enabled: true, lastLogon: daysAgo(3) },
  { sam: 'eabara', displayName: 'Ella Abara', department: 'Radiology', enabled: true, lastLogon: daysAgo(4) },
  { sam: 'wturner', displayName: 'Wes Turner', department: 'Facilities', enabled: false, lastLogon: daysAgo(402) },
  { sam: 'ksmith', displayName: 'Kelly Smith', department: 'Marketing', enabled: false, lastLogon: daysAgo(486) },
  { sam: 'gburke', displayName: 'Contractor - Grant Burke (offboarded)', department: 'Facilities', enabled: false, lastLogon: daysAgo(551) },
  { sam: 'svc-backup', displayName: 'Backup Service Account', department: 'IT Infrastructure', enabled: true, lastLogon: daysAgo(0) },
  { sam: 'svc-sql', displayName: 'SQL Service Account', department: 'Database', enabled: true, lastLogon: daysAgo(0) },
  { sam: 'svc-scan', displayName: 'Vulnerability Scanner Service', department: 'IT Infrastructure', enabled: true, lastLogon: daysAgo(1) },
];

/** Disabled, and every one of them stale by the same measure: nobody had
 *  logged them in for over a year before somebody finally flipped the flag. */
export const STALE_THRESHOLD_DAYS = 365;
export const DISABLED_USERS = AD_USERS.filter((user) => !user.enabled);
export const STALE_USERS = AD_USERS.filter((user) => ageInDays(user.lastLogon) > STALE_THRESHOLD_DAYS);

function renderUserLine(user: AdUserRecord): string {
  return `${user.sam}|${user.displayName}|${user.department}|${user.enabled ? 'True' : 'False'}|${ymd(user.lastLogon)}`;
}

export const USERS_EXPORT_FILE = `# Ridgeline Medical Group -- Active Directory user export
# Fields: sAMAccountName|DisplayName|Department|Enabled|LastLogonDate
# Collected 2026-08-15 for the SOC hygiene review
${AD_USERS.map(renderUserLine).join('\n')}
`;

export const DOMAIN_ADMINS: string[] = ['Administrator', 'rjenkins', 'cmoreau', ANOMALOUS_ADMIN_SAM];

/** Every account record keyed by sAMAccountName, for cross-referencing one
 *  file's names against another's without re-scanning the array each time. */
export const AD_USER_BY_SAM = new Map(AD_USERS.map((user) => [user.sam, user]));

/**
 * The Domain Admin whose department has nothing to do with running the
 * domain. Derived rather than named directly, so that if the membership
 * list above is ever edited the exercise that asks a student to find this
 * account cannot go looking for an answer that stopped being true.
 */
export const ANOMALOUS_ADMIN = AD_USERS.find(
  (user) => DOMAIN_ADMINS.includes(user.sam) && user.department !== 'IT Infrastructure',
)!;

export const DOMAIN_ADMINS_FILE = `# Domain Admins -- group membership export
# Collected 2026-08-15 for the SOC hygiene review
${DOMAIN_ADMINS.join('\n')}
`;

// --- module 3: klist-output.txt ---------------------------------------------

export interface KerberosTicket {
  client: string;
  server: string;
  etype: string;
  start: string;
  end: string;
  renew: string;
}

/** Windows realm names are the DNS domain, uppercased. */
export const REALM = DOMAIN_DNS.toUpperCase();
const AES = 'AES-256-CTS-HMAC-SHA1-96';
const RC4 = 'RC4-HMAC(NT)';

export const KERBEROS_TICKETS: KerberosTicket[] = [
  { client: 'jmartel', server: `krbtgt/${REALM}`, etype: AES, start: '8/15/2026 7:38:12', end: '8/15/2026 17:38:12', renew: '8/22/2026 7:38:12' },
  { client: 'jmartel', server: 'HTTP/rmg-web-02.ridgelinemed.example', etype: AES, start: '8/15/2026 7:39:01', end: '8/15/2026 17:38:12', renew: '8/22/2026 7:38:12' },
  { client: 'jmartel', server: 'CIFS/rmg-backup-01.ridgelinemed.example', etype: AES, start: '8/15/2026 8:02:47', end: '8/15/2026 17:38:12', renew: '8/22/2026 7:38:12' },
  { client: 'jmartel', server: 'LDAP/rmg-dc-01.ridgelinemed.example', etype: AES, start: '8/15/2026 7:38:14', end: '8/15/2026 17:38:12', renew: '8/22/2026 7:38:12' },
  { client: 'jmartel', server: `MSSQLSvc/rmg-sql-01.ridgelinemed.example:1433`, etype: RC4, start: '8/15/2026 9:14:02', end: '8/15/2026 17:38:12', renew: '8/22/2026 7:38:12' },
];

export const WEAK_TICKET = KERBEROS_TICKETS.find((ticket) => ticket.etype === RC4)!;
export const AES_TICKET_COUNT = KERBEROS_TICKETS.filter((ticket) => ticket.etype === AES).length;

// Deliberately carries the encryption type on exactly one line. klist really
// does print it twice (KerbTicket and Session Key), but this simulator's
// grep has no -A/-B/-C context lines, so a fact an exercise greps for must
// sit on one line, not two, or a plain grep -c would silently double count.
function renderTicket(ticket: KerberosTicket, index: number): string {
  return `#${index}>     Client: ${ticket.client} @ ${REALM}
        Server: ${ticket.server} @ ${REALM}
        KerbTicket Encryption Type: ${ticket.etype}
        Ticket Flags 0x40e10000 -> forwardable renewable initial pre_authent name_canonicalize
        Start Time: ${ticket.start} (local)
        End Time:   ${ticket.end} (local)
        Renew Time: ${ticket.renew} (local)
`;
}

export const KLIST_OUTPUT_FILE = `Cached Tickets: (${KERBEROS_TICKETS.length})

${KERBEROS_TICKETS.map(renderTicket).join('\n')}`;

// --- module 4: ldapsearch-users.ldif ----------------------------------------

export interface LdapEntry {
  dn: string;
  sam: string;
  memberOf: string;
  userAccountControl: number;
}

/** userAccountControl 66048 = NORMAL_ACCOUNT (512) + DONT_EXPIRE_PASSWORD
 *  (65536): a real, common finding on service accounts whose password
 *  nobody wants to rotate on a schedule and nobody ever does by hand. */
export const UAC_DONT_EXPIRE_PASSWORD = 66048;

// memberOf deliberately points into CN=Users rather than an OU: built-in and
// legacy security groups usually live in that default container rather than
// a custom OU, and it keeps "OU=" appearing only where an entry's own dn
// places it, which is what the module 4 exercises grep for.
export const LDAP_ENTRIES: LdapEntry[] = [
  { dn: 'CN=Jean Martel,OU=Staff,DC=ridgelinemed,DC=example', sam: 'jmartel', memberOf: 'CN=Operations,CN=Users,DC=ridgelinemed,DC=example', userAccountControl: 512 },
  { dn: 'CN=Ruoxi Chen,OU=Staff,DC=ridgelinemed,DC=example', sam: 'rchen', memberOf: 'CN=Database Admins,CN=Users,DC=ridgelinemed,DC=example', userAccountControl: 512 },
  { dn: 'CN=Hana Song,OU=Clinical,DC=ridgelinemed,DC=example', sam: 'hsong', memberOf: 'CN=Radiology,CN=Users,DC=ridgelinemed,DC=example', userAccountControl: 512 },
  { dn: 'CN=SQL Service Account,OU=Service Accounts,DC=ridgelinemed,DC=example', sam: 'svc-sql', memberOf: 'CN=Database Admins,CN=Users,DC=ridgelinemed,DC=example', userAccountControl: UAC_DONT_EXPIRE_PASSWORD },
  { dn: 'CN=Ben Foster,OU=Staff,DC=ridgelinemed,DC=example', sam: 'bfoster', memberOf: 'CN=Domain Admins,CN=Users,DC=ridgelinemed,DC=example', userAccountControl: 512 },
];

export const NOTABLE_LDAP_ENTRY = LDAP_ENTRIES.find(
  (entry) => entry.userAccountControl === UAC_DONT_EXPIRE_PASSWORD,
)!;

/** Distinct OUs across every dn, extracted the same way an exercise's grep
 *  would: everything between "OU=" and the next comma. */
export const DISTINCT_OUS = [...new Set(LDAP_ENTRIES.map((entry) => /OU=([^,]+)/.exec(entry.dn)![1]))];

function renderLdapEntry(entry: LdapEntry): string {
  return `dn: ${entry.dn}
sAMAccountName: ${entry.sam}
memberOf: ${entry.memberOf}
userAccountControl: ${entry.userAccountControl}
`;
}

export const LDAPSEARCH_USERS_FILE = LDAP_ENTRIES.map(renderLdapEntry).join('\n');

// --- module 5: kerberoast-hashes.txt and security-events-4769.txt ----------

export const KERBEROAST_HASHES_FILE = `# Extracted 2026-08-15 during the SOC hygiene review, from the ticket in
# klist-output.txt that used the weak RC4 encryption type.
# hashcat mode 13100 (Kerberos 5, etype 23, TGS-REP)
$krb5tgs$23$*${KERBEROAST_TARGET_SAM}$${REALM}$${WEAK_TICKET.server}*$8f3a1c9e2b7d4f1a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8$abcdef1234567890abcdef1234567890
`;

export interface Event4769 {
  time: string;
  account: string;
  service: string;
  etype: string;
}

const NORMAL_ETYPE = '0x12';
const WEAK_ETYPE = '0x17';

export const EVENT_4769_BASELINE: Event4769[] = [
  { time: '08/15/2026 07:40:11 AM', account: 'jmartel', service: 'rmg-web-02$', etype: NORMAL_ETYPE },
  { time: '08/15/2026 07:52:33 AM', account: 'dokafor', service: 'rmg-web-02$', etype: NORMAL_ETYPE },
  { time: '08/15/2026 08:15:04 AM', account: 'rchen', service: 'rmg-backup-01$', etype: NORMAL_ETYPE },
  { time: '08/15/2026 09:03:57 AM', account: 'hsong', service: 'rmg-dc-01$', etype: NORMAL_ETYPE },
  { time: '08/15/2026 10:22:19 AM', account: 'cmoreau', service: 'rmg-dc-01$', etype: NORMAL_ETYPE },
];

/** The kerberoasting signature: one account, many different SPNs, seconds
 *  apart. This is the same account module 2 finds sitting in Domain Admins
 *  with no IT function -- the same access that let it ask the DC for
 *  tickets nobody expected it to want. */
export const EVENT_4769_BURST: Event4769[] = [
  { time: '08/15/2026 11:07:02 AM', account: ANOMALOUS_ADMIN_SAM, service: 'HTTP/rmg-web-01.ridgelinemed.example', etype: WEAK_ETYPE },
  { time: '08/15/2026 11:07:03 AM', account: ANOMALOUS_ADMIN_SAM, service: 'HTTP/rmg-web-02.ridgelinemed.example', etype: WEAK_ETYPE },
  { time: '08/15/2026 11:07:03 AM', account: ANOMALOUS_ADMIN_SAM, service: 'CIFS/rmg-backup-01.ridgelinemed.example', etype: WEAK_ETYPE },
  { time: '08/15/2026 11:07:04 AM', account: ANOMALOUS_ADMIN_SAM, service: 'LDAP/rmg-dc-01.ridgelinemed.example', etype: WEAK_ETYPE },
  { time: '08/15/2026 11:07:04 AM', account: ANOMALOUS_ADMIN_SAM, service: `MSSQLSvc/rmg-sql-01.ridgelinemed.example:1433`, etype: WEAK_ETYPE },
  { time: '08/15/2026 11:07:05 AM', account: ANOMALOUS_ADMIN_SAM, service: 'FTP/rmg-mail-01.ridgelinemed.example', etype: WEAK_ETYPE },
];

export const EVENT_4769_ALL: Event4769[] = [...EVENT_4769_BASELINE, ...EVENT_4769_BURST];
export const BURST_EVENT_COUNT = EVENT_4769_BURST.length;

function renderEvent(event: Event4769): string {
  return `${event.time}  Microsoft-Windows-Security-Auditing  4769  A Kerberos service ticket was requested. Account Name: ${event.account}@${REALM}  Service Name: ${event.service}  Encryption Type: ${event.etype}`;
}

// The header deliberately avoids the literal event id digits, so a plain
// `grep -c` for the event id counts only real log lines, never the comment
// that explains them.
export const SECURITY_EVENTS_4769_FILE = `# Security event log excerpt: Kerberos service ticket requests
# Exported 2026-08-15 for the SOC hygiene review
${EVENT_4769_ALL.map(renderEvent).join('\n')}
`;
