/**
 * Certification catalogue.
 *
 * WHY CERTIFICATIONS GET THEIR OWN MODULE
 *
 * For a career changer, certifications do two things that a portfolio cannot.
 * They get a CV past an automated filter, and in some sectors they are legally
 * or contractually mandatory. US federal defence work under DoD 8140 will not
 * hire an unqualified candidate into certain roles no matter how good they are,
 * because the contract forbids it. That is the single most useful thing this
 * platform can tell somebody who is considering government work.
 *
 * WHAT THIS MODULE REFUSES TO DO
 *
 * It will not pretend certifications substitute for skill. The industry is full
 * of people who passed Security+ and cannot read a log. The honest framing, used
 * throughout: the certificate opens the door, the skill keeps you in the room.
 *
 * Costs are exam-only, in USD, and approximate. They move, and training is extra.
 */

import type { Certification } from '@soc/shared';

export const CERTIFICATIONS: Certification[] = [
  // --- entry ----------------------------------------------------------------
  {
    id: 'sec-plus',
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    stage: 'entry',
    summary:
      'The default first security certification and the most widely requested by name. Broad and shallow by design: it proves you speak the language across the whole field.',
    approxCostUsd: 404,
    typicalStudyWeeks: 8,
    mandatedSomewhere: true,
    mandateNote:
      'A DoD 8140/8570 baseline certification for several IAT and IAM roles. Many US federal contracts require it before you can start, which makes it effectively compulsory for that sector.',
    url: 'https://www.comptia.org/certifications/security',
  },
  {
    id: 'net-plus',
    name: 'CompTIA Network+',
    issuer: 'CompTIA',
    stage: 'entry',
    summary:
      'Networking fundamentals. Worth taking before Security+ if networks are genuinely unfamiliar, because most security concepts assume you already understand routing and ports.',
    approxCostUsd: 369,
    typicalStudyWeeks: 6,
    url: 'https://www.comptia.org/certifications/network',
  },
  {
    id: 'sscp',
    name: 'SSCP',
    issuer: 'ISC2',
    stage: 'entry',
    summary:
      'A hands-on operational security certification, positioned as the practitioner-level step below CISSP. Requires one year of relevant experience.',
    approxCostUsd: 249,
    typicalStudyWeeks: 10,
    url: 'https://www.isc2.org/certifications/sscp',
  },
  {
    id: 'az-900',
    name: 'Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    stage: 'entry',
    summary:
      'Cheap, fast, and a credible signal that you understand cloud basics. A sensible first certificate for anyone heading toward cloud or identity work.',
    approxCostUsd: 99,
    typicalStudyWeeks: 3,
    url: 'https://learn.microsoft.com/credentials/certifications/azure-fundamentals/',
  },
  {
    id: 'ejpt',
    name: 'eJPT',
    issuer: 'INE Security',
    stage: 'entry',
    summary:
      'An entirely practical entry-level penetration testing certificate. You compromise a live lab rather than answer multiple choice, which makes it a genuine skills signal.',
    approxCostUsd: 249,
    typicalStudyWeeks: 8,
    url: 'https://security.ine.com/certifications/ejpt-certification/',
  },
  {
    id: 'btl1',
    name: 'Blue Team Level 1',
    issuer: 'Security Blue Team',
    stage: 'entry',
    summary:
      'A practical defensive certification covering triage, phishing analysis, digital forensics, and SIEM work. Increasingly recognised for SOC hiring and genuinely hands-on.',
    approxCostUsd: 445,
    typicalStudyWeeks: 10,
    url: 'https://securityblue.team/',
  },

  // --- core -----------------------------------------------------------------
  {
    id: 'cysa-plus',
    name: 'CompTIA CySA+',
    issuer: 'CompTIA',
    stage: 'core',
    summary:
      'Behavioural analytics, detection, and incident response. The natural follow-on from Security+ for defensive work, and another DoD baseline.',
    approxCostUsd: 425,
    typicalStudyWeeks: 10,
    mandatedSomewhere: true,
    mandateNote: 'A DoD 8140/8570 baseline certification for CSSP Analyst roles.',
    prerequisites: ['sec-plus'],
    url: 'https://www.comptia.org/certifications/cybersecurity-analyst',
  },
  {
    id: 'sc-200',
    name: 'Security Operations Analyst (SC-200)',
    issuer: 'Microsoft',
    stage: 'core',
    summary:
      'Defender and Sentinel operations, including KQL. Very high value if the employer is a Microsoft shop, which a large share of enterprises and government agencies are.',
    approxCostUsd: 165,
    typicalStudyWeeks: 8,
    url: 'https://learn.microsoft.com/credentials/certifications/security-operations-analyst/',
  },
  {
    id: 'gcih',
    name: 'GCIH',
    issuer: 'GIAC / SANS',
    stage: 'core',
    summary:
      'Incident handling and attacker technique. Extremely well regarded, and extremely expensive unless an employer pays or you win a scholarship.',
    approxCostUsd: 999,
    typicalStudyWeeks: 12,
    mandatedSomewhere: true,
    mandateNote: 'A DoD 8140/8570 baseline certification for several incident response roles.',
    url: 'https://www.giac.org/certifications/certified-incident-handler-gcih/',
  },
  {
    id: 'pentest-plus',
    name: 'CompTIA PenTest+',
    issuer: 'CompTIA',
    stage: 'core',
    summary:
      'Penetration testing methodology and reporting, with a scope that includes the planning and legal side rather than only exploitation.',
    approxCostUsd: 425,
    typicalStudyWeeks: 10,
    prerequisites: ['sec-plus'],
    url: 'https://www.comptia.org/certifications/pentest',
  },
  {
    id: 'oscp',
    name: 'OSCP',
    issuer: 'OffSec',
    stage: 'core',
    summary:
      'A 24-hour practical exam where you compromise machines and write a professional report. The reference certification for offensive work, and genuinely difficult.',
    approxCostUsd: 1749,
    typicalStudyWeeks: 24,
    url: 'https://www.offsec.com/courses/pen-200/',
  },
  {
    id: 'cisa',
    name: 'CISA',
    issuer: 'ISACA',
    stage: 'core',
    summary:
      'The information systems auditing standard. If audit or assurance is the target, this is the certification hiring managers look for by name.',
    approxCostUsd: 575,
    typicalStudyWeeks: 14,
    url: 'https://www.isaca.org/credentialing/cisa',
  },
  {
    id: 'crisc',
    name: 'CRISC',
    issuer: 'ISACA',
    stage: 'core',
    summary: 'Risk management and control monitoring, aimed squarely at enterprise risk roles.',
    approxCostUsd: 575,
    typicalStudyWeeks: 14,
    url: 'https://www.isaca.org/credentialing/crisc',
  },
  {
    id: 'cgrc',
    name: 'CGRC (formerly CAP)',
    issuer: 'ISC2',
    stage: 'core',
    summary:
      'Authorisation and the NIST Risk Management Framework. Disproportionately valuable in US federal work, where RMF is the operating language.',
    approxCostUsd: 599,
    typicalStudyWeeks: 12,
    mandatedSomewhere: true,
    mandateNote: 'Recognised under DoD 8140 for authorisation and RMF-focused roles.',
    url: 'https://www.isc2.org/certifications/cgrc',
  },
  {
    id: 'sc-300',
    name: 'Identity and Access Administrator (SC-300)',
    issuer: 'Microsoft',
    stage: 'core',
    summary:
      'Entra ID identity administration: conditional access, lifecycle, and governance. The most directly employable identity certificate in Microsoft environments.',
    approxCostUsd: 165,
    typicalStudyWeeks: 8,
    url: 'https://learn.microsoft.com/credentials/certifications/identity-and-access-administrator/',
  },
  {
    id: 'az-500',
    name: 'Azure Security Engineer (AZ-500)',
    issuer: 'Microsoft',
    stage: 'core',
    summary: 'Securing Azure workloads, identity, and data. Pairs well with AZ-900 and with government work, where Azure Government is common.',
    approxCostUsd: 165,
    typicalStudyWeeks: 10,
    prerequisites: ['az-900'],
    url: 'https://learn.microsoft.com/credentials/certifications/azure-security-engineer/',
  },
  {
    id: 'aws-security',
    name: 'AWS Certified Security - Specialty',
    issuer: 'Amazon Web Services',
    stage: 'core',
    summary: 'Securing AWS environments in depth. Expects real familiarity with AWS rather than general cloud theory.',
    approxCostUsd: 300,
    typicalStudyWeeks: 12,
    url: 'https://aws.amazon.com/certification/certified-security-specialty/',
  },
  {
    id: 'gcfa',
    name: 'GCFA',
    issuer: 'GIAC / SANS',
    stage: 'core',
    summary: 'Advanced digital forensics and incident response. The recognised standard for serious forensic work, and priced accordingly.',
    approxCostUsd: 999,
    typicalStudyWeeks: 14,
    url: 'https://www.giac.org/certifications/certified-forensic-analyst-gcfa/',
  },
  {
    id: 'cipp-us',
    name: 'CIPP/US',
    issuer: 'IAPP',
    stage: 'core',
    summary: 'US privacy law and practice. The privacy profession\'s entry credential, and the one privacy job adverts name.',
    approxCostUsd: 550,
    typicalStudyWeeks: 10,
    url: 'https://iapp.org/certify/cippus/',
  },
  {
    id: 'gicsp',
    name: 'GICSP',
    issuer: 'GIAC / SANS',
    stage: 'core',
    summary:
      'Industrial control systems security, bridging engineering and IT security. Niche, well paid, and in demand across utilities, manufacturing, and public infrastructure.',
    approxCostUsd: 999,
    typicalStudyWeeks: 14,
    url: 'https://www.giac.org/certifications/global-industrial-cyber-security-professional-gicsp/',
  },

  // --- advanced -------------------------------------------------------------
  {
    id: 'cissp',
    name: 'CISSP',
    issuer: 'ISC2',
    stage: 'advanced',
    summary:
      'The management-level breadth certification. Requires five years of experience, so it is a goal rather than a starting point — but it appears in an enormous number of senior job adverts.',
    approxCostUsd: 749,
    typicalStudyWeeks: 20,
    mandatedSomewhere: true,
    mandateNote: 'A DoD 8140/8570 baseline for senior IAT and IAM levels.',
    url: 'https://www.isc2.org/certifications/cissp',
  },
  {
    id: 'cism',
    name: 'CISM',
    issuer: 'ISACA',
    stage: 'advanced',
    summary: 'Security management and governance, aimed at people who run programmes rather than operate tools.',
    approxCostUsd: 575,
    typicalStudyWeeks: 16,
    url: 'https://www.isaca.org/credentialing/cism',
  },
  {
    id: 'ccsp',
    name: 'CCSP',
    issuer: 'ISC2',
    stage: 'advanced',
    summary: 'Cloud security at architecture level, vendor-neutral. Expects existing cloud and security experience.',
    approxCostUsd: 599,
    typicalStudyWeeks: 16,
    url: 'https://www.isc2.org/certifications/ccsp',
  },
  {
    id: 'osep',
    name: 'OSEP',
    issuer: 'OffSec',
    stage: 'advanced',
    summary: 'Advanced evasion and post-exploitation, for people already working offensively.',
    approxCostUsd: 1749,
    typicalStudyWeeks: 24,
    prerequisites: ['oscp'],
    url: 'https://www.offsec.com/courses/pen-300/',
  },
];

