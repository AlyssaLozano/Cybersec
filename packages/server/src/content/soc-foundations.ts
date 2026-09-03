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
    'Picture a building with a guard desk in the lobby: banks of monitors showing every camera in ' +
    'the place, someone watching them around the clock. That desk does not construct the building ' +
    'and does not fix its locks, and it cannot promise nothing will ever go wrong inside. Its job ' +
    'is narrower and more urgent than either of those: notice when something is wrong, and act on ' +
    'it fast. A Security Operations Center, almost always shortened to SOC and said as three ' +
    'letters, is that desk for a company computers and networks instead of its hallways. It is the ' +
    'team that watches an organisation for signs of attack, and responds when it finds one.\n\n' +
    'Why does this need to be a dedicated team rather than something engineers keep half an eye on ' +
    'between other work? Because computer systems generate an overwhelming amount of activity ' +
    'every second, logins, file access, network connections, almost all of it completely normal, ' +
    'and somewhere inside that noise, on any given day, an attacker might be moving. Finding that ' +
    'one abnormal thread inside millions of normal ones takes people whose entire job is looking, ' +
    'using tools built for exactly that, watching continuously rather than occasionally. A team ' +
    'busy building a product cannot also do this well as a side task, so the work becomes its own ' +
    'team with its own rhythm: detect something might be wrong, triage which alerts deserve a ' +
    'closer look, investigate the ones that do, respond if they turn out to be real, and use what ' +
    'was learned to catch the next one faster. Then repeat, continuously, for as long as the ' +
    'organisation exists.\n\n' +
    'Here is the nuance almost every newcomer gets wrong at first: a SOC is a detection and ' +
    'response capability, not a guarantee. It cannot promise nothing ever gets through, because no ' +
    'team can promise that, any more than a guard desk can promise no crime will ever happen ' +
    'anywhere in the city it sits in. It also does not own fixing weaknesses before they get ' +
    'exploited, that is a separate job called vulnerability management, and it does not build the ' +
    'systems it watches, that is engineering. The SOC watches, decides what matters, and reacts. ' +
    'Mixing up what it does with what people wish it could prevent is the single most common ' +
    'misunderstanding a beginner carries into this field.\n\n' +
    'That boundary matters directly for you. Reading a job advert or sitting in an interview for a ' +
    'SOC role, knowing this tells you what the job actually is: you will not be expected to patch ' +
    'every vulnerable system or guarantee perfect security, you will be expected to watch, decide, ' +
    'and act on what you find. Walking in with that expectation already set is the difference ' +
    'between a confident first week and a confusing one.',
} as const;

const TIER_TEACH = {
  concept:
    'Think about how a hospital emergency room sorts patients. A nurse at the door looks at ' +
    'everyone coming in and makes a fast call: this can wait, this needs a doctor soon, this needs ' +
    'a doctor right now. Almost nobody who walks in sees a specialist first. They see the person ' +
    'whose whole job is deciding, quickly, who needs to move up the chain and who does not. Most ' +
    'SOCs are organised the same way, in TIERS, and an alert moves through them the way a patient ' +
    'moves through triage.\n\n' +
    'Tier 1 is that nurse at the door: first eyes on every single alert the tooling raises, ' +
    'clearing out the ones that are nothing and escalating the handful that are not. Tier 2 is who ' +
    'Tier 1 hands the real ones to: they investigate properly, pulling in logs, network activity, ' +
    'and context that takes more than two minutes to gather. Tier 3 is the specialists and the ' +
    'incident lead, reached only for the incidents that are confirmed and actively unfolding. ' +
    'Tiers exist because you cannot staff every alert with your most expensive, most specialised ' +
    'people, there are too many alerts and not enough of them, so the organisation filters at the ' +
    'front door and saves depth for what has earned it. A good incident also travels back down: ' +
    'once it is understood, it becomes a new rule, so the exact same thing gets caught ' +
    'automatically the next time, instead of needing a human to spot it all over again.\n\n' +
    'Two things about tiers are easy to get backwards, and both matter to you directly if you are ' +
    'planning a way into this field. First, Tier 1 is where you start. The SOC Operator seat is ' +
    'the one people are hired into with no prior security job at all, coming from a help desk, a ' +
    'support role, the military, or any other career change. If you get a SOC job in the next ' +
    'year, this is almost certainly the job. Every other seat on the floor is reached from ' +
    'somewhere else first: two years of triage experience, or sideways from network engineering, ' +
    'or up from a career in intelligence analysis. None of them is where anyone starts.\n\n' +
    'Second, tier is not the same thing as rank, and this is the part that surprises people most. ' +
    'Tier 1 is not junior in the sense of doing lesser or easier work, it is the seat with the ' +
    'shortest clock and the widest funnel: everything in the whole organisation arrives there ' +
    'first, and deciding correctly in two minutes what deserves an hour of somebody else time is ' +
    'genuinely hard. Plenty of Tier 3 specialists, dropped straight into that seat with no warning, ' +
    'would do it badly. What changes as you climb the tiers is the clock you are working against, ' +
    'how deep you get to dig, and how much of the whole picture you are trusted to hold at once. It ' +
    'is not a measure of how good you have to be to sit there.',
} as const;

const ROLE_TEACH = {
  concept:
    'It is tempting to picture a SOC as one job with one skill: a person, or a room of similar ' +
    'people, watching screens for hackers. That picture is wrong in an important way. A SOC is ' +
    'many different jobs stacked on top of each other, the way a hospital is not one job called ' +
    '"doctor" but a nurse triaging arrivals, a radiologist reading scans, a surgeon operating, and ' +
    'an administrator discharging the patient, each looking at the same case and seeing something ' +
    'completely different in it.\n\n' +
    'A ROLE, in this sense, just means a specific job with its own responsibility and its own ' +
    'output, something concrete that role produces that nobody else does. The SOC Operator clears ' +
    'the queue of alerts. The log analyst builds the timeline everyone else in an incident argues ' +
    'from. Threat intelligence works out who is likely behind an attack and what they tend to do ' +
    'next. Forensics preserves evidence to a standard that survives a courtroom. The incident lead ' +
    'decides what the team does next while the picture is still incomplete. None of those is a ' +
    'lesser or greater version of the others, they are different jobs entirely.\n\n' +
    'Why split the work up this way instead of training everyone to do all of it? Because each of ' +
    'those skills takes real time to build and a different kind of attention to hold: the patience ' +
    'to reconcile logs is a different muscle from the judgement to decide "contain it now" with ' +
    'half the facts. Two people looking at exactly the same intrusion genuinely see different ' +
    'things, because they are trained to look for different things, and that is the whole reason ' +
    'more than one seat exists at all.\n\n' +
    'For you, this means the question "what does it take to work in a SOC" does not have one ' +
    'answer. It has as many answers as there are roles, and figuring out which one of these jobs ' +
    'actually suits how you think is a large part of what the rest of this platform, and this ' +
    'package especially, is for.',
} as const;

