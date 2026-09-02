/**
 * The foundation pool.
 *
 * WHAT A FOUNDATION IS, AND WHAT IT IS NOT
 *
 * A foundation is a prerequisite SKILL that several tracks need before their own
 * material makes sense. It is not a course in its own right. That distinction
 * was blurred for a while: Log Analysis, Networking, Alert Triage, Incident
 * Response and the AI packages all sat here as "foundations", when each of them
 * is really a stage of somebody's career route. They have moved into the tracks
 * that teach them, and this file is now what it was meant to be.
 *
 * LINUX IS THE ONLY BUILT FOUNDATION, ON PURPOSE
 *
 * Almost every route eventually puts a student in front of a terminal, so Linux
 * is the one thing that genuinely sits underneath the others, and it is the
 * prerequisite on every package except the risk route, which never opens a
 * shell and gates on nothing.
 *
 * The remaining entries are unbuilt skills with honest sizes attached, so the
 * roadmap is visible rather than implied. A track declares which ones it needs,
 * which is what stops the curriculum being one long line everybody walks: a
 * future GRC analyst is not made to clear four packages of shell commands to
 * reach material that never uses one.
 */

import type { Foundation } from '@soc/shared';

export const FOUNDATIONS: Foundation[] = [
  {
    id: 'linux',
    title: 'Linux Fundamentals',
    summary:
      'Move around a Linux server, work with files, read logs, and search them with grep and pipes. The substrate almost all security tooling sits on.',
    packageId: 'linux-fundamentals',
    tools: ['scripting'],
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
      'HTTP, sessions, cookies, and the request/response cycle: plus the OWASP Top 10 classes and why each one happens.',
    plannedExercises: 18,
    tools: ['web-app-testing'],
  },
  {
    id: 'crypto-basics',
    title: 'Cryptography in Practice',
    summary:
      'Hashing, symmetric and public key encryption, TLS, and certificates: enough to reason about them correctly without implementing any of it yourself.',
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
    id: 'adversarial-ml',
    title: 'Adversarial Machine Learning',
    summary:
      'Generate adversarial examples with FGSM and PGD, measure whether they transfer between models, and harden a classifier with adversarial training: including what that costs in ordinary accuracy.',
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
