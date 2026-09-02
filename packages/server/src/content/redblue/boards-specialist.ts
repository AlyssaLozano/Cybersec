/**
 * Board scenarios: specialist and high-consequence estates.
 *
 * Five boards that each exist to teach one thing the other sixteen cannot.
 *
 * The exchange board is about irreversibility: there is no chargeback, so the
 * usual "detect and recover" posture has no recovery half. The automotive board
 * is about a product that drives away and keeps receiving updates, so the
 * customer is a moving target the manufacturer cannot patch by hand. The port
 * board is about collateral damage, because the most expensive cyber incident on
 * record was aimed at somebody else entirely. The defence board is about
 * classification and dwell time. And the managed service provider board is the
 * one that matters most for anyone entering the industry, because it is the
 * business model most of them will work inside: one console, hundreds of
 * customers, and a blast radius that belongs to other companies.
 *
 * Same standard: every system names its ATT&CK technique, and the four outcome
 * lines carry the method, the detection logic, the artefact and the containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * A cryptocurrency exchange, where the loss is final.
 *
 * Every other board assumes some recovery is possible: restore the backup,
 * recall the payment, revoke the certificate. Here a signed transaction is
 * settled and irreversible, which pushes the entire security budget toward
 * prevention and detection-before-signature. Blue that plans to "respond" has
 * already lost.
 */
