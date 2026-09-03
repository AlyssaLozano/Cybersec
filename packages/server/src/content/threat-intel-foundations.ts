/**
 * Threat Intelligence Foundations: knowing, and knowing when not to say.
 *
 * Grounded in the Threat Intelligence Analyst role in roles.ts: works out whether
 * anyone has seen this before and what the attacker is likely to do next, where
 * the hardest discipline is restraint, because attribution is easy to assert and
 * hard to justify and confident wrong attribution has consequences well beyond
 * the incident.
 *
 * Standalone and NOT registered in content/index.ts, to avoid colliding with a
 * second session building pathways into the same PACKAGES array. Register in one
 * pass: import it, add to PACKAGES with a real `order`, then typecheck and test.
 * House style: no apostrophes in the copy.
 */

import type { LearningPackage } from '@soc/shared';

const INTEL_TEACH = {
  concept:
    'Threat intelligence answers two questions the incident itself cannot: has anyone seen this ' +
    'before, and what is this actor likely to do next. It turns the indicators pulled from an ' +
    'incident into context, mapping behaviour to known techniques and matching tradecraft against ' +
    'prior campaigns, so the responders are working against a picture of the adversary rather than ' +
    'a pile of disconnected artefacts.',
} as const;

const RESTRAINT_TEACH = {
  concept:
    'The hardest discipline in intelligence is restraint. Attribution, naming who is behind an ' +
    'incident, is easy to assert and hard to justify, and a confident wrong attribution has ' +
    'consequences far beyond the incident: it can misdirect a response, name an innocent party, or ' +
    'shape a decision made above your head. The professional habit is to state confidence honestly, ' +
    'hold uncertainty out loud, and attribute only as far as the evidence actually reaches.',
} as const;

const INDICATOR_TEACH = {
  concept:
    'Not all indicators are equal. An address or a file hash is an indicator of compromise, and it ' +
    'is cheap for an attacker to change: a new server, a recompiled binary, and your list is stale. ' +
    'A technique, tactic, or procedure, how the actor actually operates, is expensive to change, ' +
    'because it is tied to their tooling and habits. Intelligence built on behaviour lasts; ' +
    'intelligence built only on indicators expires the moment the attacker moves house.',
} as const;

