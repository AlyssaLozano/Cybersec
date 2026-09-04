/**
 * The item bank: 90 questions across six dimensions.
 *
 * A NOTE ON COUNT
 *
 * The source specification asks for 60-80 items, but its per-dimension ranges
 * (5-7, 7-9, 6-8, 5-7, 8-10, 4-6) only sum to 35-47. The larger total wins,
 * because the redundancy the spec also asks for is what the extra items buy:
 * each trait needs three or more indicators before disagreement between them
 * means anything.
 *
 * WRITING RULES
 *
 * Concrete beats abstract. "I would rather analyse logs for patterns" measures
 * something; "I value detail" measures whether somebody likes the word detail.
 * Every statement below describes an actual situation.
 *
 * Plain language. No jargon a career changer would not know. "You are comfortable
 * being interrupted constantly", never "context-switching resilience".
 *
 * Reverse-coded items are scattered deliberately, so a person answering on
 * autopilot produces visible inconsistency rather than a clean, false profile.
 */

import type { AssessmentItem } from '@soc/shared';

export const ITEMS: AssessmentItem[] = [
  // =========================================================================
  // 1. WORK PACE AND PRESSURE (12 items)
  // =========================================================================
  {
    id: 'p1',
    kind: 'likert',
    dimension: 'pace_pressure',
    statement: 'When something urgent breaks, I get calmer and more focused rather than more stressed.',
    trait: 'pressure_tolerance',
    lanes: { 'incident-response': 3, 'soc-ops': 2, 'red-team': 1 },
    factors: { pace: 1 },
  },
  {
    id: 'p2',
    kind: 'likert',
    dimension: 'pace_pressure',
    statement: 'I would rather work on one thing for a whole week than five things in a day.',
    trait: 'interrupt_tolerance',
    reverse: true,
    lanes: { forensics: 3, 'threat-intel': 2, 'security-architecture': 2, appsec: 1, 'detection-engineering': 1, 'soc-ops': -2 },
  },
  {
    id: 'p3',
    kind: 'likert',
    dimension: 'pace_pressure',
    statement: 'Being interrupted every ten minutes would not stop me getting my work done.',
    trait: 'interrupt_tolerance',
    lanes: { 'soc-ops': 3, iam: 2, 'vuln-management': 1 },
  },
  {
    id: 'p4',
    kind: 'likert',
    dimension: 'pace_pressure',
    statement: 'A deadline I might miss makes me perform better, not worse.',
    trait: 'pressure_tolerance',
    lanes: { 'incident-response': 2, pentest: 2, 'soc-ops': 1 },
    factors: { pace: 1 },
  },
  {
    id: 'p5',
    kind: 'likert',
    dimension: 'pace_pressure',
    statement: 'I do my best work when I can plan it out weeks ahead.',
    trait: 'structure_need',
    lanes: { 'risk-compliance': 3, 'security-architecture': 2, 'security-engineering': 1, 'incident-response': -2 },
    factors: { rules: 1, pace: -1 },
  },
  {
    id: 'p6',
    kind: 'likert',
    dimension: 'pace_pressure',
    statement: 'Having several people waiting on my answer at once would make it hard for me to think clearly.',
    trait: 'pressure_tolerance',
    reverse: true,
    lanes: { 'incident-response': -3, 'soc-ops': -1, forensics: 1, 'risk-compliance': 1 },
  },
  {
    id: 'p7',
    kind: 'likert',
    dimension: 'pace_pressure',
    statement: 'I would find it satisfying to close forty small tasks in a day.',
    trait: 'depth_preference',
    reverse: true,
    lanes: { 'soc-ops': 3, 'vuln-management': 2, iam: 2, forensics: -2, 'detection-engineering': -1, 'security-architecture': -1 },
  },
  {
    id: 'p8',
    kind: 'likert',
    dimension: 'pace_pressure',
    statement: 'I would rather spend three weeks on one difficult problem than three days each on five easy ones.',
    trait: 'depth_preference',
    lanes: { forensics: 3, 'red-team': 3, appsec: 2, 'threat-intel': 2, 'soc-ops': -2 },
  },
  {
    id: 'p9',
    kind: 'likert',
    dimension: 'pace_pressure',
    statement: 'Steady, predictable work suits me better than an unpredictable mix.',
    trait: 'stability_need',
    lanes: { 'risk-compliance': 2, iam: 2, 'network-security': 1, 'incident-response': -2, pentest: -1 },
    factors: { stability: 2, pace: -1 },
  },
  {
    id: 'p10',
    kind: 'likert',
    dimension: 'pace_pressure',
    statement: 'I would be comfortable making a decision with only half the information, if waiting was worse.',
    trait: 'pressure_tolerance',
    lanes: { 'incident-response': 3, 'soc-ops': 2, 'security-architecture': 1, forensics: -2 },
  },
  {
    id: 'p11',
    kind: 'choice',
    dimension: 'pace_pressure',
    prompt: 'It is 4:30pm on a Friday and an alert comes in that might be serious. What is your honest first reaction?',
    options: [
      {
        id: 'dig-in',
        label: 'Good: let me get into it',
        lanes: { 'incident-response': 3, 'soc-ops': 2 },
        traitValue: { trait: 'pressure_tolerance', value: 2 },
      },
      {
        id: 'methodical',
        label: 'Work through it properly, even if that means staying late',
        lanes: { forensics: 2, 'soc-ops': 1, 'network-security': 1 },
        traitValue: { trait: 'pressure_tolerance', value: 1 },
      },
      {
        id: 'handover',
        label: 'Assess it quickly and hand it over if it needs more than I can finish',
        lanes: { 'risk-compliance': 1, iam: 1, 'vuln-management': 1 },
        traitValue: { trait: 'pressure_tolerance', value: 0 },
      },
      {
        id: 'dread',
        label: 'My heart sinks: I would find that genuinely stressful',
        lanes: { 'incident-response': -3, 'soc-ops': -2, 'risk-compliance': 2, 'security-architecture': 1 },
        traitValue: { trait: 'pressure_tolerance', value: -2 },
      },
    ],
  },
  {
    id: 'p12',
    kind: 'choice',
    dimension: 'pace_pressure',
    prompt:
      'Without warning, your manager tells you to drop everything for something that just became the top priority. What is your honest first reaction?',
    options: [
      {
        id: 'snap-to',
        label: 'Good: I like it when priorities suddenly become obvious',
        lanes: { 'incident-response': 3, 'soc-ops': 2, pentest: 1 },
        traitValue: { trait: 'pressure_tolerance', value: 2 },
      },
      {
        id: 'annoyed',
        label: 'Irritated: I had real momentum on what I was already doing',
        lanes: { forensics: 2, 'security-architecture': 2, appsec: 1, 'incident-response': -2 },
        traitValue: { trait: 'interrupt_tolerance', value: -2 },
      },
      {
        id: 'ask-why',
        label: 'I would want to understand why before I actually switch',
        lanes: { 'risk-compliance': 2, 'security-architecture': 1, iam: 1 },
        traitValue: { trait: 'structure_need', value: 1 },
      },
      {
        id: 'relief',
        label: 'Relieved, honestly: it forces me to stop overthinking and just act',
        lanes: { 'soc-ops': 2, pentest: 2, 'red-team': 1 },
        traitValue: { trait: 'pressure_tolerance', value: 1 },
      },
    ],
  },

  // =========================================================================
  // 2. PROBLEM-SOLVING STYLE (22 items)
  // =========================================================================
  {
    id: 's1',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'I am good at spotting when something in a long list looks different from the rest.',
    trait: 'detail_orientation',
    lanes: { 'soc-ops': 3, forensics: 2, 'threat-intel': 2, 'network-security': 2, 'detection-engineering': 2 },
  },
  // --- how they think: cognitive-style items --------------------------------
  // Each probes a distinct thinking style and routes it to the roles that
  // reward it, so the report reflects how somebody reasons, not just what they
  // like. Reuse existing traits; the lane weights carry the signal.
  {
    id: 's16',
    kind: 'likert',
    dimension: 'problem_solving',
    statement:
      'When something feels off, I would rather go dig for proof myself than wait to see whether an alarm goes off.',
    trait: 'research_orientation',
    lanes: { 'detection-engineering': 2, 'threat-intel': 2, 'soc-ops': 2, 'incident-response': 1 },
  },
  {
    id: 's17',
    kind: 'likert',
    dimension: 'problem_solving',
    statement:
      'I can commit to a decision with only part of the picture, and change course as more becomes clear.',
    trait: 'pressure_tolerance',
    lanes: { 'incident-response': 3, 'red-team': 1, 'risk-compliance': 1, forensics: -1 },
  },
  {
    id: 's18',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'I would rather be slow and certain than fast and mostly right.',
    trait: 'depth_preference',
    lanes: { forensics: 3, 'detection-engineering': 2, appsec: 2, 'soc-ops': -1, 'incident-response': -1 },
  },
  {
    id: 's19',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'I naturally notice how a system could be tricked, misused, or broken.',
    trait: 'adversarial_pull',
    lanes: { 'red-team': 3, pentest: 3, appsec: 2, 'ai-security': 2 },
  },
  {
    id: 's20',
    kind: 'likert',
    dimension: 'problem_solving',
    statement:
      'I am comfortable saying we do not have enough to know who did this, rather than naming someone to sound certain.',
    trait: 'research_orientation',
    lanes: { 'threat-intel': 3, forensics: 2 },
  },
  {
    id: 's21',
    kind: 'likert',
    dimension: 'problem_solving',
    statement:
      'I enjoy understanding how all the pieces of a system connect more than mastering any single piece.',
    trait: 'building_drive',
    lanes: { 'security-architecture': 3, 'security-engineering': 2, 'cloud-security': 2, 'network-security': 1 },
  },
  {
    id: 's2',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'When something breaks I work through possible causes in order rather than guessing.',
    trait: 'detail_orientation',
    lanes: { forensics: 3, 'network-security': 3, 'security-engineering': 2, iam: 1 },
  },
  {
    id: 's3',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'I often get the right answer before I can explain how I got there.',
    trait: 'research_orientation',
    reverse: true,
    lanes: { pentest: 2, 'red-team': 2, forensics: -2, 'risk-compliance': -1 },
  },
  {
    id: 's4',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'I enjoy reading for hours to understand something properly before acting.',
    trait: 'research_orientation',
    lanes: { 'threat-intel': 3, 'security-architecture': 2, appsec: 2, 'risk-compliance': 2, 'detection-engineering': 1, 'soc-ops': -1, 'ai-security': 2 },
  },
  {
    id: 's5',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'Given an unfamiliar system, my instinct is to work out how to break it.',
    trait: 'adversarial_pull',
    lanes: { pentest: 4, 'red-team': 4, appsec: 2, 'ai-security': 3 },
  },
  {
    id: 's6',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'Given an unfamiliar system, my instinct is to work out how I would know if someone else broke it.',
    trait: 'adversarial_pull',
    reverse: true,
    lanes: { 'soc-ops': 3, 'detection-engineering': 3, 'incident-response': 2, 'threat-intel': 2, 'network-security': 1 },
  },
  {
    id: 's7',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'I would rather build a tool that solves a problem permanently than solve it by hand each time.',
    trait: 'building_drive',
    lanes: { 'security-engineering': 4, 'detection-engineering': 3, 'cloud-security': 3, appsec: 2, 'soc-ops': -1, 'ai-security': 1 },
  },
  {
    id: 's8',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'I am comfortable writing code or scripts, or I would be happy to learn.',
    trait: 'building_drive',
    lanes: { 'security-engineering': 3, 'cloud-security': 3, appsec: 3, 'detection-engineering': 2, 'red-team': 2, 'risk-compliance': -1, 'ai-security': 3 },
  },
  {
    id: 's9',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'I would rather understand one system deeply than five systems roughly.',
    trait: 'depth_preference',
    lanes: { appsec: 2, forensics: 2, iam: 2, 'security-architecture': -1, 'ai-security': 2 },
  },
  {
    id: 's10',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'I find it satisfying to piece together a story from scattered fragments of evidence.',
    trait: 'research_orientation',
    lanes: { forensics: 4, 'incident-response': 3, 'threat-intel': 3 },
  },
  {
    id: 's11',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'Ambiguous problems with no clear right answer frustrate me.',
    trait: 'structure_need',
    lanes: { 'security-architecture': -3, 'threat-intel': -2, 'risk-compliance': -1, iam: 2, 'network-security': 1 },
    factors: { rules: 1 },
  },
  {
    id: 's12',
    kind: 'likert',
    dimension: 'problem_solving',
    statement: 'I am usually the person who notices the typo or the inconsistency nobody else saw.',
    trait: 'detail_orientation',
    lanes: { forensics: 3, 'risk-compliance': 2, iam: 2, appsec: 2 },
  },
  {
    id: 's14',
    kind: 'likert',
    dimension: 'problem_solving',
    statement:
      'I would rather spend a day making a tool that half-works work properly than a day working around it.',
    trait: 'building_drive',
    lanes: { 'detection-engineering': 4, 'security-engineering': 3, 'cloud-security': 1, 'soc-ops': -1 },
  },
  {
    id: 's15',
    kind: 'likert',
    dimension: 'problem_solving',
    statement:
      'I am good at noticing when three unremarkable things happening together are the thing worth looking at.',
    trait: 'research_orientation',
    lanes: { 'detection-engineering': 3, 'threat-intel': 2, 'incident-response': 2, forensics: 1 },
  },
  {
    id: 's13',
    kind: 'choice',
    dimension: 'problem_solving',
    prompt: 'You are handed a system nobody has documented. Where do you start?',
    options: [
      {
        id: 'map-it',
        label: 'Map out how it is put together and how the pieces connect',
        lanes: { 'security-architecture': 3, 'network-security': 2, 'security-engineering': 2 },
        traitValue: { trait: 'building_drive', value: 1 },
      },
      {
        id: 'attack-it',
        label: 'Look for the weakest point and see if it gives way',
        lanes: { pentest: 3, 'red-team': 3 },
        traitValue: { trait: 'adversarial_pull', value: 2 },
      },
      {
        id: 'watch-it',
        label: 'Work out what it logs, so I would know if something went wrong',
        lanes: { 'soc-ops': 3, 'detection-engineering': 3, 'incident-response': 2 },
        traitValue: { trait: 'adversarial_pull', value: -1 },
      },
      {
        id: 'own-it',
        label: 'Find out who is accountable for it and whether that is written down anywhere',
        lanes: { 'risk-compliance': 4, iam: 2 },
        traitValue: { trait: 'structure_need', value: 2 },
      },
    ],
  },
  {
    id: 's22',
    kind: 'choice',
    dimension: 'problem_solving',
    prompt: 'A bug report comes in that just says "it is broken", with nothing else. What is your actual first move?',
    options: [
      {
        id: 'reproduce',
        label: 'Try to reproduce it myself, step by step, until I see what they saw',
        lanes: { appsec: 3, 'security-engineering': 2, 'network-security': 1 },
        traitValue: { trait: 'detail_orientation', value: 2 },
      },
      {
        id: 'ask-affected',
        label: 'Go find whoever is affected and ask exactly what they were doing',
        lanes: { 'risk-compliance': 2, iam: 2, 'soc-ops': 1 },
        traitValue: { trait: 'people_orientation', value: 1 },
      },
      {
        id: 'recent-changes',
        label: 'Check what changed most recently and work backward from there',
        lanes: { forensics: 3, 'detection-engineering': 2, 'incident-response': 2 },
        traitValue: { trait: 'research_orientation', value: 1 },
      },
      {
        id: 'existing-tools',
        label: 'Look for a dashboard or log that should already show me the answer',
        lanes: { 'security-engineering': 2, 'cloud-security': 2, 'detection-engineering': 1 },
        traitValue: { trait: 'building_drive', value: 1 },
      },
    ],
  },

  // =========================================================================
  // 3. WORKING WITH PEOPLE (12 items)
  // =========================================================================
  {
    id: 'i1',
    kind: 'likert',
    dimension: 'interpersonal',
    statement: 'I would enjoy explaining a technical problem to someone who is not technical.',
    trait: 'people_orientation',
    lanes: { 'risk-compliance': 3, 'security-architecture': 2, pentest: 2, 'threat-intel': 2 },
  },
  {
    id: 'i2',
    kind: 'likert',
    dimension: 'interpersonal',
    statement: 'I would rather work alone for most of the day.',
    trait: 'people_orientation',
    reverse: true,
    lanes: { forensics: 3, 'red-team': 2, 'threat-intel': 1, 'risk-compliance': -3, 'security-architecture': -2 },
  },
  {
    id: 'i3',
    kind: 'likert',
    dimension: 'interpersonal',
    statement: 'I am comfortable telling a senior person something they do not want to hear.',
    trait: 'people_orientation',
    lanes: { 'risk-compliance': 3, pentest: 2, iam: 2, 'security-architecture': 2 },
  },
  {
    id: 'i4',
    kind: 'likert',
    dimension: 'interpersonal',
    statement: 'Chasing other teams to do something they keep postponing would wear me down.',
    trait: 'people_orientation',
    reverse: true,
    lanes: { 'vuln-management': -3, 'risk-compliance': -2, iam: -2, forensics: 2, 'red-team': 1 },
  },
  {
    id: 'i5',
    kind: 'likert',
    dimension: 'interpersonal',
    statement: 'I would like part of my job to be teaching or mentoring other people.',
    trait: 'people_orientation',
    lanes: { 'security-architecture': 2, 'risk-compliance': 2, 'soc-ops': 1 },
  },
  {
    id: 'i6',
    kind: 'likert',
    dimension: 'interpersonal',
    statement: 'Presenting findings to a room of people would make me anxious.',
    trait: 'people_orientation',
    reverse: true,
    lanes: { 'risk-compliance': -3, pentest: -2, 'security-architecture': -2, forensics: 1, 'network-security': 1 },
  },
  {
    id: 'i7',
    kind: 'likert',
    dimension: 'interpersonal',
    statement: 'I write clearly, and I do not mind that a job might be half writing.',
    trait: 'research_orientation',
    lanes: { 'threat-intel': 3, 'risk-compliance': 3, forensics: 2, pentest: 2 },
  },
  {
    id: 'i8',
    kind: 'likert',
    dimension: 'interpersonal',
    statement: 'I would be comfortable being the person who says no to a request from someone important.',
    trait: 'people_orientation',
    lanes: { iam: 3, 'risk-compliance': 2, 'network-security': 2 },
  },
  {
    id: 'i9',
    kind: 'likert',
    dimension: 'interpersonal',
    statement: 'I would find it demoralising if my work was invisible when it went well.',
    trait: 'people_orientation',
    reverse: true,
    lanes: { 'security-engineering': -2, 'detection-engineering': -2, iam: -2, 'network-security': -1, pentest: 1 },
  },
  {
    id: 'i10',
    kind: 'likert',
    dimension: 'interpersonal',
    statement: 'I would eventually like to lead a team rather than stay purely hands-on.',
    trait: 'people_orientation',
    lanes: { 'risk-compliance': 2, 'security-architecture': 2, 'soc-ops': 1, 'red-team': -1 },
  },
  {
    id: 'i11',
    kind: 'choice',
    dimension: 'interpersonal',
    prompt: 'Which of these would you find most draining?',
    options: [
      {
        id: 'meetings',
        label: 'A day of back-to-back meetings with stakeholders',
        lanes: { 'risk-compliance': -3, 'security-architecture': -2, forensics: 2, 'red-team': 2 },
        traitValue: { trait: 'people_orientation', value: -2 },
      },
      {
        id: 'alone',
        label: 'A day alone with a spreadsheet and no conversation',
        lanes: { 'risk-compliance': 2, 'soc-ops': 1, forensics: -2, 'vuln-management': -1 },
        traitValue: { trait: 'people_orientation', value: 2 },
      },
      {
        id: 'repetition',
        label: 'A day doing the same repetitive task over and over',
        lanes: { 'soc-ops': -3, 'vuln-management': -2, 'security-architecture': 1, 'red-team': 1 },
        traitValue: { trait: 'depth_preference', value: 1 },
      },
      {
        id: 'ambiguity',
        label: 'A day where nobody can tell me what the right answer is',
        lanes: { 'security-architecture': -3, 'threat-intel': -2, iam: 2, 'network-security': 1 },
        traitValue: { trait: 'structure_need', value: 2 },
      },
    ],
  },
  {
    id: 'i12',
    kind: 'choice',
    dimension: 'interpersonal',
    prompt: 'You just finished a piece of work you are genuinely proud of. Which part would you enjoy most?',
    options: [
      {
        id: 'present',
        label: 'Presenting it to the team and fielding their questions',
        lanes: { 'risk-compliance': 3, 'security-architecture': 2, pentest: 1 },
        traitValue: { trait: 'people_orientation', value: 2 },
      },
      {
        id: 'write-up',
        label: 'Writing it up clearly enough that nobody ever has to ask me about it',
        lanes: { 'threat-intel': 2, forensics: 2, 'risk-compliance': 1 },
        traitValue: { trait: 'people_orientation', value: -1 },
      },
      {
        id: 'quiet-move-on',
        label: 'Quietly moving on to the next thing, no fanfare needed',
        lanes: { 'security-engineering': 2, 'detection-engineering': 2, iam: 1 },
        traitValue: { trait: 'people_orientation', value: -2 },
      },
      {
        id: 'teach-it',
        label: 'Teaching someone else how it works so they could do it too',
        lanes: { 'security-architecture': 2, 'risk-compliance': 1, 'soc-ops': 1 },
        traitValue: { trait: 'people_orientation', value: 1 },
      },
    ],
  },

  // =========================================================================
  // 4. DETAIL AND BIG PICTURE (12 items)
  // =========================================================================
  {
    id: 'd1',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement: 'I would rather get one thing exactly right than five things approximately right.',
    trait: 'detail_orientation',
    lanes: { forensics: 3, iam: 2, appsec: 2, 'risk-compliance': 1, 'soc-ops': -1 },
  },
  {
    id: 'd2',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement: 'I naturally think about how today\'s decision will look in three years.',
    trait: 'structure_need',
    reverse: true,
    lanes: { 'security-architecture': 4, 'risk-compliance': 2, 'security-engineering': 2, 'soc-ops': -1 },
  },
  {
    id: 'd3',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement: 'Following a documented procedure exactly, every time, appeals to me.',
    trait: 'structure_need',
    lanes: { forensics: 3, 'risk-compliance': 2, iam: 2, 'red-team': -2, 'security-architecture': -1 },
    factors: { rules: 2 },
  },
  {
    id: 'd4',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement: 'Rules that exist for a good reason should still be followed when they are inconvenient.',
    trait: 'structure_need',
    lanes: { 'risk-compliance': 3, forensics: 2, iam: 2 },
    factors: { rules: 2, autonomy: -1 },
  },
  {
    id: 'd5',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement: 'I get impatient with process when I can see a faster way.',
    trait: 'structure_need',
    reverse: true,
    lanes: { 'red-team': 2, pentest: 2, 'cloud-security': 1, 'risk-compliance': -3, forensics: -2 },
    factors: { rules: -2, autonomy: 2 },
  },
  {
    id: 'd6',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement: 'Careful documentation feels like part of the work rather than an interruption to it.',
    trait: 'detail_orientation',
    lanes: { forensics: 3, 'risk-compliance': 3, iam: 1, 'red-team': -1 },
    factors: { rules: 1 },
  },
  {
    id: 'd7',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement: 'I would be comfortable working on something whose value nobody can measure for years.',
    trait: 'structure_need',
    reverse: true,
    lanes: { 'security-architecture': 3, 'risk-compliance': 1, 'soc-ops': -2 },
  },
  {
    id: 'd8',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement: 'Small inconsistencies bother me until I resolve them.',
    trait: 'detail_orientation',
    lanes: { forensics: 3, appsec: 2, iam: 2, 'network-security': 2 },
  },
  {
    id: 'd9',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement: 'I would rather influence how a hundred systems are built than fix one of them myself.',
    trait: 'building_drive',
    lanes: { 'security-architecture': 4, 'risk-compliance': 2, 'security-engineering': 1, forensics: -2 },
  },
  {
    id: 'd10',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement: 'I am comfortable being held to a standard where a small procedural mistake invalidates good work.',
    trait: 'detail_orientation',
    lanes: { forensics: 4, 'risk-compliance': 2 },
    factors: { rules: 1 },
  },
  {
    id: 'd11',
    kind: 'likert',
    dimension: 'detail_bigpicture',
    statement:
      'If something I built was creating extra work for a colleague, I would want to know exactly how often it happened.',
    trait: 'detail_orientation',
    lanes: { 'detection-engineering': 3, 'security-engineering': 2, 'vuln-management': 1, 'risk-compliance': 1 },
  },
  {
    id: 'd12',
    kind: 'choice',
    dimension: 'detail_bigpicture',
    prompt:
      'You inherit a control that mostly works but has had the same rough edges for two years. What is your honest instinct?',
    options: [
      {
        id: 'fix-now',
        label: 'Fix it properly right now, even though nobody asked',
        lanes: { forensics: 2, appsec: 2, iam: 1 },
        traitValue: { trait: 'detail_orientation', value: 2 },
      },
      {
        id: 'log-it',
        label: 'Write down exactly what is wrong and get it tracked, even if I do not fix it today',
        lanes: { 'risk-compliance': 3, 'vuln-management': 2 },
        traitValue: { trait: 'detail_orientation', value: 1 },
      },
      {
        id: 'rethink',
        label:
          'Wonder why it still has rough edges after two years, and whether the whole approach needs rethinking',
        lanes: { 'security-architecture': 4, 'security-engineering': 2 },
        traitValue: { trait: 'building_drive', value: 2 },
      },
      {
        id: 'leave-it',
        label: 'Leave it. There are bigger problems elsewhere that deserve the time',
        lanes: { 'soc-ops': 1, 'vuln-management': 1, 'security-architecture': -1 },
        traitValue: { trait: 'detail_orientation', value: -2 },
      },
    ],
  },

  // =========================================================================
  // 5. INTERESTS AND ENERGY (21 items)
  // =========================================================================
  {
    id: 'e1',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'The idea of legally breaking into a company\'s systems genuinely excites me.',
    trait: 'adversarial_pull',
    lanes: { pentest: 4, 'red-team': 4, appsec: 1, 'ai-security': 2 },
  },
  {
    id: 'e2',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'I would find it more satisfying to stop an attack than to carry one out.',
    trait: 'adversarial_pull',
    reverse: true,
    lanes: { 'soc-ops': 3, 'incident-response': 3, 'security-engineering': 2, 'network-security': 2, 'detection-engineering': 2, pentest: -2 },
  },
  {
    id: 'e3',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'I would rather design something that works well than investigate something that went wrong.',
    trait: 'building_drive',
    lanes: { 'security-engineering': 3, 'security-architecture': 3, 'detection-engineering': 3, 'cloud-security': 2, forensics: -3, 'incident-response': -2 },
  },
  {
    id: 'e4',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'Learning a completely new tool every few months sounds energising rather than exhausting.',
    trait: 'novelty_seeking',
    lanes: { 'cloud-security': 3, 'red-team': 2, pentest: 2, 'threat-intel': 1, iam: -1, 'ai-security': 3 },
    factors: { pace: 1, stability: -1 },
  },
  {
    id: 'e5',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'I would rather use proven methods than the newest approach.',
    trait: 'novelty_seeking',
    reverse: true,
    lanes: { 'risk-compliance': 2, forensics: 2, iam: 2, 'network-security': 1, 'cloud-security': -2, 'ai-security': -2 },
    factors: { stability: 1, rules: 1 },
  },
  {
    id: 'e6',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'I am interested in how networks actually move data around.',
    trait: 'detail_orientation',
    lanes: { 'network-security': 4, 'incident-response': 1, 'cloud-security': 1 },
  },
  {
    id: 'e7',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'I would enjoy reading code written by someone else to find their mistake.',
    trait: 'detail_orientation',
    lanes: { appsec: 4, 'red-team': 1, pentest: 1 },
  },
  {
    id: 'e8',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'Keeping track of who has access to what, and why, sounds genuinely interesting.',
    trait: 'structure_need',
    lanes: { iam: 4, 'risk-compliance': 2 },
  },
  {
    id: 'e9',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'I would enjoy following a group of attackers over months to understand how they operate.',
    trait: 'research_orientation',
    lanes: { 'threat-intel': 4, 'red-team': 2, 'incident-response': 1, 'ai-security': 1 },
  },
  {
    id: 'e10',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'Working out what an organisation should worry about, and writing the policy for it, appeals to me.',
    trait: 'research_orientation',
    lanes: { 'risk-compliance': 4, 'security-architecture': 2 },
  },
  {
    id: 'e11',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'I would like working with cloud platforms where things change constantly.',
    trait: 'novelty_seeking',
    lanes: { 'cloud-security': 4, 'security-engineering': 2 },
    factors: { pace: 1 },
  },
  {
    id: 'e12',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'The idea that my work might be examined in court appeals to me rather than worrying me.',
    trait: 'detail_orientation',
    lanes: { forensics: 4, 'incident-response': 1 },
    factors: { rules: 1 },
  },
  {
    id: 'e13',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'I would be happy spending most of my time on a long list of things that need fixing.',
    trait: 'interrupt_tolerance',
    lanes: { 'vuln-management': 4, iam: 1, 'soc-ops': 1 },
  },
  {
    id: 'e16',
    kind: 'likert',
    dimension: 'interests_energy',
    statement: 'Writing something that catches an attack automatically appeals to me more than catching one myself.',
    trait: 'building_drive',
    lanes: { 'detection-engineering': 4, 'security-engineering': 2, 'soc-ops': -2, 'incident-response': -1 },
  },
  {
    id: 'e17',
    kind: 'likert',
    dimension: 'interests_energy',
    statement:
      'Spending a week making something that already works generate fewer complaints sounds dull to me.',
    trait: 'novelty_seeking',
    lanes: { 'detection-engineering': -3, 'security-engineering': -2, 'vuln-management': -1, 'red-team': 1, pentest: 1 },
  },
  {
    id: 'e14',
    kind: 'choice',
    dimension: 'interests_energy',
    prompt: 'Which of these outcomes would make you proudest at the end of a year?',
    options: [
      {
        id: 'caught',
        label: 'I caught something serious that everyone else missed',
        lanes: { 'soc-ops': 3, 'incident-response': 3, 'threat-intel': 2, 'detection-engineering': 1 },
      },
      {
        id: 'built',
        label: 'I built something that quietly prevents a whole class of problem',
        lanes: { 'security-engineering': 3, 'detection-engineering': 3, 'cloud-security': 2, appsec: 2, 'security-architecture': 2 },
        traitValue: { trait: 'building_drive', value: 2 },
      },
      {
        id: 'proved',
        label: 'I proved a system could be broken, and it got fixed because of me',
        lanes: { pentest: 3, 'red-team': 3, 'vuln-management': 1 },
        traitValue: { trait: 'adversarial_pull', value: 2 },
      },
      {
        id: 'changed',
        label: 'I changed how the organisation makes decisions about risk',
        lanes: { 'risk-compliance': 4, 'security-architecture': 2 },
        traitValue: { trait: 'people_orientation', value: 1 },
      },
    ],
  },
  {
    id: 'e15',
    kind: 'choice',
    dimension: 'interests_energy',
    prompt: 'Be honest: which of these sounds most like a bad day you could not tolerate for long?',
    options: [
      {
        id: 'queue',
        label: 'Working through an endless queue of alerts, most of which are nothing',
        lanes: { 'soc-ops': -4, 'vuln-management': -1, 'detection-engineering': 1 },
      },
      {
        id: 'paperwork',
        label: 'Writing documentation and reports for most of the week',
        lanes: { 'risk-compliance': -4, forensics: -2, pentest: -2, 'threat-intel': -1 },
        traitValue: { trait: 'research_orientation', value: -2 },
      },
      {
        id: 'politics',
        label: 'Trying to persuade people who keep ignoring you',
        lanes: { 'risk-compliance': -3, 'vuln-management': -3, 'security-architecture': -2 },
        traitValue: { trait: 'people_orientation', value: -1 },
      },
      {
        id: 'oncall',
        label: 'Being woken at 3am because something broke',
        lanes: { 'incident-response': -4, 'soc-ops': -2 },
        traitValue: { trait: 'pressure_tolerance', value: -1 },
      },
    ],
  },

  /*
   * The three items below carry most of the AI Security signal, and they are
   * deliberately about tolerance rather than enthusiasm.
   *
   * Everybody finds AI interesting at the moment, so an item asking "does AI
   * interest you" would route half the population into a specialism that is not
   * an entry point and has almost no junior openings. What actually predicts
   * somebody surviving this work is comfort with mathematics they will have to
   * learn properly, comfort working where nobody has written the method down
   * yet, and willingness to spend a week proving a negative. Those are the three
   * things asked here.
   */
  {
    id: 'e18',
    kind: 'likert',
    dimension: 'interests_energy',
    statement:
      'Working out how something computes its answer (the actual arithmetic) is satisfying rather than tedious.',
    trait: 'depth_preference',
    lanes: { 'ai-security': 4, appsec: 1, 'detection-engineering': 1 },
  },
  {
    id: 'e19',
    kind: 'likert',
    dimension: 'interests_energy',
    statement:
      'I would be comfortable working in an area where there is no agreed method yet and I would have to invent my own.',
    trait: 'novelty_seeking',
    lanes: { 'ai-security': 4, 'red-team': 2, 'threat-intel': 1, 'risk-compliance': -2, iam: -2 },
    factors: { rules: -1, autonomy: 1 },
  },
  {
    id: 'e20',
    kind: 'likert',
    dimension: 'interests_energy',
    statement:
      'Spending a week testing something and concluding "I could not break it" would feel like a wasted week.',
    trait: 'research_orientation',
    reverse: true,
    lanes: { 'ai-security': 3, appsec: 2, 'threat-intel': 2, pentest: 1 },
  },
  {
    id: 'e21',
    kind: 'choice',
    dimension: 'interests_energy',
    prompt: 'If you could only keep one of these in your job, which would you choose?',
    options: [
      {
        id: 'trace-it',
        label: 'Tracing exactly where an attacker got in and what they touched',
        lanes: { 'incident-response': 3, forensics: 2, 'threat-intel': 1 },
        traitValue: { trait: 'research_orientation', value: 2 },
      },
      {
        id: 'find-flaw',
        label: 'Finding a flaw in something before anyone else does',
        lanes: { pentest: 3, 'red-team': 3, appsec: 1 },
        traitValue: { trait: 'adversarial_pull', value: 2 },
      },
      {
        id: 'build-guardrail',
        label: 'Designing a guardrail that quietly stops a whole category of mistake',
        lanes: { 'security-engineering': 3, 'detection-engineering': 2, 'cloud-security': 2 },
        traitValue: { trait: 'building_drive', value: 2 },
      },
      {
        id: 'size-the-risk',
        label: 'Working out how much risk the organisation is actually carrying, and what to do about it',
        lanes: { 'risk-compliance': 4, 'security-architecture': 1 },
        traitValue: { trait: 'structure_need', value: 1 },
      },
    ],
  },

  // =========================================================================
  // 6. LIFE AND WORK BALANCE (11 items)
  // =========================================================================
  {
    id: 'l1',
    kind: 'likert',
    dimension: 'life_balance',
    statement: 'I could work an on-call rota where I might be woken up.',
    trait: 'pressure_tolerance',
    lanes: { 'incident-response': 3, 'soc-ops': 2, 'security-engineering': 1 },
    factors: { stability: -1 },
  },
  {
    id: 'l2',
    kind: 'likert',
    dimension: 'life_balance',
    statement: 'I need predictable hours: nights and weekends are not something I can do.',
    trait: 'stability_need',
    lanes: { 'incident-response': -4, 'soc-ops': -3, 'detection-engineering': 2, 'risk-compliance': 2, iam: 2, 'security-architecture': 1 },
    factors: { stability: 2 },
  },
  {
    id: 'l3',
    kind: 'likert',
    dimension: 'life_balance',
    statement: 'Travelling to client sites regularly would appeal to me.',
    trait: 'novelty_seeking',
    lanes: { pentest: 2, 'red-team': 1, forensics: 1 },
    factors: { autonomy: 1, stability: -2, pace: 1 },
  },
  {
    id: 'l4',
    kind: 'likert',
    dimension: 'life_balance',
    statement: 'Job security matters more to me than the highest possible salary.',
    trait: 'stability_need',
    lanes: { 'risk-compliance': 1, iam: 1, 'network-security': 1 },
    factors: { stability: 2, rules: 1 },
  },
  {
    id: 'l5',
    kind: 'likert',
    dimension: 'life_balance',
    statement: 'I am happy to study in my own time to keep my skills current.',
    trait: 'novelty_seeking',
    lanes: { 'cloud-security': 2, pentest: 2, 'red-team': 2, appsec: 1 },
  },
  {
    id: 'l6',
    kind: 'likert',
    dimension: 'life_balance',
    statement: 'I would rather be a recognised specialist in one narrow area than a generalist.',
    trait: 'depth_preference',
    lanes: { forensics: 3, iam: 3, appsec: 2, 'red-team': 2, 'soc-ops': -1 },
  },
  {
    id: 'l7',
    kind: 'likert',
    dimension: 'life_balance',
    statement: 'I want a lot of freedom in how I do my work, even if that means less guidance.',
    trait: 'autonomy_need',
    lanes: { 'red-team': 2, pentest: 2, 'security-architecture': 2, 'threat-intel': 1 },
    factors: { autonomy: 2, rules: -1 },
  },
  {
    id: 'l9',
    kind: 'likert',
    dimension: 'life_balance',
    statement: 'I would rather be given a goal and left to work out how to reach it than be handed a process to follow.',
    trait: 'autonomy_need',
    lanes: { 'red-team': 2, pentest: 1, 'security-architecture': 2, 'threat-intel': 1, iam: -1 },
    factors: { autonomy: 2, rules: -1 },
  },
  {
    id: 'l10',
    kind: 'likert',
    dimension: 'life_balance',
    statement: 'I would find it reassuring to have a clear, documented procedure for most of what I do.',
    trait: 'autonomy_need',
    reverse: true,
    lanes: { 'risk-compliance': 2, iam: 2, forensics: 2, 'red-team': -2 },
    factors: { autonomy: -2, rules: 2, stability: 1 },
  },
  {
    id: 'l8',
    kind: 'choice',
    dimension: 'life_balance',
    prompt: 'Which working environment sounds most tolerable to you, warts and all?',
    detail: 'Every one of these has a real downside. Pick the downside you could live with.',
    options: [
      {
        id: 'gov',
        label: 'Slow and bureaucratic, but stable, well documented, and genuinely important',
        detail: 'Change takes months. Your job is very secure and the mission is real.',
        factors: { stability: 2, rules: 2, pace: -2, autonomy: -1 },
      },
      {
        id: 'corp',
        label: 'Faster and better paid, but driven by profit and subject to reorganisation',
        detail: 'Good tooling and clear progression. Priorities shift with the business.',
        factors: { stability: 0, rules: 0, pace: 1, autonomy: 0 },
      },
      {
        id: 'consult',
        label: 'Chaotic and varied, a new client every few weeks, with travel and billable hours',
        detail: 'You learn extremely fast. You are also always selling and always counting hours.',
        factors: { stability: -2, rules: -2, pace: 2, autonomy: 2 },
      },
    ],
  },
  {
    id: 'l11',
    kind: 'choice',
    dimension: 'life_balance',
    prompt: 'Picture an ordinary Tuesday, five years from now. Which is closest to what you actually want?',
    options: [
      {
        id: 'deep-quiet',
        label: 'Deep, focused work with almost no meetings, home on time, phone off after',
        lanes: { forensics: 2, appsec: 1, iam: 1 },
        traitValue: { trait: 'stability_need', value: 2 },
        factors: { stability: 2, pace: -1 },
      },
      {
        id: 'mixed-day',
        label: 'A mix of meetings and hands-on work, staying late sometimes when it actually matters',
        lanes: { 'security-architecture': 1, 'security-engineering': 1 },
      },
      {
        id: 'never-same',
        label: 'Different every day: a new client or system, real variety, real travel',
        lanes: { pentest: 2, 'red-team': 1 },
        traitValue: { trait: 'novelty_seeking', value: 2 },
        factors: { stability: -2, pace: 1, autonomy: 1 },
      },
      {
        id: 'on-the-rota',
        label: 'On a rota where I might get paged, because I want to be the one who fixes the real emergency',
        lanes: { 'incident-response': 3, 'soc-ops': 1 },
        traitValue: { trait: 'pressure_tolerance', value: 1 },
        factors: { stability: -1, pace: 1 },
      },
    ],
  },
];

/** Items keyed by id, for scoring. */
export const ITEM_BY_ID = new Map(ITEMS.map((item) => [item.id, item]));

/** Items belonging to one dimension, so a student can retake just that part. */
export function itemsForDimension(dimension: string): AssessmentItem[] {
  return ITEMS.filter((item) => item.dimension === dimension);
}
