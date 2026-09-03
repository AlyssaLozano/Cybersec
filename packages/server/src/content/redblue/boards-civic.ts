/**
 * Board scenarios: broadcast, elections and a biobank.
 *
 * Three estates where the thing at stake is public trust or irreplaceable data
 * rather than money, and each bends the game in a way the corporate boards do
 * not.
 *
 * The broadcast board is about the integrity of what is transmitted: the danger
 * is not downtime but a false message going out under a trusted brand, which is
 * why the emergency alert path is the crown. The elections board is about
 * confidence as much as correctness: undermining belief in a result can matter as
 * much as changing a number, so availability and a verifiable paper trail are the
 * real defences, and the scenario is written to protect a process, not to touch
 * any real one. The biobank board is about data that cannot be reset and that
 * implicates people who were never asked: a genome is not a password, and it
 * belongs partly to your relatives.
 *
 * Same standard as the rest: every system names its ATT&CK technique, and the
 * four outcome lines carry the method, the detection logic, the artefact and the
 * containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside. The
 * elections board is a defensive training scenario about protecting a fictional
 * county's systems; it contains no real jurisdiction and no guidance for
 * influencing any real process.
 */

import { definePositional } from './positional-kit.js';

/**
 * A broadcast station, and the integrity-of-transmission problem.
 *
 * The lesson is that for a broadcaster the asset is not availability but what
 * goes out over the air under its name. The crown is the emergency alert and
 * playout path, because a false alert transmitted from a trusted source can cause
 * real panic, and it has happened.
 */
export const BROADCAST_SKYLINE = definePositional({
  id: 'bd-broadcast-skyline',
  title: 'On Air: Skyline Broadcasting',
  brief:
    'Six systems, two defences, nine rounds. For a broadcaster the danger is not going dark, it is a ' +
    'false message going out under a trusted name. Red wants the emergency alert and playout path; ' +
    'Blue is defending the integrity of what leaves the transmitter.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['broadcast', 'playout', 'transmit', 'alert', 'integrity', 'feed', 'air', 'trust'],
  dossier: {
    org: 'Skyline Broadcasting',
    summary:
      'A regional television and radio broadcaster carrying an emergency alert capability on behalf ' +
      'of the authorities. Newsroom and corporate IT connect to the broadcast chain more closely ' +
      'than they should. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Emergency alert and playout, 172.31.5.10 (crown)' },
      { k: 'Broadcast network', v: '172.31.5.0/24' },
      { k: 'Corporate', v: '10.118.1.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'newsroom',
      label: 'Newsroom systems',
      note: 'Editorial network, 10.118.1.0/24. Scripts, rundowns, running order.',
      technique: 'T1566.002 Phishing: Spearphishing Link',
      flavour: {
        compromise:
          'A journalist is phished through an adversary-in-the-middle page that steals the session. The ' +
          'newsroom is where the operator learns the running order and, more importantly, how the newsroom ' +
          'connects to the broadcast chain.',
        detect:
          'A sign-in with a valid token but no fresh authentication, for a newsroom account, from an ' +
          'unfamiliar network.',
        evidence:
          'A session presenting a token minutes after a link click, with no matching interactive logon.',
        contain:
          'Refresh tokens are revoked, the account moved to a hardware factor, and the sender domain blocked.',
      },
    },
    {
      id: 'automation',
      label: 'Broadcast automation',
      note: 'AUTO01, 172.31.5.30. Schedules and runs the on-air playlist.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The automation system runs the on-air schedule. Inserting or altering an item means your content ' +
          'plays out as if it were scheduled, under the station’s brand, at a time you choose. It is quieter ' +
          'than seizing the transmitter directly.',
        detect:
          'Integrity monitoring on the playout schedule and alerting on any change outside the traffic and ' +
          'scheduling workflow.',
        evidence:
          'A schedule item inserted outside the scheduling system, set to air during a peak slot, with the ' +
          'approval record untouched.',
        contain:
          'The item is removed, the schedule verified against approvals, and schedule changes restricted to ' +
          'the traffic system with a second check.',
      },
    },
    {
      id: 'ingest',
      label: 'Media ingest',
      note: 'INGEST01, 172.31.5.40. Where feeds and files enter the broadcast chain.',
      technique: 'T1080 Taint Shared Content',
      flavour: {
        compromise:
          'The ingest point is where external material enters the chain. Tainting a file here means it is ' +
          'trusted downstream by everything that plays it, so a single poisoned asset can carry your content ' +
          'to air without touching the playout system.',
        detect:
          'Integrity verification on ingested media against source hashes, and content-type validation on ' +
          'everything entering the chain.',
        evidence:
          'A media file whose hash changed after ingest, or an ingested asset whose declared type does not ' +
          'match its content.',
        contain:
          'The tainted asset is quarantined, ingest hardened with hash verification, and the chain scanned for ' +
          'anything that referenced it.',
      },
    },
    {
      id: 'master',
      label: 'Master control display',
      note: 'MCR-HMI, 172.31.5.50. What the master control operator watches.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Master control is the last human check before air. Showing the operator the intended output while a ' +
          'different signal goes to the transmitter defeats that check, which is how a hijacked broadcast ' +
          'reaches viewers before anyone in the building notices.',
        detect:
          'Off-air confidence monitoring: comparing the actual transmitted signal, received independently, ' +
          'against what master control believes it is sending.',
        evidence:
          'The master control display showing the scheduled programme while an independent off-air receiver ' +
          'shows different content.',
        contain:
          'The operator trusts the off-air monitor over the display, cuts to a known-good source or to bars, ' +
          'and treats the master control layer as compromised.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.118.1.5. Staff identity, which governs broadcast access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the broadcast network, so the directory is one hop from air. Replication ' +
          'rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a newsroom workstation at 02:30.',
        contain:
          'The account is disabled, krbtgt reset twice, and the broadcast network moved onto its own identity ' +
          'plane.',
      },
    },
    {
      id: 'alert',
      label: 'Emergency alert and playout',
      note: 'EAS01, 172.31.5.10. Transmits programming and official alerts. The objective.',
      crown: true,
      technique: 'T1491.002 Defacement: External Defacement',
      flavour: {
        compromise:
          'You reach the emergency alert and playout path unseen. You can transmit a false official warning to ' +
          'a whole region under a source people are trained to trust absolutely, and a fabricated alert about ' +
          'a disaster or attack can cause real panic and real harm before it is corrected. This has happened ' +
          'in reality through weakly secured alert equipment, and it is why the transmission path and the ' +
          'alert origination must be the most tightly held systems a broadcaster runs.',
        detect:
          'Origination controls on the alert system requiring authenticated, authorised initiation, off-air ' +
          'confidence monitoring of what is actually transmitted, and alarms on any alert activation outside ' +
          'the official process.',
        evidence:
          'An alert activation with no corresponding authorised request from the issuing authority, and an ' +
          'off-air monitor showing a warning the station never scheduled.',
        contain:
          'Transmission is cut to a safe source, the false alert is publicly retracted through every channel ' +
          'immediately, the alert system is rebuilt with authenticated origination, and the authorities are ' +
          'notified. Correcting the public record fast is as important as fixing the system.',
      },
    },
  ],
});

