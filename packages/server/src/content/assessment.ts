/**
 * The career assessment.
 *
 * DESIGN PRINCIPLE: ASK ABOUT WORK, NOT JOB TITLES
 *
 * The audience for this platform does not know what a "GRC Analyst" or a
 * "Detection Engineer" does. Asking them to pick a job title would just measure
 * which words sound impressive. So every interest question describes a Tuesday
 * afternoon instead: what you would be doing, and how it would feel.
 *
 * SECOND PRINCIPLE: MEASURE CONSTRAINTS, NOT JUST PREFERENCES
 *
 * Enthusiasm does not pay rent. Shift tolerance, clearance eligibility, and the
 * background someone already has do more to determine whether they get hired
 * than which topic excites them most. Those questions are weighted accordingly,
 * and a couple of them can rule a track out rather than merely score it down.
 *
 * THIRD PRINCIPLE: NO WRONG ANSWERS, AND NO FLATTERY
 *
 * The result is a recommendation with reasoning attached, plus alternatives. It
 * is explicitly overridable — a student picks their own route afterwards. The
 * assessment's job is to make sure they know the options exist, not to decide
 * for them.
 */

import type {
  AssessmentAnswer,
  AssessmentQuestion,
  LearnerProfile,
  Recommendation,
  TrackScore,
  TrackWeights,
} from '@soc/shared';

