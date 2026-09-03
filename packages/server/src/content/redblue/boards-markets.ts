/**
 * Board scenarios: fleets, carriers, markets and multi-tenant software.
 *
 * Four estates that are each a system OF systems, where the crown commands or
 * clears something at scale, and the blast radius is defined by fan-out rather
 * than by one building.
 *
 * The solar-fleet board is the distributed-generation version of the automotive
 * one: thousands of grid-injecting inverters controlled from a single cloud
 * portal, so the portal is a grid-scale lever. The airline board is the carrier's
 * side of the aviation story, where the crown is the passenger service system
 * that, if it stops, grounds a fleet. The exchange board is about market
 * integrity, where halting or biasing the matching engine is the objective and
 * the fair, orderly market is the asset. The SaaS board is the tenant-isolation
 * problem: the whole product is that customers share infrastructure without ever
 * touching each other's data, so one boundary bug is every customer's breach.
 *
 * Same standard as the rest: every system names its ATT&CK technique, and the
 * four outcome lines carry the method, the detection logic, the artefact and the
 * containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * A distributed solar fleet, and the grid-scale-through-a-portal problem.
 *
 * The lesson is the same shape as the automotive OTA board, moved to the grid:
 * the crown is a cloud fleet-management portal that commands thousands of
 * inverters injecting power into the network, so compromising the portal is a
 * coordinated grid event delivered from a web console, and the harm lands on the
 * grid rather than on the operator.
 */
