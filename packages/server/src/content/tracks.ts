/**
 * Career tracks.
 *
 * WHAT A TRACK IS
 *
 * A route into a specific kind of security job, expressed as: the foundations it
 * requires, its own curriculum, and the certifications that sector asks for.
 *
 * Foundations are declared PER TRACK, drawn from the shared pool in
 * foundations.ts, which is what makes it possible for a risk analyst to never
 * open a terminal while a penetration tester needs Linux before they start. A
 * single linear curriculum would have failed both of them.
 *
 * A track's own CURRICULUM is where its packages live. A stage with a packageId
 * is playable today; a stage with plannedExercises is an outline with an honest
 * size on it. Every package in the catalogue is reachable through exactly this
 * mechanism, and `career.test.ts` fails the build if one is written but wired to
 * nothing, because content nobody can open is content nobody has.
 *
 * HONESTY RULES FOR THIS FILE
 *
 * - `status` tells the truth. 'available' means playable content exists today.
 *   Everything else is an outline with a realistic size attached, so a student
 *   sees the roadmap without being misled about what they can start now.
 * - `entryDifficulty` is about entering THIS role directly from another career,
 *   not about how hard the work is. Penetration testing is hard to enter cold and
 *   is rarely a first security job; saying so is kinder than letting somebody
 *   spend two years discovering it.
 * - `workRhythm` exists because shift work is a life decision. Somebody with
 *   caring responsibilities needs to know a Tier 1 SOC role may be nights and
 *   weekends before they commit, not after.
 */

import type { Track } from '@soc/shared';

