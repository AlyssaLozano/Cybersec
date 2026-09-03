/**
 * Board scenarios: high-consequence safety systems.
 *
 * Four estates where the crown is, or protects, a safety function of last
 * resort, and the lesson in each is that the safety system itself is a target.
 *
 * The refinery board is the TRITON-shaped lesson: the most alarming OT attack on
 * record went after the safety instrumented system, the automatic shutdown that
 * exists to prevent an explosion, because disabling it removes the last barrier
 * before a physical catastrophe. The dam board is about stored energy and water
 * release, where a single gate command has a downstream physical consequence
 * measured in lives. The air-navigation board is about the separation of
 * aircraft in flight, where corrupting the picture the controller works from is
 * the danger. The bedside board is cyber-physical harm at its most direct: a
 * connected infusion pump delivers a dose, and the patient is the consequence.
 *
 * Same standard as the rest: every system names its ATT&CK technique (ICS ids
 * where the objective is physical), and the four outcome lines carry the method,
 * the detection logic, the artefact and the containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * An oil refinery, and the safety-instrumented-system lesson.
 *
 * Modelled on the shape of the TRITON/TRISIS intrusion: the attacker reached the
 * safety instrumented system, the independent controller whose only job is to
 * bring the process to a safe state when something goes wrong. Disabling or
 * subverting it does not itself cause harm, which is exactly why it is the most
 * dangerous move: it removes the last automatic barrier, so the next process
 * upset is uncontained. The crown is the SIS, not the process control.
 */