export const INVERTER_SUNMARK = definePositional({
  id: 'bd-inverter-sunmark',
  title: 'Curtailment: Sunmark Renewables',
  brief:
    'Seven systems, two defences, ten rounds. Sunmark manages tens of thousands of solar inverters ' +
    'from one cloud portal. Red wants that portal, because commanding the fleet at once is a ' +
    'grid-scale event delivered from a web console, and the damage lands on the grid, not on Sunmark.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['inverter', 'fleet', 'grid', 'portal', 'curtail', 'injection', 'frequency', 'coordinated'],
  dossier: {
    org: 'Sunmark Renewables',
    summary:
      'An operator of distributed solar generation: tens of thousands of grid-connected inverters at ' +
      'homes and businesses, all managed from a cloud portal that can update firmware and issue ' +
      'commands. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Fleet management portal, 10.121.4.10 (crown)' },
      { k: 'Management network', v: '10.121.4.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Fleet', v: 'Tens of thousands of grid-connected inverters' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'devportal',
      label: 'Developer access',
      note: 'Engineers with cloud credentials to the fleet platform.',
      technique: 'T1528 Steal Application Access Token',
      flavour: {
        compromise:
          'A cached cloud token on an engineer’s laptop gives fleet-platform access without a password or a ' +
          'prompt, because the token already represents a completed login. It is the quiet way onto a ' +
          'cloud-managed platform.',
        detect:
          'Cloud audit logs for API calls using a token from a device or address that does not match its ' +
          'issuance context.',
        evidence:
          'Fleet-platform API calls authenticated with an engineer token from an unfamiliar autonomous system, ' +
          'hours after the laptop slept.',
        contain:
          'Tokens are revoked, lifetimes shortened, conditional access requires a compliant device, and the ' +
          'laptop is isolated and examined.',
      },
    },
    {
      id: 'api',
      label: 'Inverter telemetry API',
      note: 'api.sunmark.example, 198.51.100.35. Where inverters report in.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'The telemetry API is internet-facing so that inverters everywhere can report in. A flaw here gives a ' +
          'foothold in the platform and a view of the whole fleet’s state, which is reconnaissance for a ' +
          'coordinated command.',
        detect:
          'The API tier spawning unexpected processes, and egress from it to anywhere that is not the fleet ' +
          'datastore.',
        evidence:
          'The telemetry service spawning a shell, with a crafted request in the logs against the reporting ' +
          'endpoint.',
        contain:
          'The API is patched and rebuilt, the tier segmented from the management network, and fleet command ' +
          'capability frozen pending review.',
      },
    },
    {
      id: 'firmware',
      label: 'Firmware repository',
      note: 'FW01, 10.121.4.30. Signed inverter firmware, staged before rollout.',
      technique: 'T1195.002 Supply Chain Compromise: Software Supply Chain',
      flavour: {
        compromise:
          'Inverter firmware governs how each device behaves on the grid. Tampering with a staged build, or ' +
          'reaching the signing step, would let malicious behaviour roll out to the whole fleet, which is the ' +
          'most durable and dangerous form of this attack.',
        detect:
          'Signed firmware, reproducible builds, and hash verification between the repository and the signing ' +
          'and distribution steps.',
        evidence:
          'A firmware build whose hash does not match an independent rebuild, in the grid-behaviour module, ' +
          'with no source change.',
        contain:
          'The build is quarantined, the pipeline rebuilt, reproducible verification added as a release gate, ' +
          'and the grid operator informed of the potential fleet exposure.',
      },
    },
    {
      id: 'grid',
      label: 'Grid operator interface',
      note: 'GRID01, 10.121.4.40. Coordinates output with the grid operator’s instructions.',
      technique: 'T1565.002 Data Manipulation: Transmitted Data Manipulation',
      flavour: {
        compromise:
          'The interface to the grid operator carries curtailment and output instructions. Manipulating what ' +
          'flows across it can cause the fleet to ignore a curtailment order or misreport its output, ' +
          'destabilising the operator’s balancing without any single inverter looking wrong.',
        detect:
          'Integrity and reconciliation on the grid-operator exchange: comparing instructed output against ' +
          'actual, and alarms on divergence.',
        evidence:
          'Curtailment instructions altered in transit so the fleet holds output the operator asked it to ' +
          'reduce.',
        contain:
          'The interface is restored to verified operation, the discrepancy reported to the grid operator, and ' +
          'output brought back under manual coordination.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.121.4.5. Staff identity, which governs platform access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the management platform, so the directory is one hop from fleet command. ' +
          'Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an engineering workstation at 02:20.',
        contain:
          'The account is disabled, krbtgt reset twice, and the management platform moved onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'monitoring',
      label: 'Fleet monitoring',
      note: 'MON01, 10.121.4.50. The operations view of fleet state and output.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'Fleet monitoring is how operations knows the fleet is behaving. Suppressing its alerts means a ' +
          'coordinated command executes without the operator noticing until the grid effect is already ' +
          'underway.',
        detect:
          'Heartbeat monitoring of the monitoring pipeline itself from an independent system, so that silence ' +
          'raises an alarm rather than reassuring.',
        evidence:
          'Fleet alert thresholds widened and the operations dashboard held quiet during a command sequence.',
        contain:
          'Monitoring is restored from configuration control, an independent view stood up, and recent fleet ' +
          'commands reviewed.',
      },
    },
    {
      id: 'portal',
      label: 'Fleet management portal',
      note: 'PORTAL01, 10.121.4.10. Commands and updates every inverter. The objective.',
      crown: true,
      technique: 'T0855 Unauthorized Command Message',
      flavour: {
        compromise:
          'You reach the fleet management portal unseen and can command tens of thousands of inverters at once: ' +
          'trip them offline together, or swing their output in step. A simultaneous disconnection of that ' +
          'much distributed generation is a sudden loss the grid must instantly make up, and a coordinated ' +
          'oscillation can threaten frequency stability across a region. It is a grid-scale physical event ' +
          'delivered from a web console, and the victims are everyone on the grid rather than Sunmark’s own ' +
          'customers, which is why aggregated distributed energy is now treated as critical infrastructure.',
        detect:
          'Command auditing on the portal with approval required for any fleet-wide action, rate limits on ' +
          'mass commands, and coordination with the grid operator on any large planned change.',
        evidence:
          'A fleet-wide disconnect or output command issued through the portal with no change approval, timed ' +
          'to a period of grid stress.',
        contain:
          'The portal is isolated and fleet command capability severed, the grid operator is notified ' +
          'immediately so it can prepare reserves, and command is restored only through a verified, ' +
          'rate-limited, approval-gated path.',
      },
    },
  ],
});

/**
 * An airline, and the carrier-operations problem.
 *
 * The counterpart to the airport board: here the estate is the carrier, and the
 * crown is the passenger service and departure-control system whose loss grounds
 * a fleet. The lesson is that a modern airline is a software company that
 * happens to fly planes, and an outage of the right system stops every departure
 * without touching an aircraft.
 */