export const THREAT_INTEL_FOUNDATIONS: LearningPackage = {
  id: 'threat-intel-foundations',
  order: 20,
  title: 'Threat Intelligence Foundations',
  summary:
    'What threat intelligence produces, the discipline of restraint in attribution, why behaviour ' +
    'outlasts indicators, and how intelligence points the hunt.',
  outcomes: [
    'Say what intelligence adds that the incident alone cannot.',
    'Practise restraint: attribute only as far as the evidence reaches.',
    'Tell a durable behaviour from a cheap, disposable indicator.',
    'See how intelligence tells the hunter what to look for.',
  ],
  prerequisites: [],
  modules: [
    {
      id: 'ti.1',
      packageId: 'threat-intel-foundations',
      order: 1,
      title: 'Intelligence and restraint',
      summary: 'What the seat produces, the cost of confident attribution, and why behaviour lasts.',
      exercises: [
        {
          id: 'ti.1.1',
          moduleId: 'ti.1',
          packageId: 'threat-intel-foundations',
          order: 1,
          title: 'What intelligence adds',
          kind: 'multiple-choice',
          goal: 'Fix what the seat is for.',
          prompt: 'What does threat intelligence add that the incident data alone cannot?',
          teach: INTEL_TEACH,
          options: [
            { id: 'a', label: 'Whether this has been seen before, and what the actor is likely to do next.' },
            { id: 'b', label: 'A faster way to reimage the affected hosts.' },
            { id: 'c', label: 'A patched version of the vulnerable software.' },
            { id: 'd', label: 'A triaged alert queue.' },
          ],
          hints: [
            'The incident tells you what happened. Intelligence tells you who tends to do this and what comes next.',
            'It is about context and prediction, not remediation or triage.',
            'Has anyone seen this before, and what is likely next: that is the intelligence question.',
          ],
          solution:
            'A. Intelligence supplies context the raw incident lacks: whether the tradecraft has been ' +
            'seen before and what the actor is likely to do next. Reimaging (B), patching (C), and ' +
            'triage (D) are other jobs; none of them is what intelligence contributes.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint: 'Which option is about understanding the adversary rather than fixing the machine?',
            },
          ],
          debrief:
            'Intelligence is the seat that lifts a response out of the immediate. The others ask what ' +
            'is happening here; intelligence asks who does this, and where it usually goes.',
          practice: [],
        },
        {
          id: 'ti.1.2',
          moduleId: 'ti.1',
          packageId: 'threat-intel-foundations',
          order: 2,
          title: 'The discipline of restraint',
          kind: 'multiple-choice',
          goal: 'Learn the habit that separates intelligence from guessing.',
          prompt:
            'Early in an incident, the tooling overlaps loosely with a well-known nation-state group. ' +
            'An executive asks who did this. What is the professional response?',
          teach: RESTRAINT_TEACH,
          options: [
            { id: 'a', label: 'Name the nation-state group, since the tooling looks similar.' },
            { id: 'b', label: 'State what the evidence supports and how confident it is, and hold the uncertainty openly.' },
            { id: 'c', label: 'Refuse to say anything at all until the case is closed.' },
            { id: 'd', label: 'Name whichever group was in the news most recently.' },
          ],
          hints: [
            'Attribution is easy to assert and hard to justify. A loose overlap is not proof.',
            'The answer is neither a confident name nor total silence. It is honest confidence.',
            'Say what the evidence reaches, and say how sure you are, uncertainty included.',
          ],
          solution:
            'B. The discipline is to report what the evidence actually supports, state your confidence ' +
            'honestly, and keep the uncertainty visible. Naming a group on a loose overlap (A or D) is ' +
            'exactly the confident wrong attribution that misdirects a response, and total silence (C) ' +
            'is not useful either. Calibrated honesty is the job.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which answer is neither a confident guess nor useless silence?',
            },
          ],
          debrief:
            'Confident wrong attribution is the classic intelligence failure, and it has consequences ' +
            'far past the incident: it can misdirect a whole response or name an innocent party. ' +
            'Saying how sure you are is not weakness, it is the product.',
          practice: [],
        },
        {
          id: 'ti.1.3',
          moduleId: 'ti.1',
          packageId: 'threat-intel-foundations',
          order: 3,
          title: 'Indicator or behaviour',
          kind: 'multiple-choice',
          goal: 'See why behaviour outlasts indicators.',
          prompt:
            'Which of these is hardest for an attacker to change, and therefore the most durable thing ' +
            'to build detection and intelligence around?',
          teach: INDICATOR_TEACH,
          options: [
            { id: 'a', label: 'The IP address they connected from.' },
            { id: 'b', label: 'The hash of the tool they used.' },
            { id: 'c', label: 'The way they operate: the sequence of techniques and habits in their tradecraft.' },
            { id: 'd', label: 'The domain name in their phishing email.' },
          ],
          hints: [
            'An address, a hash, and a domain are all changed in an afternoon.',
            'What is tied to an attacker tooling and habits is expensive to change.',
            'Behaviour, their techniques and procedures, is the durable thing.',
          ],
          solution:
            'C. An address (A), a hash (B), and a domain (D) are all cheap indicators an attacker can ' +
            'swap in minutes. How they operate, their techniques and procedures, is tied to their ' +
            'tooling and habits and is expensive to change, so intelligence built on behaviour lasts ' +
            'while indicator lists go stale.',
          expectedOutput: 'Option C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['c'],
              hint: 'Which of these cannot be changed in an afternoon?',
            },
          ],
          debrief:
            'This is the pyramid of pain in one question: the higher up you detect, from a hash toward ' +
            'behaviour, the more it costs the attacker to adapt. Chasing indicators alone is a ' +
            'treadmill; understanding tradecraft is leverage.',
          practice: [],
        },
        {
          id: 'ti.1.4',
          moduleId: 'ti.1',
          packageId: 'threat-intel-foundations',
          order: 4,
          title: 'Pointing the hunt',
          kind: 'multiple-choice',
          goal: 'See how intelligence feeds the hunter.',
          prompt: 'How does threat intelligence most usefully connect to a threat hunter?',
          teach: INTEL_TEACH,
          options: [
            { id: 'a', label: 'It tells the hunter which techniques an actor uses, so the hunter can search the environment for them.' },
            { id: 'b', label: 'It replaces the hunt, since intelligence already knows everything.' },
            { id: 'c', label: 'It patches the systems the hunter would have checked.' },
            { id: 'd', label: 'It closes alerts so the hunter has less to do.' },
          ],
          hints: [
            'Intelligence is research; hunting is applied. One informs the other.',
            'Think about what a hunter needs to form a hypothesis.',
            'Intelligence says what an actor tends to do; the hunter goes looking for it in the data.',
          ],
          solution:
            'A. Intelligence tells the hunter what an adversary tends to do, and the hunter ' +
            'operationalises that by searching the actual environment for those techniques. ' +
            'Intelligence does not replace the hunt (B), patch systems (C), or close alerts (D); it ' +
            'points the hunt at the right thing.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint: 'Intelligence is research and hunting is applied. Which option connects them that way?',
            },
          ],
          debrief:
            'Intelligence and hunting are a hand-off: the analyst supplies the what-to-look-for, the ' +
            'hunter supplies the go-and-look. A good intelligence report half-writes a hunt.',
          practice: [],
        },
        {
          id: 'ti.1.5',
          moduleId: 'ti.1',
          packageId: 'threat-intel-foundations',
          order: 5,
          title: 'Restraint, in your words',
          kind: 'short-answer',
          goal: 'Put attribution restraint and the indicator lesson together.',
          prompt:
            'In two or three sentences, explain why attribution calls for restraint, and why ' +
            'intelligence built on behaviour outlasts intelligence built on indicators.',
          teach: RESTRAINT_TEACH,
          hints: [
            'Start with the cost of a confident wrong name.',
            'Then contrast a cheap indicator with durable behaviour.',
            'Your answer needs both: why restraint on attribution, and why behaviour lasts.',
          ],
          solution:
            'Attribution calls for restraint because naming who is behind an incident is easy to ' +
            'assert and hard to prove, and a confident wrong attribution can misdirect a response or ' +
            'name an innocent party, so you attribute only as far as the evidence reaches and state ' +
            'your confidence honestly. Intelligence built on behaviour outlasts intelligence built on ' +
            'indicators because addresses and hashes are cheap for an attacker to change, while their ' +
            'techniques and habits are expensive to change and therefore durable.',
          expectedOutput:
            'An answer explaining the cost of confident wrong attribution and contrasting cheap ' +
            'indicators with durable behaviour.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['attribut', 'who', 'name', 'blame'],
                ['restraint', 'confidence', 'uncertain', 'evidence', 'justify', 'wrong', 'careful'],
                ['behaviour', 'technique', 'ttp', 'tradecraft', 'durable', 'indicators', 'hash', 'address', 'change'],
              ],
              hint:
                'Three ideas: attribution names an actor, restraint is needed because a confident ' +
                'wrong call has consequences, and behaviour outlasts cheap indicators.',
            },
          ],
          debrief:
            'The two lessons are the same instinct pointed at different things: do not claim more ' +
            'than the evidence supports, and do not lean your whole picture on the parts an attacker ' +
            'can change overnight.',
          practice: [],
        },
      ],
    },
  ],
};