import { TRACKS } from './tracks.js';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // --- what the work feels like ---------------------------------------------
  {
    id: 'q-rhythm',
    prompt: 'Which working day sounds better to you?',
    rationale: 'Security roles differ enormously in pace. This is about temperament, not ability.',
    options: [
      {
        id: 'reactive',
        label: 'Something is happening right now and I need to work out what',
        detail: 'Urgent, interrupt-driven, and you go home knowing what you dealt with.',
        weights: { soc: 3, 'incident-response': 3, 'threat-intel': 1 },
      },
      {
        id: 'building',
        label: 'I am building something that stops the problem happening again',
        detail: 'Longer projects, fewer interruptions, and progress you can point at.',
        weights: { 'detection-engineering': 3, 'security-engineering': 3, 'cloud-security': 2, appsec: 2, identity: 2 },
      },
      {
        id: 'investigating',
        label: 'I am digging through evidence to reconstruct what already happened',
        detail: 'Deep, patient, detailed work with a definite answer at the end.',
        weights: { 'incident-response': 3, 'threat-intel': 2, 'compliance-audit': 1 },
      },
      {
        id: 'organising',
        label: 'I am working out what the organisation should worry about and getting people to act',
        detail: 'Meetings, writing, and persuasion. The output is a decision rather than a fix.',
        weights: { 'risk-governance': 3, 'compliance-audit': 3, privacy: 3, awareness: 2, 'vuln-management': 1 },
      },
    ],
  },
  {
    id: 'q-instinct',
    prompt: 'You are handed an unfamiliar system. What is your first instinct?',
    rationale: 'This separates people who want to break things from people who want to understand or govern them.',
    options: [
      {
        id: 'break',
        label: 'Find out how to break it',
        weights: { pentest: 4, appsec: 2, 'vuln-management': 1 },
      },
      {
        id: 'watch',
        label: 'Work out how I would know if someone else broke it',
        weights: { soc: 3, 'detection-engineering': 3, 'incident-response': 2 },
      },
      {
        id: 'harden',
        label: 'Work out how it is configured and what I would change',
        weights: { 'security-engineering': 3, 'cloud-security': 3, identity: 2, 'vuln-management': 2 },
      },
      {
        id: 'govern',
        label: 'Work out who is accountable for it and whether that is documented',
        weights: { 'risk-governance': 3, 'compliance-audit': 3, privacy: 2 },
      },
    ],
  },
  {
    id: 'q-technical-depth',
    prompt: 'How do you feel about spending your day in a terminal?',
    rationale:
      'A genuine fork. Several well-paid security careers involve almost no command line, and nobody should be pushed into one that does not suit them.',
    options: [
      {
        id: 'love',
        label: 'That sounds great — I want to be deeply hands-on',
        weights: { pentest: 3, 'incident-response': 3, 'security-engineering': 3, 'detection-engineering': 2, soc: 2, 'cloud-security': 2 },
      },
      {
        id: 'willing',
        label: 'Happy to learn it, as long as it is not the whole job',
        weights: { soc: 2, 'vuln-management': 2, identity: 2, 'cloud-security': 2, 'threat-intel': 1 },
      },
      {
        id: 'prefer-not',
        label: 'I would rather work with people, documents, and decisions',
        weights: { 'risk-governance': 4, 'compliance-audit': 4, privacy: 4, awareness: 4, 'threat-intel': 1, pentest: -2, 'incident-response': -2 },
      },
    ],
  },
  {
    id: 'q-writing',
    prompt: 'How do you feel about writing as a large part of the job?',
    rationale: 'Some roles are 60% writing. People who enjoy that are rare and in demand.',
    options: [
      {
        id: 'strength',
        label: 'Writing is one of my strengths',
        weights: { 'threat-intel': 3, 'risk-governance': 3, 'compliance-audit': 3, privacy: 3, awareness: 3, pentest: 1 },
      },
      { id: 'fine', label: 'I can write when I need to', weights: { soc: 1, 'incident-response': 1 } },
      {
        id: 'avoid',
        label: 'I would rather the work spoke for itself',
        weights: { 'security-engineering': 2, 'detection-engineering': 2, 'cloud-security': 1, 'risk-governance': -2, 'compliance-audit': -2, privacy: -2 },
      },
    ],
  },
  {
    id: 'q-shift',
    prompt: 'Could you work nights, weekends, or an on-call rota?',
    rationale:
      'Tier 1 SOC roles are frequently shift-based, and incident response is on-call by nature. This is a life constraint, not a measure of commitment.',
    options: [
      { id: 'yes', label: 'Yes, that is fine', weights: { soc: 2, 'incident-response': 2 } },
      { id: 'short-term', label: 'For a while, to get started', weights: { soc: 1 } },
      {
        id: 'no',
        label: 'No — I need predictable hours',
        detail: 'Caring responsibilities, health, study, or simply preference. Plenty of security work is strictly business hours.',
        weights: {
          soc: -3,
          'incident-response': -4,
          'risk-governance': 2,
          'compliance-audit': 2,
          privacy: 2,
          awareness: 2,
          identity: 2,
          'vuln-management': 1,
          'detection-engineering': 1,
        },
      },
    ],
  },
  {
    id: 'q-people',
    prompt: 'How much do you want to work with people outside your own team?',
    options: [
      {
        id: 'lots',
        label: 'A lot — persuading and explaining is the part I enjoy',
        weights: { 'risk-governance': 3, 'compliance-audit': 2, awareness: 4, privacy: 2, 'vuln-management': 2 },
      },
      { id: 'some', label: 'Some, but I want technical work at the centre', weights: { soc: 1, 'cloud-security': 1, identity: 2, appsec: 2 } },
      {
        id: 'little',
        label: 'As little as possible — let me focus',
        weights: { 'detection-engineering': 2, 'incident-response': 2, pentest: 2, 'security-engineering': 2, awareness: -3 },
      },
    ],
  },
  {
    id: 'q-data',
    prompt: 'How do you feel about working with data — spreadsheets, queries, patterns in large sets?',
    options: [
      {
        id: 'enjoy',
        label: 'I enjoy it and I am good at it',
        weights: { 'detection-engineering': 3, 'threat-intel': 2, 'compliance-audit': 2, soc: 1 },
      },
      { id: 'neutral', label: 'It is fine', weights: {} },
      { id: 'dislike', label: 'I would rather not', weights: { 'detection-engineering': -2 } },
    ],
  },
  {
    id: 'q-physical',
    prompt: 'Does it appeal to you to protect physical things — power, water, transport, manufacturing?',
    rationale: 'Industrial security is a distinct and under-recruited field where prior engineering experience counts for a lot.',
    options: [
      { id: 'yes', label: 'Yes, that sounds meaningful', weights: { 'ot-ics': 4 } },
      { id: 'no', label: 'Not particularly', weights: {} },
    ],
  },

  // --- what they bring ------------------------------------------------------
  {
    id: 'q-background',
    prompt: 'What is your background before security?',
    rationale:
      'Your existing experience is an asset, not something to overcome. Some transfers are much shorter than others.',
    options: [
      {
        id: 'it_support',
        label: 'IT support, service desk, or system administration',
        weights: { soc: 3, identity: 3, 'security-engineering': 3, 'cloud-security': 2, 'vuln-management': 2 },
        sets: { background: 'it_support' },
      },
      {
        id: 'software',
        label: 'Software development or QA',
        weights: { appsec: 4, 'detection-engineering': 2, 'cloud-security': 2, pentest: 2 },
        sets: { background: 'software' },
      },
      {
        id: 'military',
        label: 'Military, law enforcement, or intelligence',
        weights: { 'threat-intel': 3, 'incident-response': 2, soc: 2, 'risk-governance': 1, 'ot-ics': 1 },
        sets: { background: 'military' },
      },
      {
        id: 'compliance_legal',
        label: 'Legal, audit, or compliance',
        weights: { 'compliance-audit': 4, 'risk-governance': 4, privacy: 4 },
        sets: { background: 'compliance_legal' },
      },
      {
        id: 'finance',
        label: 'Finance or accounting',
        weights: { 'compliance-audit': 3, 'risk-governance': 3, 'detection-engineering': 1 },
        sets: { background: 'finance' },
      },
      {
        id: 'healthcare',
        label: 'Healthcare',
        weights: { privacy: 3, 'risk-governance': 2, 'compliance-audit': 2 },
        sets: { background: 'healthcare' },
      },
      {
        id: 'education',
        label: 'Teaching, training, or communications',
        weights: { awareness: 4, 'risk-governance': 1, 'threat-intel': 1 },
        sets: { background: 'education' },
      },
      {
        id: 'trades_other',
        label: 'Engineering, trades, manufacturing, or utilities',
        weights: { 'ot-ics': 4, 'security-engineering': 1 },
        sets: { background: 'trades_other' },
      },
      {
        id: 'none',
        label: 'Something else, or just starting out',
        weights: { soc: 1, 'vuln-management': 1, identity: 1 },
        sets: { background: 'none' },
      },
    ],
  },

  // --- where they want to work ---------------------------------------------
  {
    id: 'q-sector',
    prompt: 'Where would you rather work?',
    rationale:
      'This changes which certifications are mandatory, how hiring works, and how long it takes to start.',
    options: [
      {
        id: 'private',
        label: 'Private industry',
        detail: 'Usually better paid, faster hiring, and more variation between employers.',
        sets: { sector: 'private' },
      },
      {
        id: 'government',
        label: 'Government or public sector',
        detail: 'More process and slower hiring, but strong stability, training budgets, and pensions.',
        sets: { sector: 'government' },
        weights: { 'risk-governance': 2, 'compliance-audit': 2, 'ot-ics': 1 },
      },
      { id: 'either', label: 'I genuinely do not mind', sets: { sector: 'either' } },
    ],
  },
  {
    id: 'q-gov-level',
    prompt: 'Which level of government?',
    rationale:
      'Federal and local government are very different employers, with different requirements and timelines.',
    showWhen: { sector: 'government' },
    options: [
      {
        id: 'federal',
        label: 'Federal',
        detail: 'Mandated certifications, security clearances, and a hiring process measured in months. Excellent stability and training once in.',
        sets: { govLevel: 'federal' },
        weights: { 'risk-governance': 2, 'threat-intel': 1 },
      },
      {
        id: 'state_local',
        label: 'State, county, or city',
        detail: 'Small teams, broad responsibilities, faster hiring, and lower pay. One of the easiest places to get a first security job.',
        sets: { govLevel: 'state_local' },
        weights: { soc: 1, 'ot-ics': 2, 'vuln-management': 1 },
      },
      { id: 'either', label: 'Either', sets: { govLevel: 'either' } },
    ],
  },
  {
    id: 'q-clearance',
    prompt: 'Are you eligible for a security clearance?',
    rationale:
      'A large share of federal and defence work requires one. Eligibility generally means citizenship plus a background investigation you could pass.',
    showWhen: { sector: 'government' },
    options: [
      { id: 'holds', label: 'I already hold one', sets: { clearance: 'holds' }, weights: { 'threat-intel': 3, 'incident-response': 2, soc: 2 } },
      { id: 'eligible', label: 'I believe I would be eligible', sets: { clearance: 'eligible' } },
      { id: 'unsure', label: 'I am not sure', sets: { clearance: 'unsure' } },
      {
        id: 'not_eligible',
        label: 'No, or I would rather not go through that',
        detail:
          'Plenty of public sector work — state, local, and civilian federal — needs no clearance at all. This narrows the options rather than closing them.',
        sets: { clearance: 'not_eligible' },
      },
    ],
  },
  {
    id: 'q-org-size',
    prompt: 'Large organisation or small one?',
    rationale: 'This decides whether you specialise narrowly or do a bit of everything.',
    options: [
      {
        id: 'large',
        label: 'Large — I want a defined role and a clear path up',
        detail: 'Specialised teams, structured progression, more process.',
        sets: { orgSize: 'large' },
        weights: { identity: 2, 'detection-engineering': 2, 'risk-governance': 1, appsec: 1, awareness: 1 },
      },
      {
        id: 'small',
        label: 'Small — I want to do a bit of everything',
        detail: 'Broad responsibility, faster learning, less structure and support.',
        sets: { orgSize: 'small' },
        weights: { soc: 1, 'security-engineering': 2, 'cloud-security': 1, 'vuln-management': 1 },
      },
      { id: 'either', label: 'No strong preference', sets: { orgSize: 'either' } },
    ],
  },
];

