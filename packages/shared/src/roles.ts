/**
 * The SOC roles a student can specialise into.
 *
 * WHY ROLES EXIST
 *
 * "SOC analyst" is not one job. The person triaging an alert queue and the
 * person carving artefacts out of a disk image are both in the SOC, and almost
 * nothing about their day is the same. Somebody who is patient and exhaustive
 * will be miserable clearing three hundred alerts before lunch and excellent at
 * forensics; somebody who is decisive under pressure is the reverse.
 *
 * Presenting one undifferentiated "SOC track" hides that from exactly the people
 * who most need to know it -- career changers who have never seen the work and
 * are trying to find out where they fit.
 *
 * So roles are first-class. They determine which exercises a student is routed
 * to after the shared foundations, which interface they work an incident
 * through, and what their portfolio is scored on.
 *
 * WHAT A ROLE IS NOT
 *
 * A role is not a lock. Every student does the same foundations, and branching
 * starts only once somebody has enough context to choose. Changing role must
 * never cost a pass: progress is keyed to exercise ids, so an exercise passed on
 * one role's path stays passed on another's.
 */

export const SOC_ROLE_IDS = [
  'soc-operator',
  'log-analyst',
  'threat-intel',
  'forensics',
  'ir-lead',
  'network-analyst',
  'vulnerability-analyst',
  'malware-analyst',
  'cloud-security',
  'ai-security',
] as const;

export type SocRoleId = (typeof SOC_ROLE_IDS)[number];

/**
 * The interface a role works an incident through.
 *
 * Each surface is a distinct view over the same incident. The whole value of the
 * multi-role model is that two roles looking at one intrusion see different
 * things, so these must not collapse into one another.
 */
export const ROLE_SURFACES = [
  'alert-queue',
  'log-workbench',
  'intel-workbench',
  'artifact-workbench',
  'command-view',
  'flow-view',
  'vuln-view',
  'sample-view',
  'cloud-view',
  'model-lab',
] as const;

export type RoleSurface = (typeof ROLE_SURFACES)[number];

/**
 * What a role is graded on.
 *
 * Deliberately role-specific: marking a forensics analyst on triage speed, or a
 * SOC operator on chain-of-custody rigour, grades them on somebody else's job.
 * These ids are also what a role-specific portfolio reports.
 */
export const ROLE_METRICS = [
  'triage-accuracy',
  'false-positive-rate',
  'escalation-judgement',
  'timeline-accuracy',
  'correlation-completeness',
  'ttp-mapping-coverage',
  'attribution-restraint',
  'artifact-completeness',
  'preservation-rigour',
  'decision-quality',
  'communication-clarity',
  'scope-accuracy',
  'anomaly-detection',
  'exfil-detection',
  'severity-accuracy',
  'prioritisation-quality',
  'behaviour-analysis',
  'detection-coverage',
  'identity-analysis',
  /* --- AI security -------------------------------------------------------
   *
   * Two metrics rather than one, because they fail in opposite directions and
   * a student needs to know which they did -- the same reasoning that keeps
   * triage precision and recall apart. `bypass-discovery` measures whether you
   * found the gap. `defence-selection` measures whether the controls you then
   * recommended would have closed it at a price somebody would pay, which is a
   * different skill and the one assessors are weakest at.
   */
  'bypass-discovery',
  'defence-selection',
] as const;

export type RoleMetric = (typeof ROLE_METRICS)[number];

export interface SocRole {
  id: SocRoleId;
  title: string;
  /** One sentence a newcomer can actually picture. */
  oneLine: string;
  /** What the day is really like, including the dull parts. */
  reality: string;
  /** The client view this role works through. */
  surface: RoleSurface;
  /** What this role sees that the others do not. */
  sees: string[];
  /** What this role is scored on. */
  metrics: RoleMetric[];
  /** Foundation ids this role leans on hardest, beyond the shared core. */
  keyFoundations: string[];
  /**
   * Honest counter-signal: who tends to dislike this role.
   *
   * Included on purpose. A pathway that only ever sells the upside routes people
   * into work they will quit within a year.
   */
  poorFitIf: string;
  /** True when playable exercises exist for this role's branch today. */
  playable: boolean;
}

