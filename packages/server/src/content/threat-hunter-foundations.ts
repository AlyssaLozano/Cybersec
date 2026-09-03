/**
 * Threat Hunter Foundations: the one seat that goes looking.
 *
 * WHY THIS PACKAGE EXISTS, AND WHY IT IS NOT REGISTERED YET
 *
 * Every other SOC role in this platform is reactive: something triggers it. The
 * operator waits for an alert, the incident lead works a declared incident,
 * forensics is handed a host, the vulnerability analyst chases a scan finding.
 * The threat hunter is the exception, and the difference is a whole mindset, so
 * it earns its own foundation before the drills.
 *
 * This file is authored standalone and deliberately NOT added to PACKAGES in
 * content/index.ts, because a second session is building role pathways into that
 * same array at the same time, and two packages sharing an id would fail the
 * catalogue validator at boot. Register it in one coordinated pass: import it in
 * content/index.ts, add it to PACKAGES, then run `npm run typecheck && npm test`.
 * The `order` below is a placeholder; set it when it is registered.
 *
 * No apostrophes in the content strings: the house style forbids em dashes and a
 * sweep over smart quotes has broken answer keys before, so the copy is written
 * to avoid the whole hazard.
 */

import type { LearningPackage } from '@soc/shared';

const HUNT_TEACH = {
  concept:
    'Threat hunting is the one job on the floor that does not wait to be told. Instead of working ' +
    'an alert, a hunter forms a hypothesis about how an attacker might be operating, and goes ' +
    'looking in the raw telemetry for the evidence, before and without any alert firing. It exists ' +
    'because the tooling only catches what somebody already taught it to catch, and a capable ' +
    'intruder spends real effort staying under exactly those thresholds.',
} as const;

const MINDSET_TEACH = {
  concept:
    'Two habits define the hunter. The first is assume breach: work as though an adversary is ' +
    'already inside and simply has not been flagged, rather than treating the network as clean ' +
    'until an alert says otherwise. The second is a testable hypothesis: not a feeling that ' +
    'something is wrong, but a specific claim of the form if an attacker did X, then the data would ' +
    'show Y, which you can then go and check against real logs. A hunt that cannot be tested against ' +
    'data is a worry, not a hunt.',
} as const;

const RELATE_TEACH = {
  concept:
    'A hunter sits between the reactive floor and the engineers. Against the SOC operator: the ' +
    'operator triages what the tools raise; the hunter searches for what the tools missed, ' +
    'self-directed, with nothing telling them to look. Against the detection engineer: the two are ' +
    'a loop. The hunter finds a gap by hand; a successful hunt hands its finding to the detection ' +
    'engineer, who turns it into a rule so the next occurrence is caught automatically. Finding it ' +
    'once is the hunt; making sure it is never missed again is engineering.',
} as const;

