/**
 * Board scenarios: connected urban and logistics infrastructure.
 *
 * Three estates where the network runs something the public moves through or
 * depends on to move, and the consequence of losing the board is felt across a
 * city or a region.
 *
 * The cable-landing board is the connectivity-chokepoint problem: a handful of
 * physical sites carry a nation's internet, so the crown is the optical transport
 * that a whole region's traffic passes through. The traffic-control board is the
 * urban-disruption problem: a city's signals are a control network, and gridlock
 * is a weapon that also blocks emergency response. The charging-network board is
 * the consumer-physical-plus-payment problem: dispensers people plug into, a
 * payment system, and a grid load, all managed from one platform.
 *
 * Same standard as the rest: every system names its ATT&CK technique (ICS ids
 * where the objective is physical), and the four outcome lines carry the method,
 * the detection logic, the artefact and the containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * A submarine cable landing station, and the connectivity-chokepoint problem.
 *
 * The lesson is that a nation's internet reaches it through a few physical
 * landing sites, so a small, unglamorous facility is a single point of failure
 * for a whole region's connectivity. The crown is the optical transport
 * management, because taking it down or degrading it severs or throttles
 * everything routed through it.
 */
export const CABLE_FARHAVEN = definePositional({
  id: 'bd-cable-farhaven',
  title: 'Landing Point: Farhaven Cable',
  brief:
    'Six systems, two defences, nine rounds. A nation’s internet reaches it through a handful of ' +
    'physical landing stations. Red wants the optical transport management at one of them, because ' +
    'a whole region’s traffic passes through it, and it is a small, quiet building nobody thinks about.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['cable', 'landing', 'optical', 'transport', 'connectivity', 'chokepoint', 'region', 'capacity'],
  dossier: {
    org: 'Farhaven Cable Landing',
    summary:
      'A submarine cable landing station carrying a large share of a region’s international internet ' +
      'connectivity. Optical transport equipment is managed over a network that connects to corporate ' +
      'IT through a management gateway. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Optical transport management, 172.18.6.10 (crown)' },
      { k: 'Transport network', v: '172.18.6.0/24' },
      { k: 'Corporate', v: '10.129.1.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate IT',
      note: 'Office network, 10.129.1.0/24. Email, provisioning, capacity planning.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'A reused operations credential still valid and without multi-factor. From corporate you can reach ' +
          'the transport network over the management path, which is the route to the optical gear.',
        detect:
          'Authentication anomalies for operations accounts, and any corporate-to-transport session outside a ' +
          'maintenance window.',
        evidence:
          'An operations login from an unfamiliar address, then a connection toward the transport network.',
        contain:
          'The account is reset, MFA enforced, and corporate-to-transport access restricted to a scheduled ' +
          'process.',
      },
    },
    {
      id: 'gateway',
      label: 'Management gateway',
      note: 'GW01, 172.18.6.60. The controlled path into the transport network.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise:
          'The management gateway is the boundary, with a vendor remote-support path left without ' +
          'multi-factor. Taking it puts you on the network that manages the optical transport.',
        detect:
          'Gateway authentication without an MFA event, and sessions outside scheduled maintenance.',
        evidence:
          'A gateway session at 02:20 via the vendor path, from a corporate host.',
        contain:
          'The vendor path is closed, MFA enforced on every route, and the gateway rebuilt.',
      },
    },
    {
      id: 'dcim',
      label: 'Facility management',
      note: 'DCIM01, 172.18.6.30. Power, cooling and physical access for the station.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The facility management system holds the layout, power and access details of the station. It is ' +
          'reconnaissance for a physical or environmental attack on a site that, being small and remote, is ' +
          'often lightly staffed.',
        detect:
          'Bulk export of facility records by an account outside the operations team, and access to physical ' +
          'layout data by non-operations staff.',
        evidence:
          'A full export of station layout, power and access data by a corporate account with no operations ' +
          'role.',
        contain:
          'Facility access is scoped to operations and the layout treated as sensitive targeting material.',
      },
    },
    {
      id: 'monitoring',
      label: 'Network monitoring',
      note: 'NMS01, 172.18.6.40. Watches optical health and capacity.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'The monitoring system is how operations knows the cable is healthy. Blinding it lets a degradation ' +
          'or a configuration change proceed unseen until customers across the region notice the outage ' +
          'themselves.',
        detect:
          'Heartbeat monitoring of the monitoring pipeline from an independent system, and alerting on any ' +
          'change to its coverage.',
        evidence:
          'Optical alarms suppressed and the capacity dashboard held quiet during a configuration change.',
        contain:
          'Monitoring is restored from configuration control, an independent view stood up, and recent ' +
          'transport changes reviewed.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.129.1.5. Staff identity, which governs transport access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the transport network, so the directory is one hop from the optical ' +
          'management. Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an operations workstation at 02:50.',
        contain:
          'The account is disabled, krbtgt reset twice, and the transport network separated onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'transport',
      label: 'Optical transport management',
      note: 'OTN01, 172.18.6.10. Manages the wavelengths carrying regional traffic. The objective.',
      crown: true,
      technique: 'T0855 Unauthorized Command Message',
      flavour: {
        compromise:
          'You reach the optical transport management unseen and can shut down wavelengths or degrade the ' +
          'links carrying a large share of a region’s international connectivity. From one small, quiet ' +
          'building you sever or throttle the internet for millions of people and every business and service ' +
          'that depends on it, and there is no quick physical workaround for a cut of this scale. This is the ' +
          'connectivity-chokepoint lesson: a handful of unremarkable sites are national infrastructure, and ' +
          'their obscurity is not protection.',
        detect:
          'Configuration integrity monitoring on the transport equipment, protocol-aware monitoring for any ' +
          'management command from a source that is not the operations console, and capacity monitoring ' +
          'independent of the primary system.',
        evidence:
          'Wavelength shutdown or reconfiguration commands from the management gateway rather than the ' +
          'operations console, with the monitoring dashboard held quiet.',
        contain:
          'Transport configuration is restored from the signed baseline, the management network isolated, ' +
          'traffic rerouted to alternate cables where capacity allows, and the national communications ' +
          'authority engaged because the outage is regional.',
      },
    },
  ],
});

