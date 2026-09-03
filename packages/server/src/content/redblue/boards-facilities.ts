/**
 * Board scenarios: physical facilities.
 *
 * Three estates whose defining property is that the network runs a BUILDING or a
 * PROCESS, so the consequence of losing the board is felt in the physical world
 * of the people inside it, and containment has to reckon with the fact that you
 * cannot simply switch the thing off.
 *
 * The colocation board is about the multi-tenant facility: one data centre hosts
 * many companies, and the shared control is power and cooling, so an attack on
 * the building management is an attack on everyone racked in it. The smart-tower
 * board is about life-safety convergence: when fire, smoke control, lifts and
 * door access all sit on the automation network, a cyber intrusion becomes a
 * building-safety event. The food-plant board is about process integrity as food
 * safety: the crown is the control that guarantees pasteurisation, and defeating
 * it ships unsafe product while every dashboard reads normal.
 *
 * Same standard as the rest: every system names its ATT&CK technique (ICS ids
 * where the objective is physical), and the four outcome lines carry the method,
 * the detection logic, the artefact and the containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * A colocation data centre, and the shared-facility problem.
 *
 * The lesson is that a data centre is a multi-tenant building whose common
 * services, power and cooling, are a single point of failure for everyone racked
 * in it. The crown is the building management system, not any tenant's servers,
 * because taking the cooling down takes every tenant down at once, and the
 * customers never chose the facility's risk.
 */