export const THREAT_HUNTER_FOUNDATIONS: LearningPackage = {
  id: 'threat-hunter-foundations',
  order: 17,
  title: 'Threat Hunter Foundations',
  summary:
    'The one seat that goes looking. What threat hunting is, the assume-breach mindset, how a ' +
    'testable hypothesis is built, and how the role differs from the reactive seats around it.',
  outcomes: [
    'Say what starts a hunt, and why it is not an alert.',
    'Work from the assume-breach posture rather than assuming a clean network.',
    'Tell a testable hunt hypothesis from a vague worry.',
    'Place the hunter against the SOC operator and the detection engineer.',
  ],
  prerequisites: [],
  modules: [
    {
      id: 'th.1',
      packageId: 'threat-hunter-foundations',
      order: 1,
      title: 'The hunt mindset',
      summary:
        'What hunting is, the two habits that define it, and how it differs from every seat that ' +
        'waits to be told.',
      exercises: [
        {
          id: 'th.1.1',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 1,
          title: 'What starts a hunt',
          kind: 'multiple-choice',
          goal: 'Fix the thing that makes hunting different: nothing has to fire first.',
          prompt: 'A threat hunt begins with which of these?',
          teach: HUNT_TEACH,
          options: [
            { id: 'a', label: 'An alert fires and lands in the queue.' },
            { id: 'b', label: 'A hypothesis about how an attacker might be operating, and where the evidence would show.' },
            { id: 'c', label: 'A vulnerability scanner flags a missing patch.' },
            { id: 'd', label: 'A user reports a suspicious email.' },
          ],
          hints: [
            'Three of these are triggers that arrive at somebody. Hunting is the seat that starts without one.',
            'An alert, a scan finding, and a user report all set the reactive seats in motion. The hunt is self-started.',
            'The hunter decides to go looking. What they start from is an idea, not an event.',
          ],
          solution:
            'B. A hunt starts from a hypothesis the hunter forms, not from an alert or a ticket. The ' +
            'other three are exactly the triggers the reactive seats wait for: an alert for the ' +
            'operator, a scan finding for vulnerability management, a user report for the queue. The ' +
            'whole point of hunting is that it happens with none of those.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which option is something the hunter chooses to pursue, rather than something that arrives and demands a response?',
            },
          ],
          debrief:
            'This is the line that separates hunting from the rest of the SOC. If a job advert says ' +
            '"respond to alerts", it is a triage seat. If it says "proactively search for undetected ' +
            'threats", it is a hunt.',
          practice: [],
        },
        {
          id: 'th.1.2',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 2,
          title: 'Assume breach',
          kind: 'multiple-choice',
          goal: 'Adopt the posture the whole method rests on.',
          prompt: 'What does a threat hunter assume before they start looking?',
          teach: MINDSET_TEACH,
          options: [
            { id: 'a', label: 'That the tooling has already caught anything worth catching.' },
            { id: 'b', label: 'That an adversary may already be inside, unflagged by any alert.' },
            { id: 'c', label: 'That the network is clean until an alert says otherwise.' },
            { id: 'd', label: 'That prevention has held and nothing got through.' },
          ],
          hints: [
            'A hunter who trusts the tools has no reason to hunt. The posture is the opposite of that.',
            'Three of these assume things are fine. One assumes they are not, and goes to find out.',
            'Assume breach: work as though something is already inside and simply has not tripped anything.',
          ],
          solution:
            'B. Hunting rests on assume breach: you work as though an adversary is already present and ' +
            'unflagged, and you go looking for them. A, C, and D all assume the environment is fine ' +
            'until proven otherwise, which is the reactive posture, and it is exactly the assumption a ' +
            'patient intruder is counting on.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which assumption gives a hunter a reason to look at all?',
            },
          ],
          debrief:
            'Assume breach is not paranoia, it is a working method. It turns "is anything wrong" into ' +
            '"where would it be hiding", which is a question you can actually take to the data.',
          practice: [],
        },
        {
          id: 'th.1.3',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 3,
          title: 'The hunter and the detection engineer',
          kind: 'multiple-choice',
          goal: 'See the loop the hunt closes with engineering.',
          prompt:
            'A hunt succeeds and finds attacker activity the tools missed. What is the natural next ' +
            'step, and who owns it?',
          teach: RELATE_TEACH,
          options: [
            { id: 'a', label: 'Close the hunt. The finding is the whole deliverable and nothing more is needed.' },
            { id: 'b', label: 'Hand the finding to a detection engineer to turn into a rule, so the next occurrence is caught automatically.' },
            { id: 'c', label: 'Give it to the SOC operator to look for by hand every day from now on.' },
            { id: 'd', label: 'File it as a vulnerability for the patching team.' },
          ],
          hints: [
            'Finding it once is good. The value multiplies when the next occurrence is caught without a human looking.',
            'Who on the floor owns turning an incident nobody caught into a rule that catches the next one?',
            'The hunter finds the gap by hand; the detection engineer closes it in code. That is the loop.',
          ],
          solution:
            'B. A successful hunt hands its finding to detection engineering, which turns it into a ' +
            'durable rule so the technique is caught automatically next time. That is the loop between ' +
            'the two seats. Closing the hunt (A) throws away most of the value; asking the operator to ' +
            'watch for it by hand (C) does not scale; and it is not a patch (D).',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'The finding is worth most when it becomes something that catches the next occurrence on its own.',
            },
          ],
          debrief:
            'Hunter and detection engineer are a cycle, not rivals: the hunt finds what the rules ' +
            'miss, and engineering makes sure the rules stop missing it. A hunt with no rule at the ' +
            'end of it will be re-run against the same gap forever.',
          practice: [],
        },
        {
          id: 'th.1.4',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 4,
          title: 'Which of these is a hunt',
          kind: 'multiple-choice',
          goal: 'Separate self-started searching from triggered work.',
          prompt:
            'Which of these are threat hunting, as opposed to the reactive work of another seat? ' +
            'Select all that apply.',
          teach: HUNT_TEACH,
          options: [
            { id: 'a', label: 'Querying the logs for a technique no alert covers, on a hunch.' },
            { id: 'b', label: 'Working an alert the SIEM raised.' },
            { id: 'c', label: 'Searching hosts for beaconing patterns before anything has flagged.' },
            { id: 'd', label: 'Preserving a disk image after an incident is declared.' },
            { id: 'e', label: 'Testing a hunch that a service account is being abused, against the auth data.' },
          ],
          hints: [
            'Two of these start because something already happened. Three start because the hunter decided to look.',
            'An alert and a declared incident are triggers. Hunting has no trigger.',
            'A, C, and E all begin with a hunter choosing to search. B is triage; D is forensics.',
          ],
          solution:
            'A, C, and E. Each is a self-started search of the data for something no tool has flagged, ' +
            'which is hunting. B is the SOC operator working a raised alert, and D is forensics acting ' +
            'on a declared incident. Both of those are triggered; the hunt is not.',
          expectedOutput: 'Options A, C, and E selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'c', 'e'],
              hint: 'Drop the two that only happen because something already fired or was declared. What is left is the hunt.',
            },
          ],
          debrief:
            'Notice the same data underlies several of these: logs, auth records, host telemetry. What ' +
            'makes it a hunt is not the data, it is that nobody told you to look at it.',
          practice: [],
        },
        {
          id: 'th.1.5',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 5,
          title: 'A hypothesis you can test',
          kind: 'multiple-choice',
          goal: 'Tell a workable hunt from a worry.',
          prompt: 'Which of these is a hunt hypothesis you can actually take to the data and test?',
          teach: MINDSET_TEACH,
          options: [
            { id: 'a', label: 'The network might be compromised somehow.' },
            { id: 'b', label: 'If an attacker used scheduled tasks for persistence, new tasks would appear on hosts that rarely change, running from unusual paths.' },
            { id: 'c', label: 'We should be more secure than we are.' },
            { id: 'd', label: 'Attackers these days are very sophisticated.' },
          ],
          hints: [
            'A testable hypothesis names a specific behaviour and the specific evidence it would leave.',
            'Three of these are true feelings you cannot check against a log. One tells you exactly what to query.',
            'Look for the if X then the data would show Y shape.',
          ],
          solution:
            'B. It names a specific technique (scheduled tasks for persistence) and the specific ' +
            'evidence it would leave (new tasks, on stable hosts, from unusual paths), which is a query ' +
            'you can run. A, C, and D are real concerns but there is nothing in any of them to check ' +
            'against data, so none of them is a hunt yet.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which one could you turn into a log query this afternoon?',
            },
          ],
          debrief:
            'Most of the skill in hunting is upstream of any tool: turning a vague unease into a ' +
            'specific, checkable claim. A good hypothesis half-writes the query.',
          practice: [],
        },
        {
          id: 'th.1.6',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 6,
          title: 'The hunter, placed',
          kind: 'short-answer',
          goal: 'Put the difference into your own words with the two nearest seats.',
          prompt:
            'In two or three sentences, say how a threat hunter day differs from a SOC operator day, ' +
            'and what a successful hunt hands to the detection engineer.',
          teach: RELATE_TEACH,
          hints: [
            'Start with the trigger: what sets each of them in motion?',
            'The operator answers what arrives; the hunter goes looking for what did not arrive.',
            'Your answer needs three things: how the hunter starts, how the operator starts, and what the hunt gives engineering.',
          ],
          solution:
            'A SOC operator works what arrives: alerts land in the queue and they triage them. A threat ' +
            'hunter starts from a hypothesis and goes looking in the data for activity no alert has ' +
            'flagged, assuming a breach may already be present. When a hunt finds something, it hands ' +
            'the finding to a detection engineer, who turns it into a rule so the next occurrence is ' +
            'caught automatically.',
          expectedOutput:
            'An answer contrasting the operator working alerts with the hunter starting from a ' +
            'hypothesis, and naming the rule or detection the hunt hands to engineering.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['hypothesis', 'proactive', 'go looking', 'without an alert', 'search', 'assume', 'undetected'],
                ['operator', 'alert', 'queue', 'reactive', 'triage', 'waits', 'arrives'],
                ['rule', 'detection', 'automate', 'durable', 'caught automatically', 'next time', 'engineer'],
              ],
              hint:
                'Three ideas: the hunter starts from a hypothesis and looks, the operator works alerts ' +
                'that arrive, and the hunt hands a rule or detection to engineering.',
            },
          ],
          debrief:
            'If you can hold these three straight, you understand where hunting sits: it is the ' +
            'proactive front of the same loop the operator and the detection engineer work the ' +
            'reactive ends of.',
          practice: [],
        },
      ],
    },
  ],
};
