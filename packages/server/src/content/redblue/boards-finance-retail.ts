/**
 * Board scenarios: finance, retail and telecommunications.
 *
 * The sector these boards share is the one where the attacker is usually after
 * money rather than secrets, and that changes the defensive shape. In healthcare
 * the crown is the system whose loss stops the organisation working; here it is
 * usually the system that moves value, and the defining constraint is that it is
 * ALSO the system the business least tolerates being interrupted. Blue on these
 * boards is playing against its own change control as much as against Red.
 *
 * Written to the same standard as the rest: every system names its ATT&CK
 * technique, and the four outcome lines give the method, the detection logic,
 * the artefact and the containment sequence, so a student can discuss any of it.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * Payment fraud, where the crown is a system nobody is allowed to turn off.
 *
 * The teaching point is the difference between stealing data and moving money.
 * Red is not exfiltrating a card database; Red is trying to reach the switch
 * that authorises transactions, because a fraudulent authorisation is final in
 * a way that a stolen record is not. Blue's hard problem is that containment on
 * a payment switch is a business decision above its pay grade, so the drill is
 * to find it early enough that containment is still cheap.
 */
export const SWITCH_CASTLEBAY = definePositional({
  id: 'bd-switch-castlebay',
  title: 'Value Date: Castle and Bay',
  brief:
    'A financially motivated group is inside a mid-size bank and working toward the payment switch. ' +
    'Six systems, two defences, nine rounds. The thing you are defending is the thing the business ' +
    'will not let you take offline, so find them early: containment gets more expensive every round.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['payment', 'fraud', 'transaction', 'authorise', 'swift', 'settlement', 'money', 'reconcile'],
  dossier: {
    org: 'Castle and Bay Bank',
    summary:
      'A retail and commercial bank of about 3,000 staff. Card authorisation and wire transfer sit ' +
      'behind an internal firewall with a documented set of permitted flows. Segmentation is real ' +
      'here, which makes the pivot hosts disproportionately valuable. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Payment switch, 10.70.3.10 (crown)' },
      { k: 'Card segment', v: '10.70.3.0/24' },
      { k: 'Corporate', v: '10.70.1.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'onlinebank',
      label: 'Online banking',
      note: 'ib.castlebay.example, 203.0.113.70. Customer facing, WAF in front, heavily tested.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'A server-side request forgery in the statement export lets you reach the cloud metadata service and ' +
          'retrieve the instance role credentials. The application is well tested against the obvious ' +
          'injections; it is the outbound request nobody threat-modelled.',
        detect:
          'Egress monitoring from the application tier to the metadata endpoint. The application has no ' +
          'legitimate reason to call it, so a single request is a high confidence alert.',
        evidence:
          'Application logs showing an export parameter containing an internal URL, followed by API calls made ' +
          'with the instance role from an address outside the estate.',
        contain:
          'The instance role credentials are revoked, the export parameter is restricted to an allowlist of ' +
          'internal endpoints, and the metadata service is moved to the version that requires a session token.',
      },
    },
    {
      id: 'teller',
      label: 'Branch teller estate',
      note: 'Approximately 400 workstations across branches. Standard build, shared local administrator.',
      technique: 'T1550.002 Use Alternate Authentication Material: Pass the Hash',
      flavour: {
        compromise:
          'One shared local administrator password across four hundred machines means one hash opens all of ' +
          'them. You never need to crack it: you authenticate with the hash directly. This is exactly the ' +
          'problem LAPS was invented to solve, and its absence is the single most common finding in a bank.',
        detect:
          'Windows event 4624 with logon type 3 and an NTLM authentication package, for the local ' +
          'administrator account, across many distinct destinations from one source in a short window.',
        evidence:
          'The same local administrator SID authenticating to sixty branch workstations in four minutes, none ' +
          'of them in the same region as the source.',
        contain:
          'Local administrator passwords are randomised per host with a managed solution, the account is ' +
          'denied network logon by group policy, and the source workstation is isolated.',
      },
    },
    {
      id: 'swift',
      label: 'Wire transfer terminal',
      note: 'WIRE01, 10.70.3.40. Dedicated workstation for high-value transfers. Dual authorisation.',
      technique: 'T1565.002 Data Manipulation: Transmitted Data Manipulation',
      flavour: {
        compromise:
          'The wire terminal is where the famous bank heists happened. The interesting part is not sending a ' +
          'payment, it is suppressing the confirmation so reconciliation does not notice until the next ' +
          'business day. Attacking the record of the transaction buys you time the transaction itself does not.',
        detect:
          'Reconciliation controls rather than security tooling: a message sent with no corresponding ' +
          'confirmation, or a confirmation printer that has stopped printing. The control that catches this is ' +
          'an accounting one.',
        evidence:
          'A modified confirmation handler on the terminal, and an outbound message with a value date set for ' +
          'a public holiday in the receiving jurisdiction.',
        contain:
          'The terminal is disconnected, the messages are recalled while recall is still possible, ' +
          'reconciliation is done manually against the network operator record, and dual authorisation is ' +
          'verified as technically enforced rather than procedurally expected.',
      },
    },
    {
      id: 'cardauth',
      label: 'Card authorisation',
      note: 'AUTH01, 10.70.3.30. Approves or declines transactions in real time. PCI scope.',
      technique: 'T1499.004 Endpoint Denial of Service: Application or System Exploitation',
      flavour: {
        compromise:
          'You do not need to steal cards if you can change the answer. Forcing the authorisation host into a ' +
          'degraded state pushes the estate into stand-in processing, where offline limits apply and ' +
          'verification is weaker. The fraud happens in the gap.',
        detect:
          'Transaction telemetry: an unexplained rise in stand-in authorisations, or a decline rate that drops ' +
          'sharply. Business metrics are the detection surface here, not endpoint logs.',
        evidence:
          'Stand-in processing engaged for eleven minutes with no corresponding infrastructure incident, and a ' +
          'cluster of low-value approvals in one merchant category during the window.',
        contain:
          'Stand-in limits are lowered immediately, the host is failed over to the standby, and the ' +
          'transactions in the window are pulled for fraud review before settlement.',
      },
    },
    {
      id: 'treasury',
      label: 'Treasury system',
      note: 'TRS01, 10.70.1.60. Liquidity and interbank positions. Small user population.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'Treasury will not move money for you, but it tells you when the bank is at its most liquid and how ' +
          'positions are cleared. Timing intelligence is what turns an opportunistic fraud into a planned one.',
        detect:
          'A tiny user population makes behavioural baselining genuinely reliable here: an access by anyone ' +
          'outside the fifteen named users is worth an alert on its own.',
        evidence:
          'Position reports opened by an account from outside the treasury group, at a time of day when the ' +
          'desk is closed.',
        contain:
          'Access is restricted to the named group with a formal review, and the reports are watermarked so a ' +
          'leaked copy can be traced.',
      },
    },
    {
      id: 'switch',
      label: 'Payment switch',
      note: 'SW01, 10.70.3.10. Routes and authorises every transaction. The objective.',
      crown: true,
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The switch decides what is approved and what the ledger later says happened. Reaching it unseen ' +
          'means you can raise limits on a set of accounts, let the withdrawals run, and put the limits back. ' +
          'This is the cash-out pattern behind the large coordinated ATM operations.',
        detect:
          'Configuration integrity monitoring on the switch, and velocity rules that fire on limit changes ' +
          'rather than on transactions. The change is the signal; the transactions are the consequence.',
        evidence:
          'Withdrawal limits raised on forty accounts in one configuration push with no change record, and ' +
          'the same accounts appearing in an unusual geographic spread of withdrawals within the hour.',
        contain:
          'Configuration is rolled back from a signed baseline, the affected accounts are blocked, the card ' +
          'scheme is notified, and switch administration is moved onto privileged access workstations with ' +
          'session recording.',
      },
    },
  ],
});