export const SOC_ROLES: SocRole[] = [
  {
    id: 'soc-operator',
    title: 'SOC Operator (Alert Triage)',
    oneLine:
      'First eyes on every alert the tooling raises, deciding in minutes which handful deserve a human.',
    reality:
      'Most of the queue is noise, and the skill is disposing of it correctly rather than quickly. A wrong dismissal is invisible until it is a breach, and a queue triaged by escalating everything is the same as no queue at all. It is the most common way into the field, and the most common way out of it.',
    surface: 'alert-queue',
    sees: [
      'The alert queue, with severity, source, destination, and the rule that fired',
      'How often that rule has fired before, and how often it was wrong',
      'Reputation and prior-sighting lookups on an address or a hash',
      'Which other alerts share a source, a user, or a five-minute window',
    ],
    metrics: ['triage-accuracy', 'false-positive-rate', 'escalation-judgement'],
    keyFoundations: ['log-analysis', 'incident-concepts'],
    poorFitIf:
      'you need to finish what you start. Triage is deliberately shallow: you hand the interesting ones to somebody else and go back to the queue.',
    playable: true,
  },
  {
    id: 'log-analyst',
    title: 'Log Analyst',
    oneLine: 'Reconstructs what actually happened by reading the logs nobody else wants to read.',
    reality:
      'Long stretches of parsing malformed text, reconciling three clocks that disagree, and proving a negative. The payoff is that the timeline you build becomes what everyone else in the incident argues from.',
    surface: 'log-workbench',
    sees: [
      'Raw logs from every source, unfiltered',
      'A timeline builder for ordering events and finding the gaps between them',
      'Cross-log correlation by timestamp, user, process, or address',
    ],
    metrics: ['timeline-accuracy', 'correlation-completeness'],
    keyFoundations: ['log-analysis', 'regex', 'windows-events'],
    poorFitIf:
      'ambiguity frustrates you. Logs are incomplete and contradictory, and much of the job is being honest about what they do not prove.',
    playable: false,
  },
  {
    id: 'threat-intel',
    title: 'Threat Intelligence Analyst',
    oneLine:
      'Works out whether anyone has seen this before, and what the attacker is likely to do next.',
    reality:
      'Research, reading, and careful writing. The hardest discipline is restraint: attribution is easy to assert and hard to justify, and confident wrong attribution has consequences well beyond the incident.',
    surface: 'intel-workbench',
    sees: [
      'Indicators pulled from the incident: addresses, domains, hashes, behaviours',
      'MITRE ATT&CK technique mapping for the incident so far',
      'Prior campaigns with overlapping tradecraft',
    ],
    metrics: ['ttp-mapping-coverage', 'attribution-restraint'],
    keyFoundations: ['threat-modelling', 'security-writing'],
    poorFitIf:
      'you want to fix things. Intel informs decisions other people make, and you rarely touch the systems involved.',
    playable: false,
  },
  {
    id: 'forensics',
    title: 'Forensics Analyst',
    oneLine:
      'Recovers and preserves evidence of what was done, to a standard that survives a courtroom.',
    reality:
      'Slow, procedural, and unforgiving of shortcuts. Order of operations matters — memory before disk, hash before touch — because evidence collected wrongly is evidence that cannot be used at all.',
    surface: 'artifact-workbench',
    sees: [
      'Memory and disk artefacts parsed into readable form',
      'A filesystem timeline, with what changed and when',
      'Configuration diffs against a known-good baseline',
      'Chain of custody for every artefact handled',
    ],
    metrics: ['artifact-completeness', 'preservation-rigour', 'timeline-accuracy'],
    keyFoundations: ['investigation-tools', 'windows-events', 'security-writing'],
    poorFitIf:
      'you dislike process for its own sake. Much of the rigour exists for legal reasons rather than technical ones, and none of it is optional.',
    playable: false,
  },
  {
    id: 'ir-lead',
    title: 'Incident Response Lead',
    oneLine:
      'Decides what the team does next, on incomplete information, while the incident is still moving.',
    reality:
      'Almost entirely communication and decision-making. You will make irreversible calls — isolate now, or watch longer — knowing you have perhaps sixty percent of the picture, and then explain them to executives who want a number you do not have.',
    surface: 'command-view',
    sees: [
      'A high-level incident picture: scope, affected systems, business impact',
      'What each analyst is working on and what they have found',
      'Containment options with their consequences spelled out',
      'The escalation path and the notification clock',
    ],
    metrics: ['decision-quality', 'scope-accuracy', 'communication-clarity'],
    keyFoundations: ['incident-concepts', 'security-writing', 'risk-fundamentals'],
    poorFitIf:
      'you want to do the technical work yourself. Leading means delegating the interesting parts and living with somebody else’s analysis.',
    playable: false,
  },
  {
    id: 'network-analyst',
    title: 'Network Analyst',
    oneLine: 'Answers what is talking to what, and whether it should be.',
    reality:
      'Pattern work at volume: separating a beacon from a software updater, a backup job from an exfiltration. Most of what looks alarming turns out to be a misconfigured appliance.',
    surface: 'flow-view',
    sees: [
      'Connection flows: source, destination, port, protocol, volume, direction',
      'Internal-to-internal movement between systems',
      'Current traffic measured against an established baseline',
    ],
    metrics: ['anomaly-detection', 'exfil-detection'],
    keyFoundations: ['networking', 'packet-analysis'],
    poorFitIf:
      'you want definitive answers. Flow data tells you that two hosts spoke, rarely what they said.',
    playable: false,
  },
  {
    id: 'vulnerability-analyst',
    title: 'Vulnerability Analyst',
    oneLine:
      'Decides what gets patched first when there are ten thousand findings and capacity for two hundred.',
    reality:
      'Mostly prioritisation and negotiation. The technical part is quick; persuading a business owner to accept an outage window is the actual work. Scanner output is noisy and confidently wrong about severity.',
    surface: 'vuln-view',
    sees: [
      'Scanner findings across the estate, with CVSS and exploitability',
      'Asset inventory and current patch state',
      'Whether a weaponised exploit exists in the wild',
    ],
    metrics: ['severity-accuracy', 'prioritisation-quality'],
    keyFoundations: ['networking', 'risk-fundamentals'],
    poorFitIf:
      'you find repetition draining. The cycle is monthly and the backlog never reaches zero.',
    playable: false,
  },
  {
    id: 'malware-analyst',
    title: 'Malware Analyst',
    oneLine:
      'Determines what a suspicious file actually does, and writes the signature that catches the next one.',
    reality:
      'The deepest technical specialism here, and the least often needed — perhaps one incident in five. Requires comfort with assembly, obfuscation, and code written specifically to mislead you.',
    surface: 'sample-view',
    sees: [
      'Sample metadata: hashes, entropy, file type, where it was found',
      'Strings and structure extracted from the binary',
      'Sandbox behaviour: files touched, processes spawned, network attempted',
    ],
    metrics: ['behaviour-analysis', 'detection-coverage'],
    keyFoundations: ['investigation-tools', 'scripting'],
    poorFitIf:
      'you want breadth. This is a narrow, deep specialism, and entry-level positions in it are genuinely rare.',
    playable: false,
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security Specialist',
    oneLine: 'Investigates compromise in infrastructure that has no console to walk up to.',
    reality:
      'Everything is an API call and an identity. Attacks look like ordinary administration until you notice which principal made the call, and the logs are enormous, delayed, and charged by the gigabyte.',
    surface: 'cloud-view',
    sees: [
      'Provider audit logs: who called which API, from where, with what result',
      'Identity and permission changes over time',
      'Resource and configuration drift',
    ],
    metrics: ['identity-analysis', 'anomaly-detection'],
    keyFoundations: ['cloud-fundamentals', 'identity-fundamentals'],
    poorFitIf:
      'you prefer systems you can hold. Cloud work is abstract, and the evidence you get is whatever the provider chose to record.',
    playable: false,
  },
  {
    id: 'ai-security',
    title: 'AI Security Analyst',
    oneLine:
      'Tests the models the organisation has deployed, and decides whether one is safe to put in front of a decision.',
    reality:
      'Almost none of it is the live incident queue. It is scoping documents, a few hundred payloads that mostly fail, rows of training data read by hand, and a report somebody’s launch date depends on. The single most valuable thing you do usually happens before you send anything -- working out which path into the system nobody has tested. Expect to be the reason a release slips, repeatedly, and to be right about it in a way the team can check.',
    surface: 'model-lab',
    sees: [
      'The model card: what the system is for, where it is deployed, how much traffic it takes, and what the owning team claim about its defences',
      'A probe console for sending payloads down either the user path or the retrieval path, and what happened to each',
      'The stage a blocked payload died at -- before the model, at the instruction boundary, or on the way out -- but never which control caught it',
      'Fixed attack suites, and what a chosen defence set does against them at what cost',
    ],
    metrics: ['bypass-discovery', 'defence-selection', 'severity-accuracy', 'communication-clarity'],
    keyFoundations: ['ai-foundations', 'ai-security-testing', 'scripting', 'security-writing'],
    poorFitIf:
      'you want to be in the room when something is happening. This role sits outside the incident queue by design, its wins are launches that did not go wrong, and a week that ends in "I could not break it" is a normal week rather than a failed one.',
    playable: true,
  },
];

const ROLE_BY_ID = new Map(SOC_ROLES.map((role) => [role.id, role]));

export function getSocRole(id: string): SocRole | null {
  return ROLE_BY_ID.get(id as SocRoleId) ?? null;
}

/** Roles with playable exercises today, so the UI never offers an empty path. */
export function playableRoles(): SocRole[] {
  return SOC_ROLES.filter((role) => role.playable);
}