export const COLO_KEYSTONE = definePositional({
  id: 'bd-colo-keystone',
  title: 'Shared Floor: Keystone Colocation',
  brief:
    'Seven systems, two defences, ten rounds. Keystone racks servers for two hundred companies. The ' +
    'objective is not any tenant’s data; it is the power and cooling that all of them depend on. An ' +
    'attack on the building is an attack on everyone in it.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['cooling', 'power', 'facility', 'tenant', 'environmental', 'bms', 'shared', 'physical'],
  dossier: {
    org: 'Keystone Colocation',
    summary:
      'A colocation provider hosting servers for about 200 customers across a single facility. Power, ' +
      'cooling and physical access are common services run on a building management network that is ' +
      'poorly separated from the corporate estate. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Building management system, 172.28.2.10 (crown)' },
      { k: 'Facility network', v: '172.28.2.0/24' },
      { k: 'Corporate', v: '10.115.1.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'portal',
      label: 'Customer portal',
      note: 'portal.keystone.example, 198.51.100.25. Where tenants request remote hands and access.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'An injection in the remote-hands ticketing app gives a foothold as the web service. Tenants trust ' +
          'this portal to manage physical access to their own cages, which is why a foothold here reaches ' +
          'further than a normal web app.',
        detect:
          'The portal process spawning a shell, and egress from the web tier to the facility network, which no ' +
          'legitimate flow uses.',
        evidence:
          'The portal application server spawning a command interpreter, with a crafted request in the logs ' +
          'against the ticketing endpoint.',
        contain:
          'The portal is taken offline and rebuilt, the web tier segmented away from the facility network, and ' +
          'tenant access requests frozen and reviewed.',
      },
    },
    {
      id: 'access',
      label: 'Physical access control',
      note: 'ACS01, 172.28.2.30. Doors, cages and man-traps across the floor.',
      technique: 'T1098 Account Manipulation',
      flavour: {
        compromise:
          'Issuing yourself a badge with floor access turns a network intrusion into standing in front of ' +
          'other companies’ racks. In a colocation facility, physical access to a tenant cage is access to ' +
          'their servers, full stop.',
        detect:
          'Badge issuance auditing against the customer authorisation system, with any credential granted ' +
          'without a matching authorised request treated as critical.',
        evidence:
          'Two floor-access badges issued overnight with no authorising customer request and no issuing ' +
          'officer signed in.',
        contain:
          'The badges are revoked, the floor swept, camera footage pulled, and badge issuance re-gated behind ' +
          'dual control and a verified customer request.',
      },
    },
    {
      id: 'dcim',
      label: 'DCIM',
      note: 'DCIM01, 172.28.2.40. Data-centre infrastructure management: power draw, capacity, layout.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The infrastructure management system is a complete map of who is racked where, drawing how much ' +
          'power, on which circuits. It is reconnaissance for a targeted physical or environmental attack, and ' +
          'it is quiet to take.',
        detect:
          'Bulk export of the DCIM records by any account outside the facilities team, and access to tenant ' +
          'layout data by non-operations staff.',
        evidence:
          'A full export of rack, power and tenant layout data by a corporate account with no facilities role.',
        contain:
          'DCIM access is scoped to operations, the layout data treated as sensitive, and the export reviewed ' +
          'as targeting reconnaissance.',
      },
    },
    {
      id: 'ups',
      label: 'Power and UPS control',
      note: 'PWR01, 172.28.2.50. Uninterruptible power and switchgear management.',
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'The power control system manages the UPS and switchgear that keep two hundred tenants running. ' +
          'Manipulating a transfer or tripping a bus is an outage for everyone downstream of it, delivered ' +
          'without touching a single server.',
        detect:
          'Protocol monitoring on the power network for configuration or control writes from any source that ' +
          'is not the facilities console, and alarms on unexpected transfer events.',
        evidence:
          'A configuration change to a UPS transfer threshold from a corporate host rather than the facilities ' +
          'console, outside any maintenance window.',
        contain:
          'The change is reverted from the signed configuration, the power network isolated from corporate, ' +
          'and the facility placed on manual power supervision until verified.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.115.1.5. Staff identity, which governs facility access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the facility network here, so the directory is one hop from building ' +
          'control. Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a principal that is not a domain controller.',
        evidence:
          'Directory replication requested from a facilities workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and the facility network separated onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'monitoring',
      label: 'Environmental monitoring',
      note: 'ENV01, 172.28.2.60. Temperature and humidity sensors across the floor.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Environmental monitoring is how operations knows the floor is within tolerance. Holding the ' +
          'displayed temperature steady while cooling is degraded lets a thermal event run until equipment ' +
          'trips, and by then it is a floor-wide outage rather than an alarm.',
        detect:
          'Cross-checking the monitoring display against independent sensor readings, and alerting on any ' +
          'divergence or on a suspiciously flat reading during a cooling change.',
        evidence:
          'Environmental monitoring reporting nominal temperatures while an independent sensor path shows a ' +
          'rise in a hot aisle.',
        contain:
          'Operations reverts to independent sensors, treats the monitoring layer as untrusted, and verifies ' +
          'the floor environment physically.',
      },
    },
    {
      id: 'bms',
      label: 'Building management system',
      note: 'BMS01, 172.28.2.10. Controls cooling for the whole facility. The objective.',
      crown: true,
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'You reach the building management system unseen and command the cooling. Within minutes the floor ' +
          'begins to overheat, and every one of two hundred tenants goes down together, regardless of how well ' +
          'each defended their own servers. This is the shared-facility lesson in one move: the customers ' +
          'inherited a risk they never chose, sitting in a building whose common services were the real ' +
          'attack surface.',
        detect:
          'Protocol-aware monitoring on the building automation network for setpoint and control writes from ' +
          'any source that is not the facilities console, and cooling telemetry treated as availability-critical ' +
          'for every tenant.',
        evidence:
          'Cooling setpoints driven out of range from the corporate side of the network, with the ' +
          'environmental display held steady to hide the rise.',
        contain:
          'Cooling is restored from the signed configuration and, where needed, run on manual local control, ' +
          'the automation network is isolated, and tenants are notified because the outage was facility-wide ' +
          'and outside their control.',
      },
    },
  ],
});

/**
 * A smart office tower, and the life-safety convergence problem.
 *
 * The lesson is that when fire detection, smoke control, lifts and door access
 * all sit on one building-automation network, a cyber intrusion is no longer an
 * IT incident, it is a building-safety incident. The crown is the life-safety
 * system, and Blue's containment has to weigh the fact that the wrong isolation
 * could disable the very systems that protect the people inside.
 */
