/**
 * Career tracks.
 *
 * A track is an ordered curriculum aimed at one role. Tracks reference packages
 * rather than owning them, so a shared foundation like Linux Fundamentals is
 * written once and appears in every track that needs it.
 *
 * HONESTY ABOUT WHAT EXISTS
 *
 * Stages without a `packageId` are planned and not yet written. They are listed
 * on purpose rather than hidden: a student deserves to see where a track leads,
 * and whoever writes the remaining content deserves a precise list of what is
 * outstanding. Nothing here pretends to be playable when it is not.
 *
 * As of this build, two packages exist: Linux Fundamentals (22 exercises) and
 * Log Analysis and Parsing (14). Everything else below is an outline.
 */

import type { Track } from '@soc/shared';

/** Shared foundation, referenced by more than one track. */
const LINUX_FUNDAMENTALS = {
  title: 'Linux Fundamentals',
  summary:
    'Move around a Linux server, work with files, read logs, and search them with grep and pipes.',
  packageId: '1',
};

/** Also shared: threat hunting needs the same log-reading fluency. */
const LOG_ANALYSIS = {
  title: 'Log Analysis and Parsing',
  summary:
    'Read syslog and auth.log fluently, extract fields, build timelines, and correlate an event across two log files.',
  packageId: '2',
};

export const TRACKS: Track[] = [
  {
    id: 'soc',
    order: 1,
    title: 'SOC Analyst',
    summary:
      'Work a security operations centre queue: read the logs, tell signal from noise, and run an incident to a conclusion.',
    audience:
      'Career changers who hold Security+ or equivalent theory and have never touched a live system.',
    roles: ['SOC Analyst (Tier 1)', 'Security Analyst', 'Incident Response Analyst'],
    status: 'available',
    curriculum: [
      LINUX_FUNDAMENTALS,
      LOG_ANALYSIS,
      {
        title: 'Networking Basics',
        summary:
          'Interfaces, ports, and DNS from the command line. Work out what a host is talking to and why.',
        plannedExercises: 12,
      },
      {
        title: 'Command Line Tools for Investigation',
        summary:
          'Processes, filesystem forensics, permissions, and services. Find what should not be running.',
        plannedExercises: 18,
      },
      {
        title: 'Security Incident Concepts',
        summary:
          'Severity, indicators of compromise, containment decisions, attacker tactics, and full case studies.',
        plannedExercises: 19,
      },
      {
        title: 'Live SOC Scenarios',
        summary:
          'A real-time incident queue. Investigate with the terminal, take response actions, and justify what you did.',
        plannedExercises: 5,
      },
    ],
  },
  {
    id: 'risk-governance',
    order: 2,
    title: 'Risk and Governance',
    summary:
      'Translate technical findings into risk decisions: frameworks, controls, audit evidence, and the paperwork that makes it real.',
    audience:
      'People moving into GRC from audit, compliance, healthcare administration, or a technical role.',
    roles: ['GRC Analyst', 'Risk Analyst', 'Compliance Analyst', 'Internal Auditor'],
    status: 'in_development',
    curriculum: [
      {
        title: 'Risk Fundamentals',
        summary:
          'Threat, vulnerability, likelihood, impact. Build and defend a risk rating rather than guessing at one.',
        plannedExercises: 16,
      },
      {
        title: 'Control Frameworks',
        summary:
          'NIST CSF, ISO 27001, and CIS Controls. Map a real finding to the control that should have caught it.',
        plannedExercises: 18,
      },
      {
        title: 'Regulatory Landscape',
        summary:
          'HIPAA, PCI DSS, SOX, and GDPR: which applies, to what data, and what each one actually demands.',
        plannedExercises: 20,
      },
      {
        title: 'Audit and Evidence',
        summary:
          'Gather evidence that stands up, sample a population, document a control test, and write a finding.',
        plannedExercises: 16,
      },
      {
        title: 'Policy and Third-Party Risk',
        summary:
          'Write a workable policy, run a vendor assessment, and handle exceptions without rubber-stamping them.',
        plannedExercises: 14,
      },
    ],
  },
  {
    id: 'data-analyst',
    order: 3,
    title: 'Security Data Analyst',
    summary:
      'Turn security telemetry into answers: query it, aggregate it, chart it, and say what it means without overstating it.',
    audience:
      'Analytically minded people who want the data side of security rather than the incident queue.',
    roles: ['Security Data Analyst', 'Detection Engineer', 'Threat Intelligence Analyst'],
    status: 'in_development',
    curriculum: [
      LINUX_FUNDAMENTALS,
      {
        title: 'Data Wrangling on the Command Line',
        summary:
          'cut, sort, uniq, awk, and jq. Reshape messy log data into something countable without leaving the shell.',
        plannedExercises: 18,
      },
      {
        title: 'SQL for Security Data',
        summary:
          'Query event tables, aggregate by time window, join across sources, and spot the outlier.',
        plannedExercises: 20,
      },
      {
        title: 'Detection Logic',
        summary:
          'Write detections that fire on real attacks and stay quiet otherwise. Tune false positives deliberately.',
        plannedExercises: 16,
      },
      {
        title: 'Reporting and Visualisation',
        summary:
          'Build a metric that survives scrutiny, chart it honestly, and brief a finding to people who are not technical.',
        plannedExercises: 14,
      },
    ],
  },
];

const TRACK_BY_ID = new Map(TRACKS.map((track) => [track.id, track]));

export function getTrack(trackId: string): Track | null {
  return TRACK_BY_ID.get(trackId) ?? null;
}

/** Package ids a track actually contains, in curriculum order. */
export function trackPackageIds(trackId: string): string[] {
  const track = TRACK_BY_ID.get(trackId);
  if (!track) return [];
  return track.curriculum
    .map((stage) => stage.packageId)
    .filter((id): id is string => typeof id === 'string');
}

/** The track a package belongs to first, used to route a student back. */
export function trackForPackage(packageId: string): Track | null {
  return TRACKS.find((track) => trackPackageIds(track.id).includes(packageId)) ?? null;
}
