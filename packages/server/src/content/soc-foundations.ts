/**
 * SOC Foundations: what a Security Operations Center is, and who sits in it.
 *
 * WHY THIS PACKAGE EXISTS
 *
 * The platform routes students into SOC roles and drills each one, but it never
 * steps back and teaches the shape of the place those roles live in. A career
 * changer needs that map before the specialisms mean anything: what a SOC is
 * for, how an alert travels through it, and which of the many jobs are the SOC
 * itself versus a neighbouring team the SOC leans on.
 *
 * That last point is the one most courses skip. Several of these roles are not
 * always inside the SOC. A log analyst can be embedded on the floor or sit with
 * a data platform team that serves the whole business; threat intelligence is
 * often its own function; forensics is frequently a specialist team pulled in
 * only when needed. Where a role sits changes how fast the SOC can reach it and
 * who it answers to, and a newcomer who does not know that misreads every job
 * advert they see.
 *
 * Role titles and one-line descriptions are taken from `roles.ts`, so this
 * package and the career router describe the same jobs in the same words.
 *
 * Modules soc.6 to soc.8 cover the part of orientation that is not about the
 * SOC as an idea but about working in one: the tools on the floor and what none
 * of them do, what the rota costs and what alert fatigue actually is, and how
 * somebody gets hired into the first seat and out of it again. That last module
 * exists because this package is most students first contact with the platform
 * and the questions they arrive with are career questions, not technical ones.
 */

import type { LearningPackage } from '@soc/shared';
import { SOC_FOUNDATIONS_PRACTICE } from './soc-foundations-practice.js';

const SOC_TEACH = {
  concept:
    'A Security Operations Center is the function that watches an organisation for signs of ' +
    'attack and responds when it finds them. Its day is detect, triage, investigate, respond, and ' +
    'improve, continuously. It is a detection and response capability, not a promise that nothing ' +
    'ever gets through, and not the team that owns patching or builds the systems it watches.',
} as const;

const TIER_TEACH = {
  concept:
    'Most SOCs are tiered. Tier 1 is triage: first eyes on every alert, clearing the noise and ' +
    'escalating the few that matter. Tier 2 investigates what Tier 1 escalates, pulling in logs, ' +
    'network flows, and context. Tier 3 is the specialists and the incident lead, reached for the ' +
    'incidents that are real and moving. An alert travels up the tiers, and a good one comes back ' +
    'down as a new detection so it is caught automatically next time.\n\n' +
    'Two things about tiers that are easy to get backwards, and both matter to you ' +
    'specifically.\n\n' +
    'Tier 1 is where you start. The SOC Operator seat is the one people are hired into with no ' +
    'prior security job, from a help desk, a support role, the military, or a career change. If ' +
    'you get a SOC job in the next year, this is almost certainly the job. Every other seat on ' +
    'the floor is reached from somewhere: two years of triage, or sideways from network ' +
    'engineering, or from a career in intelligence analysis. None of them is a first job.\n\n' +
    'And tier is not rank. Tier 1 is not junior in the sense of doing lesser work: it is the seat ' +
    'with the shortest clock and the widest funnel. Everything arrives there, and deciding ' +
    'correctly in two minutes what deserves an hour is genuinely hard, and plenty of Tier 3 ' +
    'specialists would do it badly. What changes as you go up is the clock, the depth, and how ' +
    'much of the picture you hold. Not how good you have to be.',
} as const;

const ROLE_TEACH = {
  concept:
    'The SOC is many jobs, not one. The operator clears the queue; the log analyst builds the ' +
    'timeline everyone else argues from; threat intelligence works out who is behind it and what ' +
    'they do next; forensics preserves evidence to a courtroom standard; the incident lead decides ' +
    'what the team does next on incomplete information. Two people looking at one intrusion see ' +
    'different things, which is the whole reason there is more than one seat.',
} as const;

const PLACEMENT_TEACH = {
  concept:
    'Not every SOC role lives in the SOC. Some are core to it: the operator triaging the queue and ' +
    'the lead running an incident are the SOC. Others are shaped by the organisation. A log ' +
    'analyst may be embedded on the floor for fast timelines during an incident, or sit with a ' +
    'data or logging platform team that serves the whole business. Threat intelligence is often a ' +
    'separate function, and forensics and malware analysis are frequently a specialist team pulled ' +
    'in only when needed. Where a role sits changes how quickly the SOC can reach it and who it ' +
    'reports to, not what the work is.',
} as const;

