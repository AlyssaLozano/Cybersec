/**
 * Board scenarios: rail, fuel, space and maritime.
 *
 * Four more critical-infrastructure estates, each chosen to teach something the
 * energy and water boards do not.
 *
 * The rail board is about fail-safe: a signalling system is designed so that the
 * absence of a valid "proceed" defaults to stop, so the interesting attack is
 * not commanding a green, it is defeating the safety logic that would otherwise
 * catch you. The pipeline board is the Colonial-shaped lesson that the most
 * consequential OT incident on record touched no OT at all: the operator shut
 * the pipeline down itself, out of caution, because it could not bill, which
 * makes IT/OT interdependence the whole point. The ground-station board is about
 * command authority over an asset you cannot physically reach. The maritime board
 * is about a control system that is mobile, crewed and only intermittently
 * connected, where the "estate" is a ship.
 *
 * Same standard as the rest: every system names its ATT&CK technique (ICS
 * technique ids where the objective is physical), and the four outcome lines
 * carry the method, the detection logic, the artefact and the containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * A metro signalling network, where the safety logic is the real target.
 *
 * The lesson is fail-safe. You do not attack a signalling system by turning a
 * light green; you attack it by defeating the interlocking that keeps two trains
 * apart, because the light means nothing without it. Blue's job is to protect
 * the integrity of that logic, and to understand that the safe failure is the
 * whole system stopping, not degrading quietly.
 */