/**
 * A city traffic management system, and the urban-disruption problem.
 *
 * The lesson is that a city's signals are a control network at street scale, and
 * coordinated manipulation causes gridlock that is both an economic weapon and a
 * blocker of emergency response. The crown is the central traffic management
 * system, because it commands the signals across the whole city at once.
 */
export const TRAFFIC_VERHOLT = definePositional({
  id: 'bd-traffic-verholt',
  title: 'Gridlock: Verholt City Traffic',
  brief:
    'Seven systems, two defences, ten rounds. A city’s traffic signals are a control network at ' +
    'street scale. Red wants the central management system, because coordinated gridlock is an ' +
    'economic weapon that also blocks ambulances and fire crews. Blue is defending the flow of a ' +
    'whole city.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['traffic', 'signal', 'intersection', 'gridlock', 'emergency', 'city', 'coordinated', 'physical'],
  dossier: {
    org: 'Verholt City Traffic',
    summary:
      'A city transport authority running thousands of signalised intersections from a central ' +
      'traffic management centre, with emergency-vehicle preemption and public-transport priority. ' +
      'The control network connects to corporate IT. Simulated throughout: no signal is actually ' +
      'commanded.',
    facts: [
      { k: 'Objective', v: 'Traffic management centre, 172.19.7.10 (crown)' },
      { k: 'Signal network', v: '172.19.7.0/24' },
      { k: 'Corporate', v: '10.130.1.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate IT',
      note: 'Office network, 10.130.1.0/24. Email, planning, asset management.',
      technique: 'T1566.001 Phishing: Spearphishing Attachment',
      flavour: {
        compromise:
          'A transport planner opens a document posing as a works notice. The macro loads a foothold. The ' +
          'signals are untouched; this phase is for finding the route into the control network.',
        detect:
          'Office spawning a scripting host on a planning endpoint, and beacons to newly registered domains.',
        evidence:
          'A macro-enabled works notice opened at 09:10, followed by an encoded PowerShell command and a ' +
          'beacon.',
        contain:
          'The host is isolated and reimaged, credentials reset, and macros blocked from internet documents.',
      },
    },
    {
      id: 'gateway',
      label: 'Control gateway',
      note: 'GW01, 172.19.7.60. The controlled path into the signal network.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise:
          'The control gateway is the boundary, with a maintenance path left without multi-factor. Taking it ' +
          'puts you on the network that commands the signals.',
        detect:
          'Gateway authentication without an MFA event, and sessions outside scheduled maintenance.',
        evidence:
          'A gateway session at 02:10 via the maintenance path, from a corporate host.',
        contain:
          'The maintenance path is closed, MFA enforced, and the gateway rebuilt.',
      },
    },
    {
      id: 'controllers',
      label: 'Intersection controllers',
      note: 'Field controllers, 172.19.7.30. Run individual signalised intersections.',
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'Field controllers run individual intersections, and many are old with weak or default credentials ' +
          'reachable over the network. Manipulating a handful causes local chaos; the value is as a staging ' +
          'point and a demonstration before going for the central system.',
        detect:
          'Protocol monitoring for timing or configuration writes to controllers from unexpected sources, and ' +
          'alarms on conflicting or unsafe signal states.',
        evidence:
          'Signal timing changed on several controllers from the control gateway rather than the management ' +
          'centre.',
        contain:
          'Affected controllers are reverted to their approved timing plans or put on local fixed-time ' +
          'operation, and the control network reviewed.',
      },
    },
    {
      id: 'preemption',
      label: 'Emergency preemption',
      note: 'PREEMPT01, 172.19.7.40. Gives green to emergency vehicles on demand.',
      technique: 'T0855 Unauthorized Command Message',
      flavour: {
        compromise:
          'Emergency preemption clears a path for ambulances and fire crews. Abusing it to trigger false ' +
          'preemptions disrupts traffic, and suppressing legitimate ones directly delays emergency response, ' +
          'which turns a traffic attack into a public-safety one.',
        detect:
          'Auditing of preemption events against dispatch records, and alerting on preemptions with no ' +
          'corresponding emergency call or on suppressed legitimate requests.',
        evidence:
          'Preemption events with no matching dispatch, or legitimate preemption requests failing during an ' +
          'emergency call.',
        contain:
          'Preemption is reverted to verified operation, emergency services notified to expect manual routing, ' +
          'and the system integrity restored.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.130.1.5. Staff identity, which governs control access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the control network, so the directory is one hop from the management ' +
          'centre. Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a planning workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and the control network separated onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'monitoring',
      label: 'Operations display',
      note: 'TMC-HMI, 172.19.7.50. What the traffic operator watches across the city.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'The operations display is the operator’s view of the whole city’s flow. Holding it at normal while ' +
          'signals are manipulated means the operator does not intervene until the gridlock is reported by the ' +
          'public and the emergency services.',
        detect:
          'Cross-checking the display against independent traffic sensors and camera feeds, and alerting on ' +
          'divergence.',
        evidence:
          'The operations display showing normal flow while independent sensors show intersections locking up.',
        contain:
          'Operators rely on independent sensors and cameras, treat the display as untrusted, and dispatch ' +
          'staff to key intersections.',
      },
    },
    {
      id: 'tmc',
      label: 'Traffic management centre',
      note: 'TMC01, 172.19.7.10. Commands signals across the whole city. The objective.',
      crown: true,
      technique: 'T0855 Unauthorized Command Message',
      flavour: {
        compromise:
          'You reach the central traffic management system unseen and can command signals across the whole ' +
          'city at once: hold key arteries red, force conflicting phases into gridlock, and defeat emergency ' +
          'preemption everywhere. A modern city depends utterly on the coordinated flow of its signals, and ' +
          'engineered gridlock is both an economic weapon that costs millions an hour and a public-safety one ' +
          'that traps ambulances and fire crews. It is a physical, city-scale consequence delivered from a ' +
          'control room.',
        detect:
          'Command auditing on the management system with approval and rate limits on mass signal changes, ' +
          'safety interlocks in the field controllers that refuse conflicting phases, and independent traffic ' +
          'monitoring.',
        evidence:
          'City-wide signal timing changes issued from the management centre with no approval, timed to a peak ' +
          'period, with the operations display held steady.',
        contain:
          'The management system is isolated and signals reverted to safe local fixed-time operation across ' +
          'the city, emergency services are told to route manually, and control is restored only through a ' +
          'verified, approval-gated path.',
      },
    },
  ],
});