/**
 * County election infrastructure, and the confidence-as-well-as-correctness
 * problem.
 *
 * A DEFENSIVE training scenario about protecting a fictional county's election
 * systems. The lesson is that for elections, availability and a verifiable paper
 * trail matter as much as the raw tally, because undermining public confidence in
 * a result can be as damaging as altering it, and a system that cannot prove it
 * was correct is nearly as bad as one that was wrong. Nothing here concerns any
 * real jurisdiction, and it contains no method for influencing any real process;
 * it is about the blue-team job of defending the estate and the red-team job of
 * probing it in an authorised exercise.
 */
export const POLL_MARROW = definePositional({
  id: 'bd-poll-marrow',
  title: 'Chain of Custody: Marrow County',
  brief:
    'Seven systems, three defences, eleven rounds. A fictional county’s election estate, in an ' +
    'authorised exercise. The lesson is that confidence matters as much as correctness: the defences ' +
    'that count are availability and a verifiable paper trail, because a result nobody trusts is ' +
    'nearly as damaging as a wrong one.',
  maxTurns: 11,
  coverageBudget: 3,
  movesLeft: 3,
  terms: ['election', 'registration', 'tally', 'audit', 'paper', 'confidence', 'integrity', 'custody'],
  dossier: {
    org: 'Marrow County Elections (fictional)',
    summary:
      'The election office of an invented county, used for an authorised defensive exercise. Voter ' +
      'registration, poll-book preparation, results reporting and a public results website sit on a ' +
      'small network, with a legally required paper record as the source of truth. Fabricated ' +
      'throughout; no real jurisdiction is represented.',
    facts: [
      { k: 'Objective', v: 'Results reporting system, 10.119.2.10 (crown)' },
      { k: 'Office network', v: '10.119.2.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Source of truth', v: 'Paper ballots and printed poll books' },
      { k: 'Blue coverage', v: '3 systems at a time, 3 repositions' },
      { k: 'Clock', v: '11 rounds' },
    ],
  },
  targets: [
    {
      id: 'website',
      label: 'Public results website',
      note: 'results.marrow.example, 203.0.113.35. Where the public reads unofficial results.',
      technique: 'T1491.002 Defacement: External Defacement',
      flavour: {
        compromise:
          'The public website shows unofficial results on the night. Defacing it, or posting a false tally, ' +
          'does not change a single vote but can convince the public a result has been altered, which is a ' +
          'confidence attack rather than an integrity one, and often the easier and more effective play.',
        detect:
          'Integrity monitoring on the published content and alerting on any publish outside the official ' +
          'process, plus rehearsed public communications for a rapid correction.',
        evidence:
          'Result figures published to the site that do not match the official reporting system, posted ' +
          'outside the publishing workflow.',
        contain:
          'The site is reverted to the official figures, the discrepancy explained publicly and quickly, and ' +
          'publishing locked to the official process. The paper-backed official count is unaffected, which is ' +
          'the reassuring truth to communicate.',
      },
    },
    {
      id: 'registration',
      label: 'Voter registration',
      note: 'VREG01, 10.119.2.30. The roll of who is registered.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The registration database determines the printed poll books. Quiet alterations can cause confusion ' +
          'at polling places, which is a disruption and confidence attack, and this is exactly why poll books ' +
          'are printed in advance and provisional ballots exist as a safety net.',
        detect:
          'Change auditing on the registration roll with alerting on bulk edits, and reconciliation of the ' +
          'printed poll books against a known-good snapshot before election day.',
        evidence:
          'A batch of registration records altered outside the normal update process, days before printing.',
        contain:
          'The roll is restored from the verified snapshot, poll books reprinted where needed, and provisional ' +
          'ballot procedures reinforced so no eligible voter is turned away.',
      },
    },
    {
      id: 'epollbook',
      label: 'Electronic poll books',
      note: 'EPB01, 10.119.2.40. Check-in devices used at polling places.',
      technique: 'T1499 Endpoint Denial of Service',
      flavour: {
        compromise:
          'Poll-book check-in devices, if disrupted, create queues and delays that look like chaos and feed a ' +
          'narrative of a failed election, without altering any vote. The defence is that paper backups let ' +
          'check-in continue, so the impact is contained if that fallback is ready.',
        detect:
          'Availability monitoring of the check-in devices and confirmation that printed backup poll books are ' +
          'distributed to every location.',
        evidence:
          'Check-in devices failing across multiple locations under crafted load or a pushed configuration ' +
          'error, during opening hours.',
        contain:
          'Locations fall back to printed poll books and continue checking voters in, the devices are ' +
          'restored, and the smooth fallback is communicated to counter any narrative of failure.',
      },
    },
    {
      id: 'workstations',
      label: 'Office workstations',
      note: 'Election staff endpoints, 10.119.2.0/24.',
      technique: 'T1566.001 Phishing: Spearphishing Attachment',
      flavour: {
        compromise:
          'An election worker opens a document that claims to be a procedural update. The macro loads a ' +
          'foothold. The office network is small and staff are seasonal, which makes it a soft entry point ' +
          'to the systems that matter.',
        detect:
          'Office spawning a scripting host on an election workstation, and beacons to newly registered ' +
          'domains, with heightened monitoring around the election period.',
        evidence:
          'A macro-enabled document opened by two staff, each followed by an encoded PowerShell command and a ' +
          'connection to a fresh domain.',
        contain:
          'The hosts are isolated and reimaged, credentials reset, macros blocked from internet documents, and ' +
          'the estate hunted for the same infrastructure.',
      },
    },
    {
      id: 'ad',
      label: 'Office directory',
      note: 'DC01, 10.119.2.5. Staff identity for the election office.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Office identity governs access to the reporting system, so the directory is one hop from the ' +
          'objective. Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an election workstation at 03:10.',
        contain:
          'The account is disabled, krbtgt reset twice, and reporting-system access separated onto its own ' +
          'credentials.',
      },
    },
    {
      id: 'backup',
      label: 'Backup and audit store',
      note: 'BKP01, 10.119.2.60. Holds system backups and the digital audit records.',
      technique: 'T1490 Inhibit System Recovery',
      flavour: {
        compromise:
          'Neutralising the backups and digital audit records would make it harder to prove the election ran ' +
          'correctly, feeding doubt. The decisive defence, though, is that the paper ballots remain the legal ' +
          'source of truth, so even a total digital loss can be recovered by hand count.',
        detect:
          'Backup and audit-store integrity monitoring, and confirmation that the paper records and their ' +
          'chain of custody are intact and independent of any system.',
        evidence:
          'Backups and audit logs deleted or altered ahead of the count, by a session using an administrator ' +
          'credential.',
        contain:
          'Digital records are restored where possible, and the count proceeds from the paper ballots under a ' +
          'risk-limiting audit, which is exactly why that paper trail is required.',
      },
    },
    {
      id: 'reporting',
      label: 'Results reporting system',
      note: 'RRS01, 10.119.2.10. Aggregates and reports the unofficial tally. The objective.',
      crown: true,
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'You reach the reporting system unseen and alter the unofficial tally it publishes. No actual ballot ' +
          'is changed, and the official result will ultimately come from the paper ballots, but a wrong number ' +
          'broadcast on the night can shake public confidence badly and is hard to walk back. The lesson is ' +
          'that in elections the target is often belief rather than the count itself, and the defences that ' +
          'matter are the ones that let you prove, from paper, what actually happened.',
        detect:
          'Reconciliation of reported figures against the paper-backed counts and the source precinct returns, ' +
          'integrity monitoring on the reporting database, and rehearsed communications to correct any public ' +
          'discrepancy fast.',
        evidence:
          'Reported vote totals that do not reconcile against the precinct paper returns, changed in the ' +
          'reporting database with no matching source data.',
        contain:
          'Reporting is corrected from the paper-backed returns, the discrepancy is explained publicly at ' +
          'once, a risk-limiting audit confirms the true result, and the reporting system is rebuilt. The ' +
          'paper trail is what makes the truth provable, which is the whole point of protecting it.',
      },
    },
  ],
});