export const SIGNAL_FENWICK = definePositional({
  id: 'bd-signal-fenwick',
  title: 'Right of Way: Fenwick Metro',
  brief:
    'Six systems, two defences, nine rounds. Red is working toward the signalling interlocking of ' +
    'a city metro. Commanding a signal is not the objective; defeating the safety logic that keeps ' +
    'trains apart is. Note that for Blue, the safe failure here is everything stopping.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['signal', 'interlocking', 'safety', 'failsafe', 'train', 'separation', 'physical', 'segment'],
  dossier: {
    org: 'Fenwick Metro',
    summary:
      'A city metro operator running driverless and driver-supervised lines. The signalling network ' +
      'is separated from corporate IT, and the separation rests on a maintenance gateway that has ' +
      'grown remote-access exceptions. Simulated throughout: no command reaches any real system.',
    facts: [
      { k: 'Objective', v: 'Interlocking controller, 172.24.3.10 (crown)' },
      { k: 'Signalling network', v: '172.24.3.0/24' },
      { k: 'Corporate', v: '10.220.1.0/24' },
      { k: 'Safety principle', v: 'Absence of a valid proceed defaults to stop' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate IT',
      note: 'Office network, 10.220.1.0/24. Email, rostering, maintenance planning.',
      technique: 'T1566.001 Phishing: Spearphishing Attachment',
      flavour: {
        compromise:
          'A maintenance planner opens a document that claims to be a work order. The macro loads a ' +
          'foothold. Nothing about the metro is touched yet; this is where the operator learns the shape of ' +
          'the signalling environment before going anywhere near it.',
        detect:
          'Office spawning a scripting host on a corporate endpoint, and outbound connections to newly ' +
          'registered domains from the planning team.',
        evidence:
          'A macro-enabled work order opened at 08:50, followed by an encoded PowerShell command and a beacon ' +
          'to a domain registered a week earlier.',
        contain:
          'The host is isolated and reimaged, the planner credentials reset, and macros from external documents ' +
          'blocked by policy across the corporate estate.',
      },
    },
    {
      id: 'gateway',
      label: 'Maintenance gateway',
      note: 'GW01, 172.24.3.60. The one sanctioned path from corporate into signalling.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise:
          'The maintenance gateway is the boundary, and boundaries accrete exceptions. A vendor support path ' +
          'was set up without multi-factor because the vendor found it inconvenient. You take that path, and ' +
          'you inherit its reach into the safety network.',
        detect:
          'Authentication to the gateway without a matching MFA event, and any session outside the planned ' +
          'maintenance windows, which are few and scheduled well in advance.',
        evidence:
          'A gateway session at 02:30 using the vendor support path, from a corporate workstation rather than ' +
          'the vendor jump host.',
        contain:
          'The vendor path is closed, MFA enforced on every route without exception, the gateway rebuilt, and ' +
          'signalling access moved to a diode-style unidirectional feed where the design allows.',
      },
    },
    {
      id: 'control',
      label: 'Traffic control centre',
      note: 'CTC01, 172.24.3.20. Supervises train movements across the network.',
      technique: 'T0855 Unauthorized Command Message',
      flavour: {
        compromise:
          'From the control centre you can issue movement authorities using the operator software. On its own ' +
          'this is bounded by the interlocking, which will refuse anything unsafe, so a competent operator ' +
          'treats this as the staging point for defeating that logic rather than the objective itself.',
        detect:
          'Command issuance correlated with operator session state: an authority issued while no operator is ' +
          'interacting, or from a session with no input activity.',
        evidence:
          'Movement authorities issued from a control console during a session with no keyboard or mouse input, ' +
          'while the operator was away.',
        contain:
          'Remote access to signalling is severed, the network reverts to local manual working with reduced ' +
          'service, and control is restored only after the environment is verified.',
      },
    },
    {
      id: 'hmi',
      label: 'Controller display',
      note: 'DISP03, 172.24.3.30. What the signaller watches.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Holding the displayed track state while the real state differs is how you buy time. A signaller acts ' +
          'on the panel in front of them, and a panel that lies is worse than a panel that goes dark, because a ' +
          'dark panel is treated as a failure and a lying one is trusted.',
        detect:
          'Independent train-detection telemetry compared against the display state. Any control room that ' +
          'cannot cross-check the panel against track circuits cannot detect this.',
        evidence:
          'Display showing a section clear while the track-circuit feed reports it occupied, for two minutes.',
        contain:
          'Signallers switch to the independent detection feed and voice confirmation with any staff on the ' +
          'ground, the display layer is treated as untrusted, and services are held until it is rebuilt.',
      },
    },
    {
      id: 'timetable',
      label: 'Timetable and scheduling',
      note: 'TT01, 10.220.1.50. Plans services and crew. Corporate side.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The scheduling system is not safety-critical, but it tells you the movement pattern, the maintenance ' +
          'windows and where the gaps in supervision are. Disruption planning starts here, and it is quiet.',
        detect:
          'Bulk export of the timetable and maintenance schedule by an account outside the planning team.',
        evidence:
          'A full export of the service pattern and engineering-hours schedule, run by a finance account at ' +
          'the weekend.',
        contain:
          'Access is scoped to the planning team and the schedule treated as sensitive, because it is ' +
          'reconnaissance material for a physical attack.',
      },
    },
    {
      id: 'interlocking',
      label: 'Interlocking controller',
      note: 'IXL-F3, 172.24.3.10. Enforces that two trains cannot occupy one section. The objective.',
      crown: true,
      technique: 'T0839 Module Firmware',
      flavour: {
        compromise:
          'The interlocking is the safety logic itself: the thing that refuses to set a route that would put two ' +
          'trains in one section. Reaching it unseen and altering its firmware means the one component designed ' +
          'to prevent a collision no longer does, and every signal above it becomes a suggestion. This is the ' +
          'line where a cyber exercise stops being about service and starts being about lives.',
        detect:
          'Firmware integrity verification on the interlocking against the signed vendor image, and ' +
          'protocol-aware monitoring for any configuration or logic write from a source that is not the ' +
          'authorised engineering terminal.',
        evidence:
          'A firmware write to the interlocking from the maintenance gateway rather than the engineering ' +
          'terminal, outside any possession window, with the safety-checksum recomputed to hide it.',
        contain:
          'The affected line is taken to a complete stop, which is the safe state, the interlocking is restored ' +
          'from the signed image and physically verified, and the railway safety regulator is notified. The ' +
          'service does not resume on any assurance short of the logic being proven correct.',
      },
    },
  ],
});

/**
 * A fuel pipeline, and the lesson that the biggest OT incident touched no OT.
 *
 * Modelled on the shape of the Colonial Pipeline event: the attackers reached
 * the billing and business systems, and the operator shut the pipeline down
 * itself, because it could not measure and bill what it was moving and would not
 * run blind. The crown here is therefore the billing system, and the point is
 * that the physical consequence was a business decision forced by an IT
 * compromise, which is a more common and more subtle failure than a direct
 * attack on a controller.
 */
