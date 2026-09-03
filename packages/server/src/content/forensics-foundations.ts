/**
 * Forensics Foundations: evidence that holds up.
 *
 * Grounded in the Forensics Analyst role in roles.ts: recovers and preserves
 * evidence to a standard that survives a courtroom, where order of operations
 * (memory before disk, hash before touch) matters because evidence collected
 * wrongly is evidence that cannot be used at all.
 *
 * Standalone and NOT registered in content/index.ts, to avoid colliding with a
 * second session building pathways into the same PACKAGES array. Register in one
 * pass: import it, add to PACKAGES with a real `order`, then typecheck and test.
 * House style: no apostrophes in the copy, to stay clear of the smart-quote
 * hazard that has broken answer keys before.
 */

import type { LearningPackage } from '@soc/shared';

const EVIDENCE_TEACH = {
  concept:
    'Forensics recovers what was done and preserves it to a standard that survives challenge. The ' +
    'work is slow and procedural because the value of evidence is fragile: evidence collected the ' +
    'wrong way is not weaker evidence, it is unusable evidence. The discipline is not about being ' +
    'clever, it is about doing every step in the right order and being able to prove you did.',
} as const;

const VOLATILITY_TEACH = {
  concept:
    'Data disappears at different speeds, and you capture it fastest-fading first. Memory, and the ' +
    'live state of a running system, are gone the moment it is powered off, so they come before the ' +
    'disk, which persists. This is the order of volatility, and getting it backwards means reaching ' +
    'for the durable evidence while the fragile evidence you needed most evaporates.',
} as const;

const INTEGRITY_TEACH = {
  concept:
    'Two rules keep evidence trustworthy. Hash before you touch: take a cryptographic hash of an ' +
    'artefact before and after handling, so anyone can prove it did not change in your hands. And ' +
    'chain of custody: an unbroken record of who held the evidence, when, and what they did, with ' +
    'no gaps. A single unexplained gap, or a hash that does not match, can throw out an entire ' +
    'case, however true the underlying finding is.',
} as const;

