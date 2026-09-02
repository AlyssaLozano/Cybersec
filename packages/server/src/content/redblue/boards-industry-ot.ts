/**
 * Board scenarios: energy, manufacturing, pharmaceuticals and aviation.
 *
 * What these four share is that the consequence of losing is physical or
 * regulatory rather than reputational, and that changes what "contained" means.
 * On a corporate board you isolate a host and move on. Here isolating the wrong
 * host stops a production line, grounds an aircraft, or spoils a batch worth
 * more than the incident response budget. So these boards are written to make
 * Blue feel the cost of its own containment, which is the part of the job that
 * no tabletop exercise ever conveys.
 *
 * Same standard throughout: every system names its ATT&CK technique, and the
 * four outcome lines carry the method, the detection logic, the artefact and the
 * containment sequence.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * The electricity grid, and the attack that has actually happened twice.
 *
 * Modelled on the shape of the Ukrainian grid intrusions rather than on
 * speculation: long dwell time on the business network, credential theft,
 * legitimate remote access into the substation environment, and an operator
 * watching their own mouse move. Blue's lesson is that the last hop uses
 * approved tools, so detection has to be about context rather than malware.
 */
export const SUBSTATION_FAIRHAVEN = definePositional({
  id: 'bd-substation-fairhaven',
  title: 'Black Start: Fairhaven Energy',
  brief:
    'Six systems, two defences, nine rounds. A capable, patient group is working from the business ' +
    'network toward a substation controller. The final step will use approved remote access with ' +
    'stolen credentials, so nothing Red does at the end looks like malware.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['grid', 'substation', 'breaker', 'outage', 'scada', 'operator', 'physical', 'segment'],
  dossier: {
    org: 'Fairhaven Energy Distribution',
    summary:
      'A regional electricity distribution operator running 40 substations. The control centre and ' +
      'the corporate network are separated, and the separation depends on a jump host that has ' +
      'accumulated exceptions. Simulated: nothing here reaches any real control system.',
    facts: [
      { k: 'Objective', v: 'Substation RTU, 172.20.4.10 (crown)' },
      { k: 'Control network', v: '172.20.4.0/24' },
      { k: 'Corporate', v: '10.110.1.0/24' },
      { k: 'Protocol', v: 'IEC 104, no authentication in the protocol' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate network',
      note: 'Office estate, 10.110.1.0/24. Email, finance, engineering documents.',
      technique: 'T1566.001 Phishing: Spearphishing Attachment',
      flavour: {
        compromise:
          'A document sent to engineering staff, referencing a real grid code consultation. The macro loads a ' +
          'downloader. Dwell time here is measured in months and that is intentional: this phase is for ' +
          'learning the operational technology environment, not for touching it.',
        detect:
          'Office spawning a scripting host, plus outbound connections to newly registered domains. The ' +
          'engineering user population is small enough that a per-department baseline is realistic.',
        evidence:
          'A macro-enabled document opened by three engineers within an hour, each followed by an encoded ' +
          'PowerShell command and a connection to the same domain registered eleven days ago.',
        contain:
          'Hosts isolated and reimaged, credentials for all three reset, macros blocked from internet-sourced ' +
          'documents by policy, and a threat hunt run across the estate for the same infrastructure.',
      },
    },
    {
      id: 'engdocs',
      label: 'Engineering document store',
      note: 'ENG01, 10.110.1.40. Substation drawings, network diagrams, vendor manuals.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'Single-line diagrams, protection settings and vendor manuals. This is the reconnaissance that makes ' +
          'a physical attack possible: you cannot open the right breaker unless you know which one it is. ' +
          'Stealing documentation is the least alarming and most important step in a grid intrusion.',
        detect:
          'Bulk access to the engineering repository by an account outside the engineering group, and any ' +
          'download of the substation drawing set, which should be a small, watched collection.',
        evidence:
          'The complete drawing set for four substations downloaded over two evenings by a finance account ' +
          'that had never opened the repository before.',
        contain:
          'Repository access is scoped to the engineering group, the drawing set is classified and watermarked, ' +
          'and the download is treated as an indicator that the intrusion has an operational technology ' +
          'objective, which changes the whole response posture.',
      },
    },
    {
      id: 'jumphost',
      label: 'Control centre jump host',
      note: 'JMP01, 172.20.4.60. The single permitted path from corporate into the control network.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise:
          'The jump host is the boundary, and boundaries accumulate exceptions. Multi-factor was specified for ' +
          'it and implemented for interactive sessions but not for the service path an integration uses. You ' +
          'take the path without the factor.',
        detect:
          'Authentication to the jump host without a corresponding MFA event, and any session outside the ' +
          'engineering shift pattern. The absence of the second factor is the detection.',
        evidence:
          'A session established at 01:20 using the integration service path, from a corporate workstation ' +
          'rather than the integration server.',
        contain:
          'The service path is closed, MFA enforced on every path without exception, the jump host rebuilt, ' +
          'and session recording enabled so the next one is reconstructable.',
      },
    },
    {
      id: 'scada',
      label: 'SCADA master',
      note: 'SCADA01, 172.20.4.20. Central supervisory control for all 40 substations.',
      technique: 'T0855 Unauthorized Command Message',
      flavour: {
        compromise:
          'From the SCADA master you can issue control commands to every substation using the operator ' +
          'software itself. In the documented grid attacks the operators watched their own cursors move and ' +
          'could not stop it. Nothing malicious executes; the legitimate tool is simply driven by someone else.',
        detect:
          'Command issuance correlated with operator session state: a control command while no operator is ' +
          'interacting, or from a session with no keyboard activity, is the discriminator.',
        evidence:
          'Breaker open commands issued from an operator console during a session with no local input events, ' +
          'while the operator was on a break.',
        contain:
          'Remote access to the control network is severed entirely, operations move to manual with field ' +
          'crews dispatched to substations, and control is only restored after the environment is rebuilt.',
      },
    },
    {
      id: 'hmi',
      label: 'Operator console',
      note: 'CON03, 172.20.4.30. What the control room operator sees.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Holding the displayed state while the real state changes buys the minutes that matter. The operator ' +
          'is the last line of defence in a control room, and the operator only knows what the screen says.',
        detect:
          'Independent telemetry: comparing the console display state against field measurements taken from a ' +
          'separate path. Any control room that cannot do this cannot detect this.',
        evidence:
          'Console state showing all breakers closed while the field measurement path reports two open, for ' +
          'four minutes.',
        contain:
          'Operators switch to the independent measurement path and voice confirmation with field crews, the ' +
          'console is treated as untrusted, and the display layer is rebuilt from known-good media.',
      },
    },
    {
      id: 'rtu',
      label: 'Substation RTU',
      note: 'RTU-FH4, 172.20.4.10. Opens and closes breakers. IEC 104. The objective.',
      crown: true,
      technique: 'T0831 Manipulation of Control',
      flavour: {
        compromise:
          'Direct control of the remote terminal unit at a substation, reached without being seen. IEC 104 has ' +
          'no authentication, so a command from a permitted address is the authorisation. Opening breakers ' +
          'here takes supply from tens of thousands of customers, and if the firmware is overwritten ' +
          'afterwards, restoration means physically visiting every site with replacement hardware.',
        detect:
          'Protocol-aware monitoring on the control segment: IEC 104 control direction commands from any source ' +
          'that is not the SCADA master, and any firmware upload at all.',
        evidence:
          'Breaker open commands to four RTUs sourced from the jump host rather than the SCADA master, followed ' +
          'by firmware write attempts to the same devices.',
        contain:
          'Substations are moved to local manual control with crews on site, the control segment is isolated, ' +
          'device firmware is verified against vendor hashes, and the national cyber authority and energy ' +
          'regulator are notified because this is critical national infrastructure.',
      },
    },
  ],
});