export const REFINERY_REDWATER = definePositional({
  id: 'bd-refinery-redwater',
  title: 'Last Barrier: Redwater Refining',
  brief:
    'Seven systems, two defences, ten rounds. Red is working toward the safety instrumented system: ' +
    'the independent controller that exists only to shut the process down safely. Disabling it causes ' +
    'no immediate harm, which is the point. It removes the last barrier before the next upset becomes ' +
    'a disaster.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['refinery', 'safety', 'sis', 'shutdown', 'interlock', 'process', 'physical', 'barrier'],
  dossier: {
    org: 'Redwater Refining',
    summary:
      'A petrochemical refinery. The basic process control system runs the plant; a separate, ' +
      'independent safety instrumented system exists solely to trip the process to a safe state on a ' +
      'dangerous condition. The two are meant to be isolated from each other and from IT. Simulated ' +
      'throughout: no command reaches any real system.',
    facts: [
      { k: 'Objective', v: 'Safety instrumented system, 172.16.4.10 (crown)' },
      { k: 'Safety network', v: '172.16.4.0/24' },
      { k: 'Process network', v: '172.16.3.0/24' },
      { k: 'Corporate', v: '10.125.1.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate IT',
      note: 'Office network, 10.125.1.0/24. Email, engineering documents, scheduling.',
      technique: 'T1566.001 Phishing: Spearphishing Attachment',
      flavour: {
        compromise:
          'A process engineer opens a document posing as a vendor bulletin. The macro loads a foothold. The ' +
          'refinery is untouched; this phase is for learning the plant and finding the route to the safety ' +
          'network.',
        detect:
          'Office spawning a scripting host on an engineering endpoint, and beacons to newly registered ' +
          'domains from the engineering team.',
        evidence:
          'A macro-enabled bulletin opened at 09:20, followed by an encoded PowerShell command and a beacon ' +
          'to a domain registered days earlier.',
        contain:
          'The host is isolated and reimaged, engineering credentials reset, and macros blocked from internet ' +
          'documents by policy.',
      },
    },
    {
      id: 'engstation',
      label: 'Engineering workstation',
      note: 'EWS01, 172.16.3.20. Programs the process controllers, and reaches the safety network.',
      technique: 'T0866 Exploitation of Remote Services',
      flavour: {
        compromise:
          'The engineering workstation holds the programming software for the plant and, through a poorly ' +
          'enforced boundary, a path to the safety controllers. In the real intrusion this dual-homed ' +
          'engineering host was the bridge that should never have existed.',
        detect:
          'Application allowlisting on the engineering station, and monitoring for any connection from it into ' +
          'the safety network outside a planned engineering activity.',
        evidence:
          'The safety-controller programming tool launched on the engineering station with no maintenance ' +
          'window booked, then a connection into the safety network.',
        contain:
          'The station is rebuilt from signed media, the path from process to safety network severed, and ' +
          'safety programming restricted to a dedicated, air-gapped terminal.',
      },
    },
    {
      id: 'bpcs',
      label: 'Process control (BPCS)',
      note: 'BPCS01, 172.16.3.30. Runs the plant day to day.',
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'The basic process control system runs the refinery. Manipulating a setpoint here can push the ' +
          'process toward an unsafe condition, which is only survivable because the safety system is watching. ' +
          'That is why the operator wants the safety system disabled first.',
        detect:
          'Protocol monitoring on the process network for setpoint writes from unexpected sources, and alarms ' +
          'on values trending toward safety limits.',
        evidence:
          'A setpoint driven toward a trip limit from the engineering station rather than the operations ' +
          'console.',
        contain:
          'The setpoint is restored, the process brought back to a stable state, and the process network ' +
          'isolated from the engineering path.',
      },
    },
    {
      id: 'historian',
      label: 'Process historian',
      note: 'HIST01, 172.16.3.40. Records process data. Bridges to corporate.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The historian bridges the process network to corporate for reporting, so it both reveals the plant ' +
          'in detail and offers a path inward. It is the usual pivot into a refinery network.',
        detect:
          'Firewall monitoring on the historian for sessions outside its data feeds, and integrity checks on ' +
          'the process records.',
        evidence:
          'An outbound session from the historian into the process network on a port no feed uses.',
        contain:
          'The bridge is restricted to documented feeds, the historian rebuilt, and process data pushed out ' +
          'one-way for reporting.',
      },
    },
    {
      id: 'hmi',
      label: 'Operator console',
      note: 'HMI01, 172.16.3.50. What the control-room operator watches.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Holding the operator’s view at normal while the process drifts, or while the safety system is being ' +
          'tampered with, buys the time an attack on the safety system needs. The operator acts on the ' +
          'console, and a lying console is worse than a dark one.',
        detect:
          'Cross-checking the console against independent instrument readings, and alerting on divergence ' +
          'between the display and the raw process values.',
        evidence:
          'The console showing stable operation while independent instruments show the process approaching a ' +
          'trip condition.',
        contain:
          'Operators revert to independent instruments, treat the console as untrusted, and bring the process ' +
          'to a safe state manually.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.125.1.5. Staff identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the engineering estate, so the directory is a step toward the ' +
          'engineering station and the safety network beyond it. Replication rights take the hashes without ' +
          'executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an engineering workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and the engineering estate separated onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'sis',
      label: 'Safety instrumented system',
      note: 'SIS01, 172.16.4.10. Trips the process to safe on a dangerous condition. The objective.',
      crown: true,
      technique: 'T0880 Loss of Safety',
      flavour: {
        compromise:
          'You reach the safety instrumented system unseen and disable or subvert its trip logic. Nothing ' +
          'happens immediately, and that is the horror of it: the plant runs on, apparently normal, but the ' +
          'automatic barrier that would shut it down before an explosion or release is gone. The next process ' +
          'upset, which the safety system exists to catch, now runs to its physical conclusion. This is the ' +
          'exact objective of the most serious OT attack ever documented, and the lesson is that the safety ' +
          'system of last resort is precisely what a sophisticated adversary comes for.',
        detect:
          'Firmware and logic integrity verification on the safety controllers against the signed image, ' +
          'protocol-aware monitoring for any write to the safety system from anything but its dedicated ' +
          'terminal, and a physical key switch that gates programming.',
        evidence:
          'A logic or firmware write to the safety controller from the engineering station rather than its ' +
          'dedicated terminal, with the safety checksum recomputed to hide the change.',
        contain:
          'The process is brought to a safe shutdown deliberately, because the safety barrier can no longer be ' +
          'trusted, the safety system is restored from signed logic and physically verified, and the process ' +
          'safety authority is engaged before any restart. Nothing resumes on an assurance short of the safety ' +
          'logic being proven correct.',
      },
    },
  ],
});