const BY_ID = new Map(CERTIFICATIONS.map((cert) => [cert.id, cert]));

export function getCertification(id: string): Certification | null {
  return BY_ID.get(id) ?? null;
}

export function resolveCertifications(ids: string[]) {
  return ids.map((id) => BY_ID.get(id)).filter((c): c is Certification => c !== undefined);
}

/**
 * The framing shown alongside any certification list.
 *
 * Stated once, here, so the platform does not drift into implying that
 * collecting certificates is the same as becoming employable.
 */
export const CERT_PHILOSOPHY = {
  headline: 'A certificate opens the door. The skill keeps you in the room.',
  body: [
    'Certifications matter for two unglamorous reasons: automated CV filters screen on them, and some sectors mandate them contractually. Neither reason has anything to do with whether you can do the work — but both decide whether you get the interview.',
    'The field is full of people who passed an exam and cannot read a log. Hiring managers know this, and technical interviews are designed to find them out. Study for the certificate, but build the skill alongside it, because the interview tests the second one.',
    'Do not collect certificates. One relevant certification plus demonstrable hands-on work beats four certificates and no portfolio, every time.',
  ],
} as const;

/**
 * Certification guidance that depends on where somebody wants to work.
 *
 * This is the concrete payoff of asking about sector: a mandated baseline in
 * federal defence work is a hard gate, and nobody should discover that late.
 */
