/**
 * Board scenarios: commerce and venues.
 *
 * Three estates where money and crowds meet physical premises, each teaching a
 * failure mode the earlier boards do not reach.
 *
 * The acquirer board is the merchant side of payments: the crown is the acquiring
 * gateway and its token vault, distinct from the issuing bank and the
 * clearinghouse, and the lesson is that the party standing between millions of
 * merchants and the card networks is a concentration point of its own. The casino
 * board is physical-plus-digital: gaming integrity, cash handling and
 * surveillance on one estate, reached through the kind of overlooked connected
 * device that has actually been a documented entry point. The venue board is
 * mass-gathering safety: an arena's crowd-flow, access and life-safety systems
 * under software control, where a compromise is a crowd-safety event.
 *
 * Same standard as the rest: every system names its ATT&CK technique, and the
 * four outcome lines carry the method, the detection logic, the artefact and the
 * containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * A payment acquirer, and the merchant-side concentration problem.
 *
 * The lesson is that the acquirer sits between millions of merchants and the card
 * networks, holding a token vault and processing every transaction those
 * merchants take. It is distinct from the issuing bank and the clearinghouse: the
 * crown is the acquiring gateway, and its compromise is a concentration point for
 * card fraud across a whole merchant base.
 */
export const ACQUIRER_MAREX = definePositional({
  id: 'bd-acquirer-marex',
  title: 'Merchant Side: Marex Payments',
  brief:
    'Seven systems, two defences, ten rounds. Marex stands between millions of merchants and the card ' +
    'networks, holding a token vault and processing every sale those merchants take. Red wants the ' +
    'acquiring gateway; the lesson is that the party in the middle is a concentration point of its own.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['acquirer', 'merchant', 'token', 'vault', 'gateway', 'payment', 'card', 'processing'],
  dossier: {
    org: 'Marex Payments',
    summary:
      'A payment acquirer and processor serving millions of merchants. It runs an acquiring gateway, ' +
      'a token vault that replaces card numbers, and connectivity to the card networks. In scope for ' +
      'the strictest payment-security standards. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Acquiring gateway and token vault, 10.142.5.10 (crown)' },
      { k: 'Processing network', v: '10.142.5.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Reach', v: 'Every transaction across millions of merchants' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'merchantportal',
      label: 'Merchant portal',
      note: 'portal.marex.example, 198.51.100.75. Where merchants manage their accounts.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'A flaw in the merchant portal gives a foothold and a view into the processing backend. It is ' +
          'internet-facing and used by every merchant, a natural entry point into an acquirer.',
        detect:
          'The portal process spawning a shell, and egress from the web tier to anywhere that is not its ' +
          'backend.',
        evidence:
          'The portal application spawning a command interpreter, with a crafted request in the logs.',
        contain:
          'The portal is taken offline and rebuilt, segmented from the processing backend, and the backend ' +
          'reviewed for access.',
      },
    },
    {
      id: 'gateway',
      label: 'Merchant connectivity',
      note: 'GW01, 10.142.5.30. Accepts transactions from merchant terminals and sites.',
      technique: 'T1557 Adversary-in-the-Middle',
      flavour: {
        compromise:
          'The connectivity layer accepts transactions from millions of merchant endpoints. Positioning ' +
          'between merchants and the gateway lets you capture transaction data in flight across a broad ' +
          'merchant base, a concentration attack the individual merchants could never see.',
        detect:
          'Mutual authentication and integrity on merchant connectivity, and alerting on any session that ' +
          'terminates somewhere other than the authentic gateway.',
        evidence:
          'Merchant sessions terminating at an interposed endpoint, or certificate anomalies on the ' +
          'connectivity path.',
        contain:
          'The interposition is removed, merchant connectivity re-pinned to the authentic gateway with mutual ' +
          'authentication, and the exposure assessed.',
      },
    },
    {
      id: 'fraud',
      label: 'Fraud and risk engine',
      note: 'RISK01, 10.142.5.40. Scores transactions for fraud in real time.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'The fraud engine is what stops bad transactions. Weakening its rules lets fraudulent transactions ' +
          'flow through as approved, which realises value for an attacker running stolen cards without ever ' +
          'touching the vault.',
        detect:
          'Monitoring the fraud-rule configuration for changes, and alerting on any sudden drop in decline ' +
          'rates or rise in approvals in a merchant category.',
        evidence:
          'Fraud thresholds widened with no approval, followed by a cluster of approvals that the previous ' +
          'rules would have declined.',
        contain:
          'The rules are restored from configuration control, the affected transactions pulled for review, and ' +
          'rule changes gated behind approval.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.142.5.5. Processing-estate identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Domain admin over the processing estate puts the gateway and token vault within reach. DCSync takes ' +
          'the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a processing-operations workstation at 02:50.',
        contain:
          'The account is disabled, krbtgt reset twice, and the processing network moved onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'settlement',
      label: 'Merchant settlement',
      note: 'SET01, 10.142.5.60. Pays merchants their takings, less fees.',
      technique: 'T1098 Account Manipulation',
      flavour: {
        compromise:
          'Merchant settlement pays each merchant their proceeds. Altering merchant bank details, mandate ' +
          'fraud at scale, diverts settlements to accounts you control, quieter than card fraud and ' +
          'potentially larger across a big merchant base.',
        detect:
          'Any merchant bank-detail change without dual authorisation, alerted in real time, and ' +
          'reconciliation against the merchant record.',
        evidence:
          'A batch of merchant payout details amended to a small set of destination accounts, by an account ' +
          'with no history of such edits.',
        contain:
          'Changes reverted, dual authorisation enforced, the settlement run held, and the receiving banks ' +
          'contacted while recall is possible.',
      },
    },
    {
      id: 'monitoring',
      label: 'Transaction monitoring',
      note: 'MON01, 10.142.5.70. Watches the health and integrity of processing.',
      technique: 'T1562.008 Impair Defenses: Disable or Modify Cloud Logs',
      flavour: {
        compromise:
          'Transaction monitoring and logging are what reveal an attack on the processing estate. Filtering it ' +
          'lets card capture or approval abuse run unseen, turning a contained incident into a broad, silent ' +
          'compromise.',
        detect:
          'Alerting on any change to monitoring or logging configuration, delivered to a store the processing ' +
          'principals cannot reach.',
        evidence:
          'Monitoring modified to exclude a source, and a gap in delivery to the archive.',
        contain:
          'Monitoring is restored from the separate store, the gap reconstructed, and configuration protected ' +
          'from processing roles.',
      },
    },
    {
      id: 'vault',
      label: 'Acquiring gateway and token vault',
      note: 'VLT01, 10.142.5.10. Processes transactions and holds the card token vault. The objective.',
      crown: true,
      technique: 'T1074.002 Data Staged: Remote Data Staging',
      flavour: {
        compromise:
          'You reach the acquiring gateway and its token vault unseen: the point through which every ' +
          'transaction from millions of merchants passes, and the store that maps tokens back to card data. ' +
          'Capturing card data at the gateway, or lifting the vault, is a card breach spanning an entire ' +
          'merchant base at once, and none of those merchants could have prevented it from their side. The ' +
          'acquirer is neither the bank nor the clearinghouse; it is the concentration point in the middle, ' +
          'and that position is exactly what makes it a crown. The lesson is that the party standing between ' +
          'many participants inherits the risk of all of them.',
        detect:
          'Egress monitoring from the processing environment to anywhere that is not the card networks, ' +
          'integrity monitoring on the gateway, tokenisation that keeps raw card data out of reach, and ' +
          'strict, logged access to the vault.',
        evidence:
          'An archive of captured transaction or token data assembled in the processing environment and ' +
          'prepared for transfer to an internal staging host outside it.',
        contain:
          'The environment is cut to its documented flows, the staging host isolated and imaged, the card ' +
          'schemes’ required forensic process engaged, the vault keys rotated, and every affected merchant and ' +
          'the regulators notified, because the exposure spans the whole book.',
      },
    },
  ],
});

