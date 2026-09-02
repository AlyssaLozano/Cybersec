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
 */

import type { LearningPackage } from '@soc/shared';

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
              conceptGroups: [
                ['log', 'timeline', 'correlat', 'parse', 'events'],
                ['embed', 'inside', 'within', 'on the floor', 'part of the soc', 'speed', 'fast'],
                ['outside', 'separate', 'data', 'platform', 'engineering', 'shared', 'whole business'],
              ],
              hint:
                'Three ideas: what the log analyst produces, a reason to keep it inside the SOC, and ' +
                'a reason to run it as a separate team.',
            },
          ],
          debrief:
            'There is no single right home for the role. Knowing that a title can mean either ' +
            'placement is the difference between an interview where you ask the right question about ' +
            'the team, and one where you find out on your first day.',
          practice: [],
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
          practice: [],
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
              conceptGroups: [
                ['rule', 'automate', 'write', 'engineer', 'detection logic', 'tune'],
                ['intel', 'adversary', 'campaign', 'indicator', 'research', 'attribution'],
                ['hunt', 'proactive', 'hypothesis', 'search', 'no alert', 'assume breach'],
              ],
              hint: 'Three distinct ideas: automating detection, researching the adversary, and hunting by hypothesis.',
            },
          ],
          debrief:
            'Blurring these is a common interview stumble. Being able to say cleanly what each one ' +
            'produces shows you understand the floor as a set of jobs, not one undifferentiated role.',
          practice: [],
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
          practice: [],
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
          practice: [],
        },
      ],
    },
  ],
};