export const CARRIER_ALDERGROVE = definePositional({
  id: 'bd-carrier-aldergrove',
  title: 'Ground Stop: Aldergrove Airways',
  brief:
    'Seven systems, two defences, ten rounds. Red wants the passenger service and departure-control ' +
    'system. A modern airline is a software company that flies planes: lose the right system and ' +
    'every flight is grounded, with no aircraft touched. Blue is defending operational continuity ' +
    'across a fleet.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['airline', 'departure', 'reservation', 'crew', 'flight', 'grounded', 'operations', 'availability'],
  dossier: {
    org: 'Aldergrove Airways',
    summary:
      'A national carrier running a fleet of narrow-body aircraft. Reservations, check-in, departure ' +
      'control, crew scheduling and flight operations run on interconnected systems, several supplied ' +
      'by third parties. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Departure control system, 10.122.5.10 (crown)' },
      { k: 'Operations network', v: '10.122.5.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Dependency', v: 'Departure control gates every flight' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'booking',
      label: 'Booking website',
      note: 'book.aldergrove.example, 203.0.113.50. Public reservations and customer accounts.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'A flaw in the booking application gives a foothold and a view into the reservation backend. It is ' +
          'internet-facing and heavily used, which makes it both a likely entry point and a place to hide in ' +
          'ordinary traffic.',
        detect:
          'The booking tier spawning unexpected processes, and egress from it to anywhere that is not the ' +
          'reservation system.',
        evidence:
          'The booking application spawning a shell, with a crafted request in the logs.',
        contain:
          'The booking app is patched and rebuilt, its tier segmented from operations, and the reservation ' +
          'backend reviewed for access.',
      },
    },
    {
      id: 'crew',
      label: 'Crew scheduling',
      note: 'CREW01, 10.122.5.30. Rosters pilots and cabin crew against legal duty limits.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Crew scheduling is a quieter but potent target: corrupting rosters or duty-time records can ground ' +
          'flights for lack of legal crew, or worse, put crew on duty beyond their limits. It disrupts ' +
          'operations without touching a customer-facing system.',
        detect:
          'Integrity monitoring on rosters and duty records, with alerting on changes outside the scheduling ' +
          'workflow and on any duty assignment exceeding legal limits.',
        evidence:
          'Duty-time records altered so crew appear legal for flights they are not, changed outside the ' +
          'scheduling system.',
        contain:
          'Rosters are restored from the verified source, affected flights held until legal crew is confirmed, ' +
          'and roster changes gated behind approval.',
      },
    },
    {
      id: 'flightops',
      label: 'Flight operations',
      note: 'OPS01, 10.122.5.40. Flight plans, weight and balance, dispatch.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Flight operations produces the plans and weight-and-balance figures a flight legally needs to ' +
          'dispatch. Corrupting them either grounds flights that cannot be dispatched or, if a bad figure ' +
          'slips through, creates a safety risk, so integrity here has a direct safety dimension.',
        detect:
          'Cross-checking dispatch figures against independent calculation, and alerting on any plan or ' +
          'weight-and-balance change outside the operations workflow.',
        evidence:
          'A weight-and-balance figure altered outside the dispatch process, inconsistent with the loaded ' +
          'aircraft.',
        contain:
          'Figures are recomputed independently and verified, affected flights held, and dispatch changes ' +
          'subjected to a second check.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.122.5.5. Operations identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Domain admin over operations puts departure control and every operational system within reach. ' +
          'DCSync takes the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an operations workstation at 02:50.',
        contain:
          'The account is disabled, krbtgt reset twice, and replication rights audited across the domain.',
      },
    },
    {
      id: 'backup',
      label: 'Backup infrastructure',
      note: 'BKP01, 10.122.5.60. Domain-joined, online.',
      technique: 'T1490 Inhibit System Recovery',
      flavour: {
        compromise:
          'Domain-joined backups fail with the domain, and for an airline the difference between hours and ' +
          'days of a ground stop is whether recovery survives. Neutralising it is the quiet move that turns a ' +
          'disruption into a stranded fleet and a public crisis.',
        detect:
          'Backup console audit for logins from outside the administrative subnet, and jobs disabled outside ' +
          'the change process.',
        evidence:
          'Backup jobs disabled and retention shortened by a session using a domain administrator credential.',
        contain:
          'Jobs restored, immutable retention enabled, and backups taken off the domain onto separate ' +
          'credentials.',
      },
    },
    {
      id: 'checkin',
      label: 'Check-in and boarding',
      note: 'DCS-CI, 10.122.5.50. Airport check-in and boarding-pass validation.',
      technique: 'T1499 Endpoint Denial of Service',
      flavour: {
        compromise:
          'Check-in and boarding are the visible front of departure control. Degrading them creates queues and ' +
          'missed connections across every airport the carrier serves, a disruption attack short of the main ' +
          'departure-control system.',
        detect:
          'Availability and latency monitoring on check-in with thresholds set by operational impact, and a ' +
          'tested manual check-in fallback.',
        evidence:
          'Check-in response times climbing under crafted load, with agents reporting timeouts across ' +
          'multiple stations.',
        contain:
          'Stations fall back to manual check-in procedures, the source is isolated, and the service ' +
          'recovered.',
      },
    },
    {
      id: 'dcs',
      label: 'Departure control system',
      note: 'DCS01, 10.122.5.10. Passenger service, load control and departure. The objective.',
      crown: true,
      technique: 'T1486 Data Encrypted for Impact',
      flavour: {
        compromise:
          'You reach departure control unseen and encrypt it. Without it there is no check-in, no boarding-pass ' +
          'validation and no load sheet, and an aircraft cannot legally depart without a load sheet, so the ' +
          'whole fleet is grounded at once while every aircraft sits perfectly airworthy on the tarmac. This ' +
          'is the carrier lesson: a modern airline’s single points of failure are software systems, and one ' +
          'of them stopping is a fleet-wide ground stop no maintenance hangar can fix.',
        detect:
          'File telemetry for high-entropy writes across the departure-control volume, and availability ' +
          'monitoring that treats load control as the flight-critical function it is, with a rehearsed ' +
          'contingency.',
        evidence:
          'The departure-control database encrypted and a ransom note, with airports reporting simultaneous ' +
          'inability to board.',
        contain:
          'Departure control is recovered from offline backups, flights dispatched under a manual contingency ' +
          'process at a severe rate penalty during recovery, and a major incident declared because passenger ' +
          'flow must be managed physically across the network.',
      },
    },
  ],
});

