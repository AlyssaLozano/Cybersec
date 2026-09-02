/**
 * Board scenarios: healthcare and public sector.
 *
 * WHY FOUR TO A FILE
 *
 * A linear scenario carries a menu, a resolver, an attacker console and a host
 * log, so it earns a file of its own. A board scenario is an estate and its
 * words: the argument that scores it lives once in `positional-kit.ts`. Grouping
 * them by sector keeps the diff for "the hospital board" small and puts the
 * boards that share a threat model next to each other, which is how anyone
 * writing a new one will actually read them.
 *
 * THE STANDARD EVERY LINE HERE IS WRITTEN TO
 *
 * A student who plays one of these should be able to sit in an interview and say
 * what they did in the vocabulary the interviewer uses. So every system names
 * its ATT&CK technique, and the four outcome lines are specific rather than
 * atmospheric: the compromise says HOW and why it works, the detection names the
 * DATA SOURCE and the logic, the evidence names the ARTEFACT an analyst would
 * actually pull, and the containment gives the actions in order. "A webshell
 * appeared" is not something anyone can discuss; "an IIS worker process spawned
 * cmd.exe, which is Sysmon event 1 with a w3wp.exe parent" is.
 *
 * WHAT VARIES, AND WHY IT IS THE DIFFICULTY
 *
 * Board shape is where these differ mechanically. A five-system board with one
 * defence is a game Red should usually win, and the lesson is Blue's tempo: find
 * it and wall it before the clock matters. A nine-system board with four
 * defences is the opposite, and the lesson is Red's patience. Neither is
 * "harder" in the tier sense; they teach opposite halves.
 *
 * Every org here is fabricated, on `.example` names, with RFC 5737 documentation
 * ranges outside and RFC 1918 inside. Nothing resolves anywhere.
 */

import { definePositional } from './positional-kit.js';

/**
 * Ransomware, in the hours before anyone is asked for money.
 *
 * The teaching point is that the crown is not the thing that gets encrypted, it
 * is the thing that lets everything be encrypted at once. Red is not playing for
 * the EHR because patient data is valuable; Red is playing for it because a
 * hospital that cannot read its own records stops admitting people. Blue's real
 * decision is whether to spend coverage on the backup server, which is dull and
 * is exactly what a competent operator hits first: T1490, inhibit system
 * recovery, is what turns an outage into a payment.
 */
