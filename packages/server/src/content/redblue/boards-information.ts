/**
 * Board scenarios: media, legal and cloud.
 *
 * Three boards about information rather than money or physics, and each one
 * bends the game in a different direction.
 *
 * The media board is the only one where losing puts a named person at risk
 * rather than an organisation, which changes what "acceptable residual risk"
 * can mean. The legal board is the only one where Red is already inside with
 * legitimate access, so the entire attack surface is authorisation rather than
 * intrusion. The cloud board is the only one with no network at all: there is
 * nothing to segment, and identity is the only perimeter that exists.
 *
 * Same standard: every system names its ATT&CK technique, and the four outcome
 * lines carry the method, the detection logic, the artefact and the containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * Source protection, where the threat model is a state and the asset is a person.
 *
 * This board exists to make one point that no amount of corporate security
 * training conveys: sometimes the data IS somebody's safety, and the defensive
 * standard is therefore higher than "reasonable". Blue cannot accept a residual
 * risk here in the way it could on a retail board, because the residual risk is
 * a person being arrested.
 */
export const SOURCE_BEACON = definePositional({
  id: 'bd-source-beacon',
  title: 'Off the Record: Beacon Media',
  brief:
    'Six systems, two defences, ten rounds. Red is a state-aligned group trying to identify a ' +
    'confidential source. Everything on this board that would be an acceptable risk at a normal ' +
    'company is unacceptable here, because the consequence of losing is not a fine.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['source', 'journalist', 'anonymity', 'metadata', 'confidential', 'protect', 'identify', 'leak'],
  dossier: {
    org: 'Beacon Media Group',
    summary:
      'An investigative newsroom of about 200 staff, working on a story involving a foreign ' +
      'government. Sources are protected by legal privilege and by operational practice, and the ' +
      'operational practice is the part an attacker can defeat. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Source vault, 10.150.3.10 (crown)' },
      { k: 'Editorial network', v: '10.150.3.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Threat', v: 'State-aligned, well resourced, patient' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'journalist',
      label: 'Journalist devices',
      note: 'Laptops and phones, often travelling, often on networks nobody controls.',
      technique: 'T1068 Exploitation for Privilege Escalation',
      flavour: {
        compromise:
          'A zero-click message exploit against the phone. No link is clicked and no attachment is opened, ' +
          'which means every piece of user awareness training in the world is irrelevant here. Commercial ' +
          'spyware sold to states does exactly this, and journalists are among its most documented targets.',
        detect:
          'Mobile device attestation and crash telemetry: repeated unexplained crashes in a messaging process ' +
          'are one of the few available signals, because the implant leaves almost nothing else. Lockdown ' +
          'modes exist precisely for this population.',
        evidence:
          'Three crash reports in the messaging framework over one week on a device that had never crashed, ' +
          'and a process making network connections after the application closed.',
        contain:
          'The device is preserved rather than wiped, because it is evidence in a case that may become a legal ' +
          'and diplomatic matter. The journalist is issued a clean device, moved to a hardened profile, and ' +
          'the source is warned through a channel the compromised device never saw.',
      },
    },
    {
      id: 'securedrop',
      label: 'Anonymous submission system',
      note: 'Tip submission platform, isolated by design, on separate hardware.',
      technique: 'T1040 Network Sniffing',
      flavour: {
        compromise:
          'The submission system itself is well built and separate. The weakness is the metadata around it: ' +
          'who connected, when, and from where. You do not need the message content if the connection timing ' +
          'narrows the source to three people.',
        detect:
          'Monitoring for any logging that should not exist. On a system designed to hold no records, the ' +
          'appearance of a log is itself the incident, which is an unusual and instructive inversion.',
        evidence:
          'A packet capture process running on the submission gateway, and connection timestamps being written ' +
          'to a file on a system whose entire design forbids retention.',
        contain:
          'The capture is stopped and the collected metadata destroyed, the platform is rebuilt from verified ' +
          'media, and affected sources are contacted out of band. Destroying evidence is normally wrong; here ' +
          'the metadata is the danger.',
      },
    },
    {
      id: 'cms',
      label: 'Editorial system',
      note: 'CMS01, 10.150.3.30. Drafts, notes and unpublished stories.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'Unpublished drafts and reporter notes. Notes are where source identities leak, because a reporter ' +
          'writing at speed uses a name they would never publish. The story is not the prize; the working ' +
          'material around it is.',
        detect:
          'Access auditing on unpublished material, with alerting on any access to a story by an account not ' +
          'on its byline or desk.',
        evidence:
          'Draft revisions for one investigation opened by an account from another desk, at 02:00, including ' +
          'revisions that were later deleted.',
        contain:
          'Access is scoped per story, sensitive investigations are moved to a compartmented workspace, and ' +
          'the reporting team is briefed to keep identifying detail out of the system entirely.',
      },
    },
    {
      id: 'mail',
      label: 'Newsroom mail',
      note: 'Cloud mail for 200 staff. Calendars, contacts, everything.',
      technique: 'T1114.002 Email Collection: Remote Email Collection',
      flavour: {
        compromise:
          'Mail is a social graph with timestamps. Even without reading a single message, the pattern of who ' +
          'contacted whom and when is often enough to identify a source, which is why metadata retention is a ' +
          'press freedom issue and not a technicality.',
        detect:
          'Alerting on mailbox delegation and on API-based bulk access, particularly any application granted ' +
          'mail read permission across the tenant.',
        evidence:
          'An OAuth application granted tenant-wide mail read permission by a user who did not understand the ' +
          'consent screen, then reading 40 mailboxes over three days.',
        contain:
          'The application consent is revoked, tokens invalidated, user consent to applications disabled ' +
          'tenant-wide, and the exposure window reconstructed for every affected correspondent.',
      },
    },
    {
      id: 'ad',
      label: 'Identity provider',
      note: 'Single sign-on for the newsroom.',
      technique: 'T1556.006 Modify Authentication Process: Multi-Factor Authentication',
      flavour: {
        compromise:
          'Registering an additional authentication factor on an account is quiet persistence that survives ' +
          'password resets completely. The account keeps working normally for its owner, which is what makes ' +
          'it so much better than stealing a password.',
        detect:
          'Alerting on every MFA method registration, and reconciling it against a helpdesk ticket. This is a ' +
          'low-volume, high-value event that most organisations do not watch.',
        evidence:
          'A second authenticator registered to an editor account at 03:30 from an unfamiliar address, with ' +
          'no helpdesk ticket and the original factor still active.',
        contain:
          'The rogue factor is removed, all sessions revoked, the account re-enrolled in person, and MFA ' +
          'registration restricted to trusted locations or a verified process.',
      },
    },
    {
      id: 'vault',
      label: 'Source vault',
      note: 'VLT01, 10.150.3.10. Identities of confidential sources. The objective.',
      crown: true,
      technique: 'T1555 Credentials from Password Stores',
      flavour: {
        compromise:
          'The source vault, reached unseen. This is the only crown in the whole catalogue whose loss is ' +
          'measured in someone being arrested rather than in money or downtime. It is the reason newsrooms ' +
          'increasingly keep source identities out of any system at all, and why the strongest control here is ' +
          'not encryption but never writing it down.',
        detect:
          'Vault access logging with alerting on every single read, because legitimate access is rare enough ' +
          'that per-event review is genuinely feasible. Break-glass procedures with dual control belong here.',
        evidence:
          'A vault decryption at 04:10 by an editor credential, from a device that is not the editor ' +
          'registered device, with no corresponding editorial decision recorded.',
        contain:
          'Vault access is suspended, affected sources are warned immediately through pre-agreed out-of-band ' +
          'channels, and legal counsel and a press freedom organisation are engaged. Warning the sources takes ' +
          'priority over preserving the investigation, which is the ethical call this board is built to force.',
      },
    },
  ],
});