export const SECTOR_CERT_GUIDANCE = {
  federal:
    'US federal and defence work is the one place certifications are genuinely compulsory. DoD 8140 (formerly 8570) specifies baseline certifications by role, and a contract may forbid hiring you into a position until you hold one — Security+ is the most common gate. Budget for a clearance process measured in months, and note that many roles require US citizenship. The upside is real: stable funding, structured progression, and employers who will pay for your training.',
  state_local:
    'State and local government pays less than private industry but is markedly more accessible: smaller teams, broader responsibilities, and hiring managers who will take a career changer with Security+ and genuine enthusiasm. Expect CJIS requirements if the work touches law enforcement data, and expect to be a generalist rather than a specialist. It is one of the best places to get a first security job.',
  private_large:
    'Large private employers hire into specialised roles with defined tiers, so you can enter narrow and grow. They care about certifications for CV screening and often name specific vendor products — Splunk, CrowdStrike, Microsoft — so a vendor certificate matching their stack is worth more than another general one. Many will fund your training once you are in.',
  private_small:
    'Small companies and managed service providers need generalists who can do a bit of everything, which suits a career changer with prior professional experience. Certifications matter less than demonstrable ability; a home lab you can talk about credibly often counts for more. Expect wider responsibility, faster learning, and less structure.',
} as const;
