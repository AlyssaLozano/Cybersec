/**
 * Board scenarios: aggregators and platforms.
 *
 * Four estates whose defining property is CONCENTRATION: each one holds, or
 * stands in front of, something that belongs to a great many other
 * organisations, so the consequence of losing the board lands far outside the
 * company being attacked.
 *
 * The credit bureau is the honeypot problem: aggregating everyone's financial
 * identity in one place makes that place the single richest target in an economy.
 * The claims clearinghouse is the concentration-of-availability problem: its
 * outage stops thousands of unrelated businesses, so the crown's value is that it
 * cannot stop. The identity vendor is the trust-chain problem: compromise the
 * company that proves who everyone is, and you can be anyone at any of its
 * customers. The gaming platform is the account-economy problem: the money is in
 * the accounts and the platform's own currency, not in a database of secrets.
 *
 * Same standard as the rest: every system names its ATT&CK technique, and the
 * four outcome lines carry the method, the detection logic, the artefact and the
 * containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * A credit bureau, and the honeypot problem.
 *
 * The lesson is aggregation risk: none of the individual records is special, but
 * holding all of them in one place makes this the single most valuable data
 * target in a national economy, and an unpatched public application is how it has
 * actually been reached. Blue is defending something whose value comes entirely
 * from concentration.
 */