export const PIPELINE_BRANDT = definePositional({
  id: 'bd-pipeline-brandt',
  title: 'Shut In: Brandt Pipeline',
  brief:
    'Seven systems, two defences, ten rounds. The interesting target is not the pipeline controls. ' +
    'It is the billing and measurement systems, because an operator that cannot measure what it ' +
    'moves will shut the line down itself rather than run blind. The physical outage here is a ' +
    'business decision an IT compromise forces.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['pipeline', 'billing', 'measurement', 'shutdown', 'ransom', 'business', 'interdependence', 'restore'],
  dossier: {
    org: 'Brandt Pipeline Company',
    summary:
      'An operator of a long-haul refined-fuel pipeline. Physical control is well segmented; the ' +
      'business systems that measure, schedule and bill the product are not, and the two depend on ' +
      'each other more than the org chart admits. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Billing and measurement, 10.230.1.10 (crown)' },
      { k: 'Business network', v: '10.230.1.0/24' },
      { k: 'Control network', v: '172.25.4.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'vpn',
      label: 'Remote access VPN',
      note: 'vpn.brandt.example, 203.0.113.85. Staff access, a legacy account still enabled.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'A legacy account with a password found in a breach corpus, still enabled, no multi-factor because it ' +
          'predates the policy. You log in as staff. There is no exploit and no malware, which is exactly how ' +
          'the pipeline case actually began.',
        detect:
          'VPN authentication for a dormant account, and any login for an account that predates the MFA ' +
          'enrolment cutoff.',
        evidence:
          'A successful VPN session for an account last used eight months ago, from an address with no history ' +
          'for the company.',
        contain:
          'The account is disabled, every legacy account audited and either enrolled or removed, and MFA made ' +
          'mandatory with no exceptions.',
      },
    },
    {
      id: 'workstations',
      label: 'Business workstations',
      note: 'Scheduling and operations staff endpoints, 10.230.1.0/24.',
      technique: 'T1003.001 OS Credential Dumping: LSASS Memory',
      flavour: {
        compromise:
          'From a scheduler workstation you read cached credentials and move toward the systems that matter. ' +
          'The business network is flatter than the control network and far easier to traverse.',
        detect:
          'Process access to LSASS from an unexpected binary, which is Sysmon event 10 with a telltale access ' +
          'mask, on the operations subnet.',
        evidence:
          'A handle opened to LSASS by a tool in a user profile directory, under a scheduler account, at 23:10.',
        contain:
          'The host is isolated, cached credentials on it treated as burned and reset, and Credential Guard ' +
          'enabled across the business estate.',
      },
    },
    {
      id: 'historian',
      label: 'Measurement historian',
      note: 'HIST01, 172.25.4.30. Records flow and volume. Straddles both networks.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The historian holds the measurement data that billing depends on, and it talks to both sides to do ' +
          'its job. It is the bridge, and it is the data whose loss makes the operator unable to bill.',
        detect:
          'Firewall monitoring on the historian for any session outside its configured data feeds, and integrity ' +
          'monitoring on the measurement records.',
        evidence:
          'An outbound session from the historian to the business network on a port no feed uses, followed by ' +
          'bulk reads of the measurement tables.',
        contain:
          'The bridge is restricted to its documented feeds, the historian rebuilt, and measurement data ' +
          'replicated to a store the business side can read without reaching into the control network.',
      },
    },
    {
      id: 'scada',
      label: 'Pipeline SCADA',
      note: 'SCADA01, 172.25.4.20. Supervisory control of pumps and valves.',
      technique: 'T0812 Default Credentials',
      flavour: {
        compromise:
          'The control system is better protected, but a historic engineering account with a default credential ' +
          'still works. Reaching it is a genuine escalation, and the operator would rather stop the line than ' +
          'let it run under uncertainty, which is the leverage even without touching a valve.',
        detect:
          'Authentication to SCADA using a default or shared engineering credential, and protocol monitoring ' +
          'for any control command from a source that is not the operations console.',
        evidence:
          'A SCADA login using the vendor default engineering account, from the historian rather than the ' +
          'operations console.',
        contain:
          'Default credentials are removed estate-wide, the account disabled, and the control network reviewed ' +
          'for any command issued during the exposure window before normal operation resumes.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.230.1.5. Business identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Domain admin over the business network puts every business system, including billing, within reach. ' +
          'DCSync takes the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a principal that is not a domain controller.',
        evidence:
          'Directory replication requested from a scheduler workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and replication rights audited across the domain.',
      },
    },
    {
      id: 'exfil',
      label: 'Data staging host',
      note: 'STAGE01, 10.230.1.60. Where an operator gathers data before it leaves.',
      technique: 'T1074.001 Data Staged: Local Data Staging',
      flavour: {
        compromise:
          'Modern extortion of a pipeline operator is double: encrypt for disruption, and steal for a publication ' +
          'threat. Staging the business data is the quiet step before either, and it is the last good chance to ' +
          'catch the operation.',
        detect:
          'Mass file access at machine speed on the business file shares, and archive creation in unusual ' +
          'locations. Honeypot files in old directories are cheap and effective here.',
        evidence:
          'A multi-part archive of business documents assembled on STAGE01 over one night, in a folder nobody ' +
          'has used in years.',
        contain:
          'The staging host is isolated, the archive preserved as evidence, and egress from the business ' +
          'network reviewed for what may already have left.',
      },
    },
    {
      id: 'billing',
      label: 'Billing and measurement',
      note: 'BILL01, 10.230.1.10. Measures, schedules and invoices the product. The objective.',
      crown: true,
      technique: 'T1486 Data Encrypted for Impact',
      flavour: {
        compromise:
          'You reach the billing and measurement system unseen and encrypt it. You have touched no pump and no ' +
          'valve, and yet the pipeline stops, because the operator cannot measure or account for what it moves ' +
          'and will not run a fuel line on guesswork. This is the crux of the pipeline lesson: the physical ' +
          'shutdown was a rational business decision forced by an IT compromise, and defending the OT alone ' +
          'would not have prevented it.',
        detect:
          'File telemetry for high-entropy writes across the billing data volume, and availability monitoring ' +
          'that treats the loss of measurement as a safety-relevant event rather than an inconvenience.',
        evidence:
          'The billing database and measurement records encrypted, and a ransom note, with the OT untouched and ' +
          'fully functional.',
        contain:
          'The operator invokes its shutdown decision procedure deliberately rather than in a panic, recovers ' +
          'billing and measurement from offline backups, and restarts the line only when it can account for ' +
          'flow. The lesson recorded afterward is that IT/OT interdependence, not the controller, was the ' +
          'exposure.',
      },
    },
  ],
});