/**
 * A hydroelectric dam, and the stored-energy problem.
 *
 * The lesson is that a single control command here moves an enormous amount of
 * water, so the consequence is immediate, physical and potentially lethal
 * downstream. The crown is the spillway and gate control, and Blue's defence has
 * to account for the fact that both opening and refusing to open a gate can be
 * dangerous depending on conditions.
 */
export const DAM_GLENMARK = definePositional({
  id: 'bd-dam-glenmark',
  title: 'Head of Water: Glenmark Hydro',
  brief:
    'Six systems, two defences, nine rounds. Red is working toward the spillway and gate control of a ' +
    'hydroelectric dam. One command moves an enormous volume of water, with an immediate downstream ' +
    'consequence. Blue is defending a physical system where both acting and failing to act can harm.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['dam', 'spillway', 'gate', 'reservoir', 'flood', 'downstream', 'physical', 'release'],
  dossier: {
    org: 'Glenmark Hydro',
    summary:
      'A hydroelectric dam and reservoir with populated areas downstream. Generation and water-release ' +
      'controls run on a control network separated from corporate by a maintenance gateway. Simulated ' +
      'throughout: no command reaches any real system.',
    facts: [
      { k: 'Objective', v: 'Spillway and gate control, 172.17.5.10 (crown)' },
      { k: 'Control network', v: '172.17.5.0/24' },
      { k: 'Corporate', v: '10.126.1.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate IT',
      note: 'Office network, 10.126.1.0/24. Email, generation scheduling, maintenance.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'A reused operations credential from a breach corpus, still valid and without multi-factor. From ' +
          'corporate you can reach the control network over the maintenance path, which is the shortest route ' +
          'to the dam.',
        detect:
          'Authentication anomalies for operations accounts, and any corporate-to-control session outside a ' +
          'maintenance window.',
        evidence:
          'An operations login from an unfamiliar address, then a connection toward the control network.',
        contain:
          'The account is reset, MFA enforced, and corporate-to-control access restricted to a scheduled, ' +
          'logged process.',
      },
    },
    {
      id: 'gateway',
      label: 'Maintenance gateway',
      note: 'GW01, 172.17.5.60. The controlled path from corporate into the control network.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise:
          'The maintenance gateway is the boundary, with a vendor remote-support path left without ' +
          'multi-factor. Taking it puts you on the network that controls the gates.',
        detect:
          'Gateway authentication without an MFA event, and sessions outside scheduled maintenance.',
        evidence:
          'A gateway session at 02:10 via the vendor path, from a corporate host.',
        contain:
          'The vendor path is closed, MFA enforced on every route, the gateway rebuilt, and control access ' +
          'restricted to a diode-style feed where possible.',
      },
    },
    {
      id: 'scada',
      label: 'Dam SCADA',
      note: 'SCADA01, 172.17.5.20. Supervisory control of generation and water release.',
      technique: 'T0855 Unauthorized Command Message',
      flavour: {
        compromise:
          'From SCADA you can issue release and generation commands using the operator software. On its own a ' +
          'command is bounded by interlocks, so a careful operator stages here before defeating those ' +
          'protections rather than treating it as the objective.',
        detect:
          'Command issuance correlated with operator session state, and alarms on any release command from a ' +
          'session with no operator input.',
        evidence:
          'A gate command issued from the operator console during a session with no keyboard input, while the ' +
          'operator was away.',
        contain:
          'Remote access to the control network is severed, the dam reverts to local manual control with staff ' +
          'on site, and control is restored only after verification.',
      },
    },
    {
      id: 'hmi',
      label: 'Operator display',
      note: 'HMI01, 172.17.5.30. What the dam operator watches: levels, flows, gate positions.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Holding the displayed reservoir level and gate positions steady while the real values change lets a ' +
          'release run unnoticed, or masks a rising level until it is an emergency. The operator acts on the ' +
          'panel, so a lying panel is the enabling step.',
        detect:
          'Independent level and gate-position telemetry compared against the display, with alarms on ' +
          'divergence.',
        evidence:
          'The display showing gates closed and a stable level while independent sensors show a gate open and ' +
          'the level dropping.',
        contain:
          'Operators switch to independent instruments and physical observation, treat the display as ' +
          'untrusted, and verify gate positions on site.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.126.1.5. Staff identity, which governs control access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the control network, so the directory is one hop from gate control. ' +
          'Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an operations workstation at 02:50.',
        contain:
          'The account is disabled, krbtgt reset twice, and the control network separated onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'gates',
      label: 'Spillway and gate control',
      note: 'GATE01, 172.17.5.10. Opens and closes the spillway gates. The objective.',
      crown: true,
      technique: 'T0831 Manipulation of Control',
      flavour: {
        compromise:
          'You hold direct control of the spillway gates, unseen. Opening them fully and suddenly sends a wall ' +
          'of water downstream toward populated areas; holding them shut against a rising reservoir threatens ' +
          'the dam itself. Either way a single command has an immediate, physical, potentially lethal ' +
          'consequence for people who have no idea it is happening. The stored energy behind the dam is the ' +
          'weapon, and that is what makes water-control infrastructure a category of its own.',
        detect:
          'Protocol-aware monitoring for gate commands from any source that is not the operations console, ' +
          'interlocks that bound the rate of release, and independent downstream level monitoring with public ' +
          'warning systems.',
        evidence:
          'A rapid full-open gate command from the maintenance gateway rather than the operations console, ' +
          'outside any planned release, with the operator display held steady.',
        contain:
          'Gate control is severed from the network and moved to local manual operation, the release is ' +
          'brought under controlled conditions, downstream warning systems are activated, and the dam safety ' +
          'authority and emergency services are engaged. Protecting people downstream comes before restoring ' +
          'the system.',
      },
    },
  ],
});