export const BUREAU_CASTELLAN = definePositional({
  id: 'bd-bureau-castellan',
  title: 'Full File: Castellan Credit',
  brief:
    'Seven systems, two defences, ten rounds. Red wants the consumer file: the financial identity ' +
    'of an entire country in one place. No single record is special; the concentration is what makes ' +
    'this the richest target on any board, and an unpatched public app is the usual way in.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['bureau', 'consumer', 'aggregate', 'concentration', 'identity', 'record', 'breach', 'patch'],
  dossier: {
    org: 'Castellan Credit Bureau',
    summary:
      'A national credit reference agency holding financial histories on tens of millions of people. ' +
      'A public web portal for consumers and businesses fronts an internal estate that aggregates ' +
      'data from thousands of sources. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Consumer file store, 10.111.7.10 (crown)' },
      { k: 'Internal network', v: '10.111.7.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Scale', v: 'Financial records on tens of millions of people' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'portal',
      label: 'Consumer web portal',
      note: 'my.castellan.example, 198.51.100.30. Public Java application, a framework two versions behind.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'A known remote-code-execution flaw in the web framework, unpatched because the change window kept ' +
          'slipping. This is not a subtle attack; it is the exact shape of the largest bureau breach on record, ' +
          'and the lesson is that a single missed patch on an internet-facing app can expose a whole nation.',
        detect:
          'A web application process spawning a shell, which is the highest-value detection on any public host, ' +
          'and egress from the web tier to anywhere that is not its database.',
        evidence:
          'The application server process spawning a command interpreter, with a request in the logs matching ' +
          'the published exploit for the framework version in use.',
        contain:
          'The application is taken offline and patched, the host rebuilt, and, because the crown jewel is one ' +
          'hop away, the estate is treated as compromised until proven otherwise rather than the reverse.',
      },
    },
    {
      id: 'jump',
      label: 'Internal jump host',
      note: 'JMP01, 10.111.7.60. The web tier’s route into the internal network.',
      technique: 'T1021.001 Remote Services: Remote Desktop Protocol',
      flavour: {
        compromise:
          'The web tier should never reach the internal network directly, and here it does, through a jump host ' +
          'left permissively configured. From it the internal estate opens up, which is why the segmentation ' +
          'between a public app and the crown data matters more than any single control.',
        detect:
          'RDP or administrative logons from the web tier into the internal network, which no legitimate flow ' +
          'produces.',
        evidence:
          'An administrative session from the web application host to the internal jump host, then onward into ' +
          'the data network.',
        contain:
          'The path from web tier to internal is cut to nothing, the jump host rebuilt, and the segmentation ' +
          'between the public application and the internal estate enforced and tested.',
      },
    },
    {
      id: 'staging',
      label: 'Data ingestion staging',
      note: 'STG01, 10.111.7.30. Where feeds from thousands of sources land before processing.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The ingestion staging area holds recent feeds from every data source, in a less controlled form than ' +
          'the main file. It is a rich target in its own right and a map of who supplies the bureau, which is ' +
          'reconnaissance for a supply-side attack.',
        detect:
          'Access to the staging store by any account outside the ingestion service role, and bulk reads of ' +
          'recent feeds.',
        evidence:
          'A sweep of recent source feeds by an interactive account, where only the ingestion service should ' +
          'ever read them.',
        contain:
          'Staging access is scoped to the service role, feeds are encrypted at rest, and the account audited ' +
          'against its purpose.',
      },
    },
    {
      id: 'analytics',
      label: 'Analytics environment',
      note: 'ANL01, 10.111.7.40. Scoring models and a copy of much of the file for analysis.',
      technique: 'T1552.001 Unsecured Credentials: Credentials In Files',
      flavour: {
        compromise:
          'Analytics teams optimise for iteration, so a copy of much of the consumer file lives here alongside ' +
          'credentials left in notebooks and scripts. It is often the easiest route to the data because it is ' +
          'the least controlled copy of it.',
        detect:
          'Secret scanning across the analytics repositories and shares, and database authentications whose ' +
          'client string is a notebook kernel rather than an application.',
        evidence:
          'A notebook containing a database credential in plain text, and that credential authenticating from ' +
          'hosts that are not analytics hosts.',
        contain:
          'The credential is rotated, secret scanning added to the pipeline, the analytics data copy minimised ' +
          'and access-controlled, and short-lived credentials adopted.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.111.7.5. Internal identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Domain admin puts every internal system, including the file store, within reach. DCSync takes the ' +
          'hashes without running code on the controller.',
        detect:
          'Event 4662 with the replication GUID from a principal that is not a domain controller.',
        evidence:
          'Directory replication requested from the internal jump host at 02:30.',
        contain:
          'The account is disabled, krbtgt reset twice, and replication rights audited across the domain.',
      },
    },
    {
      id: 'egress',
      label: 'Outbound proxy',
      note: 'PRX01, 10.111.7.50. Controls what leaves the internal network.',
      technique: 'T1030 Data Transfer Size Limits',
      flavour: {
        compromise:
          'Moving tens of millions of records out without tripping a volume alarm means metering the transfer ' +
          'in chunks below the threshold, over days, through the proxy that is supposed to be watching. The ' +
          'exfiltration is the slow, patient counterpart to the loud way in.',
        detect:
          'Cumulative egress analysis per host over long windows rather than per-day thresholds, and alerting ' +
          'on sustained transfers to any single external destination.',
        evidence:
          'A steady flow to one external endpoint, each transfer under the daily alarm, summing to the bulk of ' +
          'the file over a week.',
        contain:
          'The destination is blocked, egress limits lowered, the cumulative transfer quantified, and the ' +
          'regulator notified given the scale of exposure.',
      },
    },
    {
      id: 'file',
      label: 'Consumer file store',
      note: 'FILE01, 10.111.7.10. The financial identity of tens of millions of people. The objective.',
      crown: true,
      technique: 'T1530 Data from Cloud Storage',
      flavour: {
        compromise:
          'The consumer file, reached unseen. Every record is ordinary; all of them together are the most ' +
          'consequential personal-data loss an economy can suffer, because a credit identity cannot be reset ' +
          'the way a password can. The harm lands on tens of millions of people who never chose to be in this ' +
          'database, which is the defining feature of aggregation risk.',
        detect:
          'Query and access auditing on the file store with alerting on any bulk read, which for the crown ' +
          'should be a rare, closely reviewed event, and egress correlation with the proxy.',
        evidence:
          'A sequential read of the consumer file by a session that reached the store through the web tier and ' +
          'the jump host, staged for slow exfiltration.',
        contain:
          'The store is isolated, credentials rotated, the exposure quantified for regulators and affected ' +
          'consumers, and identity-protection measures stood up at national scale, because the alternative to ' +
          'a reset does not exist.',
      },
    },
  ],
});