export const VAULT_MERIDIANEX = definePositional({
  id: 'bd-vault-meridianex',
  title: 'Final Settlement: MeridianEx',
  brief:
    'Six systems, two defences, nine rounds. Red wants the hot wallet signing key. There is no ' +
    'chargeback, no recall and no restore: once a transaction is signed and broadcast it is final. ' +
    'Everything Blue does has to happen before the signature, not after.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['wallet', 'key', 'signature', 'custody', 'irreversible', 'withdrawal', 'quorum', 'cold'],
  dossier: {
    org: 'MeridianEx Digital Assets',
    summary:
      'A digital asset exchange holding customer funds in a hot wallet for liquidity and a cold ' +
      'wallet for the bulk. Around 250 staff, heavily remote, and a target for the best-resourced ' +
      'criminal groups in the world. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Hot wallet signing service, 10.170.4.10 (crown)' },
      { k: 'Signing segment', v: '10.170.4.0/24' },
      { k: 'Corporate', v: '10.170.1.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'developer',
      label: 'Developer endpoints',
      note: 'Remote engineers, personal networks, high privilege to the platform.',
      technique: 'T1204.002 User Execution: Malicious File',
      flavour: {
        compromise:
          'A recruiter approach on a professional network, a long friendly conversation, and eventually a ' +
          '"coding challenge" archive. The engineer runs it because running unfamiliar code is literally their ' +
          'job. This exact pattern is the documented tradecraft of the groups that target exchanges, and it ' +
          'defeats technical controls by going around them.',
        detect:
          'EDR on developer endpoints looking for a build or interpreter process making outbound connections ' +
          'to newly registered infrastructure, and for execution from archive extraction paths.',
        evidence:
          'A node process spawned from a downloads directory at 21:40, connecting to a domain registered nine ' +
          'days earlier, on the laptop of an engineer with wallet service commit rights.',
        contain:
          'The endpoint is isolated, every credential and token on it treated as lost, commit history reviewed ' +
          'for changes authored from that device, and developer machines separated from signing infrastructure ' +
          'entirely.',
      },
    },
    {
      id: 'api',
      label: 'Trading API',
      note: 'api.meridianex.example, 198.51.100.100. Customer trading and withdrawal requests.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'A race condition in the withdrawal path lets a balance check and a debit interleave, so a balance ' +
          'can be spent more than once. Business logic flaws like this are invisible to scanners because every ' +
          'individual request is perfectly valid.',
        detect:
          'Invariant checking rather than signature matching: total liabilities must reconcile against total ' +
          'holdings continuously, and any divergence is an alert regardless of cause.',
        evidence:
          'Forty concurrent withdrawal requests for one account within 200 milliseconds, and a ledger ' +
          'reconciliation that no longer balances.',
        contain:
          'Withdrawals are paused globally, which is commercially painful and correct, the race is fixed with ' +
          'a proper lock, and the ledger is reconciled before trading resumes.',
      },
    },
    {
      id: 'treasury',
      label: 'Treasury operations',
      note: 'Staff who move funds between hot and cold storage on a schedule.',
      technique: 'T1656 Impersonation',
      flavour: {
        compromise:
          'Treasury movements are authorised by people, and people can be impersonated. A convincing message ' +
          'from a compromised executive account, arriving at the right point in the daily cycle, gets a ' +
          'movement approved that should not have been.',
        detect:
          'Out-of-band verification as policy: any movement instruction is confirmed on a different channel, ' +
          'and any instruction that arrives outside the scheduled cycle is treated as suspicious by default.',
        evidence:
          'A movement instruction sent from an executive account at 17:55 on a Friday, outside the schedule, ' +
          'with urgency language and a request not to discuss it in the group channel.',
        contain:
          'The movement is halted, the executive account sessions revoked, and quorum approval enforced ' +
          'technically so no single person can authorise a transfer at all.',
      },
    },
    {
      id: 'monitoring',
      label: 'Blockchain monitoring',
      note: 'MON01, 10.170.1.50. Watches on-chain activity and flags anomalies.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'The monitoring system is what turns an irreversible theft into a fast public response. Suppressing ' +
          'its alerts buys the hours needed to move funds through mixers and across chains, after which ' +
          'recovery becomes a law enforcement fantasy rather than a plan.',
        detect:
          'Heartbeat monitoring of the monitor: an alerting pipeline that goes quiet should itself raise an ' +
          'alarm from an independent system. Silence is not the same as safety.',
        evidence:
          'Alert rules for large withdrawals modified to a threshold above the exchange own maximum, and the ' +
          'daily digest arriving empty for the first time in two years.',
        contain:
          'Rules are restored from configuration control, an independent monitoring path is stood up outside ' +
          'the tenant, and on-chain analytics partners and exchanges are notified so addresses can be flagged ' +
          'while funds are still moving.',
      },
    },
    {
      id: 'coldwallet',
      label: 'Cold storage',
      note: 'Offline, air-gapped, multi-signature. Holds the bulk of customer funds.',
      technique: 'T1200 Hardware Additions',
      flavour: {
        compromise:
          'Cold storage is genuinely hard to attack remotely, which is the point of it. The realistic path is ' +
          'the ceremony: the moment the offline keys are used, on hardware that has to touch something. ' +
          'Compromising the machine used to prepare unsigned transactions means the signers approve something ' +
          'other than what they believe they are approving.',
        detect:
          'Verification of transaction details on a separate trusted display before signing, and dedicated ' +
          'signing hardware that never leaves a safe. The control is procedural and physical, not technical.',
        evidence:
          'A prepared transaction whose destination address differs from the one on the approval form, caught ' +
          'because the ceremony requires two people to read the address aloud.',
        contain:
          'The ceremony is halted, the preparation machine is preserved and replaced, keys are rotated to new ' +
          'addresses through a fresh ceremony, and the address verification step is moved onto dedicated ' +
          'hardware with its own screen.',
      },
    },
    {
      id: 'signing',
      label: 'Hot wallet signing service',
      note: 'SIGN01, 10.170.4.10. Signs outbound transactions automatically. The objective.',
      crown: true,
      technique: 'T1552.004 Unsecured Credentials: Private Keys',
      flavour: {
        compromise:
          'The hot wallet signing service must sign automatically to serve withdrawals, which means the key ' +
          'material is reachable by a running process by definition. Reaching it unseen means you drain the ' +
          'hot wallet in a single block, and there is no mechanism anywhere that can reverse it. This is the ' +
          'clearest example in the catalogue of why prevention and detection are not interchangeable with ' +
          'response.',
        detect:
          'Policy enforcement at the signer rather than around it: per-transaction and per-hour value limits, ' +
          'destination allowlisting, and quorum for anything above a threshold, all enforced by the hardware ' +
          'security module so a compromised host cannot exceed them.',
        evidence:
          'Signing requests for the full hot wallet balance to a previously unseen destination, at a rate no ' +
          'legitimate withdrawal queue produces.',
        contain:
          'Signing is stopped and the hot wallet keys are rotated to new addresses funded from cold storage. ' +
          'The stolen funds are gone permanently; exchanges and analytics providers are notified so the ' +
          'destination can be flagged, and the loss is a solvency question for the board.',
      },
    },
  ],
});

/**
 * A car manufacturer, where the product leaves the building and stays connected.
 *
 * The crown is the over-the-air update service, and the reason is the same one
 * that makes the software supplier board matter: compromising it does not harm
 * the factory, it harms two million vehicles on public roads. Regulation now
 * requires manufacturers to hold a cyber security management system for exactly
 * this reason, which is worth knowing in an interview for any automotive role.
 */