export const TOWER_VANGUARD = definePositional({
  id: 'bd-tower-vanguard',
  title: 'Life Safety: Vanguard Tower',
  brief:
    'Six systems, two defences, nine rounds. A forty-storey office tower runs fire, smoke control, ' +
    'lifts and door access on one automation network. Red is working toward the life-safety system, ' +
    'and for Blue the hard part is that the wrong containment could disable what protects the people ' +
    'inside.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['building', 'fire', 'smoke', 'lift', 'access', 'safety', 'automation', 'physical'],
  dossier: {
    org: 'Vanguard Tower',
    summary:
      'A forty-storey commercial tower with several thousand occupants. Fire and smoke control, lifts, ' +
      'HVAC and door access run on a shared building-automation network, managed remotely by a ' +
      'facilities contractor. Simulated throughout: no command reaches any real building system.',
    facts: [
      { k: 'Objective', v: 'Life-safety controller, 172.29.3.10 (crown)' },
      { k: 'Automation network', v: '172.29.3.0/24' },
      { k: 'Corporate', v: '10.116.1.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'contractor',
      label: 'Facilities contractor',
      note: 'Remote building-management contractor with a persistent tunnel into the tower.',
      technique: 'T1199 Trusted Relationship',
      flavour: {
        compromise:
          'The building is managed by a contractor with an always-on remote tunnel and a security posture the ' +
          'building owner does not control. You attack the contractor and arrive inside the automation ' +
          'network. It is the same trusted-relationship path that has compromised so many building systems.',
        detect:
          'Contractor tunnel monitoring for sessions outside scheduled maintenance, and any contractor traffic ' +
          'toward the life-safety segment.',
        evidence:
          'A contractor session at 03:00 with no maintenance ticket, connecting toward the fire-control ' +
          'segment.',
        contain:
          'The contractor tunnel is cut, moved to just-in-time access with MFA, and scoped by firewall rule to ' +
          'the systems the contract actually covers.',
      },
    },
    {
      id: 'hvac',
      label: 'HVAC control',
      note: 'HVAC01, 172.29.3.30. Heating, ventilation and air handling.',
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'HVAC is the least alarming system on the network and a useful staging point: it is on the same ' +
          'automation bus as life-safety, it is rarely monitored for security, and manipulating airflow is a ' +
          'nuisance that draws attention away from the real objective.',
        detect:
          'Protocol monitoring on the automation bus for parameter writes from unexpected sources, and ' +
          'alarms on airflow settings outside normal bands.',
        evidence:
          'Air-handling parameters changed from the contractor tunnel outside a maintenance window.',
        contain:
          'Settings are restored, the automation bus segmented so HVAC cannot reach life-safety, and the ' +
          'source session isolated.',
      },
    },
    {
      id: 'access',
      label: 'Door access control',
      note: 'ACS01, 172.29.3.40. Controls doors, turnstiles and secure floors.',
      technique: 'T1098 Account Manipulation',
      flavour: {
        compromise:
          'Access control decides who can open which doors. Unlocking secure floors, or locking occupants out ' +
          'of an escape route, is both a physical intrusion and a safety hazard depending on which way you ' +
          'turn it.',
        detect:
          'Auditing of access-rule changes and credential issuance, with alerting on any door held unlocked or ' +
          'any escape route configuration change.',
        evidence:
          'An access rule changing overnight to unlock a secure floor, with no facilities request behind it.',
        contain:
          'The rule is reverted, the door secured, credentials audited, and access-rule changes gated behind ' +
          'approval.',
      },
    },
    {
      id: 'lifts',
      label: 'Lift control',
      note: 'LIFT01, 172.29.3.50. Elevator dispatch and control.',
      technique: 'T0855 Unauthorized Command Message',
      flavour: {
        compromise:
          'Lift control can strand occupants, disable firefighter recall, or send cars to the wrong floors. In ' +
          'a tall building the lifts are part of the evacuation and firefighting plan, so attacking them is a ' +
          'life-safety act, not merely an inconvenience.',
        detect:
          'Command monitoring on the lift controller for dispatch or mode changes from any source that is not ' +
          'the lift management console, especially firefighter-recall changes.',
        evidence:
          'A change to firefighter-recall behaviour issued from the automation network rather than the lift ' +
          'console.',
        contain:
          'Lift control is reverted to the certified configuration, the lift network isolated, and the lifts ' +
          'placed under manual and firefighter control until verified.',
      },
    },
    {
      id: 'monitoring',
      label: 'Building operations display',
      note: 'BMS-HMI, 172.29.3.60. What the building operator watches.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'The operations display is the building operator’s single view of the tower. Suppressing an alarm or ' +
          'faking a normal state means a developing fire or a disabled safety system goes unnoticed until it ' +
          'is discovered physically, which is far too late.',
        detect:
          'Cross-checking the display against the underlying panel states, and independent monitoring of the ' +
          'fire panel that does not depend on the building display.',
        evidence:
          'The operations display showing all systems normal while the fire panel reports a fault on two ' +
          'floors.',
        contain:
          'The operator reverts to the physical fire panel and independent indicators, treats the display as ' +
          'untrusted, and dispatches staff to verify affected floors.',
      },
    },
    {
      id: 'lifesafety',
      label: 'Life-safety controller',
      note: 'FIRE01, 172.29.3.10. Fire detection and smoke control. The objective.',
      crown: true,
      technique: 'T0880 Loss of Safety',
      flavour: {
        compromise:
          'You reach the life-safety controller unseen: fire detection and smoke control for the whole tower. ' +
          'Disabling detection, or sabotaging smoke control so it pressurises the wrong shafts, turns a ' +
          'survivable fire into a lethal one, and it can be done so that every dashboard still reads normal. ' +
          'This is the sharpest example in the catalogue of a cyber act with a direct, immediate threat to ' +
          'human life, and it is why building life-safety systems must be independently protected and ' +
          'independently verifiable.',
        detect:
          'Firmware and configuration integrity on the fire panel against the certified image, physical ' +
          'supervision that is independent of the automation network, and alarms on any life-safety ' +
          'configuration write.',
        evidence:
          'A configuration write to the smoke-control logic from the automation network, with detection zones ' +
          'silently disabled and the display held normal.',
        contain:
          'The building is moved to a manned fire watch immediately, the life-safety controller restored from ' +
          'the certified configuration and physically verified, and the fire authority and building regulator ' +
          'notified. Occupant safety takes precedence over every other consideration.',
      },
    },
  ],
});