/**
 * A satellite ground station, where the objective is command authority over an
 * asset in orbit.
 *
 * The distinguishing feature is that the crown cannot be reached, inspected or
 * rebuilt physically. Once you can send commands to the spacecraft, recovery
 * depends on whatever the spacecraft itself will accept, and a badly timed
 * command can be unrecoverable. Blue's containment options are unusually final.
 */
export const GROUNDSTATION_ORBITAL = definePositional({
  id: 'bd-groundstation-orbital',
  title: 'Uplink: Orbital Reach',
  brief:
    'Seven systems, two defences, ten rounds. Red is working toward command authority over a ' +
    'satellite. The objective is not on the ground and cannot be inspected or rebuilt by hand, so ' +
    'Blue is defending the one path to an asset it cannot physically reach.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['satellite', 'uplink', 'command', 'telemetry', 'ground', 'segment', 'orbit', 'authority'],
  dossier: {
    org: 'Orbital Reach',
    summary:
      'A commercial satellite operator running an earth-observation constellation from a primary ' +
      'ground station. The mission network that commands the spacecraft is separated from corporate, ' +
      'and the separation depends on a mission gateway. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Command uplink service, 172.26.5.10 (crown)' },
      { k: 'Mission network', v: '172.26.5.0/24' },
      { k: 'Corporate', v: '10.240.1.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate network',
      note: 'Office estate, 10.240.1.0/24. Email, engineering documents.',
      technique: 'T1566.002 Phishing: Spearphishing Link',
      flavour: {
        compromise:
          'A mission engineer is phished through an adversary-in-the-middle page that steals the session token, ' +
          'so multi-factor is satisfied and bypassed at once. The corporate foothold is where the operator ' +
          'learns the mission architecture.',
        detect:
          'A sign-in with a valid token but no fresh interactive authentication, from an unfamiliar autonomous ' +
          'system, for a mission-team account.',
        evidence:
          'A session presenting a token minutes after a link click, with no matching logon event.',
        contain:
          'Refresh tokens for the principal are revoked, the account moved to a hardware factor, and the sender ' +
          'domain blocked.',
      },
    },
    {
      id: 'engdocs',
      label: 'Mission document store',
      note: 'ENG01, 10.240.1.40. Command dictionaries, flight procedures, spacecraft manuals.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The command dictionary and flight procedures are what make a raw uplink meaningful. Without them a ' +
          'command channel is noise; with them, it is control. Stealing the documentation is the quiet, ' +
          'essential reconnaissance step.',
        detect:
          'Bulk access to the mission documentation by an account outside the flight team, and any download of ' +
          'the command dictionary, which is a small, watched collection.',
        evidence:
          'The command dictionary and safe-mode procedures downloaded overnight by a corporate account with no ' +
          'flight role.',
        contain:
          'Documentation access is scoped to the flight team, the command dictionary is classified, and the ' +
          'download is treated as a signal that the intrusion targets the space segment.',
      },
    },
    {
      id: 'gateway',
      label: 'Mission gateway',
      note: 'GW01, 172.26.5.60. The controlled path from corporate into the mission network.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise:
          'The mission gateway is the boundary. A remote-support path for the antenna vendor was left without ' +
          'multi-factor, and you take it. Crossing here puts you on the network that talks to the spacecraft.',
        detect:
          'Gateway authentication without an MFA event, and sessions outside the scheduled contact windows, ' +
          'which follow the orbit and are therefore predictable.',
        evidence:
          'A gateway session between contact windows, using the vendor support path, from a corporate host.',
        contain:
          'The vendor path is closed, MFA enforced on every route, the gateway rebuilt, and mission access ' +
          'aligned to scheduled contacts only.',
      },
    },
    {
      id: 'telemetry',
      label: 'Telemetry processing',
      note: 'TLM01, 172.26.5.30. Receives and displays spacecraft health.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Telemetry is how the operator knows the spacecraft is healthy. Holding the displayed health steady ' +
          'while the real state changes lets a hostile command go unnoticed until it is too late to reverse, ' +
          'which for an orbiting asset can mean permanently.',
        detect:
          'Cross-checking processed telemetry against the raw downlink, and alerting on any divergence between ' +
          'the health display and the underlying frames.',
        evidence:
          'A health display showing nominal power and attitude while the raw telemetry frames report a drift.',
        contain:
          'Operators revert to the raw telemetry, treat the processing layer as untrusted, and hold all ' +
          'commanding until the spacecraft state is independently confirmed.',
      },
    },
    {
      id: 'planning',
      label: 'Mission planning',
      note: 'PLAN01, 172.26.5.40. Builds and schedules command sequences.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Mission planning builds the command sequences that get uplinked. Altering a scheduled sequence here ' +
          'means the operator uplinks your commands believing they are its own, which is quieter than seizing ' +
          'the uplink directly.',
        detect:
          'Integrity checks on planned command sequences before uplink, and review of any sequence modified ' +
          'outside the planning workflow.',
        evidence:
          'A scheduled command sequence with an inserted attitude command, modified outside the planning tool ' +
          'and with the approval record unchanged.',
        contain:
          'The affected sequence is withdrawn, planned sequences are re-verified against approvals, and a ' +
          'second-person check is enforced technically before any uplink.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.240.1.5. Staff identity, which governs mission access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity governs who reaches the mission network, so the directory is one hop from ' +
          'commanding authority. Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a mission-team workstation at 03:00.',
        contain:
          'The account is disabled, krbtgt reset twice, and the mission network moved onto its own identity ' +
          'plane so a corporate compromise cannot reach commanding.',
      },
    },
    {
      id: 'uplink',
      label: 'Command uplink service',
      note: 'UPL01, 172.26.5.10. Sends commands to the spacecraft. The objective.',
      crown: true,
      technique: 'T0831 Manipulation of Control',
      flavour: {
        compromise:
          'You hold the command uplink unseen, with the command dictionary to make it meaningful. You can task ' +
          'the spacecraft, change its attitude, or drive it into a state it cannot recover from, and unlike ' +
          'every other crown in the catalogue this asset cannot be reached, imaged or rebuilt by anyone. ' +
          'Recovery depends entirely on what the spacecraft itself will still accept, and a well-chosen command ' +
          'at the wrong moment is final.',
        detect:
          'Authentication and command authority on the uplink verified against the mission schedule, and ' +
          'command-level monitoring for any uplink not originating from an approved, planned sequence.',
        evidence:
          'Commands uplinked outside a scheduled contact, sourced from the gateway rather than the commanding ' +
          'console, carrying attitude changes with no corresponding approved plan.',
        contain:
          'Uplink is halted at the antenna, the spacecraft is commanded to a known safe mode through a ' +
          'verified path if one remains, and the national space authority is engaged. The unavailable options ' +
          'here, physical inspection and rebuild, are the whole lesson.',
      },
    },
  ],
});