export const FLEET_ARDEN = definePositional({
  id: 'bd-fleet-arden',
  title: 'Over the Air: Arden Motors',
  brief:
    'Seven systems, two defences, ten rounds. The production line is the obvious target and it is ' +
    'not the objective. Red wants the over-the-air update service, because it reaches two million ' +
    'vehicles that are already on the road and cannot be recalled to a workshop.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['vehicle', 'fleet', 'update', 'ota', 'ecu', 'telematics', 'recall', 'safety', 'production'],
  dossier: {
    org: 'Arden Motors',
    summary:
      'A vehicle manufacturer with two million connected cars in service. Vehicles receive software ' +
      'over the air, which is a warranty saving and a safety mechanism and an attack surface. ' +
      'Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'OTA update service, 10.180.6.10 (crown)' },
      { k: 'Connected services', v: '10.180.6.0/24' },
      { k: 'Plant network', v: '172.23.7.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'supplier',
      label: 'Tier one supplier link',
      note: 'Direct network connection to a component supplier for design and logistics.',
      technique: 'T1199 Trusted Relationship',
      flavour: {
        compromise:
          'Automotive supply chains are deeply integrated, with direct network links for just-in-time ' +
          'logistics. The supplier has a fraction of the manufacturer security budget and the same access, ' +
          'which makes it the cheapest way in.',
        detect:
          'Monitoring the supplier interconnect for any traffic outside the documented logistics and design ' +
          'protocols, which are few and stable.',
        evidence:
          'SMB traffic from the supplier link toward the plant network, where only the logistics message queue ' +
          'is documented.',
        contain:
          'The interconnect is restricted to its documented protocols and endpoints, the supplier is notified ' +
          'to investigate, and future contracts carry security requirements with audit rights.',
      },
    },
    {
      id: 'plant',
      label: 'Production line',
      note: 'PLANT01, 172.23.7.20. Robotic assembly. Downtime costs a five-figure sum per minute.',
      technique: 'T1486 Data Encrypted for Impact',
      flavour: {
        compromise:
          'Stopping the line is loud, immediate and enormously expensive, which makes it the obvious extortion ' +
          'play. It is also a distraction from the more valuable objective, and a manufacturer whose entire ' +
          'response team is standing in the plant is not watching the connected services estate.',
        detect:
          'Anomalous encryption behaviour on the manufacturing hosts, and network monitoring for lateral ' +
          'movement across the plant segment.',
        evidence:
          'High-entropy writes across four manufacturing execution hosts within a minute, and a ransom note ' +
          'written to every share.',
        contain:
          'The plant segment is isolated and the line stopped safely rather than abruptly, which itself takes ' +
          'planning. Recovery runs from offline backups, and the incident commander explicitly keeps a team on ' +
          'the connected services estate.',
      },
    },
    {
      id: 'telematics',
      label: 'Telematics backend',
      note: 'TEL01, 10.180.6.30. Receives data from every vehicle in service.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The telematics backend knows where every vehicle is and has been. That is a surveillance capability ' +
          'over two million people, and it is worth more to some buyers than any amount of intellectual ' +
          'property.',
        detect:
          'Query auditing on location data with alerting on any query shaped for tracking, meaning repeated ' +
          'lookups of a small set of vehicle identifiers over time.',
        evidence:
          'Location history queried for the same nine vehicle identifiers every hour for six days, by a ' +
          'service account used by an analytics job that has no per-vehicle logic.',
        contain:
          'Location access is restricted and made subject to purpose logging, the queried owners are assessed ' +
          'for personal risk, and the data protection regulator is notified.',
      },
    },
    {
      id: 'devportal',
      label: 'Vehicle software repository',
      note: 'REPO01, 10.180.6.40. ECU firmware source and build artefacts.',
      technique: 'T1195.002 Supply Chain Compromise: Software Supply Chain',
      flavour: {
        compromise:
          'Electronic control unit firmware is where a vehicle behaviour actually lives. Modifying it at source ' +
          'is the step that makes a fleet-wide safety attack possible, and it is far easier than attacking a ' +
          'car directly.',
        detect:
          'Signed commits, reproducible firmware builds, and hash verification between the repository and the ' +
          'signing step.',
        evidence:
          'A firmware build whose hash does not match an independent rebuild, in the braking control module ' +
          'branch, with no corresponding source change.',
        contain:
          'The artefact is quarantined, the build environment rebuilt, reproducible verification added as a ' +
          'release gate, and the safety engineering function informed because this is now a product safety ' +
          'matter as well as a security one.',
      },
    },
    {
      id: 'keys',
      label: 'Vehicle key infrastructure',
      note: 'PKI for vehicle authentication and update signing.',
      technique: 'T1552.004 Unsecured Credentials: Private Keys',
      flavour: {
        compromise:
          'The keys that authenticate vehicles and sign updates. Once these are out, every vehicle in the ' +
          'fleet will accept software signed by whoever holds them, and there is no practical way to replace a ' +
          'key in two million cars that are already on the road.',
        detect:
          'HSM audit logging on every key operation, with alerting on any use outside the release process. ' +
          'These operations are rare enough that individual review is realistic.',
        evidence:
          'Three signing operations outside any release window, and an attempted export of key material that ' +
          'the hardware module refused and logged.',
        contain:
          'Signing is halted, the key hierarchy is assessed for rotation, and the regulator is engaged. ' +
          'Rotation may require a physical recall, which is why this key is protected by hardware that cannot ' +
          'export it at all.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.180.6.5. Staff identity across engineering and connected services.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the connected services estate, so the directory is the usual pivot ' +
          'between the office and the thing that matters.',
        detect:
          'Event 4662 with the DS-Replication-Get-Changes-All GUID from a principal that is not a domain ' +
          'controller.',
        evidence:
          'Directory replication requested from an engineering workstation at 01:50.',
        contain:
          'The account is disabled, krbtgt reset twice, and the connected services estate separated onto its ' +
          'own identity plane so a corporate compromise cannot reach the fleet.',
      },
    },
    {
      id: 'ota',
      label: 'OTA update service',
      note: 'OTA01, 10.180.6.10. Pushes software to two million vehicles. The objective.',
      crown: true,
      technique: 'T1195.002 Supply Chain Compromise: Software Supply Chain',
      flavour: {
        compromise:
          'Reaching the update service unseen means you can push software to vehicles that are being driven on ' +
          'public roads by people who have never heard of any of this. It is the clearest case in the ' +
          'catalogue of a compromise whose victims are not the customer of the company being attacked, and it ' +
          'is why automotive cyber security is now a type-approval requirement rather than a voluntary matter.',
        detect:
          'Campaign integrity: every update campaign reconciled against an approved release record, staged ' +
          'rollouts with a small first cohort, and vehicle-side signature verification that fails closed.',
        evidence:
          'An update campaign created for the full fleet with no release approval, targeting the powertrain ' +
          'module, scheduled to deploy overnight without staged rollout.',
        contain:
          'The campaign is cancelled, the update service is halted, vehicles that received anything are ' +
          'identified and rolled back, and the type-approval authority and national regulator are notified. ' +
          'The safety recall process runs in parallel with the security incident.',
      },
    },
  ],
});