const PLACEMENT_TEACH = {
  concept:
    'You would assume every job with "SOC" attached to its purpose sits inside the SOC, on the ' +
    'same floor, on the same team, reporting to the same manager. That assumption is wrong often ' +
    'enough to trip up almost everyone new to the field, and understanding why takes a short ' +
    'analogy. A hospital has doctors who are staff, on its payroll, in its building every day, and ' +
    'it also calls in a specialist consultant who works for a different practice and is only ever ' +
    'brought in for the cases that need them. Both are doing medicine. Only one of them is ' +
    '"inside" the hospital in the sense of being part of its everyday team.\n\n' +
    'SOC roles split the same way. Some are core to the SOC in the strictest sense possible: they ' +
    'cannot exist anywhere else, because the seat itself defines what a SOC is. The operator ' +
    'triaging the alert queue and the incident lead running a live response are the SOC, in the ' +
    'sense that a SOC without them is not a SOC at all. Other roles are shaped by whatever the ' +
    'organisation decides makes sense for its size and its structure. A log analyst might be ' +
    'embedded directly on the SOC floor so a timeline is available fast while an incident is live, ' +
    'or the same person might sit with a data or logging platform team that serves the whole ' +
    'business, not just security. Threat intelligence is frequently its own separate function ' +
    'entirely. Forensics and malware analysis are often a specialist team, elsewhere in the ' +
    'company or even at another company, pulled in only for the incidents serious enough to need ' +
    'them.\n\n' +
    'The nuance worth sitting with is that where a role lives changes how fast the SOC can reach it ' +
    'and who that person answers to day to day. It does not change what the work itself is. A log ' +
    'analyst embedded in the SOC and a log analyst on a shared platform team are doing ' +
    'recognisably the same craft, reconciling logs into a timeline, just serving a different set of ' +
    'people around them.\n\n' +
    'This matters directly to you as a job seeker, because it means the same job title can point at ' +
    'two different working lives. Reading only the title on an advert and assuming you know the ' +
    'job is how people end up disappointed on day one. Reading where the role sits, and who it ' +
    'reports to, tells you the actual shape of the work before you accept it.',
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
            'The reason to hold this boundary firmly is that it is the difference between a SOC job ' +
            'and a job that only sounds like one. A SOC role is watch, triage, and respond, full ' +
            'stop, because those are the three things the team is actually staffed and equipped to ' +
            'do well. If an advert asks you to own patching every vulnerable system or guarantee ' +
            'nothing will ever get through, it is either describing a different team entirely, or it ' +
            'is written by someone who does not fully understand the job they are hiring for, which ' +
            'is itself useful information about the team you would be joining.',
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
            'Triage is the front door of the whole SOC, and the skill being graded there is disposing ' +
            'of the noise correctly, not quickly. Speed with no accuracy just means the real alert ' +
            'gets waved through faster. Because it is the entry-level seat, triage is also the most ' +
            'common way people get into this field, and, done badly as escalating everything to make ' +
            'the decision go away, it is also the most common way people get pushed back out of it.',
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
            'The reason this call belongs to one specific seat rather than whoever happens to be most ' +
            'technical in the room is accountability: somebody has to be answerable afterwards for a ' +
            'decision that, made either way, has a cost if it turns out wrong. Nearly all of the lead ' +
            'role is communication and decision-making built on that responsibility: making a call ' +
            'with only part of the picture, then explaining it clearly to executives who want a firm ' +
            'number nobody actually has yet.',
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
            'The reason a confirmed incident does not just get closed is that closing it would throw ' +
            'away everything learned in the process of confirming it. Instead the incident should ' +
            'come back down the tiers once it is understood: a detection engineer turns what was ' +
            'learned into a rule, so the next occurrence gets caught automatically by the tooling ' +
            'instead of relying on a person spotting it by hand all over again.',
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
            'The underlying reason is that a role name describes a skill set, but placement describes ' +
            'who that skill set serves and on what clock. That is why two job adverts with the exact ' +
            'same title can be different jobs. Log Analyst inside a SOC means fast, live-incident ' +
            'timelines under pressure; the same title on a data platform team means pipelines, ' +
            'retention, and slower, steadier work serving the whole company. Read where the role ' +
            'sits, not just what it is called.',
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
            'There is no single right home for this role, because both placements are solving a real ' +
            'and different problem: speed during an incident versus consistency across the whole ' +
            'business. Knowing that a title can mean either one is the difference between an ' +
            'interview where you ask the right question about the team you would actually be ' +
            'joining, and one where you find out what the job really is on your first day.',
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
              'Think of a smoke detector in a kitchen. It goes off when you burn toast far more often ' +
              'than it goes off for an actual house fire, because it cannot tell the difference ' +
              'between smoke from danger and smoke from breakfast, it only knows smoke crossed a ' +
              'threshold. A security DETECTION works the same way: it is a rule that watches for a ' +
              'pattern, like an unusual login or a strange file being created, and fires whenever that ' +
              'pattern appears, regardless of whether the cause was an attacker or an employee doing ' +
              'something ordinary in an unusual way.\n\n' +
              'Because a detection cannot tell intent from appearance, and because normal daily activity ' +
              'accidentally matches these patterns constantly, across thousands of employees and ' +
              'systems, the overwhelming majority of what lands in a queue is noise: benign activity ' +
              'that happened to trip a rule. This is not a flaw somebody forgot to fix, it is the ' +
              'unavoidable cost of having any detection broad enough to catch real attacks at all. A ' +
              'rule narrow enough to never misfire would also be narrow enough to miss most real ' +
              'attackers.\n\n' +
              'The nuance worth sitting with is that this is exactly why triage exists as its own job: ' +
              'somebody has to look at each smoke alarm going off and tell burnt toast from a real ' +
              'fire, fast, without either ignoring the one real fire or evacuating the building every ' +
              'single time. That is the actual skill being taught, and it only becomes visible once you ' +
              'accept that most of the queue was never going to be real.\n\n' +
              'For your first weeks in a seat like this, expecting the queue to be mostly false alarms, ' +
              'rather than mostly real threats, changes how you approach it. Going in expecting drama ' +
              'and finding routine, over and over, is how burnout starts. Going in expecting routine and ' +
              'staying sharp for the rare real one is the actual job.',
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
            'The reason this fact about the queue matters so much is that it is also the root cause of ' +
            'the biggest hazard in the seat, alert fatigue. Look at hundreds of false alarms in a row ' +
            'and the brain, entirely predictably, starts treating the next one the same way without ' +
            'really checking. An operator worn down by pure noise starts rubber-stamping, and the one ' +
            'real alert of the month goes out with the rest, unnoticed, simply because it looked like ' +
            'everything else that day.',
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
              'Imagine a burglar breaking into a house. There is a gap between when they climb through ' +
              'the window and when an alarm actually goes off, and a second gap between the alarm ' +
              'going off and the police actually arriving. Both gaps matter, and they measure two ' +
              'completely different things: how long it took to notice, and how long it took to react ' +
              'once noticed. A SOC is judged by the equivalent of both gaps, expressed as two numbers.\n\n' +
              'MEAN TIME TO DETECT, always shortened to MTTD, is the average time between an intrusion ' +
              'actually starting and the SOC noticing it happened at all. MEAN TIME TO RESPOND, MTTR, ' +
              'is the average time from that moment of noticing to the moment the intrusion is actually ' +
              'contained and stopped. "Mean" here just means average, taken across many incidents over ' +
              'time, not a measurement of any single one.\n\n' +
              'Why measure these two things specifically, rather than something simpler like how many ' +
              'alerts got closed? Because they are the two numbers that track the thing a SOC actually ' +
              'exists to shrink: the amount of time an attacker gets to operate freely inside a network ' +
              'before anyone stops them. Every additional hour of MTTD or MTTR is an hour an attacker ' +
              'spends stealing data, spreading further, or doing more damage, uninterrupted.\n\n' +
              'The nuance worth being precise about is which gap is which: detect is the delay before ' +
              'anyone notices anything, respond is the delay after noticing before it is actually shut ' +
              'down. Mixing the two up is an easy early mistake, and getting it backwards in an ' +
              'interview reads as not actually understanding what a SOC is measured on.',
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
            'The reason MTTD gets so much attention is that it is where nearly all the real damage ' +
            'accumulates. Attackers count on a long detection gap, because it is free time to work in. ' +
            'The Yahoo and SolarWinds intrusions both ran for months before anyone noticed, and nearly ' +
            'all of the actual harm, data taken, systems compromised, happened inside that undetected ' +
            'window, not in the relatively short time it took to respond once the SOC finally saw it.',
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
              'Imagine that same emergency room nurse from the tier explanation, except this time, ' +
              'nervous about missing something serious, she sends every single patient who walks in ' +
              'straight to a surgeon, including the ones with a papercut. That sounds cautious. It is ' +
              'actually the opposite of helpful, because the surgeon now has to wade through every ' +
              'papercut to find the one person who is actually bleeding badly, and there are far fewer ' +
              'surgeons than there are patients walking through the door.\n\n' +
              'That is exactly what happens when a Tier 1 operator escalates every alert instead of ' +
              'triaging it. Triage only works as a concept because it FILTERS: it takes a large, mostly ' +
              'noisy pile and turns it into a small, mostly real one, so the next tier can actually give ' +
              'each escalated item real attention. An operator who escalates everything has not been ' +
              'cautious, they have skipped the one job the seat exists to do.\n\n' +
              'The nuance here is about where the noise actually goes when you refuse to filter it, not ' +
              'about the operator personally. It does not disappear. It moves to Tier 2, a team that is ' +
              'smaller, more specialised, and more expensive per person, and therefore has even less ' +
              'capacity to absorb a flood than Tier 1 did. A queue where everything gets escalated is, ' +
              'in every practical sense, identical to a queue nobody looked at, because nothing has ' +
              'actually been separated from anything else.\n\n' +
              'This is worth understanding early because "just be safe and escalate it" feels like the ' +
              'responsible instinct when you are new and unsure. It is not. Learning to actually decide, ' +
              'and accept that a decision might occasionally be wrong, is the job itself.',
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
            'The underlying reason this fails so predictably is capacity, not judgement: there is a ' +
            'fixed, small amount of Tier 2 attention available each day, and spending it all on noise ' +
            'means there is none left when a real incident actually needs it. This is why the operator ' +
            'seat is graded on disposing of the queue correctly, not quickly, and why an operator who ' +
            'defaults to escalating everything to avoid being wrong is one of the most common ways ' +
            'people quietly get moved out of the field.',
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
              'Picture someone standing at a fork in the road, except the fork appears again every ' +
              'thirty seconds, all day, and every single time they have to pick a direction with only ' +
              'a glance at the map. That is roughly the position a triage operator is in on every ' +
              'single alert: a decision has to be made quickly, and there is a real cost whichever way ' +
              'it goes.\n\n' +
              'A TRADEOFF, in plain terms, is a situation where making one kind of mistake less likely ' +
              'automatically makes a different kind of mistake more likely, so you cannot just try ' +
              'harder and avoid both. Triage is exactly this. Dismiss an alert that turns out to be ' +
              'real and an intrusion runs unseen, doing damage the whole time nobody is watching it. ' +
              'Escalate too freely, out of caution, and (as the previous exercise showed) the genuinely ' +
              'real alerts drown in a flood of unfiltered noise sent to a tier that cannot absorb it.\n\n' +
              'The specific nuance to hold onto is that these two failures pull in opposite directions. ' +
              'Becoming more cautious about missing something pushes you toward escalating more, which ' +
              'directly increases the risk of burying something real in volume. Becoming more selective ' +
              'to keep the queue manageable pushes you toward dismissing more, which directly increases ' +
              'the risk of missing something real outright. With only seconds available per alert, an ' +
              'operator cannot fully eliminate either risk, only choose which one they are leaning ' +
              'toward on any given call.\n\n' +
              'This is why the job is described as hard rather than boring, despite looking repetitive ' +
              'from the outside. Every single decision, however routine it looks, is a small bet made ' +
              'under real uncertainty, and doing it well for an entire shift is genuinely demanding.',
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
            'Being able to name this tradeoff out loud is what separates an operator who is actually ' +
            'learning the job from one who is just clicking through a queue on instinct. The reason it ' +
            'matters is accountability: a decision you can explain, even a wrong one, is something you ' +
            'can learn from and defend afterwards, while a decision made without knowing which risk you ' +
            'were leaning into is just a guess that happened to have a reason attached after the fact. ' +
            'The good operators know which risk they are taking on each call, and why.',
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
              'Consider two ways a person could learn to avoid a pothole in the road. One learns it by ' +
              'hitting it every single day and swerving late each time, forever. The other hits it ' +
              'once, marks it clearly, and after that everyone who drives the road avoids it without ' +
              'even thinking. A SOC that only reacts to incidents without ever changing anything is ' +
              'the first driver: capable, but doomed to relearn the same lesson painfully, over and ' +
              'over, forever.\n\n' +
              'A mature SOC closes that loop instead. Once an incident is investigated and understood, ' +
              'the specific pattern that revealed it, the login sequence, the file behaviour, whatever ' +
              'it was, gets handed to a detection engineer, who writes a rule that fires on that exact ' +
              'pattern automatically. Something that took a skilled analyst hours to piece together by ' +
              'hand becomes something the tooling notices in seconds, every future time it happens.\n\n' +
              'The reason this step matters so much, and why it is easy to skip under pressure, is that ' +
              'an incident that gets fully resolved and then forgotten has taught the organisation ' +
              'nothing. All the effort that went into understanding it evaporates the moment the ' +
              'ticket is closed, unless somebody deliberately turns that understanding into something ' +
              'permanent.\n\n' +
              'This is the difference, practically speaking, between a SOC that is treading water and ' +
              'one that is actually getting better over time: whether painful incidents this month ' +
              'become routine, automatically caught alerts next month, or whether the exact same kind ' +
              'of intrusion has to be caught by hand again and again, indefinitely.',
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
            'The underlying reason this step cannot be skipped is that human attention does not scale: ' +
            'there will never be enough analysts to catch every recurrence of every past incident by ' +
            'hand forever. Turning what was learned into a rule is what frees a human up to go find ' +
            'the next new thing instead. Every incident either teaches the tooling something ' +
            'permanent, or it is destined to happen again with nobody the wiser until it does.',
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
              'A LOG is just a record a computer system keeps, automatically, of things that happened: ' +
              'this user logged in at this time, this file was opened, this connection was made. Every ' +
              'system on a network keeps its own logs, in its own format, on its own clock, and during ' +
              'a real incident there can be thousands of these tiny records scattered across dozens of ' +
              'systems, each one useless on its own.\n\n' +
              'The clearest way to tell any two SOC roles apart, when their descriptions start to blur ' +
              'together, is to ask what each one actually produces, the concrete thing they hand to ' +
              'everyone else. What the log analyst produces is a TIMELINE: those scattered, ' +
              'differently formatted records pulled together, reconciled against each other (including ' +
              'fixing the fact that different systems often disagree on the exact time something ' +
              'happened), and laid out in the order events actually occurred.\n\n' +
              'Why does this matter enough to be its own dedicated job rather than something everyone ' +
              'does a bit of? Because without an agreed, ordered account of what happened first, ' +
              'second, and third, every other person working the incident is arguing from a different, ' +
              'partial picture. The operator who spotted the alert, the lead deciding whether to ' +
              'contain it, the analyst asking who is behind it, all of them need the same shared story ' +
              'of events to reason about the same incident together.\n\n' +
              'This is a quiet seat that rarely gets the credit an incident lead or a forensics analyst ' +
              'gets, but it is foundational: get the timeline wrong and every decision built on top of ' +
              'it is built on sand.',
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
            'The reason a weak timeline can sink an entire incident response is that every subsequent ' +
            'decision, contain or wait, escalate or close, depends on knowing what happened in what ' +
            'order. If nobody can say for certain whether the attacker got in before or after a ' +
            'specific system was patched, every decision made from that point on is closer to a guess ' +
            'than a judgement. That is why this quiet, unglamorous seat carries so much weight.',
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
              'Almost every job on a SOC floor is INVESTIGATIVE: it starts once something has already ' +
              'happened and works backward to understand it, the way a detective arrives after a crime ' +
              'and pieces together what occurred. One SOC role does not work that way at all.\n\n' +
              'The detection engineer produces something different from everyone else on the floor: ' +
              'RULES, the actual logic, written in advance, that decides whether a piece of activity is ' +
              'suspicious enough to raise an alert in the first place. Every alert an operator ever ' +
              'sees exists only because a detection engineer, at some earlier point, decided that ' +
              'specific pattern was worth flagging and wrote the rule that watches for it.\n\n' +
              'That makes this role PREVENTIVE rather than investigative, and it is worth being precise ' +
              'about what that word means here: it does not stop attacks by itself, but it determines ' +
              'whether the next occurrence of a known bad pattern gets caught automatically or slips ' +
              'through unnoticed. Its success is not measured by how well it explained any one ' +
              'incident, because it does not investigate incidents, it is measured by how much gets ' +
              'caught going forward that would previously have been missed.\n\n' +
              'This distinction is worth holding onto because it is the one role on the floor whose ' +
              'work product is code that runs against the whole environment continuously, rather than a ' +
              'finding about one specific event, which is also why the role sits at the boundary ' +
              'between the SOC and software engineering.',
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
            'The reason this role sits so close to software engineering, rather than purely inside the ' +
            'SOC, is that its output behaves like software: a rule written once keeps running against ' +
            'the whole environment continuously, needs testing so it does not misfire constantly, and ' +
            'needs maintaining as the environment changes around it, none of which describes writing a ' +
            'note about one incident.',
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
              'Almost every SOC role only starts working once something has already triggered them: an ' +
              'alert lands, a rule gap gets flagged, an intel report arrives naming a new adversary ' +
              'technique. Something outside the person has to happen first before they act. That covers ' +
              'nearly the whole floor, but not every seat on it.\n\n' +
              'The threat hunter is the exception, and understanding why requires distinguishing two ' +
              'words that sound similar but describe opposite starting points. REACTIVE work begins ' +
              'because a trigger arrived, like the operator working an alert the tooling already raised. ' +
              'PROACTIVE work begins with nothing at all except a person going looking on their own ' +
              'judgement.\n\n' +
              'A threat hunter is proactive and HYPOTHESIS-DRIVEN, meaning they start from an educated ' +
              'guess rather than a queued item: they assume, correctly, that some intrusions never trip ' +
              'any alert at all, and they go searching the raw data by hand for evidence of exactly that ' +
              'kind of intrusion, the sort no rule was ever written to catch. There is no ticket waiting ' +
              'for them when the day starts, only a question they chose to ask.\n\n' +
              'Why does a SOC need this seat if detections already cover so much? Because detections can ' +
              'only ever catch patterns somebody already thought to write a rule for, and attackers are ' +
              'actively trying new techniques nobody has written a rule for yet. A good hunt ends by ' +
              'handing the detection engineer exactly that: a newly found technique, now turned into a ' +
              'new rule, so it becomes something the tooling catches automatically from then on.',
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
            'It is worth separating threat hunting clearly from two other roles it gets confused with, ' +
            'because the confusion is common and each one starts from a different place: the hunter ' +
            'finds an undetected intrusion by manually searching the data, the detection engineer ' +
            'automates catching it once it is found, and the threat intelligence analyst is often the ' +
            'one who tells the hunter which adversary technique is worth going looking for in the first ' +
            'place.',
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
              'Think about how police handle a crime scene: they do not just walk in and start picking ' +
              'things up. They photograph everything first, wear gloves so they do not add their own ' +
              'fingerprints, and follow a strict order, because evidence handled carelessly, even if the ' +
              'conclusion drawn from it is correct, can become worthless in court. Digital forensics is ' +
              'the same discipline applied to a computer instead of a room.\n\n' +
              'The specific order matters for a reason that is easy to miss if you have never thought ' +
              'about it: information on a running computer disappears in stages. What is in memory (the ' +
              'part of a computer that holds what is actively happening right now) vanishes the moment ' +
              'the machine is switched off or even just sits idle for a while, while what is written to ' +
              'disk tends to stick around. So a forensics analyst captures memory before disk, because ' +
              'memory is the more fragile evidence and disk can wait. And before touching anything at ' +
              'all, they take a HASH, a short fingerprint-like code calculated from the exact contents of ' +
              'a file or drive, so they can later prove nothing was altered during their own ' +
              'investigation.\n\n' +
              'The nuance to hold onto is WHY this level of ceremony exists at all, when other roles on ' +
              'the floor move fast and decide under uncertainty. Forensics evidence sometimes has to ' +
              'survive a courtroom, be cross-examined by a lawyer, and hold up months or years later. A ' +
              'brilliant conclusion reached by touching evidence in the wrong order can be thrown out ' +
              'entirely on a technicality, regardless of whether it was actually correct.\n\n' +
              'That is what separates this seat from the faster, decision-driven ones around it: speed ' +
              'is not the priority here, defensibility is.',
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
            'The reason forensics is so often a specialist team pulled in only for specific incidents, ' +
            'rather than a permanent seat on every SOC floor, follows directly from this: the rigour is ' +
            'genuinely expensive in time and training, and only the incidents likely to end up in legal ' +
            'or regulatory proceedings actually need evidence held to that standard. Most do not.',
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
              'These three roles all have the word threat or detection in them somewhere, all deal in ' +
              'catching attackers, and are genuinely three different jobs with three different outputs, ' +
              'which is exactly why they get blurred together so easily by anyone new to the field.\n\n' +
              'The clearest way to separate them is the same trick used earlier in this module: ask what ' +
              'each one physically produces at the end of a day of work, rather than what they broadly ' +
              '"deal with". The detection engineer writes and tunes RULES, the logic that automatically ' +
              'flags a known bad pattern going forward. The threat intelligence analyst researches ' +
              'actual adversary groups and their campaigns, producing INTELLIGENCE, meaning specific ' +
              'indicators and techniques worth watching for, essentially answering "who is likely ' +
              'attacking people like us, and how do they usually operate". The threat hunter takes a ' +
              'HYPOTHESIS, an educated guess with no alert behind it, and manually searches the ' +
              'environment for a specific intrusion nobody has found yet.\n\n' +
              'One automates detection for the future, one supplies the knowledge of what is worth ' +
              'detecting in the first place, and one goes looking by hand for what has already slipped ' +
              'past everything else. They frequently feed each other directly: intel tells the hunter ' +
              'where to look, and a successful hunt hands the engineer a new rule.\n\n' +
              'Being able to hold these three apart cleanly, rather than treating them as roughly the ' +
              'same thing, is exactly the kind of understanding that separates someone who has studied ' +
              'the floor from someone who has only heard the job titles.',
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
            'Blurring these three together is one of the most common stumbles in a first interview, ' +
            'because it is an easy trap: all three sound similar on paper and only become distinct once ' +
            'you have thought about what each one actually produces. Being able to say cleanly what ' +
            'each one produces, rather than reciting the job titles, shows a panel you understand the ' +
            'floor as a set of genuinely different jobs, not one undifferentiated "does security stuff" ' +
            'role.',
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
              'A company deciding how to get its computers monitored around the clock faces the same ' +
              'kind of choice a small business faces deciding whether to hire its own security guards ' +
              'or pay an outside security firm to patrol the building. Building your own team means ' +
              'people who know this specific building intimately, but costs a lot and takes time to ' +
              'staff up. Paying an outside firm means coverage starts almost immediately and costs ' +
              'less, but that firm is also patrolling other buildings and never knows this one as ' +
              'intimately as a dedicated team would.\n\n' +
              'The version of the outside firm for computer security is called an MSSP, short for ' +
              'Managed Security Service Provider. Rather than a company hiring, training, and rostering ' +
              'its own round-the-clock monitoring team (an IN-HOUSE SOC), it pays a vendor whose entire ' +
              'business is watching security alerts, and that vendor does the same job simultaneously ' +
              'for many different client companies at once.\n\n' +
              'Why would a company choose one over the other? In-house buys deep context, its own ' +
              'people slowly build an intimate understanding of exactly what normal looks like on that ' +
              'specific network, at real cost in salaries, training, and time before the team is fully ' +
              'effective. An MSSP buys speed and lower cost, round-the-clock coverage can start almost ' +
              'immediately without hiring a single person, at the cost of a vendor watching your ' +
              'environment through a lens shared with dozens of other unrelated clients, who ' +
              'inevitably understands your specific network less deeply than dedicated staff would.\n\n' +
              'This distinction matters directly to you as a job seeker, because it describes two ' +
              'genuinely different working environments you might end up in, not just two ways of ' +
              'buying the same service.',
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
            'The reason this distinction is worth remembering as you job hunt is that adverts split ' +
            'cleanly along this line without always saying so directly. An in-house SOC role means deep ' +
            'context on one specific environment and a slower, more settled pace; an MSSP role means ' +
            'breadth across many different client environments, faster context-switching, and often a ' +
            'quicker route to broad experience. Neither is objectively better, but they are meaningfully ' +
            'different jobs, and it is worth knowing which one you are walking into.',
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
              'Think of the SOC as the fire department for an organisation computers. Firefighters ' +
              'respond to fires, and they will absolutely tell a building owner that the wiring is a ' +
              'hazard, but they do not personally rewire the building, that is an electrician job. A ' +
              'SOC works the same way: it watches, decides what matters, and responds, but it does not ' +
              'personally do the underlying work of every team whose systems it happens to be watching.\n\n' +
              'This matters because a SOC constantly touches other teams work without owning it. When it ' +
              'sees an unpatched, vulnerable system, that is not the SOC job to fix, that belongs to ' +
              'VULNERABILITY MANAGEMENT, the team responsible for finding and patching weaknesses before ' +
              'they get exploited. When an alert traces back to a flaw in how an application was built, ' +
              'fixing that application is ENGINEERING work, the team that actually builds and maintains ' +
              'it. When an alert involves who has access to what account, managing those accounts ' +
              'belongs to IDENTITY AND ACCESS MANAGEMENT, sometimes shortened to IAM.\n\n' +
              'Why keep these separate at all, rather than having the SOC just do everything it notices ' +
              'needs doing? Because each of those is a full, specialised job in its own right, patching ' +
              'thousands of systems safely, building reliable software, and administering access for an ' +
              'entire company are each too large and too different a skill set for one team to also do ' +
              'well on the side. The SOC leans on all three constantly and owns none of them.\n\n' +
              'Knowing this boundary is exactly how you read what a job actually is, rather than what it ' +
              'sounds like. A role that spends its time actually patching systems is a vulnerability ' +
              'management job wearing a security-sounding title, not a SOC job.',
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
            'The reason this handoff matters in practice, not just on an org chart, is that during a ' +
            'real incident the SOC has to know instantly whom to call rather than trying to do the fix ' +
            'itself under time pressure. When an incident needs a patch, a code fix, or an account ' +
            'disabled, the SOC asks the team that already owns it, because that team knows the system ' +
            'and can act safely on it. A SOC that tries to own all of that directly, rather than ' +
            'coordinate with the teams who actually run those systems, has quietly stopped being a SOC ' +
            'and started being everything at once, badly.',
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
              'A SOC is built and staffed to solve a technical problem: find the intrusion, contain it, ' +
              'understand it. Some incidents, though, stop being purely technical problems at all, the ' +
              'moment customer data is confirmed stolen. That is worth pausing on, because it is a real ' +
              'shift, not just a bigger version of the same job.\n\n' +
              'A breach involving customer data creates obligations that have nothing to do with ' +
              'firewalls or logs. Many places have laws requiring companies to notify affected ' +
              'customers, and sometimes a government regulator, within a set number of days of ' +
              'discovering a breach, a REGULATORY CLOCK that starts ticking the moment it is confirmed. ' +
              'There are also decisions about what to tell the public and when, which affect the company ' +
              'reputation and are not decisions a security team is trained or authorised to make alone. ' +
              'And there is genuine legal exposure: what the company says, and when, can affect lawsuits ' +
              'and fines down the line.\n\n' +
              'This is why LEGAL, executives, and a communications or public relations team get pulled ' +
              'into the response directly, not as a courtesy but as a necessity: the consequences of a ' +
              'data breach reach into notification law, regulatory deadlines, and public trust, none of ' +
              'which the SOC has the authority or the training to own.\n\n' +
              'For you, the nuance worth keeping is where the line actually falls: the SOC still owns ' +
              'the technical containment, finding and stopping the intrusion, but it does not own the ' +
              'notification, the public statement, or the legal exposure that follows. Those decisions ' +
              'move to people whose job that specifically is.',
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
            'The reason the incident response lead spends so much of their time communicating upward, ' +
            'rather than heads-down on the technical work, follows directly from this: past a certain ' +
            'severity, the hardest and most consequential parts of an incident are decisions the SOC ' +
            'informs with facts but does not actually make, because they carry legal and reputational ' +
            'weight the SOC was never set up to carry.',
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
              'Go back to the security-guard comparison from earlier: hiring your own guards versus ' +
              'paying an outside patrol firm. Neither choice is simply better, each one trades one thing ' +
              'for another, and that is exactly what choosing between an in-house SOC and an MSSP is ' +
              'like.\n\n' +
              'What an MSSP gives you is speed and scale you could not otherwise afford quickly: ' +
              'round-the-clock coverage from almost day one, without having to hire, train, and roster a ' +
              'team yourself, and access to expertise the vendor has built up across many other clients, ' +
              'usually for a lower cost than staffing an equivalent team in-house.\n\n' +
              'What it costs you is CONTEXT, and this is the part worth understanding rather than just ' +
              'memorising. A vendor analyst working across dozens of unrelated client environments ' +
              'cannot build the same intimate sense of what normal looks like for your specific network ' +
              'that a dedicated in-house team develops over months of watching only your systems. That ' +
              'gap in familiarity means a vendor can be slower to recognise that something is genuinely ' +
              'unusual for you, mistaking your normal for suspicious, or your suspicious for normal.\n\n' +
              'Neither side of that tradeoff is a mistake to choose, it depends entirely on what the ' +
              'organisation actually needs and can afford, which is exactly why this decision keeps ' +
              'coming up rather than having settled into one obvious right answer years ago.',
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
            'There is no universal right answer here, and that is genuinely the point rather than a ' +
            'dodge: the correct choice depends on the organisation size, budget, and risk. A small ' +
            'company may be far safer with an MSSP watching around the clock than with a single ' +
            'overworked analyst trying to cover nights, weekends, and a full time job alone; a large, ' +
            'high-stakes organisation may need the deep, specific context that only a dedicated ' +
            'in-house team can build over time. Recognising which situation you are looking at is the ' +
            'actual skill.',
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
              'It is tempting to imagine the SOC as a strict, single-file ladder: every attack starts ' +
              'at the bottom rung with the operator, and climbs up through the tiers in a fixed order, ' +
              'the way a letter always goes through the same sorting steps at a post office. Real SOCs ' +
              'do not actually work quite that cleanly, and this module now moves from describing the ' +
              'roles individually to watching one attack move through several of them together.\n\n' +
              'Most of the time, yes, an automated detection fires and lands directly in the Tier 1 ' +
              'queue, which makes the operator genuinely first eyes on it more often than anyone else. ' +
              'But that is a tendency, not a rule. A log analyst manually working through logs for an ' +
              'unrelated reason, or a network analyst reviewing traffic patterns, can just as easily ' +
              'notice something the automated tooling never flagged at all, something no rule was ever ' +
              'written to catch.\n\n' +
              'The nuance worth taking from this is that whoever notices something suspicious first ' +
              'does the same next thing regardless of their seat: they hand it off to be verified and, ' +
              'if confirmed, escalated. That hand-off travels in whatever direction actually confirms and ' +
              'resolves the situation, not down one predetermined ladder, because the goal is catching ' +
              'and stopping the attack, not preserving a tidy org chart.\n\n' +
              'Understanding this matters for how you picture the job: you are not one fixed link in a ' +
              'strict chain, you are one of several people who might be first to notice something, and ' +
              'knowing what to do the moment you notice it matters more than which seat you happen to ' +
              'be sitting in.',
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
            'The reason this flexibility matters is that an attack does not care which seat happens to ' +
            'notice it, only that someone does. Whoever catches it, the next move is the same: hand it ' +
            'off to be verified and escalated. That hand-off is not a fixed, one-way ladder, it runs in ' +
            'whatever direction actually confirms the attack and reaches the person able to act on it.',
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
              'Spotting smoke and knowing exactly which room is on fire, how it started, and what was ' +
              'lost are three completely different levels of knowledge. Confirming an alert is real is ' +
              'the equivalent of spotting the smoke: it tells you something is wrong, but almost nothing ' +
              'about the specifics.\n\n' +
              'Once an alert is confirmed and escalated, somebody has to go find out what actually ' +
              'happened, and that job belongs to the log analyst. They dig into the raw logs, the ' +
              'automatic records every system kept of what occurred, and reconstruct exactly what the ' +
              'attacker touched, in what order, and critically, what left the network, since that is the ' +
              'difference between an attempted breach and data actually being stolen.\n\n' +
              'The reason this has to be a separate, deliberate step rather than something the operator ' +
              'just figures out while triaging is that it takes real time and depth: reconciling logs ' +
              'from many different systems into an accurate account of exactly what was accessed is not ' +
              'something that fits into the seconds-per-alert pace of triage.\n\n' +
              'That timeline the log analyst produces is what the entire rest of the response gets ' +
              'argued from: the containment decision, the legal notification decision, the executive ' +
              'briefing, all of it depends on this reconstructed account of what actually happened.',
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
            'The clean way to hold these two roles apart, and the reason they cannot be merged into ' +
            'one, is the question each one is actually answering: the operator answers "is this worth a ' +
            'closer look", a fast yes-or-no call, while the log analyst answers "what actually ' +
            'happened", a slow, detailed reconstruction. Two genuinely different questions, two ' +
            'different seats.',
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
              'Even once the log analyst has a solid timeline, the facts alone do not act on ' +
              'themselves: cutting an attacker off is a decision, with real consequences either way, and ' +
              'somebody specific has to be the one who makes that call and answers for it afterwards. ' +
              'Investigation informs a decision, it does not replace the need for someone to actually ' +
              'make one.\n\n' +
              'That person is the incident response coordinator (elsewhere in this package called the ' +
              'incident response lead, the same role). They formally declare the incident, which matters ' +
              'because it is what actually pulls the wider team, and sometimes people outside the SOC ' +
              'entirely, into a coordinated response rather than everyone working it separately. They ' +
              'make the call on whether to cut the attacker off now or watch a little longer, almost ' +
              'always on incomplete information, and they direct what every other seat does next.\n\n' +
              'Why does this need to be a distinct seat rather than falling to whoever is technically ' +
              'strongest in the room at the time? Because being right about the technical details and ' +
              'being able to weigh an irreversible decision under pressure, then explain it clearly to ' +
              'people who were not in the room, are different skills. IT departments execute changes to ' +
              'systems, they do not typically own this kind of judgement call, and the most technical ' +
              'person present is not automatically the best person to decide.\n\n' +
              'This is the seat where the whole incident, everything every other role produced, gets ' +
              'turned into an actual decision.',
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
            'The underlying reason this seat exists at all is that someone has to be able to say ' +
            '"isolate it now" while holding maybe sixty percent of the full picture, and then answer for ' +
            'that call afterwards, whichever way it turns out. That is what the coordinator role is ' +
            'built for, and it is a different skill from being the person who can type the fastest or ' +
            'knows the tooling best.',
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
              'Three witnesses to the same car accident, standing on three different corners, will each ' +
              'describe something slightly different, and none of them alone has the full picture. That ' +
              'is the whole point of splitting a SOC into many different seats: one incident genuinely ' +
              'looks different depending on which chair you are sitting in, and no single seat sees ' +
              'everything.\n\n' +
              'A network analyst watching traffic sees only the connection itself: a server reaching out ' +
              'to an address every hour, regular as clockwork. That alone is not evidence of anything, a ' +
              'perfectly ordinary scheduled backup job or a software update check would look identical ' +
              'from where they are sitting. Confirming whether it is actually dangerous needs pieces ' +
              'only other seats hold: the log analyst can say what process on the machine is actually ' +
              'making that connection, threat intelligence can say whether that specific address is ' +
              'already known to be associated with attackers, and the malware analyst can say whether ' +
              'something running on the host is responsible for it.\n\n' +
              'The reason no one person can just decide alone, however confident they feel, is that each ' +
              'seat is structurally missing information the others hold, not because any one of them is ' +
              'less capable. It is not a confidence problem, it is a visibility problem.\n\n' +
              'This is the practical reason a SOC is a team sport rather than a collection of ' +
              'individuals each covering their own patch: a confident, correct answer to "is this an ' +
              'attack" usually requires combining several of those different views into one.',
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
            'This is the underlying reason the floor has more than one chair in the first place, rather ' +
            'than one generalist role doing everything. Each seat holds one piece of the picture that ' +
            'the others do not, and a genuinely confident answer usually needs several of those pieces ' +
            'combined at once.',
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
              'Building a house has to happen in an order: you cannot put up walls before there is a ' +
              'foundation, and you cannot paint a wall that does not exist yet. Skipping ahead does not ' +
              'save time, it just means redoing work later, or worse. An incident response runs in an ' +
              'order for the same reason: each step depends on something the previous one produced.\n\n' +
              'Roughly, the sequence runs: declare the incident (make it official and pull people in), ' +
              'contain it (stop it from getting worse), investigate (find out what happened), preserve ' +
              'evidence (in case it is needed later), find the root cause (how did the attacker actually ' +
              'get in), recover (restore normal operation), and only then improve detection (turn what ' +
              'was learned into a better rule for next time).\n\n' +
              'The nuance worth being precise about is why declaring comes first, ahead of everything ' +
              'else, including containment. You cannot formally contain, coordinate, or assign work on ' +
              'something that has not been officially recognised as an incident yet, because nobody ' +
              'outside the person who spotted it even knows to act. Declaring is what turns "I think ' +
              'something might be wrong" into "the team is now responding to this", and every later step ' +
              'depends on that team already being pulled in.\n\n' +
              'Getting the order backwards is not a minor inefficiency. Trying to improve detection ' +
              'rules before anyone understands what actually happened means tuning for the wrong thing ' +
              'entirely, and recovering systems before containment means restoring a machine the ' +
              'attacker can simply walk straight back into.',
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
            'The reason this order is worth memorising rather than treating as common sense in the ' +
            'moment is that getting it wrong is genuinely expensive, not just untidy: recover a system ' +
            'too early, before containment, and the attacker simply walks straight back in; tune a ' +
            'detection rule before the attack is properly understood and you end up tuning for the ' +
            'wrong signal entirely.',
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
              'A relay race is won or lost as much on the handoffs between runners as on any single leg ' +
              'being run fast. Drop the baton once and the fastest team in the world still loses. An ' +
              'incident response works the same way: each person does one leg well, and the whole thing ' +
              'only succeeds if the handoffs between them hold.\n\n' +
              'Walking through one intrusion end to end, as this module has done, the operator spots the ' +
              'alert, the log analyst confirms what actually happened and builds the timeline, the ' +
              'coordinator makes the call to contain it, a network or containment-capable role acts on ' +
              'that call, threat intel and a malware analyst explain who did this and how, forensics ' +
              'preserves the evidence properly in case it is needed later, and detection engineering ' +
              'makes sure the exact same thing gets caught automatically next time.\n\n' +
              'The reason no single one of those people could have done the whole thing alone is not ' +
              'just that it is a lot of work, it is that each step genuinely needs a different, deep ' +
              'skill: the patience to reconcile logs is not the same skill as the judgement to make an ' +
              'irreversible call under pressure, which is not the same skill as knowing how to preserve ' +
              'evidence so it survives a courtroom.\n\n' +
              'Take any single one of those links away and the whole chain breaks somewhere: without the ' +
              'log analyst nobody knows what actually happened, without the coordinator nobody decides, ' +
              'without detection engineering the same incident happens again next month exactly the same ' +
              'way.',
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
            'This is the mindset the rest of the platform is built on, and it is worth carrying with ' +
            'you past this module. You will eventually specialise into one of these seats, and it is ' +
            'natural to focus on getting good at that one job, but you are always one link in a longer ' +
            'chain, and the handoff on either side of you is just as often where an incident is ' +
            'actually won or lost.',
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
              'This module steps back from the roles and the process, and looks at the actual software ' +
              'a SOC lives inside all day. Start with the tool at the centre of most of them: the SIEM, ' +
              'said as one word, short for Security Information and Event Management.\n\n' +
              'Recall the log concept from earlier in this package: a log is an automatic record a ' +
              'system keeps of something that happened. A single company might run thousands of ' +
              'systems, each one quietly writing its own logs, in its own place, in its own format, ' +
              'with nobody looking at any of them individually. A SIEM is the place all of that gets ' +
              'pulled together: logs from everywhere arrive in it, get NORMALISED, meaning translated ' +
              'into one common shape, and become searchable as one connected pool instead of thousands ' +
              'of separate ones. Normalising is the whole point, and it is worth seeing why: a firewall ' +
              'records a login one way, a Windows machine records the same kind of login a completely ' +
              'different way, using different field names and formats, and without a SIEM translating ' +
              'both into a shared vocabulary, nobody could write one search that finds a suspicious ' +
              'login pattern across both systems at once.\n\n' +
              'On top of that pooled, searchable data, a SIEM runs saved queries continuously in the ' +
              'background and raises an alert whenever one of them matches. This is literally where the ' +
              'queue an operator works every day comes from: at some earlier point somebody wrote a ' +
              'rule describing a suspicious pattern, the rule matched real activity, and a new row ' +
              'appeared in the queue for a human to look at.\n\n' +
              'The specific nuance this exercise is testing is what a SIEM does NOT do, because the ' +
              'name and the marketing around these products make it sound smarter than it is. A SIEM ' +
              'has no actual opinion about whether a match matters, it only knows a pattern fired, the ' +
              'same way a smoke alarm does not know whether it is toast or a real fire, it just knows ' +
              'smoke crossed a threshold. And the more important limitation: a SIEM can only see what ' +
              'was actually sent to it. A server whose logs were never connected, never ONBOARDED in ' +
              'the industry term, is completely invisible to the SIEM, and nothing in the tool itself ' +
              'will ever hint that the gap exists.\n\n' +
              'Understanding both halves of this, what a SIEM does and what it quietly cannot do, ' +
              'matters because it is the tool you will spend most of your working hours inside, and ' +
              'trusting it to know things it structurally cannot know is a mistake that costs real time ' +
              'during a real incident.',
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
            'Coverage is the question almost nobody thinks to ask about a SIEM until after an incident ' +
            'has already exposed the gap, because the tool itself gives no visible signal that ' +
            'anything is missing, it just looks quiet where a real problem was happening unseen. Being ' +
            'able to say confidently which systems are onboarded, and which are not, is a more useful ' +
            'and more senior thing to know than fluency in any particular query language.',
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
              'A hammer and a screwdriver both fix things to a wall, and using the wrong one anyway, ' +
              'because it is the one already in your hand, wastes real time and sometimes ruins the ' +
              'job. The tools on a SOC floor have exactly this problem: they overlap enough in what ' +
              'they touch to be genuinely confusing to someone new, and they are absolutely not ' +
              'interchangeable.\n\n' +
              'A SIEM, as the previous exercise covered, answers questions ACROSS many systems and over ' +
              'time, because it pools normalised logs from everywhere. Has this address touched ' +
              'anything else in the whole company this month, did this exact pattern happen before, ' +
              'what else occurred in the same ten minutes elsewhere. Its strength is breadth and ' +
              'history.\n\n' +
              'An EDR, short for Endpoint Detection and Response, is a completely different kind of ' +
              'tool: it answers deep questions about ONE ENDPOINT, meaning one individual computer, ' +
              'laptop, or server. Which process on this specific machine started which other process, ' +
              'what exactly a suspicious file did after it ran, what it touched on that machine disk. ' +
              'Its strength is the fine-grained detail a log summary in a SIEM would never capture, and ' +
              'unlike a SIEM, a modern EDR can also act directly, isolating a single infected machine ' +
              'from the network at the click of a button in its console.\n\n' +
              'A case or ticketing system answers a third, entirely different kind of question, about ' +
              'the WORK itself rather than the systems: what was decided, by whom, when, and what ' +
              'happened as a result. It is the only one of the three tools that remembers why a human ' +
              'made a particular call, which is exactly why it is the record an audit or legal review ' +
              'asks for afterwards.\n\n' +
              'The specific nuance this exercise is testing is what happens when you reach for the ' +
              'wrong one anyway, usually because it is the tool you already have open, rather than the ' +
              'tool that actually holds the answer to your question. That habit, more than any lack of ' +
              'skill, is the single most common way a working hour quietly disappears on a SOC floor.',
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
            'The habit worth building before you ever start searching is to say out loud, or at least ' +
            'ask yourself deliberately, which tool should actually hold the answer to this specific ' +
            'question, before opening anything. It takes five seconds, and the reason it is worth the ' +
            'pause is that the alternative, digging through the wrong tool out of habit, is the ' +
            'difference between a five-minute question and a lost morning.',
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
              'A dishwasher is a good use of automation: washing plates is repetitive, there is one ' +
              'correct outcome (clean plates), and if it fails, the cost is rewashing a plate. Nobody ' +
              'would build a machine that automatically decides to evict a tenant based on a noise ' +
              'complaint, because that decision has real, hard-to-reverse consequences for a real ' +
              'person if the machine gets it wrong. Deciding what to automate in a SOC follows the same ' +
              'logic as those two examples.\n\n' +
              'This kind of automation is often sold as a product called SOAR, short for Security ' +
              'Orchestration, Automation and Response, and it is worth exactly as much as the human ' +
              'judgement it genuinely frees up, no more. The rule for what belongs in it is simple: work ' +
              'that is repetitive, that has one clearly correct answer, and whose failure, if the ' +
              'automation gets it wrong, is cheap and visible.\n\n' +
              'That description covers more than it might sound like. Enriching an alert with context ' +
              'an operator would have looked up manually anyway, pulling information from three systems ' +
              'into one combined view, opening and routing a ticket to the right queue, closing a whole ' +
              'class of alert that has already been proven, repeatedly, to be benign. All of that is ' +
              'clerical, repetitive work that a machine does faster and no worse than a person.\n\n' +
              'What must never be automated is the judgement itself, and specifically anything ' +
              'IRREVERSIBLE done purely on an inference, meaning a guess based on a pattern rather than ' +
              'a certainty. Automatically disabling any account that trips a medium-confidence alert ' +
              'sounds efficient right up until it locks a surgeon out of a hospital system mid-shift, and ' +
              'when that goes wrong, the SOC is not the one who pays the real cost. The actual test to ' +
              'apply is whether a wrong decision can be cheaply undone: enrichment that turns out wrong ' +
              'wastes a minute of somebody time; containment that turns out wrong can stop a hospital.',
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
            'It is worth noticing exactly what option C carries with it beyond the auto-closure itself: ' +
            'a record of each closure. The reason that record matters is that automation nobody can ' +
            'audit afterwards is functionally indistinguishable from alerts simply being silently ' +
            'dropped, and those two things are very different: one is a documented, defensible ' +
            'decision, the other is an invisible gap in coverage.',
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
              'It is a completely natural first instinct to think the real work is the investigation, ' +
              'the actual looking and reasoning, and the ticket is just paperwork attached to it ' +
              'afterwards. It is genuinely the other way round, and understanding why requires thinking ' +
              'about what happens to the investigation itself once it is over.\n\n' +
              'An investigation that only ever existed inside one person head disappears the moment ' +
              'that person moves on to the next alert, goes home, or leaves the company. It cannot be ' +
              'read by anyone else, checked later, or built on. The ticket is the only part of the work ' +
              'that survives long enough to be used by somebody other than the person who did it.\n\n' +
              'Three specific things depend on that written record existing. CONTINUITY: shifts hand ' +
              'over constantly on a round-the-clock operation, and the next operator either reads what ' +
              'was found and picks up where it left off, or has no choice but to start again from ' +
              'nothing. PATTERN: closing one alert as benign tells nobody anything useful, but forty ' +
              'tickets closed for the exact same reason is a tuning case a detection engineer can ' +
              'actually act on, and that pattern is only visible at all if each reason was written down ' +
              'somewhere searchable. And ACCOUNTABILITY: when an incident gets reviewed months later, ' +
              'the question asked is always what was known and decided at the time, and a decision with ' +
              'no record is, to anyone reviewing it afterwards, indistinguishable from no decision ' +
              'having been made at all.\n\n' +
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
            'The reason this is worth internalising early, before it costs you anything, is a fact ' +
            'about visibility: a manager cannot see an investigation that happened only inside your ' +
            'head, only the record you left of it. Operators who write good tickets consistently get ' +
            'noticed and promoted faster than operators who simply close more of them, because the ' +
            'ticket is the only part of the work a manager, or anyone else, can actually see and judge.',
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
              'A driving instructor who has only ever taught in one brand of car can still drive any ' +
              'other car competently within a few minutes, because the actual skill, judging distance, ' +
              'reading the road, controlling the vehicle, is not tied to one specific dashboard layout. ' +
              'Job adverts asking for years of experience in one specific security product make the ' +
              'same mistake a nervous learner driver would make: confusing the specific dashboard with ' +
              'the underlying skill.\n\n' +
              'Job adverts name a specific product, like Splunk (a well-known SIEM), simply because ' +
              'whoever wrote the advert was describing the tool their own team already owns. What that ' +
              'team actually needs, underneath the product name, is somebody who can take a question, ' +
              'turn it into a search, read what comes back critically, and recognise when an answer ' +
              'looks wrong.\n\n' +
              'That underlying skill transfers almost completely between products. Every one of these ' +
              'tools query languages differs in exact syntax, the specific words and punctuation you ' +
              'type, but they share the same underlying shape: filter down to the events you care ' +
              'about, pull out a specific field, group similar things together and count them, sort the ' +
              'result. Somebody genuinely fluent in one such language becomes productive in a different ' +
              'one within about a week, and any hiring manager who has actually done this job knows ' +
              'that from direct experience.\n\n' +
              'Two honest caveats are worth holding alongside that, though, because the confident answer ' +
              'above is not the whole picture. First, naming a specific product credibly is still worth ' +
              'real money at interview, since it removes doubt from a panel mind, so spending an evening ' +
              'in a free tier of a common tool, enough to say honestly that you have used it, is time ' +
              'well spent. Second, a hard requirement is occasionally genuinely hard rather than just ' +
              'lazily written, usually because of a client contract or a certification the employer has ' +
              'to formally evidence to someone else. The right move either way is to read the advert, ' +
              'apply anyway, and describe the transferable skill honestly rather than pretending to ' +
              'product experience you do not have.',
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
            'This misunderstanding, treating an unfamiliar product name as a hard wall rather than a ' +
            'detail, is one of the single most common reasons capable career changers rule themselves ' +
            'out of roles they would actually get if they applied. The product list on an advert is a ' +
            'description of the toolbox the team happens to own, not a description of the person they ' +
            'need.',
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
              'This module shifts from what the job is to what living inside it actually feels like, ' +
              'week to week. Start with the part people underestimate most before they take the job: ' +
              'the schedule itself.\n\n' +
              'A ROTA is simply a schedule showing who is working which shift and when, and a "24 by 7 ' +
              'rota" means the team covers every hour of every day, including nights and weekends, ' +
              'with different people rotating through those hours. Most Tier 1 SOC roles run this way, ' +
              'for a very direct reason: attackers do not keep office hours, so a SOC that only watches ' +
              'nine to five is only watching a third of the day. This is worth knowing clearly before ' +
              'you accept a role rather than discovering it after, and it is genuinely the single most ' +
              'common reason people leave a first security role they were otherwise good at.\n\n' +
              'The trade is real in both directions, not simply a cost to be endured. Shift work ' +
              'usually pays more than an equivalent daytime role, often substantially so, and night ' +
              'shifts tend to be genuinely quieter, meaning more time available to read, study, and ' +
              'learn the environment than a busy day operator ever gets. A meaningful number of people ' +
              'choose a year of shift work deliberately for exactly this reason, learn faster than ' +
              'their daytime peers as a result, and move into a business-hours role once they have.\n\n' +
              'The costs are equally real, and importantly, they are not spread evenly across everyone: ' +
              'a rota that ROTATES, meaning it changes which hours you work every week or two, is ' +
              'noticeably harder on the body and on anyone with caring responsibilities or a partner ' +
              'working a fixed schedule than a FIXED rota, where you consistently work the same shift ' +
              'pattern. A fixed night rota, oddly, is often easier to build a life around than one that ' +
              'keeps changing under you. The specific nuance worth acting on is that job adverts almost ' +
              'never state which kind of rota a team actually runs, so it has to be asked about ' +
              'directly rather than assumed.',
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
            'The reason it is worth asking rather than assuming is that the answers reveal how the ' +
            'team is actually run, not just what hours you would work. Ask three specific questions at ' +
            'interview: is the pattern fixed or rotating, how many people cover the night shift, and ' +
            'what happens when somebody is off sick. Together, the answers tell you far more about the ' +
            'team you would actually be joining than anything written on the advert itself.',
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
              'Think about the difference between a diary entry and a briefing note handed to someone ' +
              'about to take over your car halfway through a long road trip. A diary entry describes ' +
              'everything that happened to you. A briefing note tells the next driver only what they ' +
              'need to know right now: how much fuel is left, where you are headed, and anything ' +
              'unusual about the car. A shift handover in a SOC is a briefing note, not a diary entry, ' +
              'and mixing the two up is the most common mistake a new operator makes with it.\n\n' +
              'A handover is written for somebody who is about to become personally responsible for ' +
              'whatever you are describing, and it should be written for their next hour, not as a ' +
              'summary of your last eight. Three specific things belong in it. WHAT IS STILL LIVE AND ' +
              'WAITING ON SOMETHING, stated along with exactly what it is waiting for, so the incoming ' +
              'operator knows what to actively chase rather than stumbling onto it cold at midnight. ' +
              'WHAT HAS ALREADY BEEN ESCALATED AND TO WHOM, so nobody escalates the same thing twice, ' +
              'and nobody wrongly assumes somebody already has it covered. And ANYTHING RECURRING, ' +
              'because a single detection that has fired eleven times in one shift is not eleven ' +
              'separate pieces of news, it is one underlying tuning problem, and naming it as one thing ' +
              'stops the next person from re-investigating the same noise from scratch.\n\n' +
              'The specific nuance this exercise is testing is what NOT to include: everything that is ' +
              'finished, resolved, and unremarkable should be left out entirely. A handover that ' +
              'dutifully lists all forty alerts closed during the shift, most of which needed no ' +
              'follow-up at all, buries the three things that actually matter under noise, and a ' +
              'handover nobody reads all the way through is functionally identical to never having ' +
              'written one.',
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
            'The eleven firings are the specific part of this exercise most people get wrong, and the ' +
            'reason it matters so much is what each framing does for the next reader: reporting it as ' +
            'eleven separate alerts is technically accurate and practically useless, because it gives ' +
            'the next operator nothing to act on beyond repeating the same closure eleven more times ' +
            'tomorrow. Reporting it as one tuning case is what actually gets the underlying noise fixed ' +
            'for everybody, permanently, instead of endured by everybody, forever.',
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
              'Ask a proofreader to check the same single sentence for typos two hundred times in a row ' +
              'and, by the two hundredth pass, their eyes will slide over an obvious mistake they would ' +
              'have caught instantly the first time. This is not because they stopped caring, it is ' +
              'because human attention genuinely, predictably degrades under enough repetition. That ' +
              'exact mechanism, not a character flaw, is what alert fatigue actually is.\n\n' +
              'Alert fatigue happens to anybody working a queue that is overwhelmingly false, which, as ' +
              'this package established early on, describes almost every real SOC queue. After several ' +
              'hundred alerts in a row that all turned out to be nothing, the brain stops genuinely ' +
              'assessing each new one on its own merits and starts pattern-matching toward the outcome ' +
              'it has learned to expect, which is closure. It happens even to the most conscientious ' +
              'people, it happens quickly, often within a single long shift, and it says nothing about ' +
              'someone character or work ethic.\n\n' +
              'The specific nuance worth understanding is why the interventions managers usually reach ' +
              'for first do not actually work. Telling people to be more careful accomplishes nothing, ' +
              'because they are already trying as hard as they can, the mechanism causing the misses is ' +
              'physiological, not a lack of effort. Adding a second reviewer to double-check doubles the ' +
              'cost and simply produces two fatigued people staring at the same noise instead of one. ' +
              'Measuring people on how many alerts they close per hour makes the problem actively worse, ' +
              'because it explicitly rewards the exact fast, shallow behaviour that causes real alerts ' +
              'to get missed.\n\n' +
              'What actually works is attacking the cause rather than the symptom: reducing the sheer ' +
              'volume, by tuning the specific detections producing the noise, automating the closures ' +
              'that are already provably benign, and keeping the queue at a size a human can genuinely ' +
              'give real attention to. This is why tuning is treated as first-class, ongoing work in a ' +
              'healthy SOC rather than something squeezed in when there happens to be spare time, and ' +
              'why an operator who carefully documents exactly why an alert was benign is doing the ' +
              'work that eventually fixes the underlying problem for everyone, not just filling in a ' +
              'form.',
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
            'The reason these two numbers point in such different directions is what each one actually ' +
            'measures. If you ever end up running a queue yourself, watch the false positive rate ' +
            'rather than the closure rate: one of those numbers tells you honestly whether the work in ' +
            'front of your team is even humanly possible at that volume, while the other only tells you ' +
            'how quickly people are being pushed toward giving up on genuinely assessing each alert.',
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
              'A school that only ever measures pass rates on an easy test will see that number climb ' +
              'every year, right up until it becomes obvious that students learned to pass the easy ' +
              'test rather than to actually understand the subject. A METRIC is simply a number chosen ' +
              'to track how well something is going, and once you announce that a specific number is ' +
              'being watched and judged, people, entirely rationally, start optimising to move that ' +
              'number, whether or not moving it actually reflects doing better work.\n\n' +
              'That means every metric functions as an instruction whether it was meant to or not, and ' +
              'the only genuinely useful question to ask about a proposed one is what behaviour it will ' +
              'produce in somebody under real pressure to improve it, especially under pressure that ' +
              'makes cutting a corner tempting.\n\n' +
              'Good SOC metrics point at the OUTCOME the SOC actually exists to produce, rather than at ' +
              'raw activity. How long it takes to detect a real incident, and how long from there to ' +
              'contain it, both directly measure the thing covered earlier in this package as MTTD and ' +
              'MTTR, the actual purpose of the SOC. The proportion of alerts that turn out to be false ' +
              'measures whether the queue is even humanly workable, tying directly back to the alert ' +
              'fatigue mechanism just covered. Detection coverage measured against a recognised ' +
              'framework measures whether the SOC can actually see the kinds of attacks that matter, ' +
              'rather than only the ones somebody happened to write a rule for already.\n\n' +
              'Bad metrics measure raw activity instead, and are trivially gamed as a direct ' +
              'consequence. Alerts closed per operator per hour rewards fast, shallow closure regardless ' +
              'of whether it was correct, which is precisely the behaviour behind missed real incidents. ' +
              'Raw number of alerts generated rewards detections that are noisy rather than accurate. ' +
              'Both of those can produce a chart that climbs steadily upward every quarter while the ' +
              'actual SOC quietly gets worse underneath it, which is close to the worst possible outcome, ' +
              'because a good-looking chart removes exactly the pressure that would otherwise force ' +
              'somebody to fix the real problem.',
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
            'Whatever seat you end up in, you will be measured on something, whether or not you get a ' +
            'say in choosing it. Being able to predict what a proposed metric will actually do to ' +
            'behaviour, before it gets rolled out and the damage is already done, is a genuinely senior ' +
            'skill, and it is worth practising the habit of asking that question long before anybody in ' +
            'a room actually asks for your opinion on one.',
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
              'An experienced security guard walking the same building every night for years develops ' +
              'a feel for it: they know instinctively which door is normally locked, what the building ' +
              'sounds like at 3am, which shadows are always there. A brand new guard on the same beat ' +
              'sees only shapes and darkness, with no way yet to tell odd from ordinary. The difference ' +
              'between them was not built during a break-in, it was built on hundreds of uneventful ' +
              'nights that the new guard has not lived through yet.\n\n' +
              'Most SOC shifts contain no real incident at all, and what an operator chooses to do with ' +
              'those quiet hours is most of what separates somebody who gets promoted within a year ' +
              'from somebody still stuck on exactly the same queue three years later.\n\n' +
              'The genuinely productive uses of quiet time are all, in one way or another, forms of ' +
              'turning today experience into something that pays off later. Reading back through ' +
              'recently closed alerts to check whether you would still make the same call on them now. ' +
              'Documenting a noisy detection thoroughly enough that a detection engineer can actually ' +
              'tune it, rather than just closing it and moving on. Deliberately learning the ' +
              'environment, which servers exist, what normal traffic actually looks like, where the ' +
              'most valuable data in the whole company physically sits, so that when something genuinely ' +
              'abnormal appears later, it is instantly recognisable rather than something you have to ' +
              'painstakingly work out from scratch under pressure. Following up open threads left ' +
              'behind by earlier shifts before they go completely cold.\n\n' +
              'The nuance that makes all of that count as the actual job, rather than optional ' +
              'self-improvement squeezed in on the side, is this: a quiet queue is not evidence that ' +
              'everything is safe, it is simply the only time available to build the instinct that ' +
              'catches the thing that is not safe, later. An operator who has learned the estate spots ' +
              'the odd thing in seconds, the way that experienced guard does. One who has not, never ' +
              'quite spots it at all, no matter how carefully they look in the moment.',
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
            'Nearly every experienced analyst, asked directly, can name the specific quiet month or ' +
            'two when they actually learned the network inside and out, and can usually connect it to ' +
            'a moment later when that knowledge let them catch something nobody else noticed. It is the ' +
            'least visible, least glamorous, and most valuable thing you will do in your entire first ' +
            'year in this field.',
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
              'This final module turns from the job itself to the practical question of getting hired ' +
              'into it and moving on from it, since for most people reading this, that is the actual ' +
              'reason they are here.\n\n' +
              'Start with the interview itself, and a piece of reassurance worth taking seriously: ' +
              'nobody hiring for a Tier 1 role genuinely expects a candidate to already know their ' +
              'specific environment, their particular tooling, or the fine detail of their threat ' +
              'landscape. A competent employer expects to teach all of that on the job. What cannot be ' +
              'taught quickly, in a few weeks of onboarding, is how a person actually thinks under ' +
              'pressure, so that is what interview questions are almost always actually probing for, ' +
              'even when they sound like they are asking about something else.\n\n' +
              'Four things tend to be under real assessment. STRUCTURED REASONING: given a deliberately ' +
              'ambiguous scenario, does the candidate ask sensible questions in a sensible order, or ' +
              'jump straight to guessing an answer. HONESTY UNDER UNCERTAINTY: can the candidate say ' +
              'plainly that they do not know something, and then describe exactly how they would go ' +
              'about finding out, which is genuinely the single strongest answer available to anyone ' +
              'junior, precisely because it is rare. CURIOSITY: has this person looked into anything on ' +
              'their own initiative, unprompted, and can they actually talk about it in detail. And ' +
              'RELIABILITY: a round-the-clock rota depends entirely on people consistently turning up ' +
              'and doing what they said they would, and a SOC will choose a dependable learner over a ' +
              'brilliant but unreliable candidate every single time, because one missed night shift can ' +
              'leave a whole team exposed.\n\n' +
              'What is specifically NOT being assessed, despite how it can feel in the room, is whether ' +
              'a candidate can recite technical trivia like port numbers from memory. Some interviewers ' +
              'still ask questions like that out of habit, but the actual answer given matters far less ' +
              'than what the candidate does the moment they hit one they genuinely do not know.',
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
            'The reason this specific line is worth rehearsing, and not just understanding ' +
            'intellectually, is that it rarely comes naturally under interview pressure, where the ' +
            'instinct is to guess rather than admit a gap. Practise saying "I do not know, here is how ' +
            'I would find out" out loud, ahead of time, until it feels comfortable rather than like an ' +
            'admission of failure. It is the answer that quietly separates candidates from each other, ' +
            'and almost nobody walks in having actually rehearsed it.',
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
              'A driving test certificate proves someone learned the rules of the road and can handle a ' +
              'car under controlled conditions. It does not prove they can safely navigate a genuine ' +
              'emergency at speed on ice, that only comes from actually having driven in difficult ' +
              'conditions. A security certification works the same way, and understanding exactly what ' +
              'it does and does not prove saves a lot of wasted time and money.\n\n' +
              'A CERTIFICATION is a credential earned by passing an exam, usually multiple choice, ' +
              'covering a defined body of knowledge. It does one job genuinely well: it gets a CV past ' +
              'an automated or HR filter before a human ever reads it properly. Many organisations, and ' +
              'nearly all government or defence-related work, screen candidates on specific ' +
              'certifications before anything else happens, which means in those specific places, a ' +
              'missing certificate is not just a mild preference against you, it is a hard wall you ' +
              'cannot get past regardless of ability.\n\n' +
              'They also do something genuinely useful for a total beginner specifically: they hand you ' +
              'a structured syllabus when you do not yet even know what you do not know, which is ' +
              'valuable precisely because starting from nothing, with no map at all, is disorienting.\n\n' +
              'What a certification cannot do, and this is the nuance that trips up career changers who ' +
              'invest heavily in stacking them, is demonstrate that you can actually do the work. Every ' +
              'experienced person on a hiring panel knows the underlying exam was multiple choice, so a ' +
              'certificate opens the door to a conversation, it does not win the conversation on its ' +
              'own. Real evidence wins it: something you built yourself, an investigation you can walk ' +
              'someone through in detail, a home lab, a written analysis. The strongest position for ' +
              'anyone changing careers into this field is one screening certificate combined with one ' +
              'genuine piece of work you can discuss in real depth, and it is the second half of that ' +
              'pairing that people most often skip.',
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
            'The reason this priority order matters practically is that these two things solve two ' +
            'different problems: getting your CV in front of a human, and convincing that human to ' +
            'actually hire you once it is there. If you are ever choosing between studying for a second ' +
            'certificate and finishing something you could actually demonstrate, finish the thing. The ' +
            'certificate is what gets your application read; the demonstrable work is what gets you ' +
            'hired.',
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
              'Ask most beginners to describe an investigation and they will tell you what they found, ' +
              'as if the answer were the whole story. It is genuinely the least interesting part of the ' +
              'answer to an interviewer, and understanding why reframes the whole question.\n\n' +
              'A hiring panel, asking someone to walk through an investigation, already assumes it more ' +
              'or less worked out, because the candidate chose to bring it up. What they are actually ' +
              'listening for is HOW the candidate got there, because that reasoning process is the part ' +
              'that predicts how they will handle the next unfamiliar problem, one where the panel does ' +
              'not already know the answer.\n\n' +
              'A strong answer has four distinct moves. THE QUESTION being answered, stated plainly at ' +
              'the start, because a specific starting question, rather than a vague wander through some ' +
              'logs, shows the work had real direction. WHAT WAS LOOKED AT AND WHY THAT SOURCE ' +
              'SPECIFICALLY, which is exactly where the reasoning becomes visible to somebody who ' +
              'cannot see inside the candidate head. WHAT SURPRISED THEM, or what they initially got ' +
              'wrong and had to correct, which is the single most credible thing a junior candidate can ' +
              'say, and almost nobody says it, because it feels risky to admit rather than impressive. ' +
              'And WHAT WAS CONCLUDED, stated honestly along with its limits: what could actually be ' +
              'established from the evidence, and what genuinely remained unknown.\n\n' +
              'It does not need to have been a real breach at a real company. A home lab exercise, a ' +
              'training scenario, or a public dataset is completely acceptable and expected for someone ' +
              'starting out, and being straightforward about that fact is far stronger in front of a ' +
              'panel than quietly dressing it up as something more dramatic than it actually was.',
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
            'The third move, admitting what surprised you or what you initially got wrong, is ' +
            'consistently the one that actually gets people hired, and the reason is what it signals: a ' +
            'candidate who describes catching and correcting their own mistake is demonstrating, live in ' +
            'the interview, the single most useful daily habit in this entire job, checking yourself ' +
            'before a wrong assumption becomes a wrong decision.',
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
              'Think of Tier 1 as the ground floor of a building with many different upper floors, not ' +
              'as a room you get stuck in. It is a genuine starting position, and it is explicitly meant ' +
              'to be left eventually, that is how it is designed to work. It is also unusually good as a ' +
              'first role for a reason worth naming directly: it exposes you to the whole estate and to ' +
              'every kind of alert that comes through, which means you find out, from direct experience ' +
              'rather than guesswork, what kind of work you actually enjoy before committing years to it.\n\n' +
              'The common routes upward and outward are all genuinely visible from the floor itself, ' +
              'once you know to look for them. Tier 2 and incident response, for people who find they ' +
              'want the deeper investigation more than the fast triage. Detection engineering, for ' +
              'people who keep noticing a rule is subtly wrong and want to be the one who fixes it, ' +
              'which is a natural next step for anybody who has already been carefully documenting why ' +
              'alerts were benign, as covered earlier in this package. Threat intelligence, for people ' +
              'drawn more to understanding the adversary behind an attack than to the individual event ' +
              'itself. Threat hunting, which usually wants a couple of years of built-up pattern ' +
              'recognition first, the same instinct that experienced security guard develops over many ' +
              'quiet nights. And moving out of the SOC entirely into security engineering, cloud ' +
              'security, or governance, risk, and compliance work.\n\n' +
              'What genuinely does not happen, and this is the specific nuance worth being clear-eyed ' +
              'about, is jumping straight into any of those specialist seats with no operational time ' +
              'served first. That restriction is not gatekeeping for its own sake: every one of those ' +
              'specialisms depends on already knowing what normal looks like across a real environment, ' +
              'and the queue, as tedious as it can feel, is where that foundation actually gets built.',
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
            'The practical takeaway from all of this is to pick a direction within your first six ' +
            'months on the floor and start deliberately bending your spare time toward it, rather than ' +
            'waiting passively to see what comes along. The reason that matters is that the people who ' +
            'move fastest through this field are consistently the ones who actively chose a direction ' +
            'for themselves, not the ones who waited around to be chosen by somebody else.',
          practice: [],
        },
      ],
    },
  ],
};