/**
 * A shipping line, where the estate is a vessel: mobile, crewed and only
 * intermittently connected.
 *
 * The distinguishing feature is that the crown, the navigation system, is on a
 * moving ship with a crew who can and must fall back to manual seamanship. That
 * changes containment: Blue's ultimate control is a human on a bridge with a
 * paper chart, which no other board has.
 */
export const BRIDGE_NORTHWAKE = definePositional({
  id: 'bd-bridge-northwake',
  title: 'Dead Reckoning: Northwake Lines',
  brief:
    'Six systems, two defences, nine rounds. The estate is a container ship at sea. Red wants the ' +
    'navigation system, but the crown here sits on a moving vessel with a crew who can navigate ' +
    'without it. Blue’s last line of defence is a human on the bridge with a paper chart.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['vessel', 'navigation', 'ecdis', 'bridge', 'manual', 'crew', 'cargo', 'satellite'],
  dossier: {
    org: 'Northwake Lines',
    summary:
      'A container shipping line. Vessels carry electronic chart and navigation systems, cargo ' +
      'management, and a satellite link to shore that is intermittent and low-bandwidth. Shore IT ' +
      'and vessel systems connect through that link. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Navigation system (ECDIS), 172.27.6.10 (crown)' },
      { k: 'Vessel network', v: '172.27.6.0/24' },
      { k: 'Shore network', v: '10.250.1.0/24' },
      { k: 'Link', v: 'Satellite, intermittent, low bandwidth' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'shore',
      label: 'Shore IT',
      note: 'Fleet operations office, 10.250.1.0/24. Manages vessels remotely.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'A fleet operations credential from a breach corpus, reused and still valid. From shore you can reach ' +
          'the vessels over the same link the operators use, which is the shortest path to a ship at sea.',
        detect:
          'Authentication anomalies for fleet operations accounts, and any shore-to-vessel session outside the ' +
          'scheduled management windows.',
        evidence:
          'A fleet operations login from an unfamiliar address, followed by a connection to a vessel outside ' +
          'the maintenance schedule.',
        contain:
          'The account is reset, MFA enforced for shore operations, and shore-to-vessel access restricted to a ' +
          'scheduled, logged process.',
      },
    },
    {
      id: 'satlink',
      label: 'Satellite terminal',
      note: 'SAT01, 172.27.6.60. The vessel’s link to shore. The only way in from outside.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise:
          'The satellite terminal is the vessel boundary, and it is often an internet-exposed device with a ' +
          'default or weak management interface. Owning it means owning the only route between shore and the ' +
          'ship’s systems.',
        detect:
          'Management-interface authentication on the terminal from anywhere other than the fleet operations ' +
          'range, and firmware or configuration changes outside a maintenance window.',
        evidence:
          'A login to the satellite terminal management interface from an external address, using the ' +
          'factory default credential.',
        contain:
          'The management interface is taken off the public side, default credentials removed, the terminal ' +
          'firmware verified, and management restricted to the fleet operations range over a tunnel.',
      },
    },
    {
      id: 'cargo',
      label: 'Cargo management',
      note: 'CARGO01, 172.27.6.30. Container positions, weights and the stowage plan.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The stowage plan governs how the ship is loaded and therefore its stability. Corrupting weights and ' +
          'positions is a safety attack that does not touch navigation at all, and it also enables smuggling by ' +
          'hiding or relabelling containers.',
        detect:
          'Integrity monitoring on the stowage plan and reconciliation against the loaded manifest, plus ' +
          'stability checks that would flag an implausible distribution.',
        evidence:
          'Container weights altered in the stowage plan after loading, producing a distribution the stability ' +
          'calculation would have rejected.',
        contain:
          'The plan is restored from the shore copy, stability recomputed and physically verified, and the ' +
          'manifest reconciled against the actual load before sailing.',
      },
    },
    {
      id: 'crewnet',
      label: 'Crew network',
      note: 'CREW01, 172.27.6.40. Crew welfare and personal devices. Poorly separated.',
      technique: 'T1091 Replication Through Removable Media',
      flavour: {
        compromise:
          'Crew welfare networks are the soft underbelly of a vessel: personal devices, USB media brought ' +
          'aboard, and often a thin separation from operational systems. A payload that arrives on a crew ' +
          'device and crosses that gap is a documented route onto maritime operational networks.',
        detect:
          'USB media control on operational hosts, and monitoring for any traffic from the crew segment toward ' +
          'the navigation or cargo networks.',
        evidence:
          'A USB device seen first on a crew device and later on an operational host, which the media policy ' +
          'forbids, followed by a connection toward the navigation segment.',
        contain:
          'The crew and operational networks are hard-separated, USB media blocked on operational hosts, and ' +
          'the operational segment scanned for anything that crossed.',
      },
    },
    {
      id: 'engine',
      label: 'Engine monitoring',
      note: 'ENG01, 172.27.6.50. Propulsion and machinery telemetry.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Engine monitoring tells the crew whether the machinery is healthy. Manipulating what the engineers ' +
          'see can mask a developing fault or provoke an unnecessary shutdown, either of which is dangerous at ' +
          'sea, and neither of which touches navigation.',
        detect:
          'Cross-checking displayed machinery state against independent sensors, and alerting on divergence ' +
          'between the monitoring display and raw readings.',
        evidence:
          'Engine monitoring showing nominal temperatures while an independent sensor path reports a rise.',
        contain:
          'Engineers switch to direct local readings, treat the monitoring layer as untrusted, and verify ' +
          'machinery state physically.',
      },
    },
    {
      id: 'ecdis',
      label: 'Navigation system (ECDIS)',
      note: 'ECDIS01, 172.27.6.10. The electronic chart the ship navigates by. The objective.',
      crown: true,
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The electronic chart display is what the bridge navigates by. Reaching it unseen and corrupting the ' +
          'chart or the position feed can put a ship aground or into a hazard while the display insists all is ' +
          'well. And yet this is the one crown in the catalogue with a genuine human fallback: a competent ' +
          'bridge team that distrusts the screen can navigate by paper chart, radar and celestial fix. The ' +
          'lesson is that the ultimate control here is trained people, not technology.',
        detect:
          'Chart and position integrity checks, cross-referencing the ECDIS position against an independent ' +
          'satellite receiver and against radar-derived position, and crew trained to treat a mismatch as an ' +
          'ECDIS failure.',
        evidence:
          'The ECDIS position diverging from the independent receiver and the radar picture, with the chart ' +
          'showing safe water where the radar shows a hazard.',
        contain:
          'The bridge reverts to manual navigation with paper charts and radar, the ECDIS is treated as failed, ' +
          'the vessel is taken to safe water or held, and shore and the flag state are notified. That the ' +
          'answer is seamanship rather than a reboot is the point of the board.',
      },
    },
  ],
});