/**
 * Card data, and the point-of-sale estate that has been the industry's worst
 * recurring lesson.
 *
 * The board is built around the third-party access path, because that is how the
 * historic retail breaches actually happened: not through the shop floor, but
 * through a vendor with a legitimate account. Blue's temptation is to watch the
 * tills; the lesson is to watch the door the vendor came through.
 */
export const TILL_HALLORAN = definePositional({
  id: 'bd-till-halloran',
  title: 'Peak Trading: Halloran Retail',
  brief:
    'A retailer three weeks before its busiest trading period, when nobody is allowed to change ' +
    'anything. Six systems, two defences, ten rounds. Red wants the card data environment. Look at ' +
    'how Red got in before you decide what to watch.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['card', 'pci', 'pos', 'till', 'vendor', 'supplier', 'segment', 'scrape', 'trading'],
  dossier: {
    org: 'Halloran Retail Group',
    summary:
      'A chain of 180 stores. The card data environment is segmented from corporate, and the ' +
      'segmentation is audited annually, which is not the same as being correct daily. HVAC and ' +
      'refrigeration are maintained by a third party with remote access. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Card data environment, 10.80.5.10 (crown)' },
      { k: 'Card segment (CDE)', v: '10.80.5.0/24' },
      { k: 'Store network', v: '10.80.2.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'vendor',
      label: 'Vendor remote access',
      note: 'Third-party HVAC maintenance portal. Shared credential, no MFA, permanent access.',
      technique: 'T1199 Trusted Relationship',
      flavour: {
        compromise:
          'You do not attack the retailer, you attack the refrigeration contractor and use the access they were ' +
          'given. Permanent, shared, unmonitored, and scoped far wider than the job needs. This is the path ' +
          'that produced the defining retail breach of the last decade, and it is still the most common one.',
        detect:
          'Vendor account authentication outside the maintenance window, and any vendor session that reaches a ' +
          'destination outside its documented scope. Third-party accounts should be the most heavily monitored ' +
          'on an estate and are usually the least.',
        evidence:
          'A vendor credential authenticating at 02:00 on a Sunday, then connecting to a host in the store ' +
          'network that has nothing to do with refrigeration.',
        contain:
          'Vendor access is cut, moved to just-in-time provisioning with MFA and a time-boxed window, and ' +
          'scoped by firewall rule to the specific systems the contract covers.',
      },
    },
    {
      id: 'stores',
      label: 'Store network',
      note: 'Store back-office servers, 10.80.2.0/24. Flat within each store, thin links to head office.',
      technique: 'T1021.001 Remote Services: Remote Desktop Protocol',
      flavour: {
        compromise:
          'The store back office is where the retailer stops thinking about security and starts thinking about ' +
          'trading. RDP between stores and head office exists because support needs it at 6am when a till will ' +
          'not open. It is a lateral movement highway.',
        detect:
          'Event 4624 logon type 10 between hosts that have no support relationship, and RDP sessions ' +
          'originating from a store rather than terminating in one. Direction is the discriminator.',
        evidence:
          'An RDP session from a store back-office server to a head office host, initiated from the store side, ' +
          'which support never does.',
        contain:
          'RDP is restricted to a jump host with MFA, store-to-head-office initiation is blocked at the ' +
          'firewall, and network level authentication is enforced.',
      },
    },
    {
      id: 'pos',
      label: 'Point of sale estate',
      note: 'Approximately 1,400 tills. Locked-down build, card data in memory during a transaction.',
      technique: 'T1005 Data from Local System',
      flavour: {
        compromise:
          'Card data is encrypted in transit and encrypted at rest, and for a few milliseconds during the ' +
          'authorisation it is in process memory in the clear. Memory scraping targets exactly that window, ' +
          'which is why point-to-point encryption at the reader is the only real fix.',
        detect:
          'Application allowlisting on the till build, which is small and static enough to make allowlisting ' +
          'genuinely practical. Any unapproved process on a till is an incident.',
        evidence:
          'An unsigned process on 40 tills reading the memory of the payment application, writing to a local ' +
          'file that grows during trading hours and is collected overnight.',
        contain:
          'Tills are re-imaged from the signed build, allowlisting is enforced in blocking mode rather than ' +
          'audit, and the card scheme and acquirer are notified because this is a reportable card event.',
      },
    },
    {
      id: 'ecom',
      label: 'E-commerce front end',
      note: 'shop.halloran.example, 198.51.100.80. Third-party scripts on the checkout page.',
      technique: 'T1059.007 Command and Scripting Interpreter: JavaScript',
      flavour: {
        compromise:
          'The checkout page loads analytics, chat and tag management from other people. Compromise any of ' +
          'those and your script runs on the payment page with full access to the form. Digital skimming does ' +
          'not touch the retailer infrastructure at all, which is what makes it hard to find.',
        detect:
          'Client-side integrity monitoring: subresource integrity on third-party scripts and a content ' +
          'security policy that reports violations. Server-side monitoring cannot see this attack.',
        evidence:
          'A CSP report showing an outbound POST from the checkout page to a domain that is not the payment ' +
          'provider, and a third-party script whose hash changed without a release.',
        contain:
          'The compromised script is removed, subresource integrity pinned, the payment form moved into a ' +
          'hosted iframe so the page cannot read it, and affected customers notified.',
      },
    },
    {
      id: 'loyalty',
      label: 'Loyalty database',
      note: 'LOY01, 10.80.2.50. Names, addresses, purchase history. Not in PCI scope, which is the gap.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'Loyalty data is outside PCI scope, so it gets a fraction of the attention while holding a rich ' +
          'personal profile of several million people. Scope is a compliance boundary, not a risk boundary, and ' +
          'attackers do not read the scoping document.',
        detect:
          'Query volume anomaly against a reporting baseline, and egress volume from a database host that is ' +
          'supposed to serve an internal application only.',
        evidence:
          'A sequential export of the loyalty table over six nights, sized to stay under the daily egress ' +
          'threshold that triggers the alert.',
        contain:
          'The export path is closed, the account disabled, egress limits lowered, and the data protection ' +
          'regulator notified within the statutory window.',
      },
    },
    {
      id: 'cde',
      label: 'Card data environment',
      note: 'CDE01, 10.80.5.10. Aggregation point for card data across the estate. The objective.',
      crown: true,
      technique: 'T1074.002 Data Staged: Remote Data Staging',
      flavour: {
        compromise:
          'The aggregation point, reached unseen. Individual tills give you a trickle; this gives you the whole ' +
          'estate in one place, which is precisely why it is supposed to be segmented and why the segmentation ' +
          'is the control that matters more than any endpoint tool.',
        detect:
          'Egress from the card segment to anywhere that is not the acquirer. The permitted flow list here is ' +
          'genuinely short, so deny-by-default with alerting on the denies is achievable.',
        evidence:
          'An archive assembled in the card segment and a large transfer to an internal staging host outside ' +
          'the segment, through a firewall rule added eighteen months ago for a project that finished.',
        contain:
          'The segment is cut to its documented flows only, the staging host is isolated and imaged, the ' +
          'forensic investigator required by the card schemes is engaged, and every firewall exception into the ' +
          'segment is re-justified or removed.',
      },
    },
  ],
});