/**
 * A container port, and the lesson of collateral damage.
 *
 * The most expensive cyber incident in history was not aimed at the shipping
 * company it nearly destroyed. This board exists to teach that a destructive
 * worm does not check who you are, that "we are not a target" is not a security
 * posture, and that recovery capability matters more than threat intelligence
 * when the thing that hits you was never meant for you.
 */
export const TERMINAL_KESTRELPORT = definePositional({
  id: 'bd-terminal-kestrelport',
  title: 'Collateral: Kestrel Port',
  brief:
    'Six systems, two defences, nine rounds. Red is not targeting this port specifically and does ' +
    'not care about it at all. That is the point. When the thing coming at you was aimed at ' +
    'somebody else, your only real defence is how quickly you can rebuild.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['worm', 'propagate', 'destructive', 'recovery', 'rebuild', 'container', 'terminal', 'wiper'],
  dossier: {
    org: 'Kestrel Port Terminal',
    summary:
      'A container terminal handling about 2 million units a year. The terminal operating system ' +
      'schedules every crane, truck and container position, and there is no manual fallback that ' +
      'works at anything like operational scale. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Terminal operating system, 10.190.2.10 (crown)' },
      { k: 'Terminal network', v: '10.190.2.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Threat', v: 'Destructive worm, no targeting, no ransom that works' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'finance',
      label: 'Finance workstations',
      note: 'Accounting software, including a tax package with an auto-update feature.',
      technique: 'T1195.002 Supply Chain Compromise: Software Supply Chain',
      flavour: {
        compromise:
          'The entry point is a legitimate accounting package updating itself from a compromised vendor. ' +
          'Nobody clicked anything and nobody made a mistake. The update was signed, expected and installed ' +
          'automatically, which is exactly what a well-run patching process is supposed to do.',
        detect:
          'Monitoring for a software updater spawning unexpected child processes, which is one of the few ' +
          'signals available when the delivery mechanism itself is trusted.',
        evidence:
          'The accounting updater spawning rundll32 with an unusual command line on nine hosts within the same ' +
          'two-minute window, which is the signature of automated distribution rather than human action.',
        contain:
          'The vendor update channel is blocked immediately, affected hosts isolated, and the vendor and ' +
          'national authority contacted. There is no patch to apply here; the response is to break the trusted ' +
          'channel.',
      },
    },
    {
      id: 'workstations',
      label: 'Office estate',
      note: 'Approximately 600 Windows workstations, flat network, mixed patch levels.',
      technique: 'T1210 Exploitation of Remote Services',
      flavour: {
        compromise:
          'Propagation uses an SMB vulnerability plus credential harvesting from memory, so it spreads to ' +
          'patched machines too by simply logging in with credentials it stole from an unpatched one. That ' +
          'combination is why the historical worm spread across entire global estates in under an hour: ' +
          'patching alone was never going to stop it.',
        detect:
          'Mass authentication and SMB connection attempts across the estate within a very short window. The ' +
          'rate is the signal, and it is unmistakable when it happens.',
        evidence:
          'Four hundred hosts each attempting SMB connections to every address in their subnet inside ninety ' +
          'seconds, with the same administrative credential.',
        contain:
          'The network is segmented hard and fast, which in practice means pulling uplinks between floors and ' +
          'sites. Speed matters more than precision, and the decision has to be delegated in advance because ' +
          'there is no time to escalate it.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.190.2.5. Identity, and a single forest with no tiering.',
      technique: 'T1003.001 OS Credential Dumping: LSASS Memory',
      flavour: {
        compromise:
          'A flat domain with domain administrator credentials used on ordinary workstations means one ' +
          'harvested credential reaches everything. The worm does not need to be clever; the estate design ' +
          'does the work for it.',
        detect:
          'Sysmon event 10 for LSASS access at scale, and any domain administrator logon to a workstation, ' +
          'which should never happen in a tiered model.',
        evidence:
          'A domain administrator credential authenticating from 200 workstations in four minutes.',
        contain:
          'Domain controllers are taken offline to preserve them, which is drastic and correct against a ' +
          'destructive worm, and identity is rebuilt from an offline backup into a tiered model.',
      },
    },
    {
      id: 'backup',
      label: 'Backup infrastructure',
      note: 'BKP01, 10.190.2.60. Domain-joined and online, which decides the outcome.',
      technique: 'T1490 Inhibit System Recovery',
      flavour: {
        compromise:
          'Domain-joined backups fail with the domain, and against a wiper there is no decryption key to buy ' +
          'because there is no functioning key at all. Whether this port reopens in days or in months is ' +
          'decided entirely by whether one offline copy survives somewhere.',
        detect:
          'Verification that at least one copy is genuinely offline and genuinely restorable, tested by ' +
          'restore rather than by policy document. This is an assurance activity, not a detection.',
        evidence:
          'Every backup repository reachable from the production domain, with the last successful restore ' +
          'test recorded fourteen months ago.',
        contain:
          'Offline copies are protected first, before anything else in the response, because they are now the ' +
          'only asset that matters. Rebuild order is decided from the business continuity plan.',
      },
    },
    {
      id: 'gate',
      label: 'Gate and crane control',
      note: 'GATE01, 10.190.2.40. Truck gate automation and crane scheduling.',
      technique: 'T1485 Data Destruction',
      flavour: {
        compromise:
          'Gate automation decides which truck collects which container. Without it, trucks queue on the ' +
          'approach roads and the queue reaches the motorway within hours. The physical consequence arrives ' +
          'much faster than anyone expects.',
        detect:
          'Availability monitoring with an operational, not technical, threshold: the alert should fire on ' +
          'gate throughput dropping, because that is what the business actually cares about.',
        evidence:
          'Gate throughput falling to zero with no scheduled maintenance, and control hosts unreachable.',
        contain:
          'Manual gate procedures are invoked with paper manifests, throughput drops by roughly ninety per ' +
          'cent, and the port declares a major incident so that customers can divert while there is still time.',
      },
    },
    {
      id: 'tos',
      label: 'Terminal operating system',
      note: 'TOS01, 10.190.2.10. Knows where every container is. The objective.',
      crown: true,
      technique: 'T1485 Data Destruction',
      flavour: {
        compromise:
          'The terminal operating system is the only record of where every container physically sits. Destroy ' +
          'it and the port is holding tens of thousands of steel boxes it cannot identify without opening ' +
          'them. There is no ransom to pay and nothing to negotiate, because this payload was never designed ' +
          'to be reversible. The recovery is measured in weeks and the loss in hundreds of millions.',
        detect:
          'Integrity and availability monitoring on the container position database, and offline replication ' +
          'to a system that shares no credentials with production.',
        evidence:
          'The container position database unreadable, its transaction log destroyed, and the standby replica ' +
          'destroyed too because it was reachable with the same credentials.',
        contain:
          'Recovery from the one offline copy, and where that fails, physical re-survey of the yard. The ' +
          'lesson is that no detection would have saved this port; only the existence of an offline, ' +
          'credential-isolated copy decides how bad the week becomes.',
      },
    },
  ],
});