/**
 * A casino, and the physical-plus-digital-plus-cash problem.
 *
 * The lesson is that a casino floor fuses gaming integrity, cash handling and
 * surveillance on one estate, and the overlooked connected device, famously an
 * aquarium sensor in one real case, is a documented way in. The crown is the
 * gaming and cage management, where fraud, cash and licence all meet.
 */
export const CASINO_GOLDSTREAM = definePositional({
  id: 'bd-casino-goldstream',
  title: 'The Floor: Goldstream Casino',
  brief:
    'Seven systems, two defences, ten rounds. A casino fuses gaming integrity, cash handling and ' +
    'surveillance on one estate, and the way in is often an overlooked connected device. Red wants ' +
    'the gaming and cage management; Blue is defending money, fairness and a licence at once.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['casino', 'gaming', 'cage', 'cash', 'surveillance', 'iot', 'integrity', 'licence'],
  dossier: {
    org: 'Goldstream Casino',
    summary:
      'A physical casino with a gaming floor of slot machines and tables, a cash cage, a player-tracking ' +
      'system, and pervasive surveillance. A range of connected building and floor devices share the ' +
      'network. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Gaming and cage management, 10.143.6.10 (crown)' },
      { k: 'Floor network', v: '10.143.6.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Convergence', v: 'Gaming integrity, cash and surveillance on one estate' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'iot',
      label: 'Connected floor devices',
      note: 'Environmental and amenity sensors on the floor network, poorly segmented.',
      technique: 'T1200 Hardware Additions',
      flavour: {
        compromise:
          'An overlooked connected device on the floor network, an environmental sensor or amenity controller, ' +
          'with weak credentials and a thin separation from the systems that matter. A casino was famously ' +
          'breached through exactly this kind of device, and it is the documented soft entry point.',
        detect:
          'Network access control on the floor network refusing unrecognised devices, and monitoring for any ' +
          'connected device reaching the gaming or cage systems.',
        evidence:
          'A floor sensor device initiating connections toward the gaming management network, which it has no ' +
          'reason to touch.',
        contain:
          'The device is isolated, floor IoT segmented onto its own network with no path to gaming or cage, ' +
          'and default credentials removed across such devices.',
      },
    },
    {
      id: 'players',
      label: 'Player tracking',
      note: 'PT01, 10.143.6.30. Loyalty and player accounts, with comps and credit.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'Player tracking holds personal data, spending patterns and comp balances. It is a rich personal ' +
          'data target, and manipulating comps or credit is a fraud angle short of touching the cage.',
        detect:
          'Access auditing on player data with alerting on bulk reads, and monitoring of comp and credit ' +
          'adjustments against authorised staff actions.',
        evidence:
          'A bulk read of player records, or comp and credit balances adjusted with no matching authorised ' +
          'action.',
        contain:
          'Access is scoped, fraudulent adjustments reversed, and comp and credit changes re-gated behind ' +
          'supervisor approval.',
      },
    },
    {
      id: 'surveillance',
      label: 'Surveillance system',
      note: 'CCTV01, 10.143.6.40. The cameras covering the floor and the cage.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Surveillance is the casino’s eyes, and regulators require it. Looping or blinding a camera covering ' +
          'the cage or a gaming table removes the oversight that would catch a physical theft or a rigged ' +
          'game, which is the enabling step for an on-floor fraud.',
        detect:
          'Integrity monitoring on the camera feeds, and alerting on any feed that freezes, loops or drops ' +
          'while it should be live.',
        evidence:
          'A camera feed over the cage looping or showing a static image while activity is occurring, at a ' +
          'chosen time.',
        contain:
          'Surveillance is restored, affected periods treated as unmonitored and investigated, and the feed ' +
          'integrity hardened.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.143.6.5. Casino staff identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Domain admin over the floor estate puts the gaming and cage systems within reach. DCSync takes the ' +
          'hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a floor-operations workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and the floor estate separated onto its own identity ' +
          'plane.',
      },
    },
    {
      id: 'slots',
      label: 'Slot management',
      note: 'SLOT01, 10.143.6.50. Configures the slot machines and their payouts.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Slot management configures the machines, including payout behaviour. Tampering with it is both fraud ' +
          'and a regulatory breach, because a machine that does not pay as certified cannot legally operate, ' +
          'and it can be used to arrange wins for a confederate.',
        detect:
          'Integrity monitoring on slot configuration against the certified settings, and statistical ' +
          'monitoring of payouts against expected distributions.',
        evidence:
          'Slot payout configuration changed from the certified setting, correlated with a cluster of wins on ' +
          'affected machines.',
        contain:
          'Affected machines are taken offline, configuration restored from the certified baseline and ' +
          're-verified, and the gaming regulator notified.',
      },
    },
    {
      id: 'monitoring',
      label: 'Floor operations display',
      note: 'FLOOR-HMI, 10.143.6.60. What floor operations watches.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'The operations display and alerting are how the floor is watched for anomalies. Suppressing it lets ' +
          'a cage or gaming manipulation proceed without floor operations noticing until a manual count or a ' +
          'regulator finds it.',
        detect:
          'Heartbeat monitoring of the alerting pipeline from an independent system, so silence raises an ' +
          'alarm.',
        evidence:
          'Floor alerts suppressed and the operations display held quiet during unusual cage or gaming ' +
          'activity.',
        contain:
          'Monitoring is restored, an independent view relied upon, and the quiet period reviewed.',
      },
    },
    {
      id: 'cage',
      label: 'Gaming and cage management',
      note: 'CAGE01, 10.143.6.10. Manages the cash cage, chips and gaming systems. The objective.',
      crown: true,
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'You reach the gaming and cage management unseen: the system that reconciles the cash cage, the chip ' +
          'inventory and the gaming floor. With surveillance already blinded and the operations display held ' +
          'quiet, manipulating balances and reconciliations lets cash and chips leave the cage while the books ' +
          'still appear to balance, and it corrupts the gaming integrity a casino’s licence depends on. This ' +
          'board fuses physical cash, digital records and surveillance into one crown, and the lesson is that ' +
          'a converged floor is only as trustworthy as the least-guarded device on its network.',
        detect:
          'Reconciliation of the cage and chip inventory against physical counts, integrity monitoring on the ' +
          'gaming records, and cross-checking against surveillance that is independently protected.',
        evidence:
          'Cage or chip balances altered with no matching physical movement, during a window when surveillance ' +
          'and alerting were suppressed.',
        contain:
          'The cage is reconciled against a physical count, the gaming records restored and verified, affected ' +
          'periods investigated with law enforcement and the regulator, and floor segmentation and device ' +
          'controls tightened so the overlooked-device route is closed.',
      },
    },
  ],
});