/**
 * A stock exchange, and the market-integrity problem.
 *
 * The distinguishing feature is that the asset is a fair, orderly and continuous
 * market. The crown is the matching engine, and the objective is not to steal
 * data but to halt trading or bias the matching, either of which damages
 * confidence in the market itself. Blue is defending an abstraction, the
 * integrity of price formation, as much as a system.
 */
export const EXCHANGE_CARDINAL = definePositional({
  id: 'bd-exchange-cardinal',
  title: 'Order Book: Cardinal Exchange',
  brief:
    'Seven systems, two defences, ten rounds. Red is not after data; it is after the matching engine, ' +
    'to halt trading or bias how orders match. The asset is a fair, orderly, continuous market, and ' +
    'an attack on it is an attack on confidence in price formation itself.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['market', 'matching', 'order', 'trading', 'halt', 'integrity', 'latency', 'confidence'],
  dossier: {
    org: 'Cardinal Exchange',
    summary:
      'A securities exchange operating a central matching engine, market-data feeds and clearing ' +
      'connectivity. Members connect over low-latency links, and the market’s value is its fairness ' +
      'and continuity. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Matching engine, 10.123.6.10 (crown)' },
      { k: 'Trading network', v: '10.123.6.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Asset', v: 'A fair, orderly, continuous market' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'memberportal',
      label: 'Member portal',
      note: 'members.cardinal.example, 192.0.2.55. Where trading members manage connectivity.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'A member firm credential, reused and found in a breach corpus, gets you in as a legitimate ' +
          'participant. From a member’s access you can see connectivity configuration and reach further into ' +
          'the trading estate.',
        detect:
          'Authentication anomalies for member accounts, and portal actions inconsistent with the member’s ' +
          'normal pattern.',
        evidence:
          'A member login from an unfamiliar address making connectivity changes the firm did not request.',
        contain:
          'The account is reset, MFA enforced for member access, and recent configuration changes reviewed.',
      },
    },
    {
      id: 'gateway',
      label: 'Order gateway',
      note: 'GW01, 10.123.6.30. Accepts member orders into the exchange.',
      technique: 'T1499.004 Endpoint Denial of Service: Application or System Exploitation',
      flavour: {
        compromise:
          'The order gateway is the mouth of the market. Flooding or exploiting it to degrade order acceptance ' +
          'creates an uneven playing field, where some participants can trade and others cannot, which is a ' +
          'fairness failure even without touching the matching engine.',
        detect:
          'Latency and acceptance monitoring per member, and alerting on any asymmetry in order handling or ' +
          'gateway degradation.',
        evidence:
          'Order acceptance latency spiking for a subset of members under crafted load from an internal host.',
        contain:
          'The gateway is failed over, the source isolated, and affected members compensated per market rules ' +
          'while fairness is restored.',
      },
    },
    {
      id: 'marketdata',
      label: 'Market data feed',
      note: 'MD01, 10.123.6.40. Publishes prices and depth to members.',
      technique: 'T1565.002 Data Manipulation: Transmitted Data Manipulation',
      flavour: {
        compromise:
          'The market-data feed is the market’s shared reality: the prices and depth everyone trades on. ' +
          'Manipulating it, even briefly, causes participants to make decisions on false information, which ' +
          'is a subtle and serious integrity attack.',
        detect:
          'Cross-checking the published feed against the matching engine’s internal book, and alerting on any ' +
          'divergence between what the market sees and what actually matched.',
        evidence:
          'Published prices diverging from the matching engine’s book for a set of instruments.',
        contain:
          'The feed is corrected from the authoritative book, the affected window flagged to members, and the ' +
          'feed path integrity restored.',
      },
    },
    {
      id: 'surveillance',
      label: 'Market surveillance',
      note: 'SURV01, 10.123.6.50. Watches for manipulation and abuse.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'Surveillance is how the exchange detects manipulation. Blinding it lets abusive trading or an ' +
          'integrity attack proceed unseen, which is the enabling step for a larger market-manipulation play.',
        detect:
          'Heartbeat monitoring of the surveillance pipeline from an independent system, and alerting on any ' +
          'change to its rules or coverage.',
        evidence:
          'Surveillance rules narrowed and its alert output going quiet during a period of unusual trading.',
        contain:
          'Surveillance is restored from configuration control, the quiet window reconstructed and reviewed, ' +
          'and its configuration protected from tampering.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.123.6.5. Exchange staff identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Domain admin over the exchange estate puts the matching engine and surveillance both within reach. ' +
          'DCSync takes the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a trading-operations workstation at 03:00.',
        contain:
          'The account is disabled, krbtgt reset twice, and the trading network moved onto its own identity ' +
          'plane.',
      },
    },
    {
      id: 'clearing',
      label: 'Clearing connectivity',
      note: 'CLR01, 10.123.6.60. Links executed trades to the clearing house.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Clearing connectivity carries executed trades onward for settlement. Corrupting it can leave trades ' +
          'unmatched between the exchange and clearing, creating settlement risk and uncertainty about who ' +
          'owes what, which is a slower but serious integrity failure.',
        detect:
          'Reconciliation between executed trades and the clearing feed, with alerting on any mismatch.',
        evidence:
          'Executed trades altered or dropped between the matching engine and the clearing feed.',
        contain:
          'The clearing feed is reconciled against the authoritative execution record, discrepancies resolved ' +
          'before settlement, and the connectivity integrity restored.',
      },
    },
    {
      id: 'matching',
      label: 'Matching engine',
      note: 'ME01, 10.123.6.10. Matches every buy and sell order. The objective.',
      crown: true,
      technique: 'T1499 Endpoint Denial of Service',
      flavour: {
        compromise:
          'You reach the matching engine unseen. Halting it stops the entire market, and every second of ' +
          'unscheduled outage is a hit to confidence in the venue. Biasing it, so that certain orders match ' +
          'ahead of others, is worse still: it breaks the fairness that is the exchange’s whole reason to ' +
          'exist. The asset here is an abstraction, an orderly market, and its loss is measured in trust ' +
          'rather than in stolen records, which is the lesson of defending a market rather than a database.',
        detect:
          'Availability and integrity monitoring on the matching engine, fairness checks on match ordering ' +
          'against the price-time priority rules, and a rehearsed, orderly halt-and-reopen procedure.',
        evidence:
          'The matching engine halting under crafted input, or matches occurring out of price-time priority ' +
          'for a set of orders.',
        contain:
          'Trading is halted in an orderly, pre-planned way rather than crashing, the engine restored and its ' +
          'matching verified against the rules, affected trades handled under market procedures, and members ' +
          'and the regulator informed. An orderly halt protects confidence; a disorderly one destroys it.',
      },
    },
  ],
});