export const FORENSICS_FOUNDATIONS: LearningPackage = {
  id: 'forensics-foundations',
  order: 18,
  title: 'Forensics Foundations',
  summary:
    'How evidence is recovered and preserved so it holds up: the order of volatility, hashing ' +
    'before you touch, chain of custody, and why a shortcut destroys the thing it was meant to save.',
  outcomes: [
    'Capture evidence in order of volatility, memory before disk.',
    'Say why hashing and chain of custody make evidence trustworthy.',
    'Recognise the shortcuts that make evidence unusable.',
    'Explain why forensics is procedural rather than clever.',
  ],
  prerequisites: [],
  modules: [
    {
      id: 'fx.1',
      packageId: 'forensics-foundations',
      order: 1,
      title: 'Evidence that holds up',
      summary: 'Volatility, integrity, custody, and the cost of a shortcut.',
      exercises: [
        {
          id: 'fx.1.1',
          moduleId: 'fx.1',
          packageId: 'forensics-foundations',
          order: 1,
          title: 'What to capture first',
          kind: 'multiple-choice',
          goal: 'Put the order of volatility in the right direction.',
          prompt:
            'You arrive at a running, compromised host that is still powered on. Which do you ' +
            'capture first?',
          teach: VOLATILITY_TEACH,
          options: [
            { id: 'a', label: 'A full copy of the hard disk.' },
            { id: 'b', label: 'The contents of memory and the live system state.' },
            { id: 'c', label: 'The installed software list.' },
            { id: 'd', label: 'Pull the power first, to freeze the machine.' },
          ],
          hints: [
            'One of these is gone the instant the machine loses power. That is the one that cannot wait.',
            'The disk persists after shutdown. Memory does not.',
            'Capture fastest-fading first: memory before disk.',
          ],
          solution:
            'B. Memory and live state are the most volatile: they vanish the moment the host is ' +
            'powered off, so they come first. The disk (A) persists and can wait. Pulling the power ' +
            '(D) is the classic mistake, it destroys exactly the volatile evidence you came for.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which of these is destroyed the instant the machine is powered off?',
            },
          ],
          debrief:
            'Order of volatility is the first thing a forensics analyst internalises. Memory holds ' +
            'running processes, network connections, and keys that never touch the disk, and it is ' +
            'gone the moment somebody helpfully switches the machine off.',
          practice: [],
        },
        {
          id: 'fx.1.2',
          moduleId: 'fx.1',
          packageId: 'forensics-foundations',
          order: 2,
          title: 'Hash before you touch',
          kind: 'multiple-choice',
          goal: 'Understand what a hash proves.',
          prompt: 'Why does a forensics analyst hash an artefact before and after handling it?',
          teach: INTEGRITY_TEACH,
          options: [
            { id: 'a', label: 'To compress it so it takes less space.' },
            { id: 'b', label: 'To prove the artefact did not change while it was in their hands.' },
            { id: 'c', label: 'To encrypt it so nobody else can read it.' },
            { id: 'd', label: 'To speed up searching through it.' },
          ],
          hints: [
            'A hash is a fingerprint. Two matching hashes mean the thing did not change.',
            'It is not about size, secrecy, or speed. It is about integrity.',
            'If the before and after hashes match, the analyst can prove they altered nothing.',
          ],
          solution:
            'B. A hash is a fingerprint of the exact bytes. Taking it before and after handling, and ' +
            'showing the two match, proves the artefact was not altered in the analyst hands. It does ' +
            'not compress (A), encrypt (C), or index (D) anything.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'What can two identical hashes, taken before and after, prove?',
            },
          ],
          debrief:
            'Integrity is what makes evidence evidence. A defence lawyer only has to raise the ' +
            'possibility that a file was altered; a matching hash closes that door before it opens.',
          practice: [],
        },
        {
          id: 'fx.1.3',
          moduleId: 'fx.1',
          packageId: 'forensics-foundations',
          order: 3,
          title: 'A gap in custody',
          kind: 'multiple-choice',
          goal: 'See what breaks admissibility.',
          prompt: 'Which of the following is most likely to make otherwise-solid evidence unusable?',
          teach: INTEGRITY_TEACH,
          options: [
            { id: 'a', label: 'A stretch of hours where nobody can say who held the evidence or where it was.' },
            { id: 'b', label: 'The evidence being stored on an encrypted drive.' },
            { id: 'c', label: 'The analyst taking detailed notes at every step.' },
            { id: 'd', label: 'A second analyst reviewing the work.' },
          ],
          hints: [
            'Three of these are good practice. One is a hole in the record.',
            'Chain of custody is an unbroken account of who held the evidence and when.',
            'An unexplained gap in custody is exactly the thing that gets evidence thrown out.',
          ],
          solution:
            'A. A gap where nobody can account for the evidence breaks the chain of custody, and a ' +
            'broken chain lets anyone argue the evidence was tampered with. Encryption (B), careful ' +
            'notes (C), and peer review (D) all strengthen a case rather than weaken it.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint: 'Which option is a hole in the record of who held the evidence?',
            },
          ],
          debrief:
            'Chain of custody is boring and it is everything. The finding can be perfect; if there is ' +
            'an hour nobody can account for, the other side has all the doubt they need.',
          practice: [],
        },
        {
          id: 'fx.1.4',
          moduleId: 'fx.1',
          packageId: 'forensics-foundations',
          order: 4,
          title: 'Shortcuts that destroy evidence',
          kind: 'multiple-choice',
          goal: 'Name the moves that ruin the thing they were meant to save.',
          prompt:
            'Which of these actions would damage or destroy forensic evidence? Select all that apply.',
          teach: EVIDENCE_TEACH,
          options: [
            { id: 'a', label: 'Pulling the power on a live host before capturing memory.' },
            { id: 'b', label: 'Investigating on the original disk instead of a verified copy.' },
            { id: 'c', label: 'Working from a hashed, bit-for-bit image of the disk.' },
            { id: 'd', label: 'Opening files on the suspect system to look around, changing their access times.' },
            { id: 'e', label: 'Recording every step in a contemporaneous log.' },
          ],
          hints: [
            'Three of these change or destroy the evidence. Two are the correct, careful way to work.',
            'Anything done to the ORIGINAL, live or at rest, risks altering it.',
            'A, B, and D all touch the original. C and E are how it is done right.',
          ],
          solution:
            'A, B, and D. Pulling power destroys volatile memory; working on the original disk risks ' +
            'altering it; browsing files on the suspect system changes timestamps that are themselves ' +
            'evidence. C (working from a verified image) and E (logging every step) are exactly the ' +
            'correct procedure.',
          expectedOutput: 'Options A, B, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'd'],
              hint: 'Two options describe working on a safe copy and keeping records. The other three touch the original.',
            },
          ],
          debrief:
            'Every one of these mistakes is easy and well-meant, which is why procedure exists. The ' +
            'analyst who wants to just take a quick look at the live box has already changed it.',
          practice: [],
        },
        {
          id: 'fx.1.5',
          moduleId: 'fx.1',
          packageId: 'forensics-foundations',
          order: 5,
          title: 'Why the order matters',
          kind: 'short-answer',
          goal: 'Put volatility and integrity into your own words.',
          prompt:
            'In two or three sentences, explain the order of volatility, and say why forensics is ' +
            'described as procedural and unforgiving of shortcuts.',
          teach: EVIDENCE_TEACH,
          hints: [
            'Start with what fades fastest and what persists.',
            'Then explain what a shortcut costs: not weaker evidence, but unusable evidence.',
            'Your answer needs both ideas: capture memory before disk, and why a wrong step ruins the evidence.',
          ],
          solution:
            'The order of volatility means capturing the fastest-fading evidence first: memory and ' +
            'live system state, which vanish at power-off, before the disk, which persists. Forensics ' +
            'is procedural because a step done in the wrong order or on the original can alter or ' +
            'destroy evidence, and evidence collected wrongly is not weaker, it is unusable, so the ' +
            'discipline is doing each step correctly and being able to prove it.',
          expectedOutput:
            'An answer naming memory-before-disk volatility and explaining that a wrong step makes ' +
            'evidence unusable rather than merely weaker.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['volatil', 'memory', 'power', 'fades', 'disappear', 'live'],
                ['disk', 'persist', 'first', 'before', 'order'],
                ['unusable', 'inadmiss', 'destroy', 'ruin', 'cannot be used', 'thrown out', 'preserve'],
              ],
              hint:
                'Three ideas: memory is volatile, the disk persists so it comes after, and a wrong ' +
                'step makes evidence unusable rather than just weaker.',
            },
          ],
          debrief:
            'Forensics rewards the patient and punishes the quick. The whole job is being able to ' +
            'stand behind every step, in order, months later, in front of people whose job is to find ' +
            'the one you skipped.',
          practice: [],
        },
      ],
    },
  ],
};