/**
 * Insurance claims, where the interesting attack is fraud rather than theft.
 *
 * Most boards teach "they take the data". This one teaches that an attacker who
 * can WRITE is often more dangerous than one who can read, and that the
 * detections which catch it are business controls rather than security products.
 */
export const CLAIMS_PINNACLE = definePositional({
  id: 'bd-claims-pinnacle',
  title: 'Settlement: Pinnacle Insurance',
  brief:
    'Seven systems, two defences, ten rounds. The group inside Pinnacle is not planning to publish ' +
    'anything. They intend to approve claims that should not be approved, which means the ' +
    'detections that matter here look more like accounting than like security.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['claim', 'fraud', 'approve', 'payout', 'underwrite', 'policy', 'adjuster', 'integrity'],
  dossier: {
    org: 'Pinnacle Insurance',
    summary:
      'A general insurer handling motor and property claims, about 5,000 staff, with a claims ' +
      'platform that has been extended by in-house development for fifteen years. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Claims database, 10.90.6.10 (crown)' },
      { k: 'Internal network', v: '10.90.6.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'broker',
      label: 'Broker portal',
      note: 'brokers.pinnacle.example, 192.0.2.50. Thousands of external broker accounts.',
      technique: 'T1078.004 Valid Accounts: Cloud Accounts',
      flavour: {
        compromise:
          'Thousands of external accounts belonging to people who are not your employees, with password ' +
          'hygiene you do not control. Credential stuffing against a broker portal succeeds reliably because ' +
          'the credentials were reused from somewhere else entirely.',
        detect:
          'Distributed authentication failures across many accounts from a rotating address pool, with a low ' +
          'success rate. Volume per account looks normal; volume per endpoint does not.',
        evidence:
          'Nine thousand login attempts across four thousand accounts over two hours, from six hundred ' +
          'addresses, with thirty successes.',
        contain:
          'The successful accounts are locked and reset, MFA is enforced for the portal, and credential ' +
          'stuffing protection is added at the edge with device fingerprinting.',
      },
    },
    {
      id: 'adjuster',
      label: 'Adjuster workstations',
      note: 'Field laptops with claims platform access and delegated approval limits.',
      technique: 'T1566.001 Phishing: Spearphishing Attachment',
      flavour: {
        compromise:
          'An adjuster opens a document that claims to be a repair estimate. The macro is not the payload, it ' +
          'is the loader. What you actually want is the delegated approval limit attached to that account, ' +
          'which is a business permission rather than a technical one.',
        detect:
          'Office application spawning a scripting host, which is Sysmon event 1 with a winword.exe parent and ' +
          'a wscript.exe or powershell.exe child. Near-zero legitimate occurrence in most estates.',
        evidence:
          'A document opened from a mail attachment at 09:14, followed four seconds later by an encoded ' +
          'PowerShell command line and an outbound connection to a newly registered domain.',
        contain:
          'The host is isolated, macros from the internet are blocked by policy rather than by user choice, ' +
          'the credential is reset, and the delegated approval limit on the account is reviewed.',
      },
    },
    {
      id: 'docmgmt',
      label: 'Document management',
      note: 'DOC01, 10.90.6.30. Every claim document, medical report and photograph.',
      technique: 'T1213.002 Data from Information Repositories: SharePoint',
      flavour: {
        compromise:
          'Claim documents include medical reports, which is special category personal data with its own legal ' +
          'weight. They also tell you which claims are large, contested and close to settlement, which is the ' +
          'targeting information a fraud needs.',
        detect:
          'Repository audit for bulk document access, and for search queries whose terms match high-value ' +
          'claim characteristics rather than a caseload.',
        evidence:
          'A search for claims above a value threshold followed by bulk download of the matching documents, by ' +
          'an account whose caseload contains none of them.',
        contain:
          'Access is scoped to caseload, bulk download is rate limited, and the information governance team ' +
          'assesses the special category exposure for notification purposes.',
      },
    },
    {
      id: 'payments',
      label: 'Payments engine',
      note: 'PAY01, 10.90.6.40. Issues settlement payments to claimants and suppliers.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The payments engine executes what the claims system approves. Altering payee bank details on ' +
          'already-approved claims is quieter than approving fraudulent ones, because the approval trail is ' +
          'genuine and only the destination is wrong.',
        detect:
          'Any payee bank detail change on an approved claim, alerted in real time and reconciled against the ' +
          'claimant record. This is a control the finance function owns, and it is the one that works.',
        evidence:
          'Fourteen payee records amended between 22:00 and 23:00, all to three destination accounts, none ' +
          'matching the claimant name on file.',
        contain:
          'The payment run is held before release, amendments reverted, the receiving banks contacted while ' +
          'recall is possible, and payee changes routed through a second approver technically.',
      },
    },
    {
      id: 'underwriting',
      label: 'Underwriting models',
      note: 'UW01, 10.90.6.50. Pricing and risk models. Commercially sensitive.',
      technique: 'T1552.001 Unsecured Credentials: Credentials In Files',
      flavour: {
        compromise:
          'Analytical estates are built by people optimising for iteration speed, so credentials end up in ' +
          'notebooks and scripts in a shared repository. The models themselves are commercially valuable, and ' +
          'the credentials in them reach further than the models do.',
        detect:
          'Secret scanning across repositories and shares, and alerting on database authentications whose ' +
          'client application string is a notebook kernel rather than the application.',
        evidence:
          'A notebook in a shared analytics folder containing a service account password in plain text, and ' +
          'that account authenticating from four hosts that are not analytics hosts.',
        contain:
          'The credential is rotated, secret scanning added to the repository pipeline, and the analytics ' +
          'platform moved to short-lived managed identities so there is nothing static left to find.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.90.6.5. Identity for the whole estate.',
      technique: 'T1558.003 Steal or Forge Kerberos Tickets: Kerberoasting',
      flavour: {
        compromise:
          'Any authenticated user can request a service ticket for any account with a service principal name, ' +
          'and that ticket is encrypted with the service account password. You take it away and crack it ' +
          'offline at your leisure. Legacy service accounts with weak passwords and no expiry are the reliable ' +
          'win, and requesting a ticket is a normal operation.',
        detect:
          'Event 4769 for service tickets requested with RC4 encryption, in volume, from a single account. RC4 ' +
          'is the tell, because modern clients negotiate AES.',
        evidence:
          'Forty service ticket requests in ninety seconds from one workstation account, all RC4, covering ' +
          'every service principal name in the domain.',
        contain:
          'Service account passwords are rotated to long random values, group managed service accounts adopted ' +
          'where possible, RC4 disabled domain-wide, and unnecessary service principal names removed.',
      },
    },
    {
      id: 'claims',
      label: 'Claims database',
      note: 'CLM01, 10.90.6.10. Every claim, status and settlement authority. The objective.',
      crown: true,
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Write access to the claims database unseen means you can approve, revalue and settle. The damage is ' +
          'not a data breach, it is an integrity failure: the insurer can no longer prove which of its own ' +
          'records are true, and that question is far more expensive to answer than a stolen table.',
        detect:
          'Database-level auditing on status transitions, reconciled nightly against the application audit ' +
          'trail. Records changed in the database but not in the application trail is the exact signature of ' +
          'direct manipulation.',
        evidence:
          'Twenty-two claims moved to approved status with no corresponding application event, by a session ' +
          'connecting with a service credential from an adjuster laptop.',
        contain:
          'Direct database access is revoked for application credentials, changes are reverted from the audit ' +
          'trail, settlements in flight are held, and an integrity reconciliation is run across the claim set ' +
          'for the whole exposure window.',
      },
    },
  ],
});