/**
 * An air navigation service provider, and the separation problem.
 *
 * The counterpart to the airport and airline boards: here the estate keeps
 * aircraft apart in the sky. The crown is the flight-data and radar processing
 * the controller works from, and the lesson is that corrupting the controller's
 * picture, not any aircraft, is how you threaten separation.
 */
export const ATC_SKYWARD = definePositional({
  id: 'bd-atc-skyward',
  title: 'Separation: Skyward Air Navigation',
  brief:
    'Seven systems, three defences, eleven rounds. Skyward keeps aircraft apart in the sky. Red wants ' +
    'the flight-data and radar processing the controller works from, because corrupting that picture, ' +
    'not any aircraft, is how separation is threatened. Blue is defending the integrity of what the ' +
    'controller sees.',
  maxTurns: 11,
  coverageBudget: 3,
  movesLeft: 3,
  terms: ['separation', 'radar', 'controller', 'flight', 'safety', 'surveillance', 'airspace', 'integrity'],
  dossier: {
    org: 'Skyward Air Navigation',
    summary:
      'An air navigation service provider managing a busy en-route control centre. Radar and flight ' +
      'data feed controller displays that maintain separation between aircraft. Systems are ' +
      'safety-critical and connect to supporting IT more than they should. Simulated throughout.',
    facts: [
      { k: 'Objective', v: 'Flight data processing, 10.127.2.10 (crown)' },
      { k: 'Operations network', v: '10.127.2.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Function', v: 'Maintaining separation between aircraft' },
      { k: 'Blue coverage', v: '3 systems at a time, 3 repositions' },
      { k: 'Clock', v: '11 rounds' },
    ],
  },
  targets: [
    {
      id: 'admin',
      label: 'Administrative IT',
      note: 'Corporate estate, part of 10.127.2.0/24. Email, planning, engineering support.',
      technique: 'T1566.002 Phishing: Spearphishing Link',
      flavour: {
        compromise:
          'An engineer is phished through an adversary-in-the-middle page that steals the session. The ' +
          'administrative side is where the operator learns the operational architecture and finds the path ' +
          'to the safety-critical systems.',
        detect:
          'A sign-in with a valid token and no fresh authentication, for an engineering account, from an ' +
          'unfamiliar network.',
        evidence:
          'A session presenting a token minutes after a link click, with no matching logon.',
        contain:
          'Tokens are revoked, the account moved to a hardware factor, and the sender domain blocked.',
      },
    },
    {
      id: 'flightplan',
      label: 'Flight plan processing',
      note: 'FPL01, 10.127.2.30. Ingests and distributes flight plans.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Flight plan data feeds the controller’s expectations of where aircraft will be. Injecting false or ' +
          'altered plans, or ghost flights, degrades the picture and increases controller workload, a subtle ' +
          'attack short of the surveillance system.',
        detect:
          'Validation of flight plans against their sources, and alerting on plans with no corresponding ' +
          'filed origin or on implausible trajectories.',
        evidence:
          'Flight plans present in the system with no filed origin, or altered routings inconsistent with the ' +
          'filed plan.',
        contain:
          'Injected plans are removed, plan ingestion validated against authenticated sources, and controllers ' +
          'briefed on the discrepancy.',
      },
    },
    {
      id: 'surveillance',
      label: 'Surveillance data',
      note: 'SURV01, 10.127.2.40. Radar and ADS-B tracks feeding the displays.',
      technique: 'T1565.002 Data Manipulation: Transmitted Data Manipulation',
      flavour: {
        compromise:
          'Surveillance tracks are the aircraft positions the controller trusts. Injecting false tracks, or ' +
          'removing real ones, directly threatens separation because the controller cannot separate aircraft ' +
          'they cannot see or that appear where they are not.',
        detect:
          'Cross-correlation of multiple surveillance sources against each other, and alerting on tracks ' +
          'present in one source but not others, or on implausible track behaviour.',
        evidence:
          'A track appearing on the processed display with no corresponding return in the raw radar or ADS-B ' +
          'feeds, or a real aircraft dropped from the processed picture.',
        contain:
          'Controllers fall back to a validated surveillance source or to procedural separation with increased ' +
          'spacing, and the processing chain is treated as untrusted until verified.',
      },
    },
    {
      id: 'comms',
      label: 'Controller communications',
      note: 'COMMS01, 10.127.2.50. Voice and data link to aircraft.',
      technique: 'T1499 Endpoint Denial of Service',
      flavour: {
        compromise:
          'The communications system is how the controller instructs aircraft. Degrading it means instructions ' +
          'do not get through, which forces traffic reductions and, in the worst case, threatens the ability ' +
          'to resolve a developing conflict.',
        detect:
          'Availability monitoring on the communications system with thresholds set by operational impact, and ' +
          'a tested fallback communications path.',
        evidence:
          'Communications latency or dropouts under crafted load, with controllers reporting instructions not ' +
          'reaching aircraft.',
        contain:
          'Controllers switch to the fallback communications path, traffic is reduced to maintain safe ' +
          'workload, and the source of the degradation is isolated.',
      },
    },
    {
      id: 'ad',
      label: 'Directory',
      note: 'DC01, 10.127.2.5. Staff identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Identity governs access to the operational systems, so the directory is a step toward the ' +
          'safety-critical processing. Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an administrative workstation at 03:00.',
        contain:
          'The account is disabled, krbtgt reset twice, and the operational systems separated onto their own ' +
          'identity plane.',
      },
    },
    {
      id: 'recording',
      label: 'Legal recording',
      note: 'REC01, 10.127.2.60. Records controller communications and radar for investigation.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The legal recording is the evidence used to investigate any incident. Tampering with it would ' +
          'hamper an investigation and erode confidence, a secondary objective that compounds a primary ' +
          'attack on the operational systems.',
        detect:
          'Integrity monitoring on the recordings with alerting on any gap or modification, and write-once ' +
          'storage.',
        evidence:
          'A gap in the recording or altered timestamps around a period of operational activity.',
        contain:
          'The recording integrity is verified and restored where possible, storage hardened to write-once, ' +
          'and the gap documented for any subsequent investigation.',
      },
    },
    {
      id: 'fdp',
      label: 'Flight data processing',
      note: 'FDP01, 10.127.2.10. Fuses surveillance and flight data into the controller picture. Objective.',
      crown: true,
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'You reach the flight data processing system unseen: the fusion point that turns raw radar and flight ' +
          'plans into the single picture every controller works from. Corrupting it, subtly shifting positions, ' +
          'suppressing conflict alerts, or degrading it entirely, attacks the separation of aircraft directly, ' +
          'and the controllers are acting on what it tells them. This is the sharpest air-safety crown in the ' +
          'catalogue: the danger is not to one flight but to the assured separation of all of them, and it is ' +
          'why air navigation systems are held to the highest assurance and kept isolated.',
        detect:
          'Integrity verification of the processing chain, cross-checking the fused picture against raw ' +
          'sources, safety-net conflict alerting that is independently validated, and rehearsed procedures for ' +
          'reverting to a degraded but trusted mode.',
        evidence:
          'The fused picture diverging from the raw surveillance sources, or conflict alerts suppressed, with ' +
          'a change to the processing configuration outside any maintenance activity.',
        contain:
          'Controllers revert to procedural separation with increased spacing and a validated surveillance ' +
          'source, traffic is reduced to a safe level, the processing system is restored and verified, and the ' +
          'aviation safety regulator is engaged. Safe separation is maintained by widening spacing while the ' +
          'system is untrusted.',
      },
    },
  ],
});