/**
 * A genomic biobank, and the irreplaceable-data problem.
 *
 * The lesson is that genetic data is not like other personal data: it cannot be
 * reset, it is identifying for life, and it implicates blood relatives who never
 * consented. The crown is the sequence and sample database, and its loss is
 * permanent in a way no credential breach is.
 */
export const GENOME_HELIX = definePositional({
  id: 'bd-genome-helix',
  title: 'Kindred: Helix Biobank',
  brief:
    'Seven systems, two defences, ten rounds. Red wants the genomic database. Unlike every other ' +
    'crown, this data cannot be reset, it identifies people for life, and it exposes their relatives ' +
    'who were never asked. The loss is permanent in a way no password breach is.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['genome', 'genetic', 'sequence', 'sample', 'consent', 'relative', 'irreversible', 'research'],
  dossier: {
    org: 'Helix Biobank',
    summary:
      'A research biobank holding whole-genome sequences and linked health records for hundreds of ' +
      'thousands of participants, shared with academic and commercial researchers under consent. ' +
      'Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Sequence and sample database, 10.120.3.10 (crown)' },
      { k: 'Research network', v: '10.120.3.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Scale', v: 'Whole genomes and health records, hundreds of thousands' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'portal',
      label: 'Researcher portal',
      note: 'access.helix.example, 192.0.2.40. Where external researchers request and query data.',
      technique: 'T1078.004 Valid Accounts: Cloud Accounts',
      flavour: {
        compromise:
          'External researcher accounts belong to people at other institutions whose security you do not ' +
          'control. Credential stuffing or a compromised collaborator account gets you in as a legitimate ' +
          'researcher, which is the path of least resistance into a data-sharing platform.',
        detect:
          'Distributed authentication failures across researcher accounts, and access patterns that do not ' +
          'match a researcher’s approved project scope.',
        evidence:
          'A researcher account querying cohorts outside its approved study, from an address inconsistent with ' +
          'its institution.',
        contain:
          'The account is locked and reset, MFA enforced for the portal, and access re-scoped to approved ' +
          'projects only.',
      },
    },
    {
      id: 'analysis',
      label: 'Analysis environment',
      note: 'ANL01, 10.120.3.30. Compute where researchers run pipelines against the data.',
      technique: 'T1552.001 Unsecured Credentials: Credentials In Files',
      flavour: {
        compromise:
          'Analysis environments are built for iteration, so credentials end up in notebooks and pipeline ' +
          'scripts, and a copy of much of the data often lives close to the compute. It is frequently the ' +
          'easiest route to the sequences because it is the least controlled place they exist.',
        detect:
          'Secret scanning across the analysis repositories, and database authentications whose client string ' +
          'is a pipeline or notebook rather than the sanctioned application.',
        evidence:
          'A pipeline script containing a database credential in plain text, and that credential reading ' +
          'sequence data from hosts outside the analysis cluster.',
        contain:
          'The credential is rotated, secret scanning added to the pipeline, the local data copy minimised, ' +
          'and short-lived credentials adopted.',
      },
    },
    {
      id: 'lims',
      label: 'Sample tracking (LIMS)',
      note: 'LIMS01, 10.120.3.40. Tracks physical samples and links them to participants.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The sample-tracking system links physical biological samples to identified participants. It is the ' +
          'key that connects an anonymous sequence back to a named person, which is precisely the ' +
          're-identification link the biobank’s consent model depends on keeping separate.',
        detect:
          'Access auditing on the linkage data with alerting on any bulk read, which should be extremely rare ' +
          'and closely controlled.',
        evidence:
          'A bulk read of the sample-to-participant linkage table by an account with no legitimate need for ' +
          're-identification data.',
        contain:
          'Linkage access is restricted to the tiny authorised group, the read reviewed as an attempt at ' +
          're-identification, and the linkage store further separated from the sequence data.',
      },
    },
    {
      id: 'consent',
      label: 'Consent and governance',
      note: 'GOV01, 10.120.3.50. Records what each participant consented to.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Consent records govern what may lawfully be done with each participant’s data. Altering them could ' +
          'be used to justify access that no participant agreed to, turning a technical compromise into an ' +
          'ethical and legal one, because consent is the entire basis on which the biobank holds the data.',
        detect:
          'Integrity monitoring on consent records with alerting on any change outside the governance process, ' +
          'and reconciliation against signed consent documents.',
        evidence:
          'Consent scope fields widened on a batch of participants with no matching governance approval or ' +
          'signed document.',
        contain:
          'Consent records are restored from the authoritative source, any access made under the altered ' +
          'consent is reviewed and reversed, and the ethics committee and regulator are notified.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.120.3.5. Internal identity.',
      technique: 'T1558.003 Steal or Forge Kerberos Tickets: Kerberoasting',
      flavour: {
        compromise:
          'Service accounts for the data and analysis platforms are old, have service principal names and weak ' +
          'passwords. Request the tickets and crack them offline for application-level access without touching ' +
          'the applications.',
        detect:
          'Event 4769 for RC4-encrypted service ticket requests in volume from one principal.',
        evidence:
          'Thirty RC4 service ticket requests in two minutes from one account, covering the platform service ' +
          'principals.',
        contain:
          'Service account passwords rotated to long random values, group managed service accounts adopted, ' +
          'RC4 disabled, and unnecessary service principal names removed.',
      },
    },
    {
      id: 'egress',
      label: 'Outbound proxy',
      note: 'PRX01, 10.120.3.60. Controls what leaves the research network.',
      technique: 'T1030 Data Transfer Size Limits',
      flavour: {
        compromise:
          'Whole-genome data is enormous, so moving it out quietly means metering the transfer below the ' +
          'egress alarm over days. The exfiltration is the patient counterpart to whatever noisy technique got ' +
          'the access, and it is where a well-run operation stays under the radar.',
        detect:
          'Cumulative egress analysis per host over long windows, and alerting on sustained transfers to any ' +
          'single external destination.',
        evidence:
          'A steady flow of large compressed files to one external endpoint over a week, each transfer under ' +
          'the daily threshold.',
        contain:
          'The destination is blocked, egress limited, the cumulative transfer quantified, and the exposure ' +
          'assessed for notification.',
      },
    },
    {
      id: 'sequences',
      label: 'Sequence and sample database',
      note: 'SEQ01, 10.120.3.10. Whole genomes and linked health records. The objective.',
      crown: true,
      technique: 'T1530 Data from Cloud Storage',
      flavour: {
        compromise:
          'You reach the genomic database unseen. A stolen genome cannot be reissued like a card or reset like ' +
          'a password: it identifies a person for their entire life, reveals their predisposition to disease, ' +
          'and exposes their blood relatives who never enrolled and were never asked. It is the most ' +
          'irreversible data loss in the catalogue, and that permanence is the whole lesson: some data, once ' +
          'gone, is gone for good and for people beyond the ones whose it was.',
        detect:
          'Access and query auditing on the sequence store with alerting on any bulk read, egress correlation ' +
          'with the proxy, and separation of the sequence data from the re-identification linkage.',
        evidence:
          'A sequential read of the sequence database staged for slow exfiltration, by a session that reached ' +
          'it through the analysis environment.',
        contain:
          'The store is isolated, the exposure quantified, affected participants and the ethics committee and ' +
          'regulator notified, and the incident treated as permanent because no reset exists. The response ' +
          'centres on honesty to the people affected, not on a recovery that is not possible.',
      },
    },
  ],
});