export const WARD_MERIDIAN = definePositional({
  id: 'bd-ward-meridian',
  title: 'Ward Hours: Meridian General',
  brief:
    'A ransomware crew already has a foothold in a 400-bed hospital and is working toward the ' +
    'point where it can encrypt everything at once. Red wins by reaching the electronic health ' +
    'record database unseen. Blue can actively watch two systems and has three chances to move ' +
    'one. Note which system a real operator hits before the encryption ever starts.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['ransom', 'encrypt', 'backup', 'restore', 'patient', 'clinical', 'downtime', 'recovery'],
  dossier: {
    org: 'Meridian General Hospital',
    summary:
      'A 400-bed acute hospital. Clinical systems sit on a flat internal segment the trust has ' +
      'been meaning to split for three years; EDR is deployed on corporate endpoints but not on ' +
      'clinical appliances, which is normal and is the gap. Red has a foothold already. ' +
      'Authorised exercise; no real patient data exists in this simulation.',
    facts: [
      { k: 'Objective', v: 'EHR database, 10.30.2.10 (crown)' },
      { k: 'Clinical segment', v: '10.30.2.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Identity', v: 'On-prem Active Directory, meridian.example' },
      { k: 'Telemetry', v: 'EDR on corporate endpoints, Windows security logs, WAF at the edge' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'portal',
      label: 'Patient portal',
      note: 'portal.meridian.example, 198.51.100.20. Internet facing IIS, .NET, appointment booking.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'Insecure deserialisation in the booking form gives code execution as the IIS application pool ' +
          'identity. You drop an .aspx web shell (T1505.003) under wwwroot/uploads and reach it over normal ' +
          'HTTPS, so no new port opens and no firewall rule changes. Low privilege, but it is a foothold that ' +
          'survives a reboot and lives in traffic nobody baselines.',
        detect:
          'WAF blocked a request whose body carried a serialised .NET object gadget chain. The signal that ' +
          'matters is not the block, it is the pattern: repeated malformed POSTs to one endpoint from one source.',
        evidence:
          'Sysmon event 1 showing w3wp.exe as the parent of cmd.exe. A web server spawning a command shell has ' +
          'no legitimate explanation, and it is the single highest value detection on any IIS host. Alongside it, ' +
          'a new .aspx in the uploads directory with a creation time outside every deployment window.',
        contain:
          'The application pool is stopped, the web shell removed, the host taken out of the load balancer and ' +
          'rebuilt from the golden image, and the pool identity credential rotated. The uploads directory is ' +
          'remounted with execute permission removed, which is the fix that stops the next one.',
      },
    },
    {
      id: 'vpn',
      label: 'Clinician VPN',
      note: 'vpn.meridian.example, 198.51.100.44. SSL VPN, password plus SMS, on-call staff at all hours.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'A consultant credential from an infostealer log, and the second factor is SMS, so it fell to a ' +
          'prompt the user answered at 2am while on call. You now authenticate as staff rather than exploit ' +
          'anything, which is why this is the hardest technique on the board to detect: every log entry you ' +
          'generate is a valid one.',
        detect:
          'A concurrent session for an account already authenticated from the ward network. Impossible travel ' +
          'is the classic rule, but the reliable one here is simple concurrency, because a clinician is not in ' +
          'two places at once.',
        evidence:
          'RADIUS accounting showing one account, two active tunnels, forty seconds apart, from two autonomous ' +
          'systems. Cross-referenced with the badge system, the clinician was physically on site.',
        contain:
          'The tunnel is terminated, the account disabled, the password reset out of band, and the user ' +
          're-enrolled onto a phishing-resistant factor. Conditional access is tightened to refuse a second ' +
          'concurrent session for the same principal.',
      },
    },
    {
      id: 'pacs',
      label: 'Imaging (PACS)',
      note: 'PACS01, 10.30.2.40. DICOM on 104/tcp. Vendor-managed, unpatched by contract, no EDR agent.',
      technique: 'T1210 Exploitation of Remote Services',
      flavour: {
        compromise:
          'An unauthenticated deserialisation bug in the DICOM listener, exploitable because the vendor support ' +
          'contract forbids patching outside their release train. The host runs as SYSTEM, has no EDR agent, and ' +
          'holds terabytes of legitimate traffic to hide in. This is the medical device problem in one box: the ' +
          'thing you cannot patch is the thing you must compensate for.',
        detect:
          'Network telemetry rather than host telemetry, because there is no agent. An outbound TLS session from ' +
          'the PACS VLAN to an address that is not the vendor, on a host that should only ever speak DICOM inward.',
        evidence:
          'NetFlow showing PACS01 initiating egress, which it has never done in ninety days of baseline, plus a ' +
          'scheduled task on the host with no corresponding change record.',
        contain:
          'The host is moved into a deny-by-default VLAN that permits DICOM to the modalities and nothing else. ' +
          'It is not rebuilt, because the vendor owns the build; it is fenced. That distinction is the real ' +
          'lesson of clinical containment.',
      },
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy system',
      note: 'RX01, 10.30.2.55. Dispensing and stock, with a service account into the EHR database.',
      technique: 'T1078.002 Domain Accounts',
      flavour: {
        compromise:
          'The value is not the pharmacy system, it is the service account it authenticates to the record ' +
          'database with. The connection string sits in a plaintext config file on disk (T1552.001) and the ' +
          'account was granted db_owner in 2019 because a migration needed it and nobody revoked it afterwards.',
        detect:
          'Database audit: the pharmacy service principal issuing queries outside its known statement set. A ' +
          'service account is the easiest thing on an estate to baseline, because it should do the same handful ' +
          'of things forever.',
        evidence:
          'The pharmacy service account reading patient demographic tables it has never touched in the audit ' +
          'history, from a session whose application name field does not match the dispensing software.',
        contain:
          'The service account password is rotated, its rights cut from db_owner to the three stored procedures ' +
          'it actually calls, and the connection string moved into a managed secret. Least privilege applied ' +
          'after the fact, which is when it usually gets applied.',
      },
    },
    {
      id: 'backup',
      label: 'Backup server',
      note: 'BKP01, 10.30.2.80. Backup catalogue, tape library, and the offsite replication job.',
      technique: 'T1490 Inhibit System Recovery',
      flavour: {
        compromise:
          'The backups are the whole game and every competent ransomware operator takes them first. Retention is ' +
          'cut to seven days, the offsite copy job is disabled, and shadow copies are deleted estate-wide. None ' +
          'of that encrypts anything, which is exactly why it goes unnoticed: the hospital still works perfectly ' +
          'until the moment it does not, and then it has no way back except paying.',
        detect:
          'Backup application audit log: an administrative login from a workstation rather than the console, ' +
          'followed by policy modification. Also vssadmin delete shadows on any host, which is Sysmon event 1 ' +
          'and has essentially no legitimate use.',
        evidence:
          'Retention policy changed from 35 days to 7, the replication job disabled, and the change made by an ' +
          'account whose owner was on annual leave. The job history shows the last successful offsite copy was ' +
          'four days ago.',
        contain:
          'Policy restored, jobs re-enabled, and retention made immutable so it cannot be shortened by an ' +
          'administrator at all. The backup console is moved onto a privileged access workstation and taken off ' +
          'the general domain, which is the control that would have prevented this outright.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.30.2.5. meridian.example. Every clinical account authenticates here.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'With replication rights you ask the domain controller to hand over password hashes using the same ' +
          'protocol a second DC would use. No code runs on the DC, nothing is dropped to disk, and to the server ' +
          'it looks like ordinary replication. That is why DCSync is the technique to be able to explain: it is ' +
          'an abuse of a legitimate feature rather than an exploit.',
        detect:
          'Windows event 4662 where the properties field contains the DS-Replication-Get-Changes-All GUID and ' +
          'the requesting principal is not a domain controller. That single rule is one of the highest value ' +
          'detections in an Active Directory estate.',
        evidence:
          'A 4662 replication request sourced from a workstation account at 02:20, followed by no corresponding ' +
          'DC computer object. There is no benign version of a workstation replicating the directory.',
        contain:
          'The account is disabled, the krbtgt account is reset twice to invalidate every Kerberos ticket, and ' +
          'replication rights are audited across the domain. The double krbtgt reset is the detail people miss ' +
          'and the reason an incident like this takes a weekend.',
      },
    },
    {
      id: 'ehr',
      label: 'EHR database',
      note: 'EHR01, 10.30.2.10. SQL Server. Every record in the hospital. The objective.',
      crown: true,
      technique: 'T1486 Data Encrypted for Impact',
      flavour: {
        compromise:
          'You reach the record database unseen, which means you choose the moment. A hospital that cannot read ' +
          'its own records diverts ambulances, cancels lists, and reverts to paper it has not drilled on. The ' +
          'clinical harm is the leverage, and that is the uncomfortable thing this scenario is meant to teach: ' +
          'the impact is measured in patients, not in records.',
        detect:
          'Database audit showing bulk table access from a host with no clinical role, or file telemetry showing ' +
          'high-entropy writes across the data volume at machine speed with the SQL service stopped first.',
        evidence:
          'A full extract begun at 04:00 by an account that has never run a report, and the SQL service stopped ' +
          'by a non-DBA account minutes beforehand so the data files could be opened for writing.',
        contain:
          'The database host is isolated at the switch port rather than shut down, so memory and volatile ' +
          'evidence survive for the investigation. Credentials are rotated estate-wide, the clinical incident ' +
          'plan is invoked, and the recovery decision is made from the last verified offsite copy.',
      },
    },
  ],
});