/**
 * The insider, where nothing is exploited and everything is authorised.
 *
 * Every other board has Red breaking in. Here Red already has legitimate access
 * and the whole game is about the difference between permitted and appropriate.
 * That makes the detections behavioural rather than technical, and it makes
 * containment a human resources and legal problem before it is a security one:
 * moving too early destroys the evidence and the employment case at once.
 */
export const MATTER_KESTREL = definePositional({
  id: 'bd-matter-kestrel',
  title: 'Privilege: Kestrel and Vance',
  brief:
    'Five systems, one defence, nine rounds. Red is a partner who has already resigned and has not ' +
    'told anyone yet. Nothing here is exploited; everything is authorised. Blue is looking for the ' +
    'gap between what someone is allowed to do and what they should be doing.',
  maxTurns: 9,
  coverageBudget: 1,
  movesLeft: 3,
  terms: ['insider', 'privilege', 'authorised', 'client', 'confidential', 'leaver', 'behaviour', 'baseline'],
  dossier: {
    org: 'Kestrel and Vance LLP',
    summary:
      'A commercial law firm of about 400 people. Partners have broad access by professional ' +
      'necessity, and the firm competes for lateral hires who bring their client following with ' +
      'them. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Client matter archive, 10.160.5.10 (crown)' },
      { k: 'Firm network', v: '10.160.5.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Threat', v: 'Authorised insider, no exploitation required' },
      { k: 'Blue coverage', v: '1 system at a time, 3 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'workstation',
      label: 'Partner workstation',
      note: 'A firm laptop with legitimate access to almost everything.',
      technique: 'T1052.001 Exfiltration Over Physical Medium: USB',
      flavour: {
        compromise:
          'No exploitation, no malware, no alert. A partner copies files to a personal drive using access they ' +
          'legitimately hold. The only thing distinguishing this from a normal Tuesday is volume and context, ' +
          'which is why insider detection is behavioural or it does not exist.',
        detect:
          'Endpoint DLP on removable media, and volume baselining per user. The rule that works is a change ' +
          'against that individual own history, not a global threshold.',
        evidence:
          'Eleven gigabytes copied to a removable device in one evening by a user whose 90-day median is four ' +
          'megabytes.',
        contain:
          'Nothing visible, at first. The evidence is preserved forensically, legal and HR are engaged, and ' +
          'access is only removed once the case is built, because tipping off the insider loses both the ' +
          'evidence and the employment claim.',
      },
    },
    {
      id: 'dms',
      label: 'Document management',
      note: 'DMS01, 10.160.5.30. Every client document. Partners see across matters by design.',
      technique: 'T1530 Data from Cloud Storage',
      flavour: {
        compromise:
          'The document system is designed to let partners see broadly, because conflict checking and ' +
          'supervision require it. That design decision is the vulnerability, and it cannot simply be removed ' +
          'without breaking the professional obligations it exists to serve.',
        detect:
          'Access breadth analysis: a partner opening matters outside their practice area and outside their ' +
          'billing history. Cross-referencing document access against time recording is the trick, and it uses ' +
          'a system the firm already runs.',
        evidence:
          'Four hundred documents opened across sixty matters in two days, none of them matters the partner ' +
          'has recorded billable time against in three years.',
        contain:
          'Access is monitored rather than cut, so the investigation can complete. Matter-level access ' +
          'controls are introduced afterwards, scoped so supervision still works.',
      },
    },
    {
      id: 'email',
      label: 'Firm email',
      note: 'Cloud mail. Client correspondence, privileged and confidential.',
      technique: 'T1048.003 Exfiltration Over Alternative Protocol',
      flavour: {
        compromise:
          'Forwarding to a personal address is the oldest insider technique there is, and it still works ' +
          'because it looks exactly like someone catching up on email at home. Auto-forward rules do it ' +
          'without any further action.',
        detect:
          'Auto-forward rules to external domains, alerted on creation and blocked by policy by default. This ' +
          'is one of the highest value, lowest effort controls available in any cloud mail tenant.',
        evidence:
          'A rule forwarding anything containing a client name to a personal address, created three days ' +
          'before the resignation date.',
        contain:
          'The rule is preserved as evidence before removal, external auto-forwarding is disabled ' +
          'tenant-wide, and the recipient account is recorded for the legal process.',
      },
    },
    {
      id: 'billing',
      label: 'Practice management',
      note: 'PMS01, 10.160.5.40. Time recording, billing and the client list.',
      technique: 'T1213 Data from Information Repositories',
      flavour: {
        compromise:
          'The client list with billing values attached is the single most commercially useful export from a ' +
          'law firm. It tells a competitor exactly which relationships are worth pursuing and what they are ' +
          'worth, and it is the classic artefact in a departing partner dispute.',
        detect:
          'Reporting audit: a client list export by a fee earner rather than by finance, which has no ' +
          'legitimate business purpose.',
        evidence:
          'A client and billing export run on a Sunday by a partner account, with no matching finance request.',
        contain:
          'Export rights are restricted to the finance function, the export is preserved for the legal case, ' +
          'and the firm partnership agreement enforcement process begins.',
      },
    },
    {
      id: 'archive',
      label: 'Client matter archive',
      note: 'ARC01, 10.160.5.10. Closed matters going back thirty years. The objective.',
      crown: true,
      technique: 'T1074.002 Data Staged: Remote Data Staging',
      flavour: {
        compromise:
          'The archive is thirty years of closed matters, which nobody watches because nobody uses it. It ' +
          'contains privileged material for clients who have long since stopped being clients and who never ' +
          'agreed to this risk. Taking it unseen is trivially easy precisely because it is dormant.',
        detect:
          'Any access at all to the archive is worth alerting on, because the legitimate rate is close to ' +
          'zero. Dormant systems are the easiest thing in an estate to monitor well and the most commonly ' +
          'forgotten.',
        evidence:
          'Sixty gigabytes read from an archive that averages two reads a month, staged to a personal folder ' +
          'on the main file share first.',
        contain:
          'The archive is set read-only with access by request, the staged copy is preserved, and the firm ' +
          'notifies affected former clients and its professional regulator, because privilege belongs to the ' +
          'client and its loss is reportable.',
      },
    },
  ],
});

