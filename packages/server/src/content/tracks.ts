/**
 * Career tracks.
 *
 * WHAT A TRACK IS
 *
 * A route into a specific kind of security job, expressed as: the foundations it
 * requires, its own curriculum, and the certifications that sector asks for.
 *
 * The foundations are the important part. They are declared PER TRACK, drawn
 * from the shared pool in foundations.ts, which is what makes it possible for a
 * risk analyst to never open a terminal while a penetration tester needs Linux,
 * networking, web, and scripting before they start. A single linear curriculum
 * would have failed both of them.
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
      'log-analysis',
      'regex',
      'networking',
      'windows-events',
      'siem',
      'investigation-tools',
      'incident-concepts',
    ],
    curriculum: [
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
        note: 'Large private SOCs run defined tiers and 24/7 rotas. You will specialise sooner, and the SIEM in use — usually Splunk, Sentinel, or Elastic — is worth learning by name.',
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
    roles: ['Incident Responder', 'DFIR Analyst', 'Forensic Examiner', 'Threat Hunter'],
    foundations: [
      'linux',
      'log-analysis',
      'regex',
      'windows',
      'windows-events',
      'investigation-tools',
      'packet-analysis',
      'incident-concepts',
      'scripting',
    ],
    curriculum: [
      { title: 'Evidence Handling and Chain of Custody', summary: 'Acquire and preserve evidence so it survives challenge.', plannedExercises: 14 },
      { title: 'Host Forensics', summary: 'Disk, registry, and filesystem artefacts: what happened on this machine and when.', plannedExercises: 20 },
      { title: 'Memory Forensics', summary: 'Find what only ever existed in RAM, using Volatility.', plannedExercises: 16 },
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
    status: 'in_development',
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
    foundations: ['linux', 'log-analysis', 'regex', 'siem', 'data-sql', 'scripting', 'threat-modelling'],
    curriculum: [
      { title: 'Writing Detection Logic', summary: 'Author portable Sigma rules and reason about true and false positive rates.', plannedExercises: 20 },
      { title: 'Detection Tuning at Scale', summary: 'Take a rule that fires 4,000 times a day and make it useful.', plannedExercises: 16 },
      { title: 'Coverage and Measurement', summary: 'Map detections to ATT&CK and find the gaps honestly.', plannedExercises: 14 },
    ],
    certifications: ['sec-plus', 'cysa-plus', 'sc-200', 'gcih'],
    sectorNotes: [
      {
        when: { orgSize: 'large' },
        note: 'This role mostly exists at organisations big enough to have outgrown out-of-the-box rules. It is frequently a promotion from SOC rather than a first job.',
      },
    ],
    status: 'in_development',
    workRhythm: 'Project work with business hours. Rarely on-call. Deadlines come from engineering cycles rather than incidents.',
    entryDifficulty: 'moderate',
  },
  {
    id: 'threat-intel',
    order: 4,
    title: 'Threat Intelligence',
    summary:
      'Work out who is attacking, how, and what it means for your organisation — then write it so somebody can act on it.',
    audience:
      'Strong writers and researchers, especially people arriving from journalism, academia, military intelligence, or analysis-heavy roles.',
    roles: ['Threat Intelligence Analyst', 'CTI Researcher', 'Intelligence Officer'],
    foundations: ['threat-modelling', 'log-analysis', 'regex', 'security-writing', 'data-sql'],
    curriculum: [
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
    status: 'planned',
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
    foundations: ['linux', 'networking', 'web-fundamentals', 'scripting', 'windows', 'crypto-basics'],
    curriculum: [
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
    status: 'planned',
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
    foundations: ['networking', 'linux', 'windows', 'risk-fundamentals', 'scripting', 'security-writing'],
    curriculum: [
      { title: 'Scanning and Asset Discovery', summary: 'You cannot protect what you do not know exists.', plannedExercises: 16 },
      { title: 'Prioritisation That Survives Scrutiny', summary: 'Move beyond the CVSS score to exploitability and real exposure.', plannedExercises: 16 },
      { title: 'Remediation and Reporting', summary: 'Get things actually fixed by people who do not report to you.', plannedExercises: 12 },
    ],
    certifications: ['sec-plus', 'cysa-plus'],
    sectorNotes: [
      {
        when: { sector: 'government' },
        note: 'Government vulnerability management is heavily driven by mandated timelines — in US federal, CISA binding operational directives set hard remediation deadlines. Documentation discipline matters more than tooling.',
      },
    ],
    status: 'planned',
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
    foundations: ['cloud-fundamentals', 'identity-fundamentals', 'linux', 'networking', 'scripting'],
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
        note: 'At small companies this merges with general infrastructure work — you will own the cloud account rather than audit somebody else\'s.',
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
    foundations: ['linux', 'networking', 'windows', 'cloud-fundamentals', 'scripting', 'crypto-basics'],
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
    foundations: ['networking', 'packet-analysis', 'risk-fundamentals', 'incident-concepts'],
    curriculum: [
      { title: 'How OT Differs From IT', summary: 'Availability outranks confidentiality, and you cannot patch a turbine on Tuesday.', plannedExercises: 16 },
      { title: 'Industrial Protocols', summary: 'Modbus, DNP3, and what normal traffic looks like on a plant network.', plannedExercises: 16 },
      { title: 'Segmentation and Safety', summary: 'The Purdue model, and security that never compromises a safety system.', plannedExercises: 14 },
    ],
    certifications: ['sec-plus', 'gicsp'],
    sectorNotes: [
      {
        when: { sector: 'government', govLevel: 'state_local' },
        note: 'Municipal utilities — water, power, transit — run critical OT with famously small security teams. Genuine demand, real public impact, and a very short path from application to interview.',
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
      { title: 'Running a Risk Assessment', summary: 'Assess a real environment and produce a register somebody will use.', plannedExercises: 18 },
      { title: 'Control Design and Testing', summary: 'Decide whether a control genuinely works, rather than whether it exists.', plannedExercises: 16 },
      { title: 'Policy and Third-Party Risk', summary: 'Write a workable policy and assess a vendor without rubber-stamping them.', plannedExercises: 14 },
    ],
    certifications: ['sec-plus', 'crisc', 'cisa', 'cism'],
    sectorNotes: [
      {
        when: { sector: 'government', govLevel: 'federal' },
        note: 'Federal risk work IS the NIST Risk Management Framework — ATOs, system security plans, and continuous monitoring. CGRC is unusually valuable here, and demand is enormous and stable.',
      },
      {
        when: { sector: 'private', orgSize: 'large' },
        note: 'Large regulated firms — finance, healthcare, pharma — run substantial GRC functions with clear progression. A background in audit or finance transfers almost directly.',
      },
    ],
    status: 'in_development',
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
    status: 'planned',
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
    status: 'planned',
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