// --- scoring -----------------------------------------------------------------

const QUESTION_BY_ID = new Map(ASSESSMENT_QUESTIONS.map((question) => [question.id, question]));

/** Whether a question should be asked, given the profile built so far. */
export function shouldAsk(question: AssessmentQuestion, profile: LearnerProfile): boolean {
  if (!question.showWhen) return true;
  return Object.entries(question.showWhen).every(
    ([key, value]) => profile[key as keyof LearnerProfile] === value,
  );
}

/** The questions still worth asking, in order, given answers so far. */
export function remainingQuestions(profile: LearnerProfile, answered: Set<string>): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter(
    (question) => !answered.has(question.id) && shouldAsk(question, profile),
  );
}

/** Build the profile implied by a set of answers. */
export function profileFromAnswers(answers: AssessmentAnswer[]): LearnerProfile {
  const profile: LearnerProfile = {};
  for (const answer of answers) {
    const question = QUESTION_BY_ID.get(answer.questionId);
    if (!question) continue;
    for (const optionId of answer.optionIds) {
      const option = question.options.find((candidate) => candidate.id === optionId);
      if (option?.sets) Object.assign(profile, option.sets);
    }
  }
  return profile;
}

/**
 * Score every track against the answers.
 *
 * Deliberately simple additive weighting. A more elaborate model would imply a
 * precision this cannot have: it is a conversation starter, not a diagnosis, and
 * the student overrides it freely at the next step.
 */