/**
 * A defence contractor, where the adversary has years and no deadline.
 *
 * The distinguishing feature is dwell time. Every other board is a race. This
 * one is a siege: the group is willing to sit for eighteen months, and its
 * objective is to leave with a design and never be noticed at all. Blue's job is
 * hunting rather than alerting, because nothing here will ever trip a rule.
 */
export const PROGRAMME_HALSTEAD = definePositional({
  id: 'bd-programme-halstead',
  title: 'Long Game: Halstead Defence',
  brief:
    'Seven systems, three defences, twelve rounds. This adversary has no deadline and no interest ' +
    'in disruption. They intend to take a design and leave without ever being noticed. Blue cannot ' +
    'wait for an alert here, because nothing they do will raise one.',
  maxTurns: 12,
  coverageBudget: 3,
  movesLeft: 4,
  terms: ['espionage', 'dwell', 'hunt', 'classified', 'programme', 'clearance', 'persistent', 'patient'],
  dossier: {
    org: 'Halstead Defence Systems',
    summary:
      'A defence contractor working on a classified programme under government contract. Cleared ' +
      'personnel, a separated classified network, and an unclassified corporate estate that has to ' +
      'talk to the outside world. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Programme design data, 10.200.8.10 (crown)' },
      { k: 'Classified network', v: '10.200.8.0/24' },
      { k: 'Corporate', v: '10.200.1.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Blue coverage', v: '3 systems at a time, 4 repositions' },
      { k: 'Clock', v: '12 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate network',
      note: 'Unclassified estate, 10.200.1.0/24. Email, HR, procurement.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'The unclassified side is where the adversary lives for a year. Nothing is stolen and nothing ' +
          'breaks. The work here is mapping: who has clearance, who works on which programme, and which of ' +
          'them is having a bad year financially.',
        detect:
          'Threat hunting rather than alerting, because there is nothing anomalous to alert on. Hypothesis ' +
          'driven hunts against credential use patterns are the only thing that finds this phase.',
        evidence:
          'An account authenticating from a workstation it has no business relationship with, once a fortnight, ' +
          'for eight months, always during working hours.',
        contain:
          'No immediate action. The intrusion is monitored under a deliberate deception plan while the full ' +
          'scope is established, because moving on the visible foothold loses the rest of it and tells the ' +
          'adversary what you know.',
      },
    },
    {
      id: 'hr',
      label: 'HR systems',
      note: 'HR01, 10.200.1.30. Personnel records, clearances, vetting status.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'HR data identifies who holds which clearance and who is under financial pressure. That combination ' +
          'is a recruitment target list, and human recruitment is the technique with the highest success rate ' +
          'against a properly separated classified network.',
        detect:
          'Strict access control and alerting on any access to vetting status outside the small named security ' +
          'team.',
        evidence:
          'Clearance status and financial disclosure fields queried for forty staff on the programme, by an ' +
          'account in a different business unit.',
        contain:
          'Access is restricted, the affected staff are quietly brought under counter-intelligence awareness ' +
          'briefing, and the government security authority is informed.',
      },
    },
    {
      id: 'engineering',
      label: 'Engineering workstations',
      note: 'Design and simulation on the unclassified side. The bridge to the good stuff.',
      technique: 'T1114.001 Email Collection: Local Email Collection',
      flavour: {
        compromise:
          'Engineers discuss classified work in unclassified language constantly, because that is how work ' +
          'gets done. Their mail and local notes contain enough context to make the classified material ' +
          'intelligible once it is obtained, and often enough to make obtaining it unnecessary.',
        detect:
          'Data loss prevention tuned for programme terminology on the unclassified side, which catches ' +
          'spillage as well as theft and is worth running for that reason alone.',
        evidence:
          'A local mail archive copied from an engineering workstation to a staging host at 03:00, containing ' +
          'eight months of programme discussion.',
        contain:
          'The archive is preserved, the spillage assessed and reported, and the engineering population ' +
          'rebriefed on discussing programme detail outside the classified environment.',
      },
    },
    {
      id: 'crossdomain',
      label: 'Cross-domain gateway',
      note: 'CDS01, 10.200.8.60. Controlled transfer between unclassified and classified.',
      technique: 'T1052 Exfiltration Over Physical Medium',
      flavour: {
        compromise:
          'The cross-domain solution is the only sanctioned path between the two networks and it is heavily ' +
          'controlled in the outbound direction. The realistic attack is the transfer process around it: the ' +
          'media, the approvals and the people, rather than the device itself.',
        detect:
          'Transfer auditing with content inspection and mandatory two-person integrity on every outbound ' +
          'transfer.',
        evidence:
          'An outbound transfer approved by a single person, containing an archive whose declared content ' +
          'does not match its actual content.',
        contain:
          'Transfers are suspended, two-person integrity enforced technically rather than procedurally, and ' +
          'every transfer for the preceding period is re-examined.',
      },
    },
    {
      id: 'classified',
      label: 'Classified workstations',
      note: 'Air-gapped terminals in a controlled area. No network path in.',
      technique: 'T1091 Replication Through Removable Media',
      flavour: {
        compromise:
          'An air gap is not a security control on its own, it is a delay. Removable media crosses it because ' +
          'work has to happen, and a payload that sits on a USB device waiting to be carried across is exactly ' +
          'how documented air-gap intrusions have worked.',
        detect:
          'Media control and mandatory scanning at a dedicated station, plus host logging inside the enclave ' +
          'that is reviewed even though the enclave is "isolated".',
        evidence:
          'A USB device serial number appearing on both an unclassified and a classified host, which the media ' +
          'control policy forbids absolutely.',
        contain:
          'The enclave is treated as compromised, hosts are examined offline, media control is enforced ' +
          'physically with port blockers and a one-way scanning station, and the incident is reported to the ' +
          'government authority.',
      },
    },
    {
      id: 'ad',
      label: 'Classified directory',
      note: 'DC02, 10.200.8.5. Identity inside the classified enclave.',
      technique: 'T1558.001 Steal or Forge Kerberos Tickets: Golden Ticket',
      flavour: {
        compromise:
          'With the krbtgt hash you forge tickets for any user with any group membership, and they are ' +
          'accepted because they are cryptographically valid. It is persistence that survives password resets ' +
          'across the entire domain, and it is the reason krbtgt is reset twice during recovery.',
        detect:
          'Tickets with anomalous lifetimes or group memberships, and authentication events with no ' +
          'corresponding ticket-granting request. The missing 4768 is the tell.',
        evidence:
          'Service tickets presented for a privileged account with a ten-year lifetime and no preceding ' +
          'authentication event anywhere in the logs.',
        contain:
          'krbtgt is reset twice with the required interval between resets, every session is invalidated, and ' +
          'the enclave identity is rebuilt with the assumption that anything before this point is untrusted.',
      },
    },
    {
      id: 'programme',
      label: 'Programme design data',
      note: 'PRG01, 10.200.8.10. The classified design. The objective.',
      crown: true,
      technique: 'T1030 Data Transfer Size Limits',
      flavour: {
        compromise:
          'The design taken unseen, moved out slowly in pieces small enough to stay beneath every threshold, ' +
          'over months. Nobody notices, no rule fires, and the programme appears in a foreign capability ' +
          'assessment four years later. This is what a successful espionage operation looks like: no incident, ' +
          'no alert, and no way to know it happened.',
        detect:
          'Long-window statistical analysis rather than thresholds: cumulative egress per host over months ' +
          'against its own history. Any detection based on a daily limit is defeated by definition here.',
        evidence:
          'Ninety megabytes leaving one host over eleven weeks in consistent small transfers to a single ' +
          'destination, none of them individually above any threshold.',
        contain:
          'The government security authority leads. Damage assessment against the programme, review of every ' +
          'system the actor touched, and a compromise assumption that extends back to the earliest evidence ' +
          'rather than to the point of discovery.',
      },
    },
  ],
});