export const TRACKS: Track[] = [
  // --- defensive operations -------------------------------------------------
  {
    id: 'soc',
    order: 1,
    title: 'SOC Analyst',
    summary:
      'Work a security operations queue: read the alerts, tell signal from noise, and run an incident to a conclusion.',
    audience:
      'Career changers who want a first security job with a clear entry path and structured training. The most common way into the field.',
    roles: ['SOC Analyst (Tier 1 / Tier 2)', 'Security Analyst', 'Security Monitoring Analyst'],
    foundations: [
      'linux',
      'regex',
      'windows-events',
      'siem',
      'investigation-tools',
    ],
    curriculum: [
      { title: 'SOC Foundations', summary: 'What a SOC is, how work moves through it, and which of the many jobs are the SOC itself.', packageId: 'soc-foundations' },
      { title: 'Log Analysis and Parsing', summary: 'Read what a real server writes, filter thousands of lines to the few that matter, and pull facts out of unstructured text.', packageId: 'log-analysis' },
      { title: 'Networking Basics', summary: 'Work out what a host is talking to, and whether it should be.', packageId: 'networking' },
      { title: 'Incident Detection and Alert Triage', summary: 'Work a queue: signal from noise, correlation, a full shift, and a copilot that is sometimes wrong.', packageId: 'incident-triage' },
      { title: 'Blue Team Foundations', summary: 'The defender mindset end to end: timelines, triage, intelligence, forensics, and defensive maturity.', packageId: 'blue-team-foundations' },
      {
        title: 'Live SOC Scenarios',
        summary:
          'Work real incidents against a simulated enterprise: triage the queue, investigate, decide, and hand over.',
        plannedExercises: 24,
      },
      {
        title: 'Alert Triage at Volume',
        summary: 'Handle a full shift of alerts under time pressure, most of which are nothing.',
        plannedExercises: 18,
      },
    ],
    certifications: ['sec-plus', 'cysa-plus', 'btl1', 'sc-200'],
    sectorNotes: [
      {
        when: { sector: 'government', govLevel: 'federal' },
        note: 'Federal SOC work often sits inside a CSSP or a cleared facility. Expect Security+ as a hard gate and CySA+ close behind, plus a clearance process before you start.',
      },
      {
        when: { sector: 'government', govLevel: 'state_local' },
        note: 'State and local SOCs are small, so a Tier 1 analyst often does triage, engineering, and awareness training in the same week. Excellent breadth for a first role.',
      },
      {
        when: { sector: 'private', orgSize: 'large' },
        note: 'Large private SOCs run defined tiers and 24/7 rotas. You will specialise sooner, and the SIEM in use (usually Splunk, Sentinel, or Elastic) is worth learning by name.',
      },
      {
        when: { sector: 'private', orgSize: 'small' },
        note: 'Smaller organisations often outsource monitoring to an MSSP. Working AT the MSSP is a very common first job, exposes you to many client environments quickly, and is a fast way to learn.',
      },
    ],
    status: 'available',
    workRhythm:
      'Often shift-based, including nights and weekends at Tier 1. Reactive: the queue sets your day. Many roles move to business hours after a year or two.',
    entryDifficulty: 'accessible',
  },
  {
    id: 'incident-response',
    order: 2,
    title: 'Incident Response and Digital Forensics',
    summary:
      'Go deep on confirmed compromise: preserve evidence, reconstruct exactly what happened, and prove it well enough for a report or a court.',
    audience:
      'People who prefer depth over breadth and are comfortable being the person called at 2am when something is genuinely wrong.',
    roles: ['Incident Responder', 'DFIR Analyst', 'Forensic Examiner', 'Malware Analyst', 'Threat Hunter'],
    foundations: [
      'linux',
      'regex',
      'windows',
      'windows-events',
      'investigation-tools',
      'packet-analysis',
      'scripting',
    ],
    curriculum: [
      { title: 'SOC Foundations', summary: 'What a SOC is for, how work moves through it, and which seat does what. The orientation every defensive route needs before the specialism means anything.', packageId: 'soc-foundations' },
      { title: 'Blue Team Foundations', summary: 'The defensive core: what normal looks like, reading logs into a timeline, triage and escalation, ATT&CK, and forensics.', packageId: 'blue-team-foundations' },
      { title: 'Incident Response and Remediation', summary: 'Contain, gather evidence on the host, scope and eradicate, then communicate and close.', packageId: 'incident-response' },
      { title: 'Evidence Handling and Chain of Custody', summary: 'Acquire and preserve evidence so it survives challenge.', plannedExercises: 14 },
      { title: 'Host Forensics', summary: 'Disk, registry, and filesystem artefacts: what happened on this machine and when.', plannedExercises: 20 },
      { title: 'Memory Forensics', summary: 'Find what only ever existed in RAM, using Volatility.', plannedExercises: 16 },
      { title: 'Malware Analysis', summary: 'What a suspicious file does and how the answer becomes a detection: methodology, disassembly, runtime analysis, packing, families, command and control, and the report.', packageId: 'malware-analysis' },
      { title: 'Full Investigation', summary: 'Run a multi-host intrusion end to end and write the report.', plannedExercises: 12 },
    ],
    certifications: ['sec-plus', 'gcih', 'btl1', 'gcfa'],
    sectorNotes: [
      {
        when: { sector: 'government', govLevel: 'federal' },
        note: 'Federal DFIR often involves law enforcement handover, so evidentiary standards are strict and non-negotiable. GCFA and GCIH are well recognised and frequently employer-funded.',
      },
      {
        when: { sector: 'private', orgSize: 'small' },
        note: 'Small organisations rarely staff dedicated DFIR. This work usually sits at a consultancy or IR retainer firm, which means travel and variable hours but very fast learning.',
      },
    ],
    status: 'available',
    workRhythm:
      'Bursty. Quiet periods of preparation punctuated by intense multi-day incidents. On-call is normal, and an active case does not respect your calendar.',
    entryDifficulty: 'moderate',
  },
  {
    id: 'detection-engineering',
    order: 3,
    title: 'Detection Engineering and Security Data',
    summary:
      'Build the detections other analysts respond to: write the logic, tune out the noise, and measure whether your coverage is real.',
    audience:
      'People who like building systems and working with data more than answering alerts, and who want to reduce the queue rather than work it.',
    roles: ['Detection Engineer', 'Security Data Analyst', 'SIEM Engineer', 'Threat Hunter'],
    foundations: ['linux', 'regex', 'siem', 'data-sql', 'scripting', 'threat-modelling'],
    curriculum: [
      { title: 'SOC Foundations', summary: 'What a SOC is for, how work moves through it, and which seat does what. The orientation every defensive route needs before the specialism means anything.', packageId: 'soc-foundations' },
      { title: 'Blue Team Foundations', summary: 'The defensive core: what normal looks like, reading logs into a timeline, triage and escalation, ATT&CK, and forensics.', packageId: 'blue-team-foundations' },
      { title: 'Log Analysis and Parsing', summary: 'Before you can write a detection you have to be able to read what the source actually emits.', packageId: 'log-analysis' },
      { title: 'SIEM Fundamentals', summary: 'Query a SIEM, decide what is worth indexing against what it costs, and normalise sources that disagree about what a username is called.', plannedExercises: 10 },
      { title: 'Writing Detection Logic', summary: 'Author a threshold rule from scratch, exclude a known benign cause without blinding it, and replay it over a month of old logs before anyone deploys it.', plannedExercises: 14 },
      { title: 'Correlation and Behavioural Detection', summary: 'Rules that need several events to mean anything, baselines that separate an odd-but-normal user from a compromised one, and one ATT&CK technique covered across every way it shows up.', plannedExercises: 16 },
      { title: 'Detection Engineering in Practice', summary: 'Find the gap a real incident walked through, cut a rule firing 500 times a day down to something a SOC can work, and build coverage for a named threat actor.', plannedExercises: 16 },
      { title: 'Detection at Scale', summary: 'Version, test, and retire a hundred rules without chaos, and answer "what can we not detect?" honestly enough to put in front of an executive.', plannedExercises: 10 },
    ],
    certifications: ['sec-plus', 'cysa-plus', 'sc-200', 'gcih'],
    sectorNotes: [
      {
        when: { orgSize: 'large' },
        note: 'This role mostly exists at organisations big enough to have outgrown out-of-the-box rules. It is frequently a promotion from SOC rather than a first job.',
      },
    ],
    status: 'available',
    workRhythm: 'Project work with business hours. Rarely on-call. Deadlines come from engineering cycles rather than incidents.',
    // Rarely entered cold: tuning a rule well needs to have felt the queue first.
    entryDifficulty: 'hard',
  },
  {
    id: 'threat-intel',
    order: 4,
    title: 'Threat Intelligence',
    summary:
      'Work out who is attacking, how, and what it means for your organisation, then write it so somebody can act on it.',
    audience:
      'Strong writers and researchers, especially people arriving from journalism, academia, military intelligence, or analysis-heavy roles.',
    roles: ['Threat Intelligence Analyst', 'CTI Researcher', 'Intelligence Officer'],
    foundations: ['threat-modelling', 'regex', 'security-writing', 'data-sql'],
    curriculum: [
      { title: 'SOC Foundations', summary: 'What a SOC is for, how work moves through it, and which seat does what. The orientation every defensive route needs before the specialism means anything.', packageId: 'soc-foundations' },
      { title: 'Blue Team Foundations', summary: 'Where intelligence actually lands: ATT&CK, the breaches everybody cites, and what a defender does with a report you write.', packageId: 'blue-team-foundations' },
      { title: 'Red Team Foundations', summary: 'The adversary side you are writing about: the attack lifecycle, OSINT, and how intrusions are actually run.', packageId: 'red-team-foundations' },
      { title: 'Intelligence Tradecraft', summary: 'Source reliability, analytic confidence, and avoiding your own bias.', plannedExercises: 16 },
      { title: 'Adversary Tracking', summary: 'Cluster activity, map it to ATT&CK, and attribute carefully.', plannedExercises: 18 },
      { title: 'Writing Finished Intelligence', summary: 'Produce assessments that change a decision instead of listing indicators.', plannedExercises: 12 },
    ],
    certifications: ['sec-plus', 'btl1', 'gcih'],
    sectorNotes: [
      {
        when: { sector: 'government', govLevel: 'federal' },
        note: 'A natural fit for anyone with a military or intelligence background, and one of the places prior clearance is worth the most. Analytic writing standards are formal and rigorous.',
      },
    ],
    status: 'available',
    workRhythm: 'Business hours and research-driven, with occasional surges when something significant breaks publicly.',
    entryDifficulty: 'moderate',
  },

  // --- offensive ------------------------------------------------------------
  {
    id: 'pentest',
    order: 5,
    title: 'Penetration Testing',
    summary:
      'Attack systems with permission, prove what an adversary could actually do, and write it up so it gets fixed.',
    audience:
      'People who genuinely enjoy taking things apart and are prepared for a long technical runway. Rarely a first security job, and worth knowing that early.',
    roles: ['Penetration Tester', 'Red Team Operator', 'Security Consultant', 'Offensive Security Engineer'],
    foundations: ['linux', 'web-fundamentals', 'scripting', 'windows', 'crypto-basics'],
    curriculum: [
      { title: 'Red Team Foundations', summary: 'Offensive methodology as graded reasoning: lifecycle, OSINT, access, persistence, movement, evasion, and the ethics that bound it.', packageId: 'red-team-foundations' },
      { title: 'Methodology and Scoping', summary: 'Rules of engagement, legal authorisation, and why scope discipline matters more than technique.', plannedExercises: 12 },
      { title: 'Enumeration and Exploitation', summary: 'Find the way in, methodically, against a lab network.', plannedExercises: 24 },
      { title: 'Post-Exploitation and Privilege Escalation', summary: 'Turn a foothold into meaningful access.', plannedExercises: 20 },
      { title: 'Reporting', summary: 'Write the report. This is what clients pay for, and it is the part most testers do badly.', plannedExercises: 10 },
    ],
    certifications: ['sec-plus', 'ejpt', 'pentest-plus', 'oscp', 'osep'],
    sectorNotes: [
      {
        when: { sector: 'government', govLevel: 'federal' },
        note: 'Federal offensive work is largely cleared and often contractor-staffed. Entry usually runs through a defence contractor rather than direct hire.',
      },
      {
        when: { sector: 'private', orgSize: 'small' },
        note: 'Most testers work at consultancies rather than in-house, because a single company rarely needs full-time testing. Expect client travel and a steady stream of new environments.',
      },
    ],
    status: 'available',
    workRhythm:
      'Project-based in one to three week engagements, with hard report deadlines. Mostly business hours, though testing windows are sometimes out of hours to avoid disrupting production.',
    entryDifficulty: 'hard',
  },
  {
    id: 'appsec',
    order: 6,
    title: 'Application Security',
    summary:
      'Find and prevent flaws in software: review code, threat model designs, and help developers ship securely without becoming the department of no.',
    audience:
      'People arriving from software development, QA, or anyone who can read code and would rather prevent bugs than respond to them.',
    roles: ['Application Security Engineer', 'Product Security Engineer', 'Secure Code Reviewer'],
    foundations: ['web-fundamentals', 'scripting', 'crypto-basics', 'linux'],
    curriculum: [
      { title: 'Vulnerability Classes in Depth', summary: 'Why each OWASP category happens at the code level, not just what it is called.', plannedExercises: 22 },
      { title: 'Secure Code Review', summary: 'Read real code and find the flaw before it ships.', plannedExercises: 18 },
      { title: 'Threat Modelling a Design', summary: 'Catch the problem at the whiteboard, when it is cheap to fix.', plannedExercises: 14 },
      { title: 'Working With Developers', summary: 'Land a finding without becoming the person engineering routes around.', plannedExercises: 10 },
    ],
    certifications: ['sec-plus', 'pentest-plus'],
    sectorNotes: [
      {
        when: { orgSize: 'large' },
        note: 'Concentrated in organisations that build their own software. A software background is close to a prerequisite here, and it is the fastest transfer into security for developers.',
      },
    ],
    status: 'planned',
    workRhythm: 'Business hours, embedded with engineering teams and tied to their release cycles.',
    entryDifficulty: 'moderate',
  },
  {
    id: 'vuln-management',
    order: 7,
    title: 'Vulnerability Management',
    summary:
      'Find what is exposed across the estate, work out what actually matters, and drive it to fixed. Deeply unglamorous and always hiring.',
    audience:
      'Organised people who are good at follow-through and comfortable chasing other teams. One of the most accessible entry points in security.',
    roles: ['Vulnerability Management Analyst', 'Security Operations Engineer', 'Patch Management Analyst'],
    foundations: ['linux', 'windows', 'risk-fundamentals', 'scripting', 'security-writing'],
    curriculum: [
      { title: 'Red Team Foundations', summary: 'Reconnaissance, and what a CVE and a severity score actually mean to somebody trying to use one.', packageId: 'red-team-foundations' },
      { title: 'Risk Management and AI Governance', summary: 'Asset criticality, vulnerability and gap analysis, and scoring that survives being challenged: the half of this job that is not scanning.', packageId: 'risk-governance-pathway' },
      { title: 'Scanning and Asset Discovery', summary: 'You cannot protect what you do not know exists.', plannedExercises: 16 },
      { title: 'Prioritisation That Survives Scrutiny', summary: 'Move beyond the CVSS score to exploitability and real exposure.', plannedExercises: 16 },
      { title: 'Remediation and Reporting', summary: 'Get things actually fixed by people who do not report to you.', plannedExercises: 12 },
    ],
    certifications: ['sec-plus', 'cysa-plus'],
    sectorNotes: [
      {
        when: { sector: 'government' },
        note: 'Government vulnerability management is heavily driven by mandated timelines: in US federal, CISA binding operational directives set hard remediation deadlines. Documentation discipline matters more than tooling.',
      },
    ],
    status: 'available',
    workRhythm: 'Business hours on a predictable cycle, with periodic surges when a critical vulnerability lands publicly.',
    entryDifficulty: 'accessible',
  },

  // --- platform and infrastructure -----------------------------------------
  {
    id: 'cloud-security',
    order: 8,
    title: 'Cloud Security',
    summary:
      'Secure workloads in AWS, Azure, and GCP: identity, network boundaries, storage exposure, logging, and the misconfigurations that cause most breaches.',
    audience:
      'People arriving from IT operations, sysadmin, or DevOps work. One of the highest-demand and best-paid areas for a career changer with an ops background.',
    roles: ['Cloud Security Engineer', 'Cloud Security Analyst', 'DevSecOps Engineer'],
    foundations: ['cloud-fundamentals', 'identity-fundamentals', 'linux', 'scripting'],
    curriculum: [
      { title: 'Cloud Identity and Permissions', summary: 'IAM is the new perimeter, and over-permissioning is the most common real finding.', plannedExercises: 20 },
      { title: 'Posture and Misconfiguration', summary: 'Audit an account with Prowler and ScoutSuite, then judge what matters.', plannedExercises: 18 },
      { title: 'Cloud Logging and Detection', summary: 'CloudTrail, activity logs, and what an attacker looks like in them.', plannedExercises: 16 },
    ],
    certifications: ['az-900', 'sec-plus', 'az-500', 'aws-security', 'ccsp'],
    sectorNotes: [
      {
        when: { sector: 'government', govLevel: 'federal' },
        note: 'Federal cloud work runs through FedRAMP authorisation and often uses dedicated government regions such as Azure Government or AWS GovCloud. Understanding FedRAMP is a genuine differentiator.',
      },
      {
        when: { sector: 'private', orgSize: 'small' },
        note: 'At small companies this merges with general infrastructure work: you will own the cloud account rather than audit somebody else\'s.',
      },
    ],
    status: 'planned',
    workRhythm: 'Business hours project work, usually embedded with platform or infrastructure teams.',
    entryDifficulty: 'moderate',
  },
  {
    id: 'identity',
    order: 9,
    title: 'Identity and Access Management',
    summary:
      'Own who can access what: joiners and leavers, single sign-on, multi-factor, privileged access, and access reviews that are not theatre.',
    audience:
      'Detail-oriented people, often arriving from IT support or service desk work. Consistently overlooked, consistently hiring, and a very common first security role in large enterprises.',
    roles: ['IAM Analyst', 'Identity Engineer', 'Access Management Specialist', 'IGA Analyst'],
    foundations: ['identity-fundamentals', 'windows', 'cloud-fundamentals', 'crypto-basics'],
    curriculum: [
      { title: 'Authentication Flows in Practice', summary: 'What SAML and OIDC actually do on the wire, using Keycloak.', plannedExercises: 18 },
      { title: 'Lifecycle and Governance', summary: 'Joiner-mover-leaver, access reviews, and why orphaned accounts cause breaches.', plannedExercises: 16 },
      { title: 'Privileged Access', summary: 'Standing privilege is the problem; just-in-time access is the answer.', plannedExercises: 14 },
    ],
    certifications: ['sec-plus', 'sc-300', 'az-500'],
    sectorNotes: [
      {
        when: { orgSize: 'large' },
        note: 'Large enterprises run dedicated IAM teams and this is one of the most reliable ways in, particularly from a service desk background where you already know the joiner-leaver process.',
      },
      {
        when: { sector: 'government', govLevel: 'federal' },
        note: 'Federal identity work involves PIV and CAC smartcards and ICAM policy, which is a specialised and well-paid niche.',
      },
    ],
    status: 'planned',
    workRhythm: 'Business hours, ticket-driven, with predictable peaks around joiner and leaver cycles and audit season.',
    entryDifficulty: 'accessible',
  },
  {
    id: 'security-engineering',
    order: 10,
    title: 'Security Engineering',
    summary:
      'Build and harden the infrastructure itself: network segmentation, endpoint hardening, logging pipelines, and the tooling everyone else depends on.',
    audience: 'People arriving from systems or network administration who would rather build controls than monitor them.',
    roles: ['Security Engineer', 'Infrastructure Security Engineer', 'Security Operations Engineer'],
    foundations: ['linux', 'windows', 'cloud-fundamentals', 'scripting', 'crypto-basics'],
    curriculum: [
      { title: 'Hardening and Baselines', summary: 'CIS benchmarks applied to real systems, and what breaks when you do.', plannedExercises: 18 },
      { title: 'Network Segmentation', summary: 'Design boundaries that contain an incident instead of decorating a diagram.', plannedExercises: 16 },
      { title: 'Building the Logging Pipeline', summary: 'Get the right telemetry to the right place at a cost somebody will approve.', plannedExercises: 16 },
    ],
    certifications: ['sec-plus', 'cysa-plus', 'az-500', 'cissp'],
    status: 'planned',
    workRhythm: 'Business hours project work, with change windows that are often evenings or weekends.',
    entryDifficulty: 'moderate',
  },
  {
    id: 'ot-ics',
    order: 11,
    title: 'OT and Industrial Control Systems Security',
    summary:
      'Protect the systems that run physical processes: power, water, manufacturing, transport. Where a security failure has consequences you can see.',
    audience:
      'People arriving from engineering, manufacturing, utilities, or the military. Prior industrial experience is worth more here than security experience.',
    roles: ['OT Security Analyst', 'ICS Security Engineer', 'Critical Infrastructure Analyst'],
    foundations: ['packet-analysis', 'risk-fundamentals'],
    curriculum: [
      { title: 'How OT Differs From IT', summary: 'Availability outranks confidentiality, and you cannot patch a turbine on Tuesday.', plannedExercises: 16 },
      { title: 'Industrial Protocols', summary: 'Modbus, DNP3, and what normal traffic looks like on a plant network.', plannedExercises: 16 },
      { title: 'Segmentation and Safety', summary: 'The Purdue model, and security that never compromises a safety system.', plannedExercises: 14 },
    ],
    certifications: ['sec-plus', 'gicsp'],
    sectorNotes: [
      {
        when: { sector: 'government', govLevel: 'state_local' },
        note: 'Municipal utilities (water, power, transit) run critical OT with famously small security teams. Genuine demand, real public impact, and a very short path from application to interview.',
      },
      {
        when: { sector: 'government', govLevel: 'federal' },
        note: 'Critical infrastructure protection is a federal priority with dedicated CISA programmes and sustained funding.',
      },
    ],
    status: 'planned',
    workRhythm: 'Business hours, with maintenance windows dictated by production schedules and occasional site visits.',
    entryDifficulty: 'moderate',
  },

  // --- risk, compliance, and people ----------------------------------------
  {
    id: 'risk-governance',
    order: 12,
    title: 'Risk and Governance',
    summary:
      'Decide what an organisation should worry about and prove the controls work. No terminal required, and none of it is less real for that.',
    audience:
      'People arriving from audit, finance, law, project management, or operations. Strong writing and stakeholder skills matter far more here than technical depth.',
    roles: ['GRC Analyst', 'Risk Analyst', 'Compliance Analyst', 'Security Governance Specialist'],
    foundations: ['risk-fundamentals', 'frameworks', 'security-writing'],
    curriculum: [
      { title: 'Risk Management and AI Governance', summary: 'The whole assessment: vocabulary, assets, threat modelling, scoring, controls, continuity, compliance, budget, and the brief that gets a decision. AI risk throughout.', packageId: 'risk-governance-pathway' },
      { title: 'Policy and Third-Party Risk', summary: 'Write a workable policy and assess a vendor without rubber-stamping them.', plannedExercises: 14 },
    ],
    certifications: ['sec-plus', 'crisc', 'cisa', 'cism'],
    sectorNotes: [
      {
        when: { sector: 'government', govLevel: 'federal' },
        note: 'Federal risk work IS the NIST Risk Management Framework: ATOs, system security plans, and continuous monitoring. CGRC is unusually valuable here, and demand is enormous and stable.',
      },
      {
        when: { sector: 'private', orgSize: 'large' },
        note: 'Large regulated firms (finance, healthcare, pharma) run substantial GRC functions with clear progression. A background in audit or finance transfers almost directly.',
      },
    ],
    status: 'available',
    workRhythm:
      'Business hours, deadline-driven around audit and reporting cycles. No on-call. Among the most predictable schedules in security.',
    entryDifficulty: 'accessible',
  },
  {
    id: 'compliance-audit',
    order: 13,
    title: 'Compliance and Audit',
    summary:
      'Test whether controls actually operate, gather evidence that stands up to challenge, and write findings that get acted on.',
    audience:
      'People arriving from internal audit, accounting, or quality assurance. The most direct transfer into security that exists for those backgrounds.',
    roles: ['IT Auditor', 'Compliance Analyst', 'Assurance Specialist', 'SOC 2 Analyst'],
    foundations: ['risk-fundamentals', 'frameworks', 'security-writing', 'data-sql'],
    curriculum: [
      { title: 'Risk Management and AI Governance', summary: 'Frameworks, controls and how you know one works, compliance mapping to the evidence that proves it, and writing a finding somebody can close.', packageId: 'risk-governance-pathway' },
      { title: 'Evidence and Sampling', summary: 'Gather proof that withstands a sceptical reviewer.', plannedExercises: 16 },
      { title: 'Testing Controls', summary: 'Design and execute a control test, and document it properly.', plannedExercises: 16 },
      { title: 'Audit Reporting', summary: 'Write findings that land, with ratings you can defend.', plannedExercises: 12 },
    ],
    certifications: ['cisa', 'sec-plus', 'crisc', 'cgrc'],
    sectorNotes: [
      {
        when: { sector: 'government' },
        note: 'Government audit work is driven by FISMA, inspector general reviews, and continuous monitoring. Highly structured, well documented, and stable.',
      },
      {
        when: { sector: 'private', orgSize: 'small' },
        note: 'Small companies chasing SOC 2 or ISO 27001 for the first time hire heavily for this, often through consultancies. A fast and reliable way in.',
      },
    ],
    status: 'available',
    workRhythm: 'Business hours with hard deadlines around audit periods. Predictable, and busy in cycles.',
    entryDifficulty: 'accessible',
  },
  {
    id: 'privacy',
    order: 14,
    title: 'Privacy and Data Protection',
    summary:
      'Work out what personal data an organisation holds, whether it should, and how to keep its use lawful and defensible.',
    audience:
      'People arriving from legal, compliance, healthcare, or records management. A distinct profession that overlaps security without being it.',
    roles: ['Privacy Analyst', 'Data Protection Officer', 'Privacy Program Manager'],
    foundations: ['risk-fundamentals', 'frameworks', 'security-writing'],
    curriculum: [
      { title: 'Risk Management and AI Governance', summary: 'Risk, asset and data criticality, obligations mapped to evidence, and breach-adjacent continuity work. The privacy specifics follow.', packageId: 'risk-governance-pathway' },
      { title: 'Data Mapping', summary: 'Find out what you actually hold, which is almost never what anyone believes.', plannedExercises: 14 },
      { title: 'Privacy Impact Assessments', summary: 'Assess a new system before it processes anybody\'s data.', plannedExercises: 14 },
      { title: 'Breach Response and Notification', summary: 'The legal clock, and who has to be told what, by when.', plannedExercises: 12 },
    ],
    certifications: ['cipp-us', 'sec-plus'],
    sectorNotes: [
      {
        when: { sector: 'government' },
        note: 'Public sector privacy work is governed by the Privacy Act and mandatory privacy impact assessments, and it is a defined career field with its own progression.',
      },
      {
        when: { sector: 'private', orgSize: 'large' },
        note: 'Multinationals need people who can hold GDPR, state privacy laws, and sector rules in their head simultaneously. Legal backgrounds are prized.',
      },
    ],
    status: 'available',
    workRhythm: 'Business hours and project-driven, with sharp deadlines when a breach notification clock starts.',
    entryDifficulty: 'accessible',
  },
  {
    id: 'awareness',
    order: 15,
    title: 'Security Awareness and Human Risk',
    summary:
      'Change what people actually do: training that is not ignored, phishing simulation that teaches rather than punishes, and culture work that measurably reduces incidents.',
    audience:
      'People arriving from teaching, communications, HR, or marketing. The most underrated entry point in the field, and one where prior non-technical experience is a genuine advantage.',
    roles: ['Security Awareness Manager', 'Human Risk Analyst', 'Security Culture Specialist'],
    foundations: ['security-writing', 'risk-fundamentals', 'threat-modelling'],
    curriculum: [
      { title: 'Why Training Fails', summary: 'Most awareness programmes measure completion, not behaviour change.', plannedExercises: 12 },
      { title: 'Phishing Simulation Done Properly', summary: 'Run a programme that teaches instead of humiliating people.', plannedExercises: 12 },
      { title: 'Measuring Human Risk', summary: 'Metrics that reflect real behaviour rather than click rates.', plannedExercises: 12 },
    ],
    certifications: ['sec-plus'],
    sectorNotes: [
      {
        when: { orgSize: 'large' },
        note: 'Large organisations fund dedicated awareness roles, and a teaching or communications background is a direct qualification rather than a consolation prize.',
      },
    ],
    status: 'planned',
    workRhythm: 'Business hours, campaign-driven, with peaks around annual training cycles.',
    entryDifficulty: 'accessible',
  },
  {
    id: 'ai-security',
    order: 16,
    title: 'AI Security',
    summary:
      'Defend the models an organisation has deployed: test them for prompt injection and jailbreaks, validate the data they were trained on, and decide whether one is safe to put in front of a decision.',
    audience:
      'People with real technical depth who want to work on something that is still being figured out. NOT an entry point: it needs the AI mechanics and enough security grounding to know what a finding is worth.',
    roles: ['AI Security Analyst', 'AI Red Teamer', 'ML Security Engineer', 'AI Assurance Analyst'],
    foundations: [
      'adversarial-ml',
      'scripting',
      'threat-modelling',
      'security-writing',
      'ai-governance',
    ],
    curriculum: [
      { title: 'AI Foundations', summary: 'What a model actually is, computed by hand: tokens, embeddings, attention, and how machine learning fails.', packageId: 'ai-foundations' },
      { title: 'AI Security Pathway', summary: 'The judgement half: attack surface, training data and privacy, regulation and fairness, real incidents, and governance.', packageId: 'ai-security-pathway' },
      { title: 'AI Security Analyst', summary: 'In the Model Lab: find the bypass, harden under a budget, and assess a production deployment.', packageId: 'ai-security' },
      {
        title: 'Red Teaming a Production AI System',
        summary:
          'A full engagement against a deployed assistant: scope it, test the paths nobody tested, and write the report.',
        plannedExercises: 16,
      },
      {
        title: 'Monitoring AI Systems in Production',
        summary:
          'Detect injection attempts, extraction patterns, and behaviour drift in a live query log: the defensive half of the job.',
        plannedExercises: 14,
      },
    ],
    certifications: ['sec-plus', 'aigp'],
    sectorNotes: [
      {
        when: { orgSize: 'large' },
        note: 'Almost every one of these roles is at a large organisation or an AI company, because you need somebody to have deployed models worth defending. Small companies buy this as consultancy.',
      },
      {
        when: { sector: 'government', govLevel: 'federal' },
        note: 'Government AI assurance work is growing and is more about evidence and documentation than about jailbreaks: model provenance, evaluation records, and being able to show what was tested. Clearance timelines still apply.',
      },
      {
        when: { sector: 'private', orgSize: 'small' },
        note: 'At a startup this is usually somebody’s second hat rather than a job. That is not a bad way in, but the title on the advert will say something else.',
      },
    ],
    status: 'available',
    workRhythm:
      'Project work, business hours, rarely on-call: you are not in the incident queue. Deadlines come from release cycles: somebody wants to ship a model on Thursday and you are the reason they might not.',
    entryDifficulty: 'hard',
  },
];