/**
 * A health claims clearinghouse, and the concentration-of-availability problem.
 *
 * Modelled on the shape of the Change Healthcare event: a single intermediary
 * that so many providers and pharmacies depend on that its outage stops care
 * across a whole country. The crown's value is not its data but its
 * availability, and the lesson is that becoming a single point of failure for an
 * industry is itself a security exposure.
 */
export const CLEARING_HALCYON = definePositional({
  id: 'bd-clearing-halcyon',
  title: 'Single Point: Halcyon Clearing',
  brief:
    'Seven systems, two defences, ten rounds. Halcyon sits between thousands of providers, ' +
    'pharmacies and insurers, clearing their transactions. Red wants to take it down. The lesson is ' +
    'that being the thing everyone depends on is itself the exposure: this outage stops care far ' +
    'beyond Halcyon.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['clearinghouse', 'availability', 'dependency', 'concentration', 'outage', 'transaction', 'ransom', 'restore'],
  dossier: {
    org: 'Halcyon Clearing',
    summary:
      'A health transaction clearinghouse processing eligibility, claims and pharmacy transactions ' +
      'for thousands of providers and insurers. When it is down, pharmacies cannot confirm coverage ' +
      'and providers cannot bill, nationwide. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Transaction switch, 10.112.8.10 (crown)' },
      { k: 'Processing network', v: '10.112.8.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Dependency', v: 'Thousands of providers, pharmacies and insurers' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'remote',
      label: 'Remote access',
      note: 'remote.halcyon.example, 203.0.113.40. A remote gateway without enforced MFA.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'A remote access gateway where multi-factor was configured but not enforced for every account, and a ' +
          'stolen credential walks straight in. This is the documented entry point for the real event, and the ' +
          'lesson that "we have MFA" and "MFA is enforced everywhere" are very different statements.',
        detect:
          'Any successful remote authentication without a matching MFA challenge, which should be impossible and ' +
          'therefore is a clean alert.',
        evidence:
          'A remote session established with a password and no second factor, for an account whose owner did ' +
          'not travel.',
        contain:
          'The account is disabled, MFA enforcement audited and closed across every gateway and account, and ' +
          'the session reviewed for what it reached.',
      },
    },
    {
      id: 'workstations',
      label: 'Operations workstations',
      note: 'Processing operations staff endpoints, 10.112.8.0/24.',
      technique: 'T1003.001 OS Credential Dumping: LSASS Memory',
      flavour: {
        compromise:
          'From an operations endpoint you harvest cached credentials and begin to move toward the processing ' +
          'core. The operations network is where the people who run the switch work, and their credentials ' +
          'reach it.',
        detect:
          'Process access to LSASS from an unexpected binary on the operations subnet, and lateral ' +
          'authentication from an operations host to processing infrastructure.',
        evidence:
          'A handle opened to LSASS by a tool in a user directory, under an operations account, followed by ' +
          'movement toward the switch network.',
        contain:
          'The host is isolated, cached credentials reset, Credential Guard enabled, and the operations subnet ' +
          'separated from the processing core.',
      },
    },
    {
      id: 'eligibility',
      label: 'Eligibility service',
      note: 'ELIG01, 10.112.8.30. Confirms patient coverage in real time.',
      technique: 'T1499 Endpoint Denial of Service',
      flavour: {
        compromise:
          'Eligibility checks are what a pharmacy runs before dispensing. Degrading this service alone means ' +
          'prescriptions cannot be confirmed, which is a patient-care impact well short of touching the main ' +
          'switch, and an easier target.',
        detect:
          'Availability and latency monitoring on the eligibility service, with thresholds set by clinical ' +
          'impact rather than infrastructure health.',
        evidence:
          'Eligibility response times climbing under crafted load from an internal host, with pharmacies ' +
          'reporting timeouts.',
        contain:
          'The service is failed over, the source host isolated, and providers given the manual fallback ' +
          'process while it recovers.',
      },
    },
    {
      id: 'backup',
      label: 'Backup infrastructure',
      note: 'BKP01, 10.112.8.60. Domain-joined and online.',
      technique: 'T1490 Inhibit System Recovery',
      flavour: {
        compromise:
          'Domain-joined backups fail with the domain, and for a clearinghouse the difference between a day of ' +
          'outage and a month is entirely whether recovery survives. Neutralising it is the quiet move that ' +
          'turns disruption into a crisis measured in weeks of missed care.',
        detect:
          'Backup console audit for logins from outside the administrative subnet, and any job disabled outside ' +
          'the change process.',
        evidence:
          'Backup jobs disabled and retention shortened by a session using a domain administrator credential.',
        contain:
          'Jobs restored, immutable retention enabled, and the backup estate taken off the domain onto separate ' +
          'credentials.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.112.8.5. Identity for the processing estate.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Domain admin over the processing estate puts the switch and the backups both within reach. DCSync ' +
          'takes the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an operations workstation at 02:50.',
        contain:
          'The account is disabled, krbtgt reset twice, and replication rights audited across the domain.',
      },
    },
    {
      id: 'data',
      label: 'Transaction data store',
      note: 'DATA01, 10.112.8.40. Claims and patient data in transit through the switch.',
      technique: 'T1074.002 Data Staged: Remote Data Staging',
      flavour: {
        compromise:
          'The clearinghouse sees the health and payment data of the whole industry passing through it. Staging ' +
          'and stealing it enables a double-extortion threat on top of the outage, and the data belongs to ' +
          'people who have never heard of Halcyon.',
        detect:
          'Bulk access to the transaction store and large outbound transfers from a network whose egress ' +
          'profile is normally small and predictable.',
        evidence:
          'A multi-part archive of transaction data assembled and transferred to an external host over one ' +
          'night.',
        contain:
          'The staging host is isolated, the archive preserved, egress reviewed for what left, and the exposure ' +
          'assessed for breach notification across every affected organisation.',
      },
    },
    {
      id: 'switch',
      label: 'Transaction switch',
      note: 'SW01, 10.112.8.10. Clears every transaction that passes through Halcyon. The objective.',
      crown: true,
      technique: 'T1486 Data Encrypted for Impact',
      flavour: {
        compromise:
          'You reach the switch unseen and encrypt it. Halcyon stops, and because thousands of pharmacies and ' +
          'providers route through it, they stop too: prescriptions go unfilled and providers go unpaid across ' +
          'a whole country. The crown’s value is not its data, it is that so many organisations cannot function ' +
          'without it, which is exactly the exposure that comes from being critical infrastructure nobody ' +
          'planned to become.',
        detect:
          'File telemetry for high-entropy writes across the switch data volume, and availability monitoring ' +
          'that treats the switch as the single point of failure it is, with a tested manual and alternate-route ' +
          'plan.',
        evidence:
          'The switch database encrypted and a ransom note, with downstream providers reporting simultaneous ' +
          'transaction failures nationwide.',
        contain:
          'The switch is recovered from offline backups, the industry is moved to alternate clearing routes ' +
          'and manual processes during recovery, and the incident is treated as a sector-wide event with ' +
          'regulators and downstream organisations engaged. The strategic lesson recorded afterward is that ' +
          'concentration itself was the risk.',
      },
    },
  ],
});

