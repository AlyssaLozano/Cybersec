/**
 * Board scenarios: national and sovereign infrastructure.
 *
 * Four estates that a state, not a company, ultimately depends on, and each
 * teaches a lesson about defending something whose loss is a national event.
 *
 * The reactor board is about defence in depth: a nuclear plant is the most
 * heavily layered OT estate there is, so the attack is not a single command but
 * the patient erosion of independent barriers, and the crown, the reactor
 * protection system, is the last automatic one. The border board is about
 * sovereign biometric identity, which cannot be reset and which the state itself
 * relies on to know who crosses its frontier. The dispatch board is about the
 * availability of the emergency-call system, where an outage is measured in
 * people who cannot summon help. The registry board is about DNS as a root of
 * trust: control a country's domain registry and you can misdirect a whole
 * nation's traffic.
 *
 * Same standard as the rest: every system names its ATT&CK technique (ICS ids
 * where the objective is physical), and the four outcome lines carry the method,
 * the detection logic, the artefact and the containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside. These
 * are defensive training scenarios about protecting fictional estates; none
 * represents a real facility, agency or country, and none contains guidance for
 * affecting any real system.
 */

import { definePositional } from './positional-kit.js';

/**
 * A nuclear power plant, and the defence-in-depth lesson.
 *
 * The lesson is that a nuclear estate is protected by many independent layers,
 * so no single command reaches the objective; the attack is the slow erosion of
 * barriers, and even the most capable documented OT operations needed physical
 * media to cross an air gap. The crown is the reactor protection system, the
 * independent, redundant logic that scrams the reactor on a dangerous condition,
 * and defeating it removes the last automatic safeguard rather than causing
 * immediate harm.
 */