/**
 * Water treatment, where the wrong write is a public health event.
 *
 * The tightest board in the set on purpose: five systems, ONE defence, eight
 * rounds. Red should usually get there, and that is the lesson. In OT you rarely
 * have the budget to watch everything, so the defensive skill being drilled is
 * not prevention, it is noticing fast and containing before the last hop. Blue
 * that plays this like an IT board loses; Blue that walls the engineering
 * workstation early makes Red spend the clock.
 *
 * The techniques here are ICS ATT&CK (T0xxx) rather than enterprise, which is
 * itself worth knowing: OT has its own matrix because the objectives are
 * physical rather than informational.
 */
export const INTAKE_TIDEWATER = definePositional({
  id: 'bd-intake-tidewater',
  title: 'Intake: Tidewater Water Authority',
  brief:
    'Five systems, and Blue can only watch ONE. Red is working from the corporate network toward ' +
    'the chemical dosing controller. You will probably not stop them by guessing right; you stop ' +
    'them by finding them and walling the path before the last hop. Eight rounds, and the ' +
    'objective is physical rather than informational.',
  maxTurns: 8,
  coverageBudget: 1,
  movesLeft: 2,
  terms: ['dosing', 'plc', 'scada', 'safety', 'physical', 'process', 'operator', 'segment', 'purdue'],
  dossier: {
    org: 'Tidewater Water Authority',
    summary:
      'A municipal water treatment works serving about 90,000 people. Corporate IT and the plant ' +
      'network are separated by a firewall that has grown exceptions for a decade, which is the ' +
      'ordinary state of a real Purdue model. Simulated throughout: no command here reaches any ' +
      'real control system.',
    facts: [
      { k: 'Objective', v: 'Chlorine dosing PLC, 172.16.9.10 (crown)' },
      { k: 'Plant network (Level 1-2)', v: '172.16.9.0/24' },
      { k: 'Corporate (Level 4)', v: '10.40.1.0/24' },
      { k: 'Protocol', v: 'Modbus/TCP 502, unauthenticated by design' },
      { k: 'Blue coverage', v: '1 system at a time, 2 repositions' },
      { k: 'Clock', v: '8 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate IT',
      note: 'Office network, 10.40.1.0/24. Email and billing. Level 4 of the Purdue model.',
      technique: 'T1003.001 OS Credential Dumping: LSASS Memory',
      flavour: {
        compromise:
          'A finance workstation, and from it the cached credentials of an engineer who logged in to fix a ' +
          'printer. Reading LSASS memory gives you the material to move without ever knowing a password. Not ' +
          'the plant, but every OT intrusion on record started on the business network.',
        detect:
          'Sysmon event 10, process access to lsass.exe with a granted access mask of 0x1010 or 0x1410, from a ' +
          'process that is not a known security product. This is the highest signal-to-noise credential theft ' +
          'detection there is.',
        evidence:
          'A handle opened to LSASS by a binary running from a user profile directory, under an account whose ' +
          'owner does not write scripts, at 23:40.',
        contain:
          'The host is isolated and every credential cached on it is treated as burned and reset, including the ' +
          'engineer account. Credential Guard is enabled so the next attempt returns nothing useful.',
      },
    },
    {
      id: 'historian',
      label: 'Process historian',
      note: 'HIST01, 172.16.9.30. Dual-homed by design, Level 3. Talks to both networks legitimately.',
      technique: 'T0885 Commonly Used Port',
      flavour: {
        compromise:
          'The historian is the pivot every OT assessment finds, because it has to talk to both sides to do its ' +
          'job. It is the one host permitted across the boundary, so owning it means you inherit that permission ' +
          'rather than having to defeat the firewall.',
        detect:
          'Firewall log: an outbound session from the historian that matches no configured data feed. Because ' +
          'the historian has a tiny, fixed set of legitimate destinations, an allowlist here is genuinely ' +
          'achievable, which is rare.',
        evidence:
          'A remote access tool installed as a service on the one host that bridges the plant boundary, ' +
          'beaconing on 443 to an address outside the vendor range.',
        contain:
          'The bridge is closed to a strict allowlist, the historian is rebuilt, and the data flow is inverted ' +
          'to a one-way diode or a unidirectional gateway so the plant pushes out rather than the corporate ' +
          'network reaching in.',
      },
    },
    {
      id: 'ews',
      label: 'Engineering workstation',
      note: 'EWS01, 172.16.9.20. The only machine permitted to change controller logic. Level 2.',
      technique: 'T0866 Exploitation of Remote Services',
      flavour: {
        compromise:
          'The engineering workstation holds the vendor programming software and the project files. This is the ' +
          'machine that is allowed to rewrite the plant, so taking it means you do not have to attack the ' +
          'controller at all: you use the tool that is supposed to change it.',
        detect:
          'Application allowlisting on the engineering station, denying an unapproved binary. In OT the host set ' +
          'is small and static, so allowlisting is far more practical than it is in IT and should be the default.',
        evidence:
          'The vendor programming environment launched at 02:00 with no maintenance window booked, and a project ' +
          'file modified with a checksum that no longer matches the signed master copy.',
        contain:
          'The station is rebuilt and its project files restored from signed removable media held offline. ' +
          'Programming is then restricted to a physical key switch on the controller, which is a control an ' +
          'attacker on the network cannot reach at all.',
      },
    },
    {
      id: 'hmi',
      label: 'Operator HMI',
      note: 'HMI01, 172.16.9.40. What the operator on shift is looking at. Level 2.',
      technique: 'T0832 Manipulation of View',
      flavour: {
        compromise:
          'Owning the operator screen means owning what the operator believes. You can hold the displayed ' +
          'chlorine reading steady while the real value moves, which is the technique that made Stuxnet work and ' +
          'is the reason process safety cannot depend on the screen alone.',
        detect:
          'An unexpected RDP session to the HMI while an operator is signed in locally, correlated with the shift ' +
          'roster. The roster is the control that makes this detection work.',
        evidence:
          'Windows event 4624 logon type 10 on the HMI during a manned shift, sourced from the corporate side of ' +
          'the boundary, with no change ticket.',
        contain:
          'Remote access to the HMI is disabled entirely and the shift is moved to local control with manual ' +
          'readings taken at the sample point, so the physical process is verified independently of the screen.',
      },
    },
    {
      id: 'plc',
      label: 'Chlorine dosing PLC',
      note: 'PLC-CL2, 172.16.9.10. Modbus/TCP 502, no authentication in the protocol. Level 1.',
      crown: true,
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'You can write the dosing setpoint and nobody watched you get here. Modbus has no authentication in ' +
          'the protocol itself, so a write from a permitted address IS the authorisation. This is where a cyber ' +
          'exercise stops being about data: the failure mode is a public health event, and the only thing left ' +
          'between you and it is a mechanical safety interlock.',
        detect:
          'Protocol-aware monitoring on the plant segment alerting on a Modbus function code 6 or 16 write from ' +
          'any source that is not the engineering station. Passive OT monitoring exists precisely because the ' +
          'controller cannot defend itself.',
        evidence:
          'A write to the dosing setpoint register from the historian address rather than the engineering ' +
          'station, outside any maintenance window, with the value stepped in small increments to stay under ' +
          'the alarm threshold.',
        contain:
          'The setpoint is restored, the controller reloaded from the signed project file, programming is locked ' +
          'to the physical key switch, and the plant is run on manual dosing with laboratory confirmation until ' +
          'the integrity of the logic is proven.',
      },
    },
  ],
});