/**
 * A large event venue, and the mass-gathering-safety problem.
 *
 * The lesson is that an arena packs tens of thousands of people into a space
 * whose crowd flow, access and life-safety systems are under software control, so
 * a compromise is a crowd-safety event. The crown is the venue management system
 * that coordinates access, egress and safety across the building.
 */
export const VENUE_HIGHFIELD = definePositional({
  id: 'bd-venue-highfield',
  title: 'Full House: Highfield Arena',
  brief:
    'Six systems, two defences, nine rounds. An arena packs tens of thousands of people into a space ' +
    'whose crowd flow, access and life-safety run on software. Red wants the venue management system; ' +
    'Blue is defending against a crowd-safety event, where the wrong door state at the wrong moment is ' +
    'lethal.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['venue', 'crowd', 'egress', 'access', 'safety', 'gathering', 'physical', 'evacuation'],
  dossier: {
    org: 'Highfield Arena',
    summary:
      'A large indoor arena hosting events for tens of thousands. Ticketing, access gates, crowd-flow ' +
      'management and life-safety systems, including egress and public address, run on connected ' +
      'systems coordinated centrally. Simulated throughout: no system is actually commanded.',
    facts: [
      { k: 'Objective', v: 'Venue management system, 172.22.5.10 (crown)' },
      { k: 'Venue network', v: '172.22.5.0/24' },
      { k: 'Corporate', v: '10.144.1.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'ticketing',
      label: 'Ticketing and entry',
      note: 'TIX01, 192.0.2.70. Public ticketing and entry validation.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'The ticketing system is internet-facing and gives a foothold plus a view into the venue estate. ' +
          'Disrupting entry validation alone causes dangerous queues at the doors, a crowd issue short of the ' +
          'management system.',
        detect:
          'The ticketing tier spawning unexpected processes, and egress to anywhere that is not its backend.',
        evidence:
          'The ticketing application spawning a shell, with a crafted request in the logs.',
        contain:
          'The ticketing system is patched and rebuilt, segmented from the venue network, and a manual entry ' +
          'fallback readied.',
      },
    },
    {
      id: 'access',
      label: 'Access gates',
      note: 'GATE01, 172.22.5.30. Turnstiles and secure-area doors.',
      technique: 'T1098 Account Manipulation',
      flavour: {
        compromise:
          'Access control governs turnstiles and secure doors. Locking gates during ingress creates crushing ' +
          'pressure at entry, and unlocking secure areas is a physical intrusion, so both directions are ' +
          'dangerous.',
        detect:
          'Auditing of access-rule changes, and alerting on any gate configuration change, especially to ' +
          'egress-relevant doors.',
        evidence:
          'An access rule changing gate behaviour with no operational request, close to an event time.',
        contain:
          'The rule is reverted, the gate restored to safe operation, and access changes gated behind ' +
          'approval.',
      },
    },
    {
      id: 'crowd',
      label: 'Crowd-flow monitoring',
      note: 'FLOW01, 172.22.5.40. Sensors and displays tracking crowd density.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Crowd-flow monitoring is how operations sees dangerous density building. Falsifying it to show ' +
          'normal flow while a crush develops means staff do not intervene until it is a physical emergency, ' +
          'which is harm by deception.',
        detect:
          'Cross-checking crowd-flow data against camera feeds and manual observation, and alerting on ' +
          'divergence or on implausibly steady density during ingress or egress.',
        evidence:
          'Crowd-flow displays showing normal density while camera feeds show a dangerous build-up at a ' +
          'concourse.',
        contain:
          'Operations relies on cameras and stewards, treats the flow data as untrusted, and manages the crowd ' +
          'physically.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.144.1.5. Staff identity, which governs venue-system access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the venue systems, so the directory is one hop from the management ' +
          'system. Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a venue-operations workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and the venue network separated onto its own identity ' +
          'plane.',
      },
    },
    {
      id: 'pa',
      label: 'Public address and signage',
      note: 'PA01, 172.22.5.50. Announcements and wayfinding, including emergency messaging.',
      technique: 'T1491.002 Defacement: External Defacement',
      flavour: {
        compromise:
          'Public address and signage direct the crowd, including in an emergency. Broadcasting a false ' +
          'evacuation message, or contradictory wayfinding, can itself cause a panic and a crush, so it is a ' +
          'crowd-safety weapon on its own.',
        detect:
          'Origination controls on emergency messaging requiring authorised activation, and monitoring of what ' +
          'is actually broadcast against the intended content.',
        evidence:
          'An emergency announcement or evacuation message activated with no authorised request, or signage ' +
          'directing crowds unsafely.',
        contain:
          'The false message is stopped and corrected immediately by trained staff, the system locked to ' +
          'authorised origination, and the crowd calmed through stewards.',
      },
    },
    {
      id: 'vms',
      label: 'Venue management system',
      note: 'VMS01, 172.22.5.10. Coordinates access, egress and life-safety. The objective.',
      crown: true,
      technique: 'T0880 Loss of Safety',
      flavour: {
        compromise:
          'You reach the venue management system unseen: the central coordinator of access, egress routes, ' +
          'crowd flow and life-safety for a building holding tens of thousands. Locking egress doors during a ' +
          'panic, or falsifying the safety picture while a crush develops, turns a software compromise into a ' +
          'mass-casualty risk, and even without a deliberate emergency, engineered crowd mismanagement at ' +
          'ingress or egress is lethal. This is the mass-gathering lesson: once a crowd’s movement and its ' +
          'escape routes are under software control, that software is a life-safety system, and it must be ' +
          'protected and independently backed up as one.',
        detect:
          'Integrity monitoring on the management system, independent life-safety and egress controls that the ' +
          'management system cannot override, and monitoring for any egress or door-state change inconsistent ' +
          'with safe operation.',
        evidence:
          'Egress doors commanded to a locked state, or the safety picture falsified, from a session that ' +
          'reached the management system through the venue network, near or during an event.',
        contain:
          'Egress is forced to a safe, fail-open state through independent controls, trained staff manage the ' +
          'crowd physically, the management system is isolated and restored from known-good configuration, and ' +
          'life-safety is verified before the building is used again. Crowd safety leads every decision.',
      },
    },
  ],
});