export function scoreTracks(answers: AssessmentAnswer[]): TrackScore[] {
  const totals: TrackWeights = {};
  for (const track of TRACKS) totals[track.id] = 0;

  for (const answer of answers) {
    const question = QUESTION_BY_ID.get(answer.questionId);
    if (!question) continue;

    for (const optionId of answer.optionIds) {
      const option = question.options.find((candidate) => candidate.id === optionId);
      if (!option?.weights) continue;

      for (const [trackId, weight] of Object.entries(option.weights)) {
        // Ignore weights aimed at track ids that no longer exist, so removing a
        // track cannot corrupt scoring.
        if (!(trackId in totals)) continue;
        totals[trackId] = (totals[trackId] ?? 0) + weight;
      }
    }
  }

  const highest = Math.max(1, ...Object.values(totals));

  return Object.entries(totals)
    .map(([trackId, score]) => ({
      trackId,
      score,
      match: Math.max(0, Math.round((score / highest) * 100)),
    }))
    .sort((a, b) => b.score - a.score || a.trackId.localeCompare(b.trackId));
}

/**
 * Explain the recommendation in plain language.
 *
 * Reasons are generated from the answers that actually moved the winning track,
 * so the explanation is honest rather than decorative.
 */
function buildRationale(answers: AssessmentAnswer[], topTrackId: string, profile: LearnerProfile): string[] {
  const reasons: string[] = [];

  for (const answer of answers) {
    const question = QUESTION_BY_ID.get(answer.questionId);
    if (!question) continue;

    for (const optionId of answer.optionIds) {
      const option = question.options.find((candidate) => candidate.id === optionId);
      const weight = option?.weights?.[topTrackId];
      if (option && typeof weight === 'number' && weight >= 3) {
        reasons.push(`You said: "${option.label}"`);
      }
    }
  }

  if (profile.sector === 'government' && profile.govLevel === 'federal') {
    reasons.push(
      'You are considering federal work, where certification requirements are mandatory rather than advisory — worth planning around early.',
    );
  }
  if (profile.sector === 'government' && profile.govLevel === 'state_local') {
    reasons.push(
      'State and local government is one of the most accessible places to land a first security role.',
    );
  }
  if (profile.orgSize === 'small') {
    reasons.push('Smaller organisations will expect breadth, which suits someone bringing experience from another career.');
  }

  return reasons;
}

export function recommend(answers: AssessmentAnswer[]): Recommendation {
  const scores = scoreTracks(answers);
  const profile = profileFromAnswers(answers);

  const top = scores[0]?.trackId ?? 'soc';
  // Only offer alternatives that scored meaningfully, rather than padding to three.
  const alternatives = scores
    .slice(1)
    .filter((entry) => entry.score > 0 && entry.match >= 50)
    .slice(0, 3)
    .map((entry) => entry.trackId);

  return {
    topTrackId: top,
    alternativeTrackIds: alternatives,
    scores,
    rationale: buildRationale(answers, top, profile),
    profile: { ...profile, assessedAt: undefined },
  };
}

/** Sector guidance key for the certification advice shown with a result. */
export function sectorGuidanceKey(
  profile: LearnerProfile,
): 'federal' | 'state_local' | 'private_large' | 'private_small' | null {
  if (profile.sector === 'government') {
    if (profile.govLevel === 'federal') return 'federal';
    if (profile.govLevel === 'state_local') return 'state_local';
    return null;
  }
  if (profile.sector === 'private') {
    if (profile.orgSize === 'large') return 'private_large';
    if (profile.orgSize === 'small') return 'private_small';
  }
  return null;
}