export const REACTOR_CALDERPOINT = definePositional({
  id: 'bd-reactor-calderpoint',
  title: 'Defence in Depth: Calder Point Nuclear',
  brief:
    'Seven systems, three defences, twelve rounds. A nuclear plant is the most heavily layered OT ' +
    'estate there is, so no single move reaches the objective. Red must erode barriers patiently, ' +
    'even across an air gap. The crown is the reactor protection system: the last automatic safeguard, ' +
    'and defeating it causes no immediate harm, which is the point.',
  maxTurns: 12,
  coverageBudget: 3,
  movesLeft: 3,
  terms: ['reactor', 'protection', 'scram', 'safety', 'airgap', 'barrier', 'redundant', 'defence'],
  dossier: {
    org: 'Calder Point Nuclear (fictional)',
    summary:
      'A fictional nuclear generating station used for an authorised defensive exercise. Multiple ' +
      'independent networks separate corporate, plant control and the safety-critical protection ' +
      'systems, with air gaps and strict media control between layers. Simulated throughout: no ' +
      'command reaches any real system, and no real facility is represented.',
    facts: [
      { k: 'Objective', v: 'Reactor protection system, 172.21.4.10 (crown)' },
      { k: 'Safety network', v: '172.21.4.0/24 (air-gapped)' },
      { k: 'Plant control', v: '172.21.3.0/24' },
      { k: 'Corporate', v: '10.135.1.0/24' },
      { k: 'Blue coverage', v: '3 systems at a time, 3 repositions' },
      { k: 'Clock', v: '12 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate IT',
      note: 'Office network, 10.135.1.0/24. Email, engineering documents, procurement.',
      technique: 'T1566.001 Phishing: Spearphishing Attachment',
      flavour: {
        compromise:
          'An engineer opens a document posing as a supplier bulletin. The macro loads a foothold. The plant ' +
          'is many layers away; this phase is reconnaissance of the estate and the people who cross between ' +
          'layers.',
        detect:
          'Office spawning a scripting host on an engineering endpoint, and beacons to newly registered ' +
          'domains from the engineering team.',
        evidence:
          'A macro-enabled bulletin opened at 09:20, followed by an encoded PowerShell command and a beacon to ' +
          'a fresh domain.',
        contain:
          'The host is isolated and reimaged, credentials reset, macros blocked from internet documents, and a ' +
          'hunt run for the same infrastructure.',
      },
    },
    {
      id: 'supplychain',
      label: 'Vendor and supply chain',
      note: 'Engineering software and updates from external suppliers.',
      technique: 'T1195.002 Supply Chain Compromise: Software Supply Chain',
      flavour: {
        compromise:
          'The realistic route toward a segmented plant is the supply chain: a tampered engineering software ' +
          'update or a compromised vendor laptop that will legitimately be carried inside. This is how ' +
          'air-gapped industrial systems have actually been reached.',
        detect:
          'Verification of vendor software against signed hashes before it enters the estate, and media control ' +
          'that scans everything at a dedicated station.',
        evidence:
          'An engineering update whose hash does not match the vendor’s published value, staged to be taken ' +
          'inside on removable media.',
        contain:
          'The update is quarantined, the vendor and national authority notified, and media control tightened ' +
          'with a one-way scanning station.',
      },
    },
    {
      id: 'plantnet',
      label: 'Plant control network',
      note: 'Plant systems, 172.21.3.0/24. Runs the balance of plant.',
      technique: 'T0866 Exploitation of Remote Services',
      flavour: {
        compromise:
          'The plant control network runs the non-safety systems. Reaching it is a real escalation and a ' +
          'staging point, but it is still separated from the safety systems by design, so it is not the ' +
          'objective, only the layer before it.',
        detect:
          'Application allowlisting on plant hosts, and monitoring for any connection from plant control toward ' +
          'the safety network.',
        evidence:
          'A connection attempt from a plant control host into the air-gapped safety network, which the ' +
          'architecture forbids.',
        contain:
          'The plant host is isolated, the boundary to the safety network verified intact, and the plant ' +
          'network reviewed for how it was reached.',
      },
    },
    {
      id: 'engstation',
      label: 'Safety engineering terminal',
      note: 'EWS-S, 172.21.4.20. The controlled means of programming the protection system.',
      technique: 'T1091 Replication Through Removable Media',
      flavour: {
        compromise:
          'The safety network is air-gapped, so the only realistic path is the removable media used to program ' +
          'the safety engineering terminal. A payload that rides that media across the gap is exactly the ' +
          'technique that has crossed industrial air gaps before, and it is slow and patient by necessity.',
        detect:
          'Strict media control with mandatory scanning at a dedicated station, host logging inside the safety ' +
          'enclave that is reviewed despite its isolation, and integrity checks on the engineering terminal.',
        evidence:
          'A removable device serial number appearing on both a plant host and the safety engineering ' +
          'terminal, which media policy forbids absolutely.',
        contain:
          'The enclave is treated as compromised, the terminal examined offline, media control enforced ' +
          'physically with port blockers, and the incident reported to the nuclear regulator.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.135.1.5. Staff identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity governs access to the engineering estate, so the directory is a step toward the ' +
          'systems that cross between layers. Replication rights take the hashes without executing on the ' +
          'controller.',
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
      id: 'monitoring',
      label: 'Control room indication',
      note: 'CR-IND, 172.21.3.50. What the reactor operators watch.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Holding the control-room indication at normal while a parameter drifts, or while the protection ' +
          'system is tampered with, is the enabling deception. Operators act on their indications, and by ' +
          'design they also have independent, hardwired safety indication that a manipulated display cannot ' +
          'reach, which is the defence.',
        detect:
          'Cross-checking control-room indication against independent, hardwired safety instrumentation, and ' +
          'alerting on divergence.',
        evidence:
          'The main indication showing normal while the independent safety instrumentation shows a parameter ' +
          'approaching a trip setpoint.',
        contain:
          'Operators rely on the independent safety instrumentation, treat the main indication as suspect, and ' +
          'follow the procedure for uncertain plant state.',
      },
    },
    {
      id: 'rps',
      label: 'Reactor protection system',
      note: 'RPS01, 172.21.4.10. Scrams the reactor on a dangerous condition. The objective.',
      crown: true,
      technique: 'T0880 Loss of Safety',
      flavour: {
        compromise:
          'You reach the reactor protection system unseen and subvert its trip logic. As with any safety ' +
          'system, nothing happens immediately, and that is precisely the danger: the automatic scram that ' +
          'exists to shut the reactor down on a dangerous condition would no longer fire. Reaching this point ' +
          'required crossing every independent layer, which is why it is the hardest crown in the catalogue and ' +
          'why defence in depth is the doctrine: no single failure should get here, and the protection system ' +
          'has redundant channels and hardwired backups precisely so that a subverted one is caught. The ' +
          'lesson is that the safeguards of last resort are exactly what a state-level adversary comes for, and ' +
          'that layering and independence are what stand in the way.',
        detect:
          'Firmware and logic integrity verification across the redundant protection channels against signed ' +
          'images, comparison between channels so a divergent one is flagged, hardwired backup trips ' +
          'independent of the digital logic, and alarms on any write to the protection system.',
        evidence:
          'A logic change on one protection channel that diverges from the others, written via the safety ' +
          'engineering terminal, with the control-room indication held normal.',
        contain:
          'The reactor is brought to a safe shutdown using the independent and hardwired protection that ' +
          'remains trustworthy, the affected channel restored from signed logic and verified, and the nuclear ' +
          'regulator engaged. Nothing restarts on any assurance short of the protection system being proven ' +
          'correct across all channels. Safety is absolute here.',
      },
    },
  ],
});

/**
 * A national border and biometric identity system, and the sovereign-identity
 * problem.
 *
 * The lesson is that biometric identity is permanent, cannot be reissued, and is
 * something the state itself relies on to know who crosses its border. The crown
 * is the biometric identity database, and its compromise is both a mass personal
 * harm and a national-security one.
 */
export const BORDER_SABLE = definePositional({
  id: 'bd-border-sable',
  title: 'Frontier: Sable Border Authority',
  brief:
    'Seven systems, two defences, ten rounds. A fictional state’s border and biometric identity ' +
    'estate. Red wants the biometric database, which cannot be reset and which the state itself uses ' +
    'to know who crosses its frontier. Its loss is a mass personal harm and a national-security one at ' +
    'once.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['border', 'biometric', 'identity', 'passport', 'sovereign', 'watchlist', 'irreversible', 'frontier'],
  dossier: {
    org: 'Sable Border Authority (fictional)',
    summary:
      'The border and identity agency of an invented state, used for an authorised defensive exercise. ' +
      'It runs passport issuance, biometric matching at crossings, and a watchlist, on a network ' +
      'connected to government IT. Fabricated throughout; no real agency or country is represented.',
    facts: [
      { k: 'Objective', v: 'Biometric identity database, 10.136.2.10 (crown)' },
      { k: 'Agency network', v: '10.136.2.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Scale', v: 'Biometrics and identity for a national population' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'eportal',
      label: 'Online services portal',
      note: 'services.sable.example, 198.51.100.70. Passport and visa applications.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'A flaw in the public applications portal gives a foothold and a view into the identity backend. It ' +
          'is internet-facing and heavily used, a natural entry point into a government identity estate.',
        detect:
          'The portal process spawning a shell, and egress from the web tier to anywhere that is not its ' +
          'application backend.',
        evidence:
          'The portal application spawning a command interpreter, with a crafted request in the logs.',
        contain:
          'The portal is taken offline and rebuilt, the web tier segmented from the identity backend, and the ' +
          'backend reviewed for access.',
      },
    },
    {
      id: 'issuance',
      label: 'Passport issuance',
      note: 'ISS01, 10.136.2.30. Produces genuine travel documents.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The issuance system produces genuine documents. The prize is not data but the ability to issue a ' +
          'real, valid passport in any identity, which is a far more powerful forgery than a counterfeit ' +
          'because it passes every check by being authentic.',
        detect:
          'Auditing of issuance actions against approved applications, and alerting on any document issued ' +
          'without a matching, approved case.',
        evidence:
          'A passport issued with no corresponding approved application, or an issuance action outside an ' +
          'officer’s authenticated session.',
        contain:
          'Issued documents without valid backing are revoked and flagged at crossings, issuance re-gated ' +
          'behind strong authentication and dual control, and the fraud reported.',
      },
    },
    {
      id: 'crossing',
      label: 'Crossing matching',
      note: 'MATCH01, 10.136.2.40. Matches travellers against biometrics and the watchlist.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The matching system decides whether a traveller is who they claim and whether they are flagged. ' +
          'Manipulating it to pass a specific person, or to suppress a watchlist hit, defeats the border ' +
          'control at the point of use without altering the underlying records.',
        detect:
          'Integrity monitoring on the matching configuration and watchlist, and reconciliation of crossing ' +
          'decisions against the source biometric and watchlist data.',
        evidence:
          'A watchlist match suppressed at a crossing, or a matching threshold altered to pass an identity, ' +
          'outside any authorised change.',
        contain:
          'The matching configuration and watchlist are restored from source, affected crossings reviewed, and ' +
          'the change treated as a targeted border-control attack.',
      },
    },
    {
      id: 'watchlist',
      label: 'Watchlist system',
      note: 'WATCH01, 10.136.2.50. The list of persons of interest.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The watchlist is sensitive intelligence: who the state is looking for and why. Reading it tips off ' +
          'those on it and exposes sources and methods, and altering it can hide a person or falsely implicate ' +
          'one, a subtle and serious integrity attack.',
        detect:
          'Access auditing on the watchlist with alerting on bulk reads and on any change outside the ' +
          'governance process.',
        evidence:
          'A bulk export of watchlist entries, or additions and removals with no matching authorisation.',
        contain:
          'Watchlist access is scoped to the authorised group, changes reverted and verified against source, ' +
          'and the exposure assessed as an intelligence compromise.',
      },
    },
    {
      id: 'ad',
      label: 'Agency directory',
      note: 'DC01, 10.136.2.5. Staff identity for the agency.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Agency identity governs access to the identity systems, so the directory is one hop from the ' +
          'biometric database. Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an agency workstation at 02:50.',
        contain:
          'The account is disabled, krbtgt reset twice, and the identity systems separated onto their own ' +
          'plane.',
      },
    },
    {
      id: 'egress',
      label: 'Outbound gateway',
      note: 'GW01, 10.136.2.60. Controls what leaves the agency network.',
      technique: 'T1030 Data Transfer Size Limits',
      flavour: {
        compromise:
          'A national biometric set is large, so moving it out quietly means metering the transfer below the ' +
          'egress alarm over days. The exfiltration is the patient counterpart to whatever technique got the ' +
          'access, and it is where a state-level operation stays hidden.',
        detect:
          'Cumulative egress analysis per host over long windows, and alerting on sustained transfers to any ' +
          'single external destination.',
        evidence:
          'A steady flow of large encrypted files to one external endpoint over a week, each transfer under ' +
          'the daily threshold.',
        contain:
          'The destination is blocked, egress limited, the cumulative transfer quantified, and the incident ' +
          'escalated as a national-security matter.',
      },
    },
    {
      id: 'biometric',
      label: 'Biometric identity database',
      note: 'BIO01, 10.136.2.10. Biometrics and identity for the population. The objective.',
      crown: true,
      technique: 'T1530 Data from Cloud Storage',
      flavour: {
        compromise:
          'You reach the biometric identity database unseen: fingerprints, faces and identities for a whole ' +
          'population. A biometric cannot be reissued the way a password or a card can; a person’s face and ' +
          'fingerprints are theirs for life, so this loss is permanent, and it is simultaneously a national ' +
          'security failure because the state relies on this data to know who crosses its border and who its ' +
          'own citizens are. It combines the irreversibility of the biobank with the sovereign weight of ' +
          'border control, which is what makes it one of the gravest crowns here.',
        detect:
          'Access and query auditing on the biometric store with alerting on any bulk read, egress correlation ' +
          'with the gateway, and strict separation of the biometric data from the systems that query it.',
        evidence:
          'A sequential read of the biometric database staged for slow exfiltration, by a session that reached ' +
          'it through the identity backend.',
        contain:
          'The store is isolated, the exposure quantified, the government’s national-security apparatus ' +
          'engaged, and affected identity processes reviewed. Because biometrics cannot be reset, the response ' +
          'centres on limiting downstream misuse rather than on any recovery, which does not exist.',
      },
    },
  ],
});