/**
 * Supply chain, where the victim is not the target.
 *
 * The crown here is a code signing service, and the reason is worth sitting
 * with: compromising it does not harm Summit much at all. It harms everyone who
 * trusts Summit's signature. This is the board that teaches why software
 * suppliers carry a duty of care beyond their own risk appetite, and why build
 * infrastructure deserves tier zero treatment.
 */
export const SIGNING_SUMMIT = definePositional({
  id: 'bd-signing-summit',
  title: 'Downstream: Summit Industrial',
  brief:
    'Seven systems, two defences, ten rounds. Red is not really attacking Summit. Summit makes ' +
    'control software used by four hundred industrial sites, and Red wants the key that signs it. ' +
    'The damage from losing this board lands on people who are not in the room.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['supply', 'chain', 'build', 'sign', 'certificate', 'pipeline', 'artifact', 'downstream', 'update'],
  dossier: {
    org: 'Summit Industrial Software',
    summary:
      'A vendor of control and monitoring software installed at about 400 industrial sites. Around ' +
      '600 staff. Releases are signed and distributed through an auto-update channel that customers ' +
      'trust implicitly. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Code signing service, 10.120.7.10 (crown)' },
      { k: 'Build network', v: '10.120.7.0/24' },
      { k: 'Corporate', v: '10.120.1.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'devworkstation',
      label: 'Developer workstations',
      note: 'Engineers with local administrator rights and credentials to everything.',
      technique: 'T1195.001 Supply Chain Compromise: Software Dependencies',
      flavour: {
        compromise:
          'A dependency confusion or typosquatted package pulled during a developer build runs with the ' +
          'privileges of the engineer, which are considerable because developers get local administrator by ' +
          'convention. The package installs quietly and the build still succeeds.',
        detect:
          'Package resolution auditing: any dependency fetched from a public registry when an internal one was ' +
          'expected, and any first-use of a package name across the organisation.',
        evidence:
          'A build log showing a package resolved from the public registry whose name differs from the ' +
          'internal one by a single character, with a post-install script.',
        contain:
          'The package is blocked, the internal registry configured to take priority with no public fallback, ' +
          'affected workstations reimaged, and developer credentials rotated.',
      },
    },
    {
      id: 'sourcerepo',
      label: 'Source repository',
      note: 'REPO01, 10.120.7.30. All product source. Pull request review required, sometimes.',
      technique: 'T1195.002 Supply Chain Compromise: Software Supply Chain',
      flavour: {
        compromise:
          'A small, plausible change in a rarely reviewed area, merged by an engineer who trusted the author ' +
          'name. The most effective source-level backdoors do not look like backdoors; they look like an ' +
          'off-by-one in error handling.',
        detect:
          'Commit signing enforcement, and review of any change to build tooling or cryptographic code paths ' +
          'regardless of size. Small diffs in sensitive directories deserve more scrutiny, not less.',
        evidence:
          'An unsigned commit merged without review into the update verification routine, authored under the ' +
          'name of an engineer who was on leave.',
        contain:
          'The commit is reverted, signing enforced on all branches, branch protection required for the ' +
          'sensitive paths, and the full commit history audited for the same author pattern.',
      },
    },
    {
      id: 'buildagent',
      label: 'Build agents',
      note: 'Ephemeral runners, 10.120.7.40. Broad credentials, weak isolation between jobs.',
      technique: 'T1053.003 Scheduled Task/Job: Cron',
      flavour: {
        compromise:
          'Build agents hold credentials for everything they deploy to and are the least monitored hosts in ' +
          'most estates. Persistence on an agent means every future build is yours, and the build output ' +
          'changes without the source ever changing, which defeats source review entirely.',
        detect:
          'Reproducible builds: comparing the output of the pipeline against an independent rebuild from the ' +
          'same commit. If the artefacts differ, the pipeline is compromised, and no log analysis is required.',
        evidence:
          'A build artefact whose hash does not match an independent rebuild of the same commit, and a cron ' +
          'entry on the agent that survives job teardown.',
        contain:
          'Agents are rebuilt as genuinely ephemeral instances from a signed image per job, credentials are ' +
          'rotated, and reproducible build verification is added as a release gate.',
      },
    },
    {
      id: 'artifact',
      label: 'Artifact repository',
      note: 'ART01, 10.120.7.50. Holds built binaries before signing and release.',
      technique: 'T1554 Compromise Host Software Binary',
      flavour: {
        compromise:
          'The window between build and signature is the gap in most pipelines. Replace the artefact here and ' +
          'the signing service will faithfully sign whatever it is handed, because signing services verify ' +
          'authorisation, not intent.',
        detect:
          'Hash continuity between the build output and the signing input. Any break in that chain is the ' +
          'detection, and it requires the pipeline to record hashes at every hop.',
        evidence:
          'An artefact whose hash at signing time differs from the hash recorded at build completion, with no ' +
          'intervening build.',
        contain:
          'The artefact is quarantined, hash attestation enforced end to end so signing refuses an unattested ' +
          'input, and the repository access model tightened to write-once.',
      },
    },
    {
      id: 'updateserver',
      label: 'Update distribution',
      note: 'upd.summit.example, 198.51.100.90. Serves auto-updates to 400 customer sites.',
      technique: 'T1195.002 Supply Chain Compromise: Software Supply Chain',
      flavour: {
        compromise:
          'The distribution point reaches every customer automatically, which is the entire value. Targeting is ' +
          'possible here too: serve the modified build only to a handful of sites and the other 396 never see ' +
          'anything wrong, which is how these operations stay undiscovered for months.',
        detect:
          'Comparing what the distribution point serves against what was released, from an external vantage ' +
          'point, and alerting on any per-client differentiation in the response.',
        evidence:
          'The update endpoint returning a different artefact hash to four specific customer address ranges ' +
          'than to everyone else.',
        contain:
          'Distribution is halted, the released artefact hashes are published so customers can verify what ' +
          'they installed, affected customers are contacted directly, and the incident is disclosed. Halting ' +
          'the update channel is commercially painful and is still the right call.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.120.1.5. Staff identity. Build network trusts it, which is the design flaw.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'The build environment authenticating against the corporate directory means a corporate compromise ' +
          'reaches the build environment. Separating build identity from corporate identity is the ' +
          'architectural control, and almost nobody does it until after an incident.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a developer workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and the build environment moved onto its own identity ' +
          'plane with no trust relationship to corporate.',
      },
    },
    {
      id: 'signing',
      label: 'Code signing service',
      note: 'SIGN01, 10.120.7.10. Holds the private key in an HSM. The objective.',
      crown: true,
      technique: 'T1553.002 Subvert Trust Controls: Code Signing',
      flavour: {
        compromise:
          'You reach the signing service unseen. The key never leaves the hardware module, and it does not ' +
          'need to: you submit your artefact and the service signs it, because the service authorises callers ' +
          'rather than judging content. Everything downstream of Summit now trusts your code as much as it ' +
          'trusts theirs, and the harm lands entirely on people who never chose to accept this risk.',
        detect:
          'Signing request auditing against release records: any signature issued for an artefact with no ' +
          'corresponding approved release is an immediate, unambiguous incident.',
        evidence:
          'Three signing operations at 04:00 with no release ticket, for artefacts whose hashes match nothing ' +
          'in the build history.',
        contain:
          'Signing is halted, the certificate revoked and a new key issued, customers are notified with the ' +
          'hashes of legitimately signed releases, and the software supplier notifies the national authority. ' +
          'Revocation breaks every customer installation, which is why this decision goes to the board.',
      },
    },
  ],
});