/**
 * Cloud, where there is no network to defend.
 *
 * The last board, and the one most unlike the others: no segments, no lateral
 * movement in the traditional sense, and nothing to unplug. Every step is an
 * identity or an API call, every action is in an audit log if anyone is reading
 * it, and the blast radius is defined by permissions rather than by topology.
 * A student who has played the other fifteen and then this one should be able to
 * say clearly why "assume breach" and "identity is the perimeter" are not slogans.
 */
export const TENANT_LUMEN = definePositional({
  id: 'bd-tenant-lumen',
  title: 'Blast Radius: Lumen Analytics',
  brief:
    'Seven systems, two defences, ten rounds, and no network anywhere. Everything here is an ' +
    'identity or an API call. There is nothing to segment and nothing to unplug, so Blue is ' +
    'defending permissions rather than machines.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['identity', 'token', 'role', 'permission', 'tenant', 'api', 'federation', 'privilege', 'audit'],
  dossier: {
    org: 'Lumen Analytics',
    summary:
      'A software company of about 700 people running entirely in public cloud, serving analytics ' +
      'to enterprise customers. No corporate network to speak of: laptops, an identity provider, ' +
      'and a cloud tenant. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Production tenant administration (crown)' },
      { k: 'Estate', v: 'Public cloud, no corporate network' },
      { k: 'Identity', v: 'Cloud identity provider, SSO to everything' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'devlaptop',
      label: 'Engineer laptops',
      note: 'Managed devices holding cloud CLI credentials cached on disk.',
      technique: 'T1528 Steal Application Access Token',
      flavour: {
        compromise:
          'Cloud CLI tools cache long-lived refresh tokens on disk in predictable locations. Reading that file ' +
          'gives you the engineer cloud access without a password and, crucially, without triggering MFA, ' +
          'because the token already represents a completed authentication.',
        detect:
          'Cloud audit log: API calls using a token from an IP or device that does not match the token ' +
          'issuance context. Token binding and short lifetimes are the preventive controls.',
        evidence:
          'API calls authenticated with an engineer refresh token, originating from an autonomous system the ' +
          'engineer has never used, four hours after the laptop went to sleep.',
        contain:
          'All refresh tokens for the principal are revoked, token lifetime reduced, conditional access ' +
          'requires a compliant device, and the laptop is isolated and examined.',
      },
    },
    {
      id: 'cicd',
      label: 'CI/CD pipeline',
      note: 'Deployment automation with a role that can change production.',
      technique: 'T1078.004 Valid Accounts: Cloud Accounts',
      flavour: {
        compromise:
          'The pipeline role can deploy to production, which by definition means it can change production. A ' +
          'pull request that modifies the workflow file runs with that role, so the pipeline becomes a way to ' +
          'execute arbitrary actions in the cloud account with full authorisation.',
        detect:
          'Alerting on workflow file changes, and on any pipeline run whose actions differ from its declared ' +
          'deployment set. The pipeline should be as tightly reviewed as the code it deploys, and rarely is.',
        evidence:
          'A workflow modified in a branch to add a step that enumerates and exports secrets, run once, then ' +
          'reverted twelve minutes later.',
        contain:
          'The pipeline role is scoped down to specific resources, workflow changes require review from a ' +
          'separate group, secrets are moved to short-lived OIDC federation, and every secret the run could ' +
          'reach is rotated.',
      },
    },
    {
      id: 'secrets',
      label: 'Secrets manager',
      note: 'Central secret storage for every application credential.',
      technique: 'T1555.006 Credentials from Password Stores: Cloud Secrets Management',
      flavour: {
        compromise:
          'Centralising secrets is correct and it also concentrates risk: one over-permissive role can read ' +
          'them all. The permission that matters is usually granted by a wildcard in a policy that somebody ' +
          'wrote in a hurry two years ago.',
        detect:
          'Access logging per secret with alerting on breadth: any principal reading more distinct secrets in ' +
          'an hour than it read in the previous month.',
        evidence:
          'Forty distinct secrets read by one role in eleven minutes, where its historical pattern is three ' +
          'secrets read on deployment.',
        contain:
          'Every secret the role could read is rotated, which is the expensive part and the reason blast ' +
          'radius matters. Policies are narrowed from wildcards to named resources.',
      },
    },
    {
      id: 'storage',
      label: 'Customer data storage',
      note: 'Object storage holding customer analytics data.',
      technique: 'T1530 Data from Cloud Storage',
      flavour: {
        compromise:
          'Object storage is only ever as private as its policy. A bucket policy that grants read to any ' +
          'authenticated principal, rather than to your organisation, is a misconfiguration that has produced ' +
          'a long list of public breaches.',
        detect:
          'Continuous posture monitoring on bucket policies, and access logging that distinguishes ' +
          'in-organisation from out-of-organisation principals.',
        evidence:
          'A bucket policy granting read to any authenticated principal, and access from an account ' +
          'identifier that belongs to no known partner.',
        contain:
          'The policy is corrected, public access is blocked at the account level so it cannot be ' +
          'reintroduced, the access log is analysed to quantify what was actually read, and affected ' +
          'customers are notified.',
      },
    },
    {
      id: 'idp',
      label: 'Identity provider',
      note: 'Cloud SSO. The only perimeter that exists here.',
      technique: 'T1556.007 Modify Authentication Process: Hybrid Identity',
      flavour: {
        compromise:
          'With administrative rights over identity you can add your own federation domain and issue yourself ' +
          'assertions as anybody, permanently, without any user password ever changing. In an estate with no ' +
          'network, identity is not part of the perimeter, it is the whole of it.',
        detect:
          'Alerting on federation configuration changes, new domain registrations and credential additions to ' +
          'service principals. These are rare, high-value events, so per-event review is affordable.',
        evidence:
          'A new federated domain added to the tenant at 02:00, followed by sign-ins for three privileged ' +
          'accounts that show no corresponding interactive authentication.',
        contain:
          'The domain is removed, all sessions and refresh tokens revoked tenant-wide, privileged role ' +
          'assignments audited, and administrative access moved behind privileged identity management with ' +
          'approval and time limits.',
      },
    },
    {
      id: 'monitoring',
      label: 'Logging and monitoring',
      note: 'The cloud audit trail. The only way anyone knows anything here.',
      technique: 'T1562.008 Impair Defenses: Disable or Modify Cloud Logs',
      flavour: {
        compromise:
          'In an estate with no network taps, the audit log is the only evidence that exists. Disabling a ' +
          'trail, or adding an exclusion filter for your own principal, makes everything afterwards invisible ' +
          'rather than merely unnoticed. This is the step that separates a competent cloud attacker from a ' +
          'noisy one.',
        detect:
          'Alerting on any change to logging configuration, delivered to a destination in a separate account ' +
          'that the compromised principal cannot reach. Logs must be outside the blast radius or they are not ' +
          'evidence.',
        evidence:
          'A trail modified to exclude events from one role, followed by a gap in delivery to the archive ' +
          'account that the local configuration does not explain.',
        contain:
          'Logging is restored from the separate account, the gap period is reconstructed from the archive ' +
          'and from downstream systems, and log configuration is protected by a policy that no tenant role ' +
          'can override.',
      },
    },
    {
      id: 'tenant',
      label: 'Production tenant admin',
      note: 'Global administrative control of the production cloud account. The objective.',
      crown: true,
      technique: 'T1098.003 Account Manipulation: Additional Cloud Roles',
      flavour: {
        compromise:
          'Global administration of production, reached unseen. There is no next step: you can read every ' +
          'customer data set, alter every configuration, and grant yourself durable access that survives the ' +
          'loss of the credential you came in on. This is what "blast radius" means concretely, and it is why ' +
          'a permanent global administrator is an architectural defect rather than a convenience.',
        detect:
          'Alerting on every privileged role assignment, with standing global administrators reduced to as ' +
          'close to zero as the organisation can bear. If the role is assigned just in time, an assignment ' +
          'outside a change window is unambiguous.',
        evidence:
          'A global administrator role assigned to a service principal at 03:15, by a principal that itself ' +
          'received the role forty seconds earlier.',
        contain:
          'The assignments are removed, every credential and token in the tenant is rotated and revoked, the ' +
          'cloud provider incident response is engaged, and customers are notified. Recovery is measured in ' +
          'weeks because every trust relationship in the tenant has to be re-established from a known good ' +
          'point.',
      },
    },
  ],
});