/**
 * Telecommunications, where the crown is other people's identity.
 *
 * A telecom breach is a supply chain attack on everyone who uses SMS as a second
 * factor, which is still most people. The board is here to make that dependency
 * concrete: the subscriber database is not valuable because of the phone numbers,
 * it is valuable because control of a number is control of an account reset
 * somewhere else entirely.
 */
export const SUBSCRIBER_ORBIT = definePositional({
  id: 'bd-subscriber-orbit',
  title: 'Port Out: Orbit Telecom',
  brief:
    'Seven systems, two defences, ten rounds. Red wants the subscriber database, not to sell it, ' +
    'but to take control of individual numbers. Every account elsewhere that resets over SMS ' +
    'depends on Blue holding this one.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['sim', 'swap', 'subscriber', 'number', 'port', 'sms', 'factor', 'reset', 'provisioning'],
  dossier: {
    org: 'Orbit Telecom',
    summary:
      'A mobile network operator with about 4 million subscribers. Retail staff and outsourced ' +
      'contact centre agents both hold provisioning rights, which is the exposure. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Subscriber database, 10.100.8.10 (crown)' },
      { k: 'Core network', v: '10.100.8.0/24' },
      { k: 'Corporate', v: '10.100.1.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'contactcentre',
      label: 'Contact centre',
      note: 'Outsourced agents with provisioning rights. High turnover, shared terminals.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'You do not need to hack a telecom to swap a SIM, you need an agent who will do it. High turnover, ' +
          'low pay, shared terminals and a bonus structure that rewards call handling time. Bribery and social ' +
          'engineering are the actual attack path, which makes this the board where the human control is the ' +
          'technical control.',
        detect:
          'Behavioural analytics per agent: SIM swap rate against peer baseline, and swaps performed outside ' +
          'an inbound call. A swap with no associated call recording is the strongest single indicator.',
        evidence:
          'One agent performing eleven SIM swaps in a shift against a peer median of one, six of them with no ' +
          'inbound call attached.',
        contain:
          'The agent account is suspended, the swaps reversed, affected subscribers contacted directly, and ' +
          'swaps re-gated behind a supervisor approval plus a 24-hour delay for high-risk accounts.',
      },
    },
    {
      id: 'retail',
      label: 'Retail store systems',
      note: 'In-store provisioning terminals across 300 stores.',
      technique: 'T1200 Hardware Additions',
      flavour: {
        compromise:
          'Store terminals are physically accessible to the public for a few seconds at a time, which is enough ' +
          'to attach a device that keylogs or provides a network foothold. Physical access remains the ' +
          'shortest path in retail environments and is usually the least modelled.',
        detect:
          'USB device control alerting on any new human interface device, and network access control refusing ' +
          'unrecognised MAC addresses on the store VLAN.',
        evidence:
          'A previously unseen USB device enumerated on a store terminal during opening hours, followed by ' +
          'after-hours authentication from that terminal.',
        contain:
          'The device is recovered and preserved for the police report, USB ports are restricted by policy, ' +
          'store network access control is enforced, and terminals are physically secured.',
      },
    },
    {
      id: 'provisioning',
      label: 'Provisioning platform',
      note: 'PROV01, 10.100.8.30. Executes SIM changes and number ports.',
      technique: 'T1098 Account Manipulation',
      flavour: {
        compromise:
          'The provisioning platform is where a SIM swap actually happens. Reaching it directly removes the ' +
          'agent from the loop entirely, so the swap has no call, no ticket and no human to notice.',
        detect:
          'Provisioning API calls with no originating case reference, and swap volume anomalies per hour ' +
          'against a seasonal baseline.',
        evidence:
          'Sixteen SIM changes issued through the API in four minutes, none with a case reference, all for ' +
          'accounts with high-value banking associations.',
        contain:
          'API credentials are rotated, provisioning is required to carry a valid case reference, a mandatory ' +
          'delay is added for high-risk swaps, and the affected numbers are locked pending verification.',
      },
    },
    {
      id: 'billing',
      label: 'Billing platform',
      note: 'BILL01, 10.100.1.40. Subscriber billing, addresses and payment methods.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'Billing tells you which subscribers are worth targeting: address, tariff, device value and payment ' +
          'history. Selection is a real phase of an operation and billing data is the selection tool.',
        detect:
          'Query auditing for selection-shaped queries: filters on value and geography rather than a single ' +
          'account lookup, which is what support actually does.',
        evidence:
          'A query returning subscribers on the highest tariff in three affluent postcodes, exported by a ' +
          'support account that normally opens one record at a time.',
        contain:
          'Bulk query rights are removed from support roles, exports are logged and reviewed, and the account ' +
          'is investigated for insider involvement rather than assumed compromised.',
      },
    },
    {
      id: 'ss7',
      label: 'Signalling gateway',
      note: 'SIG01, 10.100.8.50. Interconnect signalling with other operators.',
      technique: 'T1040 Network Sniffing',
      flavour: {
        compromise:
          'Interconnect signalling was designed when every operator was a trusted state monopoly, and it still ' +
          'largely assumes that. Access to it allows message interception and location tracking without ' +
          'touching the subscriber or their device at all.',
        detect:
          'Signalling firewall alerting on messages from interconnect partners requesting subscriber location ' +
          'or routing information outside a roaming context.',
        evidence:
          'Location requests for eleven specific subscribers from a partner network none of them are roaming ' +
          'on, over six hours.',
        contain:
          'The partner interconnect is filtered, category-restricted signalling is enforced at the gateway, ' +
          'the affected subscribers are notified, and the regulator and partner operator are engaged.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.100.1.5. Staff identity for corporate and provisioning access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity governs who can reach provisioning, so the directory is one hop from the ' +
          'objective. Replication rights let you take every hash without executing anything on the controller.',
        detect:
          'Event 4662 with the DS-Replication-Get-Changes-All GUID from a principal that is not a domain ' +
          'controller.',
        evidence:
          'Directory replication requested by a contact centre workstation account at 03:05.',
        contain:
          'The account is disabled, krbtgt reset twice, replication rights audited, and provisioning access ' +
          'separated onto its own identity plane so a corporate compromise does not reach it.',
      },
    },
    {
      id: 'hss',
      label: 'Subscriber database',
      note: 'HSS01, 10.100.8.10. Every subscriber identity and key. The objective.',
      crown: true,
      technique: 'T1552.004 Unsecured Credentials: Private Keys',
      flavour: {
        compromise:
          'The subscriber database holds the authentication keys for every SIM on the network. Reaching it ' +
          'unseen means you no longer swap SIMs one at a time, you can impersonate subscribers wholesale. ' +
          'Every service anywhere that treats a phone number as proof of identity is downstream of this ' +
          'database, which is what makes it a national infrastructure problem rather than a company one.',
        detect:
          'Any bulk read of subscriber key material, which should be a never-event with a hard alert, and ' +
          'privileged access to the core network from outside the operations bastion.',
        evidence:
          'A sequential export of subscriber authentication material at 04:00 from a session that reached the ' +
          'core network through a corporate host rather than the bastion.',
        contain:
          'Core network access is severed from corporate, the export is contained and quantified, the ' +
          'regulator and law enforcement are engaged, and a key rotation programme is planned, which for a ' +
          'subscriber base of this size means physically reissuing SIMs.',
      },
    },
  ],
});
