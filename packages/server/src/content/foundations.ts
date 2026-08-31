/**
 * The shared pool of foundational skills.
 *
 * THE POINT OF THIS FILE
 *
 * The original curriculum was one straight line: everybody starts at Linux and
 * walks to the end. That is wrong, and it fails the exact people this platform
 * is for. Someone heading into risk and governance does not need `grep`. Someone
 * heading into identity work needs Windows and directory services far more than
 * they need a Linux terminal. Forcing a future GRC analyst through four packages
 * of shell commands teaches them they are bad at security, which is false.
 *
 * So foundations live here as a shared pool, and each TRACK declares which ones
 * it requires. A student's required foundations are therefore a consequence of
 * the route they chose, not a fixed queue.
 *
 * Foundations with a `packageId` are built and playable today. The rest are
 * outlined with honest sizes so the roadmap is visible rather than implied.
 */

import type { Foundation } from '@soc/shared';

export const FOUNDATIONS: Foundation[] = [
  {
    id: 'linux',
    title: 'Linux Fundamentals',
    summary:
      'Move around a Linux server, work with files, read logs, and search them with grep and pipes. The substrate almost all security tooling sits on.',
    packageId: '1',
    tools: ['scripting'],
  },
  {
    id: 'log-analysis',
    title: 'Log Analysis and Parsing',
    summary:
      'Read the logs a real server produces, filter thousands of lines down to the few that matter, and pull structured facts out of unstructured text.',
    packageId: '2',
    tools: ['siem-search'],
  },
  {
    id: 'regex',
    title: 'Regular Expressions',
    summary:
      'Describe a pattern precisely enough that a machine can find every instance of it and nothing else. Underpins log search, detection rules, data validation, and every SIEM query language.',
    plannedExercises: 16,
    tools: ['siem-search'],
  },
  {
    id: 'windows',
    title: 'Windows and Active Directory',
    summary:
      'The environment most enterprise compromise actually happens in: accounts, groups, Group Policy, authentication flows, and why domain admin is the crown jewel.',
    plannedExercises: 22,
    tools: ['identity', 'windows-forensics'],
  },
  {
    id: 'windows-events',
    title: 'Windows Event Log Analysis',
    summary:
      'Read Windows security events by ID and reconstruct an intrusion from them. A different discipline from syslog, and the one most job adverts assume you have.',
    plannedExercises: 18,
    tools: ['windows-forensics', 'siem-search'],
  },
  {
    id: 'networking',
    title: 'Networking Basics',
    summary:
      'Addresses, ports, routing, and DNS from the command line. Work out what a host is talking to, and whether it should be.',
    packageId: '4',
    tools: ['packet-analysis'],
  },
  {
    id: 'packet-analysis',
    title: 'Packet Analysis',
    summary:
      'Read a packet capture in Wireshark and tshark: follow a stream, spot a scan, recognise a beacon, and find data leaving the network.',
    plannedExercises: 16,
    tools: ['packet-analysis'],
  },
  {
    id: 'siem',
    title: 'SIEM and Detection Search',
    summary:
      'Express an investigative question as a search across many hosts, and write detection logic as portable Sigma rules that convert into Splunk, Sentinel, or Elastic.',
    plannedExercises: 20,
    tools: ['siem-search'],
  },
  {
    id: 'investigation-tools',
    title: 'Command Line Tools for Investigation',
    summary:
      'Processes, filesystem forensics, permissions, and services. Find what should not be running and work out how it got there.',
    plannedExercises: 18,
    tools: ['endpoint-visibility'],
  },
  {
    id: 'incident-concepts',
    title: 'Security Incident Concepts',
    summary:
      'Severity, triage, correlation, and escalation. The judgement layer that turns log reading into a decision about whether something is real.',
    packageId: '3',
    tools: ['case-management'],
  },
  /*
   * Split from `incident-concepts` when the Incident Response package landed.
   *
   * Not a cosmetic split. A track resolves to its packages *through* its
   * foundations (see `trackPackages`), so a package no foundation points at
   * belongs to no track and is unreachable from career routing -- which is
   * exactly where the 18 exercises of Incident Response sat until this existed.
   *
   * The boundary is the one the content already draws: `incident-concepts` is
   * deciding whether something is real, this is what you do once it is.
   */
  {
    id: 'incident-response',
    title: 'Incident Response and Remediation',
    summary:
      'Containment under time pressure, evidence preservation, scoping an intrusion, and the writing that closes it out. What happens after triage decides something is real.',
    packageId: 'incident-response',
    tools: ['case-management'],
  },
  {
    id: 'scripting',
    title: 'Scripting and Automation',
    summary:
      'Python, bash, and PowerShell for people who are not developers. Parse a log, call an API, and turn a two-hour manual task into a script.',
    plannedExercises: 20,
    tools: ['scripting'],
  },
  {
    id: 'web-fundamentals',
    title: 'Web Application Fundamentals',
    summary:
      'HTTP, sessions, cookies, and the request/response cycle — plus the OWASP Top 10 classes and why each one happens.',
    plannedExercises: 18,
    tools: ['web-app-testing'],
  },
  {
    id: 'crypto-basics',
    title: 'Cryptography in Practice',
    summary:
      'Hashing, symmetric and public key encryption, TLS, and certificates — enough to reason about them correctly without implementing any of it yourself.',
    plannedExercises: 14,
  },
  {
    id: 'cloud-fundamentals',
    title: 'Cloud Fundamentals',
    summary:
      'How AWS, Azure, and GCP actually work: identity, storage, networking, logging, and the shared responsibility model that trips people up.',
    plannedExercises: 20,
    tools: ['cloud-security'],
  },
  {
    id: 'identity-fundamentals',
    title: 'Identity and Access Fundamentals',
    summary:
      'Authentication versus authorisation, SSO, SAML and OIDC, MFA, joiner-mover-leaver, and least privilege as something you implement rather than recite.',
    plannedExercises: 18,
    tools: ['identity'],
  },
  {
    id: 'risk-fundamentals',
    title: 'Risk and Control Fundamentals',
    summary:
      'What a risk actually is, how controls reduce it, and how to assess and communicate residual risk without inventing numbers. No terminal required.',
    plannedExercises: 18,
    tools: ['grc-tooling'],
  },
  {
    id: 'frameworks',
    title: 'Control Frameworks and Regulation',
    summary:
      'NIST CSF and 800-53, ISO 27001, CIS Controls, and the regulations that force them: HIPAA, PCI DSS, SOX, GDPR, FISMA.',
    plannedExercises: 20,
    tools: ['grc-tooling'],
  },
  {
    id: 'security-writing',
    title: 'Writing for Security',
    summary:
      'Write a finding somebody acts on, an incident report that survives review, and an executive summary that does not bury the decision. The most undertrained skill in the field.',
    plannedExercises: 14,
  },
  {
    id: 'data-sql',
    title: 'Data Handling and SQL',
    summary:
      'Query, join, and aggregate security data. The difference between reading alerts and finding the pattern across a million of them.',
    plannedExercises: 18,
    tools: ['siem-search'],
  },
  {
    id: 'ai-foundations',
    title: 'How AI Systems Work',
    summary:
      'Weights, forward passes, tokens, embeddings, attention, and next-token prediction — the mechanics, computed by hand rather than described. Then the failure modes that fall out of each: overfitting, adversarial examples, poisoned training data, and prompt injection.',
    packageId: 'ai-foundations',
    tools: ['scripting'],
  },
  {
    id: 'ai-security-testing',
    title: 'AI Security Testing',
    summary:
      'Attack and defend a deployed model: find the injection, prove it is a class rather than a payload, deploy controls under a cost budget, and turn what you found into a deployment decision.',
    packageId: 'ai-security',
    tools: ['scripting', 'case-management'],
  },
  {
    id: 'adversarial-ml',
    title: 'Adversarial Machine Learning',
    summary:
      'Generate adversarial examples with FGSM and PGD, measure whether they transfer between models, and harden a classifier with adversarial training — including what that costs in ordinary accuracy.',
    plannedExercises: 18,
    tools: ['scripting'],
  },
  {
    id: 'ai-governance',
    title: 'AI Assurance and Governance',
    summary:
      'Model cards, data provenance, evaluation records, and the emerging regulation: what an organisation has to be able to prove about a model it deployed, and who signs it off.',
    plannedExercises: 16,
    tools: ['grc-tooling'],
  },
  {
    id: 'threat-modelling',
    title: 'Threat Modelling and ATT&CK',
    summary:
      'Reason about an adversary systematically: what they want, how they move, and how MITRE ATT&CK turns that into something you can measure coverage against.',
    plannedExercises: 16,
    tools: ['threat-intel'],
  },
];

const BY_ID = new Map(FOUNDATIONS.map((foundation) => [foundation.id, foundation]));

export function getFoundation(id: string): Foundation | null {
  return BY_ID.get(id) ?? null;
}

/** True when a foundation has a playable package behind it today. */
export function isFoundationPlayable(id: string): boolean {
  return typeof BY_ID.get(id)?.packageId === 'string';
}

/** Resolve a track's foundation ids into full records, preserving order. */
export function resolveFoundations(ids: string[]): Foundation[] {
  return ids.map((id) => BY_ID.get(id)).filter((f): f is Foundation => f !== undefined);
}