/**
 * An identity provider vendor, and the trust-chain problem.
 *
 * Modelled on the shape of the identity-vendor compromises of recent years: the
 * attacker does not break the customers, it breaks the company that proves who
 * the customers' users are, usually through the support tooling rather than the
 * product. The crown is the ability to impersonate at the customer, and the
 * lesson is that a vendor of trust carries a duty far beyond its own risk.
 */
export const IDENTITY_SENTINEL = definePositional({
  id: 'bd-identity-sentinel',
  title: 'Trust Anchor: Sentinel Identity',
  brief:
    'Seven systems, two defences, ten rounds. Sentinel proves who everyone is for thousands of ' +
    'customer companies. Red is not after Sentinel’s own data; it is after the ability to be ' +
    'anyone, at any customer. Note that the way in is usually the support tooling, not the product.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['identity', 'impersonate', 'support', 'downstream', 'customer', 'session', 'trust', 'federation'],
  dossier: {
    org: 'Sentinel Identity',
    summary:
      'An identity and single-sign-on provider serving thousands of customer organisations. Its own ' +
      'staff, and its outsourced support contractor, hold tooling that can act within customer ' +
      'tenants. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Customer impersonation tooling, 10.113.9.10 (crown)' },
      { k: 'Internal network', v: '10.113.9.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Downstream', v: 'Thousands of customer tenants' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'contractor',
      label: 'Support contractor',
      note: 'Outsourced first-line support, with tooling access into customer tenants.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'The support contractor is the weakest identity with the strongest reach: high turnover, shared ' +
          'environments, and access to tooling that can act inside customer tenants. This is the exact path of ' +
          'the real identity-vendor breaches, and it is why a vendor’s security is only as good as its ' +
          'outsourced support.',
        detect:
          'Behavioural analytics on contractor accounts, and any support action against a customer tenant ' +
          'without an associated support ticket.',
        evidence:
          'A contractor account performing tenant actions with no matching ticket, from a device that is not ' +
          'the managed support environment.',
        contain:
          'The account is suspended, contractor access moved behind managed devices and just-in-time ' +
          'provisioning, and every recent support action reviewed against tickets.',
      },
    },
    {
      id: 'staff',
      label: 'Sentinel staff endpoints',
      note: 'Engineer and support laptops, 10.113.9.0/24.',
      technique: 'T1539 Steal Web Session Cookie',
      flavour: {
        compromise:
          'Stealing a session cookie from an engineer’s browser gives you their authenticated access to ' +
          'internal tools without a password or a prompt, because the session already represents a completed ' +
          'login. Session theft is the technique that repeatedly defeats multi-factor at identity companies.',
        detect:
          'Internal tool sessions used from an IP or device that does not match where the session was issued, ' +
          'and session lifetimes long enough to be worth stealing.',
        evidence:
          'An internal admin session reused from an unfamiliar address, with no fresh authentication event ' +
          'behind it.',
        contain:
          'Sessions are revoked, lifetimes shortened, session binding to device enforced, and internal tools ' +
          'moved behind phishing-resistant authentication.',
      },
    },
    {
      id: 'supporttool',
      label: 'Support administration tool',
      note: 'SUP01, 10.113.9.30. Lets support act within customer tenants to resolve tickets.',
      technique: 'T1548 Abuse Elevation Control Mechanism',
      flavour: {
        compromise:
          'The support tool exists so support can help customers, which means it can act inside customer ' +
          'tenants by design. Abusing it lets you reset factors and initiate sessions in customer environments ' +
          'without ever touching the customers directly. The capability is legitimate; the caller is not.',
        detect:
          'Auditing of every support action against customer tenants, with alerting on factor resets and ' +
          'session initiations, and reconciliation against tickets.',
        evidence:
          'A run of multi-factor resets across several unrelated customer tenants in a short window, none tied ' +
          'to a support ticket.',
        contain:
          'The tool’s access is suspended, all recent privileged actions across customers reviewed, and ' +
          'customer-affecting actions gated behind approval with mandatory ticket linkage.',
      },
    },
    {
      id: 'vault',
      label: 'Secrets vault',
      note: 'VLT01, 10.113.9.40. Signing keys and service credentials.',
      technique: 'T1555.006 Credentials from Password Stores: Cloud Secrets Management',
      flavour: {
        compromise:
          'The vault holds the signing keys and service credentials that underpin the platform. One ' +
          'over-permissive role reads them all, and for an identity provider a signing key is the ability to ' +
          'mint trust rather than merely use it.',
        detect:
          'Per-secret access logging with alerting on breadth: any principal reading far more secrets than its ' +
          'history, and any access to signing key material at all.',
        evidence:
          'A role reading dozens of secrets including a token-signing key in minutes, against a history of a ' +
          'handful on deployment.',
        contain:
          'Every secret the role could read is rotated, signing keys re-issued, and vault policies narrowed ' +
          'from wildcards to named resources.',
      },
    },
    {
      id: 'ad',
      label: 'Internal identity',
      note: 'DC01, 10.113.9.5. Sentinel’s own staff identity.',
      technique: 'T1556.007 Modify Authentication Process: Hybrid Identity',
      flavour: {
        compromise:
          'Administrative control of Sentinel’s own identity lets you grant yourself durable access and, ' +
          'painfully for an identity company, undermines the very thing it sells. It is the internal ' +
          'counterpart of the trust it provides to customers.',
        detect:
          'Alerting on federation and authentication configuration changes, new credentials on service ' +
          'principals, and privileged role assignments.',
        evidence:
          'A new authentication method or federated domain added internally at 02:00, followed by privileged ' +
          'sign-ins with no interactive logon.',
        contain:
          'The change is reverted, all sessions revoked internally, privileged assignments audited, and admin ' +
          'access moved behind just-in-time elevation with approval.',
      },
    },
    {
      id: 'logging',
      label: 'Audit and monitoring',
      note: 'LOG01, 10.113.9.50. The record of who did what, internally and in customer tenants.',
      technique: 'T1562.008 Impair Defenses: Disable or Modify Cloud Logs',
      flavour: {
        compromise:
          'The audit trail is what lets Sentinel, and its customers, reconstruct an incident. Filtering your ' +
          'own actions out of it makes the impersonation invisible to everyone downstream, which is what turns ' +
          'a contained incident into a silent, months-long one.',
        detect:
          'Alerting on any change to logging configuration, delivered to a separate account the compromised ' +
          'principals cannot reach, so the log lives outside the blast radius.',
        evidence:
          'An audit pipeline modified to exclude a set of principals, and a corresponding gap in delivery to ' +
          'the archive account.',
        contain:
          'Logging is restored from the separate account, the gap reconstructed, log configuration protected ' +
          'by a policy no internal role can override, and customers given the data to audit their own tenants.',
      },
    },
    {
      id: 'impersonation',
      label: 'Customer impersonation tooling',
      note: 'IMP01, 10.113.9.10. Can act as any user in any customer tenant. The objective.',
      crown: true,
      technique: 'T1606.002 Forge Web Credentials: SAML Tokens',
      flavour: {
        compromise:
          'You hold the tooling and keys to mint valid assertions for any user in any customer tenant, unseen. ' +
          'You are no longer authenticating; you are issuing the answer that thousands of companies trust ' +
          'absolutely. Every one of those companies made a reasonable decision to rely on Sentinel, and none ' +
          'of them can defend against this from their side, which is exactly why an identity vendor carries a ' +
          'duty of care far beyond its own risk appetite.',
        detect:
          'Customer-side detection of assertions with no corresponding authentication at Sentinel, and ' +
          'vendor-side alerting on any use of the impersonation capability outside a ticketed, approved flow.',
        evidence:
          'Assertions issued for privileged users across multiple customer tenants, with issuer instants that ' +
          'match no interactive logon, and no supporting tickets.',
        contain:
          'The tooling is halted, signing keys rotated, every customer notified immediately with the data to ' +
          'revoke sessions and audit their tenant, and the national authority engaged. Recovery is slow because ' +
          'trust itself, across thousands of customers, has to be re-established.',
      },
    },
  ],
});