/**
 * Research theft, on the widest board in the set.
 *
 * Eight systems, three defences, twelve rounds. Universities are deliberately
 * open, so Blue actually has the budget to watch a reasonable fraction here, and
 * the lesson flips: with enough coverage, Blue's failure mode stops being "too
 * little" and becomes "spread thin, never containing anything". Red's lesson is
 * patience, because a big board rewards mapping before committing.
 */
export const THESIS_KINGSBRIDGE = definePositional({
  id: 'bd-thesis-kingsbridge',
  title: 'Thesis: Kingsbridge University',
  brief:
    'Eight systems and three defences, over twelve rounds. A state-aligned group wants unpublished ' +
    'materials research. A university is meant to be open, so Blue has room to watch, and the ' +
    'temptation is to watch everything a little instead of containing anything properly.',
  maxTurns: 12,
  coverageBudget: 3,
  movesLeft: 4,
  terms: ['research', 'academic', 'student', 'grant', 'publish', 'intellectual', 'open', 'federation'],
  dossier: {
    org: 'Kingsbridge University',
    summary:
      'A research university with a materials science group holding pre-publication work under a ' +
      'government grant. Open by culture, federated by identity, and impossible to lock down the ' +
      'way a bank would. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Research data store, 10.55.7.10 (crown)' },
      { k: 'Campus network', v: '10.55.7.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Identity', v: 'SAML federation, kingsbridge.example' },
      { k: 'Blue coverage', v: '3 systems at a time, 4 repositions' },
      { k: 'Clock', v: '12 rounds' },
    ],
  },
  targets: [
    {
      id: 'webmail',
      label: 'Staff webmail',
      note: 'mail.kingsbridge.example. Cloud mail, conditional access not enforced for legacy clients.',
      technique: 'T1566.002 Phishing: Spearphishing Link',
      flavour: {
        compromise:
          'A pretext built from a public conference programme, sent to a research administrator, landing on an ' +
          'adversary-in-the-middle page that relays the real login and steals the SESSION TOKEN rather than the ' +
          'password. That is what defeats ordinary multi-factor authentication, and it is why the answer is ' +
          'phishing-resistant factors rather than more prompts.',
        detect:
          'A sign-in from an unfamiliar autonomous system minutes after a link click, with a session that ' +
          'presents a valid token but no fresh authentication event.',
        evidence:
          'A mailbox rule created immediately after sign-in that files anything containing "grant" or ' +
          '"reviewer" into an obscure folder. Rule creation right after logon is the classic tell.',
        contain:
          'All refresh tokens for the principal are revoked, which is the step people forget: a password reset ' +
          'alone leaves the stolen session alive. The rule is deleted, the sender domain blocked, and the user ' +
          'moved to a hardware factor.',
      },
    },
    {
      id: 'vle',
      label: 'Learning environment',
      note: 'vle.kingsbridge.example, 203.0.113.60. Moodle-style platform, plugin architecture.',
      technique: 'T1505 Server Software Component',
      flavour: {
        compromise:
          'The teaching platform accepts plugins, and a plugin is code running inside a trusted application. Low ' +
          'value in itself, but the platform is trusted by the identity provider and by every student, which ' +
          'makes it a fine place to harvest sessions from.',
        detect:
          'File integrity monitoring on the plugin directory, alerting on any addition outside the change ' +
          'window. The platform changes rarely, so this is a quiet rule.',
        evidence:
          'A module plugin added at the weekend by an account with no development role, containing a base64 ' +
          'blob that is evaluated at runtime.',
        contain:
          'The plugin is removed, the platform restored from the last clean build, and plugin installation ' +
          'restricted to a deployment pipeline rather than the web interface.',
      },
    },
    {
      id: 'library',
      label: 'Library proxy',
      note: 'ezproxy.kingsbridge.example. Thousands of off-campus journal sessions daily.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'The journal proxy sees enormous legitimate traffic, so yours is a drop in it. Compromised university ' +
          'proxy credentials are a real and well-documented trade, because they are the cheapest way to bulk ' +
          'download paywalled literature.',
        detect:
          'Rate and breadth analysis: one account fetching faster than a human reads, across subject areas that ' +
          'do not match its department.',
        evidence:
          'Four thousand PDF fetches in an hour by a first-year account, spanning metallurgy, chemistry and ' +
          'materials, from an address block associated with a commercial VPN.',
        contain:
          'The account is throttled then disabled, proxy credentials rotated, and per-account rate limits ' +
          'applied so the next one is self-limiting rather than needing to be noticed.',
      },
    },
    {
      id: 'hpc',
      label: 'HPC cluster',
      note: 'hpc-login, 10.55.7.30. Shared compute, SSH key auth, long-lived jobs.',
      technique: 'T1098.004 Account Manipulation: SSH Authorized Keys',
      flavour: {
        compromise:
          'A login node on the cluster. Everyone has an account, keys are shared informally between ' +
          'collaborators, and nobody has a baseline for what normal looks like. Appending your own public key to ' +
          'an authorized_keys file is persistence that survives password resets entirely.',
        detect:
          'File integrity monitoring on authorized_keys across the cluster. These files change rarely and the ' +
          'change is always attributable, which makes this an unusually clean detection.',
        evidence:
          'A key appended to a file whose modification time had not changed in two years, with a comment field ' +
          'naming a user who left in 2023.',
        contain:
          'Keys are rotated cluster-wide, the node rebuilt from the image, and key management moved to a ' +
          'central authority with expiry, so a stale key cannot outlive its owner.',
      },
    },
    {
      id: 'grants',
      label: 'Grants office',
      note: 'GRANT01, 10.55.7.45. Funding records. Knows which research is worth stealing.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The grants system will not give you the research, it tells you where the research is: which projects ' +
          'are funded, by whom, under what classification, and who the principal investigator is. Targeting ' +
          'information is often the more valuable half of an espionage operation.',
        detect:
          'Reporting interface audit: a bulk query by an account that has never run a report. Repository access ' +
          'is hard to alert on generally, but "first time this principal has ever done this" is tractable.',
        evidence:
          'An export of funded projects with investigator names and classifications, run at 01:40, written to a ' +
          'personal share.',
        contain:
          'Export permissions are revoked, the account audited against its role definition, and reporting moved ' +
          'behind an approval step for anything above a row threshold.',
      },
    },
    {
      id: 'lab',
      label: 'Lab workstation',
      note: 'MSC-LAB4, 10.55.7.60. Instrument control, Windows 7, cannot be patched or replaced.',
      technique: 'T1021.002 Remote Services: SMB/Windows Admin Shares',
      flavour: {
        compromise:
          'An instrument workstation running an operating system that reached end of life years ago, kept ' +
          'because the electron microscope software will not run on anything newer. Everyone knows it is there ' +
          'and everyone has an exception for it. Lateral movement to it over the admin shares is trivial.',
        detect:
          'Windows event 5145 showing access to the ADMIN$ or C$ share, correlated with 4624 logon type 3 from ' +
          'a host that has no business talking to the lab VLAN.',
        evidence:
          'An administrative share connection into the lab segment at 04:00, when no experiment was scheduled ' +
          'and the building was locked.',
        contain:
          'The workstation is placed behind its own firewall policy allowing only the instrument protocol, and ' +
          'monitored rather than rebuilt, because the build belongs to the instrument vendor. Compensating ' +
          'control, not remediation, and knowing the difference is the point.',
      },
    },
    {
      id: 'idp',
      label: 'Identity provider',
      note: 'SAML federation. One credential opens every campus service.',
      technique: 'T1606.002 Forge Web Credentials: SAML Tokens',
      flavour: {
        compromise:
          'With the token signing certificate you can mint a SAML assertion for any user, with any claims, and ' +
          'every federated service will accept it because the signature is valid. You are no longer ' +
          'authenticating; you are issuing the answer. This is the golden SAML technique, and it is why identity ' +
          'infrastructure is tier zero.',
        detect:
          'Alerting on export of the token signing certificate, and on assertions presented to services with no ' +
          'corresponding authentication event at the identity provider. The absence of the login is the signal.',
        evidence:
          'A new federation trust added by an administrator who was on annual leave, and service sign-ins whose ' +
          'assertions carry an issuer instant that does not match any recorded logon.',
        contain:
          'Signing certificates are rolled twice, every session campus-wide is revoked, and federation trusts ' +
          'are audited. Recovery from a forged-token compromise is slow because trust itself has to be rebuilt.',
      },
    },
    {
      id: 'research',
      label: 'Research data store',
      note: 'RDS01, 10.55.7.10. Unpublished materials work under grant. The objective.',
      crown: true,
      technique: 'T1567.002 Exfiltration to Cloud Storage',
      flavour: {
        compromise:
          'Five years of unpublished work, taken without anyone seeing you arrive. Exfiltration goes to a ' +
          'mainstream cloud storage provider over HTTPS, because that traffic is already allowed, already ' +
          'encrypted, and already enormous on a campus network. It will be published by someone else.',
        detect:
          'Data loss prevention or egress volume analysis: an upload volume anomaly to a cloud storage domain ' +
          'from a host that holds restricted project data.',
        evidence:
          'The whole project tree read sequentially overnight, compressed into split archives sized to avoid a ' +
          'single large transfer, then uploaded across four hours.',
        contain:
          'The share is locked to project members only, egress to unsanctioned cloud storage is blocked at the ' +
          'proxy, and the access log is preserved intact for the funder and the national authority, because ' +
          'this is a reportable research security incident.',
      },
    },
  ],
});