/**
 * An electric-vehicle charging network, and the consumer-physical-plus-payment
 * problem.
 *
 * The distinguishing feature is that the estate combines three attack surfaces
 * at once: physical dispensers the public plugs into, a payment system, and an
 * aggregate grid load. The crown is the charge-point management system, because
 * it commands thousands of chargers, and coordinated switching of that much load
 * is a grid event as well as a consumer-service one.
 */
export const CHARGE_VOLTMARK = definePositional({
  id: 'bd-charge-voltmark',
  title: 'Fast Charge: Voltmark Charging',
  brief:
    'Seven systems, two defences, ten rounds. Voltmark runs a national fast-charging network: public ' +
    'dispensers, a payment system, and an aggregate grid load, all from one platform. Red wants the ' +
    'charge-point management system, because commanding thousands of chargers at once is a grid event ' +
    'as much as a consumer one.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['charger', 'ocpp', 'payment', 'grid', 'load', 'dispenser', 'fleet', 'coordinated'],
  dossier: {
    org: 'Voltmark Charging',
    summary:
      'An operator of a national network of public fast chargers, managed from a cloud platform that ' +
      'handles sessions, payment and firmware. The chargers are a significant aggregate grid load. ' +
      'Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Charge-point management system, 10.131.4.10 (crown)' },
      { k: 'Management network', v: '10.131.4.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Fleet', v: 'Thousands of public fast chargers, an aggregate grid load' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'app',
      label: 'Driver app and payment',
      note: 'app.voltmark.example, 192.0.2.35. Consumer accounts and stored payment.',
      technique: 'T1110.004 Brute Force: Credential Stuffing',
      flavour: {
        compromise:
          'Credential stuffing against consumer accounts with stored payment details. A small success rate ' +
          'against a large base yields thousands of accounts to abuse for free charging or payment fraud, the ' +
          'ordinary consumer-platform attack.',
        detect:
          'Distributed login failures across accounts from a rotating address pool, and logins from devices ' +
          'with no history for the account.',
        evidence:
          'A large run of login attempts across many accounts with a small success rate, from a proxy pool, ' +
          'followed by charging sessions in unusual locations.',
        contain:
          'Compromised accounts are locked and reset, credential-stuffing protection added, and step-up ' +
          'verification required for payment changes.',
      },
    },
    {
      id: 'api',
      label: 'Charger connectivity API',
      note: 'api.voltmark.example, 192.0.2.45. Where chargers connect and report (OCPP).',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'The connectivity API is internet-facing so chargers everywhere can connect. A flaw here gives a ' +
          'foothold in the platform and a view of the whole fleet, which is reconnaissance for a coordinated ' +
          'command.',
        detect:
          'The API tier spawning unexpected processes, and egress from it to anywhere that is not the ' +
          'management datastore.',
        evidence:
          'The connectivity service spawning a shell, with a crafted request against the charger protocol ' +
          'endpoint.',
        contain:
          'The API is patched and rebuilt, its tier segmented from the management platform, and fleet command ' +
          'frozen pending review.',
      },
    },
    {
      id: 'firmware',
      label: 'Charger firmware',
      note: 'FW01, 10.131.4.30. Signed dispenser firmware, staged for rollout.',
      technique: 'T1195.002 Supply Chain Compromise: Software Supply Chain',
      flavour: {
        compromise:
          'Firmware governs how each dispenser behaves, including its interaction with the grid and the ' +
          'vehicle. Tampering with a staged build, or reaching the signing step, would roll malicious ' +
          'behaviour out to the whole fleet, the most durable form of the attack.',
        detect:
          'Signed firmware, reproducible builds, and hash verification between the repository and signing.',
        evidence:
          'A firmware build whose hash does not match an independent rebuild, in the grid-interaction module, ' +
          'with no source change.',
        contain:
          'The build is quarantined, the pipeline rebuilt, reproducible verification added as a gate, and the ' +
          'grid operator informed of potential fleet exposure.',
      },
    },
    {
      id: 'payment',
      label: 'Payment processing',
      note: 'PAY01, 10.131.4.40. Clears charging-session payments.',
      technique: 'T1074.001 Data Staged: Local Data Staging',
      flavour: {
        compromise:
          'The payment system holds and processes stored card details for the whole customer base. Staging ' +
          'that data toward exfiltration is a straightforward payment-data breach on top of the ' +
          'service-disruption potential of the fleet.',
        detect:
          'Mass access to payment records and staging of archives in unusual locations, plus egress anomaly ' +
          'monitoring.',
        evidence:
          'An archive of stored payment tokens assembled on a management host and prepared for transfer.',
        contain:
          'The staging host is isolated, the archive preserved, egress reviewed, and the card scheme and ' +
          'regulator notified.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.131.4.5. Staff identity, which governs platform access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the management platform, so the directory is one hop from fleet command. ' +
          'Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an engineering workstation at 02:30.',
        contain:
          'The account is disabled, krbtgt reset twice, and the management platform moved onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'monitoring',
      label: 'Fleet monitoring',
      note: 'MON01, 10.131.4.50. Operations view of charger and load state.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'Fleet monitoring is how operations knows the chargers are behaving. Suppressing its alerts lets a ' +
          'coordinated switching command run without the operator noticing until the grid effect appears.',
        detect:
          'Heartbeat monitoring of the monitoring pipeline from an independent system, so silence raises an ' +
          'alarm.',
        evidence:
          'Fleet alert thresholds widened and the dashboard held quiet during a command sequence.',
        contain:
          'Monitoring is restored, an independent view stood up, and recent fleet commands reviewed.',
      },
    },
    {
      id: 'cpms',
      label: 'Charge-point management system',
      note: 'CPMS01, 10.131.4.10. Commands and updates every charger. The objective.',
      crown: true,
      technique: 'T0855 Unauthorized Command Message',
      flavour: {
        compromise:
          'You reach the charge-point management system unseen and can command thousands of chargers at once: ' +
          'start or stop them in unison, or cycle them to swing a large aggregate load on and off the grid ' +
          'together. Beyond stranding drivers nationwide, a coordinated switching of that much load is a ' +
          'genuine grid-stability event, which is why aggregated EV charging is increasingly treated as grid ' +
          'infrastructure rather than a consumer service. The board combines physical dispensers, payment, and ' +
          'grid load in one crown, and that convergence is the lesson.',
        detect:
          'Command auditing on the management system with approval and rate limits on mass commands, and ' +
          'coordination with the grid operator on any large planned load change.',
        evidence:
          'A fleet-wide start or stop command issued through the management system with no approval, timed to ' +
          'a period of grid stress.',
        contain:
          'The management system is isolated and fleet command severed, the grid operator notified so it can ' +
          'prepare reserves, and command restored only through a verified, rate-limited, approval-gated path.',
      },
    },
  ],
});