/**
 * A managed service provider, and the multiplier.
 *
 * The most important board in the catalogue for anyone entering the industry,
 * because the managed service provider is where a great many of them will work.
 * The crown is a remote management console with agents on eight thousand
 * machines belonging to other companies. Compromising it is not one breach, it
 * is three hundred, and the customers never chose the risk.
 */
export const CONSOLE_ARGENT = definePositional({
  id: 'bd-console-argent',
  title: 'Multiplier: Argent Managed Services',
  brief:
    'Seven systems, two defences, ten rounds. Argent manages IT for three hundred small businesses ' +
    'from one console with agents on eight thousand machines. Losing this board is not one breach, ' +
    'it is three hundred, and none of those customers are in the room.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['msp', 'customer', 'downstream', 'agent', 'console', 'tenant', 'multiplier', 'privileged'],
  dossier: {
    org: 'Argent Managed Services',
    summary:
      'A managed service provider with 300 small and medium business customers, 8,000 managed ' +
      'endpoints, and a small team that necessarily holds enormous privilege. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Remote management console, 10.210.9.10 (crown)' },
      { k: 'Management network', v: '10.210.9.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Downstream', v: '300 customers, 8,000 endpoints' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'helpdesk',
      label: 'Helpdesk staff',
      note: 'First line engineers with broad access and a target on their backs.',
      technique: 'T1621 Multi-Factor Authentication Request Generation',
      flavour: {
        compromise:
          'MFA fatigue: repeated push notifications until the engineer approves one to make it stop, often ' +
          'combined with a phone call claiming to be from internal IT. The second factor is defeated by the ' +
          'person holding it, which is why number matching exists.',
        detect:
          'Alerting on repeated denied MFA prompts followed by an approval, which is an unambiguous signature ' +
          'and is available in every modern identity platform.',
        evidence:
          'Nineteen push notifications to one engineer between 22:10 and 22:26, eighteen denied and the ' +
          'nineteenth approved.',
        contain:
          'Sessions revoked, number matching enforced tenant-wide, and the engineer explicitly thanked rather ' +
          'than blamed, because the alternative is that the next person hides it.',
      },
    },
    {
      id: 'ticketing',
      label: 'Ticketing system',
      note: 'TIK01, 10.210.9.30. Customer tickets, and passwords pasted into them.',
      technique: 'T1552.001 Unsecured Credentials: Credentials In Files',
      flavour: {
        compromise:
          'Ticketing systems accumulate credentials because an engineer in a hurry pastes one into a ticket to ' +
          'hand over a job. Years of that builds a searchable credential store for three hundred customers, ' +
          'sitting in a system nobody classifies as sensitive.',
        detect:
          'Automated secret scanning across ticket content, which finds both the historical backlog and each ' +
          'new occurrence.',
        evidence:
          'A search for common password field terms returning four hundred tickets containing live customer ' +
          'credentials, the oldest from 2019.',
        contain:
          'Affected credentials are rotated across every customer, the historical tickets are redacted, ' +
          'and a password handover mechanism is provided so engineers have something better to reach for.',
      },
    },
    {
      id: 'vpn',
      label: 'Customer VPN access',
      note: 'Persistent tunnels into every customer network.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise:
          'Persistent always-on tunnels into three hundred customer networks, because setting them up per job ' +
          'is inconvenient. Convenience for the provider is a permanent, unmonitored path for anyone who ' +
          'reaches the provider.',
        detect:
          'Session auditing per customer against ticket records: any connection into a customer network with ' +
          'no open ticket is unjustified by definition.',
        evidence:
          'Connections into eleven customer networks over one night, none with a corresponding ticket, from ' +
          'one engineer account.',
        contain:
          'Persistent tunnels are replaced with just-in-time access tied to an open ticket and time-boxed, ' +
          'which is the architectural fix and the one customers should be demanding in contract.',
      },
    },
    {
      id: 'backupmgmt',
      label: 'Customer backup management',
      note: 'BKM01, 10.210.9.40. Manages backups for all 300 customers centrally.',
      technique: 'T1490 Inhibit System Recovery',
      flavour: {
        compromise:
          'Centrally managed customer backups mean one console can destroy the recovery capability of three ' +
          'hundred businesses at once. Most of those customers believe they have backups, and they do, right ' +
          'up until this console says otherwise.',
        detect:
          'Alerting on retention or job changes across multiple customer tenants in a short window, which no ' +
          'legitimate operation produces.',
        evidence:
          'Retention reduced to one day across 240 customer tenants within eight minutes.',
        contain:
          'Policies restored, immutable retention enabled per tenant, and backup management separated so a ' +
          'single console cannot act across all customers simultaneously.',
      },
    },
    {
      id: 'documentation',
      label: 'Customer documentation',
      note: 'DOC01, 10.210.9.50. Network diagrams and credentials for every customer.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The documentation platform is a complete map of three hundred networks with the credentials ' +
          'attached. It is the single most valuable artefact in a managed service provider and it is usually ' +
          'protected as an internal wiki.',
        detect:
          'Access auditing with alerting on bulk export and on any access across many customer records in one ' +
          'session, which no genuine job requires.',
        evidence:
          'Documentation for 180 customers exported in one session by an account whose normal pattern is two ' +
          'or three customers a day.',
        contain:
          'Export is disabled, access scoped per engagement, all documented credentials rotated across every ' +
          'affected customer, and customers notified individually because their networks are now mapped.',
      },
    },
    {
      id: 'idp',
      label: 'Provider identity',
      note: 'Identity for Argent staff, federated into customer tenants.',
      technique: 'T1078.004 Valid Accounts: Cloud Accounts',
      flavour: {
        compromise:
          'Delegated administration relationships mean provider identities carry privilege inside customer ' +
          'tenants. One compromised provider account is administrative access to hundreds of other ' +
          'organisations, granted by a trust relationship those organisations agreed to at onboarding and ' +
          'never revisited.',
        detect:
          'Customer-side monitoring of delegated administrative access, and provider-side privileged identity ' +
          'management with approval and time limits. Both sides should be watching this and usually neither is.',
        evidence:
          'Delegated administrative sign-ins to fourteen customer tenants in one hour, outside business hours, ' +
          'with no supporting tickets.',
        contain:
          'Delegated relationships are suspended, every customer is notified to review their own audit logs, ' +
          'and delegation is re-established with granular roles and just-in-time elevation.',
      },
    },
    {
      id: 'rmm',
      label: 'Remote management console',
      note: 'RMM01, 10.210.9.10. Agents on 8,000 customer endpoints. The objective.',
      crown: true,
      technique: 'T1072 Software Deployment Tools',
      flavour: {
        compromise:
          'The management console can execute a script as SYSTEM on eight thousand machines belonging to three ' +
          'hundred different companies, because that is precisely what it is for. Reaching it unseen means ' +
          'ransomware deployed to every customer simultaneously, through a trusted agent, from a trusted ' +
          'source. This is the attack that has repeatedly taken hundreds of businesses offline in a single ' +
          'afternoon, and it is the strongest argument in the industry for why privileged access management is ' +
          'not optional.',
        detect:
          'Script execution auditing with approval required for any deployment above a customer threshold, ' +
          'and customer-side alerting on the management agent spawning unexpected processes. The customer is ' +
          'the last line of defence here and needs to be told so.',
        evidence:
          'A script deployed to all endpoints across all customer tenants at 16:00 on a Friday, encoded, with ' +
          'no change record and no approval.',
        contain:
          'The console is isolated and agent communication severed at the network level, which blinds Argent ' +
          'to its own customers and is still correct. Every customer is notified immediately, endpoints are ' +
          'assessed individually, and the national authority is engaged because this is a single incident with ' +
          'three hundred victims.',
      },
    },
  ],
});