/**
 * A multi-tenant SaaS provider, and the tenant-isolation problem.
 *
 * The distinguishing feature is that the entire product is the promise that many
 * customers share one system without ever reaching each other's data. The crown
 * is the isolation boundary itself, and the lesson is that a single flaw in it is
 * simultaneously every customer's breach, delivered without touching any one
 * customer directly.
 */
export const SAAS_FATHOM = definePositional({
  id: 'bd-saas-fathom',
  title: 'Tenant Line: Fathom CRM',
  brief:
    'Seven systems, two defences, ten rounds. Fathom’s whole product is that thousands of companies ' +
    'share one system and never touch each other’s data. Red wants the isolation boundary itself, ' +
    'because one flaw in it is every customer’s breach at once, with no single customer attacked.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['tenant', 'isolation', 'boundary', 'shared', 'customer', 'saas', 'cross-tenant', 'scope'],
  dossier: {
    org: 'Fathom CRM',
    summary:
      'A software-as-a-service customer-relationship platform serving thousands of business tenants ' +
      'from shared infrastructure. Tenant isolation is enforced in the application and the data ' +
      'layer, and it is the product’s core promise. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Tenant isolation layer, 10.124.7.10 (crown)' },
      { k: 'Platform network', v: '10.124.7.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Shared', v: 'Thousands of business tenants on one system' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'app',
      label: 'Application front end',
      note: 'app.fathom.example, 198.51.100.45. Where every tenant’s users sign in and work.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'A flaw in the shared application front end gives a foothold in the tenant of your own account, and ' +
          'a vantage point to probe how the platform separates tenants. It is the natural starting point ' +
          'because you can sign up as a customer legitimately.',
        detect:
          'The application tier spawning unexpected processes, and requests that manipulate tenant identifiers ' +
          'in unexpected ways.',
        evidence:
          'The application spawning a shell, or requests carrying tenant identifiers other than the ' +
          'authenticated one.',
        contain:
          'The app is patched and rebuilt, tenant-identifier handling reviewed, and the front end segmented ' +
          'from the isolation layer.',
      },
    },
    {
      id: 'api',
      label: 'Public API',
      note: 'API01, 10.124.7.30. Programmatic access, scoped per tenant by token.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'The API scopes each caller to their tenant by token. An insecure direct object reference, where ' +
          'changing an identifier returns another tenant’s record, is the classic cross-tenant flaw, and it ' +
          'is invisible to a scanner because each request is individually well-formed.',
        detect:
          'Authorization monitoring on the API: any request where the resource’s tenant does not match the ' +
          'token’s tenant, which should be impossible and is therefore a clean alert.',
        evidence:
          'API responses returning records whose tenant identifier differs from the authenticated caller’s.',
        contain:
          'The endpoint is fixed to enforce tenant scope server-side, the flaw’s exploitation window reviewed ' +
          'for what was accessed, and authorization tests added.',
      },
    },
    {
      id: 'search',
      label: 'Shared search index',
      note: 'SRCH01, 10.124.7.40. A search index across tenant data.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'A shared search index is a common place for tenant isolation to leak, because indexing is done once ' +
          'across everyone and the tenant filter is applied at query time. A missing or bypassable filter ' +
          'returns other tenants’ data in search results.',
        detect:
          'Query auditing on the search service for results whose tenant does not match the querying tenant, ' +
          'and validation that the tenant filter is enforced at index rather than only at display.',
        evidence:
          'Search results returning documents belonging to tenants other than the one making the query.',
        contain:
          'The tenant filter is enforced at the index level, the index rebuilt with per-tenant separation, and ' +
          'the exposure assessed.',
      },
    },
    {
      id: 'db',
      label: 'Shared database',
      note: 'DB01, 10.124.7.50. Tenant data separated by a tenant column, one schema.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'Many SaaS platforms separate tenants by a column in a shared schema rather than by database. A query ' +
          'path that forgets the tenant predicate, or a compromised application credential with no tenant ' +
          'scope, reads across all of them at once.',
        detect:
          'Row-level security enforced in the database itself, and monitoring for any query lacking a tenant ' +
          'predicate or spanning multiple tenants.',
        evidence:
          'A query without a tenant filter returning rows across many tenants, from an application session.',
        contain:
          'Row-level security is enforced at the database, application credentials scoped per tenant where ' +
          'possible, and the query paths audited.',
      },
    },
    {
      id: 'ad',
      label: 'Platform identity',
      note: 'DC01, 10.124.7.5. Fathom staff and service identity.',
      technique: 'T1552.001 Unsecured Credentials: Credentials In Files',
      flavour: {
        compromise:
          'A platform service credential with broad, cross-tenant reach, left in a configuration file or repo, ' +
          'is a skeleton key: it is trusted by the platform to act across tenants for legitimate operational ' +
          'reasons, and in the wrong hands it ignores the isolation entirely.',
        detect:
          'Secret scanning across repositories and configuration, and alerting on any use of a cross-tenant ' +
          'service credential from outside the sanctioned operational path.',
        evidence:
          'A cross-tenant service credential found in a repository and then used from a host that is not an ' +
          'operations host.',
        contain:
          'The credential is rotated, secret scanning enforced in the pipeline, and cross-tenant credentials ' +
          'replaced with narrowly scoped, short-lived ones.',
      },
    },
    {
      id: 'logging',
      label: 'Audit and monitoring',
      note: 'LOG01, 10.124.7.60. The record of cross-tenant access, if anyone reads it.',
      technique: 'T1562.008 Impair Defenses: Disable or Modify Cloud Logs',
      flavour: {
        compromise:
          'The audit trail is what would reveal a cross-tenant access after the fact, for Fathom and for its ' +
          'customers. Filtering your own activity out of it makes an isolation breach invisible to everyone ' +
          'downstream, turning a contained incident into a silent one.',
        detect:
          'Alerting on any logging configuration change, with the trail delivered to a separate account the ' +
          'platform’s own principals cannot reach.',
        evidence:
          'The audit pipeline modified to exclude a principal, and a gap in delivery to the archive account.',
        contain:
          'Logging is restored from the separate account, the gap reconstructed, log configuration protected ' +
          'from platform roles, and customers given the data to audit their own tenants.',
      },
    },
    {
      id: 'isolation',
      label: 'Tenant isolation layer',
      note: 'ISO01, 10.124.7.10. Enforces that no tenant can reach another’s data. The objective.',
      crown: true,
      technique: 'T1548 Abuse Elevation Control Mechanism',
      flavour: {
        compromise:
          'You defeat the tenant isolation layer unseen: the control that is the platform’s entire promise. ' +
          'From one legitimately created account you can now read and act across thousands of unrelated ' +
          'companies’ data, and you never attacked any of them directly. Every customer made a reasonable ' +
          'decision to trust the boundary, and none of them could have defended against a flaw in it from ' +
          'their side. This is the multi-tenant lesson in its purest form: the isolation boundary is the ' +
          'product, and a single defect in it is simultaneously everyone’s breach.',
        detect:
          'Continuous authorization testing of the isolation boundary, monitoring for any access whose tenant ' +
          'scope crosses a line, and treating cross-tenant reads as a never-event with a hard alert.',
        evidence:
          'A single session reading or acting across many tenants through a bypass of the isolation control, ' +
          'with no legitimate cross-tenant operation behind it.',
        contain:
          'The isolation flaw is closed, the platform is assessed for what was accessed across which tenants, ' +
          'every affected customer is notified because they could not have seen this themselves, and the ' +
          'boundary is re-verified with automated tests before the all-clear. Honesty to customers is central, ' +
          'since the breach was of the very promise they bought.',
      },
    },
  ],
});
