/**
 * Security Engineering Foundations: building and owning the controls other
 * roles depend on.
 *
 * WHO THIS IS FOR
 *
 * This track draws from systems and network administration rather than from
 * security itself, and the reason is that the underlying skill already
 * transfers. Somebody who has managed a fleet of servers, planned a change
 * window, and lived through a rollout that went wrong at 2am already has most
 * of what this seat needs. What they are missing is not a technical skill so
 * much as a second question layered on top of the first one: not just does
 * this configuration work, but what is it defending against, and does the
 * exception somebody is requesting quietly defeat it.
 *
 * That is also what separates this seat from its neighbours. A SOC analyst
 * monitors: they work from telemetry and controls somebody else already
 * built. A GRC analyst assesses: they judge whether a control meets a
 * standard, usually without touching the control itself. An AppSec engineer
 * reviews: they find and help fix problems in code the organisation writes.
 * The security engineer is the one who builds the segmentation the SOC's
 * containment plan assumes exists, the baseline the GRC analyst checks
 * compliance against, and the pipeline the AppSec engineer's findings get
 * remediated through. This package spends its first module making that
 * distinction explicit, because a student who does not know which seat they
 * are training for will misjudge every exercise after it.
 *
 * WHY IT NEEDS NO TERMINAL
 *
 * There is no simulated fleet of hosts to harden in this platform, no
 * simulated network topology to segment, and no simulated logging pipeline to
 * build, and inventing thin versions of any of them would teach a toy rather
 * than the judgement. The actual skill this seat trades on is not typing the
 * command that disables a legacy protocol, it is deciding which protocol is
 * safe to disable, reading an exception request and telling a real
 * constraint from a convenient one, and reasoning about why a change that
 * held in a fifty-host pilot can still take down a five-thousand-host estate.
 * None of that requires a shell. Every exercise here grades a determination:
 * what to collect, what to approve, what to trust, and what a rollout plan
 * is missing, which is most of the job anyway once you are past your first
 * few months in the role.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

// --- Module sef.1: what this seat builds -------------------------------------

const ROLE_TEACH = {
  concept:
    'Start with a question worth asking before any job title: what does the word "security" at a ' +
    'company actually cover? It sounds like one job, the way "doctor" sounds like one job, but a ' +
    'hospital is not one person doing one task. A nurse watches monitors and reacts to what changes ' +
    'on them. A building inspector checks the wiring and plumbing against a code book, without ' +
    'treating anyone. A surgeon fixes one specific problem inside one specific patient. And somebody ' +
    'designed and built the hospital\'s walls, power, and water in the first place, the thing the ' +
    'other three depend on already existing and working before they can do anything at all.\n\n' +
    'Security work at a company splits the same four ways, and mixing them up is what costs people ' +
    'interviews.\n\n' +
    'A SOC ANALYST is the nurse: they watch ALERTS, automatic warnings a system raises when something ' +
    'looks wrong, and the TELEMETRY, the constant stream of activity data, feeding those warnings, and ' +
    'decide what is real. None of that watching is possible unless somebody else already built the ' +
    'sensors and the pipeline carrying the data to them. A GRC ANALYST is the inspector: GRC stands ' +
    'for governance, risk, and compliance, and the job is judging whether a CONTROL, a safeguard ' +
    'already in place, actually meets a written rule a regulator or an industry body expects followed, ' +
    'and writing up what does and does not, generally without touching the control themselves. An ' +
    'APPSEC ENGINEER is the surgeon: AppSec is short for application security, finding and helping fix ' +
    'weaknesses that let someone do something they should not, inside code the company itself writes, ' +
    'working closely with the developers who wrote it.\n\n' +
    'A SECURITY ENGINEER is the one who built the hospital. They design, deploy, and keep running the ' +
    'controls the other three depend on: the boundary that is supposed to contain an incident once the ' +
    'SOC analyst spots one, the baseline the GRC analyst checks compliance against, the pipeline the ' +
    'AppSec engineer\'s findings get fixed through. Nothing the other three do works if this seat has ' +
    'not already built it.',
} as const;

const OWNERSHIP_TEACH = {
  concept:
    'Think about the difference between telling someone their house needs a better lock and actually ' +
    'installing it, keeping the key, and being the person they call at midnight when it jams. Both ' +
    'are useful. Only one of them means you are still involved after the work is done. That is the ' +
    'difference this module keeps returning to: recommending a safeguard versus owning one.\n\n' +
    'A CONTROL, in this line of work, just means a safeguard: a setting, a boundary, a rule enforced ' +
    'somewhere, that is meant to stop something bad from happening. Recommending one ends the moment ' +
    'a document describing it gets approved. Owning one means the control is now something you are on ' +
    'call for: if a boundary you built has a gap nobody tracked, or a change you rolled out breaks a ' +
    'business process on a public holiday, that is your problem to fix, not a monitoring team\'s. ' +
    'Engineering decisions also get judged much later than they get made, often by somebody ' +
    'troubleshooting a failure years afterward who has never heard of the person who built the thing ' +
    'they are now trying to understand.\n\n' +
    'This is also why how easy a control is to live with matters as much as how strong it is. A ' +
    'safeguard that is airtight on paper but too disruptive in daily use does not stay unused, it gets ' +
    'worked around, quietly, by whoever it was slowing down, using whatever shortcut gets the job ' +
    'done. That workaround is usually worse than the gap the control was trying to close in the first ' +
    'place, because now nobody even knows the gap is open again.',
} as const;

const MODULE_SEF_1: Exercise[] = [
  {
    id: 'sef.1.1',
    moduleId: 'sef.1',
    packageId: 'security-engineering-foundations',
    order: 1,
    title: 'Four roles, four different jobs',
    kind: 'multiple-choice',
    goal: 'Separate what a security engineer builds from what a SOC analyst, GRC analyst and AppSec engineer each do.',
    prompt:
      'A hiring manager asks you to explain how a security engineer differs from a SOC analyst, a ' +
      'GRC analyst and an AppSec engineer. Which of the following are accurate? Select all that ' +
      'apply.',
    teach: ROLE_TEACH,
    options: [
      { id: 'a', label: 'A SOC analyst\'s job assumes sensors and log pipelines that someone else already built and deployed.' },
      { id: 'b', label: 'A GRC analyst assesses whether a control meets a standard, and generally does not implement the control themselves.' },
      { id: 'c', label: 'An AppSec engineer\'s focus is vulnerabilities in code the organisation writes, distinct from infrastructure configuration.' },
      { id: 'd', label: 'A security engineer builds and keeps running the controls the other three roles depend on or check against.' },
      { id: 'e', label: 'Anyone doing security work is functionally interchangeable across these four roles, since they all end up reporting the same kinds of findings.' },
    ],
    hints: [
      'Four of these describe a genuine, separate job. One treats "security" as a single interchangeable skill set.',
      'Ask what each role would be unable to do their job without: for the SOC analyst, that is a pipeline somebody else built.',
      'The wrong option is the one that would make specialising in any of these four pointless.',
    ],
    solution:
      'A, B, C, and D. Monitoring, assessing, reviewing code, and building and owning controls are ' +
      'four separate jobs that happen to share a department. E is the collapse that costs people ' +
      'interviews: an organisation hiring a security engineer is not looking for a generalist who has ' +
      'done some security work, they are looking for somebody who can build and operate ' +
      'infrastructure, which a SOC or GRC background does not by itself demonstrate.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats all four roles as functionally the same job.',
      },
    ],
    debrief:
      'Keep the four in mind: nurse, inspector, surgeon, builder. Every module from here on is about ' +
      'the builder\'s job, the one that has to exist before the other three can do theirs.',
    practice: [],
  },
  {
    id: 'sef.1.2',
    moduleId: 'sef.1',
    packageId: 'security-engineering-foundations',
    order: 2,
    title: 'What owning a control actually means',
    kind: 'multiple-choice',
    goal: 'Understand ownership as an ongoing, operational responsibility rather than a one-time design task.',
    prompt:
      'A colleague says "I already designed the segmentation policy, so my part is done." Which of ' +
      'the following are accurate about what ownership of a control involves? Select all that apply.',
    teach: OWNERSHIP_TEACH,
    options: [
      { id: 'a', label: 'If a control an engineer built causes an outage, the engineer is generally in the incident response chain for it, not just whoever noticed the outage.' },
      { id: 'b', label: 'A control that is secure in theory but too disruptive to use in practice tends to get worked around rather than complied with.' },
      { id: 'c', label: 'Ownership here mostly means writing the initial design document; once deployed, day-to-day operation is somebody else\'s job.' },
      { id: 'd', label: 'Engineering decisions are often judged years later, by people troubleshooting an outage who have never heard of the person who built the control.' },
      { id: 'e', label: 'Whether a control keeps running correctly under real conditions is part of the job, not a separate operations concern.' },
    ],
    hints: [
      'Four describe what ownership actually is. One describes ownership stopping at the design document.',
      'Ask who gets paged when the control fails eighteen months from now.',
      'A control nobody maintains and nobody is accountable for is not really owned by anyone.',
    ],
    solution:
      'A, B, D, and E. Ownership follows the control past deployment: into incident response when it ' +
      'fails, into the workaround it provokes if it is too disruptive, and into the years afterward ' +
      'when somebody else has to make sense of it. C describes design without ownership, which is ' +
      'exactly the gap this module is naming: a document that nobody keeps running is a ' +
      'recommendation, not a control.',
    expectedOutput: 'Options A, B, D, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd', 'e'],
        hint: 'One option treats ownership as ending once the design document is written.',
      },
    ],
    debrief:
      'This is the question to test any safeguard against: who is on call for it, right now, and ' +
      'would they even know it exists if their phone rang about it tonight.',
    practice: [],
  },
  {
    id: 'sef.1.3',
    moduleId: 'sef.1',
    packageId: 'security-engineering-foundations',
    order: 3,
    title: 'Project work, not a shift queue',
    kind: 'multiple-choice',
    goal: 'Understand the project-based rhythm of security engineering work compared to reactive SOC work.',
    prompt:
      'You are describing a typical week in this seat to someone from a SOC background. Which of the ' +
      'following are accurate? Select all that apply.',
    teach: {
      concept:
        'Picture two very different jobs at a hospital. An emergency room nurse works a shift: ' +
        'patients arrive unpredictably, the nurse handles what is in front of them, and at the end of ' +
        'the shift the queue hands off to the next nurse, empty or not. A construction crew renovating ' +
        'a wing works a project: there is a start date, a plan, a sequence of stages, and an end date ' +
        'when the wing reopens. Both are real hospital work. They do not feel the same day to day.\n\n' +
        'SOC work is the shift: an alert fires, an analyst responds, and the queue resets next shift, ' +
        'whether or not everything got resolved. Security engineering work is the renovation: it is ' +
        'structured around PROJECTS, pieces of work with a defined start and end, such as segmenting a ' +
        'network, rolling out a new agent to every machine in the company, replacing an old baseline ' +
        'configuration, or turning off a legacy protocol nobody should be using anymore.\n\n' +
        'It still has interrupt-driven moments, most often around a scheduled window for making a ' +
        'change, or an incident that reveals a gap the engineer is now asked to close for good, and ' +
        'that reactive edge is real rather than absent. But the default unit of work is a project with ' +
        'a plan, usually tried out on a small group first, then rolled out in stages, not a queue of ' +
        'tickets that empties and refills every shift. Windows for making changes landing in the ' +
        'evening or on a weekend are normal here for the same reason a hospital schedules elective ' +
        'renovation work overnight: it needs a period when a mistake affects the fewest people.',
    },
    options: [
      { id: 'a', label: 'The default unit of work is a project with a plan and a rollout, rather than a shift-based queue of incoming tickets.' },
      { id: 'b', label: 'Change windows, often evenings or weekends, are a normal part of the schedule because rollouts need a low-traffic period.' },
      { id: 'c', label: 'An incident can still generate reactive work for this seat, typically as a gap the engineer is now asked to close permanently.' },
      { id: 'd', label: 'Because the pace is project-based, deadlines here are generally softer than in a SOC and are rarely externally forced.' },
      { id: 'e', label: 'The work is planned enough that a rollout typically goes through a pilot group before reaching the full estate.' },
    ],
    hints: [
      'Four describe the real rhythm of the work. One assumes project-based means low-pressure.',
      'An audit finding, a vendor end-of-life date, or an executive mandate after an incident can force a deadline just as hard as an alert does.',
      'Being planned and being unhurried are not the same thing.',
    ],
    solution:
      'A, B, C, and E. Project structure, off-hours change windows, incident-driven follow-up work, ' +
      'and staged pilots are the real shape of the job. D is the mistake to avoid: audit findings, ' +
      'compliance deadlines, vendor end-of-life dates, and executive pressure after an incident all ' +
      'create hard external deadlines, and a project-based rhythm does not mean an unhurried one.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'One option assumes project-based work is rarely under external time pressure.',
      },
    ],
    debrief:
      'Notice which deadlines actually show up in this field: an auditor\'s finding, a vendor telling ' +
      'you support for something ends on a fixed date, and the aftermath of an incident. None of ' +
      'those are gentle, project plan or not.',
    practice: [],
  },
  {
    id: 'sef.1.4',
    moduleId: 'sef.1',
    packageId: 'security-engineering-foundations',
    order: 4,
    title: 'What qualifies someone for this seat',
    kind: 'multiple-choice',
    goal: 'Recognise which background genuinely prepares someone for security engineering.',
    prompt:
      'A systems administrator with no prior security title asks whether they are qualified to apply ' +
      'for a security engineering role. Which of the following are accurate? Select all that apply.',
    teach: {
      concept:
        'A "fleet" here just means every computer, server, and device a company runs, treated as one ' +
        'group to manage rather than one machine at a time, the way a delivery company manages its ' +
        'trucks as a fleet rather than caring for each van individually. A "systems administrator" or ' +
        '"network administrator" is someone whose job is keeping that fleet running: installing ' +
        'software across it, planning a change so it does not break things, and being the person who ' +
        'fixes it when a rollout goes wrong at two in the morning.\n\n' +
        'This seat draws heavily from that background because the actual skill overlaps directly: ' +
        'managing a fleet, planning and testing a change, and surviving a rollout that goes wrong are ' +
        'already core skills for an experienced administrator.\n\n' +
        'What gets added on top is threat judgement: being able to say what a safeguard is actually ' +
        'defending against, and whether a proposed change makes the company easier or harder for an ' +
        'attacker to break into, not only whether it is technically correct. That is learnable on the ' +
        'job and through study, and it is a much shorter distance to travel than the reverse direction, ' +
        'learning to manage infrastructure at scale from a background that never touched it.\n\n' +
        'Scripting and automation experience, meaning writing small programs that carry out a task ' +
        'automatically instead of a person doing it by hand each time, matters for a related reason: a ' +
        'safeguard that only works when someone applies it by hand, one machine at a time, does not ' +
        'survive contact with a fleet of five thousand hosts.',
    },
    options: [
      { id: 'a', label: 'Sysadmin or netadmin experience transfers directly, because managing a fleet and executing a safe change are already core skills.' },
      { id: 'b', label: 'The additional skill this seat requires is threat judgement: being able to say what a control defends against and whether a change increases exposure.' },
      { id: 'c', label: 'A background running change windows and staged rollouts is directly relevant experience for this seat.' },
      { id: 'd', label: 'Because it is a security role, a candidate should generally come from a SOC or GRC background first, then move across.' },
      { id: 'e', label: 'Scripting and automation experience matters here because rolling a control out to thousands of hosts by hand does not scale.' },
    ],
    hints: [
      'Four describe real, transferable qualification. One reasserts a prerequisite this field does not actually require.',
      'Ask which direction of travel is shorter: administrator learning threat judgement, or the reverse.',
      'This is the same trap the OT and identity tracks warn about: security-title-first is not the only route in, and often is not the fastest one.',
    ],
    solution:
      'A, B, C, and E. Fleet management, threat judgement as the genuinely new skill, change-window ' +
      'experience, and automation are all real qualification. D is the belief that keeps good ' +
      'candidates from applying: teams building security engineering capability routinely hire from ' +
      'administration and teach the security judgement, because the reverse route takes far longer.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'One option insists on a security title before this one, which is not how this field usually hires.',
      },
    ],
    debrief:
      'If you are moving from administration, you already hold the harder half of this job. This ' +
      'package spends its remaining modules on the half that is genuinely new: the threat judgement.',
    practice: [],
  },
  {
    id: 'sef.1.5',
    moduleId: 'sef.1',
    packageId: 'security-engineering-foundations',
    order: 5,
    title: 'Explain the move to a systems administrator',
    kind: 'short-answer',
    goal: 'Put into words what changes day to day when moving from administration into security engineering.',
    prompt:
      'A systems administrator with eight years managing a mixed Windows and Linux fleet asks what ' +
      'actually changes day to day if they move into security engineering. In three or four ' +
      'sentences, answer them.',
    teach: {
      concept:
        'A good answer to this question does two things at once: it is honest that most of the daily ' +
        'craft carries over unchanged, and it names the one specific thing that is genuinely new, ' +
        'rather than gesturing vaguely at "more security awareness."\n\n' +
        'What carries over: managing a fleet of machines as one group, planning a change safely, ' +
        'trying it on a small group before rolling it out everywhere. What changes is the question ' +
        'sitting behind the work. An administrator mainly asks will this configuration work. A ' +
        'security engineer asks that too, and then asks a second question on top of it: what is this ' +
        'configuration actually defending against, and does the exception somebody is requesting ' +
        'quietly undo that protection. Ownership also stretches further in time than a single ' +
        'deployment: a baseline that breaks something eighteen months from now is still your incident, ' +
        'the same way a building\'s original architect is still, in a sense, responsible for a wall ' +
        'that was built wrong, even years after they last visited the site.',
    },
    hints: [
      'Say what stays the same before you say what changes; both halves matter to this answer.',
      'Name the extra question layered on top of "does this work": what is it defending against.',
      'A strong answer also mentions that ownership runs longer here than a one-time deployment.',
    ],
    solution:
      'Most of what you already do carries over directly: managing a fleet, planning a safe change, ' +
      'running a pilot before the full rollout. What changes is the question behind the work. ' +
      'Instead of only asking will this configuration work, you are also asking what this ' +
      'configuration is defending against, and whether the exception someone is requesting quietly ' +
      'defeats it. You also own the result for longer than a deployment: if the baseline you rolled ' +
      'out breaks something eighteen months later, that is your incident, not just whoever happens ' +
      'to be on call that night.',
    expectedOutput:
      'An answer naming what carries over from administration, the added threat-judgement question, ' +
      'and the extended, ongoing nature of ownership.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['carries over', 'transfer', 'already do', 'fleet', 'rollout', 'change window', 'pilot'],
          ['threat', 'defend', 'defending', 'attacker', 'exploit', 'exception defeat', 'what it is protecting'],
          ['own', 'ownership', 'later', 'years', 'eighteen months', 'on call', 'incident'],
        ],
        hint:
          'Three ideas: what stays the same, the added question about what a control defends ' +
          'against, and the longer time horizon of ownership.',
      },
    ],
    debrief:
      'Notice what a strong answer does not say: that the administrator needs to start over. They do ' +
      'not. They need one new habit, a second question, layered on top of skills they already have.',
    practice: [],
  },
];

// --- Module sef.2: hardening and baselines -----------------------------------

const BASELINE_TEACH = {
  concept:
    'Think about a new car rolling off the factory line. It does not arrive with every option ' +
    'switched on and every panel unlocked; it arrives configured a specific, deliberate way, doors ' +
    'locked by default, certain safety features on, certain things left off until someone chooses ' +
    'them, because that starting configuration is safer than leaving everything wide open and hoping ' +
    'the owner locks the right things later. A HARDENING BASELINE is the same idea applied to a ' +
    'computer or server: a specific, deliberately chosen starting configuration, not a vague goal like ' +
    '"make it secure."\n\n' +
    'CIS benchmarks are a reference many engineers start from: a published list of hundreds of ' +
    'individual settings, each with a stated reason and a way to check whether it is actually applied, ' +
    'organised into profiles, typically Level 1, broadly safe for almost any system, and Level 2, ' +
    'stricter and more likely to break something that depended on the old, looser setting. Applying ' +
    '"the CIS benchmark" to a system means choosing a profile and deciding, setting by setting, which ' +
    'ones you are and are not adopting, and writing down why, not running a script that flips every ' +
    'switch at once and calling it done.\n\n' +
    'Two things follow from that. A baseline is a starting configuration, tested and locked in place, ' +
    'that every new machine is built from, rather than a report run occasionally against machines ' +
    'already in use and then argued about afterward. And every setting exists because it closes ' +
    'something the previous, looser default left open, which means every setting carries some chance ' +
    'of breaking whatever was quietly relying on that opening. That is not a flaw in the baseline. It ' +
    'is the reason the process for handling exceptions matters as much as the baseline itself.',
} as const;

const EXCEPTION_TEACH = {
  concept:
    'Think about a building with a strict no-propped-doors fire policy, and a loading dock crew that ' +
    'genuinely needs the back door open for twenty minutes each morning to move boxes in. Telling them ' +
    '"the door is never allowed to be open, ever" ignores a real, everyday need. Telling them "prop it ' +
    'open however you like, whenever you like, permanently" is not a safety policy anymore, it is just ' +
    'giving up on the rule. A workable answer sits between those two: the door can be propped, but ' +
    'only during a set window, only with someone watching it, and only because it is written down ' +
    'somewhere the fire safety officer actually checks.\n\n' +
    'An EXCEPTION PROCESS, for a security setting, works the same way, and a workable one has four ' +
    'properties.\n\n' +
    'It is TIME-BOUND: every exception carries a review or expiry date, because an exception with no ' +
    'end date is a silent, permanent policy change made by whoever got tired of following up on it. It ' +
    'requires a COMPENSATING CONTROL: something else stands in for the setting being relaxed, the ' +
    'person watching the propped door, so the risk is reduced rather than simply accepted and ' +
    'forgotten. It has a named OWNER: a specific person or team accountable for the exception ' +
    'continuing to exist, not "the business" as a vague, unaccountable abstraction. And it is VISIBLE: ' +
    'exceptions live in a register somebody actually reviews, not in an email thread nobody can find ' +
    'again in eighteen months.\n\n' +
    'A request that names a real, genuine need still has to pass through this process. A real reason ' +
    'justifies some accommodation. It does not automatically justify the exact remedy the requester ' +
    'happened to ask for.',
} as const;

const MODULE_SEF_2: Exercise[] = [
  {
    id: 'sef.2.1',
    moduleId: 'sef.2',
    packageId: 'security-engineering-foundations',
    order: 1,
    title: 'What a baseline actually is',
    kind: 'multiple-choice',
    goal: 'Understand a hardening baseline as a tested, versioned configuration rather than a checklist.',
    prompt:
      'A colleague says "we should just apply the CIS benchmark." Which of the following are ' +
      'accurate about what that involves? Select all that apply.',
    teach: BASELINE_TEACH,
    options: [
      { id: 'a', label: 'A baseline is a specific, versioned configuration state that can be tested for compliance, not a general statement of intent.' },
      { id: 'b', label: 'CIS benchmarks are organised into profiles, such as Level 1 and Level 2, trading strictness against the chance of breaking something.' },
      { id: 'c', label: 'Adopting "the CIS benchmark" means choosing a profile and deciding which individual settings apply to your environment, not applying every setting unread.' },
      { id: 'd', label: 'A baseline should be the starting configuration new builds inherit, not a report run occasionally against systems already in production.' },
      { id: 'e', label: 'Because CIS benchmarks are an industry standard, every setting in the chosen profile should be applied exactly as published, with any deviation treated as a compliance failure.' },
    ],
    hints: [
      'Four describe what applying a baseline actually involves. One treats every published setting as mandatory without exception.',
      'A benchmark document publishing hundreds of settings does not mean every environment adopts all of them unmodified.',
      'Ask what "choosing a profile" would even mean if every setting were non-negotiable.',
    ],
    solution:
      'A, B, C, and D. A baseline is a tested, versioned starting state, organised into profiles, ' +
      'adopted deliberately rather than wholesale. E contradicts that: a documented, reasoned ' +
      'deviation from a published setting is a normal and expected part of adopting a benchmark, not ' +
      'automatically a failure.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats every published setting as mandatory, with no room for a reasoned deviation.',
      },
    ],
    debrief:
      'A baseline is a decision, not a download: it is chosen and recorded, the way the factory chose ' +
      'which car options ship on and which ship off. The next two exercises are about what happens ' +
      'once that decision meets a real system.',
    practice: [],
  },
  {
    id: 'sef.2.2',
    moduleId: 'sef.2',
    packageId: 'security-engineering-foundations',
    order: 2,
    title: 'Why hardening breaks things',
    kind: 'multiple-choice',
    goal: 'Understand why applying a baseline surfaces undocumented dependencies on insecure defaults.',
    prompt:
      'A hardening rollout breaks a legacy scanner that turns out to only speak an old, now-disabled ' +
      'protocol. Which of the following are accurate about this kind of failure? Select all that ' +
      'apply.',
    teach: {
      concept:
        'Imagine a landlord who finally fixes a broken side gate that had been swinging open for ' +
        'years. The moment it locks properly, the neighbour who had been quietly cutting through the ' +
        'yard as a shortcut to the bus stop can no longer get through. The gate was not the problem, ' +
        'the shortcut nobody knew existed was, and fixing the gate is what revealed it.\n\n' +
        'Hardening a system works the same way. Every hardening setting closes something the previous, ' +
        'insecure default left open, and something on the network may have quietly been relying on ' +
        'that opening, often for years, without anyone documenting it. Disabling an old, insecure way ' +
        'of communicating (a "legacy protocol") breaks the one device that only knows how to speak it. ' +
        'Requiring a newer, safer version of that communication breaks the piece of equipment whose ' +
        'internal software (its "firmware") was never updated to support anything newer. Tightening a ' +
        'password or session rule breaks an automated account set up years ago under the old, looser ' +
        'rules and forgotten about since.\n\n' +
        'None of this means the baseline was wrong. It means the rollout found a dependency nobody had ' +
        'written down, which is one of the most useful things a hardening effort does, uncomfortable as ' +
        'it is when it happens during a scheduled change window.',
    },
    options: [
      { id: 'a', label: 'Disabling an insecure legacy protocol can break the one system that was quietly still using it, often for years, undocumented.' },
      { id: 'b', label: 'Raising a minimum protocol version can break an appliance whose vendor firmware was never updated to support anything newer.' },
      { id: 'c', label: 'A hardening rollout surfacing an undocumented dependency is a useful outcome of the rollout, not evidence that the baseline itself is wrong.' },
      { id: 'd', label: 'Tightening account or session policy can break service accounts configured under the old, looser rules and never revisited.' },
      { id: 'e', label: 'A well-written baseline should not break anything, so a break during rollout means the baseline was authored incorrectly.' },
    ],
    hints: [
      'Four describe real, common causes of hardening breakage. One assumes a correct baseline is one that never surfaces a dependency.',
      'Ask what the broken scanner was actually relying on before the change, and whether anyone knew.',
      'The wrong option confuses "this broke something" with "this was a mistake."',
    ],
    solution:
      'A, B, C, and D. Legacy protocols, unpatched firmware, and stale account policy are the usual ' +
      'sources of breakage, and finding them is a genuine benefit of the rollout. E gets the causality ' +
      'backwards: a break usually reveals an undocumented dependency on an insecure default, not an ' +
      'authoring mistake in the baseline.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats any breakage as proof the baseline itself was written incorrectly.',
      },
    ],
    debrief:
      'Expect this. A hardening rollout that finds nothing is either a very well-documented fleet of ' +
      'machines, or one that has not been checked closely enough yet.',
    practice: [],
  },
  {
    id: 'sef.2.3',
    moduleId: 'sef.2',
    packageId: 'security-engineering-foundations',
    order: 3,
    title: 'Reading an exception request',
    kind: 'multiple-choice',
    goal: 'Separate a real technical constraint from a disproportionate remedy in an exception request.',
    prompt:
      'You are reviewing an exception request against the following baseline setting.\n\n' +
      'CIS Benchmark setting 2.3.1.5, Minimum password length: 14 characters.\n' +
      'Exception requested for: SVC-BACKUP-01 (legacy backup agent service account).\n' +
      'Justification submitted: "Backup software vendor\'s configuration UI silently truncates ' +
      'passwords over 8 characters, causing authentication to fail after rotation. Requesting ' +
      'permanent exemption from length policy for this account."\n\n' +
      'Which of the following are accurate about this request? Select all that apply.',
    teach: {
      concept:
        'A request like this is asking you to make three separate judgement calls, and it is easy to ' +
        'collapse them into one. Imagine a tenant asking their landlord for a master key to every unit ' +
        'in the building because their own key sometimes sticks. The sticking key is a real, believable ' +
        'problem. Handing over a master key is a wildly oversized fix for it. Oiling the lock, or ' +
        'cutting a better copy of their own key, solves the actual problem without creating a new one.\n\n' +
        'Reading an exception request well means asking the same three questions in order. Is the ' +
        'underlying constraint real: here, plausibly yes, a vendor\'s configuration screen silently ' +
        'cutting off long passwords is a genuine and common limitation, not an excuse someone invented. ' +
        'Is the proposed remedy proportionate to that problem: a PERMANENT EXEMPTION, meaning the rule ' +
        'simply stops applying to this account forever, from a core password rule, for an account that ' +
        'logs into production backups, is a much bigger concession than the stated problem actually ' +
        'needs. And is there a smaller fix available: rotating to an eight-character password that ' +
        'still meets the complexity rules, or better, moving the account to a vaulted, automatically-' +
        'generated credential so nobody ever has to type a password into that limited screen at all.\n\n' +
        'A real constraint justifies addressing the problem. It does not automatically justify granting ' +
        'exactly the remedy the requester happened to ask for.',
    },
    options: [
      { id: 'a', label: 'The technical constraint described, a UI that truncates long passwords, is a plausible, real limitation rather than an excuse.' },
      { id: 'b', label: 'A permanent, unreviewed exemption is a disproportionate response to a problem that only affects one setting on one account.' },
      { id: 'c', label: 'A time-bound exception paired with a compensating control, such as rotating this account through a vault, addresses the same problem without leaving a permanent gap.' },
      { id: 'd', label: 'Because the request names a specific, verifiable technical reason, it should be approved exactly as submitted.' },
      { id: 'e', label: 'This account is a strong candidate for follow-up: understanding why a backup service account needs an interactively typed password at all is worth investigating alongside any exception decision.' },
    ],
    hints: [
      'Four are accurate readings of this request. One treats a real justification as automatic approval of the exact remedy asked for.',
      'A genuine constraint and a proportionate remedy are two separate questions; check both.',
      'What would a vaulted, machine-generated credential do to this whole problem?',
    ],
    solution:
      'A, B, C, and E. The constraint is plausible, the requested remedy is disproportionate, a ' +
      'smaller fix exists, and the account is worth deeper follow-up. D is the mistake this exercise ' +
      'is built around: a real technical reason justifies some accommodation, not automatically the ' +
      'permanent, unreviewed exemption that happened to be requested.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'One option treats a real justification as grounds to approve the request exactly as written.',
      },
    ],
    debrief:
      'Notice the move: accept that the constraint is real, and still push back on the size of the ' +
      'remedy, the same way you would believe the sticking key and still say no to the master key. ' +
      'That is most of what reviewing exceptions actually is.',
    practice: [],
  },
  {
    id: 'sef.2.4',
    moduleId: 'sef.2',
    packageId: 'security-engineering-foundations',
    order: 4,
    title: 'What makes an exception process workable',
    kind: 'multiple-choice',
    goal: 'Recognise the properties a hardening exception process needs to avoid becoming a permanent hole.',
    prompt:
      'You are designing the exception process for your hardening programme. Which of the following ' +
      'are properties it should have? Select all that apply.',
    teach: EXCEPTION_TEACH,
    options: [
      { id: 'a', label: 'Every exception should carry a review or expiry date, since an exception with no end date is effectively a silent policy change.' },
      { id: 'b', label: 'A compensating control should reduce the risk the original setting addressed, rather than the exception simply accepting the risk outright.' },
      { id: 'c', label: 'An exception needs a named, accountable owner, not an abstract "the business needs this" justification.' },
      { id: 'd', label: 'Exceptions should be tracked in a visible register that gets reviewed, not left to live in an email thread.' },
      { id: 'e', label: 'Once granted, an exception should stay in force indefinitely unless the account it applies to is deleted, since revisiting it repeatedly wastes engineering time.' },
    ],
    hints: [
      'Four are the actual design properties this module names. One argues against ever revisiting a granted exception.',
      'Ask what happens to an exception that has no expiry date and no owner after the person who approved it changes teams.',
      'A process that never revisits anything is not a process, it is a one-time decision pretending to be one.',
    ],
    solution:
      'A, B, C, and D. Time-bound, compensated, owned, and visible are the four properties that keep ' +
      'an exception from quietly becoming permanent. E describes exactly the failure mode the other ' +
      'four are designed to prevent: an exception nobody revisits is indistinguishable from a policy ' +
      'change nobody approved.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option argues that a granted exception should never need revisiting.',
      },
    ],
    debrief:
      'A register with review dates is not paperwork for its own sake. It is the only thing standing ' +
      'between "we made a judged, time-bound exception" and "we forgot this door was ever supposed to ' +
      'close."',
    practice: [],
  },
  {
    id: 'sef.2.5',
    moduleId: 'sef.2',
    packageId: 'security-engineering-foundations',
    order: 5,
    title: 'Handle an exception request',
    kind: 'short-answer',
    goal: 'Apply the exception process to a realistic, mildly sympathetic request.',
    prompt:
      'A business unit lead emails asking for a permanent exemption from the endpoint disk encryption ' +
      'baseline for a shared team laptop, saying the encryption "makes boot too slow for the retail ' +
      'floor." In three or four sentences, explain how you would handle the request.',
    teach: {
      concept:
        'DISK ENCRYPTION is a setting that scrambles everything stored on a laptop\'s drive so that if ' +
        'the laptop is lost or stolen, whoever has it physically cannot read the files off the disk ' +
        'without the right key, the digital equivalent of a locked safe instead of an open drawer. It ' +
        'is one of the more common baseline settings precisely because laptops get lost constantly.\n\n' +
        'This request has the same shape as the backup account exception earlier in this module: a ' +
        'plausible-sounding constraint attached to a remedy that is much bigger than the problem needs. ' +
        'The first step is to check whether the constraint is what it claims to be: an old hard drive ' +
        'without hardware built to encrypt data quickly behaves very differently from a modern one, and ' +
        '"encryption makes it slow" often really means "this specific laptop is old," not "encryption ' +
        'itself is the problem."\n\n' +
        'A good answer does not grant a permanent exemption on the strength of an unverified claim. It ' +
        'checks the actual cause, proposes a fix scoped to that real problem, a hardware upgrade or a ' +
        'configuration change rather than removing the safeguard entirely, and if any exception is ' +
        'genuinely needed in the meantime, makes it time-bound, owned, and logged in the register ' +
        'rather than permanent.',
    },
    hints: [
      'Do not accept the stated cause at face value; verify it before deciding what to do.',
      'A permanent exemption is a much bigger concession than a slow-boot complaint needs.',
      'A strong answer names a scoped fix and, if any exception is granted at all, makes it time-bound and logged rather than permanent.',
    ],
    solution:
      'Before granting anything, I would verify what is actually causing the slow boot, since it is ' +
      'often the laptop\'s hardware rather than encryption itself, for example an older drive without ' +
      'hardware-accelerated encryption. I would not grant a permanent exemption from disk encryption ' +
      'on the strength of an unverified complaint. Instead I would propose a scoped fix, most likely a ' +
      'hardware refresh or a configuration change, and if a temporary exception is genuinely needed ' +
      'while that happens, I would make it time-bound with a named owner and log it in the exception ' +
      'register rather than leave it open-ended.',
    expectedOutput:
      'An answer that verifies the stated cause, proposes a scoped fix rather than removing the ' +
      'control, and treats any interim exception as time-bound, owned, and logged.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['verify', 'confirm', 'actual cause', 'check', 'investigate', 'hardware', 'old drive'],
          ['not permanent', 'time-bound', 'temporary', 'expiry', 'review date'],
          ['fix', 'upgrade', 'replace', 'compensating', 'scoped', 'refresh'],
        ],
        hint:
          'Three ideas: check what is really causing the problem, do not grant a permanent exemption, ' +
          'and propose a scoped fix or a time-bound exception instead.',
      },
    ],
    debrief:
      'A sympathetic-sounding complaint is not a reason to skip the process. It is exactly the kind of ' +
      'request the process exists to slow down long enough to check.',
    practice: [],
  },
];

// --- Module sef.3: network segmentation ---------------------------------------

const FLAT_NETWORK_TEACH = {
  concept:
    'Picture an office building with no internal doors at all: one enormous open floor, every desk, ' +
    'every filing cabinet, every server closet, all in the same room. Anyone who gets past the front ' +
    'entrance can walk to any desk in the building without ever being stopped again. A "NETWORK", for ' +
    'a company, is the wiring and equipment that lets its computers talk to each other, and a FLAT ' +
    'NETWORK is that open-floor building: any computer on it can reach any other computer on it, ' +
    'because nothing in between is actually stopping traffic from getting through.\n\n' +
    'In that world the security question collapses to a single one: can an attacker get a foothold ' +
    'anywhere at all, because from there they can reach everywhere. A phished laptop sitting in the ' +
    'general office part of the network and a database holding customer records may sit one hop, one ' +
    'network step, apart, and an attacker who lands on the laptop has functionally already reached the ' +
    'database, the same way someone who talks their way past the lobby in the open-floor building has ' +
    'already reached the filing cabinets.\n\n' +
    'SEGMENTATION is the fix: building internal walls and doors, dividing the network into separate ' +
    'zones and enforcing which zones are allowed to talk to which others, so a break-in in one zone ' +
    'does not automatically become a break-in everywhere. It does not need to be perfect to be worth ' +
    'doing. It needs to turn "one desk compromised, the whole building reachable" into "one desk ' +
    'compromised, contained to this room," which changes an incident from a catastrophe into a bad ' +
    'afternoon.',
} as const;

const ZERO_TRUST_TEACH = {
  concept:
    'Think about an old office building where anyone who makes it past the front security desk can ' +
    'then walk into any unlocked room without showing identification again, because being inside the ' +
    'building was treated as proof enough that they belonged. Now think about a building where every ' +
    'single door, including ones deep inside, checks a badge before it opens, no matter how the person ' +
    'got that far. ZERO TRUST is a design principle built on that second building, and it is a way of ' +
    'thinking before it is any specific product a company can buy: never grant trust just because a ' +
    'request came from "inside," verify every request explicitly no matter where it came from, and ' +
    'design as though some part of the building may already have someone inside who should not be ' +
    'there.\n\n' +
    'Under the old model, being inside the company\'s own network was itself treated like a badge: a ' +
    'request from an internal address got trusted more by default, no questions asked. Zero trust ' +
    'removes that shortcut and asks every request, whether it came from inside the building or from ' +
    'the street outside, to prove who it is and that it is allowed to do the specific thing it is ' +
    'asking to do.\n\n' +
    'What zero trust is not: a single product that flips a company into this state the moment it is ' +
    'installed, or a label a vendor sticks on a VPN replacement or an identity product because the ' +
    'term sells well. A company can buy every product marketed as "zero trust" and still have doors ' +
    'that open for anyone once they are inside, if the actual access decisions behind those products ' +
    'were never redesigned to genuinely check identity and context on each request.',
} as const;

const MODULE_SEF_3: Exercise[] = [
  {
    id: 'sef.3.1',
    moduleId: 'sef.3',
    packageId: 'security-engineering-foundations',
    order: 1,
    title: 'One host, the whole estate',
    kind: 'multiple-choice',
    goal: 'Explain why a flat network turns a single compromised host into an estate-wide problem.',
    prompt:
      'A colleague asks why it matters that the office network and the production database sit in ' +
      'the same broadcast domain. Which of the following are accurate? Select all that apply.',
    teach: FLAT_NETWORK_TEACH,
    options: [
      { id: 'a', label: 'On a flat network, compromising any single host can put an attacker within one network hop of every other host.' },
      { id: 'b', label: 'Segmentation limits which zones can reach which others, so a compromise stays contained to where it started rather than spreading automatically.' },
      { id: 'c', label: 'The value of segmentation is proportional to how sensitive the systems are that get separated from the rest, such as isolating a database of customer records.' },
      { id: 'd', label: 'A phished workstation and a production database sharing a broadcast domain can effectively route around access controls the database enforces at the application layer.' },
      { id: 'e', label: 'Because modern endpoint agents can detect lateral movement quickly, a flat network is an acceptable design as long as detection and response tooling is deployed everywhere.' },
    ],
    hints: [
      'Four describe the actual risk of a flat network. One substitutes fast detection for containment.',
      'Detecting that an attacker moved is not the same as having stopped them from being able to.',
      'Ask what an endpoint agent does if it is disabled or blinded before anyone notices.',
    ],
    solution:
      'A, B, C, and D. Reachability, containment, prioritising sensitive systems, and the network ' +
      'undermining application-layer controls are the real picture. E confuses detection with ' +
      'prevention: fast detection is valuable, but it does not stop the initial lateral hop, and it ' +
      'assumes the detection tooling itself survives the compromise.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats fast detection as a substitute for actually restricting reachability.',
      },
    ],
    debrief:
      'Noticing someone walked into the wrong room and stopping them from walking in are different ' +
      'jobs. This module is about the second one, which has to hold even if the first one is slow or ' +
      'misses entirely.',
    practice: [],
  },
  {
    id: 'sef.3.2',
    moduleId: 'sef.3',
    packageId: 'security-engineering-foundations',
    order: 2,
    title: 'A diagram is not a control',
    kind: 'multiple-choice',
    goal: 'Distinguish segmentation that exists on a diagram from segmentation that is actually enforced.',
    prompt:
      'A network diagram shows separate VLANs for marketing and finance. Which of the following are ' +
      'accurate about what that does and does not prove? Select all that apply.',
    teach: {
      concept:
        'A blueprint that labels two rooms "Marketing" and "Finance" does not, by itself, guarantee a ' +
        'locked door actually sits between them. Somebody has to install the door, the door has to ' +
        'latch, and nobody has to have propped it open since. A VLAN is essentially a labelled room on ' +
        'a network diagram, a way of grouping certain computers together and giving the group a name. A ' +
        'diagram showing separate VLANs proves somebody thought about drawing separate rooms. It does ' +
        'not prove a door was ever actually installed and locked between them.\n\n' +
        'Real segmentation exists at the point of enforcement: an actual rule, on an actual piece of ' +
        'equipment sitting between the two zones, that a connection has to pass through and can be ' +
        'refused by. Two failure modes are common. A boundary can exist on the diagram but never have ' +
        'been enforced, because the device between the two VLANs still carries a broad "allow ' +
        'everything" rule left over from a past project nobody cleaned up afterward. Or a boundary ' +
        'enforced correctly on day one can erode over time, one exception at a time, as people request ' +
        'access across it for a legitimate-sounding reason, until the rule set is wide enough that the ' +
        'two rooms are functionally one open floor again.\n\n' +
        'The only way to know real segmentation exists is to test it: attempt to cross the boundary ' +
        'directly and see what actually happens, or, as the closest substitute short of that, read the ' +
        'live rule set currently configured on the device between the two zones.',
    },
    options: [
      { id: 'a', label: 'A diagram showing separate VLANs does not by itself prove that traffic between them is actually restricted.' },
      { id: 'b', label: 'A broad allow rule left behind after a migration can silently defeat a segmentation boundary that looks correct on paper.' },
      { id: 'c', label: 'A boundary enforced correctly at rollout can erode over time as exceptions accumulate, until the two sides are functionally reconnected.' },
      { id: 'd', label: 'The only reliable way to confirm a segmentation boundary works is to test it directly, such as attempting lateral movement across it, or reviewing the actual current rule set.' },
      { id: 'e', label: 'Once a segmentation boundary has passed an initial security review and been signed off, it can be treated as permanently enforced without further testing.' },
    ],
    hints: [
      'Four describe why a diagram is not proof. One treats a one-time sign-off as good forever.',
      'Ask what has changed on that boundary since the sign-off happened.',
      'Rule sets accumulate exceptions the same way an exception register does when nobody reviews it.',
    ],
    solution:
      'A, B, C, and D. A diagram is intent, not enforcement, and enforcement can be missing at day ' +
      'one or erode afterward, which is why testing is the only reliable check. E assumes a boundary ' +
      'stays enforced forever once approved, which is the exact assumption that lets erosion go ' +
      'unnoticed for years.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a past sign-off as proof the boundary is still enforced today.',
      },
    ],
    debrief:
      'If nobody can tell you the last date this boundary was actually tested, like a fire door nobody ' +
      'has checked in years, the honest answer is that nobody knows whether it still holds.',
    practice: [],
  },
  {
    id: 'sef.3.3',
    moduleId: 'sef.3',
    packageId: 'security-engineering-foundations',
    order: 3,
    title: 'Zero trust as a design principle',
    kind: 'multiple-choice',
    goal: 'Separate zero trust as an architectural principle from zero trust as a marketing label.',
    prompt:
      'A vendor pitches a product as "the zero trust solution" for your network. Which of the ' +
      'following are accurate about zero trust as a design principle? Select all that apply.',
    teach: ZERO_TRUST_TEACH,
    options: [
      { id: 'a', label: 'Zero trust means no request is granted trust purely because it originated from inside the corporate network.' },
      { id: 'b', label: 'Under zero trust, an internal request and an external request should be verified on the same basis: who and what is asking, not where the packet came from.' },
      { id: 'c', label: 'Zero trust assumes, as a design premise, that some part of the environment may already be compromised, rather than assuming the perimeter has kept everything out.' },
      { id: 'd', label: 'Buying a product marketed as "zero trust" is not the same as having actually redesigned access decisions to stop relying on network location.' },
      { id: 'e', label: 'An organisation that has deployed a modern VPN replacement product has, by definition, implemented zero trust.' },
    ],
    hints: [
      'Four describe the actual principle. One treats a single product purchase as sufficient by itself.',
      'Ask what specifically changed about how an access decision is made, not what was bought.',
      'A product can carry the label without the underlying access decisions ever being redesigned.',
    ],
    solution:
      'A, B, C, and D. Removing location as a shortcut for trust, verifying every request the same ' +
      'way, assuming partial compromise, and distinguishing the label from the redesign are the real ' +
      'principle. E is the marketing collapse: no single purchase, by itself, guarantees the access ' +
      'decisions underneath it were actually rebuilt.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a specific product purchase as automatically achieving the principle.',
      },
    ],
    debrief:
      'Ask any zero trust pitch one question: what, specifically, no longer gets waved through just ' +
      'because of where it came from. If the answer is vague, the redesign has not happened yet, only ' +
      'the label has.',
    practice: [],
  },
  {
    id: 'sef.3.4',
    moduleId: 'sef.3',
    packageId: 'security-engineering-foundations',
    order: 4,
    title: 'Design around blast radius, not the org chart',
    kind: 'multiple-choice',
    goal: 'Plan segmentation boundaries around consequence rather than convenience.',
    prompt:
      'You are planning where to put segmentation boundaries in a new office network. Which of the ' +
      'following are sound design principles? Select all that apply.',
    teach: {
      concept:
        'A building\'s floor plan usually is not organised purely by who reports to whom on the org ' +
        'chart. The room holding the safe does not sit right next to the public lobby just because the ' +
        'finance team happens to sit near reception on paper. It sits behind several extra doors, ' +
        'because whoever designed the building thought about what a break-in there would actually cost.\n\n' +
        'Good segmentation design works the same way: it starts from asking what happens if this zone ' +
        'is broken into, not from redrawing the org chart as network zones. The useful unit is BLAST ' +
        'RADIUS: how much of the company\'s systems becomes reachable from a given foothold, and how ' +
        'much damage is possible from there, the way an explosion\'s blast radius describes how far its ' +
        'damage reaches rather than where it started.\n\n' +
        'That leads to identifying the systems whose compromise would be worst, sometimes called crown ' +
        'jewels: data protected by regulation, systems that could halt the business if they went down, ' +
        'and the identity provider, the system everything else trusts to say who someone is, since ' +
        'breaking into it can undermine safeguards everywhere else at once. Drawing the tightest ' +
        'boundaries around those first is a better use of limited effort than spreading it evenly ' +
        'across a network where most zones matter far less.\n\n' +
        'It also means a general user workstation zone, where phishing, an attacker tricking an ' +
        'employee into clicking something malicious, is expected to eventually succeed no matter how ' +
        'well people are trained, should not sit one step away from a crown jewel zone. There should be ' +
        'at least one enforced, watched boundary between where attackers are expected to land and what ' +
        'would hurt most to lose.',
    },
    options: [
      { id: 'a', label: 'A useful way to plan segmentation is to ask what becomes reachable if a given zone is compromised, and how much of that would matter.' },
      { id: 'b', label: 'Identifying the systems whose compromise would be worst, and protecting those first, is a better use of limited effort than spreading segmentation evenly.' },
      { id: 'c', label: 'A general user workstation zone, where phishing is expected to eventually succeed, should not sit directly adjacent to a zone holding the most sensitive systems.' },
      { id: 'd', label: 'The identity provider that other systems trust for authentication is itself worth treating as a crown jewel, since its compromise can undermine controls elsewhere.' },
      { id: 'e', label: 'Segmentation effort is best allocated equally across every zone in the network, since underinvesting in any one zone is what attackers look for.' },
    ],
    hints: [
      'Four describe planning around consequence. One argues for spreading effort evenly regardless of what each zone holds.',
      'Ask which zone would be the worst one to lose, and whether it is currently one hop from where phishing lands.',
      'Equal effort everywhere is not the same as effort matched to what is actually at stake.',
    ],
    solution:
      'A, B, C, and D. Blast radius, prioritising crown jewels, keeping the phishing-prone zone away ' +
      'from the most sensitive one, and treating the identity provider as a crown jewel itself are ' +
      'sound design principles. E argues for uniform effort, which spends as much protecting a low-' +
      'value zone as a system that could halt the business, which is not a good trade.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option argues for spreading effort evenly rather than weighting it by consequence.',
      },
    ],
    debrief:
      'Blast radius is the question to keep asking whenever a new system gets added to the network: ' +
      'what room does it now sit next to, and what would it cost the company if that neighbour were ' +
      'lost.',
    practice: [],
  },
  {
    id: 'sef.3.5',
    moduleId: 'sef.3',
    packageId: 'security-engineering-foundations',
    order: 5,
    title: 'Explain what the diagram is missing',
    kind: 'short-answer',
    goal: 'Explain why pointing at a network diagram does not settle whether containment held during an incident.',
    prompt:
      'During an incident review, a colleague points at the network diagram and says "we are ' +
      'segmented, see, these are separate VLANs," as the reason a compromised marketing workstation ' +
      'could not have reached the finance database. In three or four sentences, explain what is ' +
      'missing from that argument.',
    teach: {
      concept:
        'This is the same gap this module has been building toward from a different angle: a diagram ' +
        'shows what was intended when the building, or the network, was designed. Whether a wall ' +
        'actually stopped an intruder during a real break-in is a completely separate question, one ' +
        'the blueprint cannot answer on its own.\n\n' +
        'A strong answer says the claim only holds if there is a current rule set, actually checked, ' +
        'that genuinely refuses that specific path, and if nobody quietly added an exception across ' +
        'that boundary since it was last reviewed. Whether the workstation could reach finance is ' +
        'answered by testing the boundary or reading the live rules during the incident itself, not by ' +
        'pointing at the picture drawn back when the network was first designed.',
    },
    hints: [
      'A diagram describes what was intended when the network was designed, not what is enforced today.',
      'Name what would actually settle the question: the live rule set, or a direct test of the boundary.',
      'Mention that exceptions can accumulate across a boundary after the diagram was drawn.',
    ],
    solution:
      'The diagram only shows what was intended when the network was designed, not what is currently ' +
      'enforced between those VLANs. The claim only holds if there is a firewall rule set or ACL that ' +
      'has actually been checked and genuinely denies that path, and if nobody has added an exception ' +
      'across that boundary since it was last reviewed. Whether the workstation could reach finance is ' +
      'answered by testing the boundary or reading the live rules, not by pointing at the picture.',
    expectedOutput:
      'An answer distinguishing the diagram from actual enforcement, naming the live rule set or a ' +
      'direct test as what would settle the question, and mentioning that exceptions can accumulate ' +
      'over time.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['diagram', 'intent', 'design', 'picture', 'paper'],
          ['firewall rule', 'acl', 'enforce', 'enforced', 'actual rule', 'live rule', 'test'],
          ['exception', 'accumulate', 'since', 'added', 'erode', 'change'],
        ],
        hint:
          'Three ideas: the diagram shows intent rather than enforcement, name what would actually ' +
          'settle the question, and mention that exceptions can accumulate since the diagram was drawn.',
      },
    ],
    debrief:
      'During an incident, "we are segmented" is a claim to verify, not a fact to cite. The review ' +
      'that finds out which one it was is doing its job.',
    practice: [],
  },
];

// --- Module sef.4: endpoint security architecture -----------------------------

const EDR_AV_TEACH = {
  concept:
    'A "MALWARE" is any software written to do something harmful, malicious software, on a machine it ' +
    'infects. Think about a security guard who has been handed a photo book of known shoplifters and ' +
    'told to watch the door for those exact faces. That works well against everyone in the book. It ' +
    'does nothing at all against a shoplifter the guard has never seen a photo of, and a determined one ' +
    'only needs to be a new face. Traditional ANTIVIRUS software works essentially the same way: it ' +
    'carries a library of "signatures", identifying fingerprints of malware other people have already ' +
    'found and catalogued, and it recognises what is in that library. It is structurally blind to ' +
    'anything not yet in the book, and a competent attacker just needs a piece of malware nobody has ' +
    'catalogued yet.\n\n' +
    'EDR, short for endpoint detection and response, is a guard trained differently: instead of ' +
    'memorising faces, they watch BEHAVIOUR, how someone actually moves through the store, whether they ' +
    'are stuffing things into a bag, regardless of whether that specific person has ever been seen ' +
    'before. On a computer, that means continuously recording what programs do: what started what, what ' +
    'reached out to which address on the network, what files or system settings something touched, and ' +
    'flagging patterns that look like a break-in, whether or not the specific piece of software involved ' +
    'has ever been seen before anywhere.\n\n' +
    'The other half of the name is what actually changes the job: RESPONSE. EDR gives an operator the ' +
    'ability to isolate a machine from the network, stop a running program, or pull a file off it for ' +
    'closer analysis, remotely, within minutes, rather than needing to physically walk over to the ' +
    'machine. Antivirus mostly never offered that. EDR is built around the assumption that something ' +
    'will eventually get past the front door despite every precaution, and asks what happens next.',
} as const;

const ALLOWLIST_TEACH = {
  concept:
    'Picture two different door policies for a club. Policy one: anyone can come in unless their name ' +
    'is on a list of people already known to cause trouble. Policy two: nobody comes in unless their ' +
    'name is on a list of people already approved in advance. The first policy is easy to run, the door ' +
    'staff just need last night\'s troublemaker list, but it does nothing about someone nobody has ' +
    'flagged yet. The second policy stops every stranger, known troublemaker or not, but somebody has ' +
    'to build and keep updating the approved list, and every legitimate new guest has to be added before ' +
    'they can get in.\n\n' +
    'A BLOCKLIST, what traditional antivirus and most firewalls default to, is the first policy: it ' +
    'denies what is already known to be bad and allows everything else through by default. It is easy ' +
    'to deploy, since the default behaviour, letting things run, needs no upfront setup, but it can ' +
    'never stop something nobody has identified as bad yet.\n\n' +
    'An ALLOWLIST is the second policy, and it flips the default entirely: nothing runs unless it has ' +
    'been explicitly approved ahead of time, which means an attacker\'s tool, however new or unusual, ' +
    'simply fails to run because it was never on the list, whether or not anyone has ever seen it ' +
    'before. That is a categorically stronger position, and it is far harder to deploy, because ' +
    'somebody has to list out every legitimate piece of software, script, and update mechanism an ' +
    'environment actually uses before turning it on, and every new install or update afterward is a ' +
    'change to that list rather than something that simply works on its own.\n\n' +
    'Most organisations start with a blocklist because it is achievable everywhere at once, and apply ' +
    'allowlisting first on systems where the software genuinely does not change often, fixed-purpose ' +
    'servers, kiosks, and similar systems, rather than on every employee\'s general-purpose laptop.',
} as const;

const MODULE_SEF_4: Exercise[] = [
  {
    id: 'sef.4.1',
    moduleId: 'sef.4',
    packageId: 'security-engineering-foundations',
    order: 1,
    title: 'Signatures versus behaviour',
    kind: 'multiple-choice',
    goal: 'Understand the conceptual difference between traditional antivirus and EDR.',
    prompt:
      'A colleague asks why the organisation is replacing traditional antivirus with EDR. Which of ' +
      'the following are accurate? Select all that apply.',
    teach: EDR_AV_TEACH,
    options: [
      { id: 'a', label: 'Traditional antivirus primarily relies on recognising known-bad signatures, and is structurally blind to malware it has not catalogued.' },
      { id: 'b', label: 'EDR records behaviour, such as process ancestry and network connections, and can flag compromise even from a file it has never seen before.' },
      { id: 'c', label: 'A key part of EDR is remote response, letting an operator isolate a host or kill a process in minutes without physically reaching it.' },
      { id: 'd', label: 'EDR is built around the assumption that prevention will eventually fail, and asks what detection and response look like after that point.' },
      { id: 'e', label: 'Because EDR analyses behaviour instead of signatures, it makes traditional prevention controls such as patching and hardening unnecessary.' },
    ],
    hints: [
      'Four describe what EDR actually adds. One treats EDR as a replacement for prevention altogether.',
      'EDR assumes something will get through, which is an argument for keeping prevention strong, not dropping it.',
      'Ask what an EDR agent has to detect and respond to if patching and hardening stopped happening entirely.',
    ],
    solution:
      'A, B, C, and D. Signature blindness, behavioural detection, remote response, and the assume-' +
      'breach premise describe EDR accurately. E gets the relationship backwards: EDR exists precisely ' +
      'because prevention is not perfect, which is an argument for keeping prevention controls in ' +
      'place, not removing them.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats EDR as making prevention controls unnecessary.',
      },
    ],
    debrief:
      'EDR and hardening are not competitors. EDR is what catches the case where hardening and ' +
      'patching, keeping software updated to fix known weaknesses, did not, which is exactly why it ' +
      'exists.',
    practice: [],
  },
  {
    id: 'sef.4.2',
    moduleId: 'sef.4',
    packageId: 'security-engineering-foundations',
    order: 2,
    title: 'Why allowlisting is harder, and stronger',
    kind: 'multiple-choice',
    goal: 'Compare allowlisting and blocklisting as opposite defaults with different costs.',
    prompt:
      'A colleague asks why the organisation does not simply allowlist every executable on every ' +
      'laptop. Which of the following are accurate? Select all that apply.',
    teach: ALLOWLIST_TEACH,
    options: [
      { id: 'a', label: 'A blocklist denies known-bad items and allows everything else by default, which is easy to deploy but cannot stop something not yet identified.' },
      { id: 'b', label: 'An allowlist denies everything by default except what has been explicitly approved, which stops novel tools purely because they were never approved.' },
      { id: 'c', label: 'Allowlisting is harder to deploy because it requires enumerating and maintaining every legitimate piece of software an environment actually uses.' },
      { id: 'd', label: 'Allowlisting tends to be adopted first on systems where the software rarely changes, such as fixed-purpose servers or kiosks, rather than general knowledge-worker laptops.' },
      { id: 'e', label: 'Because allowlisting is the stronger control, it should be the default starting point for endpoint protection everywhere in an estate, including general-purpose laptops, from day one.' },
    ],
    hints: [
      'Four describe the real trade-off. One ignores the deployment cost that makes allowlisting hard everywhere at once.',
      'Ask what happens the first week a developer installs a new tool on an allowlisted general-purpose laptop.',
      'Being the stronger control does not make something the easiest place to start.',
    ],
    solution:
      'A, B, C, and D. The two defaults, the deployment cost of allowlisting, and where it tends to ' +
      'land first are accurate. E ignores exactly the cost the module just described: rolling ' +
      'allowlisting out everywhere at once, including systems where legitimate software changes ' +
      'constantly, is where the maintenance burden becomes unmanageable.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option ignores the maintenance cost that makes allowlisting hard to deploy broadly at once.',
      },
    ],
    debrief:
      'Strength and ease of deployment are two separate questions, not one. A good rollout plan for ' +
      'allowlisting starts where the software is stable, and expands from there.',
    practice: [],
  },
  {
    id: 'sef.4.3',
    moduleId: 'sef.4',
    packageId: 'security-engineering-foundations',
    order: 3,
    title: 'Least functionality',
    kind: 'multiple-choice',
    goal: 'Apply the principle of least functionality to what a system should and should not run.',
    prompt:
      'A file server has an unused web server module installed and running, left over from a default ' +
      'installation image. Which of the following are accurate about applying least functionality ' +
      'here? Select all that apply.',
    teach: {
      concept:
        'Think about a kitchen knife left lying on a counter in a public building, even though nobody ' +
        'who works there ever uses it. It does not matter that it was never used for anything. It is ' +
        'still a knife within reach of anyone who walks by. The PRINCIPLE OF LEAST FUNCTIONALITY says a ' +
        'computer should run only what its actual job requires: nothing extra installed just in case, ' +
        'nothing left switched on because it happened to ship that way from the factory.\n\n' +
        '"ATTACK SURFACE" is the term for everything on a system an attacker could potentially try to ' +
        'use against it: every running service, every open network port, every installed piece of ' +
        'software. Every one of those is attack surface whether or not it is ever used for its intended ' +
        'purpose, because an attacker does not care that a service was never configured or used, they ' +
        'care only that it is running and reachable, the same way the unused knife is still a knife.\n\n' +
        'Applying the principle means asking, for any given machine, what its actual job is, and ' +
        'removing or switching off everything that does not serve that job. This is also why least ' +
        'functionality and hardening baselines overlap heavily: a baseline is often, in large part, a ' +
        'written-down answer to what a given role actually needs and nothing more.',
    },
    options: [
      { id: 'a', label: 'A service that is installed but never configured or used still counts as attack surface, because an attacker only cares that it is running and reachable.' },
      { id: 'b', label: 'Applying least functionality means asking what a host\'s specific role requires, and removing or disabling what falls outside that.' },
      { id: 'c', label: 'Least functionality and hardening baselines overlap because a baseline is often a codified answer to what a given role actually needs.' },
      { id: 'd', label: 'A default installation shipping with extra components enabled represents unnecessary risk even if nobody in the organisation uses those components.' },
      { id: 'e', label: 'Least functionality mainly applies to servers, since workstations need broad general-purpose software installed to support whatever a user might do.' },
    ],
    hints: [
      'Four describe the principle correctly. One exempts workstations from it entirely.',
      'Ask whether a workstation running an unused, unpatched service is any less of a target than a server doing the same thing.',
      'The role of a workstation is still a role: it defines what it needs, even if that set is broader than a fixed-purpose server\'s.',
    ],
    solution:
      'A, B, C, and D. Unused services as attack surface, role-driven removal, the overlap with ' +
      'baselines, and default installs carrying unnecessary risk are all accurate. E wrongly exempts ' +
      'workstations: they have a role too, and unnecessary components on them are exactly as ' +
      'reachable to an attacker as on a server.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats workstations as exempt from the principle entirely.',
      },
    ],
    debrief:
      '"Nobody uses it" is not the same as "it is not there," the same way an unused knife on the ' +
      'counter is still a knife. Least functionality is about what is running, not what is used.',
    practice: [],
  },
  {
    id: 'sef.4.4',
    moduleId: 'sef.4',
    packageId: 'security-engineering-foundations',
    order: 4,
    title: 'Matching controls to system role',
    kind: 'multiple-choice',
    goal: 'Judge which endpoint control mix suits different system roles.',
    prompt:
      'Consider three systems: a point-of-sale kiosk running one fixed application, a shared ' +
      'engineering workstation where developers install new tools weekly, and a domain controller. ' +
      'Which of the following control decisions are appropriate? Select all that apply.',
    teach: {
      concept:
        'A DOMAIN CONTROLLER is a server that keeps track of every user account and password in a ' +
        'company\'s network and decides who is allowed to log into what, the equivalent of the one ' +
        'master ledger a building\'s front desk checks before handing anyone a key.\n\n' +
        'The right mix of controls for any given machine follows from two questions: how often does the ' +
        'legitimate software on it change, and how much damage would its compromise cause. A fixed-' +
        'purpose kiosk changes almost never, the same handful of programs run on it forever, which makes ' +
        'an approved list cheap to maintain and very effective there. A workstation where developers ' +
        'install new tools every week changes constantly, which makes an approved list expensive to keep ' +
        'up to date there, so behaviour-watching software carries more of the weight instead.\n\n' +
        'A domain controller sits in a different category: its set of software is small and well known, ' +
        'which makes an approved list practical, and its compromise is disproportionately damaging, ' +
        'since whoever controls it effectively controls who can log into everything, which makes ' +
        'aggressive least functionality and an approved list both worth the effort even though it is not ' +
        'a fixed-purpose kiosk.',
    },
    options: [
      { id: 'a', label: 'Application allowlisting is a strong fit for the point-of-sale kiosk, since its software does not change and any unapproved process is by definition unwanted.' },
      { id: 'b', label: 'A blocklist-based approach, such as EDR with behavioural detection, is more practical than allowlisting for the engineering workstation, given how often approved software changes there.' },
      { id: 'c', label: 'The domain controller should run with least functionality applied aggressively, since it is a high-value system where any unnecessary service is a disproportionate risk.' },
      { id: 'd', label: 'Allowlisting is also worth applying to the domain controller, since its executable set is small, well known, and rarely changes.' },
      { id: 'e', label: 'Applying the same fixed endpoint control set uniformly across the kiosk, the workstation, and the domain controller is the simplest approach, and simplicity should be favoured over tailoring here.' },
    ],
    hints: [
      'Four match a control to the system it describes. One argues for treating all three systems identically regardless of how their software changes.',
      'Ask how often legitimate software changes on each of the three systems, and how damaging each one\'s compromise would be.',
      'The domain controller earns both least functionality and allowlisting for two different reasons; find both.',
    ],
    solution:
      'A, B, C, and D. Allowlisting suits the kiosk and the domain controller for related but distinct ' +
      'reasons, low change rate for the kiosk, low change rate and high value for the controller, ' +
      'while the workstation is better served by behavioural detection given how often its software ' +
      'changes. E ignores all of that variation in favour of a single uniform policy, which is exactly ' +
      'the kind of choice that either leaves the kiosk under-protected or makes the workstation ' +
      'unmanageable.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option argues for the same control set everywhere regardless of how each system\'s software behaves.',
      },
    ],
    debrief:
      'This is the actual skill in endpoint architecture: matching the safeguard to how the system ' +
      'behaves, not picking one control and applying it everywhere for the sake of consistency.',
    practice: [],
  },
  {
    id: 'sef.4.5',
    moduleId: 'sef.4',
    packageId: 'security-engineering-foundations',
    order: 5,
    title: 'Explain the allowlisting trade-off',
    kind: 'short-answer',
    goal: 'Explain why allowlisting is stronger but harder to deploy, using a concrete example.',
    prompt:
      'A colleague asks why the team does not simply allowlist every laptop in the company, since it ' +
      'is "obviously the stronger control." In three or four sentences, explain the trade-off, using ' +
      'a concrete example.',
    teach: {
      concept:
        'A strong answer names both halves of the trade-off and grounds it in something concrete, ' +
        'rather than just restating "it is more secure but harder" in the abstract.\n\n' +
        'Allowlisting is stronger because it refuses anything not explicitly approved in advance, so a ' +
        'brand-new attacker tool simply fails to run, the same way a stranger not on the guest list ' +
        'fails to get past the door regardless of how convincing they look. It is harder because every ' +
        'legitimate change, a developer installing a new library or script, a one-off tool needed for a ' +
        'single task, now has to go through an approval step before it works, which turns a five-minute ' +
        'install into a ticket and a wait. A complete answer usually also names where allowlisting is a ' +
        'better fit: fixed-purpose systems whose software rarely changes.',
    },
    hints: [
      'State both halves: why it is stronger, and specifically what makes it harder to maintain.',
      'Give a concrete example of a legitimate action that would now require approval it did not need before.',
      'A strong answer also says where allowlisting fits well, rather than dismissing it everywhere.',
    ],
    solution:
      'Allowlisting is stronger because it denies anything that was not explicitly approved, so a ' +
      'novel attacker tool fails to run purely for never having been on the list. It is harder to ' +
      'deploy because every legitimate change now needs approval first: a developer installing a new ' +
      'library or a one-off script would have to go through that process before it runs, which turns a ' +
      'five-minute task into a ticket and a wait on a laptop where software changes constantly. It is a ' +
      'much better fit on fixed-purpose systems, like kiosks or servers running one application, where ' +
      'that overhead barely comes up.',
    expectedOutput:
      'An answer stating why allowlisting is stronger, a concrete example of the maintenance cost it ' +
      'creates, and where it is a better fit.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['stronger', 'deny', 'unapproved', 'novel', 'never on the list'],
          ['harder', 'maintain', 'approval', 'ticket', 'overhead', 'changes constantly', 'developer installing'],
          ['fixed-purpose', 'kiosk', 'server', 'rarely changes', 'better fit'],
        ],
        hint:
          'Three ideas: why allowlisting is stronger, a concrete cost it creates on a laptop where ' +
          'software changes often, and where it is a better fit instead.',
      },
    ],
    debrief:
      'Notice this is the same shape of trade-off as the hardening exception module: the stronger ' +
      'safeguard is not free, and deciding where to pay that cost is the actual engineering judgement.',
    practice: [],
  },
];

// --- Module sef.5: logging pipeline design --------------------------------------

const LOG_VALUE_TEACH = {
  concept:
    'A LOG is just a written record of something that happened: a computer, or a piece of software on ' +
    'it, writing down a line of text every time a particular kind of event occurs, a login, a file being ' +
    'opened, a connection being made. Collected together across a company\'s systems, that is called ' +
    'TELEMETRY, and a "logging pipeline" is the plumbing that carries all of it somewhere it can be ' +
    'searched later.\n\n' +
    'Think about a security camera system. "Log everything" is the same instinct as wanting a camera ' +
    'pointed at every square inch of a building, recording day and night forever. It sounds like the ' +
    'safe answer, and it is usually the wrong one: storing that much footage costs money, and when ' +
    'something actually happens, somebody now has to scrub through thousands of hours of a completely ' +
    'empty hallway to find the ten seconds that mattered. Every camera has a cost in storage, which most ' +
    'logging and SIEM (short for security information and event management, the platform that stores ' +
    'and searches this data) products charge for by volume, and a second cost that is easy to forget: ' +
    'every extra camera feed is something a person or an automated detection rule has to sift through, ' +
    'so a system drowning in low-value footage makes the genuinely useful footage harder to find, not ' +
    'easier.\n\n' +
    'The design question is never "can we record this," which is almost always yes. It is "does this ' +
    'footage let us answer a question we will actually need to ask." If the honest answer is "it would ' +
    'be nice to have," that is usually a feed to leave out entirely, or to send to cheap, rarely-checked ' +
    'storage rather than the expensive, actively watched one.',
} as const;

const RETENTION_TEACH = {
  concept:
    'Think about how a household actually handles paper. Recent bills sit in a folder on the desk ' +
    'where they can be grabbed in seconds. Old tax paperwork from years ago goes in a box in the attic, ' +
    'slower to dig out but far cheaper to keep around than filing cabinets full of it in the living ' +
    'room. Nobody keeps every piece of paper equally accessible forever; what changes is how often each ' +
    'kind gets looked at.\n\n' +
    'RETENTION, in a logging pipeline, is how long collected data is kept before it gets deleted, and ' +
    'not every collected source needs to live in the expensive, instantly searchable tier for the same ' +
    'length of time. A workable pattern tiers data by how it is actually used.\n\n' +
    'HOT storage, the desk folder, fast and instantly searchable, suits what automated detections check ' +
    'in real time and what an analyst needs during an active investigation, typically kept for weeks to ' +
    'a few months. COLD or archive storage, the attic box, cheap and slow to retrieve, suits what a ' +
    'compliance rule or a future investigation might eventually need but nothing checks day to day, ' +
    'often kept far longer to satisfy that rule.\n\n' +
    'Getting this wrong in either direction has a cost. Keeping everything in the desk folder forever ' +
    'recreates the "collect everything expensively" problem from the earlier exercises. Keeping too ' +
    'little, or throwing it away entirely, means a slow investigation into something from six weeks ago ' +
    'finds nothing, because the data was already gone before anyone knew they would need it.',
} as const;

const MODULE_SEF_5: Exercise[] = [
  {
    id: 'sef.5.1',
    moduleId: 'sef.5',
    packageId: 'security-engineering-foundations',
    order: 1,
    title: 'What to collect, and what only feels thorough',
    kind: 'multiple-choice',
    goal: 'Judge telemetry sources by whether they answer a real question, not by how thorough collecting them feels.',
    prompt:
      'You are deciding what to collect for a new logging pipeline. Which of the following are ' +
      'accurate? Select all that apply.',
    teach: LOG_VALUE_TEACH,
    options: [
      { id: 'a', label: 'Authentication events, successful and failed logins and privilege use, are consistently high value because most attack paths pass through them somewhere.' },
      { id: 'b', label: 'Process creation telemetry, including command-line arguments, is high value because it captures what actually ran, not just that something ran.' },
      { id: 'c', label: 'Verbose debug-level output from every application, collected because it is available, tends to add volume without adding investigative value.' },
      { id: 'd', label: 'A telemetry source should be judged by whether it lets you answer a question you actually need answered, not by whether collecting it is technically possible.' },
      { id: 'e', label: 'Firewall permit logs, recording every allowed connection across the estate in full detail, are generally as valuable to collect as firewall deny logs, since both describe network activity.' },
    ],
    hints: [
      'Four describe how to judge a source correctly. One treats two very different log types as equally valuable.',
      'Ask which log type tells you something unusual happened, and which mostly records ordinary traffic succeeding as intended.',
      'Volume and value are not the same thing; a source can be enormous and low signal at the same time.',
    ],
    solution:
      'A, B, C, and D. Authentication events and process creation with command-line detail are high ' +
      'value, verbose debug output is usually noise, and the deciding question is always what it lets ' +
      'you answer. E treats permit and deny logs as equivalent, when in practice deny logs, describing ' +
      'blocked or unusual activity, tend to carry far more signal per event than permit logs, which ' +
      'mostly record enormous volumes of ordinary traffic behaving as intended.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a very high-volume, mostly benign log type as being as valuable as a much higher-signal one.',
      },
    ],
    debrief:
      'The question is never whether a source of data exists. It is whether you would ever actually go ' +
      'looking in it, and for what, the way an empty hallway camera earns its keep only if someone ' +
      'would ever review its footage.',
    practice: [],
  },
  {
    id: 'sef.5.2',
    moduleId: 'sef.5',
    packageId: 'security-engineering-foundations',
    order: 2,
    title: 'The real cost of ingesting everything',
    kind: 'multiple-choice',
    goal: 'Understand the financial and signal costs of over-collection.',
    prompt:
      'A colleague argues "storage is cheap now, so we should just ingest everything and figure out ' +
      'what to use later." Which of the following are accurate responses? Select all that apply.',
    teach: {
      concept:
        'Two costs compound when a pipeline collects everything, and only one of them shows up on a ' +
        'bill. The financial one is straightforward: most commercial logging and SIEM platforms charge ' +
        'primarily by how much data flows in, so collecting more sources has a direct dollar cost, ' +
        'sometimes for sources nobody ever actually looks at.\n\n' +
        'The second cost is less visible on an invoice and more corrosive. Think of it like a library ' +
        'where every book ever printed, useful or not, gets shelved with no organisation at all. ' +
        'Somebody looking for one specific fact now has to wade through everything else in the building ' +
        'to find it. A person or an automated detection rule searching for a specific behaviour has to ' +
        'search across whatever was collected, and every low-value source dilutes the useful data, slows ' +
        'the search down, and raises the chance a genuine finding gets buried among results nobody has ' +
        'time to read.\n\n' +
        'Collecting everything is often assumed to be the cautious, safe default. In practice it trades ' +
        'money and search speed for a completeness that mostly goes unused.',
    },
    options: [
      { id: 'a', label: 'Most commercial log and SIEM platforms price primarily on ingested volume, so collecting more sources has a direct financial cost.' },
      { id: 'b', label: 'Data that is ingested but never queried is still being paid for, which is a hidden cost of collecting a source "just in case."' },
      { id: 'c', label: 'A large volume of low-value telemetry can make it slower to find genuinely important results, because the search space itself has grown.' },
      { id: 'd', label: '"Ingest everything" is often assumed to be the cautious choice, when in practice it trades cost and search speed for a completeness that mostly goes unused.' },
      { id: 'e', label: 'Storage has become inexpensive enough that the financial cost of over-collection is no longer a meaningful factor in pipeline design.' },
    ],
    hints: [
      'Four name the actual costs. One assumes cheap storage has erased the cost problem entirely.',
      'Most SIEM pricing is not raw storage pricing; ingestion and search at volume carry their own cost.',
      'Even at zero financial cost, would the signal problem disappear?',
    ],
    solution:
      'A, B, C, and D. Volume-based pricing, paying for data nobody queries, a growing search space, ' +
      'and the false sense of safety in collecting everything are all real. E is wrong on both counts: ' +
      'SIEM pricing at scale is rarely just cheap raw storage, and even where storage were free, the ' +
      'signal cost of a bloated search space would remain.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes cheap storage has removed the cost problem entirely, including the signal cost.',
      },
    ],
    debrief:
      'Cheap storage answers one of the two costs. The second one, a bigger haystack to search through, ' +
      'does not go away just because the storage bill did.',
    practice: [],
  },
  {
    id: 'sef.5.3',
    moduleId: 'sef.5',
    packageId: 'security-engineering-foundations',
    order: 3,
    title: 'Collection is a detection decision made early',
    kind: 'multiple-choice',
    goal: 'Recognise that a pipeline design decision can silently determine what detection is possible later.',
    prompt:
      'A pipeline is configured to drop command-line arguments from process creation logs to save ' +
      'volume. Which of the following are accurate about the consequence of that decision? Select ' +
      'all that apply.',
    teach: {
      concept:
        'A "command-line argument" is the extra detail typed after a program\'s name that tells it ' +
        'exactly what to do, the same way "print report.pdf, 20 copies, double-sided" is more specific ' +
        'than just "print." Think of a security camera pointed at a doorway that only ever records that ' +
        'someone walked through, with no way to zoom in on what they were carrying. If it never captured ' +
        'that detail in the first place, no amount of reviewing the footage afterward will reveal what ' +
        'was in their hands.\n\n' +
        'A DETECTION RULE, an automated check that looks for a specific suspicious pattern in the logs, ' +
        'can only ever use a detail that was actually written down. If a pipeline drops command-line ' +
        'arguments to save on volume, no detection written afterward can ever alert on a suspicious one, ' +
        'no matter how skilled the person writing that detection is. The decision was effectively made ' +
        'months earlier, by whoever configured what gets recorded, and the detection engineer just ' +
        'inherits the gap.\n\n' +
        'This is why logging pipeline design is not purely an infrastructure or cost exercise. Every ' +
        'choice about what to record, and in how much detail, is quietly also a choice about what can ' +
        'ever be detected later, and it should be made with a detection engineer or someone thinking ' +
        'like one in the room, not decided on cost grounds alone.',
    },
    options: [
      { id: 'a', label: 'A detection rule can only reference a field that was actually collected, so dropping a field at ingestion permanently forecloses any future detection that needed it.' },
      { id: 'b', label: 'A pipeline design decision made purely to save on ingestion cost can silently decide, months in advance, what a detection engineer will never be able to catch.' },
      { id: 'c', label: 'Because of this link, decisions about what telemetry to collect benefit from involving someone thinking about detection, not only someone thinking about cost.' },
      { id: 'd', label: 'A field that seems unnecessary today can become the one piece of evidence a future detection or investigation depends on, which is an argument for deliberate, judged collection rather than an unconsidered one.' },
      { id: 'e', label: 'If a needed field turns out to be missing after an incident, it can usually still be recovered retroactively from other logs collected at the time.' },
    ],
    hints: [
      'Four describe the real, permanent consequence of a collection gap. One assumes a missing field can be recovered after the fact.',
      'Ask where a command-line argument that was never written to disk anywhere would come from later.',
      'A gap discovered during an investigation is discovered too late to close for that investigation.',
    ],
    solution:
      'A, B, C, and D. The permanence of a collection gap, its origin as a cost-only decision, the ' +
      'case for involving detection thinking upfront, and treating collection as deliberate all follow ' +
      'from the same fact. E is the mistake that makes this dangerous: a field that was never captured ' +
      'anywhere cannot be reconstructed afterward, which is exactly why the decision matters before ' +
      'the gap is ever needed.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes a field that was never collected can be recovered after an incident.',
      },
    ],
    debrief:
      'This is the sentence worth remembering from this module: a pipeline decision made for cost ' +
      'reasons today is also a decision about what can ever be caught later, whether or not anyone in ' +
      'the room realises it.',
    practice: [],
  },
  {
    id: 'sef.5.4',
    moduleId: 'sef.5',
    packageId: 'security-engineering-foundations',
    order: 4,
    title: 'Matching retention to how a source is used',
    kind: 'multiple-choice',
    goal: 'Tier storage and retention by how a telemetry source is actually queried.',
    prompt:
      'You are designing retention tiers for a new pipeline. Which of the following are sound ' +
      'principles? Select all that apply.',
    teach: RETENTION_TEACH,
    options: [
      { id: 'a', label: 'Sources that active detections query in near real time generally belong in fast, actively searched (hot) storage.' },
      { id: 'b', label: 'Sources kept mainly to satisfy a compliance retention requirement, rarely queried day to day, are reasonable candidates for cheaper cold or archive storage.' },
      { id: 'c', label: 'Retention periods should be set with an eye to how long an investigation might reasonably need to look back, not just to what is cheapest to keep briefly.' },
      { id: 'd', label: 'Once a decision is made to retain a source at all, it should be kept in hot storage for its full retention period, since moving it later adds engineering complexity.' },
      { id: 'e', label: 'A source with genuinely no investigative or compliance value going forward is a candidate to stop collecting entirely, rather than retaining indefinitely out of caution.' },
    ],
    hints: [
      'Four describe sensible tiering. One argues against ever moving data to a cheaper tier once retained.',
      'Ask whether every source needs to stay in the expensive, actively searched tier for its whole retention period.',
      'A lifecycle policy that moves ageing data to cold storage automatically is standard practice, not unusual complexity.',
    ],
    solution:
      'A, B, C, and E. Matching hot storage to what is actively queried, cold storage to compliance-' +
      'only needs, sizing retention to realistic investigation windows, and retiring genuinely useless ' +
      'sources are all sound. D argues against ever tiering data down over time, which recreates the ' +
      '"everything expensive forever" problem this module has been building against.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'One option argues against ever moving retained data to a cheaper storage tier.',
      },
    ],
    debrief:
      'Retention is not one setting per source, it is a lifecycle, the same way paperwork moves from ' +
      'desk to attic to shredder: hot while it is likely to be checked, cold once it is mostly there to ' +
      'satisfy a requirement, gone once it serves neither.',
    practice: [],
  },
  {
    id: 'sef.5.5',
    moduleId: 'sef.5',
    packageId: 'security-engineering-foundations',
    order: 5,
    title: 'Explain what dropping command-line logging gives up',
    kind: 'short-answer',
    goal: 'Explain why a collection decision made for cost reasons is also a detection engineering decision.',
    prompt:
      'A colleague proposes dropping command-line arguments from process creation logs across the ' +
      'estate to cut ingestion volume, arguing "we still see that a process ran, which is the ' +
      'important part." In three or four sentences, explain what this decision actually gives up.',
    teach: {
      concept:
        'A strong answer says specifically what is lost, not just that something is lost. Knowing a ' +
        'program ran without knowing what instructions it was given hides exactly the detail that ' +
        'separates ordinary use from an attack: a legitimate administrative tool run normally, and the ' +
        'same tool run with an extra instruction that quietly downloads and runs a hidden script, look ' +
        'completely identical in a log that only records the tool\'s name.\n\n' +
        'It should also name that the gap is permanent and silent: no detection rule can be written ' +
        'later to catch what the pipeline never wrote down in the first place, and the gap is usually ' +
        'only discovered during an investigation that needed exactly that detail, which is the worst ' +
        'possible time to find out it was never collected.',
    },
    hints: [
      'Say specifically what the argument reveals that the bare process name does not.',
      'Give a concrete example: a legitimate tool used normally versus the same tool used maliciously.',
      'Mention that the gap is permanent, and is typically discovered during an investigation that needed exactly that field.',
    ],
    solution:
      'Knowing that a process ran without its arguments hides exactly the detail that separates normal ' +
      'use from an attack. A legitimate administrative tool run normally and the same tool invoked ' +
      'with a flag that downloads and executes a remote script would look identical in a log that only ' +
      'records the process name. That gap is also permanent: no detection rule written afterward can ' +
      'recover a field the pipeline never captured, and it is typically discovered during an ' +
      'investigation that needed exactly that argument, which is the worst possible time to find out ' +
      'it was never collected.',
    expectedOutput:
      'An answer naming what command-line arguments reveal that a bare process name does not, with a ' +
      'concrete example, and noting the gap is permanent and usually discovered too late.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['argument', 'flag', 'command line', 'reveals', 'distinguish', 'legitimate versus'],
          ['permanent', 'cannot recover', 'never captured', 'gone', 'silent'],
          ['investigation', 'incident', 'discover', 'too late', 'find out'],
        ],
        hint:
          'Three ideas: what the arguments actually reveal, why the gap is permanent once the field is ' +
          'dropped, and when it is usually discovered.',
      },
    ],
    debrief:
      'The colleague is not wrong that the log still shows a process ran. They are wrong that this is ' +
      'the important part.',
    practice: [],
  },
];

// --- Module sef.6: applied cryptography for engineers ---------------------------

const TLS_TEACH = {
  concept:
    'ENCRYPTION, at its simplest, means scrambling information using a secret key so that only someone ' +
    'holding the matching key can turn it back into something readable. Think about a sealed, tamper-' +
    'evident envelope carried by a courier between two offices. The envelope stops anyone along the way ' +
    'from reading what is inside, and it shows visible damage if somebody tries to open it in transit. ' +
    'It does not do anything about what happens to the letter once it arrives and gets pulled out of ' +
    'the envelope, and it does not stop the courier from being tricked into handing the envelope to the ' +
    'wrong office in the first place.\n\n' +
    'TLS (short for Transport Layer Security) is that sealed envelope for a network connection. It ' +
    'protects data only while it is actually moving between two specific points. It gives ' +
    'confidentiality, so someone watching the network in between cannot read the contents; integrity, ' +
    'so tampering along the way is detectable; and, through a CERTIFICATE, a kind of verified ID card a ' +
    'server presents, authentication that the connection really is going to the office it claims to be ' +
    'going to, not proof the organisation behind it is trustworthy in any broader sense.\n\n' +
    'That is real and valuable, and it is also narrow. TLS says nothing about what happens to the data ' +
    'before it is sealed into the envelope or after it is opened: if it is then stored unencrypted on a ' +
    'disk at either end, TLS never touched that. It says nothing about the actual content of the letter: ' +
    'a perfectly sealed envelope can still carry a request an attacker crafted through a flawed piece of ' +
    'software, and the sealing does not make that request any less dangerous. And it says nothing about ' +
    'who is holding the envelope at either end: a compromised machine with a perfectly valid, encrypted ' +
    'connection to a legitimate server is simply an attacker with a secure connection.\n\n' +
    '"We use encryption" answers a question about the wire the data travels across. It stops being a ' +
    'complete answer the moment the conversation turns to data sitting still on a disk, the code ' +
    'processing it, or the machine sending it in the first place.',
} as const;

const KEY_MGMT_TEACH = {
  concept:
    'A "key" here just means a secret, a password-like piece of data used to encrypt or unlock ' +
    'something, and "key management" means how carefully that secret gets created, stored, shared, and ' +
    'eventually replaced. The mistakes that actually cause incidents around keys are mundane, not ' +
    'exotic, the digital version of leaving a spare house key under the doormat rather than someone ' +
    'picking a bank vault lock.\n\n' +
    'A credential typed directly into a program\'s source code sits in every copy of that code and every ' +
    'built version of the software indefinitely, including copies nobody remembers still exist, the ' +
    'same way a key left under one doormat is actually under every copy of that doormat ever made. The ' +
    'same key reused across a company\'s testing, staging, and live production systems means a leak from ' +
    'whichever of the three is least protected compromises all three at once.\n\n' +
    'A key that is never replaced (never "rotated") means a leak from years earlier, quietly, is still ' +
    'valid and usable today. And a key committed into VERSION CONTROL, the system that tracks every ' +
    'past change made to a codebase, persists in that history even after the file is deleted in a later ' +
    'change, unless the history itself is rewritten and every copy holding the old history is tracked ' +
    'down and fixed, which in practice rarely happens completely.\n\n' +
    'None of these require an attacker to break the mathematics behind encryption. They require the ' +
    'attacker to find a key that engineering practice left lying around, which is a far easier and far ' +
    'more common way in than any weakness in the underlying algorithm itself.',
} as const;

const MODULE_SEF_6: Exercise[] = [
  {
    id: 'sef.6.1',
    moduleId: 'sef.6',
    packageId: 'security-engineering-foundations',
    order: 1,
    title: 'What TLS protects, and where it stops',
    kind: 'multiple-choice',
    goal: 'State precisely what TLS guarantees and what it leaves entirely untouched.',
    prompt:
      'A colleague says "the connection is encrypted, so we are covered." Which of the following are ' +
      'accurate? Select all that apply.',
    teach: TLS_TEACH,
    options: [
      { id: 'a', label: 'TLS provides confidentiality and integrity for data in transit between two specific endpoints.' },
      { id: 'b', label: 'The certificate in a TLS connection authenticates that the server is the domain it claims to be, which is narrower than proving the organisation is trustworthy overall.' },
      { id: 'c', label: 'TLS says nothing about how data is protected once it is stored on disk at either end of the connection.' },
      { id: 'd', label: 'A connection secured with valid TLS can still carry a malicious request if the application logic on either end is vulnerable.' },
      { id: 'e', label: 'A system that uses TLS for all of its network traffic can be considered to have solved data protection for that system as a whole.' },
    ],
    hints: [
      'Four describe accurately what TLS does and does not cover. One extends TLS to cover the whole system.',
      'Ask what happens to the data the instant it is written to disk on either end.',
      'A well-formed, correctly encrypted request can still contain an attack; TLS never inspects that.',
    ],
    solution:
      'A, B, C, and D. In-transit protection, the narrow scope of certificate authentication, silence ' +
      'about data at rest, and silence about application logic are all accurate. E overreaches: TLS on ' +
      'the wire says nothing about storage, application logic, or the endpoints themselves, so it does ' +
      'not amount to solving data protection overall.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats encrypting network traffic as covering data protection for the whole system.',
      },
    ],
    debrief:
      'Whenever someone says "it is encrypted" as a complete answer, ask encrypted where, and what ' +
      'happens to the letter the moment it is out of the envelope.',
    practice: [],
  },
  {
    id: 'sef.6.2',
    moduleId: 'sef.6',
    packageId: 'security-engineering-foundations',
    order: 2,
    title: '"We use encryption" is not a complete answer',
    kind: 'multiple-choice',
    goal: 'Recognise what a complete statement about a data protection control needs to specify.',
    prompt:
      'An audit asks how customer data is protected, and the answer given is "we use encryption." ' +
      'Which of the following are accurate about why that answer is incomplete? Select all that ' +
      'apply.',
    teach: {
      concept:
        'The sentence "we use encryption" is a bit like saying "we lock things up" without saying what ' +
        'is locked, with what kind of lock, or who is holding a copy of the key. It leaves out every ' +
        'detail that determines whether the protection is actually real for the specific worry someone ' +
        'has. What is actually protected: the connection, the physical disk, the backup, or a single ' +
        'field in a database, are not all the same claim. Who holds the decryption keys, and how they ' +
        'are managed, often decides almost everything about whether the encryption defends against the ' +
        'threat someone is actually worried about.\n\n' +
        'Encrypting a database\'s data AT REST, meaning while it is sitting still in storage rather than ' +
        'moving across a network, protects against a stolen physical disk: whoever steals the drive just ' +
        'gets scrambled data without the key. It does nothing against an attacker who has already broken ' +
        'into the application itself using its own, legitimate database access, because the application ' +
        'decrypts the data automatically for anyone using that access, the same way a locked filing ' +
        'cabinet does nothing to stop someone who already has the office key. A complete answer names ' +
        'what is encrypted, with what method, who or what can decrypt it, and which specific threat that ' +
        'combination actually defends against.',
    },
    options: [
      { id: 'a', label: 'A complete answer to "how is this protected" should name what specifically is encrypted, not just that encryption is used somewhere in the system.' },
      { id: 'b', label: 'Disk-at-rest encryption defends against a stolen physical disk, but does not defend against an attacker who has compromised the application using its normal database credentials.' },
      { id: 'c', label: 'The algorithm and mode in use matters, because a legacy cipher kept for backward compatibility can be substantially weaker than a current default.' },
      { id: 'd', label: 'Who holds the decryption keys, and under what conditions they release them, determines what threat the encryption actually defends against.' },
      { id: 'e', label: 'Once a system encrypts its data at rest, application-layer access controls become largely redundant, since the data itself is already protected.' },
    ],
    hints: [
      'Four are the details a complete answer needs. One treats encryption at rest as replacing application access controls.',
      'Ask what an application does with the data every time a legitimate user requests it.',
      'Encryption protects against certain threats, not every threat, which is the whole point of naming the threat it addresses.',
    ],
    solution:
      'A, B, C, and D. What is protected, the specific threat disk encryption addresses, algorithm and ' +
      'mode choice, and key custody all belong in a complete answer. E is the mistake auditors are ' +
      'specifically checking for: disk encryption does nothing to stop misuse through the ' +
      'application\'s own legitimate access, so access controls remain just as necessary.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats encryption at rest as making application access controls unnecessary.',
      },
    ],
    debrief:
      'A good audit answer is a short paragraph, not a slogan: what is encrypted, with what, who holds ' +
      'the keys, and what specific threat that combination actually defends against.',
    practice: [],
  },
  {
    id: 'sef.6.3',
    moduleId: 'sef.6',
    packageId: 'security-engineering-foundations',
    order: 3,
    title: 'The mistakes that actually cause incidents',
    kind: 'multiple-choice',
    goal: 'Recognise common, mundane key management failures rather than exotic cryptographic weaknesses.',
    prompt:
      'A code review finds an API key hardcoded in a source file that was committed two years ago and ' +
      'later removed in a subsequent commit. Which of the following are accurate about this finding? ' +
      'Select all that apply.',
    teach: KEY_MGMT_TEACH,
    options: [
      { id: 'a', label: 'A credential hardcoded in source code persists in every clone of the repository and build artifact, indefinitely.' },
      { id: 'b', label: 'Reusing the same key across development, staging, and production means a leak from the least protected of the three compromises all of them.' },
      { id: 'c', label: 'A key that is never rotated means a leak from years earlier can still be valid and usable today.' },
      { id: 'd', label: 'Deleting a secret from the current version of a file does not remove it from the version control history that still contains the earlier commit.' },
      { id: 'e', label: 'These mistakes are largely historical, and modern development practices have made hardcoded or unrotated credentials a rare finding in current codebases.' },
    ],
    hints: [
      'Four describe real, common failure modes, including the one directly in this scenario. One claims this class of mistake is now rare.',
      'Ask whether removing a secret from the latest commit removes it from every earlier commit too.',
      'This exact finding, a key committed two years ago and later removed, is evidence against the last option, not for it.',
    ],
    solution:
      'A, B, C, and D. Persistence in clones and artifacts, cross-environment reuse, lack of rotation, ' +
      'and survival in version control history are all real and common. E is contradicted by the ' +
      'scenario itself: this exact mistake, a key sitting in history long after removal from the ' +
      'current file, is still routinely found in real codebases.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option claims this class of mistake has become rare, which the scenario itself argues against.',
      },
    ],
    debrief:
      'The fix here is not just removing the key from the current file. It is replacing the key ' +
      'entirely, since the old one is still live in the history whether or not the current file ' +
      'mentions it.',
    practice: [],
  },
  {
    id: 'sef.6.4',
    moduleId: 'sef.6',
    packageId: 'security-engineering-foundations',
    order: 4,
    title: 'What "do not roll your own crypto" actually means',
    kind: 'multiple-choice',
    goal: 'Define precisely what the rule warns against, and what engineering judgement still remains.',
    prompt:
      'A junior engineer asks whether "do not roll your own crypto" means they should never touch a ' +
      'cryptography library or make any configuration decisions themselves. Which of the following ' +
      'are accurate? Select all that apply.',
    teach: {
      concept:
        'Imagine someone who has never built a car deciding to design their own seatbelt buckle from ' +
        'scratch, reasoning that the store-bought ones seem simple enough. It is not that using seatbelts ' +
        'is a bad idea, or that the person can never touch a seatbelt. It is that inventing the actual ' +
        'mechanism from nothing, rather than buying one that crash-test engineers have spent years ' +
        'trying to break, is where things quietly go wrong.\n\n' +
        '"Do not roll your own crypto" is the same warning about cryptography, the mathematics behind ' +
        'encryption. It does not mean avoid cryptography entirely, or never touch a cryptography ' +
        'library; every engineer here will use TLS, password hashing, and encryption libraries ' +
        'constantly. What it specifically warns against is inventing a brand-new cipher or hash function ' +
        'from scratch (a "PRIMITIVE" is the term for one of these basic building blocks), or inventing a ' +
        'new way of combining established building blocks, because both are places where a subtle ' +
        'mistake stays invisible until someone with real expertise in breaking cryptography, often an ' +
        'attacker, finds it.\n\n' +
        'A well-tested building block, and a well-tested combination of them like TLS itself, have had ' +
        'years of people actively trying to break them, the crash-test engineers of this field. A ' +
        'homemade scheme has had none of that scrutiny. There is still real engineering judgement ' +
        'required even when using well-tested libraries correctly: choosing the right building block for ' +
        'the job, using an established library rather than rebuilding it from scratch, configuring it ' +
        'correctly, and managing the keys around it. Treating the rule as an excuse to stop thinking ' +
        'about cryptography entirely is its own mistake.',
    },
    options: [
      { id: 'a', label: 'The rule specifically warns against inventing new cryptographic primitives or new protocols for how primitives combine, not against using cryptography libraries at all.' },
      { id: 'b', label: 'A vetted, widely used protocol like TLS has had years of adversarial scrutiny that a homemade scheme has never been subjected to.' },
      { id: 'c', label: 'Using a vetted library correctly still requires real engineering judgement: choosing the right primitive, configuring it correctly, and managing keys around it.' },
      { id: 'd', label: 'Treating the rule as a reason to disengage entirely from thinking about cryptographic choices is itself a mistake, since correct use is still a skill.' },
      { id: 'e', label: 'Because rolling your own crypto is discouraged, an engineer without a cryptography background should avoid making any decisions about which library function or configuration option to use, and defer entirely to defaults.' },
    ],
    hints: [
      'Four state the rule precisely. One takes it much further than it actually goes.',
      'The rule is about inventing primitives and protocols, not about ever choosing a configuration option.',
      'Ask what would be left of this whole module if engineers deferred entirely to defaults with no judgement at all.',
    ],
    solution:
      'A, B, C, and D. The rule\'s narrow, specific scope, the value of adversarial scrutiny, the ' +
      'judgement still required in correct use, and the danger of disengaging entirely are all ' +
      'accurate. E overcorrects: it turns a warning against inventing primitives into an excuse to ' +
      'never exercise judgement about configuration at all, which is exactly the disengagement the ' +
      'concept warns against.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option extends the rule into avoiding all configuration judgement, which goes further than the rule actually warns against.',
      },
    ],
    debrief:
      'The rule protects you from inventing your own seatbelt buckle. It does not, and cannot, protect ' +
      'you from installing a good one incorrectly, which is why the judgement half of this job never ' +
      'goes away.',
    practice: [],
  },
  {
    id: 'sef.6.5',
    moduleId: 'sef.6',
    packageId: 'security-engineering-foundations',
    order: 5,
    title: 'Respond to a proposed homemade scheme',
    kind: 'short-answer',
    goal: 'Explain why a homemade obfuscation scheme is a mistake, and what to propose instead.',
    prompt:
      'A junior engineer on your team proposes writing a custom XOR-based obfuscation scheme for a ' +
      'sensitive configuration file, arguing that "a standard encryption library is overkill for our ' +
      'use case." In three or four sentences, explain why this is a mistake, and what you would ' +
      'suggest instead.',
    teach: {
      concept:
        'XOR is one of the simplest possible ways to scramble data: it combines each piece of the ' +
        'original data with a piece of a secret key using a basic mathematical rule, cheap to write and ' +
        'easy to understand, which is exactly why it is tempting and exactly why it is weak. A strong ' +
        'answer says specifically why this scheme is weak, not just that homemade cryptography is ' +
        'generally discouraged: a simple XOR scheme is trivially broken once any part of the original ' +
        'data or the key can be guessed, which is common for structured configuration data that follows ' +
        'a predictable pattern, and it has had no expert scrutiny at all, unlike an established method.\n\n' +
        'It should propose a concrete, well-tested alternative: an established authenticated encryption ' +
        'building block, or, better still, a secrets manager, a dedicated tool that stores and hands out ' +
        'secrets securely so nobody needs to hand-encrypt and distribute a file at all. It should also ' +
        'note that recognising this is exactly the kind of judgement this module has been building ' +
        'toward: not avoiding cryptography, but refusing to invent it from scratch.',
    },
    hints: [
      'Say specifically why an XOR scheme is weak, not just that homemade crypto is generally discouraged.',
      'Name a concrete alternative: a real primitive or, better, a secrets management solution.',
      'A strong closing line connects this back to the idea that recognising the trap is the sign of experience, not the crypto library itself.',
    ],
    solution:
      'A simple XOR scheme is trivially broken once any part of the plaintext or key can be guessed, ' +
      'which is common for structured configuration data, and it has had no adversarial review at all, ' +
      'unlike an established primitive. I would suggest using a vetted authenticated encryption ' +
      'library instead, or better, moving the sensitive values into a secrets manager so the file does ' +
      'not need to be hand-encrypted and distributed at all. Recognising that this is a case for a ' +
      'vetted tool rather than a clever shortcut is exactly the judgement this rule is meant to build.',
    expectedOutput:
      'An answer explaining specifically why the XOR scheme is weak, naming a vetted alternative or a ' +
      'secrets manager, and connecting the choice to engineering judgement rather than a blanket ban.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['xor', 'trivially broken', 'weak', 'no review', 'guessable'],
          ['vetted library', 'established', 'authenticated encryption', 'secrets manager', 'vault'],
          ['judgement', 'invent', 'roll your own', 'recognise', 'maturity'],
        ],
        hint:
          'Three ideas: specifically why the XOR scheme is weak, a concrete vetted alternative, and how ' +
          'this connects to the judgement behind "do not roll your own crypto."',
      },
    ],
    debrief:
      'The junior engineer was not wrong that a full encryption library felt heavy for the task. They ' +
      'were solving the wrong problem: the fix for a clunky tool is a better tool, not a homemade one.',
    practice: [],
  },
];

// --- Module sef.7: identity and secrets in infrastructure -----------------------

const MACHINE_IDENTITY_TEACH = {
  concept:
    'Every person who logs into a company system usually has their own username, an IDENTITY the ' +
    'system uses to know who they are and what they are allowed to do. But not every login on a network ' +
    'belongs to a person. A scheduled overnight report, a piece of software checking another system for ' +
    'updates, a deployment tool pushing out new code: all of these need to prove who they are too, the ' +
    'same way a person does, except there is no human sitting there typing a password. A SERVICE ' +
    'ACCOUNT, sometimes called a machine identity, is an identity built for exactly that: a workload, an ' +
    'application, a script, or a piece of infrastructure authenticating itself to a database, another ' +
    'system, or an API (a defined way for one piece of software to talk to another).\n\n' +
    'These accumulate quietly, the way spare keys accumulate in a busy office where nobody is in charge ' +
    'of collecting the old ones back, because creating a new one is easy and nobody specifically owns ' +
    'cleaning up the old ones: every integration, every scheduled job, every deployment pipeline tends ' +
    'to get its own. They also tend toward being over-privileged, given more access than they actually ' +
    'need, because it is faster at setup time to grant broad access once than to work out the narrow ' +
    'access the job actually requires, and because unlike a human account, nobody complains when a ' +
    'machine identity\'s access is too broad; it simply never gets questioned by anyone.\n\n' +
    'The result, common enough to be the single most predictable finding in a first access review of ' +
    'almost any company, is a long tail of service accounts nobody remembers creating, holding ' +
    'permissions nobody would grant if asked to justify them today.',
} as const;

const STANDING_CREDS_TEACH = {
  concept:
    'Think about the difference between a house key that works forever until someone physically changes ' +
    'the lock, and a hotel key card that automatically stops working the day the guest checks out, ' +
    'whether or not the front desk ever does anything about it. Both open a door. Only one of them has a ' +
    'built-in expiry that does not depend on a person remembering to act.\n\n' +
    'A STANDING CREDENTIAL, an API key or password that stays valid indefinitely and sits somewhere, a ' +
    'configuration file, an environment variable, a script, is the house key: it works right up until ' +
    'the moment it is stolen, at which point it keeps working for the attacker exactly as well as it ' +
    'worked for the legitimate system, for as long as nobody notices and manually replaces it.\n\n' +
    'The alternative, increasingly the default in modern infrastructure, is a SHORT-LIVED CREDENTIAL, ' +
    'the hotel key card: one issued for minutes or hours, scoped to one specific task, that expires on ' +
    'its own even if nobody actively revokes it. The practical difference shows up at the worst possible ' +
    'moment: a leaked standing credential is a live incident until somebody finds and replaces it, which ' +
    'can take days; a leaked short-lived credential is often already expired, or about to be, which ' +
    'shrinks the entire window of usefulness to an attacker without anyone having to do anything.\n\n' +
    'This is also why a plan that depends on replacing a credential after a break-in is detected is ' +
    'weaker than a plan where the credential expires on a timer regardless of whether anyone notices.',
} as const;

const MODULE_SEF_7: Exercise[] = [
  {
    id: 'sef.7.1',
    moduleId: 'sef.7',
    packageId: 'security-engineering-foundations',
    order: 1,
    title: 'Machine identity and why it proliferates',
    kind: 'multiple-choice',
    goal: 'Understand what a service account is and why estates accumulate over-privileged ones.',
    prompt:
      'An access review turns up dozens of service accounts nobody remembers creating. Which of the ' +
      'following are accurate about why this happens? Select all that apply.',
    teach: MACHINE_IDENTITY_TEACH,
    options: [
      { id: 'a', label: 'A service account authenticates a workload, script, or piece of infrastructure to another system, without a human entering credentials.' },
      { id: 'b', label: 'Service accounts tend to accumulate because provisioning a new one is easy and nobody is specifically responsible for retiring old ones.' },
      { id: 'c', label: 'Service accounts tend toward over-privilege because granting broad access up front is faster than scoping the exact access a workload needs.' },
      { id: 'd', label: 'Unlike a human account with excessive access, an over-privileged service account rarely draws attention on its own, because nothing about its daily use looks unusual to a person watching for it.' },
      { id: 'e', label: 'Because service accounts are not tied to a specific person, access reviews can reasonably skip them and focus on human accounts instead.' },
    ],
    hints: [
      'Four describe why this problem is so common. One argues for excluding service accounts from review entirely.',
      'Ask who would notice if a service account\'s access were far broader than its job required.',
      'The absence of a person behind an account is a reason to review it more carefully, not less.',
    ],
    solution:
      'A, B, C, and D. What a service account is, why they accumulate, why they tend toward over-' +
      'privilege, and why nobody notices are all accurate. E draws exactly the wrong conclusion: the ' +
      'lack of a person behind the account is why over-privilege goes unnoticed, which is an argument ' +
      'for reviewing service accounts more carefully, not skipping them.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option argues for excluding service accounts from access reviews entirely.',
      },
    ],
    debrief:
      'If your last access review did not include service accounts, it reviewed the half of the ' +
      'company\'s identities that were least likely to be over-privileged in the first place, the ' +
      'people someone would actually notice complaining about too much access.',
    practice: [],
  },
  {
    id: 'sef.7.2',
    moduleId: 'sef.7',
    packageId: 'security-engineering-foundations',
    order: 2,
    title: 'Why standing credentials are a liability',
    kind: 'multiple-choice',
    goal: 'Explain why long-lived credentials on infrastructure are riskier than short-lived, scoped ones.',
    prompt:
      'A server\'s configuration file holds a long-lived API key with no expiry. Which of the ' +
      'following are accurate about why this is a liability? Select all that apply.',
    teach: STANDING_CREDS_TEACH,
    options: [
      { id: 'a', label: 'A standing credential remains valid for an attacker exactly as it does for the legitimate system, for as long as nobody notices it was stolen.' },
      { id: 'b', label: 'A short-lived credential expires on its own, which shrinks an attacker\'s window of usefulness without anyone needing to detect the theft first.' },
      { id: 'c', label: 'A plan that depends on rotating a credential after a compromise is detected is weaker than one where the credential expires regardless of detection.' },
      { id: 'd', label: 'Credentials sitting in a configuration file or environment variable are a common form standing credentials take in real infrastructure.' },
      { id: 'e', label: 'A standing credential is acceptable as long as it is long and randomly generated, since guessing it is then computationally infeasible.' },
    ],
    hints: [
      'Four describe why standing credentials specifically are risky. One addresses guessing, which is not the threat this module is about.',
      'The threat here is theft or leakage, not brute force; ask whether a long random key defends against a leak at all.',
      'A credential can be impossible to guess and still be sitting in a file that gets exfiltrated whole.',
    ],
    solution:
      'A, B, C, and D. Equal validity for an attacker, the automatic expiry of short-lived credentials, ' +
      'the weakness of detection-dependent rotation, and configuration files as a common home for ' +
      'standing credentials are all accurate. E answers the wrong threat: length and randomness defend ' +
      'against guessing, not against the credential being leaked or stolen whole, which is the actual ' +
      'risk standing credentials carry.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option defends against guessing the credential, which is not the threat standing credentials are actually vulnerable to.',
      },
    ],
    debrief:
      'A credential that never expires is not made safe by being unguessable. It is made safe by ' +
      'expiring, which a long random string, however hard to guess, still does not do on its own.',
    practice: [],
  },
  {
    id: 'sef.7.3',
    moduleId: 'sef.7',
    packageId: 'security-engineering-foundations',
    order: 3,
    title: 'Vaulting as an engineering discipline',
    kind: 'multiple-choice',
    goal: 'Distinguish a mature secrets vaulting practice from treating a vault as a storage checkbox.',
    prompt:
      'A team migrates its static, long-lived passwords into a secrets vault product and closes the ' +
      'finding as resolved. Which of the following are accurate about whether this is enough? Select ' +
      'all that apply.',
    teach: {
      concept:
        'A SECRETS VAULT (or secrets manager) is a dedicated, access-controlled system built to store ' +
        'passwords and keys instead of scattering them across configuration files and scripts. Imagine a ' +
        'company that used to leave spare keys taped under various desks around the office, and decides ' +
        'to fix that by putting all the keys in one locked drawer, but leaves the drawer unlocked, never ' +
        'changes any of the keys, and does not write down who takes one out. That is real progress in ' +
        'one sense, everything is in one place now, and it is a checkbox exercise in every other sense: ' +
        '"secrets are in a vault now" becomes the finding closed, without changing much about how those ' +
        'secrets actually behave. A more mature practice goes further.\n\n' +
        'DYNAMIC SECRETS: rather than storing one long-lived password, the vault generates a fresh, ' +
        'short-lived credential on demand for whoever asks for it, and revokes it automatically once its ' +
        'time is up. ACCESS CONTROL on the vault itself: not everyone who can reach the vault should be ' +
        'able to read every secret inside it, since a vault everyone can read from is just a more ' +
        'organised way of leaving secrets lying around. AUDITING: every time a secret is accessed, that ' +
        'access gets logged, so a suspicious read becomes a detectable event rather than a silent one. ' +
        'And ROTATION, regularly replacing a credential with a new one, as a routine, automated ' +
        'operation, not a manual task somebody only remembers to do after an incident.\n\n' +
        'Dumping existing static passwords into a vault without changing any of this captures very ' +
        'little of the actual benefit. It just moves where the same static password lives.',
    },
    options: [
      { id: 'a', label: 'Generating fresh, short-lived credentials on demand rather than storing one long-lived password is a core part of what a mature vaulting practice does.' },
      { id: 'b', label: 'Access to secrets stored in a vault should itself follow least privilege, since a vault everyone can read from is a more organised static credential store, not a solved problem.' },
      { id: 'c', label: 'Logging every access to a stored secret means a suspicious read becomes a detectable event rather than a silent one.' },
      { id: 'd', label: 'Migrating existing long-lived, unrotated passwords into a vault without changing how they are issued or rotated captures only a small part of the benefit vaulting is meant to provide.' },
      { id: 'e', label: 'Once secrets are stored in a dedicated vault product, the underlying credentials no longer need to be rotated, since the vault itself is the security control.' },
    ],
    hints: [
      'Four describe what a mature vaulting practice actually adds. One treats storage location alone as the whole fix.',
      'Ask what actually changed about the password itself when it moved into the vault in this scenario.',
      'A vault that just stores the same static password forever has moved the problem, not solved it.',
    ],
    solution:
      'A, B, C, and D. Dynamic secrets, least privilege on the vault itself, auditing, and the limited ' +
      'benefit of a bare migration are all accurate. E treats the vault product itself as a substitute ' +
      'for rotation, when a vault holding a static, unrotated password has the same exposure it had ' +
      'before, just in a different location.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats storing a secret in a vault product as eliminating the need to rotate it.',
      },
    ],
    debrief:
      '"We put it in a vault" closes a finding on paper. Whether it closed the actual risk depends on ' +
      'whether the secret itself changed, from static to short-lived, from unaudited to logged, not on ' +
      'where it happens to sit.',
    practice: [],
  },
  {
    id: 'sef.7.4',
    moduleId: 'sef.7',
    packageId: 'security-engineering-foundations',
    order: 4,
    title: 'Reading a service account\'s privilege',
    kind: 'multiple-choice',
    goal: 'Judge a service account record for excessive privilege, ownership gaps, and credential risk.',
    prompt:
      'You are reviewing this service account record.\n\n' +
      'Service account: svc-reporting.\n' +
      'Purpose: nightly job that reads sales figures from the orders database and emails a summary ' +
      'report.\n' +
      'Current grant: db_owner on the production database (read, write, schema modification, all ' +
      'tables).\n' +
      'Owner of record: none listed.\n' +
      'Credential: static password, last rotated unknown, set to never expire.\n\n' +
      'Which of the following are accurate concerns about this account? Select all that apply.',
    teach: {
      concept:
        '"db_owner" is a permission level on a database that grants full control over it: reading data, ' +
        'changing data, and even changing the structure of the database itself, the digital equivalent ' +
        'of a master key to an entire building rather than the one filing cabinet a job actually needs ' +
        'opened. This record shows three of the failure modes this module has covered, stacked on one ' +
        'account. The grant, db_owner, is far broader than reading sales figures and emailing a summary ' +
        'requires: the ability to write and restructure the database serves no part of the stated ' +
        'purpose. The credential is a textbook standing credential: static, never rotated, set to never ' +
        'expire. And there is no named owner, so nobody is accountable for ever noticing any of this or ' +
        'being asked to explain it.\n\n' +
        'None of these problems are excused by the job itself being harmless. An account with broad, ' +
        'unowned, never-expiring access is a good target precisely because its normal, everyday activity ' +
        'does not look unusual to anyone watching for it, which is exactly the earlier point about why ' +
        'service accounts go unreviewed for years.',
    },
    options: [
      { id: 'a', label: 'The account\'s grant, db_owner, is far broader than reading sales figures requires, and should be scoped down to read access on the relevant tables.' },
      { id: 'b', label: 'A static password set to never expire, with no known last rotation, is exactly the standing-credential risk this module describes.' },
      { id: 'c', label: 'The absence of a named owner of record means nobody is accountable for noticing if this account\'s access or activity ever needs to change.' },
      { id: 'd', label: 'Since the job\'s function, reading and reporting, is benign, the excess privilege is a low priority to fix compared to accounts used interactively by people.' },
      { id: 'e', label: 'This account is a strong candidate for replacing the static password with a vault-issued, short-lived credential and a grant limited to the specific tables the report reads.' },
    ],
    hints: [
      'Four correctly flag problems in this record. One excuses the excess privilege because the job sounds harmless.',
      'A benign purpose does not make an over-broad grant safer; it makes the account a quieter place for that grant to sit unnoticed.',
      'Look for all three failure modes this module named: privilege, credential, and ownership.',
    ],
    solution:
      'A, B, C, and E. The excessive grant, the standing-credential risk, the missing owner, and the ' +
      'vault-and-scope fix are all correct concerns. D excuses the excess privilege because the job is ' +
      'benign, which is backwards: an unowned, over-privileged, never-expiring account is a higher ' +
      'priority precisely because nothing about its routine behaviour would draw attention if it were ' +
      'misused.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'One option treats a benign job function as a reason to deprioritise fixing excessive privilege.',
      },
    ],
    debrief:
      'This record is not an unusual edge case. It is close to the typical finding in a first access ' +
      'review of service accounts almost anywhere.',
    practice: [],
  },
  {
    id: 'sef.7.5',
    moduleId: 'sef.7',
    packageId: 'security-engineering-foundations',
    order: 5,
    title: 'Explain why the credential made it worse',
    kind: 'short-answer',
    goal: 'Explain how a standing, over-scoped credential turns a single-host compromise into a larger one.',
    prompt:
      'A server used to run a nightly batch job is compromised. Investigators find it holds a static, ' +
      'never-expiring API key with broad access to a downstream payments system. In three or four ' +
      'sentences, explain why this combination turns a single-host compromise into a much larger ' +
      'problem, and what would have limited the damage.',
    teach: {
      concept:
        'A strong answer connects the credential directly to how far the attacker could actually go: ' +
        'the key is what let a break-in on one batch job server become reach into the payments system, ' +
        'rather than staying contained to that one machine, the same way a stolen master key turns a ' +
        'break-in at one office door into access to the whole building. It should name that the key\'s ' +
        'standing nature, never expiring, means it stays useful to the attacker for as long as nobody ' +
        'notices, which could be a long time on a server that mostly runs unattended overnight with no ' +
        'one watching it closely.\n\n' +
        'It should also say what would have limited the damage: a short-lived, vault-issued credential ' +
        'scoped only to what the batch job actually needs, rather than broad standing access to the ' +
        'payments system as a whole.',
    },
    hints: [
      'Name what the credential actually let the attacker reach beyond the compromised host itself.',
      'Say why "never expiring" specifically extends how long the credential stays useful once stolen.',
      'A strong answer names the fix: short-lived, vault-issued, and scoped narrowly to the job\'s actual need.',
    ],
    solution:
      'The credential is what turned a compromise of one batch job server into reach into the payments ' +
      'system, since the attacker inherited whatever access the key carried rather than being confined ' +
      'to the host itself. Because the key never expired, it stayed useful to the attacker for as long ' +
      'as nobody noticed it was stolen, which can be a long time on a server that mostly runs ' +
      'unattended overnight. A short-lived, vault-issued credential scoped only to what the batch job ' +
      'actually needs, rather than broad standing access to the whole payments system, would have ' +
      'limited both how far the attacker could reach and how long the key stayed useful.',
    expectedOutput:
      'An answer explaining that the credential extended the attacker\'s reach beyond the host, that ' +
      'its never-expiring nature extended the exposure window, and naming a scoped, short-lived, ' +
      'vaulted credential as the fix.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['reach', 'beyond', 'downstream', 'payments system', 'lateral', 'not confined to the host'],
          ['never expire', 'standing', 'long time', 'unnoticed', 'window'],
          ['short-lived', 'vault', 'scoped', 'narrow', 'limit'],
        ],
        hint:
          'Three ideas: how the credential extended the attacker\'s reach beyond the host, how never ' +
          'expiring extended the exposure window, and what a scoped, short-lived, vaulted credential ' +
          'would have done instead.',
      },
    ],
    debrief:
      'The initial break-in is rarely the whole incident. What the compromised machine was carrying in ' +
      'its configuration, a master key or a narrow one, usually decides how big the incident actually ' +
      'gets.',
    practice: [],
  },
];

// --- Module sef.8: change management and tooling at scale -----------------------

const PHASED_ROLLOUT_TEACH = {
  concept:
    'Coal miners used to carry a caged canary down into the tunnels with them. The canary was far more ' +
    'sensitive to dangerous gas than a person, so if it stopped singing or collapsed, the miners knew to ' +
    'get out before the gas reached a level that would hurt them. The canary was never meant to be a ' +
    'realistic test of the whole mine, it was a cheap, fast, disposable early warning.\n\n' +
    'A rollout of a new tool or setting across a company\'s whole fleet of machines respects scale the ' +
    'same way: it moves in stages, each one earning the next, rather than going out to everyone at once. ' +
    'A small, low-risk CANARY group goes first, chosen because problems there are easy to fix quickly, ' +
    'not because that group represents everyone else. A wider PILOT follows, deliberately including some ' +
    'of the variation the canary did not, a different office region, an older version of the operating ' +
    'system, an important but unusual application, specifically to surface edge cases before they reach ' +
    'everybody.\n\n' +
    'Only after both stages hold up without trouble does the rollout proceed to the rest of the fleet, ' +
    'usually itself in waves rather than one single push, with monitoring active throughout so a problem ' +
    'introduced by one wave gets caught before the next wave goes out, not after every wave has already ' +
    'shipped.\n\n' +
    'Every stage assumes a ROLLBACK plan, a way of undoing the change, exists and has actually been ' +
    'tested, because "we can always roll it back" is only true if someone has verified that in practice, ' +
    'on this exact deployment tooling, before relying on it in the middle of a real outage.',
} as const;

const CHANGE_MGMT_TEACH = {
  concept:
    'Think about a large shared apartment building where one resident decides, on their own, to shut ' +
    'off the water for an hour to fix a leak in their unit, without telling the building manager or ' +
    'posting a notice. Nobody else in the building knows why their taps suddenly stopped working, nobody ' +
    'had the chance to say "actually, do not do that today, we have an event downstairs," and if ' +
    'something goes wrong reconnecting the pipe, nobody else even knows there is a pipe to look at.\n\n' +
    'A CHANGE MANAGEMENT process, a defined process for scheduling and announcing a change, a fixed time ' +
    'window for making it, and a plan for telling the right people, can look like bureaucracy standing ' +
    'between a security engineer and a fix that is obviously needed. It exists because making a change ' +
    'outside that process removes the exact safeguards that catch problems before they become bigger ' +
    'ones.\n\n' +
    'Nobody outside the immediate team knew it was happening, so nobody could flag a conflicting change ' +
    'already scheduled for the same night. There was no agreed point to fall back to if something went ' +
    'wrong, because that was never discussed beforehand. And when something breaks at two in the ' +
    'morning, the people whose job it is to respond do not even know a change happened at all, which ' +
    'turns a five-minute fix into an hours-long investigation just to figure out what changed.\n\n' +
    'Security work is not exempt from this discipline just because the motivation is closing a ' +
    'vulnerability rather than shipping a new feature. If anything, an urgent security change benefits ' +
    'most from the visibility a change process provides, because it is the one most likely to be rushed.',
} as const;

const MODULE_SEF_8: Exercise[] = [
  {
    id: 'sef.8.1',
    moduleId: 'sef.8',
    packageId: 'security-engineering-foundations',
    order: 1,
    title: 'Project work at the tooling layer',
    kind: 'multiple-choice',
    goal: 'Recognise why deploying and deprecating security tooling at scale is project-based work.',
    prompt:
      'Your team is planning to deprecate an old VPN client across the estate in favour of a new ' +
      'access tool. Which of the following are accurate about this kind of work? Select all that ' +
      'apply.',
    teach: {
      concept:
        'Deploying or retiring a piece of security tooling across a large estate is planned and ' +
        'staged work, with its own timeline, distinct from the day-to-day work of responding to ' +
        'alerts. Deprecating an old tool in favour of a new one requires coordinated scheduling, since ' +
        'thousands of hosts and the people using them cannot switch simultaneously without breaking ' +
        'something for somebody.\n\n' +
        'That planning does not make the work immune from urgency. An external deadline, a vendor end-' +
        'of-life date on the old tool, an audit finding, an executive mandate after an incident, can ' +
        'compress a schedule that would otherwise have been comfortable. Part of planning at this ' +
        'scale is deciding the order in which groups of hosts receive the change, not only deciding ' +
        'what the change is.',
    },
    options: [
      { id: 'a', label: 'Deploying or replacing a security control across an estate is typically planned and staged, rather than something reacted to as it happens.' },
      { id: 'b', label: 'Deprecating an old tool across thousands of hosts requires coordinated scheduling, not a single unplanned change.' },
      { id: 'c', label: 'Because the work is planned, it is largely insulated from urgency, and pressure to move quickly is uncommon in this kind of rollout.' },
      { id: 'd', label: 'A migration off legacy infrastructure is a multi-stage project with its own timeline, distinct from the day-to-day work of responding to alerts.' },
      { id: 'e', label: 'Planning at this scale typically includes deciding the order in which groups of hosts receive the change, not just what the change is.' },
    ],
    hints: [
      'Four describe this work accurately. One assumes planned work is never under time pressure.',
      'Ask what a vendor end-of-life notice on the old tool would do to this timeline.',
      'Being planned and being unhurried are not the same thing, here any more than in module sef.1.',
    ],
    solution:
      'A, B, D, and E. Staged, coordinated, multi-stage migration work with a defined sequencing ' +
      'decision describes this accurately. C repeats the mistake from module sef.1: external pressure, ' +
      'a vendor end-of-life date, an audit, or an incident, can compress even carefully planned work.',
    expectedOutput: 'Options A, B, D, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd', 'e'],
        hint: 'One option assumes planned rollout work is rarely under external time pressure.',
      },
    ],
    debrief:
      'A vendor end-of-life date does not care that your rollout plan called for six months. Planning ' +
      'well means planning for that pressure, not assuming it away.',
    practice: [],
  },
  {
    id: 'sef.8.2',
    moduleId: 'sef.8',
    packageId: 'security-engineering-foundations',
    order: 2,
    title: 'Canary, pilot, wave, rollback',
    kind: 'multiple-choice',
    goal: 'Describe the mechanics of a phased rollout that catches problems before they reach the full estate.',
    prompt:
      'You are planning the rollout of a new EDR agent to a five-thousand-host estate. Which of the ' +
      'following are sound elements of the plan? Select all that apply.',
    teach: PHASED_ROLLOUT_TEACH,
    options: [
      { id: 'a', label: 'A small canary group, chosen for how quickly problems can be fixed rather than how representative it is, typically goes first.' },
      { id: 'b', label: 'A wider pilot stage should deliberately include some of the variation, such as older systems or different regions, that the canary did not.' },
      { id: 'c', label: 'Monitoring throughout each wave allows a problem introduced partway through the rollout to be caught before every remaining wave has already shipped.' },
      { id: 'd', label: 'A rollback plan should be tested in advance, since assuming a rollback will work during an actual outage is a risky first time to find out otherwise.' },
      { id: 'e', label: 'Once the canary group has succeeded without issue, the safest and fastest plan is to proceed directly to the full estate, since the concept has now been proven.' },
    ],
    hints: [
      'Four describe the actual stages of a careful rollout. One skips straight from the smallest stage to the largest.',
      'Ask what the canary group was actually chosen to represent, and whether it covered the estate\'s real variation.',
      'A successful canary proves the idea works somewhere. It does not prove it works everywhere.',
    ],
    solution:
      'A, B, C, and D. Canary, a deliberately varied pilot, wave-by-wave monitoring, and a tested ' +
      'rollback are the real stages. E skips the pilot stage entirely on the strength of a canary that ' +
      'was chosen for convenience, not representativeness, which is exactly the gap the pilot exists ' +
      'to close.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option skips from a successful canary straight to the full estate, without a wider pilot in between.',
      },
    ],
    debrief:
      'The canary answers "did this break immediately." The pilot answers "did this break somewhere I ' +
      'was not watching as closely." They are answering different questions, and a rollout plan needs ' +
      'both.',
    practice: [],
  },
  {
    id: 'sef.8.3',
    moduleId: 'sef.8',
    packageId: 'security-engineering-foundations',
    order: 3,
    title: 'What a clean pilot does not tell you',
    kind: 'multiple-choice',
    goal: 'Recognise the limits of a successful pilot as a predictor of full-scale rollout behaviour.',
    prompt:
      'A new hardening setting passed a fifty-host pilot with no issues. Which of the following are ' +
      'accurate about what that result does and does not tell you? Select all that apply.',
    teach: {
      concept:
        'Imagine testing a new recipe on fifty friends who all happen to like spicy food, live in the ' +
        'same city, and shop at the same well-stocked grocery store. If it goes well, that tells you ' +
        'something real: the recipe basically works. It tells you nothing about how it lands with five ' +
        'thousand people scattered everywhere, some with different tastes, some whose local store does ' +
        'not carry one of the ingredients, some who are allergic to something in it that never came up ' +
        'with your fifty friends.\n\n' +
        'A pilot group, chosen because it is convenient or already well understood, tends to be more ' +
        'uniform than the full fleet: similar hardware, similar configuration, similar patch level, ' +
        'watched closely by people who will notice quickly if something looks wrong. The full fleet ' +
        'holds the exceptions the pilot never saw: an application that only runs on an old, unsupported ' +
        'version of the operating system, a regional office on a slower internet connection where a ' +
        'large download times out, a machine configured by hand years ago that quietly diverges from ' +
        'every documented baseline.\n\n' +
        'A pilot succeeding is meaningful evidence that the basic approach works. It is not by itself ' +
        'proof that the rollout will scale without incident, because the pilot was never exposed to most ' +
        'of the variation the full fleet actually contains.',
    },
    options: [
      { id: 'a', label: 'A pilot group is often more uniform in hardware and configuration than the full estate, which can hide problems that only appear on outlier systems.' },
      { id: 'b', label: 'A slower network link at a regional site can cause a rollout step that worked fine centrally, such as a large agent download, to fail or time out.' },
      { id: 'c', label: 'Unsupported or undocumented legacy systems, common somewhere in most large estates, are exactly the systems a convenient pilot group tends to exclude.' },
      { id: 'd', label: 'A pilot succeeding is meaningful evidence that the control\'s basic approach works, but it does not by itself prove the rollout will scale without incident.' },
      { id: 'e', label: 'If a pilot runs long enough and is watched closely enough, it becomes a reliable predictor of scale-wide behaviour regardless of how representative its systems are.' },
    ],
    hints: [
      'Four describe genuine limits on what a pilot proves. One claims duration and attention can substitute for representativeness.',
      'Ask whether watching a uniform pilot group longer would ever surface a problem that only exists on a non-uniform system elsewhere.',
      'Representativeness and duration are answering different questions; watching longer does not manufacture variation that was never there.',
    ],
    solution:
      'A, B, C, and D. Pilot uniformity, network variation, excluded legacy systems, and the ' +
      'meaningful-but-incomplete nature of pilot success are all accurate. E assumes duration and ' +
      'attentiveness can substitute for actual representativeness, which they cannot: a long, closely ' +
      'watched pilot of uniform systems still tells you nothing about the outlier the pilot never ' +
      'included.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option claims a longer, more closely watched pilot can substitute for a pilot that actually included the estate\'s real variation.',
      },
    ],
    debrief:
      '"It worked in the pilot" is true and incomplete at the same time, the same way "my fifty friends ' +
      'loved the recipe" is true and incomplete. The next exercise asks you to say why out loud.',
    practice: [],
  },
  {
    id: 'sef.8.4',
    moduleId: 'sef.8',
    packageId: 'security-engineering-foundations',
    order: 4,
    title: 'Why security work still goes through change management',
    kind: 'multiple-choice',
    goal: 'Explain why urgent security changes benefit from the change process rather than bypassing it.',
    prompt:
      'A security engineer wants to push an urgent configuration fix outside the normal change window ' +
      '"because it is a security issue." Which of the following are accurate? Select all that apply.',
    teach: CHANGE_MGMT_TEACH,
    options: [
      { id: 'a', label: 'A defined change window and process gives other teams visibility to flag a conflicting change already scheduled for the same time.' },
      { id: 'b', label: 'Skipping the change process removes the agreed rollback point that a properly scheduled change would have required upfront.' },
      { id: 'c', label: 'When an unplanned change causes an incident, on-call staff who never knew the change happened lose time simply diagnosing what changed at all.' },
      { id: 'd', label: 'An urgent security fix benefits from going through the change process rather than around it, precisely because urgency is what makes it most likely to be rushed and under-tested.' },
      { id: 'e', label: 'Emergency security changes should generally bypass the standard change process, since the urgency of a security fix outweighs the value of following the same steps as a routine change.' },
    ],
    hints: [
      'Four describe why the process matters, especially under urgency. One argues urgency is a reason to skip it.',
      'Ask what happens to diagnosis time at 2am when nobody paged knew a change had happened.',
      'The process has an expedited path for genuine emergencies; skipping it entirely is different from using that path.',
    ],
    solution:
      'A, B, C, and D. Visibility, an agreed rollback point, faster diagnosis during an incident, and ' +
      'urgency itself as a reason to keep the process are all accurate. E treats urgency as a reason to ' +
      'bypass the very safeguards that matter most under time pressure, when most change processes ' +
      'have an expedited emergency path built in for exactly this situation.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option argues that urgency justifies bypassing the process rather than using an expedited path within it.',
      },
    ],
    debrief:
      'Urgent does not mean unplanned. The fastest safe path through an emergency is usually the fast-' +
      'tracked change process, not around it entirely, the same way even an urgent building repair still ' +
      'gets a notice posted before the water goes off.',
    practice: [],
  },
  {
    id: 'sef.8.5',
    moduleId: 'sef.8',
    packageId: 'security-engineering-foundations',
    order: 5,
    title: 'Respond to a rushed full rollout plan',
    kind: 'short-answer',
    goal: 'Explain the risk of skipping staged rollout after a clean pilot, and what a safer plan includes.',
    prompt:
      'A new EDR agent passed a fifty-host pilot cleanly, and a colleague wants to push it to all five ' +
      'thousand hosts in the estate this weekend. In three or four sentences, explain the risk in ' +
      'that plan and what you would do instead.',
    teach: {
      concept:
        'A strong answer names the specific gap between the pilot and the full fleet, not just a ' +
        'general caution about moving fast, in the same way the recipe-tested-on-fifty-friends example ' +
        'earlier in this module named exactly what fifty friends could not tell you. Fifty convenient ' +
        'machines are unlikely to have surfaced the legacy systems, unusual configurations, or regional ' +
        'network conditions that exist somewhere among five thousand.\n\n' +
        'It should propose the actual alternative: staged waves rather than one single push, active ' +
        'monitoring during each wave so a problem is caught before the next wave goes out, and a ' +
        'rollback plan that has been tested in advance rather than assumed to work if it is ever needed.',
    },
    hints: [
      'Name the specific reason a fifty-host pilot is not representative of a five-thousand-host estate.',
      'Propose staged waves with monitoring in between, rather than a single push.',
      'Mention that a rollback plan should be tested beforehand, not assumed to work if needed.',
    ],
    solution:
      'A clean fifty-host pilot is unlikely to have included the legacy systems, unusual ' +
      'configurations, or slow regional links that exist somewhere across five thousand hosts, so a ' +
      'result that held there does not prove it will hold everywhere. Instead of one push, I would ' +
      'roll out in staged waves, with monitoring active during each wave so a problem is caught before ' +
      'the next wave ships rather than after the whole estate has it. I would also confirm the ' +
      'rollback plan has actually been tested in advance, rather than assumed to work if something ' +
      'goes wrong this weekend.',
    expectedOutput:
      'An answer naming the pilot-versus-estate variation gap, proposing staged waves with monitoring, ' +
      'and requiring a tested rollback plan.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['not representative', 'variation', 'legacy', 'region', 'older', 'uniform'],
          ['stage', 'wave', 'phased', 'gradual', 'canary'],
          ['monitor', 'catch', 'before the next'],
          ['rollback', 'tested', 'in advance'],
        ],
        hint:
          'Four ideas: why the pilot does not prove estate-wide safety, staged waves instead of one ' +
          'push, monitoring between waves, and a rollback plan tested in advance.',
      },
    ],
    debrief:
      'The colleague is not wrong that the pilot went well. They are wrong about what a clean pilot ' +
      'actually proves, which is the whole subject this module has been building toward.',
    practice: [],
  },
];

export const SECURITY_ENGINEERING_FOUNDATIONS: LearningPackage = {
  id: 'security-engineering-foundations',
  order: 26,
  title: 'Security Engineering Foundations',
  summary:
    'Building and owning the controls other roles depend on: what distinguishes this seat from a ' +
    'SOC analyst, a GRC analyst, and an AppSec engineer; hardening a system against a CIS-style ' +
    'baseline and running an exception process that does not quietly become a permanent hole; ' +
    'segmenting a network so a compromise stays contained instead of just looking contained on a ' +
    'diagram; the architecture behind EDR, allowlisting, and least functionality; designing a ' +
    'logging pipeline that is a detection decision as much as a cost one; what TLS and encryption ' +
    'actually promise and where engineers get key management wrong; service accounts, standing ' +
    'credentials, and vaulting as an engineering discipline; and rolling a control out to thousands ' +
    'of hosts without a pilot\'s clean result becoming production\'s outage.',
  outcomes: [
    'Distinguish what a security engineer builds and owns from what a SOC analyst, a GRC analyst and an AppSec engineer each do',
    'Explain what a CIS-benchmark-style baseline actually is, and evaluate an exception request against a workable process',
    'Say why a network diagram is not proof of segmentation, and design boundaries around blast radius rather than convenience',
    'Choose an appropriate mix of EDR, allowlisting and least-functionality controls for a given system\'s role',
    'Judge what a logging pipeline should and should not collect, and explain why that choice is also a detection engineering decision',
    'State exactly what TLS protects and where it stops, and name real key management mistakes that defeat encryption anyway',
    'Explain why standing credentials on infrastructure are a liability and what a mature secrets vaulting practice does differently',
    'Plan a phased rollout of a security control across a large estate, including canary, pilot, monitoring and a tested rollback',
  ],
  /*
   * No prerequisite. This audience arrives from systems and network
   * administration rather than from another package in this catalogue, and
   * gating them behind unrelated content would turn away exactly the people
   * this track is designed to draw in. Nothing here needs a terminal, for the
   * reasons in the header comment: the skill being taught is judgement about
   * controls that do not exist as simulated infrastructure in this platform.
   */
  prerequisites: [],
  modules: [
    {
      id: 'sef.1',
      packageId: 'security-engineering-foundations',
      order: 1,
      title: 'What this seat builds',
      summary:
        'How a security engineer differs from a SOC analyst, a GRC analyst and an AppSec engineer, ' +
        'what owning a control means past the design document, the project-based rhythm of the work, ' +
        'and what background actually qualifies someone for it.',
      exercises: MODULE_SEF_1,
    },
    {
      id: 'sef.2',
      packageId: 'security-engineering-foundations',
      order: 2,
      title: 'Hardening and baselines',
      summary:
        'What a CIS-benchmark-style baseline actually is, why hardening surfaces undocumented ' +
        'dependencies on insecure defaults, and how a workable exception process keeps a judged ' +
        'accommodation from becoming a permanent, forgotten hole.',
      exercises: MODULE_SEF_2,
    },
    {
      id: 'sef.3',
      packageId: 'security-engineering-foundations',
      order: 3,
      title: 'Network segmentation',
      summary:
        'Why a flat network turns one compromised host into the whole estate, the gap between a ' +
        'segmentation diagram and enforced containment, zero trust as a design principle rather than ' +
        'a marketing label, and designing boundaries around blast radius.',
      exercises: MODULE_SEF_3,
    },
    {
      id: 'sef.4',
      packageId: 'security-engineering-foundations',
      order: 4,
      title: 'Endpoint security architecture',
      summary:
        'EDR against traditional antivirus at a conceptual level, allowlisting against blocklisting ' +
        'and why the stronger control is the harder one to deploy, the principle of least ' +
        'functionality, and matching a control mix to a system\'s actual role.',
      exercises: MODULE_SEF_4,
    },
    {
      id: 'sef.5',
      packageId: 'security-engineering-foundations',
      order: 5,
      title: 'Logging pipeline design',
      summary:
        'What to collect against what merely feels thorough, the financial and signal cost of ' +
        'ingesting everything, why a collection decision is quietly a detection engineering decision, ' +
        'and tiering retention to how a source is actually used.',
      exercises: MODULE_SEF_5,
    },
    {
      id: 'sef.6',
      packageId: 'security-engineering-foundations',
      order: 6,
      title: 'Applied cryptography for engineers',
      summary:
        'What TLS actually protects and where it stops, why "we use encryption" is not a complete ' +
        'answer, the mundane key management mistakes that actually cause incidents, and what "do not ' +
        'roll your own crypto" precisely does and does not mean.',
      exercises: MODULE_SEF_6,
    },
    {
      id: 'sef.7',
      packageId: 'security-engineering-foundations',
      order: 7,
      title: 'Identity and secrets in infrastructure',
      summary:
        'Service accounts and machine identity, why standing credentials on infrastructure are a ' +
        'liability, and secrets vaulting as an engineering discipline of dynamic secrets, access ' +
        'control and rotation rather than a compliance checkbox.',
      exercises: MODULE_SEF_7,
    },
    {
      id: 'sef.8',
      packageId: 'security-engineering-foundations',
      order: 8,
      title: 'Change management and tooling at scale',
      summary:
        'Why this seat\'s work is project-based rather than reactive, the mechanics of a phased ' +
        'rollout, what a clean pilot fails to predict at scale, and why urgent security work still ' +
        'goes through change management rather than around it.',
      exercises: MODULE_SEF_8,
    },
  ],
};