/**
 * Municipal ransomware, on the biggest board here.
 *
 * Nine systems and four defences. A council is a sprawl of small systems that
 * each matter to somebody, and the point of the size is that Red genuinely
 * cannot map it inside the clock. Red's discipline is to stop exploring and
 * commit; Blue's is to notice that the citizen registry is the only thing worth
 * standing in front of.
 */
export const REGISTRY_HAVENPORT = definePositional({
  id: 'bd-registry-havenport',
  title: 'Registry: Havenport City Council',
  brief:
    'Nine systems, four defences, twelve rounds. A council runs a lot of small services that each ' +
    'matter to somebody, and Red cannot map all of it in the time available. Red has to stop ' +
    'exploring and commit. Blue has to work out which single system is actually the objective.',
  maxTurns: 12,
  coverageBudget: 4,
  movesLeft: 4,
  terms: ['citizen', 'council', 'service', 'ransom', 'encrypt', 'statutory', 'resident', 'recovery'],
  dossier: {
    org: 'Havenport City Council',
    summary:
      'A city council of about 2,200 staff running housing, benefits, planning, licensing and ' +
      'social care on a mix of vendor systems, several past end of support. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Citizen registry, 10.60.4.10 (crown)' },
      { k: 'Council network', v: '10.60.4.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Blue coverage', v: '4 systems at a time, 4 repositions' },
      { k: 'Clock', v: '12 rounds' },
    ],
  },
  targets: [
    {
      id: 'website',
      label: 'Council website',
      note: 'www.havenport.example, 192.0.2.30. CMS with a file upload feature.',
      technique: 'T1505.003 Server Software Component: Web Shell',
      flavour: {
        compromise:
          'The upload handler checks the file extension but not the content, so a PHP shell arrives named as a ' +
          'JPEG and is then requested directly. Visible, low value, and a fine place to be ignored from.',
        detect:
          'Web server access log: a POST to the uploads directory followed by GET requests to a file in that ' +
          'directory with query parameters. Static content does not take parameters.',
        evidence:
          'A .php file in a directory that should hold only images, and access log entries showing it being ' +
          'called with a "cmd" parameter from a single source address.',
        contain:
          'The file is removed, the site restored from the last clean deployment, and the uploads directory ' +
          'remounted noexec with server-side content type validation added.',
      },
    },
    {
      id: 'benefits',
      label: 'Benefits system',
      note: 'BEN01, 10.60.4.25. Housing benefit claims and payment runs.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'Payments run through here, which makes it loud if you touch them and valuable if you are patient. ' +
          'The fraud path is to alter payee details on a small number of claims rather than to steal the data.',
        detect:
          'Application audit: a bulk claim query outside the nightly batch window, and any payee amendment ' +
          'without a second approver.',
        evidence:
          'A claims report run at 23:50 by an account that works days, followed by payee amendments on eleven ' +
          'claims, all to two destination accounts.',
        contain:
          'The account is suspended, amendments reverted, the payment run held before release, and the vendor ' +
          'engaged for a compromise assessment of the application.',
      },
    },
    {
      id: 'planning',
      label: 'Planning portal',
      note: 'PLAN01, 10.60.4.35. Internet facing, contractor accounts, no MFA.',
      technique: 'T1110.003 Brute Force: Password Spraying',
      flavour: {
        compromise:
          'One password tried against every account rather than every password against one, which stays under ' +
          'per-account lockout thresholds entirely. Dormant contractor accounts are the reliable win: nobody ' +
          'notices a login on an account nobody uses.',
        detect:
          'Authentication log analysis by SOURCE rather than by account: many 4625 failures across many distinct ' +
          'accounts from one address, followed by one 4624 success. Per-account rules never catch spraying.',
        evidence:
          'A successful login for a contractor account dormant since 2024, from an address that had just failed ' +
          'against ninety other usernames.',
        contain:
          'Dormant accounts are disabled across the portal, MFA is enforced for external access, and ' +
          'source-based rate limiting is added at the edge.',
      },
    },
    {
      id: 'socialcare',
      label: 'Social care records',
      note: 'CARE01, 10.60.4.50. Vulnerable adults and children. Separately governed.',
      technique: 'T1530 Data from Information Repositories',
      flavour: {
        compromise:
          'Among the most sensitive data any council holds, and the category that turns a service outage into a ' +
          'safeguarding incident. Access control here is by team geography, which is enforced in the ' +
          'application rather than the database.',
        detect:
          'Records system audit: case access outside the worker geography, and volume anomalies against a ' +
          'caseworker baseline.',
        evidence:
          'Case files opened in bulk across three teams by one account in one evening, none of them on that ' +
          "worker's caseload.",
        contain:
          'Access is cut to caseload scope, the information governance team is notified, and the regulator ' +
          'clock starts, because this category carries a statutory reporting duty.',
      },
    },
    {
      id: 'finance',
      label: 'Finance and payroll',
      note: 'FIN01, 10.60.4.55. Supplier payments and staff pay.',
      technique: 'T1098 Account Manipulation',
      flavour: {
        compromise:
          'Supplier bank details live here, which is its own kind of payday and does not require any encryption ' +
          'at all. Mandate fraud is quieter than ransomware and frequently more profitable.',
        detect:
          'Any supplier bank detail change without dual authorisation, alerted in real time. This is a business ' +
          'process control that produces a security detection, which is the pattern worth learning.',
        evidence:
          'Three supplier records amended in one session, all to the same new account number, by an account ' +
          'that had never edited a supplier record before.',
        contain:
          'Changes reverted, dual authorisation enforced technically rather than by policy, the payments run ' +
          'held, and the receiving bank contacted while recall is still possible.',
      },
    },
    {
      id: 'fileshare',
      label: 'Corporate file share',
      note: 'FS01, 10.60.4.60. Twenty years of documents, permissions never reviewed.',
      technique: 'T1074.001 Data Staged: Local Data Staging',
      flavour: {
        compromise:
          'Enormous, disorganised, and the natural place to stage from before anything leaves. Staging is a ' +
          'distinct step and it is the last good chance to catch an operation before the data is gone.',
        detect:
          'File server auditing for mass access at machine speed, and for archive creation in unusual locations. ' +
          'Honeypot files in old directories are cheap and disproportionately effective here.',
        evidence:
          'Two hundred thousand files opened in eleven minutes by one session, and a multi-part archive written ' +
          'into a departmental folder nobody has used since 2019.',
        contain:
          'The share is set read-only, the session terminated, the staged archive preserved as evidence rather ' +
          'than deleted, and permissions reviewed against actual use.',
      },
    },
    {
      id: 'backup',
      label: 'Backup infrastructure',
      note: 'BKP01, 10.60.4.70. Domain-joined, which is the flaw.',
      technique: 'T1490 Inhibit System Recovery',
      flavour: {
        compromise:
          'Domain-joined backup infrastructure fails with the domain. Jobs are disabled one by one in reverse ' +
          'order of importance so the dashboard stays green longest, and the council loses the only answer to a ' +
          'ransom demand that is not payment.',
        detect:
          'Backup console audit: a login from outside the administrative subnet, and any job disabled outside ' +
          'the change process.',
        evidence:
          'Six jobs disabled over forty minutes, oldest and least monitored first, from a session that ' +
          'authenticated with a domain administrator credential.',
        contain:
          'Jobs restored, immutable retention enabled, and the backup estate taken off the domain onto separate ' +
          'credentials, which is the architectural fix rather than the incident fix.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.60.4.5. Every council account.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Replication rights let you request password hashes using the protocol a second domain controller ' +
          'would use. Nothing executes on the DC, so host-based detection on the DC itself sees nothing.',
        detect:
          'Windows event 4662 containing the DS-Replication-Get-Changes-All GUID where the requester is not a ' +
          'domain controller.',
        evidence:
          'A workstation account performing directory replication at 02:20, with no matching computer object of ' +
          'type domain controller.',
        contain:
          'The account is disabled, krbtgt is reset twice to invalidate every outstanding ticket, and ' +
          'replication rights are audited across the domain.',
      },
    },
    {
      id: 'registry',
      label: 'Citizen registry',
      note: 'REG01, 10.60.4.10. Every resident the council knows about. The objective.',
      crown: true,
      technique: 'T1486 Data Encrypted for Impact',
      flavour: {
        compromise:
          'Every resident, every address, every entitlement, and nobody saw you take it. Councils are targeted ' +
          'because statutory services cannot simply stop, which shortens the decision time on a ransom ' +
          'considerably.',
        detect:
          'Database audit for a full extract through the reporting interface, and file telemetry for ' +
          'high-entropy writes across the data volume.',
        evidence:
          'A complete resident extract written to a share that is not a reporting share, followed by the ' +
          'database service being stopped by a non-DBA account.',
        contain:
          'The host is isolated at the switch port to preserve volatile evidence, extracts are disabled, ' +
          'credentials rotated, and the regulator notified within the statutory window.',
      },
    },
  ],
});