/**
 * An online gaming and wagering platform, and the account-economy problem.
 *
 * The distinguishing feature is that there is no database of secrets worth
 * stealing in the usual sense: the value is in the player accounts, the platform's
 * own currency, and the integrity of the games. The crown is the wallet and
 * ledger service, and the lesson is that fraud against a platform's own economy
 * is a security problem even though nothing "leaks".
 */
export const WAGER_GOLDCREST = definePositional({
  id: 'bd-wager-goldcrest',
  title: 'House Edge: Goldcrest Gaming',
  brief:
    'Seven systems, two defences, ten rounds. There is no secret database to steal here. The value ' +
    'is in the player accounts, the platform’s own currency and the fairness of the games. Red wants ' +
    'the wallet and ledger service; the fraud is the breach.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['account', 'wallet', 'ledger', 'currency', 'bonus', 'fraud', 'takeover', 'integrity'],
  dossier: {
    org: 'Goldcrest Gaming',
    summary:
      'An online gaming and wagering platform with millions of player accounts, an in-platform ' +
      'currency and wallet, and a bonus and rewards engine. Regulated, and a constant target for ' +
      'account takeover and economy fraud. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Wallet and ledger service, 10.114.2.10 (crown)' },
      { k: 'Platform network', v: '10.114.2.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Value', v: 'Player accounts and the in-platform economy' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'login',
      label: 'Player login',
      note: 'play.goldcrest.example, 203.0.113.60. Millions of consumer accounts, password reuse rife.',
      technique: 'T1110.004 Brute Force: Credential Stuffing',
      flavour: {
        compromise:
          'Credential stuffing against millions of consumer accounts whose owners reused passwords from ' +
          'elsewhere. A small success rate against a huge base is still thousands of accounts, each with a ' +
          'wallet balance and stored payment details. Account takeover is the bread and butter of platform ' +
          'fraud.',
        detect:
          'Distributed login failures across many accounts from a rotating address pool with a low success ' +
          'rate, and logins from devices with no history for the account.',
        evidence:
          'Two hundred thousand login attempts across a hundred thousand accounts over three hours, from a ' +
          'residential proxy pool, with a few thousand successes.',
        contain:
          'Compromised accounts are locked and forced through re-verification, credential-stuffing protection ' +
          'and device fingerprinting added at the edge, and step-up authentication required for withdrawals.',
      },
    },
    {
      id: 'support',
      label: 'Player support tools',
      note: 'SUP01, 10.114.2.30. Agents can adjust balances and reset accounts.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'Support agents can adjust balances and take over accounts to help players, which makes a ' +
          'compromised or complicit agent a direct route to the economy. As with the telecom board, the human ' +
          'control is the technical control.',
        detect:
          'Per-agent analytics on balance adjustments and account actions against a peer baseline, and any ' +
          'adjustment without an associated support case.',
        evidence:
          'One agent making balance credits far above peer median, several with no case reference, to accounts ' +
          'that then withdraw immediately.',
        contain:
          'The agent account is suspended, adjustments reversed, and high-value actions re-gated behind ' +
          'supervisor approval and a delay.',
      },
    },
    {
      id: 'bonus',
      label: 'Bonus and rewards engine',
      note: 'BON01, 10.114.2.40. Issues promotional credit and rewards.',
      technique: 'T1499.003 Endpoint Denial of Service: Application Exhaustion Flood',
      flavour: {
        compromise:
          'The bonus engine mints value under rules, and rules have edges. Abusing a promotion logic flaw to ' +
          'issue rewards in a loop is theft of the platform’s own currency without touching a single player ' +
          'account, and it scales as fast as the engine can run.',
        detect:
          'Invariant monitoring on issued value: bonus issuance rate against historical baseline, and any ' +
          'single account or cohort accruing rewards faster than the rules should allow.',
        evidence:
          'A cluster of accounts each triggering the same promotion thousands of times through an API, ' +
          'accruing credit far beyond any legitimate play pattern.',
        contain:
          'The promotion is disabled, the logic flaw fixed, fraudulently issued credit clawed back before ' +
          'withdrawal where possible, and rate limits added to issuance.',
      },
    },
    {
      id: 'rng',
      label: 'Game engine',
      note: 'RNG01, 10.114.2.50. Runs the games and their random number generation.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The integrity of the games is the platform’s licence to operate. Tampering with the random number ' +
          'generation or the payout tables, even slightly, is both fraud and a regulatory catastrophe, because ' +
          'a game that is not provably fair cannot legally run.',
        detect:
          'Continuous statistical monitoring of game outcomes against expected distributions, and integrity ' +
          'verification of the RNG and payout configuration against a signed baseline.',
        evidence:
          'Payout rates on one game drifting outside the expected band, correlated with a configuration change ' +
          'to the RNG seeding with no approval.',
        contain:
          'The game is taken offline, the RNG and payout tables restored from the signed baseline and ' +
          're-certified, and the regulator notified, because fairness is a licence condition.',
      },
    },
    {
      id: 'payments',
      label: 'Payments and withdrawals',
      note: 'PAY01, 10.114.2.60. Processes deposits and cashouts.',
      technique: 'T1074.001 Data Staged: Local Data Staging',
      flavour: {
        compromise:
          'The withdrawal path is where value leaves the platform for the real world, so it is where fraud is ' +
          'realised. Staging takeover accounts and abused bonuses toward coordinated cashouts is the step that ' +
          'converts platform currency into money.',
        detect:
          'Velocity and pattern monitoring on withdrawals: many accounts cashing out to a small set of ' +
          'destinations, or withdrawals immediately following a balance change.',
        evidence:
          'A cluster of accounts withdrawing to the same handful of payment destinations within an hour of ' +
          'balance credits, from new devices.',
        contain:
          'Withdrawals from the implicated cohort are held for review, destinations flagged, and step-up ' +
          'verification enforced on cashout for accounts with recent balance or device changes.',
      },
    },
    {
      id: 'ad',
      label: 'Platform identity',
      note: 'DC01, 10.114.2.5. Staff and service identity.',
      technique: 'T1558.003 Steal or Forge Kerberos Tickets: Kerberoasting',
      flavour: {
        compromise:
          'Service accounts for the wallet and payment services are old, have service principal names, and ' +
          'weak passwords. Request the tickets and crack them offline for application-level access to the ' +
          'economy without touching the applications.',
        detect:
          'Event 4769 for RC4-encrypted service ticket requests in volume from one principal.',
        evidence:
          'Forty RC4 service ticket requests in ninety seconds from one account, covering the wallet and ' +
          'payment service principals.',
        contain:
          'Service account passwords rotated to long random values, group managed service accounts adopted, ' +
          'RC4 disabled, and unnecessary service principal names removed.',
      },
    },
    {
      id: 'wallet',
      label: 'Wallet and ledger service',
      note: 'WAL01, 10.114.2.10. Holds every account balance and the platform ledger. The objective.',
      crown: true,
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Write access to the wallet and ledger unseen means you can credit balances and rewrite the record of ' +
          'the platform’s own economy. Nothing “leaks” in the traditional sense, and yet the platform can no ' +
          'longer prove what it owes to whom, which is an integrity failure worse than a data breach for a ' +
          'regulated operator. The lesson is that fraud against a platform’s own economy is a security ' +
          'incident, not merely a finance one.',
        detect:
          'Ledger integrity monitoring: continuous reconciliation of balances against the transaction log, and ' +
          'alerting on any balance change with no corresponding transaction.',
        evidence:
          'Balances credited across a set of accounts with no matching transactions in the ledger, by a session ' +
          'using a service credential, followed by rapid withdrawals.',
        contain:
          'The ledger is reconciled against the transaction log and restored, direct write access revoked for ' +
          'application credentials, withdrawals held during reconciliation, and the regulator notified because ' +
          'the integrity of the economy is a licence condition.',
      },
    },
  ],
});