const TRACK_BY_ID = new Map(TRACKS.map((track) => [track.id, track]));

export function getTrack(trackId: string): Track | null {
  return TRACK_BY_ID.get(trackId) ?? null;
}

/**
 * Package ids a track requires, foundations first then its own curriculum.
 *
 * Foundation order is the order declared on the track, which is deliberate: a
 * SOC analyst should meet Linux before log analysis, and the track author picks
 * that sequence rather than a single global ordering.
 *
 * The resolver is injected so this module does not import foundations.ts and
 * create a cycle.
 */
export function trackPackageIds(
  trackId: string,
  foundationPackageId: (foundationId: string) => string | undefined,
): string[] {
  const track = TRACK_BY_ID.get(trackId);
  if (!track) return [];

  const fromFoundations = track.foundations
    .map((id) => foundationPackageId(id))
    .filter((id): id is string => typeof id === 'string');

  const fromCurriculum = track.curriculum
    .map((stage) => stage.packageId)
    .filter((id): id is string => typeof id === 'string');

  return [...fromFoundations, ...fromCurriculum];
}

/** Every track that requires a given foundation. */
export function tracksRequiring(foundationId: string): Track[] {
  return TRACKS.filter((track) => track.foundations.includes(foundationId));
}

/** Tracks with playable content today. */
export function availableTracks(): Track[] {
  return TRACKS.filter((track) => track.status === 'available');
}