/**
 * A dairy processing plant, and the food-safety-as-integrity problem.
 *
 * The lesson is that process control here does not run a service, it guarantees
 * a safety outcome: milk is safe because it was held at temperature for time. The
 * crown is the pasteurisation control, and defeating it ships unsafe product
 * while every dashboard reads normal, which makes integrity of the record the
 * whole battle.
 */
export const PLANT_ASHFORD = definePositional({
  id: 'bd-plant-ashford',
  title: 'Hold and Cool: Ashford Dairy',
  brief:
    'Six systems, two defences, nine rounds. The plant is safe because milk is held at temperature ' +
    'for a set time and the record proves it. Red wants the pasteurisation control. Defeating it ' +
    'ships unsafe product while the dashboards read normal, so the integrity of the record is the ' +
    'battle.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['pasteurise', 'process', 'safety', 'batch', 'integrity', 'temperature', 'record', 'recall'],
  dossier: {
    org: 'Ashford Dairy',
    summary:
      'A dairy processing plant producing pasteurised milk at scale. Safety depends on holding product ' +
      'at temperature for a validated time, recorded automatically for regulatory proof. The process ' +
      'network is separated from corporate by a firewall with exceptions. Simulated throughout.',
    facts: [
      { k: 'Objective', v: 'Pasteurisation control, 172.30.4.10 (crown)' },
      { k: 'Process network', v: '172.30.4.0/24' },
      { k: 'Corporate', v: '10.117.1.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate IT',
      note: 'Office network, 10.117.1.0/24. Orders, logistics, plant scheduling.',
      technique: 'T1566.001 Phishing: Spearphishing Attachment',
      flavour: {
        compromise:
          'A production scheduler opens a document that claims to be an order. The macro loads a foothold. The ' +
          'office is the entry point; the plant is the objective, and the operator spends this phase learning ' +
          'the process environment.',
        detect:
          'Office spawning a scripting host on a scheduler endpoint, and beacons to newly registered domains.',
        evidence:
          'A macro-enabled order document opened at 09:10, followed by an encoded PowerShell command and a ' +
          'connection to a fresh domain.',
        contain:
          'The host is isolated and reimaged, the scheduler credentials reset, and macros blocked from ' +
          'internet documents by policy.',
      },
    },
    {
      id: 'firewall',
      label: 'Process boundary firewall',
      note: 'FW-P, 172.30.4.60. Separates corporate from the process network. Exception-ridden.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise:
          'The process boundary is a firewall that has accumulated rules over a decade. A remote-support ' +
          'exception for the control vendor, without multi-factor, is your route across into the process ' +
          'network.',
        detect:
          'Boundary authentication without an MFA event, and any session crossing into the process network ' +
          'outside a maintenance window.',
        evidence:
          'A crossing into the process network at 02:20 via the vendor support rule, from a corporate host.',
        contain:
          'The rule is closed, boundary crossings restricted to a strict allowlist with MFA, and the process ' +
          'network reviewed for any command issued.',
      },
    },
    {
      id: 'mes',
      label: 'Manufacturing execution',
      note: 'MES01, 172.30.4.20. Batch records and production tracking.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The manufacturing execution system holds the batch records that prove each run met the safety hold. ' +
          'Altering them lets unsafe product pass as compliant, and because the record is the proof, corrupting ' +
          'it is as dangerous as corrupting the process.',
        detect:
          'Audit-trail integrity on batch records and reconciliation against the raw process data from the ' +
          'controllers, which regulated systems are required to retain.',
        evidence:
          'Batch temperature-hold records altered to show compliance, with no matching change in the raw ' +
          'controller history.',
        contain:
          'Records are restored from the validated backup, affected batches quarantined pending physical ' +
          'testing, and the audit gap documented for the regulator.',
      },
    },
    {
      id: 'hmi',
      label: 'Operator HMI',
      note: 'HMI01, 172.30.4.30. What the plant operator watches.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'The operator screen is the operator’s reality. Showing a safe hold temperature while the real ' +
          'process runs cool is how unsafe product passes an alert operator, exactly as manipulated views have ' +
          'masked physical attacks before.',
        detect:
          'Independent temperature telemetry compared against the HMI, and alerting on divergence between the ' +
          'display and the raw sensor path.',
        evidence:
          'The HMI showing the validated hold temperature while an independent probe reads several degrees ' +
          'below it.',
        contain:
          'The operator switches to independent readings and manual verification, treats the HMI as untrusted, ' +
          'and holds affected product.',
      },
    },
    {
      id: 'historian',
      label: 'Process historian',
      note: 'HIST01, 172.30.4.40. Records process data. Straddles both networks.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The historian bridges corporate and process to make data available for reporting, so owning it both ' +
          'reveals the process in detail and provides a path deeper in. It is the usual pivot in a plant ' +
          'network.',
        detect:
          'Firewall monitoring on the historian for sessions outside its data feeds, and integrity checks on ' +
          'the process records it stores.',
        evidence:
          'An outbound session from the historian into the process network on a port no feed uses.',
        contain:
          'The bridge is restricted to documented feeds, the historian rebuilt, and process data replicated ' +
          'out one-way so reporting does not need a path in.',
      },
    },
    {
      id: 'pasteuriser',
      label: 'Pasteurisation control',
      note: 'PAST01, 172.30.4.10. Enforces the temperature-and-time hold. The objective.',
      crown: true,
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'You reach the pasteurisation controller unseen and shorten the hold or lower the temperature ' +
          'setpoint while the recorded values are kept at target. Product that was never safely pasteurised ' +
          'ships as compliant, and the danger is discovered only when people fall ill, days later and far from ' +
          'the plant. This is food safety as a cyber consequence, and it is why the integrity of both the ' +
          'control and its record is the whole of the defence.',
        detect:
          'Protocol-aware monitoring for setpoint and logic writes from any source that is not the engineering ' +
          'terminal, and continuous reconciliation of the controller’s actual behaviour against the recorded ' +
          'hold.',
        evidence:
          'A setpoint or hold-time write to the pasteuriser from the historian rather than the engineering ' +
          'terminal, with the recorded values spoofed to hide it.',
        contain:
          'Production is stopped, the controller restored from the signed configuration, all product processed ' +
          'during the exposure window quarantined and tested, and the food-safety authority notified for a ' +
          'possible recall.',
      },
    },
  ],
});