/**
 * A hospital's connected-device network, and cyber-physical harm at the bedside.
 *
 * The counterpart to the earlier hospital board, which was about data and
 * ransomware. This one is about the devices that touch the patient: a networked
 * infusion pump delivers a dose, and altering it is direct physical harm. The
 * crown is the infusion management server, because it reaches every pump at once.
 */
export const BEDSIDE_ELLORY = definePositional({
  id: 'bd-bedside-ellory',
  title: 'Bedside: Ellory Health',
  brief:
    'Six systems, two defences, nine rounds. Not the records this time, the devices. A networked ' +
    'infusion pump delivers a dose to a patient, and the infusion management server reaches every ' +
    'pump at once. Red wants that server; Blue is defending against harm delivered at the bedside.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['device', 'infusion', 'pump', 'dose', 'patient', 'bedside', 'physical', 'clinical'],
  dossier: {
    org: 'Ellory Health',
    summary:
      'A hospital with a large fleet of networked infusion pumps and patient monitors, managed ' +
      'centrally. The device network carries little security of its own and connects to clinical IT. ' +
      'Authorised exercise; no real patient is involved and no device is actually commanded.',
    facts: [
      { k: 'Objective', v: 'Infusion management server, 10.128.3.10 (crown)' },
      { k: 'Device network', v: '10.128.3.0/24' },
      { k: 'Clinical network', v: '10.128.2.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'clinical',
      label: 'Clinical workstations',
      note: 'Ward endpoints, 10.128.2.0/24. Where staff chart and order.',
      technique: 'T1566.002 Phishing: Spearphishing Link',
      flavour: {
        compromise:
          'A nurse is phished through an adversary-in-the-middle page and the session is stolen. The clinical ' +
          'network is the entry point, and from it the poorly separated device network is reachable.',
        detect:
          'A sign-in with a valid token and no fresh authentication for a clinical account, and lateral ' +
          'movement from clinical to device networks.',
        evidence:
          'A clinical session reused from an unfamiliar address, then a connection toward the device network.',
        contain:
          'Tokens are revoked, the account moved to a hardware factor, and the clinical and device networks ' +
          'hard-separated.',
      },
    },
    {
      id: 'monitors',
      label: 'Patient monitors',
      note: 'MON fleet, 10.128.3.30. Vital-signs monitors at the bedside.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Patient monitors are what staff trust for vital signs. Suppressing an alarm or falsifying a reading ' +
          'means a deteriorating patient is not noticed, which is harm by omission and hard to detect because ' +
          'the display looks normal.',
        detect:
          'Cross-checking monitor readings against spot checks and against the central station, and alerting ' +
          'on monitors that stop alarming or report implausibly steady vitals.',
        evidence:
          'A bedside monitor showing stable vitals while a manual check shows deterioration, or alarms ' +
          'silently disabled.',
        contain:
          'Affected monitors are taken out of trust, patients checked manually and moved to known-good ' +
          'devices, and the device network investigated.',
      },
    },
    {
      id: 'pumps',
      label: 'Infusion pumps',
      note: 'Pump fleet, 10.128.3.40. Deliver medication and fluids at set rates.',
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'A networked infusion pump delivers a drug at a programmed rate. Altering that rate, or the dose ' +
          'limits, is direct physical harm to a patient. Individual pumps are the immediate danger, and the ' +
          'management server that configures them all is the way to do it at scale.',
        detect:
          'Monitoring pump configuration against the medication order and the drug library, and alerting on ' +
          'any rate or limit change that does not originate from an authorised order.',
        evidence:
          'A pump rate or dose limit changed to a value inconsistent with the medication order, pushed from ' +
          'the management server outside a clinician action.',
        contain:
          'Affected pumps are stopped and switched to known-good devices or manual administration, the drug ' +
          'library restored, and every pump’s configuration re-verified against orders.',
      },
    },
    {
      id: 'ad',
      label: 'Hospital directory',
      note: 'DC01, 10.128.2.5. Clinical and device-management identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Identity governs access to the device management server, so the directory is one hop from the ' +
          'pumps. Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a clinical workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and the device network moved onto its own identity ' +
          'plane.',
      },
    },
    {
      id: 'library',
      label: 'Drug library service',
      note: 'LIB01, 10.128.3.50. Defines safe dose limits pushed to the pumps.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The drug library defines the safe dose limits every pump enforces. Widening or removing those ' +
          'limits does not itself change a dose, but it removes the guardrail that would otherwise catch a ' +
          'dangerous programming, which makes a later harmful setting possible and unremarkable.',
        detect:
          'Integrity monitoring on the drug library against the approved formulary, and alerting on any limit ' +
          'change outside the pharmacy governance process.',
        evidence:
          'Dose limits widened in the library with no matching pharmacy approval, then distributed to the ' +
          'pump fleet.',
        contain:
          'The library is restored from the approved formulary, redistributed to all pumps, and the change ' +
          'reviewed as an attack on the safety guardrail.',
      },
    },
    {
      id: 'infusionserver',
      label: 'Infusion management server',
      note: 'INF01, 10.128.3.10. Configures and updates every infusion pump. The objective.',
      crown: true,
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'You reach the infusion management server unseen: the system that configures every pump in the ' +
          'hospital. From here a change can be pushed to the whole fleet at once, altering rates or dose ' +
          'limits across wards, and the harm is delivered directly into patients’ veins while charts and ' +
          'displays may still read as expected. This is cyber-physical harm at its most intimate, the reason ' +
          'medical-device security is a patient-safety discipline and not merely a data-protection one.',
        detect:
          'Integrity monitoring on the management server, reconciliation of every pushed configuration against ' +
          'authorised orders and the approved drug library, and alerting on any fleet-wide push.',
        evidence:
          'A configuration change pushed to many pumps at once with no corresponding clinical orders, from a ' +
          'session that reached the server through the clinical network.',
        contain:
          'Fleet updates are halted, affected pumps switched to known-good devices or manual administration, ' +
          'every configuration re-verified against orders, patients assessed for harm, and the incident ' +
          'reported to the clinical safety and regulatory bodies. Patient safety leads the response.',
      },
    },
  ],
});