/**
 * Pharmaceutical research, where the crown is a formulation and the second prize
 * is the ability to invalidate a batch.
 *
 * This board carries a regulatory dimension the others do not: the manufacturing
 * records are legally controlled, so an attacker who can alter them can destroy
 * product without touching the product. Blue's containment options are limited
 * by validation requirements, which is an unfamiliar and very real constraint.
 */
export const FORMULA_VERITY = definePositional({
  id: 'bd-formula-verity',
  title: 'Batch Record: Verity Pharma',
  brief:
    'Six systems, two defences, nine rounds. Red wants a formulation that took eleven years to ' +
    'develop. Note what Blue cannot simply reboot: manufacturing systems here are validated under ' +
    'regulation, and changing them is a paperwork exercise measured in weeks.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['batch', 'formulation', 'validated', 'regulated', 'integrity', 'manufacturing', 'trial', 'patent'],
  dossier: {
    org: 'Verity Pharmaceuticals',
    summary:
      'A mid-size pharmaceutical company with a candidate in late-stage trials. Manufacturing ' +
      'systems are validated under regulatory control, which means patching them requires ' +
      'revalidation. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Formulation vault, 10.130.9.10 (crown)' },
      { k: 'Research network', v: '10.130.9.0/24' },
      { k: 'Manufacturing', v: '172.21.5.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'collab',
      label: 'Research collaboration portal',
      note: 'collab.verity.example, 203.0.113.95. Shared with academic partners.',
      technique: 'T1199 Trusted Relationship',
      flavour: {
        compromise:
          'Collaboration platforms exist to let outsiders in, and the partner universities have security ' +
          'postures Verity does not control. You compromise the weakest partner and arrive with a legitimate ' +
          'collaborator account.',
        detect:
          'Partner account activity outside its project scope, and access patterns that do not match an ' +
          'academic working rhythm.',
        evidence:
          'A partner account browsing projects it is not attached to, from an address that geolocates ' +
          'inconsistently with the institution.',
        contain:
          'Partner access is scoped per project with time-boxed expiry, the account is suspended, and the ' +
          'partner institution is notified so it can investigate its own compromise.',
      },
    },
    {
      id: 'lims',
      label: 'Laboratory system (LIMS)',
      note: 'LIMS01, 10.130.9.30. Sample tracking and assay results.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The laboratory information system holds results. Altering them is more damaging than stealing them: ' +
          'if the integrity of assay data is in doubt, the regulator may require the affected work to be ' +
          'repeated, and a late-stage trial delay costs more than the research is worth to a competitor.',
        detect:
          'Audit trail integrity checks, which regulated systems are required to keep and which are therefore ' +
          'unusually good here. Any result modified without an audit entry is a hard alert.',
        evidence:
          'Nine assay results altered with no corresponding audit trail entries, in a study approaching ' +
          'submission.',
        contain:
          'Results are restored from the validated backup, the audit gap is documented for the regulator, and ' +
          'the affected study data is quarantined pending an integrity assessment.',
      },
    },
    {
      id: 'mes',
      label: 'Manufacturing execution',
      note: 'MES01, 172.21.5.20. Batch records. Validated system, patched only on revalidation.',
      technique: 'T0873 Project File Infection',
      flavour: {
        compromise:
          'The manufacturing execution system is validated, which in practice means frozen. Known ' +
          'vulnerabilities remain open for months because closing them requires a revalidation exercise. This ' +
          'is the compliance-versus-security tension in its purest form.',
        detect:
          'Network monitoring and application allowlisting, because patching is not available as a response. ' +
          'When you cannot fix, you must watch, and that trade should be a documented risk decision.',
        evidence:
          'An unapproved executable on the manufacturing host and an outbound connection from a segment with ' +
          'no legitimate egress.',
        contain:
          'The host is network-isolated while production continues on the parallel line, and remediation is ' +
          'scheduled into the next validation window. Immediate reimaging is not available, which is the ' +
          'lesson.',
      },
    },
    {
      id: 'coldchain',
      label: 'Cold chain monitoring',
      note: 'CHAIN01, 172.21.5.40. Temperature monitoring for storage and transport.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Cold chain monitoring proves product stayed within temperature. Suppressing an excursion means ' +
          'compromised product ships as good; fabricating one means good product is destroyed. Both are ' +
          'attacks on trust in the record rather than on the product.',
        detect:
          'Independent sensor correlation and gap analysis: continuous monitoring should have no gaps, so a ' +
          'missing interval is itself the signal.',
        evidence:
          'A four-hour reporting gap for one storage unit, followed by backfilled readings that are ' +
          'suspiciously smooth compared to the unit historical variance.',
        contain:
          'Affected batches are quarantined pending physical testing, monitoring is restored with a second ' +
          'independent sensor path, and the excursion is reported to quality assurance.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.130.9.5. Identity for research and corporate.',
      technique: 'T1558.003 Steal or Forge Kerberos Tickets: Kerberoasting',
      flavour: {
        compromise:
          'Service accounts for the laboratory and manufacturing applications are old, have service principal ' +
          'names, and have passwords set once in 2016. Request the tickets, crack them offline, and you have ' +
          'application-level access without ever touching the applications.',
        detect:
          'Event 4769 showing RC4-encrypted service ticket requests in volume from one principal.',
        evidence:
          'Thirty service ticket requests in two minutes, all RC4, covering every application service account ' +
          'in the domain.',
        contain:
          'Service account passwords rotated to long random values, group managed service accounts adopted, ' +
          'RC4 disabled, and unnecessary service principal names removed.',
      },
    },
    {
      id: 'vault',
      label: 'Formulation vault',
      note: 'VLT01, 10.130.9.10. Composition, process and trial data. The objective.',
      crown: true,
      technique: 'T1530 Data from Cloud Storage',
      flavour: {
        compromise:
          'Eleven years of development, taken unseen. The formulation, the process parameters and the trial ' +
          'data together are enough for a competitor in a jurisdiction with weak enforcement to file first. ' +
          'The loss is not recoverable by any technical means, which is what makes intellectual property theft ' +
          'a different category from an outage.',
        detect:
          'Data loss prevention on the classified document set, and access anomaly detection on a repository ' +
          'that should see a handful of reads per week from a named group.',
        evidence:
          'The full formulation set read and uploaded to an external storage provider over four hours by an ' +
          'account that is on the research group but not the formulation team.',
        contain:
          'Access is cut to the formulation team only, egress to unsanctioned storage is blocked, legal ' +
          'counsel is engaged for patent priority protection, and the incident is reported to the national ' +
          'authority as economic espionage.',
      },
    },
  ],
});