/**
 * An emergency-call dispatch centre, and the availability-as-life-safety problem.
 *
 * The lesson is that the emergency-call system is the population's means of
 * summoning help, so its unavailability is measured in people who cannot reach an
 * ambulance, police or fire service. The crown is the computer-aided dispatch
 * system, because taking it down blinds and mutes the entire emergency response.
 */
export const DISPATCH_RAVENSCOURT = definePositional({
  id: 'bd-dispatch-ravenscourt',
  title: 'No Answer: Ravenscourt Dispatch',
  brief:
    'Six systems, two defences, nine rounds. This estate is how a whole population summons help. Red ' +
    'wants the computer-aided dispatch system, because taking it down blinds and mutes the emergency ' +
    'response, and the outage is counted in people who cannot reach an ambulance, the police or a fire ' +
    'crew.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['emergency', 'dispatch', 'call', 'availability', 'response', 'cad', 'life', 'outage'],
  dossier: {
    org: 'Ravenscourt Emergency Dispatch (fictional)',
    summary:
      'A fictional regional emergency communications centre used for an authorised defensive exercise. ' +
      'It answers emergency calls, runs computer-aided dispatch, and coordinates ambulance, police and ' +
      'fire response. Fabricated throughout; no real service is represented.',
    facts: [
      { k: 'Objective', v: 'Computer-aided dispatch, 10.137.3.10 (crown)' },
      { k: 'Operations network', v: '10.137.3.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Function', v: 'Answering and dispatching emergency calls' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'admin',
      label: 'Administrative IT',
      note: 'Corporate estate, part of 10.137.3.0/24. Email, rostering, reporting.',
      technique: 'T1566.002 Phishing: Spearphishing Link',
      flavour: {
        compromise:
          'A dispatcher-supervisor is phished through an adversary-in-the-middle page and the session is ' +
          'stolen. The administrative side is the entry point and the place to learn how the operations ' +
          'systems connect.',
        detect:
          'A sign-in with a valid token and no fresh authentication, from an unfamiliar network, for a ' +
          'supervisor account.',
        evidence:
          'A session presenting a token minutes after a link click, with no matching logon.',
        contain:
          'Tokens are revoked, the account moved to a hardware factor, and the sender domain blocked.',
      },
    },
    {
      id: 'telephony',
      label: 'Call-taking telephony',
      note: 'TEL01, 10.137.3.30. Answers incoming emergency calls.',
      technique: 'T1499 Endpoint Denial of Service',
      flavour: {
        compromise:
          'The call-taking telephony is where emergency calls arrive. Flooding it, whether by a technical ' +
          'attack or automated fake calls, means real callers cannot get through, which is a direct denial of ' +
          'emergency service short of touching dispatch.',
        detect:
          'Availability and call-queue monitoring with thresholds set by public-safety impact, and a tested ' +
          'overflow arrangement to neighbouring centres.',
        evidence:
          'Call queues saturating under a flood of calls or a telephony exploit, with legitimate callers ' +
          'reporting no answer.',
        contain:
          'Calls are overflowed to partner centres, the flood source mitigated at the carrier, and additional ' +
          'call-takers brought on.',
      },
    },
    {
      id: 'radio',
      label: 'Responder radio gateway',
      note: 'RADIO01, 10.137.3.40. Links dispatchers to responders in the field.',
      technique: 'T1565.002 Data Manipulation: Transmitted Data Manipulation',
      flavour: {
        compromise:
          'The radio gateway connects dispatch to the crews. Disrupting it, or injecting false traffic, ' +
          'severs or corrupts the link between the control room and responders, which delays and misdirects ' +
          'help even when dispatch itself is working.',
        detect:
          'Integrity and availability monitoring on the radio gateway, and confirmation that a fallback ' +
          'communications path to responders exists.',
        evidence:
          'Radio traffic dropping or false dispatch messages appearing, from an internal host on the ' +
          'operations network.',
        contain:
          'Dispatchers switch to the fallback radio path, the gateway is isolated and restored, and injected ' +
          'traffic reviewed.',
      },
    },
    {
      id: 'ad',
      label: 'Operations directory',
      note: 'DC01, 10.137.3.5. Staff identity for the centre.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Identity governs access to the dispatch system, so the directory is one hop from the objective. ' +
          'Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an operations workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and the dispatch system separated onto its own ' +
          'credentials.',
      },
    },
    {
      id: 'records',
      label: 'Incident records',
      note: 'REC01, 10.137.3.50. Logs calls and dispatch decisions for the legal record.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Incident records are the legal and operational history of every call. Tampering with them hampers ' +
          'accountability and investigations, a secondary objective that compounds an attack on the live ' +
          'systems.',
        detect:
          'Integrity monitoring on the records with alerting on gaps or modifications, and write-once storage.',
        evidence:
          'A gap in the incident log or altered dispatch timestamps around a period of activity.',
        contain:
          'Record integrity is verified and restored where possible, storage hardened to write-once, and the ' +
          'gap documented.',
      },
    },
    {
      id: 'cad',
      label: 'Computer-aided dispatch',
      note: 'CAD01, 10.137.3.10. Tracks incidents and units and directs response. The objective.',
      crown: true,
      technique: 'T1486 Data Encrypted for Impact',
      flavour: {
        compromise:
          'You reach the computer-aided dispatch system unseen and encrypt it. The control room loses its ' +
          'picture of every incident and every unit at once, and the region’s ambulance, police and fire ' +
          'response falls back to paper and radio under enormous pressure, with lives depending on how fast ' +
          'that fallback works. Emergency dispatch has been hit by ransomware in reality, and the lesson is ' +
          'stark: for this estate, availability is not a service metric, it is directly the ability of a ' +
          'population to summon help.',
        detect:
          'File telemetry for high-entropy writes across the dispatch volume, availability monitoring that ' +
          'treats dispatch as a life-safety function, and a rehearsed manual-dispatch continuity plan.',
        evidence:
          'The dispatch database encrypted and a ransom note, with dispatchers losing the incident and unit ' +
          'picture across the region.',
        contain:
          'The centre invokes its manual-dispatch continuity plan immediately, mutual-aid centres take load, ' +
          'dispatch is recovered from offline backups, and the incident is treated as a public-safety ' +
          'emergency. Keeping help flowing by any means comes before restoring the system.',
      },
    },
  ],
});