export const SOC_FOUNDATIONS: LearningPackage = {
  id: 'soc-foundations',
  order: 9,
  title: 'SOC Foundations',
  summary:
    'The shape of a Security Operations Center: what it is for, how an alert moves through its ' +
    'tiers, who does which job, and which of those jobs sit inside the SOC versus a team beside it.',
  outcomes: [
    'Say what a SOC is for, and what it is not responsible for.',
    'Trace an alert from the queue through triage, investigation, and response.',
    'Match the core SOC jobs to what each one actually does.',
    'Explain why a role like the log analyst can sit inside the SOC or in a separate team.',
  ],
  prerequisites: ['linux-fundamentals'],
  modules: [
    {
      id: 'soc.1',
      packageId: 'soc-foundations',
      order: 1,
      title: 'The SOC and its people',
      summary:
        'What the place is for, how work moves through it, who the people are, and where they ' +
        'actually sit in the organisation.',
      exercises: [
        {
          id: 'soc.1.1',
          moduleId: 'soc.1',
          packageId: 'soc-foundations',
          order: 1,
          title: 'What a SOC is for',
          kind: 'multiple-choice',
          goal: 'Separate what a SOC does from what people assume it does.',
          prompt:
            'A Security Operations Center exists to do which of the following? Select all that apply.',
          teach: SOC_TEACH,
          options: [
            { id: 'a', label: 'Watch for signs of attack across the organisation, around the clock.' },
            { id: 'b', label: 'Triage alerts and decide which few deserve a human investigation.' },
            { id: 'c', label: 'Investigate confirmed incidents and drive the response.' },
            { id: 'd', label: 'Prevent every attack from ever succeeding.' },
            { id: 'e', label: 'Own the patching of every vulnerable system in the estate.' },
          ],
          hints: [
            'Three of these describe watching, deciding, and responding. Two describe jobs that belong to other teams or to nobody at all.',
            'No team prevents every attack. A SOC is measured on catching and handling the ones that get through.',
            'Patching the estate is vulnerability management, which is usually a separate function from the SOC.',
          ],
          solution:
            'A, B, and C. A SOC watches, triages, and responds: detection and response, ' +
            'continuously. D is a fantasy no team delivers, and holding a SOC to it hides its real ' +
            'job. E belongs to vulnerability management, a separate function; the SOC may flag what ' +
            'is unpatched but does not own the fixing.',
          expectedOutput: 'Options A, B, and C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c'],
              hint:
                'One option promises perfect prevention, which no team can. Another is the patching ' +
                'team, not the SOC. The rest are the SOC.',
            },
          ],
          debrief:
            'Getting this boundary right matters for a job seeker: a SOC role is watch, triage, and ' +
            'respond. If an advert asks you to own patching or guarantee prevention, it is either ' +
            'mislabelled or describing a different team.',
          practice: [],
        },
        {
          id: 'soc.1.2',
          moduleId: 'soc.1',
          packageId: 'soc-foundations',
          order: 2,
          title: 'First eyes on the queue',
          kind: 'multiple-choice',
          goal: 'Place the tiers, starting with who sees an alert first.',
          prompt:
            'In a tiered SOC, who is first eyes on every alert the tooling raises, deciding in ' +
            'minutes which handful deserve a closer look?',
          teach: TIER_TEACH,
          options: [
            { id: 'a', label: 'Incident Response Lead' },
            { id: 'b', label: 'SOC Operator, on alert triage' },
            { id: 'c', label: 'Forensics Analyst' },
            { id: 'd', label: 'Threat Intelligence Analyst' },
          ],
          hints: [
            'This is the Tier 1 seat: the front of the queue, not the specialists behind it.',
            'The lead, forensics, and intel are all reached later, once an alert has earned attention.',
            'It is the most common way into the field: clearing the queue and escalating what matters.',
          ],
          solution:
            'B. The SOC Operator works Tier 1, taking first eyes on every alert and deciding which ' +
            'few to escalate. The lead, forensics, and threat intelligence all sit further up the ' +
            'chain and are reached only once an alert has been judged worth their time.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Look for the Tier 1 role that meets the alert first, before any specialist does.',
            },
          ],
          debrief:
            'Triage is the front door of the whole SOC, and the skill is disposing of the noise ' +
            'correctly rather than quickly. It is the most common way in, and, done as escalate ' +
            'everything, the most common way out.',
          practice: [],
        },
        {
          id: 'soc.1.3',
          moduleId: 'soc.1',
          packageId: 'soc-foundations',
          order: 3,
          title: 'Whose call is it',
          kind: 'multiple-choice',
          goal: 'Attach a decision to the seat that owns it.',
          prompt:
            'An intrusion is confirmed and still moving. Someone must decide, on incomplete ' +
            'information, whether to isolate the affected host now or watch it a while longer. Whose ' +
            'call is that?',
          teach: ROLE_TEACH,
          options: [
            { id: 'a', label: 'SOC Operator' },
            { id: 'b', label: 'Incident Response Lead' },
            { id: 'c', label: 'Log Analyst' },
            { id: 'd', label: 'Vulnerability Analyst' },
          ],
          hints: [
            'This is a decision under uncertainty, made while the incident is live. One seat exists to make exactly those.',
            'The operator triages, the log analyst builds the timeline, the vulnerability analyst prioritises patching. None of them owns the containment call.',
            'The seat whose job is deciding what the team does next, on perhaps sixty percent of the picture, is the lead.',
          ],
          solution:
            'B. Deciding to isolate now or watch longer is a containment call made on incomplete ' +
            'information while the incident moves, and that is the Incident Response Lead. The ' +
            'operator, log analyst, and vulnerability analyst all inform the decision, but the lead ' +
            'owns it and answers for it.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which seat exists to make irreversible calls under uncertainty and explain them afterwards?',
            },
          ],
          debrief:
            'Nearly all of the lead role is communication and decision-making: making a call with ' +
            'part of the picture, then explaining it to executives who want a number nobody has yet.',
          practice: [],
        },
        {
          id: 'soc.1.4',
          moduleId: 'soc.1',
          packageId: 'soc-foundations',
          order: 4,
          title: 'Where a true positive goes',
          kind: 'multiple-choice',
          goal: 'Follow an alert once it turns out to be real.',
          prompt:
            'A SOC Operator confirms an alert is a genuine intrusion. In a healthy SOC, what ' +
            'happens to it next?',
          teach: TIER_TEACH,
          options: [
            { id: 'a', label: 'It is closed, because it has now been confirmed.' },
            { id: 'b', label: 'It is escalated for deeper investigation, and the response is coordinated from there.' },
            { id: 'c', label: 'It is handed straight to the patching team to fix.' },
            { id: 'd', label: 'The operator works the whole incident alone through to remediation.' },
          ],
          hints: [
            'Confirming an intrusion is the start of the work, not the end of it.',
            'Triage hands off; it does not run the whole incident, and it does not just close a real one.',
            'A true positive climbs the tiers into investigation and a coordinated response.',
          ],
          solution:
            'B. A confirmed intrusion is escalated: Tier 2 and the specialists investigate, and the ' +
            'incident lead coordinates the response. Closing it (A) throws away a real incident, the ' +
            'patching team (C) does not run intrusions, and leaving the operator to handle it alone ' +
            '(D) is neither their job nor within reach of one person.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'A confirmed intrusion moves up the tiers, not sideways to patching or into the bin.',
            },
          ],
          debrief:
            'And the incident should come back down the tiers as well: once it is understood, a ' +
            'detection engineer turns it into a rule, so the next occurrence is caught automatically ' +
            'instead of relying on someone spotting it again.',
          practice: [],
        },
        {
          id: 'soc.1.5',
          moduleId: 'soc.1',
          packageId: 'soc-foundations',
          order: 5,
          title: 'Inside the SOC, or beside it',
          kind: 'multiple-choice',
          goal: 'Tell the core SOC seats from the roles that often sit in a neighbouring team.',
          prompt:
            'SOC roles are not always inside the SOC. Which of these commonly sit in a SEPARATE ' +
            'team, supporting or feeding the SOC rather than staffing it, depending on the ' +
            'organisation? Select all that apply.',
          teach: PLACEMENT_TEACH,
          options: [
            { id: 'a', label: 'Log Analyst, who may live with a data or logging platform team.' },
            { id: 'b', label: 'Threat Intelligence Analyst, often a separate CTI function.' },
            { id: 'c', label: 'Vulnerability Analyst, usually in vulnerability management or security engineering.' },
            { id: 'd', label: 'SOC Operator, on alert triage.' },
            { id: 'e', label: 'Forensics Analyst, frequently a specialist team pulled in as needed.' },
          ],
          hints: [
            'One of these is the core SOC seat that defines Tier 1. It is never outside the SOC.',
            'The log, intel, vulnerability, and forensics functions can all live in their own teams and serve the SOC from there.',
            'Only the alert-triage operator has to be inside the SOC, because that seat is the SOC.',
          ],
          solution:
            'A, B, C, and E. Log analysis often belongs to a data or logging platform team, threat ' +
            'intelligence is frequently its own CTI function, vulnerability analysis usually lives ' +
            'in vulnerability management, and forensics is commonly a specialist team pulled in for ' +
            'the incidents that need it. D, the SOC Operator on triage, is the core Tier 1 seat and ' +
            'is the SOC itself, so it is never the one sitting outside.',
          expectedOutput: 'Options A, B, C, and E selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'e'],
              hint:
                'Four of these can be staffed by a team next to the SOC. One of them IS the SOC and ' +
                'cannot be anywhere else.',
            },
          ],
          debrief:
            'This is why two job adverts with the same title can be different jobs. Log Analyst in a ' +
            'SOC means live-incident timelines; the same title on a data platform team means ' +
            'pipelines and retention. Read where the role sits, not just what it is called.',
          practice: [],
        },
        {
          id: 'soc.1.6',
          moduleId: 'soc.1',
          packageId: 'soc-foundations',
          order: 6,
          title: 'The log analyst, placed',
          kind: 'short-answer',
          goal: 'Put the inside-or-outside question into your own words with a real role.',
          prompt:
            'The Log Analyst can sit inside the SOC or in a separate team. In two or three ' +
            'sentences, say what the role does, then give one reason an organisation might embed it ' +
            'in the SOC and one reason it might place it in a separate team.',
          teach: PLACEMENT_TEACH,
          hints: [
            'Start with the work itself: what does a log analyst actually produce during an incident?',
            'Embedding buys speed during a live incident. A shared team serves the whole business, not just the SOC.',
            'Your answer needs three things: what the role does, one reason to embed it, and one reason to place it outside.',
          ],
          solution:
            'A log analyst parses raw logs from every source and builds the timeline the rest of ' +
            'the incident argues from, reconciling clocks and finding the gaps. An organisation ' +
            'might embed the role in the SOC so that timeline is available fast while an incident is ' +
            'live. It might instead place it in a data or logging platform team, so the same ' +
            'expertise serves the whole business and the logging pipeline is owned in one place.',
          expectedOutput:
            'An answer naming the timeline or log work, one reason to embed the role in the SOC, ' +
            'and one reason to place it in a separate team.',
          checks: [
            {
              type: 'answer-mentions',
              /*
                * These grade what the ANSWER adds, not the nouns the prompt hands over.
                * The question already says "Log Analyst", "embed" and "separate team", so
                * groups built on those words passed when the prompt was pasted back, which
                * soc-foundations.test.ts caught. What has to be supplied is the output of
                * the role and the two REASONS.
                */
              conceptGroups: [
                ['timeline', 'parse', 'correlat', 'reconcil', 'raw log', 'builds'],
                ['fast', 'speed', 'quick', 'live', 'immediately', 'during an incident'],
                ['whole business', 'shared', 'platform', 'pipeline', 'one place', 'serves'],
              ],
              hint:
                'Three ideas: what the log analyst actually produces, the reason embedding helps ' +
                'during an incident, and the reason a shared team helps everybody else.',
            },
          ],
          debrief:
            'There is no single right home for the role. Knowing that a title can mean either ' +
            'placement is the difference between an interview where you ask the right question about ' +
            'the team, and one where you find out on your first day.',
          practice: SOC_FOUNDATIONS_PRACTICE['soc.1.6'] ?? [],
        },
      ],
    },
    {
      id: 'soc.2',
      packageId: 'soc-foundations',
      order: 2,
      title: 'How work moves through the SOC',
      summary:
        'The alert lifecycle, the two numbers a SOC lives by, why escalate-everything fails, and ' +
        'how a SOC gets better over time.',
      exercises: [
        {
          id: 'soc.2.1',
          moduleId: 'soc.2',
          packageId: 'soc-foundations',
          order: 1,
          title: 'Mostly noise',
          kind: 'multiple-choice',
          goal: 'Set the right expectation for what a queue actually holds.',
          prompt:
            'A SOC operator opens the queue at the start of a shift. Across a typical day, most of ' +
            'what is in that queue is:',
          teach: {
            concept:
              'A detection is a guess that something might be wrong, and most guesses are wrong. The ' +
              'bulk of any queue is noise: benign activity that happened to match a rule. The skill ' +
              'of triage is clearing that noise correctly, so the few real alerts are not buried ' +
              'under it.',
          },
          options: [
            { id: 'a', label: 'Confirmed intrusions that need a response.' },
            { id: 'b', label: 'False positives and benign activity that tripped a rule.' },
            { id: 'c', label: 'Malware samples waiting to be reverse engineered.' },
            { id: 'd', label: 'Patches waiting to be applied.' },
          ],
          hints: [
            'Detections fire on patterns, and normal activity trips patterns constantly.',
            'If most alerts were real intrusions, no organisation would survive a week.',
            'The queue is mostly benign. Finding the rare real one inside it is the job.',
          ],
          solution:
            'B. Most alerts are false positives or benign activity that matched a rule. The value of ' +
            'triage is clearing that noise so the rare true positive becomes visible instead of buried.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which of these makes up the overwhelming majority of a real alert queue?',
            },
          ],
          debrief:
            'This is why alert fatigue is the central hazard of the seat. An operator worn down by ' +
            'noise starts rubber-stamping, and the one real alert of the month goes out with the rest.',
          practice: [],
        },
        {
          id: 'soc.2.2',
          moduleId: 'soc.2',
          packageId: 'soc-foundations',
          order: 2,
          title: 'The two numbers',
          kind: 'multiple-choice',
          goal: 'Read the two metrics a SOC is judged on.',
          prompt:
            'A SOC reports its Mean Time To Detect (MTTD) and Mean Time To Respond (MTTR). What does ' +
            'MTTD measure?',
          teach: {
            concept:
              'Two numbers describe how a SOC performs. Mean Time To Detect is how long an intrusion ' +
              'runs before anyone notices. Mean Time To Respond is how long from noticing to ' +
              'containing it. Driving both down is the whole game, because the longer either runs, ' +
              'the more an attacker gets done.',
          },
          options: [
            { id: 'a', label: 'How long from the attack starting to the SOC noticing it.' },
            { id: 'b', label: 'How long from noticing the attack to containing it.' },
            { id: 'c', label: 'How many alerts the SOC closes per hour.' },
            { id: 'd', label: 'How many false positives the tooling produces.' },
          ],
          hints: [
            'Detect comes before respond. One measures noticing, the other measures acting.',
            'MTTD is the gap between the attack starting and the SOC seeing it.',
            'Detect is time to notice. Respond is time to contain.',
          ],
          solution:
            'A. MTTD measures the gap between an attack beginning and the SOC noticing it. B is MTTR, ' +
            'and the other two are throughput or noise measures, not detection speed.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint: 'Detect measures noticing. One option is about the delay before the SOC sees the attack at all.',
            },
          ],
          debrief:
            'Attackers count on a long MTTD. The Yahoo and SolarWinds intrusions ran for months ' +
            'undetected, and nearly all of the damage happened inside that window.',
          practice: [],
        },
        {
          id: 'soc.2.3',
          moduleId: 'soc.2',
          packageId: 'soc-foundations',
          order: 3,
          title: 'Escalate everything',
          kind: 'multiple-choice',
          goal: 'See why the safe-looking option is the broken one.',
          prompt:
            'A nervous Tier 1 operator decides to escalate every alert, just to be safe. Why is that ' +
            'a failure rather than caution?',
          teach: {
            concept:
              'Triage works only because it filters. An operator who escalates everything has done no ' +
              'triage at all: the noise just moves to the next tier, which has less capacity, not ' +
              'more. A queue triaged by escalating everything is the same as a queue nobody triaged.',
          },
          options: [
            { id: 'a', label: 'It is the correct, safe approach.' },
            { id: 'b', label: 'The next tier cannot absorb that volume, so no real filtering happens.' },
            { id: 'c', label: 'It saves the company money.' },
            { id: 'd', label: 'It deliberately lengthens MTTD.' },
          ],
          hints: [
            'Escalation is a scarce resource. What happens if you spend it on everything?',
            'The next tier has fewer people, not more. They cannot work the entire queue.',
            'Escalating everything is the same as escalating nothing: no filtering occurred.',
          ],
          solution:
            'B. Escalating everything just moves the noise to a tier with less capacity, so the ' +
            'filtering that makes triage useful never happens. It is functionally the same as no triage.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Think about who receives all those escalations, and whether they can keep up.',
            },
          ],
          debrief:
            'This is why the operator seat is graded on disposing of the queue correctly, not quickly, ' +
            'and why escalate-everything is one of the most common ways out of the field.',
          practice: [],
        },
        {
          id: 'soc.2.4',
          moduleId: 'soc.2',
          packageId: 'soc-foundations',
          order: 4,
          title: 'The triage tradeoff',
          kind: 'short-answer',
          goal: 'Name the tension a triage operator lives inside.',
          prompt:
            'Triage sits between two failures: missing a real alert, and escalating so much that real ' +
            'ones get buried. In two or three sentences, describe that tradeoff and why it is hard.',
          teach: {
            concept:
              'Every triage decision risks one of two mistakes. Dismiss a real alert and an intrusion ' +
              'runs unseen. Escalate too freely and the real ones drown in the volume you sent up. The ' +
              'operator has seconds per alert and cannot avoid both risks at once, which is exactly ' +
              'what makes the seat hard rather than boring.',
          },
          hints: [
            'There are two opposite ways to get triage wrong. Name both.',
            'One failure is a missed real alert. The other is burying real alerts in noise.',
            'Your answer should say why you cannot simply avoid both at the same time.',
          ],
          solution:
            'Dismissing an alert risks waving through a real intrusion, so caution pushes you to ' +
            'escalate more. But escalating too much buries the genuine alerts in noise and overwhelms ' +
            'the next tier, so caution in the other direction pushes you to dismiss more. With only ' +
            'seconds per alert you cannot fully avoid both, and every call trades one risk for the other.',
          expectedOutput:
            'An answer naming both failure modes, missing a real alert and over-escalating, and why ' +
            'they cannot both be avoided at once.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['miss', 'dismiss', 'false negative', 'real alert', 'breach', 'unseen'],
                ['escalate', 'too much', 'noise', 'bury', 'fatigue', 'volume', 'overwhelm'],
              ],
              hint: 'Two ideas: the cost of dismissing a real alert, and the cost of escalating too much.',
            },
          ],
          debrief:
            'Naming this tradeoff is what separates an operator who is learning from one who is just ' +
            'clicking. The good ones know which risk they are taking on each call, and why.',
          practice: SOC_FOUNDATIONS_PRACTICE['soc.2.4'] ?? [],
        },
        {
          id: 'soc.2.5',
          moduleId: 'soc.2',
          packageId: 'soc-foundations',
          order: 5,
          title: 'How a SOC gets better',
          kind: 'multiple-choice',
          goal: 'Close the loop from incident to prevention.',
          prompt:
            'An incident is investigated and closed. In a mature SOC, what should happen so the same ' +
            'thing is caught faster next time?',
          teach: {
            concept:
              'A SOC that only reacts never gets ahead. The loop closes when a handled incident ' +
              'becomes a new detection: the detection engineer takes what caught it by hand and writes ' +
              'the rule that catches it automatically. That is how a painful incident today becomes a ' +
              'routine alert tomorrow.',
          },
          options: [
            { id: 'a', label: 'Nothing; the incident is over.' },
            { id: 'b', label: 'A detection engineer turns what was learned into a new rule.' },
            { id: 'c', label: 'The whole system is rebuilt from scratch.' },
            { id: 'd', label: 'The operator who missed it is dismissed.' },
          ],
          hints: [
            'Reacting to the same thing forever is not improvement. Something has to change.',
            'One seat exists to make catching this automatic next time.',
            'The lesson from the incident should become a rule that fires on its own.',
          ],
          solution:
            'B. The loop closes when a detection engineer turns the incident into a rule, so the next ' +
            'occurrence is caught automatically instead of relying on someone noticing again. Doing ' +
            'nothing guarantees a repeat, and the other options fix nothing.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which role turns a hand-caught incident into an automatic detection?',
            },
          ],
          debrief:
            'This is the difference between a SOC that treads water and one that improves. Every ' +
            'incident either teaches the tooling something or is destined to happen again.',
          practice: [],
        },
      ],
    },
    {
      id: 'soc.3',
      packageId: 'soc-foundations',
      order: 3,
      title: 'The roles up close',
      summary:
        'Tell the roles apart by what each one produces, including the three seats that all deal in ' +
        'detection and are still different jobs.',
      exercises: [
        {
          id: 'soc.3.1',
          moduleId: 'soc.3',
          packageId: 'soc-foundations',
          order: 1,
          title: 'Who builds the timeline',
          kind: 'multiple-choice',
          goal: 'Match a role to what it produces during an incident.',
          prompt:
            'During an incident, one role parses the raw logs and builds the timeline that everyone ' +
            'else argues from. Which role?',
          teach: {
            concept:
              'The clearest way to tell SOC roles apart is by what each one produces. The log analyst ' +
              'produces the timeline: raw logs reconciled into an ordered account of what happened ' +
              'when. Everyone else in the incident reasons from that account, which is why the seat ' +
              'matters more than it sounds.',
          },
          options: [
            { id: 'a', label: 'SOC Operator' },
            { id: 'b', label: 'Log Analyst' },
            { id: 'c', label: 'Threat Intelligence Analyst' },
            { id: 'd', label: 'Malware Analyst' },
          ],
          hints: [
            'This role lives in raw logs and reconciles clocks that disagree.',
            'The output is a timeline, not a disposition or a signature.',
            'It is the seat whose work everyone else in the incident argues from.',
          ],
          solution:
            'B. The Log Analyst parses raw logs and builds the timeline the rest of the incident ' +
            'reasons from. The operator triages, intel researches the adversary, and the malware ' +
            'analyst dissects a file; none of them owns the timeline.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which role produces the ordered account of events that everyone else references?',
            },
          ],
          debrief:
            'A weak timeline sinks an incident: if nobody can say what happened in what order, every ' +
            'other decision is a guess. That is why this quiet seat carries so much weight.',
          practice: [],
        },
        {
          id: 'soc.3.2',
          moduleId: 'soc.3',
          packageId: 'soc-foundations',
          order: 2,
          title: 'The preventive seat',
          kind: 'multiple-choice',
          goal: 'Find the one role whose output stops the next incident.',
          prompt:
            'Whose output is preventive rather than investigative: turning an incident nobody caught ' +
            'in time into a rule that catches the next one automatically?',
          teach: {
            concept:
              'Most SOC seats investigate what already happened. One does not. The detection engineer ' +
              'produces rules: the logic that decides what fires an alert at all. Its output is ' +
              'preventive, measured by what gets caught next time rather than by any single incident.',
          },
          options: [
            { id: 'a', label: 'Detection Engineer' },
            { id: 'b', label: 'Forensics Analyst' },
            { id: 'c', label: 'Incident Response Lead' },
            { id: 'd', label: 'Vulnerability Analyst' },
          ],
          hints: [
            'Look for the seat whose output is a rule, not a finding about this incident.',
            'It is the only role on the floor whose work is preventive rather than investigative.',
            'It decides what the tooling notices next time.',
          ],
          solution:
            'A. The Detection Engineer writes the rules that decide what fires an alert, so its output ' +
            'is preventive. Forensics preserves evidence, the lead decides the response, and the ' +
            'vulnerability analyst prioritises patching; all three are about what already happened.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint: 'Which seat produces the rule that catches this automatically next time?',
            },
          ],
          debrief:
            'This is why the detection engineer sits at the boundary of the SOC and engineering: the ' +
            'output is code that runs against the whole estate, not a note on one incident.',
          practice: [],
        },
        {
          id: 'soc.3.3',
          moduleId: 'soc.3',
          packageId: 'soc-foundations',
          order: 3,
          title: 'What makes a hunter different',
          kind: 'multiple-choice',
          goal: 'Separate proactive hunting from reactive triage.',
          prompt:
            'A threat hunter and a SOC operator both look for attacks. What is the key difference ' +
            'between them?',
          teach: {
            concept:
              'Almost every SOC seat is triggered by something: an alert, a rule gap, an intel report. ' +
              'The threat hunter is the exception. It is proactive and hypothesis-driven: it assumes a ' +
              'breach already happened and goes looking for the evidence that no alert ever fired on. A ' +
              'good hunt ends by handing the detection engineer a new rule.',
          },
          options: [
            {
              id: 'a',
              label:
                'The operator reacts to alerts the tooling already raised; the hunter goes looking for what never raised an alert.',
            },
            { id: 'b', label: 'The hunter only reads reports and never touches data.' },
            { id: 'c', label: 'There is no real difference between them.' },
            { id: 'd', label: 'The operator is simply more senior than the hunter.' },
          ],
          hints: [
            'One of them starts from a queue. The other starts from a hypothesis.',
            'Think about what each one has in front of them before they begin: an alert, or nothing.',
            'The hunter assumes something was missed and searches for what no alert caught.',
          ],
          solution:
            'A. The operator is reactive, working alerts the tooling already raised. The hunter is ' +
            'proactive, assuming a breach was missed and searching the data for evidence no alert ever ' +
            'fired on. It is the one seat with nothing in front of it to start from except a hypothesis.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint: 'Which role has no alert to start from, and goes looking anyway?',
            },
          ],
          debrief:
            'Threat hunting is also distinct from detection engineering and threat intel: the hunter ' +
            'finds the undetected intrusion by hand, the engineer automates catching it, and intel ' +
            'says which adversary technique to hunt for in the first place.',
          practice: [],
        },
        {
          id: 'soc.3.4',
          moduleId: 'soc.3',
          packageId: 'soc-foundations',
          order: 4,
          title: 'Evidence that survives court',
          kind: 'multiple-choice',
          goal: 'Attach the preservation discipline to the right seat.',
          prompt:
            'One role recovers and preserves evidence to a standard that survives a courtroom, working ' +
            'memory before disk and hashing before touching anything. Which role?',
          teach: {
            concept:
              'Forensics is slow, procedural, and unforgiving of shortcuts. Order of operations ' +
              'matters, memory before disk and a hash before a touch, because evidence collected ' +
              'wrongly is evidence that cannot be used at all. That discipline is what separates it ' +
              'from the faster, decision-driven seats around it.',
          },
          options: [
            { id: 'a', label: 'Incident Response Lead' },
            { id: 'b', label: 'Forensics Analyst' },
            { id: 'c', label: 'Network Analyst' },
            { id: 'd', label: 'Detection Engineer' },
          ],
          hints: [
            'This is the seat where order of operations is unforgiving.',
            'Memory before disk, hash before touch: that is a chain-of-custody discipline.',
            'The output has to hold up as evidence, not just inform a decision.',
          ],
          solution:
            'B. The Forensics Analyst preserves evidence to a courtroom standard, which is why order ' +
            'of operations matters so much. The lead decides the response, and the other two seats are ' +
            'not about preservation at all.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which seat treats evidence as something that must survive a courtroom?',
            },
          ],
          debrief:
            'This is also why forensics is often a specialist team pulled in as needed rather than a ' +
            'full-time SOC seat: the rigour is expensive and only some incidents need it.',
          practice: [],
        },
        {
          id: 'soc.3.5',
          moduleId: 'soc.3',
          packageId: 'soc-foundations',
          order: 5,
          title: 'Three flavours of detection',
          kind: 'short-answer',
          goal: 'Hold three similar-sounding roles apart in your own words.',
          prompt:
            'Detection Engineer, Threat Intelligence Analyst, and Threat Hunter all deal with ' +
            'detecting threats. In a few sentences, say how each one is different from the other two.',
          teach: {
            concept:
              'These three seats are easy to blur and are genuinely different jobs. The detection ' +
              'engineer writes the rules that automate catching a threat. The threat intel analyst ' +
              'researches adversaries and produces the indicators and techniques worth watching for. ' +
              'The threat hunter takes a hypothesis and searches the environment by hand for what no ' +
              'alert has caught. One automates, one researches, one hunts.',
          },
          hints: [
            'Start from the output of each: a rule, a piece of intelligence, or a found intrusion.',
            'One is proactive and hypothesis-driven with no alert to start from. Which one?',
            'Your answer needs a distinct sentence for the engineer, the intel analyst, and the hunter.',
          ],
          solution:
            'The detection engineer writes and tunes the rules that catch threats automatically. The ' +
            'threat intelligence analyst researches adversaries and campaigns, producing the ' +
            'indicators and techniques worth detecting. The threat hunter works from a hypothesis and ' +
            'searches the environment by hand for intrusions no alert ever fired on. One automates ' +
            'detection, one supplies what to detect, and one goes looking for what detection missed.',
          expectedOutput:
            'An answer that gives each of the three a distinct job: writing rules, researching ' +
            'adversaries, and proactively hunting.',
          checks: [
            {
              type: 'answer-mentions',
              /*
                * Graded on what each seat PRODUCES, never on its job title: the prompt names
                * all three roles, so title-matching passed on the question itself.
                */
              conceptGroups: [
                ['rule', 'automate', 'detection logic', 'tune'],
                ['adversary', 'campaign', 'indicator', 'research', 'attribution', 'who is behind'],
                ['hypothesis', 'no alert', 'by hand', 'proactive', 'assume breach', 'never fired'],
              ],
              hint:
                'Three distinct outputs: the rule that automates it, the intelligence about the ' +
                'adversary, and the hypothesis-driven search for what no alert caught.'
            },
          ],
          debrief:
            'Blurring these is a common interview stumble. Being able to say cleanly what each one ' +
            'produces shows you understand the floor as a set of jobs, not one undifferentiated role.',
          practice: SOC_FOUNDATIONS_PRACTICE['soc.3.5'] ?? [],
        },
      ],
    },
    {
      id: 'soc.4',
      packageId: 'soc-foundations',
      order: 4,
      title: 'Where the SOC sits',
      summary:
        'In-house versus outsourced, the teams the SOC leans on but does not own, and who gets pulled ' +
        'in when an incident outgrows the SOC.',
      exercises: [
        {
          id: 'soc.4.1',
          moduleId: 'soc.4',
          packageId: 'soc-foundations',
          order: 1,
          title: 'In-house or outsourced',
          kind: 'multiple-choice',
          goal: 'Name the outsourced SOC model.',
          prompt:
            'A company does not run its own round-the-clock monitoring. It pays a vendor to watch its ' +
            'alerts and escalate the real ones. What is that arrangement called?',
          teach: {
            concept:
              'Not every organisation staffs its own SOC. Many buy monitoring from an MSSP, a Managed ' +
              'Security Service Provider, that watches many clients at once. In-house means deep ' +
              'context but high cost. An MSSP means lower cost and round-the-clock coverage from day ' +
              'one, but a vendor that knows your environment less well than your own people would.',
          },
          options: [
            { id: 'a', label: 'An MSSP (Managed Security Service Provider).' },
            { id: 'b', label: 'A bug bounty programme.' },
            { id: 'c', label: 'A penetration test.' },
            { id: 'd', label: 'A SIEM.' },
          ],
          hints: [
            'This is an outsourcing arrangement, not a tool or a one-off test.',
            'The vendor provides the monitoring as an ongoing managed service.',
            'A SIEM is the platform; a bounty and a pentest are one-off. One option is the outsourced SOC.',
          ],
          solution:
            'A. Paying a vendor to run your monitoring as an ongoing service is an MSSP. A SIEM is the ' +
            'platform a SOC uses, and a bug bounty or a penetration test is a one-off engagement, not ' +
            'continuous monitoring.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint: 'Which option is an ongoing outsourced monitoring service rather than a tool or a one-off?',
            },
          ],
          debrief:
            'Job adverts split along this line. An in-house SOC role means deep context on one estate; ' +
            'an MSSP role means breadth across many clients and a faster pace. Neither is better, but ' +
            'they are different jobs.',
          practice: [],
        },
        {
          id: 'soc.4.2',
          moduleId: 'soc.4',
          packageId: 'soc-foundations',
          order: 2,
          title: 'What the SOC leans on',
          kind: 'multiple-choice',
          goal: 'Draw the line between the SOC and the teams it depends on.',
          prompt:
            'The SOC depends on other teams but does not do their work. Which of these does the SOC ' +
            'rely on ANOTHER team for, rather than doing itself? Select all that apply.',
          teach: {
            concept:
              'A SOC watches and responds; it does not run everything it touches. Patching belongs to ' +
              'vulnerability management, the applications belong to engineering, and user accounts ' +
              'belong to identity and access management. The SOC leans on all three and owns none of ' +
              'them. Knowing that boundary is how you read where a job actually sits.',
          },
          options: [
            { id: 'a', label: 'Patching vulnerable systems (vulnerability management).' },
            { id: 'b', label: 'Building and running the applications (engineering).' },
            { id: 'c', label: 'Managing user accounts and access (identity and access management).' },
            { id: 'd', label: 'Triaging the alert queue.' },
          ],
          hints: [
            'Three of these belong to teams the SOC works with. One of them is the SOC itself.',
            'Patching, building software, and running identity are all somebody else main job.',
            'Only one option is the core work the SOC does with its own hands.',
          ],
          solution:
            'A, B, and C. Patching is vulnerability management, the applications are engineering, and ' +
            'accounts are identity and access management. The SOC depends on all three but owns none. ' +
            'D, triaging the queue, is the SOC doing its own core work.',
          expectedOutput: 'Options A, B, and C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c'],
              hint: 'Three belong to neighbouring teams. One is the SOC itself, and it is not about to outsource that.',
            },
          ],
          debrief:
            'When an incident needs a patch, a code fix, or an account disabled, the SOC asks the ' +
            'team that owns it. A SOC that tries to own all of that directly is a SOC that has stopped ' +
            'being a SOC.',
          practice: [],
        },
        {
          id: 'soc.4.3',
          moduleId: 'soc.4',
          packageId: 'soc-foundations',
          order: 3,
          title: 'When it outgrows the SOC',
          kind: 'multiple-choice',
          goal: 'Recognise when an incident stops being only a SOC matter.',
          prompt:
            'A confirmed breach exposes customer data. Beyond containing it technically, who else ' +
            'usually has to be brought in?',
          teach: {
            concept:
              'Some incidents outgrow the SOC. A breach of customer data carries legal duties, ' +
              'regulatory clocks, and reputational stakes that the SOC is not equipped to own. Legal, ' +
              'executives, and communications get pulled in, because the consequences reach well ' +
              'beyond the technical containment the SOC handles.',
          },
          options: [
            { id: 'a', label: 'Nobody; the SOC handles everything end to end.' },
            {
              id: 'b',
              label: 'Legal, executives, and communications, because a breach has consequences the SOC does not own.',
            },
            { id: 'c', label: 'Only the patching team.' },
            { id: 'd', label: 'Only the threat hunter.' },
          ],
          hints: [
            'A data breach is not only a technical event. What else does it trigger?',
            'Think about notification duties, regulators, and public statements.',
            'The consequences reach beyond anything the SOC is equipped to decide alone.',
          ],
          solution:
            'B. A customer-data breach brings legal duties, regulatory deadlines, and reputational ' +
            'fallout, so legal, executives, and communications are pulled in. The SOC owns the ' +
            'technical containment, not the notification, the disclosure, or the public response.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which option covers the legal, executive, and public consequences the SOC cannot own alone?',
            },
          ],
          debrief:
            'This is why the incident response lead spends so much time communicating upward. Past a ' +
            'certain severity, the hardest parts of an incident are decisions the SOC informs but does ' +
            'not make.',
          practice: [],
        },
        {
          id: 'soc.4.4',
          moduleId: 'soc.4',
          packageId: 'soc-foundations',
          order: 4,
          title: 'The MSSP tradeoff',
          kind: 'short-answer',
          goal: 'Weigh outsourced against in-house in your own words.',
          prompt:
            'Give one advantage and one disadvantage of outsourcing a SOC to an MSSP instead of ' +
            'running it in-house.',
          teach: {
            concept:
              'The choice between an in-house SOC and an MSSP is a real tradeoff. An MSSP gives you ' +
              'round-the-clock coverage and pooled expertise from day one, usually for less than ' +
              'staffing a full team. The cost is context: a vendor watching many clients knows your ' +
              'environment less well than your own people, and can be slower to grasp what is normal ' +
              'for you.',
          },
          hints: [
            'Think about what an MSSP gives you cheaply and quickly.',
            'Then think about what it cannot know as well as your own staff would.',
            'Your answer needs one clear advantage and one clear disadvantage.',
          ],
          solution:
            'An MSSP gives round-the-clock coverage and pooled expertise from day one, usually cheaper ' +
            'than building and staffing a full in-house team. The disadvantage is context: a vendor ' +
            'watching many clients understands your specific environment less well than your own ' +
            'people, so it can be slower to tell an attack from something merely unusual for you.',
          expectedOutput:
            'An answer with one advantage of an MSSP (cost, coverage, or expertise) and one ' +
            'disadvantage (weaker context or environment knowledge).',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['cost', 'cheaper', 'coverage', 'round the clock', '24', 'expertise', 'scale', 'quickly'],
                ['context', 'less', 'vendor', 'knows', 'environment', 'slower', 'generic', 'many clients'],
              ],
              hint: 'One upside of outsourcing, and one thing an outside vendor cannot know as well as your own team.',
            },
          ],
          debrief:
            'There is no universal right answer, which is the point. A small company may be far safer ' +
            'with an MSSP than with a single overworked analyst; a large one may need the context only ' +
            'an in-house team can hold.',
          practice: SOC_FOUNDATIONS_PRACTICE['soc.4.4'] ?? [],
        },
      ],
    },
    {
      id: 'soc.5',
      packageId: 'soc-foundations',
      order: 5,
      title: 'How the SOC works together',
      summary:
        'One attack, every seat: how the roles hand off to each other, and why no single one of them ' +
        'could have stopped it alone.',
      exercises: [
        {
          id: 'soc.5.1',
          moduleId: 'soc.5',
          packageId: 'soc-foundations',
          order: 1,
          title: 'Who catches it first',
          kind: 'multiple-choice',
          goal: 'See that first contact is a hand-off, not a fixed ladder.',
          prompt: 'Customer data is being stolen from a company right now. Who is first to catch it?',
          teach: {
            concept:
              'No single seat always sees an attack first. An automated alert usually lands in the ' +
              'Tier 1 queue, so the operator is often first eyes on it. But a log analyst hunting ' +
              'through logs, or a network analyst reviewing traffic, can spot something the tooling ' +
              'missed and kick it up to be verified. Whoever catches it hands it off, and that hand-off ' +
              'runs in whatever direction confirms and resolves the attack, not one fixed ladder.',
          },
          options: [
            {
              id: 'a',
              label:
                'It depends: often Tier 1 triage on an automated alert, but a log analyst or network analyst can spot it first.',
            },
            { id: 'b', label: 'Always the SOC operator, and never anyone else.' },
            { id: 'c', label: 'The CEO, when a customer complains.' },
            { id: 'd', label: 'Nobody, until the attacker announces it.' },
          ],
          hints: [
            'Is there really one seat that always sees every attack before anyone else?',
            'An automated alert lands in the queue, but a person hunting can find what the tooling missed.',
            'The honest answer allows for more than one seat catching it first.',
          ],
          solution:
            'A. Most automated alerts hit the Tier 1 queue, so the operator is often first, but a log ' +
            'analyst hunting or a network analyst reviewing traffic can catch it first too. There is no ' +
            'fixed rule that one seat always sees it before everyone else, and the CEO or the attacker ' +
            'are not how you want to find out.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint: 'Which answer allows that first contact can come from more than one seat?',
            },
          ],
          debrief:
            'Whoever catches it, the next move is the same: hand it off to be verified and escalated. ' +
            'That hand-off is not a one-way ladder; it runs in whatever direction confirms the attack ' +
            'and reaches the person who can act.',
          practice: [],
        },
        {
          id: 'soc.5.2',
          moduleId: 'soc.5',
          packageId: 'soc-foundations',
          order: 2,
          title: 'What was taken',
          kind: 'multiple-choice',
          goal: 'Separate noticing from understanding.',
          prompt: 'The alert is real. Who reconstructs exactly what the attacker accessed and stole?',
          teach: {
            concept:
              'Noticing is not understanding. Once an alert is escalated, the log analyst digs into the ' +
              'raw logs and builds the timeline: what was touched, when, and what left the building. ' +
              'That timeline is what the rest of the response is argued from.',
          },
          options: [
            { id: 'a', label: 'The log analyst, who builds the timeline from the logs.' },
            { id: 'b', label: 'The attacker, who knows what they took.' },
            { id: 'c', label: 'The marketing team, who know what the data is worth.' },
            { id: 'd', label: 'The SOC operator, who moves straight on to the next alert.' },
          ],
          hints: [
            'Noticing an alert is not the same as reconstructing what happened.',
            'Which seat lives in raw logs and builds timelines?',
            'The operator triaged and handed off; someone deeper does the reconstruction.',
          ],
          solution:
            'A. The log analyst reconstructs what the attacker did from the logs. The operator has ' +
            'already moved on, and the attacker and marketing are not going to tell you.',
          expectedOutput: 'Option A selected.',
          checks: [
            { type: 'choice-equals', optionIds: ['a'], hint: 'Who turns raw logs into an account of what happened?' },
          ],
          debrief:
            'The operator answers "is this worth a look"; the log analyst answers "what actually ' +
            'happened". Two different jobs, two different seats.',
          practice: [],
        },
        {
          id: 'soc.5.3',
          moduleId: 'soc.5',
          packageId: 'soc-foundations',
          order: 3,
          title: 'Whose call to cut access',
          kind: 'multiple-choice',
          goal: 'Attach the containment decision to the seat that owns it.',
          prompt:
            'The team confirms an attacker is inside. Someone must declare the incident, decide to cut ' +
            'the attacker off, and direct everyone else. Whose call is that?',
          teach: {
            concept:
              'Investigation informs the decision; someone still has to make it and own it. The ' +
              'incident response coordinator declares the incident, makes the containment calls on ' +
              'incomplete information, and directs the other seats.',
          },
          options: [
            { id: 'a', label: 'The IT team, who control the systems.' },
            { id: 'b', label: 'The incident response coordinator, who runs the response.' },
            { id: 'c', label: 'The police.' },
            { id: 'd', label: 'Whoever is the most technical person in the room.' },
          ],
          hints: [
            'Someone has to declare the incident and own the containment call.',
            'IT executes; another seat decides.',
            'It is the coordination seat, not the most technical one.',
          ],
          solution:
            'B. The incident response coordinator declares the incident and makes the call. IT carries ' +
            'it out, and being the most technical person is not the same as owning the decision.',
          expectedOutput: 'Option B selected.',
          checks: [
            { type: 'choice-equals', optionIds: ['b'], hint: 'Which seat declares the incident and directs the response?' },
          ],
          debrief:
            'Someone has to be able to say "isolate it now" on sixty percent of the picture and answer ' +
            'for it afterwards. That is the coordinator, not the person who can type fastest.',
          practice: [],
        },
        {
          id: 'soc.5.4',
          moduleId: 'soc.5',
          packageId: 'soc-foundations',
          order: 4,
          title: 'No one has the whole answer',
          kind: 'multiple-choice',
          goal: 'See why one incident needs several seats.',
          prompt:
            'A network analyst sees a server reaching out to an unknown address every hour. On their ' +
            'own, can they say for certain it is an attack?',
          teach: {
            concept:
              'The whole point of having many seats is that one incident looks different from each ' +
              'chair. The network analyst sees the connection, but needs the log analyst (what process ' +
              'is doing this?), threat intel (is that address known bad?), and the malware analyst (is ' +
              'something on the host causing it?) before anyone can be sure.',
          },
          options: [
            { id: 'a', label: 'No. They need the log analyst, threat intel, and others to confirm it.' },
            { id: 'b', label: 'Yes, a regular connection like that is always an attack.' },
            { id: 'c', label: 'Yes, they can block it and close the case alone.' },
            { id: 'd', label: 'No, because only the CEO is allowed to decide.' },
          ],
          hints: [
            'A regular outbound connection can be a backup job or an update, not just a beacon.',
            'What does the network analyst NOT know yet about the process, the address, or the host?',
            'It takes more than one seat to turn a suspicious pattern into a confirmed attack.',
          ],
          solution:
            'A. A regular outbound connection could be perfectly legitimate. Confirming it needs the ' +
            'process behind it, the reputation of the address, and whether anything on the host is ' +
            'responsible, which is three other seats. It is neither always an attack nor a one-person ' +
            'call.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint: 'Can one seat, seeing only the connection, be certain on its own?',
            },
          ],
          debrief:
            'This is why the floor has more than one chair. Each seat holds one piece of the picture, ' +
            'and a confident answer usually needs several of them at once.',
          practice: [],
        },
        {
          id: 'soc.5.5',
          moduleId: 'soc.5',
          packageId: 'soc-foundations',
          order: 5,
          title: 'The order of the response',
          kind: 'multiple-choice',
          goal: 'Get the first step of a response right.',
          prompt: 'An incident is confirmed. Which of these happens FIRST?',
          teach: {
            concept:
              'A response runs in an order for a reason: you cannot contain what you have not ' +
              'declared, and you cannot improve detection before you understand what happened. Roughly ' +
              'the sequence is declare, contain, investigate, preserve evidence, find the root cause, ' +
              'recover, and only then improve detection.',
          },
          options: [
            { id: 'a', label: 'Improve the detection rules.' },
            { id: 'b', label: 'Declare the incident and alert the team.' },
            { id: 'c', label: 'Write the final post-incident report.' },
            { id: 'd', label: 'Recover and restore the systems.' },
          ],
          hints: [
            'Two of these only make sense once the incident is understood and over.',
            'Nothing coordinated happens until the incident is actually declared.',
            'The first step makes the incident official and pulls the team in.',
          ],
          solution:
            'B. Declaring the incident and alerting the team comes first: it makes the response ' +
            'official and pulls people in. Improving detection, writing the report, and recovering all ' +
            'come later, once the incident is understood or over.',
          expectedOutput: 'Option B selected.',
          checks: [
            { type: 'choice-equals', optionIds: ['b'], hint: 'What has to happen before anything else can be coordinated?' },
          ],
          debrief:
            'Getting the order wrong is expensive: recover too early and you leave the attacker in; ' +
            'tune detection before you understand the attack and you tune for the wrong thing.',
          practice: [],
        },
        {
          id: 'soc.5.6',
          moduleId: 'soc.5',
          packageId: 'soc-foundations',
          order: 6,
          title: 'A team sport',
          kind: 'short-answer',
          goal: 'Put the hand-off in your own words.',
          prompt:
            'This attack was stopped because each role did one part and handed off to the next. In two ' +
            'or three sentences, explain why no single role could have stopped it alone.',
          teach: {
            concept:
              'Each seat holds one piece. The operator spots it, the log analyst confirms it, the ' +
              'coordinator decides, the network analyst contains it, intel and the malware analyst ' +
              'explain it, forensics preserves it, and detection engineering makes sure it is caught ' +
              'faster next time. Take any one link away and the chain breaks.',
          },
          hints: [
            'Think of it as a hand-off: each seat does one thing and passes it on.',
            'Name a couple of the different pieces (spotting, confirming, deciding, containing).',
            'Your answer should say why one person could not hold all of those pieces at once.',
          ],
          solution:
            'Stopping the attack was a chain of hand-offs: one seat spotted the alert, another ' +
            'confirmed it was real, another decided to contain it, and others explained and preserved ' +
            'it. No single person could watch the queue, reconstruct the logs, make the containment ' +
            'call, and analyse the malware all at once, so the incident needed the whole team, each ' +
            'doing one part.',
          expectedOutput:
            'An answer describing the hand-off between roles and why one person could not do every ' +
            'part alone.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['hand off', 'handoff', 'chain', 'each role', 'each seat', 'different', 'piece', 'part', 'together', 'team'],
                ['spot', 'notice', 'confirm', 'investigate', 'decide', 'contain', 'detect'],
              ],
              hint: 'Two ideas: the hand-off between roles, and one concrete thing a particular seat did.',
            },
          ],
          debrief:
            'This is the mindset the rest of the platform builds on. You will specialise into one of ' +
            'these seats, but you are always one link in a chain, and the hand-off is where incidents ' +
            'are won or lost.',
          practice: SOC_FOUNDATIONS_PRACTICE['soc.5.6'] ?? [],
        },
      ],
    },
    {
      id: 'soc.6',
      packageId: 'soc-foundations',
      order: 6,
      title: 'The tools on the floor',
      summary:
        'What a SIEM, an EDR, a SOAR and a case system each do, what none of them do, and why the ' +
        'product name on a job advert is not the skill it is asking for.',
      exercises: [
        {
          id: 'soc.6.1',
          moduleId: 'soc.6',
          packageId: 'soc-foundations',
          order: 1,
          title: 'What a SIEM actually does',
          kind: 'multiple-choice',
          goal: 'Understand the tool the SOC spends most of its day inside.',
          prompt:
            'A SIEM sits at the centre of most SOCs. Which of the following describe what one ' +
            'actually does? Select all that apply.',
          teach: {
            concept:
              'A SIEM is a place where logs from everywhere arrive, get normalised into a common ' +
              'shape, and can be searched together. That last word is the whole point. A firewall log ' +
              'and a Windows event log describe the same login in completely different vocabularies, ' +
              'and a SIEM makes them comparable so one query can cross both.\n\n' +
              'On top of that it runs saved queries continuously and raises an alert when one ' +
              'matches. That is where the queue an operator works comes from: somebody wrote a rule, ' +
              'the rule matched, and a row appeared.\n\n' +
              'What a SIEM does not do is understand anything. It has no opinion about whether a ' +
              'match matters, it only knows a pattern fired. It also cannot see what was never sent ' +
              'to it, which is the most important limitation of all: a SIEM covers exactly the ' +
              'sources somebody onboarded, and the gap between what is logged and what is collected ' +
              'is invisible from inside the tool.',
          },
          options: [
            { id: 'a', label: 'Collects logs from many different systems into one searchable place.' },
            { id: 'b', label: 'Normalises different log formats so one query can cross several sources.' },
            { id: 'c', label: 'Runs saved detection rules continuously and raises alerts when they match.' },
            { id: 'd', label: 'Understands which alerts genuinely matter, so triage is unnecessary.' },
            { id: 'e', label: 'Shows activity from systems whose logs were never sent to it.' },
          ],
          hints: [
            'Three describe collecting, normalising, and matching. Two describe abilities no product has.',
            'If a SIEM knew which alerts mattered, what would the operator be for?',
            'Ask what a tool can possibly know about a server that never sends it anything.',
          ],
          solution:
            'A, B, and C. Collect, normalise, and match saved rules: that is a SIEM, and the alerts ' +
            'it raises are the queue somebody works. D is what vendors imply and no product ' +
            'delivers, which is precisely why Tier 1 exists. E is the limitation worth carrying ' +
            'around: a SIEM sees only what was onboarded, so an attack on a system nobody connected ' +
            'is invisible, and the tool will look perfectly healthy while it happens.',
          expectedOutput: 'Options A, B, and C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c'],
              hint:
                'One option claims the tool can judge relevance. Another claims it can see systems ' +
                'that never send it data.',
            },
          ],
          debrief:
            'Coverage is the question nobody asks of a SIEM until after an incident. Knowing which ' +
            'systems are onboarded, and which are not, is a more useful thing to be able to say than ' +
            'knowing any query language.',
          practice: [],
        },
        {
          id: 'soc.6.2',
          moduleId: 'soc.6',
          packageId: 'soc-foundations',
          order: 2,
          title: 'Which tool answers which question',
          kind: 'multiple-choice',
          goal: 'Reach for the right source instead of the familiar one.',
          prompt:
            'Four questions come up during a shift. Which of these pair a question with a tool that ' +
            'can actually answer it? Select all that apply.',
          teach: {
            concept:
              'The tools on a SOC floor overlap enough to be confusing and are not interchangeable.\n\n' +
              'A SIEM answers questions ACROSS systems and over time: has this address touched ' +
              'anything else, did this pattern happen before, what else occurred in that ten ' +
              'minutes. Its strength is breadth and history.\n\n' +
              'An EDR answers questions about ONE ENDPOINT in depth: which process started which, ' +
              'what a binary did after it ran, what it touched on disk. Its strength is the detail ' +
              'a log summary throws away, and modern EDR can also act, isolating a machine from the ' +
              'console.\n\n' +
              'A case or ticketing system answers questions about the WORK: what was decided, by ' +
              'whom, when, and what happened next. It is the only one of the three that remembers ' +
              'why a human did something, which is why it is the artefact an audit asks for.\n\n' +
              'Reaching for the tool you know rather than the tool that holds the answer is the ' +
              'most common way an hour disappears.',
          },
          options: [
            { id: 'a', label: 'Has this external address been seen anywhere else in the estate this month: the SIEM.' },
            { id: 'b', label: 'Which process spawned the suspicious binary on this laptop: the EDR.' },
            { id: 'c', label: 'Who decided not to escalate this alert last Tuesday, and why: the case system.' },
            { id: 'd', label: 'Isolate this endpoint from the network right now: the EDR.' },
            { id: 'e', label: 'What the encrypted payload of that outbound connection contained: the SIEM.' },
          ],
          hints: [
            'Four pair correctly. One asks a tool for something it never had.',
            'Ask what each tool physically records, and at what level of detail.',
            'A log line records that a connection happened. Does it record what went through it?',
          ],
          solution:
            'A, B, C, and D. Breadth and history from the SIEM, endpoint depth and response from the ' +
            'EDR, and the record of human decisions from the case system. E is the misplacement: a ' +
            'SIEM holds a summary that a connection occurred, not its contents, and if the traffic ' +
            'was encrypted then even full packet capture would not hand you the payload. The honest ' +
            'answer to that question is usually that it cannot be established from what exists.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option asks a log aggregator for the contents of an encrypted connection.',
            },
          ],
          debrief:
            'Before you start searching, say out loud which tool should hold the answer. It takes ' +
            'five seconds and it is the difference between a five-minute question and a lost morning.',
          practice: [],
        },
        {
          id: 'soc.6.3',
          moduleId: 'soc.6',
          packageId: 'soc-foundations',
          order: 3,
          title: 'What should be automated',
          kind: 'multiple-choice',
          goal: 'Tell the work a machine should take from the work it must not.',
          prompt:
            'Your SOC is introducing automation. Which of the following are good candidates? Select ' +
            'all that apply.',
          teach: {
            concept:
              'Automation in a SOC, often sold as SOAR, is worth exactly as much as the judgement it ' +
              'frees up. The rule for what to automate is simple: work that is repetitive, that has ' +
              'one correct answer, and whose failure is cheap and visible.\n\n' +
              'That covers a lot. Enriching an alert with the things an operator would look up ' +
              'anyway, gathering context from three systems into one view, opening and routing a ' +
              'ticket, closing a class of alert that is known benign and provably so. All of that is ' +
              'clerical work that a person is slower and no better at.\n\n' +
              'What must not be automated is the judgement, and specifically anything irreversible ' +
              'made on an inference. Automatically disabling a user account on a single medium ' +
              'confidence alert will eventually lock out a surgeon mid-shift, and the cost of that ' +
              'is not paid by the SOC. The test is whether a wrong decision can be undone cheaply. ' +
              'Enrichment that is wrong wastes a minute; containment that is wrong stops a hospital.',
          },
          options: [
            { id: 'a', label: 'Enriching every alert with the context an operator would have looked up anyway.' },
            { id: 'b', label: 'Opening a ticket and routing it to the right queue.' },
            { id: 'c', label: 'Closing a specific alert class that has been proven benign, with a record of each closure.' },
            { id: 'd', label: 'Disabling any user account that triggers a medium confidence alert.' },
            { id: 'e', label: 'Deciding whether an ambiguous alert is a real incident, so nobody has to read it.' },
          ],
          hints: [
            'Three are clerical work with one right answer. Two are judgement, and one of those is also irreversible.',
            'Ask what it costs when the automation is wrong, and who pays it.',
            'If a machine could reliably do the last one, the whole triage tier would not exist.',
          ],
          solution:
            'A, B, and C. Enrichment, routing, and provable auto-closure are repetitive, have one ' +
            'right answer, and fail cheaply. D is the one that gets a SOC into trouble: it acts ' +
            'irreversibly on an inference, and the day it disables the wrong account during a ' +
            'clinical shift is the day automation gets switched off entirely. E is the judgement the ' +
            'tier exists to apply; automating it does not remove the decision, it just makes it ' +
            'silently and with nobody accountable.',
          expectedOutput: 'Options A, B, and C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c'],
              hint:
                'One option takes an irreversible action on a medium confidence signal. Another ' +
                'automates the judgement the triage tier exists for.',
            },
          ],
          debrief:
            'Note what C carries with it: a record of each closure. Automation you cannot audit is ' +
            'indistinguishable from alerts being dropped, and one of those is a decision while the ' +
            'other is a gap.',
          practice: [],
        },
        {
          id: 'soc.6.4',
          moduleId: 'soc.6',
          packageId: 'soc-foundations',
          order: 4,
          title: 'The ticket is the product',
          kind: 'short-answer',
          goal: 'Say why the written record is the deliverable, not a chore attached to one.',
          prompt:
            'A new operator says the ticketing system slows them down and they would clear more ' +
            'alerts without it. In three or four sentences, explain why the ticket matters.',
          teach: {
            concept:
              'It is easy to think the work is the investigation and the ticket is admin. It is the ' +
              'other way round: the investigation happens in somebody head and disappears, and the ' +
              'ticket is the only part that survives to be used by anybody else.\n\n' +
              'Three things depend on it. CONTINUITY: shifts hand over, and the next operator either ' +
              'reads what you found or starts again. PATTERN: one alert closed as benign is noise, ' +
              'but forty tickets closed for the same reason is a tuning case somebody can act on, ' +
              'and that pattern only exists if the reasons were written down. And ACCOUNTABILITY: ' +
              'when an incident is reviewed months later, the question is what was known and decided ' +
              'at the time, and an undocumented decision is indistinguishable from no decision.\n\n' +
              'A good answer names at least the handover or continuity value, the pattern that only ' +
              'emerges across many records, and the fact that the ticket is what an audit or review ' +
              'actually reads.',
          },
          hints: [
            'Ask what remains of the work an hour after the operator goes home.',
            'One alert closed tells you nothing. What do forty closed for the same reason tell you?',
            'A good answer names the handover, the pattern that only shows up across many tickets, and the review or audit that reads them later.',
          ],
          solution:
            'Clearing alerts faster with no record means the work exists only in the head of whoever ' +
            'did it, so the next shift cannot pick up an open thread and has to start again. The ' +
            'record is also the only place patterns live: one alert closed as benign says nothing, ' +
            'while forty closed for the same reason is a tuning case that removes the noise ' +
            'permanently, and that case cannot be made if nobody wrote the reasons down. And when an ' +
            'incident is reviewed later, what gets read is the ticket: a decision nobody documented ' +
            'cannot be defended, however sound it was at the time. The throughput gained by skipping ' +
            'it is real and it is borrowed from everybody who comes after.',
          expectedOutput:
            'An answer naming continuity across shifts, the pattern that only emerges across many ' +
            'records, and the later review or audit that depends on the written decision.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['next shift', 'handover', 'hand over', 'continuity', 'somebody else', 'pick up', 'start again'],
                ['pattern', 'tuning', 'forty', 'many', 'across', 'trend', 'repeated'],
                ['review', 'audit', 'later', 'defend', 'accountab', 'months'],
              ],
              hint:
                'Three ideas: what the next shift needs, what only shows up across many tickets, and ' +
                'who reads them long afterwards.',
            },
          ],
          debrief:
            'Operators who write good tickets get noticed faster than operators who close more of ' +
            'them, because the ticket is the only part of the work a manager can actually see.',
          practice: [],
        },
        {
          id: 'soc.6.5',
          moduleId: 'soc.6',
          packageId: 'soc-foundations',
          order: 5,
          title: 'The product name is not the skill',
          kind: 'multiple-choice',
          goal: 'Read a tool requirement on a job advert for what it really asks.',
          prompt:
            'An advert asks for three years of Splunk. You have never opened Splunk. Which of the ' +
            'following are accurate? Select all that apply.',
          teach: {
            concept:
              'Job adverts name products because whoever wrote the advert named the product the team ' +
              'happens to own. What the team actually needs is somebody who can take a question and ' +
              'turn it into a search, read what comes back, and know when the answer is wrong.\n\n' +
              'That skill transfers almost completely. The query languages differ in syntax and are ' +
              'the same in shape: filter to the events you care about, extract a field, group and ' +
              'count, sort. Somebody fluent in one is productive in another within about a week, and ' +
              'every hiring manager who has done the job knows it.\n\n' +
              'Two honest caveats. Product familiarity is worth real money at interview, so getting ' +
              'hands on a free tier and being able to say you have used it is worth an evening. And ' +
              'a hard requirement is sometimes genuinely hard, usually because of a contract or a ' +
              'certification the employer has to evidence. Read the advert, apply anyway, and name ' +
              'the transferable skill rather than pretending to the product.',
          },
          options: [
            { id: 'a', label: 'The underlying skill, turning a question into a search and reading the result, transfers between platforms.' },
            { id: 'b', label: 'Query languages differ in syntax but share a shape: filter, extract, group, count, sort.' },
            { id: 'c', label: 'Hands-on time in a free tier is worth having, because naming the product credibly matters at interview.' },
            { id: 'd', label: 'It is worth applying and describing the transferable skill rather than ruling yourself out.' },
            { id: 'e', label: 'Since the skill transfers, it is fine to claim three years of Splunk on the application.' },
          ],
          hints: [
            'Four are accurate. One turns a true observation about skills into a false claim about your history.',
            'Ask what happens in the interview when somebody who does use Splunk asks a follow-up question.',
            'There is a real difference between "I have not used that product and here is what I have done" and a claim that is not true.',
          ],
          solution:
            'A, B, C, and D. The skill transfers, the languages rhyme, an evening in a free tier ' +
            'buys credibility, and applying while naming what you can actually do is the right move. ' +
            'E is not a shortcut, it is a lie that fails at the first specific question and costs you ' +
            'the reference as well as the role. The strong version of this answer at interview is ' +
            'plain: you have not used that product, here is the equivalent work you have done, and ' +
            'here is how long you think it would take you to be useful in theirs.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option converts "the skill transfers" into a claim about experience you do not ' +
                'have.',
            },
          ],
          debrief:
            'This is the single most common reason career changers do not apply for roles they would ' +
            'get. The product list is a description of the toolbox, not a description of the person.',
          practice: [],
        },
      ],
    },
    {
      id: 'soc.7',
      packageId: 'soc-foundations',
      order: 7,
      title: 'Working the shift',
      summary:
        'What shift work costs, what alert fatigue really is, the metrics that improve a SOC and the ' +
        'ones that quietly wreck it, and what a good quiet day looks like.',
      exercises: [
        {
          id: 'soc.7.1',
          moduleId: 'soc.7',
          packageId: 'soc-foundations',
          order: 1,
          title: 'What the rota costs',
          kind: 'multiple-choice',
          goal: 'Understand shift work as a life decision before you accept one.',
          prompt:
            'You are considering a Tier 1 role on a 24 by 7 rota. Which of the following are ' +
            'accurate? Select all that apply.',
          teach: {
            concept:
              'Most Tier 1 SOC roles cover nights and weekends, because attacks do not keep office ' +
              'hours. That is a fact about the job worth knowing before you take it rather than ' +
              'after, and it is the single most common reason people leave a first security role ' +
              'that they were otherwise good at.\n\n' +
              'The trade is real in both directions. Shift work pays more, often substantially, and ' +
              'night shifts are quieter, which means more time to read and learn than a day operator ' +
              'ever gets. Many people do a year of it deliberately, learn faster than their peers, ' +
              'and move to a business hours role afterwards.\n\n' +
              'The costs are equally real and are not evenly distributed. Rotating shifts are harder ' +
              'on health and on anybody with caring responsibilities or a partner on a fixed ' +
              'schedule. A fixed night rota is often easier to live with than one that rotates every ' +
              'week. Ask which pattern the team actually runs, because the advert will not say.',
          },
          options: [
            { id: 'a', label: 'Most Tier 1 roles involve nights and weekends, because monitoring is continuous.' },
            { id: 'b', label: 'Shift roles usually pay more than the equivalent business hours role.' },
            { id: 'c', label: 'Night shifts are typically quieter, which can mean more time to learn.' },
            { id: 'd', label: 'A fixed pattern is usually easier to live with than one that rotates every week.' },
            { id: 'e', label: 'Shift work suits everybody equally, so it is not worth asking about before accepting.' },
          ],
          hints: [
            'Four are accurate. One treats a significant life decision as a detail.',
            'Ask who in a household is affected by a rota, not just the person working it.',
            'The advert will tell you the salary. What will it not tell you?',
          ],
          solution:
            'A, B, C, and D. Continuous monitoring means somebody is awake, the premium is real, the ' +
            'quiet hours are a genuine learning opportunity, and a fixed pattern is easier on the ' +
            'body and the household than a rotating one. E is the answer that costs people a year: ' +
            'shift work affects health, relationships, and childcare very unevenly, and the pattern ' +
            'is a fair and normal thing to ask about in a first interview. Nobody will think less of ' +
            'you for it.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option says the rota is not worth asking about, which is the assumption that ' +
                'ends a lot of first security jobs.',
            },
          ],
          debrief:
            'Ask three questions at interview: is the pattern fixed or rotating, how many people ' +
            'cover the night, and what happens when somebody is off sick. The answers tell you more ' +
            'about the team than anything on the advert.',
          practice: [],
        },
        {
          id: 'soc.7.2',
          moduleId: 'soc.7',
          packageId: 'soc-foundations',
          order: 2,
          title: 'Hand the shift over',
          kind: 'short-answer',
          goal: 'Write a handover that leaves the next operator ready rather than curious.',
          prompt:
            'Your shift ends. One alert is still open and waiting on a reply from a user, a second ' +
            'was escalated an hour ago, and a noisy detection has fired eleven times and been closed ' +
            'each time. In three or four sentences, write the handover.',
          teach: {
            concept:
              'A shift handover is not a summary of your shift. It is a briefing for somebody who is ' +
              'about to become responsible, and it is written for their next hour rather than about ' +
              'your last eight.\n\n' +
              'Three things go in it. WHAT IS LIVE AND WAITING ON SOMETHING, with what it is waiting ' +
              'for, so the incoming operator knows what to chase rather than discovering it at ' +
              'midnight. WHAT HAS BEEN ESCALATED AND TO WHOM, so nobody escalates it twice or ' +
              'assumes somebody has it. And ANYTHING RECURRING, because a detection that has fired ' +
              'eleven times is not eleven alerts, it is one tuning problem, and saying so stops the ' +
              'next person working it again from scratch.\n\n' +
              'Leave out everything that is finished and unremarkable. A handover that lists all ' +
              'forty alerts you closed is a handover nobody reads, which is functionally the same as ' +
              'not writing one.',
          },
          hints: [
            'Write for their next hour, not about your last eight.',
            'The eleven firings are not eleven pieces of news. What are they, in one sentence?',
            'A good handover says what is open and what it waits on, who has the escalated item, and flags the recurring detection as one tuning issue.',
          ],
          solution:
            'One alert is open and waiting on a reply from the user about whether they recognise the ' +
            'login, so it needs chasing if nothing arrives by mid-shift rather than being reworked. ' +
            'A second was escalated to Tier 2 an hour ago and is with them, so it does not need ' +
            'picking up here unless they come back with questions. The third thing is not really an ' +
            'alert: one detection has fired eleven times tonight and been closed as benign every ' +
            'time, which is a tuning case rather than eleven separate pieces of work, and I have ' +
            'raised it with detection engineering. Nothing else from the shift needs carrying ' +
            'forward.',
          expectedOutput:
            'A handover naming the open alert and what it waits on, the escalation and who holds it, ' +
            'and the recurring detection framed as a single tuning problem.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['waiting', 'waits on', 'chase', 'reply', 'open'],
                ['escalated', 'tier 2', 'with them', 'handed to', 'holds it'],
                ['tuning', 'one issue', 'same detection', 'recurring', 'not eleven', 'single'],
              ],
              hint:
                'Three things: what is open and what it needs, who holds the escalation, and the ' +
                'recurring detection stated as one problem rather than eleven.',
            },
          ],
          debrief:
            'The eleven firings are the part most people get wrong. Reporting them as eleven alerts ' +
            'is accurate and useless; reporting them as one tuning case is what gets the noise ' +
            'removed for everybody.',
          practice: [],
        },
        {
          id: 'soc.7.3',
          moduleId: 'soc.7',
          packageId: 'soc-foundations',
          order: 3,
          title: 'Alert fatigue is not laziness',
          kind: 'multiple-choice',
          goal: 'Recognise the failure mode that hits every high-volume queue, and what actually fixes it.',
          prompt:
            'A team is closing alerts faster and faster, and has started missing real ones. Which of ' +
            'the following are accurate? Select all that apply.',
          teach: {
            concept:
              'Alert fatigue is what happens to any human working a queue that is overwhelmingly ' +
              'false. After several hundred alerts that turned out to be nothing, the brain stops ' +
              'genuinely assessing each one and starts pattern-matching to the outcome it expects, ' +
              'which is closure. It happens to conscientious people, it happens quickly, and it is ' +
              'not a character flaw.\n\n' +
              'It also does not respond to the interventions managers reach for first. Telling people ' +
              'to be more careful does nothing, because they are already trying. Adding a second ' +
              'reviewer doubles the cost and produces two fatigued people. Measuring throughput makes ' +
              'it worse by rewarding exactly the behaviour causing the misses.\n\n' +
              'What works is reducing the volume: tuning the detections that produce the noise, ' +
              'automating provable benign closures, and giving the queue a realistic size. That is ' +
              'why tuning is a first-class activity in a healthy SOC rather than something done when ' +
              'there is time, and why an operator who documents why an alert was benign is doing the ' +
              'work that eventually fixes it.',
          },
          options: [
            { id: 'a', label: 'It is a predictable response to a queue that is mostly false positives, not a lack of diligence.' },
            { id: 'b', label: 'Tuning the noisiest detections addresses the cause rather than the symptom.' },
            { id: 'c', label: 'Measuring operators on alerts closed per hour makes it worse.' },
            { id: 'd', label: 'Well documented benign closures are what make the tuning case possible.' },
            { id: 'e', label: 'The fix is to tell the team to be more careful and review their work more closely.' },
          ],
          hints: [
            'Four are accurate. One is the intervention that gets tried first and never works.',
            'Ask whether the people missing alerts are failing to try.',
            'What behaviour does a throughput metric reward, and is it the behaviour you want?',
          ],
          solution:
            'A, B, C, and D. It is a predictable consequence of volume, the cause is the noise, ' +
            'throughput metrics accelerate it, and the documented closures are the raw material for ' +
            'fixing it. E is the response that feels like management and changes nothing: the team ' +
            'is already being careful, and asking for more care without reducing the volume just ' +
            'adds guilt to a workload problem. If you find yourself on a queue like this, the useful ' +
            'thing you can do is write down why each one was benign, because that is what turns your ' +
            'experience into somebody tuning the rule.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option treats a volume problem as an attitude problem.',
            },
          ],
          debrief:
            'If you ever run a queue, watch the false positive rate rather than the closure rate. ' +
            'One of those numbers tells you whether the work is possible; the other tells you how ' +
            'fast people are giving up on it.',
          practice: [],
        },
        {
          id: 'soc.7.4',
          moduleId: 'soc.7',
          packageId: 'soc-foundations',
          order: 4,
          title: 'Metrics that help and metrics that harm',
          kind: 'multiple-choice',
          goal: 'Judge a proposed SOC metric by the behaviour it will produce.',
          prompt:
            'Leadership wants to measure the SOC. Which of these metrics would improve it? Select ' +
            'all that apply.',
          teach: {
            concept:
              'Every metric is an instruction, whatever it was intended as. People optimise what is ' +
              'measured, so the only useful question about a proposed metric is what behaviour it ' +
              'will produce when somebody is under pressure to move it.\n\n' +
              'Good SOC metrics point at the outcome rather than the activity. How long until a real ' +
              'incident was detected, and until it was contained, both measure the thing the SOC ' +
              'exists for. The proportion of alerts that turn out to be false measures whether the ' +
              'queue is workable at all. Detection coverage against a framework measures whether you ' +
              'can see the attacks that matter.\n\n' +
              'Bad ones measure activity and are trivially gamed. Alerts closed per operator per ' +
              'hour rewards fast closure regardless of correctness, which is the exact behaviour ' +
              'behind missed incidents. Number of alerts generated rewards noisy detections. Both ' +
              'produce charts that improve while the SOC gets worse, which is the worst possible ' +
              'outcome because it removes the pressure to fix anything.',
          },
          options: [
            { id: 'a', label: 'Time from an incident starting to it being detected.' },
            { id: 'b', label: 'Time from detection to containment.' },
            { id: 'c', label: 'The proportion of alerts that turn out to be false positives.' },
            { id: 'd', label: 'Detection coverage measured against a framework such as ATT&CK.' },
            { id: 'e', label: 'Alerts closed per operator per hour.' },
          ],
          hints: [
            'Four measure outcomes. One measures speed of closure.',
            'For each one, ask what somebody would do to improve the number if they were being judged on it.',
            'Which of these could improve every quarter while the SOC gets steadily worse?',
          ],
          solution:
            'A, B, C, and D. Detection time and containment time measure what the SOC is for, the ' +
            'false positive rate measures whether the work is possible, and coverage measures whether ' +
            'you can see what matters. E is the one to argue against, and the argument is not that ' +
            'throughput is unimportant but that it is trivially improved by closing things without ' +
            'reading them. A team measured on it will look better on the chart every quarter until ' +
            'the incident nobody read goes public.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option measures how fast alerts are closed rather than whether they were ' +
                'handled correctly.',
            },
          ],
          debrief:
            'You will be measured on something. Being able to say what a metric will do to behaviour ' +
            'is a senior skill and it is worth practising long before anybody asks your opinion.',
          practice: [],
        },
        {
          id: 'soc.7.5',
          moduleId: 'soc.7',
          packageId: 'soc-foundations',
          order: 5,
          title: 'A good quiet shift',
          kind: 'short-answer',
          goal: 'Say what productive looks like on a night when nothing happens.',
          prompt:
            'You are on a night shift and nothing is happening. In three or four sentences, say what ' +
            'you would do with the time, and why that is the job rather than a way of filling it.',
          teach: {
            concept:
              'Most shifts contain no incident, and what an operator does with the quiet hours is ' +
              'most of what separates somebody who is promoted in a year from somebody still on the ' +
              'same queue in three.\n\n' +
              'The productive uses are all forms of turning experience into something durable. ' +
              'Reading back through recent closed alerts to see what you would decide differently ' +
              'now. Documenting a noisy detection well enough that somebody can tune it. Learning ' +
              'the environment: which servers exist, what normal traffic looks like, where the ' +
              'crown jewels are, so that when something is abnormal you recognise it instead of ' +
              'having to derive it. Following up threads from earlier shifts that were left open.\n\n' +
              'The thing that makes all of that the job rather than self-improvement is that a quiet ' +
              'queue is not evidence of safety, it is the only time available to get better at ' +
              'noticing. An operator who knows the estate spots the odd thing in seconds; one who ' +
              'does not never spots it at all.',
          },
          hints: [
            'A quiet queue is not evidence that nothing is happening. What does that suggest is worth doing?',
            'Think about what would make the next busy shift faster.',
            'A good answer names learning the environment or what normal looks like, reviewing past alerts or tuning noisy detections, and connects it to catching things faster later.',
          ],
          solution:
            'A quiet queue is not evidence that nothing is wrong, so the first use of the time is ' +
            'learning the environment: which systems exist, what normal traffic and normal login ' +
            'patterns look like, and where the data worth stealing actually lives. The second is ' +
            'going back over recently closed alerts to see whether I would still close them the same ' +
            'way, and writing up any detection that keeps firing benign so somebody can tune it. ' +
            'Both of those make the next busy shift faster, because recognising an abnormality is ' +
            'only possible if you already know what normal looks like. Filling the time with ' +
            'anything else is the version of this job where you are still on the same queue in three ' +
            'years.',
          expectedOutput:
            'An answer naming learning the environment or baseline normal, reviewing past alerts or ' +
            'documenting noisy detections, and connecting both to faster recognition later.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['normal', 'baseline', 'environment', 'estate', 'what systems', 'learn the'],
                ['review', 'go back', 'closed alerts', 'tuning', 'document', 'write up'],
                ['faster', 'recognise', 'spot', 'next time', 'later', 'catch'],
              ],
              hint:
                'Three ideas: learning what normal looks like, reviewing or documenting past work, ' +
                'and why both pay off when something real arrives.',
            },
          ],
          debrief:
            'Every experienced analyst can name the quiet month where they learned the network. It ' +
            'is the least visible and most valuable thing you will do in a first year.',
          practice: [],
        },
      ],
    },
    {
      id: 'soc.8',
      packageId: 'soc-foundations',
      order: 8,
      title: 'Getting in, and getting on',
      summary:
        'What a first interview is really testing, where certifications help and where they do not, ' +
        'how to talk about work you have done, and the routes out of Tier 1.',
      exercises: [
        {
          id: 'soc.8.1',
          moduleId: 'soc.8',
          packageId: 'soc-foundations',
          order: 1,
          title: 'What the interview is testing',
          kind: 'multiple-choice',
          goal: 'Understand what a hiring manager is actually looking for in a Tier 1 candidate.',
          prompt:
            'You have an interview for a first SOC role. Which of the following are the panel ' +
            'actually assessing? Select all that apply.',
          teach: {
            concept:
              'Nobody hiring for Tier 1 expects you to know their environment, their tooling, or ' +
              'much of their threat landscape. They expect to teach you all of that. What they ' +
              'cannot teach quickly is how you think, so that is what the questions are for.\n\n' +
              'Four things are being assessed. STRUCTURED REASONING: given an ambiguous alert, do you ' +
              'ask sensible questions in a sensible order, or guess. HONESTY UNDER UNCERTAINTY: can ' +
              'you say you do not know and describe how you would find out, which is the single ' +
              'strongest answer available to a junior. CURIOSITY: have you looked at anything on your ' +
              'own, and can you talk about it. And RELIABILITY: a rota depends on people turning up ' +
              'and doing what they said, and a SOC will take a dependable learner over a brilliant ' +
              'one every time.\n\n' +
              'What they are not assessing is whether you can recite port numbers. Some interviewers ' +
              'still ask; the answer matters far less than what you do when you hit one you do not ' +
              'know.',
          },
          options: [
            { id: 'a', label: 'Whether you reason through an ambiguous situation in a sensible order.' },
            { id: 'b', label: 'Whether you can say you do not know and describe how you would find out.' },
            { id: 'c', label: 'Whether you have looked into anything on your own initiative.' },
            { id: 'd', label: 'Whether you are dependable, because a rota falls apart without that.' },
            { id: 'e', label: 'Whether you can recall port numbers and acronyms from memory under pressure.' },
          ],
          hints: [
            'Four are about how you think and work. One is about recall.',
            'Ask which of these a good employer can teach you in a month.',
            'What is the strongest possible answer to a question you genuinely cannot answer?',
          ],
          solution:
            'A, B, C, and D. Reasoning, honesty, curiosity, and dependability are the things that ' +
            'cannot be taught in the first month, so they are what gets assessed. E is the one ' +
            'candidates over-prepare and interviewers weight least: a port number is a lookup, and a ' +
            'candidate who says they would check and then explains how they would confirm it looks ' +
            'better than one who recites it and cannot reason. If you take one thing into an ' +
            'interview, take a worked example of something you investigated and can talk through ' +
            'step by step.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option is pure recall, which is the thing a search engine does and an interview ' +
                'weights least.',
            },
          ],
          debrief:
            'Practise saying "I do not know, here is how I would find out" out loud until it is ' +
            'comfortable. It is the answer that separates candidates, and almost nobody rehearses it.',
          practice: [],
        },
        {
          id: 'soc.8.2',
          moduleId: 'soc.8',
          packageId: 'soc-foundations',
          order: 2,
          title: 'Where a certification helps',
          kind: 'multiple-choice',
          goal: 'Spend certification money and time where it actually changes an outcome.',
          prompt:
            'You are deciding whether to take an entry-level certification. Which of the following ' +
            'are accurate? Select all that apply.',
          teach: {
            concept:
              'Certifications do one job well: they get a CV past a filter. Many organisations, and ' +
              'nearly all government and defence work, screen on them before a human reads anything, ' +
              'so in those places a missing certificate is a wall rather than a preference.\n\n' +
              'They also give a structured syllabus to somebody who does not yet know what they do ' +
              'not know, which is genuinely valuable when you are starting and have no map.\n\n' +
              'What they do not do is demonstrate that you can do the work. Everybody on the panel ' +
              'knows the exam is multiple choice, so a certificate opens the conversation and ' +
              'evidence wins it: something you built, an investigation you can walk through, a ' +
              'home lab, a write-up. The strongest position for a career changer is a screening ' +
              'certificate plus one piece of work you can talk about in detail, and the second half ' +
              'is what people skip.',
          },
          options: [
            { id: 'a', label: 'They get a CV past automated and HR screening, which is a real barrier in many places.' },
            { id: 'b', label: 'Some sectors, particularly government and defence, make specific certificates mandatory.' },
            { id: 'c', label: 'They provide a structured syllabus when you do not yet know what you do not know.' },
            { id: 'd', label: 'They do not demonstrate you can do the work, so evidence of actual work still matters.' },
            { id: 'e', label: 'Holding several certificates is a substitute for having anything to show.' },
          ],
          hints: [
            'Four are accurate. One treats certificates as a replacement for evidence.',
            'Ask what a panel does after the certificate has got you into the room.',
            'What can somebody who has passed an exam still not prove?',
          ],
          solution:
            'A, B, C, and D. They pass filters, they are genuinely mandatory in parts of the public ' +
            'sector, they give a beginner a map, and they do not show you can do the job. E is the ' +
            'trap that costs career changers a year and a lot of money: a stack of certificates with ' +
            'nothing to show reads as somebody who studies rather than somebody who does. One ' +
            'screening certificate plus one piece of work you can walk through beats four ' +
            'certificates and nothing every time.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option offers certificates as a substitute for demonstrable work.',
            },
          ],
          debrief:
            'If you are choosing between a second certificate and finishing something you can ' +
            'demonstrate, finish the thing. The certificate gets you read; the work gets you hired.',
          practice: [],
        },
        {
          id: 'soc.8.3',
          moduleId: 'soc.8',
          packageId: 'soc-foundations',
          order: 3,
          title: 'Talk about work you have done',
          kind: 'short-answer',
          goal: 'Describe an investigation so a panel can hear the reasoning rather than the result.',
          prompt:
            'An interviewer asks you to walk through something you have investigated. In three or ' +
            'four sentences, describe how you would structure that answer, whatever the subject was.',
          teach: {
            concept:
              'Candidates answer this question by describing what they found, which is the least ' +
              'interesting part. The panel already assumes the exercise worked out; they are ' +
              'listening for how you got there.\n\n' +
              'A strong answer has four moves. THE QUESTION you were trying to answer, stated ' +
              'plainly, because a specific starting question shows you were not just clicking about. ' +
              'WHAT YOU LOOKED AT AND WHY THAT SOURCE, which is where reasoning becomes visible. ' +
              'WHAT SURPRISED YOU or turned out wrong, which is the most credible thing a junior can ' +
              'say and almost nobody says it. And WHAT YOU CONCLUDED, with its limits: what you could ' +
              'establish and what remained unknown.\n\n' +
              'It does not need to be a real breach. A home lab, an exercise, or a public dataset is ' +
              'completely acceptable, and being straightforward about that is far stronger than ' +
              'dressing it up as something it was not.',
          },
          hints: [
            'The panel assumes you found the answer. What are they actually listening for?',
            'One of the four moves is the one nobody makes, and it is the most convincing.',
            'A good answer starts from the question being asked, explains why each source was chosen, includes what turned out wrong, and ends with a conclusion and its limits.',
          ],
          solution:
            'I would start with the question I was actually trying to answer, stated in one sentence, ' +
            'because that shows the work had a direction rather than being a tour of the tooling. ' +
            'Then what I looked at and why I chose that source over another, since that is where the ' +
            'reasoning is visible to somebody who cannot see my screen. I would deliberately include ' +
            'something that surprised me or that I initially got wrong and had to correct, because ' +
            'that is more credible than a clean narrative and it shows I check myself. And I would ' +
            'finish with what I concluded and what I could not establish, being clear that it was a ' +
            'lab exercise rather than implying it was a real incident.',
          expectedOutput:
            'An answer structured around the starting question, the sources chosen and why, something ' +
            'that went wrong or surprised them, and a conclusion stated with its limits.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['question', 'what I was trying', 'starting', 'direction', 'goal'],
                ['why', 'chose', 'source', 'looked at', 'reasoning'],
                ['wrong', 'surprised', 'corrected', 'did not expect', 'mistake', 'check myself'],
                ['could not establish', 'limits', 'concluded', 'unknown', 'lab'],
              ],
              hint:
                'Four moves: the question, the sources and why, what went wrong, and the conclusion ' +
                'with its limits.',
            },
          ],
          debrief:
            'The third move is the one that gets people hired. A candidate who describes correcting ' +
            'their own mistake is describing the single most useful habit in this job.',
          practice: [],
        },
        {
          id: 'soc.8.4',
          moduleId: 'soc.8',
          packageId: 'soc-foundations',
          order: 4,
          title: 'Where Tier 1 leads',
          kind: 'multiple-choice',
          goal: 'See the routes out of the queue before you are standing in it.',
          prompt:
            'Which of the following are realistic progressions from a Tier 1 SOC role? Select all ' +
            'that apply.',
          teach: {
            concept:
              'Tier 1 is a starting position and it is meant to be left. It is unusually good as a ' +
              'first role because it exposes you to the whole estate and to every kind of alert, ' +
              'which means you find out what you actually like doing rather than guessing.\n\n' +
              'The common routes out are visible from the floor. Tier 2 and incident response, for ' +
              'people who want the investigation rather than the triage. Detection engineering, for ' +
              'people who keep noticing that a rule is wrong and want to fix it, which is a natural ' +
              'move for anybody who has been documenting benign closures. Threat intelligence, for ' +
              'people drawn to the actor rather than the event. Threat hunting, which usually wants ' +
              'a couple of years of pattern recognition first. And out of the SOC entirely into ' +
              'security engineering, cloud security, or GRC.\n\n' +
              'What does not happen is jumping straight into the specialist seats with no operational ' +
              'grounding. It is not gatekeeping: the specialisms all depend on knowing what normal ' +
              'looks like, and the queue is where that is learned.',
          },
          options: [
            { id: 'a', label: 'Tier 2 and incident response, for people who prefer the investigation to the triage.' },
            { id: 'b', label: 'Detection engineering, which is a natural move for somebody who keeps finding rules that are wrong.' },
            { id: 'c', label: 'Threat intelligence or threat hunting, usually after a couple of years of pattern recognition.' },
            { id: 'd', label: 'Out of the SOC entirely, into security engineering, cloud security, or risk and governance.' },
            { id: 'e', label: 'Straight into a senior specialist role, since the queue teaches nothing worth keeping.' },
          ],
          hints: [
            'Four are real routes people take. One dismisses the thing that makes the specialisms possible.',
            'Ask what every specialism depends on knowing.',
            'Where do you learn what normal looks like, if not on the queue?',
          ],
          solution:
            'A, B, C, and D. All four are routes people actually take, and B is worth noticing ' +
            'because it starts from something you can do on day one: documenting why alerts were ' +
            'benign is the beginning of detection engineering. E is wrong on both counts. The ' +
            'specialisms depend on knowing what normal traffic, normal logins, and normal noise look ' +
            'like across a real estate, and Tier 1 is where that is learned faster than anywhere ' +
            'else. Treating it as time to be endured is how people spend two years there and learn ' +
            'one year of things.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option treats the queue as time wasted rather than as where the specialisms get ' +
                'their foundation.',
            },
          ],
          debrief:
            'Pick a direction in your first six months and start bending your spare time towards it. ' +
            'The people who move fastest are the ones who chose, not the ones who waited to be ' +
            'chosen.',
          practice: [],
        },
      ],
    },
  ],
};