/**
 * An airport, where availability is the whole product and the systems are owned
 * by a dozen different companies.
 *
 * The distinguishing feature of this board is that Blue does not own most of it.
 * Ground handling, catering and the airlines all run their own systems on the
 * same physical estate, so containment requires somebody else's agreement at
 * three in the morning. That coordination problem is the real lesson.
 */
export const AIRSIDE_PORTMORE = definePositional({
  id: 'bd-airside-portmore',
  title: 'Turnaround: Portmore Airport',
  brief:
    'Eight systems, three defences, eleven rounds. Red wants departure control, because an airport ' +
    'that cannot board passengers stops within the hour. Half of this estate belongs to other ' +
    'companies, so containment is a negotiation as much as a technical act.',
  maxTurns: 11,
  coverageBudget: 3,
  movesLeft: 3,
  terms: ['flight', 'departure', 'boarding', 'baggage', 'airline', 'handler', 'availability', 'turnaround'],
  dossier: {
    org: 'Portmore International Airport',
    summary:
      'A regional international airport handling about 9 million passengers a year. Systems are ' +
      'split across the airport operator, three ground handlers and the airlines, connected on a ' +
      'shared campus network with agreements rather than architecture. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Departure control, 10.140.2.10 (crown)' },
      { k: 'Campus network', v: '10.140.2.0/24' },
      { k: 'Airside systems', v: '172.22.6.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Blue coverage', v: '3 systems at a time, 3 repositions' },
      { k: 'Clock', v: '11 rounds' },
    ],
  },
  targets: [
    {
      id: 'wifi',
      label: 'Passenger wi-fi',
      note: 'Open guest network. Should be fully isolated from everything. Should be.',
      technique: 'T1200 Hardware Additions',
      flavour: {
        compromise:
          'Guest wi-fi is meant to be an island. A misconfigured switch port in a departure lounge, installed ' +
          'during a refurbishment, bridges it to the operational VLAN. Anyone with a boarding pass can sit in ' +
          'the lounge for six hours and nobody will ask.',
        detect:
          'Network access control and VLAN audit: any guest network client that can reach an operational ' +
          'address is a critical misconfiguration, and periodic automated reachability testing is how you find ' +
          'it before an attacker does.',
        evidence:
          'A guest network client with an operational VLAN address in the ARP table for the airside switch.',
        contain:
          'The port is shut, VLAN configuration audited across all lounge switches, and reachability testing ' +
          'added to the change process so refurbishments cannot reintroduce it.',
      },
    },
    {
      id: 'handler',
      label: 'Ground handler systems',
      note: 'Third-party ground handling. Their systems, their patching, your network.',
      technique: 'T1199 Trusted Relationship',
      flavour: {
        compromise:
          'The ground handler runs its own estate on the airport network with its own standards. You attack ' +
          'the handler and arrive inside the airport perimeter. The airport cannot patch it, cannot audit it ' +
          'properly, and cannot function without it.',
        detect:
          'Segmentation monitoring on the handler VLAN and alerting on any traffic from it toward airport ' +
          'operational systems outside the documented interfaces.',
        evidence:
          'SMB traffic from the handler VLAN to the airport operational database, which no documented ' +
          'interface uses.',
        contain:
          'The handler VLAN is restricted to its documented interfaces, and the handler is engaged to ' +
          'investigate. Contractual security requirements become the long-term control, which is a procurement ' +
          'fix for a technical problem.',
      },
    },
    {
      id: 'baggage',
      label: 'Baggage handling',
      note: 'BAG01, 172.22.6.30. Sortation control. Industrial control, not IT.',
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'Baggage sortation is an industrial control system with the availability requirements of one and the ' +
          'security posture of a 1990s PLC network. Stopping it does not stop flights immediately, but it stops ' +
          'them within two hours, and it is far easier to reach than departure control.',
        detect:
          'Protocol monitoring on the sortation network and alerting on parameter writes from any source that ' +
          'is not the sortation controller.',
        evidence:
          'Sortation routing parameters modified from a host on the handler VLAN during the morning peak.',
        contain:
          'Parameters are restored from the signed configuration, the segment is isolated, and baggage moves ' +
          'to manual sortation, which the airport can sustain for a few hours and no longer.',
      },
    },
    {
      id: 'flightinfo',
      label: 'Flight information displays',
      note: 'FIDS01, 10.140.2.40. The screens passengers read.',
      technique: 'T1491.001 Defacement: Internal Defacement',
      flavour: {
        compromise:
          'The display system is a low-value target with a high visibility payoff. It is often used as a ' +
          'diversion: a defacement across the terminal pulls the response team toward something harmless while ' +
          'the real work happens elsewhere. Recognising a diversion is a genuine incident response skill.',
        detect:
          'Content integrity monitoring on the display feed and alerting on any publish outside the scheduling ' +
          'system.',
        evidence:
          'Display content published directly to the rendering service rather than through the scheduler, at ' +
          'the same time as authentication activity against the operational database.',
        contain:
          'Displays are reverted, the publishing path is locked to the scheduler, and, crucially, the response ' +
          'team is told explicitly to keep watching everything else.',
      },
    },
    {
      id: 'ops',
      label: 'Airport operational database',
      note: 'AODB01, 10.140.2.50. Flight schedules, stands, gates, turnaround.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The operational database is the single source of truth every other system reads. Corrupt stand and ' +
          'gate allocations and the airport does not stop, it degrades into confusion, which is harder to ' +
          'diagnose and slower to recover from than an outright outage.',
        detect:
          'Referential integrity checks and change-rate monitoring: allocations change constantly, so the ' +
          'signal is the rate and the pattern, not the individual write.',
        evidence:
          'Four hundred stand allocations rewritten in ninety seconds, a rate no human process produces.',
        contain:
          'The database is restored to the last consistent snapshot, write access is restricted to the ' +
          'allocation service, and operations run from the printed contingency plan during recovery.',
      },
    },
    {
      id: 'security',
      label: 'Access control system',
      note: 'ACS01, 172.22.6.50. Doors, gates and airside passes.',
      technique: 'T1098 Account Manipulation',
      flavour: {
        compromise:
          'Issuing yourself a valid airside pass converts a cyber intrusion into physical access to aircraft. ' +
          'This is the point where the exercise crosses into aviation security regulation rather than ' +
          'information security.',
        detect:
          'Pass issuance auditing against the vetting system: any credential issued without a corresponding ' +
          'completed background check is a critical alert.',
        evidence:
          'Two airside passes issued at 23:40 with no vetting record and no issuing officer signed in.',
        contain:
          'The passes are revoked and the physical zones swept, the aviation security regulator and police are ' +
          'notified, and pass issuance is suspended pending a full reconciliation of every active credential.',
      },
    },
    {
      id: 'ad',
      label: 'Airport directory',
      note: 'DC01, 10.140.2.5. Airport operator staff identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Operator identity governs access to the operational systems, so the directory is one hop from ' +
          'everything the airport itself runs.',
        detect:
          'Event 4662 with the replication GUID from a principal that is not a domain controller.',
        evidence:
          'Directory replication from a workstation account in the terminal operations office at 02:50.',
        contain:
          'The account is disabled, krbtgt reset twice, and replication rights audited across the domain.',
      },
    },
    {
      id: 'dcs',
      label: 'Departure control',
      note: 'DCS01, 10.140.2.10. Check-in, boarding and load control. The objective.',
      crown: true,
      technique: 'T1499 Endpoint Denial of Service',
      flavour: {
        compromise:
          'Departure control decides who boards and how the aircraft is loaded. Without it there is no ' +
          'check-in, no boarding pass validation and no load sheet, and an aircraft cannot legally depart ' +
          'without a load sheet. Reaching it unseen means choosing the hour, and the obvious hour is the ' +
          'morning peak of a public holiday.',
        detect:
          'Availability and integrity monitoring on the load control function specifically, because that is ' +
          'the component whose loss grounds aircraft rather than merely inconveniencing passengers.',
        evidence:
          'The load control service failing repeatedly under crafted requests, from a host inside the campus ' +
          'network, during the first departure wave.',
        contain:
          'Airlines switch to their own backup departure control, load sheets are produced manually with a ' +
          'severe rate penalty, the affected component is isolated, and the airport declares a major incident ' +
          'because passenger flow must now be managed physically.',
      },
    },
  ],
});