/**
 * A country-code domain registry, and the DNS-as-root-of-trust problem.
 *
 * The lesson is that whoever controls a nation's domain registry can misdirect a
 * whole country's traffic, because DNS is the trust layer everything else rests
 * on. The crown is the registry and its signing keys, and its compromise lets an
 * attacker redirect banks, government and media at the root.
 */
export const DNS_DOMINION = definePositional({
  id: 'bd-dns-dominion',
  title: 'Root of Trust: Dominion Registry',
  brief:
    'Seven systems, two defences, ten rounds. Dominion runs a country’s domain registry. Whoever ' +
    'controls it can misdirect a whole nation’s traffic, because DNS is the trust layer everything ' +
    'else rests on. Red wants the registry and its signing keys; Blue is defending a root of trust.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['dns', 'registry', 'zone', 'dnssec', 'signing', 'redirect', 'trust', 'resolution'],
  dossier: {
    org: 'Dominion Registry',
    summary:
      'The operator of a country-code top-level domain, running the registry database, the ' +
      'authoritative name servers, and the DNSSEC signing that lets resolvers trust the answers. ' +
      'Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Registry and signing system, 10.138.4.10 (crown)' },
      { k: 'Registry network', v: '10.138.4.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Trust', v: 'Resolution and DNSSEC for a national domain' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'registrarportal',
      label: 'Registrar portal',
      note: 'portal.dominion.example, 192.0.2.60. Where registrars manage domains.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'A registrar credential, reused and found in a breach corpus, gets you in as a legitimate registrar. ' +
          'From there you can alter the domains that registrar manages and reach further into the registry ' +
          'estate.',
        detect:
          'Authentication anomalies for registrar accounts, and domain changes inconsistent with a ' +
          'registrar’s normal pattern.',
        evidence:
          'A registrar login from an unfamiliar address making nameserver changes the registrar did not ' +
          'request.',
        contain:
          'The account is reset, MFA enforced for registrars, and recent changes reviewed and reverted.',
      },
    },
    {
      id: 'epp',
      label: 'Registration interface',
      note: 'EPP01, 10.138.4.30. The provisioning interface registrars use programmatically.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'The registration provisioning interface accepts changes from registrars. A flaw here gives a ' +
          'foothold in the registry backend and a way to submit changes that bypass a registrar’s own ' +
          'controls.',
        detect:
          'The provisioning service spawning unexpected processes, and changes submitted outside a valid ' +
          'registrar session.',
        evidence:
          'The provisioning service spawning a shell, or domain changes with no authenticated registrar ' +
          'behind them.',
        contain:
          'The interface is patched and rebuilt, segmented from the registry core, and recent changes ' +
          'audited.',
      },
    },
    {
      id: 'nameservers',
      label: 'Authoritative name servers',
      note: 'NS fleet, 10.138.4.40. Answer DNS queries for the national domain.',
      technique: 'T1565.002 Data Manipulation: Transmitted Data Manipulation',
      flavour: {
        compromise:
          'The authoritative name servers answer the queries. Poisoning what they serve, even for a short ' +
          'window, redirects traffic for the affected domains to infrastructure you control, which is a ' +
          'direct hijack of resolution.',
        detect:
          'Continuous monitoring of what the name servers actually answer against the signed zone, and alerting ' +
          'on any divergence.',
        evidence:
          'Name servers answering with records that do not match the signed zone, pointing domains at ' +
          'unexpected addresses.',
        contain:
          'The name servers are restored from the authoritative signed zone, the poisoned records purged, and ' +
          'affected domain owners notified.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.138.4.5. Staff identity, which governs registry access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the registry systems, so the directory is one hop from the core. ' +
          'Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a registry-operations workstation at 02:50.',
        contain:
          'The account is disabled, krbtgt reset twice, and the registry core separated onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'hsm',
      label: 'DNSSEC signing HSM',
      note: 'HSM01, 10.138.4.50. Holds the keys that sign the zone.',
      technique: 'T1552.004 Unsecured Credentials: Private Keys',
      flavour: {
        compromise:
          'The DNSSEC signing keys are what let resolvers trust the answers for the national domain. Reaching ' +
          'the signing capability lets you sign forged records that validate correctly, defeating the very ' +
          'mechanism designed to detect DNS tampering.',
        detect:
          'HSM audit logging on every signing operation, with alerting on any signing outside the automated ' +
          'zone-signing process.',
        evidence:
          'Signing operations for records that do not correspond to legitimate zone changes, outside the ' +
          'normal signing schedule.',
        contain:
          'Signing is halted, the keys rolled, resolvers and the parent zone updated with new trust anchors, ' +
          'and forged records purged. Rolling a trust anchor is slow and disruptive, which is the point of ' +
          'protecting the HSM absolutely.',
      },
    },
    {
      id: 'monitoring',
      label: 'Registry monitoring',
      note: 'MON01, 10.138.4.60. Watches resolution health and zone integrity.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'Monitoring is what would catch a hijack quickly. Blinding it lets a redirection run long enough to ' +
          'harvest credentials and traffic from banks, government and media before anyone notices.',
        detect:
          'Independent external monitoring of resolution and DNSSEC validation, so the internal monitor going ' +
          'quiet is itself detected.',
        evidence:
          'Zone-integrity alarms suppressed and the resolution dashboard held quiet during a change.',
        contain:
          'Monitoring is restored, independent external checks relied upon, and recent zone changes reviewed.',
      },
    },
    {
      id: 'registry',
      label: 'Registry and signing system',
      note: 'REG01, 10.138.4.10. The authoritative registry database and signing. The objective.',
      crown: true,
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'You reach the registry core and its signing unseen. You can now repoint any domain in the national ' +
          'top-level domain and sign the forged records so they validate, which lets you silently redirect a ' +
          'whole country’s banks, government services and media to infrastructure you control, harvesting ' +
          'credentials and intercepting traffic at the root of trust. DNS is the layer every other security ' +
          'control assumes is honest, and this is the compromise that makes that assumption false for an ' +
          'entire nation. It is the sovereign version of the identity-vendor lesson: control the trust root ' +
          'and everything downstream trusts your answer.',
        detect:
          'Integrity monitoring on the registry database and the signed zone, reconciliation between the ' +
          'served zone and the authoritative record, independent external resolution monitoring, and strict ' +
          'control of the signing capability.',
        evidence:
          'Registry records altered and re-signed to repoint high-value domains, with the changes absent from ' +
          'the legitimate change record.',
        contain:
          'The registry is restored from the authoritative record, keys rolled if signing was reached, ' +
          'resolvers and the parent zone updated, affected domain owners and the national authority notified, ' +
          'and the trust re-established from a known-good state, which is slow and is why the root must be ' +
          'defended above all.',
      },
    },
  ],
});
